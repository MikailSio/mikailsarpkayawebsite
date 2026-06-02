window.HF_L9 = {
en: `<p class="l-text"><strong>Inference, not training, is where most LLM dollars are spent.</strong> A research lab might train a 70B model once; users will hit the resulting endpoint a billion times. The serving runtime decides whether you spend $0.001 or $0.01 per request — a 10x difference that compounds to millions in production. In 2026 there are three serious open-source contenders: vLLM, TGI (Text Generation Inference), and SGLang. They share core ideas (PagedAttention, continuous batching) and differ on the margin (speculative decoding, structured-output, multi-LoRA).</p>

<p class="l-text">In this lesson we'll explain the two ideas that revolutionized LLM serving — <strong>PagedAttention</strong> and <strong>continuous batching</strong> — derive why they each multiply throughput by 5-20x, walk through speculative decoding, and finish with a concrete decision tree for picking vLLM vs TGI vs SGLang in 2026. Every concept gets a runnable Pyodide demo: a hand-built KV cache and a batch-scheduler simulation that shows where the wins come from.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Why naive batched generation wastes 60-80% of GPU memory</li>
<li>PagedAttention: KV cache as virtual-memory blocks (Kwon 2023)</li>
<li>Continuous (a.k.a. iteration-level) batching vs static batching</li>
<li>Speculative decoding: draft model + verifier for 2-3x latency wins</li>
<li>vLLM vs TGI vs SGLang — feature matrix and decision tree</li>
<li>How to tune throughput, latency, and memory for a real workload</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The KV Cache Problem</h2>
<p class="l-text">Generating token <code>t</code> requires attending to all previous tokens, which means recomputing keys and values for tokens <code>1..t-1</code> on every step — unless you cache them. Every production engine caches K and V; the question is <em>how</em>. The naive way pre-allocates a contiguous buffer of <code>max_seq_len</code> per request, which leaks memory whenever a sequence finishes early.</p>

<div class="katex-block">$$\\text{KV per request} = 2 \\cdot L_{\\text{layers}} \\cdot H_{\\text{heads}} \\cdot D_{\\text{head}} \\cdot T_{\\text{tokens}} \\cdot \\text{bytes}_{\\text{dtype}}$$</div>

<p class="l-text">For Llama-7B (32 layers, 32 heads, 128 dim, bf16) at 2048 tokens per request: <strong>2 GB per request</strong>. Pre-allocate for batch=16 and you've burned 32 GB before generating a single token. Most of it stays unused because real sequences finish in 50-500 tokens, not 2048.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naive static batching</div><div class="card-body">Allocate (batch, max_seq_len) up front. Internal fragmentation: 60-80% of allocated KV is never used.</div></div>
<div class="calc-card"><div class="card-title">External fragmentation</div><div class="card-body">Even if requests differ by 100 tokens, you pad to the longest. The whole batch waits for the slowest.</div></div>
<div class="calc-card"><div class="card-title">PagedAttention</div><div class="card-body">Allocate KV in fixed-size <em>blocks</em> (typically 16 tokens). Per-request "page table" maps logical positions to physical blocks. Borrowed straight from OS virtual memory.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. PagedAttention From Scratch</h2>
<p class="l-text">The clearest way to understand PagedAttention: build it. Below we manage a KV cache as a dictionary of fixed-size blocks, allocate on demand as sequences grow, and free blocks when sequences finish. This is exactly what vLLM does — minus the CUDA kernel that fuses lookup and attention.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

BLOCK_SIZE = <span class="num">4</span>         <span class="cm"># tokens per block (vLLM uses 16; we use 4 for clarity)</span>
HEAD_DIM   = <span class="num">8</span>

<span class="kw">class</span> BlockPool:
    <span class="str">"""Free-list allocator over fixed-size KV blocks."""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, n_blocks):
        <span class="cm"># each block holds BLOCK_SIZE x HEAD_DIM K and V tensors</span>
        <span class="kw">self</span>.K = np.<span class="fn">zeros</span>((n_blocks, BLOCK_SIZE, HEAD_DIM), dtype=np.float32)
        <span class="kw">self</span>.V = np.<span class="fn">zeros</span>((n_blocks, BLOCK_SIZE, HEAD_DIM), dtype=np.float32)
        <span class="kw">self</span>.free = <span class="fn">list</span>(<span class="fn">range</span>(n_blocks))
    <span class="kw">def</span> <span class="fn">alloc</span>(<span class="kw">self</span>):
        <span class="kw">return</span> <span class="kw">self</span>.free.<span class="fn">pop</span>() <span class="kw">if</span> <span class="kw">self</span>.free <span class="kw">else</span> <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">release</span>(<span class="kw">self</span>, idx):
        <span class="kw">self</span>.free.<span class="fn">append</span>(idx)
    <span class="kw">def</span> <span class="fn">stats</span>(<span class="kw">self</span>):
        <span class="kw">return</span> f<span class="str">"used={len(self.K)-len(self.free)}/{len(self.K)}"</span>

<span class="kw">class</span> PagedSequence:
    <span class="str">"""A single in-flight request with its page table."""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, req_id, pool):
        <span class="kw">self</span>.req_id = req_id
        <span class="kw">self</span>.pool = pool
        <span class="kw">self</span>.page_table = []         <span class="cm"># list of physical block indices</span>
        <span class="kw">self</span>.length = <span class="num">0</span>
    <span class="kw">def</span> <span class="fn">append_token</span>(<span class="kw">self</span>, k_vec, v_vec):
        <span class="kw">if</span> <span class="kw">self</span>.length % BLOCK_SIZE == <span class="num">0</span>:
            blk = <span class="kw">self</span>.pool.<span class="fn">alloc</span>()
            <span class="kw">if</span> blk <span class="kw">is</span> <span class="kw">None</span>:
                <span class="kw">raise</span> <span class="fn">MemoryError</span>(f<span class="str">"OOM allocating for req {self.req_id}"</span>)
            <span class="kw">self</span>.page_table.<span class="fn">append</span>(blk)
        blk = <span class="kw">self</span>.page_table[-<span class="num">1</span>]
        slot = <span class="kw">self</span>.length % BLOCK_SIZE
        <span class="kw">self</span>.pool.K[blk, slot] = k_vec
        <span class="kw">self</span>.pool.V[blk, slot] = v_vec
        <span class="kw">self</span>.length += <span class="num">1</span>
    <span class="kw">def</span> <span class="fn">free</span>(<span class="kw">self</span>):
        <span class="kw">for</span> blk <span class="kw">in</span> <span class="kw">self</span>.page_table: <span class="kw">self</span>.pool.<span class="fn">release</span>(blk)
        <span class="kw">self</span>.page_table.<span class="fn">clear</span>()

<span class="cm"># Simulate 4 requests of varying length, all sharing one pool</span>
pool = <span class="fn">BlockPool</span>(n_blocks=<span class="num">10</span>)
reqs = [<span class="fn">PagedSequence</span>(i, pool) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>)]
target_lens = [<span class="num">3</span>, <span class="num">7</span>, <span class="num">12</span>, <span class="num">5</span>]

<span class="kw">for</span> r, tlen <span class="kw">in</span> <span class="fn">zip</span>(reqs, target_lens):
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(tlen):
        k = np.random.<span class="fn">randn</span>(HEAD_DIM); v = np.random.<span class="fn">randn</span>(HEAD_DIM)
        r.<span class="fn">append_token</span>(k, v)
    <span class="fn">print</span>(f<span class="str">"req {r.req_id}: len={r.length:2d}  pages={r.page_table}  pool {pool.stats()}"</span>)

<span class="cm"># Free a long one and confirm blocks return to the pool</span>
<span class="fn">print</span>(<span class="str">"\\nbefore free, pool"</span>, pool.<span class="fn">stats</span>())
reqs[<span class="num">2</span>].<span class="fn">free</span>()
<span class="fn">print</span>(<span class="str">"after  free, pool"</span>, pool.<span class="fn">stats</span>())
</code></pre></div>

<p class="l-text"><strong>How this code works:</strong> we declare a fixed-size <code>BlockPool</code> that owns the K and V tensors as a (n_blocks, BLOCK_SIZE, HEAD_DIM) array plus a free-list. Each <code>PagedSequence</code> only stores indices into that pool, not raw tensors. <code>append_token</code> grows the per-request page table one block at a time whenever the current block fills up — there is no pre-allocation. We then push 3, 7, 12 and 5 tokens into four requests and watch the pool fill from below; calling <code>free</code> on the longest sequence returns its 3 blocks to the free-list immediately, so the next request can reuse them. Compare against the naive design where each request would have grabbed <code>max_seq_len/BLOCK_SIZE</code> blocks up front.</p>


<div class="calc-highlight">Notice that req 1 (length 7) used 2 blocks, req 2 (length 12) used 3 blocks, etc. There is no internal fragmentation past the last block, and freed blocks are immediately reusable. That is the whole win — and it routinely doubles or triples effective throughput on real workloads.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Continuous Batching</h2>
<p class="l-text">Static batching: collect 16 requests, run them together until <em>all</em> finish, then start the next batch. Problem: the longest sequence holds the GPU hostage. <strong>Continuous batching</strong> (also called iteration-level batching) replaces finished sequences with new ones every decode step. The GPU stays at high utilization; new requests start within milliseconds instead of waiting for the slowest in the batch to finish.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Simulate a steady stream of requests with varied output lengths</span>
BATCH_SIZE = <span class="num">4</span>
N_REQUESTS = <span class="num">20</span>
out_lens = rng.<span class="fn">integers</span>(<span class="num">5</span>, <span class="num">50</span>, N_REQUESTS)

<span class="kw">def</span> <span class="fn">static_batching</span>():
    <span class="str">"""Wait for the whole batch to finish before starting the next."""</span>
    total_steps = <span class="num">0</span>
    <span class="kw">for</span> batch_start <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, N_REQUESTS, BATCH_SIZE):
        batch = out_lens[batch_start:batch_start+BATCH_SIZE]
        total_steps += <span class="fn">int</span>(batch.<span class="fn">max</span>())   <span class="cm"># longest in batch dominates</span>
    <span class="kw">return</span> total_steps

<span class="kw">def</span> <span class="fn">continuous_batching</span>():
    <span class="str">"""Replace finished sequences with new ones every step."""</span>
    arrival_idx = <span class="num">0</span>
    in_flight = []           <span class="cm"># remaining tokens for each slot</span>
    <span class="cm"># fill initial batch</span>
    <span class="kw">while</span> <span class="fn">len</span>(in_flight) &lt; BATCH_SIZE <span class="kw">and</span> arrival_idx &lt; N_REQUESTS:
        in_flight.<span class="fn">append</span>(<span class="fn">int</span>(out_lens[arrival_idx])); arrival_idx += <span class="num">1</span>

    steps = <span class="num">0</span>
    <span class="kw">while</span> in_flight:
        <span class="cm"># one decode step: every in-flight slot generates one token</span>
        in_flight = [t - <span class="num">1</span> <span class="kw">for</span> t <span class="kw">in</span> in_flight]
        steps += <span class="num">1</span>
        <span class="cm"># remove finished, refill from queue</span>
        in_flight = [t <span class="kw">for</span> t <span class="kw">in</span> in_flight <span class="kw">if</span> t &gt; <span class="num">0</span>]
        <span class="kw">while</span> <span class="fn">len</span>(in_flight) &lt; BATCH_SIZE <span class="kw">and</span> arrival_idx &lt; N_REQUESTS:
            in_flight.<span class="fn">append</span>(<span class="fn">int</span>(out_lens[arrival_idx])); arrival_idx += <span class="num">1</span>
    <span class="kw">return</span> steps

s_static = <span class="fn">static_batching</span>()
s_cont   = <span class="fn">continuous_batching</span>()
<span class="fn">print</span>(f<span class="str">"static     : {s_static} GPU steps"</span>)
<span class="fn">print</span>(f<span class="str">"continuous : {s_cont} GPU steps"</span>)
<span class="fn">print</span>(f<span class="str">"speedup    : {s_static/s_cont:.2f}x"</span>)
<span class="fn">print</span>(f<span class="str">"theoretical lower bound (sum of all lens / batch): {out_lens.sum()/BATCH_SIZE:.1f}"</span>)
</code></pre></div>

<p class="l-text">In practice continuous batching is 1.5-3x faster end-to-end on production workloads. Combined with PagedAttention you typically see 5-20x throughput vs naive HuggingFace generate.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Speculative Decoding</h2>
<p class="l-text">Decoding is autoregressive — token N+1 depends on token N — which means you can't parallelize across tokens for a single sequence. <strong>Speculative decoding</strong> (Leviathan 2023) gets around this with a clever trick: a small <em>draft</em> model proposes K tokens in a batch; the big <em>verifier</em> model checks all K in a single forward pass; accepted tokens are committed, the first rejected token is corrected. Best case: K-1 free tokens per verifier call.</p>

<div class="katex-block">$$E[\\text{accepted}] = \\sum_{k=0}^{K-1} \\alpha^{k+1} \\quad\\text{where }\\alpha = P(\\text{draft agrees with target})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

K = <span class="num">4</span>                  <span class="cm"># draft length per round</span>
n_steps = <span class="num">200</span>          <span class="cm"># we want this many accepted tokens</span>

<span class="kw">def</span> <span class="fn">expected_acceptances</span>(alpha, K):
    <span class="str">""</span>"E[<span class="cm"># accepted in one round] given per-token agreement prob alpha."""</span>
    <span class="kw">return</span> <span class="fn">sum</span>(alpha**(k+<span class="num">1</span>) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K))

<span class="cm"># Sweep agreement rates</span>
<span class="kw">for</span> alpha <span class="kw">in</span> [<span class="num">0.3</span>, <span class="num">0.5</span>, <span class="num">0.7</span>, <span class="num">0.85</span>, <span class="num">0.95</span>]:
    E_per_round = <span class="fn">expected_acceptances</span>(alpha, K)
    rounds = n_steps / <span class="fn">max</span>(E_per_round, <span class="num">1e-9</span>)
    speedup_vs_baseline = n_steps / rounds   <span class="cm"># 1 verifier call per round</span>
    <span class="fn">print</span>(f<span class="str">"alpha={alpha:.2f}  E[acc]/round={E_per_round:.2f}  "</span>
          f<span class="str">"speedup vs naive: {speedup_vs_baseline:.2f}x"</span>)

<span class="cm"># Monte-Carlo simulate one full decode for alpha=0.7, K=4</span>
<span class="kw">def</span> <span class="fn">simulate</span>(alpha, K, target):
    accepted, rounds = <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">while</span> accepted &lt; target:
        rounds += <span class="num">1</span>
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K):
            <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; alpha:
                accepted += <span class="num">1</span>
                <span class="kw">if</span> accepted &gt;= target: <span class="kw">break</span>
            <span class="kw">else</span>:
                accepted += <span class="num">1</span>   <span class="cm"># the verifier correction also yields one token</span>
                <span class="kw">break</span>
    <span class="kw">return</span> rounds

rounds = <span class="fn">simulate</span>(<span class="num">0.7</span>, <span class="num">4</span>, n_steps)
<span class="fn">print</span>(f<span class="str">"\\nMC simulation: {rounds} verifier calls for {n_steps} tokens "</span>
      f<span class="str">"(speedup {n_steps/rounds:.2f}x)"</span>)
</code></pre></div>

<p class="l-text"><strong>How this code works:</strong> the closed-form expression <code>E[acc] = alpha + alpha^2 + ... + alpha^K</code> tells you how many tokens, on average, one verifier call commits. We sweep alpha from 0.3 (a weak drafter) to 0.95 (almost-perfect agreement) and read off the speedup directly: at alpha=0.7, K=4 you commit ~2.1 tokens per call instead of 1, a 2.1x speedup. The Monte-Carlo simulation then plays out a full 200-token generation: at each round we sample K draft tokens, accept until a rejection, and the verifier's correction also yields one token. Counting verifier calls confirms the closed-form expectation within sampling noise.</p>


<div class="calc-highlight">In production with a well-chosen draft model (e.g., a 1B drafting for a 70B), alpha is typically 0.6-0.8 and you measure 1.8-2.5x latency reduction. The verifier still does the same number of FLOPs per call; you just amortize them across more output tokens.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. vLLM in Practice</h2>
<p class="l-text"><strong>vLLM</strong> (UC Berkeley, Kwon et al. 2023) is the reference implementation of PagedAttention and continuous batching, and the default choice for high-throughput open-source serving in 2026. The Python API is intentionally minimal.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — vllm)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> vllm <span class="kw">import</span> LLM, SamplingParams

llm = <span class="fn">LLM</span>(
    model=<span class="str">"meta-llama/Llama-2-7b-chat-hf"</span>,
    tensor_parallel_size=<span class="num">2</span>,            <span class="cm"># split across 2 GPUs</span>
    gpu_memory_utilization=<span class="num">0.90</span>,       <span class="cm"># how much VRAM vLLM may claim</span>
    max_model_len=<span class="num">4096</span>,
    enable_prefix_caching=<span class="kw">True</span>,        <span class="cm"># huge win for chat with shared system prompt</span>
    enable_chunked_prefill=<span class="kw">True</span>,       <span class="cm"># smooth prefill latency</span>
)

sampling = <span class="fn">SamplingParams</span>(temperature=<span class="num">0.7</span>, top_p=<span class="num">0.9</span>, max_tokens=<span class="num">512</span>)

prompts = [<span class="str">"Explain attention in one paragraph."</span>,
           <span class="str">"Write a haiku about KV caches."</span>,
           <span class="str">"What is PagedAttention?"</span>]

outputs = llm.<span class="fn">generate</span>(prompts, sampling)
<span class="kw">for</span> out <span class="kw">in</span> outputs:
    <span class="fn">print</span>(out.prompt[:<span class="num">40</span>], <span class="str">"->"</span>, out.outputs[<span class="num">0</span>].text[:<span class="num">80</span>])

<span class="cm"># Production: the OpenAI-compatible HTTP server</span>
<span class="cm"># python -m vllm.entrypoints.openai.api_server \\</span>
<span class="cm">#   --model meta-llama/Llama-2-7b-chat-hf \\</span>
<span class="cm">#   --tensor-parallel-size 2 \\</span>
<span class="cm">#   --enable-prefix-caching</span>
</code></pre></div>

<p class="l-text">Two flags worth highlighting. <code>enable_prefix_caching</code> reuses KV blocks across requests that share a prefix (e.g., the same system prompt) — typically 2-3x throughput in chat workloads. <code>enable_chunked_prefill</code> interleaves prefill and decode so a long prompt doesn't stall short ones — major TTFT improvement.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. TGI &amp; SGLang — The Alternatives</h2>
<p class="l-text"><strong>TGI</strong> (HuggingFace's Text Generation Inference) and <strong>SGLang</strong> (LMSYS, Liu 2024) are the other two production-grade open servers in 2026. They overlap on basics; the differentiation is on the margins.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">vLLM</div><div class="card-body">Best raw throughput on standard chat / completion workloads. Largest community. Multi-LoRA serving. OpenAI-compatible HTTP. Default in most stacks.</div></div>
<div class="calc-card"><div class="card-title">TGI</div><div class="card-body">First-class HuggingFace ecosystem integration. Tightest integration with the HF Hub for model loading and quant configs. AWQ/GPTQ/Marlin built-in.</div></div>
<div class="calc-card"><div class="card-title">SGLang</div><div class="card-body">Best for structured outputs (JSON schema, regex constraints) and complex programs (multi-turn, branching). RadixAttention reuses prefixes more aggressively than vLLM.</div></div>
<div class="calc-card"><div class="card-title">TensorRT-LLM</div><div class="card-body">NVIDIA's first-party. Highest single-stream latency on H100 if you tolerate the build complexity. Closed source kernels.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — TGI &amp; SGLang)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># --- TGI ---</span>
docker run --gpus <span class="fn">all</span> --shm-size 1g -p <span class="num">8080</span>:<span class="num">80</span> \\
  ghcr.io/huggingface/text-generation-inference:latest \\
  --model-id meta-llama/Llama-<span class="num">2</span>-7b-chat-hf \\
  --quantize awq \\
  --<span class="fn">max</span>-batch-prefill-tokens <span class="num">4096</span> \\
  --<span class="fn">max</span>-<span class="fn">input</span>-length <span class="num">2048</span> \\
  --<span class="fn">max</span>-total-tokens <span class="num">4096</span>

<span class="cm"># --- SGLang ---</span>
python -m sglang.launch_server \\
  --model-path meta-llama/Llama-<span class="num">2</span>-7b-chat-hf \\
  --port <span class="num">30000</span> \\
  --enable-torch-compile \\
  --schedule-policy lpm        <span class="cm"># longest-prefix-match, the RadixAttention scheduler</span>
</code></pre></div>

<p class="l-text"><strong>How these commands differ:</strong> the TGI line spins up a Docker container that ships the HF Hub credentials, AWQ kernels and the OpenAI-compatible router in one image — perfect when you live in the HF ecosystem and want one binary. SGLang launches as a Python process so you can hot-swap the scheduler (<code>lpm</code> picks the longest-prefix-match path through the radix tree, which is what makes shared system prompts cheap). Both speak the OpenAI API on the wire, so swapping serving stacks does not change your client code.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Throughput vs Latency Tuning</h2>
<p class="l-text">Two workloads, two different optimization targets. A chatbot cares about <em>time-to-first-token</em> (TTFT) and inter-token latency. A batch summarization job cares only about tokens-per-second across the whole queue. The flags you turn pull in opposite directions.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Throughput-first</div><div class="card-body">Larger batches, higher <code>max_num_seqs</code>, larger <code>max_num_batched_tokens</code>, prefix caching ON. Accept higher TTFT.</div></div>
<div class="calc-card"><div class="card-title">Latency-first</div><div class="card-body">Smaller batches, chunked prefill ON, speculative decoding with a small draft, possibly tensor-parallel for single-stream speedup. Accept lower throughput.</div></div>
<div class="calc-card"><div class="card-title">Balanced</div><div class="card-body">Both flags ON, tune <code>max_num_batched_tokens</code> to ~2-4x your typical request size. Profile with realistic traffic.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Simple throughput model: throughput = batch * tokens_per_step / step_time</span>
<span class="cm"># step_time grows roughly linearly with batch (memory-bandwidth-bound on GPU)</span>
<span class="kw">def</span> <span class="fn">throughput</span>(batch, step_time_per_seq_ms=<span class="num">10</span>, step_time_overhead_ms=<span class="num">2</span>):
    step_time = step_time_overhead_ms + batch * step_time_per_seq_ms
    <span class="kw">return</span> batch * <span class="num">1000</span> / step_time   <span class="cm"># tokens/sec</span>

<span class="kw">def</span> <span class="fn">ttft</span>(prefill_tokens, batch, prefill_throughput=<span class="num">2000</span>):
    <span class="str">"""Crude TTFT estimate: prefill_tokens * batch / throughput."""</span>
    <span class="kw">return</span> prefill_tokens * batch * <span class="num">1000</span> / prefill_throughput

<span class="fn">print</span>(<span class="str">"batch  throughput(tok/s)   TTFT@512(ms)"</span>)
<span class="kw">for</span> b <span class="kw">in</span> [<span class="num">1</span>, <span class="num">4</span>, <span class="num">16</span>, <span class="num">64</span>, <span class="num">256</span>]:
    <span class="fn">print</span>(f<span class="str">"  {b:3d}        {throughput(b):8.1f}      {ttft(512, b):8.1f}"</span>)
</code></pre></div>

<p class="l-text"><strong>How this code works:</strong> the <code>throughput</code> function captures the first-order GPU model — per-step latency has a small per-call overhead plus a linear-in-batch component (since attention is memory-bandwidth-bound), so throughput rises sub-linearly with batch. The <code>ttft</code> function models prefill: at fixed prefill throughput, doubling the batch doubles the time the first token has to wait. The loop sweeps batch sizes 1, 4, 16, 64, 256 and prints both numbers side-by-side — this is the exact table you would build for any new model to find the throughput/TTFT knee for your workload.</p>


<div class="calc-highlight">Notice the diminishing throughput returns past batch ~64 and the linear TTFT growth. There is a sweet spot per workload — find it by replaying real traffic, not by guessing.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The 2026 Decision Tree</h2>
<p class="l-text">A practical recipe for picking a serving stack. Walk it top-down; the first match is usually the right answer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Single-tenant chat, max throughput</div><div class="card-body">vLLM with prefix caching ON.</div></div>
<div class="calc-card"><div class="card-title">Multi-tenant with per-customer fine-tunes</div><div class="card-body">vLLM or LoRAX with multi-LoRA serving. One base, dozens of adapters.</div></div>
<div class="calc-card"><div class="card-title">Strict JSON / structured output</div><div class="card-body">SGLang. Its constrained-decoding implementation is the strongest in OSS.</div></div>
<div class="calc-card"><div class="card-title">HuggingFace-native deployment</div><div class="card-body">TGI. Cleanest integration with the HF model card / quant configs.</div></div>
<div class="calc-card"><div class="card-title">Lowest single-stream latency on H100</div><div class="card-body">TensorRT-LLM if you can pay the build complexity; vLLM with speculative decoding otherwise.</div></div>
<div class="calc-card"><div class="card-title">Edge / single-user</div><div class="card-body">llama.cpp or MLC-LLM. Different category — CPU/Apple Silicon/WebGPU.</div></div>
</div>

<p class="l-text">A useful piece of intuition: PagedAttention + continuous batching converted LLM serving from "embarrassingly memory-bound" to "compute-bound under realistic loads". Once you understand the OS-style virtual-memory analogy in section 2, the rest of the field's progress is just better schedulers and better quantization on top.</p>
</div>
`,
tr: `<p class="l-text"><strong>Çoğu LLM dolarının harcandığı yer eğitim değil, çıkarımdır.</strong> Bir araştırma laboratuvarı 70B modeli bir kez eğitebilir; kullanıcılar ortaya çıkan endpoint'e milyar kez vurur. Sunum çalışma zamanı, istek başına 0.001 mı yoksa 0.01 mı harcadığına karar verir — üretimde milyonlara katlanan 10x'lik bir fark. 2026'da üç ciddi açık kaynak rakibi var: vLLM, TGI (Text Generation Inference) ve SGLang. Çekirdek fikirleri (PagedAttention, sürekli batching) paylaşırlar ve marjda farklılaşırlar (spekülatif kod çözme, yapılandırılmış çıktı, multi-LoRA).</p>

<p class="l-text">Bu derste LLM sunumunu devrimleştiren iki fikri açıklayacağız — <strong>PagedAttention</strong> ve <strong>sürekli batching</strong> — neden her birinin throughput'u 5-20x katladığını türetip spekülatif kod çözmeyi yürüyecek ve 2026'da vLLM vs TGI vs SGLang seçimi için somut bir karar ağacıyla bitireceğiz. Her kavramın çalıştırılabilir Pyodide demosu var: elle inşa edilmiş bir KV cache ve kazançların nereden geldiğini gösteren bir batch-zamanlayıcı simülasyonu.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Naif batched üretimin neden GPU belleğinin %60-80'ini boşa harcadığı</li>
<li>PagedAttention: KV cache'i sanal-bellek blokları olarak (Kwon 2023)</li>
<li>Sürekli (yani iterasyon-seviyeli) batching vs statik batching</li>
<li>Spekülatif kod çözme: 2-3x gecikme kazanımı için draft model + doğrulayıcı</li>
<li>vLLM vs TGI vs SGLang — özellik matrisi ve karar ağacı</li>
<li>Gerçek bir iş yükü için throughput, gecikme ve belleği nasıl ayarlayacağın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. KV Cache Problemi</h2>
<p class="l-text"><code>t</code> token'ını üretmek, önceki tüm token'lara dikkat etmeyi gerektirir, bu da her adımda <code>1..t-1</code> token'ları için key ve value'ları yeniden hesaplamak demektir — onları cache'lemediğin sürece. Her üretim motoru K ve V'yi cache'ler; soru <em>nasıl</em>. Naif yöntem her istek için <code>max_seq_len</code> boyutunda bitişik bir tampon önceden ayırır; bu da bir dizi erken bittiğinde bellek sızdırır.</p>

<div class="katex-block">$$\\text{KV per request} = 2 \\cdot L_{\\text{layers}} \\cdot H_{\\text{heads}} \\cdot D_{\\text{head}} \\cdot T_{\\text{tokens}} \\cdot \\text{bytes}_{\\text{dtype}}$$</div>

<p class="l-text">Llama-7B (32 katman, 32 head, 128 boyut, bf16) için istek başına 2048 token: <strong>istek başına 2 GB</strong>. batch=16 için önceden ayırırsan tek bir token üretmeden 32 GB yakmışsın olursun. Çoğu kullanılmadan kalır çünkü gerçek diziler 2048 değil 50-500 token içinde biter.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naif statik batching</div><div class="card-body">Önden (batch, max_seq_len) ayır. İç parçalanma: ayrılan KV'nin %60-80'i hiç kullanılmaz.</div></div>
<div class="calc-card"><div class="card-title">Dış parçalanma</div><div class="card-body">İstekler 100 token farklı olsa bile en uzuna pad uygulanır. Tüm batch en yavaşı bekler.</div></div>
<div class="calc-card"><div class="card-title">PagedAttention</div><div class="card-body">KV'yi sabit boyutlu <em>bloklar</em> hâlinde ayır (tipik 16 token). İstek başına "sayfa tablosu" mantıksal pozisyonları fiziksel bloklara eşler. Doğrudan OS sanal belleğinden ödünç alınmıştır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Sıfırdan PagedAttention</h2>
<p class="l-text">PagedAttention'ı anlamanın en net yolu: inşa et. Aşağıda KV cache'i sabit boyutlu bloklardan oluşan bir sözlük olarak yönetiyoruz, diziler büyüdükçe talebe göre ayırıyoruz ve diziler bittiğinde blokları serbest bırakıyoruz. vLLM tam olarak bunu yapıyor — arama ile attention'ı kaynaştıran CUDA çekirdeği hariç.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

BLOCK_SIZE = <span class="num">4</span>         <span class="cm"># blok başına token (vLLM 16 kullanır; netlik için 4 kullanıyoruz)</span>
HEAD_DIM   = <span class="num">8</span>

<span class="kw">class</span> BlockPool:
    <span class="str">"""Sabit boyutlu KV blokları üzerinde free-list ayırıcı."""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, n_blocks):
        <span class="cm"># her blok BLOCK_SIZE x HEAD_DIM K ve V tensörleri tutar</span>
        <span class="kw">self</span>.K = np.<span class="fn">zeros</span>((n_blocks, BLOCK_SIZE, HEAD_DIM), dtype=np.float32)
        <span class="kw">self</span>.V = np.<span class="fn">zeros</span>((n_blocks, BLOCK_SIZE, HEAD_DIM), dtype=np.float32)
        <span class="kw">self</span>.free = <span class="fn">list</span>(<span class="fn">range</span>(n_blocks))
    <span class="kw">def</span> <span class="fn">alloc</span>(<span class="kw">self</span>):
        <span class="kw">return</span> <span class="kw">self</span>.free.<span class="fn">pop</span>() <span class="kw">if</span> <span class="kw">self</span>.free <span class="kw">else</span> <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">release</span>(<span class="kw">self</span>, idx):
        <span class="kw">self</span>.free.<span class="fn">append</span>(idx)
    <span class="kw">def</span> <span class="fn">stats</span>(<span class="kw">self</span>):
        <span class="kw">return</span> f<span class="str">"kullanılan={len(self.K)-len(self.free)}/{len(self.K)}"</span>

<span class="kw">class</span> PagedSequence:
    <span class="str">"""Sayfa tablosuyla birlikte uçuştaki tek bir istek."""</span>
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, req_id, pool):
        <span class="kw">self</span>.req_id = req_id
        <span class="kw">self</span>.pool = pool
        <span class="kw">self</span>.page_table = []         <span class="cm"># fiziksel blok indekslerinin listesi</span>
        <span class="kw">self</span>.length = <span class="num">0</span>
    <span class="kw">def</span> <span class="fn">append_token</span>(<span class="kw">self</span>, k_vec, v_vec):
        <span class="kw">if</span> <span class="kw">self</span>.length % BLOCK_SIZE == <span class="num">0</span>:
            blk = <span class="kw">self</span>.pool.<span class="fn">alloc</span>()
            <span class="kw">if</span> blk <span class="kw">is</span> <span class="kw">None</span>:
                <span class="kw">raise</span> <span class="fn">MemoryError</span>(f<span class="str">"req {self.req_id} için OOM ayırma"</span>)
            <span class="kw">self</span>.page_table.<span class="fn">append</span>(blk)
        blk = <span class="kw">self</span>.page_table[-<span class="num">1</span>]
        slot = <span class="kw">self</span>.length % BLOCK_SIZE
        <span class="kw">self</span>.pool.K[blk, slot] = k_vec
        <span class="kw">self</span>.pool.V[blk, slot] = v_vec
        <span class="kw">self</span>.length += <span class="num">1</span>
    <span class="kw">def</span> <span class="fn">free</span>(<span class="kw">self</span>):
        <span class="kw">for</span> blk <span class="kw">in</span> <span class="kw">self</span>.page_table: <span class="kw">self</span>.pool.<span class="fn">release</span>(blk)
        <span class="kw">self</span>.page_table.<span class="fn">clear</span>()

<span class="cm"># Aynı havuzu paylaşan farklı uzunlukta 4 isteği simüle et</span>
pool = <span class="fn">BlockPool</span>(n_blocks=<span class="num">10</span>)
reqs = [<span class="fn">PagedSequence</span>(i, pool) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">4</span>)]
target_lens = [<span class="num">3</span>, <span class="num">7</span>, <span class="num">12</span>, <span class="num">5</span>]

<span class="kw">for</span> r, tlen <span class="kw">in</span> <span class="fn">zip</span>(reqs, target_lens):
    <span class="kw">for</span> t <span class="kw">in</span> <span class="fn">range</span>(tlen):
        k = np.random.<span class="fn">randn</span>(HEAD_DIM); v = np.random.<span class="fn">randn</span>(HEAD_DIM)
        r.<span class="fn">append_token</span>(k, v)
    <span class="fn">print</span>(f<span class="str">"req {r.req_id}: uzunluk={r.length:2d}  sayfalar={r.page_table}  havuz {pool.stats()}"</span>)

<span class="cm"># Uzun olanı serbest bırak ve blokların havuza döndüğünü doğrula</span>
<span class="fn">print</span>(<span class="str">"\\nserbest bırakmadan önce, havuz"</span>, pool.<span class="fn">stats</span>())
reqs[<span class="num">2</span>].<span class="fn">free</span>()
<span class="fn">print</span>(<span class="str">"serbest bıraktıktan sonra, havuz"</span>, pool.<span class="fn">stats</span>())
</code></pre></div>

<p class="l-text"><strong>Bu kod nasıl çalışıyor:</strong> sabit boyutlu bir <code>BlockPool</code> tanımlıyoruz — K ve V tensörlerini (n_blocks, BLOCK_SIZE, HEAD_DIM) dizisi olarak sahipleniyor, yanında bir free-list tutuyor. Her <code>PagedSequence</code> ham tensör değil, sadece bu havuzdaki indeksleri saklıyor. <code>append_token</code>, mevcut blok dolduğunda istek başına sayfa tablosunu bir blok büyütüyor — önden ayırma yok. Sonra 3, 7, 12 ve 5 token'lı dört isteği itip havuzun aşağıdan yukarı dolduğunu izliyoruz; en uzun diziyi <code>free</code> ettiğimizde 3 bloku anında havuza döndürüyor, bir sonraki istek bunları yeniden kullanabiliyor. Naif tasarımı karşılaştır: orada her istek baştan <code>max_seq_len/BLOCK_SIZE</code> blok kapardı.</p>


<div class="calc-highlight">req 1 (uzunluk 7) 2 blok kullandı, req 2 (uzunluk 12) 3 blok kullandı vb. Son blokun ötesinde iç parçalanma yok ve serbest bırakılan bloklar anında yeniden kullanılabilir. Tüm kazanç budur — gerçek iş yüklerinde efektif throughput'u rutin olarak ikiye veya üçe katlar.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Sürekli Batching</h2>
<p class="l-text">Statik batching: 16 isteği topla, <em>hepsi</em> bitene kadar birlikte çalıştır, sonra bir sonraki batch'i başlat. Sorun: en uzun dizi GPU'yu rehin tutar. <strong>Sürekli batching</strong> (iterasyon-seviyeli batching de denir), her decode adımında biten dizileri yenileriyle değiştirir. GPU yüksek kullanımda kalır; yeni istekler en yavaşı beklemek yerine milisaniyeler içinde başlar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Çeşitli çıktı uzunluklarına sahip sürekli istek akışını simüle et</span>
BATCH_SIZE = <span class="num">4</span>
N_REQUESTS = <span class="num">20</span>
out_lens = rng.<span class="fn">integers</span>(<span class="num">5</span>, <span class="num">50</span>, N_REQUESTS)

<span class="kw">def</span> <span class="fn">static_batching</span>():
    <span class="str">"""Bir sonrakini başlatmadan önce tüm batch'in bitmesini bekle."""</span>
    total_steps = <span class="num">0</span>
    <span class="kw">for</span> batch_start <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, N_REQUESTS, BATCH_SIZE):
        batch = out_lens[batch_start:batch_start+BATCH_SIZE]
        total_steps += <span class="fn">int</span>(batch.<span class="fn">max</span>())   <span class="cm"># batch'teki en uzun belirler</span>
    <span class="kw">return</span> total_steps

<span class="kw">def</span> <span class="fn">continuous_batching</span>():
    <span class="str">"""Her adımda biten dizileri yenileriyle değiştir."""</span>
    arrival_idx = <span class="num">0</span>
    in_flight = []           <span class="cm"># her slot için kalan token</span>
    <span class="cm"># ilk batch'i doldur</span>
    <span class="kw">while</span> <span class="fn">len</span>(in_flight) &lt; BATCH_SIZE <span class="kw">and</span> arrival_idx &lt; N_REQUESTS:
        in_flight.<span class="fn">append</span>(<span class="fn">int</span>(out_lens[arrival_idx])); arrival_idx += <span class="num">1</span>

    steps = <span class="num">0</span>
    <span class="kw">while</span> in_flight:
        <span class="cm"># bir decode adımı: her uçuştaki slot bir token üretir</span>
        in_flight = [t - <span class="num">1</span> <span class="kw">for</span> t <span class="kw">in</span> in_flight]
        steps += <span class="num">1</span>
        <span class="cm"># bitenleri kaldır, kuyruktan yenile</span>
        in_flight = [t <span class="kw">for</span> t <span class="kw">in</span> in_flight <span class="kw">if</span> t &gt; <span class="num">0</span>]
        <span class="kw">while</span> <span class="fn">len</span>(in_flight) &lt; BATCH_SIZE <span class="kw">and</span> arrival_idx &lt; N_REQUESTS:
            in_flight.<span class="fn">append</span>(<span class="fn">int</span>(out_lens[arrival_idx])); arrival_idx += <span class="num">1</span>
    <span class="kw">return</span> steps

s_static = <span class="fn">static_batching</span>()
s_cont   = <span class="fn">continuous_batching</span>()
<span class="fn">print</span>(f<span class="str">"statik     : {s_static} GPU adımı"</span>)
<span class="fn">print</span>(f<span class="str">"sürekli    : {s_cont} GPU adımı"</span>)
<span class="fn">print</span>(f<span class="str">"hızlanma   : {s_static/s_cont:.2f}x"</span>)
<span class="fn">print</span>(f<span class="str">"teorik alt sınır (toplam uzunluk / batch): {out_lens.sum()/BATCH_SIZE:.1f}"</span>)
</code></pre></div>

<p class="l-text">Pratikte sürekli batching üretim iş yüklerinde uçtan uca 1.5-3x daha hızlıdır. PagedAttention ile birleştirildiğinde naif HuggingFace generate'e göre tipik olarak 5-20x throughput görürsün.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Spekülatif Kod Çözme</h2>
<p class="l-text">Kod çözme otoregresiftir — N+1 token'ı N token'ına bağlıdır — bu da tek bir dizi için token'lar arası paralelleştiremeyeceğin anlamına gelir. <strong>Spekülatif kod çözme</strong> (Leviathan 2023) bunun etrafından zekice bir numarayla dolaşır: küçük bir <em>draft</em> model batch hâlinde K token önerir; büyük <em>doğrulayıcı</em> model K'sını tek bir ileri geçişte kontrol eder; kabul edilen token'lar onaylanır, ilk reddedilen token düzeltilir. En iyi durum: doğrulayıcı çağrısı başına K-1 bedava token.</p>

<div class="katex-block">$$E[\\text{accepted}] = \\sum_{k=0}^{K-1} \\alpha^{k+1} \\quad\\text{where }\\alpha = P(\\text{draft agrees with target})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

K = <span class="num">4</span>                  <span class="cm"># tur başına draft uzunluğu</span>
n_steps = <span class="num">200</span>          <span class="cm"># bu kadar kabul edilen token istiyoruz</span>

<span class="kw">def</span> <span class="fn">expected_acceptances</span>(alpha, K):
    <span class="str">""</span>"Token başına anlaşma olasılığı alpha verildiğinde bir turda E[<span class="cm"># kabul]."""</span>
    <span class="kw">return</span> <span class="fn">sum</span>(alpha**(k+<span class="num">1</span>) <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K))

<span class="cm"># Anlaşma oranlarını süpür</span>
<span class="kw">for</span> alpha <span class="kw">in</span> [<span class="num">0.3</span>, <span class="num">0.5</span>, <span class="num">0.7</span>, <span class="num">0.85</span>, <span class="num">0.95</span>]:
    E_per_round = <span class="fn">expected_acceptances</span>(alpha, K)
    rounds = n_steps / <span class="fn">max</span>(E_per_round, <span class="num">1e-9</span>)
    speedup_vs_baseline = n_steps / rounds   <span class="cm"># tur başına 1 doğrulayıcı çağrısı</span>
    <span class="fn">print</span>(f<span class="str">"alpha={alpha:.2f}  E[kabul]/tur={E_per_round:.2f}  "</span>
          f<span class="str">"naive'e göre hızlanma: {speedup_vs_baseline:.2f}x"</span>)

<span class="cm"># alpha=0.7, K=4 için tam decode'u Monte Carlo simüle et</span>
<span class="kw">def</span> <span class="fn">simulate</span>(alpha, K, target):
    accepted, rounds = <span class="num">0</span>, <span class="num">0</span>
    <span class="kw">while</span> accepted &lt; target:
        rounds += <span class="num">1</span>
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K):
            <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; alpha:
                accepted += <span class="num">1</span>
                <span class="kw">if</span> accepted &gt;= target: <span class="kw">break</span>
            <span class="kw">else</span>:
                accepted += <span class="num">1</span>   <span class="cm"># doğrulayıcı düzeltmesi de bir token verir</span>
                <span class="kw">break</span>
    <span class="kw">return</span> rounds

rounds = <span class="fn">simulate</span>(<span class="num">0.7</span>, <span class="num">4</span>, n_steps)
<span class="fn">print</span>(f<span class="str">"\\nMC simülasyonu: {n_steps} token için {rounds} doğrulayıcı çağrısı "</span>
      f<span class="str">"(hızlanma {n_steps/rounds:.2f}x)"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kod nasıl çalışıyor:</strong> kapalı form ifade <code>E[kabul] = alpha + alpha^2 + ... + alpha^K</code> sana bir doğrulayıcı çağrısının ortalama kaç token onayladığını söyler. alpha'yı 0.3'ten (zayıf drafter) 0.95'e (neredeyse mükemmel anlaşma) süpürüp hızlanmayı doğrudan okuyoruz: alpha=0.7, K=4'te çağrı başına 1 yerine ~2.1 token onaylanıyor, yani 2.1x hızlanma. Monte-Carlo simülasyonu sonra tam 200-token üretimi oynatıyor: her turda K draft token örnekleyip ilk reddedişe kadar kabul ediyoruz, doğrulayıcının düzeltmesi de bir token kazandırıyor. Doğrulayıcı çağrılarını saymak, kapalı-form beklentisini örnekleme gürültüsü içinde doğruluyor.</p>


<div class="calc-highlight">İyi seçilmiş bir draft modelle (örn. 70B için draft yapan 1B) üretimde alpha tipik olarak 0.6-0.8 olur ve 1.8-2.5x gecikme azalması ölçersin. Doğrulayıcı çağrı başına aynı miktarda FLOP yapar; sadece bunları daha çok çıktı token'ına yayarsın.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Pratikte vLLM</h2>
<p class="l-text"><strong>vLLM</strong> (UC Berkeley, Kwon vd. 2023) PagedAttention ve sürekli batching'in referans uygulamasıdır ve 2026'da yüksek throughput açık kaynak sunum için varsayılan seçimdir. Python API'si bilinçli olarak minimaldir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — vllm)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> vllm <span class="kw">import</span> LLM, SamplingParams

llm = <span class="fn">LLM</span>(
    model=<span class="str">"meta-llama/Llama-2-7b-chat-hf"</span>,
    tensor_parallel_size=<span class="num">2</span>,            <span class="cm"># 2 GPU'ya böl</span>
    gpu_memory_utilization=<span class="num">0.90</span>,       <span class="cm"># vLLM'in ne kadar VRAM talep edebileceği</span>
    max_model_len=<span class="num">4096</span>,
    enable_prefix_caching=<span class="kw">True</span>,        <span class="cm"># paylaşılan sistem prompt'lu sohbet için büyük kazanç</span>
    enable_chunked_prefill=<span class="kw">True</span>,       <span class="cm"># düzgün prefill gecikmesi</span>
)

sampling = <span class="fn">SamplingParams</span>(temperature=<span class="num">0.7</span>, top_p=<span class="num">0.9</span>, max_tokens=<span class="num">512</span>)

prompts = [<span class="str">"Attention'ı tek paragrafta anlat."</span>,
           <span class="str">"KV cache hakkında bir haiku yaz."</span>,
           <span class="str">"PagedAttention nedir?"</span>]

outputs = llm.<span class="fn">generate</span>(prompts, sampling)
<span class="kw">for</span> out <span class="kw">in</span> outputs:
    <span class="fn">print</span>(out.prompt[:<span class="num">40</span>], <span class="str">"->"</span>, out.outputs[<span class="num">0</span>].text[:<span class="num">80</span>])

<span class="cm"># Üretim: OpenAI uyumlu HTTP sunucusu</span>
<span class="cm"># python -m vllm.entrypoints.openai.api_server \\</span>
<span class="cm">#   --model meta-llama/Llama-2-7b-chat-hf \\</span>
<span class="cm">#   --tensor-parallel-size 2 \\</span>
<span class="cm">#   --enable-prefix-caching</span>
</code></pre></div>

<p class="l-text">Vurgulanmaya değer iki bayrak. <code>enable_prefix_caching</code>, ortak prefix paylaşan istekler arasında KV bloklarını yeniden kullanır (örn. aynı sistem prompt'u) — sohbet iş yüklerinde tipik olarak 2-3x throughput. <code>enable_chunked_prefill</code> prefill ve decode'u aralarına yedirir; uzun bir prompt kısa olanları tıkamaz — büyük TTFT iyileştirmesi.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. TGI &amp; SGLang — Alternatifler</h2>
<p class="l-text"><strong>TGI</strong> (HuggingFace'in Text Generation Inference'ı) ve <strong>SGLang</strong> (LMSYS, Liu 2024), 2026'da diğer iki üretim seviyesi açık sunucudur. Temellerde örtüşürler; farklılaşma marjlarda olur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">vLLM</div><div class="card-body">Standart sohbet/tamamlama iş yüklerinde en iyi ham throughput. En büyük topluluk. Multi-LoRA sunum. OpenAI uyumlu HTTP. Çoğu yığında varsayılan.</div></div>
<div class="calc-card"><div class="card-title">TGI</div><div class="card-body">Birinci sınıf HuggingFace ekosistem entegrasyonu. Model yükleme ve quant config'leri için HF Hub ile en sıkı entegrasyon. AWQ/GPTQ/Marlin yerleşik.</div></div>
<div class="calc-card"><div class="card-title">SGLang</div><div class="card-body">Yapılandırılmış çıktılar (JSON şeması, regex kısıtları) ve karmaşık programlar (çok-turlu, dallanma) için en iyi. RadixAttention prefix'leri vLLM'den daha agresif yeniden kullanır.</div></div>
<div class="calc-card"><div class="card-title">TensorRT-LLM</div><div class="card-body">NVIDIA'nın birinci taraf çözümü. Build karmaşıklığını tolere edersen H100'de en yüksek tek-akış gecikme. Kapalı kaynak çekirdekler.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO — TGI &amp; SGLang)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># --- TGI ---</span>
docker run --gpus <span class="fn">all</span> --shm-size 1g -p <span class="num">8080</span>:<span class="num">80</span> \\
  ghcr.io/huggingface/text-generation-inference:latest \\
  --model-id meta-llama/Llama-<span class="num">2</span>-7b-chat-hf \\
  --quantize awq \\
  --<span class="fn">max</span>-batch-prefill-tokens <span class="num">4096</span> \\
  --<span class="fn">max</span>-<span class="fn">input</span>-length <span class="num">2048</span> \\
  --<span class="fn">max</span>-total-tokens <span class="num">4096</span>

<span class="cm"># --- SGLang ---</span>
python -m sglang.launch_server \\
  --model-path meta-llama/Llama-<span class="num">2</span>-7b-chat-hf \\
  --port <span class="num">30000</span> \\
  --enable-torch-compile \\
  --schedule-policy lpm        <span class="cm"># longest-prefix-match, RadixAttention zamanlayıcısı</span>
</code></pre></div>

<p class="l-text"><strong>İki komutun farkı:</strong> TGI satırı, HF Hub kimlik bilgilerini, AWQ çekirdeklerini ve OpenAI uyumlu router'ı tek imajda taşıyan bir Docker konteyneri başlatır — HF ekosisteminde yaşıyorsan ve tek binary istiyorsan ideal. SGLang Python süreci olarak açılır; zamanlayıcıyı sıcak değiştirebilirsin (<code>lpm</code> radix ağacında en-uzun-prefix-eşleşme yolunu seçer, paylaşılan sistem prompt'larını bu sayede ucuza alırsın). İkisi de tel üstünde OpenAI API'sini konuşur, bu yüzden sunum yığınını değiştirmek istemci kodunu değiştirmez.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Throughput vs Gecikme Ayarı</h2>
<p class="l-text">İki iş yükü, iki farklı optimizasyon hedefi. Bir chatbot <em>ilk-token süresi</em> (TTFT) ve token-arası gecikmeyi önemser. Bir batch özetleme işi tüm kuyruktaki token-saniye'yi önemser. Çevirdiğin bayraklar zıt yönlere çeker.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Throughput öncelikli</div><div class="card-body">Daha büyük batch'ler, daha yüksek <code>max_num_seqs</code>, daha büyük <code>max_num_batched_tokens</code>, prefix caching AÇIK. Daha yüksek TTFT'yi kabullen.</div></div>
<div class="calc-card"><div class="card-title">Gecikme öncelikli</div><div class="card-body">Daha küçük batch'ler, chunked prefill AÇIK, küçük draft ile spekülatif kod çözme, muhtemelen tek-akış hızlanması için tensor-parallel. Daha düşük throughput'u kabullen.</div></div>
<div class="calc-card"><div class="card-title">Dengeli</div><div class="card-body">İki bayrağı da AÇIK, <code>max_num_batched_tokens</code>'ı tipik istek boyutunun ~2-4x'ine ayarla. Gerçekçi trafikle profil çıkar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Basit throughput modeli: throughput = batch * tokens_per_step / step_time</span>
<span class="cm"># step_time batch ile kabaca doğrusal artar (GPU'da bellek-bant-genişliği bağlı)</span>
<span class="kw">def</span> <span class="fn">throughput</span>(batch, step_time_per_seq_ms=<span class="num">10</span>, step_time_overhead_ms=<span class="num">2</span>):
    step_time = step_time_overhead_ms + batch * step_time_per_seq_ms
    <span class="kw">return</span> batch * <span class="num">1000</span> / step_time   <span class="cm"># token/saniye</span>

<span class="kw">def</span> <span class="fn">ttft</span>(prefill_tokens, batch, prefill_throughput=<span class="num">2000</span>):
    <span class="str">"""Kaba TTFT tahmini: prefill_tokens * batch / throughput."""</span>
    <span class="kw">return</span> prefill_tokens * batch * <span class="num">1000</span> / prefill_throughput

<span class="fn">print</span>(<span class="str">"batch  throughput(tok/s)   TTFT@512(ms)"</span>)
<span class="kw">for</span> b <span class="kw">in</span> [<span class="num">1</span>, <span class="num">4</span>, <span class="num">16</span>, <span class="num">64</span>, <span class="num">256</span>]:
    <span class="fn">print</span>(f<span class="str">"  {b:3d}        {throughput(b):8.1f}      {ttft(512, b):8.1f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kod nasıl çalışıyor:</strong> <code>throughput</code> fonksiyonu birinci-derece GPU modelini yakalar — adım başı gecikme küçük bir çağrı yükü artı batch'te doğrusal bir bileşene sahip (çünkü attention bellek-bant-genişliği bağlı), bu nedenle throughput batch'le sub-linear artar. <code>ttft</code> fonksiyonu prefill'i modeller: sabit prefill throughput'unda batch'i iki katına çıkarmak ilk token'ın bekleme süresini iki katına çıkarır. Döngü batch boyutlarını 1, 4, 16, 64, 256 süpürüp iki sayıyı yan yana yazdırır — herhangi bir yeni model için throughput/TTFT dizini bulmak için kuracağın tam tablo budur.</p>


<div class="calc-highlight">batch ~64'ün ötesinde azalan throughput getirilerine ve doğrusal TTFT büyümesine dikkat et. İş yükü başına bir tatlı nokta var — bunu tahmin ederek değil, gerçek trafiği yeniden oynatarak bul.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 2026 Karar Ağacı</h2>
<p class="l-text">Bir sunum yığını seçmek için pratik bir tarif. Yukarıdan aşağıya yürü; ilk eşleşme genellikle doğru cevaptır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tek kiracılı sohbet, max throughput</div><div class="card-body">prefix caching AÇIK ile vLLM.</div></div>
<div class="calc-card"><div class="card-title">Müşteri başı ince ayarlı çok-kiracılı</div><div class="card-body">multi-LoRA sunumlu vLLM veya LoRAX. Tek base, düzinelerce adapter.</div></div>
<div class="calc-card"><div class="card-title">Sıkı JSON / yapılandırılmış çıktı</div><div class="card-body">SGLang. Kısıtlı kod çözme uygulaması açık kaynaktaki en güçlüsü.</div></div>
<div class="calc-card"><div class="card-title">HuggingFace yerli dağıtım</div><div class="card-body">TGI. HF model card / quant config'leriyle en temiz entegrasyon.</div></div>
<div class="calc-card"><div class="card-title">H100'de en düşük tek-akış gecikme</div><div class="card-body">Build karmaşıklığını ödeyebilirsen TensorRT-LLM; aksi hâlde spekülatif kod çözme ile vLLM.</div></div>
<div class="calc-card"><div class="card-title">Edge / tek kullanıcı</div><div class="card-body">llama.cpp veya MLC-LLM. Farklı kategori — CPU/Apple Silicon/WebGPU.</div></div>
</div>

<p class="l-text">Faydalı bir sezgi: PagedAttention + sürekli batching, LLM sunumunu "utanç verici şekilde bellek bağlı" olmaktan "gerçekçi yükler altında hesap bağlı" olmaya dönüştürdü. Bölüm 2'deki OS-tarzı sanal-bellek benzetmesini kavradığında, alandaki gerisi sadece daha iyi zamanlayıcılar ve üstüne daha iyi quantization'dır.</p>
</div>
`
};
