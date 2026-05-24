window.LANGCHAIN_L2 = {
en: `<p class="l-text"><strong>Hook.</strong> An LLM call looks simple from the outside — text in, text out. Inside a real app it's a long list of choices: which provider, which model size, what messages, streaming or not, how many tokens cost how much, what to do on a 429 rate limit, how to fall back to a cheaper model when the primary fails. LangChain's <strong>ChatModel</strong> abstraction unifies all of this so you can write the application logic once.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish modern <code>ChatModel</code> from legacy <code>LLM</code> string-completion classes</li>
<li>Build chat conversations with <code>SystemMessage</code>, <code>HumanMessage</code>, <code>AIMessage</code> roles</li>
<li>Swap providers (OpenAI, Anthropic, Mistral, local Ollama) without changing app logic</li>
<li>Stream tokens with <code>chain.stream()</code> and handle async with <code>chain.ainvoke()</code></li>
<li>Configure temperature, max_tokens, and structured output with <code>with_structured_output</code></li>
<li>Add retries and fallback chains for 429 rate-limit and provider failures</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. ChatModel vs LLM (legacy)</h2>
<p class="l-text">Old <code>LLM</code> classes accepted a single string. Modern providers expect a structured chat: a list of messages with roles (system / user / assistant). The <strong>ChatModel</strong> interface mirrors that — and is the only one you should reach for in 2026.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">SystemMessage</div><div class="calc-card-desc">Role / persona / rules. Set once at the top.</div></div>
<div class="calc-card"><div class="calc-card-title">HumanMessage</div><div class="calc-card-desc">User input. Often templated.</div></div>
<div class="calc-card"><div class="calc-card-title">AIMessage</div><div class="calc-card-desc">Model response. Echoed back when you continue a conversation.</div></div>
<div class="calc-card"><div class="calc-card-title">ToolMessage</div><div class="calc-card-desc">Output of a tool call (agents, function calling).</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Provider zoo</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Class</div><div>Use case</div></div>
<div class="cmp-row"><div>ChatOpenAI</div><div>GPT-4o, GPT-4o-mini, o1, o3 — strong general default</div></div>
<div class="cmp-row"><div>ChatAnthropic</div><div>Claude Sonnet / Opus — long context, careful reasoning</div></div>
<div class="cmp-row"><div>ChatGoogleGenerativeAI</div><div>Gemini 1.5 / 2 — multimodal, huge context window</div></div>
<div class="cmp-row"><div>ChatMistralAI</div><div>European, cost-effective, Mixtral models</div></div>
<div class="cmp-row"><div>ChatOllama</div><div>Local Llama / Qwen / Phi — zero API cost, private</div></div>
<div class="cmp-row"><div>ChatHuggingFace</div><div>Any model on HF Inference Endpoints</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Minimal chat loop</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.messages <span class="kw">import</span> SystemMessage, HumanMessage, AIMessage

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0.2</span>)

history = [<span class="fn">SystemMessage</span>(content=<span class="str">"You are a concise NLP tutor."</span>)]

<span class="kw">while</span> <span class="kw">True</span>:
    q = <span class="fn">input</span>(<span class="str">"you: "</span>).<span class="fn">strip</span>()
    <span class="kw">if</span> <span class="kw">not</span> q: <span class="kw">break</span>
    history.<span class="fn">append</span>(<span class="fn">HumanMessage</span>(content=q))
    resp = llm.<span class="fn">invoke</span>(history)            <span class="cm"># returns AIMessage</span>
    history.<span class="fn">append</span>(resp)
    <span class="fn">print</span>(<span class="str">"bot:"</span>, resp.content)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Instantiates <code>ChatOpenAI</code> once and seeds <code>history</code> with a single <code>SystemMessage</code> that anchors the model's persona. 2) The <code>while True</code> loop reads a user line, wraps it in a <code>HumanMessage</code>, and appends it to <code>history</code>. 3) <code>llm.invoke(history)</code> sends the full message list every turn — the model has no implicit memory, you carry it. 4) The returned <code>AIMessage</code> is appended back so the next turn's context includes everything said so far. 5) Empty input breaks the loop; this is the bare-bones shape every chat app extends.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy chat loop that mimics the message-list pattern: history is a list of role-tagged dicts, the "model" is a dict-lookup, and we re-send the full history each turn — exactly the shape ChatModel.invoke uses.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mimic ChatModel.invoke(messages) without an LLM
canned = {
    "tf-idf":  "TF-IDF weights words by document frequency.",
    "tokens":  "Tokens are sub-word units billed per 1M.",
    "stream":  "Streaming yields chunks so UI feels fast.",
}

def fake_chat(messages):
    last_user = messages[-1]["content"].lower()
    for k, v in canned.items():
        if k in last_user:
            return {"role": "assistant", "content": v}
    return {"role": "assistant", "content": "(no answer)"}

history = [{"role": "system", "content": "You are a concise NLP tutor."}]
for q in ["What are tokens?", "Explain TF-IDF", "Why stream?"]:
    history.append({"role": "user", "content": q})
    resp = fake_chat(history)
    history.append(resp)
    print("you:", q)
    print("bot:", resp["content"], "\n")

print("turns kept:", len(history))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>canned</code> is a tiny dictionary acting as a fake LLM — the lookup keyword decides the canned reply. 2) <code>fake_chat(messages)</code> reads only the last user message (<code>messages[-1]</code>), mirroring how a real model also sees the whole list but only "answers" the latest turn. 3) The loop appends each <code>{"role":"user",...}</code> dict, calls <code>fake_chat</code>, then appends the returned assistant dict — the same append-history-and-resend cycle <code>ChatModel.invoke</code> uses. 4) <code>len(history)</code> grows monotonically, which is exactly why production apps eventually need trimming or memory.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Streaming responses</h2>
<p class="l-text">Latency to first token is what users feel. Streaming reveals tokens as they are generated, so the UI does not look frozen for 8 seconds.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, streaming=<span class="kw">True</span>)
<span class="kw">for</span> chunk <span class="kw">in</span> llm.<span class="fn">stream</span>(<span class="str">"Write a haiku about gradient descent."</span>):
    <span class="fn">print</span>(chunk.content, end=<span class="str">""</span>, flush=<span class="kw">True</span>)

<span class="cm"># In LangServe / FastAPI you forward the stream as Server-Sent Events</span>
<span class="cm"># so the browser renders tokens word-by-word.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Constructs <code>ChatOpenAI</code> with <code>streaming=True</code> so the wrapper opens an SSE connection instead of waiting for the full response. 2) <code>llm.stream(prompt)</code> returns a generator of <code>AIMessageChunk</code> objects — each carries the next slice of <code>.content</code>. 3) The <code>for</code> loop prints with <code>end=""</code> and <code>flush=True</code> so the console shows tokens as they arrive instead of buffering whole lines. 4) In FastAPI you forward the same generator as Server-Sent Events; the browser then renders word-by-word for a near-instant time-to-first-token.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Token counting and cost estimation</h2>
<p class="l-text">Tokens are the unit of cost. A bug that doubles your context window doubles your bill. Always estimate before you ship.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.callbacks <span class="kw">import</span> get_openai_callback

<span class="kw">with</span> <span class="fn">get_openai_callback</span>() <span class="kw">as</span> cb:
    out = llm.<span class="fn">invoke</span>(<span class="str">"Explain attention in 50 words."</span>)
    <span class="fn">print</span>(out.content)
    <span class="fn">print</span>(f<span class="str">"prompt: {cb.prompt_tokens}, completion: {cb.completion_tokens}"</span>)
    <span class="fn">print</span>(f<span class="str">"cost: $ {cb.total_cost:.5f}"</span>)

<span class="cm"># Rule of thumb (2026 pricing, gpt-4o-mini):</span>
<span class="cm"># ~$0.15 per 1M input tokens, $0.60 per 1M output. A heavy RAG query</span>
<span class="cm"># with 4k context + 500 output is roughly $0.0009 per call.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>get_openai_callback()</code> is a context manager that registers a callback handler with every LLM call inside the <code>with</code> block. 2) Inside the block, <code>llm.invoke(...)</code> runs normally; the callback silently tallies <code>cb.prompt_tokens</code>, <code>cb.completion_tokens</code>, and <code>cb.total_cost</code>. 3) On exit, the totals are accumulated — so wrapping a whole chain measures the full pipeline, not just one call. 4) The price-per-1M table in the comment lets you sanity-check the bill before you ship: 4k prompt + 500 output on gpt-4o-mini is roughly $0.0009 per call.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Estimate tokens with the rough rule "1 token ≈ 4 chars" and price the call against the 2026 gpt-4o-mini rate card. No API needed — just arithmetic.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Token + cost estimator (no tiktoken needed)
def estimate_tokens(text):
    # rough heuristic: 1 token ~= 4 chars for English
    return max(1, len(text) // 4)

PRICE = {  # $ per 1M tokens, gpt-4o-mini May 2026
    "in":  0.15,
    "out": 0.60,
}

prompt   = "Explain attention in 50 words." * 1
output   = "Attention is a mechanism that lets each token weigh the relevance of every other token via a query-key dot product, then mixes their values accordingly."

p_tok = estimate_tokens(prompt)
o_tok = estimate_tokens(output)
cost  = (p_tok * PRICE["in"] + o_tok * PRICE["out"]) / 1_000_000

print(f"prompt tokens:     ~{p_tok}")
print(f"completion tokens: ~{o_tok}")
print(f"estimated cost:    $ {cost:.6f}")
print(f"1000 calls/day:    $ {cost * 1000:.4f}")</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>estimate_tokens(text)</code> applies the rule-of-thumb <code>len(text) // 4</code>, since English averages roughly four characters per token — close enough for budgeting. 2) The <code>PRICE</code> dict captures the 2026 gpt-4o-mini rate card ($0.15 / $0.60 per 1M in/out tokens). 3) The cost formula <code>(p_tok * PRICE["in"] + o_tok * PRICE["out"]) / 1_000_000</code> converts token counts into dollars. 4) Multiplying by 1000 projects what a thousand calls a day would cost — the same envelope estimate you would run before launching a public endpoint.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Retries, timeouts, fallbacks</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_anthropic <span class="kw">import</span> ChatAnthropic

primary = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>, timeout=<span class="num">30</span>, max_retries=<span class="num">3</span>)
backup  = <span class="fn">ChatAnthropic</span>(model=<span class="str">"claude-3-5-sonnet-latest"</span>)

<span class="cm"># .with_fallbacks([backup]) — if primary errors (429, 500, timeout)</span>
<span class="cm"># the chain transparently retries on the backup model.</span>
robust = primary.<span class="fn">with_fallbacks</span>([backup])

answer = robust.<span class="fn">invoke</span>(<span class="str">"Summarize sentiment analysis history."</span>)
<span class="fn">print</span>(answer.content)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a <code>primary</code> ChatOpenAI with <code>timeout=30</code> and <code>max_retries=3</code> — the SDK already retries on transient errors before the fallback kicks in. 2) Builds a <code>backup</code> ChatAnthropic of an equivalent tier so the two are interchangeable from the caller's perspective. 3) <code>primary.with_fallbacks([backup])</code> returns a new Runnable that catches errors from <code>primary</code> (429, 500, timeout) and reissues the same input against <code>backup</code>. 4) <code>robust.invoke(...)</code> looks identical to a single-model call — the failover is transparent, so the rest of your app needs no change.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a retry-with-fallback wrapper using try/except. The primary "model" fails 70% of the time; the backup always works. Same logic LangChain's with_fallbacks runs internally.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Manual retries + fallback chain
import random
random.seed(7)

def primary(prompt):
    if random.random() < 0.7:
        raise TimeoutError("429 rate limit")
    return "[primary] " + prompt[:40]

def backup(prompt):
    return "[backup] " + prompt[:40]

def robust(prompt, max_retries=3):
    for attempt in range(max_retries):
        try:
            return primary(prompt)
        except Exception as e:
            print(f"  primary failed (try {attempt+1}): {e}")
    print("  switching to backup model...")
    return backup(prompt)

for q in ["Summarize sentiment analysis history.",
          "What is BERT?",
          "Explain RAG."]:
    print("Q:", q)
    print("A:", robust(q), "\n")</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Seeds <code>random</code> so the failure pattern is reproducible while teaching. 2) <code>primary(prompt)</code> raises <code>TimeoutError("429 rate limit")</code> 70% of the time — a stand-in for a flaky production endpoint. 3) <code>robust(prompt, max_retries=3)</code> loops up to three tries against <code>primary</code> inside a <code>try/except</code> — exactly what the SDK does. 4) After the loop exhausts, it falls through to <code>backup(prompt)</code>, mirroring LangChain's <code>with_fallbacks</code>. 5) The print trail (retries, then "switching to backup") matches the LangSmith trace you would see in production.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Sampling parameters cheat sheet</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Param</div><div>Effect</div></div>
<div class="cmp-row"><div>temperature</div><div>0 = deterministic / factual, 0.7 = creative, 1.0+ = wild</div></div>
<div class="cmp-row"><div>top_p</div><div>Nucleus sampling. Use temperature OR top_p, not both.</div></div>
<div class="cmp-row"><div>max_tokens</div><div>Hard cap on output length</div></div>
<div class="cmp-row"><div>presence_penalty / frequency_penalty</div><div>Reduce repetition</div></div>
<div class="cmp-row"><div>seed</div><div>Reproducibility (best-effort, not guaranteed)</div></div>
<div class="cmp-row"><div>response_format</div><div><code>{"type": "json_object"}</code> — force JSON</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Cost / latency comparison (illustrative)</h2>
<div id="lc-l2-cost-en" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var models=['gpt-4o-mini','gpt-4o','o1','claude-sonnet','claude-opus','llama-3-70b'];
  var cost=[0.15,2.5,15,3,15,0.6];     // $/1M input
  var lat=[0.4,0.8,2.5,0.9,1.4,0.7];   // s avg
  var data=[{type:'scatter',mode:'markers+text',
    x:cost,y:lat,text:models,textposition:'top center',
    marker:{size:18,color:T,line:{color:'#fff',width:1}}}];
  var layout={title:'Approx. input cost vs latency — mainstream chat models (2026)',
    xaxis:{title:'$ per 1M input tokens',type:'log'},
    yaxis:{title:'avg latency (s)'},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l2-cost-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L3 turns to <strong>prompt engineering with PromptTemplate</strong> — the right way to parameterize, few-shot, and force structured output instead of begging the model in plain English.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> Dışarıdan bakınca LLM çağrısı basittir — metin girer, metin çıkar. Gerçek bir uygulamada bu uzun bir karar listesidir: hangi sağlayıcı, hangi model boyutu, hangi mesajlar, streaming var mı, kaç token ne kadar tutuyor, 429 rate limit'inde ne yapacaksınız, birincil model patladığında daha ucuz bir modele nasıl düşeceksiniz. LangChain'in <strong>ChatModel</strong> soyutlaması bunları birleştirir; uygulama mantığını tek seferde yazarsınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Modern <code>ChatModel</code>'ı eski <code>LLM</code> string-completion sınıflarından ayırt etmeyi</li>
<li><code>SystemMessage</code>, <code>HumanMessage</code>, <code>AIMessage</code> rolleriyle sohbet kurmayı</li>
<li>Sağlayıcıları (OpenAI, Anthropic, Mistral, yerel Ollama) uygulama mantığını değiştirmeden değiştirmeyi</li>
<li><code>chain.stream()</code> ile token akıtmayı ve <code>chain.ainvoke()</code> ile async kullanmayı</li>
<li>Temperature, max_tokens ve <code>with_structured_output</code> ile yapılı çıktı yapılandırmayı</li>
<li>429 rate-limit ve sağlayıcı hatalarına karşı retry ve fallback chain eklemeyi</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. ChatModel vs LLM (eski)</h2>
<p class="l-text">Eski <code>LLM</code> sınıfları tek string kabul ederdi. Modern sağlayıcılar yapılı bir sohbet bekler: rolleri olan mesaj listesi (system / user / assistant). <strong>ChatModel</strong> arayüzü bunu yansıtır — ve 2026'da tercih etmeniz gereken arayüz budur.</p>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">SystemMessage</div><div class="calc-card-desc">Rol / persona / kurallar. En tepede bir kez ayarlanır.</div></div>
<div class="calc-card"><div class="calc-card-title">HumanMessage</div><div class="calc-card-desc">Kullanıcı girdisi. Genelde şablonlanır.</div></div>
<div class="calc-card"><div class="calc-card-title">AIMessage</div><div class="calc-card-desc">Model yanıtı. Konuşmayı sürdürürken geri yansıtılır.</div></div>
<div class="calc-card"><div class="calc-card-title">ToolMessage</div><div class="calc-card-desc">Araç çağrısının çıktısı (agent'lar, function calling).</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Sağlayıcı ekosistemi</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Sınıf</div><div>Kullanım alanı</div></div>
<div class="cmp-row"><div>ChatOpenAI</div><div>GPT-4o, GPT-4o-mini, o1, o3 — güçlü genel varsayılan</div></div>
<div class="cmp-row"><div>ChatAnthropic</div><div>Claude Sonnet / Opus — uzun bağlam, dikkatli akıl yürütme</div></div>
<div class="cmp-row"><div>ChatGoogleGenerativeAI</div><div>Gemini 1.5 / 2 — multimodal, devasa bağlam penceresi</div></div>
<div class="cmp-row"><div>ChatMistralAI</div><div>Avrupa kökenli, maliyet-dostu, Mixtral modelleri</div></div>
<div class="cmp-row"><div>ChatOllama</div><div>Yerel Llama / Qwen / Phi — sıfır API maliyeti, gizli</div></div>
<div class="cmp-row"><div>ChatHuggingFace</div><div>HF Inference Endpoints'teki herhangi bir model</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Minimal sohbet döngüsü</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.messages <span class="kw">import</span> SystemMessage, HumanMessage, AIMessage

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0.2</span>)

history = [<span class="fn">SystemMessage</span>(content=<span class="str">"Özlü bir NLP eğitmenisin."</span>)]

<span class="kw">while</span> <span class="kw">True</span>:
    q = <span class="fn">input</span>(<span class="str">"sen: "</span>).<span class="fn">strip</span>()
    <span class="kw">if</span> <span class="kw">not</span> q: <span class="kw">break</span>
    history.<span class="fn">append</span>(<span class="fn">HumanMessage</span>(content=q))
    resp = llm.<span class="fn">invoke</span>(history)            <span class="cm"># AIMessage döndürür</span>
    history.<span class="fn">append</span>(resp)
    <span class="fn">print</span>(<span class="str">"bot:"</span>, resp.content)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>ChatOpenAI</code>'yi bir kez kurar ve <code>history</code>'yi modelin personasını sabitleyen tek bir <code>SystemMessage</code> ile başlatır. 2) <code>while True</code> döngüsü kullanıcı satırını okur, <code>HumanMessage</code> içine sarar ve <code>history</code>'ye ekler. 3) <code>llm.invoke(history)</code> her turda tüm mesaj listesini gönderir — modelin örtük belleği yoktur, geçmişi siz taşırsınız. 4) Dönen <code>AIMessage</code> tekrar listeye eklenir; böylece sonraki turun bağlamı o ana kadar söylenen her şeyi içerir. 5) Boş girdi döngüyü kırar; bu, her sohbet uygulamasının üzerine bina ettiği iskelettir.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mesaj-listesi desenini taklit eden oyuncak bir sohbet döngüsü: history rol-etiketli dict listesi, "model" bir sözlük araması, her turda tüm history yeniden gönderilir — ChatModel.invoke'un kullandığı tam şekil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># LLM olmadan ChatModel.invoke(messages) taklidi
hazir = {
    "tf-idf":  "TF-IDF, kelimeleri belge sıklığına göre ağırlıklandırır.",
    "token":   "Token alt-kelime birimleridir, 1M üzerinden ücretlenir.",
    "stream":  "Streaming parça parça akıtır, arayüz hızlı hisseder.",
}

def fake_chat(messages):
    son_kullanici = messages[-1]["content"].lower()
    for k, v in hazir.items():
        if k in son_kullanici:
            return {"role": "assistant", "content": v}
    return {"role": "assistant", "content": "(cevap yok)"}

history = [{"role": "system", "content": "Özlü bir NLP eğitmenisin."}]
for q in ["Token nedir?", "TF-IDF açıkla", "Neden stream?"]:
    history.append({"role": "user", "content": q})
    resp = fake_chat(history)
    history.append(resp)
    print("sen:", q)
    print("bot:", resp["content"], "\n")

print("tutulan tur:", len(history))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>hazir</code> sözlüğü minik bir sahte LLM görevi görür — arama anahtarı hazır cevabı belirler. 2) <code>fake_chat(messages)</code> yalnızca son kullanıcı mesajını (<code>messages[-1]</code>) okur; gerçek model de tüm listeyi görür ama "cevabı" yalnızca son tura verir. 3) Döngü her <code>{"role":"user",...}</code> sözlüğünü ekler, <code>fake_chat</code>'i çağırır ve dönen asistan sözlüğünü tekrar listeye yazar — <code>ChatModel.invoke</code>'un da kullandığı "geçmişi büyüt ve yeniden gönder" döngüsü. 4) <code>len(history)</code> monoton artar; üretim uygulamalarının er ya da geç budama veya memory'ye geçmesinin nedeni de tam olarak budur.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Streaming yanıtlar</h2>
<p class="l-text">İlk tokena kadar geçen süre kullanıcının hissettiği şeydir. Streaming, token'lar üretildikçe gösterir; arayüz 8 saniye boyunca donmuş gibi görünmez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, streaming=<span class="kw">True</span>)
<span class="kw">for</span> chunk <span class="kw">in</span> llm.<span class="fn">stream</span>(<span class="str">"Gradient descent hakkında bir haiku yaz."</span>):
    <span class="fn">print</span>(chunk.content, end=<span class="str">""</span>, flush=<span class="kw">True</span>)

<span class="cm"># LangServe / FastAPI içinde stream'i Server-Sent Events olarak iletirsiniz;</span>
<span class="cm"># tarayıcı tokenları kelime kelime render eder.</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>ChatOpenAI</code>'yi <code>streaming=True</code> ile kurar; sarmalayıcı tam yanıtı beklemek yerine bir SSE bağlantısı açar. 2) <code>llm.stream(prompt)</code> bir <code>AIMessageChunk</code> jeneratörü döndürür — her chunk <code>.content</code>'in bir sonraki dilimini taşır. 3) <code>for</code> döngüsü <code>end=""</code> ve <code>flush=True</code> ile yazdırır; konsol tüm satırı tamponlamak yerine tokenları geldikçe gösterir. 4) FastAPI içinde aynı jeneratörü Server-Sent Events olarak ileterek tarayıcının kelime kelime render etmesini sağlarsınız — neredeyse anında time-to-first-token elde edilir.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Token sayma ve maliyet tahmini</h2>
<p class="l-text">Token, maliyet birimidir. Bağlam penceresini iki katına çıkaran bir bug, faturanızı iki katına çıkarır. Yayınlamadan önce her zaman tahmin edin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.callbacks <span class="kw">import</span> get_openai_callback

<span class="kw">with</span> <span class="fn">get_openai_callback</span>() <span class="kw">as</span> cb:
    out = llm.<span class="fn">invoke</span>(<span class="str">"Attention'ı 50 kelimeyle açıkla."</span>)
    <span class="fn">print</span>(out.content)
    <span class="fn">print</span>(f<span class="str">"prompt: {cb.prompt_tokens}, completion: {cb.completion_tokens}"</span>)
    <span class="fn">print</span>(f<span class="str">"maliyet: $ {cb.total_cost:.5f}"</span>)

<span class="cm"># Pratik kural (2026 fiyatı, gpt-4o-mini):</span>
<span class="cm"># ~$0.15 / 1M input, $0.60 / 1M output. 4k bağlam + 500 çıktıyla</span>
<span class="cm"># yoğun bir RAG sorgusu çağrı başına ~$0.0009.</span></code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>get_openai_callback()</code> <code>with</code> bloğu içindeki her LLM çağrısına bir callback handler kaydeden bir context manager'dır. 2) Blok içinde <code>llm.invoke(...)</code> normal çalışır; callback sessizce <code>cb.prompt_tokens</code>, <code>cb.completion_tokens</code> ve <code>cb.total_cost</code> değerlerini biriktirir. 3) Blok çıkışında toplamlar konsolide olur — bu yüzden tüm bir chain'i sarmak tek çağrıyı değil tüm pipeline'ı ölçer. 4) Yorumdaki 1M-token başına fiyat tablosu, yayına çıkmadan önce faturayı doğrulamanızı sağlar: gpt-4o-mini üzerinde 4k prompt + 500 çıktı çağrı başına yaklaşık $0.0009 tutar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Token sayısını "1 token ~ 4 karakter" kuralıyla tahmin et, çağrıyı 2026 gpt-4o-mini fiyat listesiyle ücretlendir. API gerek yok — sadece aritmetik.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Token + maliyet tahmincisi (tiktoken gerekmez)
def token_tahmin(metin):
    # kaba kural: 1 token ~ 4 karakter
    return max(1, len(metin) // 4)

FIYAT = {  # $ / 1M token, gpt-4o-mini May 2026
    "in":  0.15,
    "out": 0.60,
}

prompt   = "Attention'ı 50 kelimeyle açıkla."
cikti    = "Attention, her token'ın query-key iç çarpımıyla diğer her token'ın değerini ne kadar dikkate alacağını belirleyip value'ları o ağırlıklarla karıştıran bir mekanizmadır."

p_tok = token_tahmin(prompt)
o_tok = token_tahmin(cikti)
maliyet  = (p_tok * FIYAT["in"] + o_tok * FIYAT["out"]) / 1_000_000

print(f"prompt token:     ~{p_tok}")
print(f"completion token: ~{o_tok}")
print(f"tahmini maliyet:  $ {maliyet:.6f}")
print(f"günde 1000 çağrı: $ {maliyet * 1000:.4f}")</code></pre></div>
<p class="l-text"><strong>Burada dört önemli detay var:</strong> 1) <code>token_tahmin(metin)</code> <code>len(metin) // 4</code> kuralını uygular; İngilizce ortalama olarak token başına ~4 karakter eder — bütçeleme için yeterince yakındır. 2) <code>FIYAT</code> sözlüğü 2026 gpt-4o-mini fiyat listesini ($0.15 / $0.60 per 1M giriş/çıkış token) tutar. 3) Maliyet formülü <code>(p_tok * FIYAT["in"] + o_tok * FIYAT["out"]) / 1_000_000</code> token sayılarını dolara çevirir. 4) 1000 ile çarpmak günde bin çağrının ne tutacağını projekte eder — public bir endpoint'i açmadan önce yapacağınız zarfın aynısı.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Retry, timeout, fallback</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_anthropic <span class="kw">import</span> ChatAnthropic

primary = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>, timeout=<span class="num">30</span>, max_retries=<span class="num">3</span>)
backup  = <span class="fn">ChatAnthropic</span>(model=<span class="str">"claude-3-5-sonnet-latest"</span>)

<span class="cm"># .with_fallbacks([backup]) — birincil hata verirse (429, 500, timeout)</span>
<span class="cm"># zincir şeffaf şekilde yedek modelde yeniden dener.</span>
robust = primary.<span class="fn">with_fallbacks</span>([backup])

answer = robust.<span class="fn">invoke</span>(<span class="str">"Duygu analizi tarihini özetle."</span>)
<span class="fn">print</span>(answer.content)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>primary</code> ChatOpenAI'yi <code>timeout=30</code> ve <code>max_retries=3</code> ile kurar — SDK fallback devreye girmeden önce geçici hatalarda zaten yeniden dener. 2) Aynı seviyede bir <code>backup</code> ChatAnthropic kurar; çağıran açısından ikisi birbirinin yerine geçebilir. 3) <code>primary.with_fallbacks([backup])</code> yeni bir Runnable döndürür: <code>primary</code>'den gelen hataları (429, 500, timeout) yakalar ve aynı girdiyi <code>backup</code>'a yönlendirir. 4) <code>robust.invoke(...)</code> tek-modelli bir çağrıyla birebir aynı görünür — failover şeffaftır, uygulamanızın geri kalanı dokunulmaz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">try/except ile retry-ve-fallback sarmalayıcı kur. Birincil "model" %70 başarısız, yedek her zaman çalışır. LangChain'in with_fallbacks'inin içeride yaptığı mantığın aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Manuel retry + fallback zinciri
import random
random.seed(7)

def birincil(prompt):
    if random.random() < 0.7:
        raise TimeoutError("429 rate limit")
    return "[birincil] " + prompt[:40]

def yedek(prompt):
    return "[yedek] " + prompt[:40]

def robust(prompt, max_retries=3):
    for deneme in range(max_retries):
        try:
            return birincil(prompt)
        except Exception as e:
            print(f"  birincil patladı (deneme {deneme+1}): {e}")
    print("  yedek modele geçiliyor...")
    return yedek(prompt)

for q in ["Duygu analizi tarihini özetle.",
          "BERT nedir?",
          "RAG açıkla."]:
    print("S:", q)
    print("C:", robust(q), "\n")</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>random</code>'a seed verir ki hata deseni öğretici amaçla tekrarlanabilir kalsın. 2) <code>birincil(prompt)</code> %70 oranında <code>TimeoutError("429 rate limit")</code> fırlatır — stabil olmayan bir üretim endpoint'ini taklit eder. 3) <code>robust(prompt, max_retries=3)</code> <code>try/except</code> bloğu içinde <code>birincil</code>'i üç kez dener — SDK'nın yaptığı şeyin aynısı. 4) Döngü tükendiğinde <code>yedek(prompt)</code>'e düşer; LangChain'in <code>with_fallbacks</code> davranışının birebir karşılığı budur. 5) Konsola düşen iz (denemeler, sonra "yedek modele geçiliyor") üretimde göreceğiniz LangSmith iziyle eşleşir.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Örnekleme parametreleri özeti</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Parametre</div><div>Etki</div></div>
<div class="cmp-row"><div>temperature</div><div>0 = deterministik / olgusal, 0.7 = yaratıcı, 1.0+ = çok serbest</div></div>
<div class="cmp-row"><div>top_p</div><div>Nucleus sampling. temperature VEYA top_p kullanın, ikisini birden değil.</div></div>
<div class="cmp-row"><div>max_tokens</div><div>Çıktı uzunluğunun sert üst sınırı</div></div>
<div class="cmp-row"><div>presence_penalty / frequency_penalty</div><div>Tekrarı azalt</div></div>
<div class="cmp-row"><div>seed</div><div>Tekrarlanabilirlik (en iyi çaba, garanti değil)</div></div>
<div class="cmp-row"><div>response_format</div><div><code>{"type": "json_object"}</code> — JSON'u zorla</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Maliyet / gecikme karşılaştırması (örnekleme)</h2>
<div id="lc-l2-cost-tr" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var models=['gpt-4o-mini','gpt-4o','o1','claude-sonnet','claude-opus','llama-3-70b'];
  var cost=[0.15,2.5,15,3,15,0.6];
  var lat=[0.4,0.8,2.5,0.9,1.4,0.7];
  var data=[{type:'scatter',mode:'markers+text',
    x:cost,y:lat,text:models,textposition:'top center',
    marker:{size:18,color:T,line:{color:'#fff',width:1}}}];
  var layout={title:'Yaklaşık girdi maliyeti vs gecikme — yaygın sohbet modelleri (2026)',
    xaxis:{title:'$ / 1M girdi token',type:'log'},
    yaxis:{title:'ortalama gecikme (s)'},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l2-cost-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L3 <strong>PromptTemplate ile prompt mühendisliğine</strong> dönüyor — modele düz İngilizce ile yalvarmak yerine parametrelendirme, few-shot ve yapılı çıktı zorlamanın doğru yolu.</p>
</div>
`
};
