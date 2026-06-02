window.IOT_L5 = {
en: `<p class="l-text"><strong>Industrial Control Systems are where bits become physics.</strong> A misconfigured router degrades a Slack call; a misconfigured PLC spins a centrifuge to destruction, opens a pipeline valve, or stops a chiller pump. The discipline known as <strong>OT (Operational Technology)</strong> security exploded into public consciousness with <strong>Stuxnet</strong> (discovered June 2010 by Symantec / Kaspersky / VirusBlokAda), the first publicly known cyberweapon to cause real-world physical destruction — sabotaging the IR-1 centrifuges at Iran's Natanz uranium-enrichment plant by abusing two Siemens S7-300 PLC types via four zero-days, with the malware hidden behind two stolen JMicron and Realtek code-signing certificates. From that moment, "air-gapped" stopped being a synonym for "safe".</p>

<p class="l-text">In this lesson we cover the OT landscape: the <strong>Purdue Reference Model</strong> (Williams, 1989/1992) for ICS network architecture, the protocols you will meet (<strong>Modbus TCP</strong>, <strong>DNP3</strong>, <strong>OPC UA</strong>, <strong>S7Comm</strong>, <strong>EtherNet/IP</strong>, <strong>BACnet</strong>), how PLCs are programmed (IEC 61131-3 — Ladder Logic, Structured Text, Function Block), the major attacks (<strong>Stuxnet 2010</strong>, <strong>BlackEnergy/Industroyer Ukraine 2015–2016</strong>, <strong>Triton/TRISIS Saudi Arabia 2017</strong>), and the modern defenses (network segmentation, IEC 62443, Claroty/Dragos/Nozomi). We finish with two runnable Python demos: a Modbus TCP frame parser, and a "Stuxnet-lite" PLC simulator showing how subtle integer manipulation produces real-world damage.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Purdue Reference Model: Levels 0–5, the trust boundaries that segment OT from IT</li>
<li>The major protocols: Modbus TCP (insecure by design), DNP3 (with optional Secure Auth), OPC UA (modern, signed)</li>
<li>How PLCs are programmed: Ladder Logic, Structured Text, IEC 61131-3</li>
<li>Stuxnet 2010 in detail: 4 zero-days, S7-300/400 targeting, Symantec's W32.Stuxnet dossier</li>
<li>Triton/TRISIS (2017): the first malware targeting Safety Instrumented Systems (Triconex SIS)</li>
<li>Defenses: IEC 62443, network diodes, OT-specific IDS (Dragos, Nozomi, Claroty)</li>
<li>Build a Modbus frame parser and a PLC counter-sabotage simulator</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Purdue Reference Model</h2>
<p class="l-text">Theodore J. Williams's 1989 reference architecture remains the dominant mental model for OT network design. Six levels, increasing in abstraction; trust boundaries between L3.5 and below.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Level 0 — Physical process</div><div class="card-body">Sensors, actuators, motors, valves, pumps. Pure analog and digital I/O.</div></div>
<div class="calc-card"><div class="card-title">Level 1 — Basic Control</div><div class="card-body">PLCs, RTUs (Remote Terminal Units), IEDs. Read sensors, drive actuators, run ladder logic.</div></div>
<div class="calc-card"><div class="card-title">Level 2 — Area Supervisory</div><div class="card-body">HMIs (Human-Machine Interfaces), SCADA, local engineering workstations. Operators look at process here.</div></div>
<div class="calc-card"><div class="card-title">Level 3 — Site Operations</div><div class="card-body">Plant historian, batch management, MES (Manufacturing Execution System). Aggregates many lines.</div></div>
<div class="calc-card"><div class="card-title">Level 3.5 — DMZ</div><div class="card-body">The crucial zone. Jump servers, AV update mirrors, patch caches. The bridge IT↔OT must cross here.</div></div>
<div class="calc-card"><div class="card-title">Levels 4–5 — Corporate IT</div><div class="card-body">Email, ERP, internet. Where Stuxnet entered (USB) and where most modern intrusions still originate.</div></div>
</div>

<div class="calc-highlight">"Air-gap" in 2026 is mostly a myth. Engineering laptops, USB sticks, vendor remote access, and cloud telemetry penetrate the Purdue boundary almost everywhere. Modern defense is "defense in depth" — micro-segmentation, allow-listed flows, anomaly detection.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Protocols You Will Actually See</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Modbus TCP (port 502)</div><div class="card-body">1979 RS-485 protocol moved to TCP. No auth, no crypto. Function codes: 1=read coils, 3=read holding registers, 5=write single coil, 16=write multiple registers. The simplest possible ICS protocol — and the most attacked.</div></div>
<div class="calc-card"><div class="card-title">DNP3 (port 20000)</div><div class="card-body">North American electric utility favorite. Object-oriented data model, time-stamped events, "Secure Authentication" (DNP3-SA) optional add-on with HMAC.</div></div>
<div class="calc-card"><div class="card-title">OPC UA (port 4840)</div><div class="card-body">Modern (2008+) replacement for OPC Classic. X.509-based auth, encryption (Basic256Sha256 etc.), platform-neutral. Industry pushing this as the future.</div></div>
<div class="calc-card"><div class="card-title">S7Comm / S7Plus (port 102)</div><div class="card-body">Siemens proprietary. S7-300/400 used S7Comm (Stuxnet target). S7-1500 uses S7Plus with TLS-equivalent integrity by default.</div></div>
<div class="calc-card"><div class="card-title">EtherNet/IP + CIP (port 44818)</div><div class="card-body">Allen-Bradley / Rockwell. Used widely in U.S. discrete manufacturing.</div></div>
<div class="calc-card"><div class="card-title">BACnet (port 47808 UDP)</div><div class="card-body">Building Automation. HVAC, lighting, access control. Largely unauthenticated.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. A Modbus TCP Frame Parser in Python</h2>
<p class="l-text">Modbus TCP is the simplest protocol you'll encounter — 7-byte MBAP header + the payload. Below: parse a "Read Holding Registers" request and the response. Real production tools (libmodbus, pymodbus) wrap exactly this.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import struct

# MBAP header: TransactionId(2), ProtocolId(2)=0, Length(2), UnitId(1)
# Followed by Function Code (1) + protocol-specific payload

def parse_modbus_tcp(buf):
    txid, proto, length, unit, fc = struct.unpack("&gt;HHHBB", buf[:8])
    payload = buf[8:8+length-2]
    return {"txid":txid,"proto":proto,"length":length,"unit":unit,"fc":fc,"payload":payload}

def encode_read_holding_regs(txid, unit, start_addr, count):
    payload = struct.pack("&gt;HH", start_addr, count)
    length  = 1 + 1 + len(payload)         # unit + fc + payload
    return struct.pack("&gt;HHHBB", txid, 0, length, unit, 0x03) + payload

def encode_response_read_holding(txid, unit, regs):
    payload = struct.pack("&gt;B", 2*len(regs)) + b"".join(struct.pack("&gt;H", r) for r in regs)
    length  = 1 + 1 + len(payload)
    return struct.pack("&gt;HHHBB", txid, 0, length, unit, 0x03) + payload

# Build a request: read registers 100..103 from unit 1
req = encode_read_holding_regs(txid=0x1234, unit=1, start_addr=100, count=4)
print("REQ:", req.hex(" "))

# Server response with values [42, 1500, 8, 0xFFFF]
resp = encode_response_read_holding(txid=0x1234, unit=1, regs=[42,1500,8,0xFFFF])
print("RSP:", resp.hex(" "))

# Parse them back
print("\\nParsed REQ:", parse_modbus_tcp(req))
parsed = parse_modbus_tcp(resp)
nbytes = parsed["payload"][0]
regs = struct.unpack(f"&gt;{nbytes//2}H", parsed["payload"][1:1+nbytes])
print(f"Parsed RSP regs: {regs}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Connects to an MQTT broker (Mosquitto, EMQX, AWS IoT Core, Azure IoT Hub) — use TLS (port 8883) ALWAYS, plain 1883 only on isolated lab networks. 2) Authenticates via username/password OR (preferred) X.509 client certificate — per-device cert lets you revoke a single compromised gadget without rotating the whole fleet. 3) Publishes to a topic with a QoS level: 0 fire-and-forget, 1 at-least-once (default for telemetry), 2 exactly-once (rare, expensive). 4) Subscribes the cloud side with topic ACLs so device A cannot read device B's stream — without ACLs, one rooted device sees everyone's data.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. PLCs and Ladder Logic</h2>
<p class="l-text">A <strong>PLC</strong> (Programmable Logic Controller) cycles forever: read inputs → compute logic → write outputs → repeat. Each cycle (the "scan") is &lt; 50 ms typically. Programs are written in <strong>IEC 61131-3</strong> languages — Ladder Diagram (relay-style), Structured Text (Pascal-flavored), Function Block, Sequential Function Chart, Instruction List. Engineering tools: Siemens TIA Portal, Rockwell Studio 5000, Schneider EcoStruxure.</p>

<div class="calc-highlight">Ladder logic <em>looks</em> like wiring diagrams: power flows left-to-right through "rungs" with contacts (input conditions) and coils (outputs). It is intentionally readable by electricians, who comprise much of the OT engineering workforce.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Stuxnet — The 2010 Watershed</h2>
<p class="l-text">Discovered: June 2010 (VirusBlokAda, Belarus). Length of operation: at least 2007–2010. Targets: Siemens S7-315 and S7-417 PLCs controlling Vacon and Fararo Paya frequency converters running at the specific RPM of an IR-1 gas centrifuge. Mechanism: <em>infected the engineering Step7 software</em> on PCs that programmed the PLCs, then transparently inserted malicious blocks while showing the engineer the original ladder logic.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zero-days used (4)</div><div class="card-body">CVE-2010-2568 (.lnk shell auto-exec), CVE-2010-2729 (Print Spooler), CVE-2010-2743 (privilege escalation), CVE-2010-2772 (Step7 hardcoded DB password).</div></div>
<div class="calc-card"><div class="card-title">Stolen certificates</div><div class="card-body">Realtek and JMicron code-signing certificates from Hsinchu Science Park, Taiwan. Used to sign rootkit drivers — defeated AV.</div></div>
<div class="calc-card"><div class="card-title">Sabotage logic</div><div class="card-body">Periodically commanded centrifuge speed up to 1410 Hz then down to 2 Hz, while reporting normal 1064 Hz back to the SCADA. Mechanical stress destroyed centrifuges.</div></div>
<div class="calc-card"><div class="card-title">Targeting</div><div class="card-body">Only activated if it found exactly the right PLC type, the right configuration of cascaded centrifuges, and a specific Step7 project name.</div></div>
<div class="calc-card"><div class="card-title">Damage</div><div class="card-body">~1000 of Iran's ~5000 IR-1 centrifuges destroyed; nuclear program set back ~2 years (Albright et al., ISIS).</div></div>
<div class="calc-card"><div class="card-title">Symantec Dossier</div><div class="card-body">Falliere, Murchu, Chien, "W32.Stuxnet Dossier" v1.4 (Feb 2011). Still the canonical reverse-engineering writeup.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. A Stuxnet-Lite PLC Simulator</h2>
<p class="l-text">We can capture the conceptual core of Stuxnet in 30 lines: a PLC counter that controls a "centrifuge speed", a "SCADA reading" that the operator sees, and a malicious payload that sometimes pushes the speed to a destructive value while reporting the nominal value back. The lesson: physical safety must not be assumed from the PLC's own self-report.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import random
random.seed(42)

class Centrifuge:
    NOMINAL_HZ = 1064; DAMAGE_HZ_LOW = 2; DAMAGE_HZ_HIGH = 1410
    DAMAGE_PER_SECOND_AT_HIGH = 0.5
    DAMAGE_PER_SECOND_AT_LOW  = 0.2
    def __init__(self, id_):
        self.id = id_; self.speed = 0; self.health = 100.0
    def tick(self):
        if self.speed &gt;= self.DAMAGE_HZ_HIGH:
            self.health -= self.DAMAGE_PER_SECOND_AT_HIGH
        elif self.speed &lt;= self.DAMAGE_HZ_LOW:
            self.health -= self.DAMAGE_PER_SECOND_AT_LOW

class PLC:
    """Honest engineer programs: keep at NOMINAL_HZ. Stuxnet-style payload sabotages."""
    def __init__(self, c, sabotage=False):
        self.c = c; self.sabotage = sabotage; self.tick_count = 0
    def scan(self):
        self.tick_count += 1
        # Engineer's intended logic
        intended_speed = Centrifuge.NOMINAL_HZ
        actual_speed   = intended_speed
        # Stuxnet payload: every ~27 days briefly overspeed/underspeed
        if self.sabotage:
            if 100 &lt; (self.tick_count % 200) &lt; 110:
                actual_speed = Centrifuge.DAMAGE_HZ_HIGH
            elif 130 &lt; (self.tick_count % 200) &lt; 140:
                actual_speed = Centrifuge.DAMAGE_HZ_LOW
        self.c.speed = actual_speed
        # Report to SCADA: ALWAYS the nominal value (the lie)
        return Centrifuge.NOMINAL_HZ if self.sabotage else actual_speed
    def operator_view(self): return self.scan()

# Run two scenarios
def run(sabotage):
    c   = Centrifuge(1)
    plc = PLC(c, sabotage=sabotage)
    for t in range(2000):
        reported = plc.operator_view()
        c.tick()
    return c.health

print(f"Health after 2000 scans, no sabotage:    {run(sabotage=False):.1f}")
print(f"Health after 2000 scans, Stuxnet-style:  {run(sabotage=True):.1f}")
print("\\nThe operator's screen showed 1064 Hz the WHOLE TIME in both cases.")
print("Only physical inspection (vibration, mass spec) reveals the damage.")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds firmware for an embedded target (ESP32, nRF52, STM32) — toolchain produces a signed binary; signature verification is enforced by the bootloader (secure boot). 2) Secure boot chain: ROM → first-stage bootloader (immutable, eFuse-locked public key) → app — break any link and the device boots only authentic firmware. 3) OTA update path: download signed image to secondary slot, verify signature + version (anti-rollback eFuse counter), swap-and-reboot, fallback if first boot fails. 4) Encrypted flash (AES-XTS via efused key) protects against physical chip-off attacks; combine with anti-tamper (mesh, sensors) for high-value devices.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same Stuxnet-lite simulation. Adjust DAMAGE_HZ thresholds or sabotage windows to see how subtle the sabotage can be while remaining catastrophic.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>NOM, HI, LO = 1064, 1410, 2
def run(sabotage):
    health = 100.0; speed = 0
    for t in range(2000):
        speed = NOM
        if sabotage:
            if 100 &lt; (t%200) &lt; 110: speed = HI
            if 130 &lt; (t%200) &lt; 140: speed = LO
        if speed &gt;= HI: health -= 0.5
        elif speed &lt;= LO: health -= 0.2
        # operator always sees NOM
    return round(health, 1)

print("Honest:  health =", run(False))
print("Stuxnet: health =", run(True))
print("Operator screen shows 1064 Hz both runs.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Industroyer / CRASHOVERRIDE and Triton/TRISIS</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BlackEnergy → Industroyer (Ukraine 2015 / 2016)</div><div class="card-body">Ukraine power grid attacks. Dec 23, 2015: 230k people without power for hours. Industroyer (2016) was the first malware framework with native ICS protocol modules (IEC 60870-5-101/104, IEC 61850, OPC DA).</div></div>
<div class="calc-card"><div class="card-title">Triton / TRISIS (2017)</div><div class="card-body">First malware ever to target a Safety Instrumented System — Schneider Triconex SIS at a Saudi petrochemical plant. Goal: disable safety interlocks so a separate ICS attack could cause physical damage. Operator caught it because the SIS faulted and stopped the plant. Attribution: Russia's TsNIIKhM.</div></div>
<div class="calc-card"><div class="card-title">CRASHOVERRIDE / Industroyer2 (2022)</div><div class="card-body">Recurrence in Ukraine 2022 wartime. Sandworm again.</div></div>
<div class="calc-card"><div class="card-title">PIPEDREAM / INCONTROLLER (2022)</div><div class="card-body">CISA-disclosed framework targeting Schneider, Omron PLCs — the most ICS-comprehensive toolkit publicly seen.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Defense — IEC 62443, Diodes, and OT-IDS</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IEC 62443</div><div class="card-body">The international ICS security standard family. Zones, conduits, security levels (SL1-SL4). Increasingly mandated by regulation (EU NIS2, US TSA pipeline directive).</div></div>
<div class="calc-card"><div class="card-title">Network diodes</div><div class="card-body">One-way hardware (Owl, Waterfall) for OT → IT data export. Physically prevent reverse flow. Used at high-stakes facilities.</div></div>
<div class="calc-card"><div class="card-title">OT-IDS</div><div class="card-body">Dragos, Nozomi Networks, Claroty, Forescout — passive monitors that learn the protocol baselines (Modbus reads to register X always at 1 Hz) and alert on deviations.</div></div>
<div class="calc-card"><div class="card-title">Engineering workstation hardening</div><div class="card-body">Stuxnet's primary lateral was the engineer's PC. App-allow-listing, USB-port lockdown, vendor remote-access through bastions.</div></div>
<div class="calc-card"><div class="card-title">Hash-checked PLC programs</div><div class="card-body">Periodically verify the PLC's running program matches the engineer's gold copy — Stuxnet hid changes by intercepting the upload.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Purdue: 6 levels with the L3.5 DMZ as the IT/OT boundary.</li>
<li>Modbus is unauthenticated; DNP3-SA and OPC UA add real cryptography.</li>
<li>Stuxnet (2010): 4 zero-days, 2 stolen certs, hid sabotage from operator screens.</li>
<li>Triton (2017): first SIS-targeting malware; safety systems are now in scope.</li>
<li>IEC 62443 + OT-IDS (Dragos/Nozomi/Claroty) are the modern defense baseline.</li>
</ul>
</div>
<p class="l-text">Final IoT capstone next: <strong>iot-L6</strong> — Connected and Autonomous Vehicle Security: CAN bus, V2X, sensor spoofing, ISO/SAE 21434.</p>
</div>`,
tr: `<p class="l-text"><strong>Endüstriyel Kontrol Sistemleri, bitlerin fiziğe dönüştüğü yerdir.</strong> Yanlış yapılandırılmış bir yönlendirici bir Slack çağrısını bozar; yanlış yapılandırılmış bir PLC bir santrifüjü yıkıma kadar döndürür, bir boru hattı vanasını açar veya bir soğutucu pompayı durdurur. <strong>OT (Operasyonel Teknoloji)</strong> güvenliği olarak bilinen disiplin, ilk kamuya bilinen gerçek dünya fiziksel yıkımına neden olan siber silah olan <strong>Stuxnet</strong> (Haziran 2010'da Symantec / Kaspersky / VirusBlokAda tarafından keşfedildi) ile kamu bilincine patladı — İran'ın Natanz uranyum zenginleştirme tesisindeki IR-1 santrifüjlerini iki Siemens S7-300 PLC türünü dört zero-day aracılığıyla istismar ederek sabote etti, zararlı yazılım iki çalınmış JMicron ve Realtek kod-imzalama sertifikasının arkasına gizlendi. O andan itibaren, "hava-boşluklu" "güvenli"nin eş anlamlısı olmaktan çıktı.</p>

<p class="l-text">Bu derste OT manzarasını ele alıyoruz: ICS ağ mimarisi için <strong>Purdue Referans Modeli</strong> (Williams, 1989/1992), karşılaşacağınız protokoller (<strong>Modbus TCP</strong>, <strong>DNP3</strong>, <strong>OPC UA</strong>, <strong>S7Comm</strong>, <strong>EtherNet/IP</strong>, <strong>BACnet</strong>), PLC'lerin nasıl programlandığı (IEC 61131-3 — Ladder Logic, Structured Text, Function Block), büyük saldırılar (<strong>Stuxnet 2010</strong>, <strong>BlackEnergy/Industroyer Ukrayna 2015–2016</strong>, <strong>Triton/TRISIS Suudi Arabistan 2017</strong>) ve modern savunmalar (ağ segmentasyonu, IEC 62443, Claroty/Dragos/Nozomi). İki çalıştırılabilir Python demosu ile bitiriyoruz: bir Modbus TCP frame ayrıştırıcısı ve ince tam sayı manipülasyonunun gerçek dünya hasarı nasıl ürettiğini gösteren bir "Stuxnet-lite" PLC simülatörü.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Purdue Referans Modeli: Seviye 0–5, OT'yi IT'den segmentleyen güven sınırları</li>
<li>Büyük protokoller: Modbus TCP (tasarım gereği güvensiz), DNP3 (isteğe bağlı Secure Auth ile), OPC UA (modern, imzalı)</li>
<li>PLC'lerin nasıl programlandığı: Ladder Logic, Structured Text, IEC 61131-3</li>
<li>Stuxnet 2010 ayrıntılı: 4 zero-day, S7-300/400 hedefleme, Symantec'in W32.Stuxnet dosyası</li>
<li>Triton/TRISIS (2017): Güvenlik Enstrümante Sistemlerini (Triconex SIS) hedefleyen ilk zararlı yazılım</li>
<li>Savunmalar: IEC 62443, ağ diyotları, OT'ye özgü IDS (Dragos, Nozomi, Claroty)</li>
<li>Bir Modbus frame ayrıştırıcısı ve bir PLC karşı-sabotaj simülatörü oluşturun</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Purdue Referans Modeli</h2>
<p class="l-text">Theodore J. Williams'ın 1989 referans mimarisi, OT ağ tasarımı için baskın zihinsel model olmaya devam ediyor. Soyutlamada artan altı seviye; L3.5 ve altı arasında güven sınırları.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Seviye 0 — Fiziksel süreç</div><div class="card-body">Sensörler, eyleyiciler, motorlar, vanalar, pompalar. Saf analog ve dijital I/O.</div></div>
<div class="calc-card"><div class="card-title">Seviye 1 — Temel Kontrol</div><div class="card-body">PLC'ler, RTU'lar (Remote Terminal Units), IED'ler. Sensörleri okur, eyleyicileri sürer, ladder logic çalıştırır.</div></div>
<div class="calc-card"><div class="card-title">Seviye 2 — Alan Denetimi</div><div class="card-body">HMI'ler (İnsan-Makine Arayüzleri), SCADA, yerel mühendislik iş istasyonları. Operatörler süreci burada izler.</div></div>
<div class="calc-card"><div class="card-title">Seviye 3 — Saha Operasyonları</div><div class="card-body">Tesis tarihçisi, parti yönetimi, MES (Manufacturing Execution System). Birçok hattı toplar.</div></div>
<div class="calc-card"><div class="card-title">Seviye 3.5 — DMZ</div><div class="card-body">Önemli bölge. Atlama sunucuları, AV güncelleme aynaları, yama önbellekleri. IT↔OT köprüsü burayı geçmek zorundadır.</div></div>
<div class="calc-card"><div class="card-title">Seviye 4–5 — Kurumsal IT</div><div class="card-body">E-posta, ERP, internet. Stuxnet'in girdiği (USB) ve modern saldırıların çoğunun hâlâ kaynaklandığı yer.</div></div>
</div>

<div class="calc-highlight">2026'da "hava-boşluğu" çoğunlukla bir efsanedir. Mühendislik dizüstüleri, USB çubuklar, satıcı uzaktan erişim ve bulut telemetrisi neredeyse her yerde Purdue sınırına nüfuz eder. Modern savunma "derinlemesine savunmadır" — mikro-segmentasyon, izin listeli akışlar, anomali tespiti.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Aslında Göreceğiniz Protokoller</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Modbus TCP (port 502)</div><div class="card-body">1979 RS-485 protokolü TCP'ye taşındı. Auth yok, kripto yok. Fonksiyon kodları: 1=coil oku, 3=holding register oku, 5=tek coil yaz, 16=birden çok register yaz. Mümkün olan en basit ICS protokolü — ve en çok saldırıya uğrayan.</div></div>
<div class="calc-card"><div class="card-title">DNP3 (port 20000)</div><div class="card-body">Kuzey Amerika elektrik kamu hizmeti favorisi. Nesne yönelimli veri modeli, zaman damgalı olaylar, HMAC ile isteğe bağlı "Secure Authentication" (DNP3-SA) eklentisi.</div></div>
<div class="calc-card"><div class="card-title">OPC UA (port 4840)</div><div class="card-body">OPC Classic için modern (2008+) alternatif. X.509 tabanlı auth, şifreleme (Basic256Sha256 vb.), platform-bağımsız. Endüstri bunu gelecek olarak itiyor.</div></div>
<div class="calc-card"><div class="card-title">S7Comm / S7Plus (port 102)</div><div class="card-body">Siemens özel. S7-300/400 S7Comm kullandı (Stuxnet hedefi). S7-1500 varsayılan olarak TLS-eşdeğeri bütünlük ile S7Plus kullanır.</div></div>
<div class="calc-card"><div class="card-title">EtherNet/IP + CIP (port 44818)</div><div class="card-body">Allen-Bradley / Rockwell. ABD ayrık üretiminde yaygın olarak kullanılır.</div></div>
<div class="calc-card"><div class="card-title">BACnet (port 47808 UDP)</div><div class="card-body">Bina Otomasyonu. HVAC, aydınlatma, erişim kontrolü. Büyük ölçüde kimliği doğrulanmamış.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Python'da Bir Modbus TCP Frame Ayrıştırıcısı</h2>
<p class="l-text">Modbus TCP, karşılaşacağınız en basit protokoldür — 7-baytlık MBAP başlığı + payload. Aşağıda: bir "Read Holding Registers" isteğini ve yanıtı ayrıştırın. Gerçek üretim araçları (libmodbus, pymodbus) tam olarak bunu sarar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import struct

# MBAP başlığı: TransactionId(2), ProtocolId(2)=0, Length(2), UnitId(1)
# Sonra Function Code (1) + protokole özgü payload

def parse_modbus_tcp(buf):
    txid, proto, length, unit, fc = struct.unpack("&gt;HHHBB", buf[:8])
    payload = buf[8:8+length-2]
    return {"txid":txid,"proto":proto,"length":length,"unit":unit,"fc":fc,"payload":payload}

def encode_read_holding_regs(txid, unit, start_addr, count):
    payload = struct.pack("&gt;HH", start_addr, count)
    length  = 1 + 1 + len(payload)         # unit + fc + payload
    return struct.pack("&gt;HHHBB", txid, 0, length, unit, 0x03) + payload

def encode_response_read_holding(txid, unit, regs):
    payload = struct.pack("&gt;B", 2*len(regs)) + b"".join(struct.pack("&gt;H", r) for r in regs)
    length  = 1 + 1 + len(payload)
    return struct.pack("&gt;HHHBB", txid, 0, length, unit, 0x03) + payload

# Bir istek oluştur: unit 1'den 100..103 register'larını oku
req = encode_read_holding_regs(txid=0x1234, unit=1, start_addr=100, count=4)
print("REQ:", req.hex(" "))

# [42, 1500, 8, 0xFFFF] değerleri ile sunucu yanıtı
resp = encode_response_read_holding(txid=0x1234, unit=1, regs=[42,1500,8,0xFFFF])
print("RSP:", resp.hex(" "))

# Geri ayrıştır
print("\\nParsed REQ:", parse_modbus_tcp(req))
parsed = parse_modbus_tcp(resp)
nbytes = parsed["payload"][0]
regs = struct.unpack(f"&gt;{nbytes//2}H", parsed["payload"][1:1+nbytes])
print(f"Parsed RSP regs: {regs}")
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Bir MQTT broker'a bağlanır (Mosquitto, EMQX, AWS IoT Core, Azure IoT Hub) — HER ZAMAN TLS (port 8883) kullan, açık 1883 sadece izole laboratuvar ağında. 2) Username/password ile VEYA (tercih edilen) X.509 client sertifikası ile kimlik doğrular — cihaz başına sertifika tek ele geçirilmiş cihazı tüm filoyu döndürmeden iptal etmenizi sağlar. 3) Bir topic'e QoS seviyesiyle yayınlar: 0 fire-and-forget, 1 en-az-bir-kere (telemetri için default), 2 tam-bir-kere (nadir, pahalı). 4) Bulut tarafında topic ACL ile abone olun — cihaz A cihaz B'nin stream'ini okuyamasın; ACL olmazsa root'lanmış bir cihaz herkesin verisini görür.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. PLC'ler ve Ladder Logic</h2>
<p class="l-text">Bir <strong>PLC</strong> (Programlanabilir Mantık Denetleyicisi) sonsuza kadar döner: girişleri oku → mantığı hesapla → çıkışları yaz → tekrarla. Her döngü ("scan") tipik olarak &lt; 50 ms'dir. Programlar <strong>IEC 61131-3</strong> dillerinde yazılır — Ladder Diagram (röle-tarzı), Structured Text (Pascal-aromalı), Function Block, Sequential Function Chart, Instruction List. Mühendislik araçları: Siemens TIA Portal, Rockwell Studio 5000, Schneider EcoStruxure.</p>

<div class="calc-highlight">Ladder logic kablolama diyagramları gibi <em>görünür</em>: güç soldan sağa "rung"lar arasında kontaklarla (giriş koşulları) ve coil'lerle (çıkışlar) akar. OT mühendislik iş gücünün çoğunu oluşturan elektrikçiler tarafından kasıtlı olarak okunabilirdir.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Stuxnet — 2010 Dönüm Noktası</h2>
<p class="l-text">Keşfedildi: Haziran 2010 (VirusBlokAda, Belarus). Operasyon süresi: en az 2007–2010. Hedefler: Bir IR-1 gaz santrifüjünün belirli RPM'inde çalışan Vacon ve Fararo Paya frekans dönüştürücülerini kontrol eden Siemens S7-315 ve S7-417 PLC'ler. Mekanizma: PLC'leri programlayan PC'lerdeki <em>mühendislik Step7 yazılımını enfekte etti</em>, sonra mühendise orijinal ladder logic'i gösterirken şeffaf bir şekilde kötü niyetli bloklar ekledi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kullanılan zero-day'ler (4)</div><div class="card-body">CVE-2010-2568 (.lnk shell otomatik yürütme), CVE-2010-2729 (Print Spooler), CVE-2010-2743 (ayrıcalık yükseltme), CVE-2010-2772 (Step7 sabit kodlanmış DB parolası).</div></div>
<div class="calc-card"><div class="card-title">Çalınmış sertifikalar</div><div class="card-body">Hsinchu Bilim Parkı, Tayvan'dan Realtek ve JMicron kod-imzalama sertifikaları. Rootkit sürücülerini imzalamak için kullanıldı — AV'yi yendi.</div></div>
<div class="calc-card"><div class="card-title">Sabotaj mantığı</div><div class="card-body">Periyodik olarak santrifüj hızını 1410 Hz'ye çıkardı ve sonra 2 Hz'ye indirdi, SCADA'ya normal 1064 Hz geri raporlarken. Mekanik stres santrifüjleri yok etti.</div></div>
<div class="calc-card"><div class="card-title">Hedefleme</div><div class="card-body">Yalnızca tam doğru PLC türünü, doğru kademe santrifüj yapılandırmasını ve belirli bir Step7 proje adını bulursa etkinleştirildi.</div></div>
<div class="calc-card"><div class="card-title">Hasar</div><div class="card-body">İran'ın ~5000 IR-1 santrifüjünden ~1000'i yok edildi; nükleer program ~2 yıl gerilete (Albright vd., ISIS).</div></div>
<div class="calc-card"><div class="card-title">Symantec Dosyası</div><div class="card-body">Falliere, Murchu, Chien, "W32.Stuxnet Dossier" v1.4 (Şub 2011). Hâlâ kanonik tersine mühendislik yazısı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Bir Stuxnet-Lite PLC Simülatörü</h2>
<p class="l-text">Stuxnet'in kavramsal özünü 30 satırda yakalayabiliriz: bir "santrifüj hızı"nı kontrol eden bir PLC sayacı, operatörün gördüğü bir "SCADA okuması" ve bazen hızı yıkıcı bir değere iten ancak nominal değeri geri raporlayan kötü niyetli bir payload. Ders: fiziksel güvenlik PLC'nin kendi öz-raporundan varsayılmamalıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import random
random.seed(42)

class Centrifuge:
    NOMINAL_HZ = 1064; DAMAGE_HZ_LOW = 2; DAMAGE_HZ_HIGH = 1410
    DAMAGE_PER_SECOND_AT_HIGH = 0.5
    DAMAGE_PER_SECOND_AT_LOW  = 0.2
    def __init__(self, id_):
        self.id = id_; self.speed = 0; self.health = 100.0
    def tick(self):
        if self.speed &gt;= self.DAMAGE_HZ_HIGH:
            self.health -= self.DAMAGE_PER_SECOND_AT_HIGH
        elif self.speed &lt;= self.DAMAGE_HZ_LOW:
            self.health -= self.DAMAGE_PER_SECOND_AT_LOW

class PLC:
    """Dürüst mühendis programlar: NOMINAL_HZ'de tut. Stuxnet tarzı payload sabote eder."""
    def __init__(self, c, sabotage=False):
        self.c = c; self.sabotage = sabotage; self.tick_count = 0
    def scan(self):
        self.tick_count += 1
        # Mühendisin amaçladığı mantık
        intended_speed = Centrifuge.NOMINAL_HZ
        actual_speed   = intended_speed
        # Stuxnet payload'ı: her ~27 günde bir kısa süreli aşırı hız/düşük hız
        if self.sabotage:
            if 100 &lt; (self.tick_count % 200) &lt; 110:
                actual_speed = Centrifuge.DAMAGE_HZ_HIGH
            elif 130 &lt; (self.tick_count % 200) &lt; 140:
                actual_speed = Centrifuge.DAMAGE_HZ_LOW
        self.c.speed = actual_speed
        # SCADA'ya rapor: HER ZAMAN nominal değer (yalan)
        return Centrifuge.NOMINAL_HZ if self.sabotage else actual_speed
    def operator_view(self): return self.scan()

# İki senaryo çalıştır
def run(sabotage):
    c   = Centrifuge(1)
    plc = PLC(c, sabotage=sabotage)
    for t in range(2000):
        reported = plc.operator_view()
        c.tick()
    return c.health

print(f"Health after 2000 scans, no sabotage:    {run(sabotage=False):.1f}")
print(f"Health after 2000 scans, Stuxnet-style:  {run(sabotage=True):.1f}")
print("\\nOperatörün ekranı her iki durumda da TÜM ZAMAN 1064 Hz gösterdi.")
print("Yalnızca fiziksel inceleme (titreşim, kütle spektrumu) hasarı açığa çıkarır.")
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Gömülü hedef için firmware derler (ESP32, nRF52, STM32) — toolchain imzalı binary üretir; imza doğrulamasını bootloader (secure boot) zorlar. 2) Secure boot zinciri: ROM → birinci-aşama bootloader (değişmez, eFuse-kilitli public key) → uygulama — herhangi bir halkayı kır, cihaz sadece otantik firmware boot eder. 3) OTA güncelleme yolu: imzalı imajı yedek slot'a indir, imza + sürüm doğrula (anti-rollback eFuse sayacı), swap-and-reboot, ilk boot başarısızsa fallback. 4) Şifreli flash (eFuse anahtarıyla AES-XTS) fiziksel chip-off saldırılarına karşı korur; yüksek değerli cihazlar için anti-tamper (mesh, sensör) ile birleştir.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı Stuxnet-lite simülasyonu. DAMAGE_HZ eşiklerini veya sabotaj pencerelerini ayarlayın ve yıkıcı kalırken sabotajın ne kadar ince olabileceğini görün.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>NOM, HI, LO = 1064, 1410, 2
def run(sabotage):
    health = 100.0; speed = 0
    for t in range(2000):
        speed = NOM
        if sabotage:
            if 100 &lt; (t%200) &lt; 110: speed = HI
            if 130 &lt; (t%200) &lt; 140: speed = LO
        if speed &gt;= HI: health -= 0.5
        elif speed &lt;= LO: health -= 0.2
        # operatör her zaman NOM görür
    return round(health, 1)

print("Honest:  health =", run(False))
print("Stuxnet: health =", run(True))
print("Operator screen shows 1064 Hz both runs.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Industroyer / CRASHOVERRIDE ve Triton/TRISIS</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">BlackEnergy → Industroyer (Ukrayna 2015 / 2016)</div><div class="card-body">Ukrayna güç şebekesi saldırıları. 23 Aralık 2015: 230 bin kişi saatlerce elektriksiz. Industroyer (2016), yerel ICS protokol modülleri (IEC 60870-5-101/104, IEC 61850, OPC DA) içeren ilk zararlı yazılım çerçevesiydi.</div></div>
<div class="calc-card"><div class="card-title">Triton / TRISIS (2017)</div><div class="card-body">Bir Güvenlik Enstrümante Sistemini hedefleyen ilk zararlı yazılım — bir Suudi petrokimya tesisinde Schneider Triconex SIS. Hedef: ayrı bir ICS saldırısının fiziksel hasara neden olabilmesi için güvenlik kilitlerini devre dışı bırakmak. Operatör SIS hata verip tesisi durdurduğu için yakaladı. Atıf: Rusya'nın TsNIIKhM'si.</div></div>
<div class="calc-card"><div class="card-title">CRASHOVERRIDE / Industroyer2 (2022)</div><div class="card-body">Ukrayna 2022 savaş zamanında tekrar. Sandworm yine.</div></div>
<div class="calc-card"><div class="card-title">PIPEDREAM / INCONTROLLER (2022)</div><div class="card-body">Schneider, Omron PLC'leri hedefleyen CISA-ifşa edilen çerçeve — kamuya açık olarak görülen en ICS-kapsamlı araç seti.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Savunma — IEC 62443, Diyotlar ve OT-IDS</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">IEC 62443</div><div class="card-body">Uluslararası ICS güvenlik standart ailesi. Bölgeler, kanallar, güvenlik seviyeleri (SL1-SL4). Düzenleme tarafından giderek zorunlu kılınıyor (AB NIS2, ABD TSA boru hattı direktifi).</div></div>
<div class="calc-card"><div class="card-title">Ağ diyotları</div><div class="card-body">OT → IT veri ihracatı için tek yönlü donanım (Owl, Waterfall). Ters akışı fiziksel olarak önler. Yüksek değerli tesislerde kullanılır.</div></div>
<div class="calc-card"><div class="card-title">OT-IDS</div><div class="card-body">Dragos, Nozomi Networks, Claroty, Forescout — protokol tabanlarını öğrenen pasif izleyiciler (Modbus okumaları register X'e her zaman 1 Hz'de) ve sapmalarda uyarır.</div></div>
<div class="calc-card"><div class="card-title">Mühendislik iş istasyonu sertleştirme</div><div class="card-body">Stuxnet'in birincil yatay hareket noktası mühendisin PC'siydi. Uygulama-izin-listeleme, USB-portu kilitleme, bastion'lar aracılığıyla satıcı uzaktan erişim.</div></div>
<div class="calc-card"><div class="card-title">Hash kontrollü PLC programları</div><div class="card-body">PLC'nin çalışan programının mühendisin altın kopyasıyla eşleşip eşleşmediğini periyodik olarak doğrulayın — Stuxnet yüklemeyi keserek değişiklikleri gizledi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; Sonraki Adım</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Purdue: IT/OT sınırı olarak L3.5 DMZ ile 6 seviye.</li>
<li>Modbus kimliği doğrulanmamıştır; DNP3-SA ve OPC UA gerçek kriptografi ekler.</li>
<li>Stuxnet (2010): 4 zero-day, 2 çalınmış sertifika, sabotajı operatör ekranlarından gizledi.</li>
<li>Triton (2017): SIS hedefleyen ilk zararlı yazılım; güvenlik sistemleri artık kapsam içindedir.</li>
<li>IEC 62443 + OT-IDS (Dragos/Nozomi/Claroty) modern savunma temelidir.</li>
</ul>
</div>
<p class="l-text">Sıradaki son IoT bitişi: <strong>iot-L6</strong> — Bağlı ve Otonom Araç Güvenliği: CAN bus, V2X, sensör sahteciliği, ISO/SAE 21434.</p>
</div>`
};
