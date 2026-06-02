window.LANGCHAIN_L7 = {
en: `<p class="l-text"><strong>Hook.</strong> RAG quality lives or dies in the ingestion pipeline. Garbage chunks → garbage retrieval → garbage answers. <strong>Document loaders</strong> bring raw files (PDFs, web pages, Notion exports, code repos) into LangChain's <code>Document</code> abstraction. <strong>Text splitters</strong> chop them into the right-size pieces so the retriever can find a needle in your knowledge haystack.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Construct <code>Document(page_content, metadata)</code> objects with source, page, and timestamp</li>
<li>Load PDFs, HTML pages, Notion exports, and code repos with the matching loader class</li>
<li>Split text with <code>RecursiveCharacterTextSplitter</code>, choosing chunk size and overlap</li>
<li>Use code-aware and Markdown-aware splitters to preserve syntactic boundaries</li>
<li>Tune chunk_size (500-1500 chars) and overlap (10-20%) against retrieval quality</li>
<li>Diagnose retrieval failure: chunks too big, lost context, missing metadata filters</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. The Document object</h2>
<p class="l-text">Every loader emits a list of <code>Document(page_content, metadata)</code>. Metadata is critical — source URL, page number, section, ingestion timestamp — so you can cite, filter, and re-ingest later.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.documents <span class="kw">import</span> Document
doc = <span class="fn">Document</span>(
    page_content=<span class="str">"Battery lasts 12h on the X1 laptop."</span>,
    metadata={<span class="str">"source"</span>: <span class="str">"reviews.csv"</span>, <span class="str">"row"</span>: <span class="num">4</span>, <span class="str">"product"</span>: <span class="str">"X1"</span>}
)
<span class="fn">print</span>(doc.page_content[:<span class="num">50</span>], doc.metadata)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports the canonical <code>Document</code> class from <code>langchain_core.documents</code> — the universal envelope every loader emits and every retriever returns. 2) Constructs one with explicit <code>page_content</code> (the actual text the LLM will see) and a <code>metadata</code> dict that carries the source, row index, and a product tag. 3) <code>doc.page_content</code> and <code>doc.metadata</code> are plain attributes — no validation, no surprises. 4) Downstream code uses metadata for filtering (<code>filter={"product": "X1"}</code>) and citations (<code>[{meta['source']} row {meta['row']}]</code>) — so it pays to populate it well at ingest time.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A Document is just a (text, dict) pair. A dataclass gives the same API surface, then map df_reviews into 5 such Documents to feel the shape of a loader's output.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Hand-rolled Document
from dataclasses import dataclass, field

@dataclass
class Document:
    page_content: str
    metadata: dict = field(default_factory=dict)

# Build documents from a real DataFrame (df_reviews from preamble)
docs = [
    Document(
        page_content=row["text"],
        metadata={"source": "df_reviews", "row": int(i), "label": row.get("sentiment", "?")}
    )
    for i, row in df_reviews.head(5).iterrows()
]

for d in docs:
    print(d.metadata, "|", d.page_content[:60])
print("\ntotal docs:", len(docs))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Declares a tiny <code>@dataclass Document</code> with <code>page_content</code> and a default-empty <code>metadata</code> dict — the same API surface as LangChain's <code>Document</code>. 2) Iterates the first 5 rows of <code>df_reviews</code> and wraps each row's text in a <code>Document</code> with <code>source</code>, <code>row</code>, and <code>label</code> metadata. 3) The list comprehension makes the loader pattern explicit: <em>every</em> loader (CSV, PDF, Notion) boils down to "build one Document per record". 4) The printed metadata for each doc shows what a retriever would later use to filter and to cite — exactly the same fields you would get from <code>CSVLoader.load()</code>.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Loaders catalogue</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Loader</div><div>Source</div></div>
<div class="cmp-row"><div>WebBaseLoader / SitemapLoader</div><div>HTML pages, full sites</div></div>
<div class="cmp-row"><div>PyPDFLoader / PDFPlumberLoader / Unstructured</div><div>PDFs (text + tables)</div></div>
<div class="cmp-row"><div>NotionDirectoryLoader / NotionDBLoader</div><div>Notion export, Notion API</div></div>
<div class="cmp-row"><div>GitHubIssuesLoader / GitLoader</div><div>Repos and issues</div></div>
<div class="cmp-row"><div>CSVLoader / DataFrameLoader</div><div>Tabular data</div></div>
<div class="cmp-row"><div>ConfluenceLoader / SlackLoader</div><div>Wikis, chat logs</div></div>
<div class="cmp-row"><div>S3FileLoader / GoogleDriveLoader</div><div>Cloud buckets</div></div>
<div class="cmp-row"><div>UnstructuredFileLoader</div><div>Catch-all (uses unstructured.io)</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Web + PDF examples (demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.document_loaders <span class="kw">import</span> WebBaseLoader, PyPDFLoader

<span class="cm"># Web</span>
web = <span class="fn">WebBaseLoader</span>(<span class="str">"https://en.wikipedia.org/wiki/Sentiment_analysis"</span>).<span class="fn">load</span>()
<span class="fn">print</span>(<span class="fn">len</span>(web), <span class="str">"docs"</span>); <span class="fn">print</span>(web[<span class="num">0</span>].page_content[:<span class="num">200</span>])

<span class="cm"># PDF — one Document per page, page number in metadata</span>
pdf = <span class="fn">PyPDFLoader</span>(<span class="str">"./papers/attention_is_all_you_need.pdf"</span>).<span class="fn">load</span>()
<span class="fn">print</span>(<span class="fn">len</span>(pdf), <span class="str">"pages"</span>)
<span class="fn">print</span>(pdf[<span class="num">3</span>].metadata)  <span class="cm"># {'source': '...pdf', 'page': 3}</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>WebBaseLoader(url).load()</code> fetches the URL, runs BeautifulSoup over the HTML, and returns one <code>Document</code> per page with <code>source</code> metadata set to the URL. 2) <code>SitemapLoader</code> and <code>RecursiveUrlLoader</code> wrap the same idea to crawl entire sites; you usually pair them with <code>UnstructuredHTMLLoader</code> for clean text. 3) <code>PyPDFLoader(path).load()</code> opens a PDF and returns one <code>Document</code> per page, automatically attaching <code>{'source': path, 'page': n}</code> metadata. 4) The page-level granularity lets your splitter (next section) chop within a page while keeping the original page number for citations.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide equivalent (runs in browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">CSVLoader is just pd.read_csv + a row->Document mapping. Build it with df_reviews; use a fake "PDF page list" by chunking a long string into pages — the same shape PyPDFLoader returns.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mini CSV + "PDF" loaders
def csv_loader(df, source="df.csv"):
    return [{"page_content": row["text"],
             "metadata": {"source": source, "row": int(i)}}
            for i, row in df.iterrows()]

def fake_pdf_pages(long_text, chars_per_page=400, source="paper.pdf"):
    return [{"page_content": long_text[i:i+chars_per_page],
             "metadata": {"source": source, "page": p}}
            for p, i in enumerate(range(0, len(long_text), chars_per_page))]

# Real CSV-style ingestion
csv_docs = csv_loader(df_reviews.head(6))
print(f"csv: {len(csv_docs)} docs, first metadata: {csv_docs[0]['metadata']}")

# Simulated PDF
big = ("Sentiment analysis evolved from lexicons to transformers. " * 30)
pdf_docs = fake_pdf_pages(big, chars_per_page=200)
print(f"pdf: {len(pdf_docs)} pages, page 3 metadata: {pdf_docs[3]['metadata']}")
print("page 3 preview:", pdf_docs[3]["page_content"][:80])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>csv_loader(df)</code> iterates a DataFrame's rows and emits a list of <code>{page_content, metadata}</code> dicts with <code>source</code> and <code>row</code> filled in — the same payload <code>CSVLoader.load()</code> returns. 2) <code>fake_pdf_pages(long_text, chars_per_page)</code> slices a long string into fixed-size chunks and tags each with <code>{source, page}</code> — a stand-in for what <code>PyPDFLoader</code> hands back. 3) <code>list(range(0, len(text), chars_per_page))</code> walks the text in <code>chars_per_page</code> strides; <code>enumerate</code> gives the page index for the metadata. 4) Running both loaders confirms the universal contract: a loader is just <em>"a function that returns a list of (text, metadata) records"</em>.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Splitters — three you actually use</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">CharacterTextSplitter</div><div class="calc-card-desc">Splits by a single separator. Simplest, sometimes too dumb.</div></div>
<div class="calc-card"><div class="calc-card-title">RecursiveCharacterTextSplitter</div><div class="calc-card-desc">Tries paragraphs → sentences → words → chars. The default for prose.</div></div>
<div class="calc-card"><div class="calc-card-title">MarkdownHeaderTextSplitter</div><div class="calc-card-desc">Splits on # / ## / ### and keeps headers as metadata. Best for docs.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Splitter in action (runnable)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Simulate a long document — Pyodide friendly, no LangChain import</span>
text = <span class="str">"""
# Introduction
Sentiment analysis is the task of classifying the polarity of text.
Researchers have studied it since the early 2000s, often with bag-of-words.

# Modern Methods
Modern systems use transformer encoders such as BERT or RoBERTa.
Fine-tuning a pretrained encoder on labelled reviews is the dominant recipe.
Domain adaptation helps when the target domain (e.g. Turkish telecom) differs.

# Deployment
A production sentiment model needs latency < 100ms and graceful degradation.
LangServe or FastAPI is a common wrapper. Logging predictions allows drift detection.
"""</span> * <span class="num">4</span>   <span class="cm"># multiply to make it long enough</span>

<span class="kw">def</span> <span class="fn">recursive_split</span>(text, chunk_size=<span class="num">300</span>, overlap=<span class="num">40</span>):
    seps = [<span class="str">"\\n\\n"</span>, <span class="str">"\\n"</span>, <span class="str">". "</span>, <span class="str">" "</span>]
    <span class="kw">def</span> <span class="fn">split</span>(t, depth=<span class="num">0</span>):
        <span class="kw">if</span> <span class="fn">len</span>(t) <= chunk_size <span class="kw">or</span> depth >= <span class="fn">len</span>(seps):
            <span class="kw">return</span> [t]
        parts = t.<span class="fn">split</span>(seps[depth])
        out, buf = [], <span class="str">""</span>
        <span class="kw">for</span> p <span class="kw">in</span> parts:
            <span class="kw">if</span> <span class="fn">len</span>(buf) + <span class="fn">len</span>(p) + <span class="fn">len</span>(seps[depth]) <= chunk_size:
                buf = (buf + seps[depth] + p) <span class="kw">if</span> buf <span class="kw">else</span> p
            <span class="kw">else</span>:
                <span class="kw">if</span> buf: out.<span class="fn">append</span>(buf)
                <span class="kw">if</span> <span class="fn">len</span>(p) > chunk_size:
                    out.<span class="fn">extend</span>(<span class="fn">split</span>(p, depth + <span class="num">1</span>))
                    buf = <span class="str">""</span>
                <span class="kw">else</span>:
                    buf = p
        <span class="kw">if</span> buf: out.<span class="fn">append</span>(buf)
        <span class="cm"># Add overlap</span>
        with_overlap = []
        <span class="kw">for</span> i, c <span class="kw">in</span> <span class="fn">enumerate</span>(out):
            <span class="kw">if</span> i == <span class="num">0</span>:
                with_overlap.<span class="fn">append</span>(c)
            <span class="kw">else</span>:
                tail = out[i-<span class="num">1</span>][-overlap:]
                with_overlap.<span class="fn">append</span>(tail + <span class="str">" "</span> + c)
        <span class="kw">return</span> with_overlap
    <span class="kw">return</span> <span class="fn">split</span>(text)

chunks = <span class="fn">recursive_split</span>(text, chunk_size=<span class="num">300</span>, overlap=<span class="num">40</span>)
<span class="fn">print</span>(<span class="str">"chunks:"</span>, <span class="fn">len</span>(chunks))
<span class="fn">print</span>(<span class="str">"sample chunk len:"</span>, <span class="fn">len</span>(chunks[<span class="num">2</span>]))
<span class="fn">print</span>(<span class="str">"---\\n"</span>, chunks[<span class="num">2</span>][:<span class="num">200</span>])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>recursive_split(text, chunk_size, overlap)</code> walks a separator hierarchy — paragraph break, line break, sentence, word — and only descends to the next level if the current pieces are still too big. 2) The inner <code>split(t, depth)</code> greedily packs pieces into a <code>buf</code> until adding the next one would exceed <code>chunk_size</code>, then flushes <code>buf</code> and starts a new chunk. 3) When a single piece is still longer than <code>chunk_size</code>, the function recurses with <code>depth+1</code> so it tries a finer separator on that piece alone — the "recursive" in the name. 4) The post-pass copies the last <code>overlap</code> characters of the previous chunk onto the front of the next one — preventing a sentence from being cut at a boundary.</p>
<p class="l-text"><strong>What it does:</strong> mimics <code>RecursiveCharacterTextSplitter</code> in pure Python. Notice how overlap repeats the tail of the previous chunk — this is what prevents losing a sentence that straddles a boundary.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. With LangChain (one-liner)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_text_splitters <span class="kw">import</span> RecursiveCharacterTextSplitter

splitter = <span class="fn">RecursiveCharacterTextSplitter</span>(
    chunk_size=<span class="num">500</span>, chunk_overlap=<span class="num">50</span>,
    separators=[<span class="str">"\\n\\n"</span>, <span class="str">"\\n"</span>, <span class="str">". "</span>, <span class="str">" "</span>, <span class="str">""</span>]
)
docs = splitter.<span class="fn">create_documents</span>([text])
<span class="fn">print</span>(<span class="fn">len</span>(docs), <span class="str">"chunks"</span>)
<span class="fn">print</span>(docs[<span class="num">0</span>].metadata)        <span class="cm"># auto: start_index if requested</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`RecursiveCharacterTextSplitter\` splits long text into overlapping chunks of \`chunk_size\` characters with \`chunk_overlap\` carryover — overlap preserves context across boundaries. 2) It tries separators in order (paragraph break, line break, space, character) so chunks break on paragraph boundaries when possible — better than naive character-only splits. 3) The output is a list of \`Document\` objects with \`.page_content\` and \`.metadata\` — directly indexable by a vector store. 4) Tune \`chunk_size\` to your embedding model's context (e.g. 512 tokens for BGE, 8k for text-embedding-3-large) and \`chunk_overlap\` to ~10–20 % of chunk size.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Choosing chunk size — the empirical rule</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Rule of thumb:</strong> chunk_size ≈ 500 tokens, overlap ≈ 10-15%.</div>
<div class="calc-step"><strong>Q&amp;A over short FAQs:</strong> drop to 200 tokens, no overlap (each FAQ already self-contained).</div>
<div class="calc-step"><strong>Long technical docs:</strong> 800-1200 tokens with 100 token overlap so a derivation doesn't get cut.</div>
<div class="calc-step"><strong>Code:</strong> split by function/class with <code>Language.PYTHON</code> aware splitter, never by char count.</div>
<div class="calc-step"><strong>Always re-evaluate</strong> chunk size on a held-out eval set (RAGAS, L10).</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Chunk size effect on retrieval — illustrative</h2>
<div id="lc-l7-chunk-en" style="width:100%;height:400px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var x=[100,200,400,600,800,1200,2000];
  var rec=[68,79,86,87,84,78,69];
  var prec=[88,84,79,73,67,58,48];
  var data=[
    {type:'scatter',mode:'lines+markers',x:x,y:rec,name:'recall@5',line:{color:T,width:3},marker:{size:10}},
    {type:'scatter',mode:'lines+markers',x:x,y:prec,name:'precision@5',line:{color:'#888',width:3,dash:'dot'},marker:{size:10}}
  ];
  var layout={title:'Chunk size sweet spot — retrieval recall vs precision',
    xaxis:{title:'chunk size (tokens)'},yaxis:{title:'metric (%)'},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l7-chunk-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L8 makes chains <strong>stateful</strong> — memory strategies for multi-turn chat assistants.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> RAG kalitesi, ingestion hattında yaşar veya ölür. Çöp chunk → çöp retrieval → çöp cevap. <strong>Belge yükleyiciler</strong> ham dosyaları (PDF, web sayfası, Notion dışa aktarımı, kod repo'su) LangChain'in <code>Document</code> soyutlamasına alır. <strong>Metin böleyiciler</strong> onları doğru boyutta parçalara böler ki retriever bilgi samanlığında iğneyi bulsun.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Source, sayfa ve timestamp ile <code>Document(page_content, metadata)</code> nesneleri oluşturmayı</li>
<li>PDF, HTML, Notion dışa aktarımı ve kod repo'larını uygun loader sınıfıyla yüklemeyi</li>
<li>Metni <code>RecursiveCharacterTextSplitter</code> ile bölmeyi; chunk boyutu ve overlap seçmeyi</li>
<li>Sözdizimsel sınırları korumak için kod ve Markdown farkındalığı olan böleyicileri kullanmayı</li>
<li>chunk_size (500-1500 karakter) ve overlap (%10-20) değerlerini retrieval kalitesine göre ayarlamayı</li>
<li>Retrieval başarısızlığını teşhis etmeyi: çok büyük chunk, kayıp bağlam, eksik metadata filtresi</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Document nesnesi</h2>
<p class="l-text">Her loader bir <code>Document(page_content, metadata)</code> listesi üretir. Metadata kritik — kaynak URL, sayfa numarası, bölüm, ingestion zaman damgası — atıf yapabilesin, filtreleyesin ve sonra yeniden alabilesin diye.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.documents <span class="kw">import</span> Document
doc = <span class="fn">Document</span>(
    page_content=<span class="str">"X1 laptopta pil 12 saat dayanıyor."</span>,
    metadata={<span class="str">"source"</span>: <span class="str">"reviews.csv"</span>, <span class="str">"row"</span>: <span class="num">4</span>, <span class="str">"product"</span>: <span class="str">"X1"</span>}
)
<span class="fn">print</span>(doc.page_content[:<span class="num">50</span>], doc.metadata)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>langchain_core.documents</code>'tan kanonik <code>Document</code> sınıfını import eder — her loader'ın ürettiği, her retriever'ın döndürdüğü evrensel zarf. 2) Bir tanesini açık <code>page_content</code> (LLM'nin göreceği gerçek metin) ve kaynağı, satır indeksini ve ürün etiketini taşıyan bir <code>metadata</code> dict ile kurar. 3) <code>doc.page_content</code> ve <code>doc.metadata</code> sade attribute'lardır — doğrulama yok, sürpriz yok. 4) Aşağı yöndeki kod metadata'yı filtreleme (<code>filter={"product": "X1"}</code>) ve atıf (<code>[{meta['source']} satır {meta['row']}]</code>) için kullanır — bu yüzden ingest sırasında iyi doldurmaya değer.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Document, sadece (text, dict) ikilisidir. Bir dataclass aynı API yüzeyini verir; sonra df_reviews'i 5 Document'a eşleyerek loader çıktısının şeklini hisseder.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># El yapımı Document
from dataclasses import dataclass, field

@dataclass
class Document:
    page_content: str
    metadata: dict = field(default_factory=dict)

# Gerçek bir DataFrame'den belge oluştur (preamble'daki df_reviews)
docs = [
    Document(
        page_content=row["text"],
        metadata={"source": "df_reviews", "row": int(i), "label": row.get("sentiment", "?")}
    )
    for i, row in df_reviews.head(5).iterrows()
]

for d in docs:
    print(d.metadata, "|", d.page_content[:60])
print("\ntoplam belge:", len(docs))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>page_content</code> ve varsayılan-boş <code>metadata</code> dict'i ile minik bir <code>@dataclass Document</code> tanımlar — LangChain'in <code>Document</code>'ı ile aynı API yüzeyi. 2) <code>df_reviews</code>'in ilk 5 satırını gezer ve her satırın metnini <code>source</code>, <code>row</code> ve <code>label</code> metadata'lı bir <code>Document</code> içine sarar. 3) List comprehension loader desenini açıkça gösterir: <em>her</em> loader (CSV, PDF, Notion) "kayıt başına bir Document üret"e iner. 4) Her belge için basılan metadata, retriever'ın sonradan filtreleme ve atıf için kullanacağı alanları gösterir — <code>CSVLoader.load()</code>'tan alacağınız aynı alanlar.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Loader kataloğu</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Loader</div><div>Kaynak</div></div>
<div class="cmp-row"><div>WebBaseLoader / SitemapLoader</div><div>HTML sayfaları, tüm site</div></div>
<div class="cmp-row"><div>PyPDFLoader / PDFPlumberLoader / Unstructured</div><div>PDF (metin + tablo)</div></div>
<div class="cmp-row"><div>NotionDirectoryLoader / NotionDBLoader</div><div>Notion dışa aktarımı, Notion API</div></div>
<div class="cmp-row"><div>GitHubIssuesLoader / GitLoader</div><div>Repo ve issue'lar</div></div>
<div class="cmp-row"><div>CSVLoader / DataFrameLoader</div><div>Tablo verisi</div></div>
<div class="cmp-row"><div>ConfluenceLoader / SlackLoader</div><div>Wiki'ler, sohbet logları</div></div>
<div class="cmp-row"><div>S3FileLoader / GoogleDriveLoader</div><div>Bulut bucket'ları</div></div>
<div class="cmp-row"><div>UnstructuredFileLoader</div><div>Genel kapsam (unstructured.io kullanır)</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Web + PDF örnekleri (demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.document_loaders <span class="kw">import</span> WebBaseLoader, PyPDFLoader

<span class="cm"># Web</span>
web = <span class="fn">WebBaseLoader</span>(<span class="str">"https://tr.wikipedia.org/wiki/Duygu_analizi"</span>).<span class="fn">load</span>()
<span class="fn">print</span>(<span class="fn">len</span>(web), <span class="str">"doc"</span>); <span class="fn">print</span>(web[<span class="num">0</span>].page_content[:<span class="num">200</span>])

<span class="cm"># PDF — sayfa başına bir Document, sayfa no metadata'da</span>
pdf = <span class="fn">PyPDFLoader</span>(<span class="str">"./papers/attention_is_all_you_need.pdf"</span>).<span class="fn">load</span>()
<span class="fn">print</span>(<span class="fn">len</span>(pdf), <span class="str">"sayfa"</span>)
<span class="fn">print</span>(pdf[<span class="num">3</span>].metadata)  <span class="cm"># {'source': '...pdf', 'page': 3}</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>WebBaseLoader(url).load()</code> URL'yi çeker, HTML üzerinde BeautifulSoup çalıştırır ve <code>source</code> metadata'sı URL olan, sayfa başına bir <code>Document</code> döndürür. 2) <code>SitemapLoader</code> ve <code>RecursiveUrlLoader</code> aynı fikri tüm siteyi taramak için sarmalar; genelde temiz metin için <code>UnstructuredHTMLLoader</code> ile eşleştirirsiniz. 3) <code>PyPDFLoader(path).load()</code> bir PDF açar ve otomatik olarak <code>{'source': path, 'page': n}</code> metadata ekleyerek sayfa başına bir <code>Document</code> döndürür. 4) Sayfa seviyesindeki granülerlik, böleyicinizin (sonraki bölüm) sayfa içinde parçalayıp atıflar için orijinal sayfa numarasını korumasını sağlar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">CSVLoader, pd.read_csv + satır->Document eşlemesinden ibarettir. df_reviews ile inşa edin; uzun bir string'i sayfalara bölerek sahte "PDF sayfa listesi" üretin — PyPDFLoader'ın döndürdüğü şekil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mini CSV + "PDF" loader
def csv_loader(df, source="df.csv"):
    return [{"page_content": row["text"],
             "metadata": {"source": source, "row": int(i)}}
            for i, row in df.iterrows()]

def fake_pdf_pages(uzun_metin, chars_per_page=400, source="paper.pdf"):
    return [{"page_content": uzun_metin[i:i+chars_per_page],
             "metadata": {"source": source, "page": p}}
            for p, i in enumerate(range(0, len(uzun_metin), chars_per_page))]

# Gerçek CSV-tarzı yükleme
csv_docs = csv_loader(df_reviews.head(6))
print(f"csv: {len(csv_docs)} belge, ilk metadata: {csv_docs[0]['metadata']}")

# Simüle edilmiş PDF
buyuk = ("Duygu analizi sözlüklerden transformer'lara evrildi. " * 30)
pdf_docs = fake_pdf_pages(buyuk, chars_per_page=200)
print(f"pdf: {len(pdf_docs)} sayfa, sayfa 3 metadata: {pdf_docs[3]['metadata']}")
print("sayfa 3 önizleme:", pdf_docs[3]["page_content"][:80])</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>csv_loader(df)</code> bir DataFrame'in satırlarını gezer ve <code>source</code> ile <code>row</code> doldurulmuş <code>{page_content, metadata}</code> dict listesi üretir — <code>CSVLoader.load()</code>'un döndürdüğü aynı yük. 2) <code>fake_pdf_pages(uzun_metin, chars_per_page)</code> uzun bir string'i sabit boyutlu parçalara dilimler ve her birini <code>{source, page}</code> ile etiketler — <code>PyPDFLoader</code>'ın döndürdüğü şeyin yerine geçer. 3) <code>list(range(0, len(text), chars_per_page))</code> metni <code>chars_per_page</code> adımlarla gezer; <code>enumerate</code> metadata için sayfa indeksini verir. 4) Her iki loader'ı çalıştırmak evrensel kontratı doğrular: loader sadece <em>"(text, metadata) kayıtları listesi döndüren bir fonksiyon"</em>dur.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Böleyiciler — gerçekten kullandığınız üçü</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">CharacterTextSplitter</div><div class="calc-card-desc">Tek ayraçla böler. En basit, bazen çok aptal.</div></div>
<div class="calc-card"><div class="calc-card-title">RecursiveCharacterTextSplitter</div><div class="calc-card-desc">Önce paragraf → cümle → kelime → karakter dener. Düz metin için varsayılan.</div></div>
<div class="calc-card"><div class="calc-card-title">MarkdownHeaderTextSplitter</div><div class="calc-card-desc"># / ## / ### üzerinde böler ve başlıkları metadata'ya alır. Belgeler için en iyi.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Böleyici eylemde (çalışan)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Uzun bir belgeyi simüle edelim — Pyodide dostu, LangChain importu yok</span>
text = <span class="str">"""
# Giriş
Duygu analizi metinlerin kutbunu sınıflandırma görevidir.
Araştırmacılar 2000'lerin başından beri bunu çoğunlukla bag-of-words ile çalışıyor.

# Modern Yöntemler
Modern sistemler BERT ya da RoBERTa gibi transformer encoder'ları kullanır.
Etiketli yorumlar üzerinde önceden eğitilmiş encoder'ı ince ayar etmek baskın reçete.
Hedef alan (örn. Türkçe telekom) farklı olduğunda alan adaptasyonu yardımcı olur.

# Yayına Alma
Üretim duygu modeli &lt; 100ms gecikme ve nazik bozulma ister.
LangServe veya FastAPI yaygın bir sarmalayıcı. Tahminleri loglamak drift tespitine olanak verir.
"""</span> * <span class="num">4</span>

<span class="kw">def</span> <span class="fn">recursive_split</span>(text, chunk_size=<span class="num">300</span>, overlap=<span class="num">40</span>):
    seps = [<span class="str">"\\n\\n"</span>, <span class="str">"\\n"</span>, <span class="str">". "</span>, <span class="str">" "</span>]
    <span class="kw">def</span> <span class="fn">split</span>(t, depth=<span class="num">0</span>):
        <span class="kw">if</span> <span class="fn">len</span>(t) <= chunk_size <span class="kw">or</span> depth >= <span class="fn">len</span>(seps):
            <span class="kw">return</span> [t]
        parts = t.<span class="fn">split</span>(seps[depth])
        out, buf = [], <span class="str">""</span>
        <span class="kw">for</span> p <span class="kw">in</span> parts:
            <span class="kw">if</span> <span class="fn">len</span>(buf) + <span class="fn">len</span>(p) + <span class="fn">len</span>(seps[depth]) <= chunk_size:
                buf = (buf + seps[depth] + p) <span class="kw">if</span> buf <span class="kw">else</span> p
            <span class="kw">else</span>:
                <span class="kw">if</span> buf: out.<span class="fn">append</span>(buf)
                <span class="kw">if</span> <span class="fn">len</span>(p) > chunk_size:
                    out.<span class="fn">extend</span>(<span class="fn">split</span>(p, depth + <span class="num">1</span>))
                    buf = <span class="str">""</span>
                <span class="kw">else</span>:
                    buf = p
        <span class="kw">if</span> buf: out.<span class="fn">append</span>(buf)
        with_overlap = []
        <span class="kw">for</span> i, c <span class="kw">in</span> <span class="fn">enumerate</span>(out):
            <span class="kw">if</span> i == <span class="num">0</span>:
                with_overlap.<span class="fn">append</span>(c)
            <span class="kw">else</span>:
                tail = out[i-<span class="num">1</span>][-overlap:]
                with_overlap.<span class="fn">append</span>(tail + <span class="str">" "</span> + c)
        <span class="kw">return</span> with_overlap
    <span class="kw">return</span> <span class="fn">split</span>(text)

chunks = <span class="fn">recursive_split</span>(text, chunk_size=<span class="num">300</span>, overlap=<span class="num">40</span>)
<span class="fn">print</span>(<span class="str">"chunk:"</span>, <span class="fn">len</span>(chunks))
<span class="fn">print</span>(<span class="str">"örnek chunk uzunluk:"</span>, <span class="fn">len</span>(chunks[<span class="num">2</span>]))
<span class="fn">print</span>(<span class="str">"---\\n"</span>, chunks[<span class="num">2</span>][:<span class="num">200</span>])</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>recursive_split(text, chunk_size, overlap)</code> bir ayraç hiyerarşisini — paragraf, satır, cümle, kelime — gezer ve yalnızca mevcut parçalar hâlâ büyükse bir alt seviyeye iner. 2) İçteki <code>split(t, depth)</code> parçaları aç gözlü biçimde bir <code>buf</code>'a paketler; sonraki parçayı eklemek <code>chunk_size</code>'ı aşacaksa <code>buf</code>'u boşaltır ve yeni bir chunk başlatır. 3) Tek bir parça hâlâ <code>chunk_size</code>'tan büyükse fonksiyon <code>depth+1</code> ile özyinelemeye girer; o parça için daha ince bir ayraç dener — adındaki "recursive" budur. 4) Son geçiş, önceki chunk'un son <code>overlap</code> karakterini sonrakinin önüne kopyalar — bir cümlenin sınırda kesilmesini engeller.</p>
<p class="l-text"><strong>Ne yapar:</strong> saf Python'da <code>RecursiveCharacterTextSplitter</code>'ı taklit eder. Overlap'in önceki chunk'un kuyruğunu tekrar ettiğine dikkat — bu, sınırı aşan bir cümlenin kaybolmasını engeller.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. LangChain ile (tek satır)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_text_splitters <span class="kw">import</span> RecursiveCharacterTextSplitter

splitter = <span class="fn">RecursiveCharacterTextSplitter</span>(
    chunk_size=<span class="num">500</span>, chunk_overlap=<span class="num">50</span>,
    separators=[<span class="str">"\\n\\n"</span>, <span class="str">"\\n"</span>, <span class="str">". "</span>, <span class="str">" "</span>, <span class="str">""</span>]
)
docs = splitter.<span class="fn">create_documents</span>([text])
<span class="fn">print</span>(<span class="fn">len</span>(docs), <span class="str">"chunk"</span>)
<span class="fn">print</span>(docs[<span class="num">0</span>].metadata)        <span class="cm"># otomatik: istersen start_index</span></code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) \`RecursiveCharacterTextSplitter\` uzun metni \`chunk_size\` karakterlik, \`chunk_overlap\` taşmalı parçalara böler — overlap sınırlar arasında bağlamı korur. 2) Ayraçları sırayla dener (paragraf, satır, boşluk, karakter) — böylece parçalar mümkün olduğunda paragraf sınırlarında bölünür; saf karakter-bölme'den iyidir. 3) Çıktı \`.page_content\` ve \`.metadata\`'ya sahip \`Document\` nesneleri listesidir — vektör deposuyla doğrudan indexlenebilir. 4) \`chunk_size\`'ı embedding modelinizin context'ine göre ayarlayın (BGE için ~512 token, text-embedding-3-large için 8k) ve \`chunk_overlap\`'ı chunk size'ın ~%10–20'si yapın.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Chunk boyutu seçimi — ampirik kural</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Pratik kural:</strong> chunk_size ≈ 500 token, overlap ≈ %10-15.</div>
<div class="calc-step"><strong>Kısa SSS üzerinde Q&amp;A:</strong> 200 token'a düşür, overlap yok (her SSS zaten kendi başına).</div>
<div class="calc-step"><strong>Uzun teknik belgeler:</strong> 800-1200 token, 100 token overlap; bir türetme kesilmesin.</div>
<div class="calc-step"><strong>Kod:</strong> <code>Language.PYTHON</code> farkındalı böleyiciyle fonksiyon/class'a göre böl, asla karakter sayısıyla değil.</div>
<div class="calc-step"><strong>Her zaman yeniden değerlendirin</strong> chunk boyutunu ayrı bir eval setinde (RAGAS, L10).</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Chunk boyutunun retrieval'a etkisi — örnek</h2>
<div id="lc-l7-chunk-tr" style="width:100%;height:400px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var x=[100,200,400,600,800,1200,2000];
  var rec=[68,79,86,87,84,78,69];
  var prec=[88,84,79,73,67,58,48];
  var data=[
    {type:'scatter',mode:'lines+markers',x:x,y:rec,name:'recall@5',line:{color:T,width:3},marker:{size:10}},
    {type:'scatter',mode:'lines+markers',x:x,y:prec,name:'precision@5',line:{color:'#888',width:3,dash:'dot'},marker:{size:10}}
  ];
  var layout={title:'Chunk boyutu tatlı nokta — retrieval recall vs precision',
    xaxis:{title:'chunk boyutu (token)'},yaxis:{title:'metrik (%)'},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l7-chunk-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L8 chain'leri <strong>durumlu</strong> hale getiriyor — çok turlu sohbet asistanları için memory stratejileri.</p>
</div>
`
};
