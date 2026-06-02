window.AGENTS_L5 = {
en: `<p class="l-text"><strong>You have built an agent loop by hand. Now meet the frameworks that turn it into a production system.</strong> LangChain provides the high-level <code>create_react_agent</code> + <code>AgentExecutor</code> abstractions for one-shot tool-calling agents with memory. LangGraph — the graph-native sibling — lets you draw the agent as a state machine: nodes are functions, edges are transitions, and the state is a typed dict that flows through the graph. Together they cover the spectrum from "wire up a chatbot in 20 lines" to "supervisor + worker swarm with checkpointed long-running workflows."</p>

<p class="l-text">This lesson is the bridge between hand-rolled and framework. We will build the same agent three ways: (1) a manual ReAct loop you can already write, (2) LangChain <code>create_react_agent</code> in 5 lines, and (3) a LangGraph state machine with conditional routing and persistence. By the end you will know <em>when</em> to use each — and why LangGraph is what production teams reach for once "linear chain" is no longer enough.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>LangChain LCEL: <code>create_react_agent</code>, <code>AgentExecutor</code>, memory wiring</li>
<li>LangGraph fundamentals: <code>StateGraph</code>, nodes, edges, conditional routing</li>
<li>State design: typed dicts, reducers, message accumulation</li>
<li>Persistence &amp; checkpointing: SQLite/Postgres, time-travel debugging</li>
<li>Multi-step workflows: planner → worker → reviewer with cycles</li>
<li>When to use LangChain vs LangGraph vs DIY</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Three Layers</h2>
<p class="l-text">Picture a stack. At the bottom: an LLM client (Anthropic, OpenAI). In the middle: a loop that interleaves model calls with tool calls. At the top: a state machine that orchestrates multiple loops with branching, memory, and recovery. Each layer is what someone rebuilds badly when they skip the layer below.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Layer 1 — DIY (L2-L4)</div><div class="card-body">while-loop, tool dispatch dict, scratchpad list. Best for learning, quick prototypes, and tools that do not need framework integration.</div></div>
<div class="calc-card"><div class="card-title">Layer 2 — LangChain</div><div class="card-body"><code>create_react_agent</code> wraps the loop. Adds: memory classes, output parsers, tool registry, ~80 integrations. Linear chains, single agent.</div></div>
<div class="calc-card"><div class="card-title">Layer 3 — LangGraph</div><div class="card-body">Explicit state machine. Cycles, branches, parallel nodes, checkpointing, human-in-loop. The framework that powers production multi-agent systems.</div></div>
</div>

<div class="calc-highlight">Rule of thumb: <strong>start at L1</strong> for any agent under 200 LOC, <strong>jump to L3 (LangGraph) directly</strong> for anything with branching, parallel work, or multi-step workflows. L2 is best for the narrow case "I want a single ReAct agent with chat memory and 5 tools" — many teams now skip it.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. LangChain create_react_agent</h2>
<p class="l-text">LangChain 0.1+ uses LCEL (LangChain Expression Language) — chains compose with the <code>|</code> operator. <code>create_react_agent</code> returns a <code>Runnable</code> that takes <code>{input, chat_history, intermediate_steps}</code> and emits the next action. Wrap it in <code>AgentExecutor</code> to run the loop.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LangChain ReAct agent — minimal working example</span>
<span class="kw">from</span> langchain_anthropic <span class="kw">import</span> ChatAnthropic
<span class="kw">from</span> langchain.agents <span class="kw">import</span> create_react_agent, AgentExecutor
<span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> PromptTemplate

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">get_weather</span>(city: <span class="fn">str</span>) -&gt; <span class="fn">str</span>:
    <span class="str">"""Get current weather for a city."""</span>
    <span class="kw">return</span> f<span class="str">"Weather in {city}: 22C, sunny"</span>

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">calculate</span>(expression: <span class="fn">str</span>) -&gt; <span class="fn">str</span>:
    <span class="str">"""Evaluate a math expression like '2*3+1'."""</span>
    <span class="kw">return</span> <span class="fn">str</span>(<span class="fn">eval</span>(expression, {<span class="str">"__builtins__"</span>: {}}))

llm = <span class="fn">ChatAnthropic</span>(model=<span class="str">"claude-sonnet-4-6"</span>, temperature=<span class="num">0</span>)
tools = [get_weather, calculate]

prompt = PromptTemplate.<span class="fn">from_template</span>(<span class="str">"""Answer the question using tools.

Tools: {tools}
Tool names: {tool_names}

Use this format:
Question: ...
Thought: ...
Action: tool_name
Action Input: tool_input
Observation: tool_result
... (repeat) ...
Thought: I now know the final answer.
Final Answer: ...

Question: {input}
{agent_scratchpad}"""</span>)

agent = <span class="fn">create_react_agent</span>(llm, tools, prompt)
executor = <span class="fn">AgentExecutor</span>(agent=agent, tools=tools, max_iterations=<span class="num">5</span>, verbose=<span class="kw">True</span>)
result = executor.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"What is the weather in Paris times 3?"</span>})
<span class="fn">print</span>(result[<span class="str">"output"</span>])
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Decorates two plain Python functions with <code>@tool</code> so LangChain reads each docstring and type hint to build a JSON schema automatically — no manual schema file required. 2) Builds a <code>PromptTemplate</code> that hard-codes the ReAct text format (Thought / Action / Action Input / Observation / Final Answer) plus the LangChain-required placeholders <code>{tools}</code>, <code>{tool_names}</code>, <code>{input}</code> and <code>{agent_scratchpad}</code>. 3) <code>create_react_agent(llm, tools, prompt)</code> returns a Runnable that emits the next action; wrapping it in <code>AgentExecutor(..., max_iterations=5, verbose=True)</code> turns it into a runnable loop with a hard step cap and per-step logging. 4) <code>executor.invoke({"input": "..."})</code> drives the loop until the model emits <code>Final Answer:</code> and returns a dict containing the final <code>output</code> plus the full <code>intermediate_steps</code> trail.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A manual ReAct loop with a scripted "LLM" that stands in for Claude — same architecture, no API key.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Manual ReAct — what create_react_agent does internally</span>
<span class="kw">import</span> re

TOOLS = {
    <span class="str">"get_weather"</span>: <span class="kw">lambda</span> city: f<span class="str">"Weather in {city}: 22C, sunny"</span>,
    <span class="str">"calculate"</span>:   <span class="kw">lambda</span> expr: <span class="fn">str</span>(<span class="fn">eval</span>(expr, {<span class="str">"__builtins__"</span>: {}})),
}

<span class="cm"># scripted "LLM" — in reality this is a Claude call</span>
SCRIPT = [
    <span class="str">"Thought: I need the weather first.\\nAction: get_weather\\nAction Input: Paris"</span>,
    <span class="str">"Thought: Now multiply the temperature by 3.\\nAction: calculate\\nAction Input: 22*3"</span>,
    <span class="str">"Thought: Done.\\nFinal Answer: 22C times 3 = 66."</span>,
]

<span class="kw">def</span> <span class="fn">react_loop</span>(question, max_iter=<span class="num">5</span>):
    scratch, step = [f<span class="str">"Question: {question}"</span>], <span class="num">0</span>
    <span class="kw">while</span> step &lt; max_iter:
        out = SCRIPT[step]
        scratch.<span class="fn">append</span>(out)
        <span class="kw">if</span> <span class="str">"Final Answer:"</span> <span class="kw">in</span> out:
            <span class="kw">return</span> out.<span class="fn">split</span>(<span class="str">"Final Answer:"</span>)[-<span class="num">1</span>].<span class="fn">strip</span>()
        m = re.<span class="fn">search</span>(r<span class="str">"Action:\\s*(\\S+)\\s*\\nAction Input:\\s*(.+)"</span>, out)
        <span class="kw">if</span> <span class="kw">not</span> m: <span class="kw">break</span>
        tool, arg = m.<span class="fn">group</span>(<span class="num">1</span>), m.<span class="fn">group</span>(<span class="num">2</span>).<span class="fn">strip</span>()
        obs = TOOLS[tool](arg)
        scratch.<span class="fn">append</span>(f<span class="str">"Observation: {obs}"</span>)
        step += <span class="num">1</span>
    <span class="kw">return</span> <span class="str">"no answer"</span>

<span class="fn">print</span>(<span class="fn">react_loop</span>(<span class="str">"What is Paris weather times 3?"</span>))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>TOOLS</code> is a small dict mapping tool names to lambdas — exactly what <code>create_react_agent</code> stores internally when you call <code>@tool</code> on a function. 2) <code>SCRIPT</code> is a hand-written list of three model outputs that mimic a real Claude trajectory: first call <code>get_weather[Paris]</code>, then <code>calculate[22*3]</code>, then emit <code>Final Answer:</code>. 3) <code>react_loop</code> walks the script step-by-step, regex-parses each <code>Action: name</code> + <code>Action Input: arg</code> pair, runs the matching tool, and appends an <code>Observation:</code> line to the scratchpad — identical to the parsing inside LangChain. 4) The loop terminates either when the model outputs <code>Final Answer:</code> or when <code>max_iter</code> is hit — the only thing missing from a production agent is replacing <code>SCRIPT[step]</code> with a real <code>llm.invoke(scratch)</code> call.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. AgentExecutor with Memory</h2>
<p class="l-text"><code>AgentExecutor</code> is stateless across <code>.invoke()</code> calls. To get a chat experience, wrap it in <code>RunnableWithMessageHistory</code> and supply a session-keyed message store.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Add chat memory to an AgentExecutor</span>
<span class="kw">from</span> langchain_core.runnables.history <span class="kw">import</span> RunnableWithMessageHistory
<span class="kw">from</span> langchain_community.chat_message_histories <span class="kw">import</span> ChatMessageHistory

_SESSIONS = {}
<span class="kw">def</span> <span class="fn">get_session</span>(sid: <span class="fn">str</span>):
    <span class="kw">if</span> sid <span class="kw">not</span> <span class="kw">in</span> _SESSIONS:
        _SESSIONS[sid] = <span class="fn">ChatMessageHistory</span>()
    <span class="kw">return</span> _SESSIONS[sid]

agent_with_memory = <span class="fn">RunnableWithMessageHistory</span>(
    executor,                        <span class="cm"># from previous snippet</span>
    get_session,
    input_messages_key=<span class="str">"input"</span>,
    history_messages_key=<span class="str">"chat_history"</span>,
)

cfg = {<span class="str">"configurable"</span>: {<span class="str">"session_id"</span>: <span class="str">"user_42"</span>}}
agent_with_memory.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"I live in Berlin."</span>}, cfg)
agent_with_memory.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"What is the weather where I live?"</span>}, cfg)
<span class="cm"># Second call sees "Berlin" via chat_history, calls get_weather('Berlin').</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a global <code>_SESSIONS</code> dict and a <code>get_session(sid)</code> lookup that lazily creates a <code>ChatMessageHistory</code> per session id — the per-user storage every chatbot needs. 2) Wraps the existing <code>executor</code> in <code>RunnableWithMessageHistory(...)</code>, telling it which input key carries the user message (<code>input_messages_key</code>) and which key the chain consumes the history under (<code>history_messages_key</code>). 3) The <code>cfg</code> dict passes a <code>session_id</code> via <code>configurable</code>; LangChain looks up the matching history on every call and injects it into the prompt under <code>chat_history</code>. 4) The first <code>invoke</code> stores "I live in Berlin." in the session; the second call only says "where I live" — the wrapper reinjects the prior turn, so the agent now sees "Berlin" in context and routes <code>get_weather('Berlin')</code>.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Per-session memory store implemented as a dict — same shape as LangChain's ChatMessageHistory.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> collections <span class="kw">import</span> defaultdict

_SESSIONS = <span class="fn">defaultdict</span>(<span class="fn">list</span>)

<span class="kw">def</span> <span class="fn">chat</span>(session_id, user_msg, fake_response_fn):
    history = _SESSIONS[session_id]
    <span class="cm"># build prompt = history + new turn</span>
    prompt_lines = [f<span class="str">"{m['role']}: {m['content']}"</span> <span class="kw">for</span> m <span class="kw">in</span> history]
    prompt_lines.<span class="fn">append</span>(f<span class="str">"user: {user_msg}"</span>)
    response = <span class="fn">fake_response_fn</span>(prompt_lines)
    history.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: user_msg})
    history.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"assistant"</span>, <span class="str">"content"</span>: response})
    <span class="kw">return</span> response

<span class="cm"># scripted responder that uses prior turns</span>
<span class="kw">def</span> <span class="fn">fake</span>(history_lines):
    joined = <span class="str">" | "</span>.<span class="fn">join</span>(history_lines)
    <span class="kw">if</span> <span class="str">"Berlin"</span> <span class="kw">in</span> joined <span class="kw">and</span> <span class="str">"weather"</span> <span class="kw">in</span> history_lines[-<span class="num">1</span>].<span class="fn">lower</span>():
        <span class="kw">return</span> <span class="str">"Calling get_weather('Berlin') -&gt; 18C, cloudy"</span>
    <span class="kw">if</span> <span class="str">"live"</span> <span class="kw">in</span> history_lines[-<span class="num">1</span>]:
        <span class="kw">return</span> <span class="str">"Got it — you live in Berlin."</span>
    <span class="kw">return</span> <span class="str">"..."</span>

<span class="fn">print</span>(<span class="fn">chat</span>(<span class="str">"user_42"</span>, <span class="str">"I live in Berlin."</span>, fake))
<span class="fn">print</span>(<span class="fn">chat</span>(<span class="str">"user_42"</span>, <span class="str">"What is the weather where I live?"</span>, fake))
<span class="fn">print</span>(<span class="str">"History length:"</span>, <span class="fn">len</span>(_SESSIONS[<span class="str">"user_42"</span>]))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Replaces LangChain's <code>ChatMessageHistory</code> with a <code>defaultdict(list)</code> — same shape, just a per-session list of <code>{role, content}</code> dicts. 2) <code>chat(session_id, user_msg, fake_response_fn)</code> builds the prompt from the existing history plus the new user line, hands it to the responder, and appends both the user message and assistant reply back to the session. 3) <code>fake(history_lines)</code> stands in for the LLM: it inspects the joined history and emits a Berlin-aware response only when it sees "Berlin" in past turns and "weather" in the latest one — the same context-sensitivity a real chat model provides. 4) The two demo calls prove the memory contract — the first stores the city, the second references "where I live" and still gets routed to Berlin because the history is replayed into the prompt.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LangGraph — Why Graphs?</h2>
<p class="l-text">LangChain's <code>AgentExecutor</code> is a <em>linear loop</em>: model → tool → model → tool → answer. Real workflows branch: "if the search returned nothing, ask a clarifying question; otherwise summarize." They cycle: "critique → revise → critique → revise". They parallelize: "fan out to 3 retrievers, then merge."</p>

<p class="l-text">LangGraph models all of this as a <strong>directed graph</strong> with typed state. Nodes are pure functions <code>state -&gt; partial_state</code>. Edges describe transitions, optionally conditional. The runtime advances state through the graph until you hit <code>END</code>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">StateGraph</div><div class="card-body">The graph itself. Constructed with a state schema (typed dict). You add nodes and edges, then <code>compile()</code>.</div></div>
<div class="calc-card"><div class="card-title">Node</div><div class="card-body">A function. Receives current state, returns a partial dict that gets merged in. Can be a chain, an LLM call, a tool, or pure Python.</div></div>
<div class="calc-card"><div class="card-title">Edge</div><div class="card-body">Static (always go from A to B) or conditional (call a router function that returns the next node name).</div></div>
<div class="calc-card"><div class="card-title">Reducer</div><div class="card-body">How to merge a node's output into state. <code>operator.add</code> appends to lists; default is overwrite.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A LangGraph Agent — Hello World</h2>
<p class="l-text">The canonical pattern: an <code>agent</code> node that calls the LLM, a <code>tools</code> node that executes any tool calls, and a conditional edge from <code>agent</code> that routes either back to <code>tools</code> or out to <code>END</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LangGraph ReAct agent — explicit state machine</span>
<span class="kw">from</span> typing <span class="kw">import</span> Annotated, TypedDict
<span class="kw">from</span> operator <span class="kw">import</span> add
<span class="kw">from</span> langgraph.graph <span class="kw">import</span> StateGraph, END
<span class="kw">from</span> langgraph.prebuilt <span class="kw">import</span> ToolNode
<span class="kw">from</span> langchain_anthropic <span class="kw">import</span> ChatAnthropic
<span class="kw">from</span> langchain_core.messages <span class="kw">import</span> HumanMessage, BaseMessage
<span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">get_weather</span>(city: <span class="fn">str</span>) -&gt; <span class="fn">str</span>:
    <span class="str">"""Current weather."""</span>
    <span class="kw">return</span> f<span class="str">"Weather in {city}: 22C, sunny"</span>

<span class="kw">class</span> <span class="fn">State</span>(TypedDict):
    messages: Annotated[<span class="fn">list</span>[BaseMessage], add]   <span class="cm"># reducer = append</span>

llm = <span class="fn">ChatAnthropic</span>(model=<span class="str">"claude-sonnet-4-6"</span>).<span class="fn">bind_tools</span>([get_weather])

<span class="kw">def</span> <span class="fn">call_model</span>(state: State):
    <span class="kw">return</span> {<span class="str">"messages"</span>: [llm.<span class="fn">invoke</span>(state[<span class="str">"messages"</span>])]}

<span class="kw">def</span> <span class="fn">should_continue</span>(state: State) -&gt; <span class="fn">str</span>:
    last = state[<span class="str">"messages"</span>][-<span class="num">1</span>]
    <span class="kw">return</span> <span class="str">"tools"</span> <span class="kw">if</span> last.tool_calls <span class="kw">else</span> END

graph = <span class="fn">StateGraph</span>(State)
graph.<span class="fn">add_node</span>(<span class="str">"agent"</span>, call_model)
graph.<span class="fn">add_node</span>(<span class="str">"tools"</span>, <span class="fn">ToolNode</span>([get_weather]))
graph.<span class="fn">set_entry_point</span>(<span class="str">"agent"</span>)
graph.<span class="fn">add_conditional_edges</span>(<span class="str">"agent"</span>, should_continue, {<span class="str">"tools"</span>: <span class="str">"tools"</span>, END: END})
graph.<span class="fn">add_edge</span>(<span class="str">"tools"</span>, <span class="str">"agent"</span>)    <span class="cm"># after tool, back to model</span>
app = graph.<span class="fn">compile</span>()

out = app.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [<span class="fn">HumanMessage</span>(content=<span class="str">"weather in Paris?"</span>)]})
<span class="fn">print</span>(out[<span class="str">"messages"</span>][-<span class="num">1</span>].content)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Declares <code>State(TypedDict)</code> with one field — <code>messages: Annotated[list, add]</code> — where <code>add</code> is the reducer that <em>appends</em> rather than overwrites when nodes return updates. 2) <code>call_model(state)</code> invokes a tool-bound Claude on the running message list and returns <code>{"messages": [new_msg]}</code>; the reducer concatenates it onto state. 3) <code>should_continue</code> is the router — it inspects <code>state["messages"][-1].tool_calls</code> and returns either <code>"tools"</code> or the special <code>END</code> sentinel; <code>add_conditional_edges</code> wires this branch. 4) The graph is: <code>START → agent → (tools → agent loop)* → END</code> — <code>graph.compile()</code> turns the description into a Runnable you can <code>invoke</code> with an initial messages list.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A LangGraph clone in 40 lines — node functions, conditional edges, dict-based state. Run it and trace the path through the graph.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>END = <span class="str">"__END__"</span>

<span class="kw">class</span> StateGraph:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.nodes, <span class="kw">self</span>.edges, <span class="kw">self</span>.cond = {}, {}, {}
        <span class="kw">self</span>.entry = <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">add_node</span>(<span class="kw">self</span>, name, fn): <span class="kw">self</span>.nodes[name] = fn
    <span class="kw">def</span> <span class="fn">add_edge</span>(<span class="kw">self</span>, src, dst): <span class="kw">self</span>.edges[src] = dst
    <span class="kw">def</span> <span class="fn">add_conditional_edges</span>(<span class="kw">self</span>, src, router, mapping):
        <span class="kw">self</span>.cond[src] = (router, mapping)
    <span class="kw">def</span> <span class="fn">set_entry_point</span>(<span class="kw">self</span>, name): <span class="kw">self</span>.entry = name
    <span class="kw">def</span> <span class="fn">invoke</span>(<span class="kw">self</span>, state, max_steps=<span class="num">10</span>, trace=<span class="kw">None</span>):
        node = <span class="kw">self</span>.entry
        trace = trace <span class="kw">if</span> trace <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span> <span class="kw">else</span> []
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(max_steps):
            trace.<span class="fn">append</span>(node)
            patch = <span class="kw">self</span>.nodes[node](state)
            <span class="kw">for</span> k, v <span class="kw">in</span> patch.<span class="fn">items</span>():
                state[k] = state.<span class="fn">get</span>(k, []) + v <span class="kw">if</span> <span class="fn">isinstance</span>(v, <span class="fn">list</span>) <span class="kw">else</span> v
            <span class="kw">if</span> node <span class="kw">in</span> <span class="kw">self</span>.cond:
                router, m = <span class="kw">self</span>.cond[node]
                nxt = m[<span class="fn">router</span>(state)]
            <span class="kw">else</span>:
                nxt = <span class="kw">self</span>.edges.<span class="fn">get</span>(node, END)
            <span class="kw">if</span> nxt == END: trace.<span class="fn">append</span>(<span class="str">"END"</span>); <span class="kw">return</span> state, trace
            node = nxt
        <span class="kw">return</span> state, trace

<span class="cm"># nodes</span>
<span class="kw">def</span> <span class="fn">call_model</span>(state):
    msgs = state[<span class="str">"messages"</span>]
    last_user = <span class="fn">next</span>((m <span class="kw">for</span> m <span class="kw">in</span> <span class="fn">reversed</span>(msgs) <span class="kw">if</span> m[<span class="str">"role"</span>]==<span class="str">"user"</span>), {<span class="str">"content"</span>:<span class="str">""</span>})
    <span class="kw">if</span> <span class="fn">any</span>(m.<span class="fn">get</span>(<span class="str">"role"</span>)==<span class="str">"tool"</span> <span class="kw">for</span> m <span class="kw">in</span> msgs):
        <span class="kw">return</span> {<span class="str">"messages"</span>: [{<span class="str">"role"</span>:<span class="str">"assistant"</span>,<span class="str">"content"</span>:<span class="str">"It is 22C and sunny in Paris."</span>}]}
    <span class="kw">return</span> {<span class="str">"messages"</span>: [{<span class="str">"role"</span>:<span class="str">"assistant"</span>,<span class="str">"tool_call"</span>:{<span class="str">"name"</span>:<span class="str">"get_weather"</span>,<span class="str">"args"</span>:{<span class="str">"city"</span>:<span class="str">"Paris"</span>}}}]}

<span class="kw">def</span> <span class="fn">call_tool</span>(state):
    call = state[<span class="str">"messages"</span>][-<span class="num">1</span>][<span class="str">"tool_call"</span>]
    result = f<span class="str">"Weather in {call['args']['city']}: 22C, sunny"</span>
    <span class="kw">return</span> {<span class="str">"messages"</span>: [{<span class="str">"role"</span>:<span class="str">"tool"</span>,<span class="str">"content"</span>:result}]}

<span class="kw">def</span> <span class="fn">router</span>(state):
    <span class="kw">return</span> <span class="str">"tools"</span> <span class="kw">if</span> <span class="str">"tool_call"</span> <span class="kw">in</span> state[<span class="str">"messages"</span>][-<span class="num">1</span>] <span class="kw">else</span> END

g = <span class="fn">StateGraph</span>()
g.<span class="fn">add_node</span>(<span class="str">"agent"</span>, call_model)
g.<span class="fn">add_node</span>(<span class="str">"tools"</span>, call_tool)
g.<span class="fn">set_entry_point</span>(<span class="str">"agent"</span>)
g.<span class="fn">add_conditional_edges</span>(<span class="str">"agent"</span>, router, {<span class="str">"tools"</span>:<span class="str">"tools"</span>, END:END})
g.<span class="fn">add_edge</span>(<span class="str">"tools"</span>, <span class="str">"agent"</span>)

state, trace = g.<span class="fn">invoke</span>({<span class="str">"messages"</span>:[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"weather in Paris?"</span>}]})
<span class="fn">print</span>(<span class="str">"trace:"</span>, <span class="str">" -&gt; "</span>.<span class="fn">join</span>(trace))
<span class="fn">print</span>(<span class="str">"final:"</span>, state[<span class="str">"messages"</span>][-<span class="num">1</span>][<span class="str">"content"</span>])
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Reimplements LangGraph in ~30 lines — <code>StateGraph</code> holds <code>nodes</code>, <code>edges</code>, <code>cond</code> (conditional edges), and an <code>entry</code> pointer; <code>add_node/add_edge/add_conditional_edges/set_entry_point</code> just populate these dicts. 2) <code>invoke()</code> starts at <code>entry</code>, calls the current node, merges the returned partial dict into state (lists are appended, scalars overwritten — same reducer behaviour as the real <code>add</code>), then asks the conditional edge router (if any) or the static edge for the next node. 3) The three demo nodes mirror the real LangGraph example: <code>call_model</code> emits either a fake tool_call or a final answer based on whether a tool result is already in state; <code>call_tool</code> runs <code>get_weather</code> and appends an observation; <code>router</code> branches to <code>tools</code> or <code>END</code>. 4) Running the graph prints the visited path (<code>agent -&gt; tools -&gt; agent -&gt; END</code>) plus the final message — exactly the trace shape LangGraph's tracer shows for a real ReAct loop.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Conditional Routing — Branch &amp; Cycle</h2>
<p class="l-text">Conditional edges are where graphs earn their keep. A router function inspects state and returns the next node name. This unlocks branching ("did we get a result?"), cycles ("is the draft good enough?"), and human-in-loop ("does the user approve this plan?").</p>

<div class="calc-highlight">A common production pattern: <strong>generator → critic → generator</strong> cycle. The generator drafts, the critic scores, the router sends back to the generator if score &lt; 0.8 and to <code>END</code> otherwise. Add a <code>max_revisions</code> counter in state to prevent infinite loops.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Draft -&gt; Critique -&gt; (revise or END) cycle</span>
<span class="kw">import</span> random
random.<span class="fn">seed</span>(<span class="num">13</span>)

<span class="kw">def</span> <span class="fn">draft</span>(state):
    rev = state.<span class="fn">get</span>(<span class="str">"revision"</span>, <span class="num">0</span>)
    quality = <span class="num">0.4</span> + <span class="num">0.2</span> * rev + random.<span class="fn">random</span>() * <span class="num">0.15</span>
    <span class="kw">return</span> {<span class="str">"draft"</span>: f<span class="str">"Draft v{rev+1}"</span>, <span class="str">"score"</span>: <span class="fn">round</span>(<span class="fn">min</span>(<span class="num">1.0</span>, quality), <span class="num">2</span>),
            <span class="str">"revision"</span>: rev + <span class="num">1</span>}

<span class="kw">def</span> <span class="fn">critic</span>(state):
    note = <span class="str">"needs more detail"</span> <span class="kw">if</span> state[<span class="str">"score"</span>] &lt; <span class="num">0.8</span> <span class="kw">else</span> <span class="str">"ship it"</span>
    <span class="kw">return</span> {<span class="str">"critic_note"</span>: note}

<span class="kw">def</span> <span class="fn">route</span>(state):
    <span class="kw">if</span> state[<span class="str">"score"</span>] &gt;= <span class="num">0.8</span>: <span class="kw">return</span> <span class="str">"done"</span>
    <span class="kw">if</span> state[<span class="str">"revision"</span>] &gt;= <span class="num">4</span>: <span class="kw">return</span> <span class="str">"done"</span>   <span class="cm"># safety cap</span>
    <span class="kw">return</span> <span class="str">"revise"</span>

<span class="cm"># tiny graph runner</span>
<span class="kw">def</span> <span class="fn">run</span>(state, max_steps=<span class="num">10</span>):
    node, trace = <span class="str">"draft"</span>, []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(max_steps):
        trace.<span class="fn">append</span>(node)
        <span class="kw">if</span>   node == <span class="str">"draft"</span>:   state.<span class="fn">update</span>(<span class="fn">draft</span>(state));   node = <span class="str">"critic"</span>
        <span class="kw">elif</span> node == <span class="str">"critic"</span>:  state.<span class="fn">update</span>(<span class="fn">critic</span>(state));  node = <span class="fn">route</span>(state)
        <span class="kw">elif</span> node == <span class="str">"revise"</span>:  node = <span class="str">"draft"</span>
        <span class="kw">elif</span> node == <span class="str">"done"</span>:    trace.<span class="fn">append</span>(<span class="str">"END"</span>); <span class="kw">break</span>
    <span class="kw">return</span> state, trace

s, t = <span class="fn">run</span>({})
<span class="fn">print</span>(<span class="str">"path:"</span>, <span class="str">" -&gt; "</span>.<span class="fn">join</span>(t))
<span class="fn">print</span>(<span class="str">"final state:"</span>, s)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>draft(state)</code> simulates a generator that improves with each revision: quality starts at 0.4 and rises by 0.2 per <code>revision</code> bump (plus a 0–0.15 noise term) — by revision 2 the score is reliably above 0.7. 2) <code>critic(state)</code> reads <code>state["score"]</code> and writes a short verbal note; <code>route(state)</code> is the conditional edge — returns <code>"done"</code> if score ≥ 0.8 OR <code>revision &gt;= 4</code> (the safety cap that prevents infinite loops), otherwise <code>"revise"</code>. 3) The <code>run()</code> driver walks <code>draft -&gt; critic -&gt; route -&gt; (revise|done)</code> by hand, updating state in place — exactly what LangGraph's <code>add_conditional_edges</code> does internally. 4) The printed path shows the actual cycle taken (e.g. <code>draft -&gt; critic -&gt; draft -&gt; critic -&gt; END</code>) along with the final score, demonstrating that a generator/critic loop converges in a few cycles when the generator actually improves.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Persistence &amp; Checkpointing</h2>
<p class="l-text">A long-running agent (multi-turn chat, an overnight research job, a workflow waiting on a human approval) needs <strong>persistence</strong>. LangGraph exposes a <code>checkpointer</code> protocol: after every super-step, the runtime serializes state and writes it to a store (memory, SQLite, Postgres, Redis). On resume, it loads the last checkpoint by <code>thread_id</code>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MemorySaver</div><div class="card-body">Dict-backed. For tests and notebooks.</div></div>
<div class="calc-card"><div class="card-title">SqliteSaver</div><div class="card-body">Single-file SQLite. Great for self-hosted agents and dev.</div></div>
<div class="calc-card"><div class="card-title">PostgresSaver</div><div class="card-body">Production. Concurrent threads, ACID, point-in-time recovery.</div></div>
<div class="calc-card"><div class="card-title">Time travel</div><div class="card-body">Every checkpoint has an ID. <code>graph.get_state_history(thread)</code> returns the trail; you can <code>update_state</code> to rewrite a past step and re-run forward.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LangGraph with SQLite checkpointer</span>
<span class="kw">from</span> langgraph.checkpoint.sqlite <span class="kw">import</span> SqliteSaver

memory = SqliteSaver.<span class="fn">from_conn_string</span>(<span class="str">"agent_state.db"</span>)
app = graph.<span class="fn">compile</span>(checkpointer=memory)

cfg = {<span class="str">"configurable"</span>: {<span class="str">"thread_id"</span>: <span class="str">"user_42_session_1"</span>}}

<span class="cm"># turn 1</span>
app.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [<span class="fn">HumanMessage</span>(<span class="str">"I want to plan a trip to Tokyo."</span>)]}, cfg)

<span class="cm"># ... process restarts, hours later ...</span>
<span class="cm"># turn 2 — state is loaded automatically by thread_id</span>
app.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [<span class="fn">HumanMessage</span>(<span class="str">"Add a stop in Kyoto."</span>)]}, cfg)

<span class="cm"># inspect the trail</span>
<span class="kw">for</span> snap <span class="kw">in</span> app.<span class="fn">get_state_history</span>(cfg):
    <span class="fn">print</span>(snap.values[<span class="str">"messages"</span>][-<span class="num">1</span>].content[:<span class="num">60</span>], <span class="str">"..."</span>, snap.config)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Constructs a <code>SqliteSaver</code> from a single connection string and passes it to <code>graph.compile(checkpointer=memory)</code> — after this every super-step writes the full state to <code>agent_state.db</code>. 2) The <code>cfg</code> dict carries <code>thread_id="user_42_session_1"</code>; LangGraph uses the thread id as the primary key when reading/writing checkpoints, so each user/session pair has its own independent timeline. 3) Turn 1 runs the graph normally and persists state on the way out; the process can crash, the host can reboot, and the data lives on disk. 4) Turn 2 (potentially hours later) just <code>invoke</code>s again with the same <code>cfg</code>; LangGraph loads the latest checkpoint by thread id and appends the new message — <code>get_state_history(cfg)</code> at the end walks every snapshot for replay or time-travel debugging.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SQLite checkpointing on the in-browser sqlite3 — same idea, real persistence between calls.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sqlite3, json, time

con = sqlite3.<span class="fn">connect</span>(<span class="str">":memory:"</span>)
con.<span class="fn">execute</span>(<span class="str">"""CREATE TABLE checkpoints (
    thread_id TEXT, step INTEGER, ts REAL, state_json TEXT,
    PRIMARY KEY (thread_id, step))"""</span>)

<span class="kw">def</span> <span class="fn">save</span>(thread_id, step, state):
    con.<span class="fn">execute</span>(<span class="str">"INSERT INTO checkpoints VALUES (?,?,?,?)"</span>,
                (thread_id, step, time.<span class="fn">time</span>(), json.<span class="fn">dumps</span>(state)))
    con.<span class="fn">commit</span>()

<span class="kw">def</span> <span class="fn">load_latest</span>(thread_id):
    row = con.<span class="fn">execute</span>(<span class="str">"""SELECT step, state_json FROM checkpoints
                         WHERE thread_id=? ORDER BY step DESC LIMIT 1"""</span>,
                      (thread_id,)).<span class="fn">fetchone</span>()
    <span class="kw">return</span> (row[<span class="num">0</span>], json.<span class="fn">loads</span>(row[<span class="num">1</span>])) <span class="kw">if</span> row <span class="kw">else</span> (<span class="kw">None</span>, <span class="kw">None</span>)

<span class="kw">def</span> <span class="fn">history</span>(thread_id):
    <span class="kw">return</span> <span class="fn">list</span>(con.<span class="fn">execute</span>(<span class="str">"""SELECT step, ts, state_json FROM checkpoints
                               WHERE thread_id=? ORDER BY step"""</span>, (thread_id,)))

<span class="cm"># turn 1</span>
<span class="fn">save</span>(<span class="str">"user_42"</span>, <span class="num">0</span>, {<span class="str">"messages"</span>:[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"plan trip to Tokyo"</span>}]})
<span class="fn">save</span>(<span class="str">"user_42"</span>, <span class="num">1</span>, {<span class="str">"messages"</span>:[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"plan trip to Tokyo"</span>},
                                 {<span class="str">"role"</span>:<span class="str">"assistant"</span>,<span class="str">"content"</span>:<span class="str">"flight + hotel?"</span>}]})
<span class="cm"># turn 2 — resume</span>
step, state = <span class="fn">load_latest</span>(<span class="str">"user_42"</span>)
state[<span class="str">"messages"</span>].<span class="fn">append</span>({<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"add Kyoto"</span>})
<span class="fn">save</span>(<span class="str">"user_42"</span>, step + <span class="num">1</span>, state)

<span class="fn">print</span>(<span class="str">"latest step:"</span>, <span class="fn">load_latest</span>(<span class="str">"user_42"</span>)[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"history len:"</span>, <span class="fn">len</span>(<span class="fn">history</span>(<span class="str">"user_42"</span>)))
<span class="fn">print</span>(<span class="str">"messages:"</span>, <span class="fn">load_latest</span>(<span class="str">"user_42"</span>)[<span class="num">1</span>][<span class="str">"messages"</span>][-<span class="num">1</span>])
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates an in-memory SQLite database with a <code>checkpoints(thread_id, step, ts, state_json)</code> table — primary key on <code>(thread_id, step)</code> guarantees one row per super-step per thread. 2) <code>save(thread_id, step, state)</code> serializes the state dict with <code>json.dumps</code> and inserts it; <code>load_latest</code> selects the row with the highest <code>step</code> for a thread and parses it back, exactly matching LangGraph's checkpointer protocol. 3) <code>history(thread_id)</code> returns the full ordered trail, the same data <code>app.get_state_history(cfg)</code> would produce in real LangGraph. 4) The demo plays two turns then "resumes" — turn 2 calls <code>load_latest</code>, appends a new user message, and saves at step+1; the printed assertions show the row counter and reconstructed last message.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Multi-Step Workflow — Planner / Worker / Reviewer</h2>
<p class="l-text">A common production graph: a <strong>planner</strong> decomposes the goal into steps, a <strong>worker</strong> executes each step (with tool calls), and a <strong>reviewer</strong> judges the result and either approves or sends back for revision. This is the seed of multi-agent systems (lesson 8) and the same shape that powers Claude Code, Devin, and OpenAI Operator.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Planner -&gt; Worker -&gt; Reviewer state machine</span>
<span class="kw">import</span> random
random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">planner</span>(state):
    goal = state[<span class="str">"goal"</span>]
    steps = [f<span class="str">"research {goal}"</span>, f<span class="str">"draft about {goal}"</span>, f<span class="str">"polish {goal}"</span>]
    <span class="kw">return</span> {<span class="str">"plan"</span>: steps, <span class="str">"step_idx"</span>: <span class="num">0</span>, <span class="str">"results"</span>: []}

<span class="kw">def</span> <span class="fn">worker</span>(state):
    i = state[<span class="str">"step_idx"</span>]
    task = state[<span class="str">"plan"</span>][i]
    <span class="cm"># simulate tool work</span>
    result = f<span class="str">"[done] {task} (q={round(random.uniform(0.6,1.0),2)})"</span>
    <span class="kw">return</span> {<span class="str">"results"</span>: state[<span class="str">"results"</span>] + [result], <span class="str">"step_idx"</span>: i + <span class="num">1</span>}

<span class="kw">def</span> <span class="fn">reviewer</span>(state):
    qs = [<span class="fn">float</span>(r.<span class="fn">split</span>(<span class="str">"q="</span>)[<span class="num">1</span>].<span class="fn">rstrip</span>(<span class="str">")"</span>)) <span class="kw">for</span> r <span class="kw">in</span> state[<span class="str">"results"</span>]]
    avg = <span class="fn">sum</span>(qs) / <span class="fn">len</span>(qs)
    <span class="kw">return</span> {<span class="str">"review_score"</span>: <span class="fn">round</span>(avg, <span class="num">2</span>),
            <span class="str">"approved"</span>: avg &gt;= <span class="num">0.75</span>}

<span class="kw">def</span> <span class="fn">route_after_worker</span>(state):
    <span class="kw">return</span> <span class="str">"worker"</span> <span class="kw">if</span> state[<span class="str">"step_idx"</span>] &lt; <span class="fn">len</span>(state[<span class="str">"plan"</span>]) <span class="kw">else</span> <span class="str">"reviewer"</span>

<span class="kw">def</span> <span class="fn">route_after_reviewer</span>(state):
    <span class="kw">if</span> state[<span class="str">"approved"</span>]: <span class="kw">return</span> <span class="str">"END"</span>
    <span class="kw">if</span> state.<span class="fn">get</span>(<span class="str">"revisions"</span>, <span class="num">0</span>) &gt;= <span class="num">2</span>: <span class="kw">return</span> <span class="str">"END"</span>     <span class="cm"># cap</span>
    <span class="kw">return</span> <span class="str">"planner"</span>

<span class="kw">def</span> <span class="fn">run</span>(goal):
    state = {<span class="str">"goal"</span>: goal, <span class="str">"revisions"</span>: <span class="num">0</span>}
    node, trace = <span class="str">"planner"</span>, []
    <span class="kw">while</span> node != <span class="str">"END"</span>:
        trace.<span class="fn">append</span>(node)
        <span class="kw">if</span>   node == <span class="str">"planner"</span>:  state.<span class="fn">update</span>(<span class="fn">planner</span>(state));  node = <span class="str">"worker"</span>
        <span class="kw">elif</span> node == <span class="str">"worker"</span>:   state.<span class="fn">update</span>(<span class="fn">worker</span>(state));   node = <span class="fn">route_after_worker</span>(state)
        <span class="kw">elif</span> node == <span class="str">"reviewer"</span>:
            state.<span class="fn">update</span>(<span class="fn">reviewer</span>(state))
            nxt = <span class="fn">route_after_reviewer</span>(state)
            <span class="kw">if</span> nxt == <span class="str">"planner"</span>: state[<span class="str">"revisions"</span>] += <span class="num">1</span>
            node = nxt
    <span class="kw">return</span> state, trace

s, t = <span class="fn">run</span>(<span class="str">"LangGraph tutorials"</span>)
<span class="fn">print</span>(<span class="str">"path:"</span>, <span class="str">" -&gt; "</span>.<span class="fn">join</span>(t))
<span class="fn">print</span>(<span class="str">"approved:"</span>, s[<span class="str">"approved"</span>], <span class="str">" score:"</span>, s[<span class="str">"review_score"</span>])
<span class="fn">print</span>(<span class="str">"steps done:"</span>, <span class="fn">len</span>(s[<span class="str">"results"</span>]))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>planner(state)</code> reads the goal and produces a fixed three-item plan (research, draft, polish) plus a <code>step_idx</code> counter and empty <code>results</code> list — the explicit plan a real planner LLM would emit as JSON. 2) <code>worker(state)</code> runs one plan item at a time, appends a fake result with a quality score, and increments <code>step_idx</code>; the conditional <code>route_after_worker</code> keeps looping back to <code>worker</code> until every plan item is done, then routes to <code>reviewer</code>. 3) <code>reviewer(state)</code> averages the per-step quality scores and sets <code>approved = avg &gt;= 0.75</code>; <code>route_after_reviewer</code> sends approved trajectories to <code>END</code>, otherwise back to <code>planner</code> for a new plan — with a <code>revisions &gt;= 2</code> safety cap. 4) The driver prints the actual path (e.g. <code>planner -&gt; worker -&gt; worker -&gt; worker -&gt; reviewer -&gt; END</code>) and the final approval status — the same control flow Devin, Claude Code and OpenAI Operator use under the hood.</p>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Frontier — MCP, Computer Use, and Modern Tool Integration</h2>
<p class="l-text"><strong>Tool integration in 2026 is no longer "wrap your function with @tool".</strong> Two 2024 launches reshape how this lesson's patterns ship to production. <strong>MCP (Model Context Protocol)</strong> standardizes the wire format between LLM clients and tool servers — your LangChain or LangGraph agent can mount filesystem, GitHub, Postgres, Slack and Puppeteer servers without writing a single tool wrapper. <strong>Computer Use</strong> hands Claude a screenshot and gets back mouse/keyboard actions — the universal escape hatch for tools without APIs.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MCP — Model Context Protocol (Anthropic, Nov 2024)</div><div class="card-body">JSON-RPC 2.0 over stdio or SSE. Tools, resources, and prompts are first-class. ~10 reference servers at launch (filesystem, GitHub, Postgres, Slack, Memory, Sentry, Puppeteer, Brave Search, AWS, Time). LangChain and LangGraph both ship MCP client adapters in 2025.</div></div>
<div class="calc-card"><div class="card-title">Computer Use (Anthropic, Oct 2024)</div><div class="card-body">Claude 3.5/3.7 Sonnet receives a screenshot + screen size, returns mouse coordinates and keyboard actions. ~14% on OSWorld at launch (vs ~72% human). Universal API for desktop / browser automation when no SDK exists.</div></div>
<div class="calc-card"><div class="card-title">Cursor Composer (Cursor AI, 2024)</div><div class="card-body">Multi-file agentic code editor — reads, edits, tests across a repo in one loop. Bounded action space (file ops + shell) is why it ships reliably. The model is what an "agentic IDE" should look like.</div></div>
<div class="calc-card"><div class="card-title">Devin (Cognition, Mar 2024)</div><div class="card-body">Autonomous SWE agent in a sandboxed VM, SWE-Bench ~13.86% at launch. Notable as the proof-point (and the cautionary tale) for "fully autonomous engineer" claims.</div></div>
<div class="calc-card"><div class="card-title">GitHub Copilot Workspace (Apr 2024)</div><div class="card-body">Plan → spec → edit → test loop. Reads a GitHub issue, proposes a plan, edits files, runs CI. The mainstream-scope version of the Devin idea, with real GitHub integration.</div></div>
</div>
<div class="calc-highlight"><strong>How this changes your code:</strong> instead of hand-writing 30 LangChain @tool decorators, mount the official MCP servers and let your agent discover them via the standard list-tools call. Reserve hand-written tools for your domain-specific logic. Add Computer Use as a fallback tool for systems without APIs — the agent gets a screenshot tool plus click(x,y) and type(s) and treats the desktop as just another modality.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Choosing Your Layer</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use DIY (L2-L4)</div><div class="card-body">Hackathon, single-file demo, learning, ultra-tight token budget, when you cannot bring in dependencies.</div></div>
<div class="calc-card"><div class="card-title">Use LangChain</div><div class="card-body">Single agent, linear ReAct loop, you want the integration ecosystem (vector stores, document loaders, output parsers) without writing them.</div></div>
<div class="calc-card"><div class="card-title">Use LangGraph</div><div class="card-body">Branching, cycles, parallel work, persistence/resume, human-in-loop, multi-agent. Anything heading to production.</div></div>
<div class="calc-card"><div class="card-title">Use neither</div><div class="card-body">If your "agent" is one tool call followed by a structured response, you do not need an agent — you need a function. Do not over-engineer.</div></div>
</div>

<div class="calc-highlight">In lesson 6 we will go deep on <strong>memory architectures</strong> — the in-context scratchpad you have already used, vector store memory for long-term recall, summary memory for compression, episodic event logs, and how Claude Sonnet 4.6's 1M-token context window reshapes what production agents can carry forward.</div>
</div>`,
tr: `<p class="l-text"><strong>Bir agent döngüsünü elinizle inşa ettiniz. Şimdi onu bir production sistemine dönüştüren framework'lerle tanışın.</strong> LangChain, hafızalı tek-atış araç-çağıran agent'lar için yüksek-seviyeli <code>create_react_agent</code> + <code>AgentExecutor</code> soyutlamalarını sağlar. LangGraph — graf-yerli kardeş — agent'ı bir durum makinesi olarak çizmenize izin verir: düğümler fonksiyonlardır, kenarlar geçişlerdir ve durum, graftan akan tipli bir dict'tir. Birlikte "20 satırda bir chatbot bağla"dan "checkpointlenmiş uzun-süreli iş akışlarıyla supervisor + worker sürüsü"ne kadar uzanan yelpazeyi kaplarlar.</p>

<p class="l-text">Bu ders el-yazımı ile framework arasındaki köprüdür. Aynı agent'ı üç şekilde inşa edeceğiz: (1) zaten yazabildiğiniz manuel bir ReAct döngüsü, (2) 5 satırda LangChain <code>create_react_agent</code> ve (3) koşullu yönlendirme ve kalıcılığa sahip bir LangGraph durum makinesi. Sonunda her birini <em>ne zaman</em> kullanacağınızı bileceksiniz — ve "doğrusal zincir" yetersiz kaldığında production ekiplerinin neden LangGraph'a yöneldiğini.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>LangChain LCEL: <code>create_react_agent</code>, <code>AgentExecutor</code>, hafıza bağlama</li>
<li>LangGraph temelleri: <code>StateGraph</code>, düğümler, kenarlar, koşullu yönlendirme</li>
<li>Durum tasarımı: tipli dict'ler, reducer'lar, mesaj birikimi</li>
<li>Kalıcılık &amp; checkpointing: SQLite/Postgres, time-travel debug</li>
<li>Çok-adımlı iş akışları: planlayıcı → işçi → gözden geçirici, döngülerle</li>
<li>LangChain vs LangGraph vs DIY ne zaman kullanılır</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç Katman</h2>
<p class="l-text">Bir yığın hayal edin. En altta: bir LLM istemcisi (Anthropic, OpenAI). Ortada: model çağrılarıyla araç çağrılarını içiçe geçiren bir döngü. En üstte: dallanma, hafıza ve kurtarma içeren birden fazla döngüyü orkestralayan bir durum makinesi. Her katman, alt katman atlandığında birinin kötü biçimde yeniden inşa ettiği şeydir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katman 1 — DIY (L2-L4)</div><div class="card-body">while-döngüsü, araç dispatch dict'i, scratchpad listesi. Öğrenme, hızlı prototipler ve framework entegrasyonuna ihtiyaç duymayan araçlar için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Katman 2 — LangChain</div><div class="card-body"><code>create_react_agent</code> döngüyü sarar. Ekler: hafıza sınıfları, çıktı ayrıştırıcıları, araç register'ı, ~80 entegrasyon. Doğrusal zincirler, tek agent.</div></div>
<div class="calc-card"><div class="card-title">Katman 3 — LangGraph</div><div class="card-body">Açık durum makinesi. Döngüler, dallar, paralel düğümler, checkpointing, insan-döngüde. Production çok-agent sistemlerini güçlendiren framework.</div></div>
</div>

<div class="calc-highlight">Pratik kural: 200 LOC altındaki herhangi bir agent için <strong>L1'de başla</strong>, dallanma, paralel iş veya çok-adımlı iş akışı olan herhangi bir şey için <strong>doğrudan L3'e (LangGraph) atla</strong>. L2, "sohbet hafızası ve 5 araçlı tek bir ReAct agent istiyorum" şeklindeki dar durum için en iyisidir — birçok ekip artık bunu atlıyor.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. LangChain create_react_agent</h2>
<p class="l-text">LangChain 0.1+ LCEL (LangChain Expression Language) kullanır — zincirler <code>|</code> operatörüyle bestelenir. <code>create_react_agent</code>, <code>{input, chat_history, intermediate_steps}</code> alıp bir sonraki eylemi yayan bir <code>Runnable</code> döndürür. Döngüyü çalıştırmak için <code>AgentExecutor</code>'a sar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LangChain ReAct agent — minimal working example</span>
<span class="kw">from</span> langchain_anthropic <span class="kw">import</span> ChatAnthropic
<span class="kw">from</span> langchain.agents <span class="kw">import</span> create_react_agent, AgentExecutor
<span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> PromptTemplate

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">get_weather</span>(city: <span class="fn">str</span>) -&gt; <span class="fn">str</span>:
    <span class="str">"""Get current weather for a city."""</span>
    <span class="kw">return</span> f<span class="str">"Weather in {city}: 22C, sunny"</span>

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">calculate</span>(expression: <span class="fn">str</span>) -&gt; <span class="fn">str</span>:
    <span class="str">"""Evaluate a math expression like '2*3+1'."""</span>
    <span class="kw">return</span> <span class="fn">str</span>(<span class="fn">eval</span>(expression, {<span class="str">"__builtins__"</span>: {}}))

llm = <span class="fn">ChatAnthropic</span>(model=<span class="str">"claude-sonnet-4-6"</span>, temperature=<span class="num">0</span>)
tools = [get_weather, calculate]

prompt = PromptTemplate.<span class="fn">from_template</span>(<span class="str">"""Answer the question using tools.

Tools: {tools}
Tool names: {tool_names}

Use this format:
Question: ...
Thought: ...
Action: tool_name
Action Input: tool_input
Observation: tool_result
... (repeat) ...
Thought: I now know the final answer.
Final Answer: ...

Question: {input}
{agent_scratchpad}"""</span>)

agent = <span class="fn">create_react_agent</span>(llm, tools, prompt)
executor = <span class="fn">AgentExecutor</span>(agent=agent, tools=tools, max_iterations=<span class="num">5</span>, verbose=<span class="kw">True</span>)
result = executor.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"What is the weather in Paris times 3?"</span>})
<span class="fn">print</span>(result[<span class="str">"output"</span>])
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) İki düz Python fonksiyonunu <code>@tool</code> ile dekore eder; LangChain her docstring ve type hint'i okuyarak otomatik bir JSON şema üretir — elle şema dosyası gerekmez. 2) LangChain'in zorunlu placeholder'larını (<code>{tools}</code>, <code>{tool_names}</code>, <code>{input}</code>, <code>{agent_scratchpad}</code>) içeren ve ReAct metin formatını (Thought / Action / Action Input / Observation / Final Answer) sabitleyen bir <code>PromptTemplate</code> kurar. 3) <code>create_react_agent(llm, tools, prompt)</code> bir sonraki eylemi yayan bir Runnable döndürür; bunu <code>AgentExecutor(..., max_iterations=5, verbose=True)</code>'a sarmak çalışan bir döngüye çevirir — sıkı bir adım üst sınırı ve adım başına logging ile. 4) <code>executor.invoke({"input": "..."})</code> model <code>Final Answer:</code> üretene kadar döngüyü sürdürür ve nihai <code>output</code> ile tüm <code>intermediate_steps</code> izini içeren bir dict döndürür.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Claude'un yerine geçen scriptlenmiş bir "LLM" ile manuel ReAct döngüsü — aynı mimari, API anahtarı yok.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Manual ReAct — what create_react_agent does internally</span>
<span class="kw">import</span> re

TOOLS = {
    <span class="str">"get_weather"</span>: <span class="kw">lambda</span> city: f<span class="str">"Weather in {city}: 22C, sunny"</span>,
    <span class="str">"calculate"</span>:   <span class="kw">lambda</span> expr: <span class="fn">str</span>(<span class="fn">eval</span>(expr, {<span class="str">"__builtins__"</span>: {}})),
}

<span class="cm"># scripted "LLM" — in reality this is a Claude call</span>
SCRIPT = [
    <span class="str">"Thought: I need the weather first.\\nAction: get_weather\\nAction Input: Paris"</span>,
    <span class="str">"Thought: Now multiply the temperature by 3.\\nAction: calculate\\nAction Input: 22*3"</span>,
    <span class="str">"Thought: Done.\\nFinal Answer: 22C times 3 = 66."</span>,
]

<span class="kw">def</span> <span class="fn">react_loop</span>(question, max_iter=<span class="num">5</span>):
    scratch, step = [f<span class="str">"Question: {question}"</span>], <span class="num">0</span>
    <span class="kw">while</span> step &lt; max_iter:
        out = SCRIPT[step]
        scratch.<span class="fn">append</span>(out)
        <span class="kw">if</span> <span class="str">"Final Answer:"</span> <span class="kw">in</span> out:
            <span class="kw">return</span> out.<span class="fn">split</span>(<span class="str">"Final Answer:"</span>)[-<span class="num">1</span>].<span class="fn">strip</span>()
        m = re.<span class="fn">search</span>(r<span class="str">"Action:\\s*(\\S+)\\s*\\nAction Input:\\s*(.+)"</span>, out)
        <span class="kw">if</span> <span class="kw">not</span> m: <span class="kw">break</span>
        tool, arg = m.<span class="fn">group</span>(<span class="num">1</span>), m.<span class="fn">group</span>(<span class="num">2</span>).<span class="fn">strip</span>()
        obs = TOOLS[tool](arg)
        scratch.<span class="fn">append</span>(f<span class="str">"Observation: {obs}"</span>)
        step += <span class="num">1</span>
    <span class="kw">return</span> <span class="str">"no answer"</span>

<span class="fn">print</span>(<span class="fn">react_loop</span>(<span class="str">"What is Paris weather times 3?"</span>))
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>TOOLS</code>, tool adlarını lambda'lara eşleyen küçük bir sözlüktür — bu tam olarak <code>create_react_agent</code>'ın bir fonksiyonu <code>@tool</code> ile sardığında içeride sakladığı şeydir. 2) <code>SCRIPT</code>, gerçek bir Claude trajectory'sini taklit eden üç model çıktısının el-yazımı listesidir: önce <code>get_weather[Paris]</code>, sonra <code>calculate[22*3]</code>, sonra <code>Final Answer:</code>. 3) <code>react_loop</code> script'i adım adım yürür, her <code>Action: name</code> + <code>Action Input: arg</code> çiftini regex'le parse eder, eşleşen tool'u çalıştırır ve scratchpad'e bir <code>Observation:</code> satırı ekler — LangChain'in içindeki parsing ile özdeş. 4) Döngü ya model <code>Final Answer:</code> yayınca ya da <code>max_iter</code>'e ulaşınca sonlanır — production agent'ından eksik tek şey <code>SCRIPT[step]</code>'i gerçek bir <code>llm.invoke(scratch)</code> çağrısıyla değiştirmek.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hafızalı AgentExecutor</h2>
<p class="l-text"><code>AgentExecutor</code>, <code>.invoke()</code> çağrıları arasında stateless'tır. Sohbet deneyimi elde etmek için onu <code>RunnableWithMessageHistory</code>'e sarın ve oturum-anahtarlı bir mesaj deposu sağlayın.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Add chat memory to an AgentExecutor</span>
<span class="kw">from</span> langchain_core.runnables.history <span class="kw">import</span> RunnableWithMessageHistory
<span class="kw">from</span> langchain_community.chat_message_histories <span class="kw">import</span> ChatMessageHistory

_SESSIONS = {}
<span class="kw">def</span> <span class="fn">get_session</span>(sid: <span class="fn">str</span>):
    <span class="kw">if</span> sid <span class="kw">not</span> <span class="kw">in</span> _SESSIONS:
        _SESSIONS[sid] = <span class="fn">ChatMessageHistory</span>()
    <span class="kw">return</span> _SESSIONS[sid]

agent_with_memory = <span class="fn">RunnableWithMessageHistory</span>(
    executor,                        <span class="cm"># from previous snippet</span>
    get_session,
    input_messages_key=<span class="str">"input"</span>,
    history_messages_key=<span class="str">"chat_history"</span>,
)

cfg = {<span class="str">"configurable"</span>: {<span class="str">"session_id"</span>: <span class="str">"user_42"</span>}}
agent_with_memory.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"I live in Berlin."</span>}, cfg)
agent_with_memory.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"What is the weather where I live?"</span>}, cfg)
<span class="cm"># Second call sees "Berlin" via chat_history, calls get_weather('Berlin').</span>
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Global bir <code>_SESSIONS</code> sözlüğü ve oturum kimliği başına tembel olarak bir <code>ChatMessageHistory</code> üreten <code>get_session(sid)</code> arayışı kurar — her chatbot'un ihtiyaç duyduğu kullanıcı-başına depolama. 2) Mevcut <code>executor</code>'ı <code>RunnableWithMessageHistory(...)</code>'a sarar; hangi input anahtarının kullanıcı mesajını taşıdığını (<code>input_messages_key</code>) ve zincirin geçmişi hangi anahtar altından tükettiğini (<code>history_messages_key</code>) söyler. 3) <code>cfg</code> sözlüğü <code>configurable</code> üzerinden bir <code>session_id</code> geçirir; LangChain her çağrıda eşleşen geçmişi arar ve prompt'a <code>chat_history</code> altında enjekte eder. 4) İlk <code>invoke</code> "I live in Berlin." mesajını oturuma kaydeder; ikinci çağrı sadece "where I live" der — sarmalayıcı önceki turu yeniden enjekte eder, böylece agent context'te "Berlin"'i görür ve <code>get_weather('Berlin')</code>'i yönlendirir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Dict olarak gerçeklenmiş oturum-başına hafıza deposu — LangChain'in ChatMessageHistory'si ile aynı şekil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> collections <span class="kw">import</span> defaultdict

_SESSIONS = <span class="fn">defaultdict</span>(<span class="fn">list</span>)

<span class="kw">def</span> <span class="fn">chat</span>(session_id, user_msg, fake_response_fn):
    history = _SESSIONS[session_id]
    <span class="cm"># build prompt = history + new turn</span>
    prompt_lines = [f<span class="str">"{m['role']}: {m['content']}"</span> <span class="kw">for</span> m <span class="kw">in</span> history]
    prompt_lines.<span class="fn">append</span>(f<span class="str">"user: {user_msg}"</span>)
    response = <span class="fn">fake_response_fn</span>(prompt_lines)
    history.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: user_msg})
    history.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"assistant"</span>, <span class="str">"content"</span>: response})
    <span class="kw">return</span> response

<span class="cm"># scripted responder that uses prior turns</span>
<span class="kw">def</span> <span class="fn">fake</span>(history_lines):
    joined = <span class="str">" | "</span>.<span class="fn">join</span>(history_lines)
    <span class="kw">if</span> <span class="str">"Berlin"</span> <span class="kw">in</span> joined <span class="kw">and</span> <span class="str">"weather"</span> <span class="kw">in</span> history_lines[-<span class="num">1</span>].<span class="fn">lower</span>():
        <span class="kw">return</span> <span class="str">"Calling get_weather('Berlin') -&gt; 18C, cloudy"</span>
    <span class="kw">if</span> <span class="str">"live"</span> <span class="kw">in</span> history_lines[-<span class="num">1</span>]:
        <span class="kw">return</span> <span class="str">"Got it — you live in Berlin."</span>
    <span class="kw">return</span> <span class="str">"..."</span>

<span class="fn">print</span>(<span class="fn">chat</span>(<span class="str">"user_42"</span>, <span class="str">"I live in Berlin."</span>, fake))
<span class="fn">print</span>(<span class="fn">chat</span>(<span class="str">"user_42"</span>, <span class="str">"What is the weather where I live?"</span>, fake))
<span class="fn">print</span>(<span class="str">"History length:"</span>, <span class="fn">len</span>(_SESSIONS[<span class="str">"user_42"</span>]))
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) LangChain'in <code>ChatMessageHistory</code>'sini bir <code>defaultdict(list)</code> ile değiştirir — aynı şekil, yalnızca oturum başına <code>{role, content}</code> sözlüklerinden oluşan bir liste. 2) <code>chat(session_id, user_msg, fake_response_fn)</code> prompt'u mevcut geçmiş artı yeni kullanıcı satırından kurar, yanıtlayıcıya verir ve hem kullanıcı mesajını hem de assistant cevabını oturuma geri ekler. 3) <code>fake(history_lines)</code> LLM'in yerine geçer: birleştirilmiş geçmişi inceler ve yalnızca geçmiş turlarda "Berlin"i ve son satırda "weather" gördüğünde Berlin-bilinçli bir cevap yayar — gerçek bir sohbet modelinin sağladığı context-duyarlılığının aynısı. 4) İki demo çağrısı hafıza sözleşmesini kanıtlar — ilki şehri saklar, ikincisi "where I live" der ve yine de Berlin'e yönlendirilir çünkü geçmiş prompt'a yeniden oynatılır.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LangGraph — Neden Graflar?</h2>
<p class="l-text">LangChain'in <code>AgentExecutor</code>'ı bir <em>doğrusal döngüdür</em>: model → araç → model → araç → cevap. Gerçek iş akışları dallanır: "arama hiçbir şey döndürmediyse açıklayıcı soru sor; aksi halde özetle." Döngü oluşturur: "eleştir → revize et → eleştir → revize et". Paralelleştirir: "3 retriever'a yay, sonra birleştir."</p>

<p class="l-text">LangGraph tüm bunları tipli durumla bir <strong>yönlü graf</strong> olarak modeller. Düğümler saf fonksiyonlardır <code>state -&gt; partial_state</code>. Kenarlar geçişleri tanımlar, isteğe bağlı koşullu. Runtime, durumu graf boyunca <code>END</code>'e ulaşana kadar ilerletir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">StateGraph</div><div class="card-body">Grafın kendisi. Bir state şeması (tipli dict) ile inşa edilir. Düğüm ve kenar eklersin, sonra <code>compile()</code>.</div></div>
<div class="calc-card"><div class="card-title">Düğüm</div><div class="card-body">Bir fonksiyon. Mevcut durumu alır, içine birleştirilecek kısmi bir dict döndürür. Bir zincir, bir LLM çağrısı, bir araç veya saf Python olabilir.</div></div>
<div class="calc-card"><div class="card-title">Kenar</div><div class="card-body">Statik (her zaman A'dan B'ye git) veya koşullu (bir sonraki düğüm adını döndüren bir router fonksiyonu çağır).</div></div>
<div class="calc-card"><div class="card-title">Reducer</div><div class="card-body">Bir düğümün çıktısını state ile nasıl birleştireceği. <code>operator.add</code> listelere ekler; varsayılan üzerine yazmadır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Bir LangGraph Agent — Hello World</h2>
<p class="l-text">Kanonik kalıp: LLM'i çağıran bir <code>agent</code> düğümü, varsa araç çağrılarını yürüten bir <code>tools</code> düğümü ve <code>agent</code>'tan ya geri <code>tools</code>'a ya da <code>END</code>'e yönlendiren bir koşullu kenar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LangGraph ReAct agent — explicit state machine</span>
<span class="kw">from</span> typing <span class="kw">import</span> Annotated, TypedDict
<span class="kw">from</span> operator <span class="kw">import</span> add
<span class="kw">from</span> langgraph.graph <span class="kw">import</span> StateGraph, END
<span class="kw">from</span> langgraph.prebuilt <span class="kw">import</span> ToolNode
<span class="kw">from</span> langchain_anthropic <span class="kw">import</span> ChatAnthropic
<span class="kw">from</span> langchain_core.messages <span class="kw">import</span> HumanMessage, BaseMessage
<span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool

<span class="kw">@tool</span>
<span class="kw">def</span> <span class="fn">get_weather</span>(city: <span class="fn">str</span>) -&gt; <span class="fn">str</span>:
    <span class="str">"""Current weather."""</span>
    <span class="kw">return</span> f<span class="str">"Weather in {city}: 22C, sunny"</span>

<span class="kw">class</span> <span class="fn">State</span>(TypedDict):
    messages: Annotated[<span class="fn">list</span>[BaseMessage], add]   <span class="cm"># reducer = append</span>

llm = <span class="fn">ChatAnthropic</span>(model=<span class="str">"claude-sonnet-4-6"</span>).<span class="fn">bind_tools</span>([get_weather])

<span class="kw">def</span> <span class="fn">call_model</span>(state: State):
    <span class="kw">return</span> {<span class="str">"messages"</span>: [llm.<span class="fn">invoke</span>(state[<span class="str">"messages"</span>])]}

<span class="kw">def</span> <span class="fn">should_continue</span>(state: State) -&gt; <span class="fn">str</span>:
    last = state[<span class="str">"messages"</span>][-<span class="num">1</span>]
    <span class="kw">return</span> <span class="str">"tools"</span> <span class="kw">if</span> last.tool_calls <span class="kw">else</span> END

graph = <span class="fn">StateGraph</span>(State)
graph.<span class="fn">add_node</span>(<span class="str">"agent"</span>, call_model)
graph.<span class="fn">add_node</span>(<span class="str">"tools"</span>, <span class="fn">ToolNode</span>([get_weather]))
graph.<span class="fn">set_entry_point</span>(<span class="str">"agent"</span>)
graph.<span class="fn">add_conditional_edges</span>(<span class="str">"agent"</span>, should_continue, {<span class="str">"tools"</span>: <span class="str">"tools"</span>, END: END})
graph.<span class="fn">add_edge</span>(<span class="str">"tools"</span>, <span class="str">"agent"</span>)    <span class="cm"># after tool, back to model</span>
app = graph.<span class="fn">compile</span>()

out = app.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [<span class="fn">HumanMessage</span>(content=<span class="str">"weather in Paris?"</span>)]})
<span class="fn">print</span>(out[<span class="str">"messages"</span>][-<span class="num">1</span>].content)
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>State(TypedDict)</code>'i tek bir alanla tanımlar — <code>messages: Annotated[list, add]</code> — burada <code>add</code> düğümler güncelleme döndürdüğünde üzerine yazmak yerine <em>eklemeli</em> birleştirme yapan reducer'dır. 2) <code>call_model(state)</code> tool-bağlı Claude'u çalışan mesaj listesi üzerinde çağırır ve <code>{"messages": [yeni_msg]}</code> döner; reducer onu state'e ekler. 3) <code>should_continue</code> router'dır — <code>state["messages"][-1].tool_calls</code>'ı inceler ve ya <code>"tools"</code> ya da özel <code>END</code> sentinel'ini döndürür; <code>add_conditional_edges</code> bu dalı bağlar. 4) Graf: <code>START → agent → (tools → agent döngü)* → END</code> — <code>graph.compile()</code> tanımı, bir başlangıç mesaj listesiyle <code>invoke</code> edebileceğiniz bir Runnable'a çevirir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">40 satırda LangGraph klonu — düğüm fonksiyonları, koşullu kenarlar, dict-tabanlı state. Çalıştır ve graf boyunca yolu izle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>END = <span class="str">"__END__"</span>

<span class="kw">class</span> StateGraph:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.nodes, <span class="kw">self</span>.edges, <span class="kw">self</span>.cond = {}, {}, {}
        <span class="kw">self</span>.entry = <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">add_node</span>(<span class="kw">self</span>, name, fn): <span class="kw">self</span>.nodes[name] = fn
    <span class="kw">def</span> <span class="fn">add_edge</span>(<span class="kw">self</span>, src, dst): <span class="kw">self</span>.edges[src] = dst
    <span class="kw">def</span> <span class="fn">add_conditional_edges</span>(<span class="kw">self</span>, src, router, mapping):
        <span class="kw">self</span>.cond[src] = (router, mapping)
    <span class="kw">def</span> <span class="fn">set_entry_point</span>(<span class="kw">self</span>, name): <span class="kw">self</span>.entry = name
    <span class="kw">def</span> <span class="fn">invoke</span>(<span class="kw">self</span>, state, max_steps=<span class="num">10</span>, trace=<span class="kw">None</span>):
        node = <span class="kw">self</span>.entry
        trace = trace <span class="kw">if</span> trace <span class="kw">is</span> <span class="kw">not</span> <span class="kw">None</span> <span class="kw">else</span> []
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(max_steps):
            trace.<span class="fn">append</span>(node)
            patch = <span class="kw">self</span>.nodes[node](state)
            <span class="kw">for</span> k, v <span class="kw">in</span> patch.<span class="fn">items</span>():
                state[k] = state.<span class="fn">get</span>(k, []) + v <span class="kw">if</span> <span class="fn">isinstance</span>(v, <span class="fn">list</span>) <span class="kw">else</span> v
            <span class="kw">if</span> node <span class="kw">in</span> <span class="kw">self</span>.cond:
                router, m = <span class="kw">self</span>.cond[node]
                nxt = m[<span class="fn">router</span>(state)]
            <span class="kw">else</span>:
                nxt = <span class="kw">self</span>.edges.<span class="fn">get</span>(node, END)
            <span class="kw">if</span> nxt == END: trace.<span class="fn">append</span>(<span class="str">"END"</span>); <span class="kw">return</span> state, trace
            node = nxt
        <span class="kw">return</span> state, trace

<span class="cm"># nodes</span>
<span class="kw">def</span> <span class="fn">call_model</span>(state):
    msgs = state[<span class="str">"messages"</span>]
    last_user = <span class="fn">next</span>((m <span class="kw">for</span> m <span class="kw">in</span> <span class="fn">reversed</span>(msgs) <span class="kw">if</span> m[<span class="str">"role"</span>]==<span class="str">"user"</span>), {<span class="str">"content"</span>:<span class="str">""</span>})
    <span class="kw">if</span> <span class="fn">any</span>(m.<span class="fn">get</span>(<span class="str">"role"</span>)==<span class="str">"tool"</span> <span class="kw">for</span> m <span class="kw">in</span> msgs):
        <span class="kw">return</span> {<span class="str">"messages"</span>: [{<span class="str">"role"</span>:<span class="str">"assistant"</span>,<span class="str">"content"</span>:<span class="str">"It is 22C and sunny in Paris."</span>}]}
    <span class="kw">return</span> {<span class="str">"messages"</span>: [{<span class="str">"role"</span>:<span class="str">"assistant"</span>,<span class="str">"tool_call"</span>:{<span class="str">"name"</span>:<span class="str">"get_weather"</span>,<span class="str">"args"</span>:{<span class="str">"city"</span>:<span class="str">"Paris"</span>}}}]}

<span class="kw">def</span> <span class="fn">call_tool</span>(state):
    call = state[<span class="str">"messages"</span>][-<span class="num">1</span>][<span class="str">"tool_call"</span>]
    result = f<span class="str">"Weather in {call['args']['city']}: 22C, sunny"</span>
    <span class="kw">return</span> {<span class="str">"messages"</span>: [{<span class="str">"role"</span>:<span class="str">"tool"</span>,<span class="str">"content"</span>:result}]}

<span class="kw">def</span> <span class="fn">router</span>(state):
    <span class="kw">return</span> <span class="str">"tools"</span> <span class="kw">if</span> <span class="str">"tool_call"</span> <span class="kw">in</span> state[<span class="str">"messages"</span>][-<span class="num">1</span>] <span class="kw">else</span> END

g = <span class="fn">StateGraph</span>()
g.<span class="fn">add_node</span>(<span class="str">"agent"</span>, call_model)
g.<span class="fn">add_node</span>(<span class="str">"tools"</span>, call_tool)
g.<span class="fn">set_entry_point</span>(<span class="str">"agent"</span>)
g.<span class="fn">add_conditional_edges</span>(<span class="str">"agent"</span>, router, {<span class="str">"tools"</span>:<span class="str">"tools"</span>, END:END})
g.<span class="fn">add_edge</span>(<span class="str">"tools"</span>, <span class="str">"agent"</span>)

state, trace = g.<span class="fn">invoke</span>({<span class="str">"messages"</span>:[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"weather in Paris?"</span>}]})
<span class="fn">print</span>(<span class="str">"trace:"</span>, <span class="str">" -&gt; "</span>.<span class="fn">join</span>(trace))
<span class="fn">print</span>(<span class="str">"final:"</span>, state[<span class="str">"messages"</span>][-<span class="num">1</span>][<span class="str">"content"</span>])
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) LangGraph'ı ~30 satırda yeniden yazar — <code>StateGraph</code> <code>nodes</code>, <code>edges</code>, <code>cond</code> (koşullu kenarlar) ve bir <code>entry</code> işaretçisini tutar; <code>add_node/add_edge/add_conditional_edges/set_entry_point</code> sadece bu sözlükleri doldurur. 2) <code>invoke()</code> <code>entry</code>'den başlar, mevcut düğümü çağırır, dönen kısmi sözlüğü state'e birleştirir (listeler eklenir, skalerler üzerine yazılır — gerçek <code>add</code> ile aynı reducer davranışı), sonra koşullu kenar router'ından (varsa) veya statik kenardan bir sonraki düğümü ister. 3) Üç demo düğümü gerçek LangGraph örneğini yansıtır: <code>call_model</code> state'te zaten tool sonucu olup olmamasına göre ya sahte tool_call ya da nihai cevap yayar; <code>call_tool</code> <code>get_weather</code>'i çalıştırır ve gözlem ekler; <code>router</code> <code>tools</code> veya <code>END</code>'e dallanır. 4) Graf çalıştırılınca ziyaret edilen yol (<code>agent -&gt; tools -&gt; agent -&gt; END</code>) ve son mesaj yazdırılır — LangGraph'ın tracer'ının gerçek bir ReAct döngüsü için gösterdiği iz şeklinin aynısı.</p>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Koşullu Yönlendirme — Dal &amp; Döngü</h2>
<p class="l-text">Koşullu kenarlar, grafların ekmeğini kazandığı yerdir. Bir router fonksiyonu state'i inceler ve sonraki düğüm adını döndürür. Bu, dallanmayı ("sonuç aldık mı?"), döngüleri ("taslak yeterince iyi mi?") ve insan-döngüde'yi ("kullanıcı bu planı onaylıyor mu?") açar.</p>

<div class="calc-highlight">Yaygın bir production kalıbı: <strong>üretici → eleştirmen → üretici</strong> döngüsü. Üretici taslağı yapar, eleştirmen puanlar, router skor &lt; 0.8 ise üreticiye, aksi halde <code>END</code>'e yollar. Sonsuz döngüleri önlemek için state'e bir <code>max_revisions</code> sayacı ekle.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Draft -&gt; Critique -&gt; (revise or END) cycle</span>
<span class="kw">import</span> random
random.<span class="fn">seed</span>(<span class="num">13</span>)

<span class="kw">def</span> <span class="fn">draft</span>(state):
    rev = state.<span class="fn">get</span>(<span class="str">"revision"</span>, <span class="num">0</span>)
    quality = <span class="num">0.4</span> + <span class="num">0.2</span> * rev + random.<span class="fn">random</span>() * <span class="num">0.15</span>
    <span class="kw">return</span> {<span class="str">"draft"</span>: f<span class="str">"Draft v{rev+1}"</span>, <span class="str">"score"</span>: <span class="fn">round</span>(<span class="fn">min</span>(<span class="num">1.0</span>, quality), <span class="num">2</span>),
            <span class="str">"revision"</span>: rev + <span class="num">1</span>}

<span class="kw">def</span> <span class="fn">critic</span>(state):
    note = <span class="str">"needs more detail"</span> <span class="kw">if</span> state[<span class="str">"score"</span>] &lt; <span class="num">0.8</span> <span class="kw">else</span> <span class="str">"ship it"</span>
    <span class="kw">return</span> {<span class="str">"critic_note"</span>: note}

<span class="kw">def</span> <span class="fn">route</span>(state):
    <span class="kw">if</span> state[<span class="str">"score"</span>] &gt;= <span class="num">0.8</span>: <span class="kw">return</span> <span class="str">"done"</span>
    <span class="kw">if</span> state[<span class="str">"revision"</span>] &gt;= <span class="num">4</span>: <span class="kw">return</span> <span class="str">"done"</span>   <span class="cm"># safety cap</span>
    <span class="kw">return</span> <span class="str">"revise"</span>

<span class="cm"># tiny graph runner</span>
<span class="kw">def</span> <span class="fn">run</span>(state, max_steps=<span class="num">10</span>):
    node, trace = <span class="str">"draft"</span>, []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(max_steps):
        trace.<span class="fn">append</span>(node)
        <span class="kw">if</span>   node == <span class="str">"draft"</span>:   state.<span class="fn">update</span>(<span class="fn">draft</span>(state));   node = <span class="str">"critic"</span>
        <span class="kw">elif</span> node == <span class="str">"critic"</span>:  state.<span class="fn">update</span>(<span class="fn">critic</span>(state));  node = <span class="fn">route</span>(state)
        <span class="kw">elif</span> node == <span class="str">"revise"</span>:  node = <span class="str">"draft"</span>
        <span class="kw">elif</span> node == <span class="str">"done"</span>:    trace.<span class="fn">append</span>(<span class="str">"END"</span>); <span class="kw">break</span>
    <span class="kw">return</span> state, trace

s, t = <span class="fn">run</span>({})
<span class="fn">print</span>(<span class="str">"path:"</span>, <span class="str">" -&gt; "</span>.<span class="fn">join</span>(t))
<span class="fn">print</span>(<span class="str">"final state:"</span>, s)
</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>draft(state)</code> her revizyonla iyileşen bir üreticiyi simüle eder: kalite 0.4'ten başlar ve her <code>revision</code> artışıyla 0.2 yükselir (artı 0–0.15 gürültü) — 2. revizyonda skor güvenilir biçimde 0.7'nin üstündedir. 2) <code>critic(state)</code> <code>state["score"]</code>'u okur ve kısa sözlü bir not yazar; <code>route(state)</code> koşullu kenardır — skor ≥ 0.8 VEYA <code>revision &gt;= 4</code> ise <code>"done"</code> (sonsuz döngüleri engelleyen güvenlik kapağı) döner, aksi halde <code>"revise"</code>. 3) <code>run()</code> sürücüsü <code>draft -&gt; critic -&gt; route -&gt; (revise|done)</code>'u elle yürür ve state'i yerinde günceller — LangGraph'ın <code>add_conditional_edges</code>'inin içeride yaptığının aynısı. 4) Yazdırılan yol gerçek alınan döngüyü (örn. <code>draft -&gt; critic -&gt; draft -&gt; critic -&gt; END</code>) ve son skoru gösterir; üretici gerçekten iyileşiyorsa bir generator/critic döngüsünün birkaç tur içinde yakınsadığını kanıtlar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kalıcılık &amp; Checkpointing</h2>
<p class="l-text">Uzun-süreli bir agent'ın (çok-turlu sohbet, gece-boyu süren bir araştırma işi, insan onayını bekleyen bir iş akışı) <strong>kalıcılığa</strong> ihtiyacı vardır. LangGraph bir <code>checkpointer</code> protokolü sunar: her süper-adımdan sonra runtime state'i serialize edip bir depoya yazar (memory, SQLite, Postgres, Redis). Devam ederken son checkpoint'i <code>thread_id</code>'ye göre yükler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MemorySaver</div><div class="card-body">Dict tabanlı. Testler ve notebook'lar için.</div></div>
<div class="calc-card"><div class="card-title">SqliteSaver</div><div class="card-body">Tek dosyalık SQLite. Self-hosted agent'lar ve geliştirme için harika.</div></div>
<div class="calc-card"><div class="card-title">PostgresSaver</div><div class="card-body">Production. Eşzamanlı thread'ler, ACID, anlık geri yükleme.</div></div>
<div class="calc-card"><div class="card-title">Time travel</div><div class="card-body">Her checkpoint'in bir ID'si vardır. <code>graph.get_state_history(thread)</code> izi döndürür; geçmiş bir adımı yeniden yazıp ileri çalıştırmak için <code>update_state</code> kullanabilirsin.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LangGraph with SQLite checkpointer</span>
<span class="kw">from</span> langgraph.checkpoint.sqlite <span class="kw">import</span> SqliteSaver

memory = SqliteSaver.<span class="fn">from_conn_string</span>(<span class="str">"agent_state.db"</span>)
app = graph.<span class="fn">compile</span>(checkpointer=memory)

cfg = {<span class="str">"configurable"</span>: {<span class="str">"thread_id"</span>: <span class="str">"user_42_session_1"</span>}}

<span class="cm"># turn 1</span>
app.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [<span class="fn">HumanMessage</span>(<span class="str">"I want to plan a trip to Tokyo."</span>)]}, cfg)

<span class="cm"># ... process restarts, hours later ...</span>
<span class="cm"># turn 2 — state is loaded automatically by thread_id</span>
app.<span class="fn">invoke</span>({<span class="str">"messages"</span>: [<span class="fn">HumanMessage</span>(<span class="str">"Add a stop in Kyoto."</span>)]}, cfg)

<span class="cm"># inspect the trail</span>
<span class="kw">for</span> snap <span class="kw">in</span> app.<span class="fn">get_state_history</span>(cfg):
    <span class="fn">print</span>(snap.values[<span class="str">"messages"</span>][-<span class="num">1</span>].content[:<span class="num">60</span>], <span class="str">"..."</span>, snap.config)
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Tek bir bağlantı string'inden bir <code>SqliteSaver</code> kurar ve <code>graph.compile(checkpointer=memory)</code>'a geçirir — bu noktadan sonra her süper-adım state'in tamamını <code>agent_state.db</code>'ye yazar. 2) <code>cfg</code> sözlüğü <code>thread_id="user_42_session_1"</code> taşır; LangGraph checkpoint'leri okurken/yazarken thread id'yi birincil anahtar olarak kullanır, böylece her kullanıcı/oturum çiftinin kendi bağımsız zaman çizelgesi olur. 3) 1. tur grafı normal çalıştırır ve çıkış yolunda state'i kalıcılar; süreç çökebilir, host yeniden başlayabilir, veri diskte yaşar. 4) 2. tur (potansiyel olarak saatler sonra) aynı <code>cfg</code> ile yine <code>invoke</code> çağrısı yapar; LangGraph thread id'ye göre son checkpoint'i yükler ve yeni mesajı ekler — sondaki <code>get_state_history(cfg)</code> replay veya time-travel debug için her snapshot'ı dolaşır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Tarayıcı içi sqlite3 üzerinde SQLite checkpointing — aynı fikir, çağrılar arasında gerçek kalıcılık.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sqlite3, json, time

con = sqlite3.<span class="fn">connect</span>(<span class="str">":memory:"</span>)
con.<span class="fn">execute</span>(<span class="str">"""CREATE TABLE checkpoints (
    thread_id TEXT, step INTEGER, ts REAL, state_json TEXT,
    PRIMARY KEY (thread_id, step))"""</span>)

<span class="kw">def</span> <span class="fn">save</span>(thread_id, step, state):
    con.<span class="fn">execute</span>(<span class="str">"INSERT INTO checkpoints VALUES (?,?,?,?)"</span>,
                (thread_id, step, time.<span class="fn">time</span>(), json.<span class="fn">dumps</span>(state)))
    con.<span class="fn">commit</span>()

<span class="kw">def</span> <span class="fn">load_latest</span>(thread_id):
    row = con.<span class="fn">execute</span>(<span class="str">"""SELECT step, state_json FROM checkpoints
                         WHERE thread_id=? ORDER BY step DESC LIMIT 1"""</span>,
                      (thread_id,)).<span class="fn">fetchone</span>()
    <span class="kw">return</span> (row[<span class="num">0</span>], json.<span class="fn">loads</span>(row[<span class="num">1</span>])) <span class="kw">if</span> row <span class="kw">else</span> (<span class="kw">None</span>, <span class="kw">None</span>)

<span class="kw">def</span> <span class="fn">history</span>(thread_id):
    <span class="kw">return</span> <span class="fn">list</span>(con.<span class="fn">execute</span>(<span class="str">"""SELECT step, ts, state_json FROM checkpoints
                               WHERE thread_id=? ORDER BY step"""</span>, (thread_id,)))

<span class="cm"># turn 1</span>
<span class="fn">save</span>(<span class="str">"user_42"</span>, <span class="num">0</span>, {<span class="str">"messages"</span>:[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"plan trip to Tokyo"</span>}]})
<span class="fn">save</span>(<span class="str">"user_42"</span>, <span class="num">1</span>, {<span class="str">"messages"</span>:[{<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"plan trip to Tokyo"</span>},
                                 {<span class="str">"role"</span>:<span class="str">"assistant"</span>,<span class="str">"content"</span>:<span class="str">"flight + hotel?"</span>}]})
<span class="cm"># turn 2 — resume</span>
step, state = <span class="fn">load_latest</span>(<span class="str">"user_42"</span>)
state[<span class="str">"messages"</span>].<span class="fn">append</span>({<span class="str">"role"</span>:<span class="str">"user"</span>,<span class="str">"content"</span>:<span class="str">"add Kyoto"</span>})
<span class="fn">save</span>(<span class="str">"user_42"</span>, step + <span class="num">1</span>, state)

<span class="fn">print</span>(<span class="str">"latest step:"</span>, <span class="fn">load_latest</span>(<span class="str">"user_42"</span>)[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"history len:"</span>, <span class="fn">len</span>(<span class="fn">history</span>(<span class="str">"user_42"</span>)))
<span class="fn">print</span>(<span class="str">"messages:"</span>, <span class="fn">load_latest</span>(<span class="str">"user_42"</span>)[<span class="num">1</span>][<span class="str">"messages"</span>][-<span class="num">1</span>])
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Bellek-içi SQLite veritabanında <code>checkpoints(thread_id, step, ts, state_json)</code> tablosu kurar — <code>(thread_id, step)</code> üzerindeki primary key thread başına süper-adım başına bir satırı garanti eder. 2) <code>save(thread_id, step, state)</code> state sözlüğünü <code>json.dumps</code> ile serileştirir ve ekler; <code>load_latest</code> bir thread için en yüksek <code>step</code>'li satırı seçer ve geri parse eder — tam olarak LangGraph'ın checkpointer protokolünü karşılar. 3) <code>history(thread_id)</code> tüm sıralı izi döndürür; gerçek LangGraph'ta <code>app.get_state_history(cfg)</code>'nin üreteceği veriyle aynı. 4) Demo iki tur oynar ve "devam ettirir" — 2. tur <code>load_latest</code>'i çağırır, yeni kullanıcı mesajı ekler ve step+1'de kaydeder; yazdırılan kontroller satır sayacını ve yeniden inşa edilen son mesajı gösterir.</p>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Çok-Adımlı İş Akışı — Planlayıcı / İşçi / Gözden Geçirici</h2>
<p class="l-text">Yaygın bir production grafı: bir <strong>planlayıcı</strong> hedefi adımlara böler, bir <strong>işçi</strong> her adımı yürütür (araç çağrılarıyla) ve bir <strong>gözden geçirici</strong> sonucu yargılar ve ya onaylar ya da revizyon için geri yollar. Bu çok-agent sistemlerinin (ders 8) tohumudur ve Claude Code, Devin ve OpenAI Operator'ı güçlendiren aynı şekildir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Planner -&gt; Worker -&gt; Reviewer state machine</span>
<span class="kw">import</span> random
random.<span class="fn">seed</span>(<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">planner</span>(state):
    goal = state[<span class="str">"goal"</span>]
    steps = [f<span class="str">"research {goal}"</span>, f<span class="str">"draft about {goal}"</span>, f<span class="str">"polish {goal}"</span>]
    <span class="kw">return</span> {<span class="str">"plan"</span>: steps, <span class="str">"step_idx"</span>: <span class="num">0</span>, <span class="str">"results"</span>: []}

<span class="kw">def</span> <span class="fn">worker</span>(state):
    i = state[<span class="str">"step_idx"</span>]
    task = state[<span class="str">"plan"</span>][i]
    <span class="cm"># simulate tool work</span>
    result = f<span class="str">"[done] {task} (q={round(random.uniform(0.6,1.0),2)})"</span>
    <span class="kw">return</span> {<span class="str">"results"</span>: state[<span class="str">"results"</span>] + [result], <span class="str">"step_idx"</span>: i + <span class="num">1</span>}

<span class="kw">def</span> <span class="fn">reviewer</span>(state):
    qs = [<span class="fn">float</span>(r.<span class="fn">split</span>(<span class="str">"q="</span>)[<span class="num">1</span>].<span class="fn">rstrip</span>(<span class="str">")"</span>)) <span class="kw">for</span> r <span class="kw">in</span> state[<span class="str">"results"</span>]]
    avg = <span class="fn">sum</span>(qs) / <span class="fn">len</span>(qs)
    <span class="kw">return</span> {<span class="str">"review_score"</span>: <span class="fn">round</span>(avg, <span class="num">2</span>),
            <span class="str">"approved"</span>: avg &gt;= <span class="num">0.75</span>}

<span class="kw">def</span> <span class="fn">route_after_worker</span>(state):
    <span class="kw">return</span> <span class="str">"worker"</span> <span class="kw">if</span> state[<span class="str">"step_idx"</span>] &lt; <span class="fn">len</span>(state[<span class="str">"plan"</span>]) <span class="kw">else</span> <span class="str">"reviewer"</span>

<span class="kw">def</span> <span class="fn">route_after_reviewer</span>(state):
    <span class="kw">if</span> state[<span class="str">"approved"</span>]: <span class="kw">return</span> <span class="str">"END"</span>
    <span class="kw">if</span> state.<span class="fn">get</span>(<span class="str">"revisions"</span>, <span class="num">0</span>) &gt;= <span class="num">2</span>: <span class="kw">return</span> <span class="str">"END"</span>     <span class="cm"># cap</span>
    <span class="kw">return</span> <span class="str">"planner"</span>

<span class="kw">def</span> <span class="fn">run</span>(goal):
    state = {<span class="str">"goal"</span>: goal, <span class="str">"revisions"</span>: <span class="num">0</span>}
    node, trace = <span class="str">"planner"</span>, []
    <span class="kw">while</span> node != <span class="str">"END"</span>:
        trace.<span class="fn">append</span>(node)
        <span class="kw">if</span>   node == <span class="str">"planner"</span>:  state.<span class="fn">update</span>(<span class="fn">planner</span>(state));  node = <span class="str">"worker"</span>
        <span class="kw">elif</span> node == <span class="str">"worker"</span>:   state.<span class="fn">update</span>(<span class="fn">worker</span>(state));   node = <span class="fn">route_after_worker</span>(state)
        <span class="kw">elif</span> node == <span class="str">"reviewer"</span>:
            state.<span class="fn">update</span>(<span class="fn">reviewer</span>(state))
            nxt = <span class="fn">route_after_reviewer</span>(state)
            <span class="kw">if</span> nxt == <span class="str">"planner"</span>: state[<span class="str">"revisions"</span>] += <span class="num">1</span>
            node = nxt
    <span class="kw">return</span> state, trace

s, t = <span class="fn">run</span>(<span class="str">"LangGraph tutorials"</span>)
<span class="fn">print</span>(<span class="str">"path:"</span>, <span class="str">" -&gt; "</span>.<span class="fn">join</span>(t))
<span class="fn">print</span>(<span class="str">"approved:"</span>, s[<span class="str">"approved"</span>], <span class="str">" score:"</span>, s[<span class="str">"review_score"</span>])
<span class="fn">print</span>(<span class="str">"steps done:"</span>, <span class="fn">len</span>(s[<span class="str">"results"</span>]))
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>planner(state)</code> hedefi okur ve sabit üç-maddelik bir plan (research, draft, polish) artı bir <code>step_idx</code> sayacı ve boş <code>results</code> listesi üretir — gerçek bir planner LLM'in JSON olarak yayacağı açık plan. 2) <code>worker(state)</code> bir plan maddesini çalıştırır, kalite skoruyla sahte sonuç ekler ve <code>step_idx</code>'yi artırır; koşullu <code>route_after_worker</code> her plan maddesi bitene kadar <code>worker</code>'a geri döner, sonra <code>reviewer</code>'a yönlendirir. 3) <code>reviewer(state)</code> adım-başına kalite skorlarını ortalar ve <code>approved = avg &gt;= 0.75</code> yazar; <code>route_after_reviewer</code> onaylanmış trajectory'leri <code>END</code>'e, aksi halde yeni plan için <code>planner</code>'a yollar — <code>revisions &gt;= 2</code> güvenlik kapağıyla. 4) Sürücü gerçek yolu (örn. <code>planner -&gt; worker -&gt; worker -&gt; worker -&gt; reviewer -&gt; END</code>) ve nihai onay durumunu yazdırır — Devin, Claude Code ve OpenAI Operator'un arka planda kullandığı aynı kontrol akışı.</p>
</div>

<div class="lesson-block" id="section-frontier">
<h2 class="lesson-title">2024–2026 Sınırı — MCP, Bilgisayar Kullanımı ve Modern Araç Entegrasyonu</h2>
<p class="l-text"><strong>2026'da araç entegrasyonu artık "fonksiyonunu @tool ile sar" değil.</strong> İki 2024 lansmanı bu dersin desenlerinin üretime nasıl sevk edildiğini yeniden şekillendiriyor. <strong>MCP (Model Context Protocol)</strong> LLM istemcileri ile araç sunucuları arasındaki tel formatını standartlaştırır — LangChain veya LangGraph agent'ınız tek bir araç sarmalayıcısı yazmadan filesystem, GitHub, Postgres, Slack ve Puppeteer sunucularını monte edebilir. <strong>Bilgisayar Kullanımı</strong> Claude'a bir ekran görüntüsü verir ve fare/klavye eylemleri alır — API'si olmayan araçlar için evrensel kaçış kapısı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">MCP — Model Context Protocol (Anthropic, Kas 2024)</div><div class="card-body">stdio veya SSE üzerinde JSON-RPC 2.0. Araçlar, kaynaklar ve istemler birinci sınıf. Lansmanda ~10 referans sunucu (filesystem, GitHub, Postgres, Slack, Memory, Sentry, Puppeteer, Brave Search, AWS, Time). LangChain ve LangGraph 2025'te MCP istemci adaptörlerini sevk eder.</div></div>
<div class="calc-card"><div class="card-title">Bilgisayar Kullanımı (Anthropic, Eki 2024)</div><div class="card-body">Claude 3.5/3.7 Sonnet ekran görüntüsü + ekran boyutu alır, fare koordinatları ve klavye eylemleri döndürür. Lansmanda OSWorld'de ~%14 (insan ~%72'ye karşı). SDK yokken masaüstü / tarayıcı otomasyonu için evrensel API.</div></div>
<div class="calc-card"><div class="card-title">Cursor Composer (Cursor AI, 2024)</div><div class="card-body">Çok-dosyalı ajansal kod editörü — tek bir döngüde repo'da okur, düzenler, test eder. Sınırlı eylem alanı (dosya işlemleri + shell) güvenilir sevk edilmesinin nedeni. "Ajansal IDE"nin nasıl görünmesi gerektiğinin modeli.</div></div>
<div class="calc-card"><div class="card-title">Devin (Cognition, Mar 2024)</div><div class="card-body">Sandbox'lı VM'de otonom SWE ajanı, lansmanda SWE-Bench ~%13.86. "Tamamen otonom mühendis" iddiaları için kanıt noktası (ve uyarı hikayesi) olarak dikkate değer.</div></div>
<div class="calc-card"><div class="card-title">GitHub Copilot Workspace (Nis 2024)</div><div class="card-body">Plan → spec → düzenle → test döngüsü. Bir GitHub issue okur, plan önerir, dosyaları düzenler, CI çalıştırır. Devin fikrinin ana akım kapsamlı sürümü, gerçek GitHub entegrasyonuyla.</div></div>
</div>
<div class="calc-highlight"><strong>Kodunuzu nasıl değiştirir:</strong> 30 LangChain @tool dekoratörü elle yazmak yerine, resmi MCP sunucularını monte edin ve agent'ınızın standart list-tools çağrısı ile onları keşfetmesine izin verin. Elle yazılmış araçları alan-özgü mantığınız için saklayın. API'si olmayan sistemler için Bilgisayar Kullanımı'nı yedek araç olarak ekleyin — agent bir ekran görüntüsü aracı artı click(x,y) ve type(s) alır ve masaüstünü sadece başka bir modalite olarak ele alır.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Katmanını Seçmek</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">DIY (L2-L4) kullan</div><div class="card-body">Hackathon, tek dosyalık demo, öğrenme, ultra-dar token bütçesi, bağımlılık getiremediğin durumlar.</div></div>
<div class="calc-card"><div class="card-title">LangChain kullan</div><div class="card-body">Tek agent, doğrusal ReAct döngüsü, entegrasyon ekosistemini (vektör depoları, doküman yükleyiciler, çıktı ayrıştırıcılar) yazmadan istemek.</div></div>
<div class="calc-card"><div class="card-title">LangGraph kullan</div><div class="card-body">Dallanma, döngüler, paralel iş, kalıcılık/devam, insan-döngüde, çok-agent. Production'a giden her şey.</div></div>
<div class="calc-card"><div class="card-title">Hiçbirini kullanma</div><div class="card-body">"Agent"ın yapılandırılmış bir cevabın izlediği tek araç çağrısıysa, agent'a değil — bir fonksiyona ihtiyacın var. Aşırı-mühendislik yapma.</div></div>
</div>

<div class="calc-highlight">6. derste <strong>hafıza mimarileri</strong>na derinlemesine gireceğiz — zaten kullandığın context-içi scratchpad, uzun-süreli geri çağırma için vektör depo hafızası, sıkıştırma için özet hafızası, episodik olay logları ve Claude Sonnet 4.6'nın 1M-token context penceresinin production agent'larının ileriye taşıyabileceğini nasıl yeniden şekillendirdiği.</div>
</div>`
};
