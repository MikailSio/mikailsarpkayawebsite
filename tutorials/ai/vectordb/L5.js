window.VECTORDB_L5 = {
en: `<p class="l-text"><strong>Pure dense vector search has a recall ceiling that nobody likes to talk about.</strong> On benchmarks like BEIR, the gap between "best dense embedder" and "BM25 + dense + rerank" is consistently 10-30% in nDCG@10. That gap is your free lunch: you can keep the same embedder, the same DB, the same docs — and just by adding a rerank stage, your RAG suddenly stops hallucinating about questions BM25 would have nailed.</p>

<p class="l-text">This lesson is the retrieval upgrade path. We'll start with pure BM25 to remember why keywords still matter, layer dense vectors on top, fuse them with Reciprocal Rank Fusion, then add a cross-encoder reranker (BGE, Cohere, Jina) to re-score the top-50. Finally we'll cover ColBERT late-interaction for when even reranking isn't enough, plus query rewriting and multi-query retrieval. By the end you'll know which technique is worth its latency budget for your use case.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Why BM25 still beats dense on exact-match and rare-token queries (and when it doesn't)</li>
<li>Reciprocal Rank Fusion: the one-line formula that combines any two retrievers</li>
<li>Cross-encoder vs bi-encoder: why rerankers are slow but powerful (50-200ms for +10-30% recall)</li>
<li>BGE-reranker-v2-m3, Cohere Rerank v3, Jina Reranker v2 — what to actually use in 2026</li>
<li>ColBERT late interaction: token-level matching, 100× storage cost, when it's worth it</li>
<li>Query rewriting and multi-query retrieval (HyDE, RAG-Fusion) for ambiguous queries</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Dense Alone Isn't Enough</h2>

<p class="l-text">Dense embeddings (OpenAI's <code>text-embedding-3-large</code>, BGE-M3, etc.) compress meaning into 768-3072 dim vectors. That compression is exactly the problem: when a user searches for "ERR_CONNECTION_REFUSED on port 5432", a dense model maps that to "database connectivity issues" — useful, but if your docs literally contain the string <code>ERR_CONNECTION_REFUSED</code>, BM25 will rank the right page #1 while the dense embedder may bury it at #7.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dense Wins</div><div class="card-body">Semantic queries ("how do I make my model train faster?"), paraphrasing, cross-lingual. Generalizes well to unseen vocabulary.</div></div>
<div class="calc-card"><div class="card-title">BM25 Wins</div><div class="card-body">Rare tokens (error codes, product SKUs, proper nouns), exact-match queries, technical jargon, regulatory text. No training, no embedding cost, often interpretable.</div></div>
<div class="calc-card"><div class="card-title">Hybrid Wins</div><div class="card-body">Real queries are mixed: "fix CUDA out of memory in PyTorch DataLoader". Hybrid + rerank wins on BEIR by 10-30% nDCG@10 over either alone.</div></div>
</div>

<div class="calc-highlight">📊 BEIR benchmark (avg over 13 datasets, 2024-2025 numbers): pure BM25 ~0.42 nDCG@10 · best dense (BGE-M3) ~0.51 · BM25+dense fusion ~0.55 · +rerank (BGE-reranker-v2) ~0.61. Hybrid + rerank is +45% over pure BM25 and +20% over pure dense.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. BM25 in 30 Lines</h2>

<p class="l-text">BM25 is TF-IDF's smarter sibling: it caps term frequency saturation and normalizes by document length. The formula looks scary but the intuition is simple — common terms count less, rare terms count more, long docs are penalized so they don't win by accident.</p>

<div class="katex-block">$$\\text{BM25}(q, d) = \\sum_{t \\in q} \\text{IDF}(t) \\cdot \\frac{f(t,d) \\cdot (k_1 + 1)}{f(t,d) + k_1 \\cdot (1 - b + b \\cdot \\frac{|d|}{\\text{avgdl}})}$$</div>

<p class="l-text">Where <code>k_1 ≈ 1.5</code> controls term frequency saturation and <code>b ≈ 0.75</code> controls length normalization. In practice, <code>sklearn</code>'s <code>TfidfVectorizer</code> with <code>sublinear_tf=True</code> and L2 normalization is a 90% approximation of BM25 — good enough for most production RAG.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">import</span> numpy <span class="kw">as</span> np

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">40</span>))
queries  = [<span class="str">"this product broke after one week"</span>, <span class="str">"amazing quality fast delivery"</span>]

<span class="cm"># BM25-ish via TF-IDF with sublinear tf + L2 norm</span>
bm25 = <span class="fn">TfidfVectorizer</span>(sublinear_tf=<span class="kw">True</span>, norm=<span class="str">"l2"</span>, stop_words=<span class="str">"english"</span>, max_features=<span class="num">2000</span>)
X_bm = bm25.<span class="fn">fit_transform</span>(texts_in)        <span class="cm"># sparse (n_docs, vocab)</span>
Q_bm = bm25.<span class="fn">transform</span>(queries)             <span class="cm"># sparse (n_queries, vocab)</span>
scores = (Q_bm @ X_bm.T).<span class="fn">toarray</span>()         <span class="cm"># (n_queries, n_docs)</span>

<span class="kw">for</span> qi, q <span class="kw">in</span> <span class="fn">enumerate</span>(queries):
    top = np.<span class="fn">argsort</span>(-scores[qi])[:<span class="num">3</span>]
    <span class="fn">print</span>(f<span class="str">"\\nquery: {q}"</span>)
    <span class="kw">for</span> di <span class="kw">in</span> top:
        <span class="fn">print</span>(f<span class="str">"  [{scores[qi, di]:.3f}] {texts_in[di][:80]}"</span>)
</code></pre></div>

<p class="l-text">Notice how BM25 nails queries with rare tokens like "broke" or "delivery" — these words are sparse in the corpus, so IDF amplifies them. A dense embedder might generalize "broke" to "damaged, defective, malfunctioning" and rank a different doc first.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Reciprocal Rank Fusion — The One-Line Magic</h2>

<p class="l-text">You have BM25 ranks and dense ranks. How do you combine them? You could weight scores (<code>0.5*bm25 + 0.5*dense</code>) but the score scales are wildly different and tuning the weights is brittle. Reciprocal Rank Fusion (RRF) skips scores entirely and uses ranks. It's stupidly simple and stupidly effective.</p>

<div class="katex-block">$$\\text{RRF}(d) = \\sum_{i \\in \\text{retrievers}} \\frac{1}{k + \\text{rank}_i(d)}$$</div>

<p class="l-text">Where <code>k ≈ 60</code> is a smoothing constant (Cormack et al. 2009 found 60 robust across many setups). A document at rank 1 in BM25 and rank 1 in dense gets <code>1/61 + 1/61 ≈ 0.033</code>. A document at rank 1 in BM25 only gets <code>1/61 + 0 ≈ 0.016</code>. Doubly-ranked docs always win — exactly the behavior you want.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">40</span>))
query    = <span class="str">"this item arrived damaged"</span>

<span class="cm"># Retriever 1: BM25-ish (sparse)</span>
bm = <span class="fn">TfidfVectorizer</span>(sublinear_tf=<span class="kw">True</span>, norm=<span class="str">"l2"</span>, stop_words=<span class="str">"english"</span>)
Xb, qb = bm.<span class="fn">fit_transform</span>(texts_in), bm.<span class="fn">transform</span>([query])
bm_scores = (qb @ Xb.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
bm_rank = {i: r <span class="kw">for</span> r, i <span class="kw">in</span> <span class="fn">enumerate</span>(np.<span class="fn">argsort</span>(-bm_scores), start=<span class="num">1</span>)}

<span class="cm"># Retriever 2: "dense" (we fake dense with char-ngram TF-IDF for browser)</span>
dense = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">"char_wb"</span>, ngram_range=(<span class="num">3</span>,<span class="num">5</span>), norm=<span class="str">"l2"</span>, max_features=<span class="num">2000</span>)
Xd, qd = dense.<span class="fn">fit_transform</span>(texts_in), dense.<span class="fn">transform</span>([query])
dn_scores = (qd @ Xd.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
dn_rank = {i: r <span class="kw">for</span> r, i <span class="kw">in</span> <span class="fn">enumerate</span>(np.<span class="fn">argsort</span>(-dn_scores), start=<span class="num">1</span>)}

<span class="cm"># RRF fusion</span>
k = <span class="num">60</span>
fused = {i: <span class="num">1</span>/(k + bm_rank[i]) + <span class="num">1</span>/(k + dn_rank[i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(texts_in))}
top = <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">5</span>]

<span class="fn">print</span>(f<span class="str">"query: {query}\\n"</span>)
<span class="kw">for</span> di, score <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  RRF={score:.4f}  bm_rank={bm_rank[di]:>2}  dn_rank={dn_rank[di]:>2}  | {texts_in[di][:70]}"</span>)
</code></pre></div>

<p class="l-text"><strong>BM25 + dense + RRF, step by step:</strong> 1) Retriever 1 is a sublinear-TF + L2 TF-IDF that approximates BM25; <code>bm_rank</code> maps each doc id to its 1-indexed BM25 rank. 2) Retriever 2 is a char-ngram TF-IDF (3-5) as a browser-friendly stand-in for a dense embedder; <code>dn_rank</code> stores its rank list. 3) The fusion line <code>1/(k + bm_rank[i]) + 1/(k + dn_rank[i])</code> with <code>k=60</code> is the literal RRF formula. 4) Sorting by the fused score and printing the top-5 reveals docs that appear high in both lists — exactly the docs hybrid retrieval is meant to surface.</p>


<div class="calc-highlight">⚡ RRF is the default fusion algorithm in Elasticsearch, OpenSearch, Weaviate, and Qdrant. It needs zero training and no per-corpus tuning. <code>k=60</code> is the established default; the exact value barely matters. If you're not using RRF for fusion, you're probably overengineering.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Cross-Encoder vs Bi-Encoder</h2>

<p class="l-text">Your dense embedder (BGE, OpenAI, etc.) is a <strong>bi-encoder</strong>: it encodes the query and the doc independently, then compares with cosine. Fast — you precompute all doc embeddings once. Lossy — the model never sees query and doc together.</p>

<p class="l-text">A <strong>cross-encoder</strong> shoves <code>[CLS] query [SEP] doc [SEP]</code> through a transformer and outputs a single relevance score. The model attends across query and doc tokens jointly, which is much more accurate — but you have to run the model on EVERY (query, doc) pair at query time. That's why we only rerank the top-50 from the first stage, never the whole corpus.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bi-Encoder (e.g. BGE-large-en)</div><div class="card-body">Encode query and doc separately. Cosine compare. Latency: ~10ms for query encode + 1ms cosine over millions. Recall@10 on BEIR: ~0.50.</div></div>
<div class="calc-card"><div class="card-title">Cross-Encoder (e.g. BGE-reranker-v2-m3)</div><div class="card-body">Encode (query, doc) jointly. Single relevance score. Latency: 1-5ms PER PAIR on GPU, 20-50ms on CPU. Recall@10 reranking top-50: ~0.62.</div></div>
<div class="calc-card"><div class="card-title">Practical Pipeline</div><div class="card-body">Bi-encoder retrieves top-50 from millions in 20ms. Cross-encoder reranks those 50 in 50-200ms. Total: ~100-250ms. Net: +10-30% recall vs bi-encoder alone.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Reranker Landscape — What to Use in 2026</h2>

<p class="l-text">Three families of rerankers dominate 2026. Pick based on your latency budget, language coverage, and whether you can self-host.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BGE-reranker-v2-m3 (BAAI)</div><div class="card-body">Open-source, multilingual (100+ languages), 568M params. Self-host on a T4 GPU: ~80ms for 50 docs. Best free option for non-English RAG. Beijing Academy of AI.</div></div>
<div class="calc-card"><div class="card-title">Cohere Rerank v3</div><div class="card-body">Hosted API, multilingual, no self-host needed. ~$2 per 1000 search units. Latency 100-300ms. Often top of public benchmarks. Pay per call, no infra.</div></div>
<div class="calc-card"><div class="card-title">Jina Reranker v2</div><div class="card-body">Open + hosted. 278M params, faster than BGE for similar quality. Strong on code and English. Self-hostable on smaller GPUs.</div></div>
<div class="calc-card"><div class="card-title">MixedBread mxbai-rerank-large-v1</div><div class="card-body">Apache 2.0, competitive with Cohere on English. 435M params. Good "drop-in replacement" if you can't ship a hosted dependency.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Cohere Rerank — hosted API</span>
<span class="kw">import</span> cohere
co = cohere.<span class="fn">Client</span>(<span class="str">"YOUR_KEY"</span>)

docs = [d[<span class="str">"text"</span>] <span class="kw">for</span> d <span class="kw">in</span> first_stage_results[:<span class="num">50</span>]]  <span class="cm"># top-50 from BM25+dense</span>
res = co.<span class="fn">rerank</span>(
    model=<span class="str">"rerank-english-v3.0"</span>,
    query=<span class="str">"how do I fix CUDA out of memory in PyTorch?"</span>,
    documents=docs,
    top_n=<span class="num">10</span>,
)
<span class="kw">for</span> r <span class="kw">in</span> res.results:
    <span class="fn">print</span>(r.relevance_score, docs[r.index][:<span class="num">80</span>])

<span class="cm"># BGE-reranker-v2-m3 — self-hosted (sentence-transformers)</span>
<span class="kw">from</span> sentence_transformers <span class="kw">import</span> CrossEncoder
reranker = <span class="fn">CrossEncoder</span>(<span class="str">"BAAI/bge-reranker-v2-m3"</span>, max_length=<span class="num">512</span>)

pairs = [[<span class="str">"how do I fix CUDA OOM?"</span>, d] <span class="kw">for</span> d <span class="kw">in</span> docs]
scores = reranker.<span class="fn">predict</span>(pairs, batch_size=<span class="num">32</span>)
ranked = <span class="fn">sorted</span>(<span class="fn">zip</span>(scores, docs), reverse=<span class="kw">True</span>)[:<span class="num">10</span>]
<span class="kw">for</span> s, d <span class="kw">in</span> ranked: <span class="fn">print</span>(<span class="fn">round</span>(<span class="fn">float</span>(s), <span class="num">3</span>), d[:<span class="num">80</span>])
</code></pre></div>

<p class="l-text"><strong>Cohere + BGE rerank pipelines:</strong> 1) <code>cohere.Client(...)</code> opens the hosted API; <code>co.rerank(model="rerank-english-v3.0", query, documents=docs, top_n=10)</code> sends the first-stage top-50 to the hosted cross-encoder and returns a sorted list with <code>relevance_score</code> per item. 2) For the self-hosted path, <code>CrossEncoder("BAAI/bge-reranker-v2-m3", max_length=512)</code> loads the 568M-param reranker locally. 3) <code>pairs = [[query, d] for d in docs]</code> packages every candidate with the query — exactly the joint <code>[CLS] q [SEP] d [SEP]</code> input the cross-encoder expects. 4) <code>reranker.predict(pairs, batch_size=32)</code> scores the batch on GPU/CPU and we sort to keep the top-10.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">We can't run a real BERT cross-encoder in the browser, but we can demonstrate the cross-encoder PRINCIPLE: train a logistic regression on (query+doc, relevance) feature pairs. Same shape, just shallower model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Build training pairs: (query+doc) text → relevance label (0/1)</span>
texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">60</span>))
labels   = <span class="fn">list</span>(df_reviews[<span class="str">"sentiment"</span>].<span class="fn">head</span>(<span class="num">60</span>))

<span class="cm"># Pretend "positive review" = "relevant to query 'good product'"</span>
query = <span class="str">"good product I love it"</span>
pair_texts = [query + <span class="str">" [SEP] "</span> + t <span class="kw">for</span> t <span class="kw">in</span> texts_in]
y = np.<span class="fn">array</span>([<span class="num">1</span> <span class="kw">if</span> l == <span class="str">"positive"</span> <span class="kw">else</span> <span class="num">0</span> <span class="kw">for</span> l <span class="kw">in</span> labels])

vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">1500</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>))
X = vec.<span class="fn">fit_transform</span>(pair_texts)

<span class="cm"># Cross-encoder = model that sees (query, doc) jointly</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">300</span>).<span class="fn">fit</span>(X, y)
relevance = clf.<span class="fn">predict_proba</span>(X)[:, <span class="num">1</span>]

<span class="cm"># Rerank top-10</span>
top = np.<span class="fn">argsort</span>(-relevance)[:<span class="num">5</span>]
<span class="fn">print</span>(f<span class="str">"query: {query}\\n"</span>)
<span class="kw">for</span> i <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  rel={relevance[i]:.3f}  label={labels[i]:>8}  | {texts_in[i][:70]}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Shallow cross-encoder demo, step by step:</strong> 1) Build joint texts <code>query + " [SEP] " + doc</code> — same input shape as a real cross-encoder; positive sentiment counts as "relevant" so we get a 0/1 label. 2) <code>TfidfVectorizer(ngram_range=(1,2))</code> turns those joint strings into features that capture overlap and bigrams. 3) <code>LogisticRegression().fit(X, y)</code> learns weights jointly over query and doc tokens — that joint view is the key cross-encoder property. 4) <code>predict_proba(X)[:,1]</code> outputs a relevance probability per doc; sorting descending yields the reranked top-5 with labels printed so you can verify positives dominate.</p>


</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ColBERT — Late Interaction</h2>

<p class="l-text">ColBERT (Contextualized Late Interaction over BERT) sits between bi-encoder and cross-encoder. Instead of pooling tokens into one vector per doc, it stores ONE VECTOR PER TOKEN (typically 128 dim). At query time, it does max-sim: for each query token, find the best matching doc token, then sum.</p>

<div class="katex-block">$$\\text{ColBERT}(q, d) = \\sum_{i \\in q} \\max_{j \\in d} \\langle E_q^i, E_d^j \\rangle$$</div>

<p class="l-text">Each term in the sum lets one query token "find its best home" anywhere in the doc — capturing fine-grained matching that mean-pooled embeddings lose. Recall is close to cross-encoder (within a few points on BEIR), but you can precompute all doc tokens and search with a vector index.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Storage Cost</div><div class="card-body">A 200-token document becomes 200 vectors of 128 dim. Total bytes: ~100 KB per doc vs ~3 KB for a single 768-dim vector. <strong>~30-100× more storage.</strong></div></div>
<div class="calc-card"><div class="card-title">Latency</div><div class="card-body">Query encoding: ~20ms. Token-level max-sim: 50-100ms over a million docs with the right index (PLAID). Slower than bi-encoder, faster than cross-encoder.</div></div>
<div class="calc-card"><div class="card-title">Quality</div><div class="card-body">Within 1-3 nDCG points of a strong cross-encoder on BEIR. Particularly strong on long documents where pooling loses information.</div></div>
<div class="calc-card"><div class="card-title">When to Use</div><div class="card-body">Long-document retrieval (legal, medical, code), or when you can afford the storage and need consistently better recall than bi-encoder without the per-query latency of full reranking.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toy ColBERT: each "token" is a TF-IDF row vector. We compute max-sim between query tokens and doc tokens to mimic late interaction.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">import</span> numpy <span class="kw">as</span> np, re

<span class="kw">def</span> <span class="fn">tokens</span>(s): <span class="kw">return</span> re.<span class="fn">findall</span>(r<span class="str">"[a-z]+"</span>, s.<span class="fn">lower</span>())

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">20</span>))
query    = <span class="str">"amazing quality fast shipping"</span>

<span class="cm"># Build a shared vocab over query + all docs at the TOKEN level</span>
all_tokens = <span class="fn">set</span>(<span class="fn">tokens</span>(query))
<span class="kw">for</span> t <span class="kw">in</span> texts_in: all_tokens |= <span class="fn">set</span>(<span class="fn">tokens</span>(t))
vec = <span class="fn">TfidfVectorizer</span>(vocabulary=<span class="fn">sorted</span>(all_tokens), norm=<span class="str">"l2"</span>)
vec.<span class="fn">fit</span>([query] + texts_in)

<span class="kw">def</span> <span class="fn">emb_per_token</span>(text):
    toks = <span class="fn">tokens</span>(text)
    <span class="kw">if</span> <span class="kw">not</span> toks: <span class="kw">return</span> np.<span class="fn">zeros</span>((<span class="num">1</span>, <span class="fn">len</span>(vec.vocabulary_)), dtype=np.float32)
    <span class="kw">return</span> vec.<span class="fn">transform</span>(toks).<span class="fn">toarray</span>().<span class="fn">astype</span>(np.float32)  <span class="cm"># (n_tokens, vocab)</span>

q_emb = <span class="fn">emb_per_token</span>(query)         <span class="cm"># (Lq, V)</span>
scores = []
<span class="kw">for</span> d <span class="kw">in</span> texts_in:
    d_emb = <span class="fn">emb_per_token</span>(d)         <span class="cm"># (Ld, V)</span>
    sim = q_emb @ d_emb.T            <span class="cm"># (Lq, Ld)</span>
    colbert_score = <span class="fn">float</span>(sim.<span class="fn">max</span>(axis=<span class="num">1</span>).<span class="fn">sum</span>())  <span class="cm"># max-sim then sum over query tokens</span>
    scores.<span class="fn">append</span>(colbert_score)

<span class="kw">for</span> di <span class="kw">in</span> np.<span class="fn">argsort</span>(-np.<span class="fn">array</span>(scores))[:<span class="num">5</span>]:
    <span class="fn">print</span>(f<span class="str">"  ColBERT={scores[di]:.3f}  | {texts_in[di][:70]}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Toy ColBERT max-sim, step by step:</strong> 1) <code>tokens(s)</code> regex-splits a string into lowercase word tokens. 2) We collect every token across query + corpus into a shared vocabulary so each token gets a consistent TF-IDF row vector. 3) <code>emb_per_token(text)</code> returns one vector per token — the late-interaction representation that replaces a single pooled vector. 4) For each doc the similarity matrix <code>sim = q_emb @ d_emb.T</code> is <code>(Lq, Ld)</code>; <code>sim.max(axis=1).sum()</code> picks each query token's best doc-token match and sums them — exactly the ColBERT scoring rule. 5) Top-5 docs by this max-sum score get printed.</p>


</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Query Rewriting &amp; Multi-Query</h2>

<p class="l-text">Sometimes the query is the bottleneck, not the retriever. "Why is my code slow?" matches nothing useful. Query rewriting uses an LLM to expand or rephrase the query before retrieval. Multi-query generates several rewrites, retrieves for each, then RRF-fuses. HyDE (Hypothetical Document Embedding) goes further: ask the LLM to write a fake answer, then retrieve docs similar to that fake answer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naive Query</div><div class="card-body">"Why is my code slow?" — too vague, retrieves random performance pages.</div></div>
<div class="calc-card"><div class="card-title">Query Rewrite (LLM)</div><div class="card-body">"What are common causes of slow Python code, including GIL contention, inefficient loops, and I/O blocking?" — much better recall.</div></div>
<div class="calc-card"><div class="card-title">Multi-Query + RRF</div><div class="card-body">Generate 3-5 rewrites, retrieve top-20 each, RRF fuse. Typical gain: +5-15% recall over single rewrite.</div></div>
<div class="calc-card"><div class="card-title">HyDE</div><div class="card-body">LLM writes a fake answer; embed that; search. Strong when queries are short and abstract. Adds 1 LLM call (~500ms latency).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Multi-query + RRF (sketch using OpenAI as the rewrite LLM)</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
client = <span class="fn">OpenAI</span>()

<span class="kw">def</span> <span class="fn">generate_queries</span>(q, n=<span class="num">4</span>):
    prompt = f<span class="str">"Generate {n} diverse rewrites of this search query, one per line:\\n{q}"</span>
    resp = client.chat.completions.<span class="fn">create</span>(
        model=<span class="str">"gpt-4o-mini"</span>,
        messages=[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:prompt}],
    )
    <span class="kw">return</span> [line.<span class="fn">strip</span>() <span class="kw">for</span> line <span class="kw">in</span> resp.choices[<span class="num">0</span>].message.content.<span class="fn">split</span>(<span class="str">"\\n"</span>) <span class="kw">if</span> line.<span class="fn">strip</span>()]

<span class="kw">def</span> <span class="fn">rrf_fuse</span>(rank_lists, k=<span class="num">60</span>):
    fused = {}
    <span class="kw">for</span> ranks <span class="kw">in</span> rank_lists:
        <span class="kw">for</span> r, doc_id <span class="kw">in</span> <span class="fn">enumerate</span>(ranks, start=<span class="num">1</span>):
            fused[doc_id] = fused.<span class="fn">get</span>(doc_id, <span class="num">0</span>) + <span class="num">1</span> / (k + r)
    <span class="kw">return</span> <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])

queries = <span class="fn">generate_queries</span>(<span class="str">"why is my model overfitting?"</span>)
all_ranks = [<span class="fn">retrieve</span>(q, top_k=<span class="num">20</span>) <span class="kw">for</span> q <span class="kw">in</span> queries]   <span class="cm"># your retriever</span>
final = <span class="fn">rrf_fuse</span>(all_ranks)[:<span class="num">10</span>]
</code></pre></div>

<p class="l-text"><strong>Multi-query rewrite pipeline:</strong> 1) <code>generate_queries(q, n=4)</code> calls <code>gpt-4o-mini</code> with a one-line prompt that asks for four diverse rewrites of the original query and splits the response on newlines. 2) Each rewrite is then fed to your own <code>retrieve(q, top_k=20)</code> retriever, yielding four ordered rank lists. 3) <code>rrf_fuse(rank_lists, k=60)</code> walks every list, adds <code>1/(k + rank)</code> per appearance into a single <code>fused</code> dict, then sorts descending. 4) The final top-10 favours docs that appear high in multiple rewrites — a robust hedge against any single query phrasing being weak.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">No LLM in browser — we hand-craft 3 query rewrites and demonstrate RRF fusion across 3 retrievals on the reviews dataset. The fusion logic is identical to the real pipeline.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">import</span> numpy <span class="kw">as</span> np

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">50</span>))
<span class="cm"># Hand-crafted "LLM rewrites" of an abstract query</span>
queries = [
    <span class="str">"this product is poor quality"</span>,
    <span class="str">"broken item arrived defective"</span>,
    <span class="str">"disappointing purchase waste money"</span>,
]

vec = <span class="fn">TfidfVectorizer</span>(sublinear_tf=<span class="kw">True</span>, norm=<span class="str">"l2"</span>, stop_words=<span class="str">"english"</span>)
X = vec.<span class="fn">fit_transform</span>(texts_in)

<span class="cm"># Retrieve top-15 for each rewrite</span>
rank_lists = []
<span class="kw">for</span> q <span class="kw">in</span> queries:
    qv = vec.<span class="fn">transform</span>([q])
    scores = (qv @ X.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
    rank_lists.<span class="fn">append</span>(np.<span class="fn">argsort</span>(-scores)[:<span class="num">15</span>].<span class="fn">tolist</span>())

<span class="cm"># RRF fuse</span>
k = <span class="num">60</span>
fused = {}
<span class="kw">for</span> ranks <span class="kw">in</span> rank_lists:
    <span class="kw">for</span> r, doc_id <span class="kw">in</span> <span class="fn">enumerate</span>(ranks, start=<span class="num">1</span>):
        fused[doc_id] = fused.<span class="fn">get</span>(doc_id, <span class="num">0</span>) + <span class="num">1</span> / (k + r)

top = <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"multi-query + RRF top-5:"</span>)
<span class="kw">for</span> di, score <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  RRF={score:.4f} | {texts_in[di][:70]}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Hand-crafted multi-query, step by step:</strong> 1) Three "LLM-style" rewrites of the abstract complaint query stand in for what <code>gpt-4o-mini</code> would produce. 2) A shared sublinear-TF + L2 TF-IDF index is fit once on the 50-review corpus. 3) The loop runs each rewrite through <code>vec.transform</code> + cosine and keeps the top-15 doc ids — that's one rank list per rewrite. 4) The inline RRF fuser adds <code>1/(60 + rank)</code> across the three lists into <code>fused</code>; sorting descending gives the final top-5. Docs that appear in all three rewrite lists float to the top regardless of any one query's exact wording.</p>


</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Latency Budget</h2>

<p class="l-text">Every layer adds milliseconds. Whether it's worth it depends on your product. A chatbot can afford 500ms total retrieval; a search-as-you-type box cannot. Here's a realistic budget.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bi-Encoder Only</div><div class="card-body">~30-50ms total (query encode + ANN search). Recall@10: 100% baseline. Use for: search-as-you-type, low-latency UX.</div></div>
<div class="calc-card"><div class="card-title">+ BM25 Hybrid + RRF</div><div class="card-body">+10-30ms (parallel BM25 search + fuse). Recall@10: +8-15%. Use for: any production RAG. Almost always worth it.</div></div>
<div class="calc-card"><div class="card-title">+ Cross-Encoder Rerank (top-50)</div><div class="card-body">+50-200ms (CPU) or +20-50ms (GPU). Recall@10: +10-30% over bi-encoder. Use for: chat, agentic RAG, anywhere &gt;200ms is acceptable.</div></div>
<div class="calc-card"><div class="card-title">+ Multi-Query (4 rewrites)</div><div class="card-body">+500-1500ms (LLM call dominates). Recall@10: +5-15%. Use for: hard queries (research, exploration), where LLM call is already happening.</div></div>
<div class="calc-card"><div class="card-title">ColBERT (replaces bi-encoder)</div><div class="card-body">~80-150ms search latency. Storage: 30-100× bi-encoder. Recall: close to cross-encoder rerank. Use for: long-doc heavy domains.</div></div>
</div>

<div class="calc-highlight">🎯 Default production stack in 2026: BM25 + dense → RRF → BGE-reranker-v2-m3 (or Cohere Rerank v3) on top-50. ~250ms p99, +20-30% recall over dense alone. Add multi-query only when the user query is short and abstract.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Lab — Full Pipeline Comparison</h2>

<p class="l-text">Let's wire it all together on the reviews dataset and measure how each layer changes the top-5. We'll compare four configs: dense-only, BM25+dense+RRF, hybrid+rerank, and a multi-query variant.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">60</span>))
labels   = <span class="fn">list</span>(df_reviews[<span class="str">"sentiment"</span>].<span class="fn">head</span>(<span class="num">60</span>))
query    = <span class="str">"great product highly recommend"</span>

<span class="cm"># === Stage 1a: dense (char-ngram as stand-in for embedder) ===</span>
dense = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">"char_wb"</span>, ngram_range=(<span class="num">3</span>,<span class="num">5</span>), norm=<span class="str">"l2"</span>, max_features=<span class="num">2000</span>)
Xd = dense.<span class="fn">fit_transform</span>(texts_in)
qd = dense.<span class="fn">transform</span>([query])
dn_scores = (qd @ Xd.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
dn_rank = {i: r <span class="kw">for</span> r, i <span class="kw">in</span> <span class="fn">enumerate</span>(np.<span class="fn">argsort</span>(-dn_scores), start=<span class="num">1</span>)}

<span class="cm"># === Stage 1b: BM25 (word TF-IDF) ===</span>
bm = <span class="fn">TfidfVectorizer</span>(sublinear_tf=<span class="kw">True</span>, norm=<span class="str">"l2"</span>, stop_words=<span class="str">"english"</span>)
Xb = bm.<span class="fn">fit_transform</span>(texts_in)
qb = bm.<span class="fn">transform</span>([query])
bm_scores = (qb @ Xb.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
bm_rank = {i: r <span class="kw">for</span> r, i <span class="kw">in</span> <span class="fn">enumerate</span>(np.<span class="fn">argsort</span>(-bm_scores), start=<span class="num">1</span>)}

<span class="cm"># === Stage 2: RRF fuse top-30 ===</span>
k = <span class="num">60</span>
fused = {i: <span class="num">1</span>/(k + bm_rank[i]) + <span class="num">1</span>/(k + dn_rank[i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(texts_in))}
hybrid_top30 = [i <span class="kw">for</span> i, _ <span class="kw">in</span> <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">30</span>]]

<span class="cm"># === Stage 3: cross-encoder rerank (logreg trained on positive=relevant) ===</span>
y = np.<span class="fn">array</span>([<span class="num">1</span> <span class="kw">if</span> l == <span class="str">"positive"</span> <span class="kw">else</span> <span class="num">0</span> <span class="kw">for</span> l <span class="kw">in</span> labels])
pair_vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">1500</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>))
X_pair_train = pair_vec.<span class="fn">fit_transform</span>([query + <span class="str">" [SEP] "</span> + t <span class="kw">for</span> t <span class="kw">in</span> texts_in])
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">300</span>).<span class="fn">fit</span>(X_pair_train, y)

X_pair_rerank = pair_vec.<span class="fn">transform</span>([query + <span class="str">" [SEP] "</span> + texts_in[i] <span class="kw">for</span> i <span class="kw">in</span> hybrid_top30])
rel = clf.<span class="fn">predict_proba</span>(X_pair_rerank)[:, <span class="num">1</span>]
reranked = [hybrid_top30[i] <span class="kw">for</span> i <span class="kw">in</span> np.<span class="fn">argsort</span>(-rel)][:<span class="num">5</span>]

<span class="fn">print</span>(f<span class="str">"query: {query}\\n"</span>)
<span class="fn">print</span>(<span class="str">"--- dense only top-5 ---"</span>)
<span class="kw">for</span> i <span class="kw">in</span> np.<span class="fn">argsort</span>(-dn_scores)[:<span class="num">5</span>]: <span class="fn">print</span>(f<span class="str">"  {labels[i]:>8} | {texts_in[i][:65]}"</span>)
<span class="fn">print</span>(<span class="str">"\\n--- hybrid (BM25+dense+RRF) top-5 ---"</span>)
<span class="kw">for</span> i <span class="kw">in</span> [x <span class="kw">for</span> x,_ <span class="kw">in</span> <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> y: -y[<span class="num">1</span>])[:<span class="num">5</span>]]:
    <span class="fn">print</span>(f<span class="str">"  {labels[i]:>8} | {texts_in[i][:65]}"</span>)
<span class="fn">print</span>(<span class="str">"\\n--- hybrid + rerank top-5 ---"</span>)
<span class="kw">for</span> i <span class="kw">in</span> reranked: <span class="fn">print</span>(f<span class="str">"  {labels[i]:>8} | {texts_in[i][:65]}"</span>)
</code></pre></div>

<p class="l-text">Run this and watch the proportion of "positive" labels in the top-5 climb from dense-only → hybrid → hybrid+rerank. That's the recall lift you're paying for in latency. On real data with a real cross-encoder, the lift is typically 10-30% nDCG@10 — your free lunch.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Recap &amp; What Comes Next</h2>

<p class="l-text">You now have the full retrieval upgrade ladder. Pure dense is the floor; <strong>BM25 + dense + RRF</strong> is the obvious next step (cheap, +10% recall); <strong>cross-encoder rerank</strong> is the next big jump (+10-30% but +50-200ms); <strong>ColBERT</strong> is the alternative for long docs; <strong>multi-query and HyDE</strong> rescue ambiguous queries when LLM calls are already in your loop.</p>

<p class="l-text">Default pick for 2026 production RAG: BM25 + dense → RRF → BGE-reranker-v2-m3 on top-50. That's ~250ms total and a +20-30% nDCG@10 lift over a naive dense baseline. The next lesson tackles <strong>chunking strategies</strong> — because the best retriever in the world can't help if your 8000-token contract is sliced into 50-token shreds at sentence boundaries.</p>

<div class="calc-highlight">📚 Reading list: Cormack et al. 2009 (RRF original) · Khattab &amp; Zaharia 2020 (ColBERT) · Gao et al. 2022 (HyDE) · BAAI BGE-M3 paper 2024 · Cohere Rerank docs · BEIR benchmark Thakur et al. 2021. All freely available; the BEIR paper alone is worth a careful weekend read.</div>
</div>`,
tr: `<p class="l-text"><strong>Saf yoğun vektör aramasının kimsenin konuşmaktan hoşlanmadığı bir recall tavanı vardır.</strong> BEIR gibi benchmark'larda, "en iyi yoğun gömme model" ile "BM25 + dense + rerank" arasındaki fark nDCG@10'da tutarlı bir şekilde %10-30'dur. O fark senin bedava öğle yemeğin: aynı embedder'ı, aynı DB'yi, aynı dokümanları tutabilirsin — ve sadece bir rerank aşaması ekleyerek RAG'ın aniden BM25'in çözeceği soruları halüsine etmeyi bırakır.</p>

<p class="l-text">Bu ders erişim yükseltme yoludur. Anahtar kelimelerin neden hâlâ önemli olduğunu hatırlamak için saf BM25 ile başlayacağız, üzerine yoğun vektörler ekleyeceğiz, Reciprocal Rank Fusion ile birleştireceğiz, sonra top-50'yi yeniden puanlamak için bir cross-encoder yeniden sıralayıcı (BGE, Cohere, Jina) ekleyeceğiz. Son olarak yeniden sıralamanın bile yetmediği zamanlar için ColBERT geç etkileşimini, ayrıca sorgu yeniden yazma ve çoklu sorgu erişimini ele alacağız. Sonunda kullanım durumun için hangi tekniğin gecikme bütçesine değer olduğunu bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BM25 neden hâlâ tam-eşleşme ve nadir-token sorgularında dense'i yener (ve ne zaman yenmez)</li>
<li>Reciprocal Rank Fusion: herhangi iki getiriciyi birleştiren tek satırlık formül</li>
<li>Cross-encoder vs bi-encoder: yeniden sıralayıcılar neden yavaş ama güçlü (+%10-30 recall için 50-200ms)</li>
<li>BGE-reranker-v2-m3, Cohere Rerank v3, Jina Reranker v2 — 2026'da gerçekten ne kullanmalı</li>
<li>ColBERT geç etkileşim: token-seviyesi eşleşme, 100x depolama maliyeti, ne zaman değer</li>
<li>Belirsiz sorgular için sorgu yeniden yazma ve çoklu-sorgu erişim (HyDE, RAG-Fusion)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Tek Başına Dense Neden Yeterli Değil</h2>

<p class="l-text">Yoğun embedding'ler (OpenAI'nin <code>text-embedding-3-large</code>'i, BGE-M3, vb.) anlamı 768-3072 boyutlu vektörlere sıkıştırır. O sıkıştırma tam olarak problem: bir kullanıcı "5432 portunda ERR_CONNECTION_REFUSED" aradığında, yoğun bir model bunu "veritabanı bağlantı sorunları"na eşler — kullanışlı, ama dokümanların gerçekten <code>ERR_CONNECTION_REFUSED</code> dizesini içeriyorsa, BM25 doğru sayfayı 1. sıraya koyarken yoğun gömme onu 7. sıraya gömebilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dense Kazanır</div><div class="card-body">Anlamsal sorgular ("modelimi nasıl daha hızlı eğitirim?"), ifade değiştirme, dilden-dile. Görülmemiş kelime dağarcığına iyi genelleşir.</div></div>
<div class="calc-card"><div class="card-title">BM25 Kazanır</div><div class="card-body">Nadir token'lar (hata kodları, ürün SKU'ları, özel isimler), tam-eşleşme sorguları, teknik jargon, mevzuat metni. Eğitim yok, embedding maliyeti yok, genellikle yorumlanabilir.</div></div>
<div class="calc-card"><div class="card-title">Hibrit Kazanır</div><div class="card-body">Gerçek sorgular karışık: "PyTorch DataLoader'da CUDA out of memory düzelt". Hibrit + rerank BEIR'de yalnız ikisinden 10-30% nDCG@10 ile kazanır.</div></div>
</div>

<div class="calc-highlight">📊 BEIR benchmark (13 veri kümesi üzerinde ortalama, 2024-2025 sayıları): saf BM25 ~0.42 nDCG@10 · en iyi dense (BGE-M3) ~0.51 · BM25+dense fusion ~0.55 · +rerank (BGE-reranker-v2) ~0.61. Hibrit + rerank, saf BM25 üzerine +%45 ve saf dense üzerine +%20.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. 30 Satırda BM25</h2>

<p class="l-text">BM25, TF-IDF'in akıllı kardeşidir: terim sıklığı doygunluğunu sınırlar ve doküman uzunluğuna göre normalize eder. Formül korkutucu görünüyor ama sezgi basit — yaygın terimler daha az sayar, nadir terimler daha çok sayar, uzun dokümanlar kazara kazanmasın diye cezalandırılır.</p>

<div class="katex-block">$$\\text{BM25}(q, d) = \\sum_{t \\in q} \\text{IDF}(t) \\cdot \\frac{f(t,d) \\cdot (k_1 + 1)}{f(t,d) + k_1 \\cdot (1 - b + b \\cdot \\frac{|d|}{\\text{avgdl}})}$$</div>

<p class="l-text">Burada <code>k_1 ≈ 1.5</code> terim sıklığı doygunluğunu kontrol eder ve <code>b ≈ 0.75</code> uzunluk normalleştirmesini kontrol eder. Pratikte, <code>sklearn</code>'in <code>TfidfVectorizer</code>'ı <code>sublinear_tf=True</code> ve L2 normalleştirme ile BM25'in %90 yaklaşımıdır — çoğu üretim RAG için yeterince iyi.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">import</span> numpy <span class="kw">as</span> np

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">40</span>))
queries  = [<span class="str">"this product broke after one week"</span>, <span class="str">"amazing quality fast delivery"</span>]

<span class="cm"># Sublinear tf + L2 norm ile BM25-imsi TF-IDF</span>
bm25 = <span class="fn">TfidfVectorizer</span>(sublinear_tf=<span class="kw">True</span>, norm=<span class="str">"l2"</span>, stop_words=<span class="str">"english"</span>, max_features=<span class="num">2000</span>)
X_bm = bm25.<span class="fn">fit_transform</span>(texts_in)        <span class="cm"># seyrek (n_docs, vocab)</span>
Q_bm = bm25.<span class="fn">transform</span>(queries)             <span class="cm"># seyrek (n_queries, vocab)</span>
scores = (Q_bm @ X_bm.T).<span class="fn">toarray</span>()         <span class="cm"># (n_queries, n_docs)</span>

<span class="kw">for</span> qi, q <span class="kw">in</span> <span class="fn">enumerate</span>(queries):
    top = np.<span class="fn">argsort</span>(-scores[qi])[:<span class="num">3</span>]
    <span class="fn">print</span>(f<span class="str">"\\nquery: {q}"</span>)
    <span class="kw">for</span> di <span class="kw">in</span> top:
        <span class="fn">print</span>(f<span class="str">"  [{scores[qi, di]:.3f}] {texts_in[di][:80]}"</span>)
</code></pre></div>

<p class="l-text">BM25'in "broke" veya "delivery" gibi nadir token'lı sorguları nasıl çözdüğüne dikkat et — bu kelimeler korpusta seyrek, bu yüzden IDF onları büyütür. Yoğun bir embedder "broke"u "damaged, defective, malfunctioning" olarak genelleyebilir ve farklı bir dokümanı önce sıralayabilir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Reciprocal Rank Fusion — Tek Satırlık Sihir</h2>

<p class="l-text">BM25 sıralamaların ve dense sıralamaların var. Nasıl birleştirirsin? Skorları ağırlıklandırabilirsin (<code>0.5*bm25 + 0.5*dense</code>) ama skor ölçekleri çılgınca farklıdır ve ağırlıkları ayarlamak kırılgandır. Reciprocal Rank Fusion (RRF) skorları tamamen atlar ve sıralamaları kullanır. Aptalca basit ve aptalca etkili.</p>

<div class="katex-block">$$\\text{RRF}(d) = \\sum_{i \\in \\text{retrievers}} \\frac{1}{k + \\text{rank}_i(d)}$$</div>

<p class="l-text">Burada <code>k ≈ 60</code> bir yumuşatma sabitidir (Cormack ve ark. 2009 birçok kurulumda 60'ı sağlam buldu). BM25'te 1. sırada ve dense'de 1. sırada bir doküman <code>1/61 + 1/61 ≈ 0.033</code> alır. Sadece BM25'te 1. sırada bir doküman <code>1/61 + 0 ≈ 0.016</code> alır. İki kez sıralanan dokümanlar her zaman kazanır — tam istediğin davranış.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">40</span>))
query    = <span class="str">"this item arrived damaged"</span>

<span class="cm"># Getirici 1: BM25-imsi (seyrek)</span>
bm = <span class="fn">TfidfVectorizer</span>(sublinear_tf=<span class="kw">True</span>, norm=<span class="str">"l2"</span>, stop_words=<span class="str">"english"</span>)
Xb, qb = bm.<span class="fn">fit_transform</span>(texts_in), bm.<span class="fn">transform</span>([query])
bm_scores = (qb @ Xb.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
bm_rank = {i: r <span class="kw">for</span> r, i <span class="kw">in</span> <span class="fn">enumerate</span>(np.<span class="fn">argsort</span>(-bm_scores), start=<span class="num">1</span>)}

<span class="cm"># Getirici 2: "dense" (tarayıcı için char-ngram TF-IDF ile dense'i taklit)</span>
dense = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">"char_wb"</span>, ngram_range=(<span class="num">3</span>,<span class="num">5</span>), norm=<span class="str">"l2"</span>, max_features=<span class="num">2000</span>)
Xd, qd = dense.<span class="fn">fit_transform</span>(texts_in), dense.<span class="fn">transform</span>([query])
dn_scores = (qd @ Xd.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
dn_rank = {i: r <span class="kw">for</span> r, i <span class="kw">in</span> <span class="fn">enumerate</span>(np.<span class="fn">argsort</span>(-dn_scores), start=<span class="num">1</span>)}

<span class="cm"># RRF fusion</span>
k = <span class="num">60</span>
fused = {i: <span class="num">1</span>/(k + bm_rank[i]) + <span class="num">1</span>/(k + dn_rank[i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(texts_in))}
top = <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">5</span>]

<span class="fn">print</span>(f<span class="str">"query: {query}\\n"</span>)
<span class="kw">for</span> di, score <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  RRF={score:.4f}  bm_rank={bm_rank[di]:>2}  dn_rank={dn_rank[di]:>2}  | {texts_in[di][:70]}"</span>)
</code></pre></div>

<p class="l-text"><strong>BM25 + dense + RRF, adım adım:</strong> 1) Getirici 1, BM25'i yaklaşan sublinear-TF + L2 TF-IDF'dir; <code>bm_rank</code> her doküman kimliğini 1'den başlayan BM25 sırasına eşler. 2) Getirici 2, tarayıcıya dost dense embedder yerine geçen bir char-ngram TF-IDF (3-5); <code>dn_rank</code> onun sıra listesini tutar. 3) <code>1/(k + bm_rank[i]) + 1/(k + dn_rank[i])</code> satırı <code>k=60</code> ile birebir RRF formülüdür. 4) Birleşik skora göre sıralayıp top-5'i basmak, iki listede de yüksekte görünen dokümanları gün yüzüne çıkarır — hibrit erişimin amaçladığı tam olarak bu dokümanlardır.</p>


<div class="calc-highlight">⚡ RRF Elasticsearch, OpenSearch, Weaviate ve Qdrant'ta varsayılan füzyon algoritmasıdır. Sıfır eğitim ve korpus başına ayar gerektirmez. <code>k=60</code> yerleşik varsayılandır; tam değer çok az önemlidir. Füzyon için RRF kullanmıyorsan muhtemelen aşırı mühendislik yapıyorsun.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Cross-Encoder vs Bi-Encoder</h2>

<p class="l-text">Yoğun embedder'ın (BGE, OpenAI, vb.) bir <strong>bi-encoder</strong>'dır: sorguyu ve dokümanı bağımsız kodlar, sonra kosinüsle karşılaştırır. Hızlı — tüm doküman embedding'lerini bir kez önceden hesaplarsın. Kayıplı — model sorguyu ve dokümanı asla birlikte görmez.</p>

<p class="l-text">Bir <strong>cross-encoder</strong> <code>[CLS] sorgu [SEP] doküman [SEP]</code>'i bir transformer'dan geçirir ve tek bir alaka skoru çıkarır. Model sorgu ve doküman token'ları arasında ortaklaşa dikkat eder, çok daha doğrudur — ama sorgu zamanında HER (sorgu, doküman) çiftinde modeli çalıştırmak zorundasın. Bu yüzden ilk aşamadan top-50'yi yeniden sıralarız, asla tüm korpusu değil.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bi-Encoder (örn. BGE-large-en)</div><div class="card-body">Sorguyu ve dokümanı ayrı kodla. Kosinüs karşılaştır. Gecikme: ~10ms sorgu kodlama + 1ms milyonlar üzerinde kosinüs. BEIR'de Recall@10: ~0.50.</div></div>
<div class="calc-card"><div class="card-title">Cross-Encoder (örn. BGE-reranker-v2-m3)</div><div class="card-body">(Sorgu, doküman)'ı ortaklaşa kodla. Tek alaka skoru. Gecikme: GPU'da ÇİFT BAŞINA 1-5ms, CPU'da 20-50ms. Top-50'yi yeniden sıralayarak Recall@10: ~0.62.</div></div>
<div class="calc-card"><div class="card-title">Pratik Pipeline</div><div class="card-body">Bi-encoder milyonlardan top-50'yi 20ms'de getirir. Cross-encoder o 50'yi 50-200ms'de yeniden sıralar. Toplam: ~100-250ms. Net: tek başına bi-encoder'a karşı +%10-30 recall.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Yeniden Sıralayıcı Manzarası — 2026'da Ne Kullanmalı</h2>

<p class="l-text">2026'ya üç yeniden sıralayıcı ailesi hâkim. Gecikme bütçene, dil kapsamına ve self-host yapıp yapamadığına göre seç.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BGE-reranker-v2-m3 (BAAI)</div><div class="card-body">Açık kaynak, çok dilli (100+ dil), 568M parametre. T4 GPU'da self-host: 50 doküman için ~80ms. İngilizce-olmayan RAG için en iyi ücretsiz seçenek. Beijing Academy of AI.</div></div>
<div class="calc-card"><div class="card-title">Cohere Rerank v3</div><div class="card-body">Hostlanmış API, çok dilli, self-host gerekmez. 1000 arama birimi başına ~$2. Gecikme 100-300ms. Genellikle public benchmark'larda zirvede. Çağrı başına öde, altyapı yok.</div></div>
<div class="calc-card"><div class="card-title">Jina Reranker v2</div><div class="card-body">Açık + hostlu. 278M parametre, BGE'ye benzer kalite için daha hızlı. Kod ve İngilizce'de güçlü. Daha küçük GPU'larda self-host yapılabilir.</div></div>
<div class="calc-card"><div class="card-title">MixedBread mxbai-rerank-large-v1</div><div class="card-body">Apache 2.0, İngilizce'de Cohere ile rekabetçi. 435M parametre. Hostlanmış bağımlılık göndermek istemiyorsan iyi "drop-in replacement".</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Cohere Rerank — barındırılan API</span>
<span class="kw">import</span> cohere
co = cohere.<span class="fn">Client</span>(<span class="str">"YOUR_KEY"</span>)

docs = [d[<span class="str">"text"</span>] <span class="kw">for</span> d <span class="kw">in</span> first_stage_results[:<span class="num">50</span>]]  <span class="cm"># BM25+dense'den top-50</span>
res = co.<span class="fn">rerank</span>(
    model=<span class="str">"rerank-english-v3.0"</span>,
    query=<span class="str">"how do I fix CUDA out of memory in PyTorch?"</span>,
    documents=docs,
    top_n=<span class="num">10</span>,
)
<span class="kw">for</span> r <span class="kw">in</span> res.results:
    <span class="fn">print</span>(r.relevance_score, docs[r.index][:<span class="num">80</span>])

<span class="cm"># BGE-reranker-v2-m3 — self-hosted (sentence-transformers)</span>
<span class="kw">from</span> sentence_transformers <span class="kw">import</span> CrossEncoder
reranker = <span class="fn">CrossEncoder</span>(<span class="str">"BAAI/bge-reranker-v2-m3"</span>, max_length=<span class="num">512</span>)

pairs = [[<span class="str">"how do I fix CUDA OOM?"</span>, d] <span class="kw">for</span> d <span class="kw">in</span> docs]
scores = reranker.<span class="fn">predict</span>(pairs, batch_size=<span class="num">32</span>)
ranked = <span class="fn">sorted</span>(<span class="fn">zip</span>(scores, docs), reverse=<span class="kw">True</span>)[:<span class="num">10</span>]
<span class="kw">for</span> s, d <span class="kw">in</span> ranked: <span class="fn">print</span>(<span class="fn">round</span>(<span class="fn">float</span>(s), <span class="num">3</span>), d[:<span class="num">80</span>])
</code></pre></div>

<p class="l-text"><strong>Cohere + BGE rerank akışları:</strong> 1) <code>cohere.Client(...)</code> barındırılan API'yi açar; <code>co.rerank(model="rerank-english-v3.0", query, documents=docs, top_n=10)</code> ilk aşama top-50'sini barındırılan cross-encoder'a gönderir ve her öğeye <code>relevance_score</code> ile sıralı liste döner. 2) Self-host yolu için <code>CrossEncoder("BAAI/bge-reranker-v2-m3", max_length=512)</code> 568M parametreli reranker'ı yerel olarak yükler. 3) <code>pairs = [[query, d] for d in docs]</code> her adayı sorguyla paketler — tam olarak cross-encoder'ın beklediği <code>[CLS] q [SEP] d [SEP]</code> ortak girdisi. 4) <code>reranker.predict(pairs, batch_size=32)</code> partiyi GPU/CPU üzerinde skorlar ve top-10 için sıralarız.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tarayıcıda gerçek bir BERT cross-encoder çalıştıramayız ama cross-encoder PRENSİBİNİ gösterebiliriz: (sorgu+doküman, alaka) özellik çiftleri üzerinde lojistik regresyon eğit. Aynı şekil, sadece daha sığ model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Eğitim çiftleri kur: (sorgu+doküman) metni → alaka etiketi (0/1)</span>
texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">60</span>))
labels   = <span class="fn">list</span>(df_reviews[<span class="str">"sentiment"</span>].<span class="fn">head</span>(<span class="num">60</span>))

<span class="cm"># Varsayalım "pozitif yorum" = "'good product' sorgusuna alakalı"</span>
query = <span class="str">"good product I love it"</span>
pair_texts = [query + <span class="str">" [SEP] "</span> + t <span class="kw">for</span> t <span class="kw">in</span> texts_in]
y = np.<span class="fn">array</span>([<span class="num">1</span> <span class="kw">if</span> l == <span class="str">"positive"</span> <span class="kw">else</span> <span class="num">0</span> <span class="kw">for</span> l <span class="kw">in</span> labels])

vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">1500</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>))
X = vec.<span class="fn">fit_transform</span>(pair_texts)

<span class="cm"># Cross-encoder = (sorgu, doküman)'ı ortaklaşa gören model</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">300</span>).<span class="fn">fit</span>(X, y)
relevance = clf.<span class="fn">predict_proba</span>(X)[:, <span class="num">1</span>]

<span class="cm"># Top-10'u yeniden sırala</span>
top = np.<span class="fn">argsort</span>(-relevance)[:<span class="num">5</span>]
<span class="fn">print</span>(f<span class="str">"query: {query}\\n"</span>)
<span class="kw">for</span> i <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  rel={relevance[i]:.3f}  label={labels[i]:>8}  | {texts_in[i][:70]}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Sığ cross-encoder demosu, adım adım:</strong> 1) <code>query + " [SEP] " + doc</code> ortak metinler kurarız — gerçek bir cross-encoder ile aynı girdi şekli; pozitif sentiment "alakalı" sayılır ve 0/1 etiketi alırız. 2) <code>TfidfVectorizer(ngram_range=(1,2))</code> bu ortak string'leri örtüşmeyi ve ikilemleri yakalayan özelliklere dönüştürür. 3) <code>LogisticRegression().fit(X, y)</code> ağırlıkları sorgu ve doküman token'larını birlikte ele alarak öğrenir — bu ortak bakış cross-encoder'ın kilit özelliğidir. 4) <code>predict_proba(X)[:,1]</code> doküman başına alaka olasılığı verir; azalan sırada sıralamak yeniden sıralanmış top-5'i etiketleriyle birlikte basar ve pozitiflerin baskın çıktığını görebilirsin.</p>


</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ColBERT — Geç Etkileşim</h2>

<p class="l-text">ColBERT (Contextualized Late Interaction over BERT) bi-encoder ile cross-encoder arasında oturur. Token'ları doküman başına bir vektöre havuzlamak yerine, TOKEN BAŞINA BİR VEKTÖR saklar (tipik olarak 128 boyut). Sorgu zamanında max-sim yapar: her sorgu token'ı için en iyi eşleşen doküman token'ını bul, sonra topla.</p>

<div class="katex-block">$$\\text{ColBERT}(q, d) = \\sum_{i \\in q} \\max_{j \\in d} \\langle E_q^i, E_d^j \\rangle$$</div>

<p class="l-text">Toplamdaki her terim, bir sorgu token'ının dokümanın herhangi bir yerinde "en iyi evini bulmasına" izin verir — ortalamalı embedding'lerin kaybettiği ince taneli eşleşmeyi yakalar. Recall cross-encoder'a yakındır (BEIR'de birkaç puan içinde), ama tüm doküman token'larını önceden hesaplayıp bir vektör indeksiyle arayabilirsin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Depolama Maliyeti</div><div class="card-body">200-token'lık bir doküman 128 boyutta 200 vektör olur. Toplam bayt: doküman başına ~100 KB, tek 768 boyutlu vektör için ~3 KB karşı. <strong>~30-100x daha fazla depolama.</strong></div></div>
<div class="calc-card"><div class="card-title">Gecikme</div><div class="card-body">Sorgu kodlama: ~20ms. Doğru indeksle (PLAID) bir milyon doküman üzerinde token-seviyesi max-sim: 50-100ms. Bi-encoder'dan yavaş, cross-encoder'dan hızlı.</div></div>
<div class="calc-card"><div class="card-title">Kalite</div><div class="card-body">BEIR'de güçlü bir cross-encoder'dan 1-3 nDCG puan içinde. Özellikle havuzlamanın bilgiyi kaybettiği uzun dokümanlarda güçlü.</div></div>
<div class="calc-card"><div class="card-title">Ne Zaman Kullanılır</div><div class="card-body">Uzun-doküman erişimi (yasal, tıbbi, kod), veya depolamayı kaldırabildiğinde ve tam yeniden sıralamanın sorgu başına gecikmesi olmadan tutarlı şekilde bi-encoder'dan daha iyi recall'a ihtiyacın olduğunda.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak ColBERT: her "token" bir TF-IDF satır vektörüdür. Geç etkileşimi taklit etmek için sorgu token'ları ile doküman token'ları arasında max-sim hesaplıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">import</span> numpy <span class="kw">as</span> np, re

<span class="kw">def</span> <span class="fn">tokens</span>(s): <span class="kw">return</span> re.<span class="fn">findall</span>(r<span class="str">"[a-z]+"</span>, s.<span class="fn">lower</span>())

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">20</span>))
query    = <span class="str">"amazing quality fast shipping"</span>

<span class="cm"># Sorgu + tüm dokümanlar üzerinde TOKEN seviyesinde paylaşımlı vocab kur</span>
all_tokens = <span class="fn">set</span>(<span class="fn">tokens</span>(query))
<span class="kw">for</span> t <span class="kw">in</span> texts_in: all_tokens |= <span class="fn">set</span>(<span class="fn">tokens</span>(t))
vec = <span class="fn">TfidfVectorizer</span>(vocabulary=<span class="fn">sorted</span>(all_tokens), norm=<span class="str">"l2"</span>)
vec.<span class="fn">fit</span>([query] + texts_in)

<span class="kw">def</span> <span class="fn">emb_per_token</span>(text):
    toks = <span class="fn">tokens</span>(text)
    <span class="kw">if</span> <span class="kw">not</span> toks: <span class="kw">return</span> np.<span class="fn">zeros</span>((<span class="num">1</span>, <span class="fn">len</span>(vec.vocabulary_)), dtype=np.float32)
    <span class="kw">return</span> vec.<span class="fn">transform</span>(toks).<span class="fn">toarray</span>().<span class="fn">astype</span>(np.float32)  <span class="cm"># (n_tokens, vocab)</span>

q_emb = <span class="fn">emb_per_token</span>(query)         <span class="cm"># (Lq, V)</span>
scores = []
<span class="kw">for</span> d <span class="kw">in</span> texts_in:
    d_emb = <span class="fn">emb_per_token</span>(d)         <span class="cm"># (Ld, V)</span>
    sim = q_emb @ d_emb.T            <span class="cm"># (Lq, Ld)</span>
    colbert_score = <span class="fn">float</span>(sim.<span class="fn">max</span>(axis=<span class="num">1</span>).<span class="fn">sum</span>())  <span class="cm"># max-sim sonra sorgu token'ları üzerinde topla</span>
    scores.<span class="fn">append</span>(colbert_score)

<span class="kw">for</span> di <span class="kw">in</span> np.<span class="fn">argsort</span>(-np.<span class="fn">array</span>(scores))[:<span class="num">5</span>]:
    <span class="fn">print</span>(f<span class="str">"  ColBERT={scores[di]:.3f}  | {texts_in[di][:70]}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>Oyuncak ColBERT max-sim, adım adım:</strong> 1) <code>tokens(s)</code> string'i küçük harfli sözcük token'larına regex ile böler. 2) Sorgu + korpus arasındaki her token paylaşımlı bir vocab'a toplanır; böylece her token tutarlı bir TF-IDF satır vektörü alır. 3) <code>emb_per_token(text)</code> token başına bir vektör döner — tek havuzlanmış vektörün yerini alan geç-etkileşim temsili. 4) Her doküman için benzerlik matrisi <code>sim = q_emb @ d_emb.T</code> <code>(Lq, Ld)</code>'dir; <code>sim.max(axis=1).sum()</code> her sorgu token'ının en iyi doküman-token eşleşmesini seçip toplar — tam olarak ColBERT skorlama kuralı. 5) Bu max-toplam skoruna göre top-5 doküman basılır.</p>


</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Sorgu Yeniden Yazma ve Çoklu-Sorgu</h2>

<p class="l-text">Bazen darboğaz sorgu, getirici değil. "Kodum neden yavaş?" hiçbir kullanışlı şey eşleştirmez. Sorgu yeniden yazma, erişimden önce sorguyu genişletmek veya yeniden ifade etmek için bir LLM kullanır. Çoklu-sorgu birkaç yeniden yazım üretir, her biri için erişim yapar, sonra RRF birleştirir. HyDE (Hypothetical Document Embedding) daha ileri gider: LLM'den sahte bir cevap yazmasını iste, sonra o sahte cevaba benzer dokümanları getir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naif Sorgu</div><div class="card-body">"Kodum neden yavaş?" — çok belirsiz, rastgele performans sayfaları getirir.</div></div>
<div class="calc-card"><div class="card-title">Sorgu Yeniden Yazma (LLM)</div><div class="card-body">"GIL çekişmesi, verimsiz döngüler ve I/O bloklama dahil yavaş Python kodunun yaygın nedenleri nelerdir?" — çok daha iyi recall.</div></div>
<div class="calc-card"><div class="card-title">Çoklu-Sorgu + RRF</div><div class="card-body">3-5 yeniden yazım üret, her biri için top-20 getir, RRF birleştir. Tipik kazanç: tek yeniden yazıma göre +%5-15 recall.</div></div>
<div class="calc-card"><div class="card-title">HyDE</div><div class="card-body">LLM sahte bir cevap yazar; onu embed et; ara. Sorgular kısa ve soyut olduğunda güçlü. 1 LLM çağrısı ekler (~500ms gecikme).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Çoklu-sorgu + RRF (yeniden yazma LLM'i olarak OpenAI ile taslak)</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
client = <span class="fn">OpenAI</span>()

<span class="kw">def</span> <span class="fn">generate_queries</span>(q, n=<span class="num">4</span>):
    prompt = f<span class="str">"Generate {n} diverse rewrites of this search query, one per line:\\n{q}"</span>
    resp = client.chat.completions.<span class="fn">create</span>(
        model=<span class="str">"gpt-4o-mini"</span>,
        messages=[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:prompt}],
    )
    <span class="kw">return</span> [line.<span class="fn">strip</span>() <span class="kw">for</span> line <span class="kw">in</span> resp.choices[<span class="num">0</span>].message.content.<span class="fn">split</span>(<span class="str">"\\n"</span>) <span class="kw">if</span> line.<span class="fn">strip</span>()]

<span class="kw">def</span> <span class="fn">rrf_fuse</span>(rank_lists, k=<span class="num">60</span>):
    fused = {}
    <span class="kw">for</span> ranks <span class="kw">in</span> rank_lists:
        <span class="kw">for</span> r, doc_id <span class="kw">in</span> <span class="fn">enumerate</span>(ranks, start=<span class="num">1</span>):
            fused[doc_id] = fused.<span class="fn">get</span>(doc_id, <span class="num">0</span>) + <span class="num">1</span> / (k + r)
    <span class="kw">return</span> <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])

queries = <span class="fn">generate_queries</span>(<span class="str">"why is my model overfitting?"</span>)
all_ranks = [<span class="fn">retrieve</span>(q, top_k=<span class="num">20</span>) <span class="kw">for</span> q <span class="kw">in</span> queries]   <span class="cm"># senin getiricin</span>
final = <span class="fn">rrf_fuse</span>(all_ranks)[:<span class="num">10</span>]
</code></pre></div>

<p class="l-text"><strong>Çoklu-sorgu yeniden yazma akışı:</strong> 1) <code>generate_queries(q, n=4)</code> <code>gpt-4o-mini</code>'yi tek satırlık bir prompt ile çağırır; orijinal sorgunun dört farklı yeniden yazımını ister ve cevabı yeni satırlarda böler. 2) Her yeniden yazım kendi <code>retrieve(q, top_k=20)</code> getiricisine beslenir, dört sıralı liste üretilir. 3) <code>rrf_fuse(rank_lists, k=60)</code> her listeyi dolaşır, görünüm başına <code>1/(k + rank)</code> ekleyerek tek bir <code>fused</code> dict'i kurar ve azalan sırada sıralar. 4) Son top-10, birden fazla yeniden yazımda yüksekte görünen dokümanları öne çıkarır — herhangi tek bir sorgu ifadesinin zayıf olmasına karşı güçlü bir koruma.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tarayıcıda LLM yok — yorumlar veri kümesinde 3 sorgu yeniden yazımını elle üretip 3 erişim üzerinde RRF füzyonunu gösteriyoruz. Füzyon mantığı gerçek pipeline ile aynı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">import</span> numpy <span class="kw">as</span> np

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">50</span>))
<span class="cm"># Soyut bir sorgunun el-yapımı "LLM yeniden yazımları"</span>
queries = [
    <span class="str">"this product is poor quality"</span>,
    <span class="str">"broken item arrived defective"</span>,
    <span class="str">"disappointing purchase waste money"</span>,
]

vec = <span class="fn">TfidfVectorizer</span>(sublinear_tf=<span class="kw">True</span>, norm=<span class="str">"l2"</span>, stop_words=<span class="str">"english"</span>)
X = vec.<span class="fn">fit_transform</span>(texts_in)

<span class="cm"># Her yeniden yazım için top-15 getir</span>
rank_lists = []
<span class="kw">for</span> q <span class="kw">in</span> queries:
    qv = vec.<span class="fn">transform</span>([q])
    scores = (qv @ X.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
    rank_lists.<span class="fn">append</span>(np.<span class="fn">argsort</span>(-scores)[:<span class="num">15</span>].<span class="fn">tolist</span>())

<span class="cm"># RRF birleştir</span>
k = <span class="num">60</span>
fused = {}
<span class="kw">for</span> ranks <span class="kw">in</span> rank_lists:
    <span class="kw">for</span> r, doc_id <span class="kw">in</span> <span class="fn">enumerate</span>(ranks, start=<span class="num">1</span>):
        fused[doc_id] = fused.<span class="fn">get</span>(doc_id, <span class="num">0</span>) + <span class="num">1</span> / (k + r)

top = <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">5</span>]
<span class="fn">print</span>(<span class="str">"multi-query + RRF top-5:"</span>)
<span class="kw">for</span> di, score <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  RRF={score:.4f} | {texts_in[di][:70]}"</span>)
</code></pre></div>
</div>

<p class="l-text"><strong>El-yapımı çoklu-sorgu, adım adım:</strong> 1) Soyut şikâyet sorgusunun üç "LLM-stili" yeniden yazımı, <code>gpt-4o-mini</code>'nin üreteceğinin yerini alır. 2) 50 yorumluk korpus üzerinde paylaşımlı bir sublinear-TF + L2 TF-IDF indeksi bir kez fit edilir. 3) Döngü her yeniden yazımı <code>vec.transform</code> + kosinüsten geçirir ve top-15 doküman kimliğini saklar — yeniden yazım başına bir sıra listesi. 4) Sıralı RRF birleştirici üç liste boyunca <code>1/(60 + rank)</code> ekleyerek <code>fused</code>'ı doldurur; azalan sırada sıralamak son top-5'i verir. Üç yeniden yazım listesinde de görünen dokümanlar, herhangi bir sorgunun kelimelerine bağlı kalmadan tepeye çıkar.</p>


</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gecikme Bütçesi</h2>

<p class="l-text">Her katman milisaniyeler ekler. Buna değer mi ürününe bağlıdır. Bir chatbot toplam 500ms erişim kaldırabilir; yazarken-arama kutusu kaldıramaz. Gerçekçi bir bütçe burada.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sadece Bi-Encoder</div><div class="card-body">~30-50ms toplam (sorgu kodlama + ANN arama). Recall@10: %100 temel. Kullanım: yazarken-arama, düşük-gecikme UX.</div></div>
<div class="calc-card"><div class="card-title">+ BM25 Hibrit + RRF</div><div class="card-body">+10-30ms (paralel BM25 arama + birleştir). Recall@10: +%8-15. Kullanım: herhangi üretim RAG. Neredeyse her zaman değer.</div></div>
<div class="calc-card"><div class="card-title">+ Cross-Encoder Yeniden Sıralama (top-50)</div><div class="card-body">+50-200ms (CPU) veya +20-50ms (GPU). Recall@10: bi-encoder'a göre +%10-30. Kullanım: chat, agentic RAG, &gt;200ms kabul edilebilir herhangi yer.</div></div>
<div class="calc-card"><div class="card-title">+ Çoklu-Sorgu (4 yeniden yazım)</div><div class="card-body">+500-1500ms (LLM çağrısı baskın). Recall@10: +%5-15. Kullanım: zor sorgular (araştırma, keşif), LLM çağrısı zaten gerçekleşiyor olduğunda.</div></div>
<div class="calc-card"><div class="card-title">ColBERT (bi-encoder'ı değiştirir)</div><div class="card-body">~80-150ms arama gecikmesi. Depolama: bi-encoder'ın 30-100x'i. Recall: cross-encoder yeniden sıralamaya yakın. Kullanım: uzun-doküman ağır alanlar.</div></div>
</div>

<div class="calc-highlight">🎯 2026 varsayılan üretim yığını: BM25 + dense → RRF → top-50 üzerinde BGE-reranker-v2-m3 (veya Cohere Rerank v3). ~250ms p99, tek başına dense'e göre +%20-30 recall. Sadece kullanıcı sorgusu kısa ve soyut olduğunda çoklu-sorgu ekle.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Lab — Tam Pipeline Karşılaştırması</h2>

<p class="l-text">Hepsini yorumlar veri kümesinde birleştirip her katmanın top-5'i nasıl değiştirdiğini ölçelim. Dört konfigürasyon karşılaştıracağız: sadece-dense, BM25+dense+RRF, hibrit+rerank ve çoklu-sorgu varyantı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

texts_in = <span class="fn">list</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">head</span>(<span class="num">60</span>))
labels   = <span class="fn">list</span>(df_reviews[<span class="str">"sentiment"</span>].<span class="fn">head</span>(<span class="num">60</span>))
query    = <span class="str">"great product highly recommend"</span>

<span class="cm"># === Asama 1a: dense (embedder yerine char-ngram) ===</span>
dense = <span class="fn">TfidfVectorizer</span>(analyzer=<span class="str">"char_wb"</span>, ngram_range=(<span class="num">3</span>,<span class="num">5</span>), norm=<span class="str">"l2"</span>, max_features=<span class="num">2000</span>)
Xd = dense.<span class="fn">fit_transform</span>(texts_in)
qd = dense.<span class="fn">transform</span>([query])
dn_scores = (qd @ Xd.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
dn_rank = {i: r <span class="kw">for</span> r, i <span class="kw">in</span> <span class="fn">enumerate</span>(np.<span class="fn">argsort</span>(-dn_scores), start=<span class="num">1</span>)}

<span class="cm"># === Asama 1b: BM25 (kelime TF-IDF) ===</span>
bm = <span class="fn">TfidfVectorizer</span>(sublinear_tf=<span class="kw">True</span>, norm=<span class="str">"l2"</span>, stop_words=<span class="str">"english"</span>)
Xb = bm.<span class="fn">fit_transform</span>(texts_in)
qb = bm.<span class="fn">transform</span>([query])
bm_scores = (qb @ Xb.T).<span class="fn">toarray</span>()[<span class="num">0</span>]
bm_rank = {i: r <span class="kw">for</span> r, i <span class="kw">in</span> <span class="fn">enumerate</span>(np.<span class="fn">argsort</span>(-bm_scores), start=<span class="num">1</span>)}

<span class="cm"># === Asama 2: top-30'u RRF birlestir ===</span>
k = <span class="num">60</span>
fused = {i: <span class="num">1</span>/(k + bm_rank[i]) + <span class="num">1</span>/(k + dn_rank[i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(texts_in))}
hybrid_top30 = [i <span class="kw">for</span> i, _ <span class="kw">in</span> <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> x: -x[<span class="num">1</span>])[:<span class="num">30</span>]]

<span class="cm"># === Aşama 3: cross-encoder yeniden sırala (positive=relevant ile eğitilmiş logreg) ===</span>
y = np.<span class="fn">array</span>([<span class="num">1</span> <span class="kw">if</span> l == <span class="str">"positive"</span> <span class="kw">else</span> <span class="num">0</span> <span class="kw">for</span> l <span class="kw">in</span> labels])
pair_vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">1500</span>, ngram_range=(<span class="num">1</span>,<span class="num">2</span>))
X_pair_train = pair_vec.<span class="fn">fit_transform</span>([query + <span class="str">" [SEP] "</span> + t <span class="kw">for</span> t <span class="kw">in</span> texts_in])
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">300</span>).<span class="fn">fit</span>(X_pair_train, y)

X_pair_rerank = pair_vec.<span class="fn">transform</span>([query + <span class="str">" [SEP] "</span> + texts_in[i] <span class="kw">for</span> i <span class="kw">in</span> hybrid_top30])
rel = clf.<span class="fn">predict_proba</span>(X_pair_rerank)[:, <span class="num">1</span>]
reranked = [hybrid_top30[i] <span class="kw">for</span> i <span class="kw">in</span> np.<span class="fn">argsort</span>(-rel)][:<span class="num">5</span>]

<span class="fn">print</span>(f<span class="str">"query: {query}\\n"</span>)
<span class="fn">print</span>(<span class="str">"--- dense only top-5 ---"</span>)
<span class="kw">for</span> i <span class="kw">in</span> np.<span class="fn">argsort</span>(-dn_scores)[:<span class="num">5</span>]: <span class="fn">print</span>(f<span class="str">"  {labels[i]:>8} | {texts_in[i][:65]}"</span>)
<span class="fn">print</span>(<span class="str">"\\n--- hybrid (BM25+dense+RRF) top-5 ---"</span>)
<span class="kw">for</span> i <span class="kw">in</span> [x <span class="kw">for</span> x,_ <span class="kw">in</span> <span class="fn">sorted</span>(fused.<span class="fn">items</span>(), key=<span class="kw">lambda</span> y: -y[<span class="num">1</span>])[:<span class="num">5</span>]]:
    <span class="fn">print</span>(f<span class="str">"  {labels[i]:>8} | {texts_in[i][:65]}"</span>)
<span class="fn">print</span>(<span class="str">"\\n--- hybrid + rerank top-5 ---"</span>)
<span class="kw">for</span> i <span class="kw">in</span> reranked: <span class="fn">print</span>(f<span class="str">"  {labels[i]:>8} | {texts_in[i][:65]}"</span>)
</code></pre></div>

<p class="l-text">Bunu çalıştır ve top-5'teki "positive" etiketlerinin oranının sadece-dense'den hibrit'e ve hibrit+rerank'a tırmandığını izle. Gecikmeyle ödediğin recall artışı bu. Gerçek veriyle ve gerçek bir cross-encoder ile artış tipik olarak %10-30 nDCG@10'dur — bedava öğle yemeğin.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sıradaki</h2>

<p class="l-text">Artık tam erişim yükseltme merdiveninin tamamına sahipsin. Saf dense zemindir; <strong>BM25 + dense + RRF</strong> bariz sonraki adımdır (ucuz, +%10 recall); <strong>cross-encoder yeniden sıralama</strong> sonraki büyük sıçramadır (+%10-30 ama +50-200ms); <strong>ColBERT</strong> uzun dokümanlar için alternatiftir; <strong>çoklu-sorgu ve HyDE</strong> LLM çağrıları zaten döngünde olduğunda belirsiz sorguları kurtarır.</p>

<p class="l-text">2026 üretim RAG için varsayılan seçim: BM25 + dense → RRF → top-50 üzerinde BGE-reranker-v2-m3. Bu ~250ms toplam ve naif yoğun temel çizgisine göre +%20-30 nDCG@10 artışı. Sonraki ders <strong>chunking stratejilerini</strong> ele alır — çünkü dünyanın en iyi getiricisi 8000-token'lık sözleşmen cümle sınırlarında 50-token'lık parçalara bölünmüşse yardım edemez.</p>

<div class="calc-highlight">📚 Okuma listesi: Cormack ve ark. 2009 (RRF orijinali) · Khattab &amp; Zaharia 2020 (ColBERT) · Gao ve ark. 2022 (HyDE) · BAAI BGE-M3 makalesi 2024 · Cohere Rerank dokümantasyonu · BEIR benchmark Thakur ve ark. 2021. Hepsi serbestçe mevcut; tek başına BEIR makalesi dikkatli bir hafta sonu okumasına değer.</div>
</div>`
};
