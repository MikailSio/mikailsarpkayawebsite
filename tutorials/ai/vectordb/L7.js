window.VECTORDB_L7 = {
en: `<p class="l-text"><strong>3 AM. PagerDuty fires: p99 latency on the search service jumped from 80ms to 2.4s.</strong> Recall is still fine, throughput is normal, but the tail is destroying the chat UX. You SSH into the box — and realize you have no metrics on the vector DB itself, no per-tenant breakdown, no recent backup if you need to restore. This is the lesson where you stop treating the vector index as a black box.</p>

<p class="l-text">Production vector ops looks like production database ops with two extra concerns: <strong>recall as a first-class SLO</strong> (latency + throughput aren't enough — you can be fast and wrong), and <strong>embedding API cost</strong>, which often dwarfs compute. We cover backup/restore, the canonical Prometheus + Grafana + Loki stack, recall monitoring with shadow queries, cost dashboards (<code>$/M vectors</code>, <code>$/1k queries</code>), security (RBAC, encryption at rest, network isolation, PII), capacity planning by RAM-per-vector, and observability dashboards you can copy-paste.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Snapshot, restore, and disaster-recovery patterns for Qdrant/Pinecone/pgvector</li>
<li>Monitor the four golden signals + recall@K with Prometheus + Grafana</li>
<li>Track $/M vectors stored and $/1k queries — cost dashboards that matter</li>
<li>Apply RBAC, encryption at rest, VPC isolation, PII redaction</li>
<li>Plan capacity from first principles: RAM-per-vector, p99 budget, scale-up triggers</li>
<li>Set drift-detection alerts so you catch quality regressions before users do</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Backup &amp; Restore</h2>

<p class="l-text">Vector indexes are big and slow to rebuild. A 100M-vector HNSW index can take 8 hours to rebuild from raw data on a single node. If you lose it without a backup, that is your downtime. Treat snapshots like Postgres dumps — hourly increments, daily fulls, off-region replicas.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Qdrant snapshots</div><div class="card-body"><code>POST /collections/&lt;name&gt;/snapshots</code> writes a tar to disk. Stream to S3 with a sidecar.</div></div>
<div class="calc-card"><div class="card-title">Pinecone collections</div><div class="card-body">Static snapshots — can spin up new index from one in minutes. No incremental.</div></div>
<div class="calc-card"><div class="card-title">pgvector / pg_dump</div><div class="card-body">Standard Postgres tooling. Backup includes both vectors and metadata. WAL streaming for PITR.</div></div>
<div class="calc-card"><div class="card-title">Weaviate backup module</div><div class="card-body">Native to S3/GCS/Azure. Per-class granularity. Async restore.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">⚠️ <strong>RPO matters:</strong> if you snapshot every 24h and lose the box, you lose 24h of upserts. For chat/agent memory this is unacceptable. Always pair snapshots with WAL/oplog replay or dual-write to a second region.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> requests, boto3
<span class="kw">from</span> datetime <span class="kw">import</span> datetime

QDRANT = <span class="str">'http://localhost:6333'</span>
COLL   = <span class="str">'docs'</span>

<span class="cm"># 1. Trigger snapshot</span>
r = requests.<span class="fn">post</span>(f<span class="str">'{QDRANT}/collections/{COLL}/snapshots'</span>).<span class="fn">json</span>()
snapshot_name = r[<span class="str">'result'</span>][<span class="str">'name'</span>]

<span class="cm"># 2. Stream to S3</span>
s3 = boto3.<span class="fn">client</span>(<span class="str">'s3'</span>)
local_path = f<span class="str">'/qdrant/storage/collections/{COLL}/snapshots/{snapshot_name}'</span>
key = f<span class="str">'qdrant-backups/{COLL}/{datetime.utcnow().date()}/{snapshot_name}'</span>
s3.<span class="fn">upload_file</span>(local_path, <span class="str">'my-backup-bucket'</span>, key)

<span class="cm"># 3. Restore on new cluster</span>
<span class="cm"># requests.put(f'{NEW_QDRANT}/collections/{COLL}/snapshots/recover',</span>
<span class="cm">#              json={'location': f's3://my-backup-bucket/{key}'})</span></code></pre></div>

<p class="l-text"><strong>Qdrant snapshot → S3, step by step:</strong> 1) <code>requests.post(f'{QDRANT}/collections/{COLL}/snapshots')</code> hits Qdrant's snapshot endpoint and returns metadata including the file <code>name</code>. 2) The snapshot lives at the documented path <code>/qdrant/storage/collections/{COLL}/snapshots/{name}</code> on the local volume. 3) <code>s3.upload_file(local_path, 'my-backup-bucket', key)</code> streams the tar into a date-partitioned S3 key for the off-site copy. 4) The commented <code>requests.put(.../snapshots/recover, {'location': 's3://...'})</code> shows the symmetric restore call you would run on a fresh cluster to rehydrate from S3 — your tested DR drill.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Backup = pickle dump, restore = pickle load. Same idea as snapshot files.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pickle, io

np.random.<span class="fn">seed</span>(<span class="num">7</span>)
index = {
    <span class="str">'vecs'</span>: np.random.<span class="fn">rand</span>(<span class="num">500</span>, <span class="num">32</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>),
    <span class="str">'ids'</span>:  <span class="fn">list</span>(<span class="fn">range</span>(<span class="num">500</span>)),
    <span class="str">'metadata'</span>: {i: {<span class="str">'tenant'</span>: i % <span class="num">3</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>)},
}
<span class="fn">print</span>(<span class="str">'original:'</span>, <span class="fn">len</span>(index[<span class="str">'vecs'</span>]), <span class="str">'vectors'</span>)

<span class="cm"># Snapshot to bytes (simulating S3 upload)</span>
buf = io.<span class="fn">BytesIO</span>()
pickle.<span class="fn">dump</span>(index, buf)
backup_size_kb = <span class="fn">len</span>(buf.<span class="fn">getvalue</span>()) / <span class="num">1024</span>
<span class="fn">print</span>(f<span class="str">'backup size: {backup_size_kb:.1f} KB'</span>)

<span class="cm"># Disaster: index lost!</span>
index = <span class="kw">None</span>

<span class="cm"># Restore from snapshot</span>
buf.<span class="fn">seek</span>(<span class="num">0</span>)
restored = pickle.<span class="fn">load</span>(buf)
<span class="fn">print</span>(<span class="str">'restored:'</span>, <span class="fn">len</span>(restored[<span class="str">'vecs'</span>]), <span class="str">'vectors'</span>)
<span class="fn">print</span>(<span class="str">'metadata sample:'</span>, restored[<span class="str">'metadata'</span>][<span class="num">0</span>])</code></pre></div>
</div>

<p class="l-text"><strong>Pickle DR drill, step by step:</strong> 1) Build a synthetic index dict with <code>vecs</code>, <code>ids</code>, and per-vector <code>metadata</code> — the trio every snapshot file must capture. 2) <code>pickle.dump(index, buf)</code> serialises the whole thing into an in-memory <code>BytesIO</code> buffer; printing <code>len(buf.getvalue())/1024</code> shows the would-be S3 upload size. 3) Setting <code>index = None</code> simulates losing the box. 4) <code>buf.seek(0)</code> + <code>pickle.load(buf)</code> restores the dict and a metadata spot-check confirms the round-trip preserved everything you would query later.</p>


</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Four Golden Signals + Recall</h2>

<p class="l-text">SRE textbooks give you four signals: <strong>latency, traffic, errors, saturation</strong>. Vector workloads need a fifth: <strong>recall</strong>. A search service can be fast, low-error, and quietly returning garbage because the index drifted. Always measure recall against a frozen ground-truth set.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Latency</div><div class="card-body">p50, p95, p99. Vector search SLO typically p99 &lt; 100ms for chat, &lt; 50ms for autocomplete.</div></div>
<div class="calc-card"><div class="card-title">Traffic</div><div class="card-body">QPS per collection, per tenant. Watch for sudden spikes (bot scraping) and dips (broken upstream).</div></div>
<div class="calc-card"><div class="card-title">Errors</div><div class="card-body">5xx rate, timeout rate. Below 0.1% in healthy state.</div></div>
<div class="calc-card"><div class="card-title">Saturation</div><div class="card-body">RAM %, CPU %, disk IO, GPU util (if reranking on GPU). 80% is your scale-up trigger.</div></div>
<div class="calc-card"><div class="card-title">Recall@10</div><div class="card-body">% of true top-10 returned. Measure with frozen golden queries hourly. Alert on 3% drop.</div></div>
<div class="calc-card"><div class="card-title">Index freshness</div><div class="card-body">Lag between upsert and queryability. SLO often &lt; 60s for chat, &lt; 5min for batch.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Prometheus exporter for vector search service</span>
<span class="kw">from</span> prometheus_client <span class="kw">import</span> Counter, Histogram, Gauge, start_http_server
<span class="kw">import</span> time

QUERIES   = <span class="fn">Counter</span>(<span class="str">'vsearch_queries_total'</span>, <span class="str">'queries'</span>, [<span class="str">'tenant'</span>, <span class="str">'collection'</span>])
LATENCY   = <span class="fn">Histogram</span>(<span class="str">'vsearch_latency_seconds'</span>, <span class="str">'latency'</span>, [<span class="str">'tenant'</span>],
                     buckets=[.005, .01, .025, .05, .1, .25, .5, <span class="num">1</span>, <span class="num">2.5</span>])
RECALL_10 = <span class="fn">Gauge</span>(<span class="str">'vsearch_recall_at_10'</span>, <span class="str">'recall@10 from golden set'</span>, [<span class="str">'collection'</span>])
RAM_USED  = <span class="fn">Gauge</span>(<span class="str">'vsearch_ram_used_bytes'</span>, <span class="str">'index RAM bytes'</span>, [<span class="str">'collection'</span>])

<span class="kw">def</span> <span class="fn">search</span>(tenant, collection, q):
    t0 = time.<span class="fn">time</span>()
    QUERIES.<span class="fn">labels</span>(tenant, collection).<span class="fn">inc</span>()
    results = vector_db.<span class="fn">query</span>(collection, q, top_k=<span class="num">10</span>)
    LATENCY.<span class="fn">labels</span>(tenant).<span class="fn">observe</span>(time.<span class="fn">time</span>() - t0)
    <span class="kw">return</span> results

<span class="fn">start_http_server</span>(<span class="num">9100</span>)  <span class="cm"># Prometheus scrapes /metrics</span></code></pre></div>
</div>

<p class="l-text"><strong>Prometheus exporter, step by step:</strong> 1) <code>Counter('vsearch_queries_total', labels=['tenant','collection'])</code> tracks query volume so you can break QPS down per tenant and collection. 2) <code>Histogram('vsearch_latency_seconds', buckets=[.005, .01, ...])</code> records latency into the bucket layout you will later query as <code>histogram_quantile(0.99, ...)</code>. 3) <code>Gauge('vsearch_recall_at_10', labels=['collection'])</code> stores the most recent golden-set measurement; another job sets it on a schedule. 4) <code>RAM_USED</code> exposes per-collection bytes for capacity dashboards. 5) <code>search(...)</code> increments the counter, measures wall-clock latency, then <code>start_http_server(9100)</code> exposes <code>/metrics</code> so Prometheus can scrape every 15s.</p>


<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Monitoring Stack</h2>

<p class="l-text">There is essentially one canonical stack: <strong>Prometheus</strong> for metrics, <strong>Grafana</strong> for dashboards, <strong>Loki</strong> for logs, <strong>Alertmanager</strong> for paging. Vector engines mostly expose <code>/metrics</code> in Prom format natively (Qdrant, Milvus, Weaviate). For pgvector you scrape Postgres exporter.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prometheus</div><div class="card-body">Scrapes <code>/metrics</code> every 15s. Stores 30-90 days locally, longer in Mimir/Thanos.</div></div>
<div class="calc-card"><div class="card-title">Grafana</div><div class="card-body">Per-collection dashboard: latency heatmap, QPS by tenant, recall trend, RAM, segment count.</div></div>
<div class="calc-card"><div class="card-title">Loki</div><div class="card-body">Slow query log aggregation. Search "queries &gt; 500ms in last 1h grouped by tenant".</div></div>
<div class="calc-card"><div class="card-title">Alertmanager</div><div class="card-body">Routes alerts to PagerDuty/Slack. Severity tiers: P0 down, P1 SLO breach, P2 capacity.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">📊 <strong>Must-have alerts:</strong> p99 &gt; 200ms for 5min, recall@10 drop &gt; 3% week-over-week, RAM &gt; 80%, tombstone ratio &gt; 25%, embedding API budget &gt; 80% of monthly cap, replication lag &gt; 30s.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Cost Monitoring</h2>

<p class="l-text">Two cost vectors dominate: <strong>storage/compute</strong> (the vector DB itself) and <strong>embedding API</strong> (OpenAI, Cohere, Voyage). For most apps, the embedding bill exceeds the DB bill within 6 months because you re-embed on every change.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$/M vectors stored</div><div class="card-body">Pinecone p1: ~$70/M/month. Qdrant self-host: ~$15/M (RAM-bound). pgvector: ~$8/M but slower.</div></div>
<div class="calc-card"><div class="card-title">$/1k queries</div><div class="card-body">Pinecone: ~$0.40/1k. Qdrant self-host: ~$0.05/1k amortized. Always include rerank API cost.</div></div>
<div class="calc-card"><div class="card-title">Embedding API</div><div class="card-body">OpenAI ada-002: $0.10/M tokens. 3-large: $0.13/M. Cohere v3: $0.10/M. Voyage v2: $0.12/M.</div></div>
<div class="calc-card"><div class="card-title">Rerank API</div><div class="card-body">Cohere rerank-v3: $2/1k queries. BGE rerank self-host on GPU: ~$0.10/1k. Big lever.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Tag every embedding API call with tenant + purpose for cost attribution</span>
<span class="kw">import</span> time
<span class="kw">from</span> prometheus_client <span class="kw">import</span> Counter

EMB_TOKENS = <span class="fn">Counter</span>(<span class="str">'embedding_tokens_total'</span>, <span class="str">'tokens'</span>, [<span class="str">'model'</span>, <span class="str">'tenant'</span>, <span class="str">'purpose'</span>])
EMB_COST   = <span class="fn">Counter</span>(<span class="str">'embedding_cost_usd_total'</span>, <span class="str">'USD'</span>, [<span class="str">'model'</span>, <span class="str">'tenant'</span>])

PRICE_PER_M = {
    <span class="str">'text-embedding-ada-002'</span>: <span class="num">0.10</span>,
    <span class="str">'text-embedding-3-large'</span>: <span class="num">0.13</span>,
    <span class="str">'voyage-2'</span>:               <span class="num">0.12</span>,
    <span class="str">'embed-english-v3.0'</span>:     <span class="num">0.10</span>,
}

<span class="kw">def</span> <span class="fn">embed</span>(text, model, tenant, purpose=<span class="str">'ingest'</span>):
    resp = oai.embeddings.<span class="fn">create</span>(model=model, <span class="fn">input</span>=text)
    n_tokens = resp.usage.total_tokens
    EMB_TOKENS.<span class="fn">labels</span>(model, tenant, purpose).<span class="fn">inc</span>(n_tokens)
    EMB_COST.<span class="fn">labels</span>(model, tenant).<span class="fn">inc</span>(n_tokens / 1_000_000 * PRICE_PER_M[model])
    <span class="kw">return</span> resp.data[<span class="num">0</span>].embedding</code></pre></div>

<p class="l-text"><strong>Embedding cost attribution, step by step:</strong> 1) Two Prom counters — <code>embedding_tokens_total</code> and <code>embedding_cost_usd_total</code> — both labelled by <code>model</code>, <code>tenant</code>, <code>purpose</code> so dashboards can show "$X from tenant_42 for ingest". 2) <code>PRICE_PER_M</code> hardcodes 2026 vendor prices in $/M tokens. 3) <code>embed(text, model, tenant, purpose)</code> wraps <code>oai.embeddings.create</code>, reads <code>resp.usage.total_tokens</code>, and writes both counters before returning the embedding. 4) Because every call passes through this helper, no usage escapes the meter — the Grafana panel becomes the source of truth for monthly spend.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Counter dict per (tenant, model) tracking tokens + USD. Output as JSON dashboard payload.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json
<span class="kw">from</span> collections <span class="kw">import</span> defaultdict

PRICE_PER_M = {<span class="str">'ada-002'</span>: <span class="num">0.10</span>, <span class="str">'3-large'</span>: <span class="num">0.13</span>, <span class="str">'voyage-2'</span>: <span class="num">0.12</span>}
counters = <span class="fn">defaultdict</span>(<span class="kw">lambda</span>: {<span class="str">'tokens'</span>: <span class="num">0</span>, <span class="str">'usd'</span>: <span class="num">0.0</span>, <span class="str">'queries'</span>: <span class="num">0</span>})

<span class="kw">def</span> <span class="fn">log_embed</span>(tenant, model, n_tokens):
    k = (tenant, model)
    counters[k][<span class="str">'tokens'</span>] += n_tokens
    counters[k][<span class="str">'usd'</span>]    += n_tokens / 1_000_000 * PRICE_PER_M[model]
    counters[k][<span class="str">'queries'</span>] += <span class="num">1</span>

<span class="cm"># Simulate one day of traffic</span>
<span class="kw">import</span> random
random.<span class="fn">seed</span>(<span class="num">11</span>)
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    t = random.<span class="fn">choice</span>([<span class="str">'acme'</span>, <span class="str">'globex'</span>, <span class="str">'initech'</span>])
    m = random.<span class="fn">choice</span>([<span class="str">'ada-002'</span>, <span class="str">'3-large'</span>])
    <span class="fn">log_embed</span>(t, m, random.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">800</span>))

dashboard = [{<span class="str">'tenant'</span>: k[<span class="num">0</span>], <span class="str">'model'</span>: k[<span class="num">1</span>], **v} <span class="kw">for</span> k, v <span class="kw">in</span> counters.<span class="fn">items</span>()]
<span class="fn">print</span>(json.<span class="fn">dumps</span>(dashboard, indent=<span class="num">2</span>))
total = <span class="fn">sum</span>(v[<span class="str">'usd'</span>] <span class="kw">for</span> v <span class="kw">in</span> counters.<span class="fn">values</span>())
<span class="fn">print</span>(f<span class="str">'\\ntotal embedding cost today: \${total:.2f}'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Browser-side cost dashboard, step by step:</strong> 1) <code>counters = defaultdict(lambda: {'tokens':0,'usd':0.0,'queries':0})</code> keeps per-(tenant, model) aggregates without if-checks. 2) <code>log_embed(tenant, model, n_tokens)</code> increments tokens, computes USD via the price table, and bumps the call counter — the same three-fold tracking a real Prometheus exporter would emit. 3) The simulation loops 2000 random calls across three tenants and two models. 4) The final <code>json.dumps(dashboard, indent=2)</code> emits a JSON payload identical to what a Grafana panel would render, and prints the day's total spend in dollars.</p>


</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Security: RBAC, Encryption, Network Isolation</h2>

<p class="l-text">Vector data often <em>contains</em> PII even when the original document does not. A 1536-dim embedding of a customer email is reversible enough that researchers have demonstrated text reconstruction from embeddings. Treat vector DBs as PII stores.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RBAC</div><div class="card-body">Per-collection read/write/admin roles. Pinecone uses API keys with scopes; Qdrant Cloud has IAM.</div></div>
<div class="calc-card"><div class="card-title">Encryption at rest</div><div class="card-body">LUKS/EBS for self-host. Managed services encrypt by default (AES-256). Verify in compliance docs.</div></div>
<div class="calc-card"><div class="card-title">Network isolation</div><div class="card-body">VPC peering or PrivateLink. Never expose vector DB to public internet — use bastion or sidecar.</div></div>
<div class="calc-card"><div class="card-title">PII redaction</div><div class="card-body">Strip PII from text <em>before</em> embedding. Embeddings of "John Smith, SSN 123-45-6789" leak.</div></div>
<div class="calc-card"><div class="card-title">Audit log</div><div class="card-body">Every read/write logged with user_id, tenant_id, query hash. SOC2 / GDPR requirement.</div></div>
<div class="calc-card"><div class="card-title">Tenant boundary</div><div class="card-body">Server-side enforced — never trust client-supplied tenant_id. Use signed JWTs with claims.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Capability-based middleware: derive tenant from JWT, enforce server-side</span>
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Depends, HTTPException, Header
<span class="kw">import</span> jwt

app = <span class="fn">FastAPI</span>()
JWT_SECRET = <span class="str">'...'</span>

<span class="kw">def</span> <span class="fn">current_user</span>(authorization: <span class="fn">str</span> = <span class="fn">Header</span>(...)):
    token = authorization.<span class="fn">replace</span>(<span class="str">'Bearer '</span>, <span class="str">''</span>)
    <span class="kw">try</span>:
        claims = jwt.<span class="fn">decode</span>(token, JWT_SECRET, algorithms=[<span class="str">'HS256'</span>])
    <span class="kw">except</span> jwt.PyJWTError:
        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">401</span>, <span class="str">'invalid token'</span>)
    <span class="kw">return</span> claims  <span class="cm"># {'user_id': ..., 'tenant_id': ..., 'scopes': [...]}</span>

<span class="kw">@app</span>.<span class="fn">post</span>(<span class="str">'/search'</span>)
<span class="kw">def</span> <span class="fn">search</span>(query: <span class="fn">str</span>, user=<span class="fn">Depends</span>(current_user)):
    <span class="kw">if</span> <span class="str">'vector:read'</span> <span class="kw">not</span> <span class="kw">in</span> user[<span class="str">'scopes'</span>]:
        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">403</span>, <span class="str">'missing vector:read scope'</span>)
    <span class="cm"># tenant_id comes from JWT, NEVER from request body</span>
    <span class="kw">return</span> vector_db.<span class="fn">query</span>(namespace=user[<span class="str">'tenant_id'</span>], text=query, top_k=<span class="num">10</span>)</code></pre></div>

<p class="l-text"><strong>FastAPI JWT middleware, step by step:</strong> 1) <code>current_user(authorization: str = Header(...))</code> strips the <code>Bearer </code> prefix and runs <code>jwt.decode(token, JWT_SECRET, algorithms=['HS256'])</code>; an invalid token raises <code>HTTPException(401)</code>. 2) The handler <code>POST /search</code> declares <code>user=Depends(current_user)</code> so authentication is enforced before any business logic runs. 3) The scope guard <code>if 'vector:read' not in user['scopes']: raise HTTPException(403)</code> blocks tokens that lack the read capability. 4) Crucially the <code>namespace=user['tenant_id']</code> argument comes from the verified JWT — never from the request body — so a client cannot forge cross-tenant access.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Capability-based RBAC with dict lookups + audit log.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json
<span class="kw">from</span> datetime <span class="kw">import</span> datetime

USERS = {
    <span class="str">'alice'</span>: {<span class="str">'tenant'</span>: <span class="str">'acme'</span>,    <span class="str">'scopes'</span>: [<span class="str">'vector:read'</span>, <span class="str">'vector:write'</span>]},
    <span class="str">'bob'</span>:   {<span class="str">'tenant'</span>: <span class="str">'globex'</span>,  <span class="str">'scopes'</span>: [<span class="str">'vector:read'</span>]},
    <span class="str">'eve'</span>:   {<span class="str">'tenant'</span>: <span class="str">'shadowy'</span>, <span class="str">'scopes'</span>: []},
}
audit = []

<span class="kw">def</span> <span class="fn">authorize</span>(user_id, action, tenant_target=<span class="kw">None</span>):
    u = USERS.<span class="fn">get</span>(user_id)
    <span class="kw">if</span> <span class="kw">not</span> u: <span class="kw">return</span> <span class="kw">False</span>, <span class="str">'unknown user'</span>
    needed = f<span class="str">'vector:{action}'</span>
    <span class="kw">if</span> needed <span class="kw">not</span> <span class="kw">in</span> u[<span class="str">'scopes'</span>]: <span class="kw">return</span> <span class="kw">False</span>, f<span class="str">'missing {needed}'</span>
    <span class="kw">if</span> tenant_target <span class="kw">and</span> tenant_target != u[<span class="str">'tenant'</span>]:
        <span class="kw">return</span> <span class="kw">False</span>, <span class="str">'cross-tenant access denied'</span>
    <span class="kw">return</span> <span class="kw">True</span>, <span class="str">'ok'</span>

<span class="kw">def</span> <span class="fn">search</span>(user_id, query):
    ok, reason = <span class="fn">authorize</span>(user_id, <span class="str">'read'</span>)
    audit.<span class="fn">append</span>({<span class="str">'ts'</span>: <span class="fn">str</span>(datetime.<span class="fn">utcnow</span>()), <span class="str">'user'</span>: user_id,
                  <span class="str">'action'</span>: <span class="str">'read'</span>, <span class="str">'allowed'</span>: ok, <span class="str">'reason'</span>: reason})
    <span class="kw">return</span> f<span class="str">'10 results for {user_id}'</span> <span class="kw">if</span> ok <span class="kw">else</span> f<span class="str">'DENIED: {reason}'</span>

<span class="fn">print</span>(<span class="fn">search</span>(<span class="str">'alice'</span>, <span class="str">'churn customers'</span>))
<span class="fn">print</span>(<span class="fn">search</span>(<span class="str">'eve'</span>,   <span class="str">'revenue'</span>))
<span class="fn">print</span>(<span class="fn">search</span>(<span class="str">'bob'</span>,   <span class="str">'support tickets'</span>))
<span class="fn">print</span>(<span class="str">'\\n--- audit log ---'</span>)
<span class="fn">print</span>(json.<span class="fn">dumps</span>(audit, indent=<span class="num">2</span>))</code></pre></div>
</div>

<p class="l-text"><strong>Capability-based RBAC demo, step by step:</strong> 1) <code>USERS</code> maps three identities to <code>{tenant, scopes}</code> — exactly the shape a JWT would carry. 2) <code>authorize(user_id, action, tenant_target)</code> rejects unknown users, missing scopes, and cross-tenant access in that order — the order is important because returning early avoids leaking which check failed. 3) <code>search(user_id, query)</code> calls <code>authorize</code>, appends a structured row to <code>audit</code> with timestamp, user, decision, and reason, then returns the result or a denial string. 4) The driver runs Alice (allowed), Eve (no scopes), Bob (read-only) and dumps the audit log as JSON — the SOC2/GDPR-style trail every regulator expects.</p>


</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Capacity Planning</h2>

<p class="l-text">Math you can do on a napkin. RAM is the binding constraint for HNSW; disk for IVF on-disk variants.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vector RAM</div><div class="card-body">N × dim × 4 bytes (float32). 10M × 1536 = 61 GB raw. Add 30% for HNSW graph.</div></div>
<div class="calc-card"><div class="card-title">Quantized RAM</div><div class="card-body">PQ@8x compression: ÷4. SQ@int8: ÷4. Same 10M × 1536 ≈ 15-20 GB. Recall cost: 1-3%.</div></div>
<div class="calc-card"><div class="card-title">QPS per node</div><div class="card-body">HNSW single-thread: 500-2000 QPS depending on <code>ef</code>. Multiply by cores. Plateau ~30k QPS/box.</div></div>
<div class="calc-card"><div class="card-title">Scale-up trigger</div><div class="card-body">RAM &gt; 70% OR p99 &gt; 0.7 × SLO OR QPS &gt; 70% of measured ceiling. Provision before 80%.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">📐 <strong>Worked example:</strong> 50M vectors × 768 dim float32 = 153 GB raw + 30% graph = ~200 GB RAM. With PQ@8x: ~50 GB, fits on a single 64 GB node. Always plan PQ if &gt; 20M vectors and you do not need 100% recall.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Drift Detection &amp; Quality Regression</h2>

<p class="l-text">The silent killer. Latency dashboards stay green. Errors stay zero. But your retrieval quality slowly degrades because: (a) the embedding distribution shifted, (b) new content is dominated by a topic the model handles poorly, or (c) deletes left a sparse region. You catch this only with continuous recall measurement.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Golden query set</div><div class="card-body">200-1000 queries with hand-labeled top-10. Frozen. Re-run hourly. Plot recall@10 trend.</div></div>
<div class="calc-card"><div class="card-title">Production shadow</div><div class="card-body">Mirror 1% of real queries to a candidate index, compare top-K Jaccard. No labels needed.</div></div>
<div class="calc-card"><div class="card-title">Embedding drift</div><div class="card-body">PCA(new vectors) vs PCA(reference). KL divergence on cluster occupancy. Alert on big shift.</div></div>
<div class="calc-card"><div class="card-title">User signal</div><div class="card-body">Click-through rate, "thumbs down", session abandonment. Lagging but ground truth.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Hourly recall@10 sweep against golden set</span>
<span class="kw">def</span> <span class="fn">recall_at_k</span>(retrieved, ground_truth, k=<span class="num">10</span>):
    gt_set = <span class="fn">set</span>(ground_truth[:k])
    ret_set = <span class="fn">set</span>(retrieved[:k])
    <span class="kw">return</span> <span class="fn">len</span>(gt_set &amp; ret_set) / k

scores = []
<span class="kw">for</span> q <span class="kw">in</span> golden_queries:
    pred = vector_db.<span class="fn">search</span>(q[<span class="str">'text'</span>], top_k=<span class="num">10</span>)
    scores.<span class="fn">append</span>(<span class="fn">recall_at_k</span>([r.id <span class="kw">for</span> r <span class="kw">in</span> pred], q[<span class="str">'gt_ids'</span>]))

mean_recall = <span class="fn">sum</span>(scores) / <span class="fn">len</span>(scores)
RECALL_10.<span class="fn">labels</span>(<span class="str">'docs'</span>).<span class="fn">set</span>(mean_recall)
<span class="kw">if</span> mean_recall &lt; <span class="num">0.90</span>:
    <span class="fn">alert</span>(<span class="str">'Recall@10 dropped below 0.90 — investigate index health'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Hourly recall@10 sweep, step by step:</strong> 1) <code>recall_at_k(retrieved, ground_truth, k=10)</code> turns both lists into sets, intersects, and divides by k — the canonical recall metric. 2) The loop runs every golden query against the live <code>vector_db.search</code> and appends per-query recall. 3) <code>mean_recall</code> averages across the set, then <code>RECALL_10.labels('docs').set(mean_recall)</code> pushes the value into the Prometheus gauge that Grafana plots. 4) If <code>mean_recall &lt; 0.90</code> the helper <code>alert(...)</code> fires a page so the on-call investigates before users notice.</p>


<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Production Runbook</h2>

<p class="l-text">When the pager fires, you do not want to think — you want a checklist.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">🚨 p99 latency spike</div><div class="card-body">1) Check QPS — DDoS? 2) Check tombstone ratio. 3) Check segment count. 4) Trigger compaction if needed.</div></div>
<div class="calc-card"><div class="card-title">🚨 Recall drop</div><div class="card-body">1) Compare embedding model_id distribution. 2) Replay golden set with verbose logs. 3) Roll back recent index changes.</div></div>
<div class="calc-card"><div class="card-title">🚨 RAM &gt; 90%</div><div class="card-body">1) Add node + reshard. 2) Or enable PQ on hot collection. 3) Cap upserts on heaviest tenants temporarily.</div></div>
<div class="calc-card"><div class="card-title">🚨 Embedding budget burn</div><div class="card-body">1) Switch to cheaper model for non-critical paths. 2) Cache embeddings by content hash. 3) Throttle background re-embed jobs.</div></div>
<div class="calc-card"><div class="card-title">🚨 Tenant runaway</div><div class="card-body">1) Identify via per-namespace QPS. 2) Apply rate limit. 3) Notify customer success.</div></div>
<div class="calc-card"><div class="card-title">🚨 Index corruption</div><div class="card-body">1) Stop writes. 2) Restore latest snapshot to new collection. 3) Replay WAL/oplog. 4) Alias flip.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎓 <strong>Next lesson (L8 capstone):</strong> we assemble everything — chunker, embedder, vector index, reranker, LLM, evaluator, monitoring — into a production-grade RAG pipeline you can ship.</div>
</div>`,
tr: `<p class="l-text"><strong>Sabah 3. PagerDuty patlıyor: arama servisinde p99 gecikme 80ms'den 2.4s'ye sıçradı.</strong> Recall hâlâ iyi, throughput normal, ama kuyruk chat UX'ini mahvediyor. Kutuya SSH yapıyorsun — ve vektör veritabanının kendisinde metrik yok, kiracı başına kırılım yok, geri yüklemen gerekirse yakın bir yedek yok. Bu, vektör indeksini bir kara kutu olarak ele almayı bıraktığın derstir.</p>

<p class="l-text">Üretim vektör ops'u iki ekstra endişe ile üretim veritabanı ops'una benzer: <strong>birinci sınıf SLO olarak recall</strong> (gecikme + throughput yetmez — hızlı ve yanlış olabilirsin) ve <strong>embedding API maliyeti</strong>, genellikle compute'u gölgede bırakır. Yedek/geri yükleme, kanonik Prometheus + Grafana + Loki yığını, gölge sorgularla recall izleme, maliyet dashboard'ları (<code>$/M vektör</code>, <code>$/1k sorgu</code>), güvenlik (RBAC, dinlenme halinde şifreleme, ağ izolasyonu, PII), vektör başına RAM ile kapasite planlaması ve kopyala-yapıştır edebilen gözlemlenebilirlik dashboard'larını kapsıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Qdrant/Pinecone/pgvector için snapshot, geri yükleme ve felaket-kurtarma desenleri</li>
<li>Prometheus + Grafana ile dört altın sinyal + recall@K izle</li>
<li>Depolanan $/M vektör ve $/1k sorgu izle — önemli maliyet dashboard'ları</li>
<li>RBAC, dinlenme halinde şifreleme, VPC izolasyonu, PII redaksiyonu uygula</li>
<li>İlk ilkelerden kapasiteyi planla: vektör başına RAM, p99 bütçesi, ölçek-yükseltme tetikleyicileri</li>
<li>Kullanıcılar fark etmeden kalite gerilemelerini yakalamak için kayma-tespit uyarıları kur</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Yedek ve Geri Yükleme</h2>

<p class="l-text">Vektör indeksleri büyük ve yeniden inşası yavaştır. 100M vektörlük bir HNSW indeksinin tek sunucuda ham veriden yeniden inşası 8 saat sürebilir. Yedek olmadan kaybedersen, bu senin kesintinin. Snapshot'ları Postgres dump'ları gibi ele al — saatlik artımlı, günlük tam, bölge dışı replikalar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Qdrant snapshot'ları</div><div class="card-body"><code>POST /collections/&lt;name&gt;/snapshots</code> diske bir tar yazar. Sidecar ile S3'e akıt.</div></div>
<div class="calc-card"><div class="card-title">Pinecone koleksiyonları</div><div class="card-body">Statik snapshot'lar — birinden dakikalar içinde yeni indeks açabilirsin. Artımlı yok.</div></div>
<div class="calc-card"><div class="card-title">pgvector / pg_dump</div><div class="card-body">Standart Postgres araç seti. Yedek hem vektörleri hem metadata'yı içerir. PITR için WAL akışı.</div></div>
<div class="calc-card"><div class="card-title">Weaviate yedek modülü</div><div class="card-body">S3/GCS/Azure'a yerel. Sınıf başına granülerite. Asenkron geri yükleme.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">⚠️ <strong>RPO önemlidir:</strong> her 24 saatte snapshot alıyorsan ve kutuyu kaybedersen, 24 saatlik upsert kaybedersin. Chat/agent hafızası için bu kabul edilemez. Snapshot'ları her zaman WAL/oplog yeniden oynatma ya da ikinci bir bölgeye dual-write ile eşleştir.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> requests, boto3
<span class="kw">from</span> datetime <span class="kw">import</span> datetime

QDRANT = <span class="str">'http://localhost:6333'</span>
COLL   = <span class="str">'docs'</span>

<span class="cm"># 1. Snapshot tetikle</span>
r = requests.<span class="fn">post</span>(f<span class="str">'{QDRANT}/collections/{COLL}/snapshots'</span>).<span class="fn">json</span>()
snapshot_name = r[<span class="str">'result'</span>][<span class="str">'name'</span>]

<span class="cm"># 2. S3'e akıt</span>
s3 = boto3.<span class="fn">client</span>(<span class="str">'s3'</span>)
local_path = f<span class="str">'/qdrant/storage/collections/{COLL}/snapshots/{snapshot_name}'</span>
key = f<span class="str">'qdrant-backups/{COLL}/{datetime.utcnow().date()}/{snapshot_name}'</span>
s3.<span class="fn">upload_file</span>(local_path, <span class="str">'my-backup-bucket'</span>, key)

<span class="cm"># 3. Yeni cluster'a geri yükle</span>
<span class="cm"># requests.put(f'{NEW_QDRANT}/collections/{COLL}/snapshots/recover',</span>
<span class="cm">#              json={'location': f's3://my-backup-bucket/{key}'})</span></code></pre></div>

<p class="l-text"><strong>Qdrant snapshot → S3, adım adım:</strong> 1) <code>requests.post(f'{QDRANT}/collections/{COLL}/snapshots')</code> Qdrant'ın snapshot uç noktasını çağırır ve dosya <code>name</code>'i dahil metadata döner. 2) Snapshot, yerel volume'de belgelenmiş yol <code>/qdrant/storage/collections/{COLL}/snapshots/{name}</code>'da yaşar. 3) <code>s3.upload_file(local_path, 'my-backup-bucket', key)</code> tar'ı tarih-bölümlenmiş S3 anahtarına akıtır — saha-dışı kopyan. 4) Yorumdaki <code>requests.put(.../snapshots/recover, {'location': 's3://...'})</code> taze bir küme üzerinde S3'ten yeniden hidrasyon için koşacağın simetrik geri yükleme çağrısını gösterir — test edilmiş DR tatbikatın.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Yedek = pickle dump, geri yükleme = pickle load. Snapshot dosyalarıyla aynı fikir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pickle, io

np.random.<span class="fn">seed</span>(<span class="num">7</span>)
index = {
    <span class="str">'vecs'</span>: np.random.<span class="fn">rand</span>(<span class="num">500</span>, <span class="num">32</span>).<span class="fn">astype</span>(<span class="str">'float32'</span>),
    <span class="str">'ids'</span>:  <span class="fn">list</span>(<span class="fn">range</span>(<span class="num">500</span>)),
    <span class="str">'metadata'</span>: {i: {<span class="str">'tenant'</span>: i % <span class="num">3</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">500</span>)},
}
<span class="fn">print</span>(<span class="str">'original:'</span>, <span class="fn">len</span>(index[<span class="str">'vecs'</span>]), <span class="str">'vectors'</span>)

<span class="cm"># Byte'lara snapshot (S3 yüklemesini simüle eder)</span>
buf = io.<span class="fn">BytesIO</span>()
pickle.<span class="fn">dump</span>(index, buf)
backup_size_kb = <span class="fn">len</span>(buf.<span class="fn">getvalue</span>()) / <span class="num">1024</span>
<span class="fn">print</span>(f<span class="str">'backup size: {backup_size_kb:.1f} KB'</span>)

<span class="cm"># Felaket: indeks kayıp!</span>
index = <span class="kw">None</span>

<span class="cm"># Snapshot'tan geri yükle</span>
buf.<span class="fn">seek</span>(<span class="num">0</span>)
restored = pickle.<span class="fn">load</span>(buf)
<span class="fn">print</span>(<span class="str">'restored:'</span>, <span class="fn">len</span>(restored[<span class="str">'vecs'</span>]), <span class="str">'vectors'</span>)
<span class="fn">print</span>(<span class="str">'metadata sample:'</span>, restored[<span class="str">'metadata'</span>][<span class="num">0</span>])</code></pre></div>
</div>

<p class="l-text"><strong>Pickle DR tatbikatı, adım adım:</strong> 1) Sentetik bir index dict'i <code>vecs</code>, <code>ids</code> ve vektör başına <code>metadata</code> ile kurarız — her snapshot dosyasının yakalaması gereken üçlü. 2) <code>pickle.dump(index, buf)</code> tümünü bellek içi bir <code>BytesIO</code> tamponuna serileştirir; <code>len(buf.getvalue())/1024</code> S3 yükleme boyutunu gösterir. 3) <code>index = None</code> atamak kutuyu kaybetmeyi simüle eder. 4) <code>buf.seek(0)</code> + <code>pickle.load(buf)</code> dict'i geri yükler ve metadata kontrolü gidiş-dönüşün sonradan sorgulayacağın her şeyi koruduğunu doğrular.</p>


</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Dört Altın Sinyal + Recall</h2>

<p class="l-text">SRE ders kitapları sana dört sinyal verir: <strong>gecikme, trafik, hatalar, doygunluk</strong>. Vektör iş yükleri beşinciye ihtiyaç duyar: <strong>recall</strong>. Bir arama servisi hızlı, düşük-hatalı olabilir ve indeks kaydığı için sessizce çöp döndürür. Recall'u her zaman dondurulmuş bir ground-truth kümesine karşı ölç.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gecikme</div><div class="card-body">p50, p95, p99. Vektör arama SLO'su tipik olarak chat için p99 &lt; 100ms, otomatik tamamlama için &lt; 50ms.</div></div>
<div class="calc-card"><div class="card-title">Trafik</div><div class="card-body">Koleksiyon başına, kiracı başına QPS. Ani sıçramalara (bot scraping) ve düşmelere (bozuk yukarı akış) dikkat et.</div></div>
<div class="calc-card"><div class="card-title">Hatalar</div><div class="card-body">5xx oranı, timeout oranı. Sağlıklı durumda %0.1'in altında.</div></div>
<div class="calc-card"><div class="card-title">Doygunluk</div><div class="card-body">RAM %, CPU %, disk IO, GPU util (yeniden sıralama GPU'da ise). %80 ölçek-yükseltme tetikleyicin.</div></div>
<div class="calc-card"><div class="card-title">Recall@10</div><div class="card-body">Gerçek top-10'un % kaçı döndürüldü. Saatlik dondurulmuş altın sorgularla ölç. %3 düşüşte uyar.</div></div>
<div class="calc-card"><div class="card-title">İndeks tazeliği</div><div class="card-body">Upsert ile aranabilirlik arasındaki gecikme. SLO genellikle chat için &lt; 60s, batch için &lt; 5dk.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Vektör arama servisi için Prometheus exporter</span>
<span class="kw">from</span> prometheus_client <span class="kw">import</span> Counter, Histogram, Gauge, start_http_server
<span class="kw">import</span> time

QUERIES   = <span class="fn">Counter</span>(<span class="str">'vsearch_queries_total'</span>, <span class="str">'queries'</span>, [<span class="str">'tenant'</span>, <span class="str">'collection'</span>])
LATENCY   = <span class="fn">Histogram</span>(<span class="str">'vsearch_latency_seconds'</span>, <span class="str">'latency'</span>, [<span class="str">'tenant'</span>],
                     buckets=[.005, .01, .025, .05, .1, .25, .5, <span class="num">1</span>, <span class="num">2.5</span>])
RECALL_10 = <span class="fn">Gauge</span>(<span class="str">'vsearch_recall_at_10'</span>, <span class="str">'recall@10 from golden set'</span>, [<span class="str">'collection'</span>])
RAM_USED  = <span class="fn">Gauge</span>(<span class="str">'vsearch_ram_used_bytes'</span>, <span class="str">'index RAM bytes'</span>, [<span class="str">'collection'</span>])

<span class="kw">def</span> <span class="fn">search</span>(tenant, collection, q):
    t0 = time.<span class="fn">time</span>()
    QUERIES.<span class="fn">labels</span>(tenant, collection).<span class="fn">inc</span>()
    results = vector_db.<span class="fn">query</span>(collection, q, top_k=<span class="num">10</span>)
    LATENCY.<span class="fn">labels</span>(tenant).<span class="fn">observe</span>(time.<span class="fn">time</span>() - t0)
    <span class="kw">return</span> results

<span class="fn">start_http_server</span>(<span class="num">9100</span>)  <span class="cm"># Prometheus /metrics'i kazır</span></code></pre></div>
</div>

<p class="l-text"><strong>Prometheus exporter, adım adım:</strong> 1) <code>Counter('vsearch_queries_total', labels=['tenant','collection'])</code> sorgu hacmini izler; QPS'yi kiracı ve koleksiyon bazında parçalayabilirsin. 2) <code>Histogram('vsearch_latency_seconds', buckets=[.005, .01, ...])</code> gecikmeyi sonradan <code>histogram_quantile(0.99, ...)</code> ile sorgulayacağın kova düzenine kaydeder. 3) <code>Gauge('vsearch_recall_at_10', labels=['collection'])</code> en son altın-küme ölçümünü saklar; başka bir job onu zamanlanmış olarak ayarlar. 4) <code>RAM_USED</code> kapasite dashboard'ları için koleksiyon başına bayt sayısını yayar. 5) <code>search(...)</code> sayacı artırır, duvar saati gecikmesini ölçer, ardından <code>start_http_server(9100)</code> <code>/metrics</code>'i Prometheus'un 15s'de bir kazıması için açar.</p>


<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. İzleme Yığını</h2>

<p class="l-text">Esasen tek bir kanonik yığın vardır: metrikler için <strong>Prometheus</strong>, dashboard'lar için <strong>Grafana</strong>, log'lar için <strong>Loki</strong>, çağrı için <strong>Alertmanager</strong>. Vektör motorları çoğunlukla yerel olarak Prom formatında <code>/metrics</code> sunar (Qdrant, Milvus, Weaviate). pgvector için Postgres exporter'ı kazırsın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Prometheus</div><div class="card-body">Her 15s'de <code>/metrics</code>'i kazır. Yerel olarak 30-90 gün, Mimir/Thanos'ta daha uzun saklar.</div></div>
<div class="calc-card"><div class="card-title">Grafana</div><div class="card-body">Koleksiyon başına dashboard: gecikme heatmap, kiracıya göre QPS, recall trendi, RAM, segment sayısı.</div></div>
<div class="calc-card"><div class="card-title">Loki</div><div class="card-body">Yavaş sorgu log'u toplaması. "Son 1 saatte &gt; 500ms sorgular kiracıya göre gruplanmış" ara.</div></div>
<div class="calc-card"><div class="card-title">Alertmanager</div><div class="card-body">Uyarıları PagerDuty/Slack'e yönlendirir. Önem dereceleri: P0 düştü, P1 SLO ihlali, P2 kapasite.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">📊 <strong>Olmazsa olmaz uyarılar:</strong> 5dk için p99 &gt; 200ms, hafta-haftaya recall@10 &gt; %3 düşüş, RAM &gt; %80, tombstone oranı &gt; %25, embedding API bütçesi aylık üst sınırın &gt; %80'i, replikasyon gecikmesi &gt; 30s.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Maliyet İzleme</h2>

<p class="l-text">İki maliyet vektörü hâkim: <strong>depolama/compute</strong> (vektör DB'nin kendisi) ve <strong>embedding API</strong> (OpenAI, Cohere, Voyage). Çoğu uygulama için, embedding faturası DB faturasını 6 ay içinde aşar çünkü her değişiklikte yeniden embed edersin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Depolanan $/M vektör</div><div class="card-body">Pinecone p1: ~$70/M/ay. Qdrant self-host: ~$15/M (RAM-bağlı). pgvector: ~$8/M ama daha yavaş.</div></div>
<div class="calc-card"><div class="card-title">$/1k sorgu</div><div class="card-body">Pinecone: ~$0.40/1k. Qdrant self-host: amortize ~$0.05/1k. Her zaman rerank API maliyetini dahil et.</div></div>
<div class="calc-card"><div class="card-title">Embedding API</div><div class="card-body">OpenAI ada-002: $0.10/M token. 3-large: $0.13/M. Cohere v3: $0.10/M. Voyage v2: $0.12/M.</div></div>
<div class="calc-card"><div class="card-title">Rerank API</div><div class="card-body">Cohere rerank-v3: $2/1k sorgu. GPU'da BGE rerank self-host: ~$0.10/1k. Büyük kaldıraç.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Maliyet atfetme için her embedding API çağrısını kiracı + amaç ile etiketle</span>
<span class="kw">import</span> time
<span class="kw">from</span> prometheus_client <span class="kw">import</span> Counter

EMB_TOKENS = <span class="fn">Counter</span>(<span class="str">'embedding_tokens_total'</span>, <span class="str">'tokens'</span>, [<span class="str">'model'</span>, <span class="str">'tenant'</span>, <span class="str">'purpose'</span>])
EMB_COST   = <span class="fn">Counter</span>(<span class="str">'embedding_cost_usd_total'</span>, <span class="str">'USD'</span>, [<span class="str">'model'</span>, <span class="str">'tenant'</span>])

PRICE_PER_M = {
    <span class="str">'text-embedding-ada-002'</span>: <span class="num">0.10</span>,
    <span class="str">'text-embedding-3-large'</span>: <span class="num">0.13</span>,
    <span class="str">'voyage-2'</span>:               <span class="num">0.12</span>,
    <span class="str">'embed-english-v3.0'</span>:     <span class="num">0.10</span>,
}

<span class="kw">def</span> <span class="fn">embed</span>(text, model, tenant, purpose=<span class="str">'ingest'</span>):
    resp = oai.embeddings.<span class="fn">create</span>(model=model, <span class="fn">input</span>=text)
    n_tokens = resp.usage.total_tokens
    EMB_TOKENS.<span class="fn">labels</span>(model, tenant, purpose).<span class="fn">inc</span>(n_tokens)
    EMB_COST.<span class="fn">labels</span>(model, tenant).<span class="fn">inc</span>(n_tokens / 1_000_000 * PRICE_PER_M[model])
    <span class="kw">return</span> resp.data[<span class="num">0</span>].embedding</code></pre></div>

<p class="l-text"><strong>Embedding maliyet atfetme, adım adım:</strong> 1) İki Prom sayacı — <code>embedding_tokens_total</code> ve <code>embedding_cost_usd_total</code> — her ikisi <code>model</code>, <code>tenant</code>, <code>purpose</code> ile etiketlenir; böylece dashboard "tenant_42'den ingest için $X" gösterebilir. 2) <code>PRICE_PER_M</code> 2026 satıcı fiyatlarını $/M token olarak sabit kodlar. 3) <code>embed(text, model, tenant, purpose)</code> <code>oai.embeddings.create</code>'i sarar, <code>resp.usage.total_tokens</code>'i okur ve embedding'i döndürmeden önce iki sayacı yazar. 4) Her çağrı bu yardımcı üzerinden geçtiğinden hiçbir kullanım metreden kaçmaz — Grafana paneli aylık harcamanın tek doğruluk kaynağı olur.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">(kiracı, model) başına token + USD izleyen sayaç dict. JSON dashboard payload'ı olarak çıktı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json
<span class="kw">from</span> collections <span class="kw">import</span> defaultdict

PRICE_PER_M = {<span class="str">'ada-002'</span>: <span class="num">0.10</span>, <span class="str">'3-large'</span>: <span class="num">0.13</span>, <span class="str">'voyage-2'</span>: <span class="num">0.12</span>}
counters = <span class="fn">defaultdict</span>(<span class="kw">lambda</span>: {<span class="str">'tokens'</span>: <span class="num">0</span>, <span class="str">'usd'</span>: <span class="num">0.0</span>, <span class="str">'queries'</span>: <span class="num">0</span>})

<span class="kw">def</span> <span class="fn">log_embed</span>(tenant, model, n_tokens):
    k = (tenant, model)
    counters[k][<span class="str">'tokens'</span>] += n_tokens
    counters[k][<span class="str">'usd'</span>]    += n_tokens / 1_000_000 * PRICE_PER_M[model]
    counters[k][<span class="str">'queries'</span>] += <span class="num">1</span>

<span class="cm"># Bir günlük trafiği simüle et</span>
<span class="kw">import</span> random
random.<span class="fn">seed</span>(<span class="num">11</span>)
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
    t = random.<span class="fn">choice</span>([<span class="str">'acme'</span>, <span class="str">'globex'</span>, <span class="str">'initech'</span>])
    m = random.<span class="fn">choice</span>([<span class="str">'ada-002'</span>, <span class="str">'3-large'</span>])
    <span class="fn">log_embed</span>(t, m, random.<span class="fn">randint</span>(<span class="num">50</span>, <span class="num">800</span>))

dashboard = [{<span class="str">'tenant'</span>: k[<span class="num">0</span>], <span class="str">'model'</span>: k[<span class="num">1</span>], **v} <span class="kw">for</span> k, v <span class="kw">in</span> counters.<span class="fn">items</span>()]
<span class="fn">print</span>(json.<span class="fn">dumps</span>(dashboard, indent=<span class="num">2</span>))
total = <span class="fn">sum</span>(v[<span class="str">'usd'</span>] <span class="kw">for</span> v <span class="kw">in</span> counters.<span class="fn">values</span>())
<span class="fn">print</span>(f<span class="str">'\\ntotal embedding cost today: \${total:.2f}'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Tarayıcı-tarafı maliyet dashboard'ı, adım adım:</strong> 1) <code>counters = defaultdict(lambda: {'tokens':0,'usd':0.0,'queries':0})</code> if-kontrolleri olmadan (kiracı, model) başına toplamı tutar. 2) <code>log_embed(tenant, model, n_tokens)</code> token'ları artırır, fiyat tablosundan USD hesaplar ve çağrı sayacını yükseltir — gerçek bir Prometheus exporter'ın yayacağı aynı üçlü izleme. 3) Simülasyon üç kiracı ve iki model arasında 2000 rastgele çağrıyı döner. 4) Son <code>json.dumps(dashboard, indent=2)</code> bir Grafana panelinin render edeceğiyle aynı JSON payload'ını yayar ve günün toplam harcamasını dolar cinsinden basar.</p>


</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Güvenlik: RBAC, Şifreleme, Ağ İzolasyonu</h2>

<p class="l-text">Vektör verisi orijinal doküman içermese bile genellikle PII <em>içerir</em>. Bir müşteri e-postasının 1536 boyutlu embedding'i, araştırmacıların embedding'lerden metin yeniden yapılandırma gösterdiği kadar tersine çevrilebilir. Vektör veritabanlarını PII depoları olarak ele al.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RBAC</div><div class="card-body">Koleksiyon başına okuma/yazma/admin rolleri. Pinecone scope'lu API anahtarları kullanır; Qdrant Cloud IAM'a sahiptir.</div></div>
<div class="calc-card"><div class="card-title">Dinlenmede şifreleme</div><div class="card-body">Self-host için LUKS/EBS. Yönetilen servisler varsayılan olarak şifreler (AES-256). Uyumluluk dokümanlarında doğrula.</div></div>
<div class="calc-card"><div class="card-title">Ağ izolasyonu</div><div class="card-body">VPC peering veya PrivateLink. Vektör DB'yi public internete asla açma — bastion veya sidecar kullan.</div></div>
<div class="calc-card"><div class="card-title">PII redaksiyonu</div><div class="card-body">Embedding'den <em>önce</em> PII'yi metinden çıkar. "John Smith, SSN 123-45-6789" embedding'leri sızdırır.</div></div>
<div class="calc-card"><div class="card-title">Audit log</div><div class="card-body">Her okuma/yazma user_id, tenant_id, sorgu hash ile log'lanır. SOC2 / GDPR gereksinimi.</div></div>
<div class="calc-card"><div class="card-title">Kiracı sınırı</div><div class="card-body">Sunucu tarafında uygulanır — istemci tarafından sağlanan tenant_id'ye asla güvenme. İmzalı JWT'leri claim'lerle kullan.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Yetenek-tabanlı middleware: kiracıyı JWT'den türet, sunucu tarafında uygula</span>
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Depends, HTTPException, Header
<span class="kw">import</span> jwt

app = <span class="fn">FastAPI</span>()
JWT_SECRET = <span class="str">'...'</span>

<span class="kw">def</span> <span class="fn">current_user</span>(authorization: <span class="fn">str</span> = <span class="fn">Header</span>(...)):
    token = authorization.<span class="fn">replace</span>(<span class="str">'Bearer '</span>, <span class="str">''</span>)
    <span class="kw">try</span>:
        claims = jwt.<span class="fn">decode</span>(token, JWT_SECRET, algorithms=[<span class="str">'HS256'</span>])
    <span class="kw">except</span> jwt.PyJWTError:
        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">401</span>, <span class="str">'invalid token'</span>)
    <span class="kw">return</span> claims  <span class="cm"># {'user_id': ..., 'tenant_id': ..., 'scopes': [...]}</span>

<span class="kw">@app</span>.<span class="fn">post</span>(<span class="str">'/search'</span>)
<span class="kw">def</span> <span class="fn">search</span>(query: <span class="fn">str</span>, user=<span class="fn">Depends</span>(current_user)):
    <span class="kw">if</span> <span class="str">'vector:read'</span> <span class="kw">not</span> <span class="kw">in</span> user[<span class="str">'scopes'</span>]:
        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">403</span>, <span class="str">'missing vector:read scope'</span>)
    <span class="cm"># tenant_id JWT'den gelir, ASLA istek gövdesinden değil</span>
    <span class="kw">return</span> vector_db.<span class="fn">query</span>(namespace=user[<span class="str">'tenant_id'</span>], text=query, top_k=<span class="num">10</span>)</code></pre></div>

<p class="l-text"><strong>FastAPI JWT middleware, adım adım:</strong> 1) <code>current_user(authorization: str = Header(...))</code> <code>Bearer </code> önekini ayırır ve <code>jwt.decode(token, JWT_SECRET, algorithms=['HS256'])</code> koşturur; geçersiz token <code>HTTPException(401)</code> fırlatır. 2) Handler <code>POST /search</code> <code>user=Depends(current_user)</code> ilan eder; iş mantığı koşmadan önce kimlik doğrulama uygulanır. 3) Scope koruması <code>if 'vector:read' not in user['scopes']: raise HTTPException(403)</code> okuma yeteneği olmayan token'ları engeller. 4) Kritik olarak <code>namespace=user['tenant_id']</code> argümanı doğrulanmış JWT'den gelir — istek gövdesinden değil — böylece bir istemci kiracılar arası erişimi sahteleyemez.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Dict aramaları + audit log ile yetenek tabanlı RBAC.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json
<span class="kw">from</span> datetime <span class="kw">import</span> datetime

USERS = {
    <span class="str">'alice'</span>: {<span class="str">'tenant'</span>: <span class="str">'acme'</span>,    <span class="str">'scopes'</span>: [<span class="str">'vector:read'</span>, <span class="str">'vector:write'</span>]},
    <span class="str">'bob'</span>:   {<span class="str">'tenant'</span>: <span class="str">'globex'</span>,  <span class="str">'scopes'</span>: [<span class="str">'vector:read'</span>]},
    <span class="str">'eve'</span>:   {<span class="str">'tenant'</span>: <span class="str">'shadowy'</span>, <span class="str">'scopes'</span>: []},
}
audit = []

<span class="kw">def</span> <span class="fn">authorize</span>(user_id, action, tenant_target=<span class="kw">None</span>):
    u = USERS.<span class="fn">get</span>(user_id)
    <span class="kw">if</span> <span class="kw">not</span> u: <span class="kw">return</span> <span class="kw">False</span>, <span class="str">'unknown user'</span>
    needed = f<span class="str">'vector:{action}'</span>
    <span class="kw">if</span> needed <span class="kw">not</span> <span class="kw">in</span> u[<span class="str">'scopes'</span>]: <span class="kw">return</span> <span class="kw">False</span>, f<span class="str">'missing {needed}'</span>
    <span class="kw">if</span> tenant_target <span class="kw">and</span> tenant_target != u[<span class="str">'tenant'</span>]:
        <span class="kw">return</span> <span class="kw">False</span>, <span class="str">'cross-tenant access denied'</span>
    <span class="kw">return</span> <span class="kw">True</span>, <span class="str">'ok'</span>

<span class="kw">def</span> <span class="fn">search</span>(user_id, query):
    ok, reason = <span class="fn">authorize</span>(user_id, <span class="str">'read'</span>)
    audit.<span class="fn">append</span>({<span class="str">'ts'</span>: <span class="fn">str</span>(datetime.<span class="fn">utcnow</span>()), <span class="str">'user'</span>: user_id,
                  <span class="str">'action'</span>: <span class="str">'read'</span>, <span class="str">'allowed'</span>: ok, <span class="str">'reason'</span>: reason})
    <span class="kw">return</span> f<span class="str">'10 results for {user_id}'</span> <span class="kw">if</span> ok <span class="kw">else</span> f<span class="str">'DENIED: {reason}'</span>

<span class="fn">print</span>(<span class="fn">search</span>(<span class="str">'alice'</span>, <span class="str">'churn customers'</span>))
<span class="fn">print</span>(<span class="fn">search</span>(<span class="str">'eve'</span>,   <span class="str">'revenue'</span>))
<span class="fn">print</span>(<span class="fn">search</span>(<span class="str">'bob'</span>,   <span class="str">'support tickets'</span>))
<span class="fn">print</span>(<span class="str">'\\n--- audit log ---'</span>)
<span class="fn">print</span>(json.<span class="fn">dumps</span>(audit, indent=<span class="num">2</span>))</code></pre></div>
</div>

<p class="l-text"><strong>Yetenek tabanlı RBAC demosu, adım adım:</strong> 1) <code>USERS</code> üç kimliği <code>{tenant, scopes}</code>'a eşler — tam olarak bir JWT'nin taşıyacağı şekil. 2) <code>authorize(user_id, action, tenant_target)</code> sırayla bilinmeyen kullanıcıları, eksik scope'ları ve kiracılar arası erişimi reddeder — sıra önemlidir çünkü erken dönmek hangi kontrolün başarısız olduğunu sızdırmamak için gereklidir. 3) <code>search(user_id, query)</code> <code>authorize</code>'ı çağırır, <code>audit</code>'e zaman damgası, kullanıcı, karar ve sebepli yapısal bir satır ekler, ardından sonuç veya ret string'i döner. 4) Sürücü Alice'i (izinli), Eve'yi (scope yok), Bob'u (sadece okuma) koşturur ve audit log'unu JSON olarak basar — her düzenleyicinin beklediği SOC2/GDPR-stili iz.</p>


</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kapasite Planlaması</h2>

<p class="l-text">Peçete üzerinde yapabileceğin matematik. RAM, HNSW için bağlayıcı kısıtlamadır; disk-içi IVF varyantları için disk.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vektör RAM</div><div class="card-body">N × boyut × 4 bayt (float32). 10M × 1536 = 61 GB ham. HNSW grafı için %30 ekle.</div></div>
<div class="calc-card"><div class="card-title">Nicemlenmiş RAM</div><div class="card-body">PQ@8x sıkıştırma: ÷4. SQ@int8: ÷4. Aynı 10M × 1536 ≈ 15-20 GB. Recall maliyeti: %1-3.</div></div>
<div class="calc-card"><div class="card-title">Sunucu başına QPS</div><div class="card-body">HNSW tek-thread: <code>ef</code>'e bağlı 500-2000 QPS. Çekirdeklerle çarp. Plato ~30k QPS/kutu.</div></div>
<div class="calc-card"><div class="card-title">Ölçek-yükseltme tetikleyici</div><div class="card-body">RAM &gt; %70 VEYA p99 &gt; 0.7 × SLO VEYA QPS &gt; ölçülen tavanın %70'i. %80'den önce sağla.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">📐 <strong>Çalışılmış örnek:</strong> 50M vektör × 768 boyut float32 = 153 GB ham + %30 graf = ~200 GB RAM. PQ@8x ile: ~50 GB, tek bir 64 GB sunucuya sığar. &gt; 20M vektörse ve %100 recall'a ihtiyacın yoksa her zaman PQ planla.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kayma Tespiti ve Kalite Gerilemesi</h2>

<p class="l-text">Sessiz katil. Gecikme dashboard'ları yeşil kalır. Hatalar sıfır kalır. Ama erişim kaliten yavaşça bozulur çünkü: (a) embedding dağılımı kaydı, (b) yeni içerik modelin kötü ele aldığı bir konuya hâkim, ya da (c) silmeler seyrek bir bölge bıraktı. Bunu sadece sürekli recall ölçümüyle yakalarsın.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Altın sorgu kümesi</div><div class="card-body">Elle etiketlenmiş top-10 ile 200-1000 sorgu. Dondurulmuş. Saatlik yeniden çalıştır. recall@10 trendini çiz.</div></div>
<div class="calc-card"><div class="card-title">Üretim gölgesi</div><div class="card-body">Gerçek sorguların %1'ini aday indekse yansıt, top-K Jaccard'ı karşılaştır. Etiket gerekmez.</div></div>
<div class="calc-card"><div class="card-title">Embedding kayması</div><div class="card-body">PCA(yeni vektörler) vs PCA(referans). Küme doluluğunda KL diverjansı. Büyük kaymada uyar.</div></div>
<div class="calc-card"><div class="card-title">Kullanıcı sinyali</div><div class="card-body">Tıklama oranı, "thumbs down", oturum terk. Geç ama ground truth.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Altın kümeye karşı saatlik recall@10 taraması</span>
<span class="kw">def</span> <span class="fn">recall_at_k</span>(retrieved, ground_truth, k=<span class="num">10</span>):
    gt_set = <span class="fn">set</span>(ground_truth[:k])
    ret_set = <span class="fn">set</span>(retrieved[:k])
    <span class="kw">return</span> <span class="fn">len</span>(gt_set &amp; ret_set) / k

scores = []
<span class="kw">for</span> q <span class="kw">in</span> golden_queries:
    pred = vector_db.<span class="fn">search</span>(q[<span class="str">'text'</span>], top_k=<span class="num">10</span>)
    scores.<span class="fn">append</span>(<span class="fn">recall_at_k</span>([r.id <span class="kw">for</span> r <span class="kw">in</span> pred], q[<span class="str">'gt_ids'</span>]))

mean_recall = <span class="fn">sum</span>(scores) / <span class="fn">len</span>(scores)
RECALL_10.<span class="fn">labels</span>(<span class="str">'docs'</span>).<span class="fn">set</span>(mean_recall)
<span class="kw">if</span> mean_recall &lt; <span class="num">0.90</span>:
    <span class="fn">alert</span>(<span class="str">'Recall@10 dropped below 0.90 — investigate index health'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Saatlik recall@10 taraması, adım adım:</strong> 1) <code>recall_at_k(retrieved, ground_truth, k=10)</code> iki listeyi de kümeye çevirir, kesişimi alır ve k'ye böler — kanonik recall metriği. 2) Döngü her altın sorguyu canlı <code>vector_db.search</code>'e koşturur ve sorgu başına recall'u ekler. 3) <code>mean_recall</code> küme genelinde ortalama alır, ardından <code>RECALL_10.labels('docs').set(mean_recall)</code> değeri Grafana'nın çizdiği Prometheus gauge'una iter. 4) <code>mean_recall &lt; 0.90</code> ise yardımcı <code>alert(...)</code> sayfa açar; nöbetçi kullanıcılar fark etmeden inceler.</p>


<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Üretim Runbook'u</h2>

<p class="l-text">Çağrı patladığında düşünmek istemezsin — bir kontrol listesi istersin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">🚨 p99 gecikme sıçraması</div><div class="card-body">1) QPS'yi kontrol et — DDoS mı? 2) Tombstone oranını kontrol et. 3) Segment sayısını kontrol et. 4) Gerekirse sıkıştırma tetikle.</div></div>
<div class="calc-card"><div class="card-title">🚨 Recall düşüşü</div><div class="card-body">1) Embedding model_id dağılımını karşılaştır. 2) Verbose log'larla altın kümeyi yeniden oynat. 3) Son indeks değişikliklerini geri al.</div></div>
<div class="calc-card"><div class="card-title">🚨 RAM &gt; %90</div><div class="card-body">1) Düğüm ekle + yeniden shard. 2) Veya sıcak koleksiyonda PQ etkinleştir. 3) En ağır kiracılarda upsert'leri geçici olarak sınırla.</div></div>
<div class="calc-card"><div class="card-title">🚨 Embedding bütçe yanması</div><div class="card-body">1) Kritik olmayan yollarda daha ucuz modele geç. 2) Embedding'leri içerik hash'iyle önbelleğe al. 3) Arka plan yeniden-embed işlerini kıs.</div></div>
<div class="calc-card"><div class="card-title">🚨 Kiracı kaçağı</div><div class="card-body">1) Ad alanı başına QPS ile kim olduğunu belirle. 2) Hız sınırı uygula. 3) Müşteri başarısını bilgilendir.</div></div>
<div class="calc-card"><div class="card-title">🚨 İndeks bozulması</div><div class="card-body">1) Yazmaları durdur. 2) En son snapshot'ı yeni koleksiyona geri yükle. 3) WAL/oplog'u yeniden oynat. 4) Alias değiştir.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎓 <strong>Sonraki ders (L8 capstone):</strong> her şeyi birleştiriyoruz — chunker, embedder, vektör indeksi, yeniden sıralayıcı, LLM, değerlendirici, izleme — gönderebileceğin üretim-kalite RAG pipeline'ına.</div>
</div>`
};
