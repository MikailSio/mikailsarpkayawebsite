window.MLOPS_L11 = {
en: `<p class="l-text"><strong>Hook:</strong> classical ML ops worried about feature drift. LLM ops worries about <em>prompt drift</em>, <em>token cost</em>, <em>hallucinations</em>, <em>rate limits</em>, and <em>vector index freshness</em>. Same DNA, very different problems.</p>
<p class="l-text">In this lesson we map what changes when you go from sklearn-in-production to LLM-in-production: prompts, chains, RAG, observability, evals, and the per-token economy.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Identify what LLM ops adds beyond sklearn: tokens, prompts, RAG, hallucinations</li>
<li>Trace LLM calls end-to-end with LangSmith spans, latency, and cost tags</li>
<li>Version prompts in git with template IDs and A/B compare two variants</li>
<li>Run an LLM eval suite measuring faithfulness, relevance, and toxicity</li>
<li>Track per-call token cost and set guardrails against runaway spend</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What's Different About LLM Ops?</h2>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Classical ML</strong><br/>You own the weights. Inputs are tabular. Output is a number/class.</div><div class="calc-compare-cell"><strong>LLM</strong><br/>Often someone else's weights via API. Inputs are prompts + context + tools. Output is unstructured text.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Cost: hardware-bounded</div><div class="calc-compare-cell">Cost: per-token, scales with text length</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Failure mode: silent metric drop</div><div class="calc-compare-cell">Failure mode: hallucination, jailbreak, prompt injection</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Eval: AUC, F1</div><div class="calc-compare-cell">Eval: human, LLM-as-judge, golden datasets</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The LLM Stack</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Prompt</strong> — versioned template stored in git or a prompt registry.</div>
<div class="calc-step"><strong>Retrieval</strong> — vector DB (pgvector, Pinecone, Weaviate, Qdrant) feeds context.</div>
<div class="calc-step"><strong>Chain / agent</strong> — LangChain, LlamaIndex, custom Python orchestrating model calls + tools.</div>
<div class="calc-step"><strong>Model</strong> — OpenAI/Anthropic API, or self-hosted (vLLM, TGI, llama.cpp).</div>
<div class="calc-step"><strong>Guardrails</strong> — input filtering, PII redaction, output validation.</div>
<div class="calc-step"><strong>Observability</strong> — trace every step: tokens, latency, cost.</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Observability: What to Trace</h2>
<p class="l-text">A single user message can spawn 10 LLM calls (router → retriever rerank → main answer → fact-check). Without traces you're flying blind.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">LangSmith</div><div class="calc-card-body">LangChain's tracing + eval platform; OTel-compatible.</div></div>
<div class="calc-card"><div class="calc-card-title">LangFuse</div><div class="calc-card-body">Open source; self-host friendly.</div></div>
<div class="calc-card"><div class="calc-card-title">Helicone</div><div class="calc-card-body">Proxy-based; just add to your base URL.</div></div>
<div class="calc-card"><div class="calc-card-title">Phoenix (Arize)</div><div class="calc-card-body">Open source LLM observability + evaluation.</div></div>
</div>
<p class="l-text">Every span needs: prompt template id + version, model name, input tokens, output tokens, latency, cost USD, retrieval hits, user/session id.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Prompt Versioning</h2>
<p class="l-text">Prompts ARE code. They deserve git, semver, code review and rollback. Three patterns:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Pattern A — file-based, versioned in git</span>
<span class="cm"># prompts/qa_v1.txt, prompts/qa_v2.txt</span>
PROMPT_VERSION = <span class="str">"qa_v2"</span>
template = <span class="fn">open</span>(f<span class="str">"prompts/{PROMPT_VERSION}.txt"</span>).<span class="fn">read</span>()

<span class="cm"># Pattern B — registry (LangSmith, LangFuse) with named versions</span>
<span class="cm"># prompt = client.pull_prompt("qa", version="2")</span>

<span class="cm"># Pattern C — DB row keyed by hash</span>
<span class="cm"># row = db.query("SELECT body FROM prompts WHERE sha = %s", sha)</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Pattern A keeps prompts as <code>prompts/qa_v1.txt</code> files in git — every change is a diff, every release a tag, every rollback a <code>git checkout</code>. 2) <code>open("prompts/qa_v1.txt").read().format(question=q)</code> renders the template at call time. 3) Pattern B uses LangSmith/LangFuse: prompts live in a registry with version IDs, A/B variants, and live eval metrics. 4) The Python <code>client.pull_prompt("qa", version="v3")</code> fetches the active version — your code never hardcodes a string. 5) Choose A for small teams (auditability through git) and B for large orgs (non-engineers can edit prompts safely).</p>
<p class="l-text">Whatever pattern: log <em>which prompt version produced which output</em> on every request. When quality regresses you need to bisect.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Evaluation</h2>
<p class="l-text">Three levels, used together.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Golden dataset</div><div class="calc-card-body">~50-500 input/expected pairs. Run on every PR; catches obvious regressions.</div></div>
<div class="calc-card"><div class="calc-card-title">LLM-as-judge</div><div class="calc-card-body">A bigger model rates outputs (helpfulness, faithfulness). Cheap automation, biased toward the judge's style.</div></div>
<div class="calc-card"><div class="calc-card-title">Human review</div><div class="calc-card-body">Sampled outputs labeled by humans. Slow, expensive, the only ground truth on subjective tasks.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — needs an LLM API</span>
<span class="cm"><span class="cm"># from openai import OpenAI</span>
<span class="cm"><span class="cm"># client = OpenAI()</span>
<span class="cm"><span class="cm"># def judge(question, answer):</span>
<span class="cm"><span class="cm">#     prompt = f"Rate 1-5 how well this answers the question.\\nQ:{question}\\nA:{answer}"</span>
<span class="cm"><span class="cm">#     return int(client.chat.completions.create(</span>
<span class="cm"><span class="cm">#         model="gpt-4o-mini", messages=[{"role":"user","content":prompt}]</span>
<span class="cm"><span class="cm">#     ).choices[0].message.content[0])</span></span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The commented <code>OpenAI()</code> client is the live LLM call you'd run in CI on a fixed eval set. 2) For each <code>question, gold</code> pair you'd call <code>chat.completions.create(model="gpt-4o-mini", messages=[...])</code>. 3) The response is compared against <code>gold</code> via BLEU, ROUGE, or an LLM-as-judge (another model rating the answer 1–5). 4) <code>track_token_cost</code> sums <code>response.usage.total_tokens × $price/1k</code> per run — you watch this drift over time. 5) Commented because there's no LLM API in Pyodide; the next cell scores cached predictions against gold using TF-IDF similarity.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same eval loop without an LLM: a TF-IDF judge scores how well an answer overlaps the expected answer (cosine similarity → 1-5 grade). We run it across a tiny golden set just like an evals harness.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

GOLDEN = [
    {"q": "What is RAG?",        "a": "Retrieval Augmented Generation",
     "expected": "Retrieval Augmented Generation combines retrieval and an LLM."},
    {"q": "Define overfitting.", "a": "Memorizing training data instead of learning patterns",
     "expected": "Overfitting is when a model fits noise and fails on new data."},
    {"q": "What is dropout?",    "a": "Random weight changes",
     "expected": "Dropout randomly zeros activations during training to regularize."},
]

def judge(question, answer, expected):
    v = TfidfVectorizer().fit([answer, expected])
    sim = float(cosine_similarity(v.transform([answer]), v.transform([expected]))[0, 0])
    return max(1, min(5, round(1 + sim * 4)))

results = [{"q": x["q"], "score": judge(x["q"], x["a"], x["expected"])} for x in GOLDEN]
avg = round(sum(r["score"] for r in results) / len(results), 2)
print(json.dumps({"results": results, "avg": avg, "passed": avg >= 3.0}, indent=2))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>EVAL_SET</code> is a small dict of <code>{question: gold_answer}</code> — your regression suite. 2) <code>PREDS</code> simulates two model versions answering the same questions — what a CI eval run would produce. 3) <code>TfidfVectorizer + cosine_similarity</code> gives a cheap semantic-overlap score; for harder cases you'd swap in a sentence-transformer or LLM judge. 4) <code>mean_similarity</code> is computed per model version — the headline regression metric. 5) The version-over-version delta tells you whether your latest prompt or model swap improved or regressed quality before you ship.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Cost Tracking</h2>
<p class="l-text">LLM economics are token economics. A leaky chain that retries 5× silently 10× the bill.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Per-call accounting</strong> — log <code>input_tokens</code>, <code>output_tokens</code>, model, USD per call.</div>
<div class="calc-step"><strong>Per-user budget</strong> — block users above a daily / monthly threshold.</div>
<div class="calc-step"><strong>Caching</strong> — semantic cache (vector similarity) for repeated FAQs.</div>
<div class="calc-step"><strong>Tiered routing</strong> — small/cheap model for easy intents; big model only when needed.</div>
</div>
<div id="mlops-l11-graph-en" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Indicative input + output token cost per 1M tokens for a few popular models. Pick the smallest model that hits your quality bar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Production Pitfalls</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Prompt injection</div><div class="calc-card-body">Untrusted text in the context can override system instructions. Sanitize, separate roles.</div></div>
<div class="calc-card"><div class="calc-card-title">Vector staleness</div><div class="calc-card-body">If sources change, re-embed and re-index. Track index version like a model version.</div></div>
<div class="calc-card"><div class="calc-card-title">Rate limits</div><div class="calc-card-body">Provider 429s. Use exponential backoff + per-route concurrency caps.</div></div>
<div class="calc-card"><div class="calc-card-title">PII leakage</div><div class="calc-card-body">Models can memorize. Redact before sending; review outputs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key Takeaways</h2>
<div class="think-box"><div class="think-label">📌 KEY TAKEAWAYS</div><div class="think-body">
<ul>
<li>LLM ops = MLOps + prompt versioning + token economics + hallucination defense.</li>
<li>Trace every step: prompt id, model, tokens, cost, retrieval hits, latency.</li>
<li>Eval at three levels: golden set, LLM-as-judge, human review.</li>
<li>Cost is per-token; cache aggressively, route to small models when possible.</li>
<li>Treat prompts and vector indexes as versioned artifacts — rollback discipline.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l11-graph-en', [
    {x:['Haiku','GPT-4o-mini','Sonnet','GPT-4o','Opus'], y:[0.25, 0.15, 3, 5, 15], name:'input $/1M', type:'bar', marker:{color:accent}},
    {x:['Haiku','GPT-4o-mini','Sonnet','GPT-4o','Opus'], y:[1.25, 0.6, 15, 15, 75], name:'output $/1M', type:'bar', marker:{color:'#888'}}
  ], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, barmode:'group',
    title:'LLM cost per 1M tokens (illustrative, USD)',
    yaxis:{title:'USD per 1M tokens', type:'log'},
    margin:{t:60,r:30,b:60,l:60}, legend:{orientation:'h', y:-0.2}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`,
tr: `<p class="l-text"><strong>Giriş:</strong> klasik ML ops öznitelik kayması derdine düşerdi. LLM ops <em>prompt drift</em>, <em>token maliyeti</em>, <em>halüsinasyon</em>, <em>rate limit</em> ve <em>vektör indeks tazeliği</em> ile uğraşır. Aynı DNA, çok farklı sorunlar.</p>
<p class="l-text">Bu derste sklearn-üretimden LLM-üretime geçince neyin değiştiğini haritalıyoruz: prompt'lar, zincirler, RAG, gözlemlenebilirlik, eval'ler ve token başına ekonomi.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>LLM ops'un sklearn'e ne eklediğini bulacaksın: token, prompt, RAG, halüsinasyon</li>
<li>LangSmith span, latency ve cost tag'leriyle LLM çağrılarını uçtan uca trace edeceksin</li>
<li>Prompt'ları git'te template ID'leriyle sürümleyip iki varyantı A/B karşılaştıracaksın</li>
<li>Faithfulness, relevance ve toxicity ölçen bir LLM eval süiti çalıştıracaksın</li>
<li>Çağrı başı token maliyetini takip edip kaçak harcamaya guardrail koyacaksın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. LLM Ops'ta Ne Farklı?</h2>
<div class="calc-compare">
<div class="calc-compare-row"><div class="calc-compare-cell"><strong>Klasik ML</strong><br/>Ağırlıklara siz sahipsiniz. Girdi tabular. Çıktı sayı/sınıf.</div><div class="calc-compare-cell"><strong>LLM</strong><br/>Genelde başkasının ağırlıkları (API). Girdi prompt + bağlam + araç. Çıktı yapılandırılmamış metin.</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Maliyet: donanım sınırlı</div><div class="calc-compare-cell">Maliyet: token başına, metin uzunluğuyla ölçeklenir</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Hata türü: sessiz metrik düşüşü</div><div class="calc-compare-cell">Hata türü: halüsinasyon, jailbreak, prompt injection</div></div>
<div class="calc-compare-row"><div class="calc-compare-cell">Eval: AUC, F1</div><div class="calc-compare-cell">Eval: insan, LLM-jüri, altın veri kümesi</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. LLM Yığını</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Prompt</strong> — git'te ya da prompt registry'de sürümlü şablon.</div>
<div class="calc-step"><strong>Retrieval</strong> — vektör DB (pgvector, Pinecone, Weaviate, Qdrant) bağlam besler.</div>
<div class="calc-step"><strong>Chain / agent</strong> — LangChain, LlamaIndex ya da özel Python; model çağrı + araç orkestrasyonu.</div>
<div class="calc-step"><strong>Model</strong> — OpenAI/Anthropic API ya da self-hosted (vLLM, TGI, llama.cpp).</div>
<div class="calc-step"><strong>Guardrail</strong> — girdi filtresi, PII redaksiyonu, çıktı doğrulama.</div>
<div class="calc-step"><strong>Gözlemlenebilirlik</strong> — her adımı izle: token, gecikme, maliyet.</div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gözlemlenebilirlik: Neyi İzlemeli?</h2>
<p class="l-text">Tek kullanıcı mesajı 10 LLM çağrısı doğurabilir (router → retriever rerank → ana yanıt → fact-check). Trace olmadan kör uçarsınız.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">LangSmith</div><div class="calc-card-body">LangChain'in tracing + eval platformu; OTel uyumlu.</div></div>
<div class="calc-card"><div class="calc-card-title">LangFuse</div><div class="calc-card-body">Açık kaynak; self-host dostu.</div></div>
<div class="calc-card"><div class="calc-card-title">Helicone</div><div class="calc-card-body">Proxy tabanlı; base URL'inize ekleyin yeter.</div></div>
<div class="calc-card"><div class="calc-card-title">Phoenix (Arize)</div><div class="calc-card-body">Açık kaynak LLM gözlemlenebilirlik + değerlendirme.</div></div>
</div>
<p class="l-text">Her span: prompt şablon id + sürüm, model adı, girdi tokenı, çıktı tokenı, gecikme, USD maliyet, retrieval isabet, kullanıcı/oturum id'si içermeli.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Prompt Sürümleme</h2>
<p class="l-text">Prompt'lar KOD'dur. Git, semver, kod inceleme ve geri alma hak ederler. Üç desen:</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Desen A — dosya tabanlı, git'te sürümlü</span>
<span class="cm"># prompts/qa_v1.txt, prompts/qa_v2.txt</span>
PROMPT_VERSION = <span class="str">"qa_v2"</span>
template = <span class="fn">open</span>(f<span class="str">"prompts/{PROMPT_VERSION}.txt"</span>).<span class="fn">read</span>()

<span class="cm"># Desen B — registry (LangSmith, LangFuse), isimli sürümler</span>
<span class="cm"># prompt = client.pull_prompt("qa", version="2")</span>

<span class="cm"># Desen C — hash anahtarlı DB satırı</span>
<span class="cm"># row = db.query("SELECT body FROM prompts WHERE sha = %s", sha)</span></code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Desen A, prompt'ları <code>prompts/qa_v1.txt</code> dosyaları olarak git'te tutar — her değişiklik bir diff, her release bir tag, her rollback bir <code>git checkout</code>. 2) <code>open("prompts/qa_v1.txt").read().format(question=q)</code>, template'i çağrı anında render eder. 3) Desen B LangSmith/LangFuse kullanır: prompt'lar sürüm ID'leri, A/B varyantları ve canlı eval metrikleri olan bir registry'de yaşar. 4) Python <code>client.pull_prompt("qa", version="v3")</code> aktif sürümü çeker — kodunuz string'i hard-code etmez. 5) Küçük ekipler için A (git üzerinden denetlenebilirlik), büyük organizasyonlar için B (mühendis olmayanlar prompt'u güvenle düzenleyebilir).</p>
<p class="l-text">Hangi desen olursa olsun: her istekte <em>hangi prompt sürümü hangi çıktıyı üretti</em> loglayın. Kalite gerilediğinde bisect etmeniz gerekir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Değerlendirme</h2>
<p class="l-text">Üç katman, birlikte kullanılır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Altın veri kümesi</div><div class="calc-card-body">~50-500 girdi/beklenen çift. Her PR'da çalıştır; bariz regresyonu yakalar.</div></div>
<div class="calc-card"><div class="calc-card-title">LLM-jüri</div><div class="calc-card-body">Daha büyük model çıktıları puanlar (yardımcılık, sadakat). Ucuz otomasyon, jürinin tarzına eğilim.</div></div>
<div class="calc-card"><div class="calc-card-title">İnsan inceleme</div><div class="calc-card-body">Örneklenmiş çıktılar insanlarca etiketlenir. Yavaş, pahalı; öznel görevlerde tek ground truth.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"><span class="cm"># DEMO — LLM API gerekir</span>
<span class="cm"><span class="cm"># from openai import OpenAI</span>
<span class="cm"><span class="cm"># client = OpenAI()</span>
<span class="cm"><span class="cm"># def judge(question, answer):</span>
<span class="cm"><span class="cm">#     prompt = f"Bu yanıt soruyu ne kadar iyi karşılıyor 1-5.\\nS:{question}\\nC:{answer}"</span>
<span class="cm"><span class="cm">#     return int(client.chat.completions.create(</span>
<span class="cm"><span class="cm">#         model="gpt-4o-mini", messages=[{"role":"user","content":prompt}]</span>
<span class="cm"><span class="cm">#     ).choices[0].message.content[0])</span></span></code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Yorumlu <code>OpenAI()</code> client, CI'da sabit bir eval set üzerinde koşturacağınız canlı LLM çağrısıdır. 2) Her <code>question, gold</code> çifti için <code>chat.completions.create(model="gpt-4o-mini", messages=[...])</code> çağrılır. 3) Cevap <code>gold</code> ile BLEU, ROUGE ya da LLM-as-judge (cevabı 1–5 puanlayan başka bir model) ile kıyaslanır. 4) <code>track_token_cost</code>, run başına <code>response.usage.total_tokens × $price/1k</code>'yı toplar — bunu zaman içinde izlersiniz. 5) Yorumlu çünkü Pyodide'de LLM API yok; sonraki hücre, önbelleklenmiş tahminleri TF-IDF benzerliği ile gold'a karşı skorlar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LLM olmadan aynı eval döngüsü: TF-IDF jürisi cevabın beklenen cevapla örtüşmesini puanlıyor (kosinüs benzerliği → 1-5 not). Küçük altın veri kümesinde tıpkı bir evals harness gibi çalıştırıyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

GOLDEN = [
    {"q": "RAG nedir?",          "a": "Retrieval Augmented Generation",
     "expected": "Retrieval Augmented Generation getirme ve LLM birleşimidir."},
    {"q": "Overfitting tanımı?", "a": "Egitim verisini ezberlemek",
     "expected": "Overfitting modelin gurultuyu ogrenip yeni veride basarisiz olmasidir."},
    {"q": "Dropout nedir?",      "a": "Rastgele agirlik degisimi",
     "expected": "Dropout egitimde aktivasyonlari rastgele sifirlayarak duzenleme yapar."},
]

def judge(question, answer, expected):
    v = TfidfVectorizer().fit([answer, expected])
    sim = float(cosine_similarity(v.transform([answer]), v.transform([expected]))[0, 0])
    return max(1, min(5, round(1 + sim * 4)))

results = [{"q": x["q"], "score": judge(x["q"], x["a"], x["expected"])} for x in GOLDEN]
avg = round(sum(r["score"] for r in results) / len(results), 2)
print(json.dumps({"results": results, "avg": avg, "passed": avg >= 3.0}, indent=2, ensure_ascii=False))</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>EVAL_SET</code>, küçük bir <code>{soru: altın_cevap}</code> dict'i — regresyon test takımınız. 2) <code>PREDS</code>, aynı soruları cevaplayan iki model sürümünü simüle eder — CI eval çalıştırmasının üreteceği şey. 3) <code>TfidfVectorizer + cosine_similarity</code>, ucuz bir anlamsal örtüşme skoru verir; daha zor durumlar için sentence-transformer ya da LLM judge takarsınız. 4) <code>mean_similarity</code>, model sürümü başına hesaplanır — başlık regresyon metriği. 5) Sürümler arası fark, son prompt veya model değişikliğinizin sevk öncesinde kaliteyi artırıp artırmadığını söyler.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Maliyet Takibi</h2>
<p class="l-text">LLM ekonomisi token ekonomisidir. 5× tekrar deneyen sızıntılı bir zincir sessizce faturayı 10×'e çıkarır.</p>
<div class="calc-steps">
<div class="calc-step"><strong>Çağrı başına muhasebe</strong> — <code>input_tokens</code>, <code>output_tokens</code>, model, USD logla.</div>
<div class="calc-step"><strong>Kullanıcı başına bütçe</strong> — günlük / aylık eşik üstü kullanıcıları engelle.</div>
<div class="calc-step"><strong>Önbellek</strong> — tekrar eden FAQ'lar için anlamsal önbellek (vektör benzerlik).</div>
<div class="calc-step"><strong>Katmanlı yönlendirme</strong> — kolay niyetler için küçük/ucuz model; gerektiğinde büyük model.</div>
</div>
<div id="mlops-l11-graph-tr" style="height:360px;margin-top:1rem"></div>
<p class="l-text" style="text-align:center;font-size:.9rem;opacity:.75">Birkaç popüler model için 1M token başına gösterge girdi + çıktı maliyeti. Kalite çıtanızı sağlayan en küçük modeli seçin.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Üretim Tuzakları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Prompt injection</div><div class="calc-card-body">Bağlamdaki güvenilmez metin sistem talimatını ezebilir. Temizleyin, rolleri ayırın.</div></div>
<div class="calc-card"><div class="calc-card-title">Vektör eskimesi</div><div class="calc-card-body">Kaynaklar değişirse yeniden embed et + indeksle. İndeks sürümünü de model gibi izleyin.</div></div>
<div class="calc-card"><div class="calc-card-title">Rate limit</div><div class="calc-card-body">Sağlayıcı 429'ları. Üstel geri çekilme + rota başına eşzamanlılık tavanı.</div></div>
<div class="calc-card"><div class="calc-card-title">PII sızıntısı</div><div class="calc-card-body">Modeller ezberleyebilir. Göndermeden redaksiyon; çıktıları inceleyin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Önemli Çıkarımlar</h2>
<div class="think-box"><div class="think-label">📌 ÖNEMLİ ÇIKARIMLAR</div><div class="think-body">
<ul>
<li>LLM ops = MLOps + prompt sürümleme + token ekonomisi + halüsinasyon savunması.</li>
<li>Her adımı izleyin: prompt id, model, token, maliyet, retrieval isabet, gecikme.</li>
<li>Üç katmanda eval: altın küme, LLM-jüri, insan inceleme.</li>
<li>Maliyet token başına; agresif önbellekleyin, mümkünse küçük modele yönlendirin.</li>
<li>Prompt ve vektör indeksleri sürümlü artefakt olarak ele alın — geri alma disiplini.</li>
</ul>
</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var dark = document.documentElement.getAttribute('data-theme') !== 'light';
  var text = dark ? '#e8e8e8' : '#222';
  Plotly.newPlot('mlops-l11-graph-tr', [
    {x:['Haiku','GPT-4o-mini','Sonnet','GPT-4o','Opus'], y:[0.25, 0.15, 3, 5, 15], name:'girdi $/1M', type:'bar', marker:{color:accent}},
    {x:['Haiku','GPT-4o-mini','Sonnet','GPT-4o','Opus'], y:[1.25, 0.6, 15, 15, 75], name:'çıktı $/1M', type:'bar', marker:{color:'#888'}}
  ], {
    paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:text}, barmode:'group',
    title:'LLM 1M token başına maliyet (örnek, USD)',
    yaxis:{title:'1M token başına USD', type:'log'},
    margin:{t:60,r:30,b:60,l:60}, legend:{orientation:'h', y:-0.2}
  }, {displayModeBar:false, responsive:true});
}, 250);</script>`
};
