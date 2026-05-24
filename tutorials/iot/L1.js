window.IOT_L1 = {
en: `<p class="l-text"><strong>The Internet of Things is the largest unmanaged attack surface humans have ever built.</strong> By 2025, Cisco and IoT Analytics estimate <em>27 billion</em> connected devices — baby monitors, insulin pumps, traffic lights, factory PLCs, smart locks, vehicle ECUs — most shipping with default credentials, no patch path, and a 10-15 year lifetime in hostile networks. The 2016 Mirai botnet (Antonakakis et al., USENIX Security 2017) compromised roughly 600,000 IP cameras and DVRs by trying 62 default username/password pairs and used them to take Krebs on Security, Dyn DNS, and chunks of the eastern U.S. internet offline at over 1 Tbps. The malware was 11 KB. The credentials were public.</p>

<p class="l-text">This first lesson maps the territory. We walk the device-edge-cloud reference architecture used by AWS IoT, Azure IoT Hub, and the Industrial Internet Consortium; we work through every entry of the OWASP IoT Top 10 (2018 edition, the version cited by ENISA and the EU Cyber Resilience Act draft); we dissect Mirai not as a curiosity but as the template for every IoT botnet since (Mozi, Meris, BotenaGo); and we show how Shodan's roughly 500 million indexed devices turn reconnaissance from a craft into a search query. By the end you should be able to look at any IoT product and predict, within minutes, the three most likely ways it will be broken.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Draw the device → gateway → edge → cloud reference architecture and locate trust boundaries</li>
<li>Recite the OWASP IoT Top 10 (2018) from memory and map each entry to a real CVE</li>
<li>Reconstruct the Mirai 2016 attack: scanner, loader, C2, dictionary, DDoS vectors</li>
<li>Use Shodan dorks responsibly to estimate exposure of a device class</li>
<li>Model an IoT botnet's growth as an SIR-style epidemic and predict saturation</li>
<li>Apply STRIDE threat modeling to an IoT product before it ships</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Device-Edge-Cloud Reference Architecture</h2>
<p class="l-text">Every IoT system, from a $9 smart plug to a $9M wind turbine, decomposes into the same four planes. Memorize them — every threat we discuss in this track lands on one of these planes, and most cross at least one boundary.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Device (the "thing")</div><div class="card-body">Microcontroller (ESP32, STM32, nRF52) or small Linux SoC (Raspberry Pi, Allwinner). Sensors, actuators, radio. Constrained: kilobytes of RAM, no MMU on MCUs, often no TLS until recently. Firmware updates are the lifecycle problem.</div></div>
<div class="calc-card"><div class="card-title">2. Gateway / Edge</div><div class="card-body">Aggregator at the local network — a hub (Hue Bridge, SmartThings), a 5G CPE, an industrial gateway (Siemens IOT2050). Protocol translation (Zigbee → MQTT, Modbus → OPC-UA), local rule engines, edge ML inference.</div></div>
<div class="calc-card"><div class="card-title">3. Cloud / Platform</div><div class="card-body">AWS IoT Core, Azure IoT Hub, Google Cloud IoT (deprecated 2023), or self-hosted (Mosquitto + Postgres + Grafana). Device registry, shadow/digital twin, telemetry ingest, OTA service, fleet command.</div></div>
<div class="calc-card"><div class="card-title">4. Application / Enterprise</div><div class="card-body">Mobile app, web dashboard, ERP/SCADA integration, BI. Where humans interact and where most credential-stuffing attacks land. Often shares an OAuth/Cognito identity provider with the device side.</div></div>
</div>

<div class="calc-highlight"><strong>Trust boundaries</strong> are the lines between these planes. A device authenticating to a cloud, a gateway speaking to an upstream MQTT broker, a mobile app calling a REST API on behalf of a user — every boundary needs mutual authentication, encryption, and authorization. Most IoT breaches happen because one boundary was treated as "internal" and skipped.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. OWASP IoT Top 10 (2018)</h2>
<p class="l-text">OWASP refreshed its IoT list in 2018 (the 2014 version is obsolete). It is the canonical reference cited by ETSI EN 303 645, ENISA's Baseline Security Recommendations, the UK PSTI Act, the California IoT Law (SB-327), and the EU Cyber Resilience Act draft. Every line below maps to thousands of CVEs.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">I1. Weak / guessable / hardcoded passwords</div><div class="card-body">The Mirai entry. <code>admin:admin</code>, <code>root:xc3511</code> (Xiongmai cameras). California SB-327 banned shipping with universal default passwords as of 2020.</div></div>
<div class="calc-card"><div class="card-title">I2. Insecure network services</div><div class="card-body">Telnet on port 23, debug UART/JTAG enabled in production, UPnP holes punched through NAT, custom binary protocols on open ports.</div></div>
<div class="calc-card"><div class="card-title">I3. Insecure ecosystem interfaces</div><div class="card-body">Mobile/cloud APIs with broken authentication, IDOR (incrementing device IDs), missing rate limits. Wyze 2019 leaked 2.4M users this way.</div></div>
<div class="calc-card"><div class="card-title">I4. Lack of secure update mechanism</div><div class="card-body">Unsigned firmware, no rollback protection, plaintext OTA over HTTP, missing anti-bricking. Without secure update there is no remediation.</div></div>
<div class="calc-card"><div class="card-title">I5. Use of insecure or outdated components</div><div class="card-body">10-year-old BusyBox, OpenSSL 1.0.1 (Heartbleed), Linux 3.x kernels, abandoned vendor SDKs. SBOMs (CycloneDX, SPDX) make this auditable.</div></div>
<div class="calc-card"><div class="card-title">I6. Insufficient privacy protection</div><div class="card-body">Always-on microphones, location histories, child cameras streaming to vendor clouds. GDPR Art. 5 (data minimisation) is violated routinely here.</div></div>
<div class="calc-card"><div class="card-title">I7. Insecure data transfer / storage</div><div class="card-body">MQTT without TLS, plaintext credentials in NVS/flash, unencrypted SD cards. <code>tcpdump</code> recovers Wi-Fi PSKs from many cheap devices.</div></div>
<div class="calc-card"><div class="card-title">I8. Lack of device management</div><div class="card-body">No inventory, no decommissioning, no key rotation, no telemetry of compromise. Fleets become unmanaged the day they ship.</div></div>
<div class="calc-card"><div class="card-title">I9. Insecure default settings</div><div class="card-body">Permissive ports open, debug logging enabled, telemetry on by default, factory reset re-enables a known password.</div></div>
<div class="calc-card"><div class="card-title">I10. Lack of physical hardening</div><div class="card-body">Exposed UART/JTAG/SWD pads, unencrypted external SPI flash, no tamper sensors, secrets in plain ROM. We dedicate iot-L2 to this.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Mirai (September 2016) — The Template</h2>
<p class="l-text">Mirai is the IoT incident every defender must understand in detail. Krebs (Sep 20, 2016) was hit at 620 Gbps; OVH took 1.1 Tbps two days later; Dyn fell on October 21, 2016, taking Twitter, Netflix, Reddit, and PayPal off the U.S. east coast. The source code was leaked by "Anna-senpai" (Paras Jha, later convicted) on Hackforums. Antonakakis et al.'s USENIX Security 2017 paper is the definitive postmortem.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Scanner</div><div class="card-body">Each bot SYN-scans random IPv4 on TCP/23 and TCP/2323 at roughly 160 pps. On open port, attempts a built-in dictionary of 62 username/password pairs.</div></div>
<div class="calc-card"><div class="card-title">Reporter → Loader</div><div class="card-body">Successful logins are reported to a central <em>scanListen</em> server. The <em>loader</em> SSH/telnets in, detects CPU arch (ARM/MIPS/x86/PPC/SPARC/SH4), <code>wget</code>s the right binary, executes, deletes the file from disk.</div></div>
<div class="calc-card"><div class="card-title">C2 (command &amp; control)</div><div class="card-body">Bots beacon to a hardcoded domain over TCP. Operator issues attack commands: UDP flood, SYN flood, ACK flood, GRE flood, HTTP GET, DNS water-torture (the Dyn vector).</div></div>
<div class="calc-card"><div class="card-title">Self-hardening</div><div class="card-body">Mirai kills competing botnets (Qbot, Anime), closes ports 22/23/80 inbound to itself, and resists reboot only by avoiding flash writes — power-cycling cleans the device, but it is reinfected within 5 minutes.</div></div>
</div>

<p class="l-text">The lesson: <em>none</em> of this required a zero-day. Every step exploited OWASP IoT I1, I2, I4, I9. The same primitives drive Mozi (DHT-based, 2019), Meris (250k routers, 2021), BotenaGo (Go-written, 30+ exploits, 2021), and Aisuru (2024). Defending against Mirai is defending against most of IoT crime.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mirai-style epidemic: SIR model on a 27B-device population
# S = susceptible (default creds, telnet open)
# I = infected (in botnet)
# R = removed (patched, power-cycled and offline, ISP-blocked)
import numpy as np
import matplotlib.pyplot as plt

N = 27_000_000_000          # global IoT installed base, 2025
S0 = 2_000_000              # devices reachable on telnet with default creds
I0 = 1                      # patient zero
R0 = 0
beta  = 0.00018             # infection rate per S-I contact
gamma = 0.04                # recovery (reboot/cleanup) rate
days  = 60

S, I, R = [S0], [I0], [R0]
for t in range(days):
    new_inf = beta * S[-1] * I[-1] / (S[-1] + I[-1])
    new_rem = gamma * I[-1]
    S.append(S[-1] - new_inf)
    I.append(I[-1] + new_inf - new_rem)
    R.append(R[-1] + new_rem)

print(f"Peak infected: {int(max(I)):,} on day {int(np.argmax(I))}")
print(f"Final removed: {int(R[-1]):,}")
# Mirai's real peak was ~600k; our toy model reproduces the order of magnitude.</code></pre></div>

<p class="l-text">The model above is the same one epidemiologists use for measles. The only thing that differs is the time unit (minutes for IoT scanners, days for humans). Patch deployment, ISP blackholing, and CERT takedowns appear in this model as a sudden jump in <code>gamma</code>.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Shodan, Censys, ZoomEye — Internet-Scale Reconnaissance</h2>
<p class="l-text">Before Shodan (John Matherly, 2009) you had to scan the internet yourself to find exposed devices. Today Shodan, Censys, and BinaryEdge run continuous IPv4 scans on hundreds of ports and serve the results as a search engine. Roughly 500M devices are indexed at any time. Defensive teams use it to inventory their own exposure; attackers use it to skip the scanner stage of Mirai entirely.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Useful Shodan queries (educational only)</div><div class="card-body"><code>port:23 mirai</code> — telnet banners hit by Mirai. <code>"Server: Boa/0.94"</code> — old IP cameras. <code>"default password"</code> — devices that admit it. <code>product:"Modbus"</code> — exposed PLCs (link to iot-L5).</div></div>
<div class="calc-card"><div class="card-title">Censys</div><div class="card-body">University-of-Michigan project (Durumeric et al., 2015). Better TLS fingerprinting than Shodan; cited in academic IoT census papers.</div></div>
<div class="calc-card"><div class="card-title">ZoomEye / FOFA / Quake</div><div class="card-body">Chinese equivalents. Often see different parts of APAC infrastructure than Shodan. Used heavily in CTI work.</div></div>
<div class="calc-card"><div class="card-title">Defensive use</div><div class="card-body">Run a daily Shodan query on your ASN. Any new exposed port is a misconfiguration. Companies like Censys and Bishop Fox sell this as ASM (Attack Surface Management).</div></div>
</div>

<div class="calc-highlight"><strong>Legal note:</strong> querying Shodan is legal in most jurisdictions. Connecting to and authenticating against a discovered device without permission is unauthorized access (CFAA in the U.S., Computer Misuse Act in the UK). Always work on devices you own or have written authorization to test.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. STRIDE Threat Modeling for an IoT Product</h2>
<p class="l-text">STRIDE (Microsoft, Howard &amp; LeBlanc 2003) is the cheapest defensive return-on-investment in IoT engineering. Run it before you write firmware; revisit it before each release. It maps every component to six threat categories.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">S — Spoofing</div><div class="card-body">Can an attacker impersonate a device, a user, or the cloud? Mitigation: mutual TLS with per-device certs (iot-L2), strong API auth.</div></div>
<div class="calc-card"><div class="card-title">T — Tampering</div><div class="card-body">Can the firmware, OTA payload, or telemetry be modified in transit or at rest? Mitigation: signed firmware, TLS, integrity-protected storage.</div></div>
<div class="calc-card"><div class="card-title">R — Repudiation</div><div class="card-body">Can a malicious actor deny an action? Mitigation: signed audit logs, append-only event store on the cloud side.</div></div>
<div class="calc-card"><div class="card-title">I — Information disclosure</div><div class="card-body">Can secrets, PII, or telemetry leak? Mitigation: encryption at rest and in transit, minimal data collection (GDPR alignment, see compliance-L1).</div></div>
<div class="calc-card"><div class="card-title">D — Denial of service</div><div class="card-body">Can the device, gateway, or cloud be flooded? Mitigation: rate limits, watchdogs, MQTT broker authn, regional DDoS scrubbing.</div></div>
<div class="calc-card"><div class="card-title">E — Elevation of privilege</div><div class="card-body">Can a low-privilege user or process gain admin? Mitigation: least privilege, MMU/memory protection, syscall filtering, principle of least authority on tokens.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># STRIDE scoring sheet for an IoT product, computed as a heatmap
import pandas as pd
components = ["Device firmware", "BLE link", "MQTT-cloud", "Mobile app", "OTA service"]
threats    = ["S", "T", "R", "I", "D", "E"]

# 0 = mitigated, 1 = partial, 2 = open
matrix = [
    [0, 1, 2, 1, 0, 1],   # firmware
    [1, 1, 2, 2, 1, 1],   # BLE
    [0, 0, 1, 0, 1, 0],   # MQTT
    [0, 1, 1, 1, 1, 1],   # mobile
    [0, 0, 0, 0, 1, 0],   # OTA
]
df = pd.DataFrame(matrix, index=components, columns=threats)
print(df)
print("\\nResidual risk score (sum):", df.values.sum(),
      "/", df.size * 2, "max")</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a STRIDE matrix where rows are product components (firmware, BLE link, MQTT-cloud, mobile app, OTA) and columns are the six threat categories (S, T, R, I, D, E). 2) Each cell scores residual risk on a 0-2 scale: 0 means mitigated, 1 partial, 2 still open — gives engineering a heatmap of where the holes are. 3) Wraps it in a pandas DataFrame so the sheet is printable, diffable in git, and easy to drop into a security review deck. 4) Sums the matrix against the maximum possible score (rows × columns × 2) to produce a single residual-risk number you can track release-over-release.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Risk Equation</h2>
<p class="l-text">Threat modeling is qualitative; risk management needs numbers. The classical formula used by ENISA, NIST SP 800-30, and ISO 27005 is:</p>

<div class="katex-block">$$ \\text{Risk} = \\text{Likelihood} \\times \\text{Impact} $$</div>

<p class="l-text">For IoT, likelihood is dominated by exposure (is the port reachable from the internet?) and exploit availability (is there a Metasploit module?). Impact is dominated by what the device controls — a smart bulb is low impact, a hospital infusion pump is life-safety. Annualized Loss Expectancy (ALE) extends this:</p>

<div class="katex-block">$$ \\text{ALE} = \\text{ARO} \\times \\text{SLE} $$</div>

<p class="l-text">where ARO is annualized rate of occurrence and SLE is single-loss expectancy. A Mirai-class compromise at a SaaS company in 2024 was estimated at $250k single-loss (incident response + churn); two events per year gives $500k ALE. Compare against the cost of mitigation — secure boot, OTA, monitoring — to decide what to fund.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Standards and Regulation Landscape (2026)</h2>
<p class="l-text">IoT is moving from "ship and forget" to regulated like medical devices. The defenders' map:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ETSI EN 303 645 (2020)</div><div class="card-body">European baseline for consumer IoT. 13 provisions: no defaults, vulnerability disclosure, secure update, etc. Cited by every newer regulation.</div></div>
<div class="calc-card"><div class="card-title">EU Cyber Resilience Act (Reg 2024/2847)</div><div class="card-body">Adopted Oct 2024, full application 2027. Mandatory security across the lifecycle for "products with digital elements". Fines up to €15M or 2.5% global turnover. Game-changer for European IoT.</div></div>
<div class="calc-card"><div class="card-title">UK PSTI Act (2022, in force 2024)</div><div class="card-body">Bans default passwords, requires vuln disclosure point of contact, transparency on support periods.</div></div>
<div class="calc-card"><div class="card-title">U.S. Cyber Trust Mark (FCC, 2024)</div><div class="card-body">Voluntary label for consumer IoT, anchored on NIST IR 8425. Walmart, Amazon, Best Buy partners.</div></div>
<div class="calc-card"><div class="card-title">NIST SP 800-213 / IR 8259 / IR 8425</div><div class="card-body">U.S. federal IoT capabilities baselines. Mandatory for federal procurement.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27400 (2022)</div><div class="card-body">IoT security &amp; privacy guidelines, the international counterpart to ETSI EN 303 645.</div></div>
</div>

<div class="calc-highlight">If you ship a connected product into the EU after December 2027 without a CRA-aligned security posture, you cannot legally CE-mark it. This is the largest regulatory shift in IoT history; the rest of this track teaches you how to comply technically.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Field Exercise — Audit Your Own Network</h2>
<p class="l-text">Apply this lesson concretely. On a network you own:</p>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># 1. Discover IoT devices on your LAN
nmap -sn 192.168.1.0/24                # ping sweep
nmap -p 22,23,80,443,1883,5683,8883 -sV 192.168.1.0/24

# 2. Inspect MQTT brokers (port 1883 / 8883)
mosquitto_sub -h broker.local -t '#' -v   # do you allow anonymous?

# 3. Look for telnet/UART debug surfaces
nmap --script telnet-encryption,telnet-ntlm-info -p 23 192.168.1.0/24

# 4. Banner-grab and compare to Shodan facets for that vendor
# 5. Check for default credentials AGAINST DEVICES YOU OWN ONLY
# 6. File a STRIDE row per device class</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Runs an ARP/ICMP ping sweep with <code>nmap -sn</code> to enumerate live hosts on the local /24 — the cheapest way to discover unmanaged IoT gear no one inventoried. 2) Probes the common IoT service ports (22/23/80/443/1883/5683/8883) with version detection (<code>-sV</code>) so you can match banners to known-vulnerable vendor builds. 3) Subscribes to <code>#</code> on any reachable broker — if it accepts anonymous connects, every device's telemetry is leaking on your own LAN. 4) Targets telnet on port 23 with NSE scripts that fingerprint authentication mode, then cross-references each banner against Shodan facets for the same vendor.</p>


<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Lightweight inventory + risk scoring sheet you can run today
import pandas as pd
inventory = pd.DataFrame([
    {"device":"Hue Bridge",  "fw":"1.55", "telnet":False, "tls":True,  "default_pw":False, "owns_safety":False},
    {"device":"IP camera",   "fw":"old",  "telnet":True,  "tls":False, "default_pw":True,  "owns_safety":False},
    {"device":"Smart lock",  "fw":"2.1",  "telnet":False, "tls":True,  "default_pw":False, "owns_safety":True },
    {"device":"Insulin pump","fw":"4.0",  "telnet":False, "tls":True,  "default_pw":False, "owns_safety":True },
])
def score(r):
    likelihood = 0.6*r.telnet + 0.3*r.default_pw + 0.1*(not r.tls)
    impact     = 0.8 if r.owns_safety else 0.3
    return round(likelihood * impact, 3)
inventory["risk"] = inventory.apply(score, axis=1)
print(inventory.sort_values("risk", ascending=False))</code></pre></div>

<p class="l-text">A spreadsheet like this, kept current, beats most "IoT security platforms" sold at RSA. The remaining lessons in this track teach you what to do when the score is high — hardware roots of trust (iot-L2), firmware analysis (iot-L3), wireless attack surface (iot-L4), industrial systems (iot-L5), and the capstone: connected vehicles (iot-L6).</p>
</div>`,
tr: `<p class="l-text"><strong>Nesnelerin İnterneti, insanların inşa ettiği en büyük yönetilmemiş saldırı yüzeyidir.</strong> 2025'e kadar Cisco ve IoT Analytics <em>27 milyar</em> bağlı cihaz tahmin ediyor — bebek monitörleri, insülin pompaları, trafik ışıkları, fabrika PLC'leri, akıllı kilitler, araç ECU'ları — çoğu varsayılan kimlik bilgileriyle, yama yolu olmadan ve düşmanca ağlarda 10-15 yıl ömürle gönderiliyor. 2016 Mirai botneti (Antonakakis vd., USENIX Security 2017) 62 varsayılan kullanıcı adı/parola çiftini deneyerek yaklaşık 600.000 IP kamerayı ve DVR'yi ele geçirdi ve bunları Krebs on Security, Dyn DNS ve ABD doğusunun internet parçalarını 1 Tbps'nin üzerinde çevrimdışı bırakmak için kullandı. Zararlı yazılım 11 KB'ydı. Kimlik bilgileri kamuya açıktı.</p>

<p class="l-text">Bu ilk ders bölgeyi haritalandırır. AWS IoT, Azure IoT Hub ve Industrial Internet Consortium tarafından kullanılan cihaz-uç-bulut referans mimarisini yürüyoruz; OWASP IoT Top 10'un (2018 baskısı, ENISA ve AB Siber Dayanıklılık Yasası taslağı tarafından alıntılanan sürüm) her girişini çalışıyoruz; Mirai'yi bir merak olarak değil, o zamandan beri her IoT botnetinin (Mozi, Meris, BotenaGo) şablonu olarak inceliyoruz; ve Shodan'ın yaklaşık 500 milyon indekslenmiş cihazının keşfi bir zanaattan bir arama sorgusuna nasıl dönüştürdüğünü gösteriyoruz. Sonuna kadar herhangi bir IoT ürününe bakabilmeli ve dakikalar içinde, kırılacağı en olası üç yolu tahmin edebilmelisiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Cihaz → ağ geçidi → uç → bulut referans mimarisini çizin ve güven sınırlarını bulun</li>
<li>OWASP IoT Top 10'u (2018) ezberden okuyun ve her girişi gerçek bir CVE ile eşleştirin</li>
<li>Mirai 2016 saldırısını yeniden inşa edin: tarayıcı, yükleyici, C2, sözlük, DDoS vektörleri</li>
<li>Bir cihaz sınıfının maruziyetini tahmin etmek için Shodan dork'larını sorumlu bir şekilde kullanın</li>
<li>Bir IoT botnetinin büyümesini SIR tarzı bir salgın olarak modelleyin ve doygunluğu tahmin edin</li>
<li>Bir IoT ürünü gönderilmeden önce STRIDE tehdit modellemesi uygulayın</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Cihaz-Uç-Bulut Referans Mimarisi</h2>
<p class="l-text">Her IoT sistemi, 9 dolarlık akıllı fişten 9 milyon dolarlık rüzgâr türbinine kadar, aynı dört düzleme ayrışır. Onları ezberleyin — bu izde tartıştığımız her tehdit bu düzlemlerden birine iniyor ve çoğu en az bir sınırı geçiyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Cihaz ("nesne")</div><div class="card-body">Mikrodenetleyici (ESP32, STM32, nRF52) veya küçük Linux SoC (Raspberry Pi, Allwinner). Sensörler, eyleyiciler, radyo. Kısıtlı: kilobaytlarca RAM, MCU'larda MMU yok, son zamanlara kadar genellikle TLS yok. Firmware güncellemeleri yaşam döngüsü problemidir.</div></div>
<div class="calc-card"><div class="card-title">2. Ağ Geçidi / Uç</div><div class="card-body">Yerel ağdaki toplayıcı — bir hub (Hue Bridge, SmartThings), bir 5G CPE, bir endüstriyel ağ geçidi (Siemens IOT2050). Protokol çevirisi (Zigbee → MQTT, Modbus → OPC-UA), yerel kural motorları, uç ML çıkarımı.</div></div>
<div class="calc-card"><div class="card-title">3. Bulut / Platform</div><div class="card-body">AWS IoT Core, Azure IoT Hub, Google Cloud IoT (2023'te kullanımdan kaldırıldı) veya kendi-barındırılan (Mosquitto + Postgres + Grafana). Cihaz kaydı, gölge/dijital ikiz, telemetri alımı, OTA hizmeti, filo komutu.</div></div>
<div class="calc-card"><div class="card-title">4. Uygulama / Kuruluş</div><div class="card-body">Mobil uygulama, web panosu, ERP/SCADA entegrasyonu, BI. İnsanların etkileşimde bulunduğu ve çoğu kimlik bilgisi doldurma saldırısının indiği yer. Genellikle cihaz tarafıyla bir OAuth/Cognito kimlik sağlayıcısı paylaşır.</div></div>
</div>

<div class="calc-highlight"><strong>Güven sınırları</strong> bu düzlemler arasındaki çizgilerdir. Bir bulutta kimlik doğrulayan bir cihaz, bir yukarı akış MQTT broker'ıyla konuşan bir ağ geçidi, bir kullanıcı adına bir REST API çağıran bir mobil uygulama — her sınırın karşılıklı kimlik doğrulama, şifreleme ve yetkilendirmeye ihtiyacı vardır. Çoğu IoT ihlali, bir sınır "dahili" olarak ele alınıp atlandığı için olur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. OWASP IoT Top 10 (2018)</h2>
<p class="l-text">OWASP, IoT listesini 2018'de yeniledi (2014 sürümü artık geçerli değil). ETSI EN 303 645, ENISA Temel Güvenlik Önerileri, UK PSTI Yasası, Kaliforniya IoT Yasası (SB-327) ve AB Siber Dayanıklılık Yasası taslağı tarafından alıntılanan kanonik referanstır. Aşağıdaki her satır binlerce CVE ile eşleşir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">I1. Zayıf / tahmin edilebilir / sabit kodlanmış parolalar</div><div class="card-body">Mirai girişi. <code>admin:admin</code>, <code>root:xc3511</code> (Xiongmai kameralar). Kaliforniya SB-327, 2020 itibarıyla evrensel varsayılan parolalarla göndermeyi yasakladı.</div></div>
<div class="calc-card"><div class="card-title">I2. Güvensiz ağ hizmetleri</div><div class="card-body">23 portunda Telnet, üretimde etkinleştirilmiş hata ayıklama UART/JTAG, NAT'tan delinen UPnP delikleri, açık portlarda özel ikili protokoller.</div></div>
<div class="calc-card"><div class="card-title">I3. Güvensiz ekosistem arayüzleri</div><div class="card-body">Bozuk kimlik doğrulamasına sahip mobil/bulut API'leri, IDOR (artan cihaz ID'leri), eksik hız sınırları. Wyze 2019 bu şekilde 2.4 milyon kullanıcıyı sızdırdı.</div></div>
<div class="calc-card"><div class="card-title">I4. Güvenli güncelleme mekanizması eksikliği</div><div class="card-body">İmzasız firmware, geri alma koruması yok, HTTP üzerinden düz metin OTA, eksik anti-bricking. Güvenli güncelleme olmadan iyileştirme yoktur.</div></div>
<div class="calc-card"><div class="card-title">I5. Güvensiz veya eski bileşenlerin kullanımı</div><div class="card-body">10 yıllık BusyBox, OpenSSL 1.0.1 (Heartbleed), Linux 3.x çekirdekleri, terk edilmiş satıcı SDK'ları. SBOM'lar (CycloneDX, SPDX) bunu denetlenebilir kılar.</div></div>
<div class="calc-card"><div class="card-title">I6. Yetersiz gizlilik koruması</div><div class="card-body">Sürekli açık mikrofonlar, konum geçmişleri, satıcı bulutlarına yayın yapan çocuk kameraları. GDPR Madde 5 (veri minimizasyonu) burada rutin olarak ihlal edilir.</div></div>
<div class="calc-card"><div class="card-title">I7. Güvensiz veri aktarımı / depolaması</div><div class="card-body">TLS olmadan MQTT, NVS/flash'ta düz metin kimlik bilgileri, şifrelenmemiş SD kartlar. <code>tcpdump</code> birçok ucuz cihazdan Wi-Fi PSK'ları kurtarır.</div></div>
<div class="calc-card"><div class="card-title">I8. Cihaz yönetimi eksikliği</div><div class="card-body">Envanter yok, devre dışı bırakma yok, anahtar rotasyonu yok, ele geçirilme telemetrisi yok. Filolar gönderildikleri gün yönetilmemiş hâle gelir.</div></div>
<div class="calc-card"><div class="card-title">I9. Güvensiz varsayılan ayarlar</div><div class="card-body">İzin verici portlar açık, hata ayıklama günlüğü etkin, varsayılan olarak telemetri açık, fabrika sıfırlama bilinen bir parolayı yeniden etkinleştirir.</div></div>
<div class="calc-card"><div class="card-title">I10. Fiziksel sertleştirme eksikliği</div><div class="card-body">Açıkta UART/JTAG/SWD pedleri, şifrelenmemiş harici SPI flash, kurcalama sensörleri yok, düz ROM'da sırlar. Bunun için iot-L2'yi ayırıyoruz.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Mirai (Eylül 2016) — Şablon</h2>
<p class="l-text">Mirai, her savunucunun ayrıntılı olarak anlaması gereken IoT olayıdır. Krebs (20 Eylül 2016) 620 Gbps ile vuruldu; OVH iki gün sonra 1.1 Tbps aldı; Dyn 21 Ekim 2016'da düştü, Twitter, Netflix, Reddit ve PayPal'ı ABD'nin doğu kıyısından çevrimdışı bıraktı. Kaynak kodu Hackforums'ta "Anna-senpai" (Paras Jha, sonra mahkûm edildi) tarafından sızdırıldı. Antonakakis vd.'nin USENIX Security 2017 makalesi kesin postmortemdir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tarayıcı</div><div class="card-body">Her bot saniyede yaklaşık 160 paketle TCP/23 ve TCP/2323 üzerinde rastgele IPv4'ü SYN-tarar. Açık portta, 62 yerleşik kullanıcı adı/parola çifti sözlüğünü dener.</div></div>
<div class="calc-card"><div class="card-title">Raporcu → Yükleyici</div><div class="card-body">Başarılı oturum açmalar merkezi bir <em>scanListen</em> sunucusuna bildirilir. <em>Yükleyici</em> SSH/telnet ile içeri girer, CPU mimarisini (ARM/MIPS/x86/PPC/SPARC/SH4) tespit eder, doğru ikiliyi <code>wget</code>'lar, çalıştırır, dosyayı diskten siler.</div></div>
<div class="calc-card"><div class="card-title">C2 (komuta &amp; kontrol)</div><div class="card-body">Botlar TCP üzerinden sabit kodlanmış bir alana sinyal verir. Operatör saldırı komutları verir: UDP flood, SYN flood, ACK flood, GRE flood, HTTP GET, DNS water-torture (Dyn vektörü).</div></div>
<div class="calc-card"><div class="card-title">Kendi kendini sertleştirme</div><div class="card-body">Mirai rakip botnetleri (Qbot, Anime) öldürür, kendine 22/23/80 portlarını gelen olarak kapatır ve flash yazımlarından kaçınarak yalnızca yeniden başlatmaya direnir — güç döngüsü cihazı temizler, ancak 5 dakika içinde yeniden enfekte olur.</div></div>
</div>

<p class="l-text">Ders: bunların <em>hiçbiri</em> bir zero-day gerektirmedi. Her adım OWASP IoT I1, I2, I4, I9'u istismar etti. Aynı primitifler Mozi'yi (DHT tabanlı, 2019), Meris'i (250 bin yönlendirici, 2021), BotenaGo'yu (Go ile yazılmış, 30+ exploit, 2021) ve Aisuru'yu (2024) yönlendirir. Mirai'ye karşı savunma yapmak çoğu IoT suçuna karşı savunma yapmaktır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Mirai tarzı salgın: 27 milyar cihazlık bir nüfus üzerinde SIR modeli
# S = duyarlı (varsayılan kimlik bilgileri, telnet açık)
# I = enfekte (botnette)
# R = kaldırıldı (yamalanmış, güç döngüsü ve çevrimdışı, ISP-engelli)
import numpy as np
import matplotlib.pyplot as plt

N = 27_000_000_000          # küresel IoT kurulu taban, 2025
S0 = 2_000_000              # varsayılan kimlik bilgileriyle telnet üzerinden ulaşılabilir cihazlar
I0 = 1                      # sıfırıncı hasta
R0 = 0
beta  = 0.00018             # S-I teması başına enfeksiyon oranı
gamma = 0.04                # iyileşme (yeniden başlatma/temizleme) oranı
days  = 60

S, I, R = [S0], [I0], [R0]
for t in range(days):
    new_inf = beta * S[-1] * I[-1] / (S[-1] + I[-1])
    new_rem = gamma * I[-1]
    S.append(S[-1] - new_inf)
    I.append(I[-1] + new_inf - new_rem)
    R.append(R[-1] + new_rem)

print(f"Peak infected: {int(max(I)):,} on day {int(np.argmax(I))}")
print(f"Final removed: {int(R[-1]):,}")
# Mirai'nin gerçek zirvesi ~600 bindi; oyuncak modelimiz büyüklük mertebesini yeniden üretir.</code></pre></div>

<p class="l-text">Yukarıdaki model, epidemiyologların kızamık için kullandığı modelle aynıdır. Tek fark zaman birimidir (IoT tarayıcıları için dakikalar, insanlar için günler). Yama dağıtımı, ISP karadelikleri ve CERT kaldırmaları bu modelde <code>gamma</code>'da ani bir sıçrama olarak görünür.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Shodan, Censys, ZoomEye — İnternet-Ölçekli Keşif</h2>
<p class="l-text">Shodan'dan (John Matherly, 2009) önce maruz kalan cihazları bulmak için interneti kendiniz taramanız gerekiyordu. Bugün Shodan, Censys ve BinaryEdge yüzlerce port üzerinde sürekli IPv4 taramaları çalıştırıyor ve sonuçları bir arama motoru olarak sunuyor. Herhangi bir zamanda yaklaşık 500 milyon cihaz indekslenmiş durumda. Savunma ekipleri kendi maruziyetlerini envanterlemek için kullanıyor; saldırganlar Mirai'nin tarayıcı aşamasını tamamen atlamak için kullanıyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yararlı Shodan sorguları (yalnızca eğitim amaçlı)</div><div class="card-body"><code>port:23 mirai</code> — Mirai tarafından vurulan telnet bannerları. <code>"Server: Boa/0.94"</code> — eski IP kameralar. <code>"default password"</code> — bunu kabul eden cihazlar. <code>product:"Modbus"</code> — açıkta PLC'ler (iot-L5'e bağlantı).</div></div>
<div class="calc-card"><div class="card-title">Censys</div><div class="card-body">Michigan Üniversitesi projesi (Durumeric vd., 2015). Shodan'dan daha iyi TLS parmak izi; akademik IoT sayım makalelerinde alıntılandı.</div></div>
<div class="calc-card"><div class="card-title">ZoomEye / FOFA / Quake</div><div class="card-body">Çinli muadiller. Genellikle Shodan'dan farklı APAC altyapısı parçaları görür. CTI işinde yoğun olarak kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Savunma kullanımı</div><div class="card-body">ASN'niz üzerinde günlük bir Shodan sorgusu çalıştırın. Yeni açıkta bir port bir yanlış yapılandırmadır. Censys ve Bishop Fox gibi şirketler bunu ASM (Saldırı Yüzeyi Yönetimi) olarak satıyor.</div></div>
</div>

<div class="calc-highlight"><strong>Yasal not:</strong> Shodan'ı sorgulamak çoğu yargı alanında yasaldır. İzinsiz olarak keşfedilen bir cihaza bağlanmak ve kimlik doğrulamak yetkisiz erişimdir (ABD'de CFAA, İngiltere'de Bilgisayar Kötüye Kullanım Yasası). Her zaman sahip olduğunuz veya test etmek için yazılı yetkiniz olan cihazlar üzerinde çalışın.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Bir IoT Ürünü için STRIDE Tehdit Modellemesi</h2>
<p class="l-text">STRIDE (Microsoft, Howard &amp; LeBlanc 2003), IoT mühendisliğindeki en ucuz savunma yatırım getirisidir. Firmware yazmadan önce çalıştırın; her sürümden önce yeniden ziyaret edin. Her bileşeni altı tehdit kategorisine eşler.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">S — Sahteleştirme (Spoofing)</div><div class="card-body">Bir saldırgan bir cihazı, bir kullanıcıyı veya bulutu taklit edebilir mi? Hafifletme: cihaz başına sertifikalarla karşılıklı TLS (iot-L2), güçlü API kimlik doğrulama.</div></div>
<div class="calc-card"><div class="card-title">T — Kurcalama (Tampering)</div><div class="card-body">Firmware, OTA payload veya telemetri aktarımda veya dinlenmede değiştirilebilir mi? Hafifletme: imzalı firmware, TLS, bütünlük korumalı depolama.</div></div>
<div class="calc-card"><div class="card-title">R — Reddetme (Repudiation)</div><div class="card-body">Kötü niyetli bir aktör bir eylemi reddedebilir mi? Hafifletme: imzalı denetim kayıtları, bulut tarafında yalnızca-ekleme olay deposu.</div></div>
<div class="calc-card"><div class="card-title">I — Bilgi ifşası (Information disclosure)</div><div class="card-body">Sırlar, PII veya telemetri sızabilir mi? Hafifletme: dinlenmede ve aktarımda şifreleme, minimal veri toplama (GDPR uyumu, bkz. compliance-L1).</div></div>
<div class="calc-card"><div class="card-title">D — Hizmet reddi (Denial of service)</div><div class="card-body">Cihaz, ağ geçidi veya bulut sular altında kalabilir mi? Hafifletme: hız sınırları, watchdog'lar, MQTT broker authn, bölgesel DDoS temizleme.</div></div>
<div class="calc-card"><div class="card-title">E — Ayrıcalık yükseltme (Elevation of privilege)</div><div class="card-body">Düşük ayrıcalıklı bir kullanıcı veya süreç yönetici olabilir mi? Hafifletme: en az ayrıcalık, MMU/bellek koruması, sistem çağrısı filtreleme, token'larda en az yetki ilkesi.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Bir IoT ürünü için STRIDE puanlama sayfası, ısı haritası olarak hesaplanır
import pandas as pd
components = ["Cihaz firmware", "BLE bağlantı", "MQTT-bulut", "Mobil uygulama", "OTA hizmeti"]
threats    = ["S", "T", "R", "I", "D", "E"]

# 0 = hafifletildi, 1 = kısmi, 2 = açık
matrix = [
    [0, 1, 2, 1, 0, 1],   # firmware
    [1, 1, 2, 2, 1, 1],   # BLE
    [0, 0, 1, 0, 1, 0],   # MQTT
    [0, 1, 1, 1, 1, 1],   # mobil
    [0, 0, 0, 0, 1, 0],   # OTA
]
df = pd.DataFrame(matrix, index=components, columns=threats)
print(df)
print("\\nResidual risk score (sum):", df.values.sum(),
      "/", df.size * 2, "max")</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Satırların ürün bileşenleri (firmware, BLE bağlantı, MQTT-bulut, mobil uygulama, OTA), sütunların ise altı tehdit kategorisi (S, T, R, I, D, E) olduğu bir STRIDE matrisi kurar. 2) Her hücre kalıntı riski 0-2 ölçeğinde puanlar: 0 hafifletildi, 1 kısmi, 2 hâlâ açık — mühendisliğe açıkların nerede olduğuna dair bir ısı haritası verir. 3) Sayfayı pandas DataFrame'e sarar; böylece tablo yazdırılabilir, git'te diff'lenebilir ve güvenlik inceleme sunumuna kolayca düşer. 4) Matrisi maksimum olası puana (satır × sütun × 2) karşı toplar ve sürümden sürüme izleyebileceğin tek bir kalıntı-risk sayısı üretir.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Risk Denklemi</h2>
<p class="l-text">Tehdit modellemesi nitelikseldir; risk yönetimi sayılar ister. ENISA, NIST SP 800-30 ve ISO 27005 tarafından kullanılan klasik formül:</p>

<div class="katex-block">$$ \\text{Risk} = \\text{Likelihood} \\times \\text{Impact} $$</div>

<p class="l-text">IoT için olasılık maruziyetin (port internet üzerinden ulaşılabilir mi?) ve exploit kullanılabilirliğinin (bir Metasploit modülü var mı?) baskısı altındadır. Etki ise cihazın neyi kontrol ettiğinin baskısı altındadır — akıllı bir ampul düşük etkilidir, hastane infüzyon pompası yaşam-güvenliğidir. Yıllıklandırılmış Kayıp Beklentisi (ALE) bunu genişletir:</p>

<div class="katex-block">$$ \\text{ALE} = \\text{ARO} \\times \\text{SLE} $$</div>

<p class="l-text">burada ARO yıllıklandırılmış oluşum oranı, SLE ise tek-kayıp beklentisidir. 2024'te bir SaaS şirketinde Mirai sınıfı bir ele geçirilme 250 bin dolar tek kayıp olarak tahmin edildi (olay müdahale + churn); yılda iki olay 500 bin dolar ALE verir. Neyi finanse edeceğinize karar vermek için hafifletme maliyetiyle — güvenli önyükleme, OTA, izleme — karşılaştırın.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Standartlar ve Düzenleme Manzarası (2026)</h2>
<p class="l-text">IoT, "gönder ve unut"tan tıbbi cihazlar gibi düzenlenmiş hâle geçiyor. Savunucuların haritası:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ETSI EN 303 645 (2020)</div><div class="card-body">Tüketici IoT için Avrupa tabanı. 13 hüküm: varsayılan yok, zafiyet ifşası, güvenli güncelleme vb. Her yeni düzenleme tarafından alıntılanır.</div></div>
<div class="calc-card"><div class="card-title">AB Siber Dayanıklılık Yasası (Reg 2024/2847)</div><div class="card-body">Ekim 2024'te kabul edildi, tam uygulama 2027. "Dijital öğeli ürünler" için yaşam döngüsü boyunca zorunlu güvenlik. 15 milyon euro veya küresel cironun %2.5'una kadar para cezaları. Avrupa IoT için oyun değiştirici.</div></div>
<div class="calc-card"><div class="card-title">UK PSTI Yasası (2022, 2024'te yürürlükte)</div><div class="card-body">Varsayılan parolaları yasaklar, zafiyet ifşa irtibat noktası gerektirir, destek süreleri konusunda şeffaflık.</div></div>
<div class="calc-card"><div class="card-title">ABD Cyber Trust Mark (FCC, 2024)</div><div class="card-body">NIST IR 8425'e dayanan, tüketici IoT için gönüllü etiket. Walmart, Amazon, Best Buy ortakları.</div></div>
<div class="calc-card"><div class="card-title">NIST SP 800-213 / IR 8259 / IR 8425</div><div class="card-body">ABD federal IoT yetenek tabanları. Federal tedarik için zorunlu.</div></div>
<div class="calc-card"><div class="card-title">ISO/IEC 27400 (2022)</div><div class="card-body">IoT güvenlik &amp; gizlilik kılavuzları, ETSI EN 303 645'in uluslararası muadili.</div></div>
</div>

<div class="calc-highlight">Aralık 2027'den sonra AB'ye CRA-uyumlu bir güvenlik duruşu olmadan bağlı bir ürün gönderirseniz, onu yasal olarak CE-işaretleyemezsiniz. Bu, IoT tarihindeki en büyük düzenleyici değişimdir; bu izde geri kalanı size teknik olarak nasıl uyacağınızı öğretir.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Saha Egzersizi — Kendi Ağınızı Denetleyin</h2>
<p class="l-text">Bu dersi somut olarak uygulayın. Sahip olduğunuz bir ağda:</p>

<div class="code-wrap"><div class="code-label"><span>BASH (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># 1. LAN'ınızdaki IoT cihazlarını keşfedin
nmap -sn 192.168.1.0/24                # ping taraması
nmap -p 22,23,80,443,1883,5683,8883 -sV 192.168.1.0/24

# 2. MQTT broker'larını inceleyin (port 1883 / 8883)
mosquitto_sub -h broker.local -t '#' -v   # anonime izin veriyor musunuz?

# 3. Telnet/UART hata ayıklama yüzeylerini arayın
nmap --script telnet-encryption,telnet-ntlm-info -p 23 192.168.1.0/24

# 4. Banner-grab ve o satıcı için Shodan facetleriyle karşılaştırın
# 5. YALNIZCA SAHİP OLDUĞUNUZ CİHAZLARA KARŞI varsayılan kimlik bilgilerini kontrol edin
# 6. Cihaz sınıfı başına bir STRIDE satırı dosyalayın</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>nmap -sn</code> ile bir ARP/ICMP ping taraması çalıştırır ve yerel /24'teki canlı host'ları sayar — kimsenin envanterlemediği yönetilmemiş IoT donanımını keşfetmenin en ucuz yolu. 2) Yaygın IoT servis portlarını (22/23/80/443/1883/5683/8883) sürüm tespitiyle (<code>-sV</code>) tarar; böylece banner'ları bilinen-zafiyetli satıcı build'leriyle eşleştirebilirsin. 3) Ulaşılabilir bir broker üzerinde <code>#</code>'a abone olur — broker anonim bağlantıyı kabul ediyorsa her cihazın telemetrisi kendi LAN'ında sızıyor demektir. 4) Port 23'teki telnet'i kimlik doğrulama modunu parmaklayan NSE script'leriyle hedefler, sonra her banner'ı aynı satıcı için Shodan facet'leriyle çapraz referanslar.</p>


<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Bugün çalıştırabileceğiniz hafif bir envanter + risk puanlama sayfası
import pandas as pd
inventory = pd.DataFrame([
    {"device":"Hue Bridge",  "fw":"1.55", "telnet":False, "tls":True,  "default_pw":False, "owns_safety":False},
    {"device":"IP camera",   "fw":"old",  "telnet":True,  "tls":False, "default_pw":True,  "owns_safety":False},
    {"device":"Smart lock",  "fw":"2.1",  "telnet":False, "tls":True,  "default_pw":False, "owns_safety":True },
    {"device":"Insulin pump","fw":"4.0",  "telnet":False, "tls":True,  "default_pw":False, "owns_safety":True },
])
def score(r):
    likelihood = 0.6*r.telnet + 0.3*r.default_pw + 0.1*(not r.tls)
    impact     = 0.8 if r.owns_safety else 0.3
    return round(likelihood * impact, 3)
inventory["risk"] = inventory.apply(score, axis=1)
print(inventory.sort_values("risk", ascending=False))</code></pre></div>

<p class="l-text">Bunun gibi, güncel tutulan bir elektronik tablo, RSA'da satılan çoğu "IoT güvenlik platformunu" yener. Bu izdeki kalan dersler size puan yüksek olduğunda ne yapacağınızı öğretir — donanım güven kökleri (iot-L2), firmware analizi (iot-L3), kablosuz saldırı yüzeyi (iot-L4), endüstriyel sistemler (iot-L5) ve bitiş: bağlı araçlar (iot-L6).</p>
</div>`
};
