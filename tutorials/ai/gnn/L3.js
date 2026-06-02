window.GNN_L3 = {
en: `<p class="l-text"><strong>The graph Laplacian is to GNNs what the Fourier transform is to signal processing.</strong> It decomposes any function on the graph into "frequencies" — eigenvectors of the Laplacian — that go from very smooth (low frequency, similar values on connected nodes) to very oscillatory (high frequency, sign flips on every edge). A GNN is, at its mathematical core, a low-pass filter on this graph spectrum: it suppresses high-frequency noise and keeps the smooth signal. Once you see this, the famous Kipf-Welling formula $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ stops looking magical and starts looking like a 5-line derivation from spectral graph theory.</p>

<p class="l-text">In this lesson we build the bridge: graph Laplacian and its variants, eigenvalues and eigenvectors as graph harmonics, spectral clustering as the textbook application, diffusion as iterated averaging, and finally the heat-kernel argument that gives GCN its functional form. We compute everything in the browser on a small graph using <code>scipy.sparse.linalg.eigsh</code> (yes, scipy works in Pyodide). By the end you will know why deep GNNs over-smooth (all eigenvectors above the smallest get washed out) and why APPNP, JKNet, and GCNII were invented.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define the unnormalized, symmetric, and random-walk Laplacians and their spectra</li>
<li>Interpret eigenvectors of $L$ as graph Fourier basis (smooth &rarr; oscillatory)</li>
<li>Run spectral clustering: eigendecomposition + KMeans on bottom $k$ eigenvectors</li>
<li>See diffusion / heat equation as iterated averaging $H \\leftarrow \\hat{A}H$</li>
<li>Derive Kipf-Welling's normalized adjacency from the heat-kernel approximation</li>
<li>Diagnose oversmoothing in deep GNNs and know the standard fixes</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Three Laplacians</h2>
<p class="l-text">For an undirected graph with adjacency $A$ and degree matrix $D = \\mathrm{diag}(d_1,\\dots,d_N)$:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Unnormalized $L = D - A$</div><div class="card-body">Always symmetric, positive semi-definite. Smallest eigenvalue is 0 (eigenvector = constant). Used in spectral clustering and Laplacian smoothing.</div></div>
<div class="calc-card"><div class="card-title">Symmetric normalized $L_{\\mathrm{sym}} = D^{-1/2} L D^{-1/2}$</div><div class="card-body">Eigenvalues in $[0, 2]$. Used in normalized spectral clustering (Ng-Jordan-Weiss 2002) and in the GCN derivation.</div></div>
<div class="calc-card"><div class="card-title">Random-walk $L_{\\mathrm{rw}} = D^{-1} L = I - D^{-1}A$</div><div class="card-body">Not symmetric, but related to the random-walk transition matrix. Used in PageRank-style derivations (APPNP).</div></div>
</div>

<div class="katex-block">$$L = D - A, \\qquad L_{\\mathrm{sym}} = I - D^{-1/2}A D^{-1/2}, \\qquad L_{\\mathrm{rw}} = I - D^{-1}A$$</div>

<p class="l-text">A key property: for any signal $x \\in \\mathbb{R}^N$ on the graph, the quadratic form is</p>

<div class="katex-block">$$x^\\top L x = \\sum_{(i,j) \\in E} (x_i - x_j)^2$$</div>

<p class="l-text">i.e. <em>the total squared difference across edges</em>. Minimizing this is "make connected nodes similar" — exactly what GNNs do.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Eigenvectors as Graph Fourier Basis</h2>
<p class="l-text">The Laplacian's eigenvectors $\\{u_k\\}$ are the analog of sines and cosines on the graph. The smallest eigenvalue $\\lambda_0 = 0$ has the constant eigenvector — the "DC component", maximally smooth. Larger eigenvalues correspond to eigenvectors that oscillate more across edges. The full eigendecomposition $L = U\\Lambda U^\\top$ defines the <strong>graph Fourier transform</strong>:</p>

<div class="katex-block">$$\\hat{x} = U^\\top x, \\qquad x = U \\hat{x}$$</div>

<p class="l-text">A <strong>spectral filter</strong> $g(\\lambda)$ acts as $g(L) x = U \\, g(\\Lambda) \\, U^\\top x$. <strong>ChebNet</strong> (Defferrard et al. 2016) approximates $g$ with Chebyshev polynomials in $L$ to avoid the $O(N^3)$ eigendecomposition. <strong>GCN</strong> (next lesson) is the 1st-order Chebyshev approximation.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Compute the Laplacian's eigenpairs on a path graph; eigenvectors should look like discrete sines.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">path_graph</span>(<span class="num">10</span>)             <span class="cm"># P_10: 10 nodes in a chain</span>
A = nx.<span class="fn">to_numpy_array</span>(G)
D = np.<span class="fn">diag</span>(A.<span class="fn">sum</span>(axis=<span class="num">1</span>))
L = D - A                          <span class="cm"># unnormalized Laplacian</span>

w, U = np.linalg.<span class="fn">eigh</span>(L)           <span class="cm"># full eigendecomposition (small graph OK)</span>
<span class="fn">print</span>(<span class="str">"Eigenvalues (low to high):"</span>, np.<span class="fn">round</span>(w, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"\\nFirst eigenvector (constant, 'DC'):"</span>, np.<span class="fn">round</span>(U[:, <span class="num">0</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Second eigenvector (smoothest non-trivial):"</span>, np.<span class="fn">round</span>(U[:, <span class="num">1</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Last eigenvector (highest frequency):"</span>, np.<span class="fn">round</span>(U[:, -<span class="num">1</span>], <span class="num">3</span>))

<span class="cm"># Quadratic form check: u_k^T L u_k = lambda_k</span>
<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">9</span>]:
    <span class="fn">print</span>(f<span class="str">"u_{k}^T L u_{k} = {U[:,k] @ L @ U[:,k]:.4f}  (should equal lambda_{k} = {w[k]:.4f})"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Spectral Clustering</h2>
<p class="l-text"><strong>Spectral clustering</strong> (Shi-Malik 2000, Ng-Jordan-Weiss 2002) is the textbook application of the Laplacian. The recipe:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1</div><div class="card-body">Build the symmetric normalized Laplacian $L_{\\mathrm{sym}}$.</div></div>
<div class="calc-card"><div class="card-title">Step 2</div><div class="card-body">Compute the bottom $k$ eigenvectors (lowest eigenvalues). Stack them as columns into $U_k \\in \\mathbb{R}^{N \\times k}$.</div></div>
<div class="calc-card"><div class="card-title">Step 3</div><div class="card-body">Treat each row of $U_k$ as a $k$-dimensional embedding of node $i$. Run KMeans with $k$ clusters.</div></div>
</div>

<p class="l-text">It works because the bottom eigenvectors of $L_{\\mathrm{sym}}$ encode the coarsest cuts in the graph — the natural communities. The Cheeger inequality formalizes this: small eigenvalue ⇔ existence of a sparse cut.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Spectral clustering on a graph with two planted communities (stochastic block model). Use scipy sparse eigensolver.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> eigsh
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans

<span class="cm"># Stochastic block model: 2 communities of 30 nodes each, dense within, sparse across</span>
sizes = [<span class="num">30</span>, <span class="num">30</span>]
p_in, p_out = <span class="num">0.30</span>, <span class="num">0.03</span>
G = nx.<span class="fn">stochastic_block_model</span>(sizes, [[p_in, p_out],[p_out, p_in]], seed=<span class="num">1</span>)
truth = np.<span class="fn">array</span>([G.nodes[n][<span class="str">"block"</span>] <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])

A = nx.<span class="fn">to_scipy_sparse_array</span>(G, format=<span class="str">"csr"</span>).<span class="fn">astype</span>(<span class="fn">float</span>)
deg = np.<span class="fn">asarray</span>(A.<span class="fn">sum</span>(axis=<span class="num">1</span>)).<span class="fn">flatten</span>()
D_inv_sqrt = <span class="fn">csr_matrix</span>(np.<span class="fn">diag</span>(<span class="num">1.0</span> / np.<span class="fn">sqrt</span>(deg + <span class="num">1e-12</span>)))
L_sym = <span class="fn">csr_matrix</span>(np.<span class="fn">eye</span>(A.shape[<span class="num">0</span>])) - D_inv_sqrt @ A @ D_inv_sqrt

<span class="cm"># Bottom-2 eigenvectors of L_sym</span>
w, U = <span class="fn">eigsh</span>(L_sym, k=<span class="num">2</span>, which=<span class="str">"SM"</span>)
<span class="fn">print</span>(<span class="str">"Smallest eigenvalues:"</span>, np.<span class="fn">round</span>(w, <span class="num">4</span>))

km = <span class="fn">KMeans</span>(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(U)
acc = <span class="fn">max</span>((km.labels_ == truth).<span class="fn">mean</span>(), (km.labels_ != truth).<span class="fn">mean</span>())
<span class="fn">print</span>(f<span class="str">"Spectral clustering accuracy vs ground truth: {acc:.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Diffusion: Iterated Averaging</h2>
<p class="l-text">A <strong>graph diffusion</strong> step takes a signal $x$ and replaces each node's value with a weighted average of its neighbors. The simplest case is mean-aggregation: $x \\leftarrow D^{-1}A\\,x$. After many steps, every node's value converges to a global average — the graph "smooths out". This is exactly the heat equation $\\partial_t x = -L x$ in discrete time.</p>

<div class="katex-block">$$x_{t+1} = (I - \\tau L) \\, x_t \\;\\;\\Longleftrightarrow\\;\\; x_t = e^{-tL} \\, x_0 = U \\, e^{-t\\Lambda} \\, U^\\top \\, x_0$$</div>

<p class="l-text">In Fourier space, diffusion multiplies the $k$-th frequency by $e^{-t\\lambda_k}$ — high frequencies decay much faster than low ones. <em>Diffusion is a low-pass filter</em>. This is why a GCN smooths features: it is a discretized heat equation on the graph, with one matrix-multiply per layer.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Watch a delta signal diffuse: start with value 1 at one node, average with neighbors over time, see the heat spread.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">path_graph</span>(<span class="num">10</span>)
A = nx.<span class="fn">to_numpy_array</span>(G)
D_inv = np.<span class="fn">diag</span>(<span class="num">1.0</span> / A.<span class="fn">sum</span>(axis=<span class="num">1</span>))
P = D_inv @ A   <span class="cm"># row-stochastic transition matrix</span>

<span class="cm"># Initial heat: 1.0 at the leftmost node, 0 elsewhere</span>
x = np.<span class="fn">zeros</span>(<span class="num">10</span>); x[<span class="num">0</span>] = <span class="num">1.0</span>
<span class="fn">print</span>(f<span class="str">"t=0: {np.round(x, 3)}"</span>)

<span class="kw">for</span> t <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>, <span class="num">20</span>, <span class="num">100</span>]:
    xt = np.linalg.<span class="fn">matrix_power</span>(P, t) @ x
    <span class="fn">print</span>(f<span class="str">"t={t:3d}: {np.round(xt, 3)}  (sum={xt.sum():.3f})"</span>)
</code></pre></div>
</div>

<p class="l-text">After enough steps the distribution becomes uniform — every node has the same value. <strong>This is oversmoothing in slow motion</strong>: stack too many GCN layers and the same thing happens to your node features.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. From Spectral Filter to GCN — The Half-Page Derivation</h2>
<p class="l-text">Defferrard et al.'s ChebNet defines a spectral filter as a Chebyshev polynomial of order $K$ in the rescaled Laplacian. Kipf &amp; Welling's GCN takes $K{=}1$ and adds a renormalization trick. The full chain:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spectral filter</div><div class="card-body">$g_\\theta(L) x = U \\, g_\\theta(\\Lambda) \\, U^\\top x$. Costly: needs the full eigendecomposition.</div></div>
<div class="calc-card"><div class="card-title">Chebyshev approximation</div><div class="card-body">$g_\\theta(L) \\approx \\sum_{k=0}^{K} \\theta_k T_k(\\tilde{L})$ where $T_k$ are Chebyshev polynomials. No eigendecomp; $K$ controls receptive field.</div></div>
<div class="calc-card"><div class="card-title">First-order, single param</div><div class="card-body">Set $K{=}1$, share parameters: $g_\\theta x \\approx \\theta(I + D^{-1/2}AD^{-1/2})\\,x$.</div></div>
<div class="calc-card"><div class="card-title">Renormalization trick</div><div class="card-body">Replace $I+A$ with $\\tilde{A} = A+I$ (self-loops) and renormalize: $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$. Eigenvalues stay in $[0,2]$, no exploding gradients.</div></div>
</div>

<div class="katex-block">$$\\boxed{\\;H^{(l+1)} = \\sigma\\!\\left(\\tilde{D}^{-1/2}\\,\\tilde{A}\\,\\tilde{D}^{-1/2}\\,H^{(l)}\\,W^{(l)}\\right)\\;}$$</div>

<p class="l-text">That is GCN. The next lesson implements it in NumPy. The takeaway here: <em>GCN is a one-step spectral diffusion with a learned linear projection</em>. Everything else is engineering.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Oversmoothing — When More Layers Hurt</h2>
<p class="l-text">Stacking GCN layers is equivalent to multi-step diffusion. The fixed point of mean-aggregation is the constant signal — every node has the same representation. This is <strong>oversmoothing</strong> (Li et al. 2018, Oono &amp; Suzuki 2020). On Cora, accuracy peaks at 2 layers and degrades beyond 4.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Diagnosis</div><div class="card-body">Measure pairwise cosine similarity of node embeddings. As layers grow, similarity → 1 (everything collapses).</div></div>
<div class="calc-card"><div class="card-title">Fix 1 — Residuals (GCNII)</div><div class="card-body">$H^{(l+1)} = ((1-\\alpha)\\,\\hat{A}H^{(l)} + \\alpha H^{(0)})\\,((1-\\beta)I + \\beta W)$. Inject the input at every layer, blend with identity.</div></div>
<div class="calc-card"><div class="card-title">Fix 2 — Decoupling (APPNP)</div><div class="card-body">Apply a single MLP, then propagate via personalized PageRank: $H = (1-\\alpha)\\hat{A}H + \\alpha H_0$ for $K$ steps. No per-layer weights.</div></div>
<div class="calc-card"><div class="card-title">Fix 3 — Skip layers (JKNet)</div><div class="card-body">Concatenate / pool representations from all layers as the final embedding.</div></div>
</div>

<div class="calc-highlight"><strong>Practical rule:</strong> default to 2 layers. If you need more "depth" (longer-range dependencies), use APPNP-style decoupling instead of stacking more GCN layers.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Heterophily: When Smoothing Is Wrong</h2>
<p class="l-text">GCN's homophily assumption — "neighbors share labels" — fails on graphs like protein-protein interaction (different functions interact) or the Squirrel/Chameleon Wikipedia networks. Smoothing destroys the signal. Heterophily-aware GNNs (H2GCN, GPRGNN, FAGCN) keep separate self vs. neighbor channels or learn signed edge weights.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Quick homophily score: fraction of edges connecting same-label nodes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="cm"># Two communities, mostly-within edges</span>
G = nx.<span class="fn">stochastic_block_model</span>([<span class="num">20</span>,<span class="num">20</span>], [[<span class="num">0.4</span>, <span class="num">0.05</span>],[<span class="num">0.05</span>, <span class="num">0.4</span>]], seed=<span class="num">2</span>)
labels = np.<span class="fn">array</span>([G.nodes[n][<span class="str">"block"</span>] <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])

same = <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> u,v <span class="kw">in</span> G.<span class="fn">edges</span>() <span class="kw">if</span> labels[u] == labels[v])
homophily = same / G.<span class="fn">number_of_edges</span>()
<span class="fn">print</span>(f<span class="str">"Homophily: {homophily:.3f}  (>0.5 means GCN-friendly)"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">Spectral graph theory turns a discrete object (a graph) into a continuous one (eigenvalues, smooth functions). The Laplacian is the bridge. GCN is a one-step low-pass filter on the graph spectrum. Stacking too many such filters destroys the signal — the engineering of modern GNNs is largely about counteracting this.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Three Laplacians: unnormalized $L = D-A$, symmetric $L_{\\mathrm{sym}}$, random-walk $L_{\\mathrm{rw}}$.</li>
<li>Eigenvectors of $L$ form the graph Fourier basis (smooth → oscillatory).</li>
<li>Spectral clustering: bottom-$k$ eigenvectors + KMeans recovers communities.</li>
<li>Diffusion = heat equation = repeated averaging = low-pass filter.</li>
<li>GCN = first-order Chebyshev approximation with renormalized adjacency.</li>
<li>Oversmoothing limits depth; APPNP / GCNII / JKNet are the fixes.</li>
</ul>
</div>

<p class="l-text">In <strong>gnn-L4</strong> we put the math to work: derive Kipf-Welling step by step and implement a 2-layer GCN forward pass in pure NumPy on a 5-node toy graph, training it to classify nodes by gradient descent (no PyTorch required).</p>
</div>`,
tr: `<p class="l-text"><strong>Graf Laplacian'ı GNN'ler için, Fourier dönüşümünün sinyal işleme için olduğu şeydir.</strong> Graf üzerindeki herhangi bir fonksiyonu "frekanslara" — Laplacian'ın özvektörlerine — ayrıştırır; bunlar çok pürüzsüz olandan (düşük frekans, bağlı düğümlerde benzer değerler) çok salınımlı olana (yüksek frekans, her kenarda işaret değişimi) gider. Bir GNN, matematiksel özünde bu graf spektrumunda alçak geçiren bir filtredir: yüksek frekanslı gürültüyü bastırır ve pürüzsüz sinyali tutar. Bunu gördükten sonra, ünlü Kipf-Welling formülü $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$ büyülü görünmekten çıkıp spektral graf teorisinden 5 satırlık bir türetme gibi görünmeye başlar.</p>

<p class="l-text">Bu derste köprüyü inşa ediyoruz: graf Laplacian'ı ve varyantları, graf harmonikleri olarak özdeğerler ve özvektörler, ders kitabı uygulaması olarak spektral kümeleme, yinelenmiş ortalama olarak difüzyon ve son olarak GCN'e fonksiyonel formunu veren ısı çekirdeği argümanı. Tarayıcıda <code>scipy.sparse.linalg.eigsh</code> kullanarak küçük bir grafta her şeyi hesaplıyoruz (evet, scipy Pyodide'de çalışır). Sonunda, derin GNN'lerin neden aşırı düzleştirdiğini (en küçük olanın üzerindeki tüm özvektörler yıkanır) ve neden APPNP, JKNet ve GCNII'nin icat edildiğini bileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Normalize edilmemiş, simetrik ve rastgele yürüyüş Laplacian'larını ve spektrumlarını tanımlamak</li>
<li>$L$'nin özvektörlerini graf Fourier tabanı olarak yorumlamak (pürüzsüz &rarr; salınımlı)</li>
<li>Spektral kümelemeyi çalıştırmak: özayrıştırma + en küçük $k$ özvektör üzerinde KMeans</li>
<li>Difüzyonu / ısı denklemini yinelenmiş ortalama $H \\leftarrow \\hat{A}H$ olarak görmek</li>
<li>Kipf-Welling'in normalize edilmiş komşuluk matrisini ısı çekirdeği yaklaşımından türetmek</li>
<li>Derin GNN'lerde aşırı düzleşmeyi teşhis etmek ve standart düzeltmeleri bilmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç Laplacian</h2>
<p class="l-text">Komşuluk $A$ ve derece matrisi $D = \\mathrm{diag}(d_1,\\dots,d_N)$ olan yönsüz bir graf için:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Normalize edilmemiş $L = D - A$</div><div class="card-body">Her zaman simetriktir, pozitif yarı-tanımlıdır. En küçük özdeğer 0'dır (özvektör = sabit). Spektral kümeleme ve Laplacian düzleştirmede kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Simetrik normalize edilmiş $L_{\\mathrm{sym}} = D^{-1/2} L D^{-1/2}$</div><div class="card-body">Özdeğerler $[0, 2]$ aralığındadır. Normalize edilmiş spektral kümelemede (Ng-Jordan-Weiss 2002) ve GCN türetmesinde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Rastgele yürüyüş $L_{\\mathrm{rw}} = D^{-1} L = I - D^{-1}A$</div><div class="card-body">Simetrik değildir, ancak rastgele yürüyüş geçiş matrisi ile ilişkilidir. PageRank-tarzı türetmelerde (APPNP) kullanılır.</div></div>
</div>

<div class="katex-block">$$L = D - A, \\qquad L_{\\mathrm{sym}} = I - D^{-1/2}A D^{-1/2}, \\qquad L_{\\mathrm{rw}} = I - D^{-1}A$$</div>

<p class="l-text">Anahtar bir özellik: graf üzerindeki herhangi bir sinyal $x \\in \\mathbb{R}^N$ için ikinci dereceden form şudur:</p>

<div class="katex-block">$$x^\\top L x = \\sum_{(i,j) \\in E} (x_i - x_j)^2$$</div>

<p class="l-text">yani <em>kenarlar arası toplam karesel fark</em>. Bunu minimize etmek "bağlı düğümleri benzer yap" demektir — tam olarak GNN'lerin yaptığı şey.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Graf Fourier Tabanı Olarak Özvektörler</h2>
<p class="l-text">Laplacian'ın özvektörleri $\\{u_k\\}$, graftaki sinüslerin ve kosinüslerin analoğudur. En küçük özdeğer $\\lambda_0 = 0$, sabit özvektöre sahiptir — "DC bileşeni", maksimum pürüzsüz. Daha büyük özdeğerler, kenarlar üzerinde daha fazla salınan özvektörlere karşılık gelir. Tam özayrıştırma $L = U\\Lambda U^\\top$, <strong>graf Fourier dönüşümünü</strong> tanımlar:</p>

<div class="katex-block">$$\\hat{x} = U^\\top x, \\qquad x = U \\hat{x}$$</div>

<p class="l-text">Bir <strong>spektral filtre</strong> $g(\\lambda)$, $g(L) x = U \\, g(\\Lambda) \\, U^\\top x$ olarak hareket eder. <strong>ChebNet</strong> (Defferrard vd. 2016), $O(N^3)$ özayrıştırmadan kaçınmak için $g$'yi $L$'de Chebyshev polinomlarıyla yaklaşık hesaplar. <strong>GCN</strong> (sonraki ders) 1. dereceden Chebyshev yaklaşımıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir yol grafında Laplacian'ın öz çiftlerini hesaplayın; özvektörler ayrık sinüsler gibi görünmeli.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">path_graph</span>(<span class="num">10</span>)             <span class="cm"># P_10: zincirde 10 düğüm</span>
A = nx.<span class="fn">to_numpy_array</span>(G)
D = np.<span class="fn">diag</span>(A.<span class="fn">sum</span>(axis=<span class="num">1</span>))
L = D - A                          <span class="cm"># normalize edilmemiş Laplacian</span>

w, U = np.linalg.<span class="fn">eigh</span>(L)           <span class="cm"># tam özayrıştırma (küçük graf için tamam)</span>
<span class="fn">print</span>(<span class="str">"Özdeğerler (düşükten yükseğe):"</span>, np.<span class="fn">round</span>(w, <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"\\nİlk özvektör (sabit, 'DC'):"</span>, np.<span class="fn">round</span>(U[:, <span class="num">0</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"İkinci özvektör (en pürüzsüz aşikar olmayan):"</span>, np.<span class="fn">round</span>(U[:, <span class="num">1</span>], <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Son özvektör (en yüksek frekans):"</span>, np.<span class="fn">round</span>(U[:, -<span class="num">1</span>], <span class="num">3</span>))

<span class="cm"># İkinci dereceden form kontrolü: u_k^T L u_k = lambda_k</span>
<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>, <span class="num">5</span>, <span class="num">9</span>]:
    <span class="fn">print</span>(f<span class="str">"u_{k}^T L u_{k} = {U[:,k] @ L @ U[:,k]:.4f}  (lambda_{k} = {w[k]:.4f}'e eşit olmalı)"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Spektral Kümeleme</h2>
<p class="l-text"><strong>Spektral kümeleme</strong> (Shi-Malik 2000, Ng-Jordan-Weiss 2002), Laplacian'ın ders kitabı uygulamasıdır. Tarif:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1</div><div class="card-body">Simetrik normalize edilmiş Laplacian $L_{\\mathrm{sym}}$'yi oluşturun.</div></div>
<div class="calc-card"><div class="card-title">Adım 2</div><div class="card-body">En küçük $k$ özvektörü hesaplayın (en küçük özdeğerler). Bunları sütunlar olarak $U_k \\in \\mathbb{R}^{N \\times k}$ içine yığın.</div></div>
<div class="calc-card"><div class="card-title">Adım 3</div><div class="card-body">$U_k$'nin her satırını düğüm $i$'nin $k$-boyutlu gömme vektörü olarak ele alın. $k$ kümeli KMeans çalıştırın.</div></div>
</div>

<p class="l-text">İşe yarar çünkü $L_{\\mathrm{sym}}$'nin en küçük özvektörleri grafın en kaba kesimlerini — doğal toplulukları — kodlar. Cheeger eşitsizliği bunu formalize eder: küçük özdeğer ⇔ seyrek bir kesimin varlığı.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">İki yerleşik topluluk olan bir grafta (stokastik blok modeli) spektral kümeleme. scipy seyrek özçözücüyü kullanın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx
<span class="kw">from</span> scipy.sparse <span class="kw">import</span> csr_matrix
<span class="kw">from</span> scipy.sparse.linalg <span class="kw">import</span> eigsh
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans

<span class="cm"># Stokastik blok modeli: her biri 30 düğümlü 2 topluluk, içeride yoğun, dışarıda seyrek</span>
sizes = [<span class="num">30</span>, <span class="num">30</span>]
p_in, p_out = <span class="num">0.30</span>, <span class="num">0.03</span>
G = nx.<span class="fn">stochastic_block_model</span>(sizes, [[p_in, p_out],[p_out, p_in]], seed=<span class="num">1</span>)
truth = np.<span class="fn">array</span>([G.nodes[n][<span class="str">"block"</span>] <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])

A = nx.<span class="fn">to_scipy_sparse_array</span>(G, format=<span class="str">"csr"</span>).<span class="fn">astype</span>(<span class="fn">float</span>)
deg = np.<span class="fn">asarray</span>(A.<span class="fn">sum</span>(axis=<span class="num">1</span>)).<span class="fn">flatten</span>()
D_inv_sqrt = <span class="fn">csr_matrix</span>(np.<span class="fn">diag</span>(<span class="num">1.0</span> / np.<span class="fn">sqrt</span>(deg + <span class="num">1e-12</span>)))
L_sym = <span class="fn">csr_matrix</span>(np.<span class="fn">eye</span>(A.shape[<span class="num">0</span>])) - D_inv_sqrt @ A @ D_inv_sqrt

<span class="cm"># L_sym'nin en küçük 2 özvektörü</span>
w, U = <span class="fn">eigsh</span>(L_sym, k=<span class="num">2</span>, which=<span class="str">"SM"</span>)
<span class="fn">print</span>(<span class="str">"En küçük özdeğerler:"</span>, np.<span class="fn">round</span>(w, <span class="num">4</span>))

km = <span class="fn">KMeans</span>(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(U)
acc = <span class="fn">max</span>((km.labels_ == truth).<span class="fn">mean</span>(), (km.labels_ != truth).<span class="fn">mean</span>())
<span class="fn">print</span>(f<span class="str">"Gerçek değere karşı spektral kümeleme doğruluğu: {acc:.3f}"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Difüzyon: Yinelenmiş Ortalama</h2>
<p class="l-text">Bir <strong>graf difüzyonu</strong> adımı, bir sinyal $x$'i alır ve her düğümün değerini komşularının ağırlıklı ortalaması ile değiştirir. En basit durum ortalama-toplamadır: $x \\leftarrow D^{-1}A\\,x$. Birçok adımdan sonra, her düğümün değeri küresel bir ortalamaya yakınsar — graf "düzleşir". Bu tam olarak ısı denklemi $\\partial_t x = -L x$'nin ayrık zamandaki halidir.</p>

<div class="katex-block">$$x_{t+1} = (I - \\tau L) \\, x_t \\;\\;\\Longleftrightarrow\\;\\; x_t = e^{-tL} \\, x_0 = U \\, e^{-t\\Lambda} \\, U^\\top \\, x_0$$</div>

<p class="l-text">Fourier uzayında difüzyon, $k$. frekansı $e^{-t\\lambda_k}$ ile çarpar — yüksek frekanslar düşük olanlardan çok daha hızlı azalır. <em>Difüzyon bir alçak geçiren filtredir</em>. Bu yüzden bir GCN özellikleri düzleştirir: graf üzerinde ayrıklaştırılmış bir ısı denklemidir, katman başına bir matris çarpımı ile.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir delta sinyalinin difüze olmasını izleyin: bir düğümde 1 değeriyle başlayın, zaman içinde komşularla ortalama alın, ısının yayıldığını görün.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

G = nx.<span class="fn">path_graph</span>(<span class="num">10</span>)
A = nx.<span class="fn">to_numpy_array</span>(G)
D_inv = np.<span class="fn">diag</span>(<span class="num">1.0</span> / A.<span class="fn">sum</span>(axis=<span class="num">1</span>))
P = D_inv @ A   <span class="cm"># satır-stokastik geçiş matrisi</span>

<span class="cm"># Başlangıç ısısı: en soldaki düğümde 1.0, diğer yerlerde 0</span>
x = np.<span class="fn">zeros</span>(<span class="num">10</span>); x[<span class="num">0</span>] = <span class="num">1.0</span>
<span class="fn">print</span>(f<span class="str">"t=0: {np.round(x, 3)}"</span>)

<span class="kw">for</span> t <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>, <span class="num">20</span>, <span class="num">100</span>]:
    xt = np.linalg.<span class="fn">matrix_power</span>(P, t) @ x
    <span class="fn">print</span>(f<span class="str">"t={t:3d}: {np.round(xt, 3)}  (toplam={xt.sum():.3f})"</span>)
</code></pre></div>
</div>

<p class="l-text">Yeterli adımdan sonra dağılım tekdüze olur — her düğüm aynı değere sahiptir. <strong>Bu ağır çekimde aşırı düzleşmedir</strong>: çok fazla GCN katmanı yığın ve düğüm özelliklerinize de aynı şey olur.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Spektral Filtreden GCN'e — Yarım Sayfa Türetme</h2>
<p class="l-text">Defferrard vd.'nin ChebNet'i bir spektral filtreyi yeniden ölçeklenmiş Laplacian'da $K$. dereceden bir Chebyshev polinomu olarak tanımlar. Kipf &amp; Welling'in GCN'i $K{=}1$ alır ve bir yeniden normalleştirme hilesi ekler. Tüm zincir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spektral filtre</div><div class="card-body">$g_\\theta(L) x = U \\, g_\\theta(\\Lambda) \\, U^\\top x$. Maliyetli: tam özayrıştırmaya ihtiyaç duyar.</div></div>
<div class="calc-card"><div class="card-title">Chebyshev yaklaşımı</div><div class="card-body">$g_\\theta(L) \\approx \\sum_{k=0}^{K} \\theta_k T_k(\\tilde{L})$ burada $T_k$ Chebyshev polinomlarıdır. Özayrıştırma yok; $K$ alıcı alanı kontrol eder.</div></div>
<div class="calc-card"><div class="card-title">Birinci derece, tek parametre</div><div class="card-body">$K{=}1$ ayarlayın, parametreleri paylaşın: $g_\\theta x \\approx \\theta(I + D^{-1/2}AD^{-1/2})\\,x$.</div></div>
<div class="calc-card"><div class="card-title">Yeniden normalleştirme hilesi</div><div class="card-body">$I+A$'yı $\\tilde{A} = A+I$ (öz-döngüler) ile değiştirin ve yeniden normalleştirin: $\\hat{A} = \\tilde{D}^{-1/2}\\tilde{A}\\tilde{D}^{-1/2}$. Özdeğerler $[0,2]$'de kalır, patlayan gradyanlar yok.</div></div>
</div>

<div class="katex-block">$$\\boxed{\\;H^{(l+1)} = \\sigma\\!\\left(\\tilde{D}^{-1/2}\\,\\tilde{A}\\,\\tilde{D}^{-1/2}\\,H^{(l)}\\,W^{(l)}\\right)\\;}$$</div>

<p class="l-text">İşte GCN budur. Sonraki ders bunu NumPy'da uygulayacak. Buradaki çıkarım: <em>GCN, öğrenilmiş bir doğrusal projeksiyonla tek-adım spektral difüzyondur</em>. Geri kalan her şey mühendisliktir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Aşırı Düzleşme — Daha Fazla Katmanın Zarar Vermesi</h2>
<p class="l-text">GCN katmanlarını yığmak, çok adımlı difüzyona eşdeğerdir. Ortalama-toplamanın sabit noktası sabit sinyaldir — her düğüm aynı temsile sahiptir. Bu <strong>aşırı düzleşmedir</strong> (Li vd. 2018, Oono &amp; Suzuki 2020). Cora'da doğruluk 2 katmanda zirve yapar ve 4'ün ötesinde düşer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Teşhis</div><div class="card-body">Düğüm gömme vektörlerinin ikili kosinüs benzerliğini ölçün. Katmanlar arttıkça benzerlik → 1 (her şey çöker).</div></div>
<div class="calc-card"><div class="card-title">Düzeltme 1 — Artıklar (GCNII)</div><div class="card-body">$H^{(l+1)} = ((1-\\alpha)\\,\\hat{A}H^{(l)} + \\alpha H^{(0)})\\,((1-\\beta)I + \\beta W)$. Her katmanda girdiyi enjekte edin, kimlikle harmanlayın.</div></div>
<div class="calc-card"><div class="card-title">Düzeltme 2 — Ayrıştırma (APPNP)</div><div class="card-body">Tek bir MLP uygulayın, sonra kişiselleştirilmiş PageRank ile yayın: $H = (1-\\alpha)\\hat{A}H + \\alpha H_0$ for $K$ adım. Katman-başına ağırlık yok.</div></div>
<div class="calc-card"><div class="card-title">Düzeltme 3 — Atlama katmanları (JKNet)</div><div class="card-body">Tüm katmanlardan temsilleri son gömme vektörü olarak birleştirin / havuzlayın.</div></div>
</div>

<div class="calc-highlight"><strong>Pratik kural:</strong> varsayılan olarak 2 katman. Daha fazla "derinlik" gerekiyorsa (uzun menzilli bağımlılıklar), daha fazla GCN katmanı yığmak yerine APPNP-tarzı ayrıştırma kullanın.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Heterofili: Düzleştirmenin Yanlış Olduğu Zaman</h2>
<p class="l-text">GCN'in homofili varsayımı — "komşular etiketleri paylaşır" — protein-protein etkileşimi (farklı işlevler etkileşir) veya Squirrel/Chameleon Wikipedia ağları gibi graflarda başarısız olur. Düzleştirme sinyali yok eder. Heterofili-farkındalı GNN'ler (H2GCN, GPRGNN, FAGCN), ayrı öz vs. komşu kanallarını korur veya işaretli kenar ağırlıklarını öğrenir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğer (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hızlı homofili skoru: aynı etiketli düğümleri bağlayan kenarların oranı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> networkx <span class="kw">as</span> nx

<span class="cm"># İki topluluk, çoğunlukla içeride kenarlar</span>
G = nx.<span class="fn">stochastic_block_model</span>([<span class="num">20</span>,<span class="num">20</span>], [[<span class="num">0.4</span>, <span class="num">0.05</span>],[<span class="num">0.05</span>, <span class="num">0.4</span>]], seed=<span class="num">2</span>)
labels = np.<span class="fn">array</span>([G.nodes[n][<span class="str">"block"</span>] <span class="kw">for</span> n <span class="kw">in</span> G.<span class="fn">nodes</span>()])

same = <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> u,v <span class="kw">in</span> G.<span class="fn">edges</span>() <span class="kw">if</span> labels[u] == labels[v])
homophily = same / G.<span class="fn">number_of_edges</span>()
<span class="fn">print</span>(f<span class="str">"Homofili: {homophily:.3f}  (>0.5 GCN-dostu demektir)"</span>)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradakiler</h2>
<p class="l-text">Spektral graf teorisi, ayrık bir nesneyi (bir grafı) sürekli bir nesneye (özdeğerler, pürüzsüz fonksiyonlar) dönüştürür. Laplacian köprüdür. GCN, graf spektrumunda tek-adımlı bir alçak geçiren filtredir. Bu tür çok fazla filtreyi yığmak sinyali yok eder — modern GNN'lerin mühendisliği büyük ölçüde buna karşı koymakla ilgilidir.</p>

<div class="calc-highlight"><strong>Anahtar noktalar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Üç Laplacian: normalize edilmemiş $L = D-A$, simetrik $L_{\\mathrm{sym}}$, rastgele yürüyüş $L_{\\mathrm{rw}}$.</li>
<li>$L$'nin özvektörleri graf Fourier tabanını oluşturur (pürüzsüz → salınımlı).</li>
<li>Spektral kümeleme: en küçük $k$ özvektör + KMeans toplulukları kurtarır.</li>
<li>Difüzyon = ısı denklemi = tekrarlanan ortalama = alçak geçiren filtre.</li>
<li>GCN = yeniden normalleştirilmiş komşulukla birinci dereceden Chebyshev yaklaşımı.</li>
<li>Aşırı düzleşme derinliği sınırlar; APPNP / GCNII / JKNet düzeltmelerdir.</li>
</ul>
</div>

<p class="l-text"><strong>gnn-L4</strong>'te matematiği iş başına alıyoruz: Kipf-Welling'i adım adım türetip 5 düğümlü oyuncak bir grafta saf NumPy'da 2-katmanlı GCN ileri geçişini uyguluyoruz, gradyan inişi ile düğümleri sınıflandırmak için eğitiyoruz (PyTorch gerekmez).</p>
</div>`
};
