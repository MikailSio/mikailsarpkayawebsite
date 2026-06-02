window.GPU_L2 = {
en: `<p class="l-text"><strong>A CUDA program looks alien for about 30 minutes, then it looks obvious.</strong> The trick is realizing that you are writing two programs at once: a <em>host</em> program in normal C++ that runs on the CPU, allocates memory, copies data, and launches kernels; and a <em>kernel</em> in CUDA C that runs on the GPU, with a built-in thread index and access to special memory spaces. The kernel is a function with the keyword <code>__global__</code>, called with the funny triple-angle-bracket syntax <code>kernel&lt;&lt;&lt;grid, block&gt;&gt;&gt;(args)</code>. That is essentially the entire new-syntax surface area. Everything else is regular C with one or two GPU-specific qualifiers.</p>

<p class="l-text">In this lesson we write the canonical "hello world" of GPU programming — a vector add — from scratch. We allocate device memory with <code>cudaMalloc</code>, copy data over PCIe with <code>cudaMemcpy</code>, launch a kernel with a 1D grid of blocks, and copy the result back. We also discuss thread indexing (<code>blockIdx.x * blockDim.x + threadIdx.x</code>, the most-typed line in all of GPU code), error checking (the silent killer of CUDA debugging), and how to think about grid sizing. Since you cannot run nvcc in the browser, every CUDA snippet is paired with a NumPy "what this kernel computes" demo so you can execute the algorithm and see the result.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and write a CUDA C kernel with <code>__global__</code>, <code>threadIdx</code>, and <code>blockIdx</code></li>
<li>Allocate device memory and move data host ↔ device with <code>cudaMalloc</code> and <code>cudaMemcpy</code></li>
<li>Compute the global thread index and use it to bound-check work</li>
<li>Pick a sensible block size and compute grid_dim from problem size and block size</li>
<li>Launch with the <code>kernel&lt;&lt;&lt;grid, block&gt;&gt;&gt;</code> syntax and pass arguments by value</li>
<li>Wrap every CUDA call in error checking — silent failures are the #1 source of bugs</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Two-Program Mental Model</h2>
<p class="l-text">A CUDA source file (<code>.cu</code>) compiles to two binaries. The host code goes through your normal C++ compiler (g++/MSVC) and produces a regular executable. The device code is fed to <strong>nvcc</strong> (NVIDIA's CUDA compiler), which lowers it through PTX (a virtual ISA) into SASS (the actual GPU machine code) and embeds that into the host binary as a "fat binary". At runtime, the host program asks the CUDA driver to load the kernel onto the GPU and launch it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Host code</div><div class="card-body">Runs on the CPU. Written in standard C++. Calls CUDA Runtime API (<code>cudaMalloc</code>, <code>cudaMemcpy</code>, <code>cudaLaunchKernel</code>). Manages device memory, kernel launches, streams, events.</div></div>
<div class="calc-card"><div class="card-title">Device code (<code>__global__</code>, <code>__device__</code>)</div><div class="card-body">Runs on the GPU. Written in a C++-like dialect with built-in variables (<code>threadIdx</code>, <code>blockIdx</code>, <code>blockDim</code>, <code>gridDim</code>) and intrinsics (<code>__syncthreads</code>, atomic ops, warp shuffles).</div></div>
<div class="calc-card"><div class="card-title">Pointer hygiene</div><div class="card-body">Host pointers point to RAM, device pointers to HBM. They are <em>not interchangeable</em>. Dereferencing a device pointer on the host segfaults; dereferencing a host pointer in a kernel is undefined behavior. Unified Memory (<code>cudaMallocManaged</code>) blurs this but with cost.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Anatomy of a Kernel</h2>
<p class="l-text">A kernel is a function marked <code>__global__</code> that returns <code>void</code>. Every thread on the GPU runs the same function body, but each thread has unique built-in variables that let it pick its own slice of the work. The pattern below — compute a global index, bound-check, do one element of work — is repeated in 90% of all CUDA kernels ever written.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO — needs nvcc &amp; GPU)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// vector_add.cu  ----  c[i] = a[i] + b[i]
__global__ void vecAdd(const float* a, const float* b, float* c, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // global thread id
    if (i &lt; N) c[i] = a[i] + b[i];                   // bound-check: grids round up
}
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Declares <code>vecAdd</code> with the <code>__global__</code> qualifier — nvcc compiles this for the GPU and makes it callable from the host via the <code>&lt;&lt;&lt;&gt;&gt;&gt;</code> syntax. 2) Computes the global thread id by combining <code>blockIdx.x</code> (which block am I in), <code>blockDim.x</code> (how many threads per block), and <code>threadIdx.x</code> (my position inside this block). 3) Bound-checks <code>i &lt; N</code> because grids are rounded up to a multiple of the block size, so the last block will have threads with <code>i &gt;= N</code> that must skip the write. 4) Writes one FP32 add to <code>c[i]</code> — millions of threads run this body in parallel across the SMs, each touching exactly one element.</p>

<p class="l-text">Five things to notice. (1) <code>__global__</code> means "callable from host, runs on device". (2) The function takes ordinary pointers — but they must point to <em>device</em> memory. (3) The global index combines block position (<code>blockIdx.x</code>), block size (<code>blockDim.x</code>), and the thread's position within the block (<code>threadIdx.x</code>). (4) The bound-check matters because you almost always launch <em>more</em> threads than elements (you round up to a multiple of the block size). (5) Each thread does a tiny amount of work — one add. Millions of threads run this in parallel.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Simulate the kernel by walking the threads explicitly — this is exactly what the GPU does in parallel.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N = 1_000_000
a = np.random.rand(N).astype(np.float32)
b = np.random.rand(N).astype(np.float32)
c = np.empty_like(a)

# Simulate: grid of (N + 255) // 256 blocks, each block has 256 threads
block_dim = 256
grid_dim  = (N + block_dim - 1) // block_dim
print(f"Launch config: grid={grid_dim}, block={block_dim}, total_threads={grid_dim*block_dim}")
print(f"Excess threads (will be bound-checked off): {grid_dim*block_dim - N}")

# What every thread does — in CUDA this happens 1M times in parallel
for block_idx in range(min(grid_dim, 4)):  # show first 4 blocks worth
    for thread_idx in range(block_dim):
        i = block_idx * block_dim + thread_idx
        if i &lt; N:
            c[i] = a[i] + b[i]

# In practice we just call NumPy — same result, same algorithm
c = a + b
print(f"max abs err vs reference: {np.max(np.abs(c - (a+b))):.2e}")
print(f"first 5: {c[:5]}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds two random FP32 vectors of 1M elements — same memory footprint and dtype the CUDA kernel would see (4 MB per buffer). 2) Computes <code>grid_dim = ceil(N / block_dim)</code> exactly the way you would write it in C: <code>(N + 255) // 256</code> — and prints the excess thread count so you see why the bound-check exists. 3) Loops the first 4 blocks worth of threads explicitly to drive home the SIMT mental model — every thread reads its own <code>i</code>, bound-checks, and writes one element. 4) Then collapses to the vectorized <code>c = a + b</code> line which is exactly what a saturated GPU would converge to: NumPy is a single-CPU stand-in for the GPU's parallelism.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Host Side — Memory, Copy, Launch, Copy Back</h2>
<p class="l-text">Every CUDA program follows the same six-step dance on the host. Memorize it; you will write it dozens of times before it becomes muscle memory.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Allocate host buffers</div><div class="card-body">Normal <code>malloc</code> or <code>std::vector</code>. Hold input/output on the CPU side.</div></div>
<div class="calc-card"><div class="card-title">2. Allocate device buffers</div><div class="card-body"><code>cudaMalloc(&amp;d_a, N * sizeof(float))</code>. Returns a device pointer. <code>cudaMallocAsync</code> is faster on streams.</div></div>
<div class="calc-card"><div class="card-title">3. Copy host → device</div><div class="card-body"><code>cudaMemcpy(d_a, h_a, bytes, cudaMemcpyHostToDevice)</code>. Synchronous by default. Crosses PCIe — slow (~25 GB/s on PCIe 4.0 x16).</div></div>
<div class="calc-card"><div class="card-title">4. Launch kernel</div><div class="card-body"><code>vecAdd&lt;&lt;&lt;grid, block&gt;&gt;&gt;(d_a, d_b, d_c, N)</code>. Returns immediately — kernel queues on the default stream.</div></div>
<div class="calc-card"><div class="card-title">5. Copy device → host</div><div class="card-body"><code>cudaMemcpy(h_c, d_c, bytes, cudaMemcpyDeviceToHost)</code>. Implicitly waits for the kernel to finish.</div></div>
<div class="calc-card"><div class="card-title">6. Free</div><div class="card-body"><code>cudaFree(d_a)</code> for each device buffer; <code>free</code> for host buffers. Forgetting <code>cudaFree</code> leaks GPU memory until the process ends.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// host driver for vecAdd
#include &lt;cuda_runtime.h&gt;
#include &lt;cstdio&gt;

int main() {
    const int N = 1 &lt;&lt; 20;            // 1M elements
    size_t bytes = N * sizeof(float);

    float *h_a = (float*)malloc(bytes), *h_b = (float*)malloc(bytes), *h_c = (float*)malloc(bytes);
    for (int i = 0; i &lt; N; ++i) { h_a[i] = 1.f; h_b[i] = 2.f; }

    float *d_a, *d_b, *d_c;
    cudaMalloc(&amp;d_a, bytes); cudaMalloc(&amp;d_b, bytes); cudaMalloc(&amp;d_c, bytes);

    cudaMemcpy(d_a, h_a, bytes, cudaMemcpyHostToDevice);
    cudaMemcpy(d_b, h_b, bytes, cudaMemcpyHostToDevice);

    int block = 256;
    int grid  = (N + block - 1) / block;
    vecAdd&lt;&lt;&lt;grid, block&gt;&gt;&gt;(d_a, d_b, d_c, N);

    cudaMemcpy(h_c, d_c, bytes, cudaMemcpyDeviceToHost);
    printf("c[0] = %f (expect 3.0)\\n", h_c[0]);

    cudaFree(d_a); cudaFree(d_b); cudaFree(d_c);
    free(h_a); free(h_b); free(h_c);
}
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Allocates three pinned-RAM host buffers via <code>malloc</code> (one per vector, each <code>bytes = N * sizeof(float)</code> = 4 MB for N=2²⁰), then fills <code>h_a</code> with 1.0 and <code>h_b</code> with 2.0 so the expected result is 3.0 — a trivial correctness check. 2) Calls <code>cudaMalloc(&amp;d_x, bytes)</code> three times to reserve HBM2/HBM3 regions on the GPU and back-fills the device pointers <code>d_a, d_b, d_c</code>. 3) Pushes inputs across PCIe with two <code>cudaMemcpyHostToDevice</code> calls — synchronous, so the CPU blocks until each transfer finishes (~150 µs each on PCIe 4.0 x16). 4) Computes <code>grid = (N + 255) / 256</code> = 4096 blocks of 256 threads, fires <code>vecAdd&lt;&lt;&lt;grid, block&gt;&gt;&gt;</code> which returns immediately and queues on stream 0. 5) The next <code>cudaMemcpy</code> from device to host implicitly waits for the kernel before copying back, then <code>cudaFree</code>/<code>free</code> release both HBM and RAM — skip <code>cudaFree</code> and you leak GPU memory until process exit.</p>

<p class="l-text">Compile with <code>nvcc -O3 -arch=sm_90 vector_add.cu -o vadd</code> (sm_90 = Hopper / H100). On an H100 this kernel runs in microseconds; the wall-clock is dominated by the two PCIe copies. Lesson 3 explains how to remove that bottleneck (pinned host memory, async copies, streams).</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Global Thread Index in 1D, 2D, 3D</h2>
<p class="l-text">For a 1D problem (a vector), one line: <code>int i = blockIdx.x * blockDim.x + threadIdx.x</code>. For a 2D problem (an image), CUDA gives you both <code>.x</code> and <code>.y</code> components. For a 3D problem (a volume), all three. Picking the right dimensionality is mostly aesthetic — what matters is that consecutive <code>threadIdx.x</code> values map to consecutive memory addresses, because that is what the hardware coalesces (lesson 3).</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// 2D: image grayscale conversion, H x W image stored row-major
__global__ void rgb2gray(const uchar3* rgb, unsigned char* gray, int H, int W) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;   // column
    int y = blockIdx.y * blockDim.y + threadIdx.y;   // row
    if (x &gt;= W || y &gt;= H) return;
    int i = y * W + x;
    uchar3 p = rgb[i];
    gray[i] = (unsigned char)(0.299f*p.x + 0.587f*p.y + 0.114f*p.z);
}

// host launch
dim3 block(16, 16);
dim3 grid((W + 15) / 16, (H + 15) / 16);
rgb2gray&lt;&lt;&lt;grid, block&gt;&gt;&gt;(d_rgb, d_gray, H, W);
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The kernel <code>rgb2gray</code> takes <code>uchar3*</code> (3-byte packed RGB pixels) and writes a single-channel <code>unsigned char</code> grayscale buffer. 2) Each thread computes its own (x, y) by extending the 1D global-index trick into two dimensions: <code>blockIdx.x*blockDim.x + threadIdx.x</code> for column and the analogous .y math for row. 3) An early-return bound check skips threads whose (x, y) lands outside the image — required because the grid rounds H and W up to multiples of 16. 4) Flattens to a row-major linear index <code>i = y*W + x</code>, reads the pixel, applies the ITU-R BT.601 luma weights (0.299, 0.587, 0.114), and writes one grayscale byte. 5) The host launches a 2D grid: <code>dim3 block(16, 16)</code> = 256 threads/block (16 warps × 16 lanes ≈ perfect coalescing for row reads), <code>dim3 grid((W+15)/16, (H+15)/16)</code> tiles the whole image.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
H, W = 480, 640
rgb = (np.random.rand(H, W, 3) * 255).astype(np.uint8)

# What every (y, x) thread computes — vectorized in NumPy:
gray = (0.299*rgb[..., 0] + 0.587*rgb[..., 1] + 0.114*rgb[..., 2]).astype(np.uint8)
print(f"image: {H}x{W}, gray range [{gray.min()}, {gray.max()}], mean {gray.mean():.1f}")
print(f"GPU launch would use grid=({(W+15)//16}, {(H+15)//16}), block=(16,16) = {((W+15)//16)*((H+15)//16)*256:,} threads")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates a synthetic 480×640 RGB image as <code>uint8</code> with three channels — same byte layout the kernel reads. 2) NumPy broadcasting <code>0.299*rgb[..., 0] + 0.587*rgb[..., 1] + 0.114*rgb[..., 2]</code> is the parallel-execution outcome of all 307,200 threads each running the same luma combination, just expressed as one vectorized expression. 3) Cast back to <code>uint8</code> to match the <code>unsigned char</code> the kernel writes; prints min/max/mean so you can spot bugs (e.g. forgetting <code>.astype</code> would leave a float buffer). 4) Reports the GPU launch dimensions that would have been used: <code>(40, 30) × 256 = 307,200</code> threads — exactly H×W since both dimensions divide evenly by 16, so the bound check costs nothing here.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Picking Block Size — The "Just Use 256" Rule</h2>
<p class="l-text">Block size (threads per block) is a tunable parameter. It must be a multiple of 32 (warp size) and at most 1024 (hardware limit). For 95% of kernels, 128 or 256 is the right answer. Smaller blocks waste warp scheduling slots; larger blocks consume more registers/shared memory per block, which can hurt occupancy.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">32 threads</div><div class="card-body">One warp. Almost never use this — only if you genuinely have one warp's worth of work and need <code>__syncwarp</code> semantics.</div></div>
<div class="calc-card"><div class="card-title">128 threads</div><div class="card-body">Four warps. Good default for register-heavy kernels (FlashAttention uses 128). Plenty of warps per SM, low register pressure per block.</div></div>
<div class="calc-card"><div class="card-title">256 threads</div><div class="card-body">Eight warps. The "obvious" default. NVIDIA's CUDA samples use it. Best starting point unless profiling says otherwise.</div></div>
<div class="calc-card"><div class="card-title">512 / 1024 threads</div><div class="card-body">Use only when you need lots of shared-memory-cooperating threads (large reductions, big tiles). Tends to lower occupancy on register-heavy code.</div></div>
</div>

<p class="l-text">Grid dim follows from the problem: <code>grid = (N + block - 1) / block</code> rounds up. CUDA caps grid_dim.x at 2³¹−1, way more than you ever need. For 2D, <code>dim3 grid((W+15)/16, (H+15)/16)</code> with <code>dim3 block(16, 16)</code> is standard for image kernels.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Error Checking — The Habit That Saves Hours</h2>
<p class="l-text">CUDA calls return error codes. Kernel launches do not — errors only surface on the next CUDA call (or never, if you do not check). The single most common debugging story in GPU programming is "my kernel does nothing" → "I forgot the bound check, threads wrote past the end" → "no error printed because I never called <code>cudaGetLastError</code>". Wrap every call in a checking macro from the start; never ship CUDA code without it.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>#include &lt;cuda_runtime.h&gt;
#include &lt;cstdio&gt;
#include &lt;cstdlib&gt;

#define CUDA_CHECK(call) do {                                      \\
    cudaError_t err = (call);                                       \\
    if (err != cudaSuccess) {                                       \\
        fprintf(stderr, "CUDA error %s:%d: %s\\n",                   \\
                __FILE__, __LINE__, cudaGetErrorString(err));        \\
        std::exit(1);                                               \\
    }                                                               \\
} while (0)

// usage:
CUDA_CHECK(cudaMalloc(&amp;d_a, bytes));
vecAdd&lt;&lt;&lt;grid, block&gt;&gt;&gt;(d_a, d_b, d_c, N);
CUDA_CHECK(cudaGetLastError());      // catches launch-time errors (bad config, etc.)
CUDA_CHECK(cudaDeviceSynchronize()); // catches in-kernel errors (out-of-bounds, etc.)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>CUDA_CHECK</code> macro is a <code>do { } while (0)</code> block so it behaves like a statement under <code>if</code>/<code>else</code> without dangling-else bugs. 2) It captures the <code>cudaError_t</code> return code, and if it is not <code>cudaSuccess</code> it prints file/line/error-name through <code>cudaGetErrorString</code> and exits — making silent CUDA failures impossible. 3) After a kernel launch the macro is used twice: <code>cudaGetLastError()</code> catches launch-time issues (invalid grid/block, too much shared memory, bad arg), and <code>cudaDeviceSynchronize()</code> blocks until the kernel finishes and surfaces in-kernel asyncronous errors like out-of-bounds reads. 4) In release builds you keep the launch-time check but can replace the device-sync with a stream-event wait so the host does not stall.</p>

<div class="calc-highlight"><strong>Async gotcha:</strong> kernel launches are non-blocking. If a kernel reads out-of-bounds memory, you will not see the error until the next sync. Add <code>cudaDeviceSynchronize()</code> after every launch in development builds, then remove for release. <code>compute-sanitizer</code> (the modern <code>cuda-memcheck</code>) gives you valgrind-style diagnostics for race conditions and out-of-bounds.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SAXPY — One Step Up From Add</h2>
<p class="l-text">SAXPY (Single-precision A·X Plus Y) is the canonical BLAS Level-1 kernel: <em>y = a·x + y</em>. It is one fused multiply-add per element instead of an add. The kernel barely changes; we use it to demonstrate fused multiply-add, scalar arguments, and arithmetic intensity.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>__global__ void saxpy(int N, float a, const float* x, float* y) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i &lt; N) y[i] = a * x[i] + y[i];   // FMA: 2 FLOPs, 12 bytes moved (2 reads + 1 write FP32)
}
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Same launcher-style kernel as <code>vecAdd</code>, but with one scalar arg <code>float a</code> passed by value — scalar args land in constant memory or registers and cost nothing extra. 2) Each thread computes <code>y[i] = a * x[i] + y[i]</code> which the compiler maps to a single FMA (fused multiply-add) SASS instruction on every NVIDIA GPU since Fermi — so it counts as 2 FLOPs even though it is one machine op. 3) The bound check is the same as vecAdd; the difference is purely arithmetic intensity. 4) Memory traffic per element = 2 reads (<code>x[i]</code>, <code>y[i]</code>) + 1 write (back to <code>y[i]</code>) = 12 bytes FP32; FLOPs per element = 2 (multiply + add); intensity = 2/12 ≈ 0.17 FLOPs/byte — well below H100's 295 ridge point, so the kernel is utterly bandwidth-bound and the FMA does not buy speed.</p>

<div class="katex-block">$$\\text{intensity}_{\\text{SAXPY}} = \\frac{2 \\text{ FLOPs}}{12 \\text{ bytes}} \\approx 0.17 \\quad \\Rightarrow \\quad \\text{badly memory-bound}$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

N = 10_000_000
a = 2.5
x = np.random.rand(N).astype(np.float32)
y = np.random.rand(N).astype(np.float32)

t0 = time.perf_counter()
y2 = a * x + y                    # what every CUDA thread does, vectorized
elapsed = time.perf_counter() - t0

bytes_moved = 3 * N * 4           # 2 reads + 1 write FP32
flops = 2 * N                     # one FMA per element
print(f"SAXPY N={N:,}: {elapsed*1000:.2f} ms")
print(f"  bandwidth: {bytes_moved/elapsed/1e9:.1f} GB/s")
print(f"  compute  : {flops/elapsed/1e9:.2f} GFLOPS")
print(f"  intensity: {flops/bytes_moved:.3f} FLOPs/byte (memory-bound)")
print(f"  H100 ceiling (BW-bound): {0.17 * 3.35e12 / 1e12:.2f} TFLOPS = how fast SAXPY can ever run")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up 10M FP32 elements for <code>x</code> and <code>y</code> plus a scalar <code>a=2.5</code> — the exact arg pattern the CUDA kernel takes. 2) Computes the SAXPY <code>y2 = a*x + y</code> vectorized in NumPy (BLAS-backed) and times it with <code>perf_counter</code>; this stands in for what every CUDA thread does in lockstep. 3) Reports three numbers that map directly to GPU profiler outputs: achieved memory bandwidth (= bytes_moved / time, comparable to HBM peak), achieved GFLOPS, and the arithmetic intensity 0.17 — the ratio that decides which roofline ceiling you hit. 4) Multiplies that intensity by H100's 3.35 TB/s HBM3 to print the theoretical bandwidth-bound ceiling (~0.57 TFLOPS) — the brutally honest upper bound for how fast SAXPY can ever run, no matter how heroic the kernel.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Reduction — When Threads Need to Cooperate</h2>
<p class="l-text">Sum, max, dot product — the moment you go from "each thread writes one output" to "many threads contribute to one output", you need cooperation. The classic GPU reduction uses shared memory and a tree-of-pairs algorithm: each thread loads one element, then half the threads add their neighbor's value, then a quarter, etc. <code>__syncthreads()</code> guarantees all writes are visible before the next halving.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO — sketch, real version uses warp shuffles)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>__global__ void block_sum(const float* x, float* partial, int N) {
    __shared__ float s[256];
    int tid = threadIdx.x;
    int i   = blockIdx.x * blockDim.x + tid;
    s[tid]  = (i &lt; N) ? x[i] : 0.f;
    __syncthreads();
    // tree reduction: 256 -&gt; 128 -&gt; 64 -&gt; ... -&gt; 1
    for (int stride = blockDim.x / 2; stride &gt; 0; stride /= 2) {
        if (tid &lt; stride) s[tid] += s[tid + stride];
        __syncthreads();
    }
    if (tid == 0) partial[blockIdx.x] = s[0];
}
// host then sums the per-block partials (or runs another reduction kernel)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Declares a per-block shared-memory tile <code>__shared__ float s[256]</code> — fast SRAM living on the SM, accessible to all 256 threads of the block. 2) Each thread loads one element from global HBM into <code>s[tid]</code> (with a bound-check zero for the tail), then <code>__syncthreads()</code> guarantees every load is visible before the reduction starts. 3) The for-loop halves <code>stride</code> at each step (128→64→32→16→8→4→2→1) and only the first <code>stride</code> threads add the upper-half partner into their slot — classic tree reduction in 8 sync rounds. 4) Each <code>__syncthreads()</code> inside the loop prevents the next halving from racing with the previous write. 5) Thread 0 publishes the per-block sum to <code>partial[blockIdx.x]</code>; the host (or a second kernel) sums those few thousand partials to get the global reduction.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent — simulate the tree reduction</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N = 1024            # one block's worth
block = 256
x = np.random.rand(N).astype(np.float32)

# Simulate the GPU block reduction explicitly
def block_reduce(chunk):
    s = chunk.copy()
    stride = len(s) // 2
    while stride &gt; 0:
        s[:stride] += s[stride:2*stride]
        stride //= 2
    return s[0]

partials = np.array([block_reduce(x[i:i+block]) for i in range(0, N, block)])
gpu_sum  = partials.sum()
ref      = x.sum()
print(f"GPU-style reduction: {gpu_sum:.6f}")
print(f"NumPy reference   : {ref:.6f}")
print(f"abs err           : {abs(gpu_sum - ref):.2e}  (FP32 round-off)")
print(f"Per-block partials: {partials}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets N=1024 with block size 256 — exactly four blocks' worth, so we can show the tree reduction without distracting tail handling. 2) Defines <code>block_reduce</code> that mirrors the GPU's halving loop in NumPy: a stride that starts at 128 and halves down to 1, with each pass summing slot <code>i</code> into slot <code>i + stride</code> — semantically identical to the <code>__shared__</code> array updates. 3) Lists the four per-block partial sums (one per block of 256), then sums them to get the global reduction — same two-stage strategy real CUDA reductions use. 4) Compares to <code>x.sum()</code> and prints the absolute error: it is non-zero only because tree-vs-linear addition gives slightly different FP32 round-off — not a bug, just a feature of non-associative floating point.</p>
</div>

<p class="l-text">In practice you would use <code>cub::DeviceReduce::Sum</code> (NVIDIA's CUB library) or <code>thrust::reduce</code> rather than hand-rolling. They are bandwidth-saturating and handle warp shuffles correctly. The point of the snippet above is to show that "many threads → one value" requires explicit synchronization.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Where the Time Actually Goes</h2>
<p class="l-text">A common shock for newcomers: a vector add of 1 million floats on an H100 takes ~30 microseconds. The two PCIe copies (host→device and device→host) each take ~150 microseconds. The kernel is 10x faster than the data movement around it. This is why "just port your loop to CUDA" rarely speeds things up — you must keep data on the GPU across many operations.</p>

<div class="calc-highlight"><strong>The PCIe trap:</strong> if a function copies inputs to GPU, runs a kernel, and copies outputs back, you have built a PCIe-bound pipeline regardless of how fast the kernel is. The wins happen when the GPU runs <em>dozens of kernels in a row</em> on data that never leaves HBM. This is exactly how PyTorch and JAX work — they keep tensors device-resident.</p>

<p class="l-text">Lesson 3 attacks the second axis: even when data is on the GPU, <em>how</em> threads access HBM matters enormously. Coalescing, shared memory, bank conflicts, and tile reuse can be the difference between a kernel that runs at 1% of peak and one that runs at 90%. After that, lesson 4 jumps to Python (Numba and CuPy), so we will not be writing raw CUDA much longer — but knowing the layer underneath makes the Python tools far less mysterious.</p>
</div>`,
tr: `<p class="l-text"><strong>Bir CUDA programı yaklaşık 30 dakika boyunca yabancı görünür, sonra bariz hale gelir.</strong> Hile, aynı anda iki program yazdığınızı fark etmektir: CPU'da çalışan, bellek tahsis eden, veri kopyalayan ve kernel'leri başlatan normal C++'ta bir <em>host</em> programı; ve GPU'da çalışan, yerleşik bir thread indeksi ve özel bellek alanlarına erişimi olan CUDA C'de bir <em>kernel</em>. Kernel, <code>__global__</code> anahtar sözcüklü bir fonksiyondur; komik üçlü köşe-parantez sözdizimi <code>kernel&lt;&lt;&lt;grid, block&gt;&gt;&gt;(args)</code> ile çağırılır. Aslında yeni-sözdizimi yüzey alanının tamamı budur. Diğer her şey bir veya iki GPU'ya özel niteleyici ile olağan C'dir.</p>

<p class="l-text">Bu derste GPU programlamanın kanonik "hello world"unu — bir vector add — sıfırdan yazıyoruz. Cihaz belleğini <code>cudaMalloc</code> ile tahsis ediyor, veriyi PCIe üzerinden <code>cudaMemcpy</code> ile kopyalıyor, 1D bir blok grid'i ile bir kernel başlatıyor ve sonucu geri kopyalıyoruz. Ayrıca thread indekslemesi (<code>blockIdx.x * blockDim.x + threadIdx.x</code>, tüm GPU kodundaki en çok yazılan satır), hata kontrolü (CUDA debugging'in sessiz katili) ve grid boyutlandırması hakkında nasıl düşünüleceğini tartışıyoruz. Tarayıcıda nvcc çalıştıramayacağınız için, her CUDA snippet'i, algoritmayı yürütebilmeniz ve sonucu görebilmeniz için "bu kernel ne hesaplar" NumPy demo'su ile eşleştirilmiştir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><code>__global__</code>, <code>threadIdx</code> ve <code>blockIdx</code> ile bir CUDA C kernel'i okuyun ve yazın</li>
<li>Cihaz belleği tahsis edin ve <code>cudaMalloc</code> ve <code>cudaMemcpy</code> ile host ↔ device veri taşıyın</li>
<li>Global thread indeksini hesaplayın ve işi sınır kontrolü için kullanın</li>
<li>Mantıklı bir blok boyutu seçin ve problem boyutu ile blok boyutundan grid_dim'i hesaplayın</li>
<li><code>kernel&lt;&lt;&lt;grid, block&gt;&gt;&gt;</code> sözdizimi ile başlatın ve argümanları değer olarak geçin</li>
<li>Her CUDA çağrısını hata kontrolüne sarın; sessiz hatalar 1 numaralı bug kaynağıdır</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. İki Programlı Zihinsel Model</h2>
<p class="l-text">Bir CUDA kaynak dosyası (<code>.cu</code>) iki ikiliye derlenir. Host kodu normal C++ derleyicinizden (g++/MSVC) geçer ve düzenli bir yürütülebilir üretir. Cihaz kodu <strong>nvcc</strong>'ye (NVIDIA'nın CUDA derleyicisi) verilir; bu, PTX (sanal bir ISA) üzerinden SASS'a (gerçek GPU makine kodu) indirir ve onu host ikiliye "fat binary" olarak gömer. Çalışma zamanında, host programı CUDA driver'a kernel'i GPU'ya yüklemesini ve başlatmasını ister.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Host kodu</div><div class="card-body">CPU'da çalışır. Standart C++'ta yazılır. CUDA Runtime API'sını çağırır (<code>cudaMalloc</code>, <code>cudaMemcpy</code>, <code>cudaLaunchKernel</code>). Cihaz belleğini, kernel başlatmalarını, stream'leri, event'leri yönetir.</div></div>
<div class="calc-card"><div class="card-title">Cihaz kodu (<code>__global__</code>, <code>__device__</code>)</div><div class="card-body">GPU'da çalışır. Yerleşik değişkenler (<code>threadIdx</code>, <code>blockIdx</code>, <code>blockDim</code>, <code>gridDim</code>) ve intrinsic'ler (<code>__syncthreads</code>, atomic op'lar, warp shuffle'ları) ile C++'a benzer bir lehçede yazılır.</div></div>
<div class="calc-card"><div class="card-title">Pointer hijyeni</div><div class="card-body">Host pointer'lar RAM'i, cihaz pointer'ları HBM'yi gösterir. <em>Birbirinin yerine geçmezler</em>. Host'ta cihaz pointer'ı dereference etmek segfault, kernel'de host pointer'ı dereference etmek tanımsız davranıştır. Unified Memory (<code>cudaMallocManaged</code>) bunu bulanıklandırır ama bedeli vardır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bir Kernel'in Anatomisi</h2>
<p class="l-text">Kernel, <code>__global__</code> ile işaretlenmiş ve <code>void</code> döndüren bir fonksiyondur. GPU'daki her thread aynı fonksiyon gövdesini çalıştırır, ancak her thread'in kendi iş dilimi seçmesini sağlayan benzersiz yerleşik değişkenleri vardır. Aşağıdaki desen — bir global indeks hesapla, sınır kontrolü, bir eleman iş yap — yazılmış tüm CUDA kernel'lerinin %90'ında tekrarlanır.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO — nvcc &amp; GPU gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// vector_add.cu  ----  c[i] = a[i] + b[i]
__global__ void vecAdd(const float* a, const float* b, float* c, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // global thread id
    if (i &lt; N) c[i] = a[i] + b[i];                   // bound-check: grids round up
}
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>vecAdd</code>'i <code>__global__</code> niteleyicisiyle tanımlar — nvcc bunu GPU için derler ve <code>&lt;&lt;&lt;&gt;&gt;&gt;</code> sözdizimi ile host'tan çağrılabilir hâle getirir. 2) Global thread id'yi <code>blockIdx.x</code> (hangi bloktayım), <code>blockDim.x</code> (blok başına kaç thread) ve <code>threadIdx.x</code> (bu bloktaki konumum) bilgisini birleştirerek hesaplar. 3) <code>i &lt; N</code> sınır kontrolü zorunludur çünkü grid blok boyutunun katına yukarı yuvarlanır, bu yüzden son blokta <code>i &gt;= N</code> olan thread'ler yazmayı atlamalıdır. 4) <code>c[i]</code>'ye tek bir FP32 add yazar — milyonlarca thread aynı gövdeyi SM'ler boyunca paralel çalıştırır, her biri tam olarak bir elemana dokunur.</p>

<p class="l-text">Dikkat edilecek beş şey. (1) <code>__global__</code> "host'tan çağrılabilir, cihazda çalışır" anlamına gelir. (2) Fonksiyon olağan pointer'lar alır; ancak bunlar <em>cihaz</em> belleğine işaret etmelidir. (3) Global indeks blok pozisyonu (<code>blockIdx.x</code>), blok boyutu (<code>blockDim.x</code>) ve thread'in blok içindeki pozisyonunu (<code>threadIdx.x</code>) birleştirir. (4) Sınır kontrolü önemlidir çünkü neredeyse her zaman elemandan <em>daha çok</em> thread başlatırsınız (blok boyutunun katına yuvarlarsınız). (5) Her thread minik miktarda iş yapar — bir add. Milyonlarca thread bunu paralel çalıştırır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Thread'leri açıkça yürüyerek kernel'i simüle edin; bu, GPU'nun paralel olarak yaptığı şeyin tam olarak aynısıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N = 1_000_000
a = np.random.rand(N).astype(np.float32)
b = np.random.rand(N).astype(np.float32)
c = np.empty_like(a)

# Simulate: grid of (N + 255) // 256 blocks, each block has 256 threads
block_dim = 256
grid_dim  = (N + block_dim - 1) // block_dim
print(f"Launch config: grid={grid_dim}, block={block_dim}, total_threads={grid_dim*block_dim}")
print(f"Excess threads (will be bound-checked off): {grid_dim*block_dim - N}")

# What every thread does — in CUDA this happens 1M times in parallel
for block_idx in range(min(grid_dim, 4)):  # show first 4 blocks worth
    for thread_idx in range(block_dim):
        i = block_idx * block_dim + thread_idx
        if i &lt; N:
            c[i] = a[i] + b[i]

# In practice we just call NumPy — same result, same algorithm
c = a + b
print(f"max abs err vs reference: {np.max(np.abs(c - (a+b))):.2e}")
print(f"first 5: {c[:5]}")
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) 1M elemanlık iki rastgele FP32 vektör oluşturur — CUDA kernel'inin göreceği aynı bellek ayak izi ve dtype (buffer başına 4 MB). 2) C'de yazdığınız tarzla <code>grid_dim = ceil(N / block_dim)</code>'i tam olarak <code>(N + 255) // 256</code> şeklinde hesaplar ve fazla thread sayısını yazdırır — sınır kontrolünün neden var olduğunu görmeniz için. 3) İlk 4 bloğun thread'lerini açıkça döngülerek SIMT zihinsel modelini sağlamlaştırır — her thread kendi <code>i</code>'sini okur, sınır kontrolü yapar ve bir eleman yazar. 4) Sonra <code>c = a + b</code> vektörize satırına çöker — doymuş bir GPU'nun yakınsayacağı tam olarak budur: NumPy, GPU'nun paralelliği için tek-CPU bir vekildir.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Host Tarafı — Bellek, Kopya, Başlat, Geri Kopyala</h2>
<p class="l-text">Her CUDA programı host'ta aynı altı adımlı dansı izler. Ezberleyin; kas hafızası olmadan önce onlarca kez yazacaksınız.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Host buffer'larini tahsis et</div><div class="card-body">Normal <code>malloc</code> veya <code>std::vector</code>. Girdi/çıktı CPU tarafında tutulur.</div></div>
<div class="calc-card"><div class="card-title">2. Cihaz buffer'larini tahsis et</div><div class="card-body"><code>cudaMalloc(&amp;d_a, N * sizeof(float))</code>. Cihaz pointer'ı döndürür. <code>cudaMallocAsync</code> stream'lerde daha hızlıdır.</div></div>
<div class="calc-card"><div class="card-title">3. Host → cihaz kopyala</div><div class="card-body"><code>cudaMemcpy(d_a, h_a, bytes, cudaMemcpyHostToDevice)</code>. Varsayılan olarak senkron. PCIe'yi kateder — yavaş (PCIe 4.0 x16'da ~25 GB/s).</div></div>
<div class="calc-card"><div class="card-title">4. Kernel'i başlat</div><div class="card-body"><code>vecAdd&lt;&lt;&lt;grid, block&gt;&gt;&gt;(d_a, d_b, d_c, N)</code>. Hemen döner — kernel varsayılan stream'de kuyruğa alınır.</div></div>
<div class="calc-card"><div class="card-title">5. Cihaz → host kopyala</div><div class="card-body"><code>cudaMemcpy(h_c, d_c, bytes, cudaMemcpyDeviceToHost)</code>. Kernel'in bitmesini örtük olarak bekler.</div></div>
<div class="calc-card"><div class="card-title">6. Serbest bırak</div><div class="card-body">Her cihaz buffer'i için <code>cudaFree(d_a)</code>; host buffer'lari için <code>free</code>. <code>cudaFree</code>'yi unutmak GPU belleğini süreç sonuna kadar sızdırır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// host driver for vecAdd
#include &lt;cuda_runtime.h&gt;
#include &lt;cstdio&gt;

int main() {
    const int N = 1 &lt;&lt; 20;            // 1M elements
    size_t bytes = N * sizeof(float);

    float *h_a = (float*)malloc(bytes), *h_b = (float*)malloc(bytes), *h_c = (float*)malloc(bytes);
    for (int i = 0; i &lt; N; ++i) { h_a[i] = 1.f; h_b[i] = 2.f; }

    float *d_a, *d_b, *d_c;
    cudaMalloc(&amp;d_a, bytes); cudaMalloc(&amp;d_b, bytes); cudaMalloc(&amp;d_c, bytes);

    cudaMemcpy(d_a, h_a, bytes, cudaMemcpyHostToDevice);
    cudaMemcpy(d_b, h_b, bytes, cudaMemcpyHostToDevice);

    int block = 256;
    int grid  = (N + block - 1) / block;
    vecAdd&lt;&lt;&lt;grid, block&gt;&gt;&gt;(d_a, d_b, d_c, N);

    cudaMemcpy(h_c, d_c, bytes, cudaMemcpyDeviceToHost);
    printf("c[0] = %f (expect 3.0)\\n", h_c[0]);

    cudaFree(d_a); cudaFree(d_b); cudaFree(d_c);
    free(h_a); free(h_b); free(h_c);
}
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>malloc</code> ile üç host buffer'ı (her vektör için bir tane, her biri <code>bytes = N * sizeof(float)</code> = N=2²⁰ için 4 MB) tahsis eder, sonra beklenen sonuç 3.0 olsun diye <code>h_a</code>'yı 1.0, <code>h_b</code>'yi 2.0 ile doldurur — önemsiz bir doğruluk kontrolü. 2) <code>cudaMalloc(&amp;d_x, bytes)</code>'i üç kez çağırarak GPU'da HBM2/HBM3 bölgeleri rezerve eder ve cihaz pointer'ları <code>d_a, d_b, d_c</code>'yi geri doldurur. 3) İki <code>cudaMemcpyHostToDevice</code> çağrısı ile girdileri PCIe üzerinden iter — senkron, yani CPU her transfer bitene kadar bloklanır (PCIe 4.0 x16'da her biri ~150 µs). 4) <code>grid = (N + 255) / 256</code> = 4096 blok × 256 thread hesaplar, <code>vecAdd&lt;&lt;&lt;grid, block&gt;&gt;&gt;</code> ateşler — hemen döner ve stream 0'da kuyruğa girer. 5) Sonraki <code>cudaMemcpy</code> cihazdan host'a geri kopyalamadan önce kernel'i örtük olarak bekler, sonra <code>cudaFree</code>/<code>free</code> hem HBM hem RAM'i bırakır — <code>cudaFree</code>'yi atlarsanız süreç sonuna kadar GPU belleği sızdırırsınız.</p>

<p class="l-text"><code>nvcc -O3 -arch=sm_90 vector_add.cu -o vadd</code> ile derleyin (sm_90 = Hopper / H100). Bir H100'de bu kernel mikrosaniyelerde çalışır; duvar saati iki PCIe kopyası tarafından domine edilir. Ders 3 bu darboğazı nasıl kaldıracağımızı açıklıyor (pinned host belleği, async kopyalar, stream'ler).</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. 1D, 2D, 3D'de Global Thread İndeksi</h2>
<p class="l-text">1D bir problem (vektör) için tek satır: <code>int i = blockIdx.x * blockDim.x + threadIdx.x</code>. 2D bir problem (görsel) için CUDA size hem <code>.x</code> hem <code>.y</code> bileşenleri verir. 3D bir problem (hacim) için üçtür. Doğru boyutu seçmek çoğunlukla estetiktir; önemli olan ardışık <code>threadIdx.x</code> değerlerinin ardışık bellek adreslerine haritalanmasıdır, çünkü donanımın birleştirdiği şey budur (Ders 3).</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// 2D: image grayscale conversion, H x W image stored row-major
__global__ void rgb2gray(const uchar3* rgb, unsigned char* gray, int H, int W) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;   // column
    int y = blockIdx.y * blockDim.y + threadIdx.y;   // row
    if (x &gt;= W || y &gt;= H) return;
    int i = y * W + x;
    uchar3 p = rgb[i];
    gray[i] = (unsigned char)(0.299f*p.x + 0.587f*p.y + 0.114f*p.z);
}

// host launch
dim3 block(16, 16);
dim3 grid((W + 15) / 16, (H + 15) / 16);
rgb2gray&lt;&lt;&lt;grid, block&gt;&gt;&gt;(d_rgb, d_gray, H, W);
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>rgb2gray</code> kernel'i <code>uchar3*</code> (3-byte packed RGB piksel) alır ve tek-kanal <code>unsigned char</code> grayscale buffer yazar. 2) Her thread kendi (x, y)'sini 1D global-index hilesini iki boyuta uzatarak hesaplar: sütun için <code>blockIdx.x*blockDim.x + threadIdx.x</code>, satır için aynı .y matematiği. 3) (x, y)'si görüntü dışına düşen thread'leri erken-return ile atlar — grid H ve W'yi 16'nın katına yuvarladığı için zorunlu. 4) Row-major düz indekse <code>i = y*W + x</code> düzleştirir, pikseli okur, ITU-R BT.601 luma ağırlıklarını (0.299, 0.587, 0.114) uygular ve bir grayscale byte yazar. 5) Host 2D grid başlatır: <code>dim3 block(16, 16)</code> = 256 thread/blok (16 warp × 16 şerit ≈ satır okumaları için mükemmel coalescing), <code>dim3 grid((W+15)/16, (H+15)/16)</code> tüm görüntüyü tile'lar.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (tarayıcıda çalışır)</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
H, W = 480, 640
rgb = (np.random.rand(H, W, 3) * 255).astype(np.uint8)

# What every (y, x) thread computes — vectorized in NumPy:
gray = (0.299*rgb[..., 0] + 0.587*rgb[..., 1] + 0.114*rgb[..., 2]).astype(np.uint8)
print(f"image: {H}x{W}, gray range [{gray.min()}, {gray.max()}], mean {gray.mean():.1f}")
print(f"GPU launch would use grid=({(W+15)//16}, {(H+15)//16}), block=(16,16) = {((W+15)//16)*((H+15)//16)*256:,} threads")
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>uint8</code> üç kanallı sentetik bir 480×640 RGB görüntü üretir — kernel'in okuduğu aynı byte düzeni. 2) NumPy yayını <code>0.299*rgb[..., 0] + 0.587*rgb[..., 1] + 0.114*rgb[..., 2]</code>, aynı luma kombinasyonunu çalıştıran 307.200 thread'in paralel-yürütme sonucudur, sadece tek bir vektörize ifade olarak yazılmıştır. 3) Kernel'in yazdığı <code>unsigned char</code>'a uydurmak için <code>uint8</code>'e geri cast eder; min/max/mean yazdırır, böylece hataları (örn. <code>.astype</code>'u unutmak float buffer bırakırdı) yakalayabilirsiniz. 4) Kullanılacak GPU başlatma boyutlarını raporlar: <code>(40, 30) × 256 = 307.200</code> thread — tam olarak H×W, çünkü her iki boyut da 16'ya tam bölünür, bu yüzden burada sınır kontrolü maliyetsizdir.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Blok Boyutu Seçimi — "Sadece 256 Kullan" Kuralı</h2>
<p class="l-text">Blok boyutu (blok başına thread) ayarlanabilir bir parametredir. 32'nin katı (warp boyutu) ve en fazla 1024 (donanım limiti) olmalıdır. Kernel'lerin %95'i için 128 veya 256 doğru cevaptır. Daha küçük bloklar warp planlama yuvalarını boşa harcar; daha büyük bloklar blok başına daha fazla register/paylaşılan bellek tüketir, bu da doluluğu zedeleyebilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">32 thread</div><div class="card-body">Bir warp. Neredeyse hiçbir zaman kullanmayın; sadece gerçekten bir warp'lik işiniz varsa ve <code>__syncwarp</code> semantikleri gerekiyorsa.</div></div>
<div class="calc-card"><div class="card-title">128 thread</div><div class="card-body">Dört warp. Register-yoğun kernel'ler için iyi varsayılan (FlashAttention 128 kullanır). SM başına bol warp, blok başına düşük register baskısı.</div></div>
<div class="calc-card"><div class="card-title">256 thread</div><div class="card-body">Sekiz warp. "Bariz" varsayılan. NVIDIA'nın CUDA örnekleri kullanır. Profilleme aksini söylemedikçe en iyi başlangıç noktası.</div></div>
<div class="calc-card"><div class="card-title">512 / 1024 thread</div><div class="card-body">Sadece çok sayıda paylaşılan-bellek-işbirliği yapan thread (büyük reduction'lar, büyük tile'lar) ihtiyacınız olduğunda kullanın. Register-yoğun kodlarda doluluk düşürme eğilimindedir.</div></div>
</div>

<p class="l-text">Grid dim probleminden gelir: <code>grid = (N + block - 1) / block</code> yukarı yuvarlar. CUDA grid_dim.x'i 2³¹−1'de sınırlar, ihtiyacınızdan çok daha fazlası. 2D için <code>dim3 block(16, 16)</code> ile <code>dim3 grid((W+15)/16, (H+15)/16)</code> görsel kernel'leri için standarttır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hata Kontrolü — Saatleri Kurtaran Alışkanlık</h2>
<p class="l-text">CUDA çağrıları hata kodları döndürür. Kernel başlatmaları döndürmez; hatalar yalnızca bir sonraki CUDA çağrısında yüzeye çıkar (veya hiçbir zaman, eğer kontrol etmezseniz). GPU programlamasındaki en yaygın debugging hikayesi şudur: "kernel'im bir şey yapmıyor" → "sınır kontrolünü unuttum, thread'ler sonun ötesine yazdı" → "<code>cudaGetLastError</code>'i hiç çağırmadığım için hiçbir hata yazdırılmadı". Her çağrıyı en baştan bir kontrol makrosuna sarın; CUDA kodunu bunsuz asla göndermeyin.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>#include &lt;cuda_runtime.h&gt;
#include &lt;cstdio&gt;
#include &lt;cstdlib&gt;

#define CUDA_CHECK(call) do {                                      \\
    cudaError_t err = (call);                                       \\
    if (err != cudaSuccess) {                                       \\
        fprintf(stderr, "CUDA error %s:%d: %s\\n",                   \\
                __FILE__, __LINE__, cudaGetErrorString(err));        \\
        std::exit(1);                                               \\
    }                                                               \\
} while (0)

// usage:
CUDA_CHECK(cudaMalloc(&amp;d_a, bytes));
vecAdd&lt;&lt;&lt;grid, block&gt;&gt;&gt;(d_a, d_b, d_c, N);
CUDA_CHECK(cudaGetLastError());      // catches launch-time errors (bad config, etc.)
CUDA_CHECK(cudaDeviceSynchronize()); // catches in-kernel errors (out-of-bounds, etc.)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>CUDA_CHECK</code> makrosu <code>do { } while (0)</code> bloğudur, böylece <code>if</code>/<code>else</code> altında dangling-else hatası olmadan bir ifade gibi davranır. 2) <code>cudaError_t</code> dönüş kodunu yakalar; <code>cudaSuccess</code> değilse <code>cudaGetErrorString</code> üzerinden dosya/satır/hata-adını yazdırır ve çıkar — sessiz CUDA başarısızlıklarını imkansız kılar. 3) Bir kernel başlatması sonrası makro iki kez kullanılır: <code>cudaGetLastError()</code> başlatma-zamanı sorunlarını yakalar (geçersiz grid/blok, çok fazla paylaşılan bellek, kötü arg), <code>cudaDeviceSynchronize()</code> kernel bitene kadar bloklar ve sınır dışı okumalar gibi asenkron kernel-içi hataları yüzeye çıkarır. 4) Release build'lerde başlatma-zamanı kontrolünü tutarsınız ama device-sync'i bir stream-event wait ile değiştirebilirsiniz, böylece host stall olmaz.</p>

<div class="calc-highlight"><strong>Async tuzağı:</strong> kernel başlatmaları engelleyici değildir. Bir kernel sınır dışı bellek okursa, bir sonraki sync'e kadar hatayı görmezsiniz. Geliştirme buildlerinde her launch'tan sonra <code>cudaDeviceSynchronize()</code> ekleyin, sonra release için kaldırın. <code>compute-sanitizer</code> (modern <code>cuda-memcheck</code>) yarışma koşulları ve sınır dışı için valgrind tarzı tanı sağlar.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SAXPY — Add'in Bir Adım Ötesi</h2>
<p class="l-text">SAXPY (Single-precision A·X Plus Y) kanonik BLAS Level-1 kernel'idir: <em>y = a·x + y</em>. Add yerine eleman başına bir fused multiply-add. Kernel pek değişmez; bunu fused multiply-add, scalar argümanlar ve aritmetik yoğunluğu göstermek için kullanıyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>__global__ void saxpy(int N, float a, const float* x, float* y) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i &lt; N) y[i] = a * x[i] + y[i];   // FMA: 2 FLOPs, 12 bytes moved (2 reads + 1 write FP32)
}
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>vecAdd</code> ile aynı başlatıcı stili kernel, ama değer olarak geçen bir scalar <code>float a</code> argümanı içerir — scalar arg'lar constant bellek veya register'a iner ve ekstra maliyet yoktur. 2) Her thread <code>y[i] = a * x[i] + y[i]</code>'yi hesaplar; derleyici bunu Fermi'den beri her NVIDIA GPU'da tek bir FMA (fused multiply-add) SASS yönergesine eşler — yani tek bir makine op'u olsa da 2 FLOP sayılır. 3) Sınır kontrolü vecAdd ile aynıdır; fark salt aritmetik yoğunluktadır. 4) Eleman başına bellek trafiği = 2 okuma (<code>x[i]</code>, <code>y[i]</code>) + 1 yazma (geri <code>y[i]</code>) = 12 byte FP32; eleman başına FLOPs = 2 (çarpma + toplama); yoğunluk = 2/12 ≈ 0.17 FLOPs/byte — H100'ün 295 ridge noktasının çok altında, yani kernel tamamen bant-genişliği-bound ve FMA hız satın almaz.</p>

<div class="katex-block">$$\\text{intensity}_{\\text{SAXPY}} = \\frac{2 \\text{ FLOPs}}{12 \\text{ bytes}} \\approx 0.17 \\quad \\Rightarrow \\quad \\text{badly memory-bound}$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

N = 10_000_000
a = 2.5
x = np.random.rand(N).astype(np.float32)
y = np.random.rand(N).astype(np.float32)

t0 = time.perf_counter()
y2 = a * x + y                    # what every CUDA thread does, vectorized
elapsed = time.perf_counter() - t0

bytes_moved = 3 * N * 4           # 2 reads + 1 write FP32
flops = 2 * N                     # one FMA per element
print(f"SAXPY N={N:,}: {elapsed*1000:.2f} ms")
print(f"  bandwidth: {bytes_moved/elapsed/1e9:.1f} GB/s")
print(f"  compute  : {flops/elapsed/1e9:.2f} GFLOPS")
print(f"  intensity: {flops/bytes_moved:.3f} FLOPs/byte (memory-bound)")
print(f"  H100 ceiling (BW-bound): {0.17 * 3.35e12 / 1e12:.2f} TFLOPS = how fast SAXPY can ever run")
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 10M FP32 eleman <code>x</code> ve <code>y</code> artı bir scalar <code>a=2.5</code> kurar — CUDA kernel'inin aldığı tam arg deseni. 2) SAXPY <code>y2 = a*x + y</code>'yi NumPy'de vektörize hesaplar (BLAS destekli) ve <code>perf_counter</code> ile zamanlar; bu, her CUDA thread'inin lockstep çalıştığı şey için bir vekildir. 3) Doğrudan GPU profiler çıktılarına eşlenen üç sayı raporlar: ulaşılan bellek bant genişliği (= bytes_moved / time, HBM peak'i ile karşılaştırılabilir), ulaşılan GFLOPS ve aritmetik yoğunluk 0.17 — hangi roofline tavanını vurduğunuza karar veren oran. 4) Bu yoğunluğu H100'ün 3.35 TB/s HBM3 ile çarparak teorik bant-genişliği-bound tavanı (~0.57 TFLOPS) yazdırır — kernel ne kadar kahramanca olursa olsun SAXPY'nin asla ulaşamayacağı acımasız üst sınır.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Reduction — Thread'lerin İşbirliği Yapması Gerektiğinde</h2>
<p class="l-text">Sum, max, dot product — "her thread bir çıktı yazar"dan "çok sayıda thread tek bir çıktıya katkı sağlar"a geçtiğiniz an, işbirliğine ihtiyacınız var. Klasik GPU reduction paylaşılan bellek ve ağaç-çifti algoritması kullanır: her thread bir eleman yükler, sonra thread'lerin yarısı komşusunun değerini ekler, sonra dörtte biri vb. <code>__syncthreads()</code> bir sonraki yarılamadan önce tüm yazmalarının görünür olduğunu garanti eder.</p>

<div class="code-wrap"><div class="code-label"><span>CUDA C (DEMO — taslak, gerçek versiyon warp shuffle kullanır)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>__global__ void block_sum(const float* x, float* partial, int N) {
    __shared__ float s[256];
    int tid = threadIdx.x;
    int i   = blockIdx.x * blockDim.x + tid;
    s[tid]  = (i &lt; N) ? x[i] : 0.f;
    __syncthreads();
    // tree reduction: 256 -&gt; 128 -&gt; 64 -&gt; ... -&gt; 1
    for (int stride = blockDim.x / 2; stride &gt; 0; stride /= 2) {
        if (tid &lt; stride) s[tid] += s[tid + stride];
        __syncthreads();
    }
    if (tid == 0) partial[blockIdx.x] = s[0];
}
// host then sums the per-block partials (or runs another reduction kernel)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Blok başına bir paylaşılan-bellek tile'ı <code>__shared__ float s[256]</code> ilan eder — SM'de yaşayan hızlı SRAM, bloğun 256 thread'inin tümüne erişilebilir. 2) Her thread global HBM'den <code>s[tid]</code>'ye bir eleman yükler (kuyruk için sıfırla sınır-kontrolü), sonra <code>__syncthreads()</code> her yüklemenin reduction başlamadan önce görünür olduğunu garanti eder. 3) For-loop her adımda <code>stride</code>'ı yarıya indirir (128→64→32→16→8→4→2→1) ve yalnızca ilk <code>stride</code> kadar thread üst-yarı eşini kendi yuvasına ekler — klasik ağaç reduction'ı, 8 sync turunda. 4) Loop içindeki her <code>__syncthreads()</code> bir sonraki yarılamanın önceki yazma ile yarışmasını engeller. 5) Thread 0 blok başına toplamı <code>partial[blockIdx.x]</code>'e yayınlar; host (veya ikinci bir kernel) o birkaç bin partial'ı toplayarak global reduction'ı elde eder.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri — ağaç reduction'ı simüle et</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N = 1024            # one block's worth
block = 256
x = np.random.rand(N).astype(np.float32)

# Simulate the GPU block reduction explicitly
def block_reduce(chunk):
    s = chunk.copy()
    stride = len(s) // 2
    while stride &gt; 0:
        s[:stride] += s[stride:2*stride]
        stride //= 2
    return s[0]

partials = np.array([block_reduce(x[i:i+block]) for i in range(0, N, block)])
gpu_sum  = partials.sum()
ref      = x.sum()
print(f"GPU-style reduction: {gpu_sum:.6f}")
print(f"NumPy reference   : {ref:.6f}")
print(f"abs err           : {abs(gpu_sum - ref):.2e}  (FP32 round-off)")
print(f"Per-block partials: {partials}")
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) N=1024 ve blok boyutu 256 kurar — tam dört blokluk, böylece tail handling dikkati dağıtmadan ağaç reduction'ı gösterebiliriz. 2) <code>block_reduce</code>'ı tanımlar, GPU'nun yarılama döngüsünü NumPy'de aynalar: 128'den 1'e kadar yarılanan bir stride, her geçişte slot <code>i + stride</code>'ı slot <code>i</code>'ye toplar — semantik olarak <code>__shared__</code> dizi güncellemeleriyle özdeş. 3) Dört blok-başına partial toplamı (her 256'lık blok için bir tane) listeler, sonra bunları toplayarak global reduction'ı verir — gerçek CUDA reduction'larının kullandığı aynı iki aşamalı strateji. 4) <code>x.sum()</code> ile karşılaştırır ve mutlak hatayı yazdırır: bu sıfırdan farklıdır çünkü ağaç-vs-doğrusal toplama biraz farklı FP32 yuvarlama verir — bug değil, sadece floating-point'in birleşmezliğinin bir özelliği.</p>
</div>

<p class="l-text">Pratikte el yapımı yerine <code>cub::DeviceReduce::Sum</code> (NVIDIA'nın CUB kütüphanesi) veya <code>thrust::reduce</code> kullanırsınız. Bunlar bant-genişliğini doyurur ve warp shuffle'larını doğru şekilde işler. Yukarıdaki snippet'in amacı "çok thread → tek değer"in açık senkronizasyon gerektirdiğini göstermektir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Zaman Aslında Nereye Gidiyor</h2>
<p class="l-text">Yeni gelenler için yaygın şok: bir H100'de 1 milyon float'lik bir vector add ~30 mikrosaniye sürer. İki PCIe kopyası (host→device ve device→host) her biri ~150 mikrosaniye sürer. Kernel, etrafındaki veri hareketinden 10x daha hızlı. "Sadece loop'unu CUDA'ya port et"in nadiren işleri hızlandırmasının nedeni budur — verileri birçok işlem boyunca GPU'da tutmalısınız.</p>

<div class="calc-highlight"><strong>PCIe tuzağı:</strong> bir fonksiyon girdileri GPU'ya kopyalar, bir kernel çalıştırır ve çıktıları geri kopyalarsa, kernel ne kadar hızlı olursa olsun PCIe-bound bir pipeline inşa ettiniz. Kazançlar GPU <em>onlarca kernel'i peş peşe</em> HBM'den ayrılmamış veri üzerinde çalıştırdığında olur. Bu tam olarak PyTorch ve JAX'in çalışma şeklidir — tensorları cihaz-içi tutarlar.</p>

<p class="l-text">Ders 3 ikinci eksene saldırıyor: veri GPU'da olsa bile, thread'lerin HBM'ye <em>nasıl</em> eriştiği çok önemlidir. Coalescing, paylaşılan bellek, bank çakışmaları ve tile yeniden kullanımı peak'in %1'inde çalışan bir kernel ile %90'ında çalışan bir kernel arasındaki fark olabilir. Bundan sonra, Ders 4 Python'a (Numba ve CuPy) atlar, böylece artık çok uzun süre raw CUDA yazmayacağız; ancak alttaki katmanı bilmek Python araçlarını çok daha az gizemli yapar.</p>
</div>`
};
