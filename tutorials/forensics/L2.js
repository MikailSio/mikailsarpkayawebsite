window.FORENSICS_L2 = {
en: `<p class="l-text"><strong>Static analysis is the art of telling a binary's story without ever letting it run.</strong> When a suspicious file lands on an analyst's desk — say, an attachment flagged by the email gateway or a sample pulled from an infected host — the first move is never to double-click. It is to inspect the bytes: file format, entry point, imports, embedded strings, code sections, signatures. A skilled malware analyst can fingerprint a family in 60 seconds from headers and strings alone, before any sandbox spins up. That economy of inspection is what made tools like <strong>pefile</strong>, <strong>lief</strong>, <strong>YARA</strong>, and <strong>Ghidra</strong> the universal opening moves of every IR engagement.</p>

<p class="l-text">In this lesson we walk the canonical static-analysis pipeline: parse PE/ELF/Mach-O headers (Microsoft's Portable Executable spec from 1997, ELF from System V ABI), extract strings (still surprisingly informative in 2026), recognize packers like <strong>UPX</strong> and the commercial obscurer <strong>Themida</strong>, write <strong>YARA</strong> rules (the de-facto IOC language, originally from Victor Manuel Álvarez at VirusTotal), and look at the modern ML angle — <strong>MalConv</strong> (Raff et al. 2018) and CNN classifiers operating on raw byte histograms or the EMBER dataset (Endgame 2018, 1.1M samples). Reverse engineering proper waits for L4; here we stay above the disassembly line.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Parse a PE file's DOS stub, NT headers, section table, import table, and resources with <code>pefile</code> or <code>lief</code></li>
<li>Read an ELF file's ELF header, program/section headers, dynamic section, and symbol tables</li>
<li>Extract and triage strings (ASCII + UTF-16LE) and recognize C2 URLs, mutex names, and registry keys</li>
<li>Write production YARA rules with strings, conditions, and meta blocks; understand performance pitfalls</li>
<li>Recognize packed binaries by section entropy, suspicious imports (LoadLibrary/GetProcAddress only), and known UPX/Themida signatures</li>
<li>Train a tiny ML classifier on byte-histogram features and explain why MalConv works in practice</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The PE Format — Anatomy of a Windows Binary</h2>
<p class="l-text">Every Windows EXE, DLL, SYS, and OCX is a <strong>Portable Executable</strong> file. Microsoft published the format in 1997; it descends from the Common Object File Format (COFF) used in Unix System V. Knowing PE bottoms-up is mandatory because every Windows malware sample is a PE.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DOS stub (first 64 bytes + program)</div><div class="card-body">Starts with <code>MZ</code> ("Mark Zbikowski"). Includes the famous "This program cannot be run in DOS mode" message. <code>e_lfanew</code> at offset 0x3C points to the PE header.</div></div>
<div class="calc-card"><div class="card-title">NT Headers</div><div class="card-body">Signature <code>PE\\0\\0</code>, then <code>FileHeader</code> (machine, # sections, timestamp) and <code>OptionalHeader</code> (entry point RVA, image base, subsystem, data directories).</div></div>
<div class="calc-card"><div class="card-title">Section Table</div><div class="card-body">Array of <code>IMAGE_SECTION_HEADER</code>. Typical names: <code>.text</code> (code, RX), <code>.data</code> (init data, RW), <code>.rdata</code> (read-only data, R), <code>.rsrc</code> (resources), <code>.reloc</code> (relocations).</div></div>
<div class="calc-card"><div class="card-title">Data Directories</div><div class="card-body">Pointers into the sections: import table (IAT), export table, resources, debug info, TLS callbacks. Malware loves TLS callbacks — they run before <code>main</code>.</div></div>
</div>

<div class="calc-highlight"><strong>Forensic gold:</strong> the <em>compilation timestamp</em> in the FileHeader is often forged but sometimes leaks the attacker's timezone (compile dates clustered in UTC+3 = Russia hours, UTC+8 = China hours, UTC+9 = North Korea Lazarus). Mandiant's APT1 report (2013) used compile-time clustering to argue that PLA Unit 61398 worked Beijing business hours.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Parsing PE with pefile and lief</h2>
<p class="l-text">Two Python libraries dominate. <strong>pefile</strong> (Ero Carrera, 2005) is the lightweight read-only choice. <strong>lief</strong> (Quarkslab) is heavier, supports PE/ELF/Mach-O, and lets you <em>modify</em> binaries — useful for unpacking and instrumentation.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import pefile
pe = pefile.PE("sample.exe")
print(f"Machine: {hex(pe.FILE_HEADER.Machine)}")          # 0x8664 = AMD64
print(f"Compiled: {pe.FILE_HEADER.TimeDateStamp}")        # epoch seconds
print(f"Entry point: {hex(pe.OPTIONAL_HEADER.AddressOfEntryPoint)}")
print(f"Image base:  {hex(pe.OPTIONAL_HEADER.ImageBase)}")
for s in pe.sections:
    name = s.Name.decode(errors='ignore').rstrip('\\0')
    print(f"  {name:&lt;10} VA={hex(s.VirtualAddress)} size={s.SizeOfRawData} entropy={s.get_entropy():.2f}")
for entry in pe.DIRECTORY_ENTRY_IMPORT:
    print(f"Imports from {entry.dll.decode()}:")
    for imp in entry.imports[:3]:
        print(f"  - {imp.name.decode() if imp.name else '(ord)'}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>pefile.PE("sample.exe")</code> mmaps the file and walks the DOS stub, then jumps to the PE header via <code>e_lfanew</code>. 2) Reads <code>FILE_HEADER.Machine</code> (0x8664 = AMD64, 0x14C = i386) and <code>TimeDateStamp</code> — the latter is the forensic compile-time gold mine. 3) Pulls <code>OPTIONAL_HEADER.AddressOfEntryPoint</code> and <code>ImageBase</code> so you know where execution begins after the loader maps the image. 4) Iterates <code>pe.sections</code>, decoding the 8-byte name, virtual address, raw size, and Shannon entropy via <code>s.get_entropy()</code> — entropy > 7.0 in <code>.text</code> screams packer. 5) Walks <code>DIRECTORY_ENTRY_IMPORT</code> to list every DLL and the first few API names — the IAT fingerprint that gives away network, crypto, or injection capabilities before any disassembly.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a synthetic PE-like header byte-for-byte, then parse it with <code>struct.unpack</code>. This is exactly what <code>pefile</code> does internally — no magic, just C structs.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import struct

# Synthesize the first 0x100 bytes of a 64-bit PE
buf = bytearray(0x200)
buf[0:2]  = b"MZ"                           # DOS magic
buf[0x3C:0x40] = struct.pack("&lt;I", 0x80)    # e_lfanew -&gt; PE header at 0x80
buf[0x80:0x84] = b"PE\\x00\\x00"             # PE signature
# IMAGE_FILE_HEADER (20 bytes) at 0x84
struct.pack_into("&lt;HHIIIHH", buf, 0x84,
    0x8664,           # Machine = AMD64
    3,                # NumberOfSections
    0x65a3b1c0,       # TimeDateStamp (Jan 2024-ish)
    0, 0,             # PointerToSymbolTable, NumberOfSymbols
    0xF0,             # SizeOfOptionalHeader
    0x22)             # Characteristics

# Now parse it back
e_lfanew = struct.unpack_from("&lt;I", buf, 0x3C)[0]
sig = bytes(buf[e_lfanew:e_lfanew+4])
machine, nsec, ts, _, _, optsz, char = struct.unpack_from("&lt;HHIIIHH", buf, e_lfanew + 4)
print(f"DOS magic: {bytes(buf[:2])}, e_lfanew=0x{e_lfanew:x}")
print(f"PE sig: {sig}, Machine=0x{machine:x}, sections={nsec}, ts={ts}")
print(f"OptHeader size=0x{optsz:x}, characteristics=0x{char:x}")
print("Verified: this is exactly how pefile.PE() reads a real binary.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ELF — The Linux Counterpart</h2>
<p class="l-text">Linux malware (Mirai, XOR.DDoS, EBURY rootkit, NoaBot) ships as <strong>ELF</strong> (Executable and Linkable Format), spec'd in the System V ABI and refined in the gABI/psABI documents. The ideas are the same as PE, the names differ.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ELF header (52 / 64 bytes)</div><div class="card-body">Magic <code>0x7F 'E' 'L' 'F'</code>, class (32/64), data (LE/BE), OS ABI, type (EXEC/DYN/REL), machine (x86_64=0x3E, ARM64=0xB7), entry point.</div></div>
<div class="calc-card"><div class="card-title">Program headers</div><div class="card-body">Tell the loader how to map segments. <code>PT_LOAD</code> = map me, <code>PT_DYNAMIC</code> = dynamic linker info, <code>PT_INTERP</code> = path to <code>ld-linux.so</code>.</div></div>
<div class="calc-card"><div class="card-title">Section headers</div><div class="card-body">Tell the linker/analyst what is where. <code>.text</code>, <code>.data</code>, <code>.bss</code>, <code>.rodata</code>, <code>.dynsym</code>, <code>.dynstr</code>, <code>.plt</code>, <code>.got</code>.</div></div>
<div class="calc-card"><div class="card-title">Dynamic section</div><div class="card-body"><code>DT_NEEDED</code> entries list shared libraries (libc.so.6, libssl.so.3). <code>DT_RPATH</code>/<code>DT_RUNPATH</code> are common malware tricks for hijacking.</div></div>
</div>

<p class="l-text">Tools: <code>readelf</code>, <code>objdump</code>, <code>nm</code>, the <code>pyelftools</code> Python library, and <code>lief</code>. For modern Linux malware, the <strong>Stripped + Statically linked</strong> combination is the analyst's nemesis — no symbols, no libc names, you must do byte-level signature matching.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Strings — Cheap Intelligence</h2>
<p class="l-text">The Unix <code>strings</code> command (1971, Doug McIlroy) is still the highest-value-per-second tool in static analysis. Pull every printable ASCII run of length ≥ 4, plus the UTF-16LE equivalent (since Windows stores most strings as wide chars), and you frequently see C2 URLs, mutex names, registry keys, hardcoded passwords, and PDB paths leaking the developer's machine.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re
def strings_ascii(data, n=4):
    return re.findall(rb"[\\x20-\\x7e]{%d,}" % n, data)
def strings_utf16(data, n=4):
    pat = rb"(?:[\\x20-\\x7e]\\x00){%d,}" % n
    return [m.replace(b"\\x00", b"") for m in re.findall(pat, data)]

with open("sample.exe", "rb") as f:
    data = f.read()
all_strs = [s.decode(errors='ignore') for s in strings_ascii(data) + strings_utf16(data)]
suspicious = [s for s in all_strs if any(k in s.lower() for k in
    ["http://", "https://", ".onion", "schtasks", "regedit", "powershell", "cmd.exe", "mimikatz"])]
print(f"Total strings: {len(all_strs)}, suspicious: {len(suspicious)}")
for s in suspicious[:10]: print("  ", s)
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>strings_ascii</code> uses a regex over the printable byte range <code>\\x20-\\x7e</code> with a minimum run length <code>n</code> — the same heuristic the 1971 Unix <code>strings</code> command applies. 2) <code>strings_utf16</code> handles Windows wide-char storage by matching <em>printable byte + null byte</em> pairs, then stripping the nulls so you get readable ASCII back. 3) Reads the whole binary into <code>data</code> and decodes every match, errors-ignored, so undecodable bytes don't crash the pipeline. 4) Filters the corpus through a keyword list — <code>http://</code>, <code>.onion</code>, <code>schtasks</code>, <code>powershell</code>, <code>mimikatz</code> — to surface IOCs and lateral-movement tooling. 5) Prints a count and the first ten suspicious hits, the same one-screen triage every analyst does in the first 60 seconds.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Synthesize a fake binary blob that contains real-looking IOCs, then extract them with regex — exactly the technique <code>strings | grep</code> uses on the command line.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re, os

# Build a fake binary with garbage bytes and embedded strings
parts = [
    os.urandom(120),
    b"MZ\\x90\\x00",
    b"This program cannot be run in DOS mode.",
    os.urandom(80),
    b"http://evil.example.com/beacon",
    os.urandom(40),
    b"SOFTWARE\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run",
    os.urandom(50),
    b"GLOBAL\\\\Mutex_Conti_v3",
    b"powershell.exe -enc JABzAD0A",
    os.urandom(200),
]
blob = b"".join(parts)

ascii_re = re.compile(rb"[\\x20-\\x7e]{6,}")
strs = [s.decode() for s in ascii_re.findall(blob)]
print(f"Recovered {len(strs)} strings of length &gt;= 6:")
for s in strs: print("  ", s)

iocs = {"url": [], "mutex": [], "registry": [], "ps_b64": []}
for s in strs:
    if s.startswith("http"):                   iocs["url"].append(s)
    if "Mutex" in s:                           iocs["mutex"].append(s)
    if "SOFTWARE\\\\" in s:                     iocs["registry"].append(s)
    if "powershell" in s.lower() and "-enc" in s.lower(): iocs["ps_b64"].append(s)
print("IOCs extracted:", iocs)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. YARA — The Pattern Language</h2>
<p class="l-text"><strong>YARA</strong> (Victor Manuel Álvarez, then VirusTotal, ~2013) is the lingua franca of malware identification. A YARA rule is a small declarative document with three blocks: <code>meta</code> (description, author, hash), <code>strings</code> (literals, hex patterns, regexes), and <code>condition</code> (boolean over the strings + file properties). Tens of thousands of rules circulate in repositories like Florian Roth's <code>signature-base</code> and YARA-Rules.</p>

<div class="code-wrap"><div class="code-label"><span>YARA</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>rule Conti_Ransomware_v3
{
    meta:
        author      = "IR Team"
        description = "Detects Conti v3 ransomware loader"
        date        = "2022-04-19"
        sha256      = "f81e2e..."
        reference   = "Mandiant M-Trends 2022"

    strings:
        $mz       = { 4D 5A }                         // MZ at start
        $mutex    = "GLOBAL\\\\Mutex_Conti_v3" wide ascii
        $note     = "CONTI_README.txt" nocase
        $api_str  = "CryptEncrypt"
        $hex_seed = { 8B 45 ?? 33 D2 B9 9E 3D 00 00 } // ChaCha20 init pattern

    condition:
        $mz at 0
        and filesize &lt; 5MB
        and 3 of ($mutex, $note, $api_str, $hex_seed)
}
</code></pre></div>
<p class="l-text"><strong>What this rule does, clause by clause:</strong> 1) The <code>meta</code> block carries provenance — author, description, date, the sample <code>sha256</code>, and a Mandiant reference — so the next analyst can audit who wrote it and why. 2) <code>$mz = { 4D 5A }</code> is a hex pattern (the PE magic bytes) anchored by the <code>$mz at 0</code> condition — cheap pre-filter. 3) <code>$mutex</code> declares <code>"GLOBAL\\\\Mutex_Conti_v3"</code> as both <code>wide</code> and <code>ascii</code> so it matches the UTF-16LE storage Windows uses. 4) <code>$hex_seed</code> uses wildcard nibbles (<code>?? </code>) inside a ChaCha20 initialization pattern — survives small variant changes. 5) The <code>condition</code> demands the MZ anchor, a <code>filesize &lt; 5MB</code> cap (Conti is a small loader), and at least <strong>3 of 4</strong> behavioral strings — a noise-tolerant threshold that avoids both false positives and packer-induced misses.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A pure-Python mini-YARA engine that supports literal strings and hex patterns with wildcards. This is a 40-line skeleton of what the real <code>libyara</code> does.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re, os

def hex_to_regex(hex_pat):
    # "8B 45 ?? 33 D2" -&gt; rb"\\x8b\\x45.\\x33\\xd2"
    out = b""
    for tok in hex_pat.split():
        out += b"." if "?" in tok else bytes([int(tok, 16)])
    return re.compile(out, re.DOTALL)

def yara_match(blob, rule):
    hits = {}
    for name, pat in rule["strings"].items():
        if pat["type"] == "ascii":
            hits[name] = pat["value"].encode() in blob
        elif pat["type"] == "hex":
            hits[name] = hex_to_regex(pat["value"]).search(blob) is not None
    matched = sum(hits.values())
    cond = matched &gt;= rule["condition_min"] and (b"MZ" == blob[:2])
    return cond, hits

rule = {
    "name": "Conti_v3_demo",
    "strings": {
        "mutex":    {"type":"ascii","value":"GLOBAL\\\\Mutex_Conti_v3"},
        "note":     {"type":"ascii","value":"CONTI_README.txt"},
        "api":      {"type":"ascii","value":"CryptEncrypt"},
        "hex_seed": {"type":"hex","value":"8B 45 ?? 33 D2 B9 9E 3D 00 00"},
    },
    "condition_min": 3,
}

# Synthesize a "malicious" sample
blob = (b"MZ" + os.urandom(50) +
        b"GLOBAL\\\\Mutex_Conti_v3" + os.urandom(20) +
        b"CONTI_README.txt" + os.urandom(20) +
        b"CryptEncrypt" + os.urandom(20) +
        bytes.fromhex("8b4501 33d2 b9 9e3d0000"))
matched, details = yara_match(blob, rule)
print("Rule:", rule["name"], "-&gt;", "MATCH" if matched else "MISS")
print("Detail:", details)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Packers — UPX, Themida, and Friends</h2>
<p class="l-text">Most modern malware is <strong>packed</strong>: the original code is compressed/encrypted and a small unpacker stub reconstructs it at runtime. This defeats naive string and signature scans. Three families dominate:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">UPX</div><div class="card-body">Open-source compressor (Markus Oberhumer, since 1998). Sections renamed to <code>UPX0</code>, <code>UPX1</code>. High entropy on packed sections. Trivial to unpack: <code>upx -d sample.exe</code>.</div></div>
<div class="calc-card"><div class="card-title">Themida / VMProtect</div><div class="card-body">Commercial, expensive ($800+). Virtualize the original code into a custom bytecode + interpreter. Anti-debug, anti-VM, anti-dump. Real reverse-engineering job; not auto-unpacked.</div></div>
<div class="calc-card"><div class="card-title">Custom packers</div><div class="card-body">Most APT malware uses bespoke packers. Detected by entropy + small import table (<code>LoadLibraryA</code>, <code>GetProcAddress</code> only) + suspicious section names.</div></div>
</div>

<div class="calc-highlight"><strong>Entropy heuristic:</strong> a normal <code>.text</code> section has Shannon entropy 5.5–6.5. A packed/encrypted section has entropy 7.0+. The formula is the standard <em>H(X) = -Σ p(x) log₂ p(x)</em> over the byte distribution.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import math, os
def shannon_entropy(data):
    if not data: return 0.0
    counts = [0]*256
    for b in data: counts[b] += 1
    n = len(data)
    H = 0.0
    for c in counts:
        if c == 0: continue
        p = c / n
        H -= p * math.log2(p)
    return H

# Compare: random (high entropy) vs English-like text (lower)
random_bytes  = os.urandom(8192)
text_like     = (b"the quick brown fox jumps over the lazy dog. " * 200)[:8192]
zeros         = b"\\x00" * 8192
print(f"random:  {shannon_entropy(random_bytes):.3f}  -&gt; packed/encrypted")
print(f"text:    {shannon_entropy(text_like):.3f}  -&gt; normal data")
print(f"zeros:   {shannon_entropy(zeros):.3f}  -&gt; padding")
# A real PE section with entropy &gt; 7.0 is a strong packing indicator
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>shannon_entropy(data)</code> tallies a 256-bin byte histogram with a fixed-size <code>counts</code> array — one pass, O(n). 2) Computes the empirical probability <code>p = c / n</code> for each non-zero bin and accumulates <code>-p * log2(p)</code> — the textbook <em>H(X) = -Σ p(x) log₂ p(x)</em> formula in three lines. 3) Compares three corpora: <code>os.urandom(8192)</code> (uniform, H ≈ 8.0), English-like ASCII text (skewed distribution, H ≈ 4.5), and a zero-filled buffer (one symbol, H = 0). 4) The numbers print as expected — the demo proves the formula behaves and gives you a reference scale for triaging real PE sections. 5) On a real binary, any <code>.text</code> section with <code>H &gt; 7.0</code> is the canonical UPX/Themida/custom-packer red flag.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. IDA Pro and Ghidra — The Disassembler Workflow</h2>
<p class="l-text">When static inspection is not enough, you load the binary into a disassembler. <strong>IDA Pro</strong> (Ilfak Guilfanov, Hex-Rays, since 1990) is the industry standard, with the legendary Hex-Rays decompiler. <strong>Ghidra</strong> (NSA, open-sourced 2019) is the free competitor, now production-grade, and used by many shops because of zero license cost and excellent collaboration via Ghidra Server.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — Auto-analysis</div><div class="card-body">Tool detects the entry point, follows calls, identifies functions, names library imports, recovers strings.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — Triage from imports</div><div class="card-body">Look at the IAT. <code>VirtualAlloc + VirtualProtect</code> = self-modifying code. <code>WSAStartup + connect</code> = network. <code>CreateProcessAsUser + LookupPrivilegeValue</code> = privilege escalation.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — Decompile suspicious functions</div><div class="card-body">Hex-Rays / Ghidra produce C-like pseudocode. Rename variables, annotate calls, recover structures.</div></div>
<div class="calc-card"><div class="card-title">Step 4 — Cross-reference IOCs</div><div class="card-body">Strings → who references them? C2 URL → which function uses it? Encryption routine → what calls it?</div></div>
<div class="calc-card"><div class="card-title">Step 5 — Document</div><div class="card-body">Write up a sample report: family, capabilities, IOCs, YARA rule, ATT&amp;CK techniques. This is the deliverable.</div></div>
</div>

<p class="l-text">For deep RE we cover assembly, calling conventions, and decompilation pitfalls in <strong>forensics-L4</strong>.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. ML on Binaries — MalConv, EMBER, and Byte Histograms</h2>
<p class="l-text">Signature scanning misses zero-day malware. ML classifiers operating directly on bytes have closed much of that gap.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MalConv (Raff et al. 2018)</div><div class="card-body">A deep CNN that consumes the first 2 MB of raw bytes — no feature engineering. ~98% accuracy on the EMBER benchmark. Famous for being fooled by simple appending attacks (Kolosnjaji 2018).</div></div>
<div class="calc-card"><div class="card-title">EMBER dataset (Endgame 2018)</div><div class="card-body">1.1M PE samples (900K train + 200K test) labeled benign/malicious, with 2381 hand-engineered features per sample (header fields, entropy histograms, byte n-grams). The de-facto research benchmark.</div></div>
<div class="calc-card"><div class="card-title">LightGBM baseline</div><div class="card-body">On EMBER features, LightGBM hits ~98% AUC out of the box. This is what most production "next-gen AV" engines look like under the hood.</div></div>
<div class="calc-card"><div class="card-title">Adversarial caveats</div><div class="card-body">Malware authors evade by adding benign-looking sections, padding, or fake imports. Robust detection requires ensembles + behavior + reputation, not just static ML.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Generate a synthetic dataset of byte histograms — "benign" = English-like, "malicious" = high-entropy random — then train a logistic regression. Same idea as MalConv but tractable in 2 seconds.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

rng = np.random.default_rng(42)
def histogram(blob):
    h = np.bincount(np.frombuffer(blob, dtype=np.uint8), minlength=256)
    return h / h.sum()

X, y = [], []
for _ in range(400):  # benign-like: skewed toward ASCII range
    blob = bytes(rng.choice(256, size=8192, p=np.array(
        [0.001]*32 + [0.01]*95 + [0.001]*129) /
        (np.array([0.001]*32 + [0.01]*95 + [0.001]*129)).sum()))
    X.append(histogram(blob)); y.append(0)
for _ in range(400):  # "packed/malicious": near-uniform high-entropy
    blob = bytes(rng.integers(0, 256, size=8192))
    X.append(histogram(blob)); y.append(1)

X, y = np.array(X), np.array(y)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)
clf = LogisticRegression(max_iter=400).fit(Xtr, ytr)
print(classification_report(yte, clf.predict(Xte), target_names=["benign","malicious"]))
print(f"ROC-AUC: {roc_auc_score(yte, clf.predict_proba(Xte)[:,1]):.3f}")
print("Top 5 most malicious-indicative byte values:",
      np.argsort(clf.coef_[0])[-5:].tolist())
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Recap and What's Next</h2>
<p class="l-text">Static analysis is the inexpensive front line. Headers tell you the file type and target; sections + entropy reveal packing; imports and strings sketch capabilities; YARA gives reusable signatures; ML closes the zero-day gap. None of these tools requires running the sample.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>PE = Microsoft 1997, ELF = SysV ABI; both are header + sections + imports/exports.</li>
<li><code>pefile</code> and <code>lief</code> parse them in Python; <code>strings</code> + regex still finds C2 URLs and registry keys.</li>
<li>YARA rules combine literal/hex/regex strings with boolean conditions; performance demands tight strings.</li>
<li>Entropy &gt; 7.0 in <code>.text</code> = strong packing indicator; UPX is trivial, Themida/VMProtect are not.</li>
<li>IDA Pro and Ghidra take you from bytes to pseudocode; deep RE is forensics-L4.</li>
<li>MalConv + EMBER show that byte-level ML works; adversarial robustness still open.</li>
</ul>
</div>

<p class="l-text">Next, in <strong>forensics-L3</strong>, we let the sample run — in a Cuckoo or ANY.RUN sandbox, with API hooks, behavior monitors, and anti-VM bypass — to see what static analysis cannot tell us: actual runtime behavior.</p>
</div>`,
tr: `<p class="l-text"><strong>Statik analiz, bir ikili dosyanın hikâyesini onu hiç çalıştırmadan anlatma sanatıdır.</strong> Şüpheli bir dosya bir analistin masasına düştüğünde — diyelim ki e-posta ağ geçidi tarafından işaretlenmiş bir ek veya enfekte bir hosttan çekilmiş bir örnek — ilk hamle asla çift tıklamak değildir. Bayt'ları incelemektir: dosya formatı, giriş noktası, importlar, gömülü dizgiler, kod bölümleri, imzalar. Yetenekli bir zararlı yazılım analisti, herhangi bir sandbox ayağa kalkmadan önce, başlıklardan ve dizgilerden 60 saniyede bir aileyi parmak izleyebilir. Bu inceleme ekonomisi, <strong>pefile</strong>, <strong>lief</strong>, <strong>YARA</strong> ve <strong>Ghidra</strong> gibi araçları her IR çalışmasının evrensel açılış hamlesi yapan şeydir.</p>

<p class="l-text">Bu derste kanonik statik analiz boru hattını yürüyoruz: PE/ELF/Mach-O başlıklarını ayrıştırmak (Microsoft'un 1997'deki Portable Executable şartnamesi, System V ABI'den ELF), dizgileri çıkarmak (2026'da hâlâ şaşırtıcı derecede bilgilendirici), <strong>UPX</strong> gibi paketleyicileri ve ticari karartıcı <strong>Themida</strong>'yı tanımak, <strong>YARA</strong> kuralları yazmak (de facto IOC dili, başlangıçta VirusTotal'dan Victor Manuel Álvarez), ve modern ML açısına bakmak — <strong>MalConv</strong> (Raff vd. 2018) ve ham bayt histogramları üzerinde çalışan CNN sınıflandırıcılar veya EMBER veri seti (Endgame 2018, 1.1M örnek). Tersine mühendisliğin kendisi L4'ü bekler; burada disassembly çizgisinin üstünde kalıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir PE dosyasının DOS stub'ını, NT başlıklarını, bölüm tablosunu, import tablosunu ve kaynaklarını <code>pefile</code> veya <code>lief</code> ile ayrıştırmak</li>
<li>Bir ELF dosyasının ELF başlığını, program/bölüm başlıklarını, dinamik bölümünü ve sembol tablolarını okumak</li>
<li>Dizgileri (ASCII + UTF-16LE) çıkarıp triyaj etmek ve C2 URL'lerini, mutex isimlerini ve kayıt defteri anahtarlarını tanımak</li>
<li>Strings, conditions ve meta blokları olan üretim kalitesinde YARA kuralları yazmak; performans tuzaklarını anlamak</li>
<li>Paketlenmiş ikilileri bölüm entropisinden, şüpheli importlardan (yalnızca LoadLibrary/GetProcAddress) ve bilinen UPX/Themida imzalarından tanımak</li>
<li>Bayt histogramı özellikleri üzerinde küçük bir ML sınıflandırıcı eğitmek ve MalConv'un pratikte neden işe yaradığını açıklamak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. PE Formatı — Bir Windows İkilisinin Anatomisi</h2>
<p class="l-text">Her Windows EXE, DLL, SYS ve OCX bir <strong>Portable Executable</strong> dosyasıdır. Microsoft formatı 1997'de yayımladı; Unix System V'de kullanılan Common Object File Format'tan (COFF) miras alır. PE'yi en alttan tanımak zorunludur çünkü her Windows zararlı yazılım örneği bir PE'dir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">DOS stub (ilk 64 bayt + program)</div><div class="card-body"><code>MZ</code> ("Mark Zbikowski") ile başlar. Ünlü "This program cannot be run in DOS mode" mesajını içerir. 0x3C ofsetindeki <code>e_lfanew</code> PE başlığını gösterir.</div></div>
<div class="calc-card"><div class="card-title">NT Başlıkları</div><div class="card-body">İmza <code>PE\\0\\0</code>, ardından <code>FileHeader</code> (makine, # bölümler, zaman damgası) ve <code>OptionalHeader</code> (giriş noktası RVA, image base, alt sistem, veri dizinleri).</div></div>
<div class="calc-card"><div class="card-title">Bölüm Tablosu</div><div class="card-body"><code>IMAGE_SECTION_HEADER</code> dizisi. Tipik isimler: <code>.text</code> (kod, RX), <code>.data</code> (init data, RW), <code>.rdata</code> (salt okunur veri, R), <code>.rsrc</code> (kaynaklar), <code>.reloc</code> (yer değiştirmeler).</div></div>
<div class="calc-card"><div class="card-title">Veri Dizinleri</div><div class="card-body">Bölümlere işaretçiler: import tablosu (IAT), export tablosu, kaynaklar, debug bilgisi, TLS callback'leri. Zararlı yazılımlar TLS callback'leri sever — <code>main</code>'den önce çalışırlar.</div></div>
</div>

<div class="calc-highlight"><strong>Adli altın:</strong> FileHeader'daki <em>derleme zaman damgası</em> genellikle sahte yapılır ama bazen saldırganın saat dilimini sızdırır (UTC+3 = Rusya saatleri, UTC+8 = Çin saatleri, UTC+9 = Kuzey Kore Lazarus dönemleri). Mandiant'ın APT1 raporu (2013), PLA Birim 61398'in Pekin iş saatleri çalıştığını öne sürmek için derleme zamanı kümelemesini kullandı.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. pefile ve lief ile PE Ayrıştırma</h2>
<p class="l-text">İki Python kütüphanesi baskındır. <strong>pefile</strong> (Ero Carrera, 2005) hafif, salt okunur seçenektir. <strong>lief</strong> (Quarkslab) daha ağırdır, PE/ELF/Mach-O destekler ve ikilileri <em>değiştirmenize</em> izin verir — paket açma ve enstrümantasyon için kullanışlı.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import pefile
pe = pefile.PE("sample.exe")
print(f"Machine: {hex(pe.FILE_HEADER.Machine)}")          # 0x8664 = AMD64
print(f"Compiled: {pe.FILE_HEADER.TimeDateStamp}")        # epoch seconds
print(f"Entry point: {hex(pe.OPTIONAL_HEADER.AddressOfEntryPoint)}")
print(f"Image base:  {hex(pe.OPTIONAL_HEADER.ImageBase)}")
for s in pe.sections:
    name = s.Name.decode(errors='ignore').rstrip('\\0')
    print(f"  {name:&lt;10} VA={hex(s.VirtualAddress)} size={s.SizeOfRawData} entropy={s.get_entropy():.2f}")
for entry in pe.DIRECTORY_ENTRY_IMPORT:
    print(f"Imports from {entry.dll.decode()}:")
    for imp in entry.imports[:3]:
        print(f"  - {imp.name.decode() if imp.name else '(ord)'}")
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>pefile.PE("sample.exe")</code> dosyayı mmap'leyip DOS stub'ını yürür ve <code>e_lfanew</code> üzerinden PE başlığına atlar. 2) <code>FILE_HEADER.Machine</code> (0x8664 = AMD64, 0x14C = i386) ve <code>TimeDateStamp</code> alanlarını okur; ikincisi adli derleme-zamanı altın madenidir. 3) <code>OPTIONAL_HEADER.AddressOfEntryPoint</code> ve <code>ImageBase</code>'i çeker — yükleyici imajı eşledikten sonra yürütmenin nereden başlayacağını bilirsin. 4) <code>pe.sections</code> üzerinde döner; 8 baytlık ismi, sanal adresi, ham boyutu ve <code>s.get_entropy()</code> ile Shannon entropisini decode eder — <code>.text</code>'te entropi > 7.0 doğrudan paketleyici sinyalidir. 5) <code>DIRECTORY_ENTRY_IMPORT</code>'u yürür ve her DLL ile ilk birkaç API ismini listeler — disassembly'ye girmeden ağ, kripto veya injection yeteneklerini ele veren IAT parmak izi.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bayt-bayt sentetik bir PE benzeri başlık oluştur, sonra <code>struct.unpack</code> ile ayrıştır. <code>pefile</code>'ın dahili olarak yaptığı tam olarak budur — sihir yok, sadece C struct'ları.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import struct

# 64-bit bir PE'nin ilk 0x100 baytını sentezle
buf = bytearray(0x200)
buf[0:2]  = b"MZ"                           # DOS magic
buf[0x3C:0x40] = struct.pack("&lt;I", 0x80)    # e_lfanew -&gt; PE header at 0x80
buf[0x80:0x84] = b"PE\\x00\\x00"             # PE signature
# IMAGE_FILE_HEADER (20 bayt) 0x84 ofsetinde
struct.pack_into("&lt;HHIIIHH", buf, 0x84,
    0x8664,           # Machine = AMD64
    3,                # NumberOfSections
    0x65a3b1c0,       # TimeDateStamp (Jan 2024-ish)
    0, 0,             # PointerToSymbolTable, NumberOfSymbols
    0xF0,             # SizeOfOptionalHeader
    0x22)             # Characteristics

# Şimdi geri ayrıştır
e_lfanew = struct.unpack_from("&lt;I", buf, 0x3C)[0]
sig = bytes(buf[e_lfanew:e_lfanew+4])
machine, nsec, ts, _, _, optsz, char = struct.unpack_from("&lt;HHIIIHH", buf, e_lfanew + 4)
print(f"DOS magic: {bytes(buf[:2])}, e_lfanew=0x{e_lfanew:x}")
print(f"PE sig: {sig}, Machine=0x{machine:x}, sections={nsec}, ts={ts}")
print(f"OptHeader size=0x{optsz:x}, characteristics=0x{char:x}")
print("Doğrulandı: bu, pefile.PE()'nin gerçek bir ikiliyi tam olarak nasıl okuduğudur.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ELF — Linux Karşılığı</h2>
<p class="l-text">Linux zararlı yazılımları (Mirai, XOR.DDoS, EBURY rootkit, NoaBot), System V ABI'de belirtilen ve gABI/psABI belgelerinde rafine edilen <strong>ELF</strong> (Executable and Linkable Format) olarak gönderilir. Fikirler PE ile aynıdır, isimler farklıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ELF başlığı (52 / 64 bayt)</div><div class="card-body">Magic <code>0x7F 'E' 'L' 'F'</code>, sınıf (32/64), veri (LE/BE), OS ABI, tip (EXEC/DYN/REL), makine (x86_64=0x3E, ARM64=0xB7), giriş noktası.</div></div>
<div class="calc-card"><div class="card-title">Program başlıkları</div><div class="card-body">Yükleyiciye segmentleri nasıl eşleyeceğini söyler. <code>PT_LOAD</code> = beni eşle, <code>PT_DYNAMIC</code> = dinamik bağlayıcı bilgisi, <code>PT_INTERP</code> = <code>ld-linux.so</code>'ya yol.</div></div>
<div class="calc-card"><div class="card-title">Bölüm başlıkları</div><div class="card-body">Bağlayıcıya/analiste neyin nerede olduğunu söyler. <code>.text</code>, <code>.data</code>, <code>.bss</code>, <code>.rodata</code>, <code>.dynsym</code>, <code>.dynstr</code>, <code>.plt</code>, <code>.got</code>.</div></div>
<div class="calc-card"><div class="card-title">Dinamik bölüm</div><div class="card-body"><code>DT_NEEDED</code> girdileri paylaşılan kütüphaneleri listeler (libc.so.6, libssl.so.3). <code>DT_RPATH</code>/<code>DT_RUNPATH</code> kaçırma için yaygın zararlı yazılım hileleridir.</div></div>
</div>

<p class="l-text">Araçlar: <code>readelf</code>, <code>objdump</code>, <code>nm</code>, <code>pyelftools</code> Python kütüphanesi ve <code>lief</code>. Modern Linux zararlı yazılımları için, <strong>Stripped + Statik bağlanmış</strong> kombinasyonu analistin baş düşmanıdır — sembol yok, libc isimleri yok, bayt seviyesinde imza eşleştirme yapmanız gerekir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Dizgiler — Ucuz İstihbarat</h2>
<p class="l-text">Unix <code>strings</code> komutu (1971, Doug McIlroy), statik analizde hâlâ saniye başına en yüksek değerli araçtır. ≥ 4 uzunluğundaki her yazdırılabilir ASCII dizisini, ayrıca UTF-16LE eşdeğerini (Windows çoğu dizgiyi geniş karakter olarak sakladığından) çekin; sıklıkla C2 URL'lerini, mutex isimlerini, kayıt defteri anahtarlarını, sabit kodlanmış parolaları ve geliştiricinin makinesini sızdıran PDB yollarını görürsünüz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re
def strings_ascii(data, n=4):
    return re.findall(rb"[\\x20-\\x7e]{%d,}" % n, data)
def strings_utf16(data, n=4):
    pat = rb"(?:[\\x20-\\x7e]\\x00){%d,}" % n
    return [m.replace(b"\\x00", b"") for m in re.findall(pat, data)]

with open("sample.exe", "rb") as f:
    data = f.read()
all_strs = [s.decode(errors='ignore') for s in strings_ascii(data) + strings_utf16(data)]
suspicious = [s for s in all_strs if any(k in s.lower() for k in
    ["http://", "https://", ".onion", "schtasks", "regedit", "powershell", "cmd.exe", "mimikatz"])]
print(f"Total strings: {len(all_strs)}, suspicious: {len(suspicious)}")
for s in suspicious[:10]: print("  ", s)
</code></pre></div>
<p class="l-text"><strong>Kodun adım adım işleyişi:</strong> 1) <code>strings_ascii</code> yazdırılabilir bayt aralığı <code>\\x20-\\x7e</code> üzerinde minimum <code>n</code> uzunluğunda bir regex çalıştırır — 1971 Unix <code>strings</code> komutunun kullandığı aynı sezgi. 2) <code>strings_utf16</code> Windows'un geniş karakter (wide-char) depolamasıyla başa çıkar: <em>yazdırılabilir bayt + null bayt</em> çiftlerini eşler, sonra null'ları söker ve okunabilir ASCII'ye dönüştürür. 3) Tüm ikiliyi <code>data</code>'ya okur ve her eşleşmeyi errors-ignored decode eder, böylece çözülemeyen baytlar pipeline'ı çökertmez. 4) Korpusu bir anahtar kelime listesinden — <code>http://</code>, <code>.onion</code>, <code>schtasks</code>, <code>powershell</code>, <code>mimikatz</code> — filtreler ve IOC'leri ile lateral hareket araçlarını yüzeye çıkarır. 5) Bir sayım ile ilk on şüpheli eşleşmeyi yazdırır — her analistin ilk 60 saniyede yaptığı tek-ekran triyajı.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Gerçek görünümlü IOC içeren sahte bir ikili blob sentezle, sonra regex ile çıkar — komut satırında <code>strings | grep</code>'in kullandığı tam tekniği.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re, os

# Çöp baytlar ve gömülü dizgilerle sahte bir ikili oluştur
parts = [
    os.urandom(120),
    b"MZ\\x90\\x00",
    b"This program cannot be run in DOS mode.",
    os.urandom(80),
    b"http://evil.example.com/beacon",
    os.urandom(40),
    b"SOFTWARE\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run",
    os.urandom(50),
    b"GLOBAL\\\\Mutex_Conti_v3",
    b"powershell.exe -enc JABzAD0A",
    os.urandom(200),
]
blob = b"".join(parts)

ascii_re = re.compile(rb"[\\x20-\\x7e]{6,}")
strs = [s.decode() for s in ascii_re.findall(blob)]
print(f"Recovered {len(strs)} strings of length &gt;= 6:")
for s in strs: print("  ", s)

iocs = {"url": [], "mutex": [], "registry": [], "ps_b64": []}
for s in strs:
    if s.startswith("http"):                   iocs["url"].append(s)
    if "Mutex" in s:                           iocs["mutex"].append(s)
    if "SOFTWARE\\\\" in s:                     iocs["registry"].append(s)
    if "powershell" in s.lower() and "-enc" in s.lower(): iocs["ps_b64"].append(s)
print("IOCs extracted:", iocs)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. YARA — Örüntü Dili</h2>
<p class="l-text"><strong>YARA</strong> (Victor Manuel Álvarez, sonra VirusTotal, ~2013), zararlı yazılım tanımlamasının ortak dilidir. Bir YARA kuralı üç bloklu küçük bir bildirimsel belgedir: <code>meta</code> (açıklama, yazar, hash), <code>strings</code> (literaller, hex örüntüler, regex'ler) ve <code>condition</code> (dizgiler + dosya özellikleri üzerinde boole). Florian Roth'un <code>signature-base</code>'i ve YARA-Rules gibi depolarda on binlerce kural dolaşır.</p>

<div class="code-wrap"><div class="code-label"><span>YARA</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>rule Conti_Ransomware_v3
{
    meta:
        author      = "IR Team"
        description = "Detects Conti v3 ransomware loader"
        date        = "2022-04-19"
        sha256      = "f81e2e..."
        reference   = "Mandiant M-Trends 2022"

    strings:
        $mz       = { 4D 5A }                         // MZ at start
        $mutex    = "GLOBAL\\\\Mutex_Conti_v3" wide ascii
        $note     = "CONTI_README.txt" nocase
        $api_str  = "CryptEncrypt"
        $hex_seed = { 8B 45 ?? 33 D2 B9 9E 3D 00 00 } // ChaCha20 init pattern

    condition:
        $mz at 0
        and filesize &lt; 5MB
        and 3 of ($mutex, $note, $api_str, $hex_seed)
}
</code></pre></div>
<p class="l-text"><strong>Kuralı blok blok okuyalım:</strong> 1) <code>meta</code> bloğu kaynak bilgisini taşır — yazar, açıklama, tarih, örnek <code>sha256</code> ve bir Mandiant referansı — böylece bir sonraki analist kuralın kim tarafından, neden yazıldığını denetleyebilir. 2) <code>$mz = { 4D 5A }</code> bir hex örüntüdür (PE magic bayt'ları) ve <code>$mz at 0</code> koşulu ile dosyanın başına çapalanmıştır — ucuz ön-filtre. 3) <code>$mutex</code> <code>"GLOBAL\\\\Mutex_Conti_v3"</code> dizgisini hem <code>wide</code> hem <code>ascii</code> olarak tanımlar — Windows'un UTF-16LE depolamasıyla eşleşsin diye. 4) <code>$hex_seed</code> bir ChaCha20 başlatma örüntüsü içinde joker nibble'lar (<code>?? </code>) kullanır — küçük varyant değişikliklerinden sağ çıkar. 5) <code>condition</code>, MZ çapasını, <code>filesize &lt; 5MB</code> sınırını (Conti küçük bir loader) ve dört davranışsal dizgiden en az <strong>3 tanesinin</strong> eşleşmesini ister — hem false positive'leri hem de paketleyici kaynaklı kaçırmaları azaltan gürültü-toleranslı bir eşik.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Literal dizgileri ve joker karakterli hex örüntüleri destekleyen saf Python mini-YARA motoru. Bu, gerçek <code>libyara</code>'nın yaptığının 40 satırlık iskeletidir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re, os

def hex_to_regex(hex_pat):
    # "8B 45 ?? 33 D2" -&gt; rb"\\x8b\\x45.\\x33\\xd2"
    out = b""
    for tok in hex_pat.split():
        out += b"." if "?" in tok else bytes([int(tok, 16)])
    return re.compile(out, re.DOTALL)

def yara_match(blob, rule):
    hits = {}
    for name, pat in rule["strings"].items():
        if pat["type"] == "ascii":
            hits[name] = pat["value"].encode() in blob
        elif pat["type"] == "hex":
            hits[name] = hex_to_regex(pat["value"]).search(blob) is not None
    matched = sum(hits.values())
    cond = matched &gt;= rule["condition_min"] and (b"MZ" == blob[:2])
    return cond, hits

rule = {
    "name": "Conti_v3_demo",
    "strings": {
        "mutex":    {"type":"ascii","value":"GLOBAL\\\\Mutex_Conti_v3"},
        "note":     {"type":"ascii","value":"CONTI_README.txt"},
        "api":      {"type":"ascii","value":"CryptEncrypt"},
        "hex_seed": {"type":"hex","value":"8B 45 ?? 33 D2 B9 9E 3D 00 00"},
    },
    "condition_min": 3,
}

# "Zararlı" bir örnek sentezle
blob = (b"MZ" + os.urandom(50) +
        b"GLOBAL\\\\Mutex_Conti_v3" + os.urandom(20) +
        b"CONTI_README.txt" + os.urandom(20) +
        b"CryptEncrypt" + os.urandom(20) +
        bytes.fromhex("8b4501 33d2 b9 9e3d0000"))
matched, details = yara_match(blob, rule)
print("Rule:", rule["name"], "-&gt;", "MATCH" if matched else "MISS")
print("Detail:", details)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Paketleyiciler — UPX, Themida ve Arkadaşları</h2>
<p class="l-text">Çoğu modern zararlı yazılım <strong>paketlenmiştir</strong>: orijinal kod sıkıştırılmış/şifrelenmiştir ve küçük bir paket açıcı taslak çalışma zamanında onu yeniden kurar. Bu, naif dizgi ve imza taramalarını boşa çıkarır. Üç aile baskındır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">UPX</div><div class="card-body">Açık kaynak sıkıştırıcı (Markus Oberhumer, 1998'den beri). Bölümler <code>UPX0</code>, <code>UPX1</code> olarak yeniden adlandırılır. Paketlenmiş bölümlerde yüksek entropi. Açmak basit: <code>upx -d sample.exe</code>.</div></div>
<div class="calc-card"><div class="card-title">Themida / VMProtect</div><div class="card-body">Ticari, pahalı (\\$800+). Orijinal kodu özel bir bytecode + yorumlayıcıya sanallaştırır. Anti-debug, anti-VM, anti-dump. Gerçek bir tersine mühendislik işi; otomatik açılmaz.</div></div>
<div class="calc-card"><div class="card-title">Özel paketleyiciler</div><div class="card-body">Çoğu APT zararlı yazılımı özel paketleyiciler kullanır. Entropi + küçük import tablosu (yalnızca <code>LoadLibraryA</code>, <code>GetProcAddress</code>) + şüpheli bölüm isimleri ile tespit edilir.</div></div>
</div>

<div class="calc-highlight"><strong>Entropi sezgisi:</strong> normal bir <code>.text</code> bölümünün Shannon entropisi 5.5–6.5 arasındadır. Paketlenmiş/şifrelenmiş bir bölümün entropisi 7.0+ olur. Formül standart <em>H(X) = -Σ p(x) log₂ p(x)</em>, bayt dağılımı üzerinden.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import math, os
def shannon_entropy(data):
    if not data: return 0.0
    counts = [0]*256
    for b in data: counts[b] += 1
    n = len(data)
    H = 0.0
    for c in counts:
        if c == 0: continue
        p = c / n
        H -= p * math.log2(p)
    return H

# Karşılaştır: rastgele (yüksek entropi) vs İngilizce benzeri metin (daha düşük)
random_bytes  = os.urandom(8192)
text_like     = (b"the quick brown fox jumps over the lazy dog. " * 200)[:8192]
zeros         = b"\\x00" * 8192
print(f"random:  {shannon_entropy(random_bytes):.3f}  -&gt; packed/encrypted")
print(f"text:    {shannon_entropy(text_like):.3f}  -&gt; normal data")
print(f"zeros:   {shannon_entropy(zeros):.3f}  -&gt; padding")
# Entropisi &gt; 7.0 olan gerçek bir PE bölümü güçlü bir paketleme göstergesidir
</code></pre></div>
<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>shannon_entropy(data)</code> sabit boyutlu bir <code>counts</code> dizisiyle 256-bin'lik bir bayt histogramı sayar — tek geçiş, O(n). 2) Sıfır olmayan her bin için ampirik olasılık <code>p = c / n</code>'yi hesaplar ve <code>-p * log2(p)</code>'yi toplar — ders kitabındaki <em>H(X) = -Σ p(x) log₂ p(x)</em> formülü üç satırda. 3) Üç korpusu karşılaştırır: <code>os.urandom(8192)</code> (uniform, H ≈ 8.0), İngilizce benzeri ASCII metin (eğri dağılım, H ≈ 4.5) ve sıfır dolgulu buffer (tek sembol, H = 0). 4) Sayılar beklendiği gibi yazılır — demo formülün doğru çalıştığını kanıtlar ve gerçek PE bölümlerini triyaj etmek için bir referans ölçek verir. 5) Gerçek bir ikilide <code>.text</code> bölümünün <code>H &gt; 7.0</code> olması kanonik UPX/Themida/özel-paketleyici kırmızı bayrağıdır.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. IDA Pro ve Ghidra — Disassembler İş Akışı</h2>
<p class="l-text">Statik inceleme yetersiz kaldığında, ikiliyi bir disassembler'a yüklersiniz. <strong>IDA Pro</strong> (Ilfak Guilfanov, Hex-Rays, 1990'dan beri) efsanevi Hex-Rays decompiler'ı ile sektör standardıdır. <strong>Ghidra</strong> (NSA, 2019'da açık kaynaklandı) ücretsiz rakibidir; artık üretim sınıfındadır ve sıfır lisans maliyeti ve Ghidra Server üzerinden mükemmel işbirliği sayesinde birçok firma tarafından kullanılır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — Otomatik analiz</div><div class="card-body">Araç giriş noktasını tespit eder, çağrıları takip eder, fonksiyonları tanımlar, kütüphane importlarını adlandırır, dizgileri kurtarır.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — Importlardan triyaj</div><div class="card-body">IAT'ye bakın. <code>VirtualAlloc + VirtualProtect</code> = kendini değiştiren kod. <code>WSAStartup + connect</code> = ağ. <code>CreateProcessAsUser + LookupPrivilegeValue</code> = yetki yükseltme.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — Şüpheli fonksiyonları decompile et</div><div class="card-body">Hex-Rays / Ghidra C benzeri pseudocode üretir. Değişkenleri yeniden adlandır, çağrıları açıklamala, yapıları kurtar.</div></div>
<div class="calc-card"><div class="card-title">Adım 4 — IOC'leri çapraz referansla</div><div class="card-body">Dizgiler → onlara kim atıfta bulunuyor? C2 URL → hangi fonksiyon kullanıyor? Şifreleme rutini → onu ne çağırıyor?</div></div>
<div class="calc-card"><div class="card-title">Adım 5 — Belgele</div><div class="card-body">Bir örnek raporu yaz: aile, kabiliyetler, IOC'ler, YARA kuralı, ATT&amp;CK teknikleri. Bu, teslim edilecek üründür.</div></div>
</div>

<p class="l-text">Derin tersine mühendislik için assembly'yi, çağırma sözleşmelerini ve decompilation tuzaklarını <strong>forensics-L4</strong>'te ele alıyoruz.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. İkililerde ML — MalConv, EMBER ve Bayt Histogramları</h2>
<p class="l-text">İmza taraması sıfır gün zararlı yazılımları kaçırır. Doğrudan baytlar üzerinde çalışan ML sınıflandırıcılar bu boşluğu büyük ölçüde kapattı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MalConv (Raff vd. 2018)</div><div class="card-body">Ham baytların ilk 2 MB'ını tüketen derin bir CNN — özellik mühendisliği yok. EMBER benchmark'unda ~%98 doğruluk. Basit ekleme saldırılarıyla aldatılmasıyla ünlüdür (Kolosnjaji 2018).</div></div>
<div class="calc-card"><div class="card-title">EMBER veri seti (Endgame 2018)</div><div class="card-body">1.1M PE örneği (900K eğitim + 200K test) iyi/zararlı olarak etiketlenmiş, örnek başına 2381 elle hazırlanmış özellik (başlık alanları, entropi histogramları, bayt n-gramları). De facto araştırma benchmark'ı.</div></div>
<div class="calc-card"><div class="card-title">LightGBM temel</div><div class="card-body">EMBER özellikleri üzerinde, LightGBM kutudan ~%98 AUC alır. Çoğu üretim "yeni nesil AV" motorunun başlık altında nasıl göründüğü budur.</div></div>
<div class="calc-card"><div class="card-title">Karşıt-saldırı uyarıları</div><div class="card-body">Zararlı yazılım yazarları iyi görünümlü bölümler, dolgu veya sahte importlar ekleyerek kaçar. Sağlam tespit sadece statik ML değil; topluluklar + davranış + itibar gerektirir.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bayt histogramlarından sentetik bir veri seti üret — "iyi" = İngilizce benzeri, "zararlı" = yüksek entropili rastgele — sonra lojistik regresyon eğit. MalConv ile aynı fikir ama 2 saniyede çözülebilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

rng = np.random.default_rng(42)
def histogram(blob):
    h = np.bincount(np.frombuffer(blob, dtype=np.uint8), minlength=256)
    return h / h.sum()

X, y = [], []
for _ in range(400):  # iyi-benzeri: ASCII aralığına çarpık
    blob = bytes(rng.choice(256, size=8192, p=np.array(
        [0.001]*32 + [0.01]*95 + [0.001]*129) /
        (np.array([0.001]*32 + [0.01]*95 + [0.001]*129)).sum()))
    X.append(histogram(blob)); y.append(0)
for _ in range(400):  # "paketlenmiş/zararlı": yakın-uniform yüksek entropi
    blob = bytes(rng.integers(0, 256, size=8192))
    X.append(histogram(blob)); y.append(1)

X, y = np.array(X), np.array(y)
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.25, random_state=0)
clf = LogisticRegression(max_iter=400).fit(Xtr, ytr)
print(classification_report(yte, clf.predict(Xte), target_names=["benign","malicious"]))
print(f"ROC-AUC: {roc_auc_score(yte, clf.predict_proba(Xte)[:,1]):.3f}")
print("Top 5 most malicious-indicative byte values:",
      np.argsort(clf.coef_[0])[-5:].tolist())
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<p class="l-text">Statik analiz ucuz ön cephedir. Başlıklar size dosya tipini ve hedefini söyler; bölümler + entropi paketlemeyi açığa çıkarır; importlar ve dizgiler kabiliyetleri çizer; YARA yeniden kullanılabilir imzalar verir; ML sıfır gün boşluğunu kapatır. Bu araçların hiçbiri örneği çalıştırmayı gerektirmez.</p>

<div class="calc-highlight"><strong>Temel çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>PE = Microsoft 1997, ELF = SysV ABI; her ikisi de başlık + bölümler + importlar/exportlardır.</li>
<li><code>pefile</code> ve <code>lief</code> Python'da ayrıştırır; <code>strings</code> + regex hâlâ C2 URL'lerini ve kayıt defteri anahtarlarını bulur.</li>
<li>YARA kuralları literal/hex/regex dizgileri boole koşullarıyla birleştirir; performans sıkı dizgiler ister.</li>
<li><code>.text</code>'te entropi &gt; 7.0 = güçlü paketleme göstergesi; UPX basit, Themida/VMProtect değil.</li>
<li>IDA Pro ve Ghidra sizi baytlardan pseudocode'a götürür; derin RE forensics-L4'tür.</li>
<li>MalConv + EMBER bayt seviyesinde ML'in çalıştığını gösterir; karşıt sağlamlık hâlâ açık.</li>
</ul>
</div>

<p class="l-text">Sırada, <strong>forensics-L3</strong>'te, örneği çalıştırıyoruz — bir Cuckoo veya ANY.RUN sandbox'ında, API kancaları, davranış izleyicileri ve anti-VM atlatma ile — statik analizin söyleyemediğini görmek için: gerçek çalışma zamanı davranışı.</p>
</div>`
};
