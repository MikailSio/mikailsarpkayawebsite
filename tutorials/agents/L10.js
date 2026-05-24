window.AGENTS_L10 = {

en: `<p class="l-text"><strong>Your agent finishes the task — but did it do it well?</strong> Did it call the right tools, in the right order, without burning $0.50 in tokens? Evaluation is the difference between a demo and production.</p>

<p class="l-text">In this lesson you'll build an evaluation pipeline that goes beyond pass/fail. You'll measure success rate, trajectory quality, tool-use accuracy, and cost — using TRUE, AgentBench, GAIA as references and an LLM-as-judge to grade reasoning steps.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Compare TRUE, AgentBench, and GAIA benchmark designs and use cases</li>
<li>Distinguish outcome metrics (success rate) from trajectory metrics (step quality)</li>
<li>Score tool-use accuracy: correct tool, correct args, correct order</li>
<li>Build an LLM-as-judge prompt that grades reasoning trajectories on a rubric</li>
<li>Track cost-quality tradeoffs and reject regressions in CI</li>
<li>Assemble a custom eval pipeline that runs nightly on your agent</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Evaluating Agents is Hard</h2>
<p class="l-text">Classifiers have a single label. Agents have a <em>trajectory</em>: think, call tool, observe, think again, call another tool, answer. Two agents can return the same final answer through wildly different paths — one in 3 steps for $0.01, another in 15 steps for $0.40 with two failed tool calls retried.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Outcome eval</div><div class="card-body">Did the final answer match the gold answer? Easy but blind to <em>how</em>.</div></div>
<div class="calc-card"><div class="card-title">Trajectory eval</div><div class="card-body">Was every intermediate step correct, efficient, safe?</div></div>
<div class="calc-card"><div class="card-title">Cost eval</div><div class="card-body">Tokens, latency, tool calls, retries.</div></div>
<div class="calc-card"><div class="card-title">Behavior eval</div><div class="card-body">Refusals, hallucinations, prompt injection resistance.</div></div>
</div>
<div class="calc-highlight">A perfect outcome with a broken trajectory is a ticking bomb in production — it will fail the moment the world shifts off-distribution.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Three Headline Benchmarks</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TRUE</div><div class="card-body">Tool-use Reasoning Understanding Eval. Stress-tests whether the model picks the correct tool from a large catalog and supplies valid arguments.</div></div>
<div class="calc-card"><div class="card-title">AgentBench (Liu et al, 2023)</div><div class="card-body">8 environments — OS shell, DB, web, knowledge graph, card game, etc. Tests breadth of agentic skills.</div></div>
<div class="calc-card"><div class="card-title">GAIA</div><div class="card-body">General AI Assistants benchmark. 466 real-world questions needing web search, file reading, multi-modal reasoning. Top humans solve 92%; GPT-4 with tools solves about 30%.</div></div>
<div class="calc-card"><div class="card-title">SWE-bench</div><div class="card-body">Coding agents — patch real GitHub issues. Pass-rate, not just compile-rate.</div></div>
</div>
<p class="l-text">Pick the benchmark that matches your domain. Build agents that pass the one closest to your real workload, not the one with the highest leaderboard prestige.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Success Rate — The Easy Metric</h2>
<p class="l-text">Score 1 if final answer matches gold, else 0. Average across N tasks. Quick, comparable, but very lossy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">success_rate</span>(predictions, gold):
    correct = <span class="fn">sum</span>(p.strip().lower() == g.strip().lower()
                  <span class="kw">for</span> p, g <span class="kw">in</span> <span class="fn">zip</span>(predictions, gold))
    <span class="kw">return</span> correct / <span class="fn">len</span>(gold)

preds = [<span class="str">"Paris"</span>, <span class="str">"42"</span>, <span class="str">"red"</span>, <span class="str">"Einstein"</span>]
gold  = [<span class="str">"paris"</span>, <span class="str">"42"</span>, <span class="str">"blue"</span>, <span class="str">"Einstein"</span>]
<span class="fn">print</span>(<span class="str">"acc:"</span>, <span class="fn">success_rate</span>(preds, gold))  <span class="cm"># 0.75</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Compute success rate on 12 mock agent answers, then break it down by task category.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

records = [
    {<span class="str">"task"</span>: <span class="str">"qa"</span>,     <span class="str">"pred"</span>: <span class="str">"paris"</span>,    <span class="str">"gold"</span>: <span class="str">"Paris"</span>},
    {<span class="str">"task"</span>: <span class="str">"qa"</span>,     <span class="str">"pred"</span>: <span class="str">"berlin"</span>,   <span class="str">"gold"</span>: <span class="str">"Berlin"</span>},
    {<span class="str">"task"</span>: <span class="str">"qa"</span>,     <span class="str">"pred"</span>: <span class="str">"madrid"</span>,   <span class="str">"gold"</span>: <span class="str">"Madrid"</span>},
    {<span class="str">"task"</span>: <span class="str">"math"</span>,   <span class="str">"pred"</span>: <span class="str">"42"</span>,       <span class="str">"gold"</span>: <span class="str">"42"</span>},
    {<span class="str">"task"</span>: <span class="str">"math"</span>,   <span class="str">"pred"</span>: <span class="str">"7"</span>,        <span class="str">"gold"</span>: <span class="str">"49"</span>},
    {<span class="str">"task"</span>: <span class="str">"math"</span>,   <span class="str">"pred"</span>: <span class="str">"100"</span>,      <span class="str">"gold"</span>: <span class="str">"100"</span>},
    {<span class="str">"task"</span>: <span class="str">"search"</span>, <span class="str">"pred"</span>: <span class="str">"einstein"</span>, <span class="str">"gold"</span>: <span class="str">"Einstein"</span>},
    {<span class="str">"task"</span>: <span class="str">"search"</span>, <span class="str">"pred"</span>: <span class="str">"newton"</span>,   <span class="str">"gold"</span>: <span class="str">"Newton"</span>},
    {<span class="str">"task"</span>: <span class="str">"search"</span>, <span class="str">"pred"</span>: <span class="str">"darwin"</span>,   <span class="str">"gold"</span>: <span class="str">"Curie"</span>},
    {<span class="str">"task"</span>: <span class="str">"code"</span>,   <span class="str">"pred"</span>: <span class="str">"True"</span>,     <span class="str">"gold"</span>: <span class="str">"True"</span>},
    {<span class="str">"task"</span>: <span class="str">"code"</span>,   <span class="str">"pred"</span>: <span class="str">"False"</span>,    <span class="str">"gold"</span>: <span class="str">"True"</span>},
    {<span class="str">"task"</span>: <span class="str">"code"</span>,   <span class="str">"pred"</span>: <span class="str">"None"</span>,     <span class="str">"gold"</span>: <span class="str">"None"</span>},
]
df = pd.<span class="fn">DataFrame</span>(records)
df[<span class="str">"hit"</span>] = df.pred.str.lower() == df.gold.str.lower()
<span class="fn">print</span>(<span class="str">"overall:"</span>, df.hit.<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(df.<span class="fn">groupby</span>(<span class="str">"task"</span>).hit.<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Trajectory Metrics — Step-Level Truth</h2>
<p class="l-text">A trajectory is a list of <code>(thought, tool, args, observation)</code> tuples. Trajectory metrics inspect each step.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step count</div><div class="card-body">Lower is usually better — fewer hops, less drift.</div></div>
<div class="calc-card"><div class="card-title">Tool accuracy</div><div class="card-body">Did the right tool fire at each step? F1 vs gold tools.</div></div>
<div class="calc-card"><div class="card-title">Argument validity</div><div class="card-body">Are tool arguments well-formed and semantically correct?</div></div>
<div class="calc-card"><div class="card-title">Reflection quality</div><div class="card-body">Did the agent recover from a failed step or loop forever?</div></div>
</div>
<div class="calc-highlight">A 95% success rate hides a 40% efficiency gap if half your trajectories take 10 steps when 3 would suffice.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tool-Use Accuracy — A Worked Example</h2>
<p class="l-text">For each step, compare the predicted tool against the gold tool. Then check whether the args fall within an allowed schema or value set.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">tool_step_score</span>(pred, gold):
    score = {<span class="str">"tool_ok"</span>: pred[<span class="str">"tool"</span>] == gold[<span class="str">"tool"</span>],
             <span class="str">"args_ok"</span>: pred.<span class="fn">get</span>(<span class="str">"args"</span>) == gold.<span class="fn">get</span>(<span class="str">"args"</span>)}
    score[<span class="str">"both"</span>] = score[<span class="str">"tool_ok"</span>] <span class="kw">and</span> score[<span class="str">"args_ok"</span>]
    <span class="kw">return</span> score</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Score a 4-step mock trajectory. Reports tool-only, args-only, and joint accuracy.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>gold = [
    {<span class="str">"tool"</span>: <span class="str">"search"</span>, <span class="str">"args"</span>: {<span class="str">"q"</span>: <span class="str">"capital of France"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"calc"</span>,   <span class="str">"args"</span>: {<span class="str">"expr"</span>: <span class="str">"3*7"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"search"</span>, <span class="str">"args"</span>: {<span class="str">"q"</span>: <span class="str">"Eiffel height"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"answer"</span>, <span class="str">"args"</span>: {<span class="str">"text"</span>: <span class="str">"330m"</span>}},
]
pred = [
    {<span class="str">"tool"</span>: <span class="str">"search"</span>, <span class="str">"args"</span>: {<span class="str">"q"</span>: <span class="str">"capital of France"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"calc"</span>,   <span class="str">"args"</span>: {<span class="str">"expr"</span>: <span class="str">"7*3"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"calc"</span>,   <span class="str">"args"</span>: {<span class="str">"expr"</span>: <span class="str">"100"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"answer"</span>, <span class="str">"args"</span>: {<span class="str">"text"</span>: <span class="str">"330m"</span>}},
]
tool_hits = <span class="fn">sum</span>(p[<span class="str">"tool"</span>] == g[<span class="str">"tool"</span>] <span class="kw">for</span> p, g <span class="kw">in</span> <span class="fn">zip</span>(pred, gold))
arg_hits  = <span class="fn">sum</span>(p[<span class="str">"args"</span>] == g[<span class="str">"args"</span>]  <span class="kw">for</span> p, g <span class="kw">in</span> <span class="fn">zip</span>(pred, gold))
both_hits = <span class="fn">sum</span>((p[<span class="str">"tool"</span>] == g[<span class="str">"tool"</span>]) <span class="kw">and</span> (p[<span class="str">"args"</span>] == g[<span class="str">"args"</span>])
                <span class="kw">for</span> p, g <span class="kw">in</span> <span class="fn">zip</span>(pred, gold))
n = <span class="fn">len</span>(gold)
<span class="fn">print</span>(<span class="str">"tool acc:"</span>, tool_hits / n)
<span class="fn">print</span>(<span class="str">"arg  acc:"</span>, arg_hits  / n)
<span class="fn">print</span>(<span class="str">"both acc:"</span>, both_hits / n)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. LLM-as-Judge for Trajectory Quality</h2>
<p class="l-text">Exact-match doesn't capture "the answer was reasonable but worded differently". An LLM judge scores on a rubric. Pin the judge model, log the rubric version, and audit a sample by hand.</p>
<div class="code-wrap"><div class="code-label"><span>PROMPT</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>You are a strict trajectory grader. Score <span class="num">0</span>-<span class="num">3</span> on each axis.
Return JSON: {<span <span class="kw">class</span>=<span class="str">"str"</span>><span class="str">"correctness"</span></span>: <span class="fn">int</span>, <span <span class="kw">class</span>=<span class="str">"str"</span>><span class="str">"efficiency"</span></span>: <span class="fn">int</span>,
              <span <span class="kw">class</span>=<span class="str">"str"</span>><span class="str">"safety"</span></span>: <span class="fn">int</span>, <span <span class="kw">class</span>=<span class="str">"str"</span>><span class="str">"reasoning"</span></span>: <span class="fn">str</span>}

CORRECTNESS: <span class="num">0</span> wrong, <span class="num">1</span> partially right, <span class="num">2</span> right but messy, <span class="num">3</span> perfect.
EFFICIENCY:  <span class="num">0</span> endless loop, <span class="num">1</span> wasteful, <span class="num">2</span> acceptable, <span class="num">3</span> minimal steps.
SAFETY:      <span class="num">0</span> leaked secrets / unsafe call, <span class="num">1</span> risky, <span class="num">2</span> ok, <span class="num">3</span> robust.

TASK:        {task}
TRAJECTORY:  {trajectory}
GOLD ANSWER: {gold}</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Train an LLM-judge proxy: a logistic regressor on (response, score) pairs. Predicts judge score from text features.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline

responses = [
    <span class="str">"Paris is the capital. The Eiffel tower is 330m."</span>,
    <span class="str">"It is paris and tower is tall."</span>,
    <span class="str">"I cannot answer."</span>,
    <span class="str">"Berlin is the answer, definitely."</span>,
    <span class="str">"The capital of France is Paris and the tower is 330m."</span>,
    <span class="str">"sorry no info"</span>,
]
scores = [<span class="num">3</span>, <span class="num">2</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">3</span>, <span class="num">0</span>]  <span class="cm"># judge labels</span>
judge = <span class="fn">make_pipeline</span>(<span class="fn">TfidfVectorizer</span>(), <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>))
judge.<span class="fn">fit</span>(responses, scores)
new = [<span class="str">"Paris, 330m tall."</span>, <span class="str">"unknown sorry"</span>]
<span class="fn">print</span>(<span class="str">"predicted judge scores:"</span>, judge.<span class="fn">predict</span>(new).<span class="fn">tolist</span>())</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Cost-Quality Tradeoff</h2>
<p class="l-text">A bigger model often gets +5% accuracy at 10x the cost. Plot quality on Y, cost on X — pick the Pareto front.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

variants = pd.<span class="fn">DataFrame</span>([
    {<span class="str">"name"</span>: <span class="str">"haiku"</span>,  <span class="str">"acc"</span>: <span class="num">0.62</span>, <span class="str">"cost_per_task"</span>: <span class="num">0.004</span>},
    {<span class="str">"name"</span>: <span class="str">"sonnet"</span>, <span class="str">"acc"</span>: <span class="num">0.78</span>, <span class="str">"cost_per_task"</span>: <span class="num">0.030</span>},
    {<span class="str">"name"</span>: <span class="str">"opus"</span>,   <span class="str">"acc"</span>: <span class="num">0.85</span>, <span class="str">"cost_per_task"</span>: <span class="num">0.140</span>},
    {<span class="str">"name"</span>: <span class="str">"4o"</span>,     <span class="str">"acc"</span>: <span class="num">0.81</span>, <span class="str">"cost_per_task"</span>: <span class="num">0.050</span>},
])
variants[<span class="str">"acc_per_dollar"</span>] = (variants.acc / variants.cost_per_task).<span class="fn">round</span>(<span class="num">1</span>)
<span class="fn">print</span>(variants.<span class="fn">sort_values</span>(<span class="str">"acc_per_dollar"</span>, ascending=<span class="kw">False</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
<div class="calc-highlight">In production, "acc per dollar" usually wins. The +7% from Opus over Sonnet rarely justifies a 5x bill unless the downstream business value scales linearly with accuracy.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Custom Eval Pipeline</h2>
<p class="l-text">A real eval suite has: a fixed test set (versioned), a runner that executes each task, scorers (success + trajectory + cost), aggregation, and a regression check vs the previous baseline.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">run_eval</span>(agent, tasks, baseline_acc=<span class="num">0.75</span>):
    rows = []
    <span class="kw">for</span> t <span class="kw">in</span> tasks:
        out = <span class="fn">agent</span>(t[<span class="str">"input"</span>])
        rows.<span class="fn">append</span>({
            <span class="str">"task_id"</span>: t[<span class="str">"id"</span>],
            <span class="str">"hit"</span>: out[<span class="str">"answer"</span>] == t[<span class="str">"gold"</span>],
            <span class="str">"steps"</span>: <span class="fn">len</span>(out[<span class="str">"trajectory"</span>]),
            <span class="str">"cost_usd"</span>: out[<span class="str">"cost"</span>],
        })
    df = pd.<span class="fn">DataFrame</span>(rows)
    acc = df.hit.<span class="fn">mean</span>()
    <span class="kw">if</span> acc &lt; baseline_acc - <span class="num">0.02</span>:
        <span class="kw">raise</span> <span class="fn">RuntimeError</span>(f<span class="str">"REGRESSION: {acc:.3f} &lt; {baseline_acc:.3f}"</span>)
    <span class="kw">return</span> df</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Simulates a fake agent and runs the regression-aware eval over 8 mock tasks.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> random, pandas <span class="kw">as</span> pd
random.<span class="fn">seed</span>(<span class="num">7</span>)

<span class="kw">def</span> <span class="fn">fake_agent</span>(prompt):
    correct = random.<span class="fn">random</span>() &lt; <span class="num">0.78</span>
    <span class="kw">return</span> {
        <span class="str">"answer"</span>: <span class="str">"OK"</span> <span class="kw">if</span> correct <span class="kw">else</span> <span class="str">"BAD"</span>,
        <span class="str">"trajectory"</span>: [<span class="str">"think"</span>, <span class="str">"tool"</span>, <span class="str">"answer"</span>],
        <span class="str">"cost"</span>: <span class="fn">round</span>(random.<span class="fn">uniform</span>(<span class="num">0.005</span>, <span class="num">0.04</span>), <span class="num">4</span>),
    }

tasks = [{<span class="str">"id"</span>: i, <span class="str">"input"</span>: f<span class="str">"task {i}"</span>, <span class="str">"gold"</span>: <span class="str">"OK"</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)]
rows = []
<span class="kw">for</span> t <span class="kw">in</span> tasks:
    o = <span class="fn">fake_agent</span>(t[<span class="str">"input"</span>])
    rows.<span class="fn">append</span>({<span class="str">"id"</span>: t[<span class="str">"id"</span>], <span class="str">"hit"</span>: o[<span class="str">"answer"</span>] == t[<span class="str">"gold"</span>],
                 <span class="str">"cost"</span>: o[<span class="str">"cost"</span>], <span class="str">"steps"</span>: <span class="fn">len</span>(o[<span class="str">"trajectory"</span>])})
df = pd.<span class="fn">DataFrame</span>(rows)
<span class="fn">print</span>(df)
<span class="fn">print</span>(<span class="str">"acc:"</span>, df.hit.<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>),
      <span class="str">" total $:"</span>, df.cost.<span class="fn">sum</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Failure Modes — What to Watch For</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tool flapping</div><div class="card-body">Agent calls the same tool with tiny arg changes 10x. Detect with step-count outliers.</div></div>
<div class="calc-card"><div class="card-title">Premature answer</div><div class="card-body">Returns "I don't know" without trying any tools. Detect with min_tool_calls=1.</div></div>
<div class="calc-card"><div class="card-title">Hallucinated tools</div><div class="card-body">Agent invents a tool name not in the catalog. Detect with schema validation.</div></div>
<div class="calc-card"><div class="card-title">Cost blowout</div><div class="card-body">P95 cost &gt; 5x median. Add a hard budget cap per task.</div></div>
</div>
<div class="calc-highlight">Track P50, P95, and worst-case for every metric. Means lie; tails kill production.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary &amp; Next Step</h2>
<p class="l-text">Outcome metrics tell you <em>what</em> happened. Trajectory metrics tell you <em>how</em>. Cost metrics tell you <em>at what price</em>. A production-grade agent ships only when all three pass a versioned test suite, and a sample is human-graded each release.</p>
<p class="l-text">Next lesson (L11): we go from offline eval to live observability — LangSmith traces, Phoenix, retries, HITL gates, and audit logs.</p>
</div>`,

tr: `<p class="l-text"><strong>Agent'ın görevi bitirir — peki iyi yaptı mı?</strong> Doğru araçları doğru sırayla, 0.50$ token yakmadan mı çağırdı? Değerlendirme, demo ile production arasındaki farktır.</p>

<p class="l-text">Bu derste pass/fail'in ötesine geçen bir değerlendirme pipeline'ı inşa edeceksin. Başarı oranını, yörünge kalitesini, araç-kullanım doğruluğunu ve maliyeti — TRUE, AgentBench, GAIA'yı referans alarak ve muhakeme adımlarını puanlamak için bir LLM-as-judge kullanarak — ölçeceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>TRUE, AgentBench ve GAIA benchmark tasarımlarını ve kullanım durumlarını karşılaştırmak</li>
<li>Sonuç metriklerini (başarı oranı) yörünge metriklerinden (adım kalitesi) ayırt etmek</li>
<li>Araç-kullanım doğruluğunu puanlamak: doğru araç, doğru argüman, doğru sıra</li>
<li>Bir kriter üzerinden muhakeme yörüngelerini puanlayan bir LLM-as-judge prompt'u inşa etmek</li>
<li>Maliyet-kalite ödünleşimlerini izlemek ve CI'da regresyonları reddetmek</li>
<li>Agent'ında her gece çalışan özel bir eval pipeline'ı kurmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Agent'ları Değerlendirmek Neden Zor</h2>
<p class="l-text">Sınıflandırıcıların tek bir etiketi vardır. Agent'ların bir <em>yörüngesi</em> vardır: düşün, araç çağır, gözlemle, tekrar düşün, başka araç çağır, cevap ver. İki agent çılgınca farklı yollardan aynı final cevabı döndürebilir — biri 3 adımda 0.01$'a, diğeri 15 adımda 0.40$'a iki başarısız araç çağrısı yeniden denemeyle.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sonuç değerlendirmesi</div><div class="card-body">Final cevap altın cevapla eşleşti mi? Kolay ama <em>nasıl</em>'a kör.</div></div>
<div class="calc-card"><div class="card-title">Yörünge değerlendirmesi</div><div class="card-body">Her ara adım doğru, verimli, güvenli miydi?</div></div>
<div class="calc-card"><div class="card-title">Maliyet değerlendirmesi</div><div class="card-body">Token'lar, gecikme, araç çağrıları, retry'ler.</div></div>
<div class="calc-card"><div class="card-title">Davranış değerlendirmesi</div><div class="card-body">Reddetmeler, halüsinasyonlar, prompt injection direnci.</div></div>
</div>
<div class="calc-highlight">Bozuk bir yörüngeyle mükemmel bir sonuç, production'da tıklayan bir bombadır — dünya dağılım dışına kayar kaymaz başarısız olur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Üç Manşet Benchmark</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">TRUE</div><div class="card-body">Tool-use Reasoning Understanding Eval. Modelin büyük bir kataloğtan doğru aracı seçip seçmediğini ve geçerli argümanlar sağlayıp sağlamadığını stres testine tabi tutar.</div></div>
<div class="calc-card"><div class="card-title">AgentBench (Liu ve ark., 2023)</div><div class="card-body">8 ortam — OS shell, DB, web, knowledge graph, kart oyunu vb. Agentik becerilerin genişliğini test eder.</div></div>
<div class="calc-card"><div class="card-title">GAIA</div><div class="card-body">General AI Assistants benchmark. Web arama, dosya okuma, çok-modlu muhakeme gerektiren 466 gerçek dünya sorusu. En iyi insanlar %92 çözer; araçlı GPT-4 yaklaşık %30 çözer.</div></div>
<div class="calc-card"><div class="card-title">SWE-bench</div><div class="card-body">Kodlama agent'ları — gerçek GitHub issue'larını yamalar. Sadece derleme-oranı değil, geçme-oranı.</div></div>
</div>
<p class="l-text">Alanına uyan benchmark'ı seç. En yüksek leaderboard prestijine sahip olanı değil, gerçek iş yüküne en yakın olanı geçen agent'lar inşa et.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Başarı Oranı — Kolay Metrik</h2>
<p class="l-text">Final cevap altınla eşleşirse 1, aksi halde 0 puan ver. N görev üzerinden ortala. Hızlı, karşılaştırılabilir, ama çok kayıplı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">success_rate</span>(predictions, gold):
    correct = <span class="fn">sum</span>(p.strip().lower() == g.strip().lower()
                  <span class="kw">for</span> p, g <span class="kw">in</span> <span class="fn">zip</span>(predictions, gold))
    <span class="kw">return</span> correct / <span class="fn">len</span>(gold)

preds = [<span class="str">"Paris"</span>, <span class="str">"42"</span>, <span class="str">"red"</span>, <span class="str">"Einstein"</span>]
gold  = [<span class="str">"paris"</span>, <span class="str">"42"</span>, <span class="str">"blue"</span>, <span class="str">"Einstein"</span>]
<span class="fn">print</span>(<span class="str">"acc:"</span>, <span class="fn">success_rate</span>(preds, gold))  <span class="cm"># 0.75</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">12 sahte agent cevabında başarı oranını hesapla, sonra görev kategorisine göre ayır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

records = [
    {<span class="str">"task"</span>: <span class="str">"qa"</span>,     <span class="str">"pred"</span>: <span class="str">"paris"</span>,    <span class="str">"gold"</span>: <span class="str">"Paris"</span>},
    {<span class="str">"task"</span>: <span class="str">"qa"</span>,     <span class="str">"pred"</span>: <span class="str">"berlin"</span>,   <span class="str">"gold"</span>: <span class="str">"Berlin"</span>},
    {<span class="str">"task"</span>: <span class="str">"qa"</span>,     <span class="str">"pred"</span>: <span class="str">"madrid"</span>,   <span class="str">"gold"</span>: <span class="str">"Madrid"</span>},
    {<span class="str">"task"</span>: <span class="str">"math"</span>,   <span class="str">"pred"</span>: <span class="str">"42"</span>,       <span class="str">"gold"</span>: <span class="str">"42"</span>},
    {<span class="str">"task"</span>: <span class="str">"math"</span>,   <span class="str">"pred"</span>: <span class="str">"7"</span>,        <span class="str">"gold"</span>: <span class="str">"49"</span>},
    {<span class="str">"task"</span>: <span class="str">"math"</span>,   <span class="str">"pred"</span>: <span class="str">"100"</span>,      <span class="str">"gold"</span>: <span class="str">"100"</span>},
    {<span class="str">"task"</span>: <span class="str">"search"</span>, <span class="str">"pred"</span>: <span class="str">"einstein"</span>, <span class="str">"gold"</span>: <span class="str">"Einstein"</span>},
    {<span class="str">"task"</span>: <span class="str">"search"</span>, <span class="str">"pred"</span>: <span class="str">"newton"</span>,   <span class="str">"gold"</span>: <span class="str">"Newton"</span>},
    {<span class="str">"task"</span>: <span class="str">"search"</span>, <span class="str">"pred"</span>: <span class="str">"darwin"</span>,   <span class="str">"gold"</span>: <span class="str">"Curie"</span>},
    {<span class="str">"task"</span>: <span class="str">"code"</span>,   <span class="str">"pred"</span>: <span class="str">"True"</span>,     <span class="str">"gold"</span>: <span class="str">"True"</span>},
    {<span class="str">"task"</span>: <span class="str">"code"</span>,   <span class="str">"pred"</span>: <span class="str">"False"</span>,    <span class="str">"gold"</span>: <span class="str">"True"</span>},
    {<span class="str">"task"</span>: <span class="str">"code"</span>,   <span class="str">"pred"</span>: <span class="str">"None"</span>,     <span class="str">"gold"</span>: <span class="str">"None"</span>},
]
df = pd.<span class="fn">DataFrame</span>(records)
df[<span class="str">"hit"</span>] = df.pred.str.lower() == df.gold.str.lower()
<span class="fn">print</span>(<span class="str">"overall:"</span>, df.hit.<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(df.<span class="fn">groupby</span>(<span class="str">"task"</span>).hit.<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Yörünge Metrikleri — Adım Düzeyinde Gerçek</h2>
<p class="l-text">Bir yörünge, <code>(thought, tool, args, observation)</code> tuple'larından oluşan bir listedir. Yörünge metrikleri her adımı inceler.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım sayısı</div><div class="card-body">Daha düşük genelde daha iyidir — daha az atlama, daha az drift.</div></div>
<div class="calc-card"><div class="card-title">Araç doğruluğu</div><div class="card-body">Her adımda doğru araç mı tetiklendi? Altın araçlara karşı F1.</div></div>
<div class="calc-card"><div class="card-title">Argüman geçerliliği</div><div class="card-body">Araç argümanları iyi-biçimli ve semantik olarak doğru mu?</div></div>
<div class="calc-card"><div class="card-title">Yansıma kalitesi</div><div class="card-body">Agent başarısız bir adımdan kurtuldu mu yoksa sonsuza kadar döngüye mi girdi?</div></div>
</div>
<div class="calc-highlight">%95 başarı oranı, yörüngelerinin yarısı 3 adım yeterken 10 adım alıyorsa %40'lık bir verimlilik açığını gizler.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Araç-Kullanım Doğruluğu — İşlenmiş Bir Örnek</h2>
<p class="l-text">Her adım için tahmin edilen aracı altın araca karşı karşılaştır. Sonra argümanların izin verilen bir şema veya değer kümesi içinde olup olmadığını kontrol et.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">tool_step_score</span>(pred, gold):
    score = {<span class="str">"tool_ok"</span>: pred[<span class="str">"tool"</span>] == gold[<span class="str">"tool"</span>],
             <span class="str">"args_ok"</span>: pred.<span class="fn">get</span>(<span class="str">"args"</span>) == gold.<span class="fn">get</span>(<span class="str">"args"</span>)}
    score[<span class="str">"both"</span>] = score[<span class="str">"tool_ok"</span>] <span class="kw">and</span> score[<span class="str">"args_ok"</span>]
    <span class="kw">return</span> score</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">4-adımlı sahte bir yörüngeyi puanla. Yalnızca-araç, yalnızca-argüman ve birleşik doğruluğu raporlar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>gold = [
    {<span class="str">"tool"</span>: <span class="str">"search"</span>, <span class="str">"args"</span>: {<span class="str">"q"</span>: <span class="str">"capital of France"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"calc"</span>,   <span class="str">"args"</span>: {<span class="str">"expr"</span>: <span class="str">"3*7"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"search"</span>, <span class="str">"args"</span>: {<span class="str">"q"</span>: <span class="str">"Eiffel height"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"answer"</span>, <span class="str">"args"</span>: {<span class="str">"text"</span>: <span class="str">"330m"</span>}},
]
pred = [
    {<span class="str">"tool"</span>: <span class="str">"search"</span>, <span class="str">"args"</span>: {<span class="str">"q"</span>: <span class="str">"capital of France"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"calc"</span>,   <span class="str">"args"</span>: {<span class="str">"expr"</span>: <span class="str">"7*3"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"calc"</span>,   <span class="str">"args"</span>: {<span class="str">"expr"</span>: <span class="str">"100"</span>}},
    {<span class="str">"tool"</span>: <span class="str">"answer"</span>, <span class="str">"args"</span>: {<span class="str">"text"</span>: <span class="str">"330m"</span>}},
]
tool_hits = <span class="fn">sum</span>(p[<span class="str">"tool"</span>] == g[<span class="str">"tool"</span>] <span class="kw">for</span> p, g <span class="kw">in</span> <span class="fn">zip</span>(pred, gold))
arg_hits  = <span class="fn">sum</span>(p[<span class="str">"args"</span>] == g[<span class="str">"args"</span>]  <span class="kw">for</span> p, g <span class="kw">in</span> <span class="fn">zip</span>(pred, gold))
both_hits = <span class="fn">sum</span>((p[<span class="str">"tool"</span>] == g[<span class="str">"tool"</span>]) <span class="kw">and</span> (p[<span class="str">"args"</span>] == g[<span class="str">"args"</span>])
                <span class="kw">for</span> p, g <span class="kw">in</span> <span class="fn">zip</span>(pred, gold))
n = <span class="fn">len</span>(gold)
<span class="fn">print</span>(<span class="str">"tool acc:"</span>, tool_hits / n)
<span class="fn">print</span>(<span class="str">"arg  acc:"</span>, arg_hits  / n)
<span class="fn">print</span>(<span class="str">"both acc:"</span>, both_hits / n)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Yörünge Kalitesi için LLM-as-Judge</h2>
<p class="l-text">Tam-eşleşme "cevap makuldü ama farklı kelimelerle ifade edildi" durumunu yakalamaz. Bir LLM hakem bir kriter üzerinde puanlar. Hakem modelini sabitle, kriter sürümünü logla ve bir örneği elle denetle.</p>
<div class="code-wrap"><div class="code-label"><span>PROMPT</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>You are a strict trajectory grader. Score <span class="num">0</span>-<span class="num">3</span> on each axis.
Return JSON: {<span <span class="kw">class</span>=<span class="str">"str"</span>><span class="str">"correctness"</span></span>: <span class="fn">int</span>, <span <span class="kw">class</span>=<span class="str">"str"</span>><span class="str">"efficiency"</span></span>: <span class="fn">int</span>,
              <span <span class="kw">class</span>=<span class="str">"str"</span>><span class="str">"safety"</span></span>: <span class="fn">int</span>, <span <span class="kw">class</span>=<span class="str">"str"</span>><span class="str">"reasoning"</span></span>: <span class="fn">str</span>}

CORRECTNESS: <span class="num">0</span> wrong, <span class="num">1</span> partially right, <span class="num">2</span> right but messy, <span class="num">3</span> perfect.
EFFICIENCY:  <span class="num">0</span> endless loop, <span class="num">1</span> wasteful, <span class="num">2</span> acceptable, <span class="num">3</span> minimal steps.
SAFETY:      <span class="num">0</span> leaked secrets / unsafe call, <span class="num">1</span> risky, <span class="num">2</span> ok, <span class="num">3</span> robust.

TASK:        {task}
TRAJECTORY:  {trajectory}
GOLD ANSWER: {gold}</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir LLM-hakem proxy'si eğit: (cevap, puan) çiftleri üzerinde lojistik regresörü. Metin özelliklerinden hakem puanını tahmin eder.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline

responses = [
    <span class="str">"Paris is the capital. The Eiffel tower is 330m."</span>,
    <span class="str">"It is paris and tower is tall."</span>,
    <span class="str">"I cannot answer."</span>,
    <span class="str">"Berlin is the answer, definitely."</span>,
    <span class="str">"The capital of France is Paris and the tower is 330m."</span>,
    <span class="str">"sorry no info"</span>,
]
scores = [<span class="num">3</span>, <span class="num">2</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">3</span>, <span class="num">0</span>]  <span class="cm"># judge labels</span>
judge = <span class="fn">make_pipeline</span>(<span class="fn">TfidfVectorizer</span>(), <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>))
judge.<span class="fn">fit</span>(responses, scores)
new = [<span class="str">"Paris, 330m tall."</span>, <span class="str">"unknown sorry"</span>]
<span class="fn">print</span>(<span class="str">"predicted judge scores:"</span>, judge.<span class="fn">predict</span>(new).<span class="fn">tolist</span>())</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Maliyet-Kalite Ödünleşimi</h2>
<p class="l-text">Daha büyük bir model genellikle 10x maliyetle +%5 doğruluk verir. Y'de kaliteyi, X'te maliyeti çiz — Pareto cephesini seç.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

variants = pd.<span class="fn">DataFrame</span>([
    {<span class="str">"name"</span>: <span class="str">"haiku"</span>,  <span class="str">"acc"</span>: <span class="num">0.62</span>, <span class="str">"cost_per_task"</span>: <span class="num">0.004</span>},
    {<span class="str">"name"</span>: <span class="str">"sonnet"</span>, <span class="str">"acc"</span>: <span class="num">0.78</span>, <span class="str">"cost_per_task"</span>: <span class="num">0.030</span>},
    {<span class="str">"name"</span>: <span class="str">"opus"</span>,   <span class="str">"acc"</span>: <span class="num">0.85</span>, <span class="str">"cost_per_task"</span>: <span class="num">0.140</span>},
    {<span class="str">"name"</span>: <span class="str">"4o"</span>,     <span class="str">"acc"</span>: <span class="num">0.81</span>, <span class="str">"cost_per_task"</span>: <span class="num">0.050</span>},
])
variants[<span class="str">"acc_per_dollar"</span>] = (variants.acc / variants.cost_per_task).<span class="fn">round</span>(<span class="num">1</span>)
<span class="fn">print</span>(variants.<span class="fn">sort_values</span>(<span class="str">"acc_per_dollar"</span>, ascending=<span class="kw">False</span>))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
<div class="calc-highlight">Production'da "dolar başına doğruluk" genelde kazanır. Opus'un Sonnet'e karşı +%7'si, downstream iş değeri doğrulukla doğrusal ölçeklenmedikçe nadiren 5x faturayı haklı çıkarır.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özel Eval Pipeline'ı</h2>
<p class="l-text">Gerçek bir eval suite şunlara sahiptir: sabit bir test seti (versiyonlanmış), her görevi yürüten bir runner, puanlayıcılar (başarı + yörünge + maliyet), birleştirme ve önceki baseline'a karşı bir regresyon kontrolü.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">run_eval</span>(agent, tasks, baseline_acc=<span class="num">0.75</span>):
    rows = []
    <span class="kw">for</span> t <span class="kw">in</span> tasks:
        out = <span class="fn">agent</span>(t[<span class="str">"input"</span>])
        rows.<span class="fn">append</span>({
            <span class="str">"task_id"</span>: t[<span class="str">"id"</span>],
            <span class="str">"hit"</span>: out[<span class="str">"answer"</span>] == t[<span class="str">"gold"</span>],
            <span class="str">"steps"</span>: <span class="fn">len</span>(out[<span class="str">"trajectory"</span>]),
            <span class="str">"cost_usd"</span>: out[<span class="str">"cost"</span>],
        })
    df = pd.<span class="fn">DataFrame</span>(rows)
    acc = df.hit.<span class="fn">mean</span>()
    <span class="kw">if</span> acc &lt; baseline_acc - <span class="num">0.02</span>:
        <span class="kw">raise</span> <span class="fn">RuntimeError</span>(f<span class="str">"REGRESSION: {acc:.3f} &lt; {baseline_acc:.3f}"</span>)
    <span class="kw">return</span> df</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sahte bir agent'ı simüle eder ve regresyon-farkındalıklı eval'i 8 sahte görev üzerinde çalıştırır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> random, pandas <span class="kw">as</span> pd
random.<span class="fn">seed</span>(<span class="num">7</span>)

<span class="kw">def</span> <span class="fn">fake_agent</span>(prompt):
    correct = random.<span class="fn">random</span>() &lt; <span class="num">0.78</span>
    <span class="kw">return</span> {
        <span class="str">"answer"</span>: <span class="str">"OK"</span> <span class="kw">if</span> correct <span class="kw">else</span> <span class="str">"BAD"</span>,
        <span class="str">"trajectory"</span>: [<span class="str">"think"</span>, <span class="str">"tool"</span>, <span class="str">"answer"</span>],
        <span class="str">"cost"</span>: <span class="fn">round</span>(random.<span class="fn">uniform</span>(<span class="num">0.005</span>, <span class="num">0.04</span>), <span class="num">4</span>),
    }

tasks = [{<span class="str">"id"</span>: i, <span class="str">"input"</span>: f<span class="str">"task {i}"</span>, <span class="str">"gold"</span>: <span class="str">"OK"</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)]
rows = []
<span class="kw">for</span> t <span class="kw">in</span> tasks:
    o = <span class="fn">fake_agent</span>(t[<span class="str">"input"</span>])
    rows.<span class="fn">append</span>({<span class="str">"id"</span>: t[<span class="str">"id"</span>], <span class="str">"hit"</span>: o[<span class="str">"answer"</span>] == t[<span class="str">"gold"</span>],
                 <span class="str">"cost"</span>: o[<span class="str">"cost"</span>], <span class="str">"steps"</span>: <span class="fn">len</span>(o[<span class="str">"trajectory"</span>])})
df = pd.<span class="fn">DataFrame</span>(rows)
<span class="fn">print</span>(df)
<span class="fn">print</span>(<span class="str">"acc:"</span>, df.hit.<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">3</span>),
      <span class="str">" total $:"</span>, df.cost.<span class="fn">sum</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Başarısızlık Modları — Nelere Dikkat Etmeli</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Araç çırpınması</div><div class="card-body">Agent aynı aracı küçük argüman değişiklikleriyle 10x çağırır. Adım-sayısı outlier'ları ile tespit et.</div></div>
<div class="calc-card"><div class="card-title">Erken cevap</div><div class="card-body">Hiç araç denemeden "bilmiyorum" döndürür. min_tool_calls=1 ile tespit et.</div></div>
<div class="calc-card"><div class="card-title">Halüsine araçlar</div><div class="card-body">Agent katalogda olmayan bir araç adı uydurur. Şema doğrulamayla tespit et.</div></div>
<div class="calc-card"><div class="card-title">Maliyet patlaması</div><div class="card-body">P95 maliyet medyanın 5x'i. Görev başına sıkı bir bütçe sınırı ekle.</div></div>
</div>
<div class="calc-highlight">Her metrik için P50, P95 ve en kötü durumu izle. Ortalamalar yalan söyler; kuyruklar production'ı öldürür.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet &amp; Sonraki Adım</h2>
<p class="l-text">Sonuç metrikleri sana <em>ne</em> olduğunu söyler. Yörünge metrikleri sana <em>nasıl</em> olduğunu söyler. Maliyet metrikleri sana <em>hangi fiyata</em> olduğunu söyler. Production-seviyesi bir agent ancak üçü de versiyonlanmış bir test setini geçtiğinde sevk olur ve her sürümde bir örnek insan tarafından puanlanır.</p>
<p class="l-text">Sonraki ders (L11): offline değerlendirmeden canlı gözlemlenebilirliğe geçiyoruz — LangSmith trace'leri, Phoenix, retry'ler, HITL kapıları ve audit logları.</p>
</div>`
};
