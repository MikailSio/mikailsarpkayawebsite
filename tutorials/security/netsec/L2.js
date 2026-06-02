window.NETSEC_L2 = {

en: `<p class="l-text"><strong>In December 2021 a single line in a Java logging library — Apache Log4j — let any internet attacker run arbitrary code on millions of servers, from Minecraft to AWS to the U.S. Department of Defense.</strong> The flaw, <strong>CVE-2021-44228 ("Log4Shell")</strong>, sat at the intersection of two OWASP Top 10 categories: A03 Injection and A08 Software &amp; Data Integrity. The OWASP Top 10 is updated roughly every four years, and the 2021 edition reordered everything we thought we knew about web risk.</p>
<p class="l-text">In this lesson we walk the 2021 list — broken access control jumped to #1 — and build hands-on intuition for SQL injection, XSS, CSRF, SSRF, IDOR, and insecure deserialization. We will execute a real <code>' OR 1=1 --</code> attack against a SQLite database in your browser and watch a naive XSS filter fail.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Recall the OWASP Top 10 2021 ordering and what changed since 2017</li>
<li>Execute and patch SQL injection, NoSQL injection, and command injection</li>
<li>Distinguish reflected, stored, and DOM-based XSS with concrete payloads</li>
<li>Defend against CSRF, SSRF, and IDOR with token, allowlist, and authorization checks</li>
<li>Spot insecure deserialization in Python pickle and Java ObjectInputStream</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The OWASP Top 10 2021 Order</h2>
<p class="l-text">OWASP analyzed bug-bounty data, CVEs, and CWE incidence to rank the top web risks. Three categories are new compared to 2017, and access control rose from #5 to #1 — proof that authorization is harder than authentication.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A01 Broken Access Control</div><div class="card-body">94% of apps tested had at least one. IDOR, missing checks.</div></div>
<div class="calc-card"><div class="card-title">A02 Cryptographic Failures</div><div class="card-body">Was "Sensitive Data Exposure". Weak ciphers, hard-coded keys.</div></div>
<div class="calc-card"><div class="card-title">A03 Injection</div><div class="card-body">Now includes XSS. SQLi, NoSQLi, command, LDAP, XPath.</div></div>
<div class="calc-card"><div class="card-title">A04 Insecure Design</div><div class="card-body">New 2021. Missing threat model, no rate limiting.</div></div>
<div class="calc-card"><div class="card-title">A05 Misconfiguration</div><div class="card-body">Default creds, verbose errors, S3 buckets open.</div></div>
<div class="calc-card"><div class="card-title">A06 Vulnerable Components</div><div class="card-body">Log4Shell lives here. Outdated libraries.</div></div>
<div class="calc-card"><div class="card-title">A07 Auth Failures</div><div class="card-body">Was "Broken Authentication". Weak passwords, session fixation.</div></div>
<div class="calc-card"><div class="card-title">A08 Integrity Failures</div><div class="card-body">New. SolarWinds-class supply-chain. Insecure deserialization.</div></div>
<div class="calc-card"><div class="card-title">A09 Logging Failures</div><div class="card-body">Mean time to detect &gt; 200 days because no logs.</div></div>
<div class="calc-card"><div class="card-title">A10 SSRF</div><div class="card-body">New. Capital One 2019 was an SSRF on EC2 metadata.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SQL Injection — The Classic</h2>
<p class="l-text">SQL injection happens when user input is concatenated into a query string. The canonical attack: log in as admin without a password by closing the string and adding <code>OR 1=1</code>. We'll run this against a real SQLite database in pyodide.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sqlite3
con = sqlite3.<span class="fn">connect</span>(<span class="str">":memory:"</span>)
cur = con.<span class="fn">cursor</span>()
cur.<span class="fn">execute</span>(<span class="str">"CREATE TABLE users(name TEXT, pwd TEXT, role TEXT)"</span>)
cur.<span class="fn">executemany</span>(<span class="str">"INSERT INTO users VALUES(?,?,?)"</span>,
   [(<span class="str">"alice"</span>,<span class="str">"hunter2"</span>,<span class="str">"user"</span>),(<span class="str">"admin"</span>,<span class="str">"s3cret!"</span>,<span class="str">"admin"</span>)])

<span class="cm"># VULNERABLE: string concatenation</span>
<span class="kw">def</span> <span class="fn">login_bad</span>(name, pwd):
    q = f<span class="str">"SELECT role FROM users WHERE name='{name}' AND pwd='{pwd}'"</span>
    <span class="kw">return</span> cur.<span class="fn">execute</span>(q).<span class="fn">fetchone</span>()

<span class="fn">print</span>(<span class="str">"Normal:"</span>, <span class="fn">login_bad</span>(<span class="str">"alice"</span>, <span class="str">"hunter2"</span>))
<span class="fn">print</span>(<span class="str">"Attack:"</span>, <span class="fn">login_bad</span>(<span class="str">"admin"</span>, <span class="str">"' OR '1'='1"</span>))   <span class="cm"># bypass!</span>
<span class="fn">print</span>(<span class="str">"Comment attack:"</span>, <span class="fn">login_bad</span>(<span class="str">"admin' --"</span>, <span class="str">"anything"</span>))

<span class="cm"># SAFE: parameterized query</span>
<span class="kw">def</span> <span class="fn">login_ok</span>(name, pwd):
    <span class="kw">return</span> cur.<span class="fn">execute</span>(<span class="str">"SELECT role FROM users WHERE name=? AND pwd=?"</span>, (name,pwd)).<span class="fn">fetchone</span>()
<span class="fn">print</span>(<span class="str">"Safe attempt:"</span>, <span class="fn">login_ok</span>(<span class="str">"admin' --"</span>, <span class="str">"anything"</span>))   <span class="cm"># None — saved!</span></code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds two tiny users (alice/admin) inside an in-memory SQLite database so the demo runs without external setup. 2) The vulnerable <code>login_bad</code> uses an f-string to interpolate <code>name</code> and <code>pwd</code> directly into the SQL — exactly how the original Bobby-Tables class of bugs was born. 3) The payload <code>' OR '1'='1</code> closes the quoted literal and adds a tautology; <code>admin' --</code> turns the rest of the WHERE clause into a comment, bypassing the password check entirely. 4) The fix is <code>cursor.execute("SELECT ... WHERE name=? AND pwd=?", (name, pwd))</code> — the driver sends parsed SQL and bound values over separate protocol fields, so user data can never be reinterpreted as syntax.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide-equivalent (runs in your browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sqlite3 is built into pyodide. You can also use the project's <code>run_sql()</code> helper which exposes the 9 preloaded datasets.</p>
</div>
<p class="l-text"><strong>Two recommended hardening layers on top:</strong> 1) Replace raw cursors with an ORM (<code>SQLAlchemy</code>, <code>Django ORM</code>, <code>Prisma</code>) — they default to parameter binding and refuse string concatenation by API design. 2) Add database-side defenses: a read-only application role, row-level security policies, and <code>pg_stat_statements</code> review so unexpected query shapes show up as outliers before they are exploited at scale.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. NoSQL &amp; Command Injection</h2>
<p class="l-text">NoSQL injection swaps strings for operator objects. In MongoDB, sending <code>{"$ne": null}</code> as a password matches every record. Command injection exploits shell metacharacters when a webapp shells out to <code>ping</code>, <code>convert</code>, or <code>git</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># NoSQL injection example (logical only — no real Mongo here)</span>
<span class="kw">def</span> <span class="fn">mongo_login</span>(query):
    db = [{<span class="str">"u"</span>:<span class="str">"alice"</span>,<span class="str">"p"</span>:<span class="str">"hunter2"</span>},{<span class="str">"u"</span>:<span class="str">"admin"</span>,<span class="str">"p"</span>:<span class="str">"s3cret"</span>}]
    <span class="kw">def</span> <span class="fn">match</span>(doc, q):
        <span class="kw">for</span> k,v <span class="kw">in</span> q.<span class="fn">items</span>():
            <span class="kw">if</span> <span class="fn">isinstance</span>(v, <span class="fn">dict</span>) <span class="kw">and</span> <span class="str">"$ne"</span> <span class="kw">in</span> v:
                <span class="kw">if</span> doc[k] == v[<span class="str">"$ne"</span>]: <span class="kw">return</span> <span class="kw">False</span>
            <span class="kw">elif</span> doc[k] != v: <span class="kw">return</span> <span class="kw">False</span>
        <span class="kw">return</span> <span class="kw">True</span>
    <span class="kw">return</span> [d <span class="kw">for</span> d <span class="kw">in</span> db <span class="kw">if</span> <span class="fn">match</span>(d,query)]

<span class="fn">print</span>(<span class="fn">mongo_login</span>({<span class="str">"u"</span>:<span class="str">"admin"</span>, <span class="str">"p"</span>:{<span class="str">"$ne"</span>: <span class="kw">None</span>}}))   <span class="cm"># auth bypass</span>

<span class="cm"># Command injection — DO NOT run on a real shell</span>
<span class="kw">import</span> shlex
user = <span class="str">"google.com; rm -rf /"</span>
<span class="fn">print</span>(<span class="str">"Bad cmdline: ping "</span> + user)
<span class="fn">print</span>(<span class="str">"Safe args:"</span>, [<span class="str">"ping"</span>, <span class="str">"-c"</span>, <span class="str">"1"</span>, shlex.<span class="fn">quote</span>(user)])</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The MongoDB-style example shows that <code>{"u":"admin", "p":{"$ne": None}}</code> bypasses authentication because the matcher dereferences <code>$ne</code> as a query operator — any web framework that <code>json.loads()</code> the request body and passes it straight to <code>db.users.find_one(body)</code> is vulnerable; the fix is to coerce <code>p</code> to <code>str</code> and reject objects. 2) For shell-out commands, never concatenate user input into a single string passed to <code>subprocess.run(cmd, shell=True)</code> — that lets <code>;</code>, <code>|</code>, and <code>&amp;&amp;</code> chain extra commands. 3) Use the list form <code>subprocess.run(["ping", "-c", "1", host], shell=False)</code> so the OS treats each element as a single argv entry, with no shell parsing at all. 4) When the shell really is required, run user input through <code>shlex.quote()</code> and validate against an allowlist regex before quoting.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. XSS — Reflected, Stored, DOM</h2>
<p class="l-text">Cross-site scripting injects attacker JavaScript into a victim's browser inside a trusted origin. The three flavors differ in where the payload lives.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Reflected</div><div class="card-body">Payload in URL / form, echoed in response. Phishing link.</div></div>
<div class="calc-card"><div class="card-title">Stored</div><div class="card-body">Payload in the database (comment, profile). Hits every viewer.</div></div>
<div class="calc-card"><div class="card-title">DOM-based</div><div class="card-body">Server clean — but client JS does <code>innerHTML = location.hash</code>.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, html
payloads = [
    <span class="str">"&lt;script&gt;alert(1)&lt;/script&gt;"</span>,
    <span class="str">"&lt;img src=x onerror=alert(1)&gt;"</span>,
    <span class="str">"&lt;svg/onload=alert(1)&gt;"</span>,
    <span class="str">"javascript:alert(1)"</span>,
    <span class="str">"&lt;ScRiPt&gt;alert(1)&lt;/sCrIpT&gt;"</span>,
]

<span class="cm"># Naive filter — strips literal &lt;script&gt; tag. Bypassable!</span>
<span class="kw">def</span> <span class="fn">naive</span>(s):
    <span class="kw">return</span> re.<span class="fn">sub</span>(<span class="str">r'&lt;script&gt;.*?&lt;/script&gt;'</span>, <span class="str">''</span>, s)

<span class="cm"># Correct — context-aware HTML escape</span>
<span class="kw">def</span> <span class="fn">safe</span>(s):
    <span class="kw">return</span> html.<span class="fn">escape</span>(s, quote=<span class="kw">True</span>)

<span class="kw">for</span> p <span class="kw">in</span> payloads:
    <span class="fn">print</span>(<span class="str">"naive:"</span>, <span class="fn">repr</span>(<span class="fn">naive</span>(p)))
    <span class="fn">print</span>(<span class="str">"safe :"</span>, <span class="fn">repr</span>(<span class="fn">safe</span>(p)))
    <span class="fn">print</span>()</code></pre></div>
<p class="l-text">The naive filter passes <code>&lt;img src=x onerror=alert(1)&gt;</code>, <code>&lt;svg/onload=...&gt;</code>, and case-mixing untouched. Correct defense: HTML-escape on output, plus a strict Content-Security-Policy header.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CSRF &amp; Token-Based Defense</h2>
<p class="l-text">A logged-in user visits evil.com. Evil.com posts a hidden form to bank.com/transfer. The browser dutifully attaches the bank session cookie. Defense: a per-request token bound to the session that an attacker on a different origin cannot read.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hmac, hashlib, secrets, time

SERVER_SECRET = secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)

<span class="kw">def</span> <span class="fn">make_csrf_token</span>(session_id, ttl=<span class="num">3600</span>):
    expiry = <span class="fn">int</span>(time.<span class="fn">time</span>()) + ttl
    msg = f<span class="str">"{session_id}|{expiry}"</span>.<span class="fn">encode</span>()
    sig = hmac.<span class="fn">new</span>(SERVER_SECRET, msg, hashlib.sha256).<span class="fn">hexdigest</span>()[:<span class="num">16</span>]
    <span class="kw">return</span> f<span class="str">"{expiry}.{sig}"</span>

<span class="kw">def</span> <span class="fn">verify_csrf_token</span>(session_id, token):
    <span class="kw">try</span>:
        expiry, sig = token.<span class="fn">split</span>(<span class="str">"."</span>)
        <span class="kw">if</span> <span class="fn">int</span>(expiry) &lt; time.<span class="fn">time</span>(): <span class="kw">return</span> <span class="kw">False</span>
        msg = f<span class="str">"{session_id}|{expiry}"</span>.<span class="fn">encode</span>()
        good = hmac.<span class="fn">new</span>(SERVER_SECRET, msg, hashlib.sha256).<span class="fn">hexdigest</span>()[:<span class="num">16</span>]
        <span class="kw">return</span> hmac.<span class="fn">compare_digest</span>(good, sig)
    <span class="kw">except</span>: <span class="kw">return</span> <span class="kw">False</span>

t = <span class="fn">make_csrf_token</span>(<span class="str">"sess_alice_123"</span>)
<span class="fn">print</span>(<span class="str">"token:"</span>, t)
<span class="fn">print</span>(<span class="str">"valid:"</span>, <span class="fn">verify_csrf_token</span>(<span class="str">"sess_alice_123"</span>, t))
<span class="fn">print</span>(<span class="str">"forged:"</span>, <span class="fn">verify_csrf_token</span>(<span class="str">"sess_alice_123"</span>, t[:-<span class="num">1</span>]+<span class="str">"x"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>make_csrf_token</code> binds a token to the user's <code>session_id</code> plus an <code>expiry</code> timestamp, then signs the pair with <code>HMAC-SHA256</code> using a server-side secret — this is the stateless variant of the double-submit cookie pattern (the cookie holds the token, a hidden form field echoes it, and the server verifies they match). 2) Because the attacker on evil.com can read neither <code>SERVER_SECRET</code> nor the victim's <code>session_id</code>, they cannot forge a valid signature, so the cross-origin POST fails. 3) <code>verify_csrf_token</code> uses <code>hmac.compare_digest</code> for constant-time comparison, defeating timing oracles that would otherwise leak the signature byte by byte. 4) In production, pair this with <code>Set-Cookie: ...; SameSite=Strict; Secure; HttpOnly</code> — the SameSite attribute blocks the cookie from being sent on cross-origin POSTs at all, making CSRF tokens defense-in-depth rather than the sole gate.</p>

<div class="katex-block">$$\\text{HMAC}(K, M) = H((K \\oplus opad) \\| H((K \\oplus ipad) \\| M))$$</div>
<p class="l-text">Modern frameworks (Django, Rails, Spring) generate this for you. Combine with <code>SameSite=Strict</code> cookies and the attack surface shrinks to near zero.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SSRF — The Capital One Story</h2>
<p class="l-text">In 2019 a former AWS engineer exfiltrated 100 million Capital One customer records. The entry point was Server-Side Request Forgery: a misconfigured WAF let attacker-supplied URLs be fetched server-side. The attacker pointed it at <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code> — the AWS metadata service — and stole IAM role credentials.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cloud metadata</div><div class="card-body">169.254.169.254 (AWS), metadata.google.internal (GCP). Block!</div></div>
<div class="calc-card"><div class="card-title">Internal services</div><div class="card-body">10.0.0.0/8, 192.168.0.0/16, localhost — never proxy from user input.</div></div>
<div class="calc-card"><div class="card-title">Defense</div><div class="card-body">Allowlist hosts. IMDSv2 (token-bound). Egress firewall on workloads.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. IDOR &amp; Broken Access Control</h2>
<p class="l-text">Insecure Direct Object Reference: <code>GET /invoice/4012</code> returns your invoice. Change to <code>4013</code> — that's someone else's invoice. The bug is missing authorization check, not authentication. OWASP found this in 94% of apps tested in 2021.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>invoices = {<span class="num">4012</span>:{<span class="str">"owner"</span>:<span class="str">"alice"</span>,<span class="str">"amount"</span>:<span class="num">99</span>},
            <span class="num">4013</span>:{<span class="str">"owner"</span>:<span class="str">"bob"</span>,<span class="str">"amount"</span>:<span class="num">42</span>}}

<span class="kw">def</span> <span class="fn">get_invoice_bad</span>(invoice_id, user):       <span class="cm"># IDOR</span>
    <span class="kw">return</span> invoices.<span class="fn">get</span>(invoice_id)

<span class="kw">def</span> <span class="fn">get_invoice_ok</span>(invoice_id, user):
    inv = invoices.<span class="fn">get</span>(invoice_id)
    <span class="kw">if</span> inv <span class="kw">and</span> inv[<span class="str">"owner"</span>] == user: <span class="kw">return</span> inv
    <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"403 Forbidden"</span>}

<span class="fn">print</span>(<span class="str">"IDOR :"</span>, <span class="fn">get_invoice_bad</span>(<span class="num">4013</span>, <span class="str">"alice"</span>))
<span class="fn">print</span>(<span class="str">"safe :"</span>, <span class="fn">get_invoice_ok</span>(<span class="num">4013</span>, <span class="str">"alice"</span>))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>get_invoice_bad</code> looks up <code>invoice_id</code> and returns whatever it finds — it never asks "is this caller allowed to read this row?", which is the IDOR bug in a single line. 2) <code>get_invoice_ok</code> adds the missing authorization check: <code>if inv["owner"] == user</code> — only the owner sees the invoice; everyone else gets <code>403 Forbidden</code>. 3) In a real Flask/Django app this lives in a decorator (<code>@require_owner</code>) or a query filter (<code>.filter(owner=request.user)</code>) so every endpoint inherits the rule by default. 4) Add a role layer on top (RBAC: admin/billing/customer) and an attribute layer (ABAC: only invoices &lt; 30 days for customer-service agents), and log every <code>403</code> to the SIEM — repeated enumeration of sequential IDs is the strongest signal of an active IDOR probe.</p>

</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Insecure Deserialization</h2>
<p class="l-text">Python <code>pickle.loads</code> can call any constructor. Java <code>ObjectInputStream</code> can invoke gadget chains. Both turn an untrusted byte string into arbitrary code execution. <strong>CVE-2017-9805</strong> (Apache Struts XStream) was the deserialization bug behind the Equifax breach exposing 147 million people.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Never</div><div class="card-body">pickle / marshal / yaml.unsafe_load on untrusted data. Use JSON.</div></div>
<div class="calc-card"><div class="card-title">Java</div><div class="card-body">ObjectInputFilter (JEP 290). Avoid Java serialization entirely if possible.</div></div>
<div class="calc-card"><div class="card-title">.NET</div><div class="card-body">BinaryFormatter is deprecated. Use System.Text.Json.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Vuln Distribution Visualization</h2>
<p class="l-text">Hypothetical incidence rates from OWASP's 2021 dataset show how common each category is across pentested applications.</p>
<div class="plotly-graph" id="netsec2-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Broken access control is now #1 — auth-z is harder than auth-n.<br><strong>2.</strong> SQLi is fixed by parameterized queries; nothing else.<br><strong>3.</strong> XSS defense = HTML escape on output + CSP header. Naive filtering loses.<br><strong>4.</strong> CSRF defense = HMAC token + SameSite cookie.<br><strong>5.</strong> SSRF metadata-service attacks killed Capital One; allowlist outbound URLs.<br><strong>6.</strong> Never deserialize untrusted bytes with pickle / Java ObjectInputStream.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var labels = ['A01 Access','A02 Crypto','A03 Inject','A04 Design','A05 Misconfig','A06 Outdated','A07 AuthN','A08 Integrity','A09 Logging','A10 SSRF'];
  var pct = [94,77,87,73,90,89,75,68,71,30];
  var data = [{x:labels, y:pct, type:'bar', marker:{color:T.accent}}];
  var layout = {title:'OWASP Top 10 2021 — incidence rate (%)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{gridcolor:T.grid}, yaxis:{title:'% of apps tested', gridcolor:T.grid}, margin:{t:50,r:30,b:80,l:60}};
  var el=document.getElementById('netsec2-plot-en'); if(el && window.Plotly) Plotly.newPlot('netsec2-plot-en', data, layout, {displayModeBar:false});
},250);
</script>`,

tr: `<p class="l-text"><strong>Aralık 2021'de bir Java loglama kütüphanesindeki — Apache Log4j — tek bir satır, herhangi bir internet saldırganının Minecraft'tan AWS'ye, ABD Savunma Bakanlığı'na kadar milyonlarca sunucuda keyfi kod çalıştırmasına izin verdi.</strong> Açık, <strong>CVE-2021-44228 ("Log4Shell")</strong>, iki OWASP Top 10 kategorisinin kesişiminde oturuyordu: A03 Injection ve A08 Software &amp; Data Integrity. OWASP Top 10 yaklaşık dört yılda bir güncellenir ve 2021 baskısı web riski hakkında bildiğimizi sandığımız her şeyi yeniden sıraladı.</p>
<p class="l-text">Bu derste 2021 listesini geziyoruz — broken access control #1'e atladı — ve SQL injection, XSS, CSRF, SSRF, IDOR ve güvensiz deserileştirme için uygulamalı sezgi inşa ediyoruz. Tarayıcında bir SQLite veritabanına karşı gerçek bir <code>' OR 1=1 --</code> saldırısı yürüteceğiz ve naif bir XSS filtresinin başarısız olduğunu izleyeceğiz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>OWASP Top 10 2021 sıralamasını ve 2017'den beri ne değiştiğini hatırlamak</li>
<li>SQL injection, NoSQL injection ve command injection'ı yürütmek ve yamamak</li>
<li>Yansıyan, depolanan ve DOM-tabanlı XSS'i somut yüklerle ayırt etmek</li>
<li>Token, izin listesi ve yetkilendirme kontrolleriyle CSRF, SSRF ve IDOR'a karşı savunmak</li>
<li>Python pickle ve Java ObjectInputStream'de güvensiz deserileştirmeyi fark etmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. OWASP Top 10 2021 Sırası</h2>
<p class="l-text">OWASP üst web risklerini sıralamak için bug-bounty verisi, CVE'ler ve CWE insidansını analiz etti. 2017'ye kıyasla üç kategori yeni ve erişim kontrolü #5'ten #1'e yükseldi — yetkilendirmenin kimlik doğrulamadan daha zor olduğunun kanıtı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">A01 Broken Access Control</div><div class="card-body">Test edilen uygulamaların %94'ünde en az bir tane vardı. IDOR, eksik kontroller.</div></div>
<div class="calc-card"><div class="card-title">A02 Cryptographic Failures</div><div class="card-body">Eskiden "Sensitive Data Exposure"du. Zayıf cipher'lar, sabit-kodlanmış anahtarlar.</div></div>
<div class="calc-card"><div class="card-title">A03 Injection</div><div class="card-body">Şimdi XSS dahil. SQLi, NoSQLi, command, LDAP, XPath.</div></div>
<div class="calc-card"><div class="card-title">A04 Insecure Design</div><div class="card-body">2021 yeni. Eksik tehdit modeli, rate limiting yok.</div></div>
<div class="calc-card"><div class="card-title">A05 Misconfiguration</div><div class="card-body">Varsayılan kimlik bilgileri, ayrıntılı hatalar, açık S3 kovaları.</div></div>
<div class="calc-card"><div class="card-title">A06 Vulnerable Components</div><div class="card-body">Log4Shell burada yaşar. Eski kütüphaneler.</div></div>
<div class="calc-card"><div class="card-title">A07 Auth Failures</div><div class="card-body">Eskiden "Broken Authentication"dı. Zayıf parolalar, oturum sabitleme.</div></div>
<div class="calc-card"><div class="card-title">A08 Integrity Failures</div><div class="card-body">Yeni. SolarWinds-sınıfı tedarik zinciri. Güvensiz deserileştirme.</div></div>
<div class="calc-card"><div class="card-title">A09 Logging Failures</div><div class="card-body">Tespit ortalama süresi &gt; 200 gün çünkü log yok.</div></div>
<div class="calc-card"><div class="card-title">A10 SSRF</div><div class="card-body">Yeni. Capital One 2019 EC2 metaverisinde bir SSRF idi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SQL Injection — Klasik</h2>
<p class="l-text">SQL injection kullanıcı girdisi bir sorgu dizesine birleştirildiğinde gerçekleşir. Klasik saldırı: dizeyi kapatıp <code>OR 1=1</code> ekleyerek parolasız admin olarak giriş yapmak. Bunu pyodide'de gerçek bir SQLite veritabanına karşı çalıştıracağız.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> sqlite3
con = sqlite3.<span class="fn">connect</span>(<span class="str">":memory:"</span>)
cur = con.<span class="fn">cursor</span>()
cur.<span class="fn">execute</span>(<span class="str">"CREATE TABLE users(name TEXT, pwd TEXT, role TEXT)"</span>)
cur.<span class="fn">executemany</span>(<span class="str">"INSERT INTO users VALUES(?,?,?)"</span>,
   [(<span class="str">"alice"</span>,<span class="str">"hunter2"</span>,<span class="str">"user"</span>),(<span class="str">"admin"</span>,<span class="str">"s3cret!"</span>,<span class="str">"admin"</span>)])

<span class="cm"># ZAFİYETLİ: dize birleştirme</span>
<span class="kw">def</span> <span class="fn">login_bad</span>(name, pwd):
    q = f<span class="str">"SELECT role FROM users WHERE name='{name}' AND pwd='{pwd}'"</span>
    <span class="kw">return</span> cur.<span class="fn">execute</span>(q).<span class="fn">fetchone</span>()

<span class="fn">print</span>(<span class="str">"Normal:"</span>, <span class="fn">login_bad</span>(<span class="str">"alice"</span>, <span class="str">"hunter2"</span>))
<span class="fn">print</span>(<span class="str">"Attack:"</span>, <span class="fn">login_bad</span>(<span class="str">"admin"</span>, <span class="str">"' OR '1'='1"</span>))   <span class="cm"># atlatma!</span>
<span class="fn">print</span>(<span class="str">"Comment attack:"</span>, <span class="fn">login_bad</span>(<span class="str">"admin' --"</span>, <span class="str">"anything"</span>))

<span class="cm"># GÜVENLİ: parametreli sorgu</span>
<span class="kw">def</span> <span class="fn">login_ok</span>(name, pwd):
    <span class="kw">return</span> cur.<span class="fn">execute</span>(<span class="str">"SELECT role FROM users WHERE name=? AND pwd=?"</span>, (name,pwd)).<span class="fn">fetchone</span>()
<span class="fn">print</span>(<span class="str">"Safe attempt:"</span>, <span class="fn">login_ok</span>(<span class="str">"admin' --"</span>, <span class="str">"anything"</span>))   <span class="cm"># None — kurtarıldı!</span></code></pre></div>
<p class="l-text"><strong>Kodun adım adım okuması:</strong> 1) Bellek içi bir SQLite veritabanı kurar ve iki kullanıcı (alice, admin) ekler — demo dış kurulum olmadan çalışsın diye. 2) Zafiyetli <code>login_bad</code> fonksiyonu <code>name</code> ve <code>pwd</code>'yi f-string ile doğrudan sorguya yapıştırır — Bobby-Tables sınıfı klasik bug böyle doğdu. 3) <code>' OR '1'='1</code> yükü tırnağı kapatıp her zaman doğru olan bir totoloji ekler; <code>admin' --</code> ise WHERE'in geri kalanını yorum yapıp parola kontrolünü tamamen atlatır. 4) Çözüm <code>cursor.execute("SELECT ... WHERE name=? AND pwd=?", (name, pwd))</code> şekli: sürücü parse edilmiş SQL ile bağlı değerleri protokolde ayrı alanlardan gönderir, böylece kullanıcı verisi asla söz dizimi olarak yeniden yorumlanamaz.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Pyodide eşdeğeri (tarayıcında çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sqlite3 pyodide'de yerleşiktir. Projenin 9 önyüklenmiş veri setini açan <code>run_sql()</code> yardımcısını da kullanabilirsin.</p>
</div>
<p class="l-text"><strong>İki sertleştirme katmanı daha:</strong> 1) Ham cursor yerine bir ORM (<code>SQLAlchemy</code>, <code>Django ORM</code>, <code>Prisma</code>) kullan — varsayılan olarak parametre bağlama yaparlar ve string birleştirmeyi API tasarımıyla reddederler. 2) Veritabanı tarafında ek savunma ekle: salt-okunur uygulama rolü, satır seviyesi güvenlik (row-level security) politikaları ve <code>pg_stat_statements</code> incelemesi — beklenmedik sorgu şekilleri, ölçekte sömürülmeden önce anomali olarak görünür.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. NoSQL ve Command Injection</h2>
<p class="l-text">NoSQL injection dizeleri operatör nesneleriyle değiştirir. MongoDB'de, parola olarak <code>{"$ne": null}</code> göndermek her kayıtla eşleşir. Command injection bir webapp <code>ping</code>, <code>convert</code> veya <code>git</code>'e kabuk açtığında shell metakarakterlerini sömürür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># NoSQL injection örneği (yalnızca mantıksal — burada gerçek Mongo yok)</span>
<span class="kw">def</span> <span class="fn">mongo_login</span>(query):
    db = [{<span class="str">"u"</span>:<span class="str">"alice"</span>,<span class="str">"p"</span>:<span class="str">"hunter2"</span>},{<span class="str">"u"</span>:<span class="str">"admin"</span>,<span class="str">"p"</span>:<span class="str">"s3cret"</span>}]
    <span class="kw">def</span> <span class="fn">match</span>(doc, q):
        <span class="kw">for</span> k,v <span class="kw">in</span> q.<span class="fn">items</span>():
            <span class="kw">if</span> <span class="fn">isinstance</span>(v, <span class="fn">dict</span>) <span class="kw">and</span> <span class="str">"$ne"</span> <span class="kw">in</span> v:
                <span class="kw">if</span> doc[k] == v[<span class="str">"$ne"</span>]: <span class="kw">return</span> <span class="kw">False</span>
            <span class="kw">elif</span> doc[k] != v: <span class="kw">return</span> <span class="kw">False</span>
        <span class="kw">return</span> <span class="kw">True</span>
    <span class="kw">return</span> [d <span class="kw">for</span> d <span class="kw">in</span> db <span class="kw">if</span> <span class="fn">match</span>(d,query)]

<span class="fn">print</span>(<span class="fn">mongo_login</span>({<span class="str">"u"</span>:<span class="str">"admin"</span>, <span class="str">"p"</span>:{<span class="str">"$ne"</span>: <span class="kw">None</span>}}))   <span class="cm"># auth atlatma</span>

<span class="cm"># Command injection — gerçek bir shell'de ÇALIŞTIRMA</span>
<span class="kw">import</span> shlex
user = <span class="str">"google.com; rm -rf /"</span>
<span class="fn">print</span>(<span class="str">"Bad cmdline: ping "</span> + user)
<span class="fn">print</span>(<span class="str">"Safe args:"</span>, [<span class="str">"ping"</span>, <span class="str">"-c"</span>, <span class="str">"1"</span>, shlex.<span class="fn">quote</span>(user)])</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) MongoDB tarzı örnek, <code>{"u":"admin", "p":{"$ne": None}}</code> gönderiminin auth'u atlattığını gösterir; eşleyici <code>$ne</code>'yi sorgu operatörü olarak görür — istek gövdesini <code>json.loads()</code> edip doğrudan <code>db.users.find_one(body)</code>'ye veren her framework zafiyetlidir; çözüm <code>p</code> alanını <code>str</code>'e zorlayıp nesneleri reddetmektir. 2) Shell çağrılarında kullanıcı girdisini tek bir string olarak <code>subprocess.run(cmd, shell=True)</code>'a asla yapıştırma — bu <code>;</code>, <code>|</code>, <code>&amp;&amp;</code> ile ek komut zincirleme imkânı verir. 3) Liste formunu kullan: <code>subprocess.run(["ping", "-c", "1", host], shell=False)</code> — OS her elemanı tek bir argv girdisi olarak işler, shell parse'ı hiç olmaz. 4) Shell şart olduğunda, kullanıcı girdisini önce allowlist regex ile doğrula, sonra <code>shlex.quote()</code> ile kaçışla.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. XSS — Yansıyan, Depolanan, DOM</h2>
<p class="l-text">Cross-site scripting saldırgan JavaScript'i bir kurbanın tarayıcısına güvenilen bir köken içinde enjekte eder. Üç çeşit yükün nerede yaşadığında farklılık gösterir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yansıyan</div><div class="card-body">URL / formdaki yük, yanıtta yankılanır. Phishing bağlantısı.</div></div>
<div class="calc-card"><div class="card-title">Depolanan</div><div class="card-body">Veritabanındaki yük (yorum, profil). Her görüntüleyiciye vurur.</div></div>
<div class="calc-card"><div class="card-title">DOM-tabanlı</div><div class="card-body">Sunucu temiz — ama istemci JS <code>innerHTML = location.hash</code> yapar.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> re, html
payloads = [
    <span class="str">"&lt;script&gt;alert(1)&lt;/script&gt;"</span>,
    <span class="str">"&lt;img src=x onerror=alert(1)&gt;"</span>,
    <span class="str">"&lt;svg/onload=alert(1)&gt;"</span>,
    <span class="str">"javascript:alert(1)"</span>,
    <span class="str">"&lt;ScRiPt&gt;alert(1)&lt;/sCrIpT&gt;"</span>,
]

<span class="cm"># Naif filtre — düz &lt;script&gt; etiketi soyulur. Atlatılabilir!</span>
<span class="kw">def</span> <span class="fn">naive</span>(s):
    <span class="kw">return</span> re.<span class="fn">sub</span>(<span class="str">r'&lt;script&gt;.*?&lt;/script&gt;'</span>, <span class="str">''</span>, s)

<span class="cm"># Doğru — bağlam-farkında HTML escape</span>
<span class="kw">def</span> <span class="fn">safe</span>(s):
    <span class="kw">return</span> html.<span class="fn">escape</span>(s, quote=<span class="kw">True</span>)

<span class="kw">for</span> p <span class="kw">in</span> payloads:
    <span class="fn">print</span>(<span class="str">"naive:"</span>, <span class="fn">repr</span>(<span class="fn">naive</span>(p)))
    <span class="fn">print</span>(<span class="str">"safe :"</span>, <span class="fn">repr</span>(<span class="fn">safe</span>(p)))
    <span class="fn">print</span>()</code></pre></div>
<p class="l-text">Naif filtre <code>&lt;img src=x onerror=alert(1)&gt;</code>, <code>&lt;svg/onload=...&gt;</code> ve karışık-büyüklüğü dokunulmadan geçirir. Doğru savunma: çıktıda HTML-escape, artı sıkı bir Content-Security-Policy başlığı.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CSRF ve Token-Tabanlı Savunma</h2>
<p class="l-text">Giriş yapmış bir kullanıcı evil.com'u ziyaret eder. Evil.com bank.com/transfer'e gizli bir form gönderir. Tarayıcı sadakatle banka oturum cookie'sini ekler. Savunma: oturuma bağlı, farklı bir kökendeki saldırganın okuyamayacağı istek-başı bir token.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hmac, hashlib, secrets, time

SERVER_SECRET = secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)

<span class="kw">def</span> <span class="fn">make_csrf_token</span>(session_id, ttl=<span class="num">3600</span>):
    expiry = <span class="fn">int</span>(time.<span class="fn">time</span>()) + ttl
    msg = f<span class="str">"{session_id}|{expiry}"</span>.<span class="fn">encode</span>()
    sig = hmac.<span class="fn">new</span>(SERVER_SECRET, msg, hashlib.sha256).<span class="fn">hexdigest</span>()[:<span class="num">16</span>]
    <span class="kw">return</span> f<span class="str">"{expiry}.{sig}"</span>

<span class="kw">def</span> <span class="fn">verify_csrf_token</span>(session_id, token):
    <span class="kw">try</span>:
        expiry, sig = token.<span class="fn">split</span>(<span class="str">"."</span>)
        <span class="kw">if</span> <span class="fn">int</span>(expiry) &lt; time.<span class="fn">time</span>(): <span class="kw">return</span> <span class="kw">False</span>
        msg = f<span class="str">"{session_id}|{expiry}"</span>.<span class="fn">encode</span>()
        good = hmac.<span class="fn">new</span>(SERVER_SECRET, msg, hashlib.sha256).<span class="fn">hexdigest</span>()[:<span class="num">16</span>]
        <span class="kw">return</span> hmac.<span class="fn">compare_digest</span>(good, sig)
    <span class="kw">except</span>: <span class="kw">return</span> <span class="kw">False</span>

t = <span class="fn">make_csrf_token</span>(<span class="str">"sess_alice_123"</span>)
<span class="fn">print</span>(<span class="str">"token:"</span>, t)
<span class="fn">print</span>(<span class="str">"valid:"</span>, <span class="fn">verify_csrf_token</span>(<span class="str">"sess_alice_123"</span>, t))
<span class="fn">print</span>(<span class="str">"forged:"</span>, <span class="fn">verify_csrf_token</span>(<span class="str">"sess_alice_123"</span>, t[:-<span class="num">1</span>]+<span class="str">"x"</span>))</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>make_csrf_token</code> token'ı kullanıcının <code>session_id</code>'sine ve <code>expiry</code> zaman damgasına bağlar, ardından sunucu tarafındaki bir gizli anahtar ile <code>HMAC-SHA256</code> kullanarak imzalar — bu, double-submit cookie modelinin durumsuz biçimidir (cookie token'ı tutar, gizli form alanı onu yankılar, sunucu eşleşmeyi doğrular). 2) Saldırgan evil.com'dan ne <code>SERVER_SECRET</code>'ı ne de kurbanın <code>session_id</code>'sini okuyabildiğinden geçerli bir imza üretemez, böylece cross-origin POST başarısız olur. 3) <code>verify_csrf_token</code> <code>hmac.compare_digest</code> ile sabit zamanlı karşılaştırma yapar — bu, imzayı bayt bayt sızdırabilecek zamanlama (timing) saldırılarını engeller. 4) Üretimde <code>Set-Cookie: ...; SameSite=Strict; Secure; HttpOnly</code> ile birlikte kullan — SameSite niteliği cookie'nin cross-origin POST'larla gönderilmesini tamamen engeller; böylece CSRF token'ı tek savunma değil, derinlemesine savunmanın bir katmanı olur.</p>

<div class="katex-block">$$\\text{HMAC}(K, M) = H((K \\oplus opad) \\| H((K \\oplus ipad) \\| M))$$</div>
<p class="l-text">Modern çerçeveler (Django, Rails, Spring) bunu sana üretir. <code>SameSite=Strict</code> cookie'lerle birleştir ve saldırı yüzeyi neredeyse sıfıra iner.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SSRF — Capital One Hikayesi</h2>
<p class="l-text">2019'da eski bir AWS mühendisi 100 milyon Capital One müşteri kaydını sızdırdı. Giriş noktası Server-Side Request Forgery idi: yanlış yapılandırılmış bir WAF saldırgan-sağlanan URL'lerin sunucu tarafında alınmasına izin verdi. Saldırgan onu <code>http://169.254.169.254/latest/meta-data/iam/security-credentials/</code>'e — AWS metaveri servisine — yöneltti ve IAM rol kimlik bilgilerini çaldı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bulut metaveri</div><div class="card-body">169.254.169.254 (AWS), metadata.google.internal (GCP). Engelle!</div></div>
<div class="calc-card"><div class="card-title">İç servisler</div><div class="card-body">10.0.0.0/8, 192.168.0.0/16, localhost — kullanıcı girdisinden asla proxy yapma.</div></div>
<div class="calc-card"><div class="card-title">Savunma</div><div class="card-body">Host'ları izin listele. IMDSv2 (token-bağlı). Workload'larda egress firewall.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. IDOR ve Kırık Erişim Kontrolü</h2>
<p class="l-text">Insecure Direct Object Reference: <code>GET /invoice/4012</code> faturanı döner. <code>4013</code>'e değiştir — bu başkasının faturasıdır. Bug eksik yetkilendirme kontrolüdür, kimlik doğrulama değil. OWASP bunu 2021'de test edilen uygulamaların %94'ünde buldu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>invoices = {<span class="num">4012</span>:{<span class="str">"owner"</span>:<span class="str">"alice"</span>,<span class="str">"amount"</span>:<span class="num">99</span>},
            <span class="num">4013</span>:{<span class="str">"owner"</span>:<span class="str">"bob"</span>,<span class="str">"amount"</span>:<span class="num">42</span>}}

<span class="kw">def</span> <span class="fn">get_invoice_bad</span>(invoice_id, user):       <span class="cm"># IDOR</span>
    <span class="kw">return</span> invoices.<span class="fn">get</span>(invoice_id)

<span class="kw">def</span> <span class="fn">get_invoice_ok</span>(invoice_id, user):
    inv = invoices.<span class="fn">get</span>(invoice_id)
    <span class="kw">if</span> inv <span class="kw">and</span> inv[<span class="str">"owner"</span>] == user: <span class="kw">return</span> inv
    <span class="kw">return</span> {<span class="str">"error"</span>: <span class="str">"403 Forbidden"</span>}

<span class="fn">print</span>(<span class="str">"IDOR :"</span>, <span class="fn">get_invoice_bad</span>(<span class="num">4013</span>, <span class="str">"alice"</span>))
<span class="fn">print</span>(<span class="str">"safe :"</span>, <span class="fn">get_invoice_ok</span>(<span class="num">4013</span>, <span class="str">"alice"</span>))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>get_invoice_bad</code> <code>invoice_id</code>'yi sorgulayıp bulduğu kaydı döner — "bu çağırıcının bu satırı okumaya yetkisi var mı?" sorusunu hiç sormaz; IDOR bug'ı tek satırda işte budur. 2) <code>get_invoice_ok</code> eksik yetki kontrolünü ekler: <code>if inv["owner"] == user</code> — yalnızca sahibi faturayı görür, diğerleri <code>403 Forbidden</code> alır. 3) Gerçek bir Flask/Django uygulamasında bu mantık bir dekoratör (<code>@require_owner</code>) veya bir sorgu filtresi (<code>.filter(owner=request.user)</code>) içinde yaşar — her endpoint kuralı varsayılan olarak miras alır. 4) Üstüne bir rol katmanı (RBAC: admin/billing/customer) ve bir öznitelik katmanı (ABAC: müşteri-hizmetleri ajanları için yalnızca son 30 gün) ekle ve her <code>403</code>'ü SIEM'e logla — sıralı ID'lerin tekrarlı denenmesi, aktif bir IDOR taramasının en güçlü göstergesidir.</p>

</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Güvensiz Deserileştirme</h2>
<p class="l-text">Python <code>pickle.loads</code> herhangi bir constructor'ı çağırabilir. Java <code>ObjectInputStream</code> gadget zincirlerini çağırabilir. Her ikisi de güvenilmeyen bir bayt dizesini keyfi kod yürütmesine dönüştürür. <strong>CVE-2017-9805</strong> (Apache Struts XStream) 147 milyon kişiyi açığa çıkaran Equifax ihlalinin arkasındaki deserileştirme bug'ıydı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Asla</div><div class="card-body">Güvenilmeyen veride pickle / marshal / yaml.unsafe_load. JSON kullan.</div></div>
<div class="calc-card"><div class="card-title">Java</div><div class="card-body">ObjectInputFilter (JEP 290). Mümkünse Java serileştirmeden tamamen kaçın.</div></div>
<div class="calc-card"><div class="card-title">.NET</div><div class="card-body">BinaryFormatter kullanımdan kaldırıldı. System.Text.Json kullan.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Zafiyet Dağılımı Görselleştirmesi</h2>
<p class="l-text">OWASP'ın 2021 veri setinden hipotetik insidans oranları her kategorinin pentest edilmiş uygulamalarda ne kadar yaygın olduğunu gösterir.</p>
<div class="plotly-graph" id="netsec2-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Kilit Çıkarımlar</h2>
<div class="think-box"><div class="think-label">KİLİT ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Kırık erişim kontrolü artık #1 — yetkilendirme kimlik doğrulamadan daha zordur.<br><strong>2.</strong> SQLi parametreli sorgularla düzeltilir; başka bir şey değil.<br><strong>3.</strong> XSS savunması = çıktıda HTML escape + CSP başlığı. Naif filtreleme kaybeder.<br><strong>4.</strong> CSRF savunması = HMAC token + SameSite cookie.<br><strong>5.</strong> SSRF metaveri-servis saldırıları Capital One'ı öldürdü; giden URL'leri izin listele.<br><strong>6.</strong> Pickle / Java ObjectInputStream ile asla güvenilmeyen baytları deserileştirme.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var labels = ['A01 Erişim','A02 Kripto','A03 Inject','A04 Tasarım','A05 Misconfig','A06 Eski','A07 AuthN','A08 Bütünlük','A09 Logging','A10 SSRF'];
  var pct = [94,77,87,73,90,89,75,68,71,30];
  var data = [{x:labels, y:pct, type:'bar', marker:{color:T.accent}}];
  var layout = {title:'OWASP Top 10 2021 — insidans oranı (%)', paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:T.text}, xaxis:{gridcolor:T.grid}, yaxis:{title:'test edilen uygulamaların %', gridcolor:T.grid}, margin:{t:50,r:30,b:80,l:60}};
  var el=document.getElementById('netsec2-plot-tr'); if(el && window.Plotly) Plotly.newPlot('netsec2-plot-tr', data, layout, {displayModeBar:false});
},250);
</script>`
};
