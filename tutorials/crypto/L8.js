window.CRYPTO_L8 = {
en: `<p class="l-text"><strong>On 13 August 2024, NIST published FIPS 203, 204, and 205 — the first three post-quantum cryptography standards.</strong> ML-KEM (Module-Lattice-based Key-Encapsulation Mechanism, formerly Kyber), ML-DSA (Module-Lattice-based Digital Signature Algorithm, formerly Dilithium), and SLH-DSA (Stateless Hash-Based Signature, formerly SPHINCS+) end an eight-year competition that began in 2016. Falcon, the fourth selection, was published as FIPS 206 draft. The reason: a sufficiently large fault-tolerant quantum computer running Shor's 1994 algorithm breaks RSA, ECDSA, ECDH, and EdDSA in polynomial time. The harvest-now-decrypt-later threat — record encrypted traffic today, decrypt in 2035 — means we must migrate <em>before</em> the quantum threat materializes, not after.</p>

<p class="l-text">In this lesson we walk Shor's threat model, the LWE / Module-LWE / NTRU lattice problems underlying the new standards, the four NIST winners (ML-KEM for KEM, ML-DSA + Falcon + SLH-DSA for signatures), and the migration story: hybrid TLS 1.3 (X25519+Kyber768), Cloudflare's 2022 deployment, Apple's iMessage PQ3 (2024), Signal's PQXDH (2023). We close with the migration deadlines: NSA's CNSA 2.0 mandates PQ for new National Security Systems by 2027, and PCI / financial regulators are following.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State Shor's threat: which classical primitives die, which survive</li>
<li>Recognize lattice / hash / code / multivariate / isogeny PQ families</li>
<li>Read the NIST 2024 standards: ML-KEM, ML-DSA, SLH-DSA, Falcon</li>
<li>Understand hybrid TLS (X25519+Kyber768) and why it is the migration default</li>
<li>Implement a toy LWE encryption to feel the lattice math</li>
<li>Plan a PQ migration: inventory → hybrid → PQ-only (CNSA 2.0 by 2027)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Shor and Grover — What a Quantum Computer Breaks</h2>
<p class="l-text">Two quantum algorithms shape the threat model:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shor 1994</div><div class="card-body">Polynomial-time integer factorization and discrete logarithm. Breaks RSA, DSA, ECDSA, ECDH, EdDSA. Estimated 4096-qubit fault-tolerant machine to factor RSA-2048 — current best is ~1000 noisy qubits (IBM Heron 2024). Probably 10-20 years away; could be sooner.</div></div>
<div class="calc-card"><div class="card-title">Grover 1996</div><div class="card-body">Square-root speedup on unstructured search. Halves symmetric-key strength: AES-128 → 64-bit equivalent. Mitigation: use AES-256, SHA-384/SHA-512. SHA-256 still gives 128-bit collision resistance under quantum.</div></div>
<div class="calc-card"><div class="card-title">What survives Shor</div><div class="card-body">Symmetric: AES, ChaCha20, SHA-2, SHA-3, HMAC (with bumped key sizes). Lattice-based, hash-based, code-based, multivariate, isogeny problems — for which no efficient quantum algorithm is known.</div></div>
<div class="calc-card"><div class="card-title">Harvest-now-decrypt-later</div><div class="card-body">An adversary records encrypted traffic today, stores it cheaply, decrypts when quantum is available. For data that must stay confidential past ~2035 (medical records, classified communications, long-lived contracts), migrate now.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Five PQ Families</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lattice-based (winners)</div><div class="card-body">LWE, Ring-LWE, Module-LWE, NTRU. ML-KEM, ML-DSA, Falcon, FrodoKEM. Best balance of speed, key/sig size, security. Industry default.</div></div>
<div class="calc-card"><div class="card-title">Hash-based</div><div class="card-body">Stateless or stateful tree of one-time signatures. SLH-DSA / SPHINCS+, XMSS, LMS. Conservative — security reduces only to hash function. Large signatures (~8 KB).</div></div>
<div class="calc-card"><div class="card-title">Code-based</div><div class="card-body">McEliece (1978!) — never broken. Classic McEliece is a NIST 4th-round KEM finalist. Massive public keys (~260 KB) but tiny ciphertexts. Used in BIKE, HQC.</div></div>
<div class="calc-card"><div class="card-title">Isogeny-based</div><div class="card-body">SIDH, SIKE — once promising for tiny keys. SIKE was killed in July 2022 by Castryck-Decru's classical attack. SQIsign (NIST 2024 4th-round signature finalist) survives but is slow.</div></div>
<div class="calc-card"><div class="card-title">Multivariate</div><div class="card-body">Rainbow (broken 2022 by Ward Beullens), GeMSS, UOV. Mostly dead at NIST round 3-4. Tiny signatures, large public keys.</div></div>
</div>

<div class="calc-highlight"><strong>NIST 2024 lineup:</strong> ML-KEM (lattice KEM), ML-DSA (lattice signature), Falcon (lattice signature, NTRU-based), SLH-DSA (hash-based signature, conservative). All four official as of FIPS publication. Hybrid deployment required for the next decade.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Learning With Errors — The Lattice Problem</h2>
<p class="l-text">Oded Regev introduced LWE in 2005: given (A, b = A·s + e mod q) with secret vector s and small error e, recover s. As hard as worst-case lattice problems (GapSVP, SIVP). <strong>Module-LWE</strong> (Langlois-Stehlé 2015) lifts to vectors of polynomials, balancing the speed of Ring-LWE with the security flexibility of plain LWE — this is what ML-KEM and ML-DSA use.</p>

<div class="katex-block">$$\\mathbf{b} = \\mathbf{A} \\mathbf{s} + \\mathbf{e} \\pmod{q}, \\quad \\mathbf{e} \\text{ small}, \\quad \\text{recover } \\mathbf{s}.$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy LWE-based public-key encryption. Public key = (A, b = A·s + e). Encrypt 1 bit, decrypt, observe noise.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">7</span>)

n, m, q = <span class="num">32</span>, <span class="num">100</span>, <span class="num">521</span>         <span class="cm"># secret dim, samples, modulus</span>
sigma   = <span class="num">1.5</span>                  <span class="cm"># error stddev</span>

<span class="cm"># KeyGen</span>
s = np.random.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, n)             <span class="cm"># binary secret</span>
A = np.random.<span class="fn">randint</span>(<span class="num">0</span>, q, (m, n))
e = np.<span class="fn">round</span>(sigma * np.random.<span class="fn">randn</span>(m)).<span class="fn">astype</span>(<span class="fn">int</span>)
b = (A @ s + e) % q
pk = (A, b)
sk = s

<span class="kw">def</span> <span class="fn">encrypt</span>(pk, bit):
    A, b = pk
    r = np.random.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, A.shape[<span class="num">0</span>])    <span class="cm"># random subset</span>
    u = (r @ A) % q
    v = (r @ b + bit * (q // <span class="num">2</span>)) % q
    <span class="kw">return</span> u, <span class="fn">int</span>(v)

<span class="kw">def</span> <span class="fn">decrypt</span>(sk, u, v):
    val = (v - u @ sk) % q
    <span class="cm"># Round to nearest 0 or q/2</span>
    <span class="kw">return</span> <span class="num">0</span> <span class="kw">if</span> <span class="fn">min</span>(val, q - val) &lt; q // <span class="num">4</span> <span class="kw">else</span> <span class="num">1</span>

correct = <span class="num">0</span>
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    bit = np.random.<span class="fn">randint</span>(<span class="num">2</span>)
    u, v = <span class="fn">encrypt</span>(pk, bit)
    correct += <span class="fn">int</span>(<span class="fn">decrypt</span>(sk, u, v) == bit)

<span class="fn">print</span>(f<span class="str">'LWE encryption correct: {correct}/50  (errors come from noise sometimes overwhelming the threshold)'</span>)

<span class="cm"># An attacker without s sees (A, b) and (u, v).  The LWE assumption says</span>
<span class="cm"># distinguishing (A, b) from uniform random is computationally hard.</span>
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up LWE parameters <code>n=32</code> (secret dimension), <code>m=100</code> (samples), <code>q=521</code> (modulus), <code>σ=1.5</code> (Gaussian-rounded error stddev) — production ML-KEM-768 uses n=256·k for k=3 with q=3329, ~80x larger but the algebra is the same. 2) KeyGen draws binary secret <code>s ∈ {0,1}^n</code>, public matrix <code>A</code>, error vector <code>e ≈ N(0, σ)</code>, publishes <code>(A, b = A·s + e mod q)</code> — Regev 2005's Decision-LWE assumption says distinguishing this from uniform random over Z_q is computationally hard, equivalent to worst-case GapSVP on lattices. 3) <code>encrypt(pk, bit)</code> picks a random binary subset vector <code>r</code> and outputs <code>(u, v) = (r·A, r·b + bit·(q/2))</code> — the message bit is encoded by a <code>q/2 = 260</code> shift, exactly the Regev encoding every modern PQ-KEM generalizes. 4) <code>decrypt(sk, u, v)</code> computes <code>v − u·s = r·(A·s + e) + bit·(q/2) − r·A·s = r·e + bit·(q/2)</code>; rounding to nearest <code>{0, q/2}</code> recovers the bit as long as <code>|r·e| &lt; q/4</code> — the printed "correct: ~48/50" shows the occasional decryption failure that real ML-KEM eliminates by tuning σ and q for &lt;2^-128 failure probability.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ML-KEM (Kyber) — The KEM Standard</h2>
<p class="l-text">ML-KEM (FIPS 203) is the NIST-standardized Module-LWE key encapsulation mechanism. Three security levels:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ML-KEM-512</div><div class="card-body">Public key 800 B, ciphertext 768 B, ~AES-128 security. ~50 μs keygen on a modern x86. Default for high-throughput, low-bandwidth.</div></div>
<div class="calc-card"><div class="card-title">ML-KEM-768</div><div class="card-body">Public key 1184 B, ciphertext 1088 B, ~AES-192 security. The default Cloudflare / Google / Apple choose for hybrid TLS. Best balance.</div></div>
<div class="calc-card"><div class="card-title">ML-KEM-1024</div><div class="card-body">Public key 1568 B, ciphertext 1568 B, ~AES-256 security. NSA CNSA 2.0 mandates this for top-secret traffic.</div></div>
<div class="calc-card"><div class="card-title">Compared to X25519</div><div class="card-body">X25519: 32 B keys, 32 B shared secret, no PQ. ML-KEM-768: 1184 B / 1088 B / 32 B SS. ~30× larger handshake — measurable but acceptable.</div></div>
</div>

<p class="l-text">The hybrid TLS 1.3 negotiation X25519MLKEM768 (IETF Draft, deployed by Chrome and Cloudflare since 2024) sends both an X25519 and an ML-KEM-768 keyshare; the shared secret combines both. Even if ML-KEM is broken classically (unlikely but possible), the X25519 component still provides classical security. Even if a quantum computer breaks X25519, ML-KEM still gives PQ security.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. ML-DSA (Dilithium) and Falcon — Lattice Signatures</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ML-DSA-44 / 65 / 87</div><div class="card-body">Module-LWE signature. Sig size 2.4 / 3.3 / 4.6 KB. Public key 1.3 / 2.0 / 2.6 KB. Easy to implement constant-time. Default new signature.</div></div>
<div class="calc-card"><div class="card-title">Falcon-512 / 1024</div><div class="card-body">NTRU-based, much smaller signatures (0.7 / 1.3 KB) but harder to implement (needs floating-point Fourier sampling, vulnerable to side-channels in naive implementations).</div></div>
<div class="calc-card"><div class="card-title">When to pick which</div><div class="card-body">ML-DSA: default for new code. Easy implementation, integer-only. Falcon: when bandwidth is critical (DNSSEC, X.509 certs in size-constrained protocols), and you can use a vetted reference implementation.</div></div>
<div class="calc-card"><div class="card-title">Compared to Ed25519</div><div class="card-body">Ed25519: 32 B PK, 64 B sig. ML-DSA-65: 2 KB PK, 3.3 KB sig. ~50× larger; for X.509 certs, this matters at scale (CT log size, cert chain length).</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SLH-DSA (SPHINCS+) — The Conservative Hash-Based Backup</h2>
<p class="l-text">Hash-based signatures rely <em>only</em> on the security of the underlying hash function — no lattice assumption, no number theory. SLH-DSA / SPHINCS+ is a "stateless" hash-based scheme: signing does not require remembering which one-time keys have been used (unlike XMSS/LMS, which are stateful and dangerous to back up).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sig size</div><div class="card-body">7-50 KB depending on parameters. Worst case in the family but most conservative.</div></div>
<div class="calc-card"><div class="card-title">Speed</div><div class="card-body">~10-100 ms to sign on x86. Verify ~5-50 ms. Slower than ML-DSA by 10-100×.</div></div>
<div class="calc-card"><div class="card-title">When to use</div><div class="card-body">Long-lived signatures (root CA certs, software-update signing keys) where lattice cryptanalysis advances are a long-term risk and 50-year horizons demand the most conservative assumption.</div></div>
<div class="calc-card"><div class="card-title">XMSS / LMS</div><div class="card-body">Stateful versions, smaller signatures, but the signer must never reuse a one-time key — single backup-restore can break the whole key. Used by some firmware-signing pipelines (NIST SP 800-208).</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hybrid TLS 1.3 — The Migration Pattern</h2>
<p class="l-text">TLS 1.3 negotiation with PQ uses a hybrid keyshare. The Cloudflare deployment (October 2022) shipped X25519Kyber768Draft00 to ~10% of users; by mid-2024 it was the default for Chrome/Cloudflare with X25519MLKEM768. The combined shared secret is HKDF-Extract over the concatenation of both shared secrets.</p>

<div class="katex-block">$$\\text{ss}_{\\text{hybrid}} = \\text{HKDF-Extract}(\\text{salt}, \\;\\text{ss}_{\\text{X25519}} \\,\\|\\, \\text{ss}_{\\text{ML-KEM}})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — pyca/cryptography 43+ supports ML-KEM via OpenSSL 3.5+. Not yet in Pyodide.</span>
<span class="cm"># Local: pip install cryptography (with OpenSSL 3.5 build)</span>
<span class="kw">from</span> cryptography.hazmat.primitives.asymmetric <span class="kw">import</span> x25519
<span class="cm"># from cryptography.hazmat.primitives.asymmetric.kem import MLKEM768  # OpenSSL 3.5+</span>

<span class="cm"># Classical X25519 leg</span>
client_priv = x25519.X25519PrivateKey.<span class="fn">generate</span>()
server_priv = x25519.X25519PrivateKey.<span class="fn">generate</span>()
ss_classical = client_priv.<span class="fn">exchange</span>(server_priv.<span class="fn">public_key</span>())

<span class="cm"># PQ leg (pseudo-API)</span>
<span class="cm"># kem = MLKEM768.generate()</span>
<span class="cm"># pk_bytes = kem.public_bytes()</span>
<span class="cm"># ct, ss_pq_client = MLKEM768.encapsulate(pk_bytes)</span>
<span class="cm"># ss_pq_server     = kem.decapsulate(ct)</span>

<span class="cm"># Combine</span>
<span class="kw">import</span> hashlib, hmac
<span class="kw">def</span> <span class="fn">hkdf_extract</span>(salt, ikm):
    <span class="kw">return</span> hmac.<span class="fn">new</span>(salt, ikm, hashlib.sha256).<span class="fn">digest</span>()

<span class="cm"># ss_hybrid = hkdf_extract(b'\\x00'*32, ss_classical + ss_pq_client)</span>
<span class="fn">print</span>(<span class="str">'Hybrid handshake size: ~32 B (X25519 share) + ~1184 B (ML-KEM-768 PK)'</span>)
<span class="fn">print</span>(<span class="str">'That is roughly 30x classical, but still &lt; 1 MTU and well-tolerated.'</span>)
</code></pre>
</div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports <code>x25519</code> from pyca/cryptography for the classical leg — Curve25519 ECDH is what TLS 1.3 already negotiates today, and the hybrid pattern simply preserves it so a flaw in ML-KEM never weakens the channel below classical security. 2) Generates ephemeral X25519 keypairs on both ends and computes <code>ss_classical</code> via <code>exchange(server_pub)</code> — 32 bytes derived from the standard ECDH operation that browsers run on every HTTPS connection. 3) The commented-out <code>MLKEM768</code> block sketches the post-quantum leg: server publishes a 1184-byte public key, client runs <code>encapsulate(pk_bytes)</code> to get a 1088-byte ciphertext plus a 32-byte shared secret, server runs <code>decapsulate(ct)</code> to recover the same secret — this is exactly the X25519MLKEM768 hybrid that Chrome and Cloudflare default to since 2024. 4) <code>hkdf_extract(salt, ss_classical + ss_pq_client)</code> concatenates both 32-byte shared secrets and runs HMAC-SHA256 to bind them — the RFC 9180 / Cloudflare draft pattern that guarantees the combined key is at least as strong as the stronger of its two components, so a Shor attack on X25519 cannot weaken the channel as long as ML-KEM is unbroken.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Real Deployments — Cloudflare, Apple PQ3, Signal PQXDH</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cloudflare (2022-2024)</div><div class="card-body">First major CDN to ship hybrid TLS at scale. ~30% of Cloudflare traffic uses X25519MLKEM768 by mid-2024. Telemetry showed minimal latency impact (≤2 ms p50).</div></div>
<div class="calc-card"><div class="card-title">Apple iMessage PQ3 (Feb 2024)</div><div class="card-body">Triple-layer key agreement: Curve25519 + Kyber + a PQ-secure ratchet. Apple's whitepaper claims protection against harvest-now-decrypt-later for end-to-end iMessage. Industry first for a billion-device messaging app.</div></div>
<div class="calc-card"><div class="card-title">Signal PQXDH (Sep 2023)</div><div class="card-body">Signal's X3DH key-agreement gets a fourth Kyber768 leg. ~10 KB extra per pre-key bundle but tolerable. Signal libraries (libsignal-client) updated; users transparent.</div></div>
<div class="calc-card"><div class="card-title">SSH (OpenSSH 9.0+)</div><div class="card-body">Default key-exchange is sntrup761x25519 (NTRU Prime hybrid) since 2022. OpenSSH 9.9 (2024) adds mlkem768x25519. SSH session keys now PQ-protected by default.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Migration Plan — CNSA 2.0 and the 2027 Deadline</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inventory</div><div class="card-body">Catalog every place classical asymmetric crypto is used: TLS endpoints, code signing, S/MIME, PGP, SSH, VPN, hardware-token PKI, blockchain. The ones that protect data confidentiality past 2035 are the highest priority.</div></div>
<div class="calc-card"><div class="card-title">Hybrid first</div><div class="card-body">Deploy X25519+MLKEM768 alongside classical. Cost: ~1 KB extra per handshake. Benefit: defense in depth against both classical and PQ attacks.</div></div>
<div class="calc-card"><div class="card-title">CNSA 2.0 mandates</div><div class="card-body">U.S. NSA Commercial National Security Algorithm Suite 2.0 (Sep 2022): all new National Security Systems must use ML-KEM-1024 and ML-DSA-87 (and SHA-384 / AES-256) by 2027. Existing systems must migrate by 2030-2033.</div></div>
<div class="calc-card"><div class="card-title">Crypto agility</div><div class="card-body">Build software so the algorithm is configurable, not hard-coded. Future PQ standards will refine; you do not want a 5-year migration each time. Use TLS 1.3 + cipher-suite negotiation, X.509 + algorithm OID negotiation.</div></div>
</div>

<div class="calc-highlight"><strong>What to do this quarter:</strong> turn on hybrid TLS where your stack supports it (Cloudflare, AWS ACM 2024+, OpenSSL 3.5+, BoringSSL). Audit code-signing keys — those are the highest harvest-now-decrypt-later risk. Watch NIST 2025 round 4: HQC, BIKE, Classic McEliece for KEM diversity, SQIsign / Mayo for signature diversity.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">Post-Quantum Cryptography is no longer hypothetical. ML-KEM, ML-DSA, SLH-DSA, and Falcon are NIST-standardized as of August 2024. Hybrid TLS is shipping at Cloudflare, Apple, Google, Signal. The migration is a 5-10 year effort and the 2027 CNSA 2.0 deadline anchors government schedules. Keep an eye on cryptanalysis (no known break of any winner, but stay subscribed to <code>pqc-forum</code> for Kyber/Dilithium attacks).</p>

<p class="l-text">Lesson 9 turns to <strong>Cryptanalysis</strong> — the offensive side of the field. Differential cryptanalysis (Biham-Shamir 1991), linear cryptanalysis (Matsui 1993), algebraic attacks, related-key attacks, meet-in-the-middle. The DES → 3DES → AES timeline is the textbook story of how a cipher gets broken and what we replace it with.</p>
</div>`,
tr: `<p class="l-text"><strong>13 Ağustos 2024'te NIST FIPS 203, 204 ve 205'i yayımladı — ilk üç post-kuantum kriptografi standardı.</strong> ML-KEM (Module-Lattice tabanlı Anahtar Kapsülleme Mekanizması, eski adıyla Kyber), ML-DSA (Module-Lattice tabanlı Dijital İmza Algoritması, eski adıyla Dilithium) ve SLH-DSA (Durumsuz Hash Tabanlı İmza, eski adıyla SPHINCS+), 2016'da başlayan sekiz yıllık bir yarışmayı sonlandırdı. Dördüncü seçim olan Falcon FIPS 206 taslağı olarak yayımlandı. Sebebi: Shor'un 1994 algoritmasını çalıştıran yeterince büyük hata-toleranslı bir kuantum bilgisayar RSA, ECDSA, ECDH ve EdDSA'yı polinom zamanda kırar. Şimdi-topla-sonra-şifre-çöz tehdidi — bugün şifrelenmiş trafiği kaydet, 2035'te şifre çöz — kuantum tehdidi gerçekleşmeden <em>önce</em> taşımamız gerektiği anlamına gelir, sonra değil.</p>

<p class="l-text">Bu derste Shor'un tehdit modelini, yeni standartların altında yatan LWE / Module-LWE / NTRU kafes problemlerini, dört NIST kazananını (KEM için ML-KEM, imzalar için ML-DSA + Falcon + SLH-DSA) ve geçiş hikayesini yürüyoruz: hibrit TLS 1.3 (X25519+Kyber768), Cloudflare'in 2022 dağıtımı, Apple'ın iMessage PQ3'ü (2024), Signal'in PQXDH'si (2023). Geçiş tarihleriyle kapatıyoruz: NSA'nın CNSA 2.0'ı 2027'ye kadar yeni Ulusal Güvenlik Sistemleri için PQ'yu zorunlu kılar ve PCI / finansal düzenleyiciler takip ediyor.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Shor'un tehdidini ifade edin: hangi klasik primitifler ölür, hangileri hayatta kalır</li>
<li>Kafes / hash / kod / çok değişkenli / izogeni PQ ailelerini tanıyın</li>
<li>NIST 2024 standartlarını okuyun: ML-KEM, ML-DSA, SLH-DSA, Falcon</li>
<li>Hibrit TLS'yi (X25519+Kyber768) ve neden geçiş varsayılanı olduğunu anlayın</li>
<li>Kafes matematiğini hissetmek için bir oyuncak LWE şifrelemesi uygulayın</li>
<li>Bir PQ geçişi planlayın: envanter → hibrit → yalnızca-PQ (2027'ye kadar CNSA 2.0)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Shor ve Grover — Bir Kuantum Bilgisayar Neyi Kırar</h2>
<p class="l-text">İki kuantum algoritması tehdit modelini şekillendirir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shor 1994</div><div class="card-body">Polinom zamanlı tam sayı çarpanlarına ayırma ve ayrık logaritma. RSA, DSA, ECDSA, ECDH, EdDSA'yı kırar. RSA-2048'i çarpanlarına ayırmak için tahminen 4096-qubitli hata-toleranslı makine — şu anki en iyisi ~1000 gürültülü qubit (IBM Heron 2024). Muhtemelen 10-20 yıl uzakta; daha erken olabilir.</div></div>
<div class="calc-card"><div class="card-title">Grover 1996</div><div class="card-body">Yapısız aramada karekök hızlandırma. Simetrik anahtar gücünü yarılar: AES-128 → 64-bit eşdeğeri. Hafifletme: AES-256, SHA-384/SHA-512 kullanın. SHA-256 kuantum altında hâlâ 128-bit çakışma direnci verir.</div></div>
<div class="calc-card"><div class="card-title">Shor'dan kurtulanlar</div><div class="card-body">Simetrik: AES, ChaCha20, SHA-2, SHA-3, HMAC (büyütülmüş anahtar boyutlarıyla). Kafes tabanlı, hash tabanlı, kod tabanlı, çok değişkenli, izogeni problemleri — bunlar için bilinen verimli bir kuantum algoritması yok.</div></div>
<div class="calc-card"><div class="card-title">Şimdi-topla-sonra-şifre-çöz</div><div class="card-body">Bir saldırgan bugün şifrelenmiş trafiği kaydeder, ucuza saklar, kuantum mevcut olduğunda şifre çözer. ~2035'in ötesine kadar gizli kalması gereken veriler için (tıbbi kayıtlar, gizli iletişimler, uzun ömürlü sözleşmeler), şimdi taşıyın.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Beş PQ Ailesi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kafes tabanlı (kazananlar)</div><div class="card-body">LWE, Ring-LWE, Module-LWE, NTRU. ML-KEM, ML-DSA, Falcon, FrodoKEM. Hız, anahtar/imza boyutu, güvenliğin en iyi dengesi. Endüstri varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">Hash tabanlı</div><div class="card-body">Tek seferlik imzaların durumsuz veya durumlu ağacı. SLH-DSA / SPHINCS+, XMSS, LMS. Muhafazakâr — güvenlik yalnızca hash fonksiyonuna indirgenir. Büyük imzalar (~8 KB).</div></div>
<div class="calc-card"><div class="card-title">Kod tabanlı</div><div class="card-body">McEliece (1978!) — asla kırılmadı. Classic McEliece bir NIST 4. tür KEM finalisti. Devasa genel anahtarlar (~260 KB) ama küçücük şifreli metinler. BIKE, HQC'de kullanılır.</div></div>
<div class="calc-card"><div class="card-title">İzogeni tabanlı</div><div class="card-body">SIDH, SIKE — bir zamanlar küçük anahtarlar için umut vericiydi. SIKE, Temmuz 2022'de Castryck-Decru'nun klasik saldırısıyla öldürüldü. SQIsign (NIST 2024 4. tür imza finalisti) hayatta kalır ancak yavaştır.</div></div>
<div class="calc-card"><div class="card-title">Çok değişkenli</div><div class="card-body">Rainbow (2022'de Ward Beullens tarafından kırıldı), GeMSS, UOV. NIST 3-4. turda çoğunlukla ölü. Küçücük imzalar, büyük genel anahtarlar.</div></div>
</div>

<div class="calc-highlight"><strong>NIST 2024 dizilimi:</strong> ML-KEM (kafes KEM), ML-DSA (kafes imza), Falcon (kafes imza, NTRU tabanlı), SLH-DSA (hash tabanlı imza, muhafazakâr). Dördü de FIPS yayını itibarıyla resmi. Önümüzdeki on yıl için hibrit dağıtım gerekli.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Learning With Errors — Kafes Problemi</h2>
<p class="l-text">Oded Regev LWE'yi 2005'te tanıttı: gizli vektör s ve küçük hata e ile (A, b = A·s + e mod q) verildiğinde, s'yi kurtar. En kötü durum kafes problemleri (GapSVP, SIVP) kadar zor. <strong>Module-LWE</strong> (Langlois-Stehlé 2015), polinom vektörlerine yükselir, Ring-LWE'nin hızını düz LWE'nin güvenlik esnekliğiyle dengeler — ML-KEM ve ML-DSA bunu kullanır.</p>

<div class="katex-block">$$\\mathbf{b} = \\mathbf{A} \\mathbf{s} + \\mathbf{e} \\pmod{q}, \\quad \\mathbf{e} \\text{ small}, \\quad \\text{recover } \\mathbf{s}.$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak bir LWE tabanlı genel anahtar şifrelemesi. Genel anahtar = (A, b = A·s + e). 1 bit şifrele, çöz, gürültüyü gözle.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
np.random.<span class="fn">seed</span>(<span class="num">7</span>)

n, m, q = <span class="num">32</span>, <span class="num">100</span>, <span class="num">521</span>         <span class="cm"># gizli boyut, örnekler, modül</span>
sigma   = <span class="num">1.5</span>                  <span class="cm"># hata stddev</span>

<span class="cm"># KeyGen</span>
s = np.random.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, n)             <span class="cm"># ikili gizli</span>
A = np.random.<span class="fn">randint</span>(<span class="num">0</span>, q, (m, n))
e = np.<span class="fn">round</span>(sigma * np.random.<span class="fn">randn</span>(m)).<span class="fn">astype</span>(<span class="fn">int</span>)
b = (A @ s + e) % q
pk = (A, b)
sk = s

<span class="kw">def</span> <span class="fn">encrypt</span>(pk, bit):
    A, b = pk
    r = np.random.<span class="fn">randint</span>(<span class="num">0</span>, <span class="num">2</span>, A.shape[<span class="num">0</span>])    <span class="cm"># rastgele alt küme</span>
    u = (r @ A) % q
    v = (r @ b + bit * (q // <span class="num">2</span>)) % q
    <span class="kw">return</span> u, <span class="fn">int</span>(v)

<span class="kw">def</span> <span class="fn">decrypt</span>(sk, u, v):
    val = (v - u @ sk) % q
    <span class="cm"># En yakın 0 veya q/2'ye yuvarla</span>
    <span class="kw">return</span> <span class="num">0</span> <span class="kw">if</span> <span class="fn">min</span>(val, q - val) &lt; q // <span class="num">4</span> <span class="kw">else</span> <span class="num">1</span>

correct = <span class="num">0</span>
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">50</span>):
    bit = np.random.<span class="fn">randint</span>(<span class="num">2</span>)
    u, v = <span class="fn">encrypt</span>(pk, bit)
    correct += <span class="fn">int</span>(<span class="fn">decrypt</span>(sk, u, v) == bit)

<span class="fn">print</span>(f<span class="str">'LWE encryption correct: {correct}/50  (errors come from noise sometimes overwhelming the threshold)'</span>)

<span class="cm"># s'siz bir saldırgan (A, b) ve (u, v) görür.  LWE varsayımı, (A, b)'yi tekdüze</span>
<span class="cm"># rastgeleden ayırt etmenin hesaplamalı olarak zor olduğunu söyler.</span>
</code></pre></div>
<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) LWE parametrelerini <code>n=32</code> (gizli boyut), <code>m=100</code> (örnekler), <code>q=521</code> (modül), <code>σ=1.5</code> (Gauss-yuvarlanmış hata stddev) olarak kurar — üretim ML-KEM-768 k=3 için n=256·k'yi q=3329 ile kullanır, ~80x daha büyük ama cebir aynıdır. 2) KeyGen ikili gizli <code>s ∈ {0,1}^n</code>, genel matris <code>A</code>, hata vektörü <code>e ≈ N(0, σ)</code> çeker, <code>(A, b = A·s + e mod q)</code> yayınlar — Regev 2005'in Decision-LWE varsayımı bunu Z_q üzerinde düzgün rastgeleden ayırt etmenin hesaplamalı olarak zor olduğunu söyler, kafesler üzerinde worst-case GapSVP'ye denktir. 3) <code>encrypt(pk, bit)</code> rastgele ikili alt küme vektörü <code>r</code> seçer ve <code>(u, v) = (r·A, r·b + bit·(q/2))</code> çıkarır — mesaj biti <code>q/2 = 260</code> kayması ile kodlanır, her modern PQ-KEM'in genelleştirdiği Regev kodlaması. 4) <code>decrypt(sk, u, v)</code> <code>v − u·s = r·(A·s + e) + bit·(q/2) − r·A·s = r·e + bit·(q/2)</code> hesaplar; <code>{0, q/2}</code>'ye en yakın yuvarlama <code>|r·e| &lt; q/4</code> olduğu sürece biti geri kazanır — yazdırılan "correct: ~48/50" gerçek ML-KEM'in σ ve q'yu &lt;2^-128 başarısızlık olasılığı için ayarlayarak ortadan kaldırdığı zaman zaman şifre çözme başarısızlığını gösterir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. ML-KEM (Kyber) — KEM Standardı</h2>
<p class="l-text">ML-KEM (FIPS 203), NIST tarafından standartlaştırılan Module-LWE anahtar kapsülleme mekanizmasıdır. Üç güvenlik seviyesi:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ML-KEM-512</div><div class="card-body">Genel anahtar 800 B, şifreli metin 768 B, ~AES-128 güvenlik. Modern x86'da ~50 μs keygen. Yüksek verim, düşük bant genişliği için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">ML-KEM-768</div><div class="card-body">Genel anahtar 1184 B, şifreli metin 1088 B, ~AES-192 güvenlik. Cloudflare / Google / Apple'ın hibrit TLS için seçtiği varsayılan. En iyi denge.</div></div>
<div class="calc-card"><div class="card-title">ML-KEM-1024</div><div class="card-body">Genel anahtar 1568 B, şifreli metin 1568 B, ~AES-256 güvenlik. NSA CNSA 2.0 bunu top-secret trafik için zorunlu kılar.</div></div>
<div class="calc-card"><div class="card-title">X25519 ile karşılaştırıldığında</div><div class="card-body">X25519: 32 B anahtarlar, 32 B paylaşılan sır, PQ yok. ML-KEM-768: 1184 B / 1088 B / 32 B SS. ~30× daha büyük el sıkışma — ölçülebilir ama kabul edilebilir.</div></div>
</div>

<p class="l-text">Hibrit TLS 1.3 müzakeresi X25519MLKEM768 (IETF Taslak, Chrome ve Cloudflare tarafından 2024'ten beri dağıtılmış), hem bir X25519 hem de bir ML-KEM-768 anahtar paylaşımı gönderir; paylaşılan sır ikisini birleştirir. ML-KEM klasik olarak kırılsa bile (olası değil ama mümkün), X25519 bileşeni hâlâ klasik güvenlik sağlar. Bir kuantum bilgisayar X25519'u kırsa bile, ML-KEM hâlâ PQ güvenlik verir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. ML-DSA (Dilithium) ve Falcon — Kafes İmzaları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ML-DSA-44 / 65 / 87</div><div class="card-body">Module-LWE imzası. İmza boyutu 2.4 / 3.3 / 4.6 KB. Genel anahtar 1.3 / 2.0 / 2.6 KB. Sabit zamanlı uygulamak kolay. Yeni varsayılan imza.</div></div>
<div class="calc-card"><div class="card-title">Falcon-512 / 1024</div><div class="card-body">NTRU tabanlı, çok daha küçük imzalar (0.7 / 1.3 KB) ama uygulanması daha zor (kayan nokta Fourier örneklemesi gerektirir, naif uygulamalarda yan-kanallara karşı savunmasız).</div></div>
<div class="calc-card"><div class="card-title">Hangisini seçmek</div><div class="card-body">ML-DSA: yeni kod için varsayılan. Kolay uygulama, yalnızca tam sayı. Falcon: bant genişliği kritik olduğunda (DNSSEC, boyut kısıtlamalı protokollerde X.509 sertifikaları) ve incelenmiş bir referans uygulama kullanabildiğinizde.</div></div>
<div class="calc-card"><div class="card-title">Ed25519 ile karşılaştırıldığında</div><div class="card-body">Ed25519: 32 B PK, 64 B sığ. ML-DSA-65: 2 KB PK, 3.3 KB sığ. ~50× daha büyük; X.509 sertifikaları için bu ölçekte önemlidir (CT kayıt boyutu, sertifika zinciri uzunluğu).</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SLH-DSA (SPHINCS+) — Muhafazakâr Hash Tabanlı Yedek</h2>
<p class="l-text">Hash tabanlı imzalar <em>yalnızca</em> altta yatan hash fonksiyonunun güvenliğine güvenir — kafes varsayımı yok, sayı teorisi yok. SLH-DSA / SPHINCS+ "durumsuz" bir hash tabanlı şemadır: imzalama hangi tek seferlik anahtarların kullanıldığını hatırlamayı gerektirmez (XMSS/LMS'nin aksine, durumlu olan ve yedeklenmesi tehlikeli olan).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">İmza boyutu</div><div class="card-body">Parametrelere bağlı olarak 7-50 KB. Ailedeki en kötü durum ama en muhafazakâr.</div></div>
<div class="calc-card"><div class="card-title">Hız</div><div class="card-body">x86'da imzalamak ~10-100 ms. Doğrulama ~5-50 ms. ML-DSA'dan 10-100× yavaş.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kullanılır</div><div class="card-body">Kafes kriptanaliz ilerlemelerinin uzun vadeli risk olduğu ve 50 yıllık ufukların en muhafazakâr varsayımı talep ettiği uzun ömürlü imzalar (kök CA sertifikaları, yazılım-güncelleme imzalama anahtarları).</div></div>
<div class="calc-card"><div class="card-title">XMSS / LMS</div><div class="card-body">Durumlu sürümler, daha küçük imzalar, ancak imzalayan asla bir tek seferlik anahtarı yeniden kullanmamalı — tek bir yedek-geri yükleme tüm anahtarı kırabilir. Bazı firmware-imzalama boru hatları tarafından kullanılır (NIST SP 800-208).</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hibrit TLS 1.3 — Geçiş Deseni</h2>
<p class="l-text">PQ ile TLS 1.3 müzakeresi hibrit bir anahtar paylaşımı kullanır. Cloudflare dağıtımı (Ekim 2022), kullanıcıların ~%10'una X25519Kyber768Draft00 gönderdi; 2024 ortasına kadar Chrome/Cloudflare için X25519MLKEM768 ile varsayılandı. Birleşik paylaşılan sır, her iki paylaşılan sırrın birleştirilmesi üzerinde HKDF-Extract'tir.</p>

<div class="katex-block">$$\\text{ss}_{\\text{hybrid}} = \\text{HKDF-Extract}(\\text{salt}, \\;\\text{ss}_{\\text{X25519}} \\,\\|\\, \\text{ss}_{\\text{ML-KEM}})$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># DEMO — pyca/cryptography 43+ OpenSSL 3.5+ aracılığıyla ML-KEM destekler. Henüz Pyodide'de yok.</span>
<span class="cm"># Yerel: pip install cryptography (OpenSSL 3.5 derlemesiyle)</span>
<span class="kw">from</span> cryptography.hazmat.primitives.asymmetric <span class="kw">import</span> x25519
<span class="cm"># from cryptography.hazmat.primitives.asymmetric.kem import MLKEM768  # OpenSSL 3.5+</span>

<span class="cm"># Klasik X25519 bacağı</span>
client_priv = x25519.X25519PrivateKey.<span class="fn">generate</span>()
server_priv = x25519.X25519PrivateKey.<span class="fn">generate</span>()
ss_classical = client_priv.<span class="fn">exchange</span>(server_priv.<span class="fn">public_key</span>())

<span class="cm"># PQ bacağı (sözde-API)</span>
<span class="cm"># kem = MLKEM768.generate()</span>
<span class="cm"># pk_bytes = kem.public_bytes()</span>
<span class="cm"># ct, ss_pq_client = MLKEM768.encapsulate(pk_bytes)</span>
<span class="cm"># ss_pq_server     = kem.decapsulate(ct)</span>

<span class="cm"># Birleştir</span>
<span class="kw">import</span> hashlib, hmac
<span class="kw">def</span> <span class="fn">hkdf_extract</span>(salt, ikm):
    <span class="kw">return</span> hmac.<span class="fn">new</span>(salt, ikm, hashlib.sha256).<span class="fn">digest</span>()

<span class="cm"># ss_hybrid = hkdf_extract(b'\\x00'*32, ss_classical + ss_pq_client)</span>
<span class="fn">print</span>(<span class="str">'Hybrid handshake size: ~32 B (X25519 share) + ~1184 B (ML-KEM-768 PK)'</span>)
<span class="fn">print</span>(<span class="str">'That is roughly 30x classical, but still &lt; 1 MTU and well-tolerated.'</span>)
</code></pre>
</div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Klasik bacak için pyca/cryptography'den <code>x25519</code> import eder — Curve25519 ECDH TLS 1.3'ün bugün zaten müzakere ettiği şeydir, ve hibrit deseni onu korur, böylece ML-KEM'deki bir kusur kanalı asla klasik güvenliğin altına düşürmez. 2) Her iki uçta geçici X25519 anahtar çiftleri üretir ve <code>exchange(server_pub)</code> ile <code>ss_classical</code> hesaplar — her HTTPS bağlantısında tarayıcıların çalıştırdığı standart ECDH işleminden türetilen 32 byte. 3) Yorumlu <code>MLKEM768</code> bloğu post-kuantum bacağını çizer: sunucu 1184-byte public key yayınlar, istemci <code>encapsulate(pk_bytes)</code> ile 1088-byte ciphertext artı 32-byte shared secret alır, sunucu <code>decapsulate(ct)</code> ile aynı sırrı geri kazanır — bu tam olarak Chrome ve Cloudflare'in 2024'ten beri varsayılan kıldığı X25519MLKEM768 hibridi. 4) <code>hkdf_extract(salt, ss_classical + ss_pq_client)</code> her iki 32-byte shared secret'i birleştirir ve HMAC-SHA256 çalıştırarak onları bağlar — birleşik anahtarın iki bileşeninden güçlüsü kadar en az güçlü olduğunu garanti eden RFC 9180 / Cloudflare taslak deseni, böylece ML-KEM kırılmadığı sürece X25519'a Shor saldırısı kanalı zayıflatamaz.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gerçek Dağıtımlar — Cloudflare, Apple PQ3, Signal PQXDH</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cloudflare (2022-2024)</div><div class="card-body">Ölçekte hibrit TLS gönderen ilk büyük CDN. 2024 ortasına kadar Cloudflare trafiğinin ~%30'u X25519MLKEM768 kullanır. Telemetri minimal gecikme etkisi gösterdi (≤2 ms p50).</div></div>
<div class="calc-card"><div class="card-title">Apple iMessage PQ3 (Şub 2024)</div><div class="card-body">Üç katmanlı anahtar anlaşması: Curve25519 + Kyber + bir PQ-güvenli ratchet. Apple'ın teknik incelemesi uçtan uca iMessage için şimdi-topla-sonra-şifre-çöz'e karşı koruma iddia eder. Bir milyar cihazlı mesajlaşma uygulaması için endüstri ilk.</div></div>
<div class="calc-card"><div class="card-title">Signal PQXDH (Eyl 2023)</div><div class="card-body">Signal'in X3DH anahtar anlaşması dördüncü bir Kyber768 bacağı alır. Ön anahtar paketi başına ~10 KB ekstra ama tolere edilebilir. Signal kütüphaneleri (libsignal-client) güncellendi; kullanıcılar için şeffaf.</div></div>
<div class="calc-card"><div class="card-title">SSH (OpenSSH 9.0+)</div><div class="card-body">2022'den beri varsayılan anahtar değişimi sntrup761x25519 (NTRU Prime hibrit). OpenSSH 9.9 (2024) mlkem768x25519 ekler. SSH oturum anahtarları artık varsayılan olarak PQ-korumalı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Geçiş Planı — CNSA 2.0 ve 2027 Tarihi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Envanter</div><div class="card-body">Klasik asimetrik kriptonun kullanıldığı her yeri kataloglayın: TLS uç noktaları, kod imzalama, S/MIME, PGP, SSH, VPN, donanım-token PKI, blockchain. 2035'in ötesinde veri gizliliğini koruyanlar en yüksek önceliktir.</div></div>
<div class="calc-card"><div class="card-title">Önce hibrit</div><div class="card-body">Klasiğin yanında X25519+MLKEM768 dağıtın. Maliyet: el sıkışma başına ~1 KB ekstra. Fayda: hem klasik hem PQ saldırılarına karşı derinlemesine savunma.</div></div>
<div class="calc-card"><div class="card-title">CNSA 2.0 zorunlulukları</div><div class="card-body">ABD NSA Ticari Ulusal Güvenlik Algoritması Paketi 2.0 (Eyl 2022): tüm yeni Ulusal Güvenlik Sistemleri 2027'ye kadar ML-KEM-1024 ve ML-DSA-87 (ve SHA-384 / AES-256) kullanmalıdır. Mevcut sistemler 2030-2033'e kadar taşınmalıdır.</div></div>
<div class="calc-card"><div class="card-title">Kripto çevikliği</div><div class="card-body">Yazılımı algoritma yapılandırılabilir olacak şekilde inşa edin, sabit kodlanmış değil. Gelecekteki PQ standartları rafine edecek; her seferinde 5 yıllık bir geçiş istemezsiniz. TLS 1.3 + şifre paketi müzakeresi, X.509 + algoritma OID müzakeresi kullanın.</div></div>
</div>

<div class="calc-highlight"><strong>Bu çeyrekte ne yapmalı:</strong> yığınınız destekliyorsa hibrit TLS'yi açın (Cloudflare, AWS ACM 2024+, OpenSSL 3.5+, BoringSSL). Kod imzalama anahtarlarını denetleyin — bunlar en yüksek şimdi-topla-sonra-şifre-çöz riskidir. NIST 2025 4. turunu izleyin: KEM çeşitliliği için HQC, BIKE, Classic McEliece, imza çeşitliliği için SQIsign / Mayo.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">Post-Kuantum Kriptografi artık varsayımsal değil. ML-KEM, ML-DSA, SLH-DSA ve Falcon Ağustos 2024 itibarıyla NIST tarafından standartlaştırıldı. Hibrit TLS Cloudflare, Apple, Google, Signal'da gönderiliyor. Geçiş 5-10 yıllık bir çabadır ve 2027 CNSA 2.0 tarihi hükümet programlarını sabitler. Kriptanalize bir göz atın (kazananlardan herhangi birinin bilinen bir kırılması yok ama Kyber/Dilithium saldırıları için <code>pqc-forum</code>'a abone kalın).</p>

<p class="l-text">Ders 9 <strong>Kriptanaliz</strong>'e döner — alanın saldırgan tarafı. Diferansiyel kriptanaliz (Biham-Shamir 1991), doğrusal kriptanaliz (Matsui 1993), cebirsel saldırılar, ilişkili-anahtar saldırıları, ortada-buluşma. DES → 3DES → AES zaman çizelgesi, bir şifrenin nasıl kırıldığının ve onu neyle değiştirdiğimizin ders kitabı hikayesidir.</p>
</div>`
};
