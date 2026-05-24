window.AGENTS_L4 = {
en: `<p class="l-text"><strong>An agent is only as good as its tools.</strong> A 200B-parameter model with three brittle, ambiguously-named, side-effect-laden tools will lose to a 7B model paired with five well-designed atomic tools. Tool design is the highest-leverage skill in agent engineering — the gap between a tool that ships and a tool that hallucinates parameters all afternoon comes down to schema clarity, idempotency, and result formatting.</p>

<p class="l-text">In production, tool calls are the surface where agents touch reality: they hit your database, charge customer cards, send emails, restart pods. A bad tool design is not just a UX problem — it is a production incident waiting to happen. This lesson is the playbook: atomic vs composite, idempotency keys, JSON-schema patterns that LLMs actually follow, sandboxing untrusted code, capability limiting, and result formats that close the loop without bloating context.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The atomic vs composite tradeoff and when to violate the atomic rule on purpose</li>
<li>Idempotency keys and retry semantics — why <code>POST</code>-style tools need them</li>
<li>JSON-schema design patterns: clear names, examples in description, enum constraints</li>
<li>Security: input validation, sandboxing (Docker, gVisor, Pyodide), capability limiting</li>
<li>Tool result formats: structured vs prose, error envelopes, token budget hygiene</li>
<li>A working tool registry with dispatch, validation, and retry — runnable in your browser</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Atomic vs Composite Tools</h2>
<p class="l-text">An <strong>atomic tool</strong> does one thing — <code>get_weather(city)</code>, <code>send_email(to, subject, body)</code>. A <strong>composite tool</strong> chains several primitives — <code>book_trip(origin, destination, dates)</code> internally calls flight search, hotel search, and payment. Both have valid use cases. The default rule: <em>start atomic, only composite when the LLM consistently produces the same multi-step pattern</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Atomic</div><div class="card-body">Few parameters, single side-effect, easy to test. LLM has full control over composition. Cost: more turns in the agent loop.</div></div>
<div class="calc-card"><div class="card-title">Composite</div><div class="card-body">Bundles multi-step recipes. Reduces token cost and turn count. Risk: hides errors mid-recipe; LLM cannot recover from partial failure.</div></div>
<div class="calc-card"><div class="card-title">Heuristic</div><div class="card-body">If the recipe is &gt; 90% the same across users, composite. If users branch on intermediate results, atomic. Logged trajectories tell you which.</div></div>
</div>

<div class="calc-highlight">A common anti-pattern: a tool called <code>do_research(topic)</code> that internally searches, summarizes, and writes a report. The LLM cannot inject critique mid-stream, cannot retry just the search. Break it into <code>web_search</code>, <code>read_url</code>, <code>summarize</code> — let the agent loop drive composition.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Idempotency &amp; Retry Semantics</h2>
<p class="l-text">Network calls fail. LLMs hallucinate duplicate calls. Both mean your tool will be invoked twice for the same logical action. <strong>Idempotency</strong> = invoking the tool N times has the same observable effect as invoking it once. Read-only tools (<code>get_user</code>) are naturally idempotent. Mutating tools need an <strong>idempotency key</strong> — a client-supplied unique ID that the server uses to deduplicate.</p>

<div class="katex-block">$$P(\\text{duplicate charge}) = 1 - (1 - p_{\\text{retry}})^n \\cdot (1 - p_{\\text{hallucinate}})$$</div>

<p class="l-text">For an agent making 50 tool calls per session with a 2% retry rate and 1% double-call hallucination rate, you will see roughly 1.5 duplicate invocations per session. That is a P0 bug if your tool charges money.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Idempotent charge tool — keyed deduplication</span>
<span class="kw">import</span> hashlib, time

_CHARGE_LOG = {}  <span class="cm"># idempotency_key -> result</span>

<span class="kw">def</span> <span class="fn">charge_card</span>(customer_id: <span class="fn">str</span>, amount_cents: <span class="fn">int</span>, idempotency_key: <span class="fn">str</span>) -&gt; <span class="fn">dict</span>:
    <span class="str">"""Charge a card. Safe to retry with the same idempotency_key."""</span>
    <span class="kw">if</span> idempotency_key <span class="kw">in</span> _CHARGE_LOG:
        <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"ok"</span>, <span class="str">"cached"</span>: <span class="kw">True</span>, **_CHARGE_LOG[idempotency_key]}
    <span class="cm"># ... real Stripe call here ...</span>
    result = {<span class="str">"charge_id"</span>: f<span class="str">"ch_{hashlib.md5(idempotency_key.encode()).hexdigest()[:12]}"</span>,
              <span class="str">"amount_cents"</span>: amount_cents, <span class="str">"ts"</span>: time.<span class="fn">time</span>()}
    _CHARGE_LOG[idempotency_key] = result
    <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"ok"</span>, <span class="str">"cached"</span>: <span class="kw">False</span>, **result}

<span class="cm"># Agent calls twice with the same key — second is deduped</span>
<span class="fn">print</span>(<span class="fn">charge_card</span>(<span class="str">"cust_42"</span>, <span class="num">2500</span>, <span class="str">"order-1001"</span>))
<span class="fn">print</span>(<span class="fn">charge_card</span>(<span class="str">"cust_42"</span>, <span class="num">2500</span>, <span class="str">"order-1001"</span>))  <span class="cm"># cached=True</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>_CHARGE_LOG</code> is an in-process dict mapping <code>idempotency_key</code> to a previously computed result — in production this would be Redis or a Stripe-style server-side dedup table. 2) <code>charge_card(...)</code> first checks <code>idempotency_key in _CHARGE_LOG</code>; on a hit it returns the cached result with <code>"cached": True</code> so the agent can see the call was deduplicated. 3) On a miss it computes a deterministic <code>charge_id</code> from the key via <code>hashlib.md5</code>, stores the result, and returns <code>"cached": False</code> alongside the new <code>charge_id</code> and <code>amount_cents</code>. 4) The two demo calls at the bottom use the same key <code>"order-1001"</code> — the first executes the charge, the second is served from the log, proving that retries cannot double-charge.</p>

<p class="l-text">The agent should pass a <em>deterministic</em> idempotency key derived from the action's intent (e.g., order ID, message hash) — not <code>uuid4()</code>, which would generate a fresh key on each retry and defeat the purpose.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Schema Design — Names &amp; Descriptions</h2>
<p class="l-text">The LLM sees only the JSON schema and the description. Everything else is invisible. Three rules that move accuracy by 10-20 points:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Verb-led names</div><div class="card-body"><code>search_documents</code> beats <code>document_search</code>. <code>create_invoice</code> beats <code>invoice</code>. Models trained on code expect verb_object.</div></div>
<div class="calc-card"><div class="card-title">2. Examples in description</div><div class="card-body">"Use this when the user asks 'where are my orders'. Returns up to 20 orders sorted by date." Concrete examples reduce hallucinated arg shapes.</div></div>
<div class="calc-card"><div class="card-title">3. Enum constraints</div><div class="card-body">If <code>status</code> must be one of {pending, paid, refunded}, use <code>enum</code> in the schema. The model will respect it; free-string fields invite typos.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Anthropic tool_use schema — production-shaped</span>
search_orders_tool = {
    <span class="str">"name"</span>: <span class="str">"search_orders"</span>,
    <span class="str">"description"</span>: (
        <span class="str">"Find orders for a customer by status and date range. "</span>
        <span class="str">"Use this when the user asks about order history, refunds, or shipping. "</span>
        <span class="str">"Example: search_orders(customer_id='cust_42', status='paid', "</span>
        <span class="str">"since='2026-01-01') returns up to 20 orders."</span>
    ),
    <span class="str">"input_schema"</span>: {
        <span class="str">"type"</span>: <span class="str">"object"</span>,
        <span class="str">"properties"</span>: {
            <span class="str">"customer_id"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"description"</span>: <span class="str">"Customer UUID, e.g. cust_42"</span>},
            <span class="str">"status"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"enum"</span>: [<span class="str">"pending"</span>, <span class="str">"paid"</span>, <span class="str">"refunded"</span>, <span class="str">"all"</span>],
                       <span class="str">"default"</span>: <span class="str">"all"</span>},
            <span class="str">"since"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"format"</span>: <span class="str">"date"</span>,
                      <span class="str">"description"</span>: <span class="str">"ISO date YYYY-MM-DD; orders on or after this date"</span>},
            <span class="str">"limit"</span>: {<span class="str">"type"</span>: <span class="str">"integer"</span>, <span class="str">"minimum"</span>: <span class="num">1</span>, <span class="str">"maximum"</span>: <span class="num">100</span>, <span class="str">"default"</span>: <span class="num">20</span>}
        },
        <span class="str">"required"</span>: [<span class="str">"customer_id"</span>]
    }
}

<span class="kw">import</span> anthropic
client = anthropic.<span class="fn">Anthropic</span>()
resp = client.messages.<span class="fn">create</span>(
    model=<span class="str">"claude-sonnet-4-6"</span>,
    max_tokens=<span class="num">1024</span>,
    tools=[search_orders_tool],
    messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"show me Alice's refunds from last month"</span>}]
)
<span class="fn">print</span>(resp.content)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Declares <code>search_orders_tool</code> with a verb-led name and a multi-line <code>description</code> that includes a concrete usage example — the model uses the example to anchor argument shapes. 2) The <code>input_schema.properties</code> map ties each argument to a tight JSON Schema: <code>customer_id</code> as a free string, <code>status</code> as an <code>enum</code> with four legal values plus a <code>default</code>, <code>since</code> as a <code>format:"date"</code> string, and <code>limit</code> as an integer bounded by <code>minimum:1</code> / <code>maximum:100</code>. 3) Only <code>customer_id</code> is in <code>required</code> — every other field is optional with a sensible default, keeping the model's job small. 4) The call to <code>client.messages.create</code> hands the schema to Claude alongside a natural-language request ("show me Alice's refunds from last month"); the model converts that into a structured <code>tool_use</code> block matching the schema.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Schema validation logic — a real LLM would emit JSON; we simulate with jsonschema-style checks against the customers/orders datasets.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Validate an LLM-emitted tool call against schema</span>
<span class="kw">def</span> <span class="fn">validate</span>(call, schema):
    errs = []
    props = schema[<span class="str">"properties"</span>]
    <span class="kw">for</span> k <span class="kw">in</span> schema.<span class="fn">get</span>(<span class="str">"required"</span>, []):
        <span class="kw">if</span> k <span class="kw">not</span> <span class="kw">in</span> call: errs.<span class="fn">append</span>(f<span class="str">"missing required: {k}"</span>)
    <span class="kw">for</span> k, v <span class="kw">in</span> call.<span class="fn">items</span>():
        <span class="kw">if</span> k <span class="kw">not</span> <span class="kw">in</span> props: errs.<span class="fn">append</span>(f<span class="str">"unknown arg: {k}"</span>); <span class="kw">continue</span>
        spec = props[k]
        <span class="kw">if</span> <span class="str">"enum"</span> <span class="kw">in</span> spec <span class="kw">and</span> v <span class="kw">not</span> <span class="kw">in</span> spec[<span class="str">"enum"</span>]:
            errs.<span class="fn">append</span>(f<span class="str">"{k}={v!r} not in {spec['enum']}"</span>)
    <span class="kw">return</span> errs

schema = {<span class="str">"type"</span>:<span class="str">"object"</span>,
          <span class="str">"properties"</span>:{<span class="str">"customer_id"</span>:{<span class="str">"type"</span>:<span class="str">"string"</span>},
                        <span class="str">"status"</span>:{<span class="str">"type"</span>:<span class="str">"string"</span>,<span class="str">"enum"</span>:[<span class="str">"pending"</span>,<span class="str">"paid"</span>,<span class="str">"refunded"</span>,<span class="str">"all"</span>]},
                        <span class="str">"limit"</span>:{<span class="str">"type"</span>:<span class="str">"integer"</span>,<span class="str">"minimum"</span>:<span class="num">1</span>,<span class="str">"maximum"</span>:<span class="num">100</span>}},
          <span class="str">"required"</span>:[<span class="str">"customer_id"</span>]}

good = {<span class="str">"customer_id"</span>:<span class="str">"cust_42"</span>,<span class="str">"status"</span>:<span class="str">"paid"</span>,<span class="str">"limit"</span>:<span class="num">10</span>}
bad  = {<span class="str">"customer_id"</span>:<span class="str">"cust_42"</span>,<span class="str">"status"</span>:<span class="str">"approved"</span>,<span class="str">"limit"</span>:<span class="num">10</span>}  <span class="cm"># bad enum</span>

<span class="fn">print</span>(<span class="str">"good:"</span>, <span class="fn">validate</span>(good, schema))
<span class="fn">print</span>(<span class="str">"bad :"</span>, <span class="fn">validate</span>(bad, schema))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>validate(call, schema)</code> walks every key listed in <code>schema["required"]</code> and pushes a <code>"missing required: ..."</code> error into <code>errs</code> for each absent field. 2) It then iterates <code>call.items()</code>, rejecting any key not declared in <code>schema["properties"]</code> as <code>"unknown arg"</code>. 3) For known keys it checks the per-property <code>enum</code> constraint and reports the actual value plus the legal set when a mismatch is found — exactly the error string you would feed back to the model. 4) The <code>good</code> dict passes all three checks and returns <code>[]</code>; the <code>bad</code> dict trips the enum check on <code>status="approved"</code>, demonstrating the same validation path your dispatcher will use before invoking a real side-effectful tool.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Input Validation &amp; Sanitization</h2>
<p class="l-text">Schemas catch shape errors. They do not catch SQL injection, path traversal, or prompt injection embedded in arguments. Every tool needs a defensive layer between schema validation and side-effect.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SQL tools</div><div class="card-body">Parameterized queries only. Reject queries containing <code>;</code>, <code>--</code>, or DDL keywords if the tool is read-only.</div></div>
<div class="calc-card"><div class="card-title">File tools</div><div class="card-body">Resolve paths and assert they live under an allowed root. Reject <code>..</code> components. Use <code>pathlib.Path.resolve()</code>.</div></div>
<div class="calc-card"><div class="card-title">URL tools</div><div class="card-body">Block <code>file://</code>, <code>localhost</code>, RFC1918 ranges (SSRF). Resolve DNS first; reject if it points internal.</div></div>
<div class="calc-card"><div class="card-title">Shell tools</div><div class="card-body">Never <code>shell=True</code>. Pass argv as a list. Whitelist binaries. Run inside a sandbox container.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Defensive read_file tool with path-traversal protection</span>
<span class="kw">import</span> os
<span class="kw">from</span> pathlib <span class="kw">import</span> Path

ALLOWED_ROOT = <span class="fn">Path</span>(<span class="str">"/workspace"</span>).<span class="fn">resolve</span>()

<span class="kw">def</span> <span class="fn">read_file</span>(path: <span class="fn">str</span>) -&gt; <span class="fn">dict</span>:
    <span class="kw">try</span>:
        target = (ALLOWED_ROOT / path).<span class="fn">resolve</span>()
        <span class="cm"># ensure target is INSIDE allowed root (no ../ escapes)</span>
        target.<span class="fn">relative_to</span>(ALLOWED_ROOT)
    <span class="kw">except</span> (ValueError, OSError) <span class="kw">as</span> e:
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"path_outside_workspace"</span>, <span class="str">"detail"</span>: <span class="fn">str</span>(e)}
    <span class="kw">if</span> <span class="kw">not</span> target.<span class="fn">is_file</span>():
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"not_a_file"</span>}
    <span class="kw">if</span> target.<span class="fn">stat</span>().st_size &gt; 1_000_000:
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"too_large"</span>, <span class="str">"max_bytes"</span>: 1_000_000}
    <span class="kw">return</span> {<span class="str">"content"</span>: target.<span class="fn">read_text</span>(errors=<span class="str">"replace"</span>)[:50_000]}

<span class="cm"># Simulate attempts (would-be) on a real filesystem</span>
<span class="fn">print</span>(<span class="fn">read_file</span>(<span class="str">"safe.txt"</span>))               <span class="cm"># ok or not_a_file</span>
<span class="fn">print</span>(<span class="fn">read_file</span>(<span class="str">"../../etc/passwd"</span>))       <span class="cm"># path_outside_workspace</span>
<span class="fn">print</span>(<span class="fn">read_file</span>(<span class="str">"/etc/shadow"</span>))            <span class="cm"># path_outside_workspace</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Pins <code>ALLOWED_ROOT = Path("/workspace").resolve()</code> as the only directory the tool is allowed to read from — every other path is rejected. 2) <code>read_file(path)</code> joins the user path under the root and calls <code>.resolve()</code> so any <code>../</code> segments are normalised; then <code>target.relative_to(ALLOWED_ROOT)</code> raises <code>ValueError</code> if the normalised path escaped, returning <code>{"error":"path_outside_workspace"}</code>. 3) Two more cheap guards follow: <code>is_file()</code> rejects directories, and <code>stat().st_size &gt; 1_000_000</code> rejects files larger than 1 MB so a hostile path cannot dump gigabytes into the agent's context. 4) The three demo calls show the contract — a normal name resolves, <code>"../../etc/passwd"</code> trips the traversal guard, and an absolute <code>"/etc/shadow"</code> also fails because <code>(ALLOWED_ROOT / "/etc/shadow").resolve()</code> lands outside the root.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sandboxing &amp; Capability Limiting</h2>
<p class="l-text">If a tool runs LLM-generated code (Python REPL, shell, browser), the sandbox is your last line of defense. Three tiers, by attack surface:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tier 1 — In-process</div><div class="card-body"><code>exec()</code> with restricted globals. Useless for security; fine for trusted code. Pyodide in the browser is a soft sandbox of this tier — escape via JS bridge is non-trivial but possible.</div></div>
<div class="calc-card"><div class="card-title">Tier 2 — Container</div><div class="card-body">Docker with <code>--network none</code>, read-only rootfs, dropped caps, seccomp profile. 99% of agent code runners (E2B, Modal sandboxes) live here.</div></div>
<div class="calc-card"><div class="card-title">Tier 3 — VM / gVisor</div><div class="card-body">Firecracker microVMs, gVisor user-space kernel. Used by Replit Agent, Anthropic Computer Use. ~100ms cold start, true kernel isolation.</div></div>
</div>

<div class="calc-highlight">Capability limiting is the principle of least privilege applied to tools. The agent should never have a single tool that can both <code>read_secrets</code> and <code>send_external_email</code>. Split capabilities; require the planner to explicitly compose them, and gate composite plans through a human review for high-impact actions (transferring money, deleting data, sending email to non-team domains).</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Capability-based dispatcher — each tool declares required scopes</span>
TOOLS = {
    <span class="str">"read_orders"</span>:   {<span class="str">"fn"</span>: <span class="kw">lambda</span> **kw: {<span class="str">"orders"</span>: []}, <span class="str">"scopes"</span>: {<span class="str">"orders:read"</span>}},
    <span class="str">"refund_order"</span>:  {<span class="str">"fn"</span>: <span class="kw">lambda</span> **kw: {<span class="str">"refunded"</span>: <span class="kw">True</span>}, <span class="str">"scopes"</span>: {<span class="str">"orders:write"</span>, <span class="str">"money:move"</span>}},
    <span class="str">"send_email"</span>:    {<span class="str">"fn"</span>: <span class="kw">lambda</span> **kw: {<span class="str">"sent"</span>: <span class="kw">True</span>}, <span class="str">"scopes"</span>: {<span class="str">"email:external"</span>}},
}

<span class="kw">def</span> <span class="fn">dispatch</span>(name: <span class="fn">str</span>, args: <span class="fn">dict</span>, granted_scopes: <span class="fn">set</span>) -&gt; <span class="fn">dict</span>:
    <span class="kw">if</span> name <span class="kw">not</span> <span class="kw">in</span> TOOLS:
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"unknown_tool"</span>}
    needed = TOOLS[name][<span class="str">"scopes"</span>]
    missing = needed - granted_scopes
    <span class="kw">if</span> missing:
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"insufficient_scope"</span>, <span class="str">"missing"</span>: <span class="fn">sorted</span>(missing)}
    <span class="kw">return</span> TOOLS[name][<span class="str">"fn"</span>](**args)

<span class="cm"># Read-only agent</span>
ro = {<span class="str">"orders:read"</span>}
<span class="fn">print</span>(<span class="fn">dispatch</span>(<span class="str">"read_orders"</span>, {<span class="str">"customer_id"</span>: <span class="str">"cust_1"</span>}, ro))
<span class="fn">print</span>(<span class="fn">dispatch</span>(<span class="str">"refund_order"</span>, {<span class="str">"order_id"</span>: <span class="str">"o_1"</span>}, ro))   <span class="cm"># blocked</span>
<span class="fn">print</span>(<span class="fn">dispatch</span>(<span class="str">"send_email"</span>, {<span class="str">"to"</span>: <span class="str">"x@y.com"</span>}, ro))        <span class="cm"># blocked</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>TOOLS</code> is a registry where every entry has both a callable <code>fn</code> and a <code>scopes</code> set listing the capabilities required to invoke it — <code>read_orders</code> needs <code>orders:read</code>, <code>refund_order</code> needs both <code>orders:write</code> and <code>money:move</code>. 2) <code>dispatch(name, args, granted_scopes)</code> first looks the tool up and returns <code>"unknown_tool"</code> on miss, then computes <code>needed - granted_scopes</code> to find any missing capabilities and returns <code>"insufficient_scope"</code> with the missing list — never calling the function. 3) Only when the scope set covers the requirements does it invoke <code>TOOLS[name]["fn"](**args)</code>; the gate runs once per call so the cost is negligible. 4) The demo agent is granted only <code>{"orders:read"}</code> — <code>read_orders</code> succeeds, but both <code>refund_order</code> and <code>send_email</code> are blocked at the dispatcher layer, showing how least-privilege scoping prevents an LLM-driven mistake from triggering a money movement.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Result Formats — Structured vs Prose</h2>
<p class="l-text">A tool returns a string back into the model's context. That string costs tokens, fills the scratchpad, and shapes the next reasoning step. Three formats, in order of typical preference:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Compact JSON</div><div class="card-body">Best for structured data. Models parse it perfectly. Use abbreviated keys for high-volume tools (<code>id</code> over <code>order_identifier</code>).</div></div>
<div class="calc-card"><div class="card-title">Markdown table</div><div class="card-body">Good for tabular results the user will see. Models can both consume and pass through to UI.</div></div>
<div class="calc-card"><div class="card-title">Prose summary</div><div class="card-body">Cheapest in tokens but lossy. Use for very large results: "Found 1,247 matches; top 5 below: ..."</div></div>
</div>

<div class="calc-highlight">Always include an <strong>error envelope</strong> with a stable shape: <code>{"error": "&lt;code&gt;", "detail": "&lt;human msg&gt;", "retry_after_s": ?}</code>. The model learns to recognize the envelope and either retry or surface the error to the user. Free-form error strings ("oops something broke") cause hallucinated retries.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Token-budget-aware result formatter</span>
<span class="kw">import</span> json

<span class="kw">def</span> <span class="fn">fmt_result</span>(rows, max_tokens_approx=<span class="num">400</span>):
    <span class="str">"""Return compact JSON; truncate with summary if oversized."""</span>
    full = json.<span class="fn">dumps</span>(rows, separators=(<span class="str">","</span>, <span class="str">":"</span>))
    <span class="cm"># rough token est: 4 chars/token</span>
    <span class="kw">if</span> <span class="fn">len</span>(full) // <span class="num">4</span> &lt;= max_tokens_approx:
        <span class="kw">return</span> full
    head = rows[:<span class="num">5</span>]
    <span class="kw">return</span> json.<span class="fn">dumps</span>({
        <span class="str">"_truncated"</span>: <span class="kw">True</span>,
        <span class="str">"_total"</span>: <span class="fn">len</span>(rows),
        <span class="str">"_shown"</span>: <span class="fn">len</span>(head),
        <span class="str">"rows"</span>: head
    }, separators=(<span class="str">","</span>, <span class="str">":"</span>))

<span class="cm"># Small result — full</span>
small = [{<span class="str">"id"</span>: i, <span class="str">"amt"</span>: i * <span class="num">10</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>)]
<span class="fn">print</span>(<span class="str">"small:"</span>, <span class="fn">fmt_result</span>(small))

<span class="cm"># Large result — truncated</span>
large = [{<span class="str">"id"</span>: i, <span class="str">"amt"</span>: i * <span class="num">10</span>, <span class="str">"note"</span>: <span class="str">"x"</span> * <span class="num">80</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>)]
out = <span class="fn">fmt_result</span>(large)
<span class="fn">print</span>(<span class="str">"large len:"</span>, <span class="fn">len</span>(out), <span class="str">"preview:"</span>, out[:<span class="num">150</span>])
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>fmt_result(rows, max_tokens_approx=400)</code> serialises <code>rows</code> with <code>json.dumps(..., separators=(",", ":"))</code> — the compact separator pair shaves ~20% off the byte count, which translates directly into fewer tokens. 2) It uses <code>len(full) // 4</code> as a cheap proxy for token count (4 chars ≈ 1 token for English-like JSON); if the estimate is under <code>max_tokens_approx</code> it returns the full payload verbatim. 3) When the payload is too large it slices the first 5 rows into <code>head</code> and wraps them in a meta envelope: <code>_truncated: True</code>, <code>_total</code> (original count), <code>_shown</code> (returned count), and the <code>rows</code> array. 4) The two demo calls show both paths — a 3-row payload returns the full JSON, while a 200-row payload returns the truncated envelope so the agent knows there are more rows to fetch on demand.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Retries, Timeouts &amp; Circuit Breakers</h2>
<p class="l-text">Tool wrappers need three layers of resilience: <strong>timeout</strong> (so a hanging API does not stall the agent), <strong>exponential-backoff retry</strong> (for transient 5xx / rate limits), and <strong>circuit breaker</strong> (open the circuit after N consecutive failures so we do not waste 10 retries when the upstream is down).</p>

<div class="katex-block">$$\\text{delay}_n = \\min(\\text{cap}, \\text{base} \\cdot 2^n) \\cdot (1 + U(0, \\text{jitter}))$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Resilient wrapper — timeout, jittered exponential backoff, circuit breaker</span>
<span class="kw">import</span> time, random, math

<span class="kw">class</span> CircuitBreaker:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, threshold=<span class="num">5</span>, cooldown_s=<span class="num">30</span>):
        <span class="kw">self</span>.threshold, <span class="kw">self</span>.cooldown_s = threshold, cooldown_s
        <span class="kw">self</span>.fails, <span class="kw">self</span>.opened_at = <span class="num">0</span>, <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">ok</span>(<span class="kw">self</span>):
        <span class="kw">if</span> <span class="kw">self</span>.opened_at <span class="kw">and</span> time.<span class="fn">time</span>() - <span class="kw">self</span>.opened_at &lt; <span class="kw">self</span>.cooldown_s:
            <span class="kw">return</span> <span class="kw">False</span>
        <span class="kw">if</span> <span class="kw">self</span>.opened_at: <span class="kw">self</span>.opened_at = <span class="kw">None</span>; <span class="kw">self</span>.fails = <span class="num">0</span>
        <span class="kw">return</span> <span class="kw">True</span>
    <span class="kw">def</span> <span class="fn">record</span>(<span class="kw">self</span>, success):
        <span class="kw">if</span> success: <span class="kw">self</span>.fails = <span class="num">0</span>
        <span class="kw">else</span>:
            <span class="kw">self</span>.fails += <span class="num">1</span>
            <span class="kw">if</span> <span class="kw">self</span>.fails &gt;= <span class="kw">self</span>.threshold: <span class="kw">self</span>.opened_at = time.<span class="fn">time</span>()

<span class="kw">def</span> <span class="fn">resilient_call</span>(fn, *args, max_tries=<span class="num">4</span>, base=<span class="num">0.2</span>, cap=<span class="num">2.0</span>, breaker=<span class="kw">None</span>):
    <span class="kw">if</span> breaker <span class="kw">and</span> <span class="kw">not</span> breaker.<span class="fn">ok</span>():
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"circuit_open"</span>}
    last = <span class="kw">None</span>
    <span class="kw">for</span> n <span class="kw">in</span> <span class="fn">range</span>(max_tries):
        <span class="kw">try</span>:
            r = <span class="fn">fn</span>(*args)
            <span class="kw">if</span> breaker: breaker.<span class="fn">record</span>(<span class="kw">True</span>)
            <span class="kw">return</span> r
        <span class="kw">except</span> Exception <span class="kw">as</span> e:
            last = e
            <span class="kw">if</span> n &lt; max_tries - <span class="num">1</span>:
                delay = <span class="fn">min</span>(cap, base * <span class="num">2</span>**n) * (<span class="num">1</span> + random.<span class="fn">random</span>() * <span class="num">0.3</span>)
                time.<span class="fn">sleep</span>(delay)
    <span class="kw">if</span> breaker: breaker.<span class="fn">record</span>(<span class="kw">False</span>)
    <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"max_retries"</span>, <span class="str">"detail"</span>: <span class="fn">str</span>(last)}

<span class="cm"># Flaky tool that fails 60% of the time</span>
attempts = {<span class="str">"n"</span>: <span class="num">0</span>}
<span class="kw">def</span> <span class="fn">flaky</span>():
    attempts[<span class="str">"n"</span>] += <span class="num">1</span>
    <span class="kw">if</span> random.<span class="fn">random</span>() &lt; <span class="num">0.6</span>: <span class="kw">raise</span> <span class="fn">RuntimeError</span>(<span class="str">"transient"</span>)
    <span class="kw">return</span> {<span class="str">"ok"</span>: <span class="kw">True</span>, <span class="str">"attempt"</span>: attempts[<span class="str">"n"</span>]}

random.<span class="fn">seed</span>(<span class="num">7</span>)
brk = <span class="fn">CircuitBreaker</span>()
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    <span class="fn">print</span>(f<span class="str">"call {i}:"</span>, <span class="fn">resilient_call</span>(flaky, breaker=brk))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>CircuitBreaker</code> tracks a <code>fails</code> counter and an <code>opened_at</code> timestamp; <code>ok()</code> returns False while the cooldown is active and <code>record(success)</code> trips <code>opened_at</code> once <code>fails &gt;= threshold</code>. 2) <code>resilient_call(fn, ...)</code> short-circuits with <code>{"error":"circuit_open"}</code> when the breaker is open, then runs up to <code>max_tries=4</code> attempts on <code>fn</code>. 3) On each failure it computes <code>min(cap, base * 2**n) * (1 + random.random()*0.3)</code> — capped exponential backoff with 30% jitter so concurrent agents do not synchronise their retries. 4) The <code>flaky</code> demo fails 60% of the time at random; the seeded loop demonstrates the wrapper retrying through transient errors, recording state on the breaker, and ultimately returning either the successful result or a structured <code>"max_retries"</code> error.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. A Mini Tool Registry — End to End</h2>
<p class="l-text">Tying everything together: a registry that holds tools with their schemas, validates calls, dispatches with retries, and formats results. This is the skeleton of what LangChain's <code>Tool</code> class and the OpenAI/Anthropic SDKs do internally.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, time, hashlib

<span class="kw">class</span> ToolRegistry:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.tools = {}
    <span class="kw">def</span> <span class="fn">register</span>(<span class="kw">self</span>, name, fn, schema, scopes=<span class="kw">None</span>):
        <span class="kw">self</span>.tools[name] = {<span class="str">"fn"</span>: fn, <span class="str">"schema"</span>: schema, <span class="str">"scopes"</span>: <span class="fn">set</span>(scopes <span class="kw">or</span> [])}
    <span class="kw">def</span> <span class="fn">list_schemas</span>(<span class="kw">self</span>):
        <span class="kw">return</span> [{<span class="str">"name"</span>: n, <span class="str">"description"</span>: t[<span class="str">"schema"</span>].<span class="fn">get</span>(<span class="str">"description"</span>, <span class="str">""</span>),
                 <span class="str">"input_schema"</span>: t[<span class="str">"schema"</span>].<span class="fn">get</span>(<span class="str">"input_schema"</span>, {})}
                <span class="kw">for</span> n, t <span class="kw">in</span> <span class="kw">self</span>.tools.<span class="fn">items</span>()]
    <span class="kw">def</span> <span class="fn">call</span>(<span class="kw">self</span>, name, args, granted_scopes):
        <span class="kw">if</span> name <span class="kw">not</span> <span class="kw">in</span> <span class="kw">self</span>.tools:
            <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"unknown_tool"</span>, <span class="str">"available"</span>: <span class="fn">list</span>(<span class="kw">self</span>.tools)}
        t = <span class="kw">self</span>.tools[name]
        missing = t[<span class="str">"scopes"</span>] - granted_scopes
        <span class="kw">if</span> missing:
            <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"insufficient_scope"</span>, <span class="str">"missing"</span>: <span class="fn">sorted</span>(missing)}
        <span class="cm"># validate required keys</span>
        req = t[<span class="str">"schema"</span>].<span class="fn">get</span>(<span class="str">"input_schema"</span>, {}).<span class="fn">get</span>(<span class="str">"required"</span>, [])
        <span class="kw">for</span> k <span class="kw">in</span> req:
            <span class="kw">if</span> k <span class="kw">not</span> <span class="kw">in</span> args: <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"missing_arg"</span>, <span class="str">"arg"</span>: k}
        <span class="kw">try</span>:
            <span class="kw">return</span> {<span class="str">"ok"</span>: <span class="kw">True</span>, <span class="str">"result"</span>: t[<span class="str">"fn"</span>](**args)}
        <span class="kw">except</span> Exception <span class="kw">as</span> e:
            <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"tool_exception"</span>, <span class="str">"detail"</span>: <span class="fn">str</span>(e)}

<span class="cm"># --- register a couple of tools ---</span>
reg = <span class="fn">ToolRegistry</span>()

reg.<span class="fn">register</span>(<span class="str">"search_orders"</span>,
    fn=<span class="kw">lambda</span> customer_id, status=<span class="str">"all"</span>, limit=<span class="num">5</span>: [
        {<span class="str">"id"</span>: f<span class="str">"o_{i}"</span>, <span class="str">"cust"</span>: customer_id, <span class="str">"status"</span>: status, <span class="str">"amt"</span>: (i+<span class="num">1</span>)*<span class="num">100</span>}
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">min</span>(limit, <span class="num">3</span>))
    ],
    schema={<span class="str">"description"</span>: <span class="str">"Find orders for a customer."</span>,
            <span class="str">"input_schema"</span>: {<span class="str">"required"</span>: [<span class="str">"customer_id"</span>]}},
    scopes=[<span class="str">"orders:read"</span>])

reg.<span class="fn">register</span>(<span class="str">"refund_order"</span>,
    fn=<span class="kw">lambda</span> order_id, idempotency_key: {
        <span class="str">"refund_id"</span>: <span class="str">"rf_"</span> + hashlib.<span class="fn">md5</span>(idempotency_key.<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()[:<span class="num">8</span>],
        <span class="str">"order_id"</span>: order_id, <span class="str">"ts"</span>: time.<span class="fn">time</span>()
    },
    schema={<span class="str">"description"</span>: <span class="str">"Refund an order. idempotency_key required."</span>,
            <span class="str">"input_schema"</span>: {<span class="str">"required"</span>: [<span class="str">"order_id"</span>, <span class="str">"idempotency_key"</span>]}},
    scopes=[<span class="str">"orders:write"</span>, <span class="str">"money:move"</span>])

scopes = {<span class="str">"orders:read"</span>, <span class="str">"orders:write"</span>, <span class="str">"money:move"</span>}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(reg.<span class="fn">call</span>(<span class="str">"search_orders"</span>, {<span class="str">"customer_id"</span>:<span class="str">"cust_42"</span>}, scopes), indent=<span class="num">2</span>))
<span class="fn">print</span>(json.<span class="fn">dumps</span>(reg.<span class="fn">call</span>(<span class="str">"refund_order"</span>, {<span class="str">"order_id"</span>:<span class="str">"o_1"</span>,<span class="str">"idempotency_key"</span>:<span class="str">"ord-1-rf"</span>}, scopes), indent=<span class="num">2</span>))
<span class="fn">print</span>(json.<span class="fn">dumps</span>(reg.<span class="fn">call</span>(<span class="str">"refund_order"</span>, {<span class="str">"order_id"</span>:<span class="str">"o_1"</span>}, scopes), indent=<span class="num">2</span>))  <span class="cm"># missing arg</span>
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>ToolRegistry.register(name, fn, schema, scopes)</code> stores a callable, its JSON Schema, and the required scope set — <code>list_schemas()</code> emits the exact shape the LLM expects to see (name + description + input_schema). 2) <code>call(name, args, granted_scopes)</code> stacks the production checks in order: unknown tool → missing scope → missing required arg → exception in the underlying function — each branch returns a structured error envelope the model can read. 3) Two tools are registered with very different blast radius: <code>search_orders</code> needs only <code>orders:read</code>, while <code>refund_order</code> requires both <code>orders:write</code> and <code>money:move</code> and must receive a client-supplied <code>idempotency_key</code>. 4) The three demo calls walk the success paths (read, refund with key) and one failure path (refund missing <code>idempotency_key</code>) so you can read the exact JSON envelope every branch produces.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Production Checklist</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Schema</div><div class="card-body">Verb-led name. Description with example. Enums for closed sets. Required fields minimal.</div></div>
<div class="calc-card"><div class="card-title">Idempotency</div><div class="card-body">Mutating tools accept and respect <code>idempotency_key</code>. Server dedupes for at least 24h.</div></div>
<div class="calc-card"><div class="card-title">Validation</div><div class="card-body">Schema check + domain check (path inside root, URL not internal, SQL parameterized).</div></div>
<div class="calc-card"><div class="card-title">Sandbox</div><div class="card-body">Code-running tools live in containers/microVMs with no network unless required. Time + memory limits.</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">Compact JSON with stable error envelope. Token-budget aware truncation.</div></div>
<div class="calc-card"><div class="card-title">Resilience</div><div class="card-body">Timeout + jittered backoff + circuit breaker. Logged trajectories for postmortems.</div></div>
<div class="calc-card"><div class="card-title">Capabilities</div><div class="card-body">Least privilege per tool. High-impact actions (money, deletes, external email) gated behind human-in-loop.</div></div>
<div class="calc-card"><div class="card-title">Observability</div><div class="card-body">Every call logs: name, args (PII-redacted), latency, status, cost, retry count. Feeds eval (lesson 10).</div></div>
</div>

<div class="calc-highlight">In the next lesson we leave the manual loop behind and use <strong>LangChain</strong> and <strong>LangGraph</strong> — frameworks that wrap everything you just built (registry, dispatch, retries) and add state machines, persistence, and checkpointing on top. The patterns from L4 do not go away; they become the implementation underneath the abstraction.</div>
</div>`,
tr: `<p class="l-text"><strong>Bir agent, ancak araçları kadar iyidir.</strong> Üç kırılgan, belirsiz adlandırılmış, yan-etki dolu araca sahip 200B parametreli bir model, beş iyi tasarlanmış atomik araçla eşleştirilmiş 7B'lik bir modele kaybeder. Araç tasarımı, agent mühendisliğindeki en yüksek kaldıraçlı beceridir — production'a giden bir araçla, tüm öğleden sonra parametre uyduran bir araç arasındaki fark; şema netliğine, idempotency'ye ve sonuç biçimlendirmesine indirgenir.</p>

<p class="l-text">Production'da araç çağrıları, agent'ın gerçekliğe dokunduğu yüzeydir: veritabanına vururlar, müşteri kartlarından para çekerler, e-posta gönderirler, pod yeniden başlatırlar. Kötü bir araç tasarımı sadece bir UX sorunu değildir — beklemede olan bir production olayıdır. Bu ders bir oyun kitabıdır: atomik vs kompozit, idempotency anahtarları, LLM'lerin gerçekten uyduğu JSON-şema kalıpları, güvenilmez kodun sandbox'lanması, yetenek kısıtlama ve context'i şişirmeden döngüyü kapatan sonuç biçimleri.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Atomik vs kompozit ödünleşimi ve atomik kuralı bilinçli olarak ne zaman ihlal edeceğini</li>
<li>Idempotency anahtarları ve retry semantikleri — neden <code>POST</code>-tarzı araçların buna ihtiyacı vardır</li>
<li>JSON-şema tasarım kalıpları: net adlar, açıklamada örnekler, enum kısıtlamaları</li>
<li>Güvenlik: girdi doğrulama, sandbox'lama (Docker, gVisor, Pyodide), yetenek kısıtlama</li>
<li>Araç sonuç biçimleri: yapılandırılmış vs serbest metin, hata zarfları, token bütçesi hijyeni</li>
<li>Dispatch, doğrulama ve retry içeren çalışan bir araç register'ı — tarayıcında çalıştırılabilir</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Atomik vs Kompozit Araçlar</h2>
<p class="l-text">Bir <strong>atomik araç</strong> tek bir iş yapar — <code>get_weather(city)</code>, <code>send_email(to, subject, body)</code>. Bir <strong>kompozit araç</strong> birden fazla ilkel adımı zincirler — <code>book_trip(origin, destination, dates)</code> içeride uçuş arama, otel arama ve ödeme çağırır. İkisinin de geçerli kullanım durumları vardır. Varsayılan kural: <em>atomik başla, sadece LLM tutarlı biçimde aynı çok-adımlı kalıbı üretiyorsa kompozit yap</em>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Atomik</div><div class="card-body">Az parametre, tek yan-etki, test edilmesi kolay. LLM kompozisyon üzerinde tam kontrole sahip. Bedeli: agent döngüsünde daha fazla tur.</div></div>
<div class="calc-card"><div class="card-title">Kompozit</div><div class="card-body">Çok-adımlı tarifleri paketler. Token maliyetini ve tur sayısını azaltır. Risk: tarif ortasındaki hataları gizler; LLM kısmi başarısızlıktan kurtulamaz.</div></div>
<div class="calc-card"><div class="card-title">Sezgi</div><div class="card-body">Tarif kullanıcılar arasında %90'dan fazla aynıysa kompozit. Kullanıcılar ara sonuçlara göre dallanıyorsa atomik. Loglanmış yörüngeler hangisi olduğunu söyler.</div></div>
</div>

<div class="calc-highlight">Yaygın bir anti-pattern: içeride arama, özetleme ve rapor yazan <code>do_research(topic)</code> adlı bir araç. LLM akışın ortasına eleştiri enjekte edemez, sadece aramayı yeniden deneyemez. Bunu <code>web_search</code>, <code>read_url</code>, <code>summarize</code> şeklinde böl — kompozisyonu agent döngüsü yönlendirsin.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Idempotency &amp; Retry Semantikleri</h2>
<p class="l-text">Ağ çağrıları başarısız olur. LLM'ler yinelenen çağrılar uydurur. Her ikisi de aracınızın aynı mantıksal eylem için iki kez çağrılacağı anlamına gelir. <strong>Idempotency</strong> = aracı N kez çağırmak, bir kez çağırmakla aynı gözlemlenebilir etkiye sahiptir. Sadece-okuma araçları (<code>get_user</code>) doğal olarak idempotent'tir. Mutasyon araçlarına <strong>idempotency anahtarı</strong> gerekir — istemcinin sağladığı, sunucunun deduplication için kullandığı benzersiz bir kimlik.</p>

<div class="katex-block">$$P(\\text{duplicate charge}) = 1 - (1 - p_{\\text{retry}})^n \\cdot (1 - p_{\\text{hallucinate}})$$</div>

<p class="l-text">%2 retry oranı ve %1 çift-çağrı halüsinasyon oranı ile oturum başına 50 araç çağrısı yapan bir agent için, oturum başına yaklaşık 1.5 yinelenen çağırma görürsünüz. Aracınız para çekiyorsa bu bir P0 hatasıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Idempotent charge tool — keyed deduplication</span>
<span class="kw">import</span> hashlib, time

_CHARGE_LOG = {}  <span class="cm"># idempotency_key -> result</span>

<span class="kw">def</span> <span class="fn">charge_card</span>(customer_id: <span class="fn">str</span>, amount_cents: <span class="fn">int</span>, idempotency_key: <span class="fn">str</span>) -&gt; <span class="fn">dict</span>:
    <span class="str">"""Charge a card. Safe to retry with the same idempotency_key."""</span>
    <span class="kw">if</span> idempotency_key <span class="kw">in</span> _CHARGE_LOG:
        <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"ok"</span>, <span class="str">"cached"</span>: <span class="kw">True</span>, **_CHARGE_LOG[idempotency_key]}
    <span class="cm"># ... real Stripe call here ...</span>
    result = {<span class="str">"charge_id"</span>: f<span class="str">"ch_{hashlib.md5(idempotency_key.encode()).hexdigest()[:12]}"</span>,
              <span class="str">"amount_cents"</span>: amount_cents, <span class="str">"ts"</span>: time.<span class="fn">time</span>()}
    _CHARGE_LOG[idempotency_key] = result
    <span class="kw">return</span> {<span class="str">"status"</span>: <span class="str">"ok"</span>, <span class="str">"cached"</span>: <span class="kw">False</span>, **result}

<span class="cm"># Agent calls twice with the same key — second is deduped</span>
<span class="fn">print</span>(<span class="fn">charge_card</span>(<span class="str">"cust_42"</span>, <span class="num">2500</span>, <span class="str">"order-1001"</span>))
<span class="fn">print</span>(<span class="fn">charge_card</span>(<span class="str">"cust_42"</span>, <span class="num">2500</span>, <span class="str">"order-1001"</span>))  <span class="cm"># cached=True</span>
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>_CHARGE_LOG</code>, <code>idempotency_key</code>'i daha önce hesaplanmış sonuca eşleyen süreç-içi bir sözlüktür — production'da bu Redis veya Stripe-tarzı sunucu-taraflı dedup tablosu olur. 2) <code>charge_card(...)</code> önce <code>idempotency_key in _CHARGE_LOG</code> kontrolü yapar; bulursa cache'lenmiş sonucu <code>"cached": True</code> ile döner ve agent çağrının deduplicate edildiğini görür. 3) Bulamazsa anahtardan <code>hashlib.md5</code> ile deterministik bir <code>charge_id</code> üretir, sonucu saklar ve yeni <code>charge_id</code> ile <code>amount_cents</code>'i <code>"cached": False</code> bayrağı ile döner. 4) En alttaki iki demo çağrısı aynı <code>"order-1001"</code> anahtarını kullanır — birincisi tahsilatı uygular, ikincisi log'dan servis edilir; böylece retry'lerin çift çekim yapamayacağını kanıtlar.</p>

<p class="l-text">Agent, eylemin niyetinden türetilmiş <em>deterministik</em> bir idempotency anahtarı geçmelidir (ör. order ID, mesaj hash'i) — her retry'de yeni bir anahtar üretip amacı bozacak olan <code>uuid4()</code> değil.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Şema Tasarımı — Adlar &amp; Açıklamalar</h2>
<p class="l-text">LLM yalnızca JSON şemasını ve açıklamayı görür. Geri kalanı görünmezdir. Doğruluğu 10-20 puan artıran üç kural:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Fiil-öncüllü adlar</div><div class="card-body"><code>search_documents</code>, <code>document_search</code>'tan iyidir. <code>create_invoice</code>, <code>invoice</code>'tan iyidir. Kod üzerinde eğitilmiş modeller verb_object bekler.</div></div>
<div class="calc-card"><div class="card-title">2. Açıklamada örnekler</div><div class="card-body">"Kullanıcı 'siparişlerim nerede' diye sorduğunda kullan. Tarihe göre sıralı en fazla 20 sipariş döndürür." Somut örnekler argüman şekli halüsinasyonlarını azaltır.</div></div>
<div class="calc-card"><div class="card-title">3. Enum kısıtlamaları</div><div class="card-body"><code>status</code> {pending, paid, refunded} kümesinden biri olmalıysa şemada <code>enum</code> kullan. Model buna saygı gösterir; serbest-string alanlar yazım hatalarına davetiyedir.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Anthropic tool_use schema — production-shaped</span>
search_orders_tool = {
    <span class="str">"name"</span>: <span class="str">"search_orders"</span>,
    <span class="str">"description"</span>: (
        <span class="str">"Find orders for a customer by status and date range. "</span>
        <span class="str">"Use this when the user asks about order history, refunds, or shipping. "</span>
        <span class="str">"Example: search_orders(customer_id='cust_42', status='paid', "</span>
        <span class="str">"since='2026-01-01') returns up to 20 orders."</span>
    ),
    <span class="str">"input_schema"</span>: {
        <span class="str">"type"</span>: <span class="str">"object"</span>,
        <span class="str">"properties"</span>: {
            <span class="str">"customer_id"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"description"</span>: <span class="str">"Customer UUID, e.g. cust_42"</span>},
            <span class="str">"status"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"enum"</span>: [<span class="str">"pending"</span>, <span class="str">"paid"</span>, <span class="str">"refunded"</span>, <span class="str">"all"</span>],
                       <span class="str">"default"</span>: <span class="str">"all"</span>},
            <span class="str">"since"</span>: {<span class="str">"type"</span>: <span class="str">"string"</span>, <span class="str">"format"</span>: <span class="str">"date"</span>,
                      <span class="str">"description"</span>: <span class="str">"ISO date YYYY-MM-DD; orders on or after this date"</span>},
            <span class="str">"limit"</span>: {<span class="str">"type"</span>: <span class="str">"integer"</span>, <span class="str">"minimum"</span>: <span class="num">1</span>, <span class="str">"maximum"</span>: <span class="num">100</span>, <span class="str">"default"</span>: <span class="num">20</span>}
        },
        <span class="str">"required"</span>: [<span class="str">"customer_id"</span>]
    }
}

<span class="kw">import</span> anthropic
client = anthropic.<span class="fn">Anthropic</span>()
resp = client.messages.<span class="fn">create</span>(
    model=<span class="str">"claude-sonnet-4-6"</span>,
    max_tokens=<span class="num">1024</span>,
    tools=[search_orders_tool],
    messages=[{<span class="str">"role"</span>: <span class="str">"user"</span>, <span class="str">"content"</span>: <span class="str">"show me Alice's refunds from last month"</span>}]
)
<span class="fn">print</span>(resp.content)
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>search_orders_tool</code>'u fiil-öncüllü bir adla ve somut bir kullanım örneği içeren çok-satırlı bir <code>description</code> ile tanımlar — model bu örneği argüman şekillerini sabitlemek için kullanır. 2) <code>input_schema.properties</code> haritası her argümanı sıkı bir JSON Schema'ya bağlar: <code>customer_id</code> serbest string, <code>status</code> dört yasal değer ile bir <code>enum</code> artı <code>default</code>, <code>since</code> <code>format:"date"</code> string'i ve <code>limit</code> <code>minimum:1</code> / <code>maximum:100</code> ile sınırlı integer. 3) <code>required</code> içinde yalnızca <code>customer_id</code> var — diğer her alan makul varsayılanlarla opsiyoneldir, modelin işini küçük tutar. 4) <code>client.messages.create</code> çağrısı şemayı doğal dil bir istekle birlikte ("show me Alice's refunds from last month") Claude'a verir; model bunu şemaya uyan yapılandırılmış bir <code>tool_use</code> bloğuna çevirir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Şema doğrulama mantığı — gerçek bir LLM JSON yayardı; biz customers/orders veri kümelerine karşı jsonschema-tarzı kontrollerle simüle ediyoruz.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Validate an LLM-emitted tool call against schema</span>
<span class="kw">def</span> <span class="fn">validate</span>(call, schema):
    errs = []
    props = schema[<span class="str">"properties"</span>]
    <span class="kw">for</span> k <span class="kw">in</span> schema.<span class="fn">get</span>(<span class="str">"required"</span>, []):
        <span class="kw">if</span> k <span class="kw">not</span> <span class="kw">in</span> call: errs.<span class="fn">append</span>(f<span class="str">"missing required: {k}"</span>)
    <span class="kw">for</span> k, v <span class="kw">in</span> call.<span class="fn">items</span>():
        <span class="kw">if</span> k <span class="kw">not</span> <span class="kw">in</span> props: errs.<span class="fn">append</span>(f<span class="str">"unknown arg: {k}"</span>); <span class="kw">continue</span>
        spec = props[k]
        <span class="kw">if</span> <span class="str">"enum"</span> <span class="kw">in</span> spec <span class="kw">and</span> v <span class="kw">not</span> <span class="kw">in</span> spec[<span class="str">"enum"</span>]:
            errs.<span class="fn">append</span>(f<span class="str">"{k}={v!r} not in {spec['enum']}"</span>)
    <span class="kw">return</span> errs

schema = {<span class="str">"type"</span>:<span class="str">"object"</span>,
          <span class="str">"properties"</span>:{<span class="str">"customer_id"</span>:{<span class="str">"type"</span>:<span class="str">"string"</span>},
                        <span class="str">"status"</span>:{<span class="str">"type"</span>:<span class="str">"string"</span>,<span class="str">"enum"</span>:[<span class="str">"pending"</span>,<span class="str">"paid"</span>,<span class="str">"refunded"</span>,<span class="str">"all"</span>]},
                        <span class="str">"limit"</span>:{<span class="str">"type"</span>:<span class="str">"integer"</span>,<span class="str">"minimum"</span>:<span class="num">1</span>,<span class="str">"maximum"</span>:<span class="num">100</span>}},
          <span class="str">"required"</span>:[<span class="str">"customer_id"</span>]}

good = {<span class="str">"customer_id"</span>:<span class="str">"cust_42"</span>,<span class="str">"status"</span>:<span class="str">"paid"</span>,<span class="str">"limit"</span>:<span class="num">10</span>}
bad  = {<span class="str">"customer_id"</span>:<span class="str">"cust_42"</span>,<span class="str">"status"</span>:<span class="str">"approved"</span>,<span class="str">"limit"</span>:<span class="num">10</span>}  <span class="cm"># bad enum</span>

<span class="fn">print</span>(<span class="str">"good:"</span>, <span class="fn">validate</span>(good, schema))
<span class="fn">print</span>(<span class="str">"bad :"</span>, <span class="fn">validate</span>(bad, schema))
</code></pre></div>
<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>validate(call, schema)</code> <code>schema["required"]</code>'da listelenen her anahtarı dolaşır ve eksik her alan için <code>errs</code> listesine <code>"missing required: ..."</code> ekler. 2) Sonra <code>call.items()</code>'i iterler; <code>schema["properties"]</code>'de bildirilmemiş her anahtarı <code>"unknown arg"</code> olarak reddeder. 3) Bilinen anahtarlar için property başına <code>enum</code> kısıtını kontrol eder ve uyumsuzluk olduğunda gerçek değeri yasal kümeyle birlikte raporlar — bu tam olarak modele geri besleyeceğin hata string'idir. 4) <code>good</code> dict'i üç kontrolden de geçer ve <code>[]</code> döner; <code>bad</code> dict'i <code>status="approved"</code> üzerinde enum kontrolüne takılır — gerçek yan-etkili bir tool çağrılmadan önce dispatcher'ın izleyeceği aynı doğrulama yolunu gösterir.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Girdi Doğrulama &amp; Sanitizasyon</h2>
<p class="l-text">Şemalar şekil hatalarını yakalar. SQL injection, path traversal veya argümanlara gömülmüş prompt injection'ı yakalamaz. Her aracın şema doğrulama ile yan-etki arasında savunmacı bir katmana ihtiyacı vardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SQL araçları</div><div class="card-body">Yalnızca parametreli sorgular. Araç salt-okunursa <code>;</code>, <code>--</code> veya DDL anahtar kelimeleri içeren sorguları reddet.</div></div>
<div class="calc-card"><div class="card-title">Dosya araçları</div><div class="card-body">Yolları çöz ve izin verilen kök altında olduklarını doğrula. <code>..</code> bileşenlerini reddet. <code>pathlib.Path.resolve()</code> kullan.</div></div>
<div class="calc-card"><div class="card-title">URL araçları</div><div class="card-body"><code>file://</code>, <code>localhost</code>, RFC1918 aralıklarını engelle (SSRF). Önce DNS çöz; iç adresi gösteriyorsa reddet.</div></div>
<div class="calc-card"><div class="card-title">Shell araçları</div><div class="card-body">Asla <code>shell=True</code> kullanma. argv'yi liste olarak geçir. İkilileri whitelist'le. Sandbox container içinde çalıştır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Defensive read_file tool with path-traversal protection</span>
<span class="kw">import</span> os
<span class="kw">from</span> pathlib <span class="kw">import</span> Path

ALLOWED_ROOT = <span class="fn">Path</span>(<span class="str">"/workspace"</span>).<span class="fn">resolve</span>()

<span class="kw">def</span> <span class="fn">read_file</span>(path: <span class="fn">str</span>) -&gt; <span class="fn">dict</span>:
    <span class="kw">try</span>:
        target = (ALLOWED_ROOT / path).<span class="fn">resolve</span>()
        <span class="cm"># ensure target is INSIDE allowed root (no ../ escapes)</span>
        target.<span class="fn">relative_to</span>(ALLOWED_ROOT)
    <span class="kw">except</span> (ValueError, OSError) <span class="kw">as</span> e:
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"path_outside_workspace"</span>, <span class="str">"detail"</span>: <span class="fn">str</span>(e)}
    <span class="kw">if</span> <span class="kw">not</span> target.<span class="fn">is_file</span>():
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"not_a_file"</span>}
    <span class="kw">if</span> target.<span class="fn">stat</span>().st_size &gt; 1_000_000:
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"too_large"</span>, <span class="str">"max_bytes"</span>: 1_000_000}
    <span class="kw">return</span> {<span class="str">"content"</span>: target.<span class="fn">read_text</span>(errors=<span class="str">"replace"</span>)[:50_000]}

<span class="cm"># Simulate attempts (would-be) on a real filesystem</span>
<span class="fn">print</span>(<span class="fn">read_file</span>(<span class="str">"safe.txt"</span>))               <span class="cm"># ok or not_a_file</span>
<span class="fn">print</span>(<span class="fn">read_file</span>(<span class="str">"../../etc/passwd"</span>))       <span class="cm"># path_outside_workspace</span>
<span class="fn">print</span>(<span class="fn">read_file</span>(<span class="str">"/etc/shadow"</span>))            <span class="cm"># path_outside_workspace</span>
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>ALLOWED_ROOT = Path("/workspace").resolve()</code>'yi tool'un okuyabildiği tek dizin olarak sabitler — başka her yol reddedilir. 2) <code>read_file(path)</code> kullanıcı yolunu kök altına ekler ve <code>.resolve()</code>'i çağırır; böylece <code>../</code> bileşenleri normalleştirilir; ardından <code>target.relative_to(ALLOWED_ROOT)</code> normalleştirilmiş yol kökten kaçtıysa <code>ValueError</code> fırlatır ve <code>{"error":"path_outside_workspace"}</code> döner. 3) İki ucuz guard daha gelir: <code>is_file()</code> dizinleri reddeder ve <code>stat().st_size &gt; 1_000_000</code> 1 MB'tan büyük dosyaları reddeder — düşmanca bir yolun agent context'ine gigabyte'lar dökmesini engeller. 4) Üç demo çağrısı sözleşmeyi gösterir — normal bir ad çözülür, <code>"../../etc/passwd"</code> traversal guard'a takılır ve mutlak <code>"/etc/shadow"</code> de başarısız olur çünkü <code>(ALLOWED_ROOT / "/etc/shadow").resolve()</code> kökün dışına düşer.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Sandbox &amp; Yetenek Kısıtlama</h2>
<p class="l-text">Bir araç LLM-üretimli kod çalıştırıyorsa (Python REPL, shell, browser), sandbox son savunma hattınızdır. Saldırı yüzeyine göre üç kademe:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kademe 1 — In-process</div><div class="card-body">Kısıtlanmış global'lerle <code>exec()</code>. Güvenlik için kullanışsızdır; güvenilen kod için iyidir. Tarayıcıdaki Pyodide bu kademenin yumuşak bir sandbox'ıdır — JS köprüsü üzerinden kaçış kolay değildir ama mümkündür.</div></div>
<div class="calc-card"><div class="card-title">Kademe 2 — Container</div><div class="card-body"><code>--network none</code>, salt-okunur rootfs, düşürülmüş cap'ler, seccomp profili olan Docker. Agent kod çalıştırıcılarının %99'u (E2B, Modal sandbox'ları) burada yaşar.</div></div>
<div class="calc-card"><div class="card-title">Kademe 3 — VM / gVisor</div><div class="card-body">Firecracker microVM'leri, gVisor kullanıcı-uzayı kernel. Replit Agent, Anthropic Computer Use tarafından kullanılır. ~100ms soğuk başlangıç, gerçek kernel izolasyonu.</div></div>
</div>

<div class="calc-highlight">Yetenek kısıtlama, en az ayrıcalık ilkesinin araçlara uygulanmasıdır. Agent'ın asla hem <code>read_secrets</code> hem <code>send_external_email</code> yapabilen tek bir aracı olmamalıdır. Yetenekleri böl; planlayıcının onları açıkça birleştirmesini iste ve yüksek-etkili eylemler (para transferi, veri silme, takım dışı domain'lere e-posta) için kompozit planları insan incelemesinden geçir.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Capability-based dispatcher — each tool declares required scopes</span>
TOOLS = {
    <span class="str">"read_orders"</span>:   {<span class="str">"fn"</span>: <span class="kw">lambda</span> **kw: {<span class="str">"orders"</span>: []}, <span class="str">"scopes"</span>: {<span class="str">"orders:read"</span>}},
    <span class="str">"refund_order"</span>:  {<span class="str">"fn"</span>: <span class="kw">lambda</span> **kw: {<span class="str">"refunded"</span>: <span class="kw">True</span>}, <span class="str">"scopes"</span>: {<span class="str">"orders:write"</span>, <span class="str">"money:move"</span>}},
    <span class="str">"send_email"</span>:    {<span class="str">"fn"</span>: <span class="kw">lambda</span> **kw: {<span class="str">"sent"</span>: <span class="kw">True</span>}, <span class="str">"scopes"</span>: {<span class="str">"email:external"</span>}},
}

<span class="kw">def</span> <span class="fn">dispatch</span>(name: <span class="fn">str</span>, args: <span class="fn">dict</span>, granted_scopes: <span class="fn">set</span>) -&gt; <span class="fn">dict</span>:
    <span class="kw">if</span> name <span class="kw">not</span> <span class="kw">in</span> TOOLS:
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"unknown_tool"</span>}
    needed = TOOLS[name][<span class="str">"scopes"</span>]
    missing = needed - granted_scopes
    <span class="kw">if</span> missing:
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"insufficient_scope"</span>, <span class="str">"missing"</span>: <span class="fn">sorted</span>(missing)}
    <span class="kw">return</span> TOOLS[name][<span class="str">"fn"</span>](**args)

<span class="cm"># Read-only agent</span>
ro = {<span class="str">"orders:read"</span>}
<span class="fn">print</span>(<span class="fn">dispatch</span>(<span class="str">"read_orders"</span>, {<span class="str">"customer_id"</span>: <span class="str">"cust_1"</span>}, ro))
<span class="fn">print</span>(<span class="fn">dispatch</span>(<span class="str">"refund_order"</span>, {<span class="str">"order_id"</span>: <span class="str">"o_1"</span>}, ro))   <span class="cm"># blocked</span>
<span class="fn">print</span>(<span class="fn">dispatch</span>(<span class="str">"send_email"</span>, {<span class="str">"to"</span>: <span class="str">"x@y.com"</span>}, ro))        <span class="cm"># blocked</span>
</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>TOOLS</code> her girişi hem bir çağrılabilir <code>fn</code> hem de onu çağırmak için gereken yetenekleri listeleyen bir <code>scopes</code> kümesi olan bir kayıt defteridir — <code>read_orders</code> yalnızca <code>orders:read</code> ister, <code>refund_order</code> ise hem <code>orders:write</code> hem de <code>money:move</code>'a ihtiyaç duyar. 2) <code>dispatch(name, args, granted_scopes)</code> önce tool'u arar ve bulamazsa <code>"unknown_tool"</code> döner, sonra <code>needed - granted_scopes</code>'u hesaplayarak eksik yetenekleri bulur ve <code>"insufficient_scope"</code>'u eksik listesiyle döner — fonksiyon hiç çağrılmaz. 3) Yalnızca yetenek kümesi gereksinimleri karşıladığında <code>TOOLS[name]["fn"](**args)</code> çağrılır; kapı çağrı başına bir kez çalıştığı için maliyet ihmal edilebilir. 4) Demo agent yalnızca <code>{"orders:read"}</code> ile yetkilendirilmiştir — <code>read_orders</code> başarılı olur, ama hem <code>refund_order</code> hem de <code>send_email</code> dispatcher katmanında bloklanır; LLM kaynaklı bir hatanın para hareketini tetiklemesini en az ayrıcalık prensibinin nasıl önlediğini gösterir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Sonuç Biçimleri — Yapılandırılmış vs Serbest Metin</h2>
<p class="l-text">Bir araç, modelin context'ine geri bir string döndürür. Bu string token harcar, scratchpad'i doldurur ve bir sonraki muhakeme adımını şekillendirir. Tipik tercih sırasıyla üç biçim:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kompakt JSON</div><div class="card-body">Yapılandırılmış veri için en iyisi. Modeller mükemmel ayrıştırır. Yüksek-hacimli araçlar için kısaltılmış anahtarlar kullan (<code>order_identifier</code> yerine <code>id</code>).</div></div>
<div class="calc-card"><div class="card-title">Markdown tablo</div><div class="card-body">Kullanıcının göreceği tablosal sonuçlar için iyi. Modeller hem tüketebilir hem UI'ya geçirebilir.</div></div>
<div class="calc-card"><div class="card-title">Serbest metin özet</div><div class="card-body">Token bakımından en ucuzu ama kayıplı. Çok büyük sonuçlar için kullan: "1.247 eşleşme bulundu; ilk 5 aşağıda: ..."</div></div>
</div>

<div class="calc-highlight">Daima sabit şekilli bir <strong>hata zarfı</strong> dahil et: <code>{"error": "&lt;code&gt;", "detail": "&lt;human msg&gt;", "retry_after_s": ?}</code>. Model zarfı tanımayı öğrenir ve ya yeniden dener ya da hatayı kullanıcıya yansıtır. Serbest biçimli hata string'leri ("eyvah bir şey kırıldı") halüsinasyonlu retry'lere yol açar.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Token-budget-aware result formatter</span>
<span class="kw">import</span> json

<span class="kw">def</span> <span class="fn">fmt_result</span>(rows, max_tokens_approx=<span class="num">400</span>):
    <span class="str">"""Return compact JSON; truncate with summary if oversized."""</span>
    full = json.<span class="fn">dumps</span>(rows, separators=(<span class="str">","</span>, <span class="str">":"</span>))
    <span class="cm"># rough token est: 4 chars/token</span>
    <span class="kw">if</span> <span class="fn">len</span>(full) // <span class="num">4</span> &lt;= max_tokens_approx:
        <span class="kw">return</span> full
    head = rows[:<span class="num">5</span>]
    <span class="kw">return</span> json.<span class="fn">dumps</span>({
        <span class="str">"_truncated"</span>: <span class="kw">True</span>,
        <span class="str">"_total"</span>: <span class="fn">len</span>(rows),
        <span class="str">"_shown"</span>: <span class="fn">len</span>(head),
        <span class="str">"rows"</span>: head
    }, separators=(<span class="str">","</span>, <span class="str">":"</span>))

<span class="cm"># Small result — full</span>
small = [{<span class="str">"id"</span>: i, <span class="str">"amt"</span>: i * <span class="num">10</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>)]
<span class="fn">print</span>(<span class="str">"small:"</span>, <span class="fn">fmt_result</span>(small))

<span class="cm"># Large result — truncated</span>
large = [{<span class="str">"id"</span>: i, <span class="str">"amt"</span>: i * <span class="num">10</span>, <span class="str">"note"</span>: <span class="str">"x"</span> * <span class="num">80</span>} <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">200</span>)]
out = <span class="fn">fmt_result</span>(large)
<span class="fn">print</span>(<span class="str">"large len:"</span>, <span class="fn">len</span>(out), <span class="str">"preview:"</span>, out[:<span class="num">150</span>])
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>fmt_result(rows, max_tokens_approx=400)</code> <code>rows</code>'u <code>json.dumps(..., separators=(",", ":"))</code> ile serileştirir — kompakt ayırıcı çifti byte sayısının ~%20'sini kırpar, bu da doğrudan daha az token'a çevrilir. 2) Token tahmini için ucuz bir proxy olarak <code>len(full) // 4</code> kullanır (İngilizce-tipi JSON için 4 karakter ≈ 1 token); tahmin <code>max_tokens_approx</code>'un altındaysa payload'u olduğu gibi döner. 3) Payload çok büyükse ilk 5 satırı <code>head</code>'e dilimler ve bunları bir meta zarfla sarar: <code>_truncated: True</code>, <code>_total</code> (orijinal sayı), <code>_shown</code> (dönen sayı) ve <code>rows</code> dizisi. 4) İki demo çağrısı her iki yolu da gösterir — 3-satırlık payload tam JSON'u döner, 200-satırlık payload ise kesilmiş zarfı döner; böylece agent talep üzerine daha çok satır çekmesi gerektiğini bilir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Retry, Timeout &amp; Devre Kesiciler</h2>
<p class="l-text">Araç sarmalayıcılarının üç dirençlilik katmanına ihtiyacı vardır: <strong>timeout</strong> (asılı kalan bir API agent'ı tıkamasın diye), <strong>üstel-geri çekilmeli retry</strong> (geçici 5xx / rate limit'ler için) ve <strong>devre kesici</strong> (N ardışık başarısızlıktan sonra devreyi aç ki upstream çöktüğünde 10 retry boşa harcamayalım).</p>

<div class="katex-block">$$\\text{delay}_n = \\min(\\text{cap}, \\text{base} \\cdot 2^n) \\cdot (1 + U(0, \\text{jitter}))$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Resilient wrapper — timeout, jittered exponential backoff, circuit breaker</span>
<span class="kw">import</span> time, random, math

<span class="kw">class</span> CircuitBreaker:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, threshold=<span class="num">5</span>, cooldown_s=<span class="num">30</span>):
        <span class="kw">self</span>.threshold, <span class="kw">self</span>.cooldown_s = threshold, cooldown_s
        <span class="kw">self</span>.fails, <span class="kw">self</span>.opened_at = <span class="num">0</span>, <span class="kw">None</span>
    <span class="kw">def</span> <span class="fn">ok</span>(<span class="kw">self</span>):
        <span class="kw">if</span> <span class="kw">self</span>.opened_at <span class="kw">and</span> time.<span class="fn">time</span>() - <span class="kw">self</span>.opened_at &lt; <span class="kw">self</span>.cooldown_s:
            <span class="kw">return</span> <span class="kw">False</span>
        <span class="kw">if</span> <span class="kw">self</span>.opened_at: <span class="kw">self</span>.opened_at = <span class="kw">None</span>; <span class="kw">self</span>.fails = <span class="num">0</span>
        <span class="kw">return</span> <span class="kw">True</span>
    <span class="kw">def</span> <span class="fn">record</span>(<span class="kw">self</span>, success):
        <span class="kw">if</span> success: <span class="kw">self</span>.fails = <span class="num">0</span>
        <span class="kw">else</span>:
            <span class="kw">self</span>.fails += <span class="num">1</span>
            <span class="kw">if</span> <span class="kw">self</span>.fails &gt;= <span class="kw">self</span>.threshold: <span class="kw">self</span>.opened_at = time.<span class="fn">time</span>()

<span class="kw">def</span> <span class="fn">resilient_call</span>(fn, *args, max_tries=<span class="num">4</span>, base=<span class="num">0.2</span>, cap=<span class="num">2.0</span>, breaker=<span class="kw">None</span>):
    <span class="kw">if</span> breaker <span class="kw">and</span> <span class="kw">not</span> breaker.<span class="fn">ok</span>():
        <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"circuit_open"</span>}
    last = <span class="kw">None</span>
    <span class="kw">for</span> n <span class="kw">in</span> <span class="fn">range</span>(max_tries):
        <span class="kw">try</span>:
            r = <span class="fn">fn</span>(*args)
            <span class="kw">if</span> breaker: breaker.<span class="fn">record</span>(<span class="kw">True</span>)
            <span class="kw">return</span> r
        <span class="kw">except</span> Exception <span class="kw">as</span> e:
            last = e
            <span class="kw">if</span> n &lt; max_tries - <span class="num">1</span>:
                delay = <span class="fn">min</span>(cap, base * <span class="num">2</span>**n) * (<span class="num">1</span> + random.<span class="fn">random</span>() * <span class="num">0.3</span>)
                time.<span class="fn">sleep</span>(delay)
    <span class="kw">if</span> breaker: breaker.<span class="fn">record</span>(<span class="kw">False</span>)
    <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"max_retries"</span>, <span class="str">"detail"</span>: <span class="fn">str</span>(last)}

<span class="cm"># Flaky tool that fails 60% of the time</span>
attempts = {<span class="str">"n"</span>: <span class="num">0</span>}
<span class="kw">def</span> <span class="fn">flaky</span>():
    attempts[<span class="str">"n"</span>] += <span class="num">1</span>
    <span class="kw">if</span> random.<span class="fn">random</span>() &lt; <span class="num">0.6</span>: <span class="kw">raise</span> <span class="fn">RuntimeError</span>(<span class="str">"transient"</span>)
    <span class="kw">return</span> {<span class="str">"ok"</span>: <span class="kw">True</span>, <span class="str">"attempt"</span>: attempts[<span class="str">"n"</span>]}

random.<span class="fn">seed</span>(<span class="num">7</span>)
brk = <span class="fn">CircuitBreaker</span>()
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    <span class="fn">print</span>(f<span class="str">"call {i}:"</span>, <span class="fn">resilient_call</span>(flaky, breaker=brk))
</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>CircuitBreaker</code> bir <code>fails</code> sayacı ve <code>opened_at</code> zaman damgası tutar; <code>ok()</code> cooldown aktifken False döner ve <code>record(success)</code> <code>fails &gt;= threshold</code> olduğunda <code>opened_at</code>'i tetikler. 2) <code>resilient_call(fn, ...)</code> breaker açıkken <code>{"error":"circuit_open"}</code> ile kısa-devre yapar, sonra <code>fn</code> üzerinde en fazla <code>max_tries=4</code> deneme çalıştırır. 3) Her başarısızlıkta <code>min(cap, base * 2**n) * (1 + random.random()*0.3)</code> hesaplar — eşzamanlı agent'ların retry'lerini senkronize etmemesi için %30 jitter'lı sınırlı üstel geri çekilme. 4) <code>flaky</code> demo'su %60 olasılıkla rastgele başarısız olur; tohumlanmış döngü sarmalayıcının geçici hatalardan kurtulduğunu, breaker üzerinde durumu kaydettiğini ve nihayetinde başarılı sonucu ya da yapılandırılmış bir <code>"max_retries"</code> hatası döndürdüğünü gösterir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Mini Bir Araç Register'ı — Uçtan Uca</h2>
<p class="l-text">Her şeyi birleştirmek: araçları şemalarıyla tutan, çağrıları doğrulayan, retry'lerle dispatch eden ve sonuçları biçimlendiren bir register. Bu, LangChain'in <code>Tool</code> sınıfının ve OpenAI/Anthropic SDK'larının içeride yaptığının iskeletidir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> json, time, hashlib

<span class="kw">class</span> ToolRegistry:
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>):
        <span class="kw">self</span>.tools = {}
    <span class="kw">def</span> <span class="fn">register</span>(<span class="kw">self</span>, name, fn, schema, scopes=<span class="kw">None</span>):
        <span class="kw">self</span>.tools[name] = {<span class="str">"fn"</span>: fn, <span class="str">"schema"</span>: schema, <span class="str">"scopes"</span>: <span class="fn">set</span>(scopes <span class="kw">or</span> [])}
    <span class="kw">def</span> <span class="fn">list_schemas</span>(<span class="kw">self</span>):
        <span class="kw">return</span> [{<span class="str">"name"</span>: n, <span class="str">"description"</span>: t[<span class="str">"schema"</span>].<span class="fn">get</span>(<span class="str">"description"</span>, <span class="str">""</span>),
                 <span class="str">"input_schema"</span>: t[<span class="str">"schema"</span>].<span class="fn">get</span>(<span class="str">"input_schema"</span>, {})}
                <span class="kw">for</span> n, t <span class="kw">in</span> <span class="kw">self</span>.tools.<span class="fn">items</span>()]
    <span class="kw">def</span> <span class="fn">call</span>(<span class="kw">self</span>, name, args, granted_scopes):
        <span class="kw">if</span> name <span class="kw">not</span> <span class="kw">in</span> <span class="kw">self</span>.tools:
            <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"unknown_tool"</span>, <span class="str">"available"</span>: <span class="fn">list</span>(<span class="kw">self</span>.tools)}
        t = <span class="kw">self</span>.tools[name]
        missing = t[<span class="str">"scopes"</span>] - granted_scopes
        <span class="kw">if</span> missing:
            <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"insufficient_scope"</span>, <span class="str">"missing"</span>: <span class="fn">sorted</span>(missing)}
        <span class="cm"># validate required keys</span>
        req = t[<span class="str">"schema"</span>].<span class="fn">get</span>(<span class="str">"input_schema"</span>, {}).<span class="fn">get</span>(<span class="str">"required"</span>, [])
        <span class="kw">for</span> k <span class="kw">in</span> req:
            <span class="kw">if</span> k <span class="kw">not</span> <span class="kw">in</span> args: <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"missing_arg"</span>, <span class="str">"arg"</span>: k}
        <span class="kw">try</span>:
            <span class="kw">return</span> {<span class="str">"ok"</span>: <span class="kw">True</span>, <span class="str">"result"</span>: t[<span class="str">"fn"</span>](**args)}
        <span class="kw">except</span> Exception <span class="kw">as</span> e:
            <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"tool_exception"</span>, <span class="str">"detail"</span>: <span class="fn">str</span>(e)}

<span class="cm"># --- register a couple of tools ---</span>
reg = <span class="fn">ToolRegistry</span>()

reg.<span class="fn">register</span>(<span class="str">"search_orders"</span>,
    fn=<span class="kw">lambda</span> customer_id, status=<span class="str">"all"</span>, limit=<span class="num">5</span>: [
        {<span class="str">"id"</span>: f<span class="str">"o_{i}"</span>, <span class="str">"cust"</span>: customer_id, <span class="str">"status"</span>: status, <span class="str">"amt"</span>: (i+<span class="num">1</span>)*<span class="num">100</span>}
        <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">min</span>(limit, <span class="num">3</span>))
    ],
    schema={<span class="str">"description"</span>: <span class="str">"Find orders for a customer."</span>,
            <span class="str">"input_schema"</span>: {<span class="str">"required"</span>: [<span class="str">"customer_id"</span>]}},
    scopes=[<span class="str">"orders:read"</span>])

reg.<span class="fn">register</span>(<span class="str">"refund_order"</span>,
    fn=<span class="kw">lambda</span> order_id, idempotency_key: {
        <span class="str">"refund_id"</span>: <span class="str">"rf_"</span> + hashlib.<span class="fn">md5</span>(idempotency_key.<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()[:<span class="num">8</span>],
        <span class="str">"order_id"</span>: order_id, <span class="str">"ts"</span>: time.<span class="fn">time</span>()
    },
    schema={<span class="str">"description"</span>: <span class="str">"Refund an order. idempotency_key required."</span>,
            <span class="str">"input_schema"</span>: {<span class="str">"required"</span>: [<span class="str">"order_id"</span>, <span class="str">"idempotency_key"</span>]}},
    scopes=[<span class="str">"orders:write"</span>, <span class="str">"money:move"</span>])

scopes = {<span class="str">"orders:read"</span>, <span class="str">"orders:write"</span>, <span class="str">"money:move"</span>}
<span class="fn">print</span>(json.<span class="fn">dumps</span>(reg.<span class="fn">call</span>(<span class="str">"search_orders"</span>, {<span class="str">"customer_id"</span>:<span class="str">"cust_42"</span>}, scopes), indent=<span class="num">2</span>))
<span class="fn">print</span>(json.<span class="fn">dumps</span>(reg.<span class="fn">call</span>(<span class="str">"refund_order"</span>, {<span class="str">"order_id"</span>:<span class="str">"o_1"</span>,<span class="str">"idempotency_key"</span>:<span class="str">"ord-1-rf"</span>}, scopes), indent=<span class="num">2</span>))
<span class="fn">print</span>(json.<span class="fn">dumps</span>(reg.<span class="fn">call</span>(<span class="str">"refund_order"</span>, {<span class="str">"order_id"</span>:<span class="str">"o_1"</span>}, scopes), indent=<span class="num">2</span>))  <span class="cm"># missing arg</span>
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>ToolRegistry.register(name, fn, schema, scopes)</code> bir çağrılabiliri, JSON Schema'sını ve gerekli scope kümesini saklar — <code>list_schemas()</code> LLM'in görmeyi beklediği tam şekli (ad + açıklama + input_schema) yayar. 2) <code>call(name, args, granted_scopes)</code> production kontrollerini sırayla istifler: bilinmeyen tool → eksik scope → eksik required arg → underlying fonksiyondaki exception — her dal modelin okuyabileceği yapılandırılmış bir hata zarfı döndürür. 3) Çok farklı patlama yarıçaplarıyla iki tool kaydedilir: <code>search_orders</code> yalnızca <code>orders:read</code>'e ihtiyaç duyar, <code>refund_order</code> ise hem <code>orders:write</code> hem de <code>money:move</code> ister ve istemcinin sağladığı bir <code>idempotency_key</code> almak zorundadır. 4) Üç demo çağrısı başarı yollarını (okuma, anahtarlı iade) ve bir başarısızlık yolunu (idempotency_key eksik iade) dolaşır; böylece her dalın ürettiği tam JSON zarfını okuyabilirsin.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Production Kontrol Listesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Şema</div><div class="card-body">Fiil-öncüllü ad. Örnekli açıklama. Kapalı kümeler için enum'lar. Required alanlar minimum.</div></div>
<div class="calc-card"><div class="card-title">Idempotency</div><div class="card-body">Mutasyon araçları <code>idempotency_key</code> kabul eder ve buna saygı gösterir. Sunucu en az 24 saat dedupe eder.</div></div>
<div class="calc-card"><div class="card-title">Doğrulama</div><div class="card-body">Şema kontrolü + alan kontrolü (yol kök içinde, URL iç değil, SQL parametreli).</div></div>
<div class="calc-card"><div class="card-title">Sandbox</div><div class="card-body">Kod çalıştıran araçlar gerekmedikçe ağı olmayan container/microVM'lerde yaşar. Zaman + bellek limitleri.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">Sabit hata zarflı kompakt JSON. Token-bütçesi farkındalıklı kesme.</div></div>
<div class="calc-card"><div class="card-title">Dirençlilik</div><div class="card-body">Timeout + jitter'lı geri çekilme + devre kesici. Postmortem için loglu yörüngeler.</div></div>
<div class="calc-card"><div class="card-title">Yetenekler</div><div class="card-body">Araç başına en az ayrıcalık. Yüksek-etkili eylemler (para, silme, dış e-posta) insan-döngüde geçidi arkasında.</div></div>
<div class="calc-card"><div class="card-title">Gözlemlenebilirlik</div><div class="card-body">Her çağrı şunları loglar: ad, args (PII-redakte), gecikme, durum, maliyet, retry sayısı. Eval'i besler (ders 10).</div></div>
</div>

<div class="calc-highlight">Bir sonraki derste manuel döngüyü arkamızda bırakıp <strong>LangChain</strong> ve <strong>LangGraph</strong> kullanacağız — az önce inşa ettiklerinizi (register, dispatch, retry'ler) saran ve üstüne durum makineleri, kalıcılık ve checkpointing ekleyen framework'ler. L4'ün kalıpları kaybolmaz; soyutlamanın altındaki uygulama olurlar.</div>
</div>`
};
