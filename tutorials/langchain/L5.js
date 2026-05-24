window.LANGCHAIN_L5 = {
en: `<p class="l-text"><strong>Hook.</strong> Keyword search returns <em>"laptop"</em> when you ask for <em>"laptop"</em>. It returns nothing when you ask for <em>"portable computer"</em>. Embeddings fix this: every chunk of text becomes a dense vector, and similar meanings end up near each other in space. Vector stores let you search 100M of these vectors in milliseconds. Embeddings + vector store = the engine of every RAG system.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compute embeddings with <code>OpenAIEmbeddings</code>, <code>HuggingFaceEmbeddings</code>, and local sentence-transformers</li>
<li>Apply cosine similarity and L2 distance to rank semantic neighbors</li>
<li>Index vectors in FAISS, Chroma, Pinecone, or Weaviate via <code>VectorStore</code></li>
<li>Run similarity, MMR (max marginal relevance), and metadata-filtered search</li>
<li>Choose embedding dimension (384 vs 768 vs 1536) based on speed and quality trade-offs</li>
<li>Persist a vector store to disk and reload it on app startup</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. What an embedding is</h2>
<p class="l-text">A function <code>embed(text) → R^d</code> mapping a string to a fixed-size vector (typical d = 384, 768, 1536, 3072). Trained so that texts with similar meaning produce vectors with high cosine similarity.</p>
<div class="katex-block">$$\\cos(\\mathbf{a},\\mathbf{b}) = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\|\\mathbf{a}\\| \\, \\|\\mathbf{b}\\|}$$</div>
<p class="l-text">Cosine ranges in [-1, 1]; in practice for normalized embeddings it sits in [0, 1] and we treat &gt;0.7 as "very similar".</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Embedding model zoo</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Model</div><div>Dim</div><div>Notes</div></div>
<div class="cmp-row"><div>OpenAI text-embedding-3-small</div><div>1536</div><div>Cheap, strong baseline ($0.02 / 1M tokens)</div></div>
<div class="cmp-row"><div>OpenAI text-embedding-3-large</div><div>3072</div><div>Higher quality, 6x cost</div></div>
<div class="cmp-row"><div>BGE-large-en-v1.5</div><div>1024</div><div>Open, top of MTEB benchmark</div></div>
<div class="cmp-row"><div>sentence-transformers MiniLM</div><div>384</div><div>Tiny, fast, runs on CPU</div></div>
<div class="cmp-row"><div>Cohere embed-v3</div><div>1024</div><div>Multilingual, good for Turkish</div></div>
<div class="cmp-row"><div>multilingual-e5-large</div><div>1024</div><div>Open multilingual, BGE alternative</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Vector store landscape</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">FAISS (in-memory)</div><div class="calc-card-desc">Free, fast, perfect &lt;1M vectors, no server. Default choice for prototypes.</div></div>
<div class="calc-card"><div class="calc-card-title">Chroma</div><div class="calc-card-desc">Lightweight, persistent on disk, great DX.</div></div>
<div class="calc-card"><div class="calc-card-title">pgvector</div><div class="calc-card-desc">Postgres extension. Vectors live next to your business data.</div></div>
<div class="calc-card"><div class="calc-card-title">Pinecone</div><div class="calc-card-desc">Managed, scales to billions, hybrid search built-in.</div></div>
<div class="calc-card"><div class="calc-card-title">Weaviate</div><div class="calc-card-desc">Open, GraphQL, strong filtering.</div></div>
<div class="calc-card"><div class="calc-card-title">Qdrant</div><div class="calc-card-desc">Rust core, hybrid filters, very fast.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Decision tree — which to pick</h2>
<div class="calc-steps">
<div class="calc-step"><strong>&lt; 100k chunks, dev laptop?</strong> FAISS in-memory.</div>
<div class="calc-step"><strong>&lt; 1M, single server, want persistence?</strong> Chroma or Qdrant local.</div>
<div class="calc-step"><strong>Already on Postgres, &lt; 5M vectors?</strong> pgvector. Same DB, same backup.</div>
<div class="calc-step"><strong>Multi-tenant SaaS, billions of vectors?</strong> Pinecone or Weaviate cloud.</div>
<div class="calc-step"><strong>Hard requirement: hybrid (BM25 + dense)?</strong> Weaviate, Qdrant, or Pinecone.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Build a tiny "vector store" with sklearn (runnable)</h2>
<p class="l-text">Pyodide has scikit-learn but no FAISS. We can still demonstrate the core idea — TF-IDF as a sparse pseudo-embedding and cosine similarity for retrieval.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">import</span> numpy <span class="kw">as</span> np

df_reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"id"</span>: <span class="fn">range</span>(<span class="num">1</span>, <span class="num">9</span>),
    <span class="str">"text"</span>: [
        <span class="str">"Battery life is excellent on this laptop."</span>,
        <span class="str">"Screen is too dim under sunlight."</span>,
        <span class="str">"Keyboard feels cheap and flexes a lot."</span>,
        <span class="str">"Best portable computer I have ever owned."</span>,
        <span class="str">"Speakers are tinny and quiet."</span>,
        <span class="str">"Charging is fast — 80% in 40 minutes."</span>,
        <span class="str">"Touchpad is unresponsive after sleep."</span>,
        <span class="str">"Performance is great for video editing."</span>
    ]
})

vec = <span class="fn">TfidfVectorizer</span>(ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">1</span>).<span class="fn">fit</span>(df_reviews[<span class="str">"text"</span>])
X = vec.<span class="fn">transform</span>(df_reviews[<span class="str">"text"</span>])

<span class="kw">def</span> <span class="fn">search</span>(query, k=<span class="num">3</span>):
    q = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(q, X).<span class="fn">ravel</span>()
    top = np.<span class="fn">argsort</span>(-sims)[:k]
    <span class="kw">return</span> df_reviews.iloc[top].<span class="fn">assign</span>(score=sims[top].<span class="fn">round</span>(<span class="num">3</span>))

<span class="fn">print</span>(<span class="fn">search</span>(<span class="str">"portable laptop battery"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>TfidfVectorizer(ngram_range=(1,2))</code> fits a vocabulary of unigrams + bigrams over the eight reviews — each row becomes a sparse vector. 2) <code>X = vec.transform(...)</code> builds the document matrix; in a real RAG system this would be an <code>embeddings.embed_documents(...)</code> call. 3) <code>search(query, k)</code> vectorises the query the same way, calls <code>cosine_similarity</code> against every doc, and ranks with <code>np.argsort(-sims)</code>. 4) The returned DataFrame slice plus the <code>score</code> column is what a vector store's <code>similarity_search_with_score</code> would also hand back — same contract, different math.</p>
<p class="l-text"><strong>What it does:</strong> builds a TF-IDF matrix over 8 reviews and ranks them by cosine similarity to a query. The same shape — embed corpus → embed query → cosine top-K — is what FAISS does at billion scale, only with dense neural embeddings instead of sparse TF-IDF.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Same idea with LangChain + FAISS (demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> OpenAIEmbeddings
<span class="kw">from</span> langchain_community.vectorstores <span class="kw">import</span> FAISS

embeddings = <span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>)
texts = df_reviews[<span class="str">"text"</span>].<span class="fn">tolist</span>()
metas = df_reviews[[<span class="str">"id"</span>]].<span class="fn">to_dict</span>(<span class="str">"records"</span>)

store = FAISS.<span class="fn">from_texts</span>(texts, embeddings, metadatas=metas)
store.<span class="fn">save_local</span>(<span class="str">"./reviews_index"</span>)

<span class="cm"># Later, load and query:</span>
store = FAISS.<span class="fn">load_local</span>(<span class="str">"./reviews_index"</span>, embeddings,
                        allow_dangerous_deserialization=<span class="kw">True</span>)
hits = store.<span class="fn">similarity_search_with_score</span>(<span class="str">"portable laptop battery"</span>, k=<span class="num">3</span>)
<span class="kw">for</span> doc, score <span class="kw">in</span> hits:
    <span class="fn">print</span>(<span class="fn">round</span>(score, <span class="num">3</span>), doc.page_content)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>OpenAIEmbeddings(model="text-embedding-3-small")</code> constructs the embedding function used both at index time and at query time. 2) <code>FAISS.from_texts(texts, embeddings, metadatas=metas)</code> embeds every review and builds the in-memory ANN index — metadata travels with each vector. 3) <code>store.save_local("./reviews_index")</code> persists the index to disk so subsequent runs skip the embedding cost. 4) <code>FAISS.load_local(...)</code> rehydrates the store; <code>similarity_search_with_score(query, k=3)</code> returns the top-3 <code>(Document, distance)</code> pairs ready for a RAG prompt.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mimic FAISS save/load by pickling the TF-IDF vectorizer + matrix to bytes. Same lifecycle (build once, persist, reload, query) without OpenAI or FAISS — runs against the preamble's df_reviews.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># In-browser FAISS substitute: pickle a TF-IDF "index"
import pickle, time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(300).tolist()
vec = TfidfVectorizer(ngram_range=(1,2), min_df=1).fit(texts)
X   = vec.transform(texts)

# "save_local" -> just pickle bytes
blob = pickle.dumps({"vec": vec, "X": X, "texts": texts})
print(f"index size: {len(blob)/1024:.1f} KB")

# "load_local" -> unpickle, query
store = pickle.loads(blob)
def search(q, k=3):
    qv = store["vec"].transform([q])
    sims = cosine_similarity(qv, store["X"]).ravel()
    top = np.argsort(-sims)[:k]
    return [(round(sims[i], 3), store["texts"][i]) for i in top]

t0 = time.time()
hits = search("battery life on laptop")
print(f"query took {(time.time()-t0)*1000:.1f} ms")
for s, t in hits: print(s, "->", t[:80])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a TF-IDF vectoriser over the first 300 reviews and stores the matrix <code>X</code> alongside the original texts — the in-browser stand-in for an embedding index. 2) <code>pickle.dumps({"vec", "X", "texts"})</code> serialises everything into a single bytes blob — the moral equivalent of <code>FAISS.save_local(...)</code>. 3) <code>pickle.loads(blob)</code> rehydrates the index in another session, no recomputation needed — same lifecycle as <code>FAISS.load_local(...)</code>. 4) <code>search(q, k)</code> mirrors <code>similarity_search_with_score</code>: vectorise the query, cosine against the matrix, return the top-k <code>(score, text)</code> pairs.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. ANN — why search is fast</h2>
<p class="l-text">Naive cosine over N vectors is O(N·d). Vector stores use <strong>approximate nearest neighbor</strong> (HNSW, IVF, ScaNN) to drop that to roughly O(log N) at the cost of a tiny recall@k loss. HNSW is the dominant default in 2026.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Recall vs latency tradeoff</h2>
<div id="lc-l5-recall-en" style="width:100%;height:400px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var x=[0.1,0.5,1,5,10,30,100];
  var rec=[88,93,96,98,99,99.4,99.8];
  var data=[{type:'scatter',mode:'lines+markers',x:x,y:rec,
    line:{color:T,width:3},marker:{size:10,color:T}}];
  var layout={title:'Recall@10 vs query latency (HNSW, 1M vectors)',
    xaxis:{title:'latency (ms, log)',type:'log'},
    yaxis:{title:'Recall@10 (%)',range:[80,100]},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l5-recall-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L6 wires embeddings + retriever into a full <strong>RAG</strong> pipeline. The reviews vector index from this lesson becomes the knowledge base of an answering bot.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> Anahtar kelime araması <em>"laptop"</em> sorduğunuzda <em>"laptop"</em> döndürür. <em>"taşınabilir bilgisayar"</em> sorduğunuzda hiçbir şey döndürmez. Embedding'ler bunu çözer: her metin parçası yoğun bir vektöre dönüşür ve benzer anlamlar uzayda yakın oturur. Vektör depoları 100M böyle vektörü milisaniyeler içinde aratır. Embedding + vektör deposu = her RAG sisteminin motoru.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><code>OpenAIEmbeddings</code>, <code>HuggingFaceEmbeddings</code> ve yerel sentence-transformers ile embedding hesaplamayı</li>
<li>Anlamsal komşuları sıralamak için kosinüs benzerliği ve L2 mesafesi uygulamayı</li>
<li>Vektörleri FAISS, Chroma, Pinecone veya Weaviate'te <code>VectorStore</code> ile indekslemeyi</li>
<li>Similarity, MMR (max marginal relevance) ve metadata-filtreli arama çalıştırmayı</li>
<li>Hız/kalite dengesine göre embedding boyutunu (384 vs 768 vs 1536) seçmeyi</li>
<li>Vektör deposunu diske kalıcılaştırmayı ve uygulama açılışında yeniden yüklemeyi</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Embedding nedir</h2>
<p class="l-text">Bir string'i sabit boyutlu vektöre eşleyen fonksiyon <code>embed(text) → R^d</code> (tipik d = 384, 768, 1536, 3072). Benzer anlamlı metinler yüksek kosinüs benzerlikli vektörler üretsin diye eğitilir.</p>
<div class="katex-block">$$\\cos(\\mathbf{a},\\mathbf{b}) = \\frac{\\mathbf{a} \\cdot \\mathbf{b}}{\\|\\mathbf{a}\\| \\, \\|\\mathbf{b}\\|}$$</div>
<p class="l-text">Kosinüs [-1, 1] aralığındadır; pratikte normalize embedding'ler için [0, 1] arasında oturur ve &gt;0.7'yi "çok benzer" sayarız.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Embedding model bahçesi</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Model</div><div>Boyut</div><div>Notlar</div></div>
<div class="cmp-row"><div>OpenAI text-embedding-3-small</div><div>1536</div><div>Ucuz, güçlü taban ($0.02 / 1M token)</div></div>
<div class="cmp-row"><div>OpenAI text-embedding-3-large</div><div>3072</div><div>Daha kaliteli, 6× maliyet</div></div>
<div class="cmp-row"><div>BGE-large-en-v1.5</div><div>1024</div><div>Açık, MTEB benchmark zirvesinde</div></div>
<div class="cmp-row"><div>sentence-transformers MiniLM</div><div>384</div><div>Minik, hızlı, CPU'da çalışır</div></div>
<div class="cmp-row"><div>Cohere embed-v3</div><div>1024</div><div>Çok dilli, Türkçe için iyi</div></div>
<div class="cmp-row"><div>multilingual-e5-large</div><div>1024</div><div>Açık çok dilli, BGE alternatifi</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Vektör deposu manzarası</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">FAISS (bellekte)</div><div class="calc-card-desc">Bedava, hızlı, &lt;1M vektörde mükemmel, sunucu yok. Prototip için varsayılan.</div></div>
<div class="calc-card"><div class="calc-card-title">Chroma</div><div class="calc-card-desc">Hafif, diskte kalıcı, harika DX.</div></div>
<div class="calc-card"><div class="calc-card-title">pgvector</div><div class="calc-card-desc">Postgres uzantısı. Vektörler iş verinizin yanında yaşar.</div></div>
<div class="calc-card"><div class="calc-card-title">Pinecone</div><div class="calc-card-desc">Yönetilen, milyarlara ölçeklenir, hibrit arama dahil.</div></div>
<div class="calc-card"><div class="calc-card-title">Weaviate</div><div class="calc-card-desc">Açık, GraphQL, güçlü filtreleme.</div></div>
<div class="calc-card"><div class="calc-card-title">Qdrant</div><div class="calc-card-desc">Rust çekirdek, hibrit filtreler, çok hızlı.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Karar ağacı — hangisini seçmeli</h2>
<div class="calc-steps">
<div class="calc-step"><strong>&lt; 100k chunk, dizüstü?</strong> FAISS bellekte.</div>
<div class="calc-step"><strong>&lt; 1M, tek sunucu, kalıcılık ister misiniz?</strong> Chroma veya yerel Qdrant.</div>
<div class="calc-step"><strong>Zaten Postgres'te, &lt; 5M vektör?</strong> pgvector. Aynı DB, aynı yedek.</div>
<div class="calc-step"><strong>Çok kiracılı SaaS, milyarlarca vektör?</strong> Pinecone veya Weaviate cloud.</div>
<div class="calc-step"><strong>Sıkı hibrit gereksinim (BM25 + yoğun)?</strong> Weaviate, Qdrant veya Pinecone.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. sklearn ile minik bir "vektör deposu" (çalışan)</h2>
<p class="l-text">Pyodide'da scikit-learn var ama FAISS yok. Yine de fikrin özünü gösterebiliriz — seyrek sahte-embedding olarak TF-IDF ve retrieval için kosinüs benzerliği.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.metrics.pairwise <span class="kw">import</span> cosine_similarity
<span class="kw">import</span> numpy <span class="kw">as</span> np

df_reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"id"</span>: <span class="fn">range</span>(<span class="num">1</span>, <span class="num">9</span>),
    <span class="str">"text"</span>: [
        <span class="str">"Bu laptopta pil ömrü mükemmel."</span>,
        <span class="str">"Ekran güneş altında çok soluk."</span>,
        <span class="str">"Klavye ucuz hissettiriyor ve esniyor."</span>,
        <span class="str">"Sahip olduğum en iyi taşınabilir bilgisayar."</span>,
        <span class="str">"Hoparlörler madeni ve sessiz."</span>,
        <span class="str">"Şarj hızlı — 40 dakikada %80."</span>,
        <span class="str">"Touchpad uykudan sonra cevap vermiyor."</span>,
        <span class="str">"Performans video düzenleme için harika."</span>
    ]
})

vec = <span class="fn">TfidfVectorizer</span>(ngram_range=(<span class="num">1</span>,<span class="num">2</span>), min_df=<span class="num">1</span>).<span class="fn">fit</span>(df_reviews[<span class="str">"text"</span>])
X = vec.<span class="fn">transform</span>(df_reviews[<span class="str">"text"</span>])

<span class="kw">def</span> <span class="fn">search</span>(query, k=<span class="num">3</span>):
    q = vec.<span class="fn">transform</span>([query])
    sims = <span class="fn">cosine_similarity</span>(q, X).<span class="fn">ravel</span>()
    top = np.<span class="fn">argsort</span>(-sims)[:k]
    <span class="kw">return</span> df_reviews.iloc[top].<span class="fn">assign</span>(score=sims[top].<span class="fn">round</span>(<span class="num">3</span>))

<span class="fn">print</span>(<span class="fn">search</span>(<span class="str">"taşınabilir laptop pil"</span>))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>TfidfVectorizer(ngram_range=(1,2))</code> sekiz yorum üzerinde unigram + bigram bir kelime hazinesi fit eder — her satır seyrek bir vektör olur. 2) <code>X = vec.transform(...)</code> belge matrisini kurar; gerçek bir RAG sisteminde bu bir <code>embeddings.embed_documents(...)</code> çağrısı olurdu. 3) <code>search(query, k)</code> sorguyu aynı şekilde vektörleştirir, her belgeye karşı <code>cosine_similarity</code> çağırır ve <code>np.argsort(-sims)</code> ile sıralar. 4) Dönen DataFrame dilimi + <code>score</code> sütunu, bir vektör deposunun <code>similarity_search_with_score</code>'unun da döndüreceği şeydir — aynı kontrat, farklı matematik.</p>
<p class="l-text"><strong>Ne yapar:</strong> 8 yorum üzerinde TF-IDF matrisi kurar ve sorguya kosinüs benzerliğine göre sıralar. Aynı şekil — corpus embed et → sorgu embed et → kosinüs top-K — FAISS'in milyar ölçeğinde yaptığıdır; sadece seyrek TF-IDF yerine yoğun nöral embedding kullanır.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. LangChain + FAISS ile aynı fikir (demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> OpenAIEmbeddings
<span class="kw">from</span> langchain_community.vectorstores <span class="kw">import</span> FAISS

embeddings = <span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>)
texts = df_reviews[<span class="str">"text"</span>].<span class="fn">tolist</span>()
metas = df_reviews[[<span class="str">"id"</span>]].<span class="fn">to_dict</span>(<span class="str">"records"</span>)

store = FAISS.<span class="fn">from_texts</span>(texts, embeddings, metadatas=metas)
store.<span class="fn">save_local</span>(<span class="str">"./reviews_index"</span>)

<span class="cm"># Sonra yükle ve sorgula:</span>
store = FAISS.<span class="fn">load_local</span>(<span class="str">"./reviews_index"</span>, embeddings,
                        allow_dangerous_deserialization=<span class="kw">True</span>)
hits = store.<span class="fn">similarity_search_with_score</span>(<span class="str">"taşınabilir laptop pil"</span>, k=<span class="num">3</span>)
<span class="kw">for</span> doc, score <span class="kw">in</span> hits:
    <span class="fn">print</span>(<span class="fn">round</span>(score, <span class="num">3</span>), doc.page_content)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>OpenAIEmbeddings(model="text-embedding-3-small")</code> hem indeksleme hem sorgu sırasında kullanılan embedding fonksiyonunu kurar. 2) <code>FAISS.from_texts(texts, embeddings, metadatas=metas)</code> her yorumu embed eder ve bellek içi ANN indeksini kurar — metadata her vektörle birlikte taşınır. 3) <code>store.save_local("./reviews_index")</code> indeksi diske kalıcı yapar; sonraki çalıştırmalar embedding maliyetini atlar. 4) <code>FAISS.load_local(...)</code> depoyu yeniden canlandırır; <code>similarity_search_with_score(query, k=3)</code> RAG prompt'una hazır top-3 <code>(Document, mesafe)</code> çiftini döndürür.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">FAISS save/load'u TF-IDF vectorizer + matrisini bytes'a pickle'layarak taklit et. Aynı yaşam döngüsü (bir kez kur, sakla, geri yükle, sorgula) — OpenAI ve FAISS olmadan, preamble'daki df_reviews üzerinde.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Tarayıcı içi FAISS yerine: TF-IDF "indeksi"ni pickle'la
import pickle, time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

texts = df_reviews["text"].head(300).tolist()
vec = TfidfVectorizer(ngram_range=(1,2), min_df=1).fit(texts)
X   = vec.transform(texts)

# "save_local" -> sadece pickle bytes
blob = pickle.dumps({"vec": vec, "X": X, "texts": texts})
print(f"indeks boyutu: {len(blob)/1024:.1f} KB")

# "load_local" -> unpickle, sorgula
store = pickle.loads(blob)
def search(q, k=3):
    qv = store["vec"].transform([q])
    sims = cosine_similarity(qv, store["X"]).ravel()
    top = np.argsort(-sims)[:k]
    return [(round(sims[i], 3), store["texts"][i]) for i in top]

t0 = time.time()
hits = search("laptopta pil ömrü")
print(f"sorgu süresi: {(time.time()-t0)*1000:.1f} ms")
for s, t in hits: print(s, "->", t[:80])</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) İlk 300 yorum üzerinde TF-IDF vectorizer kurar ve matris <code>X</code>'i orijinal metinlerle birlikte saklar — embedding indeksinin tarayıcı içi karşılığı. 2) <code>pickle.dumps({"vec", "X", "texts"})</code> her şeyi tek bir bytes blob'a serialize eder — <code>FAISS.save_local(...)</code>'un manevi eşdeğeri. 3) <code>pickle.loads(blob)</code> indeksi başka bir oturumda yeniden canlandırır, yeniden hesaplama gerekmez — <code>FAISS.load_local(...)</code> ile aynı yaşam döngüsü. 4) <code>search(q, k)</code> <code>similarity_search_with_score</code>'u yansıtır: sorguyu vektörleştir, matrise karşı kosinüs al, top-k <code>(score, text)</code> çiftini döndür.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. ANN — arama neden hızlı</h2>
<p class="l-text">N vektör üzerinde naive kosinüs O(N·d). Vektör depoları <strong>yaklaşık en yakın komşu</strong> (HNSW, IVF, ScaNN) kullanarak bunu çok küçük recall@k kaybıyla yaklaşık O(log N)'e düşürür. HNSW 2026'da baskın varsayılan.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Recall vs gecikme dengesi</h2>
<div id="lc-l5-recall-tr" style="width:100%;height:400px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var x=[0.1,0.5,1,5,10,30,100];
  var rec=[88,93,96,98,99,99.4,99.8];
  var data=[{type:'scatter',mode:'lines+markers',x:x,y:rec,
    line:{color:T,width:3},marker:{size:10,color:T}}];
  var layout={title:'Recall@10 vs sorgu gecikmesi (HNSW, 1M vektör)',
    xaxis:{title:'gecikme (ms, log)',type:'log'},
    yaxis:{title:'Recall@10 (%)',range:[80,100]},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l5-recall-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L6 embedding'leri + retriever'ı tam bir <strong>RAG</strong> hattına bağlıyor. Bu dersteki yorum vektör indeksi, cevap veren bir botun bilgi tabanı oluyor.</p>
</div>
`
};
