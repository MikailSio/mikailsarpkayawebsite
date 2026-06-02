window.AGENTS_L7 = {

en: `<p class="l-text"><strong>A single LLM call cannot solve a multi-step problem reliably.</strong> Ask GPT-4 to "build me a Snake game in Python, debug it, and ship it to a Docker container" in one prompt and you get a hallucinated mishmash. The same LLM, given the same task as a <em>plan</em> with one step in context at a time, succeeds. The bottleneck is not raw intelligence — it is working memory and the gap between "thinking" and "acting".</p>

<p class="l-text">This lesson is about the planner layer of agent architectures. We cover Plan-and-Execute (LangChain's pattern, an explicit Planner that emits a JSON list of steps + an Executor that runs them), Tree of Thoughts (Yao et al, NeurIPS 2023 — exploring multiple reasoning paths and pruning bad branches), ReWOO (Reasoning WithOut Observation — decoupling tool calls from reasoning to cut tokens 5x), hierarchical Manager+Worker setups, and self-reflection loops where the agent critiques its own output and rewrites. By the end you will know <em>which planner to reach for</em> when ReAct (Lesson 5) is too myopic.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement Plan-and-Execute: a Planner that emits steps and an Executor that runs them in sequence</li>
<li>Build a Tree of Thoughts search with a heuristic value function for pruning bad branches</li>
<li>Apply ReWOO to cut LLM calls roughly 5x by separating planning from observation</li>
<li>Wire a Manager that decomposes work and dispatches to specialized Worker agents</li>
<li>Add a self-reflection / self-critique loop so the agent rewrites weak answers</li>
<li>Pick the right planner per task: linear vs branching vs hierarchical vs reflective</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Planners Beat Single-Step Agents</h2>

<p class="l-text">A ReAct agent picks one action at a time, observes the result, and picks the next action. This works for short horizons (3-5 steps) but degrades fast: errors compound, the model loses track of the original goal, and tool budget explodes. A planner separates the long-horizon thinking ("decompose into 8 steps") from the short-horizon execution ("run step 3, append result to memory").</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ReAct (Lesson 5)</div><div class="card-body">One Thought → Action → Observation per turn. Reactive, myopic, easy to debug. Best for &lt;5 steps.</div></div>
<div class="calc-card"><div class="card-title">Plan-and-Execute</div><div class="card-body">Planner writes a full step list once, Executor runs each step. Cuts thinking tokens 60-80%.</div></div>
<div class="calc-card"><div class="card-title">Tree of Thoughts</div><div class="card-body">Explores N candidate next-steps, scores them, prunes losers. For problems with backtracking.</div></div>
<div class="calc-card"><div class="card-title">ReWOO</div><div class="card-body">Plan + tool calls + final solver, no interleaved reasoning. Cheapest tokens, no replanning.</div></div>
<div class="calc-card"><div class="card-title">Hierarchical</div><div class="card-body">Manager decomposes, Workers specialize. Scales to teams of 5-50 agents.</div></div>
<div class="calc-card"><div class="card-title">Reflective</div><div class="card-body">Self-critique loop: produce → critique → revise. Boosts quality on writing/code tasks.</div></div>
</div>

<div class="calc-highlight"><strong>The mental model:</strong> ReAct is a debugger stepping line-by-line. Plan-and-Execute is a project manager writing a Gantt chart. Tree of Thoughts is a chess engine searching the move tree. Pick by the shape of your task — not by hype.</div>

<p class="l-text">Empirically, on the HotpotQA multi-hop benchmark, Plan-and-Execute beats ReAct by 7-12 points exact match while using <em>fewer</em> total LLM calls because the executor steps can use a smaller cheap model (Haiku, GPT-4o-mini) once the plan is written by a strong planner (Opus, GPT-4).</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Plan-and-Execute: The LangChain Pattern</h2>

<p class="l-text">Plan-and-Execute (popularized by the LangChain Plan-and-Execute agent and the BabyAGI lineage in 2023) splits the agent loop into two roles. The <strong>Planner</strong> sees the user goal, available tools, and emits a JSON list of steps. The <strong>Executor</strong> takes one step at a time, picks the tool, runs it, appends the result to a scratchpad, and moves on. Optionally a <strong>Replanner</strong> revisits the plan after each step in case results invalidate later steps.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install langchain langchain-openai langgraph</span>
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langgraph.prebuilt <span class="kw">import</span> create_react_agent
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field
<span class="kw">from</span> typing <span class="kw">import</span> List

<span class="cm"># 1) The Planner: emits a typed list of steps</span>
<span class="kw">class</span> <span class="ty">Plan</span>(BaseModel):
    steps: List[str] = <span class="fn">Field</span>(description=<span class="str">"Ordered steps to solve the task"</span>)

planner_prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"For the given objective, come up with a step by step plan. "</span>
                <span class="str">"Each step should be one tool call or one reasoning step. Be precise."</span>),
    (<span class="str">"user"</span>, <span class="str">"{objective}"</span>),
])
planner = planner_prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>, temperature=<span class="num">0</span>).<span class="fn">with_structured_output</span>(Plan)

<span class="cm"># 2) The Executor: a small ReAct agent that runs ONE step at a time</span>
executor = <span class="fn">create_react_agent</span>(
    <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>),
    tools=[search_tool, calculator_tool, sql_tool],
)

<span class="cm"># 3) The Replanner: revisits the plan after each step's output</span>
<span class="kw">class</span> <span class="ty">PlanOrFinish</span>(BaseModel):
    next_steps: List[str] | <span class="kw">None</span> = <span class="kw">None</span>
    final_answer: str | <span class="kw">None</span> = <span class="kw">None</span>

replanner_prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Given the original plan and what we have done so far, "</span>
                <span class="str">"return either an updated remaining-steps list, OR a final answer if done."</span>),
    (<span class="str">"user"</span>, <span class="str">"Objective: {objective}\nPlan: {plan}\nDone so far: {past_steps}"</span>),
])
replanner = replanner_prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>).<span class="fn">with_structured_output</span>(PlanOrFinish)

<span class="cm"># 4) Driver loop</span>
<span class="kw">def</span> <span class="fn">run</span>(objective):
    plan = planner.<span class="fn">invoke</span>({<span class="str">"objective"</span>: objective})
    past = []
    <span class="kw">while</span> plan.steps:
        step = plan.steps[<span class="num">0</span>]
        result = executor.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [(<span class="str">"user"</span>, step)]})
        past.<span class="fn">append</span>((step, result[<span class="str">"messages"</span>][-<span class="num">1</span>].content))
        decision = replanner.<span class="fn">invoke</span>({<span class="str">"objective"</span>: objective, <span class="str">"plan"</span>: plan.steps, <span class="str">"past_steps"</span>: past})
        <span class="kw">if</span> decision.final_answer:
            <span class="kw">return</span> decision.final_answer
        plan.steps = decision.next_steps</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <em>planner</em> Runnable is invoked once with <code>{"objective": objective}</code> and returns a <code>Plan</code> Pydantic object with an ordered <code>steps</code> list. 2) The <em>executor</em> is a tiny <code>create_react_agent</code> over three tools — for every step it runs ReAct on that single subtask and we append the (step, answer) pair to <code>past</code>. 3) After every step the <em>replanner</em> reads the objective, the remaining plan, and everything we have already done, then returns either a fresh <code>next_steps</code> list (re-plan) or a <code>final_answer</code> (done). 4) The loop terminates as soon as <code>decision.final_answer</code> is set; otherwise <code>plan.steps</code> is replaced with the replanner's update — this is what makes Plan-and-Execute resilient to surprises mid-run.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A mock Plan-and-Execute loop: a hand-written planner returns a step list, the executor maps each step to a tool function, and a scratchpad accumulates results.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re
<span class="kw">def</span> <span class="fn">planner</span>(objective):
    <span class="kw">return</span> [
        (<span class="str">'search'</span>, <span class="str">'Tesla 2023 revenue'</span>),
        (<span class="str">'search'</span>, <span class="str">'Ford 2023 revenue'</span>),
        (<span class="str">'calc'</span>,   <span class="str">'tesla / ford'</span>),
        (<span class="str">'answer'</span>, <span class="str">'ratio'</span>)
    ]
DB = {<span class="str">'Tesla 2023 revenue'</span>: 96_773, <span class="str">'Ford 2023 revenue'</span>: 176_191}
<span class="kw">def</span> <span class="fn">tool</span>(kind, arg, scratch):
    <span class="kw">if</span> kind == <span class="str">'search'</span>: <span class="kw">return</span> DB.<span class="fn">get</span>(arg, <span class="num">0</span>)
    <span class="kw">if</span> kind == <span class="str">'calc'</span>:
        <span class="kw">return</span> <span class="fn">round</span>(scratch[<span class="num">0</span>] / scratch[<span class="num">1</span>], <span class="num">3</span>)
    <span class="kw">if</span> kind == <span class="str">'answer'</span>:
        <span class="kw">return</span> f<span class="str">'Tesla revenue is {scratch[-1]}x Ford'</span>
plan = <span class="fn">planner</span>(<span class="str">'Compare Tesla vs Ford 2023 revenue'</span>)
scratch = []
<span class="kw">for</span> kind, arg <span class="kw">in</span> plan:
    out = <span class="fn">tool</span>(kind, arg, scratch)
    scratch.<span class="fn">append</span>(out)
    <span class="fn">print</span>(f<span class="str">'  step {kind:7s} {arg:30s} -> {out}'</span>)
<span class="fn">print</span>(<span class="str">'FINAL:'</span>, scratch[-<span class="num">1</span>])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>planner(objective)</code> stands in for an LLM call — it returns a hard-coded 4-step list of <code>(tool_kind, arg)</code> tuples that walks search → search → calc → answer. 2) <code>DB</code> + the <code>tool</code> dispatcher imitate the executor: <code>search</code> hits a canned lookup, <code>calc</code> divides the first two values from <code>scratch</code>, <code>answer</code> formats the final ratio. 3) The driver loop applies each step in order, appends the output to <code>scratch</code>, and prints a one-line trace so you can see the plan progress. 4) The terminal <code>FINAL: ...</code> demonstrates the planner/executor separation: the plan was decided once up front, then executed deterministically — no LLM was consulted during the loop, exactly the property a real Plan-and-Execute system relies on for cost control.</p>
</div>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tree of Thoughts (Yao et al, 2023)</h2>

<p class="l-text">Tree of Thoughts (ToT, Yao et al, NeurIPS 2023) generalizes Chain of Thought from a linear sequence to a tree. At each "thought node" the agent generates K candidate next-thoughts, scores each by a value function (a separate LLM call asking "how promising is this branch on a 1-10 scale?"), and expands only the top-N branches. It is BFS or DFS in thought-space.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CoT</div><div class="card-body">Linear: thought_1 → thought_2 → answer. One path. Cheap, but no recovery from a bad early step.</div></div>
<div class="calc-card"><div class="card-title">CoT-SC</div><div class="card-body">Self-Consistency: sample N independent CoT chains, vote on the answer. Helps but no exploration.</div></div>
<div class="calc-card"><div class="card-title">ToT-BFS</div><div class="card-body">Expand all K children, score, keep top N, repeat. Wide search. Best when answers are short.</div></div>
<div class="calc-card"><div class="card-title">ToT-DFS</div><div class="card-body">Go deep on best child, backtrack on dead ends. Best for problems with verifiable terminal states.</div></div>
</div>

<p class="l-text">In the original paper, ToT pushed Game of 24 success from 4% (vanilla CoT with GPT-4) to 74%. The cost: 5-100x more LLM calls per problem, since you sample many candidates and score each.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Tree of Thoughts skeleton for Game of 24:</span>
<span class="cm"># Given 4 numbers, reach 24 using +, -, *, /</span>
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>, temperature=<span class="num">0.7</span>)

<span class="kw">def</span> <span class="fn">propose</span>(state, k=<span class="num">5</span>):
    <span class="cm"># Ask LLM for k candidate next moves</span>
    prompt = f<span class="str">"Numbers left: {state}. Propose {k} possible next operations (one per line)."</span>
    <span class="kw">return</span> [line.<span class="fn">strip</span>() <span class="kw">for</span> line <span class="kw">in</span> llm.<span class="fn">invoke</span>(prompt).content.<span class="fn">split</span>(<span class="str">"\n"</span>) <span class="kw">if</span> line.<span class="fn">strip</span>()][:k]

<span class="kw">def</span> <span class="fn">value</span>(state):
    <span class="cm"># Heuristic LLM evaluator: 1=dead, 5=maybe, 10=sure win</span>
    prompt = f<span class="str">"Can numbers {state} reach 24 with +-*/? Reply with a single int 1-10."</span>
    <span class="kw">try</span>: <span class="kw">return</span> <span class="fn">int</span>(llm.<span class="fn">invoke</span>(prompt).content.<span class="fn">strip</span>())
    <span class="kw">except</span>: <span class="kw">return</span> <span class="num">1</span>

<span class="kw">def</span> <span class="fn">tot_bfs</span>(start, depth=<span class="num">3</span>, beam=<span class="num">3</span>):
    frontier = [start]
    <span class="kw">for</span> d <span class="kw">in</span> <span class="fn">range</span>(depth):
        candidates = []
        <span class="kw">for</span> state <span class="kw">in</span> frontier:
            <span class="kw">for</span> move <span class="kw">in</span> <span class="fn">propose</span>(state, k=<span class="num">5</span>):
                new_state = <span class="fn">apply_move</span>(state, move)  <span class="cm"># your sim</span>
                candidates.<span class="fn">append</span>((<span class="fn">value</span>(new_state), new_state))
        <span class="cm"># Keep top-beam by value (prune the rest)</span>
        candidates.<span class="fn">sort</span>(reverse=<span class="kw">True</span>)
        frontier = [s <span class="kw">for</span> _, s <span class="kw">in</span> candidates[:beam]]
    <span class="kw">return</span> frontier[<span class="num">0</span>]</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>propose(state, k=5)</code> calls the LLM with temperature 0.7 asking for k candidate next moves — each newline becomes one branch in the thought tree. 2) <code>value(state)</code> is a second LLM call that scores any state 1–10 ("how promising is this branch?") — this is the cheap value function that replaces a brute-force solver. 3) <code>tot_bfs(start, depth, beam)</code> does the classic beam search: at every depth it expands every state in the frontier with k proposals, scores each via <code>value</code>, sorts descending, and keeps only the top <code>beam</code> survivors. 4) The output is the highest-scoring leaf at <code>depth</code> — exactly the structure that took Game of 24 from 4% to 74% in the ToT paper, at the cost of dozens of LLM calls per problem.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A real Game of 24 ToT search using a brute force evaluator instead of an LLM, beam=3 BFS over the operation tree.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> itertools <span class="kw">import</span> combinations
<span class="kw">def</span> <span class="fn">can_reach_24</span>(nums, eps=<span class="num">1e-3</span>):
    <span class="kw">if</span> <span class="fn">len</span>(nums) == <span class="num">1</span>: <span class="kw">return</span> <span class="fn">abs</span>(nums[<span class="num">0</span>] - <span class="num">24</span>) &lt; eps
    <span class="kw">for</span> i, j <span class="kw">in</span> <span class="fn">combinations</span>(<span class="fn">range</span>(<span class="fn">len</span>(nums)), <span class="num">2</span>):
        a, b = nums[i], nums[j]
        rest = [nums[k] <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(nums)) <span class="kw">if</span> k != i <span class="kw">and</span> k != j]
        ops = [a+b, a-b, b-a, a*b] + ([a/b] <span class="kw">if</span> b <span class="kw">else</span> []) + ([b/a] <span class="kw">if</span> a <span class="kw">else</span> [])
        <span class="kw">for</span> r <span class="kw">in</span> ops:
            <span class="kw">if</span> <span class="fn">can_reach_24</span>(rest + [r]): <span class="kw">return</span> <span class="kw">True</span>
    <span class="kw">return</span> <span class="kw">False</span>
<span class="kw">def</span> <span class="fn">value_fn</span>(state): <span class="kw">return</span> <span class="num">10</span> <span class="kw">if</span> <span class="fn">can_reach_24</span>(state) <span class="kw">else</span> <span class="num">1</span>
<span class="kw">def</span> <span class="fn">expand</span>(state):
    out = []
    <span class="kw">for</span> i, j <span class="kw">in</span> <span class="fn">combinations</span>(<span class="fn">range</span>(<span class="fn">len</span>(state)), <span class="num">2</span>):
        a, b = state[i], state[j]
        rest = [state[k] <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(state)) <span class="kw">if</span> k != i <span class="kw">and</span> k != j]
        <span class="kw">for</span> r, name <span class="kw">in</span> [(a+b,<span class="str">'+'</span>), (a-b,<span class="str">'-'</span>), (a*b,<span class="str">'*'</span>)]:
            out.<span class="fn">append</span>(rest + [r])
    <span class="kw">return</span> out
problems = [[<span class="num">3</span>,<span class="num">3</span>,<span class="num">8</span>,<span class="num">8</span>], [<span class="num">4</span>,<span class="num">4</span>,<span class="num">7</span>,<span class="num">7</span>], [<span class="num">1</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">6</span>]]
<span class="kw">for</span> p <span class="kw">in</span> problems:
    frontier = [p]
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
        scored = <span class="fn">sorted</span>([(<span class="fn">value_fn</span>(s), s) <span class="kw">for</span> st <span class="kw">in</span> frontier <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">expand</span>(st)], reverse=<span class="kw">True</span>)
        frontier = [s <span class="kw">for</span> _, s <span class="kw">in</span> scored[:<span class="num">3</span>]]
    solved = <span class="fn">any</span>(<span class="fn">value_fn</span>(s) == <span class="num">10</span> <span class="kw">for</span> s <span class="kw">in</span> frontier)
    <span class="fn">print</span>(f<span class="str">'  {p} -> {<span class="str">"SOLVED"</span> if solved else <span class="str">"no path found"</span>}'</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>can_reach_24(nums)</code> is the deterministic value function — it recursively tries every binary combination of <code>+, -, *, /</code> over the remaining numbers and returns True if some sequence lands within <code>eps</code> of 24. 2) <code>value_fn(state)</code> wraps that into the ToT scoring API (10 if reachable, 1 otherwise); <code>expand(state)</code> generates every (i, j, op) child state for the next layer. 3) The outer loop iterates three Game-of-24 problems; for each, the BFS expands the frontier, scores every child with <code>value_fn</code>, sorts descending, and keeps the top-3 survivors as the new frontier — same beam-search shape as the LLM version above. 4) After 3 depths the printout marks each problem SOLVED or "no path found" based on whether any surviving leaf scores 10 — solving the search analytically (instead of with LLM calls) shows the same algorithmic backbone the paper uses.</p>
</div>

<div class="calc-highlight"><strong>When to reach for ToT:</strong> the answer space is small enough to search (puzzle, code completion with verifier, math), AND a cheap value function exists (test runner, brute checker, simulator). For open-ended writing, ToT is overkill — use Plan-and-Execute or self-reflection instead.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ReWOO: Reasoning Without Observation</h2>

<p class="l-text">ReWOO (Xu et al, 2023) noticed that ReAct re-injects the entire history into the LLM at every step. If your task has 6 tool calls, the same prompt is sent 6 times with growing context — costly and slow. ReWOO splits the agent into three roles: <strong>Planner</strong> emits the plan with placeholder variables for tool outputs (<code>#E1</code>, <code>#E2</code>, ...), <strong>Worker</strong> executes each tool call independently (no LLM in the loop), and <strong>Solver</strong> sees the plan + all observations once and writes the final answer.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># ReWOO: 3 LLM calls total, regardless of number of tool calls</span>
PLAN_PROMPT = <span class="str">"""For the task, write a plan as numbered steps.
Each step is: Plan: ... \\n#E_n = Tool[input that may reference previous #E_k]
Tools: Search[query], Calc[expr], LLM[prompt]
Task: {task}"""</span>

<span class="kw">def</span> <span class="fn">plan</span>(task):
    <span class="kw">return</span> llm.<span class="fn">invoke</span>(PLAN_PROMPT.<span class="fn">format</span>(task=task)).content

<span class="kw">def</span> <span class="fn">worker</span>(plan_text):
    <span class="cm"># Parse #E_n = Tool[args] lines, execute, substitute back</span>
    <span class="kw">import</span> re
    evidence = {}
    <span class="kw">for</span> line <span class="kw">in</span> plan_text.<span class="fn">split</span>(<span class="str">"\n"</span>):
        m = re.<span class="fn">match</span>(<span class="str">r"#E(\\d+)\\s*=\\s*(\\w+)\\[(.+)\\]"</span>, line)
        <span class="kw">if</span> <span class="kw">not</span> m: <span class="kw">continue</span>
        eid, tool_name, arg = m.<span class="fn">groups</span>()
        <span class="cm"># Substitute previous evidence into arg</span>
        <span class="kw">for</span> k, v <span class="kw">in</span> evidence.<span class="fn">items</span>():
            arg = arg.<span class="fn">replace</span>(f<span class="str">"#E{k}"</span>, <span class="fn">str</span>(v))
        evidence[eid] = TOOLS[tool_name](arg)  <span class="cm"># pure function, no LLM</span>
    <span class="kw">return</span> evidence

SOLVE_PROMPT = <span class="str">"Task: {task}\\nPlan: {plan}\\nEvidence: {ev}\\nFinal answer:"</span>
<span class="kw">def</span> <span class="fn">solve</span>(task, plan_text, evidence):
    <span class="kw">return</span> llm.<span class="fn">invoke</span>(SOLVE_PROMPT.<span class="fn">format</span>(task=task, plan=plan_text, ev=evidence)).content

<span class="cm"># Total LLM calls: 1 (plan) + 0 in worker + 1 (solve) = 2 calls for any task length</span>
<span class="cm"># vs ReAct: O(num_tool_calls) calls with growing context</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>plan(task)</code> makes one LLM call with <code>PLAN_PROMPT</code> — the model is told to emit numbered <code>Plan:</code> lines plus <code>#E_n = Tool[args]</code> slots where <code>args</code> can reference earlier <code>#E_k</code> placeholders. 2) <code>worker(plan_text)</code> never touches an LLM: it parses each <code>#E_n = Tool[args]</code> line with the regex, replaces any prior <code>#E_k</code> tokens in <code>args</code> with their resolved values, then runs <code>TOOLS[tool_name](arg)</code> and stores the output in <code>evidence[eid]</code>. 3) <code>solve(task, plan_text, evidence)</code> makes the second and final LLM call, handing the model the original task plus the full plan and observation map so it can write the answer in one shot. 4) Comments at the bottom spell out the headline: 2 LLM calls regardless of tool-call count, vs. O(num_tool_calls) for ReAct with full-context replay — the source of ReWOO's 5x token savings on HotpotQA.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Working ReWOO with a hand-rolled planner: substitution of #E1 #E2 evidence into later tool calls.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re
plan_text = <span class="str">"""Plan: get Tesla revenue
#E1 = Search[Tesla 2023 revenue]
Plan: get Ford revenue
#E2 = Search[Ford 2023 revenue]
Plan: compute ratio
#E3 = Calc[#E1 / #E2]"""</span>
TOOLS = {
    <span class="str">"Search"</span>: <span class="kw">lambda</span> q: {<span class="str">"Tesla 2023 revenue"</span>: <span class="num">96773</span>, <span class="str">"Ford 2023 revenue"</span>: <span class="num">176191</span>}.<span class="fn">get</span>(q, <span class="num">0</span>),
    <span class="str">"Calc"</span>:   <span class="kw">lambda</span> expr: <span class="fn">round</span>(<span class="fn">eval</span>(expr), <span class="num">3</span>),
}
evidence = {}
llm_calls = <span class="num">1</span>  <span class="cm"># the plan call</span>
<span class="kw">for</span> line <span class="kw">in</span> plan_text.<span class="fn">split</span>(<span class="str">"\\n"</span>):
    m = re.<span class="fn">match</span>(r<span class="str">"#E(\\d+)\\s*=\\s*(\\w+)\\[(.+)\\]"</span>, line)
    <span class="kw">if</span> <span class="kw">not</span> m: <span class="kw">continue</span>
    eid, tool, arg = m.<span class="fn">groups</span>()
    <span class="kw">for</span> k, v <span class="kw">in</span> evidence.<span class="fn">items</span>():
        arg = arg.<span class="fn">replace</span>(f<span class="str">"#E{k}"</span>, <span class="fn">str</span>(v))
    evidence[eid] = TOOLS[tool](arg)
    <span class="fn">print</span>(f<span class="str">"  #E{eid} = {tool}[{arg}] -&gt; {evidence[eid]}"</span>)
llm_calls += <span class="num">1</span>  <span class="cm"># the solve call</span>
<span class="fn">print</span>(f<span class="str">"Total LLM calls: {llm_calls} (vs ~6 for ReAct on the same task)"</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>plan_text</code> holds the planner's output as a multi-line string — three <code>Plan:</code> lines interleaved with three <code>#E1</code>/<code>#E2</code>/<code>#E3</code> tool-call slots, exactly the shape a real planner LLM would emit. 2) <code>TOOLS</code> maps the tool names referenced in the plan to lambdas — <code>Search</code> looks up canned revenue figures, <code>Calc</code> evaluates an arithmetic expression. 3) The loop walks every line, runs the regex <code>#E(\d+)\s*=\s*(\w+)\[(.+)\]</code> to capture (id, tool, arg), substitutes any prior <code>#Ek</code> placeholders inside <code>arg</code> with the actual evidence value, then dispatches the tool and stores its output in <code>evidence[eid]</code>. 4) Counting bumps prove the headline number: <em>one</em> plan call plus <em>one</em> solve call equals 2 total LLM calls — the worker loop runs entirely without the model, which is why ReWOO ships 5x fewer tokens than ReAct on the same task.</p>
</div>

<div class="calc-highlight"><strong>The savings:</strong> ReWOO reports 5x fewer tokens than ReAct on HotpotQA with no quality loss. The trade: ReWOO cannot recover from a bad observation midway (the plan is fixed). For tasks with predictable tool sequences (search→search→math→answer), ReWOO is the cheapest planner. For tasks where mid-execution errors require replanning, use Plan-and-Execute.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Hierarchical Agents: Manager + Workers</h2>

<p class="l-text">When a task crosses domains (research a topic, write a report, format it as LaTeX, ship a PDF), one agent with all the tools becomes confused — it sees too many options at every step. The fix: a <strong>Manager</strong> agent decomposes the task and dispatches each subtask to a <strong>Worker</strong> agent that has only the tools relevant to its specialty. The manager owns the plan; the worker owns the execution.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Manager</div><div class="card-body">Sees user goal + roster of workers. Emits dispatch calls. Does no real work itself.</div></div>
<div class="calc-card"><div class="card-title">Researcher</div><div class="card-body">Tools: web_search, arxiv, wikipedia. Returns a citation-rich brief.</div></div>
<div class="calc-card"><div class="card-title">Writer</div><div class="card-body">Tools: none (pure LLM). Takes a brief, returns prose. Uses a strong model.</div></div>
<div class="calc-card"><div class="card-title">Coder</div><div class="card-body">Tools: python_exec, file_io. Implements pseudocode → working code.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LangGraph hierarchical pattern</span>
<span class="kw">from</span> langgraph.graph <span class="kw">import</span> StateGraph
<span class="kw">from</span> langgraph.prebuilt <span class="kw">import</span> create_react_agent

researcher = <span class="fn">create_react_agent</span>(strong_llm, tools=[search, arxiv])
writer     = <span class="fn">create_react_agent</span>(strong_llm, tools=[])
coder      = <span class="fn">create_react_agent</span>(strong_llm, tools=[python_exec, file_io])

WORKERS = {<span class="str">"researcher"</span>: researcher, <span class="str">"writer"</span>: writer, <span class="str">"coder"</span>: coder}

<span class="kw">def</span> <span class="fn">manager_node</span>(state):
    <span class="cm"># Manager decides which worker to call next, given progress so far</span>
    decision = manager_llm.<span class="fn">invoke</span>(
        f<span class="str">"Goal: {state['goal']}\nDone: {state['history']}\n"</span>
        f<span class="str">"Pick next worker from {<span class="fn">list</span>(WORKERS)}, or 'finish' if done."</span>
    )
    <span class="kw">return</span> {<span class="str">"next_worker"</span>: decision.content.<span class="fn">strip</span>()}

<span class="kw">def</span> <span class="fn">worker_node</span>(state):
    w = WORKERS[state[<span class="str">"next_worker"</span>]]
    out = w.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [(<span class="str">"user"</span>, state[<span class="str">"goal"</span>])]})
    state[<span class="str">"history"</span>].<span class="fn">append</span>((state[<span class="str">"next_worker"</span>], out))
    <span class="kw">return</span> state

graph = <span class="fn">StateGraph</span>(<span class="fn">dict</span>)
graph.<span class="fn">add_node</span>(<span class="str">"manager"</span>, manager_node)
graph.<span class="fn">add_node</span>(<span class="str">"worker"</span>, worker_node)
graph.<span class="fn">add_conditional_edges</span>(<span class="str">"manager"</span>, <span class="kw">lambda</span> s: <span class="str">"finish"</span> <span class="kw">if</span> s[<span class="str">"next_worker"</span>]==<span class="str">"finish"</span> <span class="kw">else</span> <span class="str">"worker"</span>)
graph.<span class="fn">add_edge</span>(<span class="str">"worker"</span>, <span class="str">"manager"</span>)
graph.<span class="fn">set_entry_point</span>(<span class="str">"manager"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three specialised <code>create_react_agent</code> instances are built, each scoped to a tiny tool list — researcher gets search/arxiv, writer gets nothing, coder gets python_exec/file_io. 2) <code>WORKERS</code> is a dispatch dict so the manager picks a worker by name; <code>manager_node</code> asks <code>manager_llm</code> which name to call next given the goal and history, and writes the choice into <code>state["next_worker"]</code>. 3) <code>worker_node</code> invokes the chosen agent on the goal, appends the (worker, output) pair to history, and returns the updated state — the worker only sees its own tools, never the others'. 4) The graph wires <code>manager → worker → manager</code> with a conditional edge that exits when the manager picks <code>"finish"</code> — a classic LangGraph dispatcher pattern that scales by adding new workers, not by giving one agent more tools.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A mock manager that dispatches goals to specialized worker functions and aggregates results.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">researcher</span>(goal):
    facts = {<span class="str">'transformers'</span>: <span class="str">'Vaswani 2017, attention is all you need'</span>,
             <span class="str">'cnn'</span>: <span class="str">'LeCun 1989, gradient-based learning'</span>}
    <span class="kw">for</span> key, val <span class="kw">in</span> facts.<span class="fn">items</span>():
        <span class="kw">if</span> key <span class="kw">in</span> goal.<span class="fn">lower</span>(): <span class="kw">return</span> f<span class="str">'FOUND: {val}'</span>
    <span class="kw">return</span> <span class="str">'no source'</span>
<span class="kw">def</span> <span class="fn">writer</span>(brief):    <span class="kw">return</span> f<span class="str">'Article: <span class="str">"{brief[:60]}..."</span> (350 words)'</span>
<span class="kw">def</span> <span class="fn">coder</span>(spec):      <span class="kw">return</span> f'<span class="kw">def</span> <span class="fn">solve</span>(): <span class="kw">pass</span>  <span class="cm"># implements {spec[:30]}'</span>
WORKERS = {<span class="str">'researcher'</span>: researcher, <span class="str">'writer'</span>: writer, <span class="str">'coder'</span>: coder}
<span class="kw">def</span> <span class="fn">manager</span>(goal, history):
    <span class="kw">if</span> <span class="kw">not</span> history:                         <span class="kw">return</span> <span class="str">'researcher'</span>
    <span class="kw">if</span> <span class="str">'FOUND'</span> <span class="kw">in</span> <span class="fn">str</span>(history[-<span class="num">1</span>]):         <span class="kw">return</span> <span class="str">'writer'</span>
    <span class="kw">if</span> <span class="str">'Article'</span> <span class="kw">in</span> <span class="fn">str</span>(history[-<span class="num">1</span>]):       <span class="kw">return</span> <span class="str">'coder'</span>
    <span class="kw">return</span> <span class="str">'finish'</span>
goal = <span class="str">'Write an intro to transformers and stub a demo'</span>
history = []
<span class="kw">for</span> turn <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    nxt = <span class="fn">manager</span>(goal, history)
    <span class="kw">if</span> nxt == <span class="str">'finish'</span>: <span class="kw">break</span>
    out = WORKERS[nxt](goal <span class="kw">if</span> <span class="kw">not</span> history <span class="kw">else</span> <span class="fn">str</span>(history[-<span class="num">1</span>]))
    history.<span class="fn">append</span>((nxt, out))
    <span class="fn">print</span>(f<span class="str">'  turn {turn}: manager -> {nxt:10s} -> {out[:60]}'</span>)
<span class="fn">print</span>(<span class="str">'DONE in'</span>, <span class="fn">len</span>(history), <span class="str">'worker calls'</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three specialist workers — <code>researcher</code>, <code>writer</code>, <code>coder</code> — each accept a string input and return a string output; researcher looks up canned facts, writer wraps a brief into an article stub, coder emits a function skeleton. 2) <code>manager(goal, history)</code> is a deterministic dispatcher: empty history routes to researcher, a <code>FOUND</code> result hands off to writer, an <code>Article</code> output triggers the coder, anything else finishes. 3) The 5-turn driver loop asks the manager for the next worker, breaks on <code>finish</code>, otherwise feeds the last history item to the chosen worker and stores the (worker, output) pair. 4) Printed traces show the path <code>researcher → writer → coder → finish</code> — the same manager/worker baton-pass that powers LangGraph hierarchies and AutoGen/CrewAI in the next lesson.</p>
</div>

<p class="l-text"><strong>The win:</strong> each worker has 1-3 tools instead of 15, so its tool-use accuracy jumps. The manager has zero tools (only routing decisions), so it never gets confused by tool selection. AutoGen and CrewAI (next lesson) are full implementations of this pattern.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Self-Reflection and Self-Critique Loops</h2>

<p class="l-text">Reflexion (Shinn et al, 2023) showed that an agent that critiques its own answer and rewrites can match a much larger model on coding benchmarks. The pattern: <strong>Actor</strong> produces an answer, <strong>Critic</strong> evaluates it (does it solve the task? what is wrong?), <strong>Reviser</strong> rewrites with the critique in context. Loop until critic says "good enough" or budget runs out.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Reflexion-style self-critique loop</span>
<span class="kw">def</span> <span class="fn">reflexion</span>(task, max_iters=<span class="num">3</span>):
    answer = actor.<span class="fn">invoke</span>(f<span class="str">"Task: {task}\nDraft an answer."</span>).content
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(max_iters):
        critique = critic.<span class="fn">invoke</span>(
            f<span class="str">"Task: {task}\nAnswer: {answer}\n"</span>
            f<span class="str">"Score 1-10 and list 3 specific issues. If score &gt;= 9, say 'DONE'."</span>
        ).content
        <span class="kw">if</span> <span class="str">"DONE"</span> <span class="kw">in</span> critique:
            <span class="kw">return</span> answer
        answer = reviser.<span class="fn">invoke</span>(
            f<span class="str">"Task: {task}\nPrevious answer: {answer}\n"</span>
            f<span class="str">"Critique: {critique}\nRewrite addressing every issue."</span>
        ).content
    <span class="kw">return</span> answer

<span class="cm"># For code tasks, replace the LLM critic with a real test runner:</span>
<span class="kw">def</span> <span class="fn">code_critic</span>(code, tests):
    <span class="kw">try</span>:
        ns = {}
        <span class="fn">exec</span>(code, ns)
        passed = <span class="fn">sum</span>(<span class="fn">int</span>(ns[<span class="str">"solve"</span>](*inp) == out) <span class="kw">for</span> inp, out <span class="kw">in</span> tests)
        <span class="kw">return</span> f<span class="str">"Passed {passed}/{<span class="fn">len</span>(tests)}. {'DONE' <span class="kw">if</span> passed == <span class="fn">len</span>(tests) <span class="kw">else</span> 'fix failing cases'}"</span>
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        <span class="kw">return</span> f<span class="str">"Crashed: {e}. Fix and try again."</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>reflexion(task, max_iters=3)</code> first calls <code>actor</code> for a draft, then enters a critique loop bounded by <code>max_iters</code> attempts. 2) On each iteration <code>critic</code> reads the task and current answer, returns a 1-10 score plus three specific issues, and emits the literal token <code>DONE</code> once the score crosses 9 — the early-exit signal. 3) When <code>DONE</code> is missing, <code>reviser</code> is called with the previous answer plus the critique and produces a new draft that explicitly addresses each issue — <code>answer</code> is overwritten and the loop continues. 4) The bottom <code>code_critic(code, tests)</code> shows the production trick: for code tasks swap the LLM critic for a real test runner that returns a pass count and the literal <code>DONE</code> when every test passes — a deterministic stop condition you can trust.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Reflexion on a real coding task: the critic is a unit test runner, the reviser patches the function on each iteration.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>tests = [((<span class="num">2</span>, <span class="num">3</span>), <span class="num">6</span>), ((<span class="num">4</span>, <span class="num">5</span>), <span class="num">20</span>), ((-<span class="num">1</span>, <span class="num">7</span>), -<span class="num">7</span>), ((<span class="num">0</span>, <span class="num">9</span>), <span class="num">0</span>)]
attempts = [
    <span class="str">'def solve(a, b): return a + b'</span>,         <span class="cm"># buggy</span>
    <span class="str">'def solve(a, b): return a - b'</span>,         <span class="cm"># buggy</span>
    <span class="str">'def solve(a, b): return a * b'</span>,         <span class="cm"># correct</span>
]
<span class="kw">def</span> <span class="fn">critic</span>(code):
    <span class="kw">try</span>:
        ns = {}; <span class="fn">exec</span>(code, ns)
        passed = <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> inp, out <span class="kw">in</span> tests <span class="kw">if</span> ns[<span class="str">'solve'</span>](*inp) == out)
        <span class="kw">return</span> passed, <span class="fn">len</span>(tests)
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        <span class="kw">return</span> <span class="num">0</span>, <span class="fn">len</span>(tests)
<span class="kw">for</span> i, code <span class="kw">in</span> <span class="fn">enumerate</span>(attempts):
    p, t = <span class="fn">critic</span>(code)
    verdict = <span class="str">'DONE'</span> <span class="kw">if</span> p == t <span class="kw">else</span> f<span class="str">'fix {t-p} failing case(s)'</span>
    <span class="fn">print</span>(f<span class="str">'  attempt {i+1}: passed {p}/{t}  -> {verdict}'</span>)
    <span class="kw">if</span> p == t:
        <span class="fn">print</span>(f<span class="str">'  Reflexion converged after {i+1} attempt(s).'</span>)
        <span class="kw">break</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>tests</code> defines a four-case truth table for a multiplication function — the deterministic critic used in place of an LLM scorer. 2) <code>attempts</code> simulates a Reflexion trajectory: three successive code versions where the first two are deliberately buggy (<code>a + b</code>, <code>a - b</code>) and the third is correct (<code>a * b</code>). 3) <code>critic(code)</code> <code>exec</code>'s each draft inside a fresh namespace, counts how many test cases pass, and returns <code>(passed, total)</code> — same contract as the textual critic above. 4) The loop prints a pass/fail line per attempt and breaks the moment passed == total, mirroring the early-exit Reflexion uses to stop once the answer is good enough.</p>
</div>

<div class="calc-highlight"><strong>Real-world trick:</strong> swap the LLM critic for a deterministic checker whenever you can — unit tests for code, regex/JSON-schema for structured output, a calculator for math. LLM critics are noisy; deterministic critics give you a stop condition you can trust.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Recursive Decomposition: When Steps Are Too Big</h2>

<p class="l-text">Sometimes a planner's "step" is itself a sub-task that needs its own plan. "Build a SaaS landing page" decomposes into "design hero", "write copy", "implement responsive grid", "add analytics" — and "implement responsive grid" further decomposes into "pick framework", "scaffold", "test mobile". Recursive decomposition runs the planner on each step that scores above a complexity threshold.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">recursive_plan</span>(task, depth=<span class="num">0</span>, max_depth=<span class="num">3</span>):
    <span class="cm"># Stop conditions: too deep OR task is atomic</span>
    <span class="kw">if</span> depth &gt;= max_depth <span class="kw">or</span> <span class="fn">is_atomic</span>(task):
        <span class="kw">return</span> {<span class="str">"task"</span>: task, <span class="str">"action"</span>: <span class="str">"execute"</span>}
    sub_tasks = planner.<span class="fn">invoke</span>(task).steps
    <span class="kw">return</span> {
        <span class="str">"task"</span>: task,
        <span class="str">"children"</span>: [<span class="fn">recursive_plan</span>(s, depth+<span class="num">1</span>, max_depth) <span class="kw">for</span> s <span class="kw">in</span> sub_tasks]
    }

<span class="kw">def</span> <span class="fn">is_atomic</span>(task):
    <span class="cm"># LLM judge: 1 = single tool call, 10 = needs decomposition</span>
    score = <span class="fn">int</span>(judge.<span class="fn">invoke</span>(f<span class="str">"Complexity 1-10 of: {task}"</span>).content)
    <span class="kw">return</span> score &lt;= <span class="num">3</span>

<span class="kw">def</span> <span class="fn">walk_and_execute</span>(node):
    <span class="kw">if</span> <span class="str">"action"</span> <span class="kw">in</span> node:
        <span class="kw">return</span> executor.<span class="fn">invoke</span>(node[<span class="str">"task"</span>])
    results = [<span class="fn">walk_and_execute</span>(c) <span class="kw">for</span> c <span class="kw">in</span> node[<span class="str">"children"</span>]]
    <span class="kw">return</span> aggregator.<span class="fn">invoke</span>({<span class="str">"task"</span>: node[<span class="str">"task"</span>], <span class="str">"sub_results"</span>: results})

<span class="cm"># Critical: cap depth and width or you blow up the LLM bill</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>recursive_plan(task, depth, max_depth)</code> stops and emits an <code>{"task", "action":"execute"}</code> leaf when either the depth cap is reached or <code>is_atomic(task)</code> returns True. 2) Otherwise it calls the <code>planner</code> for sub-steps and recurses on each, producing a tree of <code>{"task", "children": [...]}</code> nodes. 3) <code>is_atomic</code> uses an LLM judge to score complexity 1-10 and treats anything ≤ 3 as a single-tool task — this is the gate that prevents infinite decomposition. 4) <code>walk_and_execute</code> traverses the tree depth-first: leaves go to the <code>executor</code>, internal nodes collect child results and hand them to an <code>aggregator</code> LLM that synthesises a parent answer — the comment line at the bottom is a real warning, recursion plus per-step LLM calls explodes cost fast.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A working recursive decomposition tree on a mock build-website task. Depth-2 expansion, atomic tasks at the leaves.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>DECOMP = {
    <span class="str">'Build SaaS landing page'</span>: [<span class="str">'Design hero'</span>, <span class="str">'Write copy'</span>, <span class="str">'Add CTA'</span>],
    <span class="str">'Design hero'</span>:             [<span class="str">'Pick layout'</span>, <span class="str">'Choose hero image'</span>],
    <span class="str">'Write copy'</span>:              [<span class="str">'Headline'</span>, <span class="str">'Subhead'</span>, <span class="str">'Bullets'</span>],
    <span class="str">'Add CTA'</span>:                 [],   <span class="cm"># atomic</span>
    <span class="str">'Pick layout'</span>: [], <span class="str">'Choose hero image'</span>: [],
    <span class="str">'Headline'</span>: [], <span class="str">'Subhead'</span>: [], <span class="str">'Bullets'</span>: [],
}
<span class="kw">def</span> <span class="fn">recursive_plan</span>(task, depth=<span class="num">0</span>, max_depth=<span class="num">3</span>):
    children = DECOMP.<span class="fn">get</span>(task, [])
    <span class="kw">if</span> depth >= max_depth <span class="kw">or</span> <span class="kw">not</span> children:
        <span class="kw">return</span> {<span class="str">'task'</span>: task, <span class="str">'leaf'</span>: <span class="kw">True</span>}
    <span class="kw">return</span> {<span class="str">'task'</span>: task, <span class="str">'children'</span>: [<span class="fn">recursive_plan</span>(c, depth+<span class="num">1</span>, max_depth) <span class="kw">for</span> c <span class="kw">in</span> children]}
tree = <span class="fn">recursive_plan</span>(<span class="str">'Build SaaS landing page'</span>)
<span class="kw">def</span> <span class="fn">walk</span>(node, indent=<span class="num">0</span>):
    <span class="fn">print</span>(<span class="str">'  '</span> * indent + (<span class="str">'* '</span> <span class="kw">if</span> node.<span class="fn">get</span>(<span class="str">'leaf'</span>) <span class="kw">else</span> <span class="str">'+ '</span>) + node[<span class="str">'task'</span>])
    <span class="kw">for</span> c <span class="kw">in</span> node.<span class="fn">get</span>(<span class="str">'children'</span>, []):
        <span class="fn">walk</span>(c, indent + <span class="num">1</span>)
<span class="fn">walk</span>(tree)
<span class="kw">def</span> <span class="fn">count_leaves</span>(n): <span class="kw">return</span> <span class="num">1</span> <span class="kw">if</span> n.<span class="fn">get</span>(<span class="str">'leaf'</span>) <span class="kw">else</span> <span class="fn">sum</span>(<span class="fn">count_leaves</span>(c) <span class="kw">for</span> c <span class="kw">in</span> n[<span class="str">'children'</span>])
<span class="fn">print</span>(f<span class="str">'Leaf actions to execute: {count_leaves(tree)}'</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>DECOMP</code> is a hard-coded planner: it maps every task name to its child sub-tasks; empty lists mean atomic leaves. 2) <code>recursive_plan(task, depth, max_depth)</code> walks <code>DECOMP</code> downward — if the task is a leaf or depth hits the cap it emits <code>{"task", "leaf": True}</code>, otherwise it recurses across every child. 3) <code>walk(node, indent)</code> pretty-prints the tree with <code>+</code> for branches and <code>*</code> for leaves so you can see the full decomposition at a glance. 4) <code>count_leaves(tree)</code> tells you exactly how many atomic actions the executor will run — the deterministic stand-in for the cost projection you would do before unleashing a real LLM-driven recursive planner.</p>
</div>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Multi-Agent Production Stack — MCP and the New Hierarchy</h2>
<p class="l-text"><strong>Multi-agent production looks different after Nov 2024.</strong> Before MCP, each agent in a hierarchy had a hand-coded tool list and bespoke RPCs to its workers. After MCP, the manager-worker pattern in section 5 collapses into one architecture: every worker is an MCP server, every manager is an MCP client, and the protocol carries the tool descriptions, the inputs, and the structured outputs uniformly. Combined with Computer Use as the "GUI fallback worker", you can now build multi-agent systems that span a real desktop without any custom integration glue.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MCP — Model Context Protocol (Anthropic, Nov 2024)</div><div class="card-body">JSON-RPC 2.0 over stdio or SSE — the lingua franca for LLM clients and tool servers. ~10 reference servers (filesystem, GitHub, Postgres, Slack, Memory, Sentry, Puppeteer, Brave Search, AWS, Time). In a multi-agent system each sub-agent becomes an MCP server and the manager is the client.</div></div>
<div class="calc-card"><div class="card-title">Computer Use (Anthropic, Oct 2024)</div><div class="card-body">Screenshot + screen size in, mouse/keyboard actions out. OSWorld ~14% at launch. In a multi-agent system this is the "universal GUI worker" — when no SDK exists, spawn a Computer Use worker and let it drive the app.</div></div>
<div class="calc-card"><div class="card-title">Cursor Composer (Cursor AI, 2024)</div><div class="card-body">Multi-file agentic code editor — a "code worker" inside an IDE. Pattern study: bounded action space (file ops + shell + tests) + tight feedback loop = reliable agentic UX. Apply the same constraint set to your production sub-agents.</div></div>
<div class="calc-card"><div class="card-title">Devin (Cognition, Mar 2024)</div><div class="card-body">Autonomous SWE agent in a sandbox VM, SWE-Bench ~13.86%. The cautionary tale — fully-autonomous open-scope agents are fragile. In production, prefer narrower scopes with manager oversight (section 5 manager-worker pattern).</div></div>
<div class="calc-card"><div class="card-title">GitHub Copilot Workspace (Apr 2024)</div><div class="card-body">Plan → spec → edit → test loop with real CI integration. Pattern study: the human stays in the loop at the plan stage, agents act after approval. Critical for high-stakes multi-agent rollouts.</div></div>
</div>
<div class="calc-highlight"><strong>Multi-agent architecture in 2026:</strong> manager is a planner LLM (Claude 3.7 / GPT-4o) running Plan-and-Execute or hierarchical planning from this lesson; workers are MCP servers (one per domain: code, browser, DB, search, Computer Use for GUI). Memory is a shared MCP Memory server. The manager calls workers via MCP, never via bespoke HTTP. This collapses three concerns (tool definitions, transport, schema) into one protocol.</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7b. Tool call frequency across agents (heatmap)</h2>
<p class="l-text">In a hierarchical manager + worker setup, different workers favour different tools. The heatmap shows how often each worker calls each tool over 200 tasks — researchers hit <code>search</code>, coders hit <code>shell</code> and <code>code_exec</code>, reviewers hit <code>read_file</code>.</p>
<div id="plot-agents-l7-toolfreq-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var tools = ['search','read_file','write_file','shell','code_exec','http_get'];
  var workers = ['Researcher','Coder','Reviewer','Planner','Critic'];
  var z = [
    [142, 38,  6,  4,  2, 88],
    [ 14,120, 96, 88,110, 12],
    [  8,160, 22,  6,  4,  4],
    [ 64, 30,  8,  4,  6, 28],
    [ 12,140,  6,  2, 14,  4]
  ];
  var data = [{ z:z, x:tools, y:workers, type:'heatmap',
    colorscale:[[0,'rgba(20,22,28,0.9)'],[0.5,'rgba(106,169,255,0.6)'],[1,accent]],
    colorbar:{title:'calls'}, hovertemplate:'%{y} → %{x}: %{z}<extra></extra>' }];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'tool', side:'bottom'}, yaxis:{title:'worker', automargin:true},
    margin:{t:50,r:20,b:60,l:100}, title:{text:'Tool call frequency by worker role (200 tasks)', font:{color:text, size:14}}, height:380 };
  Plotly.newPlot('plot-agents-l7-toolfreq-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-agents-l7-toolfreq-tr');
  if (trDiv) Plotly.newPlot('plot-agents-l7-toolfreq-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Tool usage is highly specialised — give each worker only the tools it actually needs. Smaller per-worker tool surfaces cut hallucinated tool names and shrink prompt size.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Choosing a Planner: Decision Table</h2>

<p class="l-text">Every planner has a sweet spot. Pick wrong and you either burn tokens (ToT on a linear task) or miss the answer (ReAct on a 20-step task). Use this table:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Short, linear (1-5 steps)</div><div class="card-body"><strong>ReAct.</strong> Cheap, easy to debug, fails fast.</div></div>
<div class="calc-card"><div class="card-title">Long, predictable (5-15 steps)</div><div class="card-body"><strong>ReWOO.</strong> 2 LLM calls regardless of length. Use when tools are reliable.</div></div>
<div class="calc-card"><div class="card-title">Long, may need replan</div><div class="card-body"><strong>Plan-and-Execute.</strong> Replanner reacts to failures. Industry default.</div></div>
<div class="calc-card"><div class="card-title">Verifiable answer space</div><div class="card-body"><strong>Tree of Thoughts.</strong> When a checker exists (tests, simulator).</div></div>
<div class="calc-card"><div class="card-title">Cross-domain task</div><div class="card-body"><strong>Hierarchical.</strong> Manager + specialized workers. See L8.</div></div>
<div class="calc-card"><div class="card-title">Quality-sensitive output</div><div class="card-body"><strong>Reflexion.</strong> Add self-critique on top of any of the above.</div></div>
</div>

<div class="calc-highlight"><strong>Combine them:</strong> a real production agent often layers patterns. The Manager is hierarchical, each Worker uses Plan-and-Execute, the writing Worker adds Reflexion, the math Worker uses ToT. The ceiling is your ability to debug — start simple, add layers only when a measured failure mode justifies it.</div>

<p class="l-text">In Lesson 8 we move from "one agent with multiple roles" to "multiple agents that talk to each other" — AutoGen group chat, CrewAI crews, debate, and voting. The planning skills here are the foundation: a multi-agent system with a bad planner is worse than a single agent with a good one.</p>
</div>`,

tr: `<p class="l-text"><strong>Tek bir LLM çağrısı çok-adımlı bir problemi güvenilir biçimde çözemez.</strong> GPT-4'e tek bir prompt'ta "bana Python'da Snake oyunu yap, hata ayıkla ve Docker container'a sevk et" deyin; halüsinasyonlu bir karmaşa alırsınız. Aynı LLM, aynı görev <em>plan</em> olarak verildiğinde — context'te aynı anda tek bir adımla — başarılı olur. Darboğaz ham zeka değildir — çalışma belleği ile "düşünme" ve "eyleme geçme" arasındaki boşluktur.</p>

<p class="l-text">Bu ders agent mimarilerinin planlayıcı katmanı ile ilgilidir. Plan-and-Execute (LangChain'in kalıbı, JSON adım listesi yayan açık bir Planlayıcı + bunları çalıştıran bir Yürütücü), Tree of Thoughts (Yao ve ark., NeurIPS 2023 — birden fazla muhakeme yolunu keşfetmek ve kötü dalları budamak), ReWOO (Reasoning WithOut Observation — token'ı 5x kesmek için araç çağrılarını muhakemeden ayırmak), hiyerarşik Manager+Worker kurulumları ve agent'ın kendi çıktısını eleştirip yeniden yazdığı öz-yansıma döngüleri kapsanır. Sonunda ReAct (Ders 5) çok dar görüşlü kaldığında <em>hangi planlayıcıya başvuracağını</em> bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Plan-and-Execute uygulamak: adım yayan bir Planlayıcı ve bunları sırayla çalıştıran bir Yürütücü</li>
<li>Kötü dalları budamak için sezgisel bir değer fonksiyonuyla Tree of Thoughts araması inşa etmek</li>
<li>Planlamayı gözlemden ayırarak ReWOO ile LLM çağrılarını yaklaşık 5x kesmek</li>
<li>İşi ayrıştıran ve uzmanlaşmış Worker agent'larına gönderen bir Manager bağlamak</li>
<li>Agent'ın zayıf cevapları yeniden yazması için bir öz-yansıma / öz-eleştiri döngüsü eklemek</li>
<li>Görev başına doğru planlayıcıyı seçmek: doğrusal vs dallı vs hiyerarşik vs yansıtıcı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Planlayıcılar Tek-Adım Agent'ları Neden Yener</h2>

<p class="l-text">Bir ReAct agent her seferinde bir eylem seçer, sonucu gözlemler ve sonraki eylemi seçer. Kısa ufuklar (3-5 adım) için çalışır ama hızlı bozulur: hatalar birikir, model orijinal hedefin izini kaybeder ve araç bütçesi patlar. Bir planlayıcı uzun-ufuklu düşünmeyi ("8 adıma ayrıştır") kısa-ufuklu yürütmeden ("adım 3'ü çalıştır, sonucu hafızaya ekle") ayırır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ReAct (Ders 5)</div><div class="card-body">Tur başına bir Düşünce → Eylem → Gözlem. Reaktif, dar görüşlü, hata ayıklaması kolay. &lt;5 adım için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Plan-and-Execute</div><div class="card-body">Planlayıcı tam bir adım listesi bir kez yazar, Yürütücü her adımı çalıştırır. Düşünme token'larını %60-80 keser.</div></div>
<div class="calc-card"><div class="card-title">Tree of Thoughts</div><div class="card-body">N aday sonraki-adımı keşfeder, puanlar, kaybedenleri budar. Geri izlemeli problemler için.</div></div>
<div class="calc-card"><div class="card-title">ReWOO</div><div class="card-body">Plan + araç çağrıları + final çözücü, içiçe muhakeme yok. En ucuz token, yeniden planlama yok.</div></div>
<div class="calc-card"><div class="card-title">Hiyerarşik</div><div class="card-body">Manager ayrıştırır, Worker'lar uzmanlaşır. 5-50 agent'lık ekiplere ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Yansıtıcı</div><div class="card-body">Öz-eleştiri döngüsü: üret → eleştir → revize et. Yazma/kod görevlerinde kaliteyi artırır.</div></div>
</div>

<div class="calc-highlight"><strong>Zihinsel model:</strong> ReAct, satır-satır ilerleyen bir debugger'dır. Plan-and-Execute, Gantt diyagramı çizen bir proje yöneticisidir. Tree of Thoughts, hamle ağacında arama yapan bir satranç motorudur. Hype'a göre değil — görevinin şekline göre seç.</div>

<p class="l-text">Ampirik olarak, HotpotQA çok-atlamalı benchmark'ında Plan-and-Execute, ReAct'i 7-12 puan exact-match önde geçer ve <em>daha az</em> toplam LLM çağrısı kullanır çünkü plan güçlü bir planlayıcı (Opus, GPT-4) tarafından yazıldıktan sonra yürütücü adımları daha küçük ucuz bir model (Haiku, GPT-4o-mini) kullanabilir.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Plan-and-Execute: LangChain Kalıbı</h2>

<p class="l-text">Plan-and-Execute (LangChain Plan-and-Execute agent'ı ve 2023'teki BabyAGI soyu tarafından popülerleştirildi) agent döngüsünü iki role böler. <strong>Planlayıcı</strong> kullanıcı hedefini, mevcut araçları görür ve bir JSON adım listesi yayar. <strong>Yürütücü</strong> bir seferde bir adım alır, aracı seçer, çalıştırır, sonucu bir scratchpad'e ekler ve devam eder. İsteğe bağlı olarak bir <strong>Yeniden Planlayıcı</strong>, sonuçların sonraki adımları geçersiz kılması durumunda her adımdan sonra planı tekrar gözden geçirir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install langchain langchain-openai langgraph</span>
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langgraph.prebuilt <span class="kw">import</span> create_react_agent
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate
<span class="kw">from</span> pydantic <span class="kw">import</span> BaseModel, Field
<span class="kw">from</span> typing <span class="kw">import</span> List

<span class="cm"># 1) The Planner: emits a typed list of steps</span>
<span class="kw">class</span> <span class="ty">Plan</span>(BaseModel):
    steps: List[str] = <span class="fn">Field</span>(description=<span class="str">"Ordered steps to solve the task"</span>)

planner_prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"For the given objective, come up with a step by step plan. "</span>
                <span class="str">"Each step should be one tool call or one reasoning step. Be precise."</span>),
    (<span class="str">"user"</span>, <span class="str">"{objective}"</span>),
])
planner = planner_prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>, temperature=<span class="num">0</span>).<span class="fn">with_structured_output</span>(Plan)

<span class="cm"># 2) The Executor: a small ReAct agent that runs ONE step at a time</span>
executor = <span class="fn">create_react_agent</span>(
    <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>),
    tools=[search_tool, calculator_tool, sql_tool],
)

<span class="cm"># 3) The Replanner: revisits the plan after each step's output</span>
<span class="kw">class</span> <span class="ty">PlanOrFinish</span>(BaseModel):
    next_steps: List[str] | <span class="kw">None</span> = <span class="kw">None</span>
    final_answer: str | <span class="kw">None</span> = <span class="kw">None</span>

replanner_prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Given the original plan and what we have done so far, "</span>
                <span class="str">"return either an updated remaining-steps list, OR a final answer if done."</span>),
    (<span class="str">"user"</span>, <span class="str">"Objective: {objective}\nPlan: {plan}\nDone so far: {past_steps}"</span>),
])
replanner = replanner_prompt | <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>).<span class="fn">with_structured_output</span>(PlanOrFinish)

<span class="cm"># 4) Driver loop</span>
<span class="kw">def</span> <span class="fn">run</span>(objective):
    plan = planner.<span class="fn">invoke</span>({<span class="str">"objective"</span>: objective})
    past = []
    <span class="kw">while</span> plan.steps:
        step = plan.steps[<span class="num">0</span>]
        result = executor.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [(<span class="str">"user"</span>, step)]})
        past.<span class="fn">append</span>((step, result[<span class="str">"messages"</span>][-<span class="num">1</span>].content))
        decision = replanner.<span class="fn">invoke</span>({<span class="str">"objective"</span>: objective, <span class="str">"plan"</span>: plan.steps, <span class="str">"past_steps"</span>: past})
        <span class="kw">if</span> decision.final_answer:
            <span class="kw">return</span> decision.final_answer
        plan.steps = decision.next_steps</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <em>Planner</em> Runnable bir kez <code>{"objective": objective}</code> ile çağrılır ve sıralı <code>steps</code> listesi olan bir <code>Plan</code> Pydantic nesnesi döndürür. 2) <em>Executor</em>, üç tool üzerinde küçük bir <code>create_react_agent</code>'tır — her adım için o tek alt-görev üzerinde ReAct çalıştırır ve (step, answer) çiftini <code>past</code>'a ekleriz. 3) Her adımdan sonra <em>replanner</em> hedefi, kalan planı ve şimdiye kadar yaptıklarımızı okur ve ya yeni bir <code>next_steps</code> listesi (yeniden planlama) ya da bir <code>final_answer</code> (bitti) döner. 4) <code>decision.final_answer</code> set edilir edilmez döngü sonlanır; aksi halde <code>plan.steps</code> replanner'ın güncellemesiyle değişir — Plan-and-Execute'u yürütme ortası sürprizlere dirençli kılan budur.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sahte bir Plan-and-Execute döngüsü: el yazımı bir planlayıcı adım listesi döndürür, yürütücü her adımı bir araç fonksiyonuna eşler ve bir scratchpad sonuçları biriktirir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re
<span class="kw">def</span> <span class="fn">planner</span>(objective):
    <span class="kw">return</span> [
        (<span class="str">'search'</span>, <span class="str">'Tesla 2023 revenue'</span>),
        (<span class="str">'search'</span>, <span class="str">'Ford 2023 revenue'</span>),
        (<span class="str">'calc'</span>,   <span class="str">'tesla / ford'</span>),
        (<span class="str">'answer'</span>, <span class="str">'ratio'</span>)
    ]
DB = {<span class="str">'Tesla 2023 revenue'</span>: 96_773, <span class="str">'Ford 2023 revenue'</span>: 176_191}
<span class="kw">def</span> <span class="fn">tool</span>(kind, arg, scratch):
    <span class="kw">if</span> kind == <span class="str">'search'</span>: <span class="kw">return</span> DB.<span class="fn">get</span>(arg, <span class="num">0</span>)
    <span class="kw">if</span> kind == <span class="str">'calc'</span>:
        <span class="kw">return</span> <span class="fn">round</span>(scratch[<span class="num">0</span>] / scratch[<span class="num">1</span>], <span class="num">3</span>)
    <span class="kw">if</span> kind == <span class="str">'answer'</span>:
        <span class="kw">return</span> f<span class="str">'Tesla revenue is {scratch[-1]}x Ford'</span>
plan = <span class="fn">planner</span>(<span class="str">'Compare Tesla vs Ford 2023 revenue'</span>)
scratch = []
<span class="kw">for</span> kind, arg <span class="kw">in</span> plan:
    out = <span class="fn">tool</span>(kind, arg, scratch)
    scratch.<span class="fn">append</span>(out)
    <span class="fn">print</span>(f<span class="str">'  step {kind:7s} {arg:30s} -> {out}'</span>)
<span class="fn">print</span>(<span class="str">'FINAL:'</span>, scratch[-<span class="num">1</span>])</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>planner(objective)</code> bir LLM çağrısının yerine geçer — search → search → calc → answer yürüyen 4 adımlı sabit kodlu <code>(tool_kind, arg)</code> tuple listesi döner. 2) <code>DB</code> + <code>tool</code> dispatcher executor'ı taklit eder: <code>search</code> hazır arama yapar, <code>calc</code> <code>scratch</code>'in ilk iki değerini böler, <code>answer</code> nihai oranı biçimlendirir. 3) Sürücü döngü her adımı sırayla uygular, çıktıyı <code>scratch</code>'e ekler ve plan ilerlemesini görebilmek için tek satırlık iz yazdırır. 4) Sondaki <code>FINAL: ...</code> planner/executor ayrımını gösterir: plan en başta bir kez karar verildi, sonra deterministik biçimde yürütüldü — döngü sırasında LLM'e danışılmadı, gerçek bir Plan-and-Execute sisteminin maliyet kontrolü için güvendiği özellik.</p>
</div>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Tree of Thoughts (Yao ve ark., 2023)</h2>

<p class="l-text">Tree of Thoughts (ToT, Yao ve ark., NeurIPS 2023), Chain of Thought'u doğrusal bir diziden bir ağaca genelleştirir. Her "düşünce düğümünde" agent K aday sonraki-düşünce üretir, her birini bir değer fonksiyonuyla puanlar (1-10 ölçekte "bu dal ne kadar umut verici?" diye soran ayrı bir LLM çağrısı) ve yalnızca top-N dalı genişletir. Düşünce uzayında BFS veya DFS'tir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CoT</div><div class="card-body">Doğrusal: thought_1 → thought_2 → cevap. Tek yol. Ucuz, ama erken kötü adımdan kurtuluş yok.</div></div>
<div class="calc-card"><div class="card-title">CoT-SC</div><div class="card-body">Self-Consistency: N bağımsız CoT zinciri örnekle, cevap için oyla. Yardım eder ama keşif yok.</div></div>
<div class="calc-card"><div class="card-title">ToT-BFS</div><div class="card-body">Tüm K çocuğu genişlet, puanla, top-N tut, tekrarla. Geniş arama. Cevaplar kısa olduğunda en iyisi.</div></div>
<div class="calc-card"><div class="card-title">ToT-DFS</div><div class="card-body">En iyi çocukta derine in, çıkmaz sokakta geri dön. Doğrulanabilir terminal durumlu problemler için en iyisi.</div></div>
</div>

<p class="l-text">Orijinal makalede ToT, Game of 24 başarısını %4'ten (GPT-4 ile vanilya CoT) %74'e itti. Bedeli: problem başına 5-100x daha fazla LLM çağrısı, çünkü çok aday örneklenir ve her biri puanlanır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Tree of Thoughts skeleton for Game of 24:</span>
<span class="cm"># Given 4 numbers, reach 24 using +, -, *, /</span>
<span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>, temperature=<span class="num">0.7</span>)

<span class="kw">def</span> <span class="fn">propose</span>(state, k=<span class="num">5</span>):
    <span class="cm"># Ask LLM for k candidate next moves</span>
    prompt = f<span class="str">"Numbers left: {state}. Propose {k} possible next operations (one per line)."</span>
    <span class="kw">return</span> [line.<span class="fn">strip</span>() <span class="kw">for</span> line <span class="kw">in</span> llm.<span class="fn">invoke</span>(prompt).content.<span class="fn">split</span>(<span class="str">"\n"</span>) <span class="kw">if</span> line.<span class="fn">strip</span>()][:k]

<span class="kw">def</span> <span class="fn">value</span>(state):
    <span class="cm"># Heuristic LLM evaluator: 1=dead, 5=maybe, 10=sure win</span>
    prompt = f<span class="str">"Can numbers {state} reach 24 with +-*/? Reply with a single int 1-10."</span>
    <span class="kw">try</span>: <span class="kw">return</span> <span class="fn">int</span>(llm.<span class="fn">invoke</span>(prompt).content.<span class="fn">strip</span>())
    <span class="kw">except</span>: <span class="kw">return</span> <span class="num">1</span>

<span class="kw">def</span> <span class="fn">tot_bfs</span>(start, depth=<span class="num">3</span>, beam=<span class="num">3</span>):
    frontier = [start]
    <span class="kw">for</span> d <span class="kw">in</span> <span class="fn">range</span>(depth):
        candidates = []
        <span class="kw">for</span> state <span class="kw">in</span> frontier:
            <span class="kw">for</span> move <span class="kw">in</span> <span class="fn">propose</span>(state, k=<span class="num">5</span>):
                new_state = <span class="fn">apply_move</span>(state, move)  <span class="cm"># your sim</span>
                candidates.<span class="fn">append</span>((<span class="fn">value</span>(new_state), new_state))
        <span class="cm"># Keep top-beam by value (prune the rest)</span>
        candidates.<span class="fn">sort</span>(reverse=<span class="kw">True</span>)
        frontier = [s <span class="kw">for</span> _, s <span class="kw">in</span> candidates[:beam]]
    <span class="kw">return</span> frontier[<span class="num">0</span>]</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>propose(state, k=5)</code> sıcaklık 0.7'de LLM'i k aday sonraki hamle için çağırır — her newline düşünce ağacında bir dal olur. 2) <code>value(state)</code> herhangi bir durumu 1–10 arası puanlayan ikinci LLM çağrısıdır ("bu dal ne kadar umut verici?") — kaba-kuvvet çözücünün yerine geçen ucuz değer fonksiyonudur. 3) <code>tot_bfs(start, depth, beam)</code> klasik beam search yapar: her derinlikte frontier'daki her durumu k öneriyle genişletir, her birini <code>value</code> ile puanlar, azalan sırayla diziler ve yalnızca top <code>beam</code> hayatta kalanı tutar. 4) Çıktı <code>depth</code>'teki en yüksek skorlu yapraktır — ToT makalesinde Game of 24'ü %4'ten %74'e taşıyan tam yapı, problem başına onlarca LLM çağrısı pahasına.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">LLM yerine kaba kuvvet değerlendiriciyle gerçek bir Game of 24 ToT araması, işlem ağacında beam=3 BFS.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> itertools <span class="kw">import</span> combinations
<span class="kw">def</span> <span class="fn">can_reach_24</span>(nums, eps=<span class="num">1e-3</span>):
    <span class="kw">if</span> <span class="fn">len</span>(nums) == <span class="num">1</span>: <span class="kw">return</span> <span class="fn">abs</span>(nums[<span class="num">0</span>] - <span class="num">24</span>) &lt; eps
    <span class="kw">for</span> i, j <span class="kw">in</span> <span class="fn">combinations</span>(<span class="fn">range</span>(<span class="fn">len</span>(nums)), <span class="num">2</span>):
        a, b = nums[i], nums[j]
        rest = [nums[k] <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(nums)) <span class="kw">if</span> k != i <span class="kw">and</span> k != j]
        ops = [a+b, a-b, b-a, a*b] + ([a/b] <span class="kw">if</span> b <span class="kw">else</span> []) + ([b/a] <span class="kw">if</span> a <span class="kw">else</span> [])
        <span class="kw">for</span> r <span class="kw">in</span> ops:
            <span class="kw">if</span> <span class="fn">can_reach_24</span>(rest + [r]): <span class="kw">return</span> <span class="kw">True</span>
    <span class="kw">return</span> <span class="kw">False</span>
<span class="kw">def</span> <span class="fn">value_fn</span>(state): <span class="kw">return</span> <span class="num">10</span> <span class="kw">if</span> <span class="fn">can_reach_24</span>(state) <span class="kw">else</span> <span class="num">1</span>
<span class="kw">def</span> <span class="fn">expand</span>(state):
    out = []
    <span class="kw">for</span> i, j <span class="kw">in</span> <span class="fn">combinations</span>(<span class="fn">range</span>(<span class="fn">len</span>(state)), <span class="num">2</span>):
        a, b = state[i], state[j]
        rest = [state[k] <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(state)) <span class="kw">if</span> k != i <span class="kw">and</span> k != j]
        <span class="kw">for</span> r, name <span class="kw">in</span> [(a+b,<span class="str">'+'</span>), (a-b,<span class="str">'-'</span>), (a*b,<span class="str">'*'</span>)]:
            out.<span class="fn">append</span>(rest + [r])
    <span class="kw">return</span> out
problems = [[<span class="num">3</span>,<span class="num">3</span>,<span class="num">8</span>,<span class="num">8</span>], [<span class="num">4</span>,<span class="num">4</span>,<span class="num">7</span>,<span class="num">7</span>], [<span class="num">1</span>,<span class="num">3</span>,<span class="num">4</span>,<span class="num">6</span>]]
<span class="kw">for</span> p <span class="kw">in</span> problems:
    frontier = [p]
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
        scored = <span class="fn">sorted</span>([(<span class="fn">value_fn</span>(s), s) <span class="kw">for</span> st <span class="kw">in</span> frontier <span class="kw">for</span> s <span class="kw">in</span> <span class="fn">expand</span>(st)], reverse=<span class="kw">True</span>)
        frontier = [s <span class="kw">for</span> _, s <span class="kw">in</span> scored[:<span class="num">3</span>]]
    solved = <span class="fn">any</span>(<span class="fn">value_fn</span>(s) == <span class="num">10</span> <span class="kw">for</span> s <span class="kw">in</span> frontier)
    <span class="fn">print</span>(f<span class="str">'  {p} -> {<span class="str">"SOLVED"</span> if solved else <span class="str">"no path found"</span>}'</span>)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>can_reach_24(nums)</code> deterministik değer fonksiyonudur — kalan sayılar üzerinde <code>+, -, *, /</code> her ikili kombinasyonu özyinelemeli olarak dener ve bir dizi 24'e <code>eps</code> içinde inerse True döner. 2) <code>value_fn(state)</code> bunu ToT puanlama API'sine sarar (ulaşılabilirse 10, değilse 1); <code>expand(state)</code> bir sonraki katman için her (i, j, op) çocuk durumunu üretir. 3) Dıştaki döngü üç Game-of-24 problemini dolaşır; her biri için BFS frontier'ı genişletir, her çocuğu <code>value_fn</code> ile puanlar, azalan sırada diziler ve top-3 hayatta kalanı yeni frontier olarak tutar — yukarıdaki LLM versiyonu ile aynı beam-search şekli. 4) 3 derinlik sonrası hayatta kalan bir yaprağın 10 alıp almadığına göre her problem SOLVED veya "no path found" yazdırılır — aramayı analitik çözmek (LLM çağrılarıyla değil) makalenin kullandığı algoritmik omurganın aynısını gösterir.</p>
</div>

<div class="calc-highlight"><strong>ToT'a ne zaman başvurursun:</strong> cevap uzayı arama yapılacak kadar küçük (puzzle, doğrulayıcılı kod tamamlama, matematik) VE ucuz bir değer fonksiyonu var (test runner, kaba kontrol, simülatör). Açık-uçlu yazma için ToT aşırıdır — bunun yerine Plan-and-Execute veya öz-yansıma kullan.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ReWOO: Gözlemsiz Muhakeme</h2>

<p class="l-text">ReWOO (Xu ve ark., 2023), ReAct'in tüm geçmişi her adımda LLM'e geri enjekte ettiğini fark etti. Görevin 6 araç çağrısı varsa aynı prompt büyüyen context ile 6 kez gönderilir — pahalı ve yavaş. ReWOO agent'ı üç role böler: <strong>Planlayıcı</strong> araç çıktıları için yer-tutucu değişkenlerle (<code>#E1</code>, <code>#E2</code>, ...) plan yayar, <strong>Worker</strong> her araç çağrısını bağımsız çalıştırır (döngüde LLM yok) ve <strong>Solver</strong> planı + tüm gözlemleri bir kez görüp final cevabı yazar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># ReWOO: 3 LLM calls total, regardless of number of tool calls</span>
PLAN_PROMPT = <span class="str">"""For the task, write a plan as numbered steps.
Each step is: Plan: ... \\n#E_n = Tool[input that may reference previous #E_k]
Tools: Search[query], Calc[expr], LLM[prompt]
Task: {task}"""</span>

<span class="kw">def</span> <span class="fn">plan</span>(task):
    <span class="kw">return</span> llm.<span class="fn">invoke</span>(PLAN_PROMPT.<span class="fn">format</span>(task=task)).content

<span class="kw">def</span> <span class="fn">worker</span>(plan_text):
    <span class="cm"># Parse #E_n = Tool[args] lines, execute, substitute back</span>
    <span class="kw">import</span> re
    evidence = {}
    <span class="kw">for</span> line <span class="kw">in</span> plan_text.<span class="fn">split</span>(<span class="str">"\n"</span>):
        m = re.<span class="fn">match</span>(<span class="str">r"#E(\\d+)\\s*=\\s*(\\w+)\\[(.+)\\]"</span>, line)
        <span class="kw">if</span> <span class="kw">not</span> m: <span class="kw">continue</span>
        eid, tool_name, arg = m.<span class="fn">groups</span>()
        <span class="cm"># Substitute previous evidence into arg</span>
        <span class="kw">for</span> k, v <span class="kw">in</span> evidence.<span class="fn">items</span>():
            arg = arg.<span class="fn">replace</span>(f<span class="str">"#E{k}"</span>, <span class="fn">str</span>(v))
        evidence[eid] = TOOLS[tool_name](arg)  <span class="cm"># pure function, no LLM</span>
    <span class="kw">return</span> evidence

SOLVE_PROMPT = <span class="str">"Task: {task}\\nPlan: {plan}\\nEvidence: {ev}\\nFinal answer:"</span>
<span class="kw">def</span> <span class="fn">solve</span>(task, plan_text, evidence):
    <span class="kw">return</span> llm.<span class="fn">invoke</span>(SOLVE_PROMPT.<span class="fn">format</span>(task=task, plan=plan_text, ev=evidence)).content

<span class="cm"># Total LLM calls: 1 (plan) + 0 in worker + 1 (solve) = 2 calls for any task length</span>
<span class="cm"># vs ReAct: O(num_tool_calls) calls with growing context</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>plan(task)</code> tek bir LLM çağrısı <code>PLAN_PROMPT</code> ile yapar — modele numaralı <code>Plan:</code> satırları artı önceki <code>#E_k</code> placeholder'larına atıfta bulunabilen <code>args</code>'lı <code>#E_n = Tool[args]</code> slotları yayması söylenir. 2) <code>worker(plan_text)</code> hiç LLM'e dokunmaz: regex ile her <code>#E_n = Tool[args]</code> satırını parse eder, <code>args</code> içindeki önceki <code>#E_k</code> token'larını çözülmüş değerleriyle değiştirir, sonra <code>TOOLS[tool_name](arg)</code>'i çalıştırır ve çıktıyı <code>evidence[eid]</code>'e saklar. 3) <code>solve(task, plan_text, evidence)</code> ikinci ve son LLM çağrısını yapar; modele orijinal görevi artı tüm planı ve gözlem haritasını verir, böylece cevabı tek seferde yazabilir. 4) Alttaki yorumlar manşeti açıklar: tool-çağrı sayısı ne olursa olsun 2 LLM çağrısı, ReAct'ın tam-context replay ile O(num_tool_calls)'una karşı — HotpotQA'da ReWOO'nun 5x token tasarrufunun kaynağı.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">El yazımı planlayıcıyla çalışan ReWOO: #E1 #E2 kanıtının sonraki araç çağrılarına ikamesi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re
plan_text = <span class="str">"""Plan: get Tesla revenue
#E1 = Search[Tesla 2023 revenue]
Plan: get Ford revenue
#E2 = Search[Ford 2023 revenue]
Plan: compute ratio
#E3 = Calc[#E1 / #E2]"""</span>
TOOLS = {
    <span class="str">"Search"</span>: <span class="kw">lambda</span> q: {<span class="str">"Tesla 2023 revenue"</span>: <span class="num">96773</span>, <span class="str">"Ford 2023 revenue"</span>: <span class="num">176191</span>}.<span class="fn">get</span>(q, <span class="num">0</span>),
    <span class="str">"Calc"</span>:   <span class="kw">lambda</span> expr: <span class="fn">round</span>(<span class="fn">eval</span>(expr), <span class="num">3</span>),
}
evidence = {}
llm_calls = <span class="num">1</span>  <span class="cm"># plan cagrisi</span>
<span class="kw">for</span> line <span class="kw">in</span> plan_text.<span class="fn">split</span>(<span class="str">"\\n"</span>):
    m = re.<span class="fn">match</span>(r<span class="str">"#E(\\d+)\\s*=\\s*(\\w+)\\[(.+)\\]"</span>, line)
    <span class="kw">if</span> <span class="kw">not</span> m: <span class="kw">continue</span>
    eid, tool, arg = m.<span class="fn">groups</span>()
    <span class="kw">for</span> k, v <span class="kw">in</span> evidence.<span class="fn">items</span>():
        arg = arg.<span class="fn">replace</span>(f<span class="str">"#E{k}"</span>, <span class="fn">str</span>(v))
    evidence[eid] = TOOLS[tool](arg)
    <span class="fn">print</span>(f<span class="str">"  #E{eid} = {tool}[{arg}] -&gt; {evidence[eid]}"</span>)
llm_calls += <span class="num">1</span>  <span class="cm"># solve cagrisi</span>
<span class="fn">print</span>(f<span class="str">"Toplam LLM cagrisi: {llm_calls} (ayni gorev icin ReAct ~6 yapardi)"</span>)
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>plan_text</code> planlayıcının çıktısını çok-satırlı bir string olarak tutar — üç <code>Plan:</code> satırı, üç <code>#E1</code>/<code>#E2</code>/<code>#E3</code> tool-çağrı slotuyla aralanır; gerçek bir planlayıcı LLM'in yayacağı tam şekil. 2) <code>TOOLS</code> plandaki tool adlarını lambda'lara eşler — <code>Search</code> hazır gelir rakamlarını arar, <code>Calc</code> aritmetik ifadeyi değerlendirir. 3) Döngü her satırı dolaşır, <code>#E(\d+)\s*=\s*(\w+)\[(.+)\]</code> regex'ini çalıştırarak (id, tool, arg)'ı yakalar, <code>arg</code> içindeki önceki <code>#Ek</code> placeholder'larını gerçek kanıt değeriyle değiştirir, sonra tool'u dispatch eder ve çıktısını <code>evidence[eid]</code>'e saklar. 4) Sayaç artışları manşet sayıyı kanıtlar: <em>bir</em> plan çağrısı artı <em>bir</em> solve çağrısı toplam 2 LLM çağrısı eder — worker döngüsü tamamen modelsiz çalışır, bu yüzden ReWOO aynı görevde ReAct'tan 5x daha az token gönderir.</p>
</div>

<div class="calc-highlight"><strong>Tasarruf:</strong> ReWOO HotpotQA'da kalite kaybı olmadan ReAct'ten 5x daha az token bildirir. Takas: ReWOO yarı yolda kötü bir gözlemden kurtulamaz (plan sabittir). Öngörülebilir araç dizilerine sahip görevler için (search→search→math→answer), ReWOO en ucuz planlayıcıdır. Yürütme ortası hataların yeniden planlama gerektirdiği görevler için Plan-and-Execute kullan.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Hiyerarşik Agent'lar: Manager + Worker'lar</h2>

<p class="l-text">Bir görev alanları aştığında (bir konuyu araştır, bir rapor yaz, LaTeX olarak biçimlendir, PDF sevk et), tüm araçlara sahip tek bir agent kafası karışır — her adımda çok fazla seçenek görür. Çözüm: bir <strong>Manager</strong> agent görevi ayrıştırır ve her alt-görevi yalnızca uzmanlığıyla ilgili araçlara sahip bir <strong>Worker</strong> agent'a yönlendirir. Manager planın sahibidir; worker yürütmenin sahibidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Manager</div><div class="card-body">Kullanıcı hedefini + worker kadrosunu görür. Dispatch çağrıları yayar. Kendisi gerçek iş yapmaz.</div></div>
<div class="calc-card"><div class="card-title">Researcher</div><div class="card-body">Araçlar: web_search, arxiv, wikipedia. Atıf-zengin bir özet döndürür.</div></div>
<div class="calc-card"><div class="card-title">Writer</div><div class="card-body">Araçlar: yok (saf LLM). Bir özet alır, serbest metin döndürür. Güçlü bir model kullanır.</div></div>
<div class="calc-card"><div class="card-title">Coder</div><div class="card-body">Araçlar: python_exec, file_io. Pseudokodu → çalışan koda dönüştürür.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LangGraph hierarchical pattern</span>
<span class="kw">from</span> langgraph.graph <span class="kw">import</span> StateGraph
<span class="kw">from</span> langgraph.prebuilt <span class="kw">import</span> create_react_agent

researcher = <span class="fn">create_react_agent</span>(strong_llm, tools=[search, arxiv])
writer     = <span class="fn">create_react_agent</span>(strong_llm, tools=[])
coder      = <span class="fn">create_react_agent</span>(strong_llm, tools=[python_exec, file_io])

WORKERS = {<span class="str">"researcher"</span>: researcher, <span class="str">"writer"</span>: writer, <span class="str">"coder"</span>: coder}

<span class="kw">def</span> <span class="fn">manager_node</span>(state):
    <span class="cm"># Manager decides which worker to call next, given progress so far</span>
    decision = manager_llm.<span class="fn">invoke</span>(
        f<span class="str">"Goal: {state['goal']}\nDone: {state['history']}\n"</span>
        f<span class="str">"Pick next worker from {<span class="fn">list</span>(WORKERS)}, or 'finish' if done."</span>
    )
    <span class="kw">return</span> {<span class="str">"next_worker"</span>: decision.content.<span class="fn">strip</span>()}

<span class="kw">def</span> <span class="fn">worker_node</span>(state):
    w = WORKERS[state[<span class="str">"next_worker"</span>]]
    out = w.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [(<span class="str">"user"</span>, state[<span class="str">"goal"</span>])]})
    state[<span class="str">"history"</span>].<span class="fn">append</span>((state[<span class="str">"next_worker"</span>], out))
    <span class="kw">return</span> state

graph = <span class="fn">StateGraph</span>(<span class="fn">dict</span>)
graph.<span class="fn">add_node</span>(<span class="str">"manager"</span>, manager_node)
graph.<span class="fn">add_node</span>(<span class="str">"worker"</span>, worker_node)
graph.<span class="fn">add_conditional_edges</span>(<span class="str">"manager"</span>, <span class="kw">lambda</span> s: <span class="str">"finish"</span> <span class="kw">if</span> s[<span class="str">"next_worker"</span>]==<span class="str">"finish"</span> <span class="kw">else</span> <span class="str">"worker"</span>)
graph.<span class="fn">add_edge</span>(<span class="str">"worker"</span>, <span class="str">"manager"</span>)
graph.<span class="fn">set_entry_point</span>(<span class="str">"manager"</span>)</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Üç uzmanlaşmış <code>create_react_agent</code> örneği kurulur; her biri küçücük bir tool listesine kapsamlandırılır — researcher search/arxiv alır, writer hiçbir şey almaz, coder python_exec/file_io alır. 2) <code>WORKERS</code> bir dispatch sözlüğüdür; yönetici bir worker'ı adıyla seçer. <code>manager_node</code> <code>manager_llm</code>'e hedef ve geçmiş verildiğinde hangi adı çağıracağını sorar ve seçimi <code>state["next_worker"]</code>'a yazar. 3) <code>worker_node</code> seçilen agent'ı hedef üzerinde çağırır, (worker, output) çiftini geçmişe ekler ve güncellenmiş state'i döner — worker yalnızca kendi tool'larını görür, diğerlerinin tool'larını asla. 4) Graf <code>manager → worker → manager</code>'ı koşullu kenarla bağlar; yönetici <code>"finish"</code> seçtiğinde çıkar — yeni worker'lar ekleyerek ölçeklenen klasik LangGraph dispatcher deseni, bir agent'a daha fazla tool vererek değil.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Hedefleri uzmanlaşmış worker fonksiyonlarına gönderen ve sonuçları toplayan sahte bir manager.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">researcher</span>(goal):
    facts = {<span class="str">'transformers'</span>: <span class="str">'Vaswani 2017, attention is all you need'</span>,
             <span class="str">'cnn'</span>: <span class="str">'LeCun 1989, gradient-based learning'</span>}
    <span class="kw">for</span> key, val <span class="kw">in</span> facts.<span class="fn">items</span>():
        <span class="kw">if</span> key <span class="kw">in</span> goal.<span class="fn">lower</span>(): <span class="kw">return</span> f<span class="str">'FOUND: {val}'</span>
    <span class="kw">return</span> <span class="str">'no source'</span>
<span class="kw">def</span> <span class="fn">writer</span>(brief):    <span class="kw">return</span> f<span class="str">'Article: <span class="str">"{brief[:60]}..."</span> (350 words)'</span>
<span class="kw">def</span> <span class="fn">coder</span>(spec):      <span class="kw">return</span> f'<span class="kw">def</span> <span class="fn">solve</span>(): <span class="kw">pass</span>  <span class="cm"># implements {spec[:30]}'</span>
WORKERS = {<span class="str">'researcher'</span>: researcher, <span class="str">'writer'</span>: writer, <span class="str">'coder'</span>: coder}
<span class="kw">def</span> <span class="fn">manager</span>(goal, history):
    <span class="kw">if</span> <span class="kw">not</span> history:                         <span class="kw">return</span> <span class="str">'researcher'</span>
    <span class="kw">if</span> <span class="str">'FOUND'</span> <span class="kw">in</span> <span class="fn">str</span>(history[-<span class="num">1</span>]):         <span class="kw">return</span> <span class="str">'writer'</span>
    <span class="kw">if</span> <span class="str">'Article'</span> <span class="kw">in</span> <span class="fn">str</span>(history[-<span class="num">1</span>]):       <span class="kw">return</span> <span class="str">'coder'</span>
    <span class="kw">return</span> <span class="str">'finish'</span>
goal = <span class="str">'Write an intro to transformers and stub a demo'</span>
history = []
<span class="kw">for</span> turn <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    nxt = <span class="fn">manager</span>(goal, history)
    <span class="kw">if</span> nxt == <span class="str">'finish'</span>: <span class="kw">break</span>
    out = WORKERS[nxt](goal <span class="kw">if</span> <span class="kw">not</span> history <span class="kw">else</span> <span class="fn">str</span>(history[-<span class="num">1</span>]))
    history.<span class="fn">append</span>((nxt, out))
    <span class="fn">print</span>(f<span class="str">'  turn {turn}: manager -> {nxt:10s} -> {out[:60]}'</span>)
<span class="fn">print</span>(<span class="str">'DONE in'</span>, <span class="fn">len</span>(history), <span class="str">'worker calls'</span>)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Üç uzman işçi — <code>researcher</code>, <code>writer</code>, <code>coder</code> — her biri string girdi alır ve string çıktı döner; researcher hazır gerçekleri arar, writer bir özeti makale taslağına sarar, coder fonksiyon iskeleti üretir. 2) <code>manager(goal, history)</code> deterministik bir dispatcher'dır: boş geçmiş researcher'a yönlendirir, <code>FOUND</code> sonucu writer'a teslim eder, <code>Article</code> çıktısı coder'ı tetikler, başka bir şey bitirir. 3) 5-turlu sürücü döngü yöneticiden bir sonraki worker'ı ister, <code>finish</code>'te kırar, aksi halde son geçmiş öğesini seçilen worker'a besler ve (worker, output) çiftini saklar. 4) Yazdırılan izler <code>researcher → writer → coder → finish</code> yolunu gösterir — LangGraph hiyerarşilerini ve sonraki dersteki AutoGen/CrewAI'yi güçlendiren aynı yönetici/işçi bayrak yarışı.</p>
</div>

<p class="l-text"><strong>Kazanç:</strong> her worker'ın 15 yerine 1-3 aracı vardır, böylece araç-kullanım doğruluğu fırlar. Manager'ın sıfır aracı vardır (yalnızca yönlendirme kararları), bu yüzden araç seçiminden hiç şaşırmaz. AutoGen ve CrewAI (sonraki ders) bu kalıbın tam uygulamalarıdır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Öz-Yansıma ve Öz-Eleştiri Döngüleri</h2>

<p class="l-text">Reflexion (Shinn ve ark., 2023), kendi cevabını eleştiren ve yeniden yazan bir agent'ın kodlama benchmark'larında çok daha büyük bir modelle eşleşebileceğini gösterdi. Kalıp: <strong>Aktör</strong> bir cevap üretir, <strong>Eleştirmen</strong> onu değerlendirir (görevi çözüyor mu? ne yanlış?), <strong>Reviser</strong> eleştiriyi context'e alarak yeniden yazar. Eleştirmen "yeterince iyi" deyene veya bütçe bitene kadar döngüye gir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Reflexion-style self-critique loop</span>
<span class="kw">def</span> <span class="fn">reflexion</span>(task, max_iters=<span class="num">3</span>):
    answer = actor.<span class="fn">invoke</span>(f<span class="str">"Task: {task}\nDraft an answer."</span>).content
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(max_iters):
        critique = critic.<span class="fn">invoke</span>(
            f<span class="str">"Task: {task}\nAnswer: {answer}\n"</span>
            f<span class="str">"Score 1-10 and list 3 specific issues. If score &gt;= 9, say 'DONE'."</span>
        ).content
        <span class="kw">if</span> <span class="str">"DONE"</span> <span class="kw">in</span> critique:
            <span class="kw">return</span> answer
        answer = reviser.<span class="fn">invoke</span>(
            f<span class="str">"Task: {task}\nPrevious answer: {answer}\n"</span>
            f<span class="str">"Critique: {critique}\nRewrite addressing every issue."</span>
        ).content
    <span class="kw">return</span> answer

<span class="cm"># For code tasks, replace the LLM critic with a real test runner:</span>
<span class="kw">def</span> <span class="fn">code_critic</span>(code, tests):
    <span class="kw">try</span>:
        ns = {}
        <span class="fn">exec</span>(code, ns)
        passed = <span class="fn">sum</span>(<span class="fn">int</span>(ns[<span class="str">"solve"</span>](*inp) == out) <span class="kw">for</span> inp, out <span class="kw">in</span> tests)
        <span class="kw">return</span> f<span class="str">"Passed {passed}/{<span class="fn">len</span>(tests)}. {'DONE' <span class="kw">if</span> passed == <span class="fn">len</span>(tests) <span class="kw">else</span> 'fix failing cases'}"</span>
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        <span class="kw">return</span> f<span class="str">"Crashed: {e}. Fix and try again."</span></code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>reflexion(task, max_iters=3)</code> önce <code>actor</code>'ı taslak için çağırır, sonra <code>max_iters</code> denemeyle sınırlı bir eleştiri döngüsüne girer. 2) Her iterasyonda <code>critic</code> görevi ve mevcut yanıtı okur, 1-10 puan artı üç spesifik sorun döndürür ve skor 9'u geçtiği anda literal <code>DONE</code> tokenini yayınlar — erken çıkış sinyali. 3) <code>DONE</code> yoksa <code>reviser</code> önceki yanıt artı eleştiriyle çağrılır ve her sorunu açıkça ele alan yeni bir taslak üretir — <code>answer</code> üzerine yazılır ve döngü devam eder. 4) Alttaki <code>code_critic(code, tests)</code> production hilesini gösterir: kod görevleri için LLM eleştirmenini gerçek bir test runner ile değiştirin; geçen sayısı ile birlikte tüm testler geçtiğinde literal <code>DONE</code> döner — güvenilebilir deterministik durdurma koşulu.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gerçek bir kodlama görevinde Reflexion: eleştirmen bir unit-test çalıştırıcısıdır, reviser her iterasyonda fonksiyonu yamalar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>tests = [((<span class="num">2</span>, <span class="num">3</span>), <span class="num">6</span>), ((<span class="num">4</span>, <span class="num">5</span>), <span class="num">20</span>), ((-<span class="num">1</span>, <span class="num">7</span>), -<span class="num">7</span>), ((<span class="num">0</span>, <span class="num">9</span>), <span class="num">0</span>)]
attempts = [
    <span class="str">'def solve(a, b): return a + b'</span>,         <span class="cm"># buggy</span>
    <span class="str">'def solve(a, b): return a - b'</span>,         <span class="cm"># buggy</span>
    <span class="str">'def solve(a, b): return a * b'</span>,         <span class="cm"># correct</span>
]
<span class="kw">def</span> <span class="fn">critic</span>(code):
    <span class="kw">try</span>:
        ns = {}; <span class="fn">exec</span>(code, ns)
        passed = <span class="fn">sum</span>(<span class="num">1</span> <span class="kw">for</span> inp, out <span class="kw">in</span> tests <span class="kw">if</span> ns[<span class="str">'solve'</span>](*inp) == out)
        <span class="kw">return</span> passed, <span class="fn">len</span>(tests)
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        <span class="kw">return</span> <span class="num">0</span>, <span class="fn">len</span>(tests)
<span class="kw">for</span> i, code <span class="kw">in</span> <span class="fn">enumerate</span>(attempts):
    p, t = <span class="fn">critic</span>(code)
    verdict = <span class="str">'DONE'</span> <span class="kw">if</span> p == t <span class="kw">else</span> f<span class="str">'fix {t-p} failing case(s)'</span>
    <span class="fn">print</span>(f<span class="str">'  attempt {i+1}: passed {p}/{t}  -> {verdict}'</span>)
    <span class="kw">if</span> p == t:
        <span class="fn">print</span>(f<span class="str">'  Reflexion converged after {i+1} attempt(s).'</span>)
        <span class="kw">break</span></code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>tests</code> bir çarpma fonksiyonu için dört vakalık doğruluk tablosu tanımlar — LLM puanlayıcısının yerine geçen deterministik eleştirmen. 2) <code>attempts</code> bir Reflexion trajectory'sini simüle eder: ilk ikisi kasıtlı buggy (<code>a + b</code>, <code>a - b</code>), üçüncüsü doğru (<code>a * b</code>) olan üç ardışık kod versiyonu. 3) <code>critic(code)</code> her taslağı taze bir namespace'te <code>exec</code> eder, kaç test geçtiğini sayar ve <code>(passed, total)</code> döner — yukarıdaki metinsel critic ile aynı sözleşme. 4) Döngü deneme başına bir pass/fail satırı yazdırır ve passed == total olduğu anda kırılır — Reflexion'ın cevap yeterince iyi olduğunda kullandığı early-exit'in aynası.</p>
</div>

<div class="calc-highlight"><strong>Gerçek dünyadan numara:</strong> mümkün olduğunda LLM eleştirmenini deterministik bir kontrolcüyle değiştir — kod için unit test'ler, yapılandırılmış çıktı için regex/JSON-schema, matematik için bir hesap makinesi. LLM eleştirmenleri gürültülüdür; deterministik eleştirmenler güvenebileceğin bir durdurma koşulu sunar.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Özyinelemeli Ayrıştırma: Adımlar Çok Büyük Olduğunda</h2>

<p class="l-text">Bazen bir planlayıcının "adımı" kendisi de kendi planına ihtiyaç duyan bir alt-görevdir. "SaaS landing page yap" "hero tasarla", "metin yaz", "responsive grid uygula", "analitik ekle" şeklinde ayrışır — ve "responsive grid uygula" daha da "framework seç", "scaffold", "mobil test et" şeklinde ayrışır. Özyinelemeli ayrıştırma, bir karmaşıklık eşiğinin üzerinde puan alan her adımda planlayıcıyı çalıştırır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">recursive_plan</span>(task, depth=<span class="num">0</span>, max_depth=<span class="num">3</span>):
    <span class="cm"># Stop conditions: too deep OR task is atomic</span>
    <span class="kw">if</span> depth &gt;= max_depth <span class="kw">or</span> <span class="fn">is_atomic</span>(task):
        <span class="kw">return</span> {<span class="str">"task"</span>: task, <span class="str">"action"</span>: <span class="str">"execute"</span>}
    sub_tasks = planner.<span class="fn">invoke</span>(task).steps
    <span class="kw">return</span> {
        <span class="str">"task"</span>: task,
        <span class="str">"children"</span>: [<span class="fn">recursive_plan</span>(s, depth+<span class="num">1</span>, max_depth) <span class="kw">for</span> s <span class="kw">in</span> sub_tasks]
    }

<span class="kw">def</span> <span class="fn">is_atomic</span>(task):
    <span class="cm"># LLM judge: 1 = single tool call, 10 = needs decomposition</span>
    score = <span class="fn">int</span>(judge.<span class="fn">invoke</span>(f<span class="str">"Complexity 1-10 of: {task}"</span>).content)
    <span class="kw">return</span> score &lt;= <span class="num">3</span>

<span class="kw">def</span> <span class="fn">walk_and_execute</span>(node):
    <span class="kw">if</span> <span class="str">"action"</span> <span class="kw">in</span> node:
        <span class="kw">return</span> executor.<span class="fn">invoke</span>(node[<span class="str">"task"</span>])
    results = [<span class="fn">walk_and_execute</span>(c) <span class="kw">for</span> c <span class="kw">in</span> node[<span class="str">"children"</span>]]
    <span class="kw">return</span> aggregator.<span class="fn">invoke</span>({<span class="str">"task"</span>: node[<span class="str">"task"</span>], <span class="str">"sub_results"</span>: results})

<span class="cm"># Critical: cap depth and width or you blow up the LLM bill</span></code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>recursive_plan(task, depth, max_depth)</code> ya derinlik kapağına ulaştığında ya da <code>is_atomic(task)</code> True döndüğünde durur ve <code>{"task", "action":"execute"}</code> yaprağı yayar. 2) Aksi halde <code>planner</code>'ı alt-adımlar için çağırır ve her birinde recurses; <code>{"task", "children": [...]}</code> düğümlerinden oluşan bir ağaç üretir. 3) <code>is_atomic</code> bir LLM yargıcı kullanarak karmaşıklığı 1-10 arası puanlar ve ≤ 3 olan her şeyi tek-tool görevi olarak ele alır — sonsuz ayrıştırmayı engelleyen kapı. 4) <code>walk_and_execute</code> ağacı derinlik-öncelikli dolaşır: yapraklar <code>executor</code>'a gider, iç düğümler çocuk sonuçlarını toplar ve bir ebeveyn cevabını sentezleyen <code>aggregator</code> LLM'e verir — alttaki yorum satırı gerçek bir uyarıdır, özyineleme artı adım başına LLM çağrıları maliyeti hızla patlatır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sahte bir build-website görevinde çalışan bir özyinelemeli ayrıştırma ağacı. Derinlik-2 genişleme, yapraklarda atomik görevler.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>DECOMP = {
    <span class="str">'Build SaaS landing page'</span>: [<span class="str">'Design hero'</span>, <span class="str">'Write copy'</span>, <span class="str">'Add CTA'</span>],
    <span class="str">'Design hero'</span>:             [<span class="str">'Pick layout'</span>, <span class="str">'Choose hero image'</span>],
    <span class="str">'Write copy'</span>:              [<span class="str">'Headline'</span>, <span class="str">'Subhead'</span>, <span class="str">'Bullets'</span>],
    <span class="str">'Add CTA'</span>:                 [],   <span class="cm"># atomic</span>
    <span class="str">'Pick layout'</span>: [], <span class="str">'Choose hero image'</span>: [],
    <span class="str">'Headline'</span>: [], <span class="str">'Subhead'</span>: [], <span class="str">'Bullets'</span>: [],
}
<span class="kw">def</span> <span class="fn">recursive_plan</span>(task, depth=<span class="num">0</span>, max_depth=<span class="num">3</span>):
    children = DECOMP.<span class="fn">get</span>(task, [])
    <span class="kw">if</span> depth >= max_depth <span class="kw">or</span> <span class="kw">not</span> children:
        <span class="kw">return</span> {<span class="str">'task'</span>: task, <span class="str">'leaf'</span>: <span class="kw">True</span>}
    <span class="kw">return</span> {<span class="str">'task'</span>: task, <span class="str">'children'</span>: [<span class="fn">recursive_plan</span>(c, depth+<span class="num">1</span>, max_depth) <span class="kw">for</span> c <span class="kw">in</span> children]}
tree = <span class="fn">recursive_plan</span>(<span class="str">'Build SaaS landing page'</span>)
<span class="kw">def</span> <span class="fn">walk</span>(node, indent=<span class="num">0</span>):
    <span class="fn">print</span>(<span class="str">'  '</span> * indent + (<span class="str">'* '</span> <span class="kw">if</span> node.<span class="fn">get</span>(<span class="str">'leaf'</span>) <span class="kw">else</span> <span class="str">'+ '</span>) + node[<span class="str">'task'</span>])
    <span class="kw">for</span> c <span class="kw">in</span> node.<span class="fn">get</span>(<span class="str">'children'</span>, []):
        <span class="fn">walk</span>(c, indent + <span class="num">1</span>)
<span class="fn">walk</span>(tree)
<span class="kw">def</span> <span class="fn">count_leaves</span>(n): <span class="kw">return</span> <span class="num">1</span> <span class="kw">if</span> n.<span class="fn">get</span>(<span class="str">'leaf'</span>) <span class="kw">else</span> <span class="fn">sum</span>(<span class="fn">count_leaves</span>(c) <span class="kw">for</span> c <span class="kw">in</span> n[<span class="str">'children'</span>])
<span class="fn">print</span>(f<span class="str">'Leaf actions to execute: {count_leaves(tree)}'</span>)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>DECOMP</code> sabit-kodlu bir planlayıcıdır: her görev adını çocuk alt-görevlerine eşler; boş listeler atomik yaprak demektir. 2) <code>recursive_plan(task, depth, max_depth)</code> <code>DECOMP</code>'u aşağı yönde dolaşır — görev yapraksa veya derinlik kapağa ulaşırsa <code>{"task", "leaf": True}</code> yayar, aksi halde her çocukta recurses. 3) <code>walk(node, indent)</code> ağacı dallar için <code>+</code>, yapraklar için <code>*</code> ile güzelce yazdırır; böylece tüm ayrıştırmayı bir bakışta görürsünüz. 4) <code>count_leaves(tree)</code> executor'ın çalıştıracağı tam atomik eylem sayısını söyler — gerçek bir LLM-sürücülü özyinelemeli planlayıcıyı serbest bırakmadan önce yapacağınız maliyet tahmininin deterministik karşılığı.</p>
</div>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Çoklu-Agent Üretim Yığını — MCP ve Yeni Hiyerarşi</h2>
<p class="l-text"><strong>Çoklu-agent üretim Kas 2024'ten sonra farklı görünür.</strong> MCP'den önce, bir hiyerarşideki her agent'ın elle kodlanmış araç listesi ve işçilerine özel RPC'leri vardı. MCP'den sonra, bölüm 5'teki yönetici-işçi deseni tek bir mimariye düşer: her işçi bir MCP sunucusudur, her yönetici bir MCP istemcisidir ve protokol araç tanımlarını, girdileri ve yapılandırılmış çıktıları tek tip taşır. "GUI yedek işçisi" olarak Bilgisayar Kullanımı ile birleştirildiğinde, artık herhangi bir özel entegrasyon yapıştırıcısı olmadan gerçek bir masaüstüne yayılan çoklu-agent sistemleri kurabilirsiniz.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MCP — Model Context Protocol (Anthropic, Kas 2024)</div><div class="card-body">stdio veya SSE üzerinde JSON-RPC 2.0 — LLM istemcileri ve araç sunucuları için ortak dil. ~10 referans sunucu (filesystem, GitHub, Postgres, Slack, Memory, Sentry, Puppeteer, Brave Search, AWS, Time). Çoklu-agent sistemde her alt-agent bir MCP sunucusu olur ve yönetici istemcidir.</div></div>
<div class="calc-card"><div class="card-title">Bilgisayar Kullanımı (Anthropic, Eki 2024)</div><div class="card-body">Ekran görüntüsü + ekran boyutu girer, fare/klavye eylemleri çıkar. Lansmanda OSWorld ~%14. Çoklu-agent sistemde bu "evrensel GUI işçisidir" — SDK yoksa, bir Bilgisayar Kullanımı işçisi oluşturun ve uygulamayı sürmesine izin verin.</div></div>
<div class="calc-card"><div class="card-title">Cursor Composer (Cursor AI, 2024)</div><div class="card-body">Çok-dosyalı ajansal kod editörü — bir IDE içinde "kod işçisi". Desen çalışması: sınırlı eylem alanı (dosya işlemleri + shell + testler) + sıkı geri bildirim döngüsü = güvenilir ajansal UX. Aynı kısıt setini üretim alt-agent'larınıza uygulayın.</div></div>
<div class="calc-card"><div class="card-title">Devin (Cognition, Mar 2024)</div><div class="card-body">Sandbox VM'de otonom SWE ajanı, SWE-Bench ~%13.86. Uyarı hikayesi — tamamen-otonom açık-kapsamlı ajanlar kırılgandır. Üretimde, yönetici denetimiyle daha dar kapsamları tercih edin (bölüm 5 yönetici-işçi deseni).</div></div>
<div class="calc-card"><div class="card-title">GitHub Copilot Workspace (Nis 2024)</div><div class="card-body">Gerçek CI entegrasyonuyla plan → spec → düzenle → test döngüsü. Desen çalışması: insan plan aşamasında döngüde kalır, ajanlar onaydan sonra hareket eder. Yüksek riskli çoklu-agent dağıtımları için kritik.</div></div>
</div>
<div class="calc-highlight"><strong>2026'da çoklu-agent mimarisi:</strong> yönetici, bu dersten Plan-and-Execute veya hiyerarşik planlama çalıştıran bir planlayıcı LLM'dir (Claude 3.7 / GPT-4o); işçiler MCP sunucularıdır (alan başına bir tane: kod, tarayıcı, DB, arama, GUI için Bilgisayar Kullanımı). Bellek paylaşılan bir MCP Memory sunucusudur. Yönetici işçileri MCP üzerinden çağırır, asla özel HTTP üzerinden değil. Bu üç endişeyi (araç tanımları, taşıma, şema) tek bir protokolde çökertir.</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7b. Worker'lar arası tool çağrı frekansı (ısı haritası)</h2>
<p class="l-text">Hiyerarşik manager + worker kurulumunda farklı worker'lar farklı tool'ları tercih eder. Isı haritası 200 görev üzerinde her worker'ın her tool'u ne sıklıkla çağırdığını gösterir — araştırmacılar <code>search</code>, kodlayıcılar <code>shell</code> ve <code>code_exec</code>, gözden geçirenler <code>read_file</code>'a yönelir.</p>
<div id="plot-agents-l7-toolfreq-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Tool kullanımı yüksek derecede uzmanlaşmıştır — her worker'a yalnızca gerçekten ihtiyacı olan tool'ları verin. Daha küçük worker-başına tool yüzeyi halüsine tool isimlerini azaltır ve prompt boyutunu küçültür.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Bir Planlayıcı Seçmek: Karar Tablosu</h2>

<p class="l-text">Her planlayıcının bir tatlı noktası vardır. Yanlış seç ve ya token yakarsın (doğrusal görevde ToT) ya da cevabı kaçırırsın (20-adımlı görevde ReAct). Bu tabloyu kullan:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kısa, doğrusal (1-5 adım)</div><div class="card-body"><strong>ReAct.</strong> Ucuz, hata ayıklaması kolay, hızlı başarısız olur.</div></div>
<div class="calc-card"><div class="card-title">Uzun, öngörülebilir (5-15 adım)</div><div class="card-body"><strong>ReWOO.</strong> Uzunluktan bağımsız 2 LLM çağrısı. Araçlar güvenilirken kullan.</div></div>
<div class="calc-card"><div class="card-title">Uzun, yeniden plan gerekebilir</div><div class="card-body"><strong>Plan-and-Execute.</strong> Yeniden planlayıcı başarısızlıklara tepki verir. Endüstri varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">Doğrulanabilir cevap uzayı</div><div class="card-body"><strong>Tree of Thoughts.</strong> Bir kontrolcü olduğunda (testler, simülatör).</div></div>
<div class="calc-card"><div class="card-title">Alanlar-arası görev</div><div class="card-body"><strong>Hiyerarşik.</strong> Manager + uzmanlaşmış worker'lar. L8'e bak.</div></div>
<div class="calc-card"><div class="card-title">Kalite-duyarlı çıktı</div><div class="card-body"><strong>Reflexion.</strong> Yukarıdakilerin herhangi birinin üstüne öz-eleştiri ekle.</div></div>
</div>

<div class="calc-highlight"><strong>Onları birleştir:</strong> gerçek bir production agent'ı genellikle kalıpları katmanlar. Manager hiyerarşiktir, her Worker Plan-and-Execute kullanır, yazma Worker'ı Reflexion ekler, matematik Worker'ı ToT kullanır. Tavan, hata ayıklama yeteneğindir — basit başla, ölçülmüş bir başarısızlık modu haklı çıkardığında katman ekle.</div>

<p class="l-text">8. derste "birden fazla rolü olan tek agent"tan "birbirleriyle konuşan birden fazla agent"a geçiyoruz — AutoGen group chat, CrewAI crew'ları, münazara ve oylama. Buradaki planlama becerileri temeldir: kötü planlayıcılı bir çok-agent sistem, iyi planlayıcılı tek bir agent'tan daha kötüdür.</p>
</div>`

};
