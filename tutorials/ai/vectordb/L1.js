window.VECTORDB_L1 = {
en: `<p class="l-text"><strong>Your SQL database can find rows where <code>title = 'cat'</code> in microseconds — but ask it for "rows about feline pets" and it returns nothing.</strong> Traditional databases match keys, tokens, and ranges; they do not understand <em>meaning</em>. Embeddings turn text, images, and audio into dense vectors where semantic similarity becomes geometric proximity, and that single shift demands an entirely new storage and query engine: the vector database.</p>

<p class="l-text">In this opening lesson we will rebuild the problem from scratch on real review data, watch a brute-force cosine search work perfectly at 300 documents and collapse at one billion, then introduce the <strong>recall vs latency Pareto frontier</strong> that every approximate-nearest-neighbor (ANN) algorithm lives on. By the end you will know exactly when a NumPy array is enough and when you actually need FAISS, Qdrant, Pinecone, or Weaviate.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain why B-tree indexes cannot answer semantic queries and what an embedding actually is</li>
<li>Implement brute-force k-NN search with NumPy on TF-IDF vectors of real reviews</li>
<li>Compute cosine similarity and L2 distance and know when each is correct</li>
<li>Reason about memory cost: 1M x 768-dim float32 vectors = ~3 GB</li>
<li>Read a recall@k vs QPS chart and pick a target operating point</li>
<li>Decide between a NumPy array, FAISS in-process, and a managed vector DB</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Traditional Databases Cannot Answer "Find Me Something Similar"</h2>
<p class="l-text">A B-tree index in PostgreSQL or MySQL is built for <em>equality</em> and <em>range</em> queries. <code>WHERE price BETWEEN 10 AND 20</code> walks the tree in O(log n). A full-text index (<code>tsvector</code>, Lucene) extends this to token matching with stemming and inverted lists — still discrete, still keyword-bound. The query "find reviews that <em>feel like</em> a complaint about slow shipping" has no exact tokens to match.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">B-Tree Index</div><div class="card-body">O(log n) lookup on sortable scalars. Perfect for <code>id</code>, <code>price</code>, <code>created_at</code>. Fails on "similar to."</div></div>
<div class="calc-card"><div class="card-title">Inverted Index (Lucene)</div><div class="card-body">Maps tokens → doc IDs. BM25 ranks by term frequency. Misses synonyms ("car" vs "automobile") and intent.</div></div>
<div class="calc-card"><div class="card-title">Vector Index</div><div class="card-body">Maps embeddings → nearest neighbors in R^d. Captures meaning. Cost: O(n) brute-force or O(log n) approximate.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (BM25 + Vector)</div><div class="card-body">Production RAG combines both: lexical recall for rare entities + semantic recall for paraphrase. Reranks with cross-encoder.</div></div>
</div>

<div class="calc-highlight">A vector database is the index structure that makes the question <em>"which of these N vectors is closest to this query vector?"</em> answerable in milliseconds when N is in the billions.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Embeddings Recap: From Tokens to Geometry</h2>
<p class="l-text">An embedding is a learned function f: text → R^d that places semantically similar inputs close together. Modern sentence encoders (sentence-transformers, OpenAI text-embedding-3, Cohere embed-v3) output 384, 768, 1024, or 3072 dimensional vectors. The geometry is what we exploit: the cosine of the angle between two vectors approximates semantic similarity.</p>

<div class="katex-block">$$\\text{cosine}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|} \\in [-1, 1]$$</div>

<p class="l-text">For unit-normalized vectors, cosine similarity and Euclidean (L2) distance are monotonically related: <code>||u - v||^2 = 2 - 2 u·v</code>. This is why FAISS often stores normalized vectors and uses <code>IndexFlatIP</code> (inner product) instead of <code>IndexFlatL2</code> — same ranking, slightly faster.</p>

<div class="katex-block">$$\\|\\mathbf{u} - \\mathbf{v}\\|_2^2 = \\|\\mathbf{u}\\|^2 + \\|\\mathbf{v}\\|^2 - 2\\,\\mathbf{u} \\cdot \\mathbf{v}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Two unit-normalized embeddings</span>
u = np.<span class="fn">array</span>([<span class="num">0.6</span>, <span class="num">0.8</span>, <span class="num">0.0</span>])
v = np.<span class="fn">array</span>([<span class="num">0.5</span>, <span class="num">0.85</span>, <span class="num">0.15</span>])
u = u / np.linalg.<span class="fn">norm</span>(u); v = v / np.linalg.<span class="fn">norm</span>(v)

cos_sim = <span class="fn">float</span>(u @ v)
l2_dist = <span class="fn">float</span>(np.linalg.<span class="fn">norm</span>(u - v))
<span class="fn">print</span>(f<span class="str">"cosine = {cos_sim:.4f}   L2 = {l2_dist:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"identity check: 2 - 2*cos = {2 - 2*cos_sim:.4f}  ==  L2^2 = {l2_dist**2:.4f}"</span>)
</code></pre></div>

<p class="l-text">This snippet runs in your browser. The identity at the bottom is the bridge that lets every L2-only index work with cosine queries.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Brute-Force k-NN on Real Reviews</h2>
<p class="l-text">Let us actually do semantic search on the 300 customer reviews bundled with this site. We will use TF-IDF as a stand-in embedding (Pyodide cannot load sentence-transformers), build a query vector, and rank every document by cosine similarity. This is the algorithm every vector DB is approximating.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np

vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, stop_words=<span class="str">'english'</span>)
X = vec.<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>().<span class="fn">astype</span>(np.float32)
X = <span class="fn">normalize</span>(X)                          <span class="cm"># unit-norm rows</span>
<span class="fn">print</span>(f<span class="str">"corpus matrix: {X.shape}  ({X.nbytes/1024:.1f} KB)"</span>)

query = <span class="str">"shipping was very slow and the box arrived damaged"</span>
q = <span class="fn">normalize</span>(vec.<span class="fn">transform</span>([query]).<span class="fn">toarray</span>().<span class="fn">astype</span>(np.float32))[<span class="num">0</span>]

scores = X @ q                            <span class="cm"># one matmul = all cosine sims</span>
top5 = np.<span class="fn">argsort</span>(-scores)[:<span class="num">5</span>]
<span class="kw">for</span> rank, i <span class="kw">in</span> <span class="fn">enumerate</span>(top5, <span class="num">1</span>):
    <span class="fn">print</span>(f<span class="str">"{rank}. score={scores[i]:.3f}  |  {df_reviews['text'].iloc[i][:90]}"</span>)
</code></pre></div>

<p class="l-text">One <code>X @ q</code> matrix-vector product is the entire search. For 300 docs and 2000 features that is 600k multiplies — a fraction of a millisecond. Beautiful, exact, and completely unscalable.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Wall: Why Brute Force Dies at Scale</h2>
<p class="l-text">Let's do the arithmetic for a realistic production workload. Suppose you embed 1 billion product descriptions with a 768-dim sentence encoder. Each query must compute 1B dot products of dimension 768.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Storage (fp32)</div><div class="card-body">1e9 x 768 x 4 bytes = <strong>3.07 TB</strong>. Won't fit in RAM. Even fp16 = 1.5 TB.</div></div>
<div class="calc-card"><div class="card-title">FLOPs / query</div><div class="card-body">1e9 x 768 x 2 = <strong>1.5 TFLOPs</strong>. A modern CPU core delivers ~50 GFLOPs → <strong>30 seconds per query</strong>.</div></div>
<div class="calc-card"><div class="card-title">QPS target</div><div class="card-body">A search backend needs ~1000 QPS at p99 &lt; 100 ms. Brute force gives 0.03 QPS. Off by <strong>5 orders of magnitude</strong>.</div></div>
<div class="calc-card"><div class="card-title">PQ-compressed</div><div class="card-body">Same data with PQ32 codes: 1e9 x 32 bytes = <strong>32 GB</strong>. Fits on one node. 100x faster scan.</div></div>
</div>

<div class="calc-highlight">Brute force is exact but O(N x d). Approximate Nearest Neighbor (ANN) algorithms trade a small amount of recall for 100-10,000x speedups. Every production vector DB uses ANN.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Recall vs Latency Pareto Frontier</h2>
<p class="l-text">ANN algorithms are tunable. Crank a knob (e.g. <code>nprobe</code> in FAISS IVF, <code>efSearch</code> in HNSW) and you slide along a curve: more work per query → higher recall, lower QPS. The metric is <strong>recall@k</strong>: of the true top-k neighbors found by brute force, what fraction does your ANN return?</p>

<div class="katex-block">$$\\text{recall@}k = \\frac{|\\,A_k \\cap G_k\\,|}{k}$$</div>

<p class="l-text">where G_k is the ground-truth top-k from exact search and A_k is what the approximate index returned. Production targets are typically recall@10 of 0.90 - 0.99 depending on whether the downstream consumer is a re-ranker (forgiving) or end-user UI (strict).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">recall_at_k</span>(approx_idx, exact_idx, k=<span class="num">10</span>):
    inter = np.<span class="fn">intersect1d</span>(approx_idx[:k], exact_idx[:k])
    <span class="kw">return</span> <span class="fn">len</span>(inter) / k

<span class="cm"># Simulate: approx returns 8 of the true top-10</span>
ground_truth = np.<span class="fn">array</span>([<span class="num">7</span>, <span class="num">19</span>, <span class="num">42</span>, <span class="num">88</span>, <span class="num">101</span>, <span class="num">203</span>, <span class="num">211</span>, <span class="num">245</span>, <span class="num">267</span>, <span class="num">290</span>])
approximate  = np.<span class="fn">array</span>([<span class="num">7</span>, <span class="num">19</span>, <span class="num">42</span>, <span class="num">99</span>, <span class="num">101</span>, <span class="num">203</span>, <span class="num">250</span>, <span class="num">245</span>, <span class="num">267</span>, <span class="num">290</span>])
<span class="fn">print</span>(f<span class="str">"recall@10 = {recall_at_k(approximate, ground_truth, k=10):.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Recall@k demo, step by step:</strong> 1) <code>recall_at_k(approx_idx, exact_idx, k=10)</code> uses <code>np.intersect1d</code> to find the shared IDs between the approximate top-k and the ground-truth top-k, then divides by k. 2) The toy arrays simulate a search where the approximate index missed two true neighbours (88, 211) and substituted two near-misses (99, 250). 3) The print line shows <code>recall@10 = 0.80</code> — the exact metric you would compute on a held-out golden query set when tuning <code>nprobe</code> or <code>efSearch</code>.</p>


<div id="vdb-pareto" class="plotly-graph"></div>
<script>setTimeout(function(){if(window.Plotly){Plotly.newPlot('vdb-pareto',[{x:[100,500,2000,8000,30000],y:[0.62,0.78,0.89,0.96,0.995],mode:'lines+markers',line:{color:'#c8a96e',width:3},marker:{size:10},name:'IVF-PQ'},{x:[80,300,1200,5000,20000],y:[0.71,0.86,0.94,0.985,0.999],mode:'lines+markers',line:{color:'#7cc',width:3},marker:{size:10},name:'HNSW'}],{paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ddd',size:14},xaxis:{title:'QPS (log)',type:'log',gridcolor:'rgba(255,255,255,0.08)'},yaxis:{title:'recall@10',gridcolor:'rgba(255,255,255,0.08)',range:[0.55,1.01]},margin:{l:60,r:30,t:30,b:50},legend:{x:0.05,y:0.05}});}},300);</script>
<p class="l-text" style="opacity:0.78;font-size:0.9rem">HNSW typically dominates the upper-left of this plot (high recall + high QPS) but uses more memory than IVF-PQ. Pick the curve that fits your hardware budget.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Decision Tree: NumPy → FAISS → Managed Service</h2>
<p class="l-text">Not every project needs Pinecone. The right tool depends on N, query rate, write rate, and whether you need filters / multi-tenancy / persistence.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">N &lt; 10k → NumPy</div><div class="card-body">A single matmul. No dependencies. Reload from a pickle on cold start. Used in 90% of small RAG demos.</div></div>
<div class="calc-card"><div class="card-title">10k - 10M → FAISS in-proc</div><div class="card-body">Library, no server. IndexHNSW or IVF-PQ. Persist to disk with <code>faiss.write_index</code>. Single-machine.</div></div>
<div class="calc-card"><div class="card-title">10M - 1B → Qdrant / Weaviate / Milvus</div><div class="card-body">Self-hosted server. Filtering, payload, replication, snapshots. HNSW + scalar quantization. gRPC / REST.</div></div>
<div class="calc-card"><div class="card-title">1B+ or zero-ops → Pinecone / Vertex / Turbopuffer</div><div class="card-body">Managed, multi-tenant, autoscaling. You pay per vector + per query. Hides the index choice entirely.</div></div>
</div>

<div class="calc-highlight">For an NLP/RAG side project on 100k chunks, scikit-learn's <code>NearestNeighbors</code> in-memory is genuinely fine. Reach for FAISS only when memory or latency starts to hurt.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. End-to-End Search Engine in 20 Lines</h2>
<p class="l-text">Let us put it all together: build a tiny review search engine, save it, reload it, and serve queries. This is the smallest useful "vector DB" — and for many use cases it is also the largest one you will ever need.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> TinyVectorDB:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">3000</span>, stop_words=<span class="str">'english'</span>)
        <span class="kw">self</span>.nn  = <span class="kw">None</span>
        <span class="kw">self</span>.docs = <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">index</span>(<span class="kw">self</span>, docs):
        <span class="kw">self</span>.docs = <span class="fn">list</span>(docs)
        X = <span class="kw">self</span>.vec.<span class="fn">fit_transform</span>(<span class="kw">self</span>.docs)
        <span class="kw">self</span>.nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(X)

    <span class="kw">def</span> <span class="fn">search</span>(<span class="kw">self</span>, query, k=<span class="num">5</span>):
        q = <span class="kw">self</span>.vec.<span class="fn">transform</span>([query])
        dist, idx = <span class="kw">self</span>.nn.<span class="fn">kneighbors</span>(q, n_neighbors=k)
        <span class="kw">return</span> [(<span class="kw">self</span>.docs[i], <span class="num">1</span> - d) <span class="kw">for</span> d, i <span class="kw">in</span> <span class="fn">zip</span>(dist[<span class="num">0</span>], idx[<span class="num">0</span>])]

db = <span class="fn">TinyVectorDB</span>()
db.<span class="fn">index</span>(df_reviews[<span class="str">'text'</span>].<span class="fn">tolist</span>())

<span class="kw">for</span> doc, score <span class="kw">in</span> db.<span class="fn">search</span>(<span class="str">"battery dies after a few hours"</span>, k=<span class="num">3</span>):
    <span class="fn">print</span>(f<span class="str">"{score:.3f}  {doc[:80]}"</span>)
</code></pre></div>

<p class="l-text">This is a complete, production-acceptable search engine for a corpus of a few thousand documents. Sentence-transformer embeddings would replace TF-IDF; FAISS would replace <code>NearestNeighbors</code> at scale; Qdrant would add filtering and persistence. The shape of the API never changes: <code>index(docs)</code> + <code>search(query, k)</code>.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Summary &amp; What Comes Next</h2>
<p class="l-text">You now understand the <em>why</em>. Vector databases exist because semantic search reduces to nearest-neighbor lookup in R^d, and naive O(N x d) brute force breaks above a few million vectors. The Pareto curve between recall and latency is the central tradeoff, and every algorithm we will study (IVF, PQ, HNSW, scalar quantization) is a different point on that curve.</p>

<div class="calc-highlight">Lesson 2 dives into <strong>FAISS</strong> — Facebook AI's library that powers most self-hosted vector search. We will tour <code>IndexFlat</code>, <code>IndexIVF</code>, <code>IndexIVFPQ</code>, <code>IndexHNSW</code>, the factory mini-language, and GPU acceleration. Lesson 3 unpacks the algorithms themselves: how HNSW navigates a small-world graph in O(log N) and why product quantization can compress a 768-d vector into 32 bytes with 95% recall.</p>
</div>`,
tr: `<p class="l-text"><strong>SQL veritabanın <code>title = 'kedi'</code> olan satırları mikrosaniyeler içinde bulabilir — ama ona "kedigil evcil hayvanlar hakkındaki satırları" sorduğunda hiçbir şey döndürmez.</strong> Geleneksel veritabanları anahtarları, token'ları ve aralıkları eşler; <em>anlamı</em> kavramazlar. Embedding'ler metni, görüntüleri ve sesi yoğun vektörlere dönüştürür ve burada anlamsal benzerlik geometrik yakınlığa karşılık gelir. Bu tek dönüşüm tamamen yeni bir depolama ve sorgu motoru gerektirir: vektör veritabanı.</p>

<p class="l-text">Bu açılış dersinde sorunu sıfırdan gerçek yorum verisi üzerinde yeniden kuracağız, kaba kuvvet kosinüs aramasının 300 dokümanda mükemmel çalışıp 1 milyarda nasıl çöktüğünü göreceğiz, ardından her yaklaşık-en-yakın-komşu (ANN) algoritmasının üzerinde yaşadığı <strong>recall vs gecikme Pareto sınırını</strong> tanıtacağız. Sonunda NumPy dizisinin ne zaman yeterli olduğunu, ne zaman gerçekten FAISS, Qdrant, Pinecone veya Weaviate'e ihtiyaç duyduğunu tam olarak bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>B-tree indekslerinin neden anlamsal sorgulara cevap veremediğini ve embedding'in aslında ne olduğunu açıklamak</li>
<li>Gerçek yorumların TF-IDF vektörleri üzerinde NumPy ile kaba kuvvet k-NN araması uygulamak</li>
<li>Kosinüs benzerliği ile L2 uzaklığını hesaplamak ve hangisinin ne zaman doğru olduğunu bilmek</li>
<li>Bellek maliyeti üzerine düşünmek: 1M x 768 boyutlu float32 vektör = ~3 GB</li>
<li>recall@k vs QPS grafiğini okumak ve bir hedef çalışma noktası seçmek</li>
<li>NumPy dizisi, süreç-içi FAISS ve yönetilen vektör veritabanı arasında karar vermek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Geleneksel Veritabanları Neden "Bana Benzerini Bul" Sorusuna Cevap Veremez</h2>
<p class="l-text">PostgreSQL veya MySQL'deki bir B-tree indeksi <em>eşitlik</em> ve <em>aralık</em> sorguları için kuruludur. <code>WHERE price BETWEEN 10 AND 20</code> ağacı O(log n) sürede dolaşır. Tam metin indeksi (<code>tsvector</code>, Lucene) bunu kök bulma ve ters listelerle token eşlemeye genişletir — yine ayrık, yine anahtar kelimeye bağlı. "Yavaş kargo şikayetine <em>benzeyen</em> yorumları bul" sorgusunun eşleşecek kesin token'ı yoktur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">B-Tree İndeks</div><div class="card-body">Sıralanabilir skalerler üzerinde O(log n) arama. <code>id</code>, <code>price</code>, <code>created_at</code> için mükemmel. "Benzer" sorgularında başarısız.</div></div>
<div class="calc-card"><div class="card-title">Ters İndeks (Lucene)</div><div class="card-body">Token'ları → doküman ID'lerine eşler. BM25 terim sıklığına göre sıralar. Eş anlamlıları ("car" vs "automobile") ve niyeti kaçırır.</div></div>
<div class="calc-card"><div class="card-title">Vektör İndeks</div><div class="card-body">Embedding'leri → R^d içindeki en yakın komşulara eşler. Anlamı yakalar. Maliyet: kaba kuvvetle O(N), yaklaşıkla O(log n).</div></div>
<div class="calc-card"><div class="card-title">Hibrit (BM25 + Vektör)</div><div class="card-body">Üretim RAG ikisini birleştirir: nadir varlıklar için sözcüksel recall + ifade değişikliği için anlamsal recall. Cross-encoder ile yeniden sıralar.</div></div>
</div>

<div class="calc-highlight">Vektör veritabanı, <em>"bu N vektörden hangisi sorgu vektörüne en yakın?"</em> sorusunu N milyarlarca olduğunda bile milisaniyelerde cevaplanabilir kılan indeks yapısıdır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Embedding Tekrarı: Token'lardan Geometriye</h2>
<p class="l-text">Embedding, anlamsal olarak benzer girdileri birbirine yakın yerleştiren öğrenilmiş bir f: metin → R^d fonksiyonudur. Modern cümle kodlayıcıları (sentence-transformers, OpenAI text-embedding-3, Cohere embed-v3) 384, 768, 1024 veya 3072 boyutlu vektörler üretir. Sömürdüğümüz şey geometridir: iki vektör arasındaki açının kosinüsü anlamsal benzerliğe yaklaşır.</p>

<div class="katex-block">$$\\text{cosine}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\|\\,\\|\\mathbf{v}\\|} \\in [-1, 1]$$</div>

<p class="l-text">Birim normalize edilmiş vektörler için kosinüs benzerliği ile Öklidyen (L2) uzaklığı monoton ilişkilidir: <code>||u - v||^2 = 2 - 2 u·v</code>. Bu yüzden FAISS genellikle normalize vektörleri saklar ve <code>IndexFlatL2</code> yerine <code>IndexFlatIP</code> (iç çarpım) kullanır — aynı sıralama, biraz daha hızlı.</p>

<div class="katex-block">$$\\|\\mathbf{u} - \\mathbf{v}\\|_2^2 = \\|\\mathbf{u}\\|^2 + \\|\\mathbf{v}\\|^2 - 2\\,\\mathbf{u} \\cdot \\mathbf{v}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Iki birim-normalize edilmis embedding</span>
u = np.<span class="fn">array</span>([<span class="num">0.6</span>, <span class="num">0.8</span>, <span class="num">0.0</span>])
v = np.<span class="fn">array</span>([<span class="num">0.5</span>, <span class="num">0.85</span>, <span class="num">0.15</span>])
u = u / np.linalg.<span class="fn">norm</span>(u); v = v / np.linalg.<span class="fn">norm</span>(v)

cos_sim = <span class="fn">float</span>(u @ v)
l2_dist = <span class="fn">float</span>(np.linalg.<span class="fn">norm</span>(u - v))
<span class="fn">print</span>(f<span class="str">"cosine = {cos_sim:.4f}   L2 = {l2_dist:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"identity check: 2 - 2*cos = {2 - 2*cos_sim:.4f}  ==  L2^2 = {l2_dist**2:.4f}"</span>)
</code></pre></div>

<p class="l-text">Bu kod parçası tarayıcında çalışır. Aşağıdaki özdeşlik, her L2-yalnızca indeksin kosinüs sorgularıyla çalışmasını sağlayan köprüdür.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gerçek Yorumlar Üzerinde Kaba Kuvvet k-NN</h2>
<p class="l-text">Bu siteyle birlikte gelen 300 müşteri yorumu üzerinde gerçekten anlamsal arama yapalım. Yerine TF-IDF embedding olarak kullanacağız (Pyodide sentence-transformers yükleyemiyor), bir sorgu vektörü oluşturacağız ve her dokümanı kosinüs benzerliğine göre sıralayacağız. Bu, her vektör veritabanının yaklaşık olarak yapmaya çalıştığı algoritmadır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> normalize
<span class="kw">import</span> numpy <span class="kw">as</span> np

vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, stop_words=<span class="str">'english'</span>)
X = vec.<span class="fn">fit_transform</span>(df_reviews[<span class="str">'text'</span>]).<span class="fn">toarray</span>().<span class="fn">astype</span>(np.float32)
X = <span class="fn">normalize</span>(X)                          <span class="cm"># birim-norm satirlar</span>
<span class="fn">print</span>(f<span class="str">"corpus matrix: {X.shape}  ({X.nbytes/1024:.1f} KB)"</span>)

query = <span class="str">"shipping was very slow and the box arrived damaged"</span>
q = <span class="fn">normalize</span>(vec.<span class="fn">transform</span>([query]).<span class="fn">toarray</span>().<span class="fn">astype</span>(np.float32))[<span class="num">0</span>]

scores = X @ q                            <span class="cm"># tek matmul = tum kosinus benzerlikleri</span>
top5 = np.<span class="fn">argsort</span>(-scores)[:<span class="num">5</span>]
<span class="kw">for</span> rank, i <span class="kw">in</span> <span class="fn">enumerate</span>(top5, <span class="num">1</span>):
    <span class="fn">print</span>(f<span class="str">"{rank}. score={scores[i]:.3f}  |  {df_reviews['text'].iloc[i][:90]}"</span>)
</code></pre></div>

<p class="l-text">Tek bir <code>X @ q</code> matris-vektör çarpımı tüm aramadır. 300 doküman ve 2000 özellik için bu 600 bin çarpma — bir milisaniyenin küçük bir kısmı. Güzel, kesin ve tamamen ölçeklenemez.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Duvar: Kaba Kuvvet Ölçekte Neden Ölür</h2>
<p class="l-text">Gerçekçi bir üretim iş yükü için aritmetiği yapalım. Diyelim ki 1 milyar ürün açıklamasını 768 boyutlu bir cümle kodlayıcısıyla embed ettin. Her sorgunun 768 boyutta 1 milyar iç çarpım hesaplaması gerekir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Depolama (fp32)</div><div class="card-body">1e9 x 768 x 4 bayt = <strong>3.07 TB</strong>. RAM'e sığmaz. Hatta fp16 = 1.5 TB.</div></div>
<div class="calc-card"><div class="card-title">FLOP / sorgu</div><div class="card-body">1e9 x 768 x 2 = <strong>1.5 TFLOP</strong>. Modern bir CPU çekirdeği ~50 GFLOP sağlar → <strong>sorgu başına 30 saniye</strong>.</div></div>
<div class="calc-card"><div class="card-title">QPS hedefi</div><div class="card-body">Bir arama backend'i p99 &lt; 100 ms'de ~1000 QPS'ye ihtiyaç duyar. Kaba kuvvet 0.03 QPS verir. <strong>5 büyüklük mertebesi</strong> sapma.</div></div>
<div class="calc-card"><div class="card-title">PQ-sıkıştırılmış</div><div class="card-body">Aynı veri PQ32 kodlarıyla: 1e9 x 32 bayt = <strong>32 GB</strong>. Tek bir sunucuya sığar. 100x daha hızlı tarama.</div></div>
</div>

<div class="calc-highlight">Kaba kuvvet kesindir ama O(N x d). Yaklaşık En Yakın Komşu (ANN) algoritmaları küçük miktarda recall'u 100-10000 katı hızlanma ile takas eder. Her üretim vektör veritabanı ANN kullanır.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Recall vs Gecikme Pareto Sınırı</h2>
<p class="l-text">ANN algoritmaları ayarlanabilir. Bir düğmeyi çevir (örneğin FAISS IVF'de <code>nprobe</code>, HNSW'de <code>efSearch</code>) ve bir eğri boyunca kayarsın: sorgu başına daha çok iş → daha yüksek recall, daha düşük QPS. Metrik <strong>recall@k</strong>: kaba kuvvetle bulunan gerçek top-k komşulardan, ANN'in hangisini döndürdüğünü ölçer.</p>

<div class="katex-block">$$\\text{recall@}k = \\frac{|\\,A_k \\cap G_k\\,|}{k}$$</div>

<p class="l-text">Burada G_k kesin aramadan gelen ground-truth top-k'dir ve A_k yaklaşık indeksin döndürdüğüdür. Üretim hedefleri tipik olarak recall@10 = 0.90 - 0.99 arasındadır; bağımlı tüketicinin re-ranker (esnek) ya da son-kullanıcı UI (katı) olmasına bağlı olarak değişir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">recall_at_k</span>(approx_idx, exact_idx, k=<span class="num">10</span>):
    inter = np.<span class="fn">intersect1d</span>(approx_idx[:k], exact_idx[:k])
    <span class="kw">return</span> <span class="fn">len</span>(inter) / k

<span class="cm"># Simülasyon: yaklaşık gerçek top-10'dan 8 döndürür</span>
ground_truth = np.<span class="fn">array</span>([<span class="num">7</span>, <span class="num">19</span>, <span class="num">42</span>, <span class="num">88</span>, <span class="num">101</span>, <span class="num">203</span>, <span class="num">211</span>, <span class="num">245</span>, <span class="num">267</span>, <span class="num">290</span>])
approximate  = np.<span class="fn">array</span>([<span class="num">7</span>, <span class="num">19</span>, <span class="num">42</span>, <span class="num">99</span>, <span class="num">101</span>, <span class="num">203</span>, <span class="num">250</span>, <span class="num">245</span>, <span class="num">267</span>, <span class="num">290</span>])
<span class="fn">print</span>(f<span class="str">"recall@10 = {recall_at_k(approximate, ground_truth, k=10):.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Recall@k demosu, adım adım:</strong> 1) <code>recall_at_k(approx_idx, exact_idx, k=10)</code> yaklaşık top-k ile ground-truth top-k arasındaki ortak kimlikleri <code>np.intersect1d</code> ile bulur ve k'ye böler. 2) Oyuncak diziler, yaklaşık indeksin iki gerçek komşuyu (88, 211) ıskaladığı ve iki kıl payı yanlışı (99, 250) koyduğu bir aramayı simüle eder. 3) Print satırı <code>recall@10 = 0.80</code> gösterir — <code>nprobe</code> ya da <code>efSearch</code>'ü ayarlarken tutulan bir altın sorgu kümesi üzerinde hesaplayacağın metriğin aynısı.</p>


<div id="vdb-pareto-tr" class="plotly-graph"></div>
<script>setTimeout(function(){if(window.Plotly){Plotly.newPlot('vdb-pareto-tr',[{x:[100,500,2000,8000,30000],y:[0.62,0.78,0.89,0.96,0.995],mode:'lines+markers',line:{color:'#c8a96e',width:3},marker:{size:10},name:'IVF-PQ'},{x:[80,300,1200,5000,20000],y:[0.71,0.86,0.94,0.985,0.999],mode:'lines+markers',line:{color:'#7cc',width:3},marker:{size:10},name:'HNSW'}],{paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:'#ddd',size:14},xaxis:{title:'QPS (log)',type:'log',gridcolor:'rgba(255,255,255,0.08)'},yaxis:{title:'recall@10',gridcolor:'rgba(255,255,255,0.08)',range:[0.55,1.01]},margin:{l:60,r:30,t:30,b:50},legend:{x:0.05,y:0.05}});}},300);</script>
<p class="l-text" style="opacity:0.78;font-size:0.9rem">HNSW tipik olarak bu grafiğin sol üst köşesine (yüksek recall + yüksek QPS) hâkimdir ama IVF-PQ'dan daha çok bellek kullanır. Donanım bütçenize uygun eğriyi seçin.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Karar Ağacı: NumPy → FAISS → Yönetilen Servis</h2>
<p class="l-text">Her proje Pinecone'a ihtiyaç duymaz. Doğru araç N'e, sorgu hızına, yazma hızına ve filtreler / çoklu kiracılık / kalıcılığa ihtiyaç duyup duymamana bağlıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">N &lt; 10k → NumPy</div><div class="card-body">Tek bir matmul. Bağımlılık yok. Soğuk başlatmada pickle'dan yeniden yükle. Küçük RAG demolarının %90'ında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">10k - 10M → süreç-içi FAISS</div><div class="card-body">Kütüphane, sunucu yok. IndexHNSW veya IVF-PQ. <code>faiss.write_index</code> ile diske kalıcı kıl. Tek makine.</div></div>
<div class="calc-card"><div class="card-title">10M - 1B → Qdrant / Weaviate / Milvus</div><div class="card-body">Self-hosted sunucu. Filtreleme, payload, replikasyon, snapshot'lar. HNSW + skaler nicemleme. gRPC / REST.</div></div>
<div class="calc-card"><div class="card-title">1B+ veya sıfır-ops → Pinecone / Vertex / Turbopuffer</div><div class="card-body">Yönetilen, çok-kiracılı, otomatik ölçekli. Vektör başına + sorgu başına ödersin. İndeks seçimini tamamen gizler.</div></div>
</div>

<div class="calc-highlight">100k chunk üzerinde bir NLP/RAG yan projesi için scikit-learn'in <code>NearestNeighbors</code> bellek-içi gerçekten yeterli. Sadece bellek veya gecikme acıtmaya başladığında FAISS'e uzan.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. 20 Satırda Uçtan Uca Arama Motoru</h2>
<p class="l-text">Hepsini bir araya getirelim: küçük bir yorum arama motoru kuralım, kaydedelim, yeniden yükleyelim ve sorguları sunalım. Bu en küçük kullanışlı "vektör veritabanıdır" — ve birçok kullanım durumu için ihtiyaç duyacağın en büyüğü de budur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> TinyVectorDB:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">3000</span>, stop_words=<span class="str">'english'</span>)
        <span class="kw">self</span>.nn  = <span class="kw">None</span>
        <span class="kw">self</span>.docs = <span class="kw">None</span>

    <span class="kw">def</span> <span class="fn">index</span>(<span class="kw">self</span>, docs):
        <span class="kw">self</span>.docs = <span class="fn">list</span>(docs)
        X = <span class="kw">self</span>.vec.<span class="fn">fit_transform</span>(<span class="kw">self</span>.docs)
        <span class="kw">self</span>.nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(X)

    <span class="kw">def</span> <span class="fn">search</span>(<span class="kw">self</span>, query, k=<span class="num">5</span>):
        q = <span class="kw">self</span>.vec.<span class="fn">transform</span>([query])
        dist, idx = <span class="kw">self</span>.nn.<span class="fn">kneighbors</span>(q, n_neighbors=k)
        <span class="kw">return</span> [(<span class="kw">self</span>.docs[i], <span class="num">1</span> - d) <span class="kw">for</span> d, i <span class="kw">in</span> <span class="fn">zip</span>(dist[<span class="num">0</span>], idx[<span class="num">0</span>])]

db = <span class="fn">TinyVectorDB</span>()
db.<span class="fn">index</span>(df_reviews[<span class="str">'text'</span>].<span class="fn">tolist</span>())

<span class="kw">for</span> doc, score <span class="kw">in</span> db.<span class="fn">search</span>(<span class="str">"battery dies after a few hours"</span>, k=<span class="num">3</span>):
    <span class="fn">print</span>(f<span class="str">"{score:.3f}  {doc[:80]}"</span>)
</code></pre></div>

<p class="l-text">Bu, birkaç bin dokümanlık bir korpus için tam, üretime uygun bir arama motorudur. Sentence-transformer embedding'leri TF-IDF'in yerini alırdı; ölçekte FAISS <code>NearestNeighbors</code>'ın yerini alırdı; Qdrant filtreleme ve kalıcılık eklerdi. API'nin şekli asla değişmez: <code>index(docs)</code> + <code>search(query, k)</code>.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradaki</h2>
<p class="l-text">Artık <em>nedeni</em> anlıyorsun. Vektör veritabanları var çünkü anlamsal arama R^d'de en yakın komşu aramasına indirgenir ve naif O(N x d) kaba kuvvet birkaç milyon vektörden sonra bozulur. Recall ile gecikme arasındaki Pareto eğrisi merkezi takastır ve çalışacağımız her algoritma (IVF, PQ, HNSW, skaler nicemleme) bu eğri üzerinde farklı bir noktadır.</p>

<div class="calc-highlight">Ders 2 <strong>FAISS</strong>'e dalar — Facebook AI'ın çoğu self-hosted vektör aramasını çalıştıran kütüphanesi. <code>IndexFlat</code>, <code>IndexIVF</code>, <code>IndexIVFPQ</code>, <code>IndexHNSW</code>, fabrika mini-dilini ve GPU hızlandırmayı turlayacağız. Ders 3 algoritmaların kendisini açar: HNSW küçük-dünya grafiğinde nasıl O(log N) navigasyon yapar ve product quantization 768 boyutlu bir vektörü %95 recall ile 32 bayta nasıl sıkıştırır.</p>
</div>`
};
