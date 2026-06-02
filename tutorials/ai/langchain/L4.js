window.LANGCHAIN_L4 = {
en: `<p class="l-text"><strong>Hook.</strong> A useful LLM app rarely makes one call. It cleans the question, retrieves context, asks the model, validates, maybe reformats, sometimes loops. <strong>Chains</strong> express that flow as composable Runnables. The modern API is <strong>LCEL — LangChain Expression Language</strong> — built around the <code>|</code> pipe.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compose Runnables with the <code>|</code> pipe operator (LCEL) instead of legacy <code>LLMChain</code></li>
<li>Run sub-chains in parallel with <code>RunnableParallel</code> and merge with <code>RunnablePassthrough</code></li>
<li>Branch logic with <code>RunnableBranch</code> and route per input shape</li>
<li>Wrap arbitrary functions with <code>RunnableLambda</code> to inject custom Python steps</li>
<li>Stream intermediate outputs with <code>chain.stream</code> and <code>astream_log</code></li>
<li>Trace every chain step in LangSmith and inspect token cost per node</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. LCEL in one slide</h2>
<p class="l-text">Every component (prompt, model, parser, retriever, even your function) is a <strong>Runnable</strong>. You compose them with <code>|</code> exactly like UNIX pipes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

chain = (
    ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Translate to French: {text}"</span>)
    | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
    | <span class="fn">StrOutputParser</span>()
)

<span class="fn">print</span>(chain.<span class="fn">invoke</span>({<span class="str">"text"</span>: <span class="str">"Sentiment analysis is fun."</span>}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>ChatPromptTemplate.from_template("Translate to French: {text}")</code> builds a single-message template with one variable. 2) The <code>|</code> operator chains the template, the <code>ChatOpenAI</code> model, and a <code>StrOutputParser()</code> — three Runnables become one. 3) Each step's output becomes the next step's input: dict → messages → AIMessage → plain string. 4) <code>chain.invoke({"text": ...})</code> runs the composition end-to-end; the same chain accepts <code>.stream(...)</code>, <code>.batch(...)</code>, and <code>.ainvoke(...)</code> without modification.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Reduce(compose, [prompt, llm, parser])(input) IS LCEL. Build it with functools.reduce so you can see exactly what the | operator does under the hood.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># LCEL via functools.reduce — pure Python
from functools import reduce

prompt = lambda d: f"Translate to French: {d['text']}"
fake_llm = lambda s: {
    "Translate to French: Sentiment analysis is fun.":
        "L'analyse des sentiments est amusante.",
    "Translate to French: I love NLP.":
        "J'adore le NLP.",
}.get(s, "(no translation)")
parser = lambda s: s.strip()

def chain(*fns):
    return lambda x: reduce(lambda v, f: f(v), fns, x)

c = chain(prompt, fake_llm, parser)
print(c({"text": "Sentiment analysis is fun."}))
print(c({"text": "I love NLP."}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three lambdas — <code>prompt</code>, <code>fake_llm</code>, <code>parser</code> — act as Runnables for the prompt-format, model-call, and post-process stages. 2) <code>chain(*fns)</code> returns a closure that uses <code>functools.reduce</code> to apply each function to the running value, left to right. 3) <code>reduce(lambda v, f: f(v), fns, x)</code> is literally what LCEL's <code>|</code> does — it is function composition with a fluent operator. 4) Swap the lambdas for <code>ChatPromptTemplate</code>, <code>ChatOpenAI</code>, and <code>StrOutputParser</code> and you have the production version with no structural change.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. The four-step pipeline pattern</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Step 1 — Question:</strong> raw user input.</div>
<div class="calc-step"><strong>Step 2 — Translate:</strong> normalize to English.</div>
<div class="calc-step"><strong>Step 3 — Classify:</strong> assign a category.</div>
<div class="calc-step"><strong>Step 4 — Format:</strong> emit a one-line JSON record for downstream services.</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser, JsonOutputParser
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableLambda

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)

translate = (ChatPromptTemplate.<span class="fn">from_template</span>(
    <span class="str">"Translate to English; output text only:\\n{q}"</span>) | llm | <span class="fn">StrOutputParser</span>())

classify = (ChatPromptTemplate.<span class="fn">from_template</span>(
    <span class="str">"Classify into one word (billing|technical|other):\\n{en}"</span>) | llm | <span class="fn">StrOutputParser</span>())

format_step = <span class="fn">RunnableLambda</span>(<span class="kw">lambda</span> x: {
    <span class="str">"lang_normalized"</span>: x[<span class="str">"en"</span>], <span class="str">"category"</span>: x[<span class="str">"cat"</span>].<span class="fn">lower</span>().<span class="fn">strip</span>()
})

pipeline = (
    {<span class="str">"en"</span>: translate, <span class="str">"q"</span>: <span class="kw">lambda</span> x: x[<span class="str">"q"</span>]}      <span class="cm"># parallel-style step</span>
    | <span class="fn">RunnableLambda</span>(<span class="kw">lambda</span> d: {**d, <span class="str">"cat"</span>: classify.<span class="fn">invoke</span>({<span class="str">"en"</span>: d[<span class="str">"en"</span>]})})
    | format_step
)
<span class="fn">print</span>(pipeline.<span class="fn">invoke</span>({<span class="str">"q"</span>: <span class="str">"Faturam yanlış geldi."</span>}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds two sub-chains — <code>translate</code> and <code>classify</code> — each <code>prompt | llm | StrOutputParser()</code> so they emit plain strings. 2) <code>format_step</code> is a <code>RunnableLambda</code> wrapping a dict-shaping function so it composes like any other Runnable. 3) The dict opener <code>{"en": translate, "q": lambda x: x["q"]}</code> is LCEL shorthand for <code>RunnableParallel</code>: it runs the translation while passing the original question through. 4) The middle <code>RunnableLambda</code> calls <code>classify.invoke({"en": d["en"]})</code> with the translated text and merges <code>cat</code> back into the dict. 5) <code>format_step</code> picks the two final keys to emit the downstream JSON record.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same translate -> classify -> format flow, but each "LLM step" is a small dict-lookup. Watch the dict thread through three stages exactly as LCEL passes its state.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># 4-step pipeline without LangChain
TR_EN = {
    "faturam yanlış geldi.":      "My bill is wrong.",
    "uygulama açılmıyor.":        "The app does not open.",
    "şifremi unuttum.":           "I forgot my password.",
}
def translate(d):  return {**d, "en": TR_EN.get(d["q"].lower(), d["q"])}

def classify(d):
    s = d["en"].lower()
    cat = "billing"   if "bill" in s or "invoice" in s else \
          "technical" if "app" in s or "password" in s or "error" in s else \
          "other"
    return {**d, "cat": cat}

def fmt(d):
    return {"lang_normalized": d["en"], "category": d["cat"]}

def pipeline(d):
    return fmt(classify(translate(d)))

for q in ["Faturam yanlış geldi.", "Uygulama açılmıyor.", "Sıkıntı yok."]:
    print(pipeline({"q": q}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>translate(d)</code> looks the question up in <code>TR_EN</code> and attaches the English text under <code>en</code> — the same shape an LLM translation step would emit. 2) <code>classify(d)</code> applies keyword rules over <code>d["en"]</code> to assign <code>billing</code>, <code>technical</code>, or <code>other</code> — a stand-in for an LLM classifier. 3) <code>fmt(d)</code> drops everything except the two final keys, producing the JSON record downstream services expect. 4) <code>pipeline(d) = fmt(classify(translate(d)))</code> threads one dict through all three stages — the exact data flow LCEL would orchestrate with <code>|</code>.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Parallel branches with RunnableParallel</h2>
<p class="l-text">Sometimes you want to run two prompts on the same input and merge — e.g. extract entities and detect sentiment in one call.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableParallel

sentiment = ChatPromptTemplate.<span class="fn">from_template</span>(
    <span class="str">"Sentiment (pos/neg/neu) of: {text}"</span>) | llm | <span class="fn">StrOutputParser</span>()
entities  = ChatPromptTemplate.<span class="fn">from_template</span>(
    <span class="str">"List comma-separated entities in: {text}"</span>) | llm | <span class="fn">StrOutputParser</span>()

both = <span class="fn">RunnableParallel</span>(sentiment=sentiment, entities=entities)
<span class="fn">print</span>(both.<span class="fn">invoke</span>({<span class="str">"text"</span>: <span class="str">"Apple's iPhone 17 sold out in Istanbul today."</span>}))
<span class="cm"># {'sentiment': 'positive', 'entities': 'Apple, iPhone 17, Istanbul'}</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds two independent sub-chains (<code>sentiment</code>, <code>entities</code>) — each is its own <code>prompt | llm | parser</code> on the same input. 2) <code>RunnableParallel(sentiment=sentiment, entities=entities)</code> runs both branches concurrently (in parallel threads or async tasks) so total latency tracks the slower branch, not the sum. 3) The returned dict keys come from the keyword arguments — <code>{"sentiment": ..., "entities": ...}</code> — making downstream merging trivial. 4) <code>both.invoke({"text": ...})</code> dispatches the input to every branch unchanged; use <code>RunnablePassthrough</code> in the dict to forward additional fields untouched.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RunnableParallel = run two functions on the same input, return both results in a dict. Use a dict comprehension; no LangChain required.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># RunnableParallel by hand
import re

def sentiment(text):
    pos = sum(w in text.lower() for w in ["love","great","sold out","amazing"])
    neg = sum(w in text.lower() for w in ["worst","crash","broken","hate"])
    return "positive" if pos > neg else "negative" if neg > pos else "neutral"

def entities(text):
    # crude proper-noun extractor
    return ", ".join(re.findall(r"\b[A-Z][a-zA-Z0-9]+\b", text))

def parallel(branches):
    return lambda x: {name: fn(x) for name, fn in branches.items()}

both = parallel({"sentiment": sentiment, "entities": entities})
print(both("Apple's iPhone 17 sold out in Istanbul today."))
print(both("The app crashes on launch."))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>sentiment(text)</code> counts positive vs negative keywords to label the text — a deterministic stand-in for an LLM sentiment call. 2) <code>entities(text)</code> uses <code>re.findall</code> on capitalized words to extract proper nouns — a crude NER stub. 3) <code>parallel(branches)</code> returns a function that loops the <code>branches</code> dict and calls every <code>fn(x)</code>, collecting results under their names — exactly what <code>RunnableParallel</code> does. 4) Calling <code>both(...)</code> on each test text produces a <code>{"sentiment", "entities"}</code> dict; in production each branch would be wrapped in a thread pool to actually run in parallel.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Branching with RunnableBranch</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableBranch

billing_chain   = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Reply as a billing agent: {q}"</span>) | llm | <span class="fn">StrOutputParser</span>()
technical_chain = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Reply as tier-2 support: {q}"</span>) | llm | <span class="fn">StrOutputParser</span>()
fallback_chain  = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Polite refusal for: {q}"</span>)     | llm | <span class="fn">StrOutputParser</span>()

router = <span class="fn">RunnableBranch</span>(
    (<span class="kw">lambda</span> x: <span class="str">"invoice"</span> <span class="kw">in</span> x[<span class="str">"q"</span>].<span class="fn">lower</span>() <span class="kw">or</span> <span class="str">"bill"</span>  <span class="kw">in</span> x[<span class="str">"q"</span>].<span class="fn">lower</span>(), billing_chain),
    (<span class="kw">lambda</span> x: <span class="str">"error"</span>   <span class="kw">in</span> x[<span class="str">"q"</span>].<span class="fn">lower</span>() <span class="kw">or</span> <span class="str">"crash"</span> <span class="kw">in</span> x[<span class="str">"q"</span>].<span class="fn">lower</span>(), technical_chain),
    fallback_chain  <span class="cm"># default</span>
)
<span class="fn">print</span>(router.<span class="fn">invoke</span>({<span class="str">"q"</span>: <span class="str">"My invoice is wrong"</span>}))
<span class="fn">print</span>(router.<span class="fn">invoke</span>({<span class="str">"q"</span>: <span class="str">"App crashes on launch"</span>}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three persona-specific sub-chains (<code>billing_chain</code>, <code>technical_chain</code>, <code>fallback_chain</code>) are built once and reused on every route. 2) <code>RunnableBranch((predicate, chain), ..., default)</code> walks each pair in order and runs the first <code>chain</code> whose lambda returns <code>True</code>; the trailing positional argument is the default. 3) Predicates inspect <code>x["q"].lower()</code> with simple keyword tests — substitute a classifier sub-chain when keyword routing is too brittle. 4) <code>router.invoke({"q": ...})</code> dispatches to exactly one branch and returns its string output, so the caller sees a uniform reply.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RunnableBranch is a list of (predicate, branch) pairs with a default. Implement it in 6 lines; verify on three different incoming questions.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Hand-rolled RunnableBranch
def branch(*pairs_and_default):
    *pairs, default = pairs_and_default
    def run(x):
        for pred, fn in pairs:
            if pred(x):
                return fn(x)
        return default(x)
    return run

billing   = lambda x: f"[BILLING]   We will refund: {x['q']}"
technical = lambda x: f"[TECH]      Restart and clear cache: {x['q']}"
fallback  = lambda x: f"[GENERIC]   I cannot help with: {x['q']}"

router = branch(
    (lambda x: "invoice" in x["q"].lower() or "bill"  in x["q"].lower(), billing),
    (lambda x: "error"   in x["q"].lower() or "crash" in x["q"].lower(), technical),
    fallback,
)

for q in ["My invoice is wrong", "App crashes on launch", "What is the meaning of life?"]:
    print(router({"q": q}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>branch(*pairs_and_default)</code> separates the trailing default from the <code>(predicate, fn)</code> pairs using starred unpacking. 2) The returned <code>run(x)</code> closure iterates the pairs and dispatches to the first <code>fn(x)</code> whose <code>pred(x)</code> is truthy — same algorithm as <code>RunnableBranch</code> in 6 lines. 3) The three branch lambdas (<code>billing</code>, <code>technical</code>, <code>fallback</code>) stand in for full LCEL sub-chains; their signature <code>x -&gt; str</code> is what each sub-chain emits. 4) The test loop covers a billing query, a technical query, and a fallback case — confirming the default fires only when no predicate matches.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Error handling and retries</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> PydanticOutputParser
<span class="kw">from</span> langchain_core.exceptions <span class="kw">import</span> OutputParserException
<span class="kw">from</span> langchain.output_parsers <span class="kw">import</span> OutputFixingParser

<span class="kw">class</span> <span class="fn">Out</span>(BaseModel):
    label: <span class="ty">str</span>
    score: <span class="ty">float</span>

base = <span class="fn">PydanticOutputParser</span>(pydantic_object=Out)
fix  = OutputFixingParser.<span class="fn">from_llm</span>(parser=base, llm=llm)

<span class="kw">try</span>:
    fix.<span class="fn">parse</span>(<span class="str">'{"label": "positive", "score": 0.9}'</span>)   <span class="cm"># ok</span>
    fix.<span class="fn">parse</span>(<span class="str">'label=positive score=0.9'</span>)              <span class="cm"># malformed → LLM fixes</span>
<span class="kw">except</span> OutputParserException <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"Hard failure:"</span>, e)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines an <code>Out</code> Pydantic schema so the parser knows the exact shape it must produce. 2) <code>PydanticOutputParser(pydantic_object=Out)</code> is the strict parser — raises <code>OutputParserException</code> on malformed input. 3) <code>OutputFixingParser.from_llm(parser=base, llm=llm)</code> wraps the strict parser with a one-shot LLM call that rewrites broken output into valid JSON. 4) The first <code>fix.parse(...)</code> succeeds immediately; the second triggers the repair LLM, which converts <code>label=positive score=0.9</code> into the expected JSON before re-parsing.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A 4-rung strategy ladder: (1) try strict JSON, (2) try a regex "fixer", (3) try a backup heuristic, (4) return a safe default. Same shape as parser -> OutputFixingParser -> with_fallbacks -> default.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Error-handling ladder
import json, re

def strict_parse(raw):
    obj = json.loads(raw)
    assert "label" in obj and "score" in obj
    return obj

def regex_fix(raw):
    label = re.search(r"label\s*=\s*(\w+)", raw).group(1)
    score = float(re.search(r"score\s*=\s*([\d.]+)", raw).group(1))
    return {"label": label, "score": score}

def safe_default(raw):
    return {"label": "unknown", "score": 0.0, "raw": raw}

def robust_parse(raw):
    for fn in (strict_parse, regex_fix):
        try:
            return fn(raw)
        except Exception as e:
            print(f"  {fn.__name__} failed: {e}")
    print("  -> safe default")
    return safe_default(raw)

print(robust_parse('{"label":"positive","score":0.9}'))
print(robust_parse('label=positive score=0.9'))
print(robust_parse('totally broken'))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>strict_parse</code> tries <code>json.loads</code> and asserts both required keys — the strict path that mirrors <code>PydanticOutputParser</code>. 2) <code>regex_fix</code> recovers <code>label=...</code> / <code>score=...</code> snippets when the model emits a key=value blob instead of JSON — the same idea as <code>OutputFixingParser</code> without an extra LLM call. 3) <code>safe_default</code> returns an <code>unknown</code> record with the raw text attached, so downstream consumers never crash on parsing failure. 4) <code>robust_parse</code> walks the ladder: strict → regex → safe default; <code>with_fallbacks</code> implements the same try-then-fall-back chain in LangChain.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Sync, async, batch, stream — for free</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Method</div><div>When</div></div>
<div class="cmp-row"><div><code>chain.invoke(x)</code></div><div>Single sync call</div></div>
<div class="cmp-row"><div><code>chain.batch([x1, x2, ...])</code></div><div>Process many inputs in parallel (great for offline labelling df_reviews)</div></div>
<div class="cmp-row"><div><code>await chain.ainvoke(x)</code></div><div>Async (FastAPI / LangServe)</div></div>
<div class="cmp-row"><div><code>chain.stream(x)</code></div><div>Token-by-token streaming for UIs</div></div>
<div class="cmp-row"><div><code>await chain.abatch(...)</code></div><div>Async parallel — fastest for bulk jobs</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Composable but observable</h2>
<p class="l-text">Every chain step shows up as a <strong>span</strong> in LangSmith / LangFuse traces. You see exactly which prompt was sent, what came back, latency, tokens, cost. We will set this up in L11.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Inspect the chain graph (no LLM call needed):</span>
<span class="fn">print</span>(pipeline.<span class="fn">get_graph</span>().<span class="fn">draw_ascii</span>())
<span class="cm"># Helpful when debugging large compositions.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>pipeline.get_graph()</code> walks the Runnable tree and produces a graph object describing every node and edge — no LLM call is made. 2) <code>.draw_ascii()</code> renders that graph as text in the terminal, so you can sanity-check what was composed. 3) <code>.draw_mermaid_png()</code> exports the same graph as a Mermaid PNG you can embed in a notebook or docs. 4) When a chain misbehaves in production, the graph diff between two versions is often enough to spot the regression.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Latency anatomy of a 4-step chain</h2>
<div id="lc-l4-lat-en" style="width:100%;height:400px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var data=[{type:'bar',orientation:'h',
    y:['translate (LLM)','classify (LLM)','format (lambda)','retriever (vector)'].reverse(),
    x:[820,540,4,210].reverse(),
    marker:{color:T},text:['820 ms','540 ms','4 ms','210 ms'].reverse(),textposition:'outside'}];
  var layout={
    xaxis:{title:'milliseconds'},margin:{l:160,r:50,t:30,b:50},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l4-lat-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L5 leaves prompts behind for a turn and dives into <strong>embeddings &amp; vector stores</strong> — the math foundation that makes RAG (L6) possible.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> Faydalı bir LLM uygulaması nadiren tek çağrı yapar. Soruyu temizler, bağlam çeker, modele sorar, doğrular, belki yeniden biçimlendirir, bazen döner. <strong>Chain'ler</strong> bu akışı kompoze edilebilir Runnable'lar olarak ifade eder. Modern API <strong>LCEL — LangChain Expression Language</strong> ve <code>|</code> pipe etrafında kuruludur.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Eski <code>LLMChain</code> yerine <code>|</code> pipe operatörü (LCEL) ile Runnable kompoze etmeyi</li>
<li>Alt-chain'leri <code>RunnableParallel</code> ile paralel çalıştırıp <code>RunnablePassthrough</code> ile birleştirmeyi</li>
<li>Mantığı <code>RunnableBranch</code> ile dallandırmayı ve girdi şekline göre yönlendirmeyi</li>
<li>Özel Python adımları enjekte etmek için fonksiyonları <code>RunnableLambda</code> ile sarmayı</li>
<li>Ara çıktıları <code>chain.stream</code> ve <code>astream_log</code> ile akıtmayı</li>
<li>Her chain adımını LangSmith'te izlemeyi ve düğüm başına token maliyetini incelemeyi</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Bir slaytta LCEL</h2>
<p class="l-text">Her bileşen (prompt, model, parser, retriever, hatta sizin fonksiyonunuz) bir <strong>Runnable</strong>'dır. UNIX pipe gibi <code>|</code> ile birleştirirsiniz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

chain = (
    ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Fransızcaya çevir: {text}"</span>)
    | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
    | <span class="fn">StrOutputParser</span>()
)

<span class="fn">print</span>(chain.<span class="fn">invoke</span>({<span class="str">"text"</span>: <span class="str">"Sentiment analysis is fun."</span>}))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>ChatPromptTemplate.from_template("Fransızcaya çevir: {text}")</code> tek-mesajlı ve tek değişkenli bir şablon kurar. 2) <code>|</code> operatörü şablonu, <code>ChatOpenAI</code> modelini ve <code>StrOutputParser()</code>'ı zincirler — üç Runnable tek bir Runnable olur. 3) Her adımın çıktısı sonraki adımın girdisi olur: dict → mesajlar → AIMessage → düz string. 4) <code>chain.invoke({"text": ...})</code> kompozisyonu uçtan uca çalıştırır; aynı chain değişiklik olmadan <code>.stream(...)</code>, <code>.batch(...)</code> ve <code>.ainvoke(...)</code> kabul eder.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Reduce(compose, [prompt, llm, parser])(input) zaten LCEL'in kendisidir. functools.reduce ile inşa edin; | operatörünün arkada ne yaptığını net görün.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># functools.reduce ile LCEL — saf Python
from functools import reduce

prompt = lambda d: f"Fransızcaya çevir: {d['text']}"
fake_llm = lambda s: {
    "Fransızcaya çevir: Sentiment analysis is fun.":
        "L'analyse des sentiments est amusante.",
    "Fransızcaya çevir: I love NLP.":
        "J'adore le NLP.",
}.get(s, "(çeviri yok)")
parser = lambda s: s.strip()

def chain(*fns):
    return lambda x: reduce(lambda v, f: f(v), fns, x)

c = chain(prompt, fake_llm, parser)
print(c({"text": "Sentiment analysis is fun."}))
print(c({"text": "I love NLP."}))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Üç lambda — <code>prompt</code>, <code>fake_llm</code>, <code>parser</code> — prompt-formatlama, model-çağrı ve son-işleme aşamaları için Runnable görevi görür. 2) <code>chain(*fns)</code>, <code>functools.reduce</code> ile her fonksiyonu soldan sağa akan değere uygulayan bir closure döndürür. 3) <code>reduce(lambda v, f: f(v), fns, x)</code> tam olarak LCEL'in <code>|</code> operatörünün yaptığı şeydir — akıcı bir operatörle fonksiyon kompozisyonu. 4) Lambdaları <code>ChatPromptTemplate</code>, <code>ChatOpenAI</code> ve <code>StrOutputParser</code> ile değiştirin; yapı hiç değişmeden üretim sürümünü elde edersiniz.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Dört adımlı pipeline deseni</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Adım 1 — Soru:</strong> ham kullanıcı girdisi.</div>
<div class="calc-step"><strong>Adım 2 — Çevir:</strong> İngilizceye normalize et.</div>
<div class="calc-step"><strong>Adım 3 — Sınıflandır:</strong> kategori ata.</div>
<div class="calc-step"><strong>Adım 4 — Biçimlendir:</strong> alt servisler için tek satırlık JSON kayıt çıkart.</div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> StrOutputParser, JsonOutputParser
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableLambda

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)

translate = (ChatPromptTemplate.<span class="fn">from_template</span>(
    <span class="str">"İngilizceye çevir; sadece metin:\\n{q}"</span>) | llm | <span class="fn">StrOutputParser</span>())

classify = (ChatPromptTemplate.<span class="fn">from_template</span>(
    <span class="str">"Tek kelimeyle sınıflandır (billing|technical|other):\\n{en}"</span>) | llm | <span class="fn">StrOutputParser</span>())

format_step = <span class="fn">RunnableLambda</span>(<span class="kw">lambda</span> x: {
    <span class="str">"lang_normalized"</span>: x[<span class="str">"en"</span>], <span class="str">"category"</span>: x[<span class="str">"cat"</span>].<span class="fn">lower</span>().<span class="fn">strip</span>()
})

pipeline = (
    {<span class="str">"en"</span>: translate, <span class="str">"q"</span>: <span class="kw">lambda</span> x: x[<span class="str">"q"</span>]}
    | <span class="fn">RunnableLambda</span>(<span class="kw">lambda</span> d: {**d, <span class="str">"cat"</span>: classify.<span class="fn">invoke</span>({<span class="str">"en"</span>: d[<span class="str">"en"</span>]})})
    | format_step
)
<span class="fn">print</span>(pipeline.<span class="fn">invoke</span>({<span class="str">"q"</span>: <span class="str">"Faturam yanlış geldi."</span>}))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) İki alt-chain kurar — <code>translate</code> ve <code>classify</code> — her ikisi de düz string emit etsin diye <code>prompt | llm | StrOutputParser()</code>. 2) <code>format_step</code> bir dict-şekillendirme fonksiyonunu saran <code>RunnableLambda</code>'dır; böylece diğer Runnable'lar gibi kompoze olur. 3) Dict açıcısı <code>{"en": translate, "q": lambda x: x["q"]}</code> LCEL'in <code>RunnableParallel</code> kısayoludur: çeviriyi çalıştırırken orijinal soruyu da geçirir. 4) Ortadaki <code>RunnableLambda</code>, çevrilmiş metinle <code>classify.invoke({"en": d["en"]})</code> çağırır ve <code>cat</code>'ı dict'e geri yazar. 5) <code>format_step</code> son iki anahtarı seçerek aşağı yöndeki JSON kaydını üretir.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı çevir -> sınıflandır -> biçimlendir akışı, ama her "LLM adımı" küçük bir dict araması. Dict'in üç aşamadan LCEL durumu gibi geçtiğini izle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># LangChain olmadan 4 adımlı pipeline
TR_EN = {
    "faturam yanlış geldi.":      "My bill is wrong.",
    "uygulama açılmıyor.":        "The app does not open.",
    "şifremi unuttum.":           "I forgot my password.",
}
def translate(d):  return {**d, "en": TR_EN.get(d["q"].lower(), d["q"])}

def classify(d):
    s = d["en"].lower()
    cat = "billing"   if "bill" in s or "invoice" in s else \
          "technical" if "app" in s or "password" in s or "error" in s else \
          "other"
    return {**d, "cat": cat}

def fmt(d):
    return {"lang_normalized": d["en"], "category": d["cat"]}

def pipeline(d):
    return fmt(classify(translate(d)))

for q in ["Faturam yanlış geldi.", "Uygulama açılmıyor.", "Sıkıntı yok."]:
    print(pipeline({"q": q}))</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>translate(d)</code> soruyu <code>TR_EN</code>'de arar ve İngilizce metni <code>en</code> altında ekler — bir LLM çeviri adımının üreteceği şekil. 2) <code>classify(d)</code>, <code>d["en"]</code> üzerinde anahtar-kelime kurallarıyla <code>billing</code>, <code>technical</code> veya <code>other</code> atar — LLM sınıflandırıcının yerine geçer. 3) <code>fmt(d)</code> son iki anahtar dışında her şeyi atar; aşağı yöndeki servislerin beklediği JSON kaydını üretir. 4) <code>pipeline(d) = fmt(classify(translate(d)))</code> tek bir dict'i üç aşamadan geçirir — LCEL'in <code>|</code> ile orkestre edeceği veri akışının aynısı.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. RunnableParallel ile paralel dallar</h2>
<p class="l-text">Bazen aynı girdiye iki prompt çalıştırıp birleştirmek istersiniz — örneğin tek çağrıda varlık çıkarma + duygu tespiti.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableParallel

sentiment = ChatPromptTemplate.<span class="fn">from_template</span>(
    <span class="str">"Duygusu (pos/neg/neu): {text}"</span>) | llm | <span class="fn">StrOutputParser</span>()
entities  = ChatPromptTemplate.<span class="fn">from_template</span>(
    <span class="str">"Virgülle ayrılmış varlıkları listele: {text}"</span>) | llm | <span class="fn">StrOutputParser</span>()

both = <span class="fn">RunnableParallel</span>(sentiment=sentiment, entities=entities)
<span class="fn">print</span>(both.<span class="fn">invoke</span>({<span class="str">"text"</span>: <span class="str">"Apple'ın iPhone 17'si bugün İstanbul'da tükendi."</span>}))
<span class="cm"># {'sentiment': 'olumlu', 'entities': 'Apple, iPhone 17, İstanbul'}</span></code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) İki bağımsız alt-chain (<code>sentiment</code>, <code>entities</code>) kurar — her biri aynı girdi üzerinde kendi <code>prompt | llm | parser</code>'ıdır. 2) <code>RunnableParallel(sentiment=sentiment, entities=entities)</code> iki dalı eş zamanlı çalıştırır (paralel thread veya async task olarak); toplam gecikme toplam yerine yavaş dalı izler. 3) Dönen dict anahtarları keyword argümanlardan gelir — <code>{"sentiment": ..., "entities": ...}</code> — sonradan birleştirme kolaylaşır. 4) <code>both.invoke({"text": ...})</code> girdiyi her dala değişmeden gönderir; dict içinde <code>RunnablePassthrough</code> kullanarak ek alanları da olduğu gibi iletebilirsiniz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RunnableParallel = aynı girdi üzerinde iki fonksiyon çalıştır, ikisini de dict'te döndür. Dict comprehension yeter; LangChain gerekmez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># RunnableParallel kendi elinle
import re

def sentiment(text):
    pos = sum(w in text.lower() for w in ["sev","harika","tükendi","muhteşem"])
    neg = sum(w in text.lower() for w in ["kötü","çöküyor","bozuk","nefret"])
    return "olumlu" if pos > neg else "olumsuz" if neg > pos else "nötr"

def entities(text):
    # kaba özel-isim çıkarıcı
    return ", ".join(re.findall(r"\b[A-ZÇĞİÖŞÜ][a-zA-ZçğıöşüÇĞİÖŞÜ0-9]+\b", text))

def parallel(branches):
    return lambda x: {name: fn(x) for name, fn in branches.items()}

both = parallel({"sentiment": sentiment, "entities": entities})
print(both("Apple'ın iPhone 17'si bugün İstanbul'da tükendi."))
print(both("Uygulama açılışta çöküyor."))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>sentiment(text)</code> olumlu vs olumsuz anahtar kelimeleri sayarak metni etiketler — bir LLM duygu çağrısının deterministik vekili. 2) <code>entities(text)</code> büyük harfli kelimelerde <code>re.findall</code> ile özel isimleri çıkarır — kaba bir NER taslağı. 3) <code>parallel(branches)</code> <code>branches</code> dict'i üzerinde döner ve her <code>fn(x)</code>'i çağırarak sonuçları isimleri altında toplar — <code>RunnableParallel</code>'in yaptığının aynısı. 4) <code>both(...)</code> çağrısı her test metni için <code>{"sentiment", "entities"}</code> dict döndürür; üretimde her dal gerçekten paralel çalışsın diye bir thread pool ile sarılır.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. RunnableBranch ile dallanma</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.runnables <span class="kw">import</span> RunnableBranch

billing_chain   = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Faturalama temsilcisi olarak yanıtla: {q}"</span>) | llm | <span class="fn">StrOutputParser</span>()
technical_chain = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"2. kademe destek olarak yanıtla: {q}"</span>)    | llm | <span class="fn">StrOutputParser</span>()
fallback_chain  = ChatPromptTemplate.<span class="fn">from_template</span>(<span class="str">"Şu için kibar reddetme: {q}"</span>)              | llm | <span class="fn">StrOutputParser</span>()

router = <span class="fn">RunnableBranch</span>(
    (<span class="kw">lambda</span> x: <span class="str">"fatura"</span>  <span class="kw">in</span> x[<span class="str">"q"</span>].<span class="fn">lower</span>() <span class="kw">or</span> <span class="str">"ödeme"</span> <span class="kw">in</span> x[<span class="str">"q"</span>].<span class="fn">lower</span>(), billing_chain),
    (<span class="kw">lambda</span> x: <span class="str">"hata"</span>    <span class="kw">in</span> x[<span class="str">"q"</span>].<span class="fn">lower</span>() <span class="kw">or</span> <span class="str">"çöküy"</span> <span class="kw">in</span> x[<span class="str">"q"</span>].<span class="fn">lower</span>(), technical_chain),
    fallback_chain  <span class="cm"># varsayılan</span>
)
<span class="fn">print</span>(router.<span class="fn">invoke</span>({<span class="str">"q"</span>: <span class="str">"Faturam yanlış"</span>}))
<span class="fn">print</span>(router.<span class="fn">invoke</span>({<span class="str">"q"</span>: <span class="str">"Uygulama açılışta çöküyor"</span>}))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Üç persona-özel alt-chain (<code>billing_chain</code>, <code>technical_chain</code>, <code>fallback_chain</code>) bir kez kurulur ve her yönlendirmede tekrar kullanılır. 2) <code>RunnableBranch((predicate, chain), ..., default)</code> her ikiliyi sırayla yürür ve lambda'sı <code>True</code> dönen ilk <code>chain</code>'i çalıştırır; sondaki konum argüman varsayılandır. 3) Predicate'ler <code>x["q"].lower()</code>'u basit anahtar-kelime testleriyle inceler; anahtar-kelime yönlendirme kırılgan kalıyorsa bir sınıflandırıcı alt-chain ile değiştirin. 4) <code>router.invoke({"q": ...})</code> tek bir dala gönderir ve onun string çıktısını döndürür; çağıran taraf tek tip bir yanıt görür.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">RunnableBranch, varsayılanı olan (predicate, branch) ikilisi listesidir. 6 satırda yazın; üç farklı gelen soruda doğrulayın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># El yapımı RunnableBranch
def branch(*pairs_and_default):
    *pairs, default = pairs_and_default
    def run(x):
        for pred, fn in pairs:
            if pred(x):
                return fn(x)
        return default(x)
    return run

billing   = lambda x: f"[FATURA]   İade edilecek: {x['q']}"
technical = lambda x: f"[TEKNIK]   Yeniden başlat ve önbelleği temizle: {x['q']}"
fallback  = lambda x: f"[GENEL]    Bu konuda yardım edemem: {x['q']}"

router = branch(
    (lambda x: "fatura" in x["q"].lower() or "ödeme" in x["q"].lower(), billing),
    (lambda x: "hata"   in x["q"].lower() or "çöküy" in x["q"].lower(), technical),
    fallback,
)

for q in ["Faturam yanlış", "Uygulama açılışta çöküyor", "Hayatın anlamı nedir?"]:
    print(router({"q": q}))</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>branch(*pairs_and_default)</code> son varsayılanı <code>(predicate, fn)</code> ikililerinden starred unpacking ile ayırır. 2) Dönen <code>run(x)</code> closure'u ikilileri gezer ve <code>pred(x)</code>'i truthy dönen ilk <code>fn(x)</code>'i çalıştırır — 6 satırda <code>RunnableBranch</code>'in aynı algoritması. 3) Üç dal lambda'sı (<code>billing</code>, <code>technical</code>, <code>fallback</code>) tam LCEL alt-chain'lerinin yerine geçer; imzaları <code>x -&gt; str</code> her alt-chain'in döndürdüğü şeydir. 4) Test döngüsü bir faturalama sorgusu, bir teknik sorgu ve bir fallback durumu kapsar; predicate'lerden hiçbiri eşleşmediğinde varsayılanın devreye girdiğini doğrular.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Hata yönetimi ve retry</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> PydanticOutputParser
<span class="kw">from</span> langchain_core.exceptions <span class="kw">import</span> OutputParserException
<span class="kw">from</span> langchain.output_parsers <span class="kw">import</span> OutputFixingParser

<span class="kw">class</span> <span class="fn">Out</span>(BaseModel):
    label: <span class="ty">str</span>
    score: <span class="ty">float</span>

base = <span class="fn">PydanticOutputParser</span>(pydantic_object=Out)
fix  = OutputFixingParser.<span class="fn">from_llm</span>(parser=base, llm=llm)

<span class="kw">try</span>:
    fix.<span class="fn">parse</span>(<span class="str">'{"label": "olumlu", "score": 0.9}'</span>)   <span class="cm"># ok</span>
    fix.<span class="fn">parse</span>(<span class="str">'label=olumlu score=0.9'</span>)              <span class="cm"># bozuk → LLM düzeltir</span>
<span class="kw">except</span> OutputParserException <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"Sert hata:"</span>, e)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>Out</code> Pydantic şeması tanımlar; parser üretmesi gereken kesin şekli bilir. 2) <code>PydanticOutputParser(pydantic_object=Out)</code> sıkı parser'dır — bozuk girdide <code>OutputParserException</code> fırlatır. 3) <code>OutputFixingParser.from_llm(parser=base, llm=llm)</code> sıkı parser'ı, bozuk çıktıyı geçerli JSON'a yeniden yazan tek atışlık bir LLM çağrısıyla sarar. 4) İlk <code>fix.parse(...)</code> hemen başarılı olur; ikincisi onarım LLM'sini tetikler ve <code>label=olumlu score=0.9</code>'u beklenen JSON'a dönüştürdükten sonra yeniden parse eder.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">4 basamaklı strateji merdiveni: (1) sıkı JSON dene, (2) regex "düzeltici" dene, (3) yedek heuristik dene, (4) güvenli varsayılana dön. parser -> OutputFixingParser -> with_fallbacks -> default şekli.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Hata yönetim merdiveni
import json, re

def strict_parse(raw):
    obj = json.loads(raw)
    assert "label" in obj and "score" in obj
    return obj

def regex_fix(raw):
    label = re.search(r"label\s*=\s*(\w+)", raw).group(1)
    score = float(re.search(r"score\s*=\s*([\d.]+)", raw).group(1))
    return {"label": label, "score": score}

def safe_default(raw):
    return {"label": "bilinmiyor", "score": 0.0, "raw": raw}

def robust_parse(raw):
    for fn in (strict_parse, regex_fix):
        try:
            return fn(raw)
        except Exception as e:
            print(f"  {fn.__name__} başarısız: {e}")
    print("  -> güvenli varsayılan")
    return safe_default(raw)

print(robust_parse('{"label":"olumlu","score":0.9}'))
print(robust_parse('label=olumlu score=0.9'))
print(robust_parse('tamamen bozuk'))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>strict_parse</code> <code>json.loads</code> dener ve gerekli iki anahtarı assert eder — <code>PydanticOutputParser</code>'a denk düşen sıkı yol. 2) <code>regex_fix</code> model JSON yerine <code>key=value</code> blob attığında <code>label=...</code> / <code>score=...</code> parçalarını kurtarır — fazladan LLM çağrısı olmadan <code>OutputFixingParser</code>'ın aynı fikri. 3) <code>safe_default</code> ham metni de iliştirerek <code>bilinmiyor</code> kayıt döner; aşağı yöndeki tüketiciler parse hatasında asla çökmez. 4) <code>robust_parse</code> merdiveni gezer: sıkı → regex → güvenli varsayılan; LangChain'de <code>with_fallbacks</code> aynı dene-sonra-düş zincirini uygular.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Sync, async, batch, stream — bedava</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Metod</div><div>Ne zaman</div></div>
<div class="cmp-row"><div><code>chain.invoke(x)</code></div><div>Tek senkron çağrı</div></div>
<div class="cmp-row"><div><code>chain.batch([x1, x2, ...])</code></div><div>Birçok girdiyi paralel işle (df_reviews offline etiketleme için harika)</div></div>
<div class="cmp-row"><div><code>await chain.ainvoke(x)</code></div><div>Async (FastAPI / LangServe)</div></div>
<div class="cmp-row"><div><code>chain.stream(x)</code></div><div>Arayüz için token-token streaming</div></div>
<div class="cmp-row"><div><code>await chain.abatch(...)</code></div><div>Async paralel — toplu işlerde en hızlısı</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Kompoze edilebilir ama gözlemlenebilir</h2>
<p class="l-text">Her chain adımı LangSmith / LangFuse izlerinde bir <strong>span</strong> olarak görünür. Hangi prompt'un gönderildiğini, ne döndüğünü, gecikmeyi, token'ı, maliyeti tam görürsünüz. L11'de kuracağız.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Chain grafiğini incele (LLM çağrısı gerekmez):</span>
<span class="fn">print</span>(pipeline.<span class="fn">get_graph</span>().<span class="fn">draw_ascii</span>())
<span class="cm"># Büyük kompozisyonları debug ederken çok faydalı.</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>pipeline.get_graph()</code> Runnable ağacını dolaşır ve her düğüm ve kenarı tanımlayan bir grafik nesnesi üretir — hiçbir LLM çağrısı yapılmaz. 2) <code>.draw_ascii()</code> bu grafiği terminalde metin olarak çizer; ne kompoze ettiğinizi gözle doğrulayabilirsiniz. 3) <code>.draw_mermaid_png()</code> aynı grafiği bir notebook veya dokümana gömebileceğiniz Mermaid PNG olarak dışa aktarır. 4) Üretimde bir chain hatalı davrandığında iki sürüm arasındaki grafik farkı çoğu zaman regresyonu yakalamak için yeterlidir.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. 4 adımlı bir chain'in gecikme anatomisi</h2>
<div id="lc-l4-lat-tr" style="width:100%;height:400px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var data=[{type:'bar',orientation:'h',
    y:['translate (LLM)','classify (LLM)','format (lambda)','retriever (vektör)'].reverse(),
    x:[820,540,4,210].reverse(),
    marker:{color:T},text:['820 ms','540 ms','4 ms','210 ms'].reverse(),textposition:'outside'}];
  var layout={
    xaxis:{title:'milisaniye'},margin:{l:170,r:50,t:30,b:50},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l4-lat-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L5 prompt'ları kısa süreliğine bırakıp <strong>embedding'ler ve vektör depolarına</strong> giriyor — RAG'ı (L6) mümkün kılan matematik temel.</p>
</div>
`
};
