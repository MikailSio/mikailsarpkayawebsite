window.CRYPTO_L9 = {
en: `<p class="l-text"><strong>Cryptanalysis is the science of breaking ciphers.</strong> Every cryptographic primitive in production today exists because some earlier primitive was broken: Vigenère fell to Kasiski's 19th-century work, the Enigma fell to Polish and British analysts in the 1930s-40s, DES fell to differential cryptanalysis (Biham-Shamir 1991) and linear cryptanalysis (Matsui 1993) before its key size made brute force feasible (EFF Deep Crack, 1998), and SHA-1 fell to chosen-prefix collisions (Stevens et al., 2017-2020). The two foundational techniques discovered in the late 1980s and early 1990s — differential and linear cryptanalysis — are still the first tools any modern symmetric cipher must defend against.</p>

<p class="l-text">In this lesson we walk differential cryptanalysis (Biham-Shamir 1991, the technique IBM and the NSA secretly knew when designing DES in 1974 but did not disclose), linear cryptanalysis (Mitsuru Matsui 1993, NTT Japan), the related-key attack model, the meet-in-the-middle technique that killed double-DES, and the algebraic / SAT-solver / cube attacks that target reduced-round modern ciphers. We trace the DES → 3DES → AES timeline and close with how AES's S-box and MixColumns were specifically engineered to resist these attacks.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build a differential distribution table (DDT) for an S-box and read off the best characteristic</li>
<li>Apply linear cryptanalysis: find biased linear approximations and use Matsui's Algorithm 2</li>
<li>Recognize related-key, slide, integral, and impossible-differential attacks</li>
<li>Use meet-in-the-middle to halve a brute-force search and explain why double-DES is no stronger than DES</li>
<li>Trace the DES → 3DES → AES timeline and the design lessons baked into Rijndael</li>
<li>Estimate the work-factor of a cryptanalytic attack and tell when "broken" means "deployable"</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Attack Models — Known/Chosen Plaintext, Adaptive, Related-Key</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ciphertext-only (COA)</div><div class="card-body">Attacker has only ciphertexts and statistical knowledge of the plaintext distribution. Hardest scenario; classical era (Caesar, Vigenère, monoalphabetic) all broken here.</div></div>
<div class="calc-card"><div class="card-title">Known-plaintext (KPA)</div><div class="card-body">Attacker has (P, C) pairs. Linear cryptanalysis works in this model. Very realistic — protocol headers leak plaintext.</div></div>
<div class="calc-card"><div class="card-title">Chosen-plaintext (CPA)</div><div class="card-body">Attacker can encrypt anything they want. Differential cryptanalysis lives here. Adaptive variant: choose later plaintexts based on previous ciphertexts.</div></div>
<div class="calc-card"><div class="card-title">Chosen-ciphertext (CCA)</div><div class="card-body">Attacker can decrypt arbitrary ciphertexts (except the target). Bleichenbacher 1998 RSA padding-oracle attack lives here. Modern AEAD must be CCA-secure.</div></div>
<div class="calc-card"><div class="card-title">Related-key</div><div class="card-body">Attacker observes encryptions under unknown but related keys (e.g., k and k ⊕ Δ). Devastates AES-256 in 2^99 (Biryukov-Khovratovich 2009) — the reason the AES-128 / 192 attacks did not, but the model is unrealistic for most deployments.</div></div>
<div class="calc-card"><div class="card-title">Side-channel (lesson 10)</div><div class="card-body">Timing, power, EM, cache. Different from above — uses physical leakage, not just (P, C) pairs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Differential Cryptanalysis — Biham &amp; Shamir 1991</h2>
<p class="l-text">Eli Biham and Adi Shamir introduced differential cryptanalysis in 1990 (CRYPTO conference; full paper 1991). The idea: track how an XOR difference Δ on the input propagates through the cipher. For each S-box, build a <strong>Differential Distribution Table</strong> (DDT) recording how often input difference ΔX produces output difference ΔY. Most cells are near 2^n / 2^n = 1; a few cells stand out with high probability. Chain those cells across rounds → a <em>differential characteristic</em> with overall probability p. With 1/p chosen-plaintext pairs, you can recover the last-round key.</p>

<div class="katex-block">$$\\Pr[\\Delta Y \\mid \\Delta X] = \\frac{|\\{x : S(x) \\oplus S(x \\oplus \\Delta X) = \\Delta Y\\}|}{2^n}$$</div>

<div class="calc-highlight"><strong>The IBM/NSA secret:</strong> DES's S-boxes were specifically designed in 1974 to resist differential cryptanalysis — but IBM was asked by the NSA to keep the technique classified. Biham and Shamir rediscovered it 17 years later. DES's 16 rounds were the minimum to resist their attack. AES designers (Daemen-Rijmen) made differential resistance an explicit, published design criterion.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build the DDT for a toy 4-bit S-box (PRESENT cipher's S-box). Highlight the best differential.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># PRESENT cipher's 4-bit S-box (designed for resource-constrained crypto, ISO/IEC 29192)</span>
S = [0xC, 0x5, 0x6, 0xB, 0x9, 0x0, 0xA, 0xD, 0x3, 0xE, 0xF, 0x8, 0x4, 0x7, 0x1, 0x2]

<span class="cm"># Build DDT</span>
ddt = np.<span class="fn">zeros</span>((<span class="num">16</span>, <span class="num">16</span>), dtype=<span class="fn">int</span>)
<span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">16</span>):
    <span class="kw">for</span> dx <span class="kw">in</span> <span class="fn">range</span>(<span class="num">16</span>):
        dy = S[x] ^ S[x ^ dx]
        ddt[dx, dy] += <span class="num">1</span>

<span class="fn">print</span>(<span class="str">'DDT (rows = input diff, cols = output diff):'</span>)
<span class="fn">print</span>(ddt)

<span class="cm"># Highest non-trivial probability (skip dx=0 row)</span>
ddt_no_zero = ddt.<span class="fn">copy</span>()
ddt_no_zero[<span class="num">0</span>, :] = <span class="num">0</span>
imax = np.<span class="fn">unravel_index</span>(ddt_no_zero.<span class="fn">argmax</span>(), ddt_no_zero.shape)
<span class="fn">print</span>(f<span class="str">'\\nbest differential: ΔX={imax[0]:X} -&gt; ΔY={imax[1]:X}, '</span>
      f<span class="str">'count={ddt_no_zero[imax]}/16  (prob={ddt_no_zero[imax]/16})'</span>)

<span class="cm"># For PRESENT the maximum non-trivial DDT entry is 4/16 = 1/4 — very strong by design.</span>
<span class="cm"># AES S-box has max DDT entry 4/256 — even stronger.</span>
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Hard-codes PRESENT's 4-bit S-box (ISO/IEC 29192-2 lightweight cipher, 2007) — a 16-entry permutation chosen specifically to bound differential and linear bias for IoT-scale silicon. 2) The double loop fills a 16×16 Differential Distribution Table by counting, for every input difference <code>dx</code> and every input <code>x</code>, how often the S-box maps the pair <code>(x, x⊕dx)</code> to a fixed output difference <code>dy = S(x) ⊕ S(x⊕dx)</code> — this is the exact construction Biham-Shamir 1991 used to attack DES and the same procedure Daemen-Rijmen 1998 used to prove AES resistance. 3) <code>ddt[0, :] = 0</code> zeroes the trivial <code>dx=0 → dy=0</code> row that always equals 16; <code>argmax</code> then finds the highest non-trivial entry — for PRESENT it is 4/16 = 0.25, meaning the best differential characteristic propagates one round with probability 1/4. 4) Comments confirm: PRESENT's max DDT entry is 4/16 (the design ceiling), AES is 4/256 — these numbers feed directly into <code>data complexity ∝ 1/p^r</code> for an r-round characteristic, which is exactly why 16-round DES survived differential attack and full-round AES needs &gt;2^100 chosen plaintexts.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Linear Cryptanalysis — Matsui 1993</h2>
<p class="l-text">Mitsuru Matsui (NTT Japan) introduced linear cryptanalysis in 1993, breaking 8-round DES, then full 16-round DES with 2^43 known plaintexts in 1994 — the first non-brute-force break of full DES, requiring about 50 days on 12 workstations. The idea: find a linear approximation a · P ⊕ b · C = c · K that holds with probability 1/2 + ε (a "bias" ε). Use it as a distinguisher, then Matsui's Algorithm 2 to recover key bits.</p>

<div class="katex-block">$$\\Pr[a \\cdot P \\oplus b \\cdot C = c \\cdot K] = \\tfrac{1}{2} + \\varepsilon, \\quad \\text{data complexity} \\propto 1/\\varepsilon^2$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Linear approximation table (LAT)</div><div class="card-body">For each S-box, count how often (a · x) = (b · S(x)) over all x. Bias ε = (count - 8) / 16 for a 4-bit S-box.</div></div>
<div class="calc-card"><div class="card-title">Piling-up lemma</div><div class="card-body">Combine round biases: ε_total = 2^{r-1} · ∏ ε_i. Tells you how many KP pairs you need.</div></div>
<div class="calc-card"><div class="card-title">Matsui's Algorithm 2</div><div class="card-body">Guess last-round key bits, partially decrypt, count how often the linear relation holds, pick the guess with maximum bias. Recovers ~26 key bits of DES; remaining via brute force.</div></div>
<div class="calc-card"><div class="card-title">AES resistance</div><div class="card-body">AES S-box max bias = 16/256. Two-round linear branch number = 5 → 4-round trail bias is negligible. Full AES requires &gt;2^140 KP, completely infeasible.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Meet-in-the-Middle — Why Double-DES Is Not Stronger</h2>
<p class="l-text">A naïve countermeasure to short keys: encrypt twice with two independent keys. C = E_{k2}(E_{k1}(P)). Naïvely 2^{2k} brute force. But Diffie and Hellman 1977 noticed: build a table T[E_{k1}(P)] = k1 for all 2^k values of k1, then for each k2 compute D_{k2}(C) and look up. Total work: 2^k · 2 + 2^k memory — only twice as much as single-key brute force. Double-DES (2^57 work) was abandoned for 3DES (encrypt-decrypt-encrypt), which gives ~2^112 effective security against MITM.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Toy meet-in-the-middle attack on a "double-cipher" with 16-bit keys. Total search space 2^32, MITM gets there in ~2^17.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets

<span class="cm"># Toy 16-bit block cipher: rotate-and-XOR. Reversible.</span>
<span class="kw">def</span> <span class="fn">E</span>(k, p):
    x = ((p &lt;&lt; <span class="num">3</span>) | (p &gt;&gt; <span class="num">13</span>)) &amp; 0xFFFF
    <span class="kw">return</span> x ^ k

<span class="kw">def</span> <span class="fn">D</span>(k, c):
    x = c ^ k
    <span class="kw">return</span> ((x &gt;&gt; <span class="num">3</span>) | (x &lt;&lt; <span class="num">13</span>)) &amp; 0xFFFF

<span class="cm"># Real keys</span>
k1_real = secrets.<span class="fn">randbits</span>(<span class="num">16</span>)
k2_real = secrets.<span class="fn">randbits</span>(<span class="num">16</span>)
P = 0x1234
C = <span class="fn">E</span>(k2_real, <span class="fn">E</span>(k1_real, P))

<span class="cm"># Naive: try all 2^32 — would take a while.  MITM:  ~2 * 2^16 ops + 2^16 memory.</span>

<span class="cm"># Step 1: forward table</span>
fwd = {}
<span class="kw">for</span> k1 <span class="kw">in</span> <span class="fn">range</span>(0x10000):
    fwd.<span class="fn">setdefault</span>(<span class="fn">E</span>(k1, P), []).<span class="fn">append</span>(k1)

<span class="cm"># Step 2: backward search</span>
candidates = []
<span class="kw">for</span> k2 <span class="kw">in</span> <span class="fn">range</span>(0x10000):
    mid = <span class="fn">D</span>(k2, C)
    <span class="kw">if</span> mid <span class="kw">in</span> fwd:
        <span class="kw">for</span> k1 <span class="kw">in</span> fwd[mid]:
            candidates.<span class="fn">append</span>((k1, k2))

<span class="fn">print</span>(f<span class="str">'real keys:          ({k1_real:04X}, {k2_real:04X})'</span>)
<span class="fn">print</span>(f<span class="str">'MITM candidates:    {len(candidates)} (one is real, rest are false positives)'</span>)
<span class="fn">print</span>(f<span class="str">'first candidate:    {candidates[0]}  -&gt; we found the real keys among them: '</span>
      f<span class="str">'{(k1_real, k2_real) in candidates}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a reversible toy 16-bit block cipher: <code>E(k, p)</code> rotates the plaintext left by 3 bits and XORs the key; <code>D</code> inverts it — the structure is intentionally weak so the demo runs instantly while preserving the property MITM exploits (encryption-then-encryption with two independent keys). 2) Sets up the target: real keys <code>(k1_real, k2_real)</code> drawn from <code>secrets</code>, plaintext <code>P=0x1234</code>, ciphertext <code>C = E(k2, E(k1, P))</code> — a brute force would need <code>2^32</code> work, exactly the Double-DES situation Diffie-Hellman flagged in 1977. 3) Step 1 builds a forward table <code>fwd[E(k1, P)] = [k1, ...]</code> in <code>2^16</code> work and <code>2^16</code> memory — this is the time-memory tradeoff that turns the 2^32 problem into ~2^17 total. 4) Step 2 iterates all <code>2^16</code> candidate <code>k2</code> values, computes the "midpoint" <code>D(k2, C)</code>, and looks it up in <code>fwd</code> — every match yields a candidate <code>(k1, k2)</code> pair; the print shows the real keys are always among the candidates, which is the textbook reason 3DES (encrypt-decrypt-encrypt) was chosen over plain Double-DES and why every PQ-KEM hybrid must avoid double-encapsulation patterns vulnerable to the same MITM trick.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Related-Key Attacks and Slide Attacks</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Related-key</div><div class="card-body">Attacker sees encryptions under k and k' = k ⊕ Δ for known Δ. Biryukov-Khovratovich 2009 broke AES-256 in 2^99 work and AES-192 in 2^176 in this model. Real systems rarely allow chosen-related-keys, so production AES is fine — but key-derivation schemes that mix the master key into per-session keys must avoid algebraic relationships.</div></div>
<div class="calc-card"><div class="card-title">Slide attack (Biryukov-Wagner 1999)</div><div class="card-body">If a cipher's round function is identical across all rounds (no round constants), the attacker slides one encryption against another and gets a single-round equation. Killed several reduced-round Feistel ciphers and influenced AES's per-round constants.</div></div>
<div class="calc-card"><div class="card-title">Integral / Square attack</div><div class="card-body">Daemen-Knudsen-Rijmen 1997 attack on the Square cipher (AES's predecessor). Tracks the XOR-sum of byte-positions across many plaintexts. Extends to ~7-round AES today.</div></div>
<div class="calc-card"><div class="card-title">Impossible differentials</div><div class="card-body">Find a differential that occurs with probability exactly 0 in r-1 rounds. Any key guess that produces it in r rounds is wrong. Effective on 5-7 round AES.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Algebraic and SAT-Solver Attacks</h2>
<p class="l-text">Express the cipher as a system of multivariate polynomial equations over GF(2). Solve with Gröbner basis (F4/F5), XL/XSL algorithms (Courtois-Pieprzyk 2002), or modern SAT solvers. The infamous XSL attack on AES (2002) was widely cited but later shown not to give the speedup originally claimed; AES is still safe against algebraic attacks.</p>

<div class="calc-highlight"><strong>SAT-based cryptanalysis is real for reduced-round ciphers:</strong> CryptoMiniSat and Glucose can break ~5 rounds of small ciphers (KATAN, Simon-32, PRESENT-32) by encoding key-recovery as a SAT instance. For full AES the SAT instance has trillions of clauses and no current solver can touch it.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The DES → 3DES → AES Timeline</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1977: DES (FIPS 46)</div><div class="card-body">56-bit key (NSA reduced from IBM's 128). 16 rounds. Designed at IBM by Feistel, Coppersmith, Tuchman; S-boxes secretly tuned against differential cryptanalysis. Adopted as US standard.</div></div>
<div class="calc-card"><div class="card-title">1991: Differential</div><div class="card-body">Biham-Shamir publish differential cryptanalysis. DES is exactly at the boundary — designed to resist. Public is shocked the NSA kept the technique classified for 17 years.</div></div>
<div class="calc-card"><div class="card-title">1993-94: Linear</div><div class="card-body">Matsui's linear cryptanalysis breaks DES in 2^43 KP. Still impractical at the time but a clear sign DES was ending.</div></div>
<div class="calc-card"><div class="card-title">1998: EFF Deep Crack</div><div class="card-body">$250k FPGA cluster brute-forces a DES key in 56 hours. NIST starts the AES competition.</div></div>
<div class="calc-card"><div class="card-title">1998: 3DES (FIPS 46-3)</div><div class="card-body">Encrypt-Decrypt-Encrypt with 3 DES keys. ~112-bit effective security via MITM. Slow (3× DES) but bridges to AES.</div></div>
<div class="calc-card"><div class="card-title">2000: AES competition</div><div class="card-body">15 candidates → 5 finalists → Rijndael (Daemen-Rijmen, Belgium) wins. Better differential / linear bounds, faster than DES, hardware-friendly.</div></div>
<div class="calc-card"><div class="card-title">2001: AES (FIPS 197)</div><div class="card-body">128/192/256-bit keys. 10/12/14 rounds. Wide-trail strategy explicitly bounds best differential / linear trails. Survived 25 years with no practical break.</div></div>
<div class="calc-card"><div class="card-title">2024: 3DES deprecated</div><div class="card-body">NIST SP 800-131A Rev 3 disallows 3DES for encryption after 2023. Last legacy uses (some POS terminals, EMV) being phased out. AES-128 is the floor.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. AES's Defense — The Wide-Trail Strategy</h2>
<p class="l-text">Daemen and Rijmen designed Rijndael with explicit, mathematical resistance bounds. The S-box (a single nonlinear inverse in GF(2^8) followed by an affine map) has maximum DDT and LAT entries of 4 and 16 — provably the best possible for an 8-bit S-box. MixColumns is an MDS matrix with branch number 5 — every 4-byte input/output difference involves at least 5 active S-boxes across 2 rounds. Combine: 4-round AES has at least 25 active S-boxes → best differential trail probability ≤ (4/256)^25 ≈ 2^{-150}, far below brute force.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SubBytes (S-box)</div><div class="card-body">x → x^{-1} in GF(2^8) followed by affine map. Optimal differential / linear properties.</div></div>
<div class="calc-card"><div class="card-title">ShiftRows</div><div class="card-body">Permutes bytes between columns. Cheap diffusion across the state.</div></div>
<div class="calc-card"><div class="card-title">MixColumns</div><div class="card-body">MDS matrix multiplication. Branch number 5. Critical for the wide-trail bound.</div></div>
<div class="calc-card"><div class="card-title">AddRoundKey</div><div class="card-body">XOR with round key derived from master via key schedule. The only secret-dependent step.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Pitfalls — When "Broken" Doesn't Mean "Decryptable"</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Theoretical break vs practical</div><div class="card-body">An attack at 2^126 work on AES-128 is "theoretical break" because brute force is 2^128 — but no one's running 2^126 operations either. Watch what the attack costs in real money / time.</div></div>
<div class="calc-card"><div class="card-title">Reduced-round ≠ full</div><div class="card-body">Most cryptanalysis papers attack 6-9 rounds of a 14-round cipher. Useful for design margins but not deployments. Read the abstract for "rounds" carefully.</div></div>
<div class="calc-card"><div class="card-title">Data complexity</div><div class="card-body">Differential needs 1/p plaintext pairs. If p = 2^{-60}, you need 2^60 pairs — often more than the system will ever encrypt. AES-GCM key-rotation specs limit this.</div></div>
<div class="calc-card"><div class="card-title">SHA-1 example</div><div class="card-body">2017 SHAttered: ~2^63.1 GPU-hours, ~$110k cloud cost. By 2020 chosen-prefix collisions: 2^63.4, ~$45k. The number went from "academic" to "feasible" as compute prices fell.</div></div>
<div class="calc-card"><div class="card-title">Quantum context</div><div class="card-body">Grover halves symmetric strength: AES-128 → 64-bit, AES-256 → 128-bit. Use AES-256 for long-lived data. Asymmetric crypto: see lesson 8 (PQ).</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">Cryptanalysis is the immune system of cryptography: every primitive earns its place by surviving differential, linear, related-key, integral, slide, algebraic, and meet-in-the-middle attacks. DES taught us 56 bits is too few; differential and linear taught us how S-boxes must be designed; meet-in-the-middle taught us why doubling does not square security. AES has survived all of these for 25 years because Rijndael was the first cipher engineered with publicly stated mathematical bounds against the techniques.</p>

<p class="l-text">Lesson 10 — the capstone — leaves the mathematical model entirely and enters the physical world: <strong>side-channel attacks</strong>. Timing leakage from RSA's modular exponentiation (Kocher 1996), power analysis on smartcards (DPA, CPA), electromagnetic emanations, cache attacks (Flush+Reload, Prime+Probe), and the 2018 microarchitectural earthquakes Spectre and Meltdown. The fix — <strong>constant-time coding</strong> — is the practical hygiene every crypto engineer must internalize.</p>
</div>`,
tr: `<p class="l-text"><strong>Kriptanaliz, şifreleri kırma bilimidir.</strong> Bugün üretimdeki her kriptografik primitif, daha önceki bir primitifin kırılması nedeniyle var: Vigenère 19. yüzyıl Kasiski çalışmasına düştü, Enigma 1930'lar-40'larda Polonyalı ve İngiliz analistlere düştü, DES anahtar boyutu kaba kuvveti uygulanabilir kılmadan önce diferansiyel kriptanalize (Biham-Shamir 1991) ve doğrusal kriptanalize (Matsui 1993) düştü (EFF Deep Crack, 1998) ve SHA-1 seçilmiş-önek çakışmalarına düştü (Stevens vd., 2017-2020). 1980'lerin sonu ve 1990'ların başında keşfedilen iki temel teknik — diferansiyel ve doğrusal kriptanaliz — herhangi bir modern simetrik şifrenin savunması gereken ilk araçlardır.</p>

<p class="l-text">Bu derste diferansiyel kriptanalizi (Biham-Shamir 1991, IBM ve NSA'nın 1974'te DES'i tasarlarken gizlice bildiği ancak ifşa etmediği teknik), doğrusal kriptanalizi (Mitsuru Matsui 1993, NTT Japonya), ilişkili-anahtar saldırı modelini, çift-DES'i öldüren ortada-buluşma tekniğini ve azaltılmış-turlu modern şifreleri hedefleyen cebirsel / SAT çözücü / küp saldırılarını yürüyoruz. DES → 3DES → AES zaman çizelgesini izliyoruz ve AES'in S-box'ı ve MixColumns'ının bu saldırılara direnmek için nasıl özellikle tasarlandığıyla kapatıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir S-box için bir diferansiyel dağıtım tablosu (DDT) oluşturun ve en iyi karakteristiği okuyun</li>
<li>Doğrusal kriptanaliz uygulayın: yanlı doğrusal yaklaşımlar bulun ve Matsui'nin Algoritma 2'sini kullanın</li>
<li>İlişkili-anahtar, kayma, integral ve imkânsız-diferansiyel saldırıları tanıyın</li>
<li>Bir kaba kuvvet aramasını yarıya indirmek için ortada-buluşmayı kullanın ve çift-DES'in DES'ten neden daha güçlü olmadığını açıklayın</li>
<li>DES → 3DES → AES zaman çizelgesini ve Rijndael'e işlenmiş tasarım derslerini izleyin</li>
<li>Bir kriptanaliz saldırısının iş faktörünü tahmin edin ve ne zaman "kırık" aslında "kullanılabilir" demektir, bunu söyleyin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Saldırı Modelleri — Bilinen/Seçilmiş Düz Metin, Uyarlanabilir, İlişkili-Anahtar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yalnızca-şifreli metin (COA)</div><div class="card-body">Saldırganın yalnızca şifreli metinleri ve düz metin dağılımının istatistiksel bilgisi vardır. En zor senaryo; klasik dönem (Caesar, Vigenère, monoalfabetik) hepsi burada kırıldı.</div></div>
<div class="calc-card"><div class="card-title">Bilinen-düz metin (KPA)</div><div class="card-body">Saldırganın (P, C) çiftleri vardır. Doğrusal kriptanaliz bu modelde çalışır. Çok gerçekçi — protokol başlıkları düz metin sızdırır.</div></div>
<div class="calc-card"><div class="card-title">Seçilmiş-düz metin (CPA)</div><div class="card-body">Saldırgan istediği her şeyi şifreleyebilir. Diferansiyel kriptanaliz burada yaşar. Uyarlanabilir varyant: önceki şifreli metinlere dayanarak sonraki düz metinleri seçer.</div></div>
<div class="calc-card"><div class="card-title">Seçilmiş-şifreli metin (CCA)</div><div class="card-body">Saldırgan keyfi şifreli metinleri (hedef hariç) çözebilir. Bleichenbacher 1998 RSA padding-oracle saldırısı burada yaşar. Modern AEAD CCA-güvenli olmalıdır.</div></div>
<div class="calc-card"><div class="card-title">İlişkili-anahtar</div><div class="card-body">Saldırgan bilinmeyen ama ilişkili anahtarlar altında şifrelemeleri gözler (örneğin k ve k ⊕ Δ). 2^99'da AES-256'yı yıkar (Biryukov-Khovratovich 2009) — İlişkili-anahtar saldırılarının AES-128/192'yi neden bozmadığı, ancak model çoğu dağıtım için gerçekçi değil.</div></div>
<div class="calc-card"><div class="card-title">Yan-kanal (ders 10)</div><div class="card-body">Zamanlama, güç, EM, önbellek. Yukarıdakilerden farklıdır — yalnızca (P, C) çiftleri değil, fiziksel sızıntı kullanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Diferansiyel Kriptanaliz — Biham &amp; Shamir 1991</h2>
<p class="l-text">Eli Biham ve Adi Shamir, diferansiyel kriptanalizi 1990'da (CRYPTO konferansı; tam makale 1991) tanıttı. Fikir: girdi üzerindeki bir XOR farkı Δ'nın şifre boyunca nasıl yayıldığını izleyin. Her S-box için, ΔX girdi farkının ΔY çıktı farkını ne sıklıkla ürettiğini kaydeden bir <strong>Diferansiyel Dağıtım Tablosu</strong> (DDT) oluşturun. Çoğu hücre 2^n / 2^n = 1'e yakındır; birkaç hücre yüksek olasılıkla öne çıkar. Bu hücreleri turlar arasında zincirleyin → toplam olasılık p ile bir <em>diferansiyel karakteristik</em>. 1/p seçilmiş düz metin çiftleriyle son tur anahtarını kurtarabilirsiniz.</p>

<div class="katex-block">$$\\Pr[\\Delta Y \\mid \\Delta X] = \\frac{|\\{x : S(x) \\oplus S(x \\oplus \\Delta X) = \\Delta Y\\}|}{2^n}$$</div>

<div class="calc-highlight"><strong>IBM/NSA sırrı:</strong> DES'in S-box'ları, diferansiyel kriptanalize direnmek için 1974'te özellikle tasarlandı — ancak IBM, NSA'dan tekniği gizli tutmasını istendi. Biham ve Shamir bunu 17 yıl sonra yeniden keşfettiler. DES'in 16 turu, saldırılarına direnmek için minimumdu. AES tasarımcıları (Daemen-Rijmen) diferansiyel direnci açık, yayımlanmış bir tasarım kriteri yaptı.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak bir 4-bit S-box (PRESENT şifresinin S-box'ı) için DDT oluşturun. En iyi diferansiyeli vurgulayın.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># PRESENT şifresinin 4-bit S-box'ı (kaynak-kısıtlı kripto için tasarlandı, ISO/IEC 29192)</span>
S = [0xC, 0x5, 0x6, 0xB, 0x9, 0x0, 0xA, 0xD, 0x3, 0xE, 0xF, 0x8, 0x4, 0x7, 0x1, 0x2]

<span class="cm"># DDT oluştur</span>
ddt = np.<span class="fn">zeros</span>((<span class="num">16</span>, <span class="num">16</span>), dtype=<span class="fn">int</span>)
<span class="kw">for</span> x <span class="kw">in</span> <span class="fn">range</span>(<span class="num">16</span>):
    <span class="kw">for</span> dx <span class="kw">in</span> <span class="fn">range</span>(<span class="num">16</span>):
        dy = S[x] ^ S[x ^ dx]
        ddt[dx, dy] += <span class="num">1</span>

<span class="fn">print</span>(<span class="str">'DDT (rows = input diff, cols = output diff):'</span>)
<span class="fn">print</span>(ddt)

<span class="cm"># En yüksek önemsiz olmayan olasılık (dx=0 satırını atla)</span>
ddt_no_zero = ddt.<span class="fn">copy</span>()
ddt_no_zero[<span class="num">0</span>, :] = <span class="num">0</span>
imax = np.<span class="fn">unravel_index</span>(ddt_no_zero.<span class="fn">argmax</span>(), ddt_no_zero.shape)
<span class="fn">print</span>(f<span class="str">'\\nbest differential: ΔX={imax[0]:X} -&gt; ΔY={imax[1]:X}, '</span>
      f<span class="str">'count={ddt_no_zero[imax]}/16  (prob={ddt_no_zero[imax]/16})'</span>)

<span class="cm"># PRESENT için maksimum önemsiz olmayan DDT girişi 4/16 = 1/4 — tasarımca çok güçlü.</span>
<span class="cm"># AES S-box'ın maks DDT girişi 4/256 — daha da güçlü.</span>
</code></pre></div></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) PRESENT'in 4-bit S-box'ini sabit kodlar (ISO/IEC 29192-2 hafif şifre, 2007) — IoT-ölçekli silikon için diferansiyel ve doğrusal yanlılığı sınırlamak için özellikle seçilmiş 16-girişli permütasyon. 2) Çift döngü 16×16 Differential Distribution Table'i doldurur: her girdi farkı <code>dx</code> ve her girdi <code>x</code> için, S-box'in <code>(x, x⊕dx)</code> çiftini sabit bir çıktı farkı <code>dy = S(x) ⊕ S(x⊕dx)</code>'ye ne sıklıkta haritaladığını sayar — bu, Biham-Shamir 1991'in DES'e saldırmak için kullandığı tam yapı ve Daemen-Rijmen 1998'in AES direncini kanıtlamak için kullandığı aynı prosedürdür. 3) <code>ddt[0, :] = 0</code> her zaman 16'ya eşit olan trivial <code>dx=0 → dy=0</code> satırını sıfırlar; <code>argmax</code> sonra en yüksek non-trivial girişi bulur — PRESENT için 4/16 = 0.25, yani en iyi diferansiyel karakteristik bir turu 1/4 olasılıkla yayar. 4) Yorumlar doğrular: PRESENT'in maks DDT girişi 4/16 (tasarım tavanı), AES 4/256 — bu sayılar doğrudan r-turlu karakteristik için <code>data complexity ∝ 1/p^r</code>'ya beslenir, ki bu tam olarak 16-tur DES'in diferansiyel saldırıdan sağ çıkmasının ve tam-tur AES'in &gt;2^100 seçilmiş düz metin gerektirmesinin sebebidir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Doğrusal Kriptanaliz — Matsui 1993</h2>
<p class="l-text">Mitsuru Matsui (NTT Japonya) doğrusal kriptanalizi 1993'te tanıttı, 8-tur DES'i kırdı, sonra 1994'te 2^43 bilinen düz metinle tam 16-tur DES'i — tam DES'in ilk kaba-kuvvet olmayan kırılması, 12 iş istasyonunda yaklaşık 50 gün gerektiriyordu. Fikir: 1/2 + ε olasılıkla geçerli olan bir doğrusal yaklaşım a · P ⊕ b · C = c · K bulun (bir "yanlılık" ε). Bunu bir ayırıcı olarak kullanın, sonra anahtar bitlerini kurtarmak için Matsui'nin Algoritma 2'sini.</p>

<div class="katex-block">$$\\Pr[a \\cdot P \\oplus b \\cdot C = c \\cdot K] = \\tfrac{1}{2} + \\varepsilon, \\quad \\text{data complexity} \\propto 1/\\varepsilon^2$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğrusal yaklaşım tablosu (LAT)</div><div class="card-body">Her S-box için, tüm x üzerinde (a · x) = (b · S(x))'in ne sıklıkla olduğunu sayın. 4-bit S-box için yanlılık ε = (sayım - 8) / 16.</div></div>
<div class="calc-card"><div class="card-title">Yığma lemması</div><div class="card-body">Tur yanlılıklarını birleştirin: ε_total = 2^{r-1} · ∏ ε_i. Kaç KP çiftine ihtiyacınız olduğunu söyler.</div></div>
<div class="calc-card"><div class="card-title">Matsui Algoritma 2</div><div class="card-body">Son tur anahtar bitlerini tahmin edin, kısmen şifre çözün, doğrusal ilişkinin ne sıklıkla geçerli olduğunu sayın, maksimum yanlılığa sahip tahmini seçin. DES'in ~26 anahtar bitini kurtarır; geri kalan kaba kuvvetle.</div></div>
<div class="calc-card"><div class="card-title">AES direnci</div><div class="card-body">AES S-box maks yanlılığı = 16/256. İki turluk doğrusal dal numarası = 5 → 4 turluk iz yanlılığı ihmal edilebilir. Tam AES &gt;2^140 KP gerektirir, tamamen imkânsız.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Ortada-Buluşma — Çift-DES Neden Daha Güçlü Değil</h2>
<p class="l-text">Kısa anahtarlara karşı naif bir önlem: iki bağımsız anahtarla iki kez şifreleyin. C = E_{k2}(E_{k1}(P)). Naifçe 2^{2k} kaba kuvvet. Ama Diffie ve Hellman 1977'de fark etti: tüm 2^k k1 değeri için T[E_{k1}(P)] = k1 tablosu oluşturun, sonra her k2 için D_{k2}(C) hesaplayın ve arayın. Toplam iş: 2^k · 2 + 2^k bellek — tek anahtar kaba kuvvetinden yalnızca iki kat. Çift-DES (2^57 iş), MITM'e karşı ~2^112 etkili güvenlik veren 3DES (encrypt-decrypt-encrypt) için terk edildi.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">16-bit anahtarlı bir "çift-şifre" üzerinde oyuncak ortada-buluşma saldırısı. Toplam arama uzayı 2^32, MITM oraya ~2^17'de varır.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets

<span class="cm"># Oyuncak 16-bit blok şifresi: rotate-and-XOR. Tersinir.</span>
<span class="kw">def</span> <span class="fn">E</span>(k, p):
    x = ((p &lt;&lt; <span class="num">3</span>) | (p &gt;&gt; <span class="num">13</span>)) &amp; 0xFFFF
    <span class="kw">return</span> x ^ k

<span class="kw">def</span> <span class="fn">D</span>(k, c):
    x = c ^ k
    <span class="kw">return</span> ((x &gt;&gt; <span class="num">3</span>) | (x &lt;&lt; <span class="num">13</span>)) &amp; 0xFFFF

<span class="cm"># Gerçek anahtarlar</span>
k1_real = secrets.<span class="fn">randbits</span>(<span class="num">16</span>)
k2_real = secrets.<span class="fn">randbits</span>(<span class="num">16</span>)
P = 0x1234
C = <span class="fn">E</span>(k2_real, <span class="fn">E</span>(k1_real, P))

<span class="cm"># Naif: tümü 2^32 dene — biraz zaman alır.  MITM:  ~2 * 2^16 işlem + 2^16 bellek.</span>

<span class="cm"># Adım 1: ileri tablo</span>
fwd = {}
<span class="kw">for</span> k1 <span class="kw">in</span> <span class="fn">range</span>(0x10000):
    fwd.<span class="fn">setdefault</span>(<span class="fn">E</span>(k1, P), []).<span class="fn">append</span>(k1)

<span class="cm"># Adım 2: geri arama</span>
candidates = []
<span class="kw">for</span> k2 <span class="kw">in</span> <span class="fn">range</span>(0x10000):
    mid = <span class="fn">D</span>(k2, C)
    <span class="kw">if</span> mid <span class="kw">in</span> fwd:
        <span class="kw">for</span> k1 <span class="kw">in</span> fwd[mid]:
            candidates.<span class="fn">append</span>((k1, k2))

<span class="fn">print</span>(f<span class="str">'real keys:          ({k1_real:04X}, {k2_real:04X})'</span>)
<span class="fn">print</span>(f<span class="str">'MITM candidates:    {len(candidates)} (one is real, rest are false positives)'</span>)
<span class="fn">print</span>(f<span class="str">'first candidate:    {candidates[0]}  -&gt; we found the real keys among them: '</span>
      f<span class="str">'{(k1_real, k2_real) in candidates}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Tersinir bir oyuncak 16-bit blok cipher tanımlar: <code>E(k, p)</code> plaintext'i 3 bit sola döndürür ve anahtarla XOR'lar; <code>D</code> bunu tersine çevirir — yapı kasıtlı olarak zayıftır, böylece demo anında çalışır ama MITM'in sömürdüğü özelliği korur (iki bağımsız anahtarla şifreleme-sonra-şifreleme). 2) Hedefi kurar: <code>secrets</code>'tan çekilen gerçek anahtarlar <code>(k1_real, k2_real)</code>, plaintext <code>P=0x1234</code>, ciphertext <code>C = E(k2, E(k1, P))</code> — kaba kuvvet <code>2^32</code> iş gerektirir, tam olarak Diffie-Hellman'in 1977'de işaret ettiği Double-DES durumu. 3) Adım 1, <code>2^16</code> iş ve <code>2^16</code> bellek ile forward tablo <code>fwd[E(k1, P)] = [k1, ...]</code> inşa eder — bu, 2^32 problemini ~2^17 toplama dönüştüren time-memory tradeoff'tur. 4) Adım 2, tüm <code>2^16</code> aday <code>k2</code> değerini yineler, "midpoint" <code>D(k2, C)</code>'i hesaplar ve <code>fwd</code>'de bakar — her eşleşme bir aday <code>(k1, k2)</code> çifti verir; çıktı gerçek anahtarların her zaman adaylar arasında olduğunu gösterir, ki bu 3DES'in (encrypt-decrypt-encrypt) düz Double-DES yerine seçilmesinin ve her PQ-KEM hibridinin aynı MITM hilesine açık çift-encapsulation desenlerinden kaçınması gerektiğinin ders kitabı nedenidir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. İlişkili-Anahtar Saldırıları ve Kayma Saldırıları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">İlişkili-anahtar</div><div class="card-body">Saldırgan, bilinen Δ için k ve k' = k ⊕ Δ altında şifrelemeleri görür. Biryukov-Khovratovich 2009 bu modelde AES-256'yı 2^99 işle ve AES-192'yi 2^176'da kırdı. Gerçek sistemler nadiren seçilmiş-ilişkili-anahtarlara izin verir, dolayısıyla üretim AES'i iyidir — ancak ana anahtarı oturum başına anahtarlara karıştıran anahtar-türetme şemaları cebirsel ilişkilerden kaçınmalıdır.</div></div>
<div class="calc-card"><div class="card-title">Kayma saldırısı (Biryukov-Wagner 1999)</div><div class="card-body">Bir şifrenin tur fonksiyonu tüm turlar boyunca aynıysa (tur sabitleri yok), saldırgan bir şifrelemeyi diğerine kaydırır ve tek tur denklemi alır. Birkaç azaltılmış-turlu Feistel şifresini öldürdü ve AES'in tur başına sabitlerini etkiledi.</div></div>
<div class="calc-card"><div class="card-title">İntegral / Kare saldırısı</div><div class="card-body">Daemen-Knudsen-Rijmen 1997 Square şifresine (AES'in öncülü) saldırı. Birçok düz metin boyunca bayt pozisyonlarının XOR-toplamını izler. Bugün ~7-tur AES'e uzanır.</div></div>
<div class="calc-card"><div class="card-title">İmkânsız diferansiyeller</div><div class="card-body">r-1 turunda tam olarak 0 olasılıkla oluşan bir diferansiyel bulun. Onu r turunda üreten herhangi bir anahtar tahmini yanlıştır. 5-7 tur AES'te etkili.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Cebirsel ve SAT Çözücü Saldırıları</h2>
<p class="l-text">Şifreyi GF(2) üzerindeki çok değişkenli polinom denklemleri sistemi olarak ifade edin. Gröbner tabanı (F4/F5), XL/XSL algoritmaları (Courtois-Pieprzyk 2002) veya modern SAT çözücüler ile çözün. Kötü şöhretli AES'e XSL saldırısı (2002) yaygın olarak alıntılandı ancak daha sonra orijinal olarak iddia edilen hızlandırmayı vermediği gösterildi; AES cebirsel saldırılara karşı hâlâ güvenlidir.</p>

<div class="calc-highlight"><strong>SAT tabanlı kriptanaliz, azaltılmış-turlu şifreler için gerçektir:</strong> CryptoMiniSat ve Glucose, anahtar-kurtarmayı bir SAT örneği olarak kodlayarak küçük şifrelerin (KATAN, Simon-32, PRESENT-32) ~5 turunu kırabilir. Tam AES için SAT örneği trilyonlarca cümleye sahiptir ve mevcut hiçbir çözücü ona dokunamaz.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. DES → 3DES → AES Zaman Çizelgesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1977: DES (FIPS 46)</div><div class="card-body">56-bit anahtar (NSA IBM'in 128'inden indirdi). 16 tur. IBM'de Feistel, Coppersmith, Tuchman tarafından tasarlandı; S-box'lar diferansiyel kriptanalize karşı gizlice ayarlandı. ABD standardı olarak benimsendi.</div></div>
<div class="calc-card"><div class="card-title">1991: Diferansiyel</div><div class="card-body">Biham-Shamir diferansiyel kriptanalizi yayımladı. DES tam sınırda — direnmek için tasarlandı. Kamu, NSA'nın tekniği 17 yıl gizli tutmasından şok oldu.</div></div>
<div class="calc-card"><div class="card-title">1993-94: Doğrusal</div><div class="card-body">Matsui'nin doğrusal kriptanalizi DES'i 2^43 KP'de kırar. O zamanlar hâlâ pratik değil ama DES'in sona erdiğinin açık bir işareti.</div></div>
<div class="calc-card"><div class="card-title">1998: EFF Deep Crack</div><div class="card-body">250 bin dolarlık FPGA kümesi 56 saatte bir DES anahtarını kaba kuvvetle kırar. NIST AES yarışmasını başlatır.</div></div>
<div class="calc-card"><div class="card-title">1998: 3DES (FIPS 46-3)</div><div class="card-body">3 DES anahtarı ile Encrypt-Decrypt-Encrypt. MITM aracılığıyla ~112-bit etkili güvenlik. Yavaş (3× DES) ama AES'e köprüler.</div></div>
<div class="calc-card"><div class="card-title">2000: AES yarışması</div><div class="card-body">15 aday → 5 finalist → Rijndael (Daemen-Rijmen, Belçika) kazanır. Daha iyi diferansiyel / doğrusal sınırlar, DES'ten hızlı, donanım dostu.</div></div>
<div class="calc-card"><div class="card-title">2001: AES (FIPS 197)</div><div class="card-body">128/192/256-bit anahtarlar. 10/12/14 tur. Geniş-iz stratejisi en iyi diferansiyel / doğrusal izleri açıkça sınırlar. Pratik kırılma olmadan 25 yıl hayatta kaldı.</div></div>
<div class="calc-card"><div class="card-title">2024: 3DES kullanımdan kaldırıldı</div><div class="card-body">NIST SP 800-131A Rev 3, 2023'ten sonra şifreleme için 3DES'e izin vermez. Son eski kullanımlar (bazı POS terminalleri, EMV) aşamalı olarak kaldırılıyor. AES-128 tabandır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. AES'in Savunması — Geniş-İz Stratejisi</h2>
<p class="l-text">Daemen ve Rijmen, Rijndael'i açık, matematiksel direnç sınırları ile tasarladı. S-box (GF(2^8)'de tek bir doğrusal olmayan ters ve ardından bir afin harita) maksimum DDT ve LAT girişleri 4 ve 16'ya sahiptir — kanıtlanabilir şekilde 8-bit S-box için mümkün olan en iyisi. MixColumns dal numarası 5 olan bir MDS matrisidir — her 4-bayt giriş/çıkış farkı 2 tur boyunca en az 5 aktif S-box içerir. Birleştirin: 4-tur AES en az 25 aktif S-box'a sahiptir → en iyi diferansiyel iz olasılığı ≤ (4/256)^25 ≈ 2^{-150}, kaba kuvvetin çok altında.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SubBytes (S-box)</div><div class="card-body">x → GF(2^8)'de x^{-1} ve ardından afin harita. Optimal diferansiyel / doğrusal özellikler.</div></div>
<div class="calc-card"><div class="card-title">ShiftRows</div><div class="card-body">Baytları sütunlar arasında permüte eder. State boyunca ucuz yayılım.</div></div>
<div class="calc-card"><div class="card-title">MixColumns</div><div class="card-body">MDS matris çarpımı. Dal numarası 5. Geniş-iz sınırı için kritik.</div></div>
<div class="calc-card"><div class="card-title">AddRoundKey</div><div class="card-body">Anahtar planlaması aracılığıyla anadan türetilen tur anahtarı ile XOR. Tek sırra bağlı adım.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tuzaklar — "Kırık" "Şifre Çözülebilir" Anlamına Gelmediğinde</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Teorik kırılma vs pratik</div><div class="card-body">AES-128'e 2^126 işle bir saldırı "teorik kırılma"dır çünkü kaba kuvvet 2^128'dir — ama kimse 2^126 işlem de çalıştırmıyor. Saldırının gerçek para / zamanda neye mal olduğunu izleyin.</div></div>
<div class="calc-card"><div class="card-title">Azaltılmış-turlu ≠ tam</div><div class="card-body">Çoğu kriptanaliz makalesi 14-tur şifrenin 6-9 turuna saldırır. Tasarım marjları için yararlı ama dağıtımlar için değil. "Turlar" için özeti dikkatlice okuyun.</div></div>
<div class="calc-card"><div class="card-title">Veri karmaşıklığı</div><div class="card-body">Diferansiyel 1/p düz metin çifti gerektirir. p = 2^{-60} ise, 2^60 çift gerekir — genellikle sistemin asla şifreleyemeyeceğinden fazla. AES-GCM anahtar-rotasyon spesifikasyonları bunu sınırlar.</div></div>
<div class="calc-card"><div class="card-title">SHA-1 örneği</div><div class="card-body">2017 SHAttered: ~2^63.1 GPU-saati, ~110 bin dolar bulut maliyeti. 2020'ye kadar seçilmiş-önek çakışmaları: 2^63.4, ~45 bin dolar. Sayı, hesaplama fiyatları düştükçe "akademik"ten "uygulanabilir"e geçti.</div></div>
<div class="calc-card"><div class="card-title">Kuantum bağlamı</div><div class="card-body">Grover simetrik gücü yarılar: AES-128 → 64-bit, AES-256 → 128-bit. Uzun ömürlü veri için AES-256 kullanın. Asimetrik kripto: bkz. ders 8 (PQ).</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">Kriptanaliz, kriptografinin bağışıklık sistemidir: her primitif diferansiyel, doğrusal, ilişkili-anahtar, integral, kayma, cebirsel ve ortada-buluşma saldırılarından sağ kalarak yerini kazanır. DES bize 56 bitin çok az olduğunu öğretti; diferansiyel ve doğrusal bize S-box'ların nasıl tasarlanması gerektiğini öğretti; ortada-buluşma bize iki katına çıkarmanın güvenliği neden kareye almadığını öğretti. AES bunların hepsinden 25 yıldır sağ kaldı çünkü Rijndael, tekniklere karşı kamuya açıkça belirtilmiş matematiksel sınırlarla tasarlanmış ilk şifreydi.</p>

<p class="l-text">Ders 10 — kapanış — matematiksel modeli tamamen terk eder ve fiziksel dünyaya girer: <strong>yan-kanal saldırıları</strong>. RSA'nın modüler üs almasından zamanlama sızıntısı (Kocher 1996), akıllı kartlarda güç analizi (DPA, CPA), elektromanyetik yayılımlar, önbellek saldırıları (Flush+Reload, Prime+Probe) ve 2018 mikromimari depremleri Spectre ve Meltdown. Düzeltme — <strong>sabit-zamanlı kodlama</strong> — her kripto mühendisinin içselleştirmesi gereken pratik hijyendir.</p>
</div>`
};
