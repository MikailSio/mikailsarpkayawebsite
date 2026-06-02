window.IOT_L4 = {
en: `<p class="l-text"><strong>The wireless layer is where most IoT compromises actually happen — long before any web admin or firmware bug.</strong> The radio is harder to firewall, easier to listen to from across the parking lot, and historically littered with under-tested cryptography. The three protocols that matter most for consumer and enterprise IoT — <strong>Bluetooth Low Energy</strong> (BLE, 2010 in BT 4.0), <strong>Zigbee</strong> (IEEE 802.15.4 PHY + ZCL stack, since 2003), and <strong>LoRaWAN</strong> (Semtech + LoRa Alliance, 2015) — each have decade-long histories of pairing flaws, key-extraction recipes, and replay vulnerabilities. The hardware is now cheap: a $30 <strong>HackRF One</strong>, an $8 <strong>RTL-SDR</strong>, an Ubertooth, a Sonoff Zigbee dongle, an Adafruit Feather LoRa, and you have a complete radio lab.</p>

<p class="l-text">In this lesson we cover the threat model and security details for all three: BLE pairing modes (Just Works / Passkey / OOB / LE Secure Connections), the famous <strong>KNOB</strong> and <strong>BLURtooth</strong> attacks, Zigbee's transport key + network key system and how LeakedZigbee / KillerBee extract them, LoRaWAN OTAA vs ABP and the replay/rejoin pitfalls, and the SDR ecosystem (HackRF, GNU Radio, Universal Radio Hacker). We finish with a Python state-machine demo of a BLE pairing handshake — including the Just-Works MITM scenario.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BLE: GAP/GATT, advertising packets, pairing modes, KNOB, BLURtooth</li>
<li>Zigbee: 802.15.4 PHY, network/link/transport keys, key-extraction attacks</li>
<li>LoRaWAN: OTAA vs ABP, AppKey vs NwkSKey, frame counter replay defenses</li>
<li>SDR ecosystem: HackRF (1 MHz–6 GHz half-duplex), RTL-SDR (24 MHz–1.7 GHz RX-only), Ubertooth, GNU Radio</li>
<li>Universal Radio Hacker (URH) for protocol decoding from raw IQ</li>
<li>Build a BLE pairing state machine and watch a Just-Works MITM</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. BLE in 60 Seconds</h2>
<p class="l-text">Bluetooth Low Energy advertises in 3 channels (37, 38, 39 — chosen to avoid Wi-Fi overlap), then connections hop across 37 data channels with adaptive frequency hopping. Two API layers matter: <strong>GAP</strong> (Generic Access Profile — discovery/connection) and <strong>GATT</strong> (Generic Attribute Profile — services and characteristics). A smart-bulb might expose service <code>0xFFE0</code> with characteristic <code>0xFFE1</code> for "color".</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Advertising</div><div class="card-body">Periodic broadcast (50 ms-1 s) of name + manufacturer data + service UUIDs. Walk down a street, see hundreds of beacons.</div></div>
<div class="calc-card"><div class="card-title">Pairing modes</div><div class="card-body">Just Works (0 PIN, MITM-able), Passkey Entry (6 digits, MITM-resistant if user enters), OOB (out-of-band: NFC tap), LE Secure Connections (P-256 ECDH, BT 4.2+).</div></div>
<div class="calc-card"><div class="card-title">Encryption</div><div class="card-body">AES-CCM with the Long-Term Key (LTK) derived during pairing.</div></div>
<div class="calc-card"><div class="card-title">Tools</div><div class="card-body"><code>bluetoothctl</code>, <code>nRF Connect</code>, <code>GATTacker</code> (proxy MITM), Ubertooth-One (sniff legacy BT only), Sniffle on nRF52840 (BLE 5).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. KNOB, BLURtooth, BLESA — The BLE Hall of Shame</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">KNOB (CVE-2019-9506)</div><div class="card-body">Antonioli, Tippenhauer, Rasmussen, USENIX 2019. Negotiate encryption key down to <strong>1 byte</strong> entropy in classic Bluetooth. 1 byte = 256 possible keys — instant brute force. Patched, but devices in the wild remain vulnerable.</div></div>
<div class="calc-card"><div class="card-title">BLURtooth (CVE-2020-15802)</div><div class="card-body">Cross-Transport Key Derivation lets a paired BLE device overwrite a previously paired BR/EDR (classic) key with a weaker one — escalation across transports.</div></div>
<div class="calc-card"><div class="card-title">BLESA (USENIX 2020)</div><div class="card-body">Reconnection authentication flaws — many BLE stacks accept un-authenticated GATT writes after reconnection if user-app code didn't re-verify.</div></div>
<div class="calc-card"><div class="card-title">Just-Works MITM</div><div class="card-body">If both devices support LE Legacy Just Works pairing, an attacker between them can MITM with no detection. Defense: require LE Secure Connections (BT 4.2+) and reject downgrades.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. BLE Pairing State Machine in Python</h2>
<p class="l-text">Below: a faithful skeleton of LE Legacy pairing showing how a Just-Works MITM operates. Two devices, an attacker in the middle who terminates pairing on each side and forwards key-exchange messages with substituted keys.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import secrets, hashlib

def hkdf(*parts):  # toy KDF
    return hashlib.sha256(b"||".join(parts)).digest()[:16]

class BLEParty:
    def __init__(self, name, mode="JustWorks"):
        self.name = name; self.mode = mode
        self.tk = b"\\x00"*16 if mode == "JustWorks" else secrets.token_bytes(16)
        self.peer_random = None
        self.our_random  = secrets.token_bytes(16)
    def confirm(self):       # value sent in pairing-confirm packet
        return hkdf(self.tk, self.our_random)
    def random(self):        # value sent in pairing-random packet
        return self.our_random
    def derive_stk(self, peer_random):
        self.peer_random = peer_random
        return hkdf(self.tk, self.our_random, peer_random)

# === Honest pairing ===
A, B = BLEParty("Phone"), BLEParty("Smartlock")
A_conf, B_conf = A.confirm(), B.confirm()    # exchanged
A_rand, B_rand = A.random(),  B.random()
stk_A = A.derive_stk(B_rand)
stk_B = B.derive_stk(A_rand)
print(f"Honest STKs match? {stk_A == stk_B}")
print(f"  STK_A = {stk_A.hex()}")
print(f"  STK_B = {stk_B.hex()}")

# === Just-Works MITM ===
print("\\n--- MITM scenario ---")
A   = BLEParty("Phone")
B   = BLEParty("Smartlock")
M_a = BLEParty("MITM->A")     # attacker pretends to be B, talking to A
M_b = BLEParty("MITM->B")     # attacker pretends to be A, talking to B

# A &lt;-&gt; M_a complete a full "pairing" with M_a's randoms
stk_A_legit = A.derive_stk(M_a.random())
stk_M_a     = M_a.derive_stk(A.random())
# B &lt;-&gt; M_b complete a full "pairing" with M_b's randoms
stk_B_legit = B.derive_stk(M_b.random())
stk_M_b     = M_b.derive_stk(B.random())

print(f"Phone-side STK   = {stk_A_legit.hex()}")
print(f"Smartlock-side STK = {stk_B_legit.hex()}")
print(f"MITM has BOTH keys; can re-encrypt traffic in the middle.")
print(f"Defense: LE Secure Connections uses ECDH and verifies numeric comparison.")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up Bluetooth Low Energy advertising / scanning — modern phones support Extended Advertising (BT 5.0+) for longer payloads. 2) Pairing mode: "Just Works" is vulnerable to MITM (no passkey verification), "Passkey Entry" or "Numeric Comparison" or LE Secure Connections (BT 4.2+) is required for sensitive devices. 3) GATT services expose characteristics with read / write / notify properties — mark sensitive ones encrypted+authenticated, never readable by unbonded peers. 4) Long-term keys (LTK) are stored in the secure element; rotating them on lost-device events prevents stolen-watch eavesdropping on health data.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same Just-Works MITM demo. Confirm both pairings succeed independently and produce keys the attacker holds.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import secrets, hashlib

def kdf(*p): return hashlib.sha256(b"|".join(p)).digest()[:16]

def party():
    return {"tk": b"\\x00"*16, "rand": secrets.token_bytes(16)}

A, B, Ma, Mb = party(), party(), party(), party()

stk_A_legit = kdf(A["tk"], A["rand"], Ma["rand"])
stk_Ma      = kdf(Ma["tk"], Ma["rand"], A["rand"])
stk_B_legit = kdf(B["tk"], B["rand"], Mb["rand"])
stk_Mb      = kdf(Mb["tk"], Mb["rand"], B["rand"])

print("A side:", stk_A_legit.hex(), "==", stk_Ma.hex(), "?", stk_A_legit==stk_Ma)
print("B side:", stk_B_legit.hex(), "==", stk_Mb.hex(), "?", stk_B_legit==stk_Mb)
print("MITM holds two STKs; can read+forge in both directions.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Zigbee — Mesh, Keys, and Drama</h2>
<p class="l-text"><strong>Zigbee</strong> rides 802.15.4 (2.4 GHz with 16 channels at 2 MHz spacing, also sub-GHz variants). Three keys layer the security:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Network Key</div><div class="card-body">Symmetric, all nodes share. Encrypts the broadcast mesh.</div></div>
<div class="calc-card"><div class="card-title">Link Key</div><div class="card-body">Pairwise (some implementations). Used when joining the network — the network key is delivered encrypted under the link key.</div></div>
<div class="calc-card"><div class="card-title">Trust Center Key</div><div class="card-body">Master administrative key on the coordinator (Trust Center).</div></div>
<div class="calc-card"><div class="card-title">Default install code</div><div class="card-body">Many vendors use the well-known <code>5A6967426565416C6C69616E63653039</code> ("ZigBeeAlliance09") as default join key. Capture the join → decrypt the network key handed to the new device.</div></div>
</div>

<div class="calc-highlight">Tools: <strong>KillerBee</strong> (Joshua Wright, 2009), <strong>ZBOSS sniffer</strong>, <strong>Wireshark with NCP dissector</strong>, <strong>Sonoff Zigbee 3.0 USB dongle Plus</strong> (consumer-grade, ~$15). The "Z3sec" research line by Tobias Zillner et al. cataloged real-world key extraction in 2015.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. LoRaWAN — Long-Range, Low-Power, Big Surface</h2>
<p class="l-text"><strong>LoRaWAN</strong> uses LoRa's chirp-spread-spectrum modulation (sub-GHz, 868 MHz EU / 915 MHz US / 923 MHz Asia) for kilometers of range at &lt; 50 kbps. The MAC layer adds:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OTAA (Over-The-Air Activation)</div><div class="card-body">Device has AppKey burned in. Joins by exchanging Join-Request / Join-Accept; derives session keys (NwkSKey, AppSKey).</div></div>
<div class="calc-card"><div class="card-title">ABP (Activation By Personalization)</div><div class="card-body">Session keys hard-coded. No join exchange. <em>Easier to deploy, far easier to replay if frame-counter resets are mismanaged</em>.</div></div>
<div class="calc-card"><div class="card-title">Frame counters</div><div class="card-body">FCntUp, FCntDown — replay defense. Reset-on-reboot devices in ABP are catastrophic; OTAA derives fresh keys on rejoin.</div></div>
<div class="calc-card"><div class="card-title">Replay attacks</div><div class="card-body">Capture an uplink, replay it later — accepted if FCntUp wraps or device rebooted ABP. LoRaWAN 1.1 fixed many edge cases.</div></div>
<div class="calc-card"><div class="card-title">Tools</div><div class="card-body">RTL-SDR + GNU Radio + LoRa decoder; ChirpStack server for testing; Pwnagotchi-style analyzers.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The SDR Hardware Stack</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RTL-SDR (~$30)</div><div class="card-body">24 MHz–1.7 GHz, RX-only, 2.4 MS/s. Receive ADS-B, FM, GSM/LTE control, AM, ham. Entry-level legend.</div></div>
<div class="calc-card"><div class="card-title">HackRF One ($330)</div><div class="card-body">1 MHz–6 GHz half-duplex TX/RX, 20 MS/s. Workhorse for replay, jamming-research, custom modulation.</div></div>
<div class="calc-card"><div class="card-title">LimeSDR / BladeRF</div><div class="card-body">Full duplex, higher sample rates, more expensive. For real RF research.</div></div>
<div class="calc-card"><div class="card-title">Ubertooth One</div><div class="card-body">Bluetooth classic sniffer (NOT BLE). Now legacy; superseded by Sniffle for BLE 5.</div></div>
<div class="calc-card"><div class="card-title">Yardstick One</div><div class="card-body">300/433/900 MHz remote-control range. Garage doors, weather stations, KeeLoq.</div></div>
<div class="calc-card"><div class="card-title">Flipper Zero</div><div class="card-body">Pocket-friendly multi-tool. Sub-GHz, NFC, RFID, BadUSB. Massive popularity 2022+.</div></div>
</div>

<div class="calc-highlight">Software: <strong>GNU Radio Companion</strong> (graphical block-flow), <strong>Universal Radio Hacker</strong> (URH — Mester et al. 2018, decode unknown protocols from IQ samples), <strong>SDR# / SDRangel / GQRX</strong> for visual exploration. The Mike Walters tutorials and the Michael Ossmann "Software Defined Radio with HackRF" video series remain the canonical onramp.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Cross-Cutting Defenses</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>Always require LE Secure Connections (BT 4.2+) on BLE; reject downgrades.</li>
<li>Use unique per-device install codes on Zigbee — never default ZigBeeAlliance09.</li>
<li>OTAA over ABP on LoRaWAN, with non-volatile frame counters.</li>
<li>Application-layer authentication on top of any wireless link — never trust the radio alone.</li>
<li>Monitor: a passive SDR + Suricata-on-Zeek-on-Zigbee-frames-via-NCP gives wireless IDS at low cost.</li>
<li>Consider physical-layer fingerprinting (Tx clock skew, IQ imbalance) for high-stakes asset auth.</li>
</ol>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. A 30-Minute Wireless Lab Setup</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>Buy: HackRF + RTL-SDR + Sonoff Zigbee dongle + nRF52840 (Sniffle).</li>
<li>Install: GNU Radio + URH + KillerBee + nRF Sniffer for BLE.</li>
<li>Sniff your own kit: smart bulbs, fitness band, garage opener.</li>
<li>Replay your own remote (legal). Try jamming-then-listen. Capture a Zigbee join, decrypt with default install code.</li>
<li>Document. The community lives on writeups (Hackaday, Hexway, Quarkslab).</li>
</ol>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. Wireless protocol stack — attack surface by layer (visual)</h2>
<p class="l-text">A stacked-bar view of where known CVEs cluster across the BLE / Zigbee / LoRaWAN / Matter stacks. PHY exploits are rare but devastating (KNOB); pairing and key-management bugs dominate; application-layer flaws (Matter clusters, MQTT brokers) are growing fast in 2025-2026.</p>
<div id="plot-iot-l4-stack-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var grid = 'rgba(255,255,255,0.06)';
  var stacks = ['BLE','Zigbee','LoRaWAN','Matter/Thread'];
  var phy        = [3, 1, 2, 1];
  var link       = [9, 6, 3, 2];
  var network    = [5, 8, 7, 5];
  var pairKey    = [14,11, 6, 8];
  var transport  = [4, 3, 8, 6];
  var application= [7, 5, 4,12];
  var traces = [
    {name:'PHY',         x:stacks, y:phy,         type:'bar', marker:{color:'#6aa9ff'}},
    {name:'Link/MAC',    x:stacks, y:link,        type:'bar', marker:{color:'#4de87a'}},
    {name:'Network',     x:stacks, y:network,     type:'bar', marker:{color:'#ffd166'}},
    {name:'Pairing/Key', x:stacks, y:pairKey,     type:'bar', marker:{color:'#ff6b6b'}},
    {name:'Transport',   x:stacks, y:transport,   type:'bar', marker:{color:'#c44569'}},
    {name:'Application', x:stacks, y:application, type:'bar', marker:{color:accent}}
  ];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    barmode:'stack', xaxis:{title:'protocol stack', gridcolor:grid},
    yaxis:{title:'public CVEs (2018-2026, illustrative)', gridcolor:grid},
    margin:{t:50,r:20,b:60,l:70}, title:{text:'Wireless protocol attack surface by OSI-style layer', font:{color:text, size:14}}, height:380,
    legend:{orientation:'h', y:-0.18} };
  Plotly.newPlot('plot-iot-l4-stack-en', traces, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-iot-l4-stack-tr');
  if (trDiv) Plotly.newPlot('plot-iot-l4-stack-tr', traces, layout, {responsive:true, displayModeBar:false});
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The "pairing / key management" layer is where most wireless protocols bleed — Just-Works BLE, Zigbee install codes, LoRaWAN OTAA leaks. Matter inherits some pairing safety from its CHIP origins but introduces a new application-cluster surface that is still maturing.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BLE Just-Works pairing is MITM-able; require LE Secure Connections.</li>
<li>KNOB downgrade and BLURtooth showed the BT spec itself had cryptographic issues.</li>
<li>Zigbee uses default install codes that leak network keys at join time.</li>
<li>LoRaWAN OTAA &gt; ABP; frame-counter persistence is critical against replay.</li>
<li>HackRF + RTL-SDR + GNU Radio + URH = full radio lab for under $400.</li>
</ul>
</div>
<p class="l-text">Next, <strong>iot-L5</strong>: Industrial Control Systems — PLCs, Modbus/DNP3, Stuxnet, Triton, the Purdue model.</p>
</div>`,
tr: `<p class="l-text"><strong>Kablosuz katman, çoğu IoT ele geçirilmesinin gerçekten olduğu yerdir — herhangi bir web yöneticisi veya firmware hatasından çok önce.</strong> Radyo güvenlik duvarına almak daha zor, otoparkın diğer tarafından dinlemek daha kolay ve tarihsel olarak yetersiz test edilmiş kriptografi ile dolu. Tüketici ve kurumsal IoT için en önemli üç protokol — <strong>Bluetooth Low Energy</strong> (BLE, BT 4.0'da 2010), <strong>Zigbee</strong> (IEEE 802.15.4 PHY + ZCL yığını, 2003'ten beri) ve <strong>LoRaWAN</strong> (Semtech + LoRa Alliance, 2015) — her birinin on yıllık eşleştirme kusurları, anahtar-çıkarma tarifleri ve yeniden oynatma zafiyetleri geçmişi vardır. Donanım artık ucuz: 30 dolarlık <strong>HackRF One</strong>, 8 dolarlık <strong>RTL-SDR</strong>, bir Ubertooth, bir Sonoff Zigbee dongle, bir Adafruit Feather LoRa ve eksiksiz bir radyo laboratuvarınız var.</p>

<p class="l-text">Bu derste üçü için tehdit modelini ve güvenlik ayrıntılarını ele alıyoruz: BLE eşleştirme modları (Just Works / Passkey / OOB / LE Secure Connections), ünlü <strong>KNOB</strong> ve <strong>BLURtooth</strong> saldırıları, Zigbee'nin transport key + network key sistemi ve LeakedZigbee / KillerBee'nin onları nasıl çıkardığı, LoRaWAN OTAA vs ABP ve replay/rejoin tuzakları, ve SDR ekosistemi (HackRF, GNU Radio, Universal Radio Hacker). Bir BLE eşleştirme el sıkışmasının Python durum makinesi demosu ile bitiriyoruz — Just-Works MITM senaryosu dahil.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BLE: GAP/GATT, advertising paketleri, eşleştirme modları, KNOB, BLURtooth</li>
<li>Zigbee: 802.15.4 PHY, network/link/transport anahtarları, anahtar-çıkarma saldırıları</li>
<li>LoRaWAN: OTAA vs ABP, AppKey vs NwkSKey, frame counter replay savunmaları</li>
<li>SDR ekosistemi: HackRF (1 MHz–6 GHz yarı çift yönlü), RTL-SDR (24 MHz–1.7 GHz yalnızca-RX), Ubertooth, GNU Radio</li>
<li>Ham IQ'dan protokol kod çözümü için Universal Radio Hacker (URH)</li>
<li>Bir BLE eşleştirme durum makinesi oluşturun ve bir Just-Works MITM izleyin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. 60 Saniyede BLE</h2>
<p class="l-text">Bluetooth Low Energy 3 kanalda (37, 38, 39 — Wi-Fi örtüşmesinden kaçınmak için seçildi) advertising yapar, sonra bağlantılar uyarlanabilir frekans atlamayla 37 veri kanalı arasında atlar. İki API katmanı önemlidir: <strong>GAP</strong> (Generic Access Profile — keşif/bağlantı) ve <strong>GATT</strong> (Generic Attribute Profile — hizmetler ve karakteristikler). Bir akıllı ampul "renk" için <code>0xFFE0</code> hizmetini <code>0xFFE1</code> karakteristiği ile gösterebilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Advertising</div><div class="card-body">Periyodik yayın (50 ms-1 s) ad + üretici verisi + hizmet UUID'leri. Bir caddede yürüyün, yüzlerce beacon görün.</div></div>
<div class="calc-card"><div class="card-title">Eşleştirme modları</div><div class="card-body">Just Works (0 PIN, MITM-edilebilir), Passkey Entry (6 basamak, kullanıcı girerse MITM-dirençli), OOB (bant dışı: NFC dokunma), LE Secure Connections (P-256 ECDH, BT 4.2+).</div></div>
<div class="calc-card"><div class="card-title">Şifreleme</div><div class="card-body">Eşleştirme sırasında türetilen Long-Term Key (LTK) ile AES-CCM.</div></div>
<div class="calc-card"><div class="card-title">Araçlar</div><div class="card-body"><code>bluetoothctl</code>, <code>nRF Connect</code>, <code>GATTacker</code> (proxy MITM), Ubertooth-One (yalnızca eski BT'yi sniff eder), nRF52840'ta Sniffle (BLE 5).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. KNOB, BLURtooth, BLESA — BLE Utanç Salonu</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">KNOB (CVE-2019-9506)</div><div class="card-body">Antonioli, Tippenhauer, Rasmussen, USENIX 2019. Klasik Bluetooth'ta şifreleme anahtarını <strong>1 bayt</strong> entropiye düşür. 1 bayt = 256 olası anahtar — anında kaba kuvvet. Yamalı, ama vahşi doğadaki cihazlar savunmasız kalıyor.</div></div>
<div class="calc-card"><div class="card-title">BLURtooth (CVE-2020-15802)</div><div class="card-body">Cross-Transport Key Derivation, eşleştirilmiş bir BLE cihazının daha önce eşleştirilmiş bir BR/EDR (klasik) anahtarını daha zayıf bir tane ile üzerine yazmasına izin verir — taşıyıcılar arası yükseltme.</div></div>
<div class="calc-card"><div class="card-title">BLESA (USENIX 2020)</div><div class="card-body">Yeniden bağlantı kimlik doğrulama kusurları — birçok BLE yığını, kullanıcı uygulama kodu yeniden doğrulamadıysa, yeniden bağlantıdan sonra kimliği doğrulanmamış GATT yazımlarını kabul eder.</div></div>
<div class="calc-card"><div class="card-title">Just-Works MITM</div><div class="card-body">Her iki cihaz da LE Legacy Just Works eşleştirmesini destekliyorsa, aralarındaki bir saldırgan tespit olmadan MITM yapabilir. Savunma: LE Secure Connections (BT 4.2+) gerektirin ve düşürmeleri reddedin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Python'da BLE Eşleştirme Durum Makinesi</h2>
<p class="l-text">Aşağıda: bir Just-Works MITM'in nasıl çalıştığını gösteren LE Legacy eşleştirmesinin sadık bir iskeleti. İki cihaz, ortada her tarafta eşleştirmeyi sonlandıran ve değiştirilmiş anahtarlarla anahtar-değişim mesajlarını ileten bir saldırgan.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import secrets, hashlib

def hkdf(*parts):  # oyuncak KDF
    return hashlib.sha256(b"||".join(parts)).digest()[:16]

class BLEParty:
    def __init__(self, name, mode="JustWorks"):
        self.name = name; self.mode = mode
        self.tk = b"\\x00"*16 if mode == "JustWorks" else secrets.token_bytes(16)
        self.peer_random = None
        self.our_random  = secrets.token_bytes(16)
    def confirm(self):       # pairing-confirm paketinde gönderilen değer
        return hkdf(self.tk, self.our_random)
    def random(self):        # pairing-random paketinde gönderilen değer
        return self.our_random
    def derive_stk(self, peer_random):
        self.peer_random = peer_random
        return hkdf(self.tk, self.our_random, peer_random)

# === Dürüst eşleştirme ===
A, B = BLEParty("Phone"), BLEParty("Smartlock")
A_conf, B_conf = A.confirm(), B.confirm()    # değişildi
A_rand, B_rand = A.random(),  B.random()
stk_A = A.derive_stk(B_rand)
stk_B = B.derive_stk(A_rand)
print(f"Honest STKs match? {stk_A == stk_B}")
print(f"  STK_A = {stk_A.hex()}")
print(f"  STK_B = {stk_B.hex()}")

# === Just-Works MITM ===
print("\\n--- MITM senaryo ---")
A   = BLEParty("Phone")
B   = BLEParty("Smartlock")
M_a = BLEParty("MITM->A")     # saldırgan B'ymiş gibi davranır, A ile konuşur
M_b = BLEParty("MITM->B")     # saldırgan A'ymış gibi davranır, B ile konuşur

# A &lt;-&gt; M_a, M_a'nın rastgeleleri ile tam bir "eşleştirme" tamamlar
stk_A_legit = A.derive_stk(M_a.random())
stk_M_a     = M_a.derive_stk(A.random())
# B &lt;-&gt; M_b, M_b'nin rastgeleleri ile tam bir "eşleştirme" tamamlar
stk_B_legit = B.derive_stk(M_b.random())
stk_M_b     = M_b.derive_stk(B.random())

print(f"Phone-side STK   = {stk_A_legit.hex()}")
print(f"Smartlock-side STK = {stk_B_legit.hex()}")
print(f"MITM HER İKİ anahtara da sahip; ortada trafiği yeniden şifreleyebilir.")
print(f"Savunma: LE Secure Connections ECDH kullanır ve sayısal karşılaştırmayı doğrular.")
</code></pre></div>
<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Bluetooth Low Energy advertising / scanning kurar — modern telefonlar daha uzun payload için Extended Advertising'i (BT 5.0+) destekler. 2) Eşleştirme modu: "Just Works" MITM'e açıktır (passkey doğrulaması yok), hassas cihazlar için "Passkey Entry" veya "Numeric Comparison" veya LE Secure Connections (BT 4.2+) gerekir. 3) GATT servisleri read / write / notify property'leriyle karakteristik açar — hassas olanları encrypted+authenticated işaretle, eşleşmemiş peer'lar tarafından ASLA okunabilir olmasın. 4) Long-term key'ler (LTK) secure element'te saklanır; kayıp-cihaz olaylarında rotate etmek çalınan saatten sağlık verisi dinlemesini engeller.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı Just-Works MITM demosu. Her iki eşleştirmenin de bağımsız olarak başarılı olduğunu ve saldırganın tuttuğu anahtarları ürettiğini doğrulayın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import secrets, hashlib

def kdf(*p): return hashlib.sha256(b"|".join(p)).digest()[:16]

def party():
    return {"tk": b"\\x00"*16, "rand": secrets.token_bytes(16)}

A, B, Ma, Mb = party(), party(), party(), party()

stk_A_legit = kdf(A["tk"], A["rand"], Ma["rand"])
stk_Ma      = kdf(Ma["tk"], Ma["rand"], A["rand"])
stk_B_legit = kdf(B["tk"], B["rand"], Mb["rand"])
stk_Mb      = kdf(Mb["tk"], Mb["rand"], B["rand"])

print("A side:", stk_A_legit.hex(), "==", stk_Ma.hex(), "?", stk_A_legit==stk_Ma)
print("B side:", stk_B_legit.hex(), "==", stk_Mb.hex(), "?", stk_B_legit==stk_Mb)
print("MITM iki STK tutar; her iki yönde de okuyabilir+sahteleştirebilir.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Zigbee — Mesh, Anahtarlar ve Drama</h2>
<p class="l-text"><strong>Zigbee</strong> 802.15.4 üzerinde binmiştir (2 MHz aralıklı 16 kanalla 2.4 GHz, ayrıca alt-GHz varyantları). Üç anahtar güvenliği katmanlandırır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Network Key</div><div class="card-body">Simetrik, tüm düğümler paylaşır. Yayın mesh'i şifreler.</div></div>
<div class="calc-card"><div class="card-title">Link Key</div><div class="card-body">Çift yönlü (bazı uygulamalar). Ağa katılırken kullanılır — network key, link key altında şifrelenmiş olarak teslim edilir.</div></div>
<div class="calc-card"><div class="card-title">Trust Center Key</div><div class="card-body">Koordinatördeki ana yönetim anahtarı (Trust Center).</div></div>
<div class="calc-card"><div class="card-title">Varsayılan kurulum kodu</div><div class="card-body">Birçok satıcı varsayılan katılım anahtarı olarak iyi bilinen <code>5A6967426565416C6C69616E63653039</code>'u ("ZigBeeAlliance09") kullanır. Katılımı yakala → yeni cihaza verilen network key'i çöz.</div></div>
</div>

<div class="calc-highlight">Araçlar: <strong>KillerBee</strong> (Joshua Wright, 2009), <strong>ZBOSS sniffer</strong>, <strong>NCP dissector ile Wireshark</strong>, <strong>Sonoff Zigbee 3.0 USB dongle Plus</strong> (tüketici sınıfı, ~15 dolar). Tobias Zillner ve diğerlerinin "Z3sec" araştırma serisi 2015'te gerçek dünya anahtar çıkarımını kataloglandı.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. LoRaWAN — Uzun Menzil, Düşük Güç, Büyük Yüzey</h2>
<p class="l-text"><strong>LoRaWAN</strong>, &lt; 50 kbps'de kilometrelerce menzil için LoRa'nın chirp-spread-spectrum modülasyonunu (alt-GHz, 868 MHz EU / 915 MHz ABD / 923 MHz Asya) kullanır. MAC katmanı şunları ekler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">OTAA (Hava Üzerinden Aktivasyon)</div><div class="card-body">Cihazın AppKey'i yakılmıştır. Join-Request / Join-Accept değiştirerek katılır; oturum anahtarlarını (NwkSKey, AppSKey) türetir.</div></div>
<div class="calc-card"><div class="card-title">ABP (Kişiselleştirme ile Aktivasyon)</div><div class="card-body">Oturum anahtarları sabit kodlanmış. Katılım değişimi yok. <em>Dağıtmak daha kolay, frame-counter sıfırlamaları yanlış yönetilirse yeniden oynatmak çok daha kolay</em>.</div></div>
<div class="calc-card"><div class="card-title">Frame counter'lar</div><div class="card-body">FCntUp, FCntDown — replay savunması. ABP'de yeniden başlatmada-sıfırlanan cihazlar yıkıcıdır; OTAA yeniden katılmada yeni anahtarlar türetir.</div></div>
<div class="calc-card"><div class="card-title">Replay saldırıları</div><div class="card-body">Bir uplink yakalayın, sonra yeniden oynatın — FCntUp sarılırsa veya cihaz ABP yeniden başlattıysa kabul edilir. LoRaWAN 1.1 birçok kenar durumu düzeltti.</div></div>
<div class="calc-card"><div class="card-title">Araçlar</div><div class="card-body">RTL-SDR + GNU Radio + LoRa kod çözücü; test için ChirpStack sunucusu; Pwnagotchi tarzı analizörler.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SDR Donanım Yığını</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RTL-SDR (~30 dolar)</div><div class="card-body">24 MHz–1.7 GHz, yalnızca-RX, 2.4 MS/s. ADS-B, FM, GSM/LTE kontrol, AM, ham alın. Giriş seviyesi efsanesi.</div></div>
<div class="calc-card"><div class="card-title">HackRF One (330 dolar)</div><div class="card-body">1 MHz–6 GHz yarı çift yönlü TX/RX, 20 MS/s. Replay, jamming-araştırması, özel modülasyon için iş atı.</div></div>
<div class="calc-card"><div class="card-title">LimeSDR / BladeRF</div><div class="card-body">Tam çift yönlü, daha yüksek örnekleme oranları, daha pahalı. Gerçek RF araştırması için.</div></div>
<div class="calc-card"><div class="card-title">Ubertooth One</div><div class="card-body">Bluetooth klasik sniffer (BLE DEĞİL). Şimdi eski; BLE 5 için Sniffle tarafından geçildi.</div></div>
<div class="calc-card"><div class="card-title">Yardstick One</div><div class="card-body">300/433/900 MHz uzaktan kumanda menzili. Garaj kapıları, hava istasyonları, KeeLoq.</div></div>
<div class="calc-card"><div class="card-title">Flipper Zero</div><div class="card-body">Cep dostu çok aletli. Alt-GHz, NFC, RFID, BadUSB. 2022+'da büyük popülerlik.</div></div>
</div>

<div class="calc-highlight">Yazılım: <strong>GNU Radio Companion</strong> (grafiksel blok-akış), <strong>Universal Radio Hacker</strong> (URH — Mester vd. 2018, IQ örneklerinden bilinmeyen protokolleri kod çöz), görsel keşif için <strong>SDR# / SDRangel / GQRX</strong>. Mike Walters eğitimleri ve Michael Ossmann "Software Defined Radio with HackRF" video serisi kanonik giriş yolu olmaya devam ediyor.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Çapraz Kesen Savunmalar</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>BLE'de her zaman LE Secure Connections (BT 4.2+) gerektirin; düşürmeleri reddedin.</li>
<li>Zigbee'de cihaz başına benzersiz kurulum kodları kullanın — asla varsayılan ZigBeeAlliance09.</li>
<li>LoRaWAN'da ABP yerine OTAA, kalıcı frame counter'lar ile.</li>
<li>Herhangi bir kablosuz bağlantının üstünde uygulama-katmanı kimlik doğrulaması — radyoya tek başına asla güvenmeyin.</li>
<li>İzleme: pasif bir SDR + Suricata-on-Zeek-on-Zigbee-frames-via-NCP düşük maliyetle kablosuz IDS verir.</li>
<li>Yüksek değerli varlık kimlik doğrulaması için fiziksel-katman parmak izi (Tx saat sapması, IQ dengesizliği) düşünün.</li>
</ol>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 30 Dakikalık Kablosuz Lab Kurulumu</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>Satın alın: HackRF + RTL-SDR + Sonoff Zigbee dongle + nRF52840 (Sniffle).</li>
<li>Kurun: GNU Radio + URH + KillerBee + BLE için nRF Sniffer.</li>
<li>Kendi kitinizi sniff edin: akıllı ampuller, fitness bandı, garaj açıcı.</li>
<li>Kendi uzaktan kumandanızı yeniden oynatın (yasal). Jamming-sonra-dinle deneyin. Bir Zigbee katılımı yakalayın, varsayılan kurulum kodu ile çözün.</li>
<li>Belgeleyin. Topluluk yazılarda yaşar (Hackaday, Hexway, Quarkslab).</li>
</ol>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. Kablosuz protokol yığını — katmana göre saldırı yüzeyi (görsel)</h2>
<p class="l-text">BLE / Zigbee / LoRaWAN / Matter yığınlarında bilinen CVE'lerin nerede kümelendiğinin yığılmış-bar görünümü. PHY açıkları nadirdir ama yıkıcıdır (KNOB); eşleştirme ve anahtar yönetim hataları baskındır; uygulama-katmanı kusurları (Matter cluster'ları, MQTT broker'ları) 2025-2026'da hızla artıyor.</p>
<div id="plot-iot-l4-stack-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> "Eşleştirme / anahtar yönetimi" katmanı çoğu kablosuz protokolün kanadığı yerdir — Just-Works BLE, Zigbee kurulum kodları, LoRaWAN OTAA sızıntıları. Matter, CHIP kökenlerinden bazı eşleştirme güvenliğini miras alır ama hâlâ olgunlaşmakta olan yeni bir uygulama-cluster yüzeyi getirir.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; Sonraki Adım</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BLE Just-Works eşleştirmesi MITM-edilebilir; LE Secure Connections gerektirin.</li>
<li>KNOB düşürme ve BLURtooth, BT spec'inin kendisinin kriptografik sorunları olduğunu gösterdi.</li>
<li>Zigbee, katılım zamanında network anahtarlarını sızdıran varsayılan kurulum kodları kullanır.</li>
<li>LoRaWAN OTAA &gt; ABP; frame counter kalıcılığı yeniden oynatmaya karşı kritiktir.</li>
<li>HackRF + RTL-SDR + GNU Radio + URH = 400 doların altında tam radyo laboratuvarı.</li>
</ul>
</div>
<p class="l-text">Sonraki, <strong>iot-L5</strong>: Endüstriyel Kontrol Sistemleri — PLC'ler, Modbus/DNP3, Stuxnet, Triton, Purdue modeli.</p>
</div>`
};
