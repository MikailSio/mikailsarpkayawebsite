window.GPU_L7 = {
en: `<p class="l-text"><strong>One GPU trains a 7B model. Eight GPUs train a 70B model. A thousand GPUs train a 405B Llama. The math from one to many is not "just put it on more cards" — it is a layered hierarchy of parallelism strategies, each with its own communication primitive, its own memory tradeoff, and its own failure mode.</strong> This lesson walks the four parallelism strategies that, in combination, train every frontier LLM since GPT-3: <em>data parallelism</em> (replicate the model, split the batch), <em>fully-sharded data parallelism / ZeRO-3</em> (split the optimizer states + grads + params across data ranks), <em>tensor parallelism</em> (split a single matmul across GPUs), and <em>pipeline parallelism</em> (different layers on different GPUs). On top of all of them sits NCCL, NVIDIA's collective communication library, and its single most important algorithm: <em>ring all-reduce</em>.</p>

<p class="l-text">We trace the evolution: PyTorch's <code>DataParallel</code> (deprecated, single-process), then <code>DistributedDataParallel</code> (DDP, multi-process, the default since 2019), then DeepSpeed ZeRO (Rajbhandari 2020) and PyTorch's native FSDP (2022) which together made trillion-parameter training feasible on commodity 80GB GPUs. Tensor and pipeline parallelism (Megatron-LM, Shoeybi 2019; GPipe, Huang 2019) handle the cases where a single layer or the model itself does not fit. The Pyodide demos simulate gradient accumulation across "fake" workers so you can see the all-reduce algorithm at the level of NumPy arrays.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish DDP, FSDP, tensor parallelism, and pipeline parallelism by what they shard</li>
<li>Read the ring all-reduce algorithm and explain why it is bandwidth-optimal</li>
<li>Compute memory requirements for ZeRO-1, ZeRO-2, ZeRO-3 across N GPUs</li>
<li>Pick a parallelism mix (3D parallelism) for a given model size and cluster</li>
<li>Identify the role of NCCL, InfiniBand, and NVLink in real distributed training</li>
<li>Diagnose communication-bound training and apply gradient accumulation / overlap tricks</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Memory Math — Why You Cannot Just Throw GPUs At It</h2>
<p class="l-text">Training a model with P parameters in mixed precision (BF16 weights + FP32 optimizer states) costs roughly: 2P bytes for weights, 2P for gradients, 4P for FP32 master weights, 4P for Adam first moment, 4P for Adam second moment — total <strong>~16P bytes</strong>. For a 70B model that is 1.1 TB of state. An H100 has 80 GB. You need at least 14 H100s' worth of memory just to hold the state — never mind activations, KV-cache, etc.</p>

<div class="katex-block">$$\\text{memory}_{\\text{train}} \\;\\approx\\; 16P \\text{ bytes (Adam, BF16)} \\;+\\; \\text{activations} \\;+\\; \\text{buffers}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">7B model</div><div class="card-body">~112 GB state. Fits on a single 80GB H100 only with offload (CPU/NVMe). Comfortable on 2 H100 with FSDP or DDP+grad-ckpt.</div></div>
<div class="calc-card"><div class="card-title">70B model</div><div class="card-body">~1.1 TB state. Needs 16+ H100. FSDP (ZeRO-3) is the default. Tensor parallel needed if a single matmul does not fit.</div></div>
<div class="calc-card"><div class="card-title">405B model</div><div class="card-body">~6.5 TB state. Llama 3.1 405B trained on 16k H100 with 4D parallelism: TP=8, PP=16, FSDP=8, DP=16.</div></div>
<div class="calc-card"><div class="card-title">1T+ model</div><div class="card-body">~16 TB state. Frontier-lab scale. 100k+ GPUs with full hierarchical parallelism + activation checkpointing + selective recompute.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. DataParallel vs DistributedDataParallel</h2>
<p class="l-text">The simplest distributed strategy: replicate the model on each GPU, give each GPU a slice of the batch, run forward+backward, then average gradients across GPUs before the optimizer step. Mathematically, training with 8 GPUs and batch B is equivalent to training one GPU with batch 8B (modulo numerics).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DataParallel (deprecated)</div><div class="card-body">Single Python process, one thread per GPU. GIL contention; gradients gathered to GPU 0 then scattered. Use only for quick demos.</div></div>
<div class="calc-card"><div class="card-title">DistributedDataParallel (DDP)</div><div class="card-body">One Python process per GPU, no GIL contention. Gradients all-reduced across processes via NCCL. Standard since 2019. ~95% efficient on NVLink-connected nodes.</div></div>
<div class="calc-card"><div class="card-title">Launcher</div><div class="card-body"><code>torchrun --nproc_per_node=8 train.py</code> — spawns 8 processes, each with its own GPU and rank. Use <code>RANK</code>, <code>LOCAL_RANK</code>, <code>WORLD_SIZE</code> env vars.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — needs torch.distributed + multi-GPU)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># minimal DDP training loop
import os, torch
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

dist.init_process_group(backend="nccl")
local_rank = int(os.environ["LOCAL_RANK"])
torch.cuda.set_device(local_rank)

model = MyModel().to(local_rank)
ddp_model = DDP(model, device_ids=[local_rank])
optim = torch.optim.AdamW(ddp_model.parameters(), lr=3e-4)

for batch in loader:
    batch = {k: v.to(local_rank) for k, v in batch.items()}
    loss = ddp_model(**batch).loss
    loss.backward()                         # ← all-reduce of grads happens here
    optim.step(); optim.zero_grad()
dist.destroy_process_group()
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>dist.init_process_group(backend="nccl")</code> opens NCCL communicators across all ranks — each process discovers its peers via the rendezvous file or TCP store seeded by <code>torchrun</code>. 2) <code>LOCAL_RANK</code> picks the GPU index inside the node so <code>cuda.set_device</code> pins this process to one GPU (avoids cross-PID contention on device 0). 3) <code>DDP(model, device_ids=[local_rank])</code> registers backward hooks that bucket parameter gradients and fire ring-all-reduces in the background as soon as a bucket is ready. 4) <code>loss.backward()</code> triggers those hooks; by the time <code>optim.step()</code> runs, every rank holds the same averaged gradient and updates weights identically — so replicas stay byte-identical across iterations.</p>

<p class="l-text">DDP's magic: as soon as a parameter's gradient is computed in the backward pass, DDP fires off an asynchronous all-reduce in the background. By the time the next batch starts, all gradients are averaged. With NVLink between GPUs, the communication is fully overlapped with compute — DDP is essentially free for medium-sized models.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Ring All-Reduce — The Heart of NCCL</h2>
<p class="l-text">An all-reduce takes one tensor per worker and replaces it on every worker with the sum (or mean) of all of them. Naive implementation: every worker sends to every other worker, O(N²) traffic. Ring all-reduce (Patarasuk &amp; Yuan 2009, popularized by Baidu in 2017) does it in O(N) with optimal bandwidth utilization.</p>

<p class="l-text">Algorithm: arrange the N GPUs in a logical ring. Split each tensor into N chunks. <strong>Reduce-scatter phase</strong>: in N-1 steps, each GPU sends one chunk to its right neighbor and adds the received chunk; after N-1 steps, each GPU holds the full sum of one chunk. <strong>All-gather phase</strong>: another N-1 steps of forwarding, after which every GPU has the full sum of every chunk. Total bytes per GPU: ~2(N-1)/N × tensor_size — independent of how N grows, only twice the data size.</p>

<div class="katex-block">$$\\text{traffic}_{\\text{ring all-reduce}} \\;\\approx\\; 2 \\, \\frac{N-1}{N} \\cdot S \\;\\to\\; 2S \\text{ as } N \\to \\infty$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — ring all-reduce simulated across N "fake" workers</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N = 4              # 4 fake workers
size = 1_000_000
# each "GPU" has its own tensor (different random values)
tensors = [np.random.randn(size).astype(np.float32) for _ in range(N)]
target  = sum(tensors)         # the answer all-reduce should produce on every GPU

# split each tensor into N chunks
chunks = [np.array_split(t, N) for t in tensors]   # chunks[gpu][chunk_idx]

# ----- reduce-scatter (N-1 steps) -----
# In step k, GPU i sends chunk index (i - k) mod N to GPU (i+1) mod N,
# which adds it into its own chunk at the same index.
for step in range(N - 1):
    new_chunks = [list(c) for c in chunks]
    for i in range(N):
        send_idx = (i - step) % N
        recv_idx = send_idx
        nxt = (i + 1) % N
        new_chunks[nxt][recv_idx] = chunks[nxt][recv_idx] + chunks[i][send_idx]
    chunks = new_chunks

# After reduce-scatter, GPU i holds full sum at chunk index (i + 1) mod N
# ----- all-gather (N-1 steps) -----
for step in range(N - 1):
    new_chunks = [list(c) for c in chunks]
    for i in range(N):
        send_idx = (i + 1 - step) % N
        nxt = (i + 1) % N
        new_chunks[nxt][send_idx] = chunks[i][send_idx]   # forward as-is
    chunks = new_chunks

# Reassemble each GPU's tensor and compare to target
results = [np.concatenate(chunks[i]) for i in range(N)]
for i in range(N):
    err = np.max(np.abs(results[i] - target))
    print(f"GPU {i} max err vs target: {err:.2e}")
print(f"\\nTotal bytes per GPU (ring): ~{2*(N-1)/N * size * 4 / 1e6:.2f} MB")
print(f"Naive all-to-all would send: ~{(N-1) * size * 4 / 1e6:.2f} MB per GPU (worse for large N).")
</code></pre></div>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds N=4 distinct 1M-float tensors — one per "fake" GPU — and computes the ground-truth sum so we can verify correctness at the end. 2) Splits each tensor with <code>np.array_split(t, N)</code> into N chunks; ring-all-reduce works on chunks, not whole tensors, which is exactly why bandwidth scales to ~2S. 3) The reduce-scatter loop runs N-1 = 3 steps where rank <em>i</em> sends chunk <code>(i-step) mod N</code> to rank <code>(i+1) mod N</code> which adds it locally — after this phase every rank owns the full sum of exactly one chunk. 4) The all-gather loop runs another N-1 steps forwarding each rank's owned chunk around the ring, so the final <code>np.concatenate</code> on each rank reconstructs the complete summed tensor with max-error ~0 versus <code>target</code>; the printout confirms per-GPU traffic is ~2(N-1)/N·S = 1.5S bytes, less than the naive (N-1)S.</p>

<p class="l-text">NCCL implements this and a tree variant (better for small messages) automatically. PyTorch's <code>dist.all_reduce(tensor)</code> calls NCCL under the hood. On NVLink (900 GB/s on H100 SXM), an all-reduce on a 1 GB gradient takes ~2.5 ms — essentially free if overlapped with the next forward pass.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ZeRO Stages — DeepSpeed's Memory Magic</h2>
<p class="l-text">DDP replicates the entire model and Adam state on every GPU — wasteful, since each GPU only needs a slice for its forward/backward. DeepSpeed's ZeRO (Zero Redundancy Optimizer, Rajbhandari 2020) shards the redundant state across data-parallel ranks. Three stages, increasing aggressiveness.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ZeRO-1: optimizer states sharded</div><div class="card-body">Adam's m, v, master weights split across N GPUs. Memory drops from 16P to (4P + 12P/N). Same comm cost as DDP.</div></div>
<div class="calc-card"><div class="card-title">ZeRO-2: + gradients sharded</div><div class="card-body">Gradients also sharded. Memory: (2P + 14P/N). Backward all-reduce becomes reduce-scatter (same total bytes).</div></div>
<div class="calc-card"><div class="card-title">ZeRO-3 / FSDP: + parameters sharded</div><div class="card-body">Even the parameters are sharded. Each GPU only holds 1/N of the full model. All-gathers params before each forward, frees them after. Memory: 16P/N. Extra communication, but enables training models far larger than one GPU.</div></div>
</div>

<div class="katex-block">$$\\text{memory}_{\\text{ZeRO-3}} \\approx \\frac{16P}{N} + \\text{activations} + \\text{2 layers' params (in flight)}$$</div>

<p class="l-text">PyTorch reimplemented ZeRO-3 natively as <strong>FSDP</strong> (Fully Sharded Data Parallel) in 2022, and FSDP became the default for PyTorch's distributed training in 2023–2024. It interoperates with TP/PP and is the standard for 70B+ models. DeepSpeed remains popular for ZeRO-Infinity (offload to NVMe) and large-batch training.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — FSDP)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy
import functools

wrap_policy = functools.partial(
    transformer_auto_wrap_policy,
    transformer_layer_cls={LlamaDecoderLayer},   # one shard unit per transformer block
)
model = FSDP(model, auto_wrap_policy=wrap_policy, mixed_precision=True)
# Now each GPU only holds 1/world_size of every parameter at rest;
# FSDP all-gathers each layer's params just-in-time during forward and re-shards after.
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports PyTorch's native FSDP and the <code>transformer_auto_wrap_policy</code> helper that decides which sub-modules become their own shard unit. 2) <code>functools.partial</code> binds <code>transformer_layer_cls={LlamaDecoderLayer}</code> so every Llama decoder block becomes one FSDP unit — this is the ZeRO-3 granularity that controls memory vs all-gather frequency tradeoff. 3) <code>FSDP(model, auto_wrap_policy=..., mixed_precision=True)</code> replaces each Llama block with a sharded wrapper that splits its params/grads/optimizer state across <code>world_size</code> ranks and casts compute to BF16 while keeping FP32 master weights. 4) At runtime each forward dynamically all-gathers a block's params just before its matmul and frees them right after — so peak per-GPU memory is roughly <code>16P/N + activations + (largest 2 blocks in-flight)</code> instead of the full 16P of DDP.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tensor Parallelism — Splitting a Single Matmul</h2>
<p class="l-text">DDP/FSDP shards across the <em>batch</em> or across the <em>parameter list</em>. Tensor parallelism shards a <em>single</em> matmul. Useful when even one layer's weights do not fit on one GPU (think a 14k × 14k attention projection in a 405B model). Megatron-LM (Shoeybi et al., NVIDIA 2019) introduced the canonical splits for transformer blocks.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Column parallel</div><div class="card-body">Split the weight matrix W along the output (column) dimension across N GPUs. Each GPU computes its slice of the output. The next layer must combine. Used for the QKV projection in attention.</div></div>
<div class="calc-card"><div class="card-title">Row parallel</div><div class="card-body">Split along the input (row) dimension. Each GPU computes a partial output; an all-reduce sums them. Used for the output projection in attention and the down-projection in MLP.</div></div>
<div class="calc-card"><div class="card-title">Communication cost</div><div class="card-body">2 all-reduces per transformer block per forward+backward. Expensive — TP only worth it within a node (NVLink, 900 GB/s); across nodes (InfiniBand, 50 GB/s) it kills throughput.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Tensor-parallel matmul: y = x @ W, with W split column-wise across 4 "GPUs"
N_GPU = 4
B, In, Out = 32, 1024, 4096
x = np.random.randn(B, In).astype(np.float32)
W = np.random.randn(In, Out).astype(np.float32)

# Each GPU holds a column slice of W
W_shards = np.array_split(W, N_GPU, axis=1)
# Each GPU computes its partial output independently (no comm yet)
y_shards = [x @ Wi for Wi in W_shards]
# All-gather the column slices to get the full output
y_tp = np.concatenate(y_shards, axis=1)

print("max err vs full matmul:", np.max(np.abs(y_tp - x @ W)))
print(f"per-GPU weight memory: {W_shards[0].nbytes/1e6:.1f} MB (vs full {W.nbytes/1e6:.1f} MB)")
print(f"comm at end: all-gather of {y_tp.nbytes/1e6:.1f} MB across {N_GPU} GPUs")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up a 1024→4096 projection (typical attention QKV shape) with batch B=32 — the canonical "column parallel" matmul from Megatron-LM. 2) <code>np.array_split(W, N_GPU, axis=1)</code> shards the output columns across 4 fake GPUs so each rank owns a 1024×1024 slice instead of the full 1024×4096 — that is the memory win for TP. 3) Each rank independently computes <code>x @ W_shard</code> with zero communication during the matmul itself — the heavy FLOPs are perfectly local. 4) The final <code>np.concatenate(axis=1)</code> stands in for the NCCL all-gather that stitches the column outputs back together; the error vs the unsharded <code>x @ W</code> is exactly zero (no reduction order issues, unlike row-parallel which needs an all-reduce sum), and the printout shows per-GPU weight memory is 1/N of the full matrix.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pipeline Parallelism — Different Layers, Different GPUs</h2>
<p class="l-text">Even with TP across 8 GPUs in a node, a 405B model needs more memory than one node holds. Pipeline parallelism splits the model by <em>layer</em> across nodes: GPUs 0–7 hold layers 0–10, GPUs 8–15 hold layers 11–20, etc. The forward pass flows through the pipeline; the backward flows in reverse.</p>

<p class="l-text">Naive pipeline has a "bubble" — early stages idle while late stages finish, late stages idle while early stages start the next batch. GPipe (Huang 2019) and PipeDream (Narayanan 2019) reduce the bubble by splitting each batch into <em>micro-batches</em> and interleaving them. Bubble fraction = (P-1)/(M+P-1) with P pipeline stages and M micro-batches — set M much larger than P to make the bubble negligible.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GPipe scheduling</div><div class="card-body">All micro-batches go forward, then all go backward. Simple but stores activations for all micro-batches. Memory-heavy.</div></div>
<div class="calc-card"><div class="card-title">1F1B (PipeDream)</div><div class="card-body">Alternate one forward, one backward as soon as each is ready. Memory: O(P) activations, much less. The default in modern frameworks.</div></div>
<div class="calc-card"><div class="card-title">Communication</div><div class="card-body">Point-to-point sends between adjacent stages. Cheaper than TP — only sends the activation between layers, not full weights. Works fine over InfiniBand.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. 3D Parallelism — Combining All Three</h2>
<p class="l-text">Frontier-scale training composes all three: TP across the GPUs in a node (NVLink), PP across nodes within a "rack" (high-bandwidth IB), DP/FSDP across racks. Megatron-LM and DeepSpeed both support this 3D mix. Llama 3 405B used TP=8, PP=16, FSDP=8 — total parallelism factor 1024 across 16k H100s.</p>

<div class="katex-block">$$\\text{total GPUs} \\;=\\; \\text{DP} \\times \\text{PP} \\times \\text{TP}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TP — within node</div><div class="card-body">Use NVLink (900 GB/s). 4–8 way TP. Splits big matmuls.</div></div>
<div class="calc-card"><div class="card-title">PP — across racks</div><div class="card-body">Use InfiniBand (50 GB/s). 8–32 way PP. Splits layers. Activation-only comm.</div></div>
<div class="calc-card"><div class="card-title">DP/FSDP — across pods</div><div class="card-body">All-reduce or reduce-scatter on grads. 16–1000 way DP. Splits batches.</div></div>
<div class="calc-card"><div class="card-title">EP — for MoE models</div><div class="card-body">Expert parallelism: route tokens to the GPU holding the expert they need. Adds an all-to-all per layer. Mixtral, GPT-4, Gemini 1.5 use this.</div></div>
</div>

<div class="calc-highlight"><strong>Rule of thumb:</strong> set TP = GPUs per node (8 for HGX). Set PP = number of layers / 8 if model exceeds 1 node. Set DP = remaining factor. For most 70B trainings on 16 H100s: TP=4, PP=2, FSDP=2, DP=1 — 4×2×2 = 16. For 405B on 16k: TP=8, PP=16, FSDP×DP=128.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gradient Accumulation Across Fake Workers</h2>
<p class="l-text">Even on one GPU, you can simulate larger effective batch by running multiple forward+backward passes and accumulating gradients before the optimizer step. This is mathematically identical to N-way DDP with the per-GPU batch reduced by N, except no communication happens. Useful when you want a large batch and your hardware budget is tight.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — gradient accumulation simulating DDP across 4 fake workers</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Tiny linear model: y = w * x + b  (regression on 1024 points)
N = 1024
np.random.seed(0)
X = np.random.randn(N).astype(np.float32)
y_true = 2.5 * X + 0.7 + 0.1 * np.random.randn(N).astype(np.float32)

w, b = 0.0, 0.0
lr = 0.05
N_WORKERS = 4
batches = np.array_split(np.arange(N), N_WORKERS)   # one batch per fake worker

for epoch in range(20):
    grad_w_acc, grad_b_acc = 0.0, 0.0
    # Each "worker" computes its local gradient
    for worker_idx in range(N_WORKERS):
        idx = batches[worker_idx]
        pred = w * X[idx] + b
        err  = pred - y_true[idx]
        # local gradients
        grad_w_acc += (2 * err * X[idx]).mean()
        grad_b_acc += (2 * err).mean()
    # all-reduce: average across workers
    grad_w = grad_w_acc / N_WORKERS
    grad_b = grad_b_acc / N_WORKERS
    # synchronous step — every worker updates with the same averaged grad
    w -= lr * grad_w
    b -= lr * grad_b
    if epoch % 5 == 0:
        loss = ((w * X + b - y_true) ** 2).mean()
        print(f"epoch {epoch:2d}: w={w:.3f}, b={b:.3f}, loss={loss:.4f}")

print(f"\\nFinal: w={w:.3f} (target 2.5), b={b:.3f} (target 0.7)")
print(f"This loop is exactly what DDP does — only the all-reduce is real and uses NCCL.")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates synthetic regression data <code>y = 2.5x + 0.7 + noise</code> and partitions the 1024 samples into 4 disjoint shards with <code>np.array_split</code> — one per fake worker, exactly how <code>DistributedSampler</code> assigns rank-local mini-batches. 2) Each worker computes its <em>local</em> MSE gradients <code>(2*err*X[idx]).mean()</code> and <code>(2*err).mean()</code> on its shard only — this is the same per-rank forward+backward as torch.distributed. 3) Dividing <code>grad_w_acc</code> and <code>grad_b_acc</code> by <code>N_WORKERS</code> is the mathematical equivalent of NCCL ring-all-reduce with <code>op=AVG</code>; replacing this division with a real <code>dist.all_reduce(tensor, op=ReduceOp.AVG)</code> turns the script into genuine multi-GPU DDP. 4) The synchronous SGD step <code>w -= lr*grad_w; b -= lr*grad_b</code> happens identically on every worker so replicas stay numerically aligned — the final printout converges to <code>w≈2.5, b≈0.7</code>, confirming the gradient-averaging math is correct.</p>

<p class="l-text">Real DDP is identical conceptually. The only difference: each "worker" is a separate process on a separate GPU, the all-reduce is a real NCCL ring-all-reduce over NVLink/IB, and the gradient computations happen in parallel rather than sequentially. The math is the same to within FP precision.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Common Failure Modes and Diagnostics</h2>
<p class="l-text">Distributed training fails in spectacular ways. The most common failure modes:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Loss diverges on N GPUs but trains fine on 1</div><div class="card-body">Effective batch size scaled by N. Either reduce LR proportionally, use linear LR scaling rule (Goyal 2017) with warmup, or use LARS/LAMB optimizers for very large batches.</div></div>
<div class="calc-card"><div class="card-title">Hangs at the end of an epoch</div><div class="card-body">One worker has fewer batches than others. Use <code>DistributedSampler(drop_last=True)</code> or pad to equal length. Without this, ranks block on a never-arriving all-reduce.</div></div>
<div class="calc-card"><div class="card-title">Slow training / NCCL timeouts</div><div class="card-body">Communication-bound. Check that NVLink is up (<code>nvidia-smi nvlink -s</code>), that you are not doing all-reduce across pods over slow Ethernet, that gradient bucketing is enabled (DDP default), that mixed precision is on.</div></div>
<div class="calc-card"><div class="card-title">OOM on rank 0 only</div><div class="card-body">Common with naïve checkpoint saving (gathers all params to rank 0). Use FSDP's <code>FULL_STATE_DICT</code> with <code>offload_to_cpu=True</code> or sharded checkpointing.</div></div>
<div class="calc-card"><div class="card-title">Nondeterminism between runs</div><div class="card-body">Reduction order in NCCL is not deterministic by default. Set <code>NCCL_ALGO=Tree</code>, <code>torch.use_deterministic_algorithms(True)</code>, fixed seeds — costs ~5% throughput.</div></div>
<div class="calc-card"><div class="card-title">Stuck collective on dead GPU</div><div class="card-body">If one rank dies mid-train, the others wait forever. Use <code>NCCL_BLOCKING_WAIT=1</code> + <code>TORCH_NCCL_ASYNC_ERROR_HANDLING=1</code> to surface as Python exceptions.</div></div>
</div>

<p class="l-text">Tools that help: <code>nvidia-smi nvlink -gt</code> (per-link bandwidth counters), <code>nccl-tests</code> (offline benchmark of all-reduce), <code>torch.profiler</code> + Chrome trace (see what waits and what computes), <code>nsys</code> (kernel-level timeline including NCCL traffic). Lesson 8 closes the track by combining FlashAttention + FSDP-style sharding into a real production inference server using vLLM.</p>
</div>`,
tr: `<p class="l-text"><strong>Bir GPU 7B model eğitir. Sekiz GPU 70B model eğitir. Bin GPU 405B Llama eğitir. Bir kaynaktan birçoğuna giden matematik "sadece daha çok karta koy" değildir; her biri kendi iletişim ilkeli, kendi bellek takası ve kendi hata modu olan katmanlı bir paralelizm stratejisi hiyerarşisidir.</strong> Bu ders, kombinasyon halinde GPT-3'ten beri her sınır LLM'ini eğiten dört paralelizm stratejisini yürüyor: <em>data parallelism</em> (modeli kopyala, batch'i böl), <em>fully-sharded data parallelism / ZeRO-3</em> (optimizer state'lerini + grad'leri + parametreleri data rank'ları arasında böl), <em>tensor paralelizmi</em> (tek bir matmul'u GPU'lar arasında böl) ve <em>pipeline paralelizmi</em> (farklı katmanları farklı GPU'larda). Bunların üzerinde NCCL, NVIDIA'nın collective communication kütüphanesi ve onun en önemli tek algoritması: <em>ring all-reduce</em> oturuyor.</p>

<p class="l-text">Evrimi izliyoruz: PyTorch'un <code>DataParallel</code>'i (deprecated, tek-süreç), sonra <code>DistributedDataParallel</code> (DDP, çok-süreç, 2019'dan beri varsayılan), sonra DeepSpeed ZeRO (Rajbhandari 2020) ve PyTorch'un yerel FSDP'si (2022) — bu ikisi commodity 80GB GPU'larda trilyon-parametre eğitimini fizibil hale getirdi. Tensor ve pipeline paralelizmi (Megatron-LM, Shoeybi 2019; GPipe, Huang 2019) tek bir katmanın veya modelin kendisinin sığmadığı durumları ele alır. Pyodide demoları, "sahte" worker'lar arasında gradient birikimini simüle eder, böylece all-reduce algoritmasını NumPy dizileri seviyesinde görebilirsiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>DDP, FSDP, tensor paralelizmi ve pipeline paralelizmini ne shard ettiklerine göre ayırt et</li>
<li>Ring all-reduce algoritmasını oku ve neden bandwidth-optimal olduğunu açıkla</li>
<li>N GPU'da ZeRO-1, ZeRO-2, ZeRO-3 için bellek gereksinimlerini hesapla</li>
<li>Verilen bir model boyutu ve cluster için paralelizm karışımı (3D parallelism) seç</li>
<li>Gerçek dağıtık eğitimde NCCL, InfiniBand ve NVLink'in rolünü tanımla</li>
<li>İletişim-bound eğitimi teşhis et ve gradient birikimi / overlap hilelerini uygula</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Bellek Matematiği — Neden Sadece GPU Atamazsınız</h2>
<p class="l-text">Karma hassasiyetli (BF16 ağırlıkları + FP32 optimizer state'leri) P parametreli bir modeli eğitmek kabaca: ağırlıklar için 2P byte, gradientler için 2P, FP32 master ağırlıklar için 4P, Adam birinci momenti için 4P, Adam ikinci momenti için 4P — toplam <strong>~16P byte</strong>. 70B model için bu 1.1 TB durum demektir. Bir H100'in 80 GB'i vardır. Sadece durumu tutmak için en az 14 H100 değerinde belleğe ihtiyacınız var — aktivasyonlar, KV-cache vb. bir yana.</p>

<div class="katex-block">$$\\text{memory}_{\\text{train}} \\;\\approx\\; 16P \\text{ bytes (Adam, BF16)} \\;+\\; \\text{activations} \\;+\\; \\text{buffers}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">7B model</div><div class="card-body">~112 GB durum. Tek bir 80GB H100'e sadece offload (CPU/NVMe) ile sığar. FSDP veya DDP+grad-ckpt ile 2 H100'de rahat.</div></div>
<div class="calc-card"><div class="card-title">70B model</div><div class="card-body">~1.1 TB durum. 16+ H100 gerekir. FSDP (ZeRO-3) varsayılandır. Tek bir matmul sığmazsa tensor parallel gerekir.</div></div>
<div class="calc-card"><div class="card-title">405B model</div><div class="card-body">~6.5 TB durum. Llama 3.1 405B 16k H100'de 4D paralelizm ile eğitildi: TP=8, PP=16, FSDP=8, DP=16.</div></div>
<div class="calc-card"><div class="card-title">1T+ model</div><div class="card-body">~16 TB durum. Sınır-laboratuvar ölçeği. 100k+ GPU tam hiyerarşik paralelizm + activation checkpointing + selective recompute ile.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. DataParallel vs DistributedDataParallel</h2>
<p class="l-text">En basit dağıtık strateji: modeli her GPU'da kopyala, her GPU'ya batch'in bir dilimini ver, forward+backward çalıştır, sonra optimizer adımından önce gradientleri GPU'lar arasında ortala. Matematiksel olarak, 8 GPU ve batch B ile eğitim, batch 8B ile bir GPU eğitimine eşdeğerdir (numerik modulo).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DataParallel (deprecated)</div><div class="card-body">Tek Python süreci, GPU başına bir thread. GIL çekişmesi; gradientler GPU 0'a toplandı sonra dağıtıldı. Yalnızca hızlı demolar için kullan.</div></div>
<div class="calc-card"><div class="card-title">DistributedDataParallel (DDP)</div><div class="card-body">GPU başına bir Python süreci, GIL çekişmesi yok. Gradientler NCCL aracılığıyla süreçler arasında all-reduce edilir. 2019'dan beri standart. NVLink-bağlı node'larda ~%95 verimli.</div></div>
<div class="calc-card"><div class="card-title">Launcher</div><div class="card-body"><code>torchrun --nproc_per_node=8 train.py</code> — her biri kendi GPU'su ve rank'i olan 8 süreç oluşturur. <code>RANK</code>, <code>LOCAL_RANK</code>, <code>WORLD_SIZE</code> env var'larını kullan.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — torch.distributed + multi-GPU gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># minimal DDP training loop
import os, torch
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP

dist.init_process_group(backend="nccl")
local_rank = int(os.environ["LOCAL_RANK"])
torch.cuda.set_device(local_rank)

model = MyModel().to(local_rank)
ddp_model = DDP(model, device_ids=[local_rank])
optim = torch.optim.AdamW(ddp_model.parameters(), lr=3e-4)

for batch in loader:
    batch = {k: v.to(local_rank) for k, v in batch.items()}
    loss = ddp_model(**batch).loss
    loss.backward()                         # ← all-reduce of grads happens here
    optim.step(); optim.zero_grad()
dist.destroy_process_group()
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>dist.init_process_group(backend="nccl")</code> tüm rank'lar arasında NCCL communicator'larını açar — her süreç peer'larını <code>torchrun</code> tarafından kurulan rendezvous dosyası veya TCP store üzerinden bulur. 2) <code>LOCAL_RANK</code> node içindeki GPU indeksini seçer, böylece <code>cuda.set_device</code> bu süreci tek bir GPU'ya sabitler (cihaz 0 üzerinde PID çakışmalarını önler). 3) <code>DDP(model, device_ids=[local_rank])</code> parametre gradient'lerini bucket'layan ve bir bucket hazır olur olmaz arka planda ring-all-reduce tetikleyen backward hook'ları kaydeder. 4) <code>loss.backward()</code> bu hook'ları ateşler; <code>optim.step()</code> çalıştığı anda her rank aynı ortalanmış gradient'i tutar ve ağırlıkları özdeş şekilde günceller — böylece replica'lar iterasyonlar boyunca byte-eş kalır.</p>

<p class="l-text">DDP'nin sihri: backward pass'te bir parametrenin gradient'i hesaplanır hesaplanmaz, DDP arka planda asenkron bir all-reduce başlatır. Bir sonraki batch başlarken, tüm gradientler ortalanmıştır. GPU'lar arasında NVLink ile, iletişim hesaplama ile tamamen üzeri örtülür — DDP orta-boyutlu modeller için esas olarak bedavadır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Ring All-Reduce — NCCL'nin Kalbi</h2>
<p class="l-text">Bir all-reduce her worker'da bir tensor alır ve her worker'da hepsinin toplamı (veya ortalaması) ile değiştirir. Naif uygulama: her worker her diğer worker'a gönderir, O(N²) trafik. Ring all-reduce (Patarasuk &amp; Yuan 2009, 2017'de Baidu tarafından popülerleştirildi) bunu O(N)'de optimal bant genişliği kullanımı ile yapar.</p>

<p class="l-text">Algoritma: N GPU'yu mantıksal bir halkaya yerleştirin. Her tensor'u N parçaya bölün. <strong>Reduce-scatter fazı</strong>: N-1 adımda, her GPU sağ komşusuna bir parça gönderir ve aldığı parçayı ekler; N-1 adımdan sonra, her GPU bir parçanın tam toplamını tutar. <strong>All-gather fazı</strong>: başka N-1 forwarding adımı, sonra her GPU her parçanın tam toplamına sahip olur. GPU başına toplam byte: ~2(N-1)/N × tensor_size — N nasıl büyürse büyüsün bağımsız, sadece veri boyutunun iki katı.</p>

<div class="katex-block">$$\\text{traffic}_{\\text{ring all-reduce}} \\;\\approx\\; 2 \\, \\frac{N-1}{N} \\cdot S \\;\\to\\; 2S \\text{ as } N \\to \\infty$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — N "sahte" worker üzerinde simüle edilen ring all-reduce</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N = 4              # 4 fake workers
size = 1_000_000
# each "GPU" has its own tensor (different random values)
tensors = [np.random.randn(size).astype(np.float32) for _ in range(N)]
target  = sum(tensors)         # the answer all-reduce should produce on every GPU

# split each tensor into N chunks
chunks = [np.array_split(t, N) for t in tensors]   # chunks[gpu][chunk_idx]

# ----- reduce-scatter (N-1 steps) -----
# In step k, GPU i sends chunk index (i - k) mod N to GPU (i+1) mod N,
# which adds it into its own chunk at the same index.
for step in range(N - 1):
    new_chunks = [list(c) for c in chunks]
    for i in range(N):
        send_idx = (i - step) % N
        recv_idx = send_idx
        nxt = (i + 1) % N
        new_chunks[nxt][recv_idx] = chunks[nxt][recv_idx] + chunks[i][send_idx]
    chunks = new_chunks

# After reduce-scatter, GPU i holds full sum at chunk index (i + 1) mod N
# ----- all-gather (N-1 steps) -----
for step in range(N - 1):
    new_chunks = [list(c) for c in chunks]
    for i in range(N):
        send_idx = (i + 1 - step) % N
        nxt = (i + 1) % N
        new_chunks[nxt][send_idx] = chunks[i][send_idx]   # forward as-is
    chunks = new_chunks

# Reassemble each GPU's tensor and compare to target
results = [np.concatenate(chunks[i]) for i in range(N)]
for i in range(N):
    err = np.max(np.abs(results[i] - target))
    print(f"GPU {i} max err vs target: {err:.2e}")
print(f"\\nTotal bytes per GPU (ring): ~{2*(N-1)/N * size * 4 / 1e6:.2f} MB")
print(f"Naive all-to-all would send: ~{(N-1) * size * 4 / 1e6:.2f} MB per GPU (worse for large N).")
</code></pre></div>
</div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) N=4 farklı 1M-float tensor oluşturur — sahte GPU başına bir tane — ve sonunda doğruluğu doğrulayabilmek için gerçek toplamı hesaplar. 2) <code>np.array_split(t, N)</code> ile her tensor'u N parçaya böler; ring-all-reduce tüm tensor üzerinde değil parçalar üzerinde çalışır — bandwidth'in ~2S'e ölçeklenmesinin sebebi tam olarak budur. 3) Reduce-scatter döngüsü N-1 = 3 adım çalışır: rank <em>i</em> chunk <code>(i-step) mod N</code>'i rank <code>(i+1) mod N</code>'e gönderir, o da yerel olarak ekler — bu fazdan sonra her rank tam olarak bir chunk'in tam toplamına sahip olur. 4) All-gather döngüsü N-1 adım daha çalışarak her rank'in sahip olduğu chunk'i halka boyunca iletir, böylece her rank'teki son <code>np.concatenate</code> tam toplanmış tensor'u <code>target</code>'a göre max-hata ~0 ile yeniden oluşturur; çıktı GPU başına trafiğin ~2(N-1)/N·S = 1.5S byte olduğunu doğrular — naif (N-1)S'den az.</p>

<p class="l-text">NCCL bunu ve bir tree varyantını (küçük mesajlar için daha iyi) otomatik olarak uygular. PyTorch'un <code>dist.all_reduce(tensor)</code>'i alttan NCCL çağırır. NVLink üzerinde (H100 SXM'de 900 GB/s), 1 GB gradient üzerindeki bir all-reduce ~2.5 ms sürer — bir sonraki forward geçişi ile üzeri örtüldüğünde esas olarak bedava.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ZeRO Aşamaları — DeepSpeed'in Bellek Sihri</h2>
<p class="l-text">DDP tüm modeli ve Adam durumunu her GPU'da kopyalar — israflıdır, çünkü her GPU forward/backward'i için yalnızca bir dilime ihtiyaç duyar. DeepSpeed'in ZeRO'su (Zero Redundancy Optimizer, Rajbhandari 2020) gereksiz durumu data-parallel rank'ları arasında parçalar. Üç aşama, artan agresiflik.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ZeRO-1: optimizer durumları shard'li</div><div class="card-body">Adam'ın m, v, master ağırlıkları N GPU arasında bölüştürülür. Bellek 16P'den (4P + 12P/N)'ye düşer. DDP ile aynı iletişim maliyeti.</div></div>
<div class="calc-card"><div class="card-title">ZeRO-2: + gradient'ler shard'li</div><div class="card-body">Gradient'ler de shard'li. Bellek: (2P + 14P/N). Backward all-reduce reduce-scatter olur (aynı toplam byte).</div></div>
<div class="calc-card"><div class="card-title">ZeRO-3 / FSDP: + parametreler shard'li</div><div class="card-body">Hatta parametreler bile shard'li. Her GPU sadece tam modelin 1/N'ini tutar. Her forward'dan önce param'ları all-gather eder, sonra serbest bırakır. Bellek: 16P/N. Ekstra iletişim, ancak tek bir GPU'dan çok daha büyük modelleri eğitmeyi mümkün kılar.</div></div>
</div>

<div class="katex-block">$$\\text{memory}_{\\text{ZeRO-3}} \\approx \\frac{16P}{N} + \\text{activations} + \\text{2 layers' params (in flight)}$$</div>

<p class="l-text">PyTorch ZeRO-3'ü 2022'de yerel olarak <strong>FSDP</strong> (Fully Sharded Data Parallel) olarak yeniden uyguladı ve FSDP 2023-2024'te PyTorch'un dağıtık eğitimi için varsayılan oldu. TP/PP ile ortak çalışır ve 70B+ modeller için standarttır. DeepSpeed ZeRO-Infinity (NVMe'ye offload) ve büyük-batch eğitimi için popüler kalmaya devam ediyor.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — FSDP)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy
import functools

wrap_policy = functools.partial(
    transformer_auto_wrap_policy,
    transformer_layer_cls={LlamaDecoderLayer},   # one shard unit per transformer block
)
model = FSDP(model, auto_wrap_policy=wrap_policy, mixed_precision=True)
# Now each GPU only holds 1/world_size of every parameter at rest;
# FSDP all-gathers each layer's params just-in-time during forward and re-shards after.
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) PyTorch'un yerel FSDP'sini ve hangi alt-modüllerin kendi shard birimi olacağına karar veren <code>transformer_auto_wrap_policy</code> yardımcısını import eder. 2) <code>functools.partial</code> <code>transformer_layer_cls={LlamaDecoderLayer}</code>'ı bağlar, böylece her Llama decoder bloğu tek bir FSDP birimi olur — bu, bellek vs all-gather frekansı takasını kontrol eden ZeRO-3 taneciliğidir. 3) <code>FSDP(model, auto_wrap_policy=..., mixed_precision=True)</code> her Llama bloğunu, param/grad/optimizer state'lerini <code>world_size</code> rank arasında bölen ve FP32 master ağırlıkları korurken hesabı BF16'ya cast eden shard'lı bir sarmalayıcı ile değiştirir. 4) Çalışma zamanında her forward, bir bloğun matmul'undan hemen önce param'larını dinamik olarak all-gather eder ve hemen sonra serbest bırakır — böylece GPU başına tepe bellek DDP'nin tam 16P'si yerine kabaca <code>16P/N + aktivasyonlar + (uçuştaki en büyük 2 blok)</code> olur.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tensor Paralelizmi — Tek Bir Matmul'u Bölme</h2>
<p class="l-text">DDP/FSDP <em>batch</em> boyunca veya <em>parametre listesi</em> boyunca shard yapar. Tensor paralelizmi <em>tek bir</em> matmul'u shard yapar. Bir katmanın ağırlıkları bile bir GPU'ya sığmadığında kullanışlıdır (405B modelde 14k × 14k attention projeksiyonunu düşünün). Megatron-LM (Shoeybi ve diğ., NVIDIA 2019) transformer blokları için kanonik bölmeleri tanıttı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Column parallel</div><div class="card-body">Ağırlık matrisi W'yi çıktı (sütun) boyutu boyunca N GPU arasında böl. Her GPU çıktının dilimini hesaplar. Bir sonraki katman birleştirmek zorundadır. Attention'daki QKV projeksiyonu için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Row parallel</div><div class="card-body">Girdi (satır) boyutu boyunca böl. Her GPU kısmi bir çıktı hesaplar; bir all-reduce onları toplar. Attention'daki çıktı projeksiyonu ve MLP'deki down-projeksiyon için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">İletişim maliyeti</div><div class="card-body">Forward+backward başına transformer blok başına 2 all-reduce. Pahalı — TP yalnızca bir node içinde (NVLink, 900 GB/s) değerli; node'lar arasında (InfiniBand, 50 GB/s) throughput'u öldürür.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Tensor-parallel matmul: y = x @ W, with W split column-wise across 4 "GPUs"
N_GPU = 4
B, In, Out = 32, 1024, 4096
x = np.random.randn(B, In).astype(np.float32)
W = np.random.randn(In, Out).astype(np.float32)

# Each GPU holds a column slice of W
W_shards = np.array_split(W, N_GPU, axis=1)
# Each GPU computes its partial output independently (no comm yet)
y_shards = [x @ Wi for Wi in W_shards]
# All-gather the column slices to get the full output
y_tp = np.concatenate(y_shards, axis=1)

print("max err vs full matmul:", np.max(np.abs(y_tp - x @ W)))
print(f"per-GPU weight memory: {W_shards[0].nbytes/1e6:.1f} MB (vs full {W.nbytes/1e6:.1f} MB)")
print(f"comm at end: all-gather of {y_tp.nbytes/1e6:.1f} MB across {N_GPU} GPUs")
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 1024→4096 projeksiyonu (tipik attention QKV şekli) batch B=32 ile kurar — Megatron-LM'den kanonik "column parallel" matmul. 2) <code>np.array_split(W, N_GPU, axis=1)</code> çıktı sütunlarını 4 sahte GPU arasında shard'lar, böylece her rank tam 1024×4096 yerine 1024×1024 dilim sahibi olur — TP'nin bellek kazancı budur. 3) Her rank matmul sırasında sıfır iletişimle <code>x @ W_shard</code>'i bağımsız hesaplar — ağır FLOP'lar tamamen yereldir. 4) Son <code>np.concatenate(axis=1)</code> sütun çıktılarını birleştiren NCCL all-gather'i temsil eder; shard'sız <code>x @ W</code>'ye karşı hata tam olarak sıfırdır (all-reduce toplam gerektiren row-parallel'in aksine, reduction sırası sorunu yoktur) ve çıktı GPU başına ağırlık belleğinin tam matrisin 1/N'i olduğunu gösterir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pipeline Paralelizmi — Farklı Katmanlar, Farklı GPU'lar</h2>
<p class="l-text">Bir node'daki 8 GPU arasında TP olsa bile, bir 405B model bir node'un tutabileceği bellekten daha fazlasını gerektirir. Pipeline paralelizmi modeli node'lar arasında <em>katmana</em> göre böler: GPU'lar 0-7 katmanlar 0-10'u, GPU'lar 8-15 katmanlar 11-20'yi vb. tutar. Forward geçişi pipeline boyunca akar; backward ters yönde akar.</p>

<p class="l-text">Naif pipeline'in bir "kabarcığı" vardır — geç aşamalar bitirirken erken aşamalar boş durur, erken aşamalar bir sonraki batch'i başlatırken geç aşamalar boş durur. GPipe (Huang 2019) ve PipeDream (Narayanan 2019) her batch'i <em>mikro-batch'lere</em> bölerek ve onları iç içe geçirerek kabarcığı azaltır. Kabarcık oranı = (P-1)/(M+P-1), P pipeline aşaması ve M mikro-batch ile — kabarcığı önemsiz hale getirmek için M'yi P'den çok daha büyük ayarlayın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">GPipe planlama</div><div class="card-body">Tüm mikro-batch'ler ileri gider, sonra hepsi geri gider. Basit ama tüm mikro-batch'ler için aktivasyonları saklar. Bellek-ağır.</div></div>
<div class="calc-card"><div class="card-title">1F1B (PipeDream)</div><div class="card-body">Her ikisi de hazır olduğu anda bir ileri, bir geri arasında geçiş yap. Bellek: O(P) aktivasyon, çok daha az. Modern framework'lerde varsayılan.</div></div>
<div class="calc-card"><div class="card-title">İletişim</div><div class="card-body">Bitişik aşamalar arasında noktadan noktaya gönderiler. TP'den ucuz — yalnızca katmanlar arası aktivasyonu gönderir, tam ağırlıkları değil. InfiniBand üzerinden iyi çalışır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. 3D Paralelizm — Üçü Birden Birleştirme</h2>
<p class="l-text">Sınır-ölçekli eğitim üçünü birden besteler: bir node'daki GPU'lar arasında TP (NVLink), bir "rack" içindeki node'lar arasında PP (yüksek-bant genişliği IB), rack'ler arasında DP/FSDP. Megatron-LM ve DeepSpeed her ikisi de bu 3D karışımı destekler. Llama 3 405B TP=8, PP=16, FSDP=8 kullandı — toplam paralelizm faktörü 16k H100'de 1024.</p>

<div class="katex-block">$$\\text{total GPUs} \\;=\\; \\text{DP} \\times \\text{PP} \\times \\text{TP}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TP — node içi</div><div class="card-body">NVLink (900 GB/s) kullan. 4-8 yollu TP. Büyük matmul'ları böler.</div></div>
<div class="calc-card"><div class="card-title">PP — rack'ler arası</div><div class="card-body">InfiniBand (50 GB/s) kullan. 8-32 yollu PP. Katmanları böler. Sadece-aktivasyon iletişimi.</div></div>
<div class="calc-card"><div class="card-title">DP/FSDP — pod'lar arası</div><div class="card-body">Grad'ler üzerinde all-reduce veya reduce-scatter. 16-1000 yollu DP. Batch'leri böler.</div></div>
<div class="calc-card"><div class="card-title">EP — MoE modelleri için</div><div class="card-body">Expert paralelizmi: token'ları ihtiyaç duydukları uzmanı tutan GPU'ya yönlendir. Katman başına bir all-to-all ekler. Mixtral, GPT-4, Gemini 1.5 bunu kullanır.</div></div>
</div>

<div class="calc-highlight"><strong>Pratik kural:</strong> TP = node başına GPU (HGX için 8) ayarla. Model 1 node'u aşıyorsa PP = katman sayısı / 8 ayarla. DP = kalan faktör. 16 H100'de çoğu 70B eğitim için: TP=4, PP=2, FSDP=2, DP=1 — 4×2×2 = 16. 16k'da 405B için: TP=8, PP=16, FSDP×DP=128.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Sahte Worker'lar Arasında Gradient Birikimi</h2>
<p class="l-text">Tek bir GPU'da bile, optimizer adımından önce birden çok forward+backward geçişi çalıştırıp gradientleri biriktirerek daha büyük etkili batch'i simüle edebilirsiniz. Bu, GPU başına batch N ile azaltılmış N-yollu DDP'ye matematiksel olarak özdeş — yalnızca iletişim olmaz. Büyük bir batch istediğinizde ve donanım bütçeniz dar olduğunda kullanışlıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — 4 sahte worker üzerinde DDP simüle eden gradient birikimi</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Tiny linear model: y = w * x + b  (regression on 1024 points)
N = 1024
np.random.seed(0)
X = np.random.randn(N).astype(np.float32)
y_true = 2.5 * X + 0.7 + 0.1 * np.random.randn(N).astype(np.float32)

w, b = 0.0, 0.0
lr = 0.05
N_WORKERS = 4
batches = np.array_split(np.arange(N), N_WORKERS)   # one batch per fake worker

for epoch in range(20):
    grad_w_acc, grad_b_acc = 0.0, 0.0
    # Each "worker" computes its local gradient
    for worker_idx in range(N_WORKERS):
        idx = batches[worker_idx]
        pred = w * X[idx] + b
        err  = pred - y_true[idx]
        # local gradients
        grad_w_acc += (2 * err * X[idx]).mean()
        grad_b_acc += (2 * err).mean()
    # all-reduce: average across workers
    grad_w = grad_w_acc / N_WORKERS
    grad_b = grad_b_acc / N_WORKERS
    # synchronous step — every worker updates with the same averaged grad
    w -= lr * grad_w
    b -= lr * grad_b
    if epoch % 5 == 0:
        loss = ((w * X + b - y_true) ** 2).mean()
        print(f"epoch {epoch:2d}: w={w:.3f}, b={b:.3f}, loss={loss:.4f}")

print(f"\\nFinal: w={w:.3f} (target 2.5), b={b:.3f} (target 0.7)")
print(f"This loop is exactly what DDP does — only the all-reduce is real and uses NCCL.")
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Sentetik regresyon verisi <code>y = 2.5x + 0.7 + gürültü</code> üretir ve <code>np.array_split</code> ile 1024 örneği 4 ayrık parçaya böler — sahte worker başına bir tane, tam olarak <code>DistributedSampler</code>'in rank-yerel mini-batch'leri atadığı şekilde. 2) Her worker yalnızca kendi parçası üzerinde <em>yerel</em> MSE gradient'lerini <code>(2*err*X[idx]).mean()</code> ve <code>(2*err).mean()</code> hesaplar — bu, torch.distributed'in rank-başına forward+backward'unun aynısı. 3) <code>grad_w_acc</code> ve <code>grad_b_acc</code>'yi <code>N_WORKERS</code>'a bölmek, <code>op=AVG</code> ile NCCL ring-all-reduce'un matematiksel eşdeğeridir; bu bölmeyi gerçek bir <code>dist.all_reduce(tensor, op=ReduceOp.AVG)</code> ile değiştirmek scripti gerçek multi-GPU DDP'ye dönüştürür. 4) Senkron SGD adımı <code>w -= lr*grad_w; b -= lr*grad_b</code> her worker'da özdeş gerçekleşir, böylece replica'lar numerik olarak hizalı kalır — son çıktı <code>w≈2.5, b≈0.7</code>'ye yakınsar ve gradient-ortalama matematiğinin doğru olduğunu teyit eder.</p>

<p class="l-text">Gerçek DDP kavramsal olarak özdeş. Tek fark: her "worker" ayrı bir GPU'da ayrı bir süreç, all-reduce NVLink/IB üzerinde gerçek bir NCCL ring-all-reduce ve gradient hesaplamaları ardışıllık yerine paralel olarak gerçekleşir. Matematik FP hassasiyeti içinde aynıdır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Yaygın Hata Modları ve Tanı</h2>
<p class="l-text">Dağıtık eğitim spektaküler şekillerde başarısız olur. En yaygın hata modları:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Loss N GPU'da ıraksıyor ama 1'de iyi eğitiliyor</div><div class="card-body">Etkili batch boyutu N ile ölçeklendi. Ya LR'i orantılı olarak azaltın, warmup ile linear LR scaling kuralı (Goyal 2017) kullanın, ya da çok büyük batch'ler için LARS/LAMB optimizer'larını kullanın.</div></div>
<div class="calc-card"><div class="card-title">Bir epoch sonunda asılıyor</div><div class="card-body">Bir worker'in diğerlerinden daha az batch'i var. <code>DistributedSampler(drop_last=True)</code> kullanın veya eşit uzunluğa padle yapın. Bu olmadan, rank'lar gelmeyecek bir all-reduce'da bloke olur.</div></div>
<div class="calc-card"><div class="card-title">Yavaş eğitim / NCCL timeout</div><div class="card-body">İletişim-bound. NVLink'in açık olduğunu (<code>nvidia-smi nvlink -s</code>), pod'lar arası yavaş Ethernet üzerinde all-reduce yapmadığınızı, gradient bucketing'in etkin olduğunu (DDP varsayılanı), karma hassasiyetin açık olduğunu kontrol edin.</div></div>
<div class="calc-card"><div class="card-title">Sadece rank 0'da OOM</div><div class="card-body">Naif checkpoint kaydetme ile yaygındır (tüm param'ları rank 0'a toplar). FSDP'nin <code>FULL_STATE_DICT</code>'ini <code>offload_to_cpu=True</code> ile veya shard'lı checkpointing kullanın.</div></div>
<div class="calc-card"><div class="card-title">Çalıştırmalar arası nondeterminizm</div><div class="card-body">NCCL'deki reduction sırası varsayılan olarak deterministik değildir. <code>NCCL_ALGO=Tree</code>, <code>torch.use_deterministic_algorithms(True)</code>, sabit seed'ler ayarla — ~%5 throughput'a mal olur.</div></div>
<div class="calc-card"><div class="card-title">Ölü GPU'da takılı kalmış collective</div><div class="card-body">Bir rank eğitim ortasında ölürse, diğerleri sonsuza kadar bekler. Python istisnaları olarak yüzeye çıkarmak için <code>NCCL_BLOCKING_WAIT=1</code> + <code>TORCH_NCCL_ASYNC_ERROR_HANDLING=1</code> kullan.</div></div>
</div>

<p class="l-text">Yardımcı olan araçlar: <code>nvidia-smi nvlink -gt</code> (link başı bant genişliği sayaçları), <code>nccl-tests</code> (all-reduce'un çevrimdışı benchmark'ı), <code>torch.profiler</code> + Chrome trace (ne beklediğini ve ne hesapladığını gör), <code>nsys</code> (NCCL trafiği dahil kernel-seviyesi timeline). Ders 8 vLLM kullanan gerçek bir üretim çıkarım sunucusunda FlashAttention + FSDP-tarzı shard'lamayı birleştirerek track'i kapatıyor.</p>
</div>`
};
