window.NUMPY_L7 = {
en: `<p class="l-text"><strong>If you can read <code>einsum</code>, you can read every paper.</strong> Attention, batched matmul, contraction in tensor networks, even backprop derivations — modern ML notation collapses into a few index letters and an arrow. The notation looks alien at first (<code>"bhid,bhjd->bhij"</code>?), but once it clicks you stop writing transpose-reshape-matmul chains and start writing what you mean.</p>

<p class="l-text">This lesson teaches <code>einsum</code> from index notation up. We will rebuild matrix multiply, batched matmul, scaled dot-product attention, bilinear forms, and trace — all in one line each. By the end you will reach for <code>einsum</code> first and feel slightly insulted when someone pushes a chain of <code>.transpose().reshape().matmul()</code> at you.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and write Einstein summation notation in NumPy</li>
<li>Express matmul, batched matmul, transpose, trace, and outer product in <code>einsum</code></li>
<li>Implement scaled dot-product attention (<code>"bhid,bhjd->bhij"</code>) end-to-end</li>
<li>Use ellipsis (<code>...</code>) for arbitrary leading batch dims</li>
<li>Tune contraction order with <code>optimize=True</code> and <code>opt_einsum</code></li>
<li>Recognize when <code>einsum</code> is slower than <code>@</code> and switch back</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Index Notation in 90 Seconds</h2>
<p class="l-text">Einstein summation is a contract: <strong>indices that appear on the left but not on the right are summed over</strong>. Every other index is preserved. That is the whole rule. Once you internalize it, every <code>einsum</code> string is parseable.</p>

<div class="katex-block">$$C_{ij} = \\sum_k A_{ik} B_{kj} \\quad\\Longleftrightarrow\\quad \\text{einsum}(\\text{"ik,kj->ij"}, A, B)$$</div>

<p class="l-text">The string <code>"ik,kj->ij"</code> says: input <code>A</code> has indices <code>i,k</code>; input <code>B</code> has indices <code>k,j</code>; output has indices <code>i,j</code>. The shared index <code>k</code> is missing from the output, so it is summed. That is matrix multiply.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Repeated index</div><div class="card-body">Same letter on both inputs = elementwise product along that axis, then sum if absent from output.</div></div>
<div class="calc-card"><div class="card-title">Free index</div><div class="card-body">Appears in output = preserved (no sum). Defines the shape of the result.</div></div>
<div class="calc-card"><div class="card-title">Dummy index</div><div class="card-body">Missing from output = summed (contracted). The Einstein convention.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Matmul, Trace, Diagonal — All in One Line</h2>
<p class="l-text">Once you have the rule, classic linear algebra collapses. Each operation below is a single <code>einsum</code> call. Run it and convince yourself.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

A = rng.<span class="fn">standard_normal</span>((<span class="num">4</span>, <span class="num">5</span>))
B = rng.<span class="fn">standard_normal</span>((<span class="num">5</span>, <span class="num">3</span>))

<span class="cm"># Matrix multiply: C[i,j] = sum_k A[i,k] B[k,j]</span>
C = np.<span class="fn">einsum</span>(<span class="str">"ik,kj->ij"</span>, A, B)
<span class="fn">print</span>(<span class="str">"matmul shape:"</span>, C.shape, <span class="str">"match @:"</span>, np.<span class="fn">allclose</span>(C, A @ B))

<span class="cm"># Element-wise product then sum over both axes (Frobenius inner product)</span>
M = rng.<span class="fn">standard_normal</span>((<span class="num">4</span>, <span class="num">4</span>))
N = rng.<span class="fn">standard_normal</span>((<span class="num">4</span>, <span class="num">4</span>))
fro = np.<span class="fn">einsum</span>(<span class="str">"ij,ij->"</span>, M, N)
<span class="fn">print</span>(<span class="str">"frobenius:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(fro), <span class="num">4</span>), <span class="str">"match:"</span>, np.<span class="fn">allclose</span>(fro, (M*N).<span class="fn">sum</span>()))

<span class="cm"># Trace: sum of diagonal -> repeat index, no output indices</span>
tr = np.<span class="fn">einsum</span>(<span class="str">"ii->"</span>, M)
<span class="fn">print</span>(<span class="str">"trace:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(tr), <span class="num">4</span>), <span class="str">"match:"</span>, np.<span class="fn">allclose</span>(tr, np.<span class="fn">trace</span>(M)))

<span class="cm"># Diagonal as a vector: keep the repeated index</span>
diag = np.<span class="fn">einsum</span>(<span class="str">"ii->i"</span>, M)
<span class="fn">print</span>(<span class="str">"diag:"</span>, np.<span class="fn">round</span>(diag, <span class="num">3</span>))

<span class="cm"># Outer product: u[i] v[j] -> O[i,j]</span>
u = rng.<span class="fn">standard_normal</span>(<span class="num">4</span>); v = rng.<span class="fn">standard_normal</span>(<span class="num">3</span>)
O = np.<span class="fn">einsum</span>(<span class="str">"i,j->ij"</span>, u, v)
<span class="fn">print</span>(<span class="str">"outer shape:"</span>, O.shape, <span class="str">"match:"</span>, np.<span class="fn">allclose</span>(O, np.<span class="fn">outer</span>(u, v)))

<span class="cm"># Transpose: just permute output letters</span>
At = np.<span class="fn">einsum</span>(<span class="str">"ij->ji"</span>, A)
<span class="fn">print</span>(<span class="str">"transpose match:"</span>, np.<span class="fn">allclose</span>(At, A.T))
</code></pre></div>

<p class="l-text">This block does six things every linear-algebra course covers separately. The notation forces you to think about what indices live and die — which is exactly how derivatives are computed in attention papers.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Batched Matmul &amp; Broadcasting</h2>
<p class="l-text">Real ML tensors carry batch dimensions: <code>(batch, ...)</code> or <code>(batch, head, ...)</code>. Adding a leading batch index to <code>einsum</code> is just another letter — <code>einsum</code> handles broadcasting natively.</p>

<div class="katex-block">$$C_{bij} = \\sum_k A_{bik} B_{bkj}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)

<span class="cm"># Batched matmul: 32 pairs of 4x5 and 5x3 matrices</span>
A = rng.<span class="fn">standard_normal</span>((<span class="num">32</span>, <span class="num">4</span>, <span class="num">5</span>))
B = rng.<span class="fn">standard_normal</span>((<span class="num">32</span>, <span class="num">5</span>, <span class="num">3</span>))

C = np.<span class="fn">einsum</span>(<span class="str">"bik,bkj->bij"</span>, A, B)
<span class="fn">print</span>(<span class="str">"batched matmul:"</span>, C.shape)
<span class="fn">print</span>(<span class="str">"match np.matmul:"</span>, np.<span class="fn">allclose</span>(C, np.<span class="fn">matmul</span>(A, B)))

<span class="cm"># Broadcasting: same B for every batch -> drop the b on B</span>
B_shared = rng.<span class="fn">standard_normal</span>((<span class="num">5</span>, <span class="num">3</span>))
C2 = np.<span class="fn">einsum</span>(<span class="str">"bik,kj->bij"</span>, A, B_shared)
<span class="fn">print</span>(<span class="str">"broadcast B:"</span>, C2.shape)

<span class="cm"># Ellipsis: arbitrary leading dims</span>
X = rng.<span class="fn">standard_normal</span>((<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>))   <span class="cm"># any leading dims</span>
Y = rng.<span class="fn">standard_normal</span>((<span class="num">2</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">6</span>))
Z = np.<span class="fn">einsum</span>(<span class="str">"...ik,...kj->...ij"</span>, X, Y)
<span class="fn">print</span>(<span class="str">"ellipsis matmul:"</span>, Z.shape)   <span class="cm"># (2, 3, 4, 6)</span>
</code></pre></div>

<div class="calc-highlight">The ellipsis trick is the single most useful pattern in production code. Write your contraction once over the trailing dims and let any number of batch axes pass through.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Scaled Dot-Product Attention</h2>
<p class="l-text">Attention is the canonical use case. Given queries, keys, values of shape <code>(batch, head, seq, dim)</code>, the scores tensor has shape <code>(batch, head, seq_q, seq_k)</code>. The contraction collapses the per-head feature dim <code>d</code>.</p>

<div class="katex-block">$$\\text{scores}_{bhij} = \\frac{1}{\\sqrt{d}} \\sum_d Q_{bhid} K_{bhjd}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)

B, H, T, D = <span class="num">2</span>, <span class="num">4</span>, <span class="num">6</span>, <span class="num">8</span>     <span class="cm"># batch, heads, seq, head_dim</span>

Q = rng.<span class="fn">standard_normal</span>((B, H, T, D)).<span class="fn">astype</span>(np.float32)
K = rng.<span class="fn">standard_normal</span>((B, H, T, D)).<span class="fn">astype</span>(np.float32)
V = rng.<span class="fn">standard_normal</span>((B, H, T, D)).<span class="fn">astype</span>(np.float32)

<span class="cm"># Scores: contract over the head_dim 'd'</span>
scores = np.<span class="fn">einsum</span>(<span class="str">"bhid,bhjd->bhij"</span>, Q, K) / np.<span class="fn">sqrt</span>(D)
<span class="fn">print</span>(<span class="str">"scores:"</span>, scores.shape)        <span class="cm"># (B, H, T, T)</span>

<span class="cm"># Softmax along the keys axis (last)</span>
scores -= scores.<span class="fn">max</span>(axis=-<span class="num">1</span>, keepdims=<span class="kw">True</span>)   <span class="cm"># numerical stability</span>
attn = np.<span class="fn">exp</span>(scores)
attn /= attn.<span class="fn">sum</span>(axis=-<span class="num">1</span>, keepdims=<span class="kw">True</span>)

<span class="cm"># Weighted sum over values: contract over j (key/value position)</span>
out = np.<span class="fn">einsum</span>(<span class="str">"bhij,bhjd->bhid"</span>, attn, V)
<span class="fn">print</span>(<span class="str">"output:"</span>, out.shape)           <span class="cm"># (B, H, T, D)</span>

<span class="cm"># Sanity: probabilities sum to 1 along last axis</span>
<span class="fn">print</span>(<span class="str">"attn sums:"</span>, np.<span class="fn">round</span>(attn.<span class="fn">sum</span>(axis=-<span class="num">1</span>), <span class="num">4</span>)[<span class="num">0</span>, <span class="num">0</span>])
</code></pre></div>

<p class="l-text">Two einsums and a softmax — the entire transformer attention block. Notice how the index letters tell the story: <code>i</code> is the query position, <code>j</code> is the key/value position, <code>d</code> is the per-head feature dim that gets summed away in scores and re-introduced when reading from <code>V</code>.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Bilinear Forms &amp; Tensor Contractions</h2>
<p class="l-text">Bilinear layers (used in older relation-extraction models and in modern Mixture-of-Experts gating) compute <code>x^T W y</code> per batch. Without einsum, this is an awkward sequence of <code>reshape</code> and <code>matmul</code>. With einsum, it is two letters.</p>

<div class="katex-block">$$y_b = \\sum_{i,j} x_{bi} W_{ij} z_{bj}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">2</span>)

B, D1, D2 = <span class="num">16</span>, <span class="num">5</span>, <span class="num">7</span>
x = rng.<span class="fn">standard_normal</span>((B, D1))
W = rng.<span class="fn">standard_normal</span>((D1, D2))
z = rng.<span class="fn">standard_normal</span>((B, D2))

<span class="cm"># Per-batch bilinear: y[b] = x[b] @ W @ z[b]</span>
y = np.<span class="fn">einsum</span>(<span class="str">"bi,ij,bj->b"</span>, x, W, z)
<span class="fn">print</span>(<span class="str">"bilinear out:"</span>, y.shape, <span class="str">"first 3:"</span>, np.<span class="fn">round</span>(y[:<span class="num">3</span>], <span class="num">3</span>))

<span class="cm"># Verify against an explicit loop</span>
y_loop = np.<span class="fn">array</span>([x[b] @ W @ z[b] <span class="kw">for</span> b <span class="kw">in</span> <span class="fn">range</span>(B)])
<span class="fn">print</span>(<span class="str">"match loop:"</span>, np.<span class="fn">allclose</span>(y, y_loop))

<span class="cm"># Three-way contraction: tensor of shape (B, K) from (B,I), (I,J,K), (B,J)</span>
T = rng.<span class="fn">standard_normal</span>((D1, D2, <span class="num">3</span>))
out = np.<span class="fn">einsum</span>(<span class="str">"bi,ijk,bj->bk"</span>, x, T, z)
<span class="fn">print</span>(<span class="str">"3-way result:"</span>, out.shape)
</code></pre></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Optimizing Contraction Order</h2>
<p class="l-text">Multi-tensor einsums hide a combinatorial optimization problem: which pair to contract first? The wrong order can blow memory or cost orders of magnitude more flops. NumPy ships <code>optimize=True</code> which calls <code>opt_einsum</code> internally to find a near-optimal path.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, time
rng = np.random.<span class="fn">default_rng</span>(<span class="num">3</span>)

<span class="cm"># Contract four matrices: (a,b),(b,c),(c,d),(d,e) -> (a,e)</span>
A = rng.<span class="fn">standard_normal</span>((<span class="num">40</span>, <span class="num">50</span>))
B = rng.<span class="fn">standard_normal</span>((<span class="num">50</span>, <span class="num">60</span>))
C = rng.<span class="fn">standard_normal</span>((<span class="num">60</span>, <span class="num">70</span>))
D = rng.<span class="fn">standard_normal</span>((<span class="num">70</span>, <span class="num">30</span>))

<span class="cm"># Naive (left-to-right) vs optimized</span>
<span class="kw">def</span> <span class="fn">time_call</span>(fn, n=<span class="num">20</span>):
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n): <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

naive = <span class="kw">lambda</span>: np.<span class="fn">einsum</span>(<span class="str">"ab,bc,cd,de->ae"</span>, A, B, C, D, optimize=<span class="kw">False</span>)
opt   = <span class="kw">lambda</span>: np.<span class="fn">einsum</span>(<span class="str">"ab,bc,cd,de->ae"</span>, A, B, C, D, optimize=<span class="kw">True</span>)

t_naive = <span class="fn">time_call</span>(naive)
t_opt   = <span class="fn">time_call</span>(opt)
<span class="fn">print</span>(f<span class="str">"naive: {t_naive:.3f} ms"</span>)
<span class="fn">print</span>(f<span class="str">"opt  : {t_opt:.3f} ms  (speedup {t_naive/t_opt:.1f}x)"</span>)

<span class="cm"># Show the chosen contraction path</span>
path, info = np.<span class="fn">einsum_path</span>(<span class="str">"ab,bc,cd,de->ae"</span>, A, B, C, D, optimize=<span class="str">"optimal"</span>)
<span class="fn">print</span>(<span class="str">"path:"</span>, path)
<span class="fn">print</span>(info.<span class="fn">split</span>(<span class="str">"\\n"</span>)[<span class="num">0</span>])    <span class="cm"># short summary</span>
</code></pre></div>

<div class="calc-highlight">For two-tensor contractions, <code>einsum</code> falls back to BLAS-backed matmul and is roughly as fast as <code>@</code>. For 3+ tensors, <code>optimize=True</code> can be 10-1000x faster than naive left-to-right.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. When NOT to Use einsum</h2>
<p class="l-text"><code>einsum</code> is not universally fastest. Two cases where you should switch back to plain matmul or specialized routines:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Plain 2D matmul</div><div class="card-body"><code>A @ B</code> dispatches directly to BLAS gemm. <code>einsum("ik,kj->ij", A, B)</code> may add a small overhead. Difference is typically &lt; 5% but visible in tight inner loops.</div></div>
<div class="calc-card"><div class="card-title">Convolutions</div><div class="card-body">2D conv has dedicated FFT and Winograd kernels. Expressing it as einsum on a windowed view loses those optimizations.</div></div>
<div class="calc-card"><div class="card-title">Sparse tensors</div><div class="card-body"><code>einsum</code> is dense-only in NumPy. Use <code>scipy.sparse</code> matmul or torch.sparse for adjacency-style data.</div></div>
<div class="calc-card"><div class="card-title">Memory-bound contractions</div><div class="card-body">If the intermediate tensor exceeds RAM, no path optimization helps. Block your computation manually.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, time
rng = np.random.<span class="fn">default_rng</span>(<span class="num">4</span>)

A = rng.<span class="fn">standard_normal</span>((<span class="num">512</span>, <span class="num">512</span>))
B = rng.<span class="fn">standard_normal</span>((<span class="num">512</span>, <span class="num">512</span>))

<span class="kw">def</span> <span class="fn">bench</span>(fn, n=<span class="num">20</span>):
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n): <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

t_at  = <span class="fn">bench</span>(<span class="kw">lambda</span>: A @ B)
t_es  = <span class="fn">bench</span>(<span class="kw">lambda</span>: np.<span class="fn">einsum</span>(<span class="str">"ik,kj->ij"</span>, A, B))
t_eso = <span class="fn">bench</span>(<span class="kw">lambda</span>: np.<span class="fn">einsum</span>(<span class="str">"ik,kj->ij"</span>, A, B, optimize=<span class="kw">True</span>))
<span class="fn">print</span>(f<span class="str">"@           : {t_at:.3f} ms"</span>)
<span class="fn">print</span>(f<span class="str">"einsum      : {t_es:.3f} ms"</span>)
<span class="fn">print</span>(f<span class="str">"einsum opt  : {t_eso:.3f} ms"</span>)
<span class="cm"># In tight loops on 2D matmul, '@' usually wins. einsum shines for 3+ inputs.</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Reading Real-World einsum Strings</h2>
<p class="l-text">Once you can read these patterns, every transformer/attention paper becomes legible. Here is a cheat sheet.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title"><code>"ik,kj->ij"</code></div><div class="card-body">Matrix multiply.</div></div>
<div class="calc-card"><div class="card-title"><code>"bik,bkj->bij"</code></div><div class="card-body">Batched matmul.</div></div>
<div class="calc-card"><div class="card-title"><code>"bhid,bhjd->bhij"</code></div><div class="card-body">Attention scores (multi-head).</div></div>
<div class="calc-card"><div class="card-title"><code>"bhij,bhjd->bhid"</code></div><div class="card-body">Attention output (weighted V).</div></div>
<div class="calc-card"><div class="card-title"><code>"bi,ij,bj->b"</code></div><div class="card-body">Per-batch bilinear form.</div></div>
<div class="calc-card"><div class="card-title"><code>"...ij->...ji"</code></div><div class="card-body">Transpose last two dims, any leading batch.</div></div>
<div class="calc-card"><div class="card-title"><code>"ii->"</code></div><div class="card-body">Trace.</div></div>
<div class="calc-card"><div class="card-title"><code>"ij,j->i"</code></div><div class="card-body">Matrix-vector product.</div></div>
</div>

<p class="l-text">Print the cheat sheet. Stick it on your monitor for a week. After that the notation is permanent — you will read attention papers the way you now read <code>for i in range(n)</code>.</p>
</div>
`,
tr: `<p class="l-text"><strong><code>einsum</code>'ı okuyabiliyorsan her makaleyi okuyabilirsin.</strong> Attention, batched matmul, tensör ağlarındaki kontraksiyon, hatta backprop türetmeleri — modern ML notasyonu birkaç indeks harfi ve bir oka çöker. Notasyon ilk başta uzaylı görünür (<code>"bhid,bhjd->bhij"</code>?), ama bir kez kavradığında transpose-reshape-matmul zincirleri yazmayı bırakıp ne demek istediğini yazmaya başlarsın.</p>

<p class="l-text">Bu ders <code>einsum</code>'u indeks notasyonundan başlayarak öğretir. Matris çarpımını, batched matmul'u, scaled dot-product attention'ı, bilinear formları ve trace'i yeniden inşa edeceğiz — her birini birer satırda. Sonunda <code>einsum</code>'a önce uzanacaksın ve birisi sana <code>.transpose().reshape().matmul()</code> zinciri uzattığında biraz hakaret edilmiş gibi hissedeceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>NumPy'de Einstein toplama notasyonunu okuma ve yazma</li>
<li>matmul, batched matmul, transpose, trace ve dış çarpımı <code>einsum</code>'da ifade etme</li>
<li>scaled dot-product attention'ı (<code>"bhid,bhjd->bhij"</code>) baştan sona uygulama</li>
<li>Keyfi öncül batch boyutları için ellipsis (<code>...</code>) kullanma</li>
<li><code>optimize=True</code> ve <code>opt_einsum</code> ile kontraksiyon sırasını ayarlama</li>
<li><code>einsum</code>'un <code>@</code>'dan yavaş olduğu durumları tanıma ve geri dönme</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. 90 Saniyede İndeks Notasyonu</h2>
<p class="l-text">Einstein toplaması bir sözleşmedir: <strong>solda görünen ama sağda görünmeyen indeksler üzerinde toplanır</strong>. Diğer her indeks korunur. Tüm kural budur. Bunu içselleştirdiğinde her <code>einsum</code> string'i okunabilir olur.</p>

<div class="katex-block">$$C_{ij} = \\sum_k A_{ik} B_{kj} \\quad\\Longleftrightarrow\\quad \\text{einsum}(\\text{"ik,kj->ij"}, A, B)$$</div>

<p class="l-text"><code>"ik,kj->ij"</code> string'i şunu söyler: girdi <code>A</code>'nın indeksleri <code>i,k</code>; girdi <code>B</code>'nin indeksleri <code>k,j</code>; çıktının indeksleri <code>i,j</code>. Paylaşılan indeks <code>k</code> çıktıda yok, dolayısıyla toplanır. Bu matris çarpımıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tekrarlanan indeks</div><div class="card-body">Her iki girdide aynı harf = o eksen boyunca elemanlı çarpım, sonra çıktıda yoksa toplam.</div></div>
<div class="calc-card"><div class="card-title">Serbest indeks</div><div class="card-body">Çıktıda görünür = korunur (toplam yok). Sonucun şeklini tanımlar.</div></div>
<div class="calc-card"><div class="card-title">Dummy indeks</div><div class="card-body">Çıktıda yok = toplanır (kontrakte edilir). Einstein konvansiyonu.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Matmul, Trace, Diyagonal — Hepsi Tek Satırda</h2>
<p class="l-text">Kuralı bildiğinde klasik lineer cebir çöker. Aşağıdaki her işlem tek bir <code>einsum</code> çağrısı. Çalıştır ve kendini ikna et.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

A = rng.<span class="fn">standard_normal</span>((<span class="num">4</span>, <span class="num">5</span>))
B = rng.<span class="fn">standard_normal</span>((<span class="num">5</span>, <span class="num">3</span>))

<span class="cm"># Matris çarpımı: C[i,j] = sum_k A[i,k] B[k,j]</span>
C = np.<span class="fn">einsum</span>(<span class="str">"ik,kj->ij"</span>, A, B)
<span class="fn">print</span>(<span class="str">"matmul şekil:"</span>, C.shape, <span class="str">"@ ile eşleşme:"</span>, np.<span class="fn">allclose</span>(C, A @ B))

<span class="cm"># Eleman-bazlı çarpım sonra her iki eksende toplam (Frobenius iç çarpımı)</span>
M = rng.<span class="fn">standard_normal</span>((<span class="num">4</span>, <span class="num">4</span>))
N = rng.<span class="fn">standard_normal</span>((<span class="num">4</span>, <span class="num">4</span>))
fro = np.<span class="fn">einsum</span>(<span class="str">"ij,ij->"</span>, M, N)
<span class="fn">print</span>(<span class="str">"frobenius:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(fro), <span class="num">4</span>), <span class="str">"eşleşme:"</span>, np.<span class="fn">allclose</span>(fro, (M*N).<span class="fn">sum</span>()))

<span class="cm"># Trace: diyagonal toplamı -> indeks tekrarı, çıktı indeksi yok</span>
tr = np.<span class="fn">einsum</span>(<span class="str">"ii->"</span>, M)
<span class="fn">print</span>(<span class="str">"trace:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(tr), <span class="num">4</span>), <span class="str">"eşleşme:"</span>, np.<span class="fn">allclose</span>(tr, np.<span class="fn">trace</span>(M)))

<span class="cm"># Diyagonal vektör olarak: tekrarlanan indeksi tut</span>
diag = np.<span class="fn">einsum</span>(<span class="str">"ii->i"</span>, M)
<span class="fn">print</span>(<span class="str">"diag:"</span>, np.<span class="fn">round</span>(diag, <span class="num">3</span>))

<span class="cm"># Dış çarpım: u[i] v[j] -> O[i,j]</span>
u = rng.<span class="fn">standard_normal</span>(<span class="num">4</span>); v = rng.<span class="fn">standard_normal</span>(<span class="num">3</span>)
O = np.<span class="fn">einsum</span>(<span class="str">"i,j->ij"</span>, u, v)
<span class="fn">print</span>(<span class="str">"dış çarpım şekli:"</span>, O.shape, <span class="str">"eşleşme:"</span>, np.<span class="fn">allclose</span>(O, np.<span class="fn">outer</span>(u, v)))

<span class="cm"># Transpose: sadece çıktı harflerini permüte et</span>
At = np.<span class="fn">einsum</span>(<span class="str">"ij->ji"</span>, A)
<span class="fn">print</span>(<span class="str">"transpose eşleşmesi:"</span>, np.<span class="fn">allclose</span>(At, A.T))
</code></pre></div>

<p class="l-text">Bu blok her lineer cebir dersinin ayrı ayrı işlediği altı şeyi yapar. Notasyon hangi indekslerin yaşadığını ve öldüğünü düşünmeye zorlar — ki türevler attention makalelerinde tam olarak böyle hesaplanır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Batched Matmul &amp; Yayılım</h2>
<p class="l-text">Gerçek ML tensörleri batch boyutları taşır: <code>(batch, ...)</code> veya <code>(batch, head, ...)</code>. <code>einsum</code>'a öncül batch indeksi eklemek başka bir harf demektir — <code>einsum</code> yayılımı yerel olarak halleder.</p>

<div class="katex-block">$$C_{bij} = \\sum_k A_{bik} B_{bkj}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">1</span>)

<span class="cm"># Batched matmul: 32 çift 4x5 ve 5x3 matris</span>
A = rng.<span class="fn">standard_normal</span>((<span class="num">32</span>, <span class="num">4</span>, <span class="num">5</span>))
B = rng.<span class="fn">standard_normal</span>((<span class="num">32</span>, <span class="num">5</span>, <span class="num">3</span>))

C = np.<span class="fn">einsum</span>(<span class="str">"bik,bkj->bij"</span>, A, B)
<span class="fn">print</span>(<span class="str">"batched matmul:"</span>, C.shape)
<span class="fn">print</span>(<span class="str">"np.matmul ile eşleşme:"</span>, np.<span class="fn">allclose</span>(C, np.<span class="fn">matmul</span>(A, B)))

<span class="cm"># Yayılım: her batch için aynı B -> B'den b'yi düşür</span>
B_shared = rng.<span class="fn">standard_normal</span>((<span class="num">5</span>, <span class="num">3</span>))
C2 = np.<span class="fn">einsum</span>(<span class="str">"bik,kj->bij"</span>, A, B_shared)
<span class="fn">print</span>(<span class="str">"yayılan B:"</span>, C2.shape)

<span class="cm"># Ellipsis: keyfi öncül boyutlar</span>
X = rng.<span class="fn">standard_normal</span>((<span class="num">2</span>, <span class="num">3</span>, <span class="num">4</span>, <span class="num">5</span>))   <span class="cm"># herhangi öncül boyutlar</span>
Y = rng.<span class="fn">standard_normal</span>((<span class="num">2</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">6</span>))
Z = np.<span class="fn">einsum</span>(<span class="str">"...ik,...kj->...ij"</span>, X, Y)
<span class="fn">print</span>(<span class="str">"ellipsis matmul:"</span>, Z.shape)   <span class="cm"># (2, 3, 4, 6)</span>
</code></pre></div>

<div class="calc-highlight">Ellipsis numarası üretim kodundaki en kullanışlı tek desendir. Kontraksiyonunu sondaki boyutlar üzerinde bir kez yaz ve herhangi sayıda batch ekseninin geçmesine izin ver.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Scaled Dot-Product Attention</h2>
<p class="l-text">Attention kanonik kullanım örneğidir. <code>(batch, head, seq, dim)</code> şeklinde query, key, value verildiğinde, scores tensörünün şekli <code>(batch, head, seq_q, seq_k)</code>. Kontraksiyon head başına özellik boyutu <code>d</code>'yi çökertir.</p>

<div class="katex-block">$$\\text{scores}_{bhij} = \\frac{1}{\\sqrt{d}} \\sum_d Q_{bhid} K_{bhjd}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)

B, H, T, D = <span class="num">2</span>, <span class="num">4</span>, <span class="num">6</span>, <span class="num">8</span>     <span class="cm"># batch, head, seq, head_dim</span>

Q = rng.<span class="fn">standard_normal</span>((B, H, T, D)).<span class="fn">astype</span>(np.float32)
K = rng.<span class="fn">standard_normal</span>((B, H, T, D)).<span class="fn">astype</span>(np.float32)
V = rng.<span class="fn">standard_normal</span>((B, H, T, D)).<span class="fn">astype</span>(np.float32)

<span class="cm"># Skorlar: head_dim 'd' üzerinde kontrakte et</span>
scores = np.<span class="fn">einsum</span>(<span class="str">"bhid,bhjd->bhij"</span>, Q, K) / np.<span class="fn">sqrt</span>(D)
<span class="fn">print</span>(<span class="str">"skorlar:"</span>, scores.shape)        <span class="cm"># (B, H, T, T)</span>

<span class="cm"># Key ekseninde (son) softmax</span>
scores -= scores.<span class="fn">max</span>(axis=-<span class="num">1</span>, keepdims=<span class="kw">True</span>)   <span class="cm"># sayısal kararlılık</span>
attn = np.<span class="fn">exp</span>(scores)
attn /= attn.<span class="fn">sum</span>(axis=-<span class="num">1</span>, keepdims=<span class="kw">True</span>)

<span class="cm"># Value üzerinde ağırlıklı toplam: j (key/value pozisyonu) üzerinde kontrakte et</span>
out = np.<span class="fn">einsum</span>(<span class="str">"bhij,bhjd->bhid"</span>, attn, V)
<span class="fn">print</span>(<span class="str">"çıktı:"</span>, out.shape)           <span class="cm"># (B, H, T, D)</span>

<span class="cm"># Akıl sağlığı: olasılıklar son eksen boyunca 1'e toplanır</span>
<span class="fn">print</span>(<span class="str">"attn toplamları:"</span>, np.<span class="fn">round</span>(attn.<span class="fn">sum</span>(axis=-<span class="num">1</span>), <span class="num">4</span>)[<span class="num">0</span>, <span class="num">0</span>])
</code></pre></div>

<p class="l-text">İki einsum ve bir softmax — tüm transformer attention bloğu. İndeks harflerinin hikayeyi nasıl anlattığına dikkat et: <code>i</code> query pozisyonu, <code>j</code> key/value pozisyonu, <code>d</code> skorlarda toplanan ve <code>V</code>'den okurken yeniden tanıtılan head başına özellik boyutu.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Bilinear Formlar &amp; Tensör Kontraksiyonları</h2>
<p class="l-text">Bilinear katmanlar (eski ilişki çıkarma modellerinde ve modern Mixture-of-Experts gating'de kullanılır) batch başına <code>x^T W y</code> hesaplar. einsum olmadan bu, garip bir <code>reshape</code> ve <code>matmul</code> sırasıdır. einsum ile iki harftir.</p>

<div class="katex-block">$$y_b = \\sum_{i,j} x_{bi} W_{ij} z_{bj}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">2</span>)

B, D1, D2 = <span class="num">16</span>, <span class="num">5</span>, <span class="num">7</span>
x = rng.<span class="fn">standard_normal</span>((B, D1))
W = rng.<span class="fn">standard_normal</span>((D1, D2))
z = rng.<span class="fn">standard_normal</span>((B, D2))

<span class="cm"># Batch başına bilinear: y[b] = x[b] @ W @ z[b]</span>
y = np.<span class="fn">einsum</span>(<span class="str">"bi,ij,bj->b"</span>, x, W, z)
<span class="fn">print</span>(<span class="str">"bilinear çıktı:"</span>, y.shape, <span class="str">"ilk 3:"</span>, np.<span class="fn">round</span>(y[:<span class="num">3</span>], <span class="num">3</span>))

<span class="cm"># Açık döngüye karşı doğrula</span>
y_loop = np.<span class="fn">array</span>([x[b] @ W @ z[b] <span class="kw">for</span> b <span class="kw">in</span> <span class="fn">range</span>(B)])
<span class="fn">print</span>(<span class="str">"döngü ile eşleşme:"</span>, np.<span class="fn">allclose</span>(y, y_loop))

<span class="cm"># Üç-yollu kontraksiyon: (B,I), (I,J,K), (B,J)'den şekli (B, K) olan tensör</span>
T = rng.<span class="fn">standard_normal</span>((D1, D2, <span class="num">3</span>))
out = np.<span class="fn">einsum</span>(<span class="str">"bi,ijk,bj->bk"</span>, x, T, z)
<span class="fn">print</span>(<span class="str">"3-yollu sonuç:"</span>, out.shape)
</code></pre></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kontraksiyon Sırasını Optimize Etme</h2>
<p class="l-text">Çok-tensörlü einsum'lar bir kombinatoryal optimizasyon problemi gizler: hangi çift önce kontrakte edilsin? Yanlış sıra belleği patlatabilir veya büyüklük sıralarında daha fazla flop maliyetine yol açabilir. NumPy <code>optimize=True</code>'yu sunar; bu içeride <code>opt_einsum</code>'u çağırarak optimuma yakın bir yol bulur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, time
rng = np.random.<span class="fn">default_rng</span>(<span class="num">3</span>)

<span class="cm"># Dört matrisi kontrakte et: (a,b),(b,c),(c,d),(d,e) -> (a,e)</span>
A = rng.<span class="fn">standard_normal</span>((<span class="num">40</span>, <span class="num">50</span>))
B = rng.<span class="fn">standard_normal</span>((<span class="num">50</span>, <span class="num">60</span>))
C = rng.<span class="fn">standard_normal</span>((<span class="num">60</span>, <span class="num">70</span>))
D = rng.<span class="fn">standard_normal</span>((<span class="num">70</span>, <span class="num">30</span>))

<span class="cm"># Naif (soldan sağa) vs optimize edilmiş</span>
<span class="kw">def</span> <span class="fn">time_call</span>(fn, n=<span class="num">20</span>):
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n): <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

naive = <span class="kw">lambda</span>: np.<span class="fn">einsum</span>(<span class="str">"ab,bc,cd,de->ae"</span>, A, B, C, D, optimize=<span class="kw">False</span>)
opt   = <span class="kw">lambda</span>: np.<span class="fn">einsum</span>(<span class="str">"ab,bc,cd,de->ae"</span>, A, B, C, D, optimize=<span class="kw">True</span>)

t_naive = <span class="fn">time_call</span>(naive)
t_opt   = <span class="fn">time_call</span>(opt)
<span class="fn">print</span>(f<span class="str">"naif: {t_naive:.3f} ms"</span>)
<span class="fn">print</span>(f<span class="str">"opt : {t_opt:.3f} ms  (hızlanma {t_naive/t_opt:.1f}x)"</span>)

<span class="cm"># Seçilen kontraksiyon yolunu göster</span>
path, info = np.<span class="fn">einsum_path</span>(<span class="str">"ab,bc,cd,de->ae"</span>, A, B, C, D, optimize=<span class="str">"optimal"</span>)
<span class="fn">print</span>(<span class="str">"yol:"</span>, path)
<span class="fn">print</span>(info.<span class="fn">split</span>(<span class="str">"\\n"</span>)[<span class="num">0</span>])    <span class="cm"># kısa özet</span>
</code></pre></div>

<div class="calc-highlight">İki-tensörlü kontraksiyonlar için <code>einsum</code> BLAS destekli matmul'a düşer ve kabaca <code>@</code> kadar hızlıdır. 3+ tensör için <code>optimize=True</code> naif soldan-sağaya göre 10-1000x daha hızlı olabilir.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. einsum Ne Zaman KULLANILMAMALI</h2>
<p class="l-text"><code>einsum</code> evrensel olarak en hızlı değildir. Sade matmul'a veya özelleşmiş rutinlere dönmen gereken iki durum:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sade 2D matmul</div><div class="card-body"><code>A @ B</code> doğrudan BLAS gemm'e dispatch eder. <code>einsum("ik,kj->ij", A, B)</code> küçük bir yük ekleyebilir. Fark genellikle &lt; %5 ama sıkı iç döngülerde görünür.</div></div>
<div class="calc-card"><div class="card-title">Konvolüsyonlar</div><div class="card-body">2D conv'un özel FFT ve Winograd çekirdekleri vardır. Pencereli görünüm üzerinde einsum olarak ifade etmek bu optimizasyonları kaybeder.</div></div>
<div class="calc-card"><div class="card-title">Seyrek tensörler</div><div class="card-body">NumPy'de <code>einsum</code> yalnızca yoğundur. Komşuluk-stili veriler için <code>scipy.sparse</code> matmul veya torch.sparse kullan.</div></div>
<div class="calc-card"><div class="card-title">Bellek bağlı kontraksiyonlar</div><div class="card-body">Ara tensör RAM'i aşarsa hiçbir yol optimizasyonu işe yaramaz. Hesaplamayı manuel olarak blokla.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, time
rng = np.random.<span class="fn">default_rng</span>(<span class="num">4</span>)

A = rng.<span class="fn">standard_normal</span>((<span class="num">512</span>, <span class="num">512</span>))
B = rng.<span class="fn">standard_normal</span>((<span class="num">512</span>, <span class="num">512</span>))

<span class="kw">def</span> <span class="fn">bench</span>(fn, n=<span class="num">20</span>):
    t0 = time.<span class="fn">perf_counter</span>()
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n): <span class="fn">fn</span>()
    <span class="kw">return</span> (time.<span class="fn">perf_counter</span>() - t0) / n * <span class="num">1000</span>

t_at  = <span class="fn">bench</span>(<span class="kw">lambda</span>: A @ B)
t_es  = <span class="fn">bench</span>(<span class="kw">lambda</span>: np.<span class="fn">einsum</span>(<span class="str">"ik,kj->ij"</span>, A, B))
t_eso = <span class="fn">bench</span>(<span class="kw">lambda</span>: np.<span class="fn">einsum</span>(<span class="str">"ik,kj->ij"</span>, A, B, optimize=<span class="kw">True</span>))
<span class="fn">print</span>(f<span class="str">"@           : {t_at:.3f} ms"</span>)
<span class="fn">print</span>(f<span class="str">"einsum      : {t_es:.3f} ms"</span>)
<span class="fn">print</span>(f<span class="str">"einsum opt  : {t_eso:.3f} ms"</span>)
<span class="cm"># Sıkı döngülerde 2D matmul'da '@' genellikle kazanır. einsum 3+ girdide parlar.</span>
</code></pre></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gerçek Dünya einsum String'lerini Okuma</h2>
<p class="l-text">Bu desenleri okuyabilirsen her transformer/attention makalesi okunaklı olur. İşte bir hile kâğıdı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title"><code>"ik,kj->ij"</code></div><div class="card-body">Matris çarpımı.</div></div>
<div class="calc-card"><div class="card-title"><code>"bik,bkj->bij"</code></div><div class="card-body">Batched matmul.</div></div>
<div class="calc-card"><div class="card-title"><code>"bhid,bhjd->bhij"</code></div><div class="card-body">Attention skorları (multi-head).</div></div>
<div class="calc-card"><div class="card-title"><code>"bhij,bhjd->bhid"</code></div><div class="card-body">Attention çıktısı (ağırlıklı V).</div></div>
<div class="calc-card"><div class="card-title"><code>"bi,ij,bj->b"</code></div><div class="card-body">Batch başına bilinear form.</div></div>
<div class="calc-card"><div class="card-title"><code>"...ij->...ji"</code></div><div class="card-body">Son iki boyutu transpose, herhangi öncül batch.</div></div>
<div class="calc-card"><div class="card-title"><code>"ii->"</code></div><div class="card-body">Trace.</div></div>
<div class="calc-card"><div class="card-title"><code>"ij,j->i"</code></div><div class="card-body">Matris-vektör çarpımı.</div></div>
</div>

<p class="l-text">Hile kâğıdını yazdır. Bir hafta monitörüne yapıştır. Sonra notasyon kalıcı olur — attention makalelerini şu an <code>for i in range(n)</code> okuduğun gibi okuyacaksın.</p>
</div>
`
};
