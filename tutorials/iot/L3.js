window.IOT_L3 = {
en: `<p class="l-text"><strong>Firmware analysis is where IoT security gets its hands dirty.</strong> Unlike a desktop application that ships as a familiar PE or ELF, IoT firmware lands on the analyst's bench as a vendor-blessed black box: a single-file image (often <code>.bin</code> or <code>.img</code>) containing a bootloader, a kernel, a root filesystem, and an application stack — all packed, sometimes encrypted, sometimes signed, almost always undocumented. The discipline of cracking that black box was made approachable by Craig Heffner's <strong>binwalk</strong> (2010, the canonical signature scanner), <strong>firmware-mod-kit</strong>, the QEMU-based <strong>FirmAE</strong> (Korea Univ., 2020) and <strong>FirmAFL</strong> emulators, and the venerable <strong>Ghidra</strong> with its first-class ARM and MIPS disassembly support.</p>

<p class="l-text">In this lesson we walk the firmware-RE pipeline: <strong>acquisition</strong> (vendor download, JTAG, UART, flash chip dump), <strong>signature scanning &amp; carving</strong> with binwalk, <strong>filesystem extraction</strong> (SquashFS, JFFS2, UBIFS, CramFS), <strong>emulation</strong> with FirmAE for system-level dynamic analysis on x86 hosts, and <strong>vulnerability hunting</strong> on the extracted binaries. We close with a runnable Python "binwalk-lite" that scans for known magic-byte signatures — exactly the algorithm Heffner's tool runs at scale.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Acquire firmware: vendor download, UART/JTAG console, flash desolder + chip programmer</li>
<li>Use binwalk to identify embedded files and extract filesystems</li>
<li>Recognize SquashFS, UBIFS, JFFS2, CramFS — the IoT FS quartet</li>
<li>Emulate firmware with FirmAE / firmadyne; understand userspace vs system emulation</li>
<li>Disassemble ARM and MIPS binaries in Ghidra; understand calling conventions on each</li>
<li>Build a binwalk-lite signature scanner in Python</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. How Firmware Lands on Your Bench</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vendor download</div><div class="card-body">Easiest. Most home routers, IP cameras, smart-home hubs publish firmware updates publicly. Just check the manufacturer's support page.</div></div>
<div class="calc-card"><div class="card-title">UART / serial console</div><div class="card-body">Most embedded boards have a debug UART (baud 115200 typical). Bus Pirate, FT232, or simple USB-UART adapter. Drop into a u-boot prompt to dump flash.</div></div>
<div class="calc-card"><div class="card-title">JTAG</div><div class="card-body">Manufacturer's debug port. JTAGulator (Joe Grand) finds the pins; OpenOCD + GDB extract memory. Often disabled on production silicon, sometimes not.</div></div>
<div class="calc-card"><div class="card-title">Flash chip read</div><div class="card-body">Last resort. Desolder SPI flash (often SOIC-8 W25Qxx), drop into a CH341A or XGecu programmer. Always works; destroys the device.</div></div>
<div class="calc-card"><div class="card-title">OTA capture</div><div class="card-body">MITM the device's update HTTPS. Some devices pin certs; some don't.</div></div>
<div class="calc-card"><div class="card-title">FCC ID lookup</div><div class="card-body">FCC.io shows internal photos and sometimes firmware. Underused first stop.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Binwalk — Signature Scanner</h2>
<p class="l-text">Most firmware is a concatenation of: a header, a kernel image, a root filesystem image, possibly a separate user filesystem, and a footer. Each piece begins with a recognizable magic-byte signature. Binwalk knows ~100 signatures (gzip, lzma, xz, JFFS2, SquashFS variants, ELF, U-Boot uImage, JPEG, RSA keys, Linux kernel ARM zImage) and reports every offset where one matches.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Drive binwalk and parse its output (real environment)
import subprocess

# Scan
result = subprocess.run(["binwalk", "router_fw.bin"], capture_output=True, text=True)
print(result.stdout[:1500])

# Extract embedded files (-e), recursive (-M)
subprocess.run(["binwalk", "-eM", "router_fw.bin"])
# Result tree: _router_fw.bin.extracted/
#   100/ 100.gz   (extracted gzip)
#   2A0000/ ...
#   2A0000.squashfs (full filesystem)
print("Look in _router_fw.bin.extracted/squashfs-root/ for the real OS image.")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Connects to an MQTT broker (Mosquitto, EMQX, AWS IoT Core, Azure IoT Hub) — use TLS (port 8883) ALWAYS, plain 1883 only on isolated lab networks. 2) Authenticates via username/password OR (preferred) X.509 client certificate — per-device cert lets you revoke a single compromised gadget without rotating the whole fleet. 3) Publishes to a topic with a QoS level: 0 fire-and-forget, 1 at-least-once (default for telemetry), 2 exactly-once (rare, expensive). 4) Subscribes the cloud side with topic ACLs so device A cannot read device B's stream — without ACLs, one rooted device sees everyone's data.</p>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The IoT Filesystem Quartet</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SquashFS</div><div class="card-body">Read-only compressed (gzip / lzma / lz4 / zstd). Magic <code>hsqs</code> or <code>sqsh</code>. Mount with <code>unsquashfs</code>. Most home-router rootfs.</div></div>
<div class="calc-card"><div class="card-title">JFFS2</div><div class="card-body">Journaling Flash File System v2. Read-write, designed for raw flash. Magic <code>0x1985</code> per node. Use <code>jefferson</code> tool to extract.</div></div>
<div class="calc-card"><div class="card-title">UBIFS</div><div class="card-body">Modern flash FS. Image is wrapped in UBI (Unsorted Block Images) layer. Tools: <code>ubireader</code>, <code>ubidump</code>.</div></div>
<div class="calc-card"><div class="card-title">CramFS</div><div class="card-body">Old read-only. Mostly legacy now but still in some embedded distros. <code>uncramfs</code> extracts.</div></div>
</div>

<div class="calc-highlight">Once extracted, the rootfs is a Linux directory tree. Look at <code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/usr/bin/</code>, <code>/sbin/init</code>, <code>/etc/init.d/</code>, web server (<code>httpd</code>, <code>boa</code>, <code>mini_httpd</code>) and CGI binaries. The vulnerabilities live in those CGI binaries 80% of the time.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Emulation with FirmAE / Firmadyne / QEMU</h2>
<p class="l-text">Most embedded targets run on ARM or MIPS. Static analysis tells you the call graph; <strong>emulation</strong> lets you actually visit the web admin page and try injection. <strong>QEMU</strong> can run user-mode (one binary at a time) or system-mode (full VM with kernel). For complete firmware, the toolchain that "just works" is <strong>FirmAE</strong> (Korea University) or its predecessor <strong>Firmadyne</strong>: they auto-detect FS, build a QEMU image, set up network bridges, boot the firmware, and present you with a live web admin to hammer.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">qemu-arm-static</div><div class="card-body">User-mode emulator. Run a single MIPS binary (e.g., a CGI) on x86 with <code>chroot + qemu-mips-static</code>.</div></div>
<div class="calc-card"><div class="card-title">qemu-system-mips</div><div class="card-body">Full VM. Boot a vendor's kernel + rootfs. Slower setup, lets the OS itself run.</div></div>
<div class="calc-card"><div class="card-title">FirmAE</div><div class="card-body">Heuristic auto-emulator with NVRAM emulation, network setup, web fuzz target. ~80% success rate on consumer routers.</div></div>
<div class="calc-card"><div class="card-title">FirmAFL</div><div class="card-body">FirmAE + AFL fuzzing harness. Coverage-guided fuzzing on emulated firmware.</div></div>
<div class="calc-card"><div class="card-title">Unicorn</div><div class="card-body">QEMU-derived CPU emulator as a Python library. Skip OS, run just a function. Useful for unpacking individual routines.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. ARM and MIPS Disassembly Pointers</h2>
<p class="l-text">Most consumer routers run MIPS (32-bit big- or little-endian) or ARMv7. Modern phones and Yocto-based devices run ARMv8 (aarch64). The calling conventions you must remember:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ARM32 (AAPCS)</div><div class="card-body">Args 1–4 in r0–r3, return in r0, frame pointer fp/r11, stack pointer sp/r13, link register lr/r14, program counter pc/r15.</div></div>
<div class="calc-card"><div class="card-title">ARM64 (AAPCS64)</div><div class="card-body">Args 1–8 in x0–x7, return in x0, frame pointer x29, link register x30, stack pointer sp.</div></div>
<div class="calc-card"><div class="card-title">MIPS o32</div><div class="card-body">Args 1–4 in $a0–$a3, additional on stack but with 16-byte reserved space. Return in $v0–$v1. $ra is link register.</div></div>
<div class="calc-card"><div class="card-title">MIPS branch delay slot</div><div class="card-body">The instruction <em>after</em> a branch always executes — it's in the "branch delay slot". Confuses every new MIPS reverser.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Vulnerability Hunting in CGI Binaries</h2>
<p class="l-text">A consumer router's web admin is implemented as small C binaries in <code>/usr/sbin/httpd</code> or as CGIs in <code>/web/cgi-bin/</code>. Recurring bug patterns:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">strcpy / sprintf into stack buffer</div><div class="card-body">Classic stack overflow. Many MIPS routers ship with no NX, no ASLR, no stack canary — every overflow is RCE.</div></div>
<div class="calc-card"><div class="card-title">system() with attacker-controlled string</div><div class="card-body">Hardcoded format like <code>system("/bin/iwconfig wlan0 essid \\"%s\\"", user_input)</code> — quote-escape and you have shell.</div></div>
<div class="calc-card"><div class="card-title">Hardcoded admin / backdoor</div><div class="card-body">Search the rootfs strings for "admin", "backdoor", "support" — surprisingly often there's a hidden cred.</div></div>
<div class="calc-card"><div class="card-title">Custom auth bypass</div><div class="card-body">Many devices check session cookies in code, then a single CGI forgets the check. Diff session-validation across all CGIs.</div></div>
<div class="calc-card"><div class="card-title">Insecure update</div><div class="card-body">Firmware update without signature verification → push your own image → persistent rootkit.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Binwalk-Lite in Python</h2>
<p class="l-text">Below: a self-contained signature scanner that knows ~10 magic byte patterns. Runs on any binary, prints offset + label. The real binwalk has ~100 signatures and an entropy plot, but the engine is the same: scan all offsets, match against patterns, report.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re

SIGS = [
    (b"hsqs",                    "SquashFS LE (gzip/lzma)"),
    (b"sqsh",                    "SquashFS BE"),
    (b"\\x85\\x19",                "JFFS2 magic 0x1985"),
    (b"UBI#",                    "UBI Container"),
    (b"\\x1f\\x8b\\x08",            "gzip"),
    (b"\\xfd7zXZ\\x00",             "xz / LZMA2"),
    (b"]\\x00\\x00\\x80",            "lzma stream"),
    (b"\\x7fELF",                  "ELF"),
    (b"MZ",                      "DOS/PE"),
    (b"\\x27\\x05\\x19\\x56",         "U-Boot uImage"),
    (b"AT&amp;TFORM",                "iff/jpeg"),
    (b"-----BEGIN RSA",          "RSA private key"),
]

def binwalk_lite(buf):
    hits = []
    for sig, label in SIGS:
        for m in re.finditer(re.escape(sig), buf):
            hits.append((m.start(), label, sig))
    hits.sort()
    return hits

# Synthesize a fake firmware
fake = (b"\\x00"*512 + b"\\x27\\x05\\x19\\x56" + b"uImage header here..."*4
        + b"\\x00"*256 + b"\\x1f\\x8b\\x08" + b"gzipped kernel here..."*8
        + b"\\x00"*128 + b"hsqs" + b"squashfs root..."*16
        + b"\\x00"*64 + b"-----BEGIN RSA PRIVATE KEY-----")

for off, label, sig in binwalk_lite(fake):
    print(f"0x{off:08x}  {label}  (matched {sig[:8]!r}{'...' if len(sig)&gt;8 else ''})")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds firmware for an embedded target (ESP32, nRF52, STM32) — toolchain produces a signed binary; signature verification is enforced by the bootloader (secure boot). 2) Secure boot chain: ROM → first-stage bootloader (immutable, eFuse-locked public key) → app — break any link and the device boots only authentic firmware. 3) OTA update path: download signed image to secondary slot, verify signature + version (anti-rollback eFuse counter), swap-and-reboot, fallback if first boot fails. 4) Encrypted flash (AES-XTS via efused key) protects against physical chip-off attacks; combine with anti-tamper (mesh, sensors) for high-value devices.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same scanner, browser-runnable. Try changing the signatures dictionary or constructing your own fake firmware buffer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SIGS = [(b"hsqs","SquashFS"), (b"\\x1f\\x8b\\x08","gzip"),
        (b"\\x7fELF","ELF"), (b"\\x27\\x05\\x19\\x56","U-Boot uImage"),
        (b"-----BEGIN","PEM key/cert")]

def scan(buf):
    out = []
    for sig, label in SIGS:
        i = 0
        while True:
            i = buf.find(sig, i)
            if i &lt; 0: break
            out.append((i, label))
            i += 1
    out.sort()
    return out

fake = (b"\\x00"*200 + b"\\x27\\x05\\x19\\x56kernel"*3 + b"\\x00"*100
        + b"\\x1f\\x8b\\x08gzipped"*5 + b"\\x00"*50 + b"hsqssquash"*10
        + b"\\x00"*30 + b"-----BEGIN PRIVATE KEY-----")
for off, label in scan(fake):
    print(f"0x{off:06x}  {label}")
print(f"\\ntotal hits: {len(scan(fake))}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Once You Have Shell — Persistence and Pivot</h2>
<p class="l-text">Hitting RCE on an embedded device is the start, not the end. The mature analyst then asks:</p>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>Is the device a network gateway? Can I pivot to internal LAN?</li>
<li>Can I write to flash to persist across reboot?</li>
<li>Are creds reused across the vendor's product line (BSSID-derived default passwords)?</li>
<li>Can I add a CVE entry with a clean PoC and responsible disclosure?</li>
<li>If the device is critical infrastructure (PLC, HMI, medical), DO NOT touch live; coordinate with CISA/ICS-CERT.</li>
</ol>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Acquire from vendor → UART → JTAG → flash chip — the ladder of difficulty.</li>
<li>Binwalk = signature scanner; the IoT FS quartet is SquashFS, JFFS2, UBIFS, CramFS.</li>
<li>FirmAE / FirmAFL emulate full firmware in QEMU; Unicorn for single-routine analysis.</li>
<li>ARM/MIPS calling conventions: r0–r3 / x0–x7 / $a0–$a3. MIPS has branch delay slot.</li>
<li>CGI binaries are the bug well: strcpy, system, hardcoded creds, broken auth.</li>
</ul>
</div>
<p class="l-text">Next, <strong>iot-L4</strong>: wireless IoT — BLE, Zigbee, LoRaWAN — and how they fail.</p>
</div>`,
tr: `<p class="l-text"><strong>Firmware analizi, IoT güvenliğinin ellerini kirlettiği yerdir.</strong> Tanıdık bir PE veya ELF olarak gönderilen bir masaüstü uygulamasının aksine, IoT firmware'i analistin tezgâhına satıcı onaylı bir kara kutu olarak iner: bir bootloader, bir çekirdek, bir kök dosya sistemi ve bir uygulama yığını içeren tek dosyalı bir imaj (genellikle <code>.bin</code> veya <code>.img</code>) — hepsi paketlenmiş, bazen şifrelenmiş, bazen imzalanmış, neredeyse her zaman belgesiz. Bu kara kutuyu kırma disiplini Craig Heffner'ın <strong>binwalk</strong>'ı (2010, kanonik imza tarayıcı), <strong>firmware-mod-kit</strong>, QEMU tabanlı <strong>FirmAE</strong> (Kore Üniv., 2020) ve <strong>FirmAFL</strong> öykünücüleri ve birinci sınıf ARM ve MIPS disassembly desteğine sahip saygıdeğer <strong>Ghidra</strong> tarafından erişilebilir hâle getirildi.</p>

<p class="l-text">Bu derste firmware-RE boru hattını yürüyoruz: <strong>edinme</strong> (satıcı indirme, JTAG, UART, flash çip dump'ı), binwalk ile <strong>imza tarama &amp; oyma</strong>, <strong>dosya sistemi çıkarma</strong> (SquashFS, JFFS2, UBIFS, CramFS), x86 ana bilgisayarlarda sistem-seviyesi dinamik analiz için FirmAE ile <strong>öykünme</strong> ve çıkarılan ikiliklerde <strong>zafiyet avcılığı</strong>. Bilinen sihirli-bayt imzalarını tarayan çalıştırılabilir bir Python "binwalk-lite" ile kapatıyoruz — tam olarak Heffner'ın aracının ölçekte çalıştırdığı algoritma.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Firmware edinme: satıcı indirme, UART/JTAG konsolu, flash sökme + çip programlayıcı</li>
<li>Gömülü dosyaları tanımlamak ve dosya sistemlerini çıkarmak için binwalk kullanın</li>
<li>SquashFS, UBIFS, JFFS2, CramFS'i tanıyın — IoT FS dörtlüsü</li>
<li>FirmAE / firmadyne ile firmware'i öykünün; kullanıcı alanı vs sistem öykünmesini anlayın</li>
<li>Ghidra'da ARM ve MIPS ikiliklerini disassemble edin; her birinde çağrı kurallarını anlayın</li>
<li>Python'da bir binwalk-lite imza tarayıcı oluşturun</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Firmware Tezgâhınıza Nasıl İner</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Satıcı indirme</div><div class="card-body">En kolayı. Çoğu ev yönlendiricisi, IP kamera, akıllı ev hub'ı firmware güncellemelerini herkese açık şekilde yayımlar. Üreticinin destek sayfasını kontrol edin.</div></div>
<div class="calc-card"><div class="card-title">UART / seri konsol</div><div class="card-body">Çoğu gömülü kartın bir hata ayıklama UART'ı vardır (tipik baud 115200). Bus Pirate, FT232 veya basit USB-UART adaptörü. Flash dump'ı için bir u-boot prompt'una düşün.</div></div>
<div class="calc-card"><div class="card-title">JTAG</div><div class="card-body">Üreticinin hata ayıklama portu. JTAGulator (Joe Grand) pinleri bulur; OpenOCD + GDB belleği çıkarır. Üretim silikonunda genellikle devre dışı, bazen değil.</div></div>
<div class="calc-card"><div class="card-title">Flash çip okuma</div><div class="card-body">Son çare. SPI flash'ı (genellikle SOIC-8 W25Qxx) sökün, bir CH341A veya XGecu programlayıcıya düşürün. Her zaman çalışır; cihazı yok eder.</div></div>
<div class="calc-card"><div class="card-title">OTA yakalama</div><div class="card-body">Cihazın güncelleme HTTPS'ini MITM yapın. Bazı cihazlar sertifikaları sabitler; bazıları yapmaz.</div></div>
<div class="calc-card"><div class="card-title">FCC ID araması</div><div class="card-body">FCC.io iç fotoğrafları ve bazen firmware'i gösterir. Yetersiz kullanılan ilk durak.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Binwalk — İmza Tarayıcı</h2>
<p class="l-text">Çoğu firmware şunların birleşimidir: bir başlık, bir çekirdek imajı, bir kök dosya sistemi imajı, muhtemelen ayrı bir kullanıcı dosya sistemi ve bir altbilgi. Her parça tanınabilir bir sihirli-bayt imzası ile başlar. Binwalk ~100 imza bilir (gzip, lzma, xz, JFFS2, SquashFS varyantları, ELF, U-Boot uImage, JPEG, RSA anahtarları, Linux çekirdeği ARM zImage) ve birinin eşleştiği her offset'i bildirir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Binwalk'ı çalıştır ve çıktısını ayrıştır (gerçek ortam)
import subprocess

# Tara
result = subprocess.run(["binwalk", "router_fw.bin"], capture_output=True, text=True)
print(result.stdout[:1500])

# Gömülü dosyaları çıkar (-e), özyinelemeli (-M)
subprocess.run(["binwalk", "-eM", "router_fw.bin"])
# Sonuç ağacı: _router_fw.bin.extracted/
#   100/ 100.gz   (çıkarılmış gzip)
#   2A0000/ ...
#   2A0000.squashfs (tam dosya sistemi)
print("Gerçek OS imajı için _router_fw.bin.extracted/squashfs-root/ içine bakın.")
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Bir MQTT broker'a bağlanır (Mosquitto, EMQX, AWS IoT Core, Azure IoT Hub) — HER ZAMAN TLS (port 8883) kullan, açık 1883 sadece izole laboratuvar ağında. 2) Username/password ile VEYA (tercih edilen) X.509 client sertifikası ile kimlik doğrular — cihaz başına sertifika tek ele geçirilmiş cihazı tüm filoyu döndürmeden iptal etmenizi sağlar. 3) Bir topic'e QoS seviyesiyle yayınlar: 0 fire-and-forget, 1 en-az-bir-kere (telemetri için default), 2 tam-bir-kere (nadir, pahalı). 4) Bulut tarafında topic ACL ile abone olun — cihaz A cihaz B'nin stream'ini okuyamasın; ACL olmazsa root'lanmış bir cihaz herkesin verisini görür.</p>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. IoT Dosya Sistemi Dörtlüsü</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SquashFS</div><div class="card-body">Salt okunur sıkıştırılmış (gzip / lzma / lz4 / zstd). Sihirli <code>hsqs</code> veya <code>sqsh</code>. <code>unsquashfs</code> ile bağlayın. Çoğu ev-yönlendiricisi rootfs'i.</div></div>
<div class="calc-card"><div class="card-title">JFFS2</div><div class="card-body">Journaling Flash File System v2. Okuma-yazma, ham flash için tasarlanmış. Düğüm başına sihirli <code>0x1985</code>. Çıkarmak için <code>jefferson</code> aracını kullanın.</div></div>
<div class="calc-card"><div class="card-title">UBIFS</div><div class="card-body">Modern flash FS. İmaj UBI (Unsorted Block Images) katmanına sarılır. Araçlar: <code>ubireader</code>, <code>ubidump</code>.</div></div>
<div class="calc-card"><div class="card-title">CramFS</div><div class="card-body">Eski salt okunur. Şimdi çoğunlukla eski ama bazı gömülü distrolarda hâlâ. <code>uncramfs</code> çıkarır.</div></div>
</div>

<div class="calc-highlight">Çıkarıldıktan sonra, rootfs bir Linux dizin ağacıdır. <code>/etc/passwd</code>, <code>/etc/shadow</code>, <code>/usr/bin/</code>, <code>/sbin/init</code>, <code>/etc/init.d/</code>, web sunucusu (<code>httpd</code>, <code>boa</code>, <code>mini_httpd</code>) ve CGI ikiliklerine bakın. Zafiyetler %80 oranında o CGI ikiliklerinde yaşar.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. FirmAE / Firmadyne / QEMU ile Öykünme</h2>
<p class="l-text">Çoğu gömülü hedef ARM veya MIPS üzerinde çalışır. Statik analiz size çağrı grafiğini söyler; <strong>öykünme</strong> aslında web yönetici sayfasını ziyaret etmenize ve enjeksiyonu denemenize izin verir. <strong>QEMU</strong> kullanıcı modunda (her seferinde bir ikili) veya sistem modunda (çekirdekli tam VM) çalışabilir. Tam firmware için, "sadece çalışan" araç zinciri <strong>FirmAE</strong>'dir (Kore Üniversitesi) veya öncülü <strong>Firmadyne</strong>: FS'yi otomatik tespit ederler, bir QEMU imajı oluştururlar, ağ köprülerini kurarlar, firmware'i önyüklerler ve size üzerine vurmak için canlı bir web yöneticisi sunarlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">qemu-arm-static</div><div class="card-body">Kullanıcı modu öykünücüsü. <code>chroot + qemu-mips-static</code> ile x86'da tek bir MIPS ikiliğini (örneğin bir CGI) çalıştırın.</div></div>
<div class="calc-card"><div class="card-title">qemu-system-mips</div><div class="card-body">Tam VM. Bir satıcının çekirdek + rootfs'ini önyükleyin. Daha yavaş kurulum, OS'in kendisinin çalışmasına izin verir.</div></div>
<div class="calc-card"><div class="card-title">FirmAE</div><div class="card-body">NVRAM öykünmesi, ağ kurulumu, web fuzz hedefi ile sezgisel otomatik öykünücü. Tüketici yönlendiricilerinde ~%80 başarı oranı.</div></div>
<div class="calc-card"><div class="card-title">FirmAFL</div><div class="card-body">FirmAE + AFL fuzz koşumu. Öykünülmüş firmware üzerinde kapsama-güdümlü fuzz.</div></div>
<div class="calc-card"><div class="card-title">Unicorn</div><div class="card-body">Python kütüphanesi olarak QEMU türetilmiş CPU öykünücüsü. OS'i atlayın, yalnızca bir fonksiyon çalıştırın. Bireysel rutinleri çıkarmak için yararlı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. ARM ve MIPS Disassembly İpuçları</h2>
<p class="l-text">Çoğu tüketici yönlendiricisi MIPS (32-bit big- veya little-endian) veya ARMv7 üzerinde çalışır. Modern telefonlar ve Yocto tabanlı cihazlar ARMv8 (aarch64) üzerinde çalışır. Hatırlamanız gereken çağrı kuralları:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ARM32 (AAPCS)</div><div class="card-body">Args 1–4 r0–r3'te, dönüş r0'da, çerçeve işaretçisi fp/r11, yığın işaretçisi sp/r13, link kaydı lr/r14, program sayacı pc/r15.</div></div>
<div class="calc-card"><div class="card-title">ARM64 (AAPCS64)</div><div class="card-body">Args 1–8 x0–x7'de, dönüş x0'da, çerçeve işaretçisi x29, link kaydı x30, yığın işaretçisi sp.</div></div>
<div class="calc-card"><div class="card-title">MIPS o32</div><div class="card-body">Args 1–4 $a0–$a3'te, ek olanlar yığında ama 16-baytlık ayrılmış alan ile. Dönüş $v0–$v1'de. $ra link kaydıdır.</div></div>
<div class="calc-card"><div class="card-title">MIPS dal gecikme slotu</div><div class="card-body">Bir daldan <em>sonraki</em> komut her zaman yürütülür — "dal gecikme slotunda"dır. Her yeni MIPS tersine çevirenini şaşırtır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CGI İkiliklerinde Zafiyet Avcılığı</h2>
<p class="l-text">Bir tüketici yönlendiricisinin web yöneticisi <code>/usr/sbin/httpd</code>'deki küçük C ikilikleri olarak veya <code>/web/cgi-bin/</code>'deki CGI'lar olarak uygulanır. Yinelenen hata desenleri:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yığın tamponuna strcpy / sprintf</div><div class="card-body">Klasik yığın taşması. Birçok MIPS yönlendiricisi NX yok, ASLR yok, yığın canary'si yok ile gönderilir — her taşma RCE'dir.</div></div>
<div class="calc-card"><div class="card-title">Saldırgan kontrollü dize ile system()</div><div class="card-body"><code>system("/bin/iwconfig wlan0 essid \\"%s\\"", user_input)</code> gibi sabit kodlanmış format — tırnak-kaçışı yapın ve shell'e sahipsiniz.</div></div>
<div class="calc-card"><div class="card-title">Sabit kodlanmış admin / arka kapı</div><div class="card-body">Rootfs dizelerini "admin", "backdoor", "support" için arayın — şaşırtıcı şekilde sıklıkla gizli bir cred vardır.</div></div>
<div class="calc-card"><div class="card-title">Özel auth atlatma</div><div class="card-body">Birçok cihaz oturum çerezlerini kodda kontrol eder, sonra tek bir CGI kontrolü unutur. Tüm CGI'larda oturum-doğrulamasını karşılaştırın.</div></div>
<div class="calc-card"><div class="card-title">Güvensiz güncelleme</div><div class="card-body">İmza doğrulaması olmadan firmware güncellemesi → kendi imajınızı itin → kalıcı rootkit.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Python'da Binwalk-Lite</h2>
<p class="l-text">Aşağıda: ~10 sihirli bayt desenini bilen bağımsız bir imza tarayıcı. Herhangi bir ikilide çalışır, offset + etiket yazdırır. Gerçek binwalk'ın ~100 imzası ve bir entropi grafiği vardır, ancak motor aynıdır: tüm offset'leri tara, desenlere karşı eşleştir, raporla.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re

SIGS = [
    (b"hsqs",                    "SquashFS LE (gzip/lzma)"),
    (b"sqsh",                    "SquashFS BE"),
    (b"\\x85\\x19",                "JFFS2 sihirli 0x1985"),
    (b"UBI#",                    "UBI Konteyner"),
    (b"\\x1f\\x8b\\x08",            "gzip"),
    (b"\\xfd7zXZ\\x00",             "xz / LZMA2"),
    (b"]\\x00\\x00\\x80",            "lzma akış"),
    (b"\\x7fELF",                  "ELF"),
    (b"MZ",                      "DOS/PE"),
    (b"\\x27\\x05\\x19\\x56",         "U-Boot uImage"),
    (b"AT&amp;TFORM",                "iff/jpeg"),
    (b"-----BEGIN RSA",          "RSA özel anahtar"),
]

def binwalk_lite(buf):
    hits = []
    for sig, label in SIGS:
        for m in re.finditer(re.escape(sig), buf):
            hits.append((m.start(), label, sig))
    hits.sort()
    return hits

# Sahte bir firmware sentezle
fake = (b"\\x00"*512 + b"\\x27\\x05\\x19\\x56" + b"uImage header here..."*4
        + b"\\x00"*256 + b"\\x1f\\x8b\\x08" + b"gzipped kernel here..."*8
        + b"\\x00"*128 + b"hsqs" + b"squashfs root..."*16
        + b"\\x00"*64 + b"-----BEGIN RSA PRIVATE KEY-----")

for off, label, sig in binwalk_lite(fake):
    print(f"0x{off:08x}  {label}  (matched {sig[:8]!r}{'...' if len(sig)&gt;8 else ''})")
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Gömülü hedef için firmware derler (ESP32, nRF52, STM32) — toolchain imzalı binary üretir; imza doğrulamasını bootloader (secure boot) zorlar. 2) Secure boot zinciri: ROM → birinci-aşama bootloader (değişmez, eFuse-kilitli public key) → uygulama — herhangi bir halkayı kır, cihaz sadece otantik firmware boot eder. 3) OTA güncelleme yolu: imzalı imajı yedek slot'a indir, imza + sürüm doğrula (anti-rollback eFuse sayacı), swap-and-reboot, ilk boot başarısızsa fallback. 4) Şifreli flash (eFuse anahtarıyla AES-XTS) fiziksel chip-off saldırılarına karşı korur; yüksek değerli cihazlar için anti-tamper (mesh, sensör) ile birleştir.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı tarayıcı, browser'da çalıştırılabilir. SIGS sözlüğünü değiştirmeyi veya kendi sahte firmware tamponunuzu oluşturmayı deneyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>SIGS = [(b"hsqs","SquashFS"), (b"\\x1f\\x8b\\x08","gzip"),
        (b"\\x7fELF","ELF"), (b"\\x27\\x05\\x19\\x56","U-Boot uImage"),
        (b"-----BEGIN","PEM key/cert")]

def scan(buf):
    out = []
    for sig, label in SIGS:
        i = 0
        while True:
            i = buf.find(sig, i)
            if i &lt; 0: break
            out.append((i, label))
            i += 1
    out.sort()
    return out

fake = (b"\\x00"*200 + b"\\x27\\x05\\x19\\x56kernel"*3 + b"\\x00"*100
        + b"\\x1f\\x8b\\x08gzipped"*5 + b"\\x00"*50 + b"hsqssquash"*10
        + b"\\x00"*30 + b"-----BEGIN PRIVATE KEY-----")
for off, label in scan(fake):
    print(f"0x{off:06x}  {label}")
print(f"\\ntotal hits: {len(scan(fake))}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Shell'iniz Olduğunda — Kalıcılık ve Pivot</h2>
<p class="l-text">Bir gömülü cihazda RCE'ye vurmak başlangıçtır, son değil. Olgun analist sonra şunu sorar:</p>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>Cihaz bir ağ geçidi mi? Dahili LAN'a pivot yapabilir miyim?</li>
<li>Yeniden başlatma boyunca kalıcılık için flash'a yazabilir miyim?</li>
<li>Cred'ler satıcının ürün hattı boyunca yeniden kullanılıyor mu (BSSID-türetilmiş varsayılan parolalar)?</li>
<li>Temiz bir PoC ve sorumlu ifşa ile bir CVE girişi ekleyebilir miyim?</li>
<li>Cihaz kritik altyapı ise (PLC, HMI, tıbbi), CANLIYA DOKUNMAYIN; CISA/ICS-CERT ile koordine edin.</li>
</ol>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; Sonraki Adım</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Satıcıdan edin → UART → JTAG → flash çip — zorluk merdiveni.</li>
<li>Binwalk = imza tarayıcı; IoT FS dörtlüsü SquashFS, JFFS2, UBIFS, CramFS.</li>
<li>FirmAE / FirmAFL QEMU'da tam firmware öykünür; tek-rutin analizi için Unicorn.</li>
<li>ARM/MIPS çağrı kuralları: r0–r3 / x0–x7 / $a0–$a3. MIPS'in dal gecikme slotu vardır.</li>
<li>CGI ikilikleri hata kuyusudur: strcpy, system, sabit kodlanmış cred'ler, bozuk auth.</li>
</ul>
</div>
<p class="l-text">Sonraki, <strong>iot-L4</strong>: kablosuz IoT — BLE, Zigbee, LoRaWAN — ve nasıl başarısız olurlar.</p>
</div>`
};
