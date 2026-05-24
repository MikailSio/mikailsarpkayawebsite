window.AGENTS_L3 = {
en: `<p class="l-text"><strong>Tool calling is the bridge between an LLM and the rest of the world.</strong> It is also the place where most agent bugs live. Get it right and your agent feels like an intern with infinite patience and a good search engine; get it wrong and you spend your week debugging schema mismatches, swallowed exceptions, and double-charged API calls. The shape of the problem is deceptively simple: define a list of functions in JSON Schema, give that list to the model, watch the model emit a structured call, dispatch the call to the matching Python function, return the result, repeat. The interesting part is the dozens of small decisions inside each step — how strict your schema is, how you handle errors, whether you support parallel calls, how you cache, how you redact, how you log.</p>

<p class="l-text">In this lesson we go end-to-end on tool calling as it exists in May 2026. We start with the JSON Schema syntax that both OpenAI and Anthropic accept, walk through the OpenAI function calling and Anthropic tool_use API formats side by side, then build a runtime dispatcher with the production-grade pieces real systems need: input validation with Pydantic, parallel execution with <code>asyncio.gather</code>, retry-with-backoff, schema-error feedback that lets the model correct itself, and structured logging for debugging. By the end you will be able to wire any Python function into an agent in under three minutes and know exactly where the failure modes hide.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Write JSON Schema tool definitions that both OpenAI and Anthropic models can use reliably</li>
<li>Compare OpenAI function calling vs. Anthropic tool_use vs. Mistral tool calls vs. MCP</li>
<li>Build a runtime dispatcher with Pydantic validation, error feedback, and structured logging</li>
<li>Execute parallel tool calls with asyncio and know when parallelism actually helps</li>
<li>Apply production patterns: retry with exponential backoff, idempotency keys, redaction, cost tracking</li>
<li>Recognize and avoid the eight most common tool-calling bugs (schema drift, silent fail, race, etc.)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. JSON Schema, the Lingua Franca</h2>
<p class="l-text">Every modern LLM tool API speaks JSON Schema. The model is shown a tool's name, a one-paragraph natural-language description, and a JSON Schema describing the input arguments. The model is trained to emit a JSON object that conforms to that schema. Output validation is your job — but if the schema is tight and the description is honest, modern models (Claude Sonnet 4.6, GPT-4o, Gemini 2.x, Mistral Large 2) get it right &gt;95% of the time on the first try.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Canonical tool definition shared by OpenAI &amp; Anthropic</span>
get_weather_schema = {
    <span class="str">"name"</span>: <span class="str">"get_weather"</span>,
    <span class="str">"description"</span>: <span class="str">"Get current weather for a city. Returns temperature in Celsius and a one-word condition."</span>,
    <span class="str">"input_schema"</span>: {
        <span class="str">"type"</span>: <span class="str">"object"</span>,
        <span class="str">"properties"</span>: {
            <span class="str">"city"</span>:    {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"description"</span>: <span class="str">"City name, e.g. 'Istanbul' or 'New York'"</span>},
            <span class="str">"country"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"description"</span>: <span class="str">"ISO-3166 alpha-2 code, e.g. 'TR'. Optional."</span>}
        },
        <span class="str">"required"</span>: [<span class="str">"city"</span>],
        <span class="str">"additionalProperties"</span>: <span class="kw">False</span>
    }
}
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Declares <code>get_weather_schema</code> — a plain dict with the three fields every modern tool API expects: <code>name</code>, <code>description</code>, and an <code>input_schema</code> following JSON Schema draft 2020-12. 2) The <code>properties</code> map gives each argument an explicit <code>type</code> and a per-field <code>description</code> the model reads when deciding what to pass. 3) <code>"required": ["city"]</code> marks <code>city</code> as mandatory while <code>country</code> stays optional; the model gets a structured signal about which fields it must emit. 4) <code>"additionalProperties": false</code> tells the model — and your runtime validator — to reject unknown keys, eliminating the "model invented a flag" failure mode before it can ship.</p>

<p class="l-text">Three rules that pay back tenfold in production:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Honest descriptions</div><div class="card-body">The description is the model's only source of behavioral truth. Lying ("returns weather" when it returns a stub) leaks into hallucinated capabilities. Specify return shape, units, edge cases, and known limits.</div></div>
<div class="calc-card"><div class="card-title">2. Tight schemas</div><div class="card-body">Use enums, min/max, and pattern wherever you can. <code>"type":"string","enum":["celsius","fahrenheit"]</code> is far better than a free-text string the model can mangle.</div></div>
<div class="calc-card"><div class="card-title">3. Few tools, well-named</div><div class="card-body">Performance degrades past ~10 tools per call. If you have 50 tools, group them or route — give the model a small initial set and a "discover_more_tools" meta-tool. Anthropic and OpenAI both publish this guidance.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. OpenAI Function Calling (the 2023 standard)</h2>
<p class="l-text">OpenAI introduced function calling in June 2023 and it became the de facto template. The model emits one or more <code>tool_calls</code> in the assistant message; you execute them and append <code>tool</code> messages with the results; you call the API again. Loop until <code>tool_calls</code> is empty.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">import</span> json
client = <span class="fn">OpenAI</span>()

tools = [{
    <span class="str">"type"</span>: <span class="str">"function"</span>,
    <span class="str">"function"</span>: {
        <span class="str">"name"</span>: <span class="str">"get_weather"</span>,
        <span class="str">"description"</span>: <span class="str">"Get current weather for a city in Celsius."</span>,
        <span class="str">"parameters"</span>: {
            <span class="str">"type"</span>: <span class="str">"object"</span>,
            <span class="str">"properties"</span>: {<span class="str">"city"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>}},
            <span class="str">"required"</span>: [<span class="str">"city"</span>]
        }
    }
}]

<span class="kw">def</span> <span class="fn">get_weather</span>(city): <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp_c"</span>: <span class="num">22</span>, <span class="str">"cond"</span>: <span class="str">"sunny"</span>}

messages = [{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"What's the weather in Istanbul?"</span>}]
<span class="kw">while</span> <span class="kw">True</span>:
    resp = client.chat.completions.<span class="fn">create</span>(model=<span class="str">"gpt-4o"</span>, messages=messages, tools=tools)
    msg = resp.choices[<span class="num">0</span>].message
    messages.<span class="fn">append</span>(msg)
    <span class="kw">if</span> <span class="kw">not</span> msg.tool_calls:
        <span class="fn">print</span>(msg.content); <span class="kw">break</span>
    <span class="kw">for</span> tc <span class="kw">in</span> msg.tool_calls:
        args = json.<span class="fn">loads</span>(tc.function.arguments)
        result = <span class="fn">get_weather</span>(**args)
        messages.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"tool"</span>, <span class="str">"tool_call_id"</span>: tc.id,
                         <span class="str">"content"</span>: json.<span class="fn">dumps</span>(result)})
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Wraps the OpenAI <code>tools</code> list in the <code>{"type":"function","function":{...}}</code> envelope OpenAI requires — the inner shape is the same schema you wrote in section 1. 2) Enters the classic agent <code>while True</code> loop: send <code>messages</code> + <code>tools</code> to <code>chat.completions.create</code>, append the assistant message verbatim. 3) When <code>msg.tool_calls</code> is empty the model decided to stop — print the final content and break. 4) Otherwise iterate every <code>tc</code> in <code>msg.tool_calls</code>, <code>json.loads</code> the arguments, call the matching Python function (here <code>get_weather</code>), and append a <code>role:"tool"</code> message whose <code>tool_call_id</code> exactly matches <code>tc.id</code> — without that pairing the next API call will reject the conversation.</p>

<div class="calc-highlight"><strong>Three subtle things:</strong> (1) <code>tool_calls</code> is a list — the model can request multiple parallel calls in one turn; (2) the <code>tool_call_id</code> must match exactly so the model can pair result with request; (3) <code>strict: true</code> mode (added late 2024) forces the model to generate JSON that exactly matches the schema using constrained decoding — use it whenever your schema is well-defined.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Anthropic Tool Use (the 2024 refinement)</h2>
<p class="l-text">Claude 3 (March 2024) introduced tool use with a slightly different but fundamentally equivalent API. The assistant message contains <code>content</code> blocks of two types: <code>text</code> (the model's reasoning, including any <code>&lt;thinking&gt;</code>) and <code>tool_use</code> (the structured call). The user (or developer) replies with <code>tool_result</code> blocks. Same loop, different shape.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> anthropic <span class="kw">import</span> Anthropic
client = <span class="fn">Anthropic</span>()

tools = [{
    <span class="str">"name"</span>: <span class="str">"get_weather"</span>,
    <span class="str">"description"</span>: <span class="str">"Get current weather for a city in Celsius."</span>,
    <span class="str">"input_schema"</span>: {
        <span class="str">"type"</span>: <span class="str">"object"</span>,
        <span class="str">"properties"</span>: {<span class="str">"city"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>}},
        <span class="str">"required"</span>: [<span class="str">"city"</span>]
    }
}]

<span class="kw">def</span> <span class="fn">get_weather</span>(city): <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp_c"</span>: <span class="num">22</span>, <span class="str">"cond"</span>: <span class="str">"sunny"</span>}

messages = [{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"What's the weather in Istanbul?"</span>}]
<span class="kw">while</span> <span class="kw">True</span>:
    resp = client.messages.<span class="fn">create</span>(model=<span class="str">"claude-sonnet-4-6"</span>,
                                  max_tokens=<span class="num">1024</span>, tools=tools, messages=messages)
    messages.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"assistant"</span>, <span class="str">"content"</span>: resp.content})
    <span class="kw">if</span> resp.stop_reason != <span class="str">"tool_use"</span>: <span class="kw">break</span>
    tool_results = []
    <span class="kw">for</span> block <span class="kw">in</span> resp.content:
        <span class="kw">if</span> block.<span class="fn">type</span> == <span class="str">"tool_use"</span>:
            result = <span class="fn">get_weather</span>(**block.<span class="fn">input</span>)
            tool_results.<span class="fn">append</span>({
                <span class="str">"type"</span>: <span class="str">"tool_result"</span>,
                <span class="str">"tool_use_id"</span>: block.id,
                <span class="str">"content"</span>: <span class="fn">str</span>(result)
            })
    messages.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: tool_results})
<span class="fn">print</span>(messages[-<span class="num">2</span>][<span class="str">"content"</span>])
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds the Anthropic <code>tools</code> list — same JSON Schema content as OpenAI but flat (no <code>"type":"function"</code> wrapper) with <code>input_schema</code> instead of <code>parameters</code>. 2) Calls <code>client.messages.create</code> and breaks the loop when <code>resp.stop_reason != "tool_use"</code> — that is Anthropic's signal that no more tool calls are coming. 3) Iterates <code>resp.content</code> blocks and dispatches each <code>type=="tool_use"</code> block via <code>get_weather(**block.input)</code> while ignoring any <code>text</code> blocks. 4) Sends results back inside a single <code>role:"user"</code> message whose content is a list of <code>tool_result</code> blocks — each carrying <code>tool_use_id</code> equal to <code>block.id</code> so Claude can pair result with request.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenAI vs. Anthropic — what differs</div><div class="card-body">Field names (<code>tool_calls</code> vs. <code>tool_use</code>), message structure (assistant + tool roles vs. content blocks), parallel-tool default (OpenAI on, Anthropic on with explicit setting). Algorithm: identical.</div></div>
<div class="calc-card"><div class="card-title">When to prefer Claude</div><div class="card-body">Long-context tool use (200K window), nuanced schema following, computer-use API. Sonnet 4.6 currently leads on multi-tool agent benchmarks (SWE-bench, Tau-bench).</div></div>
<div class="calc-card"><div class="card-title">When to prefer GPT</div><div class="card-body">Strict JSON Schema mode, lower latency on small calls, OpenAI's broader plugin ecosystem, structured outputs with Pydantic models directly.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. MCP — The Model Context Protocol</h2>
<p class="l-text">In November 2024 Anthropic open-sourced <strong>MCP (Model Context Protocol)</strong>: a JSON-RPC standard that lets any LLM client talk to any tool server. Instead of every framework defining tools differently, an MCP server exposes a list of tools (with schemas) and the client calls them over a transport (stdio, HTTP, websocket). By 2026 MCP servers exist for filesystems, GitHub, Postgres, Slack, Linear, Notion, Stripe, and hundreds more.</p>

<div class="calc-highlight"><strong>Why MCP matters:</strong> tools become composable across clients. A <code>postgres</code> MCP server you wrote for Claude Desktop also works in Cursor, in Zed, in your own Python script. The tool definition is written once. This is what USB-C did for laptops; MCP is doing it for agents.</div>

<p class="l-text">MCP doesn't replace function calling — it standardizes how tools are <em>discovered</em> and <em>transported</em>. The function-call shape inside the model is the same. If you build agents seriously in 2026, learn the MCP spec; it is one document.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Building a Production Dispatcher (Runnable)</h2>
<p class="l-text">Here is a production-flavored tool dispatcher: schema validation, error feedback to the model, structured logging. The mock LLM emits a few realistic call patterns including a malformed call so you can see the validation feedback loop.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Full dispatcher with JSON Schema validation (manual, since jsonschema isn't in Pyodide preamble), error feedback, and a structured trace. The mock LLM first sends a malformed call (missing required field), receives an error observation, then corrects itself.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, time

<span class="cm"># 1. Tool schemas</span>
SCHEMAS = {
    <span class="str">"get_weather"</span>: {
        <span class="str">"required"</span>: [<span class="str">"city"</span>],
        <span class="str">"properties"</span>: {<span class="str">"city"</span>: {<span class="str">"type"</span>: <span class="str">"str"</span>}, <span class="str">"units"</span>: {<span class="str">"type"</span>: <span class="str">"str"</span>, <span class="str">"enum"</span>: [<span class="str">"c"</span>, <span class="str">"f"</span>]}}
    },
    <span class="str">"search_db"</span>: {
        <span class="str">"required"</span>: [<span class="str">"query"</span>, <span class="str">"limit"</span>],
        <span class="str">"properties"</span>: {<span class="str">"query"</span>: {<span class="str">"type"</span>: <span class="str">"str"</span>}, <span class="str">"limit"</span>: {<span class="str">"type"</span>: <span class="str">"int"</span>}}
    }
}

<span class="cm"># 2. Tool implementations</span>
<span class="kw">def</span> <span class="fn">get_weather</span>(city, units=<span class="str">"c"</span>):
    <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp"</span>: <span class="num">22</span> <span class="kw">if</span> units == <span class="str">"c"</span> <span class="kw">else</span> <span class="num">72</span>, <span class="str">"units"</span>: units}
<span class="kw">def</span> <span class="fn">search_db</span>(query, limit=<span class="num">10</span>):
    <span class="kw">return</span> [{<span class="str">"id"</span>: i, <span class="str">"title"</span>: f<span class="str">"result {i} for {query}"</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(limit)]
TOOLS = {<span class="str">"get_weather"</span>: get_weather, <span class="str">"search_db"</span>: search_db}

<span class="cm"># 3. Validator</span>
<span class="kw">def</span> <span class="fn">validate</span>(name, args):
    <span class="kw">if</span> name <span class="kw">not</span> <span class="kw">in</span> SCHEMAS: <span class="kw">return</span> f<span class="str">"unknown tool: {name}"</span>
    schema = SCHEMAS[name]
    <span class="kw">for</span> req <span class="kw">in</span> schema[<span class="str">"required"</span>]:
        <span class="kw">if</span> req <span class="kw">not</span> <span class="kw">in</span> args: <span class="kw">return</span> f<span class="str">"missing required field '{req}' for {name}"</span>
    <span class="kw">for</span> k, v <span class="kw">in</span> args.<span class="fn">items</span>():
        prop = schema[<span class="str">"properties"</span>].<span class="fn">get</span>(k)
        <span class="kw">if</span> <span class="kw">not</span> prop: <span class="kw">return</span> f<span class="str">"unexpected field '{k}' for {name}"</span>
        <span class="kw">if</span> prop[<span class="str">"type"</span>] == <span class="str">"str"</span> <span class="kw">and</span> <span class="kw">not</span> <span class="fn">isinstance</span>(v, <span class="fn">str</span>): <span class="kw">return</span> f<span class="str">"'{k}' must be string"</span>
        <span class="kw">if</span> prop[<span class="str">"type"</span>] == <span class="str">"int"</span> <span class="kw">and</span> <span class="kw">not</span> <span class="fn">isinstance</span>(v, <span class="fn">int</span>): <span class="kw">return</span> f<span class="str">"'{k}' must be int"</span>
        <span class="kw">if</span> <span class="str">"enum"</span> <span class="kw">in</span> prop <span class="kw">and</span> v <span class="kw">not</span> <span class="kw">in</span> prop[<span class="str">"enum"</span>]: <span class="kw">return</span> f<span class="str">"'{k}' must be one of {prop['enum']}"</span>
    <span class="kw">return</span> <span class="kw">None</span>  <span class="cm"># OK</span>

<span class="cm"># 4. Dispatcher with logging</span>
LOG = []
<span class="kw">def</span> <span class="fn">dispatch</span>(name, args):
    t0 = time.<span class="fn">time</span>()
    err = <span class="fn">validate</span>(name, args)
    <span class="kw">if</span> err:
        LOG.<span class="fn">append</span>({<span class="str">"tool"</span>: name, <span class="str">"args"</span>: args, <span class="str">"ok"</span>: <span class="kw">False</span>, <span class="str">"error"</span>: err})
        <span class="kw">return</span> {<span class="str">"error"</span>: err, <span class="str">"hint"</span>: f<span class="str">"Check schema for {name}"</span>}
    <span class="kw">try</span>:
        out = TOOLS[name](**args)
        LOG.<span class="fn">append</span>({<span class="str">"tool"</span>: name, <span class="str">"args"</span>: args, <span class="str">"ok"</span>: <span class="kw">True</span>, <span class="str">"ms"</span>: <span class="fn">int</span>((time.<span class="fn">time</span>()-t0)*<span class="num">1000</span>)})
        <span class="kw">return</span> out
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        LOG.<span class="fn">append</span>({<span class="str">"tool"</span>: name, <span class="str">"args"</span>: args, <span class="str">"ok"</span>: <span class="kw">False</span>, <span class="str">"error"</span>: <span class="fn">str</span>(e)})
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="fn">str</span>(e)}

<span class="cm"># 5. Mock LLM that first errors, then corrects</span>
calls = [
    (<span class="str">"get_weather"</span>, {<span class="str">"units"</span>: <span class="str">"c"</span>}),                    <span class="cm"># missing 'city' -> error</span>
    (<span class="str">"get_weather"</span>, {<span class="str">"city"</span>: <span class="str">"Istanbul"</span>, <span class="str">"units"</span>: <span class="str">"c"</span>}),<span class="cm"># valid -> ok</span>
    (<span class="str">"search_db"</span>,   {<span class="str">"query"</span>: <span class="str">"agents"</span>, <span class="str">"limit"</span>: <span class="num">3</span>})    <span class="cm"># valid -> ok</span>
]
<span class="kw">for</span> name, args <span class="kw">in</span> calls:
    <span class="fn">print</span>(f<span class="str">"\\n>> CALL {name}({args})"</span>)
    <span class="fn">print</span>(<span class="str">"   result:"</span>, <span class="fn">dispatch</span>(name, args))

<span class="fn">print</span>(<span class="str">"\\n=== STRUCTURED LOG ==="</span>)
<span class="kw">for</span> entry <span class="kw">in</span> LOG: <span class="fn">print</span>(entry)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a <code>SCHEMAS</code> dict per tool (required fields, property types, optional enums) and a matching <code>TOOLS</code> dict mapping tool names to real Python functions. 2) <code>validate(name, args)</code> checks the tool exists, every <code>required</code> field is present, every passed field is declared, types match, and enum values are legal — returning a human-readable error string or <code>None</code> on success. 3) <code>dispatch(name, args)</code> times the call, appends a structured <code>LOG</code> entry, and if validation fails returns <code>{"error", "hint"}</code> — the hint is what the model reads to self-correct. 4) The scripted <code>calls</code> list runs three turns: a malformed call missing <code>city</code> produces an error, the next call corrects it, and <code>search_db</code> demonstrates the same path on a different tool — the printed <code>LOG</code> at the end is exactly what you'd ship to Langfuse or LangSmith.</p>
</div>

<p class="l-text">Notice the validator returns a human-readable error that goes back to the model as the tool result. This <em>error feedback loop</em> is the single most important production pattern: the model sees its mistake and self-corrects on the next turn. Without it, agents silently produce wrong answers.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Parallel Tool Calls</h2>
<p class="l-text">Both OpenAI (since Nov 2023) and Anthropic (since 2024) let the model emit multiple tool calls in a single assistant turn. If the calls are independent — three different city weather lookups, a fan-out to several APIs — you should execute them concurrently. The latency win is large; the cost stays the same.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> asyncio
<span class="kw">from</span> openai <span class="kw">import</span> AsyncOpenAI
client = <span class="fn">AsyncOpenAI</span>()

<span class="kw">async</span> <span class="kw">def</span> <span class="fn">get_weather</span>(city):
    <span class="kw">await</span> asyncio.<span class="fn">sleep</span>(<span class="num">0.5</span>)               <span class="cm"># simulate network</span>
    <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp_c"</span>: <span class="num">20</span>}

<span class="kw">async</span> <span class="kw">def</span> <span class="fn">handle_turn</span>(messages, tools):
    resp = <span class="kw">await</span> client.chat.completions.<span class="fn">create</span>(
        model=<span class="str">"gpt-4o"</span>, messages=messages, tools=tools,
        parallel_tool_calls=<span class="kw">True</span>
    )
    msg = resp.choices[<span class="num">0</span>].message
    <span class="kw">if</span> <span class="kw">not</span> msg.tool_calls: <span class="kw">return</span> msg
    <span class="cm"># Fan out all tool calls concurrently</span>
    results = <span class="kw">await</span> asyncio.<span class="fn">gather</span>(*[
        <span class="fn">get_weather</span>(**json.<span class="fn">loads</span>(tc.function.arguments)) <span class="kw">for</span> tc <span class="kw">in</span> msg.tool_calls
    ])
    <span class="cm"># Append each result with matching id</span>
    <span class="kw">for</span> tc, r <span class="kw">in</span> <span class="fn">zip</span>(msg.tool_calls, results):
        messages.<span class="fn">append</span>({<span class="str">"role"</span>:<span class="str">"tool"</span>,<span class="str">"tool_call_id"</span>:tc.id,<span class="str">"content"</span>:json.<span class="fn">dumps</span>(r)})
    <span class="kw">return</span> <span class="kw">None</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Uses <code>AsyncOpenAI</code> and passes <code>parallel_tool_calls=True</code> so the model is free to emit several <code>tool_calls</code> in one assistant turn. 2) The <code>get_weather</code> tool is declared <code>async</code> with an <code>asyncio.sleep(0.5)</code> to simulate a real network round-trip — three sequential calls would cost 1.5s, fan-out costs ~0.5s. 3) <code>asyncio.gather(*[...])</code> dispatches every <code>tc</code> in <code>msg.tool_calls</code> concurrently; the comprehension parses each tool's arguments and calls <code>get_weather</code> in parallel. 4) The <code>zip(msg.tool_calls, results)</code> loop pairs every original <code>tc.id</code> with its result so the next API call sees the correct tool_call_id ↔ tool_result mapping — required for both providers.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Concurrent vs. serial tool dispatch with asyncio. Three tool calls each take 0.4s; serial = 1.2s, concurrent = 0.4s. The pattern is identical with real APIs — only the I/O is real.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> asyncio, time

<span class="kw">async</span> <span class="kw">def</span> <span class="fn">fetch_city</span>(city):
    <span class="kw">await</span> asyncio.<span class="fn">sleep</span>(<span class="num">0.4</span>)             <span class="cm"># mock network latency</span>
    <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp_c"</span>: <span class="num">20</span> + <span class="fn">len</span>(city) % <span class="num">10</span>}

<span class="kw">async</span> <span class="kw">def</span> <span class="fn">main</span>():
    cities = [<span class="str">"Istanbul"</span>, <span class="str">"Ankara"</span>, <span class="str">"Izmir"</span>, <span class="str">"Bursa"</span>, <span class="str">"Adana"</span>]
    <span class="cm"># Serial baseline</span>
    t0 = time.<span class="fn">time</span>()
    serial = []
    <span class="kw">for</span> c <span class="kw">in</span> cities:
        serial.<span class="fn">append</span>(<span class="kw">await</span> <span class="fn">fetch_city</span>(c))
    t_serial = time.<span class="fn">time</span>() - t0

    <span class="cm"># Concurrent dispatch</span>
    t0 = time.<span class="fn">time</span>()
    concurrent = <span class="kw">await</span> asyncio.<span class="fn">gather</span>(*[<span class="fn">fetch_city</span>(c) <span class="kw">for</span> c <span class="kw">in</span> cities])
    t_conc = time.<span class="fn">time</span>() - t0

    <span class="fn">print</span>(f<span class="str">"Serial:     {t_serial:.2f}s  -> {len(serial)} results"</span>)
    <span class="fn">print</span>(f<span class="str">"Concurrent: {t_conc:.2f}s  -> {len(concurrent)} results"</span>)
    <span class="fn">print</span>(f<span class="str">"Speedup:    {t_serial/t_conc:.1f}x"</span>)
    <span class="fn">print</span>(<span class="str">"Sample:"</span>, concurrent[<span class="num">0</span>])

<span class="cm"># Pyodide supports asyncio at top level</span>
<span class="kw">await</span> <span class="fn">main</span>()
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>fetch_city</code> simulates a 0.4s network call per city using <code>await asyncio.sleep(0.4)</code> — stand-in for a real HTTP request. 2) The serial baseline runs a <code>for c in cities</code> loop with <code>await fetch_city(c)</code> inside; each call blocks the loop, giving 5 × 0.4s ≈ 2.0s total. 3) The concurrent variant builds a list comprehension <code>[fetch_city(c) for c in cities]</code> and feeds it to <code>asyncio.gather(*...)</code>, which schedules all five coroutines at once — total wall time stays close to 0.4s. 4) The printed <code>Speedup</code> figure equals roughly the number of cities; in real agent code this is the exact win you get by dispatching <code>tool_calls</code> with <code>asyncio.gather</code> instead of a sequential <code>for</code> loop.</p>
</div>

<p class="l-text">Caveat: parallelism only helps when calls are <em>truly</em> independent. If call B depends on call A's result, the model should not parallelize (and a well-prompted model will not). Watch for races on shared state — if two tools write to the same DB row, you need a lock.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Production Patterns: Retries, Idempotency, Redaction, Cost</h2>
<p class="l-text">Real agent systems need four layers of robustness on top of the basic dispatcher.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Retry with backoff</div><div class="card-body">Network and provider errors are common. Wrap each tool call in <code>tenacity</code> or a manual exponential backoff (e.g. 1s, 2s, 4s, max 3 retries). Distinguish transient (5xx, timeout) from permanent (4xx schema error) — only retry transient.</div></div>
<div class="calc-card"><div class="card-title">Idempotency keys</div><div class="card-body">If a tool has side effects (sending email, charging a card, posting to Slack), pass a deterministic key derived from <code>(tool_call_id, args_hash)</code>. The downstream service deduplicates. Without this, retries cause double charges.</div></div>
<div class="calc-card"><div class="card-title">Redaction</div><div class="card-body">PII and secrets leak through tool args and results. Run a redactor before logging: regex for emails, phone numbers, API keys, credit cards. Better still, never let the model see secrets — pass them via env to the tool.</div></div>
<div class="calc-card"><div class="card-title">Cost &amp; budget tracking</div><div class="card-body">Each LLM call has a cost; each tool call may too. Track tokens-in/out per turn, sum to a session budget, abort with a graceful error when exceeded. LangSmith, Helicone, Langfuse all do this; the basic version is 20 lines.</div></div>
</div>

<p class="l-text">Anthropic's tool-use docs and OpenAI's function-calling guide both spell these out. The mistake is assuming "we'll add it later" — the bugs you discover in week three (double charges, leaked PII, runaway costs) are far more expensive than the day-one investment.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Eight Common Bugs (and Their Fixes)</h2>
<p class="l-text">A short field guide. If your agent is acting weirdly, scan this list first.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Schema drift</div><div class="card-body">Tool's actual signature changed; schema didn't. Model emits old args; new function rejects them. Fix: generate schema from the function signature (Pydantic, <code>inspect</code>, instructor library).</div></div>
<div class="calc-card"><div class="card-title">Silent failures</div><div class="card-body">Tool throws, exception caught, empty string returned. Model thinks tool worked. Fix: always return a structured <code>{"error": "..."}</code> on failure; never empty.</div></div>
<div class="calc-card"><div class="card-title">Argument-type confusion</div><div class="card-body">Model passes <code>"5"</code> when schema says <code>integer</code>. Fix: strict mode (OpenAI), Pydantic coercion, or accept and coerce in the dispatcher.</div></div>
<div class="calc-card"><div class="card-title">Missing tool_call_id pairing</div><div class="card-body">You forgot to attach <code>tool_call_id</code> to a result. Model gets confused, may hallucinate. Fix: structural test — every assistant tool_call must have a matching tool result before the next API call.</div></div>
<div class="calc-card"><div class="card-title">Race on shared state</div><div class="card-body">Two parallel tool calls both update the same row. Fix: optimistic locking, or serialize writes; only parallelize reads.</div></div>
<div class="calc-card"><div class="card-title">Context blowup</div><div class="card-body">Long tool results (a 100K-char file) explode context window. Fix: truncate, summarize, or paginate ("page 1/4 — call again with offset=N").</div></div>
<div class="calc-card"><div class="card-title">Tool overload</div><div class="card-body">Too many tools (15+) → model picks wrong one. Fix: route — first call picks a category, then a sub-agent sees only that category's tools.</div></div>
<div class="calc-card"><div class="card-title">Lost tool result</div><div class="card-body">You appended the result but forgot to send it back to the model in the next turn. Model loops re-asking. Fix: assertion before each API call: "do all tool_use ids have matching tool_result?"</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Recap and Next Steps</h2>
<p class="l-text">Tool calling is structurally simple — JSON Schema in, JSON args out, dispatch, repeat — and operationally rich. The model's job is to pick the right tool with the right args; your job is to make that as easy and as safe as possible. The investments that pay off most: tight schemas with honest descriptions, structured error feedback to the model, parallel execution for independent calls, and the four production layers (retry, idempotency, redaction, cost).</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>JSON Schema is the lingua franca; tight schemas + honest descriptions = first-try success &gt;95%.</li>
<li>OpenAI <code>tool_calls</code> ≡ Anthropic <code>tool_use</code> structurally; APIs differ in field names, algorithm is identical.</li>
<li>MCP standardizes tool servers across clients; learn the spec — it's one document.</li>
<li>Always return structured errors so the model can self-correct; never silent fail.</li>
<li>Parallel tool calls give 3–10x latency wins on independent fan-outs; use <code>asyncio.gather</code>.</li>
<li>Production layers: retry-with-backoff, idempotency keys, redaction, cost budgets — non-negotiable.</li>
<li>Eight bug patterns recur; structural tests catch most before they ship.</li>
</ul>
</div>

<p class="l-text">With the agent loop (L2) and tool calling (L3) in hand, you have everything needed to build production agents. The next lessons in this track go up the stack: planning &amp; decomposition (L4), short and long-term memory (L5), multi-agent systems (L6), evaluation and observability (L7), browser and computer-use agents (L8), the LangGraph framework (L9), AutoGen and CrewAI (L10), and a capstone NLP-research agent (L11) that ties it all together with the RAG and embeddings tracks.</p>
</div>`,

tr: `<p class="l-text"><strong>Tool calling, LLM ile dünyanın geri kalanı arasındaki köprüdür.</strong> Aynı zamanda agent bug'larının çoğunun yaşadığı yerdir. Doğru yaparsan, ajanın sonsuz sabırlı ve iyi arama motorlu bir intern gibi hisseder; yanlış yaparsan haftanı schema uyumsuzlukları, yutulmuş exception'lar ve iki kez ücretlendirilmiş API çağrılarını debug ederek geçirirsin. Problemin şekli aldatıcı kadar basit: JSON Schema'da fonksiyon listesi tanımla, listeyi modele ver, modelin yapılandırılmış bir çağrı yaymasını izle, çağrıyı eşleşen Python fonksiyonuna gönder, sonucu döndür, tekrarla. İlginç kısım her adımın içindeki düzinelerce küçük karar — schema'nın ne kadar sıkı olduğu, hataları nasıl ele aldığın, paralel çağrıyı destekleyip desteklemediğin, nasıl cache'lediğin, nasıl redaksiyon yaptığın, nasıl loglandığın.</p>

<p class="l-text">Bu derste Mayıs 2026'daki tool calling'i baştan sona ele alıyoruz. Hem OpenAI hem Anthropic'in kabul ettiği JSON Schema sözdizimi ile başlıyor, OpenAI function calling ve Anthropic tool_use API formatlarını yan yana inceliyor, sonra gerçek sistemlerin ihtiyaç duyduğu production-seviye parçalarla bir runtime dispatcher kuruyoruz: Pydantic ile input validation, <code>asyncio.gather</code> ile paralel yürütme, retry-with-backoff, modelin kendini düzeltebilmesi için schema-error feedback ve debugging için yapılandırılmış logging. Sonunda herhangi bir Python fonksiyonunu üç dakikadan kısa sürede bir agent'a bağlayabilecek ve hata modlarının tam olarak nerede saklandığını bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Hem OpenAI hem Anthropic modellerinin güvenilir kullanabileceği JSON Schema tool tanımları yazmak</li>
<li>OpenAI function calling vs. Anthropic tool_use vs. Mistral tool calls vs. MCP'yi karşılaştırmak</li>
<li>Pydantic doğrulama, hata feedback'i ve yapılandırılmış logging ile bir runtime dispatcher kurmak</li>
<li>asyncio ile paralel tool çağrılarını yürütmek ve paralelliğin gerçekten ne zaman yardım ettiğini bilmek</li>
<li>Production desenlerini uygulamak: exponential backoff'lu retry, idempotency anahtarları, redaksiyon, maliyet izleme</li>
<li>En yaygın sekiz tool-calling bug'ını (schema drift, silent fail, race, vb.) tanımak ve önlemek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. JSON Schema, Ortak Dil</h2>
<p class="l-text">Her modern LLM tool API'si JSON Schema konuşur. Modele bir tool'un ismi, bir paragraflık doğal-dil açıklaması ve giriş argümanlarını tarif eden bir JSON Schema gösterilir. Model, bu şemaya uygun bir JSON nesnesi yaymaya eğitilmiştir. Çıktı doğrulama senin işin — ama şema sıkı ve açıklama dürüstse, modern modeller (Claude Sonnet 4.6, GPT-4o, Gemini 2.x, Mistral Large 2) ilk denemede %95'ten fazla doğru üretiyor.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># OpenAI &amp; Anthropic tarafindan paylasilan kanonik tool tanimi</span>
get_weather_schema = {
    <span class="str">"name"</span>: <span class="str">"get_weather"</span>,
    <span class="str">"description"</span>: <span class="str">"Bir sehir için guncel hava durumunu doner. Sicaklik Celsius, kondisyon tek-kelime."</span>,
    <span class="str">"input_schema"</span>: {
        <span class="str">"type"</span>: <span class="str">"object"</span>,
        <span class="str">"properties"</span>: {
            <span class="str">"city"</span>:    {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"description"</span>: <span class="str">"Sehir adi, örnek 'Istanbul' veya 'New York'"</span>},
            <span class="str">"country"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"description"</span>: <span class="str">"ISO-3166 alpha-2 kodu, örnek 'TR'. Opsiyonel."</span>}
        },
        <span class="str">"required"</span>: [<span class="str">"city"</span>],
        <span class="str">"additionalProperties"</span>: <span class="kw">False</span>
    }
}
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>get_weather_schema</code>'yı düz bir sözlük olarak tanımlar — modern tool API'larının beklediği üç alanı içerir: <code>name</code>, <code>description</code> ve JSON Schema draft 2020-12 izleyen bir <code>input_schema</code>. 2) <code>properties</code> haritası her argümana açık bir <code>type</code> ve alana özel bir <code>description</code> verir; model ne göndereceğine karar verirken bunları okur. 3) <code>"required": ["city"]</code> <code>city</code>'yi zorunlu işaretler, <code>country</code> opsiyonel kalır; model hangi alanları üretmek zorunda olduğuna dair yapılandırılmış bir sinyal alır. 4) <code>"additionalProperties": false</code> hem modele hem de runtime validator'ınıza bilinmeyen anahtarları reddetmesini söyler — "model bir flag uydurdu" hatasını gerçekleşmeden önce kapatır.</p>

<p class="l-text">Production'da on katı geri ödeyen üç kural:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Dürüst açıklamalar</div><div class="card-body">Açıklama, modelin tek davranışsal gerçek kaynağıdır. Yalan söylemek (stub döndürürken "hava durumu döner" demek) halüsine yeteneklere sızar. Dönüş şeklini, birimleri, edge case'leri ve bilinen limitleri belirt.</div></div>
<div class="calc-card"><div class="card-title">2. Sıkı şemalar</div><div class="card-body">Mümkün her yerde enum, min/max ve pattern kullan. <code>"type":"string","enum":["celsius","fahrenheit"]</code>, modelin bozabileceği serbest-metin bir string'den çok daha iyi.</div></div>
<div class="calc-card"><div class="card-title">3. Az sayıda, iyi-isimli tool</div><div class="card-body">Çağrı başına ~10 tool'u geçince performans düşer. 50 tool'un varsa, gruplara ayır veya yönlendir — modele küçük bir başlangıç seti ve "discover_more_tools" meta-tool'u ver. Anthropic ve OpenAI bu rehberi yayınlıyor.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. OpenAI Function Calling (2023 standardı)</h2>
<p class="l-text">OpenAI function calling'i Haziran 2023'te tanıttı ve fiili şablon haline geldi. Model assistant mesajında bir veya birkaç <code>tool_calls</code> yayar; sen bunları yürütür ve sonuçlarla <code>tool</code> mesajları eklersin; API'yi tekrar çağırırsın. <code>tool_calls</code> boş olana kadar döndür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> openai <span class="kw">import</span> OpenAI
<span class="kw">import</span> json
client = <span class="fn">OpenAI</span>()

tools = [{
    <span class="str">"type"</span>: <span class="str">"function"</span>,
    <span class="str">"function"</span>: {
        <span class="str">"name"</span>: <span class="str">"get_weather"</span>,
        <span class="str">"description"</span>: <span class="str">"Bir sehir için guncel hava durumunu Celsius olarak doner."</span>,
        <span class="str">"parameters"</span>: {
            <span class="str">"type"</span>: <span class="str">"object"</span>,
            <span class="str">"properties"</span>: {<span class="str">"city"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>}},
            <span class="str">"required"</span>: [<span class="str">"city"</span>]
        }
    }
}]

<span class="kw">def</span> <span class="fn">get_weather</span>(city): <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp_c"</span>: <span class="num">22</span>, <span class="str">"cond"</span>: <span class="str">"sunny"</span>}

messages = [{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"Istanbul'da hava nasil?"</span>}]
<span class="kw">while</span> <span class="kw">True</span>:
    resp = client.chat.completions.<span class="fn">create</span>(model=<span class="str">"gpt-4o"</span>, messages=messages, tools=tools)
    msg = resp.choices[<span class="num">0</span>].message
    messages.<span class="fn">append</span>(msg)
    <span class="kw">if</span> <span class="kw">not</span> msg.tool_calls:
        <span class="fn">print</span>(msg.content); <span class="kw">break</span>
    <span class="kw">for</span> tc <span class="kw">in</span> msg.tool_calls:
        args = json.<span class="fn">loads</span>(tc.function.arguments)
        result = <span class="fn">get_weather</span>(**args)
        messages.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"tool"</span>, <span class="str">"tool_call_id"</span>: tc.id,
                         <span class="str">"content"</span>: json.<span class="fn">dumps</span>(result)})
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) OpenAI <code>tools</code> listesini OpenAI'nin gerektirdiği <code>{"type":"function","function":{...}}</code> sarmalayıcısına sarar — iç şekil bölüm 1'de yazdığınız şemanın aynısıdır. 2) Klasik agent <code>while True</code> döngüsüne girer: <code>messages</code> + <code>tools</code> <code>chat.completions.create</code>'e gönderilir, assistant mesajı aynen <code>messages</code>'a eklenir. 3) <code>msg.tool_calls</code> boşsa model durmaya karar vermiştir — son içeriği yazdırıp döngüyü kırar. 4) Aksi hâlde <code>msg.tool_calls</code> içindeki her <code>tc</code> için <code>json.loads</code> ile argümanlar çözülür, eşleşen Python fonksiyonu (burada <code>get_weather</code>) çağrılır ve <code>tool_call_id</code>'si tam olarak <code>tc.id</code>'ye eşit bir <code>role:"tool"</code> mesajı eklenir — bu eşleşme olmadan bir sonraki API çağrısı konuşmayı reddeder.</p>

<div class="calc-highlight"><strong>Üç ince nokta:</strong> (1) <code>tool_calls</code> bir liste — model tek turda birden fazla paralel çağrı isteyebilir; (2) <code>tool_call_id</code> tam eşleşmeli ki model sonuçla isteği eşleştirebilsin; (3) <code>strict: true</code> modu (geç 2024'te eklendi) constrained decoding kullanarak modeli şemaya tam uyan JSON üretmeye zorlar — şeman iyi tanımlıysa kullan.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Anthropic Tool Use (2024 ince ayarı)</h2>
<p class="l-text">Claude 3 (Mart 2024) tool use'u biraz farklı ama temelde eşdeğer bir API ile tanıttı. Assistant mesajı iki tip <code>content</code> bloğu içerir: <code>text</code> (modelin reasoning'i, varsa <code>&lt;thinking&gt;</code> dahil) ve <code>tool_use</code> (yapılandırılmış çağrı). Kullanıcı (veya geliştirici) <code>tool_result</code> bloklarıyla cevap verir. Aynı döngü, farklı şekil.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> anthropic <span class="kw">import</span> Anthropic
client = <span class="fn">Anthropic</span>()

tools = [{
    <span class="str">"name"</span>: <span class="str">"get_weather"</span>,
    <span class="str">"description"</span>: <span class="str">"Bir sehir için guncel hava durumunu Celsius olarak doner."</span>,
    <span class="str">"input_schema"</span>: {
        <span class="str">"type"</span>: <span class="str">"object"</span>,
        <span class="str">"properties"</span>: {<span class="str">"city"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>}},
        <span class="str">"required"</span>: [<span class="str">"city"</span>]
    }
}]

<span class="kw">def</span> <span class="fn">get_weather</span>(city): <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp_c"</span>: <span class="num">22</span>, <span class="str">"cond"</span>: <span class="str">"sunny"</span>}

messages = [{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"Istanbul'da hava nasil?"</span>}]
<span class="kw">while</span> <span class="kw">True</span>:
    resp = client.messages.<span class="fn">create</span>(model=<span class="str">"claude-sonnet-4-6"</span>,
                                  max_tokens=<span class="num">1024</span>, tools=tools, messages=messages)
    messages.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"assistant"</span>, <span class="str">"content"</span>: resp.content})
    <span class="kw">if</span> resp.stop_reason != <span class="str">"tool_use"</span>: <span class="kw">break</span>
    tool_results = []
    <span class="kw">for</span> block <span class="kw">in</span> resp.content:
        <span class="kw">if</span> block.<span class="fn">type</span> == <span class="str">"tool_use"</span>:
            result = <span class="fn">get_weather</span>(**block.<span class="fn">input</span>)
            tool_results.<span class="fn">append</span>({
                <span class="str">"type"</span>: <span class="str">"tool_result"</span>,
                <span class="str">"tool_use_id"</span>: block.id,
                <span class="str">"content"</span>: <span class="fn">str</span>(result)
            })
    messages.<span class="fn">append</span>({<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: tool_results})
<span class="fn">print</span>(messages[-<span class="num">2</span>][<span class="str">"content"</span>])
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Anthropic <code>tools</code> listesini kurar — JSON Schema içeriği OpenAI ile aynı ama düz (<code>"type":"function"</code> sarmalayıcısı yok) ve <code>parameters</code> yerine <code>input_schema</code> kullanır. 2) <code>client.messages.create</code>'i çağırır ve <code>resp.stop_reason != "tool_use"</code> olduğunda döngüyü kırar — bu Anthropic'in "artık tool çağrısı gelmiyor" sinyalidir. 3) <code>resp.content</code> bloklarını iterler ve <code>type=="tool_use"</code> olan her bloğu <code>get_weather(**block.input)</code> ile dispatch eder; <code>text</code> blokları yoksayılır. 4) Sonuçları tek bir <code>role:"user"</code> mesajı içinde geri gönderir; mesajın content'i <code>tool_result</code> bloklarından oluşan bir listedir — her birinin <code>tool_use_id</code>'si <code>block.id</code>'ye eşittir, böylece Claude sonuçla isteği eşleştirebilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OpenAI vs. Anthropic — neler farklı</div><div class="card-body">Alan adları (<code>tool_calls</code> vs. <code>tool_use</code>), mesaj yapısı (assistant + tool rolleri vs. content blokları), paralel-tool varsayılanı (OpenAI açık, Anthropic açık-açık ayarla). Algoritma: özdeş.</div></div>
<div class="calc-card"><div class="card-title">Claude'u ne zaman tercih et</div><div class="card-body">Uzun-context tool use (200K window), nüanslı şema takibi, computer-use API. Sonnet 4.6 şu an çok-tool agent benchmark'larında lider (SWE-bench, Tau-bench).</div></div>
<div class="calc-card"><div class="card-title">GPT'yi ne zaman tercih et</div><div class="card-body">Sıkı JSON Schema modu, küçük çağrılarda daha düşük gecikme, OpenAI'nin geniş plugin ekosistemi, Pydantic modelleriyle direkt structured output.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. MCP — Model Context Protocol</h2>
<p class="l-text">Kasım 2024'te Anthropic <strong>MCP (Model Context Protocol)</strong>'yi açık kaynakladı: herhangi bir LLM client'ın herhangi bir tool sunucusuyla konuşmasına izin veren JSON-RPC standardı. Her framework tool'ları farklı tanımlamak yerine, bir MCP sunucusu tool listesini (şemalarla) açar ve client onları bir transport (stdio, HTTP, websocket) üzerinden çağırır. 2026'ya kadar dosya sistemleri, GitHub, Postgres, Slack, Linear, Notion, Stripe ve yüzlercesi için MCP sunucuları var.</p>

<div class="calc-highlight"><strong>MCP neden önemli:</strong> tool'lar client'lar arasında composable hale gelir. Claude Desktop için yazdığın bir <code>postgres</code> MCP sunucusu Cursor'da, Zed'de, kendi Python script'inde de çalışır. Tool tanımı bir kez yazılır. USB-C laptop'lara ne yaptıysa, MCP de agent'lara onu yapıyor.</div>

<p class="l-text">MCP function calling'i değiştirmez — tool'ların nasıl <em>keşfedildiğini</em> ve <em>taşındığını</em> standartlaştırır. Modelin içindeki function-call şekli aynıdır. 2026'da agent'ı ciddiye alıyorsan MCP spesifikasyonunu öğren; tek bir doküman.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Production Dispatcher Kurmak (Çalışır)</h2>
<p class="l-text">İşte production-tipi bir tool dispatcher: şema doğrulama, modele hata feedback'i, yapılandırılmış logging. Mock LLM, validation feedback döngüsünü görebilesin diye bozuk bir çağrı dahil birkaç gerçekçi çağrı deseni yayar.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">JSON Schema doğrulama (jsonschema preamble'da olmadığından elle), hata feedback'i ve yapılandırılmış trace ile tam dispatcher. Mock LLM önce bozuk bir çağrı (eksik required alan) gönderir, hata gözlemi alır, sonra kendini düzeltir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, time

<span class="cm"># 1. Tool semalari</span>
SCHEMAS = {
    <span class="str">"get_weather"</span>: {
        <span class="str">"required"</span>: [<span class="str">"city"</span>],
        <span class="str">"properties"</span>: {<span class="str">"city"</span>: {<span class="str">"type"</span>: <span class="str">"str"</span>}, <span class="str">"units"</span>: {<span class="str">"type"</span>: <span class="str">"str"</span>, <span class="str">"enum"</span>: [<span class="str">"c"</span>, <span class="str">"f"</span>]}}
    },
    <span class="str">"search_db"</span>: {
        <span class="str">"required"</span>: [<span class="str">"query"</span>, <span class="str">"limit"</span>],
        <span class="str">"properties"</span>: {<span class="str">"query"</span>: {<span class="str">"type"</span>: <span class="str">"str"</span>}, <span class="str">"limit"</span>: {<span class="str">"type"</span>: <span class="str">"int"</span>}}
    }
}

<span class="cm"># 2. Tool implementasyonlari</span>
<span class="kw">def</span> <span class="fn">get_weather</span>(city, units=<span class="str">"c"</span>):
    <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp"</span>: <span class="num">22</span> <span class="kw">if</span> units == <span class="str">"c"</span> <span class="kw">else</span> <span class="num">72</span>, <span class="str">"units"</span>: units}
<span class="kw">def</span> <span class="fn">search_db</span>(query, limit=<span class="num">10</span>):
    <span class="kw">return</span> [{<span class="str">"id"</span>: i, <span class="str">"title"</span>: f<span class="str">"sonuc {i} için {query}"</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(limit)]
TOOLS = {<span class="str">"get_weather"</span>: get_weather, <span class="str">"search_db"</span>: search_db}

<span class="cm"># 3. Validator</span>
<span class="kw">def</span> <span class="fn">validate</span>(name, args):
    <span class="kw">if</span> name <span class="kw">not</span> <span class="kw">in</span> SCHEMAS: <span class="kw">return</span> f<span class="str">"bilinmeyen tool: {name}"</span>
    schema = SCHEMAS[name]
    <span class="kw">for</span> req <span class="kw">in</span> schema[<span class="str">"required"</span>]:
        <span class="kw">if</span> req <span class="kw">not</span> <span class="kw">in</span> args: <span class="kw">return</span> f<span class="str">"{name} için '{req}' eksik"</span>
    <span class="kw">for</span> k, v <span class="kw">in</span> args.<span class="fn">items</span>():
        prop = schema[<span class="str">"properties"</span>].<span class="fn">get</span>(k)
        <span class="kw">if</span> <span class="kw">not</span> prop: <span class="kw">return</span> f<span class="str">"{name} için beklenmeyen alan '{k}'"</span>
        <span class="kw">if</span> prop[<span class="str">"type"</span>] == <span class="str">"str"</span> <span class="kw">and</span> <span class="kw">not</span> <span class="fn">isinstance</span>(v, <span class="fn">str</span>): <span class="kw">return</span> f<span class="str">"'{k}' string olmali"</span>
        <span class="kw">if</span> prop[<span class="str">"type"</span>] == <span class="str">"int"</span> <span class="kw">and</span> <span class="kw">not</span> <span class="fn">isinstance</span>(v, <span class="fn">int</span>): <span class="kw">return</span> f<span class="str">"'{k}' int olmali"</span>
        <span class="kw">if</span> <span class="str">"enum"</span> <span class="kw">in</span> prop <span class="kw">and</span> v <span class="kw">not</span> <span class="kw">in</span> prop[<span class="str">"enum"</span>]: <span class="kw">return</span> f<span class="str">"'{k}' {prop['enum']} icinden biri olmali"</span>
    <span class="kw">return</span> <span class="kw">None</span>  <span class="cm"># OK</span>

<span class="cm"># 4. Logging'li dispatcher</span>
LOG = []
<span class="kw">def</span> <span class="fn">dispatch</span>(name, args):
    t0 = time.<span class="fn">time</span>()
    err = <span class="fn">validate</span>(name, args)
    <span class="kw">if</span> err:
        LOG.<span class="fn">append</span>({<span class="str">"tool"</span>: name, <span class="str">"args"</span>: args, <span class="str">"ok"</span>: <span class="kw">False</span>, <span class="str">"error"</span>: err})
        <span class="kw">return</span> {<span class="str">"error"</span>: err, <span class="str">"hint"</span>: f<span class="str">"{name} semasini kontrol et"</span>}
    <span class="kw">try</span>:
        out = TOOLS[name](**args)
        LOG.<span class="fn">append</span>({<span class="str">"tool"</span>: name, <span class="str">"args"</span>: args, <span class="str">"ok"</span>: <span class="kw">True</span>, <span class="str">"ms"</span>: <span class="fn">int</span>((time.<span class="fn">time</span>()-t0)*<span class="num">1000</span>)})
        <span class="kw">return</span> out
    <span class="kw">except</span> Exception <span class="kw">as</span> e:
        LOG.<span class="fn">append</span>({<span class="str">"tool"</span>: name, <span class="str">"args"</span>: args, <span class="str">"ok"</span>: <span class="kw">False</span>, <span class="str">"error"</span>: <span class="fn">str</span>(e)})
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="fn">str</span>(e)}

<span class="cm"># 5. Once hata yapan, sonra duzelten mock LLM</span>
calls = [
    (<span class="str">"get_weather"</span>, {<span class="str">"units"</span>: <span class="str">"c"</span>}),                    <span class="cm"># 'city' eksik -> hata</span>
    (<span class="str">"get_weather"</span>, {<span class="str">"city"</span>: <span class="str">"Istanbul"</span>, <span class="str">"units"</span>: <span class="str">"c"</span>}),<span class="cm"># gecerli -> ok</span>
    (<span class="str">"search_db"</span>,   {<span class="str">"query"</span>: <span class="str">"agents"</span>, <span class="str">"limit"</span>: <span class="num">3</span>})    <span class="cm"># gecerli -> ok</span>
]
<span class="kw">for</span> name, args <span class="kw">in</span> calls:
    <span class="fn">print</span>(f<span class="str">"\\n>> CAGRI {name}({args})"</span>)
    <span class="fn">print</span>(<span class="str">"   sonuc:"</span>, <span class="fn">dispatch</span>(name, args))

<span class="fn">print</span>(<span class="str">"\\n=== YAPILANDIRILMIS LOG ==="</span>)
<span class="kw">for</span> entry <span class="kw">in</span> LOG: <span class="fn">print</span>(entry)
</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Tool başına bir <code>SCHEMAS</code> sözlüğü (zorunlu alanlar, property tipleri, opsiyonel enum'lar) ve tool adlarını gerçek Python fonksiyonlarına bağlayan eşleşen bir <code>TOOLS</code> sözlüğü tanımlar. 2) <code>validate(name, args)</code> tool'un var olduğunu, her <code>required</code> alanın geldiğini, geçilen her alanın deklare olduğunu, tiplerin uyduğunu ve enum değerlerinin yasal olduğunu kontrol eder — insan-okunur bir hata string'i veya başarıda <code>None</code> döner. 3) <code>dispatch(name, args)</code> çağrıyı zamanlar, yapılandırılmış bir <code>LOG</code> entry'si ekler ve doğrulama başarısızsa <code>{"error", "hint"}</code> döner — hint modelin kendini düzeltmek için okuduğu şeydir. 4) Senaryolu <code>calls</code> listesi üç tur çalıştırır: <code>city</code> eksik bozuk çağrı hata üretir, sıradaki çağrı düzeltir ve <code>search_db</code> aynı yolu farklı bir tool üzerinde gösterir — sondaki <code>LOG</code> çıktısı doğrudan Langfuse veya LangSmith'e gönderilebilecek şeydir.</p>
</div>

<p class="l-text">Validator'ın insan-okunur bir hata döndürmesine ve bunun tool sonucu olarak modele gitmesine dikkat et. Bu <em>hata feedback döngüsü</em> en önemli production desenidir: model hatasını görür ve sonraki turda kendini düzeltir. Bu olmadan ajanlar sessizce yanlış cevaplar üretir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Paralel Tool Çağrıları</h2>
<p class="l-text">Hem OpenAI (Kasım 2023'ten beri) hem Anthropic (2024'ten beri) modelin tek bir assistant turunda birden fazla tool çağrısı yaymasına izin verir. Çağrılar bağımsızsa — üç farklı şehir için hava durumu, birkaç API'ye fan-out — onları eşzamanlı yürütmelisin. Gecikme kazancı büyüktür; maliyet aynı kalır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> asyncio
<span class="kw">from</span> openai <span class="kw">import</span> AsyncOpenAI
client = <span class="fn">AsyncOpenAI</span>()

<span class="kw">async</span> <span class="kw">def</span> <span class="fn">get_weather</span>(city):
    <span class="kw">await</span> asyncio.<span class="fn">sleep</span>(<span class="num">0.5</span>)               <span class="cm"># network simule</span>
    <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp_c"</span>: <span class="num">20</span>}

<span class="kw">async</span> <span class="kw">def</span> <span class="fn">handle_turn</span>(messages, tools):
    resp = <span class="kw">await</span> client.chat.completions.<span class="fn">create</span>(
        model=<span class="str">"gpt-4o"</span>, messages=messages, tools=tools,
        parallel_tool_calls=<span class="kw">True</span>
    )
    msg = resp.choices[<span class="num">0</span>].message
    <span class="kw">if</span> <span class="kw">not</span> msg.tool_calls: <span class="kw">return</span> msg
    <span class="cm"># Tum tool cagrilarini eszamanli fan-out</span>
    results = <span class="kw">await</span> asyncio.<span class="fn">gather</span>(*[
        <span class="fn">get_weather</span>(**json.<span class="fn">loads</span>(tc.function.arguments)) <span class="kw">for</span> tc <span class="kw">in</span> msg.tool_calls
    ])
    <span class="cm"># Her sonucu eslesen id ile ekle</span>
    <span class="kw">for</span> tc, r <span class="kw">in</span> <span class="fn">zip</span>(msg.tool_calls, results):
        messages.<span class="fn">append</span>({<span class="str">"role"</span>:<span class="str">"tool"</span>,<span class="str">"tool_call_id"</span>:tc.id,<span class="str">"content"</span>:json.<span class="fn">dumps</span>(r)})
    <span class="kw">return</span> <span class="kw">None</span>
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>AsyncOpenAI</code> kullanır ve <code>parallel_tool_calls=True</code> geçer; böylece model tek bir assistant turunda birden fazla <code>tool_calls</code> yaymakta serbesttir. 2) <code>get_weather</code> tool'u <code>async</code> tanımlanır ve gerçek bir network gidiş-dönüşünü simüle etmek için içinde <code>asyncio.sleep(0.5)</code> vardır — üç ardışık çağrı 1.5s sürerken fan-out ~0.5s sürer. 3) <code>asyncio.gather(*[...])</code> <code>msg.tool_calls</code> içindeki her <code>tc</code>'yi eşzamanlı dispatch eder; liste kavraması her tool'un argümanlarını parse edip <code>get_weather</code>'i paralel çağırır. 4) <code>zip(msg.tool_calls, results)</code> döngüsü her orijinal <code>tc.id</code>'yi sonucuyla eşler; böylece sonraki API çağrısı doğru tool_call_id ↔ tool_result eşleşmesini görür — her iki sağlayıcı için zorunludur.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">asyncio ile eşzamanlı vs. seri tool dispatch. Üç tool çağrısı her biri 0.4s; seri = 1.2s, eşzamanlı = 0.4s. Desen gerçek API'larla özdeş — yalnızca I/O gerçek.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> asyncio, time

<span class="kw">async</span> <span class="kw">def</span> <span class="fn">fetch_city</span>(city):
    <span class="kw">await</span> asyncio.<span class="fn">sleep</span>(<span class="num">0.4</span>)             <span class="cm"># mock network gecikme</span>
    <span class="kw">return</span> {<span class="str">"city"</span>: city, <span class="str">"temp_c"</span>: <span class="num">20</span> + <span class="fn">len</span>(city) % <span class="num">10</span>}

<span class="kw">async</span> <span class="kw">def</span> <span class="fn">main</span>():
    cities = [<span class="str">"Istanbul"</span>, <span class="str">"Ankara"</span>, <span class="str">"Izmir"</span>, <span class="str">"Bursa"</span>, <span class="str">"Adana"</span>]
    <span class="cm"># Seri baseline</span>
    t0 = time.<span class="fn">time</span>()
    serial = []
    <span class="kw">for</span> c <span class="kw">in</span> cities:
        serial.<span class="fn">append</span>(<span class="kw">await</span> <span class="fn">fetch_city</span>(c))
    t_serial = time.<span class="fn">time</span>() - t0

    <span class="cm"># Eszamanli dispatch</span>
    t0 = time.<span class="fn">time</span>()
    concurrent = <span class="kw">await</span> asyncio.<span class="fn">gather</span>(*[<span class="fn">fetch_city</span>(c) <span class="kw">for</span> c <span class="kw">in</span> cities])
    t_conc = time.<span class="fn">time</span>() - t0

    <span class="fn">print</span>(f<span class="str">"Seri:       {t_serial:.2f}s  -> {len(serial)} sonuc"</span>)
    <span class="fn">print</span>(f<span class="str">"Eszamanli:  {t_conc:.2f}s  -> {len(concurrent)} sonuc"</span>)
    <span class="fn">print</span>(f<span class="str">"Hizlanma:   {t_serial/t_conc:.1f}x"</span>)
    <span class="fn">print</span>(<span class="str">"Örnek:"</span>, concurrent[<span class="num">0</span>])

<span class="cm"># Pyodide top-level asyncio destekler</span>
<span class="kw">await</span> <span class="fn">main</span>()
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>fetch_city</code> her şehir için <code>await asyncio.sleep(0.4)</code> ile 0.4s'lik bir network çağrısını simüle eder — gerçek bir HTTP isteğinin yerine geçer. 2) Seri baseline <code>for c in cities</code> döngüsü içinde <code>await fetch_city(c)</code> çalıştırır; her çağrı döngüyü bloklar, toplam 5 × 0.4s ≈ 2.0s sürer. 3) Eşzamanlı varyant <code>[fetch_city(c) for c in cities]</code> liste kavraması kurar ve <code>asyncio.gather(*...)</code>'a verir; bu beş coroutine'i aynı anda planlar — duvar-saati süresi 0.4s civarında kalır. 4) Yazdırılan <code>Hizlanma</code> değeri yaklaşık şehir sayısına eşittir; gerçek agent kodunda <code>tool_calls</code>'u sıralı <code>for</code> döngüsü yerine <code>asyncio.gather</code> ile dispatch ettiğinde alacağın kazanç da tam olarak budur.</p>
</div>

<p class="l-text">Uyarı: paralellik yalnızca çağrılar <em>gerçekten</em> bağımsızken yardım eder. B çağrısı A'nın sonucuna bağlıysa, model paralelleştirmemeli (ve iyi-prompt'lanmış model bunu yapmaz). Paylaşılan state üzerindeki yarışlara dikkat et — iki tool aynı DB satırına yazıyorsa lock gerekir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Production Desenleri: Retry, Idempotency, Redaksiyon, Maliyet</h2>
<p class="l-text">Gerçek agent sistemleri temel dispatcher'ın üstünde dört katman robustness gerektirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Backoff'lu retry</div><div class="card-body">Network ve provider hataları yaygın. Her tool çağrısını <code>tenacity</code> veya manuel exponential backoff (örn. 1s, 2s, 4s, max 3 retry) içine sar. Geçici (5xx, timeout) ile kalıcı (4xx şema hatası) ayır — yalnızca geçicide retry yap.</div></div>
<div class="calc-card"><div class="card-title">Idempotency anahtarları</div><div class="card-body">Tool'un yan etkileri varsa (mail, kart çekimi, Slack post), <code>(tool_call_id, args_hash)</code>'ten türetilen deterministik bir anahtar geç. Aşağı akış servis dedup yapar. Bu olmadan retry'lar çift ücret yapar.</div></div>
<div class="calc-card"><div class="card-title">Redaksiyon</div><div class="card-body">PII ve secret'lar tool args ve sonuçlarından sızar. Loglamadan önce bir redactor çalıştır: email, telefon, API key, kredi kartı için regex. Daha iyisi, modelin secret'ları görmesine asla izin verme — env üzerinden tool'a geç.</div></div>
<div class="calc-card"><div class="card-title">Maliyet &amp; bütçe izleme</div><div class="card-body">Her LLM çağrısının maliyeti var; her tool çağrısının da olabilir. Tur başına token-in/out izle, seans bütçesine topla, aşıldığında nazik bir hatayla iptal et. LangSmith, Helicone, Langfuse hepsi yapar; temel sürüm 20 satır.</div></div>
</div>

<p class="l-text">Anthropic'in tool-use docs'u ve OpenAI'nin function-calling kılavuzu ikisi de bunları açıklar. Hata "sonra ekleriz" varsayımı — üçüncü haftada keşfedeceğin bug'lar (çift ücret, sızan PII, kontrolden çıkan maliyet) ilk gün yatırımdan çok daha pahalı.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Sekiz Yaygın Bug (ve Çözümleri)</h2>
<p class="l-text">Kısa bir saha rehberi. Ajanın garip davranıyorsa önce bu listeyi tara.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Schema drift</div><div class="card-body">Tool'un gerçek imzası değişti; şema değişmedi. Model eski args yayar; yeni fonksiyon reddeder. Çözüm: şemayı fonksiyon imzasından üret (Pydantic, <code>inspect</code>, instructor kütüphanesi).</div></div>
<div class="calc-card"><div class="card-title">Sessiz başarısızlıklar</div><div class="card-body">Tool throw eder, exception yakalanır, boş string döner. Model tool çalıştı sanır. Çözüm: başarısızlıkta her zaman yapılandırılmış <code>{"error": "..."}</code> döndür; asla boş.</div></div>
<div class="calc-card"><div class="card-title">Argüman-tip karışıklığı</div><div class="card-body">Şema <code>integer</code> derken model <code>"5"</code> geçer. Çözüm: strict mode (OpenAI), Pydantic coercion veya dispatcher'da kabul-ve-coerce.</div></div>
<div class="calc-card"><div class="card-title">tool_call_id eşleşme eksik</div><div class="card-body">Sonuca <code>tool_call_id</code> eklemeyi unuttun. Model karışır, halüsine olabilir. Çözüm: yapısal test — sonraki API çağrısından önce her assistant tool_call'ın eşleşen tool result'u olmalı.</div></div>
<div class="calc-card"><div class="card-title">Paylaşılan state'te race</div><div class="card-body">İki paralel tool çağrısı aynı satırı günceller. Çözüm: optimistic locking veya yazıları seri yap; yalnızca okumaları paralelleştir.</div></div>
<div class="calc-card"><div class="card-title">Context patlaması</div><div class="card-body">Uzun tool sonuçları (100K karakter dosya) context window'u patlatır. Çözüm: kırp, özetle veya sayfalandır ("sayfa 1/4 — offset=N ile tekrar çağır").</div></div>
<div class="calc-card"><div class="card-title">Tool aşırı yükü</div><div class="card-body">Çok fazla tool (15+) → model yanlış olanı seçer. Çözüm: yönlendir — ilk çağrı kategori seçer, sonra alt-ajan yalnızca o kategorinin tool'larını görür.</div></div>
<div class="calc-card"><div class="card-title">Kayıp tool sonucu</div><div class="card-body">Sonucu append ettin ama bir sonraki turda modele geri göndermeyi unuttun. Model yeniden sorarak döngüye girer. Çözüm: her API çağrısından önce assertion: "tüm tool_use id'lerinin eşleşen tool_result'u var mı?"</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<p class="l-text">Tool calling yapısal olarak basit — JSON Schema in, JSON args out, dispatch, tekrar — ve operasyonel olarak zengindir. Modelin işi doğru tool'u doğru argümanlarla seçmek; senin işin bunu olabildiğince kolay ve güvenli yapmak. En çok geri ödeyen yatırımlar: dürüst açıklamalı sıkı şemalar, modele yapılandırılmış hata feedback'i, bağımsız çağrılar için paralel yürütme ve dört production katmanı (retry, idempotency, redaksiyon, maliyet).</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>JSON Schema ortak dildir; sıkı şemalar + dürüst açıklamalar = ilk-deneme başarısı &gt;%95.</li>
<li>OpenAI <code>tool_calls</code> ≡ Anthropic <code>tool_use</code> yapısal olarak; API'lar alan adlarında farklı, algoritma özdeş.</li>
<li>MCP tool sunucularını client'lar arasında standartlaştırır; spesifikasyonu öğren — tek doküman.</li>
<li>Modelin kendini düzeltebilmesi için her zaman yapılandırılmış hata döndür; asla sessiz fail.</li>
<li>Paralel tool çağrıları bağımsız fan-out'larda 3–10x gecikme kazancı verir; <code>asyncio.gather</code> kullan.</li>
<li>Production katmanları: backoff'lu retry, idempotency anahtarları, redaksiyon, maliyet bütçeleri — tartışılmaz.</li>
<li>Sekiz bug deseni tekrar eder; yapısal testler çoğunu sevkten önce yakalar.</li>
</ul>
</div>

<p class="l-text">Agent döngüsü (L2) ve tool calling (L3) elinde olunca production agent inşası için ihtiyacın olan her şey var. Bu track'in sıradaki dersleri stack'te yukarı çıkıyor: planlama &amp; ayrıştırma (L4), kısa ve uzun-vade hafıza (L5), çoklu-agent sistemleri (L6), eval ve gözlemlenebilirlik (L7), browser ve computer-use ajanları (L8), LangGraph framework'ü (L9), AutoGen ve CrewAI (L10) ve hepsini RAG ile embedding track'lerine bağlayan bir capstone NLP-research ajanı (L11).</p>
</div>`
};
