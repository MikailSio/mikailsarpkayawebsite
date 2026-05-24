window.LANGCHAIN_L3 = {
en: `<p class="l-text"><strong>Hook.</strong> The single biggest lever in an LLM app is the prompt. A small wording change can move accuracy from 60% to 90%. But hand-crafted f-strings rot quickly: variables get hard-coded, examples get duplicated, output formats drift. <strong>PromptTemplate</strong> turns prompting into engineering — versioned, parameterized, parseable.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build parameterized prompts with <code>PromptTemplate</code> and <code>ChatPromptTemplate.from_messages</code></li>
<li>Inject few-shot examples via <code>FewShotPromptTemplate</code> and <code>FewShotChatMessagePromptTemplate</code></li>
<li>Compose system, human, and AI message slots with <code>MessagesPlaceholder</code></li>
<li>Force structured output with Pydantic schemas and <code>PydanticOutputParser</code></li>
<li>Use partial variables and dynamic <code>example_selector</code> for context-aware few-shot</li>
<li>Version prompts in code (or LangSmith Hub) so accuracy gains stay reproducible</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. The four jobs of a prompt</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Set role</div><div class="calc-card-desc">"You are a senior NLP engineer." — anchors tone and domain.</div></div>
<div class="calc-card"><div class="calc-card-title">Inject inputs</div><div class="calc-card-desc">User question, retrieved context, current date. Templated, never concatenated.</div></div>
<div class="calc-card"><div class="calc-card-title">Show examples</div><div class="calc-card-desc">Few-shot demonstrations beat verbose instructions.</div></div>
<div class="calc-card"><div class="calc-card-title">Force structure</div><div class="calc-card-desc">JSON schema, Pydantic, regex — so downstream code can parse safely.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. ChatPromptTemplate basics</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"You are a strict English-Turkish translator. "</span>
               <span class="str">"Output only the translation, no commentary."</span>),
    (<span class="str">"human"</span>, <span class="str">"Translate: {text}"</span>)
])

msgs = prompt.<span class="fn">format_messages</span>(text=<span class="str">"Sentiment analysis is fun."</span>)
<span class="kw">for</span> m <span class="kw">in</span> msgs: <span class="fn">print</span>(m.<span class="ty">type</span>, <span class="str">"->"</span>, m.content)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`ChatPromptTemplate.from_messages([...])\` defines a multi-message template — typically \`system\` + \`human\`, optionally \`placeholder\` for chat history. 2) Curly-brace variables like \`{topic}\` become parameters of the resulting Runnable; they are filled at \`.invoke({...})\` time, not at template construction. 3) Templates are themselves Runnables — they pipe directly into the model: \`prompt | llm\`. 4) Strong typing: missing variables raise \`KeyError\` early, so prompt bugs surface before hitting the LLM.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A ChatPromptTemplate is essentially a list of (role, str.format-template) tuples. Roll your own with pure Python tuples and str.format — no LangChain needed to see the mental model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Hand-rolled ChatPromptTemplate
template = [
    ("system", "You are a strict English-Turkish translator. "
               "Output only the translation, no commentary."),
    ("human",  "Translate: {text}"),
]

def format_messages(template, **kwargs):
    return [(role, content.format(**kwargs)) for role, content in template]

msgs = format_messages(template, text="Sentiment analysis is fun.")
for role, content in msgs:
    print(f"{role:>6} -> {content}")

# Same template, different inputs — pure function, easy to unit-test
print()
for sample in ["I love NLP.", "Tokens are sub-words."]:
    out = format_messages(template, text=sample)
    print(out[-1])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`ChatPromptTemplate.from_messages([...])\` defines a multi-message template — typically \`system\` + \`human\`, optionally \`placeholder\` for chat history. 2) Curly-brace variables like \`{topic}\` become parameters of the resulting Runnable; they are filled at \`.invoke({...})\` time, not at template construction. 3) Templates are themselves Runnables — they pipe directly into the model: \`prompt | llm\`. 4) Strong typing: missing variables raise \`KeyError\` early, so prompt bugs surface before hitting the LLM.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Few-shot prompting</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> FewShotChatMessagePromptTemplate, ChatPromptTemplate

examples = [
    {<span class="str">"input"</span>: <span class="str">"I love this phone, battery lasts forever!"</span>, <span class="str">"label"</span>: <span class="str">"positive"</span>},
    {<span class="str">"input"</span>: <span class="str">"Worst purchase, broke after a week."</span>,       <span class="str">"label"</span>: <span class="str">"negative"</span>},
    {<span class="str">"input"</span>: <span class="str">"It works as expected, nothing special."</span>,    <span class="str">"label"</span>: <span class="str">"neutral"</span>},
]

example_prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"human"</span>, <span class="str">"{input}"</span>),
    (<span class="str">"ai"</span>,    <span class="str">"{label}"</span>),
])
few = <span class="fn">FewShotChatMessagePromptTemplate</span>(
    example_prompt=example_prompt, examples=examples
)

final = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Classify reviews as positive, negative, or neutral."</span>),
    few,
    (<span class="str">"human"</span>, <span class="str">"{input}"</span>)
])
<span class="fn">print</span>(final.<span class="fn">format</span>(<span class="ty">input</span>=<span class="str">"Average product, two stars."</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>examples</code> is a list of <code>{input, label}</code> dicts — the labeled demonstrations the model will learn the task from in-context. 2) <code>example_prompt</code> defines how each example renders as a <code>human</code> + <code>ai</code> turn so the model sees a natural Q/A pattern. 3) <code>FewShotChatMessagePromptTemplate(example_prompt=..., examples=...)</code> stamps every example through that mini-template and produces one block of messages. 4) The outer <code>ChatPromptTemplate.from_messages([system, few, ("human","{input}")])</code> sandwiches the examples between the system instruction and the new query. 5) <code>final.format(input=...)</code> emits the full message list ready to send.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Few-shot is just string concatenation: render examples into a header, append the new query. As a bonus, train a sklearn baseline on the same examples to show how a tiny labeled set already separates the classes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Few-shot prompt assembly + a tiny sklearn baseline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

examples = [
    {"input": "I love this phone, battery lasts forever!", "label": "positive"},
    {"input": "Worst purchase, broke after a week.",       "label": "negative"},
    {"input": "It works as expected, nothing special.",    "label": "neutral"},
]

# 1) Build the prompt manually
header = "Classify reviews as positive, negative, or neutral.\n\n"
shots  = "\n".join(f"Q: {e['input']}\nA: {e['label']}" for e in examples)
query  = "Q: Average product, two stars.\nA:"
print(header + shots + "\n" + query + "\n")

# 2) Same examples -> sklearn baseline (no LLM needed)
vec = TfidfVectorizer().fit([e["input"] for e in examples])
clf = LogisticRegression().fit(vec.transform([e["input"] for e in examples]),
                               [e["label"] for e in examples])
test = ["amazing battery!", "broken on arrival", "ok i guess"]
print("baseline preds:", list(zip(test, clf.predict(vec.transform(test)))))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Renders the prompt by hand: a <code>header</code> with the instruction, <code>shots</code> joined as <code>"Q: ... A: ..."</code> lines, then the new <code>query</code> waiting for the answer. 2) The printed block is exactly what an LLM would receive — few-shot is literally string concatenation under the hood. 3) The bonus step trains a <code>TfidfVectorizer + LogisticRegression</code> on the same three examples to show that even a tiny labeled set already separates positive / negative / neutral. 4) Calling <code>clf.predict(vec.transform(test))</code> gives a deterministic baseline you can compare against the LLM's output — a useful sanity check for review-classification pipelines.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Output parsers — Pydantic schema</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> PydanticOutputParser
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

<span class="kw">class</span> <span class="fn">ReviewLabel</span>(BaseModel):
    sentiment: <span class="ty">str</span> = <span class="fn">Field</span>(description=<span class="str">"positive | negative | neutral"</span>)
    confidence: <span class="ty">float</span> = <span class="fn">Field</span>(description=<span class="str">"model confidence 0-1"</span>)
    reasons: <span class="ty">list</span>[<span class="ty">str</span>] = <span class="fn">Field</span>(description=<span class="str">"2-3 short bullet reasons"</span>)

parser = <span class="fn">PydanticOutputParser</span>(pydantic_object=ReviewLabel)

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"You are a review analyst. {format_instructions}"</span>),
    (<span class="str">"human"</span>,  <span class="str">"Review: {review}"</span>)
]).<span class="fn">partial</span>(format_instructions=parser.<span class="fn">get_format_instructions</span>())

chain = prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>) | parser
out: ReviewLabel = chain.<span class="fn">invoke</span>({<span class="str">"review"</span>: <span class="str">"Battery is great but camera is poor."</span>})
<span class="fn">print</span>(out.sentiment, out.confidence, out.reasons)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a Pydantic \`BaseModel\` schema — fields become the JSON shape the LLM must return. 2) \`model.with_structured_output(Schema)\` (or PydanticOutputParser) tells LangChain to use the provider's native function-calling / JSON-mode to enforce the schema. 3) \`.invoke({...})\` returns an instance of your Pydantic class, not a string — type-safe and validation-checked. 4) Use this whenever downstream code branches on fields; it eliminates fragile regex parsing of LLM text.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A Pydantic parser is just JSON validation. Define the expected schema as a dict, parse the model's "answer" with json.loads, then check required keys and types — exactly what PydanticOutputParser does internally.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Manual Pydantic-style parser
import json

SCHEMA = {
    "sentiment":  str,
    "confidence": float,
    "reasons":    list,
}

def parse_review(raw):
    # Strip code fences the LLM often wraps JSON in
    fence = chr(96) * 3   # avoid template-literal collision in HTML
    raw = raw.strip().removeprefix(fence + "json").removesuffix(fence).strip()
    obj = json.loads(raw)
    for key, typ in SCHEMA.items():
        if key not in obj:
            raise ValueError(f"missing key: {key}")
        if not isinstance(obj[key], typ):
            raise TypeError(f"{key} must be {typ.__name__}")
    return obj

# Simulate two LLM responses, one good and one malformed
good = '{"sentiment":"mixed","confidence":0.78,"reasons":["battery ok","camera weak"]}'
bad  = '{"sentiment":"mixed","confidence":"high","reasons":["camera weak"]}'

print("OK:", parse_review(good))
try:
    parse_review(bad)
except TypeError as e:
    print("REJECTED ->", e)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses or constructs JSON to bridge the LLM (which speaks text) and downstream Python code (which prefers typed objects). 2) \`json.loads\` decodes a model's text output into a dict; pair with try/except since LLMs occasionally produce malformed JSON. 3) For robust structured output prefer \`with_structured_output(Schema)\` — providers enforce the JSON schema at the model level, eliminating the parse step. 4) For agent tool calls the JSON is generated by the provider's tool-calling API directly, no manual parsing needed.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Real example — classify reviews from df_reviews</h2>
<p class="l-text">Below is the kind of pre-processing you would run before sending each review to the LLM. We keep this part in plain Python so it runs anywhere; the LLM call would happen in production with a real API key.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df_reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"id"</span>: <span class="fn">range</span>(<span class="num">1</span>, <span class="num">7</span>),
    <span class="str">"text"</span>: [
        <span class="str">"Battery great, screen mediocre."</span>,
        <span class="str">"Service was slow but staff polite."</span>,
        <span class="str">"Defective on arrival, returned."</span>,
        <span class="str">"Five stars, exactly as described."</span>,
        <span class="str">"Loud, hot, regretted buying."</span>,
        <span class="str">"Average. Does the job."</span>
    ]
})

<span class="cm"># Pre-clean before LLM: drop empties, truncate to 500 chars to control cost</span>
df_reviews[<span class="str">"clean"</span>] = (df_reviews[<span class="str">"text"</span>]
                       .<span class="ty">str</span>.<span class="fn">strip</span>()
                       .<span class="ty">str</span>.<span class="fn">slice</span>(<span class="num">0</span>, <span class="num">500</span>))
<span class="fn">print</span>(df_reviews.<span class="fn">head</span>())
<span class="fn">print</span>(<span class="str">"avg chars:"</span>, df_reviews[<span class="str">"clean"</span>].<span class="ty">str</span>.<span class="fn">len</span>().<span class="fn">mean</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a <code>df_reviews</code> DataFrame so the example runs on a self-contained dataset — same shape as a real <code>reviews.csv</code> ingest. 2) <code>df_reviews["text"].str.strip()</code> removes leading/trailing whitespace that creeps in from scraped sources. 3) <code>.str.slice(0, 500)</code> hard-caps each review at 500 characters — a coarse but effective cost guard before paying per-token. 4) <code>df_reviews["clean"].str.len().mean()</code> reports the average length so you can estimate token spend in advance.</p>
<p class="l-text"><strong>What it does:</strong> trims and clips reviews to bound prompt length. In a real pipeline you would then call the chain from step 4 once per row (or in a batched async loop) and append <code>sentiment</code>, <code>confidence</code> columns.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Function / tool calling schema</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">sentiment_score</span>(text: <span class="ty">str</span>) -> <span class="ty">dict</span>:
    <span class="str">"""Return sentiment score and label for a piece of text."""</span>
    <span class="kw">return</span> {<span class="str">"label"</span>: <span class="str">"positive"</span>, <span class="str">"score"</span>: <span class="num">0.91</span>}  <span class="cm"># stub</span>

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>).<span class="fn">bind_tools</span>([sentiment_score])
resp = llm.<span class="fn">invoke</span>(<span class="str">"Score this review: 'Best laptop I have owned.'"</span>)
<span class="fn">print</span>(resp.tool_calls)
<span class="cm"># -> [{'name': 'sentiment_score', 'args': {'text': "Best laptop..."}, 'id': '...'}]</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`@tool\` (or \`StructuredTool.from_function\`) turns a plain Python function into a \`BaseTool\` LangChain can advertise to an LLM. 2) The function's docstring becomes the tool description the model reads; type hints become the JSON schema for arguments — write both carefully. 3) Tools are passed to the model via \`model.bind_tools([t1, t2, ...])\` so the LLM can emit structured \`tool_calls\` in its response. 4) The runtime (agent executor or your own loop) parses the tool call, runs the Python function, and feeds the result back as a \`ToolMessage\` for the next LLM turn.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a function-calling registry by hand: a dict of {name: callable}, plus a tiny parser that turns a "model decision" into a real Python call. This is the pattern bind_tools formalizes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Tool-calling registry without LangChain
def sentiment_score(text):
    """Return sentiment score and label for a piece of text."""
    pos = sum(w in text.lower() for w in ["love","best","great","amazing"])
    neg = sum(w in text.lower() for w in ["worst","hate","broken","poor"])
    label = "positive" if pos > neg else "negative" if neg > pos else "neutral"
    return {"label": label, "score": round(0.5 + 0.1 * (pos - neg), 2)}

TOOLS = {"sentiment_score": sentiment_score}

# Simulated model decision (what bind_tools would emit)
tool_calls = [
    {"name": "sentiment_score", "args": {"text": "Best laptop I have owned."}, "id": "c1"},
    {"name": "sentiment_score", "args": {"text": "Worst purchase ever."},      "id": "c2"},
]

for call in tool_calls:
    fn = TOOLS[call["name"]]
    result = fn(**call["args"])
    print(f"{call['id']} {call['name']}({call['args']}) -> {result}")</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>sentiment_score(text)</code> is a plain Python stand-in for any LLM-callable tool — counts positive vs negative keywords and returns a <code>{label, score}</code> dict. 2) <code>TOOLS</code> is a name-to-callable registry — the same mapping LangChain's <code>bind_tools</code> maintains internally so it can look up which function to invoke. 3) <code>tool_calls</code> simulates what a real model would emit: a list of <code>{name, args, id}</code> dicts (the same shape <code>resp.tool_calls</code> returns). 4) The loop dispatches each call with <code>fn(**call["args"])</code> and prints the result — exactly the execute-then-feed-back step an agent executor performs.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Prompt versioning best practices</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1. Store prompts in code, not strings scattered everywhere.</strong> One module per prompt family.</div>
<div class="calc-step"><strong>2. Tag each prompt with a semantic version</strong> (<code>review_v3</code>) so logs and evals tie back to a specific text.</div>
<div class="calc-step"><strong>3. Use partial(...)</strong> for fixed knobs (format instructions, current date) so the call site only passes user input.</div>
<div class="calc-step"><strong>4. Maintain a small eval set</strong> (~30 cases). Re-run when changing the prompt; don't ship if accuracy regresses.</div>
<div class="calc-step"><strong>5. Avoid mega-prompts.</strong> One prompt = one job. Compose with chains (L4) instead.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Few-shot impact — illustrative accuracy</h2>
<div id="lc-l3-fs-en" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var x=['0-shot','2-shot','4-shot','8-shot','16-shot'];
  var y=[71,82,87,89,90];
  var data=[{type:'scatter',mode:'lines+markers',x:x,y:y,
    marker:{color:T,size:12},line:{color:T,width:3}}];
  var layout={title:'Few-shot count vs classification accuracy (toy review task)',
    xaxis:{title:'examples in prompt'},yaxis:{title:'accuracy (%)',range:[60,100]},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l3-fs-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L4 composes prompts and models into <strong>chains</strong> — branching, error handling, and the LCEL pipe syntax that keeps complex pipelines readable.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> Bir LLM uygulamasındaki en büyük kaldıraç prompt'tür. Küçük bir kelime değişikliği doğruluğu %60'tan %90'a çıkarabilir. Ancak elle yazılmış f-string'ler hızla çürür: değişkenler sabit kodlanır, örnekler tekrarlanır, çıktı formatları kayar. <strong>PromptTemplate</strong> prompt'lamayı mühendisliğe dönüştürür — versiyonlu, parametrelenmiş, ayrıştırılabilir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li><code>PromptTemplate</code> ve <code>ChatPromptTemplate.from_messages</code> ile parametrelenmiş prompt kurmayı</li>
<li><code>FewShotPromptTemplate</code> ve <code>FewShotChatMessagePromptTemplate</code> ile few-shot örnek enjekte etmeyi</li>
<li>System, human ve AI mesaj slotlarını <code>MessagesPlaceholder</code> ile kompoze etmeyi</li>
<li>Pydantic şemaları ve <code>PydanticOutputParser</code> ile yapılı çıktı zorlamayı</li>
<li>Partial değişkenleri ve dinamik <code>example_selector</code> ile bağlama duyarlı few-shot kurmayı</li>
<li>Prompt'ları kodda (veya LangSmith Hub'da) versiyonlamayı; doğruluk kazanımlarını yeniden üretilebilir tutmayı</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. Bir prompt'un dört işi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">Rol belirle</div><div class="calc-card-desc">"Kıdemli bir NLP mühendisisin." — ton ve alanı sabitler.</div></div>
<div class="calc-card"><div class="calc-card-title">Girdileri enjekte et</div><div class="calc-card-desc">Kullanıcı sorusu, çekilen bağlam, güncel tarih. Şablonla, asla concat ile değil.</div></div>
<div class="calc-card"><div class="calc-card-title">Örnek göster</div><div class="calc-card-desc">Few-shot demonstrasyonlar uzun talimatları yener.</div></div>
<div class="calc-card"><div class="calc-card-title">Yapı zorla</div><div class="calc-card-desc">JSON şeması, Pydantic, regex — sonraki kod güvenle ayrıştırabilsin.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. ChatPromptTemplate temelleri</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Sıkı bir İngilizce-Türkçe çevirmensin. "</span>
               <span class="str">"Sadece çeviriyi döndür, yorum yok."</span>),
    (<span class="str">"human"</span>, <span class="str">"Çevir: {text}"</span>)
])

msgs = prompt.<span class="fn">format_messages</span>(text=<span class="str">"Sentiment analysis is fun."</span>)
<span class="kw">for</span> m <span class="kw">in</span> msgs: <span class="fn">print</span>(m.<span class="ty">type</span>, <span class="str">"->"</span>, m.content)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) \`ChatPromptTemplate.from_messages([...])\` çok-mesajlı bir şablon tanımlar — tipik olarak \`system\` + \`human\`, isteğe bağlı \`placeholder\` ile sohbet geçmişi. 2) \`{topic}\` gibi süslü-parantezli değişkenler ortaya çıkan Runnable'ın parametreleri olur; şablon kurulduğunda değil \`.invoke({...})\` anında doldurulur. 3) Şablonlar zaten Runnable'dır — doğrudan modele pipe edilir: \`prompt | llm\`. 4) Güçlü tipleme: eksik değişkenler erken \`KeyError\` fırlatır; prompt hataları LLM'e ulaşmadan ortaya çıkar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">ChatPromptTemplate aslında (rol, str.format-şablonu) tuple listesidir. Saf Python tuple ve str.format ile kendiniz yazın — zihinsel modeli görmek için LangChain'e gerek yok.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># El yapımı ChatPromptTemplate
template = [
    ("system", "Sıkı bir İngilizce-Türkçe çevirmensin. "
               "Sadece çeviriyi döndür, yorum yok."),
    ("human",  "Çevir: {text}"),
]

def format_messages(template, **kwargs):
    return [(rol, icerik.format(**kwargs)) for rol, icerik in template]

msgs = format_messages(template, text="Sentiment analysis is fun.")
for rol, icerik in msgs:
    print(f"{rol:>6} -> {icerik}")

# Aynı şablon, farklı girdiler — saf fonksiyon, kolay test
print()
for ornek in ["I love NLP.", "Tokens are sub-words."]:
    out = format_messages(template, text=ornek)
    print(out[-1])</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) \`ChatPromptTemplate.from_messages([...])\` çok-mesajlı bir şablon tanımlar — tipik olarak \`system\` + \`human\`, isteğe bağlı \`placeholder\` ile sohbet geçmişi. 2) \`{topic}\` gibi süslü-parantezli değişkenler ortaya çıkan Runnable'ın parametreleri olur; şablon kurulduğunda değil \`.invoke({...})\` anında doldurulur. 3) Şablonlar zaten Runnable'dır — doğrudan modele pipe edilir: \`prompt | llm\`. 4) Güçlü tipleme: eksik değişkenler erken \`KeyError\` fırlatır; prompt hataları LLM'e ulaşmadan ortaya çıkar.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Few-shot prompting</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> FewShotChatMessagePromptTemplate, ChatPromptTemplate

examples = [
    {<span class="str">"input"</span>: <span class="str">"Telefonu seviyorum, pil sonsuza kadar gidiyor!"</span>, <span class="str">"label"</span>: <span class="str">"olumlu"</span>},
    {<span class="str">"input"</span>: <span class="str">"En kötü alışveriş, bir haftada bozuldu."</span>,         <span class="str">"label"</span>: <span class="str">"olumsuz"</span>},
    {<span class="str">"input"</span>: <span class="str">"Beklendiği gibi çalışıyor, özel bir şey yok."</span>,    <span class="str">"label"</span>: <span class="str">"nötr"</span>},
]

example_prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"human"</span>, <span class="str">"{input}"</span>),
    (<span class="str">"ai"</span>,    <span class="str">"{label}"</span>),
])
few = <span class="fn">FewShotChatMessagePromptTemplate</span>(
    example_prompt=example_prompt, examples=examples
)

final = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Yorumları olumlu, olumsuz veya nötr olarak sınıflandır."</span>),
    few,
    (<span class="str">"human"</span>, <span class="str">"{input}"</span>)
])
<span class="fn">print</span>(final.<span class="fn">format</span>(<span class="ty">input</span>=<span class="str">"Vasat ürün, iki yıldız."</span>))</code></pre></div>
<p class="l-text"><strong>Burada beş önemli detay var:</strong> 1) <code>examples</code> <code>{input, label}</code> dict listesidir — modelin görevi bağlam-içi öğreneceği etiketli gösterimler. 2) <code>example_prompt</code> her örneği <code>human</code> + <code>ai</code> turu olarak render eder; model doğal bir Soru/Cevap deseni görür. 3) <code>FewShotChatMessagePromptTemplate(example_prompt=..., examples=...)</code> her örneği o mini-şablondan geçirir ve tek bir mesaj bloğu üretir. 4) Dıştaki <code>ChatPromptTemplate.from_messages([system, few, ("human","{input}")])</code> system talimatı ile yeni sorgu arasına örnekleri sandviç olarak yerleştirir. 5) <code>final.format(input=...)</code> gönderime hazır tam mesaj listesini basar.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Few-shot, sadece string birleştirmedir: örnekleri başlığa render edin, yeni sorguyu sona ekleyin. Bonus olarak aynı örneklerle sklearn temel modeli eğit; küçük etiketli set sınıfları zaten ayırıyor.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Few-shot prompt kurma + minik sklearn temeli
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

ornekler = [
    {"input": "Telefonu seviyorum, pil sonsuza kadar gidiyor!", "label": "olumlu"},
    {"input": "En kötü alışveriş, bir haftada bozuldu.",         "label": "olumsuz"},
    {"input": "Beklendiği gibi çalışıyor, özel bir şey yok.",    "label": "nötr"},
]

# 1) Prompt'u manuel kur
baslik = "Yorumları olumlu, olumsuz veya nötr olarak sınıflandır.\n\n"
shots  = "\n".join(f"S: {e['input']}\nC: {e['label']}" for e in ornekler)
sorgu  = "S: Vasat ürün, iki yıldız.\nC:"
print(baslik + shots + "\n" + sorgu + "\n")

# 2) Aynı örnekler -> sklearn temeli (LLM gerekmez)
vec = TfidfVectorizer().fit([e["input"] for e in ornekler])
clf = LogisticRegression().fit(vec.transform([e["input"] for e in ornekler]),
                               [e["label"] for e in ornekler])
test = ["harika pil!", "varışta bozuk", "idare eder"]
print("temel tahminler:", list(zip(test, clf.predict(vec.transform(test)))))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Prompt'u elle render eder: talimat içeren bir <code>baslik</code>, <code>"S: ... C: ..."</code> satırları olarak birleştirilen <code>shots</code>, sonra cevap bekleyen yeni <code>sorgu</code>. 2) Basılan blok, bir LLM'nin alacağı şeyin aynısıdır — few-shot perde arkasında kelimesi kelimesine string birleştirmedir. 3) Bonus adım aynı üç örnek üzerinde <code>TfidfVectorizer + LogisticRegression</code> eğitir; minik bir etiketli setin bile olumlu / olumsuz / nötr'ü ayırdığını gösterir. 4) <code>clf.predict(vec.transform(test))</code> deterministik bir taban çizgi verir; yorum-sınıflandırma hatlarında LLM çıktısıyla karşılaştırmak için kullanışlı bir sağlamlık testidir.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Çıktı parser'ları — Pydantic şeması</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field
<span class="kw">from</span> langchain_core.output_parsers <span class="kw">import</span> PydanticOutputParser
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

<span class="kw">class</span> <span class="fn">ReviewLabel</span>(BaseModel):
    sentiment: <span class="ty">str</span> = <span class="fn">Field</span>(description=<span class="str">"olumlu | olumsuz | nötr"</span>)
    confidence: <span class="ty">float</span> = <span class="fn">Field</span>(description=<span class="str">"model güveni 0-1"</span>)
    reasons: <span class="ty">list</span>[<span class="ty">str</span>] = <span class="fn">Field</span>(description=<span class="str">"2-3 kısa madde gerekçe"</span>)

parser = <span class="fn">PydanticOutputParser</span>(pydantic_object=ReviewLabel)

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Yorum analistisin. {format_instructions}"</span>),
    (<span class="str">"human"</span>,  <span class="str">"Yorum: {review}"</span>)
]).<span class="fn">partial</span>(format_instructions=parser.<span class="fn">get_format_instructions</span>())

chain = prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>) | parser
out: ReviewLabel = chain.<span class="fn">invoke</span>({<span class="str">"review"</span>: <span class="str">"Pil harika ama kamera kötü."</span>})
<span class="fn">print</span>(out.sentiment, out.confidence, out.reasons)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Pydantic \`BaseModel\` şeması tanımlar — alanlar LLM'nin döndürmesi gereken JSON şeklini oluşturur. 2) \`model.with_structured_output(Schema)\` (veya PydanticOutputParser) LangChain'e sağlayıcının native function-calling / JSON-mode özelliğini kullanarak şemayı zorunlu kılmasını söyler. 3) \`.invoke({...})\` Pydantic sınıfınızın bir örneğini döndürür, string değil — tip-güvenli ve doğrulanmış. 4) Aşağı yönlü kod alanlara göre dallandığında bunu kullanın; LLM metninin kırılgan regex parse'ını ortadan kaldırır.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pydantic parser, sadece JSON doğrulamasıdır. Beklenen şemayı dict olarak tanımlayın, modelin "cevabını" json.loads ile çözün, sonra zorunlu anahtar ve tipleri kontrol edin — PydanticOutputParser'ın içeride yaptığı tam olarak budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Manuel Pydantic-tarzı parser
import json

SEMA = {
    "sentiment":  str,
    "confidence": float,
    "reasons":    list,
}

def parse_review(raw):
    # LLM'in JSON'u sıklıkla sardığı kod fence'lerini temizle
    fence = chr(96) * 3   # template-literal çakışmasından kaçınmak için
    raw = raw.strip().removeprefix(fence + "json").removesuffix(fence).strip()
    obj = json.loads(raw)
    for key, typ in SEMA.items():
        if key not in obj:
            raise ValueError(f"eksik anahtar: {key}")
        if not isinstance(obj[key], typ):
            raise TypeError(f"{key} {typ.__name__} olmalı")
    return obj

# İki LLM yanıtı simüle et: biri iyi, biri bozuk
iyi  = '{"sentiment":"karışık","confidence":0.78,"reasons":["pil ok","kamera zayıf"]}'
kotu = '{"sentiment":"karışık","confidence":"yüksek","reasons":["kamera zayıf"]}'

print("OK:", parse_review(iyi))
try:
    parse_review(kotu)
except TypeError as e:
    print("REDDEDİLDİ ->", e)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) LLM (metin konuşur) ile aşağı yöndeki Python kodu (typed nesneleri tercih eder) arasında köprü kurmak için JSON parse veya inşa eder. 2) \`json.loads\` modelin metin çıktısını dict'e decode eder; LLM'ler bazen bozuk JSON ürettiği için try/except ile eşleştirin. 3) Sağlam yapılı çıktı için \`with_structured_output(Schema)\` tercih edin — sağlayıcılar JSON şemasını model seviyesinde zorlar, parse adımı ortadan kalkar. 4) Agent tool çağrılarında JSON sağlayıcının tool-calling API'si tarafından doğrudan üretilir; manuel parse gerekmez.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Gerçek örnek — df_reviews'tan yorum sınıflandırma</h2>
<p class="l-text">Aşağıda her yorumu LLM'e göndermeden önce çalıştıracağınız ön-işleme türü var. Bu kısmı saf Python tutuyoruz; LLM çağrısı üretimde gerçek bir API anahtarıyla olur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

df_reviews = pd.<span class="fn">DataFrame</span>({
    <span class="str">"id"</span>: <span class="fn">range</span>(<span class="num">1</span>, <span class="num">7</span>),
    <span class="str">"text"</span>: [
        <span class="str">"Pil harika, ekran vasat."</span>,
        <span class="str">"Servis yavaştı ama personel kibar."</span>,
        <span class="str">"Geldiğinde arızalıydı, iade ettim."</span>,
        <span class="str">"Beş yıldız, tam tarif edildiği gibi."</span>,
        <span class="str">"Gürültülü, sıcak, aldığıma pişman oldum."</span>,
        <span class="str">"Vasat. İşini görüyor."</span>
    ]
})

<span class="cm"># LLM'den önce temizlik: boşları at, maliyeti kontrol için 500 karaktere kırp</span>
df_reviews[<span class="str">"clean"</span>] = (df_reviews[<span class="str">"text"</span>]
                       .<span class="ty">str</span>.<span class="fn">strip</span>()
                       .<span class="ty">str</span>.<span class="fn">slice</span>(<span class="num">0</span>, <span class="num">500</span>))
<span class="fn">print</span>(df_reviews.<span class="fn">head</span>())
<span class="fn">print</span>(<span class="str">"ortalama karakter:"</span>, df_reviews[<span class="str">"clean"</span>].<span class="ty">str</span>.<span class="fn">len</span>().<span class="fn">mean</span>())</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Örneğin kendi içinde çalışması için <code>df_reviews</code> DataFrame'ini kurar — gerçek bir <code>reviews.csv</code> ingest'iyle aynı şekildir. 2) <code>df_reviews["text"].str.strip()</code> kazınmış kaynaklardan sızan baştaki/sondaki boşlukları siler. 3) <code>.str.slice(0, 500)</code> her yorumu 500 karakterde sert kapatır — token başına ödemeden önce kaba ama etkili bir maliyet koruması. 4) <code>df_reviews["clean"].str.len().mean()</code> ortalama uzunluğu raporlar; böylece token harcamasını önceden tahmin edebilirsiniz.</p>
<p class="l-text"><strong>Ne yapar:</strong> prompt uzunluğunu sınırlamak için yorumları temizler ve kırpar. Gerçek bir hatta sonra adım 4'teki chain'i her satır için (veya batch'li async döngüde) çağırır ve <code>sentiment</code>, <code>confidence</code> sütunları eklersiniz.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. Function / tool calling şeması</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">sentiment_score</span>(text: <span class="ty">str</span>) -> <span class="ty">dict</span>:
    <span class="str">"""Bir metin parçası için duygu skoru ve etiket döndürür."""</span>
    <span class="kw">return</span> {<span class="str">"label"</span>: <span class="str">"olumlu"</span>, <span class="str">"score"</span>: <span class="num">0.91</span>}  <span class="cm"># taslak</span>

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>).<span class="fn">bind_tools</span>([sentiment_score])
resp = llm.<span class="fn">invoke</span>(<span class="str">"Bu yorumu skorla: 'Sahip olduğum en iyi laptop.'"</span>)
<span class="fn">print</span>(resp.tool_calls)
<span class="cm"># -> [{'name': 'sentiment_score', 'args': {'text': "Sahip olduğum..."}, 'id': '...'}]</span></code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) \`@tool\` (veya \`StructuredTool.from_function\`) sıradan bir Python fonksiyonunu LangChain'in LLM'e tanıtabileceği bir \`BaseTool\`'a dönüştürür. 2) Fonksiyonun docstring'i modelin okuduğu tool açıklaması olur; type hint'ler argümanlar için JSON şeması olur — ikisini de dikkatli yazın. 3) Tool'lar \`model.bind_tools([t1, t2, ...])\` ile modele geçirilir; LLM yanıtında structured \`tool_calls\` üretebilir. 4) Runtime (agent executor veya kendi döngünüz) tool çağrısını parse eder, Python fonksiyonunu çalıştırır ve sonucu bir sonraki LLM turu için \`ToolMessage\` olarak geri besler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Function-calling kayıt defterini kendi elinle kur: {ad: callable} dict'i, ve "model kararını" gerçek Python çağrısına çeviren minik parser. bind_tools'un resmileştirdiği desen.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># LangChain olmadan tool-calling kayıt defteri
def sentiment_score(text):
    """Bir metin parçası için duygu skoru ve etiket döndürür."""
    pos = sum(w in text.lower() for w in ["sev","harika","muhteşem","iyi"])
    neg = sum(w in text.lower() for w in ["kötü","bozuk","berbat","nefret"])
    label = "olumlu" if pos > neg else "olumsuz" if neg > pos else "nötr"
    return {"label": label, "score": round(0.5 + 0.1 * (pos - neg), 2)}

ARACLAR = {"sentiment_score": sentiment_score}

# Simüle edilmiş model kararı (bind_tools'un üreteceği şey)
tool_calls = [
    {"name": "sentiment_score", "args": {"text": "Sahip olduğum en iyi laptop."}, "id": "c1"},
    {"name": "sentiment_score", "args": {"text": "En kötü alışveriş."},          "id": "c2"},
]

for call in tool_calls:
    fn = ARACLAR[call["name"]]
    sonuc = fn(**call["args"])
    print(f"{call['id']} {call['name']}({call['args']}) -> {sonuc}")</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>sentiment_score(text)</code> herhangi bir LLM-çağrılabilir aracın sade Python karşılığıdır — olumlu vs olumsuz anahtar kelimeleri sayar ve bir <code>{label, score}</code> dict'i döndürür. 2) <code>ARACLAR</code> isim-çağrılabilir kayıt defteridir — LangChain'in <code>bind_tools</code>'unun hangi fonksiyonu çağıracağını bulmak için içeride tuttuğu aynı eşleşme. 3) <code>tool_calls</code> gerçek bir modelin üreteceğini simüle eder: <code>{name, args, id}</code> dict listesi (<code>resp.tool_calls</code> ile birebir aynı şekil). 4) Döngü her çağrıyı <code>fn(**call["args"])</code> ile dağıtır ve sonucu basar — bir agent executor'ün yaptığı çağır-sonra-geri-besle adımının aynısı.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Prompt versiyonlama best practice'leri</h2>
<div class="calc-steps">
<div class="calc-step"><strong>1. Prompt'ları kodda saklayın</strong>, etrafa saçılmış string'lerde değil. Prompt ailesi başına bir modül.</div>
<div class="calc-step"><strong>2. Her prompt'a anlamsal versiyon verin</strong> (<code>review_v3</code>), log ve eval'lar belirli bir metne bağlansın.</div>
<div class="calc-step"><strong>3. partial(...)</strong> kullanarak sabit ayarları (format talimatları, güncel tarih) önceden bağlayın; çağrı yeri sadece kullanıcı girdisini geçsin.</div>
<div class="calc-step"><strong>4. Küçük bir eval seti tutun</strong> (~30 vaka). Prompt değiştirince yeniden çalıştırın; doğruluk geriliyorsa yayınlamayın.</div>
<div class="calc-step"><strong>5. Mega-prompt'lardan kaçının.</strong> Bir prompt = bir iş. Onun yerine chain'lerle (L4) kompoze edin.</div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Few-shot etkisi — örnek doğruluk</h2>
<div id="lc-l3-fs-tr" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var x=['0-shot','2-shot','4-shot','8-shot','16-shot'];
  var y=[71,82,87,89,90];
  var data=[{type:'scatter',mode:'lines+markers',x:x,y:y,
    marker:{color:T,size:12},line:{color:T,width:3}}];
  var layout={title:'Few-shot sayısı vs sınıflandırma doğruluğu (oyuncak yorum görevi)',
    xaxis:{title:'prompt içindeki örnek sayısı'},yaxis:{title:'doğruluk (%)',range:[60,100]},
    margin:{l:60,r:30,t:60,b:60},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l3-fs-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L4, prompt'ları ve modelleri <strong>chain</strong>'lere bağlıyor — dallanma, hata yönetimi ve karmaşık hatları okunur tutan LCEL pipe sözdizimi.</p>
</div>
`
};
