window.PYTORCH_L14 = {

en: `<p class="l-text"><strong>You wrote a clean PyTorch training loop. It runs at 40% of what the GPU is actually capable of.</strong> The gap is not in your model code -- it is in the gap between Python eager execution and the silicon-level tricks (Tensor Cores, kernel fusion, CUDA graphs, fp8 accumulators) that modern GPUs expose only to compiled, mixed-precision workloads. This lesson is the modern PyTorch performance playbook: <code>torch.compile</code> (the PT 2.0 graph compiler) and the precision ladder (fp32 / fp16 / bf16 / fp8) that decides how many bytes each weight, activation, and gradient consumes.</p>

<p class="l-text">We walk both axes end-to-end. Part A dissects <code>torch.compile</code>: what TorchDynamo, AOTAutograd, and Inductor each do, how the three compile modes trade compile-time for runtime, where graph breaks come from, and how to read <code>TORCH_LOGS=graph_breaks</code> output. Part B walks the precision ladder: why fp16 needs a GradScaler but bf16 does not, why H100 fp8 is the SOTA training format in 2024-25, and how to stack <code>autocast</code> + <code>compile</code> + DDP into one production-grade recipe.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The eager-vs-graph trade-off and why <code>torch.compile</code> closes it without changing your training code</li>
<li>How TorchDynamo captures Python bytecode, AOTAutograd traces forward+backward, and Inductor emits Triton kernels</li>
<li>The three compile modes -- <code>default</code>, <code>reduce-overhead</code>, <code>max-autotune</code> -- and when to pick each</li>
<li>Graph break causes and how to read <code>TORCH_LOGS=graph_breaks,recompiles</code></li>
<li>The fp32 / fp16 / bf16 / fp8 ladder: range vs precision, hardware support, when to scale gradients</li>
<li>The full recipe: <code>torch.compile</code> + <code>autocast(bf16)</code> + DistributedDataParallel, applied in the correct order</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why torch.compile Exists</h2>

<p class="l-text">PyTorch's defining choice was <em>define-by-run</em>: your model is a Python program, executed line by line, with autograd recording the trace as you go. This is what makes debugging feel like normal Python -- <code>print</code>, set breakpoints, mutate tensors. The cost is throughput: every op is a separate Python -> C++ dispatch, every kernel launch is small, and there is no opportunity to fuse adjacent ops or to pre-plan memory.</p>

<p class="l-text">TensorFlow's original answer was the opposite: build a static graph, then execute it. Faster, but the developer experience was painful enough that the entire field migrated to PyTorch. The dream was a system that <em>feels</em> like eager PyTorch but <em>runs</em> like a compiled graph. <code>torch.compile</code>, released in PyTorch 2.0 in March 2023, is that system.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eager mode</div><div class="card-body">Op-by-op Python execution. Great UX, low throughput, no fusion.</div></div>
<div class="calc-card"><div class="card-title">Static graph</div><div class="card-body">Compile once, run fast, but no Python control flow at runtime. TF 1.x style.</div></div>
<div class="calc-card"><div class="card-title">torch.compile</div><div class="card-body">Hybrid: trace the graph on first call, fall back to eager when needed.</div></div>
<div class="calc-card"><div class="card-title">JIT vs AOT</div><div class="card-body">torch.compile is JIT: it compiles at first call, caches the result.</div></div>
<div class="calc-card"><div class="card-title">User code</div><div class="card-body">Unchanged. Wrap with <code>torch.compile(model)</code> and continue training.</div></div>
<div class="calc-card"><div class="card-title">Typical speedup</div><div class="card-body">30-100% on transformers, sometimes 2x on memory-bound workloads.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">SmallTransformer</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d=<span class="num">512</span>, h=<span class="num">8</span>, layers=<span class="num">6</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        layer = nn.<span class="fn">TransformerEncoderLayer</span>(d, h, batch_first=<span class="kw">True</span>)
        self.enc = nn.<span class="fn">TransformerEncoder</span>(layer, num_layers=layers)
        self.head = nn.<span class="fn">Linear</span>(d, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">head</span>(self.<span class="fn">enc</span>(x).<span class="fn">mean</span>(dim=<span class="num">1</span>))

model = <span class="fn">SmallTransformer</span>().<span class="fn">cuda</span>()

<span class="cm"># Before: eager mode -- each op dispatches separately</span>
out = <span class="fn">model</span>(torch.<span class="fn">randn</span>(<span class="num">32</span>, <span class="num">128</span>, <span class="num">512</span>, device=<span class="str">"cuda"</span>))

<span class="cm"># After: one-line opt-in to compiled mode</span>
compiled = torch.<span class="fn">compile</span>(model)
out = <span class="fn">compiled</span>(torch.<span class="fn">randn</span>(<span class="num">32</span>, <span class="num">128</span>, <span class="num">512</span>, device=<span class="str">"cuda"</span>))
<span class="cm"># First call: ~10-30s compile latency.</span>
<span class="cm"># Every subsequent call: 30-100% faster on a typical Ampere/Hopper GPU.</span></code></pre></div>

<p class="l-text">The contract is simple: you keep writing normal PyTorch. On the first forward pass through <code>compiled(...)</code>, PyTorch traces your model, fuses adjacent ops, emits optimized kernels, and caches the result keyed by input shapes and dtypes. Subsequent calls with the same shapes hit the cache and run the compiled graph. Shape changes trigger a recompile; we will see how to avoid that thrash in section 5.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Inside the Stack: TorchDynamo, AOTAutograd, Inductor</h2>

<p class="l-text"><code>torch.compile</code> is not one component; it is a three-stage pipeline. Understanding what each stage does makes the debugging messages comprehensible and tells you which environment variable to flip when something fails.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TorchDynamo</div><div class="card-body">Python frame evaluation hook. Reads CPython bytecode and extracts a tensor-only FX graph.</div></div>
<div class="calc-card"><div class="card-title">AOTAutograd</div><div class="card-body">Ahead-of-Time autograd. Traces both forward and backward into a joint graph.</div></div>
<div class="calc-card"><div class="card-title">PrimTorch</div><div class="card-body">Decomposes ~2000 PyTorch ops into ~250 primitive ops for the backend.</div></div>
<div class="calc-card"><div class="card-title">Inductor (GPU)</div><div class="card-body">Default GPU backend. Lowers the FX graph into Triton kernels.</div></div>
<div class="calc-card"><div class="card-title">Inductor (CPU)</div><div class="card-body">Emits fused C++ / OpenMP kernels for CPU execution.</div></div>
<div class="calc-card"><div class="card-title">Alt backends</div><div class="card-body"><code>backend="aot_eager"</code> for debugging, <code>backend="cudagraphs"</code> for low overhead.</div></div>
</div>

<div class="katex-block">$$\\text{model.forward} \\xrightarrow{\\text{Dynamo}} \\text{FX graph} \\xrightarrow{\\text{AOTAutograd}} \\text{joint fwd+bwd} \\xrightarrow{\\text{Inductor}} \\text{Triton/C++ kernels}$$</div>

<p class="l-text"><strong>TorchDynamo</strong> hooks into CPython's frame evaluation API (PEP 523). When your model's forward runs, Dynamo intercepts each Python frame, reads its bytecode, and symbolically executes it to extract an FX (functional eXchange) graph of tensor operations. Pure Python control flow that touches only Python objects (not tensors) is folded into the graph as constants. Anything Dynamo cannot symbolically execute -- a <code>print</code>, a call into a custom Python object, an <code>if</code> condition on a tensor value -- causes a <em>graph break</em>: the compiled section ends, eager mode resumes, and a new graph starts after the break.</p>

<p class="l-text"><strong>AOTAutograd</strong> takes the forward FX graph and runs autograd ahead of time to produce a joint forward+backward graph. This is the secret to backward-pass speedups: in eager mode, backward is a separate autograd interpretation; here, it is just more nodes in the same compiled graph, fusable with everything else.</p>

<p class="l-text"><strong>Inductor</strong> is the default backend that turns the joint graph into kernels. On GPU it generates Triton (a Python-like DSL that compiles to PTX); on CPU it generates fused C++ with OpenMP. Triton is the magic that makes fusion practical -- writing fused CUDA by hand for every op pair is infeasible, but Triton's templated codegen makes it automatic.</p>

<div class="l-note"><strong>Debugging tip:</strong> if <code>torch.compile</code> blows up, try <code>backend="aot_eager"</code> first. This runs Dynamo + AOTAutograd but skips Inductor codegen, falling back to eager kernels. If <code>aot_eager</code> works but <code>inductor</code> fails, the bug is in kernel generation, not in graph capture.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Three Compile Modes</h2>

<p class="l-text"><code>torch.compile</code> accepts a <code>mode</code> argument that controls the compile-time-vs-runtime tradeoff. The wrong mode is a common silent regression: <code>max-autotune</code> recompiling on every shape change can make total time <em>slower</em> than eager.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># Mode 1: default -- balanced, ~5-15s compile, 30-80% speedup</span>
m1 = torch.<span class="fn">compile</span>(model)

<span class="cm"># Mode 2: reduce-overhead -- uses CUDA graphs, best for small batches / inference</span>
<span class="cm"># Eliminates Python overhead between kernel launches</span>
m2 = torch.<span class="fn">compile</span>(model, mode=<span class="str">"reduce-overhead"</span>)

<span class="cm"># Mode 3: max-autotune -- tries many kernel configs, picks the fastest</span>
<span class="cm"># Long compile (30-120s) but typically 10-30% faster than default at runtime</span>
m3 = torch.<span class="fn">compile</span>(model, mode=<span class="str">"max-autotune"</span>)

<span class="cm"># Advanced: full graph required (no graph breaks)</span>
<span class="cm"># Use to enforce: if the graph cannot be captured cleanly, raise an error</span>
<span class="cm"># instead of silently falling back to slower segmented execution.</span>
m4 = torch.<span class="fn">compile</span>(model, fullgraph=<span class="kw">True</span>)

<span class="cm"># Advanced: handle dynamic shapes without recompile</span>
m5 = torch.<span class="fn">compile</span>(model, dynamic=<span class="kw">True</span>)</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">default</div><div class="card-body">Sensible balance. First call ~5-15s; runtime 30-80% faster than eager.</div></div>
<div class="calc-card"><div class="card-title">reduce-overhead</div><div class="card-body">Wraps the graph in CUDA graphs. Eliminates kernel-launch latency. Best for inference at small batch sizes.</div></div>
<div class="calc-card"><div class="card-title">max-autotune</div><div class="card-body">Tries many tile sizes and kernel layouts per op. Long compile, fastest steady state.</div></div>
<div class="calc-card"><div class="card-title">fullgraph=True</div><div class="card-body">Raise on graph breaks. Forces you to remove eager-mode escape hatches.</div></div>
<div class="calc-card"><div class="card-title">dynamic=True</div><div class="card-body">Compile with symbolic shapes. Survives batch-size variation without recompiling.</div></div>
<div class="calc-card"><div class="card-title">Heuristic</div><div class="card-body">Training: default. Inference small batch: reduce-overhead. Long-running production: max-autotune.</div></div>
</div>

<p class="l-text"><strong>reduce-overhead</strong> deserves a closer look. Under the hood it captures the whole forward into a CUDA graph -- a NVIDIA primitive that records a sequence of kernel launches and replays them with a single CPU-side call. This eliminates per-kernel Python overhead and the gap between kernels on the GPU's command queue. It is the best mode for transformer inference at batch size 1 (your typical chat or embedding endpoint), where Python overhead can otherwise dominate.</p>

<p class="l-text"><strong>max-autotune</strong> brute-forces kernel configs. For each compiled op (a matmul, a fused softmax+dropout, etc.) Inductor synthesizes several Triton implementations with different block sizes, warp counts, pipeline depths, and benchmarks them. The fastest wins, cached for subsequent calls. The first compile call may take a minute or two; if your job runs for hours, the amortized cost is invisible and the throughput gain is real.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Speedups in Practice</h2>

<p class="l-text">Numbers from public benchmarks on A100 / H100 -- your hardware will vary, but the shape of the speedup is reproducible.</p>

<div id="plot-pyt14-speedup-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Training throughput (samples per second, higher is better) for a transformer encoder across four configurations: pure eager fp32 PyTorch, eager with bf16 autocast, <code>torch.compile</code> + bf16 autocast, and the same recipe wrapped in DistributedDataParallel across 8 GPUs. Each layer of optimization is multiplicative: autocast roughly doubles throughput on Ampere+ Tensor Cores, <code>torch.compile</code> adds another ~50% on top via kernel fusion and reduced Python overhead, and 8-way DDP gives a near-linear ~7.5x scale-up. <strong>Why it matters:</strong> the same model code, the same dataset, the same optimizer -- moving from the leftmost bar to the rightmost is the difference between a 14-day training run and a 12-hour one. None of these techniques change the model architecture; they only change how efficiently the hardware is used.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, time
<span class="kw">from</span> torch.nn <span class="kw">import</span> functional <span class="kw">as</span> F

<span class="kw">def</span> <span class="fn">bench</span>(fn, n=<span class="num">50</span>, warmup=<span class="num">10</span>):
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(warmup):
        <span class="fn">fn</span>()
    torch.cuda.<span class="fn">synchronize</span>()
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
        <span class="fn">fn</span>()
    torch.cuda.<span class="fn">synchronize</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

model = <span class="fn">SmallTransformer</span>().<span class="fn">cuda</span>()
x = torch.<span class="fn">randn</span>(<span class="num">64</span>, <span class="num">128</span>, <span class="num">512</span>, device=<span class="str">"cuda"</span>)
y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, (<span class="num">64</span>,), device=<span class="str">"cuda"</span>)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-4</span>)

<span class="kw">def</span> <span class="fn">step_eager</span>():
    opt.<span class="fn">zero_grad</span>()
    loss = F.<span class="fn">cross_entropy</span>(<span class="fn">model</span>(x), y)
    loss.<span class="fn">backward</span>()
    opt.<span class="fn">step</span>()

compiled = torch.<span class="fn">compile</span>(model)
<span class="kw">def</span> <span class="fn">step_compiled</span>():
    opt.<span class="fn">zero_grad</span>()
    loss = F.<span class="fn">cross_entropy</span>(<span class="fn">compiled</span>(x), y)
    loss.<span class="fn">backward</span>()
    opt.<span class="fn">step</span>()

<span class="fn">print</span>(f<span class="str">"eager:    {bench(step_eager):.2f} ms/step"</span>)
<span class="fn">print</span>(f<span class="str">"compiled: {bench(step_compiled):.2f} ms/step"</span>)
<span class="cm"># Typical A100 numbers: eager ~38 ms, compiled ~22 ms (~70% faster).</span></code></pre></div>

<p class="l-text">A few caveats. Speedups depend strongly on the model: transformer encoders / decoders see the largest gains because attention has many fusable ops; small CNNs see less benefit because the kernels are already big enough that fusion savings are marginal. Sequence-length variation is the silent killer -- if your batch shape changes every step (variable-length text), the default compile recompiles, and you spend more time compiling than training. Section 5 shows how to detect and fix that.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Graph Breaks and Recompiles</h2>

<p class="l-text">TorchDynamo extracts a graph by symbolically executing your model. When it hits something it cannot symbolically handle, it ends the current graph, runs the offending code in eager mode, and starts a new graph after. Each break costs you a compile call and breaks fusion across the boundary. Here are the common causes.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Data-dependent control flow</div><div class="card-body"><code>if x.sum() &gt; 0:</code> -- the branch depends on a runtime tensor value. Dynamo cannot statically decide.</div></div>
<div class="calc-card"><div class="card-title">Python side effects</div><div class="card-body"><code>print</code>, <code>logger.info</code>, mutating a global list. Dynamo refuses to bake these into a graph.</div></div>
<div class="calc-card"><div class="card-title">Unsupported ops</div><div class="card-body">Some third-party CUDA kernels, custom C++ ops without a Dynamo registration.</div></div>
<div class="calc-card"><div class="card-title">Shape mismatch</div><div class="card-body">Different batch / sequence length than the cached compile triggers a recompile.</div></div>
<div class="calc-card"><div class="card-title">Type changes</div><div class="card-body">Switching dtypes mid-training (fp32 -&gt; fp16) without dynamic dtype handling.</div></div>
<div class="calc-card"><div class="card-title">Dictionary mutations</div><div class="card-body">Modifying <code>__dict__</code> or <code>self.foo</code> attributes inside forward.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Diagnose graph breaks: enable verbose logs</span>
<span class="kw">import</span> os
os.environ[<span class="str">"TORCH_LOGS"</span>] = <span class="str">"graph_breaks,recompiles"</span>

<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">BadModel</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">10</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h = self.<span class="fn">fc</span>(x)
        <span class="cm"># GRAPH BREAK: data-dependent branch on tensor value</span>
        <span class="kw">if</span> h.<span class="fn">mean</span>().<span class="fn">item</span>() &gt; <span class="num">0</span>:
            h = h * <span class="num">2</span>
        <span class="cm"># GRAPH BREAK: print is a Python side effect</span>
        <span class="fn">print</span>(<span class="str">"debug: pass-through"</span>)
        <span class="kw">return</span> h

<span class="kw">class</span> <span class="fn">GoodModel</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">10</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h = self.<span class="fn">fc</span>(x)
        <span class="cm"># Use torch.where instead of Python if -- stays in the graph</span>
        h = torch.<span class="fn">where</span>(h &gt; <span class="num">0</span>, h * <span class="num">2</span>, h)
        <span class="kw">return</span> h

<span class="cm"># Force errors on graph breaks during development</span>
compiled = torch.<span class="fn">compile</span>(<span class="fn">GoodModel</span>(), fullgraph=<span class="kw">True</span>)</code></pre></div>

<p class="l-text">The single most useful environment variable is <code>TORCH_LOGS=graph_breaks,recompiles</code>. It prints every break and every recompile with the source location of the offending line. Run your training loop for a few steps with this enabled and you get a precise to-do list. The second most useful flag is <code>fullgraph=True</code> on <code>torch.compile</code>, which converts graph breaks into errors instead of silent fallbacks -- forcing you to fix them rather than ship a half-compiled model.</p>

<div class="l-warn"><strong>The recompile thrash anti-pattern:</strong> training on variable-length sequences (NLP, audio) without setting <code>dynamic=True</code>. Every new sequence length triggers a fresh compile. By the third epoch you may have compiled the same model 50 times and never benefited. Fix: <code>torch.compile(model, dynamic=True)</code> compiles once with symbolic shapes, accepting any batch / sequence length.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Mixed Precision: Why 16 Bits Beat 32</h2>

<p class="l-text">Half the lesson is graph compilation; the other half is what numeric format the tensors flowing through that graph use. Mixed precision is the trick of storing weights and computing forward in 16-bit floats while keeping a 32-bit master copy of weights and gradient accumulators. Two reasons it dominates: memory and Tensor Cores.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FP32 baseline</div><div class="card-body">4 bytes/value. Wide range and precision. The "safe" default before 2018.</div></div>
<div class="calc-card"><div class="card-title">FP16 advantage</div><div class="card-body">2 bytes/value -- 2x memory, 2x bandwidth, 2x Tensor Core throughput.</div></div>
<div class="calc-card"><div class="card-title">Tensor Cores</div><div class="card-body">Volta+ GPUs have dedicated matmul units that consume FP16/BF16 and output FP32. Up to 16x faster than FP32 cores.</div></div>
<div class="calc-card"><div class="card-title">The catch</div><div class="card-body">FP16 has narrow range (~5e-8 to 65504). Small gradients underflow to 0.</div></div>
<div class="calc-card"><div class="card-title">The fix</div><div class="card-body">Loss scaling: multiply loss by 2^k before backward, divide gradients by 2^k before optimizer step.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Same accuracy in 99% of trained models. Some tasks (RL, certain GANs) more sensitive.</div></div>
</div>

<div class="katex-block">$$\\text{FP16 range: } [6\\times 10^{-8},\\, 65504] \\qquad \\text{FP32 range: } [10^{-38},\\, 10^{38}]$$</div>

<p class="l-text">The structure of an FP16 number is 1 sign bit, 5 exponent bits, 10 mantissa bits. That 5-bit exponent is the problem -- it spans only ~10 orders of magnitude, where FP32's 8-bit exponent spans ~76. During backward, many gradients are tiny (1e-7 range for late-layer parameters in a deep transformer). FP16 cannot represent them -- they underflow to zero. The parameter sees gradient = 0 and stops learning.</p>

<p class="l-text">The fix is loss scaling. Before <code>backward()</code>, multiply the loss by a scale factor S (e.g., 65536). All gradients are then in the representable FP16 range. Before the optimizer step, divide gradients back by S. The math is exact and the underflow is gone. This is what <code>GradScaler</code> does.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. autocast + GradScaler: The FP16 Recipe</h2>

<p class="l-text">PyTorch packages mixed precision into two context managers. <code>autocast</code> wraps the forward pass and decides per-op whether to run in FP16 or FP32 (matmuls in FP16; loss / softmax / normalization in FP32 for numerical safety). <code>GradScaler</code> handles the loss scaling around the backward pass. The recipe is exactly five lines added to a standard training loop.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler

model = <span class="fn">MyModel</span>().<span class="fn">cuda</span>()
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-4</span>)
scaler = <span class="fn">GradScaler</span>()           <span class="cm"># 1) Create the scaler</span>

<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">cuda</span>(), y.<span class="fn">cuda</span>()
    opt.<span class="fn">zero_grad</span>()

    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.float16):    <span class="cm"># 2) Forward in FP16</span>
        pred = <span class="fn">model</span>(x)
        loss = <span class="fn">criterion</span>(pred, y)

    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()       <span class="cm"># 3) Scaled backward</span>
    scaler.<span class="fn">unscale_</span>(opt)                  <span class="cm"># 4) Unscale grads (optional, for clipping)</span>
    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
    scaler.<span class="fn">step</span>(opt)                       <span class="cm"># 5) Optimizer step (skips if NaN/Inf detected)</span>
    scaler.<span class="fn">update</span>()                         <span class="cm"># 6) Update scale factor for next iter</span></code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">autocast region</div><div class="card-body">Per-op dtype policy: matmul in FP16, softmax / layernorm in FP32. Automatic.</div></div>
<div class="calc-card"><div class="card-title">scaler.scale(loss)</div><div class="card-body">Multiplies loss by S so backward grads stay in FP16 range.</div></div>
<div class="calc-card"><div class="card-title">scaler.unscale_</div><div class="card-body">Divides grads by S in place -- needed if you want to inspect / clip them.</div></div>
<div class="calc-card"><div class="card-title">scaler.step</div><div class="card-body">Calls opt.step() only if no NaN/Inf grads. Otherwise skips the step.</div></div>
<div class="calc-card"><div class="card-title">scaler.update</div><div class="card-body">If step was skipped, halves S; if N steps were stable, doubles S. Adaptive.</div></div>
<div class="calc-card"><div class="card-title">init_scale</div><div class="card-body">Default 2^16 = 65536. Usually fine; lower it if early-iter NaN is persistent.</div></div>
</div>

<p class="l-text">The autocast context decides on a per-op basis. The internal allowlist looks roughly like: matmul, conv, linear -&gt; cast inputs to FP16. softmax, layernorm, batchnorm, sum / mean / std reductions -&gt; keep in FP32. The reason: dot products and convolutions tolerate FP16 inputs because the accumulator inside the Tensor Core is FP32 (or higher), while normalization layers do reductions that can lose precision dangerously if forced to FP16.</p>

<p class="l-text"><code>GradScaler</code>'s adaptive policy is elegant. If a step's gradients contain any Inf or NaN (overflow), the optimizer step is skipped and S is halved. If 2000 (default) consecutive steps succeed without overflow, S is doubled. This finds the largest scale that keeps gradients in range, automatically.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. BF16: The Brain Float</h2>

<p class="l-text">FP16 works but the loss scaling is annoying machinery -- and it costs the few percent of steps that get skipped due to overflow. In 2018 Google's TPU team proposed <strong>bfloat16</strong>: 1 sign bit, 8 exponent bits (matching FP32), 7 mantissa bits. Same total size as FP16, same Tensor Core throughput, but with FP32's exponent range. Underflow goes away. GradScaler is unnecessary.</p>

<div id="plot-pyt14-precision-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The dynamic range (largest representable value, log scale) and mantissa precision (number of mantissa bits) for each common training format. FP32 sits in the upper-right -- maximum range and precision, but 4 bytes per value. FP16 trades both range and precision for size. BF16 keeps FP32's range but cuts precision; in practice this works for nearly all deep learning training because gradients need range more than they need the last few decimal digits. FP8 (E4M3, E5M2 variants) cuts both further, viable only with hardware-supported scaling factors. <strong>Why it matters:</strong> the choice of format is not "more bits is better" -- it is range vs precision vs hardware throughput. BF16 dominates LLM training because gradients span 30+ orders of magnitude; FP16 cannot represent that, FP32 can but at half the throughput.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FP16</div><div class="card-body">1+5+10 bits. Narrow range, decent precision, needs GradScaler.</div></div>
<div class="calc-card"><div class="card-title">BF16</div><div class="card-body">1+8+7 bits. FP32 range, lower precision, no scaler needed.</div></div>
<div class="calc-card"><div class="card-title">Hardware</div><div class="card-body">BF16 native on Ampere (A100) and later. Older Pascal/Volta lacks native support.</div></div>
<div class="calc-card"><div class="card-title">When to use</div><div class="card-body">BF16 if your GPU supports it -- it is strictly easier than FP16.</div></div>
<div class="calc-card"><div class="card-title">LLM default</div><div class="card-body">Llama, Mistral, Falcon, Gemma -- all trained in BF16.</div></div>
<div class="calc-card"><div class="card-title">Caveat</div><div class="card-body">BF16's 7-bit mantissa means some inference workloads still prefer FP16 or FP32 for last-decimal accuracy.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast

<span class="cm"># BF16 recipe: no GradScaler, simpler loop</span>
<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">cuda</span>(), y.<span class="fn">cuda</span>()
    opt.<span class="fn">zero_grad</span>()

    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
        pred = <span class="fn">model</span>(x)
        loss = <span class="fn">criterion</span>(pred, y)

    loss.<span class="fn">backward</span>()                       <span class="cm"># No scaling needed</span>
    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
    opt.<span class="fn">step</span>()                              <span class="cm"># Standard optimizer step</span>

<span class="cm"># Detecting hardware support at runtime</span>
<span class="kw">if</span> torch.cuda.<span class="fn">is_bf16_supported</span>():
    dtype = torch.bfloat16
<span class="kw">else</span>:
    dtype = torch.float16    <span class="cm"># fall back to FP16 + scaler</span></code></pre></div>

<p class="l-text">The structural lesson: choose precision by the distribution of values it must represent. Gradients in a deep transformer span many orders of magnitude (1e-8 in early layers, 1e2 in late layers near saturation). They need <em>range</em>, not precision. BF16 gives them range cheaply. Activations are similar. The only place where the missing mantissa bits sometimes bite is loss accumulation across many samples -- which is why <code>loss</code> tensors and reductions are still computed in FP32 inside an autocast region.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. FP8: The Hopper Frontier</h2>

<p class="l-text">Hopper (H100, 2022) added native FP8 Tensor Cores. Two variants: <strong>E4M3</strong> (1+4+3, more precision) for weights and activations, <strong>E5M2</strong> (1+5+2, more range) for gradients. FP8 gives another 2x throughput over BF16 on H100, plus another 2x memory savings -- enabling models that would not otherwise fit, and reducing communication cost in distributed training.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">E4M3</div><div class="card-body">Forward: weights, activations. Range ~448, finer precision.</div></div>
<div class="calc-card"><div class="card-title">E5M2</div><div class="card-body">Backward: gradients. Range ~57344, coarser precision. Mirrors FP16's range.</div></div>
<div class="calc-card"><div class="card-title">Hardware</div><div class="card-body">H100 (Hopper) and newer. Not available on Ampere or earlier.</div></div>
<div class="calc-card"><div class="card-title">Transformer Engine</div><div class="card-body">NVIDIA library that handles FP8 scaling automatically. Drop-in replacement for nn.Linear.</div></div>
<div class="calc-card"><div class="card-title">Use cases</div><div class="card-body">Frontier LLM training (rumored: GPT-4, Claude, Gemini Ultra). Inference at scale.</div></div>
<div class="calc-card"><div class="card-title">Caveat</div><div class="card-body">Per-tensor scaling factors must be tuned. Without TE, hand-rolling FP8 is hazardous.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Sketch: FP8 via NVIDIA Transformer Engine</span>
<span class="kw">import</span> torch
<span class="kw">import</span> transformer_engine.pytorch <span class="kw">as</span> te
<span class="kw">from</span> transformer_engine.common.recipe <span class="kw">import</span> Format, DelayedScaling

<span class="cm"># Drop-in replacement: te.Linear instead of nn.Linear</span>
<span class="kw">class</span> <span class="fn">FP8Block</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc1 = te.<span class="fn">Linear</span>(d, <span class="num">4</span>*d)
        self.fc2 = te.<span class="fn">Linear</span>(<span class="num">4</span>*d, d)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">fc2</span>(torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))

<span class="cm"># FP8 recipe: hybrid format (E4M3 forward, E5M2 backward) with delayed scaling</span>
fp8_recipe = <span class="fn">DelayedScaling</span>(fp8_format=Format.HYBRID, amax_history_len=<span class="num">16</span>)

model = <span class="fn">FP8Block</span>(<span class="num">512</span>).<span class="fn">cuda</span>()
<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    <span class="kw">with</span> te.<span class="fn">fp8_autocast</span>(enabled=<span class="kw">True</span>, fp8_recipe=fp8_recipe):
        loss = <span class="fn">criterion</span>(<span class="fn">model</span>(x), y)
    loss.<span class="fn">backward</span>()
    opt.<span class="fn">step</span>()</code></pre></div>

<p class="l-text">FP8 is not yet a one-line drop-in like BF16. The reason is precision: with only 3 or 2 mantissa bits, you cannot let arbitrary tensor values flow through the matmul -- you need a per-tensor scale factor that maps the actual range of the tensor onto the FP8 representable range. NVIDIA's Transformer Engine handles this automatically with <em>delayed scaling</em>: it tracks the maximum absolute value (amax) seen over the last K iterations and uses it to set the scale for the next iteration. The bookkeeping is invisible to user code.</p>

<div class="l-note"><strong>Reading the trade:</strong> FP32 -&gt; BF16 is a "no thought required" 2x speedup if your GPU supports it. BF16 -&gt; FP8 is "1.5-2x more speedup if you can afford the precision risk and you have H100 hardware." Use TE rather than rolling your own, and always validate with an FP32 baseline that loss curves match within noise.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. The Full Recipe: compile + AMP + DDP</h2>

<p class="l-text">Production training stacks all three optimizations. The order matters: <code>DistributedDataParallel</code> wraps the model first (so each rank sees its own replica), then <code>torch.compile</code> wraps the DDP-wrapped model (so the compiled graph includes the all-reduce), then <code>autocast</code> wraps the forward call (so each step runs in BF16).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist
<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP
<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast

<span class="cm"># 1) Distributed setup (launched via torchrun)</span>
dist.<span class="fn">init_process_group</span>(<span class="str">"nccl"</span>)
rank = dist.<span class="fn">get_rank</span>()
torch.cuda.<span class="fn">set_device</span>(rank)
device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span>, rank)

<span class="cm"># 2) Build model on this rank's GPU</span>
model = <span class="fn">MyTransformer</span>().<span class="fn">to</span>(device)

<span class="cm"># 3) Wrap with DDP FIRST -- gives each rank a local replica that all-reduces grads</span>
model = <span class="fn">DDP</span>(model, device_ids=[rank])

<span class="cm"># 4) THEN wrap with torch.compile -- compiled graph spans the all-reduce</span>
model = torch.<span class="fn">compile</span>(model, mode=<span class="str">"default"</span>)

<span class="cm"># 5) Optimizer on the DDP-wrapped, compiled module's parameters</span>
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(num_epochs):
    sampler.<span class="fn">set_epoch</span>(epoch)
    <span class="kw">for</span> x, y <span class="kw">in</span> loader:
        x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
        opt.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)

        <span class="cm"># 6) Autocast wraps the forward call</span>
        <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
            loss = <span class="fn">criterion</span>(<span class="fn">model</span>(x), y)

        loss.<span class="fn">backward</span>()                       <span class="cm"># DDP all-reduces here automatically</span>
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
        opt.<span class="fn">step</span>()

dist.<span class="fn">destroy_process_group</span>()</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Order matters</div><div class="card-body">DDP -&gt; compile -&gt; autocast. Reversing creates correctness or performance bugs.</div></div>
<div class="calc-card"><div class="card-title">Why DDP first</div><div class="card-body">DDP must see the original module to register hooks on each parameter for gradient all-reduce.</div></div>
<div class="calc-card"><div class="card-title">Why compile second</div><div class="card-body">The compiled graph then includes the DDP all-reduce ops, fusing comm with compute where possible.</div></div>
<div class="calc-card"><div class="card-title">BF16 over FP16</div><div class="card-body">No GradScaler needed; one fewer thing to coordinate across ranks.</div></div>
<div class="calc-card"><div class="card-title">set_to_none=True</div><div class="card-body">Faster zero-grad: sets <code>.grad</code> to None instead of zeroing the buffer.</div></div>
<div class="calc-card"><div class="card-title">Saving</div><div class="card-body">Save <code>model.module._orig_mod.state_dict()</code> -- unwraps DDP and compile.</div></div>
</div>

<p class="l-text"><strong>The unwrapping pitfall.</strong> <code>torch.compile</code> returns an <code>OptimizedModule</code> wrapper around your model; DDP wraps the original module in <code>model.module</code>. To save weights, you want neither wrapper: <code>model.module._orig_mod.state_dict()</code> gives you the plain underlying module's parameters. Save those; on reload, build a fresh model, load the state_dict, then re-wrap. Forgetting this is the most common production bug at this layer -- you end up with checkpoints that only load successfully if you compile and DDP-wrap in the exact same way.</p>

<p class="l-text">Numbers from a typical 8x A100 setup with this recipe vs. a single-A100 eager-fp32 baseline: ~12-14x training throughput. The breakdown is roughly 2x from BF16, 1.5x from <code>torch.compile</code>, and ~5x from 8-way DDP (sublinear due to all-reduce overhead). The model's loss curve, validation accuracy, and final checkpoint behave identically to the eager baseline -- which is the whole point. Optimizations that change numerics behave differently are not optimizations, they are bugs.</p>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> <code>torch.compile</code> is a JIT graph compiler: write eager PyTorch, get compiled throughput on the first call. Typical 30-100% speedup on transformers.<br><strong>2.</strong> Pipeline: TorchDynamo (Python -&gt; FX graph) -&gt; AOTAutograd (joint fwd+bwd) -&gt; Inductor (Triton/C++ kernels).<br><strong>3.</strong> Modes: <code>default</code> for training, <code>reduce-overhead</code> (CUDA graphs) for small-batch inference, <code>max-autotune</code> for long-running jobs.<br><strong>4.</strong> Graph breaks come from data-dependent control flow, prints, and unsupported ops. Diagnose with <code>TORCH_LOGS=graph_breaks,recompiles</code>. Enforce with <code>fullgraph=True</code>.<br><strong>5.</strong> Variable shapes thrash the cache; <code>dynamic=True</code> compiles once with symbolic shapes.<br><strong>6.</strong> FP16 needs <code>GradScaler</code> because of narrow exponent range; BF16 does not, because its exponent matches FP32.<br><strong>7.</strong> BF16 is the right default for training on Ampere+; FP16 only if your GPU lacks BF16 support.<br><strong>8.</strong> FP8 (H100 only, via NVIDIA Transformer Engine) gives another 2x on top of BF16 for frontier-scale training.<br><strong>9.</strong> Production order: DDP -&gt; compile -&gt; autocast. Unwrap with <code>model.module._orig_mod</code> before saving state_dict.<br><strong>10.</strong> Stacked, these techniques deliver ~12-14x throughput on 8 GPUs vs. a single-GPU eager baseline, with identical loss curves.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:60,r:30,b:80,l:80}};

  function speedupPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var labels = lang==='tr'
      ? ['Eager FP32', 'Eager + BF16', 'compile + BF16', 'compile + BF16 + 8xDDP']
      : ['Eager FP32', 'Eager + BF16', 'compile + BF16', 'compile + BF16 + 8xDDP'];
    var values = [1.0, 2.1, 3.2, 24.0];
    var colors = ['#f87171','#fbbf24','#4ecdc4', T.accent];
    var data = [{
      type:'bar', x:labels, y:values,
      marker:{color: colors, line:{color:'rgba(255,255,255,0.2)', width:1}},
      text: values.map(function(v){return v.toFixed(1) + 'x';}),
      textposition: 'outside',
      textfont:{color:T.text}
    }];
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Transformer Eğitim Throughput\'u (göreceli)':'Transformer Training Throughput (relative)', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'yapılandırma':'configuration', tickfont:{color:T.text}},
      yaxis:{title:lang==='tr'?'göreceli throughput':'relative throughput (eager fp32 = 1.0)', gridcolor:T.grid, zerolinecolor:T.zero},
      height: 440
    });
    Plotly.newPlot(id, data, layout, {responsive:true, displayModeBar:false});
  }

  function precisionPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var fmts = ['FP32', 'BF16', 'FP16', 'FP8 E4M3', 'FP8 E5M2'];
    var ranges = [38, 38, 4.8, 2.6, 4.8];        // log10 of max representable
    var precisions = [23, 7, 10, 3, 2];           // mantissa bits
    var sizes = [40, 26, 26, 18, 18];             // marker size hint
    var colors = ['#9ca3af','#4ecdc4','#fbbf24','#a78bfa', T.accent];

    var data = [{
      type: 'scatter',
      mode: 'markers+text',
      x: ranges,
      y: precisions,
      text: fmts,
      textposition: 'top center',
      textfont: {color:T.text, size:13},
      marker: {size: sizes, color: colors, line:{color:'rgba(255,255,255,0.3)', width:1}}
    }];
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Hassasiyet Formatları: Aralık vs Mantissa Bitleri':'Precision Formats: Range vs Mantissa Bits', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'log10(max temsil edilebilir değer)':'log10(max representable value)', gridcolor:T.grid, zerolinecolor:T.zero},
      yaxis:{title:lang==='tr'?'mantissa bit sayısı':'mantissa bits (precision)', gridcolor:T.grid, zerolinecolor:T.zero},
      height: 480,
      showlegend: false
    });
    Plotly.newPlot(id, data, layout, {responsive:true, displayModeBar:false});
  }

  speedupPlot('plot-pyt14-speedup-en','en');
  speedupPlot('plot-pyt14-speedup-tr','tr');
  precisionPlot('plot-pyt14-precision-en','en');
  precisionPlot('plot-pyt14-precision-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Temiz bir PyTorch eğitim döngüsü yazdın. GPU'nun gerçekten kapasitesinin %40'ında çalışıyor.</strong> Boşluk model kodunda değil -- Python eager yürütmesi ile modern GPU'ların yalnızca derlenmiş, karışık hassasiyetli iş yüklerine sunduğu silikon düzeyindeki hilelerin (Tensor Core'lar, kernel fusion, CUDA grafikleri, fp8 akümülatörleri) arasındaki boşlukta. Bu ders modern PyTorch performans el kitabıdır: <code>torch.compile</code> (PT 2.0 grafik derleyicisi) ve her ağırlık, aktivasyon ve gradyanın kaç bayt tükettiğine karar veren hassasiyet merdiveni (fp32 / fp16 / bf16 / fp8).</p>

<p class="l-text">Her iki ekseni uçtan uca yürüyoruz. Bölüm A <code>torch.compile</code>'ı parçalara ayırıyor: TorchDynamo, AOTAutograd ve Inductor'un her birinin ne yaptığı, üç derleme modunun derleme süresini çalışma zamanına nasıl çevirdiği, graph break'lerin nereden geldiği ve <code>TORCH_LOGS=graph_breaks</code> çıktısının nasıl okunacağı. Bölüm B hassasiyet merdivenini yürüyor: fp16'nın neden GradScaler'a ihtiyacı varken bf16'nın ihtiyacı yok, neden H100 fp8 2024-25'in SOTA eğitim formatı ve <code>autocast</code> + <code>compile</code> + DDP'yi tek bir üretim sınıfı reçetede nasıl üst üste yığıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Eager vs grafik dengesini ve <code>torch.compile</code>'ın eğitim kodunu değiştirmeden bunu nasıl kapattığını</li>
<li>TorchDynamo'nun Python bytecode'unu nasıl yakaladığını, AOTAutograd'ın forward+backward'ı nasıl izlediğini, Inductor'un Triton kernel'lerini nasıl ürettiğini</li>
<li>Üç derleme modu -- <code>default</code>, <code>reduce-overhead</code>, <code>max-autotune</code> -- ve her birinin ne zaman seçileceği</li>
<li>Graph break sebepleri ve <code>TORCH_LOGS=graph_breaks,recompiles</code> okuma</li>
<li>fp32 / fp16 / bf16 / fp8 merdiveni: aralık vs hassasiyet, donanım desteği, gradyan ölçeklendirmesi ne zaman gerekli</li>
<li>Tam reçete: doğru sırada <code>torch.compile</code> + <code>autocast(bf16)</code> + DistributedDataParallel uygulaması</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. torch.compile Neden Var?</h2>

<p class="l-text">PyTorch'un belirleyici tercihi <em>define-by-run</em> idi: modelin bir Python programıdır, satır satır yürütülür, autograd ilerlerken izi kaydeder. Hata ayıklamanın normal Python gibi hissettirmesini sağlayan budur -- <code>print</code>, breakpoint koyma, tensörleri değiştirme. Bedel throughput: her op ayrı bir Python -> C++ dispatch'idir, her kernel başlatma küçüktür ve komşu op'ları birleştirmek veya belleği önceden planlamak için fırsat yoktur.</p>

<p class="l-text">TensorFlow'un orijinal cevabı tam tersiydi: statik bir grafik kur, sonra yürüt. Daha hızlı, ama geliştirici deneyimi tüm alanın PyTorch'a göç edecek kadar acı vericiydi. Hayal, eager PyTorch <em>gibi hisseden</em> ama derlenmiş bir grafik <em>gibi çalışan</em> bir sistemdi. Mart 2023'te PyTorch 2.0 ile gelen <code>torch.compile</code> tam o sistemdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eager modu</div><div class="card-body">Op-op Python yürütmesi. Harika UX, düşük throughput, fusion yok.</div></div>
<div class="calc-card"><div class="card-title">Statik grafik</div><div class="card-body">Bir kez derle, hızlı çalıştır, ama çalışma zamanında Python kontrol akışı yok. TF 1.x tarzı.</div></div>
<div class="calc-card"><div class="card-title">torch.compile</div><div class="card-body">Hibrit: ilk çağrıda grafiği izle, gerektiğinde eager'a geri dön.</div></div>
<div class="calc-card"><div class="card-title">JIT vs AOT</div><div class="card-body">torch.compile JIT'dir: ilk çağrıda derler, sonucu önbelleğe alır.</div></div>
<div class="calc-card"><div class="card-title">Kullanıcı kodu</div><div class="card-body">Değişmez. <code>torch.compile(model)</code> ile sar ve eğitime devam et.</div></div>
<div class="calc-card"><div class="card-title">Tipik hızlanma</div><div class="card-body">Transformer'larda %30-100, bellek bağlı iş yüklerinde bazen 2x.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">SmallTransformer</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d=<span class="num">512</span>, h=<span class="num">8</span>, layers=<span class="num">6</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        layer = nn.<span class="fn">TransformerEncoderLayer</span>(d, h, batch_first=<span class="kw">True</span>)
        self.enc = nn.<span class="fn">TransformerEncoder</span>(layer, num_layers=layers)
        self.head = nn.<span class="fn">Linear</span>(d, <span class="num">2</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">head</span>(self.<span class="fn">enc</span>(x).<span class="fn">mean</span>(dim=<span class="num">1</span>))

model = <span class="fn">SmallTransformer</span>().<span class="fn">cuda</span>()

<span class="cm"># Önce: eager modu -- her op ayrı dispatch edilir</span>
out = <span class="fn">model</span>(torch.<span class="fn">randn</span>(<span class="num">32</span>, <span class="num">128</span>, <span class="num">512</span>, device=<span class="str">"cuda"</span>))

<span class="cm"># Sonra: derlenmiş moda tek satırlık geçiş</span>
compiled = torch.<span class="fn">compile</span>(model)
out = <span class="fn">compiled</span>(torch.<span class="fn">randn</span>(<span class="num">32</span>, <span class="num">128</span>, <span class="num">512</span>, device=<span class="str">"cuda"</span>))
<span class="cm"># İlk çağrı: ~10-30s derleme gecikmesi.</span>
<span class="cm"># Sonraki her çağrı: tipik bir Ampere/Hopper GPU'da %30-100 daha hızlı.</span></code></pre></div>

<p class="l-text">Sözleşme basit: normal PyTorch yazmaya devam edersin. <code>compiled(...)</code> üzerinden ilk forward geçişinde PyTorch modelini izler, komşu op'ları birleştirir, optimize edilmiş kernel'ler üretir ve sonucu girdi şekilleri ve dtype'larına göre anahtarlayarak önbelleğe alır. Aynı şekillere sahip sonraki çağrılar önbelleğe çarpar ve derlenmiş grafiği çalıştırır. Şekil değişiklikleri yeniden derleme tetikler; bu çırpınmanın nasıl önleneceğini bölüm 5'te göreceğiz.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Yığının İçi: TorchDynamo, AOTAutograd, Inductor</h2>

<p class="l-text"><code>torch.compile</code> tek bir bileşen değildir; üç aşamalı bir ardışık düzendir. Her aşamanın ne yaptığını anlamak hata ayıklama mesajlarını anlaşılır kılar ve bir şey başarısız olduğunda hangi ortam değişkenini çevireceğini söyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TorchDynamo</div><div class="card-body">Python frame değerlendirme kancası. CPython bytecode'unu okur ve yalnızca tensör içeren bir FX grafiği çıkarır.</div></div>
<div class="calc-card"><div class="card-title">AOTAutograd</div><div class="card-body">Ahead-of-Time autograd. Hem forward'ı hem backward'ı tek bir birleşik grafiğe izler.</div></div>
<div class="calc-card"><div class="card-title">PrimTorch</div><div class="card-body">~2000 PyTorch op'unu backend için ~250 ilkel op'a ayrıştırır.</div></div>
<div class="calc-card"><div class="card-title">Inductor (GPU)</div><div class="card-body">Varsayılan GPU backend'i. FX grafiğini Triton kernel'lerine indirir.</div></div>
<div class="calc-card"><div class="card-title">Inductor (CPU)</div><div class="card-body">CPU yürütmesi için birleştirilmiş C++ / OpenMP kernel'leri üretir.</div></div>
<div class="calc-card"><div class="card-title">Alt backend'ler</div><div class="card-body">Hata ayıklama için <code>backend="aot_eager"</code>, düşük overhead için <code>backend="cudagraphs"</code>.</div></div>
</div>

<div class="katex-block">$$\\text{model.forward} \\xrightarrow{\\text{Dynamo}} \\text{FX graph} \\xrightarrow{\\text{AOTAutograd}} \\text{joint fwd+bwd} \\xrightarrow{\\text{Inductor}} \\text{Triton/C++ kernels}$$</div>

<p class="l-text"><strong>TorchDynamo</strong> CPython'un frame değerlendirme API'sine (PEP 523) kancalanır. Modelinin forward'ı çalıştığında, Dynamo her Python frame'ini yakalar, bytecode'unu okur ve tensör operasyonlarının bir FX (functional eXchange) grafiğini çıkarmak için sembolik olarak yürütür. Yalnızca Python nesnelerine dokunan (tensörlere değil) saf Python kontrol akışı sabitler olarak grafiğe katlanır. Dynamo'nun sembolik olarak yürütemediği bir şey -- bir <code>print</code>, özel bir Python nesnesine çağrı, bir tensör değeri üzerinde <code>if</code> koşulu -- bir <em>graph break</em>'e neden olur: derlenmiş bölüm biter, eager modu devam eder ve break'ten sonra yeni bir grafik başlar.</p>

<p class="l-text"><strong>AOTAutograd</strong> forward FX grafiğini alır ve autograd'ı önceden çalıştırarak birleşik bir forward+backward grafiği üretir. Backward geçiş hızlanmalarının sırrı budur: eager modunda backward ayrı bir autograd yorumlamasıdır; burada aynı derlenmiş grafiğin daha fazla düğümüdür, her şeyle birleştirilebilir.</p>

<p class="l-text"><strong>Inductor</strong>, birleşik grafiği kernel'lere çeviren varsayılan backend'dir. GPU'da Triton (PTX'e derlenen Python benzeri bir DSL) üretir; CPU'da OpenMP ile birleştirilmiş C++ üretir. Triton fusion'ı pratik kılan büyüdür -- her op çifti için elle birleştirilmiş CUDA yazmak uygulanamaz, ama Triton'un şablonlanmış codegen'i bunu otomatikleştirir.</p>

<div class="l-note"><strong>Hata ayıklama ipucu:</strong> <code>torch.compile</code> patlarsa önce <code>backend="aot_eager"</code> dene. Bu Dynamo + AOTAutograd'ı çalıştırır ama Inductor codegen'i atlar, eager kernel'lere geri döner. <code>aot_eager</code> çalışıyor ama <code>inductor</code> başarısız oluyorsa, hata kernel üretiminde, grafik yakalamada değil.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Üç Derleme Modu</h2>

<p class="l-text"><code>torch.compile</code> derleme süresi-çalışma zamanı dengesini kontrol eden bir <code>mode</code> argümanı kabul eder. Yanlış mod yaygın bir sessiz regresyondur: her şekil değişikliğinde yeniden derleyen <code>max-autotune</code> toplam süreyi eager'dan <em>daha yavaş</em> hâle getirebilir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch

<span class="cm"># Mod 1: default -- dengeli, ~5-15s derleme, %30-80 hızlanma</span>
m1 = torch.<span class="fn">compile</span>(model)

<span class="cm"># Mod 2: reduce-overhead -- CUDA graph'ları kullanır, küçük batch / çıkarım için en iyi</span>
<span class="cm"># Kernel başlatmaları arasındaki Python overhead'ini ortadan kaldırır</span>
m2 = torch.<span class="fn">compile</span>(model, mode=<span class="str">"reduce-overhead"</span>)

<span class="cm"># Mod 3: max-autotune -- birçok kernel konfigürasyonunu dener, en hızlısını seçer</span>
<span class="cm"># Uzun derleme (30-120s) ama tipik olarak default'tan çalışma zamanında %10-30 daha hızlı</span>
m3 = torch.<span class="fn">compile</span>(model, mode=<span class="str">"max-autotune"</span>)

<span class="cm"># İleri: tam grafik gerekli (graph break yok)</span>
<span class="cm"># Kullan: grafik temiz yakalanamıyorsa, sessizce daha yavaş bölümlü yürütmeye gerilemek</span>
<span class="cm"># yerine bir hata fırlat.</span>
m4 = torch.<span class="fn">compile</span>(model, fullgraph=<span class="kw">True</span>)

<span class="cm"># İleri: yeniden derleme olmadan dinamik şekilleri ele al</span>
m5 = torch.<span class="fn">compile</span>(model, dynamic=<span class="kw">True</span>)</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">default</div><div class="card-body">Mantıklı denge. İlk çağrı ~5-15s; çalışma zamanı eager'dan %30-80 daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">reduce-overhead</div><div class="card-body">Grafiği CUDA graph'larıyla sarar. Kernel başlatma gecikmesini ortadan kaldırır. Küçük batch'te çıkarım için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">max-autotune</div><div class="card-body">Her op için birçok karo boyutu ve kernel düzenini dener. Uzun derleme, en hızlı durağan durum.</div></div>
<div class="calc-card"><div class="card-title">fullgraph=True</div><div class="card-body">Graph break'lerde hata fırlat. Eager moduna kaçış kapılarını kaldırmaya zorlar.</div></div>
<div class="calc-card"><div class="card-title">dynamic=True</div><div class="card-body">Sembolik şekillerle derle. Yeniden derlemeden batch boyutu değişimine dayanır.</div></div>
<div class="calc-card"><div class="card-title">Sezgi</div><div class="card-body">Eğitim: default. Küçük batch çıkarım: reduce-overhead. Uzun süreli üretim: max-autotune.</div></div>
</div>

<p class="l-text"><strong>reduce-overhead</strong> daha yakın bakmayı hak ediyor. Kaputun altında tüm forward'ı bir CUDA graph'ına yakalar -- kernel başlatma dizisini kaydeden ve tek bir CPU tarafı çağrıyla tekrar oynatan bir NVIDIA ilkelidir. Bu kernel başına Python overhead'ini ve GPU'nun komut kuyruğundaki kernel'ler arasındaki boşluğu ortadan kaldırır. Batch boyutu 1'de (tipik chat veya embedding endpoint'in) transformer çıkarımı için en iyi moddur; aksi halde Python overhead'i hâkim olabilir.</p>

<p class="l-text"><strong>max-autotune</strong> kernel konfigürasyonlarını kaba kuvvet dener. Her derlenmiş op için (bir matmul, birleştirilmiş bir softmax+dropout, vb.) Inductor farklı blok boyutları, warp sayıları ve pipeline derinlikleriyle birkaç Triton uygulaması sentezler ve benchmark eder. En hızlısı kazanır, sonraki çağrılar için önbelleğe alınır. İlk derleme çağrısı bir veya iki dakika sürebilir; işin saatlerce çalışıyorsa, amortize maliyet görünmezdir ve throughput kazancı gerçektir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pratikte Hızlanmalar</h2>

<p class="l-text">A100 / H100 üzerinde herkese açık benchmark'lardan sayılar -- donanımın değişecek, ama hızlanmanın şekli yeniden üretilebilirdir.</p>

<div id="plot-pyt14-speedup-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu görselin söylediği:</strong> Bir transformer encoder için eğitim throughput'u (saniyede örnek, yüksek olan iyi), dört yapılandırma arasında: saf eager fp32 PyTorch, bf16 autocast ile eager, <code>torch.compile</code> + bf16 autocast ve aynı reçetenin 8 GPU üzerinde DistributedDataParallel'a sarılmış hâli. Her optimizasyon katmanı çarpışmalıdır: autocast Ampere+ Tensor Core'larında throughput'u kabaca iki katına çıkarır, <code>torch.compile</code> kernel fusion ve azaltılmış Python overhead'i aracılığıyla üstüne ~%50 ekler ve 8-yönlü DDP yaklaşık doğrusal ~7.5x ölçeklenme verir. <strong>Neden önemli:</strong> aynı model kodu, aynı veri kümesi, aynı optimizer -- en soldaki çubuktan en sağdakine geçmek 14 günlük bir eğitim koşusu ile 12 saatlik bir koşu arasındaki farktır. Bu tekniklerin hiçbiri model mimarisini değiştirmez; yalnızca donanımın ne kadar verimli kullanıldığını değiştirir.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, time
<span class="kw">from</span> torch.nn <span class="kw">import</span> functional <span class="kw">as</span> F

<span class="kw">def</span> <span class="fn">bench</span>(fn, n=<span class="num">50</span>, warmup=<span class="num">10</span>):
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(warmup):
        <span class="fn">fn</span>()
    torch.cuda.<span class="fn">synchronize</span>()
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n):
        <span class="fn">fn</span>()
    torch.cuda.<span class="fn">synchronize</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

model = <span class="fn">SmallTransformer</span>().<span class="fn">cuda</span>()
x = torch.<span class="fn">randn</span>(<span class="num">64</span>, <span class="num">128</span>, <span class="num">512</span>, device=<span class="str">"cuda"</span>)
y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, (<span class="num">64</span>,), device=<span class="str">"cuda"</span>)
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-4</span>)

<span class="kw">def</span> <span class="fn">step_eager</span>():
    opt.<span class="fn">zero_grad</span>()
    loss = F.<span class="fn">cross_entropy</span>(<span class="fn">model</span>(x), y)
    loss.<span class="fn">backward</span>()
    opt.<span class="fn">step</span>()

compiled = torch.<span class="fn">compile</span>(model)
<span class="kw">def</span> <span class="fn">step_compiled</span>():
    opt.<span class="fn">zero_grad</span>()
    loss = F.<span class="fn">cross_entropy</span>(<span class="fn">compiled</span>(x), y)
    loss.<span class="fn">backward</span>()
    opt.<span class="fn">step</span>()

<span class="fn">print</span>(f<span class="str">"eager:    {bench(step_eager):.2f} ms/step"</span>)
<span class="fn">print</span>(f<span class="str">"compiled: {bench(step_compiled):.2f} ms/step"</span>)
<span class="cm"># Tipik A100 sayıları: eager ~38 ms, compiled ~22 ms (~%70 daha hızlı).</span></code></pre></div>

<p class="l-text">Birkaç uyarı. Hızlanmalar modele kuvvetlice bağlıdır: transformer encoder/decoder'lar en büyük kazanımları görür çünkü dikkat birleştirilebilir birçok op'a sahiptir; küçük CNN'ler daha az fayda görür çünkü kernel'ler zaten yeterince büyüktür ki fusion tasarrufları marjinaldir. Dizi uzunluğu varyasyonu sessiz katildir -- batch şeklin her adımda değişirse (değişken uzunluklu metin), varsayılan derleme yeniden derler ve eğitimden daha fazla zamanı derlemede geçirirsin. Bölüm 5 bunu nasıl tespit edip düzelteceğini gösteriyor.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Graph Break'ler ve Yeniden Derlemeler</h2>

<p class="l-text">TorchDynamo modelini sembolik olarak yürüterek bir grafik çıkarır. Sembolik olarak ele alamadığı bir şeye çarptığında mevcut grafiği sonlandırır, ihlal eden kodu eager modunda çalıştırır ve sonrasında yeni bir grafik başlatır. Her break sana bir derleme çağrısına mal olur ve sınır boyunca fusion'ı kırar. İşte yaygın nedenler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Veriye bağlı kontrol akışı</div><div class="card-body"><code>if x.sum() &gt; 0:</code> -- dal bir çalışma zamanı tensör değerine bağlıdır. Dynamo statik olarak karar veremez.</div></div>
<div class="calc-card"><div class="card-title">Python yan etkileri</div><div class="card-body"><code>print</code>, <code>logger.info</code>, global bir liste değiştirme. Dynamo bunları grafiğe pişirmeyi reddeder.</div></div>
<div class="calc-card"><div class="card-title">Desteklenmeyen op'lar</div><div class="card-body">Bazı üçüncü taraf CUDA kernel'leri, Dynamo kaydı olmayan özel C++ op'ları.</div></div>
<div class="calc-card"><div class="card-title">Şekil uyuşmazlığı</div><div class="card-body">Önbelleğe alınmış derlemeden farklı batch / dizi uzunluğu bir yeniden derleme tetikler.</div></div>
<div class="calc-card"><div class="card-title">Tip değişiklikleri</div><div class="card-body">Eğitim ortasında dtype değiştirme (fp32 -&gt; fp16), dinamik dtype işleme olmadan.</div></div>
<div class="calc-card"><div class="card-title">Sözlük mutasyonları</div><div class="card-body">forward içinde <code>__dict__</code> veya <code>self.foo</code> niteliklerini değiştirme.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Graph break'leri teşhis et: ayrıntılı log'ları etkinleştir</span>
<span class="kw">import</span> os
os.environ[<span class="str">"TORCH_LOGS"</span>] = <span class="str">"graph_breaks,recompiles"</span>

<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">BadModel</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">10</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h = self.<span class="fn">fc</span>(x)
        <span class="cm"># GRAPH BREAK: tensör değeri üzerinde veriye bağlı dal</span>
        <span class="kw">if</span> h.<span class="fn">mean</span>().<span class="fn">item</span>() &gt; <span class="num">0</span>:
            h = h * <span class="num">2</span>
        <span class="cm"># GRAPH BREAK: print bir Python yan etkisidir</span>
        <span class="fn">print</span>(<span class="str">"debug: pass-through"</span>)
        <span class="kw">return</span> h

<span class="kw">class</span> <span class="fn">GoodModel</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc = nn.<span class="fn">Linear</span>(<span class="num">10</span>, <span class="num">10</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h = self.<span class="fn">fc</span>(x)
        <span class="cm"># Python if yerine torch.where -- grafikte kalır</span>
        h = torch.<span class="fn">where</span>(h &gt; <span class="num">0</span>, h * <span class="num">2</span>, h)
        <span class="kw">return</span> h

<span class="cm"># Geliştirme sırasında graph break'lerde hata zorla</span>
compiled = torch.<span class="fn">compile</span>(<span class="fn">GoodModel</span>(), fullgraph=<span class="kw">True</span>)</code></pre></div>

<p class="l-text">En yararlı tek ortam değişkeni <code>TORCH_LOGS=graph_breaks,recompiles</code>. Her break'i ve her yeniden derlemeyi ihlal eden satırın kaynak konumuyla birlikte yazdırır. Eğitim döngünü bu etkinleştirilmiş hâlde birkaç adım çalıştır, kesin bir yapılacaklar listesi elde edersin. İkinci en yararlı bayrak <code>torch.compile</code> üzerinde <code>fullgraph=True</code>, graph break'leri sessiz geri çekilmeler yerine hatalara dönüştürür -- yarı derlenmiş bir model göndermek yerine bunları düzeltmeye zorlar.</p>

<div class="l-warn"><strong>Yeniden derleme çırpınma anti-pattern'i:</strong> değişken uzunluklu diziler (NLP, ses) üzerinde <code>dynamic=True</code> ayarlamadan eğitim. Her yeni dizi uzunluğu taze bir derleme tetikler. Üçüncü epoch'a kadar aynı modeli 50 kez derlemiş ve hiç fayda görmemiş olabilirsin. Düzeltme: <code>torch.compile(model, dynamic=True)</code> sembolik şekillerle bir kez derler, herhangi bir batch / dizi uzunluğunu kabul eder.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Karışık Hassasiyet: Neden 16 Bit 32'yi Yener?</h2>

<p class="l-text">Dersin yarısı grafik derlemesidir; diğer yarısı o grafikten akan tensörlerin hangi sayısal formatı kullandığıdır. Karışık hassasiyet, ağırlıkları ve forward hesaplamasını 16 bitlik kayan noktalarda saklarken 32 bitlik bir ana ağırlık kopyası ve gradyan akümülatörleri tutma hilesidir. Hâkim olmasının iki nedeni: bellek ve Tensor Core'lar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FP32 baseline</div><div class="card-body">Değer başına 4 bayt. Geniş aralık ve hassasiyet. 2018 öncesinin "güvenli" varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">FP16 avantajı</div><div class="card-body">Değer başına 2 bayt -- 2x bellek, 2x bant genişliği, 2x Tensor Core throughput'u.</div></div>
<div class="calc-card"><div class="card-title">Tensor Core'lar</div><div class="card-body">Volta+ GPU'ların FP16/BF16 tüketen ve FP32 çıktı veren özel matmul birimleri vardır. FP32 çekirdeklerinden 16x'e kadar hızlı.</div></div>
<div class="calc-card"><div class="card-title">Tuzak</div><div class="card-body">FP16 dar aralığa sahip (~5e-8 ile 65504). Küçük gradyanlar 0'a alttan taşar.</div></div>
<div class="calc-card"><div class="card-title">Çözüm</div><div class="card-body">Loss ölçeklendirme: backward'dan önce loss'u 2^k ile çarp, optimizer adımından önce gradyanları 2^k'ya böl.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Eğitilmiş modellerin %99'unda aynı doğruluk. Bazı görevler (RL, bazı GAN'lar) daha hassas.</div></div>
</div>

<div class="katex-block">$$\\text{FP16 range: } [6\\times 10^{-8},\\, 65504] \\qquad \\text{FP32 range: } [10^{-38},\\, 10^{38}]$$</div>

<p class="l-text">Bir FP16 sayısının yapısı 1 işaret biti, 5 üs biti, 10 mantissa bitidir. O 5 bitlik üs sorundur -- yalnızca ~10 büyüklük mertebesini kapsar, oysa FP32'nin 8 bitlik üssü ~76'yı kapsar. Backward sırasında birçok gradyan minicik olur (derin bir transformer'ın geç katmanlarındaki parametreler için 1e-7 aralığı). FP16 bunları temsil edemez -- sıfıra alttan taşarlar. Parametre gradyan = 0 görür ve öğrenmeyi durdurur.</p>

<p class="l-text">Çözüm loss ölçeklendirmedir. <code>backward()</code>'tan önce loss'u bir S ölçek faktörüyle (örn. 65536) çarp. O zaman tüm gradyanlar temsil edilebilir FP16 aralığında olur. Optimizer adımından önce gradyanları S'ye geri böl. Matematik tamdır ve alttan taşma gitmiştir. <code>GradScaler</code>'in yaptığı budur.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. autocast + GradScaler: FP16 Reçetesi</h2>

<p class="l-text">PyTorch karışık hassasiyeti iki bağlam yöneticisinde paketler. <code>autocast</code> forward geçişini sarar ve op başına FP16 mi FP32 mi çalıştıracağına karar verir (matmul'lar FP16'da; loss / softmax / normalizasyon sayısal güvenlik için FP32'de). <code>GradScaler</code> backward geçişi etrafındaki loss ölçeklendirmeyi yönetir. Reçete, standart bir eğitim döngüsüne tam olarak beş satır eklenmiş hâlidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler

model = <span class="fn">MyModel</span>().<span class="fn">cuda</span>()
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">1e-4</span>)
scaler = <span class="fn">GradScaler</span>()           <span class="cm"># 1) Scaler oluştur</span>

<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">cuda</span>(), y.<span class="fn">cuda</span>()
    opt.<span class="fn">zero_grad</span>()

    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.float16):    <span class="cm"># 2) FP16'da forward</span>
        pred = <span class="fn">model</span>(x)
        loss = <span class="fn">criterion</span>(pred, y)

    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()       <span class="cm"># 3) Ölçeklendirilmiş backward</span>
    scaler.<span class="fn">unscale_</span>(opt)                  <span class="cm"># 4) Grad'ları unscale et (opsiyonel, clip için)</span>
    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
    scaler.<span class="fn">step</span>(opt)                       <span class="cm"># 5) Optimizer adım (NaN/Inf tespit edilirse atlar)</span>
    scaler.<span class="fn">update</span>()                         <span class="cm"># 6) Bir sonraki iter için scale'i güncelle</span></code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">autocast bölgesi</div><div class="card-body">Op başına dtype politikası: matmul FP16'da, softmax / layernorm FP32'de. Otomatik.</div></div>
<div class="calc-card"><div class="card-title">scaler.scale(loss)</div><div class="card-body">Loss'u S ile çarpar, böylece backward grad'ları FP16 aralığında kalır.</div></div>
<div class="calc-card"><div class="card-title">scaler.unscale_</div><div class="card-body">Grad'ları yerinde S'ye böler -- onları incelemek / clip'lemek istiyorsan gereklidir.</div></div>
<div class="calc-card"><div class="card-title">scaler.step</div><div class="card-body">Yalnızca NaN/Inf grad yoksa opt.step() çağırır. Aksi takdirde adımı atlar.</div></div>
<div class="calc-card"><div class="card-title">scaler.update</div><div class="card-body">Adım atlandıysa S'yi yarıya indirir; N adım kararlıysa S'yi iki katına çıkarır. Uyarlamalı.</div></div>
<div class="calc-card"><div class="card-title">init_scale</div><div class="card-body">Varsayılan 2^16 = 65536. Genellikle iyidir; erken iter NaN'ı sürerse düşür.</div></div>
</div>

<p class="l-text">Autocast bağlamı op başına karar verir. Dahili izin listesi kabaca şuna benzer: matmul, conv, linear -&gt; girdileri FP16'ya çevir. softmax, layernorm, batchnorm, sum / mean / std indirimleri -&gt; FP32'de tut. Nedeni: nokta çarpımları ve evrişimler FP16 girdilerini tolere eder çünkü Tensor Core içindeki akümülatör FP32'dir (veya daha yüksek), normalizasyon katmanları ise FP16'ya zorlanırsa tehlikeli şekilde hassasiyet kaybedebilecek indirimler yapar.</p>

<p class="l-text"><code>GradScaler</code>'in uyarlamalı politikası zariftir. Bir adımın gradyanları herhangi bir Inf veya NaN içeriyorsa (üstten taşma), optimizer adımı atlanır ve S yarıya indirilir. 2000 (varsayılan) ardışık adım üstten taşma olmadan başarılı olursa, S iki katına çıkarılır. Bu, gradyanları aralıkta tutan en büyük ölçeği otomatik olarak bulur.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. BF16: Beyin Kayan Noktası</h2>

<p class="l-text">FP16 çalışır ama loss ölçeklendirme can sıkıcı bir mekanizmadır -- ve üstten taşma nedeniyle atlanan birkaç yüzde adımı pahalıya mal olur. 2018'de Google'ın TPU ekibi <strong>bfloat16</strong>'yı önerdi: 1 işaret biti, 8 üs biti (FP32 ile eşleşir), 7 mantissa biti. FP16 ile aynı toplam boyut, aynı Tensor Core throughput'u, ama FP32'nin üs aralığı ile. Alttan taşma gider. GradScaler gereksiz hâle gelir.</p>

<div id="plot-pyt14-precision-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafikte:</strong> Her yaygın eğitim formatı için dinamik aralık (temsil edilebilir en büyük değer, log ölçeği) ve mantissa hassasiyeti (mantissa bit sayısı). FP32 sağ üstte oturur -- maksimum aralık ve hassasiyet, ama değer başına 4 bayt. FP16 hem aralığı hem hassasiyeti boyut için takas eder. BF16 FP32'nin aralığını korur ama hassasiyeti azaltır; pratikte bu neredeyse tüm derin öğrenme eğitimi için çalışır çünkü gradyanların son birkaç ondalık basamaktan çok aralığa ihtiyacı vardır. FP8 (E4M3, E5M2 varyantları) her ikisini de daha da keser, yalnızca donanım destekli ölçek faktörleriyle uygulanabilir. <strong>Neden önemli:</strong> format seçimi "daha çok bit daha iyidir" değildir -- aralık vs hassasiyet vs donanım throughput'udur. BF16 LLM eğitiminde hâkimdir çünkü gradyanlar 30+ büyüklük mertebesi kapsar; FP16 bunu temsil edemez, FP32 edebilir ama yarı throughput'ta.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FP16</div><div class="card-body">1+5+10 bit. Dar aralık, makul hassasiyet, GradScaler gerekir.</div></div>
<div class="calc-card"><div class="card-title">BF16</div><div class="card-body">1+8+7 bit. FP32 aralığı, daha düşük hassasiyet, scaler gerekmez.</div></div>
<div class="calc-card"><div class="card-title">Donanım</div><div class="card-body">BF16 Ampere'de (A100) ve sonrasında yereldir. Eski Pascal/Volta'da yerel destek yok.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kullanmalı</div><div class="card-body">GPU'nuz destekliyorsa BF16 -- FP16'dan kesinlikle daha kolay.</div></div>
<div class="calc-card"><div class="card-title">LLM varsayılanı</div><div class="card-body">Llama, Mistral, Falcon, Gemma -- hepsi BF16'da eğitilmiş.</div></div>
<div class="calc-card"><div class="card-title">Uyarı</div><div class="card-body">BF16'nın 7 bitlik mantissa'sı, bazı çıkarım iş yüklerinin son ondalık doğruluğu için hâlâ FP16 veya FP32'yi tercih ettiği anlamına gelir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast

<span class="cm"># BF16 reçetesi: GradScaler yok, daha basit döngü</span>
<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">cuda</span>(), y.<span class="fn">cuda</span>()
    opt.<span class="fn">zero_grad</span>()

    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
        pred = <span class="fn">model</span>(x)
        loss = <span class="fn">criterion</span>(pred, y)

    loss.<span class="fn">backward</span>()                       <span class="cm"># Ölçekleme gerekmiyor</span>
    torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
    opt.<span class="fn">step</span>()                              <span class="cm"># Standart optimizer adımı</span>

<span class="cm"># Çalışma zamanında donanım desteğinin tespiti</span>
<span class="kw">if</span> torch.cuda.<span class="fn">is_bf16_supported</span>():
    dtype = torch.bfloat16
<span class="kw">else</span>:
    dtype = torch.float16    <span class="cm"># FP16 + scaler'a geri dön</span></code></pre></div>

<p class="l-text">Yapısal ders: hassasiyeti, temsil etmesi gereken değerlerin dağılımına göre seç. Derin bir transformer'da gradyanlar birçok büyüklük mertebesini kapsar (erken katmanlarda 1e-8, doygunluğa yakın geç katmanlarda 1e2). <em>Aralık</em>'a ihtiyaçları vardır, hassasiyete değil. BF16 onlara aralığı ucuza verir. Aktivasyonlar benzerdir. Eksik mantissa bitlerinin bazen ısırdığı tek yer birçok örnek arasında loss biriktirmedir -- bu yüzden <code>loss</code> tensörleri ve indirimler bir autocast bölgesi içinde hâlâ FP32'de hesaplanır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. FP8: Hopper Sınırı</h2>

<p class="l-text">Hopper (H100, 2022) yerel FP8 Tensor Core'larını ekledi. İki varyant: ağırlıklar ve aktivasyonlar için <strong>E4M3</strong> (1+4+3, daha fazla hassasiyet), gradyanlar için <strong>E5M2</strong> (1+5+2, daha fazla aralık). FP8 H100'de BF16 üzerinde başka bir 2x throughput verir, ayrıca başka bir 2x bellek tasarrufu -- aksi takdirde sığmayacak modelleri etkinleştirir ve dağıtık eğitimde iletişim maliyetini azaltır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">E4M3</div><div class="card-body">Forward: ağırlıklar, aktivasyonlar. Aralık ~448, daha ince hassasiyet.</div></div>
<div class="calc-card"><div class="card-title">E5M2</div><div class="card-body">Backward: gradyanlar. Aralık ~57344, daha kaba hassasiyet. FP16'nın aralığını yansıtır.</div></div>
<div class="calc-card"><div class="card-title">Donanım</div><div class="card-body">H100 (Hopper) ve daha yenisi. Ampere veya öncesinde mevcut değil.</div></div>
<div class="calc-card"><div class="card-title">Transformer Engine</div><div class="card-body">FP8 ölçeklendirmesini otomatik olarak yöneten NVIDIA kütüphanesi. nn.Linear için drop-in değişim.</div></div>
<div class="calc-card"><div class="card-title">Kullanım alanları</div><div class="card-body">Sınır LLM eğitimi (söylenti: GPT-4, Claude, Gemini Ultra). Ölçekte çıkarım.</div></div>
<div class="calc-card"><div class="card-title">Uyarı</div><div class="card-body">Tensör başına ölçek faktörleri ayarlanmalıdır. TE olmadan elle FP8 yuvarlamak tehlikelidir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Taslak: NVIDIA Transformer Engine ile FP8</span>
<span class="kw">import</span> torch
<span class="kw">import</span> transformer_engine.pytorch <span class="kw">as</span> te
<span class="kw">from</span> transformer_engine.common.recipe <span class="kw">import</span> Format, DelayedScaling

<span class="cm"># Drop-in değişim: nn.Linear yerine te.Linear</span>
<span class="kw">class</span> <span class="fn">FP8Block</span>(torch.nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.fc1 = te.<span class="fn">Linear</span>(d, <span class="num">4</span>*d)
        self.fc2 = te.<span class="fn">Linear</span>(<span class="num">4</span>*d, d)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        <span class="kw">return</span> self.<span class="fn">fc2</span>(torch.<span class="fn">relu</span>(self.<span class="fn">fc1</span>(x)))

<span class="cm"># FP8 reçetesi: hibrit format (E4M3 forward, E5M2 backward) gecikmeli ölçekleme ile</span>
fp8_recipe = <span class="fn">DelayedScaling</span>(fp8_format=Format.HYBRID, amax_history_len=<span class="num">16</span>)

model = <span class="fn">FP8Block</span>(<span class="num">512</span>).<span class="fn">cuda</span>()
<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    <span class="kw">with</span> te.<span class="fn">fp8_autocast</span>(enabled=<span class="kw">True</span>, fp8_recipe=fp8_recipe):
        loss = <span class="fn">criterion</span>(<span class="fn">model</span>(x), y)
    loss.<span class="fn">backward</span>()
    opt.<span class="fn">step</span>()</code></pre></div>

<p class="l-text">FP8 henüz BF16 gibi tek satırlık bir drop-in değildir. Nedeni hassasiyet: yalnızca 3 veya 2 mantissa biti ile, matmul üzerinden rastgele tensör değerlerinin akmasına izin veremezsin -- tensörün gerçek aralığını FP8 temsil edilebilir aralığa eşleyen tensör başına bir ölçek faktörüne ihtiyacın vardır. NVIDIA'nın Transformer Engine'i bunu otomatik olarak <em>gecikmeli ölçekleme</em> ile yönetir: son K iterasyon boyunca görülen maksimum mutlak değeri (amax) takip eder ve bir sonraki iterasyon için ölçeği ayarlamak için kullanır. Bu defter tutma kullanıcı koduna görünmezdir.</p>

<div class="l-note"><strong>Ticareti okumak:</strong> FP32 -&gt; BF16 GPU'nuz destekliyorsa "düşünmeden" 2x hızlanmadır. BF16 -&gt; FP8 "hassasiyet riskini karşılayabilirsen ve H100 donanımın varsa 1.5-2x daha fazla hızlanma"dır. Kendiniz yuvarlamak yerine TE kullanın ve her zaman loss eğrilerinin gürültü içinde eşleştiği bir FP32 baseline ile doğrulayın.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Tam Reçete: compile + AMP + DDP</h2>

<p class="l-text">Üretim eğitim yığınları üç optimizasyonu da üst üste yığar. Sıra önemlidir: <code>DistributedDataParallel</code> modeli önce sarar (böylece her rank kendi kopyasını görür), sonra <code>torch.compile</code> DDP ile sarılmış modeli sarar (böylece derlenmiş grafik all-reduce'u içerir), sonra <code>autocast</code> forward çağrısını sarar (böylece her adım BF16'da çalışır).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist
<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP
<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast

<span class="cm"># 1) Dağıtık kurulum (torchrun üzerinden başlatılır)</span>
dist.<span class="fn">init_process_group</span>(<span class="str">"nccl"</span>)
rank = dist.<span class="fn">get_rank</span>()
torch.cuda.<span class="fn">set_device</span>(rank)
device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span>, rank)

<span class="cm"># 2) Modeli bu rank'in GPU'sunda oluştur</span>
model = <span class="fn">MyTransformer</span>().<span class="fn">to</span>(device)

<span class="cm"># 3) ÖNCE DDP ile sar -- her rank'a grad'ları all-reduce eden bir yerel kopya verir</span>
model = <span class="fn">DDP</span>(model, device_ids=[rank])

<span class="cm"># 4) SONRA torch.compile ile sar -- derlenmiş grafik all-reduce'u kapsar</span>
model = torch.<span class="fn">compile</span>(model, mode=<span class="str">"default"</span>)

<span class="cm"># 5) DDP ile sarılmış, derlenmiş modülün parametrelerinde optimizer</span>
opt = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)

<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(num_epochs):
    sampler.<span class="fn">set_epoch</span>(epoch)
    <span class="kw">for</span> x, y <span class="kw">in</span> loader:
        x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
        opt.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)

        <span class="cm"># 6) Autocast forward çağrısını sarar</span>
        <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
            loss = <span class="fn">criterion</span>(<span class="fn">model</span>(x), y)

        loss.<span class="fn">backward</span>()                       <span class="cm"># DDP burada otomatik all-reduce yapar</span>
        torch.nn.utils.<span class="fn">clip_grad_norm_</span>(model.<span class="fn">parameters</span>(), <span class="num">1.0</span>)
        opt.<span class="fn">step</span>()

dist.<span class="fn">destroy_process_group</span>()</code></pre></div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sıra önemli</div><div class="card-body">DDP -&gt; compile -&gt; autocast. Tersine çevirmek doğruluk veya performans hataları yaratır.</div></div>
<div class="calc-card"><div class="card-title">Neden önce DDP</div><div class="card-body">DDP, gradyan all-reduce için her parametrede hook'lar kaydetmek üzere orijinal modülü görmek zorundadır.</div></div>
<div class="calc-card"><div class="card-title">Neden ikinci compile</div><div class="card-body">Derlenmiş grafik o zaman DDP all-reduce op'larını içerir, mümkün olduğunda iletişimi hesaplamayla birleştirir.</div></div>
<div class="calc-card"><div class="card-title">FP16 yerine BF16</div><div class="card-body">GradScaler gerekmez; rank'lar arasında koordine edilecek bir şey daha az.</div></div>
<div class="calc-card"><div class="card-title">set_to_none=True</div><div class="card-body">Daha hızlı zero-grad: buffer'ı sıfırlamak yerine <code>.grad</code>'i None'a ayarlar.</div></div>
<div class="calc-card"><div class="card-title">Kaydetme</div><div class="card-body"><code>model.module._orig_mod.state_dict()</code> kaydet -- DDP ve compile'ı sıyırır.</div></div>
</div>

<p class="l-text"><strong>Sıyırma tuzağı.</strong> <code>torch.compile</code> modelinin etrafında bir <code>OptimizedModule</code> sarıcısı döndürür; DDP orijinal modülü <code>model.module</code>'da sarar. Ağırlıkları kaydetmek için, iki sarıcıyı da istemezsin: <code>model.module._orig_mod.state_dict()</code> sana alttaki düz modülün parametrelerini verir. Onları kaydet; yeniden yüklemede taze bir model kur, state_dict'i yükle, sonra yeniden sar. Bunu unutmak bu katmandaki en yaygın üretim hatasıdır -- yalnızca tam olarak aynı şekilde derler ve DDP ile sararsan başarıyla yüklenen checkpoint'lerle sonuçlanırsın.</p>

<p class="l-text">Bu reçeteyi tek bir A100 üzerinde eager-fp32 baseline'a karşı tipik bir 8x A100 kurulumundaki sayılar: ~12-14x eğitim throughput'u. Dağılım kabaca BF16'dan 2x, <code>torch.compile</code>'dan 1.5x ve 8-yönlü DDP'den ~5x'tir (all-reduce overhead'i nedeniyle alt doğrusal). Modelin loss eğrisi, validasyon doğruluğu ve son checkpoint'i eager baseline ile aynı şekilde davranır -- ki tüm mesele budur. Sayısal davranışı değiştiren optimizasyonlar optimizasyon değildir, hatadır.</p>

<div class="think-box"><div class="think-label">ANA NOKTALAR</div><div class="think-body"><strong>1.</strong> <code>torch.compile</code> bir JIT grafik derleyicisidir: eager PyTorch yaz, ilk çağrıda derlenmiş throughput al. Transformer'larda tipik %30-100 hızlanma.<br><strong>2.</strong> Ardışık düzen: TorchDynamo (Python -&gt; FX grafik) -&gt; AOTAutograd (birleşik fwd+bwd) -&gt; Inductor (Triton/C++ kernel'ler).<br><strong>3.</strong> Modlar: eğitim için <code>default</code>, küçük batch çıkarım için <code>reduce-overhead</code> (CUDA graph'lar), uzun süreli işler için <code>max-autotune</code>.<br><strong>4.</strong> Graph break'ler veriye bağlı kontrol akışından, print'lerden ve desteklenmeyen op'lardan gelir. <code>TORCH_LOGS=graph_breaks,recompiles</code> ile teşhis et. <code>fullgraph=True</code> ile zorla.<br><strong>5.</strong> Değişken şekiller önbelleği çırpındırır; <code>dynamic=True</code> sembolik şekillerle bir kez derler.<br><strong>6.</strong> FP16 dar üs aralığı nedeniyle <code>GradScaler</code>'a ihtiyaç duyar; BF16 ihtiyaç duymaz çünkü üssü FP32 ile eşleşir.<br><strong>7.</strong> BF16 Ampere+ üzerinde eğitim için doğru varsayılandır; FP16 yalnızca GPU'nuzda BF16 desteği yoksa.<br><strong>8.</strong> FP8 (yalnızca H100, NVIDIA Transformer Engine üzerinden) sınır ölçekli eğitim için BF16 üzerinde başka bir 2x verir.<br><strong>9.</strong> Üretim sırası: DDP -&gt; compile -&gt; autocast. State_dict kaydetmeden önce <code>model.module._orig_mod</code> ile sıyır.<br><strong>10.</strong> Üst üste yığılmış, bu teknikler tek GPU eager baseline'a karşı 8 GPU üzerinde ~12-14x throughput sunar, özdeş loss eğrileriyle.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  // Graphs defined together with EN block above.
}, 250);</script>`
};
