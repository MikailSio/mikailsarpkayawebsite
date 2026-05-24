window.VECTORDB_L8 = {
en: `<p class="l-text"><strong>Capstone time.</strong> Eight lessons of theory and operations land here, in one production-grade RAG pipeline: <em>chunker → embedder → index → retriever → reranker → generator → evaluator → monitor → multi-tenant auth</em>. We are not building a notebook demo; we are building the system you would deploy at a Series-A startup serving 50k chats per day across 200 customers.</p>

<p class="l-text">First we walk the real stack — <strong>LangChain orchestration, BGE chunking, Voyage/OpenAI embeddings, Qdrant index, Cohere rerank, Claude generation, RAGAS eval, LangSmith tracing</strong> — as production code. Then we collapse the same pipeline into a Pyodide-runnable mini-RAG using <code>df_reviews</code>: TF-IDF embedding, cosine retrieval, RRF rerank, sklearn-judge eval, mock LLM. End-to-end runnable in your browser.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Wire chunker, embedder, index, retriever, reranker, generator into one pipeline</li>
<li>Choose chunking strategy: recursive vs semantic vs agentic, with overlap math</li>
<li>Select embedder by latency × cost × MTEB score (BGE / OpenAI / Voyage)</li>
<li>Add Cohere/BGE rerank to lift NDCG@10 by 10-20 points</li>
<li>Evaluate with RAGAS metrics: faithfulness, context relevance, answer relevance</li>
<li>Trace and monitor with LangSmith + Prometheus</li>
<li>Add multi-tenant auth and per-tenant rate limits</li>
<li>Build a complete runnable mini-RAG over <code>df_reviews</code> in your browser</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Pipeline Anatomy</h2>

<p class="l-text">Every production RAG looks roughly like this:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Chunker</div><div class="card-body">Splits docs into 256-1024 token windows with 10-20% overlap. Cost: cheap CPU.</div></div>
<div class="calc-card"><div class="card-title">2. Embedder</div><div class="card-body">Maps each chunk → dense vector (768-3072 dim). Cost: $0.10-0.13 per M tokens.</div></div>
<div class="calc-card"><div class="card-title">3. Index</div><div class="card-body">Stores vectors + metadata. Qdrant/Pinecone/pgvector. RAM-bound.</div></div>
<div class="calc-card"><div class="card-title">4. Retriever</div><div class="card-body">Top-K (usually K=20-50) by ANN. Hybrid with BM25 lifts recall.</div></div>
<div class="calc-card"><div class="card-title">5. Reranker</div><div class="card-body">Cross-encoder rescores K=20 → top 5. Cohere rerank-v3 or BGE-reranker.</div></div>
<div class="calc-card"><div class="card-title">6. Generator</div><div class="card-body">LLM (Claude/GPT) generates answer from top 5 chunks + system prompt.</div></div>
<div class="calc-card"><div class="card-title">7. Evaluator</div><div class="card-body">RAGAS scores faithfulness, context_relevance, answer_relevance offline + sampled online.</div></div>
<div class="calc-card"><div class="card-title">8. Monitor</div><div class="card-body">LangSmith trace + Prom metrics. Per-tenant cost, latency, quality.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">💰 <strong>Real cost per query:</strong> embed query ($0.0001) + retrieve (~$0.0002) + rerank ($0.002) + LLM ($0.005-0.05) ≈ <strong>$0.005-0.05 per query</strong>. The LLM dominates by 10x.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Chunking Strategy</h2>

<p class="l-text">The unsexy step that determines retrieval quality more than the embedder choice. Three patterns:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Recursive (default)</div><div class="card-body">Split by paragraph, then sentence, then word. 512 tokens, 50 overlap. Cheap, works 80% of cases.</div></div>
<div class="calc-card"><div class="card-title">Semantic</div><div class="card-body">Embed sentences, split where embedding distance spikes. Topic-aware boundaries. 2x cost.</div></div>
<div class="calc-card"><div class="card-title">Agentic</div><div class="card-body">LLM proposes splits ("end this chunk after the conclusion sentence"). Highest quality, $$$.</div></div>
<div class="calc-card"><div class="card-title">Structural</div><div class="card-body">For code/markdown/HTML — split at function/heading boundaries. Free quality lift.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.text_splitter <span class="kw">import</span> RecursiveCharacterTextSplitter

splitter = <span class="fn">RecursiveCharacterTextSplitter</span>(
    chunk_size=<span class="num">512</span>,
    chunk_overlap=<span class="num">50</span>,
    separators=[<span class="str">'\\n\\n'</span>, <span class="str">'\\n'</span>, <span class="str">'. '</span>, <span class="str">' '</span>, <span class="str">''</span>],
    length_function=<span class="fn">len</span>,
)

chunks = splitter.<span class="fn">split_documents</span>(docs)
<span class="cm"># Each chunk has .page_content + .metadata (source, page, chunk_idx)</span></code></pre></div>

<p class="l-text"><strong>RecursiveCharacterTextSplitter, step by step:</strong> 1) <code>chunk_size=512, chunk_overlap=50</code> sets the target window and the 10% overlap that keeps cross-chunk context. 2) The <code>separators</code> list — <code>['\\n\\n', '\\n', '. ', ' ', '']</code> — is tried in order, falling back from paragraph break to sentence to word to character; this is what makes the splitter "recursive". 3) <code>length_function=len</code> measures size in characters; swap for a token counter when you need precise token budgets. 4) <code>splitter.split_documents(docs)</code> returns objects with <code>.page_content</code> and <code>.metadata</code> already containing <code>source</code>, <code>page</code> and <code>chunk_idx</code> — the metadata you need for citations.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sliding-window chunker with overlap. Same logic as RecursiveCharacterTextSplitter at small scale.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">chunk</span>(text, size=<span class="num">200</span>, overlap=<span class="num">40</span>):
    out = []
    i = <span class="num">0</span>
    <span class="kw">while</span> i &lt; <span class="fn">len</span>(text):
        out.<span class="fn">append</span>(text[i:i+size])
        i += size - overlap
    <span class="kw">return</span> out

doc = (<span class="str">'RAG pipelines retrieve relevant context before generation. '</span> * <span class="num">20</span>)
chunks = <span class="fn">chunk</span>(doc, size=<span class="num">200</span>, overlap=<span class="num">40</span>)
<span class="fn">print</span>(f<span class="str">'doc length: {len(doc)} chars'</span>)
<span class="fn">print</span>(f<span class="str">'chunks: {len(chunks)}'</span>)
<span class="fn">print</span>(f<span class="str">'first chunk: {chunks[0][:80]}...'</span>)
<span class="fn">print</span>(f<span class="str">'last chunk : ...{chunks[-1][-80:]}'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Sliding-window chunker, step by step:</strong> 1) <code>chunk(text, size=200, overlap=40)</code> walks <code>text</code> with stride <code>size - overlap = 160</code>, producing 200-character windows that each share 40 characters with the next. 2) The driver builds a synthetic doc by repeating one RAG sentence 20 times. 3) Printing <code>len(doc)</code> versus <code>len(chunks)</code> verifies the math <code>chunks ≈ doc/(size-overlap)</code>. 4) Showing the first 80 chars of <code>chunks[0]</code> and the last 80 of <code>chunks[-1]</code> confirms the boundaries — the same recursive splitter behaviour without the LangChain dependency.</p>


</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Embedder Selection</h2>

<p class="l-text">Pick by three axes: <strong>MTEB score</strong> (quality), <strong>$/M tokens</strong> (cost), <strong>latency</strong> (p50). The right answer depends on your bottleneck.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenAI 3-large</div><div class="card-body">3072 dim. MTEB 64.6. $0.13/M. p50 ~80ms. Default if budget allows.</div></div>
<div class="calc-card"><div class="card-title">OpenAI 3-small</div><div class="card-body">1536 dim. MTEB 62.3. $0.02/M. 6x cheaper than 3-large. Strong default.</div></div>
<div class="calc-card"><div class="card-title">Voyage v2 large</div><div class="card-body">1536 dim. MTEB 65.1. $0.12/M. Best for code + technical docs.</div></div>
<div class="calc-card"><div class="card-title">BGE-large self-host</div><div class="card-body">1024 dim. MTEB 64.2. ~$0.005/M (GPU amortized). Best $/quality if you have infra.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎯 <strong>Decision tree:</strong> &lt; 1M docs → OpenAI 3-small (cheapest, 80% of quality). 1M-100M docs + budget → 3-large or Voyage. 100M+ docs OR strict latency → self-host BGE on GPU.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Retrieval &amp; Reranking</h2>

<p class="l-text">Pure dense retrieval gets you ~70% of the way. Adding a rerank step typically lifts NDCG@10 by 10-20 points and is the single biggest quality win in modern RAG.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stage 1: dense (K=50)</div><div class="card-body">ANN over your vector index. Cast a wide net.</div></div>
<div class="calc-card"><div class="card-title">Stage 1b: BM25 (K=50)</div><div class="card-body">Optional hybrid. RRF fuse with dense. Catches rare keyword matches embeddings miss.</div></div>
<div class="calc-card"><div class="card-title">Stage 2: cross-encoder rerank</div><div class="card-body">Cohere rerank-v3 or BGE-reranker. Score (query, chunk) jointly. Returns top 5.</div></div>
<div class="calc-card"><div class="card-title">Stage 3: filter</div><div class="card-body">Drop chunks below score threshold (e.g. 0.3). Better to give LLM 2 great chunks than 5 mediocre.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">import</span> cohere

qd = <span class="fn">QdrantClient</span>(url=<span class="str">'http://localhost:6333'</span>)
co = cohere.<span class="fn">Client</span>(api_key=<span class="str">'...'</span>)

<span class="kw">def</span> <span class="fn">retrieve</span>(query: <span class="fn">str</span>, tenant: <span class="fn">str</span>, k_dense=<span class="num">50</span>, k_final=<span class="num">5</span>):
    <span class="cm"># Stage 1: dense retrieval</span>
    qvec = <span class="fn">embed</span>(query)
    candidates = qd.<span class="fn">search</span>(
        collection_name=<span class="str">'docs'</span>,
        query_vector=qvec,
        query_filter={<span class="str">'must'</span>: [{<span class="str">'key'</span>: <span class="str">'tenant'</span>, <span class="str">'match'</span>: {<span class="str">'value'</span>: tenant}}]},
        limit=k_dense,
    )
    docs = [c.payload[<span class="str">'text'</span>] <span class="kw">for</span> c <span class="kw">in</span> candidates]

    <span class="cm"># Stage 2: cross-encoder rerank</span>
    rr = co.<span class="fn">rerank</span>(model=<span class="str">'rerank-english-v3.0'</span>, query=query,
                   documents=docs, top_n=k_final)
    <span class="kw">return</span> [docs[r.index] <span class="kw">for</span> r <span class="kw">in</span> rr.results <span class="kw">if</span> r.relevance_score &gt; <span class="num">0.3</span>]</code></pre></div>
</div>

<p class="l-text"><strong>Two-stage retrieve + rerank, step by step:</strong> 1) <code>QdrantClient(url=...)</code> and <code>cohere.Client(api_key=...)</code> open the two backends. 2) <code>retrieve(query, tenant, k_dense=50, k_final=5)</code> first embeds <code>query</code> via your <code>embed</code> helper. 3) <code>qd.search</code> runs a tenant-filtered ANN, asking for 50 candidates — the wide net Stage 1 needs. 4) Stage 2 sends those candidate texts plus the query to <code>co.rerank(model='rerank-english-v3.0', ..., top_n=k_final)</code>, the cross-encoder that scores (query, doc) jointly. 5) The list comprehension keeps only candidates whose <code>relevance_score &gt; 0.3</code>, discarding weak matches before they reach the LLM.</p>


<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Generation &amp; Prompting</h2>

<p class="l-text">The generator is where users feel the system. Three rules: <strong>cite sources</strong> (chunk_id in answer), <strong>refuse when context is weak</strong> (avoid hallucination), <strong>match output schema</strong> (JSON for downstream, prose for humans).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> anthropic <span class="kw">import</span> Anthropic

client = <span class="fn">Anthropic</span>()

SYS = (
    <span class="str">'You answer based ONLY on the provided context chunks. '</span>
    <span class="str">'Cite each fact with [chunk_id]. '</span>
    <span class="str">'If the answer is not in the context, reply <span class="str">"I do not know based on the provided sources."</span>'</span>
)

<span class="kw">def</span> <span class="fn">generate</span>(query: <span class="fn">str</span>, chunks: <span class="fn">list</span>[<span class="fn">dict</span>]) -&gt; <span class="fn">str</span>:
    ctx = <span class="str">'\\n\\n'</span>.<span class="fn">join</span>(f<span class="str">'[{c[\"id\"]}] {c[\"text\"]}'</span> <span class="kw">for</span> c <span class="kw">in</span> chunks)
    msg = client.messages.<span class="fn">create</span>(
        model=<span class="str">'claude-opus-4-5'</span>,
        max_tokens=<span class="num">600</span>,
        system=SYS,
        messages=[{<span class="str">'role'</span>: <span class="str">'user'</span>,
                   <span class="str">'content'</span>: f<span class="str">'Context:\\n{ctx}\\n\\nQuestion: {query}'</span>}],
    )
    <span class="kw">return</span> msg.content[<span class="num">0</span>].text</code></pre></div>
</div>

<p class="l-text"><strong>Claude generator with citations, step by step:</strong> 1) <code>SYS</code> is a 3-rule system prompt — answer only from context, cite with <code>[chunk_id]</code>, refuse when the answer is missing. These three lines do more for hallucination control than any decoding parameter. 2) <code>generate(query, chunks)</code> turns the chunk list into <code>"[id] text"</code> blocks separated by blank lines so the model sees clean citation anchors. 3) <code>client.messages.create(model='claude-opus-4-5', max_tokens=600, system=SYS, messages=[{...}])</code> runs the actual generation with a tight token budget to keep latency in check. 4) Returning <code>msg.content[0].text</code> yields the final cited answer string to the caller.</p>


<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Evaluation with RAGAS</h2>

<p class="l-text">Three metrics matter for RAG quality, all LLM-judged:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Faithfulness</div><div class="card-body">Does the answer follow from the retrieved context? Detects hallucination.</div></div>
<div class="calc-card"><div class="card-title">Context relevance</div><div class="card-body">Are retrieved chunks actually relevant to the query? Diagnoses retriever.</div></div>
<div class="calc-card"><div class="card-title">Answer relevance</div><div class="card-body">Does the answer address the question? Diagnoses generator/prompt.</div></div>
<div class="calc-card"><div class="card-title">Context recall</div><div class="card-body">Did retrieval surface all the chunks needed for the ground-truth answer? Needs labels.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> ragas <span class="kw">import</span> evaluate
<span class="kw">from</span> ragas.metrics <span class="kw">import</span> faithfulness, answer_relevancy, context_relevancy
<span class="kw">from</span> datasets <span class="kw">import</span> Dataset

eval_set = Dataset.<span class="fn">from_list</span>([
    {<span class="str">'question'</span>: q, <span class="str">'answer'</span>: a, <span class="str">'contexts'</span>: c, <span class="str">'ground_truth'</span>: gt}
    <span class="kw">for</span> q, a, c, gt <span class="kw">in</span> samples
])

result = <span class="fn">evaluate</span>(
    eval_set,
    metrics=[faithfulness, answer_relevancy, context_relevancy],
)
<span class="fn">print</span>(result)
<span class="cm"># {'faithfulness': 0.91, 'answer_relevancy': 0.88, 'context_relevancy': 0.74}</span></code></pre></div>
</div>

<p class="l-text"><strong>RAGAS evaluation harness, step by step:</strong> 1) <code>Dataset.from_list([...])</code> turns each sample tuple <code>(q, a, c, gt)</code> into a row with the keys RAGAS expects: <code>question</code>, <code>answer</code>, <code>contexts</code>, <code>ground_truth</code>. 2) <code>evaluate(eval_set, metrics=[faithfulness, answer_relevancy, context_relevancy])</code> runs an LLM judge per metric on every row. 3) The returned dict prints averages such as <code>{'faithfulness': 0.91, ...}</code> — a single number per dimension that you can plot over time. 4) Running this on a sampled 1% of production traffic gives you the early-warning signal for retrieval or generation regressions, before users complain.</p>


<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Multi-Tenant Auth + Tracing</h2>

<p class="l-text">Production wraps everything in tenant isolation + observability. JWT in, tenant claim out, every call traced to LangSmith for debug + cost attribution.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
os.environ[<span class="str">'LANGCHAIN_TRACING_V2'</span>] = <span class="str">'true'</span>
os.environ[<span class="str">'LANGCHAIN_PROJECT'</span>]    = <span class="str">'rag-prod'</span>

<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Depends, HTTPException, Header
<span class="kw">from</span> langsmith <span class="kw">import</span> traceable
<span class="kw">import</span> jwt

app = <span class="fn">FastAPI</span>()

<span class="kw">def</span> <span class="fn">auth</span>(authorization: <span class="fn">str</span> = <span class="fn">Header</span>(...)):
    claims = jwt.<span class="fn">decode</span>(authorization.<span class="fn">replace</span>(<span class="str">'Bearer '</span>, <span class="str">''</span>),
                        os.environ[<span class="str">'JWT_SECRET'</span>], algorithms=[<span class="str">'HS256'</span>])
    <span class="kw">return</span> claims  <span class="cm"># {'tenant_id', 'user_id', 'scopes'}</span>

<span class="kw">@traceable</span>(run_type=<span class="str">'chain'</span>, name=<span class="str">'rag_query'</span>)
<span class="kw">def</span> <span class="fn">rag_query</span>(query: <span class="fn">str</span>, tenant_id: <span class="fn">str</span>) -&gt; <span class="fn">dict</span>:
    chunks = <span class="fn">retrieve</span>(query, tenant_id, k_dense=<span class="num">50</span>, k_final=<span class="num">5</span>)
    answer = <span class="fn">generate</span>(query, chunks)
    <span class="kw">return</span> {<span class="str">'answer'</span>: answer, <span class="str">'sources'</span>: [c[<span class="str">'id'</span>] <span class="kw">for</span> c <span class="kw">in</span> chunks]}

<span class="kw">@app</span>.<span class="fn">post</span>(<span class="str">'/v1/query'</span>)
<span class="kw">def</span> <span class="fn">query_endpoint</span>(query: <span class="fn">str</span>, user=<span class="fn">Depends</span>(auth)):
    <span class="kw">if</span> <span class="str">'rag:read'</span> <span class="kw">not</span> <span class="kw">in</span> user[<span class="str">'scopes'</span>]:
        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">403</span>)
    <span class="kw">return</span> <span class="fn">rag_query</span>(query, user[<span class="str">'tenant_id'</span>])</code></pre></div>
</div>

<p class="l-text"><strong>JWT auth + LangSmith tracing, step by step:</strong> 1) Setting <code>LANGCHAIN_TRACING_V2=true</code> and <code>LANGCHAIN_PROJECT='rag-prod'</code> at import time wires every downstream call into LangSmith. 2) <code>auth(authorization: str = Header(...))</code> strips <code>Bearer </code> and validates the JWT with <code>jwt.decode(..., algorithms=['HS256'])</code>; the returned claims dict carries tenant, user and scopes. 3) <code>@traceable(run_type='chain', name='rag_query')</code> wraps <code>rag_query</code> so each call ships a parent span to LangSmith with retrieve and generate as child spans. 4) The endpoint <code>POST /v1/query</code> declares <code>user=Depends(auth)</code>, raises <code>403</code> when the <code>rag:read</code> scope is missing, and otherwise calls the traced function with the tenant pulled from the verified JWT.</p>


<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. End-to-End Cost &amp; Latency Budget</h2>

<p class="l-text">Before you ship, budget every microsecond and every fraction of a cent. A single chat turn touches 4-6 services. The numbers below are real averages from production RAG deployments at ~10k QPM scale.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Embed query</div><div class="card-body">~30ms · $0.0001 · OpenAI 3-small over single query</div></div>
<div class="calc-card"><div class="card-title">Vector retrieve</div><div class="card-body">~20ms · $0.0002 · Qdrant ANN, K=50, HNSW ef=128</div></div>
<div class="calc-card"><div class="card-title">Rerank top-50</div><div class="card-body">~120ms · $0.002 · Cohere rerank-v3 (50 docs scored)</div></div>
<div class="calc-card"><div class="card-title">LLM generate</div><div class="card-body">~1500ms · $0.005-0.05 · Claude/GPT, 800 in + 300 out tokens</div></div>
<div class="calc-card"><div class="card-title">Total p50</div><div class="card-body">~1.7s · $0.008-0.05 per query · LLM dominates 80% of both</div></div>
<div class="calc-card"><div class="card-title">Levers</div><div class="card-body">Smaller LLM (-50% cost), cache embeddings (-30% cost), self-host BGE (-90% embed cost)</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Capstone: Browser-Runnable Mini-RAG</h2>

<p class="l-text">Now we collapse the entire pipeline into something you can <strong>actually run right now in your browser</strong>. We swap each production component for an equivalent that runs in Pyodide:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chunker</div><div class="card-body">Sliding-window over <code>df_reviews['text']</code></div></div>
<div class="calc-card"><div class="card-title">Embedder</div><div class="card-body">TF-IDF (sklearn) instead of OpenAI</div></div>
<div class="calc-card"><div class="card-title">Index</div><div class="card-body">numpy matrix + cosine instead of Qdrant HNSW</div></div>
<div class="calc-card"><div class="card-title">Reranker</div><div class="card-body">RRF fusion of TF-IDF + BM25-like keyword score</div></div>
<div class="calc-card"><div class="card-title">Generator</div><div class="card-body">Mock LLM = top-chunk concatenation with citation</div></div>
<div class="calc-card"><div class="card-title">Evaluator</div><div class="card-body">sklearn LogReg trained on (query, retrieved, label) triples</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Full RAG pipeline — runnable in browser</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Chunk → embed → retrieve → rerank → generate → evaluate. Uses df_reviews from preamble.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># 1. CHUNKER — split each review into 80-char windows w/ 20-char overlap</span>
<span class="kw">def</span> <span class="fn">chunk</span>(text, size=<span class="num">80</span>, overlap=<span class="num">20</span>):
    <span class="kw">return</span> [text[i:i+size] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">max</span>(<span class="num">1</span>, <span class="fn">len</span>(text)-overlap), size-overlap)]

chunks, chunk_meta = [], []
<span class="kw">for</span> idx, row <span class="kw">in</span> df_reviews.<span class="fn">head</span>(<span class="num">150</span>).<span class="fn">iterrows</span>():
    <span class="kw">for</span> j, c <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="fn">chunk</span>(row[<span class="str">'text'</span>])):
        chunks.<span class="fn">append</span>(c)
        chunk_meta.<span class="fn">append</span>({<span class="str">'review_id'</span>: idx, <span class="str">'chunk_idx'</span>: j,
                           <span class="str">'sentiment'</span>: row[<span class="str">'sentiment'</span>]})
<span class="fn">print</span>(f<span class="str">'1. CHUNKER: {len(chunks)} chunks from 150 reviews'</span>)

<span class="cm"># 2. EMBEDDER — TF-IDF stand-in for OpenAI embeddings</span>
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>))
chunk_vecs = vec.<span class="fn">fit_transform</span>(chunks)
<span class="fn">print</span>(f<span class="str">'2. EMBEDDER: {chunk_vecs.shape[1]}-dim TF-IDF vectors'</span>)

<span class="cm"># 3. INDEX — sparse matrix in memory (Qdrant analog)</span>
<span class="fn">print</span>(f<span class="str">'3. INDEX: {chunk_vecs.shape[0]} vectors stored'</span>)

<span class="cm"># 4. RETRIEVER — dense top-K via cosine</span>
<span class="kw">def</span> <span class="fn">retrieve</span>(query, k=<span class="num">10</span>):
    qv = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(qv, chunk_vecs).<span class="fn">flatten</span>()
    top = np.<span class="fn">argsort</span>(-sims)[:k]
    <span class="kw">return</span> [(<span class="fn">int</span>(i), <span class="fn">float</span>(sims[i]), chunks[i]) <span class="kw">for</span> i <span class="kw">in</span> top]

<span class="cm"># 5. RERANKER — RRF fuse cosine rank + keyword overlap rank</span>
<span class="kw">def</span> <span class="fn">rerank</span>(query, candidates, k=<span class="num">3</span>):
    qtoks = <span class="fn">set</span>(query.<span class="fn">lower</span>().<span class="fn">split</span>())
    <span class="kw">def</span> <span class="fn">kw</span>(c): <span class="kw">return</span> <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> t <span class="kw">in</span> qtoks <span class="kw">if</span> t <span class="kw">in</span> c[<span class="num">2</span>].<span class="fn">lower</span>())
    by_cos = <span class="fn">sorted</span>(candidates, key=<span class="kw">lambda</span> c: -c[<span class="num">1</span>])
    by_kw  = <span class="fn">sorted</span>(candidates, key=<span class="kw">lambda</span> c: -<span class="fn">kw</span>(c))
    rrf = {}
    <span class="kw">for</span> r, c <span class="kw">in</span> <span class="fn">enumerate</span>(by_cos): rrf[c[<span class="num">0</span>]] = rrf.<span class="fn">get</span>(c[<span class="num">0</span>], <span class="num">0</span>) + <span class="num">1</span>/(<span class="num">60</span>+r)
    <span class="kw">for</span> r, c <span class="kw">in</span> <span class="fn">enumerate</span>(by_kw):  rrf[c[<span class="num">0</span>]] = rrf.<span class="fn">get</span>(c[<span class="num">0</span>], <span class="num">0</span>) + <span class="num">1</span>/(<span class="num">60</span>+r)
    fused = <span class="fn">sorted</span>(candidates, key=<span class="kw">lambda</span> c: -rrf[c[<span class="num">0</span>]])[:k]
    <span class="kw">return</span> fused

<span class="cm"># 6. GENERATOR — mock LLM concatenates top chunks with citation</span>
<span class="kw">def</span> <span class="fn">generate</span>(query, top_chunks):
    cited = <span class="str">' '</span>.<span class="fn">join</span>(f<span class="str">'[{c[0]}] {c[2]}'</span> <span class="kw">for</span> c <span class="kw">in</span> top_chunks)
    <span class="kw">return</span> f<span class="str">'Based on retrieved context, regarding <span class="str">"{query}"</span>: {cited[:300]}...'</span>

<span class="cm"># 7. EVALUATOR — sklearn LogReg as faithfulness judge</span>
<span class="cm"># Train on (chunk_sentiment_match_query) → label</span>
train_X, train_y = [], []
<span class="kw">for</span> q <span class="kw">in</span> [<span class="str">'great product'</span>, <span class="str">'terrible quality'</span>, <span class="str">'fast shipping'</span>, <span class="str">'broken item'</span>]:
    cands = <span class="fn">retrieve</span>(q, k=<span class="num">20</span>)
    <span class="kw">for</span> cid, sim, txt <span class="kw">in</span> cands:
        sentiment = chunk_meta[cid][<span class="str">'sentiment'</span>]
        <span class="kw">match</span> = <span class="fn">int</span>((<span class="str">'great'</span> <span class="kw">in</span> q <span class="kw">or</span> <span class="str">'fast'</span> <span class="kw">in</span> q) == (sentiment == <span class="str">'positive'</span>))
        train_X.<span class="fn">append</span>([sim, <span class="fn">len</span>(txt), txt.<span class="fn">lower</span>().<span class="fn">count</span>(q.<span class="fn">split</span>()[<span class="num">0</span>])])
        train_y.<span class="fn">append</span>(<span class="kw">match</span>)

judge = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">200</span>).<span class="fn">fit</span>(train_X, train_y)

<span class="kw">def</span> <span class="fn">evaluate_query</span>(query):
    cands = <span class="fn">retrieve</span>(query, k=<span class="num">10</span>)
    top = <span class="fn">rerank</span>(query, cands, k=<span class="num">3</span>)
    answer = <span class="fn">generate</span>(query, top)
    feats = [[c[<span class="num">1</span>], <span class="fn">len</span>(c[<span class="num">2</span>]), c[<span class="num">2</span>].<span class="fn">lower</span>().<span class="fn">count</span>(query.<span class="fn">split</span>()[<span class="num">0</span>])] <span class="kw">for</span> c <span class="kw">in</span> top]
    faith_scores = judge.<span class="fn">predict_proba</span>(feats)[:, <span class="num">1</span>]
    <span class="kw">return</span> {
        <span class="str">'query'</span>: query,
        <span class="str">'answer'</span>: answer[:<span class="num">120</span>] + <span class="str">'...'</span>,
        <span class="str">'top_chunks'</span>: [c[<span class="num">0</span>] <span class="kw">for</span> c <span class="kw">in</span> top],
        <span class="str">'faithfulness'</span>: <span class="fn">float</span>(np.<span class="fn">mean</span>(faith_scores)),
        <span class="str">'context_relevance'</span>: <span class="fn">float</span>(np.<span class="fn">mean</span>([c[<span class="num">1</span>] <span class="kw">for</span> c <span class="kw">in</span> top])),
    }

<span class="cm"># 8. RUN end-to-end on real queries</span>
<span class="fn">print</span>(<span class="str">'\\n4-7. RAG PIPELINE RESULTS:'</span>)
<span class="kw">for</span> q <span class="kw">in</span> [<span class="str">'great product quality'</span>, <span class="str">'shipping was slow'</span>, <span class="str">'broken on arrival'</span>]:
    r = <span class="fn">evaluate_query</span>(q)
    <span class="fn">print</span>(f<span class="str">'\\nQ: {r[\"query\"]}'</span>)
    <span class="fn">print</span>(f<span class="str">'  chunks: {r[\"top_chunks\"]}'</span>)
    <span class="fn">print</span>(f<span class="str">'  faithfulness:      {r[\"faithfulness\"]:.3f}'</span>)
    <span class="fn">print</span>(f<span class="str">'  context_relevance: {r[\"context_relevance\"]:.3f}'</span>)
    <span class="fn">print</span>(f<span class="str">'  answer: {r[\"answer\"]}'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Browser mini-RAG, step by step:</strong> 1) <code>chunk(text, size=80, overlap=20)</code> slides over the first 150 reviews and produces a flat <code>chunks</code> list plus parallel <code>chunk_meta</code> with <code>review_id</code>, <code>chunk_idx</code> and the sentiment label. 2) <code>TfidfVectorizer(max_features=2000, ngram_range=(1,2))</code> turns chunks into the in-browser embedding stand-in stored as <code>chunk_vecs</code>. 3) <code>retrieve(query, k=10)</code> embeds the query, runs <code>cosine_similarity</code> against <code>chunk_vecs</code>, and returns the top-k as <code>(id, score, text)</code> tuples. 4) <code>rerank</code> builds two rankings — cosine and query-token overlap — and fuses them with the literal RRF formula. 5) <code>generate</code> stitches cited chunks into a synthetic answer. 6) A <code>LogisticRegression</code> trained on <code>(similarity, length, keyword_count)</code> features acts as a tiny faithfulness judge. 7) <code>evaluate_query</code> runs the full retrieve → rerank → generate → judge loop and reports per-query faithfulness and context relevance — the same harness used by RAGAS, just shrunk to fit Pyodide.</p>


</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. From Capstone to Production</h2>

<p class="l-text">The mini-RAG above is structurally identical to the production pipeline. To ship for real, swap each component:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TF-IDF → BGE/OpenAI</div><div class="card-body">Replace <code>TfidfVectorizer</code> with <code>OpenAIEmbeddings</code> or self-hosted BGE inference server.</div></div>
<div class="calc-card"><div class="card-title">numpy → Qdrant</div><div class="card-body">Replace cosine matrix with Qdrant collection. Add filter for tenant_id.</div></div>
<div class="calc-card"><div class="card-title">RRF rerank → Cohere</div><div class="card-body">Replace fused-rank logic with <code>cohere.rerank()</code> cross-encoder call.</div></div>
<div class="calc-card"><div class="card-title">Mock LLM → Claude</div><div class="card-body">Replace <code>generate()</code> with Claude/GPT call. Add system prompt + citations.</div></div>
<div class="calc-card"><div class="card-title">LogReg judge → RAGAS</div><div class="card-body">Replace LogReg with RAGAS LLM-judge metrics on a sampled 1% of traffic.</div></div>
<div class="calc-card"><div class="card-title">Print → LangSmith + Prom</div><div class="card-body">Replace print statements with <code>@traceable</code> decorators and Prometheus counters.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎓 <strong>You finished the Vector DB track.</strong> You can now: design an index for a given workload (L1-L4), tune ANN algorithms (L5), operate at production scale (L6-L7), and architect end-to-end RAG with eval and monitoring (L8). Next track suggestions: <strong>LLM Agents</strong> (autonomous ReAct loops), <strong>NLP capstone</strong> (full transformer pretraining), or <strong>MLOps</strong> (CI/CD + monitoring for the broader stack).</div>
</div>`,
tr: `<p class="l-text"><strong>Capstone zamanı.</strong> Sekiz ders teori ve operasyon burada iniyor, tek bir üretim-kalite RAG pipeline'ında: <em>chunker → embedder → indeks → getirici → yeniden sıralayıcı → üretici → değerlendirici → izleyici → çoklu-kiracılı kimlik</em>. Bir notebook demosu kurmuyoruz; 200 müşteri arasında günlük 50k chat sunan bir A serisi startup'ta deploy edeceğin sistemi kuruyoruz.</p>

<p class="l-text">İlk olarak gerçek yığını yürüyoruz — <strong>LangChain orkestrasyonu, BGE chunking, Voyage/OpenAI embedding'leri, Qdrant indeksi, Cohere rerank, Claude üretimi, RAGAS eval, LangSmith tracing</strong> — üretim kodu olarak. Sonra aynı pipeline'ı <code>df_reviews</code> kullanarak Pyodide-çalışılabilir mini-RAG'a daraltıyoruz: TF-IDF embedding, kosinüs erişim, RRF rerank, sklearn-yargıç eval, sahte LLM. Tarayıcında uçtan uca çalıştırılabilir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Chunker, embedder, indeks, getirici, yeniden sıralayıcı, üreticiyi bir pipeline'a bağla</li>
<li>Chunking stratejisi seç: recursive vs semantic vs agentic, overlap matematiğiyle</li>
<li>Gecikme × maliyet × MTEB skoruna göre embedder seç (BGE / OpenAI / Voyage)</li>
<li>NDCG@10'u 10-20 puan yükseltmek için Cohere/BGE rerank ekle</li>
<li>RAGAS metrikleriyle değerlendir: faithfulness, context relevance, answer relevance</li>
<li>LangSmith + Prometheus ile izle ve trace yap</li>
<li>Çoklu-kiracılı kimlik ve kiracı başına hız sınırları ekle</li>
<li>Tarayıcında <code>df_reviews</code> üzerinde tam çalıştırılabilir bir mini-RAG kur</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Pipeline Anatomisi</h2>

<p class="l-text">Her üretim RAG'ı kabaca şöyle görünür:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Chunker</div><div class="card-body">Dokümanları %10-20 overlap ile 256-1024 token'lık pencerelere böler. Maliyet: ucuz CPU.</div></div>
<div class="calc-card"><div class="card-title">2. Embedder</div><div class="card-body">Her chunk → yoğun vektör (768-3072 boyut). Maliyet: M token başına $0.10-0.13.</div></div>
<div class="calc-card"><div class="card-title">3. İndeks</div><div class="card-body">Vektörleri + metadata'yı saklar. Qdrant/Pinecone/pgvector. RAM-bağlı.</div></div>
<div class="calc-card"><div class="card-title">4. Getirici</div><div class="card-body">ANN ile top-K (genellikle K=20-50). BM25 ile hibrit recall'u yükseltir.</div></div>
<div class="calc-card"><div class="card-title">5. Yeniden Sıralayıcı</div><div class="card-body">Cross-encoder K=20'yi yeniden puanlar → top 5. Cohere rerank-v3 veya BGE-reranker.</div></div>
<div class="calc-card"><div class="card-title">6. Üretici</div><div class="card-body">LLM (Claude/GPT) top 5 chunk + sistem prompt'undan cevap üretir.</div></div>
<div class="calc-card"><div class="card-title">7. Değerlendirici</div><div class="card-body">RAGAS faithfulness, context_relevance, answer_relevance'ı çevrimdışı + örneklenmiş çevrimiçi puanlar.</div></div>
<div class="calc-card"><div class="card-title">8. İzleyici</div><div class="card-body">LangSmith trace + Prom metrikleri. Kiracı başına maliyet, gecikme, kalite.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">💰 <strong>Sorgu başına gerçek maliyet:</strong> sorgu embed ($0.0001) + getir (~$0.0002) + rerank ($0.002) + LLM ($0.005-0.05) ≈ <strong>sorgu başına $0.005-0.05</strong>. LLM 10x ile baskındır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Chunking Stratejisi</h2>

<p class="l-text">Erişim kalitesini embedder seçiminden daha çok belirleyen heyecansız adım. Üç desen:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Recursive (varsayılan)</div><div class="card-body">Paragrafa, sonra cümleye, sonra kelimeye böl. 512 token, 50 overlap. Ucuz, vakaların %80'inde işe yarar.</div></div>
<div class="calc-card"><div class="card-title">Semantic</div><div class="card-body">Cümleleri embed et, embedding mesafesi sıçradığında böl. Konu-farkında sınırlar. 2x maliyet.</div></div>
<div class="calc-card"><div class="card-title">Agentic</div><div class="card-body">LLM bölmeler önerir ("bu chunk'ı sonuç cümlesinden sonra bitir"). En yüksek kalite, $$$.</div></div>
<div class="calc-card"><div class="card-title">Yapısal</div><div class="card-body">Kod/markdown/HTML için — fonksiyon/başlık sınırlarında böl. Bedava kalite artışı.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.text_splitter <span class="kw">import</span> RecursiveCharacterTextSplitter

splitter = <span class="fn">RecursiveCharacterTextSplitter</span>(
    chunk_size=<span class="num">512</span>,
    chunk_overlap=<span class="num">50</span>,
    separators=[<span class="str">'\\n\\n'</span>, <span class="str">'\\n'</span>, <span class="str">'. '</span>, <span class="str">' '</span>, <span class="str">''</span>],
    length_function=<span class="fn">len</span>,
)

chunks = splitter.<span class="fn">split_documents</span>(docs)
<span class="cm"># Her chunk'ta .page_content + .metadata (source, page, chunk_idx) var</span></code></pre></div>

<p class="l-text"><strong>RecursiveCharacterTextSplitter, adım adım:</strong> 1) <code>chunk_size=512, chunk_overlap=50</code> hedef pencereyi ve çapraz-chunk bağlamı koruyan %10 örtüşmeyi ayarlar. 2) <code>separators</code> listesi — <code>['\\n\\n', '\\n', '. ', ' ', '']</code> — paragraf molasından cümleye, kelimeye, karaktere sırayla geri çekilerek denenir; "recursive" olmasını sağlayan budur. 3) <code>length_function=len</code> boyutu karakterle ölçer; kesin token bütçesi gerektiğinde token sayacıyla değiştir. 4) <code>splitter.split_documents(docs)</code> <code>.page_content</code> ve <code>.metadata</code>'sında <code>source</code>, <code>page</code> ve <code>chunk_idx</code> içeren nesneler döner — atıflar için ihtiyacın olan metadata.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Overlap ile sliding-window chunker. Küçük ölçekte RecursiveCharacterTextSplitter ile aynı mantık.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">chunk</span>(text, size=<span class="num">200</span>, overlap=<span class="num">40</span>):
    out = []
    i = <span class="num">0</span>
    <span class="kw">while</span> i &lt; <span class="fn">len</span>(text):
        out.<span class="fn">append</span>(text[i:i+size])
        i += size - overlap
    <span class="kw">return</span> out

doc = (<span class="str">'RAG pipelines retrieve relevant context before generation. '</span> * <span class="num">20</span>)
chunks = <span class="fn">chunk</span>(doc, size=<span class="num">200</span>, overlap=<span class="num">40</span>)
<span class="fn">print</span>(f<span class="str">'doc length: {len(doc)} chars'</span>)
<span class="fn">print</span>(f<span class="str">'chunks: {len(chunks)}'</span>)
<span class="fn">print</span>(f<span class="str">'first chunk: {chunks[0][:80]}...'</span>)
<span class="fn">print</span>(f<span class="str">'last chunk : ...{chunks[-1][-80:]}'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Sliding-window chunker, adım adım:</strong> 1) <code>chunk(text, size=200, overlap=40)</code> <code>text</code>'i adım <code>size - overlap = 160</code> ile dolaşır; her biri bir sonraki ile 40 karakter paylaşan 200 karakterlik pencereler üretir. 2) Sürücü tek bir RAG cümlesini 20 kez tekrarlayarak sentetik bir doküman kurar. 3) <code>len(doc)</code> ile <code>len(chunks)</code>'u basmak <code>chunks ≈ doc/(size-overlap)</code> matematiğini doğrular. 4) <code>chunks[0]</code>'ın ilk 80 karakterini ve <code>chunks[-1]</code>'in son 80 karakterini göstermek sınırları onaylar — LangChain bağımlılığı olmadan aynı recursive splitter davranışı.</p>


</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Embedder Seçimi</h2>

<p class="l-text">Üç eksene göre seç: <strong>MTEB skoru</strong> (kalite), <strong>$/M token</strong> (maliyet), <strong>gecikme</strong> (p50). Doğru cevap darboğazına bağlıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenAI 3-large</div><div class="card-body">3072 boyut. MTEB 64.6. $0.13/M. p50 ~80ms. Bütçe izin verirse varsayılan.</div></div>
<div class="calc-card"><div class="card-title">OpenAI 3-small</div><div class="card-body">1536 boyut. MTEB 62.3. $0.02/M. 3-large'dan 6x ucuz. Güçlü varsayılan.</div></div>
<div class="calc-card"><div class="card-title">Voyage v2 large</div><div class="card-body">1536 boyut. MTEB 65.1. $0.12/M. Kod + teknik dokümanlar için en iyi.</div></div>
<div class="calc-card"><div class="card-title">BGE-large self-host</div><div class="card-body">1024 boyut. MTEB 64.2. ~$0.005/M (GPU amortize). Altyapın varsa en iyi $/kalite.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎯 <strong>Karar ağacı:</strong> &lt; 1M doküman → OpenAI 3-small (en ucuz, kalitenin %80'i). 1M-100M doküman + bütçe → 3-large veya Voyage. 100M+ doküman VEYA katı gecikme → GPU'da BGE self-host.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Erişim ve Yeniden Sıralama</h2>

<p class="l-text">Saf yoğun erişim seni ~%70 yola götürür. Bir rerank adımı eklemek tipik olarak NDCG@10'u 10-20 puan yükseltir ve modern RAG'da en büyük tek kalite kazancıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşama 1: dense (K=50)</div><div class="card-body">Vektör indeksin üzerinde ANN. Geniş ağ at.</div></div>
<div class="calc-card"><div class="card-title">Aşama 1b: BM25 (K=50)</div><div class="card-body">Opsiyonel hibrit. Dense ile RRF birleştir. Embedding'lerin kaçırdığı nadir anahtar kelime eşleşmelerini yakalar.</div></div>
<div class="calc-card"><div class="card-title">Aşama 2: cross-encoder rerank</div><div class="card-body">Cohere rerank-v3 veya BGE-reranker. (Sorgu, chunk)'ı ortaklaşa puanla. Top 5 döndürür.</div></div>
<div class="calc-card"><div class="card-title">Aşama 3: filtre</div><div class="card-body">Skor eşiğinin altındaki chunk'ları (örn. 0.3) at. LLM'e 5 vasat chunk'tan 2 harika chunk vermek daha iyi.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> qdrant_client <span class="kw">import</span> QdrantClient
<span class="kw">import</span> cohere

qd = <span class="fn">QdrantClient</span>(url=<span class="str">'http://localhost:6333'</span>)
co = cohere.<span class="fn">Client</span>(api_key=<span class="str">'...'</span>)

<span class="kw">def</span> <span class="fn">retrieve</span>(query: <span class="fn">str</span>, tenant: <span class="fn">str</span>, k_dense=<span class="num">50</span>, k_final=<span class="num">5</span>):
    <span class="cm"># Aşama 1: dense erişim</span>
    qvec = <span class="fn">embed</span>(query)
    candidates = qd.<span class="fn">search</span>(
        collection_name=<span class="str">'docs'</span>,
        query_vector=qvec,
        query_filter={<span class="str">'must'</span>: [{<span class="str">'key'</span>: <span class="str">'tenant'</span>, <span class="str">'match'</span>: {<span class="str">'value'</span>: tenant}}]},
        limit=k_dense,
    )
    docs = [c.payload[<span class="str">'text'</span>] <span class="kw">for</span> c <span class="kw">in</span> candidates]

    <span class="cm"># Aşama 2: cross-encoder yeniden sırala</span>
    rr = co.<span class="fn">rerank</span>(model=<span class="str">'rerank-english-v3.0'</span>, query=query,
                   documents=docs, top_n=k_final)
    <span class="kw">return</span> [docs[r.index] <span class="kw">for</span> r <span class="kw">in</span> rr.results <span class="kw">if</span> r.relevance_score &gt; <span class="num">0.3</span>]</code></pre></div>
</div>

<p class="l-text"><strong>İki aşamalı getir + yeniden sırala, adım adım:</strong> 1) <code>QdrantClient(url=...)</code> ve <code>cohere.Client(api_key=...)</code> iki backend'i açar. 2) <code>retrieve(query, tenant, k_dense=50, k_final=5)</code> önce <code>embed</code> yardımcısıyla <code>query</code>'yi embedlir. 3) <code>qd.search</code> kiracı-filtreli bir ANN koşturur; 50 aday ister — Aşama 1'in ihtiyacı olan geniş ağ. 4) Aşama 2, o aday metinleri ve sorguyu <code>co.rerank(model='rerank-english-v3.0', ..., top_n=k_final)</code>'a gönderir; (sorgu, doküman)'ı ortaklaşa puanlayan cross-encoder. 5) Liste anlama sadece <code>relevance_score &gt; 0.3</code> olan adayları tutar; zayıf eşleşmeleri LLM'e ulaşmadan eler.</p>


<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Üretim ve Prompting</h2>

<p class="l-text">Üretici, kullanıcıların sistemi hissettiği yerdir. Üç kural: <strong>kaynakları belirt</strong> (cevapta chunk_id), <strong>bağlam zayıfsa reddet</strong> (halüsinasyondan kaçın), <strong>çıktı şemasını eşle</strong> (alt akış için JSON, insanlar için düzyazı).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> anthropic <span class="kw">import</span> Anthropic

client = <span class="fn">Anthropic</span>()

SYS = (
    <span class="str">'You answer based ONLY on the provided context chunks. '</span>
    <span class="str">'Cite each fact with [chunk_id]. '</span>
    <span class="str">'If the answer is not in the context, reply <span class="str">"I do not know based on the provided sources."</span>'</span>
)

<span class="kw">def</span> <span class="fn">generate</span>(query: <span class="fn">str</span>, chunks: <span class="fn">list</span>[<span class="fn">dict</span>]) -&gt; <span class="fn">str</span>:
    ctx = <span class="str">'\\n\\n'</span>.<span class="fn">join</span>(f<span class="str">'[{c[\"id\"]}] {c[\"text\"]}'</span> <span class="kw">for</span> c <span class="kw">in</span> chunks)
    msg = client.messages.<span class="fn">create</span>(
        model=<span class="str">'claude-opus-4-5'</span>,
        max_tokens=<span class="num">600</span>,
        system=SYS,
        messages=[{<span class="str">'role'</span>: <span class="str">'user'</span>,
                   <span class="str">'content'</span>: f<span class="str">'Context:\\n{ctx}\\n\\nQuestion: {query}'</span>}],
    )
    <span class="kw">return</span> msg.content[<span class="num">0</span>].text</code></pre></div>
</div>

<p class="l-text"><strong>Atıflı Claude üretici, adım adım:</strong> 1) <code>SYS</code> üç kurallı bir sistem prompt'u — sadece bağlamdan cevapla, <code>[chunk_id]</code> ile atıfla, cevap eksikse reddet. Bu üç satır halüsinasyon kontrolü için herhangi bir decoding parametresinden daha fazlasını yapar. 2) <code>generate(query, chunks)</code> chunk listesini boş satırlarla ayrılmış <code>"[id] text"</code> bloklarına çevirir; modele temiz atıf çapaları gösterir. 3) <code>client.messages.create(model='claude-opus-4-5', max_tokens=600, system=SYS, messages=[{...}])</code> gecikmeyi sıkı tutmak için dar token bütçesiyle gerçek üretimi koşturur. 4) <code>msg.content[0].text</code> döndürmek son atıflı cevap string'ini çağırana verir.</p>


<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. RAGAS ile Değerlendirme</h2>

<p class="l-text">RAG kalitesi için üç metrik önemlidir, hepsi LLM-yargıçlı:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Faithfulness</div><div class="card-body">Cevap getirilen bağlamdan çıkıyor mu? Halüsinasyonu tespit eder.</div></div>
<div class="calc-card"><div class="card-title">Context relevance</div><div class="card-body">Getirilen chunk'lar gerçekten sorguya alakalı mı? Getiriciyi teşhis eder.</div></div>
<div class="calc-card"><div class="card-title">Answer relevance</div><div class="card-body">Cevap soruyu ele alıyor mu? Üreticiyi/prompt'u teşhis eder.</div></div>
<div class="calc-card"><div class="card-title">Context recall</div><div class="card-body">Erişim ground-truth cevap için gereken tüm chunk'ları yüzeye çıkardı mı? Etiket gerektirir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> ragas <span class="kw">import</span> evaluate
<span class="kw">from</span> ragas.metrics <span class="kw">import</span> faithfulness, answer_relevancy, context_relevancy
<span class="kw">from</span> datasets <span class="kw">import</span> Dataset

eval_set = Dataset.<span class="fn">from_list</span>([
    {<span class="str">'question'</span>: q, <span class="str">'answer'</span>: a, <span class="str">'contexts'</span>: c, <span class="str">'ground_truth'</span>: gt}
    <span class="kw">for</span> q, a, c, gt <span class="kw">in</span> samples
])

result = <span class="fn">evaluate</span>(
    eval_set,
    metrics=[faithfulness, answer_relevancy, context_relevancy],
)
<span class="fn">print</span>(result)
<span class="cm"># {'faithfulness': 0.91, 'answer_relevancy': 0.88, 'context_relevancy': 0.74}</span></code></pre></div>
</div>

<p class="l-text"><strong>RAGAS değerlendirme harness'ı, adım adım:</strong> 1) <code>Dataset.from_list([...])</code> her örnek tuple'ını <code>(q, a, c, gt)</code> RAGAS'ın beklediği anahtarlarla — <code>question</code>, <code>answer</code>, <code>contexts</code>, <code>ground_truth</code> — bir satıra çevirir. 2) <code>evaluate(eval_set, metrics=[faithfulness, answer_relevancy, context_relevancy])</code> her satırda metrik başına bir LLM yargıç koşturur. 3) Dönen dict <code>{'faithfulness': 0.91, ...}</code> gibi ortalamalar basar — boyut başına zamanla çizebileceğin tek bir sayı. 4) Bunu üretim trafiğinin örneklenmiş %1'inde koşturmak, kullanıcılar şikâyet etmeden erişim veya üretim gerilemeleri için erken-uyarı sinyali verir.</p>


<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Çoklu-Kiracılı Kimlik + Tracing</h2>

<p class="l-text">Üretim her şeyi kiracı izolasyonu + gözlemlenebilirlikte sarar. JWT girer, kiracı claim'i çıkar, debug + maliyet atfetme için her çağrı LangSmith'e trace edilir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os
os.environ[<span class="str">'LANGCHAIN_TRACING_V2'</span>] = <span class="str">'true'</span>
os.environ[<span class="str">'LANGCHAIN_PROJECT'</span>]    = <span class="str">'rag-prod'</span>

<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI, Depends, HTTPException, Header
<span class="kw">from</span> langsmith <span class="kw">import</span> traceable
<span class="kw">import</span> jwt

app = <span class="fn">FastAPI</span>()

<span class="kw">def</span> <span class="fn">auth</span>(authorization: <span class="fn">str</span> = <span class="fn">Header</span>(...)):
    claims = jwt.<span class="fn">decode</span>(authorization.<span class="fn">replace</span>(<span class="str">'Bearer '</span>, <span class="str">''</span>),
                        os.environ[<span class="str">'JWT_SECRET'</span>], algorithms=[<span class="str">'HS256'</span>])
    <span class="kw">return</span> claims  <span class="cm"># {'tenant_id', 'user_id', 'scopes'}</span>

<span class="kw">@traceable</span>(run_type=<span class="str">'chain'</span>, name=<span class="str">'rag_query'</span>)
<span class="kw">def</span> <span class="fn">rag_query</span>(query: <span class="fn">str</span>, tenant_id: <span class="fn">str</span>) -&gt; <span class="fn">dict</span>:
    chunks = <span class="fn">retrieve</span>(query, tenant_id, k_dense=<span class="num">50</span>, k_final=<span class="num">5</span>)
    answer = <span class="fn">generate</span>(query, chunks)
    <span class="kw">return</span> {<span class="str">'answer'</span>: answer, <span class="str">'sources'</span>: [c[<span class="str">'id'</span>] <span class="kw">for</span> c <span class="kw">in</span> chunks]}

<span class="kw">@app</span>.<span class="fn">post</span>(<span class="str">'/v1/query'</span>)
<span class="kw">def</span> <span class="fn">query_endpoint</span>(query: <span class="fn">str</span>, user=<span class="fn">Depends</span>(auth)):
    <span class="kw">if</span> <span class="str">'rag:read'</span> <span class="kw">not</span> <span class="kw">in</span> user[<span class="str">'scopes'</span>]:
        <span class="kw">raise</span> <span class="fn">HTTPException</span>(<span class="num">403</span>)
    <span class="kw">return</span> <span class="fn">rag_query</span>(query, user[<span class="str">'tenant_id'</span>])</code></pre></div>
</div>

<p class="l-text"><strong>JWT kimlik + LangSmith tracing, adım adım:</strong> 1) Import zamanında <code>LANGCHAIN_TRACING_V2=true</code> ve <code>LANGCHAIN_PROJECT='rag-prod'</code> ayarlamak alt-akıştaki her çağrıyı LangSmith'e bağlar. 2) <code>auth(authorization: str = Header(...))</code> <code>Bearer </code>'ı ayırır ve JWT'yi <code>jwt.decode(..., algorithms=['HS256'])</code> ile doğrular; dönen claims dict'i kiracı, kullanıcı ve scope'ları taşır. 3) <code>@traceable(run_type='chain', name='rag_query')</code> <code>rag_query</code>'yi sarar; her çağrı retrieve ve generate'i alt span'lar olarak LangSmith'e bir üst span olarak gönderir. 4) <code>POST /v1/query</code> endpoint'i <code>user=Depends(auth)</code> ilan eder, <code>rag:read</code> scope'u eksikse <code>403</code> fırlatır, aksi takdirde doğrulanmış JWT'den çekilen kiracıyla traced fonksiyonu çağırır.</p>


<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Uçtan Uca Maliyet ve Gecikme Bütçesi</h2>

<p class="l-text">Göndermeden önce her mikrosaniyeyi ve her sentin kesirini bütçele. Tek bir chat turu 4-6 servise dokunur. Aşağıdaki sayılar ~10k QPM ölçeğinde üretim RAG dağıtımlarından gerçek ortalamalardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sorgu embed</div><div class="card-body">~30ms · $0.0001 · OpenAI 3-small tek sorgu üzerinde</div></div>
<div class="calc-card"><div class="card-title">Vektör erişim</div><div class="card-body">~20ms · $0.0002 · Qdrant ANN, K=50, HNSW ef=128</div></div>
<div class="calc-card"><div class="card-title">Top-50 yeniden sırala</div><div class="card-body">~120ms · $0.002 · Cohere rerank-v3 (50 doküman puanlanır)</div></div>
<div class="calc-card"><div class="card-title">LLM üret</div><div class="card-body">~1500ms · $0.005-0.05 · Claude/GPT, 800 girdi + 300 çıktı token</div></div>
<div class="calc-card"><div class="card-title">Toplam p50</div><div class="card-body">~1.7s · sorgu başına $0.008-0.05 · LLM ikisinin de %80'ine hâkim</div></div>
<div class="calc-card"><div class="card-title">Kaldıraçlar</div><div class="card-body">Daha küçük LLM (-%50 maliyet), embedding cache (-%30 maliyet), BGE self-host (-%90 embed maliyet)</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Capstone: Tarayıcıda Çalışan Mini-RAG</h2>

<p class="l-text">Şimdi tüm pipeline'ı <strong>tarayıcında şu anda gerçekten çalıştırabileceğin</strong> bir şeye daraltıyoruz. Her üretim bileşenini Pyodide'da çalışan bir eşdeğeriyle değiştiriyoruz:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chunker</div><div class="card-body"><code>df_reviews['text']</code> üzerinde sliding-window</div></div>
<div class="calc-card"><div class="card-title">Embedder</div><div class="card-body">OpenAI yerine TF-IDF (sklearn)</div></div>
<div class="calc-card"><div class="card-title">İndeks</div><div class="card-body">Qdrant HNSW yerine numpy matrisi + kosinüs</div></div>
<div class="calc-card"><div class="card-title">Yeniden Sıralayıcı</div><div class="card-body">TF-IDF + BM25-benzeri anahtar kelime skorunun RRF füzyonu</div></div>
<div class="calc-card"><div class="card-title">Üretici</div><div class="card-body">Sahte LLM = atıfla top-chunk birleştirme</div></div>
<div class="calc-card"><div class="card-title">Değerlendirici</div><div class="card-body">(sorgu, getirilen, etiket) üçlüleri üzerinde eğitilmiş sklearn LogReg</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Tam RAG pipeline — tarayıcıda çalıştırılabilir</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Chunk → embed → getir → yeniden sırala → üret → değerlendir. Preamble'dan df_reviews kullanır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

<span class="cm"># 1. CHUNKER — her yorumu 80 karakterlik pencerelere 20 karakterlik overlap ile böl</span>
<span class="kw">def</span> <span class="fn">chunk</span>(text, size=<span class="num">80</span>, overlap=<span class="num">20</span>):
    <span class="kw">return</span> [text[i:i+size] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">max</span>(<span class="num">1</span>, <span class="fn">len</span>(text)-overlap), size-overlap)]

chunks, chunk_meta = [], []
<span class="kw">for</span> idx, row <span class="kw">in</span> df_reviews.<span class="fn">head</span>(<span class="num">150</span>).<span class="fn">iterrows</span>():
    <span class="kw">for</span> j, c <span class="kw">in</span> <span class="fn">enumerate</span>(<span class="fn">chunk</span>(row[<span class="str">'text'</span>])):
        chunks.<span class="fn">append</span>(c)
        chunk_meta.<span class="fn">append</span>({<span class="str">'review_id'</span>: idx, <span class="str">'chunk_idx'</span>: j,
                           <span class="str">'sentiment'</span>: row[<span class="str">'sentiment'</span>]})
<span class="fn">print</span>(f<span class="str">'1. CHUNKER: {len(chunks)} chunks from 150 reviews'</span>)

<span class="cm"># 2. EMBEDDER — OpenAI embedding'leri yerine TF-IDF</span>
vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">2000</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>))
chunk_vecs = vec.<span class="fn">fit_transform</span>(chunks)
<span class="fn">print</span>(f<span class="str">'2. EMBEDDER: {chunk_vecs.shape[1]}-dim TF-IDF vectors'</span>)

<span class="cm"># 3. INDEX — bellek-içi seyrek matris (Qdrant analoğu)</span>
<span class="fn">print</span>(f<span class="str">'3. INDEX: {chunk_vecs.shape[0]} vectors stored'</span>)

<span class="cm"># 4. RETRIEVER — kosinüsle dense top-K</span>
<span class="kw">def</span> <span class="fn">retrieve</span>(query, k=<span class="num">10</span>):
    qv = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(qv, chunk_vecs).<span class="fn">flatten</span>()
    top = np.<span class="fn">argsort</span>(-sims)[:k]
    <span class="kw">return</span> [(<span class="fn">int</span>(i), <span class="fn">float</span>(sims[i]), chunks[i]) <span class="kw">for</span> i <span class="kw">in</span> top]

<span class="cm"># 5. RERANKER — kosinüs rank + anahtar kelime örtüşümü rank RRF birleştir</span>
<span class="kw">def</span> <span class="fn">rerank</span>(query, candidates, k=<span class="num">3</span>):
    qtoks = <span class="fn">set</span>(query.<span class="fn">lower</span>().<span class="fn">split</span>())
    <span class="kw">def</span> <span class="fn">kw</span>(c): <span class="kw">return</span> <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> t <span class="kw">in</span> qtoks <span class="kw">if</span> t <span class="kw">in</span> c[<span class="num">2</span>].<span class="fn">lower</span>())
    by_cos = <span class="fn">sorted</span>(candidates, key=<span class="kw">lambda</span> c: -c[<span class="num">1</span>])
    by_kw  = <span class="fn">sorted</span>(candidates, key=<span class="kw">lambda</span> c: -<span class="fn">kw</span>(c))
    rrf = {}
    <span class="kw">for</span> r, c <span class="kw">in</span> <span class="fn">enumerate</span>(by_cos): rrf[c[<span class="num">0</span>]] = rrf.<span class="fn">get</span>(c[<span class="num">0</span>], <span class="num">0</span>) + <span class="num">1</span>/(<span class="num">60</span>+r)
    <span class="kw">for</span> r, c <span class="kw">in</span> <span class="fn">enumerate</span>(by_kw):  rrf[c[<span class="num">0</span>]] = rrf.<span class="fn">get</span>(c[<span class="num">0</span>], <span class="num">0</span>) + <span class="num">1</span>/(<span class="num">60</span>+r)
    fused = <span class="fn">sorted</span>(candidates, key=<span class="kw">lambda</span> c: -rrf[c[<span class="num">0</span>]])[:k]
    <span class="kw">return</span> fused

<span class="cm"># 6. GENERATOR — sahte LLM top chunk'ları atıfla birleştirir</span>
<span class="kw">def</span> <span class="fn">generate</span>(query, top_chunks):
    cited = <span class="str">' '</span>.<span class="fn">join</span>(f<span class="str">'[{c[0]}] {c[2]}'</span> <span class="kw">for</span> c <span class="kw">in</span> top_chunks)
    <span class="kw">return</span> f<span class="str">'Based on retrieved context, regarding <span class="str">"{query}"</span>: {cited[:300]}...'</span>

<span class="cm"># 7. EVALUATOR — faithfulness yargıcı olarak sklearn LogReg</span>
<span class="cm"># (chunk_sentiment_match_query) → label üzerinde eğit</span>
train_X, train_y = [], []
<span class="kw">for</span> q <span class="kw">in</span> [<span class="str">'great product'</span>, <span class="str">'terrible quality'</span>, <span class="str">'fast shipping'</span>, <span class="str">'broken item'</span>]:
    cands = <span class="fn">retrieve</span>(q, k=<span class="num">20</span>)
    <span class="kw">for</span> cid, sim, txt <span class="kw">in</span> cands:
        sentiment = chunk_meta[cid][<span class="str">'sentiment'</span>]
        <span class="kw">match</span> = <span class="fn">int</span>((<span class="str">'great'</span> <span class="kw">in</span> q <span class="kw">or</span> <span class="str">'fast'</span> <span class="kw">in</span> q) == (sentiment == <span class="str">'positive'</span>))
        train_X.<span class="fn">append</span>([sim, <span class="fn">len</span>(txt), txt.<span class="fn">lower</span>().<span class="fn">count</span>(q.<span class="fn">split</span>()[<span class="num">0</span>])])
        train_y.<span class="fn">append</span>(<span class="kw">match</span>)

judge = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">200</span>).<span class="fn">fit</span>(train_X, train_y)

<span class="kw">def</span> <span class="fn">evaluate_query</span>(query):
    cands = <span class="fn">retrieve</span>(query, k=<span class="num">10</span>)
    top = <span class="fn">rerank</span>(query, cands, k=<span class="num">3</span>)
    answer = <span class="fn">generate</span>(query, top)
    feats = [[c[<span class="num">1</span>], <span class="fn">len</span>(c[<span class="num">2</span>]), c[<span class="num">2</span>].<span class="fn">lower</span>().<span class="fn">count</span>(query.<span class="fn">split</span>()[<span class="num">0</span>])] <span class="kw">for</span> c <span class="kw">in</span> top]
    faith_scores = judge.<span class="fn">predict_proba</span>(feats)[:, <span class="num">1</span>]
    <span class="kw">return</span> {
        <span class="str">'query'</span>: query,
        <span class="str">'answer'</span>: answer[:<span class="num">120</span>] + <span class="str">'...'</span>,
        <span class="str">'top_chunks'</span>: [c[<span class="num">0</span>] <span class="kw">for</span> c <span class="kw">in</span> top],
        <span class="str">'faithfulness'</span>: <span class="fn">float</span>(np.<span class="fn">mean</span>(faith_scores)),
        <span class="str">'context_relevance'</span>: <span class="fn">float</span>(np.<span class="fn">mean</span>([c[<span class="num">1</span>] <span class="kw">for</span> c <span class="kw">in</span> top])),
    }

<span class="cm"># 8. UÇTAN UCA gerçek sorgularda ÇALIŞTIR</span>
<span class="fn">print</span>(<span class="str">'\\n4-7. RAG PIPELINE RESULTS:'</span>)
<span class="kw">for</span> q <span class="kw">in</span> [<span class="str">'great product quality'</span>, <span class="str">'shipping was slow'</span>, <span class="str">'broken on arrival'</span>]:
    r = <span class="fn">evaluate_query</span>(q)
    <span class="fn">print</span>(f<span class="str">'\\nQ: {r[\"query\"]}'</span>)
    <span class="fn">print</span>(f<span class="str">'  chunks: {r[\"top_chunks\"]}'</span>)
    <span class="fn">print</span>(f<span class="str">'  faithfulness:      {r[\"faithfulness\"]:.3f}'</span>)
    <span class="fn">print</span>(f<span class="str">'  context_relevance: {r[\"context_relevance\"]:.3f}'</span>)
    <span class="fn">print</span>(f<span class="str">'  answer: {r[\"answer\"]}'</span>)</code></pre></div>
</div>

<p class="l-text"><strong>Tarayıcı mini-RAG, adım adım:</strong> 1) <code>chunk(text, size=80, overlap=20)</code> ilk 150 yorumu kaydırır ve düz bir <code>chunks</code> listesi artı <code>review_id</code>, <code>chunk_idx</code> ve sentiment etiketine sahip paralel <code>chunk_meta</code> üretir. 2) <code>TfidfVectorizer(max_features=2000, ngram_range=(1,2))</code> chunk'ları <code>chunk_vecs</code> olarak saklanan tarayıcı-içi embedding yerine geçeni dönüştürür. 3) <code>retrieve(query, k=10)</code> sorguyu embedlir, <code>chunk_vecs</code>'e karşı <code>cosine_similarity</code> koşturur ve top-k'yı <code>(id, score, text)</code> tuple'ları olarak döner. 4) <code>rerank</code> iki sıralama kurar — kosinüs ve sorgu-token örtüşümü — ve bunları birebir RRF formülüyle birleştirir. 5) <code>generate</code> atıflı chunk'ları sentetik bir cevaba diker. 6) <code>(similarity, length, keyword_count)</code> özellikleri üzerinde eğitilmiş bir <code>LogisticRegression</code> küçük bir faithfulness yargıcı olarak çalışır. 7) <code>evaluate_query</code> tam retrieve → rerank → generate → yargıç döngüsünü koşturur ve sorgu başına faithfulness ile context relevance raporlar — RAGAS'ın kullandığı aynı harness, sadece Pyodide'a sığacak şekilde küçültülmüş.</p>


</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Capstone'dan Üretime</h2>

<p class="l-text">Yukarıdaki mini-RAG yapısal olarak üretim pipeline'ıyla aynıdır. Gerçekten göndermek için her bileşeni değiştir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">TF-IDF → BGE/OpenAI</div><div class="card-body"><code>TfidfVectorizer</code>'ı <code>OpenAIEmbeddings</code> veya self-hosted BGE inference sunucusu ile değiştir.</div></div>
<div class="calc-card"><div class="card-title">numpy → Qdrant</div><div class="card-body">Kosinüs matrisini Qdrant koleksiyonu ile değiştir. tenant_id için filtre ekle.</div></div>
<div class="calc-card"><div class="card-title">RRF rerank → Cohere</div><div class="card-body">Birleştirilmiş-rank mantığını <code>cohere.rerank()</code> cross-encoder çağrısı ile değiştir.</div></div>
<div class="calc-card"><div class="card-title">Sahte LLM → Claude</div><div class="card-body"><code>generate()</code>'i Claude/GPT çağrısı ile değiştir. Sistem prompt + atıflar ekle.</div></div>
<div class="calc-card"><div class="card-title">LogReg yargıç → RAGAS</div><div class="card-body">LogReg'i trafiğin örneklenmiş %1'i üzerinde RAGAS LLM-yargıç metrikleriyle değiştir.</div></div>
<div class="calc-card"><div class="card-title">Print → LangSmith + Prom</div><div class="card-body">Print ifadelerini <code>@traceable</code> decoratorları ve Prometheus sayaçlarıyla değiştir.</div></div>
</div>

<div class="calc-highlight" style="margin:1rem 0;padding:0.9rem 1.1rem;background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;border-radius:0 8px 8px 0;font-size:0.92rem">🎓 <strong>Vektör DB track'ini bitirdin.</strong> Artık şunları yapabilirsin: belirli bir iş yükü için indeks tasarla (L1-L4), ANN algoritmalarını ayarla (L5), üretim ölçeğinde işle (L6-L7) ve eval ve izleme ile uçtan uca RAG mimari (L8). Sonraki track önerileri: <strong>LLM Agents</strong> (otonom ReAct döngüleri), <strong>NLP capstone</strong> (tam transformer önizleme), veya <strong>MLOps</strong> (geniş yığın için CI/CD + izleme).</div>
</div>`
};
