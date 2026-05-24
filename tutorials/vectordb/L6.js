window.VECTORDB_L6 = {
en: `<p class="l-text"><strong>You shipped a vector index last week. Today the embedding model changed, 200k new docs landed, 8k were deleted, and product wants per-customer namespaces.</strong> Welcome to the operational reality of vector databases — where the static "build once, serve forever" mental model breaks down. Real indexes <em>mutate</em>: HNSW graphs need new nodes wired into existing layers, IVF cells drift as data distribution shifts, deletes leave tombstones that bloat memory until compaction kicks in.</p>

<p class="l-text">In this lesson we cover the four hardest moving parts: <strong>incremental updates</strong> (HNSW vs IVF tradeoffs), <strong>deletes &amp; compaction</strong> (Qdrant tombstones, optimizer threads), <strong>reindexing strategies</strong> (in-place rebuild vs blue/green swap vs incremental migration), and <strong>multi-tenancy</strong> (namespaces in Pinecone, collections in Qdrant, classes in Weaviate). We close with the most painful operation in the field: migrating from <code>text-embedding-ada-002</code> to <code>text-embedding-3-large</code> — a re-embed of every document.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Add &amp; delete vectors incrementally without rebuilding the whole index</li>
<li>Manage tombstones and trigger compaction (Qdrant optimizer threads, Milvus compactor)</li>
<li>Choose between in-place reindex, blue/green swap, and dual-write migration</li>
<li>Shard by consistent hashing or range, partition multi-tenant data safely</li>
<li>Plan an embedding-model migration (ada-002 → 3-large) without downtime</li>
<li>Version embeddings so old and new vectors can coexist during cutover</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Vector Indexes Are Hard to Update</h2>

<p class="l-text">A B-tree splits a leaf and life goes on. An HNSW graph is different — every new node walks down through the layers, picks <code>M</code> neighbors at each level, and creates bidirectional edges. If you stream millions of inserts, the upper layers degrade unless you carefully tune <code>efConstruction</code>. IVF is even less friendly: cluster centroids were fit on the original distribution, so a wave of new data lands in already-saturated cells and recall slowly drops.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">HNSW inserts</div><div class="card-body">O(log N) per insert, graph stays mostly hot. Concurrency-friendly. Deletes are soft only.</div></div>
<div class="calc-card"><div class="card-title">IVF inserts</div><div class="card-body">Cheap append, but cells drift. Periodic re-clustering needed if distribution shifts.</div></div>
<div class="calc-card"><div class="card-title">PQ codes</div><div class="card-body">Codebooks frozen at train time. New data quantizes against stale centroids — recall slowly degrades.</div></div>
<div class="calc-card"><div class="card-title">Flat (brute force)</div><div class="card-body">Trivial to update — append vector, recall always 100%. Falls apart past ~1M vectors.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">💡 <strong>Rule of thumb:</strong> if your insert rate &gt; 10% of corpus size per month, plan a reindex schedule. HNSW handles streaming inserts gracefully, IVF/PQ degrade silently.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Incremental Inserts in HNSW</h2>

<p class="l-text">HNSW is the de facto standard for streaming workloads precisely because inserts are local. Every new vector enters at a randomly chosen top layer and greedily descends, building edges to its <code>M</code> nearest neighbors at each level. There is no "rebuild" operation needed for normal growth.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hnswlib
<span class="kw">import</span> numpy <span class="kw">as</span> np

dim = <span class="num">384</span>
index = hnswlib.<span class="fn">Index</span>(space=<span class="str">'cosine'</span>, dim=dim)
index.<span class="fn">init_index</span>(max_elements=1_000_000, ef_construction=<span class="num">200</span>, M=<span class="num">32</span>)
index.<span class="fn">set_ef</span>(<span class="num">64</span>)

<span class="cm"># Initial bulk load</span>
init_vecs = np.random.<span class="fn">rand</span>(50_000, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
index.<span class="fn">add_items</span>(init_vecs, ids=np.<span class="fn">arange</span>(50_000))

<span class="cm"># Streaming inserts — same API, just append</span>
new_vecs = np.random.<span class="fn">rand</span>(1_000, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
new_ids = np.<span class="fn">arange</span>(50_000, 51_000)
index.<span class="fn">add_items</span>(new_vecs, ids=new_ids)

<span class="cm"># Resize when approaching max_elements</span>
index.<span class="fn">resize_index</span>(2_000_000)
<span class="fn">print</span>(index.<span class="fn">get_current_count</span>())</code></pre></div>

<p class="l-text">Note <code>max_elements</code> — HNSW pre-allocates the graph storage. Resize is cheap but requires extra memory during the copy. In production set <code>max_elements</code> to ~2x your projected size and resize on milestones.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Simulate incremental insert with numpy concat + sklearn NearestNeighbors re-fit.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
dim = <span class="num">32</span>
vecs = np.random.<span class="fn">rand</span>(<span class="num">200</span>, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
ids  = <span class="fn">list</span>(<span class="fn">range</span>(<span class="num">200</span>))

nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(vecs)
<span class="fn">print</span>(<span class="str">'initial size:'</span>, <span class="fn">len</span>(vecs))

<span class="cm"># Streaming batches arrive</span>
<span class="kw">for</span> batch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    new = np.random.<span class="fn">rand</span>(<span class="num">50</span>, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
    vecs = np.<span class="fn">vstack</span>([vecs, new])
    ids.<span class="fn">extend</span>(<span class="fn">range</span>(<span class="fn">len</span>(ids), <span class="fn">len</span>(ids)+<span class="num">50</span>))
    nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(vecs)
    <span class="fn">print</span>(f<span class="str">'batch {batch+1}: total={len(vecs)}'</span>)

q = np.random.<span class="fn">rand</span>(<span class="num">1</span>, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
d, i = nn.<span class="fn">kneighbors</span>(q)
<span class="fn">print</span>(<span class="str">'top5 ids:'</span>, [ids[x] <span class="kw">for</span> x <span class="kw">in</span> i[<span class="num">0</span>]])</code></pre></div>
</div>

<p class="l-text"><strong>Streaming insert simulation, step by step:</strong> 1) Seed the index with 200 random 32-dim vectors and fit <code>NearestNeighbors(metric='cosine')</code>. 2) The <code>for batch in range(3)</code> loop generates 50 fresh vectors, appends them with <code>np.vstack</code>, extends the parallel <code>ids</code> list, and rebuilds the NN index — this rebuild is the cost a real engine pays when it can't append in place. 3) Print confirms the total grows 200 → 250 → 300 → 350. 4) The final <code>nn.kneighbors(q)</code> proves the freshly indexed batch is queryable, returning top-5 ids in the original ID namespace.</p>


</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Deletes &amp; Tombstones</h2>

<p class="l-text">Almost no production vector index supports true delete. HNSW removal would require rewiring the graph; IVF removal would invalidate cell statistics. Instead engines use <strong>tombstones</strong> — a deleted bit on the vector that filters it from search results but leaves the data on disk. Eventually a <strong>compaction</strong> job rewrites the segment without the tombstoned rows.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Qdrant</div><div class="card-body">Soft delete + optimizer threads. <code>vacuum_min_vector_number</code> triggers segment rebuild.</div></div>
<div class="calc-card"><div class="card-title">Milvus</div><div class="card-body">Delete log per segment, compactor merges segments and drops tombstoned rows.</div></div>
<div class="calc-card"><div class="card-title">Pinecone</div><div class="card-body">Managed — opaque to user. Deletes propagate within seconds, no manual compaction.</div></div>
<div class="calc-card"><div class="card-title">pgvector</div><div class="card-body">Standard Postgres MVCC + VACUUM. Index entries cleared on next maintenance cycle.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">⚠️ <strong>Tombstone bloat:</strong> if you delete 30% of vectors and never compact, you waste 30% RAM <em>and</em> p99 latency rises because the graph still walks dead nodes. Schedule compaction during low-traffic windows.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">from</span> qdrant_client.models <span class="kw">import</span> PointIdsList, OptimizersConfigDiff

client = <span class="fn">QdrantClient</span>(url=<span class="str">'http://localhost:6333'</span>)

<span class="cm"># Soft delete (tombstone)</span>
client.<span class="fn">delete</span>(
    collection_name=<span class="str">'docs'</span>,
    points_selector=<span class="fn">PointIdsList</span>(points=[<span class="num">101</span>, <span class="num">102</span>, <span class="num">103</span>])
)

<span class="cm"># Trigger aggressive compaction when &gt; 20% of segment is dead</span>
client.<span class="fn">update_collection</span>(
    collection_name=<span class="str">'docs'</span>,
    optimizer_config=<span class="fn">OptimizersConfigDiff</span>(
        deleted_threshold=<span class="num">0.2</span>,
        vacuum_min_vector_number=10_000,
        max_optimization_threads=<span class="num">2</span>,
    )
)</code></pre></div>

<p class="l-text"><strong>Soft delete + compaction config:</strong> 1) <code>QdrantClient(url=...)</code> opens the client. 2) <code>client.delete(collection_name='docs', points_selector=PointIdsList(points=[101,102,103]))</code> issues a soft delete — Qdrant marks the three IDs as tombstoned but keeps the bytes on disk. 3) <code>client.update_collection(..., OptimizersConfigDiff(deleted_threshold=0.2, vacuum_min_vector_number=10_000, max_optimization_threads=2))</code> tells the optimizer to rewrite any segment whose dead ratio exceeds 20% as long as it has at least 10k vectors, using two background threads. 4) Compaction then runs asynchronously without blocking queries.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tombstone simulation with a deleted-bit array, then compaction rewrites the index.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">1</span>)
n, dim = <span class="num">1000</span>, <span class="num">16</span>
vecs = np.random.<span class="fn">rand</span>(n, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
ids  = np.<span class="fn">arange</span>(n)
deleted = np.<span class="fn">zeros</span>(n, dtype=<span class="fn">bool</span>)

<span class="cm"># Soft-delete 250 random points</span>
to_delete = np.random.<span class="fn">choice</span>(n, <span class="num">250</span>, replace=<span class="kw">False</span>)
deleted[to_delete] = <span class="kw">True</span>
<span class="fn">print</span>(<span class="str">'alive after delete:'</span>, (~deleted).<span class="fn">sum</span>(), <span class="str">'/'</span>, n)

<span class="cm"># Search filters out tombstones</span>
q = np.random.<span class="fn">rand</span>(dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
sims = vecs @ q
sims[deleted] = -np.inf
top5 = np.<span class="fn">argsort</span>(-sims)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">'top5 (alive only):'</span>, top5)

<span class="cm"># Compaction: rewrite segment dropping dead rows</span>
keep = ~deleted
vecs = vecs[keep]; ids = ids[keep]
deleted = np.<span class="fn">zeros</span>(<span class="fn">len</span>(vecs), dtype=<span class="fn">bool</span>)
<span class="fn">print</span>(<span class="str">'after compaction:'</span>, <span class="fn">len</span>(vecs), <span class="str">'rows, 0 tombstones'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Hand-rolled tombstone + compaction, step by step:</strong> 1) Create 1000 random 16-dim vectors plus a parallel <code>deleted</code> boolean array — the literal tombstone bit each engine maintains. 2) <code>deleted[to_delete] = True</code> soft-deletes 250 random rows; the live count print confirms 750 survive. 3) During search, <code>sims = vecs @ q</code> still scores every row, but <code>sims[deleted] = -np.inf</code> guarantees tombstoned vectors never enter the top-k. 4) Compaction is just <code>vecs[keep]; ids[keep]</code> — rewriting the arrays without dead rows and resetting <code>deleted</code> to all zeros, exactly mirroring what Qdrant's optimizer does on disk.</p>


</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Reindexing Strategies</h2>

<p class="l-text">Eventually you outgrow the index — wrong <code>M</code>, wrong distance metric, new embedding dim, or just too many tombstones to compact away. Three patterns dominate:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">In-place rebuild</div><div class="card-body">Stop writes, rebuild, resume. Simplest, but causes downtime. Only viable for small collections (&lt;10M).</div></div>
<div class="calc-card"><div class="card-title">Blue/green swap</div><div class="card-body">Build new index in parallel, atomically swap aliases when ready. Zero downtime, doubles storage cost during build.</div></div>
<div class="calc-card"><div class="card-title">Dual-write migration</div><div class="card-body">App writes to old + new simultaneously. Backfill old data into new. Switch reads when caught up. Best for live streams.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🛠️ <strong>Pattern in practice:</strong> Pinecone aliases, Qdrant collection rename, Weaviate <code>backup &amp; restore</code> into new class — all enable blue/green. Always validate recall@10 on a held-out query set before flipping the alias.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Blue/green pattern with Qdrant aliases</span>
<span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">from</span> qdrant_client.models <span class="kw">import</span> CreateAlias, DeleteAlias, ChangeAliasesOperation

c = <span class="fn">QdrantClient</span>(url=<span class="str">'http://localhost:6333'</span>)

<span class="cm"># Step 1: build new collection 'docs_v2' with better config</span>
<span class="cm"># Step 2: backfill all vectors into docs_v2</span>
<span class="cm"># Step 3: atomic alias flip</span>
c.<span class="fn">update_collection_aliases</span>(change_aliases_operations=[
    <span class="fn">ChangeAliasesOperation</span>(delete_alias=<span class="fn">DeleteAlias</span>(alias_name=<span class="str">'docs'</span>)),
    <span class="fn">ChangeAliasesOperation</span>(create_alias=<span class="fn">CreateAlias</span>(
        collection_name=<span class="str">'docs_v2'</span>, alias_name=<span class="str">'docs'</span>)),
])
<span class="cm"># App keeps querying 'docs' alias — now points to v2.</span>
<span class="cm"># Step 4: keep docs_v1 around for 24h as rollback safety net.</span></code></pre></div>

<p class="l-text"><strong>Blue/green alias flip:</strong> 1) <code>QdrantClient(url=...)</code> connects to the cluster. 2) The numbered comments outline the prerequisite work — create <code>docs_v2</code> with the better config, backfill all vectors into it, validate recall. 3) <code>c.update_collection_aliases([...])</code> is the atomic step: a single <code>ChangeAliasesOperation</code> deletes the alias <code>docs</code> from <code>docs_v1</code> and another creates it on <code>docs_v2</code> in the same transaction. 4) The application keeps querying the <code>docs</code> alias — now backed by v2 — without redeploys; keeping v1 around for 24h gives you a one-line rollback path if metrics regress.</p>
</div>


<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sharding: Consistent Hashing vs Range</h2>

<p class="l-text">Past ~50M vectors a single node cannot serve queries within latency SLOs. You shard. Two strategies dominate vector workloads:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Consistent hashing</div><div class="card-body">Hash(doc_id) → shard. Even distribution. Adding a node only moves 1/N of data. No locality.</div></div>
<div class="calc-card"><div class="card-title">Range partitioning</div><div class="card-body">By tenant_id, date, or geohash. Co-locates related queries. Risk: hot shards if range is skewed.</div></div>
<div class="calc-card"><div class="card-title">Vector-aware (semantic)</div><div class="card-body">Cluster vectors first, ship each cluster to one shard. Queries hit only K shards via centroid. Hard to balance.</div></div>
<div class="calc-card"><div class="card-title">Replication</div><div class="card-body">Orthogonal. Each shard is replicated 2-3x for HA. Reads load-balanced across replicas.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">📈 <strong>Query fanout:</strong> with N shards, every query hits all N (scatter-gather) unless your sharding is vector-aware. p99 latency = max(p99 across shards), not average. More shards → higher tail latency.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Multi-Tenant Namespaces</h2>

<p class="l-text">SaaS applications need <strong>tenant isolation</strong> — Customer A's vectors must never appear in Customer B's results, both for correctness and compliance (SOC2, GDPR). Three architectural patterns map onto each major engine:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pinecone namespaces</div><div class="card-body">Lightweight partition inside one index. Free, instant, no config. Up to ~10k namespaces per index.</div></div>
<div class="calc-card"><div class="card-title">Qdrant collections</div><div class="card-body">Heavier — each tenant gets own collection. Strong isolation, separate quotas. Hundreds OK, thousands costly.</div></div>
<div class="calc-card"><div class="card-title">Weaviate classes</div><div class="card-body">Schema-bound. Each class is a tenant. v1.20+ added native multi-tenancy with cheap class duplication.</div></div>
<div class="calc-card"><div class="card-title">Filter-based (worst)</div><div class="card-body">One global index + <code>WHERE tenant_id=...</code> filter. Easiest to build, but tenant data leaks via timing/recall.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Pinecone: namespace per tenant inside one index</span>
<span class="kw">from</span> pinecone <span class="kw">import</span> Pinecone
pc = <span class="fn">Pinecone</span>(api_key=<span class="str">'...'</span>)
idx = pc.<span class="fn">Index</span>(<span class="str">'saas-prod'</span>)

<span class="cm"># Write to tenant_42 namespace</span>
idx.<span class="fn">upsert</span>(vectors=[(<span class="str">'doc-1'</span>, vec, {<span class="str">'title'</span>: <span class="str">'Q3 report'</span>})],
           namespace=<span class="str">'tenant_42'</span>)

<span class="cm"># Read only from tenant_42 — physically isolated</span>
res = idx.<span class="fn">query</span>(vector=qvec, top_k=<span class="num">10</span>, namespace=<span class="str">'tenant_42'</span>)
<span class="cm"># tenant_43's data is invisible, no filter cost</span></code></pre></div>

<p class="l-text"><strong>Pinecone namespace per tenant:</strong> 1) <code>Pinecone(api_key=...)</code> opens the client and <code>pc.Index('saas-prod')</code> grabs a handle to the single shared index. 2) <code>idx.upsert(..., namespace='tenant_42')</code> writes the vector inside a logical partition; Pinecone stores each namespace's vectors in their own posting lists. 3) <code>idx.query(vector=qvec, top_k=10, namespace='tenant_42')</code> scans only that namespace at query time — tenant 43's vectors are physically unreachable. 4) Because Pinecone enforces the partition at the storage layer there is no extra filter cost, unlike the <code>WHERE tenant_id=...</code> anti-pattern.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Multi-tenant via dict {tenant_id: separate index}. Each tenant has its own NN model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

np.random.<span class="fn">seed</span>(<span class="num">2</span>)
tenants = {}

<span class="kw">def</span> <span class="fn">upsert</span>(tenant_id, vecs, ids):
    <span class="kw">if</span> tenant_id <span class="kw">not</span> <span class="kw">in</span> tenants:
        tenants[tenant_id] = {<span class="str">'vecs'</span>: vecs, <span class="str">'ids'</span>: <span class="fn">list</span>(ids)}
    <span class="kw">else</span>:
        t = tenants[tenant_id]
        t[<span class="str">'vecs'</span>] = np.<span class="fn">vstack</span>([t[<span class="str">'vecs'</span>], vecs])
        t[<span class="str">'ids'</span>].<span class="fn">extend</span>(ids)
    t = tenants[tenant_id]
    t[<span class="str">'nn'</span>] = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">3</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(t[<span class="str">'vecs'</span>])

<span class="kw">def</span> <span class="fn">query</span>(tenant_id, q):
    t = tenants[tenant_id]
    d, i = t[<span class="str">'nn'</span>].<span class="fn">kneighbors</span>(q.<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>))
    <span class="kw">return</span> [t[<span class="str">'ids'</span>][x] <span class="kw">for</span> x <span class="kw">in</span> i[<span class="num">0</span>]]

<span class="fn">upsert</span>(<span class="str">'tenant_42'</span>, np.random.<span class="fn">rand</span>(<span class="num">50</span>, <span class="num">8</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>), <span class="fn">range</span>(<span class="num">50</span>))
<span class="fn">upsert</span>(<span class="str">'tenant_43'</span>, np.random.<span class="fn">rand</span>(<span class="num">40</span>, <span class="num">8</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>), <span class="fn">range</span>(<span class="num">40</span>))

q = np.random.<span class="fn">rand</span>(<span class="num">8</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>)
<span class="fn">print</span>(<span class="str">'tenant_42:'</span>, <span class="fn">query</span>(<span class="str">'tenant_42'</span>, q))
<span class="fn">print</span>(<span class="str">'tenant_43:'</span>, <span class="fn">query</span>(<span class="str">'tenant_43'</span>, q))
<span class="fn">print</span>(<span class="str">'isolation: separate indexes per tenant'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Per-tenant NN index, step by step:</strong> 1) <code>tenants</code> is a dict whose values are <code>{vecs, ids, nn}</code> — one full NearestNeighbors index per tenant, the strictest isolation pattern. 2) <code>upsert(tenant_id, vecs, ids)</code> either creates a fresh entry or <code>np.vstack</code>s onto an existing one, then refits the per-tenant <code>NearestNeighbors(metric='cosine')</code>. 3) <code>query(tenant_id, q)</code> only touches that tenant's <code>nn</code> — there is no shared structure to leak across tenants. 4) The driver upserts 50 docs into <code>tenant_42</code> and 40 into <code>tenant_43</code> and runs the same query on both; the print shows two independent top-3 results, confirming isolation.</p>


</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Versioning Embeddings &amp; Model Migration</h2>

<p class="l-text">The single most expensive vector DB operation: switching embedding models. When OpenAI deprecated <code>text-embedding-ada-002</code> in favor of <code>text-embedding-3-large</code>, every vector in production became invalid because the new model lives in a different vector space — cosine similarity between them is meaningless. You must re-embed every document.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cost reality</div><div class="card-body">10M docs × 500 tokens × $0.13/M tokens (3-large) ≈ $650 just for embedding API.</div></div>
<div class="calc-card"><div class="card-title">Time reality</div><div class="card-body">10M docs / 3000 RPM rate limit ≈ 56 hours, even with batching. Plan for days.</div></div>
<div class="calc-card"><div class="card-title">Dimension change</div><div class="card-body">ada-002 = 1536 dims. 3-large = 3072 dims. Index must be rebuilt — old/new vectors cannot coexist in same collection.</div></div>
<div class="calc-card"><div class="card-title">Quality lift</div><div class="card-body">3-large MTEB +6% over ada-002. Worth migration for retrieval-critical apps. Marginal for chat memory.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎯 <strong>Migration playbook:</strong> (1) Tag every vector with <code>embedding_model_id</code> in metadata. (2) Build new collection with new dim. (3) Re-embed in batches, dual-write. (4) Run shadow eval — compare recall@10 on a labeled query set. (5) Flip alias when new collection beats old by &gt;2%. (6) Keep old collection 7 days for rollback.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Migration: ada-002 (1536d) → text-embedding-3-large (3072d)</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">from</span> qdrant_client.models <span class="kw">import</span> VectorParams, Distance, PointStruct

oai = <span class="fn">OpenAI</span>()
qd  = <span class="fn">QdrantClient</span>(url=<span class="str">'http://localhost:6333'</span>)

<span class="cm"># 1. Create v2 collection with new dimension</span>
qd.<span class="fn">create_collection</span>(
    collection_name=<span class="str">'docs_v2'</span>,
    vectors_config=<span class="fn">VectorParams</span>(size=<span class="num">3072</span>, distance=Distance.COSINE),
)

<span class="cm"># 2. Stream re-embed in batches of 500</span>
<span class="kw">def</span> <span class="fn">re_embed_batch</span>(docs):
    texts = [d[<span class="str">'text'</span>] <span class="kw">for</span> d <span class="kw">in</span> docs]
    resp  = oai.embeddings.<span class="fn">create</span>(model=<span class="str">'text-embedding-3-large'</span>, <span class="fn">input</span>=texts)
    points = [<span class="fn">PointStruct</span>(
        id=d[<span class="str">'id'</span>],
        vector=resp.data[i].embedding,
        payload={**d[<span class="str">'payload'</span>], <span class="str">'embedding_model'</span>: <span class="str">'text-embedding-3-large'</span>}
    ) <span class="kw">for</span> i, d <span class="kw">in</span> <span class="fn">enumerate</span>(docs)]
    qd.<span class="fn">upsert</span>(collection_name=<span class="str">'docs_v2'</span>, points=points)

<span class="cm"># 3. After backfill: shadow-eval, then alias flip (see section 4).</span></code></pre></div>

<p class="l-text"><strong>Migration walkthrough:</strong> 1) <code>QdrantClient(url=...)</code> connects to the live cluster. 2) <code>create_collection('docs_v2', size=3072)</code> provisions a brand-new collection with the larger 3-large dimension — the old <code>docs_v1</code> stays intact. 3) <code>re_embed_batch(docs)</code> calls <code>oai.embeddings.create('text-embedding-3-large')</code> on 500 texts and writes the resulting <code>PointStruct</code> objects with the new vector plus a stamped <code>embedding_model</code> payload. 4) Once backfill finishes you run shadow-eval against <code>docs_v2</code> and then flip the alias from §4.</p>
</div>


<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Operational Checklist</h2>

<p class="l-text">Things that bite teams in production. Pin this list above your monitoring dashboard.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">✅ Tombstone ratio &lt; 20%</div><div class="card-body">Alert if any segment exceeds. Schedule compaction nightly during low traffic.</div></div>
<div class="calc-card"><div class="card-title">✅ Recall@10 baseline</div><div class="card-body">Held-out 1000 queries with ground truth. Re-run weekly. Alert on &gt;3% drop.</div></div>
<div class="calc-card"><div class="card-title">✅ Embedding model pinned</div><div class="card-body">Store <code>model_id</code> in metadata of every vector. No silent migrations.</div></div>
<div class="calc-card"><div class="card-title">✅ Tenant quota</div><div class="card-body">Per-namespace caps on vectors and QPS. One tenant cannot starve others.</div></div>
<div class="calc-card"><div class="card-title">✅ Backup before reindex</div><div class="card-body">Snapshot or export to S3 first. Reindex bugs are unrecoverable otherwise.</div></div>
<div class="calc-card"><div class="card-title">✅ Shadow test new index</div><div class="card-body">Mirror 1% of prod traffic to candidate. Compare top-K overlap before flip.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎓 <strong>Next lesson (L7):</strong> we cover the full ops layer — backups, monitoring stack (Prometheus/Grafana), cost dashboards, RBAC, capacity planning. Treat the vector DB like any other stateful production system.</div>
</div>`,
tr: `<p class="l-text"><strong>Geçen hafta bir vektör indeksini gönderdin. Bugün embedding modeli değişti, 200k yeni doküman geldi, 8k silindi ve ürün ekibi müşteri başına ad alanı istiyor.</strong> Vektör veritabanlarının operasyonel gerçekliğine hoş geldin — burada statik "bir kez kur, sonsuza dek sun" zihinsel modeli kırılır. Gerçek indeksler <em>mutasyona uğrar</em>: HNSW grafları mevcut katmanlara yeni düğümlerin bağlanmasını gerektirir, IVF hücreleri veri dağılımı kaydıkça kayar, silmeler sıkıştırma devreye girene kadar belleği şişiren tombstone'lar bırakır.</p>

<p class="l-text">Bu derste dört en zor hareketli parçayı kapsıyoruz: <strong>artımlı güncellemeler</strong> (HNSW vs IVF takasları), <strong>silmeler ve sıkıştırma</strong> (Qdrant tombstone'ları, optimizer thread'leri), <strong>yeniden indeksleme stratejileri</strong> (yerinde yeniden inşa vs blue/green takas vs artımlı migrasyon) ve <strong>çoklu-kiracılık</strong> (Pinecone'da ad alanları, Qdrant'ta koleksiyonlar, Weaviate'te sınıflar). Sahanın en acılı operasyonuyla kapatıyoruz: <code>text-embedding-ada-002</code>'den <code>text-embedding-3-large</code>'e migrasyon — her dokümanın yeniden embedding'i.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tüm indeksi yeniden inşa etmeden vektörleri artımlı olarak ekle ve sil</li>
<li>Tombstone'ları yönet ve sıkıştırmayı tetikle (Qdrant optimizer thread'leri, Milvus compactor)</li>
<li>Yerinde yeniden indeksleme, blue/green takas ve dual-write migrasyon arasında seç</li>
<li>Tutarlı hashleme veya aralıkla shard'la, çoklu-kiracılı veriyi güvenle bölümle</li>
<li>Bir embedding-model migrasyonunu (ada-002 → 3-large) kesintisiz planla</li>
<li>Eski ve yeni vektörlerin geçiş sırasında bir arada bulunabilmesi için embedding'leri sürümle</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Vektör İndeksleri Neden Güncellenmesi Zor</h2>

<p class="l-text">Bir B-tree bir yaprağı böler ve hayat devam eder. Bir HNSW grafı farklıdır — her yeni düğüm katmanlardan aşağı yürür, her seviyede <code>M</code> komşu seçer ve iki yönlü kenarlar oluşturur. Milyonlarca insert akıtırsan, <code>efConstruction</code>'ı dikkatlice ayarlamadıkça üst katmanlar bozulur. IVF daha az dosttur: küme centroid'leri orijinal dağılıma göre uyarlanmıştı, bu yüzden yeni veri dalgası zaten doymuş hücrelere iner ve recall yavaşça düşer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">HNSW eklemeleri</div><div class="card-body">Ekleme başına O(log N), graf çoğunlukla sıcak kalır. Eşzamanlılık dostu. Silmeler sadece soft.</div></div>
<div class="calc-card"><div class="card-title">IVF eklemeleri</div><div class="card-body">Ucuz ekleme, ama hücreler kayar. Dağılım kayarsa periyodik yeniden kümeleme gerekir.</div></div>
<div class="calc-card"><div class="card-title">PQ kodları</div><div class="card-body">Codebook'lar eğitim zamanında dondurulur. Yeni veri eski centroid'lere göre nicemlenir — recall yavaşça bozulur.</div></div>
<div class="calc-card"><div class="card-title">Flat (kaba kuvvet)</div><div class="card-body">Güncellemesi önemsiz — vektörü ekle, recall her zaman %100. ~1M vektör sonra dağılır.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">💡 <strong>Kabaca kural:</strong> insert oranın aylık korpus büyüklüğünün %10'undan fazlaysa, bir yeniden indeksleme programı planla. HNSW akıtmalı insert'leri zarafetle yönetir, IVF/PQ sessizce bozulur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. HNSW'de Artımlı Eklemeler</h2>

<p class="l-text">HNSW akıtmalı iş yükleri için fiili standarttır çünkü eklemeler yereldir. Her yeni vektör rastgele seçilen bir üst katmana girer ve açgözlü iner, her seviyede en yakın <code>M</code> komşusuna kenarlar inşa eder. Normal büyüme için "yeniden inşa" operasyonu gerekmez.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hnswlib
<span class="kw">import</span> numpy <span class="kw">as</span> np

dim = <span class="num">384</span>
index = hnswlib.<span class="fn">Index</span>(space=<span class="str">'cosine'</span>, dim=dim)
index.<span class="fn">init_index</span>(max_elements=1_000_000, ef_construction=<span class="num">200</span>, M=<span class="num">32</span>)
index.<span class="fn">set_ef</span>(<span class="num">64</span>)

<span class="cm"># Ilk toplu yukleme</span>
init_vecs = np.random.<span class="fn">rand</span>(50_000, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
index.<span class="fn">add_items</span>(init_vecs, ids=np.<span class="fn">arange</span>(50_000))

<span class="cm"># Akitmali eklemeler — ayni API, sadece ekle</span>
new_vecs = np.random.<span class="fn">rand</span>(1_000, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
new_ids = np.<span class="fn">arange</span>(50_000, 51_000)
index.<span class="fn">add_items</span>(new_vecs, ids=new_ids)

<span class="cm"># max_elements'e yaklaşırken yeniden boyutlandır</span>
index.<span class="fn">resize_index</span>(2_000_000)
<span class="fn">print</span>(index.<span class="fn">get_current_count</span>())</code></pre></div>

<p class="l-text"><code>max_elements</code>'e dikkat — HNSW graf depolamasını önceden ayırır. Yeniden boyutlandırma ucuz ama kopyalama sırasında ekstra bellek gerektirir. Üretimde <code>max_elements</code>'i öngörülen büyüklüğünün ~2x'ine ayarla ve milestone'larda yeniden boyutlandır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">numpy concat + sklearn NearestNeighbors yeniden uyarlama ile artımlı insert'i simüle et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
dim = <span class="num">32</span>
vecs = np.random.<span class="fn">rand</span>(<span class="num">200</span>, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
ids  = <span class="fn">list</span>(<span class="fn">range</span>(<span class="num">200</span>))

nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(vecs)
<span class="fn">print</span>(<span class="str">'initial size:'</span>, <span class="fn">len</span>(vecs))

<span class="cm"># Akıtmalı batch'ler geliyor</span>
<span class="kw">for</span> batch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    new = np.random.<span class="fn">rand</span>(<span class="num">50</span>, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
    vecs = np.<span class="fn">vstack</span>([vecs, new])
    ids.<span class="fn">extend</span>(<span class="fn">range</span>(<span class="fn">len</span>(ids), <span class="fn">len</span>(ids)+<span class="num">50</span>))
    nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(vecs)
    <span class="fn">print</span>(f<span class="str">'batch {batch+1}: total={len(vecs)}'</span>)

q = np.random.<span class="fn">rand</span>(<span class="num">1</span>, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
d, i = nn.<span class="fn">kneighbors</span>(q)
<span class="fn">print</span>(<span class="str">'top5 ids:'</span>, [ids[x] <span class="kw">for</span> x <span class="kw">in</span> i[<span class="num">0</span>]])</code></pre></div>
</div>

<p class="l-text"><strong>Akıtmalı insert simülasyonu, adım adım:</strong> 1) İndeksi 200 rastgele 32-boyutlu vektörle tohumla ve <code>NearestNeighbors(metric='cosine')</code> fit et. 2) <code>for batch in range(3)</code> döngüsü 50 taze vektör üretir, <code>np.vstack</code> ile ekler, paralel <code>ids</code> listesini uzatır ve NN indeksini yeniden fit eder — bu yeniden inşa, gerçek bir motorun yerinde ekleyemediğinde ödediği maliyettir. 3) Print toplamın 200 → 250 → 300 → 350 büyüdüğünü doğrular. 4) Son <code>nn.kneighbors(q)</code> yeni indekslenen partinin sorgulanabilir olduğunu kanıtlar; orijinal ID ad alanında top-5 kimliği döner.</p>


</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Silmeler ve Tombstone'lar</h2>

<p class="l-text">Neredeyse hiçbir üretim vektör indeksi gerçek silmeyi desteklemez. HNSW kaldırma grafı yeniden bağlamayı gerektirir; IVF kaldırma hücre istatistiklerini geçersiz kılar. Bunun yerine motorlar <strong>tombstone</strong>'ları kullanır — vektörü arama sonuçlarından filtreleyen ama veriyi diskte bırakan silinmiş bir bit. Sonunda bir <strong>sıkıştırma</strong> işi tombstone'lanan satırlar olmadan segmenti yeniden yazar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Qdrant</div><div class="card-body">Soft delete + optimizer thread'leri. <code>vacuum_min_vector_number</code> segment yeniden inşasını tetikler.</div></div>
<div class="calc-card"><div class="card-title">Milvus</div><div class="card-body">Segment başına silme log'u, compactor segmentleri birleştirir ve tombstone'lanan satırları atar.</div></div>
<div class="calc-card"><div class="card-title">Pinecone</div><div class="card-body">Yönetilen — kullanıcıya opak. Silmeler saniyeler içinde yayılır, manuel sıkıştırma yok.</div></div>
<div class="calc-card"><div class="card-title">pgvector</div><div class="card-body">Standart Postgres MVCC + VACUUM. İndeks girişleri sonraki bakım döngüsünde temizlenir.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">⚠️ <strong>Tombstone şişmesi:</strong> vektörlerin %30'unu silersen ve hiç sıkıştırmazsan, %30 RAM <em>ve</em> p99 gecikme yükselir çünkü graf hâlâ ölü düğümlerde yürür. Düşük-trafik pencerelerinde sıkıştırma planla.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">from</span> qdrant_client.models <span class="kw">import</span> PointIdsList, OptimizersConfigDiff

client = <span class="fn">QdrantClient</span>(url=<span class="str">'http://localhost:6333'</span>)

<span class="cm"># Soft delete (tombstone)</span>
client.<span class="fn">delete</span>(
    collection_name=<span class="str">'docs'</span>,
    points_selector=<span class="fn">PointIdsList</span>(points=[<span class="num">101</span>, <span class="num">102</span>, <span class="num">103</span>])
)

<span class="cm"># Segmentin %20'sinden çoğu ölüyse agresif sıkıştırma tetikle</span>
client.<span class="fn">update_collection</span>(
    collection_name=<span class="str">'docs'</span>,
    optimizer_config=<span class="fn">OptimizersConfigDiff</span>(
        deleted_threshold=<span class="num">0.2</span>,
        vacuum_min_vector_number=10_000,
        max_optimization_threads=<span class="num">2</span>,
    )
)</code></pre></div>

<p class="l-text"><strong>Soft delete + sıkıştırma konfigi:</strong> 1) <code>QdrantClient(url=...)</code> istemciyi açar. 2) <code>client.delete(collection_name='docs', points_selector=PointIdsList(points=[101,102,103]))</code> soft delete gönderir — Qdrant üç kimliği tombstone'lar ama baytları diskte tutar. 3) <code>client.update_collection(..., OptimizersConfigDiff(deleted_threshold=0.2, vacuum_min_vector_number=10_000, max_optimization_threads=2))</code> optimizer'a en az 10k vektörü olan ve ölü oranı %20'yi geçen her segmenti iki arka plan thread'iyle yeniden yazmasını söyler. 4) Sıkıştırma sonra sorguları bloklamadan eşzamansız çalışır.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Silinmiş-bit dizisi ile tombstone simülasyonu, sonra sıkıştırma indeksi yeniden yazar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

np.random.<span class="fn">seed</span>(<span class="num">1</span>)
n, dim = <span class="num">1000</span>, <span class="num">16</span>
vecs = np.random.<span class="fn">rand</span>(n, dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
ids  = np.<span class="fn">arange</span>(n)
deleted = np.<span class="fn">zeros</span>(n, dtype=<span class="fn">bool</span>)

<span class="cm"># 250 rastgele noktayı soft-delete et</span>
to_delete = np.random.<span class="fn">choice</span>(n, <span class="num">250</span>, replace=<span class="kw">False</span>)
deleted[to_delete] = <span class="kw">True</span>
<span class="fn">print</span>(<span class="str">'alive after delete:'</span>, (~deleted).<span class="fn">sum</span>(), <span class="str">'/'</span>, n)

<span class="cm"># Arama tombstone'ları filtreler</span>
q = np.random.<span class="fn">rand</span>(dim).<span class="fn">astype</span>(<span class="str">'float32'</span>)
sims = vecs @ q
sims[deleted] = -np.inf
top5 = np.<span class="fn">argsort</span>(-sims)[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">'top5 (alive only):'</span>, top5)

<span class="cm"># Sıkıştırma: segmenti ölü satırlar olmadan yeniden yaz</span>
keep = ~deleted
vecs = vecs[keep]; ids = ids[keep]
deleted = np.<span class="fn">zeros</span>(<span class="fn">len</span>(vecs), dtype=<span class="fn">bool</span>)
<span class="fn">print</span>(<span class="str">'after compaction:'</span>, <span class="fn">len</span>(vecs), <span class="str">'rows, 0 tombstones'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Elle tombstone + sıkıştırma, adım adım:</strong> 1) 1000 rastgele 16-boyutlu vektör ve paralel <code>deleted</code> boolean dizisi kurarız — her motorun tuttuğu birebir tombstone biti. 2) <code>deleted[to_delete] = True</code> 250 rastgele satırı soft-delete eder; canlı sayım print'i 750'sinin hayatta kaldığını doğrular. 3) Arama sırasında <code>sims = vecs @ q</code> hâlâ tüm satırları skorlar, ama <code>sims[deleted] = -np.inf</code> tombstone'lu vektörlerin top-k'ya asla girmemesini garanti eder. 4) Sıkıştırma sadece <code>vecs[keep]; ids[keep]</code> — dizileri ölü satırlar olmadan yeniden yazıp <code>deleted</code>'i sıfırlamak — Qdrant'ın optimizer'ının diskte yaptığının aynısıdır.</p>


</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Yeniden İndeksleme Stratejileri</h2>

<p class="l-text">Sonunda indeksten çıkarsın — yanlış <code>M</code>, yanlış mesafe metriği, yeni embedding boyutu, ya da sadece sıkıştırılamayacak kadar çok tombstone. Üç desen hâkimdir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yerinde yeniden inşa</div><div class="card-body">Yazmaları durdur, yeniden inşa et, devam et. En basit, ama kesinti yapar. Sadece küçük koleksiyonlar (&lt;10M) için uygulanabilir.</div></div>
<div class="calc-card"><div class="card-title">Blue/green takas</div><div class="card-body">Paralel olarak yeni indeksi inşa et, hazır olduğunda alias'ları atomik takas et. Sıfır kesinti, inşa sırasında depolama maliyetini iki katına çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Dual-write migrasyon</div><div class="card-body">Uygulama eski + yeniye aynı anda yazar. Eski veriyi yeniye geri doldur. Yetiştiğinde okumaları değiştir. Canlı akışlar için en iyisi.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🛠️ <strong>Pratikte desen:</strong> Pinecone alias'ları, Qdrant koleksiyon yeniden adlandırma, Weaviate <code>backup &amp; restore</code> yeni sınıfa — hepsi blue/green'i etkinleştirir. Alias'ı çevirmeden önce her zaman tutulan bir sorgu kümesinde recall@10'u doğrula.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Qdrant alias'ları ile blue/green deseni</span>
<span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">from</span> qdrant_client.models <span class="kw">import</span> CreateAlias, DeleteAlias, ChangeAliasesOperation

c = <span class="fn">QdrantClient</span>(url=<span class="str">'http://localhost:6333'</span>)

<span class="cm"># Adım 1: daha iyi konfig ile yeni 'docs_v2' koleksiyon kur</span>
<span class="cm"># Adım 2: tüm vektörleri docs_v2'ye geri doldur</span>
<span class="cm"># Adım 3: atomik alias değişikliği</span>
c.<span class="fn">update_collection_aliases</span>(change_aliases_operations=[
    <span class="fn">ChangeAliasesOperation</span>(delete_alias=<span class="fn">DeleteAlias</span>(alias_name=<span class="str">'docs'</span>)),
    <span class="fn">ChangeAliasesOperation</span>(create_alias=<span class="fn">CreateAlias</span>(
        collection_name=<span class="str">'docs_v2'</span>, alias_name=<span class="str">'docs'</span>)),
])
<span class="cm"># Uygulama 'docs' alias'ını sorgulamaya devam ediyor — artık v2'ye işaret ediyor.</span>
<span class="cm"># Adım 4: docs_v1'i geri dönüş emniyet ağı olarak 24 saat tut.</span></code></pre></div>

<p class="l-text"><strong>Blue/green alias çevirmesi:</strong> 1) <code>QdrantClient(url=...)</code> kümeye bağlanır. 2) Numaralı yorumlar ön hazırlık işlerini özetler — daha iyi konfigle <code>docs_v2</code>'yi kur, tüm vektörleri ona geri doldur, recall'u doğrula. 3) <code>c.update_collection_aliases([...])</code> atomik adımdır: tek bir <code>ChangeAliasesOperation</code> <code>docs</code> alias'ını <code>docs_v1</code>'den siler, bir başkası aynı işlemde <code>docs_v2</code>'de oluşturur. 4) Uygulama <code>docs</code> alias'ını sorgulamaya devam eder — artık v2 tarafından besleniyor — yeniden dağıtım yok; v1'i 24 saat tutmak metrikler bozulursa tek satırlık geri-dönüş yolu sağlar.</p>
</div>


<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sharding: Tutarlı Hashleme vs Aralık</h2>

<p class="l-text">~50M vektör üzerinde tek bir sunucu sorguları gecikme SLO'ları içinde sunamaz. Shard'larsın. Vektör iş yüklerinde iki strateji hâkim:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tutarlı hashleme</div><div class="card-body">Hash(doc_id) → shard. Eşit dağılım. Bir düğüm eklemek sadece verinin 1/N'sini taşır. Yerellik yok.</div></div>
<div class="calc-card"><div class="card-title">Aralık bölümleme</div><div class="card-body">tenant_id, tarih veya geohash ile. İlgili sorguları birlikte yerleştirir. Risk: aralık çarpıksa sıcak shard'lar.</div></div>
<div class="calc-card"><div class="card-title">Vektör-farkında (anlamsal)</div><div class="card-body">Önce vektörleri kümele, her kümeyi bir shard'a gönder. Sorgular centroid üzerinden sadece K shard'a vurur. Dengelemesi zor.</div></div>
<div class="calc-card"><div class="card-title">Replikasyon</div><div class="card-body">Ortogonal. Her shard yüksek erişilebilirlik için 2-3x replikalanır. Okumalar replikalar arasında yük dengelenir.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">📈 <strong>Sorgu fan-out:</strong> N shard ile, sharding'in vektör-farkında olmadığı sürece her sorgu N'in tümüne vurur (scatter-gather). p99 gecikme = max(shard'lar arasındaki p99), ortalama değil. Daha çok shard → daha yüksek kuyruk gecikmesi.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Çoklu-Kiracılı Ad Alanları</h2>

<p class="l-text">SaaS uygulamaları <strong>kiracı izolasyonuna</strong> ihtiyaç duyar — Müşteri A'nın vektörleri hem doğruluk hem uyumluluk (SOC2, GDPR) için Müşteri B'nin sonuçlarında asla görünmemelidir. Üç mimari desen her büyük motora eşlenir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pinecone ad alanları</div><div class="card-body">Bir indeks içinde hafif bölüm. Bedava, anlık, konfig yok. İndeks başına ~10k ad alanına kadar.</div></div>
<div class="calc-card"><div class="card-title">Qdrant koleksiyonları</div><div class="card-body">Daha ağır — her kiracı kendi koleksiyonunu alır. Güçlü izolasyon, ayrı kotalar. Yüzlerce iyi, binlerce maliyetli.</div></div>
<div class="calc-card"><div class="card-title">Weaviate sınıfları</div><div class="card-body">Şemaya bağlı. Her sınıf bir kiracı. v1.20+ ucuz sınıf çoğaltmasıyla yerel çoklu-kiracılığı ekledi.</div></div>
<div class="calc-card"><div class="card-title">Filtre tabanlı (en kötü)</div><div class="card-body">Bir global indeks + <code>WHERE tenant_id=...</code> filtresi. İnşası en kolay, ama kiracı verisi zamanlama/recall ile sızabilir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Pinecone: bir indeks içinde kiracı başına ad alanı</span>
<span class="kw">from</span> pinecone <span class="kw">import</span> Pinecone
pc = <span class="fn">Pinecone</span>(api_key=<span class="str">'...'</span>)
idx = pc.<span class="fn">Index</span>(<span class="str">'saas-prod'</span>)

<span class="cm"># tenant_42 ad alanına yaz</span>
idx.<span class="fn">upsert</span>(vectors=[(<span class="str">'doc-1'</span>, vec, {<span class="str">'title'</span>: <span class="str">'Q3 report'</span>})],
           namespace=<span class="str">'tenant_42'</span>)

<span class="cm"># Sadece tenant_42'den oku — fiziksel olarak izole</span>
res = idx.<span class="fn">query</span>(vector=qvec, top_k=<span class="num">10</span>, namespace=<span class="str">'tenant_42'</span>)
<span class="cm"># tenant_43'ün verisi görünmez, filtre maliyeti yok</span></code></pre></div>

<p class="l-text"><strong>Kiracı başına Pinecone ad alanı:</strong> 1) <code>Pinecone(api_key=...)</code> istemciyi açar ve <code>pc.Index('saas-prod')</code> tek paylaşımlı indekse erişim sağlar. 2) <code>idx.upsert(..., namespace='tenant_42')</code> vektörü mantıksal bir bölüm içinde yazar; Pinecone her ad alanının vektörlerini kendi gönderim listelerinde saklar. 3) <code>idx.query(vector=qvec, top_k=10, namespace='tenant_42')</code> sorgu sırasında yalnızca o ad alanını tarar — kiracı 43'ün vektörleri fiziksel olarak erişilmezdir. 4) Pinecone bölümü depolama katmanında zorladığı için, <code>WHERE tenant_id=...</code> anti-deseninin aksine ekstra filtre maliyeti yoktur.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Dict {tenant_id: ayrı indeks} ile çoklu-kiracılı. Her kiracının kendi NN modeli var.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

np.random.<span class="fn">seed</span>(<span class="num">2</span>)
tenants = {}

<span class="kw">def</span> <span class="fn">upsert</span>(tenant_id, vecs, ids):
    <span class="kw">if</span> tenant_id <span class="kw">not</span> <span class="kw">in</span> tenants:
        tenants[tenant_id] = {<span class="str">'vecs'</span>: vecs, <span class="str">'ids'</span>: <span class="fn">list</span>(ids)}
    <span class="kw">else</span>:
        t = tenants[tenant_id]
        t[<span class="str">'vecs'</span>] = np.<span class="fn">vstack</span>([t[<span class="str">'vecs'</span>], vecs])
        t[<span class="str">'ids'</span>].<span class="fn">extend</span>(ids)
    t = tenants[tenant_id]
    t[<span class="str">'nn'</span>] = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">3</span>, metric=<span class="str">'cosine'</span>).<span class="fn">fit</span>(t[<span class="str">'vecs'</span>])

<span class="kw">def</span> <span class="fn">query</span>(tenant_id, q):
    t = tenants[tenant_id]
    d, i = t[<span class="str">'nn'</span>].<span class="fn">kneighbors</span>(q.<span class="fn">reshape</span>(<span class="num">1</span>, -<span class="num">1</span>))
    <span class="kw">return</span> [t[<span class="str">'ids'</span>][x] <span class="kw">for</span> x <span class="kw">in</span> i[<span class="num">0</span>]]

<span class="fn">upsert</span>(<span class="str">'tenant_42'</span>, np.random.<span class="fn">rand</span>(<span class="num">50</span>, <span class="num">8</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>), <span class="fn">range</span>(<span class="num">50</span>))
<span class="fn">upsert</span>(<span class="str">'tenant_43'</span>, np.random.<span class="fn">rand</span>(<span class="num">40</span>, <span class="num">8</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>), <span class="fn">range</span>(<span class="num">40</span>))

q = np.random.<span class="fn">rand</span>(<span class="num">8</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>)
<span class="fn">print</span>(<span class="str">'tenant_42:'</span>, <span class="fn">query</span>(<span class="str">'tenant_42'</span>, q))
<span class="fn">print</span>(<span class="str">'tenant_43:'</span>, <span class="fn">query</span>(<span class="str">'tenant_43'</span>, q))
<span class="fn">print</span>(<span class="str">'isolation: separate indexes per tenant'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Kiracı başına NN indeksi, adım adım:</strong> 1) <code>tenants</code> değerleri <code>{vecs, ids, nn}</code> olan bir dict — kiracı başına bir tam NearestNeighbors indeksi, en katı izolasyon deseni. 2) <code>upsert(tenant_id, vecs, ids)</code> ya taze bir giriş oluşturur ya da mevcut olana <code>np.vstack</code> ekler, sonra kiracı başına <code>NearestNeighbors(metric='cosine')</code>'i yeniden fit eder. 3) <code>query(tenant_id, q)</code> sadece o kiracının <code>nn</code>'ine dokunur — kiracılar arasında sızdıracak paylaşımlı bir yapı yoktur. 4) Sürücü <code>tenant_42</code>'ye 50 doküman, <code>tenant_43</code>'e 40 doküman ekler ve aynı sorguyu ikisinde de koşturur; print iki bağımsız top-3 sonuç gösterir, izolasyonu doğrular.</p>


</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Embedding Sürümleme ve Model Migrasyonu</h2>

<p class="l-text">En pahalı vektör veritabanı operasyonu: embedding modellerini değiştirmek. OpenAI <code>text-embedding-ada-002</code>'yi <code>text-embedding-3-large</code> lehine deprek ettiğinde, üretimdeki her vektör geçersiz oldu çünkü yeni model farklı bir vektör uzayında yaşıyor — aralarındaki kosinüs benzerliği anlamsız. Her dokümanı yeniden embed etmen gerekir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Maliyet gerçekliği</div><div class="card-body">10M doküman × 500 token × $0.13/M token (3-large) ≈ sadece embedding API için $650.</div></div>
<div class="calc-card"><div class="card-title">Zaman gerçekliği</div><div class="card-body">10M doküman / 3000 RPM hız sınırı ≈ 56 saat, batch ile bile. Günler için planla.</div></div>
<div class="calc-card"><div class="card-title">Boyut değişimi</div><div class="card-body">ada-002 = 1536 boyut. 3-large = 3072 boyut. İndeks yeniden inşa edilmeli — eski/yeni vektörler aynı koleksiyonda bir arada bulunamaz.</div></div>
<div class="calc-card"><div class="card-title">Kalite artışı</div><div class="card-body">3-large MTEB'de ada-002 üzerine +%6. Erişim-kritik uygulamalar için migrasyona değer. Chat hafızası için marjinal.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎯 <strong>Migrasyon kitapçığı:</strong> (1) Her vektörü metadata'da <code>embedding_model_id</code> ile etiketle. (2) Yeni boyutla yeni koleksiyon kur. (3) Batch'lerde yeniden embed et, dual-write. (4) Shadow eval çalıştır — etiketli sorgu kümesinde recall@10'u karşılaştır. (5) Yeni koleksiyon eskisini &gt;%2 yendiğinde alias'ı çevir. (6) Geri dönüş için eski koleksiyonu 7 gün tut.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Migrasyon: ada-002 (1536d) → text-embedding-3-large (3072d)</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">from</span> qdrant_client.models <span class="kw">import</span> VectorParams, Distance, PointStruct

oai = <span class="fn">OpenAI</span>()
qd  = <span class="fn">QdrantClient</span>(url=<span class="str">'http://localhost:6333'</span>)

<span class="cm"># 1. Yeni boyutla v2 koleksiyon oluştur</span>
qd.<span class="fn">create_collection</span>(
    collection_name=<span class="str">'docs_v2'</span>,
    vectors_config=<span class="fn">VectorParams</span>(size=<span class="num">3072</span>, distance=Distance.COSINE),
)

<span class="cm"># 2. 500'lük batch'lerde akıtarak yeniden embed</span>
<span class="kw">def</span> <span class="fn">re_embed_batch</span>(docs):
    texts = [d[<span class="str">'text'</span>] <span class="kw">for</span> d <span class="kw">in</span> docs]
    resp  = oai.embeddings.<span class="fn">create</span>(model=<span class="str">'text-embedding-3-large'</span>, <span class="fn">input</span>=texts)
    points = [<span class="fn">PointStruct</span>(
        id=d[<span class="str">'id'</span>],
        vector=resp.data[i].embedding,
        payload={**d[<span class="str">'payload'</span>], <span class="str">'embedding_model'</span>: <span class="str">'text-embedding-3-large'</span>}
    ) <span class="kw">for</span> i, d <span class="kw">in</span> <span class="fn">enumerate</span>(docs)]
    qd.<span class="fn">upsert</span>(collection_name=<span class="str">'docs_v2'</span>, points=points)

<span class="cm"># 3. Geri doldurmadan sonra: shadow-eval, sonra alias değişikliği (bölüm 4'e bak).</span></code></pre></div>

<p class="l-text"><strong>Migrasyonun adım adım akışı:</strong> 1) <code>QdrantClient(url=...)</code> canlı kümeye bağlanır. 2) <code>create_collection('docs_v2', size=3072)</code> yeni 3-large boyutu için bambaşka bir koleksiyon hazırlar — eski <code>docs_v1</code> hâlâ ayakta kalır. 3) <code>re_embed_batch(docs)</code> 500'erli partilerle <code>oai.embeddings.create('text-embedding-3-large')</code> çağırır ve dönen <code>PointStruct</code> kayıtlarını yeni vektör ile birlikte <code>embedding_model</code> payload damgası ekleyerek yazar. 4) Geri doldurma bittiğinde <code>docs_v2</code> üzerinde gölge-eval koşturup §4'teki alias çevirmesini yaparsın.</p>
</div>


<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Operasyonel Kontrol Listesi</h2>

<p class="l-text">Üretimde takımları ısıran şeyler. Bu listeyi izleme dashboard'unun üstüne sabitle.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">✅ Tombstone oranı &lt; %20</div><div class="card-body">Herhangi segment aşarsa uyar. Düşük trafikte gece sıkıştırma planla.</div></div>
<div class="calc-card"><div class="card-title">✅ Recall@10 temel çizgisi</div><div class="card-body">Ground truth ile tutulan 1000 sorgu. Haftalık yeniden çalıştır. &gt;%3 düşüşte uyar.</div></div>
<div class="calc-card"><div class="card-title">✅ Embedding modeli sabit</div><div class="card-body">Her vektörün metadata'sında <code>model_id</code>'yi sakla. Sessiz migrasyon yok.</div></div>
<div class="calc-card"><div class="card-title">✅ Kiracı kotası</div><div class="card-body">Ad alanı başına vektör ve QPS sınırları. Bir kiracı diğerlerini aç bırakamaz.</div></div>
<div class="calc-card"><div class="card-title">✅ Yeniden indekslemeden önce yedek</div><div class="card-body">Önce snapshot al veya S3'e dışa aktar. Yeniden indeksleme bug'ları aksi takdirde kurtarılamaz.</div></div>
<div class="calc-card"><div class="card-title">✅ Yeni indeksi shadow test</div><div class="card-body">Üretim trafiğinin %1'ini adaya yansıt. Çevirmeden önce top-K çakışmasını karşılaştır.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎓 <strong>Sonraki ders (L7):</strong> tam ops katmanını kapsıyoruz — yedekler, izleme yığını (Prometheus/Grafana), maliyet dashboard'ları, RBAC, kapasite planlaması. Vektör veritabanını diğer durumlu üretim sistemleri gibi ele al.</div>
</div>`
};
