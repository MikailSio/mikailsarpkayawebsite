window.LANGCHAIN_L6 = {
en: `<p class="l-text"><strong>Hook.</strong> An LLM that has never read your customer reviews cannot answer questions about them. Worse — it will make answers up. <strong>RAG</strong> (Retrieval-Augmented Generation) is the dominant pattern that fixes this: at query time, fetch the most relevant chunks from your data, paste them into the prompt, then let the LLM compose a grounded answer. RAG turns a generic chat model into a domain-specific assistant without any fine-tuning.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Wire the four RAG steps: load → split → embed → retrieve into one LCEL chain</li>
<li>Compare RAG against fine-tuning on cost, freshness, and citation requirements</li>
<li>Build a stuff-prompt RAG over customer reviews with <code>create_retrieval_chain</code></li>
<li>Add inline citations from <code>Document.metadata</code> to the model output</li>
<li>Switch retrievers (FAISS vs BM25 vs hybrid) without rewriting downstream chain code</li>
<li>Detect hallucination by comparing model claims against retrieved context</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Why RAG and not fine-tuning?</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Property</div><div>Fine-tuning</div><div>RAG</div></div>
<div class="cmp-row"><div>Knowledge updates</div><div>Re-train</div><div>Update index in seconds</div></div>
<div class="cmp-row"><div>Citations</div><div>Hallucinated</div><div>Real document IDs</div></div>
<div class="cmp-row"><div>Cost</div><div>$$$ per epoch</div><div>$ per query</div></div>
<div class="cmp-row"><div>Privacy</div><div>Data baked in</div><div>Data stays in your store</div></div>
<div class="cmp-row"><div>Style adaptation</div><div>Strong</div><div>Weak (still good w/ system prompt)</div></div>
</div>
<p class="l-text">Verdict: RAG for facts, fine-tuning for style/format. They combine well.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. RAG architecture</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1.</strong> User query → embed.</div>
<div class="calc-step"><strong>2.</strong> Vector store search → top-K candidate chunks.</div>
<div class="calc-step"><strong>3. (Optional)</strong> Reranker rescores candidates with a cross-encoder.</div>
<div class="calc-step"><strong>4.</strong> Build context: "Here are the docs: ... User question: ... Answer using only the docs."</div>
<div class="calc-step"><strong>5.</strong> LLM call → grounded answer with citations.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Chunking strategy</h2>
<p class="l-text">An LLM has a finite context. You cannot dump your whole knowledge base every call. Chunking splits documents so retrieval is precise and cheap.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Fixed-size</div><div class="calc-card-desc">e.g. 500 chars + 50 overlap. Simple, robust default.</div></div>
<div class="calc-card"><div class="calc-card-title">Recursive</div><div class="calc-card-desc">Try paragraphs → sentences → words. Respects natural boundaries.</div></div>
<div class="calc-card"><div class="calc-card-title">Semantic</div><div class="calc-card-desc">Group sentences by embedding similarity. Best quality, more expensive.</div></div>
<div class="calc-card"><div class="calc-card-title">Markdown / heading</div><div class="calc-card-desc">Use # / ## as natural splits for docs.</div></div>
</div>
<p class="l-text">Tradeoff: small chunks = precise retrieval but lost context; big chunks = more context but lower precision. Start at ~500 tokens with ~10% overlap.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Hybrid retrieval (BM25 + dense)</h2>
<p class="l-text">Dense embeddings catch semantic matches; BM25 catches exact keywords (product codes, names, error messages). Combine them with reciprocal rank fusion: score = Σ 1/(k + rank_i).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.retrievers <span class="kw">import</span> BM25Retriever
<span class="kw">from</span> langchain.retrievers <span class="kw">import</span> EnsembleRetriever

bm25  = BM25Retriever.<span class="fn">from_texts</span>(texts, metadatas=metas)
dense = store.<span class="fn">as_retriever</span>(search_kwargs={<span class="str">"k"</span>: <span class="num">5</span>})

hybrid = <span class="fn">EnsembleRetriever</span>(retrievers=[bm25, dense], weights=[<span class="num">0.4</span>, <span class="num">0.6</span>])
docs = hybrid.<span class="fn">invoke</span>(<span class="str">"error code 502 in checkout"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>BM25Retriever.from_texts(texts, metadatas=metas)</code> builds a lexical retriever that ranks by BM25 term-overlap — perfect for product codes and error strings. 2) <code>store.as_retriever(search_kwargs={"k": 5})</code> exposes the dense FAISS index as a Runnable that returns top-5 semantically similar docs. 3) <code>EnsembleRetriever(retrievers=[bm25, dense], weights=[0.4, 0.6])</code> fuses the two ranked lists with reciprocal rank fusion (RRF), weighted to favour the dense side. 4) <code>hybrid.invoke(query)</code> returns a single deduplicated list of <code>Document</code>s that combines both views — the best balance of exact-match and semantic recall.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Reciprocal rank fusion (RRF) is just summing 1/(k+rank) across rankers. Run two rankers (TF-IDF char + word) and merge — no LangChain needed to see the math.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Hybrid retrieval via reciprocal rank fusion
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(50).tolist()

# Two "rankers": word tf-idf and char tf-idf
v_word = TfidfVectorizer().fit(texts)
v_char = TfidfVectorizer(analyzer="char_wb", ngram_range=(3,5)).fit(texts)
M_w = v_word.transform(texts); M_c = v_char.transform(texts)

def rank(query, vec, M, top=5):
    sims = cosine_similarity(vec.transform([query]), M).ravel()
    return list(np.argsort(-sims)[:top])

def rrf(rankings, k=60):
    score = {}
    for r in rankings:
        for rank_pos, idx in enumerate(r):
            score[idx] = score.get(idx, 0) + 1.0 / (k + rank_pos)
    return sorted(score.items(), key=lambda x: -x[1])

q = "battery 502 error"
fused = rrf([rank(q, v_word, M_w), rank(q, v_char, M_c)])
for idx, s in fused[:4]:
    print(f"{s:.4f}", texts[idx][:70])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds two complementary TF-IDF "rankers" — word n-grams catch semantic overlap, character n-grams catch typos and morphological variants. 2) <code>rank(query, vec, M)</code> returns the indices of the top-k docs for one ranker, sorted by cosine similarity. 3) <code>rrf(rankings, k=60)</code> implements reciprocal rank fusion: each doc gets <code>1/(k + rank_position)</code> from every list, then totals are summed and re-sorted. 4) The <code>k=60</code> constant flattens the contribution curve so good docs at rank 10 still matter — the same default LangChain's <code>EnsembleRetriever</code> uses.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. End-to-end RAG over df_reviews (runnable retrieval part)</h2>
<p class="l-text">Below is a complete retrieval flow you can run in Pyodide. We replace the LLM call with a simple template that shows what would be sent — in production you swap in <code>ChatOpenAI</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

df_reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"id"</span>: <span class="fn">range</span>(<span class="num">1</span>, <span class="num">11</span>),
    <span class="str">"product"</span>: [<span class="str">"X1"</span>,<span class="str">"X1"</span>,<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X2"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>],
    <span class="str">"text"</span>: [
        <span class="str">"X1 battery lasts 12 hours, very impressive."</span>,
        <span class="str">"X1 keyboard flexes under typing pressure."</span>,
        <span class="str">"X1 screen calibration is poor out of the box."</span>,
        <span class="str">"X2 has a beautiful OLED display, deep blacks."</span>,
        <span class="str">"X2 fan noise is loud during gaming."</span>,
        <span class="str">"X2 build quality feels premium."</span>,
        <span class="str">"X3 charges from 0 to 80% in 30 minutes."</span>,
        <span class="str">"X3 customer support was unresponsive for two weeks."</span>,
        <span class="str">"X3 firmware update bricked my unit."</span>,
        <span class="str">"X3 webcam quality is mediocre."</span>
    ]
})

<span class="cm"># Index</span>
vec = <span class="fn">TfidfVectorizer</span>(ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">1</span>).<span class="fn">fit</span>(df_reviews[<span class="str">"text"</span>])
X = vec.<span class="fn">transform</span>(df_reviews[<span class="str">"text"</span>])

<span class="kw">def</span> <span class="fn">retrieve</span>(query, k=<span class="num">4</span>):
    q = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(q, X).<span class="fn">ravel</span>()
    top = np.<span class="fn">argsort</span>(-sims)[:k]
    <span class="kw">return</span> df_reviews.iloc[top].<span class="fn">assign</span>(score=sims[top].<span class="fn">round</span>(<span class="num">3</span>))

<span class="kw">def</span> <span class="fn">build_prompt</span>(query, hits):
    ctx = <span class="str">"\\n"</span>.<span class="fn">join</span>([f<span class="str">"[doc {r.id} | {r.product}] {r.text}"</span>
                      <span class="kw">for</span> r <span class="kw">in</span> hits.<span class="fn">itertuples</span>()])
    <span class="kw">return</span> f<span class="str">"""You are an analyst. Use ONLY the docs to answer.
If the answer is not in the docs, say "I do not know."

# Docs
{ctx}

# Question
{query}

# Answer (cite [doc N]):"""</span>

q = <span class="str">"What are the main complaints about X3?"</span>
hits = <span class="fn">retrieve</span>(q, k=<span class="num">4</span>)
<span class="fn">print</span>(hits)
<span class="fn">print</span>(<span class="str">"\\n--- PROMPT THAT WOULD BE SENT TO LLM ---"</span>)
<span class="fn">print</span>(<span class="fn">build_prompt</span>(q, hits))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a small <code>df_reviews</code> tagged with a <code>product</code> column so retrieval results can carry useful filter metadata. 2) <code>retrieve(query, k=4)</code> mirrors a vector-store search: TF-IDF the query, cosine against the corpus, slice the top-k rows. 3) <code>build_prompt(query, hits)</code> assembles the classic stuff-prompt: a "use ONLY the docs" rule, the bracketed doc context, the user question, and a forced citation format. 4) The printed prompt is exactly what an LLM call (<code>chain.invoke({...})</code>) would receive — only the model call itself is omitted.</p>
<p class="l-text"><strong>What it does:</strong> retrieves the 4 reviews most relevant to a product-specific question, then assembles a grounded prompt. The model is forced to cite document IDs, eliminating made-up answers.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. The same with LangChain (demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> OpenAIEmbeddings, ChatOpenAI
<span class="kw">from</span> langchain_community.vectorstores <span class="kw">import</span> FAISS
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnablePassthrough
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser

emb = <span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>)
store = FAISS.<span class="fn">from_texts</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">tolist</span>(), emb,
                         metadatas=df_reviews.<span class="fn">to_dict</span>(<span class="str">"records"</span>))
retriever = store.<span class="fn">as_retriever</span>(search_kwargs={<span class="str">"k"</span>: <span class="num">4</span>})

prompt = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"""Use ONLY the docs to answer. Cite [doc N].
Docs:
{context}

Question: {question}
Answer:"""</span>)

<span class="kw">def</span> <span class="fn">fmt</span>(docs):
    <span class="kw">return</span> <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"[doc {d.metadata['id']}] {d.page_content}"</span> <span class="kw">for</span> d <span class="kw">in</span> docs)

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)

rag_chain = (
    {<span class="str">"context"</span>: retriever | fmt, <span class="str">"question"</span>: <span class="fn">RunnablePassthrough</span>()}
    | prompt | llm | <span class="fn">StrOutputParser</span>()
)

<span class="fn">print</span>(rag_chain.<span class="fn">invoke</span>(<span class="str">"What are the main complaints about X3?"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a retrieval step (vector search → top-k docs) and a formatting step that joins doc texts into the prompt context. 2) Uses \`RunnableParallel\` / \`RunnablePassthrough\` to keep the user question alongside retrieved docs as the chain flows forward. 3) The full LCEL: \`{context: retriever, question: passthrough} | prompt | llm | parser\` — declarative, traceable, easy to swap pieces. 4) For production, add chunking, embeddings caching, reranking, and LangSmith tracing before declaring victory on RAG quality.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Full retrieval -> formatted context -> "answer" pipeline using TF-IDF and a heuristic answerer. The LLM is replaced by a function that summarizes top hits — same shape as retriever | format | llm | parser.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mini RAG pipeline (no LLM)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

docs = df_reviews.head(80).reset_index(drop=True)
vec = TfidfVectorizer(ngram_range=(1,2)).fit(docs["text"])
X   = vec.transform(docs["text"])

def retriever(q, k=4):
    sims = cosine_similarity(vec.transform([q]), X).ravel()
    top = np.argsort(-sims)[:k]
    return [(int(i), docs.loc[i, "text"], float(sims[i])) for i in top]

def fmt(hits):
    return "\n".join(f"[doc {i}] {t}" for i, t, _ in hits)

def fake_llm(prompt):
    # "Answer" by extracting the highest-scoring sentence
    return prompt.split("Docs:")[1].splitlines()[1]

def rag(q):
    hits = retriever(q, k=4)
    prompt = f"Use ONLY the docs to answer. Cite [doc N].\nDocs:\n{fmt(hits)}\n\nQuestion: {q}\nAnswer:"
    return fake_llm(prompt).strip()

print(rag("battery life complaints"))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>retriever(q, k=4)</code> indexes the first 80 reviews with TF-IDF and returns <code>(idx, text, score)</code> triples for the top-k hits — the in-browser stand-in for FAISS retrieval. 2) <code>fmt(hits)</code> joins them into bracketed <code>[doc N] text</code> lines, the same format the production prompt expects. 3) <code>fake_llm(prompt)</code> "answers" by extracting the first context line — a stand-in for a real chat model that demonstrates the structural shape without an API call. 4) <code>rag(q)</code> orchestrates retriever → format → prompt → fake_llm; swap the last step for <code>ChatOpenAI(...).invoke(prompt)</code> and you have a working RAG pipeline.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Failure modes you must guard against</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">No relevant doc found</div><div class="calc-card-desc">Force "I do not know" instead of hallucinating.</div></div>
<div class="calc-card"><div class="calc-card-title">Stale knowledge</div><div class="calc-card-desc">Re-index nightly; mark each chunk with ingestion_timestamp.</div></div>
<div class="calc-card"><div class="calc-card-title">Conflicting docs</div><div class="calc-card-desc">Sort by recency or trust score.</div></div>
<div class="calc-card"><div class="calc-card-title">Long context dilution</div><div class="calc-card-desc">Models attend less to middle of long context — keep K small or rerank.</div></div>
<div class="calc-card"><div class="calc-card-title">Over-citation</div><div class="calc-card-desc">Force 1-2 citations per claim with explicit prompt rules.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. RAG quality components — relative impact</h2>
<div id="lc-l6-imp-en" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var data=[{type:'bar',orientation:'h',
    y:['retriever quality','chunking strategy','reranker','prompt design','LLM choice','embedding model'].reverse(),
    x:[35,20,15,12,10,8].reverse(),
    marker:{color:T},text:['35%','20%','15%','12%','10%','8%'].reverse(),textposition:'outside'}];
  var layout={title:'Where most RAG quality gains come from (practitioner survey, illustrative)',
    xaxis:{title:'relative impact (%)'},margin:{l:170,r:50,t:60,b:50},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l6-imp-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L7 zooms into the input side: <strong>document loaders &amp; splitters</strong>. PDFs, web pages, Notion exports — plus how chunk size and overlap impact retrieval quality.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> Müşteri yorumlarınızı hiç okumamış bir LLM, onlarla ilgili soruları yanıtlayamaz. Daha kötüsü — cevapları uydurur. <strong>RAG</strong> (Retrieval-Augmented Generation) bunu çözen baskın desendir: sorgu anında verinizden en alakalı parçaları çekin, prompt'a yapıştırın, sonra LLM'e topraklı bir cevap kompoze ettirin. RAG, ince ayar yapmadan genel bir sohbet modelini alana özel asistana dönüştürür.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dört RAG adımını tek LCEL chain'inde bağlamayı: load → split → embed → retrieve</li>
<li>RAG ile fine-tuning'i maliyet, tazelik ve atıf gereksinimleri açısından kıyaslamayı</li>
<li>Müşteri yorumları üzerinde <code>create_retrieval_chain</code> ile stuff-prompt RAG kurmayı</li>
<li>Model çıktısına <code>Document.metadata</code>'dan satır içi atıflar eklemeyi</li>
<li>Aşağı akış chain kodunu değiştirmeden retriever'ları (FAISS vs BM25 vs hybrid) değiştirmeyi</li>
<li>Model iddialarını çekilen bağlamla karşılaştırarak halüsinasyonu tespit etmeyi</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Neden RAG, neden ince ayar değil?</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Özellik</div><div>İnce ayar</div><div>RAG</div></div>
<div class="cmp-row"><div>Bilgi güncellemesi</div><div>Yeniden eğit</div><div>İndeksi saniyede güncelle</div></div>
<div class="cmp-row"><div>Atıflar</div><div>Halüsine</div><div>Gerçek belge ID'leri</div></div>
<div class="cmp-row"><div>Maliyet</div><div>Epoch başına $$$</div><div>Sorgu başına $</div></div>
<div class="cmp-row"><div>Gizlilik</div><div>Veri içine işliyor</div><div>Veri sizin deponuzda kalır</div></div>
<div class="cmp-row"><div>Stil uyarlama</div><div>Güçlü</div><div>Zayıf (system prompt'la yine iyi)</div></div>
</div>
<p class="l-text">Karar: olgular için RAG, stil/format için ince ayar. Birlikte iyi çalışırlar.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. RAG mimarisi</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1.</strong> Kullanıcı sorgusu → embed.</div>
<div class="calc-step"><strong>2.</strong> Vektör deposu araması → top-K aday chunk.</div>
<div class="calc-step"><strong>3. (Opsiyonel)</strong> Reranker, adayları cross-encoder ile yeniden skorlar.</div>
<div class="calc-step"><strong>4.</strong> Bağlam kur: "İşte belgeler: ... Kullanıcı sorusu: ... Sadece belgeleri kullanarak yanıtla."</div>
<div class="calc-step"><strong>5.</strong> LLM çağrısı → atıflı, topraklı cevap.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Chunking stratejisi</h2>
<p class="l-text">LLM'in sonlu bir bağlamı vardır. Tüm bilgi tabanını her çağrıda dökemezsiniz. Chunking, retrieval'ı isabetli ve ucuz tutmak için belgeleri böler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Sabit-boyut</div><div class="calc-card-desc">örn. 500 karakter + 50 overlap. Basit, sağlam varsayılan.</div></div>
<div class="calc-card"><div class="calc-card-title">Özyinelemeli</div><div class="calc-card-desc">Önce paragraf → cümle → kelime dene. Doğal sınırlara saygı duyar.</div></div>
<div class="calc-card"><div class="calc-card-title">Anlamsal</div><div class="calc-card-desc">Cümleleri embedding benzerliğine göre grupla. En iyi kalite, daha pahalı.</div></div>
<div class="calc-card"><div class="calc-card-title">Markdown / başlık</div><div class="calc-card-desc">Belgeler için # / ##'leri doğal bölme noktası olarak kullan.</div></div>
</div>
<p class="l-text">Denge: küçük chunk = isabetli retrieval ama bağlam kaybı; büyük chunk = daha çok bağlam ama düşük isabet. ~500 token, ~%10 overlap ile başlayın.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Hibrit retrieval (BM25 + yoğun)</h2>
<p class="l-text">Yoğun embedding'ler anlamsal eşleşmeyi yakalar; BM25 ise tam anahtar kelimeleri (ürün kodu, isim, hata mesajı). Reciprocal rank fusion ile birleştirin: skor = Σ 1/(k + rank_i).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.retrievers <span class="kw">import</span> BM25Retriever
<span class="kw">from</span> langchain.retrievers <span class="kw">import</span> EnsembleRetriever

bm25  = BM25Retriever.<span class="fn">from_texts</span>(texts, metadatas=metas)
dense = store.<span class="fn">as_retriever</span>(search_kwargs={<span class="str">"k"</span>: <span class="num">5</span>})

hybrid = <span class="fn">EnsembleRetriever</span>(retrievers=[bm25, dense], weights=[<span class="num">0.4</span>, <span class="num">0.6</span>])
docs = hybrid.<span class="fn">invoke</span>(<span class="str">"ödeme adımında hata kodu 502"</span>)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>BM25Retriever.from_texts(texts, metadatas=metas)</code> BM25 terim-örtüşmesine göre sıralayan sözcüksel bir retriever kurar — ürün kodu ve hata stringi için mükemmel. 2) <code>store.as_retriever(search_kwargs={"k": 5})</code> yoğun FAISS indeksini, top-5 anlamsal benzer belgeyi döndüren bir Runnable olarak sunar. 3) <code>EnsembleRetriever(retrievers=[bm25, dense], weights=[0.4, 0.6])</code> iki sıralı listeyi yoğun tarafa ağırlık veren reciprocal rank fusion (RRF) ile birleştirir. 4) <code>hybrid.invoke(query)</code> her iki bakışı birleştiren tek bir tekilleştirilmiş <code>Document</code> listesi döndürür — tam-eşleşme ile anlamsal recall'un en iyi dengesi.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Reciprocal rank fusion (RRF), sıralayıcılar üzerinden 1/(k+rank) toplamından ibarettir. İki sıralayıcı (kelime + karakter TF-IDF) çalıştır ve birleştir — matematiği görmek için LangChain gerekmez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Reciprocal rank fusion ile hibrit retrieval
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(50).tolist()

# İki "sıralayıcı": kelime tf-idf ve karakter tf-idf
v_word = TfidfVectorizer().fit(texts)
v_char = TfidfVectorizer(analyzer="char_wb", ngram_range=(3,5)).fit(texts)
M_w = v_word.transform(texts); M_c = v_char.transform(texts)

def rank(query, vec, M, top=5):
    sims = cosine_similarity(vec.transform([query]), M).ravel()
    return list(np.argsort(-sims)[:top])

def rrf(rankings, k=60):
    score = {}
    for r in rankings:
        for rank_pos, idx in enumerate(r):
            score[idx] = score.get(idx, 0) + 1.0 / (k + rank_pos)
    return sorted(score.items(), key=lambda x: -x[1])

q = "pil 502 hata"
fused = rrf([rank(q, v_word, M_w), rank(q, v_char, M_c)])
for idx, s in fused[:4]:
    print(f"{s:.4f}", texts[idx][:70])</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) İki tamamlayıcı TF-IDF "sıralayıcısı" kurar — kelime n-gramları anlamsal örtüşmeyi, karakter n-gramları yazım hatalarını ve morfolojik varyantları yakalar. 2) <code>rank(query, vec, M)</code> tek bir sıralayıcı için top-k belgenin indekslerini kosinüs benzerliğine göre sıralı döndürür. 3) <code>rrf(rankings, k=60)</code> reciprocal rank fusion'ı uygular: her belge her listeden <code>1/(k + rank_pozisyonu)</code> alır, toplamlar birleştirilir ve yeniden sıralanır. 4) <code>k=60</code> sabiti katkı eğrisini düzleştirir; rank 10'daki iyi belgeler hâlâ önemlidir — LangChain'in <code>EnsembleRetriever</code>'ının kullandığı aynı varsayılan.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. df_reviews üzerinde uçtan uca RAG (çalışan retrieval kısmı)</h2>
<p class="l-text">Aşağıda Pyodide'da çalıştırabileceğiniz tam bir retrieval akışı var. LLM çağrısını ne gönderileceğini gösteren basit bir şablonla değiştiriyoruz — üretimde <code>ChatOpenAI</code> takarsınız.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity

df_reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"id"</span>: <span class="fn">range</span>(<span class="num">1</span>, <span class="num">11</span>),
    <span class="str">"product"</span>: [<span class="str">"X1"</span>,<span class="str">"X1"</span>,<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X2"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>],
    <span class="str">"text"</span>: [
        <span class="str">"X1 pili 12 saat dayanıyor, çok etkileyici."</span>,
        <span class="str">"X1 klavye yazma baskısında esniyor."</span>,
        <span class="str">"X1 ekran kalibrasyonu kutudan çıktığında kötü."</span>,
        <span class="str">"X2 güzel OLED ekrana sahip, derin siyahlar."</span>,
        <span class="str">"X2 fan sesi oyun sırasında yüksek."</span>,
        <span class="str">"X2 yapı kalitesi premium hissettiriyor."</span>,
        <span class="str">"X3 0'dan %80'e 30 dakikada şarj oluyor."</span>,
        <span class="str">"X3 müşteri desteği iki hafta cevapsız kaldı."</span>,
        <span class="str">"X3 firmware güncellemesi cihazımı bozdu."</span>,
        <span class="str">"X3 webcam kalitesi vasat."</span>
    ]
})

vec = <span class="fn">TfidfVectorizer</span>(ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">1</span>).<span class="fn">fit</span>(df_reviews[<span class="str">"text"</span>])
X = vec.<span class="fn">transform</span>(df_reviews[<span class="str">"text"</span>])

<span class="kw">def</span> <span class="fn">retrieve</span>(query, k=<span class="num">4</span>):
    q = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(q, X).<span class="fn">ravel</span>()
    top = np.<span class="fn">argsort</span>(-sims)[:k]
    <span class="kw">return</span> df_reviews.iloc[top].<span class="fn">assign</span>(score=sims[top].<span class="fn">round</span>(<span class="num">3</span>))

<span class="kw">def</span> <span class="fn">build_prompt</span>(query, hits):
    ctx = <span class="str">"\\n"</span>.<span class="fn">join</span>([f<span class="str">"[doc {r.id} | {r.product}] {r.text}"</span>
                      <span class="kw">for</span> r <span class="kw">in</span> hits.<span class="fn">itertuples</span>()])
    <span class="kw">return</span> f<span class="str">"""Bir analistsin. SADECE belgeleri kullanarak yanıtla.
Cevap belgelerde yoksa "Bilmiyorum" de.

# Belgeler
{ctx}

# Soru
{query}

# Cevap ([doc N] biçiminde atıf yap):"""</span>

q = <span class="str">"X3 hakkındaki ana şikayetler neler?"</span>
hits = <span class="fn">retrieve</span>(q, k=<span class="num">4</span>)
<span class="fn">print</span>(hits)
<span class="fn">print</span>(<span class="str">"\\n--- LLM'E GÖNDERİLECEK PROMPT ---"</span>)
<span class="fn">print</span>(<span class="fn">build_prompt</span>(q, hits))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Retrieval sonuçlarının kullanışlı filtre metadata'sı taşıyabilmesi için <code>product</code> sütunlu küçük bir <code>df_reviews</code> kurar. 2) <code>retrieve(query, k=4)</code> bir vektör-deposu aramasını yansıtır: sorguyu TF-IDF'le, corpus'a karşı kosinüs al, top-k satırı dilimle. 3) <code>build_prompt(query, hits)</code> klasik stuff-prompt'u kurar: "SADECE belgeleri kullan" kuralı, köşeli ayraçlı belge bağlamı, kullanıcı sorusu ve zorlayıcı bir atıf biçimi. 4) Basılan prompt, bir LLM çağrısının (<code>chain.invoke({...})</code>) alacağı şeyin aynısıdır — yalnızca model çağrısı atlanır.</p>
<p class="l-text"><strong>Ne yapar:</strong> ürüne özgü bir soruya en alakalı 4 yorumu çeker, sonra topraklı bir prompt kurar. Model belge ID'lerini atıfla zorlanır, uydurma cevaplar elenir.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. LangChain ile aynı şey (demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> OpenAIEmbeddings, ChatOpenAI
<span class="kw">from</span> langchain_community.vectorstores <span class="kw">import</span> FAISS
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnablePassthrough
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser

emb = <span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>)
store = FAISS.<span class="fn">from_texts</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">tolist</span>(), emb,
                         metadatas=df_reviews.<span class="fn">to_dict</span>(<span class="str">"records"</span>))
retriever = store.<span class="fn">as_retriever</span>(search_kwargs={<span class="str">"k"</span>: <span class="num">4</span>})

prompt = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"""SADECE belgeleri kullanarak yanıtla. [doc N] atıf yap.
Belgeler:
{context}

Soru: {question}
Cevap:"""</span>)

<span class="kw">def</span> <span class="fn">fmt</span>(docs):
    <span class="kw">return</span> <span class="str">"\\n"</span>.<span class="fn">join</span>(f<span class="str">"[doc {d.metadata['id']}] {d.page_content}"</span> <span class="kw">for</span> d <span class="kw">in</span> docs)

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)

rag_chain = (
    {<span class="str">"context"</span>: retriever | fmt, <span class="str">"question"</span>: <span class="fn">RunnablePassthrough</span>()}
    | prompt | llm | <span class="fn">StrOutputParser</span>()
)

<span class="fn">print</span>(rag_chain.<span class="fn">invoke</span>(<span class="str">"X3 hakkındaki ana şikayetler neler?"</span>))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Bir retrieval adımı (vektör arama → top-k belge) ve belge metinlerini prompt context'ine birleştiren bir formatlama adımı tanımlar. 2) \`RunnableParallel\` / \`RunnablePassthrough\` ile kullanıcı sorusunu retrieved belgelerle birlikte chain boyunca taşır. 3) Tam LCEL: \`{context: retriever, question: passthrough} | prompt | llm | parser\` — bildirimsel, izlenebilir, parçaları kolayca değiştirilebilir. 4) Üretim için RAG kalitesinden emin olmadan önce chunking, embeddings cache, reranking ve LangSmith tracing ekleyin.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">TF-IDF ve heuristik yanıtlayıcı ile tam retrieval -> biçimlendirilmiş bağlam -> "cevap" hattı. LLM, en yüksek skorlu hit'leri özetleyen bir fonksiyonla değiştirilmiş — retriever | format | llm | parser şeklinin aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mini RAG hattı (LLM yok)
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

docs = df_reviews.head(80).reset_index(drop=True)
vec = TfidfVectorizer(ngram_range=(1,2)).fit(docs["text"])
X   = vec.transform(docs["text"])

def retriever(q, k=4):
    sims = cosine_similarity(vec.transform([q]), X).ravel()
    top = np.argsort(-sims)[:k]
    return [(int(i), docs.loc[i, "text"], float(sims[i])) for i in top]

def fmt(hits):
    return "\n".join(f"[doc {i}] {t}" for i, t, _ in hits)

def fake_llm(prompt):
    # En yüksek skorlu cümleyi çıkararak "cevap"
    return prompt.split("Belgeler:")[1].splitlines()[1]

def rag(q):
    hits = retriever(q, k=4)
    prompt = f"SADECE belgeleri kullanarak yanıtla. [doc N] atıf yap.\nBelgeler:\n{fmt(hits)}\n\nSoru: {q}\nCevap:"
    return fake_llm(prompt).strip()

print(rag("pil ömrü şikayetleri"))</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>retriever(q, k=4)</code> ilk 80 yorumu TF-IDF'le indeksler ve top-k için <code>(idx, text, score)</code> üçlüleri döndürür — FAISS retrieval'ının tarayıcı içi karşılığı. 2) <code>fmt(hits)</code> bunları üretim prompt'unun beklediği aynı biçimde köşeli ayraçlı <code>[doc N] text</code> satırları olarak birleştirir. 3) <code>fake_llm(prompt)</code> ilk bağlam satırını çıkararak "cevaplar" — API çağrısı olmadan yapısal şekli gösteren bir gerçek sohbet modeli vekili. 4) <code>rag(q)</code> retriever → format → prompt → fake_llm orkestrasını yapar; son adımı <code>ChatOpenAI(...).invoke(prompt)</code> ile değiştirin ve çalışan bir RAG hattı elde edin.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Korunmanız gereken hata modları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Alakalı belge bulunamadı</div><div class="calc-card-desc">Halüsine etmek yerine "Bilmiyorum" zorla.</div></div>
<div class="calc-card"><div class="calc-card-title">Bayat bilgi</div><div class="calc-card-desc">Geceleri yeniden indeksle; her chunk'a ingestion_timestamp ekle.</div></div>
<div class="calc-card"><div class="calc-card-title">Çelişen belgeler</div><div class="calc-card-desc">Tarih veya güven skoruna göre sırala.</div></div>
<div class="calc-card"><div class="calc-card-title">Uzun bağlam dilüsyonu</div><div class="calc-card-desc">Modeller uzun bağlamın ortasına az dikkat eder — K'yi küçük tut veya rerank et.</div></div>
<div class="calc-card"><div class="calc-card-title">Aşırı atıf</div><div class="calc-card-desc">Açık prompt kurallarıyla iddia başına 1-2 atıf zorla.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. RAG kalite bileşenleri — göreli etki</h2>
<div id="lc-l6-imp-tr" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var data=[{type:'bar',orientation:'h',
    y:['retriever kalitesi','chunking stratejisi','reranker','prompt tasarımı','LLM seçimi','embedding modeli'].reverse(),
    x:[35,20,15,12,10,8].reverse(),
    marker:{color:T},text:['35%','20%','15%','12%','10%','8%'].reverse(),textposition:'outside'}];
  var layout={title:'RAG kalite kazanımı çoğunlukla nereden gelir (uygulamacı anketi, örnek)',
    xaxis:{title:'göreli etki (%)'},margin:{l:180,r:50,t:60,b:50},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l6-imp-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L7 girdi tarafına yakınlaşıyor: <strong>belge yükleyiciler ve böleyiciler</strong>. PDF'ler, web sayfaları, Notion dışa aktarımları — ayrıca chunk boyutu ve overlap'in retrieval kalitesine etkisi.</p>
</div>
`
};
