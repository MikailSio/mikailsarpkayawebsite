window.HF_L11 = {
en: `<p class="l-text"><strong>An "agent" is a model that decides which tool to call next.</strong> That sentence is the entire premise. Everything else — ReAct loops, function-calling schemas, planner/executor splits — is plumbing around it. HuggingFace's <code>smolagents</code> (the 2024 successor to <code>transformers.agents</code>) is the most readable plumbing in the field: ~2000 lines of Python, MIT-licensed, no framework cult, and the unique design choice of letting the LLM emit <em>actual Python code</em> rather than JSON tool calls.</p>

<p class="l-text">In this lesson we'll walk through the smolagents architecture, contrast code-execution agents with the JSON-tool-call style (LangChain, OpenAI tools), build a tiny dispatch loop in Pyodide so the mechanics stop feeling like magic, and finish with the security model that makes letting an LLM write executable code less terrifying than it sounds. By the end you'll know why HuggingFace bet on code-as-action and when that bet wins versus loses against the JSON-call mainstream.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The smolagents core: <code>CodeAgent</code> vs <code>ToolCallingAgent</code></li>
<li>Code-as-action: why emitting Python beats emitting JSON for many tasks</li>
<li>The ReAct multi-step loop and where it iterates</li>
<li>Tool registration, type hints, and the <code>@tool</code> decorator</li>
<li>Sandboxing options: local AST allow-list, Docker, E2B</li>
<li>When to reach for smolagents vs LangChain vs roll-your-own</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Two Agent Designs</h2>
<p class="l-text">Every agent framework today belongs to one of two camps. smolagents pioneered the first; everyone else does the second.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Code-execution (smolagents CodeAgent)</div><div class="card-body">Model outputs a Python snippet. Snippet calls Python functions (the "tools"). A sandbox executes it; outputs feed the next turn.</div></div>
<div class="calc-card"><div class="card-title">JSON tool-calling (LangChain / OpenAI)</div><div class="card-body">Model outputs a JSON object: <code>{"tool": "search", "args": {...}}</code>. Framework dispatches the call and returns the result.</div></div>
</div>

<p class="l-text">Why code-as-action is interesting: a snippet can compose tools naturally — <code>x = search(q); return summarize(x)</code> — without an extra round-trip. JSON calls require the model to return, get the result, then issue another call to compose. For multi-step queries that involves N model calls; for a code agent it's one. The original smolagents paper measured 30%+ wall-clock and token-cost savings on multi-step benchmarks.</p>

<div class="calc-highlight">The cost: code execution is more dangerous than JSON dispatch. The smolagents answer is a strict AST-level sandbox plus an allow-list of safe builtins. We'll see the mechanism in section 6.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. A First smolagent</h2>
<p class="l-text">Here is the full hello-world. Three things: a tool definition, a model handle, an agent that wires them together.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — smolagents)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> smolagents <span class="kw">import</span> CodeAgent, tool, HfApiModel

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">get_stock_price</span>(ticker: <span class="fn">str</span>) -&gt; <span class="fn">float</span>:
    <span class="str">"""Return today's closing price for a US stock ticker.

    Args:
        ticker: A US stock ticker symbol like 'AAPL' or 'TSLA'.
    """</span>
    <span class="cm"># Pretend implementation</span>
    fake = {<span class="str">"AAPL"</span>: <span class="num">195.4</span>, <span class="str">"TSLA"</span>: <span class="num">248.5</span>, <span class="str">"GOOGL"</span>: <span class="num">175.2</span>}
    <span class="kw">return</span> fake.<span class="fn">get</span>(ticker.<span class="fn">upper</span>(), <span class="num">0.0</span>)

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">get_currency_rate</span>(from_currency: <span class="fn">str</span>, to_currency: <span class="fn">str</span>) -&gt; <span class="fn">float</span>:
    <span class="str">"""Return the current exchange rate between two ISO 4217 currency codes."""</span>
    <span class="kw">return</span> {<span class="str">"USDEUR"</span>: <span class="num">0.92</span>, <span class="str">"USDTRY"</span>: <span class="num">33.1</span>, <span class="str">"EURUSD"</span>: <span class="num">1.09</span>}.<span class="fn">get</span>(
        from_currency.<span class="fn">upper</span>() + to_currency.<span class="fn">upper</span>(), <span class="num">1.0</span>
    )

model = <span class="fn">HfApiModel</span>(<span class="str">"Qwen/Qwen2.5-Coder-32B-Instruct"</span>)
agent = <span class="fn">CodeAgent</span>(tools=[get_stock_price, get_currency_rate], model=model)

answer = agent.<span class="fn">run</span>(
    <span class="str">"How much would 100 shares of Tesla cost in Turkish Lira?"</span>
)
<span class="fn">print</span>(answer)
<span class="cm"># Internally, the agent emits something like:</span>
<span class="cm">#   p = get_stock_price("TSLA")</span>
<span class="cm">#   rate = get_currency_rate("USD", "TRY")</span>
<span class="cm">#   final_answer(p * 100 * rate)</span>
</code></pre></div>

<p class="l-text">The <code>@tool</code> decorator inspects type hints and the docstring to generate the schema the model sees. The signature and the docstring are the entire prompt — write them as carefully as you'd write API docs, because the model will read them as such.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The ReAct Loop</h2>
<p class="l-text">Both code and JSON agents iterate. The loop pattern is identical: <strong>think -&gt; act -&gt; observe -&gt; repeat</strong>. smolagents calls this the ReAct loop after the original Yao 2022 paper. Each iteration is a separate model call.</p>

<div class="katex-block">$$\\text{loop}: \\quad \\text{prompt}_t \\to \\text{LLM} \\to \\text{action}_t \\to \\text{exec} \\to \\text{obs}_t \\to \\text{prompt}_{t+1}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> re

<span class="cm"># A miniature dispatch agent: simulate the ReAct loop without an LLM</span>
<span class="cm"># We hand-write a "thought stream" so you can see the mechanics.</span>
TOOLS = {
    <span class="str">"lookup_iris_count"</span>: <span class="kw">lambda</span> species: <span class="fn">int</span>((df_iris[<span class="str">"species"</span>] == species).<span class="fn">sum</span>()),
    <span class="str">"iris_mean_petal"</span>:   <span class="kw">lambda</span> species: <span class="fn">float</span>(
        df_iris[df_iris[<span class="str">"species"</span>] == species][<span class="str">"petal_length"</span>].<span class="fn">mean</span>()),
    <span class="str">"compute_ratio"</span>:     <span class="kw">lambda</span> a, b: <span class="fn">float</span>(a) / <span class="fn">float</span>(b) <span class="kw">if</span> <span class="fn">float</span>(b) != <span class="num">0</span> <span class="kw">else</span> <span class="fn">float</span>(<span class="str">"nan"</span>),
}

<span class="kw">def</span> <span class="fn">llm_stub</span>(history, step):
    <span class="str">"""Pretend LLM. Returns the next action given the conversation so far."""</span>
    plan = [
        (<span class="str">"call"</span>, <span class="str">"lookup_iris_count"</span>, {<span class="str">"species"</span>: <span class="str">"setosa"</span>}),
        (<span class="str">"call"</span>, <span class="str">"lookup_iris_count"</span>, {<span class="str">"species"</span>: <span class="str">"virginica"</span>}),
        (<span class="str">"call"</span>, <span class="str">"compute_ratio"</span>,     {<span class="str">"a"</span>: history[<span class="str">"obs"</span>][<span class="num">0</span>], <span class="str">"b"</span>: history[<span class="str">"obs"</span>][<span class="num">1</span>]}),
        (<span class="str">"final"</span>, <span class="kw">None</span>,               {<span class="str">"answer"</span>: history[<span class="str">"obs"</span>][-<span class="num">1</span>]}),
    ]
    <span class="kw">return</span> plan[step]

<span class="kw">def</span> <span class="fn">react_loop</span>(question, max_steps=<span class="num">5</span>):
    history = {<span class="str">"thoughts"</span>: [], <span class="str">"obs"</span>: [], <span class="str">"actions"</span>: []}
    <span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(max_steps):
        action_type, tool_name, args = <span class="fn">llm_stub</span>(history, step)
        history[<span class="str">"actions"</span>].<span class="fn">append</span>((action_type, tool_name, args))
        <span class="kw">if</span> action_type == <span class="str">"final"</span>:
            <span class="fn">print</span>(f<span class="str">"step {step+1}: FINAL  -&gt; {args['answer']}"</span>)
            <span class="kw">return</span> args[<span class="str">"answer"</span>]
        result = TOOLS[tool_name](**args)
        history[<span class="str">"obs"</span>].<span class="fn">append</span>(result)
        <span class="fn">print</span>(f<span class="str">"step {step+1}: {tool_name}({args}) = {result}"</span>)
    <span class="kw">return</span> <span class="kw">None</span>

<span class="fn">react_loop</span>(<span class="str">"What is the ratio of setosa to virginica iris counts?"</span>)
</code></pre></div>

<p class="l-text">In a real CodeAgent the LLM would emit one Python block instead of three discrete calls — but the loop structure stays the same: model emits, executor runs, output feeds back. Looping is what separates "single-turn function call" from "agent".</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Code-as-Action Wins You See</h2>
<p class="l-text">Code-execution agents shine when the task involves data manipulation, control flow, or non-trivial composition. JSON agents shine when the task is a sequence of clearly bounded API calls.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Wins for Code</div><div class="card-body">Loops, list comprehensions, math, dataframe filters, intermediate variables. "Sum the prices of orders made by users in Germany in March" is one snippet vs four JSON calls.</div></div>
<div class="calc-card"><div class="card-title">Wins for JSON</div><div class="card-body">Single deterministic API hit. <code>send_email(to=..., body=...)</code>. No composition needed; JSON is auditable and the schema is obvious.</div></div>
<div class="calc-card"><div class="card-title">Tie</div><div class="card-body">Single tool with simple args, like <code>get_weather(city)</code>. Both work; pick whichever your team knows better.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Concrete example: "average sentiment of negative reviews from last month"</span>
<span class="cm"># In a JSON agent: 3 round-trips</span>
<span class="cm">#   1. fetch_reviews(month=last) -&gt; list</span>
<span class="cm">#   2. classify_sentiment(reviews) -&gt; list of scores  (assume helper exists)</span>
<span class="cm">#   3. mean(scores)</span>
<span class="cm"># In a code agent: one snippet, one round-trip:</span>

<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">500</span>)
X = vec.<span class="fn">fit_transform</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">astype</span>(<span class="fn">str</span>))
y = (df_reviews[<span class="str">"rating"</span>] &gt;= <span class="num">4</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">300</span>).<span class="fn">fit</span>(X, y)

<span class="cm"># The "snippet the LLM would emit":</span>
<span class="kw">def</span> <span class="fn">average_negative_review_sentiment</span>():
    proba_pos = clf.<span class="fn">predict_proba</span>(X)[:, <span class="num">1</span>]
    negative_mask = df_reviews[<span class="str">"rating"</span>] &lt;= <span class="num">2</span>
    <span class="kw">return</span> <span class="fn">float</span>(proba_pos[negative_mask].<span class="fn">mean</span>())

<span class="fn">print</span>(f<span class="str">"average sentiment of low-rated reviews: {average_negative_review_sentiment():.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"reviews count                        : {len(df_reviews)}"</span>)
<span class="fn">print</span>(f<span class="str">"low-rating count                     : {int((df_reviews['rating'] &lt;= 2).sum())}"</span>)
</code></pre></div>

<p class="l-text"><strong>How this code shows the code-as-action win:</strong> we train a TfidfVectorizer + LogisticRegression as a stand-in sentiment scorer on <code>df_reviews</code>, then define <code>average_negative_review_sentiment</code> — the exact snippet a CodeAgent would emit. The function combines three actions (predict probabilities, filter for low ratings, average) in one Python expression. A JSON agent would have needed three round-trips: fetch → classify → mean. Printing the mean alongside the total review count and low-rating count makes the composition obvious — and the savings real.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Multi-Agent &amp; Managed Systems</h2>
<p class="l-text">A single agent works for a single skill domain. For larger problems, smolagents supports a <code>ManagedAgent</code> pattern: a top-level agent delegates sub-problems to specialized sub-agents.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — smolagents managed)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> smolagents <span class="kw">import</span> CodeAgent, ManagedAgent, HfApiModel, DuckDuckGoSearchTool

model = <span class="fn">HfApiModel</span>(<span class="str">"Qwen/Qwen2.5-Coder-32B-Instruct"</span>)

<span class="cm"># Specialized worker that only does web research</span>
researcher = <span class="fn">CodeAgent</span>(
    tools=[<span class="fn">DuckDuckGoSearchTool</span>()],
    model=model,
    name=<span class="str">"researcher"</span>,
    description=<span class="str">"Web research agent. Pass it a single research question; it returns findings."</span>,
    max_steps=<span class="num">5</span>,
)

<span class="cm"># A second specialized worker that only does calculations</span>
analyst = <span class="fn">CodeAgent</span>(
    tools=[],   <span class="cm"># pure-python is its tool</span>
    model=model,
    name=<span class="str">"analyst"</span>,
    description=<span class="str">"Numerical analysis agent. Pass it data and a question; it computes statistics."</span>,
)

<span class="cm"># The orchestrator delegates to either worker as needed</span>
manager = <span class="fn">CodeAgent</span>(
    tools=[],
    model=model,
    managed_agents=[
        <span class="fn">ManagedAgent</span>(researcher, <span class="str">"researcher"</span>),
        <span class="fn">ManagedAgent</span>(analyst, <span class="str">"analyst"</span>),
    ],
)

result = manager.<span class="fn">run</span>(
    <span class="str">"Find the population of Istanbul and Tokyo, then compute their ratio."</span>
)
<span class="fn">print</span>(result)
</code></pre></div>

<p class="l-text"><strong>How the multi-agent wiring works:</strong> we build two specialized <code>CodeAgent</code> workers — <code>researcher</code> gets only the DuckDuckGo tool and is described as a web-research agent; <code>analyst</code> has no tools (pure Python is its only capability) and is described as a numerical computation agent. The <code>manager</code> agent has no tools of its own but wraps both workers in <code>ManagedAgent</code>; when given a high-level question, it picks which worker to delegate to based purely on their <code>description</code> strings. The strings are the entire prompt the manager sees about each worker — write them as you would API docs.</p>


<div class="calc-highlight">The pattern is hierarchical: only the manager reasons about the high-level plan; workers see narrow contexts. Token cost is much lower than dumping all tools into one giant prompt, and individual workers are easier to test in isolation.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Sandbox</h2>
<p class="l-text">Letting an LLM emit Python that you <code>exec()</code> on your server is — without a sandbox — equivalent to a remote code execution vulnerability. smolagents ships three increasingly strong isolation modes.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">LocalPythonExecutor</div><div class="card-body">Default. AST allow-list: only registered tools, a fixed set of safe builtins (<code>len</code>, <code>range</code>, math, ...). No <code>import</code>, no <code>open</code>, no <code>os</code>, no attribute access on disallowed types.</div></div>
<div class="calc-card"><div class="card-title">DockerExecutor</div><div class="card-body">Run each step in a one-shot container. Network and filesystem isolation. Heavier per-call overhead (~200 ms) but truly safe for untrusted code.</div></div>
<div class="calc-card"><div class="card-title">E2BExecutor</div><div class="card-body">Hosted Firecracker microVM service. The same isolation as Docker, no infra to run. Pay per execution.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Tiny AST-allow-list executor in the smolagents spirit</span>
<span class="kw">import</span> ast

ALLOWED_BUILTINS = {<span class="str">"len"</span>, <span class="str">"range"</span>, <span class="str">"min"</span>, <span class="str">"max"</span>, <span class="str">"sum"</span>, <span class="str">"abs"</span>, <span class="str">"sorted"</span>,
                    <span class="str">"round"</span>, <span class="str">"int"</span>, <span class="str">"float"</span>, <span class="str">"str"</span>, <span class="str">"list"</span>, <span class="str">"dict"</span>, <span class="str">"set"</span>,
                    <span class="str">"tuple"</span>, <span class="str">"enumerate"</span>, <span class="str">"zip"</span>, <span class="str">"print"</span>}
ALLOWED_NODE_TYPES = {
    ast.Expression, ast.Module, ast.Expr, ast.Call, ast.Name, ast.Load,
    ast.Constant, ast.BinOp, ast.UnaryOp, ast.Compare, ast.BoolOp,
    ast.Add, ast.Sub, ast.Mult, ast.Div, ast.Mod, ast.Pow,
    ast.Lt, ast.Gt, ast.LtE, ast.GtE, ast.Eq, ast.NotEq, ast.Not, ast.USub,
    ast.And, ast.Or, ast.Assign, ast.Store, ast.List, ast.Tuple, ast.Dict,
    ast.For, ast.If, ast.Subscript, ast.Slice, ast.Index, ast.Lambda,
    ast.arguments, ast.arg, ast.Return, ast.FunctionDef, ast.ListComp,
    ast.comprehension,
}

<span class="kw">def</span> <span class="fn">safe_exec</span>(code, tools):
    tree = ast.<span class="fn">parse</span>(code)
    <span class="kw">for</span> node <span class="kw">in</span> ast.<span class="fn">walk</span>(tree):
        <span class="kw">if</span> <span class="fn">type</span>(node) <span class="kw">not</span> <span class="kw">in</span> ALLOWED_NODE_TYPES:
            <span class="kw">raise</span> <span class="fn">ValueError</span>(f<span class="str">"FORBIDDEN node: {type(node).__name__}"</span>)
        <span class="kw">if</span> <span class="fn">isinstance</span>(node, ast.Name) <span class="kw">and</span> node.id <span class="kw">not</span> <span class="kw">in</span> (
                <span class="fn">set</span>(tools) | ALLOWED_BUILTINS | {<span class="str">"_tmp"</span>, <span class="str">"i"</span>, <span class="str">"x"</span>, <span class="str">"result"</span>}):
            <span class="kw">raise</span> <span class="fn">ValueError</span>(f<span class="str">"FORBIDDEN name: {node.id}"</span>)
    env = {<span class="str">"__builtins__"</span>: {b: __builtins__.__dict__[b] <span class="kw">for</span> b <span class="kw">in</span> ALLOWED_BUILTINS}, **tools}
    <span class="fn">exec</span>(<span class="fn">compile</span>(tree, <span class="str">"&lt;agent&gt;"</span>, <span class="str">"exec"</span>), env)
    <span class="kw">return</span> env

<span class="cm"># Safe usage: tool composition</span>
out = <span class="fn">safe_exec</span>(
    <span class="str">"result = sum([x*x for x in range(10)])"</span>,
    tools={},
)
<span class="fn">print</span>(<span class="str">"safe result:"</span>, out[<span class="str">"result"</span>])

<span class="cm"># Refused: import</span>
<span class="kw">try</span>:
    <span class="fn">safe_exec</span>(<span class="str">"import os; os.system('ls')"</span>, tools={})
<span class="kw">except</span> ValueError <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"blocked:"</span>, e)

<span class="cm"># Refused: file open</span>
<span class="kw">try</span>:
    <span class="fn">safe_exec</span>(<span class="str">"open('/etc/passwd').read()"</span>, tools={})
<span class="kw">except</span> ValueError <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"blocked:"</span>, e)
</code></pre></div>

<p class="l-text">Notice that even a small allow-list catches the dangerous primitives: no imports, no attribute access on disallowed objects, no open. Combined with a Docker fallback for higher-trust scenarios, this is the security model that makes code-as-action production-viable.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Streaming, Caching, and Cost Control</h2>
<p class="l-text">Three production knobs you'll want from day one. smolagents exposes all three; flip them on and your monthly bill drops by 30-60%.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Streaming</div><div class="card-body">Stream tokens as the model emits them. UI gets early feedback; if the model is heading in a wrong direction, you can cancel mid-step.</div></div>
<div class="calc-card"><div class="card-title">Step-result caching</div><div class="card-body">Hash (prompt + tool outputs) and cache. Reruns of the same conversation pay nothing. Critical during development.</div></div>
<div class="calc-card"><div class="card-title">Token budgets</div><div class="card-body">Set <code>max_steps</code>, per-step <code>max_tokens</code>, and a global token cap. Agents that misbehave should fail fast and visibly, not run away.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — smolagents controls)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> smolagents <span class="kw">import</span> CodeAgent, HfApiModel

model = <span class="fn">HfApiModel</span>(
    <span class="str">"Qwen/Qwen2.5-Coder-32B-Instruct"</span>,
    temperature=<span class="num">0.1</span>,
    max_tokens=<span class="num">1024</span>,                        <span class="cm"># per-step cap</span>
    custom_role_conversions={<span class="str">"tool-call"</span>: <span class="str">"assistant"</span>},
)

agent = <span class="fn">CodeAgent</span>(
    tools=[...],
    model=model,
    max_steps=<span class="num">6</span>,                            <span class="cm"># fail fast if it loops</span>
    additional_authorized_imports=[<span class="str">"pandas"</span>, <span class="str">"numpy"</span>],   <span class="cm"># if your sandbox allows</span>
    verbosity_level=<span class="num">1</span>,                      <span class="cm"># logs every step</span>
)

<span class="cm"># Stream the steps as they happen instead of waiting for final answer</span>
<span class="kw">for</span> step <span class="kw">in</span> agent.<span class="fn">run</span>(<span class="str">"Compare the GDP per capita of France and Germany."</span>, stream=<span class="kw">True</span>):
    <span class="fn">print</span>(step.observation <span class="kw">if</span> step.observation <span class="kw">else</span> step.action)
</code></pre></div>

<p class="l-text"><strong>How the three controls combine:</strong> the <code>HfApiModel</code> sets a per-step <code>max_tokens=1024</code> ceiling so a single LLM call cannot blow up your bill. <code>max_steps=6</code> caps the whole ReAct loop — an agent that has not finished in six iterations is signalling it is stuck, and you want it to fail loudly rather than spin forever. <code>verbosity_level=1</code> logs each step so the cache key (prompt + tool outputs) is fully reconstructable. Finally <code>stream=True</code> on <code>agent.run</code> yields <em>after every step</em>, so the UI can render partial progress and the user can cancel mid-task instead of waiting for a completion that may never come.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. When to Reach for smolagents</h2>
<p class="l-text">A practical decision tree based on what we've covered. There is no universal best agent framework; pick by workload.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use smolagents when</div><div class="card-body">Tasks involve data manipulation, math, or composing multiple tools per step. You want a small dependency. You like reading the framework's source.</div></div>
<div class="calc-card"><div class="card-title">Use LangChain / LlamaIndex when</div><div class="card-body">You need ready-made retrieval pipelines, document loaders, or evaluation toolkits. Larger ecosystem, larger surface area.</div></div>
<div class="calc-card"><div class="card-title">Use OpenAI / Anthropic native tools when</div><div class="card-body">You're already on a single closed model and want minimal middleware. Function-calling is built-in and well-tested.</div></div>
<div class="calc-card"><div class="card-title">Roll your own when</div><div class="card-body">Your tool dispatch logic is simple (under ~100 lines) and you want zero hidden behavior. The pattern in section 3 is most of what you need.</div></div>
</div>

<p class="l-text">smolagents' bet — that letting LLMs write code is more natural than wrapping every action in JSON — is increasingly being validated as models trained heavily on code (Qwen-Coder, DeepSeek-Coder, Llama-3-Code) become the default agent backends. The framework remains intentionally small, which is part of why it works: less to debug, less to override, less hidden state.</p>
</div>
`,
tr: `<p class="l-text"><strong>"Agent" bir sonraki hangi aracı çağıracağına karar veren bir modeldir.</strong> Bu cümle tüm öncüldür. Geri kalan her şey — ReAct döngüleri, fonksiyon-çağırma şemaları, planlayıcı/yürütücü ayrımları — onun etrafındaki tesisattır. HuggingFace'in <code>smolagents</code>'ı (2024'teki <code>transformers.agents</code> halefi) alandaki en okunabilir tesisattır: ~2000 satır Python, MIT lisanslı, framework kültü yok ve LLM'in JSON araç çağrıları yerine <em>gerçek Python kodu</em> üretmesine izin veren benzersiz tasarım seçimi.</p>

<p class="l-text">Bu derste smolagents mimarisini yürüyeceğiz, kod-yürütme agent'larını JSON-araç-çağrısı stiliyle (LangChain, OpenAI tools) karşılaştıracağız, mekaniğin sihir gibi gelmesini durdurmak için Pyodide'de minik bir dispatch döngüsü inşa edeceğiz ve bir LLM'in çalıştırılabilir kod yazmasına izin vermeyi kulağa geldiği kadar korkutucu olmaktan çıkaran güvenlik modeliyle bitireceğiz. Sonunda HuggingFace'in neden code-as-action'a yatırım yaptığını ve bu yatırımın JSON-çağrısı ana akımına karşı ne zaman kazandığını ne zaman kaybettiğini bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>smolagents çekirdeği: <code>CodeAgent</code> vs <code>ToolCallingAgent</code></li>
<li>Code-as-action: birçok görevde Python üretmenin neden JSON üretmeyi yendiği</li>
<li>ReAct çok-adımlı döngüsü ve nerede döngü kurduğu</li>
<li>Araç kaydı, type hint'leri ve <code>@tool</code> dekoratörü</li>
<li>Sandbox seçenekleri: yerel AST allow-list, Docker, E2B</li>
<li>Ne zaman smolagents vs LangChain vs kendi-yazımına başvurman gerektiği</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. İki Agent Tasarımı</h2>
<p class="l-text">Bugün her agent framework'ü iki kamptan birine aittir. smolagents ilkine öncülük etti; herkes ikincisini yapar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kod yürütme (smolagents CodeAgent)</div><div class="card-body">Model bir Python parçası çıkarır. Parça Python fonksiyonlarını ("araçlar") çağırır. Bir sandbox onu çalıştırır; çıktılar bir sonraki turu besler.</div></div>
<div class="calc-card"><div class="card-title">JSON araç-çağrısı (LangChain / OpenAI)</div><div class="card-body">Model JSON nesnesi çıkarır: <code>{"tool": "search", "args": {...}}</code>. Framework çağrıyı dispatch eder ve sonucu döner.</div></div>
</div>

<p class="l-text">Code-as-action neden ilginç: bir parça araçları doğal olarak besteleyebilir — <code>x = search(q); return summarize(x)</code> — fazladan tur-dönüş olmadan. JSON çağrıları, modelin geri dönmesini, sonucu almasını, sonra beste için başka bir çağrı yapmasını gerektirir. Çok-adımlı sorgular için bu N model çağrısı; kod agent için bir tane. Orijinal smolagents makalesi çok-adımlı benchmark'larda %30+ duvar-saati ve token maliyeti tasarrufu ölçtü.</p>

<div class="calc-highlight">Bedeli: kod yürütme JSON dispatch'ten daha tehlikelidir. smolagents'in cevabı katı bir AST-seviyesi sandbox artı güvenli builtin allow-list'i. Mekanizmayı bölüm 6'da göreceğiz.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. İlk smolagent</h2>
<p class="l-text">İşte tam hello-world. Üç şey: bir araç tanımı, bir model handle'ı, ikisini birleştiren bir agent.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — smolagents)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> smolagents <span class="kw">import</span> CodeAgent, tool, HfApiModel

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">get_stock_price</span>(ticker: <span class="fn">str</span>) -&gt; <span class="fn">float</span>:
    <span class="str">"""Bir ABD hisse senedi sembolü için bugünün kapanış fiyatını döner.

    Args:
        ticker: 'AAPL' veya 'TSLA' gibi bir ABD hisse sembolü.
    """</span>
    <span class="cm"># Sahte uygulama</span>
    fake = {<span class="str">"AAPL"</span>: <span class="num">195.4</span>, <span class="str">"TSLA"</span>: <span class="num">248.5</span>, <span class="str">"GOOGL"</span>: <span class="num">175.2</span>}
    <span class="kw">return</span> fake.<span class="fn">get</span>(ticker.<span class="fn">upper</span>(), <span class="num">0.0</span>)

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">get_currency_rate</span>(from_currency: <span class="fn">str</span>, to_currency: <span class="fn">str</span>) -&gt; <span class="fn">float</span>:
    <span class="str">"""İki ISO 4217 para birimi kodu arasındaki güncel döviz kurunu döner."""</span>
    <span class="kw">return</span> {<span class="str">"USDEUR"</span>: <span class="num">0.92</span>, <span class="str">"USDTRY"</span>: <span class="num">33.1</span>, <span class="str">"EURUSD"</span>: <span class="num">1.09</span>}.<span class="fn">get</span>(
        from_currency.<span class="fn">upper</span>() + to_currency.<span class="fn">upper</span>(), <span class="num">1.0</span>
    )

model = <span class="fn">HfApiModel</span>(<span class="str">"Qwen/Qwen2.5-Coder-32B-Instruct"</span>)
agent = <span class="fn">CodeAgent</span>(tools=[get_stock_price, get_currency_rate], model=model)

answer = agent.<span class="fn">run</span>(
    <span class="str">"100 hisse Tesla Türk Lirası olarak ne kadar tutar?"</span>
)
<span class="fn">print</span>(answer)
<span class="cm"># İçeride agent şuna benzer bir şey üretir:</span>
<span class="cm">#   p = get_stock_price("TSLA")</span>
<span class="cm">#   rate = get_currency_rate("USD", "TRY")</span>
<span class="cm">#   final_answer(p * 100 * rate)</span>
</code></pre></div>

<p class="l-text"><code>@tool</code> dekoratörü, modelin gördüğü şemayı oluşturmak için type hint'leri ve docstring'i inceler. İmza ve docstring tüm prompt'tür — onları API dokümanı yazarken yapacağın özenle yaz, çünkü model bunları aynen öyle okuyacak.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ReAct Döngüsü</h2>
<p class="l-text">Hem kod hem de JSON agent'ları iter eder. Döngü deseni birebir aynıdır: <strong>düşün -&gt; eyle -&gt; gözlemle -&gt; tekrarla</strong>. smolagents buna orijinal Yao 2022 makalesinden sonra ReAct döngüsü der. Her iterasyon ayrı bir model çağrısıdır.</p>

<div class="katex-block">$$\\text{loop}: \\quad \\text{prompt}_t \\to \\text{LLM} \\to \\text{action}_t \\to \\text{exec} \\to \\text{obs}_t \\to \\text{prompt}_{t+1}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> re

<span class="cm"># Mini bir dispatch agent: LLM olmadan ReAct döngüsünü simüle et</span>
<span class="cm"># Mekaniği görebilmen için "düşünce akışını" elle yazıyoruz.</span>
TOOLS = {
    <span class="str">"lookup_iris_count"</span>: <span class="kw">lambda</span> species: <span class="fn">int</span>((df_iris[<span class="str">"species"</span>] == species).<span class="fn">sum</span>()),
    <span class="str">"iris_mean_petal"</span>:   <span class="kw">lambda</span> species: <span class="fn">float</span>(
        df_iris[df_iris[<span class="str">"species"</span>] == species][<span class="str">"petal_length"</span>].<span class="fn">mean</span>()),
    <span class="str">"compute_ratio"</span>:     <span class="kw">lambda</span> a, b: <span class="fn">float</span>(a) / <span class="fn">float</span>(b) <span class="kw">if</span> <span class="fn">float</span>(b) != <span class="num">0</span> <span class="kw">else</span> <span class="fn">float</span>(<span class="str">"nan"</span>),
}

<span class="kw">def</span> <span class="fn">llm_stub</span>(history, step):
    <span class="str">"""Sahte LLM. Şu ana kadarki konuşma verildiğinde sıradaki eylemi döner."""</span>
    plan = [
        (<span class="str">"call"</span>, <span class="str">"lookup_iris_count"</span>, {<span class="str">"species"</span>: <span class="str">"setosa"</span>}),
        (<span class="str">"call"</span>, <span class="str">"lookup_iris_count"</span>, {<span class="str">"species"</span>: <span class="str">"virginica"</span>}),
        (<span class="str">"call"</span>, <span class="str">"compute_ratio"</span>,     {<span class="str">"a"</span>: history[<span class="str">"obs"</span>][<span class="num">0</span>], <span class="str">"b"</span>: history[<span class="str">"obs"</span>][<span class="num">1</span>]}),
        (<span class="str">"final"</span>, <span class="kw">None</span>,               {<span class="str">"answer"</span>: history[<span class="str">"obs"</span>][-<span class="num">1</span>]}),
    ]
    <span class="kw">return</span> plan[step]

<span class="kw">def</span> <span class="fn">react_loop</span>(question, max_steps=<span class="num">5</span>):
    history = {<span class="str">"thoughts"</span>: [], <span class="str">"obs"</span>: [], <span class="str">"actions"</span>: []}
    <span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(max_steps):
        action_type, tool_name, args = <span class="fn">llm_stub</span>(history, step)
        history[<span class="str">"actions"</span>].<span class="fn">append</span>((action_type, tool_name, args))
        <span class="kw">if</span> action_type == <span class="str">"final"</span>:
            <span class="fn">print</span>(f<span class="str">"adım {step+1}: NİHAİ  -&gt; {args['answer']}"</span>)
            <span class="kw">return</span> args[<span class="str">"answer"</span>]
        result = TOOLS[tool_name](**args)
        history[<span class="str">"obs"</span>].<span class="fn">append</span>(result)
        <span class="fn">print</span>(f<span class="str">"adım {step+1}: {tool_name}({args}) = {result}"</span>)
    <span class="kw">return</span> <span class="kw">None</span>

<span class="fn">react_loop</span>(<span class="str">"Setosa ile virginica iris sayılarının oranı nedir?"</span>)
</code></pre></div>

<p class="l-text">Gerçek bir CodeAgent'ta LLM, üç ayrı çağrı yerine bir Python bloğu üretirdi — ama döngü yapısı aynı kalır: model üretir, yürütücü çalıştırır, çıktı geri besler. Döngü, "tek-turlu fonksiyon çağrısını" "agent"tan ayıran şeydir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Code-as-Action'ın Görülen Kazançları</h2>
<p class="l-text">Kod-yürütme agent'ları görev veri manipülasyonu, kontrol akışı veya basit olmayan kompozisyon içerdiğinde parlar. JSON agent'ları görev net sınırlandırılmış API çağrılarının dizisi olduğunda parlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kod kazanır</div><div class="card-body">Döngüler, list comprehension'lar, matematik, dataframe filtreleri, ara değişkenler. "Mart'ta Almanya'daki kullanıcıların verdiği siparişlerin fiyatlarını topla" tek parça vs dört JSON çağrısı.</div></div>
<div class="calc-card"><div class="card-title">JSON kazanır</div><div class="card-body">Tek deterministik API isabeti. <code>send_email(to=..., body=...)</code>. Kompozisyon gerekmez; JSON denetlenebilir ve şema apaçıktır.</div></div>
<div class="calc-card"><div class="card-title">Berabere</div><div class="card-body">Basit argümanlı tek araç, örn. <code>get_weather(city)</code>. İkisi de işe yarar; ekibinin daha iyi bildiğini seç.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Somut örnek: "geçen aydaki negatif yorumların ortalama duygusu"</span>
<span class="cm"># JSON agent'ta: 3 tur-dönüş</span>
<span class="cm">#   1. fetch_reviews(month=last) -&gt; liste</span>
<span class="cm">#   2. classify_sentiment(reviews) -&gt; skor listesi (yardımcı var varsayılır)</span>
<span class="cm">#   3. mean(scores)</span>
<span class="cm"># Kod agent'ında: tek parça, tek tur-dönüş:</span>

<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

vec = <span class="fn">TfidfVectorizer</span>(max_features=<span class="num">500</span>)
X = vec.<span class="fn">fit_transform</span>(df_reviews[<span class="str">"text"</span>].<span class="fn">astype</span>(<span class="fn">str</span>))
y = (df_reviews[<span class="str">"rating"</span>] &gt;= <span class="num">4</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">300</span>).<span class="fn">fit</span>(X, y)

<span class="cm"># "LLM'in üreteceği parça":</span>
<span class="kw">def</span> <span class="fn">average_negative_review_sentiment</span>():
    proba_pos = clf.<span class="fn">predict_proba</span>(X)[:, <span class="num">1</span>]
    negative_mask = df_reviews[<span class="str">"rating"</span>] &lt;= <span class="num">2</span>
    <span class="kw">return</span> <span class="fn">float</span>(proba_pos[negative_mask].<span class="fn">mean</span>())

<span class="fn">print</span>(f<span class="str">"düşük puanlı yorumların ortalama duygusu: {average_negative_review_sentiment():.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"yorum sayısı                            : {len(df_reviews)}"</span>)
<span class="fn">print</span>(f<span class="str">"düşük-puan sayısı                       : {int((df_reviews['rating'] &lt;= 2).sum())}"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kod code-as-action kazancını nasıl gösteriyor:</strong> <code>df_reviews</code> üzerinde TF-IDF + LogisticRegression çiftini sentiment skorlayıcı yerine eğitiyoruz, sonra <code>average_negative_review_sentiment</code> fonksiyonunu tanımlıyoruz — bir CodeAgent'ın üreteceği tam parça. Fonksiyon üç eylemi (olasılık tahmini, düşük puanları filtre, ortalama) tek Python ifadesinde birleştirir. JSON agent üç tur-dönüş gerektirirdi: çek → sınıflandır → ortalama. Ortalamayı toplam yorum sayısı ve düşük-puan sayısıyla birlikte yazdırmak hem kompozisyonu hem tasarrufu somutlaştırır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Çok-Agent &amp; Yönetilen Sistemler</h2>
<p class="l-text">Tek bir agent tek bir yetenek alanı için çalışır. Daha büyük problemler için smolagents <code>ManagedAgent</code> desenini destekler: üst-seviye agent alt-problemleri uzmanlaşmış alt-agent'lara devreder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — smolagents managed)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> smolagents <span class="kw">import</span> CodeAgent, ManagedAgent, HfApiModel, DuckDuckGoSearchTool

model = <span class="fn">HfApiModel</span>(<span class="str">"Qwen/Qwen2.5-Coder-32B-Instruct"</span>)

<span class="cm"># Yalnızca web araştırması yapan uzmanlaşmış işçi</span>
researcher = <span class="fn">CodeAgent</span>(
    tools=[<span class="fn">DuckDuckGoSearchTool</span>()],
    model=model,
    name=<span class="str">"researcher"</span>,
    description=<span class="str">"Web araştırma agent'ı. Tek bir araştırma sorusu ver; bulguları döner."</span>,
    max_steps=<span class="num">5</span>,
)

<span class="cm"># Yalnızca hesaplama yapan ikinci uzmanlaşmış işçi</span>
analyst = <span class="fn">CodeAgent</span>(
    tools=[],   <span class="cm"># saf-python aracıdır</span>
    model=model,
    name=<span class="str">"analyst"</span>,
    description=<span class="str">"Sayısal analiz agent'ı. Veri ve soru ver; istatistik hesaplar."</span>,
)

<span class="cm"># Orkestratör gerektikçe işçilere devreder</span>
manager = <span class="fn">CodeAgent</span>(
    tools=[],
    model=model,
    managed_agents=[
        <span class="fn">ManagedAgent</span>(researcher, <span class="str">"researcher"</span>),
        <span class="fn">ManagedAgent</span>(analyst, <span class="str">"analyst"</span>),
    ],
)

result = manager.<span class="fn">run</span>(
    <span class="str">"İstanbul ve Tokyo nüfusunu bul, sonra oranlarını hesapla."</span>
)
<span class="fn">print</span>(result)
</code></pre></div>

<p class="l-text"><strong>Çoklu-agent kurulumu nasıl çalışır:</strong> iki uzmanlaşmış <code>CodeAgent</code> işçisi kuruyoruz — <code>researcher</code> yalnızca DuckDuckGo aracını alır ve web-araştırma agent'ı olarak tanımlanır; <code>analyst</code>'in aracı yoktur (tek yetisi saf Python) ve sayısal hesaplama agent'ı olarak tanımlanır. <code>manager</code> agent'ın kendi aracı yok ama iki işçiyi <code>ManagedAgent</code> ile sarar; üst-seviye bir soru aldığında, hangi işçiye devredeceğini yalnızca onların <code>description</code> string'lerine bakarak seçer. Bu string'ler yöneticinin her işçi hakkında gördüğü tüm prompt'tur — onları API dokümanı yazar gibi yaz.</p>


<div class="calc-highlight">Desen hiyerarşiktir: yalnızca yönetici üst-seviye plan üzerinde akıl yürütür; işçiler dar bağlamlar görür. Token maliyeti, tüm araçları tek devasa prompt'a atmaktan çok daha düşüktür ve bireysel işçiler izole olarak test etmek daha kolaydır.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Sandbox</h2>
<p class="l-text">Bir LLM'in sunucunda <code>exec()</code> edeceğin Python üretmesine izin vermek — sandbox olmadan — uzaktan kod yürütme zafiyetine eşittir. smolagents giderek güçlenen üç izolasyon modu sunar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">LocalPythonExecutor</div><div class="card-body">Varsayılan. AST allow-list: yalnızca kayıtlı araçlar, sabit bir güvenli builtin kümesi (<code>len</code>, <code>range</code>, math, ...). <code>import</code>, <code>open</code>, <code>os</code> yok, izin verilmeyen tiplerde özellik erişimi yok.</div></div>
<div class="calc-card"><div class="card-title">DockerExecutor</div><div class="card-body">Her adımı tek-atışlık container'da çalıştır. Ağ ve dosya sistemi izolasyonu. Çağrı başına daha ağır yük (~200 ms) ama güvenilmeyen kod için gerçekten güvenli.</div></div>
<div class="calc-card"><div class="card-title">E2BExecutor</div><div class="card-body">Hosted Firecracker microVM hizmeti. Docker ile aynı izolasyon, çalıştırılacak altyapı yok. Yürütme başına öde.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># smolagents ruhunda minik AST-allow-list yürütücüsü</span>
<span class="kw">import</span> ast

ALLOWED_BUILTINS = {<span class="str">"len"</span>, <span class="str">"range"</span>, <span class="str">"min"</span>, <span class="str">"max"</span>, <span class="str">"sum"</span>, <span class="str">"abs"</span>, <span class="str">"sorted"</span>,
                    <span class="str">"round"</span>, <span class="str">"int"</span>, <span class="str">"float"</span>, <span class="str">"str"</span>, <span class="str">"list"</span>, <span class="str">"dict"</span>, <span class="str">"set"</span>,
                    <span class="str">"tuple"</span>, <span class="str">"enumerate"</span>, <span class="str">"zip"</span>, <span class="str">"print"</span>}
ALLOWED_NODE_TYPES = {
    ast.Expression, ast.Module, ast.Expr, ast.Call, ast.Name, ast.Load,
    ast.Constant, ast.BinOp, ast.UnaryOp, ast.Compare, ast.BoolOp,
    ast.Add, ast.Sub, ast.Mult, ast.Div, ast.Mod, ast.Pow,
    ast.Lt, ast.Gt, ast.LtE, ast.GtE, ast.Eq, ast.NotEq, ast.Not, ast.USub,
    ast.And, ast.Or, ast.Assign, ast.Store, ast.List, ast.Tuple, ast.Dict,
    ast.For, ast.If, ast.Subscript, ast.Slice, ast.Index, ast.Lambda,
    ast.arguments, ast.arg, ast.Return, ast.FunctionDef, ast.ListComp,
    ast.comprehension,
}

<span class="kw">def</span> <span class="fn">safe_exec</span>(code, tools):
    tree = ast.<span class="fn">parse</span>(code)
    <span class="kw">for</span> node <span class="kw">in</span> ast.<span class="fn">walk</span>(tree):
        <span class="kw">if</span> <span class="fn">type</span>(node) <span class="kw">not</span> <span class="kw">in</span> ALLOWED_NODE_TYPES:
            <span class="kw">raise</span> <span class="fn">ValueError</span>(f<span class="str">"YASAK düğüm: {type(node).__name__}"</span>)
        <span class="kw">if</span> <span class="fn">isinstance</span>(node, ast.Name) <span class="kw">and</span> node.id <span class="kw">not</span> <span class="kw">in</span> (
                <span class="fn">set</span>(tools) | ALLOWED_BUILTINS | {<span class="str">"_tmp"</span>, <span class="str">"i"</span>, <span class="str">"x"</span>, <span class="str">"result"</span>}):
            <span class="kw">raise</span> <span class="fn">ValueError</span>(f<span class="str">"YASAK isim: {node.id}"</span>)
    env = {<span class="str">"__builtins__"</span>: {b: __builtins__.__dict__[b] <span class="kw">for</span> b <span class="kw">in</span> ALLOWED_BUILTINS}, **tools}
    <span class="fn">exec</span>(<span class="fn">compile</span>(tree, <span class="str">"&lt;agent&gt;"</span>, <span class="str">"exec"</span>), env)
    <span class="kw">return</span> env

<span class="cm"># Güvenli kullanım: araç kompozisyonu</span>
out = <span class="fn">safe_exec</span>(
    <span class="str">"result = sum([x*x for x in range(10)])"</span>,
    tools={},
)
<span class="fn">print</span>(<span class="str">"güvenli sonuç:"</span>, out[<span class="str">"result"</span>])

<span class="cm"># Reddedildi: import</span>
<span class="kw">try</span>:
    <span class="fn">safe_exec</span>(<span class="str">"import os; os.system('ls')"</span>, tools={})
<span class="kw">except</span> ValueError <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"engellendi:"</span>, e)

<span class="cm"># Reddedildi: dosya open</span>
<span class="kw">try</span>:
    <span class="fn">safe_exec</span>(<span class="str">"open('/etc/passwd').read()"</span>, tools={})
<span class="kw">except</span> ValueError <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">"engellendi:"</span>, e)
</code></pre></div>

<p class="l-text">Küçük bir allow-list bile tehlikeli ilkelleri yakaladığına dikkat et: import yok, izin verilmeyen nesnelerde özellik erişimi yok, open yok. Daha yüksek güven senaryoları için Docker fallback ile birleştirildiğinde, code-as-action'ı üretim-uygulanabilir kılan güvenlik modeli budur.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Streaming, Caching ve Maliyet Kontrolü</h2>
<p class="l-text">İlk günden isteyeceğin üç üretim düğmesi. smolagents üçünü de açar; aç ve aylık faturanı %30-60 düşür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Streaming</div><div class="card-body">Model üretirken token'ları stream et. UI erken geri bildirim alır; model yanlış yöne gidiyorsa adım ortasında iptal edebilirsin.</div></div>
<div class="calc-card"><div class="card-title">Adım-sonucu cache'leme</div><div class="card-body">(prompt + araç çıktıları) hash'le ve cache'le. Aynı konuşmanın yeniden çalıştırılması hiçbir şey ödemez. Geliştirme sırasında kritik.</div></div>
<div class="calc-card"><div class="card-title">Token bütçeleri</div><div class="card-body"><code>max_steps</code>, adım başına <code>max_tokens</code> ve global token sınırı koy. Yanlış davranan agent'lar görünür şekilde hızla başarısız olmalı, kaçmamalı.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO — smolagents kontrolleri)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> smolagents <span class="kw">import</span> CodeAgent, HfApiModel

model = <span class="fn">HfApiModel</span>(
    <span class="str">"Qwen/Qwen2.5-Coder-32B-Instruct"</span>,
    temperature=<span class="num">0.1</span>,
    max_tokens=<span class="num">1024</span>,                        <span class="cm"># adım başı sınır</span>
    custom_role_conversions={<span class="str">"tool-call"</span>: <span class="str">"assistant"</span>},
)

agent = <span class="fn">CodeAgent</span>(
    tools=[...],
    model=model,
    max_steps=<span class="num">6</span>,                            <span class="cm"># döngüye girerse hızla başarısız ol</span>
    additional_authorized_imports=[<span class="str">"pandas"</span>, <span class="str">"numpy"</span>],   <span class="cm"># sandbox izin verirse</span>
    verbosity_level=<span class="num">1</span>,                      <span class="cm"># her adımı logla</span>
)

<span class="cm"># Nihai cevabı beklemek yerine adımları olurken stream et</span>
<span class="kw">for</span> step <span class="kw">in</span> agent.<span class="fn">run</span>(<span class="str">"Fransa ve Almanya'nın kişi başı GSYH'sini karşılaştır."</span>, stream=<span class="kw">True</span>):
    <span class="fn">print</span>(step.observation <span class="kw">if</span> step.observation <span class="kw">else</span> step.action)
</code></pre></div>

<p class="l-text"><strong>Üç kontrol nasıl birlikte çalışıyor:</strong> <code>HfApiModel</code>, adım başı <code>max_tokens=1024</code> tavanı koyar — tek bir LLM çağrısı faturanı patlatamaz. <code>max_steps=6</code> tüm ReAct döngüsünü kısıtlar — altı iterasyonda bitiremeyen bir agent sıkıştığını söylüyordur ve sonsuza kadar dönmesindense gürültüyle başarısız olması istenir. <code>verbosity_level=1</code> her adımı loglar, böylece cache anahtarı (prompt + araç çıktıları) tam olarak yeniden kurulabilir. Son olarak <code>agent.run</code>'da <code>stream=True</code> <em>her adımdan sonra</em> yield eder, böylece UI kısmi ilerlemeyi gösterir ve kullanıcı görev ortasında iptal edebilir — asla gelmeyecek bir tamamlamayı beklemek yerine.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. smolagents'a Ne Zaman Başvurmalı</h2>
<p class="l-text">Anlattıklarımıza dayalı pratik bir karar ağacı. Evrensel en iyi agent framework'ü yok; iş yüküne göre seç.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">smolagents kullan</div><div class="card-body">Görev veri manipülasyonu, matematik veya adım başına birden fazla aracı bestelemek içeriyorsa. Küçük bir bağımlılık istiyorsan. Framework kaynağını okumayı seviyorsan.</div></div>
<div class="calc-card"><div class="card-title">LangChain / LlamaIndex kullan</div><div class="card-body">Hazır retrieval pipeline'ları, doküman yükleyiciler veya değerlendirme araç kitleri istediğinde. Daha büyük ekosistem, daha büyük yüzey alanı.</div></div>
<div class="calc-card"><div class="card-title">OpenAI / Anthropic yerli araçları kullan</div><div class="card-body">Zaten tek kapalı modeldeysen ve minimum middleware istiyorsan. Function-calling yerleşik ve iyi test edilmiş.</div></div>
<div class="calc-card"><div class="card-title">Kendin yaz</div><div class="card-body">Araç dispatch mantığın basitse (~100 satırın altında) ve sıfır gizli davranış istiyorsan. Bölüm 3'teki desen ihtiyacının çoğu.</div></div>
</div>

<p class="l-text">smolagents'in iddiası — LLM'lerin kod yazmasına izin vermek her eylemi JSON'da sarmaktan daha doğal — kod üzerinde yoğun eğitilmiş modeller (Qwen-Coder, DeepSeek-Coder, Llama-3-Code) varsayılan agent backend'leri olduğunda giderek doğrulanıyor. Framework bilinçli olarak küçük kalıyor, çalışmasının bir nedeni de bu: ayıklanacak daha az şey, geçilmesi gereken daha az şey, daha az gizli durum.</p>
</div>
`
};
