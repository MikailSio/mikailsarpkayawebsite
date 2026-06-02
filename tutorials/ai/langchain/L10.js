window.LANGCHAIN_L10 = {
en: `<p class="l-text"><strong>Hook.</strong> Vanilla RAG (embed → top-K → stuff context → answer) gets you to 70-75% of correct answers. Pushing past 90% requires an upgrade kit: <strong>rerankers, multi-query, HyDE, parent-document retrieval, self-query, and rigorous evaluation</strong>. This lesson is the practitioner's checklist for shipping production-grade RAG.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Add a cross-encoder reranker (Cohere, BGE) on top of vector retrieval</li>
<li>Generate query variants with <code>MultiQueryRetriever</code> to boost recall</li>
<li>Implement HyDE (Hypothetical Document Embeddings) for sparse-query domains</li>
<li>Use <code>ParentDocumentRetriever</code> to embed small chunks but inject larger context</li>
<li>Build a <code>SelfQueryRetriever</code> that turns natural questions into metadata filters</li>
<li>Evaluate RAG with RAGAS metrics: faithfulness, answer relevance, context precision</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Why vanilla RAG fails</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Bad query → bad recall</div><div class="calc-card-desc">User phrasing differs from corpus. Solution: multi-query / HyDE.</div></div>
<div class="calc-card"><div class="calc-card-title">Top-K is noisy</div><div class="calc-card-desc">5 candidates, 2 are irrelevant. Solution: cross-encoder reranker.</div></div>
<div class="calc-card"><div class="calc-card-title">Chunk too small</div><div class="calc-card-desc">Retrieved chunk is precise but missing surrounding context. Solution: parent-document retrieval.</div></div>
<div class="calc-card"><div class="calc-card-title">Filter ignored</div><div class="calc-card-desc">"Show me 2025 reviews" — but date filter never applied. Solution: self-query retriever.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Reranking with a cross-encoder</h2>
<p class="l-text">Embeddings are <strong>bi-encoders</strong>: query and doc are encoded independently, then compared with cosine. Fast, but lossy. A <strong>cross-encoder</strong> takes (query, doc) as a single pair and scores semantic match — much more accurate but ~50× slower per pair, so we only run it on the top 50-100 candidates.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_cohere <span class="kw">import</span> CohereRerank
<span class="kw">from</span> langchain.retrievers <span class="kw">import</span> ContextualCompressionRetriever

reranker = <span class="fn">CohereRerank</span>(model=<span class="str">"rerank-english-v3.0"</span>, top_n=<span class="num">4</span>)
base = store.<span class="fn">as_retriever</span>(search_kwargs={<span class="str">"k"</span>: <span class="num">25</span>})

retriever = <span class="fn">ContextualCompressionRetriever</span>(
    base_retriever=base, base_compressor=reranker
)
docs = retriever.<span class="fn">invoke</span>(<span class="str">"X3 firmware update issues"</span>)
<span class="cm"># Cohere's reranker rescores 25 candidates, returns the best 4.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>CohereRerank(model="rerank-english-v3.0", top_n=4)</code> wraps Cohere's hosted cross-encoder so it can be plugged into any LangChain retriever. 2) The base retriever fetches a wider candidate pool (<code>k=25</code>) than you ultimately want — the reranker needs options to choose from. 3) <code>ContextualCompressionRetriever(base_retriever=..., base_compressor=reranker)</code> runs the base search, hands the candidates to the reranker, and returns only the top-N. 4) <code>retriever.invoke(query)</code> looks identical to a regular retriever call — the rerank stage is invisible to the rest of the chain.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Cross-encoder rescores (query, doc) jointly. Approximate that with a stronger char+word TF-IDF combined feature: retrieve top-25 with bi-encoder, then re-rank with the heavier scorer. Same two-stage pattern.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Two-stage retrieve -> rerank
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(60).tolist()

# Stage 1: cheap "bi-encoder" (word TF-IDF, top-25)
v1 = TfidfVectorizer().fit(texts); X1 = v1.transform(texts)
def stage1(q, k=25):
    sims = cosine_similarity(v1.transform([q]), X1).ravel()
    return list(np.argsort(-sims)[:k]), sims

# Stage 2: heavier "cross-encoder" (char-ngram TF-IDF on the 25)
v2 = TfidfVectorizer(analyzer="char_wb", ngram_range=(3,5)).fit(texts)
X2 = v2.transform(texts)
def rerank(q, candidates, top_n=4):
    sims = cosine_similarity(v2.transform([q]), X2[candidates]).ravel()
    order = np.argsort(-sims)[:top_n]
    return [(candidates[i], float(sims[i])) for i in order]

q = "battery problems on laptop"
cand, _ = stage1(q)
print("stage1 top-5:", cand[:5])
print("\nstage2 reranked top-4:")
for idx, s in rerank(q, cand):
    print(f"  {s:.3f} -> {texts[idx][:70]}")</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Stage 1 builds a cheap word-level TF-IDF index and <code>stage1(q, k=25)</code> returns the top-25 — same role as the FAISS bi-encoder retriever. 2) Stage 2 builds a heavier character-n-gram TF-IDF index, only consulted for the 25 candidates — same role as the cross-encoder rerank. 3) <code>rerank(q, candidates, top_n=4)</code> scores only the candidate subset (note <code>X2[candidates]</code>) and returns the best four — the asymmetric cost is exactly why production reranks a small pool, not the whole corpus. 4) The two prints show the order changing between stage 1 and stage 2 — the value rerankers bring.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Multi-query retrieval</h2>
<p class="l-text">Idea: ask the LLM to rewrite the user's query 3-5 ways, retrieve for each, then deduplicate.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.retrievers.multi_query <span class="kw">import</span> MultiQueryRetriever
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

multi = MultiQueryRetriever.<span class="fn">from_llm</span>(
    retriever=store.<span class="fn">as_retriever</span>(),
    llm=<span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
)
docs = multi.<span class="fn">invoke</span>(<span class="str">"Why are customers angry about X3?"</span>)

<span class="cm"># Generated queries internally:</span>
<span class="cm">#   1. "X3 customer complaints"</span>
<span class="cm">#   2. "X3 negative reviews"</span>
<span class="cm">#   3. "X3 quality issues"</span>
<span class="cm"># Each retrieves K docs; union is returned.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>MultiQueryRetriever.from_llm(retriever=..., llm=...)</code> wires a paraphrase-generating LLM in front of any retriever. 2) On <code>.invoke(question)</code> the LLM emits 3-5 alternate phrasings (the comment shows examples) — each captures a different angle of the same intent. 3) Every variant is sent through the base retriever and the union of hits is returned — duplicates are removed by document id. 4) The cost is one extra LLM call per query, paid in exchange for substantially better recall when user phrasing differs from the corpus vocabulary.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Multi-query is "ask 3 phrasings, union the hits". Replace the LLM rewriter with a hand-coded list of paraphrases — the recall improvement comes from query diversity, not from the LLM itself.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Multi-query retrieval (paraphrases instead of LLM)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(80).tolist()
vec = TfidfVectorizer(ngram_range=(1,2)).fit(texts)
X = vec.transform(texts)

def retrieve(q, k=4):
    sims = cosine_similarity(vec.transform([q]), X).ravel()
    return list(np.argsort(-sims)[:k]), sims

# Hand-paraphrased "multi-query"
queries = [
    "Why are customers angry about X3?",
    "X3 customer complaints",
    "X3 negative reviews",
    "X3 quality issues",
]

union = set()
for q in queries:
    idxs, _ = retrieve(q, k=3)
    union.update(idxs)
    print(f"  '{q[:40]}' -> {idxs}")

print(f"\nunique docs from union: {len(union)}")
print("first 3:", [texts[i][:60] for i in list(union)[:3]])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The four-element <code>queries</code> list stands in for an LLM rewriter — original question plus three hand-crafted paraphrases of the same intent. 2) <code>retrieve(q, k=3)</code> runs the TF-IDF index for each variant and returns the top-3 document indices. 3) <code>union.update(idxs)</code> accumulates a deduplicated set across variants — exactly what <code>MultiQueryRetriever</code> does after its LLM rewrite step. 4) The final print shows <code>len(union)</code> is larger than any single variant's top-3 — the recall lift is the whole point of multi-query.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. HyDE — Hypothetical Document Embeddings</h2>
<p class="l-text">Counter-intuitive trick: ask the LLM to <em>write a fake answer</em> to the query, embed that fake answer, and search the index with it. The fake answer is closer in embedding space to the real answer than the bare question is.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableLambda
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI, OpenAIEmbeddings

write = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
emb   = <span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>)

<span class="kw">def</span> <span class="fn">hyde_search</span>(query, k=<span class="num">4</span>):
    fake = write.<span class="fn">invoke</span>(
        f<span class="str">"Write a hypothetical 100-word answer to: {query}"</span>
    ).content
    fake_vec = emb.<span class="fn">embed_query</span>(fake)
    <span class="kw">return</span> store.<span class="fn">similarity_search_by_vector</span>(fake_vec, k=k)

<span class="fn">print</span>(<span class="fn">hyde_search</span>(<span class="str">"Is the X3 charger safe?"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>write.invoke("Write a hypothetical 100-word answer to: ...")</code> asks the LLM to fabricate what a good answer would look like — note that factual accuracy is irrelevant, structural plausibility is what helps. 2) <code>emb.embed_query(fake)</code> turns that fake answer into a vector that lives in the <em>answer</em> region of the embedding space — closer to real answers than the bare question is. 3) <code>store.similarity_search_by_vector(fake_vec, k=k)</code> uses the fake vector directly, skipping the question entirely. 4) Result: better recall on under-specified or sparse queries (legal, medical, niche technical) where the question text and the answer text use very different vocabularies.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">HyDE: search with a fake answer instead of the question. Use a hand-written hypothetical sentence (LLM stand-in). Compare cosine similarity of question-vs-fake against true relevant text — fake usually wins.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># HyDE without an LLM
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(80).tolist()
vec = TfidfVectorizer(ngram_range=(1,2)).fit(texts)
X = vec.transform(texts)

question = "Is the laptop charger safe?"
hypothetical = ("The laptop charger has a UL safety certification, "
                "uses overcurrent protection, and the battery thermal "
                "management prevents overheating during fast charging.")

def search(query_str, k=4):
    sims = cosine_similarity(vec.transform([query_str]), X).ravel()
    top = np.argsort(-sims)[:k]
    return [(round(sims[i], 3), texts[i]) for i in top]

print("=== bare question ===")
for s, t in search(question): print(s, "->", t[:70])

print("\n=== HyDE (fake answer as query) ===")
for s, t in search(hypothetical): print(s, "->", t[:70])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>question</code> holds the bare user query; <code>hypothetical</code> holds a hand-written stand-in for what the LLM would fabricate — three sentences that <em>look</em> like a real answer. 2) <code>search</code> runs the same TF-IDF retrieval over both strings — the only difference is the query text, not the index. 3) Comparing the two prints shows the hypothetical sentence pulls more relevant reviews to the top, even though it contains no new factual signal. 4) That gap is the HyDE win — and it disappears the moment your query is already long and content-rich, so HyDE pays off most on terse questions.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Parent-document retrieval</h2>
<p class="l-text">Index small chunks (300 tokens) for precise retrieval, but at answer time fetch the parent document (full page) for richer context.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.retrievers <span class="kw">import</span> ParentDocumentRetriever
<span class="kw">from</span> langchain.storage <span class="kw">import</span> InMemoryStore
<span class="kw">from</span> langchain_text_splitters <span class="kw">import</span> RecursiveCharacterTextSplitter

parent_splitter = <span class="fn">RecursiveCharacterTextSplitter</span>(chunk_size=<span class="num">2000</span>)
child_splitter  = <span class="fn">RecursiveCharacterTextSplitter</span>(chunk_size=<span class="num">300</span>)

retriever = <span class="fn">ParentDocumentRetriever</span>(
    vectorstore=store,
    docstore=<span class="fn">InMemoryStore</span>(),
    child_splitter=child_splitter,
    parent_splitter=parent_splitter,
)
retriever.<span class="fn">add_documents</span>(raw_docs)
docs = retriever.<span class="fn">invoke</span>(<span class="str">"error 502 in checkout"</span>)  <span class="cm"># returns 2000-tok parents</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Two splitters set the two granularities: <code>parent_splitter</code> at 2000 chars for context, <code>child_splitter</code> at 300 chars for indexing precision. 2) <code>ParentDocumentRetriever(vectorstore=..., docstore=InMemoryStore(), ...)</code> embeds the children into <code>vectorstore</code> while keeping the parents in <code>docstore</code> under a parent_id reference. 3) <code>retriever.add_documents(raw_docs)</code> runs both splits and stores the cross-references automatically. 4) <code>retriever.invoke(query)</code> performs vector search over <em>children</em> for sharp recall, then dereferences each hit to its parent before returning — the LLM sees the full surrounding context.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Index small chunks but return parents at retrieval time. Use a {child_id: parent_id} map; retrieve children by TF-IDF, then dereference to the full parent for context.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Parent-document retrieval by hand
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Build 5 parent documents from df_reviews (concat 4 reviews each)
parents = []
for i in range(0, 20, 4):
    parents.append(" | ".join(df_reviews["text"].iloc[i:i+4].tolist()))

# Split each parent into small "child" chunks
children = []
child_to_parent = []
for pid, p in enumerate(parents):
    for i in range(0, len(p), 80):
        children.append(p[i:i+80])
        child_to_parent.append(pid)

# Index the children
vec = TfidfVectorizer(ngram_range=(1,2)).fit(children)
X = vec.transform(children)

def parent_retrieve(q, k=2):
    sims = cosine_similarity(vec.transform([q]), X).ravel()
    top_children = np.argsort(-sims)[:k*3]   # over-retrieve children
    seen = []
    for ci in top_children:
        pid = child_to_parent[ci]
        if pid not in seen:
            seen.append(pid)
        if len(seen) == k:
            break
    return [(pid, parents[pid]) for pid in seen]

for pid, ptext in parent_retrieve("battery and charging"):
    print(f"--- parent {pid} ({len(ptext)} chars) ---")
    print(ptext[:160])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Concatenates groups of four reviews into five synthetic "parents" — the long-form documents you would normally load from disk. 2) The inner loop slices each parent into 80-char children and records <code>child_to_parent[child_id] = parent_id</code> — same mapping <code>ParentDocumentRetriever</code> persists. 3) Only the <em>children</em> are indexed with TF-IDF — small, precise vectors. 4) <code>parent_retrieve(q, k)</code> over-retrieves children (<code>k*3</code>), then walks them in score order and emits each unique parent it sees — exactly the dereference step LangChain does after vector search.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Self-querying retriever</h2>
<p class="l-text">The LLM converts a natural-language question into <em>(filter, query)</em> automatically. Critical when your data has metadata: dates, ratings, products, regions.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.retrievers.self_query.base <span class="kw">import</span> SelfQueryRetriever
<span class="kw">from</span> langchain.chains.query_constructor.base <span class="kw">import</span> AttributeInfo

attrs = [
    <span class="fn">AttributeInfo</span>(name=<span class="str">"product"</span>,  description=<span class="str">"Product code (X1/X2/X3)"</span>, <span class="ty">type</span>=<span class="str">"string"</span>),
    <span class="fn">AttributeInfo</span>(name=<span class="str">"rating"</span>,   description=<span class="str">"Star rating 1-5"</span>,         <span class="ty">type</span>=<span class="str">"integer"</span>),
    <span class="fn">AttributeInfo</span>(name=<span class="str">"year"</span>,     description=<span class="str">"Year of review"</span>,          <span class="ty">type</span>=<span class="str">"integer"</span>),
]

sq = SelfQueryRetriever.<span class="fn">from_llm</span>(
    llm=<span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>),
    vectorstore=store,
    document_contents=<span class="str">"Customer review of a laptop product"</span>,
    metadata_field_info=attrs
)
docs = sq.<span class="fn">invoke</span>(<span class="str">"X3 reviews from 2025 with rating 1 or 2"</span>)
<span class="cm"># LLM emits filter: product=X3 AND year=2025 AND rating <= 2, then dense search.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>AttributeInfo(name, description, type)</code> teaches the LLM which metadata fields are available and what they mean — the description is what the LLM reads. 2) <code>SelfQueryRetriever.from_llm(llm=..., vectorstore=..., document_contents=..., metadata_field_info=attrs)</code> bundles the LLM-driven query constructor with the underlying vector store. 3) <code>sq.invoke("X3 reviews from 2025 with rating 1 or 2")</code> goes through two phases: the LLM parses the question into a structured filter (<code>product=X3 AND year=2025 AND rating&lt;=2</code>) plus a semantic query, then the vector store applies the filter first and ranks the remainder. 4) The result is a list of <code>Document</code>s that strictly obey the metadata constraints — no more "I asked for 2025 but got 2019" failures.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Self-querying = parse the question into (filter, semantic_query). Use regex to extract product, year, rating constraints; apply via pandas .query then TF-IDF rank. Same shape as SelfQueryRetriever.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Self-query retrieval via regex parsing
import re, random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

random.seed(0)
df = df_reviews.head(60).copy()
df["product"] = [random.choice(["X1","X2","X3"]) for _ in range(len(df))]
df["year"]    = [random.choice([2023,2024,2025])  for _ in range(len(df))]
df["rating"]  = [random.choice([1,2,3,4,5])       for _ in range(len(df))]

def parse(question):
    f = {}
    m = re.search(r"\b(X[123])\b", question)
    if m: f["product"] = m.group(1)
    m = re.search(r"\b(20\d{2})\b", question)
    if m: f["year"] = int(m.group(1))
    m = re.search(r"rating\s*(<=?|=)\s*(\d)", question)
    if m: f["rating_max"] = int(m.group(2))
    semantic = re.sub(r"X[123]|20\d{2}|rating.*", "", question).strip()
    return f, semantic or "review"

def self_query(question, k=4):
    flt, sem = parse(question)
    sub = df.copy()
    if "product" in flt:    sub = sub[sub["product"] == flt["product"]]
    if "year" in flt:       sub = sub[sub["year"] == flt["year"]]
    if "rating_max" in flt: sub = sub[sub["rating"] <= flt["rating_max"]]
    if sub.empty: return flt, []
    vec = TfidfVectorizer().fit(sub["text"])
    sims = cosine_similarity(vec.transform([sem]), vec.transform(sub["text"])).ravel()
    top = np.argsort(-sims)[:k]
    return flt, sub.iloc[top][["product","year","rating","text"]].values.tolist()

flt, hits = self_query("X3 reviews from 2025 with rating <= 2")
print("filter:", flt)
for h in hits[:3]: print(h)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Synthetic <code>product</code> / <code>year</code> / <code>rating</code> columns are attached to <code>df_reviews</code> so the example has metadata worth filtering on. 2) <code>parse(question)</code> stands in for the LLM query constructor: regex picks <code>X[123]</code>, a year, and a <code>rating &lt;=/=</code> threshold; the leftover text becomes the semantic query. 3) <code>self_query(question, k)</code> first applies the structured filter via pandas slicing, then ranks the survivors with TF-IDF — the same "filter first, search second" order LangChain runs. 4) Printing <code>flt</code> next to the hits makes the structured-vs-semantic split visible, which is how you would also debug a misbehaving <code>SelfQueryRetriever</code>.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Evaluation — RAGAS, ARES, Phoenix</h2>
<p class="l-text">"Looks good in dev" is not enough. RAG quality must be measured on a held-out eval set.</p>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Metric</div><div>What it measures</div></div>
<div class="cmp-row"><div>faithfulness</div><div>Answer is supported by retrieved context (no hallucination)</div></div>
<div class="cmp-row"><div>answer_relevancy</div><div>Answer addresses the question</div></div>
<div class="cmp-row"><div>context_precision</div><div>Retrieved chunks are relevant (not noisy)</div></div>
<div class="cmp-row"><div>context_recall</div><div>All facts needed for the answer were retrieved</div></div>
<div class="cmp-row"><div>answer_correctness</div><div>Vs gold answer (semantic + factual)</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> ragas <span class="kw">import</span> evaluate
<span class="kw">from</span> ragas.metrics <span class="kw">import</span> faithfulness, answer_relevancy, context_precision

result = <span class="fn">evaluate</span>(eval_dataset, metrics=[
    faithfulness, answer_relevancy, context_precision
])
<span class="fn">print</span>(result.<span class="fn">to_pandas</span>().<span class="fn">mean</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>eval_dataset</code> is a small <code>{question, answer, contexts, ground_truth}</code> table — RAGAS computes each metric per row using a judge LLM. 2) The <code>metrics</code> list opts into the three core RAG checks: faithfulness, answer relevancy, and context precision. 3) <code>evaluate(...)</code> runs each metric for every row and returns a <code>Result</code> object with per-row and aggregate scores. 4) <code>result.to_pandas().mean()</code> collapses to one scalar per metric — the regression dashboard you watch when you change chunk size, reranker, or prompt.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RAGAS metrics reduce to set-overlap math. Compute context_precision (relevant docs / retrieved) and context_recall (relevant docs retrieved / all relevant) on a tiny eval set — the actual definitions, no LLM needed.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># RAGAS-style metrics from scratch
import pandas as pd

eval_set = [
    # (question, retrieved_docs, gold_relevant_docs)
    ("X3 charging speed",   [1,2,3,4], [1,3]),
    ("battery life X1",     [5,1,7,8], [1,5]),
    ("OLED display X2",     [4,9,2,6], [4]),
    ("price comparison",    [10,11,12,13], [10,11,12]),
]

def precision(retrieved, relevant):
    if not retrieved: return 0.0
    return len(set(retrieved) & set(relevant)) / len(retrieved)

def recall(retrieved, relevant):
    if not relevant:  return 0.0
    return len(set(retrieved) & set(relevant)) / len(relevant)

rows = []
for q, ret, rel in eval_set:
    rows.append({"question": q,
                 "context_precision": precision(ret, rel),
                 "context_recall":    recall(ret, rel)})

scores = pd.DataFrame(rows)
print(scores)
print("\nMEAN:", scores[["context_precision","context_recall"]].mean().round(3).to_dict())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>eval_set</code> mirrors the RAGAS row shape with three fields per case: question, retrieved doc ids, and the gold relevant ids. 2) <code>precision(retrieved, relevant)</code> = how many retrieved docs are in the gold set, divided by retrieved count — the "did we mostly fetch the right things?" check. 3) <code>recall(retrieved, relevant)</code> = how many gold docs were actually retrieved, divided by gold count — the "did we miss any?" check. 4) Averaging gives the same headline numbers RAGAS reports under <code>context_precision</code> and <code>context_recall</code> — the LLM judge in production adds gradations these set-theoretic versions skip.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Production RAG ablation — illustrative gains</h2>
<div id="lc-l10-abl-en" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var stages=['baseline','+ rerank','+ multi-query','+ HyDE','+ parent-doc','+ self-query'];
  var ans=[71,79,83,85,88,91];
  var data=[{type:'scatter',mode:'lines+markers',x:stages,y:ans,
    line:{color:T,width:3},marker:{size:14,color:T}}];
  var layout={title:'Cumulative answer correctness — incremental RAG upgrades',
    xaxis:{title:'pipeline stage'},yaxis:{title:'answer correctness (%)',range:[60,100]},
    margin:{l:60,r:30,t:60,b:80},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l10-abl-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L11 takes the chain to <strong>production</strong> — LangServe, observability with LangSmith, semantic caching, and cost optimization.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> Vanilla RAG (embed → top-K → bağlamı doldur → cevap) sizi doğru cevapların %70-75'ine taşır. %90'ı aşmak bir yükseltme kiti gerektirir: <strong>reranker, multi-query, HyDE, parent-document retrieval, self-query ve titiz değerlendirme</strong>. Bu ders, üretim seviyesi RAG göndermek için uygulamacının kontrol listesidir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Vektör retrieval'in üstüne cross-encoder reranker (Cohere, BGE) eklemeyi</li>
<li>Recall'u artırmak için <code>MultiQueryRetriever</code> ile sorgu varyantları üretmeyi</li>
<li>Sparse-sorgu alanları için HyDE (Hypothetical Document Embeddings) uygulamayı</li>
<li><code>ParentDocumentRetriever</code> ile küçük chunk'ları embed edip büyük bağlamı enjekte etmeyi</li>
<li>Doğal soruları metadata filtrelerine çeviren <code>SelfQueryRetriever</code> kurmayı</li>
<li>RAG'i RAGAS metrikleriyle değerlendirmeyi: faithfulness, answer relevance, context precision</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Vanilla RAG neden başarısız olur</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Kötü sorgu → kötü recall</div><div class="calc-card-desc">Kullanıcı ifadesi corpus'tan farklı. Çözüm: multi-query / HyDE.</div></div>
<div class="calc-card"><div class="calc-card-title">Top-K gürültülü</div><div class="calc-card-desc">5 aday, 2'si alakasız. Çözüm: cross-encoder reranker.</div></div>
<div class="calc-card"><div class="calc-card-title">Chunk çok küçük</div><div class="calc-card-desc">Çekilen chunk isabetli ama çevre bağlam eksik. Çözüm: parent-document retrieval.</div></div>
<div class="calc-card"><div class="calc-card-title">Filtre yok sayıldı</div><div class="calc-card-desc">"2025 yorumlarını göster" — ama tarih filtresi uygulanmadı. Çözüm: self-query retriever.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Cross-encoder ile reranking</h2>
<p class="l-text">Embedding'ler <strong>bi-encoder</strong>'dır: sorgu ve belge bağımsız kodlanır, sonra kosinüsle karşılaştırılır. Hızlı ama kayıplı. <strong>Cross-encoder</strong> (sorgu, belge)'yi tek çift olarak alır ve anlamsal eşleşmeyi skorlar — çok daha doğru ama çift başına ~50× daha yavaş, bu yüzden sadece top 50-100 aday üzerinde çalıştırırız.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_cohere <span class="kw">import</span> CohereRerank
<span class="kw">from</span> langchain.retrievers <span class="kw">import</span> ContextualCompressionRetriever

reranker = <span class="fn">CohereRerank</span>(model=<span class="str">"rerank-english-v3.0"</span>, top_n=<span class="num">4</span>)
base = store.<span class="fn">as_retriever</span>(search_kwargs={<span class="str">"k"</span>: <span class="num">25</span>})

retriever = <span class="fn">ContextualCompressionRetriever</span>(
    base_retriever=base, base_compressor=reranker
)
docs = retriever.<span class="fn">invoke</span>(<span class="str">"X3 firmware güncelleme sorunları"</span>)
<span class="cm"># Cohere reranker 25 adayı yeniden skorlar, en iyi 4'ü döndürür.</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>CohereRerank(model="rerank-english-v3.0", top_n=4)</code> Cohere'in hosted cross-encoder'ını herhangi bir LangChain retriever'ına takılabilir hale getirir. 2) Temel retriever sonunda istediğinizden daha geniş bir aday havuzu çeker (<code>k=25</code>) — reranker'ın seçim yapabilmesi için seçenek lazımdır. 3) <code>ContextualCompressionRetriever(base_retriever=..., base_compressor=reranker)</code> temel aramayı yapar, adayları reranker'a verir ve yalnızca top-N'i döndürür. 4) <code>retriever.invoke(query)</code> normal bir retriever çağrısıyla birebir aynı görünür — rerank aşaması zincirin geri kalanı için görünmezdir.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Cross-encoder, (sorgu, belge)'yi birlikte yeniden skorlar. Bunu daha güçlü karakter+kelime TF-IDF özelliğiyle yaklaş: bi-encoder ile top-25 çek, sonra ağır skorla yeniden sırala. Aynı iki aşamalı desen.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># İki aşamalı retrieve -> rerank
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(60).tolist()

# Aşama 1: ucuz "bi-encoder" (kelime TF-IDF, top-25)
v1 = TfidfVectorizer().fit(texts); X1 = v1.transform(texts)
def stage1(q, k=25):
    sims = cosine_similarity(v1.transform([q]), X1).ravel()
    return list(np.argsort(-sims)[:k]), sims

# Aşama 2: ağır "cross-encoder" (25 üzerinde karakter-ngram TF-IDF)
v2 = TfidfVectorizer(analyzer="char_wb", ngram_range=(3,5)).fit(texts)
X2 = v2.transform(texts)
def rerank(q, candidates, top_n=4):
    sims = cosine_similarity(v2.transform([q]), X2[candidates]).ravel()
    order = np.argsort(-sims)[:top_n]
    return [(candidates[i], float(sims[i])) for i in order]

q = "laptopta pil sorunları"
cand, _ = stage1(q)
print("aşama1 top-5:", cand[:5])
print("\naşama2 yeniden sıralanmış top-4:")
for idx, s in rerank(q, cand):
    print(f"  {s:.3f} -> {texts[idx][:70]}")</code></pre></div>
<p class="l-text"><strong>Burada dört önemli detay var:</strong> 1) Aşama 1 ucuz bir kelime seviyesi TF-IDF indeksi kurar ve <code>stage1(q, k=25)</code> top-25'i döndürür — FAISS bi-encoder retriever'ıyla aynı rolde. 2) Aşama 2 daha ağır bir karakter-n-gram TF-IDF indeksi kurar ve yalnızca 25 aday için danışılır — cross-encoder rerank ile aynı rolde. 3) <code>rerank(q, candidates, top_n=4)</code> yalnızca aday alt kümesini skorlar (<code>X2[candidates]</code>) ve en iyi dördü döndürür — asimetrik maliyet, üretimde tüm corpus yerine küçük bir havuzun rerank edilmesinin sebebidir. 4) İki çıktı aşama 1 ile aşama 2 arasındaki sıra değişimini gösterir — reranker'ların getirdiği değerin kanıtıdır.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Multi-query retrieval</h2>
<p class="l-text">Fikir: LLM'e kullanıcı sorgusunu 3-5 farklı şekilde yeniden yazdırın, her biri için retrieve edin, sonra tekilleştirin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.retrievers.multi_query <span class="kw">import</span> MultiQueryRetriever
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

multi = MultiQueryRetriever.<span class="fn">from_llm</span>(
    retriever=store.<span class="fn">as_retriever</span>(),
    llm=<span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
)
docs = multi.<span class="fn">invoke</span>(<span class="str">"Müşteriler X3'e neden kızgın?"</span>)

<span class="cm"># İçeride üretilen sorgular:</span>
<span class="cm">#   1. "X3 müşteri şikayetleri"</span>
<span class="cm">#   2. "X3 olumsuz yorumları"</span>
<span class="cm">#   3. "X3 kalite sorunları"</span>
<span class="cm"># Her biri K belge çeker; birleşim döndürülür.</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>MultiQueryRetriever.from_llm(retriever=..., llm=...)</code> herhangi bir retriever'ın önüne paraphrase üreten bir LLM yerleştirir. 2) <code>.invoke(question)</code> çağrısında LLM 3-5 alternatif ifade üretir (yorumda örnekler) — her biri aynı niyetin farklı bir açısını yakalar. 3) Her varyant temel retriever'dan geçer ve hit'lerin birleşimi döndürülür — belge id'siyle tekilleştirilir. 4) Maliyet sorgu başına bir ekstra LLM çağrısıdır; kullanıcı ifadesi corpus kelime hazinesinden farklı olduğunda kazanılan recall karşılığında ödenir.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Multi-query, "3 farklı ifade kullan, hit'leri birleştir" demektir. LLM'i el yapımı paraphrase listesiyle değiştir — recall artışı sorgu çeşitliliğinden gelir, LLM'in kendisinden değil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Multi-query retrieval (LLM yerine paraphrase)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(80).tolist()
vec = TfidfVectorizer(ngram_range=(1,2)).fit(texts)
X = vec.transform(texts)

def retrieve(q, k=4):
    sims = cosine_similarity(vec.transform([q]), X).ravel()
    return list(np.argsort(-sims)[:k]), sims

# El yapımı "multi-query"
queries = [
    "Müşteriler X3'e neden kızgın?",
    "X3 müşteri şikayetleri",
    "X3 olumsuz yorumları",
    "X3 kalite sorunları",
]

union = set()
for q in queries:
    idxs, _ = retrieve(q, k=3)
    union.update(idxs)
    print(f"  '{q[:40]}' -> {idxs}")

print(f"\nbirleşimden gelen tekil belge: {len(union)}")
print("ilk 3:", [texts[i][:60] for i in list(union)[:3]])</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Dört elemanlı <code>queries</code> listesi LLM yeniden yazıcının yerine geçer — orijinal soru artı aynı niyetin üç el yapımı paraphrase'i. 2) <code>retrieve(q, k=3)</code> her varyant için TF-IDF indeksini çalıştırır ve top-3 belge indekslerini döndürür. 3) <code>union.update(idxs)</code> varyantlar boyunca tekilleştirilmiş bir küme biriktirir — <code>MultiQueryRetriever</code>'ın LLM yeniden yazma adımından sonra yaptığının aynısı. 4) Son print <code>len(union)</code>'in herhangi tek bir varyantın top-3'ünden büyük olduğunu gösterir — recall artışı multi-query'nin asıl amacıdır.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. HyDE — Hipotetik Belge Embedding'i</h2>
<p class="l-text">Sezgilere ters bir hile: LLM'e sorgu için <em>sahte bir cevap yazdırın</em>, o sahte cevabı embed edin ve indeksi onunla arayın. Sahte cevap, çıplak soruya kıyasla embedding uzayında gerçek cevaba daha yakındır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableLambda
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI, OpenAIEmbeddings

write = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
emb   = <span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>)

<span class="kw">def</span> <span class="fn">hyde_search</span>(query, k=<span class="num">4</span>):
    fake = write.<span class="fn">invoke</span>(
        f<span class="str">"Şu soruya hipotetik 100 kelimelik bir cevap yaz: {query}"</span>
    ).content
    fake_vec = emb.<span class="fn">embed_query</span>(fake)
    <span class="kw">return</span> store.<span class="fn">similarity_search_by_vector</span>(fake_vec, k=k)

<span class="fn">print</span>(<span class="fn">hyde_search</span>(<span class="str">"X3 şarj cihazı güvenli mi?"</span>))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>write.invoke("Şu soruya hipotetik 100 kelimelik bir cevap yaz: ...")</code> LLM'e iyi bir cevabın nasıl görüneceğini uydurmasını söyler — olgusal doğruluk önemsizdir, yapısal makullük yardım eder. 2) <code>emb.embed_query(fake)</code> o sahte cevabı embedding uzayının <em>cevap</em> bölgesinde yaşayan bir vektöre çevirir — çıplak soruya kıyasla gerçek cevaplara daha yakındır. 3) <code>store.similarity_search_by_vector(fake_vec, k=k)</code> sahte vektörü doğrudan kullanır, soruyu tamamen atlar. 4) Sonuç: soru metni ile cevap metninin çok farklı kelime hazinesi kullandığı yetersiz tanımlı veya seyrek sorgularda (hukuki, tıbbi, niş teknik) daha iyi recall.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">HyDE: soru yerine sahte bir cevapla ara. LLM yerine elle yazılmış hipotetik bir cümle kullan. Soru-vs-sahte cevap için kosinüs benzerliğini gerçek alakalı metne karşı karşılaştır — sahte genelde kazanır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># LLM olmadan HyDE
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(80).tolist()
vec = TfidfVectorizer(ngram_range=(1,2)).fit(texts)
X = vec.transform(texts)

soru = "Laptop şarj cihazı güvenli mi?"
hipotetik = ("Laptop şarj cihazı UL güvenlik sertifikasına sahiptir, "
             "aşırı akım koruması kullanır ve pil termal yönetimi "
             "hızlı şarj sırasında aşırı ısınmayı önler.")

def search(query_str, k=4):
    sims = cosine_similarity(vec.transform([query_str]), X).ravel()
    top = np.argsort(-sims)[:k]
    return [(round(sims[i], 3), texts[i]) for i in top]

print("=== çıplak soru ===")
for s, t in search(soru): print(s, "->", t[:70])

print("\n=== HyDE (sahte cevap sorgu olarak) ===")
for s, t in search(hipotetik): print(s, "->", t[:70])</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>soru</code> çıplak kullanıcı sorgusunu tutar; <code>hipotetik</code> ise LLM'in uyduracağı şeyin el yapımı bir karşılığını tutar — gerçek bir cevap <em>gibi görünen</em> üç cümle. 2) <code>search</code> aynı TF-IDF retrieval'ı her iki string üzerinde çalıştırır — tek fark sorgu metnidir, indeks değil. 3) İki çıktıyı karşılaştırmak, hipotetik cümlenin yeni olgusal sinyal içermese bile daha alakalı yorumları üste çektiğini gösterir. 4) Bu fark HyDE'nin kazancıdır — sorgunuz zaten uzun ve içerik zenginiyse kaybolur; bu yüzden HyDE en çok kısa sorularda işe yarar.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Parent-document retrieval</h2>
<p class="l-text">İsabetli retrieval için küçük chunk'lar (300 token) indeksleyin, ama cevap zamanı zengin bağlam için ana belgeyi (tam sayfa) çekin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.retrievers <span class="kw">import</span> ParentDocumentRetriever
<span class="kw">from</span> langchain.storage <span class="kw">import</span> InMemoryStore
<span class="kw">from</span> langchain_text_splitters <span class="kw">import</span> RecursiveCharacterTextSplitter

parent_splitter = <span class="fn">RecursiveCharacterTextSplitter</span>(chunk_size=<span class="num">2000</span>)
child_splitter  = <span class="fn">RecursiveCharacterTextSplitter</span>(chunk_size=<span class="num">300</span>)

retriever = <span class="fn">ParentDocumentRetriever</span>(
    vectorstore=store,
    docstore=<span class="fn">InMemoryStore</span>(),
    child_splitter=child_splitter,
    parent_splitter=parent_splitter,
)
retriever.<span class="fn">add_documents</span>(raw_docs)
docs = retriever.<span class="fn">invoke</span>(<span class="str">"ödeme adımında hata 502"</span>)  <span class="cm"># 2000-token parent döner</span></code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) İki splitter iki granülerliği ayarlar: bağlam için <code>parent_splitter</code> 2000 karakter, indeksleme isabeti için <code>child_splitter</code> 300 karakter. 2) <code>ParentDocumentRetriever(vectorstore=..., docstore=InMemoryStore(), ...)</code> child'ları <code>vectorstore</code>'a embed ederken parent'ları <code>docstore</code>'da parent_id referansıyla saklar. 3) <code>retriever.add_documents(raw_docs)</code> iki bölmeyi de çalıştırır ve çapraz referansları otomatik kaydeder. 4) <code>retriever.invoke(query)</code> keskin recall için <em>child</em>'lar üzerinde vektör araması yapar, sonra her hit'i döndürmeden önce parent'ına dereference eder — LLM tam çevre bağlamı görür.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük chunk'ları indeksle ama retrieval'da ana belgeleri döndür. {child_id: parent_id} eşlemesi kullan; child'ları TF-IDF ile çek, sonra bağlam için tam parent'a bağla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Parent-document retrieval, el yapımı
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# df_reviews'tan 5 ana belge oluştur (her birinde 4 yorum birleşik)
parents = []
for i in range(0, 20, 4):
    parents.append(" | ".join(df_reviews["text"].iloc[i:i+4].tolist()))

# Her parent'ı küçük "child" parçalara böl
children = []
child_to_parent = []
for pid, p in enumerate(parents):
    for i in range(0, len(p), 80):
        children.append(p[i:i+80])
        child_to_parent.append(pid)

# Child'ları indeksle
vec = TfidfVectorizer(ngram_range=(1,2)).fit(children)
X = vec.transform(children)

def parent_retrieve(q, k=2):
    sims = cosine_similarity(vec.transform([q]), X).ravel()
    top_children = np.argsort(-sims)[:k*3]   # fazla çek
    seen = []
    for ci in top_children:
        pid = child_to_parent[ci]
        if pid not in seen:
            seen.append(pid)
        if len(seen) == k:
            break
    return [(pid, parents[pid]) for pid in seen]

for pid, ptext in parent_retrieve("pil ve şarj"):
    print(f"--- parent {pid} ({len(ptext)} char) ---")
    print(ptext[:160])</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Dört yorum grupları beş yapay "parent"'a birleştirilir — normalde diskten yükleyeceğiniz uzun belgeler. 2) İçteki döngü her parent'ı 80 karakterlik child'lara böler ve <code>child_to_parent[child_id] = parent_id</code> kaydeder — <code>ParentDocumentRetriever</code>'ın kalıcılaştırdığı aynı eşleme. 3) Yalnızca <em>child</em>'lar TF-IDF ile indekslenir — küçük, isabetli vektörler. 4) <code>parent_retrieve(q, k)</code> child'ları fazla çeker (<code>k*3</code>), sonra skor sırasıyla gezer ve gördüğü her tekil parent'ı yayar — LangChain'in vektör aramasından sonra yaptığı tam dereference adımı.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Self-querying retriever</h2>
<p class="l-text">LLM, doğal dil sorusunu otomatik olarak <em>(filtre, sorgu)</em>'ya dönüştürür. Verinizde metadata olduğunda kritik: tarih, puan, ürün, bölge.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain.retrievers.self_query.base <span class="kw">import</span> SelfQueryRetriever
<span class="kw">from</span> langchain.chains.query_constructor.base <span class="kw">import</span> AttributeInfo

attrs = [
    <span class="fn">AttributeInfo</span>(name=<span class="str">"product"</span>,  description=<span class="str">"Ürün kodu (X1/X2/X3)"</span>, <span class="ty">type</span>=<span class="str">"string"</span>),
    <span class="fn">AttributeInfo</span>(name=<span class="str">"rating"</span>,   description=<span class="str">"Yıldız puanı 1-5"</span>,      <span class="ty">type</span>=<span class="str">"integer"</span>),
    <span class="fn">AttributeInfo</span>(name=<span class="str">"year"</span>,     description=<span class="str">"Yorumun yılı"</span>,          <span class="ty">type</span>=<span class="str">"integer"</span>),
]

sq = SelfQueryRetriever.<span class="fn">from_llm</span>(
    llm=<span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>),
    vectorstore=store,
    document_contents=<span class="str">"Bir laptop ürününün müşteri yorumu"</span>,
    metadata_field_info=attrs
)
docs = sq.<span class="fn">invoke</span>(<span class="str">"2025'ten X3 yorumları, puan 1 veya 2"</span>)
<span class="cm"># LLM filtre üretir: product=X3 AND year=2025 AND rating <= 2, sonra yoğun arama.</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>AttributeInfo(name, description, type)</code> LLM'e hangi metadata alanlarının mevcut olduğunu ve ne anlama geldiğini öğretir — description LLM'in okuduğu şeydir. 2) <code>SelfQueryRetriever.from_llm(llm=..., vectorstore=..., document_contents=..., metadata_field_info=attrs)</code> LLM güdümlü sorgu kurucusunu altta yatan vektör deposuyla birleştirir. 3) <code>sq.invoke("2025'ten X3 yorumları, puan 1 veya 2")</code> iki aşamadan geçer: LLM soruyu yapılı bir filtreye (<code>product=X3 AND year=2025 AND rating&lt;=2</code>) ve semantik bir sorguya ayrıştırır, sonra vektör deposu önce filtreyi uygular ve kalanı sıralar. 4) Sonuç metadata kısıtlarına kesinkes uyan bir <code>Document</code> listesidir — artık "2025 istedim ama 2019 geldi" hataları yok.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Self-querying = soruyu (filtre, semantic_query)'ye ayrıştır. Regex ile ürün, yıl, puan kısıtlarını çıkar; pandas .query ile uygula sonra TF-IDF sırala. SelfQueryRetriever ile aynı şekil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Regex parsing ile self-query retrieval
import re, random
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

random.seed(0)
df = df_reviews.head(60).copy()
df["product"] = [random.choice(["X1","X2","X3"]) for _ in range(len(df))]
df["year"]    = [random.choice([2023,2024,2025])  for _ in range(len(df))]
df["rating"]  = [random.choice([1,2,3,4,5])       for _ in range(len(df))]

def parse(question):
    f = {}
    m = re.search(r"\b(X[123])\b", question)
    if m: f["product"] = m.group(1)
    m = re.search(r"\b(20\d{2})\b", question)
    if m: f["year"] = int(m.group(1))
    m = re.search(r"puan\s*(<=?|=)\s*(\d)", question)
    if m: f["rating_max"] = int(m.group(2))
    semantic = re.sub(r"X[123]|20\d{2}|puan.*", "", question).strip()
    return f, semantic or "yorum"

def self_query(question, k=4):
    flt, sem = parse(question)
    sub = df.copy()
    if "product" in flt:    sub = sub[sub["product"] == flt["product"]]
    if "year" in flt:       sub = sub[sub["year"] == flt["year"]]
    if "rating_max" in flt: sub = sub[sub["rating"] <= flt["rating_max"]]
    if sub.empty: return flt, []
    vec = TfidfVectorizer().fit(sub["text"])
    sims = cosine_similarity(vec.transform([sem]), vec.transform(sub["text"])).ravel()
    top = np.argsort(-sims)[:k]
    return flt, sub.iloc[top][["product","year","rating","text"]].values.tolist()

flt, hits = self_query("2025'ten X3 yorumları, puan <= 2")
print("filtre:", flt)
for h in hits[:3]: print(h)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Yapay <code>product</code> / <code>year</code> / <code>rating</code> sütunları <code>df_reviews</code>'a eklenir; böylece örneğin filtrelenmeye değer metadata'sı olur. 2) <code>parse(question)</code> LLM sorgu kurucunun yerine geçer: regex <code>X[123]</code>'ü, bir yılı ve bir <code>puan &lt;=/=</code> eşiğini yakalar; kalan metin semantik sorgu olur. 3) <code>self_query(question, k)</code> önce yapılı filtreyi pandas dilimleme ile uygular, sonra kalanları TF-IDF ile sıralar — LangChain'in çalıştırdığı "önce filtrele, sonra ara" sırasının aynısı. 4) <code>flt</code>'i hit'lerin yanında basmak yapısal-vs-semantik bölünmeyi görünür kılar; hatalı bir <code>SelfQueryRetriever</code>'ı da bu şekilde debug edersiniz.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Değerlendirme — RAGAS, ARES, Phoenix</h2>
<p class="l-text">"Geliştirmede iyi görünüyor" yetmez. RAG kalitesi ayrı bir eval setinde ölçülmelidir.</p>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Metrik</div><div>Ne ölçer</div></div>
<div class="cmp-row"><div>faithfulness</div><div>Cevap çekilen bağlam tarafından destekleniyor (halüsinasyon yok)</div></div>
<div class="cmp-row"><div>answer_relevancy</div><div>Cevap soruyu ele alıyor</div></div>
<div class="cmp-row"><div>context_precision</div><div>Çekilen chunk'lar alakalı (gürültülü değil)</div></div>
<div class="cmp-row"><div>context_recall</div><div>Cevap için gereken tüm olgular çekildi</div></div>
<div class="cmp-row"><div>answer_correctness</div><div>Altın cevaba kıyasla (anlamsal + olgusal)</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> ragas <span class="kw">import</span> evaluate
<span class="kw">from</span> ragas.metrics <span class="kw">import</span> faithfulness, answer_relevancy, context_precision

result = <span class="fn">evaluate</span>(eval_dataset, metrics=[
    faithfulness, answer_relevancy, context_precision
])
<span class="fn">print</span>(result.<span class="fn">to_pandas</span>().<span class="fn">mean</span>())</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>eval_dataset</code> küçük bir <code>{soru, cevap, contexts, ground_truth}</code> tablosudur — RAGAS her satır için bir judge LLM kullanarak her metriği hesaplar. 2) <code>metrics</code> listesi üç temel RAG kontrolüne abone olur: faithfulness, answer relevancy ve context precision. 3) <code>evaluate(...)</code> her metriği her satır için çalıştırır ve satır başına ve toplu skorları olan bir <code>Result</code> nesnesi döndürür. 4) <code>result.to_pandas().mean()</code> metrik başına tek skalere düşer — chunk boyutu, reranker veya prompt değiştirdiğinizde izlediğiniz regresyon panosu.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RAGAS metrikleri küme kesişim matematiğine indirgenir. Minik bir eval setinde context_precision (alakalı / çekilen) ve context_recall (çekilen alakalı / tüm alakalı) hesapla — gerçek tanımlar, LLM gerekmez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Sıfırdan RAGAS-tarzı metrikler
import pandas as pd

eval_set = [
    # (soru, çekilen_belgeler, altın_alakalı_belgeler)
    ("X3 şarj hızı",         [1,2,3,4],     [1,3]),
    ("X1 pil ömrü",          [5,1,7,8],     [1,5]),
    ("X2 OLED ekran",        [4,9,2,6],     [4]),
    ("fiyat karşılaştırma",  [10,11,12,13], [10,11,12]),
]

def precision(retrieved, relevant):
    if not retrieved: return 0.0
    return len(set(retrieved) & set(relevant)) / len(retrieved)

def recall(retrieved, relevant):
    if not relevant:  return 0.0
    return len(set(retrieved) & set(relevant)) / len(relevant)

rows = []
for q, ret, rel in eval_set:
    rows.append({"soru": q,
                 "context_precision": precision(ret, rel),
                 "context_recall":    recall(ret, rel)})

scores = pd.DataFrame(rows)
print(scores)
print("\nORTALAMA:", scores[["context_precision","context_recall"]].mean().round(3).to_dict())</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>eval_set</code> RAGAS satır şeklini yansıtır: vaka başına üç alan — soru, çekilen belge id'leri ve altın alakalı id'ler. 2) <code>precision(retrieved, relevant)</code> = çekilen belgelerden kaç tanesinin altın kümede olduğu, çekilen sayısına bölünür — "çoğunlukla doğru şeyleri mi çektik?" kontrolü. 3) <code>recall(retrieved, relevant)</code> = altın belgelerden kaç tanesinin gerçekten çekildiği, altın sayısına bölünür — "atladığımız var mı?" kontrolü. 4) Ortalama almak RAGAS'ın <code>context_precision</code> ve <code>context_recall</code> altında bildirdiği aynı manşet sayılarını verir — üretimdeki LLM judge'ı bu küme-teorik versiyonların atladığı dereceleri ekler.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Üretim RAG ablation — örnek kazançlar</h2>
<div id="lc-l10-abl-tr" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var stages=['taban','+ rerank','+ multi-query','+ HyDE','+ parent-doc','+ self-query'];
  var ans=[71,79,83,85,88,91];
  var data=[{type:'scatter',mode:'lines+markers',x:stages,y:ans,
    line:{color:T,width:3},marker:{size:14,color:T}}];
  var layout={title:'Birikimli cevap doğruluğu — kademeli RAG yükseltmeleri',
    xaxis:{title:'hat aşaması'},yaxis:{title:'cevap doğruluğu (%)',range:[60,100]},
    margin:{l:60,r:30,t:60,b:80},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l10-abl-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L11 chain'i <strong>üretime</strong> taşıyor — LangServe, LangSmith ile gözlemlenebilirlik, semantik önbellek ve maliyet optimizasyonu.</p>
</div>
`
};
