window.FORENSICS_L4 = {
en: `<p class="l-text"><strong>Reverse engineering is the act of reading machine code as literature.</strong> When the API logs from L3 say "the sample called <code>CryptEncrypt</code> 481 times" but you need to know <em>which key, on which files, in what order, and why</em>, the only way is to descend into the binary and read the instructions the CPU will actually execute. That descent has been industrialized: <strong>IDA Pro</strong> (Ilfak Guilfanov, 1991, the longtime king), <strong>Binary Ninja</strong> (Vector 35, 2016), <strong>radare2 / Cutter</strong> (open-source), and most importantly <strong>Ghidra</strong> — the NSA's own reverse-engineering platform, open-sourced in March 2019, free, and now standard in academia and industry alike.</p>

<p class="l-text">In this lesson we focus on the two skills that compound: reading <strong>x86_64 assembly</strong> with fluency, and using <strong>Ghidra's decompiler</strong> as a force-multiplier rather than a crutch. We cover registers and calling conventions (<strong>System V AMD64 ABI</strong> for Linux/macOS, <strong>Microsoft x64</strong> for Windows), prologue/epilogue patterns, control-flow reconstruction (Ghidra's P-Code IR), and the canonical workflow: load → analyze → identify entry → rename → re-type → comment → repeat.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Read x86_64 assembly: GP registers, condition flags, addressing modes, the most common 30 mnemonics</li>
<li>Trace function arguments through System V AMD64 (RDI, RSI, RDX, RCX, R8, R9) and Windows x64 (RCX, RDX, R8, R9 + shadow space)</li>
<li>Recognize prologues, epilogues, stack frames, and tail calls</li>
<li>Drive Ghidra: import binary, run auto-analysis, navigate the function listing, use the decompiler view, retype variables</li>
<li>Understand P-Code (Ghidra's intermediate representation) and why it is the right level for cross-architecture analysis</li>
<li>Write a tiny disassembler stub yourself to demystify what tools do</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The x86_64 Register File</h2>
<p class="l-text">The 64-bit successor to x86 (designed by AMD as <strong>AMD64 / x86-64</strong>, ratified 2003) doubled the general-purpose register count from 8 to 16. Each is 64 bits wide and aliases to smaller views. Knowing the aliases is non-negotiable.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RAX, RBX, RCX, RDX</div><div class="card-body">Legacy 8086 quartet. 64-bit RAX, 32-bit EAX, 16-bit AX, 8-bit AH/AL. RAX = return value by convention.</div></div>
<div class="calc-card"><div class="card-title">RSI, RDI, RBP, RSP</div><div class="card-body">Source/dest index, base pointer, stack pointer. RSP always points at top-of-stack. RBP optional in optimized code.</div></div>
<div class="calc-card"><div class="card-title">R8 – R15</div><div class="card-body">AMD64 additions. Sub-views: R8D (32), R8W (16), R8B (8). Heavily used by SysV ABI for argument passing.</div></div>
<div class="calc-card"><div class="card-title">RIP</div><div class="card-body">Instruction pointer. RIP-relative addressing (<code>mov rax, [rip+0x1234]</code>) is the default for PIC code on x86_64.</div></div>
<div class="calc-card"><div class="card-title">RFLAGS</div><div class="card-body">Status: ZF (zero), SF (sign), CF (carry), OF (overflow), PF (parity). Set by arithmetic, consumed by <code>jcc</code>.</div></div>
<div class="calc-card"><div class="card-title">XMM0 – XMM15</div><div class="card-body">128-bit SSE/AVX. Used for floats (<code>movss</code>, <code>mulsd</code>) and SIMD. AVX-512 extends to ZMM (512 bit).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Calling Conventions — Where Are My Arguments?</h2>
<p class="l-text">There are two x86_64 ABIs in the wild, and forgetting which one you're in is the #1 mistake of new reversers.</p>

<div class="calc-highlight"><strong>System V AMD64 ABI</strong> (Linux, macOS, BSD): integer/pointer args 1–6 in <code>RDI, RSI, RDX, RCX, R8, R9</code>. Floats in <code>XMM0–XMM7</code>. Return in <code>RAX</code> (and <code>RDX</code> for 128-bit). Caller cleans the stack. <strong>Red zone</strong>: leaf functions can use 128 bytes below RSP without adjusting it.</div>

<div class="calc-highlight"><strong>Microsoft x64 ABI</strong> (Windows): integer args 1–4 in <code>RCX, RDX, R8, R9</code>. Caller must reserve <strong>32 bytes of shadow space</strong> on the stack regardless of arg count. Return in <code>RAX</code>. No red zone.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why it matters</div><div class="card-body">Reading "what file does this open?", on Linux you look at RDI; on Windows you look at RCX. Get this wrong and your IoC is garbage.</div></div>
<div class="calc-card"><div class="card-title">Variadic functions</div><div class="card-body">SysV: AL holds the count of XMM args used. Windows: still uses RCX/RDX/R8/R9 then stack.</div></div>
<div class="calc-card"><div class="card-title">Callee-saved</div><div class="card-body">SysV: RBX, RBP, R12–R15. Windows: also RDI, RSI. The function must restore them in epilogue.</div></div>
<div class="calc-card"><div class="card-title">__fastcall on 32-bit</div><div class="card-body">Different beast — ECX, EDX then stack. Important for older Windows malware (still common in 2026 droppers for compat).</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Prologue, Epilogue, Stack Frame</h2>
<p class="l-text">The skeleton of a non-leaf function on x86_64 is recognizable in milliseconds:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Canonical x86_64 SysV function (pseudo-asm shown as Python string for context)
prologue = """
push    rbp                 ; save old frame pointer
mov     rbp, rsp            ; new frame pointer = current stack pointer
sub     rsp, 0x30           ; reserve 0x30 bytes of locals
mov     [rbp-0x08], rdi     ; spill arg1 to local
mov     [rbp-0x10], rsi     ; spill arg2 to local
"""
body = "; ... function body ..."
epilogue = """
mov     rax, [rbp-0x18]     ; load return value into RAX
add     rsp, 0x30           ; release locals
pop     rbp                 ; restore old frame pointer
ret                         ; return to caller
"""
print(prologue + body + epilogue)
</code></pre></div>

<p class="l-text">Modern compilers often <em>omit RBP</em> (frame-pointer omission, <code>-fomit-frame-pointer</code>) and address everything from RSP. Ghidra reconstructs the frame regardless. Tail calls (<code>jmp foo</code> instead of <code>call foo; ret</code>) are common in optimized release builds and confuse naive disassemblers.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The 30 Mnemonics That Matter</h2>
<p class="l-text">x86_64 has &gt;1500 instructions if you count every SIMD encoding. In practice, 95% of malware uses 30. Memorize this list and you can read any sample's hot path.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Data movement</div><div class="card-body"><code>mov, lea, push, pop, xchg, movsx, movzx</code></div></div>
<div class="calc-card"><div class="card-title">Arithmetic / logic</div><div class="card-body"><code>add, sub, imul, idiv, inc, dec, neg, and, or, xor, not, shl, shr, sar, rol, ror</code></div></div>
<div class="calc-card"><div class="card-title">Control flow</div><div class="card-body"><code>jmp, call, ret, je, jne, jz, jnz, jg, jl, jge, jle, ja, jb, loop</code></div></div>
<div class="calc-card"><div class="card-title">Comparison</div><div class="card-body"><code>cmp, test, setcc</code> — <code>test rax, rax</code> followed by <code>jz</code> is the ubiquitous null-check pattern.</div></div>
</div>

<div class="calc-highlight"><code>xor reg, reg</code> is the canonical zeroing idiom — shorter than <code>mov reg, 0</code> and breaks dependency chains. When you see <code>xor eax, eax</code> at function start it almost always means "set return = 0".</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Writing a Toy Disassembler</h2>
<p class="l-text">To demystify what Ghidra and IDA do, decode a handful of x86 opcodes by hand. Real engines (Capstone, Zydis) handle 1500+ instructions and prefixes; this stub handles a fragment but proves the principle.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Tiny x86_64 opcode decoder — single-byte opcodes only, no prefixes/ModRM
OPCODES = {
  0x50: ("push","rax"), 0x51: ("push","rcx"), 0x52: ("push","rdx"), 0x53: ("push","rbx"),
  0x54: ("push","rsp"), 0x55: ("push","rbp"), 0x56: ("push","rsi"), 0x57: ("push","rdi"),
  0x58: ("pop","rax"),  0x59: ("pop","rcx"),  0x5A: ("pop","rdx"),  0x5B: ("pop","rbx"),
  0x5D: ("pop","rbp"),
  0x90: ("nop",""),
  0xC3: ("ret",""),
  0xCC: ("int3",""),
}
def disas(buf, base=0x401000):
    pc, out = 0, []
    while pc &lt; len(buf):
        op = buf[pc]
        if op == 0x48 and pc+2 &lt; len(buf) and buf[pc+1] == 0x89:
            out.append((base+pc, "mov r/m64, r64 (REX.W)")); pc += 3; continue
        if op == 0xE8 and pc+5 &lt;= len(buf):
            disp = int.from_bytes(buf[pc+1:pc+5],"little",signed=True)
            tgt = base + pc + 5 + disp
            out.append((base+pc, f"call 0x{tgt:x}")); pc += 5; continue
        m = OPCODES.get(op)
        if m: out.append((base+pc, f"{m[0]:6s} {m[1]}")); pc += 1
        else: out.append((base+pc, f".byte 0x{op:02x}")); pc += 1
    return out

sample = bytes([0x55, 0x48, 0x89, 0xE5, 0x90, 0xE8, 0x00, 0x00, 0x00, 0x00, 0x5D, 0xC3])
for addr, asm in disas(sample):
    print(f"0x{addr:08x}: {asm}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>OPCODES</code> is a flat dict mapping single-byte x86_64 opcodes to mnemonic + operand pairs — the <code>0x50..0x57</code> range is <code>push reg</code>, <code>0x58..0x5F</code> is <code>pop reg</code>, plus the staples <code>nop</code>, <code>ret</code>, <code>int3</code>. 2) <code>disas()</code> walks the buffer with a program-counter <code>pc</code>, handling two multi-byte cases first: <code>0x48 0x89 ...</code> (REX.W <code>mov r/m64, r64</code>) advances 3 bytes, and <code>0xE8 disp32</code> (near <code>call</code>) reads a signed 32-bit displacement, computes <code>tgt = base + pc + 5 + disp</code>, and prints the resolved target. 3) Falls back to the single-byte table; unknown bytes become <code>.byte 0xNN</code> — the same recovery strategy real engines like <code>capstone</code> use. 4) Runs against a 12-byte buffer that encodes a textbook function prologue (<code>push rbp; mov rbp, rsp; nop; call $+0; pop rbp; ret</code>) and prints each <code>0xADDR: instr</code> line just like IDA's listing view.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same toy disassembler, pure Python, runs anywhere. Decodes a function prologue + nop + call + epilogue.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>OPCODES = {
  0x50:("push","rax"),0x55:("push","rbp"),0x5D:("pop","rbp"),
  0x90:("nop",""),0xC3:("ret",""),0xCC:("int3",""),
}
def disas(buf, base=0x401000):
    pc, out = 0, []
    while pc &lt; len(buf):
        op = buf[pc]
        if op == 0x48 and pc+2 &lt; len(buf) and buf[pc+1] == 0x89:
            out.append((base+pc, "mov r/m64, r64 (REX.W)")); pc += 3; continue
        if op == 0xE8 and pc+5 &lt;= len(buf):
            disp = int.from_bytes(buf[pc+1:pc+5],"little",signed=True)
            tgt = base + pc + 5 + disp
            out.append((base+pc, f"call 0x{tgt:x}")); pc += 5; continue
        m = OPCODES.get(op)
        if m: out.append((base+pc, f"{m[0]:6s} {m[1]}")); pc += 1
        else: out.append((base+pc, f".byte 0x{op:02x}")); pc += 1
    return out

sample = bytes([0x55, 0x48, 0x89, 0xE5, 0x90, 0xE8, 0x00, 0x00, 0x00, 0x00, 0x5D, 0xC3])
for addr, asm in disas(sample):
    print(f"0x{addr:08x}: {asm}")
print("\\nThis is a function prologue (push rbp / mov rbp,rsp), nop, near call, epilogue.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Ghidra Workflow — The Canonical 12 Steps</h2>
<p class="l-text">When the NSA released Ghidra at RSA 2019, it was a generational gift. The recipe for a fresh sample:</p>

<ol style="line-height:1.7;padding-left:1.4rem">
<li><strong>New project</strong> → import binary → confirm format (PE/ELF/Mach-O auto-detected).</li>
<li><strong>Auto-analyze</strong>: enable Decompiler Parameter ID, Stack, Function ID, ASCII Strings, Demangle.</li>
<li><strong>Symbol Tree</strong>: find <code>main</code> (ELF), <code>WinMain</code>/<code>DllMain</code> (PE), or <code>start</code>.</li>
<li><strong>Listing view</strong>: read disassembly. <strong>Decompiler view</strong>: read C-like pseudocode.</li>
<li><strong>Rename</strong> functions (<code>L</code>) and variables to give meaning: <code>FUN_00401820</code> → <code>encrypt_files</code>.</li>
<li><strong>Retype</strong> variables (<code>Ctrl+L</code>): <code>undefined4 *</code> → <code>HANDLE</code>, makes Win32 calls human-readable.</li>
<li><strong>Comments</strong> (<code>;</code>) for non-obvious logic.</li>
<li><strong>Cross-references</strong> (<code>Ctrl+Shift+F</code>): "who calls this string?", "who writes this global?".</li>
<li><strong>Bookmarks</strong> for interesting addresses (entrypoint, anti-debug, decryption).</li>
<li><strong>Strings panel</strong> + cross-ref → C2 URLs, file paths, mutex names.</li>
<li><strong>Function Graph</strong> (mini-CFG) for any function with control-flow you don't grasp linearly.</li>
<li><strong>Script</strong> in Python (Jython 2.7) or Java for repetitive tasks: rename all <code>WinHttp*</code> calls, find every XOR loop, etc.</li>
</ol>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. P-Code — Ghidra's Secret Weapon</h2>
<p class="l-text">Ghidra's decompiler does not work on raw x86 — it lifts every instruction to <strong>P-Code</strong>, a small RISC-like intermediate language (~50 ops: <code>COPY</code>, <code>LOAD</code>, <code>STORE</code>, <code>INT_ADD</code>, <code>INT_SUB</code>, <code>BOOL_OR</code>, <code>CALL</code>, <code>BRANCH</code>, ...). Optimization, dataflow, and decompilation all run on P-Code. Because every architecture (x86, ARM, MIPS, PowerPC, RISC-V) lifts to the <em>same</em> P-Code, Ghidra's decompiler works uniformly across them — one of the open-source community's biggest wins from the 2019 release.</p>

<div class="calc-highlight">P-Code is also the right interface for <strong>headless analysis</strong> at scale: write Java/Python scripts that walk the P-Code AST of every function in a binary to find specific patterns (e.g., "every XOR-loop with a constant key", "every call to <code>VirtualAlloc</code> with PAGE_EXECUTE_READWRITE").</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Common Anti-RE Tricks and Counters</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Junk bytes / opaque predicates</div><div class="card-body">Insert never-taken branches with garbage in the not-taken path. Ghidra's CFG follows real edges; junk falls away.</div></div>
<div class="calc-card"><div class="card-title">Control-flow flattening</div><div class="card-body">Replace structured CFG with a giant switch dispatcher (Obfuscator-LLVM). Ghidra struggles; manual deobfuscation needed.</div></div>
<div class="calc-card"><div class="card-title">String encryption</div><div class="card-body">Strings XOR'd or AES'd, decrypted on demand. Trace the decrypt routine, script it in Ghidra to populate cleartext.</div></div>
<div class="calc-card"><div class="card-title">API hashing</div><div class="card-body">Instead of <code>GetProcAddress("CreateFileW")</code>, sample stores ROL13 hash of name and walks PEB to resolve. Compute hashes for full Win32 export set, match.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>x86_64 has 16 GP registers; learn aliases (RAX/EAX/AX/AL).</li>
<li>SysV ABI: args in RDI, RSI, RDX, RCX, R8, R9. Windows x64: RCX, RDX, R8, R9 + 32-byte shadow space.</li>
<li>30 mnemonics cover 95% of real malware. <code>xor reg,reg</code> = zeroing idiom.</li>
<li>Ghidra: free, NSA-grade, decompiler driven by P-Code IR.</li>
<li>Anti-RE tricks (CFG flattening, string crypto, API hashing) are scriptable in Ghidra Python.</li>
</ul>
</div>
<p class="l-text">Next, in <strong>forensics-L5</strong>, we leave the binary on disk and look at <em>memory</em> — Volatility, Rekall, LiME, FTK Imager — where unpacked code, injected payloads, and key material live.</p>
</div>`,
tr: `<p class="l-text"><strong>Tersine mühendislik, makine kodunu edebiyat olarak okuma eylemidir.</strong> L3'teki API günlükleri "örnek <code>CryptEncrypt</code>'i 481 kez çağırdı" dediğinde ama siz <em>hangi anahtarla, hangi dosyalarda, hangi sırada ve neden</em> bilmek zorunda olduğunuzda, tek yol ikiliye inip CPU'nun gerçekte yürüteceği talimatları okumaktır. O iniş endüstrileşmiştir: <strong>IDA Pro</strong> (Ilfak Guilfanov, 1991, uzun süredir kral), <strong>Binary Ninja</strong> (Vector 35, 2016), <strong>radare2 / Cutter</strong> (açık kaynak) ve en önemlisi <strong>Ghidra</strong> — NSA'nın kendi tersine mühendislik platformu, Mart 2019'da açık kaynak yapıldı, ücretsiz ve şimdi hem akademide hem sektörde standart.</p>

<p class="l-text">Bu derste birikim sağlayan iki beceriye odaklanıyoruz: <strong>x86_64 assembly</strong>'yi akıcılıkla okumak ve <strong>Ghidra'nın decompiler'ını</strong> bir koltuk değneği değil, bir kuvvet çarpanı olarak kullanmak. Yazmaçları ve çağırma sözleşmelerini (Linux/macOS için <strong>System V AMD64 ABI</strong>, Windows için <strong>Microsoft x64</strong>), prologue/epilogue örüntülerini, kontrol akışı yeniden yapılandırmasını (Ghidra'nın P-Code IR'si) ve kanonik iş akışını ele alıyoruz: yükle → analiz et → girişi tanımla → yeniden adlandır → yeniden tipler → yorumla → tekrarla.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>x86_64 assembly'yi okumak: GP yazmaçlar, koşul bayrakları, adresleme modları, en yaygın 30 mnemonik</li>
<li>Fonksiyon argümanlarını System V AMD64 (RDI, RSI, RDX, RCX, R8, R9) ve Windows x64 (RCX, RDX, R8, R9 + gölge alan) üzerinden takip etmek</li>
<li>Prologue'ları, epilogue'ları, yığın çerçevelerini ve kuyruk çağrılarını tanımak</li>
<li>Ghidra'yı sürmek: ikiliyi içe aktar, otomatik analizi çalıştır, fonksiyon listesinde dolaş, decompiler görünümünü kullan, değişkenleri yeniden tiplendir</li>
<li>P-Code'u (Ghidra'nın ara temsili) anlamak ve neden çapraz mimari analiz için doğru seviye olduğunu</li>
<li>Araçların ne yaptığını gizemden arındırmak için kendiniz küçük bir disassembler taslağı yazmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. x86_64 Yazmaç Dosyası</h2>
<p class="l-text">x86'nın 64-bit halefi (AMD tarafından <strong>AMD64 / x86-64</strong> olarak tasarlandı, 2003'te onaylandı), genel amaçlı yazmaç sayısını 8'den 16'ya çıkardı. Her biri 64 bit genişliğinde ve daha küçük görünümlere takma ad olur. Takma adları bilmek tartışılmazdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RAX, RBX, RCX, RDX</div><div class="card-body">Eski 8086 dörtlüsü. 64-bit RAX, 32-bit EAX, 16-bit AX, 8-bit AH/AL. RAX = sözleşmeye göre dönüş değeri.</div></div>
<div class="calc-card"><div class="card-title">RSI, RDI, RBP, RSP</div><div class="card-body">Source/dest index, base pointer, stack pointer. RSP her zaman yığının tepesini gösterir. Optimize edilmiş kodda RBP isteğe bağlıdır.</div></div>
<div class="calc-card"><div class="card-title">R8 – R15</div><div class="card-body">AMD64 eklemeleri. Alt görünümler: R8D (32), R8W (16), R8B (8). SysV ABI tarafından argüman geçirme için yoğun kullanılır.</div></div>
<div class="calc-card"><div class="card-title">RIP</div><div class="card-body">Talimat işaretçisi. RIP-relatif adresleme (<code>mov rax, [rip+0x1234]</code>) x86_64'te PIC kodu için varsayılandır.</div></div>
<div class="calc-card"><div class="card-title">RFLAGS</div><div class="card-body">Durum: ZF (zero), SF (sign), CF (carry), OF (overflow), PF (parity). Aritmetik tarafından ayarlanır, <code>jcc</code> tarafından tüketilir.</div></div>
<div class="calc-card"><div class="card-title">XMM0 – XMM15</div><div class="card-body">128-bit SSE/AVX. Float'lar (<code>movss</code>, <code>mulsd</code>) ve SIMD için kullanılır. AVX-512 ZMM'ye (512 bit) uzanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Çağırma Sözleşmeleri — Argümanlarım Nerede?</h2>
<p class="l-text">Vahşi doğada iki x86_64 ABI vardır ve hangisinde olduğunuzu unutmak yeni reverser'ların 1 numaralı hatasıdır.</p>

<div class="calc-highlight"><strong>System V AMD64 ABI</strong> (Linux, macOS, BSD): tamsayı/işaretçi argümanlar 1–6 <code>RDI, RSI, RDX, RCX, R8, R9</code>'da. Float'lar <code>XMM0–XMM7</code>'de. Dönüş <code>RAX</code>'te (ve 128-bit için <code>RDX</code>). Çağıran yığını temizler. <strong>Kırmızı bölge</strong>: yaprak fonksiyonlar RSP'yi ayarlamadan altındaki 128 baytı kullanabilir.</div>

<div class="calc-highlight"><strong>Microsoft x64 ABI</strong> (Windows): tamsayı argümanlar 1–4 <code>RCX, RDX, R8, R9</code>'da. Çağıran, argüman sayısından bağımsız olarak yığında <strong>32 bayt gölge alanı</strong> ayırmalıdır. Dönüş <code>RAX</code>'te. Kırmızı bölge yok.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden önemli</div><div class="card-body">"Bu hangi dosyayı açıyor?" okurken, Linux'ta RDI'ye, Windows'ta RCX'e bakarsınız. Bunu yanlış yapın, IoC'niz çöp olur.</div></div>
<div class="calc-card"><div class="card-title">Variadik fonksiyonlar</div><div class="card-body">SysV: AL kullanılan XMM argüman sayısını tutar. Windows: hâlâ RCX/RDX/R8/R9 sonra yığını kullanır.</div></div>
<div class="calc-card"><div class="card-title">Callee-saved</div><div class="card-body">SysV: RBX, RBP, R12–R15. Windows: ayrıca RDI, RSI. Fonksiyon onları epilogue'da geri yüklemelidir.</div></div>
<div class="calc-card"><div class="card-title">32-bit'te __fastcall</div><div class="card-body">Farklı bir canavar — ECX, EDX sonra yığın. Eski Windows zararlı yazılımı için önemli (uyumluluk için 2026 droplerlerinde hâlâ yaygın).</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Prologue, Epilogue, Yığın Çerçevesi</h2>
<p class="l-text">x86_64'te yaprak olmayan bir fonksiyonun iskeleti milisaniyelerde tanınır:</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Kanonik x86_64 SysV fonksiyonu (bağlam için Python dizgisi olarak gösterilen pseudo-asm)
prologue = """
push    rbp                 ; eski çerçeve işaretçisini kaydet
mov     rbp, rsp            ; yeni çerçeve işaretçisi = mevcut yığın işaretçisi
sub     rsp, 0x30           ; 0x30 bayt yerel için ayır
mov     [rbp-0x08], rdi     ; arg1'i yerele dök
mov     [rbp-0x10], rsi     ; arg2'yi yerele dök
"""
body = "; ... function body ..."
epilogue = """
mov     rax, [rbp-0x18]     ; dönüş değerini RAX'e yükle
add     rsp, 0x30           ; yerelleri serbest bırak
pop     rbp                 ; eski çerçeve işaretçisini geri yükle
ret                         ; çağırana dön
"""
print(prologue + body + epilogue)
</code></pre></div>

<p class="l-text">Modern derleyiciler genellikle <em>RBP'yi atlar</em> (frame-pointer omission, <code>-fomit-frame-pointer</code>) ve her şeyi RSP'den adresler. Ghidra çerçeveyi her durumda yeniden yapılandırır. Kuyruk çağrıları (<code>call foo; ret</code> yerine <code>jmp foo</code>) optimize edilmiş release derlemelerinde yaygındır ve naif disassembler'ları şaşırtır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Önemli 30 Mnemonik</h2>
<p class="l-text">Her SIMD kodlamasını sayarsanız x86_64'te &gt;1500 talimat vardır. Pratikte zararlı yazılımın %95'i 30 tane kullanır. Bu listeyi ezberleyin, herhangi bir örneğin sıcak yolunu okuyabilirsiniz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Veri hareketi</div><div class="card-body"><code>mov, lea, push, pop, xchg, movsx, movzx</code></div></div>
<div class="calc-card"><div class="card-title">Aritmetik / mantık</div><div class="card-body"><code>add, sub, imul, idiv, inc, dec, neg, and, or, xor, not, shl, shr, sar, rol, ror</code></div></div>
<div class="calc-card"><div class="card-title">Kontrol akışı</div><div class="card-body"><code>jmp, call, ret, je, jne, jz, jnz, jg, jl, jge, jle, ja, jb, loop</code></div></div>
<div class="calc-card"><div class="card-title">Karşılaştırma</div><div class="card-body"><code>cmp, test, setcc</code> — <code>test rax, rax</code> ardından <code>jz</code> her yerde olan null-check örüntüsüdür.</div></div>
</div>

<div class="calc-highlight"><code>xor reg, reg</code> kanonik sıfırlama deyimidir — <code>mov reg, 0</code>'dan kısa ve bağımlılık zincirlerini kırar. Fonksiyon başlangıcında <code>xor eax, eax</code> gördüğünüzde neredeyse her zaman "dönüş = 0 ayarla" demektir.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Oyuncak Bir Disassembler Yazma</h2>
<p class="l-text">Ghidra ve IDA'nın ne yaptığını gizemden arındırmak için, bir avuç x86 opcode'u elle çöz. Gerçek motorlar (Capstone, Zydis) 1500+ talimat ve önek işler; bu taslak bir parça işler ama prensibi kanıtlar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Küçük x86_64 opcode çözücü — sadece tek baytlı opcode'lar, önek/ModRM yok
OPCODES = {
  0x50: ("push","rax"), 0x51: ("push","rcx"), 0x52: ("push","rdx"), 0x53: ("push","rbx"),
  0x54: ("push","rsp"), 0x55: ("push","rbp"), 0x56: ("push","rsi"), 0x57: ("push","rdi"),
  0x58: ("pop","rax"),  0x59: ("pop","rcx"),  0x5A: ("pop","rdx"),  0x5B: ("pop","rbx"),
  0x5D: ("pop","rbp"),
  0x90: ("nop",""),
  0xC3: ("ret",""),
  0xCC: ("int3",""),
}
def disas(buf, base=0x401000):
    pc, out = 0, []
    while pc &lt; len(buf):
        op = buf[pc]
        if op == 0x48 and pc+2 &lt; len(buf) and buf[pc+1] == 0x89:
            out.append((base+pc, "mov r/m64, r64 (REX.W)")); pc += 3; continue
        if op == 0xE8 and pc+5 &lt;= len(buf):
            disp = int.from_bytes(buf[pc+1:pc+5],"little",signed=True)
            tgt = base + pc + 5 + disp
            out.append((base+pc, f"call 0x{tgt:x}")); pc += 5; continue
        m = OPCODES.get(op)
        if m: out.append((base+pc, f"{m[0]:6s} {m[1]}")); pc += 1
        else: out.append((base+pc, f".byte 0x{op:02x}")); pc += 1
    return out

sample = bytes([0x55, 0x48, 0x89, 0xE5, 0x90, 0xE8, 0x00, 0x00, 0x00, 0x00, 0x5D, 0xC3])
for addr, asm in disas(sample):
    print(f"0x{addr:08x}: {asm}")
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>OPCODES</code>, tek-baytlık x86_64 opcode'ları mnemonic + operand çiftlerine eşleyen düz bir dict — <code>0x50..0x57</code> aralığı <code>push reg</code>, <code>0x58..0x5F</code> <code>pop reg</code>, artı temel <code>nop</code>, <code>ret</code>, <code>int3</code>. 2) <code>disas()</code> bir program-counter <code>pc</code> ile buffer'ı gezer; önce iki çok-baytlı durumu işler: <code>0x48 0x89 ...</code> (REX.W <code>mov r/m64, r64</code>) 3 bayt ilerler, <code>0xE8 disp32</code> (near <code>call</code>) işaretli 32-bit displacement okur, <code>tgt = base + pc + 5 + disp</code>'i hesaplar ve çözülmüş hedefi yazdırır. 3) Tek-baytlık tabloya geri düşer; bilinmeyen baytlar <code>.byte 0xNN</code> olur — <code>capstone</code> gibi gerçek motorların kullandığı aynı kurtarma stratejisi. 4) Ders kitabındaki fonksiyon prologue'unu (<code>push rbp; mov rbp, rsp; nop; call $+0; pop rbp; ret</code>) kodlayan 12 baytlık bir buffer üzerinde çalışır ve her <code>0xADDR: instr</code> satırını IDA'nın listing view'i gibi yazdırır.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide karşılığı (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı oyuncak disassembler, saf Python, her yerde çalışır. Bir fonksiyon prologue + nop + call + epilogue çözer.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>OPCODES = {
  0x50:("push","rax"),0x55:("push","rbp"),0x5D:("pop","rbp"),
  0x90:("nop",""),0xC3:("ret",""),0xCC:("int3",""),
}
def disas(buf, base=0x401000):
    pc, out = 0, []
    while pc &lt; len(buf):
        op = buf[pc]
        if op == 0x48 and pc+2 &lt; len(buf) and buf[pc+1] == 0x89:
            out.append((base+pc, "mov r/m64, r64 (REX.W)")); pc += 3; continue
        if op == 0xE8 and pc+5 &lt;= len(buf):
            disp = int.from_bytes(buf[pc+1:pc+5],"little",signed=True)
            tgt = base + pc + 5 + disp
            out.append((base+pc, f"call 0x{tgt:x}")); pc += 5; continue
        m = OPCODES.get(op)
        if m: out.append((base+pc, f"{m[0]:6s} {m[1]}")); pc += 1
        else: out.append((base+pc, f".byte 0x{op:02x}")); pc += 1
    return out

sample = bytes([0x55, 0x48, 0x89, 0xE5, 0x90, 0xE8, 0x00, 0x00, 0x00, 0x00, 0x5D, 0xC3])
for addr, asm in disas(sample):
    print(f"0x{addr:08x}: {asm}")
print("\\nBu bir fonksiyon prologue (push rbp / mov rbp,rsp), nop, near call, epilogue.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Ghidra İş Akışı — Kanonik 12 Adım</h2>
<p class="l-text">NSA Ghidra'yı 2019 RSA'da yayımladığında, kuşaklar arası bir armağandı. Yeni bir örnek için tarif:</p>

<ol style="line-height:1.7;padding-left:1.4rem">
<li><strong>Yeni proje</strong> → ikiliyi içe aktar → formatı onayla (PE/ELF/Mach-O otomatik tespit edilir).</li>
<li><strong>Auto-analyze</strong>: Decompiler Parameter ID, Stack, Function ID, ASCII Strings, Demangle'ı etkinleştir.</li>
<li><strong>Symbol Tree</strong>: <code>main</code> (ELF), <code>WinMain</code>/<code>DllMain</code> (PE) veya <code>start</code>'ı bul.</li>
<li><strong>Listing view</strong>: disassembly oku. <strong>Decompiler view</strong>: C benzeri pseudocode oku.</li>
<li><strong>Yeniden adlandır</strong> fonksiyonları (<code>L</code>) ve değişkenleri anlam vermek için: <code>FUN_00401820</code> → <code>encrypt_files</code>.</li>
<li><strong>Yeniden tipler</strong> değişkenleri (<code>Ctrl+L</code>): <code>undefined4 *</code> → <code>HANDLE</code>, Win32 çağrılarını insanca okunabilir kılar.</li>
<li><strong>Yorumlar</strong> (<code>;</code>) belirgin olmayan mantık için.</li>
<li><strong>Çapraz referanslar</strong> (<code>Ctrl+Shift+F</code>): "bu dizgiyi kim çağırıyor?", "bu global'i kim yazıyor?".</li>
<li><strong>Yer imleri</strong> ilginç adresler için (giriş noktası, anti-debug, şifre çözme).</li>
<li><strong>Strings paneli</strong> + çapraz referans → C2 URL'leri, dosya yolları, mutex isimleri.</li>
<li><strong>Function Graph</strong> (mini-CFG) doğrusal olarak kavrayamadığınız kontrol akışlı herhangi bir fonksiyon için.</li>
<li><strong>Script</strong> tekrarlı görevler için Python'da (Jython 2.7) veya Java'da: tüm <code>WinHttp*</code> çağrılarını yeniden adlandır, her XOR döngüsünü bul vb.</li>
</ol>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. P-Code — Ghidra'nın Gizli Silahı</h2>
<p class="l-text">Ghidra'nın decompiler'ı ham x86 üzerinde çalışmaz — her talimatı <strong>P-Code</strong>'a kaldırır, küçük RISC benzeri ara dil (~50 op: <code>COPY</code>, <code>LOAD</code>, <code>STORE</code>, <code>INT_ADD</code>, <code>INT_SUB</code>, <code>BOOL_OR</code>, <code>CALL</code>, <code>BRANCH</code>, ...). Optimizasyon, dataflow ve decompilation hepsi P-Code üzerinde çalışır. Her mimari (x86, ARM, MIPS, PowerPC, RISC-V) <em>aynı</em> P-Code'a kaldırıldığı için, Ghidra'nın decompiler'ı bunlar üzerinde tek tip çalışır — açık kaynak topluluğunun 2019 sürümünden en büyük kazançlarından biri.</p>

<div class="calc-highlight">P-Code ayrıca ölçekte <strong>başsız analiz</strong> için doğru arayüzdür: bir ikilideki her fonksiyonun P-Code AST'sini gezerek belirli örüntüleri (ör. "sabit anahtarlı her XOR-döngüsü", "PAGE_EXECUTE_READWRITE ile her <code>VirtualAlloc</code> çağrısı") bulan Java/Python betikleri yazın.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Yaygın Anti-RE Hileleri ve Karşı Önlemler</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çöp baytlar / opak yüklemler</div><div class="card-body">Alınmayan yolda çöp olan asla alınmayan dallar ekle. Ghidra'nın CFG'si gerçek kenarları takip eder; çöp düşer.</div></div>
<div class="calc-card"><div class="card-title">Kontrol akışı düzleştirme</div><div class="card-body">Yapılandırılmış CFG'yi devasa bir switch dispatcher ile değiştir (Obfuscator-LLVM). Ghidra zorlanır; manuel deobfuscation gerekir.</div></div>
<div class="calc-card"><div class="card-title">Dizgi şifreleme</div><div class="card-body">Dizgiler XOR'lanmış veya AES'lenmiş, talep üzerine çözülmüş. Çözme rutinini izle, Ghidra'da betikle açık metni doldur.</div></div>
<div class="calc-card"><div class="card-title">API hash'leme</div><div class="card-body"><code>GetProcAddress("CreateFileW")</code> yerine, örnek isim ROL13 hash'ini saklar ve çözmek için PEB'i yürür. Tüm Win32 export seti için hash'leri hesapla, eşleştir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet &amp; Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 TEMEL ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>x86_64'te 16 GP yazmaç var; takma adları öğren (RAX/EAX/AX/AL).</li>
<li>SysV ABI: argümanlar RDI, RSI, RDX, RCX, R8, R9'da. Windows x64: RCX, RDX, R8, R9 + 32-bayt gölge alanı.</li>
<li>30 mnemonik gerçek zararlı yazılımın %95'ini kapsar. <code>xor reg,reg</code> = sıfırlama deyimi.</li>
<li>Ghidra: ücretsiz, NSA kalitesinde, P-Code IR sürücülü decompiler.</li>
<li>Anti-RE hileleri (CFG düzleştirme, dizgi kriptosu, API hash'leme) Ghidra Python'da betiklenebilir.</li>
</ul>
</div>
<p class="l-text">Sırada, <strong>forensics-L5</strong>'te, ikiliyi diskte bırakıp <em>belleğe</em> bakıyoruz — Volatility, Rekall, LiME, FTK Imager — paketsiz kodun, enjekte edilmiş yüklerin ve anahtar materyalin yaşadığı yer.</p>
</div>`
};
