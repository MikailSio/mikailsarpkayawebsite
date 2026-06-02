window.FORENSICS_L7 = {
en: `<p class="l-text"><strong>Threat intelligence is what turns a single isolated alert into a chapter in a much longer story.</strong> A SHA256 hash on its own is just 32 bytes; embedded in a graph that says "this hash was used by APT29 in the SolarWinds campaign and shares infrastructure with the Cozy Bear DropboxAPI loaders" it becomes actionable strategy. The discipline grew up around two parallel traditions: government/military (CIA, NSA, GCHQ, Mandiant's military-grade reports) and open-source (the IoC sharing community on MISP, the structured language STIX, and the transport TAXII).</p>

<p class="l-text">In this lesson we map the modern intelligence landscape: the <strong>major APT groups</strong> by sponsor — APT29 (Cozy Bear, SVR), APT28 (Fancy Bear, GRU), APT41 (China, dual criminal/state), Lazarus (DPRK), Equation Group (NSA tooling per Shadow Brokers), Sandworm (GRU 74455, NotPetya/Industroyer); the <strong>analytical models</strong> — Lockheed Martin Cyber Kill Chain (2011), Sergio Caltagirone's <strong>Diamond Model</strong> (2013), <strong>MITRE ATT&amp;CK</strong> (2013→); and the <strong>data formats</strong> — STIX 2.1, TAXII 2.1, and MISP. Capstone: build an IoC matcher in Python that joins observations against an intel feed.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The major APT groups: state sponsor, signature TTPs, marquee operations</li>
<li>Cyber Kill Chain (LM, 2011) — Recon → Weaponization → Delivery → Exploit → Install → C2 → Actions</li>
<li>Diamond Model: Adversary, Capability, Infrastructure, Victim — and the meta-features (resources, time, motivation)</li>
<li>MITRE ATT&amp;CK: Tactics × Techniques × Procedures, the cross-walk every SOC speaks</li>
<li>IoCs vs IoAs: indicators of compromise (artifacts) vs indicators of attack (behaviors)</li>
<li>STIX 2.1 SDOs/SROs, TAXII 2.1 collections, and how a MISP instance ingests and shares</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The APT Group Landscape (2026 view)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">APT29 / Cozy Bear / NOBELIUM (RU SVR)</div><div class="card-body">Russian Foreign Intelligence Service. Patient, stealth-first, supply-chain (SolarWinds 2020 = SUNBURST, 18,000 victims). Tooling: <code>CozyDuke</code>, <code>WellMess</code>, <code>FOGGYWEB</code>.</div></div>
<div class="calc-card"><div class="card-title">APT28 / Fancy Bear / Sofacy (RU GRU 26165)</div><div class="card-body">Russian military intelligence. Loud, electioneering (DNC 2016). Tooling: <code>X-Agent</code>, <code>Sednit</code>, <code>Zebrocy</code>.</div></div>
<div class="calc-card"><div class="card-title">Lazarus / Hidden Cobra (DPRK Bureau 121)</div><div class="card-body">North Korean. Financially motivated (SWIFT, crypto exchanges, $1B+ heists). Sub-units: BlueNoroff (banking), Andariel (S. Korea), APT38. Sony Pictures 2014, WannaCry 2017.</div></div>
<div class="calc-card"><div class="card-title">APT41 / Winnti / Barium (CN MSS-affiliated)</div><div class="card-body">Chinese, dual espionage + criminal. Software supply chain (CCleaner 2017, ASUS Live Update 2019). Healthcare, gaming, telcos.</div></div>
<div class="calc-card"><div class="card-title">Sandworm / Voodoo Bear (RU GRU 74455)</div><div class="card-body">Russian destructive ops. NotPetya 2017 ($10B damage), Industroyer Ukraine grid 2016/2022, Olympic Destroyer 2018.</div></div>
<div class="calc-card"><div class="card-title">Equation Group (NSA TAO-attributed)</div><div class="card-body">Surfaced via Shadow Brokers leak 2016: ETERNALBLUE, DOUBLEPULSAR. Tooling later weaponized by everyone (WannaCry, NotPetya).</div></div>
<div class="calc-card"><div class="card-title">APT35 / Charming Kitten (IR IRGC)</div><div class="card-body">Iranian. Credential phishing, journalist/dissident targeting. Operation Newscaster.</div></div>
<div class="calc-card"><div class="card-title">FIN7 / Carbanak (criminal, RU-speaking)</div><div class="card-body">Financially motivated, very persistent. Stole &gt; $1B from POS systems 2013–2018; some members sentenced 2021–2023, group reorganized.</div></div>
</div>

<div class="calc-highlight">Naming is a mess on purpose: every vendor coins their own name (Mandiant: APTxx, CrowdStrike: ZooAnimal, Microsoft: Element-named, e.g., "Midnight Blizzard" = APT29). MITRE keeps a cross-walk in <code>groups.json</code>.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Cyber Kill Chain</h2>
<p class="l-text">Lockheed Martin (Hutchins, Cloppert, Amin, 2011) framed intrusions as a 7-step chain. The strategic insight: <em>break any single link and the attack fails</em> — but defenders only need to detect <em>one</em>, while attackers must execute <em>all seven</em>. Asymmetry favors defenders if they layer.</p>

<ol style="line-height:1.7;padding-left:1.4rem">
<li><strong>Reconnaissance</strong> — OSINT, LinkedIn scraping, Shodan, port scans</li>
<li><strong>Weaponization</strong> — couple exploit with payload (e.g., RTF + Cobalt Strike beacon)</li>
<li><strong>Delivery</strong> — spear-phish, watering hole, supply chain</li>
<li><strong>Exploitation</strong> — code execution (CVE-2017-0199 RTF, CVE-2023-23397 Outlook NTLM, etc.)</li>
<li><strong>Installation</strong> — persistence (Run key, Scheduled Task, COM hijack, Service)</li>
<li><strong>Command &amp; Control (C2)</strong> — beacon to attacker infrastructure</li>
<li><strong>Actions on Objectives</strong> — collect, encrypt, exfiltrate, destroy</li>
</ol>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Diamond Model — Four Vertices, Endless Pivots</h2>
<p class="l-text">Sergio Caltagirone, Andrew Pendergast, and Christopher Betz (2013) gave us a richer schema: every intrusion event is a <strong>Diamond</strong> with four corners — <strong>Adversary</strong>, <strong>Capability</strong>, <strong>Infrastructure</strong>, and <strong>Victim</strong> — connected by edges representing the attack relationships. Each vertex has meta-features (technology, social-political, resources, results, timestamp).</p>

<div class="katex-block">$$\\text{Event} = (\\text{Adversary}, \\text{Capability}, \\text{Infrastructure}, \\text{Victim})$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pivot: Capability → Adversary</div><div class="card-body">Find a sample's family → known to be APT29 → high-confidence adversary attribution.</div></div>
<div class="calc-card"><div class="card-title">Pivot: Infrastructure → Other Victims</div><div class="card-body">Same C2 IP/domain → who else beaconed there? Reveals campaign breadth.</div></div>
<div class="calc-card"><div class="card-title">Pivot: Victim → Adversary motive</div><div class="card-body">All victims = aerospace defense → SVR (espionage), not criminal (financial).</div></div>
<div class="calc-card"><div class="card-title">Activity Threads</div><div class="card-body">Chain Diamonds across the kill chain → see the full operation.</div></div>
</div>

<div class="calc-highlight">Why this matters: the Diamond is the data model behind <strong>MISP</strong>, behind STIX 2.1's "sighting" and "indicator" SDOs, and behind every modern threat-intel platform's pivot UI.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. MITRE ATT&amp;CK — The Universal Vocabulary</h2>
<p class="l-text">MITRE ATT&amp;CK (2013, public 2015) is now the lingua franca of detection engineering. Structure:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tactics (the "why")</div><div class="card-body">14 columns: Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, C2, Exfiltration, Impact, plus Reconnaissance and Resource Development.</div></div>
<div class="calc-card"><div class="card-title">Techniques (the "how")</div><div class="card-body">~200 techniques + ~400 sub-techniques. T1059.001 = PowerShell, T1547.001 = Run keys, T1071.001 = Web protocols.</div></div>
<div class="calc-card"><div class="card-title">Procedures (the specifics)</div><div class="card-body">Free text describing how a specific group implements a technique. "APT29 uses <code>powershell -enc</code> with base64 X to download Y from Z".</div></div>
<div class="calc-card"><div class="card-title">Matrices</div><div class="card-body">Enterprise, Mobile, ICS. Each its own tactic-technique grid.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. IoCs vs IoAs — Artifacts vs Behaviors</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IoC (Indicator of Compromise)</div><div class="card-body">Atomic artifact: hash, IP, domain, URL, mutex name, registry path, certificate fingerprint. Cheap to share, easy to evade (rotate hashes daily).</div></div>
<div class="calc-card"><div class="card-title">IoA (Indicator of Attack)</div><div class="card-body">Behavior: "Word spawned PowerShell -enc with base64", "LSASS read by non-system process", "service binary path containing %TEMP%". Harder to evade, generalizes.</div></div>
<div class="calc-card"><div class="card-title">Pyramid of Pain (Bianco, 2013)</div><div class="card-body">From bottom to top, increasing adversary cost: hashes → IPs → domains → network/host artifacts → tools → TTPs. Detect at the top, hurt the most.</div></div>
<div class="calc-card"><div class="card-title">Sigma rules</div><div class="card-body">Universal IoA format. YAML detection logic that compiles to Splunk SPL, Elastic KQL, Sentinel KQL, Sumo, Chronicle.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. STIX 2.1 and TAXII 2.1</h2>
<p class="l-text"><strong>STIX</strong> (Structured Threat Information Expression) is the OASIS-standard JSON schema for cyber-threat intel. Version 2.1 (2021) settled the data model:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SDOs (Domain Objects)</div><div class="card-body">indicator, malware, threat-actor, intrusion-set, campaign, tool, attack-pattern, vulnerability, identity, location, report, course-of-action, observed-data, opinion, note, grouping.</div></div>
<div class="calc-card"><div class="card-title">SROs (Relationship Objects)</div><div class="card-body">relationship (typed: uses, attributed-to, indicates), sighting (X seen here at time T).</div></div>
<div class="calc-card"><div class="card-title">SCOs (Cyber-observables)</div><div class="card-body">file, ipv4-addr, domain-name, url, network-traffic, process, x509-certificate. Reusable building blocks.</div></div>
<div class="calc-card"><div class="card-title">TAXII 2.1</div><div class="card-body">REST API for sharing STIX. Servers expose <em>collections</em>; clients <code>GET /taxii2/api1/collections/X/objects/</code> with filters by added_after, type.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Build a STIX 2.1 indicator + relationship + threat-actor
import json, uuid
from datetime import datetime, timezone

now = datetime.now(timezone.utc).isoformat()

actor = {"type":"threat-actor","spec_version":"2.1",
  "id":f"threat-actor--{uuid.uuid4()}","created":now,"modified":now,
  "name":"APT29","aliases":["Cozy Bear","NOBELIUM","Midnight Blizzard"],
  "threat_actor_types":["nation-state"],"sophistication":"strategic"}

indicator = {"type":"indicator","spec_version":"2.1",
  "id":f"indicator--{uuid.uuid4()}","created":now,"modified":now,
  "indicator_types":["malicious-activity"],
  "name":"FOGGYWEB C2","pattern_type":"stix",
  "pattern":"[domain-name:value = 'evil.example.com']",
  "valid_from":now}

rel = {"type":"relationship","spec_version":"2.1",
  "id":f"relationship--{uuid.uuid4()}","created":now,"modified":now,
  "relationship_type":"indicates",
  "source_ref":indicator["id"],"target_ref":actor["id"]}

bundle = {"type":"bundle","id":f"bundle--{uuid.uuid4()}",
          "objects":[actor, indicator, rel]}
print(json.dumps(bundle, indent=2)[:600], "...")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a <code>threat-actor</code> SDO with the mandatory STIX 2.1 keys — <code>spec_version</code>, a UUIDv4-suffixed <code>id</code>, ISO-8601 <code>created</code>/<code>modified</code> in UTC — plus APT29's known aliases (Cozy Bear, NOBELIUM, Midnight Blizzard) and the <code>nation-state</code> classification. 2) Constructs an <code>indicator</code> SDO with <code>pattern_type:"stix"</code> and a STIX-pattern expression <code>[domain-name:value = 'evil.example.com']</code> — the same pattern grammar TAXII servers query. 3) Wires them together with a <code>relationship</code> SRO of type <code>indicates</code> from indicator to actor — the STIX way of saying "this domain reveals APT29". 4) Wraps all three objects in a <code>bundle</code> envelope and <code>json.dumps</code>'s it with <code>indent=2</code> — the byte-identical format MISP, OpenCTI, and any TAXII 2.1 collection ingest natively.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. MISP — The OSS Intel Platform</h2>
<p class="l-text"><strong>MISP</strong> (Malware Information Sharing Platform, Andras Iklody, 2011, CIRCL Luxembourg) is the open-source TIP every CERT runs. It models intel as <em>events</em> containing <em>attributes</em> (IoCs) tagged with categories, source confidence, TLP (Traffic Light Protocol). Built-in syncing pushes events to peer MISP instances and to STIX/TAXII consumers.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. IoC Matching at Scale — Python Set Membership</h2>
<p class="l-text">The bread-and-butter SOC operation: take today's events (DNS queries, file hashes, IPs from EDR), join against the intel feed (MISP export, AlienVault OTX, abuse.ch). Set membership in Python is O(1) and effortless at millions of IoCs.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, json, time

# Load IoC feeds (in real life: MISP API, abuse.ch URLhaus, AlienVault OTX)
ioc_hashes  = {hashlib.sha256(f"apt29_sample_{i}".encode()).hexdigest() for i in range(50_000)}
ioc_domains = {f"c2-{i}.example.com" for i in range(20_000)} | {"evil.example.com"}
ioc_ips     = {f"203.0.113.{i}" for i in range(254)}

# Today's observations
events = [
  {"kind":"file","value":"abc...notamatch..."},
  {"kind":"file","value":hashlib.sha256(b"apt29_sample_42").hexdigest()},
  {"kind":"dns","value":"evil.example.com"},
  {"kind":"dns","value":"google.com"},
  {"kind":"ip","value":"203.0.113.7"},
  {"kind":"ip","value":"8.8.8.8"},
]

start = time.time()
hits = []
for ev in events:
    if ev["kind"]=="file" and ev["value"] in ioc_hashes:    hits.append(ev)
    if ev["kind"]=="dns"  and ev["value"] in ioc_domains:   hits.append(ev)
    if ev["kind"]=="ip"   and ev["value"] in ioc_ips:       hits.append(ev)
elapsed_ms = (time.time()-start)*1000
print(f"Matched {len(hits)} of {len(events)} in {elapsed_ms:.2f} ms")
for h in hits: print(" HIT:", h)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Pre-builds three Python <code>set</code>s seeded from synthetic feeds — 50,000 SHA-256 file hashes (one per <code>apt29_sample_N</code>), 20,000 C2 domains plus the explicit <code>evil.example.com</code>, and 254 IPs in <code>203.0.113.0/24</code> — the same shapes MISP, abuse.ch URLhaus, and AlienVault OTX export. 2) Loops over today's six observations and dispatches per <code>ev["kind"]</code> — file vs DNS vs IP — into the matching set with the <code>in</code> operator, which is the O(1) hash-set lookup CPython's <code>set</code> guarantees. 3) Times the whole loop with <code>time.time()</code> deltas to prove the millisecond-class latency — the reason SOC ETL pipelines can join tens of thousands of events against tens of millions of IoCs every minute. 4) Prints the hits — the two file/DNS/IP triplet from the planted matches — so you see the canonical "intel + telemetry → alert" join in action.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same set-membership IoC matcher; demonstrates O(1) lookups against tens of thousands of intel atoms.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, time
ioc_hashes  = {hashlib.sha256(f"apt29_{i}".encode()).hexdigest() for i in range(20_000)}
ioc_domains = {"evil.example.com","badcdn.net","apt29-c2.org"}
ioc_ips     = {"203.0.113.7","198.51.100.42"}

events = [
  ("file", hashlib.sha256(b"apt29_42").hexdigest()),
  ("file", hashlib.sha256(b"benign").hexdigest()),
  ("dns",  "evil.example.com"),
  ("dns",  "wikipedia.org"),
  ("ip",   "203.0.113.7"),
  ("ip",   "8.8.8.8"),
]
start = time.time()
hits = [e for e in events if (e[0]=="file" and e[1] in ioc_hashes)
                          or (e[0]=="dns"  and e[1] in ioc_domains)
                          or (e[0]=="ip"   and e[1] in ioc_ips)]
print(f"Hits: {len(hits)} in {(time.time()-start)*1000:.3f} ms")
for h in hits: print(" ", h)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>APT groups: APT29, APT28, APT41, Lazarus, Sandworm, Equation, APT35, FIN7. Naming varies per vendor.</li>
<li>Cyber Kill Chain (7 steps), Diamond Model (4 vertices), MITRE ATT&amp;CK (Tactics/Techniques/Procedures).</li>
<li>IoC = artifact (cheap to evade), IoA = behavior (durable). Climb the Pyramid of Pain.</li>
<li>STIX 2.1 = data model, TAXII 2.1 = transport, MISP = popular OSS implementation.</li>
<li>Python set membership scales to millions of IoCs at sub-ms per event.</li>
</ul>
</div>
<p class="l-text">Capstone next: <strong>forensics-L8</strong> ties everything into the incident response lifecycle and the SIEM/SOC pipeline.</p>
</div>`,
tr: `<p class="l-text"><strong>Tehdit istihbaratı, tek bir izole uyarıyı çok daha uzun bir hikâyenin bir bölümüne dönüştüren şeydir.</strong> Bir SHA256 hash kendi başına yalnızca 32 bayttır; "bu hash APT29 tarafından SolarWinds kampanyasında kullanıldı ve Cozy Bear DropboxAPI yükleyicileriyle altyapı paylaşıyor" diyen bir grafiğe gömüldüğünde eyleme dönüştürülebilir bir stratejiye dönüşür. Disiplin iki paralel gelenek etrafında büyüdü: hükümet/askeri (CIA, NSA, GCHQ, Mandiant'ın askeri-kalitedeki raporları) ve açık kaynak (MISP üzerindeki IoC paylaşım topluluğu, yapılandırılmış dil STIX ve aktarım TAXII).</p>

<p class="l-text">Bu derste modern istihbarat manzarasını haritalıyoruz: <strong>başlıca APT grupları</strong> sponsora göre — APT29 (Cozy Bear, SVR), APT28 (Fancy Bear, GRU), APT41 (Çin, çift suç/devlet), Lazarus (DPRK), Equation Group (Shadow Brokers'a göre NSA aletleri), Sandworm (GRU 74455, NotPetya/Industroyer); <strong>analitik modeller</strong> — Lockheed Martin Cyber Kill Chain (2011), Sergio Caltagirone'nin <strong>Diamond Modeli</strong> (2013), <strong>MITRE ATT&amp;CK</strong> (2013→); ve <strong>veri formatları</strong> — STIX 2.1, TAXII 2.1 ve MISP. Final: gözlemleri bir istihbarat beslemesine birleştiren Python'da bir IoC eşleştirici inşa edin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Başlıca APT grupları: devlet sponsoru, imza TTP'leri, marka operasyonları</li>
<li>Cyber Kill Chain (LM, 2011) — Recon → Weaponization → Delivery → Exploit → Install → C2 → Actions</li>
<li>Diamond Modeli: Adversary, Capability, Infrastructure, Victim — ve meta-özellikler (kaynaklar, zaman, motivasyon)</li>
<li>MITRE ATT&amp;CK: Tactics × Techniques × Procedures, her SOC'un konuştuğu çapraz geçit</li>
<li>IoC vs IoA: ihlal göstergeleri (artefaktlar) vs saldırı göstergeleri (davranışlar)</li>
<li>STIX 2.1 SDO/SRO'ları, TAXII 2.1 koleksiyonları ve bir MISP örneğinin nasıl ingestleyip paylaştığı</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. APT Grup Manzarası (2026 görünümü)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">APT29 / Cozy Bear / NOBELIUM (RU SVR)</div><div class="card-body">Rus Dış İstihbarat Servisi. Sabırlı, gizlilik öncelikli, tedarik zinciri (SolarWinds 2020 = SUNBURST, 18.000 kurban). Aletler: <code>CozyDuke</code>, <code>WellMess</code>, <code>FOGGYWEB</code>.</div></div>
<div class="calc-card"><div class="card-title">APT28 / Fancy Bear / Sofacy (RU GRU 26165)</div><div class="card-body">Rus askeri istihbaratı. Gürültülü, seçim odaklı (DNC 2016). Aletler: <code>X-Agent</code>, <code>Sednit</code>, <code>Zebrocy</code>.</div></div>
<div class="calc-card"><div class="card-title">Lazarus / Hidden Cobra (DPRK Bureau 121)</div><div class="card-body">Kuzey Koreli. Finansal motivasyonlu (SWIFT, kripto borsaları, \\$1B+ soygunlar). Alt birimler: BlueNoroff (bankacılık), Andariel (G. Kore), APT38. Sony Pictures 2014, WannaCry 2017.</div></div>
<div class="calc-card"><div class="card-title">APT41 / Winnti / Barium (CN MSS-bağlantılı)</div><div class="card-body">Çinli, çift casusluk + suç. Yazılım tedarik zinciri (CCleaner 2017, ASUS Live Update 2019). Sağlık, oyun, telekomlar.</div></div>
<div class="calc-card"><div class="card-title">Sandworm / Voodoo Bear (RU GRU 74455)</div><div class="card-body">Rus yıkıcı operasyonlar. NotPetya 2017 (\\$10B zarar), Industroyer Ukrayna şebekesi 2016/2022, Olympic Destroyer 2018.</div></div>
<div class="calc-card"><div class="card-title">Equation Group (NSA TAO-atfedilen)</div><div class="card-body">Shadow Brokers sızıntısı 2016 ile yüzeye çıktı: ETERNALBLUE, DOUBLEPULSAR. Aletler sonradan herkes tarafından silahlandırıldı (WannaCry, NotPetya).</div></div>
<div class="calc-card"><div class="card-title">APT35 / Charming Kitten (IR IRGC)</div><div class="card-body">İranlı. Kimlik bilgisi oltalama, gazeteci/muhalif hedefleme. Operation Newscaster.</div></div>
<div class="calc-card"><div class="card-title">FIN7 / Carbanak (suç, RU-konuşur)</div><div class="card-body">Finansal motivasyonlu, çok ısrarcı. 2013–2018 arası POS sistemlerinden &gt; \\$1B çaldı; bazı üyeler 2021–2023 mahkum edildi, grup yeniden örgütlendi.</div></div>
</div>

<div class="calc-highlight">İsimlendirme bilerek karmaşadır: her satıcı kendi ismini koyar (Mandiant: APTxx, CrowdStrike: ZooAnimal, Microsoft: Element-isimli, ör. "Midnight Blizzard" = APT29). MITRE çapraz geçidi <code>groups.json</code>'da tutar.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Cyber Kill Chain</h2>
<p class="l-text">Lockheed Martin (Hutchins, Cloppert, Amin, 2011) saldırıları 7 adımlı bir zincir olarak çerçeveledi. Stratejik içgörü: <em>tek bir bağı kır ve saldırı başarısız olur</em> — ama savunucuların yalnızca <em>bir tane</em> tespit etmesi gerekirken, saldırganlar <em>yedisini birden</em> yürütmek zorundadır. Asimetri, savunucular katmanlarsa onları kayırır.</p>

<ol style="line-height:1.7;padding-left:1.4rem">
<li><strong>Reconnaissance</strong> — OSINT, LinkedIn kazıma, Shodan, port taramaları</li>
<li><strong>Weaponization</strong> — istismarı yükle eşleştir (ör. RTF + Cobalt Strike beacon)</li>
<li><strong>Delivery</strong> — spear-phish, watering hole, tedarik zinciri</li>
<li><strong>Exploitation</strong> — kod yürütme (CVE-2017-0199 RTF, CVE-2023-23397 Outlook NTLM vb.)</li>
<li><strong>Installation</strong> — kalıcılık (Run anahtarı, Scheduled Task, COM hijack, Service)</li>
<li><strong>Command &amp; Control (C2)</strong> — saldırgan altyapısına beacon</li>
<li><strong>Actions on Objectives</strong> — topla, şifrele, sızdır, yıkıcılık</li>
</ol>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Diamond Modeli — Dört Köşe, Sonsuz Pivot</h2>
<p class="l-text">Sergio Caltagirone, Andrew Pendergast ve Christopher Betz (2013) bize daha zengin bir şema verdi: her saldırı olayı dört köşeli bir <strong>Diamond</strong>'dır — <strong>Adversary</strong>, <strong>Capability</strong>, <strong>Infrastructure</strong> ve <strong>Victim</strong> — saldırı ilişkilerini temsil eden kenarlarla bağlanır. Her köşenin meta-özellikleri vardır (teknoloji, sosyo-politik, kaynaklar, sonuçlar, zaman damgası).</p>

<div class="katex-block">$$\\text{Event} = (\\text{Adversary}, \\text{Capability}, \\text{Infrastructure}, \\text{Victim})$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pivot: Capability → Adversary</div><div class="card-body">Bir örneğin ailesini bul → APT29 olarak biliniyor → yüksek güvenli düşman atfı.</div></div>
<div class="calc-card"><div class="card-title">Pivot: Infrastructure → Diğer Kurbanlar</div><div class="card-body">Aynı C2 IP/alan adı → başka kim oraya beacon gönderdi? Kampanya genişliğini ortaya çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Pivot: Victim → Adversary motivasyonu</div><div class="card-body">Tüm kurbanlar = havacılık savunma → SVR (casusluk), suç değil (finansal).</div></div>
<div class="calc-card"><div class="card-title">Activity Threads</div><div class="card-body">Diamond'ları kill chain boyunca zincirle → tüm operasyonu gör.</div></div>
</div>

<div class="calc-highlight">Bu neden önemli: Diamond, <strong>MISP</strong>'in arkasındaki, STIX 2.1'in "sighting" ve "indicator" SDO'larının arkasındaki ve her modern tehdit-istihbarat platformunun pivot UI'sının arkasındaki veri modelidir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. MITRE ATT&amp;CK — Evrensel Kelime Dağarcığı</h2>
<p class="l-text">MITRE ATT&amp;CK (2013, halka açık 2015) artık tespit mühendisliğinin ortak dilidir. Yapı:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tactics ("neden")</div><div class="card-body">14 sütun: Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, C2, Exfiltration, Impact, ayrıca Reconnaissance ve Resource Development.</div></div>
<div class="calc-card"><div class="card-title">Techniques ("nasıl")</div><div class="card-body">~200 teknik + ~400 alt teknik. T1059.001 = PowerShell, T1547.001 = Run anahtarları, T1071.001 = Web protokolleri.</div></div>
<div class="calc-card"><div class="card-title">Procedures (özgüller)</div><div class="card-body">Belirli bir grubun bir tekniği nasıl uyguladığını açıklayan serbest metin. "APT29, base64 X ile <code>powershell -enc</code> kullanarak Z'den Y indirir".</div></div>
<div class="calc-card"><div class="card-title">Matrisler</div><div class="card-body">Enterprise, Mobile, ICS. Her biri kendi taktik-teknik ızgarası.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. IoC vs IoA — Artefaktlar vs Davranışlar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IoC (Indicator of Compromise)</div><div class="card-body">Atomik artefakt: hash, IP, alan adı, URL, mutex adı, kayıt defteri yolu, sertifika parmak izi. Paylaşması ucuz, kaçınması kolay (hash'leri günlük döndür).</div></div>
<div class="calc-card"><div class="card-title">IoA (Indicator of Attack)</div><div class="card-body">Davranış: "Word PowerShell -enc'i base64 ile doğurdu", "LSASS sistem dışı süreç tarafından okundu", "%TEMP% içeren servis ikili yolu". Kaçınması daha zor, genelleşir.</div></div>
<div class="calc-card"><div class="card-title">Pyramid of Pain (Bianco, 2013)</div><div class="card-body">Aşağıdan yukarıya, artan düşman maliyeti: hash'ler → IP'ler → alan adları → ağ/host artefaktları → araçlar → TTP'ler. Tepede tespit et, en çok acıt.</div></div>
<div class="calc-card"><div class="card-title">Sigma kuralları</div><div class="card-body">Evrensel IoA formatı. Splunk SPL, Elastic KQL, Sentinel KQL, Sumo, Chronicle'a derlenen YAML tespit mantığı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. STIX 2.1 ve TAXII 2.1</h2>
<p class="l-text"><strong>STIX</strong> (Structured Threat Information Expression), siber-tehdit istihbaratı için OASIS-standart JSON şemasıdır. 2.1 sürümü (2021) veri modelini oturttu:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SDO'lar (Domain Objects)</div><div class="card-body">indicator, malware, threat-actor, intrusion-set, campaign, tool, attack-pattern, vulnerability, identity, location, report, course-of-action, observed-data, opinion, note, grouping.</div></div>
<div class="calc-card"><div class="card-title">SRO'lar (Relationship Objects)</div><div class="card-body">relationship (tipli: uses, attributed-to, indicates), sighting (X T zamanında burada görüldü).</div></div>
<div class="calc-card"><div class="card-title">SCO'lar (Cyber-observable)</div><div class="card-body">file, ipv4-addr, domain-name, url, network-traffic, process, x509-certificate. Yeniden kullanılabilir yapı taşları.</div></div>
<div class="calc-card"><div class="card-title">TAXII 2.1</div><div class="card-body">STIX paylaşmak için REST API. Sunucular <em>koleksiyonları</em> sergiler; istemciler added_after, type filtreleriyle <code>GET /taxii2/api1/collections/X/objects/</code>.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Bir STIX 2.1 indicator + relationship + threat-actor oluştur
import json, uuid
from datetime import datetime, timezone

now = datetime.now(timezone.utc).isoformat()

actor = {"type":"threat-actor","spec_version":"2.1",
  "id":f"threat-actor--{uuid.uuid4()}","created":now,"modified":now,
  "name":"APT29","aliases":["Cozy Bear","NOBELIUM","Midnight Blizzard"],
  "threat_actor_types":["nation-state"],"sophistication":"strategic"}

indicator = {"type":"indicator","spec_version":"2.1",
  "id":f"indicator--{uuid.uuid4()}","created":now,"modified":now,
  "indicator_types":["malicious-activity"],
  "name":"FOGGYWEB C2","pattern_type":"stix",
  "pattern":"[domain-name:value = 'evil.example.com']",
  "valid_from":now}

rel = {"type":"relationship","spec_version":"2.1",
  "id":f"relationship--{uuid.uuid4()}","created":now,"modified":now,
  "relationship_type":"indicates",
  "source_ref":indicator["id"],"target_ref":actor["id"]}

bundle = {"type":"bundle","id":f"bundle--{uuid.uuid4()}",
          "objects":[actor, indicator, rel]}
print(json.dumps(bundle, indent=2)[:600], "...")
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Zorunlu STIX 2.1 anahtarlarıyla bir <code>threat-actor</code> SDO'su kurar — <code>spec_version</code>, UUIDv4 son ekli <code>id</code>, UTC'de ISO-8601 <code>created</code>/<code>modified</code> — artı APT29'un bilinen takma adları (Cozy Bear, NOBELIUM, Midnight Blizzard) ve <code>nation-state</code> sınıflandırması. 2) <code>pattern_type:"stix"</code> ve <code>[domain-name:value = 'evil.example.com']</code> STIX-pattern ifadesiyle bir <code>indicator</code> SDO'su oluşturur — TAXII sunucularının sorguladığı aynı pattern grameridir. 3) Indicator'dan actor'a <code>indicates</code> tipinde bir <code>relationship</code> SRO ile bağlar — STIX'in "bu domain APT29'u açığa çıkarır" deme şekli. 4) Üç nesneyi de bir <code>bundle</code> zarfına sarar ve <code>indent=2</code> ile <code>json.dumps</code> eder — MISP, OpenCTI ve herhangi bir TAXII 2.1 koleksiyonunun yerel olarak ingest ettiği bayt-eşit format.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. MISP — Açık Kaynak İstihbarat Platformu</h2>
<p class="l-text"><strong>MISP</strong> (Malware Information Sharing Platform, Andras Iklody, 2011, CIRCL Lüksemburg), her CERT'in çalıştırdığı açık kaynak TIP'tir. İstihbaratı kategoriler, kaynak güveni, TLP (Traffic Light Protocol) ile etiketlenmiş <em>özellikler</em> (IoC'ler) içeren <em>olaylar</em> olarak modeller. Yerleşik senkronizasyon olayları eş MISP örneklerine ve STIX/TAXII tüketicilerine iter.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Ölçekte IoC Eşleştirme — Python Set Üyeliği</h2>
<p class="l-text">Ekmek-tereyağı SOC operasyonu: bugünün olaylarını al (DNS sorguları, dosya hash'leri, EDR'den IP'ler), istihbarat beslemesine birleştir (MISP dışa aktarım, AlienVault OTX, abuse.ch). Python'da set üyeliği O(1) ve milyonlarca IoC'de zahmetsizdir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, json, time

# IoC beslemelerini yükle (gerçek hayatta: MISP API, abuse.ch URLhaus, AlienVault OTX)
ioc_hashes  = {hashlib.sha256(f"apt29_sample_{i}".encode()).hexdigest() for i in range(50_000)}
ioc_domains = {f"c2-{i}.example.com" for i in range(20_000)} | {"evil.example.com"}
ioc_ips     = {f"203.0.113.{i}" for i in range(254)}

# Bugünün gözlemleri
events = [
  {"kind":"file","value":"abc...notamatch..."},
  {"kind":"file","value":hashlib.sha256(b"apt29_sample_42").hexdigest()},
  {"kind":"dns","value":"evil.example.com"},
  {"kind":"dns","value":"google.com"},
  {"kind":"ip","value":"203.0.113.7"},
  {"kind":"ip","value":"8.8.8.8"},
]

start = time.time()
hits = []
for ev in events:
    if ev["kind"]=="file" and ev["value"] in ioc_hashes:    hits.append(ev)
    if ev["kind"]=="dns"  and ev["value"] in ioc_domains:   hits.append(ev)
    if ev["kind"]=="ip"   and ev["value"] in ioc_ips:       hits.append(ev)
elapsed_ms = (time.time()-start)*1000
print(f"Matched {len(hits)} of {len(events)} in {elapsed_ms:.2f} ms")
for h in hits: print(" HIT:", h)
</code></pre></div>
<p class="l-text"><strong>Kodun adım adım işleyişi:</strong> 1) Sentetik beslemelerden tohumlanan üç Python <code>set</code>'i önceden kurar — 50.000 SHA-256 dosya hash'i (her <code>apt29_sample_N</code> için bir tane), 20.000 C2 domain'i artı açık <code>evil.example.com</code> ve <code>203.0.113.0/24</code>'teki 254 IP — MISP, abuse.ch URLhaus ve AlienVault OTX'in dışa aktardığı aynı şekiller. 2) Bugünün altı gözlemini döngüye sokar ve <code>ev["kind"]</code>'a göre — file vs DNS vs IP — eşleşen sete <code>in</code> operatörüyle dağıtır; bu, CPython <code>set</code>'inin garanti ettiği O(1) hash-set lookup'tır. 3) Tüm döngüyü <code>time.time()</code> delta'larıyla zamanlar ve milisaniye sınıfı gecikmeyi kanıtlar — SOC ETL pipeline'larının her dakika on binlerce olayı on milyonlarca IoC'ye birleştirebilmesinin nedeni budur. 4) Hit'leri yazdırır — yerleştirilmiş eşleşmelerden gelen iki file/DNS/IP üçlüsü — böylece kanonik "intel + telemetri → alert" join'ini iş başında görürsün.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı set-üyeliği IoC eşleştirici; on binlerce istihbarat atomuna karşı O(1) aramaları gösterir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, time
ioc_hashes  = {hashlib.sha256(f"apt29_{i}".encode()).hexdigest() for i in range(20_000)}
ioc_domains = {"evil.example.com","badcdn.net","apt29-c2.org"}
ioc_ips     = {"203.0.113.7","198.51.100.42"}

events = [
  ("file", hashlib.sha256(b"apt29_42").hexdigest()),
  ("file", hashlib.sha256(b"benign").hexdigest()),
  ("dns",  "evil.example.com"),
  ("dns",  "wikipedia.org"),
  ("ip",   "203.0.113.7"),
  ("ip",   "8.8.8.8"),
]
start = time.time()
hits = [e for e in events if (e[0]=="file" and e[1] in ioc_hashes)
                          or (e[0]=="dns"  and e[1] in ioc_domains)
                          or (e[0]=="ip"   and e[1] in ioc_ips)]
print(f"Hits: {len(hits)} in {(time.time()-start)*1000:.3f} ms")
for h in hits: print(" ", h)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 TEMEL ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>APT grupları: APT29, APT28, APT41, Lazarus, Sandworm, Equation, APT35, FIN7. İsimlendirme satıcıya göre değişir.</li>
<li>Cyber Kill Chain (7 adım), Diamond Model (4 köşe), MITRE ATT&amp;CK (Tactics/Techniques/Procedures).</li>
<li>IoC = artefakt (kaçınması ucuz), IoA = davranış (dayanıklı). Pyramid of Pain'i tırman.</li>
<li>STIX 2.1 = veri modeli, TAXII 2.1 = aktarım, MISP = popüler açık kaynak uygulama.</li>
<li>Python set üyeliği milyonlarca IoC'ye olay başına alt-ms'de ölçeklenir.</li>
</ul>
</div>
<p class="l-text">Sıradaki final: <strong>forensics-L8</strong> her şeyi olay müdahalesi yaşam döngüsüne ve SIEM/SOC boru hattına bağlar.</p>
</div>`
};
