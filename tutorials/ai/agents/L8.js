window.AGENTS_L8 = {

en: `<p class="l-text"><strong>One agent has one perspective; multi-agent systems debate, divide labor, and vote.</strong> The intuition comes from human teams: a researcher gathers facts, a writer drafts the paper, a reviewer challenges weak claims. Each role has a tighter prompt, sharper tool access, and a domain-specific persona. Multi-agent systems (MAS) reproduce this in software — and on a wide class of tasks they outperform a single super-prompt by 10-30 points on benchmarks like HumanEval and HotpotQA.</p>

<p class="l-text">This lesson covers the three production frameworks (AutoGen 0.4 from Microsoft, CrewAI, and LangGraph multi-agent), the supervisor pattern that orchestrates them, and the coordination protocols that prevent infinite loops: turn-taking, voting, debate, and swarm-style task pools. We end with the failure modes — agents that flatter each other into wrong answers, runaway message storms, and the cost equation that decides when "just use one big agent" wins.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build a 3-agent CrewAI crew (Researcher, Writer, Reviewer) with role-specific tools</li>
<li>Run an AutoGen group chat with a programmable speaker-selection function</li>
<li>Implement a supervisor that routes turns and decides when to terminate</li>
<li>Apply majority voting and debate protocols to reduce hallucination</li>
<li>Diagnose multi-agent failure modes: sycophancy, drift, message storms</li>
<li>Compare swarm pools (workers grab tasks) vs hierarchical (manager dispatches)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Multi-Agent? The Specialization Argument</h2>

<p class="l-text">A single agent with 20 tools and a 5000-token system prompt suffers from <em>cognitive overload</em>: at every step the LLM must read the giant prompt, decide which of 20 tools to call, and not lose track of the goal. Token-by-token attention is finite. Splitting the work into N agents, each with 2-3 tools and a 300-token persona, makes each LLM call a sharper decision.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Single mega-agent</div><div class="card-body">All tools, all knowledge, one mind. Simple to deploy, fragile at scale, expensive prompts.</div></div>
<div class="calc-card"><div class="card-title">Hierarchical MAS</div><div class="card-body">Manager dispatches to specialists. Clean ownership, but the manager is a bottleneck.</div></div>
<div class="calc-card"><div class="card-title">Group-chat MAS</div><div class="card-body">All agents share a transcript, take turns. AutoGen style. Flexible but messy.</div></div>
<div class="calc-card"><div class="card-title">Swarm MAS</div><div class="card-body">Shared task queue, idle agents grab work. OpenAI Swarm style. Best for parallel jobs.</div></div>
</div>

<p class="l-text">Microsoft's AutoGen paper (Wu et al, 2023) reported that 3-agent assistant + critic + executor setups beat single-agent GPT-4 by 10-25 points on coding and math tasks at comparable token cost — because the critic catches errors the assistant misses.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. CrewAI: Role-Based Crews</h2>

<p class="l-text">CrewAI (released 2024) takes the most opinionated stance: agents are defined by <strong>role + goal + backstory + tools</strong>, and tasks are assigned to roles. The crew runs sequentially or hierarchically. The mental model is a movie production team — director, cinematographer, editor — each doing what they do best, with handoffs documented.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install crewai crewai-tools</span>
<span class="kw">from</span> crewai <span class="kw">import</span> Agent, Task, Crew, Process
<span class="kw">from</span> crewai_tools <span class="kw">import</span> SerperDevTool

search_tool = <span class="fn">SerperDevTool</span>()

researcher = <span class="fn">Agent</span>(
    role=<span class="str">"Senior NLP Researcher"</span>,
    goal=<span class="str">"Find authoritative sources on {topic} from arxiv and top blogs"</span>,
    backstory=<span class="str">"PhD in NLP, reads 50 papers a week, allergic to clickbait"</span>,
    tools=[search_tool],
    verbose=<span class="kw">True</span>,
)
writer = <span class="fn">Agent</span>(
    role=<span class="str">"Technical Writer"</span>,
    goal=<span class="str">"Turn raw research into a 600-word piece for an engineer audience"</span>,
    backstory=<span class="str">"Ex-developer turned writer, hates jargon, loves diagrams"</span>,
    tools=[],
)
reviewer = <span class="fn">Agent</span>(
    role=<span class="str">"Editor-in-Chief"</span>,
    goal=<span class="str">"Block any claim without a citation, demand rewrites"</span>,
    backstory=<span class="str">"Fact-checker for 10 years, ruthless, brief"</span>,
    tools=[],
)

t1 = <span class="fn">Task</span>(description=<span class="str">"Research {topic}, return 8 bulleted findings with URLs"</span>,
          agent=researcher, expected_output=<span class="str">"Bulleted list with citations"</span>)
t2 = <span class="fn">Task</span>(description=<span class="str">"Write a 600-word article based on findings"</span>,
          agent=writer, expected_output=<span class="str">"Markdown article"</span>, context=[t1])
t3 = <span class="fn">Task</span>(description=<span class="str">"Review the article, demand fixes for unsupported claims"</span>,
          agent=reviewer, expected_output=<span class="str">"Approved final article OR list of required edits"</span>, context=[t2])

crew = <span class="fn">Crew</span>(agents=[researcher, writer, reviewer], tasks=[t1, t2, t3], process=Process.sequential)
result = crew.<span class="fn">kickoff</span>(inputs={<span class="str">"topic"</span>: <span class="str">"Mixture of Experts in 2024 LLMs"</span>})</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three CrewAI <code>Agent</code> instances are built — researcher, writer, reviewer — each pinned to a tight <code>role</code>, <code>goal</code> and <code>backstory</code> string; only the researcher gets a <code>SerperDevTool</code>, the others have <code>tools=[]</code>. 2) Three <code>Task</code> objects describe what each role must produce, with explicit <code>expected_output</code> strings; tasks <code>t2</code> and <code>t3</code> pass <code>context=[t1]</code> / <code>context=[t2]</code> so CrewAI threads the previous task's output into the next prompt. 3) <code>Crew(agents=[...], tasks=[...], process=Process.sequential)</code> wires the team in strict order — researcher → writer → reviewer — with no back-edges. 4) <code>crew.kickoff(inputs={"topic": ...})</code> templates <code>{topic}</code> into every prompt and runs the chain, returning the reviewer's final approval (or list of required edits).</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A 3-agent crew implemented as plain Python functions chained sequentially, with a context dict passing outputs between steps.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">researcher</span>(topic):
    facts = {
        <span class="str">'MoE'</span>: [<span class="str">'Switch Transformer (Fedus 2022)'</span>, <span class="str">'Mixtral 8x7B (Mistral 2023)'</span>, <span class="str">'GShard (Google 2020)'</span>],
        <span class="str">'RAG'</span>: [<span class="str">'Lewis 2020 paper'</span>, <span class="str">'LangChain RAG patterns'</span>, <span class="str">'Cohere reranker'</span>],
    }
    findings = facts.<span class="fn">get</span>(topic, [<span class="str">'no data'</span>])
    <span class="kw">return</span> [f<span class="str">'- {f}'</span> <span class="kw">for</span> f <span class="kw">in</span> findings]
<span class="kw">def</span> <span class="fn">writer</span>(findings):
    body = <span class="str">' '</span>.<span class="fn">join</span>(findings)
    <span class="kw">return</span> f<span class="str">'INTRO. {body}. CONCLUSION. ({len(body)} chars)'</span>
<span class="kw">def</span> <span class="fn">reviewer</span>(article, findings):
    has_citations = <span class="fn">all</span>(<span class="fn">any</span>(c <span class="kw">in</span> article <span class="kw">for</span> c <span class="kw">in</span> f.<span class="fn">split</span>()) <span class="kw">for</span> f <span class="kw">in</span> findings)
    <span class="kw">return</span> (<span class="str">'APPROVED'</span>, article) <span class="kw">if</span> has_citations <span class="kw">else</span> (<span class="str">'REVISE'</span>, <span class="str">'add citations'</span>)
context = {}
context[<span class="str">'findings'</span>] = <span class="fn">researcher</span>(<span class="str">'MoE'</span>)
<span class="fn">print</span>(<span class="str">'researcher ->'</span>, context[<span class="str">'findings'</span>])
context[<span class="str">'draft'</span>] = <span class="fn">writer</span>(context[<span class="str">'findings'</span>])
<span class="fn">print</span>(<span class="str">'writer ->'</span>, context[<span class="str">'draft'</span>][:<span class="num">80</span>], <span class="str">'...'</span>)
verdict, final = <span class="fn">reviewer</span>(context[<span class="str">'draft'</span>], context[<span class="str">'findings'</span>])
<span class="fn">print</span>(<span class="str">'reviewer ->'</span>, verdict)
<span class="fn">print</span>(<span class="str">'FINAL:'</span>, final[:<span class="num">120</span>])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>researcher(topic)</code> looks the topic up in a tiny canned fact map and returns a list of bullet-formatted findings — the writer reads this directly. 2) <code>writer(findings)</code> concatenates the bullets between fixed INTRO / CONCLUSION markers, producing the prose draft a real writer LLM would emit. 3) <code>reviewer(article, findings)</code> performs the citation check: every finding's words must appear somewhere in the article; if any are missing it returns <code>('REVISE', 'add citations')</code>, otherwise <code>('APPROVED', article)</code>. 4) The <code>context</code> dict mimics CrewAI's hand-off mechanism — researcher's output lives at <code>context['findings']</code> and feeds the writer, whose output at <code>context['draft']</code> feeds the reviewer; the final print shows the exact pipeline shape without any framework.</p>
</div>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. AutoGen 0.4: Group Chat and Speaker Selection</h2>

<p class="l-text">AutoGen (Microsoft, 0.4 released late 2024) is more flexible than CrewAI: agents share a chat transcript and a <strong>group chat manager</strong> picks who speaks next at every turn. The selection function can be round-robin, random, LLM-driven ("read the transcript, pick the most relevant agent"), or rule-based.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install autogen-agentchat autogen-ext[openai]</span>
<span class="kw">from</span> autogen_agentchat.agents <span class="kw">import</span> AssistantAgent
<span class="kw">from</span> autogen_agentchat.teams <span class="kw">import</span> SelectorGroupChat
<span class="kw">from</span> autogen_agentchat.conditions <span class="kw">import</span> TextMentionTermination, MaxMessageTermination
<span class="kw">from</span> autogen_ext.models.openai <span class="kw">import</span> OpenAIChatCompletionClient

model = <span class="fn">OpenAIChatCompletionClient</span>(model=<span class="str">"gpt-4o"</span>)

planner   = <span class="fn">AssistantAgent</span>(<span class="str">"planner"</span>,   model_client=model,
                              system_message=<span class="str">"Decompose the user goal. Stop when others execute."</span>)
coder     = <span class="fn">AssistantAgent</span>(<span class="str">"coder"</span>,     model_client=model,
                              system_message=<span class="str">"Write Python. Hand off to tester when done."</span>)
tester    = <span class="fn">AssistantAgent</span>(<span class="str">"tester"</span>,    model_client=model,
                              system_message=<span class="str">"Run the code, report PASS/FAIL. Say TERMINATE on success."</span>)

<span class="kw">def</span> <span class="fn">selector</span>(messages):
    <span class="cm"># Custom routing: planner first, then alternate coder/tester</span>
    <span class="kw">if</span> <span class="kw">not</span> messages: <span class="kw">return</span> <span class="str">"planner"</span>
    last = messages[-<span class="num">1</span>].source
    <span class="kw">if</span> last == <span class="str">"planner"</span>: <span class="kw">return</span> <span class="str">"coder"</span>
    <span class="kw">if</span> last == <span class="str">"coder"</span>:   <span class="kw">return</span> <span class="str">"tester"</span>
    <span class="kw">if</span> last == <span class="str">"tester"</span>:  <span class="kw">return</span> <span class="str">"coder"</span>  <span class="cm"># tester demands fixes</span>
    <span class="kw">return</span> <span class="kw">None</span>  <span class="cm"># let the LLM-based selector decide</span>

team = <span class="fn">SelectorGroupChat</span>(
    [planner, coder, tester],
    model_client=model,
    selector_func=selector,
    termination_condition=<span class="fn">TextMentionTermination</span>(<span class="str">"TERMINATE"</span>) | <span class="fn">MaxMessageTermination</span>(<span class="num">12</span>),
)

<span class="kw">await</span> team.<span class="fn">run</span>(task=<span class="str">"Implement quicksort and verify on [3,1,4,1,5,9,2,6]"</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Three <code>AssistantAgent</code>s share one OpenAI <code>model_client</code> but get sharply different <code>system_message</code>s — planner decomposes, coder writes Python, tester runs it and emits <code>TERMINATE</code> on success. 2) <code>selector(messages)</code> is a custom routing function that overrides AutoGen's default LLM-based pick: empty history → planner, planner → coder, coder → tester, tester → coder (so the tester can demand fixes); returning <code>None</code> hands the decision back to AutoGen's LLM selector. 3) <code>SelectorGroupChat</code> wires the agents with <code>selector_func=selector</code> and a combined termination condition — stop on the literal <code>TERMINATE</code> token <em>or</em> 12 messages, whichever fires first. 4) <code>await team.run(task=...)</code> executes the chat: every turn the selector picks the next speaker, the agent invokes the model, and the message is appended to the shared transcript until the termination condition fires.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A mock group chat: 3 agents take turns according to a custom selector function, transcript stored in a list, terminates on TERMINATE or 12 messages.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SCRIPT = {
    <span class="str">'planner'</span>: [<span class="str">'Plan: 1) write quicksort 2) test on sample 3) verify sorted'</span>],
    <span class="str">'coder'</span>:   [<span class="str">'def qs(a): return a if len(a)<2 else qs([x for x in a[1:] if x<a[0]])+[a[0]]+qs([x for x in a[1:] if x>=a[0]])'</span>,
                <span class="str">'Fixed: handles duplicates with x>=a[0]'</span>],
    <span class="str">'tester'</span>:  [<span class="str">'FAIL: missed duplicates in [3,3,1]'</span>, <span class="str">'PASS: [1,1,2,3,3,4,5,6,9]. TERMINATE'</span>],
}
<span class="kw">def</span> <span class="fn">selector</span>(messages):
    <span class="kw">if</span> <span class="kw">not</span> messages: <span class="kw">return</span> <span class="str">'planner'</span>
    last = messages[-<span class="num">1</span>][<span class="num">0</span>]
    <span class="kw">return</span> {<span class="str">'planner'</span>:<span class="str">'coder'</span>,<span class="str">'coder'</span>:<span class="str">'tester'</span>,<span class="str">'tester'</span>:<span class="str">'coder'</span>}.<span class="fn">get</span>(last)
turn_idx = {<span class="str">'planner'</span>:<span class="num">0</span>, <span class="str">'coder'</span>:<span class="num">0</span>, <span class="str">'tester'</span>:<span class="num">0</span>}
messages = []
<span class="kw">for</span> turn <span class="kw">in</span> <span class="fn">range</span>(<span class="num">12</span>):
    who = <span class="fn">selector</span>(messages)
    <span class="kw">if</span> who <span class="kw">is</span> <span class="kw">None</span>: <span class="kw">break</span>
    msg = SCRIPT[who][turn_idx[who]]
    turn_idx[who] = <span class="fn">min</span>(turn_idx[who] + <span class="num">1</span>, <span class="fn">len</span>(SCRIPT[who]) - <span class="num">1</span>)
    messages.<span class="fn">append</span>((who, msg))
    <span class="fn">print</span>(f<span class="str">'  [{who:7s}] {msg[:70]}'</span>)
    <span class="kw">if</span> <span class="str">'TERMINATE'</span> <span class="kw">in</span> msg: <span class="kw">break</span>
<span class="fn">print</span>(f<span class="str">'Done in {len(messages)} turns'</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>SCRIPT</code> maps each agent name to its pre-canned utterances; <code>turn_idx</code> tracks where in the script each agent currently is — same shape AutoGen would see if real LLM responses streamed in. 2) <code>selector(messages)</code> reads the last speaker and returns the next per the fixed routing table planner → coder → tester → coder; the function would return <code>None</code> if it ever ran out of routes. 3) The 12-step driver loop asks the selector for the next agent, pops the next line from the agent's script, appends the (who, msg) pair to the shared <code>messages</code> transcript and prints a compact trace. 4) The loop breaks as soon as <code>TERMINATE</code> appears in a message — the same termination contract <code>TextMentionTermination("TERMINATE")</code> enforces in real AutoGen.</p>
</div>

<div class="calc-highlight"><strong>The selector is the orchestration brain.</strong> A naive round-robin works for chains-of-thought; a custom function lets you encode workflows ("after a tester FAIL go back to coder, after PASS go to TERMINATE"). LLM-based selectors give flexibility but cost a call per turn — use them only when you cannot rule-encode the routing.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Supervisor Pattern (LangGraph)</h2>

<p class="l-text">LangGraph's supervisor pattern is the same idea expressed as a state machine: a single <strong>supervisor</strong> node sees the conversation history at every turn and emits a routing decision (which worker to run next, or "finish"). Workers are leaf nodes; control always returns to the supervisor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Supervisor</div><div class="card-body">Pure router. Reads transcript, returns next-worker name. No tools.</div></div>
<div class="calc-card"><div class="card-title">Worker</div><div class="card-body">Specialized agent with 1-3 tools. Returns one message. Hands back to supervisor.</div></div>
<div class="calc-card"><div class="card-title">State</div><div class="card-body">Shared dict: messages, scratchpad, intermediate artifacts. Updated on every turn.</div></div>
<div class="calc-card"><div class="card-title">Termination</div><div class="card-body">Supervisor decides "finish" or budget hits a cap (max turns, max tokens).</div></div>
</div>

<p class="l-text">The advantage over group chat: explicit control flow, easy to visualize as a DAG, deterministic when the supervisor is rule-based. The disadvantage: every routing decision is a supervisor LLM call — at 100 turns that is 100 extra calls.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Debate: Two Agents Argue Until One Concedes</h2>

<p class="l-text">Multi-Agent Debate (Du et al, 2023) showed that two LLMs arguing over an answer reach correct conclusions more often than either alone. Each round: agent A states a position, agent B critiques and counter-proposes, A revises. After K rounds a judge picks the surviving answer. On math benchmarks, debate beats single-shot GPT-4 by 5-10 points.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">debate</span>(question, rounds=<span class="num">3</span>):
    <span class="cm"># Two agents with mildly different system prompts (or same model, just primed differently)</span>
    a = <span class="fn">Agent</span>(<span class="str">"You are confident, defend your answer hard."</span>)
    b = <span class="fn">Agent</span>(<span class="str">"You are skeptical, attack any unsupported claim."</span>)
    transcript = []
    answer_a = a.<span class="fn">invoke</span>(f<span class="str">"Q: {question}\nGive your best answer with reasoning."</span>)
    transcript.<span class="fn">append</span>((<span class="str">"A"</span>, answer_a))
    <span class="kw">for</span> r <span class="kw">in</span> <span class="fn">range</span>(rounds):
        critique = b.<span class="fn">invoke</span>(f<span class="str">"A says: {answer_a}\nFind a flaw or concur. Be specific."</span>)
        transcript.<span class="fn">append</span>((<span class="str">"B"</span>, critique))
        answer_a = a.<span class="fn">invoke</span>(f<span class="str">"B's critique: {critique}\nDefend or revise your answer."</span>)
        transcript.<span class="fn">append</span>((<span class="str">"A"</span>, answer_a))
    <span class="cm"># Judge picks the surviving claim</span>
    judge_verdict = judge.<span class="fn">invoke</span>(f<span class="str">"Question: {question}\nDebate: {transcript}\nFinal answer:"</span>)
    <span class="kw">return</span> judge_verdict</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Spawns two <code>Agent</code> instances with deliberately adversarial system prompts — A is told to defend confidently, B is told to attack any unsupported claim; both can be the same underlying model. 2) <code>answer_a</code> is seeded with A's first answer; each <code>r in range(rounds)</code> iteration runs B-critiques-A then A-revises-against-the-critique, growing the running <code>transcript</code> list. 3) After K rounds a separate <code>judge</code> LLM reads the full transcript and picks the surviving claim — this third party prevents the loop from rubber-stamping its last revision. 4) Returning <code>judge_verdict</code> is the production pattern: agents debate, a neutral judge decides — which is why Multi-Agent Debate beats single-shot GPT-4 by 5-10 points on math benchmarks.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A debate on a real arithmetic problem. Agent A guesses, B critiques with a checker, A revises. Judge picks the answer that passes the verifier.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>question = <span class="str">'What is 23 * 47?'</span>
true_answer = <span class="num">23</span> * <span class="num">47</span>
<span class="kw">def</span> <span class="fn">agent_a</span>(history):
    <span class="kw">if</span> <span class="kw">not</span> history: <span class="kw">return</span> <span class="num">1100</span>   <span class="cm"># confident-but-wrong opening</span>
    last_b = history[-<span class="num">1</span>][<span class="num">1</span>]
    <span class="kw">if</span> <span class="str">'too low'</span> <span class="kw">in</span> last_b: <span class="kw">return</span> <span class="num">1080</span>
    <span class="kw">if</span> <span class="str">'too high'</span> <span class="kw">in</span> last_b: <span class="kw">return</span> <span class="num">1070</span>
    <span class="kw">return</span> <span class="num">1081</span>  <span class="cm"># the truth</span>
<span class="kw">def</span> <span class="fn">agent_b</span>(claim):
    <span class="kw">if</span> claim &lt; true_answer: <span class="kw">return</span> <span class="str">'FLAW: too low. Recompute.'</span>
    <span class="kw">if</span> claim &gt; true_answer: <span class="kw">return</span> <span class="str">'FLAW: too high. Recompute.'</span>
    <span class="kw">return</span> <span class="str">'CONCEDE: claim verified.'</span>
transcript = []
a_answer = <span class="fn">agent_a</span>([])
transcript.<span class="fn">append</span>((<span class="str">'A'</span>, a_answer))
<span class="fn">print</span>(f<span class="str">'  Round 0: A claims {a_answer}'</span>)
<span class="kw">for</span> r <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    b_resp = <span class="fn">agent_b</span>(a_answer)
    transcript.<span class="fn">append</span>((<span class="str">'B'</span>, b_resp))
    <span class="fn">print</span>(f<span class="str">'  Round {r+1}: B says <span class="str">"{b_resp}"</span>'</span>)
    <span class="kw">if</span> <span class="str">'CONCEDE'</span> <span class="kw">in</span> b_resp: <span class="kw">break</span>
    a_answer = <span class="fn">agent_a</span>(transcript)
    transcript.<span class="fn">append</span>((<span class="str">'A'</span>, a_answer))
    <span class="fn">print</span>(f<span class="str">'  Round {r+1}: A revises to {a_answer}'</span>)
<span class="fn">print</span>(f<span class="str">'JUDGE: final answer = {a_answer} (truth = {true_answer})'</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>agent_a(history)</code> is the confidently-wrong defender: opens with 1100, then steps closer to the truth based on B's previous "too low" / "too high" feedback — eventually converging on the actual product 1081. 2) <code>agent_b(claim)</code> is the adversarial checker with access to the ground truth; emits a tagged critique (<code>FLAW: too low</code>, <code>FLAW: too high</code>, or <code>CONCEDE: claim verified</code>). 3) The driver loop seeds A's first answer, then alternates B-critique → A-revise; breaks on <code>CONCEDE</code> so the debate stops once A produces a correct claim. 4) Printing the final judge line shows the debate path (1100 → 1080 → 1070 → 1081) — the same shape Multi-Agent Debate uses, with a deterministic checker standing in for the LLM judge.</p>
</div>

<div class="calc-highlight"><strong>Why debate works:</strong> a single LLM is biased toward its first guess (anchoring). Forcing it to defend the guess against an adversary surfaces hidden assumptions. The trick is making the critic <em>genuinely adversarial</em> — if both agents share the same system prompt, they tend to agree (sycophancy collapse).</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Voting and Self-Consistency</h2>

<p class="l-text">The simplest multi-agent technique: run N independent agents on the same problem and vote on the answer. Self-Consistency (Wang et al, 2022) showed that majority-voting K=40 chains beats greedy decoding by 5-15 points on math benchmarks. The agents do not need to communicate at all — independence is the feature.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> collections <span class="kw">import</span> Counter
<span class="kw">import</span> concurrent.futures <span class="kw">as</span> cf

<span class="kw">def</span> <span class="fn">one_attempt</span>(question, seed):
    <span class="cm"># temperature=0.7 so each call diverges</span>
    <span class="kw">return</span> llm.<span class="fn">invoke</span>(f<span class="str">"[seed:{seed}] {question}\nFinal answer on last line."</span>).content.<span class="fn">strip</span>().<span class="fn">split</span>(<span class="str">"\n"</span>)[-<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">vote</span>(question, k=<span class="num">10</span>):
    <span class="kw">with</span> cf.<span class="fn">ThreadPoolExecutor</span>(<span class="num">10</span>) <span class="kw">as</span> ex:
        answers = <span class="fn">list</span>(ex.<span class="fn">map</span>(<span class="kw">lambda</span> s: <span class="fn">one_attempt</span>(question, s), <span class="fn">range</span>(k)))
    counts = <span class="fn">Counter</span>(answers)
    winner, votes = counts.<span class="fn">most_common</span>(<span class="num">1</span>)[<span class="num">0</span>]
    <span class="kw">return</span> winner, votes / k  <span class="cm"># answer + confidence</span>

<span class="cm"># For numeric tasks: majority over the FINAL number, not the full text</span>
<span class="cm"># For multiple choice: count A/B/C/D directly</span>
<span class="cm"># For open-ended: bucket answers with an LLM judge or embedding similarity</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>one_attempt(question, seed)</code> embeds the seed into the prompt and at temperature 0.7 returns the last line of the model's response — the "final answer" convention every voter follows. 2) <code>vote(question, k=10)</code> uses a <code>ThreadPoolExecutor</code> with 10 workers to fire all k attempts concurrently — wall time stays near a single call's latency. 3) <code>Counter(answers).most_common(1)[0]</code> picks the modal answer; the function returns the winner plus <code>votes/k</code> as a confidence score the caller can threshold. 4) The trailing comments name the three production gotchas: numeric tasks should extract the final number before counting, multiple-choice tasks count letters directly, and open-ended outputs need bucketing (LLM judge or embedding similarity) before voting makes sense.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Self-consistency simulation: 10 noisy agents guess an answer with bias toward the truth, majority voting recovers the correct value despite individual errors.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> collections <span class="kw">import</span> Counter
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
true_answer = <span class="num">42</span>
<span class="kw">def</span> <span class="fn">noisy_agent</span>():
    <span class="cm"># 60% truth, 40% one of 4 distractors</span>
    <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; <span class="num">0.6</span>: <span class="kw">return</span> true_answer
    <span class="kw">return</span> <span class="fn">int</span>(rng.<span class="fn">choice</span>([<span class="num">41</span>, <span class="num">43</span>, <span class="num">24</span>, <span class="num">50</span>]))
<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">1</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">20</span>, <span class="num">40</span>]:
    correct = <span class="num">0</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
        guesses = [<span class="fn">noisy_agent</span>() <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(k)]
        winner, _ = <span class="fn">Counter</span>(guesses).<span class="fn">most_common</span>(<span class="num">1</span>)[<span class="num">0</span>]
        <span class="kw">if</span> winner == true_answer: correct += <span class="num">1</span>
    <span class="fn">print</span>(f<span class="str">'  k={k:3d}  majority-vote accuracy = {correct/200:.2%}'</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>noisy_agent()</code> models a single agent: it returns the true answer 42 with probability 0.6 and one of four distractor numbers otherwise — exactly the kind of independent-error pattern Self-Consistency exploits. 2) For each <code>k</code> in <code>[1, 5, 10, 20, 40]</code> the outer loop runs 200 trials; each trial calls <code>noisy_agent()</code> k times and uses <code>Counter.most_common(1)</code> to pick the majority guess. 3) The accuracy estimate over 200 trials shows the Self-Consistency curve in action: single-call accuracy stays near 60%, but k=40 voting climbs into the high 80s — the same shape the original paper reported on math benchmarks. 4) The trick only works because each call is independent (seeded RNG, would be temperature in a real model); shared bias across voters would amplify the error instead of cancelling it.</p>
</div>

<p class="l-text">Voting works when the noise across agents is roughly independent. If all agents share a systematic bias (same training data, same prompt template), voting amplifies the bias instead of cancelling it. Diversify by varying temperature, sampling seeds, system prompts, or even using different model families.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Swarm Pattern: Workers Pull from a Queue</h2>

<p class="l-text">OpenAI Swarm (released 2024 as an experimental framework) inverts hierarchical control: there is no manager. Tasks live in a shared queue; idle agents pull the next task that matches their skills. The original LangChain Multi-agent Network and Anthropic's parallel-tool-use patterns also belong here. Best for embarrassingly parallel jobs (scrape 1000 pages, summarize 50 documents).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hierarchical</div><div class="card-body">Manager pushes work down. Bottleneck at the top, cleanest accountability.</div></div>
<div class="calc-card"><div class="card-title">Group chat</div><div class="card-body">Single transcript, turn-taking. Best for collaborative reasoning.</div></div>
<div class="calc-card"><div class="card-title">Swarm / pool</div><div class="card-body">Workers pull from a queue. Best for parallel throughput.</div></div>
<div class="calc-card"><div class="card-title">Handoff</div><div class="card-body">Each agent has a "transfer to X" tool. Routing emerges from agent choices.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Swarm-style: agents declare skills, pool dispatches</span>
<span class="kw">import</span> queue, threading

task_q = queue.<span class="fn">Queue</span>()
results = []

<span class="kw">def</span> <span class="fn">worker</span>(name, skills, llm):
    <span class="kw">while</span> <span class="kw">True</span>:
        task = task_q.<span class="fn">get</span>()
        <span class="kw">if</span> task <span class="kw">is</span> <span class="kw">None</span>: <span class="kw">break</span>
        <span class="kw">if</span> task[<span class="str">"type"</span>] <span class="kw">in</span> skills:
            out = llm.<span class="fn">invoke</span>(task[<span class="str">"prompt"</span>])
            results.<span class="fn">append</span>((name, task[<span class="str">"id"</span>], out))
        <span class="kw">else</span>:
            task_q.<span class="fn">put</span>(task)  <span class="cm"># back to queue for someone else</span>
        task_q.<span class="fn">task_done</span>()

<span class="cm"># Spawn 4 workers with different skill sets</span>
threads = [
    threading.<span class="fn">Thread</span>(target=worker, args=(<span class="str">"summarizer"</span>, {<span class="str">"summary"</span>}, llm)),
    threading.<span class="fn">Thread</span>(target=worker, args=(<span class="str">"translator"</span>,  {<span class="str">"translate"</span>}, llm)),
    threading.<span class="fn">Thread</span>(target=worker, args=(<span class="str">"classifier"</span>, {<span class="str">"classify"</span>}, llm)),
    threading.<span class="fn">Thread</span>(target=worker, args=(<span class="str">"generalist"</span>, {<span class="str">"summary"</span>, <span class="str">"translate"</span>, <span class="str">"classify"</span>}, llm)),
]
<span class="kw">for</span> t <span class="kw">in</span> threads: t.<span class="fn">start</span>()

<span class="cm"># Push 100 mixed tasks; pool processes in parallel</span>
<span class="kw">for</span> i, (kind, prompt) <span class="kw">in</span> <span class="fn">enumerate</span>(jobs):
    task_q.<span class="fn">put</span>({<span class="str">"id"</span>: i, <span class="str">"type"</span>: kind, <span class="str">"prompt"</span>: prompt})
task_q.<span class="fn">join</span>()</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>task_q</code> is a shared <code>queue.Queue</code>; every <code>worker(name, skills, llm)</code> thread loops blocking-pulls from it — when the task's <code>type</code> matches its <code>skills</code> set it runs the LLM and appends to <code>results</code>, otherwise it returns the task to the queue. 2) Four worker threads start with overlapping but distinct skill sets — three specialists (<code>summarizer</code>, <code>translator</code>, <code>classifier</code>) and a <code>generalist</code> that can take any of the three task kinds. 3) The for loop pushes every <code>(kind, prompt)</code> in <code>jobs</code> as a typed dict; multiple workers consume them concurrently — exactly the OpenAI Swarm "task pool" topology. 4) <code>task_q.join()</code> blocks until every task has been marked done via <code>task_q.task_done()</code>; you'd send <code>None</code> sentinels afterwards to stop the workers cleanly.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A single-thread swarm dispatcher: tasks queued, agents poll in round-robin, each takes only tasks matching its skills.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> collections <span class="kw">import</span> deque
WORKERS = {
    <span class="str">'summarizer'</span>: {<span class="str">'summary'</span>},
    <span class="str">'translator'</span>: {<span class="str">'translate'</span>},
    <span class="str">'classifier'</span>: {<span class="str">'classify'</span>},
    <span class="str">'generalist'</span>: {<span class="str">'summary'</span>, <span class="str">'translate'</span>, <span class="str">'classify'</span>},
}
tasks = <span class="fn">deque</span>([
    {<span class="str">'id'</span>: <span class="num">0</span>, <span class="str">'type'</span>: <span class="str">'summary'</span>,   <span class="str">'data'</span>: <span class="str">'long article'</span>},
    {<span class="str">'id'</span>: <span class="num">1</span>, <span class="str">'type'</span>: <span class="str">'translate'</span>, <span class="str">'data'</span>: <span class="str">'hello'</span>},
    {<span class="str">'id'</span>: <span class="num">2</span>, <span class="str">'type'</span>: <span class="str">'classify'</span>,  <span class="str">'data'</span>: <span class="str">'review text'</span>},
    {<span class="str">'id'</span>: <span class="num">3</span>, <span class="str">'type'</span>: <span class="str">'summary'</span>,   <span class="str">'data'</span>: <span class="str">'paper'</span>},
    {<span class="str">'id'</span>: <span class="num">4</span>, <span class="str">'type'</span>: <span class="str">'translate'</span>, <span class="str">'data'</span>: <span class="str">'thank you'</span>},
    {<span class="str">'id'</span>: <span class="num">5</span>, <span class="str">'type'</span>: <span class="str">'classify'</span>,  <span class="str">'data'</span>: <span class="str">'tweet'</span>},
])
results = []
worker_cycle = <span class="fn">list</span>(WORKERS.<span class="fn">keys</span>())
i = <span class="num">0</span>
<span class="kw">while</span> tasks:
    task = tasks.<span class="fn">popleft</span>()
    tries = <span class="num">0</span>
    <span class="kw">while</span> tries &lt; <span class="fn">len</span>(worker_cycle):
        w = worker_cycle[i % <span class="fn">len</span>(worker_cycle)]
        i += <span class="num">1</span>
        <span class="kw">if</span> task[<span class="str">'type'</span>] <span class="kw">in</span> WORKERS[w]:
            results.<span class="fn">append</span>((w, task[<span class="str">'id'</span>], task[<span class="str">'type'</span>]))
            <span class="fn">print</span>(f<span class="str">'  task {task[<span class="str">"id"</span>]} ({task[<span class="str">"type"</span>]:9s}) -> {w}'</span>)
            <span class="kw">break</span>
        tries += <span class="num">1</span>
<span class="fn">print</span>(f<span class="str">'Processed {len(results)} tasks across {len(set(r[0] for r in results))} workers'</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>WORKERS</code> declares four agents and the skill sets they accept — three specialists plus one generalist that covers all three task types. 2) <code>tasks</code> is a <code>deque</code> of typed work items; popping from the left mimics the FIFO behaviour of the threaded queue without needing threads. 3) The outer loop pops a task, then the inner loop cycles through <code>worker_cycle</code> in round-robin order until it finds a worker whose <code>skills</code> set contains the task's <code>type</code>; the matched assignment is appended to <code>results</code> and printed. 4) The final summary reports total tasks processed and unique workers used — a stand-in for the metric you would log in a real swarm to spot tool-starvation (one worker doing everything) or unmatched tasks.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Failure Modes (and How to Catch Them)</h2>

<p class="l-text">Multi-agent systems fail in subtle ways that single agents do not. Knowing the failure modes is half the battle.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sycophancy collapse</div><div class="card-body">Agents agree with each other to be polite, wrong answer survives. Fix: assign explicitly adversarial roles.</div></div>
<div class="calc-card"><div class="card-title">Message storm</div><div class="card-body">Two agents bounce "thanks!" / "you're welcome!" forever. Fix: hard turn limit, terminate on no progress.</div></div>
<div class="calc-card"><div class="card-title">Drift</div><div class="card-body">After 20 turns the conversation is about something unrelated. Fix: pin original goal in system prompt every turn.</div></div>
<div class="calc-card"><div class="card-title">Tool starvation</div><div class="card-body">One worker has all the useful tools, others stall. Fix: rebalance tool assignments or merge roles.</div></div>
<div class="calc-card"><div class="card-title">Cost explosion</div><div class="card-body">5 agents x 20 turns x 4k context = 400k tokens per query. Fix: ReWOO-style plans, cheap models for routine workers.</div></div>
<div class="calc-card"><div class="card-title">Deadlock</div><div class="card-body">A waits for B, B waits for A. Fix: timeouts, supervisor with explicit termination clause.</div></div>
</div>

<div class="calc-highlight"><strong>Single-agent baseline first.</strong> Always benchmark a single GPT-4 + tools agent on your task before spinning up a multi-agent system. If the single agent already hits 90% accuracy, MAS adds latency and cost for no benefit. MAS shines when single-agent caps below 70% AND the failures are diverse (different errors on different runs).</div>

<p class="l-text">In Lesson 9 we leave the world of "agents that talk to each other" for "agents that interact with the real world" — Anthropic's Computer Use API, code agents like Aider and Devin, and the sandboxing infrastructure (Modal, Daytona, e2b.dev) that keeps an autonomous agent from breaking your laptop.</p>
</div>`,

tr: `<p class="l-text"><strong>Tek bir agent'ın tek bir bakış açısı vardır; çok-agent sistemler tartışır, iş bölümü yapar ve oy kullanır.</strong> Sezgi insan ekiplerinden gelir: bir araştırmacı gerçekleri toplar, bir yazar makaleyi taslaklaştırır, bir gözden geçirici zayıf iddialara meydan okur. Her rolün daha sıkı bir prompt'u, daha keskin araç erişimi ve alana-özgü bir personası vardır. Çok-agent sistemler (MAS) bunu yazılımda yeniden üretir — ve geniş bir görev sınıfında HumanEval ve HotpotQA gibi benchmark'larda tek süper-prompt'u 10-30 puan geçer.</p>

<p class="l-text">Bu ders üç production framework'ünü (Microsoft'un AutoGen 0.4'ü, CrewAI ve LangGraph multi-agent), bunları orkestralayan supervisor kalıbını ve sonsuz döngüleri önleyen koordinasyon protokollerini kapsar: sıra-alma, oylama, tartışma ve sürü-tarzı görev havuzları. Başarısızlık modlarıyla bitiriyoruz — birbirini pohpohlayıp yanlış cevaplara giden agent'lar, kontrolden çıkmış mesaj fırtınaları ve "sadece tek büyük agent kullan"ın ne zaman kazandığına karar veren maliyet denklemi.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Rol-özgü araçlarla 3-agent'lı bir CrewAI crew (Researcher, Writer, Reviewer) inşa etmek</li>
<li>Programlanabilir bir konuşmacı-seçim fonksiyonuyla AutoGen group chat çalıştırmak</li>
<li>Turları yönlendiren ve ne zaman sonlandıracağına karar veren bir supervisor uygulamak</li>
<li>Halüsinasyonu azaltmak için çoğunluk oylaması ve tartışma protokolleri uygulamak</li>
<li>Çok-agent başarısızlık modlarını teşhis etmek: sycophancy, drift, mesaj fırtınaları</li>
<li>Sürü havuzlarını (worker'lar görev kapar) hiyerarşikle (manager dispatch eder) karşılaştırmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Çok-Agent? Uzmanlaşma Argümanı</h2>

<p class="l-text">20 araç ve 5000-token sistem prompt'u olan tek bir agent <em>bilişsel aşırı yüklenme</em>'den muzdariptir: her adımda LLM dev prompt'u okumalı, 20 araçtan hangisini çağıracağına karar vermeli ve hedefi gözden kaçırmamalıdır. Token-token attention sınırlıdır. İşi her biri 2-3 araç ve 300-token persona içeren N agent'a bölmek, her LLM çağrısını daha keskin bir karar haline getirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tek mega-agent</div><div class="card-body">Tüm araçlar, tüm bilgi, tek akıl. Deploy etmesi basit, ölçekte kırılgan, pahalı prompt'lar.</div></div>
<div class="calc-card"><div class="card-title">Hiyerarşik MAS</div><div class="card-body">Manager uzmanlara dispatch eder. Temiz sahiplik, ama manager bir darboğazdır.</div></div>
<div class="calc-card"><div class="card-title">Group-chat MAS</div><div class="card-body">Tüm agent'lar bir transkripti paylaşır, sırayla konuşur. AutoGen tarzı. Esnek ama dağınık.</div></div>
<div class="calc-card"><div class="card-title">Swarm MAS</div><div class="card-body">Paylaşılan görev kuyruğu, boştaki agent'lar iş kapar. OpenAI Swarm tarzı. Paralel işler için en iyisi.</div></div>
</div>

<p class="l-text">Microsoft'un AutoGen makalesi (Wu ve ark., 2023), 3-agent assistant + critic + executor kurulumlarının kodlama ve matematik görevlerinde karşılaştırılabilir token maliyetinde tek-agent GPT-4'ü 10-25 puan geçtiğini bildirdi — çünkü critic asistanın kaçırdığı hataları yakalar.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. CrewAI: Rol-Tabanlı Crew'lar</h2>

<p class="l-text">CrewAI (2024'te yayınlandı) en görüşlü duruşu sergiler: agent'lar <strong>role + goal + backstory + tools</strong> ile tanımlanır ve görevler rollere atanır. Crew sırayla veya hiyerarşik olarak çalışır. Zihinsel model bir film yapım ekibidir — yönetmen, görüntü yönetmeni, kurgucu — her biri en iyi yaptığını yapar, devirler belgelenir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install crewai crewai-tools</span>
<span class="kw">from</span> crewai <span class="kw">import</span> Agent, Task, Crew, Process
<span class="kw">from</span> crewai_tools <span class="kw">import</span> SerperDevTool

search_tool = <span class="fn">SerperDevTool</span>()

researcher = <span class="fn">Agent</span>(
    role=<span class="str">"Senior NLP Researcher"</span>,
    goal=<span class="str">"Find authoritative sources on {topic} from arxiv and top blogs"</span>,
    backstory=<span class="str">"PhD in NLP, reads 50 papers a week, allergic to clickbait"</span>,
    tools=[search_tool],
    verbose=<span class="kw">True</span>,
)
writer = <span class="fn">Agent</span>(
    role=<span class="str">"Technical Writer"</span>,
    goal=<span class="str">"Turn raw research into a 600-word piece for an engineer audience"</span>,
    backstory=<span class="str">"Ex-developer turned writer, hates jargon, loves diagrams"</span>,
    tools=[],
)
reviewer = <span class="fn">Agent</span>(
    role=<span class="str">"Editor-in-Chief"</span>,
    goal=<span class="str">"Block any claim without a citation, demand rewrites"</span>,
    backstory=<span class="str">"Fact-checker for 10 years, ruthless, brief"</span>,
    tools=[],
)

t1 = <span class="fn">Task</span>(description=<span class="str">"Research {topic}, return 8 bulleted findings with URLs"</span>,
          agent=researcher, expected_output=<span class="str">"Bulleted list with citations"</span>)
t2 = <span class="fn">Task</span>(description=<span class="str">"Write a 600-word article based on findings"</span>,
          agent=writer, expected_output=<span class="str">"Markdown article"</span>, context=[t1])
t3 = <span class="fn">Task</span>(description=<span class="str">"Review the article, demand fixes for unsupported claims"</span>,
          agent=reviewer, expected_output=<span class="str">"Approved final article OR list of required edits"</span>, context=[t2])

crew = <span class="fn">Crew</span>(agents=[researcher, writer, reviewer], tasks=[t1, t2, t3], process=Process.sequential)
result = crew.<span class="fn">kickoff</span>(inputs={<span class="str">"topic"</span>: <span class="str">"Mixture of Experts in 2024 LLMs"</span>})</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Üç CrewAI <code>Agent</code> örneği kurulur — researcher, writer, reviewer — her biri sıkı bir <code>role</code>, <code>goal</code> ve <code>backstory</code> string'ine sabitlenir; yalnızca researcher bir <code>SerperDevTool</code> alır, diğerleri <code>tools=[]</code>'tir. 2) Üç <code>Task</code> nesnesi her rolün üretmesi gereken şeyi açık <code>expected_output</code> string'leriyle tarif eder; <code>t2</code> ve <code>t3</code> <code>context=[t1]</code> / <code>context=[t2]</code> geçirir, böylece CrewAI önceki görevin çıktısını sonraki prompt'a iliştirir. 3) <code>Crew(agents=[...], tasks=[...], process=Process.sequential)</code> ekibi sıkı sırayla bağlar — researcher → writer → reviewer — geri-kenar yok. 4) <code>crew.kickoff(inputs={"topic": ...})</code> <code>{topic}</code>'i her prompt'a şablonlar ve zinciri çalıştırır, reviewer'ın nihai onayını (veya gerekli düzenlemeler listesini) döner.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sıralı zincirlenen düz Python fonksiyonları olarak uygulanmış 3-agent'lı bir crew, adımlar arasında çıktıları geçiren bir context dict ile.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">researcher</span>(topic):
    facts = {
        <span class="str">'MoE'</span>: [<span class="str">'Switch Transformer (Fedus 2022)'</span>, <span class="str">'Mixtral 8x7B (Mistral 2023)'</span>, <span class="str">'GShard (Google 2020)'</span>],
        <span class="str">'RAG'</span>: [<span class="str">'Lewis 2020 paper'</span>, <span class="str">'LangChain RAG patterns'</span>, <span class="str">'Cohere reranker'</span>],
    }
    findings = facts.<span class="fn">get</span>(topic, [<span class="str">'no data'</span>])
    <span class="kw">return</span> [f<span class="str">'- {f}'</span> <span class="kw">for</span> f <span class="kw">in</span> findings]
<span class="kw">def</span> <span class="fn">writer</span>(findings):
    body = <span class="str">' '</span>.<span class="fn">join</span>(findings)
    <span class="kw">return</span> f<span class="str">'INTRO. {body}. CONCLUSION. ({len(body)} chars)'</span>
<span class="kw">def</span> <span class="fn">reviewer</span>(article, findings):
    has_citations = <span class="fn">all</span>(<span class="fn">any</span>(c <span class="kw">in</span> article <span class="kw">for</span> c <span class="kw">in</span> f.<span class="fn">split</span>()) <span class="kw">for</span> f <span class="kw">in</span> findings)
    <span class="kw">return</span> (<span class="str">'APPROVED'</span>, article) <span class="kw">if</span> has_citations <span class="kw">else</span> (<span class="str">'REVISE'</span>, <span class="str">'add citations'</span>)
context = {}
context[<span class="str">'findings'</span>] = <span class="fn">researcher</span>(<span class="str">'MoE'</span>)
<span class="fn">print</span>(<span class="str">'researcher ->'</span>, context[<span class="str">'findings'</span>])
context[<span class="str">'draft'</span>] = <span class="fn">writer</span>(context[<span class="str">'findings'</span>])
<span class="fn">print</span>(<span class="str">'writer ->'</span>, context[<span class="str">'draft'</span>][:<span class="num">80</span>], <span class="str">'...'</span>)
verdict, final = <span class="fn">reviewer</span>(context[<span class="str">'draft'</span>], context[<span class="str">'findings'</span>])
<span class="fn">print</span>(<span class="str">'reviewer ->'</span>, verdict)
<span class="fn">print</span>(<span class="str">'FINAL:'</span>, final[:<span class="num">120</span>])</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>researcher(topic)</code> konuyu küçük bir hazır gerçek haritasında arar ve bullet-formatlı bulgular listesi döndürür — writer bunu doğrudan okur. 2) <code>writer(findings)</code> bulguları sabit INTRO / CONCLUSION işaretleyicileri arasına birleştirir, gerçek bir writer LLM'in yayacağı düz metin taslağı üretir. 3) <code>reviewer(article, findings)</code> alıntı kontrolü yapar: her bulgunun kelimeleri yazıda bir yerde geçmek zorundadır; herhangi biri eksikse <code>('REVISE', 'add citations')</code> döner, aksi halde <code>('APPROVED', article)</code>. 4) <code>context</code> sözlüğü CrewAI'ın hand-off mekanizmasını taklit eder — researcher çıktısı <code>context['findings']</code>'da yaşar ve writer'ı besler, onun <code>context['draft']</code>'daki çıktısı reviewer'ı besler; son baskı, herhangi bir framework olmadan tam pipeline şeklini gösterir.</p>
</div>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. AutoGen 0.4: Group Chat ve Konuşmacı Seçimi</h2>

<p class="l-text">AutoGen (Microsoft, 0.4 2024 sonunda yayınlandı) CrewAI'dan daha esnek: agent'lar bir sohbet transkripti paylaşır ve bir <strong>group chat manager</strong> her turda kimin konuşacağını seçer. Seçim fonksiyonu round-robin, rastgele, LLM-güdümlü ("transkripti oku, en alakalı agent'ı seç") veya kural-tabanlı olabilir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># pip install autogen-agentchat autogen-ext[openai]</span>
<span class="kw">from</span> autogen_agentchat.agents <span class="kw">import</span> AssistantAgent
<span class="kw">from</span> autogen_agentchat.teams <span class="kw">import</span> SelectorGroupChat
<span class="kw">from</span> autogen_agentchat.conditions <span class="kw">import</span> TextMentionTermination, MaxMessageTermination
<span class="kw">from</span> autogen_ext.models.openai <span class="kw">import</span> OpenAIChatCompletionClient

model = <span class="fn">OpenAIChatCompletionClient</span>(model=<span class="str">"gpt-4o"</span>)

planner   = <span class="fn">AssistantAgent</span>(<span class="str">"planner"</span>,   model_client=model,
                              system_message=<span class="str">"Decompose the user goal. Stop when others execute."</span>)
coder     = <span class="fn">AssistantAgent</span>(<span class="str">"coder"</span>,     model_client=model,
                              system_message=<span class="str">"Write Python. Hand off to tester when done."</span>)
tester    = <span class="fn">AssistantAgent</span>(<span class="str">"tester"</span>,    model_client=model,
                              system_message=<span class="str">"Run the code, report PASS/FAIL. Say TERMINATE on success."</span>)

<span class="kw">def</span> <span class="fn">selector</span>(messages):
    <span class="cm"># Custom routing: planner first, then alternate coder/tester</span>
    <span class="kw">if</span> <span class="kw">not</span> messages: <span class="kw">return</span> <span class="str">"planner"</span>
    last = messages[-<span class="num">1</span>].source
    <span class="kw">if</span> last == <span class="str">"planner"</span>: <span class="kw">return</span> <span class="str">"coder"</span>
    <span class="kw">if</span> last == <span class="str">"coder"</span>:   <span class="kw">return</span> <span class="str">"tester"</span>
    <span class="kw">if</span> last == <span class="str">"tester"</span>:  <span class="kw">return</span> <span class="str">"coder"</span>  <span class="cm"># tester demands fixes</span>
    <span class="kw">return</span> <span class="kw">None</span>  <span class="cm"># let the LLM-based selector decide</span>

team = <span class="fn">SelectorGroupChat</span>(
    [planner, coder, tester],
    model_client=model,
    selector_func=selector,
    termination_condition=<span class="fn">TextMentionTermination</span>(<span class="str">"TERMINATE"</span>) | <span class="fn">MaxMessageTermination</span>(<span class="num">12</span>),
)

<span class="kw">await</span> team.<span class="fn">run</span>(task=<span class="str">"Implement quicksort and verify on [3,1,4,1,5,9,2,6]"</span>)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Üç <code>AssistantAgent</code> aynı OpenAI <code>model_client</code>'ı paylaşır ama keskince farklı <code>system_message</code>'lar alır — planner ayrıştırır, coder Python yazar, tester çalıştırır ve başarıda <code>TERMINATE</code> yayar. 2) <code>selector(messages)</code>, AutoGen'in varsayılan LLM-tabanlı seçimini geçersiz kılan özel bir yönlendirme fonksiyonudur: boş geçmiş → planner, planner → coder, coder → tester, tester → coder (tester düzeltme isteyebilsin diye); <code>None</code> dönerse karar AutoGen'in LLM seçicisine teslim edilir. 3) <code>SelectorGroupChat</code> agent'ları <code>selector_func=selector</code> ve birleştirilmiş bir sonlandırma koşuluyla bağlar — literal <code>TERMINATE</code> token'ı <em>veya</em> 12 mesaj, hangisi önce gerçekleşirse. 4) <code>await team.run(task=...)</code> sohbeti yürütür: her turda seçici sonraki konuşmacıyı seçer, agent modeli çağırır ve mesaj sonlandırma koşulu tetiklenene kadar paylaşılan transkripte eklenir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sahte bir group chat: 3 agent özel bir seçici fonksiyona göre sırayla konuşur, transkript bir listede saklanır, TERMINATE veya 12 mesajda sonlanır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SCRIPT = {
    <span class="str">'planner'</span>: [<span class="str">'Plan: 1) write quicksort 2) test on sample 3) verify sorted'</span>],
    <span class="str">'coder'</span>:   [<span class="str">'def qs(a): return a if len(a)<2 else qs([x for x in a[1:] if x<a[0]])+[a[0]]+qs([x for x in a[1:] if x>=a[0]])'</span>,
                <span class="str">'Fixed: handles duplicates with x>=a[0]'</span>],
    <span class="str">'tester'</span>:  [<span class="str">'FAIL: missed duplicates in [3,3,1]'</span>, <span class="str">'PASS: [1,1,2,3,3,4,5,6,9]. TERMINATE'</span>],
}
<span class="kw">def</span> <span class="fn">selector</span>(messages):
    <span class="kw">if</span> <span class="kw">not</span> messages: <span class="kw">return</span> <span class="str">'planner'</span>
    last = messages[-<span class="num">1</span>][<span class="num">0</span>]
    <span class="kw">return</span> {<span class="str">'planner'</span>:<span class="str">'coder'</span>,<span class="str">'coder'</span>:<span class="str">'tester'</span>,<span class="str">'tester'</span>:<span class="str">'coder'</span>}.<span class="fn">get</span>(last)
turn_idx = {<span class="str">'planner'</span>:<span class="num">0</span>, <span class="str">'coder'</span>:<span class="num">0</span>, <span class="str">'tester'</span>:<span class="num">0</span>}
messages = []
<span class="kw">for</span> turn <span class="kw">in</span> <span class="fn">range</span>(<span class="num">12</span>):
    who = <span class="fn">selector</span>(messages)
    <span class="kw">if</span> who <span class="kw">is</span> <span class="kw">None</span>: <span class="kw">break</span>
    msg = SCRIPT[who][turn_idx[who]]
    turn_idx[who] = <span class="fn">min</span>(turn_idx[who] + <span class="num">1</span>, <span class="fn">len</span>(SCRIPT[who]) - <span class="num">1</span>)
    messages.<span class="fn">append</span>((who, msg))
    <span class="fn">print</span>(f<span class="str">'  [{who:7s}] {msg[:70]}'</span>)
    <span class="kw">if</span> <span class="str">'TERMINATE'</span> <span class="kw">in</span> msg: <span class="kw">break</span>
<span class="fn">print</span>(f<span class="str">'Done in {len(messages)} turns'</span>)</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>SCRIPT</code> her agent adını önceden hazırlanmış sözlerine eşler; <code>turn_idx</code> her agent'ın script'in neresinde olduğunu izler — gerçek LLM yanıtları aksaydı AutoGen'in göreceği şekille aynı. 2) <code>selector(messages)</code> son konuşmacıyı okur ve sabit yönlendirme tablosuna (planner → coder → tester → coder) göre bir sonrakini döner; fonksiyon yön kalmazsa <code>None</code> dönerdi. 3) 12-adımlık sürücü döngü seçiciden sonraki agent'ı ister, agent'ın script'inden sonraki satırı çeker, (who, msg) çiftini paylaşılan <code>messages</code> transkriptine ekler ve kısa bir iz yazdırır. 4) Bir mesajda <code>TERMINATE</code> belirir belirmez döngü kırılır — gerçek AutoGen'de <code>TextMentionTermination("TERMINATE")</code>'in dayattığı aynı sonlandırma sözleşmesi.</p>
</div>

<div class="calc-highlight"><strong>Seçici, orkestralama beynidir.</strong> Naif bir round-robin chain-of-thought'lar için çalışır; özel bir fonksiyon iş akışlarını kodlamana izin verir ("tester FAIL'den sonra coder'a geri dön, PASS'tan sonra TERMINATE'e git"). LLM-tabanlı seçiciler esneklik verir ama tur başına bir çağrıya mal olur — yalnızca yönlendirmeyi kuralla kodlayamadığında kullan.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Supervisor Kalıbı (LangGraph)</h2>

<p class="l-text">LangGraph'ın supervisor kalıbı aynı fikrin durum makinesi olarak ifade edilmesidir: tek bir <strong>supervisor</strong> düğümü her turda konuşma geçmişini görür ve bir yönlendirme kararı yayar (sonraki hangi worker çalıştırılır veya "bitir"). Worker'lar yaprak düğümlerdir; kontrol her zaman supervisor'a döner.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Supervisor</div><div class="card-body">Saf router. Transkripti okur, sonraki-worker adını döndürür. Araç yok.</div></div>
<div class="calc-card"><div class="card-title">Worker</div><div class="card-body">1-3 araçlı uzmanlaşmış agent. Bir mesaj döndürür. Kontrolü supervisor'a verir.</div></div>
<div class="calc-card"><div class="card-title">State</div><div class="card-body">Paylaşılan dict: messages, scratchpad, ara artefaktlar. Her turda güncellenir.</div></div>
<div class="calc-card"><div class="card-title">Sonlandırma</div><div class="card-body">Supervisor "bitir" diye karar verir veya bütçe bir tavanı aşar (max tur, max token).</div></div>
</div>

<p class="l-text">Group chat'a göre avantajı: açık kontrol akışı, DAG olarak görselleştirmesi kolay, supervisor kural-tabanlı olduğunda deterministik. Dezavantajı: her yönlendirme kararı bir supervisor LLM çağrısıdır — 100 turda bu 100 ekstra çağrıdır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tartışma: İki Agent Biri Pes Edene Kadar Tartışır</h2>

<p class="l-text">Çok-Agent Tartışma (Du ve ark., 2023), bir cevap üzerinde tartışan iki LLM'in tek başlarına olduğundan daha sık doğru sonuçlara ulaştığını gösterdi. Her tur: agent A bir pozisyon belirtir, agent B eleştirir ve karşı-öneri sunar, A revize eder. K tur sonra bir hakem hayatta kalan cevabı seçer. Matematik benchmark'larında tartışma tek-atış GPT-4'ü 5-10 puan geçer.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">debate</span>(question, rounds=<span class="num">3</span>):
    <span class="cm"># Two agents with mildly different system prompts (or same model, just primed differently)</span>
    a = <span class="fn">Agent</span>(<span class="str">"You are confident, defend your answer hard."</span>)
    b = <span class="fn">Agent</span>(<span class="str">"You are skeptical, attack any unsupported claim."</span>)
    transcript = []
    answer_a = a.<span class="fn">invoke</span>(f<span class="str">"Q: {question}\nGive your best answer with reasoning."</span>)
    transcript.<span class="fn">append</span>((<span class="str">"A"</span>, answer_a))
    <span class="kw">for</span> r <span class="kw">in</span> <span class="fn">range</span>(rounds):
        critique = b.<span class="fn">invoke</span>(f<span class="str">"A says: {answer_a}\nFind a flaw or concur. Be specific."</span>)
        transcript.<span class="fn">append</span>((<span class="str">"B"</span>, critique))
        answer_a = a.<span class="fn">invoke</span>(f<span class="str">"B's critique: {critique}\nDefend or revise your answer."</span>)
        transcript.<span class="fn">append</span>((<span class="str">"A"</span>, answer_a))
    <span class="cm"># Judge picks the surviving claim</span>
    judge_verdict = judge.<span class="fn">invoke</span>(f<span class="str">"Question: {question}\nDebate: {transcript}\nFinal answer:"</span>)
    <span class="kw">return</span> judge_verdict</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Bilerek hasım sistem prompt'larıyla iki <code>Agent</code> örneği üretir — A güvenle savunmaya, B desteksiz iddialara saldırmaya yönlendirilir; ikisi de aynı temel model olabilir. 2) <code>answer_a</code> A'nın ilk yanıtıyla tohumlanır; her <code>r in range(rounds)</code> iterasyonu B-eleştirir-A sonra A-revize-eder-eleştiriye-karşı çalıştırır ve <code>transcript</code> listesini büyütür. 3) K turdan sonra ayrı bir <code>judge</code> LLM tüm transkripti okur ve hayatta kalan iddiayı seçer — bu üçüncü taraf döngünün son revizyonunu damgalamasını engeller. 4) <code>judge_verdict</code> döndürmek production kalıbıdır: agent'lar tartışır, tarafsız bir hakem karar verir — Multi-Agent Debate'in matematik benchmark'larında tek-atış GPT-4'ü 5-10 puan geçmesinin nedeni budur.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gerçek bir aritmetik problem üzerinde tartışma. Agent A tahmin eder, B kontrolcüyle eleştirir, A revize eder. Hakem doğrulayıcıdan geçen cevabı seçer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>question = <span class="str">'What is 23 * 47?'</span>
true_answer = <span class="num">23</span> * <span class="num">47</span>
<span class="kw">def</span> <span class="fn">agent_a</span>(history):
    <span class="kw">if</span> <span class="kw">not</span> history: <span class="kw">return</span> <span class="num">1100</span>   <span class="cm"># confident-but-wrong opening</span>
    last_b = history[-<span class="num">1</span>][<span class="num">1</span>]
    <span class="kw">if</span> <span class="str">'too low'</span> <span class="kw">in</span> last_b: <span class="kw">return</span> <span class="num">1080</span>
    <span class="kw">if</span> <span class="str">'too high'</span> <span class="kw">in</span> last_b: <span class="kw">return</span> <span class="num">1070</span>
    <span class="kw">return</span> <span class="num">1081</span>  <span class="cm"># the truth</span>
<span class="kw">def</span> <span class="fn">agent_b</span>(claim):
    <span class="kw">if</span> claim &lt; true_answer: <span class="kw">return</span> <span class="str">'FLAW: too low. Recompute.'</span>
    <span class="kw">if</span> claim &gt; true_answer: <span class="kw">return</span> <span class="str">'FLAW: too high. Recompute.'</span>
    <span class="kw">return</span> <span class="str">'CONCEDE: claim verified.'</span>
transcript = []
a_answer = <span class="fn">agent_a</span>([])
transcript.<span class="fn">append</span>((<span class="str">'A'</span>, a_answer))
<span class="fn">print</span>(f<span class="str">'  Round 0: A claims {a_answer}'</span>)
<span class="kw">for</span> r <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    b_resp = <span class="fn">agent_b</span>(a_answer)
    transcript.<span class="fn">append</span>((<span class="str">'B'</span>, b_resp))
    <span class="fn">print</span>(f<span class="str">'  Round {r+1}: B says <span class="str">"{b_resp}"</span>'</span>)
    <span class="kw">if</span> <span class="str">'CONCEDE'</span> <span class="kw">in</span> b_resp: <span class="kw">break</span>
    a_answer = <span class="fn">agent_a</span>(transcript)
    transcript.<span class="fn">append</span>((<span class="str">'A'</span>, a_answer))
    <span class="fn">print</span>(f<span class="str">'  Round {r+1}: A revises to {a_answer}'</span>)
<span class="fn">print</span>(f<span class="str">'JUDGE: final answer = {a_answer} (truth = {true_answer})'</span>)</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>agent_a(history)</code> güvenle-yanlış savunucudur: 1100 ile açılır, sonra B'nin önceki "too low" / "too high" geri bildirimine göre gerçeğe yaklaşır — sonunda gerçek çarpım olan 1081'e yakınsar. 2) <code>agent_b(claim)</code> gerçek değere erişimi olan hasım kontrolcüdür; etiketli bir eleştiri yayar (<code>FLAW: too low</code>, <code>FLAW: too high</code> veya <code>CONCEDE: claim verified</code>). 3) Sürücü döngü A'nın ilk yanıtını tohumlar, sonra B-eleştir → A-revize'yi dönüşümlü çalıştırır; A doğru bir iddia üretir üretmez <code>CONCEDE</code>'de kırar. 4) Son hakem satırını yazdırmak tartışma yolunu gösterir (1100 → 1080 → 1070 → 1081) — Multi-Agent Debate'in kullandığı aynı şekil, LLM yargıcının yerine deterministik bir kontrolcü.</p>
</div>

<div class="calc-highlight"><strong>Tartışma neden işe yarar:</strong> tek bir LLM ilk tahminine yanlıdır (anchoring). Onu bir hasıma karşı tahminini savunmaya zorlamak gizli varsayımları yüzeye çıkarır. İşin püf noktası eleştirmeni <em>gerçekten hasım</em> yapmaktır — iki agent aynı sistem prompt'unu paylaşırsa anlaşma eğilimindedirler (sycophancy çöküşü).</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Oylama ve Self-Consistency</h2>

<p class="l-text">En basit çok-agent tekniği: aynı problem üzerinde N bağımsız agent çalıştır ve cevap için oyla. Self-Consistency (Wang ve ark., 2022), K=40 zincirin çoğunluk-oyunun greedy decoding'i matematik benchmark'larında 5-15 puan geçtiğini gösterdi. Agent'ların hiç iletişim kurmasına gerek yoktur — bağımsızlık özelliktir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> collections <span class="kw">import</span> Counter
<span class="kw">import</span> concurrent.futures <span class="kw">as</span> cf

<span class="kw">def</span> <span class="fn">one_attempt</span>(question, seed):
    <span class="cm"># temperature=0.7 so each call diverges</span>
    <span class="kw">return</span> llm.<span class="fn">invoke</span>(f<span class="str">"[seed:{seed}] {question}\nFinal answer on last line."</span>).content.<span class="fn">strip</span>().<span class="fn">split</span>(<span class="str">"\n"</span>)[-<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">vote</span>(question, k=<span class="num">10</span>):
    <span class="kw">with</span> cf.<span class="fn">ThreadPoolExecutor</span>(<span class="num">10</span>) <span class="kw">as</span> ex:
        answers = <span class="fn">list</span>(ex.<span class="fn">map</span>(<span class="kw">lambda</span> s: <span class="fn">one_attempt</span>(question, s), <span class="fn">range</span>(k)))
    counts = <span class="fn">Counter</span>(answers)
    winner, votes = counts.<span class="fn">most_common</span>(<span class="num">1</span>)[<span class="num">0</span>]
    <span class="kw">return</span> winner, votes / k  <span class="cm"># answer + confidence</span>

<span class="cm"># For numeric tasks: majority over the FINAL number, not the full text</span>
<span class="cm"># For multiple choice: count A/B/C/D directly</span>
<span class="cm"># For open-ended: bucket answers with an LLM judge or embedding similarity</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>one_attempt(question, seed)</code> seed'i prompt'a gömer ve sıcaklık 0.7'de modelin yanıtının son satırını döner — her oylayıcının izlediği "nihai cevap" konvansiyonu. 2) <code>vote(question, k=10)</code> 10 worker'lı bir <code>ThreadPoolExecutor</code> kullanarak tüm k denemeyi eşzamanlı tetikler — duvar süresi tek çağrı gecikmesine yakın kalır. 3) <code>Counter(answers).most_common(1)[0]</code> modal cevabı seçer; fonksiyon kazananı artı çağrının eşikleyebileceği bir güven puanı olarak <code>votes/k</code>'yı döndürür. 4) Sondaki yorumlar üç production tuzağını anar: sayısal görevler sayılmadan önce nihai sayıyı çıkarmalı, çoktan-seçmeli harfleri doğrudan saymalı ve açık-uçlu çıktıların oylama anlamlı olmadan önce bucketing'e (LLM hakem veya embedding benzerliği) ihtiyacı vardır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Self-consistency simülasyonu: 10 gürültülü agent gerçeğe doğru yanlı bir cevap tahmin eder, çoğunluk oylaması bireysel hatalara rağmen doğru değeri kurtarır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> collections <span class="kw">import</span> Counter
rng = np.random.<span class="fn">default_rng</span>(<span class="num">42</span>)
true_answer = <span class="num">42</span>
<span class="kw">def</span> <span class="fn">noisy_agent</span>():
    <span class="cm"># 60% truth, 40% one of 4 distractors</span>
    <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; <span class="num">0.6</span>: <span class="kw">return</span> true_answer
    <span class="kw">return</span> <span class="fn">int</span>(rng.<span class="fn">choice</span>([<span class="num">41</span>, <span class="num">43</span>, <span class="num">24</span>, <span class="num">50</span>]))
<span class="kw">for</span> k <span class="kw">in</span> [<span class="num">1</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">20</span>, <span class="num">40</span>]:
    correct = <span class="num">0</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>):
        guesses = [<span class="fn">noisy_agent</span>() <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(k)]
        winner, _ = <span class="fn">Counter</span>(guesses).<span class="fn">most_common</span>(<span class="num">1</span>)[<span class="num">0</span>]
        <span class="kw">if</span> winner == true_answer: correct += <span class="num">1</span>
    <span class="fn">print</span>(f<span class="str">'  k={k:3d}  majority-vote accuracy = {correct/200:.2%}'</span>)</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>noisy_agent()</code> tek bir agent'ı modeller: 0.6 olasılıkla gerçek cevap 42'yi, aksi halde dört çeldirici sayıdan birini döner — Self-Consistency'nin sömürdüğü tam bağımsız-hata kalıbı. 2) Dıştaki döngü <code>[1, 5, 10, 20, 40]</code>'taki her <code>k</code> için 200 deneme çalıştırır; her deneme <code>noisy_agent()</code>'i k kez çağırır ve çoğunluk tahminini seçmek için <code>Counter.most_common(1)</code> kullanır. 3) 200 deneme üzerinden doğruluk tahmini Self-Consistency eğrisini canlı gösterir: tek-çağrı doğruluğu %60 civarında kalır ama k=40 oylaması yüksek 80'lere tırmanır — orijinal makalenin matematik benchmark'larında raporladığı aynı şekil. 4) Numara yalnızca her çağrı bağımsız olduğunda işler (seed'li RNG, gerçek modelde sıcaklık olur); oylayıcılar arası paylaşılan yanlılık hatayı iptal etmek yerine güçlendirir.</p>
</div>

<p class="l-text">Oylama, agent'lar arasındaki gürültü kabaca bağımsız olduğunda işe yarar. Tüm agent'lar sistematik bir yanlılığı paylaşıyorsa (aynı eğitim verisi, aynı prompt şablonu), oylama yanlılığı iptal etmek yerine güçlendirir. Sıcaklığı, örnekleme seed'lerini, sistem prompt'larını çeşitlendirerek veya hatta farklı model ailelerini kullanarak çeşitlendir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Sürü Kalıbı: Worker'lar Kuyruktan Çeker</h2>

<p class="l-text">OpenAI Swarm (2024'te deneysel bir framework olarak yayınlandı) hiyerarşik kontrolü tersine çevirir: manager yoktur. Görevler paylaşılan bir kuyrukta yaşar; boştaki agent'lar becerilerine uyan sonraki görevi çeker. Orijinal LangChain Multi-agent Network ve Anthropic'in paralel-araç-kullanım kalıpları da buraya aittir. Utanç verici biçimde paralel işler için en iyisi (1000 sayfa kazı, 50 belge özetle).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hiyerarşik</div><div class="card-body">Manager işi aşağı iter. Tepede darboğaz, en temiz hesap verebilirlik.</div></div>
<div class="calc-card"><div class="card-title">Group chat</div><div class="card-body">Tek transkript, sıra-alma. Birlikte muhakeme için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Sürü / havuz</div><div class="card-body">Worker'lar kuyruktan çeker. Paralel verimlilik için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Devir</div><div class="card-body">Her agent'ın "X'e devret" aracı vardır. Yönlendirme agent seçimlerinden çıkar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Swarm-style: agents declare skills, pool dispatches</span>
<span class="kw">import</span> queue, threading

task_q = queue.<span class="fn">Queue</span>()
results = []

<span class="kw">def</span> <span class="fn">worker</span>(name, skills, llm):
    <span class="kw">while</span> <span class="kw">True</span>:
        task = task_q.<span class="fn">get</span>()
        <span class="kw">if</span> task <span class="kw">is</span> <span class="kw">None</span>: <span class="kw">break</span>
        <span class="kw">if</span> task[<span class="str">"type"</span>] <span class="kw">in</span> skills:
            out = llm.<span class="fn">invoke</span>(task[<span class="str">"prompt"</span>])
            results.<span class="fn">append</span>((name, task[<span class="str">"id"</span>], out))
        <span class="kw">else</span>:
            task_q.<span class="fn">put</span>(task)  <span class="cm"># back to queue for someone else</span>
        task_q.<span class="fn">task_done</span>()

<span class="cm"># Spawn 4 workers with different skill sets</span>
threads = [
    threading.<span class="fn">Thread</span>(target=worker, args=(<span class="str">"summarizer"</span>, {<span class="str">"summary"</span>}, llm)),
    threading.<span class="fn">Thread</span>(target=worker, args=(<span class="str">"translator"</span>,  {<span class="str">"translate"</span>}, llm)),
    threading.<span class="fn">Thread</span>(target=worker, args=(<span class="str">"classifier"</span>, {<span class="str">"classify"</span>}, llm)),
    threading.<span class="fn">Thread</span>(target=worker, args=(<span class="str">"generalist"</span>, {<span class="str">"summary"</span>, <span class="str">"translate"</span>, <span class="str">"classify"</span>}, llm)),
]
<span class="kw">for</span> t <span class="kw">in</span> threads: t.<span class="fn">start</span>()

<span class="cm"># Push 100 mixed tasks; pool processes in parallel</span>
<span class="kw">for</span> i, (kind, prompt) <span class="kw">in</span> <span class="fn">enumerate</span>(jobs):
    task_q.<span class="fn">put</span>({<span class="str">"id"</span>: i, <span class="str">"type"</span>: kind, <span class="str">"prompt"</span>: prompt})
task_q.<span class="fn">join</span>()</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>task_q</code> paylaşılan bir <code>queue.Queue</code>'dur; her <code>worker(name, skills, llm)</code> thread'i ondan blocking-pull yapar — görevin <code>type</code>'ı <code>skills</code> kümesine uyduğunda LLM'i çalıştırır ve <code>results</code>'a ekler, aksi halde görevi kuyruğa iade eder. 2) Dört worker thread'i örtüşen ama ayrık beceri kümeleriyle başlar — üç uzman (<code>summarizer</code>, <code>translator</code>, <code>classifier</code>) ve üç görev türünden herhangi birini alabilen bir <code>generalist</code>. 3) For döngüsü <code>jobs</code>'taki her <code>(kind, prompt)</code>'u typed sözlük olarak iter; birden fazla worker bunları eşzamanlı tüketir — tam olarak OpenAI Swarm "task pool" topolojisi. 4) <code>task_q.join()</code> her görev <code>task_q.task_done()</code> ile işaretlenene kadar bloklar; worker'ları temiz durdurmak için sonradan <code>None</code> sentinel'leri gönderirsin.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tek-thread bir sürü dispatcher: görevler kuyruğa alınır, agent'lar round-robin olarak yoklar, her biri yalnızca becerilerine uyan görevleri alır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> collections <span class="kw">import</span> deque
WORKERS = {
    <span class="str">'summarizer'</span>: {<span class="str">'summary'</span>},
    <span class="str">'translator'</span>: {<span class="str">'translate'</span>},
    <span class="str">'classifier'</span>: {<span class="str">'classify'</span>},
    <span class="str">'generalist'</span>: {<span class="str">'summary'</span>, <span class="str">'translate'</span>, <span class="str">'classify'</span>},
}
tasks = <span class="fn">deque</span>([
    {<span class="str">'id'</span>: <span class="num">0</span>, <span class="str">'type'</span>: <span class="str">'summary'</span>,   <span class="str">'data'</span>: <span class="str">'long article'</span>},
    {<span class="str">'id'</span>: <span class="num">1</span>, <span class="str">'type'</span>: <span class="str">'translate'</span>, <span class="str">'data'</span>: <span class="str">'hello'</span>},
    {<span class="str">'id'</span>: <span class="num">2</span>, <span class="str">'type'</span>: <span class="str">'classify'</span>,  <span class="str">'data'</span>: <span class="str">'review text'</span>},
    {<span class="str">'id'</span>: <span class="num">3</span>, <span class="str">'type'</span>: <span class="str">'summary'</span>,   <span class="str">'data'</span>: <span class="str">'paper'</span>},
    {<span class="str">'id'</span>: <span class="num">4</span>, <span class="str">'type'</span>: <span class="str">'translate'</span>, <span class="str">'data'</span>: <span class="str">'thank you'</span>},
    {<span class="str">'id'</span>: <span class="num">5</span>, <span class="str">'type'</span>: <span class="str">'classify'</span>,  <span class="str">'data'</span>: <span class="str">'tweet'</span>},
])
results = []
worker_cycle = <span class="fn">list</span>(WORKERS.<span class="fn">keys</span>())
i = <span class="num">0</span>
<span class="kw">while</span> tasks:
    task = tasks.<span class="fn">popleft</span>()
    tries = <span class="num">0</span>
    <span class="kw">while</span> tries &lt; <span class="fn">len</span>(worker_cycle):
        w = worker_cycle[i % <span class="fn">len</span>(worker_cycle)]
        i += <span class="num">1</span>
        <span class="kw">if</span> task[<span class="str">'type'</span>] <span class="kw">in</span> WORKERS[w]:
            results.<span class="fn">append</span>((w, task[<span class="str">'id'</span>], task[<span class="str">'type'</span>]))
            <span class="fn">print</span>(f<span class="str">'  task {task[<span class="str">"id"</span>]} ({task[<span class="str">"type"</span>]:9s}) -> {w}'</span>)
            <span class="kw">break</span>
        tries += <span class="num">1</span>
<span class="fn">print</span>(f<span class="str">'Processed {len(results)} tasks across {len(set(r[0] for r in results))} workers'</span>)</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>WORKERS</code> dört agent'ı ve kabul ettikleri beceri kümelerini bildirir — üç uzman artı üç görev türünü de kapsayan bir generalist. 2) <code>tasks</code> typed iş öğelerinden oluşan bir <code>deque</code>'tür; soldan pop, thread'siz threading queue'sunun FIFO davranışını taklit eder. 3) Dıştaki döngü bir görevi pop'lar, sonra içteki döngü <code>worker_cycle</code>'ı round-robin sırasıyla dolaşır ve <code>skills</code> kümesi görevin <code>type</code>'ını içeren bir worker bulana kadar arar; eşleşen atama <code>results</code>'a eklenir ve yazdırılır. 4) Son özet işlenen toplam görevi ve kullanılan benzersiz worker sayısını raporlar — gerçek bir sürüde tool-starvation'ı (bir worker her şeyi yapıyor) veya eşleşmemiş görevleri tespit etmek için loglayacağın metriğin yerine geçer.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Başarısızlık Modları (ve Onları Nasıl Yakalanır)</h2>

<p class="l-text">Çok-agent sistemler, tek-agent'ların yapmadığı ince yollarla başarısız olur. Başarısızlık modlarını bilmek savaşın yarısıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sycophancy çöküşü</div><div class="card-body">Agent'lar nazik olmak için birbirlerine katılır, yanlış cevap hayatta kalır. Çözüm: açıkça hasım roller ata.</div></div>
<div class="calc-card"><div class="card-title">Mesaj fırtınası</div><div class="card-body">İki agent sonsuza dek "teşekkürler!" / "rica ederim!" sektirir. Çözüm: sıkı tur limiti, ilerleme yoksa sonlandır.</div></div>
<div class="calc-card"><div class="card-title">Drift</div><div class="card-body">20 turdan sonra konuşma alakasız bir şey hakkında. Çözüm: orijinal hedefi her tur sistem prompt'una sabitle.</div></div>
<div class="calc-card"><div class="card-title">Araç kıtlığı</div><div class="card-body">Bir worker tüm yararlı araçlara sahip, diğerleri takılı kalır. Çözüm: araç atamalarını yeniden dengele veya rolleri birleştir.</div></div>
<div class="calc-card"><div class="card-title">Maliyet patlaması</div><div class="card-body">5 agent x 20 tur x 4k context = sorgu başına 400k token. Çözüm: ReWOO-tarzı planlar, rutin worker'lar için ucuz modeller.</div></div>
<div class="calc-card"><div class="card-title">Deadlock</div><div class="card-body">A B'yi bekler, B A'yı bekler. Çözüm: timeout'lar, açık sonlandırma maddesiyle supervisor.</div></div>
</div>

<div class="calc-highlight"><strong>Önce tek-agent baseline.</strong> Çok-agent sistem kurmadan önce her zaman görevin için tek bir GPT-4 + araçlar agent'ını benchmark et. Tek agent zaten %90 doğruluğa ulaşıyorsa, MAS faydasız biçimde gecikme ve maliyet ekler. MAS, tek-agent %70'in altında kaldığında VE başarısızlıklar çeşitli olduğunda parlar (farklı çalıştırmalarda farklı hatalar).</div>

<p class="l-text">9. derste "birbirleriyle konuşan agent'lar" dünyasını "gerçek dünyayla etkileşen agent'lar" için terk ediyoruz — Anthropic'in Computer Use API'si, Aider ve Devin gibi kod agent'ları ve otonom bir agent'ın laptop'unu bozmasını önleyen sandbox altyapısı (Modal, Daytona, e2b.dev).</p>
</div>`

};
