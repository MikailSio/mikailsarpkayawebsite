window.VECTORDB_L2 = {
en: `<p class="l-text"><strong>FAISS is the library every other vector database is secretly running underneath.</strong> Built by Facebook AI Research in 2017 and still the reference implementation for billion-scale similarity search, FAISS exposes a Lego set of indexes — exact, inverted-file, product-quantized, graph-based, GPU-accelerated — that you snap together with a tiny factory string like <code>"IVF1024,PQ32"</code>. Pinecone, Milvus, Vespa, and many in-house systems use FAISS internals or close clones.</p>

<p class="l-text">In this lesson we tour the four index families you will actually use in production, learn to read and write factory strings fluently, measure the brute-force vs IVF vs HNSW tradeoff on real review data, and persist an index to disk. Because <code>faiss</code> is not a Pyodide package, every demo block ships with a runnable scikit-learn equivalent so you can see the same algorithm working in your browser.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Choose between IndexFlatL2, IndexFlatIP, IndexIVFFlat, IndexIVFPQ, IndexHNSW for a given (N, d, recall) target</li>
<li>Read and write FAISS factory strings ("IVF1024,PQ32", "HNSW32,Flat", "OPQ16_64,IVF4096,PQ16")</li>
<li>Train an IVF index with a coarse k-means quantizer and tune <code>nprobe</code></li>
<li>Compress vectors 32x with product quantization and understand the precision cost</li>
<li>Move an index to GPU and back, then serialize with <code>faiss.write_index</code></li>
<li>Recognize when sklearn <code>NearestNeighbors</code> is enough vs when you must reach for FAISS</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The FAISS Mental Model: Indexes Are Composable</h2>
<p class="l-text">Every FAISS index implements the same three methods: <code>index.train(xb)</code>, <code>index.add(xb)</code>, <code>index.search(xq, k)</code>. What differs is the data structure inside. There are roughly four families:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Flat</div><div class="card-body">Exact brute-force scan. <code>IndexFlatL2</code>, <code>IndexFlatIP</code>. 100% recall, O(N) per query. Up to ~1M vectors.</div></div>
<div class="calc-card"><div class="card-title">IVF (Inverted File)</div><div class="card-body">Partition space into <code>nlist</code> clusters via k-means; query only the nearest <code>nprobe</code>. ~10-100x speedup, ~95% recall.</div></div>
<div class="calc-card"><div class="card-title">PQ (Product Quantization)</div><div class="card-body">Compress each vector into M sub-codes of 8 bits. 32x smaller, distances computed via lookup tables.</div></div>
<div class="calc-card"><div class="card-title">HNSW (Graph)</div><div class="card-body">Hierarchical small-world graph. O(log N) hops to k-NN. Best recall per QPS, but ~1.5x memory overhead.</div></div>
</div>

<div class="calc-highlight">Real production indexes <em>combine</em> these: <code>OPQ16_64,IVF4096,PQ16</code> means "rotate vectors with OPQ to 64 dims → coarse cluster into 4096 cells → compress residuals with PQ16." FAISS lets you express this in one string.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. IndexFlat — The Honest Baseline</h2>
<p class="l-text">Always start here. <code>IndexFlatL2</code> is exact: it returns the true k-nearest neighbors. Use it as the ground-truth oracle when measuring recall of any approximate index, and as the actual production index when N is small.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss
<span class="kw">import</span> numpy <span class="kw">as</span> np

d = <span class="num">128</span>                                  <span class="cm"># embedding dimension</span>
nb = 100_000                             <span class="cm"># database size</span>
xb = np.random.<span class="fn">randn</span>(nb, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
xq = np.random.<span class="fn">randn</span>(<span class="num">5</span>,  d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

index = faiss.<span class="fn">IndexFlatL2</span>(d)             <span class="cm"># no training needed for Flat</span>
index.<span class="fn">add</span>(xb)                            <span class="cm"># in-memory copy of all vectors</span>
<span class="fn">print</span>(f<span class="str">"index.ntotal = {index.ntotal}"</span>)  <span class="cm"># 100000</span>

D, I = index.<span class="fn">search</span>(xq, k=<span class="num">5</span>)             <span class="cm"># D: distances, I: indices</span>
<span class="fn">print</span>(<span class="str">"nearest 5 IDs for query 0:"</span>, I[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"L2 distances:"</span>, D[<span class="num">0</span>])
</code></pre></div>

<p class="l-text"><strong>Trace through:</strong> 1) <code>faiss.IndexFlatL2(d)</code> allocates a brute-force L2 index for 128-dim vectors — no <code>train()</code> step is needed because Flat keeps every vector verbatim. 2) <code>index.add(xb)</code> copies the 100k matrix into the index; <code>index.ntotal</code> confirms the load. 3) <code>index.search(xq, k=5)</code> scans the entire database for each of the 5 queries and returns the squared-L2 distance matrix <code>D</code> alongside the neighbor ID matrix <code>I</code>. 4) The print line surfaces the top-5 IDs for query 0 so you can sanity-check that the IDs and distances correlate.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn's NearestNeighbors with brute algorithm is a one-to-one stand-in for IndexFlatL2 — same exact result, slightly different API.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
d, nb = <span class="num">128</span>, 10_000
xb = np.random.<span class="fn">randn</span>(nb, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
xq = np.random.<span class="fn">randn</span>(<span class="num">5</span>,  d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

idx = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, algorithm=<span class="str">'brute'</span>, metric=<span class="str">'euclidean'</span>)
idx.<span class="fn">fit</span>(xb)

D, I = idx.<span class="fn">kneighbors</span>(xq, n_neighbors=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"nearest 5 IDs for query 0:"</span>, I[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"L2 distances:"</span>, np.<span class="fn">round</span>(D[<span class="num">0</span>], <span class="num">2</span>))
</code></pre></div>
</div>

<p class="l-text">Notice that FAISS returns <em>squared</em> L2 distances by default (skipping the sqrt for speed); sklearn returns true L2. The <em>ranking</em> is identical because sqrt is monotonic.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. IndexIVFFlat — Partition Space with k-Means</h2>
<p class="l-text">The Inverted File index runs k-means once at training time to learn <code>nlist</code> centroids (typical: <code>nlist = 4 * sqrt(N)</code>). Each database vector is assigned to its nearest centroid and stored in that cell's posting list. At query time, FAISS finds the <code>nprobe</code> nearest centroids and brute-forces only the vectors in those cells.</p>

<div class="katex-block">$$\\text{cost per query} \\approx \\frac{nprobe}{nlist} \\cdot N \\cdot d \\quad (\\text{vs}\\; N \\cdot d \\;\\text{for Flat})$$</div>

<p class="l-text">A typical setting <code>nlist=4096, nprobe=16</code> on N=1M means searching ~3900 vectors instead of 1M — a 250x speedup at ~95% recall@10.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

d, nb, nq = <span class="num">128</span>, 1_000_000, <span class="num">100</span>
xb = np.random.<span class="fn">randn</span>(nb, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
xq = np.random.<span class="fn">randn</span>(nq, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

nlist = <span class="num">4096</span>
quantizer = faiss.<span class="fn">IndexFlatL2</span>(d)         <span class="cm"># used to assign vectors to cells</span>
index = faiss.<span class="fn">IndexIVFFlat</span>(quantizer, d, nlist, faiss.METRIC_L2)

index.<span class="fn">train</span>(xb[:200_000])                <span class="cm"># train k-means on a subset</span>
index.<span class="fn">add</span>(xb)

index.nprobe = <span class="num">16</span>                        <span class="cm"># tune at query time</span>
D, I = index.<span class="fn">search</span>(xq, k=<span class="num">10</span>)
<span class="fn">print</span>(f<span class="str">"first query top-10: {I[0]}"</span>)
</code></pre></div>

<p class="l-text"><strong>Trace through:</strong> 1) <code>quantizer = IndexFlatL2(d)</code> is the coarse assignment index that holds the k-means centroids. 2) <code>IndexIVFFlat(quantizer, d, nlist=4096, METRIC_L2)</code> wraps the quantizer with 4096 posting lists. 3) <code>index.train(xb[:200_000])</code> runs k-means on a 200k subsample to learn those centroids, then <code>index.add(xb)</code> bins all 1M vectors into their nearest cell. 4) <code>index.nprobe = 16</code> tells search to scan only the 16 closest cells — roughly 4000 of 1M vectors per query. 5) <code>index.search(xq, k=10)</code> returns the top-10 IDs for each of the 100 queries.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Reproduce IVF manually with sklearn KMeans + brute search inside the chosen cell. This is exactly what FAISS does, just slower.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np

X = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">500</span>, stop_words=<span class="str">'english'</span>).<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>()
X = <span class="fn">normalize</span>(X).<span class="fn">astype</span>(<span class="str">'float32'</span>)
<span class="fn">print</span>(f<span class="str">"corpus: {X.shape}"</span>)

<span class="cm"># 1. TRAIN: learn nlist=20 cluster centers</span>
nlist = <span class="num">20</span>
km = <span class="fn">KMeans</span>(n_clusters=nlist, n_init=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X)
assignments = km.labels_

<span class="cm"># 2. ADD: posting lists keyed by cell id</span>
posting = {c: np.<span class="fn">where</span>(assignments == c)[<span class="num">0</span>] <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(nlist)}

<span class="cm"># 3. SEARCH: find nprobe nearest cells, brute-force inside</span>
q = X[<span class="num">7</span>]
cell_d = np.linalg.<span class="fn">norm</span>(km.cluster_centers_ - q, axis=<span class="num">1</span>)
nprobe = <span class="num">3</span>
probe_cells = np.<span class="fn">argsort</span>(cell_d)[:nprobe]
candidates = np.<span class="fn">concatenate</span>([posting[c] <span class="kw">for</span> c <span class="kw">in</span> probe_cells])
scores = X[candidates] @ q
top5_local = np.<span class="fn">argsort</span>(-scores)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"top-5 from IVF:"</span>, candidates[top5_local])
<span class="fn">print</span>(<span class="str">"(scanned"</span>, <span class="fn">len</span>(candidates), <span class="str">"of"</span>, <span class="fn">len</span>(X), <span class="str">"vectors)"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Manual IVF, step by step:</strong> 1) <code>TfidfVectorizer</code> turns review text into a 500-feature sparse matrix, then <code>normalize()</code> makes every row unit-length so cosine reduces to a dot product. 2) <code>KMeans(n_clusters=20).fit(X)</code> trains the coarse quantizer; <code>km.labels_</code> gives each review's cell ID. 3) <code>posting</code> is a dict that maps every cell ID to the indices of the reviews living in it — exactly what an IVF posting list is. 4) For a query <code>q</code>, we measure distance to all 20 centroids, take the <code>nprobe=3</code> nearest cells, concatenate their posting lists, and brute-force-score that candidate set with <code>X[candidates] @ q</code>. The print reveals you scanned far fewer than the full corpus.</p>


</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Product Quantization — 32x Compression</h2>
<p class="l-text">PQ splits each d-dimensional vector into M sub-vectors of length d/M and quantizes each independently using a 256-entry codebook (8 bits). A 768-dim float32 vector (3072 bytes) becomes M=32 bytes — 96x compression. Distances are computed with lookup tables: precompute the distance from the query to all 256 centroids in each of the M subspaces, then sum.</p>

<div class="katex-block">$$\\|\\mathbf{q} - \\hat{\\mathbf{x}}\\|^2 \\approx \\sum_{m=1}^{M} \\|\\mathbf{q}^{(m)} - \\mathbf{c}_{k_m}^{(m)}\\|^2$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">M (subvectors)</div><div class="card-body">More M → finer codes, higher recall, larger storage. Common: M ∈ {8, 16, 32, 64}.</div></div>
<div class="calc-card"><div class="card-title">nbits per code</div><div class="card-body">Default 8 bits → 256 centroids per subspace. Trained with k-means.</div></div>
<div class="calc-card"><div class="card-title">Memory: 1M x 768d</div><div class="card-body">Flat fp32: 3 GB. PQ32: <strong>32 MB</strong>. Fits in L2 cache of large CPUs.</div></div>
<div class="calc-card"><div class="card-title">Recall hit</div><div class="card-body">PQ32 on sentence embeddings: ~85-92% recall@10 vs exact. Add IVF + reranking to recover.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

d = <span class="num">128</span>
xb = np.random.<span class="fn">randn</span>(200_000, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

<span class="cm"># Combined IVF + PQ via factory (more on this in section 5)</span>
index = faiss.<span class="fn">index_factory</span>(d, <span class="str">"IVF1024,PQ16"</span>, faiss.METRIC_L2)
index.<span class="fn">train</span>(xb)
index.<span class="fn">add</span>(xb)

<span class="fn">print</span>(f<span class="str">"compressed size: {index.sa_code_size()} bytes per vector"</span>)  <span class="cm"># ~16</span>
<span class="fn">print</span>(f<span class="str">"total compressed bytes: {index.ntotal * index.sa_code_size():,}"</span>)
</code></pre></div>

<p class="l-text"><strong>Trace through:</strong> 1) <code>faiss.index_factory(128, "IVF1024,PQ16", METRIC_L2)</code> composes a coarse IVF quantizer with 1024 cells plus a 16-byte PQ residual coder in a single call. 2) <code>index.train(xb)</code> learns the IVF centroids and the per-subspace PQ codebooks on 200k vectors. 3) <code>index.add(xb)</code> writes each vector as 16 bytes inside its cell's posting list. 4) <code>index.sa_code_size()</code> reports the bytes-per-vector after PQ — about 16 — and multiplying by <code>ntotal</code> shows the full compressed footprint, far smaller than the original 200k × 128 × 4 = 100 MB.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Manual product quantization with sklearn KMeans on each subspace. The 32x compression is real: see the byte counts at the end.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
N, d, M = <span class="num">2000</span>, <span class="num">64</span>, <span class="num">8</span>                    <span class="cm"># 8 subspaces of dim 8</span>
ks = <span class="num">256</span>                                 <span class="cm"># 256 centroids per subspace = 8 bits</span>

X = np.random.<span class="fn">randn</span>(N, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
sub_d = d // M

codebooks = []
codes = np.<span class="fn">zeros</span>((N, M), dtype=np.uint8)
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(M):
    sub = X[:, m*sub_d:(m+<span class="num">1</span>)*sub_d]
    km = <span class="fn">KMeans</span>(n_clusters=ks, n_init=<span class="num">1</span>, random_state=m).<span class="fn">fit</span>(sub)
    codebooks.<span class="fn">append</span>(km.cluster_centers_.<span class="fn">astype</span>(<span class="str">'float32'</span>))
    codes[:, m] = km.labels_

<span class="fn">print</span>(f<span class="str">"original bytes: {X.nbytes:>10,}"</span>)
<span class="fn">print</span>(f<span class="str">"PQ codes bytes: {codes.nbytes:>10,}  ({X.nbytes/codes.nbytes:.0f}x smaller)"</span>)

<span class="cm"># Asymmetric distance: query stays full precision, db is quantized</span>
q = X[<span class="num">0</span>]
lut = np.<span class="fn">zeros</span>((M, ks), dtype=<span class="str">'float32'</span>)
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(M):
    diff = codebooks[m] - q[m*sub_d:(m+<span class="num">1</span>)*sub_d]
    lut[m] = np.<span class="fn">einsum</span>(<span class="str">'ij,ij->i'</span>, diff, diff)

approx_d2 = lut[np.<span class="fn">arange</span>(M), codes].<span class="fn">sum</span>(axis=<span class="num">1</span>)
top5 = np.<span class="fn">argsort</span>(approx_d2)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"PQ top-5:"</span>, top5)
</code></pre></div>
</div>

<p class="l-text"><strong>Hand-rolled PQ, step by step:</strong> 1) Split each 64-dim vector into <code>M=8</code> sub-vectors of length 8, fit one <code>KMeans(n_clusters=256)</code> per subspace so each codebook stores 256 centroids that need only 1 byte to address. 2) The compact <code>codes</code> matrix holds <code>N×M</code> uint8s — the <code>X.nbytes/codes.nbytes</code> print confirms the 32× compression. 3) For an asymmetric query we precompute the lookup table <code>lut[m,k] = ||q_m − c_{m,k}||²</code> in each subspace. 4) Summing <code>lut[arange(M), codes]</code> along axis 1 gives the approximate distance from <code>q</code> to every encoded vector; <code>argsort</code> pulls the top-5.</p>


</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Factory Mini-Language</h2>
<p class="l-text"><code>faiss.index_factory(d, "string", metric)</code> parses a comma-separated recipe and builds the corresponding nested index. This is how you express complex pipelines without writing 30 lines of glue code.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">"Flat"</div><div class="card-body">Exact brute force. Baseline.</div></div>
<div class="calc-card"><div class="card-title">"IVF1024,Flat"</div><div class="card-body">1024 cells, store full vectors per cell. Fast + exact within probed cells.</div></div>
<div class="calc-card"><div class="card-title">"IVF4096,PQ32"</div><div class="card-body">4096 cells + 32-byte PQ codes. Production billion-scale workhorse.</div></div>
<div class="calc-card"><div class="card-title">"OPQ16_64,IVF4096,PQ16"</div><div class="card-body">Optimized rotation to 64d → IVF → PQ16. Best recall at high compression.</div></div>
<div class="calc-card"><div class="card-title">"HNSW32,Flat"</div><div class="card-body">HNSW graph with 32 connections per node, full vectors stored. Highest QPS.</div></div>
<div class="calc-card"><div class="card-title">"PCAR64,IVF1024,SQ8"</div><div class="card-body">PCA-rotate to 64d → IVF → 8-bit scalar quantization.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

d, N = <span class="num">128</span>, 100_000
xb = np.random.<span class="fn">randn</span>(N, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

<span class="kw">for</span> spec <span class="kw">in</span> [<span class="str">"Flat"</span>, <span class="str">"IVF1024,Flat"</span>, <span class="str">"IVF1024,PQ16"</span>, <span class="str">"HNSW32,Flat"</span>, <span class="str">"OPQ16_64,IVF512,PQ16"</span>]:
    idx = faiss.<span class="fn">index_factory</span>(d, spec)
    <span class="kw">if</span> <span class="kw">not</span> idx.is_trained:
        idx.<span class="fn">train</span>(xb[:20_000])
    idx.<span class="fn">add</span>(xb)
    <span class="fn">print</span>(f<span class="str">"{spec:30s}  is_trained={idx.is_trained}  ntotal={idx.ntotal}"</span>)
</code></pre></div>

<p class="l-text"><strong>Trace through:</strong> 1) The loop walks five factory specs — <code>"Flat"</code>, <code>"IVF1024,Flat"</code>, <code>"IVF1024,PQ16"</code>, <code>"HNSW32,Flat"</code>, <code>"OPQ16_64,IVF512,PQ16"</code>. 2) For each spec, <code>faiss.index_factory(d, spec)</code> parses the comma-separated recipe and returns a composite index. 3) The <code>if not idx.is_trained</code> guard skips <code>train()</code> for graph indexes like HNSW that need no learning phase. 4) <code>idx.add(xb)</code> ingests the 100k vectors, and the trailing print confirms both training state and final vector count side by side — a useful smoke test for any recipe you copy from a paper.</p>


<div class="calc-highlight">Rule of thumb: start with <code>"HNSW32,Flat"</code> for &lt;10M vectors and tight latency, switch to <code>"IVF...,PQ..."</code> when memory becomes the bottleneck.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. IndexHNSW — Graphs Beat Trees</h2>
<p class="l-text">HNSW (Malkov &amp; Yashunin, 2018) builds a hierarchy of proximity graphs and greedily walks from the top layer down to the nearest neighbor. We dedicate Lesson 3 to the algorithm; here is the FAISS API surface.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

d = <span class="num">768</span>
index = faiss.<span class="fn">IndexHNSWFlat</span>(d, <span class="num">32</span>)       <span class="cm"># M = 32 connections per node</span>
index.hnsw.efConstruction = <span class="num">200</span>          <span class="cm"># build-time quality knob</span>
index.hnsw.efSearch = <span class="num">64</span>                 <span class="cm"># query-time quality knob</span>

xb = np.random.<span class="fn">randn</span>(50_000, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
index.<span class="fn">add</span>(xb)                            <span class="cm"># no train() needed</span>

xq = np.random.<span class="fn">randn</span>(<span class="num">5</span>, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
D, I = index.<span class="fn">search</span>(xq, k=<span class="num">10</span>)
<span class="fn">print</span>(I[<span class="num">0</span>])
</code></pre></div>

<p class="l-text">No training step. <code>efConstruction</code> controls graph quality during insert (higher = better recall but slower indexing). <code>efSearch</code> is the search-time knob — increase it to slide along the recall/QPS curve. Memory cost: ~<code>(M + 1) * 8 bytes</code> per vector for the graph on top of the raw fp32 storage.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn KDTree is a tree-based ANN — different algorithm, similar API. Use ball_tree on TF-IDF reviews and compare to brute-force recall.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np

X = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">300</span>, stop_words=<span class="str">'english'</span>).<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>()
X = <span class="fn">normalize</span>(X).<span class="fn">astype</span>(<span class="str">'float32'</span>)

exact = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">10</span>, algorithm=<span class="str">'brute'</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(X)
ball  = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">10</span>, algorithm=<span class="str">'ball_tree'</span>, metric=<span class="str">'euclidean'</span>).<span class="fn">fit</span>(X)

q = X[<span class="num">12</span>:<span class="num">13</span>]
_, I_exact = exact.<span class="fn">kneighbors</span>(q, n_neighbors=<span class="num">10</span>)
_, I_ball  = ball.<span class="fn">kneighbors</span>(q,  n_neighbors=<span class="num">10</span>)

inter = np.<span class="fn">intersect1d</span>(I_exact[<span class="num">0</span>], I_ball[<span class="num">0</span>])
<span class="fn">print</span>(f<span class="str">"recall@10 (ball_tree vs brute): {len(inter)/10:.2f}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Recall comparison, step by step:</strong> 1) <code>TfidfVectorizer(max_features=300)</code> plus <code>normalize()</code> gives unit-length sparse review vectors so cosine matches dot. 2) We fit two <code>NearestNeighbors</code> indexes on the same corpus: <code>algorithm='brute'</code> for the exact reference and <code>algorithm='ball_tree'</code> for the approximate tree analogue of HNSW. 3) We ask both for the top-10 neighbors of review 12; <code>np.intersect1d</code> measures how many IDs appear in both result sets. 4) The final print reports <code>recall@10</code> — the fraction of true neighbors recovered by the tree — exactly the same number you would compute for an HNSW index against a Flat oracle.</p>


</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. GPU Acceleration</h2>
<p class="l-text">FAISS ships with CUDA implementations of <code>IndexFlat</code>, <code>IndexIVFFlat</code>, and <code>IndexIVFPQ</code>. A single A100 can do brute-force search over 100M x 1024-d vectors in tens of milliseconds. The conversion is one line.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

cpu_index = faiss.<span class="fn">IndexFlatL2</span>(<span class="num">768</span>)
cpu_index.<span class="fn">add</span>(np.random.<span class="fn">randn</span>(1_000_000, <span class="num">768</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>))

res = faiss.<span class="fn">StandardGpuResources</span>()
gpu_index = faiss.<span class="fn">index_cpu_to_gpu</span>(res, <span class="num">0</span>, cpu_index)   <span class="cm"># device 0</span>

xq = np.random.<span class="fn">randn</span>(<span class="num">1024</span>, <span class="num">768</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>)
D, I = gpu_index.<span class="fn">search</span>(xq, <span class="num">10</span>)          <span class="cm"># batched on GPU</span>
<span class="fn">print</span>(D.shape, I.shape)

<span class="cm"># Move back for serialization</span>
cpu_index_back = faiss.<span class="fn">index_gpu_to_cpu</span>(gpu_index)
</code></pre></div>

<p class="l-text">For batched offline scoring (e.g. building a recommendation table for 100M users) the GPU is unmatched. For online single-query latency, a well-tuned CPU HNSW index often wins because GPU launch overhead dominates per-query.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Persistence — Save and Reload an Index</h2>
<p class="l-text">FAISS uses its own binary format. Two function calls handle everything; the file contains the index structure, the codebooks, and (for non-PQ indexes) the raw vectors.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

idx = faiss.<span class="fn">index_factory</span>(<span class="num">128</span>, <span class="str">"IVF256,PQ16"</span>)
xb = np.random.<span class="fn">randn</span>(50_000, <span class="num">128</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>)
idx.<span class="fn">train</span>(xb); idx.<span class="fn">add</span>(xb)

faiss.<span class="fn">write_index</span>(idx, <span class="str">"reviews.faiss"</span>)  <span class="cm"># serialize</span>

<span class="cm"># ... later, on a different process / machine ...</span>
loaded = faiss.<span class="fn">read_index</span>(<span class="str">"reviews.faiss"</span>)
<span class="fn">print</span>(f<span class="str">"loaded {loaded.ntotal} vectors"</span>)
loaded.nprobe = <span class="num">16</span>
D, I = loaded.<span class="fn">search</span>(xb[:<span class="num">5</span>], k=<span class="num">5</span>)
<span class="fn">print</span>(I)
</code></pre></div>

<p class="l-text"><strong>Trace through:</strong> 1) <code>faiss.index_factory(128, "IVF256,PQ16")</code> builds a 256-cell IVF coupled with 16-byte PQ codes. 2) <code>idx.train(xb)</code> learns the centroids and PQ codebooks, <code>idx.add(xb)</code> stores all 50k codes in their cells. 3) <code>faiss.write_index(idx, "reviews.faiss")</code> serialises the whole composite — codebooks, posting lists, codes — to a single binary file. 4) Later, <code>faiss.read_index(...)</code> reconstitutes the index; setting <code>loaded.nprobe = 16</code> matches the search-time profile you tuned in production. 5) Running <code>loaded.search(xb[:5], k=5)</code> against the reloaded index sanity-checks that persistence preserved both vectors and metadata.</p>


<div class="calc-highlight">Production tip: keep the embedding model and the FAISS index version-pinned together. Re-embedding 100M docs because you bumped the model is a multi-hour job.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What Comes Next</h2>
<p class="l-text">FAISS gives you four primitive index families (Flat, IVF, PQ, HNSW), a factory mini-language to compose them, GPU acceleration when you need batch throughput, and binary serialization for persistence. You now have the API knowledge to build a vector index for any reasonable corpus.</p>

<p class="l-text">Lesson 3 zooms into the <em>algorithms</em>. Why does HNSW achieve O(log N) search time? How does the small-world graph property emerge from the layered insertion procedure? When does IVF beat HNSW and when does PQ destroy your recall? We will plot the recall-latency Pareto curve and finish with a decision flowchart you can paste into a design doc.</p>
</div>`,
tr: `<p class="l-text"><strong>FAISS, diğer her vektör veritabanının gizlice altında çalıştırdığı kütüphanedir.</strong> Facebook AI Research tarafından 2017'de inşa edilen ve hâlâ milyar ölçekli benzerlik araması için referans uygulama olan FAISS, küçük bir <code>"IVF1024,PQ32"</code> gibi fabrika dizesiyle birleştirdiğin bir Lego seti indeks sunar — kesin, ters-dosya, product-quantized, graf tabanlı, GPU-hızlandırılmış. Pinecone, Milvus, Vespa ve birçok kurum içi sistem FAISS bileşenlerini ya da yakın klonlarını kullanır.</p>

<p class="l-text">Bu derste üretimde gerçekten kullanacağın dört indeks ailesini turlayacağız, fabrika dizelerini akıcı okuyup yazmayı öğreneceğiz, gerçek yorum verisinde kaba kuvvet vs IVF vs HNSW takasını ölçeceğiz ve indeksi diske kalıcı kılacağız. <code>faiss</code> bir Pyodide paketi olmadığından, her demo bloğu çalıştırılabilir bir scikit-learn eşdeğeriyle birlikte gelir; böylece aynı algoritmanın tarayıcında çalıştığını görebilirsin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Belirli bir (N, d, recall) hedefi için IndexFlatL2, IndexFlatIP, IndexIVFFlat, IndexIVFPQ, IndexHNSW arasında seçim yapmak</li>
<li>FAISS fabrika dizelerini ("IVF1024,PQ32", "HNSW32,Flat", "OPQ16_64,IVF4096,PQ16") okumak ve yazmak</li>
<li>Kaba k-means quantizer ile bir IVF indeksini eğitmek ve <code>nprobe</code>'u ayarlamak</li>
<li>Vektörleri product quantization ile 32x sıkıştırmak ve hassasiyet maliyetini anlamak</li>
<li>Bir indeksi GPU'ya ve geri taşımak, ardından <code>faiss.write_index</code> ile serileştirmek</li>
<li>sklearn <code>NearestNeighbors</code>'ın ne zaman yeterli olduğunu vs ne zaman FAISS'e uzanman gerektiğini fark etmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. FAISS Zihinsel Modeli: İndeksler Bestelenebilir</h2>
<p class="l-text">Her FAISS indeksi aynı üç metodu uygular: <code>index.train(xb)</code>, <code>index.add(xb)</code>, <code>index.search(xq, k)</code>. Farklı olan içerideki veri yapısıdır. Yaklaşık dört aile vardır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Flat</div><div class="card-body">Kesin kaba kuvvet tarama. <code>IndexFlatL2</code>, <code>IndexFlatIP</code>. %100 recall, sorgu başına O(N). ~1M vektöre kadar.</div></div>
<div class="calc-card"><div class="card-title">IVF (Ters Dosya)</div><div class="card-body">Uzayı k-means ile <code>nlist</code> kümeye böl; sadece en yakın <code>nprobe</code>'u sorgula. ~10-100x hızlanma, ~%95 recall.</div></div>
<div class="calc-card"><div class="card-title">PQ (Product Quantization)</div><div class="card-body">Her vektörü 8 bitlik M alt-koda sıkıştır. 32x daha küçük, mesafeler arama tabloları ile hesaplanır.</div></div>
<div class="calc-card"><div class="card-title">HNSW (Graf)</div><div class="card-body">Hiyerarşik küçük-dünya grafı. k-NN'e O(log N) sıçrama. QPS başına en iyi recall, ama ~1.5x bellek yükü.</div></div>
</div>

<div class="calc-highlight">Gerçek üretim indeksleri bunları <em>birleştirir</em>: <code>OPQ16_64,IVF4096,PQ16</code> şu anlama gelir: "vektörleri OPQ ile 64 boyuta döndür → 4096 hücreye kaba küme → kalıntıları PQ16 ile sıkıştır." FAISS bunu tek bir dizede ifade etmene izin verir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. IndexFlat — Dürüst Temel Çizgi</h2>
<p class="l-text">Her zaman buradan başla. <code>IndexFlatL2</code> kesindir: gerçek k-en yakın komşuları döndürür. Herhangi bir yaklaşık indeksin recall'unu ölçerken ground-truth oracle olarak kullan, ve N küçük olduğunda gerçek üretim indeksi olarak kullan.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss
<span class="kw">import</span> numpy <span class="kw">as</span> np

d = <span class="num">128</span>                                  <span class="cm"># embedding boyutu</span>
nb = 100_000                             <span class="cm"># veritabanı büyüklüğü</span>
xb = np.random.<span class="fn">randn</span>(nb, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
xq = np.random.<span class="fn">randn</span>(<span class="num">5</span>,  d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

index = faiss.<span class="fn">IndexFlatL2</span>(d)             <span class="cm"># Flat için training gereksiz</span>
index.<span class="fn">add</span>(xb)                            <span class="cm"># tüm vektörlerin bellek-içi kopyası</span>
<span class="fn">print</span>(f<span class="str">"index.ntotal = {index.ntotal}"</span>)  <span class="cm"># 100000</span>

D, I = index.<span class="fn">search</span>(xq, k=<span class="num">5</span>)             <span class="cm"># D: mesafeler, I: indeksler</span>
<span class="fn">print</span>(<span class="str">"nearest 5 IDs for query 0:"</span>, I[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"L2 distances:"</span>, D[<span class="num">0</span>])
</code></pre></div>

<p class="l-text"><strong>Kodun akışı:</strong> 1) <code>faiss.IndexFlatL2(d)</code> 128 boyutlu vektörler için kaba kuvvet L2 indeksi açar — Flat her vektörü olduğu gibi tuttuğundan <code>train()</code> adımı gerekmez. 2) <code>index.add(xb)</code> 100k vektörlük matrisi indekse kopyalar; <code>index.ntotal</code> yüklemenin başarılı olduğunu doğrular. 3) <code>index.search(xq, k=5)</code> 5 sorgunun her biri için tüm veritabanını tarar ve karesi alınmış L2 mesafe matrisi <code>D</code> ile komşu kimlik matrisi <code>I</code> döner. 4) <code>print</code> satırı 0 numaralı sorgunun ilk-5 kimliğini gösterir, böylece kimlik ile mesafe sıralamasının tutarlı olduğunu kontrol edebilirsin.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn'in NearestNeighbors'ı brute algoritma ile IndexFlatL2'nin bire bir yerine geçer — aynı kesin sonuç, biraz farklı API.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
d, nb = <span class="num">128</span>, 10_000
xb = np.random.<span class="fn">randn</span>(nb, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
xq = np.random.<span class="fn">randn</span>(<span class="num">5</span>,  d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

idx = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, algorithm=<span class="str">'brute'</span>, metric=<span class="str">'euclidean'</span>)
idx.<span class="fn">fit</span>(xb)

D, I = idx.<span class="fn">kneighbors</span>(xq, n_neighbors=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"nearest 5 IDs for query 0:"</span>, I[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"L2 distances:"</span>, np.<span class="fn">round</span>(D[<span class="num">0</span>], <span class="num">2</span>))
</code></pre></div>
</div>

<p class="l-text">FAISS'in varsayılan olarak <em>kareli</em> L2 mesafeleri döndürdüğüne dikkat edin (hız için sqrt'yi atlayarak); sklearn gerçek L2 döndürür. <em>Sıralama</em> aynıdır çünkü sqrt monotondur.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. IndexIVFFlat — k-Means ile Uzayı Bölümlemek</h2>
<p class="l-text">Ters Dosya indeksi eğitim zamanında <code>nlist</code> centroid öğrenmek için bir kez k-means çalıştırır (tipik: <code>nlist = 4 * sqrt(N)</code>). Her veritabanı vektörü en yakın centroid'ine atanır ve o hücrenin gönderim listesinde saklanır. Sorgu zamanında FAISS en yakın <code>nprobe</code> centroid'i bulur ve sadece o hücrelerdeki vektörleri kaba kuvvetle tarar.</p>

<div class="katex-block">$$\\text{cost per query} \\approx \\frac{nprobe}{nlist} \\cdot N \\cdot d \\quad (\\text{vs}\\; N \\cdot d \\;\\text{for Flat})$$</div>

<p class="l-text">N=1M üzerinde tipik bir ayar <code>nlist=4096, nprobe=16</code>, 1M yerine ~3900 vektör arar — recall@10 ~%95'te 250x hızlanma.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

d, nb, nq = <span class="num">128</span>, 1_000_000, <span class="num">100</span>
xb = np.random.<span class="fn">randn</span>(nb, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
xq = np.random.<span class="fn">randn</span>(nq, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

nlist = <span class="num">4096</span>
quantizer = faiss.<span class="fn">IndexFlatL2</span>(d)         <span class="cm"># vektörleri hücrelere atamak için</span>
index = faiss.<span class="fn">IndexIVFFlat</span>(quantizer, d, nlist, faiss.METRIC_L2)

index.<span class="fn">train</span>(xb[:200_000])                <span class="cm"># alt küme üzerinde k-means eğit</span>
index.<span class="fn">add</span>(xb)

index.nprobe = <span class="num">16</span>                        <span class="cm"># sorgu zamanında ayarla</span>
D, I = index.<span class="fn">search</span>(xq, k=<span class="num">10</span>)
<span class="fn">print</span>(f<span class="str">"first query top-10: {I[0]}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun akışı:</strong> 1) <code>quantizer = IndexFlatL2(d)</code> k-means merkezlerini barındıran kaba atama indeksidir. 2) <code>IndexIVFFlat(quantizer, d, nlist=4096, METRIC_L2)</code> bu quantizer'ı 4096 gönderim listesiyle sarmalar. 3) <code>index.train(xb[:200_000])</code> 200k alt-örneklem üzerinde k-means koşturup merkezleri öğrenir, ardından <code>index.add(xb)</code> 1M vektörü en yakın hücresine yerleştirir. 4) <code>index.nprobe = 16</code> aramanın yalnızca en yakın 16 hücreyi taramasını söyler — yaklaşık 4000 vektör/sorgu. 5) <code>index.search(xq, k=10)</code> 100 sorgunun her biri için top-10 kimliği döner.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">IVF'yi sklearn KMeans + seçili hücre içinde kaba kuvvet arama ile elle çoğalt. FAISS'in tam olarak yaptığı budur, sadece daha yavaş.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np

X = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">500</span>, stop_words=<span class="str">'english'</span>).<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>()
X = <span class="fn">normalize</span>(X).<span class="fn">astype</span>(<span class="str">'float32'</span>)
<span class="fn">print</span>(f<span class="str">"corpus: {X.shape}"</span>)

<span class="cm"># 1. EĞİT: nlist=20 küme merkezi öğren</span>
nlist = <span class="num">20</span>
km = <span class="fn">KMeans</span>(n_clusters=nlist, n_init=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X)
assignments = km.labels_

<span class="cm"># 2. EKLE: gönderim listeleri hücre id'sine göre anahtarlanmış</span>
posting = {c: np.<span class="fn">where</span>(assignments == c)[<span class="num">0</span>] <span class="kw">for</span> c <span class="kw">in</span> <span class="fn">range</span>(nlist)}

<span class="cm"># 3. ARA: nprobe en yakın hücreyi bul, içinde kaba kuvvet</span>
q = X[<span class="num">7</span>]
cell_d = np.linalg.<span class="fn">norm</span>(km.cluster_centers_ - q, axis=<span class="num">1</span>)
nprobe = <span class="num">3</span>
probe_cells = np.<span class="fn">argsort</span>(cell_d)[:nprobe]
candidates = np.<span class="fn">concatenate</span>([posting[c] <span class="kw">for</span> c <span class="kw">in</span> probe_cells])
scores = X[candidates] @ q
top5_local = np.<span class="fn">argsort</span>(-scores)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"top-5 from IVF:"</span>, candidates[top5_local])
<span class="fn">print</span>(<span class="str">"(scanned"</span>, <span class="fn">len</span>(candidates), <span class="str">"of"</span>, <span class="fn">len</span>(X), <span class="str">"vectors)"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Elle IVF, adım adım:</strong> 1) <code>TfidfVectorizer</code> yorum metnini 500-özellikli seyrek matrise dönüştürür, <code>normalize()</code> ise her satırı birim-uzunluğa indirir; böylece kosinüs benzerliği basit dot product'a düşer. 2) <code>KMeans(n_clusters=20).fit(X)</code> kaba quantizer'ı eğitir; <code>km.labels_</code> her yorumun hücre kimliğini verir. 3) <code>posting</code> her hücre kimliğini, o hücredeki yorum indekslerine eşleyen bir dict — bir IVF gönderim listesi tam olarak budur. 4) <code>q</code> sorgusu için 20 merkezin tümüne mesafe hesaplar, <code>nprobe=3</code> en yakın hücreyi seçer, gönderim listelerini birleştirir ve <code>X[candidates] @ q</code> ile aday kümeyi kaba kuvvetle puanlar. Çıktıdaki sayım korpusun tamamından çok daha azını taradığını gösterir.</p>


</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Product Quantization — 32x Sıkıştırma</h2>
<p class="l-text">PQ her d-boyutlu vektörü d/M uzunluğunda M alt-vektöre böler ve her birini 256-girişli bir codebook (8 bit) kullanarak bağımsız nicemler. 768-boyutlu float32 vektör (3072 bayt) M=32 bayt olur — 96x sıkıştırma. Mesafeler arama tabloları ile hesaplanır: M alt uzayın her birinde sorgudan 256 centroid'in tümüne mesafeyi önceden hesapla, sonra topla.</p>

<div class="katex-block">$$\\|\\mathbf{q} - \\hat{\\mathbf{x}}\\|^2 \\approx \\sum_{m=1}^{M} \\|\\mathbf{q}^{(m)} - \\mathbf{c}_{k_m}^{(m)}\\|^2$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">M (alt-vektör)</div><div class="card-body">Daha çok M → daha ince kodlar, daha yüksek recall, daha fazla depolama. Yaygın: M ∈ {8, 16, 32, 64}.</div></div>
<div class="calc-card"><div class="card-title">kod başına nbits</div><div class="card-body">Varsayılan 8 bit → alt uzay başına 256 centroid. k-means ile eğitilir.</div></div>
<div class="calc-card"><div class="card-title">Bellek: 1M x 768d</div><div class="card-body">Flat fp32: 3 GB. PQ32: <strong>32 MB</strong>. Büyük CPU'ların L2 cache'ine sığar.</div></div>
<div class="calc-card"><div class="card-title">Recall kaybı</div><div class="card-body">Cümle embedding'lerinde PQ32: kesine karşı ~%85-92 recall@10. IVF + reranking ekleyerek geri kazan.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

d = <span class="num">128</span>
xb = np.random.<span class="fn">randn</span>(200_000, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

<span class="cm"># Fabrika ile birleşik IVF + PQ (bölüm 5'te daha fazla)</span>
index = faiss.<span class="fn">index_factory</span>(d, <span class="str">"IVF1024,PQ16"</span>, faiss.METRIC_L2)
index.<span class="fn">train</span>(xb)
index.<span class="fn">add</span>(xb)

<span class="fn">print</span>(f<span class="str">"compressed size: {index.sa_code_size()} bytes per vector"</span>)  <span class="cm"># ~16</span>
<span class="fn">print</span>(f<span class="str">"total compressed bytes: {index.ntotal * index.sa_code_size():,}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun akışı:</strong> 1) <code>faiss.index_factory(128, "IVF1024,PQ16", METRIC_L2)</code> 1024 hücreli kaba IVF quantizer'ı ve 16-baytlık PQ artık kodlayıcısını tek çağrıda birleştirir. 2) <code>index.train(xb)</code> 200k vektör üzerinde IVF merkezlerini ve alt-uzay başına PQ codebook'larını öğrenir. 3) <code>index.add(xb)</code> her vektörü 16 bayt olarak hücresinin gönderim listesine yazar. 4) <code>index.sa_code_size()</code> PQ sonrası vektör başına bayt sayısını — yaklaşık 16 — bildirir; <code>ntotal</code> ile çarpınca toplam sıkıştırılmış ayak izini elde edersin, orijinal 200k × 128 × 4 = 100 MB'dan çok daha küçük.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Her alt uzayda sklearn KMeans ile manuel product quantization. 32x sıkıştırma gerçek: sondaki bayt sayılarına bak.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
N, d, M = <span class="num">2000</span>, <span class="num">64</span>, <span class="num">8</span>                    <span class="cm"># 8 alt uzay, her biri 8 boyut</span>
ks = <span class="num">256</span>                                 <span class="cm"># alt uzay başına 256 centroid = 8 bit</span>

X = np.random.<span class="fn">randn</span>(N, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
sub_d = d // M

codebooks = []
codes = np.<span class="fn">zeros</span>((N, M), dtype=np.uint8)
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(M):
    sub = X[:, m*sub_d:(m+<span class="num">1</span>)*sub_d]
    km = <span class="fn">KMeans</span>(n_clusters=ks, n_init=<span class="num">1</span>, random_state=m).<span class="fn">fit</span>(sub)
    codebooks.<span class="fn">append</span>(km.cluster_centers_.<span class="fn">astype</span>(<span class="str">'float32'</span>))
    codes[:, m] = km.labels_

<span class="fn">print</span>(f<span class="str">"original bytes: {X.nbytes:>10,}"</span>)
<span class="fn">print</span>(f<span class="str">"PQ codes bytes: {codes.nbytes:>10,}  ({X.nbytes/codes.nbytes:.0f}x smaller)"</span>)

<span class="cm"># Asimetrik mesafe: sorgu tam hassasiyette kalır, db nicemlenmiş</span>
q = X[<span class="num">0</span>]
lut = np.<span class="fn">zeros</span>((M, ks), dtype=<span class="str">'float32'</span>)
<span class="kw">for</span> m <span class="kw">in</span> <span class="fn">range</span>(M):
    diff = codebooks[m] - q[m*sub_d:(m+<span class="num">1</span>)*sub_d]
    lut[m] = np.<span class="fn">einsum</span>(<span class="str">'ij,ij->i'</span>, diff, diff)

approx_d2 = lut[np.<span class="fn">arange</span>(M), codes].<span class="fn">sum</span>(axis=<span class="num">1</span>)
top5 = np.<span class="fn">argsort</span>(approx_d2)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"PQ top-5:"</span>, top5)
</code></pre></div>
</div>

<p class="l-text"><strong>Elle PQ, adım adım:</strong> 1) Her 64-boyutlu vektörü <code>M=8</code> alt-vektöre (her biri 8 boyut) bölüp her alt-uzay için ayrı <code>KMeans(n_clusters=256)</code> fit eder, böylece her codebook 256 merkez tutar ve adres için yalnızca 1 bayt gerekir. 2) Sıkıştırılmış <code>codes</code> matrisi <code>N×M</code> uint8 tutar — <code>X.nbytes/codes.nbytes</code> çıktısı 32× sıkıştırmayı doğrular. 3) Asimetrik sorgu için her alt-uzayda <code>lut[m,k] = ||q_m − c_{m,k}||²</code> lookup tablosunu önceden hesaplarız. 4) <code>lut[arange(M), codes]</code> üzerinde axis=1 boyunca toplam, <code>q</code>'dan her kodlanmış vektöre yaklaşık mesafeyi verir; <code>argsort</code> ile top-5'i çekeriz.</p>


</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Fabrika Mini-Dili</h2>
<p class="l-text"><code>faiss.index_factory(d, "string", metric)</code> virgülle ayrılmış bir tarifi ayrıştırır ve karşılık gelen iç içe indeksi kurar. 30 satır yapıştırıcı kod yazmadan karmaşık pipeline'ları böyle ifade edersin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">"Flat"</div><div class="card-body">Kesin kaba kuvvet. Temel.</div></div>
<div class="calc-card"><div class="card-title">"IVF1024,Flat"</div><div class="card-body">1024 hücre, hücre başına tam vektörleri sakla. Aranan hücrelerde hızlı + kesin.</div></div>
<div class="calc-card"><div class="card-title">"IVF4096,PQ32"</div><div class="card-body">4096 hücre + 32-bayt PQ kodları. Üretim milyar-ölçek beygiri.</div></div>
<div class="calc-card"><div class="card-title">"OPQ16_64,IVF4096,PQ16"</div><div class="card-body">64 boyuta optimize edilmiş döndürme → IVF → PQ16. Yüksek sıkıştırmada en iyi recall.</div></div>
<div class="calc-card"><div class="card-title">"HNSW32,Flat"</div><div class="card-body">Düğüm başına 32 bağlantılı HNSW grafı, tam vektörler saklanır. En yüksek QPS.</div></div>
<div class="calc-card"><div class="card-title">"PCAR64,IVF1024,SQ8"</div><div class="card-body">64 boyuta PCA-döndürme → IVF → 8-bit skaler nicemleme.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

d, N = <span class="num">128</span>, 100_000
xb = np.random.<span class="fn">randn</span>(N, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)

<span class="kw">for</span> spec <span class="kw">in</span> [<span class="str">"Flat"</span>, <span class="str">"IVF1024,Flat"</span>, <span class="str">"IVF1024,PQ16"</span>, <span class="str">"HNSW32,Flat"</span>, <span class="str">"OPQ16_64,IVF512,PQ16"</span>]:
    idx = faiss.<span class="fn">index_factory</span>(d, spec)
    <span class="kw">if</span> <span class="kw">not</span> idx.is_trained:
        idx.<span class="fn">train</span>(xb[:20_000])
    idx.<span class="fn">add</span>(xb)
    <span class="fn">print</span>(f<span class="str">"{spec:30s}  is_trained={idx.is_trained}  ntotal={idx.ntotal}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun akışı:</strong> 1) Döngü beş fabrika tarifini gezer — <code>"Flat"</code>, <code>"IVF1024,Flat"</code>, <code>"IVF1024,PQ16"</code>, <code>"HNSW32,Flat"</code>, <code>"OPQ16_64,IVF512,PQ16"</code>. 2) Her tarif için <code>faiss.index_factory(d, spec)</code> virgülle ayrılmış reçeteyi ayrıştırır ve birleşik bir indeks döner. 3) <code>if not idx.is_trained</code> kontrolü, öğrenme aşaması gerektirmeyen HNSW gibi graf indeksleri için <code>train()</code>'i atlar. 4) <code>idx.add(xb)</code> 100k vektörü besler; sondaki print eş zamanlı olarak eğitim durumu ve son vektör sayısını gösterir — bir makaleden kopyaladığın her tarif için faydalı bir duman testi.</p>


<div class="calc-highlight">Kabaca kural: &lt;10M vektör ve sıkı gecikme için <code>"HNSW32,Flat"</code> ile başla, bellek darboğaz olmaya başladığında <code>"IVF...,PQ..."</code>'ya geç.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. IndexHNSW — Graflar Ağaçları Yener</h2>
<p class="l-text">HNSW (Malkov &amp; Yashunin, 2018) yakınlık graflarının bir hiyerarşisini kurar ve üst katmandan en yakın komşuya açgözlü yürür. Algoritmaya Ders 3'ü ayırıyoruz; burada FAISS API yüzeyi var.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

d = <span class="num">768</span>
index = faiss.<span class="fn">IndexHNSWFlat</span>(d, <span class="num">32</span>)       <span class="cm"># M = düğüm başına 32 bağlantı</span>
index.hnsw.efConstruction = <span class="num">200</span>          <span class="cm"># inşa-zamanı kalite düğmesi</span>
index.hnsw.efSearch = <span class="num">64</span>                 <span class="cm"># sorgu-zamanı kalite düğmesi</span>

xb = np.random.<span class="fn">randn</span>(50_000, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
index.<span class="fn">add</span>(xb)                            <span class="cm"># train() gerekmez</span>

xq = np.random.<span class="fn">randn</span>(<span class="num">5</span>, d).<span class="fn">astype</span>(<span class="str">'float32'</span>)
D, I = index.<span class="fn">search</span>(xq, k=<span class="num">10</span>)
<span class="fn">print</span>(I[<span class="num">0</span>])
</code></pre></div>

<p class="l-text">Eğitim adımı yok. <code>efConstruction</code> ekleme sırasında graf kalitesini kontrol eder (yüksek = daha iyi recall ama daha yavaş indeksleme). <code>efSearch</code> sorgu-zamanı düğmesidir — recall/QPS eğrisinde kaymak için artır. Bellek maliyeti: ham fp32 depolamasına ek olarak graf için vektör başına ~<code>(M + 1) * 8 bayt</code>.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn KDTree ağaç tabanlı bir ANN'dir — farklı algoritma, benzer API. TF-IDF yorumlarında ball_tree kullan ve kaba kuvvet recall'una karşılaştır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np

X = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">300</span>, stop_words=<span class="str">'english'</span>).<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>()
X = <span class="fn">normalize</span>(X).<span class="fn">astype</span>(<span class="str">'float32'</span>)

exact = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">10</span>, algorithm=<span class="str">'brute'</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(X)
ball  = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">10</span>, algorithm=<span class="str">'ball_tree'</span>, metric=<span class="str">'euclidean'</span>).<span class="fn">fit</span>(X)

q = X[<span class="num">12</span>:<span class="num">13</span>]
_, I_exact = exact.<span class="fn">kneighbors</span>(q, n_neighbors=<span class="num">10</span>)
_, I_ball  = ball.<span class="fn">kneighbors</span>(q,  n_neighbors=<span class="num">10</span>)

inter = np.<span class="fn">intersect1d</span>(I_exact[<span class="num">0</span>], I_ball[<span class="num">0</span>])
<span class="fn">print</span>(f<span class="str">"recall@10 (ball_tree vs brute): {len(inter)/10:.2f}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Recall karşılaştırması, adım adım:</strong> 1) <code>TfidfVectorizer(max_features=300)</code> ve <code>normalize()</code>, kosinüsün dot product'a eşit olacağı birim-uzunluklu seyrek yorum vektörleri verir. 2) Aynı korpusta iki <code>NearestNeighbors</code> indeksi fit ederiz: kesin referans için <code>algorithm='brute'</code>, HNSW'nin yaklaşık ağaç analoğu için <code>algorithm='ball_tree'</code>. 3) Her ikisinden de 12 numaralı yorumun en yakın 10 komşusunu isteriz; <code>np.intersect1d</code> iki sonuç kümesinde ortak çıkan kimlik sayısını ölçer. 4) Son print ağacın gerçek komşulardan kurtardığı oranı — <code>recall@10</code>'u — bildirir; bu Flat oracle'a karşı bir HNSW indeksi için hesaplayacağın değerin aynısıdır.</p>


</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. GPU Hızlandırma</h2>
<p class="l-text">FAISS, <code>IndexFlat</code>, <code>IndexIVFFlat</code> ve <code>IndexIVFPQ</code>'nun CUDA uygulamalarıyla gelir. Tek bir A100, 100M x 1024 boyutlu vektörler üzerinde kaba kuvvet aramayı onlarca milisaniyede yapabilir. Dönüşüm tek satır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

cpu_index = faiss.<span class="fn">IndexFlatL2</span>(<span class="num">768</span>)
cpu_index.<span class="fn">add</span>(np.random.<span class="fn">randn</span>(1_000_000, <span class="num">768</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>))

res = faiss.<span class="fn">StandardGpuResources</span>()
gpu_index = faiss.<span class="fn">index_cpu_to_gpu</span>(res, <span class="num">0</span>, cpu_index)   <span class="cm"># cihaz 0</span>

xq = np.random.<span class="fn">randn</span>(<span class="num">1024</span>, <span class="num">768</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>)
D, I = gpu_index.<span class="fn">search</span>(xq, <span class="num">10</span>)          <span class="cm"># GPU'da batch'li</span>
<span class="fn">print</span>(D.shape, I.shape)

<span class="cm"># Serileştirme için geri taşı</span>
cpu_index_back = faiss.<span class="fn">index_gpu_to_cpu</span>(gpu_index)
</code></pre></div>

<p class="l-text">Toplu çevrimdışı puanlama (örneğin 100M kullanıcı için bir öneri tablosu kurmak) için GPU eşsizdir. Çevrimiçi tek-sorgu gecikmesi için iyi-ayarlanmış bir CPU HNSW indeksi genellikle kazanır çünkü GPU başlatma yükü sorgu başına baskındır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Kalıcılık — İndeksi Kaydet ve Yeniden Yükle</h2>
<p class="l-text">FAISS kendi ikili formatını kullanır. İki fonksiyon çağrısı her şeyi halleder; dosya indeks yapısını, codebook'ları ve (PQ olmayan indeksler için) ham vektörleri içerir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> faiss, numpy <span class="kw">as</span> np

idx = faiss.<span class="fn">index_factory</span>(<span class="num">128</span>, <span class="str">"IVF256,PQ16"</span>)
xb = np.random.<span class="fn">randn</span>(50_000, <span class="num">128</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>)
idx.<span class="fn">train</span>(xb); idx.<span class="fn">add</span>(xb)

faiss.<span class="fn">write_index</span>(idx, <span class="str">"reviews.faiss"</span>)  <span class="cm"># serileştir</span>

<span class="cm"># ... daha sonra, farklı bir süreç / makine üzerinde ...</span>
loaded = faiss.<span class="fn">read_index</span>(<span class="str">"reviews.faiss"</span>)
<span class="fn">print</span>(f<span class="str">"loaded {loaded.ntotal} vectors"</span>)
loaded.nprobe = <span class="num">16</span>
D, I = loaded.<span class="fn">search</span>(xb[:<span class="num">5</span>], k=<span class="num">5</span>)
<span class="fn">print</span>(I)
</code></pre></div>

<p class="l-text"><strong>Kodun akışı:</strong> 1) <code>faiss.index_factory(128, "IVF256,PQ16")</code> 256 hücreli bir IVF'yi 16-baytlık PQ kodlarıyla birleştirir. 2) <code>idx.train(xb)</code> merkezleri ve PQ codebook'larını öğrenir, <code>idx.add(xb)</code> 50k kodu hücrelerine yazar. 3) <code>faiss.write_index(idx, "reviews.faiss")</code> tüm birleşik yapıyı — codebook'lar, gönderim listeleri, kodlar — tek bir ikili dosyaya serileştirir. 4) Sonra <code>faiss.read_index(...)</code> indeksi yeniden inşa eder; <code>loaded.nprobe = 16</code> üretimde ayarladığın arama profilini geri yükler. 5) <code>loaded.search(xb[:5], k=5)</code> çağrısı yeniden yüklenen indeksin vektörleri ve metadata'yı koruduğunu doğrular.</p>


<div class="calc-highlight">Üretim ipucu: embedding modelini ve FAISS indeks sürümünü birlikte sabit tut. Modeli yükselttiğin için 100M dokümanı yeniden embed etmek çok-saatlik bir iştir.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<p class="l-text">FAISS sana dört ilkel indeks ailesi (Flat, IVF, PQ, HNSW), bunları besteleyen bir fabrika mini-dili, batch verim için ihtiyaç duyduğunda GPU hızlandırma ve kalıcılık için ikili serileştirme verir. Artık herhangi bir makul korpus için bir vektör indeksi kurmak için API bilgisine sahipsin.</p>

<p class="l-text">Ders 3 <em>algoritmalara</em> yakınlaşır. HNSW neden O(log N) arama süresine ulaşır? Küçük-dünya graf özelliği katmanlı ekleme prosedüründen nasıl ortaya çıkar? IVF ne zaman HNSW'yi yener ve PQ ne zaman recall'unu mahveder? Recall-gecikme Pareto eğrisini çizeceğiz ve bir tasarım dokümanına yapıştırabileceğin bir karar akış şemasıyla bitireceğiz.</p>
</div>`
};
