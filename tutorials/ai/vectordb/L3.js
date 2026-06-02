window.VECTORDB_L3 = {
en: `<p class="l-text"><strong>Approximate nearest-neighbor search is one of the most beautiful corners of applied algorithms.</strong> The same problem — "find me the closest vector" — is solved by graph walks (HNSW), space partitioning (IVF), code-book compression (PQ), bit-twiddling (scalar quantization), random projections (LSH, Annoy), and SSD-resident graphs (DiskANN). Each algorithm picks a different tradeoff on the recall × latency × memory simplex, and the right choice depends entirely on your operating point.</p>

<p class="l-text">In this lesson we open the hood on the three algorithms that dominate production today: <strong>HNSW</strong> (hierarchical navigable small-world graphs), <strong>IVF</strong> (inverted-file with k-means partitioning), and <strong>PQ</strong> (product quantization), with a short detour into scalar quantization. We end with a recall-latency Pareto plot and a decision flowchart so that the next time someone says "we need a vector DB," you can name the right algorithm in 30 seconds.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain the small-world property and why HNSW achieves O(log N) search</li>
<li>Walk through HNSW insertion: assign layer, greedy search down, connect with M neighbors</li>
<li>Implement a toy IVF index with sklearn KMeans and tune <code>nprobe</code> against recall</li>
<li>Compute product-quantization codebooks and asymmetric distances by hand</li>
<li>Compare scalar quantization (int8) vs PQ on the storage / recall axis</li>
<li>Read a recall-latency Pareto curve and pick HNSW vs IVF-PQ vs DiskANN for your scale</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The ANN Design Space</h2>
<p class="l-text">Any ANN index is making one of three structural choices:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Partition the space</div><div class="card-body">IVF, LSH, KD-Tree. Carve R^d into cells and only search cells near the query.</div></div>
<div class="calc-card"><div class="card-title">Build a graph</div><div class="card-body">HNSW, NSG, Vamana (DiskANN). Each vector links to its closest neighbors. Search = greedy walk.</div></div>
<div class="calc-card"><div class="card-title">Compress the vectors</div><div class="card-body">PQ, OPQ, scalar quantization. Trade exact distances for 8-32x smaller storage and faster scans.</div></div>
<div class="calc-card"><div class="card-title">Combine all three</div><div class="card-body">Production indexes layer them: <code>OPQ → IVF → PQ</code> or <code>HNSW + scalar quantization</code>.</div></div>
</div>

<div class="calc-highlight">No algorithm dominates everywhere. HNSW wins on recall-per-QPS for in-memory workloads. IVF-PQ wins on recall-per-byte. DiskANN wins when you need 1B+ vectors on a single SSD-equipped node.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. HNSW Theory — Small-World Graphs</h2>
<p class="l-text">A <em>small-world graph</em> is one where any two nodes are connected by a short path (logarithmic in N) even though each node has only a handful of neighbors. Social networks have this property — "six degrees of separation." HNSW (Malkov &amp; Yashunin, 2018) deliberately constructs such a graph over your vectors, then layers them in a hierarchy so that the upper layers act as long-range "highways."</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Layer 0 (bottom)</div><div class="card-body">Contains <strong>all</strong> N vectors. Each connects to up to <code>M</code> nearest neighbors.</div></div>
<div class="calc-card"><div class="card-title">Higher layers</div><div class="card-body">Each layer keeps a <em>random sample</em> with probability <code>1 / mult</code>. Sparse, long-range.</div></div>
<div class="calc-card"><div class="card-title">Search</div><div class="card-body">Start at top entry point. Greedy walk to nearest. Drop to next layer. Repeat. <strong>O(log N)</strong>.</div></div>
<div class="calc-card"><div class="card-title">Insert</div><div class="card-body">Sample a layer L from geometric distribution. Search down to L. Connect to M neighbors per layer.</div></div>
</div>

<div class="katex-block">$$P(\\text{node at layer } \\geq \\ell) = \\left(\\frac{1}{m_L}\\right)^{\\ell}, \\quad m_L = \\frac{1}{\\ln M}$$</div>

<p class="l-text">The geometric distribution makes upper layers exponentially smaller. With M=16 and N=10M, you typically get ~6 layers. The greedy walk visits O(log N) nodes per layer → ~O(log N) total distance computations.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. HNSW Toy Implementation</h2>
<p class="l-text">Let us build a minimal flat HNSW (single layer) on review embeddings to see the greedy walk in action. The full hierarchical version is the same idea repeated across layers.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> heapq

X = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">400</span>, stop_words=<span class="str">'english'</span>).<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>()
X = <span class="fn">normalize</span>(X).<span class="fn">astype</span>(<span class="str">'float32'</span>)
N = <span class="fn">len</span>(X)

<span class="cm"># 1. BUILD a flat proximity graph: each node -> M nearest neighbors</span>
M = <span class="num">8</span>
nn = <span class="fn">NearestNeighbors</span>(n_neighbors=M+<span class="num">1</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(X)
_, neighbors = nn.<span class="fn">kneighbors</span>(X)
graph = {i: neighbors[i, <span class="num">1</span>:].<span class="fn">tolist</span>() <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N)}   <span class="cm"># skip self</span>

<span class="cm"># 2. GREEDY SEARCH on the graph</span>
<span class="kw">def</span> <span class="fn">hnsw_search</span>(q, ef=<span class="num">20</span>, entry=<span class="num">0</span>):
    visited = {entry}
    candidates = [(-(X[entry] @ q), entry)]      <span class="cm"># max-heap on similarity</span>
    results    = [( (X[entry] @ q), entry)]      <span class="cm"># min-heap of best</span>
    <span class="kw">while</span> candidates:
        sim, node = heapq.<span class="fn">heappop</span>(candidates); sim = -sim
        worst = results[<span class="num">0</span>][<span class="num">0</span>]
        <span class="kw">if</span> sim &lt; worst <span class="kw">and</span> <span class="fn">len</span>(results) &gt;= ef:
            <span class="kw">break</span>
        <span class="kw">for</span> nb <span class="kw">in</span> graph[node]:
            <span class="kw">if</span> nb <span class="kw">in</span> visited: <span class="kw">continue</span>
            visited.<span class="fn">add</span>(nb)
            s = <span class="fn">float</span>(X[nb] @ q)
            heapq.<span class="fn">heappush</span>(candidates, (-s, nb))
            <span class="kw">if</span> <span class="fn">len</span>(results) &lt; ef:
                heapq.<span class="fn">heappush</span>(results, (s, nb))
            <span class="kw">elif</span> s &gt; results[<span class="num">0</span>][<span class="num">0</span>]:
                heapq.<span class="fn">heapreplace</span>(results, (s, nb))
    <span class="kw">return</span> <span class="fn">sorted</span>(results, key=<span class="kw">lambda</span> r: -r[<span class="num">0</span>])

q = X[<span class="num">42</span>]
top = <span class="fn">hnsw_search</span>(q, ef=<span class="num">15</span>)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"HNSW top-5 (id, sim):"</span>)
<span class="kw">for</span> sim, i <span class="kw">in</span> top: <span class="fn">print</span>(f<span class="str">"  {i:3d}  {sim:.3f}  {df_reviews['text'].iloc[i][:60]}"</span>)

<span class="cm"># Compare to ground truth</span>
exact = np.<span class="fn">argsort</span>(-(X @ q))[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"Exact top-5 ids:"</span>, exact.<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">"recall@5:"</span>, <span class="fn">len</span>(<span class="fn">set</span>([i <span class="kw">for</span> _,i <span class="kw">in</span> top]) &amp; <span class="fn">set</span>(exact.<span class="fn">tolist</span>())) / <span class="num">5</span>)
</code></pre></div>

<p class="l-text">The <code>ef</code> parameter is the same <code>efSearch</code> you saw in FAISS Lesson 2. Larger <code>ef</code> = larger candidate set = higher recall but more distance computations.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. IVF — k-Means Partitioning</h2>
<p class="l-text">IVF takes the opposite approach to HNSW: instead of a graph, partition the space into <code>nlist</code> cells via k-means. At query time, find the <code>nprobe</code> cells nearest to the query and brute-force inside them. Simple, very memory-efficient, and the foundation of most billion-scale systems.</p>

<div class="katex-block">$$\\text{vectors scanned} \\approx N \\cdot \\frac{nprobe}{nlist}, \\qquad \\text{recall} \\propto nprobe$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np

X = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">400</span>, stop_words=<span class="str">'english'</span>).<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>()
X = <span class="fn">normalize</span>(X).<span class="fn">astype</span>(<span class="str">'float32'</span>)

nlist = <span class="num">12</span>
km = <span class="fn">KMeans</span>(n_clusters=nlist, n_init=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X)
posting = {c: np.<span class="fn">where</span>(km.labels_ == c)[<span class="num">0</span>] <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(nlist)}

<span class="kw">def</span> <span class="fn">ivf_search</span>(q, nprobe=<span class="num">3</span>, k=<span class="num">5</span>):
    cell_sims = km.cluster_centers_ @ q
    cells = np.<span class="fn">argsort</span>(-cell_sims)[:nprobe]
    cands = np.<span class="fn">concatenate</span>([posting[c] <span class="kw">for</span> c <span class="kw">in</span> cells])
    sims = X[cands] @ q
    top = cands[np.<span class="fn">argsort</span>(-sims)[:k]]
    <span class="kw">return</span> top, <span class="fn">len</span>(cands)

q = X[<span class="num">7</span>]
exact_top5 = np.<span class="fn">argsort</span>(-(X @ q))[:<span class="num">5</span>]

<span class="kw">for</span> nprobe <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">4</span>, <span class="num">8</span>, <span class="num">12</span>]:
    top, scanned = <span class="fn">ivf_search</span>(q, nprobe=nprobe, k=<span class="num">5</span>)
    rec = <span class="fn">len</span>(<span class="fn">set</span>(top) &amp; <span class="fn">set</span>(exact_top5.<span class="fn">tolist</span>())) / <span class="num">5</span>
    <span class="fn">print</span>(f<span class="str">"nprobe={nprobe:2d}  scanned={scanned:3d}/{len(X)}  recall@5={rec:.2f}"</span>)
</code></pre></div>

<p class="l-text">Watch the recall climb as <code>nprobe</code> grows. <code>nprobe = nlist</code> is exact (you scan everything). The skill is finding the smallest <code>nprobe</code> that meets your recall SLO.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Product Quantization Mechanics</h2>
<p class="l-text">PQ is the most beautiful trick in the ANN toolbox. Split each d-dim vector into M sub-vectors. Run k-means independently in each subspace with <code>k=256</code> centroids → 8 bits per sub-code. A vector is now M bytes. Distance from a (full-precision) query to a PQ-coded database vector is computed via <em>asymmetric distance</em>: precompute distance from query to all 256 centroids in each subspace into an M × 256 lookup table, then sum M lookups per database vector.</p>

<div class="katex-block">$$d_{\\text{ADC}}(\\mathbf{q}, \\hat{\\mathbf{x}})^2 = \\sum_{m=1}^{M} d\\!\\left(\\mathbf{q}^{(m)},\\, \\mathbf{c}^{(m)}_{\\text{code}_m(\\mathbf{x})}\\right)^2$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">M = 8, d = 64</div><div class="card-body">8 sub-vectors of dim 8. 8 bytes per vector. 256 KB for 32k vectors. Aggressive compression.</div></div>
<div class="calc-card"><div class="card-title">M = 32, d = 768</div><div class="card-body">Standard for sentence embeddings. 32 bytes per vector → 32 GB for 1B vectors.</div></div>
<div class="calc-card"><div class="card-title">OPQ rotation</div><div class="card-body">Optimized PQ first applies a learned rotation so subspaces have equal variance. ~10% recall boost.</div></div>
<div class="calc-card"><div class="card-title">Reranking</div><div class="card-body">Always over-fetch (e.g. top-100 with PQ) then rerank top-100 with full-precision distances. Recovers most of the precision loss.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
N, d, M, K = <span class="num">4000</span>, <span class="num">64</span>, <span class="num">8</span>, <span class="num">256</span>
sub_d = d // M
X = np.random.<span class="fn">randn</span>(N, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

<span class="cm"># 1. Learn codebooks</span>
codebooks, codes = [], np.<span class="fn">zeros</span>((N, M), dtype=np.uint8)
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(M):
    sub = X[:, m*sub_d:(m+<span class="num">1</span>)*sub_d]
    km = <span class="fn">KMeans</span>(n_clusters=K, n_init=<span class="num">1</span>, random_state=m).<span class="fn">fit</span>(sub)
    codebooks.<span class="fn">append</span>(km.cluster_centers_.<span class="fn">astype</span>(<span class="str">'float32'</span>))
    codes[:, m] = km.labels_

<span class="cm"># 2. ADC search</span>
q = X[<span class="num">0</span>]
lut = np.<span class="fn">empty</span>((M, K), dtype=<span class="str">'float32'</span>)
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(M):
    diff = codebooks[m] - q[m*sub_d:(m+<span class="num">1</span>)*sub_d]
    lut[m] = np.<span class="fn">einsum</span>(<span class="str">'ij,ij->i'</span>, diff, diff)

approx = lut[np.<span class="fn">arange</span>(M), codes].<span class="fn">sum</span>(axis=<span class="num">1</span>)        <span class="cm"># N additions per query</span>
exact  = ((X - q) ** <span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>)

<span class="fn">print</span>(f<span class="str">"PQ size:    {codes.nbytes:>9,} B  ({codes.nbytes/X.nbytes*100:.1f}% of fp32)"</span>)
<span class="fn">print</span>(f<span class="str">"recall@10:  {len(set(np.argsort(approx)[:10]) &amp; set(np.argsort(exact)[:10]))/10:.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>PQ build + ADC search, step by step:</strong> 1) For each of the <code>M=8</code> subspaces, slice the 64-d vector into 8-d chunks and fit <code>KMeans(n_clusters=256)</code>; that gives <code>codebooks[m]</code> with 256 centroids and packs the nearest-centroid ID into <code>codes[:,m]</code> as a single byte. 2) <code>codes</code> stores N×8 uint8s — the print compares its size to the original fp32 footprint. 3) For query <code>q</code>, the inner loop builds <code>lut[m,k] = ||q_m − c_{m,k}||²</code> — the asymmetric distance lookup. 4) <code>lut[arange(M), codes].sum(axis=1)</code> sums M lookups per database vector to approximate the full L2 distance; we compare top-10 IDs against the exact computation to report recall.</p>
</div>


<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Scalar Quantization — The Cheap Win</h2>
<p class="l-text">Before reaching for PQ, try scalar quantization (SQ). Each fp32 dimension is mapped linearly to an int8: 4x compression, &lt;1% recall loss on most embedding distributions, almost zero implementation complexity. FAISS calls it <code>SQ8</code>; many production systems use it as the default.</p>

<div class="katex-block">$$\\hat{x}_i = \\operatorname{round}\\!\\left(255 \\cdot \\frac{x_i - \\min_i}{\\max_i - \\min_i}\\right) \\in \\{0, \\dots, 255\\}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
X = np.random.<span class="fn">randn</span>(<span class="num">2000</span>, <span class="num">128</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>)

<span class="cm"># Per-dimension min/max scale</span>
mn, mx = X.<span class="fn">min</span>(axis=<span class="num">0</span>), X.<span class="fn">max</span>(axis=<span class="num">0</span>)
scale = (mx - mn) / <span class="num">255.0</span>

X_q = np.<span class="fn">round</span>((X - mn) / scale).<span class="fn">clip</span>(<span class="num">0</span>, <span class="num">255</span>).<span class="fn">astype</span>(np.uint8)
X_dq = X_q.<span class="fn">astype</span>(<span class="str">'float32'</span>) * scale + mn          <span class="cm"># dequantize for distance</span>

q = X[<span class="num">5</span>]
exact = np.<span class="fn">argsort</span>(((X - q)**<span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>))[:<span class="num">10</span>]
sq    = np.<span class="fn">argsort</span>(((X_dq - q)**<span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>))[:<span class="num">10</span>]

<span class="fn">print</span>(f<span class="str">"original bytes: {X.nbytes:>9,}"</span>)
<span class="fn">print</span>(f<span class="str">"int8 bytes:     {X_q.nbytes:>9,}  ({X.nbytes // X_q.nbytes}x smaller)"</span>)
<span class="fn">print</span>(f<span class="str">"recall@10:      {len(set(exact) &amp; set(sq))/10:.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>SQ8 round-trip, step by step:</strong> 1) <code>mn, mx = X.min(axis=0), X.max(axis=0)</code> learns one per-dimension scale. 2) <code>X_q = round((X − mn) / scale).clip(0, 255).astype(uint8)</code> maps every fp32 dimension into an 8-bit integer — 4× compression. 3) <code>X_dq = X_q.astype(float32) * scale + mn</code> dequantises just enough for distance computation. 4) We compare top-10 neighbours from <code>X</code> (exact) vs <code>X_dq</code> (SQ8) for query <code>X[5]</code>; the final print reports the byte ratio and recall — typically &gt;0.99 on real embeddings.</p>


<div class="calc-highlight">SQ8 is the lowest-risk compression in the ANN toolbox: 4x smaller, almost free recall. PQ buys you another 8x on top, at the cost of trickier training and recall tuning.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Recall-Latency Pareto Curve</h2>
<p class="l-text">Below is a stylized plot of the four main algorithms on a 10M x 768-d benchmark. Every algorithm has a <em>family</em> of operating points (controlled by <code>nprobe</code>, <code>efSearch</code>, etc); the curve is the upper envelope of those points. The "best" algorithm is the one whose curve passes through your required (recall, QPS) point.</p>

<div id="vdb-l3-pareto" class="plotly-graph"></div>
<script>setTimeout(function(){if(window.Plotly){Plotly.newPlot('vdb-l3-pareto',[{x:[40,150,600,2400,9000,30000],y:[0.55,0.72,0.86,0.94,0.985,0.999],mode:'lines+markers',line:{color:'#7cc',width:3},marker:{size:9},name:'HNSW (in-mem)'},{x:[80,400,1800,7000,25000,80000],y:[0.50,0.68,0.83,0.92,0.97,0.992],mode:'lines+markers',line:{color:'#c8a96e',width:3},marker:{size:9},name:'IVF-PQ'},{x:[20,80,300,1100,4000,15000],y:[0.42,0.61,0.78,0.89,0.955,0.99],mode:'lines+markers',line:{color:'#a78bfa',width:3},marker:{size:9},name:'DiskANN (SSD)'},{x:[15,55,200,800,3000,11000],y:[0.35,0.52,0.70,0.83,0.92,0.975],mode:'lines+markers',line:{color:'#f472b6',width:3},marker:{size:9},name:'LSH / Annoy'}],{paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ddd',size:14},xaxis:{title:'QPS (log)',type:'log',gridcolor:'rgba(255,255,255,0.08)'},yaxis:{title:'recall@10',gridcolor:'rgba(255,255,255,0.08)',range:[0.3,1.01]},margin:{l:60,r:30,t:30,b:50},legend:{x:0.02,y:0.05}});}},300);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">HNSW</div><div class="card-body">Best recall/QPS in-memory. RAM-hungry: stores fp32 vectors + graph.</div></div>
<div class="calc-card"><div class="card-title">IVF-PQ</div><div class="card-body">Best recall per <em>byte</em>. Fits 1B vectors in 32 GB. Slightly lower QPS at fixed recall.</div></div>
<div class="calc-card"><div class="card-title">DiskANN (Vamana)</div><div class="card-body">SSD-resident graph. Microsoft, 2019. Billion-scale on a single node, ~10 ms p99.</div></div>
<div class="calc-card"><div class="card-title">LSH / Annoy</div><div class="card-body">Older. Annoy = random projection trees (Spotify). Simple, but dominated above ~5M.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Decision Flowchart</h2>
<p class="l-text">A practical algorithm chooser. Walk top to bottom; first match wins.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">N &lt; 100k</div><div class="card-body">→ <strong>Brute force</strong> (numpy or sklearn). One matmul. Don't over-engineer.</div></div>
<div class="calc-card"><div class="card-title">N &lt; 10M, RAM ample</div><div class="card-body">→ <strong>HNSW32,Flat</strong>. Highest QPS, simplest tuning. Memory ~6 GB for 10M x 768d.</div></div>
<div class="calc-card"><div class="card-title">N &lt; 10M, RAM tight</div><div class="card-body">→ <strong>HNSW + SQ8</strong> or <strong>IVF1024,PQ32</strong>. 4-32x compression with mild recall hit.</div></div>
<div class="calc-card"><div class="card-title">10M - 1B, single node</div><div class="card-body">→ <strong>OPQ16_64,IVF8192,PQ32</strong> (FAISS) or <strong>DiskANN</strong> for SSD-resident.</div></div>
<div class="calc-card"><div class="card-title">1B+, multi-node</div><div class="card-body">→ <strong>Milvus / Vespa / Vald</strong> (sharded HNSW or IVF-PQ) or <strong>Pinecone / Turbopuffer</strong> (managed).</div></div>
<div class="calc-card"><div class="card-title">Filter-heavy queries</div><div class="card-body">→ <strong>Qdrant / Weaviate</strong>. Pre-filter on payload, then ANN within filtered set. Avoid post-filter recall loss.</div></div>
</div>

<div class="calc-highlight">For a typical NLP/RAG project (~100k - 10M chunks): start with HNSW in FAISS or Qdrant. You will not outgrow it on a side project. When you do, you will know exactly which knob to turn.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; Track Recap</h2>
<p class="l-text">You now have a working mental model of the three algorithms behind almost every production vector database. <strong>HNSW</strong> is a hierarchical small-world graph that walks O(log N) hops from entry point to nearest neighbor. <strong>IVF</strong> partitions the space with k-means and scans only the nearest <code>nprobe</code> cells. <strong>PQ</strong> compresses vectors into M-byte codes and computes asymmetric distances via lookup tables. Real systems combine them — <code>OPQ → IVF → PQ</code> is the canonical billion-scale recipe.</p>

<p class="l-text">Across this 3-lesson track you have moved from <em>why</em> vector DBs exist (semantic search reduces to nearest-neighbor lookup that B-trees cannot answer), through <em>what</em> the FAISS API offers (Flat, IVF, PQ, HNSW + the factory mini-language), to <em>how</em> the algorithms work under the hood (small-world graphs, k-means partitioning, product quantization, scalar quantization). The next step is to pick a managed vector DB (Qdrant is a great free starting point) and integrate it into a RAG pipeline — which is exactly where the LangChain track L4 picks up.</p>
</div>`,
tr: `<p class="l-text"><strong>Yaklaşık en yakın komşu araması, uygulamalı algoritmaların en güzel köşelerinden biridir.</strong> Aynı problem — "bana en yakın vektörü bul" — graf yürüyüşleriyle (HNSW), uzay bölümlemesiyle (IVF), codebook sıkıştırmasıyla (PQ), bit-oynatmayla (skaler nicemleme), rastgele projeksiyonlarla (LSH, Annoy) ve SSD-yerleşik graflarla (DiskANN) çözülür. Her algoritma recall × gecikme × bellek simpleksinde farklı bir takas seçer ve doğru tercih tamamen çalışma noktana bağlıdır.</p>

<p class="l-text">Bu derste bugün üretime hâkim üç algoritmanın kapağını açıyoruz: <strong>HNSW</strong> (hiyerarşik gezilebilir küçük-dünya grafları), <strong>IVF</strong> (k-means bölümleme ile ters dosya) ve <strong>PQ</strong> (product quantization), skaler nicemlemeye kısa bir sapmayla. Bir recall-gecikme Pareto grafiğiyle ve bir karar akış şemasıyla bitiriyoruz, böylece bir dahaki sefere biri "vektör veritabanına ihtiyacımız var" dediğinde 30 saniyede doğru algoritmayı söyleyebilirsin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Küçük-dünya özelliğini ve HNSW'nin neden O(log N) arama elde ettiğini açıklamak</li>
<li>HNSW eklemesini adım adım yürümek: katman ata, aşağı açgözlü ara, M komşuyla bağla</li>
<li>sklearn KMeans ile oyuncak bir IVF indeksi uygulamak ve recall'a karşı <code>nprobe</code>'u ayarlamak</li>
<li>Product-quantization codebook'larını ve asimetrik mesafeleri elle hesaplamak</li>
<li>Skaler nicemleme (int8) ile PQ'yu depolama / recall ekseninde karşılaştırmak</li>
<li>Bir recall-gecikme Pareto eğrisini okumak ve ölçeğin için HNSW vs IVF-PQ vs DiskANN seçmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ANN Tasarım Uzayı</h2>
<p class="l-text">Herhangi bir ANN indeksi üç yapısal seçimden birini yapıyor:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uzayı bölümle</div><div class="card-body">IVF, LSH, KD-Tree. R^d'yi hücrelere böl ve sadece sorguya yakın hücreleri ara.</div></div>
<div class="calc-card"><div class="card-title">Bir graf inşa et</div><div class="card-body">HNSW, NSG, Vamana (DiskANN). Her vektör en yakın komşularına bağlanır. Arama = açgözlü yürüyüş.</div></div>
<div class="calc-card"><div class="card-title">Vektörleri sıkıştır</div><div class="card-body">PQ, OPQ, skaler nicemleme. Kesin mesafeleri 8-32x daha küçük depolama ve daha hızlı tarama ile takas et.</div></div>
<div class="calc-card"><div class="card-title">Üçünü birleştir</div><div class="card-body">Üretim indeksleri katmanlar: <code>OPQ → IVF → PQ</code> veya <code>HNSW + skaler nicemleme</code>.</div></div>
</div>

<div class="calc-highlight">Hiçbir algoritma her yerde hâkim değildir. HNSW bellek-içi iş yükleri için QPS başına recall'da kazanır. IVF-PQ bayt başına recall'da kazanır. DiskANN tek bir SSD donanımlı sunucuda 1B+ vektöre ihtiyaç duyduğunda kazanır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. HNSW Teorisi — Küçük-Dünya Grafları</h2>
<p class="l-text">Bir <em>küçük-dünya grafı</em>, her düğümün sadece bir avuç komşusu olmasına rağmen herhangi iki düğümün kısa bir yolla (N'de logaritmik) bağlandığı graftır. Sosyal ağlar bu özelliğe sahiptir — "altı dereceli ayrılık." HNSW (Malkov &amp; Yashunin, 2018) vektörleriniz üzerinde böyle bir grafı kasıtlı olarak inşa eder, sonra üst katmanlar uzun mesafeli "otoyollar" olarak işlev görsün diye onları bir hiyerarşide katmanlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katman 0 (alt)</div><div class="card-body"><strong>Tüm</strong> N vektörü içerir. Her biri en yakın <code>M</code> komşuya kadar bağlanır.</div></div>
<div class="calc-card"><div class="card-title">Üst katmanlar</div><div class="card-body">Her katman <code>1 / mult</code> olasılıkla <em>rastgele bir örnek</em> tutar. Seyrek, uzun mesafeli.</div></div>
<div class="calc-card"><div class="card-title">Arama</div><div class="card-body">En üst giriş noktasında başla. En yakına açgözlü yürü. Sonraki katmana in. Tekrarla. <strong>O(log N)</strong>.</div></div>
<div class="calc-card"><div class="card-title">Ekle</div><div class="card-body">Geometrik dağılımdan bir L katmanı örnekle. L'ye kadar ara. Katman başına M komşuya bağla.</div></div>
</div>

<div class="katex-block">$$P(\\text{node at layer } \\geq \\ell) = \\left(\\frac{1}{m_L}\\right)^{\\ell}, \\quad m_L = \\frac{1}{\\ln M}$$</div>

<p class="l-text">Geometrik dağılım üst katmanları katlanarak küçültür. M=16 ve N=10M ile tipik olarak ~6 katman alırsın. Açgözlü yürüyüş katman başına O(log N) düğüm ziyaret eder → ~O(log N) toplam mesafe hesaplaması.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. HNSW Oyuncak Uygulaması</h2>
<p class="l-text">Açgözlü yürüyüşü iş başında görmek için yorum embedding'leri üzerinde minimal düz bir HNSW (tek katman) kuralım. Tam hiyerarşik versiyon aynı fikrin katmanlar arasında tekrarlanmasıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> heapq

X = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">400</span>, stop_words=<span class="str">'english'</span>).<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>()
X = <span class="fn">normalize</span>(X).<span class="fn">astype</span>(<span class="str">'float32'</span>)
N = <span class="fn">len</span>(X)

<span class="cm"># 1. KUR: düğüm -> M en yakın komşu düz yakınlık grafı</span>
M = <span class="num">8</span>
nn = <span class="fn">NearestNeighbors</span>(n_neighbors=M+<span class="num">1</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(X)
_, neighbors = nn.<span class="fn">kneighbors</span>(X)
graph = {i: neighbors[i, <span class="num">1</span>:].<span class="fn">tolist</span>() <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(N)}   <span class="cm"># kendini atla</span>

<span class="cm"># 2. AÇGÖZLÜ ARAMA graf üzerinde</span>
<span class="kw">def</span> <span class="fn">hnsw_search</span>(q, ef=<span class="num">20</span>, entry=<span class="num">0</span>):
    visited = {entry}
    candidates = [(-(X[entry] @ q), entry)]      <span class="cm"># benzerlikte max-heap</span>
    results    = [( (X[entry] @ q), entry)]      <span class="cm"># en iyilerden min-heap</span>
    <span class="kw">while</span> candidates:
        sim, node = heapq.<span class="fn">heappop</span>(candidates); sim = -sim
        worst = results[<span class="num">0</span>][<span class="num">0</span>]
        <span class="kw">if</span> sim &lt; worst <span class="kw">and</span> <span class="fn">len</span>(results) &gt;= ef:
            <span class="kw">break</span>
        <span class="kw">for</span> nb <span class="kw">in</span> graph[node]:
            <span class="kw">if</span> nb <span class="kw">in</span> visited: <span class="kw">continue</span>
            visited.<span class="fn">add</span>(nb)
            s = <span class="fn">float</span>(X[nb] @ q)
            heapq.<span class="fn">heappush</span>(candidates, (-s, nb))
            <span class="kw">if</span> <span class="fn">len</span>(results) &lt; ef:
                heapq.<span class="fn">heappush</span>(results, (s, nb))
            <span class="kw">elif</span> s &gt; results[<span class="num">0</span>][<span class="num">0</span>]:
                heapq.<span class="fn">heapreplace</span>(results, (s, nb))
    <span class="kw">return</span> <span class="fn">sorted</span>(results, key=<span class="kw">lambda</span> r: -r[<span class="num">0</span>])

q = X[<span class="num">42</span>]
top = <span class="fn">hnsw_search</span>(q, ef=<span class="num">15</span>)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"HNSW top-5 (id, sim):"</span>)
<span class="kw">for</span> sim, i <span class="kw">in</span> top: <span class="fn">print</span>(f<span class="str">"  {i:3d}  {sim:.3f}  {df_reviews['text'].iloc[i][:60]}"</span>)

<span class="cm"># Ground truth ile karşılaştır</span>
exact = np.<span class="fn">argsort</span>(-(X @ q))[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"Exact top-5 ids:"</span>, exact.<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">"recall@5:"</span>, <span class="fn">len</span>(<span class="fn">set</span>([i <span class="kw">for</span> _,i <span class="kw">in</span> top]) &amp; <span class="fn">set</span>(exact.<span class="fn">tolist</span>())) / <span class="num">5</span>)
</code></pre></div>

<p class="l-text"><code>ef</code> parametresi FAISS Ders 2'de gördüğün <code>efSearch</code>'ün aynısıdır. Daha büyük <code>ef</code> = daha büyük aday kümesi = daha yüksek recall ama daha çok mesafe hesaplaması.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. IVF — k-Means Bölümleme</h2>
<p class="l-text">IVF, HNSW'ye karşıt bir yaklaşım benimser: graf yerine, k-means ile uzayı <code>nlist</code> hücreye böl. Sorgu zamanında sorguya en yakın <code>nprobe</code> hücreyi bul ve içlerinde kaba kuvvetle ara. Basit, çok bellek-verimli ve çoğu milyar-ölçek sistemin temeli.</p>

<div class="katex-block">$$\\text{vectors scanned} \\approx N \\cdot \\frac{nprobe}{nlist}, \\qquad \\text{recall} \\propto nprobe$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np

X = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">400</span>, stop_words=<span class="str">'english'</span>).<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>()
X = <span class="fn">normalize</span>(X).<span class="fn">astype</span>(<span class="str">'float32'</span>)

nlist = <span class="num">12</span>
km = <span class="fn">KMeans</span>(n_clusters=nlist, n_init=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X)
posting = {c: np.<span class="fn">where</span>(km.labels_ == c)[<span class="num">0</span>] <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(nlist)}

<span class="kw">def</span> <span class="fn">ivf_search</span>(q, nprobe=<span class="num">3</span>, k=<span class="num">5</span>):
    cell_sims = km.cluster_centers_ @ q
    cells = np.<span class="fn">argsort</span>(-cell_sims)[:nprobe]
    cands = np.<span class="fn">concatenate</span>([posting[c] <span class="kw">for</span> c <span class="kw">in</span> cells])
    sims = X[cands] @ q
    top = cands[np.<span class="fn">argsort</span>(-sims)[:k]]
    <span class="kw">return</span> top, <span class="fn">len</span>(cands)

q = X[<span class="num">7</span>]
exact_top5 = np.<span class="fn">argsort</span>(-(X @ q))[:<span class="num">5</span>]

<span class="kw">for</span> nprobe <span class="kw">in</span> [<span class="num">1</span>, <span class="num">2</span>, <span class="num">4</span>, <span class="num">8</span>, <span class="num">12</span>]:
    top, scanned = <span class="fn">ivf_search</span>(q, nprobe=nprobe, k=<span class="num">5</span>)
    rec = <span class="fn">len</span>(<span class="fn">set</span>(top) &amp; <span class="fn">set</span>(exact_top5.<span class="fn">tolist</span>())) / <span class="num">5</span>
    <span class="fn">print</span>(f<span class="str">"nprobe={nprobe:2d}  scanned={scanned:3d}/{len(X)}  recall@5={rec:.2f}"</span>)
</code></pre></div>

<p class="l-text"><code>nprobe</code> büyüdükçe recall'un tırmanışını izle. <code>nprobe = nlist</code> kesindir (her şeyi tararsın). Beceri, recall SLO'nu karşılayan en küçük <code>nprobe</code>'u bulmaktır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Product Quantization Mekaniği</h2>
<p class="l-text">PQ, ANN araç kutusundaki en güzel hiledir. Her d-boyutlu vektörü M alt-vektöre böl. Her alt uzayda <code>k=256</code> centroid ile bağımsız k-means çalıştır → alt-kod başına 8 bit. Bir vektör artık M bayttır. (Tam hassasiyetli) bir sorgudan PQ-kodlu bir veritabanı vektörüne mesafe <em>asimetrik mesafe</em> ile hesaplanır: her alt uzaydaki 256 centroid'in tümüne sorgudan mesafeyi M × 256 arama tablosuna önceden hesapla, sonra veritabanı vektörü başına M arama topla.</p>

<div class="katex-block">$$d_{\\text{ADC}}(\\mathbf{q}, \\hat{\\mathbf{x}})^2 = \\sum_{m=1}^{M} d\\!\\left(\\mathbf{q}^{(m)},\\, \\mathbf{c}^{(m)}_{\\text{code}_m(\\mathbf{x})}\\right)^2$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">M = 8, d = 64</div><div class="card-body">8 boyutlu 8 alt-vektör. Vektör başına 8 bayt. 32k vektör için 256 KB. Agresif sıkıştırma.</div></div>
<div class="calc-card"><div class="card-title">M = 32, d = 768</div><div class="card-body">Cümle embedding'leri için standart. Vektör başına 32 bayt → 1B vektör için 32 GB.</div></div>
<div class="calc-card"><div class="card-title">OPQ döndürme</div><div class="card-body">Optimize PQ önce öğrenilmiş bir döndürme uygular, böylece alt uzaylar eşit varyansa sahip olur. ~%10 recall artışı.</div></div>
<div class="calc-card"><div class="card-title">Yeniden sıralama</div><div class="card-body">Her zaman fazla getir (örneğin PQ ile top-100), sonra top-100'ü tam-hassasiyet mesafelerle yeniden sırala. Hassasiyet kaybının çoğunu kurtarır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
N, d, M, K = <span class="num">4000</span>, <span class="num">64</span>, <span class="num">8</span>, <span class="num">256</span>
sub_d = d // M
X = np.random.<span class="fn">randn</span>(N, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

<span class="cm"># 1. Codebook'ları öğren</span>
codebooks, codes = [], np.<span class="fn">zeros</span>((N, M), dtype=np.uint8)
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(M):
    sub = X[:, m*sub_d:(m+<span class="num">1</span>)*sub_d]
    km = <span class="fn">KMeans</span>(n_clusters=K, n_init=<span class="num">1</span>, random_state=m).<span class="fn">fit</span>(sub)
    codebooks.<span class="fn">append</span>(km.cluster_centers_.<span class="fn">astype</span>(<span class="str">'float32'</span>))
    codes[:, m] = km.labels_

<span class="cm"># 2. ADC arama</span>
q = X[<span class="num">0</span>]
lut = np.<span class="fn">empty</span>((M, K), dtype=<span class="str">'float32'</span>)
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(M):
    diff = codebooks[m] - q[m*sub_d:(m+<span class="num">1</span>)*sub_d]
    lut[m] = np.<span class="fn">einsum</span>(<span class="str">'ij,ij->i'</span>, diff, diff)

approx = lut[np.<span class="fn">arange</span>(M), codes].<span class="fn">sum</span>(axis=<span class="num">1</span>)        <span class="cm"># sorgu başına N toplama</span>
exact  = ((X - q) ** <span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>)

<span class="fn">print</span>(f<span class="str">"PQ size:    {codes.nbytes:>9,} B  ({codes.nbytes/X.nbytes*100:.1f}% of fp32)"</span>)
<span class="fn">print</span>(f<span class="str">"recall@10:  {len(set(np.argsort(approx)[:10]) &amp; set(np.argsort(exact)[:10]))/10:.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>PQ inşa + ADC arama, adım adım:</strong> 1) <code>M=8</code> alt-uzayın her biri için 64-d vektörü 8-d dilimlere böler ve <code>KMeans(n_clusters=256)</code> fit eder; bu, 256 merkezli <code>codebooks[m]</code>'ı verir ve en yakın merkez kimliğini <code>codes[:,m]</code>'ye tek bir bayt olarak yazar. 2) <code>codes</code> N×8 uint8 tutar — print orijinal fp32 ayak izine oranını gösterir. 3) <code>q</code> sorgusu için iç döngü <code>lut[m,k] = ||q_m − c_{m,k}||²</code> asimetrik mesafe lookup'unu kurar. 4) <code>lut[arange(M), codes].sum(axis=1)</code> veritabanı vektörü başına M lookup'u toplayıp tam L2 mesafesini yaklaşık çıkarır; top-10 kimlikleri kesin hesaplamayla karşılaştırıp recall raporlarız.</p>
</div>


<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Skaler Nicemleme — Ucuz Kazanç</h2>
<p class="l-text">PQ'ya uzanmadan önce skaler nicemlemeyi (SQ) dene. Her fp32 boyutu doğrusal olarak bir int8'e eşlenir: 4x sıkıştırma, çoğu embedding dağılımında %1'den az recall kaybı, neredeyse sıfır uygulama karmaşıklığı. FAISS buna <code>SQ8</code> der; birçok üretim sistemi varsayılan olarak kullanır.</p>

<div class="katex-block">$$\\hat{x}_i = \\operatorname{round}\\!\\left(255 \\cdot \\frac{x_i - \\min_i}{\\max_i - \\min_i}\\right) \\in \\{0, \\dots, 255\\}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
X = np.random.<span class="fn">randn</span>(<span class="num">2000</span>, <span class="num">128</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>)

<span class="cm"># Boyut başına min/max ölçek</span>
mn, mx = X.<span class="fn">min</span>(axis=<span class="num">0</span>), X.<span class="fn">max</span>(axis=<span class="num">0</span>)
scale = (mx - mn) / <span class="num">255.0</span>

X_q = np.<span class="fn">round</span>((X - mn) / scale).<span class="fn">clip</span>(<span class="num">0</span>, <span class="num">255</span>).<span class="fn">astype</span>(np.uint8)
X_dq = X_q.<span class="fn">astype</span>(<span class="str">'float32'</span>) * scale + mn          <span class="cm"># mesafe için denicemle</span>

q = X[<span class="num">5</span>]
exact = np.<span class="fn">argsort</span>(((X - q)**<span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>))[:<span class="num">10</span>]
sq    = np.<span class="fn">argsort</span>(((X_dq - q)**<span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>))[:<span class="num">10</span>]

<span class="fn">print</span>(f<span class="str">"original bytes: {X.nbytes:>9,}"</span>)
<span class="fn">print</span>(f<span class="str">"int8 bytes:     {X_q.nbytes:>9,}  ({X.nbytes // X_q.nbytes}x smaller)"</span>)
<span class="fn">print</span>(f<span class="str">"recall@10:      {len(set(exact) &amp; set(sq))/10:.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>SQ8 gidiş-dönüş, adım adım:</strong> 1) <code>mn, mx = X.min(axis=0), X.max(axis=0)</code> her boyut için tek bir ölçek öğrenir. 2) <code>X_q = round((X − mn) / scale).clip(0, 255).astype(uint8)</code> her fp32 boyutu 8-bit tamsayıya eşler — 4× sıkıştırma. 3) <code>X_dq = X_q.astype(float32) * scale + mn</code> sadece mesafe hesabı için yeterince denicemler. 4) <code>X[5]</code> sorgusu için <code>X</code> (kesin) ile <code>X_dq</code> (SQ8) üzerinden top-10 komşuyu karşılaştırırız; son print bayt oranını ve recall'u — gerçek embedding'lerde genellikle &gt;0.99 — bildirir.</p>


<div class="calc-highlight">SQ8 ANN araç kutusundaki en düşük-riskli sıkıştırmadır: 4x daha küçük, neredeyse bedava recall. PQ üstüne 8x daha alır, daha tehlikeli eğitim ve recall ayarlama maliyetiyle.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Recall-Gecikme Pareto Eğrisi</h2>
<p class="l-text">Aşağıda 10M x 768 boyutlu bir benchmark üzerinde dört ana algoritmanın stilize bir grafiği var. Her algoritmanın çalışma noktalarının bir <em>ailesi</em> vardır (<code>nprobe</code>, <code>efSearch</code> vb. ile kontrol edilir); eğri o noktaların üst zarfıdır. "En iyi" algoritma, eğrisi gerekli (recall, QPS) noktanızdan geçen algoritmadır.</p>

<div id="vdb-l3-pareto-tr" class="plotly-graph"></div>
<script>setTimeout(function(){if(window.Plotly){Plotly.newPlot('vdb-l3-pareto-tr',[{x:[40,150,600,2400,9000,30000],y:[0.55,0.72,0.86,0.94,0.985,0.999],mode:'lines+markers',line:{color:'#7cc',width:3},marker:{size:9},name:'HNSW (in-mem)'},{x:[80,400,1800,7000,25000,80000],y:[0.50,0.68,0.83,0.92,0.97,0.992],mode:'lines+markers',line:{color:'#c8a96e',width:3},marker:{size:9},name:'IVF-PQ'},{x:[20,80,300,1100,4000,15000],y:[0.42,0.61,0.78,0.89,0.955,0.99],mode:'lines+markers',line:{color:'#a78bfa',width:3},marker:{size:9},name:'DiskANN (SSD)'},{x:[15,55,200,800,3000,11000],y:[0.35,0.52,0.70,0.83,0.92,0.975],mode:'lines+markers',line:{color:'#f472b6',width:3},marker:{size:9},name:'LSH / Annoy'}],{paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ddd',size:14},xaxis:{title:'QPS (log)',type:'log',gridcolor:'rgba(255,255,255,0.08)'},yaxis:{title:'recall@10',gridcolor:'rgba(255,255,255,0.08)',range:[0.3,1.01]},margin:{l:60,r:30,t:30,b:50},legend:{x:0.02,y:0.05}});}},300);</script>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">HNSW</div><div class="card-body">Bellek-içi en iyi recall/QPS. RAM-aç: fp32 vektörleri + grafı saklar.</div></div>
<div class="calc-card"><div class="card-title">IVF-PQ</div><div class="card-body"><em>Bayt</em> başına en iyi recall. 1B vektörü 32 GB'a sığdırır. Sabit recall'da biraz daha düşük QPS.</div></div>
<div class="calc-card"><div class="card-title">DiskANN (Vamana)</div><div class="card-body">SSD-yerleşik graf. Microsoft, 2019. Tek bir sunucuda milyar-ölçek, ~10 ms p99.</div></div>
<div class="calc-card"><div class="card-title">LSH / Annoy</div><div class="card-body">Daha eski. Annoy = rastgele projeksiyon ağaçları (Spotify). Basit, ama ~5M üzerinde geride.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Karar Akış Şeması</h2>
<p class="l-text">Pratik bir algoritma seçici. Yukarıdan aşağıya yürü; ilk eşleşme kazanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">N &lt; 100k</div><div class="card-body">→ <strong>Kaba kuvvet</strong> (numpy veya sklearn). Tek matmul. Aşırı mühendislik yapma.</div></div>
<div class="calc-card"><div class="card-title">N &lt; 10M, RAM bol</div><div class="card-body">→ <strong>HNSW32,Flat</strong>. En yüksek QPS, en basit ayar. 10M x 768d için ~6 GB bellek.</div></div>
<div class="calc-card"><div class="card-title">N &lt; 10M, RAM kıt</div><div class="card-body">→ <strong>HNSW + SQ8</strong> veya <strong>IVF1024,PQ32</strong>. Hafif recall kaybıyla 4-32x sıkıştırma.</div></div>
<div class="calc-card"><div class="card-title">10M - 1B, tek sunucu</div><div class="card-body">→ <strong>OPQ16_64,IVF8192,PQ32</strong> (FAISS) veya SSD-yerleşik için <strong>DiskANN</strong>.</div></div>
<div class="calc-card"><div class="card-title">1B+, çok sunucu</div><div class="card-body">→ <strong>Milvus / Vespa / Vald</strong> (sharded HNSW veya IVF-PQ) veya <strong>Pinecone / Turbopuffer</strong> (yönetilen).</div></div>
<div class="calc-card"><div class="card-title">Filtre-ağır sorgular</div><div class="card-body">→ <strong>Qdrant / Weaviate</strong>. Payload üzerinde önce-filtrele, sonra filtrelenmiş küme içinde ANN. Sonradan-filtreleme recall kaybından kaçın.</div></div>
</div>

<div class="calc-highlight">Tipik bir NLP/RAG projesi için (~100k - 10M chunk): FAISS veya Qdrant'ta HNSW ile başla. Yan projede bunu aşmazsın. Aşarsan, hangi düğmeyi çevireceğini tam olarak bileceksin.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Track Tekrarı</h2>
<p class="l-text">Artık neredeyse her üretim vektör veritabanının arkasındaki üç algoritmanın çalışan zihinsel modeline sahipsin. <strong>HNSW</strong> bir hiyerarşik küçük-dünya grafıdır, giriş noktasından en yakın komşuya O(log N) sıçrama yürür. <strong>IVF</strong> uzayı k-means ile bölümler ve sadece en yakın <code>nprobe</code> hücreyi tarar. <strong>PQ</strong> vektörleri M-bayt kodlara sıkıştırır ve arama tabloları üzerinden asimetrik mesafeleri hesaplar. Gerçek sistemler bunları birleştirir — <code>OPQ → IVF → PQ</code> kanonik milyar-ölçek tarifidir.</p>

<p class="l-text">Bu 3 dersli track boyunca <em>neden</em> vektör veritabanlarının var olduğundan (anlamsal arama, B-tree'lerin cevaplayamayacağı en yakın komşu aramasına indirgenir), <em>ne</em> sunduğundan (Flat, IVF, PQ, HNSW + fabrika mini-dili), <em>nasıl</em> çalıştığından (küçük-dünya grafları, k-means bölümleme, product quantization, skaler nicemleme) geçtin. Sonraki adım yönetilen bir vektör veritabanı seçmek (Qdrant harika ücretsiz başlangıç) ve onu bir RAG pipeline'ına entegre etmek — LangChain track L4 tam olarak buradan başlıyor.</p>
</div>`
};
