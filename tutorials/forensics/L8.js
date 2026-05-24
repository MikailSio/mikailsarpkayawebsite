window.FORENSICS_L8 = {
en: `<p class="l-text"><strong>This is the capstone of the Forensics track: tying everything into a working Incident Response (IR) operation.</strong> Static and dynamic analysis (L2-L3), reverse engineering (L4), memory and network forensics (L5-L6), and threat intelligence (L7) are not separate islands — they are the components of a pipeline that runs every time a SOC analyst clicks "investigate" on an EDR alert. The pipeline that codifies them is the <strong>NIST SP 800-61 Rev. 2 Computer Security Incident Handling Guide</strong> (last updated 2012, supplemented by 800-61r3 draft 2024), and the technology that runs it at scale is the modern <strong>SIEM/SOAR stack</strong>: Splunk Enterprise Security, Elastic Security (formerly Endgame), Microsoft Sentinel, Sumo Logic Cloud SIEM — paired with SOAR platforms like Cortex XSOAR (Palo Alto), Tines, Torq, and Splunk SOAR (Phantom).</p>

<p class="l-text">In this lesson we walk the IR lifecycle (Preparation, Detection &amp; Analysis, Containment / Eradication / Recovery, Post-Incident Activity), the SIEM data model (events → normalized fields → detections → cases), the SOAR playbook concept (state machines that orchestrate human + automation), and finish with a working Python state-machine implementation of an IR playbook for a phishing-with-malware-attachment incident — the canonical "Tier-1 SOC ticket" that drives 60% of all IR work in 2026.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The 4 phases of NIST SP 800-61 IR lifecycle and the loops between Detection ↔ Containment</li>
<li>SIEM architecture: ingestion, parsing, normalization (CIM/ECS/OCSF), correlation, alerting</li>
<li>Splunk SPL vs Elastic KQL vs Microsoft Sentinel KQL — same job, three syntaxes</li>
<li>SOAR playbooks: triggers, tasks, decisions, parallel execution, human gates</li>
<li>The Tier-1 / Tier-2 / Tier-3 SOC analyst hierarchy and where automation cuts toil</li>
<li>Build a Python IR-playbook state machine for a phishing-attachment incident</li>
<li>Post-mortem: what makes a useful blameless retrospective</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. NIST SP 800-61 — The IR Lifecycle</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Preparation</div><div class="card-body">Before incidents: tooling, playbooks, communication plans, training, tabletop exercises, retainer with external IR firm (Mandiant, Crowdstrike Services, Kroll). The phase that decides whether the next four go well.</div></div>
<div class="calc-card"><div class="card-title">2. Detection &amp; Analysis</div><div class="card-body">Alert fires (SIEM, EDR, user report). Triage: false positive? severity? scope? Build a timeline. Use everything from forensics-L2 through L7.</div></div>
<div class="calc-card"><div class="card-title">3. Containment, Eradication, Recovery</div><div class="card-body">Short-term contain (isolate host, block IP), long-term contain (re-image, rotate creds), eradicate (remove persistence, patch CVE), recover (restore service, monitor for recurrence).</div></div>
<div class="calc-card"><div class="card-title">4. Post-Incident Activity</div><div class="card-body">Lessons learned. Update playbooks. Improve detections. The phase most teams skip and most regret.</div></div>
</div>

<div class="calc-highlight">The lifecycle is a <em>loop</em>, not a line. Detection and Containment ping-pong: every containment action reveals new artifacts that retrigger detection on previously unsuspected hosts. Production IRs run for weeks.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The SOC Tier Model</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tier 1 (Triage)</div><div class="card-body">First responders. Read alerts, run playbooks, escalate. Volume: hundreds of alerts/shift. Typical 6-12 month role before Tier 2.</div></div>
<div class="calc-card"><div class="card-title">Tier 2 (Investigation)</div><div class="card-body">Deeper analysis: pivot in EDR, write hypotheses, run focused queries. Tunes Tier-1 playbooks.</div></div>
<div class="calc-card"><div class="card-title">Tier 3 (Hunting / IR)</div><div class="card-body">Threat hunting (proactive, hypothesis-driven), full-blown IR cases, custom detections, malware analysis. Reverses samples from L4.</div></div>
<div class="calc-card"><div class="card-title">Where automation lives</div><div class="card-body">SOAR replaces 60-80% of Tier-1 toil: enrichment lookups (VirusTotal, AbuseIPDB), user/asset context, basic containment (isolate host, disable user). Humans remain the decision authority on impactful actions.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SIEM Architecture in Five Layers</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li><strong>Ingestion</strong>: agents (Splunk UF, Elastic Beats, Microsoft Sentinel connectors) ship logs over TCP/HTTPS to indexers.</li>
<li><strong>Parsing</strong>: regex / Grok / sourcetype-based parsers split free-form lines into fields.</li>
<li><strong>Normalization</strong>: map vendor fields to a common schema. Splunk uses <em>CIM</em> (Common Information Model). Elastic uses <em>ECS</em> (Elastic Common Schema). The new cross-vendor effort is <strong>OCSF</strong> (Open Cybersecurity Schema Framework, AWS-led, 2022). Without normalization, "give me all login failures across 12 product types" is a nightmare.</li>
<li><strong>Correlation</strong>: detections (saved searches in Splunk SPL, EQL/KQL rules in Elastic, KQL analytics in Sentinel) fire on patterns: "5 failed logons followed by success within 60s". Sigma rules compile to all three.</li>
<li><strong>Case management</strong>: alert → notable event → case → SOAR playbook → ticket → resolution.</li>
</ol>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. SPL (Splunk) vs Elastic-KQL vs Sentinel-KQL — One Detection, Three Languages</h2>
<p class="l-text">A detection like "process tree shows winword.exe spawning powershell.exe" looks slightly different in each:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Splunk SPL
spl = """
index=edr sourcetype=process_creation
| where parent_image="winword.exe" AND image="powershell.exe"
| stats count by host, user, command_line
| where count > 0
"""

# Elastic / Kibana KQL (event query)
kql_elastic = '''
event.category:"process" and process.parent.name:"winword.exe"
and process.name:"powershell.exe"
'''

# Microsoft Sentinel KQL (Azure Data Explorer flavor)
kql_sentinel = """
DeviceProcessEvents
| where InitiatingProcessFileName =~ "winword.exe"
| where FileName =~ "powershell.exe"
| project Timestamp, DeviceName, AccountName, ProcessCommandLine
"""

# Sigma rule (vendor-neutral, compiles to all three)
sigma_yaml = """
title: Office Spawning PowerShell
logsource: { category: process_creation, product: windows }
detection:
  selection:
    ParentImage|endswith: '\\\\winword.exe'
    Image|endswith: '\\\\powershell.exe'
  condition: selection
level: high
"""
print("Same detection — three SIEM dialects + one Sigma source-of-truth.")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses a log source — Windows Event Logs (Sysmon EID 1/3/11/22), Linux journalctl / auditd, web server access logs, or cloud audit (CloudTrail, Azure Activity Log). 2) Filters by suspicious indicators — odd parent-child process trees (cmd.exe → powershell.exe → rundll32.exe), encoded base64 commands, off-hours admin logins. 3) Correlates across sources via a SIEM query (Splunk SPL, KQL, Elastic ES|QL) — single events are noise, sequences across endpoints + network + identity are signal. 4) Writes a Sigma rule for repeat detection so the next analyst (or the SOAR playbook) catches the same pattern automatically.</p>

</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. SOAR Playbooks — State Machines for Humans+Bots</h2>
<p class="l-text">A SOAR playbook is a <em>typed state machine</em>. Cortex XSOAR's playbook designer, Tines stories, and Splunk SOAR's "playbook" all reduce to: nodes (tasks) with typed inputs, edges (transitions) with conditions, and special node types for humans (approval gates) and parallel branches.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trigger</div><div class="card-body">SIEM alert / email / webhook. Carries context: alert id, observed indicators, asset/user.</div></div>
<div class="calc-card"><div class="card-title">Enrichment</div><div class="card-body">Hash → VirusTotal, IP → AbuseIPDB+GeoIP, user → AD, asset → CMDB. Parallel.</div></div>
<div class="calc-card"><div class="card-title">Decision</div><div class="card-body">If VT detection ratio &gt; 30/70 AND asset criticality = "high" → escalate to Tier 2 with auto-isolate.</div></div>
<div class="calc-card"><div class="card-title">Action</div><div class="card-body">Isolate host (CrowdStrike RTR / Defender ASR), disable user (Azure AD), block hash (firewall feed), open ticket (Jira/ServiceNow).</div></div>
<div class="calc-card"><div class="card-title">Human Gate</div><div class="card-body">"Confirm isolation of CFO's laptop?" — Slack/Teams interactive button. Default no-op on timeout.</div></div>
<div class="calc-card"><div class="card-title">Closure</div><div class="card-body">Notify reporter, update SIEM case, post-mortem trigger if severity &gt;= P2.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Phishing-Attachment Playbook in Python</h2>
<p class="l-text">Below is a runnable, dependency-free implementation of the canonical Tier-1 playbook: a state machine that consumes a "phishing email with attachment" alert, enriches the indicators, decides on containment, and emits a structured case record. This is the kind of code Cortex XSOAR generates from its visual playbook editor.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, json, time
from datetime import datetime, timezone

# --- Mock external services (real life: APIs) ---------------------------
def vt_lookup(sha256): return {"detection_ratio": 47/72, "first_seen":"2026-04-29"} if sha256.endswith("e") else {"detection_ratio":1/72}
def abuseipdb(ip):     return {"abuse_score": 89 if ip.startswith("203.0.113") else 3}
def ad_lookup(user):   return {"dept":"Finance","manager":"alice@corp"} if user else {}
def cmdb_lookup(host): return {"criticality":"high","owner":"bob@corp","tier":1}
def isolate(host):     print(f"  [ACTION] Isolated host {host}"); return True
def disable_user(u):   print(f"  [ACTION] Disabled user {u}");      return True
def open_ticket(case): print(f"  [ACTION] Ticket opened #{case['id']}: {case['title']}"); return True

# --- Playbook state machine ---------------------------------------------
def run_playbook(alert):
    case = {"id":"INC-"+str(int(time.time())),
            "title":alert["subject"],
            "state":"NEW","timeline":[]}
    def log(msg):
        case["timeline"].append({"t":datetime.now(timezone.utc).isoformat(),"msg":msg})
        print("[",case["state"],"]", msg)

    # State 1: enrich (parallel in real SOAR; sequential here for clarity)
    case["state"] = "ENRICHING"
    vt    = vt_lookup(alert["sha256"]);     log(f"VT detection ratio = {vt['detection_ratio']:.2f}")
    abuse = abuseipdb(alert["src_ip"]);     log(f"AbuseIPDB score    = {abuse['abuse_score']}")
    user  = ad_lookup(alert["recipient"]);  log(f"User context       = {user}")
    asset = cmdb_lookup(alert["host"]);     log(f"Asset criticality  = {asset['criticality']}")

    # State 2: decide
    case["state"] = "DECIDING"
    malicious = vt["detection_ratio"] &gt; 0.30 or abuse["abuse_score"] &gt; 50
    high_value = asset["criticality"] == "high"
    if not malicious:
        case["state"]="CLOSED_BENIGN"; log("Benign — auto-close"); return case

    # State 3: contain
    case["state"] = "CONTAINING"
    if high_value:
        log("HIGH severity — Tier-2 escalate + auto-isolate")
        isolate(alert["host"])
        if abuse["abuse_score"] &gt; 80: disable_user(alert["recipient"])
    else:
        log("MEDIUM severity — Tier-2 review, no auto-isolate")

    # State 4: ticket + post-mortem flag
    case["state"] = "TICKETED"
    open_ticket(case)
    if high_value: case["postmortem_required"] = True
    case["state"] = "OPEN_TIER2"
    log("Handed to Tier-2"); return case

# --- Drive it ------------------------------------------------------------
alert = {"subject":"Phishing with attachment — invoice.zip",
         "sha256":"a"*63 + "e",       # ends with 'e' → high VT score in mock
         "src_ip":"203.0.113.42",
         "recipient":"victim@corp",
         "host":"WS-FINANCE-07"}
case = run_playbook(alert)
print("\\nFinal case:", json.dumps({k:v for k,v in case.items() if k!="timeline"}, indent=2))
print("Timeline length:", len(case["timeline"]))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Parses a log source — Windows Event Logs (Sysmon EID 1/3/11/22), Linux journalctl / auditd, web server access logs, or cloud audit (CloudTrail, Azure Activity Log). 2) Filters by suspicious indicators — odd parent-child process trees (cmd.exe → powershell.exe → rundll32.exe), encoded base64 commands, off-hours admin logins. 3) Correlates across sources via a SIEM query (Splunk SPL, KQL, Elastic ES|QL) — single events are noise, sequences across endpoints + network + identity are signal. 4) Writes a Sigma rule for repeat detection so the next analyst (or the SOAR playbook) catches the same pattern automatically.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same playbook engine, browser-runnable. Try changing the SHA-256 last char to a non-'e' to see the benign-auto-close branch.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time, json
from datetime import datetime, timezone

def vt(sha):    return 47/72 if sha.endswith("e") else 1/72
def abuse(ip):  return 89 if ip.startswith("203.0.113") else 3
def cmdb(h):    return "high" if "FIN" in h else "low"

def playbook(alert):
    case = {"id":"INC-"+str(int(time.time())), "state":"NEW", "log":[]}
    def L(m): case["log"].append((case["state"],m)); print(f"[{case['state']}] {m}")

    case["state"]="ENRICH"
    vts, abs_, crit = vt(alert["sha"]), abuse(alert["ip"]), cmdb(alert["host"])
    L(f"vt={vts:.2f} abuse={abs_} crit={crit}")

    case["state"]="DECIDE"
    if vts &lt;= 0.3 and abs_ &lt;= 50:
        case["state"]="CLOSED_BENIGN"; L("benign"); return case

    case["state"]="CONTAIN"
    if crit == "high":
        L(f"isolate {alert['host']}")
        if abs_ &gt; 80: L(f"disable {alert['user']}")
    case["state"]="OPEN_TIER2"; L("ticket opened"); return case

a = {"sha":"a"*63+"e","ip":"203.0.113.42","user":"victim","host":"WS-FIN-07"}
c = playbook(a)
print("\\nfinal state:", c["state"])
print("steps:",        len(c["log"]))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Post-Mortem — Blameless and Useful</h2>
<p class="l-text">Borrowed from SRE culture (Google's "Site Reliability Engineering" book, 2016): the <strong>blameless post-mortem</strong>. Document <em>what happened, in what order, with what timestamps, and what surprised us</em>. Never <em>who screwed up</em>. The output is concrete actions, owners, and dates.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Timeline</div><div class="card-body">UTC timestamps, raw events: alert fired, analyst paged, isolation issued, payload found, eradication confirmed.</div></div>
<div class="calc-card"><div class="card-title">Root cause(s)</div><div class="card-body">5-Whys. Often technical + organizational (missing patch + missing change-control review).</div></div>
<div class="calc-card"><div class="card-title">What worked</div><div class="card-body">Detection in 4 minutes, EDR isolation in 8, full eradication in 27. Celebrate.</div></div>
<div class="calc-card"><div class="card-title">What did not</div><div class="card-body">Backup CMDB stale → wrong owner paged. Playbook lacked Slack notify step. Etc.</div></div>
<div class="calc-card"><div class="card-title">Action items</div><div class="card-body">Concrete (not "improve detection"), owned, timeboxed, tracked in Jira.</div></div>
<div class="calc-card"><div class="card-title">Detection / playbook updates</div><div class="card-body">New Sigma rule, Sentinel KQL added, SOAR playbook v2.3 deployed.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Putting the Forensics Track Together</h2>
<p class="l-text">Here is how the entire track plays in a single fictional incident:</p>

<ol style="line-height:1.75;padding-left:1.4rem">
<li><strong>L1 (Foundations)</strong>: Analyst understands chain of custody, ISO 27037, and writes timestamps in UTC.</li>
<li><strong>L2 (Static)</strong>: Suspicious attachment <code>invoice.exe</code> hits the gateway. <code>pefile</code> + YARA: packed UPX, suspicious imports, matches <code>cobaltstrike_loader.yar</code>.</li>
<li><strong>L3 (Dynamic)</strong>: Detonate in CAPEv2. Behavior shows process hollowing into <code>svchost.exe</code> and beacon to <code>cdn-static[.]example[.]com</code>.</li>
<li><strong>L4 (RE)</strong>: Open in Ghidra, identify the AES key derivation routine, dump the embedded config (sleep=60s, jitter=20%, profile="Amazon").</li>
<li><strong>L5 (Memory)</strong>: Pull RAM from infected host, run <code>volatility windows.malfind</code>, find the injected RWX region in <code>svchost.exe</code> on host WS-FIN-07.</li>
<li><strong>L6 (Network)</strong>: Pull PCAP, JA3 of beacon = <code>72a589da586844d7f0818ce684948eea</code> (Cobalt Strike 4.x default). 3 other hosts have same JA3.</li>
<li><strong>L7 (Intel)</strong>: Beacon profile + JA3 + domain age → matches APT29 NOBELIUM TTPs. STIX bundle generated.</li>
<li><strong>L8 (IR/SOC)</strong>: Playbook auto-isolated WS-FIN-07. Tier-2 confirms 4 hosts compromised, eradication via re-image, credential rotation. Post-mortem: missed CVE-2026-XXXX patch on Office, action items written.</li>
</ol>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; Track Capstone</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>NIST SP 800-61: Preparation → Detect/Analyze → Contain/Eradicate/Recover → Post-Incident, looping.</li>
<li>SIEM = ingestion + parsing + normalization (CIM/ECS/OCSF) + correlation + case mgmt.</li>
<li>Sigma rules portably compile to Splunk SPL, Elastic KQL, Sentinel KQL.</li>
<li>SOAR playbooks are state machines that orchestrate enrichment, decision, action, human gates.</li>
<li>The Forensics track end-to-end: L1 fundamentals → L2 static → L3 dynamic → L4 RE → L5 memory → L6 network → L7 intel → L8 IR/SOC.</li>
<li>Blameless post-mortems with timeboxed action items make the next incident easier.</li>
</ul>
</div>
<p class="l-text">You have completed the Forensics track. Next track: <strong>Blockchain Security</strong> — smart contracts, consensus, ZK rollups, DeFi attacks, and formal verification.</p>
</div>`,
tr: `<p class="l-text"><strong>Bu, Adli Bilişim izleğinin kapanış taşıdır: her şeyi çalışan bir Olay Müdahale (IR) operasyonuna bağlamak.</strong> Statik ve dinamik analiz (L2-L3), tersine mühendislik (L4), bellek ve ağ adli bilişimi (L5-L6) ve tehdit istihbaratı (L7) ayrı adalar değildir — bir SOC analisti bir EDR uyarısında "araştır"a her tıkladığında çalışan bir boru hattının bileşenleridir. Onları kodifiye eden boru hattı <strong>NIST SP 800-61 Rev. 2 Bilgisayar Güvenliği Olay Müdahale Kılavuzu</strong>'dur (son güncelleme 2012, 800-61r3 taslak 2024 ile desteklendi) ve bunu ölçekte çalıştıran teknoloji modern <strong>SIEM/SOAR yığını</strong>'dır: Splunk Enterprise Security, Elastic Security (eski Endgame), Microsoft Sentinel, Sumo Logic Cloud SIEM — Cortex XSOAR (Palo Alto), Tines, Torq ve Splunk SOAR (Phantom) gibi SOAR platformlarıyla eşlenmiş.</p>

<p class="l-text">Bu derste IR yaşam döngüsünü (Hazırlık, Tespit &amp; Analiz, Sınırlama / Yok Etme / Kurtarma, Olay Sonrası Aktivite), SIEM veri modelini (olaylar → normalize edilmiş alanlar → tespitler → vakalar), SOAR oyun kitabı kavramını (insan + otomasyonu orkestre eden durum makineleri) yürüyoruz ve oltalama-zararlı-yazılım-eki olayı için bir IR oyun kitabının çalışan Python durum-makinesi uygulamasıyla bitiriyoruz — 2026'da tüm IR işinin %60'ını süren kanonik "Tier-1 SOC bileti".</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>NIST SP 800-61 IR yaşam döngüsünün 4 fazı ve Tespit ↔ Sınırlama arasındaki döngüler</li>
<li>SIEM mimarisi: alımlama, ayrıştırma, normalizasyon (CIM/ECS/OCSF), korelasyon, uyarı verme</li>
<li>Splunk SPL vs Elastic KQL vs Microsoft Sentinel KQL — aynı iş, üç sözdizimi</li>
<li>SOAR oyun kitapları: tetikleyiciler, görevler, kararlar, paralel yürütme, insan kapıları</li>
<li>Tier-1 / Tier-2 / Tier-3 SOC analist hiyerarşisi ve otomasyonun zahmeti nerede kestiği</li>
<li>Bir oltalama-eki olayı için Python IR-oyun kitabı durum makinesi inşa etmek</li>
<li>Post-mortem: yararlı bir suçsuz retrospektifi yapan şey nedir</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. NIST SP 800-61 — IR Yaşam Döngüsü</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Hazırlık</div><div class="card-body">Olaylardan önce: aletler, oyun kitapları, iletişim planları, eğitim, tabletop tatbikatları, dış IR firmasıyla retainer (Mandiant, Crowdstrike Services, Kroll). Sonraki dördünün iyi gidip gitmeyeceğine karar veren faz.</div></div>
<div class="calc-card"><div class="card-title">2. Tespit &amp; Analiz</div><div class="card-body">Uyarı tetikleniyor (SIEM, EDR, kullanıcı raporu). Triyaj: yanlış pozitif mi? şiddet? kapsam? Bir zaman çizelgesi inşa et. forensics-L2'den L7'ye kadar her şeyi kullan.</div></div>
<div class="calc-card"><div class="card-title">3. Sınırlama, Yok Etme, Kurtarma</div><div class="card-body">Kısa vadeli sınırlama (host izole et, IP engelle), uzun vadeli sınırlama (yeniden imajla, kimlik bilgilerini döndür), yok et (kalıcılığı kaldır, CVE'yi yamala), kurtar (servisi geri yükle, yinelenmeyi izle).</div></div>
<div class="calc-card"><div class="card-title">4. Olay Sonrası Aktivite</div><div class="card-body">Öğrenilen dersler. Oyun kitaplarını güncelle. Tespitleri iyileştir. Çoğu ekibin atladığı ve çoğunun pişman olduğu faz.</div></div>
</div>

<div class="calc-highlight">Yaşam döngüsü bir <em>çizgi</em> değil, bir <em>döngü</em>'dür. Tespit ve Sınırlama ping-pong oynar: her sınırlama eylemi, daha önce şüphelenilmeyen hostlarda tespiti yeniden tetikleyen yeni artefaktları ortaya çıkarır. Üretim IR'leri haftalarca sürer.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SOC Tier Modeli</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tier 1 (Triyaj)</div><div class="card-body">İlk müdahale ediciler. Uyarıları okur, oyun kitaplarını çalıştırır, eskalate eder. Hacim: vardiya başına yüzlerce uyarı. Tier 2'den önce tipik 6-12 ay rol.</div></div>
<div class="calc-card"><div class="card-title">Tier 2 (Soruşturma)</div><div class="card-body">Daha derin analiz: EDR'de pivot, hipotez yaz, odaklanmış sorgular çalıştır. Tier-1 oyun kitaplarını ayar.</div></div>
<div class="calc-card"><div class="card-title">Tier 3 (Av / IR)</div><div class="card-body">Tehdit avı (proaktif, hipotez odaklı), tam çaplı IR vakaları, özel tespitler, zararlı yazılım analizi. L4'ten örnekleri tersine çevirir.</div></div>
<div class="calc-card"><div class="card-title">Otomasyonun yaşadığı yer</div><div class="card-body">SOAR Tier-1 zahmetinin %60-80'inin yerini alır: zenginleştirme aramaları (VirusTotal, AbuseIPDB), kullanıcı/varlık bağlamı, temel sınırlama (host izole et, kullanıcıyı devre dışı bırak). İnsanlar etkili eylemlerde karar otoritesi olarak kalır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Beş Katmanda SIEM Mimarisi</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li><strong>Alımlama</strong>: ajanlar (Splunk UF, Elastic Beats, Microsoft Sentinel bağlayıcıları) günlükleri TCP/HTTPS üzerinden indeksleyicilere gönderir.</li>
<li><strong>Ayrıştırma</strong>: regex / Grok / sourcetype tabanlı ayrıştırıcılar serbest formlu satırları alanlara böler.</li>
<li><strong>Normalizasyon</strong>: satıcı alanlarını ortak bir şemaya eşle. Splunk <em>CIM</em> (Common Information Model) kullanır. Elastic <em>ECS</em> (Elastic Common Schema) kullanır. Yeni çapraz-satıcı çabası <strong>OCSF</strong>'tir (Open Cybersecurity Schema Framework, AWS-liderliğinde, 2022). Normalizasyon olmadan, "12 ürün tipinde tüm oturum açma başarısızlıklarını ver" bir kabustur.</li>
<li><strong>Korelasyon</strong>: tespitler (Splunk SPL'de kaydedilmiş aramalar, Elastic'te EQL/KQL kuralları, Sentinel'de KQL analitiği) örüntüler üzerinde tetiklenir: "60s içinde 5 başarısız oturum açma sonrası başarı". Sigma kuralları üçüne de derlenir.</li>
<li><strong>Vaka yönetimi</strong>: uyarı → dikkate değer olay → vaka → SOAR oyun kitabı → bilet → çözüm.</li>
</ol>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. SPL (Splunk) vs Elastic-KQL vs Sentinel-KQL — Bir Tespit, Üç Dil</h2>
<p class="l-text">"Süreç ağacı winword.exe'nin powershell.exe doğurduğunu gösteriyor" gibi bir tespit her birinde biraz farklı görünür:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Splunk SPL
spl = """
index=edr sourcetype=process_creation
| where parent_image="winword.exe" AND image="powershell.exe"
| stats count by host, user, command_line
| where count > 0
"""

# Elastic / Kibana KQL (event query)
kql_elastic = '''
event.category:"process" and process.parent.name:"winword.exe"
and process.name:"powershell.exe"
'''

# Microsoft Sentinel KQL (Azure Data Explorer flavor)
kql_sentinel = """
DeviceProcessEvents
| where InitiatingProcessFileName =~ "winword.exe"
| where FileName =~ "powershell.exe"
| project Timestamp, DeviceName, AccountName, ProcessCommandLine
"""

# Sigma kuralı (satıcı-bağımsız, üçüne de derlenir)
sigma_yaml = """
title: Office Spawning PowerShell
logsource: { category: process_creation, product: windows }
detection:
  selection:
    ParentImage|endswith: '\\\\winword.exe'
    Image|endswith: '\\\\powershell.exe'
  condition: selection
level: high
"""
print("Aynı tespit — üç SIEM lehçesi + bir Sigma source-of-truth.")
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Bir log kaynağını parse eder — Windows Event Log (Sysmon EID 1/3/11/22), Linux journalctl / auditd, web server access log veya bulut audit (CloudTrail, Azure Activity Log). 2) Şüpheli göstergelere göre filtreler — garip parent-child process ağaçları (cmd.exe → powershell.exe → rundll32.exe), encoded base64 komutları, mesai dışı admin girişleri. 3) Bir SIEM sorgusuyla (Splunk SPL, KQL, Elastic ES|QL) kaynaklar arası korelasyon kurar — tek olay gürültüdür, endpoint + ağ + kimlik arasındaki diziler sinyaldir. 4) Tekrar tespiti için Sigma kuralı yazar — bir sonraki analist (veya SOAR playbook) aynı pattern'i otomatik yakalar.</p>

</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. SOAR Oyun Kitapları — İnsanlar+Botlar İçin Durum Makineleri</h2>
<p class="l-text">Bir SOAR oyun kitabı bir <em>tipli durum makinesi</em>'dir. Cortex XSOAR'ın oyun kitabı tasarımcısı, Tines hikâyeleri ve Splunk SOAR'ın "playbook"u hepsi şuna indirgenir: tipli girişlerle düğümler (görevler), koşullarla kenarlar (geçişler) ve insanlar (onay kapıları) ve paralel dallar için özel düğüm tipleri.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tetikleyici</div><div class="card-body">SIEM uyarısı / e-posta / webhook. Bağlamı taşır: uyarı kimliği, gözlemlenen göstergeler, varlık/kullanıcı.</div></div>
<div class="calc-card"><div class="card-title">Zenginleştirme</div><div class="card-body">Hash → VirusTotal, IP → AbuseIPDB+GeoIP, kullanıcı → AD, varlık → CMDB. Paralel.</div></div>
<div class="calc-card"><div class="card-title">Karar</div><div class="card-body">VT tespit oranı &gt; 30/70 VE varlık kritikliği = "high" ise → otomatik izolasyonla Tier 2'ye eskalate.</div></div>
<div class="calc-card"><div class="card-title">Eylem</div><div class="card-body">Hostu izole et (CrowdStrike RTR / Defender ASR), kullanıcıyı devre dışı bırak (Azure AD), hash'i engelle (firewall feed), bilet aç (Jira/ServiceNow).</div></div>
<div class="calc-card"><div class="card-title">İnsan Kapısı</div><div class="card-body">"CFO'nun dizüstünü izole edelim mi?" — Slack/Teams etkileşimli buton. Zaman aşımında varsayılan no-op.</div></div>
<div class="calc-card"><div class="card-title">Kapanış</div><div class="card-body">Bildireni bilgilendir, SIEM vakasını güncelle, şiddet &gt;= P2 ise post-mortem tetikle.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Python'da Oltalama-Eki Oyun Kitabı</h2>
<p class="l-text">Aşağıda kanonik Tier-1 oyun kitabının çalıştırılabilir, bağımlılıksız bir uygulaması var: bir "ekli oltalama e-postası" uyarısını tüketen, göstergeleri zenginleştiren, sınırlama hakkında karar veren ve yapılandırılmış bir vaka kaydı yayan bir durum makinesi. Bu, Cortex XSOAR'ın görsel oyun kitabı düzenleyicisinden ürettiği koddur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, json, time
from datetime import datetime, timezone

# --- Sahte dış servisler (gerçek hayatta: API'ler) -----------------------
def vt_lookup(sha256): return {"detection_ratio": 47/72, "first_seen":"2026-04-29"} if sha256.endswith("e") else {"detection_ratio":1/72}
def abuseipdb(ip):     return {"abuse_score": 89 if ip.startswith("203.0.113") else 3}
def ad_lookup(user):   return {"dept":"Finance","manager":"alice@corp"} if user else {}
def cmdb_lookup(host): return {"criticality":"high","owner":"bob@corp","tier":1}
def isolate(host):     print(f"  [ACTION] Isolated host {host}"); return True
def disable_user(u):   print(f"  [ACTION] Disabled user {u}");      return True
def open_ticket(case): print(f"  [ACTION] Ticket opened #{case['id']}: {case['title']}"); return True

# --- Oyun kitabı durum makinesi -----------------------------------------
def run_playbook(alert):
    case = {"id":"INC-"+str(int(time.time())),
            "title":alert["subject"],
            "state":"NEW","timeline":[]}
    def log(msg):
        case["timeline"].append({"t":datetime.now(timezone.utc).isoformat(),"msg":msg})
        print("[",case["state"],"]", msg)

    # Durum 1: zenginleştir (gerçek SOAR'da paralel; netlik için burada sıralı)
    case["state"] = "ENRICHING"
    vt    = vt_lookup(alert["sha256"]);     log(f"VT detection ratio = {vt['detection_ratio']:.2f}")
    abuse = abuseipdb(alert["src_ip"]);     log(f"AbuseIPDB score    = {abuse['abuse_score']}")
    user  = ad_lookup(alert["recipient"]);  log(f"User context       = {user}")
    asset = cmdb_lookup(alert["host"]);     log(f"Asset criticality  = {asset['criticality']}")

    # Durum 2: karar
    case["state"] = "DECIDING"
    malicious = vt["detection_ratio"] &gt; 0.30 or abuse["abuse_score"] &gt; 50
    high_value = asset["criticality"] == "high"
    if not malicious:
        case["state"]="CLOSED_BENIGN"; log("Benign — auto-close"); return case

    # Durum 3: sınırla
    case["state"] = "CONTAINING"
    if high_value:
        log("HIGH severity — Tier-2 escalate + auto-isolate")
        isolate(alert["host"])
        if abuse["abuse_score"] &gt; 80: disable_user(alert["recipient"])
    else:
        log("MEDIUM severity — Tier-2 review, no auto-isolate")

    # Durum 4: bilet + post-mortem işareti
    case["state"] = "TICKETED"
    open_ticket(case)
    if high_value: case["postmortem_required"] = True
    case["state"] = "OPEN_TIER2"
    log("Handed to Tier-2"); return case

# --- Çalıştır ------------------------------------------------------------
alert = {"subject":"Phishing with attachment — invoice.zip",
         "sha256":"a"*63 + "e",       # 'e' ile biter → sahte VT'de yüksek puan
         "src_ip":"203.0.113.42",
         "recipient":"victim@corp",
         "host":"WS-FINANCE-07"}
case = run_playbook(alert)
print("\\nFinal case:", json.dumps({k:v for k,v in case.items() if k!="timeline"}, indent=2))
print("Timeline length:", len(case["timeline"]))
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Bir log kaynağını parse eder — Windows Event Log (Sysmon EID 1/3/11/22), Linux journalctl / auditd, web server access log veya bulut audit (CloudTrail, Azure Activity Log). 2) Şüpheli göstergelere göre filtreler — garip parent-child process ağaçları (cmd.exe → powershell.exe → rundll32.exe), encoded base64 komutları, mesai dışı admin girişleri. 3) Bir SIEM sorgusuyla (Splunk SPL, KQL, Elastic ES|QL) kaynaklar arası korelasyon kurar — tek olay gürültüdür, endpoint + ağ + kimlik arasındaki diziler sinyaldir. 4) Tekrar tespiti için Sigma kuralı yazar — bir sonraki analist (veya SOAR playbook) aynı pattern'i otomatik yakalar.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı oyun kitabı motoru, tarayıcıda çalışır. Zararsız-otomatik-kapanış dalını görmek için SHA-256 son karakterini 'e' olmayan bir şeye değiştirmeyi deneyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import time, json
from datetime import datetime, timezone

def vt(sha):    return 47/72 if sha.endswith("e") else 1/72
def abuse(ip):  return 89 if ip.startswith("203.0.113") else 3
def cmdb(h):    return "high" if "FIN" in h else "low"

def playbook(alert):
    case = {"id":"INC-"+str(int(time.time())), "state":"NEW", "log":[]}
    def L(m): case["log"].append((case["state"],m)); print(f"[{case['state']}] {m}")

    case["state"]="ENRICH"
    vts, abs_, crit = vt(alert["sha"]), abuse(alert["ip"]), cmdb(alert["host"])
    L(f"vt={vts:.2f} abuse={abs_} crit={crit}")

    case["state"]="DECIDE"
    if vts &lt;= 0.3 and abs_ &lt;= 50:
        case["state"]="CLOSED_BENIGN"; L("benign"); return case

    case["state"]="CONTAIN"
    if crit == "high":
        L(f"isolate {alert['host']}")
        if abs_ &gt; 80: L(f"disable {alert['user']}")
    case["state"]="OPEN_TIER2"; L("ticket opened"); return case

a = {"sha":"a"*63+"e","ip":"203.0.113.42","user":"victim","host":"WS-FIN-07"}
c = playbook(a)
print("\\nfinal state:", c["state"])
print("steps:",        len(c["log"]))
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Post-Mortem — Suçsuz ve Yararlı</h2>
<p class="l-text">SRE kültüründen ödünç alındı (Google'ın "Site Reliability Engineering" kitabı, 2016): <strong>suçsuz post-mortem</strong>. <em>Ne oldu, hangi sırada, hangi zaman damgalarıyla ve bizi ne şaşırttı</em>'yı belgele. Asla <em>kim batırdı</em> değil. Çıktı somut eylemler, sahipler ve tarihlerdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zaman çizelgesi</div><div class="card-body">UTC zaman damgaları, ham olaylar: uyarı tetiklendi, analist çağrıldı, izolasyon verildi, yük bulundu, yok etme onaylandı.</div></div>
<div class="calc-card"><div class="card-title">Kök neden(ler)</div><div class="card-body">5-Neden. Genellikle teknik + örgütsel (eksik yama + eksik değişiklik-kontrol incelemesi).</div></div>
<div class="calc-card"><div class="card-title">İşe yarayan</div><div class="card-body">4 dakikada tespit, 8 dakikada EDR izolasyonu, 27 dakikada tam yok etme. Kutla.</div></div>
<div class="calc-card"><div class="card-title">İşe yaramayan</div><div class="card-body">Yedek CMDB eskimiş → yanlış sahip çağrıldı. Oyun kitabında Slack bildirme adımı eksik. Vb.</div></div>
<div class="calc-card"><div class="card-title">Eylem maddeleri</div><div class="card-body">Somut ("tespiti iyileştir" değil), sahipli, zaman sınırlı, Jira'da takipli.</div></div>
<div class="calc-card"><div class="card-title">Tespit / oyun kitabı güncellemeleri</div><div class="card-body">Yeni Sigma kuralı, Sentinel KQL eklendi, SOAR oyun kitabı v2.3 dağıtıldı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Adli Bilişim İzleğini Bir Araya Getirmek</h2>
<p class="l-text">İşte tüm izleğin tek bir kurgusal olayda nasıl oynandığı:</p>

<ol style="line-height:1.75;padding-left:1.4rem">
<li><strong>L1 (Temeller)</strong>: Analist gözetim zincirini, ISO 27037'yi anlar ve zaman damgalarını UTC'de yazar.</li>
<li><strong>L2 (Statik)</strong>: Şüpheli ek <code>invoice.exe</code> ağ geçidine ulaşır. <code>pefile</code> + YARA: paketlenmiş UPX, şüpheli importlar, <code>cobaltstrike_loader.yar</code> ile eşleşir.</li>
<li><strong>L3 (Dinamik)</strong>: CAPEv2'de patlat. Davranış <code>svchost.exe</code>'ye process hollowing ve <code>cdn-static[.]example[.]com</code>'a beacon gösterir.</li>
<li><strong>L4 (RE)</strong>: Ghidra'da aç, AES anahtar türetme rutinini tanımla, gömülü konfigürasyonu dök (sleep=60s, jitter=%20, profile="Amazon").</li>
<li><strong>L5 (Bellek)</strong>: Enfekte hosttan RAM çek, <code>volatility windows.malfind</code> çalıştır, WS-FIN-07 hostundaki <code>svchost.exe</code>'de enjekte edilmiş RWX bölgeyi bul.</li>
<li><strong>L6 (Ağ)</strong>: PCAP çek, beacon'un JA3'ü = <code>72a589da586844d7f0818ce684948eea</code> (Cobalt Strike 4.x varsayılan). Diğer 3 host aynı JA3'e sahip.</li>
<li><strong>L7 (İstihbarat)</strong>: Beacon profili + JA3 + alan adı yaşı → APT29 NOBELIUM TTP'leriyle eşleşir. STIX paketi üretildi.</li>
<li><strong>L8 (IR/SOC)</strong>: Oyun kitabı WS-FIN-07'yi otomatik izole etti. Tier-2, 4 hostun ihlal edildiğini onaylar, yeniden imaj ile yok etme, kimlik bilgisi döndürme. Post-mortem: Office'te kaçırılan CVE-2026-XXXX yaması, eylem maddeleri yazıldı.</li>
</ol>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; İzlek Final</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 TEMEL ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>NIST SP 800-61: Hazırlık → Tespit/Analiz → Sınırla/Yok et/Kurtar → Olay-Sonrası, döngüsel.</li>
<li>SIEM = alımlama + ayrıştırma + normalizasyon (CIM/ECS/OCSF) + korelasyon + vaka yönetimi.</li>
<li>Sigma kuralları taşınabilir şekilde Splunk SPL, Elastic KQL, Sentinel KQL'e derlenir.</li>
<li>SOAR oyun kitapları, zenginleştirme, karar, eylem, insan kapılarını orkestre eden durum makineleridir.</li>
<li>Adli Bilişim izleği uçtan uca: L1 temeller → L2 statik → L3 dinamik → L4 RE → L5 bellek → L6 ağ → L7 istihbarat → L8 IR/SOC.</li>
<li>Zaman sınırlı eylem maddeleriyle suçsuz post-mortem'ler bir sonraki olayı kolaylaştırır.</li>
</ul>
</div>
<p class="l-text">Adli Bilişim izleğini tamamladınız. Sıradaki izlek: <strong>Blockchain Güvenliği</strong> — akıllı sözleşmeler, fikir birliği, ZK rollup'lar, DeFi saldırıları ve formal doğrulama.</p>
</div>`
};
