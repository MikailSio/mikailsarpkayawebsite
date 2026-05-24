window.NETSEC_L7 = {
en: `<p class="l-text">In October 2017 Mathy Vanhoef, then a postdoc at KU Leuven, published <em>KRACK</em> — Key Reinstallation Attack — exposing a flaw in the WPA2 four-way handshake that allowed an attacker on the wireless segment to force key reuse and decrypt frames (Vanhoef &amp; Piessens, CCS 2017). Every Wi-Fi device in the world was affected. Patches rolled out for months; many embedded devices never received them. Vanhoef returned in 2018 with Dragonblood (against WPA3-SAE) and 2021 with FragAttacks. Wireless security is a graveyard of "this time it's bulletproof" claims — WEP (1997, broken 2001), WPA-TKIP (2003, broken 2008), WPA2 (2004, KRACK 2017), WPA3 (2018, Dragonblood 2019). Each generation patches the last; each is broken within a few years.</p>
<p class="l-text">Cellular adds its own layer. 2G GSM is trivially intercepted by IMSI catchers (Stingrays); 3G UMTS leaks IMSI in plaintext during handoff; 4G LTE is vulnerable to LTEInspector (Hussain et al. NDSS 2018) replay attacks. 5G's Service-Based Architecture introduces network slicing (good for isolation, attractive for slice-hopping attacks) and Subscription Concealed Identifier (SUCI) which finally encrypts IMSI — but base station impersonation persists. Bluetooth Low Energy adds further chaos: KNOB (2019), BIAS (2020), BlueFrag (2020). This lesson surveys WPA3, KRACK, BLE flaws, 5G architecture, network slicing, and IMSI catchers, with a runnable WPA3 SAE state machine in pure Python.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The WEP / WPA / WPA2 / WPA3 lineage and their break histories</li>
<li>KRACK (Vanhoef 2017) — key reinstallation in the four-way handshake</li>
<li>WPA3 SAE (Dragonfly handshake) and Dragonblood side-channels</li>
<li>BLE flaws: KNOB, BIAS, BlueFrag</li>
<li>5G architecture: SBA, AMF, SMF, UPF, network slicing, SUCI</li>
<li>IMSI catchers and base-station impersonation</li>
<li>Implementing the WPA3 SAE handshake state machine in Python</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Wi-Fi Security Lineage</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">WEP (1997)</div><div class="card-body">RC4 with 24-bit IV. Broken 2001 (FMS attack), trivial since aircrack-ng. Never use.</div></div>
<div class="calc-card"><div class="card-title">WPA-TKIP (2003)</div><div class="card-body">RC4 with per-packet keys. MIC vulnerability (Beck-Tews 2008). Deprecated.</div></div>
<div class="calc-card"><div class="card-title">WPA2-CCMP (2004)</div><div class="card-body">AES-CCM. Broken handshake (KRACK 2017). Still default on most networks but PMF mandatory now.</div></div>
<div class="calc-card"><div class="card-title">WPA3 (2018)</div><div class="card-body">SAE (Dragonfly). Forward secrecy, dictionary-attack resistance. Dragonblood side-channels (2019) patched.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. KRACK — Key Reinstallation Attack</h2>
<p class="l-text">Vanhoef's 2017 attack exploits the four-way handshake. The supplicant installs the pairwise key after receiving message 3; if the attacker replays message 3, the supplicant <em>reinstalls</em> the same key, resetting the nonce and packet counter. Stream ciphers with reused nonces leak plaintext via XOR — for AES-CCM this lets the attacker decrypt any subsequent frame.</p>
<div class="katex-block">$$P_1 \\oplus P_2 = (P_1 \\oplus K) \\oplus (P_2 \\oplus K) = C_1 \\oplus C_2$$</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">The mitigation is "do not reinstall the key on retransmission" — a one-line state-machine fix that took the Wi-Fi alliance and OS vendors months to roll out coherently. Android's <em>wpa_supplicant</em> bug was particularly severe: reinstall reset the key to all-zeros, allowing trivial decryption.</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. WPA3 SAE Handshake — Pure Python State Machine</h2>
<p class="l-text">SAE (Simultaneous Authentication of Equals) is the Dragonfly handshake: a Diffie-Hellman exchange anchored on a password-derived element. Both peers commit to a random scalar, exchange commitments, derive a session key, and confirm. Forward secrecy because the DH exponents are ephemeral; password-based but not vulnerable to offline dictionary attacks because the password is never directly used in the wire.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Simplified WPA3 SAE handshake state machine — pure Python</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, hmac, secrets

# Toy DH parameters (real SAE uses ECC P-256 / Curve25519)
P = (1 &lt;&lt; 521) - 1   # large prime (Mersenne)
G = 2

def H(x):
    return int.from_bytes(hashlib.sha256(str(x).encode()).digest(), 'big')

def password_element(password, mac_a, mac_b):
    # Hash-to-group: real SAE uses iterated hunting-and-pecking
    seed = H(f"{password}|{min(mac_a,mac_b)}|{max(mac_a,mac_b)}")
    return pow(G, seed % (P-1), P)

class SAEPeer:
    def __init__(self, name, password, mac):
        self.name, self.pw, self.mac = name, password, mac
        self.pe = None; self.scalar = None; self.element = None
    def commit(self, peer_mac):
        self.pe = password_element(self.pw, self.mac, peer_mac)
        rand = secrets.randbelow(P-2) + 1
        mask = secrets.randbelow(P-2) + 1
        self.scalar = (rand + mask) % (P - 1)
        self.element = pow(self.pe, -mask % (P-1), P)
        return (self.scalar, self.element)
    def confirm(self, peer_scalar, peer_element):
        # Shared secret K = (peer_element * peer_pe^peer_scalar)^own_rand
        # Simplified: hash(both scalars + both elements + pe)
        K = H((self.scalar, peer_scalar, self.element, peer_element, self.pe))
        return hashlib.sha256(str(K).encode()).hexdigest()[:16]

A = SAEPeer("AP",  "correct_horse", mac=0xAA)
B = SAEPeer("STA", "correct_horse", mac=0xBB)
sa, ea = A.commit(B.mac)
sb, eb = B.commit(A.mac)
ka = A.confirm(sb, eb)
kb = B.confirm(sa, ea)
print(f"AP-derived session key:  {ka}")
print(f"STA-derived session key: {kb}")
print("Match:", ka == kb)

# Wrong password = different keys
W = SAEPeer("STA", "wrong_password", mac=0xBB)
sw, ew = W.commit(A.mac)
kw = W.confirm(sa, ea)
print(f"Wrong-password session key: {kw}  (mismatch)")
</code></pre></div>
</div>
<p class="l-text">In real SAE the math runs on elliptic curves and there are anti-clogging timeouts to defeat DoS. The state machine is the same: commit, exchange, confirm, derive PMK.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Dragonblood — Side Channels in SAE</h2>
<p class="l-text">Vanhoef &amp; Ronen (2019) discovered timing and cache side channels in the original SAE hash-to-group ("hunting and pecking"): the loop iteration count depended on the password and could be observed remotely. They demonstrated full password recovery for short passwords. Mitigation: hash-to-curve via SSWU (RFC 9380) with constant-time execution. Patched in hostap 2.10 and Linux WPA supplicant 2024.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Bluetooth and BLE Flaws</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">KNOB (2019)</div><div class="card-body">Antonioli et al. — negotiate down BR/EDR encryption key entropy to 1 byte. Breaks confidentiality.</div></div>
<div class="calc-card"><div class="card-title">BIAS (2020)</div><div class="card-body">Antonioli et al. — impersonate a paired device by skipping authentication of the slave.</div></div>
<div class="calc-card"><div class="card-title">BlueFrag (2020)</div><div class="card-body">CVE-2020-0022 in Android Bluetooth daemon. Remote code execution from L2CAP packet.</div></div>
<div class="calc-card"><div class="card-title">BleedingTooth (2020)</div><div class="card-body">Andy Nguyen — Linux Bluetooth kernel RCE chain. CVE-2020-12351.</div></div>
</div>
<p class="l-text">BLE is now the dominant attack surface on consumer IoT — every smart bulb, doorbell, and earbud is a potential foothold. Audit your firmware update mechanism and BLE pairing flow as part of any device threat model.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. 5G Architecture and Threat Model</h2>
<p class="l-text">5G replaces 4G's monolithic Evolved Packet Core with a Service-Based Architecture (SBA): network functions communicate over HTTP/2 + JSON. Key functions:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AMF</div><div class="card-body">Access and Mobility Management — handles registration, handoff.</div></div>
<div class="calc-card"><div class="card-title">SMF</div><div class="card-body">Session Management — establishes PDU sessions for user plane.</div></div>
<div class="calc-card"><div class="card-title">UPF</div><div class="card-body">User Plane Function — packet routing, QoS, NAT. Distributed at edge for low latency.</div></div>
<div class="calc-card"><div class="card-title">AUSF + UDM</div><div class="card-body">Authentication Server + Unified Data Management. Holds long-term keys, performs 5G-AKA.</div></div>
</div>
<p class="l-text">Threat surface: HTTP/2 between NFs (mTLS mandatory but often misconfigured), API token validation, network slice isolation, edge UPF compromise. The 3GPP TS 33.501 specs codify the security architecture, but academic auditors (Hussain, Bertino) routinely find protocol gaps.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Network Slicing — Isolation as a Service</h2>
<p class="l-text">A 5G "slice" is a virtual end-to-end network with its own SLA. eMBB (mobile broadband), URLLC (low-latency), mMTC (IoT). Each slice has its own AMF/SMF/UPF instances. Security claim: a compromised slice cannot affect others. Reality: slices share physical RAN; container escapes in the NF orchestrator (typically Kubernetes-based) can cross slice boundaries (Khan et al. 2022). Slice-hopping is an active research area.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (5G NF policy schema check)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json, re
slices = [
  {'sst':1, 'sd':'eMBB',   'tenant':'consumer'},
  {'sst':2, 'sd':'URLLC',  'tenant':'factory_robot'},
  {'sst':3, 'sd':'mMTC',   'tenant':'iot_meter'},
]
def nssai_ok(s):
    return s['sst'] in (1,2,3) and re.fullmatch(r'[A-Za-z0-9_]+', s['sd'])
for s in slices:
    print(s, '-&gt; valid' if nssai_ok(s) else '-&gt; reject')
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) The <code>slices</code> list describes three S-NSSAI entries (Single Network Slice Selection Assistance Information) — each carries an <code>sst</code> (Slice/Service Type: 1=eMBB, 2=URLLC, 3=mMTC per 3GPP TS 23.501) and a free-form <code>sd</code> (Slice Differentiator) that tenants such as a factory robot fleet or smart-meter operator pick to isolate their workloads. 2) <code>nssai_ok(s)</code> validates the policy schema before the AMF accepts it — <code>sst in (1,2,3)</code> rejects unknown service types and <code>re.fullmatch(r'[A-Za-z0-9_]+', s['sd'])</code> blocks injection characters in the differentiator. 3) Without this gate, a malicious tenant could register an <code>sd</code> containing path-traversal or NF-routing metacharacters and pivot across slices through the orchestrator. 4) Production deployments add JSON Schema validation, mTLS between the NSSF and AMF, and OPA policies that enforce tenant-to-slice mapping — slice-hopping research (Khan et al. 2022) shows that schema-only validation is necessary but not sufficient.</p>

</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. IMSI Catchers and SUCI</h2>
<p class="l-text">An IMSI catcher (Stingray, ICMI) is a fake base station that broadcasts higher signal than nearby real towers, forcing handsets to associate. Pre-5G, the catcher could solicit IMSI in plaintext and downgrade encryption. 5G introduces <em>SUCI</em> (Subscription Concealed Identifier): the device encrypts IMSI to the home network's public key (ECIES) before transmitting. The catcher gets ciphertext only. But — 5G handsets often fall back to 4G/3G in poor coverage, where the legacy IMSI exchange is still observable. Detection: apps like SnoopSnitch, AIMSICD; network-side: anomaly detection on cell ID transitions.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Defenses and Best Practices</h2>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Wi-Fi: WPA3-only networks where possible, PMF mandatory, 802.1X with EAP-TLS for enterprise.</li>
<li>BLE: pairing modes — never use Just Works for production, prefer Numeric Comparison or OOB.</li>
<li>5G: enforce SUCI, disable 2G fallback, deploy network slicing with K8s namespace isolation + OPA.</li>
<li>Mobile devices: monitor for cell ID anomalies, run encrypted DNS (DoH/DoT) over cellular, use VPN.</li>
<li>Audit: regular RF surveys, packet captures with Wireshark on 802.11 monitor mode, BLE sniffer on Ubertooth/nRF52840 dongles.</li>
</ul>
</div>`,
tr: `<p class="l-text">Ekim 2017'de o zamanlar KU Leuven'de postdoc olan Mathy Vanhoef <em>KRACK</em>'ı — Key Reinstallation Attack — yayımladı, bu kablosuz segmentteki bir saldırganın anahtar yeniden kullanımını zorlamasına ve çerçeveleri çözmesine izin veren WPA2 dört-yönlü el sıkışmasındaki bir açığı ortaya koydu (Vanhoef &amp; Piessens, CCS 2017). Dünyadaki her Wi-Fi cihazı etkilendi. Yamalar aylarca yayıldı; birçok gömülü cihaz bunları asla almadı. Vanhoef 2018'de Dragonblood ile (WPA3-SAE'ye karşı) ve 2021'de FragAttacks ile döndü. Kablosuz güvenlik "bu sefer kurşun geçirmez" iddialarının mezarlığıdır — WEP (1997, 2001'de kırıldı), WPA-TKIP (2003, 2008'de kırıldı), WPA2 (2004, KRACK 2017), WPA3 (2018, Dragonblood 2019). Her nesil sonuncuyu yamalar; her biri birkaç yıl içinde kırılır.</p>
<p class="l-text">Hücresel kendi katmanını ekler. 2G GSM IMSI catcher'lar (Stingray) tarafından önemsizce yakalanır; 3G UMTS handoff sırasında IMSI'yi düz metinde sızdırır; 4G LTE LTEInspector (Hussain vd. NDSS 2018) replay saldırılarına karşı kırılgandır. 5G'nin Service-Based Architecture'ı network slicing tanıtır (izolasyon için iyi, slice-hopping saldırıları için cazip) ve sonunda IMSI'yi şifreleyen Subscription Concealed Identifier (SUCI) — ama base station taklidi devam eder. Bluetooth Low Energy daha fazla kaos ekler: KNOB (2019), BIAS (2020), BlueFrag (2020). Bu ders saf Python'da çalıştırılabilir bir WPA3 SAE durum makinesiyle WPA3, KRACK, BLE açıklarını, 5G mimarisini, network slicing'i ve IMSI catcher'ları inceler.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>WEP / WPA / WPA2 / WPA3 soyağacı ve kırılma geçmişleri</li>
<li>KRACK (Vanhoef 2017) — dört-yönlü el sıkışmada anahtar yeniden kurulumu</li>
<li>WPA3 SAE (Dragonfly el sıkışması) ve Dragonblood yan kanalları</li>
<li>BLE açıkları: KNOB, BIAS, BlueFrag</li>
<li>5G mimarisi: SBA, AMF, SMF, UPF, network slicing, SUCI</li>
<li>IMSI catcher'lar ve base-station taklidi</li>
<li>WPA3 SAE el sıkışma durum makinesini Python'da uygulamak</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Wi-Fi Güvenlik Soyağacı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">WEP (1997)</div><div class="card-body">24-bit IV ile RC4. 2001'de kırıldı (FMS saldırısı), aircrack-ng'den beri önemsiz. Asla kullanma.</div></div>
<div class="calc-card"><div class="card-title">WPA-TKIP (2003)</div><div class="card-body">Paket-başı anahtarlarla RC4. MIC zafiyeti (Beck-Tews 2008). Kullanımdan kaldırıldı.</div></div>
<div class="calc-card"><div class="card-title">WPA2-CCMP (2004)</div><div class="card-body">AES-CCM. Bozuk el sıkışma (KRACK 2017). Çoğu ağda hâlâ varsayılan ama PMF artık zorunlu.</div></div>
<div class="calc-card"><div class="card-title">WPA3 (2018)</div><div class="card-body">SAE (Dragonfly). İleri gizlilik, sözlük-saldırısı direnci. Dragonblood yan kanalları (2019) yamandı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. KRACK — Anahtar Yeniden Kurulum Saldırısı</h2>
<p class="l-text">Vanhoef'un 2017 saldırısı dört-yönlü el sıkışmayı sömürür. Supplicant mesaj 3'ü aldıktan sonra eşli anahtarı kurar; saldırgan mesaj 3'ü tekrar oynarsa, supplicant aynı anahtarı <em>yeniden kurar</em>, nonce ve paket sayacını sıfırlar. Yeniden kullanılan nonce'lu akış cipher'ları XOR yoluyla düz metni sızdırır — AES-CCM için bu saldırganın sonraki herhangi bir çerçeveyi çözmesine izin verir.</p>
<div class="katex-block">$$P_1 \\oplus P_2 = (P_1 \\oplus K) \\oplus (P_2 \\oplus K) = C_1 \\oplus C_2$$</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Hafifletme "yeniden iletimde anahtarı yeniden kurma" — Wi-Fi alliance ve OS satıcılarının tutarlı bir şekilde yaymasının aylar aldığı tek-satırlık durum makinesi düzeltmesi. Android'in <em>wpa_supplicant</em> bug'ı özellikle ciddi: yeniden kurulum anahtarı tüm-sıfırlara sıfırladı, önemsiz çözmeye izin verdi.</div>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. WPA3 SAE El Sıkışma — Saf Python Durum Makinesi</h2>
<p class="l-text">SAE (Simultaneous Authentication of Equals) Dragonfly el sıkışmasıdır: parola-türetilmiş bir öğeye dayalı bir Diffie-Hellman değişimi. Her iki eş rastgele bir scalar'a commit eder, commitment'ları değişir, bir oturum anahtarı türetir ve onaylar. DH üsleri geçici olduğundan ileri gizlilik; parola tabanlı ama parola tel üzerinde doğrudan kullanılmadığından çevrimdışı sözlük saldırılarına karşı kırılgan değil.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Basitleştirilmiş WPA3 SAE el sıkışma durum makinesi — saf Python</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, hmac, secrets

# Oyuncak DH parametreleri (gerçek SAE ECC P-256 / Curve25519 kullanır)
P = (1 &lt;&lt; 521) - 1   # büyük asal (Mersenne)
G = 2

def H(x):
    return int.from_bytes(hashlib.sha256(str(x).encode()).digest(), 'big')

def password_element(password, mac_a, mac_b):
    # Hash-to-group: gerçek SAE yinelemeli hunting-and-pecking kullanır
    seed = H(f"{password}|{min(mac_a,mac_b)}|{max(mac_a,mac_b)}")
    return pow(G, seed % (P-1), P)

class SAEPeer:
    def __init__(self, name, password, mac):
        self.name, self.pw, self.mac = name, password, mac
        self.pe = None; self.scalar = None; self.element = None
    def commit(self, peer_mac):
        self.pe = password_element(self.pw, self.mac, peer_mac)
        rand = secrets.randbelow(P-2) + 1
        mask = secrets.randbelow(P-2) + 1
        self.scalar = (rand + mask) % (P - 1)
        self.element = pow(self.pe, -mask % (P-1), P)
        return (self.scalar, self.element)
    def confirm(self, peer_scalar, peer_element):
        # Paylaşılan sır K = (peer_element * peer_pe^peer_scalar)^own_rand
        # Basitleştirilmiş: hash(her iki scalar + her iki element + pe)
        K = H((self.scalar, peer_scalar, self.element, peer_element, self.pe))
        return hashlib.sha256(str(K).encode()).hexdigest()[:16]

A = SAEPeer("AP",  "correct_horse", mac=0xAA)
B = SAEPeer("STA", "correct_horse", mac=0xBB)
sa, ea = A.commit(B.mac)
sb, eb = B.commit(A.mac)
ka = A.confirm(sb, eb)
kb = B.confirm(sa, ea)
print(f"AP-derived session key:  {ka}")
print(f"STA-derived session key: {kb}")
print("Match:", ka == kb)

# Yanlış parola = farklı anahtarlar
W = SAEPeer("STA", "wrong_password", mac=0xBB)
sw, ew = W.commit(A.mac)
kw = W.confirm(sa, ea)
print(f"Wrong-password session key: {kw}  (mismatch)")
</code></pre></div>
</div>
<p class="l-text">Gerçek SAE'de matematik eliptik eğrilerde çalışır ve DoS'u yenmek için anti-clogging zaman aşımları vardır. Durum makinesi aynıdır: commit, değiş, onayla, PMK türet.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Dragonblood — SAE'de Yan Kanallar</h2>
<p class="l-text">Vanhoef &amp; Ronen (2019) orijinal SAE hash-to-group ("hunting and pecking")'da zamanlama ve cache yan kanalları keşfetti: döngü yineleme sayısı parolaya bağlıydı ve uzaktan gözlenebilirdi. Kısa parolalar için tam parola kurtarması gösterdiler. Hafifletme: sabit-zaman yürütme ile SSWU (RFC 9380) yoluyla hash-to-curve. hostap 2.10 ve Linux WPA supplicant 2024'te yamandı.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Bluetooth ve BLE Açıkları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">KNOB (2019)</div><div class="card-body">Antonioli vd. — BR/EDR şifreleme anahtarı entropisini 1 bayta düşür. Gizliliği kırar.</div></div>
<div class="calc-card"><div class="card-title">BIAS (2020)</div><div class="card-body">Antonioli vd. — slave'in kimlik doğrulamasını atlayarak eşli bir cihazı taklit et.</div></div>
<div class="calc-card"><div class="card-title">BlueFrag (2020)</div><div class="card-body">Android Bluetooth daemon'ında CVE-2020-0022. L2CAP paketinden uzaktan kod yürütme.</div></div>
<div class="calc-card"><div class="card-title">BleedingTooth (2020)</div><div class="card-body">Andy Nguyen — Linux Bluetooth kernel RCE zinciri. CVE-2020-12351.</div></div>
</div>
<p class="l-text">BLE artık tüketici IoT'de baskın saldırı yüzeyidir — her akıllı ampul, doorbell ve earbud potansiyel bir dayanak noktasıdır. Herhangi cihaz tehdit modelinin parçası olarak firmware güncelleme mekanizmanı ve BLE eşleşme akışını denetle.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. 5G Mimarisi ve Tehdit Modeli</h2>
<p class="l-text">5G, 4G'nin monolitik Evolved Packet Core'unu Service-Based Architecture (SBA) ile değiştirir: ağ fonksiyonları HTTP/2 + JSON üzerinden iletişim kurar. Anahtar fonksiyonlar:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">AMF</div><div class="card-body">Access and Mobility Management — kayıt, handoff'u yönetir.</div></div>
<div class="calc-card"><div class="card-title">SMF</div><div class="card-body">Session Management — kullanıcı düzlemi için PDU oturumlarını oluşturur.</div></div>
<div class="calc-card"><div class="card-title">UPF</div><div class="card-body">User Plane Function — paket yönlendirme, QoS, NAT. Düşük gecikme için edge'de dağıtık.</div></div>
<div class="calc-card"><div class="card-title">AUSF + UDM</div><div class="card-body">Authentication Server + Unified Data Management. Uzun-vadeli anahtarları tutar, 5G-AKA yapar.</div></div>
</div>
<p class="l-text">Tehdit yüzeyi: NF'ler arası HTTP/2 (mTLS zorunlu ama sıkça yanlış yapılandırılmış), API token doğrulama, network slice izolasyonu, edge UPF ele geçirilmesi. 3GPP TS 33.501 spesifikasyonları güvenlik mimarisini kodlar, ama akademik denetçiler (Hussain, Bertino) rutin olarak protokol boşlukları bulur.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Network Slicing — Servis Olarak İzolasyon</h2>
<p class="l-text">5G "slice" kendi SLA'sına sahip sanal uçtan uca bir ağdır. eMBB (mobil geniş bant), URLLC (düşük gecikme), mMTC (IoT). Her slice kendi AMF/SMF/UPF örneklerine sahiptir. Güvenlik iddiası: ele geçirilmiş bir slice diğerlerini etkileyemez. Gerçek: slice'lar fiziksel RAN'i paylaşır; NF orchestrator'da (tipik olarak Kubernetes-tabanlı) container kaçışları slice sınırlarını geçebilir (Khan vd. 2022). Slice-hopping aktif bir araştırma alanıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (5G NF politika şema kontrolü)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import json, re
slices = [
  {'sst':1, 'sd':'eMBB',   'tenant':'consumer'},
  {'sst':2, 'sd':'URLLC',  'tenant':'factory_robot'},
  {'sst':3, 'sd':'mMTC',   'tenant':'iot_meter'},
]
def nssai_ok(s):
    return s['sst'] in (1,2,3) and re.fullmatch(r'[A-Za-z0-9_]+', s['sd'])
for s in slices:
    print(s, '-&gt; valid' if nssai_ok(s) else '-&gt; reject')
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>slices</code> listesi üç S-NSSAI girdisi tanımlar (Single Network Slice Selection Assistance Information) — her biri bir <code>sst</code> (Slice/Service Type: 1=eMBB, 2=URLLC, 3=mMTC; 3GPP TS 23.501) ve serbest formlu bir <code>sd</code> (Slice Differentiator) taşır; fabrika robot filosu veya akıllı sayaç operatörü gibi kiracılar iş yüklerini izole etmek için <code>sd</code>'yi seçer. 2) <code>nssai_ok(s)</code> AMF politikayı kabul etmeden önce şemayı doğrular — <code>sst in (1,2,3)</code> bilinmeyen servis tiplerini reddeder, <code>re.fullmatch(r'[A-Za-z0-9_]+', s['sd'])</code> differentiator'da injection karakterlerini engeller. 3) Bu kapı olmadan kötü niyetli bir kiracı <code>sd</code>'ye path-traversal veya NF-routing metakarakterleri koyup orchestrator üzerinden slice'lar arası pivot yapabilir. 4) Üretim deployment'ları JSON Schema doğrulamasını, NSSF ile AMF arasında mTLS'yi ve kiracı-slice eşlemesini zorlayan OPA politikalarını ekler — slice-hopping araştırması (Khan vd. 2022) yalnızca şema doğrulamasının gerekli ama yeterli olmadığını gösterir.</p>

</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. IMSI Catcher'lar ve SUCI</h2>
<p class="l-text">Bir IMSI catcher (Stingray, ICMI) yakındaki gerçek kulelerden daha yüksek sinyal yayan, telefonları bağlanmaya zorlayan sahte bir base station'dır. 5G öncesi, catcher IMSI'yi düz metinde isteyebilir ve şifrelemeyi düşürebilirdi. 5G <em>SUCI</em> tanıtır (Subscription Concealed Identifier): cihaz IMSI'yi iletmeden önce ev ağının genel anahtarına (ECIES) şifreler. Catcher yalnızca ciphertext alır. Ama — 5G telefonlar zayıf kapsamada sıkça 4G/3G'ye geri düşer, eski IMSI değişimi hâlâ gözlenebilirdir. Tespit: SnoopSnitch, AIMSICD gibi uygulamalar; ağ tarafı: hücre ID geçişlerinde anomali tespiti.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Savunmalar ve En İyi Uygulamalar</h2>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Wi-Fi: mümkün olduğunda yalnızca-WPA3 ağlar, PMF zorunlu, kurumsal için EAP-TLS ile 802.1X.</li>
<li>BLE: eşleşme modları — üretim için Just Works'i asla kullanma, Numeric Comparison veya OOB tercih et.</li>
<li>5G: SUCI'yi uygula, 2G fallback'i devre dışı bırak, K8s namespace izolasyonu + OPA ile network slicing dağıt.</li>
<li>Mobil cihazlar: hücre ID anomalileri için izle, hücresel üzerinde şifreli DNS (DoH/DoT) çalıştır, VPN kullan.</li>
<li>Denetim: düzenli RF anketleri, 802.11 monitor mode'da Wireshark ile paket yakalamaları, Ubertooth/nRF52840 dongle'larda BLE sniffer.</li>
</ul>
</div>`
};
