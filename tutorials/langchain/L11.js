window.LANGCHAIN_L11 = {
en: `<p class="l-text"><strong>Hook.</strong> A demo notebook becomes a <em>product</em> when three things show up: a serving layer, observability, and cost control. <strong>LangServe</strong> turns any chain into a FastAPI endpoint. <strong>LangSmith / LangFuse / Phoenix</strong> trace every span, log evaluations, and surface regressions. <strong>Caching</strong> kills duplicate spend. This lesson is the production checklist.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Wrap any chain as a FastAPI endpoint with <code>langserve.add_routes</code></li>
<li>Trace runs in LangSmith and inspect token cost, latency, and failures per span</li>
<li>Cap spend with prompt-level <code>InMemoryCache</code> and Redis-backed semantic caching</li>
<li>Run regression evals with LangSmith datasets and the <code>evaluate</code> harness</li>
<li>Add structured logging, request IDs, and rate limits in front of the model</li>
<li>Roll out updates safely via shadow traffic and canary deploys</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. LangServe — chain to API in one file</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># app.py</span>
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI
<span class="kw">from</span> langserve <span class="kw">import</span> add_routes
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser

prompt = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Translate to {lang}: {text}"</span>)
chain  = prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>) | <span class="fn">StrOutputParser</span>()

app = <span class="fn">FastAPI</span>(title=<span class="str">"translator"</span>)
<span class="fn">add_routes</span>(app, chain, path=<span class="str">"/translate"</span>)

<span class="cm"># uvicorn app:app --port 8000</span>
<span class="cm"># POST /translate/invoke   { "input": {"lang": "fr", "text": "hello"} }</span>
<span class="cm"># POST /translate/stream   (Server-Sent Events)</span>
<span class="cm"># POST /translate/batch    (parallel)</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a one-line LCEL chain (<code>prompt | ChatOpenAI | StrOutputParser</code>) — the same shape from L4, now ready to serve. 2) Constructs a <code>FastAPI</code> app and calls <code>add_routes(app, chain, path="/translate")</code> — LangServe auto-generates <code>/invoke</code>, <code>/stream</code>, <code>/batch</code>, plus a playground at <code>/playground</code>. 3) Run with <code>uvicorn app:app --port 8000</code>; the server speaks JSON in, JSON or SSE out, and exposes OpenAPI docs at <code>/docs</code>. 4) Clients use <code>RemoteRunnable("http://host/translate")</code> and get the same <code>.invoke</code> / <code>.stream</code> interface as a local chain — same code path local or remote.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A LangServe endpoint is invoke / batch / stream over a chain. Mock the same surface as plain functions and test the three "routes" with a fake handler — no FastAPI needed.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mock LangServe routes
def chain(payload):
    return f"[{payload['lang']}] {payload['text']}"

class Endpoint:
    def __init__(self, fn): self.fn = fn
    def invoke(self, payload):
        return self.fn(payload)
    def batch(self, payloads):
        return [self.fn(p) for p in payloads]
    def stream(self, payload):
        out = self.fn(payload)
        for word in out.split():
            yield word + " "

translate = Endpoint(chain)

# /translate/invoke
print("INVOKE:", translate.invoke({"lang":"fr","text":"hello world"}))

# /translate/batch
print("BATCH:",  translate.batch([{"lang":"fr","text":"a"},{"lang":"de","text":"b"}]))

# /translate/stream
print("STREAM:", end=" ")
for chunk in translate.stream({"lang":"es","text":"this is a test"}):
    print(chunk, end="", flush=True)
print()</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>chain(payload)</code> is a one-liner stand-in for any LCEL pipeline — the goal is to feel the endpoint shape, not the model. 2) <code>Endpoint(fn)</code> wraps it in a class with three methods that mirror LangServe exactly: <code>invoke</code> for one request, <code>batch</code> for a list, <code>stream</code> as a generator. 3) The three printed sections show what each route would emit — the same JSON-in / JSON-out shape FastAPI would serialise. 4) Replace <code>chain</code> with any LCEL Runnable and the class becomes redundant — <code>add_routes</code> generates an equivalent surface automatically.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Streaming with Server-Sent Events</h2>
<div class="code-wrap"><div class="code-label"><span>JAVASCRIPT</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm">// JS client</span>
const r = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">"/translate/stream"</span>, {
  method: <span class="str">"POST"</span>,
  headers: { <span class="str">"Content-Type"</span>: <span class="str">"application/json"</span> },
  body: JSON.<span class="fn">stringify</span>({ <span class="ty">input</span>: { lang: <span class="str">"fr"</span>, text: <span class="str">"hello"</span> } })
});
const reader = r.body.<span class="fn">getReader</span>();
<span class="kw">while</span> (true) {
  const { value, done } = <span class="kw">await</span> reader.<span class="fn">read</span>();
  <span class="kw">if</span> (done) <span class="kw">break</span>;
  // value <span class="kw">is</span> Uint8Array of <span class="str">"data: ...\\n\\n"</span> chunks
  console.<span class="fn">log</span>(new <span class="fn">TextDecoder</span>().<span class="fn">decode</span>(value));
}</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The browser POSTs JSON to <code>/translate/stream</code>; the server keeps the connection open and writes <code>data: ...\n\n</code> SSE frames as the LLM produces tokens. 2) <code>r.body.getReader()</code> returns a <code>ReadableStreamDefaultReader</code> that yields <code>Uint8Array</code> chunks — each chunk may contain one or more SSE frames. 3) The <code>while (true)</code> loop reads until <code>done</code> is true; <code>TextDecoder</code> converts each chunk to text so you can parse the <code>data:</code> payloads. 4) In production you would split on <code>\n\n</code>, drop the <code>data: </code> prefix, and feed each parsed token into the UI for a typewriter effect.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Observability — what to log</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Trace</div><div class="calc-card-desc">A whole user request: input → final output, root span.</div></div>
<div class="calc-card"><div class="calc-card-title">Span</div><div class="calc-card-desc">A step inside a trace: a single LLM call, retriever, parser.</div></div>
<div class="calc-card"><div class="calc-card-title">Metadata</div><div class="calc-card-desc">user_id, session_id, prompt_version, model, tokens, latency, cost.</div></div>
<div class="calc-card"><div class="calc-card-title">Eval result</div><div class="calc-card-desc">Faithfulness/relevancy scores from periodic batches.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. LangSmith setup</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>pip install langsmith
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=ls__xxxxx
export LANGCHAIN_PROJECT=customer-bot-prod</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Setting \`LANGCHAIN_TRACING_V2=true\` and \`LANGCHAIN_API_KEY=...\` automatically logs every Runnable invocation to LangSmith — no code changes. 2) Each chain run becomes a tree of nested spans showing inputs, outputs, latency, and token cost per step — the standard way to debug long chains and agents. 3) LangSmith stores datasets and runs evaluators over them — pair with \`evaluate()\` to track regression as you change prompts or models. 4) Self-hosted alternatives: LangFuse (open source) and Helicone (proxy-based) — same idea, no vendor lock-in.</p>
<p class="l-text">After exporting these env vars every LCEL invocation auto-uploads a trace. Zero code changes — just env. Equivalent setup for <strong>LangFuse</strong> (open-source, self-hostable) and <strong>Phoenix</strong> (Arize).</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Caching — three levels</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Cache</div><div>Hits</div><div>Tradeoff</div></div>
<div class="cmp-row"><div>In-memory (dict)</div><div>Exact prompt match in same process</div><div>Trivial, dies on restart</div></div>
<div class="cmp-row"><div>Redis exact</div><div>Same prompt across replicas</div><div>Persistent, low latency</div></div>
<div class="cmp-row"><div>Semantic (embeddings)</div><div>Similar prompts within ε threshold</div><div>Highest hit-rate, false positives possible</div></div>
<div class="cmp-row"><div>Provider prompt cache</div><div>Anthropic/OpenAI server-side</div><div>Cheap input tokens for repeated prefixes (system prompts)</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.globals <span class="kw">import</span> set_llm_cache
<span class="kw">from</span> langchain_community.cache <span class="kw">import</span> RedisSemanticCache
<span class="kw">from</span> langchain_openai <span class="kw">import</span> OpenAIEmbeddings

<span class="fn">set_llm_cache</span>(<span class="fn">RedisSemanticCache</span>(
    redis_url=<span class="str">"redis://localhost:6379"</span>,
    embedding=<span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>),
    score_threshold=<span class="num">0.05</span>  <span class="cm"># cosine distance</span>
))
<span class="cm"># Now any chain.invoke(x) checks the semantic cache first.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>set_llm_cache(cache)</code> registers a global cache that every <code>chain.invoke</code> consults <em>before</em> calling the model — zero changes to chain code. 2) <code>RedisSemanticCache(redis_url=..., embedding=..., score_threshold=...)</code> embeds each prompt with the supplied embeddings model, stores the answer in Redis, and on subsequent calls looks for a stored prompt within <code>score_threshold</code> cosine distance. 3) The threshold is the knob: too tight = mostly misses, too loose = wrong answers served from cache; 0.05 is a safe default for production. 4) Pair with <code>InMemoryCache</code> in tests and the same code switches between persistent (Redis) and ephemeral (dict) backends.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Semantic cache = vector lookup with a similarity threshold. Build it with TF-IDF + cosine, then time hits vs misses. The pattern matches RedisSemanticCache exactly — only the backend changes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># In-memory semantic cache + simulated LLM latency
import time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SemanticCache:
    def __init__(self, threshold=0.7):
        self.queries = []; self.answers = []; self.threshold = threshold
    def lookup(self, q):
        if not self.queries: return None
        vec = TfidfVectorizer().fit(self.queries + [q])
        sims = cosine_similarity(vec.transform([q]),
                                  vec.transform(self.queries)).ravel()
        i = int(np.argmax(sims))
        return self.answers[i] if sims[i] >= self.threshold else None
    def store(self, q, a):
        self.queries.append(q); self.answers.append(a)

def slow_llm(q):
    time.sleep(0.05)        # simulate 50ms inference
    return f"answer about {q[:30]}"

cache = SemanticCache(threshold=0.5)
for q in ["What is sentiment analysis?",
          "What is sentiment analysis?",       # exact hit
          "Tell me about sentiment analysis",  # semantic hit
          "What is named entity recognition?"]:# miss
    t0 = time.time()
    hit = cache.lookup(q)
    if hit is None:
        ans = slow_llm(q); cache.store(q, ans); tag = "MISS"
    else:
        ans = hit; tag = "HIT "
    print(f"{tag} ({(time.time()-t0)*1000:5.1f} ms)  {q[:40]} -> {ans[:40]}")</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>SemanticCache.lookup(q)</code> fits TF-IDF over <em>past queries + new query</em>, then returns the stored answer if any past query exceeds the similarity threshold — same logic <code>RedisSemanticCache</code> runs with embeddings. 2) <code>slow_llm(q)</code> sleeps 50ms to mimic real LLM latency; comparing the printed ms shows the cache win directly. 3) The four-query loop covers three cache states: exact hit, semantic-similar hit ("Tell me about sentiment analysis" matches "What is sentiment analysis?"), and miss. 4) Tune <code>threshold</code>: too high = mostly misses (no cost win), too low = stale or wrong answers — same operating-curve trade as the production Redis version.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Cost optimization tactics</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1. Tier your models.</strong> Use gpt-4o-mini by default; route to gpt-4o only when a router LLM detects a hard query.</div>
<div class="calc-step"><strong>2. Cache aggressively.</strong> A 30% semantic cache hit-rate cuts your LLM bill by 30%.</div>
<div class="calc-step"><strong>3. Limit context.</strong> Top-4 reranked chunks, not top-20. Less is more — and cheaper.</div>
<div class="calc-step"><strong>4. Stream and cancel.</strong> If user navigates away mid-response, abort the stream — partial outputs are still billed but lower than completed.</div>
<div class="calc-step"><strong>5. Use prompt caching</strong> (Anthropic/OpenAI) for the long fixed system prompt — pay 90% less for repeated prefixes.</div>
<div class="calc-step"><strong>6. Batch offline jobs.</strong> OpenAI batch API = 50% discount, 24h SLA — perfect for nightly classification of df_reviews.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. The five-row LangServe deployment recipe</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Dockerfile</span>
FROM python:<span class="num">3.12</span>-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .
CMD [<span class="str">"uvicorn"</span>, <span class="str">"app:app"</span>, <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>FROM python:3.12-slim</code> picks a small base image — fewer megabytes to push, fewer CVEs to patch. 2) <code>COPY requirements.txt</code> + <code>RUN pip install</code> in two lines so Docker caches the deps layer until your dependencies change. 3) <code>COPY app.py</code> last so editing your code only invalidates the final layer — fast incremental builds. 4) <code>CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]</code> starts the LangServe app bound to all interfaces so the container is reachable from outside.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>docker build -t my-rag .
docker run -p <span class="num">8000</span>:<span class="num">8000</span> -e OPENAI_API_KEY=$OPENAI_API_KEY my-rag
<span class="cm"># Behind a reverse proxy (nginx/Caddy) terminate TLS and add rate limiting.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>docker build -t my-rag .</code> reads the Dockerfile and produces an image tagged <code>my-rag</code> — same artifact your CI ships to a registry. 2) <code>docker run -p 8000:8000</code> maps the container's port 8000 to the host so the LangServe API is reachable on <code>http://localhost:8000</code>. 3) <code>-e OPENAI_API_KEY=$OPENAI_API_KEY</code> injects the API key as an env var — keep secrets out of the image itself. 4) Front the container with nginx or Caddy for TLS termination, per-IP rate limits, and request logging — three concerns LangServe deliberately leaves to the edge.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Cost reduction stack — illustrative</h2>
<div id="lc-l11-cost-en" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var stages=['baseline','+ tier routing','+ semantic cache','+ rerank top-4','+ prompt cache','+ batch offline'];
  var cost=[100, 70, 49, 41, 30, 22];
  var data=[{type:'scatter',mode:'lines+markers',x:stages,y:cost,
    line:{color:T,width:3},marker:{size:14,color:T},
    text:cost.map(c=>c+'%'),textposition:'top center'}];
  var layout={title:'Cumulative cost reduction across optimization layers',
    xaxis:{title:''},yaxis:{title:'monthly LLM cost (% of baseline)',range:[0,110]},
    margin:{l:70,r:30,t:60,b:120},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l11-cost-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L12 is the <strong>capstone</strong>: a real customer-support RAG bot stitching everything from L1-L11 together — hybrid retrieval, reranking, memory, agent for SQL, observability, and a production checklist.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> Demo notebook'u, üç şey ortaya çıktığında <em>ürün</em> olur: sunum katmanı, gözlemlenebilirlik ve maliyet kontrolü. <strong>LangServe</strong> herhangi bir chain'i FastAPI endpoint'ine çevirir. <strong>LangSmith / LangFuse / Phoenix</strong> her span'i izler, değerlendirmeleri loglar, regresyonu yüzeye çıkarır. <strong>Önbellek</strong> tekrarlı harcamayı öldürür. Bu ders üretim kontrol listesidir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Herhangi bir chain'i <code>langserve.add_routes</code> ile FastAPI endpoint'i olarak sarmayı</li>
<li>Çalıştırmaları LangSmith'te izlemeyi ve span başına token maliyeti, gecikme, hata incelemeyi</li>
<li>Harcamayı prompt-seviye <code>InMemoryCache</code> ve Redis destekli semantic caching ile sınırlamayı</li>
<li>LangSmith dataset'leri ve <code>evaluate</code> harness'ı ile regresyon eval'i çalıştırmayı</li>
<li>Modelin önüne yapılı loglama, request ID ve rate limit eklemeyi</li>
<li>Güncellemeleri shadow traffic ve canary deploy ile güvenli biçimde yayınlamayı</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. LangServe — tek dosyada chain'den API'ye</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># app.py</span>
<span class="kw">from</span> fastapi <span class="kw">import</span> FastAPI
<span class="kw">from</span> langserve <span class="kw">import</span> add_routes
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser

prompt = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Şu metni {lang} diline çevir: {text}"</span>)
chain  = prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>) | <span class="fn">StrOutputParser</span>()

app = <span class="fn">FastAPI</span>(title=<span class="str">"translator"</span>)
<span class="fn">add_routes</span>(app, chain, path=<span class="str">"/translate"</span>)

<span class="cm"># uvicorn app:app --port 8000</span>
<span class="cm"># POST /translate/invoke   { "input": {"lang": "fr", "text": "hello"} }</span>
<span class="cm"># POST /translate/stream   (Server-Sent Events)</span>
<span class="cm"># POST /translate/batch    (paralel)</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Tek satırlık bir LCEL chain (<code>prompt | ChatOpenAI | StrOutputParser</code>) kurar — L4'teki aynı şekil, şimdi sunulmaya hazır. 2) Bir <code>FastAPI</code> uygulaması oluşturur ve <code>add_routes(app, chain, path="/translate")</code> çağırır — LangServe otomatik olarak <code>/invoke</code>, <code>/stream</code>, <code>/batch</code> ve <code>/playground</code>'da bir playground üretir. 3) <code>uvicorn app:app --port 8000</code> ile çalıştır; sunucu JSON alır, JSON veya SSE döndürür ve <code>/docs</code>'ta OpenAPI dokümanlarını sunar. 4) Client'lar <code>RemoteRunnable("http://host/translate")</code> kullanır ve yerel chain'le aynı <code>.invoke</code> / <code>.stream</code> arayüzünü alır — yerelde de uzakta da aynı kod yolu.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LangServe endpoint'i, bir chain üzerinde invoke / batch / stream'dir. Aynı yüzeyi düz fonksiyonlarla taklit et ve üç "rotayı" sahte handler ile test et — FastAPI gerekmez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mock LangServe rotaları
def chain(payload):
    return f"[{payload['lang']}] {payload['text']}"

class Endpoint:
    def __init__(self, fn): self.fn = fn
    def invoke(self, payload):
        return self.fn(payload)
    def batch(self, payloads):
        return [self.fn(p) for p in payloads]
    def stream(self, payload):
        out = self.fn(payload)
        for word in out.split():
            yield word + " "

translate = Endpoint(chain)

# /translate/invoke
print("INVOKE:", translate.invoke({"lang":"fr","text":"merhaba dünya"}))

# /translate/batch
print("BATCH:",  translate.batch([{"lang":"fr","text":"a"},{"lang":"de","text":"b"}]))

# /translate/stream
print("STREAM:", end=" ")
for chunk in translate.stream({"lang":"es","text":"bu bir testtir"}):
    print(chunk, end="", flush=True)
print()</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>chain(payload)</code> herhangi bir LCEL pipeline için tek satırlık vekildir — amaç endpoint şeklini hissetmek, model değil. 2) <code>Endpoint(fn)</code> onu LangServe'i birebir yansıtan üç metodla bir sınıfa sarar: tek istek için <code>invoke</code>, liste için <code>batch</code>, jeneratör olarak <code>stream</code>. 3) Üç basılı bölüm her rotanın ne yayacağını gösterir — FastAPI'nin serileştireceği aynı JSON-girer / JSON-çıkar şekli. 4) <code>chain</code>'i herhangi bir LCEL Runnable ile değiştirin; sınıf gereksizleşir — <code>add_routes</code> eşdeğer yüzeyi otomatik üretir.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Server-Sent Events ile streaming</h2>
<div class="code-wrap"><div class="code-label"><span>JAVASCRIPT</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>// JS client
const r = <span class="kw">await</span> <span class="fn">fetch</span>(<span class="str">"/translate/stream"</span>, {
  method: <span class="str">"POST"</span>,
  headers: { <span class="str">"Content-Type"</span>: <span class="str">"application/json"</span> },
  body: JSON.<span class="fn">stringify</span>({ <span class="ty">input</span>: { lang: <span class="str">"fr"</span>, text: <span class="str">"hello"</span> } })
});
const reader = r.body.<span class="fn">getReader</span>();
<span class="kw">while</span> (true) {
  const { value, done } = <span class="kw">await</span> reader.<span class="fn">read</span>();
  <span class="kw">if</span> (done) <span class="kw">break</span>;
  // value, <span class="str">"data: ...\\n\\n"</span> parçalarının Uint8Array<span class="str">'i</span>
  console.<span class="fn">log</span>(new <span class="fn">TextDecoder</span>().<span class="fn">decode</span>(value));
}</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Tarayıcı <code>/translate/stream</code>'e JSON POST eder; sunucu bağlantıyı açık tutar ve LLM token üretirken <code>data: ...\n\n</code> SSE frame'leri yazar. 2) <code>r.body.getReader()</code> <code>Uint8Array</code> parçaları yayan bir <code>ReadableStreamDefaultReader</code> döndürür — her parça bir veya daha fazla SSE frame içerebilir. 3) <code>while (true)</code> döngüsü <code>done</code> true olana kadar okur; <code>TextDecoder</code> her parçayı metne çevirir; böylece <code>data:</code> yüklerini ayrıştırabilirsiniz. 4) Üretimde <code>\n\n</code>'da bölüp <code>data: </code> önekini atar ve her parse edilen token'ı bir yazı makinesi etkisi için UI'a verirsiniz.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Gözlemlenebilirlik — ne loglanmalı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Trace</div><div class="calc-card-desc">Tüm bir kullanıcı isteği: girdi → final çıktı, kök span.</div></div>
<div class="calc-card"><div class="calc-card-title">Span</div><div class="calc-card-desc">Trace içindeki bir adım: tek LLM çağrısı, retriever, parser.</div></div>
<div class="calc-card"><div class="calc-card-title">Metadata</div><div class="calc-card-desc">user_id, session_id, prompt_version, model, token, gecikme, maliyet.</div></div>
<div class="calc-card"><div class="calc-card-title">Eval sonucu</div><div class="calc-card-desc">Periyodik batch'lerden faithfulness/relevancy skorları.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. LangSmith kurulumu</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>pip install langsmith
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_API_KEY=ls__xxxxx
export LANGCHAIN_PROJECT=customer-bot-prod</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) \`LANGCHAIN_TRACING_V2=true\` ve \`LANGCHAIN_API_KEY=...\` ayarlamak her Runnable çağrısını otomatik olarak LangSmith'e log'lar — kod değişikliği yok. 2) Her chain çalışması adım başına input, output, latency ve token maliyetini gösteren iç içe span'ler ağacı olur — uzun chain ve agent debug'ı için standart yol. 3) LangSmith dataset saklar ve üzerlerinde evaluator çalıştırır — prompt veya model değiştirdikçe regresyonu izlemek için \`evaluate()\` ile eşleştirin. 4) Self-hosted alternatifler: LangFuse (açık kaynak) ve Helicone (proxy-tabanlı) — aynı fikir, vendor lock-in yok.</p>
<p class="l-text">Bu env değişkenleri export edildikten sonra her LCEL çağrısı otomatik trace yükler. Sıfır kod değişikliği — sadece env. <strong>LangFuse</strong> (açık kaynak, kendi sunucunuza kurulabilir) ve <strong>Phoenix</strong> (Arize) için eşdeğer kurulum.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Önbellek — üç seviye</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Önbellek</div><div>Yakaladığı</div><div>Denge</div></div>
<div class="cmp-row"><div>Bellek-içi (dict)</div><div>Aynı süreçte tam prompt eşleşmesi</div><div>Önemsiz, yeniden başlatılınca ölür</div></div>
<div class="cmp-row"><div>Redis tam</div><div>Replikalar arası aynı prompt</div><div>Kalıcı, düşük gecikme</div></div>
<div class="cmp-row"><div>Semantik (embedding)</div><div>ε eşiğinde benzer prompt'lar</div><div>En yüksek hit-rate, yanlış pozitif olası</div></div>
<div class="cmp-row"><div>Sağlayıcı prompt cache</div><div>Anthropic/OpenAI sunucu tarafı</div><div>Tekrarlı önekler için (system prompt) ucuz girdi token'ı</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.globals <span class="kw">import</span> set_llm_cache
<span class="kw">from</span> langchain_community.cache <span class="kw">import</span> RedisSemanticCache
<span class="kw">from</span> langchain_openai <span class="kw">import</span> OpenAIEmbeddings

<span class="fn">set_llm_cache</span>(<span class="fn">RedisSemanticCache</span>(
    redis_url=<span class="str">"redis://localhost:6379"</span>,
    embedding=<span class="fn">OpenAIEmbeddings</span>(model=<span class="str">"text-embedding-3-small"</span>),
    score_threshold=<span class="num">0.05</span>  <span class="cm"># kosinüs mesafesi</span>
))
<span class="cm"># Artık her chain.invoke(x) önce semantik önbelleği kontrol eder.</span></code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>set_llm_cache(cache)</code> her <code>chain.invoke</code>'un modeli çağırmadan <em>önce</em> danıştığı global bir cache kaydeder — chain kodunda sıfır değişiklik. 2) <code>RedisSemanticCache(redis_url=..., embedding=..., score_threshold=...)</code> her prompt'u verilen embeddings modeliyle embed eder, cevabı Redis'te saklar ve sonraki çağrılarda <code>score_threshold</code> kosinüs mesafesi içindeki saklanmış prompt'ları arar. 3) Eşik anahtardır: çok sıkı = çoğunlukla miss, çok gevşek = yanlış cevaplar cache'ten servis edilir; 0.05 üretim için güvenli bir varsayılan. 4) Testlerde <code>InMemoryCache</code> ile eşleştirin; aynı kod kalıcı (Redis) ve geçici (dict) backend arasında geçer.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Semantik cache = benzerlik eşikli vektör araması. TF-IDF + kosinüs ile inşa et, hit vs miss zamanlaması ölç. Desen RedisSemanticCache ile birebir aynı — sadece backend değişir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Bellek-içi semantik cache + simüle LLM gecikmesi
import time
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class SemanticCache:
    def __init__(self, threshold=0.7):
        self.queries = []; self.answers = []; self.threshold = threshold
    def lookup(self, q):
        if not self.queries: return None
        vec = TfidfVectorizer().fit(self.queries + [q])
        sims = cosine_similarity(vec.transform([q]),
                                  vec.transform(self.queries)).ravel()
        i = int(np.argmax(sims))
        return self.answers[i] if sims[i] >= self.threshold else None
    def store(self, q, a):
        self.queries.append(q); self.answers.append(a)

def slow_llm(q):
    time.sleep(0.05)        # 50ms inference simüle et
    return f"cevap: {q[:30]}"

cache = SemanticCache(threshold=0.5)
for q in ["Duygu analizi nedir?",
          "Duygu analizi nedir?",         # tam hit
          "Duygu analizini anlat",        # semantik hit
          "Varlık tanıma nedir?"]:        # miss
    t0 = time.time()
    hit = cache.lookup(q)
    if hit is None:
        ans = slow_llm(q); cache.store(q, ans); tag = "MISS"
    else:
        ans = hit; tag = "HIT "
    print(f"{tag} ({(time.time()-t0)*1000:5.1f} ms)  {q[:40]} -> {ans[:40]}")</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>SemanticCache.lookup(q)</code> TF-IDF'i <em>geçmiş sorgular + yeni sorgu</em> üzerinde fit eder; geçmiş sorgulardan biri benzerlik eşiğini aşıyorsa saklanmış cevabı döndürür — <code>RedisSemanticCache</code>'in embedding'lerle yaptığı aynı mantık. 2) <code>slow_llm(q)</code> gerçek LLM gecikmesini taklit etmek için 50ms uyur; basılan ms'leri karşılaştırmak cache kazancını doğrudan gösterir. 3) Dört sorgulu döngü üç cache durumunu kapsar: tam hit, semantik-benzer hit ("Duygu analizini anlat" "Duygu analizi nedir?" ile eşleşir) ve miss. 4) <code>threshold</code>'u ayarlayın: çok yüksek = çoğunlukla miss (maliyet kazancı yok), çok düşük = bayat veya yanlış cevaplar — üretim Redis sürümüyle aynı operasyon eğrisi takası.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Maliyet optimizasyon taktikleri</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1. Modelleri kademelendirin.</strong> Varsayılan gpt-4o-mini; bir router LLM zor sorgu tespit ederse gpt-4o'ya yönlendirin.</div>
<div class="calc-step"><strong>2. Agresif önbellek.</strong> %30 semantik cache hit-rate LLM faturanızı %30 azaltır.</div>
<div class="calc-step"><strong>3. Bağlamı sınırlayın.</strong> Top-20 değil, top-4 yeniden sıralanmış chunk. Az çoktur — ve daha ucuz.</div>
<div class="calc-step"><strong>4. Stream ve iptal.</strong> Kullanıcı yanıt ortasında uzaklaşırsa stream'i iptal edin — kısmi çıktılar da faturalanır ama tamamlanandan az.</div>
<div class="calc-step"><strong>5. Prompt caching kullanın</strong> (Anthropic/OpenAI) uzun sabit system prompt için — tekrarlı önekler için %90 daha az ödeyin.</div>
<div class="calc-step"><strong>6. Offline işleri batch'le.</strong> OpenAI batch API = %50 indirim, 24 saat SLA — gece df_reviews sınıflandırması için mükemmel.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Beş satırlık LangServe yayın tarifi</h2>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Dockerfile</span>
FROM python:<span class="num">3.12</span>-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app.py .
CMD [<span class="str">"uvicorn"</span>, <span class="str">"app:app"</span>, <span class="str">"--host"</span>, <span class="str">"0.0.0.0"</span>, <span class="str">"--port"</span>, <span class="str">"8000"</span>]</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>FROM python:3.12-slim</code> küçük bir baz imaj seçer — push edilecek daha az megabayt, yamalanacak daha az CVE. 2) <code>COPY requirements.txt</code> + <code>RUN pip install</code> iki satırda; böylece Docker bağımlılıklarınız değişene kadar deps katmanını cache'ler. 3) <code>COPY app.py</code> en sona; kodunuzu düzenlemek yalnızca son katmanı geçersiz kılar — hızlı kademeli build'ler. 4) <code>CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]</code> LangServe uygulamasını tüm arayüzlere bağlı başlatır; container dışarıdan erişilebilir olur.</p>
<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>docker build -t my-rag .
docker run -p <span class="num">8000</span>:<span class="num">8000</span> -e OPENAI_API_KEY=$OPENAI_API_KEY my-rag
<span class="cm"># Bir reverse proxy (nginx/Caddy) arkasında TLS sonlandırın ve rate limit ekleyin.</span></code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>docker build -t my-rag .</code> Dockerfile'ı okur ve <code>my-rag</code> etiketli bir imaj üretir — CI'nizin registry'ye gönderdiği aynı artifact. 2) <code>docker run -p 8000:8000</code> container'ın 8000 portunu host'a eşler; böylece LangServe API'sine <code>http://localhost:8000</code>'den erişilir. 3) <code>-e OPENAI_API_KEY=$OPENAI_API_KEY</code> API anahtarını env var olarak enjekte eder — secret'ları imajın içinden uzak tutun. 4) Container'ın önüne TLS sonlandırma, IP başına rate limit ve istek loglaması için nginx veya Caddy koyun — LangServe'in kasten kenara bıraktığı üç endişe.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Maliyet azaltma yığını — örnek</h2>
<div id="lc-l11-cost-tr" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var stages=['taban','+ kademe yönlendirme','+ semantik cache','+ rerank top-4','+ prompt cache','+ offline batch'];
  var cost=[100, 70, 49, 41, 30, 22];
  var data=[{type:'scatter',mode:'lines+markers',x:stages,y:cost,
    line:{color:T,width:3},marker:{size:14,color:T},
    text:cost.map(c=>c+'%'),textposition:'top center'}];
  var layout={title:'Optimizasyon katmanları arası birikimli maliyet azaltımı',
    xaxis:{title:''},yaxis:{title:'aylık LLM maliyeti (taban %)',range:[0,110]},
    margin:{l:70,r:30,t:60,b:140},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l11-cost-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L12 <strong>capstone</strong>: gerçek bir müşteri-destek RAG botu, L1-L11'deki her şeyi bir araya dikiyor — hibrit retrieval, reranking, memory, SQL için agent, gözlemlenebilirlik ve üretim kontrol listesi.</p>
</div>
`
};
