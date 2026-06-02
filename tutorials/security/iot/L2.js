window.IOT_L2 = {
en: `<p class="l-text"><strong>Software security ends at the silicon.</strong> If an attacker can pull a chip off the board, dump SPI flash with a $5 clip, or solder onto a UART header, the cleverest cryptography in your firmware does not save you. Hardware security is about extending the trust boundary <em>into</em> the device — pinning secrets to silicon, measuring every byte that boots, and proving to a remote verifier that the code currently running is what you signed. The 2018 Bloomberg "Big Hack" story (later disputed) and the actually-confirmed Supermicro IPMI vulnerabilities turned this from an academic concern into a board-room one.</p>

<p class="l-text">In this lesson we walk the three dominant hardware roots of trust: <strong>TPM 2.0</strong> (ISO/IEC 11889, the discrete chip your laptop already has), <strong>Intel SGX</strong> (the enclave technology behind Signal's contact-discovery and Azure Confidential Compute, partially deprecated on client CPUs in 2022 but alive on Xeon), and <strong>ARM TrustZone</strong> (the secure-world / normal-world split that runs on every smartphone and most modern microcontrollers via the Cortex-M33 / M55). We then build a secure-boot chain step by step, derive keys with HKDF, and produce a remote-attestation quote you can hand to a verifier.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Explain a hardware root of trust and the difference between immutable, mutable, and measured code</li>
<li>Compare TPM 2.0, Intel SGX, and ARM TrustZone by threat model and use case</li>
<li>Build a secure-boot chain: ROM → bootloader → kernel → app, each stage verifying the next</li>
<li>Implement remote attestation: PCR extension, AK signing, verifier check</li>
<li>Derive per-device keys with HKDF rooted in a fused secret</li>
<li>Choose the right HRoT for a given product (smart bulb vs medical device vs vehicle ECU)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What Is a Hardware Root of Trust?</h2>
<p class="l-text">A <strong>root of trust</strong> is a small amount of code or hardware that you must trust because nothing else can verify it. In practice this means: silicon-fused public keys, mask-ROM bootloader code that is unmodifiable post-fabrication, and a tamper-resistant key store. Every signature check, every measurement, every attestation chains back to one of these immutable anchors. Lose the anchor, lose the chain.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Immutable</div><div class="card-body">Mask ROM, fused public keys (eFuse / OTP), die-level metal layers. Set at fab; cannot be patched, including by the vendor. The "trust me" layer.</div></div>
<div class="calc-card"><div class="card-title">Measured</div><div class="card-body">Each stage hashes the next stage before executing it and extends the hash into a TPM PCR or HRoT register. Produces a cryptographic record of what booted.</div></div>
<div class="calc-card"><div class="card-title">Verified</div><div class="card-body">Each stage checks a signature on the next stage against a key in immutable storage. Refuses to execute on mismatch. This is "secure boot" proper.</div></div>
<div class="calc-card"><div class="card-title">Sealed</div><div class="card-body">Secrets that only release when the measured-boot register matches an expected value. BitLocker on Windows seals the disk key to PCR0-7.</div></div>
</div>

<div class="calc-highlight"><strong>Measured boot ≠ verified boot.</strong> Measured records what happened (good for forensics and attestation), verified prevents bad code from running. Production systems need both.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. TPM 2.0 (ISO/IEC 11889)</h2>
<p class="l-text">The Trusted Platform Module is a discrete chip (or firmware emulation, fTPM) sitting on the motherboard's LPC or SPI bus. The TCG specifications were ratified as ISO/IEC 11889 (2015, revised 2022). Microsoft's Windows 11 hardware requirement (TPM 2.0 mandatory) deployed it to a billion PCs. Most server BMCs, every modern enterprise laptop, and a growing share of industrial controllers carry one.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PCRs (Platform Config Registers)</div><div class="card-body">24 hash registers. You cannot write them; you can only <em>extend</em>: <code>PCR_new = SHA256(PCR_old || data)</code>. Each boot stage extends a PCR with the hash of the next stage's image.</div></div>
<div class="calc-card"><div class="card-title">EK (Endorsement Key)</div><div class="card-body">Per-chip RSA/ECC key, signed by the manufacturer (Infineon, ST, Nuvoton). Provides cryptographic identity.</div></div>
<div class="calc-card"><div class="card-title">AK (Attestation Key)</div><div class="card-body">Derived from the EK, used to sign quotes that report PCR values. Privacy-preserving variant: DAA (Direct Anonymous Attestation).</div></div>
<div class="calc-card"><div class="card-title">Sealing</div><div class="card-body"><code>TPM2_Create</code> with a policy "release this blob only when PCR0=X and PCR7=Y". The blob is encrypted to the TPM and never leaves it in plaintext.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Simulate TPM PCR extension over a boot chain
import hashlib

def sha256(*parts):
    h = hashlib.sha256()
    for p in parts:
        h.update(p)
    return h.digest()

PCR0 = bytes(32)                              # PCR starts at all-zero
boot_chain = [
    b"ROM      v1.0",
    b"Bootloader v3.2 signed",
    b"Kernel   v6.1.0",
    b"InitRD   payload",
    b"App      v2.4.1",
]
for stage in boot_chain:
    measurement = hashlib.sha256(stage).digest()
    PCR0 = sha256(PCR0, measurement)          # extend operation
    print(f"After {stage[:10].decode().strip():12s}  PCR0 = {PCR0.hex()[:16]}...")

# A verifier with a golden value can check final PCR0 matches expected.
expected = PCR0
print(f"\\nGolden PCR0 for this firmware bundle: {expected.hex()}")</code></pre></div>

<p class="l-text">This is exactly how Microsoft Defender's Device Health Attestation, Linux IMA (Integrity Measurement Architecture), and AWS Nitro System work. Different storage, same primitive: an unforgeable hash chain rooted in silicon.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Intel SGX — Enclaves on the CPU Itself</h2>
<p class="l-text">SGX (Software Guard Extensions, introduced with Skylake 2015) creates encrypted regions of RAM — <em>enclaves</em> — that even the operating system cannot read. Memory encryption is performed by the Memory Encryption Engine (MEE) at cache-line granularity. The threat model assumes a malicious OS, hypervisor, and physical attacker with cold-boot tools.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Production uses</div><div class="card-body">Signal's contact-discovery service (until 2023), Microsoft Azure Confidential Computing (DCsv3), Fortanix DSM (KMS in enclave), R3 Corda blockchain notaries.</div></div>
<div class="calc-card"><div class="card-title">Attestation</div><div class="card-body">EPID (Enhanced Privacy ID) or DCAP (Data Center Attestation Primitives, 2018+). Quote is signed by Intel's PCK chain; remote verifier can check via Intel Attestation Service or ECDSA-DCAP self-hosted.</div></div>
<div class="calc-card"><div class="card-title">Side-channel reality</div><div class="card-body">Foreshadow (CVE-2018-3615), Plundervolt (CVE-2019-11157), SGAxe (2020), ÆPIC Leak (2022). Intel deprecated SGX on client CPUs (11th gen+) in 2022. Server-side (Xeon Scalable Ice Lake+) is still supported.</div></div>
<div class="calc-card"><div class="card-title">Successors</div><div class="card-body">Intel TDX (Trust Domain Extensions, full-VM enclave, Sapphire Rapids 2023), AMD SEV-SNP, ARM CCA. The industry has converged on whole-VM confidential computing.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ARM TrustZone — Secure World / Normal World</h2>
<p class="l-text">ARM TrustZone (introduced with ARMv6, ubiquitous since Cortex-A and now Cortex-M33/M55) splits the CPU into two states: <em>normal world</em> (Linux, Android, RTOS) and <em>secure world</em> (a small TEE OS like OP-TEE, Trusty, Kinibi). Hardware enforcement, not virtualization. Every smartphone you have used in the last decade has this.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cortex-A (application)</div><div class="card-body">Used for fingerprint matching, DRM (Widevine L1), payment apps, kernel-protection of TLS keys. Android Keystore is backed by a TrustZone TA (Trusted Application).</div></div>
<div class="calc-card"><div class="card-title">Cortex-M (microcontroller)</div><div class="card-body">M23/M33/M55 add TrustZone-M. Used in NXP LPC55, STM32L5/U5, Nordic nRF9160. Brings secure boot and secure storage to MCUs that previously had none.</div></div>
<div class="calc-card"><div class="card-title">PSA Certified</div><div class="card-body">ARM-led certification (Levels 1-3) for IoT devices using TrustZone-M. Aligned with ETSI EN 303 645 and the EU CRA. The IoT vendor's path to compliance.</div></div>
<div class="calc-card"><div class="card-title">Attacks</div><div class="card-body">Boomerang (2019), CLKSCREW (2017, voltage glitching), TruSpy cache attacks. TEEs are <em>harder</em>, not impossible.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Building a Secure-Boot Chain</h2>
<p class="l-text">A real device boot chain on a TrustZone-M MCU like the STM32U5:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Stage 0 — ROM Bootloader (RBL)</div><div class="card-body">Mask ROM, immutable. Reads the first stage from flash, verifies its signature against a fused root public key, jumps to it.</div></div>
<div class="calc-card"><div class="card-title">Stage 1 — Secure Bootloader (SBL)</div><div class="card-body">Verifies the second-stage bootloader, manages anti-rollback monotonic counter, handles A/B partitions for safe OTA.</div></div>
<div class="calc-card"><div class="card-title">Stage 2 — RTOS / Kernel</div><div class="card-body">Verified, decrypted, jumped into. On Cortex-M, this is FreeRTOS / Zephyr / ThreadX with secure-side services (key store, crypto API).</div></div>
<div class="calc-card"><div class="card-title">Stage 3 — Application</div><div class="card-body">Signed by the OEM's release key, version-checked against rollback counter, runs in non-secure world.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Toy verified-boot chain with rollback protection
import hashlib, hmac, json
ROOT_PUB = b"OEM-PUBKEY-FUSED-AT-FAB"   # immutable in eFuse
rollback_counter = 5                    # monotonic, in OTP

def verify(image_bytes, signature, expected_pub, min_version):
    img = json.loads(image_bytes)
    if img["version"] < min_version:
        return False, "rollback attack: image too old"
    digest = hashlib.sha256(image_bytes).hexdigest()
    expected_sig = hmac.new(expected_pub, digest.encode(), "sha256").hexdigest()
    if signature != expected_sig:
        return False, "bad signature"
    return True, "ok"

# Construct a signed image
def sign(image_bytes, key):
    digest = hashlib.sha256(image_bytes).hexdigest()
    return hmac.new(key, digest.encode(), "sha256").hexdigest()

stage1 = json.dumps({"name":"SBL","version":7,"payload":"..."}, sort_keys=True).encode()
sig1 = sign(stage1, ROOT_PUB)

ok, msg = verify(stage1, sig1, ROOT_PUB, rollback_counter)
print("Stage1 boot:", ok, msg)

# Attempt rollback to old version 3
old = json.dumps({"name":"SBL","version":3,"payload":"..."}, sort_keys=True).encode()
sig_old = sign(old, ROOT_PUB)
ok, msg = verify(old, sig_old, ROOT_PUB, rollback_counter)
print("Rollback attempt:", ok, msg)</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Models the immutable root: <code>ROOT_PUB</code> stands in for an OEM public key burned into eFuse at the factory, and <code>rollback_counter</code> for a monotonic OTP counter that only goes up. 2) <code>verify()</code> hashes the candidate image, recomputes the expected MAC with the fused key, and refuses any image whose declared version is below the counter — that is the anti-rollback gate. 3) A fresh signed image at version 7 boots cleanly because both signature and version pass. 4) The second call replays an old version-3 image with a valid signature — rejected, because rollback protection blocks downgrade-to-known-bug attacks even when the attacker has a genuine OEM artifact.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Key Derivation with HKDF</h2>
<p class="l-text">Storing one key per device per service is impossible. Instead, derive everything from a fused per-device secret using HKDF (RFC 5869, Krawczyk &amp; Eronen 2010). HKDF-Extract folds entropy; HKDF-Expand stretches into many independent keys.</p>

<div class="katex-block">$$ \\text{HKDF}(\\text{IKM}, \\text{salt}, \\text{info}) = \\text{Expand}(\\text{Extract}(\\text{salt}, \\text{IKM}), \\text{info}, L) $$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># HKDF-SHA256 from RFC 5869, derived per-purpose keys
import hashlib, hmac

def hkdf_extract(salt, ikm):
    return hmac.new(salt, ikm, hashlib.sha256).digest()

def hkdf_expand(prk, info, length):
    out, t, i = b"", b"", 1
    while len(out) < length:
        t = hmac.new(prk, t + info + bytes([i]), hashlib.sha256).digest()
        out += t
        i  += 1
    return out[:length]

# Per-device root secret, fused at provisioning
DEVICE_ROOT = bytes.fromhex("a1" * 32)

prk = hkdf_extract(b"iot-l2-salt", DEVICE_ROOT)
k_storage = hkdf_expand(prk, b"storage-aes",   32)
k_mqtt    = hkdf_expand(prk, b"mqtt-tls-psk",  32)
k_ota     = hkdf_expand(prk, b"ota-verify",    32)

print("storage key :", k_storage.hex()[:24], "...")
print("mqtt key    :", k_mqtt.hex()[:24], "...")
print("ota key     :", k_ota.hex()[:24], "...")
# Three independent keys, none of them stored — all derivable from one fused secret.</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Implements the two HKDF primitives from RFC 5869: <code>hkdf_extract</code> compresses a high-entropy but possibly biased input (<code>DEVICE_ROOT</code>) into a uniform pseudo-random key using HMAC-SHA256 with a salt. 2) <code>hkdf_expand</code> stretches that PRK into arbitrarily many output bytes by chaining HMAC blocks, each tagged with a context label so different purposes yield independent keys. 3) Three distinct context strings (<code>storage-aes</code>, <code>mqtt-tls-psk</code>, <code>ota-verify</code>) derive three uncorrelated 32-byte keys from the same fused secret. 4) Compromising one key (e.g. the MQTT PSK) tells the attacker nothing about the storage or OTA keys, and none of them ever has to be written to flash.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Remote Attestation</h2>
<p class="l-text">Attestation lets a remote verifier check what is actually running on the device. The flow is the same on TPM, SGX, and TrustZone — only the names change.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Verifier sends nonce</div><div class="card-body">Random challenge, prevents replay.</div></div>
<div class="calc-card"><div class="card-title">2. Device produces a quote</div><div class="card-body">A signed structure containing { PCRs, nonce, device-id }, signed by the AK rooted in silicon.</div></div>
<div class="calc-card"><div class="card-title">3. Verifier checks signature chain</div><div class="card-body">AK → EK → manufacturer cert. Confirms the quote came from a real device.</div></div>
<div class="calc-card"><div class="card-title">4. Verifier checks PCR values</div><div class="card-body">Compares against a database of golden values per firmware version. If unknown, deny service.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># End-to-end attestation simulation
import hashlib, hmac, secrets, json

DEVICE_AK = secrets.token_bytes(32)        # would be ECDSA in real life
GOLDEN_PCR = "8b4c..." * 4                 # registered for this fw version

def device_quote(pcr_value, nonce, ak):
    body = json.dumps({"pcr": pcr_value, "nonce": nonce.hex()}, sort_keys=True)
    sig  = hmac.new(ak, body.encode(), "sha256").hexdigest()
    return body, sig

def verifier(body, sig, ak, expected_pcr, expected_nonce):
    if hmac.new(ak, body.encode(), "sha256").hexdigest() != sig:
        return "REJECT: bad signature"
    parsed = json.loads(body)
    if parsed["nonce"] != expected_nonce.hex():
        return "REJECT: nonce mismatch (replay)"
    if parsed["pcr"] != expected_pcr:
        return "REJECT: firmware not in allow-list"
    return "ACCEPT"

nonce  = secrets.token_bytes(16)
PCR    = "8b4c..." * 4                    # device's actual current PCR
body, sig = device_quote(PCR, nonce, DEVICE_AK)
print(verifier(body, sig, DEVICE_AK, GOLDEN_PCR, nonce))

# Now simulate a tampered firmware
PCR_bad = "deadbeef" * 8
body, sig = device_quote(PCR_bad, nonce, DEVICE_AK)
print(verifier(body, sig, DEVICE_AK, GOLDEN_PCR, nonce))</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>DEVICE_AK</code> stands in for an Attestation Key rooted in silicon — in production an ECDSA key sealed by the TPM/TEE; here HMAC-SHA256 keeps the demo readable. 2) <code>device_quote</code> bundles the current PCR value with the verifier's nonce and signs the JSON body, mirroring TPM2_Quote / SGX Quote / TrustZone signed-report formats. 3) The verifier first re-checks the MAC, then the nonce (replay defense), then the PCR against a registered golden value for the firmware version — three independent checks, any failure denies service. 4) The second call swaps in a <code>deadbeef</code> PCR to model a tampered or unauthorized firmware; signature is valid but the firmware is not on the allow-list, so attestation correctly REJECTs.</p>

</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Choosing the Right HRoT</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Smart bulb / sensor (sub-$5 BoM)</div><div class="card-body">ESP32-C3/C6 with eFuse + flash encryption + secure boot v2. No TPM, no TrustZone. Good enough for I1-I9 OWASP coverage.</div></div>
<div class="calc-card"><div class="card-title">Consumer hub / smart speaker</div><div class="card-body">Cortex-A SoC with TrustZone, OP-TEE for the keystore, optional discrete SE (NXP A71CH, Microchip ECC608) for cert storage.</div></div>
<div class="calc-card"><div class="card-title">Medical / industrial / automotive</div><div class="card-body">PSA Level 3 MCU (STM32U5, NXP LPC55) <em>or</em> SoC + discrete TPM 2.0. Required by IEC 62443, ISO 14971, ISO/SAE 21434.</div></div>
<div class="calc-card"><div class="card-title">Cloud / data-center workload</div><div class="card-body">Confidential computing: Intel TDX, AMD SEV-SNP, ARM CCA, AWS Nitro Enclaves. Whole-VM attestation, integrates with your IoT cloud platform.</div></div>
</div>

<div class="calc-highlight"><strong>Risk-driven selection:</strong> from iot-L1 we have Risk = Likelihood × Impact. As impact rises (life safety, payments, control), HRoT investment rises too. Sub-$5 BoM products will not get a TPM; they should still get verified boot, eFuse-rooted keys, and HKDF.</div>

<p class="l-text">Hardware roots of trust are necessary but not sufficient. The next lesson (iot-L3) shows what a researcher does with your firmware once they have it on the bench — and how those findings feed back into the threat model.</p>
</div>`,
tr: `<p class="l-text"><strong>Yazılım güvenliği silikonda biter.</strong> Bir saldırgan bir çipi karttan çıkarabilir, 5 dolarlık bir klipsle SPI flash'ı dump edebilir veya bir UART başlığına lehimleyebilirse, firmware'inizdeki en akıllı kriptografi sizi kurtarmaz. Donanım güvenliği, güven sınırını cihazın <em>içine</em> uzatmakla ilgilidir — sırları silikona sabitlemek, önyüklenen her baytı ölçmek ve uzaktaki bir doğrulayıcıya şu anda çalışan kodun imzaladığınız şey olduğunu kanıtlamak. 2018 Bloomberg "Big Hack" hikayesi (sonradan tartışıldı) ve gerçekten doğrulanan Supermicro IPMI zafiyetleri bunu akademik bir endişeden yönetim kurulu seviyesi bir endişeye dönüştürdü.</p>

<p class="l-text">Bu derste üç baskın donanım güven kökünü yürüyoruz: <strong>TPM 2.0</strong> (ISO/IEC 11889, dizüstünüzün zaten sahip olduğu ayrık çip), <strong>Intel SGX</strong> (Signal'in iletişim-keşfinin ve Azure Confidential Compute'un arkasındaki enclave teknolojisi, 2022'de istemci CPU'larda kısmen kullanımdan kaldırıldı ancak Xeon'da yaşıyor) ve <strong>ARM TrustZone</strong> (her akıllı telefonda ve Cortex-M33 / M55 aracılığıyla çoğu modern mikrodenetleyicide çalışan güvenli-dünya / normal-dünya bölünmesi). Sonra adım adım bir güvenli-önyükleme zinciri oluşturuyoruz, HKDF ile anahtarlar türetiyoruz ve bir doğrulayıcıya verebileceğiniz uzaktan kanıtlama alıntısı üretiyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir donanım güven kökünü ve değişmez, değişebilir ve ölçülmüş kod arasındaki farkı açıklayın</li>
<li>TPM 2.0, Intel SGX ve ARM TrustZone'u tehdit modeli ve kullanım durumuna göre karşılaştırın</li>
<li>Bir güvenli-önyükleme zinciri oluşturun: ROM → bootloader → çekirdek → uygulama, her aşama bir sonrakini doğrular</li>
<li>Uzaktan kanıtlamayı uygulayın: PCR uzantısı, AK imzalama, doğrulayıcı kontrolü</li>
<li>Sigortalı bir sırrı kök alan HKDF ile cihaz başına anahtarlar türetin</li>
<li>Belirli bir ürün için doğru HRoT'u seçin (akıllı ampul vs tıbbi cihaz vs araç ECU)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Donanım Güven Kökü Nedir?</h2>
<p class="l-text">Bir <strong>güven kökü</strong>, başka hiçbir şey doğrulayamadığı için güvenmeniz gereken küçük miktarda kod veya donanımdır. Pratikte bu şu anlama gelir: silikona sigortalı genel anahtarlar, fabrikasyon sonrası değiştirilemeyen mask-ROM bootloader kodu ve kurcalamaya dirençli bir anahtar deposu. Her imza kontrolü, her ölçüm, her kanıtlama bu değişmez sabitleyicilerden birine geri zincirlenir. Sabitleyiciyi kaybedin, zinciri kaybedin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Değişmez</div><div class="card-body">Mask ROM, sigortalı genel anahtarlar (eFuse / OTP), die seviyesi metal katmanları. Fabrikada ayarlanır; satıcı dahil yamalanamaz. "Bana güven" katmanı.</div></div>
<div class="calc-card"><div class="card-title">Ölçülmüş</div><div class="card-body">Her aşama bir sonraki aşamayı yürütmeden önce hash'ler ve hash'i bir TPM PCR'sine veya HRoT kaydına genişletir. Önyüklenen şeyin kriptografik bir kaydını üretir.</div></div>
<div class="calc-card"><div class="card-title">Doğrulanmış</div><div class="card-body">Her aşama bir sonraki aşamadaki imzayı değişmez depodaki bir anahtara karşı kontrol eder. Uyumsuzlukta yürütmeyi reddeder. Bu doğru anlamda "güvenli önyükleme"dir.</div></div>
<div class="calc-card"><div class="card-title">Mühürlü</div><div class="card-body">Yalnızca ölçülmüş-önyükleme kaydı beklenen bir değerle eşleştiğinde serbest kalan sırlar. Windows'ta BitLocker disk anahtarını PCR0-7'ye mühürler.</div></div>
</div>

<div class="calc-highlight"><strong>Ölçülmüş önyükleme ≠ doğrulanmış önyükleme.</strong> Ölçülmüş, ne olduğunu kaydeder (adli tıp ve kanıtlama için iyi), doğrulanmış kötü kodun çalışmasını önler. Üretim sistemleri her ikisine de ihtiyaç duyar.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. TPM 2.0 (ISO/IEC 11889)</h2>
<p class="l-text">Trusted Platform Module, anakartın LPC veya SPI veri yolunda oturan ayrık bir çiptir (veya firmware öykünmesi, fTPM). TCG spesifikasyonları ISO/IEC 11889 olarak onaylandı (2015, 2022'de revize edildi). Microsoft'un Windows 11 donanım gereksinimi (TPM 2.0 zorunlu) onu bir milyar PC'ye dağıttı. Çoğu sunucu BMC'si, her modern kurumsal dizüstü ve giderek artan endüstriyel denetleyici payı bir tane taşır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PCR'lar (Platform Yapılandırma Kayıtları)</div><div class="card-body">24 hash kaydı. Onlara yazamazsınız; yalnızca <em>genişletebilirsiniz</em>: <code>PCR_new = SHA256(PCR_old || data)</code>. Her önyükleme aşaması bir PCR'yi sonraki aşamanın imajının hash'i ile genişletir.</div></div>
<div class="calc-card"><div class="card-title">EK (Endorsement Key)</div><div class="card-body">Çip başına RSA/ECC anahtarı, üretici tarafından imzalı (Infineon, ST, Nuvoton). Kriptografik kimlik sağlar.</div></div>
<div class="calc-card"><div class="card-title">AK (Attestation Key)</div><div class="card-body">EK'den türetilir, PCR değerlerini bildiren alıntıları imzalamak için kullanılır. Gizliliği koruyan varyant: DAA (Direct Anonymous Attestation).</div></div>
<div class="calc-card"><div class="card-title">Mühürleme</div><div class="card-body">"PCR0=X ve PCR7=Y olduğunda yalnızca bu blob'u serbest bırak" politikasıyla <code>TPM2_Create</code>. Blob TPM'e şifrelenir ve onu asla düz metin olarak terk etmez.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Bir önyükleme zinciri üzerinde TPM PCR uzantısını simüle et
import hashlib

def sha256(*parts):
    h = hashlib.sha256()
    for p in parts:
        h.update(p)
    return h.digest()

PCR0 = bytes(32)                              # PCR tamamen sıfırla başlar
boot_chain = [
    b"ROM      v1.0",
    b"Bootloader v3.2 signed",
    b"Kernel   v6.1.0",
    b"InitRD   payload",
    b"App      v2.4.1",
]
for stage in boot_chain:
    measurement = hashlib.sha256(stage).digest()
    PCR0 = sha256(PCR0, measurement)          # genişletme işlemi
    print(f"After {stage[:10].decode().strip():12s}  PCR0 = {PCR0.hex()[:16]}...")

# Altın değere sahip bir doğrulayıcı son PCR0'ın beklenenle eşleştiğini kontrol edebilir.
expected = PCR0
print(f"\\nGolden PCR0 for this firmware bundle: {expected.hex()}")</code></pre></div>

<p class="l-text">Bu, Microsoft Defender'ın Device Health Attestation'ı, Linux IMA (Integrity Measurement Architecture) ve AWS Nitro System'ın tam olarak çalışma şeklidir. Farklı depolama, aynı primitif: silikonda kök salmış sahteleştirilemez bir hash zinciri.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Intel SGX — CPU'nun Kendisinde Enclave'ler</h2>
<p class="l-text">SGX (Software Guard Extensions, Skylake 2015 ile tanıtıldı), işletim sisteminin bile okuyamadığı şifreli RAM bölgeleri — <em>enclave'ler</em> — oluşturur. Bellek şifrelemesi, önbellek satırı tanecikliğinde Memory Encryption Engine (MEE) tarafından gerçekleştirilir. Tehdit modeli kötü niyetli bir OS, hipervisor ve soğuk önyükleme araçlarına sahip fiziksel saldırganı varsayar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Üretim kullanımları</div><div class="card-body">Signal'in iletişim-keşif hizmeti (2023'e kadar), Microsoft Azure Confidential Computing (DCsv3), Fortanix DSM (enclave'de KMS), R3 Corda blockchain noterleri.</div></div>
<div class="calc-card"><div class="card-title">Kanıtlama</div><div class="card-body">EPID (Enhanced Privacy ID) veya DCAP (Data Center Attestation Primitives, 2018+). Alıntı Intel'in PCK zinciri tarafından imzalanır; uzaktaki doğrulayıcı Intel Attestation Service veya kendi-barındırılan ECDSA-DCAP aracılığıyla kontrol edebilir.</div></div>
<div class="calc-card"><div class="card-title">Yan-kanal gerçekliği</div><div class="card-body">Foreshadow (CVE-2018-3615), Plundervolt (CVE-2019-11157), SGAxe (2020), ÆPIC Leak (2022). Intel istemci CPU'larda (11. nesil+) SGX'i 2022'de kullanımdan kaldırdı. Sunucu tarafı (Xeon Scalable Ice Lake+) hâlâ destekleniyor.</div></div>
<div class="calc-card"><div class="card-title">Halefler</div><div class="card-body">Intel TDX (Trust Domain Extensions, tam VM enclave, Sapphire Rapids 2023), AMD SEV-SNP, ARM CCA. Endüstri tüm-VM gizli bilişimi üzerinde birleşti.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ARM TrustZone — Güvenli Dünya / Normal Dünya</h2>
<p class="l-text">ARM TrustZone (ARMv6 ile tanıtıldı, Cortex-A'dan beri her yerde ve şimdi Cortex-M33/M55), CPU'yu iki duruma ayırır: <em>normal dünya</em> (Linux, Android, RTOS) ve <em>güvenli dünya</em> (OP-TEE, Trusty, Kinibi gibi küçük bir TEE OS). Donanım uygulaması, sanallaştırma değil. Son on yılda kullandığınız her akıllı telefon buna sahiptir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cortex-A (uygulama)</div><div class="card-body">Parmak izi eşleştirme, DRM (Widevine L1), ödeme uygulamaları, TLS anahtarlarının çekirdek korumasında kullanılır. Android Keystore bir TrustZone TA (Güvenilir Uygulama) tarafından desteklenir.</div></div>
<div class="calc-card"><div class="card-title">Cortex-M (mikrodenetleyici)</div><div class="card-body">M23/M33/M55 TrustZone-M ekler. NXP LPC55, STM32L5/U5, Nordic nRF9160'ta kullanılır. Daha önce hiçbiri olmayan MCU'lara güvenli önyükleme ve güvenli depolama getirir.</div></div>
<div class="calc-card"><div class="card-title">PSA Sertifikalı</div><div class="card-body">TrustZone-M kullanan IoT cihazları için ARM liderliğindeki sertifikasyon (Seviye 1-3). ETSI EN 303 645 ve AB CRA ile hizalı. IoT satıcısının uyum yolu.</div></div>
<div class="calc-card"><div class="card-title">Saldırılar</div><div class="card-body">Boomerang (2019), CLKSCREW (2017, voltaj glitch'leme), TruSpy önbellek saldırıları. TEE'ler <em>daha zordur</em>, imkânsız değil.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Bir Güvenli-Önyükleme Zinciri İnşa Etmek</h2>
<p class="l-text">STM32U5 gibi bir TrustZone-M MCU'da gerçek bir cihaz önyükleme zinciri:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Aşama 0 — ROM Bootloader (RBL)</div><div class="card-body">Mask ROM, değişmez. Flash'tan ilk aşamayı okur, imzasını sigortalı bir kök genel anahtara karşı doğrular, ona atlar.</div></div>
<div class="calc-card"><div class="card-title">Aşama 1 — Güvenli Bootloader (SBL)</div><div class="card-body">İkinci aşama bootloader'ı doğrular, anti-rollback monoton sayacını yönetir, güvenli OTA için A/B bölümlerini işler.</div></div>
<div class="calc-card"><div class="card-title">Aşama 2 — RTOS / Çekirdek</div><div class="card-body">Doğrulanmış, şifresi çözülmüş, içine atlanmış. Cortex-M'de bu, güvenli taraflı hizmetlere (anahtar deposu, kripto API) sahip FreeRTOS / Zephyr / ThreadX'tir.</div></div>
<div class="calc-card"><div class="card-title">Aşama 3 — Uygulama</div><div class="card-body">OEM'in sürüm anahtarı tarafından imzalı, geri alma sayacına karşı sürüm kontrol edilmiş, güvensiz dünyada çalışır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Geri alma korumalı oyuncak doğrulanmış-önyükleme zinciri
import hashlib, hmac, json
ROOT_PUB = b"OEM-PUBKEY-FUSED-AT-FAB"   # eFuse'da değişmez
rollback_counter = 5                    # OTP'de monoton

def verify(image_bytes, signature, expected_pub, min_version):
    img = json.loads(image_bytes)
    if img["version"] < min_version:
        return False, "rollback saldırısı: imaj çok eski"
    digest = hashlib.sha256(image_bytes).hexdigest()
    expected_sig = hmac.new(expected_pub, digest.encode(), "sha256").hexdigest()
    if signature != expected_sig:
        return False, "kötü imza"
    return True, "ok"

# İmzalı bir imaj oluştur
def sign(image_bytes, key):
    digest = hashlib.sha256(image_bytes).hexdigest()
    return hmac.new(key, digest.encode(), "sha256").hexdigest()

stage1 = json.dumps({"name":"SBL","version":7,"payload":"..."}, sort_keys=True).encode()
sig1 = sign(stage1, ROOT_PUB)

ok, msg = verify(stage1, sig1, ROOT_PUB, rollback_counter)
print("Stage1 boot:", ok, msg)

# Eski sürüm 3'e geri alma denemesi
old = json.dumps({"name":"SBL","version":3,"payload":"..."}, sort_keys=True).encode()
sig_old = sign(old, ROOT_PUB)
ok, msg = verify(old, sig_old, ROOT_PUB, rollback_counter)
print("Rollback attempt:", ok, msg)</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Değişmez kökü modelliyor: <code>ROOT_PUB</code> fabrikada eFuse'a yakılmış bir OEM public key'ini, <code>rollback_counter</code> ise yalnızca artan bir OTP monoton sayacını temsil ediyor. 2) <code>verify()</code> aday imajı hash'liyor, sigortalı anahtarla beklenen MAC'i yeniden hesaplıyor ve bildirilen sürümü sayacın altında olan her imajı reddediyor — anti-rollback kapısı budur. 3) Sürüm 7'de taze imzalı imaj temiz boot eder çünkü hem imza hem sürüm geçer. 4) İkinci çağrı geçerli imzalı eski sürüm 3 imajını yeniden oynatır — reddedildi, çünkü rollback koruması saldırgan gerçek OEM artifaktına sahip olsa bile bilinen-bug'a downgrade saldırılarını engeller.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. HKDF ile Anahtar Türetme</h2>
<p class="l-text">Cihaz başına hizmet başına bir anahtar saklamak imkânsızdır. Bunun yerine, HKDF kullanarak (RFC 5869, Krawczyk &amp; Eronen 2010) cihaz başına sigortalı bir sırdan her şeyi türetin. HKDF-Extract entropiyi katlar; HKDF-Expand birçok bağımsız anahtara uzatır.</p>

<div class="katex-block">$$ \\text{HKDF}(\\text{IKM}, \\text{salt}, \\text{info}) = \\text{Expand}(\\text{Extract}(\\text{salt}, \\text{IKM}), \\text{info}, L) $$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># RFC 5869'dan HKDF-SHA256, amaca göre türetilmiş anahtarlar
import hashlib, hmac

def hkdf_extract(salt, ikm):
    return hmac.new(salt, ikm, hashlib.sha256).digest()

def hkdf_expand(prk, info, length):
    out, t, i = b"", b"", 1
    while len(out) < length:
        t = hmac.new(prk, t + info + bytes([i]), hashlib.sha256).digest()
        out += t
        i  += 1
    return out[:length]

# Cihaz başına kök sır, sağlama sırasında sigortalanır
DEVICE_ROOT = bytes.fromhex("a1" * 32)

prk = hkdf_extract(b"iot-l2-salt", DEVICE_ROOT)
k_storage = hkdf_expand(prk, b"storage-aes",   32)
k_mqtt    = hkdf_expand(prk, b"mqtt-tls-psk",  32)
k_ota     = hkdf_expand(prk, b"ota-verify",    32)

print("storage key :", k_storage.hex()[:24], "...")
print("mqtt key    :", k_mqtt.hex()[:24], "...")
print("ota key     :", k_ota.hex()[:24], "...")
# Üç bağımsız anahtar, hiçbiri saklanmıyor — hepsi tek bir sigortalı sırdan türetilebilir.</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) RFC 5869'un iki HKDF primitifini uygular: <code>hkdf_extract</code> yüksek entropili ama olası önyargılı bir girdiyi (<code>DEVICE_ROOT</code>) tuz ile HMAC-SHA256 kullanarak tek tip bir sözde-rastgele anahtara sıkıştırır. 2) <code>hkdf_expand</code> bu PRK'yı, her birini bir bağlam etiketiyle imzalanmış HMAC blokları zincirleyerek istenen kadar çıktı baytına uzatır — böylece farklı amaçlar bağımsız anahtarlar verir. 3) Üç farklı bağlam dizisi (<code>storage-aes</code>, <code>mqtt-tls-psk</code>, <code>ota-verify</code>) aynı sigortalı sırdan üç ilişkisiz 32-baytlık anahtar türetir. 4) Bir anahtarın (örn. MQTT PSK) ele geçirilmesi saldırgana depolama veya OTA anahtarları hakkında hiçbir şey söylemez ve hiçbirinin asla flash'a yazılması gerekmez.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Uzaktan Kanıtlama</h2>
<p class="l-text">Kanıtlama, uzaktaki bir doğrulayıcının cihazda gerçekten neyin çalıştığını kontrol etmesine izin verir. Akış TPM, SGX ve TrustZone'da aynıdır — yalnızca isimler değişir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Doğrulayıcı nonce gönderir</div><div class="card-body">Rastgele meydan okuma, yeniden oynatmayı önler.</div></div>
<div class="calc-card"><div class="card-title">2. Cihaz bir alıntı üretir</div><div class="card-body">{ PCR'lar, nonce, cihaz-id } içeren imzalı bir yapı, silikonda kök salmış AK tarafından imzalı.</div></div>
<div class="calc-card"><div class="card-title">3. Doğrulayıcı imza zincirini kontrol eder</div><div class="card-body">AK → EK → üretici sertifikası. Alıntının gerçek bir cihazdan geldiğini doğrular.</div></div>
<div class="calc-card"><div class="card-title">4. Doğrulayıcı PCR değerlerini kontrol eder</div><div class="card-body">Firmware sürümü başına altın değerler veritabanına karşı karşılaştırır. Bilinmiyorsa hizmeti reddeder.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Uçtan uca kanıtlama simülasyonu
import hashlib, hmac, secrets, json

DEVICE_AK = secrets.token_bytes(32)        # gerçek hayatta ECDSA olurdu
GOLDEN_PCR = "8b4c..." * 4                 # bu fw sürümü için kayıtlı

def device_quote(pcr_value, nonce, ak):
    body = json.dumps({"pcr": pcr_value, "nonce": nonce.hex()}, sort_keys=True)
    sig  = hmac.new(ak, body.encode(), "sha256").hexdigest()
    return body, sig

def verifier(body, sig, ak, expected_pcr, expected_nonce):
    if hmac.new(ak, body.encode(), "sha256").hexdigest() != sig:
        return "REJECT: kötü imza"
    parsed = json.loads(body)
    if parsed["nonce"] != expected_nonce.hex():
        return "REJECT: nonce uyumsuzluğu (yeniden oynatma)"
    if parsed["pcr"] != expected_pcr:
        return "REJECT: firmware izin listesinde değil"
    return "ACCEPT"

nonce  = secrets.token_bytes(16)
PCR    = "8b4c..." * 4                    # cihazın gerçek mevcut PCR'si
body, sig = device_quote(PCR, nonce, DEVICE_AK)
print(verifier(body, sig, DEVICE_AK, GOLDEN_PCR, nonce))

# Şimdi kurcalanmış bir firmware simüle et
PCR_bad = "deadbeef" * 8
body, sig = device_quote(PCR_bad, nonce, DEVICE_AK)
print(verifier(body, sig, DEVICE_AK, GOLDEN_PCR, nonce))</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>DEVICE_AK</code> silikonda kök salmış bir Attestation Key'i temsil eder — üretimde TPM/TEE tarafından mühürlenmiş bir ECDSA anahtarı olurdu; burada HMAC-SHA256 demo'yu okunaklı tutuyor. 2) <code>device_quote</code> mevcut PCR değerini doğrulayıcının nonce'uyla paketleyip JSON gövdesini imzalar; TPM2_Quote / SGX Quote / TrustZone imzalı-rapor formatlarını yansıtır. 3) Doğrulayıcı önce MAC'i, sonra nonce'u (yeniden oynatma savunması), sonra PCR'yi firmware sürümü için kayıtlı altın değere karşı yeniden kontrol eder — üç bağımsız kontrol, herhangi biri başarısız olursa hizmet reddedilir. 4) İkinci çağrı kurcalanmış veya yetkisiz bir firmware'i modellemek için <code>deadbeef</code> PCR koyar; imza geçerli ama firmware izin listesinde değil, dolayısıyla kanıtlama doğru biçimde REJECT verir.</p>

</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Doğru HRoT'u Seçmek</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Akıllı ampul / sensör (5 dolar altı BoM)</div><div class="card-body">eFuse + flash şifrelemesi + güvenli önyükleme v2 ile ESP32-C3/C6. TPM yok, TrustZone yok. I1-I9 OWASP kapsamı için yeterince iyi.</div></div>
<div class="calc-card"><div class="card-title">Tüketici hub'ı / akıllı hoparlör</div><div class="card-body">TrustZone'lu Cortex-A SoC, anahtar deposu için OP-TEE, sertifika depolaması için isteğe bağlı ayrık SE (NXP A71CH, Microchip ECC608).</div></div>
<div class="calc-card"><div class="card-title">Tıbbi / endüstriyel / otomotiv</div><div class="card-body">PSA Seviye 3 MCU (STM32U5, NXP LPC55) <em>veya</em> SoC + ayrık TPM 2.0. IEC 62443, ISO 14971, ISO/SAE 21434 tarafından gereklidir.</div></div>
<div class="calc-card"><div class="card-title">Bulut / veri merkezi iş yükü</div><div class="card-body">Gizli bilişim: Intel TDX, AMD SEV-SNP, ARM CCA, AWS Nitro Enclaves. Tüm-VM kanıtlama, IoT bulut platformunuzla entegre olur.</div></div>
</div>

<div class="calc-highlight"><strong>Risk odaklı seçim:</strong> iot-L1'den Risk = Olasılık × Etki var. Etki yükseldikçe (yaşam güvenliği, ödemeler, kontrol), HRoT yatırımı da yükselir. 5 dolar altı BoM ürünleri TPM almayacak; yine de doğrulanmış önyükleme, eFuse-kökten anahtarlar ve HKDF almaları gerekir.</div>

<p class="l-text">Donanım güven kökleri gerekli ama yeterli değildir. Bir sonraki ders (iot-L3), bir araştırmacının firmware'inizi tezgâhta aldıktan sonra onunla ne yaptığını ve bu bulguların tehdit modeline nasıl geri beslendiğini gösterir.</p>
</div>`
};
