window.FORENSICS_L5 = {
en: `<p class="l-text"><strong>Memory forensics asks the question: "what was happening when we pulled the plug?"</strong> Disk forensics tells you what the system <em>kept</em> — files, logs, registry hives. Memory tells you what the system was <em>doing</em> — running processes, loaded DLLs, decrypted strings, network connections, kernel hooks, injected shellcode that never touched the disk. The discipline was crystallized by <strong>Aaron Walters</strong> and <strong>Nick Petroni</strong> with the Volatility framework (2007) — Python, plugin-driven, and now in its third major rewrite as <strong>Volatility 3</strong> (2020). The commercial heir <strong>Rekall</strong> (Google, 2014) and the kernel-mode <strong>LiME</strong> (Linux Memory Extractor, 2011, Joe Sylve) round out the toolbox.</p>

<p class="l-text">In this lesson we walk the full memory pipeline: <strong>acquisition</strong> (LiME on Linux, FTK Imager / Magnet RAM Capture / WinPmem on Windows), the <strong>profile / symbol table</strong> problem and how Volatility 3 solved it with PDB-on-demand, the canonical <strong>plugin set</strong> (<code>pslist</code>, <code>pstree</code>, <code>psscan</code>, <code>netstat</code>, <code>malfind</code>, <code>ldrmodules</code>, <code>cmdscan</code>), and an ML-flavored finale: anomaly detection on synthesized process feature vectors with sklearn's IsolationForest.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Acquire memory on Windows (FTK Imager, WinPmem, Magnet RAM) and Linux (LiME, AVML)</li>
<li>Run Volatility 3 plugins: <code>windows.pslist</code>, <code>windows.pstree</code>, <code>windows.netscan</code>, <code>windows.malfind</code></li>
<li>Identify code-injection: hidden processes, RWX sections, unbacked memory regions</li>
<li>Extract command-line history, console buffers, registry hives from RAM</li>
<li>Hunt for kernel rootkits: SSDT/IDT hooks, IRP table tampering, hidden drivers</li>
<li>Train an anomaly detector on process features to flag the "weird" process in a memory image</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Memory? — The Three Big Wins</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fileless &amp; in-memory only</div><div class="card-body">Cobalt Strike beacons, PowerShell empire, reflectively loaded DLLs — visible only in RAM. Disk-only forensics misses them entirely.</div></div>
<div class="calc-card"><div class="card-title">Decrypted secrets</div><div class="card-body">TLS session keys, decrypted ransomware keys, unwrapped credentials. The Mimikatz technique pulls Windows logon LSASS secrets directly from memory.</div></div>
<div class="calc-card"><div class="card-title">Live state</div><div class="card-body">Active connections, command-line strings, clipboard, mounted volumes, open handles, named pipes — all ephemeral, none on disk.</div></div>
<div class="calc-card"><div class="card-title">Anti-forensics resistance</div><div class="card-body">Adversaries who wipe logs, encrypt drives, and use timestomp can rarely sanitize live RAM. The race is to capture before reboot.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Memory Acquisition — Tools and Pitfalls</h2>
<p class="l-text">RAM acquisition is destructive in subtle ways: the <em>act of acquiring</em> changes the memory you are acquiring. Best practice is to use a kernel driver that runs at IRQL high enough to freeze user-mode but small enough to minimize footprint.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Windows: WinPmem</div><div class="card-body">Open-source (Velocidex). Driver-loaded, dumps to AFF4 / raw. Used heavily in Velociraptor incident response.</div></div>
<div class="calc-card"><div class="card-title">Windows: FTK Imager</div><div class="card-body">AccessData (now Exterro). GUI, free, dumps to <code>.mem</code> raw. Industry-standard in legal/eDiscovery contexts.</div></div>
<div class="calc-card"><div class="card-title">Windows: Magnet RAM</div><div class="card-body">Magnet Forensics. Free standalone, very small footprint, MS Defender doesn't scream at it.</div></div>
<div class="calc-card"><div class="card-title">Linux: LiME</div><div class="card-body">Loadable kernel module. <code>insmod lime.ko "path=/mnt/usb/ram.lime format=lime"</code>. Tag-Length-Value format Volatility understands.</div></div>
<div class="calc-card"><div class="card-title">Linux/macOS: AVML</div><div class="card-body">Microsoft's "Acquire Volatile Memory for Linux". Single static binary, zero deps, works on locked-down EDR boxes.</div></div>
<div class="calc-card"><div class="card-title">Cloud / VM</div><div class="card-body">VMware: <code>.vmem</code> beside the suspended VM is a memory dump. AWS: <code>aws ssm</code> + memory plugin. GCP: <code>gcloud beta compute</code> live-attach.</div></div>
</div>

<div class="calc-highlight"><strong>Order of volatility (RFC 3227, 2002):</strong> registers/cache → RAM → routing/ARP/process tables → temp files → disk → remote logs → archives. Capture top-down.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Volatility 3 — Architecture and Symbol Tables</h2>
<p class="l-text">Volatility 2 required you to specify a <em>profile</em> (e.g., <code>Win10x64_19041</code>) — a hand-curated bundle of struct offsets for that exact build. Volatility 3 abandoned this in favor of <strong>Intermediate Symbol Files (ISF)</strong>: JSON.zst symbol tables built from PDBs (Windows) or DWARF (Linux) and downloaded automatically from Microsoft's symbol server. This is why Volatility 3 "just works" on a fresh Windows 11 23H2 dump where Volatility 2 needed a custom profile build.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Run Volatility 3 plugins from Python (real, on a real dump)
import subprocess, json

DUMP = "memory.dmp"
def vol(plugin, *args):
    cmd = ["vol", "-r", "json", "-f", DUMP, plugin, *args]
    out = subprocess.check_output(cmd, text=True)
    return json.loads(out)

processes = vol("windows.pslist.PsList")
print(f"{len(processes)} processes")
for p in processes[:8]:
    print(f"PID {p['PID']:6}  PPID {p['PPID']:6}  {p['ImageFileName']:25}  CreateTime={p['CreateTime']}")

# Find hidden processes (psscan finds via pool tag scan, pslist follows ActiveProcessLinks)
scanned = vol("windows.psscan.PsScan")
seen_pids = {p["PID"] for p in processes}
hidden = [s for s in scanned if s["PID"] not in seen_pids]
print(f"\\nHidden (in psscan, not in pslist): {len(hidden)}")
for h in hidden:
    print(f"  PID {h['PID']}  {h['ImageFileName']}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a thin <code>vol()</code> wrapper that shells out to the <code>vol</code> CLI with <code>-r json</code> and the dump path, then <code>json.loads</code>'s the stdout — so every Volatility plugin becomes a Python list of dicts without writing a custom API client. 2) Calls <code>windows.pslist.PsList</code>, which walks the doubly-linked <code>ActiveProcessLinks</code> chain off <code>PsActiveProcessHead</code> and yields the rows the OS itself would surface. 3) Prints PID, PPID, ImageFileName, and CreateTime — the same four columns Task Manager shows, but reconstructed from raw RAM. 4) Runs <code>windows.psscan.PsScan</code>, which finds <code>_EPROCESS</code> blocks via pool-tag carving (independent of the linked list), then set-differences against pslist's PIDs — anything in <code>scanned</code> but not in <code>seen_pids</code> is a process that <strong>unlinked itself from the list</strong> to hide, the classic rootkit DKOM tell.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Plugin Hall of Fame</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">windows.pslist / pstree</div><div class="card-body">Walk EPROCESS doubly-linked list. <code>pstree</code> shows parent-child — the canonical anomaly is "<code>winword.exe</code> spawned <code>cmd.exe</code> spawned <code>powershell.exe -enc</code>".</div></div>
<div class="calc-card"><div class="card-title">windows.psscan</div><div class="card-body">Pool-tag scan for EPROCESS structures. Finds processes hidden via DKOM (direct kernel object manipulation) — they're not in the linked list but the kernel pool still has the struct.</div></div>
<div class="calc-card"><div class="card-title">windows.netscan</div><div class="card-body">Active TCP/UDP connections, listening sockets, owning PIDs. Match against EDR network logs to corroborate.</div></div>
<div class="calc-card"><div class="card-title">windows.malfind</div><div class="card-body">Lists VAD regions that are <code>PAGE_EXECUTE_READWRITE</code>, unbacked by file, contain executable code. Catches reflective DLLs, Cobalt Strike beacons, shellcode.</div></div>
<div class="calc-card"><div class="card-title">windows.ldrmodules</div><div class="card-body">Compares three lists (InLoadOrder, InMemoryOrder, InInitializationOrder) of loaded DLLs. DLLs in only one list = injected via reflective load.</div></div>
<div class="calc-card"><div class="card-title">windows.cmdline / cmdscan</div><div class="card-body">Extract command lines and console history. <code>cmdscan</code> finds COMMAND_HISTORY structs in <code>conhost.exe</code> — recovers what the attacker typed.</div></div>
<div class="calc-card"><div class="card-title">windows.handles / filescan</div><div class="card-body">Open file/registry/event handles per process. Locked-but-deleted files often surface here.</div></div>
<div class="calc-card"><div class="card-title">windows.ssdt / callbacks</div><div class="card-body">System Service Descriptor Table hooks — classic kernel rootkit trick. Modern Windows has PatchGuard but rootkits still try.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Catching Code Injection</h2>
<p class="l-text">The <code>malfind</code> plugin alone catches the majority of in-memory implants. The logic:</p>

<ol style="line-height:1.7;padding-left:1.4rem">
<li>Walk every process's VAD (Virtual Address Descriptor) tree.</li>
<li>Filter to regions with <code>PAGE_EXECUTE_READWRITE</code> protection (legitimate code is RX, not RWX).</li>
<li>Filter to regions with no backing file (legit DLLs are mapped from <code>.dll</code> files).</li>
<li>Read first 64 bytes — if they look like x86 code (e.g., <code>4D 5A</code> = MZ, or <code>55 8B EC</code> = push ebp; mov ebp,esp), high suspicion.</li>
</ol>

<div class="calc-highlight">A clean Windows 11 desktop typically has 0–2 <code>malfind</code> hits (some browser JIT, .NET CLR). 5+ hits in unrelated processes = strong injection signal.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Memory Anomaly Detection with sklearn</h2>
<p class="l-text">Real SOCs run thousands of memory dumps a year. Manual triage doesn't scale. A practical pattern: extract a per-process feature vector from each dump, train an unsupervised anomaly detector, and let it flag the outliers for human review. Below we synthesize realistic process features and use <strong>IsolationForest</strong> (Liu, Ting, Zhou, 2008) to catch a planted "Cobalt Strike beacon" injected into <code>svchost.exe</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(11)

# Synthesize 200 "clean" processes: handles, threads, RWX regions, unbacked-mem MB, ppid_depth
n = 200
data = {
  "handles":       rng.integers(20, 400, n),
  "threads":       rng.integers(1, 20, n),
  "rwx_regions":   rng.integers(0, 2, n),       # mostly 0
  "unbacked_mb":   rng.gamma(0.5, 1.0, n),       # mostly &lt; 2 MB
  "ppid_depth":    rng.integers(1, 5, n),
}
df = pd.DataFrame(data)
df["name"] = ["legit_proc"]*n

# Plant a Cobalt-Strike-style beacon in svchost.exe
inj = pd.DataFrame([{
  "handles": 320, "threads": 12,
  "rwx_regions": 4, "unbacked_mb": 18.0,
  "ppid_depth": 2, "name": "svchost.exe[INJECTED]"
}])
df = pd.concat([df, inj], ignore_index=True)

iso = IsolationForest(contamination=0.01, random_state=11).fit(df.drop(columns=["name"]))
df["score"] = iso.decision_function(df.drop(columns=["name","score"], errors="ignore"))
df["flag"]  = iso.predict(df.drop(columns=["name","score","flag"], errors="ignore"))

print(df.sort_values("score").head(5).to_string(index=False))
print("\\nLowest-score row is the injected svchost — IsolationForest caught it without labels.")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Synthesizes 200 "clean" processes as a <code>pd.DataFrame</code> with five features that real Volatility plugins surface: <code>handles</code>, <code>threads</code>, <code>rwx_regions</code> (mostly 0 for benign code), <code>unbacked_mb</code> drawn from <code>gamma(0.5, 1.0)</code> (skewed near zero), and <code>ppid_depth</code>. 2) Plants a Cobalt-Strike-style beacon as a single extra row inside <code>svchost.exe</code> with the giveaway profile — 4 RWX regions and 18 MB of unbacked executable memory — and <code>pd.concat</code>'s it into the dataframe. 3) Fits <code>IsolationForest(contamination=0.01)</code> on the numeric columns; the algorithm builds random partitioning trees and gives points an isolation score — the rarer the feature combination, the shorter the path to isolate, the more anomalous. 4) Sorts by score and prints the bottom five — the injected svchost row sits at the very bottom, caught with zero labels, the exact unsupervised-DFIR pattern Liu/Ting/Zhou's 2008 paper enabled.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same IsolationForest pipeline on synthetic memory features, with the planted injection.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(11)
n = 200
df = pd.DataFrame({
  "handles":     rng.integers(20, 400, n),
  "threads":     rng.integers(1, 20, n),
  "rwx_regions": rng.integers(0, 2, n),
  "unbacked_mb": rng.gamma(0.5, 1.0, n),
  "ppid_depth":  rng.integers(1, 5, n),
})
df["name"] = ["proc_"+str(i) for i in range(n)]
df.loc[len(df)] = [320, 12, 4, 18.0, 2, "svchost.exe[INJECTED]"]

feats = df.drop(columns=["name"])
iso = IsolationForest(contamination=0.01, random_state=11).fit(feats)
df["score"] = iso.decision_function(feats)

print(df.nsmallest(5, "score").to_string(index=False))
print("\\nThe injected svchost has the lowest anomaly score — flagged for analyst review.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kernel Rootkits in Memory</h2>
<p class="l-text">Above the user-mode rabbit hole sits the kernel — and rootkits. On Windows, <strong>PatchGuard</strong> (KPP) since 2005 makes naive SSDT/IDT hooking unstable. Real-world kernel implants either bring their own signed driver (<strong>BYOVD</strong> = Bring Your Own Vulnerable Driver, e.g., the ScRSO/Daxin technique) or exploit kernel CVEs.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SSDT hook (legacy)</div><div class="card-body">Replace pointer in System Service Descriptor Table to redirect <code>NtQuerySystemInformation</code> and hide a process. <code>volatility windows.ssdt</code> shows non-<code>ntoskrnl</code> targets.</div></div>
<div class="calc-card"><div class="card-title">DKOM (Direct Kernel Object Manipulation)</div><div class="card-body">Unlink EPROCESS from <code>ActiveProcessLinks</code>. Hidden from <code>pslist</code>, found by <code>psscan</code>'s pool-tag scan.</div></div>
<div class="calc-card"><div class="card-title">IRP hooking</div><div class="card-body">Replace driver IRP_MJ_* dispatch table entries. <code>volatility windows.driverirp</code> dumps the table.</div></div>
<div class="calc-card"><div class="card-title">BYOVD</div><div class="card-body">Load <code>RTCore64.sys</code> (MSI Afterburner) or <code>gdrv.sys</code> (Gigabyte) — both have arbitrary-MSR-write CVEs and are signed. Microsoft's vulnerable-driver blocklist counters in Win11 22H2+.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Linux Memory — A Different Beast</h2>
<p class="l-text">On Linux the equivalent of EPROCESS is <code>task_struct</code>, the equivalent of pslist is walking <code>init_task</code>'s <code>tasks</code> list, and the equivalent of malfind is hunting RWX <code>vm_area_struct</code> regions. Volatility 3 has the <code>linux.pslist</code>, <code>linux.pstree</code>, <code>linux.malfind</code>, <code>linux.bash</code> (recovers shell history from <code>bash</code> heap!) plugins. The acquisition file is a LiME-formatted dump or a raw dd-of-/dev/mem when SecureBoot allows.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Memory shows what disk cannot: fileless implants, decrypted secrets, live state.</li>
<li>Acquire fast, with the smallest tool: WinPmem / AVML / LiME.</li>
<li>Volatility 3 uses ISF symbol tables — no profile builds needed.</li>
<li>Plugin priority: pslist, pstree, psscan, netscan, malfind, ldrmodules, cmdscan.</li>
<li>IsolationForest on per-process features is a strong unsupervised triage filter.</li>
</ul>
</div>
<p class="l-text">Next, in <strong>forensics-L6</strong>, we move from RAM to wire and read network traffic with Wireshark, Zeek, and JA3/JA4 fingerprinting.</p>
</div>`,
tr: `<p class="l-text"><strong>Bellek adli bilişimi şu soruyu sorar: "fişi çektiğimizde ne oluyordu?"</strong> Disk adli bilişimi size sistemin neyi <em>tuttuğunu</em> söyler — dosyalar, günlükler, kayıt defteri kovanları. Bellek size sistemin neyi <em>yaptığını</em> söyler — çalışan süreçler, yüklü DLL'ler, çözülmüş dizgiler, ağ bağlantıları, çekirdek hook'ları, diske hiç dokunmayan enjekte edilmiş shellcode. Disiplin, <strong>Aaron Walters</strong> ve <strong>Nick Petroni</strong> tarafından Volatility çerçevesiyle (2007) kristalize edildi — Python, eklenti odaklı, ve şimdi <strong>Volatility 3</strong> (2020) olarak üçüncü büyük yeniden yazımında. Ticari mirasçısı <strong>Rekall</strong> (Google, 2014) ve çekirdek modlu <strong>LiME</strong> (Linux Memory Extractor, 2011, Joe Sylve) alet kutusunu tamamlar.</p>

<p class="l-text">Bu derste tam bellek boru hattını yürüyoruz: <strong>edinim</strong> (Linux'ta LiME, Windows'ta FTK Imager / Magnet RAM Capture / WinPmem), <strong>profil / sembol tablosu</strong> sorunu ve Volatility 3'ün PDB-talep-üzerine ile bunu nasıl çözdüğü, kanonik <strong>eklenti seti</strong> (<code>pslist</code>, <code>pstree</code>, <code>psscan</code>, <code>netstat</code>, <code>malfind</code>, <code>ldrmodules</code>, <code>cmdscan</code>) ve ML aromalı bir final: sklearn'in IsolationForest'ı ile sentezlenmiş süreç özellik vektörlerinde anomali tespiti.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Windows'ta (FTK Imager, WinPmem, Magnet RAM) ve Linux'ta (LiME, AVML) bellek edinmek</li>
<li>Volatility 3 eklentilerini çalıştırmak: <code>windows.pslist</code>, <code>windows.pstree</code>, <code>windows.netscan</code>, <code>windows.malfind</code></li>
<li>Kod enjeksiyonunu tanımlamak: gizli süreçler, RWX bölümler, dayanaksız bellek bölgeleri</li>
<li>RAM'den komut satırı geçmişini, konsol tamponlarını, kayıt defteri kovanlarını çıkarmak</li>
<li>Çekirdek rootkit'leri için av: SSDT/IDT hook'ları, IRP tablosu kurcalama, gizli sürücüler</li>
<li>Bir bellek imajındaki "garip" süreci işaretlemek için süreç özellikleri üzerinde anomali dedektörü eğitmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Bellek? — Üç Büyük Kazanç</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dosyasız &amp; sadece bellekte</div><div class="card-body">Cobalt Strike beacon'ları, PowerShell empire, reflektif olarak yüklenmiş DLL'ler — yalnızca RAM'de görünür. Sadece disk adli bilişimi onları tamamen kaçırır.</div></div>
<div class="calc-card"><div class="card-title">Çözülmüş sırlar</div><div class="card-body">TLS oturum anahtarları, çözülmüş fidye yazılımı anahtarları, sarmalanmamış kimlik bilgileri. Mimikatz tekniği Windows oturum açma LSASS sırlarını doğrudan bellekten çeker.</div></div>
<div class="calc-card"><div class="card-title">Canlı durum</div><div class="card-body">Aktif bağlantılar, komut satırı dizgileri, pano, bağlı birimler, açık handle'lar, adlandırılmış pipe'lar — hepsi geçici, hiçbiri diskte değil.</div></div>
<div class="calc-card"><div class="card-title">Anti-adli direnç</div><div class="card-body">Günlükleri silen, sürücüleri şifreleyen ve timestomp kullanan düşmanlar canlı RAM'i nadiren temizleyebilir. Yarış yeniden başlatmadan önce yakalamaktır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bellek Edinimi — Araçlar ve Tuzaklar</h2>
<p class="l-text">RAM edinimi ince yollarla yıkıcıdır: <em>edinme eylemi</em> edindiğiniz belleği değiştirir. En iyi uygulama, kullanıcı modunu dondurmak için yeterince yüksek IRQL'de çalışan ama ayak izini en aza indirmek için yeterince küçük bir çekirdek sürücüsü kullanmaktır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Windows: WinPmem</div><div class="card-body">Açık kaynak (Velocidex). Sürücü yüklemeli, AFF4 / raw'a döker. Velociraptor olay müdahalesinde yoğun kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Windows: FTK Imager</div><div class="card-body">AccessData (şimdi Exterro). GUI, ücretsiz, <code>.mem</code> raw'a döker. Hukuki/eDiscovery bağlamlarında sektör standardı.</div></div>
<div class="calc-card"><div class="card-title">Windows: Magnet RAM</div><div class="card-body">Magnet Forensics. Ücretsiz bağımsız, çok küçük ayak izi, MS Defender ona bağırmıyor.</div></div>
<div class="calc-card"><div class="card-title">Linux: LiME</div><div class="card-body">Yüklenebilir çekirdek modülü. <code>insmod lime.ko "path=/mnt/usb/ram.lime format=lime"</code>. Volatility'nin anladığı Tag-Length-Value formatı.</div></div>
<div class="calc-card"><div class="card-title">Linux/macOS: AVML</div><div class="card-body">Microsoft'un "Acquire Volatile Memory for Linux"u. Tek statik ikili, sıfır bağımlılık, kilitli EDR kutularında çalışır.</div></div>
<div class="calc-card"><div class="card-title">Cloud / VM</div><div class="card-body">VMware: askıya alınmış VM yanındaki <code>.vmem</code> bir bellek dökümüdür. AWS: <code>aws ssm</code> + bellek eklentisi. GCP: <code>gcloud beta compute</code> canlı-bağlantı.</div></div>
</div>

<div class="calc-highlight"><strong>Uçuculuk sırası (RFC 3227, 2002):</strong> yazmaçlar/önbellek → RAM → yönlendirme/ARP/süreç tabloları → geçici dosyalar → disk → uzak günlükler → arşivler. Tepeden aşağı yakala.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Volatility 3 — Mimari ve Sembol Tabloları</h2>
<p class="l-text">Volatility 2 bir <em>profil</em> belirtmenizi gerektiriyordu (ör. <code>Win10x64_19041</code>) — o tam derleme için elle hazırlanmış bir struct ofset paketi. Volatility 3 bunu <strong>Intermediate Symbol Files (ISF)</strong> lehine terk etti: PDB'lerden (Windows) veya DWARF'tan (Linux) oluşturulan ve Microsoft'un sembol sunucusundan otomatik indirilen JSON.zst sembol tabloları. Volatility 3'ün, Volatility 2'nin özel profil derlemesi gerektirdiği yepyeni bir Windows 11 23H2 dökümünde "sadece çalışmasının" nedeni budur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Volatility 3 eklentilerini Python'dan çalıştır (gerçek, gerçek bir döküm üzerinde)
import subprocess, json

DUMP = "memory.dmp"
def vol(plugin, *args):
    cmd = ["vol", "-r", "json", "-f", DUMP, plugin, *args]
    out = subprocess.check_output(cmd, text=True)
    return json.loads(out)

processes = vol("windows.pslist.PsList")
print(f"{len(processes)} processes")
for p in processes[:8]:
    print(f"PID {p['PID']:6}  PPID {p['PPID']:6}  {p['ImageFileName']:25}  CreateTime={p['CreateTime']}")

# Gizli süreçleri bul (psscan pool tag taramasıyla bulur, pslist ActiveProcessLinks'i takip eder)
scanned = vol("windows.psscan.PsScan")
seen_pids = {p["PID"] for p in processes}
hidden = [s for s in scanned if s["PID"] not in seen_pids]
print(f"\\nHidden (in psscan, not in pslist): {len(hidden)}")
for h in hidden:
    print(f"  PID {h['PID']}  {h['ImageFileName']}")
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) İnce bir <code>vol()</code> wrapper'ı tanımlar — <code>vol</code> CLI'sini <code>-r json</code> ve dump yoluyla shell-out ederek çağırır ve stdout'u <code>json.loads</code> eder; böylece her Volatility eklentisi özel API client yazmadan Python dict listesine dönüşür. 2) <code>windows.pslist.PsList</code>'i çağırır; bu eklenti <code>PsActiveProcessHead</code>'den başlayan çift bağlı <code>ActiveProcessLinks</code> zincirini yürür ve OS'in kendisinin yüzeye çıkaracağı satırları üretir. 3) PID, PPID, ImageFileName ve CreateTime'ı yazdırır — Task Manager'ın gösterdiği aynı dört kolon, ama ham RAM'den yeniden inşa edilmiş. 4) <code>windows.psscan.PsScan</code>'i çalıştırır; bu, bağlı listeden bağımsız olarak pool-tag carving ile <code>_EPROCESS</code> bloklarını bulur, sonra pslist'in PID'lerine karşı set farkı alır — <code>scanned</code>'de olup <code>seen_pids</code>'de olmayan her şey, gizlenmek için <strong>kendini listeden çıkarmış</strong> bir process'tir; klasik rootkit DKOM imzası.</p>

</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Eklenti Şöhret Salonu</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">windows.pslist / pstree</div><div class="card-body">EPROCESS çift bağlı listesini yürü. <code>pstree</code> ebeveyn-çocuk gösterir — kanonik anomali "<code>winword.exe</code> doğurdu <code>cmd.exe</code> doğurdu <code>powershell.exe -enc</code>"dur.</div></div>
<div class="calc-card"><div class="card-title">windows.psscan</div><div class="card-body">EPROCESS yapıları için pool-tag taraması. DKOM (doğrudan çekirdek nesne manipülasyonu) ile gizlenmiş süreçleri bulur — bağlı listede değiller ama çekirdek pool'unda hâlâ struct var.</div></div>
<div class="calc-card"><div class="card-title">windows.netscan</div><div class="card-body">Aktif TCP/UDP bağlantıları, dinleyen soketler, sahip PID'ler. EDR ağ günlüklerine karşı eşleşip doğrula.</div></div>
<div class="calc-card"><div class="card-title">windows.malfind</div><div class="card-body"><code>PAGE_EXECUTE_READWRITE</code> olan, dosyayla dayanağı olmayan, çalıştırılabilir kod içeren VAD bölgelerini listeler. Reflektif DLL'leri, Cobalt Strike beacon'larını, shellcode'u yakalar.</div></div>
<div class="calc-card"><div class="card-title">windows.ldrmodules</div><div class="card-body">Yüklü DLL'lerin üç listesini (InLoadOrder, InMemoryOrder, InInitializationOrder) karşılaştırır. Yalnızca bir listede olan DLL'ler = reflektif yükleme ile enjekte edildi.</div></div>
<div class="calc-card"><div class="card-title">windows.cmdline / cmdscan</div><div class="card-body">Komut satırlarını ve konsol geçmişini çıkar. <code>cmdscan</code> <code>conhost.exe</code>'de COMMAND_HISTORY struct'larını bulur — saldırganın yazdığını kurtarır.</div></div>
<div class="calc-card"><div class="card-title">windows.handles / filescan</div><div class="card-body">Süreç başına açık dosya/kayıt defteri/event handle'ları. Kilitli-ama-silinmiş dosyalar genellikle burada yüzeye çıkar.</div></div>
<div class="calc-card"><div class="card-title">windows.ssdt / callbacks</div><div class="card-body">Sistem Servis Tanımlayıcı Tablosu hook'ları — klasik çekirdek rootkit hilesi. Modern Windows'ta PatchGuard var ama rootkit'ler yine de denerler.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Kod Enjeksiyonu Yakalama</h2>
<p class="l-text"><code>malfind</code> eklentisi tek başına bellek-içi implantların çoğunu yakalar. Mantığı:</p>

<ol style="line-height:1.7;padding-left:1.4rem">
<li>Her sürecin VAD (Sanal Adres Tanımlayıcı) ağacını yürü.</li>
<li><code>PAGE_EXECUTE_READWRITE</code> korumalı bölgelere filtrele (meşru kod RX'tir, RWX değil).</li>
<li>Dayanak dosyası olmayan bölgelere filtrele (meşru DLL'ler <code>.dll</code> dosyalarından eşlenir).</li>
<li>İlk 64 baytı oku — x86 koduna benziyorlarsa (ör. <code>4D 5A</code> = MZ veya <code>55 8B EC</code> = push ebp; mov ebp,esp), yüksek şüphe.</li>
</ol>

<div class="calc-highlight">Temiz bir Windows 11 masaüstünde tipik olarak 0–2 <code>malfind</code> isabeti vardır (bazı tarayıcı JIT, .NET CLR). İlgisiz süreçlerde 5+ isabet = güçlü enjeksiyon sinyali.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. sklearn ile Bellek Anomali Tespiti</h2>
<p class="l-text">Gerçek SOC'lar yılda binlerce bellek dökümü çalıştırır. Manuel triyaj ölçeklenmez. Pratik bir örüntü: her dökümden süreç başına bir özellik vektörü çıkar, gözetimsiz bir anomali dedektörü eğit ve insan incelemesi için aykırıları işaretlemesine izin ver. Aşağıda gerçekçi süreç özellikleri sentezliyoruz ve <strong>IsolationForest</strong> (Liu, Ting, Zhou, 2008) ile <code>svchost.exe</code>'ye enjekte edilmiş bir "Cobalt Strike beacon"unu yakalıyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(11)

# 200 "temiz" süreç sentezle: handles, threads, RWX regions, unbacked-mem MB, ppid_depth
n = 200
data = {
  "handles":       rng.integers(20, 400, n),
  "threads":       rng.integers(1, 20, n),
  "rwx_regions":   rng.integers(0, 2, n),       # mostly 0
  "unbacked_mb":   rng.gamma(0.5, 1.0, n),       # mostly &lt; 2 MB
  "ppid_depth":    rng.integers(1, 5, n),
}
df = pd.DataFrame(data)
df["name"] = ["legit_proc"]*n

# svchost.exe'ye Cobalt-Strike-stili bir beacon yerleştir
inj = pd.DataFrame([{
  "handles": 320, "threads": 12,
  "rwx_regions": 4, "unbacked_mb": 18.0,
  "ppid_depth": 2, "name": "svchost.exe[INJECTED]"
}])
df = pd.concat([df, inj], ignore_index=True)

iso = IsolationForest(contamination=0.01, random_state=11).fit(df.drop(columns=["name"]))
df["score"] = iso.decision_function(df.drop(columns=["name","score"], errors="ignore"))
df["flag"]  = iso.predict(df.drop(columns=["name","score","flag"], errors="ignore"))

print(df.sort_values("score").head(5).to_string(index=False))
print("\\nEn düşük puanlı satır enjekte edilmiş svchost — IsolationForest etiketsiz yakaladı.")
</code></pre></div>
<p class="l-text"><strong>Kodun adım adım işleyişi:</strong> 1) Gerçek Volatility eklentilerinin yüzeye çıkardığı beş özellikle 200 "temiz" process'i <code>pd.DataFrame</code> olarak sentezler: <code>handles</code>, <code>threads</code>, <code>rwx_regions</code> (benign kod için çoğunlukla 0), <code>gamma(0.5, 1.0)</code>'dan çekilen <code>unbacked_mb</code> (sıfıra yakın eğri) ve <code>ppid_depth</code>. 2) <code>svchost.exe</code> içine, ele veren profille — 4 RWX bölge ve 18 MB unbacked executable bellek — Cobalt-Strike-stili bir beacon'u tek bir ek satır olarak yerleştirir ve <code>pd.concat</code> ile dataframe'e ekler. 3) <code>IsolationForest(contamination=0.01)</code>'ı sayısal kolonlar üzerinde fit'ler; algoritma rastgele partitioning ağaçları kurar ve noktalara isolation puanı verir — özellik kombinasyonu ne kadar nadirse, izole etmek için yol o kadar kısadır, anomali sinyali o kadar güçlüdür. 4) Puana göre sıralar ve en alt beşi yazdırır — enjekte edilmiş svchost satırı tam dipte oturur, sıfır etiketle yakalanmış; Liu/Ting/Zhou'nun 2008 makalesinin mümkün kıldığı tam unsupervised-DFIR örüntüsü.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı IsolationForest boru hattı sentetik bellek özellikleri üzerinde, yerleştirilmiş enjeksiyonla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np, pandas as pd
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(11)
n = 200
df = pd.DataFrame({
  "handles":     rng.integers(20, 400, n),
  "threads":     rng.integers(1, 20, n),
  "rwx_regions": rng.integers(0, 2, n),
  "unbacked_mb": rng.gamma(0.5, 1.0, n),
  "ppid_depth":  rng.integers(1, 5, n),
})
df["name"] = ["proc_"+str(i) for i in range(n)]
df.loc[len(df)] = [320, 12, 4, 18.0, 2, "svchost.exe[INJECTED]"]

feats = df.drop(columns=["name"])
iso = IsolationForest(contamination=0.01, random_state=11).fit(feats)
df["score"] = iso.decision_function(feats)

print(df.nsmallest(5, "score").to_string(index=False))
print("\\nEnjekte edilmiş svchost en düşük anomali puanına sahip — analist incelemesi için işaretlendi.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Bellekte Çekirdek Rootkit'leri</h2>
<p class="l-text">Kullanıcı modu tavşan deliğinin üstünde çekirdek — ve rootkit'ler oturur. Windows'ta, 2005'ten beri <strong>PatchGuard</strong> (KPP) naif SSDT/IDT hook'lamayı kararsız hale getirir. Gerçek dünya çekirdek implantları ya kendi imzalı sürücülerini getirir (<strong>BYOVD</strong> = Bring Your Own Vulnerable Driver, ör. ScRSO/Daxin tekniği) ya da çekirdek CVE'lerini istismar eder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SSDT hook (eski)</div><div class="card-body">Sistem Servis Tanımlayıcı Tablosundaki işaretçiyi <code>NtQuerySystemInformation</code>'ı yönlendirip bir süreci gizlemek için değiştir. <code>volatility windows.ssdt</code> non-<code>ntoskrnl</code> hedefleri gösterir.</div></div>
<div class="calc-card"><div class="card-title">DKOM (Doğrudan Çekirdek Nesne Manipülasyonu)</div><div class="card-body">EPROCESS'i <code>ActiveProcessLinks</code>'ten ayır. <code>pslist</code>'ten gizli, <code>psscan</code>'in pool-tag taramasıyla bulundu.</div></div>
<div class="calc-card"><div class="card-title">IRP hook'lama</div><div class="card-body">Sürücü IRP_MJ_* dispatch tablosu girdilerini değiştir. <code>volatility windows.driverirp</code> tabloyu döker.</div></div>
<div class="calc-card"><div class="card-title">BYOVD</div><div class="card-body"><code>RTCore64.sys</code> (MSI Afterburner) veya <code>gdrv.sys</code> (Gigabyte) yükle — her ikisinde de keyfi-MSR-yazma CVE'leri var ve imzalılar. Microsoft'un savunmasız sürücü engelleme listesi Win11 22H2+'da karşılık verir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Linux Belleği — Farklı Bir Canavar</h2>
<p class="l-text">Linux'ta EPROCESS'in eşdeğeri <code>task_struct</code>, pslist'in eşdeğeri <code>init_task</code>'in <code>tasks</code> listesini yürümek ve malfind'in eşdeğeri RWX <code>vm_area_struct</code> bölgelerini avlamaktır. Volatility 3'te <code>linux.pslist</code>, <code>linux.pstree</code>, <code>linux.malfind</code>, <code>linux.bash</code> (kabuk geçmişini <code>bash</code> heap'inden kurtarır!) eklentileri vardır. Edinim dosyası LiME formatlı bir döküm veya SecureBoot izin verdiğinde /dev/mem'in ham dd'sidir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 TEMEL ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bellek diskin gösteremediğini gösterir: dosyasız implantlar, çözülmüş sırlar, canlı durum.</li>
<li>Hızlı edin, en küçük araçla: WinPmem / AVML / LiME.</li>
<li>Volatility 3 ISF sembol tabloları kullanır — profil derlemesi gerekmez.</li>
<li>Eklenti önceliği: pslist, pstree, psscan, netscan, malfind, ldrmodules, cmdscan.</li>
<li>Süreç başına özellikler üzerinde IsolationForest güçlü gözetimsiz triyaj filtresidir.</li>
</ul>
</div>
<p class="l-text">Sırada, <strong>forensics-L6</strong>'da, RAM'den tele geçiyoruz ve Wireshark, Zeek ve JA3/JA4 parmak izi ile ağ trafiğini okuyoruz.</p>
</div>`
};
