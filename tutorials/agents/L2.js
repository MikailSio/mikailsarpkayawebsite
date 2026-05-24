window.AGENTS_L2 = {
en: `<p class="l-text"><strong>ReAct is the algorithm that quietly powers most production LLM agents in 2026.</strong> The paper — <em>"ReAct: Synergizing Reasoning and Acting in Language Models"</em> by Yao, Zhao, Yu, Du, Shafran, Narasimhan, and Cao (ICLR 2023) — proposed something almost embarrassingly simple: instead of having the LLM either reason (chain-of-thought) or act (tool calling), let it do both in interleaved steps. A turn looks like <em>Thought → Action → Observation → Thought → Action → Observation → ... → Final Answer</em>. The thoughts are the agent's running internal monologue; the actions are tool calls; the observations are the tool results that come back. That single rhythm — surfacing reasoning between every action — was a substantial accuracy win over plain function calling on HotpotQA, FEVER, ALFWorld, and WebShop, and it became the de facto template for everything that followed.</p>

<p class="l-text">In this lesson we open the ReAct loop, walk through the original prompt format from the paper, and build a working ReAct agent from scratch in pure Python — no LangChain, no API keys, just a mock LLM, a few tools, and a parser. Then we look at the failure modes you will hit in week one (loops, action repeats, hallucinated tool names, "I don't know" giving up too early) and the production patches that fix them: max-step budgets, action history dedup, structured output enforcement, and the Reflexion-style self-critique add-on. By the end you should be able to read any agent framework's source code and recognize "oh, this is just ReAct with extra plumbing."</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read and write the canonical ReAct prompt: Thought / Action / Observation scratchpad</li>
<li>Implement a 60-line ReAct agent from scratch with a parser and tool dispatcher</li>
<li>Recognize and fix the four classic failure modes (loops, repeated actions, hallucinated tools, premature stopping)</li>
<li>Compare ReAct vs. raw chain-of-thought vs. raw function calling and know which to pick when</li>
<li>Add Reflexion-style self-critique to recover from failed trajectories</li>
<li>Connect ReAct to its modern descendants: function calling, LangGraph, AutoGPT's loop</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Insight Behind ReAct</h2>
<p class="l-text">Before ReAct, the field had two separate tricks. Chain-of-thought (Wei et al, 2022) showed that asking the model to "think step by step" improved arithmetic and reasoning. Tool use (Toolformer, Schick et al 2023; OpenAI function calling, June 2023) showed that letting the model call external functions improved factual accuracy. ReAct's contribution was noticing these are complementary: pure reasoning hallucinates because the model has no ground truth to check against; pure tool use is myopic because the model never plans more than one call ahead.</p>

<p class="l-text">ReAct interleaves them. Each turn the model emits a <strong>Thought</strong> (free-form reasoning, often a one-liner: "I should search for the population of Istanbul first"), then an <strong>Action</strong> (a structured tool call), then receives back an <strong>Observation</strong> (the tool's output). The Thought is the model's plan-of-the-moment; it is conditioned on all previous Observations, so it adapts. The Action is grounded; it cannot hallucinate facts because it has to query a real source. The Observation closes the loop and feeds the next Thought.</p>

<div class="calc-highlight"><strong>Key insight (Yao et al 2023):</strong> reasoning helps acting (better tool choice and argument crafting), and acting helps reasoning (observations correct the model's beliefs before they snowball into hallucinations). Neither alone is as strong as the interleaving.</div>

<p class="l-text">On HotpotQA (multi-hop QA over Wikipedia), ReAct beat both CoT-only and Action-only baselines, especially when CoT alone hallucinated a false intermediate fact. On ALFWorld and WebShop (interactive task environments), ReAct was the first prompting approach to outperform imitation-learning baselines. The paper is short and worth reading in full.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Canonical Prompt Format</h2>
<p class="l-text">The original ReAct prompt is plain text — no JSON, no XML, no special tokens. The model is given a few-shot example of the format and asked to continue. Here is the structure, lifted from Appendix C of the paper.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SYSTEM_PROMPT = <span class="str">"""Answer the following question using interleaved Thought, Action, Observation steps.
Available actions:
- search(query: str)   : returns top web result text
- lookup(keyword: str) : returns nearest passage in current page
- finish(answer: str)  : ends the loop with the final answer

Format strictly:
Thought: &lt;your reasoning, one or two sentences&gt;
Action: &lt;name&gt;[&lt;arg&gt;]
Observation: &lt;tool returns this; do not write it yourself&gt;

Repeat until you can answer, then call finish[answer]."""</span>

<span class="cm"># Few-shot example baked into the prompt:</span>
EXAMPLE = <span class="str">"""Question: Who was the 2nd president of Turkey?
Thought: I need to search the history of Turkish presidents.
Action: search[Turkish presidents list]
Observation: The presidents of Turkey include Mustafa Kemal Ataturk (1923-1938), Ismet Inonu (1938-1950), ...
Thought: The 2nd president was Ismet Inonu. I will finish.
Action: finish[Ismet Inonu]
"""</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a <code>SYSTEM_PROMPT</code> string that lists the three available actions (<code>search</code>, <code>lookup</code>, <code>finish</code>) and pins the rigid <code>Thought / Action / Observation</code> grammar the model must emit. 2) Tells the model explicitly that the runtime — not the model — produces <code>Observation:</code> lines, so it should never invent them. 3) Caps the loop with <code>finish[answer]</code> as the only legal stop signal, preventing the trailing-off failure mode. 4) Appends a few-shot <code>EXAMPLE</code> trajectory inside the same prompt; the example doubles as a format demonstration and a behavioral anchor so the first real generation matches the parser.</p>

<p class="l-text">Notice three design choices: (1) the action grammar is human-readable (<code>name[arg]</code>) rather than JSON, which the paper found gave better results with the GPT-3 era models — modern models do fine with JSON; (2) the <code>finish</code> action is the only way to stop, which prevents the model from trailing off; (3) the few-shot example does double duty as format demonstration and behavioral anchor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Original ReAct (2023)</div><div class="card-body">Plain text, regex-parsed actions like <code>search[query]</code>. Simple, model-agnostic, but parsing is brittle when the model deviates.</div></div>
<div class="calc-card"><div class="card-title">Function calling ReAct (2024+)</div><div class="card-body">The Thought is in the message <code>content</code>, the Action is a structured <code>tool_calls</code> field. Same algorithm, JSON-safe parsing. This is what 99% of production code does today.</div></div>
<div class="calc-card"><div class="card-title">XML-tagged ReAct (Anthropic style)</div><div class="card-body">Claude prompted with <code>&lt;thinking&gt;...&lt;/thinking&gt;</code> + <code>&lt;tool_use&gt;...&lt;/tool_use&gt;</code> tags. Same algorithm, easier to parse than free text. Used heavily in Claude's tool-use guides.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Building ReAct From Scratch (Mock LLM, Runnable)</h2>
<p class="l-text">Here is a complete working ReAct agent in pure Python. The only fiction is that <code>fake_llm</code> stands in for a real model — it returns scripted Thought/Action pairs based on simple state matching. Replace <code>fake_llm</code> with an OpenAI or Anthropic call and the rest of the code is production-ready.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Full ReAct loop with parser, tool registry, and a deterministic mock LLM that simulates a real Wikipedia-style multi-hop question. Watch the Thought / Action / Observation rhythm in the printed trace.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

<span class="cm"># 1. Tools</span>
KB = {<span class="str">"istanbul population"</span>: <span class="str">"Istanbul population (2024): 15.6 million."</span>,
      <span class="str">"ankara population"</span>:   <span class="str">"Ankara population (2024): 5.7 million."</span>,
      <span class="str">"turkey capital"</span>:      <span class="str">"The capital of Turkey is Ankara."</span>}

<span class="kw">def</span> <span class="fn">search</span>(q): <span class="kw">return</span> KB.<span class="fn">get</span>(q.<span class="fn">lower</span>().<span class="fn">strip</span>(), f<span class="str">"No result for '{q}'."</span>)
<span class="kw">def</span> <span class="fn">calculator</span>(expr):
    <span class="kw">try</span>: <span class="kw">return</span> <span class="fn">str</span>(<span class="fn">eval</span>(expr, {<span class="str">"__builtins__"</span>:{}}, {}))
    <span class="kw">except</span> Exception <span class="kw">as</span> e: <span class="kw">return</span> f<span class="str">"calc error: {e}"</span>
<span class="kw">def</span> <span class="fn">finish</span>(answer): <span class="kw">return</span> (<span class="str">"FINISH"</span>, answer)
TOOLS = {<span class="str">"search"</span>: search, <span class="str">"calculator"</span>: calculator, <span class="str">"finish"</span>: finish}

<span class="cm"># 2. Mock LLM that produces a ReAct trajectory</span>
<span class="kw">def</span> <span class="fn">fake_llm</span>(scratchpad):
    text = <span class="str">"\\n"</span>.<span class="fn">join</span>(scratchpad).<span class="fn">lower</span>()
    <span class="kw">if</span> <span class="str">"no result"</span> <span class="kw">in</span> text <span class="kw">and</span> <span class="str">"istanbul population"</span> <span class="kw">not</span> <span class="kw">in</span> text:
        <span class="kw">return</span> <span class="str">"Thought: I should search Istanbul's population.\\nAction: search[istanbul population]"</span>
    <span class="kw">if</span> <span class="str">"no result"</span> <span class="kw">in</span> text <span class="kw">and</span> <span class="str">"ankara population"</span> <span class="kw">not</span> <span class="kw">in</span> text:
        <span class="kw">return</span> <span class="str">"Thought: I also need Ankara's population.\\nAction: search[ankara population]"</span>
    <span class="kw">if</span> <span class="str">"istanbul population"</span> <span class="kw">in</span> text <span class="kw">and</span> <span class="str">"ankara population"</span> <span class="kw">in</span> text <span class="kw">and</span> <span class="str">"calc"</span> <span class="kw">not</span> <span class="kw">in</span> text:
        <span class="kw">return</span> <span class="str">"Thought: Now compute the difference 15.6 - 5.7.\\nAction: calculator[15.6 - 5.7]"</span>
    <span class="kw">if</span> <span class="str">"9.9"</span> <span class="kw">in</span> text:
        <span class="kw">return</span> <span class="str">"Thought: The difference is ~9.9 million.\\nAction: finish[Istanbul has ~9.9 million more people than Ankara.]"</span>
    <span class="kw">return</span> <span class="str">"Thought: Start by searching Istanbul.\\nAction: search[istanbul population]"</span>

<span class="cm"># 3. Parser</span>
ACTION_RE = re.<span class="fn">compile</span>(r<span class="str">"Action:\\s*(\\w+)\\[(.*?)\\]"</span>, re.DOTALL)
<span class="kw">def</span> <span class="fn">parse</span>(text):
    m = ACTION_RE.<span class="fn">search</span>(text)
    <span class="kw">if</span> <span class="kw">not</span> m: <span class="kw">return</span> <span class="kw">None</span>, <span class="kw">None</span>
    <span class="kw">return</span> m.<span class="fn">group</span>(<span class="num">1</span>).<span class="fn">strip</span>(), m.<span class="fn">group</span>(<span class="num">2</span>).<span class="fn">strip</span>()

<span class="cm"># 4. Loop</span>
<span class="kw">def</span> <span class="fn">react</span>(question, max_steps=<span class="num">8</span>):
    scratch = [f<span class="str">"Question: {question}"</span>]
    <span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(max_steps):
        out = <span class="fn">fake_llm</span>(scratch)
        scratch.<span class="fn">append</span>(out)
        <span class="fn">print</span>(f<span class="str">"--- step {step} ---\\n{out}"</span>)
        name, arg = <span class="fn">parse</span>(out)
        <span class="kw">if</span> name <span class="kw">is</span> <span class="kw">None</span>:
            <span class="fn">print</span>(<span class="str">"PARSE FAIL"</span>); <span class="kw">break</span>
        <span class="kw">if</span> name == <span class="str">"finish"</span>:
            <span class="fn">print</span>(f<span class="str">"\\nFINAL ANSWER: {arg}"</span>); <span class="kw">return</span> arg
        obs = TOOLS.<span class="fn">get</span>(name, <span class="kw">lambda</span> a: f<span class="str">"unknown tool {name}"</span>)(arg)
        scratch.<span class="fn">append</span>(f<span class="str">"Observation: {obs}"</span>)
        <span class="fn">print</span>(f<span class="str">"Observation: {obs}"</span>)
    <span class="fn">print</span>(<span class="str">"MAX STEPS reached"</span>); <span class="kw">return</span> <span class="kw">None</span>

<span class="fn">react</span>(<span class="str">"How many more people live in Istanbul than Ankara?"</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a small <code>TOOLS</code> registry — <code>search</code> reads from a tiny <code>KB</code> dict, <code>calculator</code> evals an arithmetic expression in a sandbox, <code>finish</code> tags the trajectory as done. 2) <code>fake_llm(scratch)</code> stands in for a real model: it inspects the running scratchpad text and returns scripted <code>Thought / Action</code> pairs that simulate a multi-hop reasoning trace. 3) <code>ACTION_RE</code> parses the last line of each model output into <code>(name, arg)</code>; the runtime dispatches via <code>TOOLS[name](arg)</code> and appends an <code>Observation: ...</code> line back to <code>scratch</code>. 4) The <code>react()</code> driver caps at <code>max_steps=8</code>, prints each step, and exits cleanly when <code>name == "finish"</code> — swap <code>fake_llm</code> for an Anthropic or OpenAI call and the loop is production-ready.</p>
</div>

<p class="l-text">Run it and read the trace. Notice: (1) the agent does two searches before computing, because each Observation updates its plan; (2) the calculator is called only after both facts are in the scratchpad; (3) the loop terminates cleanly via <code>finish[]</code>. Swap <code>fake_llm</code> for a real Anthropic <code>messages.create()</code> call and you have a real ReAct agent.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Four Classic Failure Modes</h2>
<p class="l-text">Run a real ReAct agent against a non-trivial task and you will see all four of these within an hour. They are well-studied; each has a standard fix.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Infinite loops</div><div class="card-body"><strong>Symptom:</strong> agent keeps emitting the same Action with the same args. <strong>Cause:</strong> the Observation does not give it new information, so the next Thought looks identical to the last. <strong>Fix:</strong> hard <code>max_steps</code> cap (always); deduplication of (action, args) pairs; explicit "if you have tried this and it failed, try a different approach" in system prompt.</div></div>
<div class="calc-card"><div class="card-title">2. Action repeats</div><div class="card-body"><strong>Symptom:</strong> agent calls the same search twice in a row. <strong>Cause:</strong> the model forgot it already called it (drift in long context) or thinks the result was a fluke. <strong>Fix:</strong> show the model a deduped action history; cache identical calls and return a "you already called this with result X" observation.</div></div>
<div class="calc-card"><div class="card-title">3. Hallucinated tools</div><div class="card-body"><strong>Symptom:</strong> agent emits <code>Action: magic_solver[problem]</code> when no such tool exists. <strong>Cause:</strong> tool list is too long, descriptions too vague, or the model is weak. <strong>Fix:</strong> validate tool name on parse and return an Observation like "ERROR: tool 'magic_solver' not found. Available: [search, calculator, finish]"; use function calling instead of free text.</div></div>
<div class="calc-card"><div class="card-title">4. Premature finish</div><div class="card-body"><strong>Symptom:</strong> agent calls <code>finish["I don't know"]</code> on step 1. <strong>Cause:</strong> model is risk-averse or thinks the question is unanswerable. <strong>Fix:</strong> system prompt: "Only call finish when you have evidence from at least one Observation. If you do not know, search or ask for clarification first."</div></div>
</div>

<div class="calc-highlight"><strong>Production rule:</strong> every ReAct agent should have, at minimum, a max-step budget, an action-history deduplicator, a tool-name validator with a helpful error Observation, and a per-call cost meter. These four cost ~30 lines of code and save you from 90% of incidents.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Adding Reflexion (Self-Critique Across Tries)</h2>
<p class="l-text">ReAct fixes within-trajectory reasoning. <strong>Reflexion</strong> (Shinn, Cassano, Berman, Gopinath, Narasimhan, Yao — NeurIPS 2023) adds across-trajectory learning. After a ReAct run fails (e.g., the final answer is wrong, or the agent hit max steps), an LLM critic reads the entire trajectory and writes a short verbal "lesson learned" — for example, <em>"I should have searched for the country before the city."</em> The lesson is appended to the system prompt of the next try. Over a handful of tries, the agent gets dramatically better on tasks like HumanEval coding and Hotpot QA.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mini-Reflexion: after each failed try, a "critic" generates a one-line lesson; the next try sees the lesson in its prompt. We simulate two tries — first fails, second succeeds because the lesson tells it to compute differently.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">attempt</span>(question, lessons):
    <span class="str">"""One ReAct attempt; returns (success_bool, trajectory)."""</span>
    traj = [f<span class="str">"Question: {question}"</span>, f<span class="str">"Lessons: {lessons}"</span>]
    <span class="cm"># Try 1 (no lessons): forgets to convert units</span>
    <span class="kw">if</span> <span class="kw">not</span> lessons:
        traj += [<span class="str">"Thought: distance is 100 + 50 = 150"</span>,
                 <span class="str">"Action: finish[150]"</span>]
        <span class="kw">return</span> <span class="kw">False</span>, traj
    <span class="cm"># Try 2 (with lesson): remembers to convert km to m</span>
    traj += [<span class="str">"Thought: lesson says watch units. 100 km = 100000 m, 50 km = 50000 m."</span>,
             <span class="str">"Thought: total = 150000 m"</span>,
             <span class="str">"Action: finish[150000]"</span>]
    <span class="kw">return</span> <span class="kw">True</span>, traj

<span class="kw">def</span> <span class="fn">critic</span>(trajectory, expected):
    <span class="str">"""LLM-as-judge writes a one-line lesson from a failed trajectory."""</span>
    last = trajectory[-<span class="num">1</span>]
    <span class="kw">if</span> <span class="str">"150]"</span> <span class="kw">in</span> last <span class="kw">and</span> expected == <span class="num">150000</span>:
        <span class="kw">return</span> <span class="str">"Watch units. The question asked for meters, not kilometers."</span>
    <span class="kw">return</span> <span class="str">"Be more careful next time."</span>

question = <span class="str">"Total distance: leg A is 100 km, leg B is 50 km. How many meters total?"</span>
expected = <span class="num">150000</span>
lessons = <span class="str">""</span>
<span class="kw">for</span> trial <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    <span class="fn">print</span>(f<span class="str">"\\n=== TRIAL {trial+1}, lessons='{lessons}' ==="</span>)
    ok, traj = <span class="fn">attempt</span>(question, lessons)
    <span class="kw">for</span> line <span class="kw">in</span> traj: <span class="fn">print</span>(line)
    <span class="kw">if</span> ok:
        <span class="fn">print</span>(<span class="str">"\\n[SUCCESS] Reflexion converged."</span>); <span class="kw">break</span>
    lessons = <span class="fn">critic</span>(traj, expected)
    <span class="fn">print</span>(f<span class="str">"\\n[critic lesson] {lessons}"</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>attempt(question, lessons)</code> simulates a ReAct run that consumes the verbal <code>lessons</code> string — with no lesson it forgets the km-to-m conversion and returns the wrong answer 150; with the lesson it converts units correctly and returns 150000. 2) <code>critic(trajectory, expected)</code> plays the LLM-as-judge role: it reads the failed trajectory's last line and emits a one-sentence lesson ("Watch units...") that gets fed into the next attempt. 3) The outer <code>for trial in range(3)</code> loop is the Reflexion outer loop — try, check <code>ok</code>, ask the critic for a lesson, retry with the lesson in the prompt. 4) Convergence happens in 2 trials here; in real Reflexion the lessons accumulate across runs and the system prompt grows by a few sentences each failure.</p>
</div>

<p class="l-text">Reflexion is the classical example of an LLM agent that <em>learns</em> within a single user session. It does not update model weights — the learning is verbal, in the system prompt — but it functions as in-context fine-tuning. Modern agent products quietly use this pattern under labels like "self-correction", "iterative refinement", and "evaluator loop".</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ReAct vs. Pure CoT vs. Pure Function Calling</h2>
<p class="l-text">When should you pick which? In 2026, the answer depends on task structure and how strong your model is.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chain-of-Thought only</div><div class="card-body"><strong>Use when:</strong> task is purely reasoning over given context (no external info needed). Example: math word problems, single-document reading comprehension, code review of a snippet. <strong>Risk:</strong> hallucination if the model lacks the fact.</div></div>
<div class="calc-card"><div class="card-title">Function calling, single turn</div><div class="card-body"><strong>Use when:</strong> task is "look something up and report it" — one tool call answers everything. Example: weather, currency conversion, a single SQL query. <strong>Risk:</strong> none beyond the tool's own errors.</div></div>
<div class="calc-card"><div class="card-title">ReAct (multi-turn function calling)</div><div class="card-body"><strong>Use when:</strong> task needs multiple tool calls AND the choice of next call depends on previous results. Example: multi-hop QA, debugging by reading then editing files, web research. This is the modal agent task.</div></div>
<div class="calc-card"><div class="card-title">Plan-and-Execute</div><div class="card-body"><strong>Use when:</strong> task is long-horizon and the plan is stable. Generate a checklist up front (a "plan"), then execute each item with a small ReAct sub-agent. Better cost control, easier to resume on failure. Used in Devin, AutoGPT, LangGraph.</div></div>
</div>

<p class="l-text">Empirically, with GPT-4 / Claude Sonnet 4.5+ class models, ReAct with a max-step budget of 6–10 handles most real-world agent tasks. Plan-and-Execute helps when tasks regularly exceed 15 steps. CoT-only and single-turn function calling are not "weaker" — they are the right answer when the task does not need a loop.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Modern Descendants: From ReAct to Computer Use</h2>
<p class="l-text">Once you see ReAct, you see it everywhere. The lineage is direct.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenAI function calling (Jun 2023)</div><div class="card-body">ReAct with structured Action. The "Thought" lives in the assistant message content; the "Action" is the <code>tool_calls</code> field. Loop the API in a while-loop. This is what 90% of agents in the wild do.</div></div>
<div class="calc-card"><div class="card-title">Claude tool use (Mar 2024)</div><div class="card-body">Same shape, slightly different API. <code>tool_use</code> blocks in the assistant turn, <code>tool_result</code> blocks in the user turn. Anthropic encourages <code>&lt;thinking&gt;</code> tags for the Thought.</div></div>
<div class="calc-card"><div class="card-title">LangGraph (Jan 2024)</div><div class="card-body">ReAct as a state machine. Nodes = LLM call or tool call. Conditional edges = the Thought→Action parsing. Adds checkpointing, replay, human-in-the-loop. Same algorithm, more infrastructure.</div></div>
<div class="calc-card"><div class="card-title">Computer Use (Oct 2024)</div><div class="card-body">ReAct where the tool is a screenshot + mouse/keyboard. Observation = pixels of the screen. Action = "click(x,y)" or "type('hello')". The loop is identical.</div></div>
</div>

<p class="l-text">The takeaway: there is no separate "computer use algorithm" or "browser agent algorithm" — they are all ReAct with different tool surfaces. Master the loop and the parser, and you can read any agent codebase fluently.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7b. ReAct trace timeline (visual)</h2>
<p class="l-text">A concrete HotpotQA-style trace: thoughts are short bursts, search/wiki actions dominate latency, the final answer is a short reasoning step. Each bar is one step; colour encodes step type.</p>
<div id="plot-agents-l2-trace-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var grid = 'rgba(255,255,255,0.06)';
  var steps = ['1. Thought','2. Action: search','3. Observation','4. Thought','5. Action: lookup','6. Observation','7. Thought','8. Action: finish'];
  var dur   = [120, 680, 90, 130, 540, 80, 110, 60];
  var kind  = ['Thought','Action','Observation','Thought','Action','Observation','Thought','Action'];
  var palette = {Thought: accent, Action: '#6aa9ff', Observation: '#4de87a'};
  var colors = kind.map(function(k){return palette[k];});
  var data = [{ x: dur.slice().reverse(), y: steps.slice().reverse(), type:'bar', orientation:'h',
    marker:{color: colors.slice().reverse()}, text: kind.slice().reverse(), textposition:'outside',
    hovertemplate:'%{y}<br>%{x} ms<extra>%{text}</extra>' }];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'duration (ms)', gridcolor:grid}, yaxis:{gridcolor:grid, automargin:true},
    margin:{t:50,r:60,b:60,l:160}, title:{text:'ReAct trace — step duration by type', font:{color:text, size:14}}, height:380, showlegend:false };
  Plotly.newPlot('plot-agents-l2-trace-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-agents-l2-trace-tr');
  if (trDiv) Plotly.newPlot('plot-agents-l2-trace-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Tool-call actions dominate wall-clock latency in a ReAct loop; thoughts and observations are nearly free. Optimisations target tool calls (caching, parallelism), not the LLM "thinking" steps.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">ReAct is the algorithm: Thought, Action, Observation, repeat until <code>finish</code>. Sixty lines of Python and a parser is enough to build it; the framework wrappers are convenience. The hard parts are not the loop but the prompt design, the tool descriptions, the failure handling, and the eval.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>ReAct interleaves reasoning (Thought) and acting (Action) so each corrects the other.</li>
<li>The original prompt format is plain text with a regex-parsed action grammar; modern systems use JSON via function calling.</li>
<li>Four failure modes (loops, action repeats, hallucinated tools, premature finish) all have standard 5-line fixes.</li>
<li>Reflexion adds verbal "lessons learned" across tries — in-context learning without weight updates.</li>
<li>Pure CoT, single-turn function calling, ReAct, and Plan-and-Execute each have a sweet spot. Pick by task structure, not framework hype.</li>
<li>Function calling, Claude tool use, LangGraph, and Computer Use are all ReAct with different surfaces.</li>
</ul>
</div>

<p class="l-text">In <strong>agents-L3</strong> we go deep on the structured side: JSON schemas for tools, OpenAI function calling vs. Anthropic tool_use API formats, runtime dispatch patterns, parallel and concurrent tool calls (gpt-4 / Claude Sonnet 4.6 both support these), retry policies, schema validation with Pydantic, and the production-grade error handling that turns a flaky demo into a shippable product.</p>
</div>`,

tr: `<p class="l-text"><strong>ReAct, 2026'da production LLM ajanlarının çoğunu sessizce çalıştıran algoritmadır.</strong> Makale — Yao, Zhao, Yu, Du, Shafran, Narasimhan ve Cao'dan <em>"ReAct: Synergizing Reasoning and Acting in Language Models"</em> (ICLR 2023) — neredeyse mahcup edici kadar basit bir şey önerdi: LLM'in ya reasoning (chain-of-thought) ya da acting (tool calling) yapması yerine, bunları iç içe adımlarda ikisini birden yapmasına izin ver. Bir tür şuna benziyor: <em>Thought → Action → Observation → Thought → Action → Observation → ... → Final Answer</em>. Düşünceler, ajanın akan iç monologu; eylemler tool çağrıları; gözlemler ise geri dönen tool sonuçları. Bu tek ritim — her eylemin arasına reasoning'i çıkarmak — HotpotQA, FEVER, ALFWorld ve WebShop'ta düz function calling'e karşı önemli bir doğruluk kazancıydı ve sonrası için fiili şablon haline geldi.</p>

<p class="l-text">Bu derste ReAct döngüsünü açıyor, makaledeki orijinal prompt formatını adım adım gösteriyor ve saf Python'da sıfırdan çalışan bir ReAct ajanı kuruyoruz — LangChain yok, API key yok, sadece bir mock LLM, birkaç tool ve bir parser. Sonra ilk haftada karşılaşacağın hata modlarına bakıyoruz (döngüler, eylem tekrarları, halüsine tool isimleri, çok erken "bilmiyorum" diyerek pes etme) ve onları düzelten production yamalarına: max-step bütçesi, eylem geçmişi dedup, structured output zorlaması ve Reflexion-tipi öz-eleştiri eklentisi. Sonunda herhangi bir agent framework'ünün kaynak kodunu okuyup "ah, bu sadece extra plumbing'li ReAct" diyebiliyor olmalısın.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Kanonik ReAct prompt'unu okumak ve yazmak: Thought / Action / Observation scratchpad</li>
<li>Parser ve tool dispatcher ile sıfırdan 60 satırlık ReAct ajanı kurmak</li>
<li>Dört klasik hata modunu (döngüler, tekrarlanan eylemler, halüsine tool'lar, erken durma) tanımak ve düzeltmek</li>
<li>ReAct'i ham CoT ve ham function calling ile karşılaştırmak ve hangisini ne zaman seçeceğini bilmek</li>
<li>Başarısız trajectory'lerden toparlanmak için Reflexion-tipi öz-eleştiri eklemek</li>
<li>ReAct'i modern torunlarına bağlamak: function calling, LangGraph, AutoGPT döngüsü</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. ReAct'in Arkasındaki İçgörü</h2>
<p class="l-text">ReAct'ten önce alanın iki ayrı numarası vardı. Chain-of-thought (Wei vd., 2022) modele "adım adım düşün" demenin aritmetik ve reasoning'i iyileştirdiğini gösterdi. Tool use (Toolformer, Schick vd. 2023; OpenAI function calling, Haz 2023) modelin dış fonksiyonları çağırmasının olgusal doğruluğu artırdığını gösterdi. ReAct'in katkısı bunların tamamlayıcı olduğunu fark etmek oldu: saf reasoning halüsinasyon görür çünkü modelin sınanacak ground truth'u yok; saf tool use miyoptur çünkü model bir çağrıdan ileriye plan yapamaz.</p>

<p class="l-text">ReAct ikisini iç içe geçirir. Her turda model bir <strong>Thought</strong> (serbest-form reasoning, çoğu zaman tek satır: "Önce İstanbul'un nüfusunu aramalıyım"), sonra bir <strong>Action</strong> (yapılandırılmış tool çağrısı) yayar, sonra bir <strong>Observation</strong> (tool çıktısı) alır. Düşünce, modelin o anki planıdır; tüm önceki gözlemlere koşulludur, böylece adapte olur. Eylem topraklanmıştır; gerçekleri halüsine edemez çünkü gerçek bir kaynaktan sorgulamak zorunda. Gözlem döngüyü kapatır ve sonraki düşünceyi besler.</p>

<div class="calc-highlight"><strong>Anahtar içgörü (Yao vd. 2023):</strong> reasoning, acting'e yardım eder (daha iyi tool seçimi ve argüman üretimi); ve acting, reasoning'e yardım eder (gözlemler modelin inançlarını halüsinasyona dönüşmeden düzeltir). Hiçbiri tek başına iç içe geçirme kadar güçlü değildir.</div>

<p class="l-text">HotpotQA'da (Wikipedia üzerinde çok-atlı QA) ReAct hem CoT-only hem de Action-only baseline'larını yendi, özellikle CoT'un yanlış bir ara olguyu halüsine ettiği yerlerde. ALFWorld ve WebShop'ta (etkileşimli görev ortamları) ReAct, imitation-learning baseline'larını geçen ilk prompting yaklaşımı oldu. Makale kısa ve baştan sona okumaya değer.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kanonik Prompt Formatı</h2>
<p class="l-text">Orijinal ReAct prompt'u düz metindir — JSON yok, XML yok, özel token yok. Modele formatın few-shot örneği verilir ve devam etmesi istenir. İşte makalenin Appendix C'sinden alınmış yapı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SYSTEM_PROMPT = <span class="str">"""Asagidaki soruyu ic ice Thought, Action, Observation adimlariyla cevapla.
Mevcut eylemler:
- search(query: str)   : top web sonucu metnini doner
- lookup(keyword: str) : mevcut sayfadaki en yakin pasaji doner
- finish(answer: str)  : nihai cevapla donguyu bitirir

Format kati:
Thought: &lt;reasoning, bir-iki cumle&gt;
Action: &lt;name&gt;[&lt;arg&gt;]
Observation: &lt;tool bunu doner; sen yazma&gt;

Cevap verebilene kadar tekrarla, sonra finish[answer] cagir."""</span>

<span class="cm"># Prompt'a gomulu few-shot ornek:</span>
EXAMPLE = <span class="str">"""Soru: Turkiye'nin 2. cumhurbaskani kim?
Thought: Turk cumhurbaskanlarinin tarihini aramaliyim.
Action: search[Turk cumhurbaskanlari listesi]
Observation: Turkiye cumhurbaskanlari arasinda Mustafa Kemal Ataturk (1923-1938), Ismet Inonu (1938-1950), ...
Thought: 2. cumhurbaskani Ismet Inonu. Bitiriyorum.
Action: finish[Ismet Inonu]
"""</span>
</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Mevcut üç eylemi (<code>search</code>, <code>lookup</code>, <code>finish</code>) listeleyen ve modelin uymak zorunda olduğu katı <code>Thought / Action / Observation</code> dilbilgisini sabitleyen bir <code>SYSTEM_PROMPT</code> tanımlar. 2) <code>Observation:</code> satırlarını modelin değil runtime'ın üreteceğini açıkça söyler; böylece model bunları uydurmaz. 3) Yasal tek durma sinyali olarak <code>finish[answer]</code>'i belirler ve sürüklenip gitme hatasını engeller. 4) Aynı prompt'a few-shot bir <code>EXAMPLE</code> trajectory'si ekler; örnek hem format gösterimi hem de davranışsal bir demir görevi görür — ilk gerçek çıktının parser'a uymasını sağlar.</p>

<p class="l-text">Üç tasarım kararına dikkat: (1) eylem dilbilgisi insan-okunur (<code>name[arg]</code>), JSON değil — makale GPT-3 dönemi modellerinde bunun daha iyi sonuç verdiğini buldu, modern modeller JSON ile gayet iyi; (2) <code>finish</code> eylemi durmanın tek yolu, bu modelin sürüklenip gitmesini önler; (3) few-shot örnek hem format gösterimi hem davranışsal demir görevi yapar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Orijinal ReAct (2023)</div><div class="card-body">Düz metin, regex-parse edilen <code>search[query]</code> gibi eylemler. Basit, model-bağımsız ama model saparsa parsing kırılgan.</div></div>
<div class="calc-card"><div class="card-title">Function calling ReAct (2024+)</div><div class="card-body">Düşünce mesaj <code>content</code>'inde, eylem yapılandırılmış <code>tool_calls</code> alanında. Aynı algoritma, JSON-güvenli parsing. Bugün production kodun %99'u bunu yapıyor.</div></div>
<div class="calc-card"><div class="card-title">XML-tag'li ReAct (Anthropic stili)</div><div class="card-body">Claude <code>&lt;thinking&gt;...&lt;/thinking&gt;</code> + <code>&lt;tool_use&gt;...&lt;/tool_use&gt;</code> tag'leriyle prompt'lanır. Aynı algoritma, serbest metinden parse'ı daha kolay. Claude tool-use kılavuzlarında yoğun kullanılıyor.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ReAct'i Sıfırdan İnşa Etmek (Mock LLM, Çalışır)</h2>
<p class="l-text">İşte saf Python'da tam çalışan bir ReAct ajanı. Tek kurgu, <code>fake_llm</code>'in gerçek bir model yerine geçmesi — basit durum eşlemesine göre senaryolu Thought/Action çiftleri döndürüyor. <code>fake_llm</code>'i bir OpenAI veya Anthropic çağrısıyla değiştir; geri kalan kod production-hazır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Parser, tool registry ve gerçek bir Wikipedia-tarzı çok-atlı soruyu simüle eden deterministik mock LLM ile tam ReAct döngüsü. Yazdırılan trace'te Thought / Action / Observation ritmini izle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re

<span class="cm"># 1. Tool'lar</span>
KB = {<span class="str">"istanbul nufus"</span>: <span class="str">"Istanbul nufusu (2024): 15.6 milyon."</span>,
      <span class="str">"ankara nufus"</span>:   <span class="str">"Ankara nufusu (2024): 5.7 milyon."</span>,
      <span class="str">"turkiye baskent"</span>: <span class="str">"Turkiye'nin baskenti Ankara'dir."</span>}

<span class="kw">def</span> <span class="fn">search</span>(q): <span class="kw">return</span> KB.<span class="fn">get</span>(q.<span class="fn">lower</span>().<span class="fn">strip</span>(), f<span class="str">"'{q}' icin sonuc yok."</span>)
<span class="kw">def</span> <span class="fn">calculator</span>(expr):
    <span class="kw">try</span>: <span class="kw">return</span> <span class="fn">str</span>(<span class="fn">eval</span>(expr, {<span class="str">"__builtins__"</span>:{}}, {}))
    <span class="kw">except</span> Exception <span class="kw">as</span> e: <span class="kw">return</span> f<span class="str">"calc hata: {e}"</span>
<span class="kw">def</span> <span class="fn">finish</span>(answer): <span class="kw">return</span> (<span class="str">"FINISH"</span>, answer)
TOOLS = {<span class="str">"search"</span>: search, <span class="str">"calculator"</span>: calculator, <span class="str">"finish"</span>: finish}

<span class="cm"># 2. ReAct trajectory ureten mock LLM</span>
<span class="kw">def</span> <span class="fn">fake_llm</span>(scratchpad):
    text = <span class="str">"\\n"</span>.<span class="fn">join</span>(scratchpad).<span class="fn">lower</span>()
    <span class="kw">if</span> <span class="str">"sonuc yok"</span> <span class="kw">in</span> text <span class="kw">and</span> <span class="str">"istanbul nufus"</span> <span class="kw">not</span> <span class="kw">in</span> text:
        <span class="kw">return</span> <span class="str">"Thought: Once Istanbul'un nufusunu aramaliyim.\\nAction: search[istanbul nufus]"</span>
    <span class="kw">if</span> <span class="str">"sonuc yok"</span> <span class="kw">in</span> text <span class="kw">and</span> <span class="str">"ankara nufus"</span> <span class="kw">not</span> <span class="kw">in</span> text:
        <span class="kw">return</span> <span class="str">"Thought: Ayrica Ankara'nin nufusu lazim.\\nAction: search[ankara nufus]"</span>
    <span class="kw">if</span> <span class="str">"istanbul nufus"</span> <span class="kw">in</span> text <span class="kw">and</span> <span class="str">"ankara nufus"</span> <span class="kw">in</span> text <span class="kw">and</span> <span class="str">"calc"</span> <span class="kw">not</span> <span class="kw">in</span> text:
        <span class="kw">return</span> <span class="str">"Thought: Simdi farki hesapla 15.6 - 5.7.\\nAction: calculator[15.6 - 5.7]"</span>
    <span class="kw">if</span> <span class="str">"9.9"</span> <span class="kw">in</span> text:
        <span class="kw">return</span> <span class="str">"Thought: Fark ~9.9 milyon.\\nAction: finish[Istanbul'da Ankara'dan ~9.9 milyon daha fazla insan yasiyor.]"</span>
    <span class="kw">return</span> <span class="str">"Thought: Istanbul'u arayarak basla.\\nAction: search[istanbul nufus]"</span>

<span class="cm"># 3. Parser</span>
ACTION_RE = re.<span class="fn">compile</span>(r<span class="str">"Action:\\s*(\\w+)\\[(.*?)\\]"</span>, re.DOTALL)
<span class="kw">def</span> <span class="fn">parse</span>(text):
    m = ACTION_RE.<span class="fn">search</span>(text)
    <span class="kw">if</span> <span class="kw">not</span> m: <span class="kw">return</span> <span class="kw">None</span>, <span class="kw">None</span>
    <span class="kw">return</span> m.<span class="fn">group</span>(<span class="num">1</span>).<span class="fn">strip</span>(), m.<span class="fn">group</span>(<span class="num">2</span>).<span class="fn">strip</span>()

<span class="cm"># 4. Dongu</span>
<span class="kw">def</span> <span class="fn">react</span>(question, max_steps=<span class="num">8</span>):
    scratch = [f<span class="str">"Soru: {question}"</span>]
    <span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(max_steps):
        out = <span class="fn">fake_llm</span>(scratch)
        scratch.<span class="fn">append</span>(out)
        <span class="fn">print</span>(f<span class="str">"--- adim {step} ---\\n{out}"</span>)
        name, arg = <span class="fn">parse</span>(out)
        <span class="kw">if</span> name <span class="kw">is</span> <span class="kw">None</span>:
            <span class="fn">print</span>(<span class="str">"PARSE FAIL"</span>); <span class="kw">break</span>
        <span class="kw">if</span> name == <span class="str">"finish"</span>:
            <span class="fn">print</span>(f<span class="str">"\\nNIHAI CEVAP: {arg}"</span>); <span class="kw">return</span> arg
        obs = TOOLS.<span class="fn">get</span>(name, <span class="kw">lambda</span> a: f<span class="str">"bilinmeyen tool {name}"</span>)(arg)
        scratch.<span class="fn">append</span>(f<span class="str">"Observation: {obs}"</span>)
        <span class="fn">print</span>(f<span class="str">"Observation: {obs}"</span>)
    <span class="fn">print</span>(<span class="str">"MAX ADIM asildi"</span>); <span class="kw">return</span> <span class="kw">None</span>

<span class="fn">react</span>(<span class="str">"Istanbul'da Ankara'dan kac kisi daha fazla yasiyor?"</span>)
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Küçük bir <code>TOOLS</code> kayıt defteri kurar — <code>search</code> ufak bir <code>KB</code> sözlüğünden okur, <code>calculator</code> aritmetik ifadeyi sandbox'ta <code>eval</code>'lar, <code>finish</code> trajectory'i biter olarak işaretler. 2) <code>fake_llm(scratch)</code> gerçek bir model yerine geçer: çalışan scratchpad metnine bakar ve çok-atlı bir reasoning izini simüle eden senaryolu <code>Thought / Action</code> çiftleri döndürür. 3) <code>ACTION_RE</code> regex'i her çıktının son satırını <code>(name, arg)</code>'a parse eder; runtime <code>TOOLS[name](arg)</code> ile dispatch eder ve scratchpad'e <code>Observation: ...</code> satırı ekler. 4) <code>react()</code> sürücüsü <code>max_steps=8</code> ile sınırlı çalışır, her adımı yazdırır ve <code>name == "finish"</code> olunca temiz çıkar — <code>fake_llm</code>'i Anthropic veya OpenAI çağrısıyla değiştirince döngü production'a hazır olur.</p>
</div>

<p class="l-text">Çalıştır ve trace'i oku. Dikkat: (1) ajan hesaplamadan önce iki arama yapıyor, çünkü her gözlem planını günceller; (2) calculator yalnızca her iki olgu da scratchpad'de olunca çağrılıyor; (3) döngü <code>finish[]</code> ile temiz biter. <code>fake_llm</code>'i gerçek bir Anthropic <code>messages.create()</code> çağrısıyla değiştir, gerçek bir ReAct ajanın olur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Dört Klasik Hata Modu</h2>
<p class="l-text">Gerçek bir ReAct ajanını sıradan olmayan bir göreve bağla, bir saat içinde hepsini göreceksin. İyi çalışılmış; her birinin standart bir çözümü var.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Sonsuz döngüler</div><div class="card-body"><strong>Belirti:</strong> ajan aynı eylemi aynı argümanlarla yaymaya devam ediyor. <strong>Sebep:</strong> gözlem ona yeni bilgi vermiyor, sıradaki düşünce öncekiyle aynı görünüyor. <strong>Çözüm:</strong> sert <code>max_steps</code> tavanı (her zaman); (action, args) çiftlerinin deduplication'ı; system prompt'ta açıkça "bunu denedin ve başarısız olduysa farklı bir yaklaşım dene".</div></div>
<div class="calc-card"><div class="card-title">2. Eylem tekrarları</div><div class="card-body"><strong>Belirti:</strong> ajan aynı aramayı arka arkaya iki kez çağırıyor. <strong>Sebep:</strong> model çağırdığını unuttu (uzun context'te drift) veya sonucun tesadüf olduğunu sanıyor. <strong>Çözüm:</strong> modele dedup'lanmış eylem geçmişini göster; özdeş çağrıları cache'le ve "bunu zaten X sonucuyla çağırdın" gözlemi döndür.</div></div>
<div class="calc-card"><div class="card-title">3. Halüsine tool'lar</div><div class="card-body"><strong>Belirti:</strong> ajan <code>Action: magic_solver[problem]</code> yayıyor ama böyle bir tool yok. <strong>Sebep:</strong> tool listesi çok uzun, açıklamalar çok belirsiz veya model zayıf. <strong>Çözüm:</strong> parse'ta tool ismini doğrula ve "HATA: 'magic_solver' tool'u yok. Mevcut: [search, calculator, finish]" gibi bir gözlem döndür; serbest metin yerine function calling kullan.</div></div>
<div class="calc-card"><div class="card-title">4. Erken finish</div><div class="card-body"><strong>Belirti:</strong> ajan 1. adımda <code>finish["bilmiyorum"]</code> çağırıyor. <strong>Sebep:</strong> model risk-averse veya sorunun cevaplanamaz olduğunu düşünüyor. <strong>Çözüm:</strong> system prompt: "Yalnızca en az bir gözlemden kanıtın olduğunda finish çağır. Bilmiyorsan, önce ara veya açıklama iste."</div></div>
</div>

<div class="calc-highlight"><strong>Production kuralı:</strong> her ReAct ajanında en azından bir max-step bütçesi, bir eylem-geçmişi dedup'layıcı, yararlı bir hata gözlemiyle tool-ismi doğrulayıcı ve çağrı-başına maliyet sayacı olmalı. Bu dördü ~30 satır kod tutar ve incident'lerin %90'ından korur.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Reflexion Eklemek (Denemeler Arası Öz-Eleştiri)</h2>
<p class="l-text">ReAct trajectory-içi reasoning'i çözer. <strong>Reflexion</strong> (Shinn, Cassano, Berman, Gopinath, Narasimhan, Yao — NeurIPS 2023) trajectory-arası öğrenmeyi ekler. Bir ReAct çalışması başarısız olduktan sonra (ör. nihai cevap yanlış veya ajan max steps'e ulaştı), bir LLM critic tüm trajectory'i okur ve kısa sözlü bir "öğrenilen ders" yazar — örneğin <em>"Şehirden önce ülkeyi aramalıydım."</em> Ders bir sonraki denemenin system prompt'una eklenir. Bir avuç deneme üzerinde ajan HumanEval coding ve Hotpot QA gibi görevlerde dramatik biçimde iyileşir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Mini-Reflexion: her başarısız denemeden sonra bir "critic" tek satırlık ders üretir; sonraki deneme dersi prompt'unda görür. İki denemeyi simüle ediyoruz — ilki başarısız, ikincisi başarılı çünkü ders ona farklı hesaplamasını söyler.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">attempt</span>(question, lessons):
    <span class="str">"""Bir ReAct denemesi; (basari_bool, trajectory) doner."""</span>
    traj = [f<span class="str">"Soru: {question}"</span>, f<span class="str">"Dersler: {lessons}"</span>]
    <span class="cm"># Deneme 1 (ders yok): birim donusumunu unutuyor</span>
    <span class="kw">if</span> <span class="kw">not</span> lessons:
        traj += [<span class="str">"Thought: mesafe 100 + 50 = 150"</span>,
                 <span class="str">"Action: finish[150]"</span>]
        <span class="kw">return</span> <span class="kw">False</span>, traj
    <span class="cm"># Deneme 2 (dersle): km'yi m'ye cevirmeyi hatirliyor</span>
    traj += [<span class="str">"Thought: ders birime dikkat diyor. 100 km = 100000 m, 50 km = 50000 m."</span>,
             <span class="str">"Thought: toplam = 150000 m"</span>,
             <span class="str">"Action: finish[150000]"</span>]
    <span class="kw">return</span> <span class="kw">True</span>, traj

<span class="kw">def</span> <span class="fn">critic</span>(trajectory, expected):
    <span class="str">"""LLM-as-judge basarisiz trajectory'den tek satirlik ders yazar."""</span>
    last = trajectory[-<span class="num">1</span>]
    <span class="kw">if</span> <span class="str">"150]"</span> <span class="kw">in</span> last <span class="kw">and</span> expected == <span class="num">150000</span>:
        <span class="kw">return</span> <span class="str">"Birime dikkat. Soru kilometre degil metre istedi."</span>
    <span class="kw">return</span> <span class="str">"Bir dahaki sefere daha dikkatli ol."</span>

question = <span class="str">"Toplam mesafe: A bacagi 100 km, B bacagi 50 km. Kac metre toplam?"</span>
expected = <span class="num">150000</span>
lessons = <span class="str">""</span>
<span class="kw">for</span> trial <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    <span class="fn">print</span>(f<span class="str">"\\n=== DENEME {trial+1}, dersler='{lessons}' ==="</span>)
    ok, traj = <span class="fn">attempt</span>(question, lessons)
    <span class="kw">for</span> line <span class="kw">in</span> traj: <span class="fn">print</span>(line)
    <span class="kw">if</span> ok:
        <span class="fn">print</span>(<span class="str">"\\n[BASARI] Reflexion yakinsadi."</span>); <span class="kw">break</span>
    lessons = <span class="fn">critic</span>(traj, expected)
    <span class="fn">print</span>(f<span class="str">"\\n[critic ders] {lessons}"</span>)
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>attempt(question, lessons)</code> sözlü <code>lessons</code> string'ini tüketen bir ReAct denemesini simüle eder — ders yokken km'yi m'ye çevirmeyi unutur ve yanlış 150 cevabını döndürür; ders varsa birimleri doğru çevirir ve 150000 döndürür. 2) <code>critic(trajectory, expected)</code> LLM-as-judge rolünü oynar: başarısız trajectory'nin son satırını okur ve sonraki denemenin prompt'una giren tek cümlelik bir ders ("Birimlere dikkat...") yayar. 3) Dıştaki <code>for trial in range(3)</code> döngüsü Reflexion'ın dış döngüsüdür — dene, <code>ok</code>'a bak, kritikten ders iste, dersi prompt'a koyup yeniden dene. 4) Burada yakınsama 2 denemede olur; gerçek Reflexion'da dersler koşular arası birikir ve her hatadan sonra system prompt birkaç cümle büyür.</p>
</div>

<p class="l-text">Reflexion, tek bir kullanıcı seansı içinde <em>öğrenen</em> bir LLM ajanının klasik örneğidir. Model ağırlıklarını güncellemez — öğrenme sözlü, system prompt'tadır — ama in-context fine-tuning gibi işler. Modern agent ürünleri bu deseni "self-correction", "iterative refinement" ve "evaluator loop" etiketleri altında sessizce kullanıyor.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ReAct vs. Saf CoT vs. Saf Function Calling</h2>
<p class="l-text">Hangisini ne zaman seçmeli? 2026'da cevap görev yapısına ve modelin ne kadar güçlü olduğuna bağlı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yalnızca Chain-of-Thought</div><div class="card-body"><strong>Şunlarda kullan:</strong> görev tamamen verilen context üzerinde reasoning (dış bilgi gerekmez). Örnek: matematik problemleri, tek-doküman okuma anlama, snippet code review. <strong>Risk:</strong> model olguya sahip değilse halüsinasyon.</div></div>
<div class="calc-card"><div class="card-title">Function calling, tek tur</div><div class="card-body"><strong>Şunlarda kullan:</strong> görev "bir şey ara ve raporla" — tek tool çağrısı her şeyi cevaplar. Örnek: hava durumu, döviz, tek SQL sorgusu. <strong>Risk:</strong> tool'un kendi hatalarının ötesinde yok.</div></div>
<div class="calc-card"><div class="card-title">ReAct (çok-turlu function calling)</div><div class="card-body"><strong>Şunlarda kullan:</strong> görev birden çok tool çağrısı gerektiriyor VE bir sonraki çağrı seçimi önceki sonuçlara bağlı. Örnek: çok-atlı QA, dosyaları okuyarak debug edip düzenlemek, web research. Bu modal agent görevidir.</div></div>
<div class="calc-card"><div class="card-title">Plan-and-Execute</div><div class="card-body"><strong>Şunlarda kullan:</strong> görev uzun-ufuklu ve plan stabil. Önden bir checklist ("plan") üret, sonra her maddeyi küçük bir ReAct alt-ajanıyla yürüt. Daha iyi maliyet kontrolü, başarısızlıkta resume kolay. Devin, AutoGPT, LangGraph'ta kullanılıyor.</div></div>
</div>

<p class="l-text">Ampirik olarak, GPT-4 / Claude Sonnet 4.5+ sınıfı modellerle, max-step bütçesi 6–10 olan ReAct çoğu gerçek-dünya agent görevini halleder. Plan-and-Execute, görevler düzenli olarak 15 adımı aştığında yardım eder. CoT-only ve tek-turlu function calling "daha zayıf" değil — döngü gerekmediğinde doğru cevaptır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Modern Torunları: ReAct'ten Computer Use'a</h2>
<p class="l-text">ReAct'i bir kez gördüğünde her yerde göreceksin. Soykütüğü direkt.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenAI function calling (Haz 2023)</div><div class="card-body">Yapılandırılmış Action'lı ReAct. "Düşünce" assistant mesaj content'inde yaşar; "Eylem" <code>tool_calls</code> alanı. API'yi while-loop'ta döndür. Vahşi doğadaki ajanların %90'ı bunu yapıyor.</div></div>
<div class="calc-card"><div class="card-title">Claude tool use (Mar 2024)</div><div class="card-body">Aynı şekil, biraz farklı API. Assistant turunda <code>tool_use</code> blokları, user turunda <code>tool_result</code> blokları. Anthropic Düşünce için <code>&lt;thinking&gt;</code> tag'lerini teşvik ediyor.</div></div>
<div class="calc-card"><div class="card-title">LangGraph (Oca 2024)</div><div class="card-body">Durum makinesi olarak ReAct. Düğümler = LLM çağrısı veya tool çağrısı. Koşullu kenarlar = Düşünce→Eylem parsing'i. Checkpointing, replay, human-in-the-loop ekler. Aynı algoritma, daha fazla altyapı.</div></div>
<div class="calc-card"><div class="card-title">Computer Use (Eki 2024)</div><div class="card-body">Tool'un screenshot + mouse/klavye olduğu ReAct. Gözlem = ekran piksel'leri. Eylem = "click(x,y)" veya "type('merhaba')". Döngü özdeş.</div></div>
</div>

<p class="l-text">Çıkarım: ayrı bir "computer use algoritması" veya "browser agent algoritması" yok — hepsi farklı tool yüzeyleriyle ReAct. Döngüye ve parser'a hâkim ol, herhangi bir agent codebase'ini akıcı okuyabilirsin.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7b. ReAct trace zaman çizelgesi (görsel)</h2>
<p class="l-text">Somut bir HotpotQA-tarzı trace: düşünceler kısa patlamalar, search/lookup eylemleri gecikmenin çoğunu yer, son cevap kısa bir reasoning adımıdır. Her bar bir adım; renk adım türünü kodlar.</p>
<div id="plot-agents-l2-trace-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> ReAct döngüsünde duvar-saati gecikmesini tool çağrıları domine eder; düşünceler ve gözlemler neredeyse bedavadır. Optimizasyon LLM'in "düşünme" adımlarını değil, tool çağrılarını (cache, paralellik) hedefler.</div></div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradaki</h2>
<p class="l-text">ReAct algoritmasıdır: Thought, Action, Observation, <code>finish</code>'e kadar tekrar. Altmış satır Python ve bir parser yeterlidir; framework sarmalayıcılar kolaylık. Zor kısımlar döngü değil, prompt tasarımı, tool açıklamaları, hata yönetimi ve eval.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>ReAct, reasoning (Thought) ve acting'i (Action) iç içe geçirir; her biri diğerini düzeltir.</li>
<li>Orijinal prompt formatı regex-parse edilen eylem dilbilgisiyle düz metin; modern sistemler function calling üzerinden JSON kullanır.</li>
<li>Dört hata modu (döngüler, eylem tekrarları, halüsine tool'lar, erken finish) hepsinin standart 5-satırlık çözümleri var.</li>
<li>Reflexion denemeler arası sözlü "öğrenilen dersler" ekler — ağırlık güncellemesi olmadan in-context learning.</li>
<li>Saf CoT, tek-turlu function calling, ReAct ve Plan-and-Execute'in her birinin kendine has tatlı noktası var. Framework hype'a göre değil, görev yapısına göre seç.</li>
<li>Function calling, Claude tool use, LangGraph ve Computer Use hepsi farklı yüzeyli ReAct.</li>
</ul>
</div>

<p class="l-text"><strong>agents-L3</strong>'te yapılandırılmış tarafa derin dalış: tool'lar için JSON schema'lar, OpenAI function calling vs. Anthropic tool_use API formatları, runtime dispatch desenleri, paralel ve eşzamanlı tool çağrıları (gpt-4 / Claude Sonnet 4.6 ikisi de destekler), retry politikaları, Pydantic ile schema doğrulama ve sallantılı bir demo'yu sevk edilebilir bir ürüne dönüştüren production-seviye hata yönetimi.</p>
</div>`
};
