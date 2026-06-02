window.AGENTS_L12 = {

en: `<p class="l-text"><strong>One agent does one thing well. Five agents, orchestrated, do research.</strong> A researcher pulls papers, a summarizer condenses, a critic finds gaps, a writer composes, and a coordinator routes — each focused, each replaceable, each measurable. This is how production teams ship LLM systems that ship things humans care about.</p>

<p class="l-text">In this capstone you'll build a multi-agent NLP research assistant end-to-end. LangGraph state machine for the topology, per-node cost and traces, eval suite for the whole pipeline, and a deployment checklist that pulls in everything you learned in L1-L11.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Decompose a research workflow into 5 specialised agent nodes</li>
<li>Wire the topology as a LangGraph state machine with conditional edges</li>
<li>Implement researcher, summarizer, critic, writer, coordinator in clean Python</li>
<li>Run the whole pipeline on a mock corpus and inspect the shared state</li>
<li>Score outputs with an eval suite covering coverage, faithfulness, and cost</li>
<li>Hook LangSmith/Phoenix tracing and budget caps</li>
<li>Ship a deployment checklist covering CI, monitoring, HITL, and rollback</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Multi-Agent for Research?</h2>
<p class="l-text">A research task is naturally compositional: find sources, distill them, identify what's missing, write it up. A single mega-prompt can do all four — badly. Splitting them gives each step a focused context window, an independently testable contract, and a swap-in/swap-out boundary for cost-tuning (use Haiku for summarize, Opus for critic).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Specialisation</div><div class="card-body">Each agent has one job, one prompt, one eval set.</div></div>
<div class="calc-card"><div class="card-title">Cost control</div><div class="card-body">Cheap models for high-volume nodes (search, summarize), strong models for low-volume nodes (critic).</div></div>
<div class="calc-card"><div class="card-title">Failure isolation</div><div class="card-body">A bad summary doesn't poison the whole run; the critic flags it.</div></div>
<div class="calc-card"><div class="card-title">Observability</div><div class="card-body">Per-node spans tell you exactly where quality dropped.</div></div>
</div>
<div class="calc-highlight">Multi-agent is not "more agents = better". It is "right agent at right step = cheaper and more debuggable".</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Topology</h2>
<p class="l-text">Five nodes, one shared state dict. The coordinator decides whether to loop back to researcher (gaps found by critic) or proceed to writer (critic satisfied).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Researcher</div><div class="card-body">Query expansion + paper search/retrieval. Returns a list of sources with metadata.</div></div>
<div class="calc-card"><div class="card-title">Summarizer</div><div class="card-body">Condenses each source into a 4-bullet abstract.</div></div>
<div class="calc-card"><div class="card-title">Critic</div><div class="card-body">Identifies gaps, contradictions, missing baselines. Proposes follow-up queries.</div></div>
<div class="calc-card"><div class="card-title">Writer</div><div class="card-body">Composes a final structured summary with citations.</div></div>
<div class="calc-card"><div class="card-title">Coordinator</div><div class="card-body">Routes between nodes, checks budget, decides when to stop.</div></div>
</div>
<div class="katex-block">$$\\text{state}_{t+1} = \\text{node}(\\text{state}_t),\\quad \\text{stop when } \\text{critic.gaps}=\\emptyset \\lor t\\geq T_{\\max}$$</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Shared State Schema</h2>
<p class="l-text">Every node reads and writes a typed dict. Keep it minimal — anything not in state cannot be reasoned about by downstream nodes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> typing <span class="kw">import</span> TypedDict, List, Dict

<span class="kw">class</span> <span class="ty">ResearchState</span>(<span class="ty">TypedDict</span>):
    query: <span class="ty">str</span>
    sources: <span class="ty">List</span>[<span class="ty">Dict</span>]      <span class="cm"># [{title, abstract, year, ...}]</span>
    summaries: <span class="ty">List</span>[<span class="ty">Dict</span>]    <span class="cm"># [{source_id, bullets}]</span>
    gaps: <span class="ty">List</span>[<span class="ty">str</span>]          <span class="cm"># critic findings</span>
    final: <span class="ty">str</span>               <span class="cm"># writer output</span>
    iter: <span class="ty">int</span>                <span class="cm"># loop counter</span>
    cost_usd: <span class="ty">float</span>         <span class="cm"># running total</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LangGraph Skeleton</h2>
<p class="l-text">LangGraph models the topology as nodes + conditional edges. The coordinator's <code>route()</code> returns the next node name.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langgraph.graph <span class="kw">import</span> StateGraph, END

g = <span class="fn">StateGraph</span>(ResearchState)
g.<span class="fn">add_node</span>(<span class="str">"researcher"</span>, researcher)
g.<span class="fn">add_node</span>(<span class="str">"summarizer"</span>, summarizer)
g.<span class="fn">add_node</span>(<span class="str">"critic"</span>, critic)
g.<span class="fn">add_node</span>(<span class="str">"writer"</span>, writer)

g.<span class="fn">set_entry_point</span>(<span class="str">"researcher"</span>)
g.<span class="fn">add_edge</span>(<span class="str">"researcher"</span>, <span class="str">"summarizer"</span>)
g.<span class="fn">add_edge</span>(<span class="str">"summarizer"</span>, <span class="str">"critic"</span>)
g.<span class="fn">add_conditional_edges</span>(
    <span class="str">"critic"</span>,
    <span class="kw">lambda</span> s: <span class="str">"writer"</span> <span class="kw">if</span> <span class="kw">not</span> s[<span class="str">"gaps"</span>] <span class="kw">or</span> s[<span class="str">"iter"</span>] &gt;= <span class="num">3</span> <span class="kw">else</span> <span class="str">"researcher"</span>,
    {<span class="str">"writer"</span>: <span class="str">"writer"</span>, <span class="str">"researcher"</span>: <span class="str">"researcher"</span>},
)
g.<span class="fn">add_edge</span>(<span class="str">"writer"</span>, END)
app = g.<span class="fn">compile</span>()

result = app.<span class="fn">invoke</span>({<span class="str">"query"</span>: <span class="str">"RLHF for code generation"</span>,
                      <span class="str">"iter"</span>: <span class="num">0</span>, <span class="str">"cost_usd"</span>: <span class="num">0.0</span>,
                      <span class="str">"sources"</span>: [], <span class="str">"summaries"</span>: [],
                      <span class="str">"gaps"</span>: [], <span class="str">"final"</span>: <span class="str">""</span>})</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`StateGraph(StateSchema)\` declares a graph whose state is a typed dict — every node reads and writes fields of this shared state. 2) \`add_node(name, fn)\` registers a function as a node; nodes are pure transforms \`state -> partial state update\`. 3) \`add_edge\` wires nodes deterministically; \`add_conditional_edges\` routes via a function — this is how LangGraph encodes agent control flow. 4) \`graph.compile(checkpointer=...)\` produces a Runnable; checkpointing persists state per \`thread_id\` so you can pause, resume, and time-travel.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Researcher Node</h2>
<p class="l-text">Expand the query, search, deduplicate. In real life this calls Semantic Scholar, arXiv, or a vector DB. Here we mock with a corpus dict.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">researcher</span>(state):
    expansions = [state[<span class="str">"query"</span>]] + <span class="fn">propose_subqueries</span>(state)
    seen, sources = <span class="fn">set</span>(), []
    <span class="kw">for</span> q <span class="kw">in</span> expansions:
        <span class="kw">for</span> hit <span class="kw">in</span> <span class="fn">search</span>(q):
            <span class="kw">if</span> hit[<span class="str">"id"</span>] <span class="kw">not</span> <span class="kw">in</span> seen:
                seen.<span class="fn">add</span>(hit[<span class="str">"id"</span>])
                sources.<span class="fn">append</span>(hit)
    state[<span class="str">"sources"</span>] = sources
    state[<span class="str">"cost_usd"</span>] += <span class="num">0.01</span>  <span class="cm"># mock cost</span>
    <span class="kw">return</span> state</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Wraps a web-search API (Tavily, SerpAPI, Brave) as a tool the agent can invoke — input is a query string, output is a list of \`{title, url, snippet}\` items. 2) Tavily is LangChain's recommended default — designed for LLM consumption, returns clean text snippets rather than raw HTML. 3) The agent decides when to search; for many tasks one search early in the loop is enough to ground the rest of the reasoning. 4) Always cache search results — repeated identical queries during development burn quota fast.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Summarizer + Critic + Writer</h2>
<p class="l-text">Three pure functions. Summarizer extracts bullets, critic compares against the original query, writer composes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">summarizer</span>(state):
    state[<span class="str">"summaries"</span>] = [
        {<span class="str">"id"</span>: s[<span class="str">"id"</span>], <span class="str">"bullets"</span>: <span class="fn">extract_bullets</span>(s[<span class="str">"abstract"</span>])}
        <span class="kw">for</span> s <span class="kw">in</span> state[<span class="str">"sources"</span>]
    ]
    state[<span class="str">"cost_usd"</span>] += <span class="num">0.02</span> * <span class="fn">len</span>(state[<span class="str">"sources"</span>])
    <span class="kw">return</span> state

<span class="kw">def</span> <span class="fn">critic</span>(state):
    state[<span class="str">"gaps"</span>] = <span class="fn">find_gaps</span>(state[<span class="str">"query"</span>], state[<span class="str">"summaries"</span>])
    state[<span class="str">"iter"</span>] += <span class="num">1</span>
    state[<span class="str">"cost_usd"</span>] += <span class="num">0.03</span>
    <span class="kw">return</span> state

<span class="kw">def</span> <span class="fn">writer</span>(state):
    state[<span class="str">"final"</span>] = <span class="fn">compose</span>(state[<span class="str">"query"</span>], state[<span class="str">"summaries"</span>])
    state[<span class="str">"cost_usd"</span>] += <span class="num">0.02</span>
    <span class="kw">return</span> state</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Run the Full Pipeline (Pyodide)</h2>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A self-contained mini multi-agent system: 5 functions chained through a state dict over a tiny corpus. Loops if critic finds gaps, stops at iter==2.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

CORPUS = {
    <span class="str">"p1"</span>: {<span class="str">"id"</span>: <span class="str">"p1"</span>, <span class="str">"title"</span>: <span class="str">"RLHF for Code"</span>,
           <span class="str">"abstract"</span>: <span class="str">"We fine-tune codex with RLHF. Reward model uses pairwise prefs. Eval on HumanEval. Baseline DPO."</span>},
    <span class="str">"p2"</span>: {<span class="str">"id"</span>: <span class="str">"p2"</span>, <span class="str">"title"</span>: <span class="str">"DPO Survey"</span>,
           <span class="str">"abstract"</span>: <span class="str">"Direct preference optimization avoids reward modelling. Compared to PPO. Lower compute."</span>},
    <span class="str">"p3"</span>: {<span class="str">"id"</span>: <span class="str">"p3"</span>, <span class="str">"title"</span>: <span class="str">"Eval Pitfalls"</span>,
           <span class="str">"abstract"</span>: <span class="str">"HumanEval is saturating. Need MBPP, BigCodeBench, live coding tasks."</span>},
    <span class="str">"p4"</span>: {<span class="str">"id"</span>: <span class="str">"p4"</span>, <span class="str">"title"</span>: <span class="str">"Reward Hacking"</span>,
           <span class="str">"abstract"</span>: <span class="str">"RLHF code models exploit reward shape. Mitigation via KL penalty and length norm."</span>},
}

<span class="kw">def</span> <span class="fn">search</span>(q):
    q = q.<span class="fn">lower</span>()
    hits = []
    <span class="kw">for</span> p <span class="kw">in</span> CORPUS.<span class="fn">values</span>():
        text = (p[<span class="str">"title"</span>] + <span class="str">" "</span> + p[<span class="str">"abstract"</span>]).<span class="fn">lower</span>()
        <span class="kw">if</span> <span class="fn">any</span>(w <span class="kw">in</span> text <span class="kw">for</span> w <span class="kw">in</span> q.<span class="fn">split</span>()):
            hits.<span class="fn">append</span>(p)
    <span class="kw">return</span> hits

<span class="kw">def</span> <span class="fn">propose_subqueries</span>(state):
    base = state[<span class="str">"query"</span>]
    <span class="kw">if</span> state[<span class="str">"gaps"</span>]:
        <span class="kw">return</span> [f<span class="str">"{base} {g}"</span> <span class="kw">for</span> g <span class="kw">in</span> state[<span class="str">"gaps"</span>]]
    <span class="kw">return</span> [base + <span class="str">" eval"</span>, base + <span class="str">" baseline"</span>]

<span class="kw">def</span> <span class="fn">extract_bullets</span>(abstract):
    <span class="kw">return</span> [s.<span class="fn">strip</span>() <span class="kw">for</span> s <span class="kw">in</span> abstract.<span class="fn">split</span>(<span class="str">"."</span>) <span class="kw">if</span> s.<span class="fn">strip</span>()][:<span class="num">3</span>]

<span class="kw">def</span> <span class="fn">find_gaps</span>(query, summaries):
    found = <span class="str">" "</span>.<span class="fn">join</span>(<span class="str">" "</span>.<span class="fn">join</span>(s[<span class="str">"bullets"</span>]) <span class="kw">for</span> s <span class="kw">in</span> summaries).<span class="fn">lower</span>()
    gaps = []
    <span class="kw">if</span> <span class="str">"safety"</span> <span class="kw">not</span> <span class="kw">in</span> found: gaps.<span class="fn">append</span>(<span class="str">"safety"</span>)
    <span class="kw">if</span> <span class="str">"cost"</span> <span class="kw">not</span> <span class="kw">in</span> found <span class="kw">and</span> <span class="str">"compute"</span> <span class="kw">not</span> <span class="kw">in</span> found: gaps.<span class="fn">append</span>(<span class="str">"cost"</span>)
    <span class="kw">return</span> gaps

<span class="kw">def</span> <span class="fn">compose</span>(query, summaries):
    head = f<span class="str">"# Findings on: {query}\\n\\n"</span>
    body = <span class="str">""</span>
    <span class="kw">for</span> s <span class="kw">in</span> summaries:
        body += f<span class="str">"\\n## {s['id']}\\n"</span> + <span class="str">"\\n"</span>.<span class="fn">join</span>(<span class="str">"- "</span> + b <span class="kw">for</span> b <span class="kw">in</span> s[<span class="str">"bullets"</span>])
    <span class="kw">return</span> head + body

<span class="kw">def</span> <span class="fn">researcher</span>(s):
    seen, out = <span class="fn">set</span>(), []
    <span class="kw">for</span> q <span class="kw">in</span> [s[<span class="str">"query"</span>]] + <span class="fn">propose_subqueries</span>(s):
        <span class="kw">for</span> h <span class="kw">in</span> <span class="fn">search</span>(q):
            <span class="kw">if</span> h[<span class="str">"id"</span>] <span class="kw">not</span> <span class="kw">in</span> seen:
                seen.<span class="fn">add</span>(h[<span class="str">"id"</span>]); out.<span class="fn">append</span>(h)
    s[<span class="str">"sources"</span>] = out; s[<span class="str">"cost_usd"</span>] += <span class="num">0.01</span>; <span class="kw">return</span> s

<span class="kw">def</span> <span class="fn">summarizer</span>(s):
    s[<span class="str">"summaries"</span>] = [{<span class="str">"id"</span>: x[<span class="str">"id"</span>], <span class="str">"bullets"</span>: <span class="fn">extract_bullets</span>(x[<span class="str">"abstract"</span>])}
                       <span class="kw">for</span> x <span class="kw">in</span> s[<span class="str">"sources"</span>]]
    s[<span class="str">"cost_usd"</span>] += <span class="num">0.02</span> * <span class="fn">len</span>(s[<span class="str">"sources"</span>]); <span class="kw">return</span> s

<span class="kw">def</span> <span class="fn">critic</span>(s):
    s[<span class="str">"gaps"</span>] = <span class="fn">find_gaps</span>(s[<span class="str">"query"</span>], s[<span class="str">"summaries"</span>])
    s[<span class="str">"iter"</span>] += <span class="num">1</span>; s[<span class="str">"cost_usd"</span>] += <span class="num">0.03</span>; <span class="kw">return</span> s

<span class="kw">def</span> <span class="fn">writer</span>(s):
    s[<span class="str">"final"</span>] = <span class="fn">compose</span>(s[<span class="str">"query"</span>], s[<span class="str">"summaries"</span>])
    s[<span class="str">"cost_usd"</span>] += <span class="num">0.02</span>; <span class="kw">return</span> s

<span class="kw">def</span> <span class="fn">coordinator</span>(s, max_iter=<span class="num">2</span>):
    s = <span class="fn">researcher</span>(s); s = <span class="fn">summarizer</span>(s); s = <span class="fn">critic</span>(s)
    <span class="kw">while</span> s[<span class="str">"gaps"</span>] <span class="kw">and</span> s[<span class="str">"iter"</span>] &lt; max_iter:
        <span class="fn">print</span>(f<span class="str">"iter {s['iter']}: gaps={s['gaps']}, looping..."</span>)
        s = <span class="fn">researcher</span>(s); s = <span class="fn">summarizer</span>(s); s = <span class="fn">critic</span>(s)
    s = <span class="fn">writer</span>(s); <span class="kw">return</span> s

state = {<span class="str">"query"</span>: <span class="str">"RLHF code"</span>, <span class="str">"sources"</span>: [], <span class="str">"summaries"</span>: [],
         <span class="str">"gaps"</span>: [], <span class="str">"final"</span>: <span class="str">""</span>, <span class="str">"iter"</span>: <span class="num">0</span>, <span class="str">"cost_usd"</span>: <span class="num">0.0</span>}
out = <span class="fn">coordinator</span>(state)
<span class="fn">print</span>(<span class="str">"\\n=== FINAL ==="</span>)
<span class="fn">print</span>(out[<span class="str">"final"</span>][:<span class="num">400</span>])
<span class="fn">print</span>(<span class="str">"\\nsources:"</span>, [s[<span class="str">"id"</span>] <span class="kw">for</span> s <span class="kw">in</span> out[<span class="str">"sources"</span>]])
<span class="fn">print</span>(<span class="str">"iters:"</span>, out[<span class="str">"iter"</span>], <span class="str">" cost $:"</span>, <span class="fn">round</span>(out[<span class="str">"cost_usd"</span>], <span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Wraps a web-search API (Tavily, SerpAPI, Brave) as a tool the agent can invoke — input is a query string, output is a list of \`{title, url, snippet}\` items. 2) Tavily is LangChain's recommended default — designed for LLM consumption, returns clean text snippets rather than raw HTML. 3) The agent decides when to search; for many tasks one search early in the loop is enough to ground the rest of the reasoning. 4) Always cache search results — repeated identical queries during development burn quota fast.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Eval Suite for the Whole Pipeline</h2>
<p class="l-text">Three eval axes for a research assistant: <strong>coverage</strong> (did it cite the relevant papers?), <strong>faithfulness</strong> (does the final summary contain only claims supported by sources?), <strong>cost</strong> (under budget?).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Coverage</div><div class="card-body">Recall@K of gold paper IDs in the cited list.</div></div>
<div class="calc-card"><div class="card-title">Faithfulness</div><div class="card-body">Each claim in final must trace to at least one source bullet (LLM-judge).</div></div>
<div class="calc-card"><div class="card-title">Coherence</div><div class="card-body">Critic re-grades the writer output on a 0-3 rubric.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">$ per query &lt; budget; tail (P95) &lt; 3x median.</div></div>
</div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Compute coverage + faithfulness + cost over 4 mock pipeline runs. Flag the regression.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

runs = [
    {<span class="str">"q"</span>: <span class="str">"RLHF code"</span>,    <span class="str">"cited"</span>: {<span class="str">"p1"</span>, <span class="str">"p2"</span>, <span class="str">"p4"</span>}, <span class="str">"gold"</span>: {<span class="str">"p1"</span>, <span class="str">"p3"</span>, <span class="str">"p4"</span>}, <span class="str">"faith"</span>: <span class="num">0.92</span>, <span class="str">"cost"</span>: <span class="num">0.18</span>},
    {<span class="str">"q"</span>: <span class="str">"DPO survey"</span>,   <span class="str">"cited"</span>: {<span class="str">"p2"</span>},             <span class="str">"gold"</span>: {<span class="str">"p2"</span>},             <span class="str">"faith"</span>: <span class="num">0.98</span>, <span class="str">"cost"</span>: <span class="num">0.05</span>},
    {<span class="str">"q"</span>: <span class="str">"eval pitfalls"</span>,<span class="str">"cited"</span>: {<span class="str">"p3"</span>, <span class="str">"p4"</span>},      <span class="str">"gold"</span>: {<span class="str">"p3"</span>},             <span class="str">"faith"</span>: <span class="num">0.85</span>, <span class="str">"cost"</span>: <span class="num">0.10</span>},
    {<span class="str">"q"</span>: <span class="str">"reward hack"</span>,  <span class="str">"cited"</span>: {<span class="str">"p4"</span>},             <span class="str">"gold"</span>: {<span class="str">"p4"</span>, <span class="str">"p1"</span>},       <span class="str">"faith"</span>: <span class="num">0.70</span>, <span class="str">"cost"</span>: <span class="num">0.42</span>},
]
rows = []
<span class="kw">for</span> r <span class="kw">in</span> runs:
    cov = <span class="fn">len</span>(r[<span class="str">"cited"</span>] &amp; r[<span class="str">"gold"</span>]) / <span class="fn">len</span>(r[<span class="str">"gold"</span>])
    rows.<span class="fn">append</span>({<span class="str">"q"</span>: r[<span class="str">"q"</span>], <span class="str">"coverage"</span>: <span class="fn">round</span>(cov, <span class="num">2</span>),
                 <span class="str">"faith"</span>: r[<span class="str">"faith"</span>], <span class="str">"cost"</span>: r[<span class="str">"cost"</span>]})
df = pd.<span class="fn">DataFrame</span>(rows)
df[<span class="str">"pass"</span>] = (df.coverage &gt;= <span class="num">0.5</span>) &amp; (df.faith &gt;= <span class="num">0.8</span>) &amp; (df.cost &lt; <span class="num">0.30</span>)
<span class="fn">print</span>(df)
<span class="fn">print</span>(<span class="str">"\\npass rate:"</span>, df[<span class="str">"pass"</span>].<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tracing &amp; Cost in LangSmith</h2>
<p class="l-text">Wrap each node with <code>@traceable</code>. LangSmith captures the span tree automatically. Cost annotations let you slice by node.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langsmith <span class="kw">import</span> traceable

<span class="ds">@traceable</span>(name=<span class="str">"researcher"</span>, run_type=<span class="str">"chain"</span>)
<span class="kw">def</span> <span class="fn">researcher</span>(state): ...

<span class="ds">@traceable</span>(name=<span class="str">"critic"</span>, run_type=<span class="str">"chain"</span>)
<span class="kw">def</span> <span class="fn">critic</span>(state): ...

<span class="cm"># Cost tags surface in dashboards</span>
<span class="kw">from</span> langsmith.run_helpers <span class="kw">import</span> get_current_run_tree
<span class="kw">def</span> <span class="fn">tag_cost</span>(usd):
    rt = <span class="fn">get_current_run_tree</span>()
    <span class="kw">if</span> rt: rt.<span class="fn">add_metadata</span>({<span class="str">"cost_usd"</span>: usd})</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Setting \`LANGCHAIN_TRACING_V2=true\` and \`LANGCHAIN_API_KEY=...\` automatically logs every Runnable invocation to LangSmith — no code changes. 2) Each chain run becomes a tree of nested spans showing inputs, outputs, latency, and token cost per step — the standard way to debug long chains and agents. 3) LangSmith stores datasets and runs evaluators over them — pair with \`evaluate()\` to track regression as you change prompts or models. 4) Self-hosted alternatives: LangFuse (open source) and Helicone (proxy-based) — same idea, no vendor lock-in.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Builds a per-node span tree by hand and groups cost by node. Shows what LangSmith would render in its UI.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, pandas <span class="kw">as</span> pd

spans = [
    {<span class="str">"node"</span>: <span class="str">"researcher"</span>, <span class="str">"iter"</span>: <span class="num">1</span>, <span class="str">"ms"</span>: <span class="num">340</span>, <span class="str">"usd"</span>: <span class="num">0.010</span>},
    {<span class="str">"node"</span>: <span class="str">"summarizer"</span>, <span class="str">"iter"</span>: <span class="num">1</span>, <span class="str">"ms"</span>: <span class="num">820</span>, <span class="str">"usd"</span>: <span class="num">0.080</span>},
    {<span class="str">"node"</span>: <span class="str">"critic"</span>,     <span class="str">"iter"</span>: <span class="num">1</span>, <span class="str">"ms"</span>: <span class="num">410</span>, <span class="str">"usd"</span>: <span class="num">0.030</span>},
    {<span class="str">"node"</span>: <span class="str">"researcher"</span>, <span class="str">"iter"</span>: <span class="num">2</span>, <span class="str">"ms"</span>: <span class="num">280</span>, <span class="str">"usd"</span>: <span class="num">0.010</span>},
    {<span class="str">"node"</span>: <span class="str">"summarizer"</span>, <span class="str">"iter"</span>: <span class="num">2</span>, <span class="str">"ms"</span>: <span class="num">520</span>, <span class="str">"usd"</span>: <span class="num">0.040</span>},
    {<span class="str">"node"</span>: <span class="str">"critic"</span>,     <span class="str">"iter"</span>: <span class="num">2</span>, <span class="str">"ms"</span>: <span class="num">390</span>, <span class="str">"usd"</span>: <span class="num">0.030</span>},
    {<span class="str">"node"</span>: <span class="str">"writer"</span>,     <span class="str">"iter"</span>: <span class="num">2</span>, <span class="str">"ms"</span>: <span class="num">610</span>, <span class="str">"usd"</span>: <span class="num">0.020</span>},
]
df = pd.<span class="fn">DataFrame</span>(spans)
<span class="fn">print</span>(<span class="str">"per-node cost:"</span>)
<span class="fn">print</span>(df.<span class="fn">groupby</span>(<span class="str">"node"</span>)[[<span class="str">"ms"</span>, <span class="str">"usd"</span>]].<span class="fn">sum</span>().<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"\\ntotals: latency"</span>, df.ms.<span class="fn">sum</span>(), <span class="str">"ms, cost $"</span>, df.usd.<span class="fn">sum</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Production Hardening</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Budget cap</div><div class="card-body">Coordinator aborts if cost_usd &gt; ceiling.</div></div>
<div class="calc-card"><div class="card-title">Iteration cap</div><div class="card-body">Max 3 critic loops; otherwise force writer.</div></div>
<div class="calc-card"><div class="card-title">Per-node retry</div><div class="card-body">Exponential backoff on transient LLM errors.</div></div>
<div class="calc-card"><div class="card-title">Fallback model</div><div class="card-body">Sonnet for critic, downgrade to Haiku if 429s.</div></div>
<div class="calc-card"><div class="card-title">HITL gate</div><div class="card-body">If query is in a sensitive domain (legal, medical), require human review of the writer draft.</div></div>
<div class="calc-card"><div class="card-title">Audit log</div><div class="card-body">Hash-chain final + sources + cost per run.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">coordinator_prod</span>(state, budget=<span class="num">0.50</span>, max_iter=<span class="num">3</span>):
    state = <span class="fn">researcher</span>(state); state = <span class="fn">summarizer</span>(state); state = <span class="fn">critic</span>(state)
    <span class="kw">while</span> state[<span class="str">"gaps"</span>] <span class="kw">and</span> state[<span class="str">"iter"</span>] &lt; max_iter:
        <span class="kw">if</span> state[<span class="str">"cost_usd"</span>] &gt; budget:
            <span class="fn">print</span>(<span class="str">"BUDGET HIT — writing with what we have"</span>)
            <span class="kw">break</span>
        state = <span class="fn">researcher</span>(state); state = <span class="fn">summarizer</span>(state); state = <span class="fn">critic</span>(state)
    <span class="kw">return</span> <span class="fn">writer</span>(state)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up the necessary imports and component instances — typically a model wrapper, optional prompt, and any helpers the example needs. 2) Wires the components into a single Runnable using LCEL's \`|\` operator (or builds a manual loop / class for the Pyodide demo). 3) Calls the resulting object via \`.invoke(...)\` (or the loop's entry point) to produce the example output you would see in production. 4) The structural shape — compose, then call — is identical whether the model is a real provider, a mock, or a tiny in-browser stand-in.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Deployment Checklist</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">CI eval gate</div><div class="card-body">Nightly run on 50 test queries. Block merge if pass-rate drops &gt;2%.</div></div>
<div class="calc-card"><div class="card-title">Canary rollout</div><div class="card-body">5% traffic to new agent version, watch trace metrics for 24h.</div></div>
<div class="calc-card"><div class="card-title">Cost dashboard</div><div class="card-body">Per-node, per-day, per-user. Alert at 80% of monthly budget.</div></div>
<div class="calc-card"><div class="card-title">Latency SLO</div><div class="card-body">P95 &lt; 30s for end-to-end pipeline. Page on breach.</div></div>
<div class="calc-card"><div class="card-title">Rollback</div><div class="card-body">One-click revert to prior agent version + prompt set.</div></div>
<div class="calc-card"><div class="card-title">Incident runbook</div><div class="card-body">Trace ID → user → query → cost → fix path documented.</div></div>
</div>
<div class="calc-highlight">A multi-agent pipeline is only as production-ready as its weakest node. Eval each agent independently, then eval the composition.</div>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Capstone Wrap &amp; Where to Go Next</h2>
<p class="l-text">You now have a complete agentic system: planning (L1-L3), tools (L4-L5), memory (L6), RAG (L7), multi-agent (L8-L9), eval (L10), production (L11), and a working multi-node research assistant (L12). You can extend each axis:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">More nodes</div><div class="card-body">Add a fact-checker, translator, or visualizer node.</div></div>
<div class="calc-card"><div class="card-title">RL fine-tune</div><div class="card-body">Use trajectory-judge scores as rewards (RLAIF).</div></div>
<div class="calc-card"><div class="card-title">Live data</div><div class="card-body">Swap mock CORPUS for arXiv API + vector DB.</div></div>
<div class="calc-card"><div class="card-title">Async parallel</div><div class="card-body">Summarize all sources concurrently with asyncio.gather.</div></div>
</div>
<p class="l-text">Production-grade LLM agents are not models — they are systems. State, traces, costs, evals, and humans-in-the-loop. Build the system, and the model becomes replaceable. That is the real lesson of this track.</p>
</div>`,

tr: `<p class="l-text"><strong>Tek bir agent bir şeyi iyi yapar. Beş agent, orkestralanırsa, araştırma yapar.</strong> Bir researcher makaleleri çeker, bir summarizer yoğunlaştırır, bir critic boşlukları bulur, bir writer kompoze eder ve bir coordinator yönlendirir — her biri odaklanmış, her biri değiştirilebilir, her biri ölçülebilir. Production ekiplerinin insanların önemsediği şeyleri sevk eden LLM sistemleri sevk etme şekli budur.</p>

<p class="l-text">Bu capstone'da uçtan uca çok-agent'lı bir NLP araştırma asistanı inşa edeceksin. Topoloji için LangGraph durum makinesi, düğüm başına maliyet ve trace'ler, tüm pipeline için eval suite ve L1-L11'de öğrendiğin her şeyi içine çeken bir deployment kontrol listesi.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir araştırma iş akışını 5 uzmanlaşmış agent düğümüne ayrıştırmak</li>
<li>Topolojiyi koşullu kenarlarla bir LangGraph durum makinesi olarak bağlamak</li>
<li>researcher, summarizer, critic, writer, coordinator'ı temiz Python'da uygulamak</li>
<li>Tüm pipeline'ı sahte bir korpus üzerinde çalıştırmak ve paylaşılan state'i incelemek</li>
<li>Çıktıları kapsama, sadakat ve maliyet kapsayan bir eval suite ile puanlamak</li>
<li>LangSmith/Phoenix tracing ve bütçe sınırlarını bağlamak</li>
<li>CI, izleme, HITL ve geri alma kapsayan bir deployment kontrol listesi sevk etmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Araştırma için Neden Çok-Agent?</h2>
<p class="l-text">Bir araştırma görevi doğal olarak kompozitsiyonel: kaynakları bul, damıt, eksik olanı tespit et, yaz. Tek bir mega-prompt dördünü de yapabilir — kötü biçimde. Onları bölmek her adıma odaklanmış bir context penceresi, bağımsız test edilebilir bir kontrat ve maliyet-ayarlama için takılıp çıkarılabilir bir sınır verir (summarize için Haiku, critic için Opus kullan).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uzmanlaşma</div><div class="card-body">Her agent'ın bir işi, bir prompt'u, bir eval seti vardır.</div></div>
<div class="calc-card"><div class="card-title">Maliyet kontrolü</div><div class="card-body">Yüksek-hacim düğümleri için ucuz modeller (search, summarize), düşük-hacim düğümleri için güçlü modeller (critic).</div></div>
<div class="calc-card"><div class="card-title">Hata izolasyonu</div><div class="card-body">Kötü bir özet tüm çalıştırmayı zehirlemez; critic onu işaretler.</div></div>
<div class="calc-card"><div class="card-title">Gözlemlenebilirlik</div><div class="card-body">Düğüm başına span'lar kalitenin tam olarak nerede düştüğünü söyler.</div></div>
</div>
<div class="calc-highlight">Çok-agent "daha çok agent = daha iyi" değildir. "Doğru adımda doğru agent = daha ucuz ve daha hata ayıklanabilir"dir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Topoloji</h2>
<p class="l-text">Beş düğüm, bir paylaşılan state dict. Coordinator, researcher'a geri döngü oluşturup oluşturmayacağına (critic boşluk bulduğunda) veya writer'a ilerleyeceğine (critic memnun) karar verir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Researcher</div><div class="card-body">Sorgu genişletme + makale arama/getirme. Metadata'lı kaynaklar listesi döndürür.</div></div>
<div class="calc-card"><div class="card-title">Summarizer</div><div class="card-body">Her kaynağı 4-madde özete yoğunlaştırır.</div></div>
<div class="calc-card"><div class="card-title">Critic</div><div class="card-body">Boşlukları, çelişkileri, eksik baseline'ları tespit eder. Takip sorguları önerir.</div></div>
<div class="calc-card"><div class="card-title">Writer</div><div class="card-body">Atıflarla final yapılandırılmış özeti kompoze eder.</div></div>
<div class="calc-card"><div class="card-title">Coordinator</div><div class="card-body">Düğümler arasında yönlendirir, bütçeyi kontrol eder, ne zaman duracağına karar verir.</div></div>
</div>
<div class="katex-block">$$\\text{state}_{t+1} = \\text{node}(\\text{state}_t),\\quad \\text{stop when } \\text{critic.gaps}=\\emptyset \\lor t\\geq T_{\\max}$$</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Paylaşılan State Şeması</h2>
<p class="l-text">Her düğüm tipli bir dict'i okur ve yazar. Onu minimal tut — state'te olmayan herhangi bir şey downstream düğümler tarafından muhakeme edilemez.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> typing <span class="kw">import</span> TypedDict, List, Dict

<span class="kw">class</span> <span class="ty">ResearchState</span>(<span class="ty">TypedDict</span>):
    query: <span class="ty">str</span>
    sources: <span class="ty">List</span>[<span class="ty">Dict</span>]      <span class="cm"># [{title, abstract, year, ...}]</span>
    summaries: <span class="ty">List</span>[<span class="ty">Dict</span>]    <span class="cm"># [{source_id, bullets}]</span>
    gaps: <span class="ty">List</span>[<span class="ty">str</span>]          <span class="cm"># critic findings</span>
    final: <span class="ty">str</span>               <span class="cm"># writer output</span>
    iter: <span class="ty">int</span>                <span class="cm"># loop counter</span>
    cost_usd: <span class="ty">float</span>         <span class="cm"># running total</span></code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LangGraph İskeleti</h2>
<p class="l-text">LangGraph topolojiyi düğümler + koşullu kenarlar olarak modeller. Coordinator'ın <code>route()</code>'u sonraki düğüm adını döndürür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langgraph.graph <span class="kw">import</span> StateGraph, END

g = <span class="fn">StateGraph</span>(ResearchState)
g.<span class="fn">add_node</span>(<span class="str">"researcher"</span>, researcher)
g.<span class="fn">add_node</span>(<span class="str">"summarizer"</span>, summarizer)
g.<span class="fn">add_node</span>(<span class="str">"critic"</span>, critic)
g.<span class="fn">add_node</span>(<span class="str">"writer"</span>, writer)

g.<span class="fn">set_entry_point</span>(<span class="str">"researcher"</span>)
g.<span class="fn">add_edge</span>(<span class="str">"researcher"</span>, <span class="str">"summarizer"</span>)
g.<span class="fn">add_edge</span>(<span class="str">"summarizer"</span>, <span class="str">"critic"</span>)
g.<span class="fn">add_conditional_edges</span>(
    <span class="str">"critic"</span>,
    <span class="kw">lambda</span> s: <span class="str">"writer"</span> <span class="kw">if</span> <span class="kw">not</span> s[<span class="str">"gaps"</span>] <span class="kw">or</span> s[<span class="str">"iter"</span>] &gt;= <span class="num">3</span> <span class="kw">else</span> <span class="str">"researcher"</span>,
    {<span class="str">"writer"</span>: <span class="str">"writer"</span>, <span class="str">"researcher"</span>: <span class="str">"researcher"</span>},
)
g.<span class="fn">add_edge</span>(<span class="str">"writer"</span>, END)
app = g.<span class="fn">compile</span>()

result = app.<span class="fn">invoke</span>({<span class="str">"query"</span>: <span class="str">"RLHF for code generation"</span>,
                      <span class="str">"iter"</span>: <span class="num">0</span>, <span class="str">"cost_usd"</span>: <span class="num">0.0</span>,
                      <span class="str">"sources"</span>: [], <span class="str">"summaries"</span>: [],
                      <span class="str">"gaps"</span>: [], <span class="str">"final"</span>: <span class="str">""</span>})</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) \`StateGraph(StateSchema)\` durumu typed-dict olan bir graph tanımlar — her düğüm bu paylaşılan state'in alanlarını okur ve yazar. 2) \`add_node(isim, fn)\` bir fonksiyonu düğüm olarak kaydeder; düğümler \`state -> kısmi state güncelleme\` saf dönüşümleridir. 3) \`add_edge\` düğümleri deterministik bağlar; \`add_conditional_edges\` bir fonksiyon ile yönlendirir — LangGraph agent kontrol akışını böyle kodlar. 4) \`graph.compile(checkpointer=...)\` bir Runnable üretir; checkpointing state'i \`thread_id\` başına kalıcı yapar — duraklatma, devam ettirme ve time-travel mümkün olur.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Researcher Düğümü</h2>
<p class="l-text">Sorguyu genişlet, ara, deduplicate et. Gerçek hayatta bu Semantic Scholar, arXiv veya bir vektör DB çağırır. Burada bir korpus dict'iyle sahteliyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">researcher</span>(state):
    expansions = [state[<span class="str">"query"</span>]] + <span class="fn">propose_subqueries</span>(state)
    seen, sources = <span class="fn">set</span>(), []
    <span class="kw">for</span> q <span class="kw">in</span> expansions:
        <span class="kw">for</span> hit <span class="kw">in</span> <span class="fn">search</span>(q):
            <span class="kw">if</span> hit[<span class="str">"id"</span>] <span class="kw">not</span> <span class="kw">in</span> seen:
                seen.<span class="fn">add</span>(hit[<span class="str">"id"</span>])
                sources.<span class="fn">append</span>(hit)
    state[<span class="str">"sources"</span>] = sources
    state[<span class="str">"cost_usd"</span>] += <span class="num">0.01</span>  <span class="cm"># mock cost</span>
    <span class="kw">return</span> state</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Bir web-arama API'sini (Tavily, SerpAPI, Brave) agent'ın çağırabileceği bir tool olarak sarmalar — girdi sorgu string'i, çıktı \`{title, url, snippet}\` öğeleri listesi. 2) Tavily LangChain'in önerdiği varsayılan — LLM tüketimi için tasarlanmış, ham HTML yerine temiz metin snippet'ler döndürür. 3) Agent ne zaman arayacağına karar verir; birçok görev için döngünün erken evresinde tek arama, kalan akıl yürütmeyi temellendirmek için yeterlidir. 4) Arama sonuçlarını her zaman cache'leyin — geliştirme sırasında tekrarlı aynı sorgular kotayı hızla yakar.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Summarizer + Critic + Writer</h2>
<p class="l-text">Üç saf fonksiyon. Summarizer maddeler çıkarır, critic orijinal sorguyla karşılaştırır, writer kompoze eder.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">summarizer</span>(state):
    state[<span class="str">"summaries"</span>] = [
        {<span class="str">"id"</span>: s[<span class="str">"id"</span>], <span class="str">"bullets"</span>: <span class="fn">extract_bullets</span>(s[<span class="str">"abstract"</span>])}
        <span class="kw">for</span> s <span class="kw">in</span> state[<span class="str">"sources"</span>]
    ]
    state[<span class="str">"cost_usd"</span>] += <span class="num">0.02</span> * <span class="fn">len</span>(state[<span class="str">"sources"</span>])
    <span class="kw">return</span> state

<span class="kw">def</span> <span class="fn">critic</span>(state):
    state[<span class="str">"gaps"</span>] = <span class="fn">find_gaps</span>(state[<span class="str">"query"</span>], state[<span class="str">"summaries"</span>])
    state[<span class="str">"iter"</span>] += <span class="num">1</span>
    state[<span class="str">"cost_usd"</span>] += <span class="num">0.03</span>
    <span class="kw">return</span> state

<span class="kw">def</span> <span class="fn">writer</span>(state):
    state[<span class="str">"final"</span>] = <span class="fn">compose</span>(state[<span class="str">"query"</span>], state[<span class="str">"summaries"</span>])
    state[<span class="str">"cost_usd"</span>] += <span class="num">0.02</span>
    <span class="kw">return</span> state</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Tam Pipeline'ı Çalıştır (Pyodide)</h2>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Kendi-kendine yeten mini bir çok-agent sistem: küçük bir korpus üzerinde bir state dict üzerinden zincirlenmiş 5 fonksiyon. Critic boşluk bulursa döngüye girer, iter==2'de durur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

CORPUS = {
    <span class="str">"p1"</span>: {<span class="str">"id"</span>: <span class="str">"p1"</span>, <span class="str">"title"</span>: <span class="str">"RLHF for Code"</span>,
           <span class="str">"abstract"</span>: <span class="str">"We fine-tune codex with RLHF. Reward model uses pairwise prefs. Eval on HumanEval. Baseline DPO."</span>},
    <span class="str">"p2"</span>: {<span class="str">"id"</span>: <span class="str">"p2"</span>, <span class="str">"title"</span>: <span class="str">"DPO Survey"</span>,
           <span class="str">"abstract"</span>: <span class="str">"Direct preference optimization avoids reward modelling. Compared to PPO. Lower compute."</span>},
    <span class="str">"p3"</span>: {<span class="str">"id"</span>: <span class="str">"p3"</span>, <span class="str">"title"</span>: <span class="str">"Eval Pitfalls"</span>,
           <span class="str">"abstract"</span>: <span class="str">"HumanEval is saturating. Need MBPP, BigCodeBench, live coding tasks."</span>},
    <span class="str">"p4"</span>: {<span class="str">"id"</span>: <span class="str">"p4"</span>, <span class="str">"title"</span>: <span class="str">"Reward Hacking"</span>,
           <span class="str">"abstract"</span>: <span class="str">"RLHF code models exploit reward shape. Mitigation via KL penalty and length norm."</span>},
}

<span class="kw">def</span> <span class="fn">search</span>(q):
    q = q.<span class="fn">lower</span>()
    hits = []
    <span class="kw">for</span> p <span class="kw">in</span> CORPUS.<span class="fn">values</span>():
        text = (p[<span class="str">"title"</span>] + <span class="str">" "</span> + p[<span class="str">"abstract"</span>]).<span class="fn">lower</span>()
        <span class="kw">if</span> <span class="fn">any</span>(w <span class="kw">in</span> text <span class="kw">for</span> w <span class="kw">in</span> q.<span class="fn">split</span>()):
            hits.<span class="fn">append</span>(p)
    <span class="kw">return</span> hits

<span class="kw">def</span> <span class="fn">propose_subqueries</span>(state):
    base = state[<span class="str">"query"</span>]
    <span class="kw">if</span> state[<span class="str">"gaps"</span>]:
        <span class="kw">return</span> [f<span class="str">"{base} {g}"</span> <span class="kw">for</span> g <span class="kw">in</span> state[<span class="str">"gaps"</span>]]
    <span class="kw">return</span> [base + <span class="str">" eval"</span>, base + <span class="str">" baseline"</span>]

<span class="kw">def</span> <span class="fn">extract_bullets</span>(abstract):
    <span class="kw">return</span> [s.<span class="fn">strip</span>() <span class="kw">for</span> s <span class="kw">in</span> abstract.<span class="fn">split</span>(<span class="str">"."</span>) <span class="kw">if</span> s.<span class="fn">strip</span>()][:<span class="num">3</span>]

<span class="kw">def</span> <span class="fn">find_gaps</span>(query, summaries):
    found = <span class="str">" "</span>.<span class="fn">join</span>(<span class="str">" "</span>.<span class="fn">join</span>(s[<span class="str">"bullets"</span>]) <span class="kw">for</span> s <span class="kw">in</span> summaries).<span class="fn">lower</span>()
    gaps = []
    <span class="kw">if</span> <span class="str">"safety"</span> <span class="kw">not</span> <span class="kw">in</span> found: gaps.<span class="fn">append</span>(<span class="str">"safety"</span>)
    <span class="kw">if</span> <span class="str">"cost"</span> <span class="kw">not</span> <span class="kw">in</span> found <span class="kw">and</span> <span class="str">"compute"</span> <span class="kw">not</span> <span class="kw">in</span> found: gaps.<span class="fn">append</span>(<span class="str">"cost"</span>)
    <span class="kw">return</span> gaps

<span class="kw">def</span> <span class="fn">compose</span>(query, summaries):
    head = f<span class="str">"# Findings on: {query}\\n\\n"</span>
    body = <span class="str">""</span>
    <span class="kw">for</span> s <span class="kw">in</span> summaries:
        body += f<span class="str">"\\n## {s['id']}\\n"</span> + <span class="str">"\\n"</span>.<span class="fn">join</span>(<span class="str">"- "</span> + b <span class="kw">for</span> b <span class="kw">in</span> s[<span class="str">"bullets"</span>])
    <span class="kw">return</span> head + body

<span class="kw">def</span> <span class="fn">researcher</span>(s):
    seen, out = <span class="fn">set</span>(), []
    <span class="kw">for</span> q <span class="kw">in</span> [s[<span class="str">"query"</span>]] + <span class="fn">propose_subqueries</span>(s):
        <span class="kw">for</span> h <span class="kw">in</span> <span class="fn">search</span>(q):
            <span class="kw">if</span> h[<span class="str">"id"</span>] <span class="kw">not</span> <span class="kw">in</span> seen:
                seen.<span class="fn">add</span>(h[<span class="str">"id"</span>]); out.<span class="fn">append</span>(h)
    s[<span class="str">"sources"</span>] = out; s[<span class="str">"cost_usd"</span>] += <span class="num">0.01</span>; <span class="kw">return</span> s

<span class="kw">def</span> <span class="fn">summarizer</span>(s):
    s[<span class="str">"summaries"</span>] = [{<span class="str">"id"</span>: x[<span class="str">"id"</span>], <span class="str">"bullets"</span>: <span class="fn">extract_bullets</span>(x[<span class="str">"abstract"</span>])}
                       <span class="kw">for</span> x <span class="kw">in</span> s[<span class="str">"sources"</span>]]
    s[<span class="str">"cost_usd"</span>] += <span class="num">0.02</span> * <span class="fn">len</span>(s[<span class="str">"sources"</span>]); <span class="kw">return</span> s

<span class="kw">def</span> <span class="fn">critic</span>(s):
    s[<span class="str">"gaps"</span>] = <span class="fn">find_gaps</span>(s[<span class="str">"query"</span>], s[<span class="str">"summaries"</span>])
    s[<span class="str">"iter"</span>] += <span class="num">1</span>; s[<span class="str">"cost_usd"</span>] += <span class="num">0.03</span>; <span class="kw">return</span> s

<span class="kw">def</span> <span class="fn">writer</span>(s):
    s[<span class="str">"final"</span>] = <span class="fn">compose</span>(s[<span class="str">"query"</span>], s[<span class="str">"summaries"</span>])
    s[<span class="str">"cost_usd"</span>] += <span class="num">0.02</span>; <span class="kw">return</span> s

<span class="kw">def</span> <span class="fn">coordinator</span>(s, max_iter=<span class="num">2</span>):
    s = <span class="fn">researcher</span>(s); s = <span class="fn">summarizer</span>(s); s = <span class="fn">critic</span>(s)
    <span class="kw">while</span> s[<span class="str">"gaps"</span>] <span class="kw">and</span> s[<span class="str">"iter"</span>] &lt; max_iter:
        <span class="fn">print</span>(f<span class="str">"iter {s['iter']}: gaps={s['gaps']}, looping..."</span>)
        s = <span class="fn">researcher</span>(s); s = <span class="fn">summarizer</span>(s); s = <span class="fn">critic</span>(s)
    s = <span class="fn">writer</span>(s); <span class="kw">return</span> s

state = {<span class="str">"query"</span>: <span class="str">"RLHF code"</span>, <span class="str">"sources"</span>: [], <span class="str">"summaries"</span>: [],
         <span class="str">"gaps"</span>: [], <span class="str">"final"</span>: <span class="str">""</span>, <span class="str">"iter"</span>: <span class="num">0</span>, <span class="str">"cost_usd"</span>: <span class="num">0.0</span>}
out = <span class="fn">coordinator</span>(state)
<span class="fn">print</span>(<span class="str">"\\n=== FINAL ==="</span>)
<span class="fn">print</span>(out[<span class="str">"final"</span>][:<span class="num">400</span>])
<span class="fn">print</span>(<span class="str">"\\nsources:"</span>, [s[<span class="str">"id"</span>] <span class="kw">for</span> s <span class="kw">in</span> out[<span class="str">"sources"</span>]])
<span class="fn">print</span>(<span class="str">"iters:"</span>, out[<span class="str">"iter"</span>], <span class="str">" cost $:"</span>, <span class="fn">round</span>(out[<span class="str">"cost_usd"</span>], <span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Bir web-arama API'sini (Tavily, SerpAPI, Brave) agent'ın çağırabileceği bir tool olarak sarmalar — girdi sorgu string'i, çıktı \`{title, url, snippet}\` öğeleri listesi. 2) Tavily LangChain'in önerdiği varsayılan — LLM tüketimi için tasarlanmış, ham HTML yerine temiz metin snippet'ler döndürür. 3) Agent ne zaman arayacağına karar verir; birçok görev için döngünün erken evresinde tek arama, kalan akıl yürütmeyi temellendirmek için yeterlidir. 4) Arama sonuçlarını her zaman cache'leyin — geliştirme sırasında tekrarlı aynı sorgular kotayı hızla yakar.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Tüm Pipeline için Eval Suite</h2>
<p class="l-text">Bir araştırma asistanı için üç eval ekseni: <strong>kapsama</strong> (ilgili makaleleri atıfladı mı?), <strong>sadakat</strong> (final özet yalnızca kaynaklarca desteklenen iddiaları içeriyor mu?), <strong>maliyet</strong> (bütçenin altında mı?).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kapsama</div><div class="card-body">Atıflanan listede altın makale ID'lerinin Recall@K'sı.</div></div>
<div class="calc-card"><div class="card-title">Sadakat</div><div class="card-body">Final'daki her iddia en az bir kaynak maddesine izlenebilir olmalı (LLM-judge).</div></div>
<div class="calc-card"><div class="card-title">Tutarlılık</div><div class="card-body">Critic, writer çıktısını 0-3 kriter üzerinden yeniden derecelendirir.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Sorgu başına $ &lt; bütçe; kuyruk (P95) &lt; medyanın 3x'i.</div></div>
</div>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">4 sahte pipeline çalıştırması üzerinde kapsama + sadakat + maliyet hesapla. Regresyonu işaretle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

runs = [
    {<span class="str">"q"</span>: <span class="str">"RLHF code"</span>,    <span class="str">"cited"</span>: {<span class="str">"p1"</span>, <span class="str">"p2"</span>, <span class="str">"p4"</span>}, <span class="str">"gold"</span>: {<span class="str">"p1"</span>, <span class="str">"p3"</span>, <span class="str">"p4"</span>}, <span class="str">"faith"</span>: <span class="num">0.92</span>, <span class="str">"cost"</span>: <span class="num">0.18</span>},
    {<span class="str">"q"</span>: <span class="str">"DPO survey"</span>,   <span class="str">"cited"</span>: {<span class="str">"p2"</span>},             <span class="str">"gold"</span>: {<span class="str">"p2"</span>},             <span class="str">"faith"</span>: <span class="num">0.98</span>, <span class="str">"cost"</span>: <span class="num">0.05</span>},
    {<span class="str">"q"</span>: <span class="str">"eval pitfalls"</span>,<span class="str">"cited"</span>: {<span class="str">"p3"</span>, <span class="str">"p4"</span>},      <span class="str">"gold"</span>: {<span class="str">"p3"</span>},             <span class="str">"faith"</span>: <span class="num">0.85</span>, <span class="str">"cost"</span>: <span class="num">0.10</span>},
    {<span class="str">"q"</span>: <span class="str">"reward hack"</span>,  <span class="str">"cited"</span>: {<span class="str">"p4"</span>},             <span class="str">"gold"</span>: {<span class="str">"p4"</span>, <span class="str">"p1"</span>},       <span class="str">"faith"</span>: <span class="num">0.70</span>, <span class="str">"cost"</span>: <span class="num">0.42</span>},
]
rows = []
<span class="kw">for</span> r <span class="kw">in</span> runs:
    cov = <span class="fn">len</span>(r[<span class="str">"cited"</span>] &amp; r[<span class="str">"gold"</span>]) / <span class="fn">len</span>(r[<span class="str">"gold"</span>])
    rows.<span class="fn">append</span>({<span class="str">"q"</span>: r[<span class="str">"q"</span>], <span class="str">"coverage"</span>: <span class="fn">round</span>(cov, <span class="num">2</span>),
                 <span class="str">"faith"</span>: r[<span class="str">"faith"</span>], <span class="str">"cost"</span>: r[<span class="str">"cost"</span>]})
df = pd.<span class="fn">DataFrame</span>(rows)
df[<span class="str">"pass"</span>] = (df.coverage &gt;= <span class="num">0.5</span>) &amp; (df.faith &gt;= <span class="num">0.8</span>) &amp; (df.cost &lt; <span class="num">0.30</span>)
<span class="fn">print</span>(df)
<span class="fn">print</span>(<span class="str">"\\npass rate:"</span>, df[<span class="str">"pass"</span>].<span class="fn">mean</span>().<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. LangSmith'te Tracing &amp; Maliyet</h2>
<p class="l-text">Her düğümü <code>@traceable</code> ile sar. LangSmith span ağacını otomatik yakalar. Maliyet anotasyonları düğüme göre dilim almana izin verir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langsmith <span class="kw">import</span> traceable

<span class="ds">@traceable</span>(name=<span class="str">"researcher"</span>, run_type=<span class="str">"chain"</span>)
<span class="kw">def</span> <span class="fn">researcher</span>(state): ...

<span class="ds">@traceable</span>(name=<span class="str">"critic"</span>, run_type=<span class="str">"chain"</span>)
<span class="kw">def</span> <span class="fn">critic</span>(state): ...

<span class="cm"># Cost tags surface in dashboards</span>
<span class="kw">from</span> langsmith.run_helpers <span class="kw">import</span> get_current_run_tree
<span class="kw">def</span> <span class="fn">tag_cost</span>(usd):
    rt = <span class="fn">get_current_run_tree</span>()
    <span class="kw">if</span> rt: rt.<span class="fn">add_metadata</span>({<span class="str">"cost_usd"</span>: usd})</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) \`LANGCHAIN_TRACING_V2=true\` ve \`LANGCHAIN_API_KEY=...\` ayarlamak her Runnable çağrısını otomatik olarak LangSmith'e log'lar — kod değişikliği yok. 2) Her chain çalışması adım başına input, output, latency ve token maliyetini gösteren iç içe span'ler ağacı olur — uzun chain ve agent debug'ı için standart yol. 3) LangSmith dataset saklar ve üzerlerinde evaluator çalıştırır — prompt veya model değiştirdikçe regresyonu izlemek için \`evaluate()\` ile eşleştirin. 4) Self-hosted alternatifler: LangFuse (açık kaynak) ve Helicone (proxy-tabanlı) — aynı fikir, vendor lock-in yok.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Düğüm-başına bir span ağacını elle inşa eder ve maliyeti düğüme göre gruplar. LangSmith'in UI'sinde render edeceği şeyi gösterir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, pandas <span class="kw">as</span> pd

spans = [
    {<span class="str">"node"</span>: <span class="str">"researcher"</span>, <span class="str">"iter"</span>: <span class="num">1</span>, <span class="str">"ms"</span>: <span class="num">340</span>, <span class="str">"usd"</span>: <span class="num">0.010</span>},
    {<span class="str">"node"</span>: <span class="str">"summarizer"</span>, <span class="str">"iter"</span>: <span class="num">1</span>, <span class="str">"ms"</span>: <span class="num">820</span>, <span class="str">"usd"</span>: <span class="num">0.080</span>},
    {<span class="str">"node"</span>: <span class="str">"critic"</span>,     <span class="str">"iter"</span>: <span class="num">1</span>, <span class="str">"ms"</span>: <span class="num">410</span>, <span class="str">"usd"</span>: <span class="num">0.030</span>},
    {<span class="str">"node"</span>: <span class="str">"researcher"</span>, <span class="str">"iter"</span>: <span class="num">2</span>, <span class="str">"ms"</span>: <span class="num">280</span>, <span class="str">"usd"</span>: <span class="num">0.010</span>},
    {<span class="str">"node"</span>: <span class="str">"summarizer"</span>, <span class="str">"iter"</span>: <span class="num">2</span>, <span class="str">"ms"</span>: <span class="num">520</span>, <span class="str">"usd"</span>: <span class="num">0.040</span>},
    {<span class="str">"node"</span>: <span class="str">"critic"</span>,     <span class="str">"iter"</span>: <span class="num">2</span>, <span class="str">"ms"</span>: <span class="num">390</span>, <span class="str">"usd"</span>: <span class="num">0.030</span>},
    {<span class="str">"node"</span>: <span class="str">"writer"</span>,     <span class="str">"iter"</span>: <span class="num">2</span>, <span class="str">"ms"</span>: <span class="num">610</span>, <span class="str">"usd"</span>: <span class="num">0.020</span>},
]
df = pd.<span class="fn">DataFrame</span>(spans)
<span class="fn">print</span>(<span class="str">"per-node cost:"</span>)
<span class="fn">print</span>(df.<span class="fn">groupby</span>(<span class="str">"node"</span>)[[<span class="str">"ms"</span>, <span class="str">"usd"</span>]].<span class="fn">sum</span>().<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"\\ntotals: latency"</span>, df.ms.<span class="fn">sum</span>(), <span class="str">"ms, cost $"</span>, df.usd.<span class="fn">sum</span>().<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Production Sertleştirme</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bütçe sınırı</div><div class="card-body">Coordinator cost_usd &gt; tavan ise iptal eder.</div></div>
<div class="calc-card"><div class="card-title">İterasyon sınırı</div><div class="card-body">Maks 3 critic döngüsü; aksi halde writer'ı zorla.</div></div>
<div class="calc-card"><div class="card-title">Düğüm-başına retry</div><div class="card-body">Geçici LLM hatalarında üstel geri çekilme.</div></div>
<div class="calc-card"><div class="card-title">Fallback model</div><div class="card-body">Critic için Sonnet, 429 alırsa Haiku'ya düşür.</div></div>
<div class="calc-card"><div class="card-title">HITL kapısı</div><div class="card-body">Sorgu hassas bir alandaysa (yasal, tıbbi), writer taslağının insan incelemesini iste.</div></div>
<div class="calc-card"><div class="card-title">Audit logu</div><div class="card-body">Çalıştırma başına final + kaynaklar + maliyet hash-zinciri.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">coordinator_prod</span>(state, budget=<span class="num">0.50</span>, max_iter=<span class="num">3</span>):
    state = <span class="fn">researcher</span>(state); state = <span class="fn">summarizer</span>(state); state = <span class="fn">critic</span>(state)
    <span class="kw">while</span> state[<span class="str">"gaps"</span>] <span class="kw">and</span> state[<span class="str">"iter"</span>] &lt; max_iter:
        <span class="kw">if</span> state[<span class="str">"cost_usd"</span>] &gt; budget:
            <span class="fn">print</span>(<span class="str">"BUDGET HIT — writing with what we have"</span>)
            <span class="kw">break</span>
        state = <span class="fn">researcher</span>(state); state = <span class="fn">summarizer</span>(state); state = <span class="fn">critic</span>(state)
    <span class="kw">return</span> <span class="fn">writer</span>(state)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Gerekli import'ları ve bileşen örneklerini kurar — tipik olarak bir model sarmalayıcısı, isteğe bağlı prompt ve örneğin ihtiyaç duyduğu yardımcılar. 2) Bileşenleri LCEL'in \`|\` operatörüyle (veya Pyodide demosu için manuel döngü / class ile) tek bir Runnable'a bağlar. 3) Ortaya çıkan nesneyi \`.invoke(...)\` (veya döngünün giriş noktası) ile çağırır — üretimde göreceğiniz örnek çıktıyı üretir. 4) Yapısal şekil — kompoze et, sonra çağır — model gerçek bir sağlayıcı, bir mock veya küçük bir tarayıcı-içi stand-in olsa bile aynıdır.</p>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Deployment Kontrol Listesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">CI eval kapısı</div><div class="card-body">50 test sorgusunda her gece çalıştır. Geçme oranı &gt;%2 düşerse merge'i engelle.</div></div>
<div class="calc-card"><div class="card-title">Canary rollout</div><div class="card-body">Yeni agent sürümüne %5 trafik, 24 saat trace metriklerini izle.</div></div>
<div class="calc-card"><div class="card-title">Maliyet panosu</div><div class="card-body">Düğüm-başına, gün-başına, kullanıcı-başına. Aylık bütçenin %80'inde uyar.</div></div>
<div class="calc-card"><div class="card-title">Latency SLO</div><div class="card-body">Uçtan-uca pipeline için P95 &lt; 30s. İhlalde page at.</div></div>
<div class="calc-card"><div class="card-title">Rollback</div><div class="card-body">Önceki agent sürümüne + prompt setine tek-tıkla geri dönüş.</div></div>
<div class="calc-card"><div class="card-title">Olay runbook</div><div class="card-body">Trace ID → kullanıcı → sorgu → maliyet → düzeltme yolu belgelenmiş.</div></div>
</div>
<div class="calc-highlight">Çok-agent bir pipeline yalnızca en zayıf düğümü kadar production-hazırdır. Her agent'ı bağımsız değerlendir, sonra kompozisyonu değerlendir.</div>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Capstone Tamamlama &amp; Buradan Sonra Nereye</h2>
<p class="l-text">Artık tam bir agentik sistemin var: planlama (L1-L3), araçlar (L4-L5), hafıza (L6), RAG (L7), çok-agent (L8-L9), eval (L10), production (L11) ve çalışan bir çok-düğümlü araştırma asistanı (L12). Her ekseni genişletebilirsin:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Daha çok düğüm</div><div class="card-body">Bir fact-checker, çevirmen veya görselleştirici düğüm ekle.</div></div>
<div class="calc-card"><div class="card-title">RL ince ayar</div><div class="card-body">Yörünge-hakem puanlarını ödül olarak kullan (RLAIF).</div></div>
<div class="calc-card"><div class="card-title">Canlı veri</div><div class="card-body">Sahte CORPUS'u arXiv API + vektör DB ile değiştir.</div></div>
<div class="calc-card"><div class="card-title">Async paralel</div><div class="card-body">Tüm kaynakları asyncio.gather ile eşzamanlı özetle.</div></div>
</div>
<p class="l-text">Production-seviyesi LLM agent'ları modeller değildir — sistemlerdir. State, trace'ler, maliyetler, eval'ler ve insan-döngüde'ler. Sistemi inşa et, model değiştirilebilir hale gelir. Bu track'in gerçek dersi budur.</p>
</div>`
};
