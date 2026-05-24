window.CRYPTO_L10 = {
en: `<p class="l-text"><strong>Side-channel attacks recover secrets from the physical execution of a cryptosystem, not from the mathematics.</strong> Paul Kocher's 1996 paper "Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems" was a wake-up call: a perfectly secure cipher whose modular exponentiation runs in non-constant time leaks the private key over a network. Two years later Kocher, Jaffe, and Jun published Differential Power Analysis (DPA), recovering DES keys from a smartcard's power trace. Twenty-two years later, in January 2018, Spectre and Meltdown showed that the speculative execution machinery of every modern CPU is itself a side channel — affecting Intel, AMD, ARM, IBM POWER simultaneously, requiring kernel patches and microcode updates across the entire industry.</p>

<p class="l-text">This capstone walks the full landscape: timing attacks (Kocher 1996, Brumley-Boneh 2003 against OpenSSL RSA over the network, Lucky 13 against TLS-CBC 2013), power analysis (DPA, CPA, template attacks on AES smartcards), electromagnetic side-channels (TEMPEST, the EU's 2019 ECCploit), cache attacks (Flush+Reload by Yarom-Falkner 2014, Prime+Probe), and the speculative-execution family (Spectre, Meltdown, Foreshadow, MDS, Downfall 2023, Reptar 2023). We close with the engineering hygiene that fixes them: <strong>constant-time coding</strong> and the audit tools (ctgrind, dudect, MicroWalk) every crypto engineer must use.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Run a hands-on timing attack distinguishing two if-branches with statistical confidence</li>
<li>Recognize DPA / CPA on AES: the Hamming-weight power model, key-byte-by-byte recovery</li>
<li>Distinguish cache attacks: Flush+Reload (shared memory), Prime+Probe (cross-core), Evict+Reload</li>
<li>Read Spectre v1 / Meltdown / MDS attack chains and the kernel mitigations (KPTI, retpoline, IBPB)</li>
<li>Write constant-time code: no secret-dependent branches, indices, or memory access patterns</li>
<li>Audit with ctgrind / dudect / MicroWalk — the tools that catch leaks before deploy</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Kocher 1996 — The Original Timing Attack</h2>
<p class="l-text">Paul Kocher's 1996 paper noticed that RSA's modular exponentiation, implemented with the square-and-multiply algorithm, performs an extra multiplication when the current key bit is 1. If the multiplication takes a measurable time difference, an attacker timing many decryptions of chosen ciphertexts can recover the private key bit by bit. Kocher demonstrated 512-bit RSA recovered in minutes. The fix: <strong>Montgomery ladders</strong>, where every key bit performs the same operations (square + multiply), branch-free.</p>

<div class="calc-highlight"><strong>Brumley &amp; Boneh 2003</strong> showed timing attacks work over the network — they recovered an OpenSSL RSA private key from a server on a different LAN, using only TLS handshake timings. Median ~1 ms timing difference per key bit, 350k handshakes total. The OpenSSL response: ship "RSA blinding" by default. Lucky 13 (AlFardan-Paterson 2013) extended the technique to TLS CBC-mode MAC verification, recovering plaintext bytes from the timing of HMAC validation.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy timing attack: a "secret" PIN check returns early on the first wrong digit. We measure perf_counter timings and recover the secret digit-by-digit.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> time, statistics, secrets, numpy <span class="kw">as</span> np

<span class="cm"># Target: a length-6 numeric PIN.  Vulnerable check returns early on first mismatch.</span>
SECRET = <span class="str">'472913'</span>

<span class="kw">def</span> <span class="fn">vulnerable_check</span>(guess):
    <span class="kw">for</span> g, s <span class="kw">in</span> <span class="fn">zip</span>(guess, SECRET):
        <span class="kw">if</span> g != s:
            <span class="kw">return</span> <span class="kw">False</span>
        <span class="cm"># Simulate a per-digit comparison cost</span>
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
            <span class="kw">pass</span>
    <span class="kw">return</span> <span class="kw">True</span>

<span class="kw">def</span> <span class="fn">time_check</span>(guess, trials=<span class="num">400</span>):
    times = []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(trials):
        t0 = time.<span class="fn">perf_counter</span>()
        <span class="fn">vulnerable_check</span>(guess)
        times.<span class="fn">append</span>(time.<span class="fn">perf_counter</span>() - t0)
    <span class="kw">return</span> statistics.<span class="fn">median</span>(times)

<span class="cm"># Recover digit-by-digit</span>
recovered = <span class="str">''</span>
<span class="kw">for</span> pos <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(SECRET)):
    best_digit, best_time = <span class="kw">None</span>, -<span class="num">1</span>
    <span class="kw">for</span> d <span class="kw">in</span> <span class="str">'0123456789'</span>:
        guess = recovered + d + <span class="str">'0'</span> * (<span class="fn">len</span>(SECRET) - pos - <span class="num">1</span>)
        t = <span class="fn">time_check</span>(guess)
        <span class="kw">if</span> t &gt; best_time:
            best_time, best_digit = t, d
    recovered += best_digit
    <span class="fn">print</span>(f<span class="str">'position {pos}: recovered <span class="str">"{recovered}"</span>  median time {best_time*1e6:.1f} μs'</span>)

<span class="fn">print</span>(f<span class="str">'\\nrecovered PIN: {recovered}  (real: {SECRET})'</span>)

<span class="cm"># Mitigation: hmac.compare_digest does constant-time comparison.</span>
<span class="cm"># Crypto rule: never branch on secret bytes.</span>
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a textbook vulnerable comparator: <code>vulnerable_check</code> returns early on the first mismatched digit but burns ~2000 spin iterations per matched digit — exactly the same timing shape as <code>memcmp</code> on a secret token or pre-Kocher RSA square-and-multiply. 2) <code>time_check</code> runs 400 trials per guess and takes the <em>median</em> — median is critical because Python's <code>perf_counter</code> on a busy laptop has 1-2 μs jitter from GC and OS scheduling, exactly the noise floor Brumley-Boneh 2003 had to filter through to recover an OpenSSL key over a LAN. 3) The outer loop fixes digits one at a time: for each position it tries digits 0-9, keeps the one whose median timing is highest (because matching more digits before the mismatch means more spin iterations executed before the early return) — this is the canonical "extend-then-extend" digit recovery Kocher demonstrated against RSA in 1996. 4) After six positions the recovered string equals <code>SECRET = '472913'</code> exactly; the fix is <code>hmac.compare_digest(guess, secret)</code> which iterates the full length regardless of mismatch position — same constant-time pattern OpenSSL adopted post-Brumley-Boneh and that every modern crypto API (libsodium, NaCl, ring-rs) bakes in.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Power Analysis — DPA, CPA, Template Attacks</h2>
<p class="l-text">Kocher-Jaffe-Jun 1998 introduced <strong>Differential Power Analysis (DPA)</strong>. Hook an oscilloscope to a smartcard's power line, record the trace as it encrypts. The Hamming weight of the AES S-box output correlates linearly with instantaneous current draw. Sort traces into two bins (HW = 0 vs HW high) for each key-byte guess; the right guess shows a clear difference; the wrong guesses look like noise. Recover all 16 AES key bytes independently — total work ~16 · 2^8 = 4096 hypotheses, trivial.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SPA (Simple Power Analysis)</div><div class="card-body">Read the key directly from a single trace by spotting visible patterns (e.g. RSA square vs square-and-multiply). Naïve square-and-multiply implementations leak the entire key in one trace.</div></div>
<div class="calc-card"><div class="card-title">DPA</div><div class="card-body">Statistical attack over many traces. Difference of means between bins for a key hypothesis. Standard against any implementation that lacks randomization.</div></div>
<div class="calc-card"><div class="card-title">CPA (Correlation Power Analysis)</div><div class="card-body">Brier-Clavier-Olivier 2004. Pearson correlation between trace samples and a power model (Hamming weight of intermediate values). More robust than DPA, fewer traces.</div></div>
<div class="calc-card"><div class="card-title">Template attacks</div><div class="card-body">Profile a clone device with known keys to build per-byte-value templates, then match a target's trace. Most powerful but requires physical access to a clone.</div></div>
<div class="calc-card"><div class="card-title">Mitigations</div><div class="card-body">Boolean / arithmetic masking (split intermediates into random shares), hiding (constant power balance), shuffle the round order, dummy operations. Smartcard chips (Infineon SLE, NXP P5) ship with multiple hardware countermeasures.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Electromagnetic and Acoustic — TEMPEST and Beyond</h2>
<p class="l-text">Power analysis assumes physical access to a wire; <strong>electromagnetic side-channels</strong> work at distance. The NSA's TEMPEST program (declassified partially in 2007) covers EM emanations from CRT monitors, cables, and processors that can be reconstructed from across a room. Modern attacks are wilder:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">EM at distance</div><div class="card-body">Genkin-Pipman-Tromer 2014 recovered RSA keys from a laptop's chassis-EM emissions using a smartphone in a nearby room. Cheap radio + a few minutes of capture.</div></div>
<div class="calc-card"><div class="card-title">Acoustic</div><div class="card-body">Genkin-Shamir-Tromer 2013 ("RSA Key Extraction via Low-Bandwidth Acoustic Cryptanalysis"): a parabolic microphone listens to capacitor whine while GnuPG decrypts. Recovers 4096-bit RSA in ~1 hour.</div></div>
<div class="calc-card"><div class="card-title">Cold boot</div><div class="card-body">Halderman et al. 2008. Freeze RAM with canned air, dump within 30 seconds → AES keys recoverable from kernel memory. Used in real forensics.</div></div>
<div class="calc-card"><div class="card-title">Optical</div><div class="card-body">Loughry-Umphress 2002, Backes 2008: LED activity lights leak indicator-correlated data. Modern variant: HDD blink leaks file-access patterns to a camera in a window.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Cache Attacks — Flush+Reload, Prime+Probe</h2>
<p class="l-text">A cache hit takes ~4 ns; a miss ~100 ns. If two processes share a CPU cache (and many do, in a cloud VM colocated on the same physical core) one can detect the other's access patterns. Yarom-Falkner 2014's <strong>Flush+Reload</strong> spies across cores via shared L3 cache. Steps: (1) <code>clflush</code> a target memory line; (2) wait; (3) reload it and time. Fast = victim accessed it; slow = victim did not.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Flush+Reload</div><div class="card-body">Requires shared memory (deduped libraries, KSM in KVM). Spy detects victim's table-lookup positions in AES T-tables → recover key. OpenSSL 1.0.1f recovered across cloud tenants in 2014.</div></div>
<div class="calc-card"><div class="card-title">Prime+Probe</div><div class="card-body">No shared memory needed. Spy fills cache set, victim runs, spy re-times own accesses; evicted lines = victim accessed that set. Works across-VM, across-tenant. Used in real cross-tenant key extraction in 2015.</div></div>
<div class="calc-card"><div class="card-title">Evict+Reload, Flush+Flush</div><div class="card-body">Variants for stealthier or no-clflush environments. Rowhammer can also amplify cache-attack precision.</div></div>
<div class="calc-card"><div class="card-title">Defense</div><div class="card-body">Constant-time table lookups (no secret-indexed memory). AES-NI on Intel/AMD hardware avoids T-tables entirely. ChaCha20 has no S-box → no cache-timing leak by design.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Simulate Flush+Reload as a noisy timing channel: hits are short, misses are long, statistics separate them.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">11</span>)

HIT_NS,  HIT_SD  = <span class="num">4.0</span>,  <span class="num">0.5</span>
MISS_NS, MISS_SD = <span class="num">100.0</span>, <span class="num">8.0</span>

<span class="cm"># Victim's secret access pattern: 1 = accessed (causes hit), 0 = not</span>
secret = np.random.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, <span class="num">16</span>)  <span class="cm"># 16 cache lines</span>

<span class="kw">def</span> <span class="fn">measure</span>(line_accessed_by_victim, n=<span class="num">200</span>):
    <span class="cm"># Spy reloads after victim. Hits if victim brought it in.</span>
    <span class="kw">if</span> line_accessed_by_victim:
        <span class="kw">return</span> np.random.<span class="fn">normal</span>(HIT_NS, HIT_SD, n)
    <span class="kw">return</span> np.random.<span class="fn">normal</span>(MISS_NS, MISS_SD, n)

recovered = []
<span class="kw">for</span> line_idx <span class="kw">in</span> <span class="fn">range</span>(<span class="num">16</span>):
    samples = <span class="fn">measure</span>(secret[line_idx])
    median  = np.<span class="fn">median</span>(samples)
    recovered.<span class="fn">append</span>(<span class="num">1</span> <span class="kw">if</span> median &lt; <span class="num">50</span> <span class="kw">else</span> <span class="num">0</span>)

<span class="fn">print</span>(<span class="str">'secret pattern:    '</span>, secret.<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">'recovered pattern: '</span>, recovered)
<span class="fn">print</span>(<span class="str">'match:'</span>, np.<span class="fn">array_equal</span>(secret, recovered))

<span class="cm"># In a real attack each "line" corresponds to a 64-byte chunk of an AES T-table.</span>
<span class="cm"># The victim's lookup index (=key XOR plaintext byte) reveals one byte of secret state.</span>
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets <code>HIT_NS=4, MISS_NS=100</code> with small Gaussian noise — these are the measured L1-hit vs main-memory-miss latencies on modern x86, the exact timing gap Yarom-Falkner 2014's Flush+Reload exploits to spy on shared cache lines across processes or VMs. 2) <code>secret</code> is a random 16-bit access pattern simulating which 64-byte AES T-table cache lines the victim touched — each "1" represents a key-dependent T-table lookup that the spy wants to detect, exactly the OpenSSL 1.0.1f leak Irazoqui et al. weaponized for cross-tenant key extraction in 2014. 3) <code>measure(line_accessed)</code> draws 200 noisy samples per line: hit-distribution when the victim accessed it, miss-distribution otherwise — averaging defeats the per-sample noise that real Flush+Reload sees from prefetchers, TLB pressure, and DRAM-row-buffer effects. 4) Taking the median and thresholding at 50 ns reliably recovers all 16 bits — the printed <code>match: True</code> shows even cheap statistics extract the secret cleanly, which is why <em>constant-time table-free</em> AES (AES-NI on Intel/AMD, or ChaCha20-Poly1305 by design) is mandatory in any code running in shared-tenant environments.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Spectre and Meltdown — January 2018</h2>
<p class="l-text">On 3 January 2018 the embargo broke: every Intel CPU since 1995, every AMD, every ARM Cortex-A had a fundamental side channel via <strong>speculative execution</strong>. Kocher (again!), Horn (Google Project Zero), Lipp et al. published Spectre and Meltdown. The CPU speculatively executes past a bounds-check or privilege boundary, the speculation is rolled back, but its <em>cache footprint</em> is not — and Flush+Reload reads the secret out of that footprint.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Meltdown (CVE-2017-5754)</div><div class="card-body">Reads kernel memory from userspace. Intel-only (mostly). Fixed by KPTI / KAISER — separate page tables for user vs kernel. ~5-30% syscall overhead.</div></div>
<div class="calc-card"><div class="card-title">Spectre v1 (CVE-2017-5753)</div><div class="card-body">Bounds-check bypass via branch predictor. Universal (Intel/AMD/ARM). Mitigation: <code>lfence</code> after bounds check; compiler insertion via <code>-mspeculative-load-hardening</code>.</div></div>
<div class="calc-card"><div class="card-title">Spectre v2 (CVE-2017-5715)</div><div class="card-body">Branch target injection across processes. Mitigation: retpoline (return-trampoline), IBRS / IBPB / STIBP microcode features. Costly: ~3-10% on indirect-call-heavy workloads.</div></div>
<div class="calc-card"><div class="card-title">Foreshadow / L1TF (Aug 2018)</div><div class="card-body">Reads SGX enclave memory + cross-VM memory via L1 cache. Fixed via L1D flush on context switch; eliminates SGX confidentiality on affected CPUs.</div></div>
<div class="calc-card"><div class="card-title">MDS / Zombieload (May 2019)</div><div class="card-body">Reads from line-fill buffers across SMT siblings. Fix: disable hyperthreading or apply MDS-clear microcode. Hyperthreading-off cost: ~30%.</div></div>
<div class="calc-card"><div class="card-title">Downfall, Reptar (2023)</div><div class="card-body">AVX gather-instruction leakage on Intel; Reptar tickles a microcode bug to leak across hyperthreading. Microcode patches Aug-Nov 2023.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Constant-Time Coding — The Defense</h2>
<p class="l-text">If the secret never affects timing, branching, or memory-access patterns, side-channel attacks on the algorithmic structure go away. The rules:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">No secret-dependent branches</div><div class="card-body"><code>if (secret_byte == 0) ... else ...</code> is a leak. Use <code>x = a ^ ((-mask) &amp; (a ^ b))</code> or compiler-supported constant-time select.</div></div>
<div class="calc-card"><div class="card-title">No secret-dependent indices</div><div class="card-body">AES T-table[secret] is a cache-timing leak. Read every entry and constant-time-select. Or use AES-NI / VAES hardware.</div></div>
<div class="calc-card"><div class="card-title">No secret-dependent loop bounds</div><div class="card-body">Always loop the same number of iterations; branch on a "done" flag without short-circuit.</div></div>
<div class="calc-card"><div class="card-title">No secret-dependent variable-time ops</div><div class="card-body">CPU integer division, BMI2 PEXT, some SIMD instructions vary in latency by data. Use addition / XOR / fixed-shift only.</div></div>
<div class="calc-card"><div class="card-title">Memory comparisons</div><div class="card-body">Use <code>hmac.compare_digest</code> in Python, <code>CRYPTO_memcmp</code> in OpenSSL, <code>subtle.ConstantTimeCompare</code> in Go. Never <code>==</code> on secrets.</div></div>
<div class="calc-card"><div class="card-title">Compiler / CPU surprises</div><div class="card-body">Compilers can re-introduce branches via optimization. The <code>volatile</code> keyword, fence intrinsics, and explicit assembly may be needed for high-assurance code.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Audit Tools — ctgrind, dudect, MicroWalk</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ctgrind (Langley 2010)</div><div class="card-body">Valgrind-based: marks secrets as "uninitialized," any branch / index / load on them is flagged. The default for libsodium, BoringSSL CI.</div></div>
<div class="calc-card"><div class="card-title">dudect (Reparaz et al. 2017)</div><div class="card-body">Statistical: feed two distributions of inputs (fixed vs random) and Welch's t-test on timings. If t-statistic exceeds a threshold the implementation is non-constant-time. Black-box.</div></div>
<div class="calc-card"><div class="card-title">MicroWalk (Wichelmann et al. 2018+)</div><div class="card-body">Dynamic binary instrumentation, leakage analysis from Intel Pin traces. Catches micro-architectural leakage, not just C-level branches.</div></div>
<div class="calc-card"><div class="card-title">Formal: Jasmin, Cryptol, FaCT</div><div class="card-body">Domain-specific languages with constant-time guarantees built in. AWS-LC, BoringSSL Curve25519, libsignal use these for the hottest paths.</div></div>
</div>

<div class="calc-highlight"><strong>Industry standard:</strong> any new crypto code at Cloudflare, Google, AWS, Apple, Meta goes through ctgrind or dudect in CI before merge. New constant-time bugs in OpenSSL, Bouncy Castle, mbedTLS still surface every year — vigilance is permanent.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Real-World CVEs — Known Side-Channel Breaks</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">CVE-2003-0147 (OpenSSL RSA timing)</div><div class="card-body">Brumley-Boneh attack against Apache+mod_ssl. RSA key recoverable across LAN. Fix: enable RSA blinding by default.</div></div>
<div class="calc-card"><div class="card-title">CVE-2013-0169 (Lucky 13)</div><div class="card-body">TLS-CBC HMAC verification was non-constant-time. Recovered ~16 plaintext bytes per ~2^23 connections. Killed CBC in TLS, accelerated AEAD adoption.</div></div>
<div class="calc-card"><div class="card-title">CVE-2018-5407 (PortSmash)</div><div class="card-body">SMT-based port-contention side channel. Recovered Intel SGX P-256 ECDSA keys. Mitigation: disable SMT for crypto enclaves.</div></div>
<div class="calc-card"><div class="card-title">CVE-2023-22655 (Downfall)</div><div class="card-body">AVX gather instruction leaks across same-core SMT. Affects Skylake-Tiger Lake Intel CPUs. Microcode patch August 2023.</div></div>
<div class="calc-card"><div class="card-title">CVE-2022-24675 (Hertzbleed)</div><div class="card-body">DVFS frequency scaling depends on power consumption depends on data. Remote-timing attack on SIKE / classical crypto. Mitigation: disable Turbo Boost or use power-uniform code.</div></div>
<div class="calc-card"><div class="card-title">CVE-2024-23984 (GoFetch)</div><div class="card-body">Apple Silicon M1-M3 Data-Memory-dependent Prefetcher leaks across enclave. Cannot be patched in microcode; mitigations slow constant-time code 5-10×.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Engineering Hygiene — A Checklist</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pick the right primitive</div><div class="card-body">ChaCha20-Poly1305 over AES-GCM-on-software (no T-table). Curve25519 over secp256k1 (Montgomery ladder is constant-time by design). Ed25519 over ECDSA (deterministic, simpler).</div></div>
<div class="calc-card"><div class="card-title">Use vetted libraries</div><div class="card-body">libsodium, BoringSSL, ring, RustCrypto. They have ctgrind in CI. Avoid hand-rolled crypto.</div></div>
<div class="calc-card"><div class="card-title">Secret zeroing</div><div class="card-body"><code>explicit_bzero</code> / <code>memzero_explicit</code> / <code>SecureZeroMemory</code>. The compiler will optimize out a regular memset of an unused buffer.</div></div>
<div class="calc-card"><div class="card-title">Hardware acceleration</div><div class="card-body">AES-NI (Intel/AMD), Crypto Extensions (ARMv8), VAES, AVX-512 GFNI. Hardware AES is constant-time by spec; software AES on T-tables is not.</div></div>
<div class="calc-card"><div class="card-title">Fault attacks</div><div class="card-body">Voltage / clock glitches force a single instruction to misexecute. RSA-CRT signature with a single faulty multiplication leaks the private key (Boneh-DeMillo-Lipton 1997). Mitigation: verify the signature before output.</div></div>
<div class="calc-card"><div class="card-title">Spectre-class hardening</div><div class="card-body">Compile crypto with <code>-mspeculative-load-hardening</code>; for very hot paths, write barrier-after-load assembly. Trade ~5-10% perf for resistance.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Capstone — From Math to Metal, and Back</h2>
<p class="l-text">Across these ten lessons we walked from the symmetric primitives (lesson 1: AES, ChaCha20-Poly1305) and asymmetric foundations (lesson 2: RSA, ECC, signatures) through hashes (lesson 3), the trust scaffolding of PKI and TLS (lesson 4), the privacy revolution of zero-knowledge proofs (lesson 5), homomorphic encryption (lesson 6), and secure multiparty computation (lesson 7), through the post-quantum migration (lesson 8) and into the offensive science of cryptanalysis (lesson 9). This capstone returns to the most operationally important truth: <strong>perfect math, broken implementation = broken system</strong>.</p>

<p class="l-text">Side-channels are where most real-world cryptographic failures happen. Heartbleed (2014) was a buffer over-read, not a math break. ROCA (2017) was a smartcard library generating biased RSA primes. KRACK (2017) was a state-machine bug in WPA2. Hertzbleed (2022) was DVFS leakage. The math has been right for decades; the implementations leak. The discipline you need is <strong>constant-time coding, vetted libraries, ctgrind in CI, and a healthy paranoia about every memory access on a secret value</strong>. Apply that discipline, and the math behind it is some of the most beautiful and hard-won in human knowledge — defending billions of devices, every byte of every TLS connection, every Bitcoin transaction, every encrypted message, every minute of every day.</p>

<div class="calc-highlight"><strong>The crypto engineer's oath:</strong> never invent your own primitives, never branch on secret bytes, always use vetted libraries, always test under adversarial assumptions, always assume the side channel exists. Then build something the world can rely on.</div>
</div>`,
tr: `<p class="l-text"><strong>Yan-kanal saldırıları, sırları matematikten değil, bir kripto sisteminin fiziksel yürütmesinden kurtarır.</strong> Paul Kocher'ın 1996 makalesi "Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems" bir uyandırma çağrısıydı: modüler üs alma sabit olmayan zamanda çalışan mükemmel güvenli bir şifre, özel anahtarı ağ üzerinden sızdırır. İki yıl sonra Kocher, Jaffe ve Jun Differential Power Analysis (DPA)'yi yayımladı, bir akıllı kartın güç izinden DES anahtarlarını kurtardı. Yirmi iki yıl sonra, Ocak 2018'de, Spectre ve Meltdown her modern CPU'nun spekülatif yürütme makinesinin kendisinin bir yan kanal olduğunu gösterdi — Intel, AMD, ARM, IBM POWER'ı aynı anda etkileyerek tüm endüstride çekirdek yamaları ve mikrokod güncellemeleri gerektirdi.</p>

<p class="l-text">Bu bitiş tüm manzarayı yürür: zamanlama saldırıları (Kocher 1996, Brumley-Boneh 2003 ağ üzerinden OpenSSL RSA'ya karşı, Lucky 13 TLS-CBC'ye karşı 2013), güç analizi (DPA, CPA, AES akıllı kartlarında şablon saldırıları), elektromanyetik yan-kanallar (TEMPEST, AB'nin 2019 ECCploit'i), önbellek saldırıları (Yarom-Falkner 2014 tarafından Flush+Reload, Prime+Probe) ve spekülatif-yürütme ailesi (Spectre, Meltdown, Foreshadow, MDS, Downfall 2023, Reptar 2023). Onları düzelten mühendislik hijyeni ile kapatıyoruz: <strong>sabit-zamanlı kodlama</strong> ve her kripto mühendisinin kullanması gereken denetim araçları (ctgrind, dudect, MicroWalk).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>İstatistiksel güvenle iki if-dalını ayırt eden uygulamalı bir zamanlama saldırısı çalıştırın</li>
<li>AES'te DPA / CPA'yı tanıyın: Hamming-ağırlığı güç modeli, anahtar-bayt-bayt kurtarma</li>
<li>Önbellek saldırılarını ayırt edin: Flush+Reload (paylaşılan bellek), Prime+Probe (çekirdek arası), Evict+Reload</li>
<li>Spectre v1 / Meltdown / MDS saldırı zincirlerini ve çekirdek hafifletmelerini (KPTI, retpoline, IBPB) okuyun</li>
<li>Sabit-zamanlı kod yazın: gizli veriye bağlı dallar, indeksler veya bellek erişim desenleri yok</li>
<li>ctgrind / dudect / MicroWalk ile denetleyin — sızıntıları dağıtımdan önce yakalayan araçlar</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Kocher 1996 — Orijinal Zamanlama Saldırısı</h2>
<p class="l-text">Paul Kocher'ın 1996 makalesi, square-and-multiply algoritması ile uygulanan RSA'nın modüler üs alma işleminin, mevcut anahtar biti 1 olduğunda fazladan bir çarpma yaptığını fark etti. Çarpma ölçülebilir bir zaman farkı alırsa, seçilmiş şifreli metinlerin birçok şifre çözmesini zamanlayan bir saldırgan özel anahtarı bit bit kurtarabilir. Kocher 512-bit RSA'yı dakikalar içinde kurtardığını gösterdi. Düzeltme: her anahtar bitinin aynı işlemleri (square + multiply) gerçekleştirdiği, dalsız <strong>Montgomery merdivenleri</strong>.</p>

<div class="calc-highlight"><strong>Brumley &amp; Boneh 2003</strong>, zamanlama saldırılarının ağ üzerinden çalıştığını gösterdi — yalnızca TLS el sıkışma zamanlamalarını kullanarak, farklı bir LAN'daki bir sunucudan bir OpenSSL RSA özel anahtarını kurtardılar. Anahtar biti başına medyan ~1 ms zaman farkı, toplam 350 bin el sıkışma. OpenSSL yanıtı: varsayılan olarak "RSA blinding" gönderin. Lucky 13 (AlFardan-Paterson 2013) tekniği TLS CBC-modu MAC doğrulamasına genişletti, HMAC doğrulamasının zamanlamasından düz metin baytlarını kurtardı.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak bir zamanlama saldırısı: bir "gizli" PIN kontrolü ilk yanlış basamakta erken döner. perf_counter zamanlamalarını ölçüyoruz ve sırrı basamak basamak kurtarıyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> time, statistics, secrets, numpy <span class="kw">as</span> np

<span class="cm"># Hedef: 6 uzunluğunda sayısal PIN.  Savunmasız kontrol ilk uyumsuzlukta erken döner.</span>
SECRET = <span class="str">'472913'</span>

<span class="kw">def</span> <span class="fn">vulnerable_check</span>(guess):
    <span class="kw">for</span> g, s <span class="kw">in</span> <span class="fn">zip</span>(guess, SECRET):
        <span class="kw">if</span> g != s:
            <span class="kw">return</span> <span class="kw">False</span>
        <span class="cm"># Basamak başına bir karşılaştırma maliyetini simüle et</span>
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">2000</span>):
            <span class="kw">pass</span>
    <span class="kw">return</span> <span class="kw">True</span>

<span class="kw">def</span> <span class="fn">time_check</span>(guess, trials=<span class="num">400</span>):
    times = []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(trials):
        t0 = time.<span class="fn">perf_counter</span>()
        <span class="fn">vulnerable_check</span>(guess)
        times.<span class="fn">append</span>(time.<span class="fn">perf_counter</span>() - t0)
    <span class="kw">return</span> statistics.<span class="fn">median</span>(times)

<span class="cm"># Basamak basamak kurtar</span>
recovered = <span class="str">''</span>
<span class="kw">for</span> pos <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(SECRET)):
    best_digit, best_time = <span class="kw">None</span>, -<span class="num">1</span>
    <span class="kw">for</span> d <span class="kw">in</span> <span class="str">'0123456789'</span>:
        guess = recovered + d + <span class="str">'0'</span> * (<span class="fn">len</span>(SECRET) - pos - <span class="num">1</span>)
        t = <span class="fn">time_check</span>(guess)
        <span class="kw">if</span> t &gt; best_time:
            best_time, best_digit = t, d
    recovered += best_digit
    <span class="fn">print</span>(f<span class="str">'position {pos}: recovered <span class="str">"{recovered}"</span>  median time {best_time*1e6:.1f} μs'</span>)

<span class="fn">print</span>(f<span class="str">'\\nrecovered PIN: {recovered}  (real: {SECRET})'</span>)

<span class="cm"># Hafifletme: hmac.compare_digest sabit zamanlı karşılaştırma yapar.</span>
<span class="cm"># Kripto kuralı: gizli baytlar üzerinde asla dallanmayın.</span>
</code></pre></div></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Ders kitabı zayıf karşılaştırıcı tanımlar: <code>vulnerable_check</code> ilk eşleşmeyen basamakta erken döner ama her eşleşen basamak başına ~2000 spin yineleme yakar — tam olarak gizli token üzerinde <code>memcmp</code> veya Kocher öncesi RSA square-and-multiply ile aynı zamanlama şekli. 2) <code>time_check</code> tahmin başına 400 deneme çalıştırır ve <em>medyanı</em> alır — medyan kritiktir çünkü meşgul bir laptop'ta Python'un <code>perf_counter</code>'i GC ve OS scheduling'inden 1-2 μs jitter alır, tam olarak Brumley-Boneh 2003'ün OpenSSL anahtarını LAN üzerinden kurtarmak için filtrelemesi gereken gürültü tabanı. 3) Dış döngü basamakları teker teker sabitler: her pozisyon için 0-9 basamakları dener, en yüksek medyan zamanlamaya sahip olanı tutar (çünkü mismatch'ten önce daha fazla basamak eşleştirmek erken dönmeden önce daha fazla spin yineleme çalıştırıldı anlamına gelir) — bu, Kocher'in 1996'da RSA'ya karşı gösterdiği kanonik "uzat-sonra-uzat" basamak kurtarmasıdır. 4) Altı pozisyondan sonra kurtarılan dizi tam olarak <code>SECRET = '472913'</code>'e eşittir; düzeltme, eşleşmezlik konumuna bakılmaksızın tam uzunluğu yineleyen <code>hmac.compare_digest(guess, secret)</code>'tir — OpenSSL'in Brumley-Boneh sonrası benimsediği aynı sabit-zamanlı desen ve her modern crypto API'sinin (libsodium, NaCl, ring-rs) yerleştirdiği.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Güç Analizi — DPA, CPA, Şablon Saldırıları</h2>
<p class="l-text">Kocher-Jaffe-Jun 1998, <strong>Differential Power Analysis (DPA)</strong>'yi tanıttı. Bir akıllı kartın güç hattına bir osiloskop bağlayın, şifrelerken izi kaydedin. AES S-box çıktısının Hamming ağırlığı, anlık akım çekimi ile doğrusal olarak ilişkilidir. Her anahtar baytı tahmini için izleri iki bölmeye sınıflandırın (HW = 0 vs HW yüksek); doğru tahmin net bir fark gösterir; yanlış tahminler gürültü gibi görünür. 16 AES anahtar baytının tümünü bağımsız olarak kurtarın — toplam iş ~16 · 2^8 = 4096 hipotez, önemsiz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SPA (Basit Güç Analizi)</div><div class="card-body">Görünür desenler tespit ederek (örneğin RSA square vs square-and-multiply) tek bir izden anahtarı doğrudan okuyun. Naif square-and-multiply uygulamaları bir izde tüm anahtarı sızdırır.</div></div>
<div class="calc-card"><div class="card-title">DPA</div><div class="card-body">Birçok iz üzerinde istatistiksel saldırı. Bir anahtar hipotezi için bölmeler arasındaki ortalamaların farkı. Rastgeleleştirme eksik herhangi bir uygulamaya karşı standart.</div></div>
<div class="calc-card"><div class="card-title">CPA (Korelasyon Güç Analizi)</div><div class="card-body">Brier-Clavier-Olivier 2004. İz örnekleri ile bir güç modeli (ara değerlerin Hamming ağırlığı) arasında Pearson korelasyonu. DPA'dan daha sağlam, daha az iz.</div></div>
<div class="calc-card"><div class="card-title">Şablon saldırıları</div><div class="card-body">Bayt-değeri başına şablonlar oluşturmak için bilinen anahtarlarla bir klon cihazı profilleyin, sonra bir hedefin izini eşleştirin. En güçlü ama bir klona fiziksel erişim gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Hafifletmeler</div><div class="card-body">Boolean / aritmetik maskeleme (ara değerleri rastgele paylara böl), gizleme (sabit güç dengesi), tür sırasını karıştır, sahte işlemler. Akıllı kart çipleri (Infineon SLE, NXP P5) birden fazla donanım önlemi ile gelir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Elektromanyetik ve Akustik — TEMPEST ve Ötesi</h2>
<p class="l-text">Güç analizi bir kabloya fiziksel erişim varsayar; <strong>elektromanyetik yan-kanallar</strong> mesafeden çalışır. NSA'nın TEMPEST programı (2007'de kısmen gizliliği kaldırıldı), CRT monitörler, kablolar ve işlemcilerden gelen ve bir oda öteden yeniden oluşturulabilen EM yayılımlarını kapsar. Modern saldırılar daha çılgındır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Mesafede EM</div><div class="card-body">Genkin-Pipman-Tromer 2014, yakındaki bir odada bir akıllı telefon kullanarak bir dizüstünün şasi-EM emisyonlarından RSA anahtarlarını kurtardı. Ucuz radyo + birkaç dakika yakalama.</div></div>
<div class="calc-card"><div class="card-title">Akustik</div><div class="card-body">Genkin-Shamir-Tromer 2013 ("RSA Key Extraction via Low-Bandwidth Acoustic Cryptanalysis"): GnuPG şifre çözerken parabolik bir mikrofon kondansatör vızıltısını dinler. ~1 saatte 4096-bit RSA'yı kurtarır.</div></div>
<div class="calc-card"><div class="card-title">Soğuk önyükleme</div><div class="card-body">Halderman vd. 2008. RAM'i sıkıştırılmış havayla dondurun, 30 saniye içinde dump edin → çekirdek belleğinden AES anahtarları kurtarılabilir. Gerçek adli tıpta kullanıldı.</div></div>
<div class="calc-card"><div class="card-title">Optik</div><div class="card-body">Loughry-Umphress 2002, Backes 2008: LED etkinlik ışıkları gösterge-ile ilişkili veri sızdırır. Modern varyant: HDD blink dosya-erişim desenlerini bir penceredeki kameraya sızdırır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Önbellek Saldırıları — Flush+Reload, Prime+Probe</h2>
<p class="l-text">Bir önbellek isabeti ~4 ns alır; bir ıskalama ~100 ns. İki süreç bir CPU önbelleğini paylaşıyorsa (ve birçoğu, aynı fiziksel çekirdekte birlikte yerleştirilmiş bir bulut VM'inde, paylaşır) biri diğerinin erişim desenlerini tespit edebilir. Yarom-Falkner 2014'ün <strong>Flush+Reload</strong>'u, paylaşılan L3 önbelleği aracılığıyla çekirdekler arasında casusluk yapar. Adımlar: (1) bir hedef bellek satırını <code>clflush</code>; (2) bekleyin; (3) yeniden yükleyin ve zamanlayın. Hızlı = kurban erişti; yavaş = kurban erişmedi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Flush+Reload</div><div class="card-body">Paylaşılan bellek gerektirir (dedupe edilmiş kütüphaneler, KVM'de KSM). Casus AES T-tablolarındaki kurbanın tablo-arama pozisyonlarını tespit eder → anahtarı kurtarır. OpenSSL 1.0.1f 2014'te bulut kiracıları arasında kurtarıldı.</div></div>
<div class="calc-card"><div class="card-title">Prime+Probe</div><div class="card-body">Paylaşılan bellek gerekmez. Casus önbellek setini doldurur, kurban çalışır, casus kendi erişimlerini yeniden zamanlar; çıkarılan satırlar = kurban o sete erişti. VM'ler arası, kiracılar arası çalışır. 2015'te gerçek kiracılar arası anahtar çıkarmada kullanıldı.</div></div>
<div class="calc-card"><div class="card-title">Evict+Reload, Flush+Flush</div><div class="card-body">Daha gizli veya clflush'sız ortamlar için varyantlar. Rowhammer da önbellek-saldırı hassasiyetini artırabilir.</div></div>
<div class="calc-card"><div class="card-title">Savunma</div><div class="card-body">Sabit-zamanlı tablo aramaları (sırra-bağlı bellek yok). Intel/AMD donanımında AES-NI T-tablolarından tamamen kaçınır. ChaCha20'nin S-box'ı yok → tasarımca önbellek-zamanlama sızıntısı yok.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Flush+Reload'ı gürültülü bir zamanlama kanalı olarak simüle edin: isabetler kısa, ıskalamalar uzundur, istatistik onları ayırır.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">11</span>)

HIT_NS,  HIT_SD  = <span class="num">4.0</span>,  <span class="num">0.5</span>
MISS_NS, MISS_SD = <span class="num">100.0</span>, <span class="num">8.0</span>

<span class="cm"># Kurbanın gizli erişim deseni: 1 = erişildi (isabet), 0 = değil</span>
secret = np.random.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, <span class="num">16</span>)  <span class="cm"># 16 önbellek satırı</span>

<span class="kw">def</span> <span class="fn">measure</span>(line_accessed_by_victim, n=<span class="num">200</span>):
    <span class="cm"># Casus kurbandan sonra yeniden yükler. Kurban getirdi ise isabet.</span>
    <span class="kw">if</span> line_accessed_by_victim:
        <span class="kw">return</span> np.random.<span class="fn">normal</span>(HIT_NS, HIT_SD, n)
    <span class="kw">return</span> np.random.<span class="fn">normal</span>(MISS_NS, MISS_SD, n)

recovered = []
<span class="kw">for</span> line_idx <span class="kw">in</span> <span class="fn">range</span>(<span class="num">16</span>):
    samples = <span class="fn">measure</span>(secret[line_idx])
    median  = np.<span class="fn">median</span>(samples)
    recovered.<span class="fn">append</span>(<span class="num">1</span> <span class="kw">if</span> median &lt; <span class="num">50</span> <span class="kw">else</span> <span class="num">0</span>)

<span class="fn">print</span>(<span class="str">'secret pattern:    '</span>, secret.<span class="fn">tolist</span>())
<span class="fn">print</span>(<span class="str">'recovered pattern: '</span>, recovered)
<span class="fn">print</span>(<span class="str">'match:'</span>, np.<span class="fn">array_equal</span>(secret, recovered))

<span class="cm"># Gerçek bir saldırıda her "satır" bir AES T-tablosunun 64-baytlık bir parçasına karşılık gelir.</span>
<span class="cm"># Kurbanın arama indeksi (=anahtar XOR düz metin baytı) gizli durumun bir baytını açığa vurur.</span>
</code></pre></div></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>HIT_NS=4, MISS_NS=100</code>'i küçük Gauss gürültüsü ile ayarlar — bunlar modern x86'da ölçülen L1-hit vs ana-bellek-miss gecikmeleridir, tam olarak Yarom-Falkner 2014'ün Flush+Reload'ının süreçler veya VM'ler arasında paylaşılan cache satırlarını gözetlemek için sömürdüğü zamanlama farkı. 2) <code>secret</code>, kurbanın dokunduğu 64-byte AES T-table cache satırlarını simüle eden rastgele 16-bit erişim desenidir — her "1", spy'in algılamak istediği anahtar-bağımlı bir T-table aramasını temsil eder, tam olarak Irazoqui vd.'nin 2014'te cross-tenant key extraction için silahlandırdığı OpenSSL 1.0.1f sızıntısı. 3) <code>measure(line_accessed)</code> satır başına 200 gürültülü örnek çeker: kurban erişmişse hit-dağılımı, aksi takdirde miss-dağılımı — ortalama, gerçek Flush+Reload'ın prefetcher'lardan, TLB baskısından ve DRAM-row-buffer etkilerinden gördüğü örnek-başına gürültüyü yener. 4) Medyanı alıp 50 ns'de eşik uygulamak 16 bitin tümünü güvenilir şekilde geri kazanır — yazdırılan <code>match: True</code> ucuz istatistiklerin bile sırrı temiz şekilde çıkardığını gösterir, ki bu paylaşımlı-kiracı ortamlarında çalışan herhangi bir kodda <em>sabit-zamanlı tablo-siz</em> AES'in (Intel/AMD'de AES-NI veya tasarımca ChaCha20-Poly1305) neden zorunlu olduğunu açıklar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Spectre ve Meltdown — Ocak 2018</h2>
<p class="l-text">3 Ocak 2018'de ambargo kalktı: 1995'ten beri her Intel CPU, her AMD, her ARM Cortex-A, <strong>spekülatif yürütme</strong> aracılığıyla temel bir yan kanala sahipti. Kocher (yine!), Horn (Google Project Zero), Lipp vd. Spectre ve Meltdown'ı yayımladı. CPU bir sınır kontrolünün veya ayrıcalık sınırının ötesinde spekülatif olarak yürütür, spekülasyon geri alınır, ancak <em>önbellek ayak izi</em> alınmaz — ve Flush+Reload sırrı bu ayak izinden okur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Meltdown (CVE-2017-5754)</div><div class="card-body">Kullanıcı alanından çekirdek belleğini okur. Yalnızca Intel (çoğunlukla). KPTI / KAISER tarafından düzeltildi — kullanıcı vs çekirdek için ayrı sayfa tabloları. ~%5-30 sistem çağrısı yükü.</div></div>
<div class="calc-card"><div class="card-title">Spectre v1 (CVE-2017-5753)</div><div class="card-body">Dal tahmin edicisi aracılığıyla sınır-kontrolü atlatma. Evrensel (Intel/AMD/ARM). Hafifletme: sınır kontrolünden sonra <code>lfence</code>; <code>-mspeculative-load-hardening</code> aracılığıyla derleyici eklemesi.</div></div>
<div class="calc-card"><div class="card-title">Spectre v2 (CVE-2017-5715)</div><div class="card-body">Süreçler arası dal hedef enjeksiyonu. Hafifletme: retpoline (return-trampoline), IBRS / IBPB / STIBP mikrokod özellikleri. Maliyetli: dolaylı çağrı ağırlıklı iş yüklerinde ~%3-10.</div></div>
<div class="calc-card"><div class="card-title">Foreshadow / L1TF (Ağu 2018)</div><div class="card-body">L1 önbellek aracılığıyla SGX enclave belleği + VM'ler arası bellek okur. Bağlam değiştirmede L1D flush ile düzeltildi; etkilenen CPU'larda SGX gizliliğini ortadan kaldırır.</div></div>
<div class="calc-card"><div class="card-title">MDS / Zombieload (May 2019)</div><div class="card-body">SMT kardeşleri arasında satır doldurma tamponlarından okur. Düzeltme: hyperthreading'i devre dışı bırakın veya MDS-clear mikrokodu uygulayın. Hyperthreading-kapalı maliyeti: ~%30.</div></div>
<div class="calc-card"><div class="card-title">Downfall, Reptar (2023)</div><div class="card-body">Intel'de AVX gather-komut sızıntısı; Reptar hyperthreading boyunca sızdırmak için bir mikrokod hatasını gıdıklar. Mikrokod yamaları Ağu-Kas 2023.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Sabit-Zamanlı Kodlama — Savunma</h2>
<p class="l-text">Sır asla zamanlamayı, dallanmayı veya bellek-erişim desenlerini etkilemezse, algoritmik yapıdaki yan-kanal saldırıları kaybolur. Kurallar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gizli veriye bağlı dallar yok</div><div class="card-body"><code>if (secret_byte == 0) ... else ...</code> bir sızıntıdır. <code>x = a ^ ((-mask) &amp; (a ^ b))</code> veya derleyici-destekli sabit-zamanlı select kullanın.</div></div>
<div class="calc-card"><div class="card-title">Gizli veriye bağlı indeksler yok</div><div class="card-body">AES T-table[secret] bir önbellek-zamanlama sızıntısıdır. Her girişi okuyun ve sabit-zamanlı select. Veya AES-NI / VAES donanımı kullanın.</div></div>
<div class="calc-card"><div class="card-title">Gizli veriye bağlı döngü sınırları yok</div><div class="card-body">Her zaman aynı sayıda yineleme döngüsü yapın; kısa devre olmadan bir "done" bayrağında dallanın.</div></div>
<div class="calc-card"><div class="card-title">Gizli veriye bağlı değişken-zamanlı işlemler yok</div><div class="card-body">CPU tam sayı bölmesi, BMI2 PEXT, bazı SIMD komutları gecikmede veriye göre değişir. Yalnızca toplama / XOR / sabit-kaydırma kullanın.</div></div>
<div class="calc-card"><div class="card-title">Bellek karşılaştırmaları</div><div class="card-body">Python'da <code>hmac.compare_digest</code>, OpenSSL'de <code>CRYPTO_memcmp</code>, Go'da <code>subtle.ConstantTimeCompare</code>. Sırlarda asla <code>==</code> kullanmayın.</div></div>
<div class="calc-card"><div class="card-title">Derleyici / CPU sürprizleri</div><div class="card-body">Derleyiciler optimizasyon yoluyla dalları yeniden tanıtabilir. <code>volatile</code> anahtar kelimesi, fence intrinsic'leri ve açık derleme yüksek-güvenceli kod için gerekli olabilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Denetim Araçları — ctgrind, dudect, MicroWalk</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ctgrind (Langley 2010)</div><div class="card-body">Valgrind tabanlı: sırları "başlatılmamış" olarak işaretler, üzerlerinde herhangi bir dal / indeks / yükleme işaretlenir. libsodium, BoringSSL CI için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">dudect (Reparaz vd. 2017)</div><div class="card-body">İstatistiksel: iki girdi dağılımını besleyin (sabit vs rastgele) ve zamanlamalarda Welch'in t-testi. t-istatistiği bir eşiği aşarsa uygulama sabit-zamanlı değildir. Kara kutu.</div></div>
<div class="calc-card"><div class="card-title">MicroWalk (Wichelmann vd. 2018+)</div><div class="card-body">Dinamik ikili enstrümantasyon, Intel Pin izlerinden sızıntı analizi. Yalnızca C-seviyesi dalları değil, mikromimari sızıntıyı yakalar.</div></div>
<div class="calc-card"><div class="card-title">Resmi: Jasmin, Cryptol, FaCT</div><div class="card-body">İçinde sabit-zamanlı garantiler yerleşik alana özgü diller. AWS-LC, BoringSSL Curve25519, libsignal en sıcak yollar için bunları kullanır.</div></div>
</div>

<div class="calc-highlight"><strong>Endüstri standardı:</strong> Cloudflare, Google, AWS, Apple, Meta'daki herhangi bir yeni kripto kodu, birleştirmeden önce CI'da ctgrind veya dudect'ten geçer. OpenSSL, Bouncy Castle, mbedTLS'de yeni sabit-zamanlı hatalar her yıl hâlâ yüzeyleniyor — uyanıklık kalıcıdır.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gerçek Dünya CVE'leri — Bilinen Yan-Kanal Kırılmaları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">CVE-2003-0147 (OpenSSL RSA zamanlaması)</div><div class="card-body">Apache+mod_ssl'ye karşı Brumley-Boneh saldırısı. RSA anahtarı LAN üzerinden kurtarılabilir. Düzeltme: varsayılan olarak RSA blinding'i etkinleştir.</div></div>
<div class="calc-card"><div class="card-title">CVE-2013-0169 (Lucky 13)</div><div class="card-body">TLS-CBC HMAC doğrulaması sabit-zamanlı değildi. ~2^23 bağlantı başına ~16 düz metin baytı kurtarıldı. TLS'de CBC'yi öldürdü, AEAD benimsenmesini hızlandırdı.</div></div>
<div class="calc-card"><div class="card-title">CVE-2018-5407 (PortSmash)</div><div class="card-body">SMT tabanlı port-çekişme yan kanalı. Intel SGX P-256 ECDSA anahtarlarını kurtardı. Hafifletme: kripto enclave'leri için SMT'yi devre dışı bırakın.</div></div>
<div class="calc-card"><div class="card-title">CVE-2023-22655 (Downfall)</div><div class="card-body">AVX gather komutu aynı çekirdek SMT boyunca sızar. Skylake-Tiger Lake Intel CPU'larını etkiler. Mikrokod yaması Ağustos 2023.</div></div>
<div class="calc-card"><div class="card-title">CVE-2022-24675 (Hertzbleed)</div><div class="card-body">DVFS frekans ölçeklemesi güç tüketimine, o da veriye bağlıdır. SIKE / klasik kripto üzerinde uzaktan zamanlama saldırısı. Hafifletme: Turbo Boost'u devre dışı bırakın veya güç-tekdüze kod kullanın.</div></div>
<div class="calc-card"><div class="card-title">CVE-2024-23984 (GoFetch)</div><div class="card-body">Apple Silicon M1-M3 Veri-Belleğe-Bağlı Önyükleyici enclave boyunca sızar. Mikrokodda yamalanamaz; hafifletmeler sabit-zamanlı kodu 5-10× yavaşlatır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Mühendislik Hijyeni — Bir Kontrol Listesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğru primitifi seçin</div><div class="card-body">Yazılımda-AES-GCM yerine ChaCha20-Poly1305 (T-tablosu yok). secp256k1 yerine Curve25519 (Montgomery merdiveni tasarımca sabit-zamanlıdır). ECDSA yerine Ed25519 (deterministik, daha basit).</div></div>
<div class="calc-card"><div class="card-title">İncelenmiş kütüphaneleri kullanın</div><div class="card-body">libsodium, BoringSSL, ring, RustCrypto. CI'da ctgrind'leri var. El yapımı kriptodan kaçının.</div></div>
<div class="calc-card"><div class="card-title">Sır sıfırlama</div><div class="card-body"><code>explicit_bzero</code> / <code>memzero_explicit</code> / <code>SecureZeroMemory</code>. Derleyici, kullanılmayan bir tamponun düzenli memset'ini optimize edip kaldıracaktır.</div></div>
<div class="calc-card"><div class="card-title">Donanım hızlandırması</div><div class="card-body">AES-NI (Intel/AMD), Crypto Extensions (ARMv8), VAES, AVX-512 GFNI. Donanım AES'i spec gereği sabit-zamanlıdır; T-tablolu yazılım AES'i değildir.</div></div>
<div class="calc-card"><div class="card-title">Hata saldırıları</div><div class="card-body">Voltaj / saat glitch'leri tek bir komutu yanlış yürütmeye zorlar. Tek bir hatalı çarpmayla RSA-CRT imzası özel anahtarı sızdırır (Boneh-DeMillo-Lipton 1997). Hafifletme: çıktıdan önce imzayı doğrula.</div></div>
<div class="calc-card"><div class="card-title">Spectre sınıfı sertleştirme</div><div class="card-body">Kriptoyu <code>-mspeculative-load-hardening</code> ile derleyin; çok sıcak yollar için yükleme-sonrası-bariyer derleme yazın. ~%5-10 perf'i dirence takas edin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Bitiş — Matematikten Metale ve Geri</h2>
<p class="l-text">Bu on ders boyunca simetrik primitiflerden (ders 1: AES, ChaCha20-Poly1305) ve asimetrik temellerden (ders 2: RSA, ECC, imzalar) hash'lere (ders 3), PKI ve TLS'nin güven iskelesine (ders 4), sıfır-bilgi kanıtlarının gizlilik devrimine (ders 5), homomorfik şifrelemeye (ders 6) ve güvenli çok taraflı hesaplamaya (ders 7), post-kuantum geçişine (ders 8) ve kriptanalizin saldırgan bilimine (ders 9) yürüdük. Bu bitiş, en operasyonel olarak önemli gerçeğe geri döner: <strong>mükemmel matematik, kırık uygulama = kırık sistem</strong>.</p>

<p class="l-text">Yan-kanallar gerçek dünya kriptografik başarısızlıklarının çoğunun gerçekleştiği yerdir. Heartbleed (2014) bir matematik kırılması değil, bir tampon-üstü-okumaydı. ROCA (2017) yanlı RSA asalları üreten bir akıllı kart kütüphanesiydi. KRACK (2017) WPA2'de bir durum makinesi hatasıydı. Hertzbleed (2022) DVFS sızıntısıydı. Matematik on yıllardır doğruydu; uygulamalar sızıyor. İhtiyacınız olan disiplin <strong>sabit-zamanlı kodlama, incelenmiş kütüphaneler, CI'da ctgrind ve gizli bir değer üzerindeki her bellek erişimi hakkında sağlıklı bir paranoyadır</strong>. Bu disiplini uygulayın ve arkasındaki matematik insan bilgisindeki en güzel ve zor kazanılanlardan bazılarıdır — milyarlarca cihazı, her TLS bağlantısının her baytını, her Bitcoin işlemini, her şifrelenmiş mesajı, her günün her dakikasını savunur.</p>

<div class="calc-highlight"><strong>Kripto mühendisinin yemini:</strong> kendi primitiflerinizi asla icat etmeyin, gizli baytlar üzerinde asla dallanmayın, her zaman incelenmiş kütüphaneler kullanın, her zaman düşmanca varsayımlar altında test edin, her zaman yan kanalın var olduğunu varsayın. Sonra dünyanın güvenebileceği bir şey inşa edin.</div>
</div>`
};
