window.IOT_L6 = {
en: `<p class="l-text"><strong>This is the capstone of the IoT Security track: the modern automobile.</strong> A 2026 production vehicle is somewhere between 70 and 150 ECUs (Electronic Control Units) connected by a half-dozen network technologies (CAN, CAN-FD, FlexRay, MOST, LIN, automotive Ethernet at 100 / 1000BASE-T1), running tens of millions of lines of code, exposed to the world via cellular telematics, Wi-Fi hotspot, Bluetooth, V2X radios, OBD-II, USB, and the entertainment system's web browser. Charlie Miller and Chris Valasek's <strong>2015 Jeep Cherokee remote hack</strong> (Wired, "Hackers Remotely Kill a Jeep") triggered Fiat-Chrysler's recall of 1.4M vehicles and started the modern era of automotive cybersecurity regulation.</p>

<p class="l-text">In this lesson we cover the full automotive attack surface: the <strong>CAN bus</strong> (Bosch, 1986; ISO 11898) and how trivial it is to inject frames once on it, the <strong>ECU ecosystem</strong> (engine, transmission, ABS, infotainment, ADAS, gateway), <strong>V2X</strong> (DSRC IEEE 802.11p / C-V2X 5G), <strong>sensor spoofing</strong> (LiDAR, camera, radar, GPS), <strong>UDS / ISO 14229</strong> diagnostics protocol, and the regulatory wave: <strong>ISO/SAE 21434</strong> (cybersecurity engineering), <strong>UN R155</strong> (mandated CSMS for type approval since July 2024 in EU), <strong>UN R156</strong> (software updates). We finish with a Python CAN-frame parser that reads engine RPM and vehicle speed off a captured stream — the "Hello World" of automotive RE.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>CAN bus framing: ID, DLC, payload (0–8 bytes), CRC, ACK; CAN-FD's 64-byte payload</li>
<li>ECU architecture: powertrain CAN, body CAN, chassis CAN, infotainment Ethernet, gateway separation</li>
<li>UDS / ISO 14229: SecurityAccess, RoutineControl, ReadDataByIdentifier, the firmware update path</li>
<li>The Miller-Valasek 2015 Jeep hack: U-connect head-unit → CAN gateway pivot</li>
<li>V2X: DSRC vs C-V2X, certificate management (SCMS), pseudonym privacy</li>
<li>Sensor spoofing: GPS spoofing (UT Austin yacht study, 2013), LiDAR adversarial reflectors, camera adversarial patches</li>
<li>Build a Python CAN-frame parser on captured engine RPM / speed traffic</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The CAN Bus — Why It Was Designed Insecure</h2>
<p class="l-text"><strong>CAN</strong> (Controller Area Network) was specified by Bosch in 1986, standardized as ISO 11898 in 1993. Its design priority was <em>real-time deterministic broadcast for safety-critical functions in a noisy automotive electrical environment</em>. Security was not in the requirements document. Every node sees every frame; arbitration is by ID priority (lower ID = higher priority); there is no source authentication, no encryption, no replay protection.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Standard CAN frame</div><div class="card-body">11-bit ID, 4-bit DLC, 0–8 byte payload, 15-bit CRC. ~1 Mbps max.</div></div>
<div class="calc-card"><div class="card-title">Extended CAN</div><div class="card-body">29-bit ID. Used for SAE J1939 in heavy trucks.</div></div>
<div class="calc-card"><div class="card-title">CAN-FD (2012)</div><div class="card-body">"Flexible Data Rate". Up to 64-byte payload, up to 8 Mbps. Adoption growing.</div></div>
<div class="calc-card"><div class="card-title">Automotive Ethernet</div><div class="card-body">100 / 1000BASE-T1 single-pair. Used for cameras, ADAS, infotainment. AUTOSAR Adaptive runs here.</div></div>
<div class="calc-card"><div class="card-title">FlexRay, MOST, LIN</div><div class="card-body">FlexRay = high-speed deterministic (X-by-wire), MOST = legacy infotainment ring, LIN = single-wire low-cost (door modules).</div></div>
</div>

<div class="calc-highlight">Once an attacker is on the CAN bus, they can send any frame as if from any ECU. The ABS controller sees a brake command and obeys it; it has no way to verify the sender. This is why <em>gateway architecture</em> matters: the central gateway ECU isolates infotainment from powertrain CAN, and modern designs add MAC-based message authentication (AUTOSAR SecOC).</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ECU Topology — The Modern Vehicle</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Powertrain ECUs</div><div class="card-body">Engine Control Module (ECM), Transmission Control Module (TCM). High-speed CAN.</div></div>
<div class="calc-card"><div class="card-title">Chassis ECUs</div><div class="card-body">ABS / ESP, electric power steering (EPS), airbag control. Mid-speed CAN, increasingly CAN-FD or Ethernet.</div></div>
<div class="calc-card"><div class="card-title">Body ECUs</div><div class="card-body">BCM (lights, locks, windows, wipers). Low-speed CAN or LIN.</div></div>
<div class="calc-card"><div class="card-title">Infotainment / Telematics</div><div class="card-body">Head unit, telematics gateway (TCU). Cellular, Wi-Fi, Bluetooth, USB. Internet-facing — the favorite entry point.</div></div>
<div class="calc-card"><div class="card-title">ADAS</div><div class="card-body">Camera, radar, LiDAR (newer), perception ECU running CNN/transformer models. Tesla FSD HW4, Mobileye EyeQ6.</div></div>
<div class="calc-card"><div class="card-title">Gateway</div><div class="card-body">Central ECU isolating networks. Modern E/E architectures consolidate to 3–4 zonal compute nodes plus a vehicle-level "central computer".</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The 2015 Jeep Cherokee Hack</h2>
<p class="l-text">Charlie Miller and Chris Valasek (DARPA-funded research). <em>Cellular</em> entry: the U-connect head unit's Sprint cellular interface accepted commands on port 6667 with no authentication. They got a shell. From the head unit, they reflashed the V850 microcontroller that bridges head unit to CAN, giving them arbitrary-CAN-write capability. With CAN write, they steered the wheel, killed the engine, disabled brakes — at 70 mph on the highway with the Wired reporter behind the wheel. Fiat-Chrysler recalled 1.4M vehicles; this single incident is the most-cited justification for ISO/SAE 21434 and UN R155.</p>

<div class="calc-highlight">The lesson: defense in depth. Cellular interface should not have shell access. Head unit should not be able to reflash safety-critical chips. Gateway should authenticate CAN messages. Each layer assumed the previous would hold; the real attacker pierced all of them.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. UDS / ISO 14229 — Diagnostic Power</h2>
<p class="l-text"><strong>UDS</strong> (Unified Diagnostic Services) is the protocol every mechanic's scan tool uses, and the vector every CAN attacker leverages. Services that matter:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">0x10 DiagnosticSessionControl</div><div class="card-body">Switch into "extended" or "programming" session — unlocks more services.</div></div>
<div class="calc-card"><div class="card-title">0x27 SecurityAccess</div><div class="card-body">Challenge-response pseudo-auth. Vendors implement weak schemes (XOR, 32-bit constant, time-based) — security researcher Ken Munro published many real-world breaks.</div></div>
<div class="calc-card"><div class="card-title">0x22 ReadDataByIdentifier</div><div class="card-body">Read VIN, software version, sensor values.</div></div>
<div class="calc-card"><div class="card-title">0x2E WriteDataByIdentifier</div><div class="card-body">Write configuration. Sometimes including immobilizer state.</div></div>
<div class="calc-card"><div class="card-title">0x31 RoutineControl</div><div class="card-body">Run pre-defined routines. Engine self-test, key learning, EEPROM clear.</div></div>
<div class="calc-card"><div class="card-title">0x34/0x36/0x37 RequestDownload/Transfer/Exit</div><div class="card-body">The firmware-update path. SecurityAccess gates this; if SecurityAccess is broken, ECU rooting is trivial.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CAN-Frame Parser in Python</h2>
<p class="l-text">Below: a parser for a captured CAN log (one hex frame per line, like a candump output). Decode engine RPM (typically ID 0x0C in OBD-II / J1979 PIDs) and vehicle speed. This is a real recipe; substitute your vehicle's DBC file for the byte layout.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># OBD-II / SAE J1979 PIDs over CAN ID 0x7DF (request) / 0x7E8 (response)
# Mode 0x01 PID 0x0C = Engine RPM, formula = (256*A + B) / 4
# Mode 0x01 PID 0x0D = Vehicle Speed, formula = A km/h
# Frame format: 8 bytes, [length][mode_resp][pid][A][B][C][D][E]

def parse_obd_response(can_id, data):
    if can_id != 0x7E8: return None
    if len(data) &lt; 4: return None
    length, mode_resp, pid = data[0], data[1], data[2]
    if mode_resp != 0x41: return None
    A, B = data[3], data[4] if len(data) &gt; 4 else 0
    if pid == 0x0C:
        rpm = (256*A + B) / 4.0
        return {"pid": "EngineRPM", "value": rpm, "unit": "rpm"}
    if pid == 0x0D:
        return {"pid": "VehicleSpeed", "value": A, "unit": "km/h"}
    if pid == 0x05:
        return {"pid": "CoolantTemp", "value": A - 40, "unit": "C"}
    return {"pid": f"PID_0x{pid:02x}", "value": data[3:length+1].hex()}

# Synthetic capture
log = [
    (0x7E8, bytes([0x04, 0x41, 0x0C, 0x1A, 0xF8, 0,0,0])),    # RPM=(256*0x1A+0xF8)/4 = 1726
    (0x7E8, bytes([0x03, 0x41, 0x0D, 0x3C, 0,0,0,0])),         # Speed=60 km/h
    (0x7E8, bytes([0x03, 0x41, 0x05, 0x5A, 0,0,0,0])),         # Coolant=50 C (0x5A=90, 90-40=50)
    (0x7E8, bytes([0x04, 0x41, 0x0C, 0x0F, 0xA0, 0,0,0])),    # RPM=(256*15+160)/4 = 1000
]
for cid, data in log:
    parsed = parse_obd_response(cid, data)
    if parsed: print(f"  CAN 0x{cid:03x}  {parsed['pid']:13s} = {parsed['value']:6} {parsed['unit']}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Connects to an MQTT broker (Mosquitto, EMQX, AWS IoT Core, Azure IoT Hub) — use TLS (port 8883) ALWAYS, plain 1883 only on isolated lab networks. 2) Authenticates via username/password OR (preferred) X.509 client certificate — per-device cert lets you revoke a single compromised gadget without rotating the whole fleet. 3) Publishes to a topic with a QoS level: 0 fire-and-forget, 1 at-least-once (default for telemetry), 2 exactly-once (rare, expensive). 4) Subscribes the cloud side with topic ACLs so device A cannot read device B's stream — without ACLs, one rooted device sees everyone's data.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same OBD-II parser. Try adding a frame for PID 0x11 (throttle position, scale = A * 100/255) and watch it decode.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>def parse(cid, data):
    if cid != 0x7E8 or len(data) &lt; 4 or data[1] != 0x41: return None
    pid, A, B = data[2], data[3], (data[4] if len(data)&gt;4 else 0)
    if pid == 0x0C: return ("RPM",   (256*A + B) / 4.0, "rpm")
    if pid == 0x0D: return ("SPEED", A, "km/h")
    if pid == 0x05: return ("COOL",  A - 40, "C")
    if pid == 0x11: return ("THR",   A * 100/255, "%")
    return ("PID0x%02x" % pid, data.hex(), "")

log = [
    (0x7E8, bytes([4, 0x41, 0x0C, 0x1A, 0xF8, 0,0,0])),
    (0x7E8, bytes([3, 0x41, 0x0D, 0x3C, 0,0,0,0])),
    (0x7E8, bytes([3, 0x41, 0x05, 0x5A, 0,0,0,0])),
    (0x7E8, bytes([3, 0x41, 0x11, 0x80, 0,0,0,0])),    # ~50% throttle
]
for cid, d in log:
    r = parse(cid, d)
    if r: print(f"  {r[0]:6s} = {r[1]} {r[2]}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. V2X — Cars Talking to Each Other</h2>
<p class="l-text"><strong>V2X</strong> = Vehicle-to-Everything. Two competing PHYs:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DSRC (IEEE 802.11p)</div><div class="card-body">5.9 GHz Wi-Fi-derivative. Latency ~1 ms. Standardized 2010, deployed in U.S. RSUs (Roadside Units). FCC reallocated some 5.9 GHz spectrum 2020 → fading.</div></div>
<div class="calc-card"><div class="card-title">C-V2X (5G NR sidelink)</div><div class="card-body">3GPP Rel-14 (LTE-V2X) and Rel-16+ (NR-V2X). Cellular-derived. Direct mode (PC5) and network-mode. Industry consensus shifted toward C-V2X.</div></div>
<div class="calc-card"><div class="card-title">Messages</div><div class="card-body">SAE J2735 BSM (Basic Safety Message) at 10 Hz: position, heading, speed, brake status. Plus SPaT (signal phase and timing), MAP, RSA (road safety advisory).</div></div>
<div class="calc-card"><div class="card-title">SCMS — privacy &amp; PKI</div><div class="card-body">Security Credential Management System: each car gets thousands of short-lived pseudonym certs to prevent long-term tracking. Issued by an SCMS Root + Pseudonym CAs. ECDSA over P-256 typical.</div></div>
<div class="calc-card"><div class="card-title">Threats</div><div class="card-body">Sybil attack (one car pretends to be many), ghost-vehicle injection, replay across geos, GPS spoofing to lie about location. Misbehavior detection is an active research field.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Sensor Spoofing — When the Physical World Lies</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GPS spoofing</div><div class="card-body">Todd Humphreys's UT Austin team demonstrated yacht-route hijack in 2013 with a $3,000 SDR rig. Cars: navigation drifts, geofenced features unlock or lock incorrectly. Defense: multi-constellation (GPS+Galileo+GLONASS+BeiDou), inertial sensor cross-check, anti-spoofing receivers.</div></div>
<div class="calc-card"><div class="card-title">LiDAR spoofing</div><div class="card-body">Shin et al. (2017) and Cao et al. (2019, "Adversarial Sensor Attack on LiDAR-based Perception"): use a calibrated laser and photodiodes to inject fake points or remove real ones. Defense: temporal coherence checks, sensor fusion across LiDAR + radar + camera.</div></div>
<div class="calc-card"><div class="card-title">Camera adversarial patches</div><div class="card-body">Eykholt et al. (2018) showed printed stickers on stop signs reliably misclassify CNNs as 45 mph signs. Defense: adversarial training, semantic checks, multi-frame voting.</div></div>
<div class="calc-card"><div class="card-title">Radar spoofing</div><div class="card-body">Less developed publicly; some demos with delay-line signal generators creating ghost obstacles. Defense: doppler consistency, multi-bandwidth fusion.</div></div>
<div class="calc-card"><div class="card-title">Ultrasonic / parking sensors</div><div class="card-body">Trivially spoofable (40 kHz piezo). Mostly used for parking, lower stakes.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Regulation — ISO/SAE 21434, UN R155, R156</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ISO/SAE 21434 (2021)</div><div class="card-body">"Road vehicles — Cybersecurity engineering." Process standard. TARA (Threat Analysis and Risk Assessment), CAL (Cybersecurity Assurance Level) 1–4 by impact × attack feasibility, lifecycle from concept through end-of-life.</div></div>
<div class="calc-card"><div class="card-title">UN R155 (2020 → mandatory July 2024 in EU + Japan + Korea + UK)</div><div class="card-body">Type approval requires a certified CSMS (Cyber Security Management System). No CSMS, no new vehicle sales in regulated markets.</div></div>
<div class="calc-card"><div class="card-title">UN R156</div><div class="card-body">Software Update Management System (SUMS). OTA updates must be authenticated, integrity-protected, traceable, reversible.</div></div>
<div class="calc-card"><div class="card-title">EU Cyber Resilience Act (2024)</div><div class="card-body">Horizontal requirement for products with digital elements. Vehicles partially carved out via R155, but supply-chain components covered.</div></div>
<div class="calc-card"><div class="card-title">SBOM mandate</div><div class="card-body">Software Bill of Materials increasingly required (US EO 14028, EU CRA). Lets fleet operators know which vehicles have CVE-X.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Track Capstone — IoT Security End-to-End</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>CAN bus is unauthenticated by design; gateway architecture and SecOC are the modern defenses.</li>
<li>2015 Jeep hack: cellular → head unit → CAN gateway. Defense in depth must hold at every layer.</li>
<li>UDS / ISO 14229 is the diagnostic surface; SecurityAccess implementations are often weak.</li>
<li>V2X adds DSRC vs C-V2X choice, SCMS PKI, and Sybil/ghost-vehicle threats.</li>
<li>Sensor spoofing — GPS, LiDAR, camera — bridges cyber to physics; sensor fusion is the answer.</li>
<li>ISO/SAE 21434 + UN R155/R156 made automotive cybersecurity legally mandatory in major markets.</li>
<li>The IoT Security track end-to-end: L1 fundamentals → L2 device threat model → L3 firmware RE → L4 wireless → L5 ICS/SCADA → L6 connected vehicles.</li>
</ul>
</div>
<p class="l-text">You have completed the IoT Security track. The three cybersecurity tracks — Forensics, Blockchain Security, and IoT Security — now give you a coherent map from "what is a binary?" to "how does a modern car defend itself?" The next step is hands-on: build a home lab, run real samples, sniff your own kit, and contribute. Welcome to the field.</p>
</div>`,
tr: `<p class="l-text"><strong>Bu, IoT Güvenliği izinin bitişidir: modern otomobil.</strong> 2026 üretim aracı 70 ile 150 ECU (Elektronik Kontrol Ünitesi) arasında bir yerdedir, yarım düzine ağ teknolojisi (CAN, CAN-FD, FlexRay, MOST, LIN, 100 / 1000BASE-T1'de otomotiv Ethernet) ile bağlıdır, on milyonlarca satır kod çalıştırır, hücresel telematik, Wi-Fi hotspot, Bluetooth, V2X radyolar, OBD-II, USB ve eğlence sisteminin web tarayıcısı aracılığıyla dünyaya açıktır. Charlie Miller ve Chris Valasek'in <strong>2015 Jeep Cherokee uzaktan saldırısı</strong> (Wired, "Hackers Remotely Kill a Jeep"), Fiat-Chrysler'in 1.4 milyon aracın geri çağrılmasını tetikledi ve modern otomotiv siber güvenlik düzenleme çağını başlattı.</p>

<p class="l-text">Bu derste tam otomotiv saldırı yüzeyini ele alıyoruz: <strong>CAN bus</strong> (Bosch, 1986; ISO 11898) ve üzerine çıktığınızda frame enjekte etmenin ne kadar önemsiz olduğu, <strong>ECU ekosistemi</strong> (motor, şanzıman, ABS, infotainment, ADAS, ağ geçidi), <strong>V2X</strong> (DSRC IEEE 802.11p / C-V2X 5G), <strong>sensör sahteciliği</strong> (LiDAR, kamera, radar, GPS), <strong>UDS / ISO 14229</strong> teşhis protokolü ve düzenleme dalgası: <strong>ISO/SAE 21434</strong> (siber güvenlik mühendisliği), <strong>UN R155</strong> (Temmuz 2024'ten beri AB'de tip onayı için zorunlu CSMS), <strong>UN R156</strong> (yazılım güncellemeleri). Yakalanan bir akıştan motor RPM ve araç hızını okuyan bir Python CAN-frame ayrıştırıcısı ile bitiriyoruz — otomotiv RE'nin "Hello World"'ü.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>CAN bus framing: ID, DLC, payload (0–8 bayt), CRC, ACK; CAN-FD'nin 64-bayt payload'ı</li>
<li>ECU mimarisi: powertrain CAN, body CAN, chassis CAN, infotainment Ethernet, ağ geçidi ayrımı</li>
<li>UDS / ISO 14229: SecurityAccess, RoutineControl, ReadDataByIdentifier, firmware güncelleme yolu</li>
<li>Miller-Valasek 2015 Jeep saldırısı: U-connect head-unit → CAN gateway pivot</li>
<li>V2X: DSRC vs C-V2X, sertifika yönetimi (SCMS), pseudonym gizliliği</li>
<li>Sensör sahteciliği: GPS sahteciliği (UT Austin yat çalışması, 2013), LiDAR çekişmeli yansıtıcılar, kamera çekişmeli yamalar</li>
<li>Yakalanan motor RPM / hız trafiğinde Python CAN-frame ayrıştırıcısı oluşturun</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. CAN Bus — Neden Güvensiz Tasarlandı</h2>
<p class="l-text"><strong>CAN</strong> (Controller Area Network) Bosch tarafından 1986'da belirtildi, 1993'te ISO 11898 olarak standartlaştırıldı. Tasarım önceliği <em>gürültülü otomotiv elektrik ortamında güvenlik-kritik işlevler için gerçek zamanlı deterministik yayındı</em>. Güvenlik gereksinimler belgesinde yoktu. Her düğüm her frame'i görür; tahkim ID önceliğine göredir (daha düşük ID = daha yüksek öncelik); kaynak kimlik doğrulaması, şifreleme, yeniden oynatma koruması yoktur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Standart CAN frame</div><div class="card-body">11-bit ID, 4-bit DLC, 0–8 bayt payload, 15-bit CRC. Maks ~1 Mbps.</div></div>
<div class="calc-card"><div class="card-title">Genişletilmiş CAN</div><div class="card-body">29-bit ID. Ağır kamyonlarda SAE J1939 için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">CAN-FD (2012)</div><div class="card-body">"Flexible Data Rate". 64 bayta kadar payload, 8 Mbps'ye kadar. Benimsenme artıyor.</div></div>
<div class="calc-card"><div class="card-title">Otomotiv Ethernet</div><div class="card-body">100 / 1000BASE-T1 tek-çift. Kameralar, ADAS, infotainment için kullanılır. AUTOSAR Adaptive burada çalışır.</div></div>
<div class="calc-card"><div class="card-title">FlexRay, MOST, LIN</div><div class="card-body">FlexRay = yüksek hızlı deterministik (X-by-wire), MOST = eski infotainment halkası, LIN = tek telli düşük maliyet (kapı modülleri).</div></div>
</div>

<div class="calc-highlight">Bir saldırgan CAN bus'ta olduğunda, herhangi bir ECU'dan geliyormuş gibi herhangi bir frame gönderebilir. ABS denetleyicisi bir fren komutunu görür ve uyar; göndereni doğrulamanın bir yolu yoktur. Bu yüzden <em>ağ geçidi mimarisi</em> önemlidir: merkezi ağ geçidi ECU'su infotainment'i powertrain CAN'dan izole eder ve modern tasarımlar MAC tabanlı mesaj kimlik doğrulaması (AUTOSAR SecOC) ekler.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. ECU Topolojisi — Modern Araç</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Powertrain ECU'ları</div><div class="card-body">Engine Control Module (ECM), Transmission Control Module (TCM). Yüksek hızlı CAN.</div></div>
<div class="calc-card"><div class="card-title">Chassis ECU'ları</div><div class="card-body">ABS / ESP, elektrikli güç direksiyonu (EPS), hava yastığı kontrolü. Orta hızlı CAN, giderek artan CAN-FD veya Ethernet.</div></div>
<div class="calc-card"><div class="card-title">Body ECU'ları</div><div class="card-body">BCM (ışıklar, kilitler, pencereler, silecekler). Düşük hızlı CAN veya LIN.</div></div>
<div class="calc-card"><div class="card-title">Infotainment / Telematik</div><div class="card-body">Head unit, telematik ağ geçidi (TCU). Hücresel, Wi-Fi, Bluetooth, USB. İnternete bakan — favori giriş noktası.</div></div>
<div class="calc-card"><div class="card-title">ADAS</div><div class="card-body">Kamera, radar, LiDAR (yeni), CNN/transformer modellerini çalıştıran algı ECU'su. Tesla FSD HW4, Mobileye EyeQ6.</div></div>
<div class="calc-card"><div class="card-title">Ağ geçidi</div><div class="card-body">Ağları izole eden merkezi ECU. Modern E/E mimarileri 3-4 zonel hesaplama düğümüne artı araç seviyesinde "merkezi bilgisayar"a birleştirir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. 2015 Jeep Cherokee Saldırısı</h2>
<p class="l-text">Charlie Miller ve Chris Valasek (DARPA finanslı araştırma). <em>Hücresel</em> giriş: U-connect head unit'in Sprint hücresel arayüzü 6667 portunda kimlik doğrulaması olmadan komutları kabul etti. Bir shell aldılar. Head unit'ten, head unit'i CAN'a köprüleyen V850 mikrodenetleyicisini reflash ettiler ve onlara keyfi-CAN-yazma yeteneği verdiler. CAN yazma ile, direksiyonu çevirdiler, motoru durdurdular, frenleri devre dışı bıraktılar — direksiyondaki Wired muhabiri ile otoyolda 70 mph'de. Fiat-Chrysler 1.4M aracı geri çağırdı; bu tek olay ISO/SAE 21434 ve UN R155 için en çok alıntılanan gerekçedir.</p>

<div class="calc-highlight">Ders: derinlemesine savunma. Hücresel arayüzün shell erişimi olmamalıdır. Head unit, güvenlik-kritik çipleri reflash edememelidir. Ağ geçidi CAN mesajlarını doğrulamalıdır. Her katman bir öncekinin tutacağını varsaydı; gerçek saldırgan hepsini deldi.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. UDS / ISO 14229 — Teşhis Gücü</h2>
<p class="l-text"><strong>UDS</strong> (Unified Diagnostic Services), her tamircinin tarama aracının kullandığı protokoldür ve her CAN saldırganının kullandığı vektördür. Önemli hizmetler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">0x10 DiagnosticSessionControl</div><div class="card-body">"Genişletilmiş" veya "programlama" oturumuna geç — daha fazla hizmetin kilidini açar.</div></div>
<div class="calc-card"><div class="card-title">0x27 SecurityAccess</div><div class="card-body">Meydan okuma-yanıt sözde-auth. Satıcılar zayıf şemalar uygular (XOR, 32-bit sabit, zaman tabanlı) — güvenlik araştırmacısı Ken Munro birçok gerçek dünya kırılmasını yayımladı.</div></div>
<div class="calc-card"><div class="card-title">0x22 ReadDataByIdentifier</div><div class="card-body">VIN, yazılım sürümü, sensör değerlerini oku.</div></div>
<div class="calc-card"><div class="card-title">0x2E WriteDataByIdentifier</div><div class="card-body">Yapılandırma yaz. Bazen immobilizer durumu dahil.</div></div>
<div class="calc-card"><div class="card-title">0x31 RoutineControl</div><div class="card-body">Önceden tanımlanmış rutinleri çalıştır. Motor öz-testi, anahtar öğrenme, EEPROM temizleme.</div></div>
<div class="calc-card"><div class="card-title">0x34/0x36/0x37 RequestDownload/Transfer/Exit</div><div class="card-body">Firmware güncelleme yolu. SecurityAccess bunu kapatır; SecurityAccess kırılırsa, ECU rooting önemsizdir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Python'da CAN-Frame Ayrıştırıcısı</h2>
<p class="l-text">Aşağıda: yakalanan bir CAN log'u (satır başına bir hex frame, bir candump çıktısı gibi) için bir ayrıştırıcı. Motor RPM'sini (tipik olarak OBD-II / J1979 PID'lerde ID 0x0C) ve araç hızını kod çöz. Bu gerçek bir tariftir; bayt düzeni için aracınızın DBC dosyasını değiştirin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># CAN ID 0x7DF (istek) / 0x7E8 (yanıt) üzerinden OBD-II / SAE J1979 PID'leri
# Mode 0x01 PID 0x0C = Engine RPM, formül = (256*A + B) / 4
# Mode 0x01 PID 0x0D = Vehicle Speed, formül = A km/h
# Frame formatı: 8 bayt, [length][mode_resp][pid][A][B][C][D][E]

def parse_obd_response(can_id, data):
    if can_id != 0x7E8: return None
    if len(data) &lt; 4: return None
    length, mode_resp, pid = data[0], data[1], data[2]
    if mode_resp != 0x41: return None
    A, B = data[3], data[4] if len(data) &gt; 4 else 0
    if pid == 0x0C:
        rpm = (256*A + B) / 4.0
        return {"pid": "EngineRPM", "value": rpm, "unit": "rpm"}
    if pid == 0x0D:
        return {"pid": "VehicleSpeed", "value": A, "unit": "km/h"}
    if pid == 0x05:
        return {"pid": "CoolantTemp", "value": A - 40, "unit": "C"}
    return {"pid": f"PID_0x{pid:02x}", "value": data[3:length+1].hex()}

# Sentetik yakalama
log = [
    (0x7E8, bytes([0x04, 0x41, 0x0C, 0x1A, 0xF8, 0,0,0])),    # RPM=(256*0x1A+0xF8)/4 = 1726
    (0x7E8, bytes([0x03, 0x41, 0x0D, 0x3C, 0,0,0,0])),         # Hız=60 km/h
    (0x7E8, bytes([0x03, 0x41, 0x05, 0x5A, 0,0,0,0])),         # Soğutucu=50 C (0x5A=90, 90-40=50)
    (0x7E8, bytes([0x04, 0x41, 0x0C, 0x0F, 0xA0, 0,0,0])),    # RPM=(256*15+160)/4 = 1000
]
for cid, data in log:
    parsed = parse_obd_response(cid, data)
    if parsed: print(f"  CAN 0x{cid:03x}  {parsed['pid']:13s} = {parsed['value']:6} {parsed['unit']}")
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Bir MQTT broker'a bağlanır (Mosquitto, EMQX, AWS IoT Core, Azure IoT Hub) — HER ZAMAN TLS (port 8883) kullan, açık 1883 sadece izole laboratuvar ağında. 2) Username/password ile VEYA (tercih edilen) X.509 client sertifikası ile kimlik doğrular — cihaz başına sertifika tek ele geçirilmiş cihazı tüm filoyu döndürmeden iptal etmenizi sağlar. 3) Bir topic'e QoS seviyesiyle yayınlar: 0 fire-and-forget, 1 en-az-bir-kere (telemetri için default), 2 tam-bir-kere (nadir, pahalı). 4) Bulut tarafında topic ACL ile abone olun — cihaz A cihaz B'nin stream'ini okuyamasın; ACL olmazsa root'lanmış bir cihaz herkesin verisini görür.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı OBD-II ayrıştırıcısı. PID 0x11 (gaz pedalı konumu, ölçek = A * 100/255) için bir frame eklemeyi deneyin ve kod çözdüğünü izleyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>def parse(cid, data):
    if cid != 0x7E8 or len(data) &lt; 4 or data[1] != 0x41: return None
    pid, A, B = data[2], data[3], (data[4] if len(data)&gt;4 else 0)
    if pid == 0x0C: return ("RPM",   (256*A + B) / 4.0, "rpm")
    if pid == 0x0D: return ("SPEED", A, "km/h")
    if pid == 0x05: return ("COOL",  A - 40, "C")
    if pid == 0x11: return ("THR",   A * 100/255, "%")
    return ("PID0x%02x" % pid, data.hex(), "")

log = [
    (0x7E8, bytes([4, 0x41, 0x0C, 0x1A, 0xF8, 0,0,0])),
    (0x7E8, bytes([3, 0x41, 0x0D, 0x3C, 0,0,0,0])),
    (0x7E8, bytes([3, 0x41, 0x05, 0x5A, 0,0,0,0])),
    (0x7E8, bytes([3, 0x41, 0x11, 0x80, 0,0,0,0])),    # ~%50 gaz pedalı
]
for cid, d in log:
    r = parse(cid, d)
    if r: print(f"  {r[0]:6s} = {r[1]} {r[2]}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. V2X — Birbiriyle Konuşan Araçlar</h2>
<p class="l-text"><strong>V2X</strong> = Vehicle-to-Everything. İki rakip PHY:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DSRC (IEEE 802.11p)</div><div class="card-body">5.9 GHz Wi-Fi-türevi. Gecikme ~1 ms. 2010'da standartlaştı, ABD RSU'larında (Yol Kenarı Birimleri) dağıtıldı. FCC 2020'de bazı 5.9 GHz spektrumunu yeniden tahsis etti → soluyor.</div></div>
<div class="calc-card"><div class="card-title">C-V2X (5G NR sidelink)</div><div class="card-body">3GPP Rel-14 (LTE-V2X) ve Rel-16+ (NR-V2X). Hücresel türetilmiş. Direkt mod (PC5) ve ağ-modu. Endüstri konsensüsü C-V2X'e kaydı.</div></div>
<div class="calc-card"><div class="card-title">Mesajlar</div><div class="card-body">10 Hz'de SAE J2735 BSM (Basic Safety Message): konum, yön, hız, fren durumu. Artı SPaT (sinyal fazı ve zamanlaması), MAP, RSA (yol güvenlik tavsiyesi).</div></div>
<div class="calc-card"><div class="card-title">SCMS — gizlilik &amp; PKI</div><div class="card-body">Security Credential Management System: her araç uzun vadeli izlemeyi önlemek için binlerce kısa ömürlü pseudonym sertifikası alır. SCMS Kök + Pseudonym CA'ları tarafından verilir. P-256 üzerinde ECDSA tipik.</div></div>
<div class="calc-card"><div class="card-title">Tehditler</div><div class="card-body">Sybil saldırısı (bir araç birçok gibi davranır), hayalet-araç enjeksiyonu, coğrafyalar arası yeniden oynatma, konum hakkında yalan söylemek için GPS sahteciliği. Yanlış davranış tespiti aktif bir araştırma alanı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Sensör Sahteciliği — Fiziksel Dünya Yalan Söylediğinde</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">GPS sahteciliği</div><div class="card-body">Todd Humphreys'in UT Austin ekibi 2013'te 3.000 dolarlık bir SDR rig ile yat-rota gaspını gösterdi. Arabalar: navigasyon kayar, jeo-çevreli özellikler yanlış kilidi açar veya kilitler. Savunma: çoklu-takımyıldız (GPS+Galileo+GLONASS+BeiDou), eylemsizlik sensörü çapraz kontrolü, anti-sahtecilik alıcılar.</div></div>
<div class="calc-card"><div class="card-title">LiDAR sahteciliği</div><div class="card-body">Shin vd. (2017) ve Cao vd. (2019, "Adversarial Sensor Attack on LiDAR-based Perception"): sahte noktalar enjekte etmek veya gerçek olanları kaldırmak için kalibre edilmiş bir lazer ve fotodiyotlar kullanın. Savunma: zamansal tutarlılık kontrolleri, LiDAR + radar + kamera arasında sensör birleşimi.</div></div>
<div class="calc-card"><div class="card-title">Kamera çekişmeli yamalar</div><div class="card-body">Eykholt vd. (2018), dur işaretlerine yapıştırılmış basılı çıkartmaların CNN'leri güvenilir şekilde 45 mph işaretler olarak yanlış sınıflandırdığını gösterdi. Savunma: çekişmeli eğitim, semantik kontroller, çok-frame oylama.</div></div>
<div class="calc-card"><div class="card-title">Radar sahteciliği</div><div class="card-body">Kamuya açık daha az gelişmiş; hayalet engeller yaratan gecikme hattı sinyal üreteçleri ile bazı demolar. Savunma: doppler tutarlılığı, çoklu bant genişliği birleşimi.</div></div>
<div class="calc-card"><div class="card-title">Ultrasonik / park sensörleri</div><div class="card-body">Önemsiz şekilde sahtelenebilir (40 kHz piezo). Çoğunlukla park için kullanılır, daha düşük değerli.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Düzenleme — ISO/SAE 21434, UN R155, R156</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ISO/SAE 21434 (2021)</div><div class="card-body">"Karayolu araçları — Siber güvenlik mühendisliği." Süreç standardı. TARA (Tehdit Analizi ve Risk Değerlendirmesi), etki × saldırı uygulanabilirliği ile CAL (Siber Güvenlik Güvence Düzeyi) 1–4, kavramdan yaşam sonuna kadar yaşam döngüsü.</div></div>
<div class="calc-card"><div class="card-title">UN R155 (2020 → Temmuz 2024'te AB + Japonya + Kore + İngiltere'de zorunlu)</div><div class="card-body">Tip onayı sertifikalı bir CSMS (Siber Güvenlik Yönetim Sistemi) gerektirir. CSMS yok, düzenlenmiş pazarlarda yeni araç satışı yok.</div></div>
<div class="calc-card"><div class="card-title">UN R156</div><div class="card-body">Software Update Management System (SUMS). OTA güncellemeleri kimliği doğrulanmış, bütünlük korumalı, izlenebilir, geri alınabilir olmalıdır.</div></div>
<div class="calc-card"><div class="card-title">AB Siber Dayanıklılık Yasası (2024)</div><div class="card-body">Dijital öğeli ürünler için yatay gereksinim. Araçlar R155 aracılığıyla kısmen ayrılır, ancak tedarik zinciri bileşenleri kapsanır.</div></div>
<div class="calc-card"><div class="card-title">SBOM zorunluluğu</div><div class="card-body">Yazılım Malzeme Listesi giderek gerekli (ABD EO 14028, AB CRA). Filo operatörlerinin hangi araçların CVE-X'e sahip olduğunu bilmesine olanak tanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. İz Bitiş — Uçtan Uca IoT Güvenliği</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>CAN bus tasarım gereği kimliği doğrulanmamıştır; ağ geçidi mimarisi ve SecOC modern savunmalardır.</li>
<li>2015 Jeep saldırısı: hücresel → head unit → CAN ağ geçidi. Derinlemesine savunma her katmanda tutmalıdır.</li>
<li>UDS / ISO 14229 teşhis yüzeyidir; SecurityAccess uygulamaları genellikle zayıftır.</li>
<li>V2X, DSRC vs C-V2X seçimi, SCMS PKI ve Sybil/hayalet-araç tehditleri ekler.</li>
<li>Sensör sahteciliği — GPS, LiDAR, kamera — siberi fiziğe köprüler; sensör birleşimi cevaptır.</li>
<li>ISO/SAE 21434 + UN R155/R156, otomotiv siber güvenliğini büyük pazarlarda yasal olarak zorunlu hâle getirdi.</li>
<li>IoT Güvenliği izi uçtan uca: L1 temeller → L2 cihaz tehdit modeli → L3 firmware RE → L4 kablosuz → L5 ICS/SCADA → L6 bağlı araçlar.</li>
</ul>
</div>
<p class="l-text">IoT Güvenliği izini tamamladınız. Üç siber güvenlik izi — Adli Tıp, Blockchain Güvenliği ve IoT Güvenliği — size artık "ikili nedir?"den "modern bir araba kendini nasıl savunur?"a tutarlı bir harita veriyor. Bir sonraki adım uygulamalı: bir ev laboratuvarı kurun, gerçek örnekler çalıştırın, kendi kitinizi sniff edin ve katkıda bulunun. Alana hoş geldiniz.</p>
</div>`
};
