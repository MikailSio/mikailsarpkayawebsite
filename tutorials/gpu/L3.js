window.GPU_L3 = {
en: `<p class="l-text"><strong>The fastest correct kernel and the slowest correct kernel can differ by 50x — and the difference is almost always how they touch memory.</strong> Two kernels that compute the same answer can run at 60 GB/s or 3000 GB/s on the same H100. The fast one reads contiguous bytes per warp, reuses tiles in shared memory, and avoids bank conflicts. The slow one stride-reads HBM, ignores shared memory, and serializes 32 threads through 1 bank. This lesson is the single most important one in the track for raw performance: every kernel-tuning trick the rest of the world uses is a variation of "make memory accesses coalesced and reuse tiles".</p>

<p class="l-text">We cover four optimizations in order of impact: <strong>coalesced global memory access</strong> (cheapest to get right, often gives 5–10x), <strong>shared memory tiling</strong> (the matmul / convolution / attention trick — turns reads-per-FLOP from O(N) into O(1)), <strong>bank conflicts</strong> (the subtle gotcha inside shared memory), and <strong>register pressure / occupancy tradeoffs</strong> (Volkov-style aggressive register tiling). Every concept gets a NumPy demo where you can see <em>what</em> the kernel computes, even if you cannot run the actual CUDA on Pyodide.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recognize coalesced vs strided global memory access patterns and rewrite the bad ones</li>
<li>Apply shared-memory tiling to matmul, convolution, and reductions</li>
<li>Detect and avoid bank conflicts (the +1 padding trick)</li>
<li>Trade register count for occupancy and decide which to favor for a given kernel</li>
<li>Use the Nsight Compute Occupancy Calculator (offline form) to plan a kernel</li>
<li>Estimate the bandwidth-limited and compute-limited ceilings for your kernel</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Coalesced Memory Access — The Single Biggest Lever</h2>
<p class="l-text">When a warp of 32 threads issues a global-memory load, the hardware merges the 32 addresses into the smallest number of 32/64/128-byte transactions possible. If all 32 threads read 32 consecutive floats, that is one 128-byte transaction — perfect coalescing, full bandwidth. If they read 32 floats with a stride of 32 (i.e., element <em>i</em> reads address <em>32×i</em>), the hardware issues 32 separate 128-byte transactions, fetches 32×128=4096 bytes, and uses only 128 of them — a 32x bandwidth waste.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Coalesced (good)</div><div class="card-body"><code>x[threadIdx.x]</code> — thread 0 reads x[0], thread 1 reads x[1], ..., thread 31 reads x[31]. One 128-byte transaction. Full bandwidth.</div></div>
<div class="calc-card"><div class="card-title">Strided (bad)</div><div class="card-body"><code>x[threadIdx.x * 32]</code> — thread 0 reads x[0], thread 1 reads x[32], etc. 32 separate transactions, 1/32 effective bandwidth.</div></div>
<div class="calc-card"><div class="card-title">Random (worst)</div><div class="card-body"><code>x[idx[threadIdx.x]]</code> with random indices — fully gather load, no coalescing. Use texture cache or sort indices first.</div></div>
</div>

<p class="l-text">The fix for strides is almost always <strong>storing your data the right way</strong>. If you find yourself accessing row <em>r</em>, column <em>c</em> with <code>A[r * N_cols + c]</code> and threads vary in <em>r</em>, you are striding through memory. Either transpose the matrix, or have threads vary in <em>c</em> (which puts consecutive threads on consecutive addresses).</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// BAD: threads stride through HBM (column traversal of row-major matrix)
__global__ void col_sum_bad(const float* A, float* out, int H, int W) {
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    if (col &gt;= W) return;
    float s = 0.f;
    for (int row = 0; row &lt; H; ++row) s += A[row * W + col];   // stride W
    out[col] = s;
}

// GOOD: threads cooperate within a row, then reduce across rows
// (or transpose A first so columns become contiguous)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>col_sum_bad</code> launches one thread per column — thread <code>col</code> sweeps all H rows of column <code>col</code> in a row-major matrix. 2) Inside the loop, each thread reads <code>A[row * W + col]</code> where <code>row</code> changes but <code>col</code> stays fixed, so consecutive threads (col, col+1, col+2 …) access addresses that are <code>W*4</code> bytes apart — a stride of W. 3) The HBM controller serves data in 128-byte transactions; a 32-thread warp here triggers 32 separate transactions instead of 1, wasting ~96% of the bandwidth it pays for. 4) The "good" comment hints at the fix: either flip the role of threads so they cooperate across columns within a row (consecutive addresses), or transpose A so the inner stride becomes 1.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide demo — measure stride cost on the CPU (same principle)</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

H, W = 4096, 4096
A = np.random.rand(H, W).astype(np.float32)

# Coalesced (row major, sum along axis=1 — contiguous reads)
t0 = time.perf_counter()
row_sums = A.sum(axis=1)
t_row = time.perf_counter() - t0

# Strided (sum along axis=0 — every read jumps W*4 bytes)
t0 = time.perf_counter()
col_sums = A.sum(axis=0)
t_col = time.perf_counter() - t0

print(f"sum axis=1 (contiguous): {t_row*1000:.2f} ms")
print(f"sum axis=0 (strided)   : {t_col*1000:.2f} ms")
print(f"slowdown ratio         : {t_col/t_row:.2f}x")
print("On a GPU the same pattern produces a much larger gap (often 10-30x).")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Allocates a 4096×4096 FP32 matrix (64 MB) — large enough to exceed all CPU caches so the measurement reflects true DRAM behaviour. 2) Sums along axis=1 — for each row, NumPy walks contiguous bytes, so the CPU prefetcher saturates the bus; this is the coalesced analog. 3) Sums along axis=0 — for each column, every read jumps <code>W*4 = 16384</code> bytes to the next row, defeating prefetch and forcing one cache-line miss per element; this is the strided analog. 4) Prints the ratio so you can see CPU strided-vs-contiguous is typically 3-6x; the same code on a GPU widens to 10-30x because the warp serialization (32 transactions instead of 1) is harsher than the CPU's prefetcher tolerance.</p>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Shared Memory Tiling — Reuse Beats Bandwidth</h2>
<p class="l-text">Naive matmul reads each element of A and B many times from HBM. A C[i,j] = Σ A[i,k]*B[k,j] inner loop reads N values from each row of A and each column of B per output. Across N² outputs that is N³ reads of A and N³ reads of B — total 2N³ HBM reads for 2N³ FLOPs. Arithmetic intensity = 1, deeply memory-bound, useless on a GPU.</p>

<p class="l-text">The fix is <strong>tiling</strong>. Each block computes a small TILE×TILE patch of C. It loads a TILE×TILE tile of A and a TILE×TILE tile of B into shared memory, then has all threads in the block compute their share of the output using the cached tiles. With TILE=32, every value loaded is reused 32 times — arithmetic intensity jumps from 1 to 32, and you reach 50–80% of peak FLOPS instead of single-digit %.</p>

<div class="katex-block">$$\\text{intensity}_{\\text{naive matmul}} = 1, \\quad \\text{intensity}_{\\text{tiled matmul}} = O(\\text{TILE})$$</div>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO — classic tiled matmul)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>#define TILE 32
__global__ void matmul_tiled(const float* A, const float* B, float* C, int N) {
    __shared__ float As[TILE][TILE];
    __shared__ float Bs[TILE][TILE];

    int row = blockIdx.y * TILE + threadIdx.y;
    int col = blockIdx.x * TILE + threadIdx.x;
    float acc = 0.f;

    for (int t = 0; t &lt; N / TILE; ++t) {
        // each thread loads ONE element of As and ONE of Bs (cooperative load)
        As[threadIdx.y][threadIdx.x] = A[row * N + (t * TILE + threadIdx.x)];
        Bs[threadIdx.y][threadIdx.x] = B[(t * TILE + threadIdx.y) * N + col];
        __syncthreads();

        // every thread reuses the cached tiles TILE times
        for (int k = 0; k &lt; TILE; ++k) acc += As[threadIdx.y][k] * Bs[k][threadIdx.x];
        __syncthreads();
    }
    C[row * N + col] = acc;
}
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Declares two <code>__shared__</code> tiles <code>As[32][32]</code> and <code>Bs[32][32]</code> (8 KB total) — fast SM-local SRAM that all 1024 threads in the block can read. 2) Each thread computes its own (row, col) for the 32×32 output patch, plus a private accumulator <code>acc</code> in a register. 3) The outer loop walks the K dimension in tiles of 32; in each iteration every thread <em>cooperatively</em> loads ONE element of A and ONE of B into its slot of As/Bs — 1024 threads load 1024 distinct elements from HBM in one coalesced transaction, then <code>__syncthreads()</code> guarantees the tile is complete. 4) The inner k-loop runs 32 times: every thread reads its row of As and the col-th column of Bs from shared memory (~1 cycle each) and accumulates 32 multiply-adds — every HBM byte is reused TILE=32 times, lifting arithmetic intensity from 1 to 32 and pushing the kernel above H100's 295 ridge into compute-bound territory. 5) The trailing <code>__syncthreads()</code> prevents the next iteration's loads from overwriting tiles still in use.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent — manual tiling in NumPy</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N, TILE = 256, 32
A = np.random.rand(N, N).astype(np.float32)
B = np.random.rand(N, N).astype(np.float32)
C = np.zeros((N, N), dtype=np.float32)

# Tiled matmul — exactly what the GPU kernel does, in three loops
for bi in range(0, N, TILE):                  # block row
    for bj in range(0, N, TILE):              # block col
        acc = np.zeros((TILE, TILE), dtype=np.float32)
        for bk in range(0, N, TILE):          # tile k
            As = A[bi:bi+TILE, bk:bk+TILE]    # "load As tile to shared mem"
            Bs = B[bk:bk+TILE, bj:bj+TILE]    # "load Bs tile to shared mem"
            acc += As @ Bs                     # reuse tiles TILE times
        C[bi:bi+TILE, bj:bj+TILE] = acc

ref = A @ B
print(f"max abs err: {np.max(np.abs(C - ref)):.2e}")
print(f"FLOPs total  : {2*N**3:,}")
print(f"HBM reads naive : ~{2*N**3:,} (each element re-read N times)")
print(f"HBM reads tiled : ~{2*N*N * (N//TILE):,} (each tile loaded once per k step)")
print(f"reuse factor   : ~{TILE}x — pushes intensity above the H100 ridge point")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up a 256×256 matmul with TILE=32 — same tile size as the CUDA kernel, so the analogy is one-to-one. 2) The three nested loops (bi, bj, bk) play the role of the GPU grid (bi, bj) and the kernel's outer k-loop (bk); the body slices a TILE×TILE patch of A and B and uses NumPy's <code>@</code> as the local matmul that stands in for the inner-k cooperative tile reuse. 3) Accumulates into a <code>(TILE, TILE)</code> local acc — exactly the role of the per-thread register accumulator <code>acc</code> in CUDA, just promoted from scalar to tile because NumPy is one CPU. 4) Compares against <code>A @ B</code> reference and prints the read counts: naive matmul reads 2N³ ≈ 33M elements, tiled matmul reads only 2N²·(N/TILE) ≈ 1M elements — TILE=32x fewer HBM reads, which is precisely the reuse factor that turns the kernel from memory-bound into compute-bound.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bank Conflicts — Shared Memory Has Lanes Too</h2>
<p class="l-text">Shared memory on modern GPUs is 32 banks wide, 4 bytes per bank, interleaved by word. If 32 threads of a warp access 32 different banks, the access takes 1 cycle. If two threads hit the same bank with different addresses, the access is serialized — a <strong>bank conflict</strong>. With TILE=32 stored as <code>__shared__ float As[32][32]</code>, accessing column-wise (<code>As[i][threadIdx.x]</code> across threadIdx.y) puts every thread on bank 0 — 32-way conflict, 32x slowdown.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No conflict</div><div class="card-body">All 32 threads read the same address (broadcast) — 1 cycle. Or all read distinct banks — 1 cycle.</div></div>
<div class="calc-card"><div class="card-title">2-way conflict</div><div class="card-body">Two threads hit the same bank — 2 cycles. <em>n</em>-way conflict — <em>n</em> cycles.</div></div>
<div class="calc-card"><div class="card-title">The +1 padding trick</div><div class="card-body"><code>__shared__ float As[32][33];</code> — adds one column of padding so column-wise access strides through different banks. Costs 32 floats of shared memory; eliminates the conflict.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// BEFORE — column access causes 32-way bank conflict
__shared__ float As[32][32];
float v = As[threadIdx.x][threadIdx.y];   // every warp lane on same bank

// AFTER — pad to 33 columns; column access now strides through banks
__shared__ float As[32][33];
float v = As[threadIdx.x][threadIdx.y];   // bank index = (33*x + y) mod 32 → distinct
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The BEFORE block declares <code>As[32][32]</code>; reading <code>As[threadIdx.x][threadIdx.y]</code> swaps the role of x and y so consecutive warp lanes (varying threadIdx.x, fixed threadIdx.y) compute bank indices <code>(32*x + y) % 32 = y</code> — every lane lands on the same bank, a 32-way conflict that serializes the access into 32 cycles. 2) The AFTER block changes the declaration to <code>As[32][33]</code> — one extra float per row of padding. 3) Now the bank index is <code>(33*x + y) % 32</code>; because <code>gcd(33, 32) = 1</code>, the 32 lanes touch 32 distinct banks, restoring single-cycle access. 4) The fix costs 32 floats of shared memory (128 B) per row and zero runtime cycles — the cheapest 32x speedup you will ever ship.</p>

<div class="calc-highlight"><strong>The lesson:</strong> any time you store a 2D tile in shared memory and access it both row-wise and column-wise, pad the inner dimension by 1. This is so common that NVIDIA's matmul samples literally always use <code>+1</code>. Modern Triton (lesson 5) hides this automatically, which is one reason it has displaced raw CUDA for kernel writing.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Register Pressure — More Registers, Fewer Warps</h2>
<p class="l-text">Each thread has a budget of registers (architecture-dependent — H100: up to 255 per thread). Use too many and the compiler "spills" to L1/local memory, which is ~10x slower. Use too few and you cannot keep enough partial results around for instruction-level parallelism. The total register file is fixed (256 KB per SM on H100), so register count per thread × threads per SM ≤ 65,536. More registers per thread → fewer threads → lower occupancy.</p>

<div class="katex-block">$$\\text{threads}_{\\text{SM}} = \\min\\left(\\frac{\\text{regs}_{\\text{SM}}}{\\text{regs}_{\\text{thread}}},\\; \\text{max threads}\\right)$$</div>

<p class="l-text">Two strategies fight here. <strong>High occupancy</strong>: keep registers per thread low, fit lots of warps per SM, hide memory latency by oversubscription. <strong>High ILP / low occupancy</strong>: use lots of registers per thread to keep many partial sums live, exploit instruction-level parallelism even with fewer warps. Volkov's classic 2010 paper "Better Performance at Lower Occupancy" showed the second strategy can win by 2x on matmul. Modern matmul (CUTLASS) and FlashAttention both use it: ~25% occupancy, ~128 registers per thread, very wide register tiles.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">High occupancy regime</div><div class="card-body">≤32 regs/thread, 75–100% occupancy. Good for memory-bound kernels (elementwise, pointwise norms). Lots of warps to hide HBM stalls.</div></div>
<div class="calc-card"><div class="card-title">Low occupancy / high ILP</div><div class="card-body">128+ regs/thread, 25–50% occupancy. Good for compute-bound kernels with reuse (matmul, attention). Wide register tile = high arithmetic intensity per warp.</div></div>
<div class="calc-card"><div class="card-title">How to control</div><div class="card-body"><code>__launch_bounds__(maxThreadsPerBlock, minBlocksPerSM)</code> and <code>nvcc -maxrregcount=N</code>. Profile with Nsight Compute "Source" tab to see register spills.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Occupancy Calculator</h2>
<p class="l-text">For any (block_size, regs_per_thread, shared_mem_per_block, architecture), the occupancy calculator tells you how many blocks/warps fit on an SM. Old versions were a spreadsheet; modern Nsight Compute computes it live and Triton's autotune searches over it.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Occupancy calculator for H100 (sm_90)
# Limits: 64 warps/SM, 256 KB regs/SM, 228 KB smem/SM, 32 blocks/SM max

def occupancy(block_size, regs_per_thread, smem_per_block_kb):
    MAX_WARPS_SM   = 64
    MAX_REGS_SM    = 65536          # 32-bit registers
    MAX_SMEM_SM_KB = 228
    MAX_BLOCKS_SM  = 32

    if block_size % 32: raise ValueError("block size must be multiple of 32")
    warps_per_block = block_size // 32

    # Limits
    by_warps  = MAX_WARPS_SM   // warps_per_block
    by_regs   = MAX_REGS_SM    // (regs_per_thread * block_size)
    by_smem   = MAX_SMEM_SM_KB // smem_per_block_kb if smem_per_block_kb &gt; 0 else 1e9
    by_blocks = MAX_BLOCKS_SM

    blocks_per_sm = min(by_warps, by_regs, by_smem, by_blocks)
    active_warps  = blocks_per_sm * warps_per_block
    occ           = active_warps / MAX_WARPS_SM
    return blocks_per_sm, active_warps, occ

# Three example kernels
for name, (b, r, s) in {
    "elementwise add"      : (256,  20, 0),
    "tiled matmul (TILE=32)": (256,  64, 8),
    "FlashAttention-style"  : (128, 128, 48),
}.items():
    blocks, warps, occ = occupancy(b, r, s)
    print(f"{name:25s} block={b}  regs={r}  smem={s}KB  -&gt;  blocks/SM={blocks}  warps/SM={warps}  occupancy={occ:.0%}")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Hardcodes the four real H100 sm_90 limits — 64 active warps/SM, 65,536 registers/SM, 228 KB shared memory/SM, 32 blocks/SM — exactly the same numbers the official CUDA Occupancy Calculator uses. 2) For a given <code>(block_size, regs/thread, smem KB/block)</code> it computes four ceilings independently: how many blocks fit by warp count, by register file, by shared memory, and by the hard block cap; then takes the minimum — the actual limiting resource. 3) Multiplies blocks/SM by warps/block to get active warps, and divides by 64 to get the occupancy fraction. 4) Runs three canonical examples: an elementwise add (regs-bound but reaches near 100% — memory-bound kernels want high occupancy to hide HBM latency), tiled matmul (256 threads × 64 regs + 8 KB smem — comfortable middle), and a FlashAttention-style kernel (128 threads × 128 regs + 48 KB smem) — the last drops to ~25% on purpose because the wide register tile is what gives it speed, not high warp count.</p>

<p class="l-text">Notice FlashAttention deliberately runs at 25% occupancy — the regs and shared memory it uses are the source of its speed, not a flaw. Treat the calculator as a diagnostic, not a target.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pinned Memory and Async Copies</h2>
<p class="l-text">Even before the kernel runs, you spend time copying. By default, host memory is pageable — the kernel can move it around. CUDA must first copy pageable memory to a hidden pinned buffer before DMAing it to the GPU, doubling the cost. <strong>Pinned host memory</strong> (<code>cudaMallocHost</code>) bypasses this: it is permanently page-locked, so the GPU can DMA it directly. Speed-up is typically 2x for transfer-heavy code.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>float *h_a;
cudaMallocHost(&amp;h_a, bytes);              // pinned host alloc
// ... fill h_a ...

cudaStream_t s; cudaStreamCreate(&amp;s);
cudaMemcpyAsync(d_a, h_a, bytes, cudaMemcpyHostToDevice, s);
my_kernel&lt;&lt;&lt;grid, block, 0, s&gt;&gt;&gt;(d_a, ...);
cudaMemcpyAsync(h_out, d_out, bytes, cudaMemcpyDeviceToHost, s);
cudaStreamSynchronize(s);
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>cudaMallocHost(&amp;h_a, bytes)</code> allocates page-locked (pinned) RAM — the OS cannot swap or move it, so the GPU's DMA engine can transfer directly from physical addresses without the staging-buffer copy required for pageable memory. 2) <code>cudaStreamCreate(&amp;s)</code> opens a non-default CUDA stream — work queued on a non-zero stream runs concurrently with work on other streams instead of serializing through stream 0. 3) The async memcpy returns immediately and queues a DMA H2D transfer on stream <code>s</code>. 4) The kernel launch on stream <code>s</code> (note the fourth <code>&lt;&lt;&lt; , , 0, s&gt;&gt;&gt;</code> arg) also queues — the CUDA driver respects the stream ordering, so the kernel will not start before the H2D finishes, but it does not block the host either. 5) The trailing async D2H copy queues behind the kernel, and finally <code>cudaStreamSynchronize(s)</code> is the only blocking call, waiting for the whole pipeline to drain — perfect setup for overlapping batches across multiple streams.</p>

<p class="l-text">With async copies on multiple streams you can <em>overlap</em> H2D copy of batch <em>n+1</em>, kernel of batch <em>n</em>, and D2H copy of batch <em>n−1</em> — three things happening at once. PyTorch's <code>DataLoader(pin_memory=True)</code> + <code>non_blocking=True</code> .to(device) does exactly this.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Profiling — Nsight Compute and ncu</h2>
<p class="l-text">You cannot tune what you do not measure. NVIDIA's profiler stack is dense but indispensable. Two tools cover 90% of practitioner needs:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Nsight Systems (<code>nsys</code>)</div><div class="card-body">Timeline view: kernel launches, memcpy, CPU/GPU sync, NVLink/NCCL traffic. Use this to find <em>where time goes</em> across a whole training step. <code>nsys profile python train.py</code>.</div></div>
<div class="calc-card"><div class="card-title">Nsight Compute (<code>ncu</code>)</div><div class="card-body">Per-kernel deep dive: occupancy, memory throughput, stall reasons, source-line attribution. Use this to tune <em>one</em> kernel. <code>ncu --set full -k my_kernel ./a.out</code>.</div></div>
<div class="calc-card"><div class="card-title">PyTorch Profiler</div><div class="card-body"><code>torch.profiler</code> wraps both, exports Chrome trace and TensorBoard. The first thing to reach for inside Python.</div></div>
</div>

<p class="l-text">Key Nsight Compute metrics to read first: <code>sm__throughput.avg.pct_of_peak_sustained_elapsed</code> (compute utilization), <code>dram__bytes.sum.per_second</code> (HBM bandwidth), <code>smsp__warps_active.avg.pct_of_peak_sustained_active</code> (occupancy), and "Memory Workload Analysis → Coalesced" (whether your loads are coalesced).</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Putting It Together — Reduction with Warp Shuffles</h2>
<p class="l-text">A modern reduction uses <code>__shfl_down_sync</code> — a warp-internal instruction that lets thread <em>i</em> read thread <em>i+s</em>'s register without going through shared memory. Combined with shared memory across warps and atomic add at the end, this delivers within 5% of HBM bandwidth on H100.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO — modern reduction)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>__inline__ __device__ float warp_reduce(float v) {
    for (int s = 16; s &gt; 0; s &gt;&gt;= 1) v += __shfl_down_sync(0xffffffff, v, s);
    return v;   // lane 0 has the warp sum
}

__global__ void reduce_sum(const float* x, float* out, int N) {
    __shared__ float warp_sums[32];      // up to 32 warps per block
    int tid = threadIdx.x;
    int i   = blockIdx.x * blockDim.x + tid;
    float v = (i &lt; N) ? x[i] : 0.f;

    v = warp_reduce(v);
    int lane = tid &amp; 31;
    int wid  = tid &gt;&gt; 5;
    if (lane == 0) warp_sums[wid] = v;
    __syncthreads();
    if (wid == 0) {
        v = (tid &lt; (blockDim.x + 31) / 32) ? warp_sums[lane] : 0.f;
        v = warp_reduce(v);
        if (lane == 0) atomicAdd(out, v);
    }
}
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>warp_reduce</code> is an inline device function that performs a tree sum across all 32 lanes of a warp using <code>__shfl_down_sync(0xffffffff, v, s)</code> — a register-to-register shuffle that lets lane <em>i</em> read lane <em>i+s</em>'s value in one cycle without touching shared memory; the mask <code>0xffffffff</code> declares all 32 lanes participate. 2) After log2(32)=5 halvings (s=16,8,4,2,1) lane 0 holds the warp sum. 3) In the main kernel each thread loads one element (with the zero-fill bound check) and runs <code>warp_reduce</code> — now we have one partial per warp. 4) Lane 0 of each warp writes its partial to <code>warp_sums[wid]</code> in shared memory; <code>__syncthreads()</code> publishes those across all warps. 5) Only warp 0 (<code>wid == 0</code>) reads the per-warp partials back, runs another <code>warp_reduce</code> across them, and lane 0 does <code>atomicAdd(out, v)</code> — one atomic per block, which on H100 reaches ~95% of HBM bandwidth because the shuffle path eliminates the shared-memory tree of the old reduction.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide demo — bandwidth ceiling intuition</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

# Reduction is bandwidth-bound — only reads, no reuse possible.
# Best achievable on H100: HBM bw / 4 bytes per FP32 element = 837 Gelems/s.
N = 50_000_000
x = np.random.rand(N).astype(np.float32)

t0 = time.perf_counter()
s = x.sum()
elapsed = time.perf_counter() - t0

print(f"NumPy sum N={N:,}: {elapsed*1000:.2f} ms · {N*4/elapsed/1e9:.1f} GB/s")
print(f"H100 ceiling: {3.35e12*1e-9:.0f} GB/s -&gt; would do this in {N*4/3.35e12*1e3:.2f} ms")
print("Modern CUB reduction reaches ~95% of HBM bandwidth.")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a 50M-element FP32 array (200 MB) — large enough that the answer is dominated by HBM read time, not kernel-launch overhead. 2) <code>x.sum()</code> in NumPy lowers to a single BLAS-equivalent pass; we time it with <code>perf_counter</code> and divide bytes by elapsed to read off achieved bandwidth in GB/s. 3) Compares that achieved throughput to H100's peak 3.35 TB/s HBM3 ceiling and prints how long the sum <em>would</em> take if it ran at peak (~0.06 ms) — a useful contrast against the CPU's 20-100 GB/s. 4) Prints the closing reminder that modern <code>cub::DeviceReduce::Sum</code> on real hardware reaches ~95% of that ceiling, which is why no one writes hand-rolled reductions anymore.</p>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Ten Rules to Take to the Next Lesson</h2>
<p class="l-text">Memory optimization is the bulk of practical GPU work. Lesson 4 (Numba/CuPy) and lesson 5 (Triton) hide much of this, but the underlying rules still apply — they decide whether your high-level kernel runs at 1% or 90% of peak.</p>

<div class="calc-highlight">
<strong>Optimization checklist (in priority order):</strong><br>
(1) Are loads coalesced? Threads of a warp must read consecutive addresses.<br>
(2) Is data reused? If yes, tile it into shared memory.<br>
(3) Are shared memory accesses bank-conflict-free? Pad inner dim by 1.<br>
(4) Are kernels fused? Don't write→HBM→read→HBM between simple ops.<br>
(5) Is host↔device copy minimized? Keep tensors on the GPU across many ops.<br>
(6) Is pinned memory used for the H2D copies you can't avoid?<br>
(7) Is occupancy reasonable (≥25%)? Use <code>ncu</code> to check.<br>
(8) Are atomics minimized? Atomic-heavy kernels serialize.<br>
(9) Are FP16/BF16 used where possible? Halves the bytes moved.<br>
(10) Have you actually profiled with Nsight Compute? Don't guess.
</div>

<p class="l-text">Lesson 4 jumps to Python — Numba's <code>@cuda.jit</code> and CuPy's drop-in NumPy API. Both compile down to the same SASS we have been targeting; the conventions of this lesson all carry over.</p>
</div>`,
tr: `<p class="l-text"><strong>En hızlı doğru kernel ile en yavaş doğru kernel 50x farklı olabilir; ve fark neredeyse her zaman belleğe nasıl dokundukları.</strong> Aynı cevabı hesaplayan iki kernel aynı H100'de 60 GB/s veya 3000 GB/s'de çalışabilir. Hızlı olan, warp başına ardışık byte'lar okur, paylaşılan bellekte tile'ları yeniden kullanır ve bank çakışmalarından kaçınır. Yavaş olan, HBM'yi adım adım okur, paylaşılan belleği görmezden gelir ve 32 thread'i 1 bank üzerinden serileştirir. Bu ders ham performans için track'teki en önemli derstir: dünyanın geri kalanının kullandığı her kernel-tune hilesi "bellek erişimlerini birleşik yap ve tile'ları yeniden kullan"in bir varyasyonudur.</p>

<p class="l-text">Etki sırasına göre dört optimizasyonu kapsıyoruz: <strong>birleşik global bellek erişimi</strong> (en ucuz doğru yapılan, sık sık 5-10x verir), <strong>paylaşılan bellek tile'lama</strong> (matmul / convolution / attention hilesi — FLOP başına okumaları O(N)'den O(1)'e çevirir), <strong>bank çakışmaları</strong> (paylaşılan bellek içindeki ince tuzak) ve <strong>register baskısı / doluluk takasları</strong> (Volkov tarzı agresif register tile'lama). Her kavram, kernel'in <em>ne hesapladığını</em> görebileceğiniz bir NumPy demo'su alır, gerçek CUDA'yi Pyodide'da çalıştıramasanız bile.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Birleşik vs adımlı global bellek erişim örnekleri tanımaya ve kötüleri yeniden yazmaya</li>
<li>Matmul, convolution ve reduction'lara paylaşılan bellek tile'lama uygulamaya</li>
<li>Bank çakışmalarını tespit edip kaçınmaya (+1 padding hilesi)</li>
<li>Register sayısını doluluk ile takas etmeye ve verilen bir kernel için hangisini tercih edeceğinize karar vermeye</li>
<li>Bir kernel planlamak için Nsight Compute Occupancy Calculator (çevrimdışı form) kullanmaya</li>
<li>Kernel'iniz için bant-genişliği-sınırlı ve compute-sınırlı tavanları tahmin etmeye</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Birleşik Bellek Erişimi — En Büyük Tek Kaldıracı</h2>
<p class="l-text">32 thread'lik bir warp global bellek yüklenmesi yayınladığında, donanım 32 adresi mümkün olan en az 32/64/128-byte işlemine birleştirir. Eğer 32 thread'in tümü 32 ardışık float okursa, bu bir 128-byte işlemidir — mükemmel coalescing, tam bant genişliği. Eğer 32 stride ile 32 float okurlarsa (yani <em>i</em> elemanı <em>32×i</em> adresini okur), donanım 32 ayrı 128-byte işlemi yayınlar, 32×128=4096 byte getirir ve sadece 128'ini kullanır — 32x bant genişliği israfı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Birleşik (iyi)</div><div class="card-body"><code>x[threadIdx.x]</code> — thread 0 x[0]'i okur, thread 1 x[1]'i okur, ..., thread 31 x[31]'i okur. Tek 128-byte işlem. Tam bant genişliği.</div></div>
<div class="calc-card"><div class="card-title">Adımlı (kötü)</div><div class="card-body"><code>x[threadIdx.x * 32]</code> — thread 0 x[0]'i okur, thread 1 x[32]'yi okur vb. 32 ayrı işlem, 1/32 etkili bant genişliği.</div></div>
<div class="calc-card"><div class="card-title">Rastgele (en kötü)</div><div class="card-body">Rastgele indekslerle <code>x[idx[threadIdx.x]]</code> — tamamen gather load, coalescing yok. Texture cache kullanın veya indeksleri önce sıralayın.</div></div>
</div>

<p class="l-text">Stride'lar için düzeltme neredeyse her zaman <strong>verilerinizi doğru şekilde saklamaktır</strong>. <em>r</em> satıra <code>A[r * N_cols + c]</code> ile <em>c</em> sütunundan eriştiğinizi ve thread'lerin <em>r</em>'de değiştiğini bulursanız, bellekte stride yapıyorsunuz. Ya matrisi devirin ya da thread'leri <em>c</em>'de değiştirin (bu, ardışık thread'leri ardışık adreslere koyar).</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// BAD: threads stride through HBM (column traversal of row-major matrix)
__global__ void col_sum_bad(const float* A, float* out, int H, int W) {
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    if (col &gt;= W) return;
    float s = 0.f;
    for (int row = 0; row &lt; H; ++row) s += A[row * W + col];   // stride W
    out[col] = s;
}

// GOOD: threads cooperate within a row, then reduce across rows
// (or transpose A first so columns become contiguous)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>col_sum_bad</code> sütun başına bir thread başlatır — thread <code>col</code> row-major bir matriste <code>col</code> sütununun tüm H satırını süpürür. 2) Loop içinde her thread <code>A[row * W + col]</code> okur; <code>row</code> değişir ama <code>col</code> sabit kalır, böylece ardışık thread'ler (col, col+1, col+2…) birbirinden <code>W*4</code> byte uzakta adreslere erişir — W stride'ı. 3) HBM denetleyicisi veriyi 128-byte transaksiyonlarda sunar; burada 32-thread'lik bir warp 1 yerine 32 ayrı transaksiyonu tetikler, ödediği bant genişliğinin ~%96'sını boşa harcar. 4) "good" yorumu çözümü işaret eder: ya thread'lerin rolünü çevirip bir satır içinde sütunlar boyunca işbirliği yapmasını sağlayın (ardışık adresler), ya da A'yı devirip iç stride'ı 1 yapın.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide demo — CPU'da stride maliyetini ol (aynı prensip)</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

H, W = 4096, 4096
A = np.random.rand(H, W).astype(np.float32)

# Coalesced (row major, sum along axis=1 — contiguous reads)
t0 = time.perf_counter()
row_sums = A.sum(axis=1)
t_row = time.perf_counter() - t0

# Strided (sum along axis=0 — every read jumps W*4 bytes)
t0 = time.perf_counter()
col_sums = A.sum(axis=0)
t_col = time.perf_counter() - t0

print(f"sum axis=1 (contiguous): {t_row*1000:.2f} ms")
print(f"sum axis=0 (strided)   : {t_col*1000:.2f} ms")
print(f"slowdown ratio         : {t_col/t_row:.2f}x")
print("On a GPU the same pattern produces a much larger gap (often 10-30x).")
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) 4096×4096 FP32 matris (64 MB) tahsis eder — ölçümün gerçek DRAM davranışını yansıtmasını sağlamak için tüm CPU cache'lerini aşacak kadar büyük. 2) axis=1 boyunca toplar — her satır için NumPy ardışık byte'lar üzerinde yürür, böylece CPU prefetcher veriyolunu doyurur; bu coalesced analog. 3) axis=0 boyunca toplar — her sütun için her okuma bir sonraki satıra <code>W*4 = 16384</code> byte zıplar, prefetch'i bozar ve eleman başına bir cache-line miss zorlar; bu strided analog. 4) Oranı yazdırır, böylece CPU'da strided-vs-contiguous farkının tipik olarak 3-6x olduğunu görebilirsiniz; aynı kodu GPU'da 10-30x'e açar çünkü warp serileştirmesi (1 yerine 32 transaksiyon) CPU prefetcher'ının toleransından daha sert.</p>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Paylaşılan Bellek Tile'lama — Yeniden Kullanım Bant Genişliğini Yener</h2>
<p class="l-text">Naif matmul A ve B'nin her elemanını HBM'den birden çok kez okur. C[i,j] = Σ A[i,k]*B[k,j] iç loop'u çıktı başına A'nin her satırından ve B'nin her sütunundan N değer okur. N² çıktı boyunca bu A'nin N³ okuması ve B'nin N³ okumasıdır — toplam 2N³ HBM okuması 2N³ FLOP için. Aritmetik yoğunluk = 1, derinden memory-bound, GPU'da kullanışsız.</p>

<p class="l-text">Çözüm <strong>tile'lamadir</strong>. Her blok C'nin küçük bir TILE×TILE yamasını hesaplar. A'nin TILE×TILE tile'ini ve B'nin TILE×TILE tile'ini paylaşılan belleğe yükler, sonra bloktaki tüm thread'lerin önbelleğe alınmış tile'ları kullanarak çıktılarının payını hesaplamasını sağlar. TILE=32 ile yüklenen her değer 32 kez yeniden kullanılır; aritmetik yoğunluk 1'den 32'ye atlar ve tek haneli % yerine peak FLOPS'un %50-80'ine ulaşırsınız.</p>

<div class="katex-block">$$\\text{intensity}_{\\text{naive matmul}} = 1, \\quad \\text{intensity}_{\\text{tiled matmul}} = O(\\text{TILE})$$</div>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO — klasik tile'lı matmul)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>#define TILE 32
__global__ void matmul_tiled(const float* A, const float* B, float* C, int N) {
    __shared__ float As[TILE][TILE];
    __shared__ float Bs[TILE][TILE];

    int row = blockIdx.y * TILE + threadIdx.y;
    int col = blockIdx.x * TILE + threadIdx.x;
    float acc = 0.f;

    for (int t = 0; t &lt; N / TILE; ++t) {
        // each thread loads ONE element of As and ONE of Bs (cooperative load)
        As[threadIdx.y][threadIdx.x] = A[row * N + (t * TILE + threadIdx.x)];
        Bs[threadIdx.y][threadIdx.x] = B[(t * TILE + threadIdx.y) * N + col];
        __syncthreads();

        // every thread reuses the cached tiles TILE times
        for (int k = 0; k &lt; TILE; ++k) acc += As[threadIdx.y][k] * Bs[k][threadIdx.x];
        __syncthreads();
    }
    C[row * N + col] = acc;
}
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) İki <code>__shared__</code> tile <code>As[32][32]</code> ve <code>Bs[32][32]</code> (toplam 8 KB) ilan eder — bloktaki 1024 thread'in tümünün okuyabileceği SM-yerel hızlı SRAM. 2) Her thread 32×32 çıktı yaması için kendi (row, col)'ını hesaplar artı bir register içinde özel akümülatör <code>acc</code> tutar. 3) Dış loop K boyutunda 32'lik tile'larla yürür; her iterasyonda her thread <em>işbirlikçi</em> şekilde A'nın BİR ve B'nin BİR elemanını As/Bs slot'una yükler — 1024 thread tek bir coalesced transaksiyonda HBM'den 1024 farklı eleman çeker, sonra <code>__syncthreads()</code> tile'in tamamlandığını garanti eder. 4) İç k-loop 32 kez çalışır: her thread paylaşılan bellekten As'in kendi satırını ve Bs'in col-th sütununu okur (~1 döngü her biri) ve 32 multiply-add biriktirir — her HBM byte'ı TILE=32 kez yeniden kullanılır, aritmetik yoğunluğu 1'den 32'ye çıkarır ve kernel'i H100'ün 295 ridge noktasının üstüne, compute-bound bölgeye iter. 5) Sondaki <code>__syncthreads()</code> bir sonraki iterasyonun yüklerinin hâlâ kullanımda olan tile'ların üzerine yazmasını önler.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri — NumPy'da el ile tile'lama</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N, TILE = 256, 32
A = np.random.rand(N, N).astype(np.float32)
B = np.random.rand(N, N).astype(np.float32)
C = np.zeros((N, N), dtype=np.float32)

# Tiled matmul — exactly what the GPU kernel does, in three loops
for bi in range(0, N, TILE):                  # block row
    for bj in range(0, N, TILE):              # block col
        acc = np.zeros((TILE, TILE), dtype=np.float32)
        for bk in range(0, N, TILE):          # tile k
            As = A[bi:bi+TILE, bk:bk+TILE]    # "load As tile to shared mem"
            Bs = B[bk:bk+TILE, bj:bj+TILE]    # "load Bs tile to shared mem"
            acc += As @ Bs                     # reuse tiles TILE times
        C[bi:bi+TILE, bj:bj+TILE] = acc

ref = A @ B
print(f"max abs err: {np.max(np.abs(C - ref)):.2e}")
print(f"FLOPs total  : {2*N**3:,}")
print(f"HBM reads naive : ~{2*N**3:,} (each element re-read N times)")
print(f"HBM reads tiled : ~{2*N*N * (N//TILE):,} (each tile loaded once per k step)")
print(f"reuse factor   : ~{TILE}x — pushes intensity above the H100 ridge point")
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) TILE=32 ile 256×256 matmul kurar — CUDA kernel'i ile aynı tile boyutu, böylece benzetme bire bir. 2) İç içe üç loop (bi, bj, bk) GPU grid'i (bi, bj) ile kernel'in dış k-loop'unun (bk) rolünü oynar; gövde A ve B'nin bir TILE×TILE yamasını dilimler ve NumPy'nin <code>@</code>'ini iç-k işbirlikçi tile yeniden kullanımının yerine yerel matmul olarak kullanır. 3) Bir <code>(TILE, TILE)</code> yerel acc'a biriktirir — CUDA'daki thread-başına register akümülatörünün <code>acc</code> rolünün tam karşılığı, NumPy tek CPU olduğu için skalardan tile'a terfi etmiştir. 4) <code>A @ B</code> referansıyla karşılaştırır ve okuma sayılarını yazdırır: naif matmul 2N³ ≈ 33M eleman okur, tile'lı matmul yalnızca 2N²·(N/TILE) ≈ 1M eleman — TILE=32x daha az HBM okuma, kernel'i memory-bound'dan compute-bound'a çeviren tam olarak bu yeniden kullanım çarpanı.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bank Çakışmaları — Paylaşılan Belleğin de Lane'leri Var</h2>
<p class="l-text">Modern GPU'larda paylaşılan bellek 32 bank genişliğinde, bank başına 4 byte, kelime ile aralanmıştır. Bir warp'in 32 thread'i 32 farklı bank'a erişirse, erişim 1 döngü sürer. İki thread aynı bank'a farklı adreslerle vurursa, erişim serileştirilir — bir <strong>bank çakışması</strong>. <code>__shared__ float As[32][32]</code> olarak depolanan TILE=32 ile, sütun-yönlü erişim (threadIdx.y boyunca <code>As[i][threadIdx.x]</code>) her thread'i bank 0'a koyar — 32 yollu çakışma, 32x yavaşlama.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çakışma yok</div><div class="card-body">Tüm 32 thread aynı adresi okur (broadcast) — 1 döngü. Veya hepsi farklı bank'lari okur — 1 döngü.</div></div>
<div class="calc-card"><div class="card-title">2-yollu çakışma</div><div class="card-body">İki thread aynı bank'a vurur — 2 döngü. <em>n</em>-yollu çakışma — <em>n</em> döngü.</div></div>
<div class="calc-card"><div class="card-title">+1 padding hilesi</div><div class="card-body"><code>__shared__ float As[32][33];</code> — bir sütun padding ekler, böylece sütun-yönlü erişim farklı bank'lar üzerinden stride yapar. 32 float paylaşılan belleğe mal olur; çakışmayı ortadan kaldırır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// BEFORE — column access causes 32-way bank conflict
__shared__ float As[32][32];
float v = As[threadIdx.x][threadIdx.y];   // every warp lane on same bank

// AFTER — pad to 33 columns; column access now strides through banks
__shared__ float As[32][33];
float v = As[threadIdx.x][threadIdx.y];   // bank index = (33*x + y) mod 32 → distinct
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) BEFORE bloğu <code>As[32][32]</code> ilan eder; <code>As[threadIdx.x][threadIdx.y]</code> okuması x ve y'nin rolünü değiştirir, böylece ardışık warp lane'leri (değişen threadIdx.x, sabit threadIdx.y) bank indekslerini <code>(32*x + y) % 32 = y</code> olarak hesaplar — her lane aynı bank'a düşer, erişimi 32 döngüye serileştiren 32-yollu bir çakışma. 2) AFTER bloğu deklarasyonu <code>As[32][33]</code>'e değiştirir — satır başına bir ekstra float padding. 3) Şimdi bank indeksi <code>(33*x + y) % 32</code>'dir; <code>gcd(33, 32) = 1</code> olduğu için, 32 lane 32 farklı bank'a dokunur ve tek-döngülü erişim geri kazanılır. 4) Düzeltme satır başına 32 float (128 B) paylaşılan belleğe ve sıfır runtime döngüye mal olur — sevk edebileceğiniz en ucuz 32x hızlanma.</p>

<div class="calc-highlight"><strong>Ders:</strong> 2D bir tile'i paylaşılan bellekte sakladığınız ve hem satır-yönlü hem sütun-yönlü eriştiğiniz her zaman, iç boyutu 1 ile padle yapın. Bu o kadar yaygındır ki NVIDIA'nın matmul örnekleri tam anlamıyla her zaman <code>+1</code> kullanır. Modern Triton (Ders 5) bunu otomatik gizler, bu da kernel yazımı için raw CUDA'yi yerini almasının nedenlerinden biridir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Register Baskısı — Daha Çok Register, Daha Az Warp</h2>
<p class="l-text">Her thread'in bir register bütçesi vardır (mimari-bağımlı — H100: thread başına 255'e kadar). Çok kullanın, derleyici ~10x daha yavaş olan L1/local belleğe "dökülür". Çok az kullanın, instruction-level paralellik için yeterli kısmı sonuçları koruyamazsınız. Toplam register dosyası sabittir (H100'de SM başına 256 KB), bu yüzden thread başına register sayısı × SM başına thread ≤ 65.536. Thread başına daha çok register → daha az thread → daha düşük doluluk.</p>

<div class="katex-block">$$\\text{threads}_{\\text{SM}} = \\min\\left(\\frac{\\text{regs}_{\\text{SM}}}{\\text{regs}_{\\text{thread}}},\\; \\text{max threads}\\right)$$</div>

<p class="l-text">İki strateji burada savaşır. <strong>Yüksek doluluk</strong>: thread başına register'i düşük tutun, SM başına çok warp sığdırın, aşırı abone ile bellek gecikmesini gizleyin. <strong>Yüksek ILP / düşük doluluk</strong>: birçok kısmı toplamı canlı tutmak için thread başına çok sayıda register kullanın, daha az warp ile bile instruction-level paralelliği kullanın. Volkov'un klasik 2010 makalesi "Better Performance at Lower Occupancy" ikinci stratejinin matmul'da 2x kazanabileceğini gösterdi. Modern matmul (CUTLASS) ve FlashAttention her ikisini de kullanır: ~%25 doluluk, thread başına ~128 register, çok geniş register tile'ları.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yüksek doluluk rejimi</div><div class="card-body">≤32 reg/thread, %75-100 doluluk. Memory-bound kernel'ler için iyi (elementwise, pointwise norm'lar). HBM duraklamalarını gizlemek için çok warp.</div></div>
<div class="calc-card"><div class="card-title">Düşük doluluk / yüksek ILP</div><div class="card-body">128+ reg/thread, %25-50 doluluk. Yeniden kullanıma sahip compute-bound kernel'ler için iyi (matmul, attention). Geniş register tile = warp başına yüksek aritmetik yoğunluk.</div></div>
<div class="calc-card"><div class="card-title">Nasıl kontrol edilir</div><div class="card-body"><code>__launch_bounds__(maxThreadsPerBlock, minBlocksPerSM)</code> ve <code>nvcc -maxrregcount=N</code>. Register dökülmelerini görmek için Nsight Compute "Source" sekmesi ile profilleyin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Occupancy Calculator</h2>
<p class="l-text">Herhangi bir (block_size, regs_per_thread, shared_mem_per_block, mimari) için occupancy calculator size SM'e kaç blok/warp'in sığdığını söyler. Eski versiyonlar bir spreadsheet idi; modern Nsight Compute canlı olarak hesaplar ve Triton'ın autotune'u üzerinde arar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Occupancy calculator for H100 (sm_90)
# Limits: 64 warps/SM, 256 KB regs/SM, 228 KB smem/SM, 32 blocks/SM max

def occupancy(block_size, regs_per_thread, smem_per_block_kb):
    MAX_WARPS_SM   = 64
    MAX_REGS_SM    = 65536          # 32-bit registers
    MAX_SMEM_SM_KB = 228
    MAX_BLOCKS_SM  = 32

    if block_size % 32: raise ValueError("block size must be multiple of 32")
    warps_per_block = block_size // 32

    # Limits
    by_warps  = MAX_WARPS_SM   // warps_per_block
    by_regs   = MAX_REGS_SM    // (regs_per_thread * block_size)
    by_smem   = MAX_SMEM_SM_KB // smem_per_block_kb if smem_per_block_kb &gt; 0 else 1e9
    by_blocks = MAX_BLOCKS_SM

    blocks_per_sm = min(by_warps, by_regs, by_smem, by_blocks)
    active_warps  = blocks_per_sm * warps_per_block
    occ           = active_warps / MAX_WARPS_SM
    return blocks_per_sm, active_warps, occ

# Three example kernels
for name, (b, r, s) in {
    "elementwise add"      : (256,  20, 0),
    "tiled matmul (TILE=32)": (256,  64, 8),
    "FlashAttention-style"  : (128, 128, 48),
}.items():
    blocks, warps, occ = occupancy(b, r, s)
    print(f"{name:25s} block={b}  regs={r}  smem={s}KB  -&gt;  blocks/SM={blocks}  warps/SM={warps}  occupancy={occ:.0%}")
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Dört gerçek H100 sm_90 limitini sabit kodlar — SM başına 64 aktif warp, SM başına 65.536 register, SM başına 228 KB paylaşılan bellek, SM başına 32 blok — resmi CUDA Occupancy Calculator'ın kullandığı aynı sayılar. 2) Verilen bir <code>(block_size, regs/thread, smem KB/block)</code> için bağımsız olarak dört tavan hesaplar: warp sayısına göre, register dosyasına göre, paylaşılan belleğe göre ve katı blok cap'ine göre kaç blok sığar; sonra minimumu alır — gerçek sınırlayıcı kaynak. 3) Blok/SM ile warp/blok'u çarparak aktif warp'ları elde eder ve 64'e bölerek doluluk oranını verir. 4) Üç kanonik örneği çalıştırır: elementwise add (regs-bound ama ~%100'e ulaşır — memory-bound kernel'lar HBM gecikmesini gizlemek için yüksek doluluk ister), tile'lı matmul (256 thread × 64 reg + 8 KB smem — rahat orta), ve FlashAttention tarzı kernel (128 thread × 128 reg + 48 KB smem) — sonuncusu bilerek ~%25'e düşer çünkü geniş register tile'i hız veren şeydir, yüksek warp sayısı değil.</p>

<p class="l-text">FlashAttention'ın kasten %25 dolulukta çalıştığına dikkat edin — kullandığı register'lar ve paylaşılan bellek hızının kaynağıdır, kusur değil. Calculator'i bir hedef olarak değil, bir tanı aracı olarak ele alın.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pinned Bellek ve Async Kopyalar</h2>
<p class="l-text">Kernel çalışmadan önce bile kopyalama ile zaman harcarsınız. Varsayılan olarak host belleği sayfalanabilirdir; çekirdek onu hareket ettirebilir. CUDA, GPU'ya DMA yapmadan önce sayfalanabilir belleği gizli pinned bir buffer'a önce kopyalamak zorundadır, maliyeti ikiye katlar. <strong>Pinned host bellek</strong> (<code>cudaMallocHost</code>) bunu atlar: kalıcı olarak page-locked'tir, bu yüzden GPU doğrudan DMA yapabilir. Hızlanma transfer-yoğun kod için tipik olarak 2x'tir.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>float *h_a;
cudaMallocHost(&amp;h_a, bytes);              // pinned host alloc
// ... fill h_a ...

cudaStream_t s; cudaStreamCreate(&amp;s);
cudaMemcpyAsync(d_a, h_a, bytes, cudaMemcpyHostToDevice, s);
my_kernel&lt;&lt;&lt;grid, block, 0, s&gt;&gt;&gt;(d_a, ...);
cudaMemcpyAsync(h_out, d_out, bytes, cudaMemcpyDeviceToHost, s);
cudaStreamSynchronize(s);
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>cudaMallocHost(&amp;h_a, bytes)</code> sayfa-kilitli (pinned) RAM tahsis eder — işletim sistemi onu takas edemez veya taşıyamaz, böylece GPU'nun DMA motoru pageable bellek için gereken staging-buffer kopyası olmadan doğrudan fiziksel adreslerden transfer edebilir. 2) <code>cudaStreamCreate(&amp;s)</code> varsayılan olmayan bir CUDA stream açar — sıfır olmayan bir stream'de kuyruğa alınan iş, stream 0'dan serileştirilmek yerine diğer stream'lerdeki işle eşzamanlı çalışır. 3) Async memcpy hemen döner ve stream <code>s</code>'de bir DMA H2D transferi kuyruğa alır. 4) Stream <code>s</code>'deki kernel başlatması (dördüncü <code>&lt;&lt;&lt; , , 0, s&gt;&gt;&gt;</code> arg'ına dikkat) de kuyruğa girer — CUDA driver stream sıralamasına saygı duyar, böylece kernel H2D bitene kadar başlamaz ama host'u da bloklamaz. 5) Sondaki async D2H kopyası kernel'in arkasında kuyruğa girer ve nihayet <code>cudaStreamSynchronize(s)</code> tek blokleyici çağrıdır, tüm pipeline'ın boşalmasını bekler — birden fazla stream üzerinde batch'leri üst üste bindirmek için mükemmel kurulum.</p>

<p class="l-text">Çok stream'li async kopyalarla batch <em>n+1</em>'in H2D kopyasını, batch <em>n</em>'in kernel'ini ve batch <em>n−1</em>'in D2H kopyasını <em>üst üste bindirebilirsiniz</em> — aynı anda olan üç şey. PyTorch'un <code>DataLoader(pin_memory=True)</code> + <code>non_blocking=True</code> .to(device)'i tam olarak bunu yapar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Profilleme — Nsight Compute ve ncu</h2>
<p class="l-text">Ölçmediğiniz şeyi tune edemezsiniz. NVIDIA'nın profiler stack'i yoğun ama vazgeçilmezdir. İki araç uygulayıcıların %90 ihtiyacını karşılar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Nsight Systems (<code>nsys</code>)</div><div class="card-body">Timeline görünümü: kernel başlatmaları, memcpy, CPU/GPU sync, NVLink/NCCL trafiği. Bunu bütün bir eğitim adımında <em>zamanın nereye gittiğini</em> bulmak için kullanın. <code>nsys profile python train.py</code>.</div></div>
<div class="calc-card"><div class="card-title">Nsight Compute (<code>ncu</code>)</div><div class="card-body">Per-kernel derinlemesine inceleme: doluluk, bellek throughput'u, durma sebepleri, kaynak satır atribüsyonu. <em>Tek bir</em> kernel'i tune etmek için kullanın. <code>ncu --set full -k my_kernel ./a.out</code>.</div></div>
<div class="calc-card"><div class="card-title">PyTorch Profiler</div><div class="card-body"><code>torch.profiler</code> her ikisini de sarar, Chrome trace ve TensorBoard'a aktarır. Python içinde başvurulacak ilk şey.</div></div>
</div>

<p class="l-text">Önce okumak için anahtar Nsight Compute metrikleri: <code>sm__throughput.avg.pct_of_peak_sustained_elapsed</code> (compute kullanımı), <code>dram__bytes.sum.per_second</code> (HBM bant genişliği), <code>smsp__warps_active.avg.pct_of_peak_sustained_active</code> (doluluk) ve "Memory Workload Analysis → Coalesced" (yüklemelerinizin birleşik olup olmadığı).</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Birleştiriyoruz — Warp Shuffle ile Reduction</h2>
<p class="l-text">Modern bir reduction <code>__shfl_down_sync</code> kullanır — thread <em>i</em>'nin paylaşılan bellekten geçmeden thread <em>i+s</em>'in register'ini okumasına izin veren bir warp-içi komut. Warp'lar arasında paylaşılan bellek ve sonunda atomic add ile birleştirildiğinde, bu H100'de HBM bant genişliğinin %5 içinde sunar.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO — modern reduction)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>__inline__ __device__ float warp_reduce(float v) {
    for (int s = 16; s &gt; 0; s &gt;&gt;= 1) v += __shfl_down_sync(0xffffffff, v, s);
    return v;   // lane 0 has the warp sum
}

__global__ void reduce_sum(const float* x, float* out, int N) {
    __shared__ float warp_sums[32];      // up to 32 warps per block
    int tid = threadIdx.x;
    int i   = blockIdx.x * blockDim.x + tid;
    float v = (i &lt; N) ? x[i] : 0.f;

    v = warp_reduce(v);
    int lane = tid &amp; 31;
    int wid  = tid &gt;&gt; 5;
    if (lane == 0) warp_sums[wid] = v;
    __syncthreads();
    if (wid == 0) {
        v = (tid &lt; (blockDim.x + 31) / 32) ? warp_sums[lane] : 0.f;
        v = warp_reduce(v);
        if (lane == 0) atomicAdd(out, v);
    }
}
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>warp_reduce</code>, <code>__shfl_down_sync(0xffffffff, v, s)</code> kullanarak bir warp'ın 32 lane'i boyunca ağaç toplaması yapan inline bir device fonksiyondur — paylaşılan belleğe dokunmadan lane <em>i</em>'nin lane <em>i+s</em>'nin değerini bir döngüde okumasına izin veren register-to-register shuffle; maske <code>0xffffffff</code> 32 lane'in de katıldığını bildirir. 2) log2(32)=5 yarılamadan sonra (s=16,8,4,2,1) lane 0 warp toplamını tutar. 3) Ana kernel'de her thread bir eleman yükler (sıfır-doldurmalı sınır kontrolü ile) ve <code>warp_reduce</code> çalıştırır — şimdi warp başına bir partial'ımız var. 4) Her warp'ın lane 0'ı kendi partial'ını paylaşılan bellekteki <code>warp_sums[wid]</code>'ye yazar; <code>__syncthreads()</code> bunları tüm warp'lara yayımlar. 5) Yalnızca warp 0 (<code>wid == 0</code>) warp-başına partial'ları geri okur, üzerlerinde başka bir <code>warp_reduce</code> çalıştırır ve lane 0 <code>atomicAdd(out, v)</code> yapar — blok başına bir atomic, H100'de ~%95 HBM bant genişliğine ulaşır çünkü shuffle yolu eski reduction'ın paylaşılan-bellek ağacını ortadan kaldırır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide demo — bant genişliği tavanı sezgisi</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

# Reduction is bandwidth-bound — only reads, no reuse possible.
# Best achievable on H100: HBM bw / 4 bytes per FP32 element = 837 Gelems/s.
N = 50_000_000
x = np.random.rand(N).astype(np.float32)

t0 = time.perf_counter()
s = x.sum()
elapsed = time.perf_counter() - t0

print(f"NumPy sum N={N:,}: {elapsed*1000:.2f} ms · {N*4/elapsed/1e9:.1f} GB/s")
print(f"H100 ceiling: {3.35e12*1e-9:.0f} GB/s -&gt; would do this in {N*4/3.35e12*1e3:.2f} ms")
print("Modern CUB reduction reaches ~95% of HBM bandwidth.")
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) 50M elemanlık FP32 dizi (200 MB) inşa eder — cevabın HBM okuma süresi tarafından domine edilmesi için, kernel-başlatma overhead'i değil, yeterince büyük. 2) NumPy'da <code>x.sum()</code> tek bir BLAS-eşdeğeri geçişe iner; <code>perf_counter</code> ile zamanlar ve byte'ları geçen süreye bölerek ulaşılan bant genişliğini GB/s olarak okur. 3) Bu ulaşılan throughput'u H100'ün peak 3.35 TB/s HBM3 tavanıyla karşılaştırır ve sum'ın peak'te <em>ne kadar süreceğini</em> (~0.06 ms) yazdırır — CPU'nun 20-100 GB/s'sine karşı yararlı bir kontrast. 4) Gerçek donanımda modern <code>cub::DeviceReduce::Sum</code>'un o tavanın ~%95'ine ulaştığı kapanış hatırlatmasını yazdırır, bu da kimsenin artık el yapımı reduction yazmamasının nedenidir.</p>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Bir Sonraki Derse Götürülecek On Kural</h2>
<p class="l-text">Bellek optimizasyonu pratik GPU işinin büyük bölümüdür. Ders 4 (Numba/CuPy) ve Ders 5 (Triton) bunun çoğunu gizler, ancak temel kurallar hala geçerlidir; yüksek seviyeli kernel'inizin peak'in %1'inde mi yoksa %90'ında mi çalışacağına karar verirler.</p>

<div class="calc-highlight">
<strong>Optimizasyon kontrol listesi (öncelik sırasında):</strong><br>
(1) Yüklemeler birleşik mi? Bir warp'in thread'leri ardışık adresleri okumalıdır.<br>
(2) Veri yeniden kullanılıyor mu? Eğer evet, paylaşılan belleğe tile yapın.<br>
(3) Paylaşılan bellek erişimleri bank-çakışması-siz mi? İç boyutu 1 ile padle yapın.<br>
(4) Kernel'ler fuse edilmiş mi? Basit op'lar arasında yaz→HBM→oku→HBM yapmayın.<br>
(5) Host↔device kopyası minimize edilmiş mi? Tensorları birçok op boyunca GPU'da tutun.<br>
(6) Kaçınılamaz H2D kopyaları için pinned bellek kullanılıyor mu?<br>
(7) Doluluk makul mu (≥%25)? Kontrol etmek için <code>ncu</code> kullanın.<br>
(8) Atomic'ler minimize edilmiş mi? Atomic-yoğun kernel'ler serileştirir.<br>
(9) Mümkünse FP16/BF16 kullanıldı mi? Taşınan byte'lari yarıya indirir.<br>
(10) Nsight Compute ile gerçekten profil yaptınız mi? Tahmin etmeyin.
</div>

<p class="l-text">Ders 4 Python'a atlıyor — Numba'nin <code>@cuda.jit</code>'i ve CuPy'nin drop-in NumPy API'si. Her ikisi de hedef aldığımız aynı SASS'a derler; bu dersin geleneklerinin hepsi taşınır.</p>
</div>`
};
