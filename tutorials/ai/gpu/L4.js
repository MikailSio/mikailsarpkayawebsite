window.GPU_L4 = {
en: `<p class="l-text"><strong>You can be productive on a GPU without ever opening a .cu file.</strong> Two Python-first paths exist: <em>Numba</em>, which JIT-compiles Python functions into CUDA kernels with the <code>@cuda.jit</code> decorator, and <em>CuPy</em>, which reimplements the NumPy and SciPy APIs on top of cuBLAS / cuDNN / cuSPARSE so that <code>cupy.dot(a, b)</code> is a CUDA matmul under the hood. Together they cover the full range from "I want to write a custom kernel without leaving Python" to "I want my existing NumPy code to run 50x faster". For most NLP / ML practitioners these tools — plus PyTorch's CUDA tensors — handle 95% of GPU programming needs.</p>

<p class="l-text">In this lesson we walk both. We write a Numba kernel for a Mandelbrot-set-style elementwise computation (a case where vectorized NumPy struggles), then port a NumPy data pipeline to CuPy with literally the change of one import line, then explore <em>kernel fusion</em> — the trick of writing one Python function that compiles to a single GPU kernel doing many ops, instead of many CUDA calls each materializing intermediates in HBM. The Pyodide-equivalent demos show what the GPU code computes; in production you would run the same scripts on a real GPU machine and watch them go 20–100x faster.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Use Numba's <code>@cuda.jit</code> to write a CUDA kernel in Python with no .cu file</li>
<li>Drop-in replace NumPy with CuPy and understand which APIs are 1:1</li>
<li>Move data between CuPy, PyTorch, and NumPy via the array interface (zero-copy when possible)</li>
<li>Recognize when you should use cuPy.RawKernel vs Numba vs Triton (lesson 5)</li>
<li>Apply kernel fusion via <code>cupy.fuse</code> or Numba <code>@cuda.jit</code> to reduce HBM round-trips</li>
<li>Avoid the three classic Python-GPU pitfalls: implicit synchronization, host-side loops, and recompilation churn</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Python-on-GPU Landscape</h2>
<p class="l-text">There are five common ways to use a GPU from Python. They are not mutually exclusive — most production stacks use 3 or 4 simultaneously.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PyTorch / JAX / TensorFlow</div><div class="card-body">High-level. Tensors live on the GPU; operations dispatch to cuDNN/cuBLAS/custom kernels. You almost never write CUDA. The default for ML/DL.</div></div>
<div class="calc-card"><div class="card-title">CuPy</div><div class="card-body">NumPy on the GPU. Same API, different namespace. Best when porting numeric / scientific code that is not deep-learning-shaped.</div></div>
<div class="calc-card"><div class="card-title">Numba <code>@cuda.jit</code></div><div class="card-body">Decorate a Python function, get a CUDA kernel. Closest to writing CUDA C, but in Python syntax. Best for elementwise / map-style kernels with custom logic.</div></div>
<div class="calc-card"><div class="card-title">Triton (lesson 5)</div><div class="card-body">OpenAI's Python DSL for kernel writing. Block-level rather than thread-level. The modern way to write attention, matmul variants, custom fused ops.</div></div>
<div class="calc-card"><div class="card-title">Raw CUDA via pybind11 / cuPy.RawKernel</div><div class="card-body">Embed real .cu code in Python. Use only when the higher-level tools cannot express what you need.</div></div>
</div>

<div class="calc-highlight"><strong>Decision tree:</strong> doing ML? PyTorch. Doing dense numerics that NumPy already expresses? CuPy. Need a custom elementwise kernel? Numba. Need a custom kernel with shared memory / fancy reuse? Triton. Need warp-level intrinsics or wave-perfect tuning? raw CUDA + pybind11.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. CuPy — NumPy with a Different Import</h2>
<p class="l-text">CuPy is the easiest entry point. <code>import cupy as cp</code> and almost every NumPy function works the same way, except arrays live on the GPU and operations run as CUDA kernels. <code>cp.asarray(np_arr)</code> moves data to the GPU; <code>cp.asnumpy(gpu_arr)</code> moves it back. CuPy's developers (formerly Preferred Networks, now NVIDIA) have kept API parity remarkably close — about 95% of NumPy functions and 60% of SciPy work as drop-ins.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — needs cupy + GPU)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># pip install cupy-cuda12x  (matches your CUDA toolkit version)
import cupy as cp, numpy as np, time

# Build a 4096x4096 matrix on the GPU
A = cp.random.rand(4096, 4096, dtype=cp.float32)
B = cp.random.rand(4096, 4096, dtype=cp.float32)

cp.cuda.Stream.null.synchronize()
t0 = time.perf_counter()
C = A @ B                                # cuBLAS GEMM under the hood
cp.cuda.Stream.null.synchronize()        # async! must sync before timing
print(f"CuPy 4096^2 matmul: {(time.perf_counter()-t0)*1000:.1f} ms")

# Compare to NumPy on the same machine
A_np, B_np = cp.asnumpy(A), cp.asnumpy(B)
t0 = time.perf_counter()
C_np = A_np @ B_np
print(f"NumPy 4096^2 matmul: {(time.perf_counter()-t0)*1000:.1f} ms")

# H100 reaches ~50ms; A100 ~80ms; CPU MKL ~600ms. ~10-20x speedup.
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports CuPy as <code>cp</code> with the <code>cupy-cuda12x</code> wheel that matches CUDA 12 toolkit, then allocates two 4096×4096 FP32 matrices <em>directly on the GPU</em> with <code>cp.random.rand</code> — no host buffers are involved. 2) Calls <code>cp.cuda.Stream.null.synchronize()</code> before the timer because all CuPy ops are asynchronous; without this the timer would mostly capture launch overhead. 3) The <code>@</code> operator dispatches to cuBLAS GEMM (SGEMM for FP32 here) which uses Tensor Cores on H100 when dtypes allow; sync again before <code>perf_counter</code>. 4) Round-trips both matrices to host with <code>cp.asnumpy</code> and times the same operation in NumPy (MKL-backed BLAS on CPU) so you can compare side-by-side on the same hardware. 5) The expected ratio (~10-20x) tells you the GPU is reaching ~50 ms for a 137 GFLOP problem ≈ 2.7 TFLOPS FP32, around 70% of H100's peak.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (CuPy IS NumPy)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Since CuPy mirrors NumPy, the algorithm is identical — only the speed differs. Run the NumPy version here to validate correctness; on a GPU you swap one import.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

# Modest size for the browser; same code on GPU at 4096 is the real test
N = 1024
A = np.random.rand(N, N).astype(np.float32)
B = np.random.rand(N, N).astype(np.float32)

t0 = time.perf_counter()
C = A @ B
elapsed = time.perf_counter() - t0
flops = 2 * N**3
print(f"NumPy {N}x{N} matmul: {elapsed*1000:.2f} ms  ·  {flops/elapsed/1e9:.1f} GFLOPS")
print(f"On an H100 with CuPy: ~{flops/(0.85e12)*1e3:.2f} ms (using ~85% of 1 TFLOPS FP32 fraction)")
print(f"Speedup expected: ~{(elapsed * 0.85e12 / flops):.0f}x")
print(f"max C value: {C.max():.4f}, min: {C.min():.4f}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Uses a browser-friendly N=1024 so the matmul stays under a second in Pyodide — the same code on a GPU at N=4096 is the real benchmark. 2) Allocates two FP32 N×N matrices with NumPy and times <code>A @ B</code> (dispatched to BLAS) with <code>perf_counter</code>. 3) Computes <code>flops = 2*N**3</code> (standard matmul FLOP count: one multiply and one add per inner-loop element) and prints achieved GFLOPS. 4) Projects how long the same operation would take on H100 assuming ~85% of the 1 TFLOPS FP32 ceiling — Hopper's "minor" FP32 path, since the Tensor Cores require BF16/FP16 for full 989 TFLOPS — and prints the expected speedup ratio. 5) Sanity-prints C's min/max to confirm a correctness check before swapping <code>import numpy</code> → <code>import cupy</code> on a GPU box.</p>
</div>

<p class="l-text">Important: CuPy operations are <strong>asynchronous</strong>. <code>C = A @ B</code> returns immediately; the work is queued on a stream. Always call <code>cp.cuda.Stream.null.synchronize()</code> before timing, and remember that errors may surface only on the next operation.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. CuPy ↔ NumPy ↔ PyTorch — Zero-Copy Conversions</h2>
<p class="l-text">In real pipelines you mix libraries. CuPy and PyTorch both expose the <code>__cuda_array_interface__</code> protocol — a tiny dict that says "here is a GPU pointer, here is the shape, dtype, stride". Conversion is zero-copy in both directions; the underlying HBM allocation stays put.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import cupy as cp, torch, numpy as np

# CuPy -&gt; PyTorch (zero copy)
cp_arr = cp.arange(1_000_000, dtype=cp.float32).reshape(1000, 1000)
torch_t = torch.as_tensor(cp_arr, device="cuda")           # shares memory
torch_t += 1.0                                              # mutates the same buffer
print("CuPy sees the change:", cp_arr[0, 0])               # 1.0

# PyTorch -&gt; CuPy (also zero copy)
t = torch.randn(512, 512, device="cuda")
c = cp.from_dlpack(torch.utils.dlpack.to_dlpack(t))
print("Same data:", c.shape, c.dtype)

# To CPU/NumPy: copy is unavoidable
np_arr = cp.asnumpy(cp_arr)        # explicit DtoH copy
print("NumPy:", np_arr.shape)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a 1000×1000 FP32 CuPy array, then wraps it with <code>torch.as_tensor(cp_arr, device="cuda")</code> — PyTorch reads the <code>__cuda_array_interface__</code> dict that CuPy exposes (pointer, shape, dtype, strides) and constructs a tensor that shares the same HBM allocation. 2) Mutating <code>torch_t += 1.0</code> writes back through that pointer, and <code>cp_arr[0,0]</code> reads 1.0 — proving zero-copy aliasing. 3) Going the other direction uses DLPack (<code>torch.utils.dlpack.to_dlpack</code> → <code>cp.from_dlpack</code>), a cross-framework GPU-tensor handoff protocol that PyTorch 2.x, CuPy, JAX, and TensorFlow all speak. 4) The final <code>cp.asnumpy(cp_arr)</code> is the only call that incurs a HBM→RAM DtoH copy — copy is unavoidable when crossing the PCIe boundary back to NumPy.</p>

<p class="l-text">Use this when, say, your data loading uses CuPy + RAPIDS (cuDF), your model training uses PyTorch, and your post-processing uses CuPy again. No round-trip through CPU — everything stays in HBM.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Numba @cuda.jit — Custom Kernels in Python</h2>
<p class="l-text">When you need a kernel that NumPy/CuPy do not expose — a Mandelbrot evaluator, a custom physical simulation, a non-standard activation function — Numba lets you write it in Python and JIT-compile to PTX. The model is identical to CUDA C: a function decorated with <code>@cuda.jit</code> launched with <code>kernel[grid, block](args)</code>, with built-in <code>cuda.threadIdx.x</code> etc.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — needs numba.cuda + GPU)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from numba import cuda
import numpy as np

@cuda.jit
def vec_add_kernel(a, b, c):
    i = cuda.blockIdx.x * cuda.blockDim.x + cuda.threadIdx.x
    if i &lt; a.size:
        c[i] = a[i] + b[i]

N = 1_000_000
h_a, h_b = np.random.rand(N).astype(np.float32), np.random.rand(N).astype(np.float32)

# Numba auto-handles host-&gt;device copies if you pass numpy arrays;
# explicit form is faster for repeated calls:
d_a, d_b, d_c = cuda.to_device(h_a), cuda.to_device(h_b), cuda.device_array_like(h_a)

block = 256
grid  = (N + block - 1) // block
vec_add_kernel[grid, block](d_a, d_b, d_c)
cuda.synchronize()
h_c = d_c.copy_to_host()
print("max err:", np.max(np.abs(h_c - (h_a + h_b))))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Decorates <code>vec_add_kernel</code> with <code>@cuda.jit</code> — Numba lowers the Python body through LLVM to PTX (the same virtual ISA nvcc emits) and caches the compiled artifact per (signature, GPU) pair. 2) Inside the kernel, <code>cuda.blockIdx.x</code>, <code>cuda.blockDim.x</code>, <code>cuda.threadIdx.x</code> are the same built-ins as CUDA C — Numba just exposes them through the <code>numba.cuda</code> namespace. 3) <code>cuda.to_device(h_a)</code> performs an explicit HtoD copy; <code>cuda.device_array_like</code> allocates an empty output buffer on the GPU. (Passing raw NumPy arrays would also work but copies on every launch — slower in loops.) 4) <code>vec_add_kernel[grid, block](...)</code> launches with Python's bracket syntax — Numba's analog of <code>&lt;&lt;&lt;&gt;&gt;&gt;</code>. 5) <code>cuda.synchronize()</code> blocks until the kernel finishes; <code>d_c.copy_to_host()</code> issues a DtoH copy and the assertion confirms correctness against the NumPy reference.</p>

<p class="l-text">Numba supports most CUDA features: <code>cuda.shared.array</code> for shared memory, <code>cuda.syncthreads()</code>, atomic ops (<code>cuda.atomic.add</code>), warp shuffles. It does not support C++ templates (which CUDA C uses heavily) or recent intrinsics (FP8 tensor cores). For modern matmul-style kernels Triton is now the better choice; for elementwise / map kernels Numba remains very productive.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent — Mandelbrot, vectorized in NumPy</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import time

# Mandelbrot is the textbook case where Numba @cuda.jit shines:
# each pixel iterates an unknown number of steps -&gt; vectorized NumPy
# wastes work, and a per-pixel CUDA thread is perfect.

H, W = 200, 300
xs = np.linspace(-2.0, 1.0, W, dtype=np.float32)
ys = np.linspace(-1.0, 1.0, H, dtype=np.float32)
Cx, Cy = np.meshgrid(xs, ys)

def mandel_numpy(Cx, Cy, max_iter=100):
    Zx = np.zeros_like(Cx); Zy = np.zeros_like(Cy)
    out = np.zeros_like(Cx, dtype=np.int32)
    for i in range(max_iter):
        mask = (Zx*Zx + Zy*Zy) &lt;= 4.0
        Zx_new = Zx*Zx - Zy*Zy + Cx
        Zy_new = 2*Zx*Zy + Cy
        Zx = np.where(mask, Zx_new, Zx)
        Zy = np.where(mask, Zy_new, Zy)
        out += mask.astype(np.int32)
    return out

t0 = time.perf_counter()
img = mandel_numpy(Cx, Cy, max_iter=100)
elapsed = time.perf_counter() - t0
print(f"NumPy Mandelbrot {H}x{W}: {elapsed*1000:.1f} ms")
print(f"  unique iter counts: {len(np.unique(img))}")
print(f"  black pixels (in set): {(img==100).sum()}")
print(f"On A100 with Numba @cuda.jit: ~50-100x faster (each pixel exits early on its own thread)")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a 200×300 complex-plane grid with <code>np.meshgrid(xs, ys)</code> spanning the canonical Mandelbrot rectangle [-2, 1] × [-1, 1]. 2) The <code>mandel_numpy</code> iterator runs up to 100 z²+c steps in lock-step over the whole grid using <code>np.where</code> and a boolean <code>mask</code> — this is how vectorized NumPy must work, so even pixels that already escaped keep doing useless arithmetic until iteration 100, wasting bandwidth. 3) Accumulates the escape-iteration count via <code>out += mask.astype(int32)</code>, producing the divergence-time image; prints number of unique counts and pixel count inside the set. 4) Reports timing and the key insight: Numba <code>@cuda.jit</code> wins 50-100× here because each pixel is one thread and can <code>break</code> early when <code>|z|² &gt; 4</code> — no wasted work, no full-grid masks, perfect divergent-iteration workload for the GPU.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Kernel Fusion — Why Many Small Ops Hurt</h2>
<p class="l-text">A naive PyTorch / CuPy expression like <code>y = (x * 2 + 3).exp() * 0.5</code> launches 4 separate kernels: multiply, add, exp, multiply. Each kernel reads its input from HBM, writes its output to HBM. For an array of 100M elements, that is 4 × (100M × 4 bytes × 2 traffic) = 3.2 GB of HBM traffic for trivial arithmetic. Fused: one kernel reads once, computes everything in registers, writes once. Same arithmetic, ~4x faster.</p>

<div class="katex-block">$$\\text{HBM traffic}_{\\text{unfused}} = 2 \\cdot N \\cdot \\text{ops} \\cdot \\text{bytes}, \\quad \\text{HBM traffic}_{\\text{fused}} = 2 \\cdot N \\cdot \\text{bytes}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — cupy.fuse)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import cupy as cp

@cp.fuse()
def gelu_like(x):
    return 0.5 * x * (1.0 + cp.tanh(0.7978845608 * (x + 0.044715 * x * x * x)))

x = cp.random.randn(50_000_000, dtype=cp.float32)
y = gelu_like(x)               # ONE kernel, one HBM round trip
cp.cuda.Stream.null.synchronize()
print("done; y[:5] =", y[:5])
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>@cp.fuse()</code> decorator marks the function as a fusion target: at first call CuPy traces it, generates one combined CUDA kernel string, compiles via NVRTC, caches the binary, then dispatches that single kernel on every subsequent call. 2) Without <code>@cp.fuse</code>, this expression launches 6 separate kernels (one per <code>*</code>, <code>tanh</code>, <code>+</code>, etc.), each reading and writing 200 MB of HBM. 3) With the decorator, the entire approximation of GELU (Hendrycks-Gimpel coefficients 0.7978845608 and 0.044715) runs once: read x, compute everything in registers, write y — one HBM round trip total. 4) For 50M elements the unfused version moves ~2.4 GB of HBM traffic; the fused version moves 400 MB — a 6× bandwidth reduction that translates almost linearly into wall-clock speedup on a bandwidth-bound op.</p>

<p class="l-text">PyTorch has the same idea via <code>torch.compile</code> (PyTorch 2.0+, 2023) — it traces your model and fuses op chains using TorchInductor + Triton. JAX has it via <code>jax.jit</code>. The lesson everywhere: <strong>express your computation as one function, let the framework fuse</strong>, do not call many small ops in a Python loop.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide demo — fused vs unfused HBM traffic accounting</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
N = 10_000_000

# Unfused chain — count HBM bytes assuming each np op is one kernel
unfused_ops = 4   # mul, add, exp, mul
bytes_unfused = 2 * N * 4 * unfused_ops   # 2 (R+W) * 4 bytes FP32 per op

# Fused — one read, one write
bytes_fused = 2 * N * 4

print(f"unfused HBM traffic: {bytes_unfused/1e9:.2f} GB")
print(f"fused   HBM traffic: {bytes_fused/1e9:.2f} GB")
print(f"speedup (BW-bound)  : {bytes_unfused/bytes_fused:.1f}x")
print()
# Verify the math is the same either way:
x = np.random.randn(N).astype(np.float32)
y1 = 0.5 * x * (1.0 + np.tanh(0.7978 * (x + 0.044715 * x**3)))     # "unfused"
def gelu(x): return 0.5*x*(1.0+np.tanh(0.7978*(x+0.044715*x*x*x))) # "fused"
y2 = gelu(x)
print("max err identical:", np.max(np.abs(y1 - y2)))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Treats each NumPy op as a separate "kernel" and tallies bytes moved: 4 ops × 2 (read+write) × N × 4 bytes = 320 MB for N=10M; the fused version moves only 80 MB (one read, one write). 2) Prints the 4× HBM-traffic-reduction figure — on a bandwidth-bound op, this is also the wall-clock speedup. 3) Confirms the math is identical: computes the GELU approximation as a chain of separate ops <code>y1</code> and then as the single-expression form <code>y2</code>; <code>np.max(np.abs(y1 - y2))</code> prints zero (FP32 round-off is identical because both paths execute the same elementary ops in the same order). 4) The point is that fusion is purely a memory-traffic optimization — arithmetic and result bits do not change, only the number of HBM round-trips does.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CuPy Custom Kernels — RawKernel for the Other 5%</h2>
<p class="l-text">When a CuPy operation does not exist (or you want to tune one), <code>cupy.RawKernel</code> lets you embed a CUDA C string directly. You get full CUDA semantics, but inside Python.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import cupy as cp

src = r'''
extern "C" __global__
void clipped_relu(const float* x, float* y, float lo, float hi, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i &gt;= N) return;
    float v = x[i];
    v = v &gt; 0 ? v : 0;
    v = v &gt; hi ? hi : v;
    v = v &lt; lo ? lo : v;
    y[i] = v;
}
'''
kernel = cp.RawKernel(src, 'clipped_relu')

N = 1_000_000
x = cp.random.randn(N, dtype=cp.float32)
y = cp.empty_like(x)
block = 256
grid  = (N + block - 1) // block
kernel((grid,), (block,), (x, y, cp.float32(0.0), cp.float32(6.0), N))
cp.cuda.Stream.null.synchronize()
print("clipped relu range:", y.min().item(), y.max().item())
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Embeds a CUDA C kernel source as a Python raw-string with <code>extern "C"</code> so NVRTC produces an unmangled symbol that CuPy can resolve by name. 2) The kernel computes a clipped ReLU: <code>max(0, min(hi, max(lo, x)))</code> — the same activation used in MobileNet's ReLU6 (hi=6). 3) <code>cp.RawKernel(src, 'clipped_relu')</code> compiles the string at first call and caches the cubin; subsequent calls reuse it for free. 4) The launch syntax <code>kernel((grid,), (block,), args)</code> mirrors <code>&lt;&lt;&lt;&gt;&gt;&gt;</code> but uses tuples for grid/block; scalar args must be wrapped in CUDA types (<code>cp.float32(0.0)</code>) so CuPy passes them correctly. 5) After sync, <code>y.min()</code> reads 0 and <code>y.max()</code> reads 6.0 — the clip bounds — confirming the kernel applied the bounds element-wise across 1M FP32 values.</p>

<p class="l-text">Use <code>RawKernel</code> sparingly. If you find yourself reaching for it often, switch to Triton (lesson 5) — it gives you the same expressiveness with autotuning and far less boilerplate.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Three Python-GPU Pitfalls</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Implicit synchronization</div><div class="card-body">Calling <code>.item()</code>, <code>.cpu()</code>, <code>cp.asnumpy()</code>, or printing a GPU tensor forces the CPU to wait for all queued kernels. Doing this inside a hot loop kills throughput. Defer until the end.</div></div>
<div class="calc-card"><div class="card-title">2. Host-side Python loops</div><div class="card-body">Iterating over a CuPy/Torch array element-by-element from Python is catastrophic — each element triggers a kernel launch (or worse, a HtoD copy). Always vectorize.</div></div>
<div class="calc-card"><div class="card-title">3. Recompilation churn</div><div class="card-body">Numba and Triton recompile when input shapes/dtypes change. Mixing FP32 and FP16 every iteration triggers recompiles, eating wall time. Pin dtypes; use shape-stable batch sizes.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (BAD vs GOOD)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># BAD — sync every iteration
import cupy as cp
x = cp.random.randn(1_000_000, dtype=cp.float32)
total = 0.0
for i in range(100):
    total += float((x * i).sum())     # .sum().item() forces sync, blocks GPU

# GOOD — accumulate on GPU, sync once at the end
total_gpu = cp.zeros((), dtype=cp.float32)
for i in range(100):
    total_gpu += (x * i).sum()        # all queued, async
print(float(total_gpu))               # one sync
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The BAD version calls <code>float((x * i).sum())</code> inside the loop — the implicit <code>.item()</code> forces a sync that flushes the entire queued kernel pipeline and pulls one scalar back over PCIe, 100 times. On an H100 this drops throughput from microseconds-per-iteration to milliseconds-per-iteration. 2) The GOOD version creates a 0-d scalar tensor <code>total_gpu</code> that lives in HBM and uses <code>+=</code> to accumulate the partial sums on the device. 3) Inside the loop nothing is synced — kernels are queued onto the default stream and execute concurrently with Python's loop interpretation. 4) Only the final <code>float(total_gpu)</code> forces one sync at the end — the entire 100-iteration computation pipelines with no PCIe round-trips in the middle. This is the single most common Python-GPU pitfall.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Putting It Together — k-NN Distance Matrix</h2>
<p class="l-text">A common ML primitive: given N query vectors and M database vectors, compute the pairwise Euclidean distance matrix. Naive expression in NumPy uses memory like <em>(N×M×D)</em>. With CuPy + the standard <em>‖a-b‖² = ‖a‖² + ‖b‖² - 2·a·b</em> identity, it reduces to a single matmul + two outer adds — exactly the trick used by FAISS-GPU, RAPIDS cuML, and PyTorch's <code>torch.cdist</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — runs on CuPy with 1-line import swap)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np   # swap to: import cupy as np  on a GPU machine
import time

N, M, D = 5000, 5000, 256
queries  = np.random.randn(N, D).astype(np.float32)
database = np.random.randn(M, D).astype(np.float32)

t0 = time.perf_counter()
# ||a-b||^2 = ||a||^2 + ||b||^2 - 2 a.b
q2  = (queries  ** 2).sum(axis=1, keepdims=True)         # (N,1)
db2 = (database ** 2).sum(axis=1, keepdims=True).T       # (1,M)
qb  = queries @ database.T                               # (N,M) — the matmul
dist2 = q2 + db2 - 2 * qb
dist  = np.sqrt(np.maximum(dist2, 0))
elapsed = time.perf_counter() - t0

print(f"distance matrix shape: {dist.shape}, dtype: {dist.dtype}")
print(f"min/mean/max dist: {dist.min():.3f} / {dist.mean():.3f} / {dist.max():.3f}")
print(f"elapsed: {elapsed*1000:.1f} ms (CPU NumPy)")
print(f"On A100 CuPy: ~30 ms; H100: ~12 ms; that is the matmul ceiling for FP32")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets N=M=5000 query/database vectors of dim D=256 — same scale used in FAISS benchmarks — and uses <code>np.random.randn(...).astype(np.float32)</code> to keep FP32 dtype consistent with GPU GEMM. 2) Applies the algebraic identity ‖a−b‖² = ‖a‖² + ‖b‖² − 2·a·b: precomputes per-row norms <code>q2</code> (shape (N,1)) and <code>db2.T</code> (shape (1,M)), then a single matmul <code>queries @ database.T</code> gives the cross-term (N,M). 3) Broadcasts the three pieces with <code>q2 + db2 - 2*qb</code> — NumPy's broadcasting handles the (N,1)+(1,M)+(N,M) shape arithmetic. 4) The <code>np.maximum(dist2, 0)</code> guards against tiny negative round-off, then <code>np.sqrt</code> produces the actual Euclidean distance matrix. 5) The matmul is the only expensive step (2NMD ≈ 12.8 GFLOPs); on H100 with CuPy this hits the FP32 cuBLAS ceiling at ~12 ms — 30-60× faster than CPU NumPy, one import-line away.</p>

<p class="l-text">This is the literal speed-up story: identical Python, one import line, 30–60x throughput. CuPy is the largest "free win" available to a NumPy-fluent practitioner who has GPU access.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. Memory bandwidth before/after kernel fusion (visual)</h2>
<p class="l-text">An unfused chain of elementwise ops (mul → add → relu → mul) writes intermediate tensors back to HBM between every op. A single fused kernel keeps intermediates in registers/shared memory. The bar chart compares HBM traffic per element for the same arithmetic on an H100.</p>
<div id="plot-gpu-l4-bw-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var grid = 'rgba(255,255,255,0.06)';
  var ops = ['Unfused (4 kernels)','Numba kernel (single pass)','CuPy ElementwiseKernel','torch.compile (fused)','FlashAttention-style tiled'];
  var bytes = [32, 8, 8, 8, 4];
  var data = [{ x: ops, y: bytes, type:'bar',
    marker:{color: bytes.map(function(b){return b<=4 ? accent : (b<=8 ? '#6aa9ff' : '#ff6b6b');})},
    text: bytes.map(function(b){return b+' B/elem';}), textposition:'outside' }];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'implementation', gridcolor:grid, tickangle:-20},
    yaxis:{title:'HBM traffic per element (bytes)', gridcolor:grid, range:[0, 38]},
    margin:{t:60,r:20,b:120,l:70}, title:{text:'Kernel fusion shrinks HBM traffic 4-8x', font:{color:text, size:14}}, height:380 };
  Plotly.newPlot('plot-gpu-l4-bw-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-gpu-l4-bw-tr');
  if (trDiv) Plotly.newPlot('plot-gpu-l4-bw-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Since HBM bandwidth is the dominant cost in most ML ops, cutting bytes-per-element 4-8x typically translates to a 4-8x wall-clock speedup. This is the entire motivation for fused kernels, torch.compile, and FlashAttention.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. When Numba/CuPy Run Out — and Triton Begins</h2>
<p class="l-text">Numba is great for elementwise kernels. CuPy is great when an existing NumPy/cuBLAS routine matches your need. Both struggle when you want a custom kernel with shared-memory tiling, non-trivial reuse, or autotuning across hardware. The two canonical examples are matmul variants (block-sparse, mixed-precision, structured) and attention.</p>

<p class="l-text">For those, Triton (lesson 5) has become the default. It gives you a Python decorator like Numba but with block-level (not thread-level) primitives, automatic shared-memory management, and built-in autotune over block sizes. Today's PyTorch ecosystem (<code>torch.compile</code>, FlashAttention, vLLM kernels, Mamba, Triton-based linear attention) is largely written in Triton. The CUDA C / Numba era did not end, but kernel research has moved up the stack.</p>

<div class="calc-highlight"><strong>Mental model after this lesson:</strong> for ML, default to PyTorch + <code>torch.compile</code>. For non-ML numerics, default to CuPy. For elementwise custom kernels, reach for Numba. For everything else custom, jump to Triton — which is exactly what the next lesson is about.</div>
</div>`,
tr: `<p class="l-text"><strong>Hiçbir zaman bir .cu dosyası açmadan bir GPU'da üretken olabilirsiniz.</strong> İki Python-öncelikli yol vardır: <em>Numba</em>, Python fonksiyonlarını <code>@cuda.jit</code> dekoratörü ile CUDA kernel'lerine JIT-derler ve <em>CuPy</em>, NumPy ve SciPy API'lerini cuBLAS / cuDNN / cuSPARSE üzerine yeniden uygular, böylece <code>cupy.dot(a, b)</code> alttan bir CUDA matmul olur. Birlikte "Python'dan ayrılmadan özel bir kernel yazmak istiyorum"dan "var olan NumPy kodumun 50x daha hızlı çalışmasını istiyorum"a kadar tüm yelpazeyi kaplarlar. Çoğu NLP / ML uygulayıcısı için bu araçlar — ve PyTorch'un CUDA tensor'lari — GPU programlama ihtiyaçlarının %95'ini halleder.</p>

<p class="l-text">Bu derste ikisini de yürüyoruz. Vektörize NumPy'nin zorlandığı bir Mandelbrot-set-tarzı elementwise hesaplama için bir Numba kernel'i yazıyoruz, sonra bir NumPy veri pipeline'ini tek bir import satırının değişimi ile CuPy'ye port ediyoruz, sonra <em>kernel füzyonu</em> keşfediyoruz — birden çok op yapan tek bir GPU kernel'ine derlenen tek bir Python fonksiyonu yazma hilesi, her biri HBM'de ara sonuçları materyalize eden çok sayıda CUDA çağrısı yerine. Pyodide-eşdeğeri demo'lar GPU kodunun ne hesapladığını gösterir; üretimde gerçek bir GPU makinesinde aynı script'leri çalıştırır ve onların 20-100x daha hızlı gittiğini izlersiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Numba'nin <code>@cuda.jit</code>'ini, .cu dosyası olmadan Python'da CUDA kernel'i yazmak için kullanmaya</li>
<li>NumPy'ı CuPy ile drop-in değiştirmeye ve hangi API'lerin 1:1 olduğunu anlamaya</li>
<li>Array arayüzü üzerinden CuPy, PyTorch ve NumPy arasında veri taşımaya (mümkün olduğunda zero-copy)</li>
<li>Ne zaman cuPy.RawKernel vs Numba vs Triton (Ders 5) kullanmanız gerektiğini tanımaya</li>
<li>HBM gidiş-dönüşlerini azaltmak için <code>cupy.fuse</code> veya Numba <code>@cuda.jit</code> ile kernel füzyonu uygulamaya</li>
<li>Üç klasik Python-GPU tuzağından kaçınmaya: örtük senkronizasyon, host tarafı loop'lar ve recompilation çilesi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Python-Üzerinde-GPU Manzarası</h2>
<p class="l-text">Python'dan GPU kullanmanın beş yaygın yolu vardır. Birbirini dışladıkları yok — çoğu üretim stack'i aynı anda 3 veya 4 kullanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PyTorch / JAX / TensorFlow</div><div class="card-body">Yüksek seviye. Tensorlar GPU'da yaşar; işlemler cuDNN/cuBLAS/özel kernel'lere dispatch edilir. Neredeyse hiçbir zaman CUDA yazmazsınız. ML/DL için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">CuPy</div><div class="card-body">GPU'da NumPy. Aynı API, farklı namespace. Deep learning şekilli olmayan numerik / bilimsel kodu port ederken en iyi.</div></div>
<div class="calc-card"><div class="card-title">Numba <code>@cuda.jit</code></div><div class="card-body">Bir Python fonksiyonunu dekore edin, bir CUDA kernel'i alın. CUDA C yazmaya en yakın, ama Python sözdiziminde. Özel mantıkla elementwise / map-stili kernel'ler için en iyi.</div></div>
<div class="calc-card"><div class="card-title">Triton (Ders 5)</div><div class="card-body">OpenAI'nin kernel yazımı için Python DSL'i. Thread-seviyesinden ziyade blok-seviyesi. Attention, matmul varyantları, özel fused op'ları yazmanın modern yolu.</div></div>
<div class="calc-card"><div class="card-title">Raw CUDA via pybind11 / cuPy.RawKernel</div><div class="card-body">Gerçek .cu kodunu Python'a gömün. Yalnızca yüksek seviyeli araçlar ihtiyacınız olanı ifade edemiyorsa kullanın.</div></div>
</div>

<div class="calc-highlight"><strong>Karar ağacı:</strong> ML mi yapıyorsunuz? PyTorch. NumPy'ın zaten ifade ettiği yoğun numerik mi? CuPy. Özel bir elementwise kernel mi gerekli? Numba. Paylaşılan bellek / fancy reuse'a sahip özel bir kernel mi gerekli? Triton. Warp-seviyesi intrinsic'leri veya wave-mükemmel tune mi gerekli? raw CUDA + pybind11.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. CuPy — Farklı Bir Import ile NumPy</h2>
<p class="l-text">CuPy en kolay giriş noktasıdır. <code>import cupy as cp</code> ve neredeyse her NumPy fonksiyonu aynı şekilde çalışır, ancak diziler GPU'da yaşar ve işlemler CUDA kernel'leri olarak çalışır. <code>cp.asarray(np_arr)</code> veriyi GPU'ya taşır; <code>cp.asnumpy(gpu_arr)</code> geri taşır. CuPy geliştiricileri (eskiden Preferred Networks, şimdi NVIDIA) API paritesini dikkat çekici ölçüde yakın tuttu — NumPy fonksiyonlarının yaklaşık %95'i ve SciPy'nin %60'i drop-in olarak çalışır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — cupy + GPU gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># pip install cupy-cuda12x  (matches your CUDA toolkit version)
import cupy as cp, numpy as np, time

# Build a 4096x4096 matrix on the GPU
A = cp.random.rand(4096, 4096, dtype=cp.float32)
B = cp.random.rand(4096, 4096, dtype=cp.float32)

cp.cuda.Stream.null.synchronize()
t0 = time.perf_counter()
C = A @ B                                # cuBLAS GEMM under the hood
cp.cuda.Stream.null.synchronize()        # async! must sync before timing
print(f"CuPy 4096^2 matmul: {(time.perf_counter()-t0)*1000:.1f} ms")

# Compare to NumPy on the same machine
A_np, B_np = cp.asnumpy(A), cp.asnumpy(B)
t0 = time.perf_counter()
C_np = A_np @ B_np
print(f"NumPy 4096^2 matmul: {(time.perf_counter()-t0)*1000:.1f} ms")

# H100 reaches ~50ms; A100 ~80ms; CPU MKL ~600ms. ~10-20x speedup.
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) CUDA 12 toolkit'iyle eşleşen <code>cupy-cuda12x</code> wheel'ı ile CuPy'yi <code>cp</code> olarak import eder, sonra <code>cp.random.rand</code> ile iki 4096×4096 FP32 matrisini <em>doğrudan GPU üzerinde</em> tahsis eder — hiçbir host buffer'i kullanılmaz. 2) Timer'dan önce <code>cp.cuda.Stream.null.synchronize()</code> çağırır çünkü tüm CuPy op'ları asenkrondür; bu olmadan timer çoğunlukla launch overhead'ini yakalardı. 3) <code>@</code> operatörü cuBLAS GEMM'e (burada FP32 için SGEMM) dispatch eder; H100'de dtype'lar izin verince Tensor Core'ları kullanır; <code>perf_counter</code>'dan önce yine sync. 4) <code>cp.asnumpy</code> ile her iki matrisi host'a geri kopyalar ve aynı işlemi NumPy'da (CPU'da MKL destekli BLAS) zamanlar, böylece aynı donanım üzerinde yan yana karşılaştırabilirsiniz. 5) Beklenen oran (~10-20x), 137 GFLOP problemi için GPU'nun ~50 ms'ye ulaştığını ≈ 2.7 TFLOPS FP32 olduğunu söyler — H100'ün peak'inin %70'i civarı.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (CuPy NumPy'dir)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">CuPy NumPy'ı yansıttığı için algoritma özdeş — sadece hız farklı. Doğrulamak için NumPy versiyonunu burada çalıştırın; bir GPU'da bir import değiştirirsiniz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, time

# Modest size for the browser; same code on GPU at 4096 is the real test
N = 1024
A = np.random.rand(N, N).astype(np.float32)
B = np.random.rand(N, N).astype(np.float32)

t0 = time.perf_counter()
C = A @ B
elapsed = time.perf_counter() - t0
flops = 2 * N**3
print(f"NumPy {N}x{N} matmul: {elapsed*1000:.2f} ms  ·  {flops/elapsed/1e9:.1f} GFLOPS")
print(f"On an H100 with CuPy: ~{flops/(0.85e12)*1e3:.2f} ms (using ~85% of 1 TFLOPS FP32 fraction)")
print(f"Speedup expected: ~{(elapsed * 0.85e12 / flops):.0f}x")
print(f"max C value: {C.max():.4f}, min: {C.min():.4f}")
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Pyodide'de matmul'un bir saniyenin altında kalması için tarayıcı dostu N=1024 kullanır — gerçek benchmark aynı kod GPU'da N=4096'da. 2) NumPy ile iki FP32 N×N matris tahsis eder ve <code>A @ B</code>'yi <code>perf_counter</code> ile zamanlar (BLAS'a dispatch edilir). 3) <code>flops = 2*N**3</code> hesaplar (standart matmul FLOP sayısı: iç-loop elemanı başına bir multiply ve bir add) ve ulaşılan GFLOPS'u yazdırır. 4) Aynı işlemin H100'de 1 TFLOPS FP32 tavanının ~%85'inde ne kadar süreceğini projeksiyon eder — Hopper'ın "minor" FP32 yolu, çünkü Tensor Core'lar tam 989 TFLOPS için BF16/FP16 ister — ve beklenen hızlanma oranını yazdırır. 5) Bir GPU kutusunda <code>import numpy</code> → <code>import cupy</code> takasından önce doğruluk kontrolü için C'nin min/max'ını sanity-print eder.</p>
</div>

<p class="l-text">Önemli: CuPy işlemleri <strong>asenkron</strong>tür. <code>C = A @ B</code> hemen döner; iş bir stream'de kuyruğa alınır. Zamanlamadan önce her zaman <code>cp.cuda.Stream.null.synchronize()</code>'i çağırın ve hataların yalnızca bir sonraki işlemde yüzeye çıkabileceğini unutmayın.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. CuPy ↔ NumPy ↔ PyTorch — Zero-Copy Dönüşümler</h2>
<p class="l-text">Gerçek pipeline'larda kütüphaneleri karıştırırsınız. CuPy ve PyTorch'un her ikisi de <code>__cuda_array_interface__</code> protokolünü açar — "işte bir GPU pointer'ı, işte şekil, dtype, stride" diyen küçücük bir dict. Dönüşüm her iki yönde de zero-copy'dir; alttaki HBM tahsisi sabit kalır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import cupy as cp, torch, numpy as np

# CuPy -&gt; PyTorch (zero copy)
cp_arr = cp.arange(1_000_000, dtype=cp.float32).reshape(1000, 1000)
torch_t = torch.as_tensor(cp_arr, device="cuda")           # shares memory
torch_t += 1.0                                              # mutates the same buffer
print("CuPy sees the change:", cp_arr[0, 0])               # 1.0

# PyTorch -&gt; CuPy (also zero copy)
t = torch.randn(512, 512, device="cuda")
c = cp.from_dlpack(torch.utils.dlpack.to_dlpack(t))
print("Same data:", c.shape, c.dtype)

# To CPU/NumPy: copy is unavoidable
np_arr = cp.asnumpy(cp_arr)        # explicit DtoH copy
print("NumPy:", np_arr.shape)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Bir 1000×1000 FP32 CuPy dizisi oluşturur, sonra <code>torch.as_tensor(cp_arr, device="cuda")</code> ile sarar — PyTorch CuPy'nin açtığı <code>__cuda_array_interface__</code> dict'ini (pointer, şekil, dtype, stride'lar) okur ve aynı HBM tahsisini paylaşan bir tensor oluşturur. 2) <code>torch_t += 1.0</code> mutasyonu o pointer üzerinden geri yazar ve <code>cp_arr[0,0]</code> 1.0 okur — zero-copy aliasing'i kanıtlar. 3) Diğer yön DLPack kullanır (<code>torch.utils.dlpack.to_dlpack</code> → <code>cp.from_dlpack</code>), PyTorch 2.x, CuPy, JAX ve TensorFlow'un hepsinin konuştuğu çerçeveler-arası bir GPU-tensor devir protokolü. 4) Son <code>cp.asnumpy(cp_arr)</code>, HBM→RAM DtoH kopyası tetikleyen tek çağrıdır — NumPy'a dönmek için PCIe sınırını geçmek zorunluluk.</p>

<p class="l-text">Bunu, diyelim, veri yüklemenizin CuPy + RAPIDS (cuDF) kullandığı, model eğitiminizin PyTorch kullandığı ve son işlemenizin tekrar CuPy kullandığı durumda kullanın. CPU'ya gidiş-dönüş yok — her şey HBM'de kalır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Numba @cuda.jit — Python'da Özel Kernel'ler</h2>
<p class="l-text">NumPy/CuPy'nin sunmadığı bir kernel'e ihtiyacınız olduğunda — bir Mandelbrot değerlendirici, özel bir fiziksel simülasyon, standart olmayan bir aktivasyon fonksiyonu — Numba size onu Python'da yazmanıza ve PTX'e JIT-derlemenize izin verir. Model CUDA C ile özdeş: <code>@cuda.jit</code> ile dekore edilmiş bir fonksiyon, <code>kernel[grid, block](args)</code> ile başlatılır, yerleşik <code>cuda.threadIdx.x</code> vb.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — numba.cuda + GPU gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>from numba import cuda
import numpy as np

@cuda.jit
def vec_add_kernel(a, b, c):
    i = cuda.blockIdx.x * cuda.blockDim.x + cuda.threadIdx.x
    if i &lt; a.size:
        c[i] = a[i] + b[i]

N = 1_000_000
h_a, h_b = np.random.rand(N).astype(np.float32), np.random.rand(N).astype(np.float32)

# Numba auto-handles host-&gt;device copies if you pass numpy arrays;
# explicit form is faster for repeated calls:
d_a, d_b, d_c = cuda.to_device(h_a), cuda.to_device(h_b), cuda.device_array_like(h_a)

block = 256
grid  = (N + block - 1) // block
vec_add_kernel[grid, block](d_a, d_b, d_c)
cuda.synchronize()
h_c = d_c.copy_to_host()
print("max err:", np.max(np.abs(h_c - (h_a + h_b))))
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>vec_add_kernel</code>'i <code>@cuda.jit</code> ile dekore eder — Numba Python gövdesini LLVM üzerinden PTX'e (nvcc'nin yaydığı aynı sanal ISA) indirir ve derlenmiş artefakti (signature, GPU) çifti başına önbelleğe alır. 2) Kernel içinde <code>cuda.blockIdx.x</code>, <code>cuda.blockDim.x</code>, <code>cuda.threadIdx.x</code> CUDA C ile aynı yerleşik değişkenlerdir — Numba sadece <code>numba.cuda</code> namespace'i üzerinden açar. 3) <code>cuda.to_device(h_a)</code> açık bir HtoD kopyası yapar; <code>cuda.device_array_like</code> GPU'da boş bir çıktı buffer'i tahsis eder. (Ham NumPy dizilerini geçmek de çalışır ama her launch'ta kopyalar — loop'larda daha yavaş.) 4) <code>vec_add_kernel[grid, block](...)</code> Python köşeli parantez sözdizimi ile başlatır — Numba'nın <code>&lt;&lt;&lt;&gt;&gt;&gt;</code> karşılığı. 5) <code>cuda.synchronize()</code> kernel bitene kadar bloklar; <code>d_c.copy_to_host()</code> bir DtoH kopya yapar ve assertion NumPy referansına karşı doğruluğu onaylar.</p>

<p class="l-text">Numba çoğu CUDA özelliğini destekler: paylaşılan bellek için <code>cuda.shared.array</code>, <code>cuda.syncthreads()</code>, atomic op'lar (<code>cuda.atomic.add</code>), warp shuffle'ları. C++ template'leri (CUDA C'nin yoğun kullandığı) veya yeni intrinsic'leri (FP8 tensor core'lari) desteklemez. Modern matmul-stili kernel'ler için Triton artık daha iyi seçimdir; elementwise / map kernel'ler için Numba çok üretken kalır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri — Mandelbrot, NumPy'da vektörize</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
import time

# Mandelbrot is the textbook case where Numba @cuda.jit shines:
# each pixel iterates an unknown number of steps -&gt; vectorized NumPy
# wastes work, and a per-pixel CUDA thread is perfect.

H, W = 200, 300
xs = np.linspace(-2.0, 1.0, W, dtype=np.float32)
ys = np.linspace(-1.0, 1.0, H, dtype=np.float32)
Cx, Cy = np.meshgrid(xs, ys)

def mandel_numpy(Cx, Cy, max_iter=100):
    Zx = np.zeros_like(Cx); Zy = np.zeros_like(Cy)
    out = np.zeros_like(Cx, dtype=np.int32)
    for i in range(max_iter):
        mask = (Zx*Zx + Zy*Zy) &lt;= 4.0
        Zx_new = Zx*Zx - Zy*Zy + Cx
        Zy_new = 2*Zx*Zy + Cy
        Zx = np.where(mask, Zx_new, Zx)
        Zy = np.where(mask, Zy_new, Zy)
        out += mask.astype(np.int32)
    return out

t0 = time.perf_counter()
img = mandel_numpy(Cx, Cy, max_iter=100)
elapsed = time.perf_counter() - t0
print(f"NumPy Mandelbrot {H}x{W}: {elapsed*1000:.1f} ms")
print(f"  unique iter counts: {len(np.unique(img))}")
print(f"  black pixels (in set): {(img==100).sum()}")
print(f"On A100 with Numba @cuda.jit: ~50-100x faster (each pixel exits early on its own thread)")
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>np.meshgrid(xs, ys)</code> ile kanonik Mandelbrot dikdörtgenini [-2, 1] × [-1, 1] kapsayan 200×300'lük bir kompleks-düzlem grid'i kurar. 2) <code>mandel_numpy</code> iteratör 100 z²+c adımına kadar tüm grid üzerinde lock-step çalışır, <code>np.where</code> ve bir boolean <code>mask</code> kullanır — vektörize NumPy'ın çalışması gereken yol budur, böylece zaten kaçmış pikseller bile iterasyon 100'e kadar gereksiz aritmetik yapmaya devam eder, bant genişliğini boşa harcar. 3) <code>out += mask.astype(int32)</code> ile kaçış-iterasyon sayısını biriktirir, divergence-time görüntüsünü üretir; benzersiz sayı sayısı ve set içindeki piksel sayısı yazdırır. 4) Zamanlama ve anahtar içgörüyü raporlar: Numba <code>@cuda.jit</code> burada 50-100× kazanır çünkü her piksel bir thread'dir ve <code>|z|² &gt; 4</code> olunca erken <code>break</code> edebilir — gereksiz iş yok, tam-grid mask yok, GPU için mükemmel divergent-iteration yükü.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Kernel Füzyonu — Çok Sayıda Küçük Op Neden Aci Verir</h2>
<p class="l-text"><code>y = (x * 2 + 3).exp() * 0.5</code> gibi naif bir PyTorch / CuPy ifadesi 4 ayrı kernel başlatır: multiply, add, exp, multiply. Her kernel girdisini HBM'den okur, çıktısını HBM'ye yazar. 100M elemanlı bir array için bu, önemsiz aritmetik için 4 × (100M × 4 byte × 2 trafik) = 3.2 GB HBM trafiği demektir. Fused: bir kernel bir kez okur, her şeyi register'larda hesaplar, bir kez yazar. Aynı aritmetik, ~4x daha hızlı.</p>

<div class="katex-block">$$\\text{HBM traffic}_{\\text{unfused}} = 2 \\cdot N \\cdot \\text{ops} \\cdot \\text{bytes}, \\quad \\text{HBM traffic}_{\\text{fused}} = 2 \\cdot N \\cdot \\text{bytes}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — cupy.fuse)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import cupy as cp

@cp.fuse()
def gelu_like(x):
    return 0.5 * x * (1.0 + cp.tanh(0.7978845608 * (x + 0.044715 * x * x * x)))

x = cp.random.randn(50_000_000, dtype=cp.float32)
y = gelu_like(x)               # ONE kernel, one HBM round trip
cp.cuda.Stream.null.synchronize()
print("done; y[:5] =", y[:5])
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>@cp.fuse()</code> dekoratörü fonksiyonu fusion hedefi olarak işaretler: ilk çağrıda CuPy onu izler, tek bir birleştirilmiş CUDA kernel string'i üretir, NVRTC üzerinden derler, binary'yi önbelleğe alır, sonra her sonraki çağrıda o tek kernel'i dispatch eder. 2) <code>@cp.fuse</code> olmadan, bu ifade 6 ayrı kernel başlatırdı (her <code>*</code>, <code>tanh</code>, <code>+</code> vb. için biri), her biri 200 MB HBM okur ve yazar. 3) Dekoratör ile, GELU'nun tüm yaklaşıklığı (Hendrycks-Gimpel katsayıları 0.7978845608 ve 0.044715) bir kez çalışır: x'i oku, her şeyi register'larda hesapla, y'yi yaz — toplam bir HBM gidiş-dönüşü. 4) 50M eleman için unfused versiyon ~2.4 GB HBM trafiği taşır; fused versiyon 400 MB taşır — bandwidth-bound bir op'ta neredeyse doğrusal olarak duvar saatine yansıyan 6× bant genişliği azaltması.</p>

<p class="l-text">PyTorch aynı fikre <code>torch.compile</code> (PyTorch 2.0+, 2023) ile sahiptir — modelinizi izler ve op zincirlerini TorchInductor + Triton kullanarak fuse eder. JAX'ta <code>jax.jit</code> ile vardır. Her yerde ders: <strong>hesaplamayı tek bir fonksiyon olarak ifade edin, framework'un fuse etmesine izin verin</strong>, bir Python loop'unda çok sayıda küçük op çağırmayın.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide demo — fused vs unfused HBM trafik muhasebesi</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
N = 10_000_000

# Unfused chain — count HBM bytes assuming each np op is one kernel
unfused_ops = 4   # mul, add, exp, mul
bytes_unfused = 2 * N * 4 * unfused_ops   # 2 (R+W) * 4 bytes FP32 per op

# Fused — one read, one write
bytes_fused = 2 * N * 4

print(f"unfused HBM traffic: {bytes_unfused/1e9:.2f} GB")
print(f"fused   HBM traffic: {bytes_fused/1e9:.2f} GB")
print(f"speedup (BW-bound)  : {bytes_unfused/bytes_fused:.1f}x")
print()
# Verify the math is the same either way:
x = np.random.randn(N).astype(np.float32)
y1 = 0.5 * x * (1.0 + np.tanh(0.7978 * (x + 0.044715 * x**3)))     # "unfused"
def gelu(x): return 0.5*x*(1.0+np.tanh(0.7978*(x+0.044715*x*x*x))) # "fused"
y2 = gelu(x)
print("max err identical:", np.max(np.abs(y1 - y2)))
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Her NumPy op'unu ayrı bir "kernel" olarak ele alır ve byte trafiğini sayar: 4 op × 2 (oku+yaz) × N × 4 byte = N=10M için 320 MB; fused versiyon yalnızca 80 MB taşır (bir oku, bir yaz). 2) 4× HBM-trafik-azaltma rakamını yazdırır — bandwidth-bound bir op'ta bu aynı zamanda duvar saati hızlanmasıdır. 3) Matematiğin özdeş olduğunu doğrular: GELU yaklaşıklığını ayrı op zinciri olarak <code>y1</code> sonra tek-ifade formu olarak <code>y2</code> hesaplar; <code>np.max(np.abs(y1 - y2))</code> sıfır yazdırır (FP32 yuvarlama özdeştir çünkü her iki yol aynı sıradaki aynı elementer op'ları çalıştırır). 4) Vurgu fusion'ın salt bir bellek-trafik optimizasyonu olduğudur — aritmetik ve sonuç bit'leri değişmez, sadece HBM gidiş-dönüş sayısı değişir.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CuPy Custom Kernel'ler — Diğer %5 için RawKernel</h2>
<p class="l-text">Bir CuPy işlemi mevcut olmadığında (veya birini tune etmek istediğinizde), <code>cupy.RawKernel</code> bir CUDA C string'ini doğrudan gömmenize izin verir. Tam CUDA semantiği alırsınız, ama Python içinde.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import cupy as cp

src = r'''
extern "C" __global__
void clipped_relu(const float* x, float* y, float lo, float hi, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i &gt;= N) return;
    float v = x[i];
    v = v &gt; 0 ? v : 0;
    v = v &gt; hi ? hi : v;
    v = v &lt; lo ? lo : v;
    y[i] = v;
}
'''
kernel = cp.RawKernel(src, 'clipped_relu')

N = 1_000_000
x = cp.random.randn(N, dtype=cp.float32)
y = cp.empty_like(x)
block = 256
grid  = (N + block - 1) // block
kernel((grid,), (block,), (x, y, cp.float32(0.0), cp.float32(6.0), N))
cp.cuda.Stream.null.synchronize()
print("clipped relu range:", y.min().item(), y.max().item())
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>extern "C"</code> ile bir CUDA C kernel kaynağını Python raw-string olarak gömer, böylece NVRTC CuPy'nin adıyla çözebileceği unmangled bir sembol üretir. 2) Kernel clipped ReLU hesaplar: <code>max(0, min(hi, max(lo, x)))</code> — MobileNet'in ReLU6'sında (hi=6) kullanılan aynı aktivasyon. 3) <code>cp.RawKernel(src, 'clipped_relu')</code> string'i ilk çağrıda derler ve cubin'i önbelleğe alır; sonraki çağrılar onu ücretsiz yeniden kullanır. 4) Başlatma sözdizimi <code>kernel((grid,), (block,), args)</code>, <code>&lt;&lt;&lt;&gt;&gt;&gt;</code>'i yansıtır ama grid/block için tuple kullanır; scalar arg'lar CUDA tiplerine sarılmalıdır (<code>cp.float32(0.0)</code>), böylece CuPy onları doğru geçer. 5) Sync'ten sonra <code>y.min()</code> 0 okur ve <code>y.max()</code> 6.0 okur — clip sınırları — kernel'in 1M FP32 değer boyunca sınırları eleman-eleman uyguladığını onaylar.</p>

<p class="l-text"><code>RawKernel</code>'i tutumlu kullanın. Ona sık sık başvuruyorsanız, Triton'a (Ders 5) geçin — size aynı ifade gücünü autotuning ile ve çok daha az boilerplate ile verir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Üç Python-GPU Tuzağı</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Örtük senkronizasyon</div><div class="card-body"><code>.item()</code>, <code>.cpu()</code>, <code>cp.asnumpy()</code> çağırmak veya bir GPU tensor'unu yazdırmak CPU'yu kuyrukta bekleyen tüm kernel'leri beklemeye zorlar. Bunu sıcak bir loop içinde yapmak throughput'u öldürür. Sona erteleyin.</div></div>
<div class="calc-card"><div class="card-title">2. Host tarafı Python loop'ları</div><div class="card-body">CuPy/Torch dizisi üzerinde Python'dan eleman-eleman iterasyon felakettir; her eleman bir kernel başlatmasını (veya daha kötüsü, bir HtoD kopyasını) tetikler. Her zaman vektörize edin.</div></div>
<div class="calc-card"><div class="card-title">3. Recompilation çilesi</div><div class="card-body">Numba ve Triton girdi şekilleri/dtype'lari değiştiğinde yeniden derler. Her iterasyonda FP32 ve FP16 karıştırmak recompile'lari tetikler, duvar saatini yer. Dtype'lari sabitleyin; şekil-stabil batch boyutları kullanın.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (KÖTÜ vs IYI)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># BAD — sync every iteration
import cupy as cp
x = cp.random.randn(1_000_000, dtype=cp.float32)
total = 0.0
for i in range(100):
    total += float((x * i).sum())     # .sum().item() forces sync, blocks GPU

# GOOD — accumulate on GPU, sync once at the end
total_gpu = cp.zeros((), dtype=cp.float32)
for i in range(100):
    total_gpu += (x * i).sum()        # all queued, async
print(float(total_gpu))               # one sync
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) KÖTÜ versiyon loop içinde <code>float((x * i).sum())</code> çağırır — örtük <code>.item()</code>, kuyruktaki tüm kernel pipeline'ını boşaltan ve bir scalar'i PCIe üzerinden 100 kez geri çeken bir sync zorlar. H100'de bu throughput'u mikrosaniyeden milisaniyeye düşürür. 2) IYI versiyon HBM'de yaşayan bir 0-d scalar tensor <code>total_gpu</code> oluşturur ve partial toplamları cihazda biriktirmek için <code>+=</code> kullanır. 3) Loop içinde hiçbir şey sync edilmez — kernel'ler varsayılan stream'de kuyruğa alınır ve Python'un loop yorumlamasıyla eşzamanlı çalışır. 4) Yalnızca son <code>float(total_gpu)</code> sona bir sync zorlar — tüm 100 iterasyonlu hesaplama ortada hiç PCIe gidiş-dönüşü olmadan pipeline yapar. Bu en yaygın Python-GPU tuzağıdır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Birleştiriyoruz — k-NN Mesafe Matrisi</h2>
<p class="l-text">Yaygın bir ML primitif: N sorgu vektörü ve M veritabanı vektörü verildiğinde, ikili Öklid mesafe matrisini hesaplayın. NumPy'daki naif ifade <em>(N×M×D)</em> gibi bellek kullanır. CuPy + standart <em>‖a-b‖² = ‖a‖² + ‖b‖² - 2·a·b</em> özdeşliği ile, tek bir matmul + iki outer add'e düşürülür — FAISS-GPU, RAPIDS cuML ve PyTorch'un <code>torch.cdist</code>'i tarafından kullanılan tam hile.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — 1-satır import takası ile CuPy'de çalışır)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np   # swap to: import cupy as np  on a GPU machine
import time

N, M, D = 5000, 5000, 256
queries  = np.random.randn(N, D).astype(np.float32)
database = np.random.randn(M, D).astype(np.float32)

t0 = time.perf_counter()
# ||a-b||^2 = ||a||^2 + ||b||^2 - 2 a.b
q2  = (queries  ** 2).sum(axis=1, keepdims=True)         # (N,1)
db2 = (database ** 2).sum(axis=1, keepdims=True).T       # (1,M)
qb  = queries @ database.T                               # (N,M) — the matmul
dist2 = q2 + db2 - 2 * qb
dist  = np.sqrt(np.maximum(dist2, 0))
elapsed = time.perf_counter() - t0

print(f"distance matrix shape: {dist.shape}, dtype: {dist.dtype}")
print(f"min/mean/max dist: {dist.min():.3f} / {dist.mean():.3f} / {dist.max():.3f}")
print(f"elapsed: {elapsed*1000:.1f} ms (CPU NumPy)")
print(f"On A100 CuPy: ~30 ms; H100: ~12 ms; that is the matmul ceiling for FP32")
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) N=M=5000 query/database vektörü ile D=256 boyutu seçer — FAISS benchmark'larında kullanılan aynı ölçek — ve GPU GEMM ile FP32 dtype tutarlılığını korumak için <code>np.random.randn(...).astype(np.float32)</code> kullanır. 2) ‖a−b‖² = ‖a‖² + ‖b‖² − 2·a·b cebirsel özdeşliğini uygular: satır başına norm'ları <code>q2</code> (şekil (N,1)) ve <code>db2.T</code> (şekil (1,M)) önceden hesaplar, sonra tek bir matmul <code>queries @ database.T</code> çapraz terimi (N,M) verir. 3) <code>q2 + db2 - 2*qb</code> ile üç parçayı yayar — NumPy yayını (N,1)+(1,M)+(N,M) şekil aritmetiğini halleder. 4) <code>np.maximum(dist2, 0)</code> küçücük negatif yuvarlamalara karşı koruma sağlar, sonra <code>np.sqrt</code> gerçek Öklid mesafe matrisini üretir. 5) Matmul tek pahalı adımdır (2NMD ≈ 12.8 GFLOPs); H100'de CuPy ile bu FP32 cuBLAS tavanına ~12 ms'de ulaşır — CPU NumPy'dan 30-60× daha hızlı, bir import-line uzakta.</p>

<p class="l-text">Bu tam anlamıyla hızlanma hikayesi: özdeş Python, bir import satırı, 30-60x throughput. CuPy GPU erişimi olan NumPy-akıcı uygulayıcılara mevcut en büyük "bedava kazanç"tir.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. Kernel füzyonu öncesi/sonrası bellek bant genişliği (görsel)</h2>
<p class="l-text">Birleştirilmemiş bir elementwise op zinciri (mul → add → relu → mul) her op arasında HBM'e ara tensor'ları geri yazar. Tek bir füzyon kernel'i ara değerleri register/shared memory'de tutar. Bar grafik aynı aritmetik için H100'de eleman başına HBM trafiğini karşılaştırır.</p>
<div id="plot-gpu-l4-bw-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Çoğu ML op'unda HBM bant genişliği baskın maliyet olduğu için, eleman başına byte'ı 4-8x kesmek tipik olarak 4-8x duvar-saati hızlanmasına çevrilir. Bu, fused kernel'ler, torch.compile ve FlashAttention'ın tüm motivasyonudur.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Numba/CuPy Tükendiğinde — ve Triton Başladığında</h2>
<p class="l-text">Numba elementwise kernel'ler için harikadır. CuPy mevcut bir NumPy/cuBLAS rutini ihtiyacınızla eşleştiğinde harikadır. Her ikisi de paylaşılan-bellek tile'lama, önemsiz olmayan yeniden kullanım veya donanım genelinde autotuning içeren özel bir kernel istediğinizde zorlanır. İki kanonik örnek matmul varyantları (block-sparse, mixed-precision, structured) ve attention'dir.</p>

<p class="l-text">Bunlar için Triton (Ders 5) varsayılan haline geldi. Size Numba gibi bir Python dekoratör'u verir, ancak blok-seviyesi (thread-seviyesi değil) primitiflere sahip, otomatik paylaşılan-bellek yönetimi ve blok boyutları üzerinde yerleşik autotune ile. Bugünün PyTorch ekosistemi (<code>torch.compile</code>, FlashAttention, vLLM kernel'leri, Mamba, Triton-tabanlı linear attention) büyük ölçüde Triton'da yazılmıştır. CUDA C / Numba dönemi bitmedi, ancak kernel araştırması stack'in yukarısına çıktı.</p>

<div class="calc-highlight"><strong>Bu dersten sonraki zihinsel model:</strong> ML için PyTorch + <code>torch.compile</code>'a varsayılan. ML olmayan numerik için CuPy'a varsayılan. Elementwise özel kernel'ler için Numba'ya başvurun. Özel her şeyin başka türlü için Triton'a atlayın — bu da bir sonraki dersin tam olarak konusu.</div>
</div>`
};
