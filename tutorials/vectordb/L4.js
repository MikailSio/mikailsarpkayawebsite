window.VECTORDB_L4 = {
en: `<p class="l-text"><strong>Choosing a vector database in 2026 feels like choosing a Linux distro in 2005</strong> — every option claims to be the best, the benchmarks are gamed, and your real workload looks nothing like the marketing slides. The dirty secret is that for &lt;100k vectors, an in-memory NumPy array beats every "real" vector DB on latency, and for &gt;100M vectors, the differences between Pinecone, Milvus, and Weaviate shrink to within 2× on most metrics. The interesting decisions live in the messy middle.</p>

<p class="l-text">This lesson is a buyer's guide. We'll walk through seven serious options — Pinecone, Weaviate, Chroma, Qdrant, pgvector, Milvus, LanceDB — covering pricing ($/M vectors/month), latency p99, hybrid search support, filtering ergonomics, and the operational footguns nobody mentions until you're paged at 3am. By the end you'll have a decision tree that maps your constraints (scale, budget, team skill, existing stack) to a concrete recommendation.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The seven major vector DBs and their architectural DNA (managed vs OSS, Rust vs Go vs Python)</li>
<li>Real cost math: $/million vectors/month for Pinecone, Weaviate Cloud, Qdrant Cloud, pgvector self-hosted</li>
<li>Hybrid search and metadata filtering capability matrix — who supports what at what speed</li>
<li>The decision tree: scale, budget, team, stack constraints → concrete pick</li>
<li>How to prototype the same workload across three DBs in &lt;200 lines of Python</li>
<li>Operational gotchas: Pinecone pod migration, Milvus etcd dependency, pgvector recall cliffs</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Seven Contenders — One-Line Pitches</h2>

<p class="l-text">Before we dive into matrices, here's how each project would describe itself if it had ten seconds in an elevator. Memorize these — they map cleanly onto when you should reach for each tool.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pinecone</div><div class="card-body">Fully managed serverless. You hand over a credit card and never think about infrastructure. Closed source, AWS-only origin (now multi-cloud). Default choice for teams without DevOps capacity.</div></div>
<div class="calc-card"><div class="card-title">Weaviate</div><div class="card-body">Open-source, modular (vectorizer modules, generative modules). Built-in hybrid search via BM25 + dense. Strong GraphQL API. Cloud or self-host. Powers many enterprise RAG stacks.</div></div>
<div class="calc-card"><div class="card-title">Chroma</div><div class="card-body">Lightweight, Python-first, embedded. Designed for prototyping and small production. <code>pip install chromadb</code> and you're indexing in three lines. Persists to DuckDB+Parquet.</div></div>
<div class="calc-card"><div class="card-title">Qdrant</div><div class="card-body">Rust-based, single binary, fantastic filtering performance (payload indexes). Self-host or Qdrant Cloud. Best-in-class for "filter then search" workloads (e.g., "vectors WHERE user_id = X").</div></div>
<div class="calc-card"><div class="card-title">pgvector</div><div class="card-body">Postgres extension. If you already run Postgres, you already have a vector DB. Free, transactional, joins with relational data. HNSW + IVFFlat indexes. Recall drops at scale &gt;10M vectors.</div></div>
<div class="calc-card"><div class="card-title">Milvus</div><div class="card-body">Cloud-native, designed for billions of vectors. Decoupled compute/storage on Kubernetes. Heavy ops footprint (etcd, Pulsar, MinIO). Pick this when you genuinely need to scale to 10B+ vectors.</div></div>
<div class="calc-card"><div class="card-title">LanceDB</div><div class="card-body">Columnar (Lance format on top of Parquet). Embedded or cloud. Excellent for ML pipelines that already live in Arrow/Parquet. Zero-copy reads, versioned datasets, time-travel queries.</div></div>
</div>

<div class="calc-highlight">⚡ The honest first question is not "which DB?" but "do I even need a DB?" For &lt;50k vectors, NumPy + a pickled FAISS index in S3 outperforms every option below on latency and costs zero. Vector DBs earn their keep when you need filtering, multi-tenancy, online updates, or distributed scale.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Capability Matrix</h2>

<p class="l-text">Here's the feature comparison that actually matters for production decisions. Hybrid = first-class BM25+dense. Filtering = post-filter speed (some DBs slow to a crawl when you add WHERE clauses). Multi-tenant = namespace/collection isolation without paying per-tenant overhead.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hybrid Search (BM25 + Dense)</div><div class="card-body">Native: Weaviate, Qdrant, Milvus, LanceDB. Add-on / DIY: Pinecone (sparse-dense vectors), pgvector (paradedb extension or manual). Chroma: limited.</div></div>
<div class="calc-card"><div class="card-title">Metadata Filtering Speed</div><div class="card-body">Best: Qdrant (payload indexes, sub-ms even with WHERE), Weaviate. Good: Pinecone (with caveats on pod type), Milvus. Slow at scale: pgvector (planner can ignore HNSW), Chroma.</div></div>
<div class="calc-card"><div class="card-title">Max Practical Scale (single tenant)</div><div class="card-body">Pinecone, Milvus: 10B+ vectors. Weaviate, Qdrant: 1B comfortably. LanceDB: 100M+ depending on disk. pgvector: 10-50M before recall cliffs. Chroma: 10M is the sweet spot.</div></div>
<div class="calc-card"><div class="card-title">Multi-Tenancy Model</div><div class="card-body">Namespaces (cheap): Pinecone, Weaviate (multi-tenant collections), Qdrant. Per-collection (expensive at scale): Chroma, LanceDB. pgvector: schema-per-tenant.</div></div>
<div class="calc-card"><div class="card-title">Self-Host Option</div><div class="card-body">Yes (true OSS): Weaviate, Chroma, Qdrant, pgvector, Milvus, LanceDB. No: Pinecone (managed only).</div></div>
<div class="calc-card"><div class="card-title">Update Latency (insert → searchable)</div><div class="card-body">Real-time: Qdrant, Weaviate, Pinecone, pgvector. Batch-leaning: Milvus (segment compaction), LanceDB (versioned commits). Chroma: real-time but slower at scale.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Pricing — The Real Numbers</h2>

<p class="l-text">All prices below are for OpenAI's <code>text-embedding-3-small</code> dimensionality (1536 dims, ~6 KB per vector with metadata). Numbers are early-2026 list prices; assume ±20% by the time you read this. The cheapest option is almost always "self-host on a beefy box you already have," but that has hidden engineering cost.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pinecone Serverless</div><div class="card-body">~$0.33/GB-month storage + $4 per million write units + $16 per million read units. For 1M vectors with 100k queries/day: roughly $50-90/month. No idle cost.</div></div>
<div class="calc-card"><div class="card-title">Pinecone Pods (legacy s1.x1)</div><div class="card-body">$0.096/hour = ~$70/month per pod. One s1.x1 holds ~5M 1536-dim vectors. Predictable, but you pay 24/7 even when idle.</div></div>
<div class="calc-card"><div class="card-title">Weaviate Cloud</div><div class="card-body">Standard SLA tier: ~$25/month per 1M vectors at 1536 dims. Enterprise tier 2-3× that. Self-hosted: free (you pay AWS/GCP).</div></div>
<div class="calc-card"><div class="card-title">Qdrant Cloud</div><div class="card-body">~$0.014/hour per GB RAM. A 4GB cluster holds ~600k vectors at 1536d, costs ~$40/month. Self-hosted single binary: free, runs on a $20 VPS for &lt;1M vectors.</div></div>
<div class="calc-card"><div class="card-title">pgvector (self-host)</div><div class="card-body">Effectively free if you already pay for Postgres. Adds ~25% RAM overhead per indexed vector for HNSW. Managed (Supabase, Neon, RDS): standard Postgres pricing.</div></div>
<div class="calc-card"><div class="card-title">Milvus / Zilliz Cloud</div><div class="card-body">Zilliz serverless: ~$0.30 per million vectors stored + read units. Dedicated: starts ~$100/month. Self-hosted Milvus: free but needs Kubernetes + etcd + Pulsar = real ops cost.</div></div>
<div class="calc-card"><div class="card-title">Chroma / LanceDB</div><div class="card-body">Self-hosted/embedded: free. Chroma Cloud (beta in 2026): pricing TBD, expected similar to Qdrant Cloud. LanceDB Cloud: ~$0.20/GB/month storage + serverless query units.</div></div>
</div>

<div class="calc-highlight">💸 Rule of thumb for 1M vectors @ 1536d, moderate query load: Pinecone Serverless ~$70/mo · Weaviate Cloud ~$25/mo · Qdrant Cloud ~$40/mo · pgvector on existing Postgres ~$0/mo · self-hosted Qdrant on a $20 VPS ~$20/mo. Engineering time is usually the bigger cost.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pinecone — The Managed Default</h2>

<p class="l-text">Pinecone is what you reach for when you want to forget vectors exist as an infrastructure concern. The API is small, the SDK is clean, and the serverless tier auto-scales. Trade-offs: closed source, vendor lock-in, and the pod-to-serverless migration in 2024-2025 forced many users to rewrite their cost models.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pinecone <span class="kw">import</span> Pinecone, ServerlessSpec

pc = <span class="fn">Pinecone</span>(api_key=<span class="str">"YOUR_KEY"</span>)

<span class="cm"># Create a serverless index (one-time)</span>
pc.<span class="fn">create_index</span>(
    name=<span class="str">"docs"</span>,
    dimension=<span class="num">1536</span>,
    metric=<span class="str">"cosine"</span>,
    spec=<span class="fn">ServerlessSpec</span>(cloud=<span class="str">"aws"</span>, region=<span class="str">"us-east-1"</span>)
)

index = pc.<span class="fn">Index</span>(<span class="str">"docs"</span>)

<span class="cm"># Upsert with metadata</span>
index.<span class="fn">upsert</span>(vectors=[
    (<span class="str">"doc1"</span>, [<span class="num">0.1</span>, <span class="num">0.2</span>, ...], {<span class="str">"author"</span>: <span class="str">"alice"</span>, <span class="str">"year"</span>: <span class="num">2025</span>}),
    (<span class="str">"doc2"</span>, [<span class="num">0.3</span>, <span class="num">0.4</span>, ...], {<span class="str">"author"</span>: <span class="str">"bob"</span>,   <span class="str">"year"</span>: <span class="num">2024</span>}),
])

<span class="cm"># Filtered query</span>
results = index.<span class="fn">query</span>(
    vector=[<span class="num">0.15</span>, <span class="num">0.25</span>, ...],
    top_k=<span class="num">5</span>,
    <span class="fn">filter</span>={<span class="str">"year"</span>: {<span class="str">"$gte"</span>: <span class="num">2025</span>}},
    include_metadata=<span class="kw">True</span>
)
<span class="kw">for</span> <span class="kw">match</span> <span class="kw">in</span> results.matches:
    <span class="fn">print</span>(<span class="kw">match</span>.id, <span class="kw">match</span>.score, <span class="kw">match</span>.metadata)
</code></pre></div>

<p class="l-text">Two API calls — upsert and query — handle 90% of use cases. The <code>filter</code> parameter uses MongoDB-style operators (<code>$gte</code>, <code>$in</code>, <code>$and</code>). Pinecone runs the filter inside the index, not as a post-filter, so latency stays low even at high cardinality.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same API surface, implemented as a dict-of-vectors with NumPy cosine and Python-side filtering. Demonstrates exactly what Pinecone does behind the curtain at small scale.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> MiniPinecone:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, dim, metric=<span class="str">"cosine"</span>):
        <span class="kw">self</span>.vecs, <span class="kw">self</span>.meta = {}, {}
    <span class="kw">def</span> <span class="fn">upsert</span>(<span class="kw">self</span>, items):
        <span class="kw">for</span> id_, v, m <span class="kw">in</span> items:
            <span class="kw">self</span>.vecs[id_] = np.<span class="fn">asarray</span>(v, dtype=np.float32)
            <span class="kw">self</span>.meta[id_] = m
    <span class="kw">def</span> <span class="fn">query</span>(<span class="kw">self</span>, vector, top_k=<span class="num">5</span>, flt=<span class="kw">None</span>):
        q = np.<span class="fn">asarray</span>(vector, dtype=np.float32)
        q /= np.linalg.<span class="fn">norm</span>(q) + <span class="num">1e-9</span>
        scored = []
        <span class="kw">for</span> id_, v <span class="kw">in</span> <span class="kw">self</span>.vecs.<span class="fn">items</span>():
            <span class="kw">if</span> flt <span class="kw">and</span> <span class="kw">not</span> <span class="fn">all</span>(<span class="kw">self</span>.meta[id_].<span class="fn">get</span>(k) == val <span class="kw">for</span> k, val <span class="kw">in</span> flt.<span class="fn">items</span>()):
                <span class="kw">continue</span>
            sim = <span class="fn">float</span>(v @ q / (np.linalg.<span class="fn">norm</span>(v) + <span class="num">1e-9</span>))
            scored.<span class="fn">append</span>((id_, sim, <span class="kw">self</span>.meta[id_]))
        <span class="kw">return</span> <span class="fn">sorted</span>(scored, key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:top_k]

idx = <span class="fn">MiniPinecone</span>(dim=<span class="num">4</span>)
idx.<span class="fn">upsert</span>([(<span class="str">"d1"</span>, [<span class="num">0.1</span>,<span class="num">0.2</span>,<span class="num">0.3</span>,<span class="num">0.4</span>], {<span class="str">"year"</span>: <span class="num">2025</span>}),
            (<span class="str">"d2"</span>, [<span class="num">0.4</span>,<span class="num">0.3</span>,<span class="num">0.2</span>,<span class="num">0.1</span>], {<span class="str">"year"</span>: <span class="num">2024</span>}),
            (<span class="str">"d3"</span>, [<span class="num">0.2</span>,<span class="num">0.3</span>,<span class="num">0.4</span>,<span class="num">0.5</span>], {<span class="str">"year"</span>: <span class="num">2025</span>})])
<span class="kw">for</span> id_, score, meta <span class="kw">in</span> idx.<span class="fn">query</span>([<span class="num">0.2</span>,<span class="num">0.3</span>,<span class="num">0.4</span>,<span class="num">0.5</span>], top_k=<span class="num">2</span>, flt={<span class="str">"year"</span>: <span class="num">2025</span>}):
    <span class="fn">print</span>(id_, <span class="fn">round</span>(score, <span class="num">3</span>), meta)
</code></pre></div>
</div>

<p class="l-text"><strong>MiniPinecone trace:</strong> 1) <code>MiniPinecone(dim=4)</code> creates two dicts — <code>self.vecs</code> and <code>self.meta</code> — mirroring how a real index stores vectors keyed by ID plus parallel metadata. 2) <code>upsert([(id, vec, meta), ...])</code> normalises each vector with <code>np.asarray(..., dtype=float32)</code> and writes both maps. 3) <code>query(vector, top_k, flt)</code> L2-normalises <code>q</code>, then iterates every stored vector — skipping any whose metadata doesn't match every <code>k=v</code> in the filter — computes cosine via <code>v @ q / (||v||·||q||)</code> and returns the top-k sorted by score. 4) The driver calls <code>upsert</code> with three docs and runs a filtered query for <code>year=2025</code>, mirroring Pinecone's MongoDB-style filter API.</p>


</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Qdrant — When Filtering Is the Hot Path</h2>

<p class="l-text">Qdrant's superpower is payload filtering. If your queries always look like "find similar documents WHERE user_id = X AND lang = 'tr'", Qdrant's payload indexes mean the filter happens inside the HNSW traversal, not after. Other DBs do post-filtering (search 1000, filter to 10) which collapses recall when filters are selective.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">from</span> qdrant_client.models <span class="kw">import</span> Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

client = <span class="fn">QdrantClient</span>(url=<span class="str">"http://localhost:6333"</span>)

client.<span class="fn">recreate_collection</span>(
    collection_name=<span class="str">"docs"</span>,
    vectors_config=<span class="fn">VectorParams</span>(size=<span class="num">1536</span>, distance=Distance.COSINE),
)

<span class="cm"># Payload index makes WHERE filters fast</span>
client.<span class="fn">create_payload_index</span>(<span class="str">"docs"</span>, field_name=<span class="str">"user_id"</span>, field_schema=<span class="str">"keyword"</span>)

client.<span class="fn">upsert</span>(<span class="str">"docs"</span>, points=[
    <span class="fn">PointStruct</span>(id=<span class="num">1</span>, vector=[<span class="num">0.1</span>]*<span class="num">1536</span>, payload={<span class="str">"user_id"</span>: <span class="str">"alice"</span>, <span class="str">"lang"</span>: <span class="str">"en"</span>}),
    <span class="fn">PointStruct</span>(id=<span class="num">2</span>, vector=[<span class="num">0.2</span>]*<span class="num">1536</span>, payload={<span class="str">"user_id"</span>: <span class="str">"bob"</span>,   <span class="str">"lang"</span>: <span class="str">"tr"</span>}),
])

<span class="cm"># Filter happens inside the HNSW search, not after</span>
hits = client.<span class="fn">search</span>(
    collection_name=<span class="str">"docs"</span>,
    query_vector=[<span class="num">0.15</span>]*<span class="num">1536</span>,
    query_filter=<span class="fn">Filter</span>(must=[
        <span class="fn">FieldCondition</span>(key=<span class="str">"user_id"</span>, <span class="kw">match</span>=<span class="fn">MatchValue</span>(value=<span class="str">"alice"</span>))
    ]),
    limit=<span class="num">5</span>,
)
<span class="kw">for</span> h <span class="kw">in</span> hits: <span class="fn">print</span>(h.id, h.score, h.payload)
</code></pre></div>

<p class="l-text"><strong>Qdrant trace:</strong> 1) <code>QdrantClient(url="http://localhost:6333")</code> opens a connection to the Qdrant server. 2) <code>recreate_collection("docs", VectorParams(size=1536, distance=COSINE))</code> defines a fresh 1536-dim cosine collection. 3) <code>create_payload_index("docs", field_name="user_id", field_schema="keyword")</code> is the critical step — without it, filters become post-filters and recall collapses. 4) <code>upsert</code> writes two <code>PointStruct</code> records with vectors and payloads. 5) <code>client.search(...)</code> passes a <code>Filter(must=[FieldCondition(...MatchValue("alice"))])</code>; because of the payload index, Qdrant evaluates the filter inside the HNSW traversal and returns only matching points.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">We simulate Qdrant's payload-filtered search using a NumPy boolean mask BEFORE knn, which is exactly the in-index filtering Qdrant does (vs post-filter that other DBs do).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
N, D = <span class="num">1000</span>, <span class="num">32</span>
vectors = rng.<span class="fn">standard_normal</span>((N, D)).<span class="fn">astype</span>(np.float32)
vectors /= np.linalg.<span class="fn">norm</span>(vectors, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>
user_ids = rng.<span class="fn">choice</span>([<span class="str">"alice"</span>, <span class="str">"bob"</span>, <span class="str">"carol"</span>], size=N)
langs    = rng.<span class="fn">choice</span>([<span class="str">"en"</span>, <span class="str">"tr"</span>, <span class="str">"de"</span>], size=N)

<span class="kw">def</span> <span class="fn">qdrant_style_search</span>(query, where_user=<span class="kw">None</span>, where_lang=<span class="kw">None</span>, k=<span class="num">5</span>):
    mask = np.<span class="fn">ones</span>(N, dtype=<span class="fn">bool</span>)
    <span class="kw">if</span> where_user: mask &amp;= (user_ids == where_user)
    <span class="kw">if</span> where_lang: mask &amp;= (langs    == where_lang)
    candidates = np.<span class="fn">where</span>(mask)[<span class="num">0</span>]
    <span class="kw">if</span> <span class="fn">len</span>(candidates) == <span class="num">0</span>: <span class="kw">return</span> []
    sims = vectors[candidates] @ query
    top = candidates[np.<span class="fn">argsort</span>(-sims)[:k]]
    <span class="kw">return</span> [(<span class="fn">int</span>(i), <span class="fn">float</span>(vectors[i] @ query)) <span class="kw">for</span> i <span class="kw">in</span> top]

q = vectors[<span class="num">0</span>]  <span class="cm"># query vector</span>
hits = <span class="fn">qdrant_style_search</span>(q, where_user=<span class="str">"alice"</span>, where_lang=<span class="str">"tr"</span>, k=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"filtered hits:"</span>, hits)
<span class="fn">print</span>(<span class="str">"total candidates after filter:"</span>, <span class="fn">int</span>(((user_ids==<span class="str">'alice'</span>) &amp; (langs==<span class="str">'tr'</span>)).<span class="fn">sum</span>()))
</code></pre></div>
</div>

<p class="l-text"><strong>Boolean-mask pre-filter, step by step:</strong> 1) Generate 1000 unit-normalised random vectors and attach two categorical payloads: <code>user_ids</code> and <code>langs</code>. 2) <code>qdrant_style_search(query, where_user, where_lang, k)</code> builds a boolean mask <code>mask</code> by ANDing the metadata conditions — exactly what a payload index does in Qdrant. 3) <code>candidates = np.where(mask)[0]</code> shortlists only the matching IDs <em>before</em> any distance work. 4) <code>vectors[candidates] @ query</code> computes cosine on the filtered subset and <code>argsort</code> returns the top-k. The print compares hits against the total candidate count so you see how aggressive the filter was.</p>


</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. pgvector — The Pragmatic Choice</h2>

<p class="l-text">If your stack already has Postgres (and most do), pgvector is the cheapest and operationally simplest option. You get vectors as a column type, HNSW or IVFFlat indexes, and you can JOIN against your relational data in the same query. The catch: at &gt;10M vectors with high-dimensional embeddings, the planner sometimes ignores HNSW and does sequential scans, and recall starts dropping unless you tune <code>ef_search</code>.</p>

<div class="code-wrap"><div class="code-label"><span>SQL</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>-- Enable extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE <span class="fn">docs</span> (
  id    bigserial PRIMARY KEY,
  title text,
  body  text,
  embedding <span class="fn">vector</span>(<span class="num">1536</span>)
);

-- HNSW <span class="fn">index</span> (build <span class="kw">is</span> slow but query <span class="kw">is</span> fast)
CREATE INDEX ON docs USING <span class="fn">hnsw</span> (embedding vector_cosine_ops)
  <span class="fn">WITH</span> (m = <span class="num">16</span>, ef_construction = <span class="num">64</span>);

-- Insert
INSERT INTO <span class="fn">docs</span> (title, embedding) VALUES
  (<span class="str">'Intro to RAG'</span>, <span class="str">'[0.1, 0.2, ...]'</span>),
  (<span class="str">'Vector math'</span>,  <span class="str">'[0.3, 0.4, ...]'</span>);

-- Top-<span class="num">5</span> nearest neighbors <span class="kw">with</span> metadata <span class="fn">filter</span> (real JOIN!)
SET hnsw.ef_search = <span class="num">100</span>;
SELECT d.title, d.embedding &lt;=&gt; <span class="str">'[0.15, 0.25, ...]'</span> AS distance
FROM docs d
WHERE d.title ILIKE <span class="str">'%RAG%'</span>
ORDER BY distance
LIMIT <span class="num">5</span>;
</code></pre></div>

<p class="l-text"><strong>pgvector SQL trace:</strong> 1) <code>CREATE EXTENSION vector</code> enables the type system, then <code>vector(1536)</code> declares an embedding column on the <code>docs</code> table. 2) <code>CREATE INDEX ... USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64)</code> builds an HNSW graph with 16 connections per node — the build is slow but queries become sub-linear. 3) <code>INSERT INTO docs</code> stores titles and embeddings together. 4) <code>SET hnsw.ef_search = 100</code> tunes the query-time recall knob. 5) The <code>SELECT ... ORDER BY embedding &lt;=&gt; '[...]'</code> uses the cosine-distance operator to return the top-5 — and because the <code>WHERE title ILIKE</code> filter is enforced in the same query plan, you get a true JOIN-style hybrid filter.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SQLite doesn't have native vectors, so we store embeddings as JSON text and compute cosine in Python. Same shape as pgvector queries, just slower at scale.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sqlite3, json, numpy <span class="kw">as</span> np

con = sqlite3.<span class="fn">connect</span>(<span class="str">":memory:"</span>)
con.<span class="fn">execute</span>(<span class="str">"CREATE TABLE docs (id INTEGER PRIMARY KEY, title TEXT, emb TEXT)"</span>)

rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)
rows = [(i, f<span class="str">"doc {i}"</span>, json.<span class="fn">dumps</span>(rng.<span class="fn">standard_normal</span>(<span class="num">8</span>).<span class="fn">round</span>(<span class="num">3</span>).<span class="fn">tolist</span>()))
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>)]
con.<span class="fn">executemany</span>(<span class="str">"INSERT INTO docs VALUES (?,?,?)"</span>, rows)

<span class="kw">def</span> <span class="fn">cosine_search</span>(query, k=<span class="num">5</span>, title_like=<span class="kw">None</span>):
    q = np.<span class="fn">asarray</span>(query, dtype=np.float32)
    q /= np.linalg.<span class="fn">norm</span>(q) + <span class="num">1e-9</span>
    sql = <span class="str">"SELECT id, title, emb FROM docs"</span>
    args = ()
    <span class="kw">if</span> title_like:
        sql += <span class="str">" WHERE title LIKE ?"</span>
        args = (f<span class="str">"%{title_like}%"</span>,)
    scored = []
    <span class="kw">for</span> id_, title, emb_json <span class="kw">in</span> con.<span class="fn">execute</span>(sql, args):
        v = np.<span class="fn">asarray</span>(json.<span class="fn">loads</span>(emb_json), dtype=np.float32)
        v /= np.linalg.<span class="fn">norm</span>(v) + <span class="num">1e-9</span>
        scored.<span class="fn">append</span>((id_, title, <span class="fn">float</span>(v @ q)))
    <span class="kw">return</span> <span class="fn">sorted</span>(scored, key=<span class="kw">lambda</span> x: -x[<span class="num">2</span>])[:k]

q = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>).<span class="fn">standard_normal</span>(<span class="num">8</span>).<span class="fn">round</span>(<span class="num">3</span>).<span class="fn">tolist</span>()
<span class="kw">for</span> row <span class="kw">in</span> <span class="fn">cosine_search</span>(q, k=<span class="num">3</span>, title_like=<span class="str">"doc 1"</span>):
    <span class="fn">print</span>(row)
</code></pre></div>
</div>

<p class="l-text"><strong>SQLite simulation, step by step:</strong> 1) <code>sqlite3.connect(":memory:")</code> opens an in-memory database and we create <code>docs(id, title, emb TEXT)</code> where embeddings live as JSON strings (no native vector type in SQLite). 2) Twenty random 8-d vectors are inserted via <code>executemany</code>. 3) <code>cosine_search(query, k, title_like)</code> issues a plain <code>SELECT</code> — optionally with <code>WHERE title LIKE ?</code> — then in Python decodes <code>emb</code> with <code>json.loads</code>, normalises each row and computes <code>v @ q</code>. 4) Results are sorted by cosine and the top-k printed. This mirrors pgvector's hybrid filter pattern; only the index acceleration is missing.</p>


<div class="calc-highlight">⚠️ pgvector gotcha: if your <code>WHERE</code> clause is selective enough, the Postgres planner may skip the HNSW index and do a brute-force scan. Always <code>EXPLAIN ANALYZE</code> your hot queries. For &gt;10M vectors, set <code>maintenance_work_mem</code> to 8GB+ during index build or it will take 30× longer.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Chroma vs LanceDB — The Embedded Pair</h2>

<p class="l-text">Both are embeddable (run inside your Python process), both are great for prototyping, both can persist to disk. The difference is philosophical: Chroma optimizes for "easiest possible Python API," while LanceDB optimizes for "data lake compatibility" — you can read your vectors from Spark, DuckDB, or any Arrow consumer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chroma</div><div class="card-body">3-line API. Persists to DuckDB+Parquet. Built-in embedding function support (calls OpenAI/HuggingFace for you). Sweet spot: prototypes, small RAG apps, &lt;10M vectors.</div></div>
<div class="calc-card"><div class="card-title">LanceDB</div><div class="card-body">Lance columnar format on Parquet. Time-travel (versioned datasets, query "as of last Tuesday"). Zero-copy reads from Pandas/Polars. Sweet spot: ML pipelines, Arrow-native stacks.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Chroma — easiest possible API</span>
<span class="kw">import</span> chromadb
client = chromadb.<span class="fn">PersistentClient</span>(path=<span class="str">"./chroma_db"</span>)
col = client.<span class="fn">get_or_create_collection</span>(<span class="str">"docs"</span>)
col.<span class="fn">add</span>(documents=[<span class="str">"RAG intro"</span>, <span class="str">"Vector math"</span>], ids=[<span class="str">"1"</span>,<span class="str">"2"</span>],
        metadatas=[{<span class="str">"year"</span>:<span class="num">2025</span>},{<span class="str">"year"</span>:<span class="num">2024</span>}])
res = col.<span class="fn">query</span>(query_texts=[<span class="str">"how do vectors work?"</span>], n_results=<span class="num">2</span>,
                where={<span class="str">"year"</span>: <span class="num">2025</span>})
<span class="fn">print</span>(res[<span class="str">"documents"</span>], res[<span class="str">"distances"</span>])

<span class="cm"># LanceDB — Arrow-native</span>
<span class="kw">import</span> lancedb
db = lancedb.<span class="fn">connect</span>(<span class="str">"./lance_db"</span>)
tbl = db.<span class="fn">create_table</span>(<span class="str">"docs"</span>, data=[
    {<span class="str">"id"</span>:<span class="str">"1"</span>,<span class="str">"text"</span>:<span class="str">"RAG intro"</span>,<span class="str">"vector"</span>:[<span class="num">0.1</span>,<span class="num">0.2</span>,<span class="num">0.3</span>]},
    {<span class="str">"id"</span>:<span class="str">"2"</span>,<span class="str">"text"</span>:<span class="str">"Vector math"</span>,<span class="str">"vector"</span>:[<span class="num">0.4</span>,<span class="num">0.5</span>,<span class="num">0.6</span>]},
])
hits = tbl.<span class="fn">search</span>([<span class="num">0.15</span>,<span class="num">0.25</span>,<span class="num">0.35</span>]).<span class="fn">limit</span>(<span class="num">2</span>).<span class="fn">to_pandas</span>()
<span class="fn">print</span>(hits)
</code></pre></div>

<p class="l-text"><strong>Chroma + LanceDB side-by-side:</strong> 1) <code>chromadb.PersistentClient(path="./chroma_db")</code> opens an on-disk DuckDB+Parquet store; <code>get_or_create_collection("docs")</code> ensures the namespace exists. 2) <code>col.add(documents=[...], ids=[...], metadatas=[...])</code> auto-embeds the raw text strings — Chroma calls its default embedder for you. 3) <code>col.query(query_texts=[...], n_results=2, where={"year":2025})</code> returns the two closest 2025 docs. 4) On the LanceDB side, <code>lancedb.connect("./lance_db")</code> opens an Arrow-native store; <code>db.create_table("docs", data=[...])</code> writes records with explicit <code>vector</code> arrays. 5) <code>tbl.search([...]).limit(2).to_pandas()</code> returns a DataFrame — the Arrow zero-copy bridge is what makes LanceDB pleasant in ML pipelines.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Chroma's API mimicked with sklearn TF-IDF + NearestNeighbors on the real reviews dataset. Same shape: <code>add(documents=...)</code>, <code>query(query_texts=...)</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> MiniChromaCollection:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.docs, <span class="kw">self</span>.meta, <span class="kw">self</span>.ids = [], [], []
        <span class="kw">self</span>.vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>)
        <span class="kw">self</span>.knn, <span class="kw">self</span>.X = <span class="kw">None</span>, <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">add</span>(<span class="kw">self</span>, documents, ids, metadatas=<span class="kw">None</span>):
        <span class="kw">self</span>.docs += documents
        <span class="kw">self</span>.ids  += ids
        <span class="kw">self</span>.meta += (metadatas <span class="kw">or</span> [{}] * <span class="fn">len</span>(documents))
        <span class="kw">self</span>.X = <span class="kw">self</span>.vec.<span class="fn">fit_transform</span>(<span class="kw">self</span>.docs)
        <span class="kw">self</span>.knn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, metric=<span class="str">"cosine"</span>).<span class="fn">fit</span>(<span class="kw">self</span>.X)
    <span class="kw">def</span> <span class="fn">query</span>(<span class="kw">self</span>, query_texts, n_results=<span class="num">3</span>, where=<span class="kw">None</span>):
        Q = <span class="kw">self</span>.vec.<span class="fn">transform</span>(query_texts)
        dists, idx = <span class="kw">self</span>.knn.<span class="fn">kneighbors</span>(Q, n_neighbors=<span class="fn">min</span>(n_results*<span class="num">3</span>, <span class="fn">len</span>(<span class="kw">self</span>.docs)))
        out = []
        <span class="kw">for</span> row_d, row_i <span class="kw">in</span> <span class="fn">zip</span>(dists, idx):
            kept = []
            <span class="kw">for</span> d, i <span class="kw">in</span> <span class="fn">zip</span>(row_d, row_i):
                <span class="kw">if</span> where <span class="kw">and</span> <span class="kw">not</span> <span class="fn">all</span>(<span class="kw">self</span>.meta[i].<span class="fn">get</span>(k)==v <span class="kw">for</span> k,v <span class="kw">in</span> where.<span class="fn">items</span>()):
                    <span class="kw">continue</span>
                kept.<span class="fn">append</span>((<span class="kw">self</span>.ids[i], <span class="kw">self</span>.docs[i], <span class="fn">round</span>(<span class="fn">float</span>(d), <span class="num">3</span>)))
                <span class="kw">if</span> <span class="fn">len</span>(kept) == n_results: <span class="kw">break</span>
            out.<span class="fn">append</span>(kept)
        <span class="kw">return</span> out

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">30</span>))
labels   = <span class="fn">list</span>(df_reviews[<span class="str">"sentiment"</span>].<span class="fn">head</span>(<span class="num">30</span>))
col = <span class="fn">MiniChromaCollection</span>()
col.<span class="fn">add</span>(documents=texts_in, ids=[f<span class="str">"r{i}"</span> <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">30</span>)],
        metadatas=[{<span class="str">"sentiment"</span>: s} <span class="kw">for</span> s <span class="kw">in</span> labels])
<span class="fn">print</span>(col.<span class="fn">query</span>([<span class="str">"this product is amazing"</span>], n_results=<span class="num">3</span>, where={<span class="str">"sentiment"</span>:<span class="str">"positive"</span>}))
</code></pre></div>
</div>

<p class="l-text"><strong>MiniChromaCollection, step by step:</strong> 1) <code>TfidfVectorizer(max_features=2000)</code> takes the place of Chroma's auto-embedder so we stay inside the browser. 2) <code>add(documents, ids, metadatas)</code> extends the parallel arrays and re-fits the TF-IDF matrix plus a <code>NearestNeighbors</code> cosine index. 3) <code>query(query_texts, n_results, where)</code> transforms the query, asks for <code>3×n_results</code> candidates, then drops any whose stored metadata fails the <code>where</code> dict — emulating Chroma's post-filter behaviour. 4) The driver loads 30 reviews with sentiment labels and asks for the 3 closest <em>positive</em> reviews to "this product is amazing" — same call shape Chroma uses in production.</p>


</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Decision Tree</h2>

<p class="l-text">Here is the actual flowchart I use when a friend texts "which vector DB?". Walk it top to bottom; the first match wins.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Already running Postgres + &lt;10M vectors?</div><div class="card-body">→ <strong>pgvector</strong>. Free, JOINs work, one less system. Set <code>maintenance_work_mem=8GB</code>, build HNSW with <code>m=16, ef_construction=64</code>.</div></div>
<div class="calc-card"><div class="card-title">Prototyping or &lt;100k vectors, Python-only?</div><div class="card-body">→ <strong>Chroma</strong> (or even just NumPy + FAISS). 3-line API, persist to disk, ship in a day.</div></div>
<div class="calc-card"><div class="card-title">No DevOps capacity, want to forget infra?</div><div class="card-body">→ <strong>Pinecone Serverless</strong>. Highest $/vector but zero ops. Good fit for early-stage startups.</div></div>
<div class="calc-card"><div class="card-title">Heavy filtering (multi-tenant SaaS)?</div><div class="card-body">→ <strong>Qdrant</strong>. Payload indexes are best-in-class. Self-host on a single VPS for &lt;1M vectors per tenant.</div></div>
<div class="calc-card"><div class="card-title">Need first-class hybrid + GraphQL?</div><div class="card-body">→ <strong>Weaviate</strong>. Built-in BM25, generative modules, mature enterprise SDKs.</div></div>
<div class="calc-card"><div class="card-title">10B+ vectors, dedicated platform team?</div><div class="card-body">→ <strong>Milvus</strong> (or Zilliz Cloud). Designed for billions. Real Kubernetes complexity — only worth it at true scale.</div></div>
<div class="calc-card"><div class="card-title">ML pipeline already in Arrow/Parquet?</div><div class="card-body">→ <strong>LanceDB</strong>. Versioned datasets, time-travel, zero-copy with DuckDB/Polars.</div></div>
</div>

<div class="calc-highlight">🎯 Default for 80% of teams in 2026: start with <strong>pgvector</strong> if you have Postgres, otherwise <strong>Qdrant self-hosted</strong>. Migrate to a managed service (Pinecone, Weaviate Cloud, Zilliz) only when ops cost exceeds the managed bill — typically around 10M vectors or a 24/7 paging burden.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Lab — Same Workload, Three Backends</h2>

<p class="l-text">Let's prove the APIs converge by indexing the reviews dataset into three "pretend backends" (Pinecone-style, Qdrant-style with filter, pgvector-style with SQL). Each call has &lt;10 lines and the results are essentially identical at this scale — which is the whole point: the choice is operational, not algorithmic.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">import</span> numpy <span class="kw">as</span> np, sqlite3, json

texts_in  = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">50</span>))
labels_in = <span class="fn">list</span>(df_reviews[<span class="str">"sentiment"</span>].<span class="fn">head</span>(<span class="num">50</span>))
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">512</span>)
X = vec.<span class="fn">fit_transform</span>(texts_in).<span class="fn">toarray</span>().<span class="fn">astype</span>(np.float32)
X /= np.linalg.<span class="fn">norm</span>(X, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>
query = vec.<span class="fn">transform</span>([<span class="str">"this product is amazing quality"</span>]).<span class="fn">toarray</span>()[<span class="num">0</span>]
query /= np.linalg.<span class="fn">norm</span>(query) + <span class="num">1e-9</span>

<span class="cm"># === Pinecone-style ===</span>
sims = X @ query
top  = np.<span class="fn">argsort</span>(-sims)[:<span class="num">3</span>]
<span class="fn">print</span>(<span class="str">"Pinecone:"</span>, [(<span class="fn">int</span>(i), <span class="fn">round</span>(<span class="fn">float</span>(sims[i]),<span class="num">3</span>), labels_in[i]) <span class="kw">for</span> i <span class="kw">in</span> top])

<span class="cm"># === Qdrant-style (filter BEFORE knn) ===</span>
mask = np.<span class="fn">array</span>([s == <span class="str">"positive"</span> <span class="kw">for</span> s <span class="kw">in</span> labels_in])
cand = np.<span class="fn">where</span>(mask)[<span class="num">0</span>]
sims_f = X[cand] @ query
top_f  = cand[np.<span class="fn">argsort</span>(-sims_f)[:<span class="num">3</span>]]
<span class="fn">print</span>(<span class="str">"Qdrant  :"</span>, [(<span class="fn">int</span>(i), <span class="fn">round</span>(<span class="fn">float</span>(X[i] @ query),<span class="num">3</span>), labels_in[i]) <span class="kw">for</span> i <span class="kw">in</span> top_f])

<span class="cm"># === pgvector-style (SQL-ish) ===</span>
con = sqlite3.<span class="fn">connect</span>(<span class="str">":memory:"</span>)
con.<span class="fn">execute</span>(<span class="str">"CREATE TABLE r(id INT, label TEXT, emb TEXT)"</span>)
con.<span class="fn">executemany</span>(<span class="str">"INSERT INTO r VALUES (?,?,?)"</span>,
                [(i, labels_in[i], json.<span class="fn">dumps</span>(X[i].<span class="fn">tolist</span>())) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>)])
rows = con.<span class="fn">execute</span>(<span class="str">"SELECT id, label, emb FROM r WHERE label='positive'"</span>).<span class="fn">fetchall</span>()
scored = <span class="fn">sorted</span>(rows, key=<span class="kw">lambda</span> r: -np.<span class="fn">dot</span>(np.<span class="fn">asarray</span>(json.<span class="fn">loads</span>(r[<span class="num">2</span>])), query))[:<span class="num">3</span>]
<span class="fn">print</span>(<span class="str">"pgvector:"</span>, [(r[<span class="num">0</span>], <span class="fn">round</span>(<span class="fn">float</span>(np.<span class="fn">dot</span>(np.<span class="fn">asarray</span>(json.<span class="fn">loads</span>(r[<span class="num">2</span>])), query)),<span class="num">3</span>), r[<span class="num">1</span>])
                    <span class="kw">for</span> r <span class="kw">in</span> scored])
</code></pre></div>

<p class="l-text">Run this and you'll see all three return overlapping top-3 sets. The Pinecone-style version is unfiltered (so it may include negative reviews), while Qdrant and pgvector restrict to <code>positive</code>. The lesson: at small scale, the algorithm is identical; the DB choice is about ops, cost, and ergonomics — not relevance.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Recap &amp; Next Steps</h2>

<p class="l-text">You now have a working mental map of the vector DB landscape. The seven options divide cleanly: <strong>Pinecone</strong> for managed simplicity, <strong>Weaviate</strong> for open-source enterprise, <strong>Chroma</strong> for prototypes, <strong>Qdrant</strong> for filtering, <strong>pgvector</strong> for Postgres shops, <strong>Milvus</strong> for true scale, <strong>LanceDB</strong> for Arrow-native ML. The capability matrix and pricing numbers in sections 2-3 are your reference cards — bookmark them.</p>

<p class="l-text">In the next lesson we move from "where do vectors live?" to "how do I actually retrieve well?" — hybrid search (BM25 + dense), Reciprocal Rank Fusion, cross-encoder rerankers, and ColBERT late interaction. These techniques add 10-30% recall on top of any DB you pick, and they're what separates demo-quality RAG from production-quality RAG.</p>

<div class="calc-highlight">🚀 Homework: pick the DB that matches your current project from the decision tree, install it locally, and reindex 1000 docs from your domain. Measure p99 latency, recall@10 vs brute-force, and disk footprint. Bring those three numbers to lesson 5 — they're the baseline you'll improve with hybrid + rerank.</div>
</div>`,
tr: `<p class="l-text"><strong>2026'da bir vektör veritabanı seçmek 2005'te bir Linux dağıtımı seçmeye benziyor</strong> — her seçenek en iyi olduğunu iddia ediyor, benchmark'lar oynanmış ve gerçek iş yükün pazarlama slaytlarına hiç benzemiyor. Kirli sır, &lt;100k vektör için bellek-içi NumPy dizisinin gecikmede her "gerçek" vektör veritabanını yendiği ve &gt;100M vektör için Pinecone, Milvus ve Weaviate arasındaki farkın çoğu metrikte 2x içinde küçüldüğüdür. İlginç kararlar dağınık ortada yaşar.</p>

<p class="l-text">Bu ders bir alıcı rehberi. Yedi ciddi seçeneği yürüyeceğiz — Pinecone, Weaviate, Chroma, Qdrant, pgvector, Milvus, LanceDB — fiyatlandırma ($/M vektör/ay), p99 gecikme, hibrit arama desteği, filtreleme ergonomisi ve sabah 3'te çağrılana kadar kimsenin söylemediği operasyonel ayak tuzaklarını kapsayarak. Sonunda kısıtlamalarını (ölçek, bütçe, takım yetkinliği, mevcut yığın) somut bir öneriye eşleyen bir karar ağacın olacak.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yedi büyük vektör veritabanı ve mimari DNA'ları (yönetilen vs OSS, Rust vs Go vs Python)</li>
<li>Gerçek maliyet matematiği: Pinecone, Weaviate Cloud, Qdrant Cloud, self-hosted pgvector için $/milyon vektör/ay</li>
<li>Hibrit arama ve metadata filtreleme yetenek matrisi — kim neyi hangi hızda destekliyor</li>
<li>Karar ağacı: ölçek, bütçe, takım, yığın kısıtlamaları → somut seçim</li>
<li>Aynı iş yükünü üç farklı veritabanında &lt;200 satır Python ile prototiplemek</li>
<li>Operasyonel tuzaklar: Pinecone pod migrasyonu, Milvus etcd bağımlılığı, pgvector recall uçurumları</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Yedi Yarışmacı — Tek Cümlelik Tanıtımlar</h2>

<p class="l-text">Matrislere dalmadan önce, her projenin asansörde on saniyesi olsa kendini nasıl tanımlayacağı. Bunları ezberle — her aracın ne zaman uzanman gerektiğine net olarak eşlenirler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pinecone</div><div class="card-body">Tamamen yönetilen serverless. Kredi kartını verirsin ve altyapıyı asla düşünmezsin. Kapalı kaynak, AWS-yalnızca menşeli (artık çoklu-bulut). DevOps kapasitesi olmayan takımlar için varsayılan seçim.</div></div>
<div class="calc-card"><div class="card-title">Weaviate</div><div class="card-body">Açık kaynak, modüler (vektörleyici modüller, generatif modüller). BM25 + dense ile yerleşik hibrit arama. Güçlü GraphQL API. Cloud veya self-host. Birçok kurumsal RAG yığınını çalıştırır.</div></div>
<div class="calc-card"><div class="card-title">Chroma</div><div class="card-body">Hafif, Python-öncelikli, gömülü. Prototipleme ve küçük üretim için tasarlandı. <code>pip install chromadb</code> ve üç satırda indeksliyorsun. DuckDB+Parquet'e kalıcı.</div></div>
<div class="calc-card"><div class="card-title">Qdrant</div><div class="card-body">Rust tabanlı, tek binary, harika filtreleme performansı (payload indeksleri). Self-host veya Qdrant Cloud. "Filtrele sonra ara" iş yükleri için sınıfının en iyisi (örn. "user_id = X olan vektörler").</div></div>
<div class="calc-card"><div class="card-title">pgvector</div><div class="card-body">Postgres uzantısı. Zaten Postgres çalıştırıyorsan, zaten bir vektör veritabanın var. Bedava, transaksiyonel, ilişkisel veriyle JOIN yapar. HNSW + IVFFlat indeksleri. &gt;10M vektörde recall düşer.</div></div>
<div class="calc-card"><div class="card-title">Milvus</div><div class="card-body">Bulut-doğal, milyarlarca vektör için tasarlanmış. Kubernetes üzerinde ayrılmış işlem/depolama. Ağır ops ayak izi (etcd, Pulsar, MinIO). Gerçekten 10B+ vektöre ölçeklenmen gerektiğinde seç.</div></div>
<div class="calc-card"><div class="card-title">LanceDB</div><div class="card-body">Sütunlu (Parquet üzerine Lance formatı). Gömülü veya cloud. Zaten Arrow/Parquet'te yaşayan ML pipeline'ları için mükemmel. Sıfır-kopya okumalar, sürümlü veri kümeleri, zaman-yolculuk sorguları.</div></div>
</div>

<div class="calc-highlight">⚡ Dürüst ilk soru "hangi DB?" değil, "DB'ye gerçekten ihtiyacım var mı?" — &lt;50k vektör için NumPy + S3'te pickle'lanmış bir FAISS indeksi gecikmede aşağıdaki her seçeneği geçer ve sıfır maliyetlidir. Vektör veritabanları filtreleme, çoklu kiracılık, çevrimiçi güncellemeler veya dağıtık ölçeğe ihtiyacın olduğunda paralarını hak eder.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Yetenek Matrisi</h2>

<p class="l-text">Üretim kararları için gerçekten önemli olan özellik karşılaştırması burada. Hibrit = birinci sınıf BM25+dense. Filtreleme = sonradan-filtre hızı (bazı DB'ler WHERE eklediğinde yavaşlar). Çoklu-kiracılı = kiracı başına yük ödemeden ad alanı/koleksiyon izolasyonu.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hibrit Arama (BM25 + Dense)</div><div class="card-body">Doğal: Weaviate, Qdrant, Milvus, LanceDB. Eklenti / DIY: Pinecone (sparse-dense vektörler), pgvector (paradedb uzantısı veya manuel). Chroma: kısıtlı.</div></div>
<div class="calc-card"><div class="card-title">Metadata Filtreleme Hızı</div><div class="card-body">En iyi: Qdrant (payload indeksleri, WHERE ile bile alt-ms), Weaviate. İyi: Pinecone (pod tipi uyarılarıyla), Milvus. Ölçekte yavaş: pgvector (planner HNSW'yi yok sayabilir), Chroma.</div></div>
<div class="calc-card"><div class="card-title">Maks Pratik Ölçek (tek kiracı)</div><div class="card-body">Pinecone, Milvus: 10B+ vektör. Weaviate, Qdrant: rahat 1B. LanceDB: diske bağlı 100M+. pgvector: recall uçurumlarından önce 10-50M. Chroma: 10M tatlı nokta.</div></div>
<div class="calc-card"><div class="card-title">Çoklu-Kiracılık Modeli</div><div class="card-body">Ad alanları (ucuz): Pinecone, Weaviate (multi-tenant koleksiyonlar), Qdrant. Koleksiyon başına (ölçekte pahalı): Chroma, LanceDB. pgvector: kiracı başına şema.</div></div>
<div class="calc-card"><div class="card-title">Self-Host Seçeneği</div><div class="card-body">Evet (gerçek OSS): Weaviate, Chroma, Qdrant, pgvector, Milvus, LanceDB. Hayır: Pinecone (yalnızca yönetilen).</div></div>
<div class="calc-card"><div class="card-title">Güncelleme Gecikmesi (insert → aranabilir)</div><div class="card-body">Gerçek-zamanlı: Qdrant, Weaviate, Pinecone, pgvector. Toplu-eğilimli: Milvus (segment sıkıştırma), LanceDB (sürümlü commit'ler). Chroma: gerçek-zamanlı ama ölçekte yavaş.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Fiyatlandırma — Gerçek Sayılar</h2>

<p class="l-text">Aşağıdaki tüm fiyatlar OpenAI'nin <code>text-embedding-3-small</code> boyutu içindir (1536 boyut, metadata ile vektör başına ~6 KB). Sayılar 2026 başı liste fiyatları; bunu okuduğunda ±%20 varsay. En ucuz seçenek neredeyse her zaman "zaten sahip olduğun büyük bir kutuda self-host"tür, ama bunun gizli mühendislik maliyeti var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pinecone Serverless</div><div class="card-body">~$0.33/GB-ay depolama + $4 milyon yazma birimi başına + $16 milyon okuma birimi başına. 100k sorgu/gün ile 1M vektör için: kabaca $50-90/ay. Boşta maliyet yok.</div></div>
<div class="calc-card"><div class="card-title">Pinecone Pods (legacy s1.x1)</div><div class="card-body">$0.096/saat = pod başına ~$70/ay. Bir s1.x1 ~5M 1536 boyutlu vektör tutar. Tahmin edilebilir, ama boştayken bile 7/24 ödersin.</div></div>
<div class="calc-card"><div class="card-title">Weaviate Cloud</div><div class="card-body">Standart SLA katman: 1536 boyutta 1M vektör başına ~$25/ay. Enterprise katman 2-3x bu. Self-hosted: bedava (AWS/GCP'ye ödersin).</div></div>
<div class="calc-card"><div class="card-title">Qdrant Cloud</div><div class="card-body">GB RAM başına ~$0.014/saat. 4GB cluster ~600k vektör tutar 1536d, ~$40/ay maliyet. Self-hosted tek binary: bedava, &lt;1M vektör için $20'lık VPS'te çalışır.</div></div>
<div class="calc-card"><div class="card-title">pgvector (self-host)</div><div class="card-body">Zaten Postgres ödüyorsan etkili olarak bedava. HNSW için indekslenmiş vektör başına ~%25 RAM yükü ekler. Yönetilen (Supabase, Neon, RDS): standart Postgres fiyatlandırması.</div></div>
<div class="calc-card"><div class="card-title">Milvus / Zilliz Cloud</div><div class="card-body">Zilliz serverless: depolanan milyon vektör başına ~$0.30 + okuma birimleri. Adanmış: ~$100/ay'dan başlar. Self-hosted Milvus: bedava ama Kubernetes + etcd + Pulsar gerektirir = gerçek ops maliyeti.</div></div>
<div class="calc-card"><div class="card-title">Chroma / LanceDB</div><div class="card-body">Self-hosted/gömülü: bedava. Chroma Cloud (2026'da beta): fiyat TBD, Qdrant Cloud benzeri bekleniyor. LanceDB Cloud: ~$0.20/GB/ay depolama + serverless sorgu birimleri.</div></div>
</div>

<div class="calc-highlight">💸 1M vektör @ 1536d için kabaca kural, orta sorgu yükü: Pinecone Serverless ~$70/ay · Weaviate Cloud ~$25/ay · Qdrant Cloud ~$40/ay · mevcut Postgres üzerinde pgvector ~$0/ay · $20'lık VPS'te self-hosted Qdrant ~$20/ay. Mühendislik zamanı genellikle daha büyük maliyettir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pinecone — Yönetilen Varsayılan</h2>

<p class="l-text">Pinecone, vektörlerin altyapı endişesi olarak var olduğunu unutmak istediğinde uzandığın şeydir. API küçük, SDK temiz ve serverless katmanı otomatik ölçekleniyor. Takaslar: kapalı kaynak, satıcı kilitlenmesi ve 2024-2025 pod-to-serverless migrasyonu birçok kullanıcıyı maliyet modellerini yeniden yazmaya zorladı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pinecone <span class="kw">import</span> Pinecone, ServerlessSpec

pc = <span class="fn">Pinecone</span>(api_key=<span class="str">"YOUR_KEY"</span>)

<span class="cm"># Bir serverless indeks olustur (tek seferlik)</span>
pc.<span class="fn">create_index</span>(
    name=<span class="str">"docs"</span>,
    dimension=<span class="num">1536</span>,
    metric=<span class="str">"cosine"</span>,
    spec=<span class="fn">ServerlessSpec</span>(cloud=<span class="str">"aws"</span>, region=<span class="str">"us-east-1"</span>)
)

index = pc.<span class="fn">Index</span>(<span class="str">"docs"</span>)

<span class="cm"># Metadata ile upsert</span>
index.<span class="fn">upsert</span>(vectors=[
    (<span class="str">"doc1"</span>, [<span class="num">0.1</span>, <span class="num">0.2</span>, ...], {<span class="str">"author"</span>: <span class="str">"alice"</span>, <span class="str">"year"</span>: <span class="num">2025</span>}),
    (<span class="str">"doc2"</span>, [<span class="num">0.3</span>, <span class="num">0.4</span>, ...], {<span class="str">"author"</span>: <span class="str">"bob"</span>,   <span class="str">"year"</span>: <span class="num">2024</span>}),
])

<span class="cm"># Filtreli sorgu</span>
results = index.<span class="fn">query</span>(
    vector=[<span class="num">0.15</span>, <span class="num">0.25</span>, ...],
    top_k=<span class="num">5</span>,
    <span class="fn">filter</span>={<span class="str">"year"</span>: {<span class="str">"$gte"</span>: <span class="num">2025</span>}},
    include_metadata=<span class="kw">True</span>
)
<span class="kw">for</span> <span class="kw">match</span> <span class="kw">in</span> results.matches:
    <span class="fn">print</span>(<span class="kw">match</span>.id, <span class="kw">match</span>.score, <span class="kw">match</span>.metadata)
</code></pre></div>

<p class="l-text">İki API çağrısı — upsert ve query — kullanım durumlarının %90'ını halleder. <code>filter</code> parametresi MongoDB-stili operatörleri kullanır (<code>$gte</code>, <code>$in</code>, <code>$and</code>). Pinecone filtreyi sonradan-filtre olarak değil indeks içinde çalıştırır, böylece yüksek kardinalitede bile gecikme düşük kalır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı API yüzeyi, NumPy kosinüs ve Python-tarafı filtreleme ile vektörler-dict olarak uygulanmış. Pinecone'un küçük ölçekte perde arkasında ne yaptığını tam olarak gösterir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> MiniPinecone:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, dim, metric=<span class="str">"cosine"</span>):
        <span class="kw">self</span>.vecs, <span class="kw">self</span>.meta = {}, {}
    <span class="kw">def</span> <span class="fn">upsert</span>(<span class="kw">self</span>, items):
        <span class="kw">for</span> id_, v, m <span class="kw">in</span> items:
            <span class="kw">self</span>.vecs[id_] = np.<span class="fn">asarray</span>(v, dtype=np.float32)
            <span class="kw">self</span>.meta[id_] = m
    <span class="kw">def</span> <span class="fn">query</span>(<span class="kw">self</span>, vector, top_k=<span class="num">5</span>, flt=<span class="kw">None</span>):
        q = np.<span class="fn">asarray</span>(vector, dtype=np.float32)
        q /= np.linalg.<span class="fn">norm</span>(q) + <span class="num">1e-9</span>
        scored = []
        <span class="kw">for</span> id_, v <span class="kw">in</span> <span class="kw">self</span>.vecs.<span class="fn">items</span>():
            <span class="kw">if</span> flt <span class="kw">and</span> <span class="kw">not</span> <span class="fn">all</span>(<span class="kw">self</span>.meta[id_].<span class="fn">get</span>(k) == val <span class="kw">for</span> k, val <span class="kw">in</span> flt.<span class="fn">items</span>()):
                <span class="kw">continue</span>
            sim = <span class="fn">float</span>(v @ q / (np.linalg.<span class="fn">norm</span>(v) + <span class="num">1e-9</span>))
            scored.<span class="fn">append</span>((id_, sim, <span class="kw">self</span>.meta[id_]))
        <span class="kw">return</span> <span class="fn">sorted</span>(scored, key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:top_k]

idx = <span class="fn">MiniPinecone</span>(dim=<span class="num">4</span>)
idx.<span class="fn">upsert</span>([(<span class="str">"d1"</span>, [<span class="num">0.1</span>,<span class="num">0.2</span>,<span class="num">0.3</span>,<span class="num">0.4</span>], {<span class="str">"year"</span>: <span class="num">2025</span>}),
            (<span class="str">"d2"</span>, [<span class="num">0.4</span>,<span class="num">0.3</span>,<span class="num">0.2</span>,<span class="num">0.1</span>], {<span class="str">"year"</span>: <span class="num">2024</span>}),
            (<span class="str">"d3"</span>, [<span class="num">0.2</span>,<span class="num">0.3</span>,<span class="num">0.4</span>,<span class="num">0.5</span>], {<span class="str">"year"</span>: <span class="num">2025</span>})])
<span class="kw">for</span> id_, score, meta <span class="kw">in</span> idx.<span class="fn">query</span>([<span class="num">0.2</span>,<span class="num">0.3</span>,<span class="num">0.4</span>,<span class="num">0.5</span>], top_k=<span class="num">2</span>, flt={<span class="str">"year"</span>: <span class="num">2025</span>}):
    <span class="fn">print</span>(id_, <span class="fn">round</span>(score, <span class="num">3</span>), meta)
</code></pre></div>
</div>

<p class="l-text"><strong>MiniPinecone akışı:</strong> 1) <code>MiniPinecone(dim=4)</code> iki dict — <code>self.vecs</code> ve <code>self.meta</code> — oluşturur; gerçek bir indeksin vektörü kimliğe bağlı tutması ve metadata'yı paralel saklaması gibi. 2) <code>upsert([(id, vec, meta), ...])</code> her vektörü <code>np.asarray(..., dtype=float32)</code> ile normalize edip iki haritaya yazar. 3) <code>query(vector, top_k, flt)</code> <code>q</code>'yu L2-normalize eder, ardından saklı her vektörü dolaşır — metadata'sı filtredeki her <code>k=v</code>'yi karşılamayanları atlar — <code>v @ q / (||v||·||q||)</code> ile kosinüsü hesaplar ve skora göre sıralı top-k döner. 4) Sürücü üç dokümanla <code>upsert</code> çağırır ve <code>year=2025</code> için filtreli sorgu koşturur — Pinecone'un MongoDB-stili filtre API'sini yansıtır.</p>


</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Qdrant — Filtrelemenin Sıcak Yol Olduğunda</h2>

<p class="l-text">Qdrant'ın süper gücü payload filtrelemedir. Sorguların her zaman "user_id = X VE lang = 'tr' ile benzer dokümanları bul" gibi görünüyorsa, Qdrant'ın payload indeksleri filtrenin HNSW yürüyüşünden sonra değil içinde gerçekleşmesi anlamına gelir. Diğer DB'ler sonradan-filtreleme yapar (1000 ara, 10'a filtrele) bu da filtreler seçici olduğunda recall'u çökertir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">from</span> qdrant_client.models <span class="kw">import</span> Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue

client = <span class="fn">QdrantClient</span>(url=<span class="str">"http://localhost:6333"</span>)

client.<span class="fn">recreate_collection</span>(
    collection_name=<span class="str">"docs"</span>,
    vectors_config=<span class="fn">VectorParams</span>(size=<span class="num">1536</span>, distance=Distance.COSINE),
)

<span class="cm"># Payload indeksi WHERE filtrelerini hızlı yapar</span>
client.<span class="fn">create_payload_index</span>(<span class="str">"docs"</span>, field_name=<span class="str">"user_id"</span>, field_schema=<span class="str">"keyword"</span>)

client.<span class="fn">upsert</span>(<span class="str">"docs"</span>, points=[
    <span class="fn">PointStruct</span>(id=<span class="num">1</span>, vector=[<span class="num">0.1</span>]*<span class="num">1536</span>, payload={<span class="str">"user_id"</span>: <span class="str">"alice"</span>, <span class="str">"lang"</span>: <span class="str">"en"</span>}),
    <span class="fn">PointStruct</span>(id=<span class="num">2</span>, vector=[<span class="num">0.2</span>]*<span class="num">1536</span>, payload={<span class="str">"user_id"</span>: <span class="str">"bob"</span>,   <span class="str">"lang"</span>: <span class="str">"tr"</span>}),
])

<span class="cm"># Filtre HNSW araması içinde gerçekleşir, sonra değil</span>
hits = client.<span class="fn">search</span>(
    collection_name=<span class="str">"docs"</span>,
    query_vector=[<span class="num">0.15</span>]*<span class="num">1536</span>,
    query_filter=<span class="fn">Filter</span>(must=[
        <span class="fn">FieldCondition</span>(key=<span class="str">"user_id"</span>, <span class="kw">match</span>=<span class="fn">MatchValue</span>(value=<span class="str">"alice"</span>))
    ]),
    limit=<span class="num">5</span>,
)
<span class="kw">for</span> h <span class="kw">in</span> hits: <span class="fn">print</span>(h.id, h.score, h.payload)
</code></pre></div>

<p class="l-text"><strong>Qdrant akışı:</strong> 1) <code>QdrantClient(url="http://localhost:6333")</code> Qdrant sunucusuna bağlantı açar. 2) <code>recreate_collection("docs", VectorParams(size=1536, distance=COSINE))</code> taze 1536-boyutlu kosinüs koleksiyonu tanımlar. 3) <code>create_payload_index("docs", field_name="user_id", field_schema="keyword")</code> kritik adımdır — bu olmadan filtreler sonradan-filtre olur ve recall çöker. 4) <code>upsert</code> iki <code>PointStruct</code> kaydı vektör ve payload ile yazar. 5) <code>client.search(...)</code> <code>Filter(must=[FieldCondition(...MatchValue("alice"))])</code> geçer; payload indeksi sayesinde Qdrant filtreyi HNSW yürüyüşü içinde değerlendirir ve yalnızca eşleşen noktaları döner.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Qdrant'ın payload-filtreli aramasını knn'den ÖNCE bir NumPy boolean maskesi kullanarak simüle ediyoruz; bu tam olarak Qdrant'ın yaptığı indeks-içi filtrelemedir (diğer DB'lerin yaptığı sonradan-filtre yerine).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
N, D = <span class="num">1000</span>, <span class="num">32</span>
vectors = rng.<span class="fn">standard_normal</span>((N, D)).<span class="fn">astype</span>(np.float32)
vectors /= np.linalg.<span class="fn">norm</span>(vectors, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>
user_ids = rng.<span class="fn">choice</span>([<span class="str">"alice"</span>, <span class="str">"bob"</span>, <span class="str">"carol"</span>], size=N)
langs    = rng.<span class="fn">choice</span>([<span class="str">"en"</span>, <span class="str">"tr"</span>, <span class="str">"de"</span>], size=N)

<span class="kw">def</span> <span class="fn">qdrant_style_search</span>(query, where_user=<span class="kw">None</span>, where_lang=<span class="kw">None</span>, k=<span class="num">5</span>):
    mask = np.<span class="fn">ones</span>(N, dtype=<span class="fn">bool</span>)
    <span class="kw">if</span> where_user: mask &amp;= (user_ids == where_user)
    <span class="kw">if</span> where_lang: mask &amp;= (langs    == where_lang)
    candidates = np.<span class="fn">where</span>(mask)[<span class="num">0</span>]
    <span class="kw">if</span> <span class="fn">len</span>(candidates) == <span class="num">0</span>: <span class="kw">return</span> []
    sims = vectors[candidates] @ query
    top = candidates[np.<span class="fn">argsort</span>(-sims)[:k]]
    <span class="kw">return</span> [(<span class="fn">int</span>(i), <span class="fn">float</span>(vectors[i] @ query)) <span class="kw">for</span> i <span class="kw">in</span> top]

q = vectors[<span class="num">0</span>]  <span class="cm"># sorgu vektörü</span>
hits = <span class="fn">qdrant_style_search</span>(q, where_user=<span class="str">"alice"</span>, where_lang=<span class="str">"tr"</span>, k=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">"filtered hits:"</span>, hits)
<span class="fn">print</span>(<span class="str">"total candidates after filter:"</span>, <span class="fn">int</span>(((user_ids==<span class="str">'alice'</span>) &amp; (langs==<span class="str">'tr'</span>)).<span class="fn">sum</span>()))
</code></pre></div>
</div>

<p class="l-text"><strong>Boolean-maske ön-filtre, adım adım:</strong> 1) 1000 birim-normalleştirilmiş rastgele vektör üretir ve iki kategorik payload ekler: <code>user_ids</code> ve <code>langs</code>. 2) <code>qdrant_style_search(query, where_user, where_lang, k)</code> metadata koşullarını AND'leyerek <code>mask</code> kurar — Qdrant'taki payload indeksinin yaptığı şey budur. 3) <code>candidates = np.where(mask)[0]</code> herhangi bir mesafe işinden <em>önce</em> yalnızca eşleşen kimlikleri kısa listeye alır. 4) <code>vectors[candidates] @ query</code> kosinüsü filtrelenmiş alt küme üzerinde hesaplar ve <code>argsort</code> top-k'yı döner. Print, hitler ile toplam aday sayısını karşılaştırır; filtrenin ne kadar agresif olduğunu görürsün.</p>


</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. pgvector — Pragmatik Seçim</h2>

<p class="l-text">Yığınında zaten Postgres varsa (ki çoğunda var), pgvector en ucuz ve operasyonel olarak en basit seçenektir. Vektörleri bir kolon tipi olarak alırsın, HNSW veya IVFFlat indeksleri ve aynı sorguda ilişkisel verine JOIN yapabilirsin. Yakalanma: yüksek-boyutlu embedding'lerle &gt;10M vektörde, planner bazen HNSW'yi yok sayar ve sıralı taramalar yapar, ve <code>ef_search</code>'ü ayarlamadıkça recall düşmeye başlar.</p>

<div class="code-wrap"><div class="code-label"><span>SQL</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>-- Uzantıyı etkinleştir
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE <span class="fn">docs</span> (
  id    bigserial PRIMARY KEY,
  title text,
  body  text,
  embedding <span class="fn">vector</span>(<span class="num">1536</span>)
);

-- HNSW <span class="fn">indeks</span> (inşa yavaş ama sorgu hızlı)
CREATE INDEX ON docs USING <span class="fn">hnsw</span> (embedding vector_cosine_ops)
  <span class="fn">WITH</span> (m = <span class="num">16</span>, ef_construction = <span class="num">64</span>);

-- Insert
INSERT INTO <span class="fn">docs</span> (title, embedding) VALUES
  (<span class="str">'Intro to RAG'</span>, <span class="str">'[0.1, 0.2, ...]'</span>),
  (<span class="str">'Vector math'</span>,  <span class="str">'[0.3, 0.4, ...]'</span>);

-- Metadata filtreli top-<span class="num">5</span> en yakın <span class="fn">komşu</span> (gerçek JOIN!)
SET hnsw.ef_search = <span class="num">100</span>;
SELECT d.title, d.embedding &lt;=&gt; <span class="str">'[0.15, 0.25, ...]'</span> AS distance
FROM docs d
WHERE d.title ILIKE <span class="str">'%RAG%'</span>
ORDER BY distance
LIMIT <span class="num">5</span>;
</code></pre></div>

<p class="l-text"><strong>pgvector SQL akışı:</strong> 1) <code>CREATE EXTENSION vector</code> tip sistemini etkinleştirir, sonra <code>vector(1536)</code> <code>docs</code> tablosunda bir embedding kolonu tanımlar. 2) <code>CREATE INDEX ... USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64)</code> düğüm başına 16 bağlantılı bir HNSW grafı inşa eder — inşa yavaş ama sorgular alt-doğrusal olur. 3) <code>INSERT INTO docs</code> başlıkları ve embedding'leri birlikte saklar. 4) <code>SET hnsw.ef_search = 100</code> sorgu-zamanı recall düğmesini ayarlar. 5) <code>SELECT ... ORDER BY embedding &lt;=&gt; '[...]'</code> kosinüs-mesafesi operatörünü kullanıp top-5 döner — <code>WHERE title ILIKE</code> filtresi aynı sorgu planında uygulandığı için gerçek JOIN-stili hibrit filtre elde edersin.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SQLite'ın yerel vektörleri yok, bu yüzden embedding'leri JSON metni olarak saklıyoruz ve kosinüsü Python'da hesaplıyoruz. pgvector sorgularıyla aynı şekil, sadece ölçekte daha yavaş.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sqlite3, json, numpy <span class="kw">as</span> np

con = sqlite3.<span class="fn">connect</span>(<span class="str">":memory:"</span>)
con.<span class="fn">execute</span>(<span class="str">"CREATE TABLE docs (id INTEGER PRIMARY KEY, title TEXT, emb TEXT)"</span>)

rng = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>)
rows = [(i, f<span class="str">"doc {i}"</span>, json.<span class="fn">dumps</span>(rng.<span class="fn">standard_normal</span>(<span class="num">8</span>).<span class="fn">round</span>(<span class="num">3</span>).<span class="fn">tolist</span>()))
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>)]
con.<span class="fn">executemany</span>(<span class="str">"INSERT INTO docs VALUES (?,?,?)"</span>, rows)

<span class="kw">def</span> <span class="fn">cosine_search</span>(query, k=<span class="num">5</span>, title_like=<span class="kw">None</span>):
    q = np.<span class="fn">asarray</span>(query, dtype=np.float32)
    q /= np.linalg.<span class="fn">norm</span>(q) + <span class="num">1e-9</span>
    sql = <span class="str">"SELECT id, title, emb FROM docs"</span>
    args = ()
    <span class="kw">if</span> title_like:
        sql += <span class="str">" WHERE title LIKE ?"</span>
        args = (f<span class="str">"%{title_like}%"</span>,)
    scored = []
    <span class="kw">for</span> id_, title, emb_json <span class="kw">in</span> con.<span class="fn">execute</span>(sql, args):
        v = np.<span class="fn">asarray</span>(json.<span class="fn">loads</span>(emb_json), dtype=np.float32)
        v /= np.linalg.<span class="fn">norm</span>(v) + <span class="num">1e-9</span>
        scored.<span class="fn">append</span>((id_, title, <span class="fn">float</span>(v @ q)))
    <span class="kw">return</span> <span class="fn">sorted</span>(scored, key=<span class="kw">lambda</span> x: -x[<span class="num">2</span>])[:k]

q = np.random.<span class="fn">default_rng</span>(<span class="num">7</span>).<span class="fn">standard_normal</span>(<span class="num">8</span>).<span class="fn">round</span>(<span class="num">3</span>).<span class="fn">tolist</span>()
<span class="kw">for</span> row <span class="kw">in</span> <span class="fn">cosine_search</span>(q, k=<span class="num">3</span>, title_like=<span class="str">"doc 1"</span>):
    <span class="fn">print</span>(row)
</code></pre></div>
</div>

<p class="l-text"><strong>SQLite simülasyonu, adım adım:</strong> 1) <code>sqlite3.connect(":memory:")</code> bellek-içi bir veritabanı açar ve <code>docs(id, title, emb TEXT)</code> oluştururuz; embedding'ler JSON string olarak yaşar (SQLite'ta yerel vektör tipi yok). 2) <code>executemany</code> ile yirmi rastgele 8-d vektör eklenir. 3) <code>cosine_search(query, k, title_like)</code> düz bir <code>SELECT</code> verir — opsiyonel <code>WHERE title LIKE ?</code> ile — sonra Python'da <code>emb</code>'yi <code>json.loads</code> ile çözer, her satırı normalize edip <code>v @ q</code> hesaplar. 4) Sonuçlar kosinüse göre sıralanır ve top-k print edilir. Bu pgvector'ün hibrit filtre desenini yansıtır; sadece indeks hızlandırması eksiktir.</p>


<div class="calc-highlight">⚠️ pgvector tuzağı: <code>WHERE</code> cümlen yeterince seçiciyse, Postgres planner HNSW indeksini atlayıp kaba kuvvet tarama yapabilir. Sıcak sorgularını her zaman <code>EXPLAIN ANALYZE</code> et. &gt;10M vektör için indeks inşası sırasında <code>maintenance_work_mem</code>'i 8GB+ ayarla yoksa 30x daha uzun sürer.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Chroma vs LanceDB — Gömülü İkili</h2>

<p class="l-text">İkisi de gömülebilir (Python sürecin içinde çalışır), ikisi de prototipleme için harika, ikisi de diske kalıcı olabilir. Fark felsefidir: Chroma "olabilecek en kolay Python API" için optimize ederken, LanceDB "veri gölü uyumluluğu" için optimize eder — vektörlerini Spark, DuckDB veya herhangi bir Arrow tüketicisinden okuyabilirsin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chroma</div><div class="card-body">3 satırlık API. DuckDB+Parquet'e kalıcı. Yerleşik embedding fonksiyonu desteği (OpenAI/HuggingFace'i senin için çağırır). Tatlı nokta: prototipler, küçük RAG uygulamaları, &lt;10M vektör.</div></div>
<div class="calc-card"><div class="card-title">LanceDB</div><div class="card-body">Parquet üzerinde Lance sütunlu format. Zaman-yolculuk (sürümlü veri kümeleri, "geçen Salı itibariyle" sorgu). Pandas/Polars'tan sıfır-kopya okumalar. Tatlı nokta: ML pipeline'ları, Arrow-doğal yığınlar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Chroma — olabilecek en kolay API</span>
<span class="kw">import</span> chromadb
client = chromadb.<span class="fn">PersistentClient</span>(path=<span class="str">"./chroma_db"</span>)
col = client.<span class="fn">get_or_create_collection</span>(<span class="str">"docs"</span>)
col.<span class="fn">add</span>(documents=[<span class="str">"RAG intro"</span>, <span class="str">"Vector math"</span>], ids=[<span class="str">"1"</span>,<span class="str">"2"</span>],
        metadatas=[{<span class="str">"year"</span>:<span class="num">2025</span>},{<span class="str">"year"</span>:<span class="num">2024</span>}])
res = col.<span class="fn">query</span>(query_texts=[<span class="str">"how do vectors work?"</span>], n_results=<span class="num">2</span>,
                where={<span class="str">"year"</span>: <span class="num">2025</span>})
<span class="fn">print</span>(res[<span class="str">"documents"</span>], res[<span class="str">"distances"</span>])

<span class="cm"># LanceDB — Arrow-doğal</span>
<span class="kw">import</span> lancedb
db = lancedb.<span class="fn">connect</span>(<span class="str">"./lance_db"</span>)
tbl = db.<span class="fn">create_table</span>(<span class="str">"docs"</span>, data=[
    {<span class="str">"id"</span>:<span class="str">"1"</span>,<span class="str">"text"</span>:<span class="str">"RAG intro"</span>,<span class="str">"vector"</span>:[<span class="num">0.1</span>,<span class="num">0.2</span>,<span class="num">0.3</span>]},
    {<span class="str">"id"</span>:<span class="str">"2"</span>,<span class="str">"text"</span>:<span class="str">"Vector math"</span>,<span class="str">"vector"</span>:[<span class="num">0.4</span>,<span class="num">0.5</span>,<span class="num">0.6</span>]},
])
hits = tbl.<span class="fn">search</span>([<span class="num">0.15</span>,<span class="num">0.25</span>,<span class="num">0.35</span>]).<span class="fn">limit</span>(<span class="num">2</span>).<span class="fn">to_pandas</span>()
<span class="fn">print</span>(hits)
</code></pre></div>

<p class="l-text"><strong>Chroma + LanceDB yan yana:</strong> 1) <code>chromadb.PersistentClient(path="./chroma_db")</code> disk üzerinde bir DuckDB+Parquet store açar; <code>get_or_create_collection("docs")</code> ad alanının var olduğunu garanti eder. 2) <code>col.add(documents=[...], ids=[...], metadatas=[...])</code> ham metin string'lerini senin için otomatik embed eder — Chroma varsayılan embedder'ını çağırır. 3) <code>col.query(query_texts=[...], n_results=2, where={"year":2025})</code> en yakın iki 2025 dokümanını döner. 4) LanceDB tarafında <code>lancedb.connect("./lance_db")</code> Arrow-doğal bir store açar; <code>db.create_table("docs", data=[...])</code> kayıtları açık <code>vector</code> dizileriyle yazar. 5) <code>tbl.search([...]).limit(2).to_pandas()</code> bir DataFrame döner — Arrow sıfır-kopya köprüsü LanceDB'yi ML pipeline'larında hoş kılan şeydir.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Chroma'nın API'si gerçek yorumlar veri kümesinde sklearn TF-IDF + NearestNeighbors ile taklit edildi. Aynı şekil: <code>add(documents=...)</code>, <code>query(query_texts=...)</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">class</span> MiniChromaCollection:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.docs, <span class="kw">self</span>.meta, <span class="kw">self</span>.ids = [], [], []
        <span class="kw">self</span>.vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>)
        <span class="kw">self</span>.knn, <span class="kw">self</span>.X = <span class="kw">None</span>, <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">add</span>(<span class="kw">self</span>, documents, ids, metadatas=<span class="kw">None</span>):
        <span class="kw">self</span>.docs += documents
        <span class="kw">self</span>.ids  += ids
        <span class="kw">self</span>.meta += (metadatas <span class="kw">or</span> [{}] * <span class="fn">len</span>(documents))
        <span class="kw">self</span>.X = <span class="kw">self</span>.vec.<span class="fn">fit_transform</span>(<span class="kw">self</span>.docs)
        <span class="kw">self</span>.knn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, metric=<span class="str">"cosine"</span>).<span class="fn">fit</span>(<span class="kw">self</span>.X)
    <span class="kw">def</span> <span class="fn">query</span>(<span class="kw">self</span>, query_texts, n_results=<span class="num">3</span>, where=<span class="kw">None</span>):
        Q = <span class="kw">self</span>.vec.<span class="fn">transform</span>(query_texts)
        dists, idx = <span class="kw">self</span>.knn.<span class="fn">kneighbors</span>(Q, n_neighbors=<span class="fn">min</span>(n_results*<span class="num">3</span>, <span class="fn">len</span>(<span class="kw">self</span>.docs)))
        out = []
        <span class="kw">for</span> row_d, row_i <span class="kw">in</span> <span class="fn">zip</span>(dists, idx):
            kept = []
            <span class="kw">for</span> d, i <span class="kw">in</span> <span class="fn">zip</span>(row_d, row_i):
                <span class="kw">if</span> where <span class="kw">and</span> <span class="kw">not</span> <span class="fn">all</span>(<span class="kw">self</span>.meta[i].<span class="fn">get</span>(k)==v <span class="kw">for</span> k,v <span class="kw">in</span> where.<span class="fn">items</span>()):
                    <span class="kw">continue</span>
                kept.<span class="fn">append</span>((<span class="kw">self</span>.ids[i], <span class="kw">self</span>.docs[i], <span class="fn">round</span>(<span class="fn">float</span>(d), <span class="num">3</span>)))
                <span class="kw">if</span> <span class="fn">len</span>(kept) == n_results: <span class="kw">break</span>
            out.<span class="fn">append</span>(kept)
        <span class="kw">return</span> out

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">30</span>))
labels   = <span class="fn">list</span>(df_reviews[<span class="str">"sentiment"</span>].<span class="fn">head</span>(<span class="num">30</span>))
col = <span class="fn">MiniChromaCollection</span>()
col.<span class="fn">add</span>(documents=texts_in, ids=[f<span class="str">"r{i}"</span> <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">30</span>)],
        metadatas=[{<span class="str">"sentiment"</span>: s} <span class="kw">for</span> s <span class="kw">in</span> labels])
<span class="fn">print</span>(col.<span class="fn">query</span>([<span class="str">"this product is amazing"</span>], n_results=<span class="num">3</span>, where={<span class="str">"sentiment"</span>:<span class="str">"positive"</span>}))
</code></pre></div>
</div>

<p class="l-text"><strong>MiniChromaCollection, adım adım:</strong> 1) <code>TfidfVectorizer(max_features=2000)</code> Chroma'nın otomatik embedder'ının yerini alır, böylece tarayıcı içinde kalırız. 2) <code>add(documents, ids, metadatas)</code> paralel dizileri uzatır ve TF-IDF matrisini artı kosinüs <code>NearestNeighbors</code> indeksini yeniden fit eder. 3) <code>query(query_texts, n_results, where)</code> sorguyu dönüştürür, <code>3×n_results</code> aday ister, ardından saklı metadata'sı <code>where</code> dict'ini geçemeyenleri düşürür — Chroma'nın sonradan-filtre davranışını taklit eder. 4) Sürücü 30 yorumu sentiment etiketleriyle yükler ve "this product is amazing" sorgusuna en yakın 3 <em>positive</em> yorumu ister — Chroma'nın üretimde kullandığı çağrı şekli aynıdır.</p>


</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Karar Ağacı</h2>

<p class="l-text">Bir arkadaşım "hangi vektör DB?" diye yazdığında kullandığım gerçek akış şeması burada. Yukarıdan aşağıya yürü; ilk eşleşme kazanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zaten Postgres + &lt;10M vektör çalıştırıyor musun?</div><div class="card-body">→ <strong>pgvector</strong>. Bedava, JOIN'ler çalışır, bir sistem daha az. <code>maintenance_work_mem=8GB</code> ayarla, HNSW'yi <code>m=16, ef_construction=64</code> ile inşa et.</div></div>
<div class="calc-card"><div class="card-title">Prototipleme veya &lt;100k vektör, sadece-Python?</div><div class="card-body">→ <strong>Chroma</strong> (ya da sadece NumPy + FAISS). 3 satırlık API, diske kalıcı, bir günde gönder.</div></div>
<div class="calc-card"><div class="card-title">DevOps kapasitesi yok, altyapıyı unutmak istiyor musun?</div><div class="card-body">→ <strong>Pinecone Serverless</strong>. En yüksek $/vektör ama sıfır ops. Erken aşama startup'lar için iyi uyum.</div></div>
<div class="calc-card"><div class="card-title">Ağır filtreleme (multi-tenant SaaS)?</div><div class="card-body">→ <strong>Qdrant</strong>. Payload indeksleri sınıfının en iyisi. Kiracı başına &lt;1M vektör için tek bir VPS'te self-host yap.</div></div>
<div class="calc-card"><div class="card-title">Birinci sınıf hibrit + GraphQL'e ihtiyacın var mı?</div><div class="card-body">→ <strong>Weaviate</strong>. Yerleşik BM25, generatif modüller, olgun kurumsal SDK'ler.</div></div>
<div class="calc-card"><div class="card-title">10B+ vektör, adanmış platform takımı?</div><div class="card-body">→ <strong>Milvus</strong> (veya Zilliz Cloud). Milyarlar için tasarlandı. Gerçek Kubernetes karmaşıklığı — sadece gerçek ölçekte değer.</div></div>
<div class="calc-card"><div class="card-title">ML pipeline zaten Arrow/Parquet'te?</div><div class="card-body">→ <strong>LanceDB</strong>. Sürümlü veri kümeleri, zaman-yolculuk, DuckDB/Polars ile sıfır-kopya.</div></div>
</div>

<div class="calc-highlight">🎯 2026'da takımların %80'i için varsayılan: Postgres'in varsa <strong>pgvector</strong> ile başla, yoksa <strong>Qdrant self-hosted</strong>. Yönetilen bir servise (Pinecone, Weaviate Cloud, Zilliz) sadece ops maliyeti yönetilen faturayı aştığında geç — tipik olarak 10M vektör veya 7/24 çağrılma yükü etrafında.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Lab — Aynı İş Yükü, Üç Backend</h2>

<p class="l-text">API'lerin yakınsadığını yorumlar veri kümesini üç "sahte backend"e (Pinecone-stili, filtre ile Qdrant-stili, SQL ile pgvector-stili) indeksleyerek kanıtlayalım. Her çağrı &lt;10 satır ve sonuçlar bu ölçekte esasen aynı — bütün mesele bu: seçim operasyoneldir, algoritmik değil.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">import</span> numpy <span class="kw">as</span> np, sqlite3, json

texts_in  = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">50</span>))
labels_in = <span class="fn">list</span>(df_reviews[<span class="str">"sentiment"</span>].<span class="fn">head</span>(<span class="num">50</span>))
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">512</span>)
X = vec.<span class="fn">fit_transform</span>(texts_in).<span class="fn">toarray</span>().<span class="fn">astype</span>(np.float32)
X /= np.linalg.<span class="fn">norm</span>(X, axis=<span class="num">1</span>, keepdims=<span class="kw">True</span>) + <span class="num">1e-9</span>
query = vec.<span class="fn">transform</span>([<span class="str">"this product is amazing quality"</span>]).<span class="fn">toarray</span>()[<span class="num">0</span>]
query /= np.linalg.<span class="fn">norm</span>(query) + <span class="num">1e-9</span>

<span class="cm"># === Pinecone-stili ===</span>
sims = X @ query
top  = np.<span class="fn">argsort</span>(-sims)[:<span class="num">3</span>]
<span class="fn">print</span>(<span class="str">"Pinecone:"</span>, [(<span class="fn">int</span>(i), <span class="fn">round</span>(<span class="fn">float</span>(sims[i]),<span class="num">3</span>), labels_in[i]) <span class="kw">for</span> i <span class="kw">in</span> top])

<span class="cm"># === Qdrant-stili (knn'den ÖNCE filtrele) ===</span>
mask = np.<span class="fn">array</span>([s == <span class="str">"positive"</span> <span class="kw">for</span> s <span class="kw">in</span> labels_in])
cand = np.<span class="fn">where</span>(mask)[<span class="num">0</span>]
sims_f = X[cand] @ query
top_f  = cand[np.<span class="fn">argsort</span>(-sims_f)[:<span class="num">3</span>]]
<span class="fn">print</span>(<span class="str">"Qdrant  :"</span>, [(<span class="fn">int</span>(i), <span class="fn">round</span>(<span class="fn">float</span>(X[i] @ query),<span class="num">3</span>), labels_in[i]) <span class="kw">for</span> i <span class="kw">in</span> top_f])

<span class="cm"># === pgvector-stili (SQL benzeri) ===</span>
con = sqlite3.<span class="fn">connect</span>(<span class="str">":memory:"</span>)
con.<span class="fn">execute</span>(<span class="str">"CREATE TABLE r(id INT, label TEXT, emb TEXT)"</span>)
con.<span class="fn">executemany</span>(<span class="str">"INSERT INTO r VALUES (?,?,?)"</span>,
                [(i, labels_in[i], json.<span class="fn">dumps</span>(X[i].<span class="fn">tolist</span>())) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>)])
rows = con.<span class="fn">execute</span>(<span class="str">"SELECT id, label, emb FROM r WHERE label='positive'"</span>).<span class="fn">fetchall</span>()
scored = <span class="fn">sorted</span>(rows, key=<span class="kw">lambda</span> r: -np.<span class="fn">dot</span>(np.<span class="fn">asarray</span>(json.<span class="fn">loads</span>(r[<span class="num">2</span>])), query))[:<span class="num">3</span>]
<span class="fn">print</span>(<span class="str">"pgvector:"</span>, [(r[<span class="num">0</span>], <span class="fn">round</span>(<span class="fn">float</span>(np.<span class="fn">dot</span>(np.<span class="fn">asarray</span>(json.<span class="fn">loads</span>(r[<span class="num">2</span>])), query)),<span class="num">3</span>), r[<span class="num">1</span>])
                    <span class="kw">for</span> r <span class="kw">in</span> scored])
</code></pre></div>

<p class="l-text">Bunu çalıştır ve üçünün de örtüşen top-3 setleri döndürdüğünü göreceksin. Pinecone-stili versiyon filtresizdir (yani negatif yorumları içerebilir), Qdrant ve pgvector ise <code>positive</code>'a kısıtlar. Ders: küçük ölçekte algoritma aynıdır; DB seçimi ops, maliyet ve ergonomi ile ilgilidir — alaka değil.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sıradaki Adımlar</h2>

<p class="l-text">Artık vektör DB manzarasının çalışan zihinsel haritasına sahipsin. Yedi seçenek temiz şekilde bölünür: yönetilen basitlik için <strong>Pinecone</strong>, açık kaynak kurumsal için <strong>Weaviate</strong>, prototipler için <strong>Chroma</strong>, filtreleme için <strong>Qdrant</strong>, Postgres dükkânları için <strong>pgvector</strong>, gerçek ölçek için <strong>Milvus</strong>, Arrow-doğal ML için <strong>LanceDB</strong>. Bölüm 2-3'teki yetenek matrisi ve fiyatlandırma sayıları senin referans kartların — yer imine ekle.</p>

<p class="l-text">Sonraki derste "vektörler nerede yaşıyor?"dan "iyi nasıl alabilirim?"e geçeceğiz — hibrit arama (BM25 + dense), Reciprocal Rank Fusion, cross-encoder yeniden sıralayıcılar ve ColBERT geç etkileşim. Bu teknikler seçtiğin herhangi bir DB'nin üzerine %10-30 recall ekler ve demo-kalite RAG'ı üretim-kalite RAG'dan ayıran şeydir.</p>

<div class="calc-highlight">🚀 Ödev: karar ağacından mevcut projenle eşleşen DB'yi seç, yerel olarak yükle ve alanından 1000 dokümanı yeniden indeksle. p99 gecikme, kaba kuvvete karşı recall@10 ve disk ayak izini ölç. O üç sayıyı 5. derse getir — hibrit + rerank ile geliştireceğin temel çizgi onlar.</div>
</div>`
};
