window.CRYPTO_L3 = {
en: `<p class="l-text"><strong>Hash functions are the silent infrastructure under every signature, every certificate, every blockchain block, every Git commit, every password store on Earth.</strong> A cryptographic hash takes an arbitrary input and returns a fixed-size pseudo-random string. The properties we demand of it — preimage resistance, second-preimage resistance, collision resistance — sound abstract, but failures of any of them have real-world consequences: SHA-1 collisions broke certificate authorities (SHAttered 2017, Chosen-Prefix 2020), MD5 collisions enabled the Flame malware to forge a Microsoft code-signing certificate (2012), and weak password hashes leak users by the billion every year.</p>

<p class="l-text">In this lesson we walk SHA-256 and SHA-3 (Keccak), explain why BLAKE3 is now the speed champion, build HMAC from a hash and demonstrate the length-extension attack that motivates HMAC's design, then cover password hashing — the corner of cryptography where speed is the enemy and Argon2id, bcrypt, and scrypt deliberately burn CPU cycles to slow attackers down. We close with Merkle trees, the data structure that turns hashes into integrity proofs for blockchains, Certificate Transparency logs, and Git's content-addressed storage.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the three hash properties (preimage, 2nd preimage, collision) and the birthday bound</li>
<li>Pick a hash: SHA-256 (default), SHA-3 (sponge, length-ext-safe), BLAKE3 (parallel speed)</li>
<li>Build HMAC from a hash and explain why H(key || message) is unsafe (length extension)</li>
<li>Choose a password hash — Argon2id is the default; bcrypt and scrypt are runners-up</li>
<li>Construct a Merkle tree, generate inclusion proofs of size O(log n)</li>
<li>Quantify SHA-1's death: 2^63 work for chosen-prefix collisions in 2020 — a $50k cluster job</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Three Properties — Preimage, 2nd Preimage, Collision</h2>
<p class="l-text">A cryptographic hash function H: {0,1}* → {0,1}^n must satisfy three properties:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Preimage resistance</div><div class="card-body">Given y, infeasible to find any x with H(x) = y. Cost ~2^n. For SHA-256 this is 2^256 — out of physical reach forever.</div></div>
<div class="calc-card"><div class="card-title">2nd-preimage resistance</div><div class="card-body">Given x, infeasible to find x' ≠ x with H(x') = H(x). Same ~2^n cost. Protects signature schemes: an attacker cannot find a second message that hashes to the same digest as a signed message.</div></div>
<div class="calc-card"><div class="card-title">Collision resistance</div><div class="card-body">Infeasible to find any pair (x, x') with H(x) = H(x'). Birthday bound: ~2^{n/2}. SHA-256 → 2^128 work, infeasible. SHA-1 → 2^80 was once safe; in 2017 Google's SHAttered attack found a collision in 2^63.1 GPU-hours — about $110k of cloud time.</div></div>
<div class="calc-card"><div class="card-title">Random oracle</div><div class="card-body">An idealized hash that outputs a uniform random value for every new input. Real hashes approximate this; security proofs of OAEP, PSS, Fiat-Shamir all assume the random-oracle model.</div></div>
</div>

<div class="katex-block">$$\\text{Pr}[\\text{collision in } q \\text{ queries}] \\approx \\frac{q^2}{2^{n+1}} \\quad \\Rightarrow \\quad q \\approx 2^{n/2} \\text{ for } 50\\%$$</div>

<p class="l-text">The birthday bound — collision-finding takes ~2^{n/2} hash evaluations — is why a 256-bit hash gives "128-bit security" against collisions, even though it gives 256-bit security against preimage. SHA-1 (160-bit) was theoretically 80-bit collision-resistant; that level fell to GPUs by 2017. SHA-256 (256-bit, 128-bit collision-resistant) is comfortably out of reach.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The SHA-2 Family — Merkle-Damgård, Davies-Meyer, and Why It Works</h2>
<p class="l-text">SHA-256 (NIST FIPS 180-4, 2002) is the workhorse hash of the modern internet. It takes a message, pads it to a multiple of 512 bits, and processes each 512-bit block through a compression function built from 64 rounds of XOR, ADD, ROT, AND, OR, NOT. The compression function follows the Davies-Meyer construction (use a block cipher in feed-forward mode), and the iteration follows Merkle-Damgård (chain block-by-block with the running digest as the IV for the next block).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SHA-256</div><div class="card-body">256-bit output, 512-bit block, 64 rounds. ~700 MB/s on a modern CPU without hardware acceleration, ~3 GB/s with Intel SHA Extensions (Goldmont 2016+, Tiger Lake 2020+). The default for almost everything: TLS, JWT, Bitcoin, Git after 2026.</div></div>
<div class="calc-card"><div class="card-title">SHA-512</div><div class="card-body">512-bit output, 1024-bit block, 80 rounds. Faster than SHA-256 on 64-bit CPUs without SHA-NI (operates on 64-bit words natively). Used in Argon2 internals.</div></div>
<div class="calc-card"><div class="card-title">SHA-224 / SHA-384</div><div class="card-body">Truncated SHA-256 / SHA-512. Used when the higher-security variant is needed but the output must match a specific size constraint. Rare in practice.</div></div>
<div class="calc-card"><div class="card-title">SHA-1 (DEAD)</div><div class="card-body">160-bit output, deprecated 2011, broken 2017 (SHAttered, Stevens et al.), chosen-prefix collisions in 2020 (Leurent-Peyrin). Still appears in legacy CDNs, ancient Git repos. Migrate everything that touches it.</div></div>
<div class="calc-card"><div class="card-title">MD5 (REALLY DEAD)</div><div class="card-body">128-bit output. Collisions found in 2004 (Wang-Yu), chosen-prefix in 2008 (Stevens-Lenstra-de Weger), deployed in real attacks in 2012 (Flame malware forged a Microsoft Terminal Server Licensing certificate). Use only as a non-security checksum.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Python's <code>hashlib</code> ships with SHA-256 and is available in Pyodide. We hash a few inputs and watch the avalanche effect — flipping one bit changes ~half the output bits.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

m1 = b<span class="str">'attack at dawn'</span>
m2 = b<span class="str">'attack at dusk'</span>   <span class="cm"># one byte different (n vs s, lowercase distance 5)</span>
m3 = b<span class="str">'attack at dawn '</span>  <span class="cm"># one trailing space added</span>

<span class="kw">for</span> m <span class="kw">in</span> (m1, m2, m3):
    <span class="fn">print</span>(f<span class="str">'{m!r:30s} -&gt; {hashlib.sha256(m).hexdigest()}'</span>)

<span class="cm"># Avalanche: count differing bits between m1 and m2 digests</span>
h1 = hashlib.<span class="fn">sha256</span>(m1).<span class="fn">digest</span>()
h2 = hashlib.<span class="fn">sha256</span>(m2).<span class="fn">digest</span>()
diff = <span class="fn">sum</span>(<span class="fn">bin</span>(a ^ b).<span class="fn">count</span>(<span class="str">'1'</span>) <span class="kw">for</span> a, b <span class="kw">in</span> <span class="fn">zip</span>(h1, h2))
<span class="fn">print</span>(f<span class="str">'\\nbits differing between m1 and m2 digests: {diff} / 256 (~half expected)'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines three near-identical inputs — <code>m1</code>, <code>m2</code> (one letter flipped: "dawn"→"dusk"), and <code>m3</code> (one trailing space) — to drive the avalanche test that proves cryptographic hashes are not interpolative. 2) Loops through each input and prints <code>hashlib.sha256(m).hexdigest()</code>; <code>hashlib</code> ships in Pyodide and Python's stdlib uses OpenSSL's SHA-256 implementation under the hood (Intel SHA-NI accelerated since CPython 3.11 on capable CPUs). 3) <code>h1 ^ h2</code> byte-by-byte XORs the two 32-byte digests and <code>bin(...).count('1')</code> counts the set bits — the Hamming distance between two SHA-256 outputs. 4) The printout shows roughly 128/256 differing bits — the defining "avalanche" / "strict avalanche criterion" property of a good hash: a single-bit input change flips each output bit independently with probability ~1/2, which is exactly what makes SHA-256 indistinguishable from a random oracle for OAEP, PSS, and Fiat-Shamir security proofs.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SHA-3 / Keccak — A Sponge, Not a Merkle-Damgård</h2>
<p class="l-text">In 2007 NIST opened a competition for SHA-3, motivated by the SHA-1 weaknesses and a desire for a structurally different hash that would not share SHA-2's design lineage. Five finalists, and in 2012 NIST chose Keccak by Bertoni-Daemen-Peeters-Van Assche (the same Daemen who co-designed AES). Keccak's structure is a <strong>sponge construction</strong>: absorb input by XORing into the state and applying a permutation, then squeeze output by reading state and re-permuting. There is no message-block-by-message-block compression chain.</p>

<p class="l-text">The sponge structure has one deeply pleasant property: <strong>SHA-3 is immune to length-extension attacks</strong> (section 4) by construction, because the state is larger than the output and only part of it ever leaves the sponge. SHA-2's Merkle-Damgård chain leaks the entire internal state with the output, which is exactly what makes length-extension possible.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SHA3-256 / SHA3-512</div><div class="card-body">Drop-in replacements for SHA-256 / SHA-512. Slower than SHA-2 in pure software (~30%) but faster in hardware. Required by some EU and US standards.</div></div>
<div class="calc-card"><div class="card-title">SHAKE128 / SHAKE256</div><div class="card-body">Extendable-output functions (XOFs). You ask for as many output bytes as you want. Used in NIST PQC standards (lesson 8) for arbitrary-length pseudo-randomness.</div></div>
<div class="calc-card"><div class="card-title">cSHAKE / KMAC / TupleHash</div><div class="card-body">Domain-separated variants. Used for protocol bindings ("hash this <em>as a key derivation</em>") to avoid same-input collisions across different uses.</div></div>
<div class="calc-card"><div class="card-title">Ethereum Keccak-256</div><div class="card-body">Confusingly, Ethereum uses the original Keccak-256 submission, not the post-NIST SHA3-256. They differ by a single padding byte. Bitcoin and most other systems use SHA-256, not Keccak.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. The Length-Extension Attack and Why HMAC Exists</h2>
<p class="l-text">Suppose you want to authenticate a message m with a secret key k by computing tag = SHA-256(k || m). It feels right — the attacker does not know k, so they cannot recompute the hash. But Merkle-Damgård hashes have a fatal property: given H(x) and the length of x, an attacker can compute H(x || padding || y) for any y of their choice, <strong>without knowing x</strong>. They simply restart the hash machine from the published H(x) state and feed in y.</p>

<div class="calc-highlight"><strong>Real-world impact:</strong> Flickr's API in 2009 accepted requests authenticated by MD5(secret || params) — a flickr researcher demonstrated forging arbitrary admin commands by length-extending the legitimate API call. The attack works against any SHA-2 hash used in the H(k || m) shape. Use HMAC.</div>

<p class="l-text"><strong>HMAC</strong> (Bellare-Canetti-Krawczyk 1996, RFC 2104) is the fix. It hashes the key twice with two different padding constants:</p>

<div class="katex-block">$$\\text{HMAC}(k, m) = H\\big( (k \\oplus \\text{opad}) \\,\\|\\, H( (k \\oplus \\text{ipad}) \\,\\|\\, m) \\big)$$</div>

<p class="l-text">The outer hash hides the inner hash's final state, so length-extension fails. HMAC-SHA-256 is the integrity primitive in TLS 1.2 cookies, JWT (HS256), AWS request signing, and a thousand other protocols. It is provably secure assuming the underlying compression function is a pseudo-random function.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Python's <code>hmac</code> is available. We compute HMAC-SHA-256 of an API request and verify it constant-time.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hmac, hashlib, secrets

key = secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)

<span class="kw">def</span> <span class="fn">sign_request</span>(key, method, path, body):
    canonical = method.<span class="fn">upper</span>().<span class="fn">encode</span>() + b<span class="str">'\\n'</span> + path.<span class="fn">encode</span>() + b<span class="str">'\\n'</span> + body
    <span class="kw">return</span> hmac.<span class="fn">new</span>(key, canonical, hashlib.sha256).<span class="fn">hexdigest</span>()

<span class="kw">def</span> <span class="fn">verify_request</span>(key, method, path, body, given):
    expected = <span class="fn">sign_request</span>(key, method, path, body)
    <span class="kw">return</span> hmac.<span class="fn">compare_digest</span>(expected, given)

tag = <span class="fn">sign_request</span>(key, <span class="str">'POST'</span>, <span class="str">'/api/v1/orders'</span>, b<span class="str">'{<span class="str">"amount"</span>:100}'</span>)
<span class="fn">print</span>(<span class="str">'tag :'</span>, tag)
<span class="fn">print</span>(<span class="str">'OK  :'</span>, <span class="fn">verify_request</span>(key, <span class="str">'POST'</span>, <span class="str">'/api/v1/orders'</span>, b<span class="str">'{<span class="str">"amount"</span>:100}'</span>, tag))

<span class="cm"># Tampered body -&gt; verification fails</span>
<span class="fn">print</span>(<span class="str">'tampered :'</span>, <span class="fn">verify_request</span>(key, <span class="str">'POST'</span>, <span class="str">'/api/v1/orders'</span>, b<span class="str">'{<span class="str">"amount"</span>:999}'</span>, tag))
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>secrets.token_bytes(32)</code> draws a 256-bit HMAC key from the OS CSPRNG — this is the long-term API secret an AWS-Signature-V4-style scheme would store server-side; never log it, never embed in client code. 2) <code>sign_request</code> builds a <em>canonicalized</em> request string <code>METHOD || \n || PATH || \n || BODY</code> — canonicalization is the whole reason for the join: without it, an attacker could shuffle whitespace or header order to forge a fresh signature from a captured one. 3) <code>hmac.new(key, canonical, hashlib.sha256).hexdigest()</code> implements the Bellare-Canetti-Krawczyk HMAC construction (RFC 2104) — two SHA-256 invocations with ipad/opad padding, which is what makes HMAC immune to the SHA-2 length-extension attack that broke Flickr's <code>SHA-256(secret || params)</code> API in 2009. 4) <code>hmac.compare_digest(expected, given)</code> performs constant-time tag comparison preventing the per-byte timing oracle that broke Lucky Thirteen against TLS 1.0 CBC-then-MAC; the final tampered <code>amount:999</code> body line produces a different canonical string, a different HMAC, and the verification returns False without leaking which byte differed.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. BLAKE3 — When You Need Speed</h2>
<p class="l-text">BLAKE3 (O'Connor-Aumasson-Neves-Wilcox-O'Hearn 2020) is the speed champion. It is a tree-based reduction of BLAKE2 (which itself comes from the SHA-3 finalist BLAKE) and parallelizes naturally across cores and SIMD lanes. On a modern x86 with AVX-512, BLAKE3 hashes ~7 GB/s on a single thread and ~50 GB/s across 16 cores. SHA-256 with SHA-NI is comparable on small inputs but does not parallelize within a single hash; for big files BLAKE3 wins by an order of magnitude.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When to pick BLAKE3</div><div class="card-body">Hashing big files (deduplication, content-addressed storage), parallel build systems (Bazel, Buck2), high-throughput servers. The default in <code>cargo</code> and many newer tools.</div></div>
<div class="calc-card"><div class="card-title">When to pick SHA-256</div><div class="card-body">Anything that interoperates with existing infrastructure (TLS, JWT, blockchain, audit logs). Hardware support is universal. SHA-256 is the boring-correct choice unless you have a measured speed bottleneck.</div></div>
<div class="calc-card"><div class="card-title">When to pick SHA-3</div><div class="card-body">Regulated environments that require structural diversity from SHA-2, or post-quantum protocols (lesson 8) that mandate it. Slower in software, faster in hardware.</div></div>
<div class="calc-card"><div class="card-title">Never pick</div><div class="card-body">MD5, SHA-1. As checksums for non-security data: fine. As hashes in any security context: forbidden.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Password Hashing — Where Slow Is The Feature</h2>
<p class="l-text">A normal hash is fast — that is its job. For password storage, fast is exactly wrong. If a database breach leaks SHA-256(password) for 100 million users, an attacker with a $5000 GPU rig can brute-force 100 billion candidates per second. Every weak password falls in seconds. The defense is a <strong>memory-hard, slow-by-design hash</strong> that takes hundreds of milliseconds and gigabytes of RAM per attempt — turning the GPU's parallelism advantage into a liability.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Argon2id (default)</div><div class="card-body">Winner of the 2015 Password Hashing Competition. Memory-hard, side-channel-resistant. Recommended params (OWASP 2024): m=19MB, t=2 iterations, p=1. Produces a self-describing hash string.</div></div>
<div class="calc-card"><div class="card-title">scrypt</div><div class="card-body">Percival 2009, used by Litecoin and Tarsnap. Memory-hard, well-studied. Marginally weaker side-channel posture than Argon2id; recommended only when Argon2id is unavailable.</div></div>
<div class="calc-card"><div class="card-title">bcrypt</div><div class="card-body">Provos-Mazières 1999. Not memory-hard but cost-tunable. Battle-tested over 25 years (PHP, Ruby on Rails). 72-byte input limit is a footgun. Cost factor 12+ in 2026.</div></div>
<div class="calc-card"><div class="card-title">PBKDF2</div><div class="card-body">RFC 2898. CPU-only iterations of HMAC-SHA-256. NIST-approved, FIPS-friendly. Falls to GPU/ASIC attacks; only use when a regulator demands it.</div></div>
<div class="calc-card"><div class="card-title">Plain SHA-256</div><div class="card-body">Wrong. Always wrong. If you ever see <code>sha256(password + salt)</code> in production code, file a security incident.</div></div>
</div>

<div class="calc-highlight"><strong>Salt + per-user pepper:</strong> always store a per-record random salt (Argon2id includes it in the output string). Optionally a server-side <em>pepper</em> stored outside the database — so a database leak alone does not let an attacker start cracking. Layered defense.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pyodide ships <code>hashlib.pbkdf2_hmac</code>. We compare a fast hash (raw SHA-256) against PBKDF2 with 200,000 iterations to see the cost difference.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, time, secrets

password = b<span class="str">'correct horse battery staple'</span>
salt     = secrets.<span class="fn">token_bytes</span>(<span class="num">16</span>)

<span class="cm"># 1. Plain SHA-256 — fast and BROKEN for passwords</span>
t0 = time.<span class="fn">perf_counter</span>()
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10000</span>):
    hashlib.<span class="fn">sha256</span>(salt + password).<span class="fn">digest</span>()
<span class="fn">print</span>(f<span class="str">'sha256 x10000      : {time.perf_counter()-t0:.3f} s'</span>)

<span class="cm"># 2. PBKDF2-HMAC-SHA-256 with 200k iterations — slow on purpose</span>
t0 = time.<span class="fn">perf_counter</span>()
key = hashlib.<span class="fn">pbkdf2_hmac</span>(<span class="str">'sha256'</span>, password, salt, iterations=200_000, dklen=<span class="num">32</span>)
<span class="fn">print</span>(f<span class="str">'pbkdf2 200k iters  : {time.perf_counter()-t0:.3f} s   key={key.hex()[:32]}...'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Uses the textbook "correct horse battery staple" passphrase plus a fresh 16-byte salt from <code>secrets.token_bytes</code> — salt is per-user random, included in Argon2id / bcrypt output strings and stored alongside the hash so a rainbow table built for one site cannot precompute attacks against another. 2) The first loop runs 10 000 raw SHA-256 hashes and times them — typically a few milliseconds total — to demonstrate why fast hashes are <em>wrong</em> for passwords: a $5 000 GPU rig achieves ~100 billion SHA-256/s, cracking 100M leaked users' weak passwords in seconds. 3) <code>hashlib.pbkdf2_hmac('sha256', password, salt, iterations=200_000, dklen=32)</code> runs PBKDF2-HMAC-SHA256 (RFC 2898): 200k inner HMAC iterations, ~50 ms wall-clock — the cost factor is the whole point, turning per-guess GPU rate from 10^11/s down to ~10^4/s. 4) The OWASP 2024 floor is actually 600k PBKDF2 iterations (or Argon2id m=19MB, t=2) — the 200k here is a Pyodide-friendly demo number; the printed seconds gap between the two timings is the entire economic case for memory-hard / iteration-tuned password hashing.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Merkle Trees — Hashes That Prove Membership</h2>
<p class="l-text">A Merkle tree (Ralph Merkle 1979) hashes pairs of leaves up a binary tree until you reach a single root. The root commits to all the leaves. To prove that a specific leaf is in the tree, you hand over a path of O(log n) sibling hashes: the verifier rehashes them up to the root and checks that it matches. The construction is the bedrock of:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bitcoin / Ethereum</div><div class="card-body">Each block's transactions are committed in a Merkle root in the header. Light clients verify a transaction's inclusion with a 256-byte proof regardless of block size.</div></div>
<div class="calc-card"><div class="card-title">Certificate Transparency (lesson 4)</div><div class="card-body">Every TLS certificate must appear in a public, append-only Merkle log. Browsers require a Signed Certificate Timestamp; misissuance is publicly auditable.</div></div>
<div class="calc-card"><div class="card-title">Git</div><div class="card-body">Every commit is a Merkle tree of trees of blobs. Two repos with the same commit hash have provably identical content. Git is moving SHA-1 → SHA-256 for exactly the collision reasons in section 1.</div></div>
<div class="calc-card"><div class="card-title">zk-SNARKs (lesson 5)</div><div class="card-body">Many zk applications (Tornado Cash, zkSync) use Merkle trees to commit to a set and then prove membership in zero-knowledge — "I am in the set, but I will not say which element".</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build a Merkle tree over 8 leaves, generate an inclusion proof for one of them, verify it.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">H</span>(b):
    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>(b).<span class="fn">digest</span>()

leaves = [<span class="fn">H</span>(f<span class="str">'tx-{i}'</span>.<span class="fn">encode</span>()) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)]

<span class="kw">def</span> <span class="fn">merkle_root</span>(level):
    <span class="kw">while</span> <span class="fn">len</span>(level) &gt; <span class="num">1</span>:
        level = [<span class="fn">H</span>(level[i] + level[i+<span class="num">1</span>]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(level), <span class="num">2</span>)]
    <span class="kw">return</span> level[<span class="num">0</span>]

<span class="kw">def</span> <span class="fn">merkle_proof</span>(leaves, idx):
    proof, level, i = [], leaves[:], idx
    <span class="kw">while</span> <span class="fn">len</span>(level) &gt; <span class="num">1</span>:
        sib = i ^ <span class="num">1</span>
        proof.<span class="fn">append</span>((level[sib], i &amp; <span class="num">1</span>))   <span class="cm"># (sibling, our_position_bit)</span>
        level = [<span class="fn">H</span>(level[j] + level[j+<span class="num">1</span>]) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(level), <span class="num">2</span>)]
        i //= <span class="num">2</span>
    <span class="kw">return</span> proof

<span class="kw">def</span> <span class="fn">verify</span>(leaf, proof, root):
    h = leaf
    <span class="kw">for</span> sib, side <span class="kw">in</span> proof:
        h = <span class="fn">H</span>(sib + h) <span class="kw">if</span> side <span class="kw">else</span> <span class="fn">H</span>(h + sib)
    <span class="kw">return</span> h == root

root = <span class="fn">merkle_root</span>(leaves)
idx  = <span class="num">5</span>
proof = <span class="fn">merkle_proof</span>(leaves, idx)
<span class="fn">print</span>(<span class="str">'root  :'</span>, root.<span class="fn">hex</span>()[:<span class="num">32</span>], <span class="str">'...'</span>)
<span class="fn">print</span>(<span class="str">'proof len :'</span>, <span class="fn">len</span>(proof), <span class="str">'siblings (~ log2(8))'</span>)
<span class="fn">print</span>(<span class="str">'verify    :'</span>, <span class="fn">verify</span>(leaves[idx], proof, root))
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>H</code> is the binding hash <code>sha256(b)</code> — every node and leaf in the tree is a 32-byte digest, and using the same hash everywhere is what makes the tree's collision-resistance reduce cleanly to SHA-256's 128-bit collision floor. 2) <code>merkle_root</code> walks the tree bottom-up: pair adjacent nodes <code>(level[i], level[i+1])</code>, hash them into the next level, repeat until one root remains — this is the classic Ralph Merkle 1979 construction that lets Bitcoin commit thousands of transactions in a single 32-byte header field. 3) <code>merkle_proof</code> emits the inclusion proof: at each level it records the sibling node (<code>i ^ 1</code> flips the low bit to find the pair) plus a side flag indicating whether <em>we</em> were the left or right child — exactly the proof format Certificate Transparency log monitors and zkSync rollups consume. 4) <code>verify</code> reconstructs the root from <code>leaf</code> and the O(log n) sibling list by hashing in the recorded direction (<code>H(sib + h)</code> if we were on the right, otherwise <code>H(h + sib)</code>) — leaf 5 needs exactly 3 sibling hashes for an 8-leaf tree (log2(8)), and the printed <code>verify : True</code> confirms inclusion without revealing the other 7 leaves.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hash-Based Signatures and the PQ Bridge</h2>
<p class="l-text">Hashes are the only cryptographic primitive that is unconditionally believed to survive quantum attack — Grover halves the security level (256 → 128), but does not break it. This makes hash-based signatures (Lamport 1979, Merkle's tree-based variants, today's SPHINCS+ / SLH-DSA standardised by NIST in 2024) the most conservative post-quantum choice.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lamport one-time signatures</div><div class="card-body">For each bit of the hash, publish two random secrets; the signature reveals one of them. One-shot — must not reuse keys. The historical foundation.</div></div>
<div class="calc-card"><div class="card-title">Merkle signature trees</div><div class="card-body">Combine many one-time keys under a Merkle tree. Stateful — must track which leaves are spent.</div></div>
<div class="calc-card"><div class="card-title">XMSS / LMS</div><div class="card-body">Stateful hash-based signatures, NIST SP 800-208. Used in firmware signing where tracking state is feasible.</div></div>
<div class="calc-card"><div class="card-title">SPHINCS+ / SLH-DSA (FIPS 205, 2024)</div><div class="card-body">Stateless hash-based signatures. Big (~8-30 KB) and slow but conservatively secure — only relies on hash properties. The "if all else fails" PQ signature.</div></div>
</div>

<p class="l-text">URV's CRISES research group has contributed to PQ standardization analyses, particularly around stateful signature management for IoT firmware. The basic insight: hashes are the cryptographer's safety net — when number-theoretic assumptions wobble, hash-based constructions still stand.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Common Bugs in Hash and MAC Code</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">H(k || m) for authentication</div><div class="card-body">Length-extension attack. Use HMAC. Always.</div></div>
<div class="calc-card"><div class="card-title">Variable-time tag compare</div><div class="card-body"><code>tag == expected</code> in Python, <code>memcmp</code> in C. Both leak per-byte timing. Use <code>hmac.compare_digest</code> / <code>CRYPTO_memcmp</code>.</div></div>
<div class="calc-card"><div class="card-title">Truncating MAC tags below 96 bits</div><div class="card-body">Reduces forgery resistance. NIST allows 96-bit minimum for HMAC; use 128- or 256-bit unless space is critical.</div></div>
<div class="calc-card"><div class="card-title">Same key for HMAC and HKDF</div><div class="card-body">Domain-separation failure. Derive sub-keys with HKDF-Expand("hmac-key" / "encryption-key"), do not reuse.</div></div>
<div class="calc-card"><div class="card-title">Password hashing with PBKDF2-100k in 2026</div><div class="card-body">Iteration count from 2010. OWASP now recommends Argon2id m=19MB t=2; PBKDF2 needs ≥600k iterations.</div></div>
<div class="calc-card"><div class="card-title">Re-using nonces between hash uses</div><div class="card-body">Same value used as both an HMAC key and a randomness source. Always domain-separate.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">Hashes give us preimage, second-preimage, and collision resistance — but only at half the bit length for collisions (birthday bound). SHA-256 is the boring-correct default; SHA-3 / BLAKE3 / SHAKE are the modern alternatives for specific needs. For authentication, HMAC; for passwords, Argon2id; for membership proofs, Merkle trees; for the post-quantum future, hash-based signatures (SPHINCS+) as the conservative fallback.</p>

<p class="l-text">Lesson 4 takes everything we have built — symmetric AEAD (lesson 1), asymmetric signatures (lesson 2), hashes for fingerprinting (lesson 3) — and stitches them into <strong>PKI and TLS 1.3</strong>: how does your browser know that <em>this</em> X.509 certificate, signed by <em>that</em> CA, hashes correctly, and binds the right public key to the right hostname? The answer is the entire scaffolding of the modern internet.</p>
</div>`,
tr: `<p class="l-text"><strong>Hash fonksiyonları, yeryüzündeki her imzanın, her sertifikanın, her blockchain bloğunun, her Git commit'inin, her parola deposunun altındaki sessiz altyapıdır.</strong> Bir kriptografik hash, keyfi bir girdi alır ve sabit boyutlu sözde rastgele bir dize döndürür. Ondan talep ettiğimiz özellikler — preimage direnci, ikinci preimage direnci, çakışma direnci — soyut görünür, ancak bunlardan herhangi birinin başarısız olmasının gerçek dünya sonuçları vardır: SHA-1 çakışmaları sertifika otoritelerini kırdı (SHAttered 2017, Chosen-Prefix 2020), MD5 çakışmaları Flame zararlı yazılımının bir Microsoft kod-imzalama sertifikasını sahteleştirmesini sağladı (2012) ve zayıf parola hash'leri her yıl milyarlarca kullanıcıyı sızdırır.</p>

<p class="l-text">Bu derste SHA-256 ve SHA-3'ü (Keccak) yürüyoruz, BLAKE3'ün şimdi neden hız şampiyonu olduğunu açıklıyoruz, bir hash'ten HMAC inşa ediyoruz ve HMAC'in tasarımını motive eden uzunluk-uzatma saldırısını gösteriyoruz, ardından parola hash'leme — kriptografinin hızın düşman olduğu ve Argon2id, bcrypt ile scrypt'in saldırganları yavaşlatmak için kasıtlı olarak CPU döngülerini yaktığı köşe — konusunu ele alıyoruz. Hash'leri blockchain'ler, Sertifika Şeffaflığı kayıtları ve Git'in içerik adresli depolaması için bütünlük kanıtlarına dönüştüren veri yapısı olan Merkle ağaçlarıyla kapatıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Üç hash özelliğini (preimage, 2. preimage, çakışma) ve doğum günü sınırını ifade edin</li>
<li>Bir hash seçin: SHA-256 (varsayılan), SHA-3 (sünger, uzunluk-uzatmaya güvenli), BLAKE3 (paralel hız)</li>
<li>Bir hash'ten HMAC inşa edin ve H(key || message)'in neden güvensiz olduğunu açıklayın (uzunluk uzatma)</li>
<li>Bir parola hash'i seçin — Argon2id varsayılandır; bcrypt ve scrypt ikinci sırada</li>
<li>Bir Merkle ağacı oluşturun, O(log n) boyutlu kapsanma kanıtları üretin</li>
<li>SHA-1'in ölümünü sayısallaştırın: 2020'de seçilmiş-önek çakışmaları için 2^63 iş — 50 bin dolarlık bir küme işi</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç Özellik — Preimage, 2. Preimage, Çakışma</h2>
<p class="l-text">Bir kriptografik hash fonksiyonu H: {0,1}* → {0,1}^n üç özelliği karşılamalıdır:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Preimage direnci</div><div class="card-body">y verildiğinde, H(x) = y olacak herhangi bir x bulmak imkânsız. Maliyet ~2^n. SHA-256 için bu 2^256 — sonsuza dek fiziksel erişim dışında.</div></div>
<div class="calc-card"><div class="card-title">2. preimage direnci</div><div class="card-body">x verildiğinde, H(x') = H(x) olacak x' ≠ x bulmak imkânsız. Aynı ~2^n maliyet. İmza şemalarını korur: bir saldırgan, imzalanmış mesajla aynı digest'e hash'lenen ikinci bir mesaj bulamaz.</div></div>
<div class="calc-card"><div class="card-title">Çakışma direnci</div><div class="card-body">H(x) = H(x') olacak herhangi bir (x, x') çiftini bulmak imkânsız. Doğum günü sınırı: ~2^{n/2}. SHA-256 → 2^128 iş, imkânsız. SHA-1 → 2^80 bir zamanlar güvenliydi; 2017'de Google'ın SHAttered saldırısı 2^63.1 GPU-saatinde bir çakışma buldu — yaklaşık 110 bin dolarlık bulut süresi.</div></div>
<div class="calc-card"><div class="card-title">Rastgele oracle</div><div class="card-body">Her yeni girdi için tekdüze rastgele değer veren idealize edilmiş bir hash. Gerçek hash'ler buna yaklaşır; OAEP, PSS, Fiat-Shamir'in güvenlik kanıtlarının hepsi rastgele-oracle modelini varsayar.</div></div>
</div>

<div class="katex-block">$$\\text{Pr}[\\text{collision in } q \\text{ queries}] \\approx \\frac{q^2}{2^{n+1}} \\quad \\Rightarrow \\quad q \\approx 2^{n/2} \\text{ for } 50\\%$$</div>

<p class="l-text">Doğum günü sınırı — çakışma bulma ~2^{n/2} hash değerlendirmesi alır — bir 256-bit hash'in preimage'a karşı 256-bit güvenlik vermesine rağmen çakışmalara karşı neden "128-bit güvenlik" verdiğinin nedenidir. SHA-1 (160-bit) teorik olarak 80-bit çakışma-dirençliydi; bu seviye 2017'ye kadar GPU'lara düştü. SHA-256 (256-bit, 128-bit çakışma-dirençli) rahatça erişim dışındadır.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SHA-2 Ailesi — Merkle-Damgård, Davies-Meyer ve Neden Çalışıyor</h2>
<p class="l-text">SHA-256 (NIST FIPS 180-4, 2002) modern internetin iş atı hash'idir. Bir mesaj alır, 512 bitin katına padding uygular ve her 512-bit bloğu 64 round XOR, ADD, ROT, AND, OR, NOT'tan inşa edilen bir sıkıştırma fonksiyonundan geçirir. Sıkıştırma fonksiyonu Davies-Meyer yapısını izler (bir blok şifreyi besleme-ileri modunda kullan) ve yineleme Merkle-Damgård'ı izler (sonraki blok için IV olarak çalışan digest ile blok blok zincirle).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SHA-256</div><div class="card-body">256-bit çıktı, 512-bit blok, 64 round. Donanım hızlandırması olmadan modern CPU'da ~700 MB/s, Intel SHA Uzantıları ile ~3 GB/s (Goldmont 2016+, Tiger Lake 2020+). Neredeyse her şey için varsayılan: TLS, JWT, Bitcoin, 2026 sonrası Git.</div></div>
<div class="calc-card"><div class="card-title">SHA-512</div><div class="card-body">512-bit çıktı, 1024-bit blok, 80 round. SHA-NI olmadan 64-bit CPU'larda SHA-256'dan daha hızlı (64-bit kelimeler üzerinde yerel olarak çalışır). Argon2 dahili kısımlarında kullanılır.</div></div>
<div class="calc-card"><div class="card-title">SHA-224 / SHA-384</div><div class="card-body">Kısaltılmış SHA-256 / SHA-512. Daha yüksek güvenlik varyantı gerektiğinde ancak çıktının belirli bir boyut kısıtlamasına uyması gerektiğinde kullanılır. Pratikte nadir.</div></div>
<div class="calc-card"><div class="card-title">SHA-1 (ÖLÜ)</div><div class="card-body">160-bit çıktı, 2011'de kullanımdan kaldırıldı, 2017'de kırıldı (SHAttered, Stevens vd.), 2020'de seçilmiş-önek çakışmaları (Leurent-Peyrin). Eski CDN'lerde, çok eski Git depolarında hâlâ görünür. Ona dokunan her şeyi taşıyın.</div></div>
<div class="calc-card"><div class="card-title">MD5 (GERÇEKTEN ÖLÜ)</div><div class="card-body">128-bit çıktı. Çakışmalar 2004'te bulundu (Wang-Yu), seçilmiş-önek 2008'de (Stevens-Lenstra-de Weger), 2012'de gerçek saldırılarda dağıtıldı (Flame zararlı yazılımı bir Microsoft Terminal Sunucusu Lisanslama sertifikasını sahteleştirdi). Yalnızca güvenlik dışı checksum olarak kullanın.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Python'un <code>hashlib</code>'i SHA-256 ile gelir ve Pyodide'de mevcuttur. Birkaç girdiyi hash'liyoruz ve çığ etkisini izliyoruz — bir biti çevirmek çıktı bitlerinin yaklaşık yarısını değiştirir.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

m1 = b<span class="str">'attack at dawn'</span>
m2 = b<span class="str">'attack at dusk'</span>   <span class="cm"># bir bayt farklı (n vs s, küçük harf mesafesi 5)</span>
m3 = b<span class="str">'attack at dawn '</span>  <span class="cm"># sona bir boşluk eklendi</span>

<span class="kw">for</span> m <span class="kw">in</span> (m1, m2, m3):
    <span class="fn">print</span>(f<span class="str">'{m!r:30s} -&gt; {hashlib.sha256(m).hexdigest()}'</span>)

<span class="cm"># Çığ: m1 ve m2 digest'leri arasındaki farklı bitleri say</span>
h1 = hashlib.<span class="fn">sha256</span>(m1).<span class="fn">digest</span>()
h2 = hashlib.<span class="fn">sha256</span>(m2).<span class="fn">digest</span>()
diff = <span class="fn">sum</span>(<span class="fn">bin</span>(a ^ b).<span class="fn">count</span>(<span class="str">'1'</span>) <span class="kw">for</span> a, b <span class="kw">in</span> <span class="fn">zip</span>(h1, h2))
<span class="fn">print</span>(f<span class="str">'\\nbits differing between m1 and m2 digests: {diff} / 256 (~half expected)'</span>)
</code></pre></div></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Üç neredeyse-özdeş girdi tanımlar — <code>m1</code>, <code>m2</code> (bir harf çevrildi: "dawn"→"dusk") ve <code>m3</code> (sondaki bir boşluk) — kriptografik hash'lerin enterpolatif olmadığını kanıtlayan avalanche testini sürmek için. 2) Her girdi üzerinde döngü kurar ve <code>hashlib.sha256(m).hexdigest()</code> yazdırır; <code>hashlib</code> Pyodide'da gelir ve Python'un stdlib'i alttan OpenSSL'in SHA-256 uygulamasını kullanır (CPython 3.11'den beri yetenekli CPU'larda Intel SHA-NI hızlandırmalı). 3) <code>h1 ^ h2</code> iki 32-byte digest'i byte-by-byte XOR'lar ve <code>bin(...).count('1')</code> ayarlı bitleri sayar — iki SHA-256 çıktısı arasındaki Hamming mesafesi. 4) Çıktı yaklaşık 128/256 farklı bit gösterir — iyi bir hash'in tanımlayıcı "avalanche" / "strict avalanche criterion" özelliği: tek-bit girdi değişikliği her çıktı bitini ~1/2 olasılıkla bağımsız çevirir, ki bu SHA-256'yı OAEP, PSS ve Fiat-Shamir güvenlik kanıtları için random oracle'dan ayırt edilemez kılan tam şey.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SHA-3 / Keccak — Bir Sünger, Merkle-Damgård Değil</h2>
<p class="l-text">2007'de NIST, SHA-1 zayıflıkları ve SHA-2'nin tasarım soyunu paylaşmayacak yapısal olarak farklı bir hash arzusuyla motive olarak SHA-3 için bir yarışma başlattı. Beş finalist ve 2012'de NIST, Bertoni-Daemen-Peeters-Van Assche'nin (AES'i birlikte tasarlayan aynı Daemen) Keccak'ını seçti. Keccak'ın yapısı bir <strong>sünger yapısıdır</strong>: girdiyi state'e XOR'layarak ve bir permütasyon uygulayarak emer, sonra state'i okuyarak ve yeniden permüte ederek çıktıyı sıkar. Mesaj-blok-mesaj-blok sıkıştırma zinciri yoktur.</p>

<p class="l-text">Sünger yapısının derinden hoş bir özelliği vardır: <strong>SHA-3, yapısı gereği uzunluk-uzatma saldırılarına karşı bağışıktır</strong> (bölüm 4); çünkü state çıktıdan daha büyüktür ve onun sadece bir kısmı süngerden çıkar. SHA-2'nin Merkle-Damgård zinciri tüm dahili state'i çıktıyla birlikte sızdırır; uzunluk-uzatmayı mümkün kılan tam olarak budur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">SHA3-256 / SHA3-512</div><div class="card-body">SHA-256 / SHA-512 için takıp-çalıştır alternatifler. Saf yazılımda SHA-2'den daha yavaş (~%30) ancak donanımda daha hızlı. Bazı AB ve ABD standartları tarafından gerekli görülür.</div></div>
<div class="calc-card"><div class="card-title">SHAKE128 / SHAKE256</div><div class="card-body">Genişletilebilir-çıktı fonksiyonları (XOF). İstediğiniz kadar çıktı baytı istersiniz. NIST PQC standartlarında (ders 8) keyfi uzunlukta sözde rastgelelik için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">cSHAKE / KMAC / TupleHash</div><div class="card-body">Alan-ayrımlı varyantlar. Farklı kullanımlar arasında aynı-girdi çakışmalarını önlemek için protokol bağlamaları için ("bunu <em>bir anahtar türetimi olarak</em> hash'le") kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Ethereum Keccak-256</div><div class="card-body">Kafa karıştırıcı şekilde, Ethereum NIST sonrası SHA3-256'yı değil, orijinal Keccak-256 sunumunu kullanır. Tek bir padding baytıyla farklılık gösterirler. Bitcoin ve diğer çoğu sistem Keccak değil SHA-256 kullanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Uzunluk-Uzatma Saldırısı ve HMAC'in Var Olma Nedeni</h2>
<p class="l-text">Bir m mesajını gizli k anahtarı ile tag = SHA-256(k || m) hesaplayarak doğrulamak istediğinizi varsayın. Doğru hissettiriyor — saldırgan k'yı bilmiyor, dolayısıyla hash'i yeniden hesaplayamaz. Ancak Merkle-Damgård hash'lerinin ölümcül bir özelliği vardır: H(x) ve x'in uzunluğu verildiğinde, bir saldırgan kendi seçtiği herhangi bir y için H(x || padding || y)'yi <strong>x'i bilmeden</strong> hesaplayabilir. Yayınlanan H(x) state'inden hash makinesini yeniden başlatır ve y'yi besler.</p>

<div class="calc-highlight"><strong>Gerçek dünya etkisi:</strong> Flickr'in 2009 API'si MD5(secret || params) ile doğrulanmış istekleri kabul ediyordu — bir flickr araştırmacısı meşru API çağrısını uzunluk-uzatarak keyfi yönetici komutlarını sahteleştirmeyi gösterdi. Saldırı, H(k || m) şeklinde kullanılan herhangi bir SHA-2 hash'ine karşı çalışır. HMAC kullanın.</div>

<p class="l-text"><strong>HMAC</strong> (Bellare-Canetti-Krawczyk 1996, RFC 2104) düzeltmedir. Anahtarı iki farklı padding sabitiyle iki kez hash'ler:</p>

<div class="katex-block">$$\\text{HMAC}(k, m) = H\\big( (k \\oplus \\text{opad}) \\,\\|\\, H( (k \\oplus \\text{ipad}) \\,\\|\\, m) \\big)$$</div>

<p class="l-text">Dış hash, iç hash'in son state'ini gizler, bu yüzden uzunluk-uzatma başarısız olur. HMAC-SHA-256, TLS 1.2 çerezleri, JWT (HS256), AWS istek imzalama ve binlerce diğer protokoldeki bütünlük primitifidir. Altta yatan sıkıştırma fonksiyonunun bir sözde rastgele fonksiyon olduğu varsayımı ile kanıtlanabilir şekilde güvenlidir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Python'un <code>hmac</code>'i mevcuttur. Bir API isteğinin HMAC-SHA-256'sını hesaplıyoruz ve sabit zamanlı doğruluyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hmac, hashlib, secrets

key = secrets.<span class="fn">token_bytes</span>(<span class="num">32</span>)

<span class="kw">def</span> <span class="fn">sign_request</span>(key, method, path, body):
    canonical = method.<span class="fn">upper</span>().<span class="fn">encode</span>() + b<span class="str">'\\n'</span> + path.<span class="fn">encode</span>() + b<span class="str">'\\n'</span> + body
    <span class="kw">return</span> hmac.<span class="fn">new</span>(key, canonical, hashlib.sha256).<span class="fn">hexdigest</span>()

<span class="kw">def</span> <span class="fn">verify_request</span>(key, method, path, body, given):
    expected = <span class="fn">sign_request</span>(key, method, path, body)
    <span class="kw">return</span> hmac.<span class="fn">compare_digest</span>(expected, given)

tag = <span class="fn">sign_request</span>(key, <span class="str">'POST'</span>, <span class="str">'/api/v1/orders'</span>, b<span class="str">'{<span class="str">"amount"</span>:100}'</span>)
<span class="fn">print</span>(<span class="str">'tag :'</span>, tag)
<span class="fn">print</span>(<span class="str">'OK  :'</span>, <span class="fn">verify_request</span>(key, <span class="str">'POST'</span>, <span class="str">'/api/v1/orders'</span>, b<span class="str">'{<span class="str">"amount"</span>:100}'</span>, tag))

<span class="cm"># Kurcalanmış gövde -&gt; doğrulama başarısız</span>
<span class="fn">print</span>(<span class="str">'tampered :'</span>, <span class="fn">verify_request</span>(key, <span class="str">'POST'</span>, <span class="str">'/api/v1/orders'</span>, b<span class="str">'{<span class="str">"amount"</span>:999}'</span>, tag))
</code></pre></div></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>secrets.token_bytes(32)</code> OS CSPRNG'sinden 256-bit HMAC anahtarı çeker — bu, AWS-Signature-V4 tarzı bir şemanın sunucu tarafında saklayacağı uzun ömürlü API gizidir; asla loglama, asla istemci koduna gömme. 2) <code>sign_request</code> <em>kanonikleştirilmiş</em> bir istek dizisi inşa eder <code>METHOD || \n || PATH || \n || BODY</code> — kanonikleştirme join'in tüm sebebidir: olmadan, saldırgan whitespace veya header sırasını karıştırıp yakalanmış bir imzadan taze bir tane sahteleştirebilirdi. 3) <code>hmac.new(key, canonical, hashlib.sha256).hexdigest()</code> Bellare-Canetti-Krawczyk HMAC yapısını uygular (RFC 2104) — ipad/opad padding ile iki SHA-256 çağrısı, ki bu HMAC'i 2009'da Flickr'in <code>SHA-256(secret || params)</code> API'sini kıran SHA-2 length-extension saldırısına bağışık yapar. 4) <code>hmac.compare_digest(expected, given)</code> sabit-zamanlı etiket karşılaştırması yapar ve TLS 1.0 CBC-then-MAC'i kıran Lucky Thirteen tarzı byte-başına zamanlama oracle'ını önler; son kurcalanmış <code>amount:999</code> gövde satırı farklı bir kanonik dize, farklı bir HMAC üretir ve dogrulama hangi byte'in farklı olduğunu sızdırmadan False döner.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. BLAKE3 — Hıza İhtiyacınız Olduğunda</h2>
<p class="l-text">BLAKE3 (O'Connor-Aumasson-Neves-Wilcox-O'Hearn 2020) hız şampiyonudur. BLAKE2'nin (kendisi SHA-3 finalisti BLAKE'ten gelir) ağaç tabanlı bir indirgemesidir ve çekirdekler ve SIMD şeritleri arasında doğal olarak paralelleşir. AVX-512 ile modern bir x86'da BLAKE3 tek bir iş parçacığında ~7 GB/s ve 16 çekirdek arasında ~50 GB/s hash'ler. SHA-NI ile SHA-256 küçük girdilerde karşılaştırılabilirdir ancak tek bir hash içinde paralelleşmez; büyük dosyalar için BLAKE3 bir büyüklük mertebesi kazanır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">BLAKE3 ne zaman seçilir</div><div class="card-body">Büyük dosyaları hash'leme (deduplikasyon, içerik adresli depolama), paralel derleme sistemleri (Bazel, Buck2), yüksek verimli sunucular. <code>cargo</code> ve birçok yeni araçtaki varsayılan.</div></div>
<div class="calc-card"><div class="card-title">SHA-256 ne zaman seçilir</div><div class="card-body">Mevcut altyapıyla birlikte çalışan her şey (TLS, JWT, blockchain, denetim kayıtları). Donanım desteği evrenseldir. Ölçülmüş bir hız darboğazınız olmadıkça SHA-256 sıkıcı-doğru seçimdir.</div></div>
<div class="calc-card"><div class="card-title">SHA-3 ne zaman seçilir</div><div class="card-body">SHA-2'den yapısal çeşitlilik gerektiren düzenlenmiş ortamlar veya bunu zorunlu kılan post-kuantum protokoller (ders 8). Yazılımda daha yavaş, donanımda daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Asla seçilmez</div><div class="card-body">MD5, SHA-1. Güvenlik dışı veriler için checksum olarak: tamam. Herhangi bir güvenlik bağlamında hash olarak: yasak.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Parola Hash'leme — Yavaşın Özellik Olduğu Yer</h2>
<p class="l-text">Normal bir hash hızlıdır — bu onun işidir. Parola depolama için hızlı tam olarak yanlıştır. Bir veritabanı ihlali 100 milyon kullanıcı için SHA-256(parola) sızdırırsa, 5000 dolarlık bir GPU rig'ine sahip bir saldırgan saniyede 100 milyar adayı kaba kuvvetle deneyebilir. Her zayıf parola saniyeler içinde düşer. Savunma, deneme başına yüzlerce milisaniye ve gigabaytlarca RAM gerektiren <strong>bellek-zor, tasarım-gereği-yavaş bir hash</strong>tır — GPU'nun paralellik avantajını bir yükümlülüğe dönüştürür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Argon2id (varsayılan)</div><div class="card-body">2015 Parola Hash'leme Yarışması'nın kazananı. Bellek-zor, yan-kanal-dirençli. Önerilen parametreler (OWASP 2024): m=19MB, t=2 yineleme, p=1. Kendini açıklayan bir hash dizesi üretir.</div></div>
<div class="calc-card"><div class="card-title">scrypt</div><div class="card-body">Percival 2009, Litecoin ve Tarsnap tarafından kullanılır. Bellek-zor, iyi çalışılmış. Argon2id'den marjinal olarak daha zayıf yan-kanal duruşu; yalnızca Argon2id mevcut olmadığında önerilir.</div></div>
<div class="calc-card"><div class="card-title">bcrypt</div><div class="card-body">Provos-Mazières 1999. Bellek-zor değil ancak maliyet ayarlanabilir. 25 yıldır savaşta sınanmış (PHP, Ruby on Rails). 72-baytlık girdi sınırı bir ayak silahıdır. 2026'da maliyet faktörü 12+.</div></div>
<div class="calc-card"><div class="card-title">PBKDF2</div><div class="card-body">RFC 2898. HMAC-SHA-256'nın sadece-CPU yinelemeleri. NIST onaylı, FIPS dostu. GPU/ASIC saldırılarına düşer; yalnızca düzenleyici talep ettiğinde kullanın.</div></div>
<div class="calc-card"><div class="card-title">Düz SHA-256</div><div class="card-body">Yanlış. Her zaman yanlış. Üretim kodunda <code>sha256(parola + tuz)</code> görürseniz, bir güvenlik olayı bildirin.</div></div>
</div>

<div class="calc-highlight"><strong>Tuz + kullanıcı başına biber:</strong> her zaman kayıt başına rastgele bir tuz saklayın (Argon2id bunu çıktı dizesine dahil eder). İsteğe bağlı olarak veritabanı dışında saklanan sunucu tarafı bir <em>biber</em> — böylece tek başına bir veritabanı sızıntısı saldırganın kırma işlemine başlamasına izin vermez. Katmanlı savunma.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pyodide <code>hashlib.pbkdf2_hmac</code> ile gelir. Maliyet farkını görmek için hızlı bir hash'i (ham SHA-256) 200.000 yinelemeli PBKDF2 ile karşılaştırıyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, time, secrets

password = b<span class="str">'correct horse battery staple'</span>
salt     = secrets.<span class="fn">token_bytes</span>(<span class="num">16</span>)

<span class="cm"># 1. Düz SHA-256 — hızlı ve parolalar için BOZUK</span>
t0 = time.<span class="fn">perf_counter</span>()
<span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10000</span>):
    hashlib.<span class="fn">sha256</span>(salt + password).<span class="fn">digest</span>()
<span class="fn">print</span>(f<span class="str">'sha256 x10000      : {time.perf_counter()-t0:.3f} s'</span>)

<span class="cm"># 2. 200k yinelemeli PBKDF2-HMAC-SHA-256 — bilinçli olarak yavaş</span>
t0 = time.<span class="fn">perf_counter</span>()
key = hashlib.<span class="fn">pbkdf2_hmac</span>(<span class="str">'sha256'</span>, password, salt, iterations=200_000, dklen=<span class="num">32</span>)
<span class="fn">print</span>(f<span class="str">'pbkdf2 200k iters  : {time.perf_counter()-t0:.3f} s   key={key.hex()[:32]}...'</span>)
</code></pre></div></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Klasik "correct horse battery staple" parolasını artı <code>secrets.token_bytes</code>'tan taze 16-byte tuz kullanır — tuz kullanıcı başına rastgele, Argon2id / bcrypt çıktı dizilerine dahil edilir ve hash'in yanında saklanır, böylece bir site için inşa edilmiş gökkuşağı tablosu başka birine karşı önceden hesaplama yapamaz. 2) İlk döngü 10 000 ham SHA-256 hash çalıştırır ve zamanlar — tipik olarak birkaç milisaniye toplam — hızlı hash'lerin parolalar için neden <em>yanlış</em> olduğunu göstermek için: $5 000'lik bir GPU kurulumu ~100 milyar SHA-256/s'ye ulaşır, 100M sızdırılmış kullanıcının zayıf parolalarını saniyeler içinde kırar. 3) <code>hashlib.pbkdf2_hmac('sha256', password, salt, iterations=200_000, dklen=32)</code> PBKDF2-HMAC-SHA256 çalıştırır (RFC 2898): 200k iç HMAC yinelemesi, ~50 ms duvar saati — maliyet faktörü tüm noktadır, GPU başına tahmin oranını 10^11/s'den ~10^4/s'ye düşürür. 4) OWASP 2024 tabanı aslında 600k PBKDF2 yinelemesi (veya Argon2id m=19MB, t=2) — buradaki 200k Pyodide-dostu bir demo sayısı; iki zamanlama arasında yazdırılan saniye farkı, memory-hard / yineleme-ayarlı parola hash'leme için tüm ekonomik argümandır.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Merkle Ağaçları — Üyeliği Kanıtlayan Hash'ler</h2>
<p class="l-text">Bir Merkle ağacı (Ralph Merkle 1979) ikili bir ağaçta tek bir köke ulaşana kadar yaprak çiftlerini hash'ler. Kök, tüm yapraklara taahhüt eder. Belirli bir yaprağın ağaçta olduğunu kanıtlamak için, O(log n) kardeş hash'lerinin bir yolunu verirsiniz: doğrulayıcı bunları köke kadar yeniden hash'ler ve eşleşip eşleşmediğini kontrol eder. Yapı şunların temelidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bitcoin / Ethereum</div><div class="card-body">Her bloğun işlemleri başlıkta bir Merkle kökünde taahhüt edilir. Hafif istemciler, blok boyutundan bağımsız olarak bir işlemin kapsanmasını 256-baytlık bir kanıtla doğrular.</div></div>
<div class="calc-card"><div class="card-title">Sertifika Şeffaflığı (ders 4)</div><div class="card-body">Her TLS sertifikası genel, sadece-ekleme bir Merkle kaydında görünmelidir. Tarayıcılar bir İmzalı Sertifika Zaman Damgası gerektirir; yanlış verilim genel olarak denetlenebilir.</div></div>
<div class="calc-card"><div class="card-title">Git</div><div class="card-body">Her commit, blob'ların ağaçlarının bir Merkle ağacıdır. Aynı commit hash'ine sahip iki depo kanıtlanabilir şekilde özdeş içeriğe sahiptir. Git, tam olarak 1. bölümdeki çakışma nedenleriyle SHA-1 → SHA-256'ya geçiyor.</div></div>
<div class="calc-card"><div class="card-title">zk-SNARK'lar (ders 5)</div><div class="card-body">Birçok zk uygulaması (Tornado Cash, zkSync) bir kümeye taahhüt etmek ve sonra üyeliği sıfır-bilgide kanıtlamak için Merkle ağaçları kullanır — "Kümedeyim, ama hangi öğe olduğumu söylemeyeceğim".</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">8 yaprak üzerinde bir Merkle ağacı oluşturun, biri için bir kapsanma kanıtı üretin, doğrulayın.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">H</span>(b):
    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>(b).<span class="fn">digest</span>()

leaves = [<span class="fn">H</span>(f<span class="str">'tx-{i}'</span>.<span class="fn">encode</span>()) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>)]

<span class="kw">def</span> <span class="fn">merkle_root</span>(level):
    <span class="kw">while</span> <span class="fn">len</span>(level) &gt; <span class="num">1</span>:
        level = [<span class="fn">H</span>(level[i] + level[i+<span class="num">1</span>]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(level), <span class="num">2</span>)]
    <span class="kw">return</span> level[<span class="num">0</span>]

<span class="kw">def</span> <span class="fn">merkle_proof</span>(leaves, idx):
    proof, level, i = [], leaves[:], idx
    <span class="kw">while</span> <span class="fn">len</span>(level) &gt; <span class="num">1</span>:
        sib = i ^ <span class="num">1</span>
        proof.<span class="fn">append</span>((level[sib], i &amp; <span class="num">1</span>))   <span class="cm"># (kardeş, bizim_pozisyon_bitimiz)</span>
        level = [<span class="fn">H</span>(level[j] + level[j+<span class="num">1</span>]) <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(level), <span class="num">2</span>)]
        i //= <span class="num">2</span>
    <span class="kw">return</span> proof

<span class="kw">def</span> <span class="fn">verify</span>(leaf, proof, root):
    h = leaf
    <span class="kw">for</span> sib, side <span class="kw">in</span> proof:
        h = <span class="fn">H</span>(sib + h) <span class="kw">if</span> side <span class="kw">else</span> <span class="fn">H</span>(h + sib)
    <span class="kw">return</span> h == root

root = <span class="fn">merkle_root</span>(leaves)
idx  = <span class="num">5</span>
proof = <span class="fn">merkle_proof</span>(leaves, idx)
<span class="fn">print</span>(<span class="str">'root  :'</span>, root.<span class="fn">hex</span>()[:<span class="num">32</span>], <span class="str">'...'</span>)
<span class="fn">print</span>(<span class="str">'proof len :'</span>, <span class="fn">len</span>(proof), <span class="str">'siblings (~ log2(8))'</span>)
<span class="fn">print</span>(<span class="str">'verify    :'</span>, <span class="fn">verify</span>(leaves[idx], proof, root))
</code></pre></div></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>H</code> bağlayıcı hash <code>sha256(b)</code>'dir — agactaki her node ve yaprak 32-byte digest'tir ve her yerde aynı hash kullanmak ağacın collision-resistance'ini SHA-256'nın 128-bit collision tabanına temiz şekilde indirger. 2) <code>merkle_root</code> ağaçta aşağıdan yukarıya yürür: bitişik node'lari eşle <code>(level[i], level[i+1])</code>, sonraki seviyeye hash'le, tek bir kök kalana kadar tekrarla — bu, Bitcoin'in binlerce işlemi tek bir 32-byte header alanına taahhüt etmesini sağlayan klasik Ralph Merkle 1979 yapısıdır. 3) <code>merkle_proof</code> inclusion proof üretir: her seviyede kardeş node'u kaydeder (<code>i ^ 1</code> alt biti çevirip çifti bulur) artı bizim sol mu sağ mı çocuk olduğumuzu gösteren bir taraf bayrağı — tam olarak Certificate Transparency log monitor'larinin ve zkSync rollup'larinin tükettiği proof formatı. 4) <code>verify</code> kökü <code>leaf</code> ve O(log n) kardeş listesinden, kaydedilen yönde hash'leyerek yeniden inşa eder (<code>H(sib + h)</code> sağdaysak, aksi halde <code>H(h + sib)</code>) — 8-yapraklık ağaç için yaprak 5 tam 3 kardeş hash'i ihtiyaç duyar (log2(8)), ve yazdırılan <code>verify : True</code> diğer 7 yaprağı açıklamadan dahil olmayı doğrular.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hash Tabanlı İmzalar ve PQ Köprüsü</h2>
<p class="l-text">Hash'ler, kuantum saldırısından kurtulduğuna koşulsuz olarak inanılan tek kriptografik primitiftir — Grover güvenlik düzeyini yarılar (256 → 128) ancak kırmaz. Bu, hash tabanlı imzaları (Lamport 1979, Merkle'nin ağaç tabanlı varyantları, NIST tarafından 2024'te standartlaştırılan günümüzün SPHINCS+ / SLH-DSA'sı) en muhafazakâr post-kuantum seçim yapar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Lamport tek seferlik imzalar</div><div class="card-body">Hash'in her biti için iki rastgele sır yayınlayın; imza bunlardan birini açığa çıkarır. Tek seferlik — anahtarlar yeniden kullanılmamalıdır. Tarihsel temel.</div></div>
<div class="calc-card"><div class="card-title">Merkle imza ağaçları</div><div class="card-body">Birçok tek seferlik anahtarı bir Merkle ağacı altında birleştirin. Durumlu — hangi yaprakların harcandığını izlemelidir.</div></div>
<div class="calc-card"><div class="card-title">XMSS / LMS</div><div class="card-body">Durumlu hash tabanlı imzalar, NIST SP 800-208. Durum izlemenin uygulanabilir olduğu firmware imzalamada kullanılır.</div></div>
<div class="calc-card"><div class="card-title">SPHINCS+ / SLH-DSA (FIPS 205, 2024)</div><div class="card-body">Durumsuz hash tabanlı imzalar. Büyük (~8-30 KB) ve yavaş ama muhafazakâr olarak güvenli — yalnızca hash özelliklerine güvenir. "Diğer her şey başarısız olursa" PQ imzası.</div></div>
</div>

<p class="l-text">URV'nin CRISES araştırma grubu, özellikle IoT firmware için durumlu imza yönetimi etrafında PQ standardizasyon analizlerine katkıda bulundu. Temel içgörü: hash'ler kriptografın güvenlik ağıdır — sayı-teorik varsayımlar sallandığında, hash tabanlı yapılar hâlâ ayakta kalır.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Hash ve MAC Kodundaki Yaygın Hatalar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kimlik doğrulama için H(k || m)</div><div class="card-body">Uzunluk-uzatma saldırısı. HMAC kullanın. Her zaman.</div></div>
<div class="calc-card"><div class="card-title">Değişken zamanlı etiket karşılaştırma</div><div class="card-body">Python'da <code>tag == expected</code>, C'de <code>memcmp</code>. Her ikisi de bayt başına zamanlama sızdırır. <code>hmac.compare_digest</code> / <code>CRYPTO_memcmp</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">MAC etiketlerini 96 bit altına kısaltma</div><div class="card-body">Sahteleştirme direncini azaltır. NIST HMAC için 96-bit minimuma izin verir; alan kritik olmadıkça 128- veya 256-bit kullanın.</div></div>
<div class="calc-card"><div class="card-title">HMAC ve HKDF için aynı anahtar</div><div class="card-body">Alan-ayrımı başarısızlığı. HKDF-Expand("hmac-key" / "encryption-key") ile alt anahtarlar türetin, yeniden kullanmayın.</div></div>
<div class="calc-card"><div class="card-title">2026'da PBKDF2-100k ile parola hash'leme</div><div class="card-body">2010'dan kalma yineleme sayısı. OWASP şimdi Argon2id m=19MB t=2 öneriyor; PBKDF2 ≥600k yineleme gerektiriyor.</div></div>
<div class="calc-card"><div class="card-title">Hash kullanımları arasında nonce'ları yeniden kullanma</div><div class="card-body">Hem HMAC anahtarı hem de rastgelelik kaynağı olarak aynı değer kullanılır. Her zaman alan-ayrımı yapın.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">Hash'ler bize preimage, ikinci preimage ve çakışma direnci verir — ancak çakışmalar için yalnızca bit uzunluğunun yarısında (doğum günü sınırı). SHA-256 sıkıcı-doğru varsayılandır; SHA-3 / BLAKE3 / SHAKE belirli ihtiyaçlar için modern alternatiflerdir. Kimlik doğrulama için HMAC; parolalar için Argon2id; üyelik kanıtları için Merkle ağaçları; post-kuantum gelecek için muhafazakâr yedek olarak hash tabanlı imzalar (SPHINCS+).</p>

<p class="l-text">Ders 4, inşa ettiğimiz her şeyi — simetrik AEAD (ders 1), asimetrik imzalar (ders 2), parmak izi için hash'ler (ders 3) — alıp <strong>PKI ve TLS 1.3</strong>'e dikiyor: tarayıcınız, <em>o</em> CA tarafından imzalanmış <em>bu</em> X.509 sertifikasının doğru hash'lendiğini ve doğru genel anahtarı doğru ana bilgisayar adına bağladığını nasıl biliyor? Cevap modern internetin tüm iskelesidir.</p>
</div>`
};
