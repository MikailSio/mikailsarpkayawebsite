window.FORENSICS_L3 = {
en: `<p class="l-text"><strong>Dynamic analysis is the moment we stop reading the suspect's diary and let them act.</strong> Where static analysis maps a binary's potential, dynamic analysis records the binary's choices — every API call it makes, every registry key it touches, every byte it sends out the wire. The trade-off is risk: you are detonating a live weapon. The discipline that emerged around safely doing this is called <strong>sandboxing</strong>, and the open-source classic is <strong>Cuckoo Sandbox</strong> (Claudio Guarnieri, 2010), with commercial heirs like <strong>ANY.RUN</strong> (interactive, browser-based, founded 2016) and <strong>Joe Sandbox</strong> dominating modern SOCs.</p>

<p class="l-text">In this lesson we walk the dynamic pipeline end-to-end: how a sandbox isolates a sample inside a disposable VM, how an <strong>API hook</strong> intercepts <code>CreateFileW</code> or <code>WSASend</code> calls and logs them, how <strong>Frida</strong> (Ole André Vadla Ravnås, 2013) gives you Python-driven instrumentation on running processes, and how malware fights back with <strong>anti-VM, anti-debug, and timing-based evasion</strong>. The empirical lesson of the last decade — from <strong>Trickbot</strong> to <strong>Emotet</strong> to <strong>BlackCat</strong> — is that real-world samples now ship with 30+ environment checks before they execute their first malicious instruction.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Architect a Cuckoo or CAPEv2 sandbox: host, guest VM, agent, network sink, snapshot/revert</li>
<li>Read an ANY.RUN process tree and behavior graph the way an analyst reads a movie</li>
<li>Hook Win32 APIs with Frida (<code>Interceptor.attach</code>) and dump arguments live</li>
<li>Recognize the canonical anti-VM, anti-debug, and anti-sandbox tricks (RDTSC timing, sleep skipping, PEB.BeingDebugged)</li>
<li>Classify a sample family from its API call sequence with a simple sklearn model</li>
<li>Understand why "interactive" sandboxes (ANY.RUN, Triage) beat fully-automated ones for evasive malware</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Dynamic at All?</h2>
<p class="l-text">Static analysis hits a wall on three classes of sample: <strong>packed</strong> (where the real code only exists in memory after the unpacker runs), <strong>obfuscated</strong> (control-flow flattening, opaque predicates), and <strong>downloaders</strong> (trivial loaders that fetch the real payload from C2). For all three, runtime behavior is the ground truth. Dynamic analysis answers the question "what does this thing actually do?" by literally letting it do it — under a microscope.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Behavior over signatures</div><div class="card-body">A sample can be repacked daily; its <em>behavior</em> (write to <code>%APPDATA%\\X.exe</code>, set Run key, beacon to a Tor address) is much more stable. SOCs build behavior-based rules in Sigma, KQL, EDR.</div></div>
<div class="calc-card"><div class="card-title">Memory artifacts</div><div class="card-body">Decrypted strings, unpacked PE in memory, injected shellcode — none visible on disk. Dynamic + memory dump gives the static analyst what static could not.</div></div>
<div class="calc-card"><div class="card-title">Network ground truth</div><div class="card-body">DNS requests, TLS SNI, HTTP user-agents, beacon intervals — observable only at runtime. PCAPs are gold for IoC extraction.</div></div>
<div class="calc-card"><div class="card-title">Limitation</div><div class="card-body">Sample may not run on first try (missing C2, wrong locale, anti-VM). Modern malware tests for 20+ artifacts of analyst environment before any payload.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Sandbox Architecture — Cuckoo and CAPEv2</h2>
<p class="l-text">A modern open-source sandbox is a small distributed system. <strong>Cuckoo</strong> (and its more actively maintained fork <strong>CAPEv2</strong>, Kevin O'Reilly) consists of a Linux <em>host</em> running the orchestrator, one or more Windows/Linux <em>guests</em> in VirtualBox/KVM/Hyper-V, an in-guest <em>agent</em> that runs the sample and reports back, and a <em>results processor</em> that writes the report (JSON + screenshots + PCAP + dropped files).</p>

<div class="calc-highlight"><strong>Snapshot/revert is sacred:</strong> after every analysis, the guest VM is rolled back to a known-clean snapshot. Without it, contamination from sample N reaches sample N+1 and your reports become a lie.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Submit a sample to a Cuckoo/CAPEv2 instance via REST
import requests
files = {"file": ("sample.exe", open("sample.exe","rb"))}
data  = {"timeout": 120, "machine": "win10x64-clean"}
r = requests.post("http://cuckoo.lab:8090/tasks/create/file",
                  files=files, data=data)
task_id = r.json()["task_id"]
print("Submitted as task", task_id)

# Poll until report is ready
import time
while True:
    r = requests.get(f"http://cuckoo.lab:8090/tasks/view/{task_id}")
    if r.json()["task"]["status"] == "reported":
        break
    time.sleep(5)

report = requests.get(f"http://cuckoo.lab:8090/tasks/report/{task_id}/json").json()
print("Detected family:", report.get("malfamily"))
print("API calls:", len(report["behavior"]["processes"][0]["calls"]))
print("DNS queries:", [d["request"] for d in report["network"]["dns"]])
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Opens <code>sample.exe</code> in binary mode and posts it as multipart form-data to Cuckoo/CAPEv2's <code>/tasks/create/file</code> REST endpoint with a 120-second <code>timeout</code> and a pinned <code>machine</code> name. 2) Pulls the freshly assigned <code>task_id</code> from the JSON response — every later call hangs off this ID. 3) Polls <code>/tasks/view/{task_id}</code> on a 5-second cadence and breaks when <code>status == "reported"</code>, meaning the guest VM has executed the sample, the results processor has finalized the report, and the snapshot has been reverted. 4) Fetches the full JSON report and prints three high-value fields: <code>malfamily</code> (signature-matched family), the count of API calls in the first process (a behavioral fingerprint), and every <code>request</code> string from <code>network.dns</code> — the C2 domain candidates.</p>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ANY.RUN — Interactive Cloud Sandboxing</h2>
<p class="l-text"><strong>ANY.RUN</strong> changed the field by making sandboxing <em>interactive</em>: the analyst sees the guest desktop in the browser, can click "Enable Editing" on a phishing doc, type credentials into a fake login, or browse to a follow-on URL. This defeats samples that wait for human input (CAPTCHAs, click-to-detonate). The <strong>process tree</strong> view (parent → child with command-line arguments) is the canonical mental model for behavior analysis: <code>winword.exe → cmd.exe /c powershell -enc ... → rundll32.exe loader.dll,Start</code> is the LOLBin chain you learn to spot in your sleep.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Process tree</div><div class="card-body">Parent-child with full command line, signed-status, MITRE ATT&amp;CK techniques per process. Hover any process to see API calls and dropped files.</div></div>
<div class="calc-card"><div class="card-title">Network</div><div class="card-body">HTTP, DNS, TLS SNI, Suricata IDS alerts, Threat Intelligence lookups on every IP/domain.</div></div>
<div class="calc-card"><div class="card-title">MITRE ATT&amp;CK overlay</div><div class="card-body">Behaviors mapped to tactics/techniques (T1059.001 PowerShell, T1547.001 Run keys, T1071.001 Web protocols).</div></div>
<div class="calc-card"><div class="card-title">IOC export</div><div class="card-body">One-click STIX 2.1 / MISP JSON / plain CSV for SIEM ingestion. Hashes, URLs, mutexes, registry keys all included.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. API Hooking with Frida</h2>
<p class="l-text">Sandboxes work because they <strong>hook</strong> the OS APIs the sample calls. The classical technique is <em>inline hooking</em>: overwrite the first bytes of <code>kernel32!CreateFileW</code> with a <code>jmp</code> to your handler, log the arguments, then jump back. <strong>Detours</strong> (Microsoft Research, 1999) and <strong>EasyHook</strong> made this routine on Windows. The modern, cross-platform tool is <strong>Frida</strong>: a Python/JavaScript bridge that lets you script hooks live on a running process.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import frida, sys

js_hook = """
Interceptor.attach(Module.getExportByName('kernel32.dll', 'CreateFileW'), {
  onEnter(args) {
    const path = args[0].readUtf16String();
    const access = args[1].toInt32();
    send({ api: 'CreateFileW', path: path, access: access.toString(16) });
  }
});
Interceptor.attach(Module.getExportByName('ws2_32.dll', 'send'), {
  onEnter(args) {
    const sock = args[0].toInt32();
    const buf  = args[1];
    const len  = args[2].toInt32();
    send({ api: 'send', sock: sock, len: len,
           preview: buf.readByteArray(Math.min(len, 32)) });
  }
});
"""
session = frida.attach("notepad.exe")
script = session.create_script(js_hook)
script.on("message", lambda msg, data: print(msg["payload"]))
script.load()
sys.stdin.read()
</code></pre></div>

<p class="l-text">Frida shines when you need to <em>defeat anti-debug</em>: rewrite <code>IsDebuggerPresent</code> to always return 0, patch out <code>NtQueryInformationProcess</code> ProcessDebugPort checks, neutralize <code>RDTSC</code> timing checks. Five lines of JavaScript replace a half-day of OllyDbg work.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Anti-VM and Anti-Sandbox Tricks</h2>
<p class="l-text">A 2024 survey of commodity malware found that 78% of samples implement at least one environment check, and 41% bail out without writing any IoC if the check trips. The canonical tricks:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CPUID hypervisor bit</div><div class="card-body"><code>CPUID(1).ECX[31]</code> = hypervisor present. Trivially set on any VM. Real malware: do it, but also check vendor string from <code>CPUID(0x40000000)</code>: "VMwareVMware", "KVMKVMKVM", "Microsoft Hv", "VBoxVBoxVBox".</div></div>
<div class="calc-card"><div class="card-title">RDTSC timing</div><div class="card-body">Two <code>rdtsc</code> reads around a <code>cpuid</code> — on bare metal &lt; 1000 cycles, on Cuckoo with hooks 50,000+. Sandboxes counter by patching <code>rdtsc</code> values.</div></div>
<div class="calc-card"><div class="card-title">Sleep skipping</div><div class="card-body">Malware: <code>Sleep(600000)</code> to outlast the 2-min sandbox. Sandboxes: hook Sleep and immediately return. Counter-counter: use <code>NtDelayExecution</code> with verification via <code>GetTickCount</code> deltas.</div></div>
<div class="calc-card"><div class="card-title">Artifact hunt</div><div class="card-body">Files like <code>C:\\Windows\\System32\\drivers\\VBoxMouse.sys</code>, registry <code>HKLM\\HARDWARE\\DESCRIPTION\\System\\SystemBiosVersion=VBOX</code>, MAC OUI 00:05:69 (VMware), 08:00:27 (VBox).</div></div>
<div class="calc-card"><div class="card-title">Username / domain</div><div class="card-body">Classic samples bail on usernames "sandbox", "malware", "currentuser", "John Doe", or domain-joined &lt; 7 days. ANY.RUN counters with realistic synthetic environments.</div></div>
<div class="calc-card"><div class="card-title">Mouse / process count</div><div class="card-body">Pristine VM has 30 processes, real desktop has 120+. Mouse cursor at (0,0) and not moving for 5 min = sandbox.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Behavioral Classification with sklearn</h2>
<p class="l-text">A surprisingly strong baseline for "what family is this?" is to take the <em>sequence</em> of API calls (or just the multiset) and feed it to a classical ML model. Microsoft's 2015 Kaggle Malware Classification Challenge was won by gradient-boosted trees on opcode + API n-grams. Below we simulate this with synthetic call sequences for three families.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

rng = np.random.default_rng(7)

# Family signatures (over-represented APIs)
families = {
  "ransomware":  ["CryptEncrypt","FindFirstFileW","WriteFile","SetFileAttributesW","DeleteFileW"],
  "infostealer": ["RegOpenKeyExW","RegQueryValueExW","CreateFileW","ReadFile","WinHttpSendRequest"],
  "rat":         ["socket","connect","CreateProcessW","VirtualAllocEx","WriteProcessMemory"],
}
common = ["GetTickCount","Sleep","LoadLibraryW","GetProcAddress","CloseHandle"]

def synth(family, n=120):
    sig = families[family]
    pool = sig*4 + common*8
    return [" ".join(rng.choice(pool, size=80, replace=True)) for _ in range(n)]

X_text, y = [], []
for fam in families:
    seqs = synth(fam, 120)
    X_text += seqs
    y += [fam]*120

vec = CountVectorizer(token_pattern=r"[A-Za-z]+", ngram_range=(1,2), max_features=300)
X = vec.fit_transform(X_text)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=7, stratify=y)
clf = LogisticRegression(max_iter=600).fit(Xtr, ytr)
print(classification_report(yte, clf.predict(Xte)))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines three malware <code>families</code> as dictionaries of over-represented API names — ransomware burns <code>CryptEncrypt</code> + <code>FindFirstFileW</code>, infostealers hit <code>RegQueryValueExW</code> + <code>WinHttpSendRequest</code>, RATs ride <code>VirtualAllocEx</code> + <code>WriteProcessMemory</code>. 2) <code>synth()</code> builds noisy training sequences by sampling 80 tokens from a pool weighted 4× toward family-specific APIs and 8× toward generic <code>common</code> calls — mimics how real sandbox traces drown signal in benign API churn. 3) <code>CountVectorizer</code> with <code>ngram_range=(1,2)</code> and <code>max_features=300</code> extracts the top unigrams and bigrams as features — bigrams catch ordered behavior like <code>VirtualAllocEx → WriteProcessMemory</code>. 4) <code>train_test_split</code> with <code>stratify=y</code> preserves class balance, then <code>LogisticRegression</code> fits and <code>classification_report</code> prints per-family precision/recall — the standard sklearn baseline every behavior-classifier paper compares against.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Identical sklearn pipeline — synthetic API sequences, count-vectorize n-grams, LogReg classifier, real classification report.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

rng = np.random.default_rng(7)
families = {
  "ransomware":  ["CryptEncrypt","FindFirstFileW","WriteFile","SetFileAttributesW","DeleteFileW"],
  "infostealer": ["RegOpenKeyExW","RegQueryValueExW","CreateFileW","ReadFile","WinHttpSendRequest"],
  "rat":         ["socket","connect","CreateProcessW","VirtualAllocEx","WriteProcessMemory"],
}
common = ["GetTickCount","Sleep","LoadLibraryW","GetProcAddress","CloseHandle"]

def synth(family, n=120):
    pool = families[family]*4 + common*8
    return [" ".join(rng.choice(pool, size=80, replace=True)) for _ in range(n)]

X_text, y = [], []
for fam in families:
    X_text += synth(fam, 120); y += [fam]*120

vec = CountVectorizer(token_pattern=r"[A-Za-z]+", ngram_range=(1,2), max_features=300)
X = vec.fit_transform(X_text)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=7, stratify=y)
clf = LogisticRegression(max_iter=600).fit(Xtr, ytr)
print(classification_report(yte, clf.predict(Xte)))
print("Top ransomware features:")
import numpy as np
ridx = list(clf.classes_).index("ransomware")
top = np.argsort(clf.coef_[ridx])[-8:][::-1]
names = vec.get_feature_names_out()
for i in top: print(f"  {names[i]:30s} weight={clf.coef_[ridx,i]:+.2f}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Process Hollowing and Injection — What to Watch For</h2>
<p class="l-text">A huge fraction of "interesting" sandbox reports include a code-injection step. The two patterns to recognize:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Process Hollowing</div><div class="card-body"><code>CreateProcessW(..., CREATE_SUSPENDED) → ZwUnmapViewOfSection → VirtualAllocEx → WriteProcessMemory → SetThreadContext → ResumeThread</code>. Legit binary becomes a shell.</div></div>
<div class="calc-card"><div class="card-title">DLL Injection</div><div class="card-body"><code>OpenProcess → VirtualAllocEx → WriteProcessMemory(LoadLibraryA path) → CreateRemoteThread</code>. Or APC injection via <code>QueueUserAPC</code>.</div></div>
<div class="calc-card"><div class="card-title">Reflective Loading</div><div class="card-body">PE loaded entirely in memory by sample's own loader (Stephen Fewer, 2008). No <code>LoadLibrary</code>, no on-disk DLL — pure in-memory PE walking.</div></div>
<div class="calc-card"><div class="card-title">Process Doppelgänging</div><div class="card-body">2017 BlackHat. Uses NTFS transactions to load a PE the AV cannot scan. Defeated only by behavior monitoring at the kernel level.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Pragmatic Workflow</h2>
<p class="l-text">A senior IR analyst processes ~30 samples a shift. The pipeline:</p>
<ol style="line-height:1.7;padding-left:1.4rem">
<li><strong>Triage</strong>: VirusTotal lookup, ANY.RUN public-task search, MalwareBazaar by hash. 60% of "new" samples are already known.</li>
<li><strong>Static skim</strong> (forensics-L2): PE header, imports, strings, YARA hits.</li>
<li><strong>Dynamic detonation</strong> in CAPEv2 or ANY.RUN with appropriate guest (Office macros need Word, .NET loaders need .NET runtime).</li>
<li><strong>Memory dump</strong> mid-detonation, parse with Volatility (forensics-L5).</li>
<li><strong>IoC extraction</strong>: hashes, C2 URLs, mutexes, registry keys, dropped file paths.</li>
<li><strong>Hunt</strong>: push IoCs to EDR (CrowdStrike, Defender, SentinelOne) for retro-hunt across the fleet.</li>
<li><strong>Report</strong>: STIX 2.1 bundle, MITRE ATT&amp;CK mapping, executive summary.</li>
</ol>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sandboxes (Cuckoo, CAPEv2, ANY.RUN) detonate samples in disposable VMs and log every API call.</li>
<li>Frida is the modern instrumentation Swiss-army knife — Python orchestrates JS hooks on live processes.</li>
<li>Modern malware ships with 30+ environment checks; interactive sandboxes (ANY.RUN) beat fully-automated ones.</li>
<li>API call sequences are strong ML features: bag-of-APIs + LogReg already separates ransomware from RAT from stealer.</li>
<li>Process hollowing, reflective loading, doppelgänging — recognize the API call patterns.</li>
</ul>
</div>
<p class="l-text">Next, in <strong>forensics-L4</strong>, we go a level deeper than API logs and read the actual machine code — x86_64 assembly, calling conventions, control-flow recovery, Ghidra workflows.</p>
</div>`,
tr: `<p class="l-text"><strong>Dinamik analiz, şüphelinin günlüğünü okumayı bırakıp onun harekete geçmesine izin verdiğimiz andır.</strong> Statik analiz bir ikilinin potansiyelini haritalarken, dinamik analiz ikilinin seçimlerini kaydeder — yaptığı her API çağrısı, dokunduğu her kayıt defteri anahtarı, telden gönderdiği her bayt. Takas risktir: canlı bir silahı patlatıyorsunuz. Bunu güvenli yapma etrafında oluşan disipline <strong>sandboxing</strong> denir ve açık kaynak klasiği <strong>Cuckoo Sandbox</strong>'tır (Claudio Guarnieri, 2010); modern SOC'lara hâkim olan ticari mirasçılar arasında <strong>ANY.RUN</strong> (etkileşimli, tarayıcı tabanlı, 2016'da kuruldu) ve <strong>Joe Sandbox</strong> bulunur.</p>

<p class="l-text">Bu derste dinamik boru hattını uçtan uca yürüyoruz: bir sandbox'ın tek kullanımlık VM içinde bir örneği nasıl izole ettiği, bir <strong>API hook</strong>'un <code>CreateFileW</code> veya <code>WSASend</code> çağrılarını nasıl yakalayıp günlüğe yazdığı, <strong>Frida</strong>'nın (Ole André Vadla Ravnås, 2013) çalışan süreçler üzerinde Python sürücülü enstrümantasyonu nasıl verdiği ve zararlı yazılımın <strong>anti-VM, anti-debug ve zamanlama tabanlı kaçınma</strong> ile nasıl karşı saldırı yaptığı. Son on yılın deneysel dersi — <strong>Trickbot</strong>'tan <strong>Emotet</strong>'e <strong>BlackCat</strong>'e — gerçek dünya örneklerinin artık ilk zararlı talimatlarını çalıştırmadan önce 30+ ortam denetimiyle geldiğidir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir Cuckoo veya CAPEv2 sandbox'ını mimarile: host, misafir VM, agent, ağ sink'i, snapshot/revert</li>
<li>Bir analistin film izler gibi bir ANY.RUN süreç ağacı ve davranış grafiği okumak</li>
<li>Frida ile Win32 API'lerini hook'lamak (<code>Interceptor.attach</code>) ve argümanları canlı dökmek</li>
<li>Kanonik anti-VM, anti-debug ve anti-sandbox hilelerini tanımak (RDTSC zamanlaması, sleep atlama, PEB.BeingDebugged)</li>
<li>API çağrı dizisinden bir örnek ailesini basit bir sklearn modeliyle sınıflandırmak</li>
<li>Kaçıngan zararlı yazılım için "etkileşimli" sandbox'ların (ANY.RUN, Triage) tam otomatiklerden neden üstün olduğunu anlamak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Dinamik?</h2>
<p class="l-text">Statik analiz üç örnek sınıfında duvara çarpar: <strong>paketlenmiş</strong> (gerçek kodun yalnızca paket açıcı çalıştıktan sonra bellekte var olduğu), <strong>karartılmış</strong> (kontrol akışı düzleştirme, opak yüklemler) ve <strong>indiriciler</strong> (gerçek yükü C2'den çeken önemsiz yükleyiciler). Üçü için de çalışma zamanı davranışı zemin gerçektir. Dinamik analiz "bu şey gerçekte ne yapıyor?" sorusunu — kelimenin tam anlamıyla mikroskop altında — bunu yapmasına izin vererek yanıtlar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İmzaya karşı davranış</div><div class="card-body">Bir örnek günlük yeniden paketlenebilir; <em>davranışı</em> (<code>%APPDATA%\\X.exe</code>'ye yaz, Run anahtarı ayarla, Tor adresine sinyal gönder) çok daha kararlıdır. SOC'lar Sigma, KQL, EDR'de davranış tabanlı kurallar oluşturur.</div></div>
<div class="calc-card"><div class="card-title">Bellek artefaktları</div><div class="card-body">Şifresi çözülmüş dizgiler, bellekteki paketsiz PE, enjekte edilmiş shellcode — diskte hiçbiri görünmez. Dinamik + bellek dökümü statik analiste statiğin veremediğini verir.</div></div>
<div class="calc-card"><div class="card-title">Ağ zemin gerçeği</div><div class="card-body">DNS istekleri, TLS SNI, HTTP user-agent'lar, sinyal aralıkları — yalnızca çalışma zamanında gözlemlenebilir. PCAP'lar IoC çıkarımı için altın değerindedir.</div></div>
<div class="calc-card"><div class="card-title">Sınırlama</div><div class="card-body">Örnek ilk denemede çalışmayabilir (eksik C2, yanlış yerel ayar, anti-VM). Modern zararlı yazılım, herhangi bir yükten önce analist ortamının 20+ artefaktını test eder.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Sandbox Mimarisi — Cuckoo ve CAPEv2</h2>
<p class="l-text">Modern bir açık kaynak sandbox küçük bir dağıtık sistemdir. <strong>Cuckoo</strong> (ve daha aktif olarak bakımlı çatalı <strong>CAPEv2</strong>, Kevin O'Reilly), orkestratörü çalıştıran bir Linux <em>host</em>, VirtualBox/KVM/Hyper-V'de bir veya daha fazla Windows/Linux <em>misafir</em>, örneği çalıştıran ve geri raporlayan misafir-içi bir <em>agent</em> ve raporu (JSON + ekran görüntüleri + PCAP + bırakılan dosyalar) yazan bir <em>sonuç işleyici</em>'den oluşur.</p>

<div class="calc-highlight"><strong>Snapshot/revert kutsaldır:</strong> her analizden sonra, misafir VM bilinen-temiz bir snapshot'a geri alınır. Bu olmadan, N örneğinden gelen bulaşma N+1 örneğine ulaşır ve raporlarınız yalan haline gelir.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Bir örneği REST üzerinden bir Cuckoo/CAPEv2 örneğine gönder
import requests
files = {"file": ("sample.exe", open("sample.exe","rb"))}
data  = {"timeout": 120, "machine": "win10x64-clean"}
r = requests.post("http://cuckoo.lab:8090/tasks/create/file",
                  files=files, data=data)
task_id = r.json()["task_id"]
print("Submitted as task", task_id)

# Rapor hazır olana kadar yokla
import time
while True:
    r = requests.get(f"http://cuckoo.lab:8090/tasks/view/{task_id}")
    if r.json()["task"]["status"] == "reported":
        break
    time.sleep(5)

report = requests.get(f"http://cuckoo.lab:8090/tasks/report/{task_id}/json").json()
print("Detected family:", report.get("malfamily"))
print("API calls:", len(report["behavior"]["processes"][0]["calls"]))
print("DNS queries:", [d["request"] for d in report["network"]["dns"]])
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>sample.exe</code>'yi binary modda açar ve Cuckoo/CAPEv2'nin <code>/tasks/create/file</code> REST endpoint'ine multipart form-data olarak POST eder — 120 saniyelik <code>timeout</code> ve sabit bir <code>machine</code> ismiyle. 2) JSON yanıtından yeni atanan <code>task_id</code>'yi çeker — bundan sonraki her çağrı bu ID üzerinden gider. 3) <code>/tasks/view/{task_id}</code>'yi 5 saniyelik aralıklarla yoklar ve <code>status == "reported"</code> olunca döngüyü kırar; bu noktada misafir VM örneği çalıştırmış, results processor raporu sonuçlandırmış ve snapshot geri alınmıştır. 4) Tüm JSON raporu çeker ve üç yüksek-değerli alanı yazdırır: <code>malfamily</code> (imzayla eşleşen aile), ilk process'teki API çağrı sayısı (davranışsal parmak izi) ve <code>network.dns</code>'ten tüm <code>request</code> dizgileri — C2 domain adayları.</p>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ANY.RUN — Etkileşimli Bulut Sandbox'ı</h2>
<p class="l-text"><strong>ANY.RUN</strong>, sandboxing'i <em>etkileşimli</em> hale getirerek alanı değiştirdi: analist tarayıcıda misafir masaüstünü görür, bir oltalama dokümanında "Düzenlemeyi Etkinleştir"e tıklayabilir, sahte bir girişe kimlik bilgileri yazabilir veya bir takip URL'sine gözatabilir. Bu, insan girdisi bekleyen örnekleri (CAPTCHA'lar, click-to-detonate) yenilger. <strong>Süreç ağacı</strong> görünümü (komut satırı argümanlarıyla ebeveyn → çocuk) davranış analizinin kanonik zihinsel modelidir: <code>winword.exe → cmd.exe /c powershell -enc ... → rundll32.exe loader.dll,Start</code> uykunuzda bile fark etmeyi öğrendiğiniz LOLBin zinciridir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Süreç ağacı</div><div class="card-body">Tam komut satırı, imzalı durum, süreç başına MITRE ATT&amp;CK teknikleri ile ebeveyn-çocuk. Herhangi bir sürecin üzerine gelin, API çağrılarını ve bırakılan dosyaları görün.</div></div>
<div class="calc-card"><div class="card-title">Ağ</div><div class="card-body">HTTP, DNS, TLS SNI, Suricata IDS uyarıları, her IP/alan adı için Tehdit İstihbaratı aramaları.</div></div>
<div class="calc-card"><div class="card-title">MITRE ATT&amp;CK kaplaması</div><div class="card-body">Davranışlar taktiklere/tekniklere eşlenir (T1059.001 PowerShell, T1547.001 Run anahtarları, T1071.001 Web protokolleri).</div></div>
<div class="calc-card"><div class="card-title">IOC dışa aktarma</div><div class="card-body">SIEM beslemesi için tek tıkla STIX 2.1 / MISP JSON / düz CSV. Hash'ler, URL'ler, mutex'ler, kayıt defteri anahtarları dahil.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Frida ile API Hook'lama</h2>
<p class="l-text">Sandbox'lar çalışır çünkü örneğin çağırdığı OS API'lerini <strong>hook'larlar</strong>. Klasik teknik <em>satır içi hook'lama</em>'dır: <code>kernel32!CreateFileW</code>'in ilk baytlarını, işleyicinize bir <code>jmp</code> ile üzerine yaz, argümanları logla, sonra geri zıpla. <strong>Detours</strong> (Microsoft Research, 1999) ve <strong>EasyHook</strong> bunu Windows'ta rutin hale getirdi. Modern, çapraz platform aracı <strong>Frida</strong>'dır: çalışan bir süreç üzerinde hook'ları canlı betiklemenize izin veren bir Python/JavaScript köprüsü.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import frida, sys

js_hook = """
Interceptor.attach(Module.getExportByName('kernel32.dll', 'CreateFileW'), {
  onEnter(args) {
    const path = args[0].readUtf16String();
    const access = args[1].toInt32();
    send({ api: 'CreateFileW', path: path, access: access.toString(16) });
  }
});
Interceptor.attach(Module.getExportByName('ws2_32.dll', 'send'), {
  onEnter(args) {
    const sock = args[0].toInt32();
    const buf  = args[1];
    const len  = args[2].toInt32();
    send({ api: 'send', sock: sock, len: len,
           preview: buf.readByteArray(Math.min(len, 32)) });
  }
});
"""
session = frida.attach("notepad.exe")
script = session.create_script(js_hook)
script.on("message", lambda msg, data: print(msg["payload"]))
script.load()
sys.stdin.read()
</code></pre></div>

<p class="l-text">Frida, <em>anti-debug'ı yenmeniz</em> gerektiğinde parlar: <code>IsDebuggerPresent</code>'i her zaman 0 döndürecek şekilde yeniden yaz, <code>NtQueryInformationProcess</code> ProcessDebugPort kontrollerini yamala, <code>RDTSC</code> zamanlama kontrollerini etkisizleştir. Beş satır JavaScript, yarım günlük OllyDbg işinin yerini alır.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Anti-VM ve Anti-Sandbox Hileleri</h2>
<p class="l-text">2024'te emtia zararlı yazılımları üzerine yapılan bir araştırma, örneklerin %78'inin en az bir ortam denetimi uyguladığını ve %41'inin denetim takılırsa hiç IoC yazmadan çıktığını buldu. Kanonik hileler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CPUID hipervizör biti</div><div class="card-body"><code>CPUID(1).ECX[31]</code> = hipervizör mevcut. Herhangi bir VM'de basitçe ayarlanır. Gerçek zararlı yazılım: bunu yapar, ama ayrıca <code>CPUID(0x40000000)</code>'dan satıcı dizgisini kontrol eder: "VMwareVMware", "KVMKVMKVM", "Microsoft Hv", "VBoxVBoxVBox".</div></div>
<div class="calc-card"><div class="card-title">RDTSC zamanlaması</div><div class="card-body">Bir <code>cpuid</code> etrafında iki <code>rdtsc</code> okuması — çıplak metalde &lt; 1000 cycle, hook'lu Cuckoo'da 50.000+. Sandbox'lar <code>rdtsc</code> değerlerini yamayarak karşılık verir.</div></div>
<div class="calc-card"><div class="card-title">Sleep atlama</div><div class="card-body">Zararlı yazılım: 2 dakikalık sandbox'ı geride bırakmak için <code>Sleep(600000)</code>. Sandbox'lar: Sleep'i hook'lar ve anında döner. Karşı-karşı: <code>GetTickCount</code> deltaları üzerinden doğrulamayla <code>NtDelayExecution</code> kullan.</div></div>
<div class="calc-card"><div class="card-title">Artefakt avı</div><div class="card-body"><code>C:\\Windows\\System32\\drivers\\VBoxMouse.sys</code> gibi dosyalar, kayıt defteri <code>HKLM\\HARDWARE\\DESCRIPTION\\System\\SystemBiosVersion=VBOX</code>, MAC OUI 00:05:69 (VMware), 08:00:27 (VBox).</div></div>
<div class="calc-card"><div class="card-title">Kullanıcı adı / etki alanı</div><div class="card-body">Klasik örnekler "sandbox", "malware", "currentuser", "John Doe" kullanıcı adlarında veya etki alanına &lt; 7 gün katılmışsa çıkar. ANY.RUN gerçekçi sentetik ortamlarla karşılık verir.</div></div>
<div class="calc-card"><div class="card-title">Mouse / süreç sayısı</div><div class="card-body">Bakir VM'de 30 süreç, gerçek masaüstünde 120+ vardır. Mouse cursor (0,0)'da ve 5 dakika hareketsizse = sandbox.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. sklearn ile Davranışsal Sınıflandırma</h2>
<p class="l-text">"Bu hangi aile?" için şaşırtıcı derecede güçlü bir taban çizgi, API çağrılarının <em>dizisini</em> (ya da sadece çoklu kümesini) almak ve klasik bir ML modeline beslemektir. Microsoft'un 2015 Kaggle Malware Classification Challenge'ı, opcode + API n-gramları üzerinde gradient-boosted ağaçlarla kazanıldı. Aşağıda bunu üç aile için sentetik çağrı dizileriyle simüle ediyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

rng = np.random.default_rng(7)

# Aile imzaları (aşırı temsil edilen API'ler)
families = {
  "ransomware":  ["CryptEncrypt","FindFirstFileW","WriteFile","SetFileAttributesW","DeleteFileW"],
  "infostealer": ["RegOpenKeyExW","RegQueryValueExW","CreateFileW","ReadFile","WinHttpSendRequest"],
  "rat":         ["socket","connect","CreateProcessW","VirtualAllocEx","WriteProcessMemory"],
}
common = ["GetTickCount","Sleep","LoadLibraryW","GetProcAddress","CloseHandle"]

def synth(family, n=120):
    sig = families[family]
    pool = sig*4 + common*8
    return [" ".join(rng.choice(pool, size=80, replace=True)) for _ in range(n)]

X_text, y = [], []
for fam in families:
    seqs = synth(fam, 120)
    X_text += seqs
    y += [fam]*120

vec = CountVectorizer(token_pattern=r"[A-Za-z]+", ngram_range=(1,2), max_features=300)
X = vec.fit_transform(X_text)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=7, stratify=y)
clf = LogisticRegression(max_iter=600).fit(Xtr, ytr)
print(classification_report(yte, clf.predict(Xte)))
</code></pre></div>
<p class="l-text"><strong>Kodun adım adım işleyişi:</strong> 1) Üç zararlı yazılım <code>families</code> sözlüğünde fazla temsil edilen API isimlerini tanımlar — ransomware <code>CryptEncrypt</code> + <code>FindFirstFileW</code>, infostealer <code>RegQueryValueExW</code> + <code>WinHttpSendRequest</code>, RAT <code>VirtualAllocEx</code> + <code>WriteProcessMemory</code> kullanır. 2) <code>synth()</code> gürültülü eğitim dizileri üretir: aileye özgü API'lere 4×, jenerik <code>common</code> çağrılara 8× ağırlıklı bir havuzdan 80 token örnekler — gerçek sandbox izlerinin sinyali nasıl benign API gürültüsünde boğduğunu taklit eder. 3) <code>CountVectorizer</code> <code>ngram_range=(1,2)</code> ve <code>max_features=300</code> ile en sık unigram ve bigram'ları feature olarak çıkarır — bigram'lar <code>VirtualAllocEx → WriteProcessMemory</code> gibi sıralı davranışı yakalar. 4) <code>train_test_split</code> <code>stratify=y</code> ile sınıf dengesini korur, sonra <code>LogisticRegression</code> fit'ler ve <code>classification_report</code> aile başına precision/recall yazdırır — her behavior-classifier makalesinin karşılaştırdığı standart sklearn baseline'ı.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı sklearn boru hattı — sentetik API dizileri, n-gramları sayım vektörü, LogReg sınıflandırıcı, gerçek sınıflandırma raporu.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

rng = np.random.default_rng(7)
families = {
  "ransomware":  ["CryptEncrypt","FindFirstFileW","WriteFile","SetFileAttributesW","DeleteFileW"],
  "infostealer": ["RegOpenKeyExW","RegQueryValueExW","CreateFileW","ReadFile","WinHttpSendRequest"],
  "rat":         ["socket","connect","CreateProcessW","VirtualAllocEx","WriteProcessMemory"],
}
common = ["GetTickCount","Sleep","LoadLibraryW","GetProcAddress","CloseHandle"]

def synth(family, n=120):
    pool = families[family]*4 + common*8
    return [" ".join(rng.choice(pool, size=80, replace=True)) for _ in range(n)]

X_text, y = [], []
for fam in families:
    X_text += synth(fam, 120); y += [fam]*120

vec = CountVectorizer(token_pattern=r"[A-Za-z]+", ngram_range=(1,2), max_features=300)
X = vec.fit_transform(X_text)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=7, stratify=y)
clf = LogisticRegression(max_iter=600).fit(Xtr, ytr)
print(classification_report(yte, clf.predict(Xte)))
print("Top ransomware features:")
import numpy as np
ridx = list(clf.classes_).index("ransomware")
top = np.argsort(clf.coef_[ridx])[-8:][::-1]
names = vec.get_feature_names_out()
for i in top: print(f"  {names[i]:30s} weight={clf.coef_[ridx,i]:+.2f}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Process Hollowing ve Enjeksiyon — Nelere Dikkat Edilmeli</h2>
<p class="l-text">"İlginç" sandbox raporlarının büyük bir kısmı bir kod enjeksiyon adımı içerir. Tanınması gereken iki örüntü:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Process Hollowing</div><div class="card-body"><code>CreateProcessW(..., CREATE_SUSPENDED) → ZwUnmapViewOfSection → VirtualAllocEx → WriteProcessMemory → SetThreadContext → ResumeThread</code>. Meşru ikili bir kabuk haline gelir.</div></div>
<div class="calc-card"><div class="card-title">DLL Enjeksiyonu</div><div class="card-body"><code>OpenProcess → VirtualAllocEx → WriteProcessMemory(LoadLibraryA path) → CreateRemoteThread</code>. Veya <code>QueueUserAPC</code> üzerinden APC enjeksiyonu.</div></div>
<div class="calc-card"><div class="card-title">Reflective Loading</div><div class="card-body">PE tamamen örneğin kendi yükleyicisi tarafından bellekte yüklenir (Stephen Fewer, 2008). <code>LoadLibrary</code> yok, diskte DLL yok — saf bellek-içi PE yürüyüşü.</div></div>
<div class="calc-card"><div class="card-title">Process Doppelgänging</div><div class="card-body">2017 BlackHat. AV'nin tarayamayacağı bir PE yüklemek için NTFS işlemlerini kullanır. Sadece çekirdek seviyesinde davranış izlemeyle yenilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Pragmatik İş Akışı</h2>
<p class="l-text">Kıdemli bir IR analisti vardiya başına ~30 örnek işler. Boru hattı:</p>
<ol style="line-height:1.7;padding-left:1.4rem">
<li><strong>Triyaj</strong>: VirusTotal araması, ANY.RUN herkese açık görev araması, hash ile MalwareBazaar. "Yeni" örneklerin %60'ı zaten biliniyor.</li>
<li><strong>Statik göz atma</strong> (forensics-L2): PE başlığı, importlar, dizgiler, YARA isabetleri.</li>
<li><strong>Dinamik patlatma</strong> uygun misafirle CAPEv2 veya ANY.RUN'da (Office makroları Word ister, .NET yükleyiciler .NET runtime ister).</li>
<li><strong>Bellek dökümü</strong> patlatma ortasında, Volatility ile ayrıştırma (forensics-L5).</li>
<li><strong>IoC çıkarma</strong>: hash'ler, C2 URL'leri, mutex'ler, kayıt defteri anahtarları, bırakılan dosya yolları.</li>
<li><strong>Av</strong>: filo genelinde retro-av için IoC'leri EDR'ye (CrowdStrike, Defender, SentinelOne) gönder.</li>
<li><strong>Rapor</strong>: STIX 2.1 paketi, MITRE ATT&amp;CK eşlemesi, yönetici özeti.</li>
</ol>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 TEMEL ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sandbox'lar (Cuckoo, CAPEv2, ANY.RUN) örnekleri tek kullanımlık VM'lerde patlatır ve her API çağrısını günlüğe kaydeder.</li>
<li>Frida modern enstrümantasyon İsviçre çakısıdır — Python, canlı süreçler üzerinde JS hook'larını orkestre eder.</li>
<li>Modern zararlı yazılım 30+ ortam denetimiyle gelir; etkileşimli sandbox'lar (ANY.RUN) tam otomatiklerden üstündür.</li>
<li>API çağrı dizileri güçlü ML özellikleridir: bag-of-APIs + LogReg zaten ransomware'ı RAT'tan stealer'dan ayırır.</li>
<li>Process hollowing, reflective loading, doppelgänging — API çağrı örüntülerini tanıyın.</li>
</ul>
</div>
<p class="l-text">Sırada, <strong>forensics-L4</strong>'te, API günlüklerinden bir seviye daha derine iniyoruz ve gerçek makine kodunu okuyoruz — x86_64 assembly, çağırma sözleşmeleri, kontrol akışı kurtarma, Ghidra iş akışları.</p>
</div>`
};
