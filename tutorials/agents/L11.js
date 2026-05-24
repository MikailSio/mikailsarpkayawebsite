window.AGENTS_L11 = {

en: `<p class="l-text"><strong>Your agent is live. A user files a bug at 03:00.</strong> "It returned the wrong answer." Without traces, cost meters, retries, and audit logs, you are blind. With them, you click into a span tree, see the failed tool call, replay the input, and ship a fix before lunch.</p>

<p class="l-text">In this lesson you'll harden agents for production: LangSmith / Phoenix / Langfuse tracing, per-step cost monitoring, retries with exponential backoff, fallback chains, human-in-the-loop gates, input/output guardrails, and immutable audit logs.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Model agent execution as spans and traces (LangSmith / Phoenix / Langfuse)</li>
<li>Track per-step token cost and surface budget breaches</li>
<li>Implement retries with exponential backoff and timeouts that don't compound</li>
<li>Design fallback chains across model providers</li>
<li>Add a human-in-the-loop approval gate for risky actions</li>
<li>Wire input + output guardrails and immutable audit logs</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Observability ≠ Logging</h2>
<p class="l-text">Logs are flat lines of text. Traces are causal trees: one parent run, many child spans, each carrying inputs, outputs, latency, cost, and metadata. For an agent that calls 8 tools across 3 LLM hops, only a span tree shows you which step burned the budget.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trace</div><div class="card-body">A complete agent invocation — root span containing the whole tree.</div></div>
<div class="calc-card"><div class="card-title">Span</div><div class="card-body">One unit: an LLM call, a tool call, a retry. Has start/end and parent.</div></div>
<div class="calc-card"><div class="card-title">Attributes</div><div class="card-body">Tokens, model, args, errors — searchable at scale.</div></div>
<div class="calc-card"><div class="card-title">Replay</div><div class="card-body">Re-run a saved trace against a new agent version to A/B.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Three Tracing Stacks</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">LangSmith</div><div class="card-body">Hosted (LangChain Inc). Best LangChain/LangGraph integration. Replay + datasets + LLM-judge built in. Paid.</div></div>
<div class="calc-card"><div class="card-title">Phoenix (Arize)</div><div class="card-body">Open-source. Runs locally or self-host. OpenTelemetry-native. Strong on RAG eval.</div></div>
<div class="calc-card"><div class="card-title">Langfuse</div><div class="card-body">Open-source, self-host friendly. Cost dashboards, prompt management, eval. EU data residency option.</div></div>
<div class="calc-card"><div class="card-title">OpenTelemetry</div><div class="card-body">Vendor-neutral protocol. Emit spans once, send to any backend (Datadog, Jaeger, Tempo).</div></div>
</div>
<div class="calc-highlight">Pick by deployment posture: hosted convenience (LangSmith), full control (Phoenix), self-host with EU compliance (Langfuse).</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. A LangSmith-Style Trace as Plain Python</h2>
<p class="l-text">Every span has: id, parent_id, name, start, end, attributes. Build one in pure Python to demystify what trackers store.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, time, uuid

<span class="kw">def</span> <span class="fn">span</span>(name, parent=<span class="kw">None</span>, **attrs):
    <span class="kw">return</span> {<span class="str">"id"</span>: <span class="fn">str</span>(uuid.<span class="fn">uuid4</span>())[:<span class="num">8</span>],
            <span class="str">"parent"</span>: parent, <span class="str">"name"</span>: name,
            <span class="str">"t"</span>: <span class="fn">round</span>(time.<span class="fn">time</span>(), <span class="num">3</span>), **attrs}</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a 5-span trace tree (root agent → planner → tool → llm → answer) and dump as JSON.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, uuid

<span class="kw">def</span> <span class="fn">mk</span>(name, parent=<span class="kw">None</span>, **kw):
    <span class="kw">return</span> {<span class="str">"id"</span>: <span class="fn">str</span>(uuid.<span class="fn">uuid4</span>())[:<span class="num">8</span>],
            <span class="str">"parent"</span>: parent, <span class="str">"name"</span>: name, **kw}

root = <span class="fn">mk</span>(<span class="str">"agent_run"</span>, latency_ms=<span class="num">2840</span>, cost_usd=<span class="num">0.0123</span>)
plan = <span class="fn">mk</span>(<span class="str">"planner"</span>, parent=root[<span class="str">"id"</span>],
            model=<span class="str">"sonnet"</span>, in_tok=<span class="num">412</span>, out_tok=<span class="num">88</span>)
tool = <span class="fn">mk</span>(<span class="str">"tool.search"</span>, parent=plan[<span class="str">"id"</span>],
            args={<span class="str">"q"</span>: <span class="str">"capital of France"</span>}, status=<span class="str">"ok"</span>)
llm  = <span class="fn">mk</span>(<span class="str">"llm.compose"</span>, parent=root[<span class="str">"id"</span>],
            model=<span class="str">"sonnet"</span>, in_tok=<span class="num">220</span>, out_tok=<span class="num">35</span>)
ans  = <span class="fn">mk</span>(<span class="str">"answer"</span>, parent=root[<span class="str">"id"</span>], text=<span class="str">"Paris"</span>)

trace = [root, plan, tool, llm, ans]
<span class="fn">print</span>(json.<span class="fn">dumps</span>(trace, indent=<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses or constructs JSON to bridge the LLM (which speaks text) and downstream Python code (which prefers typed objects). 2) \`json.loads\` decodes a model's text output into a dict; pair with try/except since LLMs occasionally produce malformed JSON. 3) For robust structured output prefer \`with_structured_output(Schema)\` — providers enforce the JSON schema at the model level, eliminating the parse step. 4) For agent tool calls the JSON is generated by the provider's tool-calling API directly, no manual parsing needed.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Per-Step Cost Monitoring</h2>
<p class="l-text">Typical agent step (one LLM call + one tool call) runs <strong>$0.005</strong> on Sonnet-level models. Across 1000 daily users at 6 steps each, that is <strong>$30/day</strong> — not catastrophic until a single user triggers a 50-step loop.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>PRICE = {<span class="str">"haiku"</span>: <span class="num">0.0008</span>, <span class="str">"sonnet"</span>: <span class="num">0.005</span>, <span class="str">"opus"</span>: <span class="num">0.025</span>}

<span class="kw">def</span> <span class="fn">cost</span>(model, in_tok, out_tok):
    <span class="cm"># simplified — real pricing splits in/out per model</span>
    base = PRICE[model]
    <span class="kw">return</span> base * (in_tok + <span class="num">3</span> * out_tok) / <span class="num">1000</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeçeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tracks per-step cost across a 6-step agent run and surfaces the top-3 most expensive steps.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> collections <span class="kw">import</span> Counter

PRICE = {<span class="str">"haiku"</span>: <span class="num">0.0008</span>, <span class="str">"sonnet"</span>: <span class="num">0.005</span>, <span class="str">"opus"</span>: <span class="num">0.025</span>}
<span class="kw">def</span> <span class="fn">cost</span>(m, i, o):
    <span class="kw">return</span> PRICE[m] * (i + <span class="num">3</span>*o) / <span class="num">1000</span>

steps = [
    (<span class="str">"plan"</span>,    <span class="str">"sonnet"</span>, <span class="num">412</span>,  <span class="num">88</span>),
    (<span class="str">"search"</span>,  <span class="str">"haiku"</span>,   <span class="num">90</span>,  <span class="num">22</span>),
    (<span class="str">"summarize"</span>,<span class="str">"sonnet"</span>, <span class="num">820</span>, <span class="num">160</span>),
    (<span class="str">"critic"</span>,  <span class="str">"opus"</span>,   <span class="num">340</span>, <span class="num">120</span>),
    (<span class="str">"rewrite"</span>, <span class="str">"sonnet"</span>, <span class="num">200</span>,  <span class="num">95</span>),
    (<span class="str">"answer"</span>,  <span class="str">"haiku"</span>,   <span class="num">60</span>,  <span class="num">28</span>),
]
df = pd.<span class="fn">DataFrame</span>(steps, columns=[<span class="str">"step"</span>, <span class="str">"model"</span>, <span class="str">"in"</span>, <span class="str">"out"</span>])
df[<span class="str">"usd"</span>] = [<span class="fn">cost</span>(m, i, o) <span class="kw">for</span> _, m, i, o <span class="kw">in</span> steps]
<span class="fn">print</span>(df)
<span class="fn">print</span>(<span class="str">"total $:"</span>, df.usd.<span class="fn">sum</span>().<span class="fn">round</span>(<span class="num">5</span>))
<span class="fn">print</span>(<span class="str">"top spenders:"</span>)
<span class="fn">print</span>(df.<span class="fn">nlargest</span>(<span class="num">3</span>, <span class="str">"usd"</span>)[[<span class="str">"step"</span>, <span class="str">"model"</span>, <span class="str">"usd"</span>]])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Retries with Exponential Backoff</h2>
<p class="l-text">Networks blip. APIs rate-limit. Naive retries hammer the upstream and amplify outages. Exponential backoff with jitter spreads the load.</p>
<div class="katex-block">$$\\text{wait}_n = \\min(\\text{cap},\\ \\text{base} \\cdot 2^{n}) + \\text{jitter}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> time, random

<span class="kw">def</span> <span class="fn">retry</span>(fn, tries=<span class="num">5</span>, base=<span class="num">0.5</span>, cap=<span class="num">8.0</span>):
    <span class="kw">for</span> n <span class="kw">in</span> <span class="fn">range</span>(tries):
        <span class="kw">try</span>:
            <span class="kw">return</span> <span class="fn">fn</span>()
        <span class="kw">except</span> <span class="ty">Exception</span> <span class="kw">as</span> e:
            <span class="kw">if</span> n == tries - <span class="num">1</span>: <span class="kw">raise</span>
            wait = <span class="fn">min</span>(cap, base * <span class="num">2</span>**n) + random.<span class="fn">random</span>() * <span class="num">0.3</span>
            time.<span class="fn">sleep</span>(wait)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A flaky function fails twice, succeeds on attempt 3. The retry helper logs each backoff interval.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> time, random
random.<span class="fn">seed</span>(<span class="num">3</span>)

attempt = {<span class="str">"n"</span>: <span class="num">0</span>}
<span class="kw">def</span> <span class="fn">flaky</span>():
    attempt[<span class="str">"n"</span>] += <span class="num">1</span>
    <span class="kw">if</span> attempt[<span class="str">"n"</span>] &lt; <span class="num">3</span>:
        <span class="kw">raise</span> <span class="fn">RuntimeError</span>(<span class="str">"upstream 503"</span>)
    <span class="kw">return</span> <span class="str">"OK"</span>

<span class="kw">def</span> <span class="fn">retry</span>(fn, tries=<span class="num">5</span>, base=<span class="num">0.1</span>, cap=<span class="num">2.0</span>):
    <span class="kw">for</span> n <span class="kw">in</span> <span class="fn">range</span>(tries):
        <span class="kw">try</span>:
            <span class="kw">return</span> <span class="fn">fn</span>()
        <span class="kw">except</span> <span class="ty">Exception</span> <span class="kw">as</span> e:
            wait = <span class="fn">min</span>(cap, base * <span class="num">2</span>**n) + random.<span class="fn">random</span>() * <span class="num">0.05</span>
            <span class="fn">print</span>(f<span class="str">"attempt {n+1} failed: {e}; sleep {wait:.2f}s"</span>)
            time.<span class="fn">sleep</span>(wait)
    <span class="kw">raise</span> <span class="fn">RuntimeError</span>(<span class="str">"giving up"</span>)

<span class="fn">print</span>(<span class="str">"result:"</span>, <span class="fn">retry</span>(flaky))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Timeouts and Fallback Chains</h2>
<p class="l-text">Even with retries you need a hard ceiling. Compose providers in a chain — primary first, then a cheaper / faster fallback when the primary slows or errors.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Per-call timeout</div><div class="card-body">Cap on a single LLM/tool invocation (e.g. 30s).</div></div>
<div class="calc-card"><div class="card-title">Per-step timeout</div><div class="card-body">Cap on one agent step including retries (e.g. 60s).</div></div>
<div class="calc-card"><div class="card-title">Per-trace timeout</div><div class="card-body">Cap on the full agent run (e.g. 5m). Kill long loops.</div></div>
<div class="calc-card"><div class="card-title">Fallback chain</div><div class="card-body">Sonnet → Haiku → cached canned answer.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">fallback_chain</span>(prompt, providers):
    <span class="kw">for</span> p <span class="kw">in</span> providers:
        <span class="kw">try</span>:
            <span class="kw">return</span> <span class="fn">p</span>(prompt)
        <span class="kw">except</span> <span class="ty">Exception</span> <span class="kw">as</span> e:
            <span class="fn">print</span>(<span class="str">"fallback:"</span>, e)
    <span class="kw">return</span> <span class="str">"Sorry, the assistant is temporarily unavailable."</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Human-in-the-Loop (HITL) Approval Gates</h2>
<p class="l-text">For irreversible actions — sending money, deleting rows, posting publicly — pause and require a human "approve". The agent surfaces a proposed action, waits, then either commits or rolls back.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SAFE_TOOLS = {<span class="str">"search"</span>, <span class="str">"read"</span>, <span class="str">"calc"</span>}

<span class="kw">def</span> <span class="fn">hitl_call</span>(tool, args, approver):
    <span class="kw">if</span> tool <span class="kw">in</span> SAFE_TOOLS:
        <span class="kw">return</span> <span class="fn">execute</span>(tool, args)
    decision = <span class="fn">approver</span>(tool, args)  <span class="cm"># queue / Slack / UI</span>
    <span class="kw">if</span> decision != <span class="str">"approved"</span>:
        <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"rejected"</span>, <span class="str">"by"</span>: decision}
    <span class="kw">return</span> <span class="fn">execute</span>(tool, args)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Three proposed agent actions are routed through a HITL policy. Two safe tools auto-pass; one risky tool requires approval (mocked).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SAFE = {<span class="str">"search"</span>, <span class="str">"read"</span>, <span class="str">"calc"</span>}

<span class="kw">def</span> <span class="fn">mock_approver</span>(tool, args):
    <span class="cm"># Simulated: refund &gt; $50 rejected, smaller approved</span>
    <span class="kw">if</span> tool == <span class="str">"refund"</span> <span class="kw">and</span> args.<span class="fn">get</span>(<span class="str">"amount"</span>, <span class="num">0</span>) &gt; <span class="num">50</span>:
        <span class="kw">return</span> <span class="str">"rejected: needs manager"</span>
    <span class="kw">return</span> <span class="str">"approved"</span>

<span class="kw">def</span> <span class="fn">hitl</span>(tool, args):
    <span class="kw">if</span> tool <span class="kw">in</span> SAFE:
        <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"auto"</span>, <span class="str">"tool"</span>: tool}
    d = <span class="fn">mock_approver</span>(tool, args)
    <span class="kw">return</span> {<span class="str">"status"</span>: d, <span class="str">"tool"</span>: tool, <span class="str">"args"</span>: args}

actions = [
    (<span class="str">"search"</span>, {<span class="str">"q"</span>: <span class="str">"return policy"</span>}),
    (<span class="str">"refund"</span>, {<span class="str">"amount"</span>: <span class="num">25</span>}),
    (<span class="str">"refund"</span>, {<span class="str">"amount"</span>: <span class="num">200</span>}),
    (<span class="str">"calc"</span>,   {<span class="str">"expr"</span>: <span class="str">"3*7"</span>}),
]
<span class="kw">for</span> t, a <span class="kw">in</span> actions:
    <span class="fn">print</span>(<span class="fn">hitl</span>(t, a))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Safety Guardrails — Input and Output</h2>
<p class="l-text">Guardrails sandwich the LLM. Input filters block prompt injection, PII, jailbreaks. Output filters strip secrets, validate JSON, redact toxicity.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Input check</div><div class="card-body">Block "ignore previous instructions" patterns and known jailbreaks.</div></div>
<div class="calc-card"><div class="card-title">PII scrub</div><div class="card-body">Regex/NER on emails, phone, SSN, credit cards before sending to LLM.</div></div>
<div class="calc-card"><div class="card-title">Schema validate</div><div class="card-body">Force JSON outputs through pydantic / jsonschema; auto-repair on fail.</div></div>
<div class="calc-card"><div class="card-title">Toxicity filter</div><div class="card-body">Drop or rewrite outputs that exceed a toxicity threshold.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

JAILBREAK = re.<span class="fn">compile</span>(<span class="str">r"ignore (all |the )?previous|disregard.*instructions"</span>, re.I)
EMAIL    = re.<span class="fn">compile</span>(<span class="str">r"[\\w.+-]+@[\\w-]+\\.[\\w.-]+"</span>)

<span class="kw">def</span> <span class="fn">scrub</span>(text):
    <span class="kw">if</span> JAILBREAK.<span class="fn">search</span>(text):
        <span class="kw">raise</span> <span class="fn">ValueError</span>(<span class="str">"blocked: jailbreak attempt"</span>)
    <span class="kw">return</span> EMAIL.<span class="fn">sub</span>(<span class="str">"&lt;EMAIL&gt;"</span>, text)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Wraps a web-search API (Tavily, SerpAPI, Brave) as a tool the agent can invoke — input is a query string, output is a list of \`{title, url, snippet}\` items. 2) Tavily is LangChain's recommended default — designed for LLM consumption, returns clean text snippets rather than raw HTML. 3) The agent decides when to search; for many tasks one search early in the loop is enough to ground the rest of the reasoning. 4) Always cache search results — repeated identical queries during development burn quota fast.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Audit Logs — Immutable, Searchable</h2>
<p class="l-text">For every agent action with side effects (DB write, API POST, refund), append an immutable record: who triggered it, what was proposed, what was approved, what executed, what returned. This is a regulatory requirement in finance, health, and increasingly in EU AI Act-covered systems.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, hashlib, time

<span class="kw">def</span> <span class="fn">audit</span>(prev_hash, event):
    body = json.<span class="fn">dumps</span>(event, sort_keys=<span class="kw">True</span>)
    h = hashlib.<span class="fn">sha256</span>((prev_hash + body).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()
    <span class="kw">return</span> {**event, <span class="str">"prev"</span>: prev_hash, <span class="str">"hash"</span>: h, <span class="str">"ts"</span>: time.<span class="fn">time</span>()}</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses or constructs JSON to bridge the LLM (which speaks text) and downstream Python code (which prefers typed objects). 2) \`json.loads\` decodes a model's text output into a dict; pair with try/except since LLMs occasionally produce malformed JSON. 3) For robust structured output prefer \`with_structured_output(Schema)\` — providers enforce the JSON schema at the model level, eliminating the parse step. 4) For agent tool calls the JSON is generated by the provider's tool-calling API directly, no manual parsing needed.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hash-chain audit log of 4 agent actions. Tamper one row and the next hash break is detectable.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, hashlib

<span class="kw">def</span> <span class="fn">link</span>(prev, ev):
    body = json.<span class="fn">dumps</span>(ev, sort_keys=<span class="kw">True</span>)
    h = hashlib.<span class="fn">sha256</span>((prev + body).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()
    <span class="kw">return</span> {**ev, <span class="str">"prev"</span>: prev[:<span class="num">8</span>], <span class="str">"hash"</span>: h[:<span class="num">8</span>]}

events = [
    {<span class="str">"agent"</span>: <span class="str">"refund_bot"</span>, <span class="str">"action"</span>: <span class="str">"refund"</span>, <span class="str">"amount"</span>: <span class="num">25</span>, <span class="str">"user"</span>: <span class="str">"u1"</span>},
    {<span class="str">"agent"</span>: <span class="str">"refund_bot"</span>, <span class="str">"action"</span>: <span class="str">"escalate"</span>, <span class="str">"user"</span>: <span class="str">"u2"</span>},
    {<span class="str">"agent"</span>: <span class="str">"chat_bot"</span>,   <span class="str">"action"</span>: <span class="str">"reply"</span>, <span class="str">"len"</span>: <span class="num">120</span>},
    {<span class="str">"agent"</span>: <span class="str">"refund_bot"</span>, <span class="str">"action"</span>: <span class="str">"refund"</span>, <span class="str">"amount"</span>: <span class="num">9</span>, <span class="str">"user"</span>: <span class="str">"u3"</span>},
]
chain, prev = [], <span class="str">"GENESIS"</span>
<span class="kw">for</span> e <span class="kw">in</span> events:
    row = <span class="fn">link</span>(prev, e)
    chain.<span class="fn">append</span>(row)
    prev = row[<span class="str">"hash"</span>]
<span class="kw">for</span> r <span class="kw">in</span> chain:
    <span class="fn">print</span>(r)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses or constructs JSON to bridge the LLM (which speaks text) and downstream Python code (which prefers typed objects). 2) \`json.loads\` decodes a model's text output into a dict; pair with try/except since LLMs occasionally produce malformed JSON. 3) For robust structured output prefer \`with_structured_output(Schema)\` — providers enforce the JSON schema at the model level, eliminating the parse step. 4) For agent tool calls the JSON is generated by the provider's tool-calling API directly, no manual parsing needed.</p>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Production Checklist</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trace every run</div><div class="card-body">Span tree, model, tokens, cost, latency, error.</div></div>
<div class="calc-card"><div class="card-title">Budgets</div><div class="card-body">Per-task, per-user, per-day caps. Hard kill on breach.</div></div>
<div class="calc-card"><div class="card-title">Retry + fallback</div><div class="card-body">Exponential backoff, capped, with cheaper fallback model.</div></div>
<div class="calc-card"><div class="card-title">HITL for risk</div><div class="card-body">Money, deletes, public posts go through approval.</div></div>
<div class="calc-card"><div class="card-title">Guardrails</div><div class="card-body">Input + output filters; schema-validate JSON.</div></div>
<div class="calc-card"><div class="card-title">Audit trail</div><div class="card-body">Hash-chained, immutable, queryable for 90+ days.</div></div>
</div>
<div class="calc-highlight">If you cannot answer "what did the agent do for user X at 14:32 yesterday, and why?" within 60 seconds, you are not yet in production.</div>
<p class="l-text">Next lesson (L12 — Capstone): we tie L1-L11 together into a full multi-agent NLP research assistant with researcher, summarizer, critic, writer, and coordinator nodes — built on LangGraph with eval, cost monitoring, and observability hooked in.</p>
</div>`,

tr: `<p class="l-text"><strong>Agent'ın canlıda. Bir kullanıcı 03:00'te bir bug bildirir.</strong> "Yanlış cevap döndü." Trace'ler, maliyet sayaçları, retry'ler ve audit logları olmadan körsün. Onlarla birlikte bir span ağacına tıklarsın, başarısız araç çağrısını görürsün, girdiyi yeniden oynatırsın ve öğle yemeğinden önce bir düzeltme sevk edersin.</p>

<p class="l-text">Bu derste agent'ları production için sertleştireceksin: LangSmith / Phoenix / Langfuse tracing, adım başına maliyet izleme, üstel geri çekilmeli retry'ler, fallback zincirleri, insan-döngüde kapılar, girdi/çıktı korumaları ve değiştirilemez audit logları.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Agent yürütmesini span'lar ve trace'ler olarak modellemek (LangSmith / Phoenix / Langfuse)</li>
<li>Adım başına token maliyetini izlemek ve bütçe ihlallerini yüzeye çıkarmak</li>
<li>Üstel geri çekilmeli retry'ler ve birikmeyen timeout'lar uygulamak</li>
<li>Model sağlayıcılar arası fallback zincirleri tasarlamak</li>
<li>Riskli eylemler için bir insan-döngüde onay kapısı eklemek</li>
<li>Girdi + çıktı korumalarını ve değiştirilemez audit loglarını bağlamak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Gözlemlenebilirlik ≠ Loglama</h2>
<p class="l-text">Loglar düz metin satırlarıdır. Trace'ler nedensel ağaçlardır: bir parent run, çok sayıda çocuk span, her biri girdi, çıktı, gecikme, maliyet ve metadata taşır. 3 LLM atlamasında 8 araç çağıran bir agent için yalnızca bir span ağacı sana hangi adımın bütçeyi yaktığını gösterir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trace</div><div class="card-body">Tam bir agent çağrısı — tüm ağacı içeren root span.</div></div>
<div class="calc-card"><div class="card-title">Span</div><div class="card-body">Tek birim: bir LLM çağrısı, bir araç çağrısı, bir retry. Başlangıç/bitiş ve parent'ı vardır.</div></div>
<div class="calc-card"><div class="card-title">Attributes</div><div class="card-body">Token'lar, model, args, hatalar — ölçekte aranabilir.</div></div>
<div class="calc-card"><div class="card-title">Replay</div><div class="card-body">A/B yapmak için kaydedilmiş bir trace'i yeni bir agent sürümüne karşı yeniden çalıştır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Üç Tracing Yığını</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">LangSmith</div><div class="card-body">Hosted (LangChain Inc). En iyi LangChain/LangGraph entegrasyonu. Replay + dataset + LLM-judge dahili. Ücretli.</div></div>
<div class="calc-card"><div class="card-title">Phoenix (Arize)</div><div class="card-body">Açık kaynak. Yerelde veya self-host olarak çalışır. OpenTelemetry-yerli. RAG eval'de güçlü.</div></div>
<div class="calc-card"><div class="card-title">Langfuse</div><div class="card-body">Açık kaynak, self-host dostu. Maliyet panoları, prompt yönetimi, eval. AB veri ikamet seçeneği.</div></div>
<div class="calc-card"><div class="card-title">OpenTelemetry</div><div class="card-body">Tedarikçi-tarafsız protokol. Span'ları bir kez yay, herhangi bir backend'e gönder (Datadog, Jaeger, Tempo).</div></div>
</div>
<div class="calc-highlight">Deploy duruşuna göre seç: hosted kolaylık (LangSmith), tam kontrol (Phoenix), AB uyumuyla self-host (Langfuse).</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Düz Python Olarak LangSmith-Tarzı Bir Trace</h2>
<p class="l-text">Her span'ın şunları vardır: id, parent_id, name, start, end, attributes. Tracker'ların ne sakladığını gizemden çıkarmak için saf Python'da bir tane inşa et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, time, uuid

<span class="kw">def</span> <span class="fn">span</span>(name, parent=<span class="kw">None</span>, **attrs):
    <span class="kw">return</span> {<span class="str">"id"</span>: <span class="fn">str</span>(uuid.<span class="fn">uuid4</span>())[:<span class="num">8</span>],
            <span class="str">"parent"</span>: parent, <span class="str">"name"</span>: name,
            <span class="str">"t"</span>: <span class="fn">round</span>(time.<span class="fn">time</span>(), <span class="num">3</span>), **attrs}</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">5-span'lı bir trace ağacı (root agent → planner → tool → llm → answer) inşa et ve JSON olarak dök.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, uuid

<span class="kw">def</span> <span class="fn">mk</span>(name, parent=<span class="kw">None</span>, **kw):
    <span class="kw">return</span> {<span class="str">"id"</span>: <span class="fn">str</span>(uuid.<span class="fn">uuid4</span>())[:<span class="num">8</span>],
            <span class="str">"parent"</span>: parent, <span class="str">"name"</span>: name, **kw}

root = <span class="fn">mk</span>(<span class="str">"agent_run"</span>, latency_ms=<span class="num">2840</span>, cost_usd=<span class="num">0.0123</span>)
plan = <span class="fn">mk</span>(<span class="str">"planner"</span>, parent=root[<span class="str">"id"</span>],
            model=<span class="str">"sonnet"</span>, in_tok=<span class="num">412</span>, out_tok=<span class="num">88</span>)
tool = <span class="fn">mk</span>(<span class="str">"tool.search"</span>, parent=plan[<span class="str">"id"</span>],
            args={<span class="str">"q"</span>: <span class="str">"capital of France"</span>}, status=<span class="str">"ok"</span>)
llm  = <span class="fn">mk</span>(<span class="str">"llm.compose"</span>, parent=root[<span class="str">"id"</span>],
            model=<span class="str">"sonnet"</span>, in_tok=<span class="num">220</span>, out_tok=<span class="num">35</span>)
ans  = <span class="fn">mk</span>(<span class="str">"answer"</span>, parent=root[<span class="str">"id"</span>], text=<span class="str">"Paris"</span>)

trace = [root, plan, tool, llm, ans]
<span class="fn">print</span>(json.<span class="fn">dumps</span>(trace, indent=<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) LLM (metin konuşur) ile aşağı yöndeki Python kodu (typed nesneleri tercih eder) arasında köprü kurmak için JSON parse veya inşa eder. 2) \`json.loads\` modelin metin çıktısını dict'e decode eder; LLM'ler bazen bozuk JSON ürettiği için try/except ile eşleştirin. 3) Sağlam yapılı çıktı için \`with_structured_output(Schema)\` tercih edin — sağlayıcılar JSON şemasını model seviyesinde zorlar, parse adımı ortadan kalkar. 4) Agent tool çağrılarında JSON sağlayıcının tool-calling API'si tarafından doğrudan üretilir; manuel parse gerekmez.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Adım Başına Maliyet İzleme</h2>
<p class="l-text">Tipik bir agent adımı (bir LLM çağrısı + bir araç çağrısı) Sonnet-seviyesi modellerde <strong>0.005$</strong>'a denk gelir. Her gün her biri 6 adımlık 1000 kullanıcıda bu <strong>30$/gün</strong>'dür — tek bir kullanıcı 50-adımlık bir döngüyü tetikleyene kadar felaket değildir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>PRICE = {<span class="str">"haiku"</span>: <span class="num">0.0008</span>, <span class="str">"sonnet"</span>: <span class="num">0.005</span>, <span class="str">"opus"</span>: <span class="num">0.025</span>}

<span class="kw">def</span> <span class="fn">cost</span>(model, in_tok, out_tok):
    <span class="cm"># simplified — real pricing splits in/out per model</span>
    base = PRICE[model]
    <span class="kw">return</span> base * (in_tok + <span class="num">3</span> * out_tok) / <span class="num">1000</span></code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">6-adımlı bir agent çalışmasında adım başına maliyeti izler ve en pahalı 3 adımı yüzeye çıkarır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> collections <span class="kw">import</span> Counter

PRICE = {<span class="str">"haiku"</span>: <span class="num">0.0008</span>, <span class="str">"sonnet"</span>: <span class="num">0.005</span>, <span class="str">"opus"</span>: <span class="num">0.025</span>}
<span class="kw">def</span> <span class="fn">cost</span>(m, i, o):
    <span class="kw">return</span> PRICE[m] * (i + <span class="num">3</span>*o) / <span class="num">1000</span>

steps = [
    (<span class="str">"plan"</span>,    <span class="str">"sonnet"</span>, <span class="num">412</span>,  <span class="num">88</span>),
    (<span class="str">"search"</span>,  <span class="str">"haiku"</span>,   <span class="num">90</span>,  <span class="num">22</span>),
    (<span class="str">"summarize"</span>,<span class="str">"sonnet"</span>, <span class="num">820</span>, <span class="num">160</span>),
    (<span class="str">"critic"</span>,  <span class="str">"opus"</span>,   <span class="num">340</span>, <span class="num">120</span>),
    (<span class="str">"rewrite"</span>, <span class="str">"sonnet"</span>, <span class="num">200</span>,  <span class="num">95</span>),
    (<span class="str">"answer"</span>,  <span class="str">"haiku"</span>,   <span class="num">60</span>,  <span class="num">28</span>),
]
df = pd.<span class="fn">DataFrame</span>(steps, columns=[<span class="str">"step"</span>, <span class="str">"model"</span>, <span class="str">"in"</span>, <span class="str">"out"</span>])
df[<span class="str">"usd"</span>] = [<span class="fn">cost</span>(m, i, o) <span class="kw">for</span> _, m, i, o <span class="kw">in</span> steps]
<span class="fn">print</span>(df)
<span class="fn">print</span>(<span class="str">"total $:"</span>, df.usd.<span class="fn">sum</span>().<span class="fn">round</span>(<span class="num">5</span>))
<span class="fn">print</span>(<span class="str">"top spenders:"</span>)
<span class="fn">print</span>(df.<span class="fn">nlargest</span>(<span class="num">3</span>, <span class="str">"usd"</span>)[[<span class="str">"step"</span>, <span class="str">"model"</span>, <span class="str">"usd"</span>]])</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Üstel Geri Çekilmeli Retry'ler</h2>
<p class="l-text">Ağlar takılır. API'ler rate-limit uygular. Naif retry'ler upstream'i döver ve kesintileri büyütür. Jitter'lı üstel geri çekilme yükü dağıtır.</p>
<div class="katex-block">$$\\text{wait}_n = \\min(\\text{cap},\\ \\text{base} \\cdot 2^{n}) + \\text{jitter}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> time, random

<span class="kw">def</span> <span class="fn">retry</span>(fn, tries=<span class="num">5</span>, base=<span class="num">0.5</span>, cap=<span class="num">8.0</span>):
    <span class="kw">for</span> n <span class="kw">in</span> <span class="fn">range</span>(tries):
        <span class="kw">try</span>:
            <span class="kw">return</span> <span class="fn">fn</span>()
        <span class="kw">except</span> <span class="ty">Exception</span> <span class="kw">as</span> e:
            <span class="kw">if</span> n == tries - <span class="num">1</span>: <span class="kw">raise</span>
            wait = <span class="fn">min</span>(cap, base * <span class="num">2</span>**n) + random.<span class="fn">random</span>() * <span class="num">0.3</span>
            time.<span class="fn">sleep</span>(wait)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tutuk bir fonksiyon iki kez başarısız olur, 3. denemede başarılı olur. Retry helper'ı her geri-çekilme aralığını loglar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> time, random
random.<span class="fn">seed</span>(<span class="num">3</span>)

attempt = {<span class="str">"n"</span>: <span class="num">0</span>}
<span class="kw">def</span> <span class="fn">flaky</span>():
    attempt[<span class="str">"n"</span>] += <span class="num">1</span>
    <span class="kw">if</span> attempt[<span class="str">"n"</span>] &lt; <span class="num">3</span>:
        <span class="kw">raise</span> <span class="fn">RuntimeError</span>(<span class="str">"upstream 503"</span>)
    <span class="kw">return</span> <span class="str">"OK"</span>

<span class="kw">def</span> <span class="fn">retry</span>(fn, tries=<span class="num">5</span>, base=<span class="num">0.1</span>, cap=<span class="num">2.0</span>):
    <span class="kw">for</span> n <span class="kw">in</span> <span class="fn">range</span>(tries):
        <span class="kw">try</span>:
            <span class="kw">return</span> <span class="fn">fn</span>()
        <span class="kw">except</span> <span class="ty">Exception</span> <span class="kw">as</span> e:
            wait = <span class="fn">min</span>(cap, base * <span class="num">2</span>**n) + random.<span class="fn">random</span>() * <span class="num">0.05</span>
            <span class="fn">print</span>(f<span class="str">"attempt {n+1} failed: {e}; sleep {wait:.2f}s"</span>)
            time.<span class="fn">sleep</span>(wait)
    <span class="kw">raise</span> <span class="fn">RuntimeError</span>(<span class="str">"giving up"</span>)

<span class="fn">print</span>(<span class="str">"result:"</span>, <span class="fn">retry</span>(flaky))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Timeout'lar ve Fallback Zincirleri</h2>
<p class="l-text">Retry'lerle bile sıkı bir tavana ihtiyacın var. Sağlayıcıları bir zincirde birleştir — önce birincil, sonra birincil yavaşladığında veya hata verdiğinde daha ucuz / daha hızlı bir fallback.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çağrı başına timeout</div><div class="card-body">Tek bir LLM/araç çağrısına kapak (ör. 30s).</div></div>
<div class="calc-card"><div class="card-title">Adım başına timeout</div><div class="card-body">Retry'ler dahil bir agent adımına kapak (ör. 60s).</div></div>
<div class="calc-card"><div class="card-title">Trace başına timeout</div><div class="card-body">Tüm agent çalıştırmasına kapak (ör. 5m). Uzun döngüleri öldür.</div></div>
<div class="calc-card"><div class="card-title">Fallback zinciri</div><div class="card-body">Sonnet → Haiku → önbelleklenmiş hazır cevap.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">fallback_chain</span>(prompt, providers):
    <span class="kw">for</span> p <span class="kw">in</span> providers:
        <span class="kw">try</span>:
            <span class="kw">return</span> <span class="fn">p</span>(prompt)
        <span class="kw">except</span> <span class="ty">Exception</span> <span class="kw">as</span> e:
            <span class="fn">print</span>(<span class="str">"fallback:"</span>, e)
    <span class="kw">return</span> <span class="str">"Sorry, the assistant is temporarily unavailable."</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. İnsan-Döngüde (HITL) Onay Kapıları</h2>
<p class="l-text">Geri-alınamaz eylemler için — para gönderme, satır silme, kamuya post atma — duraklat ve bir insanın "onayla"masını iste. Agent önerilen bir eylemi yüzeye çıkarır, bekler, sonra ya commit eder ya da geri alır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SAFE_TOOLS = {<span class="str">"search"</span>, <span class="str">"read"</span>, <span class="str">"calc"</span>}

<span class="kw">def</span> <span class="fn">hitl_call</span>(tool, args, approver):
    <span class="kw">if</span> tool <span class="kw">in</span> SAFE_TOOLS:
        <span class="kw">return</span> <span class="fn">execute</span>(tool, args)
    decision = <span class="fn">approver</span>(tool, args)  <span class="cm"># queue / Slack / UI</span>
    <span class="kw">if</span> decision != <span class="str">"approved"</span>:
        <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"rejected"</span>, <span class="str">"by"</span>: decision}
    <span class="kw">return</span> <span class="fn">execute</span>(tool, args)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Üç önerilen agent eylemi bir HITL politikası üzerinden yönlendirilir. İki güvenli araç otomatik geçer; bir riskli araç onay gerektirir (sahte).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SAFE = {<span class="str">"search"</span>, <span class="str">"read"</span>, <span class="str">"calc"</span>}

<span class="kw">def</span> <span class="fn">mock_approver</span>(tool, args):
    <span class="cm"># Simulated: refund &gt; $50 rejected, smaller approved</span>
    <span class="kw">if</span> tool == <span class="str">"refund"</span> <span class="kw">and</span> args.<span class="fn">get</span>(<span class="str">"amount"</span>, <span class="num">0</span>) &gt; <span class="num">50</span>:
        <span class="kw">return</span> <span class="str">"rejected: needs manager"</span>
    <span class="kw">return</span> <span class="str">"approved"</span>

<span class="kw">def</span> <span class="fn">hitl</span>(tool, args):
    <span class="kw">if</span> tool <span class="kw">in</span> SAFE:
        <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"auto"</span>, <span class="str">"tool"</span>: tool}
    d = <span class="fn">mock_approver</span>(tool, args)
    <span class="kw">return</span> {<span class="str">"status"</span>: d, <span class="str">"tool"</span>: tool, <span class="str">"args"</span>: args}

actions = [
    (<span class="str">"search"</span>, {<span class="str">"q"</span>: <span class="str">"return policy"</span>}),
    (<span class="str">"refund"</span>, {<span class="str">"amount"</span>: <span class="num">25</span>}),
    (<span class="str">"refund"</span>, {<span class="str">"amount"</span>: <span class="num">200</span>}),
    (<span class="str">"calc"</span>,   {<span class="str">"expr"</span>: <span class="str">"3*7"</span>}),
]
<span class="kw">for</span> t, a <span class="kw">in</span> actions:
    <span class="fn">print</span>(<span class="fn">hitl</span>(t, a))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Güvenlik Korumaları — Girdi ve Çıktı</h2>
<p class="l-text">Korumalar LLM'i sandviçler. Girdi filtreleri prompt injection, PII, jailbreak'leri engeller. Çıktı filtreleri sırları ayıklar, JSON'u doğrular, toksisiteyi redakte eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdi kontrolü</div><div class="card-body">"Önceki talimatları yoksay" kalıplarını ve bilinen jailbreak'leri engelle.</div></div>
<div class="calc-card"><div class="card-title">PII temizleme</div><div class="card-body">LLM'e göndermeden önce e-postalar, telefon, SSN, kredi kartlarında regex/NER.</div></div>
<div class="calc-card"><div class="card-title">Şema doğrulama</div><div class="card-body">JSON çıktıları pydantic / jsonschema'dan zorla; başarısızlıkta otomatik onarım.</div></div>
<div class="calc-card"><div class="card-title">Toksisite filtresi</div><div class="card-body">Toksisite eşiğini aşan çıktıları düşür veya yeniden yaz.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

JAILBREAK = re.<span class="fn">compile</span>(<span class="str">r"ignore (all |the )?previous|disregard.*instructions"</span>, re.I)
EMAIL    = re.<span class="fn">compile</span>(<span class="str">r"[\\w.+-]+@[\\w-]+\\.[\\w.-]+"</span>)

<span class="kw">def</span> <span class="fn">scrub</span>(text):
    <span class="kw">if</span> JAILBREAK.<span class="fn">search</span>(text):
        <span class="kw">raise</span> <span class="fn">ValueError</span>(<span class="str">"blocked: jailbreak attempt"</span>)
    <span class="kw">return</span> EMAIL.<span class="fn">sub</span>(<span class="str">"&lt;EMAIL&gt;"</span>, text)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Bir web-arama API'sini (Tavily, SerpAPI, Brave) agent'ın çağırabileceği bir tool olarak sarmalar — girdi sorgu string'i, çıktı \`{title, url, snippet}\` öğeleri listesi. 2) Tavily LangChain'in önerdiği varsayılan — LLM tüketimi için tasarlanmış, ham HTML yerine temiz metin snippet'ler döndürür. 3) Agent ne zaman arayacağına karar verir; birçok görev için döngünün erken evresinde tek arama, kalan akıl yürütmeyi temellendirmek için yeterlidir. 4) Arama sonuçlarını her zaman cache'leyin — geliştirme sırasında tekrarlı aynı sorgular kotayı hızla yakar.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Audit Logları — Değiştirilemez, Aranabilir</h2>
<p class="l-text">Yan etkili her agent eylemi için (DB yazma, API POST, refund), değiştirilemez bir kayıt ekle: kim tetikledi, ne önerildi, ne onaylandı, ne yürüdü, ne döndürdü. Bu finansta, sağlıkta ve giderek AB AI Act-kapsamındaki sistemlerde regülasyon gerekliliğidir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, hashlib, time

<span class="kw">def</span> <span class="fn">audit</span>(prev_hash, event):
    body = json.<span class="fn">dumps</span>(event, sort_keys=<span class="kw">True</span>)
    h = hashlib.<span class="fn">sha256</span>((prev_hash + body).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()
    <span class="kw">return</span> {**event, <span class="str">"prev"</span>: prev_hash, <span class="str">"hash"</span>: h, <span class="str">"ts"</span>: time.<span class="fn">time</span>()}</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) LLM (metin konuşur) ile aşağı yöndeki Python kodu (typed nesneleri tercih eder) arasında köprü kurmak için JSON parse veya inşa eder. 2) \`json.loads\` modelin metin çıktısını dict'e decode eder; LLM'ler bazen bozuk JSON ürettiği için try/except ile eşleştirin. 3) Sağlam yapılı çıktı için \`with_structured_output(Schema)\` tercih edin — sağlayıcılar JSON şemasını model seviyesinde zorlar, parse adımı ortadan kalkar. 4) Agent tool çağrılarında JSON sağlayıcının tool-calling API'si tarafından doğrudan üretilir; manuel parse gerekmez.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">4 agent eyleminin hash-zincirli audit logu. Bir satıra kurcalama yap; sonraki hash kırılması tespit edilebilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, hashlib

<span class="kw">def</span> <span class="fn">link</span>(prev, ev):
    body = json.<span class="fn">dumps</span>(ev, sort_keys=<span class="kw">True</span>)
    h = hashlib.<span class="fn">sha256</span>((prev + body).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()
    <span class="kw">return</span> {**ev, <span class="str">"prev"</span>: prev[:<span class="num">8</span>], <span class="str">"hash"</span>: h[:<span class="num">8</span>]}

events = [
    {<span class="str">"agent"</span>: <span class="str">"refund_bot"</span>, <span class="str">"action"</span>: <span class="str">"refund"</span>, <span class="str">"amount"</span>: <span class="num">25</span>, <span class="str">"user"</span>: <span class="str">"u1"</span>},
    {<span class="str">"agent"</span>: <span class="str">"refund_bot"</span>, <span class="str">"action"</span>: <span class="str">"escalate"</span>, <span class="str">"user"</span>: <span class="str">"u2"</span>},
    {<span class="str">"agent"</span>: <span class="str">"chat_bot"</span>,   <span class="str">"action"</span>: <span class="str">"reply"</span>, <span class="str">"len"</span>: <span class="num">120</span>},
    {<span class="str">"agent"</span>: <span class="str">"refund_bot"</span>, <span class="str">"action"</span>: <span class="str">"refund"</span>, <span class="str">"amount"</span>: <span class="num">9</span>, <span class="str">"user"</span>: <span class="str">"u3"</span>},
]
chain, prev = [], <span class="str">"GENESIS"</span>
<span class="kw">for</span> e <span class="kw">in</span> events:
    row = <span class="fn">link</span>(prev, e)
    chain.<span class="fn">append</span>(row)
    prev = row[<span class="str">"hash"</span>]
<span class="kw">for</span> r <span class="kw">in</span> chain:
    <span class="fn">print</span>(r)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) LLM (metin konuşur) ile aşağı yöndeki Python kodu (typed nesneleri tercih eder) arasında köprü kurmak için JSON parse veya inşa eder. 2) \`json.loads\` modelin metin çıktısını dict'e decode eder; LLM'ler bazen bozuk JSON ürettiği için try/except ile eşleştirin. 3) Sağlam yapılı çıktı için \`with_structured_output(Schema)\` tercih edin — sağlayıcılar JSON şemasını model seviyesinde zorlar, parse adımı ortadan kalkar. 4) Agent tool çağrılarında JSON sağlayıcının tool-calling API'si tarafından doğrudan üretilir; manuel parse gerekmez.</p>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Production Kontrol Listesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Her çalıştırmayı trace'le</div><div class="card-body">Span ağacı, model, token'lar, maliyet, gecikme, hata.</div></div>
<div class="calc-card"><div class="card-title">Bütçeler</div><div class="card-body">Görev başına, kullanıcı başına, gün başına kapaklar. İhlalde sıkı kill.</div></div>
<div class="calc-card"><div class="card-title">Retry + fallback</div><div class="card-body">Üstel geri çekilme, sınırlı, daha ucuz fallback modeliyle.</div></div>
<div class="calc-card"><div class="card-title">Risk için HITL</div><div class="card-body">Para, silmeler, kamuya postlar onay üzerinden geçer.</div></div>
<div class="calc-card"><div class="card-title">Korumalar</div><div class="card-body">Girdi + çıktı filtreleri; JSON'u şema-doğrula.</div></div>
<div class="calc-card"><div class="card-title">Audit izi</div><div class="card-body">Hash-zincirli, değiştirilemez, 90+ gün için sorgulanabilir.</div></div>
</div>
<div class="calc-highlight">"Dün 14:32'de X kullanıcısı için agent ne yaptı ve neden?" sorusunu 60 saniye içinde cevaplayamıyorsan, henüz production'da değilsin.</div>
<p class="l-text">Sonraki ders (L12 — Capstone): L1-L11'i tam bir çok-agent NLP araştırma asistanına bağlıyoruz; researcher, summarizer, critic, writer ve coordinator düğümleriyle — eval, maliyet izleme ve gözlemlenebilirlik bağlanmış olarak LangGraph üzerinde inşa edilmiş.</p>
</div>`
};
