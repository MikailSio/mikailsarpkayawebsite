window.LANGCHAIN_L9 = {
en: `<p class="l-text"><strong>Hook.</strong> A bare LLM is a brilliant librarian locked in a room — it can talk about anything but cannot look up today's stock price, query your database, or run a calculation. <strong>Agents</strong> hand the LLM a toolbox: web search, calculators, SQL, Python REPL, custom HTTP calls. The model decides which tool to call, reads the result, and decides what to do next. This is the <strong>ReAct</strong> loop — Reason and Act — and it is what turns a chat model into an autonomous worker.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Trace the ReAct loop: Thought → Action → Observation → Final Answer</li>
<li>Define custom tools with the <code>@tool</code> decorator and clear docstring schemas</li>
<li>Build a tool-calling agent with <code>create_tool_calling_agent</code> and <code>AgentExecutor</code></li>
<li>Plug in built-in tools: web search (Tavily), calculator, Python REPL, SQL toolkit</li>
<li>Cap iterations and stop on errors with <code>max_iterations</code> and <code>handle_parsing_errors</code></li>
<li>Choose between LangChain Agents and LangGraph for long-horizon multi-agent flows</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. The ReAct loop</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Thought:</strong> "User asks for the average order value. I should query the orders DB."</div>
<div class="calc-step"><strong>Action:</strong> <code>sql_tool("SELECT AVG(amount) FROM orders WHERE year=2025")</code></div>
<div class="calc-step"><strong>Observation:</strong> <code>{ "avg_amount": 124.50 }</code></div>
<div class="calc-step"><strong>Thought:</strong> "That's the answer." → return final answer.</div>
</div>
<p class="l-text">The loop continues until the model emits a "final answer" or hits <code>max_iterations</code>. Modern providers (OpenAI, Anthropic) implement this natively as <strong>function calling</strong> / <strong>tool use</strong>, so the loop is fast and structured.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Built-in tools you actually use</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Tool</div><div>Use</div></div>
<div class="cmp-row"><div>SerpAPI / Tavily / DuckDuckGo</div><div>Web search</div></div>
<div class="cmp-row"><div>Calculator (LLMMathChain)</div><div>Arithmetic the LLM gets wrong on its own</div></div>
<div class="cmp-row"><div>Python REPL</div><div>Run code on the fly (sandbox carefully!)</div></div>
<div class="cmp-row"><div>SQLDatabaseToolkit</div><div>Schema-aware querying</div></div>
<div class="cmp-row"><div>Requests</div><div>Generic HTTP — wrap your own APIs</div></div>
<div class="cmp-row"><div>VectorStore retriever as tool</div><div>RAG inside an agent</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Custom @tool — the easiest pattern</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">get_review_count</span>(product: <span class="ty">str</span>) -> <span class="ty">int</span>:
    <span class="str">"""Return the number of reviews for a given product code."""</span>
    counts = {<span class="str">"X1"</span>: <span class="num">1320</span>, <span class="str">"X2"</span>: <span class="num">870</span>, <span class="str">"X3"</span>: <span class="num">2105</span>}
    <span class="kw">return</span> counts.<span class="fn">get</span>(product.<span class="fn">upper</span>(), <span class="num">0</span>)

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">avg_rating</span>(product: <span class="ty">str</span>) -> <span class="ty">float</span>:
    <span class="str">"""Return the average star rating for a given product."""</span>
    ratings = {<span class="str">"X1"</span>: <span class="num">4.3</span>, <span class="str">"X2"</span>: <span class="num">3.9</span>, <span class="str">"X3"</span>: <span class="num">2.7</span>}
    <span class="kw">return</span> ratings.<span class="fn">get</span>(product.<span class="fn">upper</span>(), <span class="num">0.0</span>)

<span class="fn">print</span>(get_review_count.<span class="fn">invoke</span>({<span class="str">"product"</span>: <span class="str">"X3"</span>}))   <span class="cm"># 2105</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`@tool\` (or \`StructuredTool.from_function\`) turns a plain Python function into a \`BaseTool\` LangChain can advertise to an LLM. 2) The function's docstring becomes the tool description the model reads; type hints become the JSON schema for arguments — write both carefully. 3) Tools are passed to the model via \`model.bind_tools([t1, t2, ...])\` so the LLM can emit structured \`tool_calls\` in its response. 4) The runtime (agent executor or your own loop) parses the tool call, runs the Python function, and feeds the result back as a \`ToolMessage\` for the next LLM turn.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A @tool is a callable + a docstring + a JSON-Schema-like signature. Build it with a tiny class so you can inspect every field LangChain extracts.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Hand-rolled @tool
import inspect

class Tool:
    def __init__(self, fn):
        self.fn = fn
        self.name = fn.__name__
        self.doc  = (fn.__doc__ or "").strip()
        self.sig  = str(inspect.signature(fn))
    def invoke(self, kwargs):
        return self.fn(**kwargs)
    def __repr__(self):
        return f"Tool({self.name}{self.sig}: {self.doc[:40]}...)"

def get_review_count(product: str) -> int:
    """Return the number of reviews for a given product code."""
    return {"X1": 1320, "X2": 870, "X3": 2105}.get(product.upper(), 0)

def avg_rating(product: str) -> float:
    """Return the average star rating for a given product."""
    return {"X1": 4.3, "X2": 3.9, "X3": 2.7}.get(product.upper(), 0.0)

tools = [Tool(get_review_count), Tool(avg_rating)]
for t in tools:
    print(t)
print()
print(tools[0].invoke({"product": "X3"}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`@tool\` (or \`StructuredTool.from_function\`) turns a plain Python function into a \`BaseTool\` LangChain can advertise to an LLM. 2) The function's docstring becomes the tool description the model reads; type hints become the JSON schema for arguments — write both carefully. 3) Tools are passed to the model via \`model.bind_tools([t1, t2, ...])\` so the LLM can emit structured \`tool_calls\` in its response. 4) The runtime (agent executor or your own loop) parses the tool call, runs the Python function, and feeds the result back as a \`ToolMessage\` for the next LLM turn.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Wiring an agent</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain.agents <span class="kw">import</span> create_tool_calling_agent, AgentExecutor
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate, MessagesPlaceholder

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
tools = [get_review_count, avg_rating]

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"You are a product analyst. Use tools to answer; "</span>
               <span class="str">"if a tool fails, try a different angle."</span>),
    (<span class="str">"human"</span>, <span class="str">"{input}"</span>),
    <span class="fn">MessagesPlaceholder</span>(<span class="str">"agent_scratchpad"</span>)
])

agent = <span class="fn">create_tool_calling_agent</span>(llm, tools, prompt)
executor = <span class="fn">AgentExecutor</span>(
    agent=agent, tools=tools,
    max_iterations=<span class="num">4</span>, verbose=<span class="kw">True</span>,
    handle_parsing_errors=<span class="kw">True</span>
)

<span class="fn">print</span>(executor.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"Compare X1 and X3 — count and avg rating."</span>}))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) \`create_tool_calling_agent\` (or \`create_react_agent\`) bundles a model, prompt, and tool list into an agent that can iterate. 2) \`AgentExecutor(agent=..., tools=..., max_iterations=N)\` is the runtime: it runs the loop — model decides → tool runs → observation → model decides — until the agent emits a final answer. 3) \`executor.invoke({'input': '...'})\` returns a dict with the final output and an \`intermediate_steps\` log of every tool call. 4) Set \`max_iterations\` and \`early_stopping_method='generate'\` to bound cost; pair with LangSmith tracing to debug what the model picked at each step.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">An AgentExecutor with max_iterations is a while-loop with a counter. Implement the ReAct loop manually: keyword-route to a tool, append the observation to a scratchpad, loop until "final answer".</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Manual ReAct loop with two tools
TOOLS = {
    "get_review_count": lambda product: {"X1":1320,"X2":870,"X3":2105}.get(product.upper(),0),
    "avg_rating":       lambda product: {"X1":4.3, "X2":3.9,"X3":2.7 }.get(product.upper(),0.0),
}

def fake_planner(question, scratchpad):
    # Return either ("call", name, args) or ("final", text)
    products = [p for p in ["X1","X2","X3"] if p in question]
    needed = [(t, p) for p in products for t in TOOLS if t not in scratchpad.get(p, set())]
    if needed:
        tool, product = needed[0]
        return ("call", tool, {"product": product})
    parts = [f"{p}: count={scratchpad[p]['get_review_count']}, rating={scratchpad[p]['avg_rating']}"
             for p in products]
    return ("final", " | ".join(parts))

def run_agent(question, max_iterations=6):
    scratchpad = {}
    for step in range(max_iterations):
        action = fake_planner(question, scratchpad)
        if action[0] == "final":
            return action[1]
        _, tool, args = action
        result = TOOLS[tool](**args)
        scratchpad.setdefault(args["product"], {})[tool] = result
        print(f"  step {step+1}: {tool}({args}) -> {result}")
    return "(max iterations reached)"

print(run_agent("Compare X1 and X3 — count and avg rating."))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Implements the ReAct (Reasoning + Acting) pattern: at each turn the model emits a \`Thought:\` (chain-of-thought), then an \`Action:\` (tool name + args), then waits for an \`Observation:\`. 2) The runtime parses the action, executes the matching tool, and appends the observation back to the conversation — the next LLM turn sees everything. 3) Loop continues until the model outputs \`Final Answer:\` (or you hit \`max_iterations\`). 4) Modern providers (OpenAI, Anthropic) replaced text-formatted ReAct with native \`tool_calls\` JSON, but the control loop is identical — Thought → Action → Observation, repeat.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Real example — agent over df_orders (runnable scaffold)</h2>
<p class="l-text">Below we build the underlying tools that an SQL agent would use, with real pandas operations. In production you swap pandas for <code>SQLDatabaseToolkit</code> against a real DB, but the tool surface is identical.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

df_orders = pd.<span class="fn">DataFrame</span>({
    <span class="str">"order_id"</span>: <span class="fn">range</span>(<span class="num">1001</span>, <span class="num">1021</span>),
    <span class="str">"product"</span>:  [<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>,<span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>,<span class="str">"X2"</span>,<span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X2"</span>,
                 <span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X2"</span>,<span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>,<span class="str">"X2"</span>,<span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>],
    <span class="str">"amount"</span>:   np.<span class="fn">round</span>(np.random.<span class="fn">RandomState</span>(<span class="num">7</span>).<span class="fn">gamma</span>(<span class="num">2</span>, <span class="num">50</span>, size=<span class="num">20</span>), <span class="num">2</span>),
    <span class="str">"country"</span>:  [<span class="str">"TR"</span>,<span class="str">"DE"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"FR"</span>,<span class="str">"DE"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"DE"</span>,
                 <span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"FR"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"DE"</span>,<span class="str">"FR"</span>,<span class="str">"TR"</span>,<span class="str">"DE"</span>]
})

<span class="cm"># These functions become @tool's in production</span>
<span class="kw">def</span> <span class="fn">total_revenue_by_product</span>(product: <span class="ty">str</span>) -> <span class="ty">float</span>:
    <span class="kw">return</span> <span class="fn">float</span>(df_orders.loc[df_orders[<span class="str">"product"</span>] == product, <span class="str">"amount"</span>].<span class="fn">sum</span>())

<span class="kw">def</span> <span class="fn">top_country_for</span>(product: <span class="ty">str</span>) -> <span class="ty">str</span>:
    sub = df_orders[df_orders[<span class="str">"product"</span>] == product]
    <span class="kw">if</span> sub.empty: <span class="kw">return</span> <span class="str">"none"</span>
    <span class="kw">return</span> sub[<span class="str">"country"</span>].<span class="fn">value_counts</span>().<span class="fn">idxmax</span>()

<span class="kw">def</span> <span class="fn">order_count</span>(product: <span class="ty">str</span>) -> <span class="ty">int</span>:
    <span class="kw">return</span> <span class="fn">int</span>((df_orders[<span class="str">"product"</span>] == product).<span class="fn">sum</span>())

<span class="cm"># Simulate the agent's reasoning manually</span>
question = <span class="str">"Which product has highest revenue and where does it sell most?"</span>
revenues = {p: <span class="fn">total_revenue_by_product</span>(p) <span class="kw">for</span> p <span class="kw">in</span> [<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>]}
best = <span class="fn">max</span>(revenues, key=revenues.get)
country = <span class="fn">top_country_for</span>(best)
<span class="fn">print</span>(f<span class="str">"Q: {question}"</span>)
<span class="fn">print</span>(f<span class="str">"Tool calls -> revenues={revenues}, top_country({best})={country}"</span>)
<span class="fn">print</span>(f<span class="str">"A: {best} earned $ {revenues[best]:.2f}, mainly in {country}."</span>)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a small <code>df_orders</code> DataFrame so the example runs without a real database — same column shape as a typical orders table. 2) <code>total_revenue_by_product</code>, <code>top_country_for</code>, and <code>order_count</code> are pure functions over the frame — promote them to <code>@tool</code> and you have your tool surface. 3) The block under "Simulate the agent's reasoning manually" plays the LLM's role: compute revenues for each product, pick the maximum, then ask <code>top_country_for(best)</code>. 4) The printed lines mirror what an <code>AgentExecutor</code> would emit in <code>intermediate_steps</code>: which tools fired with which arguments, then a final synthesised answer.</p>
<p class="l-text"><strong>What it does:</strong> a deterministic stand-in for the agent — same shape (tool calls + final synthesis), but no LLM needed. In production, the LLM picks the order of calls itself.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. SQL agent (demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.utilities <span class="kw">import</span> SQLDatabase
<span class="kw">from</span> langchain_community.agent_toolkits <span class="kw">import</span> create_sql_agent

db = SQLDatabase.<span class="fn">from_uri</span>(<span class="str">"postgresql://user:pw@host/orders_db"</span>)
sql_agent = <span class="fn">create_sql_agent</span>(
    llm=<span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>, temperature=<span class="num">0</span>),
    db=db, agent_type=<span class="str">"tool-calling"</span>, verbose=<span class="kw">True</span>
)
<span class="fn">print</span>(sql_agent.<span class="fn">invoke</span>(
    {<span class="str">"input"</span>: <span class="str">"Total revenue per country in 2025, sorted descending."</span>}
))
<span class="cm"># Agent inspects the schema, writes SQL, runs it, then explains.</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>SQLDatabase.from_uri(...)</code> introspects the live database — table names, columns, sample rows — and exposes them as <code>db.run(sql)</code>. 2) <code>create_sql_agent(llm=..., db=..., agent_type="tool-calling")</code> bundles a schema-aware system prompt with four tools (<code>sql_db_list_tables</code>, <code>sql_db_schema</code>, <code>sql_db_query_checker</code>, <code>sql_db_query</code>). 3) <code>sql_agent.invoke({"input": "..."})</code> runs the ReAct loop: list tables → inspect schema → draft SQL → validate → execute → explain. 4) <code>verbose=True</code> prints every step so you can audit the generated SQL before trusting it in production.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SQL agent = schema-aware string templating + execute. Use the preamble's run_sql() helper against the orders table. Includes a safety filter that rejects DROP / DELETE — exactly what a production guardrail does.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mini SQL "agent" with a guardrail
DENY = ["drop", "delete", "truncate", "update", "alter", "insert"]

def safe_sql(sql):
    low = sql.lower()
    if any(k in low for k in DENY):
        raise PermissionError(f"blocked write op in: {sql[:60]}")
    return run_sql(sql)

def planner(question):
    # Tiny "schema-aware" template router
    if "country" in question.lower() and "revenue" in question.lower():
        return "SELECT country, SUM(amount) AS rev FROM orders GROUP BY country ORDER BY rev DESC"
    if "average" in question.lower() and "order" in question.lower():
        return "SELECT AVG(amount) AS avg_amount FROM orders"
    return "SELECT COUNT(*) AS n FROM orders"

for q in ["Total revenue per country, sorted descending.",
          "What is the average order amount?",
          "Drop all orders please"]:
    sql = planner(q)
    print(f"Q: {q}\nSQL: {sql}")
    try:
        print(safe_sql(sql).head(3).to_string(index=False))
    except PermissionError as e:
        print(f"GUARDRAIL: {e}")
    print()</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>DENY</code> lists destructive SQL verbs; <code>safe_sql</code> rejects any query that contains one before it ever reaches the database — the same gate <code>SQLDatabaseToolkit</code> recommends in production. 2) <code>planner(question)</code> stands in for the LLM: a tiny keyword-driven template router that returns the SQL it would have generated. 3) The loop runs three queries — two safe analytics and one destructive — to demonstrate the guardrail firing on the third without touching the table. 4) Swap <code>planner</code> for an LLM call and <code>safe_sql</code> for <code>db.run</code> + the same deny list, and you have a minimal but defensible SQL agent.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Anti-patterns and guardrails</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">No max_iterations</div><div class="calc-card-desc">Agent loops forever burning tokens. Always cap to 5-10.</div></div>
<div class="calc-card"><div class="calc-card-title">Open Python REPL</div><div class="calc-card-desc">Sandbox or restrict imports — never expose os/subprocess in production.</div></div>
<div class="calc-card"><div class="calc-card-title">Vague tool docstrings</div><div class="calc-card-desc">"Does stuff" → LLM picks wrong tool. Be explicit about input/output.</div></div>
<div class="calc-card"><div class="calc-card-title">No retry on tool error</div><div class="calc-card-desc">Wrap tools with try/except + return user-friendly error string.</div></div>
<div class="calc-card"><div class="calc-card-title">Mixing read and write</div><div class="calc-card-desc">Add explicit confirmation step before any mutation.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Agent vs plain RAG vs simple chain — when to use what</h2>
<div id="lc-l9-when-en" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var cats=['simple chain','RAG','SQL agent','full ReAct agent'];
  var lat =[0.6, 1.0, 2.4, 4.5];
  var rel =[55, 80, 88, 92];
  var cost=[1, 1.5, 4, 7];
  var data=[
    {type:'bar',name:'avg latency (s)',x:cats,y:lat,marker:{color:T},yaxis:'y'},
    {type:'bar',name:'reliability (%)',x:cats,y:rel,marker:{color:'#888'},yaxis:'y2'},
    {type:'bar',name:'cost x',x:cats,y:cost,marker:{color:'#444'},yaxis:'y'}
  ];
  var layout={
    barmode:'group',margin:{l:60,r:60,t:30,b:60},
    yaxis:{title:'latency (s) / cost (x)'},
    yaxis2:{title:'reliability (%)',overlaying:'y',side:'right',range:[0,100]},
    legend:{orientation:'h',y:-0.18,x:0.5,xanchor:'center'},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l9-when-en',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Next</h2>
<p class="l-text">L10 returns to RAG with the <strong>advanced toolbox</strong> — rerankers, multi-query, HyDE, parent-document, self-querying — and how to evaluate it all with RAGAS.</p>
</div>
`,
tr: `<p class="l-text"><strong>Giriş.</strong> Çıplak bir LLM, odaya kilitlenmiş parlak bir kütüphaneci gibidir — her şey hakkında konuşabilir ama bugünkü hisse fiyatını bakamaz, veritabanınızı sorgulayamaz, hesap çalıştıramaz. <strong>Agent'lar</strong> LLM'e bir alet kutusu verir: web araması, hesap makinesi, SQL, Python REPL, özel HTTP çağrıları. Model hangi aracı çağıracağına karar verir, sonucu okur ve sırada ne yapacağına karar verir. Bu <strong>ReAct</strong> döngüsüdür — Reason and Act — ve sohbet modelini özerk bir işçiye dönüştüren şeydir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>ReAct döngüsünü izlemeyi: Düşünce → Eylem → Gözlem → Nihai Cevap</li>
<li><code>@tool</code> dekoratörü ve net docstring şemalarıyla özel araçlar tanımlamayı</li>
<li><code>create_tool_calling_agent</code> ve <code>AgentExecutor</code> ile tool-calling agent kurmayı</li>
<li>Yerleşik araçları takmayı: web araması (Tavily), hesap makinesi, Python REPL, SQL toolkit</li>
<li>Iterasyonları sınırlamayı ve hatalarda durmayı: <code>max_iterations</code> ve <code>handle_parsing_errors</code></li>
<li>Uzun ufuklu çok-agent akışlar için LangChain Agents ile LangGraph arasında seçim yapmayı</li>
</ul>
</div>

<div class="lesson-block">
<h2 class="lesson-title">1. ReAct döngüsü</h2>
<div class="calc-steps">
<div class="calc-step"><strong>Thought:</strong> "Kullanıcı ortalama sipariş değerini soruyor. Sipariş DB'sini sorgulamalıyım."</div>
<div class="calc-step"><strong>Action:</strong> <code>sql_tool("SELECT AVG(amount) FROM orders WHERE year=2025")</code></div>
<div class="calc-step"><strong>Observation:</strong> <code>{ "avg_amount": 124.50 }</code></div>
<div class="calc-step"><strong>Thought:</strong> "Cevap bu." → final answer döndür.</div>
</div>
<p class="l-text">Döngü model "final answer" üretene veya <code>max_iterations</code>'a çarpana kadar sürer. Modern sağlayıcılar (OpenAI, Anthropic) bunu yerel olarak <strong>function calling</strong> / <strong>tool use</strong> olarak uygular, böylece döngü hızlı ve yapılı olur.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">2. Gerçekten kullandığınız hazır araçlar</h2>
<div class="calc-compare">
<div class="cmp-row cmp-head"><div>Araç</div><div>Kullanım</div></div>
<div class="cmp-row"><div>SerpAPI / Tavily / DuckDuckGo</div><div>Web araması</div></div>
<div class="cmp-row"><div>Calculator (LLMMathChain)</div><div>LLM'in tek başına yanlış yaptığı aritmetik</div></div>
<div class="cmp-row"><div>Python REPL</div><div>Anında kod çalıştır (dikkatli sandbox!)</div></div>
<div class="cmp-row"><div>SQLDatabaseToolkit</div><div>Şema farkındalı sorgulama</div></div>
<div class="cmp-row"><div>Requests</div><div>Genel HTTP — kendi API'lerini sar</div></div>
<div class="cmp-row"><div>VectorStore retriever as tool</div><div>Agent içinde RAG</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">3. Özel @tool — en kolay desen</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_core.tools <span class="kw">import</span> tool

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">get_review_count</span>(product: <span class="ty">str</span>) -> <span class="ty">int</span>:
    <span class="str">"""Verilen ürün koduna ait yorum sayısını döndürür."""</span>
    counts = {<span class="str">"X1"</span>: <span class="num">1320</span>, <span class="str">"X2"</span>: <span class="num">870</span>, <span class="str">"X3"</span>: <span class="num">2105</span>}
    <span class="kw">return</span> counts.<span class="fn">get</span>(product.<span class="fn">upper</span>(), <span class="num">0</span>)

<span class="at">@tool</span>
<span class="kw">def</span> <span class="fn">avg_rating</span>(product: <span class="ty">str</span>) -> <span class="ty">float</span>:
    <span class="str">"""Verilen ürünün ortalama yıldız puanını döndürür."""</span>
    ratings = {<span class="str">"X1"</span>: <span class="num">4.3</span>, <span class="str">"X2"</span>: <span class="num">3.9</span>, <span class="str">"X3"</span>: <span class="num">2.7</span>}
    <span class="kw">return</span> ratings.<span class="fn">get</span>(product.<span class="fn">upper</span>(), <span class="num">0.0</span>)

<span class="fn">print</span>(get_review_count.<span class="fn">invoke</span>({<span class="str">"product"</span>: <span class="str">"X3"</span>}))   <span class="cm"># 2105</span></code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) \`@tool\` (veya \`StructuredTool.from_function\`) sıradan bir Python fonksiyonunu LangChain'in LLM'e tanıtabileceği bir \`BaseTool\`'a dönüştürür. 2) Fonksiyonun docstring'i modelin okuduğu tool açıklaması olur; type hint'ler argümanlar için JSON şeması olur — ikisini de dikkatli yazın. 3) Tool'lar \`model.bind_tools([t1, t2, ...])\` ile modele geçirilir; LLM yanıtında structured \`tool_calls\` üretebilir. 4) Runtime (agent executor veya kendi döngünüz) tool çağrısını parse eder, Python fonksiyonunu çalıştırır ve sonucu bir sonraki LLM turu için \`ToolMessage\` olarak geri besler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">@tool, callable + docstring + JSON-Schema-benzeri imzadan ibarettir. Minik bir sınıfla inşa et; LangChain'in çıkardığı her alanı incele.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># El yapımı @tool
import inspect

class Tool:
    def __init__(self, fn):
        self.fn = fn
        self.name = fn.__name__
        self.doc  = (fn.__doc__ or "").strip()
        self.sig  = str(inspect.signature(fn))
    def invoke(self, kwargs):
        return self.fn(**kwargs)
    def __repr__(self):
        return f"Tool({self.name}{self.sig}: {self.doc[:40]}...)"

def get_review_count(product: str) -> int:
    """Verilen ürün koduna ait yorum sayısını döndürür."""
    return {"X1": 1320, "X2": 870, "X3": 2105}.get(product.upper(), 0)

def avg_rating(product: str) -> float:
    """Verilen ürünün ortalama yıldız puanını döndürür."""
    return {"X1": 4.3, "X2": 3.9, "X3": 2.7}.get(product.upper(), 0.0)

tools = [Tool(get_review_count), Tool(avg_rating)]
for t in tools:
    print(t)
print()
print(tools[0].invoke({"product": "X3"}))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) \`@tool\` (veya \`StructuredTool.from_function\`) sıradan bir Python fonksiyonunu LangChain'in LLM'e tanıtabileceği bir \`BaseTool\`'a dönüştürür. 2) Fonksiyonun docstring'i modelin okuduğu tool açıklaması olur; type hint'ler argümanlar için JSON şeması olur — ikisini de dikkatli yazın. 3) Tool'lar \`model.bind_tools([t1, t2, ...])\` ile modele geçirilir; LLM yanıtında structured \`tool_calls\` üretebilir. 4) Runtime (agent executor veya kendi döngünüz) tool çağrısını parse eder, Python fonksiyonunu çalıştırır ve sonucu bir sonraki LLM turu için \`ToolMessage\` olarak geri besler.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">4. Agent kurulumu</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_openai <span class="kw">import</span> ChatOpenAI
<span class="kw">from</span> langchain.agents <span class="kw">import</span> create_tool_calling_agent, AgentExecutor
<span class="kw">from</span> langchain_core.prompts <span class="kw">import</span> ChatPromptTemplate, MessagesPlaceholder

llm = <span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o-mini"</span>, temperature=<span class="num">0</span>)
tools = [get_review_count, avg_rating]

prompt = ChatPromptTemplate.<span class="fn">from_messages</span>([
    (<span class="str">"system"</span>, <span class="str">"Bir ürün analistisin. Yanıtlamak için araçları kullan; "</span>
               <span class="str">"bir araç başarısız olursa farklı bir açıdan dene."</span>),
    (<span class="str">"human"</span>, <span class="str">"{input}"</span>),
    <span class="fn">MessagesPlaceholder</span>(<span class="str">"agent_scratchpad"</span>)
])

agent = <span class="fn">create_tool_calling_agent</span>(llm, tools, prompt)
executor = <span class="fn">AgentExecutor</span>(
    agent=agent, tools=tools,
    max_iterations=<span class="num">4</span>, verbose=<span class="kw">True</span>,
    handle_parsing_errors=<span class="kw">True</span>
)

<span class="fn">print</span>(executor.<span class="fn">invoke</span>({<span class="str">"input"</span>: <span class="str">"X1 ile X3'ü karşılaştır — sayı ve ortalama puan."</span>}))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) \`create_tool_calling_agent\` (veya \`create_react_agent\`) bir model, prompt ve tool listesini iterate edebilen bir agent içine paketler. 2) \`AgentExecutor(agent=..., tools=..., max_iterations=N)\` runtime'dır: döngüyü çalıştırır — model karar verir → tool çalışır → gözlem → model karar verir — agent nihai yanıtı üretene kadar. 3) \`executor.invoke({'input': '...'})\` nihai çıktı ve her tool çağrısının \`intermediate_steps\` log'unu içeren bir dict döndürür. 4) Maliyeti sınırlamak için \`max_iterations\` ve \`early_stopping_method='generate'\` ayarlayın; modelin her adımda ne seçtiğini debug için LangSmith tracing ile eşleştirin.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">max_iterations'lı bir AgentExecutor, sayaçlı bir while döngüsüdür. ReAct döngüsünü manuel uygula: anahtar kelimeyle bir araca yönlendir, gözlemi scratchpad'e ekle, "final answer"a kadar dön.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># İki araçlı manuel ReAct döngüsü
TOOLS = {
    "get_review_count": lambda product: {"X1":1320,"X2":870,"X3":2105}.get(product.upper(),0),
    "avg_rating":       lambda product: {"X1":4.3, "X2":3.9,"X3":2.7 }.get(product.upper(),0.0),
}

def fake_planner(question, scratchpad):
    # ("call", name, args) veya ("final", text) döndürür
    products = [p for p in ["X1","X2","X3"] if p in question]
    needed = [(t, p) for p in products for t in TOOLS if t not in scratchpad.get(p, set())]
    if needed:
        tool, product = needed[0]
        return ("call", tool, {"product": product})
    parts = [f"{p}: sayı={scratchpad[p]['get_review_count']}, puan={scratchpad[p]['avg_rating']}"
             for p in products]
    return ("final", " | ".join(parts))

def run_agent(question, max_iterations=6):
    scratchpad = {}
    for step in range(max_iterations):
        action = fake_planner(question, scratchpad)
        if action[0] == "final":
            return action[1]
        _, tool, args = action
        result = TOOLS[tool](**args)
        scratchpad.setdefault(args["product"], {})[tool] = result
        print(f"  adım {step+1}: {tool}({args}) -> {result}")
    return "(max iterations)"

print(run_agent("X1 ile X3'ü karşılaştır — sayı ve ortalama puan."))</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) ReAct (Reasoning + Acting) desenini uygular: her turda model bir \`Thought:\` (chain-of-thought), sonra \`Action:\` (tool adı + argümanlar), sonra bir \`Observation:\` bekler. 2) Runtime action'ı parse eder, eşleşen tool'u çalıştırır ve gözlemi konuşmaya geri ekler — bir sonraki LLM turu her şeyi görür. 3) Döngü model \`Final Answer:\` üretene kadar (veya \`max_iterations\`'a ulaşana kadar) sürer. 4) Modern sağlayıcılar (OpenAI, Anthropic) metin-formatlı ReAct'ı native \`tool_calls\` JSON ile değiştirdi ama kontrol döngüsü aynı — Thought → Action → Observation, tekrar.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">5. Gerçek örnek — df_orders üzerinde agent (çalışan iskelet)</h2>
<p class="l-text">Aşağıda bir SQL agent'ın kullanacağı altyapı araçlarını gerçek pandas işlemleriyle kuruyoruz. Üretimde pandas'ı gerçek bir DB'ye karşı <code>SQLDatabaseToolkit</code> ile değiştirirsiniz, ama araç yüzeyi aynıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">import</span> numpy <span class="kw">as</span> np

df_orders = pd.<span class="fn">DataFrame</span>({
    <span class="str">"order_id"</span>: <span class="fn">range</span>(<span class="num">1001</span>, <span class="num">1021</span>),
    <span class="str">"product"</span>:  [<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>,<span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>,<span class="str">"X2"</span>,<span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X2"</span>,
                 <span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X2"</span>,<span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>,<span class="str">"X2"</span>,<span class="str">"X1"</span>,<span class="str">"X3"</span>,<span class="str">"X3"</span>],
    <span class="str">"amount"</span>:   np.<span class="fn">round</span>(np.random.<span class="fn">RandomState</span>(<span class="num">7</span>).<span class="fn">gamma</span>(<span class="num">2</span>, <span class="num">50</span>, size=<span class="num">20</span>), <span class="num">2</span>),
    <span class="str">"country"</span>:  [<span class="str">"TR"</span>,<span class="str">"DE"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"FR"</span>,<span class="str">"DE"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"DE"</span>,
                 <span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"FR"</span>,<span class="str">"TR"</span>,<span class="str">"TR"</span>,<span class="str">"DE"</span>,<span class="str">"FR"</span>,<span class="str">"TR"</span>,<span class="str">"DE"</span>]
})

<span class="cm"># Bu fonksiyonlar üretimde @tool olur</span>
<span class="kw">def</span> <span class="fn">total_revenue_by_product</span>(product: <span class="ty">str</span>) -> <span class="ty">float</span>:
    <span class="kw">return</span> <span class="fn">float</span>(df_orders.loc[df_orders[<span class="str">"product"</span>] == product, <span class="str">"amount"</span>].<span class="fn">sum</span>())

<span class="kw">def</span> <span class="fn">top_country_for</span>(product: <span class="ty">str</span>) -> <span class="ty">str</span>:
    sub = df_orders[df_orders[<span class="str">"product"</span>] == product]
    <span class="kw">if</span> sub.empty: <span class="kw">return</span> <span class="str">"none"</span>
    <span class="kw">return</span> sub[<span class="str">"country"</span>].<span class="fn">value_counts</span>().<span class="fn">idxmax</span>()

<span class="kw">def</span> <span class="fn">order_count</span>(product: <span class="ty">str</span>) -> <span class="ty">int</span>:
    <span class="kw">return</span> <span class="fn">int</span>((df_orders[<span class="str">"product"</span>] == product).<span class="fn">sum</span>())

<span class="cm"># Agent'in akıl yürütmesini elle simüle edelim</span>
question = <span class="str">"Hangi ürün en yüksek geliri elde ediyor ve en çok nereye satıyor?"</span>
revenues = {p: <span class="fn">total_revenue_by_product</span>(p) <span class="kw">for</span> p <span class="kw">in</span> [<span class="str">"X1"</span>,<span class="str">"X2"</span>,<span class="str">"X3"</span>]}
best = <span class="fn">max</span>(revenues, key=revenues.get)
country = <span class="fn">top_country_for</span>(best)
<span class="fn">print</span>(f<span class="str">"S: {question}"</span>)
<span class="fn">print</span>(f<span class="str">"Tool çağrıları -> gelirler={revenues}, top_country({best})={country}"</span>)
<span class="fn">print</span>(f<span class="str">"C: {best} $ {revenues[best]:.2f} kazandı, çoğunlukla {country}."</span>)</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Örneğin gerçek bir veritabanı olmadan çalışması için küçük bir <code>df_orders</code> DataFrame'i kurar — tipik bir siparişler tablosuyla aynı sütun şekli. 2) <code>total_revenue_by_product</code>, <code>top_country_for</code> ve <code>order_count</code> frame üzerinde saf fonksiyonlardır — bunları <code>@tool</code> ile süsleyin, araç yüzeyiniz hazır. 3) "Agent'in akıl yürütmesini elle simüle edelim" bloğu LLM'in rolünü oynar: her ürün için geliri hesapla, maksimumu seç, sonra <code>top_country_for(best)</code> sor. 4) Basılan satırlar bir <code>AgentExecutor</code>'ün <code>intermediate_steps</code>'te üreteceği şeyi yansıtır: hangi araçlar hangi argümanlarla çağrıldı ve nihai sentezlenmiş cevap.</p>
<p class="l-text"><strong>Ne yapar:</strong> agent yerine deterministik bir taklit — aynı şekil (tool çağrıları + sentez), ama LLM gerekmez. Üretimde LLM çağrı sırasını kendi seçer.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">6. SQL agent (demo)</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> langchain_community.utilities <span class="kw">import</span> SQLDatabase
<span class="kw">from</span> langchain_community.agent_toolkits <span class="kw">import</span> create_sql_agent

db = SQLDatabase.<span class="fn">from_uri</span>(<span class="str">"postgresql://user:pw@host/orders_db"</span>)
sql_agent = <span class="fn">create_sql_agent</span>(
    llm=<span class="fn">ChatOpenAI</span>(model=<span class="str">"gpt-4o"</span>, temperature=<span class="num">0</span>),
    db=db, agent_type=<span class="str">"tool-calling"</span>, verbose=<span class="kw">True</span>
)
<span class="fn">print</span>(sql_agent.<span class="fn">invoke</span>(
    {<span class="str">"input"</span>: <span class="str">"2025'te ülke başına toplam gelir, azalan sırada."</span>}
))
<span class="cm"># Agent şemayı inceler, SQL yazar, çalıştırır, sonra açıklar.</span></code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>SQLDatabase.from_uri(...)</code> canlı veritabanını inceler — tablo adları, sütunlar, örnek satırlar — ve <code>db.run(sql)</code> olarak sunar. 2) <code>create_sql_agent(llm=..., db=..., agent_type="tool-calling")</code> şema farkındalı bir system prompt ile dört tool'u (<code>sql_db_list_tables</code>, <code>sql_db_schema</code>, <code>sql_db_query_checker</code>, <code>sql_db_query</code>) bir araya getirir. 3) <code>sql_agent.invoke({"input": "..."})</code> ReAct döngüsünü çalıştırır: tabloları listele → şemayı incele → SQL taslakla → doğrula → çalıştır → açıkla. 4) <code>verbose=True</code> her adımı basar; üretimde güvenmeden önce üretilen SQL'i denetleyebilirsiniz.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SQL agent = şema farkındalı string template + execute. Preamble'daki run_sql() yardımcısını orders tablosunda kullan. DROP / DELETE'i reddeden güvenlik filtresi içerir — üretim guardrail'inin yaptığının aynısı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mini SQL "agent" + guardrail
DENY = ["drop", "delete", "truncate", "update", "alter", "insert"]

def safe_sql(sql):
    low = sql.lower()
    if any(k in low for k in DENY):
        raise PermissionError(f"yazma engellendi: {sql[:60]}")
    return run_sql(sql)

def planner(question):
    # Minik "şema farkındalı" template router
    if "ülke" in question.lower() and "gelir" in question.lower():
        return "SELECT country, SUM(amount) AS rev FROM orders GROUP BY country ORDER BY rev DESC"
    if "ortalama" in question.lower() and "sipariş" in question.lower():
        return "SELECT AVG(amount) AS avg_amount FROM orders"
    return "SELECT COUNT(*) AS n FROM orders"

for q in ["Ülke başına toplam gelir, azalan sırada.",
          "Ortalama sipariş tutarı nedir?",
          "Lütfen tüm siparişleri sil"]:
    sql = planner(q)
    print(f"S: {q}\nSQL: {sql}")
    try:
        print(safe_sql(sql).head(3).to_string(index=False))
    except PermissionError as e:
        print(f"GUARDRAIL: {e}")
    print()</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>DENY</code> yıkıcı SQL fiilleri listeler; <code>safe_sql</code> içlerinden birini içeren her sorguyu veritabanına ulaşmadan reddeder — <code>SQLDatabaseToolkit</code>'in üretimde önerdiği aynı kapı. 2) <code>planner(question)</code> LLM yerine geçer: üreteceği SQL'i döndüren küçük anahtar-kelime sürücülü template router. 3) Döngü üç sorgu çalıştırır — iki güvenli analitik ve bir yıkıcı — üçüncüde guardrail'in tabloya dokunmadan tetiklendiğini gösterir. 4) <code>planner</code>'ı bir LLM çağrısıyla, <code>safe_sql</code>'i de aynı deny list + <code>db.run</code> ile değiştirin; minimal ama savunulabilir bir SQL agent elde edersiniz.</p>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">7. Anti-patternler ve koruma bantları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="calc-card-title">max_iterations yok</div><div class="calc-card-desc">Agent token yakarak sonsuza döner. Her zaman 5-10'a sınırla.</div></div>
<div class="calc-card"><div class="calc-card-title">Açık Python REPL</div><div class="calc-card-desc">Sandbox veya importları kısıtla — üretimde os/subprocess'i asla açık bırakma.</div></div>
<div class="calc-card"><div class="calc-card-title">Belirsiz tool docstring</div><div class="calc-card-desc">"İş yapar" → LLM yanlış aracı seçer. Girdi/çıktı konusunda açık ol.</div></div>
<div class="calc-card"><div class="calc-card-title">Tool hatasında retry yok</div><div class="calc-card-desc">Tool'ları try/except ile sar + kullanıcı dostu hata string'i döndür.</div></div>
<div class="calc-card"><div class="calc-card-title">Okuma ve yazma karıştırma</div><div class="calc-card-desc">Herhangi bir mutasyondan önce açık onay adımı ekle.</div></div>
</div>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8. Agent vs düz RAG vs basit chain — ne zaman ne</h2>
<div id="lc-l9-when-tr" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if(typeof Plotly==='undefined') return;
  var T=window.themeAccent||'#c8a96e';
  var cats=['basit chain','RAG','SQL agent','tam ReAct agent'];
  var lat =[0.6, 1.0, 2.4, 4.5];
  var rel =[55, 80, 88, 92];
  var cost=[1, 1.5, 4, 7];
  var data=[
    {type:'bar',name:'ortalama gecikme (s)',x:cats,y:lat,marker:{color:T},yaxis:'y'},
    {type:'bar',name:'güvenilirlik (%)',x:cats,y:rel,marker:{color:'#888'},yaxis:'y2'},
    {type:'bar',name:'maliyet x',x:cats,y:cost,marker:{color:'#444'},yaxis:'y'}
  ];
  var layout={
    barmode:'group',margin:{l:60,r:60,t:30,b:60},
    yaxis:{title:'gecikme (s) / maliyet (x)'},
    yaxis2:{title:'güvenilirlik (%)',overlaying:'y',side:'right',range:[0,100]},
    legend:{orientation:'h',y:-0.18,x:0.5,xanchor:'center'},
    paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
    font:{color:getComputedStyle(document.body).color}};
  Plotly.newPlot('lc-l9-when-tr',data,layout,{displayModeBar:false});
},250);</script>
</div>

<div class="lesson-block">
<h2 class="lesson-title">9. Sıradaki</h2>
<p class="l-text">L10 RAG'a <strong>ileri alet kutusuyla</strong> dönüyor — reranker, multi-query, HyDE, parent-document, self-querying — ve hepsini RAGAS ile nasıl değerlendireceğiniz.</p>
</div>
`
};
