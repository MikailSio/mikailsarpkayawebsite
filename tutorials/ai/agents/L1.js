window.AGENTS_L1 = {
en: `<p class="l-text"><strong>An LLM agent is not just a chatbot with extra steps.</strong> It is a system where a language model decides which actions to take, executes them against tools or environments, observes the results, and iterates — possibly for many turns — until a goal is achieved. The model is not a passenger in a fixed pipeline; it is the controller. That single shift, from "LLM as text generator" to "LLM as planner", is what turned the post-2023 wave of products like Claude Computer Use, ChatGPT plugins, Devin, Cursor's Composer, and the GitHub-spec'd Copilot Workspace into something qualitatively different from a 2022 chatbot.</p>

<p class="l-text">In this first lesson we draw a sharp line between <em>chains</em> (deterministic graphs of LLM calls, like a RAG pipeline: retrieve → format → answer) and <em>agents</em> (LLMs that pick the next step at runtime). We then sketch the agent landscape — reactive, deliberative, and learning agents in the classical sense (Russell &amp; Norvig), and how today's tool-using LLMs map onto that taxonomy. Finally we look at when an agent is actually the right tool, when it is overkill, and the short, dramatic history that took us from AutoGPT (March 2023) to Anthropic's Computer Use API (October 2024) to coding agents shipping production code in 2026.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish a chain (fixed DAG of LLM calls) from an agent (LLM-controlled control flow)</li>
<li>Place modern systems on the reactive ↔ deliberative ↔ learning spectrum</li>
<li>Decide when an agent is the right design and when a chain or single call is better</li>
<li>Trace the 2023–2026 production landscape: AutoGPT, BabyAGI, ChatGPT plugins, LangGraph, Computer Use, Devin, Cursor, Codex</li>
<li>Identify the four core capabilities every agent needs: planning, tool use, memory, and self-reflection</li>
<li>Avoid the most common mistake of 2024: over-agentifying problems that wanted a 50-line script</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. From Chain to Agent — One Bit of Control Flow</h2>
<p class="l-text">A <strong>chain</strong> is a directed graph of LLM calls and non-LLM steps that the engineer wrote down ahead of time. The order is fixed. A standard RAG chain is: <code>embed_query → vector_search → rerank → format_prompt → llm.invoke → parse</code>. The LLM is called, but it does not decide anything about the pipeline's structure. If retrieval returns nothing useful, the chain still proceeds; the LLM's only job is to write text given whatever it received.</p>

<p class="l-text">An <strong>agent</strong> moves the control-flow decision into the model. After every LLM step, the model emits a structured choice: "call tool <code>web_search</code> with these args", or "I'm done, here's the final answer", or "call <code>read_file</code> then <code>edit_file</code>". The runtime executes the choice, feeds the result back, and asks again. The graph is not drawn ahead of time — it is unrolled at runtime, one node per model decision. This is the entire essence of the chain → agent transition.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chain</div><div class="card-body">Static graph. Engineer decides order. LLM is a powerful node but never a router. Examples: classic RAG, summarization pipelines, classification with a fixed prompt, LangChain LCEL <code>prompt | llm | parser</code>.</div></div>
<div class="calc-card"><div class="card-title">Agent</div><div class="card-body">Dynamic graph. LLM picks the next node from a tool menu. Loop continues until the model emits a "stop" action. Examples: ReAct, OpenAI function calling in a while-loop, LangGraph with conditional edges, Claude Computer Use.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (most production systems)</div><div class="card-body">Chain at the outer layer (deterministic stages: ingest → plan → execute → review), agent inside one or two stages where flexibility is needed. This is the 2026 default — pure agents are too unpredictable; pure chains are too rigid.</div></div>
</div>

<div class="calc-highlight"><strong>One-bit test:</strong> ask "can the LLM choose what runs next?" If yes — agent. If no — chain. Everything else (ReAct, function calling, MCP, tool use) is just implementation detail on top of that single bit.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Four Capabilities of an Agent</h2>
<p class="l-text">Strip away the framework wrappers and every modern LLM agent reduces to four capabilities. You can build all four by hand in 200 lines of Python; LangChain, AutoGen, CrewAI, and LlamaIndex are convenience layers, not new ideas.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Planning</div><div class="card-body">Decompose a goal into steps. Can be implicit (single ReAct loop) or explicit (Plan-and-Execute, Tree-of-Thoughts, LLM-as-judge over candidate plans). Stronger models plan implicitly; weaker models need scaffolding.</div></div>
<div class="calc-card"><div class="card-title">2. Tool use</div><div class="card-body">Call functions in the outside world: search, file I/O, code execution, APIs, browsers. The model emits structured calls (JSON schema today, MCP increasingly), the runtime executes, results return as text or structured data.</div></div>
<div class="calc-card"><div class="card-title">3. Memory</div><div class="card-body">Short-term: the conversation context window. Long-term: a database the agent reads from and writes to (vector DB for semantic recall, SQL for facts, episodic logs for past sessions). MemGPT (Packer 2023) and the "memory layer" startups all sit here.</div></div>
<div class="calc-card"><div class="card-title">4. Reflection</div><div class="card-body">The agent critiques its own output before submitting. Reflexion (Shinn 2023) keeps a verbal "lessons learned" buffer across tries. Self-Refine and Constitutional AI use the same trick. Without reflection, agents loop or hallucinate; with it, they recover.</div></div>
</div>

<p class="l-text">A useful exercise: take any agent product (Cursor's Composer, Claude Code, Devin, Manus) and identify all four capabilities. The good ones invest heavily in 2 and 3 — tool ergonomics and memory — and use a smart enough model that 1 and 4 happen for free.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Russell &amp; Norvig Taxonomy, Updated for LLMs</h2>
<p class="l-text">Classical AI gave us a clean ladder of agent types in <em>Artificial Intelligence: A Modern Approach</em>. The same ladder applies to LLM agents — it just got climbed in a very compressed three years.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Simple reflex</div><div class="card-body">Stateless. Map percept → action via a rule. LLM example: a single function-calling turn with no memory. Useful as a building block; not really an "agent".</div></div>
<div class="calc-card"><div class="card-title">Model-based reflex</div><div class="card-body">Keeps internal state about the world. LLM example: a ReAct loop with a scratchpad of past Thought/Action/Observation triples. The scratchpad is the world model.</div></div>
<div class="calc-card"><div class="card-title">Goal-based</div><div class="card-body">Has an explicit objective and searches forward. LLM example: Plan-and-Execute, Tree-of-Thoughts, AutoGPT's task queue. The plan is the search tree.</div></div>
<div class="calc-card"><div class="card-title">Utility-based</div><div class="card-body">Picks among possible plans by expected utility. LLM example: LLM-as-judge ranking candidate trajectories, Best-of-N with a reward model, Monte Carlo Tree Search guided by a value LLM (used in AlphaCode 2 and DeepMind's FunSearch).</div></div>
<div class="calc-card"><div class="card-title">Learning</div><div class="card-body">Improves from experience. LLM example: Reflexion's lesson buffer, RLHF / RLAIF (rl-L10 in our RL track), DPO on agent traces, and the in-context learning that happens when an agent reads its own past trajectories from memory.</div></div>
</div>

<div class="calc-highlight"><strong>Where the field is in 2026:</strong> production agents are mostly model-based reflex (ReAct + scratchpad) with light goal-based scaffolding. Utility-based and true learning agents exist in research (Voyager, AutoCode-Rover, Devin's training loop) but most shipping products are not yet there.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. When an Agent Is the Right Answer</h2>
<p class="l-text">The biggest mistake of 2024 was reaching for an agent when a 50-line script with one LLM call would have worked better, faster, and cheaper. Anthropic's "Building effective agents" essay (Schluntz &amp; Zhang, December 2024) made this point loudly: <em>start with the simplest thing that works, and only add complexity when you measure a benefit</em>. Here is a decision ladder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Single LLM call</div><div class="card-body">Use when: the input fits in context, the task is one shot (summarize, classify, rewrite), and you can specify it in the prompt. Cheapest, fastest, easiest to evaluate. Most "agent" use cases at startups in 2024 were really this.</div></div>
<div class="calc-card"><div class="card-title">Workflow / chain</div><div class="card-body">Use when: you can write the steps down. Examples: RAG, multi-step extraction, content moderation pipelines. Predictable cost, predictable latency, easy to debug. LangChain LCEL or plain Python both work.</div></div>
<div class="calc-card"><div class="card-title">Agent</div><div class="card-body">Use when: you cannot enumerate the steps in advance — the task requires open-ended exploration of a tool space. Examples: coding assistants navigating a repo, research agents reading 50 web pages, browser automation, customer-support resolution that may need 1 or 10 tool calls.</div></div>
<div class="calc-card"><div class="card-title">Multi-agent</div><div class="card-body">Use sparingly. Multiple agents (planner + worker + critic) help when roles genuinely differ. Often a single well-prompted agent with reflection beats a multi-agent system in cost and reliability. CrewAI and AutoGen are easy to over-apply.</div></div>
</div>

<p class="l-text">Heuristic from production: if your "agent" never branches more than once, you wrote a chain in agent clothing. If it routinely branches 5+ times and the branches actually matter, you have a real agent.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A Hand-Rolled "Agent" in 30 Lines (Mock LLM)</h2>
<p class="l-text">To make the chain/agent distinction concrete, here is the simplest possible agent: a while-loop, a mock LLM that picks tools, and a tiny tool registry. No framework, no API key. The point is to see that an agent is structurally trivial — the magic is in the LLM's decision quality, not the loop.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Pseudocode — what a real agent loop looks like with the OpenAI SDK</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
client = <span class="fn">OpenAI</span>()

tools = [{<span class="str">"type"</span>:<span class="str">"function"</span>,<span class="str">"function"</span>:{<span class="str">"name"</span>:<span class="str">"search"</span>,<span class="str">"parameters"</span>:{...}}},
         {<span class="str">"type"</span>:<span class="str">"function"</span>,<span class="str">"function"</span>:{<span class="str">"name"</span>:<span class="str">"read_file"</span>,<span class="str">"parameters"</span>:{...}}}]

messages = [{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"Find the bug in main.py"</span>}]
<span class="kw">while</span> <span class="kw">True</span>:
    resp = client.chat.completions.<span class="fn">create</span>(model=<span class="str">"gpt-4o"</span>, messages=messages, tools=tools)
    msg = resp.choices[<span class="num">0</span>].message
    messages.<span class="fn">append</span>(msg)
    <span class="kw">if</span> <span class="kw">not</span> msg.tool_calls:           <span class="cm"># model decided to stop</span>
        <span class="fn">print</span>(msg.content); <span class="kw">break</span>
    <span class="kw">for</span> call <span class="kw">in</span> msg.tool_calls:      <span class="cm"># model decided to use tools</span>
        result = <span class="fn">dispatch</span>(call.function.name, call.function.arguments)
        messages.<span class="fn">append</span>({<span class="str">"role"</span>:<span class="str">"tool"</span>,<span class="str">"tool_call_id"</span>:call.id,<span class="str">"content"</span>:result})
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a tool catalog and seeds the conversation with a user goal. 2) Enters an unbounded <code>while True</code> loop, each iteration sending the running <code>messages</code> list back to <code>client.chat.completions.create</code> with the full tool menu. 3) If the model returns no <code>tool_calls</code>, it has decided to stop — print the final content and break. 4) Otherwise it iterates every <code>call</code> in <code>msg.tool_calls</code>, runs the matching function via <code>dispatch</code>, and appends the result as a <code>role:"tool"</code> message so the next turn sees the observation.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A mock LLM that returns canned tool calls based on simple keyword matching. Same loop structure, no API needed — the only thing missing is the model's intelligence.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">search</span>(q): <span class="kw">return</span> f<span class="str">"top result for '{q}': agents loop until done."</span>
<span class="kw">def</span> <span class="fn">calculator</span>(expr): <span class="kw">return</span> <span class="fn">str</span>(<span class="fn">eval</span>(expr))
<span class="kw">def</span> <span class="fn">finish</span>(answer): <span class="kw">return</span> {<span class="str">"done"</span>: <span class="kw">True</span>, <span class="str">"answer"</span>: answer}
TOOLS = {<span class="str">"search"</span>: search, <span class="str">"calculator"</span>: calculator, <span class="str">"finish"</span>: finish}

<span class="kw">def</span> <span class="fn">mock_llm</span>(history):
    last = history[-<span class="num">1</span>][<span class="str">"content"</span>].<span class="fn">lower</span>()
    <span class="kw">if</span> <span class="str">"what is"</span> <span class="kw">in</span> last <span class="kw">and</span> <span class="fn">any</span>(c.<span class="fn">isdigit</span>() <span class="kw">for</span> c <span class="kw">in</span> last):
        <span class="kw">return</span> {<span class="str">"tool"</span>: <span class="str">"calculator"</span>, <span class="str">"args"</span>: <span class="str">"2+2*10"</span>}
    <span class="kw">if</span> <span class="str">"search"</span> <span class="kw">in</span> last <span class="kw">or</span> <span class="str">"what is an agent"</span> <span class="kw">in</span> last:
        <span class="kw">return</span> {<span class="str">"tool"</span>: <span class="str">"search"</span>, <span class="str">"args"</span>: <span class="str">"llm agent definition"</span>}
    <span class="kw">return</span> {<span class="str">"tool"</span>: <span class="str">"finish"</span>, <span class="str">"args"</span>: <span class="str">"Based on observations: an agent is an LLM in a loop."</span>}

history = [{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"What is an agent? Then compute 2+2*10."</span>}]
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">6</span>):
    decision = <span class="fn">mock_llm</span>(history)
    <span class="fn">print</span>(f<span class="str">"Step {step}: call {decision['tool']}({decision['args']!r})"</span>)
    <span class="kw">if</span> decision[<span class="str">"tool"</span>] == <span class="str">"finish"</span>:
        <span class="fn">print</span>(<span class="str">"FINAL:"</span>, decision[<span class="str">"args"</span>]); <span class="kw">break</span>
    obs = TOOLS[decision[<span class="str">"tool"</span>]](decision[<span class="str">"args"</span>])
    history.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"tool"</span>, <span class="str">"content"</span>: <span class="fn">str</span>(obs)})
    history.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"continue"</span>})
<span class="fn">print</span>(<span class="str">"Total steps:"</span>, step + <span class="num">1</span>)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines three plain Python functions — <code>search</code>, <code>calculator</code>, <code>finish</code> — and registers them in a <code>TOOLS</code> dict so the loop can dispatch by name. 2) <code>mock_llm</code> is a keyword-matcher standing in for a real model: it inspects the last message and returns a <code>{"tool","args"}</code> dict picking <code>calculator</code>, <code>search</code>, or <code>finish</code>. 3) The driver loop runs up to 6 steps, calls <code>mock_llm(history)</code>, breaks when the decision is <code>finish</code>, and otherwise executes the chosen tool and appends both the observation and a <code>"continue"</code> prompt. 4) The control structure is identical to the real OpenAI version above — only the "intelligence" inside <code>mock_llm</code> differs.</p>
</div>

<p class="l-text">That is it. A real agent replaces <code>mock_llm</code> with a call to Claude or GPT, and the tools become real APIs. The control structure does not change.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Production Landscape — March 2023 to May 2026</h2>
<p class="l-text">The agent era began in a 6-week explosion in March–April 2023 and has gone through three distinct phases since.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Phase 1 — The toy era (Mar–Sep 2023)</div><div class="card-body"><strong>AutoGPT</strong> (Significant Gravitas, March 2023) showed GPT-4 + a task queue could "do things". <strong>BabyAGI</strong>, <strong>AgentGPT</strong>, <strong>HuggingGPT</strong> followed within weeks. They mostly did not work — too many loops, hallucinated tools, no memory — but they proved the concept and lit a fire.</div></div>
<div class="calc-card"><div class="card-title">Phase 2 — Frameworks &amp; tool APIs (Oct 2023–2024)</div><div class="card-body">OpenAI shipped <strong>function calling</strong> (June 2023, GA Nov 2023). <strong>ChatGPT plugins</strong> opened the gate. <strong>LangChain agents</strong>, <strong>LlamaIndex agents</strong>, <strong>AutoGen</strong> (Microsoft, Oct 2023), <strong>CrewAI</strong>, <strong>LangGraph</strong> (Jan 2024) made agents buildable. Claude 3 (March 2024) added native <strong>tool use</strong>.</div></div>
<div class="calc-card"><div class="card-title">Phase 3 — Production agents (late 2024–now)</div><div class="card-body"><strong>Devin</strong> (Cognition, March 2024) — first credible coding agent. <strong>Claude Computer Use</strong> (Oct 2024) — agent operates a real desktop. <strong>OpenAI o1 → o3</strong> reasoning models. <strong>Cursor Composer</strong>, <strong>Claude Code</strong>, <strong>GitHub Copilot Workspace</strong>, <strong>Manus</strong>, <strong>Replit Agent</strong>. <strong>MCP</strong> (Anthropic, Nov 2024) standardized tool servers. By 2026, agents ship production PRs unattended.</div></div>
</div>

<p class="l-text">If you read only one piece on agent design, read Anthropic's <em>"Building effective agents"</em> (Dec 2024). If you read two, add the <em>ReAct</em> paper (Yao et al, ICLR 2023) — covered in detail in agents-L2.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Common Failure Modes (and Why Agents Are Hard)</h2>
<p class="l-text">Agents fail in characteristic ways. Knowing these patterns is half the job; the other half is building eval and observability so you can catch them.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Loops</div><div class="card-body">Agent calls the same tool with the same args forever. Cause: insufficient observation feedback, weak model, missing "give up" instruction. Fix: max-step budget, deduplication, stronger model.</div></div>
<div class="calc-card"><div class="card-title">Hallucinated tools</div><div class="card-body">Model invents <code>magical_solver()</code> that does not exist. Cause: tool descriptions too vague, too many tools (10+ degrades quality), unclear schemas. Fix: tighter descriptions, fewer tools, structured output validation.</div></div>
<div class="calc-card"><div class="card-title">Drift</div><div class="card-body">Agent forgets the original goal after 20 steps. Cause: long context, no goal restatement. Fix: pin the goal in every system message, summarize old context, use a planner that outputs a checklist.</div></div>
<div class="calc-card"><div class="card-title">Cost / latency blowup</div><div class="card-body">"Simple" task takes 40 LLM calls and \$2. Cause: under-specified prompt, missing tool, weak model needing more retries. Fix: cost budgets per task, fall back from agent to chain when possible.</div></div>
</div>

<p class="l-text">Tooling for these problems exists. <strong>LangSmith</strong>, <strong>Langfuse</strong>, <strong>Helicone</strong>, <strong>Braintrust</strong>, and <strong>Weights &amp; Biases Weave</strong> all let you trace agent runs, replay them, and run evals on saved trajectories. We cover this in mlops-L11 (LLM Ops).</p>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Agent Landscape — MCP, Computer Use, and Friends</h2>
<p class="l-text"><strong>The agent stack got two shocks in late 2024.</strong> First, Anthropic shipped <strong>Computer Use</strong> (Oct 2024) — Claude takes a screenshot, decides where to click, and types. Second, Anthropic also shipped the <strong>Model Context Protocol (MCP, Nov 2024)</strong> — a JSON-RPC spec that lets any LLM talk to any tool server over stdio or SSE. Within months OpenAI, Cursor, Zed, and Continue all adopted MCP, and the reference server catalog (filesystem, GitHub, Slack, Postgres, Puppeteer, Memory, Sentry, Brave Search, AWS, Time) became a de-facto standard. The cards below are the five 2024 launches every agent engineer should know by name.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MCP — Model Context Protocol (Anthropic, Nov 2024)</div><div class="card-body">JSON-RPC 2.0 over stdio or SSE, lets one LLM client talk to many tool servers. ~10 reference servers shipped at launch (filesystem, GitHub, Postgres, Slack, etc.). Open-source, multi-vendor adoption inside 6 months. The "USB-C of LLM tools".</div></div>
<div class="calc-card"><div class="card-title">Computer Use (Anthropic, Oct 2024)</div><div class="card-body">Claude 3.5 / 3.7 Sonnet receives a screenshot + screen size, returns mouse coordinates and keyboard actions. ~14% on OSWorld benchmark at launch (humans ~72%). The first general-purpose API for desktop / browser automation by an LLM.</div></div>
<div class="calc-card"><div class="card-title">Cursor Composer (Cursor AI, 2024)</div><div class="card-body">Multi-file agentic code editor. User describes a refactor; Composer reads, edits, and tests files across the repo in one loop. The first commercially-successful agentic IDE feature — proof that agents work when the action space is bounded.</div></div>
<div class="calc-card"><div class="card-title">Devin (Cognition, Mar 2024)</div><div class="card-body">Autonomous SWE agent — plans, writes code, runs tests, files PRs in a sandboxed VM. SWE-Bench score ~13.86% at launch. Set the bar (and the controversy) for "fully autonomous engineer" claims.</div></div>
<div class="calc-card"><div class="card-title">GitHub Copilot Workspace (Apr 2024)</div><div class="card-body">Plan → spec → edit → test loop driven by Copilot. Reads an issue, proposes a plan, edits files, runs CI. The mainstream version of the Devin idea — same loop, narrower scope, real GitHub integration.</div></div>
</div>
<div class="calc-highlight"><strong>Why this matters for L2–L8:</strong> when you build ReAct in L2 you will use MCP-style tool definitions (JSON schema for inputs, structured outputs). When you build multi-agent orchestration in L7, MCP servers become your shared tool fabric — one agent's tools are just other agents' MCP clients. Computer Use is the escape hatch for any task without a clean API: if there is no SDK, drive the GUI.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>
<p class="l-text">An agent is an LLM that decides what runs next. That single design choice — moving control flow into the model — is what made the post-2023 wave of products possible. Everything else (ReAct, tool use, MCP, multi-agent) is implementation detail layered on top of that one bit.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Chain = engineer chooses graph; agent = LLM chooses graph.</li>
<li>Four capabilities: planning, tool use, memory, reflection. The model + good tools matter more than the framework.</li>
<li>Russell &amp; Norvig's reflex → goal → utility → learning ladder maps cleanly to ReAct → Plan-and-Execute → Best-of-N → Reflexion / RLHF.</li>
<li>Default to the simplest design: single call &gt; chain &gt; agent &gt; multi-agent. Add complexity only when measured.</li>
<li>Production landscape: AutoGPT → function calling → frameworks → Computer Use / Devin / Claude Code → MCP standard.</li>
<li>Watch for loops, hallucinated tools, drift, and cost blowup — all have known fixes and require tracing infrastructure.</li>
</ul>
</div>

<p class="l-text">In <strong>agents-L2</strong> we open up the agent loop and build ReAct from scratch — the exact algorithm from Yao et al. 2023 that powers most production agents today, including the failure modes you will hit on day one. In <strong>agents-L3</strong> we go deep on tool calling: JSON schemas, OpenAI vs. Anthropic API formats, runtime dispatch, parallel calls, and the production-grade error handling that distinguishes a demo from a shipping product.</p>
</div>`,

tr: `<p class="l-text"><strong>Bir LLM ajanı, sadece "fazladan adımları olan bir chatbot" değildir.</strong> Ajan, dil modelinin hangi eylemleri yapacağına karar verdiği, bu eylemleri araçlar veya çevreyle yürüttüğü, sonuçları gözlemlediği ve hedef gerçekleşene kadar — belki onlarca tur boyunca — yinelediği bir sistemdir. Model, sabit bir pipeline'ın yolcusu değildir; kontrolcüsüdür. Bu tek değişim — "metin üreten LLM"den "planlayıcı LLM"e — Claude Computer Use, ChatGPT plugins, Devin, Cursor Composer ve GitHub Copilot Workspace gibi 2023 sonrası ürün dalgasını, 2022 chatbot'undan niteliksel olarak farklı bir şey haline getirdi.</p>

<p class="l-text">Bu ilk derste <em>chain</em>'ler (deterministik LLM çağrı grafları, RAG pipeline gibi: retrieve → format → answer) ile <em>agent</em>'lar (çalışma anında bir sonraki adımı seçen LLM'ler) arasında keskin bir çizgi çekiyoruz. Sonra ajan manzarasını çiziyoruz — klasik anlamda (Russell &amp; Norvig) reaktif, deliberatif ve öğrenen ajanlar; ve bugünkü araç-kullanan LLM'lerin bu taksonomide nereye düştüğü. Son olarak bir ajanın gerçekten doğru araç olduğu zamanlara, gereksiz olduğu zamanlara ve bizi AutoGPT'den (Mart 2023) Anthropic Computer Use API'sine (Ekim 2024) ve 2026'da production kod sevk eden coding ajanlarına getiren kısa, dramatik tarihe bakıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir chain'i (sabit LLM çağrı DAG'ı) bir agent'tan (LLM-kontrollü kontrol akışı) ayırt etmek</li>
<li>Modern sistemleri reaktif ↔ deliberatif ↔ öğrenen spektrumuna yerleştirmek</li>
<li>Bir agent'ın doğru tasarım olduğu, chain veya tek çağrının yeterli olduğu durumları kararlaştırmak</li>
<li>2023–2026 production manzarasını izlemek: AutoGPT, BabyAGI, ChatGPT plugins, LangGraph, Computer Use, Devin, Cursor, Codex</li>
<li>Her ajanın ihtiyaç duyduğu dört temel yeteneği tanımlamak: planlama, araç kullanımı, hafıza ve öz-yansıma</li>
<li>2024'ün en yaygın hatasından kaçınmak: 50 satırlık bir script isteyen problemleri aşırı-ajanlaştırmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Chain'den Agent'a — Tek Bit'lik Kontrol Akışı</h2>
<p class="l-text">Bir <strong>chain</strong>, mühendisin önceden yazdığı bir LLM-çağrıları ve LLM-olmayan adımlar grafıdır. Sıralama sabittir. Standart bir RAG chain: <code>embed_query → vector_search → rerank → format_prompt → llm.invoke → parse</code>. LLM çağrılır, ama pipeline'ın yapısı hakkında hiçbir şeye karar vermez. Retrieval işe yarar bir şey döndürmezse chain yine de devam eder; LLM'in tek görevi, eline geçen şeye göre metin yazmaktır.</p>

<p class="l-text">Bir <strong>agent</strong>, kontrol-akışı kararını modele taşır. Her LLM adımından sonra model yapılandırılmış bir seçim yayar: "şu argümanlarla <code>web_search</code> aracını çağır", veya "bittim, işte nihai cevap", veya "<code>read_file</code> sonra <code>edit_file</code> çağır". Runtime seçimi yürütür, sonucu geri besler ve yeniden sorar. Graf önceden çizilmez — runtime'da her model kararı için bir düğüm açılır. Chain → agent geçişinin tüm özü budur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Chain</div><div class="card-body">Statik graf. Mühendis sıralamayı belirler. LLM güçlü bir düğümdür ama asla yönlendirici değildir. Örnekler: klasik RAG, özetleme pipeline'ları, sabit prompt'lu sınıflandırma, LangChain LCEL <code>prompt | llm | parser</code>.</div></div>
<div class="calc-card"><div class="card-title">Agent</div><div class="card-body">Dinamik graf. LLM bir araç menüsünden sıradaki düğümü seçer. Model "dur" eylemini yayana kadar döngü devam eder. Örnekler: ReAct, while-loop içinde OpenAI function calling, koşullu kenarlı LangGraph, Claude Computer Use.</div></div>
<div class="calc-card"><div class="card-title">Hibrit (production sistemlerinin çoğu)</div><div class="card-body">Dış katmanda chain (deterministik aşamalar: ingest → plan → execute → review), esneklik gereken bir-iki aşamanın içinde agent. Bu 2026 varsayılanıdır — saf agent'lar fazla öngörülemez; saf chain'ler fazla katı.</div></div>
</div>

<div class="calc-highlight"><strong>Tek-bit testi:</strong> "LLM bir sonraki ne çalışacağına karar verebiliyor mu?" diye sor. Evetse — agent. Hayırsa — chain. Geri kalan her şey (ReAct, function calling, MCP, tool use) sadece o tek bitin üzerine inşa edilmiş uygulama detayı.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bir Ajanın Dört Yeteneği</h2>
<p class="l-text">Framework sarmalayıcılarını çıkarınca her modern LLM ajanı dört yeteneğe indirgenir. Hepsini elle 200 satır Python'da kurabilirsin; LangChain, AutoGen, CrewAI ve LlamaIndex yeni fikirler değil, kolaylık katmanlarıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Planlama</div><div class="card-body">Hedefi adımlara böl. Örtük olabilir (tek ReAct döngüsü) veya açık (Plan-and-Execute, Tree-of-Thoughts, aday planlar üzerinde LLM-as-judge). Güçlü modeller örtük planlar; zayıf modeller iskele ister.</div></div>
<div class="calc-card"><div class="card-title">2. Araç kullanımı</div><div class="card-body">Dış dünyada fonksiyon çağır: arama, dosya I/O, kod yürütme, API'ler, tarayıcılar. Model yapılandırılmış çağrıları yayar (bugün JSON schema, giderek MCP), runtime yürütür, sonuçlar metin veya yapılandırılmış veri olarak döner.</div></div>
<div class="calc-card"><div class="card-title">3. Hafıza</div><div class="card-body">Kısa-vade: konuşma context window'u. Uzun-vade: ajanın okuyup yazdığı bir veritabanı (semantik geri çağırma için vector DB, gerçekler için SQL, geçmiş seanslar için episodic loglar). MemGPT (Packer 2023) ve "memory layer" startupları hep burada.</div></div>
<div class="calc-card"><div class="card-title">4. Öz-yansıma</div><div class="card-body">Ajan kendi çıktısını teslim etmeden önce eleştirir. Reflexion (Shinn 2023) denemeler arasında sözlü "öğrenilen dersler" tamponunu tutar. Self-Refine ve Constitutional AI aynı numarayı kullanır. Yansıma olmadan ajanlar döngüye girer veya halüsinasyon görür; varsa toparlar.</div></div>
</div>

<p class="l-text">Faydalı bir egzersiz: herhangi bir agent ürününü al (Cursor Composer, Claude Code, Devin, Manus) ve dört yeteneği işaretle. İyi olanlar 2 ve 3'e — araç ergonomisi ve hafızaya — yoğun yatırım yapar ve 1 ile 4'ün bedavaya gelmesi için yeterince akıllı bir model kullanır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Russell &amp; Norvig Taksonomisi, LLM'lere Güncellenmiş</h2>
<p class="l-text">Klasik AI bize <em>Artificial Intelligence: A Modern Approach</em>'ta temiz bir ajan tipi merdiveni verdi. Aynı merdiven LLM ajanlarına da uyuyor — sadece çok sıkıştırılmış üç yıla yayıldı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Basit refleks</div><div class="card-body">Durumsuz. Algı → eylem'i bir kuralla eşle. LLM örneği: hafızasız tek function-calling turu. Bir yapı taşı olarak faydalı; gerçekten "agent" değil.</div></div>
<div class="calc-card"><div class="card-title">Model-tabanlı refleks</div><div class="card-body">Dünya hakkında iç durum tutar. LLM örneği: geçmiş Düşünce/Eylem/Gözlem üçlülerinin not defteriyle (scratchpad) ReAct döngüsü. Scratchpad, dünya modelidir.</div></div>
<div class="calc-card"><div class="card-title">Hedef-tabanlı</div><div class="card-body">Açık bir hedefi var ve ileri arama yapar. LLM örneği: Plan-and-Execute, Tree-of-Thoughts, AutoGPT'nin görev kuyruğu. Plan, arama ağacıdır.</div></div>
<div class="calc-card"><div class="card-title">Fayda-tabanlı</div><div class="card-body">Olası planlar arasından beklenen faydaya göre seçer. LLM örneği: aday yörüngeleri sıralayan LLM-as-judge, ödül modeliyle Best-of-N, bir değer LLM'i tarafından yönlendirilen Monte Carlo Tree Search (AlphaCode 2 ve DeepMind FunSearch'te kullanıldı).</div></div>
<div class="calc-card"><div class="card-title">Öğrenen</div><div class="card-body">Deneyimden iyileşir. LLM örneği: Reflexion ders tamponu, RLHF / RLAIF (RL track'inde rl-L10), agent trace'leri üzerinde DPO ve bir agent kendi geçmiş yörüngelerini hafızadan okurken olan in-context learning.</div></div>
</div>

<div class="calc-highlight"><strong>2026'da alanın durumu:</strong> production agent'lar çoğunlukla model-tabanlı refleks (ReAct + scratchpad) artı hafif hedef-tabanlı iskele. Fayda-tabanlı ve gerçek öğrenen ajanlar araştırmada var (Voyager, AutoCode-Rover, Devin'in eğitim döngüsü) ama sevk edilen ürünlerin çoğu henüz orada değil.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Bir Agent Ne Zaman Doğru Cevaptır</h2>
<p class="l-text">2024'ün en büyük hatası, tek LLM çağrılı 50 satırlık bir script daha iyi, daha hızlı ve daha ucuz çalışacakken bir agent'a sarılmaktı. Anthropic'in <em>"Building effective agents"</em> yazısı (Schluntz &amp; Zhang, Aralık 2024) bu noktayı yüksek sesle vurguladı: <em>çalışan en basit şeyle başla, yalnızca ölçülmüş bir fayda gördüğünde karmaşıklık ekle</em>. İşte bir karar merdiveni.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tek LLM çağrısı</div><div class="card-body">Şunlarda kullan: girdi context'e sığıyor, görev tek-atımlık (özetle, sınıflandır, yeniden yaz) ve prompt'ta tarif edebiliyorsun. En ucuz, en hızlı, değerlendirmesi en kolay. 2024'te startup'lardaki çoğu "agent" use case'i aslında buydu.</div></div>
<div class="calc-card"><div class="card-title">Workflow / chain</div><div class="card-body">Şunlarda kullan: adımları yazabiliyorsun. Örnekler: RAG, çok-adımlı çıkarım, içerik moderasyon pipeline'ları. Öngörülebilir maliyet, öngörülebilir gecikme, debug'ı kolay. LangChain LCEL ya da düz Python — ikisi de iş görür.</div></div>
<div class="calc-card"><div class="card-title">Agent</div><div class="card-body">Şunlarda kullan: adımları önceden sayamıyorsun — görev araç uzayında açık-uçlu keşif gerektiriyor. Örnekler: repo gezen coding asistanları, 50 web sayfası okuyan araştırma ajanları, tarayıcı otomasyonu, 1 ya da 10 araç çağrısı isteyebilen müşteri-destek çözümleri.</div></div>
<div class="calc-card"><div class="card-title">Çoklu-agent</div><div class="card-body">Az kullan. Birden çok agent (planlayıcı + işçi + eleştirmen), roller gerçekten farklıysa yardım eder. Çoğu zaman iyi prompt'lanmış ve yansıma yapan tek bir agent, çoklu-agent sistemini maliyet ve güvenilirlikte yener. CrewAI ve AutoGen kolayca aşırı-uygulanır.</div></div>
</div>

<p class="l-text">Production'dan bir sezgi: "agent"ın asla bir kereden fazla dallanmıyorsa, agent kıyafetinde bir chain yazmışsın demektir. Düzenli olarak 5+ kez dallanıyorsa ve dallar gerçekten önemliyse, gerçek bir agent'ın var.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. 30 Satırda Elle-Yapılmış "Agent" (Mock LLM)</h2>
<p class="l-text">Chain/agent ayrımını somutlaştırmak için en basit mümkün agent: bir while-loop, araç seçen bir mock LLM ve küçük bir araç kayıt defteri. Framework yok, API key yok. Amaç, agent'ın yapısal olarak basit olduğunu görmek — sihir, döngüde değil, LLM'in karar kalitesindedir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Pseudocode — gerçek bir agent loop OpenAI SDK ile böyle görünür</span>
<span class="kw">from</span> openai <span class="kw">import</span> OpenAI
client = <span class="fn">OpenAI</span>()

tools = [{<span class="str">"type"</span>:<span class="str">"function"</span>,<span class="str">"function"</span>:{<span class="str">"name"</span>:<span class="str">"search"</span>,<span class="str">"parameters"</span>:{...}}},
         {<span class="str">"type"</span>:<span class="str">"function"</span>,<span class="str">"function"</span>:{<span class="str">"name"</span>:<span class="str">"read_file"</span>,<span class="str">"parameters"</span>:{...}}}]

messages = [{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"main.py'deki bug'ı bul"</span>}]
<span class="kw">while</span> <span class="kw">True</span>:
    resp = client.chat.completions.<span class="fn">create</span>(model=<span class="str">"gpt-4o"</span>, messages=messages, tools=tools)
    msg = resp.choices[<span class="num">0</span>].message
    messages.<span class="fn">append</span>(msg)
    <span class="kw">if</span> <span class="kw">not</span> msg.tool_calls:           <span class="cm"># model durmaya karar verdi</span>
        <span class="fn">print</span>(msg.content); <span class="kw">break</span>
    <span class="kw">for</span> call <span class="kw">in</span> msg.tool_calls:      <span class="cm"># model araç kullanmaya karar verdi</span>
        result = <span class="fn">dispatch</span>(call.function.name, call.function.arguments)
        messages.<span class="fn">append</span>({<span class="str">"role"</span>:<span class="str">"tool"</span>,<span class="str">"tool_call_id"</span>:call.id,<span class="str">"content"</span>:result})
</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Bir araç kataloğu kurar ve <code>messages</code> listesini kullanıcı hedefiyle başlatır. 2) Sınırsız bir <code>while True</code> döngüsüne girer; her iterasyonda mevcut mesajları ve tool menüsünü <code>client.chat.completions.create</code>'e gönderir. 3) Model <code>tool_calls</code> döndürmezse "dur" kararı vermiştir — son içeriği yazdırıp döngüyü kırar. 4) Aksi hâlde <code>msg.tool_calls</code> içindeki her <code>call</code> için <code>dispatch</code> ile eşleşen fonksiyonu çalıştırır ve sonucu <code>role:"tool"</code> mesajı olarak ekler; böylece bir sonraki tur gözlemi görebilir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Basit kelime-eşleşmesine göre hazır araç çağrıları döndüren bir mock LLM. Aynı döngü yapısı, API gerekmez — eksik olan tek şey modelin zekası.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">search</span>(q): <span class="kw">return</span> f<span class="str">"'{q}' icin top sonuc: agent'lar bitene kadar donuyor."</span>
<span class="kw">def</span> <span class="fn">calculator</span>(expr): <span class="kw">return</span> <span class="fn">str</span>(<span class="fn">eval</span>(expr))
<span class="kw">def</span> <span class="fn">finish</span>(answer): <span class="kw">return</span> {<span class="str">"done"</span>: <span class="kw">True</span>, <span class="str">"answer"</span>: answer}
TOOLS = {<span class="str">"search"</span>: search, <span class="str">"calculator"</span>: calculator, <span class="str">"finish"</span>: finish}

<span class="kw">def</span> <span class="fn">mock_llm</span>(history):
    last = history[-<span class="num">1</span>][<span class="str">"content"</span>].<span class="fn">lower</span>()
    <span class="kw">if</span> <span class="str">"hesapla"</span> <span class="kw">in</span> last <span class="kw">or</span> <span class="str">"+"</span> <span class="kw">in</span> last:
        <span class="kw">return</span> {<span class="str">"tool"</span>: <span class="str">"calculator"</span>, <span class="str">"args"</span>: <span class="str">"2+2*10"</span>}
    <span class="kw">if</span> <span class="str">"ara"</span> <span class="kw">in</span> last <span class="kw">or</span> <span class="str">"agent nedir"</span> <span class="kw">in</span> last:
        <span class="kw">return</span> {<span class="str">"tool"</span>: <span class="str">"search"</span>, <span class="str">"args"</span>: <span class="str">"llm agent tanimi"</span>}
    <span class="kw">return</span> {<span class="str">"tool"</span>: <span class="str">"finish"</span>, <span class="str">"args"</span>: <span class="str">"Gozlemlere gore: agent, dongudeki bir LLM'dir."</span>}

history = [{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"Agent nedir? Sonra 2+2*10 hesapla."</span>}]
<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="num">6</span>):
    decision = <span class="fn">mock_llm</span>(history)
    <span class="fn">print</span>(f<span class="str">"Adim {step}: cagri {decision['tool']}({decision['args']!r})"</span>)
    <span class="kw">if</span> decision[<span class="str">"tool"</span>] == <span class="str">"finish"</span>:
        <span class="fn">print</span>(<span class="str">"FINAL:"</span>, decision[<span class="str">"args"</span>]); <span class="kw">break</span>
    obs = TOOLS[decision[<span class="str">"tool"</span>]](decision[<span class="str">"args"</span>])
    history.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"tool"</span>, <span class="str">"content"</span>: <span class="fn">str</span>(obs)})
    history.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"devam"</span>})
<span class="fn">print</span>(<span class="str">"Toplam adim:"</span>, step + <span class="num">1</span>)
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Üç düz Python fonksiyonu — <code>search</code>, <code>calculator</code>, <code>finish</code> — tanımlanır ve döngünün isimle çağırabilmesi için <code>TOOLS</code> sözlüğüne yazılır. 2) <code>mock_llm</code> gerçek bir model yerine geçen bir kelime-eşleştiricidir: son mesaja bakar ve <code>{"tool","args"}</code> sözlüğü döndürerek <code>calculator</code>, <code>search</code> veya <code>finish</code>'ten birini seçer. 3) Sürücü döngü en fazla 6 adım çalışır, <code>mock_llm(history)</code> çağırır, karar <code>finish</code> ise döngüyü kırar; aksi takdirde seçilen tool'u çalıştırır ve hem gözlemi hem de <code>"devam"</code> isteğini geçmişe ekler. 4) Kontrol yapısı yukarıdaki gerçek OpenAI sürümüyle aynıdır — yalnızca <code>mock_llm</code> içindeki "zekâ" farklıdır.</p>
</div>

<p class="l-text">Hepsi bu. Gerçek bir agent <code>mock_llm</code>'i Claude veya GPT çağrısıyla değiştirir, araçlar gerçek API'lar olur. Kontrol yapısı değişmez.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Production Manzarası — Mart 2023'ten Mayıs 2026'ya</h2>
<p class="l-text">Agent çağı Mart–Nisan 2023'te 6 haftalık bir patlamayla başladı ve o zamandan beri üç belirgin faz geçirdi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Faz 1 — Oyuncak çağı (Mar–Eyl 2023)</div><div class="card-body"><strong>AutoGPT</strong> (Significant Gravitas, Mart 2023) GPT-4 + görev kuyruğunun "iş yapabildiğini" gösterdi. <strong>BabyAGI</strong>, <strong>AgentGPT</strong>, <strong>HuggingGPT</strong> haftalar içinde geldi. Çoğu çalışmıyordu — fazla döngü, halüsine araçlar, hafıza yok — ama konsepti kanıtlayıp ateşi yaktı.</div></div>
<div class="calc-card"><div class="card-title">Faz 2 — Framework'ler &amp; araç API'leri (Eki 2023–2024)</div><div class="card-body">OpenAI <strong>function calling</strong>'i sevk etti (Haz 2023, GA Kas 2023). <strong>ChatGPT plugins</strong> kapıyı açtı. <strong>LangChain agents</strong>, <strong>LlamaIndex agents</strong>, <strong>AutoGen</strong> (Microsoft, Eki 2023), <strong>CrewAI</strong>, <strong>LangGraph</strong> (Oca 2024) ajanları inşa edilebilir hale getirdi. Claude 3 (Mar 2024) yerel <strong>tool use</strong>'u ekledi.</div></div>
<div class="calc-card"><div class="card-title">Faz 3 — Production agent'lar (geç 2024–şimdi)</div><div class="card-body"><strong>Devin</strong> (Cognition, Mar 2024) — ilk inandırıcı coding agent. <strong>Claude Computer Use</strong> (Eki 2024) — agent gerçek bir masaüstünü işletiyor. <strong>OpenAI o1 → o3</strong> reasoning modelleri. <strong>Cursor Composer</strong>, <strong>Claude Code</strong>, <strong>GitHub Copilot Workspace</strong>, <strong>Manus</strong>, <strong>Replit Agent</strong>. <strong>MCP</strong> (Anthropic, Kas 2024) araç sunucularını standartlaştırdı. 2026'ya kadar agent'lar production PR'ları gözetimsiz sevk ediyor.</div></div>
</div>

<p class="l-text">Agent tasarımı üzerine sadece bir parça okuyacaksan, Anthropic'in <em>"Building effective agents"</em> (Ara 2024) yazısını oku. İki okuyacaksan <em>ReAct</em> makalesini ekle (Yao vd., ICLR 2023) — agents-L2'de detaylı işliyoruz.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Yaygın Hata Modları (ve Ajanlar Neden Zor)</h2>
<p class="l-text">Ajanlar karakteristik biçimlerde başarısız olur. Bu desenleri bilmek işin yarısı; diğer yarısı yakalayabilmek için eval ve gözlemlenebilirlik kurmak.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Döngüler</div><div class="card-body">Agent aynı aracı aynı argümanlarla sonsuza kadar çağırır. Sebep: yetersiz gözlem geri-bildirimi, zayıf model, eksik "vazgeç" talimatı. Çözüm: maksimum-adım bütçesi, deduplication, daha güçlü model.</div></div>
<div class="calc-card"><div class="card-title">Halüsine araçlar</div><div class="card-body">Model var olmayan <code>magical_solver()</code>'ı uydurur. Sebep: çok belirsiz araç açıklamaları, çok fazla araç (10+ kaliteyi düşürür), bulanık schema'lar. Çözüm: daha sıkı açıklamalar, daha az araç, yapılandırılmış çıktı doğrulama.</div></div>
<div class="calc-card"><div class="card-title">Drift</div><div class="card-body">Agent 20 adım sonra orijinal hedefi unutur. Sebep: uzun context, hedef yeniden-ifade edilmiyor. Çözüm: hedefi her system message'da sabitle, eski context'i özetle, checklist çıkaran bir planlayıcı kullan.</div></div>
<div class="calc-card"><div class="card-title">Maliyet / gecikme patlaması</div><div class="card-body">"Basit" görev 40 LLM çağrısı ve \$2 sürer. Sebep: yetersiz prompt, eksik araç, daha çok deneme isteyen zayıf model. Çözüm: görev başına maliyet bütçeleri, mümkünse agent'tan chain'e geri düş.</div></div>
</div>

<p class="l-text">Bu sorunlar için araçlar var. <strong>LangSmith</strong>, <strong>Langfuse</strong>, <strong>Helicone</strong>, <strong>Braintrust</strong> ve <strong>Weights &amp; Biases Weave</strong> agent run'larını trace etmeyi, replay etmeyi ve kayıtlı yörüngeler üzerinde eval çalıştırmayı sağlar. mlops-L11'de (LLM Ops) işliyoruz.</p>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Agent Manzarası — MCP, Bilgisayar Kullanımı ve Dostları</h2>
<p class="l-text"><strong>Agent yığını 2024 sonunda iki şok yaşadı.</strong> İlk olarak, Anthropic <strong>Bilgisayar Kullanımı</strong>'nı (Eki 2024) sevk etti — Claude ekran görüntüsü alır, nereye tıklayacağına karar verir ve yazar. İkinci olarak, Anthropic ayrıca <strong>Model Context Protocol (MCP, Kas 2024)</strong>'ı sevk etti — herhangi bir LLM'nin stdio veya SSE üzerinden herhangi bir araç sunucusuyla konuşmasını sağlayan bir JSON-RPC şartnamesi. Aylar içinde OpenAI, Cursor, Zed ve Continue MCP'yi benimsedi ve referans sunucu kataloğu (filesystem, GitHub, Slack, Postgres, Puppeteer, Memory, Sentry, Brave Search, AWS, Time) fiili bir standart hâline geldi. Aşağıdaki kartlar, her agent mühendisinin isimleriyle bilmesi gereken beş 2024 lansmanıdır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MCP — Model Context Protocol (Anthropic, Kas 2024)</div><div class="card-body">stdio veya SSE üzerinde JSON-RPC 2.0, bir LLM istemcisinin birçok araç sunucusuyla konuşmasını sağlar. Lansmanda ~10 referans sunucu (filesystem, GitHub, Postgres, Slack vb.). 6 ay içinde açık-kaynak, çoklu-tedarikçi benimseme. "LLM araçlarının USB-C'si".</div></div>
<div class="calc-card"><div class="card-title">Bilgisayar Kullanımı (Anthropic, Eki 2024)</div><div class="card-body">Claude 3.5 / 3.7 Sonnet ekran görüntüsü + ekran boyutu alır, fare koordinatları ve klavye eylemleri döndürür. Lansmanda OSWorld kıyaslamasında ~%14 (insanlar ~%72). Bir LLM tarafından masaüstü / tarayıcı otomasyonu için ilk genel amaçlı API.</div></div>
<div class="calc-card"><div class="card-title">Cursor Composer (Cursor AI, 2024)</div><div class="card-body">Çok-dosyalı ajansal kod editörü. Kullanıcı bir refactor tarif eder; Composer tek döngüde tüm repo'da dosyaları okur, düzenler ve test eder. Ticari olarak başarılı ilk ajansal IDE özelliği — eylem alanı sınırlı olduğunda ajanların çalıştığının kanıtı.</div></div>
<div class="calc-card"><div class="card-title">Devin (Cognition, Mar 2024)</div><div class="card-body">Otonom SWE ajanı — sandbox'lı bir VM'de planlar, kod yazar, testler çalıştırır, PR açar. Lansmanda SWE-Bench skoru ~%13.86. "Tamamen otonom mühendis" iddialarının çıtasını (ve tartışmasını) belirledi.</div></div>
<div class="calc-card"><div class="card-title">GitHub Copilot Workspace (Nis 2024)</div><div class="card-body">Copilot tarafından sürülen plan → spec → edit → test döngüsü. Bir issue okur, plan önerir, dosyaları düzenler, CI çalıştırır. Devin fikrinin ana akım sürümü — aynı döngü, daha dar kapsam, gerçek GitHub entegrasyonu.</div></div>
</div>
<div class="calc-highlight"><strong>L2–L8 için neden önemli:</strong> L2'de ReAct'i kurarken MCP-tarzı araç tanımlarını (girdiler için JSON şema, yapılandırılmış çıktılar) kullanacaksınız. L7'de çoklu-agent orkestrasyonu kurarken MCP sunucuları paylaşılan araç kumaşınız olur — bir agent'ın araçları diğer agent'ların MCP istemcileridir. Bilgisayar Kullanımı, temiz API'si olmayan herhangi bir görev için kaçış kapısıdır: SDK yoksa, GUI'yi sürün.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sıradaki</h2>
<p class="l-text">Agent, bir sonraki adımda neyin çalışacağına karar veren LLM'dir. Bu tek tasarım kararı — kontrol akışını modele taşımak — 2023 sonrası ürün dalgasını mümkün kıldı. Geri kalan her şey (ReAct, tool use, MCP, çoklu-agent) o tek bitin üzerine eklenmiş uygulama detayı.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Chain = mühendis grafı seçer; agent = LLM grafı seçer.</li>
<li>Dört yetenek: planlama, araç kullanımı, hafıza, öz-yansıma. Model + iyi araçlar, framework'ten daha önemlidir.</li>
<li>Russell &amp; Norvig'in refleks → hedef → fayda → öğrenen merdiveni temiz biçimde ReAct → Plan-and-Execute → Best-of-N → Reflexion / RLHF'ye eşlenir.</li>
<li>En basit tasarımı varsayılan al: tek çağrı &gt; chain &gt; agent &gt; çoklu-agent. Karmaşıklığı yalnızca ölçtüğünde ekle.</li>
<li>Production manzarası: AutoGPT → function calling → framework'ler → Computer Use / Devin / Claude Code → MCP standardı.</li>
<li>Döngülere, halüsine araçlara, drift'e ve maliyet patlamasına dikkat et — hepsinin bilinen çözümleri var ve trace altyapısı gerektirir.</li>
</ul>
</div>

<p class="l-text"><strong>agents-L2</strong>'de agent döngüsünü açıyor ve ReAct'i sıfırdan inşa ediyoruz — bugün üretimdeki çoğu agent'ı (ilk gün karşılaşacağın hata modları dahil) çalıştıran Yao vd. 2023 algoritmasının tam halini. <strong>agents-L3</strong>'te tool calling'e derin dalış: JSON schema'lar, OpenAI vs. Anthropic API formatları, runtime dispatch, paralel çağrılar ve bir demo'yu sevk edilen üründen ayıran production-seviye hata yönetimi.</p>
</div>`
};
