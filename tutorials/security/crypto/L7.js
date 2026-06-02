window.CRYPTO_L7 = {
en: `<p class="l-text"><strong>Secure Multiparty Computation (MPC) is the cryptography of "let us compute together without trusting each other."</strong> Andrew Yao introduced the field in 1982 with the Millionaires' Problem: two millionaires want to know which of them is richer, without revealing their actual wealth. Yao's solution — <em>garbled circuits</em> — was both an existence proof and the first practical protocol. Forty years later MPC is in production: Boston's gender-pay-gap study used MPC to aggregate salaries from 100+ companies without any company seeing another's; Estonia's tax authority uses MPC for joint statistics with private companies; Unbound Tech (now Coinbase) and Sepior secure billions of dollars of cryptocurrency keys with threshold-MPC ECDSA.</p>

<p class="l-text">In this lesson we walk Shamir secret sharing (1979) — the polynomial-interpolation building block underneath almost everything — Yao's garbled circuits with a hands-on toy AND gate, the GMW (Goldreich-Micali-Wigderson 1987) protocol for boolean circuits, and the modern arithmetic-circuit family BGW (Ben-Or-Goldwasser-Wigderson 1988) and SPDZ (pronounced "speedz", Damgård-Pastro-Smart-Zakarias 2012). We close with real systems: Sharemind (Cybernetica, Estonia), MP-SPDZ (the open-source Swiss Army knife of MPC), and the threshold-ECDSA wallets that hold actual cryptocurrency reserves.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Set up an n-party (t, n) Shamir secret sharing scheme and reconstruct via Lagrange interpolation</li>
<li>Garble a 2-input AND gate and walk Yao's protocol step-by-step</li>
<li>Distinguish GMW (boolean), BGW (arithmetic), SPDZ (malicious-secure with MACs)</li>
<li>Pick a security model: semi-honest vs malicious, honest majority vs dishonest majority</li>
<li>Recognize when MPC fits (joint statistics, ad attribution, threshold signatures) and when it does not</li>
<li>Read MP-SPDZ programs and estimate communication cost (often the bottleneck, not compute)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Millionaires' Problem and Yao's Big Idea</h2>
<p class="l-text">Yao's 1982 paper "Protocols for Secure Computations" posed the question: two parties Alice and Bob, each holding a private number, want to compute f(a, b) — for example, f(a, b) = (a &lt; b) — and learn only the output, not each other's input. Yao's answer is <strong>garbled circuits</strong>: Alice converts a boolean circuit for f into a "garbled" form where every wire is represented by random keys (one for 0, one for 1) and every gate is an encrypted truth table that can only be opened with the right key combination.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Garbler (Alice)</div><div class="card-body">Builds the garbled circuit, sends it to Evaluator. Knows her own input keys; sends those directly. Evaluator's input keys come via Oblivious Transfer.</div></div>
<div class="calc-card"><div class="card-title">Evaluator (Bob)</div><div class="card-body">Receives keys for both Alice's input wires (the right ones) and his own (via OT). Walks the circuit gate-by-gate, decrypting one row of each garbled table. Reaches the output wire keys.</div></div>
<div class="calc-card"><div class="card-title">Output decoding</div><div class="card-body">Either Alice publishes a (key → 0/1) translation table for each output wire, or the output is XOR-shared back to both parties.</div></div>
<div class="calc-card"><div class="card-title">Oblivious Transfer (OT)</div><div class="card-body">The crypto primitive that lets Bob get the right input keys for his bits without Alice learning which bits Bob has. Rabin's OT (1981) → Even-Goldreich-Lempel 1985. OT extension (Ishai et al. 2003) makes millions of OTs cheap.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Shamir Secret Sharing — The Polynomial Trick</h2>
<p class="l-text">Adi Shamir's 1979 paper "How to Share a Secret" gives the cryptographic primitive that almost every honest-majority MPC protocol uses internally. To share a secret <em>s</em> among n parties so that any t can reconstruct but t-1 learn nothing:</p>

<div class="katex-block">$$\\text{Pick random } a_1, \\ldots, a_{t-1} \\in \\mathbb{F}_p, \\quad p(x) = s + a_1 x + a_2 x^2 + \\cdots + a_{t-1} x^{t-1}$$</div>

<p class="l-text">Give party i the share (i, p(i)). Any t shares determine the polynomial via Lagrange interpolation, so they recover p(0) = s. Any t-1 shares are uniformly distributed (information-theoretically independent of s), so they reveal nothing.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">(3, 5) Shamir secret sharing in numpy. We split a secret into 5 shares, reconstruct from any 3, and confirm 2 shares reveal nothing.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> secrets

p = <span class="num">2</span>**<span class="num">31</span> - <span class="num">1</span>   <span class="cm"># Mersenne prime, use as field</span>

<span class="kw">def</span> <span class="fn">share</span>(s, t, n):
    coeffs = [s] + [secrets.<span class="fn">randbelow</span>(p) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(t - <span class="num">1</span>)]
    pts = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, n + <span class="num">1</span>):
        y = <span class="num">0</span>
        <span class="kw">for</span> k, c <span class="kw">in</span> <span class="fn">enumerate</span>(coeffs):
            y = (y + c * <span class="fn">pow</span>(i, k, p)) % p
        pts.<span class="fn">append</span>((i, y))
    <span class="kw">return</span> pts

<span class="kw">def</span> <span class="fn">lagrange_at_0</span>(points):
    s = <span class="num">0</span>
    <span class="kw">for</span> j, (xj, yj) <span class="kw">in</span> <span class="fn">enumerate</span>(points):
        num, den = <span class="num">1</span>, <span class="num">1</span>
        <span class="kw">for</span> m, (xm, _) <span class="kw">in</span> <span class="fn">enumerate</span>(points):
            <span class="kw">if</span> m == j: <span class="kw">continue</span>
            num = (num * (-xm)) % p
            den = (den * (xj - xm)) % p
        s = (s + yj * num * <span class="fn">pow</span>(den, -<span class="num">1</span>, p)) % p
    <span class="kw">return</span> s

secret = <span class="num">4242</span>
shares = <span class="fn">share</span>(secret, t=<span class="num">3</span>, n=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">'shares:'</span>, shares)

<span class="cm"># Any 3 shares reconstruct</span>
<span class="kw">for</span> combo <span class="kw">in</span> [shares[:<span class="num">3</span>], shares[<span class="num">2</span>:], [shares[<span class="num">0</span>], shares[<span class="num">2</span>], shares[<span class="num">4</span>]]]:
    <span class="fn">print</span>(f<span class="str">'reconstruct from {[s[0] for s in combo]}: {lagrange_at_0(combo)}'</span>)

<span class="cm"># Two shares look uniformly random — different (s, randomness) give the same two shares</span>
<span class="fn">print</span>(<span class="str">'\\n2 shares reveal nothing:'</span>)
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    fake_secret = secrets.<span class="fn">randbelow</span>(<span class="num">100</span>)
    fake_shares = <span class="fn">share</span>(fake_secret, t=<span class="num">3</span>, n=<span class="num">5</span>)
    <span class="fn">print</span>(f<span class="str">'  shares 1,2 from fake secret {fake_secret}: {fake_shares[:2]}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Uses Mersenne prime <code>p = 2^31 − 1</code> as the finite field F_p — real SPDZ / Sharemind typically operate over 64-bit or 128-bit primes but the algebra is identical, only the modular inverse for Lagrange interpolation over F_p needs to be constant-time. 2) <code>share(s, t, n)</code> builds a degree-(t-1) polynomial with constant term equal to the secret <code>s</code> and t-1 random higher coefficients; for each party i it computes <code>(i, p(i))</code> — the canonical Shamir 1979 scheme where any t shares uniquely determine the polynomial and any t-1 shares are information-theoretically independent of <code>s</code>. 3) <code>lagrange_at_0(points)</code> applies the Lagrange interpolation formula at x=0 — recovering p(0)=s from a subset of shares; each term builds <code>num/den</code> as the basis polynomial and <code>pow(den, -1, p)</code> uses Python 3.8+'s built-in extended Euclidean for the modular inverse. 4) Three different 3-share combinations (first 3, last 3, disjoint pick) all recover <code>4242</code> — proving reconstruction from any t shares — while the fake-secret loop shows why two shares stay hidden: thanks to the random higher coefficients the same two points are consistent with infinitely many different secrets, so t-1 shares are information-theoretically uniform.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Yao's Garbled Circuit — A Toy AND Gate</h2>
<p class="l-text">Walk through one AND gate. Wire <em>a</em> has keys K_a^0 and K_a^1; wire <em>b</em> has K_b^0 and K_b^1; output wire <em>c</em> has K_c^0 and K_c^1. The garbled gate is a list of four ciphertexts, one per row of the AND truth table:</p>

<div class="katex-block">$$\\text{Enc}_{K_a^0}(\\text{Enc}_{K_b^0}(K_c^0)),\\; \\text{Enc}_{K_a^0}(\\text{Enc}_{K_b^1}(K_c^0)),\\; \\text{Enc}_{K_a^1}(\\text{Enc}_{K_b^0}(K_c^0)),\\; \\text{Enc}_{K_a^1}(\\text{Enc}_{K_b^1}(K_c^1))$$</div>

<p class="l-text">Shuffle the four rows. The evaluator, holding the key for the <em>actual</em> bit on each input wire, can decrypt exactly one row — the right output wire key. They learn the output bit only when output decoding is published.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy garbled AND gate using AES-CTR-style XOR-with-hash encryption. We garble all four rows, shuffle, and evaluate.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, secrets, random

<span class="kw">def</span> <span class="fn">H</span>(*keys, length=<span class="num">16</span>):
    h = hashlib.<span class="fn">sha256</span>()
    <span class="kw">for</span> k <span class="kw">in</span> keys: h.<span class="fn">update</span>(k)
    <span class="kw">return</span> h.<span class="fn">digest</span>()[:length]

<span class="kw">def</span> <span class="fn">xor</span>(a, b):
    <span class="kw">return</span> <span class="fn">bytes</span>(x ^ y <span class="kw">for</span> x, y <span class="kw">in</span> <span class="fn">zip</span>(a, b))

<span class="kw">def</span> <span class="fn">kg</span>():
    <span class="kw">return</span> secrets.<span class="fn">token_bytes</span>(<span class="num">16</span>)

<span class="cm"># Wire keys</span>
Ka0, Ka1 = <span class="fn">kg</span>(), <span class="fn">kg</span>()
Kb0, Kb1 = <span class="fn">kg</span>(), <span class="fn">kg</span>()
Kc0, Kc1 = <span class="fn">kg</span>(), <span class="fn">kg</span>()

<span class="cm"># AND truth table: c = a AND b</span>
truth = [
    (Ka0, Kb0, Kc0),
    (Ka0, Kb1, Kc0),
    (Ka1, Kb0, Kc0),
    (Ka1, Kb1, Kc1),
]

<span class="kw">def</span> <span class="fn">encrypt</span>(k1, k2, m):
    pad = <span class="fn">H</span>(k1, k2)
    <span class="kw">return</span> <span class="fn">xor</span>(pad, m + b<span class="str">'\\x00'</span> * (<span class="num">16</span> - <span class="fn">len</span>(m)))

<span class="kw">def</span> <span class="fn">decrypt</span>(k1, k2, c):
    pad = <span class="fn">H</span>(k1, k2)
    <span class="kw">return</span> <span class="fn">xor</span>(pad, c).<span class="fn">rstrip</span>(b<span class="str">'\\x00'</span>)

garbled_rows = [<span class="fn">encrypt</span>(ka, kb, kc) <span class="kw">for</span> (ka, kb, kc) <span class="kw">in</span> truth]
random.<span class="fn">shuffle</span>(garbled_rows)

<span class="cm"># Evaluator has Ka1, Kb1 (a=1, b=1).  Tries each row, finds the one whose</span>
<span class="cm"># decryption matches a known output key.</span>
ka_eval, kb_eval = Ka1, Kb1
<span class="kw">for</span> row <span class="kw">in</span> garbled_rows:
    out = <span class="fn">decrypt</span>(ka_eval, kb_eval, row)
    <span class="kw">if</span> out == Kc0[:<span class="fn">len</span>(out)] <span class="kw">or</span> out == Kc1[:<span class="fn">len</span>(out)]:
        out_full = out + b<span class="str">'\\x00'</span> * (<span class="num">16</span> - <span class="fn">len</span>(out))
        bit = <span class="num">0</span> <span class="kw">if</span> out_full == Kc0 <span class="kw">else</span> <span class="num">1</span>
        <span class="fn">print</span>(f<span class="str">'evaluator decoded output wire key, bit = {bit}'</span>)
        <span class="kw">break</span>

<span class="cm"># Note: in practice the evaluator does not test against Kc0/Kc1 directly;</span>
<span class="cm"># point-and-permute / free-XOR / half-gates make decryption deterministic.</span>
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>kg()</code> draws fresh 128-bit AES-grade keys for each wire (Ka0/Ka1 for input <em>a</em>, Kb0/Kb1 for <em>b</em>, Kc0/Kc1 for output <em>c</em>) — exactly the wire-label trick Yao 1986 introduced so that holding a key reveals nothing about which logical bit it encodes. 2) The <code>truth</code> table encodes AND: rows (0,0)→0, (0,1)→0, (1,0)→0, (1,1)→1; <code>encrypt(k1, k2, m) = m ⊕ SHA-256(k1||k2)</code> is the double-key-encryption stand-in for the AES-CTR-with-tweaks construction (FreeXOR + half-gates) modern garbling uses. 3) <code>random.shuffle(garbled_rows)</code> permutes the four ciphertexts so the row order leaks no information about input bits — combined with point-and-permute pointer bits in production, the evaluator decrypts <em>only</em> the row matching its input labels in O(1) time. 4) The evaluator holding <code>(Ka1, Kb1)</code> tries each shuffled row; SHA-256(Ka1||Kb1) only unpads to <code>Kc1</code> on the (1,1)→1 row, so the loop hits the <code>Kc1</code> match and prints <code>bit = 1</code> — Alice never sees Bob's input, Bob never sees Alice's, and only the output bit is revealed when the Kc0/Kc1 ↔ {0,1} table is published.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GMW — Boolean Circuits with XOR-Sharing</h2>
<p class="l-text">Goldreich-Micali-Wigderson 1987 generalized Yao to <em>n</em> parties for boolean circuits. Each wire's value <em>w</em> is XOR-shared: party i holds <em>w_i</em> with ⊕ w_i = w. XOR gates are free (parties locally XOR their shares). AND gates require an interactive sub-protocol — typically a 1-out-of-4 OT per gate — so deep circuits become communication-bound.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">XOR is free</div><div class="card-body">a ⊕ b shared as (a_1 ⊕ b_1, a_2 ⊕ b_2). No communication. Same property in Yao's free-XOR optimization (Kolesnikov-Schneider 2008).</div></div>
<div class="calc-card"><div class="card-title">AND needs OT</div><div class="card-body">For each AND gate per round, parties run an OT-based multiplication protocol. ~2 round-trips per gate. Critical to batch using OT extension.</div></div>
<div class="calc-card"><div class="card-title">Round complexity</div><div class="card-body">GMW rounds = circuit depth. Yao = constant rounds (one big garbled circuit). For deep nets, Yao wins on rounds; GMW wins on total bandwidth.</div></div>
<div class="calc-card"><div class="card-title">Modern boolean MPC</div><div class="card-body">2PC: usually Yao with half-gates (Zahur-Rosulek-Evans 2015) — 2 ciphertexts per AND. n-PC: GMW + Beaver triples. Used in EMP-toolkit, ABY, MP-SPDZ.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. BGW and Arithmetic MPC — Honest Majority</h2>
<p class="l-text">Ben-Or-Goldwasser-Wigderson 1988 (and independently Chaum-Crépeau-Damgård 1988) showed that with an honest majority (t &lt; n/2), MPC over arithmetic circuits can be done with <em>information-theoretic</em> security — no cryptographic assumptions. Each input is Shamir-shared. Addition is local (sum of polynomials). Multiplication uses a degree-doubling trick + degree reduction with fresh sharings.</p>

<div class="calc-highlight"><strong>Why arithmetic matters:</strong> ML, statistics, finance all live in integers / floats, not bits. A boolean circuit for 32-bit multiplication is ~5000 AND gates; an arithmetic-circuit multiplication is one Beaver-triple consumption. For numerical workloads, arithmetic MPC is 100-1000× faster in communication.</div>

<p class="l-text">Sharemind (Cybernetica, Estonia, 2007+) is the production deployment. Three computation servers in three different non-colluding jurisdictions; users secret-share inputs across them; servers run Sharemind's domain-specific language (SecreC) and produce a public (or shared) result. Estonia's 2015 Tax Authority joint study with private companies ran on Sharemind.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SPDZ — Malicious Security with Information-Theoretic MACs</h2>
<p class="l-text">SPDZ (Damgård-Pastro-Smart-Zakarias 2012, "Multiparty Computation from Somewhat Homomorphic Encryption") is the de-facto modern MPC protocol for malicious security with dishonest majority (any number of corrupted parties up to n-1). Each shared value carries an information-theoretic MAC under a globally-shared secret key α. If a malicious party sends a forged share, the MAC check fails at output time and the protocol aborts.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Online phase</div><div class="card-body">Linear computation only — additions are free, multiplications consume preprocessed Beaver triples. Very fast: ~1 μs per multiplication on a LAN.</div></div>
<div class="calc-card"><div class="card-title">Preprocessing phase</div><div class="card-body">Generate Beaver triples (a, b, c=a·b) shared with MACs. Uses oblivious transfer + somewhat-HE (BFV) or oblivious-transfer-only (MASCOT, Keller-Orsini-Scholl 2016). Heavy but offline.</div></div>
<div class="calc-card"><div class="card-title">MP-SPDZ</div><div class="card-body">Marcel Keller's open-source library at Aarhus / NTNU implementing SPDZ, MASCOT, BMR, Yao, GMW, BGW — 30+ protocols in one. The Swiss Army knife of MPC. Used in research and several production deployments.</div></div>
<div class="calc-card"><div class="card-title">Threshold ECDSA</div><div class="card-body">Specialized SPDZ-style protocols for distributed signing. GG18, GG20 (Gennaro-Goldfeder), Lindell17, CCLST20 — used by Coinbase Custody, Fireblocks, Sepior to protect billions in crypto without any single signer.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — MP-SPDZ requires C++ build + multi-party setup. Sketch only.</span>
<span class="cm"># https://github.com/data61/MP-SPDZ</span>
<span class="cm">#</span>
<span class="cm"># A minimal SPDZ Python source for "compute average salary across 3 parties":</span>
<span class="cm">#</span>
<span class="cm">#   from Compiler.types import sint</span>
<span class="cm">#   n = 3</span>
<span class="cm">#   shares = [sint.get_input_from(i) for i in range(n)]</span>
<span class="cm">#   total  = sum(shares)</span>
<span class="cm">#   avg    = total / n</span>
<span class="cm">#   print_ln('average = %s', avg.reveal())</span>
<span class="cm">#</span>
<span class="cm"># Compile:  ./compile.py average 3</span>
<span class="cm"># Run on 3 servers:  ./mascot-party.x 0 average / .x 1 average / .x 2 average</span>
<span class="cm"># Each server feeds its own integer salary; only the average is revealed.</span>
<span class="fn">print</span>(<span class="str">'See MP-SPDZ tutorial for runnable installation: github.com/data61/MP-SPDZ'</span>)
</code></pre>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Beaver Triples — The Multiplication Magic</h2>
<p class="l-text">Donald Beaver's 1991 trick reduces every secure multiplication to two openings. Preprocess random shared (a, b, c=a·b) — a Beaver triple. To multiply shared x and y: open ε = x - a and δ = y - b, then compute z = c + ε·b + δ·a + ε·δ. All operations on shares are local; only ε, δ are revealed (and they look uniformly random because a, b are random).</p>

<div class="katex-block">$$xy = (\\varepsilon + a)(\\delta + b) = \\varepsilon \\delta + \\varepsilon b + \\delta a + ab = \\varepsilon \\delta + \\varepsilon b + \\delta a + c$$</div>

<p class="l-text">Triples are the consumable resource of MPC. Generate them in bulk during preprocessing (slow but offline). The online phase consumes triples linearly per multiplication (fast, 1-2 μs on LAN). All modern MPC protocols are built around this two-phase model.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Real Deployments — Boston Pay Gap, Estonia, Threshold Wallets</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Boston Women's Workforce Council (2017+)</div><div class="card-body">100+ Boston companies submit salary data via MPC; aggregate pay-gap statistics published, no company sees another's data. Built on Boston University's <a style="color:#c8a96e">Conclave</a> + Sharemind.</div></div>
<div class="calc-card"><div class="card-title">Estonia Tax + ITL Studies (2015)</div><div class="card-body">Joint statistics between Estonia's Tax Authority and private firms about employment durations and education impact on income, with full input privacy. Sharemind on three servers.</div></div>
<div class="calc-card"><div class="card-title">Coinbase / Fireblocks Threshold Custody</div><div class="card-body">ECDSA private keys split (3-of-5, 5-of-7) across HSMs in different geographies. Any signature requires online MPC; no single host ever holds the key. Billions of dollars secured.</div></div>
<div class="calc-card"><div class="card-title">Apple Find My / PSI</div><div class="card-body">Private set intersection: Apple finds matching CSAM hashes (when feature was active 2021) or matching device hashes without learning anything else. Variants of MPC + HE.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Pitfalls — Communication, Malicious Security, Side-Channels</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bandwidth, not compute</div><div class="card-body">MPC is almost always network-bound. A 1 Gbps LAN = ~10× the throughput of a 100 Mbps link. Plan deployments around topology, not CPU.</div></div>
<div class="calc-card"><div class="card-title">Semi-honest is not enough</div><div class="card-body">If even one party is malicious, semi-honest MPC leaks. Always pay the malicious-security premium (SPDZ, BMR) for adversarial deployments.</div></div>
<div class="calc-card"><div class="card-title">Aborting attacks</div><div class="card-body">Malicious-secure MPC aborts on cheating, but aborts can be selectively triggered to leak information about inputs. Mitigations: identifiable abort (catch the cheater) + fairness protocols.</div></div>
<div class="calc-card"><div class="card-title">Side-channel timing</div><div class="card-body">Branching on shared values reveals them. MPC programs must be data-oblivious — every input takes the same control-flow path. Compilers (Picco, MOTION) enforce this.</div></div>
<div class="calc-card"><div class="card-title">Floating point</div><div class="card-body">MPC works over finite fields, not IEEE 754. Use fixed-point with careful scaling, or libraries (Falcon, CrypTen) that emulate float over integer shares. Round-off behavior differs.</div></div>
<div class="calc-card"><div class="card-title">Collusion model</div><div class="card-body">3-server (Sharemind) needs the three operators to be in different jurisdictions and distinct legal entities. Otherwise the "non-collusion" assumption is contractual fiction.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">MPC turns "trust no one, compute together" from a paradox into protocol. Yao's garbled circuits give us 2PC; Shamir secret sharing + BGW give us honest-majority arithmetic; SPDZ + MP-SPDZ give us malicious-secure dishonest-majority deployment. Production systems already secure cryptocurrency wallets, anonymize statistics across jurisdictions, and underpin the EU's growing privacy-preserving compute landscape.</p>

<p class="l-text">Lesson 8 takes us into the future every cryptographer is preparing for: <strong>Post-Quantum Cryptography</strong>. NIST's August 2024 standards — ML-KEM (Kyber), ML-DSA (Dilithium), SLH-DSA (SPHINCS+), Falcon — replace RSA, ECDSA, and ECDH against an adversary holding a fault-tolerant quantum computer. Migration deadlines are no longer theoretical: NSA's CNSA 2.0 mandates PQ for new National Security Systems by 2027.</p>
</div>`,
tr: `<p class="l-text"><strong>Güvenli Çok Taraflı Hesaplama (MPC), "birbirimize güvenmeden birlikte hesaplayalım"ın kriptografisidir.</strong> Andrew Yao alanı 1982'de Milyonerler Problemi ile tanıttı: iki milyoner, gerçek varlıklarını açığa vurmadan hangisinin daha zengin olduğunu bilmek istiyor. Yao'nun çözümü — <em>karıştırılmış devreler</em> — hem bir varlık kanıtı hem de ilk pratik protokoldü. Kırk yıl sonra MPC üretimde: Boston'un cinsiyet-ücret-uçurumu çalışması, hiçbir şirket diğerinin verisini görmeden 100+ şirketten maaşları toplamak için MPC kullandı; Estonya'nın vergi otoritesi özel şirketlerle ortak istatistikler için MPC kullanıyor; Unbound Tech (şimdi Coinbase) ve Sepior, eşik-MPC ECDSA ile milyarlarca dolarlık kripto para anahtarını koruyor.</p>

<p class="l-text">Bu derste Shamir gizli paylaşımını (1979) — neredeyse her şeyin altındaki polinom-interpolasyon yapı taşı — uygulamalı bir oyuncak AND geçidiyle Yao'nun karıştırılmış devrelerini, boolean devreleri için GMW (Goldreich-Micali-Wigderson 1987) protokolünü ve modern aritmetik-devre ailesi BGW (Ben-Or-Goldwasser-Wigderson 1988) ile SPDZ'yi ("speedz" telaffuz edilir, Damgård-Pastro-Smart-Zakarias 2012) yürüyoruz. Gerçek sistemlerle kapatıyoruz: Sharemind (Cybernetica, Estonya), MP-SPDZ (MPC'nin açık kaynaklı İsviçre Çakısı) ve gerçek kripto para rezervlerini tutan eşik-ECDSA cüzdanlar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>n-taraflı (t, n) Shamir gizli paylaşım şeması kurun ve Lagrange interpolasyonu ile yeniden inşa edin</li>
<li>2-girişli AND geçidini karıştırın ve Yao'nun protokolünü adım adım yürüyün</li>
<li>GMW (boolean), BGW (aritmetik), SPDZ (MAC'lerle kötü-niyet-güvenli)'yi ayırt edin</li>
<li>Bir güvenlik modeli seçin: yarı-dürüst vs kötü niyetli, dürüst çoğunluk vs dürüst olmayan çoğunluk</li>
<li>MPC'nin uyduğu (ortak istatistikler, reklam atıfı, eşik imzaları) ve uymadığı durumları tanıyın</li>
<li>MP-SPDZ programlarını okuyun ve iletişim maliyetini tahmin edin (genellikle hesaplama değil darboğaz)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Milyonerler Problemi ve Yao'nun Büyük Fikri</h2>
<p class="l-text">Yao'nun 1982 makalesi "Protocols for Secure Computations" şu soruyu sordu: her biri özel bir sayı tutan iki taraf Alice ve Bob, f(a, b)'yi — örneğin f(a, b) = (a &lt; b) — hesaplamak ve birbirinin girdisini değil yalnızca çıktıyı öğrenmek istiyor. Yao'nun cevabı <strong>karıştırılmış devrelerdir</strong>: Alice f için bir boolean devresini, her telin rastgele anahtarlar (0 için bir tane, 1 için bir tane) ile temsil edildiği ve her geçidin yalnızca doğru anahtar kombinasyonu ile açılabilen şifrelenmiş bir doğruluk tablosu olduğu "karıştırılmış" bir forma dönüştürür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Karıştırıcı (Alice)</div><div class="card-body">Karıştırılmış devreyi inşa eder, Değerlendiriciye gönderir. Kendi giriş anahtarlarını bilir; bunları doğrudan gönderir. Değerlendiricinin giriş anahtarları Oblivious Transfer aracılığıyla gelir.</div></div>
<div class="calc-card"><div class="card-title">Değerlendirici (Bob)</div><div class="card-body">Hem Alice'in giriş telleri (doğru olanları) hem de kendi (OT aracılığıyla) için anahtarlar alır. Devreyi geçit-geçit yürür, her karıştırılmış tablonun bir satırını şifre çözer. Çıkış teli anahtarlarına ulaşır.</div></div>
<div class="calc-card"><div class="card-title">Çıkış kod çözme</div><div class="card-body">Ya Alice her çıkış teli için bir (anahtar → 0/1) çeviri tablosu yayınlar, ya da çıkış her iki tarafa XOR-paylaşılır.</div></div>
<div class="calc-card"><div class="card-title">Oblivious Transfer (OT)</div><div class="card-body">Alice'in Bob'un hangi bitlere sahip olduğunu öğrenmeden Bob'un bitleri için doğru giriş anahtarlarını almasına izin veren kripto primitifi. Rabin'in OT'si (1981) → Even-Goldreich-Lempel 1985. OT uzantısı (Ishai vd. 2003) milyonlarca OT'yi ucuzlatır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Shamir Gizli Paylaşımı — Polinom Hilesi</h2>
<p class="l-text">Adi Shamir'in 1979 makalesi "How to Share a Secret", neredeyse her dürüst-çoğunluk MPC protokolünün dahili olarak kullandığı kriptografik primitifi verir. Bir <em>s</em> sırrını n taraf arasında, herhangi t'sinin yeniden inşa edebileceği ancak t-1'inin hiçbir şey öğrenmeyeceği şekilde paylaşmak için:</p>

<div class="katex-block">$$\\text{Pick random } a_1, \\ldots, a_{t-1} \\in \\mathbb{F}_p, \\quad p(x) = s + a_1 x + a_2 x^2 + \\cdots + a_{t-1} x^{t-1}$$</div>

<p class="l-text">i tarafına (i, p(i)) payını verin. Herhangi t pay polinomu Lagrange interpolasyonu aracılığıyla belirler, dolayısıyla p(0) = s'yi kurtarırlar. Herhangi t-1 pay tekdüze dağılmıştır (s'den bilgi-teorik olarak bağımsızdır), dolayısıyla hiçbir şey açığa vurmazlar.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">numpy'da (3, 5) Shamir gizli paylaşımı. Bir sırrı 5 paya bölüyoruz, herhangi 3'ünden yeniden inşa ediyoruz ve 2 payın hiçbir şey açığa vurmadığını teyit ediyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> secrets

p = <span class="num">2</span>**<span class="num">31</span> - <span class="num">1</span>   <span class="cm"># Mersenne asalı, alan olarak kullan</span>

<span class="kw">def</span> <span class="fn">share</span>(s, t, n):
    coeffs = [s] + [secrets.<span class="fn">randbelow</span>(p) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(t - <span class="num">1</span>)]
    pts = []
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, n + <span class="num">1</span>):
        y = <span class="num">0</span>
        <span class="kw">for</span> k, c <span class="kw">in</span> <span class="fn">enumerate</span>(coeffs):
            y = (y + c * <span class="fn">pow</span>(i, k, p)) % p
        pts.<span class="fn">append</span>((i, y))
    <span class="kw">return</span> pts

<span class="kw">def</span> <span class="fn">lagrange_at_0</span>(points):
    s = <span class="num">0</span>
    <span class="kw">for</span> j, (xj, yj) <span class="kw">in</span> <span class="fn">enumerate</span>(points):
        num, den = <span class="num">1</span>, <span class="num">1</span>
        <span class="kw">for</span> m, (xm, _) <span class="kw">in</span> <span class="fn">enumerate</span>(points):
            <span class="kw">if</span> m == j: <span class="kw">continue</span>
            num = (num * (-xm)) % p
            den = (den * (xj - xm)) % p
        s = (s + yj * num * <span class="fn">pow</span>(den, -<span class="num">1</span>, p)) % p
    <span class="kw">return</span> s

secret = <span class="num">4242</span>
shares = <span class="fn">share</span>(secret, t=<span class="num">3</span>, n=<span class="num">5</span>)
<span class="fn">print</span>(<span class="str">'shares:'</span>, shares)

<span class="cm"># Herhangi 3 pay yeniden inşa eder</span>
<span class="kw">for</span> combo <span class="kw">in</span> [shares[:<span class="num">3</span>], shares[<span class="num">2</span>:], [shares[<span class="num">0</span>], shares[<span class="num">2</span>], shares[<span class="num">4</span>]]]:
    <span class="fn">print</span>(f<span class="str">'reconstruct from {[s[0] for s in combo]}: {lagrange_at_0(combo)}'</span>)

<span class="cm"># İki pay tekdüze rastgele görünür — farklı (s, rastgelelik) aynı iki payı verir</span>
<span class="fn">print</span>(<span class="str">'\\n2 shares reveal nothing:'</span>)
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    fake_secret = secrets.<span class="fn">randbelow</span>(<span class="num">100</span>)
    fake_shares = <span class="fn">share</span>(fake_secret, t=<span class="num">3</span>, n=<span class="num">5</span>)
    <span class="fn">print</span>(f<span class="str">'  shares 1,2 from fake secret {fake_secret}: {fake_shares[:2]}'</span>)
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Mersenne asalı <code>p = 2^31 − 1</code>'i sonlu alan F_p olarak kullanır — gerçek SPDZ / Sharemind tipik olarak 64-bit veya 128-bit asallar üzerinde çalışır ama cebir özdeştir, sadece F_p üzerinde Lagrange interpolasyonu için sabit-zamanlı modüler inverse gerekir. 2) <code>share(s, t, n)</code> ilk katsayısı sır <code>s</code> olan ve t-1 rastgele üst katsayıya sahip bir t-1 dereceli polinom inşa eder; sonra her parti i için <code>(i, p(i))</code> hesaplar — Shamir 1979'un kanonik şeması, herhangi t pay polinomu tamamen belirler, herhangi t-1 pay <code>s</code> hakkında bilgi-teorik olarak hiçbir şey açıklamaz. 3) <code>lagrange_at_0(points)</code> Lagrange interpolasyon formülünü x=0'da uygular — bir paylar alt kümesinden p(0)=s'yi geri kazanır; her terim <code>num/den</code> baz polinomu olup <code>pow(den, -1, p)</code> Python 3.8+'in modüler ters için extended Euclidean yerleşik fonksiyonunu kullanır. 4) Üç farklı 3-paylı kombinasyon (ilk 3, son 3, ayrık seçim) hep <code>4242</code>'yi geri kazanır — herhangi t paydan rekonstrüksiyonu kanıtlar — ve sahte-sır döngüsü iki paylin neden gizli olduğunu gösterir: rastgele üst katsayılar sayesinde aynı iki nokta sonsuz sayıda farklı sır için tutarlıdır, bu yüzden t-1 pay bilgi-teorik olarak rastgeledir.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Yao'nun Karıştırılmış Devresi — Bir Oyuncak AND Geçidi</h2>
<p class="l-text">Bir AND geçidini yürüyün. <em>a</em> teli K_a^0 ve K_a^1 anahtarlarına sahiptir; <em>b</em> teli K_b^0 ve K_b^1; çıkış teli <em>c</em> K_c^0 ve K_c^1. Karıştırılmış geçit, AND doğruluk tablosunun her satırı için bir tane olmak üzere dört şifreli metin listesidir:</p>

<div class="katex-block">$$\\text{Enc}_{K_a^0}(\\text{Enc}_{K_b^0}(K_c^0)),\\; \\text{Enc}_{K_a^0}(\\text{Enc}_{K_b^1}(K_c^0)),\\; \\text{Enc}_{K_a^1}(\\text{Enc}_{K_b^0}(K_c^0)),\\; \\text{Enc}_{K_a^1}(\\text{Enc}_{K_b^1}(K_c^1))$$</div>

<p class="l-text">Dört satırı karıştırın. Her giriş telindeki <em>gerçek</em> bit için anahtarı tutan değerlendirici, tam olarak bir satırı şifre çözebilir — doğru çıkış teli anahtarı. Yalnızca çıkış kod çözme yayımlandığında çıkış bitini öğrenirler.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">AES-CTR-tarzı XOR-with-hash şifreleme kullanan oyuncak bir karıştırılmış AND geçidi. Dört satırı karıştırıyoruz, karıştırıyoruz ve değerlendiriyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, secrets, random

<span class="kw">def</span> <span class="fn">H</span>(*keys, length=<span class="num">16</span>):
    h = hashlib.<span class="fn">sha256</span>()
    <span class="kw">for</span> k <span class="kw">in</span> keys: h.<span class="fn">update</span>(k)
    <span class="kw">return</span> h.<span class="fn">digest</span>()[:length]

<span class="kw">def</span> <span class="fn">xor</span>(a, b):
    <span class="kw">return</span> <span class="fn">bytes</span>(x ^ y <span class="kw">for</span> x, y <span class="kw">in</span> <span class="fn">zip</span>(a, b))

<span class="kw">def</span> <span class="fn">kg</span>():
    <span class="kw">return</span> secrets.<span class="fn">token_bytes</span>(<span class="num">16</span>)

<span class="cm"># Tel anahtarları</span>
Ka0, Ka1 = <span class="fn">kg</span>(), <span class="fn">kg</span>()
Kb0, Kb1 = <span class="fn">kg</span>(), <span class="fn">kg</span>()
Kc0, Kc1 = <span class="fn">kg</span>(), <span class="fn">kg</span>()

<span class="cm"># AND doğruluk tablosu: c = a AND b</span>
truth = [
    (Ka0, Kb0, Kc0),
    (Ka0, Kb1, Kc0),
    (Ka1, Kb0, Kc0),
    (Ka1, Kb1, Kc1),
]

<span class="kw">def</span> <span class="fn">encrypt</span>(k1, k2, m):
    pad = <span class="fn">H</span>(k1, k2)
    <span class="kw">return</span> <span class="fn">xor</span>(pad, m + b<span class="str">'\\x00'</span> * (<span class="num">16</span> - <span class="fn">len</span>(m)))

<span class="kw">def</span> <span class="fn">decrypt</span>(k1, k2, c):
    pad = <span class="fn">H</span>(k1, k2)
    <span class="kw">return</span> <span class="fn">xor</span>(pad, c).<span class="fn">rstrip</span>(b<span class="str">'\\x00'</span>)

garbled_rows = [<span class="fn">encrypt</span>(ka, kb, kc) <span class="kw">for</span> (ka, kb, kc) <span class="kw">in</span> truth]
random.<span class="fn">shuffle</span>(garbled_rows)

<span class="cm"># Değerlendiricide Ka1, Kb1 var (a=1, b=1).  Her satırı dener, şifre çözmesi</span>
<span class="cm"># bilinen bir çıkış anahtarıyla eşleşeni bulur.</span>
ka_eval, kb_eval = Ka1, Kb1
<span class="kw">for</span> row <span class="kw">in</span> garbled_rows:
    out = <span class="fn">decrypt</span>(ka_eval, kb_eval, row)
    <span class="kw">if</span> out == Kc0[:<span class="fn">len</span>(out)] <span class="kw">or</span> out == Kc1[:<span class="fn">len</span>(out)]:
        out_full = out + b<span class="str">'\\x00'</span> * (<span class="num">16</span> - <span class="fn">len</span>(out))
        bit = <span class="num">0</span> <span class="kw">if</span> out_full == Kc0 <span class="kw">else</span> <span class="num">1</span>
        <span class="fn">print</span>(f<span class="str">'evaluator decoded output wire key, bit = {bit}'</span>)
        <span class="kw">break</span>

<span class="cm"># Not: pratikte değerlendirici Kc0/Kc1'e karşı doğrudan test etmez;</span>
<span class="cm"># point-and-permute / free-XOR / half-gates şifre çözmeyi deterministik kılar.</span>
</code></pre></div></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>kg()</code> her tel için taze 128-bit AES-kalitesinde anahtarlar çeker (girdi <em>a</em> için Ka0/Ka1, <em>b</em> için Kb0/Kb1, çıktı <em>c</em> için Kc0/Kc1) — tam olarak Yao 1986'nın tanıttığı tel etiket hilesi, böylece bir anahtar tutmak hangi mantıksal biti kodladığı hakkında hiçbir şey açıklamaz. 2) <code>truth</code> tablosu AND'i kodlar: satırlar (0,0)→0, (0,1)→0, (1,0)→0, (1,1)→1; <code>encrypt(k1, k2, m) = m ⊕ SHA-256(k1||k2)</code> modern garbling'in kullandığı AES-CTR-with-tweaks yapısı (FreeXOR + half-gates) için çift-anahtarlı şifreleme yerine geçer. 3) <code>random.shuffle(garbled_rows)</code> dört şifreli metni karıştırır, böylece satır sırası girdi bitleri hakkında bilgi sızdırmaz — üretimde point-and-permute pointer bitleri ile birleştirilerek, değerlendirici O(1) zamanda <em>yalnızca</em> girdi etiketleriyle eşleşen satırı şifre çözer. 4) <code>(Ka1, Kb1)</code>'i tutan değerlendirici her karıştırılmış satırı dener; SHA-256(Ka1||Kb1) sadece (1,1)→1 satırında <code>Kc1</code>'e unpad eder, böylece döngü <code>Kc1</code> eşleşmesine isabet eder ve <code>bit = 1</code> yazdırır — Alice Bob'un girdisini asla görmez, Bob Alice'inkini asla görmez ve sadece çıkış biti Kc0/Kc1 ↔ {0,1} tablosu yayımlandığında açıklanır.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. GMW — XOR-Paylaşımı ile Boolean Devreler</h2>
<p class="l-text">Goldreich-Micali-Wigderson 1987, Yao'yu boolean devreler için <em>n</em> tarafa genelleştirdi. Her telin değeri <em>w</em> XOR-paylaşılır: i tarafı <em>w_i</em> tutar ve ⊕ w_i = w. XOR geçitleri ücretsizdir (taraflar paylarını yerel olarak XOR'lar). AND geçitleri etkileşimli bir alt protokol gerektirir — tipik olarak geçit başına 1-arası-4 OT — bu yüzden derin devreler iletişim-bağımlı hâle gelir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">XOR ücretsizdir</div><div class="card-body">a ⊕ b, (a_1 ⊕ b_1, a_2 ⊕ b_2) olarak paylaşılır. İletişim yok. Yao'nun free-XOR optimizasyonunda (Kolesnikov-Schneider 2008) aynı özellik.</div></div>
<div class="calc-card"><div class="card-title">AND, OT gerektirir</div><div class="card-body">Round başına her AND geçidi için, taraflar OT tabanlı bir çarpma protokolü çalıştırır. Geçit başına ~2 gidiş-dönüş. OT uzantısı kullanarak yığınlama kritik.</div></div>
<div class="calc-card"><div class="card-title">Round karmaşıklığı</div><div class="card-body">GMW round'ları = devre derinliği. Yao = sabit round'lar (büyük bir karıştırılmış devre). Derin ağlar için Yao round'larda kazanır; GMW toplam bant genişliğinde kazanır.</div></div>
<div class="calc-card"><div class="card-title">Modern boolean MPC</div><div class="card-body">2PC: genellikle half-gate'lerle Yao (Zahur-Rosulek-Evans 2015) — AND başına 2 şifreli metin. n-PC: GMW + Beaver üçlüleri. EMP-toolkit, ABY, MP-SPDZ'de kullanılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. BGW ve Aritmetik MPC — Dürüst Çoğunluk</h2>
<p class="l-text">Ben-Or-Goldwasser-Wigderson 1988 (ve bağımsız olarak Chaum-Crépeau-Damgård 1988), dürüst bir çoğunluk (t &lt; n/2) ile aritmetik devreler üzerinde MPC'nin <em>bilgi-teorik</em> güvenlikle yapılabileceğini gösterdi — kriptografik varsayım yok. Her giriş Shamir-paylaşılır. Toplama yereldir (polinomların toplamı). Çarpma derece-iki katlama hilesi + yeni paylaşımlarla derece azaltma kullanır.</p>

<div class="calc-highlight"><strong>Aritmetik neden önemlidir:</strong> ML, istatistik, finans hepsi tam sayılar / float'larda yaşar, bitlerde değil. 32-bit çarpma için bir boolean devre ~5000 AND geçidi; bir aritmetik-devre çarpması bir Beaver-üçlü tüketimidir. Sayısal iş yükleri için aritmetik MPC iletişimde 100-1000× daha hızlıdır.</div>

<p class="l-text">Sharemind (Cybernetica, Estonya, 2007+) üretim dağıtımıdır. Üç farklı anlaşmasız yargı alanında üç hesaplama sunucusu; kullanıcılar girdileri bunlar arasında gizli paylaşır; sunucular Sharemind'in alana özgü dilini (SecreC) çalıştırır ve genel (veya paylaşılan) bir sonuç üretir. Estonya'nın 2015 Vergi Otoritesi özel şirketlerle ortak çalışması Sharemind'da çalıştı.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SPDZ — Bilgi-Teorik MAC'lerle Kötü-Niyet Güvenliği</h2>
<p class="l-text">SPDZ (Damgård-Pastro-Smart-Zakarias 2012, "Multiparty Computation from Somewhat Homomorphic Encryption"), dürüst olmayan çoğunlukla (n-1'e kadar herhangi sayıda bozulmuş taraf) kötü-niyet güvenliği için fiili modern MPC protokolüdür. Her paylaşılan değer, küresel olarak paylaşılan bir gizli anahtar α altında bir bilgi-teorik MAC taşır. Kötü niyetli bir taraf sahte bir pay gönderirse, MAC kontrolü çıkış zamanında başarısız olur ve protokol iptal edilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çevrimiçi faz</div><div class="card-body">Yalnızca doğrusal hesaplama — toplamalar ücretsizdir, çarpmalar önişlenmiş Beaver üçlüleri tüketir. Çok hızlı: LAN'da çarpma başına ~1 μs.</div></div>
<div class="calc-card"><div class="card-title">Önişleme fazı</div><div class="card-body">MAC'lerle paylaşılan Beaver üçlüleri (a, b, c=a·b) üret. Oblivious transfer + somewhat-HE (BFV) veya yalnızca-oblivious-transfer (MASCOT, Keller-Orsini-Scholl 2016) kullanır. Ağır ama çevrimdışı.</div></div>
<div class="calc-card"><div class="card-title">MP-SPDZ</div><div class="card-body">Marcel Keller'ın Aarhus / NTNU'daki açık kaynaklı kütüphanesi SPDZ, MASCOT, BMR, Yao, GMW, BGW uyguluyor — birinde 30+ protokol. MPC'nin İsviçre Çakısı. Araştırmada ve birkaç üretim dağıtımında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Eşik ECDSA</div><div class="card-body">Dağıtık imzalama için özelleşmiş SPDZ tarzı protokoller. GG18, GG20 (Gennaro-Goldfeder), Lindell17, CCLST20 — tek bir imzacı olmadan kriptoda milyarları korumak için Coinbase Custody, Fireblocks, Sepior tarafından kullanılır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — MP-SPDZ C++ derleme + çok-taraflı kurulum gerektirir. Sadece taslak.</span>
<span class="cm"># https://github.com/data61/MP-SPDZ</span>
<span class="cm">#</span>
<span class="cm"># "3 taraf arasında ortalama maaşı hesapla" için minimal bir SPDZ Python kaynağı:</span>
<span class="cm">#</span>
<span class="cm">#   from Compiler.types import sint</span>
<span class="cm">#   n = 3</span>
<span class="cm">#   shares = [sint.get_input_from(i) for i in range(n)]</span>
<span class="cm">#   total  = sum(shares)</span>
<span class="cm">#   avg    = total / n</span>
<span class="cm">#   print_ln('average = %s', avg.reveal())</span>
<span class="cm">#</span>
<span class="cm"># Derle:  ./compile.py average 3</span>
<span class="cm"># 3 sunucuda çalıştır:  ./mascot-party.x 0 average / .x 1 average / .x 2 average</span>
<span class="cm"># Her sunucu kendi tam sayı maaşını besler; yalnızca ortalama açığa vurulur.</span>
<span class="fn">print</span>(<span class="str">'See MP-SPDZ tutorial for runnable installation: github.com/data61/MP-SPDZ'</span>)
</code></pre>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Beaver Üçlüleri — Çarpma Sihiri</h2>
<p class="l-text">Donald Beaver'ın 1991 hilesi, her güvenli çarpmayı iki açılışa indirger. Rastgele paylaşılan (a, b, c=a·b) önişleyin — bir Beaver üçlüsü. Paylaşılan x ve y'yi çarpmak için: ε = x - a ve δ = y - b'yi açın, sonra z = c + ε·b + δ·a + ε·δ hesaplayın. Paylar üzerindeki tüm işlemler yereldir; yalnızca ε, δ açığa vurulur (ve a, b rastgele olduğu için tekdüze rastgele görünürler).</p>

<div class="katex-block">$$xy = (\\varepsilon + a)(\\delta + b) = \\varepsilon \\delta + \\varepsilon b + \\delta a + ab = \\varepsilon \\delta + \\varepsilon b + \\delta a + c$$</div>

<p class="l-text">Üçlüler MPC'nin tüketilebilir kaynağıdır. Önişleme sırasında bunları toplu olarak üretin (yavaş ama çevrimdışı). Çevrimiçi faz, çarpma başına doğrusal olarak üçlüleri tüketir (hızlı, LAN'da 1-2 μs). Tüm modern MPC protokolleri bu iki-fazlı model etrafında inşa edilmiştir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gerçek Dağıtımlar — Boston Maaş Uçurumu, Estonya, Eşik Cüzdanları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Boston Women's Workforce Council (2017+)</div><div class="card-body">100+ Boston şirketi MPC aracılığıyla maaş verisi gönderir; toplam ücret-uçurumu istatistikleri yayımlanır, hiçbir şirket diğerinin verisini görmez. Boston Üniversitesi'nin <a style="color:#c8a96e">Conclave</a> + Sharemind üzerinde inşa edildi.</div></div>
<div class="calc-card"><div class="card-title">Estonya Vergi + ITL Çalışmaları (2015)</div><div class="card-body">Estonya'nın Vergi Otoritesi ile özel firmalar arasında istihdam süreleri ve eğitimin gelir üzerindeki etkisi hakkında ortak istatistikler, tam giriş gizliliği ile. Üç sunucuda Sharemind.</div></div>
<div class="calc-card"><div class="card-title">Coinbase / Fireblocks Eşik Saklama</div><div class="card-body">ECDSA özel anahtarları farklı coğrafyalardaki HSM'ler arasında bölünür (3-of-5, 5-of-7). Herhangi bir imza çevrimiçi MPC gerektirir; tek bir host asla anahtarı tutmaz. Milyarlarca dolar güvenli.</div></div>
<div class="calc-card"><div class="card-title">Apple Find My / PSI</div><div class="card-body">Özel küme kesişimi: Apple eşleşen CSAM hash'lerini (özellik 2021'de aktifken) veya başka hiçbir şey öğrenmeden eşleşen cihaz hash'lerini bulur. MPC + HE varyantları.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tuzaklar — İletişim, Kötü-Niyet Güvenliği, Yan-Kanallar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bant genişliği, hesaplama değil</div><div class="card-body">MPC neredeyse her zaman ağ-bağımlıdır. 1 Gbps LAN = 100 Mbps bağlantısının ~10× verimi. Dağıtımları CPU değil, topoloji etrafında planlayın.</div></div>
<div class="calc-card"><div class="card-title">Yarı-dürüst yeterli değil</div><div class="card-body">Bir taraf bile kötü niyetli ise, yarı-dürüst MPC sızar. Düşmanca dağıtımlar için her zaman kötü-niyet-güvenlik primi (SPDZ, BMR) ödeyin.</div></div>
<div class="calc-card"><div class="card-title">İptal saldırıları</div><div class="card-body">Kötü-niyet-güvenli MPC hile yapma üzerine iptal eder, ancak iptaller girdiler hakkında bilgi sızdırmak için seçici olarak tetiklenebilir. Hafifletmeler: tanımlanabilir iptal (hile yapanı yakala) + adillik protokolleri.</div></div>
<div class="calc-card"><div class="card-title">Yan-kanal zamanlaması</div><div class="card-body">Paylaşılan değerlerde dallanma onları açığa vurur. MPC programları veri-bilmeyen olmalıdır — her giriş aynı kontrol-akış yolunu alır. Derleyiciler (Picco, MOTION) bunu zorlar.</div></div>
<div class="calc-card"><div class="card-title">Kayan nokta</div><div class="card-body">MPC sonlu alanlar üzerinde çalışır, IEEE 754 üzerinde değil. Dikkatli ölçeklemeyle sabit-nokta veya tam sayı paylaşımları üzerinde float'ı taklit eden kütüphaneler (Falcon, CrypTen) kullanın. Yuvarlama davranışı farklıdır.</div></div>
<div class="calc-card"><div class="card-title">Anlaşma modeli</div><div class="card-body">3-sunucu (Sharemind) üç operatörün farklı yargı alanlarında ve farklı tüzel kişilerde olmasını gerektirir. Aksi takdirde "anlaşmama" varsayımı sözleşmeli kurgudur.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">MPC "kimseye güvenme, birlikte hesapla"yı paradokstan protokole dönüştürür. Yao'nun karıştırılmış devreleri bize 2PC verir; Shamir gizli paylaşımı + BGW dürüst-çoğunluk aritmetiği verir; SPDZ + MP-SPDZ kötü-niyet-güvenli dürüst-olmayan-çoğunluk dağıtımı verir. Üretim sistemleri zaten kripto para cüzdanlarını güvence altına alır, yargı alanları arasında istatistikleri anonimleştirir ve AB'nin büyüyen gizliliği koruyan hesaplama manzarasını destekler.</p>

<p class="l-text">Ders 8 bizi her kriptografın hazırlandığı geleceğe götürür: <strong>Post-Kuantum Kriptografi</strong>. NIST'in Ağustos 2024 standartları — ML-KEM (Kyber), ML-DSA (Dilithium), SLH-DSA (SPHINCS+), Falcon — hata-toleranslı bir kuantum bilgisayar tutan bir düşmana karşı RSA, ECDSA ve ECDH'nin yerini alır. Geçiş tarihleri artık teorik değil: NSA'nın CNSA 2.0'ı 2027'ye kadar yeni Ulusal Güvenlik Sistemleri için PQ'yu zorunlu kılar.</p>
</div>`
};
