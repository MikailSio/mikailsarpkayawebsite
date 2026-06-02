window.GPU_L1 = {
en: `<p class="l-text"><strong>A modern GPU is not a faster CPU — it is a different beast entirely.</strong> An NVIDIA H100 has 132 Streaming Multiprocessors (SMs), each running 64 warps of 32 threads — that is 270,336 threads in flight at once, fed by 80 GB of HBM3 memory streaming at 3.35 TB/s. Compare that to a top-tier server CPU like an AMD EPYC 9654: 96 cores, ~5 GHz, ~460 GB/s memory bandwidth. The CPU is a sports car (low latency, branchy code, big caches per core); the GPU is a freight train (massive throughput, regular access patterns, tiny caches per thread). If you carry CPU intuitions onto a GPU you will write code that runs slower than NumPy on a laptop.</p>

<p class="l-text">In this first lesson we walk the GPU hierarchy from the outside in: the device with its HBM stacks, the SMs (the actual processors), the warps (the smallest unit of scheduling), the threads, and the memory pyramid that decides everything about performance — HBM (slow, huge), L2 (shared across SMs), shared memory / L1 (per-SM, fast), and registers (per-thread, instant). We compare H100 / A100 / RTX 4090 specs side by side so you have a feel for the numbers, and we draw the SIMT-vs-SIMD distinction that separates GPU programming from CPU vectorization. Everything in lessons 2–8 — kernel writing, memory coalescing, FlashAttention, distributed training — sits on top of this map.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read a GPU spec sheet: SMs, warps, threads, HBM bandwidth, FLOPS, NVLink</li>
<li>Place H100, A100, and RTX 4090 in the right tier for training vs inference</li>
<li>Distinguish SIMT (warps of 32 threads) from CPU SIMD (AVX-512 lanes)</li>
<li>Walk the memory hierarchy: register → shared → L2 → HBM and know each tier's latency</li>
<li>Compute the arithmetic intensity of a kernel and decide if it is compute-bound or memory-bound</li>
<li>Estimate occupancy and explain why "100% occupancy" is not always the goal</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. CPU vs GPU — Throughput Beats Latency</h2>
<p class="l-text">A CPU core is built to finish one instruction stream as fast as possible. It has deep pipelines, massive out-of-order execution, branch prediction trained on years of SPEC benchmarks, and 1–2 MB of L2 cache <em>per core</em>. A GPU SM is built to keep thousands of arithmetic units busy on regular data. It has shallow per-thread pipelines, no branch prediction worth mentioning, and only 256 KB of register file plus 228 KB of shared memory + L1 — but it has 128 FP32 ALUs, 4 tensor cores, and the ability to switch among 64 warps every cycle to hide memory latency.</p>

<p class="l-text">The trick the GPU plays is <strong>latency hiding by oversubscription</strong>. When one warp stalls on a memory load (which takes ~400 cycles on HBM), the SM scheduler issues a different warp's instruction on the next cycle. As long as you have enough warps in flight (high <em>occupancy</em>), the SM never waits. The CPU hides latency with caches and prefetch; the GPU hides latency with parallelism. This single difference dictates everything that follows.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CPU strengths</div><div class="card-body">Branchy code, pointer chasing, sequential algorithms, low single-task latency, large per-core cache, OS interaction. Anything where you have one or a few tasks.</div></div>
<div class="calc-card"><div class="card-title">GPU strengths</div><div class="card-body">Regular dense math (matmul, convolution, attention), millions of similar tasks, high arithmetic intensity, SIMT-friendly kernels. Throughput per dollar and per watt is 10–100x the CPU on these workloads.</div></div>
<div class="calc-card"><div class="card-title">When NOT to use a GPU</div><div class="card-body">Tiny batches, irregular control flow per element, anything that fits in 4 KB of cache, code dominated by Python overhead. A 100x100 matmul is faster on the CPU because launching the kernel costs more than the work.</div></div>
</div>

<div class="calc-highlight"><strong>Rule of thumb:</strong> if your problem has at least 10,000 independent units of regular work and an arithmetic intensity above ~10 FLOPs/byte, a GPU will win. Below that, the CPU's caches and lower launch overhead usually beat it.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The H100 / A100 / RTX 4090 Spec Sheet</h2>
<p class="l-text">Three GPUs cover ~95% of practitioner exposure in 2026: the H100 (datacenter training), the A100 (the workhorse 2020–2024, still everywhere), and the RTX 4090 (consumer flagship, prosumer training, hobbyist inference). Memorize the key numbers — they show up in every cost estimate, every "will this fit?" question, and every roofline analysis.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NVIDIA H100 SXM5</div><div class="card-body">132 SMs · 80 GB HBM3 · 3.35 TB/s memory BW · 989 TFLOPS bf16 (with sparsity 1979) · 67 TFLOPS FP32 · 4th-gen NVLink 900 GB/s · 700 W · ~30k USD. The standard for LLM training in 2024–2026.</div></div>
<div class="calc-card"><div class="card-title">NVIDIA A100 SXM4</div><div class="card-body">108 SMs · 80 GB HBM2e · 2.04 TB/s memory BW · 312 TFLOPS bf16 · 19.5 TFLOPS FP32 · 3rd-gen NVLink 600 GB/s · 400 W · still the most-rented GPU on cloud spot markets. GPT-3 was trained on these.</div></div>
<div class="calc-card"><div class="card-title">NVIDIA RTX 4090</div><div class="card-body">128 SMs (Ada) · 24 GB GDDR6X · 1.01 TB/s · 165 TFLOPS bf16 · 82 TFLOPS FP32 · no NVLink · 450 W · ~1.6k USD. Best per-dollar inference; training small/mid models locally; quantized 70B inference with 2x4090.</div></div>
<div class="calc-card"><div class="card-title">B100 / B200 (Blackwell)</div><div class="card-body">Announced 2024, shipping 2025. Up to 192 GB HBM3e · ~8 TB/s · ~2.25 PFLOPS bf16 · 5th-gen NVLink 1.8 TB/s · FP4 tensor cores. Doubles the H100 on most metrics. Will dominate training 2025–2027.</div></div>
</div>

<div class="katex-block">$$\\text{memory bandwidth} = \\frac{\\text{bytes transferred}}{\\text{time}} \\quad\\Rightarrow\\quad \\text{time}_{\\text{mem}} = \\frac{\\text{bytes}}{BW}$$</div>

<p class="l-text">Read this formula every time you wonder "why is my kernel slow?" — if the bytes-moved divided by HBM bandwidth is bigger than the FLOPS divided by peak FLOPS, you are memory-bound and no clever indexing will save you. Section 7 makes this precise with the roofline.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Streaming Multiprocessors, Warps, Threads</h2>
<p class="l-text">An SM is the physical processor on a GPU. Everything else — warps, threads, blocks — is a software abstraction the CUDA runtime maps onto SMs. An H100 SM contains: 128 FP32 ALUs, 64 FP64 ALUs, 4 fourth-gen tensor cores (the matmul beasts that deliver the 989 TFLOPS), 256 KB of register file, 228 KB of shared memory + L1, 4 warp schedulers. Threads are grouped in <strong>warps of 32</strong> — and the warp, not the thread, is the actual unit of scheduling.</p>

<p class="l-text">When CUDA launches a kernel with, say, 1024 blocks of 256 threads, the runtime hands blocks to SMs. Each block lives on exactly one SM until it finishes. The SM splits the block's 256 threads into 8 warps and rotates them. With up to 64 warps resident per SM, an H100 GPU can have 132 × 64 = 8,448 warps × 32 = 270,336 threads <em>all alive simultaneously</em>. They are not all running every cycle — they take turns 4 at a time per SM — but they are all available to hide each other's stalls.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Thread</div><div class="card-body">The smallest unit of work. Has private registers (~64 of them) and a thread index. Cheap — millions of threads is normal.</div></div>
<div class="calc-card"><div class="card-title">Warp (32 threads)</div><div class="card-body">The hardware execution unit. All 32 threads execute the same instruction in lock-step. If they branch differently ("warp divergence"), some lanes idle while others run — this is the cardinal performance sin.</div></div>
<div class="calc-card"><div class="card-title">Block</div><div class="card-body">A group of threads (typically 128–1024) that can synchronize and share fast on-chip memory. Mapped to one SM. Threads in the same block can call <code>__syncthreads()</code>; threads across blocks cannot.</div></div>
<div class="calc-card"><div class="card-title">Grid</div><div class="card-body">All blocks for one kernel launch. Can be 1D, 2D, or 3D. Total threads = grid_dim × block_dim, often in the millions.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Memory Hierarchy — Where Performance Lives or Dies</h2>
<p class="l-text">If you remember one thing from this entire track, make it this: <strong>GPU performance is almost always a memory problem.</strong> The peak FLOPS number on the spec sheet is achievable only when data is already on-chip. Every byte that has to travel from HBM costs ~400 cycles. Every byte from L2 costs ~200. Every byte from shared memory costs ~20. Every byte from a register costs zero. Good kernels move bytes to fast memory once and reuse them many times.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Registers (per thread)</div><div class="card-body">~256 KB total per SM, split among warps. 1-cycle latency. Compiler-managed — you do not allocate them, but you control pressure via local variable count. Spilling to L1 is a disaster.</div></div>
<div class="calc-card"><div class="card-title">Shared memory / L1 (per SM)</div><div class="card-body">228 KB on H100, software-controlled. ~20 cycle latency. Used for tile-loading data once and reusing across a block. The currency of fast kernels (matmul, FlashAttention, conv).</div></div>
<div class="calc-card"><div class="card-title">L2 cache (device-wide)</div><div class="card-body">50 MB on H100. Shared across all SMs. Catches reuse across blocks. Slower than shared memory but bigger; useful when tiles do not fit on-SM.</div></div>
<div class="calc-card"><div class="card-title">HBM (device DRAM)</div><div class="card-body">80 GB on H100/A100, 24 GB on 4090. ~400 cycle latency, multi-TB/s aggregate bandwidth. Where your model weights live. Reading from HBM is the dominant cost in inference.</div></div>
<div class="calc-card"><div class="card-title">Host RAM (CPU)</div><div class="card-body">Reached over PCIe 5.0 (~63 GB/s) or NVLink-C2C (Grace–Hopper 900 GB/s). 10,000x slower than HBM in latency. PCIe transfers are the silent killer of performance.</div></div>
<div class="calc-card"><div class="card-title">Other GPUs (NVLink / IB)</div><div class="card-body">NVLink 4 = 900 GB/s GPU↔GPU, InfiniBand HDR ~50 GB/s node↔node. Distributed training (lesson 7) lives here. Communication latency dominates above 100B-parameter models.</div></div>
</div>

<div class="katex-block">$$\\text{arithmetic intensity} = \\frac{\\text{FLOPs}}{\\text{bytes from HBM}}$$</div>

<p class="l-text">A matmul of N×N matrices does 2N³ FLOPs and reads ~3N² floats — intensity is O(N), so big matmuls are <em>compute-bound</em>. An elementwise add does 1 FLOP per 8 bytes (two FP32 reads + one write) — intensity 0.125, badly <em>memory-bound</em>. The whole point of fused kernels (lesson 5) is to raise arithmetic intensity.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. SIMT vs SIMD — The Subtle Distinction</h2>
<p class="l-text">CPUs vectorize with SIMD: one instruction operates on a vector register holding, say, 16 FP32 lanes (AVX-512). The compiler or programmer must explicitly use <code>_mm512_add_ps</code>-style intrinsics or rely on auto-vectorization. Branches inside the loop body are awkward — you typically masking lanes or splitting the loop.</p>

<p class="l-text">GPUs use <strong>SIMT — Single Instruction, Multiple Threads</strong>. You write code as if each thread is a normal scalar program, with its own <code>threadIdx.x</code>. The hardware groups 32 threads into a warp and runs the same instruction across all 32 in lock-step. Branches "just work" — but if threads in a warp take different branches (<em>warp divergence</em>), the hardware serializes the branches: lanes on the false path idle while the true path runs, then vice versa. This is why GPU code that looks sequential is actually parallel, and why conditional logic inside hot kernels is dangerous.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SIMD (CPU)</div><div class="card-body">Programmer thinks in vectors. <code>__m512 a = _mm512_loadu_ps(ptr);</code>. One control flow, 16 data lanes. Branches awkward. Compiler does most of the work via auto-vectorization.</div></div>
<div class="calc-card"><div class="card-title">SIMT (GPU)</div><div class="card-body">Programmer thinks in threads. <code>int i = blockIdx.x * blockDim.x + threadIdx.x;</code>. Looks scalar; runs in 32-wide lock-step. Branches "just work" but cost performance when warps diverge.</div></div>
<div class="calc-card"><div class="card-title">Practical effect</div><div class="card-body">SIMT is far easier to write — you do not need intrinsics — but you pay for divergence. The unwritten rule: keep all 32 threads of a warp doing the same thing. Sort data, structure indexing, avoid <code>if</code>-chains keyed on thread ID modulo small numbers.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Occupancy — How Many Warps Fit on an SM?</h2>
<p class="l-text">Occupancy is the ratio of active warps on an SM to the maximum the SM supports. On H100 the max is 64 warps per SM. If your kernel only fits 16 warps per SM (because it uses too many registers or too much shared memory per block), occupancy is 25%. Lower occupancy means fewer warps available to hide memory stalls — and on memory-bound kernels, that translates almost linearly to lower throughput.</p>

<div class="katex-block">$$\\text{occupancy} = \\frac{\\text{active warps per SM}}{\\text{max warps per SM}}$$</div>

<p class="l-text">Three things limit occupancy: (1) <strong>register count</strong> — 256 KB of registers per SM; if each thread uses 64 registers, you fit 256K / (64×4) = 1024 threads = 32 warps; (2) <strong>shared memory per block</strong> — if each block uses 96 KB, only 2 blocks fit on an SM with 228 KB of shared memory; (3) <strong>block size</strong> — block_dim × num_blocks must satisfy both the register and shared-memory limits.</p>

<div class="calc-highlight"><strong>Counterintuitive truth:</strong> 100% occupancy is not always the goal. Volkov's classic 2010 paper "Better Performance at Lower Occupancy" showed that aggressive register use (which lowers occupancy) can raise instruction-level parallelism enough to win. FlashAttention and modern matmul libraries deliberately use 25–50% occupancy with very wide register tiles. <em>Tune for throughput, not for occupancy.</em></p>

<p class="l-text">NVIDIA ships an "Occupancy Calculator" inside Nsight Compute and an offline spreadsheet — feed it your block size, register count, and shared-memory usage, it tells you how many warps fit. Lesson 3 returns to this for memory-optimization tradeoffs.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Roofline Analysis in Code</h2>
<p class="l-text">The roofline model (Williams 2009) tells you, for any kernel, whether it is compute-bound or memory-bound. Plot arithmetic intensity (FLOPs/byte) on the X axis and achievable FLOPS on the Y axis. The "roof" is min(peak FLOPS, intensity × peak BW). Where your kernel falls under the roof tells you which to optimize. Let us simulate it for the H100.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># H100 roofline: peak compute vs peak bandwidth
import numpy as np
import matplotlib.pyplot as plt

PEAK_FLOPS = 989e12     # bf16 TFLOPS (no sparsity)
PEAK_BW    = 3.35e12    # HBM3 bytes/sec

intensity = np.logspace(-1, 3, 200)  # 0.1 .. 1000 FLOPs/byte
roof = np.minimum(PEAK_FLOPS, intensity * PEAK_BW)

# Sample kernels
kernels = {
    "elementwise add (3 reads, 1 write FP32)": (1/16, 50e12),
    "softmax over last dim":                    (3.0,  300e12),
    "matmul 4096x4096 bf16":                    (683., 850e12),
    "FlashAttention (seq=8k)":                  (250., 700e12),
}

plt.figure(figsize=(8,5))
plt.loglog(intensity, roof, "k-", lw=2, label="H100 roof")
for name, (ai, perf) in kernels.items():
    plt.plot(ai, perf, "o", ms=10, label=name)
plt.xlabel("Arithmetic intensity (FLOPs / byte)")
plt.ylabel("Achieved FLOPS")
plt.title("Roofline — H100 bf16")
plt.legend(fontsize=8); plt.grid(True, which="both", alpha=0.3)
plt.show()
print("Ridge point (intensity where compute meets bandwidth):",
      f"{PEAK_FLOPS/PEAK_BW:.1f} FLOPs/byte")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Hardcodes H100 peaks: 989 TFLOPS for bf16 (without 2:4 sparsity bonus) and 3.35 TB/s for HBM3 — these are the two ceilings the roofline draws. 2) Builds a log-spaced sweep of arithmetic intensities from 0.1 to 1000 FLOPs/byte covering everything from elementwise ops to deep matmul. 3) The roofline itself is <code>min(peak_FLOPS, intensity * peak_BW)</code> — below the ridge intensity = peak_FLOPS/peak_BW (~295 on H100), bandwidth is the bottleneck and achievable FLOPS = AI × BW; above it, compute saturates and the curve flattens at 989 TFLOPS. 4) Plots four sample kernels at their measured (AI, achieved-FLOPS) pairs: elementwise add (AI ~ 0.06, achieved ~5% of peak — clearly memory-bound), softmax (AI ~ 3, still memory-bound), 4096² bf16 matmul (AI ~ 683, achieves ~86% peak), FlashAttention (AI ~ 250, ~70% peak — note how FA pushes attention from softmax-memory-bound territory to near matmul territory by tile-fusing). 5) Computes and prints the ridge point — knowing this number for your hardware tells you instantly which optimization (better memory layout vs. better compute kernels) will help a given kernel.</p>

<p class="l-text">Reading the chart: kernels left of the ridge point (~295 FLOPs/byte on H100) are memory-bound — their throughput is capped by HBM bandwidth. Kernels right of it are compute-bound — capped by tensor-core throughput. Elementwise ops sit far left and run at single-digit % of peak; matmul sits far right and can reach 80–90% of peak. FlashAttention's whole trick (lesson 6) is moving attention from memory-bound to nearly compute-bound by avoiding the materialized N×N matrix.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Estimating Bandwidth-Bound Performance with NumPy</h2>
<p class="l-text">You do not need a GPU to build intuition for bandwidth-bound kernels. NumPy on a modern CPU is itself bandwidth-bound for simple reductions, and it lets you measure the same patterns. Here we time an elementwise add and a small matmul, then back out the achieved bytes/sec and FLOPs/sec.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

def bench(fn, repeats=5):
    fn()  # warmup
    t0 = time.perf_counter()
    for _ in range(repeats): fn()
    return (time.perf_counter() - t0) / repeats

# Elementwise add: c = a + b on 16M floats (64 MB read + 32 MB write)
N = 16_000_000
a, b = np.random.rand(N).astype(np.float32), np.random.rand(N).astype(np.float32)
t = bench(lambda: np.add(a, b))
bytes_moved = 3 * N * 4  # 2 reads + 1 write, FP32
flops       = 1 * N
print(f"add: {t*1000:.2f} ms · {bytes_moved/t/1e9:.1f} GB/s · {flops/t/1e9:.2f} GFLOPS")

# Matmul: 1024 x 1024 FP32 = 2 * N^3 FLOPs
M = 1024
A, B = np.random.rand(M, M).astype(np.float32), np.random.rand(M, M).astype(np.float32)
t = bench(lambda: A @ B)
flops = 2 * M**3
print(f"matmul {M}x{M}: {t*1000:.2f} ms · {flops/t/1e9:.1f} GFLOPS")
print(f"intensity matmul = {flops / (3*M*M*4):.1f} FLOPs/byte (compute-bound)")
print(f"intensity add    = {1*N / (3*N*4):.3f} FLOPs/byte (memory-bound)")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a <code>bench</code> helper that warms up once (cache priming, branch predictor settling) then averages 5 runs with <code>perf_counter</code> — same instrumentation pattern Nsight Compute uses on GPU. 2) Sets up 16M FP32 elements for elementwise add — total memory traffic = 2 reads × 64MB + 1 write × 64MB = 192MB; FLOP count = 16M (one add per element). The AI = 16M / (3 · 16M · 4) = 1/12 FLOPs/byte — squarely in roofline's memory-bound region. 3) Times the add via <code>np.add</code> which dispatches to vectorized SIMD on modern CPUs — measured GB/s hits ~30-60 GB/s on consumer DDR4/DDR5, ~80% of memory BW peak; GFLOPS stays in the single digits despite the CPU being capable of 100+ GFLOPS in compute-bound work. 4) Times a 1024² FP32 matmul (2·1024³ ≈ 2.15 GFLOPs of arithmetic, 12MB of weights) — AI ≈ 178, deep into compute-bound; numpy's @ dispatches to BLAS GEMM which uses register blocking + cache tiling + AVX-512/NEON SIMD. 5) Prints both achieved arithmetic intensities — the matmul's AI is >2000x the add's, demonstrating exactly why GPUs and CPUs both spend their transistor budgets on matmul: it's the only op where bandwidth stops being the bottleneck.</p>

<p class="l-text">This script makes the lesson's central claim concrete: elementwise add achieves a single-digit GFLOPS because it is bandwidth-bound, while matmul reaches hundreds of GFLOPS because it is compute-bound. The same dichotomy on a GPU separates "wasted hardware" from "98% of peak". Lesson 2 starts writing the GPU side.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. H100 vs A100 roofline (visual)</h2>
<p class="l-text">A roofline plot maps achievable performance against arithmetic intensity (FLOPs per byte loaded). Below the ridge you are memory-bound (slope = HBM bandwidth); above it you are compute-bound (flat line at peak FLOPs). H100's higher HBM and FP16/BF16 ceiling shift both lines upward.</p>
<div id="plot-gpu-l1-roofline-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var grid = 'rgba(255,255,255,0.06)';
  var ai = []; for (var i=-1; i<=4; i+=0.1) ai.push(Math.pow(10,i));
  function roof(bwGBs, peakTFLOPs){
    var bw = bwGBs * 1e9, peak = peakTFLOPs * 1e12;
    return ai.map(function(x){ return Math.min(bw*x, peak)/1e12; });
  }
  var h100 = roof(3350, 989);
  var a100 = roof(2000, 312);
  var kernels = {x:[0.5, 12, 64, 256, 800], y:[1.0, 18, 90, 280, 900],
    text:['SAXPY','SpMV','LayerNorm','GEMM-small','GEMM-large'], mode:'markers+text', type:'scatter',
    marker:{size:10, color:accent}, textposition:'top center', name:'real kernels'};
  var data = [
    { x:ai, y:h100, type:'scatter', mode:'lines', name:'H100', line:{color:accent, width:2.5} },
    { x:ai, y:a100, type:'scatter', mode:'lines', name:'A100', line:{color:'#6aa9ff', width:2, dash:'dash'} },
    kernels
  ];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'arithmetic intensity (FLOPs/byte)', type:'log', gridcolor:grid},
    yaxis:{title:'performance (TFLOPS, bf16)', type:'log', gridcolor:grid},
    margin:{t:50,r:20,b:60,l:70}, title:{text:'Roofline: H100 vs A100 (bf16)', font:{color:text, size:14}}, height:380,
    legend:{x:0.02,y:0.98,bgcolor:'rgba(0,0,0,0.2)'} };
  Plotly.newPlot('plot-gpu-l1-roofline-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-gpu-l1-roofline-tr');
  if (trDiv) {
    var layoutTr = JSON.parse(JSON.stringify(layout));
    layoutTr.title = {text:'Roofline: H100 vs A100 (bf16)', font:{color:text, size:14}};
    layoutTr.xaxis.title = 'aritmetik yoğunluk (FLOPs/byte)';
    layoutTr.yaxis.title = 'performans (TFLOPS, bf16)';
    Plotly.newPlot('plot-gpu-l1-roofline-tr', data, layoutTr, {responsive:true, displayModeBar:false});
  }
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> SAXPY and SpMV live on the bandwidth slope — adding faster cores does nothing for them. GEMM-large sits on the flat roof — that's where tensor cores matter. The ridge near ~295 FLOPs/byte (H100, bf16) is the threshold every kernel author should know.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Where We Go From Here</h2>
<p class="l-text">You now have the map: a GPU is many SMs, each running many warps, fed by a memory pyramid where moving data is more expensive than computing on it. The rest of this track turns that map into code. Lesson 2 writes your first CUDA kernel (vector add, the "hello world"). Lesson 3 attacks memory: coalescing, shared-memory tiling, bank conflicts. Lesson 4 brings Python in via Numba and CuPy. Lesson 5 introduces Triton — OpenAI's Python DSL that has become the modern way to write custom kernels. Lesson 6 dissects FlashAttention, the single most influential GPU kernel of the LLM era. Lesson 7 scales to many GPUs (DDP / FSDP / NCCL). Lesson 8 puts it all together in an inference server (vLLM / PagedAttention / continuous batching).</p>

<p class="l-text">If you only remember three numbers from this lesson, make them: <strong>3.35 TB/s</strong> (H100 HBM bandwidth — the speed limit), <strong>989 TFLOPS bf16</strong> (H100 peak — the ceiling), and <strong>295 FLOPs/byte</strong> (the ridge point — the boundary between memory-bound and compute-bound). Every optimization decision in lessons 2–8 reduces to: am I above or below that ridge, and how do I move?</p>
</div>`,
tr: `<p class="l-text"><strong>Modern bir GPU, daha hızlı bir CPU değildir; tamamen başka bir canavardır.</strong> Bir NVIDIA H100, her biri 32 thread'lik 64 warp çalıştıran 132 Streaming Multiprocessor (SM) içerir; bu, 80 GB HBM3 bellekten 3.35 TB/s hızında beslenen aynı anda 270.336 thread demektir. Bunu üst segment bir sunucu CPU'su olan AMD EPYC 9654 ile karşılaştırın: 96 çekirdek, ~5 GHz, ~460 GB/s bellek bant genişliği. CPU bir spor arabadır (düşük gecikme, dallanmalı kod, çekirdek başına büyük cache); GPU ise bir yük trenidir (devasa throughput, düzenli erişim örnekleri, thread başına küçük cache). Eğer CPU sezgilerini bir GPU'ya taşırsanız, bir laptop'taki NumPy'dan daha yavaş çalışan kod yazarsınız.</p>

<p class="l-text">Bu ilk derste GPU hiyerarşisini dışarıdan içeriye doğru yürüyoruz: HBM yığınlarıyla cihaz, SM'ler (asıl işlemciler), warp'lar (en küçük planlama birimi), thread'ler ve performansla ilgili her şeye karar veren bellek piramidi: HBM (yavaş, devasa), L2 (SM'ler arası paylaşımlı), paylaşılan bellek / L1 (SM başına, hızlı) ve register'lar (thread başına, anlık). H100 / A100 / RTX 4090 özelliklerini yan yana karşılaştırıyoruz, böylece sayılar hakkında bir his kazanıyorsunuz; ve GPU programlamayı CPU vektörlemesinden ayıran SIMT-vs-SIMD ayrımını çiziyoruz. 2-8. derslerdeki her şey - kernel yazma, bellek birleşimi, FlashAttention, dağıtık eğitim - bu haritanın üzerine oturur.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir GPU spec sayfasını okuyun: SM'ler, warp'lar, thread'ler, HBM bant genişliği, FLOPS, NVLink</li>
<li>H100, A100 ve RTX 4090'i eğitim vs çıkarım için doğru kademede konumlandırın</li>
<li>SIMT'i (32 thread'lik warp'lar) CPU SIMD'den (AVX-512 lane'leri) ayırt edin</li>
<li>Bellek hiyerarşisini yürüyün: register → shared → L2 → HBM ve her kademenin gecikmesini bilin</li>
<li>Bir kernel'in aritmetik yoğunluğunu hesaplayın ve compute-bound mu yoksa memory-bound mu olduğunu kararlaştırın</li>
<li>Doluluk değerini tahmin edin ve neden "%100 doluluk"un her zaman hedef olmadığını açıklayın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. CPU vs GPU — Throughput Gecikmeyi Yener</h2>
<p class="l-text">Bir CPU çekirdeği, tek bir komut akışını olabildiğince hızlı bitirmek için tasarlanmıştır. Derin pipeline'lar, devasa out-of-order yürütme, yıllarca SPEC benchmark'larında eğitilmiş branch prediction ve <em>çekirdek başına</em> 1-2 MB L2 cache'e sahiptir. Bir GPU SM'i, binlerce aritmetik birimi düzenli veri üzerinde meşgul tutmak için tasarlanmıştır. Sığ per-thread pipeline'lara, kayda değer bir branch prediction'a sahip değildir ve sadece 256 KB register dosyası + 228 KB paylaşılan bellek + L1'i vardır; ancak 128 FP32 ALU, 4 tensor core ve bellek gecikmesini gizlemek için her döngüde 64 warp arasında geçiş yapma yeteneği vardır.</p>

<p class="l-text">GPU'nun oynadığı hile <strong>aşırı abone olarak gecikme gizlemedir</strong>. Bir warp HBM'de bir bellek yüklenmesinde takıldığında (~400 döngü sürer), SM zamanlayıcısı bir sonraki döngüde farklı bir warp'in komutunu yayınlar. Yeterince warp uçuşta olduğu sürece (yüksek <em>doluluk</em>), SM asla beklemez. CPU gecikmeyi cache ve prefetch ile gizler; GPU gecikmeyi paralelizm ile gizler. Bu tek fark, devamında gelen her şeyi belirler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CPU güçlü yanları</div><div class="card-body">Dallanmalı kod, işaretçi kovalama, sıralı algoritmalar, düşük tek-görev gecikmesi, büyük çekirdek başına cache, OS etkileşimi. Bir veya birkaç göreviniz olan her şey.</div></div>
<div class="calc-card"><div class="card-title">GPU güçlü yanları</div><div class="card-body">Düzenli yoğun matematik (matmul, convolution, attention), milyonlarca benzer görev, yüksek aritmetik yoğunluk, SIMT-dostu kernel'ler. Bu iş yüklerinde dolar başı ve watt başı throughput, CPU'nun 10-100 katıdır.</div></div>
<div class="calc-card"><div class="card-title">GPU NE ZAMAN kullanılmamalı</div><div class="card-body">Küçük batch'ler, eleman başına düzensiz kontrol akışı, 4 KB cache'e sığan her şey, Python overhead'i tarafından domine edilen kod. 100x100 bir matmul CPU'da daha hızlıdır çünkü kernel'i başlatmak işin kendisinden daha pahalıya mal olur.</div></div>
</div>

<div class="calc-highlight"><strong>Pratik kural:</strong> Probleminizin en az 10.000 bağımsız düzenli iş birimi ve ~10 FLOPs/byte üstü aritmetik yoğunluğu varsa, GPU kazanır. Bunun altında, CPU'nun cache'leri ve düşük launch overhead'i genellikle ondan iyidir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. H100 / A100 / RTX 4090 Spec Sayfası</h2>
<p class="l-text">Üç GPU, 2026'da uygulayıcıların maruziyetinin ~%95'ini kapsıyor: H100 (datacenter eğitim), A100 (2020-2024 iş atı, hala her yerde) ve RTX 4090 (tüketici amiral gemisi, prosumer eğitim, hobici çıkarım). Anahtar sayıları ezberleyin; her maliyet tahmininde, her "bu sığar mı?" sorusunda ve her roofline analizinde karşınıza çıkarlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">NVIDIA H100 SXM5</div><div class="card-body">132 SM · 80 GB HBM3 · 3.35 TB/s bellek BW · 989 TFLOPS bf16 (sparsity ile 1979) · 67 TFLOPS FP32 · 4. nesil NVLink 900 GB/s · 700 W · ~30k USD. 2024-2026'da LLM eğitimi için standart.</div></div>
<div class="calc-card"><div class="card-title">NVIDIA A100 SXM4</div><div class="card-body">108 SM · 80 GB HBM2e · 2.04 TB/s bellek BW · 312 TFLOPS bf16 · 19.5 TFLOPS FP32 · 3. nesil NVLink 600 GB/s · 400 W · cloud spot pazarlarında hala en çok kiralanan GPU. GPT-3 bunlarla eğitildi.</div></div>
<div class="calc-card"><div class="card-title">NVIDIA RTX 4090</div><div class="card-body">128 SM (Ada) · 24 GB GDDR6X · 1.01 TB/s · 165 TFLOPS bf16 · 82 TFLOPS FP32 · NVLink yok · 450 W · ~1.6k USD. Dolar başına en iyi çıkarım; yerel olarak küçük/orta modeller eğitmek; 2x4090 ile kuantize 70B çıkarım.</div></div>
<div class="calc-card"><div class="card-title">B100 / B200 (Blackwell)</div><div class="card-body">2024'te duyuruldu, 2025'te sevkiyat. 192 GB HBM3e'ye kadar · ~8 TB/s · ~2.25 PFLOPS bf16 · 5. nesil NVLink 1.8 TB/s · FP4 tensor core'lar. Çoğu metrikte H100'u ikiye katlar. 2025-2027 eğitimine hakim olacak.</div></div>
</div>

<div class="katex-block">$$\\text{memory bandwidth} = \\frac{\\text{bytes transferred}}{\\text{time}} \\quad\\Rightarrow\\quad \\text{time}_{\\text{mem}} = \\frac{\\text{bytes}}{BW}$$</div>

<p class="l-text">Bu formülü "kernel'im neden yavaş?" diye düşündüğünüz her zaman okuyun; eğer taşınan byte sayısını HBM bant genişliğine böldüğünüzde, FLOPS'u peak FLOPS'a böldüğünüzden büyükse, memory-bound'siniz ve hiçbir zekice indeksleme sizi kurtaramaz. Bölüm 7 bunu roofline ile kesin hale getiriyor.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Streaming Multiprocessor'lar, Warp'lar, Thread'ler</h2>
<p class="l-text">Bir SM, GPU üzerindeki fiziksel işlemcidir. Diğer her şey - warp'lar, thread'ler, bloklar - CUDA runtime'in SM'lere haritaladığı yazılım soyutlamalarıdır. Bir H100 SM'i şunları içerir: 128 FP32 ALU, 64 FP64 ALU, 4 dördüncü nesil tensor core (989 TFLOPS'u sunan matmul canavarları), 256 KB register dosyası, 228 KB paylaşılan bellek + L1, 4 warp scheduler. Thread'ler <strong>32 thread'lik warp'lar</strong> halinde gruplanır ve thread değil, warp gerçek planlama birimidir.</p>

<p class="l-text">CUDA bir kernel'i, diyelim 256 thread'lik 1024 blokla başlattığında, runtime blokları SM'lere dağıtır. Her blok bitene kadar tam olarak bir SM üzerinde yaşar. SM bloğun 256 thread'ini 8 warp'a böler ve onları rotate eder. Her SM'de 64 warp'a kadar resident olabildiği için, bir H100 GPU'su 132 × 64 = 8.448 warp × 32 = 270.336 thread <em>aynı anda canlı</em> olabilir. Hepsi her döngüde çalışmaz - SM başına bir seferde 4 tanesi sıra ile - ama hepsi birbirinin durmasını gizlemek için mevcuttur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Thread</div><div class="card-body">En küçük iş birimi. Özel register'lara (~64 tane) ve bir thread indeksine sahiptir. Ucuz; milyonlarca thread normaldir.</div></div>
<div class="calc-card"><div class="card-title">Warp (32 thread)</div><div class="card-body">Donanım yürütme birimi. Tüm 32 thread aynı komutu lock-step'te yürütür. Eğer farklı şekilde dallanırlarsa ("warp divergence"), bazı lane'ler boş beklerken diğerleri çalışır; bu, en büyük performans günahıdır.</div></div>
<div class="calc-card"><div class="card-title">Blok</div><div class="card-body">Senkronize olabilen ve hızlı on-chip belleği paylaşabilen bir thread grubu (genellikle 128-1024). Bir SM'e haritalanır. Aynı bloktaki thread'ler <code>__syncthreads()</code> çağırabilir; bloklar arası thread'ler çağıramaz.</div></div>
<div class="calc-card"><div class="card-title">Grid</div><div class="card-body">Bir kernel başlatması için tüm bloklar. 1D, 2D veya 3D olabilir. Toplam thread = grid_dim × block_dim, genellikle milyonlarca.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Bellek Hiyerarşisi — Performansın Yaşadığı veya Öldüğü Yer</h2>
<p class="l-text">Bu bütün track'ten tek bir şey hatırlayacaksanız, şu olsun: <strong>GPU performansı neredeyse her zaman bir bellek sorunudur.</strong> Spec sayfasındaki peak FLOPS rakamı, ancak veri zaten on-chip olduğunda elde edilebilir. HBM'den gelmesi gereken her byte ~400 döngü maliyetinde. L2'den her byte ~200. Paylaşılan bellekten her byte ~20. Bir register'dan her byte sıfır. İyi kernel'ler byte'ları hızlı belleğe bir kez taşıyıp çok kez yeniden kullanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Register'lar (thread başına)</div><div class="card-body">SM başına toplam ~256 KB, warp'lar arasında bölüştürülür. 1-döngü gecikme. Compiler-yöneten; onları tahsis etmezsiniz, ama yerel değişken sayısı ile baskı uygularsınız. L1'e dökülme bir felaket.</div></div>
<div class="calc-card"><div class="card-title">Paylaşılan bellek / L1 (SM başına)</div><div class="card-body">H100'de 228 KB, yazılım kontrollü. ~20 döngü gecikme. Veriyi tile-yükleyip blok genelinde yeniden kullanmak için kullanılır. Hızlı kernel'lerin para birimi (matmul, FlashAttention, conv).</div></div>
<div class="calc-card"><div class="card-title">L2 cache (cihaz genelinde)</div><div class="card-body">H100'de 50 MB. Tüm SM'ler arasında paylaşılır. Bloklar arası yeniden kullanımı yakalar. Paylaşılan bellekten yavaş ama büyük; tile'lar SM-içine sığmadığında kullanışlıdır.</div></div>
<div class="calc-card"><div class="card-title">HBM (cihaz DRAM)</div><div class="card-body">H100/A100'de 80 GB, 4090'da 24 GB. ~400 döngü gecikme, multi-TB/s toplam bant genişliği. Model ağırlıklarınızın yaşadığı yer. HBM'den okumak çıkarımda baskın maliyettir.</div></div>
<div class="calc-card"><div class="card-title">Host RAM (CPU)</div><div class="card-body">PCIe 5.0 (~63 GB/s) veya NVLink-C2C (Grace-Hopper 900 GB/s) üzerinden ulaşılır. Gecikmede HBM'den 10.000x yavaş. PCIe transferleri performansın sessiz katilidir.</div></div>
<div class="calc-card"><div class="card-title">Diğer GPU'lar (NVLink / IB)</div><div class="card-body">NVLink 4 = 900 GB/s GPU↔GPU, InfiniBand HDR ~50 GB/s node↔node. Dağıtık eğitim (Ders 7) burada yaşıyor. İletişim gecikmesi 100B-parametre üzeri modellerde domine eder.</div></div>
</div>

<div class="katex-block">$$\\text{arithmetic intensity} = \\frac{\\text{FLOPs}}{\\text{bytes from HBM}}$$</div>

<p class="l-text">N×N matrislerin matmul'u 2N³ FLOP yapar ve ~3N² float okur; yoğunluk O(N) yani büyük matmul'lar <em>compute-bound</em>'dir. Bir elementwise add 8 byte başına 1 FLOP yapar (iki FP32 okuma + bir yazma); yoğunluk 0.125, kötü derecede <em>memory-bound</em>. Fused kernel'lerin (Ders 5) tüm amacı aritmetik yoğunluğu yükseltmektir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. SIMT vs SIMD — İnce Ayrım</h2>
<p class="l-text">CPU'lar SIMD ile vektörize eder: tek bir komut, diyelim 16 FP32 lane'i tutan bir vektör register üzerinde çalışır (AVX-512). Compiler veya programcı, <code>_mm512_add_ps</code> tarzı intrinsic'leri açıkça kullanmalı veya auto-vektörlemeye güvenmelidir. Loop gövdesi içindeki dallar gariptir; genellikle lane'leri maskelersiniz veya loop'u bölersiniz.</p>

<p class="l-text">GPU'lar <strong>SIMT — Single Instruction, Multiple Threads</strong> kullanır. Her thread kendi <code>threadIdx.x</code>'i olan normal bir scalar program gibi kod yazarsınız. Donanım 32 thread'i bir warp'a gruplar ve aynı komutu tüm 32'si arasında lock-step'te çalıştırır. Dallar "sadece çalışır"; ancak bir warp'taki thread'ler farklı dallar alırsa (<em>warp divergence</em>), donanım dalları serileştirir: false yoldaki lane'ler true yol çalışırken boş durur, sonra tersi. Bu, sıralı görünen GPU kodunun aslında paralel olmasının ve sıcak kernel'lerin içindeki koşullu mantığın tehlikeli olmasının nedenidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SIMD (CPU)</div><div class="card-body">Programcı vektör cinsinden düşünür. <code>__m512 a = _mm512_loadu_ps(ptr);</code>. Tek kontrol akışı, 16 veri lane'i. Dallar garip. Compiler işin çoğunu auto-vektörleme ile yapar.</div></div>
<div class="calc-card"><div class="card-title">SIMT (GPU)</div><div class="card-body">Programcı thread cinsinden düşünür. <code>int i = blockIdx.x * blockDim.x + threadIdx.x;</code>. Scalar görünür; 32 geniş lock-step'te çalışır. Dallar "sadece çalışır" ama warp divergence olunca performansa mal olur.</div></div>
<div class="calc-card"><div class="card-title">Pratik etki</div><div class="card-body">SIMT yazması çok daha kolaydır; intrinsic'lere ihtiyacınız yok; ancak divergence için ödersiniz. Yazılmamış kural: bir warp'in 32 thread'inin hepsini aynı şeyi yapar tutun. Veriyi sıralayın, indekslemeyi yapılandırın, küçük sayılara mod thread ID'ye dayalı <code>if</code>-zincirlerinden kaçının.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Doluluk — Bir SM'e Kaç Warp Sığar?</h2>
<p class="l-text">Doluluk, bir SM'deki aktif warp sayısının SM'in desteklediği maksimuma oranıdır. H100'de maksimum SM başına 64 warp'tir. Eğer kernel'iniz SM başına sadece 16 warp sığdırıyorsa (çünkü blok başına çok fazla register veya çok fazla paylaşılan bellek kullanıyor), doluluk %25'tir. Daha düşük doluluk, bellek duraklamalarını gizlemek için daha az warp olması anlamına gelir; memory-bound kernel'lerde bu neredeyse doğrusal olarak daha düşük throughput'a çevrilir.</p>

<div class="katex-block">$$\\text{occupancy} = \\frac{\\text{active warps per SM}}{\\text{max warps per SM}}$$</div>

<p class="l-text">Üç şey doluluğu sınırlar: (1) <strong>register sayısı</strong> - SM başına 256 KB register; eğer her thread 64 register kullanıyorsa, 256K / (64×4) = 1024 thread = 32 warp sığar; (2) <strong>blok başına paylaşılan bellek</strong> - her blok 96 KB kullanıyorsa, 228 KB paylaşılan bellekli bir SM'e sadece 2 blok sığar; (3) <strong>blok boyutu</strong> - block_dim × num_blocks hem register hem paylaşılan-bellek limitlerini sağlamalı.</p>

<div class="calc-highlight"><strong>Sezgilere aykırı gerçek:</strong> %100 doluluk her zaman hedef değildir. Volkov'un klasik 2010 makalesi "Better Performance at Lower Occupancy", agresif register kullanımının (doluluğu düşüren) instruction-level paralelliği yeterince yükseltebileceğini gösterdi. FlashAttention ve modern matmul kütüphaneleri kasten %25-50 doluluk ile çok geniş register tile'ları kullanır. <em>Doluluk için değil, throughput için tune yapın.</em></div>

<p class="l-text">NVIDIA, Nsight Compute içinde bir "Occupancy Calculator" ve çevrimdışı bir spreadsheet sevk eder; ona blok boyutunuzu, register sayınızı ve paylaşılan-bellek kullanımınızı verirsiniz, kaç warp'in sığdığını söyler. Ders 3 bellek-optimizasyon takasları için buna geri dönüyor.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kodda Roofline Analizi</h2>
<p class="l-text">Roofline modeli (Williams 2009), herhangi bir kernel için compute-bound mu yoksa memory-bound mu olduğunu söyler. X ekseninde aritmetik yoğunluk (FLOPs/byte) ve Y ekseninde elde edilebilir FLOPS'u çizin. "Çatı" min(peak FLOPS, intensity × peak BW). Kernel'inizin çatının neresine düştüğü hangisini optimize edeceğinizi söyler. Bunu H100 için simüle edelim.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># H100 roofline: peak compute vs peak bandwidth
import numpy as np
import matplotlib.pyplot as plt

PEAK_FLOPS = 989e12     # bf16 TFLOPS (no sparsity)
PEAK_BW    = 3.35e12    # HBM3 bytes/sec

intensity = np.logspace(-1, 3, 200)  # 0.1 .. 1000 FLOPs/byte
roof = np.minimum(PEAK_FLOPS, intensity * PEAK_BW)

# Sample kernels
kernels = {
    "elementwise add (3 reads, 1 write FP32)": (1/16, 50e12),
    "softmax over last dim":                    (3.0,  300e12),
    "matmul 4096x4096 bf16":                    (683., 850e12),
    "FlashAttention (seq=8k)":                  (250., 700e12),
}

plt.figure(figsize=(8,5))
plt.loglog(intensity, roof, "k-", lw=2, label="H100 roof")
for name, (ai, perf) in kernels.items():
    plt.plot(ai, perf, "o", ms=10, label=name)
plt.xlabel("Arithmetic intensity (FLOPs / byte)")
plt.ylabel("Achieved FLOPS")
plt.title("Roofline — H100 bf16")
plt.legend(fontsize=8); plt.grid(True, which="both", alpha=0.3)
plt.show()
print("Ridge point (intensity where compute meets bandwidth):",
      f"{PEAK_FLOPS/PEAK_BW:.1f} FLOPs/byte")
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) H100 peak'lerini sabit kodlar: bf16 için 989 TFLOPS (2:4 sparsity bonusu olmadan) ve HBM3 için 3.35 TB/s — bunlar roofline'ın çizdiği iki tavandır. 2) Elementwise op'lardan derin matmul'a kadar her şeyi kapsayan 0.1'den 1000 FLOPs/byte'a logaritmik bir arithmetic intensity süpürmesi inşa eder. 3) Roofline'ın kendisi <code>min(peak_FLOPS, intensity * peak_BW)</code>'tir — ridge intensity'sinin altında = peak_FLOPS/peak_BW (H100'de ~295), bant genişliği darboğazdır ve achievable FLOPS = AI × BW; üstünde, compute doyar ve eğri 989 TFLOPS'te düzleşir. 4) Dört örnek kernel'i ölçülen (AI, achieved-FLOPS) çiftlerinde çizer: elementwise add (AI ~ 0.06, peak'in ~%5'ine ulaşır — açıkça memory-bound), softmax (AI ~ 3, hala memory-bound), 4096² bf16 matmul (AI ~ 683, %86 peak'e ulaşır), FlashAttention (AI ~ 250, %70 peak — FA'nın attention'ı softmax-memory-bound bölgesinden tile-fusing yoluyla matmul bölgesine nasıl ittiğine dikkat). 5) Ridge point'i hesaplar ve yazdırır — bu sayıyı donanımınız için bilmek, belirli bir kernel'e hangi optimizasyonun (daha iyi bellek düzeni vs. daha iyi compute kernel'leri) yardım edeceğini anında söyler.</p>

<p class="l-text">Grafiği okumak: ridge point'in solundaki kernel'ler (H100'de ~295 FLOPs/byte) memory-bound'dur; throughput'ları HBM bant genişliği ile sınırlandırılmıştır. Sağdakiler compute-bound'dur; tensor-core throughput'u ile sınırlıdır. Elementwise op'lar çok solda oturur ve peak'in tek haneli %'sinde çalışır; matmul çok sağda oturur ve peak'in %80-90'ına ulaşabilir. FlashAttention'ın tüm hilesi (Ders 6) materyalize N×N matrisinden kaçınarak attention'ı memory-bound'dan neredeyse compute-bound'a taşımaktır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. NumPy ile Bandwidth-Bound Performans Tahmini</h2>
<p class="l-text">Bandwidth-bound kernel'ler için sezgi oluşturmak için GPU'ya ihtiyacınız yok. Modern bir CPU'daki NumPy, basit reduction'lar için kendisi bandwidth-bound'dur ve aynı desenleri ölçmenize izin verir. Burada bir elementwise add ve küçük bir matmul'u zamanlıyoruz, sonra elde edilen byte/saniye ve FLOPs/saniye'yi geri türetiyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

def bench(fn, repeats=5):
    fn()  # warmup
    t0 = time.perf_counter()
    for _ in range(repeats): fn()
    return (time.perf_counter() - t0) / repeats

# Elementwise add: c = a + b on 16M floats (64 MB read + 32 MB write)
N = 16_000_000
a, b = np.random.rand(N).astype(np.float32), np.random.rand(N).astype(np.float32)
t = bench(lambda: np.add(a, b))
bytes_moved = 3 * N * 4  # 2 reads + 1 write, FP32
flops       = 1 * N
print(f"add: {t*1000:.2f} ms · {bytes_moved/t/1e9:.1f} GB/s · {flops/t/1e9:.2f} GFLOPS")

# Matmul: 1024 x 1024 FP32 = 2 * N^3 FLOPs
M = 1024
A, B = np.random.rand(M, M).astype(np.float32), np.random.rand(M, M).astype(np.float32)
t = bench(lambda: A @ B)
flops = 2 * M**3
print(f"matmul {M}x{M}: {t*1000:.2f} ms · {flops/t/1e9:.1f} GFLOPS")
print(f"intensity matmul = {flops / (3*M*M*4):.1f} FLOPs/byte (compute-bound)")
print(f"intensity add    = {1*N / (3*N*4):.3f} FLOPs/byte (memory-bound)")
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Bir kez ısınan (cache priming, branch predictor yerleşmesi) sonra <code>perf_counter</code> ile 5 çalışmayı ortalayan bir <code>bench</code> yardımcısı tanımlar — GPU'da Nsight Compute'un kullandığı aynı enstrümantasyon deseni. 2) Elementwise add için 16M FP32 eleman kurar — toplam bellek trafiği = 2 okuma × 64MB + 1 yazma × 64MB = 192MB; FLOP sayısı = 16M (eleman başına bir add). AI = 16M / (3 · 16M · 4) = 1/12 FLOPs/byte — roofline'ın memory-bound bölgesinde tam ortada. 3) Modern CPU'larda vektörize edilmiş SIMD'e dispatch eden <code>np.add</code> aracılığıyla add'i zamanlar — ölçülen GB/s tüketici DDR4/DDR5'te ~30-60 GB/s'ye ulaşır, peak bellek BW'sinin ~%80'i; CPU compute-bound işte 100+ GFLOPS yapabilmesine rağmen GFLOPS tek hanede kalır. 4) 1024² FP32 matmul'unu zamanlar (2·1024³ ≈ 2.15 GFLOP aritmetik, 12MB ağırlık) — AI ≈ 178, derin compute-bound; numpy'nin @'i register blocking + cache tiling + AVX-512/NEON SIMD kullanan BLAS GEMM'e dispatch eder. 5) Her iki ulaşılan arithmetic intensity'yi yazdırır — matmul'un AI'si add'inkinin >2000x'idir, GPU'ların ve CPU'ların her ikisinin de transistor bütçelerini neden matmul'a harcadığını tam olarak gösterir: bant genişliğinin darboğaz olmaktan çıktığı tek op'tur.</p>

<p class="l-text">Bu script dersin merkezi iddiasını somutlaştırır: elementwise add tek haneli GFLOPS elde eder çünkü bandwidth-bound, matmul ise yüzlerce GFLOPS'a ulaşır çünkü compute-bound. GPU'da aynı ikilik "boşa giden donanım"dan "%98 peak"i ayırır. Ders 2 GPU tarafını yazmaya başlıyor.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. H100 vs A100 roofline (görsel)</h2>
<p class="l-text">Roofline grafiği, elde edilebilir performansı aritmetik yoğunluğa (yüklenen byte başına FLOP) karşı çizer. Ridge'in altında memory-bound olursunuz (eğim = HBM bant genişliği); üstünde ise compute-bound (peak FLOP'ta düz çizgi). H100'ün daha yüksek HBM'i ve FP16/BF16 tavanı iki çizgiyi de yukarı kaydırır.</p>
<div id="plot-gpu-l1-roofline-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> SAXPY ve SpMV bant genişliği eğimi üzerinde yaşar — daha hızlı çekirdek eklemek onlara hiçbir şey yapmaz. GEMM-large düz çatıda oturur — tensor core'lar burada önemlidir. ~295 FLOP/byte civarındaki ridge (H100, bf16) her kernel yazarının bilmesi gereken eşiktir.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Buradan Nereye Gidiyoruz</h2>
<p class="l-text">Artık haritaya sahipsiniz: bir GPU, veri taşımanın üzerinde hesaplamadan daha pahalı olduğu bir bellek piramidi tarafından beslenen, her biri çok sayıda warp çalıştıran çok sayıda SM'dir. Bu track'in geri kalanı bu haritayı koda dönüştürür. Ders 2 ilk CUDA kernel'inizi yazar (vector add, "hello world"). Ders 3 belleğe saldırıyor: birleşik erişim, paylaşılan-bellek tile'lama, bank çakışmaları. Ders 4 Numba ve CuPy aracılığıyla Python'i getiriyor. Ders 5 Triton'ı tanıtıyor; OpenAI'nin özel kernel yazmanın modern yolu haline gelen Python DSL'i. Ders 6 LLM çağının en etkili tek GPU kernel'i FlashAttention'ı parçalıyor. Ders 7 çok sayıda GPU'ya ölçeklendiriyor (DDP / FSDP / NCCL). Ders 8 hepsini bir çıkarım sunucusunda bir araya getiriyor (vLLM / PagedAttention / sürekli batching).</p>

<p class="l-text">Bu dersten sadece üç sayı hatırlayacaksanız: <strong>3.35 TB/s</strong> (H100 HBM bant genişliği - hız limiti), <strong>989 TFLOPS bf16</strong> (H100 peak - tavan) ve <strong>295 FLOPs/byte</strong> (ridge point - memory-bound ile compute-bound arasındaki sınır). 2-8. derslerdeki her optimizasyon kararı şundan ibarettir: o ridge'in üstünde miyim altında miyim ve nasıl hareket edebilirim?</p>
</div>`
};
