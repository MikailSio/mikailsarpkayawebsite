window.CRYPTO_L6 = {
en: `<p class="l-text"><strong>Homomorphic Encryption (HE) lets a server compute on data it cannot read.</strong> A client encrypts a number <em>m</em>, sends the ciphertext c = E(m) to the cloud, the cloud runs <em>f</em> over c (without ever holding the key), returns c' = E(f(m)), and the client decrypts to get f(m). For decades the only known schemes were "partially" homomorphic — RSA (multiplicative), ElGamal (multiplicative), Paillier (additive). Then Craig Gentry, in his 2009 Stanford PhD thesis, constructed the first <strong>Fully Homomorphic Encryption</strong> scheme: addition AND multiplication, infinitely deep circuits, on ciphertexts. The first FHE evaluation took 30 minutes for a single AND gate; today CKKS on GPU does encrypted neural-network inference at near-real-time.</p>

<p class="l-text">In this lesson we walk additively-homomorphic Paillier (1999), explain why Gentry's bootstrapping breakthrough mattered, survey the modern lattice-based FHE schemes — BFV / BGV (exact integers), CKKS (approximate fixed-point, 2017), TFHE (gate-by-gate boolean) — and tour the production libraries Microsoft SEAL, OpenFHE (the merger of PALISADE + HElib), Concrete (Zama), Lattigo (Tune Insight). We close with the killer app: encrypted machine-learning inference. Apple's Private Cloud Compute (2024-2026) and Zama's Concrete-ML push HE into mainstream products.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the spectrum: PHE (one operation) → SHE (limited depth) → FHE (any circuit)</li>
<li>Implement Paillier from scratch and verify D(E(m1)·E(m2)) = m1 + m2</li>
<li>Explain Gentry 2009's bootstrapping: the trick that unlocks unlimited circuit depth</li>
<li>Compare BFV/BGV (exact integers) vs CKKS (approximate floats) vs TFHE (boolean gates)</li>
<li>Recognize when HE is the right tool vs MPC vs ZK vs TEE (Intel SGX, AMD SEV)</li>
<li>Read a SEAL or OpenFHE program and estimate its performance budget</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Spectrum — PHE, SHE, FHE</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Partially Homomorphic (PHE)</div><div class="card-body">One operation. RSA: E(m1)·E(m2) = E(m1·m2 mod n). Paillier: E(m1)·E(m2) = E(m1 + m2). ElGamal: multiplicative. Cheap and old. Used by e-voting (Helios uses Paillier), private set intersection.</div></div>
<div class="calc-card"><div class="card-title">Somewhat Homomorphic (SHE)</div><div class="card-body">Both + and ×, but limited multiplicative depth. After ~20-30 multiplications the noise overwhelms the message. BGV / BFV / CKKS are SHE by default.</div></div>
<div class="calc-card"><div class="card-title">Fully Homomorphic (FHE)</div><div class="card-body">Both operations, unlimited depth via "bootstrapping" — a homomorphic decryption inside the circuit that resets noise. Gentry 2009 was the first construction; modern schemes inherit the technique.</div></div>
<div class="calc-card"><div class="card-title">Leveled FHE</div><div class="card-body">In practice you pick a depth L upfront and parameterize the scheme so noise stays under threshold for L multiplications without bootstrapping. Faster than full FHE; used in nearly all production systems.</div></div>
</div>

<div class="calc-highlight"><strong>Why bootstrapping was the Holy Grail:</strong> for 30 years between Rivest-Adleman-Dertouzos's 1978 question "can you compute on encrypted data?" and Gentry's 2009 thesis, no one knew if FHE was even possible. Gentry's construction used ideal lattices and was famously slow (30 min/gate); the Brakerski-Gentry-Vaikuntanathan (BGV) 2011 redesign on Ring-LWE made it tractable.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Paillier — Additively Homomorphic, Pure Python</h2>
<p class="l-text">Pascal Paillier's 1999 cryptosystem is the workhorse of pre-FHE secure computation. KeyGen picks two primes p, q with n = pq, and computes λ = lcm(p-1, q-1). Public key: (n, g) where g is typically n+1. Encrypt m: pick random r, output c = g^m · r^n mod n². Decrypt: L(c^λ mod n²) · μ mod n where L(x) = (x-1)/n.</p>

<div class="katex-block">$$E(m_1) \\cdot E(m_2) \\bmod n^2 \\;=\\; E(m_1 + m_2 \\bmod n) \\quad\\quad E(m)^k \\bmod n^2 \\;=\\; E(k \\cdot m)$$</div>

<p class="l-text">Both properties hold "for free" from the algebra. You can sum a column of encrypted ledger entries server-side; you can multiply each by a public scalar weight. You cannot multiply two ciphertexts together — that needs FHE.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Paillier from scratch. We encrypt three ledger entries, sum them server-side without decrypting, then decrypt the total.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets, math

<span class="kw">def</span> <span class="fn">lcm</span>(a, b):
    <span class="kw">return</span> a * b // math.<span class="fn">gcd</span>(a, b)

<span class="kw">def</span> <span class="fn">modinv</span>(a, m):
    <span class="kw">return</span> <span class="fn">pow</span>(a, -<span class="num">1</span>, m)

<span class="kw">def</span> <span class="fn">keygen</span>(bits=<span class="num">64</span>):
    <span class="cm"># Toy 64-bit primes for in-browser speed; real systems use 1024-bit each.</span>
    <span class="kw">def</span> <span class="fn">rand_prime</span>(bits):
        <span class="kw">while</span> <span class="kw">True</span>:
            p = secrets.<span class="fn">randbits</span>(bits) | (<span class="num">1</span> &lt;&lt; (bits - <span class="num">1</span>)) | <span class="num">1</span>
            <span class="cm"># Miller-Rabin would go here; for demo trust small odds and check</span>
            small_primes = [<span class="num">2</span>,<span class="num">3</span>,<span class="num">5</span>,<span class="num">7</span>,<span class="num">11</span>,<span class="num">13</span>,<span class="num">17</span>,<span class="num">19</span>,<span class="num">23</span>,<span class="num">29</span>,<span class="num">31</span>,<span class="num">37</span>,<span class="num">41</span>,<span class="num">43</span>,<span class="num">47</span>]
            <span class="kw">if</span> <span class="fn">all</span>(p % sp != <span class="num">0</span> <span class="kw">for</span> sp <span class="kw">in</span> small_primes):
                <span class="cm"># one strong-prime style check</span>
                <span class="kw">if</span> <span class="fn">pow</span>(<span class="num">2</span>, p - <span class="num">1</span>, p) == <span class="num">1</span>: <span class="kw">return</span> p
    p, q = <span class="fn">rand_prime</span>(bits), <span class="fn">rand_prime</span>(bits)
    <span class="kw">while</span> p == q: q = <span class="fn">rand_prime</span>(bits)
    n   = p * q
    lam = <span class="fn">lcm</span>(p - <span class="num">1</span>, q - <span class="num">1</span>)
    g   = n + <span class="num">1</span>                               <span class="cm"># standard simplified choice</span>
    mu  = <span class="fn">modinv</span>(lam, n)                      <span class="cm"># works because g = n+1 makes L(g^lam) = lam</span>
    <span class="kw">return</span> (n, g), (lam, mu)

<span class="kw">def</span> <span class="fn">encrypt</span>(pub, m):
    n, g = pub
    <span class="kw">while</span> <span class="kw">True</span>:
        r = secrets.<span class="fn">randbelow</span>(n - <span class="num">1</span>) + <span class="num">1</span>
        <span class="kw">if</span> math.<span class="fn">gcd</span>(r, n) == <span class="num">1</span>: <span class="kw">break</span>
    n2 = n * n
    <span class="kw">return</span> (<span class="fn">pow</span>(g, m, n2) * <span class="fn">pow</span>(r, n, n2)) % n2

<span class="kw">def</span> <span class="fn">decrypt</span>(pub, priv, c):
    n, _   = pub
    lam, mu = priv
    n2 = n * n
    u  = <span class="fn">pow</span>(c, lam, n2)
    L  = (u - <span class="num">1</span>) // n
    <span class="kw">return</span> (L * mu) % n

pub, priv = <span class="fn">keygen</span>(bits=<span class="num">64</span>)
n = pub[<span class="num">0</span>]; n2 = n * n

<span class="cm"># Encrypt three values</span>
salaries = [<span class="num">3000</span>, <span class="num">5500</span>, <span class="num">4200</span>]
cts = [<span class="fn">encrypt</span>(pub, m) <span class="kw">for</span> m <span class="kw">in</span> salaries]

<span class="cm"># Server homomorphically sums them — never sees plaintexts</span>
c_sum = <span class="num">1</span>
<span class="kw">for</span> ct <span class="kw">in</span> cts:
    c_sum = (c_sum * ct) % n2

<span class="fn">print</span>(<span class="str">'encrypted total (first 32 hex):'</span>, <span class="fn">hex</span>(c_sum)[:<span class="num">34</span>], <span class="str">'...'</span>)
<span class="fn">print</span>(<span class="str">'decrypted total:'</span>, <span class="fn">decrypt</span>(pub, priv, c_sum), <span class="str">'  (expected'</span>, <span class="fn">sum</span>(salaries), <span class="str">')'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>keygen</code> draws two 64-bit primes <code>p, q</code> via a small-prime sieve plus a Fermat-witness check, computes <code>n = p·q</code>, the Carmichael lambda <code>λ = lcm(p-1, q-1)</code>, and chooses the standard simplified generator <code>g = n+1</code> so that <code>μ = λ^{-1} mod n</code> — exactly the Paillier 1999 setup, just at 64 bits instead of the production 2048+ bits per prime. 2) <code>encrypt(m)</code> samples a fresh random <code>r</code> coprime with <code>n</code> and outputs <code>c = g^m · r^n mod n²</code> — the <code>r^n</code> factor randomizes the ciphertext so encrypting the same salary twice produces unlinkable ciphertexts (semantic security). 3) The server-side homomorphic sum <code>c_sum = ∏ ct_i mod n²</code> exploits Paillier's killer identity <code>E(m_1) · E(m_2) = E(m_1 + m_2)</code> — the printed ciphertext is a fresh encryption of the sum even though the server never saw any plaintext. 4) <code>decrypt</code> raises the ciphertext to <code>λ</code> mod n², applies the discrete-log function <code>L(x) = (x-1)/n</code>, and multiplies by <code>μ</code> — recovering exactly <code>3000 + 5500 + 4200 = 12700</code>, the operation that powers Apple's PSI for shared photo albums and every encrypted-statistics product Domingo-Ferrer's CRISES group has published since the early 2000s.</p>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gentry 2009 — The Bootstrapping Idea</h2>
<p class="l-text">All lattice-based encryption adds noise to ciphertexts: c = encryption(m) + small noise. Each multiplication roughly squares the noise; after enough operations, decryption fails. Gentry's bootstrapping trick: encrypt the secret key under itself, then run the decryption circuit <em>inside</em> the homomorphic evaluator on the noisy ciphertext. The output is a fresh encryption of the same plaintext with reset noise. As long as the scheme can homomorphically evaluate its own decryption circuit (the "circular security" assumption), you can bootstrap.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cost in 2009</div><div class="card-body">~30 minutes per AND gate. Gentry's PhD prototype on a research cluster.</div></div>
<div class="calc-card"><div class="card-title">Cost in 2026</div><div class="card-body">~10 ms per CKKS bootstrap on a high-end GPU (NVIDIA H100). 6 orders of magnitude in 17 years.</div></div>
<div class="calc-card"><div class="card-title">TFHE bootstrap</div><div class="card-body">~10 μs per gate on CPU (Chillotti et al., 2016). The fastest FHE for boolean circuits, used by Zama Concrete and TFHE-rs.</div></div>
<div class="calc-card"><div class="card-title">Levelled vs bootstrapped</div><div class="card-body">For shallow circuits (depth &lt; 30), skip bootstrap, use levelled scheme — 100× faster. ML inference fits this if the network is shallow or polynomially-approximated.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Modern Schemes — BFV / BGV / CKKS / TFHE</h2>
<p class="l-text">All modern FHE is built on the <strong>Ring Learning With Errors</strong> problem: given (a, b = a·s + e) with secret s and tiny noise e, recover s. As hard as worst-case lattice problems (Regev 2005, Lyubashevsky-Peikert-Regev 2010). The four big production schemes:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BFV (Brakerski-Fan-Vercauteren 2012)</div><div class="card-body">Exact integer arithmetic mod a prime t. Plaintext space: integer vectors batched via SIMD slots. Used by SEAL by default. Best for finite-field computations (e-voting, integer ML).</div></div>
<div class="calc-card"><div class="card-title">BGV (Brakerski-Gentry-Vaikuntanathan 2011)</div><div class="card-body">Similar to BFV, slightly different noise management (modulus switching). HElib / OpenFHE flagship. Faster for deep circuits with manual modulus chain.</div></div>
<div class="calc-card"><div class="card-title">CKKS (Cheon-Kim-Kim-Song 2017)</div><div class="card-body">APPROXIMATE arithmetic on real / complex numbers. Encrypt a vector of floats, get a vector of floats back with small added error. The right choice for ML, signal processing, statistics. SEAL, OpenFHE, Lattigo all support it.</div></div>
<div class="calc-card"><div class="card-title">TFHE (Chillotti-Gama-Georgieva-Izabachène 2016)</div><div class="card-body">Boolean gates. Each gate is one bootstrap, ~10 μs CPU. Best for non-arithmetic logic (comparisons, lookup tables, decision trees). Zama Concrete and TFHE-rs are the implementations.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The LWE Toy — Lattice Cryptography in 30 Lines</h2>
<p class="l-text">Before we trust FHE, we should understand the underlying hard problem. Learning With Errors (LWE) is the lattice problem at the heart of every modern FHE scheme. Ciphertexts are noisy linear-algebra equations.</p>

<div class="katex-block">$$b = A \\cdot s + e \\pmod{q} \\quad\\quad \\text{recover } s \\text{ given } (A, b), e \\text{ small}$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy symmetric LWE encryption: encrypt a single bit, watch additivity, see how noise grows.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">42</span>)

n, q = <span class="num">16</span>, <span class="num">257</span>
s = np.random.<span class="fn">randint</span>(<span class="num">0</span>, q, n)        <span class="cm"># secret key</span>

<span class="kw">def</span> <span class="fn">enc</span>(bit):
    a = np.random.<span class="fn">randint</span>(<span class="num">0</span>, q, n)
    e = np.random.<span class="fn">randint</span>(-<span class="num">3</span>, <span class="num">4</span>)      <span class="cm"># tiny noise</span>
    b = (a @ s + e + bit * (q // <span class="num">2</span>)) % q
    <span class="kw">return</span> a, b

<span class="kw">def</span> <span class="fn">dec</span>(a, b):
    v = (b - a @ s) % q
    <span class="cm"># Round to nearest 0 or q/2</span>
    <span class="kw">return</span> <span class="num">0</span> <span class="kw">if</span> <span class="fn">min</span>(v, q - v) &lt; q // <span class="num">4</span> <span class="kw">else</span> <span class="num">1</span>

<span class="cm"># Encrypt two bits and homomorphically add (XOR)</span>
a1, b1 = <span class="fn">enc</span>(<span class="num">1</span>)
a2, b2 = <span class="fn">enc</span>(<span class="num">1</span>)
a_sum, b_sum = (a1 + a2) % q, (b1 + b2) % q

<span class="fn">print</span>(<span class="str">'dec(c1)        ='</span>, <span class="fn">dec</span>(a1, b1),  <span class="str">'  (expected 1)'</span>)
<span class="fn">print</span>(<span class="str">'dec(c2)        ='</span>, <span class="fn">dec</span>(a2, b2),  <span class="str">'  (expected 1)'</span>)
<span class="fn">print</span>(<span class="str">'dec(c1 + c2)   ='</span>, <span class="fn">dec</span>(a_sum, b_sum), <span class="str">'  (1+1=0 mod 2 expected)'</span>)

<span class="cm"># Noise grows with each addition — after ~5-10 additions, decryption fails</span>
<span class="cm"># Bootstrapping resets noise; without it, you have a Somewhat-Homomorphic scheme.</span>
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up symmetric LWE parameters <code>n=16</code> (lattice dimension) and modulus <code>q=257</code> — a 8-bit prime makes the demo run in milliseconds; production CKKS/BFV uses <code>n=8192</code> and 60-200 bit primes for 128-bit security against the Block-Korkine-Zolotarev (BKZ) lattice reduction attack. 2) <code>enc(bit)</code> samples a random row <code>a</code>, a tiny noise <code>e ∈ {-3..3}</code>, and emits <code>b = a·s + e + bit·(q/2) mod q</code> — encoding the bit by shifting the result by <code>q/2 = 128</code>, exactly the Regev 2005 LWE encryption that every modern FHE scheme generalizes. 3) <code>dec(a, b)</code> recovers <code>v = b − a·s mod q</code>, which equals <code>e + bit·(q/2)</code>; the closest of <code>{0, q/2}</code> wins — the threshold check <code>min(v, q-v) &lt; q//4</code> tolerates noise up to ~q/4, which is why all the additions you can do before bootstrapping is limited. 4) Adding the two ciphertexts <code>(a1+a2, b1+b2)</code> homomorphically adds the underlying bits (here 1+1=0 mod 2 because <code>q/2 + q/2 ≡ 0 mod q</code>), while doubling the noise budget — after ~5-10 additions the noise exceeds <code>q/4</code> and decryption flips, which is precisely the problem Gentry's bootstrapping (and CKKS modulus switching) was invented to solve.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Microsoft SEAL — The Industrial Library</h2>
<p class="l-text">Microsoft Research's <strong>SEAL</strong> (Simple Encrypted Arithmetic Library) is the most-deployed FHE library: BFV and CKKS, C++ with Python bindings (PySEAL, TenSEAL). MIT-licensed. Used in Microsoft's Edge research, Apple's PSI for Photos, and dozens of academic projects. Paired with the SEAL-Embedded compiler, it runs on microcontrollers.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — uses TenSEAL (Microsoft SEAL Python wrapper). Not in Pyodide.</span>
<span class="cm"># Local: pip install tenseal</span>
<span class="kw">import</span> tenseal <span class="kw">as</span> ts

<span class="cm"># CKKS context: depth 4 ciphertexts, 40-bit precision</span>
ctx = ts.<span class="fn">context</span>(
    ts.SCHEME_TYPE.CKKS,
    poly_modulus_degree=<span class="num">8192</span>,
    coeff_mod_bit_sizes=[<span class="num">60</span>, <span class="num">40</span>, <span class="num">40</span>, <span class="num">60</span>]
)
ctx.global_scale = <span class="num">2</span>**<span class="num">40</span>
ctx.<span class="fn">generate_galois_keys</span>()

<span class="cm"># Client encrypts a vector of features</span>
features = [<span class="num">0.3</span>, -<span class="num">1.2</span>, <span class="num">4.7</span>, <span class="num">0.05</span>, -<span class="num">0.8</span>]
ct = ts.<span class="fn">ckks_vector</span>(ctx, features)

<span class="cm"># Server applies a polynomial activation: 0.5 + 0.197x + 0.004x^3 (degree-3 sigmoid approx)</span>
ct2 = <span class="num">0.5</span> + <span class="num">0.197</span> * ct + <span class="num">0.004</span> * (ct * ct * ct)

<span class="cm"># Client decrypts</span>
result = ct2.<span class="fn">decrypt</span>()
<span class="fn">print</span>(<span class="str">'encrypted-eval result:'</span>, [<span class="fn">round</span>(x, <span class="num">4</span>) <span class="kw">for</span> x <span class="kw">in</span> result])
<span class="cm"># Plaintext sanity check</span>
<span class="fn">print</span>(<span class="str">'plaintext result:    '</span>,
      [<span class="fn">round</span>(<span class="num">0.5</span> + <span class="num">0.197</span>*x + <span class="num">0.004</span>*x**<span class="num">3</span>, <span class="num">4</span>) <span class="kw">for</span> x <span class="kw">in</span> features])
</code></pre>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. OpenFHE — The Merger and Modern Default</h2>
<p class="l-text">In 2022 the maintainers of <strong>PALISADE</strong> (DARPA-funded, NJIT-led) and <strong>HElib</strong> (IBM Research) merged their codebases into <strong>OpenFHE</strong>. Apache 2.0 license. Supports BFV, BGV, CKKS, FHEW (gate bootstrapping). The reference implementation for the FHE.org community standard. Backed by Duality Technologies and Intel.</p>

<div class="calc-highlight"><strong>OpenFHE vs SEAL in 2026:</strong> OpenFHE has a much wider scheme catalog (FHEW for boolean), a cleaner API for scheme switching (BFV ↔ CKKS), and a much faster bootstrap. SEAL has tighter integration with .NET / Apple platforms and Microsoft's research tooling. New projects increasingly start with OpenFHE.</div>

<p class="l-text">Both libraries expose the same conceptual surface: <code>Context</code> (parameters), <code>KeyGen</code>, <code>Encrypt / Decrypt</code>, <code>EvalAdd</code>, <code>EvalMult</code>, <code>EvalRotate</code> (for SIMD slot-shifting), <code>EvalBootstrap</code>. The hard part is parameter selection; the libraries provide estimators (<code>OpenFHE/native_int/lattice/lat-est.cpp</code>) that compute attack costs against the chosen parameters.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Encrypted ML Inference — Concrete-ML, EZKL, Apple PCC</h2>
<p class="l-text">The killer app for FHE is <strong>private inference</strong>: a client encrypts an input (a credit query, a medical image, a personal email), the cloud runs a neural network on it, returns an encrypted prediction. Three production approaches:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Concrete-ML (Zama 2022+)</div><div class="card-body">Compile a scikit-learn / PyTorch model to TFHE; every neuron is a TFHE-bootstrapped lookup table. ~1 second per MNIST classification on CPU. Quantized 8-bit only.</div></div>
<div class="calc-card"><div class="card-title">CryptoNets / SEAL-ML</div><div class="card-body">CKKS with polynomial activation approximations. Faster for deep nets but no exact ReLU. CryptoNets (MSR 2016) was the seminal demo: encrypted MNIST in 250 seconds.</div></div>
<div class="calc-card"><div class="card-title">Apple Private Cloud Compute (2024)</div><div class="card-body">Hybrid: TEE (Apple Silicon Secure Enclave) + selective HE (Wally PIR). Server hardware proofs published. The first consumer-grade private cloud at scale.</div></div>
<div class="calc-card"><div class="card-title">FHE-friendly architectures</div><div class="card-body">Replace ReLU with x², replace softmax with sums, prune deep layers, use 4-bit quantization. Models like CryptoNets-style ResNet-20 on CIFAR run in &lt; 5 minutes encrypted.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. When NOT to Use FHE — MPC, ZK, TEE Trade-offs</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Use HE when</div><div class="card-body">Single non-colluding cloud server, client trusts no one, data is at rest in encrypted form, computation is structured (small fixed circuit). Aggregations, ML inference, private set intersection (PSI).</div></div>
<div class="calc-card"><div class="card-title">Use MPC instead when</div><div class="card-body">Multiple parties each have private inputs, the parties are on equal footing (think auctions, joint statistics across companies). MPC is faster than HE for many workloads — see lesson 7.</div></div>
<div class="calc-card"><div class="card-title">Use ZK instead when</div><div class="card-body">You want a single party to prove a fact about private data, with public verifiability. ZK does not give you encrypted computation — it gives you a verifiable execution trace.</div></div>
<div class="calc-card"><div class="card-title">Use TEE instead when</div><div class="card-body">You trust the hardware vendor (Intel SGX, AMD SEV-SNP, Apple Secure Enclave) and need full performance. Confidential VMs run plaintext inside the enclave; HE never approaches plaintext speed for large models.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">Homomorphic Encryption went from theoretical curiosity to production tooling in 17 years. Paillier gives you free addition; Gentry's bootstrapping unlocks FHE; BFV / BGV / CKKS / TFHE cover today's deployments; SEAL and OpenFHE are the libraries you actually use; Apple PCC and Zama Concrete are the consumer-grade products. The math is daunting (lattices, RLWE, polynomial rings) but the operational story is simple: encrypt-once, compute-anywhere.</p>

<p class="l-text">Lesson 7 turns to <strong>Secure Multiparty Computation (MPC)</strong>: when several parties each hold private inputs and want to compute a joint function without revealing their inputs to each other. Yao's millionaires problem (1982) started the field; Shamir secret sharing (1979) is the building block; SPDZ and MP-SPDZ are the modern libraries powering financial benchmarks, ad attribution, and key management at scale.</p>
</div>`,
tr: `<p class="l-text"><strong>Homomorfik Şifreleme (HE) bir sunucunun okuyamadığı veriler üzerinde hesaplama yapmasına izin verir.</strong> Bir istemci bir <em>m</em> sayısını şifreler, c = E(m) şifreli metnini buluta gönderir, bulut c üzerinde <em>f</em>'yi (anahtarı asla tutmadan) çalıştırır, c' = E(f(m)) döndürür ve istemci f(m) almak için şifre çözer. On yıllarca bilinen tek şemalar "kısmen" homomorfikti — RSA (çarpımsal), ElGamal (çarpımsal), Paillier (toplamsal). Sonra Craig Gentry, 2009 Stanford doktora tezinde, ilk <strong>Tamamen Homomorfik Şifreleme</strong> şemasını inşa etti: toplama VE çarpma, sonsuz derin devreler, şifreli metinler üzerinde. İlk FHE değerlendirmesi tek bir AND geçidi için 30 dakika sürdü; bugün GPU üzerinde CKKS, neredeyse gerçek zamanlı şifreli sinir ağı çıkarımı yapar.</p>

<p class="l-text">Bu derste toplamsal-homomorfik Paillier'i (1999) yürüyoruz, Gentry'nin bootstrapping atılımının neden önemli olduğunu açıklıyoruz, modern kafes tabanlı FHE şemalarını araştırıyoruz — BFV / BGV (tam tam sayılar), CKKS (yaklaşık sabit nokta, 2017), TFHE (geçit-geçit boolean) — ve üretim kütüphaneleri Microsoft SEAL, OpenFHE (PALISADE + HElib birleşmesi), Concrete (Zama), Lattigo (Tune Insight)'ı geziyoruz. Katil uygulama ile kapatıyoruz: şifreli makine öğrenimi çıkarımı. Apple'ın Private Cloud Compute'u (2024-2026) ve Zama'nın Concrete-ML'i HE'yi ana akım ürünlere itiyor.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Spektrumu ifade edin: PHE (bir işlem) → SHE (sınırlı derinlik) → FHE (herhangi bir devre)</li>
<li>Paillier'i sıfırdan uygulayın ve D(E(m1)·E(m2)) = m1 + m2 doğrulayın</li>
<li>Gentry 2009'un bootstrapping'ini açıklayın: sınırsız devre derinliğini açan hile</li>
<li>BFV/BGV (tam tam sayılar) ile CKKS (yaklaşık float'lar) ile TFHE (boolean geçitler)'i karşılaştırın</li>
<li>HE'nin MPC'ye, ZK'ya veya TEE'ye (Intel SGX, AMD SEV) karşı doğru araç olduğunu tanıyın</li>
<li>Bir SEAL veya OpenFHE programını okuyun ve performans bütçesini tahmin edin</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Spektrum — PHE, SHE, FHE</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kısmen Homomorfik (PHE)</div><div class="card-body">Bir işlem. RSA: E(m1)·E(m2) = E(m1·m2 mod n). Paillier: E(m1)·E(m2) = E(m1 + m2). ElGamal: çarpımsal. Ucuz ve eski. E-oylama (Helios Paillier kullanır), özel küme kesişimi tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Bir Şekilde Homomorfik (SHE)</div><div class="card-body">Hem + hem ×, ancak sınırlı çarpımsal derinlik. ~20-30 çarpmadan sonra gürültü mesajı bastırır. BGV / BFV / CKKS varsayılan olarak SHE'dir.</div></div>
<div class="calc-card"><div class="card-title">Tamamen Homomorfik (FHE)</div><div class="card-body">Her iki işlem, "bootstrapping" aracılığıyla sınırsız derinlik — devre içinde gürültüyü sıfırlayan homomorfik bir şifre çözme. Gentry 2009 ilk yapıydı; modern şemalar tekniği miras alır.</div></div>
<div class="calc-card"><div class="card-title">Seviyeli FHE</div><div class="card-body">Pratikte önceden bir L derinliği seçer ve şemayı, gürültünün L çarpma için bootstrapping olmadan eşik altında kalacak şekilde parametrelendirirsiniz. Tam FHE'den daha hızlı; neredeyse tüm üretim sistemlerinde kullanılır.</div></div>
</div>

<div class="calc-highlight"><strong>Bootstrapping neden Kutsal Kâse'ydi:</strong> Rivest-Adleman-Dertouzos'un 1978'deki "şifrelenmiş veri üzerinde hesaplama yapabilir misiniz?" sorusu ile Gentry'nin 2009 tezi arasındaki 30 yıl boyunca, kimse FHE'nin mümkün olup olmadığını bilmiyordu. Gentry'nin yapısı ideal kafesler kullandı ve ünlü şekilde yavaştı (30 dk/geçit); Brakerski-Gentry-Vaikuntanathan (BGV) 2011 Ring-LWE üzerindeki yeniden tasarımı onu uygulanabilir hâle getirdi.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Paillier — Toplamsal Homomorfik, Saf Python</h2>
<p class="l-text">Pascal Paillier'in 1999 kripto sistemi, FHE öncesi güvenli hesaplamanın iş atıdır. KeyGen iki asal p, q seçer ve n = pq, λ = lcm(p-1, q-1) hesaplar. Genel anahtar: (n, g) burada g tipik olarak n+1'dir. m'yi şifrele: rastgele r seçin, c = g^m · r^n mod n² çıktı verin. Şifre çöz: L(c^λ mod n²) · μ mod n burada L(x) = (x-1)/n.</p>

<div class="katex-block">$$E(m_1) \\cdot E(m_2) \\bmod n^2 \\;=\\; E(m_1 + m_2 \\bmod n) \\quad\\quad E(m)^k \\bmod n^2 \\;=\\; E(k \\cdot m)$$</div>

<p class="l-text">Her iki özellik de cebirden "bedava" gelir. Sunucu tarafında bir şifrelenmiş defter kayıt sütununu toplayabilirsiniz; her birini bir genel skaler ağırlık ile çarpabilirsiniz. İki şifreli metni birlikte çarpamazsınız — bu FHE gerektirir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sıfırdan Paillier. Üç defter kaydı şifreliyoruz, sunucu tarafında şifre çözmeden topluyoruz, sonra toplamı şifre çözüyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets, math

<span class="kw">def</span> <span class="fn">lcm</span>(a, b):
    <span class="kw">return</span> a * b // math.<span class="fn">gcd</span>(a, b)

<span class="kw">def</span> <span class="fn">modinv</span>(a, m):
    <span class="kw">return</span> <span class="fn">pow</span>(a, -<span class="num">1</span>, m)

<span class="kw">def</span> <span class="fn">keygen</span>(bits=<span class="num">64</span>):
    <span class="cm"># Tarayıcı içi hız için oyuncak 64-bit asallar; gerçek sistemler her biri 1024-bit kullanır.</span>
    <span class="kw">def</span> <span class="fn">rand_prime</span>(bits):
        <span class="kw">while</span> <span class="kw">True</span>:
            p = secrets.<span class="fn">randbits</span>(bits) | (<span class="num">1</span> &lt;&lt; (bits - <span class="num">1</span>)) | <span class="num">1</span>
            <span class="cm"># Miller-Rabin buraya girerdi; demo için küçük olasılıklara güvenip kontrol et</span>
            small_primes = [<span class="num">2</span>,<span class="num">3</span>,<span class="num">5</span>,<span class="num">7</span>,<span class="num">11</span>,<span class="num">13</span>,<span class="num">17</span>,<span class="num">19</span>,<span class="num">23</span>,<span class="num">29</span>,<span class="num">31</span>,<span class="num">37</span>,<span class="num">41</span>,<span class="num">43</span>,<span class="num">47</span>]
            <span class="kw">if</span> <span class="fn">all</span>(p % sp != <span class="num">0</span> <span class="kw">for</span> sp <span class="kw">in</span> small_primes):
                <span class="cm"># bir güçlü-asal tarzı kontrol</span>
                <span class="kw">if</span> <span class="fn">pow</span>(<span class="num">2</span>, p - <span class="num">1</span>, p) == <span class="num">1</span>: <span class="kw">return</span> p
    p, q = <span class="fn">rand_prime</span>(bits), <span class="fn">rand_prime</span>(bits)
    <span class="kw">while</span> p == q: q = <span class="fn">rand_prime</span>(bits)
    n   = p * q
    lam = <span class="fn">lcm</span>(p - <span class="num">1</span>, q - <span class="num">1</span>)
    g   = n + <span class="num">1</span>                               <span class="cm"># standart basitleştirilmiş seçim</span>
    mu  = <span class="fn">modinv</span>(lam, n)                      <span class="cm"># g = n+1 olduğundan L(g^lam) = lam çıkar</span>
    <span class="kw">return</span> (n, g), (lam, mu)

<span class="kw">def</span> <span class="fn">encrypt</span>(pub, m):
    n, g = pub
    <span class="kw">while</span> <span class="kw">True</span>:
        r = secrets.<span class="fn">randbelow</span>(n - <span class="num">1</span>) + <span class="num">1</span>
        <span class="kw">if</span> math.<span class="fn">gcd</span>(r, n) == <span class="num">1</span>: <span class="kw">break</span>
    n2 = n * n
    <span class="kw">return</span> (<span class="fn">pow</span>(g, m, n2) * <span class="fn">pow</span>(r, n, n2)) % n2

<span class="kw">def</span> <span class="fn">decrypt</span>(pub, priv, c):
    n, _   = pub
    lam, mu = priv
    n2 = n * n
    u  = <span class="fn">pow</span>(c, lam, n2)
    L  = (u - <span class="num">1</span>) // n
    <span class="kw">return</span> (L * mu) % n

pub, priv = <span class="fn">keygen</span>(bits=<span class="num">64</span>)
n = pub[<span class="num">0</span>]; n2 = n * n

<span class="cm"># Üç değeri şifrele</span>
salaries = [<span class="num">3000</span>, <span class="num">5500</span>, <span class="num">4200</span>]
cts = [<span class="fn">encrypt</span>(pub, m) <span class="kw">for</span> m <span class="kw">in</span> salaries]

<span class="cm"># Sunucu onları homomorfik olarak toplar — düz metni asla görmez</span>
c_sum = <span class="num">1</span>
<span class="kw">for</span> ct <span class="kw">in</span> cts:
    c_sum = (c_sum * ct) % n2

<span class="fn">print</span>(<span class="str">'encrypted total (first 32 hex):'</span>, <span class="fn">hex</span>(c_sum)[:<span class="num">34</span>], <span class="str">'...'</span>)
<span class="fn">print</span>(<span class="str">'decrypted total:'</span>, <span class="fn">decrypt</span>(pub, priv, c_sum), <span class="str">'  (expected'</span>, <span class="fn">sum</span>(salaries), <span class="str">')'</span>)
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>keygen</code> küçük asal eleği ve Fermat-tanık kontrolü ile iki 64-bit asal <code>p, q</code> çeker, <code>n = p·q</code>'yu, Carmichael lambdasını <code>λ = lcm(p-1, q-1)</code>'i hesaplar ve standart basitleştirilmiş üreteç <code>g = n+1</code>'i seçer, böylece <code>μ = λ^{-1} mod n</code> — tam olarak Paillier 1999 kurulumu, sadece üretim 2048+ bit yerine asal başına 64 bit. 2) <code>encrypt(m)</code> <code>n</code> ile aralarında asal taze bir <code>r</code> örnekler ve <code>c = g^m · r^n mod n²</code> çıktısı verir — <code>r^n</code> faktörü şifreli metni rastgeleleştirir, böylece aynı maaşı iki kez şifrelemek birbiriyle bağlanamayan şifreli metinler üretir (semantic security). 3) Sunucu tarafında homomorfik toplam <code>c_sum = ∏ ct_i mod n²</code> Paillier'in öldürücü özdeşliği <code>E(m_1) · E(m_2) = E(m_1 + m_2)</code>'i sömürür — yazdırılan şifreli metin, sunucu hiçbir düz metni görmediği halde toplamın taze bir şifrelemesidir. 4) <code>decrypt</code> şifreli metni mod n²'de <code>λ</code> kuvvetine yükseltir, discrete-log fonksiyonu <code>L(x) = (x-1)/n</code>'i uygular ve <code>μ</code> ile çarpar — tam olarak <code>3000 + 5500 + 4200 = 12700</code>'i geri kazanır, Apple'ın paylaşılan foto albümleri için PSI'sini ve Domingo-Ferrer'in CRISES grubunun 2000'lerin başından beri yayınladığı her şifrelenmiş istatistik ürününü güçlendiren işlem.</p>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gentry 2009 — Bootstrapping Fikri</h2>
<p class="l-text">Tüm kafes tabanlı şifreleme şifreli metinlere gürültü ekler: c = encryption(m) + küçük gürültü. Her çarpma kabaca gürültüyü kareler; yeterli işlemden sonra şifre çözme başarısız olur. Gentry'nin bootstrapping hilesi: gizli anahtarı kendi altında şifreleyin, sonra şifre çözme devresini gürültülü şifreli metin üzerinde homomorfik değerlendiricinin <em>içinde</em> çalıştırın. Çıktı, sıfırlanmış gürültü ile aynı düz metnin yeni bir şifrelemesidir. Şema kendi şifre çözme devresini homomorfik olarak değerlendirebildiği sürece ("dairesel güvenlik" varsayımı), bootstrap yapabilirsiniz.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">2009'da maliyet</div><div class="card-body">AND geçidi başına ~30 dakika. Gentry'nin bir araştırma kümesindeki doktora prototipi.</div></div>
<div class="calc-card"><div class="card-title">2026'da maliyet</div><div class="card-body">Üst düzey GPU'da (NVIDIA H100) CKKS bootstrap başına ~10 ms. 17 yılda 6 büyüklük mertebesi.</div></div>
<div class="calc-card"><div class="card-title">TFHE bootstrap</div><div class="card-body">CPU'da geçit başına ~10 μs (Chillotti vd., 2016). Boolean devreler için en hızlı FHE, Zama Concrete ve TFHE-rs tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Seviyeli vs bootstrap'lı</div><div class="card-body">Sığ devreler için (derinlik &lt; 30), bootstrap'ı atlayın, seviyeli şema kullanın — 100× daha hızlı. Ağ sığ veya polinomsal olarak yaklaşıklaştırılmışsa ML çıkarımı buna uyar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Modern Şemalar — BFV / BGV / CKKS / TFHE</h2>
<p class="l-text">Tüm modern FHE, <strong>Ring Learning With Errors</strong> probleminin üzerine inşa edilmiştir: gizli s ve küçük gürültü e ile (a, b = a·s + e) verildiğinde, s'yi kurtar. En kötü durum kafes problemleri kadar zor (Regev 2005, Lyubashevsky-Peikert-Regev 2010). Dört büyük üretim şeması:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BFV (Brakerski-Fan-Vercauteren 2012)</div><div class="card-body">t asalına göre tam tam sayı aritmetiği. Düz metin alanı: SIMD slotları aracılığıyla toplu tam sayı vektörleri. SEAL tarafından varsayılan olarak kullanılır. Sonlu alan hesaplamaları için en iyisi (e-oylama, tam sayı ML).</div></div>
<div class="calc-card"><div class="card-title">BGV (Brakerski-Gentry-Vaikuntanathan 2011)</div><div class="card-body">BFV'ye benzer, biraz farklı gürültü yönetimi (modül değiştirme). HElib / OpenFHE amiral gemisi. Manuel modül zinciri ile derin devreler için daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">CKKS (Cheon-Kim-Kim-Song 2017)</div><div class="card-body">Reel / karmaşık sayılar üzerinde YAKLAŞIK aritmetik. Float vektörü şifreleyin, küçük eklenmiş hatayla bir float vektörü geri alın. ML, sinyal işleme, istatistik için doğru seçim. SEAL, OpenFHE, Lattigo hepsi destekler.</div></div>
<div class="calc-card"><div class="card-title">TFHE (Chillotti-Gama-Georgieva-Izabachène 2016)</div><div class="card-body">Boolean geçitleri. Her geçit bir bootstrap, ~10 μs CPU. Aritmetik olmayan mantık (karşılaştırmalar, arama tabloları, karar ağaçları) için en iyisi. Zama Concrete ve TFHE-rs uygulamalardır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. LWE Oyuncağı — 30 Satırda Kafes Kriptografisi</h2>
<p class="l-text">FHE'ye güvenmeden önce, altta yatan zor problemi anlamalıyız. Learning With Errors (LWE), her modern FHE şemasının kalbindeki kafes problemidir. Şifreli metinler gürültülü doğrusal cebir denklemleridir.</p>

<div class="katex-block">$$b = A \\cdot s + e \\pmod{q} \\quad\\quad \\text{recover } s \\text{ given } (A, b), e \\text{ small}$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak simetrik LWE şifreleme: tek bir bit şifreleyin, toplamsallığı izleyin, gürültünün nasıl büyüdüğünü görün.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">42</span>)

n, q = <span class="num">16</span>, <span class="num">257</span>
s = np.random.<span class="fn">randint</span>(<span class="num">0</span>, q, n)        <span class="cm"># gizli anahtar</span>

<span class="kw">def</span> <span class="fn">enc</span>(bit):
    a = np.random.<span class="fn">randint</span>(<span class="num">0</span>, q, n)
    e = np.random.<span class="fn">randint</span>(-<span class="num">3</span>, <span class="num">4</span>)      <span class="cm"># küçük gürültü</span>
    b = (a @ s + e + bit * (q // <span class="num">2</span>)) % q
    <span class="kw">return</span> a, b

<span class="kw">def</span> <span class="fn">dec</span>(a, b):
    v = (b - a @ s) % q
    <span class="cm"># En yakın 0 veya q/2'ye yuvarla</span>
    <span class="kw">return</span> <span class="num">0</span> <span class="kw">if</span> <span class="fn">min</span>(v, q - v) &lt; q // <span class="num">4</span> <span class="kw">else</span> <span class="num">1</span>

<span class="cm"># İki biti şifrele ve homomorfik olarak topla (XOR)</span>
a1, b1 = <span class="fn">enc</span>(<span class="num">1</span>)
a2, b2 = <span class="fn">enc</span>(<span class="num">1</span>)
a_sum, b_sum = (a1 + a2) % q, (b1 + b2) % q

<span class="fn">print</span>(<span class="str">'dec(c1)        ='</span>, <span class="fn">dec</span>(a1, b1),  <span class="str">'  (expected 1)'</span>)
<span class="fn">print</span>(<span class="str">'dec(c2)        ='</span>, <span class="fn">dec</span>(a2, b2),  <span class="str">'  (expected 1)'</span>)
<span class="fn">print</span>(<span class="str">'dec(c1 + c2)   ='</span>, <span class="fn">dec</span>(a_sum, b_sum), <span class="str">'  (1+1=0 mod 2 expected)'</span>)

<span class="cm"># Her toplamayla gürültü büyür — ~5-10 toplamadan sonra şifre çözme başarısız olur</span>
<span class="cm"># Bootstrapping gürültüyü sıfırlar; onsuz, Bir Şekilde-Homomorfik bir şemanız vardır.</span>
</code></pre></div></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Simetrik LWE parametrelerini <code>n=16</code> (kafes boyutu) ve modül <code>q=257</code> olarak kurar — 8-bit asal demo'nun milisaniyelerde çalışmasını sağlar; üretim CKKS/BFV Block-Korkine-Zolotarev (BKZ) kafes indirgeme saldırısına karşı 128-bit güvenlik için <code>n=8192</code> ve 60-200 bit asallar kullanır. 2) <code>enc(bit)</code> rastgele satır <code>a</code>, küçük gürültü <code>e ∈ {-3..3}</code> örnekler ve <code>b = a·s + e + bit·(q/2) mod q</code> yayar — biti sonucu <code>q/2 = 128</code> kaydırarak kodlar, tam olarak her modern FHE şemasının genelleştirdiği Regev 2005 LWE şifrelemesidir. 3) <code>dec(a, b)</code> <code>v = b − a·s mod q</code>'yu geri kazanır, ki bu <code>e + bit·(q/2)</code>'ye eşittir; <code>{0, q/2}</code>'den en yakın olanı kazanır — eşik kontrolü <code>min(v, q-v) &lt; q//4</code> ~q/4'e kadar gürültüye tolerans gösterir, bu yüzden bootstrap'ten önce yapabileceğiniz tüm eklemeler sınırlıdır. 4) İki şifreli metni <code>(a1+a2, b1+b2)</code> toplamak alttaki bitleri homomorfik olarak ekler (burada 1+1=0 mod 2 çünkü <code>q/2 + q/2 ≡ 0 mod q</code>), gürültü bütçesini iki katına çıkarırken — ~5-10 eklemeden sonra gürültü <code>q/4</code>'ü aşar ve şifre çözme döner, ki bu tam olarak Gentry'nin bootstrapping'inin (ve CKKS modülüs değiştirme'nin) çözmek için icat edildiği problemdir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Microsoft SEAL — Endüstriyel Kütüphane</h2>
<p class="l-text">Microsoft Research'ün <strong>SEAL</strong>'i (Simple Encrypted Arithmetic Library) en çok dağıtılan FHE kütüphanesidir: BFV ve CKKS, Python bağlamaları (PySEAL, TenSEAL) ile C++. MIT lisanslı. Microsoft'un Edge araştırmasında, Apple'ın Photos için PSI'sinde ve düzinelerce akademik projede kullanılır. SEAL-Embedded derleyicisiyle eşleştirilmiş, mikrodenetleyicilerde çalışır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — TenSEAL kullanır (Microsoft SEAL Python sarmalayıcısı). Pyodide'de yok.</span>
<span class="cm"># Yerel: pip install tenseal</span>
<span class="kw">import</span> tenseal <span class="kw">as</span> ts

<span class="cm"># CKKS bağlamı: derinlik 4 şifreli metin, 40-bit hassasiyet</span>
ctx = ts.<span class="fn">context</span>(
    ts.SCHEME_TYPE.CKKS,
    poly_modulus_degree=<span class="num">8192</span>,
    coeff_mod_bit_sizes=[<span class="num">60</span>, <span class="num">40</span>, <span class="num">40</span>, <span class="num">60</span>]
)
ctx.global_scale = <span class="num">2</span>**<span class="num">40</span>
ctx.<span class="fn">generate_galois_keys</span>()

<span class="cm"># İstemci bir özellik vektörü şifreler</span>
features = [<span class="num">0.3</span>, -<span class="num">1.2</span>, <span class="num">4.7</span>, <span class="num">0.05</span>, -<span class="num">0.8</span>]
ct = ts.<span class="fn">ckks_vector</span>(ctx, features)

<span class="cm"># Sunucu bir polinom aktivasyon uygular: 0.5 + 0.197x + 0.004x^3 (derece-3 sigmoid yaklaşımı)</span>
ct2 = <span class="num">0.5</span> + <span class="num">0.197</span> * ct + <span class="num">0.004</span> * (ct * ct * ct)

<span class="cm"># İstemci şifre çözer</span>
result = ct2.<span class="fn">decrypt</span>()
<span class="fn">print</span>(<span class="str">'encrypted-eval result:'</span>, [<span class="fn">round</span>(x, <span class="num">4</span>) <span class="kw">for</span> x <span class="kw">in</span> result])
<span class="cm"># Düz metin doğruluk kontrolü</span>
<span class="fn">print</span>(<span class="str">'plaintext result:    '</span>,
      [<span class="fn">round</span>(<span class="num">0.5</span> + <span class="num">0.197</span>*x + <span class="num">0.004</span>*x**<span class="num">3</span>, <span class="num">4</span>) <span class="kw">for</span> x <span class="kw">in</span> features])
</code></pre>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. OpenFHE — Birleşme ve Modern Varsayılan</h2>
<p class="l-text">2022'de <strong>PALISADE</strong>'in (DARPA finanslı, NJIT liderliğinde) ve <strong>HElib</strong>'in (IBM Research) bakımcıları kod tabanlarını <strong>OpenFHE</strong>'de birleştirdi. Apache 2.0 lisansı. BFV, BGV, CKKS, FHEW (geçit bootstrapping) destekler. FHE.org topluluk standardı için referans uygulama. Duality Technologies ve Intel tarafından desteklenir.</p>

<div class="calc-highlight"><strong>2026'da OpenFHE vs SEAL:</strong> OpenFHE çok daha geniş bir şema kataloğuna (boolean için FHEW), şema değiştirme için daha temiz bir API'ye (BFV ↔ CKKS) ve çok daha hızlı bir bootstrap'a sahiptir. SEAL'ın .NET / Apple platformları ve Microsoft'un araştırma araçlarıyla daha sıkı entegrasyonu vardır. Yeni projeler giderek OpenFHE ile başlıyor.</div>

<p class="l-text">Her iki kütüphane de aynı kavramsal yüzeyi açığa çıkarır: <code>Context</code> (parametreler), <code>KeyGen</code>, <code>Encrypt / Decrypt</code>, <code>EvalAdd</code>, <code>EvalMult</code>, <code>EvalRotate</code> (SIMD slot kaydırma için), <code>EvalBootstrap</code>. Zor kısım parametre seçimidir; kütüphaneler seçilen parametrelere karşı saldırı maliyetlerini hesaplayan tahmin ediciler (<code>OpenFHE/native_int/lattice/lat-est.cpp</code>) sağlar.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Şifreli ML Çıkarımı — Concrete-ML, EZKL, Apple PCC</h2>
<p class="l-text">FHE için katil uygulama <strong>özel çıkarımdır</strong>: bir istemci bir girdiyi (bir kredi sorgusu, bir tıbbi görüntü, kişisel bir e-posta) şifreler, bulut üzerinde bir sinir ağı çalıştırır, şifrelenmiş bir tahmin döndürür. Üç üretim yaklaşımı:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Concrete-ML (Zama 2022+)</div><div class="card-body">Bir scikit-learn / PyTorch modelini TFHE'ye derler; her nöron bir TFHE-bootstrap'lanmış arama tablosudur. CPU'da MNIST sınıflandırması başına ~1 saniye. Yalnızca nicelleştirilmiş 8-bit.</div></div>
<div class="calc-card"><div class="card-title">CryptoNets / SEAL-ML</div><div class="card-body">Polinom aktivasyon yaklaşımları ile CKKS. Derin ağlar için daha hızlı ama tam ReLU yok. CryptoNets (MSR 2016) çığır açan demoydu: 250 saniyede şifrelenmiş MNIST.</div></div>
<div class="calc-card"><div class="card-title">Apple Private Cloud Compute (2024)</div><div class="card-body">Hibrit: TEE (Apple Silicon Secure Enclave) + seçici HE (Wally PIR). Sunucu donanım kanıtları yayımlandı. Ölçekteki ilk tüketici sınıfı özel bulut.</div></div>
<div class="calc-card"><div class="card-title">FHE-dostu mimariler</div><div class="card-body">ReLU'yu x² ile değiştirin, softmax'ı toplamlarla değiştirin, derin katmanları budayın, 4-bit nicelleştirme kullanın. CIFAR'da CryptoNets-tarzı ResNet-20 gibi modeller şifrelenmiş olarak &lt; 5 dakikada çalışır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. FHE Ne Zaman KULLANILMAZ — MPC, ZK, TEE Takasları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">HE'yi şu durumda kullanın</div><div class="card-body">Tek anlaşmasız bulut sunucusu, istemci kimseye güvenmez, veri şifreli formda dinlenmektedir, hesaplama yapılandırılmıştır (küçük sabit devre). Toplamalar, ML çıkarımı, özel küme kesişimi (PSI).</div></div>
<div class="calc-card"><div class="card-title">Bunun yerine MPC'yi şu durumda kullanın</div><div class="card-body">Birden fazla taraf her biri özel girdilere sahiptir, taraflar eşit konumdadır (ihaleler, şirketler arası ortak istatistikler düşünün). MPC, birçok iş yükü için HE'den daha hızlıdır — bkz. ders 7.</div></div>
<div class="calc-card"><div class="card-title">Bunun yerine ZK'yı şu durumda kullanın</div><div class="card-body">Tek bir tarafın özel veriler hakkında bir gerçeği genel doğrulanabilirlikle kanıtlamasını istediğinizde. ZK size şifrelenmiş hesaplama vermez — size doğrulanabilir bir yürütme izi verir.</div></div>
<div class="calc-card"><div class="card-title">Bunun yerine TEE'yi şu durumda kullanın</div><div class="card-body">Donanım satıcısına (Intel SGX, AMD SEV-SNP, Apple Secure Enclave) güvenirseniz ve tam performansa ihtiyacınız varsa. Gizli VM'ler enclave içinde düz metin çalıştırır; HE büyük modeller için asla düz metin hızına yaklaşmaz.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">Homomorfik Şifreleme 17 yılda teorik meraktan üretim aletine dönüştü. Paillier size ücretsiz toplama verir; Gentry'nin bootstrapping'i FHE'yi açar; BFV / BGV / CKKS / TFHE bugünün dağıtımlarını kapsar; SEAL ve OpenFHE gerçekten kullandığınız kütüphanelerdir; Apple PCC ve Zama Concrete tüketici sınıfı ürünlerdir. Matematik göz korkutucudur (kafesler, RLWE, polinom halkaları) ancak operasyonel hikâye basittir: bir-kez-şifrele, her-yerde-hesapla.</p>

<p class="l-text">Ders 7 <strong>Güvenli Çok Taraflı Hesaplamaya (MPC)</strong> döner: birkaç taraf her biri özel girdiler tutuyor ve girdilerini birbirine açığa vurmadan ortak bir fonksiyon hesaplamak istiyor. Yao'nun milyonerler problemi (1982) alanı başlattı; Shamir gizli paylaşımı (1979) yapı taşıdır; SPDZ ve MP-SPDZ, finansal kıyaslamaları, reklam atıfını ve ölçekte anahtar yönetimini güçlendiren modern kütüphanelerdir.</p>
</div>`
};
