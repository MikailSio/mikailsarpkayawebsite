window.FORENSICS_L1 = {
en: `<p class="l-text"><strong>Threat modeling is what separates security engineering from security theater.</strong> Before you write a single firewall rule, before you spin up a SIEM, before you license your first EDR, you need a precise answer to four questions: <em>what are we building, what can go wrong, what are we going to do about it, and did we do a good enough job?</em> Adam Shostack's four-question framework, the engine behind Microsoft's STRIDE methodology, is the canonical opener for the entire field of incident response. Without it, you are buying tools to defend an attack surface you have not actually mapped.</p>

<p class="l-text">In this opening lesson we walk the three threat-modeling traditions every IR analyst must know — Microsoft's <strong>STRIDE</strong> (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege), the more business-centric <strong>PASTA</strong> (Process for Attack Simulation and Threat Analysis, Tony UcedaVélez 2015), and Lockheed Martin's <strong>Cyber Kill Chain</strong> (Hutchins, Cloppert, Amin 2011) — and then ground them in the modern reality of the <strong>MITRE ATT&amp;CK</strong> matrix: 14 tactics, 200+ techniques, hundreds of sub-techniques, all distilled from observed adversary behavior. We close with <strong>DREAD</strong> scoring (still controversial, still useful), so by the end you have both the abstract vocabulary and a concrete numeric way to triage which threat to fix first.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Apply the STRIDE checklist to a data-flow diagram and enumerate concrete threats</li>
<li>Walk an attack through Lockheed's seven Kill Chain stages from reconnaissance to actions-on-objectives</li>
<li>Read the MITRE ATT&amp;CK matrix and map a real intrusion (e.g. SolarWinds 2020) to its tactics and techniques</li>
<li>Run a PASTA-style risk-driven model that ties business impact to attacker capability</li>
<li>Compute a DREAD score and explain why CVSS often replaces it in modern shops</li>
<li>Choose the right framework for the job: design-time (STRIDE), business-driven (PASTA), or post-incident (Kill Chain / ATT&amp;CK)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Threat Model First — The Four Questions</h2>
<p class="l-text">Adam Shostack, former Microsoft threat-modeling lead, distilled an entire discipline into four questions that every team should answer before shipping a system: (1) <em>What are we working on?</em> (2) <em>What can go wrong?</em> (3) <em>What are we going to do about it?</em> (4) <em>Did we do a good enough job?</em> If you cannot answer all four, you do not have a threat model — you have a wish list.</p>

<p class="l-text">The output of question 1 is typically a <strong>data-flow diagram (DFD)</strong>: rectangles for processes, parallel lines for data stores, arrows for data flows, and dashed lines for trust boundaries. The trust boundary is where the magic happens — every arrow that crosses it is a potential attack vector, because it is where one trust assumption ends and another begins.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q1: What are we working on?</div><div class="card-body">Build a DFD. Mark trust boundaries (process boundary, network boundary, machine boundary). Forgetting a boundary = forgetting an entire class of attack.</div></div>
<div class="calc-card"><div class="card-title">Q2: What can go wrong?</div><div class="card-body">Run STRIDE per element. For each process, store, flow, ask the six STRIDE questions. Output: a threat list with hundreds of rows for a real system.</div></div>
<div class="calc-card"><div class="card-title">Q3: What are we going to do?</div><div class="card-body">Mitigate, transfer, accept, or eliminate. Map each threat to a control (authentication, encryption, audit logging, rate limiting). Track decisions in a register.</div></div>
<div class="calc-card"><div class="card-title">Q4: Did we do a good enough job?</div><div class="card-body">Validate via pen-test, red team, bug bounty, automated scanning. Threat models are living documents — re-run them on every architectural change.</div></div>
</div>

<div class="calc-highlight"><strong>Industry rule:</strong> threat modeling done late costs 100x more than threat modeling done at design. The IBM Systems Sciences Institute number from the 1980s — 100x cost to fix in production vs. design — has been re-verified in security contexts (NIST SP 800-160 v2).</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. STRIDE — Microsoft's Six-Letter Engine</h2>
<p class="l-text">STRIDE was invented by Loren Kohnfelder and Praerit Garg at Microsoft in 1999 and has been the workhorse of design-time threat modeling ever since. The trick is that each letter is the inverse of a security property: STRIDE threats break confidentiality, integrity, availability, authentication, authorization, and non-repudiation, in that order.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">S — Spoofing</div><div class="card-body">Pretending to be someone else. Breaks <em>authentication</em>. Examples: forged JWT, stolen session cookie, ARP spoofing, phished credentials, BGP hijack.</div></div>
<div class="calc-card"><div class="card-title">T — Tampering</div><div class="card-body">Modifying data in transit or at rest. Breaks <em>integrity</em>. Examples: SQL injection altering a row, supply-chain compromise (SolarWinds Orion DLL 2020), MITM rewriting a TLS payload after downgrade.</div></div>
<div class="calc-card"><div class="card-title">R — Repudiation</div><div class="card-body">Denying that an action occurred. Breaks <em>non-repudiation</em>. Mitigation: audit logs, signed transactions, immutable chains. Common in financial fraud and insider-trading cases.</div></div>
<div class="calc-card"><div class="card-title">I — Information disclosure</div><div class="card-body">Leaking data the user should not see. Breaks <em>confidentiality</em>. Examples: directory traversal, IDOR (insecure direct object reference), unencrypted backups, S3 buckets left public.</div></div>
<div class="calc-card"><div class="card-title">D — Denial of service</div><div class="card-body">Making a system unavailable. Breaks <em>availability</em>. Examples: SYN flood, Slowloris, Mirai-botnet UDP amplification, application-layer Layer-7 floods, ransomware.</div></div>
<div class="calc-card"><div class="card-title">E — Elevation of privilege</div><div class="card-body">Gaining capabilities you should not have. Breaks <em>authorization</em>. Examples: kernel exploit (Dirty Pipe CVE-2022-0847), Windows privilege escalation via PrintNightmare (CVE-2021-34527), container escape.</div></div>
</div>

<p class="l-text">The Microsoft Threat Modeling Tool automates STRIDE-per-element walks of a DFD. In practice, mature shops embed STRIDE prompts in PR templates: every architecture change must list its threats and mitigations before merge.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Lockheed's Cyber Kill Chain — Reconstructing the Attack</h2>
<p class="l-text">Where STRIDE is design-time, the <strong>Cyber Kill Chain</strong> (Hutchins, Cloppert, Amin, Lockheed Martin, 2011) is incident-time. It splits any intrusion into seven sequential stages. Defenders win by breaking the chain at <em>any</em> stage — the attacker has to succeed at every stage in order.</p>

<div class="katex-block">$$\\text{Kill Chain} = \\text{Recon} \\to \\text{Weaponize} \\to \\text{Deliver} \\to \\text{Exploit} \\to \\text{Install} \\to \\text{C2} \\to \\text{Actions}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Reconnaissance</div><div class="card-body">OSINT, LinkedIn enumeration, Shodan scans, DNS recon, Google dorking. Mitigation: minimize public surface, monitor brand mentions.</div></div>
<div class="calc-card"><div class="card-title">2. Weaponization</div><div class="card-body">Pair an exploit with a payload. E.g. macro-laden Word doc + Cobalt Strike Beacon. Mitigation: difficult — happens on attacker infrastructure.</div></div>
<div class="calc-card"><div class="card-title">3. Delivery</div><div class="card-body">Email, USB drop, watering hole, supply chain. Mitigation: email security gateways, sandbox detonation, USB blocking.</div></div>
<div class="calc-card"><div class="card-title">4. Exploitation</div><div class="card-body">Code execution. CVE exploitation, macro execution, RCE. Mitigation: patching, EDR with behavior detection, ASLR / DEP.</div></div>
<div class="calc-card"><div class="card-title">5. Installation</div><div class="card-body">Persistence — registry run keys, scheduled tasks, services, WMI subscriptions. Mitigation: autoruns monitoring, Sysmon ID 13.</div></div>
<div class="calc-card"><div class="card-title">6. Command &amp; Control</div><div class="card-body">Beaconing to attacker. DNS tunneling, HTTPS C2, domain fronting. Mitigation: egress filtering, JA3 fingerprinting (covered in L6).</div></div>
<div class="calc-card"><div class="card-title">7. Actions on Objectives</div><div class="card-body">Data exfil, ransomware deployment, lateral movement. Mitigation: DLP, network segmentation, immutable backups (3-2-1 rule).</div></div>
</div>

<div class="calc-highlight"><strong>Real example:</strong> NotPetya 2017 — Recon (M.E.Doc users in Ukraine), Weaponize (EternalBlue + Mimikatz + custom wiper), Deliver (M.E.Doc auto-update), Exploit (SMB), Install (none — wiper), C2 (none, self-propagating), Actions (destruction). Total damage: \\$10 billion. Maersk alone lost \\$300 million.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. MITRE ATT&amp;CK — The Industry Standard</h2>
<p class="l-text">The Kill Chain is too coarse for modern defense. <strong>MITRE ATT&amp;CK</strong> (Adversarial Tactics, Techniques &amp; Common Knowledge), released by MITRE in 2013 and continuously updated, replaces it with a much richer matrix: <strong>14 tactics</strong> (the "why") spanning <strong>200+ techniques</strong> (the "how"), with hundreds more <strong>sub-techniques</strong>. Each technique has a stable ID like <code>T1059.003</code> (Command and Scripting Interpreter: Windows Command Shell).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">14 Enterprise Tactics</div><div class="card-body">Reconnaissance (TA0043), Resource Development, Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command and Control, Exfiltration, Impact (TA0040). Each is a column in the matrix.</div></div>
<div class="calc-card"><div class="card-title">Techniques</div><div class="card-body">Specific behaviors. T1566 Phishing, T1059 Command and Scripting Interpreter, T1003 OS Credential Dumping (Mimikatz, etc.), T1486 Data Encrypted for Impact (ransomware).</div></div>
<div class="calc-card"><div class="card-title">Procedures</div><div class="card-body">Concrete implementations. APT29 uses T1059.001 PowerShell with obfuscated base64. Conti ransomware uses T1486 with ChaCha20+RSA-4096.</div></div>
<div class="calc-card"><div class="card-title">Detections &amp; Mitigations</div><div class="card-body">Each technique page lists data sources (process creation, command-line, network connection) and CIS-mapped mitigations. This is what makes ATT&amp;CK actionable.</div></div>
</div>

<p class="l-text">ATT&amp;CK is the lingua franca of modern IR: SIEM rules, EDR alerts, threat reports, red-team plans, and purple-team metrics all reference technique IDs. The companion project <strong>D3FEND</strong> (NSA-funded, MITRE) maps defensive techniques back to ATT&amp;CK for completeness.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. PASTA — When Risk Is the Driver</h2>
<p class="l-text"><strong>PASTA</strong> (Process for Attack Simulation and Threat Analysis), formalized by Tony UcedaVélez and Marco Morana in <em>Risk Centric Threat Modeling</em> (Wiley 2015), is a 7-stage methodology aimed at aligning security with business risk. Where STRIDE is a vocabulary and the Kill Chain is a narrative, PASTA is a process — heavyweight but defensible to a board.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stage 1 — Define Objectives</div><div class="card-body">Business goals, regulatory drivers (PCI-DSS, GDPR, HIPAA), risk appetite. Output: scope statement.</div></div>
<div class="calc-card"><div class="card-title">Stage 2 — Define Technical Scope</div><div class="card-body">Architecture, components, dependencies, data classifications.</div></div>
<div class="calc-card"><div class="card-title">Stage 3 — Application Decomposition</div><div class="card-body">DFDs, trust boundaries, attack surface enumeration.</div></div>
<div class="calc-card"><div class="card-title">Stage 4 — Threat Analysis</div><div class="card-body">Threat intel, attacker capability/motivation (APTs vs. script kiddies), industry-specific threat landscape.</div></div>
<div class="calc-card"><div class="card-title">Stage 5 — Vulnerability Analysis</div><div class="card-body">SAST/DAST results, CVE matching, configuration drift.</div></div>
<div class="calc-card"><div class="card-title">Stage 6 — Attack Modeling</div><div class="card-body">Attack trees, abuse cases, exploit chains.</div></div>
<div class="calc-card"><div class="card-title">Stage 7 — Risk &amp; Impact Analysis</div><div class="card-body">Quantified risk, treatment decisions, residual risk acceptance.</div></div>
</div>

<p class="l-text">PASTA is overkill for a startup; it shines in regulated industries (banks, hospitals, governments) where the threat model has to survive audit. Most teams use STRIDE for engineering-day work and PASTA-style language only when talking to auditors and risk committees.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. DREAD Scoring — Pragmatic Triage</h2>
<p class="l-text">Once you have a list of threats, you need to rank them. Microsoft's <strong>DREAD</strong> (also from the 1999 era) gives each threat a 1–10 score in five dimensions and averages them.</p>

<div class="katex-block">$$\\text{DREAD} = \\frac{D + R + E + A + D}{5}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">D — Damage</div><div class="card-body">How bad if exploited? 1 = nothing, 10 = full data loss + regulatory fine.</div></div>
<div class="calc-card"><div class="card-title">R — Reproducibility</div><div class="card-body">How reliably can it be reproduced? 1 = race condition once a year, 10 = scriptable.</div></div>
<div class="calc-card"><div class="card-title">E — Exploitability</div><div class="card-body">How hard is the attack? 1 = nation-state with 0-day, 10 = curl one-liner.</div></div>
<div class="calc-card"><div class="card-title">A — Affected users</div><div class="card-body">1 = one admin, 10 = all customers worldwide.</div></div>
<div class="calc-card"><div class="card-title">D — Discoverability</div><div class="card-body">How easy to find? 1 = need source code + luck, 10 = listed in Shodan.</div></div>
</div>

<p class="l-text">DREAD is criticized for being subjective — two analysts can score the same bug 4.0 vs 8.0 — and Microsoft itself stopped publishing DREAD-based guidance after 2008. Most modern teams use <strong>CVSS v3.1</strong> (or v4.0, released 2023) instead. CVSS gives a 0.0–10.0 score from base, temporal, and environmental metrics, and is the standard for CVE numbering. Still, DREAD is a useful informal heuristic when CVSS is too heavy for a quick triage call.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># DREAD score for a hypothetical SQL injection on the admin login form
threat = {
    "id": "T-001",
    "name": "SQLi on /admin/login",
    "damage": 9,           # full DB read + write
    "reproducibility": 10, # sqlmap one-liner
    "exploitability": 8,   # public form, no auth required
    "affected_users": 7,   # all admins, indirectly all users
    "discoverability": 9,  # error-based, visible in fuzzing
}
score = sum(threat[k] for k in ["damage","reproducibility","exploitability","affected_users","discoverability"]) / 5
print(f"{threat['name']}: DREAD = {score:.1f} (HIGH if &gt;= 7)")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses a log source — Windows Event Logs (Sysmon EID 1/3/11/22), Linux journalctl / auditd, web server access logs, or cloud audit (CloudTrail, Azure Activity Log). 2) Filters by suspicious indicators — odd parent-child process trees (cmd.exe → powershell.exe → rundll32.exe), encoded base64 commands, off-hours admin logins. 3) Correlates across sources via a SIEM query (Splunk SPL, KQL, Elastic ES|QL) — single events are noise, sequences across endpoints + network + identity are signal. 4) Writes a Sigma rule for repeat detection so the next analyst (or the SOAR playbook) catches the same pattern automatically.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Score a small portfolio of threats and rank them. This is exactly what a security architect does on a Friday afternoon before the next sprint.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import pandas as pd

threats = [
    {"id":"T-001","name":"SQLi on /admin/login",      "D":9,"R":10,"E":8,"A":7,"Di":9},
    {"id":"T-002","name":"XSS on profile bio field",   "D":4,"R":9, "E":7,"A":3,"Di":7},
    {"id":"T-003","name":"S3 bucket public read",      "D":8,"R":10,"E":10,"A":10,"Di":10},
    {"id":"T-004","name":"Race in payment confirm",    "D":7,"R":3, "E":5,"A":4,"Di":2},
    {"id":"T-005","name":"Outdated jQuery (CVE-2020-11023)","D":3,"R":8,"E":6,"A":2,"Di":8},
]
df = pd.DataFrame(threats)
df["DREAD"] = df[["D","R","E","A","Di"]].mean(axis=1).round(1)
df["severity"] = pd.cut(df["DREAD"], bins=[0,4,7,10], labels=["LOW","MED","HIGH"])
print(df.sort_values("DREAD", ascending=False).to_string(index=False))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Mapping a Real Intrusion to ATT&amp;CK — SolarWinds 2020</h2>
<p class="l-text">The <strong>SolarWinds SUNBURST</strong> incident (Dec 2020), attributed to Russia's SVR (APT29 / Cozy Bear), is the canonical modern supply-chain attack. ~18,000 organizations downloaded the trojanized Orion update; ~100 high-value targets received second-stage payloads. Mandiant and CISA published the technique map.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Initial Access — T1195.002</div><div class="card-body">Supply Chain Compromise: Compromise Software Supply Chain. Attackers planted SUNSPOT in the SolarWinds build pipeline; SUNBURST DLL was signed with the legitimate SolarWinds cert.</div></div>
<div class="calc-card"><div class="card-title">Execution — T1059.001</div><div class="card-body">PowerShell. Second-stage TEARDROP loader executed Cobalt Strike Beacon via PowerShell.</div></div>
<div class="calc-card"><div class="card-title">Defense Evasion — T1027</div><div class="card-body">Obfuscated Files. Domain generation algorithm (DGA), AES-encrypted payloads, signed binaries to bypass code-signing checks.</div></div>
<div class="calc-card"><div class="card-title">Credential Access — T1003.006</div><div class="card-body">DCSync — abused Active Directory replication to dump password hashes from domain controllers.</div></div>
<div class="calc-card"><div class="card-title">Lateral Movement — T1550.001</div><div class="card-body">Pass the Hash and forged SAML tokens (ADFS Golden SAML, T1606.002) to move into Microsoft 365.</div></div>
<div class="calc-card"><div class="card-title">Exfiltration — T1041</div><div class="card-body">Exfiltration over C2 channel — slow drip into avsvmcloud.com subdomains.</div></div>
</div>

<div class="calc-highlight"><strong>Lesson:</strong> the attack used 14+ ATT&amp;CK techniques but bypassed every Kill Chain "early stage" defense because it lived inside trusted code. This is why supply-chain controls (SBOM, SLSA, Sigstore, in-toto attestations) became a 2021–2026 industry obsession.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Build a tiny ATT&amp;CK technique register and check coverage
techniques_seen = [
    ("T1195.002","Supply Chain Compromise","Initial Access"),
    ("T1059.001","PowerShell","Execution"),
    ("T1027",    "Obfuscated Files",  "Defense Evasion"),
    ("T1003.006","DCSync",            "Credential Access"),
    ("T1550.001","Application Access Token","Lateral Movement"),
    ("T1041",    "Exfil Over C2",     "Exfiltration"),
]
controls_we_have = {"T1059.001":"PowerShell logging + Constrained Mode",
                    "T1041":"Egress DNS monitoring",
                    "T1003.006":"AD Tier-0 isolation"}
for tid, name, tactic in techniques_seen:
    cov = controls_we_have.get(tid, "GAP")
    print(f"[{tactic:&lt;20}] {tid:&lt;12} {name:&lt;30} -&gt; {cov}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses a log source — Windows Event Logs (Sysmon EID 1/3/11/22), Linux journalctl / auditd, web server access logs, or cloud audit (CloudTrail, Azure Activity Log). 2) Filters by suspicious indicators — odd parent-child process trees (cmd.exe → powershell.exe → rundll32.exe), encoded base64 commands, off-hours admin logins. 3) Correlates across sources via a SIEM query (Splunk SPL, KQL, Elastic ES|QL) — single events are noise, sequences across endpoints + network + identity are signal. 4) Writes a Sigma rule for repeat detection so the next analyst (or the SOAR playbook) catches the same pattern automatically.</p>

</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Picking the Right Framework</h2>
<p class="l-text">No single framework is "best" — they answer different questions. A mature shop uses three or four in parallel.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">STRIDE</div><div class="card-body">Use at <em>design</em> time. Cheap, fast, engineer-friendly. Embed in PR templates and arch reviews.</div></div>
<div class="calc-card"><div class="card-title">PASTA</div><div class="card-body">Use for <em>regulated systems</em> where you must justify risk decisions to auditors. Heavyweight but rigorous.</div></div>
<div class="calc-card"><div class="card-title">Cyber Kill Chain</div><div class="card-body">Use for <em>narrative</em> — board reports, IR after-action briefs. Coarse but easy to communicate.</div></div>
<div class="calc-card"><div class="card-title">MITRE ATT&amp;CK</div><div class="card-body">Use for <em>operations</em> — SOC playbooks, EDR rule mapping, purple-team coverage scoring, threat reports. Industry default.</div></div>
<div class="calc-card"><div class="card-title">DREAD / CVSS</div><div class="card-body">Use for <em>triage</em>. CVSS for CVEs and vendor reports; DREAD for quick informal calls.</div></div>
</div>

<p class="l-text">Real teams glue them together: STRIDE in code review, ATT&amp;CK in the SIEM, Kill Chain in the post-mortem deck, CVSS in the patching ticket. They are not competitors; they are complementary tools in one toolbox.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. Cyber Kill Chain timeline (visual)</h2>
<p class="l-text">Mapping the 7 Lockheed kill-chain stages onto a real intrusion timeline (SolarWinds-style, days from initial compromise). Detection opportunities shrink as the attacker moves right — early stages buy you weeks, late stages buy you minutes.</p>
<div id="plot-forensics-l1-killchain-en" class="plotly-graph" style="width:100%;height:420px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var grid = 'rgba(255,255,255,0.06)';
  var stages = ['1. Reconnaissance','2. Weaponization','3. Delivery','4. Exploitation','5. Installation','6. Command & Control','7. Actions on Objectives'];
  var starts = [0, 14, 28, 30, 31, 33, 60];
  var durations = [14, 14, 2, 1, 2, 27, 180];
  var palette = ['#4de87a','#6aa9ff','#ffd166','#ff9f43','#ff6b6b','#c44569','#8b0000'];
  var data = stages.map(function(s, i){
    return { x:[durations[i]], y:[s], type:'bar', orientation:'h', base:[starts[i]],
      marker:{color:palette[i]}, name:s, text:[durations[i]+' d'], textposition:'inside',
      hovertemplate:s+'<br>day '+starts[i]+' → '+(starts[i]+durations[i])+'<extra></extra>' };
  });
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'days from initial recon', gridcolor:grid},
    yaxis:{autorange:'reversed', automargin:true, gridcolor:grid},
    margin:{t:50,r:20,b:60,l:200}, title:{text:'Cyber Kill Chain — illustrative APT timeline', font:{color:text, size:14}}, height:420,
    showlegend:false, barmode:'overlay' };
  Plotly.newPlot('plot-forensics-l1-killchain-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-forensics-l1-killchain-tr');
  if (trDiv) Plotly.newPlot('plot-forensics-l1-killchain-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> Reconnaissance and weaponization often consume weeks — that is your largest detection window if you watch external surface (DNS, brand mentions, leaked credentials). Once the attacker reaches C2 and exfiltration, the window collapses to hours. Defense-in-depth pays for itself by widening the left half of this chart.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Recap and What's Next</h2>
<p class="l-text">Threat modeling is the foundation of every other lesson in this track. STRIDE gives you the design-time vocabulary, PASTA gives you the business-aligned process, the Kill Chain gives you the post-incident narrative, ATT&amp;CK gives you the operational vocabulary, and DREAD/CVSS give you the numeric ranking.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Shostack's four questions (what, what-can-go-wrong, what-do-we-do, did-we-do-enough) define threat modeling.</li>
<li>STRIDE = six attacker actions per element of a DFD; the inverse of six security properties.</li>
<li>Kill Chain (Lockheed 2011) = 7 stages; defenders win by breaking any one.</li>
<li>ATT&amp;CK = 14 tactics × 200+ techniques; the industry's operational taxonomy.</li>
<li>PASTA = 7 stages, business-driven, audit-friendly.</li>
<li>DREAD = 5×10 score; mostly replaced by CVSS in modern shops but still useful for fast triage.</li>
<li>Real intrusions like SolarWinds map cleanly to ATT&amp;CK and reveal coverage gaps.</li>
</ul>
</div>

<p class="l-text">In <strong>forensics-L2</strong> we descend from the architectural view into binaries themselves: PE/ELF headers, strings, YARA rules, and the static-analysis workflow that takes a suspicious sample from "is this even malware?" to "here is exactly what it does." In <strong>forensics-L3</strong> we then run the same sample in a sandbox and watch its behavior at runtime.</p>
</div>`,
tr: `<p class="l-text"><strong>Tehdit modellemesi, güvenlik mühendisliğini güvenlik tiyatrosundan ayıran şeydir.</strong> Tek bir güvenlik duvarı kuralı yazmadan önce, bir SIEM ayağa kaldırmadan önce, ilk EDR lisansınızı satın almadan önce dört soruya kesin yanıt vermeniz gerekir: <em>ne inşa ediyoruz, ne yanlış gidebilir, bu konuda ne yapacağız ve yeterince iyi bir iş çıkardık mı?</em> Adam Shostack'ın dört soruluk çerçevesi — Microsoft'un STRIDE metodolojisinin arkasındaki motor — tüm olay müdahalesi alanının kanonik açılışıdır. Bu olmadan, aslında haritalamadığınız bir saldırı yüzeyini savunmak için araç satın alıyorsunuz demektir.</p>

<p class="l-text">Bu açılış dersinde, her olay müdahale (IR) analistinin bilmesi gereken üç tehdit modelleme geleneğini gözden geçiriyoruz — Microsoft'un <strong>STRIDE</strong>'ı (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege), daha iş odaklı <strong>PASTA</strong> (Process for Attack Simulation and Threat Analysis, Tony UcedaVélez 2015) ve Lockheed Martin'in <strong>Cyber Kill Chain</strong>'i (Hutchins, Cloppert, Amin 2011) — ardından bunları modern <strong>MITRE ATT&amp;CK</strong> matrisinin gerçekliğine oturtuyoruz: 14 taktik, 200+ teknik, yüzlerce alt teknik, hepsi gözlemlenmiş düşman davranışından damıtılmış. <strong>DREAD</strong> skorlamasıyla kapatıyoruz (hâlâ tartışmalı, hâlâ kullanışlı), böylece dersin sonunda hem soyut bir kelime dağarcığına hem de hangi tehdidi önce düzelteceğinizi triyaj etmek için somut sayısal bir yola sahip olacaksınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>STRIDE kontrol listesini bir veri akış diyagramına uygulayıp somut tehditleri sıralamak</li>
<li>Bir saldırıyı Lockheed'in yedi Kill Chain aşaması boyunca keşiften hedeflere-yönelik-eylemlere kadar yürütmek</li>
<li>MITRE ATT&amp;CK matrisini okumak ve gerçek bir saldırıyı (ör. SolarWinds 2020) taktiklerine ve tekniklerine eşlemek</li>
<li>İş etkisini saldırgan kabiliyetine bağlayan PASTA tarzı risk odaklı bir model çalıştırmak</li>
<li>DREAD skorunu hesaplamak ve modern firmalarda CVSS'in onun yerini neden aldığını açıklamak</li>
<li>İş için doğru çerçeveyi seçmek: tasarım zamanı (STRIDE), iş odaklı (PASTA) veya olay sonrası (Kill Chain / ATT&amp;CK)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Önce Tehdit Modellemesi — Dört Soru</h2>
<p class="l-text">Eski Microsoft tehdit modelleme lideri Adam Shostack, koca bir disiplini her ekibin sistemi göndermeden önce yanıtlaması gereken dört soruya damıttı: (1) <em>Ne üzerinde çalışıyoruz?</em> (2) <em>Ne yanlış gidebilir?</em> (3) <em>Bu konuda ne yapacağız?</em> (4) <em>Yeterince iyi bir iş çıkardık mı?</em> Bu dördünü de yanıtlayamıyorsanız, elinizde bir tehdit modeli yoktur — yalnızca bir dilek listesi vardır.</p>

<p class="l-text">1. sorunun çıktısı genellikle bir <strong>veri akış diyagramı (DFD)</strong>'dır: süreçler için dikdörtgenler, veri depoları için paralel çizgiler, veri akışları için oklar ve güven sınırları için kesikli çizgiler. Sihir güven sınırında olur — sınırı geçen her ok potansiyel bir saldırı vektörüdür çünkü orada bir güven varsayımı biter ve diğeri başlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">S1: Ne üzerinde çalışıyoruz?</div><div class="card-body">Bir DFD oluştur. Güven sınırlarını işaretle (süreç sınırı, ağ sınırı, makine sınırı). Bir sınırı unutmak = koca bir saldırı sınıfını unutmak.</div></div>
<div class="calc-card"><div class="card-title">S2: Ne yanlış gidebilir?</div><div class="card-body">Her eleman için STRIDE çalıştır. Her süreç, depo, akış için altı STRIDE sorusunu sor. Çıktı: gerçek bir sistem için yüzlerce satırlık tehdit listesi.</div></div>
<div class="calc-card"><div class="card-title">S3: Ne yapacağız?</div><div class="card-body">Hafiflet, devret, kabul et veya ortadan kaldır. Her tehdidi bir kontrole eşle (kimlik doğrulama, şifreleme, denetim günlüğü, hız sınırlama). Kararları bir kütükte takip et.</div></div>
<div class="calc-card"><div class="card-title">S4: Yeterince iyi bir iş çıkardık mı?</div><div class="card-body">Sızma testi, kırmızı takım, hata ödülü, otomatik tarama ile doğrula. Tehdit modelleri yaşayan belgelerdir — her mimari değişiklikte yeniden çalıştır.</div></div>
</div>

<div class="calc-highlight"><strong>Sektör kuralı:</strong> geç yapılan tehdit modellemesi, tasarımda yapılandan 100 kat daha pahalıya mal olur. 1980'lerden gelen IBM Systems Sciences Institute rakamı — üretimde düzeltme tasarıma kıyasla 100x maliyet — güvenlik bağlamlarında yeniden doğrulanmıştır (NIST SP 800-160 v2).</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. STRIDE — Microsoft'un Altı Harfli Motoru</h2>
<p class="l-text">STRIDE, 1999'da Microsoft'ta Loren Kohnfelder ve Praerit Garg tarafından icat edildi ve o zamandan beri tasarım zamanı tehdit modellemesinin beygiri oldu. Püf noktası, her harfin bir güvenlik özelliğinin tersi olmasıdır: STRIDE tehditleri sırasıyla gizliliği, bütünlüğü, kullanılabilirliği, kimlik doğrulamayı, yetkilendirmeyi ve inkâr edilemezliği bozar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">S — Spoofing (Kimliğe Bürünme)</div><div class="card-body">Başka biri gibi davranma. <em>Kimlik doğrulamayı</em> bozar. Örnekler: sahte JWT, çalınmış oturum çerezi, ARP spoofing, oltalanmış kimlik bilgileri, BGP hijack.</div></div>
<div class="calc-card"><div class="card-title">T — Tampering (Kurcalama)</div><div class="card-body">Aktarımdaki veya depolanan verileri değiştirme. <em>Bütünlüğü</em> bozar. Örnekler: bir satırı değiştiren SQL injection, tedarik zinciri ihlali (SolarWinds Orion DLL 2020), TLS yükünü downgrade sonrası yeniden yazan MITM.</div></div>
<div class="calc-card"><div class="card-title">R — Repudiation (İnkâr)</div><div class="card-body">Bir eylemin gerçekleştiğini inkâr etme. <em>İnkâr edilemezliği</em> bozar. Hafifletme: denetim günlükleri, imzalanmış işlemler, değiştirilemez zincirler. Finansal dolandırıcılık ve içeriden ticaret davalarında yaygın.</div></div>
<div class="calc-card"><div class="card-title">I — Information disclosure (Bilgi İfşası)</div><div class="card-body">Kullanıcının görmemesi gereken verilerin sızması. <em>Gizliliği</em> bozar. Örnekler: dizin geçişi, IDOR (güvensiz doğrudan nesne referansı), şifresiz yedekler, herkese açık bırakılmış S3 kovaları.</div></div>
<div class="calc-card"><div class="card-title">D — Denial of service (Hizmet Reddi)</div><div class="card-body">Bir sistemi kullanılamaz hale getirme. <em>Kullanılabilirliği</em> bozar. Örnekler: SYN flood, Slowloris, Mirai-botnet UDP amplifikasyonu, uygulama katmanı Layer-7 saldırıları, fidye yazılımı.</div></div>
<div class="calc-card"><div class="card-title">E — Elevation of privilege (Yetki Yükseltme)</div><div class="card-body">Sahip olmaman gereken yetkileri kazanma. <em>Yetkilendirmeyi</em> bozar. Örnekler: çekirdek istismarı (Dirty Pipe CVE-2022-0847), PrintNightmare (CVE-2021-34527) ile Windows yetki yükseltme, konteyner kaçışı.</div></div>
</div>

<p class="l-text">Microsoft Threat Modeling Tool, bir DFD üzerinde STRIDE-per-element gezintilerini otomatikleştirir. Pratikte, olgun firmalar STRIDE istemlerini PR şablonlarına gömer: her mimari değişiklik birleştirilmeden önce tehditlerini ve hafifletmelerini listelemek zorundadır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Lockheed'in Cyber Kill Chain'i — Saldırıyı Yeniden Kurmak</h2>
<p class="l-text">STRIDE tasarım zamanıyken, <strong>Cyber Kill Chain</strong> (Hutchins, Cloppert, Amin, Lockheed Martin, 2011) olay zamanıdır. Herhangi bir saldırıyı yedi sıralı aşamaya böler. Savunucular zinciri <em>herhangi</em> bir aşamada kırarak kazanır — saldırganın sırayla her aşamada başarılı olması gerekir.</p>

<div class="katex-block">$$\\text{Kill Chain} = \\text{Recon} \\to \\text{Weaponize} \\to \\text{Deliver} \\to \\text{Exploit} \\to \\text{Install} \\to \\text{C2} \\to \\text{Actions}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Keşif (Reconnaissance)</div><div class="card-body">OSINT, LinkedIn taraması, Shodan taramaları, DNS keşfi, Google dorking. Hafifletme: kamuya açık yüzeyi minimize et, marka bahsetmelerini izle.</div></div>
<div class="calc-card"><div class="card-title">2. Silahlandırma (Weaponization)</div><div class="card-body">Bir istismarı bir yükle eşleştir. Ör. makro yüklü Word doc + Cobalt Strike Beacon. Hafifletme: zor — saldırgan altyapısında olur.</div></div>
<div class="calc-card"><div class="card-title">3. Teslim (Delivery)</div><div class="card-body">E-posta, USB bırakma, sulama deliği, tedarik zinciri. Hafifletme: e-posta güvenlik ağ geçitleri, sandbox patlatma, USB engelleme.</div></div>
<div class="calc-card"><div class="card-title">4. İstismar (Exploitation)</div><div class="card-body">Kod yürütme. CVE istismarı, makro yürütme, RCE. Hafifletme: yamalama, davranış algılamalı EDR, ASLR / DEP.</div></div>
<div class="calc-card"><div class="card-title">5. Kurulum (Installation)</div><div class="card-body">Kalıcılık — kayıt defteri Run anahtarları, zamanlanmış görevler, hizmetler, WMI abonelikleri. Hafifletme: autoruns izleme, Sysmon ID 13.</div></div>
<div class="calc-card"><div class="card-title">6. Komuta &amp; Kontrol (C2)</div><div class="card-body">Saldırgana sinyal gönderme. DNS tünelleme, HTTPS C2, alan adı önyüzleme. Hafifletme: çıkış filtreleme, JA3 parmak izi (L6'da işlenir).</div></div>
<div class="calc-card"><div class="card-title">7. Hedef Üzerinde Eylemler</div><div class="card-body">Veri sızdırma, fidye yazılımı dağıtımı, yanal hareket. Hafifletme: DLP, ağ segmentasyonu, değiştirilemez yedekler (3-2-1 kuralı).</div></div>
</div>

<div class="calc-highlight"><strong>Gerçek örnek:</strong> NotPetya 2017 — Keşif (Ukrayna'daki M.E.Doc kullanıcıları), Silahlandırma (EternalBlue + Mimikatz + özel wiper), Teslim (M.E.Doc otomatik güncelleme), İstismar (SMB), Kurulum (yok — wiper), C2 (yok, kendi kendine yayılan), Eylemler (yıkım). Toplam zarar: \\$10 milyar. Yalnızca Maersk \\$300 milyon kaybetti.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. MITRE ATT&amp;CK — Sektör Standardı</h2>
<p class="l-text">Kill Chain modern savunma için fazla kabadır. <strong>MITRE ATT&amp;CK</strong> (Adversarial Tactics, Techniques &amp; Common Knowledge), 2013'te MITRE tarafından yayımlandı ve sürekli güncellenir; onun yerine çok daha zengin bir matris koyar: <strong>14 taktik</strong> ("neden") <strong>200+ teknik</strong> ("nasıl") boyunca yayılır, yüzlerce de <strong>alt teknik</strong> içerir. Her tekniğin <code>T1059.003</code> (Komut ve Betik Yorumlayıcı: Windows Komut Kabuğu) gibi sabit bir kimliği vardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">14 Kurumsal Taktik</div><div class="card-body">Reconnaissance (TA0043), Resource Development, Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command and Control, Exfiltration, Impact (TA0040). Her biri matriste bir sütundur.</div></div>
<div class="calc-card"><div class="card-title">Teknikler</div><div class="card-body">Belirli davranışlar. T1566 Phishing, T1059 Command and Scripting Interpreter, T1003 OS Credential Dumping (Mimikatz vb.), T1486 Data Encrypted for Impact (fidye yazılımı).</div></div>
<div class="calc-card"><div class="card-title">Prosedürler</div><div class="card-body">Somut uygulamalar. APT29, T1059.001 PowerShell'i karartılmış base64 ile kullanır. Conti fidye yazılımı T1486'yı ChaCha20+RSA-4096 ile kullanır.</div></div>
<div class="calc-card"><div class="card-title">Tespitler &amp; Hafifletmeler</div><div class="card-body">Her teknik sayfası veri kaynaklarını (süreç oluşturma, komut satırı, ağ bağlantısı) ve CIS-eşlemeli hafifletmeleri listeler. ATT&amp;CK'i eyleme dönüştürülebilir kılan budur.</div></div>
</div>

<p class="l-text">ATT&amp;CK modern IR'nin ortak dilidir: SIEM kuralları, EDR uyarıları, tehdit raporları, kırmızı takım planları ve mor takım metrikleri hepsi teknik kimliklerine atıfta bulunur. Eşlik eden proje <strong>D3FEND</strong> (NSA finanslı, MITRE) bütünlük için savunma tekniklerini ATT&amp;CK'e geri eşler.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. PASTA — Risk Sürücü Olduğunda</h2>
<p class="l-text"><strong>PASTA</strong> (Process for Attack Simulation and Threat Analysis), Tony UcedaVélez ve Marco Morana tarafından <em>Risk Centric Threat Modeling</em>'de (Wiley 2015) resmileştirildi; güvenliği iş riski ile hizalamayı amaçlayan 7 aşamalı bir metodolojidir. STRIDE bir kelime dağarcığı, Kill Chain bir anlatıdır; PASTA ise bir süreçtir — ağır ama yönetim kuruluna karşı savunulabilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşama 1 — Hedefleri Tanımla</div><div class="card-body">İş hedefleri, düzenleyici sürücüler (PCI-DSS, GDPR, HIPAA), risk iştahı. Çıktı: kapsam bildirgesi.</div></div>
<div class="calc-card"><div class="card-title">Aşama 2 — Teknik Kapsamı Tanımla</div><div class="card-body">Mimari, bileşenler, bağımlılıklar, veri sınıflandırmaları.</div></div>
<div class="calc-card"><div class="card-title">Aşama 3 — Uygulama Ayrıştırması</div><div class="card-body">DFD'ler, güven sınırları, saldırı yüzeyi numaralandırması.</div></div>
<div class="calc-card"><div class="card-title">Aşama 4 — Tehdit Analizi</div><div class="card-body">Tehdit istihbaratı, saldırgan kabiliyeti/motivasyonu (APT'ler vs script kiddie'ler), sektöre özgü tehdit manzarası.</div></div>
<div class="calc-card"><div class="card-title">Aşama 5 — Zayıflık Analizi</div><div class="card-body">SAST/DAST sonuçları, CVE eşleştirme, yapılandırma sapması.</div></div>
<div class="calc-card"><div class="card-title">Aşama 6 — Saldırı Modellemesi</div><div class="card-body">Saldırı ağaçları, kötüye kullanım vakaları, istismar zincirleri.</div></div>
<div class="calc-card"><div class="card-title">Aşama 7 — Risk &amp; Etki Analizi</div><div class="card-body">Nicelleştirilmiş risk, müdahale kararları, artık risk kabulü.</div></div>
</div>

<p class="l-text">PASTA bir startup için aşırıdır; tehdit modelinin denetimden geçmek zorunda olduğu düzenlenmiş sektörlerde (bankalar, hastaneler, devletler) parlar. Çoğu ekip mühendislik günü işi için STRIDE'ı, yalnızca denetçilerle ve risk komiteleriyle konuşurken PASTA tarzı dili kullanır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. DREAD Skorlaması — Pragmatik Triyaj</h2>
<p class="l-text">Bir tehdit listeniz olduğunda, onları sıralamanız gerekir. Microsoft'un (yine 1999 döneminden) <strong>DREAD</strong>'i her tehdide beş boyutta 1–10 arası bir puan verir ve ortalamasını alır.</p>

<div class="katex-block">$$\\text{DREAD} = \\frac{D + R + E + A + D}{5}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">D — Damage (Hasar)</div><div class="card-body">İstismar edilirse ne kadar kötü? 1 = hiçbir şey, 10 = tam veri kaybı + düzenleyici para cezası.</div></div>
<div class="calc-card"><div class="card-title">R — Reproducibility (Tekrarlanabilirlik)</div><div class="card-body">Ne kadar güvenilir şekilde yeniden üretilebilir? 1 = yılda bir kez race condition, 10 = scriptlenebilir.</div></div>
<div class="calc-card"><div class="card-title">E — Exploitability (İstismar Edilebilirlik)</div><div class="card-body">Saldırı ne kadar zor? 1 = 0-day'li ulus-devlet, 10 = curl tek satırı.</div></div>
<div class="calc-card"><div class="card-title">A — Affected users (Etkilenen kullanıcılar)</div><div class="card-body">1 = bir admin, 10 = dünya çapında tüm müşteriler.</div></div>
<div class="calc-card"><div class="card-title">D — Discoverability (Keşfedilebilirlik)</div><div class="card-body">Bulması ne kadar kolay? 1 = kaynak kodu + şans gerekli, 10 = Shodan'da listeli.</div></div>
</div>

<p class="l-text">DREAD öznel olduğu için eleştirilir — iki analist aynı hatayı 4.0'a karşı 8.0 puanlayabilir — ve Microsoft'un kendisi 2008'den sonra DREAD tabanlı rehberlik yayımlamayı bıraktı. Çoğu modern ekip yerine <strong>CVSS v3.1</strong>'i (veya 2023'te yayımlanan v4.0'ı) kullanır. CVSS, taban, zamansal ve çevresel metriklerden 0.0–10.0 arası bir puan verir ve CVE numaralandırmasının standardıdır. Yine de DREAD, CVSS'in hızlı bir triyaj çağrısı için fazla ağır olduğu durumlarda kullanışlı bir gayri resmi sezgisel araçtır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Yönetici giriş formundaki varsayımsal SQL injection için DREAD skoru
threat = {
    "id": "T-001",
    "name": "SQLi on /admin/login",
    "damage": 9,           # full DB read + write
    "reproducibility": 10, # sqlmap one-liner
    "exploitability": 8,   # public form, no auth required
    "affected_users": 7,   # all admins, indirectly all users
    "discoverability": 9,  # error-based, visible in fuzzing
}
score = sum(threat[k] for k in ["damage","reproducibility","exploitability","affected_users","discoverability"]) / 5
print(f"{threat['name']}: DREAD = {score:.1f} (HIGH if &gt;= 7)")
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Bir log kaynağını parse eder — Windows Event Log (Sysmon EID 1/3/11/22), Linux journalctl / auditd, web server access log veya bulut audit (CloudTrail, Azure Activity Log). 2) Şüpheli göstergelere göre filtreler — garip parent-child process ağaçları (cmd.exe → powershell.exe → rundll32.exe), encoded base64 komutları, mesai dışı admin girişleri. 3) Bir SIEM sorgusuyla (Splunk SPL, KQL, Elastic ES|QL) kaynaklar arası korelasyon kurar — tek olay gürültüdür, endpoint + ağ + kimlik arasındaki diziler sinyaldir. 4) Tekrar tespiti için Sigma kuralı yazar — bir sonraki analist (veya SOAR playbook) aynı pattern'i otomatik yakalar.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük bir tehdit portföyünü puanla ve sırala. Bir güvenlik mimarının cuma öğleden sonra bir sonraki sprintten önce yaptığı tam olarak budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import pandas as pd

threats = [
    {"id":"T-001","name":"SQLi on /admin/login",      "D":9,"R":10,"E":8,"A":7,"Di":9},
    {"id":"T-002","name":"XSS on profile bio field",   "D":4,"R":9, "E":7,"A":3,"Di":7},
    {"id":"T-003","name":"S3 bucket public read",      "D":8,"R":10,"E":10,"A":10,"Di":10},
    {"id":"T-004","name":"Race in payment confirm",    "D":7,"R":3, "E":5,"A":4,"Di":2},
    {"id":"T-005","name":"Outdated jQuery (CVE-2020-11023)","D":3,"R":8,"E":6,"A":2,"Di":8},
]
df = pd.DataFrame(threats)
df["DREAD"] = df[["D","R","E","A","Di"]].mean(axis=1).round(1)
df["severity"] = pd.cut(df["DREAD"], bins=[0,4,7,10], labels=["LOW","MED","HIGH"])
print(df.sort_values("DREAD", ascending=False).to_string(index=False))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Gerçek Bir Saldırıyı ATT&amp;CK'e Eşlemek — SolarWinds 2020</h2>
<p class="l-text">Rusya'nın SVR'sine (APT29 / Cozy Bear) atfedilen <strong>SolarWinds SUNBURST</strong> olayı (Aralık 2020), modern tedarik zinciri saldırısının kanonik örneğidir. ~18.000 kuruluş trojanlanmış Orion güncellemesini indirdi; ~100 yüksek değerli hedef ikinci aşama yükler aldı. Mandiant ve CISA teknik haritasını yayımladı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İlk Erişim — T1195.002</div><div class="card-body">Tedarik Zinciri İhlali: Yazılım Tedarik Zincirini Tehlikeye Atma. Saldırganlar SolarWinds derleme hattına SUNSPOT yerleştirdi; SUNBURST DLL'i meşru SolarWinds sertifikasıyla imzalandı.</div></div>
<div class="calc-card"><div class="card-title">Yürütme — T1059.001</div><div class="card-body">PowerShell. İkinci aşama TEARDROP yükleyici Cobalt Strike Beacon'ı PowerShell üzerinden yürüttü.</div></div>
<div class="calc-card"><div class="card-title">Savunma Atlatma — T1027</div><div class="card-body">Karartılmış Dosyalar. Etki alanı üretim algoritması (DGA), AES-şifreli yükler, kod imzalama denetimlerini atlamak için imzalı ikili dosyalar.</div></div>
<div class="calc-card"><div class="card-title">Kimlik Bilgisi Erişimi — T1003.006</div><div class="card-body">DCSync — Active Directory replikasyonunu kötüye kullanarak etki alanı denetleyicilerinden parola hash'lerini döktü.</div></div>
<div class="calc-card"><div class="card-title">Yanal Hareket — T1550.001</div><div class="card-body">Pass the Hash ve sahte SAML token'ları (ADFS Golden SAML, T1606.002) ile Microsoft 365'e geçiş.</div></div>
<div class="calc-card"><div class="card-title">Sızdırma — T1041</div><div class="card-body">C2 kanalı üzerinden sızdırma — avsvmcloud.com alt alan adlarına yavaş damlama.</div></div>
</div>

<div class="calc-highlight"><strong>Ders:</strong> saldırı 14+ ATT&amp;CK tekniği kullandı ancak güvenilir kodun içinde yaşadığı için her Kill Chain "erken aşama" savunmasını atladı. Bu yüzden tedarik zinciri kontrolleri (SBOM, SLSA, Sigstore, in-toto onayları) 2021–2026 döneminde sektörün takıntısı haline geldi.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Küçük bir ATT&amp;CK teknik kütüğü oluştur ve kapsamı kontrol et
techniques_seen = [
    ("T1195.002","Supply Chain Compromise","Initial Access"),
    ("T1059.001","PowerShell","Execution"),
    ("T1027",    "Obfuscated Files",  "Defense Evasion"),
    ("T1003.006","DCSync",            "Credential Access"),
    ("T1550.001","Application Access Token","Lateral Movement"),
    ("T1041",    "Exfil Over C2",     "Exfiltration"),
]
controls_we_have = {"T1059.001":"PowerShell logging + Constrained Mode",
                    "T1041":"Egress DNS monitoring",
                    "T1003.006":"AD Tier-0 isolation"}
for tid, name, tactic in techniques_seen:
    cov = controls_we_have.get(tid, "GAP")
    print(f"[{tactic:&lt;20}] {tid:&lt;12} {name:&lt;30} -&gt; {cov}")
</code></pre></div>
<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Bir log kaynağını parse eder — Windows Event Log (Sysmon EID 1/3/11/22), Linux journalctl / auditd, web server access log veya bulut audit (CloudTrail, Azure Activity Log). 2) Şüpheli göstergelere göre filtreler — garip parent-child process ağaçları (cmd.exe → powershell.exe → rundll32.exe), encoded base64 komutları, mesai dışı admin girişleri. 3) Bir SIEM sorgusuyla (Splunk SPL, KQL, Elastic ES|QL) kaynaklar arası korelasyon kurar — tek olay gürültüdür, endpoint + ağ + kimlik arasındaki diziler sinyaldir. 4) Tekrar tespiti için Sigma kuralı yazar — bir sonraki analist (veya SOAR playbook) aynı pattern'i otomatik yakalar.</p>

</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Doğru Çerçeveyi Seçmek</h2>
<p class="l-text">Hiçbir tek çerçeve "en iyi" değildir — farklı sorulara yanıt verirler. Olgun bir firma üç-dört tanesini paralel kullanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">STRIDE</div><div class="card-body"><em>Tasarım</em> zamanında kullan. Ucuz, hızlı, mühendis dostu. PR şablonlarına ve mimari incelemelere göm.</div></div>
<div class="calc-card"><div class="card-title">PASTA</div><div class="card-body">Risk kararlarını denetçilere gerekçelendirmek zorunda olduğun <em>düzenlenmiş sistemler</em> için kullan. Ağır ama sıkı.</div></div>
<div class="calc-card"><div class="card-title">Cyber Kill Chain</div><div class="card-body"><em>Anlatı</em> için kullan — yönetim kurulu raporları, IR sonrası eylem brifingleri. Kaba ama iletişimi kolay.</div></div>
<div class="calc-card"><div class="card-title">MITRE ATT&amp;CK</div><div class="card-body"><em>Operasyon</em> için kullan — SOC oyun kitapları, EDR kural eşlemesi, mor takım kapsam puanlaması, tehdit raporları. Sektör varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">DREAD / CVSS</div><div class="card-body"><em>Triyaj</em> için kullan. CVE'ler ve satıcı raporları için CVSS; hızlı gayri resmi çağrılar için DREAD.</div></div>
</div>

<p class="l-text">Gerçek ekipler bunları birbirine yapıştırır: kod incelemesinde STRIDE, SIEM'de ATT&amp;CK, post-mortem sunumda Kill Chain, yamalama biletinde CVSS. Bunlar rakip değil; tek bir alet kutusunda tamamlayıcı araçlardır.</p>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. Cyber Kill Chain zaman çizelgesi (görsel)</h2>
<p class="l-text">7 Lockheed kill-chain aşamasını gerçek bir saldırı zaman çizelgesine (SolarWinds-stili, ilk uzlaşmadan itibaren gün) eşliyoruz. Saldırgan sağa kaydıkça tespit fırsatları daralır — erken aşamalar size hafta, geç aşamalar dakika kazandırır.</p>
<div id="plot-forensics-l1-killchain-tr" class="plotly-graph" style="width:100%;height:420px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Keşif ve silahlandırma genellikle haftalar alır — eğer dış yüzeyi (DNS, marka anmaları, sızdırılmış kimlik bilgileri) izliyorsanız, bu en geniş tespit pencerenizdir. Saldırgan C2 ve sızdırmaya ulaştığında pencere saatlere çöker. Derinlemesine savunma bu grafiğin sol yarısını genişleterek karşılığını verir.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<p class="l-text">Tehdit modellemesi, bu izlekteki diğer her dersin temelidir. STRIDE size tasarım zamanı kelime dağarcığını, PASTA iş hizalı süreci, Kill Chain olay sonrası anlatıyı, ATT&amp;CK operasyonel kelime dağarcığını ve DREAD/CVSS sayısal sıralamayı verir.</p>

<div class="calc-highlight"><strong>Temel çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Shostack'ın dört sorusu (ne, ne-yanlış-gidebilir, ne-yapacağız, yeterince-yaptık-mı) tehdit modellemesini tanımlar.</li>
<li>STRIDE = bir DFD'nin her elemanı için altı saldırgan eylemi; altı güvenlik özelliğinin tersi.</li>
<li>Kill Chain (Lockheed 2011) = 7 aşama; savunucular herhangi birini kırarak kazanır.</li>
<li>ATT&amp;CK = 14 taktik × 200+ teknik; sektörün operasyonel taksonomisi.</li>
<li>PASTA = 7 aşama, iş odaklı, denetim dostu.</li>
<li>DREAD = 5×10 puan; modern firmalarda çoğunlukla CVSS ile değiştirildi ama hızlı triyaj için hâlâ kullanışlı.</li>
<li>SolarWinds gibi gerçek saldırılar ATT&amp;CK'e temiz şekilde eşlenir ve kapsam boşluklarını ortaya çıkarır.</li>
</ul>
</div>

<p class="l-text"><strong>forensics-L2</strong>'de mimari görünümden ikili dosyaların kendisine iniyoruz: PE/ELF başlıkları, dizgiler, YARA kuralları ve şüpheli bir örneği "bu hatta zararlı yazılım mı?" durumundan "tam olarak ne yaptığını işte burada" durumuna taşıyan statik analiz iş akışı. <strong>forensics-L3</strong>'te ise aynı örneği bir sandbox'ta çalıştırıp davranışını çalışma zamanında izliyoruz.</p>
</div>`
};
