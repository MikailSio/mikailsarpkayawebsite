window.PYTORCH_L13 = {

en: `<p class="l-text"><strong>One GPU is a toy. Real training in 2026 is distributed.</strong> Llama 3 70B was trained on roughly 16,000 H100 GPUs for several months. A single A100 would need over a hundred years for the same run. The bridge from "I train MNIST on my laptop" to "I train a 70B-param transformer on a cluster" is one of the highest-leverage things you can learn in PyTorch -- and it boils down to a handful of primitives: process groups, AllReduce, sharded parameters, and a couple of launchers.</p>

<p class="l-text">This lesson covers the entire modern distributed stack: <code>torch.distributed</code> primitives, why <code>DataParallel</code> is dead, how <code>DistributedDataParallel</code> (DDP) actually overlaps gradient sync with backward, and how <code>FullyShardedDataParallel</code> (FSDP) trades compute for memory so you can train 70B-param models on commodity nodes. We also cover mixed precision (fp16/bf16 with autocast and GradScaler), gradient accumulation, and the 3D parallelism patterns (DP + TP + PP) used at frontier scale.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Why a 70B model needs distributed training and the three axes of parallelism</li>
<li>The <code>torch.distributed</code> primitives: process groups, ranks, world size, NCCL vs Gloo</li>
<li>Why <code>DataParallel</code> is obsolete and what <code>DistributedDataParallel</code> does differently</li>
<li>Launching multi-GPU training with <code>torchrun</code>, <code>DistributedSampler</code>, and DDP</li>
<li>FSDP for memory-bound training: sharded params, grads and optimizer states</li>
<li>Mixed precision (fp16 vs bf16), <code>GradScaler</code>, gradient accumulation tricks</li>
<li>Production patterns: ZeRO-3, 3D parallelism, what Llama 3 actually used</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Distributed? The Math of Modern Training</h2>

<p class="l-text">A modern frontier model has somewhere between 7B and 405B parameters. The compute required to train one is measured in <em>petaflop-days</em>: a 70B model on roughly 15T tokens runs about 6.3 &times; 10<sup>23</sup> floating-point operations. Below is the back-of-the-envelope that motivates everything in this lesson.</p>

<div class="katex-block">$$\\\\text{FLOPs} \\\\approx 6 \\\\cdot N_{\\\\text{params}} \\\\cdot N_{\\\\text{tokens}}$$</div>

<p class="l-text">This is the well-known scaling rule for transformer pretraining (the factor of 6 covers forward + backward + activations). Plug in N=70B and tokens=15T and you get ~6.3e23 FLOPs. An A100 sustains around 312 TFLOPS in bf16; an H100 about 989 TFLOPS. Single-GPU wall time:</p>

<div class="katex-block">$$T_{\\\\text{single}} = \\\\frac{6.3 \\\\times 10^{23}}{989 \\\\times 10^{12}} \\\\;\\\\text{seconds} \\\\approx 6.4 \\\\times 10^{8}\\\\,\\\\text{s} \\\\approx 20\\\\,\\\\text{years}$$</div>

<p class="l-text">Twenty years on one H100 is not a research timeline. Spread the work across 16,000 H100s with ~50% efficiency and you get roughly 80 days of wall clock -- which matches Meta's reported Llama 3 numbers. That is the entire reason distributed training exists. There are three axes you can split along:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Data Parallelism (DP)</div><div class="card-body">Replicate the model on each GPU; split the batch. Each GPU computes gradients on its shard, then everyone averages via AllReduce. DDP and FSDP both live here.</div></div>
<div class="calc-card"><div class="card-title">Tensor Parallelism (TP)</div><div class="card-body">Split individual matrix multiplies across GPUs. A 16k&times;16k matmul becomes eight 16k&times;2k partial matmuls. Megatron-LM style. High bandwidth required.</div></div>
<div class="calc-card"><div class="card-title">Pipeline Parallelism (PP)</div><div class="card-body">Split the model layer-wise across GPUs; pass activations down the pipeline like an assembly line. Microbatches hide the bubble.</div></div>
<div class="calc-card"><div class="card-title">3D Parallelism</div><div class="card-body">Combine all three. Llama 3 used DP&times;TP&times;PP grids of thousands of GPUs simultaneously.</div></div>
<div class="calc-card"><div class="card-title">Sharded DP (ZeRO / FSDP)</div><div class="card-body">A modification of DP that shards optimizer states, gradients, and parameters across DP ranks to reclaim memory.</div></div>
<div class="calc-card"><div class="card-title">Cost driver</div><div class="card-body">Compute scales with N&times;tokens; memory scales with N alone. The art is choosing which axis to scale on.</div></div>
</div>

<p class="l-text">For 90% of teams the right answer is DDP for models up to ~7B and FSDP for anything larger. The rest of this lesson is a deep dive into both, plus the supporting primitives.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. torch.distributed Primitives: Process Group, Rank, AllReduce</h2>

<p class="l-text">Before any wrapper, there is a tiny vocabulary you need. A <strong>process group</strong> is a set of processes that can talk to each other; <strong>rank</strong> is each process's ID inside that group (0 to world_size-1); <strong>world size</strong> is the total count. A <strong>backend</strong> is the wire protocol -- NCCL for NVIDIA GPUs (uses NVLink/InfiniBand), Gloo for CPU and as a fallback.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist

<span class="kw">def</span> <span class="fn">setup</span>():
    <span class="cm"># torchrun sets RANK, LOCAL_RANK, WORLD_SIZE, MASTER_ADDR, MASTER_PORT</span>
    dist.<span class="fn">init_process_group</span>(backend=<span class="str">"nccl"</span>)        <span class="cm"># or "gloo" on CPU</span>
    local_rank = <span class="fn">int</span>(os.environ[<span class="str">"LOCAL_RANK"</span>])
    torch.cuda.<span class="fn">set_device</span>(local_rank)
    <span class="kw">return</span> local_rank

<span class="kw">def</span> <span class="fn">cleanup</span>():
    dist.<span class="fn">destroy_process_group</span>()

<span class="cm"># Anywhere in the program after setup():</span>
rank        = dist.<span class="fn">get_rank</span>()           <span class="cm"># 0..world_size-1</span>
world_size  = dist.<span class="fn">get_world_size</span>()     <span class="cm"># e.g. 8 for an 8xH100 node</span>

<span class="cm"># Collective: AllReduce sums a tensor across all ranks, every rank sees the sum</span>
t = torch.<span class="fn">tensor</span>([<span class="fn">float</span>(rank)], device=<span class="str">"cuda"</span>)
dist.<span class="fn">all_reduce</span>(t, op=dist.ReduceOp.SUM)
<span class="cm"># With world_size=4, every rank now has t = 0+1+2+3 = 6</span>

<span class="cm"># Broadcast: rank 0 sends, everyone else receives</span>
config = torch.<span class="fn">tensor</span>([<span class="num">42</span>], device=<span class="str">"cuda"</span>) <span class="kw">if</span> rank == <span class="num">0</span> <span class="kw">else</span> torch.<span class="fn">zeros</span>(<span class="num">1</span>, device=<span class="str">"cuda"</span>)
dist.<span class="fn">broadcast</span>(config, src=<span class="num">0</span>)

<span class="cm"># Barrier: blocks until every rank reaches this line</span>
dist.<span class="fn">barrier</span>()

<span class="cm"># Useful pattern: only rank 0 logs / saves checkpoints</span>
<span class="kw">if</span> rank == <span class="num">0</span>:
    <span class="fn">print</span>(<span class="str">f"world_size={world_size}, NCCL backend ready"</span>)</code></pre></div>

<p class="l-text">A few notes on backends. <strong>NCCL</strong> is the NVIDIA Collective Communications Library and is the only realistic choice on multi-GPU NVIDIA systems -- it understands NVLink topologies and InfiniBand RDMA and can do AllReduce at 90%+ of the theoretical link bandwidth. <strong>Gloo</strong> works on CPU and over plain TCP; useful for laptops, CI tests, and CPU-only clusters. <strong>MPI</strong> is supported but rarely the right choice unless you already have an MPI cluster.</p>

<div class="l-warn"><strong>Common AllReduce mistake:</strong> putting a collective call inside an <code>if rank == 0</code> block. Every rank must participate in every collective in the same order, or the program deadlocks. If you need conditional work, use <code>dist.barrier()</code> to synchronize <em>around</em> the rank-0-only block, not inside it.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DataParallel (DP): the Antipattern</h2>

<p class="l-text">PyTorch ships an older wrapper, <code>nn.DataParallel</code>, that pretends to be a one-line answer to "use multiple GPUs". It is a trap. It runs everything in a single Python process, scatters the input batch to each GPU, gathers the outputs back to GPU 0, and Python's Global Interpreter Lock means you spend a chunk of every iteration on data movement and serial dispatch.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">nn.DataParallel (DP)</div><div class="compare-item">Single Python process</div><div class="compare-item">Master GPU (0) becomes a bottleneck</div><div class="compare-item">Scatter/gather every step</div><div class="compare-item">~50-60% of ideal speedup at best</div><div class="compare-item">GIL hurts throughput</div><div class="compare-item">Status: deprecated in spirit</div></div>
<div class="compare-col"><div class="compare-title">DistributedDataParallel (DDP)</div><div class="compare-item">One Python process per GPU</div><div class="compare-item">No master GPU</div><div class="compare-item">AllReduce only on gradients</div><div class="compare-item">~85-95% of ideal speedup</div><div class="compare-item">No GIL contention</div><div class="compare-item">Status: standard since 2019</div></div>
</div>

<p class="l-text">The mental model: DP is one chef trying to cook from four ovens at once, running back and forth and stacking plates in front of oven #1 to serve. DDP is four chefs in their own kitchens, each cooking the same recipe on different ingredients, then comparing notes briefly to keep their seasoning in sync. If you see <code>nn.DataParallel</code> in a 2026 codebase, your first task is to migrate it to DDP.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. DistributedDataParallel (DDP): How It Actually Works</h2>

<p class="l-text">DDP is one Python process per GPU. Each process holds a full replica of the model, sees a different slice of the batch, runs forward and backward independently, and during <code>backward()</code> the gradient tensors are summed across ranks via AllReduce. After the backward pass, every replica has identical gradients, the optimizer step is also identical, and the replicas stay in lockstep. No master GPU, no scatter/gather of activations.</p>

<div class="katex-block">$$g_{\\\\text{global}} = \\\\frac{1}{P} \\\\sum_{p=1}^{P} g_{p}, \\\\quad \\\\text{effective batch} = B_{\\\\text{local}} \\\\cdot P$$</div>

<p class="l-text">Where P is world size. The clever bit: DDP overlaps the AllReduce of earlier-layer gradients with the backward pass of later layers. Gradient buckets fire AllReduce calls as soon as their layer finishes backward, so communication hides behind compute. On a healthy NVLink + InfiniBand setup the overhead is often under 10% of step time, and scaling efficiency stays above 90% up to ~64 GPUs.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist
<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP

<span class="cm"># 1) Initialize the process group (launched by torchrun)</span>
dist.<span class="fn">init_process_group</span>(backend=<span class="str">"nccl"</span>)
local_rank = <span class="fn">int</span>(os.environ[<span class="str">"LOCAL_RANK"</span>])
torch.cuda.<span class="fn">set_device</span>(local_rank)

<span class="cm"># 2) Build the model on the correct GPU</span>
model = <span class="fn">MyTransformer</span>().<span class="fn">to</span>(local_rank)

<span class="cm"># 3) Wrap in DDP -- one line</span>
ddp_model = <span class="fn">DDP</span>(model, device_ids=[local_rank])

<span class="cm"># 4) Use ddp_model exactly as you'd use a normal nn.Module</span>
optimizer = torch.optim.<span class="fn">AdamW</span>(ddp_model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
loss_fn   = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
    x, y = x.<span class="fn">to</span>(local_rank), y.<span class="fn">to</span>(local_rank)
    logits = <span class="fn">ddp_model</span>(x)
    loss   = <span class="fn">loss_fn</span>(logits, y)

    optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)
    loss.<span class="fn">backward</span>()              <span class="cm"># &lt;-- AllReduce of gradients happens here, layer-by-layer</span>
    optimizer.<span class="fn">step</span>()

<span class="cm"># Access the underlying module via .module (e.g. for saving)</span>
<span class="kw">if</span> dist.<span class="fn">get_rank</span>() == <span class="num">0</span>:
    torch.<span class="fn">save</span>(ddp_model.module.<span class="fn">state_dict</span>(), <span class="str">"ckpt.pt"</span>)

dist.<span class="fn">destroy_process_group</span>()</code></pre></div>

<p class="l-text">Three details worth burning in. First, the wrapper is one line: <code>DDP(model, device_ids=[local_rank])</code>. Second, gradient sync is implicit -- it fires inside <code>loss.backward()</code>, you do not call any collective by hand. Third, to access non-Module attributes of your real model (e.g. a custom <code>generate()</code> method), reach through <code>ddp_model.module</code>; DDP forwards the standard <code>forward</code> path but does not proxy arbitrary attributes.</p>

<div class="l-warn"><strong>Two DDP gotchas:</strong> (1) Every rank must call the same number of <code>backward()</code> passes per epoch -- uneven batch counts cause hangs. The <code>DistributedSampler</code> handles this. (2) If parts of your model are <em>not</em> used on every forward pass, DDP will hang waiting for their gradients. Pass <code>find_unused_parameters=True</code> to the DDP constructor, but understand it adds overhead -- the better fix is to make your forward path uniform.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. End-to-End DDP: torchrun + DistributedSampler</h2>

<p class="l-text">A real DDP training script has three pieces beyond the wrapper: a launcher (<code>torchrun</code>), a sampler that gives each rank a disjoint slice of the dataset (<code>DistributedSampler</code>), and a training loop with the right <code>sampler.set_epoch(epoch)</code> call so shuffling differs between epochs. Here is the full picture.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON -- train_ddp.py</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist
<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader, DistributedSampler, TensorDataset

<span class="kw">def</span> <span class="fn">main</span>():
    dist.<span class="fn">init_process_group</span>(backend=<span class="str">"nccl"</span>)
    local_rank = <span class="fn">int</span>(os.environ[<span class="str">"LOCAL_RANK"</span>])
    rank       = dist.<span class="fn">get_rank</span>()
    world_size = dist.<span class="fn">get_world_size</span>()
    torch.cuda.<span class="fn">set_device</span>(local_rank)
    device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span>, local_rank)

    <span class="cm"># Fake data: 50k samples of 128-token IDs, 10 classes</span>
    X = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">30000</span>, (<span class="num">50000</span>, <span class="num">128</span>))
    y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">10</span>,    (<span class="num">50000</span>,))
    dataset = <span class="fn">TensorDataset</span>(X, y)

    <span class="cm"># DistributedSampler: each rank sees a disjoint shard, no overlap</span>
    sampler = <span class="fn">DistributedSampler</span>(dataset, num_replicas=world_size,
                                 rank=rank, shuffle=<span class="kw">True</span>, drop_last=<span class="kw">True</span>)
    loader  = <span class="fn">DataLoader</span>(dataset, batch_size=<span class="num">32</span>, sampler=sampler,
                         num_workers=<span class="num">4</span>, pin_memory=<span class="kw">True</span>)

    <span class="kw">class</span> <span class="fn">Net</span>(nn.Module):
        <span class="kw">def</span> <span class="fn">__init__</span>(self):
            <span class="fn">super</span>().<span class="fn">__init__</span>()
            self.emb = nn.<span class="fn">Embedding</span>(<span class="num">30000</span>, <span class="num">256</span>)
            self.fc  = nn.<span class="fn">Linear</span>(<span class="num">256</span>, <span class="num">10</span>)
        <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
            <span class="kw">return</span> self.<span class="fn">fc</span>(self.<span class="fn">emb</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>))

    model = <span class="fn">Net</span>().<span class="fn">to</span>(device)
    model = <span class="fn">DDP</span>(model, device_ids=[local_rank])

    opt   = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
    loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

    <span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
        sampler.<span class="fn">set_epoch</span>(epoch)   <span class="cm"># important: reshuffle differently each epoch</span>
        model.<span class="fn">train</span>()
        <span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
            x = x.<span class="fn">to</span>(device, non_blocking=<span class="kw">True</span>)
            y = y.<span class="fn">to</span>(device, non_blocking=<span class="kw">True</span>)
            opt.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)
            logits = <span class="fn">model</span>(x)
            loss   = <span class="fn">loss_fn</span>(logits, y)
            loss.<span class="fn">backward</span>()        <span class="cm"># implicit gradient AllReduce</span>
            opt.<span class="fn">step</span>()

            <span class="kw">if</span> rank == <span class="num">0</span> <span class="kw">and</span> step % <span class="num">50</span> == <span class="num">0</span>:
                <span class="fn">print</span>(<span class="str">f"epoch {epoch} step {step}  loss={loss.item():.4f}"</span>)

    <span class="kw">if</span> rank == <span class="num">0</span>:
        torch.<span class="fn">save</span>(model.module.<span class="fn">state_dict</span>(), <span class="str">"ddp_ckpt.pt"</span>)

    dist.<span class="fn">destroy_process_group</span>()

<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    <span class="fn">main</span>()</code></pre></div>

<p class="l-text">Launch it with <code>torchrun</code>. This used to be <code>python -m torch.distributed.launch</code>; <code>torchrun</code> is the modern, simpler entry point and is the only one you should use in 2026.</p>

<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Single node, 8 GPUs:</span>
torchrun --standalone --nproc_per_node=8 train_ddp.py

<span class="cm"># Two nodes, 8 GPUs each (run on each node, with $NODE_RANK = 0 or 1):</span>
torchrun \\
  --nnodes=2 --node_rank=$NODE_RANK \\
  --nproc_per_node=8 \\
  --rdzv_id=llama-run-42 --rdzv_backend=c10d \\
  --rdzv_endpoint=node0.cluster:29400 \\
  train_ddp.py</code></pre></div>

<p class="l-text">Reading the script top to bottom: init_process_group brings up NCCL; <code>DistributedSampler</code> shards the dataset so the union of all ranks' batches equals one full pass; <code>set_epoch(epoch)</code> reshuffles between epochs (forget this and every epoch sees the same order); the DDP-wrapped model is used exactly like a normal Module; <code>loss.backward()</code> fires the gradient AllReduce; rank 0 saves the underlying <code>.module.state_dict()</code> (not the DDP wrapper, which would also pickle internal state). The two-node example uses <code>c10d</code> rendezvous: <code>--rdzv_endpoint</code> is the host:port the workers use to find each other.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. FSDP: When the Model Doesn't Fit in One GPU</h2>

<p class="l-text">DDP replicates everything. On 8 GPUs, you keep <em>eight</em> copies of the parameters, eight copies of the gradients, and eight copies of the optimizer states. Adam keeps two moments per parameter -- that is 12 bytes of optimizer state per fp32 weight, or 6 bytes per bf16 weight. A 7B model in mixed precision needs roughly 14 GB for parameters, 14 GB for gradients, and 42 GB for Adam moments -- a hair over 70 GB total, just barely fitting an 80GB A100 with nothing left for activations. A 13B model does not fit at all. A 70B model is hopeless.</p>

<p class="l-text">Fully Sharded Data Parallel (FSDP) is the answer. It is mathematically identical to data parallelism but stores only a <em>shard</em> of each tensor on each rank. When a layer is about to compute, FSDP issues an AllGather to materialize the full parameter on the GPU; right after the backward of that layer, the full parameter is discarded and only the local shard is kept. Optimizer states and gradients live as shards permanently.</p>

<div class="katex-block">$$M_{\\\\text{DDP}} \\\\;=\\\\; P + G + O \\\\qquad M_{\\\\text{FSDP}} \\\\;\\\\approx\\\\; \\\\tfrac{1}{W}\\\\,(P + G + O)$$</div>

<p class="l-text">Where P, G, O are parameter, gradient and optimizer-state memory and W is world size. With W=8 you get a 4-8x memory reduction in practice (not exactly 8x because of communication buffers and transient AllGathers). This is the magic that lets you train a 70B parameter model on a node of 8 H100s where DDP would OOM on a 7B.</p>

<div id="plot-pyt13-mem-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Memory breakdown per GPU for a 7B-parameter transformer in mixed precision, comparing DDP (full replication) and FSDP with FULL_SHARD across 8 GPUs. Bars split into parameters (bf16), gradients (bf16), and optimizer states (fp32 Adam moments). DDP keeps the full 70 GB stack on every GPU; FSDP shards each component across 8 ranks, dropping per-GPU steady-state memory to roughly 9 GB plus transient AllGather buffers. <strong>Why it matters:</strong> the freed memory is what you spend on bigger models, longer sequences, or larger micro-batches -- the three knobs that drive frontier-model training.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. FSDP API: auto_wrap_policy and sharding_strategy</h2>

<p class="l-text">FSDP is one wrapper but several knobs. The two that matter most: <code>auto_wrap_policy</code> tells FSDP at which granularity to shard (each transformer block separately, or one big shard of the whole model?), and <code>sharding_strategy</code> tells it how aggressively to shard.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FULL_SHARD (= ZeRO-3)</div><div class="card-body">Shard params, grads, and optimizer states. Maximum memory savings. Default for large-model training.</div></div>
<div class="calc-card"><div class="card-title">SHARD_GRAD_OP (= ZeRO-2)</div><div class="card-body">Shard grads and optimizer states; replicate params. Less communication, more memory than FULL_SHARD.</div></div>
<div class="calc-card"><div class="card-title">NO_SHARD (= DDP)</div><div class="card-body">Replicate everything. Equivalent to DDP. Useful for benchmarking or tiny models.</div></div>
<div class="calc-card"><div class="card-title">HYBRID_SHARD</div><div class="card-body">FULL_SHARD within a node, replicate across nodes. Trades memory for less cross-node traffic.</div></div>
<div class="calc-card"><div class="card-title">auto_wrap_policy</div><div class="card-body">Per-block sharding (e.g. one wrap per transformer layer) lets FSDP overlap AllGather with compute. Critical for performance.</div></div>
<div class="calc-card"><div class="card-title">CPU offload</div><div class="card-body">Push optimizer states to CPU RAM. Saves even more GPU memory at the cost of PCIe traffic.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> functools
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist
<span class="kw">from</span> torch.distributed.fsdp <span class="kw">import</span> (
    FullyShardedDataParallel <span class="kw">as</span> FSDP,
    ShardingStrategy,
    MixedPrecision,
    CPUOffload,
)
<span class="kw">from</span> torch.distributed.fsdp.wrap <span class="kw">import</span> transformer_auto_wrap_policy

<span class="kw">class</span> <span class="fn">TransformerBlock</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d=<span class="num">4096</span>, h=<span class="num">32</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.attn = nn.<span class="fn">MultiheadAttention</span>(d, h, batch_first=<span class="kw">True</span>)
        self.mlp  = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(d, <span class="num">4</span>*d), nn.<span class="fn">GELU</span>(), nn.<span class="fn">Linear</span>(<span class="num">4</span>*d, d))
        self.ln1  = nn.<span class="fn">LayerNorm</span>(d); self.ln2 = nn.<span class="fn">LayerNorm</span>(d)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h, _ = self.<span class="fn">attn</span>(self.<span class="fn">ln1</span>(x), self.<span class="fn">ln1</span>(x), self.<span class="fn">ln1</span>(x))
        x = x + h
        x = x + self.<span class="fn">mlp</span>(self.<span class="fn">ln2</span>(x))
        <span class="kw">return</span> x

<span class="kw">class</span> <span class="fn">LlamaIsh</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n_layers=<span class="num">32</span>, d=<span class="num">4096</span>, vocab=<span class="num">32000</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.emb    = nn.<span class="fn">Embedding</span>(vocab, d)
        self.blocks = nn.<span class="fn">ModuleList</span>([<span class="fn">TransformerBlock</span>(d) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_layers)])
        self.head   = nn.<span class="fn">Linear</span>(d, vocab, bias=<span class="kw">False</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">emb</span>(ids)
        <span class="kw">for</span> blk <span class="kw">in</span> self.blocks:
            x = <span class="fn">blk</span>(x)
        <span class="kw">return</span> self.<span class="fn">head</span>(x)

<span class="cm"># Wrap each TransformerBlock as a separate FSDP unit -- enables overlap</span>
wrap_policy = functools.<span class="fn">partial</span>(
    transformer_auto_wrap_policy,
    transformer_layer_cls={TransformerBlock},
)

<span class="cm"># bf16 compute, fp32 reductions -- the safe modern default on Ampere+</span>
mp = <span class="fn">MixedPrecision</span>(
    param_dtype=torch.bfloat16,
    reduce_dtype=torch.float32,
    buffer_dtype=torch.bfloat16,
)

model = <span class="fn">LlamaIsh</span>(n_layers=<span class="num">32</span>, d=<span class="num">4096</span>).<span class="fn">to</span>(torch.cuda.<span class="fn">current_device</span>())
fsdp_model = <span class="fn">FSDP</span>(
    model,
    auto_wrap_policy=wrap_policy,
    sharding_strategy=ShardingStrategy.FULL_SHARD,
    mixed_precision=mp,
    cpu_offload=<span class="fn">CPUOffload</span>(offload_params=<span class="kw">False</span>),  <span class="cm"># True if very memory-bound</span>
    device_id=torch.cuda.<span class="fn">current_device</span>(),
)

optimizer = torch.optim.<span class="fn">AdamW</span>(fsdp_model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
<span class="cm"># Training loop is identical to DDP from here on.</span></code></pre></div>

<p class="l-text">A few practical points. The <code>auto_wrap_policy</code> matters more than people realize -- if you wrap only the outermost <code>LlamaIsh</code> module, FSDP has one giant shard and cannot overlap AllGather with compute, so you lose most of the speed. Per-transformer-block wrapping is the standard. <code>MixedPrecision</code> with bf16 params and fp32 reductions is the safest modern choice; we cover this in detail next section. <code>CPUOffload</code> can save another ~2x of GPU memory but adds PCIe traffic, so reach for it only when GPU memory is the binding constraint.</p>

<div class="l-warn"><strong>FSDP checkpoint gotcha:</strong> when you save <code>fsdp_model.state_dict()</code> naively, each rank dumps its shard, not the full model. Use <code>FSDP.state_dict_type(model, StateDictType.FULL_STATE_DICT, ...)</code> as a context manager to gather the full unsharded state on rank 0 before saving. Forgetting this leaves you with checkpoints you cannot load later.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Mixed Precision: fp16 vs bf16, autocast, GradScaler</h2>

<p class="l-text">Storing weights and computing in 16-bit floats roughly halves memory and roughly doubles tensor-core throughput. PyTorch's mixed-precision API gives you this in two lines. There are two 16-bit formats and they behave very differently.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">fp16 (half)</div><div class="compare-item">Range: ~6e-5 to ~6.5e4</div><div class="compare-item">Precision: ~3 decimal digits</div><div class="compare-item">Narrow range; gradients underflow easily</div><div class="compare-item">Needs <code>GradScaler</code> to survive backward</div><div class="compare-item">Works on Volta and newer</div></div>
<div class="compare-col"><div class="compare-title">bf16 (bfloat16)</div><div class="compare-item">Range: same as fp32 (~1e-38 to 3e38)</div><div class="compare-item">Precision: ~2 decimal digits</div><div class="compare-item">Wide range; no underflow</div><div class="compare-item">No GradScaler needed</div><div class="compare-item">Requires Ampere (A100) or newer</div></div>
</div>

<p class="l-text">The right mental model: fp16 has more bits for the mantissa but a narrow exponent, so it overflows and underflows often; bf16 has the same exponent as fp32 but fewer mantissa bits, so it is less precise but never overflows on typical training-range numbers. For a 2026 training run on A100/H100 the default is bf16. Use fp16 only on older Volta/Turing GPUs that lack bf16 hardware.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler

device = <span class="str">"cuda"</span>
model     = <span class="fn">MyModel</span>().<span class="fn">to</span>(device)
optimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
loss_fn   = torch.nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># --- 1) bf16: no GradScaler needed ---</span>
<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
    optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)
    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
        logits = <span class="fn">model</span>(x)
        loss   = <span class="fn">loss_fn</span>(logits, y)
    loss.<span class="fn">backward</span>()
    optimizer.<span class="fn">step</span>()

<span class="cm"># --- 2) fp16: must wrap with GradScaler to avoid gradient underflow ---</span>
scaler = <span class="fn">GradScaler</span>()
<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
    optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)
    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.float16):
        logits = <span class="fn">model</span>(x)
        loss   = <span class="fn">loss_fn</span>(logits, y)
    <span class="cm"># scaler multiplies the loss by a large constant before backward,</span>
    <span class="cm"># so tiny gradients survive fp16 representation; it divides them out before optim.step()</span>
    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()
    scaler.<span class="fn">step</span>(optimizer)
    scaler.<span class="fn">update</span>()</code></pre></div>

<p class="l-text">Reading this carefully: <code>autocast</code> is a context manager that downcasts ops that have a 16-bit kernel (matmul, conv, attention) while leaving safety-critical ops in fp32 (LayerNorm, softmax reductions, loss). The result is fp16 or bf16 compute with an fp32 "master" copy of the weights inside the optimizer -- the standard mixed-precision recipe. <code>GradScaler</code> exists only for fp16: gradient values often live in the 1e-7 to 1e-5 range, which would underflow to zero in fp16. The scaler multiplies the loss by ~2<sup>15</sup> before backward, then unscales the gradients before the optimizer step. For bf16, gradients fit in the wider exponent range natively, so the scaler is unnecessary -- and trying to use it does nothing useful.</p>

<p class="l-text">Inside FSDP you do not call <code>autocast</code> manually -- you pass a <code>MixedPrecision</code> policy as we did in section 7. FSDP applies the cast at the parameter level for you, and the policy specifies a different dtype for the AllReduce of gradients (typically fp32) so accumulation is numerically safe.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Gradient Accumulation: Faking a Bigger Batch</h2>

<p class="l-text">Sometimes the per-step batch you want (say 1024) does not fit in GPU memory even with FSDP and bf16. Gradient accumulation is the universal escape hatch: run K mini-steps with <code>backward()</code> but no <code>optimizer.step()</code>, then step once. PyTorch accumulates gradients into the same <code>.grad</code> buffers by default, so the math is identical to a step on the full batch (modulo per-step BatchNorm statistics, which is a separate concern).</p>

<div class="katex-block">$$g_{\\\\text{eff}} \\\\;=\\\\; \\\\sum_{k=1}^{K} g_{k}, \\\\qquad B_{\\\\text{eff}} \\\\;=\\\\; K \\\\cdot B_{\\\\text{micro}} \\\\cdot W$$</div>

<p class="l-text">With micro-batch B_micro, accumulation K, and world size W, the effective batch is K&middot;B_micro&middot;W. The plain version:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>accum_steps = <span class="num">8</span>
optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)

<span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
    x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
        logits = <span class="fn">model</span>(x)
        loss   = <span class="fn">loss_fn</span>(logits, y) / accum_steps   <span class="cm"># scale loss so accumulated grad has the right magnitude</span>
    loss.<span class="fn">backward</span>()                                    <span class="cm"># accumulates into .grad</span>

    <span class="kw">if</span> (step + <span class="num">1</span>) % accum_steps == <span class="num">0</span>:
        optimizer.<span class="fn">step</span>()
        optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)</code></pre></div>

<p class="l-text">Now the wrinkle with DDP: by default <code>backward()</code> triggers an AllReduce. If you accumulate over K micro-steps you would do K AllReduces for one optimizer step -- wasteful, since only the final accumulated gradient matters. The fix is <code>model.no_sync()</code>, a context manager DDP exposes that disables the AllReduce on intermediate backwards. Only the last micro-step does the sync.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> contextlib <span class="kw">import</span> nullcontext

<span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
    is_last_micro = (step + <span class="num">1</span>) % accum_steps == <span class="num">0</span>
    sync_ctx = nullcontext() <span class="kw">if</span> is_last_micro <span class="kw">else</span> model.<span class="fn">no_sync</span>()
    <span class="kw">with</span> sync_ctx:
        <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
            loss = <span class="fn">loss_fn</span>(<span class="fn">model</span>(x), y) / accum_steps
        loss.<span class="fn">backward</span>()

    <span class="kw">if</span> is_last_micro:
        optimizer.<span class="fn">step</span>()
        optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)</code></pre></div>

<p class="l-text">FSDP does not currently expose an identical <code>no_sync</code>, but it has its own gradient-pre-divide and ReduceScatter scheduling, so naive accumulation is fine -- the overhead is much smaller than DDP's. The scale-by-1/K of the loss is essential in both cases; forget it and your effective learning rate is K times too large.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. 2026 Production: ZeRO-3, 3D Parallelism, Llama 3 Numbers</h2>

<p class="l-text">FSDP is PyTorch's native take on ZeRO. <strong>DeepSpeed</strong> is a separate Microsoft library that ships the original ZeRO implementation, plus ZeRO-Infinity (offload to NVMe) and a mature integration with HuggingFace via the <code>Trainer</code>. The big picture:</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">DeepSpeed ZeRO</div><div class="compare-item">ZeRO-1: shard optimizer states</div><div class="compare-item">ZeRO-2: shard grads + optim</div><div class="compare-item">ZeRO-3: shard params + grads + optim</div><div class="compare-item">ZeRO-Infinity: NVMe/CPU offload</div><div class="compare-item">Plug-in via HF Trainer or accelerate</div><div class="compare-item">Standalone library</div></div>
<div class="compare-col"><div class="compare-title">PyTorch FSDP</div><div class="compare-item">SHARD_GRAD_OP &equiv; ZeRO-2</div><div class="compare-item">FULL_SHARD &equiv; ZeRO-3</div><div class="compare-item">CPUOffload &equiv; ZeRO-Offload</div><div class="compare-item">No NVMe offload (yet)</div><div class="compare-item">Native to PyTorch</div><div class="compare-item">Tight integration with torch.compile</div></div>
</div>

<p class="l-text">For pure data-parallel + sharding workloads in 2026 either is fine; FSDP is the better default if you are starting fresh because it lives inside the framework. Reach for DeepSpeed if you need ZeRO-Infinity (massive NVMe offload) or if you are inheriting an existing config.</p>

<p class="l-text">For models above ~30B params, sharded DP alone is not enough -- you also need <strong>tensor parallelism</strong> (split each matmul) and <strong>pipeline parallelism</strong> (split layers down a pipeline). The combination is called <em>3D parallelism</em>. Megatron-LM was the first widely-used library to implement TP; today PyTorch ships <code>torch.distributed.tensor</code> for native TP and <code>torch.distributed.pipelining</code> for PP, and frameworks like <a href="https://github.com/pytorch/torchtitan">torchtitan</a> compose all three.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Llama 3 405B</div><div class="card-body">~16,000 H100s, several months of training, 15.6T tokens, 3.8e25 FLOPs total.</div></div>
<div class="calc-card"><div class="card-title">Parallelism mix</div><div class="card-body">TP=8 (intra-node, NVLink), PP=16 (across nodes), DP=128 (across pods). 8 &times; 16 &times; 128 = 16,384.</div></div>
<div class="calc-card"><div class="card-title">MFU target</div><div class="card-body">Model FLOPs Utilization ~40-45% on H100 -- means ~430 TFLOPs/GPU sustained out of 989 peak.</div></div>
<div class="calc-card"><div class="card-title">Checkpoint cadence</div><div class="card-body">Every ~few hours. Recovery from a node failure is the dominant tax on long runs.</div></div>
<div class="calc-card"><div class="card-title">Failure rate</div><div class="card-body">At 16k GPUs you lose nodes daily. Resilient checkpointing and elastic launch (torchrun --max_restarts) are mandatory.</div></div>
<div class="calc-card"><div class="card-title">For everyone else</div><div class="card-body">DDP up to ~7B params, FSDP up to ~70B on a single node; consider TP+PP only above that.</div></div>
</div>

<div id="plot-pyt13-speedup-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Strong-scaling speedup vs number of GPUs for the same total batch. The dashed grey line is the ideal linear speedup (1 GPU = 1x, 8 GPUs = 8x, etc). DataParallel (DP, blue) plateaus around 4-5x even on 8 GPUs because it serializes through GPU 0 and contends on the Python GIL. DistributedDataParallel (DDP, gold) tracks ideal closely up to 8 GPUs and only starts to drift past 32 GPUs as AllReduce bandwidth becomes the bottleneck. <strong>Why it matters:</strong> the gap between DP and DDP is roughly a 2x improvement on identical hardware -- one of the highest-ROI single-line code changes you can ever make.</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> The math: a 70B-param model needs ~6 &times; N &times; tokens FLOPs; one GPU is years, a cluster is days.<br><strong>2.</strong> Vocabulary: process group, rank, world size, NCCL backend; the AllReduce primitive sums gradients across ranks.<br><strong>3.</strong> <code>nn.DataParallel</code> is dead; <code>DistributedDataParallel</code> is the standard. One process per GPU.<br><strong>4.</strong> DDP overlaps gradient AllReduce with backward via gradient buckets; expect &gt;90% scaling efficiency up to ~64 GPUs.<br><strong>5.</strong> Launch with <code>torchrun</code>, shard the dataset with <code>DistributedSampler</code>, remember <code>sampler.set_epoch(epoch)</code>.<br><strong>6.</strong> FSDP shards parameters, gradients, and optimizer states across ranks for a 4-8x per-GPU memory drop -- the gateway to training above 7B.<br><strong>7.</strong> Wrap each transformer block as its own FSDP unit (<code>auto_wrap_policy</code>), choose FULL_SHARD for max memory savings, use <code>MixedPrecision(bf16, fp32_reduce)</code>.<br><strong>8.</strong> Mixed precision: bf16 by default on Ampere+, fp16 only with <code>GradScaler</code> on older hardware.<br><strong>9.</strong> Gradient accumulation = bigger effective batch on small GPUs; with DDP, use <code>model.no_sync()</code> on intermediate micro-steps to skip wasted AllReduces.<br><strong>10.</strong> Above ~30B params, add tensor + pipeline parallelism (3D parallelism). Llama 3 405B used TP=8 &times; PP=16 &times; DP=128 = 16,384 GPUs.</div></div>
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

  function memPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var xs = lang==='tr' ? ['DDP (her GPU)','FSDP (her GPU)'] : ['DDP (per GPU)','FSDP (per GPU)'];
    var params = [14, 14/8];
    var grads  = [14, 14/8];
    var optim  = [42, 42/8];
    var data = [
      {type:'bar', name: lang==='tr'?'Parametreler (bf16)':'Parameters (bf16)', x:xs, y:params, marker:{color:'#4ecdc4'}},
      {type:'bar', name: lang==='tr'?'Gradyanlar (bf16)':'Gradients (bf16)',   x:xs, y:grads,  marker:{color:'#a78bfa'}},
      {type:'bar', name: lang==='tr'?'Optimizer durumlari (fp32)':'Optimizer states (fp32)', x:xs, y:optim, marker:{color: T.accent}},
    ];
    var layout = Object.assign({}, common, {
      barmode:'stack',
      title:{text: lang==='tr'?'7B Model Bellek Dagilimi (GB / GPU, 8 GPU)':'7B Model Memory Breakdown (GB / GPU, 8 GPUs)', font:{color:T.text,size:14}},
      xaxis:{tickfont:{color:T.text}},
      yaxis:{title:lang==='tr'?'bellek (GB)':'memory (GB)', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}, orientation:'h', y:-0.18},
      height: 460
    });
    Plotly.newPlot(id, data, layout, {responsive:true, displayModeBar:false});
  }

  function speedupPlot(id, lang) {
    var el = document.getElementById(id);
    if (!el) return;
    var gpus  = [1,2,4,8,16,32,64];
    var ideal = gpus.slice();
    var ddp   = [1, 1.95, 3.82, 7.4, 14.1, 26.5, 47.8];
    var dp    = [1, 1.55, 2.6, 3.9, 4.5, 4.6, 4.4];
    var data = [
      {type:'scatter', mode:'lines', name: lang==='tr'?'ideal (lineer)':'ideal (linear)', x:gpus, y:ideal,
        line:{dash:'dash', color:'rgba(220,220,220,0.45)', width:2}},
      {type:'scatter', mode:'lines+markers', name:'DDP', x:gpus, y:ddp,
        line:{color: T.accent, width:3}, marker:{size:8, color: T.accent}},
      {type:'scatter', mode:'lines+markers', name: lang==='tr'?'DataParallel (eski)':'DataParallel (old)', x:gpus, y:dp,
        line:{color:'#7aa7ff', width:3}, marker:{size:8, color:'#7aa7ff'}},
    ];
    var layout = Object.assign({}, common, {
      title:{text: lang==='tr'?'Olcekleme: GPU Sayisina Karsi Hizlanma':'Scaling: Speedup vs Number of GPUs', font:{color:T.text,size:14}},
      xaxis:{title:lang==='tr'?'GPU sayisi':'number of GPUs', type:'log', tickvals:gpus, ticktext:gpus.map(String), tickfont:{color:T.text}, gridcolor:T.grid},
      yaxis:{title:lang==='tr'?'hizlanma (x)':'speedup (x)', gridcolor:T.grid, zerolinecolor:T.zero},
      legend:{font:{color:T.text}, orientation:'h', y:-0.18},
      height: 460
    });
    Plotly.newPlot(id, data, layout, {responsive:true, displayModeBar:false});
  }

  memPlot('plot-pyt13-mem-en','en');
  memPlot('plot-pyt13-mem-tr','tr');
  speedupPlot('plot-pyt13-speedup-en','en');
  speedupPlot('plot-pyt13-speedup-tr','tr');
}, 250);</script>`,

tr: `<p class="l-text"><strong>Tek bir GPU oyuncaktır. 2026'da gerçek eğitim dağıtıktır.</strong> Llama 3 70B yaklaşık 16.000 H100 GPU üzerinde aylarca eğitildi. Tek bir A100 aynı koşuyu yüz yılı aşkın sürede tamamlardı. "Laptop'umda MNIST eğitiyorum" ile "kümede 70 milyar parametreli bir transformer eğitiyorum" arasındaki köprü, PyTorch'ta öğrenebileceğin en yüksek kaldıraçlı şeylerden biridir -- ve birkaç ilkele indirgenir: süreç grupları, AllReduce, parçalanmış parametreler ve birkaç başlatıcı.</p>

<p class="l-text">Bu derste modern dağıtık yığının tamamını işliyoruz: <code>torch.distributed</code> ilkelleri, <code>DataParallel</code> neden öldü, <code>DistributedDataParallel</code> (DDP) gradyan senkronizasyonunu backward ile nasıl gerçekten örtüştürüyor ve <code>FullyShardedDataParallel</code> (FSDP) 70 milyar parametreli modelleri ucuz donanımda eğitebilmek için hesabı bellekle nasıl takas ediyor. Ayrıca karışık hassasiyet (autocast ve GradScaler ile fp16/bf16), gradyan birikimi ve sınır ölçeklerinde kullanılan 3B paralellik desenleri (DP + TP + PP) konuları da var.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Neden 70B'lik bir modelin dağıtık eğitime ihtiyacı var ve paralelliğin üç ekseni</li>
<li><code>torch.distributed</code> ilkelleri: süreç grupları, rütbeler, dünya boyutu, NCCL vs Gloo</li>
<li><code>DataParallel</code> neden modası geçti ve <code>DistributedDataParallel</code> farklı olarak ne yapıyor</li>
<li>Çoklu-GPU eğitimini <code>torchrun</code>, <code>DistributedSampler</code> ve DDP ile başlatmak</li>
<li>Bellek darboğazlı eğitim için FSDP: parçalanmış parametreler, gradyanlar ve optimizer durumları</li>
<li>Karışık hassasiyet (fp16 vs bf16), <code>GradScaler</code>, gradyan birikim püf noktaları</li>
<li>Üretim desenleri: ZeRO-3, 3B paralellik, Llama 3 gerçekte ne kullandı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Dağıtık? Modern Eğitimin Matematiği</h2>

<p class="l-text">Modern bir sınır modelin parametre sayısı yaklaşık 7 milyar ile 405 milyar arasındadır. Birini eğitmek için gereken hesap <em>petaflop-gün</em> cinsinden ölçülür: 15 trilyon token üzerinde 70B'lik bir model yaklaşık 6,3 &times; 10<sup>23</sup> kayan nokta işlemi gerektirir. Aşağıda bu dersteki her şeyi motive eden zarf-arkası hesap var.</p>

<div class="katex-block">$$\\\\text{FLOPs} \\\\approx 6 \\\\cdot N_{\\\\text{params}} \\\\cdot N_{\\\\text{tokens}}$$</div>

<p class="l-text">Bu transformer ön-eğitimi için bilinen ölçekleme kuralıdır (6 katsayısı ileri + geri + aktivasyonları kapsar). N=70B ve token=15T koyduğunda ~6,3e23 FLOP elde edersin. Bir A100 bf16'da yaklaşık 312 TFLOPS, H100 ise yaklaşık 989 TFLOPS sürdürür. Tek-GPU duvar süresi:</p>

<div class="katex-block">$$T_{\\\\text{single}} = \\\\frac{6.3 \\\\times 10^{23}}{989 \\\\times 10^{12}} \\\\;\\\\text{saniye} \\\\approx 6.4 \\\\times 10^{8}\\\\,\\\\text{s} \\\\approx 20\\\\,\\\\text{yil}$$</div>

<p class="l-text">Tek bir H100'de yirmi yıl bir araştırma takvimi değildir. İşi 16.000 H100'e yayıp ~%50 verimle çalıştırırsan kabaca 80 günlük duvar süresi elde edersin -- bu da Meta'nın açıkladığı Llama 3 rakamlarıyla örtüşür. Dağıtık eğitimin var olma nedeni tamamen budur. Bölünebileceğin üç eksen vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Veri Paralelliği (DP)</div><div class="card-body">Modeli her GPU'da çoğalt; batch'i böl. Her GPU kendi diliminde gradyan hesaplar, sonra herkes AllReduce ile ortalama alır. DDP ve FSDP burada yaşar.</div></div>
<div class="calc-card"><div class="card-title">Tensor Paralelliği (TP)</div><div class="card-body">Tek tek matris çarpımlarını GPU'lar arasında böl. Bir 16k&times;16k matmul, sekiz tane 16k&times;2k kısmi matmul olur. Megatron-LM tarzı. Yüksek bant genişliği şart.</div></div>
<div class="calc-card"><div class="card-title">Pipeline Paralelliği (PP)</div><div class="card-body">Modeli katman bazında GPU'lar arasında böl; aktivasyonları montaj hattı gibi aşağı doğru aktar. Mikro-batch'ler boşluğu (bubble) gizler.</div></div>
<div class="calc-card"><div class="card-title">3B Paralellik</div><div class="card-body">Üçünü birden birleştir. Llama 3 binlerce GPU'da eş zamanlı DP&times;TP&times;PP ızgaraları kullandı.</div></div>
<div class="calc-card"><div class="card-title">Parçalanmış DP (ZeRO / FSDP)</div><div class="card-body">DP'nin bir varyasyonu: optimizer durumlarını, gradyanları ve parametreleri DP rütbeleri arasında parçalayarak belleği geri kazanır.</div></div>
<div class="calc-card"><div class="card-title">Maliyet sürücüsü</div><div class="card-body">Hesap N&times;token ile ölçeklenir; bellek tek başına N ile. Hangi eksende ölçekleyeceğini seçmek bir sanattır.</div></div>
</div>

<p class="l-text">Takımların %90'ı için doğru cevap ~7B'ye kadar modeller için DDP, daha büyük her şey için FSDP'dir. Dersin geri kalanı ikisinin derinlemesine incelemesi ve destekleyici ilkellerdir.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. torch.distributed İlkelleri: Süreç Grubu, Rütbe, AllReduce</h2>

<p class="l-text">Herhangi bir wrapper'dan önce, bilmen gereken küçük bir sözlük var. <strong>Süreç grubu</strong> birbiriyle konuşabilen süreçlerin kümesi; <strong>rütbe (rank)</strong> her sürecin bu grup içindeki kimliği (0'dan world_size-1'e); <strong>dünya boyutu (world size)</strong> toplam sayı. <strong>Backend</strong> tel protokolüdür -- NVIDIA GPU'lar için NCCL (NVLink/InfiniBand kullanır), CPU için ve yedek olarak Gloo.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist

<span class="kw">def</span> <span class="fn">setup</span>():
    <span class="cm"># torchrun RANK, LOCAL_RANK, WORLD_SIZE, MASTER_ADDR, MASTER_PORT degiskenlerini ayarlar</span>
    dist.<span class="fn">init_process_group</span>(backend=<span class="str">"nccl"</span>)        <span class="cm"># CPU'da "gloo"</span>
    local_rank = <span class="fn">int</span>(os.environ[<span class="str">"LOCAL_RANK"</span>])
    torch.cuda.<span class="fn">set_device</span>(local_rank)
    <span class="kw">return</span> local_rank

<span class="kw">def</span> <span class="fn">cleanup</span>():
    dist.<span class="fn">destroy_process_group</span>()

<span class="cm"># setup() sonrasi programin herhangi bir yerinde:</span>
rank        = dist.<span class="fn">get_rank</span>()           <span class="cm"># 0..world_size-1</span>
world_size  = dist.<span class="fn">get_world_size</span>()     <span class="cm"># 8xH100 dugumu icin orn. 8</span>

<span class="cm"># Kolektif: AllReduce bir tensoru tum rutbeler arasinda toplar, herkes toplami gorur</span>
t = torch.<span class="fn">tensor</span>([<span class="fn">float</span>(rank)], device=<span class="str">"cuda"</span>)
dist.<span class="fn">all_reduce</span>(t, op=dist.ReduceOp.SUM)
<span class="cm"># world_size=4 ile her rutbede simdi t = 0+1+2+3 = 6</span>

<span class="cm"># Broadcast: rutbe 0 gonderir, digerleri alir</span>
config = torch.<span class="fn">tensor</span>([<span class="num">42</span>], device=<span class="str">"cuda"</span>) <span class="kw">if</span> rank == <span class="num">0</span> <span class="kw">else</span> torch.<span class="fn">zeros</span>(<span class="num">1</span>, device=<span class="str">"cuda"</span>)
dist.<span class="fn">broadcast</span>(config, src=<span class="num">0</span>)

<span class="cm"># Barrier: her rutbe bu satira ulasana kadar bloklar</span>
dist.<span class="fn">barrier</span>()

<span class="cm"># Faydali desen: yalnizca rutbe 0 loglar / checkpoint kaydeder</span>
<span class="kw">if</span> rank == <span class="num">0</span>:
    <span class="fn">print</span>(<span class="str">f"world_size={world_size}, NCCL backend hazir"</span>)</code></pre></div>

<p class="l-text">Backend'ler hakkında birkaç not. <strong>NCCL</strong> NVIDIA'nın Toplu İletişim Kütüphanesidir ve çoklu-GPU NVIDIA sistemlerinde gerçekçi tek seçimdir -- NVLink topolojilerini ve InfiniBand RDMA'yı anlar ve AllReduce'u teorik bağlantı bant genişliğinin %90'ından fazlasında yapabilir. <strong>Gloo</strong> CPU'da ve düz TCP üzerinde çalışır; dizüstüler, CI testleri ve yalnız-CPU kümeleri için yararlıdır. <strong>MPI</strong> desteklenir ama elinde zaten bir MPI kümesi yoksa doğru seçim olmaz.</p>

<div class="l-warn"><strong>Yaygın AllReduce hatası:</strong> bir kolektif çağrıyı <code>if rank == 0</code> bloğunun içine koymak. Her rütbe her kolektife aynı sırada katılmalıdır, aksi halde program kilitlenir. Koşullu iş gerekiyorsa, <code>dist.barrier()</code> kullanarak yalnız-rütbe-0 bloğunun <em>çevresini</em> senkronize et, içini değil.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. DataParallel (DP): Anti-Desen</h2>

<p class="l-text">PyTorch, "birden fazla GPU kullan" sorusuna tek satırlık cevap gibi görünen eski bir wrapper olan <code>nn.DataParallel</code> ile birlikte gelir. Bu bir tuzaktır. Her şeyi tek bir Python sürecinde çalıştırır, girdi batch'ini her GPU'ya dağıtır, çıktıları GPU 0'a geri toplar ve Python'un Global Interpreter Lock'u her iterasyonun önemli bir kısmını veri taşıma ve sıralı dispatch ile geçirmene neden olur.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">nn.DataParallel (DP)</div><div class="compare-item">Tek Python süreci</div><div class="compare-item">Master GPU (0) darboğaz olur</div><div class="compare-item">Her adımda scatter/gather</div><div class="compare-item">En iyi durumda ideal hızlanmanın ~%50-60'ı</div><div class="compare-item">GIL throughput'u zedeler</div><div class="compare-item">Durum: ruhen terk edildi</div></div>
<div class="compare-col"><div class="compare-title">DistributedDataParallel (DDP)</div><div class="compare-item">Her GPU için bir Python süreci</div><div class="compare-item">Master GPU yok</div><div class="compare-item">AllReduce yalnızca gradyanlarda</div><div class="compare-item">İdeal hızlanmanın ~%85-95'i</div><div class="compare-item">GIL çekişmesi yok</div><div class="compare-item">Durum: 2019'dan beri standart</div></div>
</div>

<p class="l-text">Zihinsel model: DP, dört fırından aynı anda pişirmeye çalışan tek bir aşçıdır; oraya buraya koşturur ve servis için tabakları 1 numaralı fırının önüne yığar. DDP ise her biri kendi mutfağında, aynı tarifi farklı malzemelerle pişiren dört aşçıdır; sonra baharatlarını eşitlemek için kısaca notlarını karşılaştırırlar. 2026'daki bir kod tabanında <code>nn.DataParallel</code> görürsen, ilk işin onu DDP'ye taşımak olmalı.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. DistributedDataParallel (DDP): Gerçekte Nasıl Çalışıyor</h2>

<p class="l-text">DDP, her GPU için bir Python sürecidir. Her süreç modelin tam bir kopyasını tutar, batch'in farklı bir dilimini görür, ileri ve geri pass'leri bağımsız çalıştırır ve <code>backward()</code> sırasında gradyan tensörleri AllReduce aracılığıyla rütbeler arasında toplanır. Geri pass'ten sonra her kopya aynı gradyanlara sahip olur, optimizer adımı da aynıdır ve kopyalar adım uyumunda kalır. Ne master GPU vardır, ne de aktivasyonların scatter/gather'ı.</p>

<div class="katex-block">$$g_{\\\\text{global}} = \\\\frac{1}{P} \\\\sum_{p=1}^{P} g_{p}, \\\\quad \\\\text{efektif batch} = B_{\\\\text{local}} \\\\cdot P$$</div>

<p class="l-text">Burada P dünya boyutudur. Akıllıca olan kısım: DDP, önceki katmanların gradyan AllReduce'unu sonraki katmanların geri pass'i ile örtüştürür. Gradyan kovaları, katmanları biten yere AllReduce çağrılarını ateşler, böylece iletişim hesabın arkasına gizlenir. Sağlıklı bir NVLink + InfiniBand kurulumunda ek yük genellikle adım süresinin %10'unun altında kalır ve ölçekleme verimliliği ~64 GPU'ya kadar %90'ın üzerindedir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist
<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP

<span class="cm"># 1) Surec grubunu baslat (torchrun tarafindan baslatildi)</span>
dist.<span class="fn">init_process_group</span>(backend=<span class="str">"nccl"</span>)
local_rank = <span class="fn">int</span>(os.environ[<span class="str">"LOCAL_RANK"</span>])
torch.cuda.<span class="fn">set_device</span>(local_rank)

<span class="cm"># 2) Modeli dogru GPU'da olustur</span>
model = <span class="fn">MyTransformer</span>().<span class="fn">to</span>(local_rank)

<span class="cm"># 3) DDP ile sarmala -- tek satir</span>
ddp_model = <span class="fn">DDP</span>(model, device_ids=[local_rank])

<span class="cm"># 4) ddp_model'i normal bir nn.Module gibi kullan</span>
optimizer = torch.optim.<span class="fn">AdamW</span>(ddp_model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
loss_fn   = nn.<span class="fn">CrossEntropyLoss</span>()

<span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
    x, y = x.<span class="fn">to</span>(local_rank), y.<span class="fn">to</span>(local_rank)
    logits = <span class="fn">ddp_model</span>(x)
    loss   = <span class="fn">loss_fn</span>(logits, y)

    optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)
    loss.<span class="fn">backward</span>()              <span class="cm"># &lt;-- gradyanlarin AllReduce'u burada, katman katman</span>
    optimizer.<span class="fn">step</span>()

<span class="cm"># Asagi yatan modulu .module araciligiyla aktiver (orn. kaydetmek icin)</span>
<span class="kw">if</span> dist.<span class="fn">get_rank</span>() == <span class="num">0</span>:
    torch.<span class="fn">save</span>(ddp_model.module.<span class="fn">state_dict</span>(), <span class="str">"ckpt.pt"</span>)

dist.<span class="fn">destroy_process_group</span>()</code></pre></div>

<p class="l-text">Aklında tutulmaya değer üç detay. Birincisi, sarmalayıcı tek satırdır: <code>DDP(model, device_ids=[local_rank])</code>. İkincisi, gradyan senkronizasyonu örtüktür -- <code>loss.backward()</code> içinde ateşlenir, elle hiçbir kolektif çağırmazsın. Üçüncüsü, gerçek modelinin Module olmayan niteliklerine erişmek için (örn. özel bir <code>generate()</code> metodu), <code>ddp_model.module</code> üzerinden uzan; DDP standart <code>forward</code> yolunu iletir ama keyfi nitelikleri proxy'lemez.</p>

<div class="l-warn"><strong>İki DDP tuzağı:</strong> (1) Her rütbe epoch başına aynı sayıda <code>backward()</code> pass'i yapmalıdır -- eşit olmayan batch sayıları takılmaya yol açar. <code>DistributedSampler</code> bunu halleder. (2) Modelinin parçaları her ileri pass'te <em>kullanılmıyorsa</em>, DDP onların gradyanlarını bekleyerek askıda kalır. DDP yapıcısına <code>find_unused_parameters=True</code> geç, ama bunun ek yük getirdiğini bil -- daha iyi çözüm ileri yolunu homojen yapmaktır.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Uçtan Uca DDP: torchrun + DistributedSampler</h2>

<p class="l-text">Gerçek bir DDP eğitim betiği, wrapper'ın ötesinde üç parçaya sahiptir: bir başlatıcı (<code>torchrun</code>), her rütbeye veri setinin ayrık bir dilimini veren bir örnekleyici (<code>DistributedSampler</code>) ve epoch'lar arasında karıştırma farklı olsun diye <code>sampler.set_epoch(epoch)</code> çağrısı yapılan bir eğitim döngüsü. İşte tam resim.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON -- train_ddp.py</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist
<span class="kw">from</span> torch.nn.parallel <span class="kw">import</span> DistributedDataParallel <span class="kw">as</span> DDP
<span class="kw">from</span> torch.utils.data <span class="kw">import</span> DataLoader, DistributedSampler, TensorDataset

<span class="kw">def</span> <span class="fn">main</span>():
    dist.<span class="fn">init_process_group</span>(backend=<span class="str">"nccl"</span>)
    local_rank = <span class="fn">int</span>(os.environ[<span class="str">"LOCAL_RANK"</span>])
    rank       = dist.<span class="fn">get_rank</span>()
    world_size = dist.<span class="fn">get_world_size</span>()
    torch.cuda.<span class="fn">set_device</span>(local_rank)
    device = torch.<span class="fn">device</span>(<span class="str">"cuda"</span>, local_rank)

    <span class="cm"># Sahte veri: 50k ornek, 128-token id, 10 sinif</span>
    X = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">30000</span>, (<span class="num">50000</span>, <span class="num">128</span>))
    y = torch.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">10</span>,    (<span class="num">50000</span>,))
    dataset = <span class="fn">TensorDataset</span>(X, y)

    <span class="cm"># DistributedSampler: her rutbe ayrik bir dilim gorur, ortusme yok</span>
    sampler = <span class="fn">DistributedSampler</span>(dataset, num_replicas=world_size,
                                 rank=rank, shuffle=<span class="kw">True</span>, drop_last=<span class="kw">True</span>)
    loader  = <span class="fn">DataLoader</span>(dataset, batch_size=<span class="num">32</span>, sampler=sampler,
                         num_workers=<span class="num">4</span>, pin_memory=<span class="kw">True</span>)

    <span class="kw">class</span> <span class="fn">Net</span>(nn.Module):
        <span class="kw">def</span> <span class="fn">__init__</span>(self):
            <span class="fn">super</span>().<span class="fn">__init__</span>()
            self.emb = nn.<span class="fn">Embedding</span>(<span class="num">30000</span>, <span class="num">256</span>)
            self.fc  = nn.<span class="fn">Linear</span>(<span class="num">256</span>, <span class="num">10</span>)
        <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
            <span class="kw">return</span> self.<span class="fn">fc</span>(self.<span class="fn">emb</span>(ids).<span class="fn">mean</span>(dim=<span class="num">1</span>))

    model = <span class="fn">Net</span>().<span class="fn">to</span>(device)
    model = <span class="fn">DDP</span>(model, device_ids=[local_rank])

    opt   = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
    loss_fn = nn.<span class="fn">CrossEntropyLoss</span>()

    <span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
        sampler.<span class="fn">set_epoch</span>(epoch)   <span class="cm"># onemli: her epoch farkli sirayla karistirsin</span>
        model.<span class="fn">train</span>()
        <span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
            x = x.<span class="fn">to</span>(device, non_blocking=<span class="kw">True</span>)
            y = y.<span class="fn">to</span>(device, non_blocking=<span class="kw">True</span>)
            opt.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)
            logits = <span class="fn">model</span>(x)
            loss   = <span class="fn">loss_fn</span>(logits, y)
            loss.<span class="fn">backward</span>()        <span class="cm"># ortuk gradyan AllReduce</span>
            opt.<span class="fn">step</span>()

            <span class="kw">if</span> rank == <span class="num">0</span> <span class="kw">and</span> step % <span class="num">50</span> == <span class="num">0</span>:
                <span class="fn">print</span>(<span class="str">f"epoch {epoch} step {step}  loss={loss.item():.4f}"</span>)

    <span class="kw">if</span> rank == <span class="num">0</span>:
        torch.<span class="fn">save</span>(model.module.<span class="fn">state_dict</span>(), <span class="str">"ddp_ckpt.pt"</span>)

    dist.<span class="fn">destroy_process_group</span>()

<span class="kw">if</span> __name__ == <span class="str">"__main__"</span>:
    <span class="fn">main</span>()</code></pre></div>

<p class="l-text"><code>torchrun</code> ile başlat. Bu eskiden <code>python -m torch.distributed.launch</code> idi; <code>torchrun</code> modern, daha basit giriş noktasıdır ve 2026'da kullanman gereken tek başlatıcıdır.</p>

<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Tek dugum, 8 GPU:</span>
torchrun --standalone --nproc_per_node=8 train_ddp.py

<span class="cm"># Iki dugum, her birinde 8 GPU (her dugumde calistir, $NODE_RANK = 0 ya da 1):</span>
torchrun \\
  --nnodes=2 --node_rank=$NODE_RANK \\
  --nproc_per_node=8 \\
  --rdzv_id=llama-run-42 --rdzv_backend=c10d \\
  --rdzv_endpoint=node0.cluster:29400 \\
  train_ddp.py</code></pre></div>

<p class="l-text">Betiği baştan sona okurken: init_process_group NCCL'i ayağa kaldırır; <code>DistributedSampler</code> veri setini parçalar, böylece tüm rütbelerin batch'lerinin birleşimi tek bir tam geçişe eşit olur; <code>set_epoch(epoch)</code> epoch'lar arasında yeniden karıştırır (bunu unutursan her epoch aynı sırayı görür); DDP-sarmalı model tıpkı normal bir Module gibi kullanılır; <code>loss.backward()</code> gradyan AllReduce'u ateşler; rütbe 0 alttaki <code>.module.state_dict()</code>'i kaydeder (DDP wrapper'ı değil, o iç durumu da pickle ederdi). İki düğümlü örnek <code>c10d</code> rendezvous'u kullanır: <code>--rdzv_endpoint</code> işçilerin birbirini bulmak için kullandığı host:port'tur.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. FSDP: Model Tek GPU'ya Sığmadığında</h2>

<p class="l-text">DDP her şeyi çoğaltır. 8 GPU'da <em>sekiz</em> parametre kopyası, sekiz gradyan kopyası ve sekiz optimizer durumu kopyası tutarsın. Adam, her parametre için iki moment tutar -- bu her fp32 ağırlık için 12 bayt, ya da her bf16 ağırlık için 6 bayt optimizer durumu demektir. Karışık hassasiyette bir 7B model parametreler için ~14 GB, gradyanlar için 14 GB ve Adam momentleri için 42 GB ister -- toplam 70 GB'ın biraz üstü, 80GB'lık bir A100'e ucu ucuna sığar ve aktivasyonlara yer kalmaz. Bir 13B model hiç sığmaz. 70B'lik bir model umutsuz vakadır.</p>

<p class="l-text">Fully Sharded Data Parallel (FSDP) cevaptır. Matematiksel olarak veri paralelliğine özdeştir ama her tensörün yalnızca <em>bir parçasını</em> her rütbede saklar. Bir katman hesap yapmak üzereyken FSDP, tam parametreyi GPU'da maddileştirmek için bir AllGather yayınlar; o katmanın geri pass'inden hemen sonra tam parametre atılır ve yalnız yerel parça kalır. Optimizer durumları ve gradyanlar kalıcı olarak parça halinde yaşar.</p>

<div class="katex-block">$$M_{\\\\text{DDP}} \\\\;=\\\\; P + G + O \\\\qquad M_{\\\\text{FSDP}} \\\\;\\\\approx\\\\; \\\\tfrac{1}{W}\\\\,(P + G + O)$$</div>

<p class="l-text">Burada P, G, O sırasıyla parametre, gradyan ve optimizer-durumu belleği; W ise dünya boyutudur. W=8 ile pratikte 4-8 kat bellek azalması elde edersin (tam 8x değil, iletişim tamponları ve geçici AllGather'lar yüzünden). Bu sihir DDP'nin 7B'de OOM olduğu yerde 70 milyar parametreli bir modeli 8 H100'lük bir düğümde eğitmeni sağlar.</p>

<div id="plot-pyt13-mem-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Karışık hassasiyette 7B parametreli bir transformer için GPU başına bellek dağılımı; tam çoğaltmalı DDP ile 8 GPU üzerinde FULL_SHARD'lı FSDP karşılaştırılıyor. Çubuklar parametreler (bf16), gradyanlar (bf16) ve optimizer durumlarına (fp32 Adam momentleri) bölünmüş. DDP her GPU'da 70 GB'lık tam yığını tutar; FSDP her bileşeni 8 rütbe arasında parçalayarak GPU başına kararlı durum belleğini yaklaşık 9 GB'ye + geçici AllGather tamponlarına düşürür. <strong>Neden önemli:</strong> serbest kalan bellek, daha büyük modeller, daha uzun diziler ya da daha büyük mikro-batch'ler için harcanır -- sınır modelleri eğitmeyi yürüten üç kol.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. FSDP API'si: auto_wrap_policy ve sharding_strategy</h2>

<p class="l-text">FSDP tek bir wrapper'dır ama birden çok düğmesi vardır. En önemli ikisi: <code>auto_wrap_policy</code> FSDP'ye hangi tanecik düzeyinde parçalayacağını söyler (her transformer bloğu ayrı ayrı mı, yoksa tüm modelden tek büyük parça mı?), <code>sharding_strategy</code> ise ne kadar agresif parçalayacağını söyler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FULL_SHARD (= ZeRO-3)</div><div class="card-body">Parametreleri, gradyanları ve optimizer durumlarını parçalar. Maksimum bellek tasarrufu. Büyük-model eğitimi için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">SHARD_GRAD_OP (= ZeRO-2)</div><div class="card-body">Gradyan ve optimizer durumlarını parçalar; parametreleri çoğaltır. Daha az iletişim, FULL_SHARD'tan daha fazla bellek.</div></div>
<div class="calc-card"><div class="card-title">NO_SHARD (= DDP)</div><div class="card-body">Her şeyi çoğaltır. DDP'ye eşdeğer. Benchmark veya minik modeller için faydalı.</div></div>
<div class="calc-card"><div class="card-title">HYBRID_SHARD</div><div class="card-body">Düğüm içinde FULL_SHARD, düğümler arası çoğalt. Daha az düğümler-arası trafik için belleği takas eder.</div></div>
<div class="calc-card"><div class="card-title">auto_wrap_policy</div><div class="card-body">Blok başına parçalama (örn. her transformer katmanı için bir wrap) FSDP'nin AllGather'ı hesapla örtüştürmesini sağlar. Performans için kritik.</div></div>
<div class="calc-card"><div class="card-title">CPU offload</div><div class="card-body">Optimizer durumlarını CPU RAM'e iter. PCIe trafiği pahasına daha da fazla GPU belleği kazandırır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> functools
<span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn
<span class="kw">import</span> torch.distributed <span class="kw">as</span> dist
<span class="kw">from</span> torch.distributed.fsdp <span class="kw">import</span> (
    FullyShardedDataParallel <span class="kw">as</span> FSDP,
    ShardingStrategy,
    MixedPrecision,
    CPUOffload,
)
<span class="kw">from</span> torch.distributed.fsdp.wrap <span class="kw">import</span> transformer_auto_wrap_policy

<span class="kw">class</span> <span class="fn">TransformerBlock</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, d=<span class="num">4096</span>, h=<span class="num">32</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.attn = nn.<span class="fn">MultiheadAttention</span>(d, h, batch_first=<span class="kw">True</span>)
        self.mlp  = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(d, <span class="num">4</span>*d), nn.<span class="fn">GELU</span>(), nn.<span class="fn">Linear</span>(<span class="num">4</span>*d, d))
        self.ln1  = nn.<span class="fn">LayerNorm</span>(d); self.ln2 = nn.<span class="fn">LayerNorm</span>(d)
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h, _ = self.<span class="fn">attn</span>(self.<span class="fn">ln1</span>(x), self.<span class="fn">ln1</span>(x), self.<span class="fn">ln1</span>(x))
        x = x + h
        x = x + self.<span class="fn">mlp</span>(self.<span class="fn">ln2</span>(x))
        <span class="kw">return</span> x

<span class="kw">class</span> <span class="fn">LlamaIsh</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, n_layers=<span class="num">32</span>, d=<span class="num">4096</span>, vocab=<span class="num">32000</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.emb    = nn.<span class="fn">Embedding</span>(vocab, d)
        self.blocks = nn.<span class="fn">ModuleList</span>([<span class="fn">TransformerBlock</span>(d) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_layers)])
        self.head   = nn.<span class="fn">Linear</span>(d, vocab, bias=<span class="kw">False</span>)
    <span class="kw">def</span> <span class="fn">forward</span>(self, ids):
        x = self.<span class="fn">emb</span>(ids)
        <span class="kw">for</span> blk <span class="kw">in</span> self.blocks:
            x = <span class="fn">blk</span>(x)
        <span class="kw">return</span> self.<span class="fn">head</span>(x)

<span class="cm"># Her TransformerBlock'u ayri bir FSDP birimi olarak sarmala -- ortusmeyi saglar</span>
wrap_policy = functools.<span class="fn">partial</span>(
    transformer_auto_wrap_policy,
    transformer_layer_cls={TransformerBlock},
)

<span class="cm"># bf16 hesap, fp32 indirgemeler -- Ampere+ uzerinde guvenli modern varsayilan</span>
mp = <span class="fn">MixedPrecision</span>(
    param_dtype=torch.bfloat16,
    reduce_dtype=torch.float32,
    buffer_dtype=torch.bfloat16,
)

model = <span class="fn">LlamaIsh</span>(n_layers=<span class="num">32</span>, d=<span class="num">4096</span>).<span class="fn">to</span>(torch.cuda.<span class="fn">current_device</span>())
fsdp_model = <span class="fn">FSDP</span>(
    model,
    auto_wrap_policy=wrap_policy,
    sharding_strategy=ShardingStrategy.FULL_SHARD,
    mixed_precision=mp,
    cpu_offload=<span class="fn">CPUOffload</span>(offload_params=<span class="kw">False</span>),  <span class="cm"># cok bellege siginirsa True</span>
    device_id=torch.cuda.<span class="fn">current_device</span>(),
)

optimizer = torch.optim.<span class="fn">AdamW</span>(fsdp_model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
<span class="cm"># Egitim dongusu buradan itibaren DDP ile aynidir.</span></code></pre></div>

<p class="l-text">Birkaç pratik nokta. <code>auto_wrap_policy</code> insanların fark ettiğinden daha çok önemlidir -- yalnız en dıştaki <code>LlamaIsh</code> modülünü sararsan, FSDP'nin tek dev bir parçası olur ve AllGather'ı hesapla örtüştüremez, dolayısıyla hızın çoğunu kaybedersin. Transformer bloğu başına sarmalama standardır. bf16 parametreli ve fp32 indirgemeli <code>MixedPrecision</code> en güvenli modern seçimdir; bunu bir sonraki bölümde detaylı işliyoruz. <code>CPUOffload</code> ek ~2x GPU belleği kazandırabilir ama PCIe trafiği ekler, bu yüzden ona ancak GPU belleği bağlayıcı kısıt olduğunda başvur.</p>

<div class="l-warn"><strong>FSDP checkpoint tuzağı:</strong> <code>fsdp_model.state_dict()</code>'i naif şekilde kaydettiğinde, her rütbe modelin tamamını değil kendi parçasını döker. Kaydetmeden önce rütbe 0'da tam parçalanmamış durumu toplamak için <code>FSDP.state_dict_type(model, StateDictType.FULL_STATE_DICT, ...)</code>'ı bir bağlam yöneticisi olarak kullan. Bunu unutmak, sonradan yükleyemeyeceğin checkpoint'lerle başbaşa bırakır.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Karışık Hassasiyet: fp16 vs bf16, autocast, GradScaler</h2>

<p class="l-text">Ağırlıkları 16-bit float'ta saklamak ve hesaplamak belleği kabaca yarıya indirir ve tensor-core throughput'unu kabaca ikiye katlar. PyTorch'un karışık-hassasiyet API'si bunu sana iki satırda verir. İki tane 16-bit format vardır ve çok farklı davranırlar.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">fp16 (half)</div><div class="compare-item">Aralık: ~6e-5 ile ~6,5e4</div><div class="compare-item">Hassasiyet: ~3 ondalık basamak</div><div class="compare-item">Dar aralık; gradyanlar kolayca alttan taşar</div><div class="compare-item">Geri pass'i atlatmak için <code>GradScaler</code> şart</div><div class="compare-item">Volta ve sonrasında çalışır</div></div>
<div class="compare-col"><div class="compare-title">bf16 (bfloat16)</div><div class="compare-item">Aralık: fp32 ile aynı (~1e-38 ile 3e38)</div><div class="compare-item">Hassasiyet: ~2 ondalık basamak</div><div class="compare-item">Geniş aralık; alttan taşma yok</div><div class="compare-item">GradScaler gerekmez</div><div class="compare-item">Ampere (A100) veya daha yenisi şart</div></div>
</div>

<p class="l-text">Doğru zihinsel model: fp16 mantis için daha çok bite sahiptir ama dar bir üs alanı vardır, yani sık sık üstten ve alttan taşar; bf16 fp32 ile aynı üsse ama daha az mantis bitine sahiptir, böylece daha az hassastır ama tipik eğitim-aralığı sayılarında asla taşmaz. 2026'da bir A100/H100 üzerinde bir eğitim koşusu için varsayılan bf16'dır. fp16'ya yalnız bf16 donanımı olmayan eski Volta/Turing GPU'larda başvur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">from</span> torch.cuda.amp <span class="kw">import</span> autocast, GradScaler

device = <span class="str">"cuda"</span>
model     = <span class="fn">MyModel</span>().<span class="fn">to</span>(device)
optimizer = torch.optim.<span class="fn">AdamW</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">3e-4</span>)
loss_fn   = torch.nn.<span class="fn">CrossEntropyLoss</span>()

<span class="cm"># --- 1) bf16: GradScaler gerekmez ---</span>
<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
    optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)
    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
        logits = <span class="fn">model</span>(x)
        loss   = <span class="fn">loss_fn</span>(logits, y)
    loss.<span class="fn">backward</span>()
    optimizer.<span class="fn">step</span>()

<span class="cm"># --- 2) fp16: gradyan alttan tasmasini onlemek icin GradScaler ile sarmala ---</span>
scaler = <span class="fn">GradScaler</span>()
<span class="kw">for</span> x, y <span class="kw">in</span> loader:
    x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
    optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)
    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.float16):
        logits = <span class="fn">model</span>(x)
        loss   = <span class="fn">loss_fn</span>(logits, y)
    <span class="cm"># scaler kayb? geri pass'ten once buyuk bir sabitle carpar,</span>
    <span class="cm"># boylece kucuk gradyanlar fp16'da hayatta kalir; optim.step()'ten once boler.</span>
    scaler.<span class="fn">scale</span>(loss).<span class="fn">backward</span>()
    scaler.<span class="fn">step</span>(optimizer)
    scaler.<span class="fn">update</span>()</code></pre></div>

<p class="l-text">Bunu dikkatlice okuyalım: <code>autocast</code> 16-bit çekirdeği olan op'ları (matmul, conv, attention) aşağı dönüştüren bir bağlam yöneticisidir; güvenlik açısından kritik op'ları ise fp32'de bırakır (LayerNorm, softmax indirgemeleri, kayıp). Sonuç fp16 ya da bf16 hesap ve optimizer içinde fp32 "master" ağırlık kopyasıdır -- standart karışık-hassasiyet tarifi. <code>GradScaler</code> yalnız fp16 için vardır: gradyan değerleri çoğu zaman 1e-7 ile 1e-5 aralığında yaşar, bu da fp16'da sıfıra alttan taşar. Scaler kaybı geri pass'ten önce ~2<sup>15</sup> ile çarpar, sonra optimizer adımından önce gradyanların ölçeklerini kaldırır. bf16 için gradyanlar daha geniş üs aralığına doğal olarak sığar, bu yüzden scaler gerekmez -- onu kullanmaya çalışmak hiçbir işe yaramaz.</p>

<p class="l-text">FSDP içinde <code>autocast</code>'i elle çağırmazsın -- 7. bölümde yaptığımız gibi bir <code>MixedPrecision</code> politikası iletirsin. FSDP dönüştürmeyi senin için parametre düzeyinde uygular ve politika gradyanların AllReduce'u için farklı bir dtype (tipik olarak fp32) belirtir, böylece birikim sayısal olarak güvenli olur.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Gradyan Birikimi: Daha Büyük Batch'i Taklit Etmek</h2>

<p class="l-text">Bazen istediğin adım başı batch (diyelim 1024), FSDP ve bf16 ile bile GPU belleğine sığmaz. Gradyan birikimi evrensel kaçış kapısıdır: K mini-adımı <code>backward()</code> ile çalıştırırsın ama <code>optimizer.step()</code> çağırmazsın, sonra bir kez adım atarsın. PyTorch varsayılan olarak gradyanları aynı <code>.grad</code> tamponlarında biriktirir, dolayısıyla matematik tam batch üzerinde tek bir adım atmaya özdeştir (her adımda BatchNorm istatistikleri hariç, o ayrı bir konu).</p>

<div class="katex-block">$$g_{\\\\text{eff}} \\\\;=\\\\; \\\\sum_{k=1}^{K} g_{k}, \\\\qquad B_{\\\\text{eff}} \\\\;=\\\\; K \\\\cdot B_{\\\\text{micro}} \\\\cdot W$$</div>

<p class="l-text">Mikro-batch B_micro, birikim K ve dünya boyutu W ile efektif batch K&middot;B_micro&middot;W olur. Sade versiyonu:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>accum_steps = <span class="num">8</span>
optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)

<span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
    x, y = x.<span class="fn">to</span>(device), y.<span class="fn">to</span>(device)
    <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
        logits = <span class="fn">model</span>(x)
        loss   = <span class="fn">loss_fn</span>(logits, y) / accum_steps   <span class="cm"># kaybi olcekle ki birikmis grad dogru buyuklukte olsun</span>
    loss.<span class="fn">backward</span>()                                    <span class="cm"># .grad'e biriktirir</span>

    <span class="kw">if</span> (step + <span class="num">1</span>) % accum_steps == <span class="num">0</span>:
        optimizer.<span class="fn">step</span>()
        optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)</code></pre></div>

<p class="l-text">Şimdi DDP ile gelen ince ayar: varsayılan olarak <code>backward()</code> bir AllReduce tetikler. K mikro-adım boyunca biriktirirsen, bir optimizer adımı için K AllReduce yaparsın -- savurgan, çünkü yalnız son birikmiş gradyan önemlidir. Çözüm <code>model.no_sync()</code>'tir; DDP'nin sunduğu, ara geri pass'lerde AllReduce'u devre dışı bırakan bir bağlam yöneticisi. Yalnız son mikro-adım senkronizasyonu yapar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> contextlib <span class="kw">import</span> nullcontext

<span class="kw">for</span> step, (x, y) <span class="kw">in</span> <span class="fn">enumerate</span>(loader):
    is_last_micro = (step + <span class="num">1</span>) % accum_steps == <span class="num">0</span>
    sync_ctx = nullcontext() <span class="kw">if</span> is_last_micro <span class="kw">else</span> model.<span class="fn">no_sync</span>()
    <span class="kw">with</span> sync_ctx:
        <span class="kw">with</span> <span class="fn">autocast</span>(dtype=torch.bfloat16):
            loss = <span class="fn">loss_fn</span>(<span class="fn">model</span>(x), y) / accum_steps
        loss.<span class="fn">backward</span>()

    <span class="kw">if</span> is_last_micro:
        optimizer.<span class="fn">step</span>()
        optimizer.<span class="fn">zero_grad</span>(set_to_none=<span class="kw">True</span>)</code></pre></div>

<p class="l-text">FSDP şu anda aynı <code>no_sync</code>'i sunmaz, ama kendi gradyan-ön-bölmesi ve ReduceScatter zamanlamasına sahiptir, dolayısıyla naif birikim sorun çıkarmaz -- ek yük DDP'ninkinden çok daha azdır. Kaybı 1/K ile ölçeklemek her iki durumda da elzemdir; unutursan efektif öğrenme oranın K kat fazla olur.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. 2026 Üretimi: ZeRO-3, 3B Paralellik, Llama 3 Sayıları</h2>

<p class="l-text">FSDP, PyTorch'un kendi ZeRO yorumudur. <strong>DeepSpeed</strong>, orijinal ZeRO uygulamasını taşıyan ayrı bir Microsoft kütüphanesidir; üstüne ZeRO-Infinity (NVMe'ye offload) ve HuggingFace ile olgun bir entegrasyon ekler (<code>Trainer</code> aracılığıyla). Büyük resim:</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">DeepSpeed ZeRO</div><div class="compare-item">ZeRO-1: optimizer durumlarını parçala</div><div class="compare-item">ZeRO-2: grad + optim parçala</div><div class="compare-item">ZeRO-3: param + grad + optim parçala</div><div class="compare-item">ZeRO-Infinity: NVMe/CPU offload</div><div class="compare-item">HF Trainer ya da accelerate üstünden eklenir</div><div class="compare-item">Bağımsız kütüphane</div></div>
<div class="compare-col"><div class="compare-title">PyTorch FSDP</div><div class="compare-item">SHARD_GRAD_OP &equiv; ZeRO-2</div><div class="compare-item">FULL_SHARD &equiv; ZeRO-3</div><div class="compare-item">CPUOffload &equiv; ZeRO-Offload</div><div class="compare-item">NVMe offload yok (henüz)</div><div class="compare-item">PyTorch'a yerleşik</div><div class="compare-item">torch.compile ile sıkı entegrasyon</div></div>
</div>

<p class="l-text">2026'da saf veri-paralel + parçalama iş yükleri için ikisi de iyidir; sıfırdan başlıyorsan FSDP daha iyi varsayılan, çünkü framework'ün içinde yaşar. Devasa NVMe offload (ZeRO-Infinity) gerekirse ya da var olan bir config'i devralıyorsan DeepSpeed'e uzan.</p>

<p class="l-text">~30B parametrenin üstündeki modeller için yalnız parçalanmış DP yetmez -- <strong>tensor paralelliği</strong> (her matmul'u böl) ve <strong>pipeline paralelliği</strong> (katmanları pipeline'a böl) de gerekir. Kombinasyona <em>3B paralellik</em> denir. Megatron-LM, TP'yi yaygın kullanılan ilk kütüphaneydi; bugün PyTorch yerel TP için <code>torch.distributed.tensor</code>'ı ve PP için <code>torch.distributed.pipelining</code>'i taşıyor; <a href="https://github.com/pytorch/torchtitan">torchtitan</a> gibi framework'ler üçünü birden bir araya getirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Llama 3 405B</div><div class="card-body">~16.000 H100, birkaç aylık eğitim, 15,6T token, toplam 3,8e25 FLOP.</div></div>
<div class="calc-card"><div class="card-title">Paralellik karışımı</div><div class="card-body">TP=8 (düğüm-içi, NVLink), PP=16 (düğümler arası), DP=128 (pod'lar arası). 8 &times; 16 &times; 128 = 16.384.</div></div>
<div class="calc-card"><div class="card-title">MFU hedefi</div><div class="card-body">H100'de Model FLOPs Kullanımı ~%40-45 -- 989 tepe noktasından sürdürülen ~430 TFLOP/GPU demek.</div></div>
<div class="calc-card"><div class="card-title">Checkpoint sıklığı</div><div class="card-body">Her birkaç saatte bir. Düğüm arızasından kurtarma uzun koşulardaki baskın vergidir.</div></div>
<div class="calc-card"><div class="card-title">Arıza oranı</div><div class="card-body">16.000 GPU'da her gün düğüm kaybedersin. Dayanıklı checkpoint'leme ve esnek başlatma (torchrun --max_restarts) zorunlu.</div></div>
<div class="calc-card"><div class="card-title">Diğer herkes için</div><div class="card-body">~7B parametreye kadar DDP, tek düğümde ~70B'ye kadar FSDP; sadece bunun üstünde TP+PP düşün.</div></div>
</div>

<div id="plot-pyt13-speedup-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne gösteriyor:</strong> Aynı toplam batch için GPU sayısına karşı güçlü-ölçekleme hızlanması. Kesikli gri çizgi ideal lineer hızlanmadır (1 GPU = 1x, 8 GPU = 8x, vs). DataParallel (DP, mavi) 8 GPU'da bile ~4-5x'te tıkanır çünkü GPU 0 üzerinden seri akış yapar ve Python GIL'iyle çekişir. DistributedDataParallel (DDP, altın) 8 GPU'ya kadar ideali sıkıca takip eder, ancak AllReduce bant genişliği darboğaz olmaya başladığında 32 GPU'dan sonra savrulur. <strong>Neden önemli:</strong> DP ile DDP arasındaki fark aynı donanımda yaklaşık 2 katlık bir iyileştirmedir -- yapabileceğin en yüksek-ROI'li tek satırlık kod değişikliklerinden biri.</div>

<div class="think-box"><div class="think-label">ANA NOKTALAR</div><div class="think-body"><strong>1.</strong> Matematik: 70B parametreli bir modelin ~6 &times; N &times; token FLOP'a ihtiyacı vardır; tek GPU yıllarca, küme günlerce sürer.<br><strong>2.</strong> Sözlük: süreç grubu, rütbe, dünya boyutu, NCCL backend; AllReduce ilkel gradyanları rütbeler arasında toplar.<br><strong>3.</strong> <code>nn.DataParallel</code> öldü; <code>DistributedDataParallel</code> standarttır. Her GPU için bir süreç.<br><strong>4.</strong> DDP, gradyan AllReduce'u gradyan kovaları aracılığıyla geri pass ile örtüştürür; ~64 GPU'ya kadar %90'ın üzerinde ölçekleme verimliliği bekle.<br><strong>5.</strong> <code>torchrun</code> ile başlat, veri setini <code>DistributedSampler</code> ile parçala, <code>sampler.set_epoch(epoch)</code>'u unutma.<br><strong>6.</strong> FSDP parametreleri, gradyanları ve optimizer durumlarını rütbeler arasında parçalar; GPU başına 4-8x bellek düşüşü için -- 7B'nin üstüne çıkmanın kapısı.<br><strong>7.</strong> Her transformer bloğunu kendi FSDP birimi olarak sarmala (<code>auto_wrap_policy</code>), maksimum bellek tasarrufu için FULL_SHARD seç, <code>MixedPrecision(bf16, fp32_reduce)</code> kullan.<br><strong>8.</strong> Karışık hassasiyet: Ampere+ üzerinde varsayılan bf16, eski donanımda yalnız <code>GradScaler</code> ile fp16.<br><strong>9.</strong> Gradyan birikimi = küçük GPU'da daha büyük efektif batch; DDP ile ara mikro-adımlarda boşa giden AllReduce'ları atlamak için <code>model.no_sync()</code> kullan.<br><strong>10.</strong> ~30B parametrenin üstünde tensor + pipeline paralelliği ekle (3B paralellik). Llama 3 405B, TP=8 &times; PP=16 &times; DP=128 = 16.384 GPU kullandı.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  // Grafikler EN bloguyla birlikte tek scriptte cizilir.
}, 250);</script>`

};
