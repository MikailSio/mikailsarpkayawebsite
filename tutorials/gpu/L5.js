window.GPU_L5 = {
en: `<p class="l-text"><strong>In 2021 OpenAI released Triton, and within three years it had quietly become the way new GPU kernels get written.</strong> FlashAttention v2/v3, the kernels behind <code>torch.compile</code>, vLLM's PagedAttention, Mamba's selective scan, almost every block-sparse attention paper since 2023 — all Triton. It is a Python-embedded DSL where you write code at the level of <em>blocks of elements</em>, not individual threads. The compiler handles thread mapping, shared-memory layout, vectorization, and bank-conflict avoidance. Add the <code>@triton.autotune</code> decorator and Triton tries dozens of block-size / num-warps / num-stages combinations and picks the fastest for your hardware. The result: 80–95% of CUTLASS performance with 1/10th the lines of code.</p>

<p class="l-text">In this lesson we explain Tritons block-level abstraction (the key idea), walk through a vector add and a matmul kernel in Triton syntax, look at <code>tl.load</code> / <code>tl.store</code> with masks (the bound-check disappears into a mask), introduce autotuning, and finally sketch how FlashAttention is structured in Triton — which is the canonical "this is why Triton exists" example. Pyodide demos show what each kernel computes via NumPy block tiles, so you can run the algorithm in the browser and verify correctness against the high-level operation.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why Tritons "block-level" abstraction is easier than CUDAs "thread-level" one</li>
<li>Read a Triton kernel and identify <code>tl.program_id</code>, <code>tl.arange</code>, <code>tl.load</code>, <code>tl.store</code> with masks</li>
<li>Write a Triton vector add and a tiled matmul</li>
<li>Apply <code>@triton.autotune</code> to search over block sizes and num-warps</li>
<li>Sketch the structure of FlashAttention in Triton (online softmax + tiled QK^T, V)</li>
<li>Decide between Triton, CUDA C, Numba, and CuPy for a given kernel-writing task</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Block-Level Programming — Triton's Big Idea</h2>
<p class="l-text">In CUDA you think in threads: "thread <em>i</em> reads x[i], computes y[i], writes it back". The compiler maps your loops to warps. You manage shared memory by hand. You worry about bank conflicts. The mental load is high.</p>

<p class="l-text">In Triton you think in <strong>blocks of elements</strong>: "this program instance handles the slice <code>x[bid*BLOCK : (bid+1)*BLOCK]</code> as a whole". You write code on entire vectors of length BLOCK at a time — like NumPy on a small array. The compiler decides how to map the block onto warps, where to put it in shared memory, how to vectorize loads, when to insert software pipelining. Bank conflicts are auto-avoided. The result reads like NumPy and runs like CUTLASS.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CUDA mental model</div><div class="card-body">Thread-level. You write what one thread does; the runtime spawns millions. Hand-manage shared memory and synchronization.</div></div>
<div class="calc-card"><div class="card-title">Triton mental model</div><div class="card-body">Block-level. You write what one program (= one block of threads) does on a tile of data. Compiler picks the thread layout. NumPy-like syntax inside the kernel.</div></div>
<div class="calc-card"><div class="card-title">Released</div><div class="card-body">Triton 1.0 in July 2021 (Tillet et al., OpenAI). Picked up by PyTorch (TorchInductor backend), FlashAttention v2 (Dao 2023), vLLM. Standard kernel language for ML by 2024.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Vector Add in Triton — The Hello World</h2>
<p class="l-text">Compare with the CUDA version from lesson 2. The kernel does the same job; the syntax is shorter and the bound-check is implicit via a mask.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — needs triton + GPU)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import torch, triton
import triton.language as tl

@triton.jit
def add_kernel(x_ptr, y_ptr, out_ptr, n_elements, BLOCK_SIZE: tl.constexpr):
    pid     = tl.program_id(axis=0)                            # which block
    offsets = pid * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)      # vector of indices
    mask    = offsets &lt; n_elements                              # bound check
    x = tl.load(x_ptr + offsets, mask=mask)
    y = tl.load(y_ptr + offsets, mask=mask)
    tl.store(out_ptr + offsets, x + y, mask=mask)

def add(x, y):
    out = torch.empty_like(x)
    n = x.numel()
    grid = lambda meta: (triton.cdiv(n, meta['BLOCK_SIZE']),)
    add_kernel[grid](x, y, out, n, BLOCK_SIZE=1024)
    return out

x = torch.randn(1_000_000, device='cuda')
y = torch.randn(1_000_000, device='cuda')
print(torch.allclose(add(x, y), x + y))   # True
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>@triton.jit</code> decorator marks <code>add_kernel</code> for JIT compilation to PTX by Triton's MLIR-based compiler — type annotations like <code>BLOCK_SIZE: tl.constexpr</code> tell Triton this value is a compile-time constant, allowing aggressive specialization. 2) <code>tl.program_id(axis=0)</code> returns the block index (the Triton equivalent of <code>blockIdx.x</code>); the program then computes a vector of <code>BLOCK_SIZE=1024</code> offsets using <code>tl.arange</code>. 3) <code>mask = offsets &lt; n_elements</code> replaces CUDA's <code>if (i &lt; N)</code> bound check — masked-off lanes contribute nothing to the store, eliminating the explicit branch. 4) <code>tl.load</code> issues a vectorized, coalesced, masked HBM read; the compiler chooses 128-bit transactions where possible. 5) The Python <code>add</code> wrapper computes the grid lambda <code>triton.cdiv(n, BLOCK_SIZE) = 977</code> blocks and launches with the bracket syntax; <code>torch.allclose</code> confirms correctness against <code>x + y</code>.</p>

<p class="l-text">Key new idioms: <code>tl.program_id(axis=0)</code> is "which block am I" (the Triton equivalent of <code>blockIdx.x</code>). <code>tl.arange(0, BLOCK_SIZE)</code> creates a vector. <code>tl.load(ptr + offsets, mask=mask)</code> performs a vectorized, masked, coalesced load — the compiler picks the optimal access pattern. There is no <code>__syncthreads</code> in this kernel because there is no shared-memory cooperation; the matmul example below shows that side.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — manual block-walk in NumPy</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N, BLOCK = 1_000_000, 1024
x = np.random.randn(N).astype(np.float32)
y = np.random.randn(N).astype(np.float32)
out = np.empty_like(x)

# Simulate Triton: one program per block, load BLOCK elements with mask, store
n_blocks = (N + BLOCK - 1) // BLOCK
for pid in range(n_blocks):
    offsets = pid * BLOCK + np.arange(BLOCK)
    mask = offsets &lt; N
    valid = offsets[mask]
    out[valid] = x[valid] + y[valid]

print("max err vs reference:", np.max(np.abs(out - (x + y))))
print(f"n_blocks = {n_blocks}, last block has {N - (n_blocks-1)*BLOCK} valid elements (rest masked off)")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the same N=1M and BLOCK=1024 as the Triton example so the simulation matches byte-for-byte. 2) Loops over <code>n_blocks = ceil(N/BLOCK) = 977</code> — one iteration plays the role of one Triton program. 3) Inside each "program", <code>offsets = pid * BLOCK + np.arange(BLOCK)</code> builds the same length-1024 index vector <code>tl.arange</code> produces, then <code>mask = offsets &lt; N</code> filters out indices past the end. 4) The vectorized write <code>out[valid] = x[valid] + y[valid]</code> simulates <code>tl.store(... mask=mask)</code> — only the in-bound lanes write. 5) The final asserts compare to <code>x + y</code> and report the last block's valid-count (most blocks fill exactly 1024 lanes; the last block has fewer and the mask handles the tail).</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tiled Matmul in Triton — Where the Magic Shows</h2>
<p class="l-text">The 30-line CUDA matmul of lesson 3 (with <code>__shared__</code> tiles, <code>__syncthreads</code>, careful bank-conflict avoidance) becomes about 25 lines in Triton, and the compiler handles every layout subtlety. This is the canonical "Triton is shorter and as fast" demonstration.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Triton matmul)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>@triton.jit
def matmul_kernel(
    A_ptr, B_ptr, C_ptr, M, N, K,
    stride_am, stride_ak, stride_bk, stride_bn, stride_cm, stride_cn,
    BLOCK_M: tl.constexpr, BLOCK_N: tl.constexpr, BLOCK_K: tl.constexpr,
):
    pid_m = tl.program_id(0)
    pid_n = tl.program_id(1)
    offs_m = pid_m * BLOCK_M + tl.arange(0, BLOCK_M)
    offs_n = pid_n * BLOCK_N + tl.arange(0, BLOCK_N)
    offs_k = tl.arange(0, BLOCK_K)

    a_ptrs = A_ptr + (offs_m[:, None] * stride_am + offs_k[None, :] * stride_ak)
    b_ptrs = B_ptr + (offs_k[:, None] * stride_bk + offs_n[None, :] * stride_bn)

    acc = tl.zeros((BLOCK_M, BLOCK_N), dtype=tl.float32)
    for k in range(0, K, BLOCK_K):
        a = tl.load(a_ptrs, mask=(offs_k[None, :] + k) &lt; K, other=0.0)
        b = tl.load(b_ptrs, mask=(offs_k[:, None] + k) &lt; K, other=0.0)
        acc += tl.dot(a, b)                # tensor-core matmul on the tile
        a_ptrs += BLOCK_K * stride_ak
        b_ptrs += BLOCK_K * stride_bk

    c_ptrs = C_ptr + (offs_m[:, None] * stride_cm + offs_n[None, :] * stride_cn)
    tl.store(c_ptrs, acc.to(tl.float16),
             mask=(offs_m[:, None] &lt; M) &amp; (offs_n[None, :] &lt; N))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The kernel takes raw pointers plus row/col strides (so it works for non-contiguous tensors), with <code>BLOCK_M</code>, <code>BLOCK_N</code>, <code>BLOCK_K</code> as constexpr tile dimensions. 2) A 2D program grid (<code>pid_m</code>, <code>pid_n</code>) assigns each kernel a BLOCK_M × BLOCK_N output tile of C; <code>offs_m[:, None] * stride_am + offs_k[None, :] * stride_ak</code> uses NumPy-style broadcasting to build a 2D pointer matrix into A — Triton treats this as a single tile load. 3) <code>acc = tl.zeros((BLOCK_M, BLOCK_N), dtype=tl.float32)</code> reserves a FP32 register tile for the running sum; FP32 accumulation is essential to stay numerically clean even when A and B are FP16/BF16. 4) The k-loop tiles the K dimension in BLOCK_K chunks: load A and B tiles with masks for the tail, run <code>tl.dot(a, b)</code> which the compiler lowers to <code>mma</code>/<code>wgmma</code> Tensor Core instructions, advance both pointer tiles by BLOCK_K × stride. 5) After the loop, downcast to FP16 and store with a 2D bound-check mask so partial tiles at the matrix edge don't corrupt memory — every shared-memory layout, bank-conflict pad, and vectorized load is chosen automatically by Triton.</p>

<p class="l-text">What you do <em>not</em> see here, that you would in CUDA: explicit <code>__shared__</code> declarations, <code>__syncthreads</code>, +1 padding for bank conflicts, vectorized 128-bit loads. Triton emits all of those automatically based on the block shapes you chose.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Autotuning — Let the Compiler Pick</h2>
<p class="l-text">The right block size depends on the hardware (H100 vs A100 vs 4090) and on the problem shape (square 4k×4k matmul vs tall 4096×128). Hand-picking is fragile. Triton's <code>@triton.autotune</code> takes a list of configs and runs each on a small sample, picking the fastest. Caches results per shape.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>@triton.autotune(
    configs=[
        triton.Config({'BLOCK_M':128,'BLOCK_N':128,'BLOCK_K':32}, num_warps=4, num_stages=3),
        triton.Config({'BLOCK_M':128,'BLOCK_N':256,'BLOCK_K':32}, num_warps=8, num_stages=3),
        triton.Config({'BLOCK_M':256,'BLOCK_N':128,'BLOCK_K':32}, num_warps=8, num_stages=3),
        triton.Config({'BLOCK_M':64, 'BLOCK_N':256,'BLOCK_K':64}, num_warps=4, num_stages=4),
    ],
    key=['M', 'N', 'K'],   # cache key
)
@triton.jit
def matmul_kernel_autotuned(A_ptr, B_ptr, C_ptr, M, N, K, ...):
    ...   # same body as above
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Wraps the JIT'd kernel with <code>@triton.autotune</code>, supplying a list of candidate <code>triton.Config</code> objects — each specifies tile dims (BLOCK_M/N/K), how many warps the block uses (<code>num_warps</code>) and how many software-pipeline stages prefetch ahead (<code>num_stages</code>). 2) The 4 configs sweep a representative space: 128×128 with 4 warps, the wider 128×256 and 256×128 with 8 warps (more SM resources, suited to large M/N), and a 64×256 with bigger BLOCK_K=64 + 4-stage pipeline for K-heavy shapes. 3) <code>key=['M','N','K']</code> tells Triton to cache the winning config per distinct matrix shape — recompile only happens when (M,N,K) changes. 4) On first call with new shape, Triton runs each config on a small benchmark (a few hundred microseconds), measures throughput, picks the fastest; subsequent calls of that shape use the cached choice. 5) The decorator chain order matters: <code>@autotune</code> must be outside <code>@jit</code> so it sees the un-specialized kernel.</p>

<p class="l-text"><code>num_warps</code> controls how many warps the block uses (CUDA-side). <code>num_stages</code> controls software-pipelined prefetching — Triton issues the next iteration's loads while the current iteration's <code>tl.dot</code> runs, hiding HBM latency. These two knobs alone often double throughput; autotune searches them automatically.</p>

<div class="calc-highlight"><strong>Cost:</strong> autotune can take seconds the first time it sees a new shape. Use the shape-cache key wisely (M, N, K is normal; for batched ops include batch). Triton's persistent cache survives Python sessions.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Online Softmax — The Building Block of FlashAttention</h2>
<p class="l-text">FlashAttention's central trick (lesson 6) is computing softmax incrementally without ever materializing the full N×N attention matrix. The math relies on a <strong>numerically stable online softmax</strong>: as you stream values <em>x</em>, keep a running max <em>m</em> and a running normalizer <em>l</em>, rescaling whenever <em>m</em> jumps. The recurrence:</p>

<div class="katex-block">$$m_i = \\max(m_{i-1}, x_i), \\qquad l_i = e^{m_{i-1} - m_i} \\, l_{i-1} + e^{x_i - m_i}$$</div>

<p class="l-text">After streaming all N values, <em>softmax(x)<sub>i</sub> = e<sup>x<sub>i</sub> − m<sub>N</sub></sup> / l<sub>N</sub></em>. The point is that this works <em>in chunks</em> — process a block, get partial (m, l), process the next block and combine. That is exactly how FlashAttention computes attention output without ever holding QK<sup>T</sup> in HBM.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — online softmax in NumPy, exactly the FlashAttention recurrence</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.random.randn(2048).astype(np.float32) * 5

# Reference: standard softmax
mx = x.max()
ref = np.exp(x - mx) / np.exp(x - mx).sum()

# Online softmax — process in BLOCK-sized chunks
BLOCK = 64
m, l = -np.inf, 0.0
for i in range(0, len(x), BLOCK):
    block = x[i:i+BLOCK]
    m_block = block.max()
    m_new   = max(m, m_block)
    # rescale old normalizer to the new max
    l = np.exp(m - m_new) * l + np.exp(block - m_new).sum()
    m = m_new

# Second pass: compute output with final (m, l)
out = np.exp(x - m) / l

print(f"max err vs reference: {np.max(np.abs(out - ref)):.2e}")
print(f"sum of online softmax: {out.sum():.6f}  (should be 1.0)")
print(f"max of x: {x.max():.3f}, online m: {m:.3f}  (must match)")
print(f"This recurrence is exactly what FlashAttention runs inside a Triton kernel.")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a 2048-element FP32 random vector (scaled by 5 to widen the range and exercise the rescaling math) and computes a reference softmax the standard way: <code>exp(x - max(x)) / sum</code>. 2) Initializes the online state <code>m = -inf</code> and <code>l = 0.0</code>, then streams x in 64-element chunks — exactly the way FlashAttention's K/V loop processes attention scores tile-by-tile. 3) For each chunk computes <code>m_new = max(m, block.max())</code>, then rescales the old normalizer with <code>l = exp(m - m_new) * l + sum(exp(block - m_new))</code> — the key rescaling trick that keeps everything numerically stable when the running max jumps. 4) After the streaming pass, a second pass computes the final softmax with <code>exp(x - m) / l</code>. 5) Verifies max-err against the reference is ~1e-7 (FP32 round-off, not a bug) and that the running max <code>m</code> equals <code>x.max()</code>. This recurrence is the exact NumPy mirror of what FlashAttention runs inside a Triton kernel.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. FlashAttention Sketch in Triton</h2>
<p class="l-text">FlashAttention (Dao 2022) computes O = softmax(QK<sup>T</sup>/√d) V <em>without</em> materializing the N×N QK<sup>T</sup> matrix. Standard attention reads Q, K, V from HBM, computes S = QK<sup>T</sup> (writes N² bytes back), reads S to compute softmax (writes N² again), reads softmax output and V to compute O. FlashAttention fuses everything into one pass with online softmax, doing N² FLOPs but only O(N·d) HBM traffic. Same answer, much higher arithmetic intensity, much faster on long sequences.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Triton FlashAttention skeleton)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>@triton.jit
def flash_attn_kernel(Q, K, V, O, scale,
                     BLOCK_M: tl.constexpr, BLOCK_N: tl.constexpr,
                     D: tl.constexpr, N: tl.constexpr):
    # one program handles one BLOCK_M of queries
    pid_m  = tl.program_id(0)
    offs_m = pid_m * BLOCK_M + tl.arange(0, BLOCK_M)
    offs_d = tl.arange(0, D)

    q = tl.load(Q + offs_m[:, None] * D + offs_d[None, :])     # (BLOCK_M, D)
    m_i = tl.full((BLOCK_M,), -float('inf'), dtype=tl.float32)
    l_i = tl.zeros((BLOCK_M,), dtype=tl.float32)
    acc = tl.zeros((BLOCK_M, D), dtype=tl.float32)

    # stream over K/V in BLOCK_N tiles
    for j in range(0, N, BLOCK_N):
        offs_n = j + tl.arange(0, BLOCK_N)
        k = tl.load(K + offs_n[:, None] * D + offs_d[None, :])
        v = tl.load(V + offs_n[:, None] * D + offs_d[None, :])
        s = tl.dot(q, tl.trans(k)) * scale                      # (BLOCK_M, BLOCK_N)
        m_new = tl.maximum(m_i, tl.max(s, axis=1))
        alpha = tl.exp(m_i - m_new)
        p     = tl.exp(s - m_new[:, None])
        l_new = alpha * l_i + tl.sum(p, axis=1)
        acc   = acc * alpha[:, None] + tl.dot(p.to(v.dtype), v)
        m_i, l_i = m_new, l_new

    acc = acc / l_i[:, None]
    tl.store(O + offs_m[:, None] * D + offs_d[None, :], acc)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Each program handles one BLOCK_M-row slice of the query matrix Q; loads the (BLOCK_M, D) Q tile once into registers — it stays resident for the whole kernel, never re-read from HBM. 2) Initializes the online softmax state: running max <code>m_i = -inf</code>, normalizer <code>l_i = 0</code>, and a (BLOCK_M, D) accumulator <code>acc</code> for the output. 3) The j-loop streams K and V in BLOCK_N tiles — load <code>k</code> and <code>v</code> tiles, compute scaled scores <code>s = q @ k.T * scale</code> using Tensor Cores via <code>tl.dot</code>. 4) Updates running max with <code>m_new = max(m_i, s.max(axis=1))</code>, rescales the prior accumulator by <code>alpha = exp(m_i - m_new)</code>, computes new probabilities <code>p = exp(s - m_new)</code>, and accumulates <code>acc = acc * alpha + p @ v</code> — the FlashAttention online softmax recurrence. 5) After the entire K/V stream, normalize once with <code>acc / l_i</code> and write the O tile back — the (N, N) attention matrix never lives in HBM, only in registers, reducing memory traffic from O(N²) to O(N·d).</p>

<p class="l-text">This is ~25 lines and is within ~10% of the hand-tuned CUTLASS FlashAttention v2 on H100. Lesson 6 dissects this kernel in detail and traces the v1 → v2 → v3 evolution.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Numpy Block Tiling — How a Triton Block "Sees" Memory</h2>
<p class="l-text">A useful mental exercise: simulate a Triton matmul block by block in NumPy and confirm it matches a single matmul. This makes the "block-level" abstraction concrete.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

M, N, K = 256, 256, 256
BLOCK_M, BLOCK_N, BLOCK_K = 64, 64, 32
A = np.random.randn(M, K).astype(np.float32)
B = np.random.randn(K, N).astype(np.float32)
C = np.zeros((M, N), dtype=np.float32)

# Walk programs (pid_m, pid_n)
for pid_m in range(M // BLOCK_M):
    for pid_n in range(N // BLOCK_N):
        # Each "program" computes a BLOCK_M x BLOCK_N tile of C
        acc = np.zeros((BLOCK_M, BLOCK_N), dtype=np.float32)
        for k_start in range(0, K, BLOCK_K):
            a = A[pid_m*BLOCK_M:(pid_m+1)*BLOCK_M, k_start:k_start+BLOCK_K]   # tl.load
            b = B[k_start:k_start+BLOCK_K, pid_n*BLOCK_N:(pid_n+1)*BLOCK_N]   # tl.load
            acc += a @ b                                                       # tl.dot
        C[pid_m*BLOCK_M:(pid_m+1)*BLOCK_M, pid_n*BLOCK_N:(pid_n+1)*BLOCK_N] = acc  # tl.store

print("max err vs A @ B:", np.max(np.abs(C - A @ B)))
print(f"programs launched: {(M//BLOCK_M) * (N//BLOCK_N)}  (one per output tile)")
print(f"k-loop iterations per program: {K // BLOCK_K}")
print(f"tl.dot calls total: {(M//BLOCK_M)*(N//BLOCK_N)*(K//BLOCK_K)}")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets a small 256×256×256 problem with BLOCK_M=BLOCK_N=64 and BLOCK_K=32 so the simulation runs in milliseconds in Pyodide and we can count program launches exactly. 2) The outer (pid_m, pid_n) loops play the role of Triton's 2D program grid: each iteration handles one BLOCK_M × BLOCK_N output tile. 3) Inside each "program" the inner k-loop streams BLOCK_K-wide slices of A and B (the <code>a</code> and <code>b</code> assignments are the NumPy equivalents of <code>tl.load</code>) and accumulates <code>a @ b</code> into a register tile <code>acc</code> — exactly what <code>tl.dot</code> does on Tensor Cores. 4) After the k-loop, the slice assignment <code>C[...] = acc</code> mirrors <code>tl.store</code>. 5) Prints program count (4×4=16, one per output tile), k-iterations per program (8), and total <code>tl.dot</code> calls (128) — the exact dispatch profile a Triton kernel would generate.</p>

<p class="l-text">On the GPU, each "program" runs as a block of threads cooperating on the tile. The compiler picks the thread layout to make <code>tl.dot</code> hit the tensor cores. You write block-level NumPy; you get tensor-core code.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. When To Use Triton vs the Alternatives</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use Triton</div><div class="card-body">Custom matmul-shaped or attention-shaped kernels. Anything with shared-memory tiling and reuse. Production ML kernels (FlashAttention, paged attention, fused activations). Anything you would have written in CUTLASS three years ago.</div></div>
<div class="calc-card"><div class="card-title">Use Numba</div><div class="card-body">Elementwise and map-style kernels with custom logic (Mandelbrot, custom losses, simulation). Small one-off scripts. When you do not want to install Triton's heavier toolchain.</div></div>
<div class="calc-card"><div class="card-title">Use CuPy</div><div class="card-body">Existing NumPy code that just needs to be faster. cuBLAS / cuFFT / cuSPARSE wrappers. RAPIDS-friendly pipelines.</div></div>
<div class="calc-card"><div class="card-title">Use raw CUDA</div><div class="card-body">Warp-shuffle intrinsics, FP8/FP4 tensor-core programming on cutting-edge hardware (Blackwell), large libraries with C++ template metaprogramming (CUTLASS, NCCL). Triton catches up here usually within a year.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Where Triton Fits in the Stack</h2>
<p class="l-text">Mental picture for the modern ML stack: PyTorch's user-facing tensor API → <code>torch.compile</code> traces and fuses → emits Triton for unfused / custom ops → Triton lowers to PTX → driver loads onto SMs. FlashAttention and its descendants live as Triton kernels too, sometimes called from PyTorch directly. The CUDA C compiler is still in the chain — Triton uses NVIDIA's CUDA backend — but you almost never touch it as an ML practitioner anymore.</p>

<p class="l-text">Lesson 6 zooms into the most important Triton kernel of the LLM era — FlashAttention v1, v2, v3 — and shows exactly how it cut attention's HBM footprint from O(N²) to O(N), why that mattered for context-length scaling, and how the FP8 v3 variant on H100 squeezes another 1.5–2x. Everything in this lesson is the language we will use.</p>
</div>`,
tr: `<p class="l-text"><strong>2021'de OpenAI Triton'ı yayınladı ve üç yıl içinde sessizce yeni GPU kernel'lerinin yazılış şekli haline geldi.</strong> FlashAttention v2/v3, <code>torch.compile</code> arkasındaki kernel'ler, vLLM'nin PagedAttention'i, Mamba'nın selective scan'i, 2023'ten beri neredeyse her block-sparse attention makalesi — hepsi Triton. <em>Bireysel thread'ler değil, eleman blokları</em> seviyesinde kod yazdığınız Python-gömülü bir DSL'dir. Derleyici thread haritalamasını, paylaşılan-bellek yerleşimini, vektörlemeyi ve bank-çakışması önlemini halleder. <code>@triton.autotune</code> dekoratörünü ekleyin, Triton onlarca block-size / num-warps / num-stages kombinasyonunu dener ve donanımınız için en hızlısını seçer. Sonuç: kod satırlarının 1/10'u ile CUTLASS performansının %80-95'i.</p>

<p class="l-text">Bu derste Triton'ın blok-seviyesi soyutlamasını (anahtar fikir) açıklıyoruz, Triton sözdiziminde bir vektör toplama ve matmul kernel'i yürüyoruz, maskelerle <code>tl.load</code> / <code>tl.store</code>'a bakıyoruz (sınır kontrolü bir maskeye karışır), autotuning'i tanıtıyoruz ve son olarak FlashAttention'ın Triton'da nasıl yapılandırıldığını çizen — kanonik "Triton'ın var olmasının nedeni budur" örneği. Pyodide demo'lar her kernel'in ne hesapladığını NumPy blok tile'ları üzerinden gösterir, böylece algoritmayı tarayıcıda çalıştırabilir ve yüksek seviyeli operasyon karşısında doğruluğu doğrulayabilirsiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Triton'ın "blok-seviyesi" soyutlamasının neden CUDA'nın "thread-seviyesi"nden daha kolay olduğunu açıkla</li>
<li>Bir Triton kernel'ini oku ve maskelerle <code>tl.program_id</code>, <code>tl.arange</code>, <code>tl.load</code>, <code>tl.store</code>'u tanı</li>
<li>Bir Triton vektör toplama ve tile'lı matmul yaz</li>
<li>Blok boyutları ve num-warps üzerinde aramak için <code>@triton.autotune</code> uygula</li>
<li>FlashAttention'ın Triton'daki yapısını çiz (online softmax + tile'lı QK^T, V)</li>
<li>Verilen bir kernel-yazma görevi için Triton, CUDA C, Numba ve CuPy arasında karar ver</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Blok-Seviyesi Programlama — Triton'ın Büyük Fikri</h2>
<p class="l-text">CUDA'da thread'ler cinsinden düşünürsünüz: "thread <em>i</em> x[i]'yi okur, y[i]'yi hesaplar, geri yazar". Derleyici loop'larınızı warp'lara haritalar. Paylaşılan belleği elle yönetirsiniz. Bank çakışmaları hakkında endişelenirsiniz. Zihinsel yük yüksektir.</p>

<p class="l-text">Triton'da <strong>eleman blokları</strong> cinsinden düşünürsünüz: "bu program örneği <code>x[bid*BLOCK : (bid+1)*BLOCK]</code> dilimini bir bütün olarak işler". Kodu aynı anda BLOCK uzunluğunda tüm vektörler üzerinde yazarsınız — küçük bir array üzerinde NumPy gibi. Derleyici bloğu warp'lara nasıl haritalayacağına, paylaşılan belleğe nereye yerleştireceğine, yüklemeleri nasıl vektörize edeceğine, software pipelining'i ne zaman ekleyeceğine karar verir. Bank çakışmaları otomatik önlenir. Sonuç NumPy gibi okunur ve CUTLASS gibi çalışır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CUDA zihinsel modeli</div><div class="card-body">Thread-seviyesi. Bir thread'in ne yaptığını yazarsınız; runtime milyonlarcasını oluşturur. Paylaşılan bellek ve senkronizasyonu elle yönetin.</div></div>
<div class="calc-card"><div class="card-title">Triton zihinsel modeli</div><div class="card-body">Blok-seviyesi. Bir programın (= bir thread bloğu) bir veri tile'i üzerinde ne yaptığını yazarsınız. Derleyici thread düzenini seçer. Kernel içinde NumPy benzeri sözdizimi.</div></div>
<div class="calc-card"><div class="card-title">Yayınlandı</div><div class="card-body">Triton 1.0 Temmuz 2021'de (Tillet et al., OpenAI). PyTorch (TorchInductor backend), FlashAttention v2 (Dao 2023), vLLM tarafından benimsendi. 2024'te ML için standart kernel dili.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Triton'da Vektör Add — Hello World</h2>
<p class="l-text">Ders 2'deki CUDA versiyonu ile karşılaştırın. Kernel aynı işi yapar; sözdizimi daha kısadır ve sınır kontrolü bir maske aracılığıyla örtük olarak gerçekleşir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — triton + GPU gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import torch, triton
import triton.language as tl

@triton.jit
def add_kernel(x_ptr, y_ptr, out_ptr, n_elements, BLOCK_SIZE: tl.constexpr):
    pid     = tl.program_id(axis=0)                            # which block
    offsets = pid * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)      # vector of indices
    mask    = offsets &lt; n_elements                              # bound check
    x = tl.load(x_ptr + offsets, mask=mask)
    y = tl.load(y_ptr + offsets, mask=mask)
    tl.store(out_ptr + offsets, x + y, mask=mask)

def add(x, y):
    out = torch.empty_like(x)
    n = x.numel()
    grid = lambda meta: (triton.cdiv(n, meta['BLOCK_SIZE']),)
    add_kernel[grid](x, y, out, n, BLOCK_SIZE=1024)
    return out

x = torch.randn(1_000_000, device='cuda')
y = torch.randn(1_000_000, device='cuda')
print(torch.allclose(add(x, y), x + y))   # True
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>@triton.jit</code> dekoratörü <code>add_kernel</code>'i Triton'ın MLIR tabanlı derleyicisi tarafından PTX'e JIT derlenmesi için işaretler — <code>BLOCK_SIZE: tl.constexpr</code> gibi tip anotasyonları Triton'a bu değerin compile-time sabit olduğunu söyler, agresif specialization'a izin verir. 2) <code>tl.program_id(axis=0)</code> blok indeksini döndürür (Triton'ın <code>blockIdx.x</code> karşılığı); program sonra <code>tl.arange</code> kullanarak <code>BLOCK_SIZE=1024</code> offset vektörü hesaplar. 3) <code>mask = offsets &lt; n_elements</code> CUDA'nın <code>if (i &lt; N)</code> sınır kontrolünün yerini alır — maskelenen lane'ler store'a katkı vermez, açık branch'ı ortadan kaldırır. 4) <code>tl.load</code> vektörize, coalesced, maskeli bir HBM okuması yapar; derleyici mümkün olduğunda 128-bit transaksiyonlar seçer. 5) Python <code>add</code> wrapper'i grid lambda'sını <code>triton.cdiv(n, BLOCK_SIZE) = 977</code> blok olarak hesaplar ve köşeli parantez sözdizimi ile başlatır; <code>torch.allclose</code> <code>x + y</code> karşısında doğruluğu onaylar.</p>

<p class="l-text">Anahtar yeni deyimler: <code>tl.program_id(axis=0)</code> "hangi bloğum" demektir (Triton'ın <code>blockIdx.x</code> eşdeğeri). <code>tl.arange(0, BLOCK_SIZE)</code> bir vektör oluşturur. <code>tl.load(ptr + offsets, mask=mask)</code> vektörize, maskeli, birleşik bir yükleme gerçekleştirir — derleyici en uygun erişim modelini seçer. Bu kernel'de <code>__syncthreads</code> yoktur çünkü paylaşılan-bellek işbirliği yoktur; aşağıdaki matmul örneği o tarafı gösterir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — NumPy'da el ile blok yürüyüşü</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N, BLOCK = 1_000_000, 1024
x = np.random.randn(N).astype(np.float32)
y = np.random.randn(N).astype(np.float32)
out = np.empty_like(x)

# Simulate Triton: one program per block, load BLOCK elements with mask, store
n_blocks = (N + BLOCK - 1) // BLOCK
for pid in range(n_blocks):
    offsets = pid * BLOCK + np.arange(BLOCK)
    mask = offsets &lt; N
    valid = offsets[mask]
    out[valid] = x[valid] + y[valid]

print("max err vs reference:", np.max(np.abs(out - (x + y))))
print(f"n_blocks = {n_blocks}, last block has {N - (n_blocks-1)*BLOCK} valid elements (rest masked off)")
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Triton örneği ile aynı N=1M ve BLOCK=1024'u kurar, böylece simülasyon byte-byte eşleşir. 2) <code>n_blocks = ceil(N/BLOCK) = 977</code> üzerinde döngü yapar — bir iterasyon bir Triton programının rolünü oynar. 3) Her "program" içinde, <code>offsets = pid * BLOCK + np.arange(BLOCK)</code>, <code>tl.arange</code>'in ürettiği aynı uzunluk-1024 indeks vektörünü inşa eder, sonra <code>mask = offsets &lt; N</code> sondan sonraki indeksleri filtreler. 4) Vektörize yazma <code>out[valid] = x[valid] + y[valid]</code>, <code>tl.store(... mask=mask)</code>'i simüle eder — yalnızca sınır içi lane'ler yazar. 5) Son assert <code>x + y</code> ile karşılaştırır ve son bloğun geçerli sayısını raporlar (çoğu blok tam 1024 lane doldurur; son blok daha az içerir ve maske kuyruğu yönetir).</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Triton'da Tile'li Matmul — Sihrin Göründüğü Yer</h2>
<p class="l-text">Ders 3'ün 30 satırlık CUDA matmul'u (<code>__shared__</code> tile'ları, <code>__syncthreads</code>, dikkatli bank-çakışması önleme ile) Triton'da ~25 satıra düşer ve derleyici her düzen inceliğini halleder. Bu, kanonik "Triton hem daha kısa hem de hızlıdır" gösterimidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Triton matmul)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>@triton.jit
def matmul_kernel(
    A_ptr, B_ptr, C_ptr, M, N, K,
    stride_am, stride_ak, stride_bk, stride_bn, stride_cm, stride_cn,
    BLOCK_M: tl.constexpr, BLOCK_N: tl.constexpr, BLOCK_K: tl.constexpr,
):
    pid_m = tl.program_id(0)
    pid_n = tl.program_id(1)
    offs_m = pid_m * BLOCK_M + tl.arange(0, BLOCK_M)
    offs_n = pid_n * BLOCK_N + tl.arange(0, BLOCK_N)
    offs_k = tl.arange(0, BLOCK_K)

    a_ptrs = A_ptr + (offs_m[:, None] * stride_am + offs_k[None, :] * stride_ak)
    b_ptrs = B_ptr + (offs_k[:, None] * stride_bk + offs_n[None, :] * stride_bn)

    acc = tl.zeros((BLOCK_M, BLOCK_N), dtype=tl.float32)
    for k in range(0, K, BLOCK_K):
        a = tl.load(a_ptrs, mask=(offs_k[None, :] + k) &lt; K, other=0.0)
        b = tl.load(b_ptrs, mask=(offs_k[:, None] + k) &lt; K, other=0.0)
        acc += tl.dot(a, b)                # tensor-core matmul on the tile
        a_ptrs += BLOCK_K * stride_ak
        b_ptrs += BLOCK_K * stride_bk

    c_ptrs = C_ptr + (offs_m[:, None] * stride_cm + offs_n[None, :] * stride_cn)
    tl.store(c_ptrs, acc.to(tl.float16),
             mask=(offs_m[:, None] &lt; M) &amp; (offs_n[None, :] &lt; N))
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Kernel ham pointer'lar artı satır/sütun stride'ları alır (böylece non-contiguous tensorlar için çalışır), <code>BLOCK_M</code>, <code>BLOCK_N</code>, <code>BLOCK_K</code> constexpr tile boyutları olarak. 2) 2D program grid (<code>pid_m</code>, <code>pid_n</code>) her kernel'e C'nin bir BLOCK_M × BLOCK_N çıktı tile'ini atar; <code>offs_m[:, None] * stride_am + offs_k[None, :] * stride_ak</code> A'ya bir 2D pointer matrisi inşa etmek için NumPy tarzı yayını kullanır — Triton bunu tek bir tile load olarak işler. 3) <code>acc = tl.zeros((BLOCK_M, BLOCK_N), dtype=tl.float32)</code> çalışan toplam için bir FP32 register tile'ı rezerve eder; A ve B FP16/BF16 olduğunda bile numerik temizliği korumak için FP32 birikim esastır. 4) k-loop K boyutunu BLOCK_K parçalarında tile'lar: kuyruk için maskelerle A ve B tile'larını yükle, derleyicinin <code>mma</code>/<code>wgmma</code> Tensor Core yönergelerine indirdiği <code>tl.dot(a, b)</code>'ı çalıştır, her iki pointer tile'ı BLOCK_K × stride ile ilerlet. 5) Loop sonrası, FP16'ya downcast et ve matris kenarındaki kısmi tile'ların belleği bozmaması için 2D sınır-kontrol maskesiyle store et — her paylaşılan-bellek düzeni, bank-çakışma pad'i ve vektörize yükleme Triton tarafından otomatik seçilir.</p>

<p class="l-text">Burada <em>görmediğiniz</em>, ancak CUDA'da görecekleriniz: açık <code>__shared__</code> bildirimleri, <code>__syncthreads</code>, bank çakışmaları için +1 padding, vektörize 128-bit yüklemeler. Triton, seçtiğiniz blok şekillerine göre bunların hepsini otomatik olarak yayar.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Autotuning — Bırakın Derleyici Seçsin</h2>
<p class="l-text">Doğru blok boyutu donanıma (H100 vs A100 vs 4090) ve problem şekline (kare 4k×4k matmul vs uzun 4096×128) bağlıdır. Elle seçmek kırılgandır. Triton'ın <code>@triton.autotune</code>'u bir konfigürasyon listesi alır, her birini küçük bir örnek üzerinde çalıştırır ve en hızlıyı seçer. Şekil başına sonuçları önbelleğe alır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>@triton.autotune(
    configs=[
        triton.Config({'BLOCK_M':128,'BLOCK_N':128,'BLOCK_K':32}, num_warps=4, num_stages=3),
        triton.Config({'BLOCK_M':128,'BLOCK_N':256,'BLOCK_K':32}, num_warps=8, num_stages=3),
        triton.Config({'BLOCK_M':256,'BLOCK_N':128,'BLOCK_K':32}, num_warps=8, num_stages=3),
        triton.Config({'BLOCK_M':64, 'BLOCK_N':256,'BLOCK_K':64}, num_warps=4, num_stages=4),
    ],
    key=['M', 'N', 'K'],   # cache key
)
@triton.jit
def matmul_kernel_autotuned(A_ptr, B_ptr, C_ptr, M, N, K, ...):
    ...   # same body as above
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) JIT'lenmiş kernel'i <code>@triton.autotune</code> ile sarar, aday <code>triton.Config</code> nesnelerinin bir listesini sağlar — her biri tile dim'lerini (BLOCK_M/N/K), bloğun kaç warp kullandığını (<code>num_warps</code>) ve önbellekte ileri alan kaç software-pipeline aşaması olduğunu (<code>num_stages</code>) belirtir. 2) 4 config temsili bir alanı süpürür: 4 warp ile 128×128, 8 warp ile (büyük M/N'ye uygun, daha fazla SM kaynağı) daha geniş 128×256 ve 256×128 ve K-yoğun şekiller için daha büyük BLOCK_K=64 + 4-aşama pipeline ile 64×256. 3) <code>key=['M','N','K']</code> Triton'a kazanan config'i her farklı matris şekli başına önbelleğe almasını söyler — yalnızca (M,N,K) değiştiğinde recompile olur. 4) Yeni şekille ilk çağrıda Triton her config'i küçük bir benchmark'ta (birkaç yüz mikrosaniye) çalıştırır, throughput'u ölçer, en hızlıyı seçer; o şeklin sonraki çağrıları önbellekteki seçimi kullanır. 5) Dekoratör zinciri sırası önemlidir: <code>@autotune</code> <code>@jit</code>'in dışında olmalıdır, böylece specialize edilmemiş kernel'i görür.</p>

<p class="l-text"><code>num_warps</code> bloğun kaç warp kullanacağını kontrol eder (CUDA tarafı). <code>num_stages</code> software-pipelined prefetching'i kontrol eder — Triton bir sonraki iterasyonun yüklemelerini mevcut iterasyonun <code>tl.dot</code>'i çalışırken yayınlar, HBM gecikmesini gizler. Bu iki düğme genellikle throughput'u ikiye katlar; autotune onları otomatik olarak arar.</p>

<div class="calc-highlight"><strong>Maliyet:</strong> autotune yeni bir şekil gördüğü ilk seferde saniyeler sürebilir. Şekil-önbellek anahtarını bilgece kullanın (M, N, K normaldir; batch'li op'lar için batch'i dahil edin). Triton'ın kalıcı önbelleği Python oturumlarını aşar.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Online Softmax — FlashAttention'ın Yapı Taşı</h2>
<p class="l-text">FlashAttention'ın merkezi hilesi (Ders 6) tam N×N attention matrisini hiçbir zaman materyalize etmeden softmax'i artımsal hesaplamaktır. Matematik <strong>numerik olarak kararlı bir online softmax</strong>'a dayanır: <em>x</em> değerlerini stream ederken, çalışan bir max <em>m</em> ve çalışan bir normalizer <em>l</em> tutun, <em>m</em> her sıçradığında yeniden ölçeklendirin. Yineleme:</p>

<div class="katex-block">$$m_i = \\max(m_{i-1}, x_i), \\qquad l_i = e^{m_{i-1} - m_i} \\, l_{i-1} + e^{x_i - m_i}$$</div>

<p class="l-text">Tüm N değeri stream ettikten sonra, <em>softmax(x)<sub>i</sub> = e<sup>x<sub>i</sub> − m<sub>N</sub></sup> / l<sub>N</sub></em>. Mesele, bunun <em>parçalar halinde</em> çalışmasıdır — bir bloğu işleyin, kısmi (m, l)'yi alın, bir sonraki bloğu işleyin ve birleştirin. FlashAttention'ın QK<sup>T</sup>'yi HBM'de hiçbir zaman tutmadan attention çıktısını hesaplamasının tam yolu budur.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide — NumPy'da online softmax, tam FlashAttention yinelemesi</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

x = np.random.randn(2048).astype(np.float32) * 5

# Reference: standard softmax
mx = x.max()
ref = np.exp(x - mx) / np.exp(x - mx).sum()

# Online softmax — process in BLOCK-sized chunks
BLOCK = 64
m, l = -np.inf, 0.0
for i in range(0, len(x), BLOCK):
    block = x[i:i+BLOCK]
    m_block = block.max()
    m_new   = max(m, m_block)
    # rescale old normalizer to the new max
    l = np.exp(m - m_new) * l + np.exp(block - m_new).sum()
    m = m_new

# Second pass: compute output with final (m, l)
out = np.exp(x - m) / l

print(f"max err vs reference: {np.max(np.abs(out - ref)):.2e}")
print(f"sum of online softmax: {out.sum():.6f}  (should be 1.0)")
print(f"max of x: {x.max():.3f}, online m: {m:.3f}  (must match)")
print(f"This recurrence is exactly what FlashAttention runs inside a Triton kernel.")
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) 2048 elemanlık bir FP32 rastgele vektör inşa eder (aralığı genişletmek ve yeniden ölçekleme matematiğini test etmek için 5 ile ölçeklenir) ve standart yolla referans softmax hesaplar: <code>exp(x - max(x)) / sum</code>. 2) Online state'i <code>m = -inf</code> ve <code>l = 0.0</code> olarak başlatır, sonra x'i 64 elemanlık parçalara akıtır — FlashAttention'ın K/V loop'unun attention skorlarını tile tile işlemesinin tam yolu. 3) Her parça için <code>m_new = max(m, block.max())</code> hesaplar, sonra eski normalizer'i <code>l = exp(m - m_new) * l + sum(exp(block - m_new))</code> ile yeniden ölçeklendirir — çalışan max sıçradığında her şeyi numerik olarak kararlı tutan anahtar yeniden-ölçekleme hilesi. 4) Streaming geçişten sonra ikinci bir geçiş <code>exp(x - m) / l</code> ile son softmax'ı hesaplar. 5) Referans karşısında max-err'in ~1e-7 olduğunu (FP32 yuvarlama, bug değil) ve çalışan max <code>m</code>'nin <code>x.max()</code>'e eşit olduğunu doğrular. Bu yineleme FlashAttention'ın Triton kernel'i içinde çalıştığının NumPy aynasıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Triton'da FlashAttention Taslağı</h2>
<p class="l-text">FlashAttention (Dao 2022) O = softmax(QK<sup>T</sup>/√d) V'yi N×N QK<sup>T</sup> matrisini <em>materyalize etmeden</em> hesaplar. Standart attention HBM'den Q, K, V okur, S = QK<sup>T</sup> hesaplar (N² byte geri yazar), softmax hesaplamak için S okur (tekrar N² yazar), softmax çıktısını ve V okur ve O hesaplar. FlashAttention online softmax ile her şeyi tek bir geçişle fuse eder, N² FLOP yapar ama yalnızca O(N·d) HBM trafiği. Aynı cevap, çok daha yüksek aritmetik yoğunluk, uzun dizilerde çok daha hızlı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — Triton FlashAttention iskeleti)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>@triton.jit
def flash_attn_kernel(Q, K, V, O, scale,
                     BLOCK_M: tl.constexpr, BLOCK_N: tl.constexpr,
                     D: tl.constexpr, N: tl.constexpr):
    # one program handles one BLOCK_M of queries
    pid_m  = tl.program_id(0)
    offs_m = pid_m * BLOCK_M + tl.arange(0, BLOCK_M)
    offs_d = tl.arange(0, D)

    q = tl.load(Q + offs_m[:, None] * D + offs_d[None, :])     # (BLOCK_M, D)
    m_i = tl.full((BLOCK_M,), -float('inf'), dtype=tl.float32)
    l_i = tl.zeros((BLOCK_M,), dtype=tl.float32)
    acc = tl.zeros((BLOCK_M, D), dtype=tl.float32)

    # stream over K/V in BLOCK_N tiles
    for j in range(0, N, BLOCK_N):
        offs_n = j + tl.arange(0, BLOCK_N)
        k = tl.load(K + offs_n[:, None] * D + offs_d[None, :])
        v = tl.load(V + offs_n[:, None] * D + offs_d[None, :])
        s = tl.dot(q, tl.trans(k)) * scale                      # (BLOCK_M, BLOCK_N)
        m_new = tl.maximum(m_i, tl.max(s, axis=1))
        alpha = tl.exp(m_i - m_new)
        p     = tl.exp(s - m_new[:, None])
        l_new = alpha * l_i + tl.sum(p, axis=1)
        acc   = acc * alpha[:, None] + tl.dot(p.to(v.dtype), v)
        m_i, l_i = m_new, l_new

    acc = acc / l_i[:, None]
    tl.store(O + offs_m[:, None] * D + offs_d[None, :], acc)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Her program Q matrisinin bir BLOCK_M-satır dilimini işler; (BLOCK_M, D) Q tile'ini bir kez register'a yükler — kernel boyunca yerleşik kalır, HBM'den hiç yeniden okunmaz. 2) Online softmax state'ini başlatır: çalışan max <code>m_i = -inf</code>, normalizer <code>l_i = 0</code> ve çıktı için bir (BLOCK_M, D) akümülatör <code>acc</code>. 3) j-loop K ve V'yi BLOCK_N tile'larında akıtır — <code>k</code> ve <code>v</code> tile'larını yükle, <code>tl.dot</code> aracılığıyla Tensor Core'lar üzerinde ölçekli skorları <code>s = q @ k.T * scale</code> hesapla. 4) Çalışan max'ı <code>m_new = max(m_i, s.max(axis=1))</code> ile günceller, önceki akümülatörü <code>alpha = exp(m_i - m_new)</code> ile yeniden ölçeklendirir, yeni olasılıkları <code>p = exp(s - m_new)</code> hesaplar ve <code>acc = acc * alpha + p @ v</code> ile biriktirir — FlashAttention online softmax yinelemesi. 5) Tüm K/V stream'inden sonra <code>acc / l_i</code> ile bir kez normalize eder ve O tile'ini geri yazar — (N, N) attention matrisi HBM'de asla yaşamaz, yalnızca register'larda, bellek trafiğini O(N²)'den O(N·d)'ye indirir.</p>

<p class="l-text">Bu ~25 satır ve H100'de elle tune edilmiş CUTLASS FlashAttention v2'nin %10'u içindedir. Ders 6 bu kerneli ayrıntılı olarak parçalar ve v1 → v2 → v3 evrimini izler.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NumPy Blok Tile'lama — Bir Triton Bloğunun Belleği Nasıl "Gördüğü"</h2>
<p class="l-text">Yararlı bir zihinsel egzersiz: bir Triton matmul'unu NumPy'da blok blok simüle edin ve tek bir matmul ile eşleştiğini onaylayın. Bu, "blok-seviyesi" soyutlamasını somutlaştırır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

M, N, K = 256, 256, 256
BLOCK_M, BLOCK_N, BLOCK_K = 64, 64, 32
A = np.random.randn(M, K).astype(np.float32)
B = np.random.randn(K, N).astype(np.float32)
C = np.zeros((M, N), dtype=np.float32)

# Walk programs (pid_m, pid_n)
for pid_m in range(M // BLOCK_M):
    for pid_n in range(N // BLOCK_N):
        # Each "program" computes a BLOCK_M x BLOCK_N tile of C
        acc = np.zeros((BLOCK_M, BLOCK_N), dtype=np.float32)
        for k_start in range(0, K, BLOCK_K):
            a = A[pid_m*BLOCK_M:(pid_m+1)*BLOCK_M, k_start:k_start+BLOCK_K]   # tl.load
            b = B[k_start:k_start+BLOCK_K, pid_n*BLOCK_N:(pid_n+1)*BLOCK_N]   # tl.load
            acc += a @ b                                                       # tl.dot
        C[pid_m*BLOCK_M:(pid_m+1)*BLOCK_M, pid_n*BLOCK_N:(pid_n+1)*BLOCK_N] = acc  # tl.store

print("max err vs A @ B:", np.max(np.abs(C - A @ B)))
print(f"programs launched: {(M//BLOCK_M) * (N//BLOCK_N)}  (one per output tile)")
print(f"k-loop iterations per program: {K // BLOCK_K}")
print(f"tl.dot calls total: {(M//BLOCK_M)*(N//BLOCK_N)*(K//BLOCK_K)}")
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) BLOCK_M=BLOCK_N=64 ve BLOCK_K=32 ile küçük bir 256×256×256 problem kurar, böylece simülasyon Pyodide'de milisaniyelerde çalışır ve program başlatma sayısını tam olarak sayabiliriz. 2) Dış (pid_m, pid_n) loop'lar Triton'ın 2D program grid'inin rolünü oynar: her iterasyon bir BLOCK_M × BLOCK_N çıktı tile'ını yönetir. 3) Her "program" içinde, iç k-loop A ve B'nin BLOCK_K genişliğindeki dilimlerini akıtır (<code>a</code> ve <code>b</code> atamaları <code>tl.load</code>'in NumPy eşdeğerleridir) ve <code>a @ b</code>'yi bir register tile <code>acc</code>'a biriktirir — Tensor Core'lar üzerinde <code>tl.dot</code>'in yaptığının aynısı. 4) k-loop sonrası, dilim ataması <code>C[...] = acc</code>, <code>tl.store</code>'i aynalar. 5) Program sayısı (4×4=16, çıktı tile'i başına bir), program başına k-iterasyon (8) ve toplam <code>tl.dot</code> çağrısı (128) yazdırır — bir Triton kernel'inin üreteceği tam dispatch profili.</p>

<p class="l-text">GPU'da her "program" tile üzerinde işbirliği yapan bir thread bloğu olarak çalışır. Derleyici thread düzenini seçer, böylece <code>tl.dot</code> tensor core'lara vurur. Blok-seviyesi NumPy yazarsınız; tensor-core kodu alırsınız.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Ne Zaman Triton vs Alternatifler Kullanılmalı</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Triton kullan</div><div class="card-body">Özel matmul-şekilli veya attention-şekilli kernel'ler. Paylaşılan-bellek tile'lama ve yeniden kullanım içeren her şey. Üretim ML kernel'leri (FlashAttention, paged attention, fused aktivasyonlar). Üç yıl önce CUTLASS'ta yazacağınız her şey.</div></div>
<div class="calc-card"><div class="card-title">Numba kullan</div><div class="card-body">Özel mantığı olan elementwise ve map-stili kernel'ler (Mandelbrot, özel kayıplar, simülasyon). Küçük tek seferlik script'ler. Triton'un ağır araçlar zincirini yüklemek istemediğinizde.</div></div>
<div class="calc-card"><div class="card-title">CuPy kullan</div><div class="card-body">Sadece daha hızlı olması gereken mevcut NumPy kodu. cuBLAS / cuFFT / cuSPARSE sarmalayıcıları. RAPIDS-uyumlu pipeline'lar.</div></div>
<div class="calc-card"><div class="card-title">Raw CUDA kullan</div><div class="card-body">Warp-shuffle intrinsic'leri, son teknoloji donanımda (Blackwell) FP8/FP4 tensor-core programlaması, C++ template metaprogramlaması olan büyük kütüphaneler (CUTLASS, NCCL). Triton burada genellikle bir yıl içinde yetişir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Triton Stack'in Neresine Sığar</h2>
<p class="l-text">Modern ML stack'i için zihinsel resim: PyTorch'un kullanıcı-yüzlü tensor API'si → <code>torch.compile</code> izler ve fuse eder → unfused / özel op'lar için Triton yayar → Triton PTX'e indirir → driver SM'lere yükler. FlashAttention ve torunları Triton kernel'leri olarak yaşar, bazen PyTorch'tan doğrudan çağırılır. CUDA C derleyicisi hala zincirdedir — Triton NVIDIA'nın CUDA backend'ini kullanır — ama bir ML uygulayıcısı olarak ona neredeyse hiç dokunmuyorsunuz artık.</p>

<p class="l-text">Ders 6 LLM çağının en önemli Triton kernel'ine yakından bakıyor — FlashAttention v1, v2, v3 — ve attention'ın HBM ayak izini O(N²)'den O(N)'e nasıl kestiğini, bunun context-uzunluğu ölçeklemesi için neden önemli olduğunu ve H100'deki FP8 v3 varyantının başka 1.5-2x'i nasıl sıktığını tam olarak gösteriyor. Bu, kullanacağımız dildir.</p>
</div>`
};
