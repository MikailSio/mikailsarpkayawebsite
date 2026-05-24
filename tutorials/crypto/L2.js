window.CRYPTO_L2 = {
en: `<p class="l-text"><strong>Asymmetric cryptography solved a problem so fundamental that for thousands of years no one believed it had a solution: how do two strangers agree on a shared secret over a wire someone is listening to?</strong> In November 1976 Whitfield Diffie and Martin Hellman published "New Directions in Cryptography" and described a key exchange that does exactly that. A year later Ron Rivest, Adi Shamir, and Leonard Adleman published RSA, an actual encryption-and-signature scheme based on the difficulty of factoring large integers. The internet's commercial layer (HTTPS, SSH, GPG, Signal) is built on top of these two ideas. Without them there is no e-commerce, no online banking, no end-to-end encrypted messaging.</p>

<p class="l-text">In this lesson we walk RSA from key generation to OAEP-padded encryption to PSS-padded signatures, then move to elliptic-curve cryptography (ECC) — the modern replacement that delivers the same security at a fraction of the key size. We will see why RSA-2048 ≈ 112-bit security is the floor for new deployments today, why P-256, secp256k1, X25519, and Ed25519 dominate new protocols, and why the Diffie-Hellman key agreement at the bottom of every TLS 1.3 handshake is now ECDH almost everywhere. By the end you will be able to read a TLS certificate, choose a curve, and not flinch when someone says "ephemeral key exchange".</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Generate an RSA key pair from primes p, q and verify n = p·q, d = e^{-1} mod φ(n)</li>
<li>Encrypt and decrypt with RSA, sign with RSA-PSS, and recognise textbook-RSA pitfalls</li>
<li>Apply OAEP padding and explain why "naive" RSA encryption is insecure</li>
<li>Read elliptic curve names: P-256, secp256k1, X25519, Ed25519 and pick the right one</li>
<li>Walk a Diffie-Hellman / ECDH exchange and compute the shared secret</li>
<li>Compare key-size equivalents: RSA-2048 ≈ ECC-224 ≈ AES-112 (~112-bit symmetric strength)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Diffie-Hellman Magic Trick (1976)</h2>
<p class="l-text">Pick a large prime p and a generator g of the multiplicative group mod p. Alice picks a private a, sends g^a mod p. Bob picks a private b, sends g^b mod p. Both compute (g^a)^b = (g^b)^a = g^{ab} mod p. The eavesdropper sees g, p, g^a, g^b — and recovering g^{ab} from these is the <strong>Computational Diffie-Hellman problem</strong>, conjectured to be as hard as the discrete log. For 3072-bit primes this is far out of reach of any classical computer.</p>

<div class="katex-block">$$\\text{shared} = (g^b)^a \\bmod p = (g^a)^b \\bmod p = g^{ab} \\bmod p$$</div>

<p class="l-text">Diffie-Hellman delivers a shared secret but does not authenticate either party. A man-in-the-middle can intercept and run two DH exchanges, one with each side. So in practice DH is paired with signatures (RSA-PSS, ECDSA, Ed25519) that authenticate the public values. The pattern "ephemeral DH for forward secrecy + long-term signature for authentication" is the heart of TLS 1.3 and Signal.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy DH over a small prime (p = 2^61 - 1, a Mersenne prime). Real systems use 3072-bit primes; the math is identical.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets

p = <span class="num">2</span>**<span class="num">61</span> - <span class="num">1</span>   <span class="cm"># Mersenne prime (toy size — real DH uses &gt;= 2048-bit primes)</span>
g = <span class="num">37</span>          <span class="cm"># a generator of (Z/pZ)*</span>

a = secrets.<span class="fn">randbelow</span>(p - <span class="num">2</span>) + <span class="num">1</span>   <span class="cm"># Alice private</span>
b = secrets.<span class="fn">randbelow</span>(p - <span class="num">2</span>) + <span class="num">1</span>   <span class="cm"># Bob   private</span>

A = <span class="fn">pow</span>(g, a, p)   <span class="cm"># Alice public</span>
B = <span class="fn">pow</span>(g, b, p)   <span class="cm"># Bob   public</span>

s_alice = <span class="fn">pow</span>(B, a, p)
s_bob   = <span class="fn">pow</span>(A, b, p)

<span class="fn">print</span>(<span class="str">'Alice shared :'</span>, s_alice)
<span class="fn">print</span>(<span class="str">'Bob   shared :'</span>, s_bob)
<span class="fn">print</span>(<span class="str">'match        :'</span>, s_alice == s_bob)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Picks the Mersenne prime <code>p = 2^61 − 1</code> and a small generator <code>g = 37</code> — a toy compared to real DH's 3072-bit safe primes but the modular-exponentiation algebra is identical. 2) <code>secrets.randbelow(p - 2) + 1</code> draws Alice's and Bob's private exponents from the CSPRNG (<code>secrets</code>, not <code>random</code>) — uniform in <code>[1, p-2]</code>, exactly the range RFC 3526 mandates for DH private keys. 3) <code>A = pow(g, a, p)</code> and <code>B = pow(g, b, p)</code> publish the public values; an eavesdropper sees <code>g, p, A, B</code> but must solve the Computational Diffie-Hellman problem to recover <code>g^{ab}</code> — conjectured equivalent in hardness to the discrete log. 4) Both sides compute <code>pow(peer_pub, my_priv, p)</code> and arrive at the same shared integer because of the commutativity <code>(g^a)^b = (g^b)^a</code>; in TLS 1.3 this shared value is run through HKDF to derive AES-GCM session keys, while in this demo we just print and assert the match.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. RSA — Key Generation From Two Primes</h2>
<p class="l-text">Rivest, Shamir, and Adleman published RSA in 1977 (technically Cocks at GCHQ had it in 1973 but kept it classified). The setup: pick two large primes p and q, compute n = p·q (the modulus) and φ(n) = (p-1)(q-1) (Euler totient). Choose a public exponent e coprime to φ(n) — almost always 65537 = 2^16 + 1 — and compute the private exponent d ≡ e^{-1} mod φ(n) via the extended Euclidean algorithm.</p>

<div class="katex-block">$$n = p \\cdot q, \\quad \\varphi(n) = (p-1)(q-1), \\quad d \\equiv e^{-1} \\pmod{\\varphi(n)}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RSA-2048</div><div class="card-body">2048-bit modulus. ~112-bit symmetric security. NIST minimum for new deployments through 2030. Already retired for ~all new ECC-capable protocols.</div></div>
<div class="calc-card"><div class="card-title">RSA-3072</div><div class="card-body">3072-bit modulus. ~128-bit security, NIST recommended through 2031–2040. Slow: ~150 ms to generate, ~5 ms per signature on commodity x86.</div></div>
<div class="calc-card"><div class="card-title">RSA-4096</div><div class="card-body">~140-bit security, used in PGP/GPG long-term keys. Generation can take several seconds. Signatures slow enough to be a real bottleneck on busy TLS servers.</div></div>
<div class="calc-card"><div class="card-title">e = 65537</div><div class="card-body">The almost-universal public exponent. Has only two 1-bits, so encryption/verification is fast (17 multiplications). e = 3 is also valid but historically caused trouble with low-exponent attacks under bad padding.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pure-Python RSA on tiny primes (~16 bits each). Encrypts a small integer, decrypts, verifies the round trip.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> math <span class="kw">import</span> gcd
<span class="kw">import</span> secrets

<span class="kw">def</span> <span class="fn">is_prime</span>(n):
    <span class="kw">if</span> n &lt; <span class="num">2</span>: <span class="kw">return</span> <span class="kw">False</span>
    <span class="kw">for</span> p <span class="kw">in</span> (<span class="num">2</span>,<span class="num">3</span>,<span class="num">5</span>,<span class="num">7</span>,<span class="num">11</span>,<span class="num">13</span>,<span class="num">17</span>,<span class="num">19</span>,<span class="num">23</span>,<span class="num">29</span>,<span class="num">31</span>):
        <span class="kw">if</span> n % p == <span class="num">0</span>: <span class="kw">return</span> n == p
    d, r = n-<span class="num">1</span>, <span class="num">0</span>
    <span class="kw">while</span> d % <span class="num">2</span> == <span class="num">0</span>: d //= <span class="num">2</span>; r += <span class="num">1</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
        a = secrets.<span class="fn">randbelow</span>(n-<span class="num">3</span>) + <span class="num">2</span>
        x = <span class="fn">pow</span>(a, d, n)
        <span class="kw">if</span> x <span class="kw">in</span> (<span class="num">1</span>, n-<span class="num">1</span>): <span class="kw">continue</span>
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(r-<span class="num">1</span>):
            x = <span class="fn">pow</span>(x, <span class="num">2</span>, n)
            <span class="kw">if</span> x == n-<span class="num">1</span>: <span class="kw">break</span>
        <span class="kw">else</span>: <span class="kw">return</span> <span class="kw">False</span>
    <span class="kw">return</span> <span class="kw">True</span>

<span class="kw">def</span> <span class="fn">rand_prime</span>(bits=<span class="num">16</span>):
    <span class="kw">while</span> <span class="kw">True</span>:
        c = secrets.<span class="fn">randbits</span>(bits) | (<span class="num">1</span> &lt;&lt; (bits-<span class="num">1</span>)) | <span class="num">1</span>
        <span class="kw">if</span> <span class="fn">is_prime</span>(c): <span class="kw">return</span> c

p, q = <span class="fn">rand_prime</span>(<span class="num">16</span>), <span class="fn">rand_prime</span>(<span class="num">16</span>)
<span class="kw">while</span> p == q: q = <span class="fn">rand_prime</span>(<span class="num">16</span>)

n   = p * q
phi = (p-<span class="num">1</span>) * (q-<span class="num">1</span>)
e   = <span class="num">65537</span>
d   = <span class="fn">pow</span>(e, -<span class="num">1</span>, phi)

m  = <span class="num">12345</span>
c  = <span class="fn">pow</span>(m, e, n)
m2 = <span class="fn">pow</span>(c, d, n)
<span class="fn">print</span>(f<span class="str">'n={n}  e={e}  d={d}'</span>)
<span class="fn">print</span>(f<span class="str">'plaintext  : {m}'</span>)
<span class="fn">print</span>(f<span class="str">'ciphertext : {c}'</span>)
<span class="fn">print</span>(f<span class="str">'decrypted  : {m2}   match={m==m2}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>is_prime</code> is the Miller-Rabin probabilistic primality test with 20 random bases — the exact algorithm used by OpenSSL when generating RSA primes; 20 rounds give &lt; 2^{-40} false-positive rate, well below the cosmic-ray bit-flip threshold. 2) <code>rand_prime(16)</code> repeatedly draws 16-bit candidates with the top bit set (<code>| (1 &lt;&lt; (bits-1))</code> guarantees full bit-length) and the bottom bit set (<code>| 1</code> guarantees odd) until Miller-Rabin accepts — real RSA-3072 generation does exactly this with 1536-bit half-keys, taking ~150 ms per prime. 3) <code>n = p*q</code> is the public modulus and <code>phi = (p-1)*(q-1)</code> is Euler's totient — the secret structure: anyone who can factor <code>n</code> recovers <code>phi</code> and inverts <code>e</code> to get <code>d</code>, which is why RSA security reduces exactly to integer factorization. 4) <code>e = 65537</code> is the universal public exponent (only two 1-bits → 17 multiplications for verification) and <code>d = pow(e, -1, phi)</code> uses Python 3.8's extended Euclidean built-in to compute the private exponent; the final <code>pow(m, e, n)</code> / <code>pow(c, d, n)</code> round-trip recovers <code>m=12345</code> exactly — proving the math but also why textbook RSA without OAEP padding is deterministic and trivially attackable.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Why Textbook RSA Is Broken — and What OAEP Fixes</h2>
<p class="l-text">"Textbook" RSA — encrypt by computing m^e mod n with no padding — has at least four critical weaknesses. First, it is <strong>deterministic</strong>: encrypting the same message twice produces the same ciphertext, so an attacker can build a dictionary. Second, it is <strong>malleable</strong>: c1 · c2 mod n decrypts to m1 · m2 mod n, which lets attackers manipulate plaintexts in known ways. Third, small messages with small e leak: if m^3 &lt; n, the ciphertext is just m^3 with no modular reduction, and the attacker takes a cube root. Fourth, low-exponent broadcast attacks (Håstad 1988) recover messages sent to multiple recipients with the same e.</p>

<p class="l-text">The fix is <strong>OAEP padding</strong> (Optimal Asymmetric Encryption Padding, Bellare-Rogaway 1994, standardized in PKCS#1 v2.0). OAEP injects randomness, mixes it with the message via two hash functions in a Feistel-like structure, and produces a padded plaintext that fills the entire RSA block. Encrypting twice gives different ciphertexts; malleability is destroyed; the construction is provably IND-CCA2 secure in the random oracle model.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Encryption: RSA-OAEP</div><div class="card-body">SHA-256 + MGF1. Random seed, masked message, masked seed. Output is a single big-integer that fills the n-bit block. Use it.</div></div>
<div class="calc-card"><div class="card-title">Signatures: RSA-PSS</div><div class="card-body">Probabilistic Signature Scheme (Bellare-Rogaway 1996). Random salt, hash mixing. Replaces older PKCS#1 v1.5 signatures (still allowed but no longer recommended for new protocols).</div></div>
<div class="calc-card"><div class="card-title">PKCS#1 v1.5</div><div class="card-body">Old padding. Vulnerable to Bleichenbacher's attack (1998) when the implementation distinguishes valid/invalid padding errors. ROBOT (2017) showed the attack still works against many TLS servers in 2017–2018. Avoid for encryption; only acceptable for signatures with strict implementations.</div></div>
<div class="calc-card"><div class="card-title">Hybrid encryption</div><div class="card-body">In practice nobody encrypts large data with RSA. Generate a random AES key, encrypt the data with AES-GCM, encrypt the AES key with RSA-OAEP. RSA only carries 32 bytes; AES carries the rest.</div></div>
</div>

<div class="calc-highlight"><strong>Bleichenbacher 1998:</strong> a padding-oracle attack against RSA-PKCS#1 v1.5. The attacker submits adaptive ciphertexts and learns whether the padding is valid (e.g. via different error responses or timing). About 1 million queries recover a single message. Variants (ROBOT, Marvin Attack 2023) are still finding new vulnerable servers — even decades after the original paper.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. RSA Signatures and the m^d mod n Symmetry</h2>
<p class="l-text">RSA signatures are encryption with the keys swapped. Sign by computing s = m^d mod n; verify by checking m = s^e mod n. The signer holds d (private), so only they can produce s; anyone with e and n can verify. In practice you sign the hash of the message, not the message itself — RSA's block size is fixed and you do not want to rely on the input size.</p>

<div class="katex-block">$$s = H(m)^d \\bmod n, \\qquad \\text{verify: } H(m) \\stackrel{?}{=} s^e \\bmod n$$</div>

<p class="l-text"><strong>Why PSS over PKCS#1 v1.5 signatures?</strong> PSS injects a random salt before hashing, breaking the determinism that made PKCS#1 v1.5 vulnerable to algebraic forgeries when the verifier was sloppy (Bleichenbacher's "BB'06" forgery against e=3). PSS is the only RSA signature scheme allowed in TLS 1.3.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Sign a hash digest with our toy RSA key, verify with the public exponent. The size is unrealistic but the algebra is the real one.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, secrets
<span class="kw">from</span> math <span class="kw">import</span> gcd

<span class="cm"># Reuse a small RSA key (you would normally use 2048+ bits)</span>
p, q = <span class="num">65537</span>, <span class="num">65539</span>   <span class="cm"># toy primes for fast browser demo</span>
n, phi = p*q, (p-<span class="num">1</span>)*(q-<span class="num">1</span>)
e = <span class="num">17</span>
d = <span class="fn">pow</span>(e, -<span class="num">1</span>, phi)

msg = b<span class="str">'transfer 100 USD to Alice'</span>
h   = <span class="fn">int</span>.<span class="fn">from_bytes</span>(hashlib.<span class="fn">sha256</span>(msg).<span class="fn">digest</span>()[:<span class="num">2</span>], <span class="str">'big'</span>) % n   <span class="cm"># truncate to fit n</span>

s = <span class="fn">pow</span>(h, d, n)               <span class="cm"># sign</span>
v = <span class="fn">pow</span>(s, e, n)               <span class="cm"># verify</span>
<span class="fn">print</span>(f<span class="str">'hash  : {h}'</span>)
<span class="fn">print</span>(f<span class="str">'sig   : {s}'</span>)
<span class="fn">print</span>(f<span class="str">'check : {v}   ok={v==h}'</span>)

<span class="cm"># Tampered message -&gt; verification fails</span>
msg2 = b<span class="str">'transfer 999 USD to Eve  '</span>
h2 = <span class="fn">int</span>.<span class="fn">from_bytes</span>(hashlib.<span class="fn">sha256</span>(msg2).<span class="fn">digest</span>()[:<span class="num">2</span>], <span class="str">'big'</span>) % n
<span class="fn">print</span>(f<span class="str">'tampered check ok={pow(s, e, n) == h2}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Reuses tiny primes <code>p=65537, q=65539</code> to build an RSA key — too small for any real security, but Python's bignum arithmetic makes the signing/verification identical to a 3072-bit production key. 2) <code>hashlib.sha256(msg).digest()[:2]</code> truncates the message hash to 2 bytes so it fits inside the tiny modulus <code>n = p*q</code>; in production with RSA-3072 you would use the full 32-byte SHA-256 digest plus PSS padding (RFC 8017) that fills the entire 384-byte block. 3) <code>s = pow(h, d, n)</code> is the signature operation — only the holder of <code>d</code> can produce it, demonstrating the asymmetric property: sign with private, verify with public; in production the absence of PSS salt would make this deterministic and exposed to Bleichenbacher's BB'06 forgery against <code>e=3</code>. 4) The verification <code>pow(s, e, n) == h</code> succeeds on the original message but the <code>msg2</code> tampered "Eve" version hashes to a different <code>h2</code>, so <code>pow(s, e, n) == h2</code> returns False — the printed output proves that flipping any byte of the signed message invalidates the signature, which is the universal property that makes RSA-PSS the only RSA signature allowed in TLS 1.3.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Elliptic Curves — Same Math, Smaller Numbers</h2>
<p class="l-text">An elliptic curve over a finite field F_p is the set of points (x, y) with y^2 = x^3 + ax + b mod p, plus a "point at infinity" that acts as the identity. Adding two points is a geometric operation (draw the chord, reflect across the x-axis) that can be expressed as field arithmetic. Multiplying a point by an integer k is repeated addition: kP = P + P + ... + P. The discrete-log problem on a curve is "given P and Q = kP, recover k" — and on well-chosen curves it is much harder per bit than the integer discrete log.</p>

<div class="katex-block">$$E: y^2 = x^3 + ax + b \\pmod{p}, \\qquad Q = kP$$</div>

<p class="l-text">The headline number: <strong>~256-bit ECC ≈ ~3072-bit RSA ≈ ~128-bit symmetric security</strong>. The curve we encrypt with is 12x smaller than the equivalent RSA modulus. That is why TLS 1.3 certificates have shrunk, why Bitcoin and Ethereum chose ECC over RSA, and why mobile devices (where every byte over the air costs energy) standardize on it.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">P-256 (secp256r1, NIST P-256)</div><div class="card-body">~128-bit security. The default curve in TLS 1.3. NIST FIPS 186-4. Slightly distrusted by some (NSA influence on the curve constants), but no public weakness. Universal hardware support.</div></div>
<div class="calc-card"><div class="card-title">P-384, P-521</div><div class="card-body">192-bit and 256-bit security. P-384 is in NSA Suite B for TOP SECRET. Slower than P-256; rarely needed unless a contract dictates.</div></div>
<div class="calc-card"><div class="card-title">secp256k1</div><div class="card-body">The Bitcoin/Ethereum curve. Slightly different parameters, no NIST involvement. ~128-bit security. Specialized libraries (libsecp256k1) make it the fastest 256-bit curve in software.</div></div>
<div class="calc-card"><div class="card-title">Curve25519 / X25519</div><div class="card-body">Bernstein 2005. Designed for misuse-resistance: no special points, no off-curve traps, simple constant-time implementation. The default in WireGuard, Signal, modern OpenSSH. ~128-bit security. ECDH on this curve = "X25519".</div></div>
<div class="calc-card"><div class="card-title">Ed25519</div><div class="card-body">Bernstein-Lange 2011. EdDSA signature on the twisted-Edwards form of Curve25519. Deterministic (no nonce reuse possible — fixes the disaster that killed the PS3 ECDSA key). The default for SSH keys, GitHub commits, JWT signing.</div></div>
<div class="calc-card"><div class="card-title">Ed448 / X448</div><div class="card-body">~224-bit security. The "next step up" when Ed25519 feels too small. Slower; rarely deployed.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ECDH — Elliptic Curve Diffie-Hellman</h2>
<p class="l-text">ECDH is the Diffie-Hellman protocol of section 1, lifted to an elliptic curve. Alice picks private a, sends A = aG. Bob picks private b, sends B = bG. Both compute aB = bA = abG. The eavesdropper sees G, A, B and must solve the elliptic-curve discrete-log problem to recover the shared point — infeasible on Curve25519. The shared point's x-coordinate is then run through HKDF to derive symmetric keys.</p>

<div class="katex-block">$$\\text{shared} = a \\cdot B = a \\cdot (b \\cdot G) = b \\cdot (a \\cdot G) = b \\cdot A$$</div>

<p class="l-text"><strong>X25519</strong> is ECDH on Curve25519, encoded as raw 32-byte private and public keys. Bernstein's design guarantees that any 32-byte sequence is a valid private key — there are no "out of range" or "off-curve" failure modes for an attacker to exploit. WireGuard's <code>noise_protocol</code> builds an entire VPN around X25519 + ChaCha20-Poly1305 in &lt;4000 lines of C.</p>

<div class="calc-highlight"><strong>Forward secrecy:</strong> using a fresh ephemeral ECDH keypair per session means past traffic stays safe even if the long-term private key is later compromised. TLS 1.3 mandates ephemeral ECDH; static-key TLS is gone. The cost is one extra X25519 keypair generation per session — ~20 μs.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. ECDSA, Ed25519, and the Sony Disaster</h2>
<p class="l-text">ECDSA signatures (FIPS 186-4) require a fresh random nonce k per signature. If you ever sign two different messages with the same k, anyone can recover your private key by solving a 2x2 linear system. In December 2010 the fail0verflow team at 27C3 announced exactly this: Sony's PlayStation 3 firmware signing used a fixed nonce, so all PS3 firmware signatures shared the same k. The team extracted Sony's master ECDSA private key in minutes. This bug is the textbook case for why <strong>Ed25519 derives k deterministically from the message and key</strong> — there is no random source to fail.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ECDSA</div><div class="card-body">FIPS-approved, used in TLS, Bitcoin, Ethereum (transactions). Requires per-signature randomness. Implementations should use RFC 6979 deterministic nonces to avoid the PS3 disaster.</div></div>
<div class="calc-card"><div class="card-title">Ed25519 / EdDSA</div><div class="card-body">Deterministic, fast (~50 μs per signature), no nonce. The default in SSH, age, libsodium. Pick this for anything new.</div></div>
<div class="calc-card"><div class="card-title">Schnorr (BIP-340)</div><div class="card-body">Even cleaner than ECDSA, with native multi-signature aggregation. Activated on Bitcoin in 2021 (Taproot). The basis of MuSig and FROST threshold signatures.</div></div>
<div class="calc-card"><div class="card-title">RSA-PSS</div><div class="card-body">Still in service for legacy PKI. ~10x slower verification than Ed25519, ~100x larger signatures. New code uses Ed25519.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Key-Size Equivalence Tables (NIST SP 800-57)</h2>
<p class="l-text">When you pick a security level, all the primitives must match. Mismatched levels are an audit-finding red flag.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">80-bit (legacy)</div><div class="card-body">RSA-1024, ECC-160, AES-80 (does not exist — AES-128 is floor). Deprecated since 2010. SHA-1 lives here. Do not use for anything new.</div></div>
<div class="calc-card"><div class="card-title">112-bit (legacy floor)</div><div class="card-body">RSA-2048, ECC-224, 3DES (deprecated 2023). NIST allows through ~2030 for new deployments. Most TLS in the wild still here.</div></div>
<div class="calc-card"><div class="card-title">128-bit (current standard)</div><div class="card-body">RSA-3072, ECC-256 (P-256, X25519, secp256k1), AES-128, SHA-256. The default for new code in 2026.</div></div>
<div class="calc-card"><div class="card-title">192-bit (high)</div><div class="card-body">RSA-7680, ECC-384 (P-384, Ed448-ish), AES-192, SHA-384. NSA Suite B TOP SECRET.</div></div>
<div class="calc-card"><div class="card-title">256-bit (paranoid)</div><div class="card-body">RSA-15360 (impractical), ECC-512 (P-521), AES-256, SHA-512. Used when "harvest now, decrypt later" is a realistic threat.</div></div>
<div class="calc-card"><div class="card-title">Post-quantum</div><div class="card-body">All of RSA and ECC fall to Shor's algorithm on a sufficiently large quantum computer. Lesson 8 covers ML-KEM (Kyber) and ML-DSA (Dilithium), the NIST 2024 PQ standards that replace them.</div></div>
</div>

<div class="calc-highlight"><strong>URV CRISES note:</strong> the lab around Domingo-Ferrer publishes regularly on key-size scaling for privacy-preserving statistical computation — when you encrypt millions of records and keep the keys for decades, the equivalence table determines whether a 2050 quantum adversary can replay the database. The conservative default is AES-256 + ML-KEM-1024 hybrid (lesson 8).</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Putting It Together — Hybrid Encryption in Practice</h2>
<p class="l-text">A real "encrypt this file with Alice's public key" operation is never just RSA. The standard recipe (NIST SP 800-56B, libsodium's <code>crypto_box</code>):</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Conceptual hybrid encryption — replace the toy primitives with</span>
<span class="cm"># real ones (cryptography library) in production.</span>
<span class="kw">import</span> os, hashlib, hmac

<span class="kw">def</span> <span class="fn">hkdf</span>(secret, info, length=<span class="num">32</span>):
    <span class="kw">return</span> hmac.<span class="fn">new</span>(b<span class="str">'salt'</span>, secret + info, hashlib.sha256).<span class="fn">digest</span>()[:length]

<span class="kw">def</span> <span class="fn">encrypt_hybrid</span>(recipient_pub, recipient_n, message):
    <span class="cm"># 1. Generate a fresh symmetric key</span>
    sym_key = os.<span class="fn">urandom</span>(<span class="num">32</span>)
    <span class="cm"># 2. Encrypt the message with AES-GCM (toy stand-in here: XOR + HMAC)</span>
    nonce = os.<span class="fn">urandom</span>(<span class="num">12</span>)
    ks = hashlib.<span class="fn">sha256</span>(sym_key + nonce).<span class="fn">digest</span>() * ((<span class="fn">len</span>(message) // <span class="num">32</span>) + <span class="num">1</span>)
    ct = <span class="fn">bytes</span>(m ^ k <span class="kw">for</span> m, k <span class="kw">in</span> <span class="fn">zip</span>(message, ks))
    tag = hmac.<span class="fn">new</span>(sym_key, nonce + ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]
    <span class="cm"># 3. Wrap the symmetric key with RSA-OAEP (toy: just modular pow)</span>
    k_int = <span class="fn">int</span>.<span class="fn">from_bytes</span>(sym_key, <span class="str">'big'</span>) % recipient_n
    wrapped = <span class="fn">pow</span>(k_int, recipient_pub, recipient_n)
    <span class="kw">return</span> wrapped, nonce, ct, tag

<span class="cm"># Tiny RSA key</span>
p, q = <span class="num">65537</span>, <span class="num">65539</span>
n = p * q
e = <span class="num">17</span>
wrapped, nonce, ct, tag = <span class="fn">encrypt_hybrid</span>(e, n, b<span class="str">'transfer 100 USD to Alice'</span>)
<span class="fn">print</span>(<span class="str">'wrapped key int :'</span>, wrapped)
<span class="fn">print</span>(<span class="str">'nonce hex       :'</span>, nonce.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'ct len          :'</span>, <span class="fn">len</span>(ct))
<span class="fn">print</span>(<span class="str">'tag hex         :'</span>, tag.<span class="fn">hex</span>())
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>os.urandom(32)</code> draws a fresh 256-bit AES key for this single message — this is the "ephemeral data encryption key" pattern: never reuse, never store; the long-term RSA key only protects this one-shot key, not the data. 2) The XOR-with-SHA-256 keystream stands in for AES-256-GCM's CTR pass and the HMAC-SHA-256 tag stands in for GMAC — together they give the AEAD contract (confidentiality + integrity in one call) the real libsodium <code>crypto_box</code> provides over X25519. 3) <code>k_int = int.from_bytes(sym_key, 'big') % recipient_n</code> packs the symmetric key as a big integer and <code>pow(k_int, recipient_pub, recipient_n)</code> performs raw RSA encryption — production code would wrap this in OAEP (PKCS#1 v2.0 / RFC 8017) to defeat Bleichenbacher's million-query padding-oracle attack from 1998 that still hits servers in 2023 (Marvin Attack). 4) The four returned values (<code>wrapped</code>, <code>nonce</code>, <code>ct</code>, <code>tag</code>) are exactly the on-wire format of every hybrid scheme — the RSA blob carries 32 bytes of key material, AES-GCM carries arbitrary-length payload, and the recipient decrypts <code>wrapped</code> with <code>pow(wrapped, d, n)</code> to recover <code>sym_key</code> before running AEAD-decrypt over <code>(nonce, ct, tag)</code>.</p>

<p class="l-text">Three primitives, three jobs: ephemeral random AES key for confidentiality, AEAD tag for integrity, RSA-OAEP (or ECIES with X25519 in modern code) for delivering the AES key. <strong>You almost never RSA-encrypt user data directly</strong> — the modulus is too small and the operation is too slow. RSA carries 32-byte keys; AES carries the rest.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">RSA gave us the first practical public-key crypto: key generation from primes, encryption with OAEP, signatures with PSS. Forty-nine years later it is being eased out of new protocols by elliptic curves, which deliver equivalent security at 1/12 the key size. The default 2026 stack is X25519 ECDH + Ed25519 signatures + AES-256-GCM (or ChaCha20-Poly1305) symmetric — and a hybrid PQ extension (ML-KEM) sitting alongside X25519 in TLS 1.3 from 2024 onward (lesson 8).</p>

<p class="l-text">Lesson 3 turns to hash functions and MACs — the integrity glue that makes signatures and AEADs work. Lesson 4 builds the PKI that distributes the public keys we generated here. By lesson 8 we will see exactly how Kyber and Dilithium replace the RSA and ECDSA primitives we just learned, when (not if) Shor's algorithm becomes a deployment concern.</p>
</div>`,
tr: `<p class="l-text"><strong>Asimetrik kriptografi öyle temel bir sorunu çözdü ki binlerce yıl boyunca kimse bir çözümü olduğuna inanmadı: birinin dinlediği bir tel üzerinden iki yabancı paylaşılan bir sır üzerinde nasıl anlaşır?</strong> Kasım 1976'da Whitfield Diffie ve Martin Hellman "New Directions in Cryptography"yi yayımladılar ve tam olarak bunu yapan bir anahtar değişimini tanımladılar. Bir yıl sonra Ron Rivest, Adi Shamir ve Leonard Adleman, büyük tam sayıları çarpanlarına ayırmanın zorluğuna dayanan gerçek bir şifreleme-ve-imza şeması olan RSA'yı yayımladı. İnternetin ticari katmanı (HTTPS, SSH, GPG, Signal) bu iki fikrin üzerine inşa edilmiştir. Onlarsız e-ticaret, çevrimiçi bankacılık veya uçtan uca şifreli mesajlaşma yoktur.</p>

<p class="l-text">Bu derste RSA'yı anahtar üretiminden OAEP-padded şifrelemeye, ardından PSS-padded imzalara yürüyoruz, sonra eliptik eğri kriptografisine (ECC) — anahtar boyutunun bir kısmında aynı güvenliği sunan modern alternatif — geçiyoruz. RSA-2048 ≈ 112-bit güvenliğin yeni dağıtımlar için bugünün tabanı olduğunu, P-256, secp256k1, X25519 ve Ed25519'un yeni protokollere neden hâkim olduğunu ve her TLS 1.3 el sıkışmasının altındaki Diffie-Hellman anahtar anlaşmasının artık neredeyse her yerde ECDH olduğunu göreceğiz. Sonunda bir TLS sertifikasını okuyabilecek, bir eğri seçebilecek ve birisi "ephemeral key exchange" dediğinde irkilmeyeceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>p, q asallarından bir RSA anahtar çifti üretin ve n = p·q, d = e^{-1} mod φ(n) doğrulayın</li>
<li>RSA ile şifreleyin ve şifre çözün, RSA-PSS ile imzalayın ve "ders kitabı RSA" tuzaklarını tanıyın</li>
<li>OAEP padding uygulayın ve "saf" RSA şifrelemesinin neden güvensiz olduğunu açıklayın</li>
<li>Eliptik eğri adlarını okuyun: P-256, secp256k1, X25519, Ed25519 ve doğrusunu seçin</li>
<li>Bir Diffie-Hellman / ECDH değişimini adımlayın ve paylaşılan sırrı hesaplayın</li>
<li>Anahtar boyutu eşdeğerlerini karşılaştırın: RSA-2048 ≈ ECC-224 ≈ AES-112 (~112-bit simetrik güç)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Diffie-Hellman Sihirbazlığı (1976)</h2>
<p class="l-text">Büyük bir asal p ve mod p çarpımsal grubunun bir g üretecini seçin. Alice özel bir a seçer, g^a mod p gönderir. Bob özel bir b seçer, g^b mod p gönderir. Her ikisi de (g^a)^b = (g^b)^a = g^{ab} mod p hesaplar. Dinleyici g, p, g^a, g^b görür — ve bunlardan g^{ab}'yi kurtarmak <strong>Hesaplamalı Diffie-Hellman problemidir</strong>; ayrık logaritma kadar zor olduğu varsayılır. 3072-bit asallar için bu, herhangi bir klasik bilgisayarın çok ötesindedir.</p>

<div class="katex-block">$$\\text{shared} = (g^b)^a \\bmod p = (g^a)^b \\bmod p = g^{ab} \\bmod p$$</div>

<p class="l-text">Diffie-Hellman paylaşılan bir sır verir ancak hiçbir tarafı doğrulamaz. Bir aradaki adam araya girip iki DH değişimi çalıştırabilir, her tarafla bir tane. Bu yüzden pratikte DH, genel değerleri doğrulayan imzalarla (RSA-PSS, ECDSA, Ed25519) eşleştirilir. "İleri gizlilik için ephemeral DH + kimlik doğrulama için uzun vadeli imza" deseni TLS 1.3 ve Signal'in kalbidir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük bir asal üzerinde oyuncak DH (p = 2^61 - 1, bir Mersenne asalı). Gerçek sistemler 3072-bit asallar kullanır; matematik aynıdır.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets

p = <span class="num">2</span>**<span class="num">61</span> - <span class="num">1</span>   <span class="cm"># Mersenne asalı (oyuncak boyut — gerçek DH &gt;= 2048-bit asallar kullanır)</span>
g = <span class="num">37</span>          <span class="cm"># (Z/pZ)*'nin bir üreteci</span>

a = secrets.<span class="fn">randbelow</span>(p - <span class="num">2</span>) + <span class="num">1</span>   <span class="cm"># Alice özel</span>
b = secrets.<span class="fn">randbelow</span>(p - <span class="num">2</span>) + <span class="num">1</span>   <span class="cm"># Bob   özel</span>

A = <span class="fn">pow</span>(g, a, p)   <span class="cm"># Alice genel</span>
B = <span class="fn">pow</span>(g, b, p)   <span class="cm"># Bob   genel</span>

s_alice = <span class="fn">pow</span>(B, a, p)
s_bob   = <span class="fn">pow</span>(A, b, p)

<span class="fn">print</span>(<span class="str">'Alice shared :'</span>, s_alice)
<span class="fn">print</span>(<span class="str">'Bob   shared :'</span>, s_bob)
<span class="fn">print</span>(<span class="str">'match        :'</span>, s_alice == s_bob)
</code></pre></div></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Mersenne asalı <code>p = 2^61 − 1</code> ve küçük üreteç <code>g = 37</code> seçer — gerçek DH'nin 3072-bit güvenli asallarına kıyasla oyuncak ama modüler üs alma cebiri özdeştir. 2) <code>secrets.randbelow(p - 2) + 1</code> Alice ve Bob'un özel üslerini CSPRNG'den (<code>secrets</code>, <code>random</code> değil) çeker — <code>[1, p-2]</code> aralığında düzgün, tam olarak RFC 3526'nın DH özel anahtarları için zorunlu kıldığı aralık. 3) <code>A = pow(g, a, p)</code> ve <code>B = pow(g, b, p)</code> genel değerleri yayınlar; dinleyici <code>g, p, A, B</code>'yi görür ama <code>g^{ab}</code>'yi geri kazanmak için Computational Diffie-Hellman problemini çözmek zorundadır — sertlik açısından discrete log'a denk varsayılır. 4) Her iki taraf <code>pow(peer_pub, my_priv, p)</code> hesaplar ve <code>(g^a)^b = (g^b)^a</code> değişme özelliği sayesinde aynı paylaşılan tamsayıya ulaşır; TLS 1.3'te bu paylaşılan değer HKDF'den geçirilerek AES-GCM oturum anahtarları türetilir, bu demo'da ise sadece yazdırılıp eşleşme doğrulanır.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. RSA — İki Asaldan Anahtar Üretimi</h2>
<p class="l-text">Rivest, Shamir ve Adleman RSA'yı 1977'de yayımladı (teknik olarak GCHQ'daki Cocks 1973'te elde etti ama gizli tuttu). Kurulum: iki büyük asal p ve q seçin, n = p·q (modül) ve φ(n) = (p-1)(q-1) (Euler totient) hesaplayın. φ(n) ile aralarında asal bir genel üs e seçin — neredeyse her zaman 65537 = 2^16 + 1 — ve genişletilmiş Öklid algoritması ile özel üs d ≡ e^{-1} mod φ(n) hesaplayın.</p>

<div class="katex-block">$$n = p \\cdot q, \\quad \\varphi(n) = (p-1)(q-1), \\quad d \\equiv e^{-1} \\pmod{\\varphi(n)}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">RSA-2048</div><div class="card-body">2048-bit modül. ~112-bit simetrik güvenlik. 2030'a kadar yeni dağıtımlar için NIST minimumu. ECC yeteneğine sahip neredeyse tüm yeni protokoller için zaten emekli edildi.</div></div>
<div class="calc-card"><div class="card-title">RSA-3072</div><div class="card-body">3072-bit modül. ~128-bit güvenlik, NIST 2031–2040 arası önerilir. Yavaş: ticari x86'da üretmek ~150 ms, imza başına ~5 ms.</div></div>
<div class="calc-card"><div class="card-title">RSA-4096</div><div class="card-body">~140-bit güvenlik, PGP/GPG uzun vadeli anahtarlarda kullanılır. Üretim birkaç saniye sürebilir. İmzalar yoğun TLS sunucularında gerçek bir darboğaz olacak kadar yavaş.</div></div>
<div class="calc-card"><div class="card-title">e = 65537</div><div class="card-body">Neredeyse evrensel genel üs. Yalnızca iki 1-biti vardır, bu nedenle şifreleme/doğrulama hızlıdır (17 çarpma). e = 3 de geçerlidir ancak tarihsel olarak kötü padding altında düşük üs saldırılarıyla sorun çıkardı.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük asallar üzerinde saf-Python RSA (~her biri 16 bit). Küçük bir tam sayıyı şifreler, çözer, gidiş-dönüşü doğrular.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> math <span class="kw">import</span> gcd
<span class="kw">import</span> secrets

<span class="kw">def</span> <span class="fn">is_prime</span>(n):
    <span class="kw">if</span> n &lt; <span class="num">2</span>: <span class="kw">return</span> <span class="kw">False</span>
    <span class="kw">for</span> p <span class="kw">in</span> (<span class="num">2</span>,<span class="num">3</span>,<span class="num">5</span>,<span class="num">7</span>,<span class="num">11</span>,<span class="num">13</span>,<span class="num">17</span>,<span class="num">19</span>,<span class="num">23</span>,<span class="num">29</span>,<span class="num">31</span>):
        <span class="kw">if</span> n % p == <span class="num">0</span>: <span class="kw">return</span> n == p
    d, r = n-<span class="num">1</span>, <span class="num">0</span>
    <span class="kw">while</span> d % <span class="num">2</span> == <span class="num">0</span>: d //= <span class="num">2</span>; r += <span class="num">1</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
        a = secrets.<span class="fn">randbelow</span>(n-<span class="num">3</span>) + <span class="num">2</span>
        x = <span class="fn">pow</span>(a, d, n)
        <span class="kw">if</span> x <span class="kw">in</span> (<span class="num">1</span>, n-<span class="num">1</span>): <span class="kw">continue</span>
        <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(r-<span class="num">1</span>):
            x = <span class="fn">pow</span>(x, <span class="num">2</span>, n)
            <span class="kw">if</span> x == n-<span class="num">1</span>: <span class="kw">break</span>
        <span class="kw">else</span>: <span class="kw">return</span> <span class="kw">False</span>
    <span class="kw">return</span> <span class="kw">True</span>

<span class="kw">def</span> <span class="fn">rand_prime</span>(bits=<span class="num">16</span>):
    <span class="kw">while</span> <span class="kw">True</span>:
        c = secrets.<span class="fn">randbits</span>(bits) | (<span class="num">1</span> &lt;&lt; (bits-<span class="num">1</span>)) | <span class="num">1</span>
        <span class="kw">if</span> <span class="fn">is_prime</span>(c): <span class="kw">return</span> c

p, q = <span class="fn">rand_prime</span>(<span class="num">16</span>), <span class="fn">rand_prime</span>(<span class="num">16</span>)
<span class="kw">while</span> p == q: q = <span class="fn">rand_prime</span>(<span class="num">16</span>)

n   = p * q
phi = (p-<span class="num">1</span>) * (q-<span class="num">1</span>)
e   = <span class="num">65537</span>
d   = <span class="fn">pow</span>(e, -<span class="num">1</span>, phi)

m  = <span class="num">12345</span>
c  = <span class="fn">pow</span>(m, e, n)
m2 = <span class="fn">pow</span>(c, d, n)
<span class="fn">print</span>(f<span class="str">'n={n}  e={e}  d={d}'</span>)
<span class="fn">print</span>(f<span class="str">'plaintext  : {m}'</span>)
<span class="fn">print</span>(f<span class="str">'ciphertext : {c}'</span>)
<span class="fn">print</span>(f<span class="str">'decrypted  : {m2}   match={m==m2}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>is_prime</code> 20 rastgele tabanla Miller-Rabin olasılıksal asallık testidir — OpenSSL'in RSA asallarını üretirken kullandığı tam algoritma; 20 tur &lt; 2^{-40} yanlış-pozitif oranı verir, kozmik-ışın bit-flip esiginin altında. 2) <code>rand_prime(16)</code> üst bit ayarlı (<code>| (1 &lt;&lt; (bits-1))</code> tam bit-uzunluğunu garanti eder) ve alt bit ayarlı (<code>| 1</code> tek olmayı garanti eder) 16-bit adaylari tekrar tekrar çeker, Miller-Rabin kabul edene kadar — gerçek RSA-3072 üretimi 1536-bit yarım-anahtarlarla aynısını yapar, asal başına ~150 ms alır. 3) <code>n = p*q</code> public modül, <code>phi = (p-1)*(q-1)</code> Euler totient'idir — gizli yapı: <code>n</code>'i faktorize edebilen herkes <code>phi</code>'yi geri kazanır ve <code>e</code>'yi ters çevirip <code>d</code>'yi alır, bu yüzden RSA güvenliği tam olarak tamsayı faktorizasyonuna indirgenir. 4) <code>e = 65537</code> evrensel public exponent (sadece iki 1-bit → verification için 17 çarpma) ve <code>d = pow(e, -1, phi)</code> private exponent'i hesaplamak için Python 3.8'in extended Euclidean built-in'ini kullanır; son <code>pow(m, e, n)</code> / <code>pow(c, d, n)</code> gidiş-dönüşü <code>m=12345</code>'i tam olarak geri kazanır — matematiği kanıtlar ama ayrıca OAEP padding olmadan textbook RSA'nın neden deterministik ve trivially saldırıya açık olduğunu da gösterir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Ders Kitabı RSA Neden Bozuk — ve OAEP Neyi Düzeltir</h2>
<p class="l-text">"Ders kitabı" RSA — padding'siz m^e mod n hesaplayarak şifreleme — en az dört kritik zayıflığa sahiptir. Birincisi, <strong>deterministiktir</strong>: aynı mesajı iki kez şifrelemek aynı şifreli metni üretir, böylece bir saldırgan sözlük inşa edebilir. İkincisi, <strong>esnektir</strong>: c1 · c2 mod n, m1 · m2 mod n'ye çözülür; bu da saldırganların düz metinleri bilinen şekillerde manipüle etmesine olanak tanır. Üçüncüsü, küçük e ile küçük mesajlar sızar: m^3 &lt; n ise, şifreli metin modüler indirgeme olmadan sadece m^3'tür ve saldırgan bir küp kökü alır. Dördüncüsü, düşük üslü yayın saldırıları (Håstad 1988) aynı e ile birden çok alıcıya gönderilen mesajları kurtarır.</p>

<p class="l-text">Düzeltme <strong>OAEP padding</strong>'idir (Optimal Asymmetric Encryption Padding, Bellare-Rogaway 1994, PKCS#1 v2.0'da standartlaştırıldı). OAEP rastgelelik enjekte eder, bunu Feistel benzeri bir yapıda iki hash fonksiyonu aracılığıyla mesajla karıştırır ve tüm RSA bloğunu dolduran padded bir düz metin üretir. İki kez şifreleme farklı şifreli metinler verir; esneklik yok edilir; yapı, rastgele oracle modelinde kanıtlanabilir şekilde IND-CCA2 güvenlidir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Şifreleme: RSA-OAEP</div><div class="card-body">SHA-256 + MGF1. Rastgele tohum, maskeli mesaj, maskeli tohum. Çıktı, n-bitlik bloğu dolduran tek bir büyük tam sayıdır. Bunu kullanın.</div></div>
<div class="calc-card"><div class="card-title">İmzalar: RSA-PSS</div><div class="card-body">Probabilistic Signature Scheme (Bellare-Rogaway 1996). Rastgele tuz, hash karıştırma. Eski PKCS#1 v1.5 imzalarının yerini alır (hâlâ izin verilir ancak yeni protokoller için artık önerilmez).</div></div>
<div class="calc-card"><div class="card-title">PKCS#1 v1.5</div><div class="card-body">Eski padding. Uygulama geçerli/geçersiz padding hatalarını ayırt ettiğinde Bleichenbacher'ın saldırısına (1998) karşı savunmasızdır. ROBOT (2017), saldırının 2017–2018'de birçok TLS sunucusuna karşı hâlâ çalıştığını gösterdi. Şifreleme için kaçının; yalnızca sıkı uygulamalarla imzalar için kabul edilebilir.</div></div>
<div class="calc-card"><div class="card-title">Hibrit şifreleme</div><div class="card-body">Pratikte hiç kimse büyük veriyi RSA ile şifrelemez. Rastgele bir AES anahtarı üretin, veriyi AES-GCM ile şifreleyin, AES anahtarını RSA-OAEP ile şifreleyin. RSA yalnızca 32 bayt taşır; AES geri kalanını taşır.</div></div>
</div>

<div class="calc-highlight"><strong>Bleichenbacher 1998:</strong> RSA-PKCS#1 v1.5'e karşı bir padding-oracle saldırısı. Saldırgan uyarlanabilir şifreli metinler gönderir ve padding'in geçerli olup olmadığını öğrenir (örneğin farklı hata yanıtları veya zamanlama yoluyla). Yaklaşık 1 milyon sorgu tek bir mesajı kurtarır. Varyantlar (ROBOT, Marvin Attack 2023), orijinal makaleden onlarca yıl sonra bile hâlâ yeni savunmasız sunucular buluyor.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. RSA İmzaları ve m^d mod n Simetrisi</h2>
<p class="l-text">RSA imzaları, anahtarları takas edilmiş şifrelemedir. s = m^d mod n hesaplayarak imzalayın; m = s^e mod n kontrol ederek doğrulayın. İmzalayan d'yi (özel) tutar, dolayısıyla yalnızca o s üretebilir; e ve n'ye sahip herkes doğrulayabilir. Pratikte mesajın kendisini değil, mesajın hash'ini imzalarsınız — RSA'nın blok boyutu sabittir ve girdi boyutuna güvenmek istemezsiniz.</p>

<div class="katex-block">$$s = H(m)^d \\bmod n, \\qquad \\text{verify: } H(m) \\stackrel{?}{=} s^e \\bmod n$$</div>

<p class="l-text"><strong>Neden PKCS#1 v1.5 imzaları yerine PSS?</strong> PSS hash'lemeden önce rastgele bir tuz enjekte eder; bu da, doğrulayıcı dikkatsiz olduğunda PKCS#1 v1.5'i cebirsel sahteleştirmelere açık hâle getiren determinizmi kırar (Bleichenbacher'ın e=3'e karşı "BB'06" sahteleştirmesi). PSS, TLS 1.3'te izin verilen tek RSA imza şemasıdır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak RSA anahtarımızla bir hash digest'ini imzalayın, genel üs ile doğrulayın. Boyut gerçekçi değil ama cebir gerçek olanı.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, secrets
<span class="kw">from</span> math <span class="kw">import</span> gcd

<span class="cm"># Küçük bir RSA anahtarını yeniden kullan (normalde 2048+ bit kullanırsınız)</span>
p, q = <span class="num">65537</span>, <span class="num">65539</span>   <span class="cm"># hızlı tarayıcı demosu için oyuncak asallar</span>
n, phi = p*q, (p-<span class="num">1</span>)*(q-<span class="num">1</span>)
e = <span class="num">17</span>
d = <span class="fn">pow</span>(e, -<span class="num">1</span>, phi)

msg = b<span class="str">'transfer 100 USD to Alice'</span>
h   = <span class="fn">int</span>.<span class="fn">from_bytes</span>(hashlib.<span class="fn">sha256</span>(msg).<span class="fn">digest</span>()[:<span class="num">2</span>], <span class="str">'big'</span>) % n   <span class="cm"># n'ye sığacak şekilde kısalt</span>

s = <span class="fn">pow</span>(h, d, n)               <span class="cm"># imzala</span>
v = <span class="fn">pow</span>(s, e, n)               <span class="cm"># doğrula</span>
<span class="fn">print</span>(f<span class="str">'hash  : {h}'</span>)
<span class="fn">print</span>(f<span class="str">'sig   : {s}'</span>)
<span class="fn">print</span>(f<span class="str">'check : {v}   ok={v==h}'</span>)

<span class="cm"># Kurcalanmış mesaj -&gt; doğrulama başarısız</span>
msg2 = b<span class="str">'transfer 999 USD to Eve  '</span>
h2 = <span class="fn">int</span>.<span class="fn">from_bytes</span>(hashlib.<span class="fn">sha256</span>(msg2).<span class="fn">digest</span>()[:<span class="num">2</span>], <span class="str">'big'</span>) % n
<span class="fn">print</span>(f<span class="str">'tampered check ok={pow(s, e, n) == h2}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Küçük asallari <code>p=65537, q=65539</code> yeniden kullanarak bir RSA anahtarı kurar — gerçek güvenlik için çok küçük ama Python'un bignum aritmetiği imza/doğrulamayı 3072-bit üretim anahtarıyla özdeş kılar. 2) <code>hashlib.sha256(msg).digest()[:2]</code> küçük modül <code>n = p*q</code>'ya sığacak şekilde mesaj hash'ini 2 byte'a kırpar; RSA-3072 ile üretimde tam 32-byte SHA-256 digest'i artı tüm 384-byte bloğu dolduran PSS padding (RFC 8017) kullanırdınız. 3) <code>s = pow(h, d, n)</code> imza işlemidir — yalnızca <code>d</code>'yi tutan onu üretebilir, asimetrik özelliği gösterir: private ile imzala, public ile doğrula; üretimde PSS tuzu olmaması bunu deterministik yapar ve <code>e=3</code>'e karşı Bleichenbacher'in BB'06 sahteciliğine maruz bırakırdı. 4) <code>pow(s, e, n) == h</code> doğrulaması orijinal mesajda başarılı olur ama <code>msg2</code> kurcalanmış "Eve" sürümü farklı bir <code>h2</code>'ye hash'lenir, böylece <code>pow(s, e, n) == h2</code> False döner — yazdırılan çıktı imzalı mesajın herhangi bir byte'inin çevrilmesinin imzayı geçersiz kıldığını kanıtlar, ki bu RSA-PSS'i TLS 1.3'te izin verilen tek RSA imzası yapan evrensel özelliktir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Eliptik Eğriler — Aynı Matematik, Daha Küçük Sayılar</h2>
<p class="l-text">F_p sonlu cismi üzerindeki bir eliptik eğri, y^2 = x^3 + ax + b mod p denklemini sağlayan (x, y) noktaları kümesidir, artı birim olarak hareket eden bir "sonsuz noktası". İki nokta eklemek, alan aritmetiği olarak ifade edilebilen geometrik bir işlemdir (kirişi çizin, x ekseni boyunca yansıtın). Bir noktayı k tam sayısı ile çarpmak tekrarlı eklemedir: kP = P + P + ... + P. Bir eğri üzerindeki ayrık-log problemi "P ve Q = kP verildiğinde, k'yı kurtar" — ve iyi seçilmiş eğrilerde bu, tam sayı ayrık logundan bit başına çok daha zordur.</p>

<div class="katex-block">$$E: y^2 = x^3 + ax + b \\pmod{p}, \\qquad Q = kP$$</div>

<p class="l-text">Manşet rakamı: <strong>~256-bit ECC ≈ ~3072-bit RSA ≈ ~128-bit simetrik güvenlik</strong>. Şifrelediğimiz eğri, eşdeğer RSA modülünden 12 kat daha küçüktür. TLS 1.3 sertifikalarının küçülmesinin, Bitcoin ve Ethereum'un RSA yerine ECC'yi seçmesinin ve mobil cihazların (havadan giden her bayt enerji maliyeti getirir) bunu standartlaştırmasının nedeni budur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">P-256 (secp256r1, NIST P-256)</div><div class="card-body">~128-bit güvenlik. TLS 1.3'teki varsayılan eğri. NIST FIPS 186-4. Bazıları tarafından hafifçe güvenilmez (eğri sabitleri üzerindeki NSA etkisi), ancak kamuya açık zayıflık yok. Evrensel donanım desteği.</div></div>
<div class="calc-card"><div class="card-title">P-384, P-521</div><div class="card-body">192-bit ve 256-bit güvenlik. P-384, TOP SECRET için NSA Suite B'dedir. P-256'dan yavaş; bir sözleşme zorlamadıkça nadiren gerekir.</div></div>
<div class="calc-card"><div class="card-title">secp256k1</div><div class="card-body">Bitcoin/Ethereum eğrisi. Biraz farklı parametreler, NIST katılımı yok. ~128-bit güvenlik. Özelleşmiş kütüphaneler (libsecp256k1) bunu yazılımdaki en hızlı 256-bit eğri yapar.</div></div>
<div class="calc-card"><div class="card-title">Curve25519 / X25519</div><div class="card-body">Bernstein 2005. Yanlış kullanıma karşı dirençli olarak tasarlandı: özel nokta yok, eğri-dışı tuzaklar yok, basit sabit zamanlı uygulama. WireGuard, Signal, modern OpenSSH'deki varsayılan. ~128-bit güvenlik. Bu eğri üzerindeki ECDH = "X25519".</div></div>
<div class="calc-card"><div class="card-title">Ed25519</div><div class="card-body">Bernstein-Lange 2011. Curve25519'un büküm-Edwards formundaki EdDSA imzası. Deterministik (nonce yeniden kullanımı imkânsız — PS3 ECDSA anahtarını öldüren felaketi düzeltir). SSH anahtarları, GitHub commit'leri, JWT imzalama için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">Ed448 / X448</div><div class="card-body">~224-bit güvenlik. Ed25519 çok küçük geldiğinde "bir sonraki adım". Daha yavaş; nadiren dağıtılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. ECDH — Eliptik Eğri Diffie-Hellman</h2>
<p class="l-text">ECDH, 1. bölümün Diffie-Hellman protokolünün eliptik eğriye yükseltilmiş hâlidir. Alice özel a seçer, A = aG gönderir. Bob özel b seçer, B = bG gönderir. Her ikisi de aB = bA = abG hesaplar. Dinleyici G, A, B görür ve paylaşılan noktayı kurtarmak için eliptik-eğri ayrık-log problemini çözmelidir — Curve25519'da imkânsızdır. Paylaşılan noktanın x-koordinatı, simetrik anahtarları türetmek için HKDF üzerinden geçirilir.</p>

<div class="katex-block">$$\\text{shared} = a \\cdot B = a \\cdot (b \\cdot G) = b \\cdot (a \\cdot G) = b \\cdot A$$</div>

<p class="l-text"><strong>X25519</strong>, ham 32-bayt özel ve genel anahtarlar olarak kodlanmış Curve25519 üzerinde ECDH'dir. Bernstein'in tasarımı, herhangi bir 32-bayt dizisinin geçerli bir özel anahtar olduğunu garanti eder — saldırganın istismar edebileceği "aralık dışı" veya "eğri dışı" başarısızlık modu yoktur. WireGuard'ın <code>noise_protocol</code>'u, &lt;4000 satır C içinde X25519 + ChaCha20-Poly1305 etrafında tüm bir VPN inşa eder.</p>

<div class="calc-highlight"><strong>İleri gizlilik:</strong> oturum başına yeni bir geçici ECDH anahtar çifti kullanmak, uzun vadeli özel anahtar daha sonra ele geçirilse bile geçmiş trafiğin güvende kalması anlamına gelir. TLS 1.3 geçici ECDH'yi zorunlu kılar; statik anahtarlı TLS bitti. Maliyet, oturum başına bir ekstra X25519 anahtar çifti üretmektir — ~20 μs.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. ECDSA, Ed25519 ve Sony Felaketi</h2>
<p class="l-text">ECDSA imzaları (FIPS 186-4) imza başına yeni bir rastgele nonce k gerektirir. Aynı k ile iki farklı mesaj imzalarsanız, herkes 2x2 doğrusal sistemi çözerek özel anahtarınızı kurtarabilir. Aralık 2010'da fail0verflow ekibi 27C3'te tam olarak bunu duyurdu: Sony'nin PlayStation 3 firmware imzalama işlemi sabit bir nonce kullanıyordu, dolayısıyla tüm PS3 firmware imzaları aynı k'yı paylaşıyordu. Ekip Sony'nin ana ECDSA özel anahtarını dakikalar içinde çıkardı. Bu hata, <strong>Ed25519'un k'yı mesaj ve anahtardan deterministik olarak türetmesinin</strong> ders kitabı örneğidir — başarısız olacak rastgele kaynak yoktur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ECDSA</div><div class="card-body">FIPS-onaylı, TLS, Bitcoin, Ethereum'da (işlemler) kullanılır. İmza başına rastgelelik gerektirir. Uygulamalar PS3 felaketinden kaçınmak için RFC 6979 deterministik nonce'ları kullanmalıdır.</div></div>
<div class="calc-card"><div class="card-title">Ed25519 / EdDSA</div><div class="card-body">Deterministik, hızlı (imza başına ~50 μs), nonce yok. SSH, age, libsodium'daki varsayılan. Yeni her şey için bunu seçin.</div></div>
<div class="calc-card"><div class="card-title">Schnorr (BIP-340)</div><div class="card-body">ECDSA'dan bile daha temiz, yerel çoklu imza toplaması ile. Bitcoin'de 2021'de etkinleştirildi (Taproot). MuSig ve FROST eşik imzalarının temeli.</div></div>
<div class="calc-card"><div class="card-title">RSA-PSS</div><div class="card-body">Eski PKI için hâlâ hizmette. Ed25519'dan ~10 kat yavaş doğrulama, ~100 kat daha büyük imzalar. Yeni kod Ed25519 kullanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Anahtar Boyutu Eşdeğerlik Tabloları (NIST SP 800-57)</h2>
<p class="l-text">Bir güvenlik düzeyi seçtiğinizde, tüm primitifler eşleşmelidir. Eşleşmeyen düzeyler bir denetim bulgusu kırmızı bayrağıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">80-bit (eski)</div><div class="card-body">RSA-1024, ECC-160, AES-80 (mevcut değil — AES-128 tabandır). 2010'dan beri kullanımdan kaldırıldı. SHA-1 burada yaşar. Yeni hiçbir şey için kullanmayın.</div></div>
<div class="calc-card"><div class="card-title">112-bit (eski taban)</div><div class="card-body">RSA-2048, ECC-224, 3DES (2023'te kullanımdan kaldırıldı). NIST yeni dağıtımlar için ~2030'a kadar izin verir. Vahşi doğadaki TLS'lerin çoğu hâlâ burada.</div></div>
<div class="calc-card"><div class="card-title">128-bit (mevcut standart)</div><div class="card-body">RSA-3072, ECC-256 (P-256, X25519, secp256k1), AES-128, SHA-256. 2026'da yeni kod için varsayılan.</div></div>
<div class="calc-card"><div class="card-title">192-bit (yüksek)</div><div class="card-body">RSA-7680, ECC-384 (P-384, Ed448-ish), AES-192, SHA-384. NSA Suite B TOP SECRET.</div></div>
<div class="calc-card"><div class="card-title">256-bit (paranoyak)</div><div class="card-body">RSA-15360 (pratik değil), ECC-512 (P-521), AES-256, SHA-512. "Şimdi topla, sonra şifre çöz" gerçekçi bir tehdit olduğunda kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Post-kuantum</div><div class="card-body">Yeterince büyük bir kuantum bilgisayarda RSA ve ECC'nin tümü Shor algoritmasına düşer. Ders 8, bunların yerini alan NIST 2024 PQ standartları olan ML-KEM (Kyber) ve ML-DSA (Dilithium)'u ele alır.</div></div>
</div>

<div class="calc-highlight"><strong>URV CRISES notu:</strong> Domingo-Ferrer çevresindeki laboratuvar, gizliliği koruyan istatistiksel hesaplama için anahtar boyutu ölçeklemesi üzerine düzenli olarak yayın yapar — milyonlarca kaydı şifreleyip anahtarları on yıllarca sakladığınızda, eşdeğerlik tablosu, 2050'deki bir kuantum düşmanın veritabanını yeniden oynatıp oynatamayacağını belirler. Muhafazakâr varsayılan AES-256 + ML-KEM-1024 hibrittir (ders 8).</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Bir Araya Getirmek — Pratikte Hibrit Şifreleme</h2>
<p class="l-text">"Bu dosyayı Alice'in genel anahtarıyla şifrele" işlemi gerçek hayatta asla sadece RSA değildir. Standart tarif (NIST SP 800-56B, libsodium'un <code>crypto_box</code>'u):</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Kavramsal hibrit şifreleme — üretimde oyuncak primitifleri</span>
<span class="cm"># gerçekleriyle (cryptography kütüphanesi) değiştirin.</span>
<span class="kw">import</span> os, hashlib, hmac

<span class="kw">def</span> <span class="fn">hkdf</span>(secret, info, length=<span class="num">32</span>):
    <span class="kw">return</span> hmac.<span class="fn">new</span>(b<span class="str">'salt'</span>, secret + info, hashlib.sha256).<span class="fn">digest</span>()[:length]

<span class="kw">def</span> <span class="fn">encrypt_hybrid</span>(recipient_pub, recipient_n, message):
    <span class="cm"># 1. Yeni bir simetrik anahtar üret</span>
    sym_key = os.<span class="fn">urandom</span>(<span class="num">32</span>)
    <span class="cm"># 2. Mesajı AES-GCM ile şifrele (burada oyuncak yedek: XOR + HMAC)</span>
    nonce = os.<span class="fn">urandom</span>(<span class="num">12</span>)
    ks = hashlib.<span class="fn">sha256</span>(sym_key + nonce).<span class="fn">digest</span>() * ((<span class="fn">len</span>(message) // <span class="num">32</span>) + <span class="num">1</span>)
    ct = <span class="fn">bytes</span>(m ^ k <span class="kw">for</span> m, k <span class="kw">in</span> <span class="fn">zip</span>(message, ks))
    tag = hmac.<span class="fn">new</span>(sym_key, nonce + ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]
    <span class="cm"># 3. Simetrik anahtarı RSA-OAEP ile sarmala (oyuncak: sadece modüler pow)</span>
    k_int = <span class="fn">int</span>.<span class="fn">from_bytes</span>(sym_key, <span class="str">'big'</span>) % recipient_n
    wrapped = <span class="fn">pow</span>(k_int, recipient_pub, recipient_n)
    <span class="kw">return</span> wrapped, nonce, ct, tag

<span class="cm"># Küçük RSA anahtarı</span>
p, q = <span class="num">65537</span>, <span class="num">65539</span>
n = p * q
e = <span class="num">17</span>
wrapped, nonce, ct, tag = <span class="fn">encrypt_hybrid</span>(e, n, b<span class="str">'transfer 100 USD to Alice'</span>)
<span class="fn">print</span>(<span class="str">'wrapped key int :'</span>, wrapped)
<span class="fn">print</span>(<span class="str">'nonce hex       :'</span>, nonce.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'ct len          :'</span>, <span class="fn">len</span>(ct))
<span class="fn">print</span>(<span class="str">'tag hex         :'</span>, tag.<span class="fn">hex</span>())
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>os.urandom(32)</code> bu tek mesaj için taze bir 256-bit AES anahtarı çeker — bu "ephemeral data encryption key" desenidir: asla yeniden kullanma, asla sakla; uzun ömürlü RSA anahtarı yalnızca bu tek seferlik anahtarı korur, veriyi değil. 2) SHA-256 keystream'i ile XOR AES-256-GCM'in CTR geçişi yerine ve HMAC-SHA-256 etiketi GMAC yerine geçer — birlikte AEAD kontratını (tek çağrıda gizlilik + bütünlük) verir; gerçek libsodium <code>crypto_box</code> bunu X25519 üzerinden sağlar. 3) <code>k_int = int.from_bytes(sym_key, 'big') % recipient_n</code> simetrik anahtarı büyük tamsayı olarak paketler ve <code>pow(k_int, recipient_pub, recipient_n)</code> ham RSA şifreleme yapar — üretim kodu bunu OAEP'e (PKCS#1 v2.0 / RFC 8017) sararak 1998'den kalma Bleichenbacher'in milyon-sorgu padding-oracle saldırısını yenmiş olurdu, ki bu saldırı 2023'te (Marvin Attack) hâlâ sunuculara isabet ediyor. 4) Dönen dört değer (<code>wrapped</code>, <code>nonce</code>, <code>ct</code>, <code>tag</code>) her hybrid şemanın tel üzerindeki tam formatıdır — RSA blob'u 32 byte anahtar materyali taşır, AES-GCM keyfi uzunlukta payload taşır, ve alıcı <code>wrapped</code>'i <code>pow(wrapped, d, n)</code> ile çözer <code>sym_key</code>'i geri almak için, sonra <code>(nonce, ct, tag)</code> üzerinde AEAD-decrypt çalıştırır.</p>

<p class="l-text">Üç primitif, üç iş: gizlilik için geçici rastgele AES anahtarı, bütünlük için AEAD etiketi, AES anahtarını teslim etmek için RSA-OAEP (veya modern kodda X25519 ile ECIES). <strong>Kullanıcı verisini neredeyse hiçbir zaman doğrudan RSA-şifrelemezsiniz</strong> — modül çok küçük ve işlem çok yavaştır. RSA 32-bayt anahtarlar taşır; AES geri kalanını taşır.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">RSA bize ilk pratik açık anahtar kriptosunu verdi: asallardan anahtar üretimi, OAEP ile şifreleme, PSS ile imzalar. Kırk dokuz yıl sonra, eşdeğer güvenliği anahtar boyutunun 1/12'sinde sunan eliptik eğriler tarafından yeni protokollerden çıkarılıyor. Varsayılan 2026 yığını X25519 ECDH + Ed25519 imzaları + AES-256-GCM (veya ChaCha20-Poly1305) simetriktir — ve 2024'ten itibaren TLS 1.3'te X25519'un yanında oturan hibrit bir PQ uzantısı (ML-KEM) (ders 8).</p>

<p class="l-text">Ders 3 hash fonksiyonlarına ve MAC'lere dönüyor — imzaları ve AEAD'leri çalıştıran bütünlük tutkalı. Ders 4 burada ürettiğimiz açık anahtarları dağıtan PKI'yı inşa ediyor. Ders 8'de Kyber ve Dilithium'un az önce öğrendiğimiz RSA ve ECDSA primitiflerinin yerini tam olarak nasıl aldığını, Shor algoritması bir dağıtım endişesi olduğunda (olursa değil), göreceğiz.</p>
</div>`
};
