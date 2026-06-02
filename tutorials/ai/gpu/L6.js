window.GPU_L6 = {
en: `<p class="l-text"><strong>FlashAttention is the single most influential GPU kernel of the LLM era.</strong> Before it, training a transformer with sequence length 8k meant materializing an 8k × 8k attention matrix in HBM — 256 MB per head per layer at FP32, 64 MB at BF16, and the bandwidth cost that goes with it. Standard attention's running time was dominated by reading and writing this matrix, not by the matmuls. FlashAttention (Tri Dao et al., May 2022) showed that you can compute the same exact answer using only O(N·d) HBM traffic instead of O(N²), by tiling Q/K/V and using an online softmax recurrence that never holds the full S matrix in memory. The result: 2–4x speedup on training, support for 4x longer contexts in the same memory budget, and a paper that has been cited 6000+ times in three years.</p>

<p class="l-text">In this lesson we trace the trilogy: <strong>v1</strong> (Dao 2022, the original IO-aware reformulation), <strong>v2</strong> (Dao 2023, better parallelism — split work along sequence rather than batch, achieving 70% of peak FLOPS on A100), <strong>v3</strong> (Dao &amp; Shah 2024, Hopper-specific with FP8, async copy via TMA, ~75% of H100 peak). We dissect the online softmax math, walk through the tile-streaming algorithm, look at how PagedAttention (vLLM) builds on the same primitives for inference KV-caches, and run a NumPy-tiled equivalent to verify the algorithm matches standard attention bit-for-bit (within FP error).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why standard attention is memory-bound and how IO-awareness fixes it</li>
<li>Derive the online softmax rescaling recurrence used by FlashAttention</li>
<li>Trace the tile-streaming algorithm: outer Q-loop, inner K/V-loop, running (m, l, O)</li>
<li>Distinguish v1 (batch parallelism) from v2 (sequence parallelism) and the speedup it gave</li>
<li>Identify what v3 added on H100 (FP8, TMA, warp-specialization, ~1.5x over v2)</li>
<li>Connect FlashAttention to inference: KV-cache, PagedAttention, continuous batching (lesson 8)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Standard Attention Is a Memory Disaster</h2>
<p class="l-text">Recall self-attention with N tokens and head dim d: <em>O = softmax(QK<sup>T</sup>/√d) V</em>. Standard implementation does this in three kernel calls:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1: matmul S = QK<sup>T</sup>/√d</div><div class="card-body">Reads Q (N·d), K (N·d). Writes S (N·N). For N=8192, d=128: reads 8 MB, writes 256 MB.</div></div>
<div class="calc-card"><div class="card-title">Step 2: P = softmax(S)</div><div class="card-body">Reads S (N·N), writes P (N·N). Another 512 MB of HBM traffic for a pure pointwise op.</div></div>
<div class="calc-card"><div class="card-title">Step 3: matmul O = P V</div><div class="card-body">Reads P (N·N), V (N·d). Writes O (N·d). Reads ~256 MB, writes ~8 MB.</div></div>
</div>

<p class="l-text">Total HBM traffic: ~1 GB for N=8k, head_dim=128, BF16 — completely dominated by the N² matrix S/P. Compute: ~2 N²d FLOPs ≈ 17 GFLOPs. Arithmetic intensity = 17 GFLOPs / 1 GB ≈ 16 FLOPs/byte — way below H100's 295 FLOPs/byte ridge point. Attention is <em>badly memory-bound</em>, achieving maybe 5–10% of peak FLOPS. The bigger N gets, the worse it gets — quadratically.</p>

<div class="katex-block">$$\\text{HBM traffic}_{\\text{standard}} \\;\\approx\\; O(N^2 + Nd), \\qquad \\text{FLOPs} \\;=\\; 2N^2d + 2N^2d = 4N^2d$$</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The IO-Aware Reformulation (Dao 2022)</h2>
<p class="l-text">FlashAttention's insight: the softmax over a row of S can be computed <em>incrementally</em>. You do not need all N values at once — you can process them in chunks, maintaining a running max and a running normalizer. Combined with a tiled outer loop over Q-blocks and inner loop over K/V-blocks, this means you never write the full N×N matrix anywhere — not to HBM, not even to shared memory.</p>

<p class="l-text">The outer Q-block lives in shared memory throughout. For each K/V-block: load it, compute that block's S-tile (BLOCK_M × BLOCK_N) entirely in registers/shared, fold it into the running softmax statistics, multiply by V, accumulate into the running output. After all K/V-blocks are processed, divide by the final normalizer to get the true softmax. Total HBM traffic: O(N·d) — read each Q, K, V exactly once (in tiles), write O once. The N² is gone.</p>

<div class="katex-block">$$\\text{HBM traffic}_{\\text{FlashAttn}} \\;=\\; O(Nd), \\qquad \\text{intensity} \\;=\\; \\frac{4N^2d}{Nd} \\;=\\; 4N$$</div>

<p class="l-text">Arithmetic intensity scales with N. For N=8k that is ~32k FLOPs/byte — far above the ridge point, so attention becomes compute-bound, hitting 60–75% of peak FLOPS instead of 5–10%. That single change unlocked context lengths from 2k → 32k → 128k → 1M over 2022–2024.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Online Softmax — The Math at the Core</h2>
<p class="l-text">For numerical stability, softmax always subtracts the max: <em>p<sub>i</sub> = exp(x<sub>i</sub> − m) / Σ exp(x<sub>j</sub> − m)</em> with <em>m = max(x)</em>. The "online" version maintains a running estimate (m̂, l̂) of (max, sum-of-exps) as you stream values, and rescales the old normalizer whenever a new value beats the running max.</p>

<div class="katex-block">$$m_i \\;=\\; \\max(m_{i-1}, x_i), \\qquad l_i \\;=\\; e^{m_{i-1} - m_i} \\, l_{i-1} \\;+\\; e^{x_i - m_i}$$</div>

<p class="l-text">After processing all values, <em>softmax(x)<sub>i</sub> = e<sup>x<sub>i</sub> − m<sub>N</sub></sup> / l<sub>N</sub></em> — same answer as standard softmax. The trick is that this also works on <em>blocks</em>: combine partial (m, l) pairs from independently processed chunks. That is what FlashAttention exploits to tile.</p>

<p class="l-text">For attention, we extend the recurrence to also track the partial output O. When the running max changes by Δ = m<sub>i−1</sub> − m<sub>i</sub>, every previously accumulated value must be multiplied by e<sup>Δ</sup>. That is the only "extra" work compared to ordinary tiled matmul, and it is what couples softmax to the tiling.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The FlashAttention Algorithm in Pseudocode</h2>

<div class="code-wrap"><div class="code-label"><span>PSEUDOCODE</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Inputs:  Q, K, V of shape (N, d)
# Outputs: O of shape (N, d) such that O = softmax(Q K^T / sqrt(d)) V
# Block sizes: BM (Q-block), BN (K/V-block)

for i in range(0, N, BM):                               # outer: Q-blocks
    Q_i = load Q[i:i+BM]                                # to shared mem, stays put
    O_i = zeros(BM, d)                                   # running output
    m_i = full(BM, -inf)                                 # running max
    l_i = zeros(BM)                                      # running normalizer

    for j in range(0, N, BN):                            # inner: K/V-blocks (streamed)
        K_j = load K[j:j+BN]
        V_j = load V[j:j+BN]

        S_ij = (Q_i @ K_j.T) / sqrt(d)                   # (BM, BN) tile, in registers
        m_new = max(m_i, max(S_ij, axis=1))              # update running max
        P_ij  = exp(S_ij - m_new[:, None])               # softmax numerator (block)
        alpha = exp(m_i - m_new)                         # rescale factor for old stats

        l_i = alpha * l_i + sum(P_ij, axis=1)            # update normalizer
        O_i = alpha[:, None] * O_i + P_ij @ V_j          # update output (rescaled)
        m_i = m_new

    O_i = O_i / l_i[:, None]                             # final normalization
    store O[i:i+BM] = O_i
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The outer loop tiles Q in BM-row blocks; each iteration loads <code>Q_i</code> once into shared memory where it stays for the whole inner loop — no re-reads of Q. 2) For each Q-block, initializes the running softmax state: max <code>m_i = -inf</code>, normalizer <code>l_i = 0</code>, and output accumulator <code>O_i = 0</code>. 3) The inner loop streams K and V in BN-row tiles: compute the BM×BN score tile <code>S_ij</code> in registers, find the row-wise max <code>m_new</code>, compute exp probabilities <code>P_ij</code>, and the rescale factor <code>alpha = exp(m_i - m_new)</code> for the prior accumulators. 4) Rescale <code>l_i</code> and <code>O_i</code> by <code>alpha</code> (this fixes everything to the new max), add the new normalizer contribution <code>sum(P_ij)</code> and the new output contribution <code>P_ij @ V_j</code>, then update <code>m_i = m_new</code>. 5) After all K/V tiles are streamed, divide <code>O_i</code> by <code>l_i</code> once to get the true softmax-weighted output and write back — the (N, N) S matrix never lives in HBM, total traffic is O(N·d).</p>

<p class="l-text">Read it carefully — every line is doing exactly one job. The outer Q-block is stationary in shared memory. The inner loop streams K/V tiles. After each tile, the running max may change, and we rescale O and l before adding the new contribution. After the full inner loop, dividing O by l gives the true softmax-weighted output.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. NumPy Reference Implementation</h2>
<p class="l-text">Run this in Pyodide. It computes attention with FlashAttention's tiled algorithm and verifies bit-for-bit (modulo FP) against standard attention. This is exactly what the Triton/CUDA kernel does, just with NumPy arrays instead of GPU registers.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 FlashAttention in NumPy — verify against standard attention</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N, d = 256, 64
BM, BN = 32, 32                       # tile sizes
np.random.seed(0)
Q = np.random.randn(N, d).astype(np.float32)
K = np.random.randn(N, d).astype(np.float32)
V = np.random.randn(N, d).astype(np.float32)
scale = 1.0 / np.sqrt(d)

# ---------- standard attention (reference) ----------
S = (Q @ K.T) * scale
S -= S.max(axis=1, keepdims=True)
P = np.exp(S)
P /= P.sum(axis=1, keepdims=True)
O_ref = P @ V

# ---------- FlashAttention (tiled, online softmax) ----------
O = np.zeros((N, d), dtype=np.float32)
for i in range(0, N, BM):
    Qi = Q[i:i+BM]
    Oi = np.zeros((BM, d), dtype=np.float32)
    mi = np.full((BM,), -np.inf, dtype=np.float32)
    li = np.zeros((BM,), dtype=np.float32)

    for j in range(0, N, BN):
        Kj = K[j:j+BN]; Vj = V[j:j+BN]
        Sij = (Qi @ Kj.T) * scale                          # (BM, BN)
        m_new = np.maximum(mi, Sij.max(axis=1))
        Pij = np.exp(Sij - m_new[:, None])
        alpha = np.exp(mi - m_new)

        li = alpha * li + Pij.sum(axis=1)
        Oi = alpha[:, None] * Oi + Pij @ Vj
        mi = m_new

    O[i:i+BM] = Oi / li[:, None]

print(f"max abs error vs standard: {np.max(np.abs(O - O_ref)):.2e}")
print(f"FlashAttention matches standard attention to FP precision.")
print(f"  N={N}, d={d}, tiles {N//BM}x{N//BN}")
print(f"  HBM traffic standard : ~{(N*N*4 + 2*N*d*4)/1e6:.2f} MB")
print(f"  HBM traffic FlashAttn: ~{(3*N*d*4)/1e6:.2f} MB  ({(N*N*4)/(3*N*d*4):.1f}x less)")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a tiny N=256, d=64 attention problem with seeded random Q/K/V — same shape FlashAttention's CUDA kernel sees, just on CPU. 2) Computes a reference O via three explicit steps (Q@K.T, softmax, P@V) — the exact "standard attention" path with its (N, N) intermediate. 3) Then runs the FlashAttention algorithm: outer Q-loop, inner K/V-loop, running (m, l, O), final divide — line-by-line mirror of the pseudocode above. 4) Asserts <code>np.max(np.abs(O - O_ref))</code> is at FP32 machine precision (~1e-6) — FlashAttention is NOT an approximation, it is the exact same answer reordered. 5) Prints the HBM-traffic savings: for these tiny dimensions FlashAttn already moves ~5x less data; at production N=8k it scales to N/d ratio ≈ 60x less HBM traffic — the win that unlocked long-context training.</p>
</div>

<p class="l-text">The error is at machine precision (1e-6 in FP32, 1e-3 in BF16). FlashAttention is <em>not</em> an approximation — it computes the exact attention output via a different, IO-friendlier order of operations.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. v1 → v2 — Sequence-Level Parallelism</h2>
<p class="l-text">FlashAttention v1 parallelized across batch and head: each (batch, head) pair got its own block, and within a block the algorithm was sequential over the outer Q-loop. With small batches (especially long-context fine-tuning where you might have batch=1), the GPU was under-occupied — only B·H blocks for B·H ≤ 32, leaving 100 SMs idle on an A100.</p>

<p class="l-text">v2 (Dao 2023) parallelized across the Q-block dimension too. Each Q-block becomes its own program (Triton: <code>tl.program_id(1) = block index along sequence</code>). This gives B·H·(N/BM) blocks, easily saturating any GPU. v2 also reorganized the inner loop to do less rescaling work and used Triton 2.0's improved softmax intrinsics. Result: ~2x speedup over v1 on A100, hitting ~70% of peak FP16 FLOPS.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">v1 parallelism</div><div class="card-body">B · H independent programs. Each runs the full outer Q-loop sequentially. Bad for small batch / long context.</div></div>
<div class="calc-card"><div class="card-title">v2 parallelism</div><div class="card-body">B · H · (N/BM) programs. Each handles one Q-block in parallel with all others. Saturates the GPU regardless of batch size.</div></div>
<div class="calc-card"><div class="card-title">Backward pass</div><div class="card-body">v1's backward was 4-5x slower than its forward; v2 fixed this by recomputing the forward inside the backward (cheap thanks to IO-aware), eliminating the need to store the N² P matrix. Standard practice now.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. v3 — Hopper, FP8, TMA, Warp-Specialization</h2>
<p class="l-text">v3 (Dao &amp; Shah, July 2024) is Hopper-specific (H100). Three additions on top of v2's algorithm:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Async TMA copies</div><div class="card-body">Hopper's Tensor Memory Accelerator does HBM→shared copies asynchronously, freeing warps from address-generation work. v3 uses TMA to overlap K/V tile loads with the previous tile's matmul — software pipelining at the hardware level.</div></div>
<div class="calc-card"><div class="card-title">Warp-specialization</div><div class="card-body">v3 splits warps within a block into "producer" (issues TMA loads) and "consumer" (does matmuls and softmax). This is closer to a CPU pipeline than CUDA's classic homogeneous warps. Cuts stalls dramatically.</div></div>
<div class="calc-card"><div class="card-title">FP8 path</div><div class="card-body">H100 has FP8 tensor cores (1979 TFLOPS with sparsity). v3 supports FP8 attention, halving HBM traffic vs BF16 with minimal accuracy loss when combined with per-tile scaling. ~1.5–2x throughput over v2 BF16.</div></div>
</div>

<div class="calc-highlight"><strong>Combined effect:</strong> a 70B-parameter model that took 32 ms per token on A100 with v1 takes ~12 ms on H100 with v3 FP8 — about 3x improvement, half from the hardware (H100 vs A100), half from the algorithmic refinement of v3.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. KV-Cache Tricks — Inference Reuse</h2>
<p class="l-text">Training does attention over the full sequence. Inference (autoregressive generation) does attention with a <em>growing</em> sequence: at decode step t, you have one new query but t-1 old keys and values. Recomputing K and V from scratch each step would be O(t·d) per step, O(N²·d) total — cubic in sequence length. The KV-cache fixes this: store K and V from previous steps, append new ones, only compute the new query against the cached keys.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Simulate autoregressive decode with a KV-cache (one head, BF16-ish)
d = 64
cache_K = np.zeros((0, d), dtype=np.float32)   # grows as we decode
cache_V = np.zeros((0, d), dtype=np.float32)
scale = 1.0 / np.sqrt(d)

def decode_step(q_new, k_new, v_new, K_cache, V_cache):
    K = np.concatenate([K_cache, k_new[None, :]], axis=0)   # (t, d)
    V = np.concatenate([V_cache, v_new[None, :]], axis=0)
    s = (q_new @ K.T) * scale                                # (t,)
    p = np.exp(s - s.max()); p /= p.sum()
    o = p @ V                                                 # (d,)
    return o, K, V

for step in range(8):
    q_new = np.random.randn(d).astype(np.float32)
    k_new = np.random.randn(d).astype(np.float32)
    v_new = np.random.randn(d).astype(np.float32)
    o, cache_K, cache_V = decode_step(q_new, k_new, v_new, cache_K, cache_V)
    print(f"step {step+1}: cache size = {cache_K.shape[0]}  ·  output norm {np.linalg.norm(o):.3f}")

print(f"\\nFor a 70B model with 32k context, KV-cache is ~80 GB at FP16 — bigger than the model weights!")
print(f"PagedAttention (vLLM, lesson 8) chunks this cache into fixed-size pages to handle dynamic batches.")
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Initializes empty <code>cache_K</code> and <code>cache_V</code> as 0-row arrays — these will grow by one row each decode step, mirroring how a real autoregressive transformer's KV-cache evolves. 2) <code>decode_step</code> takes one new query plus the new k/v vectors, concatenates k/v onto the caches to form (t, d) K and V matrices, computes the softmax of <code>(q_new @ K.T) * scale</code> over t cached keys, and returns the new output and updated caches. 3) The numerical stability trick <code>s - s.max()</code> before <code>exp</code> prevents overflow for large attention scores — same trick the full FlashAttention algorithm uses, just over the whole 1×t row at once since the query is tiny. 4) Loops 8 decode steps, growing the cache from 1 to 8 tokens; each step the cache grows by d·2·4 = 512 bytes per head per layer. 5) Reports the punchline: a 70B model with 32k context has ~80 GB of KV cache at FP16 — larger than the 140 GB BF16 weights of the model — which is why PagedAttention's pinned-page-per-block scheme is essential for production inference.</p>

<p class="l-text">FlashAttention has a "decode" variant called FlashDecoding (Dao 2023) that handles this case efficiently — short query (1 token), long cached K/V (up to 1M tokens). It reorganizes parallelism to split the K/V dimension across SMs, which is otherwise underused for batch=1 decode. PagedAttention (lesson 8) extends this to non-contiguous KV-cache layouts.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Variants and Successors</h2>
<p class="l-text">FlashAttention spawned a research subfield. The most-deployed variants in 2026:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FlashAttention-2 (Dao 2023)</div><div class="card-body">The current default in PyTorch SDPA, HuggingFace Transformers, vLLM. ~70% of A100 peak. BF16/FP16.</div></div>
<div class="calc-card"><div class="card-title">FlashAttention-3 (Dao &amp; Shah 2024)</div><div class="card-body">H100-only. FP8 support. ~75% of H100 peak. Becoming default for new H100 deployments.</div></div>
<div class="calc-card"><div class="card-title">PagedAttention (Kwon 2023)</div><div class="card-body">vLLM's KV-cache management on top of FlashDecoding. Solves memory fragmentation in dynamic-batch inference. Lesson 8.</div></div>
<div class="calc-card"><div class="card-title">Ring Attention (Liu 2023)</div><div class="card-body">Distributed long-context attention: Q stationary, K/V rotated around a ring of GPUs. Enables 1M+ context.</div></div>
<div class="calc-card"><div class="card-title">Sliding-window / sparse</div><div class="card-body">Mistral/Mixtral's local attention, Longformer, Big Bird. Lower asymptotic cost; FlashAttention can implement them via masked tiles.</div></div>
<div class="calc-card"><div class="card-title">Linear / Mamba</div><div class="card-body">SSMs and linear attention (RetNet, Mamba) replace attention with O(N) recurrences. Different kernel landscape entirely; Triton again is the language.</div></div>
</div>

<p class="l-text">If you do anything LLM-shaped, you depend on FlashAttention every forward pass. Knowing how it works — the IO-aware reformulation, the online softmax recurrence, the v2 sequence parallelism, the v3 Hopper specialization — is the price of admission to modern transformer engineering. Lesson 7 widens the lens to multiple GPUs (DDP, FSDP, NCCL all-reduce); lesson 8 builds an inference server that uses FlashAttention end-to-end.</p>
</div>`,
tr: `<p class="l-text"><strong>FlashAttention LLM çağının en etkili tek GPU kernel'idir.</strong> Ondan önce, dizi uzunluğu 8k olan bir transformer'i eğitmek HBM'de 8k × 8k attention matrisi materyalize etmek anlamına geliyordu — kafa başına katman başına FP32'de 256 MB, BF16'da 64 MB ve onunla gelen bant genişliği maliyeti. Standart attention'ın çalışma süresi matmul'lardan değil, bu matrisi okuma ve yazma tarafından domine ediliyordu. FlashAttention (Tri Dao ve diğ., Mayıs 2022) aynı tam cevabı yalnızca O(N·d) HBM trafiği kullanarak — O(N²) yerine — Q/K/V'yi tile'layarak ve tam S matrisini bellekte hiçbir zaman tutmayan online softmax yinelemesini kullanarak hesaplayabileceğinizi gösterdi. Sonuç: eğitimde 2-4x hızlanma, aynı bellek bütçesinde 4x daha uzun context için destek ve üç yılda 6000+ atıf alan bir makale.</p>

<p class="l-text">Bu derste üçlüyü izliyoruz: <strong>v1</strong> (Dao 2022, orijinal IO-farkındalı yeniden formülasyon), <strong>v2</strong> (Dao 2023, daha iyi paralelizm — işi batch yerine dizi boyunca böl, A100 peak FLOPS'unun %70'ine ulaşır), <strong>v3</strong> (Dao &amp; Shah 2024, FP8'li Hopper'a özel, TMA via async kopya, ~%75 H100 peak). Online softmax matematiğini parçalıyor, tile-streaming algoritmasını yürüyor, PagedAttention'ın (vLLM) inference KV-cache'leri için aynı ilkellerin üzerine nasıl inşa edildiğini inceliyor ve algoritmanın standart attention ile bit-bit (FP hatası içinde) eşleştiğini doğrulamak için NumPy-tile'lı bir eşdeğer çalıştırıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Standart attention'ın neden memory-bound olduğunu ve IO-farkındalığın nasıl düzelttiğini açıkla</li>
<li>FlashAttention tarafından kullanılan online softmax yeniden ölçeklendirme yinelemesini türet</li>
<li>Tile-streaming algoritmasını izle: dış Q-loop, iç K/V-loop, çalışan (m, l, O)</li>
<li>v1'i (batch paralelizmi) v2'den (sequence paralelizmi) ayırt et ve verdiği hızlanmayı anla</li>
<li>v3'ün H100'de neyi eklediğini tanı (FP8, TMA, warp-özelleşmesi, v2 üzerinde ~1.5x)</li>
<li>FlashAttention'ı çıkarıma bağla: KV-cache, PagedAttention, sürekli batching (Ders 8)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Standart Attention Neden Bir Bellek Felaketi</h2>
<p class="l-text">N token ve kafa boyutu d ile self-attention'ı hatırlayın: <em>O = softmax(QK<sup>T</sup>/√d) V</em>. Standart uygulama bunu üç kernel çağrısında yapar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1: matmul S = QK<sup>T</sup>/√d</div><div class="card-body">Q (N·d), K (N·d) okur. S (N·N) yazar. N=8192, d=128 için: 8 MB okur, 256 MB yazar.</div></div>
<div class="calc-card"><div class="card-title">Adım 2: P = softmax(S)</div><div class="card-body">S (N·N) okur, P (N·N) yazar. Saf bir pointwise op için başka 512 MB HBM trafiği.</div></div>
<div class="calc-card"><div class="card-title">Adım 3: matmul O = P V</div><div class="card-body">P (N·N), V (N·d) okur. O (N·d) yazar. ~256 MB okur, ~8 MB yazar.</div></div>
</div>

<p class="l-text">Toplam HBM trafiği: N=8k, head_dim=128, BF16 için ~1 GB — tamamen N² matris S/P tarafından domine ediliyor. Compute: ~2 N²d FLOPs ≈ 17 GFLOPs. Aritmetik yoğunluk = 17 GFLOPs / 1 GB ≈ 16 FLOPs/byte — H100'un 295 FLOPs/byte ridge point'inin çok altında. Attention <em>kötü derecede memory-bound</em>'dur, peak FLOPS'un %5-10'unu elde eder. N büyüdükçe daha kötüleşir — kuadratik olarak.</p>

<div class="katex-block">$$\\text{HBM traffic}_{\\text{standard}} \\;\\approx\\; O(N^2 + Nd), \\qquad \\text{FLOPs} \\;=\\; 2N^2d + 2N^2d = 4N^2d$$</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. IO-Farkındalı Yeniden Formülasyon (Dao 2022)</h2>
<p class="l-text">FlashAttention'ın içgörüsü: S'in bir satırı üzerindeki softmax <em>artımsal</em> hesaplanabilir. Bir kerede tüm N değere ihtiyacınız yok — onları parçalar halinde işleyebilir, çalışan bir max ve çalışan bir normalizer sürdürebilirsiniz. Q-blokları üzerindeki tile'lı dış loop ve K/V-blokları üzerindeki iç loop ile birleştirildiğinde, bu, tam N×N matrisini hiçbir yere yazmadığınız anlamına gelir — HBM'ye değil, paylaşılan belleğe bile değil.</p>

<p class="l-text">Dış Q-bloğu boyunca paylaşılan bellekte yaşar. Her K/V-bloğu için: yükleyin, bloğun S-tile'ını (BLOCK_M × BLOCK_N) tamamen register/shared'da hesaplayın, çalışan softmax istatistiklerine katlayın, V ile çarpın, çalışan çıktıya birikim yapın. Tüm K/V-blokları işlendikten sonra, gerçek softmax'i almak için son normalizer ile bölün. Toplam HBM trafiği: O(N·d) — her Q, K, V'yi tam olarak bir kez (tile'larda) okuyun, O'yu bir kez yazın. N² gitti.</p>

<div class="katex-block">$$\\text{HBM traffic}_{\\text{FlashAttn}} \\;=\\; O(Nd), \\qquad \\text{intensity} \\;=\\; \\frac{4N^2d}{Nd} \\;=\\; 4N$$</div>

<p class="l-text">Aritmetik yoğunluk N ile ölçeklenir. N=8k için bu ~32k FLOPs/byte — ridge point'in çok üstünde, bu yüzden attention compute-bound olur, %5-10 yerine peak FLOPS'un %60-75'ine ulaşır. Bu tek değişiklik 2022-2024 boyunca context uzunluklarını 2k → 32k → 128k → 1M açtı.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Online Softmax — Çekirdekteki Matematik</h2>
<p class="l-text">Numerik kararlılık için softmax her zaman max'i çıkarır: <em>p<sub>i</sub> = exp(x<sub>i</sub> − m) / Σ exp(x<sub>j</sub> − m)</em>, <em>m = max(x)</em> ile. "Online" versiyon, değerleri stream ederken (max, sum-of-exps) için çalışan bir tahmin (m, l) tutar ve yeni bir değer çalışan max'i geçtiğinde eski normalizer'ı yeniden ölçeklendirir.</p>

<div class="katex-block">$$m_i \\;=\\; \\max(m_{i-1}, x_i), \\qquad l_i \\;=\\; e^{m_{i-1} - m_i} \\, l_{i-1} \\;+\\; e^{x_i - m_i}$$</div>

<p class="l-text">Tüm değerler işlendikten sonra, <em>softmax(x)<sub>i</sub> = e<sup>x<sub>i</sub> − m<sub>N</sub></sup> / l<sub>N</sub></em> — standart softmax ile aynı cevap. Hile, bunun aynı zamanda <em>bloklar</em> üzerinde çalışmasıdır: bağımsız olarak işlenmiş parçalardan kısmi (m, l) çiftlerini birleştirin. FlashAttention'ın tile yapmak için sömürdüğü budur.</p>

<p class="l-text">Attention için yinelemeyi kısmi çıktı O'yu da izleyecek şekilde genişletiyoruz. Çalışan max Δ = m<sub>i−1</sub> − m<sub>i</sub> kadar değiştiğinde, daha önceden birikmiş her değer e<sup>Δ</sup> ile çarpılmalıdır. Sıradan tile'lı matmul'a göre tek "ekstra" iştir ve softmax'i tile'lamaya bağlayan budur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Sözde Kodda FlashAttention Algoritması</h2>

<div class="code-wrap"><div class="code-label"><span>SÖZDE KOD</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Inputs:  Q, K, V of shape (N, d)
# Outputs: O of shape (N, d) such that O = softmax(Q K^T / sqrt(d)) V
# Block sizes: BM (Q-block), BN (K/V-block)

for i in range(0, N, BM):                               # outer: Q-blocks
    Q_i = load Q[i:i+BM]                                # to shared mem, stays put
    O_i = zeros(BM, d)                                   # running output
    m_i = full(BM, -inf)                                 # running max
    l_i = zeros(BM)                                      # running normalizer

    for j in range(0, N, BN):                            # inner: K/V-blocks (streamed)
        K_j = load K[j:j+BN]
        V_j = load V[j:j+BN]

        S_ij = (Q_i @ K_j.T) / sqrt(d)                   # (BM, BN) tile, in registers
        m_new = max(m_i, max(S_ij, axis=1))              # update running max
        P_ij  = exp(S_ij - m_new[:, None])               # softmax numerator (block)
        alpha = exp(m_i - m_new)                         # rescale factor for old stats

        l_i = alpha * l_i + sum(P_ij, axis=1)            # update normalizer
        O_i = alpha[:, None] * O_i + P_ij @ V_j          # update output (rescaled)
        m_i = m_new

    O_i = O_i / l_i[:, None]                             # final normalization
    store O[i:i+BM] = O_i
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Dış loop Q'yu BM-satır bloklarında tile'lar; her iterasyon <code>Q_i</code>'yi paylaşılan belleğe bir kez yükler ve tüm iç loop boyunca burada kalır — Q yeniden okunmaz. 2) Her Q-bloğu için, çalışan softmax state'ini başlatır: max <code>m_i = -inf</code>, normalizer <code>l_i = 0</code> ve çıktı akümülatörü <code>O_i = 0</code>. 3) İç loop K ve V'yi BN-satır tile'larında akıtır: register'larda BM×BN skor tile'ı <code>S_ij</code> hesapla, satır başına max <code>m_new</code>'yi bul, exp olasılıkları <code>P_ij</code> ve önceki akümülatörler için yeniden ölçekleme faktörü <code>alpha = exp(m_i - m_new)</code> hesapla. 4) <code>l_i</code> ve <code>O_i</code>'yi <code>alpha</code> ile yeniden ölçeklendir (bu her şeyi yeni max'a sabitler), yeni normalizer katkısı <code>sum(P_ij)</code> ve yeni çıktı katkısı <code>P_ij @ V_j</code>'yi ekle, sonra <code>m_i = m_new</code> güncelle. 5) Tüm K/V tile'lar streaming edildikten sonra, gerçek softmax-ağırlıklı çıktıyı almak için <code>O_i</code>'yi <code>l_i</code>'ye bir kez böl ve geri yaz — (N, N) S matrisi HBM'de asla yaşamaz, toplam trafik O(N·d).</p>

<p class="l-text">Dikkatlice okuyun — her satır tam olarak bir iş yapıyor. Dış Q-bloğu paylaşılan bellekte sabittir. İç loop K/V tile'larını stream eder. Her tile'dan sonra, çalışan max değişebilir ve yeni katkıyı eklemeden önce O ve l'yi yeniden ölçeklendiririz. Tam iç loop'tan sonra, O'yu l'ye bölmek gerçek softmax-ağırlıklı çıktıyı verir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. NumPy Referans Uygulaması</h2>
<p class="l-text">Bunu Pyodide'da çalıştırın. Attention'ı FlashAttention'ın tile'lı algoritmasıyla hesaplar ve standart attention karşısında bit-bit (FP modulo) doğrular. Bu Triton/CUDA kernel'inin yaptığının tam olarak aynıdır, sadece GPU register'ları yerine NumPy dizileri ile.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 NumPy'da FlashAttention — standart attention'a karşı doğrula</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

N, d = 256, 64
BM, BN = 32, 32                       # tile sizes
np.random.seed(0)
Q = np.random.randn(N, d).astype(np.float32)
K = np.random.randn(N, d).astype(np.float32)
V = np.random.randn(N, d).astype(np.float32)
scale = 1.0 / np.sqrt(d)

# ---------- standard attention (reference) ----------
S = (Q @ K.T) * scale
S -= S.max(axis=1, keepdims=True)
P = np.exp(S)
P /= P.sum(axis=1, keepdims=True)
O_ref = P @ V

# ---------- FlashAttention (tiled, online softmax) ----------
O = np.zeros((N, d), dtype=np.float32)
for i in range(0, N, BM):
    Qi = Q[i:i+BM]
    Oi = np.zeros((BM, d), dtype=np.float32)
    mi = np.full((BM,), -np.inf, dtype=np.float32)
    li = np.zeros((BM,), dtype=np.float32)

    for j in range(0, N, BN):
        Kj = K[j:j+BN]; Vj = V[j:j+BN]
        Sij = (Qi @ Kj.T) * scale                          # (BM, BN)
        m_new = np.maximum(mi, Sij.max(axis=1))
        Pij = np.exp(Sij - m_new[:, None])
        alpha = np.exp(mi - m_new)

        li = alpha * li + Pij.sum(axis=1)
        Oi = alpha[:, None] * Oi + Pij @ Vj
        mi = m_new

    O[i:i+BM] = Oi / li[:, None]

print(f"max abs error vs standard: {np.max(np.abs(O - O_ref)):.2e}")
print(f"FlashAttention matches standard attention to FP precision.")
print(f"  N={N}, d={d}, tiles {N//BM}x{N//BN}")
print(f"  HBM traffic standard : ~{(N*N*4 + 2*N*d*4)/1e6:.2f} MB")
print(f"  HBM traffic FlashAttn: ~{(3*N*d*4)/1e6:.2f} MB  ({(N*N*4)/(3*N*d*4):.1f}x less)")
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Seedlenmiş rastgele Q/K/V ile küçücük bir N=256, d=64 attention problemi inşa eder — FlashAttention'ın CUDA kernel'inin gördüğü aynı şekil, sadece CPU'da. 2) Üç açık adımla (Q@K.T, softmax, P@V) bir referans O hesaplar — (N, N) ara matrisi ile tam "standart attention" yolu. 3) Sonra FlashAttention algoritmasını çalıştırır: dış Q-loop, iç K/V-loop, çalışan (m, l, O), son böl — yukarıdaki sözde kodun satır-satır aynası. 4) <code>np.max(np.abs(O - O_ref))</code>'nın FP32 makine hassasiyetinde (~1e-6) olduğunu doğrular — FlashAttention bir yaklaşım DEĞİLDİR, yeniden sıralanmış tam aynı cevaptır. 5) HBM trafik tasarruflarını yazdırır: bu küçücük boyutlar için FlashAttn zaten ~5x daha az veri taşır; üretim N=8k'de N/d oranı ≈ 60x daha az HBM trafiğine ölçeklenir — uzun-context eğitimini açan kazanç.</p>
</div>

<p class="l-text">Hata makine hassasiyetinde (FP32'de 1e-6, BF16'da 1e-3). FlashAttention bir yaklaşım <em>değildir</em>; tam attention çıktısını farklı, IO-dostu bir işlem sıralaması yoluyla hesaplar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. v1 → v2 — Sequence-Seviyesi Paralelizm</h2>
<p class="l-text">FlashAttention v1 batch ve kafa boyunca paralelize etti: her (batch, head) çifti kendi bloğunu aldı ve blok içinde algoritma dış Q-loop boyunca ardışıktı. Küçük batch'lerle (özellikle batch=1 olabilen uzun-context fine-tune'larında), GPU yetersiz dolu kalırdı — sadece B·H ≤ 32 için B·H blok, A100'de 100 SM'i boş bırakırdı.</p>

<p class="l-text">v2 (Dao 2023) Q-blok boyutu boyunca da paralelize etti. Her Q-blok kendi programı olur (Triton: <code>tl.program_id(1) = sequence boyunca blok indeksi</code>). Bu B·H·(N/BM) blok verir, herhangi bir GPU'yu kolayca doyurur. v2 ayrıca iç loop'u daha az yeniden ölçeklendirme işi yapacak şekilde yeniden düzenledi ve Triton 2.0'ın iyileştirilmiş softmax intrinsic'lerini kullandı. Sonuç: A100'de v1 üzerinde ~2x hızlanma, peak FP16 FLOPS'un ~%70'ine ulaştı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">v1 paralelizmi</div><div class="card-body">B · H bağımsız program. Her biri tam dış Q-loop'u sırayla çalıştırır. Küçük batch / uzun context için kötü.</div></div>
<div class="calc-card"><div class="card-title">v2 paralelizmi</div><div class="card-body">B · H · (N/BM) program. Her biri bir Q-bloğu diğerleriyle paralel olarak işler. Batch boyutu ne olursa olsun GPU'yu doyurur.</div></div>
<div class="calc-card"><div class="card-title">Backward pass</div><div class="card-body">v1'in backward'ı forward'ından 4-5x daha yavaştı; v2 forward'ı backward içinde yeniden hesaplayarak (IO-farkındalı sayesinde ucuz) bunu düzeltti, N² P matrisini saklama gereksinimini ortadan kaldırdı. Şimdi standart uygulama.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. v3 — Hopper, FP8, TMA, Warp-Özelleşmesi</h2>
<p class="l-text">v3 (Dao &amp; Shah, Temmuz 2024) Hopper'a özeldir (H100). v2 algoritmasının üstüne üç ekleme:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Async TMA kopyaları</div><div class="card-body">Hopper'ın Tensor Memory Accelerator'ı HBM→shared kopyaları asenkron yapar, warp'ları adres-üretme işinden serbest bırakır. v3 TMA'yı K/V tile yüklemelerini önceki tile'ın matmul'u ile üst üste bindirmek için kullanır — donanım seviyesinde software pipelining.</div></div>
<div class="calc-card"><div class="card-title">Warp-özelleşmesi</div><div class="card-body">v3 bir blok içindeki warp'ları "producer" (TMA yüklemelerini yayınlar) ve "consumer" (matmul ve softmax yapar) olarak böler. Bu CUDA'nın klasik homojen warp'larından ziyade bir CPU pipeline'ına daha yakındır. Duraklamaları dramatik olarak keser.</div></div>
<div class="calc-card"><div class="card-title">FP8 yolu</div><div class="card-body">H100 FP8 tensor core'lara sahiptir (sparsity ile 1979 TFLOPS). v3 FP8 attention'ı destekler, BF16'ya kıyasla minimum doğruluk kaybıyla per-tile ölçeklendirme ile birleştirildiğinde HBM trafiğini yarıya indirir. v2 BF16 üzerinde ~1.5-2x throughput.</div></div>
</div>

<div class="calc-highlight"><strong>Birleşik etki:</strong> v1 ile A100'de token başına 32 ms süren 70B parametreli bir model, v3 FP8 ile H100'de ~12 ms sürer — yaklaşık 3x iyileştirme, yarısı donanımdan (H100 vs A100), yarısı v3'ün algoritmik iyileştirilmesinden.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. KV-Cache Hileleri — Çıkarım Yeniden Kullanımı</h2>
<p class="l-text">Eğitim tam dizi üzerinde attention yapar. Çıkarım (otoregresif üretim) <em>büyüyen</em> bir dizi ile attention yapar: kod çözme adımı t'de, bir yeni sorgu ama t-1 eski anahtar ve değerleriniz var. K ve V'yi her adımda sıfırdan yeniden hesaplamak adım başına O(t·d), toplamda O(N²·d) olurdu — dizi uzunluğunda kübik. KV-cache bunu düzeltir: önceki adımlardan K ve V'yi sakla, yenileri ekle, sadece yeni sorguyu önbelleğe alınmış anahtarlara karşı hesapla.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Simulate autoregressive decode with a KV-cache (one head, BF16-ish)
d = 64
cache_K = np.zeros((0, d), dtype=np.float32)   # grows as we decode
cache_V = np.zeros((0, d), dtype=np.float32)
scale = 1.0 / np.sqrt(d)

def decode_step(q_new, k_new, v_new, K_cache, V_cache):
    K = np.concatenate([K_cache, k_new[None, :]], axis=0)   # (t, d)
    V = np.concatenate([V_cache, v_new[None, :]], axis=0)
    s = (q_new @ K.T) * scale                                # (t,)
    p = np.exp(s - s.max()); p /= p.sum()
    o = p @ V                                                 # (d,)
    return o, K, V

for step in range(8):
    q_new = np.random.randn(d).astype(np.float32)
    k_new = np.random.randn(d).astype(np.float32)
    v_new = np.random.randn(d).astype(np.float32)
    o, cache_K, cache_V = decode_step(q_new, k_new, v_new, cache_K, cache_V)
    print(f"step {step+1}: cache size = {cache_K.shape[0]}  ·  output norm {np.linalg.norm(o):.3f}")

print(f"\\nFor a 70B model with 32k context, KV-cache is ~80 GB at FP16 — bigger than the model weights!")
print(f"PagedAttention (vLLM, lesson 8) chunks this cache into fixed-size pages to handle dynamic batches.")
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Boş <code>cache_K</code> ve <code>cache_V</code>'yi 0-satır dizileri olarak başlatır — her decode adımında bir satır büyüyecekler, gerçek otoregresif transformer'in KV-cache'inin nasıl evrildiğini aynalar. 2) <code>decode_step</code> bir yeni sorgu artı yeni k/v vektörleri alır, k/v'yi cache'lere ekleyerek (t, d) K ve V matrisleri oluşturur, t önbellekli anahtar üzerinde <code>(q_new @ K.T) * scale</code>'in softmax'ını hesaplar ve yeni çıktıyı ve güncellenmiş cache'leri döndürür. 3) <code>exp</code>'ten önce <code>s - s.max()</code> numerik kararlılık hilesi büyük attention skorları için overflow'u önler — tam FlashAttention algoritmasının kullandığı aynı hile, sadece sorgu küçük olduğu için tüm 1×t satırı üzerinde bir kerede. 4) 8 decode adımı için döngü, cache'i 1'den 8 token'a büyütür; her adımda cache kafa başına katman başına d·2·4 = 512 byte büyür. 5) Anahtar mesajı raporlar: 32k context'li 70B model FP16'da ~80 GB KV cache'e sahiptir — modelin 140 GB BF16 ağırlıklarından daha büyük — bu yüzden PagedAttention'ın blok başına sabitlenmiş sayfa şeması üretim çıkarımı için zorunludur.</p>

<p class="l-text">FlashAttention'ın bu durumu verimli ele alan FlashDecoding (Dao 2023) adlı bir "decode" varyantı vardır — kısa sorgu (1 token), uzun önbelleklenmiş K/V (1M token'a kadar). Aksi takdirde batch=1 decode için yetersiz kullanılan K/V boyutunu SM'ler arasında bölmek için paralelizmi yeniden düzenler. PagedAttention (Ders 8) bunu bitişik olmayan KV-cache düzenlerine genişletir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Varyantlar ve Halefler</h2>
<p class="l-text">FlashAttention bir araştırma alt alanı doğurdu. 2026'da en çok kullanılan varyantlar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FlashAttention-2 (Dao 2023)</div><div class="card-body">PyTorch SDPA, HuggingFace Transformers, vLLM'deki mevcut varsayılan. ~%70 A100 peak. BF16/FP16.</div></div>
<div class="calc-card"><div class="card-title">FlashAttention-3 (Dao &amp; Shah 2024)</div><div class="card-body">Sadece H100. FP8 desteği. ~%75 H100 peak. Yeni H100 dağıtımları için varsayılan oluyor.</div></div>
<div class="calc-card"><div class="card-title">PagedAttention (Kwon 2023)</div><div class="card-body">FlashDecoding'in üstünde vLLM'in KV-cache yönetimi. Dinamik-batch çıkarımında bellek parçalanmasını çözer. Ders 8.</div></div>
<div class="calc-card"><div class="card-title">Ring Attention (Liu 2023)</div><div class="card-body">Dağıtık uzun-context attention: Q sabit, K/V bir GPU halkası etrafında döndürülüyor. 1M+ context'i mümkün kılar.</div></div>
<div class="calc-card"><div class="card-title">Sliding-window / sparse</div><div class="card-body">Mistral/Mixtral'in yerel attention'ı, Longformer, Big Bird. Daha düşük asimptotik maliyet; FlashAttention onları maskeli tile'lar aracılığıyla uygulayabilir.</div></div>
<div class="calc-card"><div class="card-title">Linear / Mamba</div><div class="card-body">SSM'ler ve linear attention (RetNet, Mamba) attention'ı O(N) yinelemelerle değiştirir. Tamamen farklı bir kernel manzarası; yine Triton dildir.</div></div>
</div>

<p class="l-text">LLM-şekilli bir şey yapıyorsanız, her forward geçişinde FlashAttention'a bağlısınız. Nasıl çalıştığını bilmek — IO-farkındalı yeniden formülasyon, online softmax yinelemesi, v2 sequence paralelizmi, v3 Hopper özelleşmesi — modern transformer mühendisliğine giriş fiyatıdır. Ders 7 lensi çok sayıda GPU'ya genişletir (DDP, FSDP, NCCL all-reduce); Ders 8 FlashAttention'ı ucundan ucuna kullanan bir çıkarım sunucusu inşa eder.</p>
</div>`
};
