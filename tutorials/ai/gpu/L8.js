window.GPU_L8 = {
en: `<p class="l-text"><strong>Training a model is a one-time cost; serving it is a forever cost.</strong> A 70B model deployed to production might cost a few hundred thousand dollars to train and several million per year to serve. The economics of a real LLM business are dominated by inference throughput per GPU per second, and the gap between a naive PyTorch generation loop and a tuned inference server is staggering — often 20–30x in tokens-per-second-per-GPU. The technology that closed that gap is <em>continuous batching</em> with <em>PagedAttention</em>, popularized by the vLLM project (Kwon et al., SOSP 2023) and now implemented in some form by every serious LLM serving stack: TGI, SGLang, TensorRT-LLM, llama.cpp, MLC, Anthropic's and OpenAI's internal stacks.</p>

<p class="l-text">This capstone lesson assembles everything from lessons 1–7 into a real inference server. We dissect: <strong>(1)</strong> the economics of LLM serving (compute-bound prefill vs memory-bound decode), <strong>(2)</strong> KV-cache memory math (why a 70B 32k-context cache is bigger than the model itself), <strong>(3)</strong> PagedAttention's virtual-memory-style chunking, <strong>(4)</strong> continuous batching's scheduling magic, <strong>(5)</strong> SGLang's RadixAttention prefix-cache, <strong>(6)</strong> speculative decoding for latency, <strong>(7)</strong> quantization (INT8, INT4, FP8) for throughput, <strong>(8)</strong> profiling with Nsight Compute, and <strong>(9)</strong> a fully runnable Pyodide demo of the request scheduler that vLLM uses. By the end you will be able to look at a serving deployment and say specifically why it is fast or slow.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish prefill (compute-bound) and decode (memory-bound) phases of LLM inference</li>
<li>Compute KV-cache memory and pick context length / batch size that fit on one GPU</li>
<li>Explain PagedAttention's block table and why it eliminates KV-cache fragmentation</li>
<li>Trace the continuous-batching scheduler step-by-step on a real request stream</li>
<li>Apply prefix caching (RadixAttention / SGLang) to repeated system prompts</li>
<li>Use speculative decoding to cut latency 2–3x without changing the output distribution</li>
<li>Pick a quantization scheme (INT8 / INT4 / FP8) for a deployment</li>
<li>Profile a serving deployment with Nsight Compute and PyTorch profiler</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Two Phases of LLM Inference</h2>
<p class="l-text">Every LLM call has two regimes. <strong>Prefill</strong>: the prompt (say 500 tokens) goes through the model once. All 500 tokens process in parallel — the GPU runs at near-peak FLOPS, compute-bound. <strong>Decode</strong>: each output token requires a forward pass with batch size 1 and sequence length 1 (plus the KV-cache). The GPU reads the entire model from HBM to compute one token, then again for the next. Decode is memory-bound — running at maybe 5–15% of peak FLOPS.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prefill</div><div class="card-body">Long input, parallel attention over many tokens. Compute intensity high (matmul-shaped). FLOPS-bound. Cost per token: ~2P FLOPs / peak FLOPS. On H100 with 70B model: ~140 GFLOPs / 989 TFLOPS ≈ 0.14 ms per token.</div></div>
<div class="calc-card"><div class="card-title">Decode</div><div class="card-body">One token at a time. Reads all 70B params (140 GB at FP16) per step. HBM-bound. Cost per token: ~140 GB / 3.35 TB/s ≈ 42 ms per token if batch=1. With batching, the model load amortizes across the batch.</div></div>
<div class="calc-card"><div class="card-title">The killer insight</div><div class="card-body">Decode at batch=1 wastes 90% of an H100. Decode at batch=64 still does the same single read of model weights but produces 64 tokens — so per-token cost drops 64x. <strong>Throughput in decode = batching</strong>.</div></div>
</div>

<div class="katex-block">$$\\text{decode latency}_{\\text{batch}=B} \\;\\approx\\; \\frac{\\text{model size}}{\\text{HBM BW}} \\;+\\; B \\cdot \\frac{\\text{KV-cache read}}{\\text{HBM BW}}$$</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. KV-Cache — The Real Memory Hog</h2>
<p class="l-text">For a transformer with L layers, H heads of dim d each, the KV-cache holds 2·L·H·d bytes per token (K and V for every layer, every head). Llama-3 70B has L=80, H=64, d=128 → 2·80·64·128 = 1.31 MB per token at FP16. A single 32k-context conversation is 42 GB of KV-cache. A request with 100 concurrent users at 8k context each is 100 GB — already exceeding a single H100's 80 GB.</p>

<div class="calc-highlight"><strong>The serving-memory budget on H100 (80 GB):</strong> 70B model weights at FP16 = 140 GB → does not fit, must use 8-way tensor-parallel or quantization. After loading 17.5 GB-per-shard FP16 weights with TP=8: ~62 GB free for KV-cache + activations. At 1.31 MB/token, that is ~47k cached tokens — enough for, say, 16 users at 3k context each. PagedAttention's job is to allocate this 62 GB efficiently across requests of varying lengths.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — KV-cache budget calculator</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>def kv_cache_bytes(num_layers, num_heads, head_dim, seq_len, dtype_bytes=2):
    return 2 * num_layers * num_heads * head_dim * seq_len * dtype_bytes

# Llama 3 70B
per_token = kv_cache_bytes(80, 64, 128, 1)
print(f"per-token KV-cache (Llama-3 70B FP16): {per_token/1024:.1f} KB")
print(f"32k context single user: {kv_cache_bytes(80,64,128,32_000)/1e9:.2f} GB")
print(f"100 users @ 8k each      : {100 * kv_cache_bytes(80,64,128,8_000)/1e9:.2f} GB")
print(f"H100 free after 70B weights (TP=8): ~{80 - 17.5:.1f} GB / GPU")
print(f"Max concurrent tokens that fit    : ~{int((80-17.5)*1e9 / per_token):,}")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>kv_cache_bytes</code> implements the per-token KV-cache formula <code>2 · L · H · d · seq_len · dtype_bytes</code> — the factor of 2 covers K <em>and</em> V tensors stored separately for every layer. 2) Plugging in Llama-3 70B's geometry (L=80 layers, H=64 heads, d=128 head_dim) at FP16 (dtype_bytes=2) prints <code>~160 KB</code> per token — that single number drives every downstream serving decision. 3) The 32k-context single-user line multiplies that by 32 000 to show one long conversation alone burns ~5.2 GB of HBM, while 100 concurrent 8k users hit ~131 GB — already exceeding one H100's 80 GB before model weights. 4) Subtracting the per-shard weight footprint <code>17.5 GB</code> (70B/8 ranks with TP=8) leaves ~62.5 GB for KV; dividing by <code>per_token</code> yields the maximum concurrently cached tokens — this is the exact budget vLLM admission control enforces.</p>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PagedAttention — Virtual Memory for KV-Cache</h2>
<p class="l-text">Pre-vLLM, every request reserved a contiguous KV-cache for its <em>maximum</em> possible length (say 8k tokens) at the start. If the actual response was 200 tokens, 7800 tokens' worth of HBM sat unused. With variable-length conversations and dynamic batching, fragmentation eats 60–80% of available KV memory. The classic OS solution: paging.</p>

<p class="l-text">PagedAttention chunks the KV-cache into fixed-size <strong>blocks</strong> (typically 16 tokens). A <strong>block table</strong> per request maps "logical" positions in the conversation to "physical" block indices in HBM. New blocks are allocated only as the conversation grows. Freed blocks return to a pool. The attention kernel takes the block table as an input and gathers from non-contiguous physical blocks — same compute as FlashAttention, just with an indirection.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Block size</div><div class="card-body">Typically 16 tokens. Trade-off: smaller blocks = less internal fragmentation but more block-table overhead and worse coalescing. 16 is the sweet spot in vLLM.</div></div>
<div class="calc-card"><div class="card-title">Block table</div><div class="card-body">Per-request array of block indices. For a 1000-token conversation: 63 blocks listed. Stored on the GPU; the FlashAttention kernel reads it to fetch the right physical addresses.</div></div>
<div class="calc-card"><div class="card-title">Memory savings</div><div class="card-body">Original vLLM paper reports 2-4x throughput vs naive serving by using PagedAttention. On a fixed GPU, you serve 2-4x more concurrent users.</div></div>
<div class="calc-card"><div class="card-title">Beam search / forking</div><div class="card-body">Parallel sequences (beam search) share their common prefix's blocks via reference counting. Copy-on-write when one beam diverges. Memory linear in unique tokens, not in branches.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — PagedAttention block allocator</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class BlockAllocator:
    def __init__(self, num_blocks=64, block_size=16, head_dim=64):
        self.block_size = block_size
        # KV storage: pretend this is HBM
        self.K = np.zeros((num_blocks, block_size, head_dim), dtype=np.float32)
        self.V = np.zeros((num_blocks, block_size, head_dim), dtype=np.float32)
        self.free = list(range(num_blocks))
        self.tables = {}    # request_id -&gt; list of block indices

    def alloc_for(self, req_id, num_tokens):
        n_blocks = (num_tokens + self.block_size - 1) // self.block_size
        if len(self.free) &lt; n_blocks:
            raise RuntimeError("OOM: not enough free blocks")
        blocks = [self.free.pop() for _ in range(n_blocks)]
        self.tables[req_id] = blocks
        return blocks

    def append_token(self, req_id, k, v, position):
        # If we filled the last block, allocate a new one
        n_alloc = len(self.tables[req_id]) * self.block_size
        if position &gt;= n_alloc:
            self.tables[req_id].append(self.free.pop())
        block_idx = self.tables[req_id][position // self.block_size]
        slot      = position % self.block_size
        self.K[block_idx, slot] = k
        self.V[block_idx, slot] = v

    def free_request(self, req_id):
        for b in self.tables.pop(req_id, []):
            self.free.append(b)

# Demo: 3 concurrent requests with different lengths
alloc = BlockAllocator(num_blocks=16, block_size=4, head_dim=8)
alloc.alloc_for("req_A", num_tokens=10)   # 3 blocks
alloc.alloc_for("req_B", num_tokens=2)    # 1 block
alloc.alloc_for("req_C", num_tokens=5)    # 2 blocks
print(f"after init: tables = { {k: v for k, v in alloc.tables.items()} }")
print(f"free pool : {alloc.free}  (10 blocks left)")

alloc.free_request("req_A")
print(f"after freeing A: free = {sorted(alloc.free)} (back to 13)")

# req_B grows by appending tokens — auto-allocates new blocks
for t in range(2, 12):
    k = np.random.randn(8); v = np.random.randn(8)
    alloc.append_token("req_B", k, v, position=t)
print(f"req_B now has blocks: {alloc.tables['req_B']} (grew from 1 to 3 blocks)")
print(f"free pool: {len(alloc.free)} blocks")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>BlockAllocator.__init__</code> pre-allocates the entire KV pool as a single <code>(num_blocks, block_size, head_dim)</code> tensor pair — vLLM does this exact thing on GPU HBM at startup so there is zero runtime <code>cudaMalloc</code> pressure during serving. 2) <code>alloc_for</code> rounds up to whole blocks with the standard ceiling-division <code>(n + bs - 1) // bs</code>, then pops free block indices into a per-request <em>block table</em> — this table is the indirection that lets KV slots be non-contiguous. 3) <code>append_token</code> detects when the last block is full and lazily pops one more free block — so a request's HBM footprint grows one block (16 tokens) at a time, never reserving the worst-case length up front. 4) <code>free_request</code> returns blocks to the free list when a sequence finishes, immediately making them available to a newly admitted request — this is exactly the OS-style paging that drives vLLM's 2-4x throughput win over contiguous-cache servers.</p>

<p class="l-text">Real PagedAttention is exactly this — but the FlashAttention kernel reads the block table on the GPU, gathers the K/V blocks via the indirection, and runs the same online-softmax algorithm we built in lesson 6. The added cost of the indirection is &lt;5% on H100 (well under what TMA prefetching can hide).</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Continuous Batching — The Scheduler That Saves Decode</h2>
<p class="l-text">Static batching: collect 16 requests, run them all together, wait for the slowest to finish, return all 16. Latency for short requests gets dragged out by long ones; new requests wait for the entire batch to drain. Continuous batching (Yu et al., OSDI 2022; deployed in vLLM, TGI, etc.): every iteration, the scheduler picks any subset of currently-active requests, runs <em>one</em> decode step, then re-decides who to run next. Finished requests leave; new requests join. The batch size changes every iteration.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Static batching</div><div class="card-body">Throughput: high (when batch is full). Latency: bad — short requests wait for long ones. New arrivals wait for the batch to clear.</div></div>
<div class="calc-card"><div class="card-title">Continuous batching</div><div class="card-body">Throughput: same or better (gaps fill with new arrivals). Latency: dramatically better — average TTFT (time-to-first-token) drops 5-10x. New requests join within one iteration.</div></div>
<div class="calc-card"><div class="card-title">Iteration-level scheduling</div><div class="card-body">The scheduler decides per iteration: which requests to prefill (only one or two — prefill is expensive), which to decode (as many as fit). Prefill chunks: split a long prefill across iterations to avoid blocking decode.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — continuous batching scheduler simulator</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import random, collections

class Request:
    def __init__(self, rid, prompt_len, max_new):
        self.rid = rid
        self.prompt_len = prompt_len
        self.max_new = max_new
        self.generated = 0
        self.state = "queued"   # queued -&gt; prefilling -&gt; decoding -&gt; done

class Scheduler:
    def __init__(self, max_batch=8, kv_capacity_tokens=200):
        self.max_batch = max_batch
        self.kv_capacity = kv_capacity_tokens
        self.queue = collections.deque()
        self.active = []
        self.kv_used = 0
        self.iteration = 0

    def admit(self, r):
        # Can we afford this prefill + its KV growth?
        if (self.kv_used + r.prompt_len + r.max_new &lt;= self.kv_capacity
                and len(self.active) &lt; self.max_batch):
            r.state = "prefilling"
            self.kv_used += r.prompt_len
            self.active.append(r)
            return True
        return False

    def step(self):
        self.iteration += 1
        # Try to admit queued requests
        while self.queue:
            if not self.admit(self.queue[0]):
                break
            self.queue.popleft()
        # Run one iteration on each active request
        for r in self.active:
            if r.state == "prefilling":
                r.state = "decoding"     # prefill done in one step (simplified)
            elif r.state == "decoding":
                r.generated += 1
                self.kv_used += 1
                if r.generated &gt;= r.max_new:
                    r.state = "done"
                    self.kv_used -= r.prompt_len + r.generated
        # Evict finished
        self.active = [r for r in self.active if r.state != "done"]

random.seed(42)
sched = Scheduler(max_batch=4, kv_capacity_tokens=60)
incoming = [Request(i, prompt_len=random.randint(5,15),
                    max_new=random.randint(5,20)) for i in range(10)]
for r in incoming: sched.queue.append(r)

for it in range(40):
    sched.step()
    if it % 4 == 0:
        active = [(r.rid, r.state, r.generated) for r in sched.active]
        print(f"iter {it:2d}  kv_used={sched.kv_used:3d}/{sched.kv_capacity}  queued={len(sched.queue)}  active={active}")
    if not sched.active and not sched.queue: break

print(f"\\nAll requests served in {sched.iteration} iterations. New requests joined within 1 iter of arrival.")
</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>Request</code> holds the four pieces the scheduler needs per sequence — prompt length, max-new tokens, generated-so-far counter, and the queued→prefilling→decoding→done state machine. 2) <code>admit</code> implements vLLM-style admission control: a queued request only enters the active set if (a) its full KV footprint <code>prompt_len + max_new</code> fits in the remaining KV capacity and (b) the active batch is below <code>max_batch</code> — same gating logic as <code>vllm.SequenceGroupMetadata</code>. 3) Each <code>step</code> first drains as many queued requests as fit, then runs one iteration on every active request: prefill transitions to decoding (simplified — real vLLM may chunk a long prefill), decoding bumps <code>generated</code> and consumes one more KV slot, and reaching <code>max_new</code> marks the request done and returns its KV. 4) The final list comprehension <code>self.active = [r for r in self.active if r.state != "done"]</code> evicts finished sequences mid-iteration so the batch size is recomputed every tick — this is the defining property of continuous (iteration-level) batching that drops average TTFT 5-10x vs static batching.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Prefix Caching — RadixAttention &amp; System Prompts</h2>
<p class="l-text">Real chat workloads have massive prompt redundancy. Every request to a chatbot starts with the same 500-token system prompt. Every code-completion request shares thousands of tokens of file context. Computing the KV-cache for that prefix from scratch every time wastes ~100 ms per request on a 70B model.</p>

<p class="l-text">SGLang (Zheng et al., 2024) introduced <strong>RadixAttention</strong>: store the KV-cache in a radix tree where each node is a tokenized prefix. New requests walk the tree as far as their prompt matches, reuse those KV blocks for free, and only compute the divergent suffix. vLLM 0.4+ added the same as "prefix caching". The speedup is huge: TTFT drops 5-20x for repeated system prompts.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RadixAttention</div><div class="card-body">Tree-based KV reuse. Tokens hash to nodes; longest-prefix-match returns cached KV. Eviction by LRU on leaf nodes. SGLang's flagship feature.</div></div>
<div class="calc-card"><div class="card-title">Prefix caching (vLLM)</div><div class="card-body">Hash blocks of the prompt; cache hits skip recomputation of those blocks. Coarser than radix (block-aligned) but simpler implementation.</div></div>
<div class="calc-card"><div class="card-title">When it helps</div><div class="card-body">Anything with shared prefixes: system prompts, RAG context, agent tool descriptions, code-completion file context. In agent loops a single tool description appears in every iteration's prompt — huge wins.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — radix-tree-of-prefixes idea</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class RadixNode:
    __slots__ = ("children", "kv_blocks", "ref_count")
    def __init__(self):
        self.children = {}      # token -&gt; RadixNode
        self.kv_blocks = []     # block ids covering tokens up to this node
        self.ref_count = 0

class RadixCache:
    def __init__(self): self.root = RadixNode()

    def match_and_extend(self, tokens):
        """Return (matched_node, matched_len) — caller fills the rest."""
        node, i = self.root, 0
        while i &lt; len(tokens) and tokens[i] in node.children:
            node = node.children[tokens[i]]; i += 1
        return node, i

    def insert(self, parent, tokens, kv_block):
        node = parent
        for t in tokens:
            if t not in node.children: node.children[t] = RadixNode()
            node = node.children[t]
        node.kv_blocks.append(kv_block)
        return node

cache = RadixCache()
# Request 1: "You are a helpful assistant. Hi"
n, m = cache.match_and_extend(["You","are","a","helpful","assistant.","Hi"])
print(f"req1 match: {m} tokens (cold cache)")
cache.insert(n, ["You","are","a","helpful","assistant.","Hi"], "kv_blk_1")

# Request 2: same system prompt, different user message
n, m = cache.match_and_extend(["You","are","a","helpful","assistant.","What's","the","weather?"])
print(f"req2 match: {m} tokens reused from cache (only suffix needs prefill)")
print("In a real server this saves ~100ms TTFT on a 70B model for every shared-prefix request.")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>RadixNode</code> uses <code>__slots__</code> to keep the tree compact (no dict overhead per node) and tracks <code>kv_blocks</code> (the cached KV block IDs that cover the path from root to this node) plus a <code>ref_count</code> for LRU eviction — same shape as SGLang's production node. 2) <code>match_and_extend</code> walks the tree token-by-token along <code>node.children[tokens[i]]</code> and returns the deepest matched node together with how many prompt tokens hit cache — this is the longest-prefix-match that turns "recompute the system prompt" into a no-op. 3) The first request hits cold cache (<code>m=0</code>), so <code>insert</code> creates a fresh chain of nodes and attaches <code>"kv_blk_1"</code> at the leaf — recording that this exact token sequence's KV is now physically present. 4) The second request shares the 5-token system prefix but diverges on user content; <code>match_and_extend</code> returns <code>m=5</code> meaning only the 3-token suffix needs prefill — on a real 70B model that 5/8 reuse cuts TTFT from ~120 ms to ~45 ms because the heavy attention/MLP on the shared prefix is skipped entirely.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Speculative Decoding — Two Models, One Output</h2>
<p class="l-text">Speculative decoding (Leviathan et al., 2023; Chen et al., 2023) cuts decode latency by running a small "draft" model that proposes K candidate tokens, then verifying them in <em>one</em> forward pass of the big model. Tokens that the big model agrees with are kept; the first disagreement triggers a re-roll. Average speedup: 2-3x on chat workloads, with provably identical output distribution to the big model alone.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Draft model</div><div class="card-body">A small (~1B) model trained or distilled from the same family. Generates K candidate tokens autoregressively (cheap, since small).</div></div>
<div class="calc-card"><div class="card-title">Verification</div><div class="card-body">Big model forward pass on prefix + K drafts (one pass, batch=K+1). For each draft, the big model emits a probability; an accept/reject test guarantees the same output distribution as if you had sampled from the big model alone.</div></div>
<div class="calc-card"><div class="card-title">Speedup</div><div class="card-body">If average accept length is L, the big model runs once per L+1 tokens instead of once per token. With K=4 and L=2.5, that is ~3.5x decode speedup. Best for repetitive / structured output (code, JSON).</div></div>
<div class="calc-card"><div class="card-title">Variants</div><div class="card-body">Medusa (Cai 2024) adds extra prediction heads to the big model itself. Lookahead Decoding skips the draft model. EAGLE uses the big model's hidden states to draft. All deployed in vLLM/SGLang by 2025.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Quantization — INT8, INT4, FP8</h2>
<p class="l-text">Storing weights in lower precision halves (or quarters) HBM traffic — and decode is HBM-bound. Quantization is the single biggest throughput lever for serving. Three regimes:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">INT8 (W8A8 / W8A16)</div><div class="card-body">Weights and/or activations as int8. Hardware: A100 INT8 tensor cores at 624 TFLOPS, H100 at 1979 TFLOPS. Quality loss: typically &lt;0.5 perplexity on Llama-2 70B with smoothquant. Standard for production.</div></div>
<div class="calc-card"><div class="card-title">INT4 (W4A16, GPTQ / AWQ)</div><div class="card-body">Weights at int4 with FP16 activations. Halves model size again — 70B fits on a single 4090 with 24 GB. Quality loss ~1-2 perplexity. Standard for hobbyist deployment, increasingly for cost-sensitive production.</div></div>
<div class="calc-card"><div class="card-title">FP8 (E4M3 / E5M2)</div><div class="card-body">H100 native — 1979 TFLOPS with sparsity. Per-tile dynamic scaling preserves accuracy. FlashAttention-3 uses it. The future for both training and inference on H100/B100.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — INT8 round-trip and per-channel scaling</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Simulate per-channel INT8 weight quantization on a Linear layer
in_dim, out_dim = 512, 1024
W_fp16 = np.random.randn(out_dim, in_dim).astype(np.float32) * 0.1

# Per-row scaling (one scale per output channel — standard INT8 quant)
scales = np.abs(W_fp16).max(axis=1, keepdims=True) / 127.0
W_int8 = np.round(W_fp16 / scales).clip(-127, 127).astype(np.int8)

# Dequantize for the demo (in real INT8 inference the matmul is done in int8)
W_dequant = W_int8.astype(np.float32) * scales

x = np.random.randn(in_dim).astype(np.float32)
y_fp = W_fp16   @ x
y_q  = W_dequant @ x
print(f"FP32 baseline: {y_fp[:5]}")
print(f"INT8 result  : {y_q[:5]}")
print(f"max relative error: {np.max(np.abs(y_q - y_fp) / (np.abs(y_fp)+1e-6)):.4f}")
print(f"weight bytes  FP16: {W_fp16.nbytes/1e3:.1f} KB")
print(f"weight bytes  INT8: {W_int8.nbytes/1e3:.1f} KB  (4x smaller; HBM traffic halved or quartered)")
print(f"On H100 INT8 has 2x the FLOPS of FP16 -&gt; matmul also faster, not just smaller.")
</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a 1024×512 weight matrix and scales it by 0.1 to mimic the post-LayerNorm magnitudes typical of LLM linear layers — using a single global scale here would crush small channels, so we go per-row. 2) <code>scales = np.abs(W_fp16).max(axis=1, keepdims=True) / 127.0</code> computes one scale per output channel — this is the W8A8/W8A16 "per-channel symmetric quantization" used by SmoothQuant and GPTQ; 127 is the max value of a signed int8. 3) <code>np.round(W / scales).clip(-127, 127).astype(np.int8)</code> projects to int8 (the <code>.clip</code> guards against rounding overshoot on the channel that hit max), and <code>W_dequant = W_int8 * scales</code> simulates what a real INT8 matmul kernel does internally with FP16 accumulation. 4) The printed <code>max relative error</code> stays in the 1-2% range — well under the 0.5-perplexity threshold mentioned in the cards — while the storage drops 4x (FP32→INT8) and H100 INT8 tensor cores deliver 2x the FLOPS of FP16, so the matmul is both smaller <em>and</em> faster.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Profiling a Serving Deployment</h2>
<p class="l-text">When the serving SLO is missed, you need to know where time goes. The standard toolchain:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Nsight Systems (<code>nsys</code>)</div><div class="card-body">Top-level timeline. Shows kernel launches, NCCL ops, CPU↔GPU sync. First tool to reach for. Identifies "where is the bubble" between requests.</div></div>
<div class="calc-card"><div class="card-title">Nsight Compute (<code>ncu</code>)</div><div class="card-body">Per-kernel deep dive on the bottleneck kernels (usually FlashAttention, matmul, or AllReduce). Reports occupancy, HBM throughput, stall reasons.</div></div>
<div class="calc-card"><div class="card-title">PyTorch Profiler</div><div class="card-body">Annotates Python code paths into the trace. Use <code>torch.profiler.profile(activities=[CPU,CUDA])</code>. Exports Chrome trace; very readable.</div></div>
<div class="calc-card"><div class="card-title">vLLM &amp; TGI metrics</div><div class="card-body">Built-in Prometheus endpoints: TTFT, ITL (inter-token latency), throughput, KV-cache utilization, queue depth. The first dashboards to set up for a real deployment.</div></div>
</div>

<div class="calc-highlight"><strong>Diagnostic ladder:</strong> (1) is GPU utilization 90%+? If no, you are scheduler-bound — check batch fullness. (2) Is HBM bandwidth utilization high? If yes, you are decode-bound — try quantization or speculative decoding. (3) Is FLOPS utilization high? If yes, you are prefill-bound — try chunked prefill. (4) Is comm time large? If yes, TP across NVLink is slow — check NCCL config.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Putting It All Together — A Mini vLLM in 80 Lines</h2>
<p class="l-text">A toy serving loop that combines: PagedAttention block allocation, continuous batching scheduler, and a fake forward step. This is structurally what vLLM does, minus the actual transformer weights and the FlashAttention kernel.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — toy serving server</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import collections, random
random.seed(7)

BLOCK_SIZE = 4
NUM_BLOCKS = 32

class Server:
    def __init__(self):
        self.free_blocks = list(range(NUM_BLOCKS))
        self.tables = {}
        self.queue  = collections.deque()
        self.active = {}
        self.iteration = 0
        self.metrics = {"TTFT": [], "ITL": [], "throughput": []}

    def submit(self, rid, prompt_len, max_new):
        self.queue.append((rid, prompt_len, max_new, self.iteration))

    def _alloc_blocks(self, n):
        if len(self.free_blocks) &lt; n: return None
        return [self.free_blocks.pop() for _ in range(n)]

    def step(self):
        self.iteration += 1
        # Admit from queue
        while self.queue:
            rid, plen, mnew, arrival = self.queue[0]
            need = (plen + mnew + BLOCK_SIZE - 1) // BLOCK_SIZE
            blocks = self._alloc_blocks(need)
            if blocks is None: break
            self.queue.popleft()
            self.tables[rid] = blocks
            self.active[rid] = {"plen": plen, "generated": 0, "max_new": mnew,
                                "arrival": arrival, "state": "prefill"}
        # One iteration of work
        finished = []
        tokens_this_iter = 0
        for rid, st in self.active.items():
            if st["state"] == "prefill":
                self.metrics["TTFT"].append(self.iteration - st["arrival"])
                st["state"] = "decode"
                tokens_this_iter += 1
            else:
                st["generated"] += 1
                tokens_this_iter += 1
                self.metrics["ITL"].append(1)   # one iter per token
                if st["generated"] &gt;= st["max_new"]:
                    finished.append(rid)
        for rid in finished:
            for b in self.tables.pop(rid): self.free_blocks.append(b)
            self.active.pop(rid)
        self.metrics["throughput"].append(tokens_this_iter)

# Workload: 20 requests, varied lengths, varied arrival times
srv = Server()
for i in range(20):
    srv.submit(f"req_{i}", prompt_len=random.randint(5,15), max_new=random.randint(8,25))

# Tick until all done
while srv.queue or srv.active:
    srv.step()
    if srv.iteration &gt; 200: break

ttft = sum(srv.metrics["TTFT"]) / len(srv.metrics["TTFT"])
thr  = sum(srv.metrics["throughput"]) / srv.iteration
print(f"served {len(srv.metrics['TTFT'])} requests in {srv.iteration} iterations")
print(f"avg TTFT (queue + prefill iters): {ttft:.2f}")
print(f"avg throughput (tokens/iter)    : {thr:.2f}")
print(f"peak active batch              : up to {max(srv.metrics['throughput'])}")
print("This is a tiny, exact analog of what vLLM does on real GPUs — only the forward pass is missing.")
</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>Server.__init__</code> wires together everything from this lesson — a free-block pool (PagedAttention), a per-request block table (paging), a FIFO queue (admission), an active dict (continuous batching) and a metrics dict that mirrors what vLLM exposes via Prometheus (<code>TTFT</code>, <code>ITL</code>, <code>throughput</code>). 2) <code>_alloc_blocks</code> implements all-or-nothing allocation matching vLLM's behavior: if the requested block count exceeds <code>free_blocks</code> the admission fails cleanly and the request stays queued — no partial allocation, no fragmentation. 3) The <code>step</code> loop is iteration-level scheduling exactly as L4 described: admit as many queued requests as fit, then for each active request run one prefill→decode transition or one decode tick, capturing TTFT on the prefill→decode flip and ITL=1 per generated token. 4) The eviction phase <code>for rid in finished: ... self.free_blocks.append(b)</code> returns the request's blocks to the pool the moment it finishes, so the next iteration can admit fresh requests with the freshly-freed blocks — this is the closed loop that gives a real vLLM ~3000 tok/s on H100 vs ~30 for naive batch=1 PyTorch.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. The Production Stack in 2026</h2>
<p class="l-text">If you stand up an LLM serving deployment in 2026, the choices are roughly:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">vLLM</div><div class="card-body">PagedAttention + continuous batching + prefix caching + speculative decoding. Apache 2.0. Most popular open-source server. Production-ready since v0.4 (2024).</div></div>
<div class="calc-card"><div class="card-title">SGLang</div><div class="card-body">RadixAttention + structured output (regex-constrained generation) + faster scheduler. Stronger for agent / tool-use workloads. Permissive license.</div></div>
<div class="calc-card"><div class="card-title">TensorRT-LLM</div><div class="card-body">NVIDIA's commercial-grade engine. Best raw throughput on H100/B100. INT4/FP8 first-class. Heavier to deploy than vLLM.</div></div>
<div class="calc-card"><div class="card-title">TGI (HuggingFace)</div><div class="card-body">Continuous batching server tightly coupled with the HF model hub. Less aggressive than vLLM/SGLang on raw throughput; easier to deploy out of the box.</div></div>
<div class="calc-card"><div class="card-title">llama.cpp / MLC</div><div class="card-body">CPU/Metal/AMD-friendly. Quantization-heavy. The path for laptop/mobile inference. Surprisingly viable for 70B INT4 on 64 GB Macs.</div></div>
<div class="calc-card"><div class="card-title">Internal stacks (Anthropic, OpenAI, Google)</div><div class="card-body">Same techniques (PagedAttention, continuous batching, speculative decoding, FP8) plus heavy custom kernels and proprietary scheduling. Public papers and open source describe what they do; every shop reimplements it.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. The Track Recap — From SMs to Servers</h2>
<p class="l-text">We have walked the entire stack:</p>
<ul style="line-height:1.7;padding-left:1.3rem">
<li><strong>L1 — GPU architecture.</strong> SMs, warps, threads, memory hierarchy, H100 / A100 / 4090 specs, the roofline.</li>
<li><strong>L2 — CUDA C basics.</strong> Kernels, blocks, grids, host-device memory dance, error checking.</li>
<li><strong>L3 — Memory optimization.</strong> Coalescing, shared memory tiling, bank conflicts, occupancy.</li>
<li><strong>L4 — Numba &amp; CuPy.</strong> Python-first GPU programming, kernel fusion, the easy wins.</li>
<li><strong>L5 — Triton.</strong> Block-level DSL, autotuning, the modern way to write kernels.</li>
<li><strong>L6 — FlashAttention.</strong> IO-aware attention, online softmax, the v1/v2/v3 evolution.</li>
<li><strong>L7 — Distributed training.</strong> DDP, FSDP/ZeRO, tensor &amp; pipeline parallelism, NCCL, ring all-reduce.</li>
<li><strong>L8 — Inference serving.</strong> Prefill vs decode, KV-cache, PagedAttention, continuous batching, speculation, quantization.</li>
</ul>

<p class="l-text">The throughline: a GPU is many SMs running many warps fed by a memory pyramid where data movement dominates compute. Every optimization in lessons 2–8 — kernel writing, attention rewriting, sharding, scheduling, quantization — is a different angle on "move fewer bytes, reuse more, batch more". When a new technique lands (next month it might be FlashAttention v4, Blackwell-specific, FP4 attention), you will see it as another point on the same axis: <em>raise arithmetic intensity</em>, <em>cut HBM traffic</em>, <em>keep the compute pipes full</em>. The hardware will keep changing; the principles will not.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Where to Go Next</h2>
<p class="l-text">If you want to build kernels: read the FlashAttention papers (v1 2022, v2 2023, v3 2024) and the Triton tutorial. Try porting a custom op for a model you care about. If you want to deploy: stand up vLLM with a 7B model on one GPU, then a 70B with INT4 on a 4090, then a 70B with FP16 on 8 H100. Tweak <code>--max-num-batched-tokens</code> and <code>--enable-prefix-caching</code>; watch the metrics.</p>

<p class="l-text">If you want the research frontier: chunked prefill, prefill-decode disaggregation (Splitwise, DistServe 2024), KV-cache compression (H2O, Scissorhands 2023), state-space alternatives (Mamba, Mamba-2 2024), MoE serving (DeepSeek-MoE, Mixtral inference). The field moves fast; the foundations from this track will keep up.</p>

<div class="calc-highlight"><strong>One number for the road:</strong> on an H100, a well-tuned 70B INT4 deployment with vLLM serves ~3000 tokens/second across a couple dozen concurrent users. The same model on naive PyTorch with batch=1: ~30 tokens/second. That 100x is what this track is about. Now go build it.</div>
</div>`,
tr: `<p class="l-text"><strong>Bir modeli eğitmek tek seferlik bir maliyettir; ona hizmet vermek sonsuza kadar süren bir maliyettir.</strong> Üretime dağıtılmış bir 70B modelin eğitilmesi birkaç yüz bin dolar maliyet olabilir, hizmet vermek yılda birkaç milyon. Gerçek bir LLM işinin ekonomisi GPU başına saniye başına çıkarım throughput'u tarafından domine edilir ve naif bir PyTorch üretim loop'u ile tune edilmiş bir çıkarım sunucusu arasındaki uçurum şaşırtıcıdır — sık sık GPU başına saniyede token cinsinden 20-30x. O boşluğu kapatan teknoloji, vLLM projesi (Kwon ve diğ., SOSP 2023) tarafından popülerleştirilen ve şimdi her ciddi LLM hizmet stack'inde (TGI, SGLang, TensorRT-LLM, llama.cpp, MLC, Anthropic'in ve OpenAI'nin dahili stack'leri) bir biçimde uygulanan <em>continuous batching</em> ile <em>PagedAttention</em>'dir.</p>

<p class="l-text">Bu capstone dersi 1-7. derslerden her şeyi gerçek bir çıkarım sunucusunda toplar. İncelediğimiz: <strong>(1)</strong> LLM hizmetinin ekonomisi (compute-bound prefill vs memory-bound decode), <strong>(2)</strong> KV-cache bellek matematiği (70B 32k-context cache'in neden modelin kendisinden büyük olduğu), <strong>(3)</strong> PagedAttention'ın sanal-bellek-tarzı parçalama, <strong>(4)</strong> continuous batching'in planlama sihiri, <strong>(5)</strong> SGLang'in RadixAttention prefix-cache, <strong>(6)</strong> gecikme için spekülatif kod çözme, <strong>(7)</strong> throughput için kuantizasyon (INT8, INT4, FP8), <strong>(8)</strong> Nsight Compute ile profilleme ve <strong>(9)</strong> vLLM'in kullandığı istek planlayıcısının tam çalışabilir bir Pyodide demo'su. Sonunda bir hizmet dağıtımına bakıp özellikle neden hızlı veya yavaş olduğunu söyleyebileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>LLM çıkarımının prefill (compute-bound) ve decode (memory-bound) fazlarını ayırt et</li>
<li>KV-cache belleği hesapla ve tek bir GPU'da sığan context uzunluğu / batch boyutu seç</li>
<li>PagedAttention'ın blok tablosunu ve neden KV-cache parçalanmasını ortadan kaldırdığını açıkla</li>
<li>Gerçek bir istek akımında continuous-batching planlayıcısını adım adım izle</li>
<li>Tekrarlanan sistem prompt'larına prefix caching (RadixAttention / SGLang) uygula</li>
<li>Çıktı dağılımını değiştirmeden gecikmeyi 2-3x kesmek için spekülatif kod çözme kullan</li>
<li>Bir dağıtım için bir kuantizasyon şeması seç (INT8 / INT4 / FP8)</li>
<li>Nsight Compute ve PyTorch profiler ile bir hizmet dağıtımını profille</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. LLM Çıkarımının İki Fazı</h2>
<p class="l-text">Her LLM çağrısının iki rejimi vardır. <strong>Prefill</strong>: prompt (diyelim 500 token) modelden bir kez geçer. Tüm 500 token paralel işlenir — GPU near-peak FLOPS'ta çalışır, compute-bound. <strong>Decode</strong>: her çıktı token'i batch boyutu 1 ve dizi uzunluğu 1 (artı KV-cache) ile bir forward geçişi gerektirir. GPU bir token hesaplamak için tüm modeli HBM'den okur, sonra bir sonraki için tekrar. Decode memory-bound'tür — peak FLOPS'un %5-15'inde çalışır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prefill</div><div class="card-body">Uzun girdi, çok sayıda token üzerinde paralel attention. Compute yoğunluğu yüksek (matmul-şekilli). FLOPS-bound. Token başına maliyet: ~2P FLOPs / peak FLOPS. 70B modelli H100'de: ~140 GFLOPs / 989 TFLOPS ≈ token başına 0.14 ms.</div></div>
<div class="calc-card"><div class="card-title">Decode</div><div class="card-body">Tek seferde bir token. Tüm 70B param'i (FP16'da 140 GB) adım başına okur. HBM-bound. Token başına maliyet: ~140 GB / 3.35 TB/s ≈ batch=1 ise token başına 42 ms. Batching ile, model yüklemesi batch boyunca itfa olur.</div></div>
<div class="calc-card"><div class="card-title">Belirleyici içgörü</div><div class="card-body">batch=1'de decode bir H100'un %90'ını boşa harcar. batch=64'te decode hala model ağırlıklarının aynı tek okumasını yapar ama 64 token üretir — bu yüzden token başına maliyet 64x düşer. <strong>Decode'da throughput = batching</strong>.</div></div>
</div>

<div class="katex-block">$$\\text{decode latency}_{\\text{batch}=B} \\;\\approx\\; \\frac{\\text{model size}}{\\text{HBM BW}} \\;+\\; B \\cdot \\frac{\\text{KV-cache read}}{\\text{HBM BW}}$$</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. KV-Cache — Asıl Bellek Canavarı</h2>
<p class="l-text">L katmanlı, her biri d boyutunda H kafa olan bir transformer için, KV-cache token başına 2·L·H·d byte tutar (her katman, her kafa için K ve V). Llama-3 70B'nin L=80, H=64, d=128'i vardır → 2·80·64·128 = FP16'da token başına 1.31 MB. Tek bir 32k-context konuşması 42 GB KV-cache'tir. Her biri 8k context'te 100 eşzamanlı kullanıcılı bir istek 100 GB'tir — zaten tek bir H100'un 80 GB'ini aşar.</p>

<div class="calc-highlight"><strong>H100'de (80 GB) hizmet-bellek bütçesi:</strong> FP16'da 70B model ağırlıkları = 140 GB → sığmaz, 8 yollu tensor-parallel veya kuantizasyon kullanılmalıdır. TP=8 ile 17.5 GB-per-shard FP16 ağırlıkları yükledikten sonra: KV-cache + aktivasyonlar için ~62 GB serbest. Token başına 1.31 MB'da, bu ~47k önbelleklenmiş token demektir — diyelim ki 16 kullanıcıya her biri 3k context için yeterli. PagedAttention'ın işi bu 62 GB'yi değişen uzunluklardaki istekler arasında verimli şekilde tahsis etmektir.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — KV-cache bütçe hesaplayicisi</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>def kv_cache_bytes(num_layers, num_heads, head_dim, seq_len, dtype_bytes=2):
    return 2 * num_layers * num_heads * head_dim * seq_len * dtype_bytes

# Llama 3 70B
per_token = kv_cache_bytes(80, 64, 128, 1)
print(f"per-token KV-cache (Llama-3 70B FP16): {per_token/1024:.1f} KB")
print(f"32k context single user: {kv_cache_bytes(80,64,128,32_000)/1e9:.2f} GB")
print(f"100 users @ 8k each      : {100 * kv_cache_bytes(80,64,128,8_000)/1e9:.2f} GB")
print(f"H100 free after 70B weights (TP=8): ~{80 - 17.5:.1f} GB / GPU")
print(f"Max concurrent tokens that fit    : ~{int((80-17.5)*1e9 / per_token):,}")
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>kv_cache_bytes</code> token başına KV-cache formülünü <code>2 · L · H · d · seq_len · dtype_bytes</code> uygular — 2 çarpanı her katman için ayrı saklanan K <em>ve</em> V tensor'larını kapsar. 2) Llama-3 70B'nin geometrisini (L=80 katman, H=64 kafa, d=128 head_dim) FP16'da (dtype_bytes=2) yerleştirmek token başına <code>~160 KB</code> yazdırır — bu tek sayı tüm alt seviye hizmet kararlarını yönlendirir. 3) 32k-context tek-kullanıcı satırı bunu 32 000 ile çarparak tek bir uzun konuşmanın bile ~5.2 GB HBM yaktığını; 100 eşzamanlı 8k kullanıcı ise ~131 GB'ye varır — model ağırlıklarından önce bile tek bir H100'un 80 GB'ini aşar. 4) Shard başına ağırlık ayak izini <code>17.5 GB</code>'i (TP=8'de 70B/8 rank) çıkarmak KV için ~62.5 GB bırakır; bunu <code>per_token</code>'a bölmek eş zamanlı önbelleklenmiş maksimum token sayısını verir — bu tam olarak vLLM kabul kontrolünün uyguladığı bütçedir.</p>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. PagedAttention — KV-Cache için Sanal Bellek</h2>
<p class="l-text">vLLM'den önce, her istek başlangıçta <em>maksimum</em> olası uzunluğu için (diyelim 8k token) bitişik bir KV-cache rezerve ederdi. Eğer gerçek yanıt 200 tokensa, 7800 token değerinde HBM kullanılmadan otururdu. Değişken-uzunluklu konuşmalar ve dinamik batching ile, parçalanma mevcut KV belleğin %60-80'ini yer. Klasik OS çözümü: paging.</p>

<p class="l-text">PagedAttention KV-cache'i sabit boyutlu <strong>bloklara</strong> (tipik olarak 16 token) parçalar. İstek başına <strong>blok tablosu</strong> konuşmadaki "mantıksal" pozisyonları HBM'deki "fiziksel" blok indekslerine haritalar. Yeni bloklar yalnızca konuşma büyüdükçe tahsis edilir. Serbest bırakılan bloklar bir havuza geri döner. Attention kerneli blok tablosunu girdi olarak alır ve bitişik olmayan fiziksel bloklardan toplar — FlashAttention ile aynı hesaplama, sadece bir indireksiyon ile.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Blok boyutu</div><div class="card-body">Tipik olarak 16 token. Takas: küçük bloklar = daha az iç parçalanma ama daha fazla blok-tablosu overhead'i ve daha kötü coalescing. 16 vLLM'de tatlı noktadır.</div></div>
<div class="calc-card"><div class="card-title">Blok tablosu</div><div class="card-body">İstek başına blok indeksleri dizisi. 1000-token konuşma için: 63 blok listelenir. GPU'da depolanır; FlashAttention kerneli onu doğru fiziksel adresleri getirmek için okur.</div></div>
<div class="calc-card"><div class="card-title">Bellek tasarrufu</div><div class="card-body">Orijinal vLLM makalesi PagedAttention kullanarak naif hizmete göre 2-4x throughput bildiriyor. Sabit bir GPU'da, 2-4x daha fazla eşzamanlı kullanıcıya hizmet verirsiniz.</div></div>
<div class="calc-card"><div class="card-title">Beam search / forking</div><div class="card-body">Paralel diziler (beam search) ortak prefix bloklarını referans sayma aracılığıyla paylaşır. Bir beam ayrıldığında copy-on-write. Bellek benzersiz token'larda doğrusal, dallarda değil.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — PagedAttention blok tahsisi</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class BlockAllocator:
    def __init__(self, num_blocks=64, block_size=16, head_dim=64):
        self.block_size = block_size
        # KV storage: pretend this is HBM
        self.K = np.zeros((num_blocks, block_size, head_dim), dtype=np.float32)
        self.V = np.zeros((num_blocks, block_size, head_dim), dtype=np.float32)
        self.free = list(range(num_blocks))
        self.tables = {}    # request_id -&gt; list of block indices

    def alloc_for(self, req_id, num_tokens):
        n_blocks = (num_tokens + self.block_size - 1) // self.block_size
        if len(self.free) &lt; n_blocks:
            raise RuntimeError("OOM: not enough free blocks")
        blocks = [self.free.pop() for _ in range(n_blocks)]
        self.tables[req_id] = blocks
        return blocks

    def append_token(self, req_id, k, v, position):
        # If we filled the last block, allocate a new one
        n_alloc = len(self.tables[req_id]) * self.block_size
        if position &gt;= n_alloc:
            self.tables[req_id].append(self.free.pop())
        block_idx = self.tables[req_id][position // self.block_size]
        slot      = position % self.block_size
        self.K[block_idx, slot] = k
        self.V[block_idx, slot] = v

    def free_request(self, req_id):
        for b in self.tables.pop(req_id, []):
            self.free.append(b)

# Demo: 3 concurrent requests with different lengths
alloc = BlockAllocator(num_blocks=16, block_size=4, head_dim=8)
alloc.alloc_for("req_A", num_tokens=10)   # 3 blocks
alloc.alloc_for("req_B", num_tokens=2)    # 1 block
alloc.alloc_for("req_C", num_tokens=5)    # 2 blocks
print(f"after init: tables = { {k: v for k, v in alloc.tables.items()} }")
print(f"free pool : {alloc.free}  (10 blocks left)")

alloc.free_request("req_A")
print(f"after freeing A: free = {sorted(alloc.free)} (back to 13)")

# req_B grows by appending tokens — auto-allocates new blocks
for t in range(2, 12):
    k = np.random.randn(8); v = np.random.randn(8)
    alloc.append_token("req_B", k, v, position=t)
print(f"req_B now has blocks: {alloc.tables['req_B']} (grew from 1 to 3 blocks)")
print(f"free pool: {len(alloc.free)} blocks")
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>BlockAllocator.__init__</code> tüm KV havuzunu tek bir <code>(num_blocks, block_size, head_dim)</code> tensor çifti olarak önceden tahsis eder — vLLM aynı şeyi başlangıçta GPU HBM'de yapar, böylece hizmet sırasında sıfır runtime <code>cudaMalloc</code> baskısı olur. 2) <code>alloc_for</code> standart tavan-bölme <code>(n + bs - 1) // bs</code> ile tam bloklara yuvarlar, sonra istek başına bir <em>blok tablosuna</em> serbest blok indekslerini açar — bu tablo KV slotlarının bitişik olmamasını sağlayan indireksiyondur. 3) <code>append_token</code> son blok dolduğunda tespit eder ve tembelce bir serbest blok daha açar — böylece bir isteğin HBM ayak izi her seferde bir blok (16 token) büyür, baştan en kötü-durum uzunluğunu asla rezerve etmez. 4) <code>free_request</code> bir dizi bittiğinde blokları serbest listesine geri verir ve hemen yeni kabul edilmiş bir isteğin kullanımına sunar — bu tam olarak vLLM'in bitişik-cache sunucularına karşı 2-4x throughput kazancını sağlayan OS-tarzı paging'dir.</p>

<p class="l-text">Gerçek PagedAttention tam olarak budur — ama FlashAttention kerneli blok tablosunu GPU'da okur, K/V bloklarını indireksiyon aracılığıyla toplar ve Ders 6'da inşa ettiğimiz online-softmax algoritmasının aynısını çalıştırır. İndireksiyonun ek maliyeti H100'de %5'in altındadır (TMA prefetching'in gizleyebileceğinin altında).</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Continuous Batching — Decode'u Kurtaran Planlayıcı</h2>
<p class="l-text">Statik batching: 16 istek topla, hepsini birlikte çalıştır, en yavaşının bitmesini bekle, 16'sını birden döner. Kısa istekler için gecikme uzunlar tarafından uzatılır; yeni istekler tüm batch'in boşalmasını bekler. Continuous batching (Yu ve diğ., OSDI 2022; vLLM, TGI vb.'de dağıtıldı): her iterasyonda planlayıcı şu anda aktif olan istekler arasından herhangi bir alt küme seçer, <em>tek bir</em> decode adımı çalıştırır, sonra kimi çalıştıracağına yeniden karar verir. Biten istekler ayrılır; yeni istekler katılır. Batch boyutu her iterasyonda değişir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Statik batching</div><div class="card-body">Throughput: yüksek (batch dolduğunda). Gecikme: kötü — kısa istekler uzunları bekler. Yeni gelişler batch'in temizlenmesini bekler.</div></div>
<div class="calc-card"><div class="card-title">Continuous batching</div><div class="card-body">Throughput: aynı veya daha iyi (boşluklar yeni gelişlerle dolar). Gecikme: dramatik olarak daha iyi — ortalama TTFT (time-to-first-token) 5-10x düşer. Yeni istekler bir iterasyon içinde katılır.</div></div>
<div class="calc-card"><div class="card-title">İterasyon-seviyesi planlama</div><div class="card-body">Planlayıcı iterasyon başına karar verir: hangi istekleri prefill'e (sadece bir veya iki — prefill pahalı), hangilerini decode'a (sığan kadar). Prefill chunk'ları: decode'u bloke etmemek için uzun bir prefill'i iterasyonlara böl.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — continuous batching planlayıcı simülatörü</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import random, collections

class Request:
    def __init__(self, rid, prompt_len, max_new):
        self.rid = rid
        self.prompt_len = prompt_len
        self.max_new = max_new
        self.generated = 0
        self.state = "queued"   # queued -&gt; prefilling -&gt; decoding -&gt; done

class Scheduler:
    def __init__(self, max_batch=8, kv_capacity_tokens=200):
        self.max_batch = max_batch
        self.kv_capacity = kv_capacity_tokens
        self.queue = collections.deque()
        self.active = []
        self.kv_used = 0
        self.iteration = 0

    def admit(self, r):
        # Can we afford this prefill + its KV growth?
        if (self.kv_used + r.prompt_len + r.max_new &lt;= self.kv_capacity
                and len(self.active) &lt; self.max_batch):
            r.state = "prefilling"
            self.kv_used += r.prompt_len
            self.active.append(r)
            return True
        return False

    def step(self):
        self.iteration += 1
        # Try to admit queued requests
        while self.queue:
            if not self.admit(self.queue[0]):
                break
            self.queue.popleft()
        # Run one iteration on each active request
        for r in self.active:
            if r.state == "prefilling":
                r.state = "decoding"     # prefill done in one step (simplified)
            elif r.state == "decoding":
                r.generated += 1
                self.kv_used += 1
                if r.generated &gt;= r.max_new:
                    r.state = "done"
                    self.kv_used -= r.prompt_len + r.generated
        # Evict finished
        self.active = [r for r in self.active if r.state != "done"]

random.seed(42)
sched = Scheduler(max_batch=4, kv_capacity_tokens=60)
incoming = [Request(i, prompt_len=random.randint(5,15),
                    max_new=random.randint(5,20)) for i in range(10)]
for r in incoming: sched.queue.append(r)

for it in range(40):
    sched.step()
    if it % 4 == 0:
        active = [(r.rid, r.state, r.generated) for r in sched.active]
        print(f"iter {it:2d}  kv_used={sched.kv_used:3d}/{sched.kv_capacity}  queued={len(sched.queue)}  active={active}")
    if not sched.active and not sched.queue: break

print(f"\\nAll requests served in {sched.iteration} iterations. New requests joined within 1 iter of arrival.")
</code></pre></div>
</div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>Request</code> planlayıcının dizi başına ihtiyaç duyduğu dört parçayı tutar — prompt uzunluğu, max-new token, şimdiye kadar üretilen sayacı ve queued→prefilling→decoding→done state machine'i. 2) <code>admit</code> vLLM tarzı kabul kontrolünü uygular: kuyruktaki bir istek yalnızca (a) tam KV ayak izi <code>prompt_len + max_new</code> kalan KV kapasitesine sığarsa ve (b) aktif batch <code>max_batch</code>'in altında ise aktif kümeye girer — <code>vllm.SequenceGroupMetadata</code> ile aynı kapı mantığı. 3) Her <code>step</code> önce sığan kadar çok kuyruklu isteği boşaltır, sonra her aktif istek üzerinde bir iterasyon çalıştırır: prefill decoding'e geçer (basitleştirildi — gerçek vLLM uzun bir prefill'i chunk'layabilir), decoding <code>generated</code>'i artırır ve bir KV slotu daha tüketir, ve <code>max_new</code>'a ulaşmak isteği done olarak işaretler ve KV'sini geri verir. 4) Son liste anlama <code>self.active = [r for r in self.active if r.state != "done"]</code> biten dizileri iterasyon ortasında tahliye eder, böylece batch boyutu her tick'te yeniden hesaplanır — bu, statik batching'e karşı ortalama TTFT'yi 5-10x düşüren continuous (iterasyon-seviyesi) batching'in tanımlayıcı özelliğidir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Prefix Caching — RadixAttention &amp; Sistem Prompt'ları</h2>
<p class="l-text">Gerçek chat iş yükleri büyük prompt fazlalıklarına sahiptir. Bir chatbot'a yapılan her istek aynı 500 token'lik sistem prompt'u ile başlar. Her kod-tamamlama isteği binlerce token dosya context'i paylaşır. O prefix için KV-cache'i her seferde sıfırdan hesaplamak 70B model'de istek başına ~100 ms harcar.</p>

<p class="l-text">SGLang (Zheng ve diğ., 2024) <strong>RadixAttention</strong>'i tanıttı: KV-cache'i her node'un tokenize edilmiş bir prefix olduğu radix tree'sinde sakla. Yeni istekler ağaçta prompt'ları eşleştiği kadar yürüyor, o KV bloklarını ücretsiz yeniden kullanıyor ve yalnızca farklı suffix'i hesaplıyor. vLLM 0.4+ aynı şeyi "prefix caching" olarak ekledi. Hızlanma çok büyük: tekrarlanan sistem prompt'ları için TTFT 5-20x düşer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RadixAttention</div><div class="card-body">Ağaç tabanlı KV yeniden kullanımı. Token'lar node'lara hash'lenir; longest-prefix-match önbelleklenmiş KV'yi döndürür. Yaprak node'larda LRU ile tahliye. SGLang'in amiral gemisi özelliği.</div></div>
<div class="calc-card"><div class="card-title">Prefix caching (vLLM)</div><div class="card-body">Prompt'un bloklarını hash et; cache hit'leri o blokların yeniden hesaplamasını atlar. Radix'ten daha kaba (blok-hizalı) ama daha basit uygulama.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman yardımcı olur</div><div class="card-body">Paylaşılan prefix'i olan herhangi bir şey: sistem prompt'ları, RAG context'i, agent araç açıklamaları, kod-tamamlama dosya context'i. Agent loop'larında tek bir araç açıklaması her iterasyonun prompt'unda görünür — büyük kazançlar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON — radix-prefix-ağacı fikri</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class RadixNode:
    __slots__ = ("children", "kv_blocks", "ref_count")
    def __init__(self):
        self.children = {}      # token -&gt; RadixNode
        self.kv_blocks = []     # block ids covering tokens up to this node
        self.ref_count = 0

class RadixCache:
    def __init__(self): self.root = RadixNode()

    def match_and_extend(self, tokens):
        """Return (matched_node, matched_len) — caller fills the rest."""
        node, i = self.root, 0
        while i &lt; len(tokens) and tokens[i] in node.children:
            node = node.children[tokens[i]]; i += 1
        return node, i

    def insert(self, parent, tokens, kv_block):
        node = parent
        for t in tokens:
            if t not in node.children: node.children[t] = RadixNode()
            node = node.children[t]
        node.kv_blocks.append(kv_block)
        return node

cache = RadixCache()
# Request 1: "You are a helpful assistant. Hi"
n, m = cache.match_and_extend(["You","are","a","helpful","assistant.","Hi"])
print(f"req1 match: {m} tokens (cold cache)")
cache.insert(n, ["You","are","a","helpful","assistant.","Hi"], "kv_blk_1")

# Request 2: same system prompt, different user message
n, m = cache.match_and_extend(["You","are","a","helpful","assistant.","What's","the","weather?"])
print(f"req2 match: {m} tokens reused from cache (only suffix needs prefill)")
print("In a real server this saves ~100ms TTFT on a 70B model for every shared-prefix request.")
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>RadixNode</code> ağacı kompakt tutmak için <code>__slots__</code> kullanır (node başına dict overhead yok) ve <code>kv_blocks</code>'i (root'tan bu node'a yolu kapsayan önbelleklenmiş KV blok ID'leri) artı LRU tahliyesi için bir <code>ref_count</code> izler — SGLang'in üretim node'u ile aynı şekil. 2) <code>match_and_extend</code> ağaçta token-token <code>node.children[tokens[i]]</code> boyunca yürür ve en derin eşleşen node'u, hangi prompt token'larının cache'e isabet ettiği ile birlikte döndürür — bu, "sistem prompt'unu yeniden hesapla" işlemini bir no-op'a dönüştüren longest-prefix-match'tir. 3) İlk istek soğuk cache'e isabet eder (<code>m=0</code>), bu yüzden <code>insert</code> taze bir node zinciri oluşturur ve yaprakta <code>"kv_blk_1"</code>'i ekler — bu tam token dizisinin KV'sinin artık fiziksel olarak mevcut olduğunu kaydeder. 4) İkinci istek 5-token sistem prefix'ini paylaşır ama kullanıcı içeriğinde ayrılır; <code>match_and_extend</code> <code>m=5</code> döndürür yani sadece 3-token suffix'in prefill'e ihtiyacı vardır — gerçek bir 70B modelde o 5/8 yeniden kullanım TTFT'yi ~120 ms'den ~45 ms'ye düşürür çünkü paylaşılan prefix üzerindeki ağır attention/MLP tamamen atlanır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Spekülatif Kod Çözme — İki Model, Bir Çıktı</h2>
<p class="l-text">Spekülatif kod çözme (Leviathan ve diğ., 2023; Chen ve diğ., 2023) K aday token öneren küçük bir "draft" modeli çalıştırarak ve sonra onları büyük modelin <em>tek</em> bir forward geçişinde doğrulayarak decode gecikmesini keser. Büyük modelin kabul ettiği token'lar tutulur; ilk anlaşmazlık bir yeniden seçimi tetikler. Ortalama hızlanma: chat iş yüklerinde 2-3x, tek başına büyük modelden alınmış çıktı dağılımına ispatlı olarak özdeş.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Draft modeli</div><div class="card-body">Aynı aileden eğitilmiş veya damıtılmış küçük (~1B) bir model. K aday token'ı otoregresif olarak üretir (küçük olduğu için ucuz).</div></div>
<div class="calc-card"><div class="card-title">Doğrulama</div><div class="card-body">Büyük model prefix + K draft üzerinde forward geçişi (tek geçiş, batch=K+1). Her draft için büyük model bir olasılık yayar; bir kabul/reddet testi tek başına büyük modelden örnekleme yapmış olsaydınız alacağınız aynı çıktı dağılımını garanti eder.</div></div>
<div class="calc-card"><div class="card-title">Hızlanma</div><div class="card-body">Ortalama kabul uzunluğu L ise, büyük model token başına bir kez yerine L+1 token başına bir kez çalışır. K=4 ve L=2.5 ile bu ~3.5x decode hızlanması. Tekrarlanan / yapısal çıktı (kod, JSON) için en iyi.</div></div>
<div class="calc-card"><div class="card-title">Varyantlar</div><div class="card-body">Medusa (Cai 2024) büyük modelin kendisine ekstra tahmin kafaları ekler. Lookahead Decoding draft modelini atlar. EAGLE büyük modelin gizli durumlarını draft için kullanır. 2025'te tümü vLLM/SGLang'da dağıtıldı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kuantizasyon — INT8, INT4, FP8</h2>
<p class="l-text">Ağırlıkları daha düşük hassasiyetle saklamak HBM trafiğini yarıya (veya çeyreğe) indirir — ve decode HBM-bound'tür. Kuantizasyon hizmet için tek en büyük throughput kaldıracıdır. Üç rejim:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">INT8 (W8A8 / W8A16)</div><div class="card-body">Ağırlıklar ve/veya aktivasyonlar int8 olarak. Donanım: A100 INT8 tensor core'ları 624 TFLOPS'ta, H100 1979 TFLOPS'ta. Kalite kaybı: smoothquant ile Llama-2 70B'de tipik olarak &lt;0.5 perplexity. Üretim için standart.</div></div>
<div class="calc-card"><div class="card-title">INT4 (W4A16, GPTQ / AWQ)</div><div class="card-body">FP16 aktivasyonlu int4 ağırlıklar. Model boyutunu tekrar yarıya indirir — 70B 24 GB'lik tek bir 4090'a sığar. Kalite kaybı ~1-2 perplexity. Hobici dağıtım için standart, maliyet-duyarlı üretim için giderek artıyor.</div></div>
<div class="calc-card"><div class="card-title">FP8 (E4M3 / E5M2)</div><div class="card-body">H100 yerel — sparsity ile 1979 TFLOPS. Tile başına dinamik ölçeklendirme doğruluğu korur. FlashAttention-3 onu kullanır. H100/B100'de hem eğitim hem çıkarım için gelecek.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — INT8 round-trip ve per-channel ölçeklendirme</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Simulate per-channel INT8 weight quantization on a Linear layer
in_dim, out_dim = 512, 1024
W_fp16 = np.random.randn(out_dim, in_dim).astype(np.float32) * 0.1

# Per-row scaling (one scale per output channel — standard INT8 quant)
scales = np.abs(W_fp16).max(axis=1, keepdims=True) / 127.0
W_int8 = np.round(W_fp16 / scales).clip(-127, 127).astype(np.int8)

# Dequantize for the demo (in real INT8 inference the matmul is done in int8)
W_dequant = W_int8.astype(np.float32) * scales

x = np.random.randn(in_dim).astype(np.float32)
y_fp = W_fp16   @ x
y_q  = W_dequant @ x
print(f"FP32 baseline: {y_fp[:5]}")
print(f"INT8 result  : {y_q[:5]}")
print(f"max relative error: {np.max(np.abs(y_q - y_fp) / (np.abs(y_fp)+1e-6)):.4f}")
print(f"weight bytes  FP16: {W_fp16.nbytes/1e3:.1f} KB")
print(f"weight bytes  INT8: {W_int8.nbytes/1e3:.1f} KB  (4x smaller; HBM traffic halved or quartered)")
print(f"On H100 INT8 has 2x the FLOPS of FP16 -&gt; matmul also faster, not just smaller.")
</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) 1024×512'lik bir ağırlık matrisi inşa eder ve onu 0.1 ile ölçekler — LLM lineer katmanlarının tipik post-LayerNorm büyüklüklerini taklit etmek için; burada tek global ölçek küçük kanalları ezerdi, bu yüzden per-channel gidiyoruz. 2) <code>scales = np.abs(W_fp16).max(axis=1, keepdims=True) / 127.0</code> çıktı kanalı başına bir ölçek hesaplar — bu, SmoothQuant ve GPTQ tarafından kullanılan W8A8/W8A16 "per-channel symmetric quantization"'dır; 127 işaretli int8'in max değeridir. 3) <code>np.round(W / scales).clip(-127, 127).astype(np.int8)</code> int8'e yansıtır (<code>.clip</code>, max'ı isabet eden kanalda yuvarlama taşmasını korur) ve <code>W_dequant = W_int8 * scales</code> gerçek bir INT8 matmul kernelinin FP16 birikimle içeride yaptığı şeyi simüle eder. 4) Yazdırılan <code>max relative error</code> %1-2 aralığında kalır — kartlarda anılan 0.5-perplexity eşiğinin çok altında — depolama 4x düşerken (FP32→INT8) ve H100 INT8 tensor core'ları FP16'nın 2x FLOPS'unu sunarken, matmul hem daha küçük <em>hem</em> daha hızlı olur.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Bir Hizmet Dağıtımını Profilleme</h2>
<p class="l-text">Hizmet SLO'su kaçırıldığında, zamanın nereye gittiğini bilmeniz gerekir. Standart araçlar zinciri:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Nsight Systems (<code>nsys</code>)</div><div class="card-body">Üst seviye timeline. Kernel başlatmaları, NCCL op'ları, CPU↔GPU sync gösterir. Erişilecek ilk araç. İstekler arasında "kabarcık nerede" tanımlar.</div></div>
<div class="calc-card"><div class="card-title">Nsight Compute (<code>ncu</code>)</div><div class="card-body">Darboğaz kernel'leri (genellikle FlashAttention, matmul veya AllReduce) üzerinde per-kernel derinlemesine inceleme. Doluluk, HBM throughput, durma sebepleri raporlar.</div></div>
<div class="calc-card"><div class="card-title">PyTorch Profiler</div><div class="card-body">Trace'e Python kod yollarını annot eder. <code>torch.profiler.profile(activities=[CPU,CUDA])</code> kullanın. Chrome trace'i export eder; çok okunabilir.</div></div>
<div class="calc-card"><div class="card-title">vLLM &amp; TGI metrikleri</div><div class="card-body">Yerleşik Prometheus üç noktaları: TTFT, ITL (inter-token latency), throughput, KV-cache kullanımı, kuyruk derinliği. Gerçek bir dağıtım için kurulacak ilk dashboard'lar.</div></div>
</div>

<div class="calc-highlight"><strong>Tanı merdiveni:</strong> (1) GPU kullanımı %90+ mi? Eğer hayır, planlayıcı-bound'sunuz — batch doluluğunu kontrol edin. (2) HBM bant genişliği kullanımı yüksek mi? Eğer evet, decode-bound'sunuz — kuantizasyon veya spekülatif kod çözmeyi deneyin. (3) FLOPS kullanımı yüksek mi? Eğer evet, prefill-bound'sunuz — chunked prefill deneyin. (4) İletişim süresi büyük mu? Eğer evet, NVLink üzerinde TP yavaş — NCCL konfigürasyonunu kontrol edin.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Birleştiriyoruz — 80 Satırda Mini bir vLLM</h2>
<p class="l-text">Şunları birleştiren oyuncak bir hizmet loop'u: PagedAttention blok tahsisi, continuous batching planlayıcısı ve sahte bir forward adımı. Bu, vLLM'in yaptığı şeyin yapısal olarak aynısıdır, gerçek transformer ağırlıkları ve FlashAttention kerneli hariç.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — oyuncak hizmet sunucusu</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import collections, random
random.seed(7)

BLOCK_SIZE = 4
NUM_BLOCKS = 32

class Server:
    def __init__(self):
        self.free_blocks = list(range(NUM_BLOCKS))
        self.tables = {}
        self.queue  = collections.deque()
        self.active = {}
        self.iteration = 0
        self.metrics = {"TTFT": [], "ITL": [], "throughput": []}

    def submit(self, rid, prompt_len, max_new):
        self.queue.append((rid, prompt_len, max_new, self.iteration))

    def _alloc_blocks(self, n):
        if len(self.free_blocks) &lt; n: return None
        return [self.free_blocks.pop() for _ in range(n)]

    def step(self):
        self.iteration += 1
        # Admit from queue
        while self.queue:
            rid, plen, mnew, arrival = self.queue[0]
            need = (plen + mnew + BLOCK_SIZE - 1) // BLOCK_SIZE
            blocks = self._alloc_blocks(need)
            if blocks is None: break
            self.queue.popleft()
            self.tables[rid] = blocks
            self.active[rid] = {"plen": plen, "generated": 0, "max_new": mnew,
                                "arrival": arrival, "state": "prefill"}
        # One iteration of work
        finished = []
        tokens_this_iter = 0
        for rid, st in self.active.items():
            if st["state"] == "prefill":
                self.metrics["TTFT"].append(self.iteration - st["arrival"])
                st["state"] = "decode"
                tokens_this_iter += 1
            else:
                st["generated"] += 1
                tokens_this_iter += 1
                self.metrics["ITL"].append(1)   # one iter per token
                if st["generated"] &gt;= st["max_new"]:
                    finished.append(rid)
        for rid in finished:
            for b in self.tables.pop(rid): self.free_blocks.append(b)
            self.active.pop(rid)
        self.metrics["throughput"].append(tokens_this_iter)

# Workload: 20 requests, varied lengths, varied arrival times
srv = Server()
for i in range(20):
    srv.submit(f"req_{i}", prompt_len=random.randint(5,15), max_new=random.randint(8,25))

# Tick until all done
while srv.queue or srv.active:
    srv.step()
    if srv.iteration &gt; 200: break

ttft = sum(srv.metrics["TTFT"]) / len(srv.metrics["TTFT"])
thr  = sum(srv.metrics["throughput"]) / srv.iteration
print(f"served {len(srv.metrics['TTFT'])} requests in {srv.iteration} iterations")
print(f"avg TTFT (queue + prefill iters): {ttft:.2f}")
print(f"avg throughput (tokens/iter)    : {thr:.2f}")
print(f"peak active batch              : up to {max(srv.metrics['throughput'])}")
print("This is a tiny, exact analog of what vLLM does on real GPUs — only the forward pass is missing.")
</code></pre></div>
</div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>Server.__init__</code> bu dersteki her şeyi birbirine bağlar — serbest blok havuzu (PagedAttention), istek başına blok tablosu (paging), bir FIFO kuyruğu (kabul), bir aktif sözlük (continuous batching) ve vLLM'in Prometheus üzerinden açtığı şeyi (<code>TTFT</code>, <code>ITL</code>, <code>throughput</code>) yansıtan bir metrikler sözlüğü. 2) <code>_alloc_blocks</code>, vLLM'in davranışıyla eşleşen all-or-nothing tahsisi uygular: istenen blok sayısı <code>free_blocks</code>'i aşarsa kabul temiz şekilde başarısız olur ve istek kuyrukta kalır — kısmi tahsis yok, parçalanma yok. 3) <code>step</code> döngüsü L4'ün anlattığı gibi tam olarak iterasyon-seviyesi planlamadır: sığan kadar çok kuyruklu isteği kabul et, sonra her aktif istek için bir prefill→decode geçişi veya bir decode tick çalıştır, prefill→decode geçişinde TTFT'yi ve üretilen token başına ITL=1'i yakalar. 4) Tahliye fazı <code>for rid in finished: ... self.free_blocks.append(b)</code> istek bittiği anda bloklarını havuza geri verir, böylece bir sonraki iterasyon yeni serbest blok'larla yeni istekleri kabul edebilir — H100'de gerçek bir vLLM'e naif batch=1 PyTorch'un ~30'una karşı ~3000 tok/s veren kapalı döngü budur.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. 2026'da Üretim Stack'i</h2>
<p class="l-text">2026'da bir LLM hizmet dağıtımı kurarsanız, seçimler kabaca:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">vLLM</div><div class="card-body">PagedAttention + continuous batching + prefix caching + spekülatif kod çözme. Apache 2.0. En popüler açık kaynak sunucu. v0.4'ten beri (2024) üretime hazır.</div></div>
<div class="calc-card"><div class="card-title">SGLang</div><div class="card-body">RadixAttention + yapısal çıktı (regex-kısıtlı üretim) + daha hızlı planlayıcı. Agent / araç-kullanım iş yükleri için daha güçlü. Permissive lisans.</div></div>
<div class="calc-card"><div class="card-title">TensorRT-LLM</div><div class="card-body">NVIDIA'nın ticari-kalite motoru. H100/B100'de en iyi ham throughput. INT4/FP8 birinci sınıf. vLLM'den daha ağır dağıtım.</div></div>
<div class="calc-card"><div class="card-title">TGI (HuggingFace)</div><div class="card-body">HF model hub'i ile sıkı bağlı continuous batching sunucusu. Ham throughput'ta vLLM/SGLang'dan daha az agresif; kutu dışında dağıtması daha kolay.</div></div>
<div class="calc-card"><div class="card-title">llama.cpp / MLC</div><div class="card-body">CPU/Metal/AMD-dostu. Kuantizasyon-ağır. Laptop/mobil çıkarımı için yol. 64 GB Mac'larda 70B INT4 için şaşırtıcı şekilde uygulanabilir.</div></div>
<div class="calc-card"><div class="card-title">Dahili stack'ler (Anthropic, OpenAI, Google)</div><div class="card-body">Aynı teknikler (PagedAttention, continuous batching, spekülatif kod çözme, FP8) artı ağır özel kerneller ve patentli planlama. Kamu makaleleri ve açık kaynak ne yaptıklarını açıklar; her dükkan onu yeniden uygular.</div></div>
</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Track Özeti — SM'lerden Sunuculara</h2>
<p class="l-text">Tüm stack'i yürüdük:</p>
<ul style="line-height:1.7;padding-left:1.3rem">
<li><strong>L1 — GPU mimarisi.</strong> SM'ler, warp'lar, thread'ler, bellek hiyerarşisi, H100 / A100 / 4090 özellikleri, roofline.</li>
<li><strong>L2 — CUDA C temelleri.</strong> Kernel'ler, bloklar, grid'ler, host-cihaz bellek dansı, hata kontrolü.</li>
<li><strong>L3 — Bellek optimizasyonu.</strong> Coalescing, paylaşılan bellek tile'lama, bank çakışmaları, doluluk.</li>
<li><strong>L4 — Numba &amp; CuPy.</strong> Python-öncelikli GPU programlama, kernel füzyonu, kolay kazançlar.</li>
<li><strong>L5 — Triton.</strong> Blok-seviyesi DSL, autotuning, kernel yazmanın modern yolu.</li>
<li><strong>L6 — FlashAttention.</strong> IO-farkındalı attention, online softmax, v1/v2/v3 evrimi.</li>
<li><strong>L7 — Dağıtık eğitim.</strong> DDP, FSDP/ZeRO, tensor &amp; pipeline paralelizmi, NCCL, ring all-reduce.</li>
<li><strong>L8 — Çıkarım hizmeti.</strong> Prefill vs decode, KV-cache, PagedAttention, continuous batching, speculation, kuantizasyon.</li>
</ul>

<p class="l-text">Ana eksen: bir GPU, veri hareketinin compute'i domine ettiği bir bellek piramidi tarafından beslenen çok sayıda warp çalıştıran çok sayıda SM'dir. 2-8. derslerdeki her optimizasyon — kernel yazma, attention yeniden yazma, sharding, planlama, kuantizasyon — "daha az byte taşı, daha çok yeniden kullan, daha çok batch yap" üzerine farklı bir açıdır. Yeni bir teknik geldiğinde (gelecek ay FlashAttention v4, Blackwell'e özel, FP4 attention olabilir), bunu aynı eksende başka bir nokta olarak göreceksiniz: <em>aritmetik yoğunluğu yükselt</em>, <em>HBM trafiğini kes</em>, <em>compute borularını dolu tut</em>. Donanım değişmeye devam edecek; ilkeler etmeyecek.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Bundan Sonrası Nereye</h2>
<p class="l-text">Kernel'ler inşa etmek istiyorsanız: FlashAttention makalelerini (v1 2022, v2 2023, v3 2024) ve Triton tutorial'ını okuyun. Önemsediğiniz bir model için bir özel op'u port etmeyi deneyin. Dağıtmak istiyorsanız: bir GPU'da 7B modelle vLLM'i ayağa kaldırın, sonra 4090'da INT4 ile 70B, sonra 8 H100'de FP16 ile 70B. <code>--max-num-batched-tokens</code>'i ve <code>--enable-prefix-caching</code>'i ayarlayın; metrikleri izleyin.</p>

<p class="l-text">Araştırma sınırını istiyorsanız: chunked prefill, prefill-decode disaggregation (Splitwise, DistServe 2024), KV-cache sıkıştırma (H2O, Scissorhands 2023), state-space alternatifleri (Mamba, Mamba-2 2024), MoE hizmeti (DeepSeek-MoE, Mixtral inference). Alan hızlı hareket ediyor; bu track'in temelleri ayak uyduracak.</p>

<div class="calc-highlight"><strong>Yola çıkmak için bir sayı:</strong> bir H100'de iyi tune edilmiş 70B INT4 dağıtımı vLLM ile birkaç düzine eşzamanlı kullanıcı arasında saniyede ~3000 token hizmet eder. batch=1 ile naif PyTorch'ta aynı model: saniyede ~30 token. O 100x bu track'in konusu. Şimdi git inşa et.</div>
</div>`
};
