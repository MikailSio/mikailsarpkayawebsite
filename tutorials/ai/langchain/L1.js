window.LANGCHAIN_L1 = {
en: `<p class="l-text"><strong>Hook.</strong> ChatGPT is a model, not an application. The moment you want to build a real product on top of an LLM, you discover that a single API call is never enough — you need prompt templates, conversation memory, retrieval over your own documents, tool use, error handling, observability, and a way to swap providers. <strong>LangChain</strong> is a framework that bundles these primitives so you can compose LLM applications instead of glueing strings together.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Identify the seven core LangChain abstractions (LLM, Prompt, Parser, Chain, Memory, Retriever, Agent)</li>
<li>Build a 3-line LCEL chain with the <code>prompt | llm | parser</code> pipe pattern</li>
<li>Compare LangChain LCEL syntax against the deprecated <code>LLMChain</code> API</li>
<li>Map the LLM application stack: provider, orchestration, app, observability layers</li>
<li>Decide when to reach for LangChain vs LlamaIndex, Haystack, or raw SDK calls</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Why a framework at all?</h2>
<p class="l-text">A naive script that calls <code>openai.ChatCompletion.create()</code> works for a demo. But production LLM apps repeatedly hit the same problems: the prompt grows, you need to inject variables, format JSON output, retry on rate limits, log every request, swap GPT-4 for Claude, add a knowledge base, and remember what the user said three turns ago. Reinventing these primitives once is fine; doing it for every project is wasteful.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Without a framework</div><div class="calc-card-desc">Hard-coded f-strings, ad-hoc retries, no memory, no retrieval, locked to one provider.</div></div>
<div class="calc-card"><div class="calc-card-title">With LangChain</div><div class="calc-card-desc">Composable Runnables, swappable LLMs, retrievers, parsers, agents, tracing.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. The seven core abstractions</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">LLM / ChatModel</div><div class="calc-card-desc">Wrapper around an LLM API (OpenAI, Anthropic, local). Same interface everywhere.</div></div>
<div class="calc-card"><div class="calc-card-title">PromptTemplate</div><div class="calc-card-desc">Parameterized prompts with variables, few-shot examples, system messages.</div></div>
<div class="calc-card"><div class="calc-card-title">OutputParser</div><div class="calc-card-desc">Force structured output: Pydantic schemas, JSON, lists.</div></div>
<div class="calc-card"><div class="calc-card-title">Chain / Runnable</div><div class="calc-card-desc">Compose steps: prompt | llm | parser. The pipe operator (LCEL) is core.</div></div>
<div class="calc-card"><div class="calc-card-title">Memory</div><div class="calc-card-desc">Persist conversation state between calls.</div></div>
<div class="calc-card"><div class="calc-card-title">Retriever</div><div class="calc-card-desc">Pull relevant context from a vector store, SQL, web — fuel for RAG.</div></div>
<div class="calc-card"><div class="calc-card-title">Agent + Tool</div><div class="calc-card-desc">Let the LLM decide which function to call (calculator, web search, SQL).</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Three-line chat with LangChain</h2>
<p class="l-text">The minimal "hello world" of LangChain — a prompt, a model, a parser, glued with the pipe operator. This is the same shape you will use for production chains.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"You are a helpful NLP tutor."</span>),
    (<span class="str">"human"</span>, <span class="str">"Explain {topic} in one sentence."</span>)
])
llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
chain = prompt | llm | <span class="fn">StrOutputParser</span>()

<span class="fn">print</span>(chain.<span class="fn">invoke</span>({<span class="str">"topic"</span>: <span class="str">"TF-IDF"</span>}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports the chat model wrapper, ChatPromptTemplate, and StrOutputParser from langchain_core. 2) Builds a prompt with system + human messages; the \`{topic}\` placeholder is filled at invoke time. 3) Composes \`prompt | llm | StrOutputParser()\` — LCEL's pipe operator threads the previous step's output into the next, returning a single Runnable. 4) \`chain.invoke({...})\` runs the whole pipeline synchronously; switch to \`.stream(...)\` to get token-by-token output, or \`.ainvoke(...)\` for async.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">The same prompt | model | parser shape, but with str.format() as the prompt template, a fake "model" function as the LLM, and str.strip() as the parser. The mental model is identical to LCEL.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Manual LCEL: prompt | llm | parser
def prompt_step(vars):
    tmpl = "System: You are a helpful NLP tutor.\nHuman: Explain {topic} in one sentence."
    return tmpl.format(**vars)

def fake_llm(text):
    # Stand-in for ChatOpenAI: returns a canned answer per topic
    answers = {"TF-IDF": "  TF-IDF weights words by frequency in a document, down-weighted by how common they are across the corpus.  "}
    for k, v in answers.items():
        if k in text:
            return v
    return "  (no answer)  "

def parser_step(s):
    return s.strip()

# Compose: pipe = parser(llm(prompt(x)))
def pipe(vars):
    return parser_step(fake_llm(prompt_step(vars)))

print(pipe({"topic": "TF-IDF"}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) A \`fake_llm\` / \`mock_llm\` stand-in returns canned responses so the example runs without an API key — the structural lesson is what matters. 2) The surrounding code (prompt formatting, parsing, looping) is identical to what you would write against a real model — only the LLM call is mocked. 3) To upgrade, replace the mock with \`ChatOpenAI(...)\` or \`ChatAnthropic(...)\` and supply credentials — no other changes needed. 4) This is also the recipe for unit-testing chains: inject a deterministic stub LLM in tests so assertions are stable.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Where LangChain sits in the stack</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Layer 1 — LLM provider:</strong> OpenAI, Anthropic, Mistral, local Llama via Ollama or vLLM.</div>
<div class="calc-step"><strong>Layer 2 — Orchestration (LangChain):</strong> templates, chains, retrievers, agents, memory.</div>
<div class="calc-step"><strong>Layer 3 — Application:</strong> FastAPI / LangServe / Streamlit / Next.js front-end.</div>
<div class="calc-step"><strong>Layer 4 — Observability:</strong> LangSmith / LangFuse / Helicone for traces and evals.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Alternatives — which framework when?</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Tool</div><div>Sweet spot</div></div>
<div class="cmp-row"><div>LangChain</div><div>General LLM apps, agents, broad integrations</div></div>
<div class="cmp-row"><div>LlamaIndex</div><div>RAG-first; best document loaders + indexing primitives</div></div>
<div class="cmp-row"><div>Haystack</div><div>Production search/RAG pipelines, deepset background</div></div>
<div class="cmp-row"><div>LiteLLM</div><div>Thin proxy for 100+ providers, no orchestration</div></div>
<div class="cmp-row"><div>Semantic Kernel</div><div>Microsoft stack, .NET / C# friendly</div></div>
<div class="cmp-row"><div>DSPy</div><div>Optimize prompts as programs (Stanford research direction)</div></div>
</div>
<p class="l-text">In practice teams often combine: LangChain for orchestration + LlamaIndex for indexing + LiteLLM for cost-aware routing.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Mental model — chain of Runnables</h2>
<p class="l-text">Internally everything in modern LangChain is a <strong>Runnable</strong> with three methods: <code>invoke</code> (sync), <code>ainvoke</code> (async), <code>stream</code>. Composition with <code>|</code> simply wraps them into a <code>RunnableSequence</code>. This makes any chain testable: feed input, assert output, no magic.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableLambda

double = <span class="fn">RunnableLambda</span>(<span class="kw">lambda</span> x: x * <span class="num">2</span>)
add_one = <span class="fn">RunnableLambda</span>(<span class="kw">lambda</span> x: x + <span class="num">1</span>)
pipeline = double | add_one
<span class="fn">print</span>(pipeline.<span class="fn">invoke</span>(<span class="num">5</span>))   <span class="cm"># (5*2)+1 = 11</span>

<span class="cm"># Even pure-Python steps are Runnables — that's why LCEL composes</span>
<span class="cm"># LLM calls, retrievers, parsers, and your business logic uniformly.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`RunnableLambda\` lifts an ordinary Python function into the LCEL runnable interface so it gains \`.invoke\`, \`.stream\`, and \`.ainvoke\`. 2) The pipe operator chains two Runnables — output of the first becomes the input of the second. 3) \`pipeline.invoke(x)\` runs the composition end-to-end; the same chain works in streaming or async mode without changes. 4) The takeaway: LLM calls, retrievers, parsers, and your own Python steps share one Runnable contract — that uniformity is what makes LCEL composable.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A Runnable is just a callable with .invoke. Compose two of them with function composition — that is all LCEL does under the hood.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Tiny Runnable + pipe operator built from scratch
class Runnable:
    def __init__(self, fn):
        self.fn = fn
    def invoke(self, x):
        return self.fn(x)
    def __or__(self, other):
        return Runnable(lambda x: other.invoke(self.invoke(x)))

double  = Runnable(lambda x: x * 2)
add_one = Runnable(lambda x: x + 1)
pipeline = double | add_one

print(pipeline.invoke(5))      # (5*2)+1 = 11
print(pipeline.invoke(10))     # (10*2)+1 = 21
print([pipeline.invoke(i) for i in range(5)])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a tiny \`Runnable\` class with two essentials: \`.invoke(x)\` to execute, and \`__or__\` to overload the \`|\` operator for composition. 2) Each \`Runnable\` wraps a plain Python function — the same contract LangChain uses internally. 3) Composing two Runnables with \`|\` produces a new Runnable whose \`.invoke\` calls them in order — left then right. 4) Demonstrates LCEL is not magic: it is function composition with a fluent operator, which is why pure-Python steps mix with LLM steps seamlessly.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Where this course is heading</h2>
<div class="calc-steps">
<div class="calc-step"><strong>L2-L4:</strong> Chat models, prompts, chains — the core composition kit.</div>
<div class="calc-step"><strong>L5-L7:</strong> Embeddings, vector stores, RAG, document loaders/splitters.</div>
<div class="calc-step"><strong>L8-L9:</strong> Memory and agents — stateful, tool-using LLM apps.</div>
<div class="calc-step"><strong>L10:</strong> Advanced RAG — reranking, HyDE, multi-query, evaluation.</div>
<div class="calc-step"><strong>L11-L12:</strong> Productionizing — LangServe, observability, caching, end-to-end capstone.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Adoption snapshot — visualize the ecosystem</h2>
<div id="lc-l1-stack-en" style="width:100%;height:400px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var data=[{type:'bar',orientation:'h',
    y:['LangChain','LlamaIndex','Haystack','LiteLLM','DSPy','Semantic Kernel'],
    x:[95,70,40,55,25,20],
    marker:{color:T},text:['95k','70k','40k','55k','25k','20k'],textposition:'outside'}];
  var layout={
    xaxis:{title:'stars (thousands)'},margin:{l:140,r:40,t:30,b:50},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l1-stack-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next lesson</h2>
<p class="l-text">L2 dives into <strong>chat models</strong> — message types, streaming, token counting, retries, and switching providers without rewriting your app.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> ChatGPT bir modeldir, bir uygulama değil. Bir LLM üzerine gerçek bir ürün kurmaya başladığınız anda fark edersiniz: tek bir API çağrısı asla yetmez — prompt şablonları, konuşma hafızası, kendi belgeleriniz üzerinde retrieval, araç kullanımı, hata yönetimi, gözlemlenebilirlik ve sağlayıcıyı değiştirebilme yeteneği gerekir. <strong>LangChain</strong> bu temel bileşenleri bir araya getiren bir çerçevedir; string'leri yapıştırmak yerine LLM uygulamalarını <em>kompoze</em> edersiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yedi temel LangChain soyutlamasını tanımlamayı (LLM, Prompt, Parser, Chain, Memory, Retriever, Agent)</li>
<li><code>prompt | llm | parser</code> pipe deseniyle 3 satırlık bir LCEL chain kurmayı</li>
<li>LangChain LCEL sözdizimini eskiyen <code>LLMChain</code> API'siyle karşılaştırmayı</li>
<li>LLM uygulama yığınını çıkarmayı: sağlayıcı, orkestrasyon, uygulama ve gözlemlenebilirlik katmanları</li>
<li>LangChain ile LlamaIndex, Haystack veya ham SDK çağrıları arasında ne zaman seçim yapacağına karar vermeyi</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Neden bir çerçeve?</h2>
<p class="l-text">Tek satır <code>openai.ChatCompletion.create()</code> çağrısı demo için iyidir. Ama üretimde aynı sorunlar tekrarlanır: prompt büyür, değişken enjekte etmeniz gerekir, JSON çıktı biçimlendirmek istersiniz, rate limit'te yeniden denersiniz, sağlayıcıyı GPT-4'ten Claude'a çevirirsiniz, bilgi tabanı eklersiniz ve üç tür önce kullanıcının ne dediğini hatırlamanız gerekir. Bu temelleri bir kez yazmak makul; her projede yeniden yazmak israf.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Çerçevesiz</div><div class="calc-card-desc">Sabit f-string'ler, geçici retry'lar, hafıza yok, retrieval yok, tek sağlayıcıya bağlı.</div></div>
<div class="calc-card"><div class="calc-card-title">LangChain ile</div><div class="calc-card-desc">Birleştirilebilir Runnable'lar, takılıp çıkarılan LLM'ler, retriever'lar, parser'lar, agent'lar, izleme.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Yedi temel soyutlama</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">LLM / ChatModel</div><div class="calc-card-desc">LLM API'si üzerine sarmalayıcı (OpenAI, Anthropic, yerel). Her yerde aynı arayüz.</div></div>
<div class="calc-card"><div class="calc-card-title">PromptTemplate</div><div class="calc-card-desc">Değişkenli, few-shot örnekli, sistem mesajlı parametrik prompt'lar.</div></div>
<div class="calc-card"><div class="calc-card-title">OutputParser</div><div class="calc-card-desc">Yapılı çıktı zorla: Pydantic şemaları, JSON, listeler.</div></div>
<div class="calc-card"><div class="calc-card-title">Chain / Runnable</div><div class="calc-card-desc">Adımları birleştir: prompt | llm | parser. Pipe operatörü (LCEL) çekirdektir.</div></div>
<div class="calc-card"><div class="calc-card-title">Memory</div><div class="calc-card-desc">Çağrılar arasında konuşma durumunu sakla.</div></div>
<div class="calc-card"><div class="calc-card-title">Retriever</div><div class="calc-card-desc">Vektör deposu, SQL, web'den ilgili bağlamı çek — RAG'ın yakıtı.</div></div>
<div class="calc-card"><div class="calc-card-title">Agent + Tool</div><div class="calc-card-desc">LLM hangi fonksiyonu çağıracağına karar versin (hesap makinesi, web arama, SQL).</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Üç satırla LangChain sohbeti</h2>
<p class="l-text">LangChain'in minimal "merhaba dünya"sı — bir prompt, bir model, bir parser; pipe operatörüyle birleşmiş. Üretim chain'lerinde de kullanacağınız şekil tam olarak budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Yardımcı bir NLP eğitmenisin."</span>),
    (<span class="str">"human"</span>, <span class="str">"{topic} konusunu bir cümlede açıkla."</span>)
])
llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
chain = prompt | llm | <span class="fn">StrOutputParser</span>()

<span class="fn">print</span>(chain.<span class="fn">invoke</span>({<span class="str">"topic"</span>: <span class="str">"TF-IDF"</span>}))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Sohbet modeli sarmalayıcısını, ChatPromptTemplate'i ve StrOutputParser'ı langchain_core'dan import eder. 2) System + human mesajlarıyla bir prompt kurar; \`{topic}\` placeholder'ı invoke anında doldurulur. 3) \`prompt | llm | StrOutputParser()\` — LCEL pipe operatörü bir önceki adımın çıktısını sonrakine aktarır ve tek bir Runnable döndürür. 4) \`chain.invoke({...})\` zinciri senkron çalıştırır; token-token çıktı için \`.stream(...)\`, async için \`.ainvoke(...)\` kullanın.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı prompt | model | parser şekli; ama prompt yerine str.format(), LLM yerine sahte bir fonksiyon, parser yerine str.strip(). Zihinsel model birebir LCEL ile aynı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Manuel LCEL: prompt | llm | parser
def prompt_step(vars):
    tmpl = "Sistem: Yardımcı bir NLP eğitmenisin.\nKullanıcı: {topic} konusunu bir cümlede açıkla."
    return tmpl.format(**vars)

def fake_llm(text):
    # ChatOpenAI yerine: konuya göre hazır cevap döndür
    cevaplar = {"TF-IDF": "  TF-IDF, kelimeleri belge içindeki sıklığa göre ağırlıklandırır; korpusta yaygın olanları azaltır.  "}
    for k, v in cevaplar.items():
        if k in text:
            return v
    return "  (cevap yok)  "

def parser_step(s):
    return s.strip()

# Birleştir: pipe = parser(llm(prompt(x)))
def pipe(vars):
    return parser_step(fake_llm(prompt_step(vars)))

print(pipe({"topic": "TF-IDF"}))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Bir \`fake_llm\` / \`mock_llm\` stand-in API key olmadan çalışsın diye hazır yanıtlar döndürür — önemli olan yapısal derstir. 2) Çevresindeki kod (prompt formatlama, parsing, döngü) gerçek bir modele karşı yazacağınızla aynıdır — sadece LLM çağrısı mock'lanmıştır. 3) Yükseltmek için mock'u \`ChatOpenAI(...)\` veya \`ChatAnthropic(...)\` ile değiştirin ve kimlik bilgileri verin — başka değişiklik gerekmez. 4) Bu aynı zamanda zincirleri unit-test etme tarifidir: testlerde deterministik bir stub LLM enjekte edin, assertion'lar stabil olsun.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. LangChain yığında nereye oturur?</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Katman 1 — LLM sağlayıcı:</strong> OpenAI, Anthropic, Mistral, Ollama/vLLM ile yerel Llama.</div>
<div class="calc-step"><strong>Katman 2 — Orkestrasyon (LangChain):</strong> şablonlar, chain'ler, retriever'lar, agent'lar, memory.</div>
<div class="calc-step"><strong>Katman 3 — Uygulama:</strong> FastAPI / LangServe / Streamlit / Next.js önyüz.</div>
<div class="calc-step"><strong>Katman 4 — Gözlemlenebilirlik:</strong> izleme ve değerlendirme için LangSmith / LangFuse / Helicone.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Alternatifler — hangi çerçeve ne zaman?</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Araç</div><div>Güçlü olduğu alan</div></div>
<div class="cmp-row"><div>LangChain</div><div>Genel LLM uygulamaları, agent'lar, geniş entegrasyon</div></div>
<div class="cmp-row"><div>LlamaIndex</div><div>RAG odaklı; en iyi belge yükleyici + indeksleme primitifleri</div></div>
<div class="cmp-row"><div>Haystack</div><div>Üretim arama/RAG hatları, deepset arka planı</div></div>
<div class="cmp-row"><div>LiteLLM</div><div>100+ sağlayıcı için ince proxy, orkestrasyon yok</div></div>
<div class="cmp-row"><div>Semantic Kernel</div><div>Microsoft yığını, .NET / C# dostu</div></div>
<div class="cmp-row"><div>DSPy</div><div>Prompt'ları program olarak optimize et (Stanford araştırma yönü)</div></div>
</div>
<p class="l-text">Pratikte ekipler genelde birleştirir: orkestrasyon için LangChain + indeksleme için LlamaIndex + maliyet odaklı yönlendirme için LiteLLM.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Zihinsel model — Runnable zinciri</h2>
<p class="l-text">Modern LangChain'de her şey üç metoda sahip bir <strong>Runnable</strong>'dır: <code>invoke</code> (senkron), <code>ainvoke</code> (async), <code>stream</code>. <code>|</code> ile kompozisyon onları bir <code>RunnableSequence</code>'a sarar. Bu her zinciri test edilebilir kılar: girdiyi ver, çıktıyı doğrula, sihir yok.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableLambda

double = <span class="fn">RunnableLambda</span>(<span class="kw">lambda</span> x: x * <span class="num">2</span>)
add_one = <span class="fn">RunnableLambda</span>(<span class="kw">lambda</span> x: x + <span class="num">1</span>)
pipeline = double | add_one
<span class="fn">print</span>(pipeline.<span class="fn">invoke</span>(<span class="num">5</span>))   <span class="cm"># (5*2)+1 = 11</span>

<span class="cm"># Saf-Python adımlar bile Runnable'dır — bu yüzden LCEL</span>
<span class="cm"># LLM çağrılarını, retriever'ları, parser'ları ve iş mantığınızı tek tipte birleştirir.</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) \`RunnableLambda\` sıradan bir Python fonksiyonunu LCEL Runnable arayüzüne yükseltir; böylece \`.invoke\`, \`.stream\`, \`.ainvoke\` kazanır. 2) Pipe operatörü iki Runnable'ı zincirler — birincinin çıktısı ikinciye girdi olur. 3) \`pipeline.invoke(x)\` kompozisyonu uçtan uca çalıştırır; aynı zincir streaming veya async modda da değişiklik olmadan çalışır. 4) Önemli nokta: LLM çağrıları, retriever'lar, parser'lar ve kendi Python adımlarınız aynı Runnable kontratını paylaşır — LCEL'i kompoze edilebilir kılan bu tek-tipliliktir.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir Runnable, .invoke metoduna sahip bir callable'dır, hepsi bu. İki tanesini fonksiyon kompozisyonuyla birleştirin — LCEL'in arka planda yaptığı tek şey budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Sıfırdan minik Runnable + pipe operatörü
class Runnable:
    def __init__(self, fn):
        self.fn = fn
    def invoke(self, x):
        return self.fn(x)
    def __or__(self, other):
        return Runnable(lambda x: other.invoke(self.invoke(x)))

double  = Runnable(lambda x: x * 2)
add_one = Runnable(lambda x: x + 1)
pipeline = double | add_one

print(pipeline.invoke(5))      # (5*2)+1 = 11
print(pipeline.invoke(10))     # (10*2)+1 = 21
print([pipeline.invoke(i) for i in range(5)])</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) İki temel ile minik bir \`Runnable\` sınıfı tanımlar: çalıştırma için \`.invoke(x)\` ve kompozisyon için \`|\` operatörünü aşırı yükleyen \`__or__\`. 2) Her \`Runnable\` saf bir Python fonksiyonunu sarmalar — LangChain'in içeride kullandığı aynı kontrat. 3) İki Runnable'ı \`|\` ile kompoze etmek, \`.invoke\`'u sırayla — önce sol, sonra sağ — çağıran yeni bir Runnable üretir. 4) Gösterir ki LCEL sihir değil: akıcı bir operatör ile fonksiyon kompozisyonudur; bu yüzden saf Python adımları LLM adımlarıyla sorunsuz karışır.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Bu kurs nereye gidiyor</h2>
<div class="calc-steps">
<div class="calc-step"><strong>L2-L4:</strong> Sohbet modelleri, prompt'lar, chain'ler — temel kompozisyon kiti.</div>
<div class="calc-step"><strong>L5-L7:</strong> Embedding'ler, vektör depoları, RAG, belge yükleyiciler/böleyiciler.</div>
<div class="calc-step"><strong>L8-L9:</strong> Memory ve agent'lar — durumlu, araç kullanan LLM uygulamaları.</div>
<div class="calc-step"><strong>L10:</strong> İleri RAG — reranking, HyDE, multi-query, değerlendirme.</div>
<div class="calc-step"><strong>L11-L12:</strong> Üretim — LangServe, gözlemlenebilirlik, önbellek, uçtan uca capstone.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Ekosistem fotoğrafı — görselleştirme</h2>
<div id="lc-l1-stack-tr" style="width:100%;height:400px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var data=[{type:'bar',orientation:'h',
    y:['LangChain','LlamaIndex','Haystack','LiteLLM','DSPy','Semantic Kernel'],
    x:[95,70,40,55,25,20],
    marker:{color:T},text:['95k','70k','40k','55k','25k','20k'],textposition:'outside'}];
  var layout={
    xaxis:{title:'yıldız (bin)'},margin:{l:140,r:40,t:30,b:50},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l1-stack-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki ders</h2>
<p class="l-text">L2 <strong>sohbet modellerine</strong> giriyor — mesaj türleri, streaming, token sayma, yeniden deneme ve uygulamayı yeniden yazmadan sağlayıcı değiştirme.</p>
</div>
`
};
