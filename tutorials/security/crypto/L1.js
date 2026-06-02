window.CRYPTO_L1 = {
en: `<p class="l-text"><strong>Symmetric cryptography is the workhorse of the modern internet — every TLS session, every WhatsApp message, every encrypted disk relies on it.</strong> When you load a webpage over HTTPS, your browser and the server perform an asymmetric handshake (covered in lessons 2 and 4) for exactly one reason: to agree on a shared symmetric key. From that point on, gigabytes of traffic flow through AES-128-GCM at speeds of 5–20 GB/s per core thanks to Intel AES-NI and ARM Cryptography Extensions. Asymmetric crypto is the diplomat; symmetric crypto is the freight train. Get the freight train wrong and the diplomat's careful handshake is worthless.</p>

<p class="l-text">In this first lesson we walk the AES family from the inside out: the Rijndael block cipher Joan Daemen and Vincent Rijmen submitted to NIST in 1998 and which became FIPS 197 in 2001, the four classical modes (ECB, CBC, CTR, GCM) and why three of them are footguns waiting to fire, the role of padding, the catastrophic damage caused by IV reuse in CTR and GCM, and the AEAD principle that frames everything in modern crypto APIs (libsodium, AWS Encryption SDK, Tink). By the end you will know <em>which</em> AES variant to call, with <em>which</em> mode, with <em>which</em> nonce strategy, and you will be able to spot a CBC bit-flipping attack in a code review.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Walk the AES round structure: SubBytes, ShiftRows, MixColumns, AddRoundKey across 10/12/14 rounds</li>
<li>Pick the right mode — ECB never, CBC rarely, CTR often, GCM almost always</li>
<li>Quantify why IV reuse breaks CTR and GCM catastrophically (key recovery in GCM)</li>
<li>Apply AEAD: encrypt and authenticate in one primitive, attach associated data correctly</li>
<li>Implement PKCS#7 padding and recognise CBC padding-oracle attacks (Vaudenay 2002)</li>
<li>Estimate AES-256 post-quantum security: Grover halves it to 128 bits, still safe</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Rijndael Story and What "AES" Actually Is</h2>
<p class="l-text">In January 1997 NIST opened a public competition to replace the aging DES (56-bit key, broken by EFF's Deep Crack in 22 hours in 1998). Fifteen ciphers were submitted, five made the final round (MARS, RC6, Rijndael, Serpent, Twofish), and on October 2nd 2000 NIST announced Rijndael as the winner. Two Belgian cryptographers, Joan Daemen and Vincent Rijmen, had built it explicitly for hardware efficiency, side-channel resistance, and a clean algebraic structure over GF(2^8). It became FIPS 197 in November 2001 and is now the dominant cipher on Earth — every modern CPU has dedicated instructions for it (Intel AES-NI shipped 2010).</p>

<p class="l-text">"AES" is a 128-bit block cipher with three key sizes: 128, 192, 256 bits. The block size is fixed at 128 bits (16 bytes). The number of rounds depends on the key: 10 for AES-128, 12 for AES-192, 14 for AES-256. Rijndael as originally defined supports more block and key sizes, but NIST chose only this subset for AES. When someone says "AES" without qualification they almost always mean AES-128 in some mode.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AES-128</div><div class="card-body">10 rounds, 128-bit key, 128-bit block. Fastest. Default for TLS 1.3, WireGuard, Signal. Classical security ~128 bits, post-quantum ~64 bits (Grover). Still considered safe for ~all practical scenarios through 2040.</div></div>
<div class="calc-card"><div class="card-title">AES-192</div><div class="card-body">12 rounds. Rarely used outside US government CNSA Suite B. ~30% slower than AES-128 with marginal security benefit. Skip it unless a contract demands it.</div></div>
<div class="calc-card"><div class="card-title">AES-256</div><div class="card-body">14 rounds, 256-bit key. ~40% slower than AES-128. Required by US TOP SECRET / EU RESTRICTED. Post-quantum security ~128 bits (Grover halves the search). Recommended whenever the data has a long retention horizon ("harvest now, decrypt later").</div></div>
<div class="calc-card"><div class="card-title">Block size</div><div class="card-body">Always 128 bits = 16 bytes. Limits a single key+nonce stream to about 2^64 blocks before birthday collisions become real. For high-throughput links (>1 PB) you must rotate keys.</div></div>
</div>

<div class="calc-highlight"><strong>Practical takeaway:</strong> "AES-128-GCM" or "AES-256-GCM" with a 96-bit random nonce per message is the right answer 95% of the time. ChaCha20-Poly1305 is the equally valid alternative when you need software speed without AES-NI.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The AES Round — SubBytes, ShiftRows, MixColumns, AddRoundKey</h2>
<p class="l-text">A single AES round transforms a 4×4 byte state matrix through four operations. <strong>SubBytes</strong> applies the AES S-box (a non-linear substitution table) to every byte — this is where confusion in the Shannon sense is injected. <strong>ShiftRows</strong> rotates each row by a different amount (0, 1, 2, 3) — diffusing bytes horizontally. <strong>MixColumns</strong> multiplies each column by a fixed matrix in GF(2^8) — diffusing vertically. <strong>AddRoundKey</strong> XORs in a round-specific key derived from the master key by the key schedule. The first round skips MixColumns at the end, and the last round skips MixColumns entirely; otherwise rounds are uniform.</p>

<div class="katex-block">$$\\text{state}_{i+1} = \\text{AddRoundKey}_i \\circ \\text{MixColumns} \\circ \\text{ShiftRows} \\circ \\text{SubBytes}(\\text{state}_i)$$</div>

<p class="l-text">The S-box is the heart of AES. It is constructed from the multiplicative inverse in GF(2^8) followed by an affine transformation, giving high non-linearity (resistance to linear cryptanalysis, lesson 9) and a clean algebraic description that makes side-channel-hardened implementations possible. The key schedule expands the original 16/24/32-byte key into 11/13/15 round keys via a recursive XOR with rotated and S-box-substituted words plus round constants.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Tiny educational AES building blocks — not production!</span>
<span class="cm"># We implement SubBytes on a 4-byte toy state to see the S-box in action.</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Pre-computed AES S-box (256 entries, official FIPS 197 values, abbreviated here)</span>
SBOX = [
 0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
 0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
 <span class="cm"># ... full 256-byte table omitted for brevity</span>
]

<span class="kw">def</span> <span class="fn">sub_bytes_demo</span>(state_bytes):
    <span class="kw">return</span> <span class="fn">bytes</span>(SBOX[b] <span class="kw">if</span> b &lt; <span class="fn">len</span>(SBOX) <span class="kw">else</span> b <span class="kw">for</span> b <span class="kw">in</span> state_bytes)

state = <span class="fn">bytes</span>([0x32, 0x88, 0x31, 0xe0])
<span class="fn">print</span>(<span class="str">'input  :'</span>, state.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'S-box  :'</span>, <span class="fn">sub_bytes_demo</span>(state).<span class="fn">hex</span>())
<span class="cm"># Notice: 0x32 -&gt; 0x23, 0x88 -&gt; 0xc4, 0x31 -&gt; 0xc7, 0xe0 -&gt; 0xe1 (look up in real S-box)</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Hard-codes the first 32 entries of the FIPS 197 AES S-box — the full 256-byte table is omitted but every byte from 0x63 to 0xc0 here matches the official Rijndael substitution. 2) <code>sub_bytes_demo</code> performs the SubBytes step of one AES round: each input byte indexes the S-box (<code>SBOX[b]</code>) so the lookup is a pure non-linear substitution — this is where Shannon "confusion" is injected, and on real silicon AES-NI's <code>aesenc</code> does it in a single instruction. 3) The 4-byte test state <code>0x32 0x88 0x31 0xe0</code> is the canonical example from the FIPS 197 reference and walks through the S-box lookup; the trailing comment lists the official outputs (0x23, 0xc4, 0xc7, 0xe1) so you can sanity-check against the spec. 4) Printing input and S-box output side-by-side highlights that AES SubBytes is purely a stateless byte→byte map — no key involved at this step — which is why it can be replaced by a 256-byte table or by the GF(2^8) inverse + affine formula in constant-time implementations.</p>

<p class="l-text">Above is a deliberate stub — the full 256-byte S-box is on every AES reference page. The point is the shape: AES is a sequence of byte-level table lookups and XORs, which is exactly why it maps to silicon so cleanly. Intel AES-NI executes one round in a single instruction (<code>aesenc</code>) and a full AES-128 encryption in ~40 cycles.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy round on a 4-byte state — XOR with a "round key" then a fake S-box (squaring mod 251). It is not AES, but it captures the SubBytes + AddRoundKey rhythm in 12 lines.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

state = np.<span class="fn">array</span>([0x32, 0x88, 0x31, 0xe0], dtype=np.uint8)
key   = np.<span class="fn">array</span>([0x2b, 0x7e, 0x15, 0x16], dtype=np.uint8)

<span class="cm"># Round = AddRoundKey then a stand-in S-box (b -&gt; (b*b) mod 251)</span>
<span class="kw">def</span> <span class="fn">toy_round</span>(s, k):
    s = s ^ k                              <span class="cm"># AddRoundKey</span>
    s = np.<span class="fn">array</span>([(<span class="fn">int</span>(b)*<span class="fn">int</span>(b)) % <span class="num">251</span> <span class="kw">for</span> b <span class="kw">in</span> s], dtype=np.uint8)  <span class="cm"># toy S-box</span>
    <span class="kw">return</span> s

<span class="fn">print</span>(<span class="str">'start :'</span>, state.<span class="fn">tolist</span>())
<span class="kw">for</span> r <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    state = <span class="fn">toy_round</span>(state, key)
    <span class="fn">print</span>(f<span class="str">'round {r+1}:'</span>, state.<span class="fn">tolist</span>())
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up a 4-byte <code>state</code> and a 4-byte <code>key</code> as uint8 NumPy arrays — uint8 matters because XOR semantics in real AES are byte-modular (any overflow would silently corrupt the round). 2) <code>toy_round</code> applies <em>AddRoundKey</em> via the plain <code>state ^ key</code> XOR — this is exactly the operation real AES performs on its 128-bit state with each of the 11/13/15 expanded round keys. 3) After AddRoundKey, the toy S-box <code>b → (b*b) mod 251</code> stands in for SubBytes; the real AES S-box uses the multiplicative inverse in GF(2^8) plus an affine map, but the demo's squaring captures the key property — every byte transforms non-linearly and independently. 4) Looping 3 rounds prints how the state evolves; in real AES the same shape iterates 10/12/14 times (depending on key size) with ShiftRows + MixColumns interleaved to add diffusion, but the AddRoundKey + S-box rhythm shown here is the inner loop on every modern CPU's <code>aesenc</code> instruction.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ECB — The Mode That Should Not Exist</h2>
<p class="l-text">Electronic Codebook is the simplest mode: split plaintext into 16-byte blocks, encrypt each independently with the same key. It is also catastrophically broken for any real data, because identical plaintext blocks produce identical ciphertext blocks. The famous "ECB Tux" image — a Linux mascot encrypted with AES-ECB where you can still see the penguin — is the canonical illustration. Any structured data (filesystems, database rows, image bitmaps) leaks through ECB.</p>

<div class="calc-highlight"><strong>The ECB rule:</strong> if the next sentence in your code review is "we use AES-ECB because it is simpler", stop the review. There is no scenario where ECB is the right choice. Use GCM. Or CTR. Or CBC if you must. Never ECB.</div>

<p class="l-text">ECB has one legitimate use case: encrypting a single block of exactly 16 bytes (e.g. wrapping a key with itself, where AES-KW is preferred anyway). For anything longer, ECB leaks the equality pattern of plaintext blocks, which in practice means it leaks structure, which in practice means it leaks the message.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Demonstrating ECB pattern leakage on synthetic structured data.</span>
<span class="cm"># In Pyodide we use a stand-in cipher (block xor with a key) to show the</span>
<span class="cm"># information-theoretic point — the same structure leaks no matter how strong AES is.</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np

KEY = np.<span class="fn">array</span>([0xa3, 0x55, 0xcc, 0x77], dtype=np.uint8)

<span class="kw">def</span> <span class="fn">toy_ecb_encrypt</span>(plaintext, key):
    out = <span class="fn">bytearray</span>(<span class="fn">len</span>(plaintext))
    bs = <span class="fn">len</span>(key)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(plaintext), bs):
        block = plaintext[i:i+bs]
        <span class="kw">for</span> j, b <span class="kw">in</span> <span class="fn">enumerate</span>(block):
            out[i+j] = b ^ <span class="fn">int</span>(key[j % bs])
    <span class="kw">return</span> <span class="fn">bytes</span>(out)

<span class="cm"># Two identical 4-byte rows -&gt; identical ciphertext rows: pattern leaks.</span>
plaintext = b<span class="str">'AAAA'</span> + b<span class="str">'BBBB'</span> + b<span class="str">'AAAA'</span> + b<span class="str">'CCCC'</span>
ct = <span class="fn">toy_ecb_encrypt</span>(plaintext, KEY)
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(ct), <span class="num">4</span>):
    <span class="fn">print</span>(f<span class="str">'block {i//4}: pt={plaintext[i:i+4]!r}  ct={ct[i:i+4].hex()}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a 4-byte key and a <code>toy_ecb_encrypt</code> that XORs every 4-byte block of plaintext with the same fixed key — the toy stands in for AES but reproduces the defining property of ECB: each block is encrypted independently with the same key and no IV. 2) Constructs <code>plaintext = b'AAAA' + b'BBBB' + b'AAAA' + b'CCCC'</code> with two identical "AAAA" blocks at positions 0 and 2 — the literal data used to expose ECB's pattern leak. 3) The encryption loop steps in 4-byte windows and XORs each byte with <code>key[j % bs]</code>; because the function is deterministic and stateless, blocks 0 and 2 produce byte-identical ciphertext — the very leak that turned the Linux Tux mascot into a still-recognizable image under real AES-ECB. 4) The for-loop printout shows <code>block 0</code> and <code>block 2</code> sharing the same hex ciphertext, while blocks 1 and 3 differ — a visual proof that ECB encrypts the equality pattern of blocks even when the underlying cipher is information-theoretically strong, which is why CBC, CTR, and GCM all chain or counter to destroy this leak.</p>

<p class="l-text">Notice block 0 and block 2 produce the same ciphertext bytes. With real AES-ECB on a 1 MB image, this becomes a posterized version of the original. The fix is to make every block depend on previous ones (CBC) or to derive a unique keystream per block (CTR/GCM).</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. CBC — Chaining Blocks, Padding, and the Vaudenay Attack</h2>
<p class="l-text">Cipher Block Chaining XORs each plaintext block with the previous ciphertext block before encryption. The first block is XORed with a public Initialization Vector (IV) chosen randomly per message. This kills the ECB pattern leak — identical plaintext blocks now encrypt to different ciphertexts because their predecessors differ.</p>

<div class="katex-block">$$C_i = E_K(P_i \\oplus C_{i-1}), \\quad C_0 = E_K(P_0 \\oplus IV)$$</div>

<p class="l-text">CBC needs the plaintext length to be a multiple of 16 bytes. <strong>PKCS#7 padding</strong> appends N bytes of value N where N is the number of bytes needed (1 to 16; if the message is already a multiple of 16, a full padding block of 0x10 0x10 ... 0x10 is added, so decoding is unambiguous). Decryption strips the padding. If the padding is malformed, the receiver returns an error — and that error is the seed of the most famous attack on CBC.</p>

<p class="l-text"><strong>Vaudenay's padding-oracle attack (2002)</strong>: if an attacker can submit ciphertexts and learn whether padding was valid (e.g. via a different error message or a timing difference), they can decrypt arbitrary CBC-encrypted data byte-by-byte without the key. This is not theoretical — POODLE (2014) broke SSL 3.0 over the web with this exact technique, and Lucky Thirteen (2013) revived a timing variant against TLS 1.0. The fix in modern protocols: never tell the attacker about padding, and prefer AEAD modes that authenticate before decrypting.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CBC pros</div><div class="card-body">Simple, parallel decryption (each block depends only on the previous one), well-studied. Hardware support universal.</div></div>
<div class="calc-card"><div class="card-title">CBC cons</div><div class="card-body">Sequential encryption (cannot parallelize). Padding-oracle attacks. No built-in authentication — must combine with HMAC ("Encrypt-then-MAC"). IV must be unpredictable, not just unique.</div></div>
<div class="calc-card"><div class="card-title">CBC bit-flip</div><div class="card-body">Flipping bit b in C_{i-1} flips bit b in plaintext block P_i (and scrambles P_{i-1}). Without authentication, attackers can rewrite specific bits of known-position plaintext.</div></div>
<div class="calc-card"><div class="card-title">When to use</div><div class="card-body">Legacy systems, FIPS-restricted environments where AES-CBC + HMAC-SHA-256 is the only allowed combo. New code: skip CBC, go GCM.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CTR — Stream Cipher From a Block Cipher, and the IV-Reuse Cliff</h2>
<p class="l-text">Counter mode turns AES into a stream cipher. Encrypt successive integers (a counter starting at IV) and XOR the resulting keystream with the plaintext. CTR is fully parallel (every block independent), needs no padding (any byte length works), and is conceptually simple.</p>

<div class="katex-block">$$C_i = P_i \\oplus E_K(\\text{nonce} \\,\\|\\, i), \\quad i = 0, 1, 2, \\ldots$$</div>

<p class="l-text">The catch: if you ever encrypt two different messages with the same (key, nonce) pair, you have produced the same keystream twice, and the attacker who XORs the two ciphertexts gets P1 XOR P2 — the keystream cancels. From there, classical crib-dragging recovers both plaintexts. This is what destroyed WEP (Wi-Fi Protected Privacy, 2001), where a 24-bit IV collided after a few thousand packets on a busy network. Modern CTR uses a 96-bit random nonce per message, giving negligible birthday collision probability up to ~2^32 messages per key.</p>

<div class="calc-highlight"><strong>The CTR / GCM commandment:</strong> never reuse a (key, nonce) pair. Either use a counter you durably increment, or a 96-bit random value per message. If you cannot guarantee uniqueness, switch to AES-GCM-SIV or use a fresh key per message.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># IV reuse in CTR -&gt; XOR of plaintexts leaks. Demonstrated with a fake stream cipher.</span>
<span class="kw">import</span> os, hashlib

<span class="kw">def</span> <span class="fn">keystream</span>(key, nonce, length):
    out = <span class="fn">bytearray</span>()
    counter = <span class="num">0</span>
    <span class="kw">while</span> <span class="fn">len</span>(out) &lt; length:
        block = hashlib.<span class="fn">sha256</span>(key + nonce + counter.<span class="fn">to_bytes</span>(<span class="num">8</span>, <span class="str">'big'</span>)).<span class="fn">digest</span>()
        out += block
        counter += <span class="num">1</span>
    <span class="kw">return</span> <span class="fn">bytes</span>(out[:length])

<span class="kw">def</span> <span class="fn">ctr_encrypt</span>(key, nonce, plaintext):
    ks = <span class="fn">keystream</span>(key, nonce, <span class="fn">len</span>(plaintext))
    <span class="kw">return</span> <span class="fn">bytes</span>(p ^ k <span class="kw">for</span> p, k <span class="kw">in</span> <span class="fn">zip</span>(plaintext, ks))

key   = b<span class="str">'super_secret_key'</span>
nonce = b<span class="str">'reused_nonce_AAA'</span>   <span class="cm"># BUG: same nonce for both messages!</span>

m1 = b<span class="str">'transfer 100 USD to Alice'</span>
m2 = b<span class="str">'transfer 999 USD to Eve  '</span>

c1 = <span class="fn">ctr_encrypt</span>(key, nonce, m1)
c2 = <span class="fn">ctr_encrypt</span>(key, nonce, m2)

<span class="cm"># Attacker XORs ciphertexts -&gt; recovers m1 XOR m2 with no key knowledge:</span>
leak = <span class="fn">bytes</span>(a ^ b <span class="kw">for</span> a, b <span class="kw">in</span> <span class="fn">zip</span>(c1, c2))
<span class="fn">print</span>(<span class="str">'m1 XOR m2 (recovered without key) :'</span>, leak)
<span class="fn">print</span>(<span class="str">'m1 XOR m2 (ground truth)          :'</span>, <span class="fn">bytes</span>(a^b <span class="kw">for</span> a,b <span class="kw">in</span> <span class="fn">zip</span>(m1,m2)))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>keystream(key, nonce, length)</code> stands in for AES-CTR by hashing <code>key || nonce || counter</code> with SHA-256 and concatenating digests — what matters is the property: a deterministic byte stream uniquely determined by the (key, nonce) pair, exactly like real CTR mode. 2) <code>ctr_encrypt</code> XORs the keystream against the plaintext — this single XOR is everything CTR does, which is why CTR turns a block cipher into a stream cipher and why ciphertext length always equals plaintext length (no padding). 3) The bug is on the <code>nonce = b'reused_nonce_AAA'</code> line: both <code>m1</code> and <code>m2</code> are encrypted under the same (key, nonce) and therefore share the same keystream — exactly the WEP / IEEE 802.11i 2001 disaster condition. 4) The attacker computes <code>c1 ⊕ c2</code> and gets <code>m1 ⊕ m2</code> with no key knowledge because the shared keystream cancels — the printed lines show the recovered XOR equals the ground-truth plaintext XOR, after which crib-dragging on the visible "transfer " prefix peels out both messages and demonstrates why GCM-SIV or fresh-key-per-message is non-negotiable when nonce uniqueness cannot be guaranteed.</p>

<p class="l-text">The two outputs match. Once attackers have m1 XOR m2 they apply statistical attacks on the XOR (English letter frequencies, known headers like "transfer ") to peel off both plaintexts. This is why GCM tracks nonces obsessively and why misuse-resistant variants (GCM-SIV, deterministic AEAD) exist.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. GCM and the AEAD Principle</h2>
<p class="l-text">Galois/Counter Mode (NIST SP 800-38D, 2007) is CTR plus an authentication tag computed via GHASH (a polynomial hash over GF(2^128)). It produces both confidentiality and integrity in one pass and is the default symmetric mode in TLS 1.3, WireGuard, IPsec, and almost every modern protocol. AES-GCM hardware throughput on a 2024 Ice Lake server core exceeds 50 Gbps.</p>

<p class="l-text"><strong>AEAD</strong> = Authenticated Encryption with Associated Data. The primitive takes (key, nonce, plaintext, AD) and produces (ciphertext, tag). The associated data is authenticated but not encrypted — perfect for protocol headers (sequence numbers, IP addresses) that must remain readable but tamper-proof. Decryption verifies the tag <em>before</em> returning plaintext: no padding oracle, no bit-flip attack, no malleability. This single design pattern eliminates an entire class of bugs that plagued the 2000s.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inputs</div><div class="card-body">Key (16/32 bytes), nonce (12 bytes recommended), plaintext (any length), associated data (any length).</div></div>
<div class="calc-card"><div class="card-title">Outputs</div><div class="card-body">Ciphertext (same length as plaintext), 16-byte authentication tag. Together they are unforgeable without the key.</div></div>
<div class="calc-card"><div class="card-title">Tag verification</div><div class="card-body">Constant-time comparison. Reject before decrypting. A single bit flip in the ciphertext causes the tag to fail with overwhelming probability (~2^{-128}).</div></div>
<div class="calc-card"><div class="card-title">Catastrophic failure mode</div><div class="card-body">If a (key, nonce) pair repeats, attackers can recover the GHASH key H from two ciphertext-tag pairs and forge arbitrary messages. This is worse than CTR reuse.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Conceptual AEAD shape — encrypt + tag, verify before decrypting.</span>
<span class="cm"># Real AES-GCM uses GHASH; here we use HMAC-SHA-256 over (nonce || ad || ct) as a stand-in.</span>
<span class="kw">import</span> os, hmac, hashlib

<span class="kw">def</span> <span class="fn">aead_encrypt</span>(key, nonce, plaintext, ad):
    <span class="cm"># encrypt with our toy CTR from section 5 (omitted here for brevity)</span>
    ct = <span class="fn">bytes</span>(p ^ k <span class="kw">for</span> p, k <span class="kw">in</span> <span class="fn">zip</span>(plaintext, hashlib.<span class="fn">sha256</span>(key + nonce).<span class="fn">digest</span>() * <span class="num">4</span>))
    tag = hmac.<span class="fn">new</span>(key, nonce + ad + ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]
    <span class="kw">return</span> ct, tag

<span class="kw">def</span> <span class="fn">aead_decrypt</span>(key, nonce, ct, tag, ad):
    expected = hmac.<span class="fn">new</span>(key, nonce + ad + ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]
    <span class="kw">if</span> <span class="kw">not</span> hmac.<span class="fn">compare_digest</span>(tag, expected):
        <span class="kw">raise</span> <span class="fn">ValueError</span>(<span class="str">'tag verification failed — message tampered'</span>)
    <span class="kw">return</span> <span class="fn">bytes</span>(c ^ k <span class="kw">for</span> c, k <span class="kw">in</span> <span class="fn">zip</span>(ct, hashlib.<span class="fn">sha256</span>(key + nonce).<span class="fn">digest</span>() * <span class="num">4</span>))

key, nonce, ad = os.<span class="fn">urandom</span>(<span class="num">32</span>), os.<span class="fn">urandom</span>(<span class="num">12</span>), b<span class="str">'protocol-header-v1'</span>
ct, tag = <span class="fn">aead_encrypt</span>(key, nonce, b<span class="str">'attack at dawn'</span>, ad)
<span class="fn">print</span>(<span class="str">'ct  :'</span>, ct.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'tag :'</span>, tag.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'dec :'</span>, <span class="fn">aead_decrypt</span>(key, nonce, ct, tag, ad))
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) Imports AESGCM from the cryptography library — authenticated encryption (AEAD) that gives confidentiality + integrity in one call. 2) Generates a 256-bit key via os.urandom, which on Linux pulls from getrandom() / /dev/urandom (CSPRNG). 3) Builds a 96-bit nonce (NIST SP 800-38D minimum for GCM); it must be unique per key — never reuse, or the GHASH authentication subkey leaks. 4) encrypt(nonce, plaintext, aad) returns ciphertext with a 16-byte tag appended; on decrypt, a tag mismatch raises InvalidTag — the canonical signal of tampering or wrong key.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Choosing a Mode in 2026</h2>
<p class="l-text">A short flowchart for your next code review:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Default</div><div class="card-body"><strong>AES-256-GCM</strong> with random 96-bit nonce per message. Max 2^32 messages per key (then rotate). Pass protocol headers as associated data.</div></div>
<div class="calc-card"><div class="card-title">No AES-NI hardware</div><div class="card-body"><strong>ChaCha20-Poly1305</strong> (RFC 8439). 3x faster than AES in pure software on ARM Cortex-A53, used by WireGuard and TLS 1.3 fallback.</div></div>
<div class="calc-card"><div class="card-title">Cannot guarantee unique nonce</div><div class="card-body"><strong>AES-GCM-SIV</strong> (RFC 8452). Misuse-resistant — repeating a nonce only leaks message equality, not the key. Slightly slower.</div></div>
<div class="calc-card"><div class="card-title">Disk encryption</div><div class="card-body"><strong>AES-XTS</strong> (IEEE 1619) for sector-level encryption (LUKS, BitLocker, FileVault). Not AEAD — confidentiality only — because there is no room for a tag per sector.</div></div>
<div class="calc-card"><div class="card-title">Streaming long files</div><div class="card-body"><strong>STREAM construction</strong> over GCM (Hoang-Reyhanitabar-Rogaway-Vizár 2015). Splits files into chunks with chained nonces; libsodium's secretstream is the canonical implementation.</div></div>
<div class="calc-card"><div class="card-title">Post-quantum bridge</div><div class="card-body">AES-256 is fine — Grover only halves the security, leaving 128-bit. The PQ migration (lesson 8) targets asymmetric primitives, not symmetric ones.</div></div>
</div>

<div class="calc-highlight"><strong>URV CRISES note:</strong> Domingo-Ferrer's group has long advocated AEAD as a foundation for privacy-preserving statistical computation: every statistic released over an encrypted database should ride on an authenticated channel, otherwise tampered queries can leak the underlying records. AEAD is not just an internet-protocol detail — it is the ground floor of any secure analytics pipeline.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Hands-On — End-to-End AES-GCM in 30 Lines</h2>
<p class="l-text">Putting it together. In production you would call <code>cryptography.hazmat.primitives.ciphers.aead.AESGCM</code> (pyca/cryptography) or libsodium's <code>crypto_aead_aes256gcm</code>. The code below shows the conceptual structure.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">A toy AEAD round-trip plus a tampering test. The XOR keystream is a stand-in for AES-CTR; the HMAC-SHA-256 tag is a stand-in for GMAC. The control flow is exactly what real AES-GCM does.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os, hmac, hashlib

<span class="kw">def</span> <span class="fn">keystream</span>(key, nonce, n):
    out = <span class="fn">bytearray</span>()
    ctr = <span class="num">0</span>
    <span class="kw">while</span> <span class="fn">len</span>(out) &lt; n:
        out += hashlib.<span class="fn">sha256</span>(key + nonce + ctr.<span class="fn">to_bytes</span>(<span class="num">8</span>, <span class="str">'big'</span>)).<span class="fn">digest</span>()
        ctr += <span class="num">1</span>
    <span class="kw">return</span> <span class="fn">bytes</span>(out[:n])

<span class="kw">def</span> <span class="fn">aead_encrypt</span>(key, nonce, pt, ad):
    ct  = <span class="fn">bytes</span>(p ^ k <span class="kw">for</span> p, k <span class="kw">in</span> <span class="fn">zip</span>(pt, <span class="fn">keystream</span>(key, nonce, <span class="fn">len</span>(pt))))
    tag = hmac.<span class="fn">new</span>(key, nonce + ad + ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]
    <span class="kw">return</span> ct, tag

<span class="kw">def</span> <span class="fn">aead_decrypt</span>(key, nonce, ct, tag, ad):
    <span class="kw">if</span> <span class="kw">not</span> hmac.<span class="fn">compare_digest</span>(tag, hmac.<span class="fn">new</span>(key, nonce+ad+ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]):
        <span class="kw">raise</span> <span class="fn">ValueError</span>(<span class="str">'AUTH FAIL'</span>)
    <span class="kw">return</span> <span class="fn">bytes</span>(c ^ k <span class="kw">for</span> c, k <span class="kw">in</span> <span class="fn">zip</span>(ct, <span class="fn">keystream</span>(key, nonce, <span class="fn">len</span>(ct))))

key, nonce, ad = os.<span class="fn">urandom</span>(<span class="num">32</span>), os.<span class="fn">urandom</span>(<span class="num">12</span>), b<span class="str">'header-v1'</span>
ct, tag = <span class="fn">aead_encrypt</span>(key, nonce, b<span class="str">'transfer 100 USD to Alice'</span>, ad)
<span class="fn">print</span>(<span class="str">'decrypt OK :'</span>, <span class="fn">aead_decrypt</span>(key, nonce, ct, tag, ad))

<span class="cm"># Tamper one byte of ciphertext -&gt; tag verification fails:</span>
bad = <span class="fn">bytearray</span>(ct); bad[<span class="num">0</span>] ^= 0x01
<span class="kw">try</span>:
    <span class="fn">aead_decrypt</span>(key, nonce, <span class="fn">bytes</span>(bad), tag, ad)
<span class="kw">except</span> ValueError <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">'tampering detected:'</span>, e)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>keystream</code> + <code>aead_encrypt</code> together model AES-GCM's CTR pass — encrypt the plaintext by XOR with a SHA-256-driven keystream and then compute an HMAC-SHA-256 tag over <code>nonce || ad || ct</code>; real GCM uses GHASH over GF(2^128) for the tag and the AES round function for the keystream, but the input contract (key + nonce + ad + ct → tag) is identical. 2) <code>aead_decrypt</code> first recomputes the tag and compares with <code>hmac.compare_digest</code> — constant-time comparison that prevents timing side channels of the kind that broke Lucky Thirteen against TLS 1.0's CBC-then-HMAC. 3) <code>os.urandom(32)</code> + <code>os.urandom(12)</code> generate a 256-bit key and a 96-bit nonce from the OS CSPRNG — the same 12-byte nonce length NIST SP 800-38D recommends for AES-GCM so the nonce can be carried alongside the ciphertext without extension. 4) The <code>bad[0] ^= 0x01</code> bit-flip simulates an active attacker; the recomputed tag no longer matches the stored one, so <code>compare_digest</code> rejects and <code>aead_decrypt</code> raises <code>ValueError</code> before any plaintext is returned — the "verify-before-decrypt" property that eliminates padding-oracle and bit-flip attacks on real AEAD channels.</p>

<p class="l-text">Run it. The decryption succeeds for the original ciphertext and raises AUTH FAIL on a single flipped bit. That property — <em>any</em> tampering produces a verification failure with overwhelming probability — is what makes AEAD the right primitive for almost every encrypted channel on the internet.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Common Bugs You Will See in Code Review</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Static IV / hardcoded nonce</div><div class="card-body">"const NONCE = b'000000000000'" — every message uses the same nonce. CTR/GCM: instant break. Search every repo for hex/byte literals near AES.</div></div>
<div class="calc-card"><div class="card-title">ECB used "for performance"</div><div class="card-body">Never. The ~5% throughput gain over CBC is irrelevant; AES-GCM is faster than ECB on hardware anyway thanks to AES-NI pipelining.</div></div>
<div class="calc-card"><div class="card-title">CBC without HMAC</div><div class="card-body">Confidentiality without integrity. Bit-flip attacks, padding oracles. If you must use CBC: Encrypt-then-MAC with HMAC-SHA-256 over IV+ciphertext, not Mac-then-Encrypt.</div></div>
<div class="calc-card"><div class="card-title">Tag truncation</div><div class="card-body">"To save bandwidth we use 64-bit tags" — halves the forgery resistance. NIST allows 96-bit minimum; use 128-bit unless a strict standard demands otherwise.</div></div>
<div class="calc-card"><div class="card-title">Key derivation skipped</div><div class="card-body">Passing a password directly as a 16-byte key. Use HKDF (RFC 5869) for context separation or Argon2id for password-based keys (lesson 3).</div></div>
<div class="calc-card"><div class="card-title">Variable-time tag compare</div><div class="card-body">Using <code>==</code> instead of <code>hmac.compare_digest</code>. Timing leaks one byte at a time. Always constant-time compare.</div></div>
</div>

<div class="calc-highlight"><strong>Capstone preview (lesson 10):</strong> the last item — variable-time comparison — is the bridge to side-channel attacks. Even a "perfect" AES implementation can leak its key if the surrounding code is timing-sensitive. Cryptography is a system property, not a primitive property.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">AES is the symmetric workhorse: 128-bit blocks, 10/12/14 rounds, 5–20 GB/s on modern CPUs. The mode you wrap it in matters more than the key size you pick. ECB never. CBC only with authentication and constant-time padding handling. CTR and GCM only with unique nonces. AEAD (GCM, ChaCha20-Poly1305, GCM-SIV) is the default for new code: confidentiality + integrity in one primitive, with associated data for protocol headers. Hardware acceleration (AES-NI, ARM CryptoExt) makes AES-256-GCM essentially free for almost every workload.</p>

<p class="l-text">Lesson 2 jumps to asymmetric cryptography — the diplomat that delivers the symmetric key in the first place. We will see why RSA-2048 is barely-enough today and why elliptic curves replaced it for new protocols. Lesson 3 covers the integrity side — hashes and MACs — and lesson 4 builds those primitives into PKI. By lesson 8 we will revisit AES-256 to confirm it survives the post-quantum transition while RSA does not.</p>
</div>`,
tr: `<p class="l-text"><strong>Simetrik kriptografi modern internetin iş atıdır — her TLS oturumu, her WhatsApp mesajı, her şifrelenmiş disk ona dayanır.</strong> Bir web sayfasını HTTPS üzerinden yüklediğinizde, tarayıcınız ve sunucu tek bir nedenle asimetrik bir el sıkışma (2. ve 4. derslerde işlenir) yapar: paylaşılan bir simetrik anahtar üzerinde anlaşmak. O noktadan itibaren gigabaytlarca trafik, Intel AES-NI ve ARM Cryptography Extensions sayesinde çekirdek başına 5–20 GB/s hızlarda AES-128-GCM üzerinden akar. Asimetrik kripto diplomattır; simetrik kripto yük trenidir. Yük trenini yanlış yaparsanız, diplomatın özenli el sıkışması beş para etmez.</p>

<p class="l-text">Bu ilk derste AES ailesini içten dışa yürüyoruz: Joan Daemen ve Vincent Rijmen'in 1998'de NIST'e sunduğu ve 2001'de FIPS 197 olan Rijndael blok şifresi, dört klasik mod (ECB, CBC, CTR, GCM) ve bunların üçünün neden patlamayı bekleyen ayak silahları olduğu, padding'in rolü, CTR ve GCM'de IV yeniden kullanımının yol açtığı yıkıcı hasar, ve modern kripto API'lerinde (libsodium, AWS Encryption SDK, Tink) her şeyi çerçeveleyen AEAD ilkesi. Sonunda <em>hangi</em> AES varyantını, <em>hangi</em> mod ile, <em>hangi</em> nonce stratejisiyle çağıracağınızı bileceksiniz ve bir kod incelemesinde CBC bit-flip saldırısını fark edebileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>AES round yapısını adımlayın: 10/12/14 round boyunca SubBytes, ShiftRows, MixColumns, AddRoundKey</li>
<li>Doğru modu seçin — ECB asla, CBC nadiren, CTR sıkça, GCM neredeyse her zaman</li>
<li>IV yeniden kullanımının CTR ve GCM'yi neden yıkıcı şekilde kırdığını sayısallaştırın (GCM'de anahtar kurtarma)</li>
<li>AEAD uygulayın: tek bir primitifte şifreleyin ve doğrulayın, ilişkili veriyi doğru şekilde ekleyin</li>
<li>PKCS#7 padding uygulayın ve CBC padding-oracle saldırılarını tanıyın (Vaudenay 2002)</li>
<li>AES-256 post-kuantum güvenliğini tahmin edin: Grover bunu 128 bite yarılar, hâlâ güvenli</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Rijndael Hikâyesi ve "AES" Aslında Nedir</h2>
<p class="l-text">Ocak 1997'de NIST, yaşlanan DES'i (56 bit anahtar, 1998'de EFF'in Deep Crack'i tarafından 22 saatte kırıldı) değiştirmek için kamuya açık bir yarışma başlattı. On beş şifre sunuldu, beşi finale kaldı (MARS, RC6, Rijndael, Serpent, Twofish) ve 2 Ekim 2000'de NIST kazananı Rijndael olarak duyurdu. İki Belçikalı kriptograf, Joan Daemen ve Vincent Rijmen, onu açıkça donanım verimliliği, yan-kanal direnci ve GF(2^8) üzerinde temiz bir cebirsel yapı için inşa etmişti. Kasım 2001'de FIPS 197 oldu ve şimdi yeryüzündeki baskın şifredir — her modern CPU'nun bunun için özel komutları vardır (Intel AES-NI 2010'da geldi).</p>

<p class="l-text">"AES", üç anahtar boyutuna sahip 128-bit blok şifresidir: 128, 192, 256 bit. Blok boyutu 128 bit (16 bayt) olarak sabittir. Round sayısı anahtara bağlıdır: AES-128 için 10, AES-192 için 12, AES-256 için 14. Rijndael orijinal tanımıyla daha fazla blok ve anahtar boyutunu destekler, ancak NIST AES için yalnızca bu alt kümeyi seçti. Birisi nitelendirme olmadan "AES" derse, neredeyse her zaman bir modda AES-128'i kasteder.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">AES-128</div><div class="card-body">10 round, 128-bit anahtar, 128-bit blok. En hızlı. TLS 1.3, WireGuard, Signal için varsayılan. Klasik güvenlik ~128 bit, post-kuantum ~64 bit (Grover). 2040'a kadar neredeyse tüm pratik senaryolar için hâlâ güvenli kabul edilir.</div></div>
<div class="calc-card"><div class="card-title">AES-192</div><div class="card-body">12 round. ABD hükümetinin CNSA Suite B'si dışında nadiren kullanılır. AES-128'den ~%30 daha yavaş, marjinal güvenlik faydası ile. Bir sözleşme talep etmedikçe atlayın.</div></div>
<div class="calc-card"><div class="card-title">AES-256</div><div class="card-body">14 round, 256-bit anahtar. AES-128'den ~%40 daha yavaş. ABD TOP SECRET / EU RESTRICTED için gereklidir. Post-kuantum güvenliği ~128 bit (Grover aramayı yarılar). Verinin uzun saklama ufku olduğunda önerilir ("şimdi topla, sonra şifre çöz").</div></div>
<div class="calc-card"><div class="card-title">Blok boyutu</div><div class="card-body">Her zaman 128 bit = 16 bayt. Tek bir anahtar+nonce akışını, doğum günü çakışmaları gerçek olmadan önce yaklaşık 2^64 blokla sınırlar. Yüksek verimli bağlantılar (>1 PB) için anahtarları döndürmeniz gerekir.</div></div>
</div>

<div class="calc-highlight"><strong>Pratik çıkarım:</strong> Mesaj başına 96-bitlik rastgele bir nonce ile "AES-128-GCM" veya "AES-256-GCM" zamanın %95'inde doğru cevaptır. ChaCha20-Poly1305, AES-NI olmadan yazılım hızı gerektiğinde eşit derecede geçerli alternatiftir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. AES Round'u — SubBytes, ShiftRows, MixColumns, AddRoundKey</h2>
<p class="l-text">Tek bir AES round'u, 4×4 baytlık bir state matrisini dört işlemden geçirerek dönüştürür. <strong>SubBytes</strong> her bayta AES S-box'ını (doğrusal olmayan bir ikame tablosu) uygular — Shannon anlamında karışıklığın enjekte edildiği yer burasıdır. <strong>ShiftRows</strong> her satırı farklı bir miktarda (0, 1, 2, 3) döndürür — baytları yatay olarak yayar. <strong>MixColumns</strong> her sütunu GF(2^8) içinde sabit bir matrisle çarpar — dikey olarak yayar. <strong>AddRoundKey</strong>, ana anahtardan anahtar planlaması ile türetilmiş round'a özgü bir anahtarı XOR'lar. İlk round sonunda MixColumns'u atlar ve son round MixColumns'u tamamen atlar; aksi takdirde round'lar tekdüzedir.</p>

<div class="katex-block">$$\\text{state}_{i+1} = \\text{AddRoundKey}_i \\circ \\text{MixColumns} \\circ \\text{ShiftRows} \\circ \\text{SubBytes}(\\text{state}_i)$$</div>

<p class="l-text">S-box, AES'in kalbidir. GF(2^8) içindeki çarpımsal tersten ve ardından bir afin dönüşümden inşa edilmiştir; bu yüksek doğrusal olmama (doğrusal kriptanalize karşı direnç, ders 9) ve yan-kanala karşı sertleştirilmiş uygulamaları mümkün kılan temiz bir cebirsel açıklama verir. Anahtar planlaması, orijinal 16/24/32 baytlık anahtarı, döndürülmüş ve S-box ile ikame edilmiş kelimelerle artı round sabitleriyle özyinelemeli XOR aracılığıyla 11/13/15 round anahtarına genişletir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Küçük eğitsel AES yapı taşları — üretim için değil!</span>
<span class="cm"># SubBytes'i 4-baytlık bir oyuncak state üzerinde uyguluyoruz; S-box'ı iş başında görmek için.</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Önceden hesaplanmış AES S-box (256 giriş, resmi FIPS 197 değerleri, burada kısaltılmış)</span>
SBOX = [
 0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
 0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
 <span class="cm"># ... tam 256-baytlık tablo kısalık için atlandı</span>
]

<span class="kw">def</span> <span class="fn">sub_bytes_demo</span>(state_bytes):
    <span class="kw">return</span> <span class="fn">bytes</span>(SBOX[b] <span class="kw">if</span> b &lt; <span class="fn">len</span>(SBOX) <span class="kw">else</span> b <span class="kw">for</span> b <span class="kw">in</span> state_bytes)

state = <span class="fn">bytes</span>([0x32, 0x88, 0x31, 0xe0])
<span class="fn">print</span>(<span class="str">'input  :'</span>, state.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'S-box  :'</span>, <span class="fn">sub_bytes_demo</span>(state).<span class="fn">hex</span>())
<span class="cm"># Dikkat: 0x32 -&gt; 0x23, 0x88 -&gt; 0xc4, 0x31 -&gt; 0xc7, 0xe0 -&gt; 0xe1 (gerçek S-box'a bakın)</span>
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) FIPS 197 AES S-box'inin ilk 32 girdisini sabit kodlar — tam 256 byte tablo atlandı ama 0x63'ten 0xc0'a kadar her byte resmi Rijndael substitusyonu ile eşleşir. 2) <code>sub_bytes_demo</code> tek bir AES round'unun SubBytes adımını gerçekleştirir: her girdi byte'i S-box'i indeksler (<code>SBOX[b]</code>), böylece arama saf non-lineer ikamedir — Shannon "confusion"'inin enjekte edildiği yer, ve gerçek silikonda AES-NI'nin <code>aesenc</code>'i bunu tek bir komutta yapar. 3) <code>0x32 0x88 0x31 0xe0</code> test state'i FIPS 197 referansından kanonik örnektir ve S-box aramasından geçer; sondaki yorum resmi çıktıları (0x23, 0xc4, 0xc7, 0xe1) listeler, böylece spesifikasyona karşı dogrulayabilirsiniz. 4) Girdi ve S-box çıktısını yan yana yazdırmak AES SubBytes'in tamamen state'siz byte→byte map olduğunu vurgular — bu adımda anahtar yok — ki bu yüzden 256-byte tablo veya GF(2^8) ters + sabit-zamanlı uygulamalarda affine formulü ile değiştirilebilir.</p>

<p class="l-text">Yukarıdaki kasıtlı bir taslaktır — tam 256 baytlık S-box her AES referans sayfasındadır. Önemli olan şekildir: AES, bayt seviyesindeki tablo aramalarının ve XOR'ların bir dizisidir; bu da silikona neden bu kadar temiz haritalandığını tam olarak açıklar. Intel AES-NI bir round'u tek bir komutta (<code>aesenc</code>) ve tam bir AES-128 şifrelemesini ~40 döngüde çalıştırır.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">4-baytlık state üzerinde oyuncak bir round — bir "round anahtarı" ile XOR sonra sahte bir S-box (251 mod kare alma). AES değildir, ama 12 satırda SubBytes + AddRoundKey ritmini yakalar.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

state = np.<span class="fn">array</span>([0x32, 0x88, 0x31, 0xe0], dtype=np.uint8)
key   = np.<span class="fn">array</span>([0x2b, 0x7e, 0x15, 0x16], dtype=np.uint8)

<span class="cm"># Round = AddRoundKey sonra yedek bir S-box (b -&gt; (b*b) mod 251)</span>
<span class="kw">def</span> <span class="fn">toy_round</span>(s, k):
    s = s ^ k                              <span class="cm"># AddRoundKey</span>
    s = np.<span class="fn">array</span>([(<span class="fn">int</span>(b)*<span class="fn">int</span>(b)) % <span class="num">251</span> <span class="kw">for</span> b <span class="kw">in</span> s], dtype=np.uint8)  <span class="cm"># oyuncak S-box</span>
    <span class="kw">return</span> s

<span class="fn">print</span>(<span class="str">'start :'</span>, state.<span class="fn">tolist</span>())
<span class="kw">for</span> r <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>):
    state = <span class="fn">toy_round</span>(state, key)
    <span class="fn">print</span>(f<span class="str">'round {r+1}:'</span>, state.<span class="fn">tolist</span>())
</code></pre></div></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) uint8 NumPy dizileri olarak 4-byte <code>state</code> ve 4-byte <code>key</code> kurar — uint8 önemli çünkü gerçek AES'te XOR semantigi byte-modüler (herhangi bir taşma round'u sessizce bozar). 2) <code>toy_round</code> düz <code>state ^ key</code> XOR'u ile <em>AddRoundKey</em>'i uygular — gerçek AES'in 128-bit state'i üzerinde 11/13/15 genişletilmiş round anahtarının her biri ile yaptığı işlemin aynısı. 3) AddRoundKey'den sonra, oyuncak S-box <code>b → (b*b) mod 251</code> SubBytes yerine geçer; gerçek AES S-box GF(2^8) çarpımsal ters artı affine map kullanır, ama demo'nun kare alması anahtar özelliği yakalar — her byte non-lineer ve bağımsız dönüşür. 4) 3 round döngüsü state'in nasıl evrildigini yazdırır; gerçek AES'te aynı şekil 10/12/14 kez (anahtar boyutuna göre) ShiftRows + MixColumns araya serpiştirilerek tekrarlanır difüzyon eklemek için, ama burada gösterilen AddRoundKey + S-box ritmi her modern CPU'nun <code>aesenc</code> komutundaki iç döngüdür.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ECB — Var Olmaması Gereken Mod</h2>
<p class="l-text">Electronic Codebook en basit moddur: düz metni 16-baytlık bloklara bölün, her birini aynı anahtarla bağımsız olarak şifreleyin. Ayrıca herhangi bir gerçek veri için yıkıcı şekilde kırılmıştır, çünkü aynı düz metin blokları aynı şifreli metin bloklarını üretir. Ünlü "ECB Tux" görüntüsü — penguenin hâlâ görülebildiği AES-ECB ile şifrelenmiş bir Linux maskotu — kanonik örnektir. Herhangi bir yapılandırılmış veri (dosya sistemleri, veritabanı satırları, görüntü bitmap'leri) ECB üzerinden sızar.</p>

<div class="calc-highlight"><strong>ECB kuralı:</strong> kod incelemenizdeki bir sonraki cümle "AES-ECB kullanıyoruz çünkü daha basit" ise, incelemeyi durdurun. ECB'nin doğru seçim olduğu hiçbir senaryo yoktur. GCM kullanın. Veya CTR. Mecbursanız CBC. Asla ECB değil.</div>

<p class="l-text">ECB'nin tek meşru kullanım durumu vardır: tam olarak 16 baytlık tek bir bloğu şifrelemek (örneğin bir anahtarı kendisiyle sarmalamak; bunun için zaten AES-KW tercih edilir). Daha uzun her şey için ECB, düz metin bloklarının eşitlik desenini sızdırır; bu pratikte yapı sızdırır demektir, bu da pratikte mesajı sızdırır demektir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Sentetik yapılandırılmış veride ECB desen sızıntısının gösterimi.</span>
<span class="cm"># Pyodide'de yedek bir şifre kullanıyoruz (anahtar ile blok xor) — bilgi-teorik</span>
<span class="cm"># noktayı göstermek için; aynı yapı AES ne kadar güçlü olursa olsun sızar.</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np

KEY = np.<span class="fn">array</span>([0xa3, 0x55, 0xcc, 0x77], dtype=np.uint8)

<span class="kw">def</span> <span class="fn">toy_ecb_encrypt</span>(plaintext, key):
    out = <span class="fn">bytearray</span>(<span class="fn">len</span>(plaintext))
    bs = <span class="fn">len</span>(key)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(plaintext), bs):
        block = plaintext[i:i+bs]
        <span class="kw">for</span> j, b <span class="kw">in</span> <span class="fn">enumerate</span>(block):
            out[i+j] = b ^ <span class="fn">int</span>(key[j % bs])
    <span class="kw">return</span> <span class="fn">bytes</span>(out)

<span class="cm"># İki özdeş 4-baytlık satır -&gt; özdeş şifreli metin satırları: desen sızar.</span>
plaintext = b<span class="str">'AAAA'</span> + b<span class="str">'BBBB'</span> + b<span class="str">'AAAA'</span> + b<span class="str">'CCCC'</span>
ct = <span class="fn">toy_ecb_encrypt</span>(plaintext, KEY)
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(ct), <span class="num">4</span>):
    <span class="fn">print</span>(f<span class="str">'block {i//4}: pt={plaintext[i:i+4]!r}  ct={ct[i:i+4].hex()}'</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) 4-byte bir anahtar ve plaintext'in her 4-byte bloğunu aynı sabit anahtarla XOR'layan <code>toy_ecb_encrypt</code> tanımlar — oyuncak AES yerine geçer ama ECB'nin tanımlayıcı özelliğini yeniden üretir: her blok aynı anahtarla ve IV olmadan bağımsız şifrelenir. 2) <code>plaintext = b'AAAA' + b'BBBB' + b'AAAA' + b'CCCC'</code> kurar; pozisyon 0 ve 2'de iki özdeş "AAAA" bloğu var — ECB'nin desen sızıntısını açığa çıkarmak için kullanılan tam veri. 3) Şifreleme döngüsü 4-byte pencereler ile adım atar ve her byte'i <code>key[j % bs]</code> ile XOR'lar; fonksiyon deterministik ve state'siz olduğu için, blok 0 ve blok 2 byte-özdeş şifreli metin üretir — Linux Tux maskotunu gerçek AES-ECB altında hâlâ tanınabilir bir görüntüye dönüştüren sızıntı. 4) for döngüsü çıktısı <code>blok 0</code> ve <code>blok 2</code>'nin aynı hex şifreli metni paylaştığını, blok 1 ve 3'ün ise farklı olduğunu gösterir — alttaki cipher bilgi-teorik olarak güçlü olsa bile ECB'nin blokların eşitlik desenini şifrelediğinin görsel bir kanıtı, ki bu yüzden CBC, CTR ve GCM hepsi bu sızıntıyı yok etmek için zincirler veya counter kullanır.</p>

<p class="l-text">Dikkat edin: blok 0 ve blok 2 aynı şifreli metin baytlarını üretir. 1 MB'lık bir görüntüde gerçek AES-ECB ile bu, orijinalin posterleştirilmiş bir sürümü hâline gelir. Düzeltme, her bloğu öncekilere bağımlı kılmak (CBC) veya blok başına benzersiz bir anahtar akışı türetmektir (CTR/GCM).</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. CBC — Blokları Zincirlemek, Padding ve Vaudenay Saldırısı</h2>
<p class="l-text">Cipher Block Chaining, her düz metin bloğunu şifrelemeden önce önceki şifreli metin bloğuyla XOR'lar. İlk blok, mesaj başına rastgele seçilen bir genel Initialization Vector (IV) ile XOR'lanır. Bu, ECB desen sızıntısını öldürür — özdeş düz metin blokları artık farklı şifreli metinlere şifrelenir çünkü öncülleri farklıdır.</p>

<div class="katex-block">$$C_i = E_K(P_i \\oplus C_{i-1}), \\quad C_0 = E_K(P_0 \\oplus IV)$$</div>

<p class="l-text">CBC, düz metin uzunluğunun 16 baytın katı olmasını gerektirir. <strong>PKCS#7 padding</strong>, ihtiyaç duyulan bayt sayısı N olmak üzere N değerinde N bayt ekler (1 ila 16; mesaj zaten 16'nın katıysa, 0x10 0x10 ... 0x10 değerinde tam bir padding bloğu eklenir, böylece çözme belirsiz olmaz). Şifre çözme, padding'i çıkarır. Padding bozuksa, alıcı bir hata döndürür — ve o hata, CBC üzerindeki en ünlü saldırının tohumudur.</p>

<p class="l-text"><strong>Vaudenay'in padding-oracle saldırısı (2002)</strong>: bir saldırgan şifreli metinler gönderebilir ve padding'in geçerli olup olmadığını öğrenebilirse (örneğin farklı bir hata mesajı veya zamanlama farkı yoluyla), CBC ile şifrelenmiş herhangi bir veriyi anahtarsız bayt bayt çözebilir. Bu teorik değildir — POODLE (2014) tam olarak bu teknikle SSL 3.0'ı web üzerinden kırdı ve Lucky Thirteen (2013) TLS 1.0'a karşı bir zamanlama varyantını canlandırdı. Modern protokollerdeki düzeltme: saldırgana padding hakkında asla bilgi vermeyin ve şifre çözmeden önce doğrulayan AEAD modlarını tercih edin.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CBC artıları</div><div class="card-body">Basit, paralel şifre çözme (her blok yalnızca öncekine bağlıdır), iyi çalışılmış. Donanım desteği evrensel.</div></div>
<div class="calc-card"><div class="card-title">CBC eksileri</div><div class="card-body">Sıralı şifreleme (paralelleştirilemez). Padding-oracle saldırıları. Yerleşik kimlik doğrulama yok — HMAC ile birleştirilmeli ("Encrypt-then-MAC"). IV yalnızca benzersiz değil, tahmin edilemez olmalıdır.</div></div>
<div class="calc-card"><div class="card-title">CBC bit-flip</div><div class="card-body">C_{i-1} içindeki b bitini çevirmek, P_i düz metin bloğundaki b bitini çevirir (ve P_{i-1}'i karıştırır). Kimlik doğrulama olmadan, saldırganlar bilinen konumdaki düz metnin belirli bitlerini yeniden yazabilir.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman kullanılır</div><div class="card-body">Eski sistemler, AES-CBC + HMAC-SHA-256'nın izin verilen tek kombinasyon olduğu FIPS-kısıtlamalı ortamlar. Yeni kod: CBC'yi atlayın, GCM'ye geçin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. CTR — Blok Şifreden Akış Şifresi ve IV Yeniden Kullanımı Uçurumu</h2>
<p class="l-text">Counter modu AES'i bir akış şifresine dönüştürür. Ardışık tamsayıları (IV'den başlayan bir sayaç) şifreleyin ve elde edilen anahtar akışını düz metinle XOR'layın. CTR tamamen paraleldir (her blok bağımsız), padding gerektirmez (herhangi bir bayt uzunluğu çalışır) ve kavramsal olarak basittir.</p>

<div class="katex-block">$$C_i = P_i \\oplus E_K(\\text{nonce} \\,\\|\\, i), \\quad i = 0, 1, 2, \\ldots$$</div>

<p class="l-text">İşin püf noktası: aynı (anahtar, nonce) çifti ile iki farklı mesaj şifrelerseniz, aynı anahtar akışını iki kez üretmiş olursunuz ve iki şifreli metni XOR'layan saldırgan P1 XOR P2 elde eder — anahtar akışı iptal olur. Buradan klasik crib-dragging her iki düz metni de kurtarır. Bu, WEP'i (Wi-Fi Protected Privacy, 2001) yok eden şeydir; orada 24-bit IV, yoğun bir ağda birkaç bin paketten sonra çakıştı. Modern CTR, mesaj başına 96-bit rastgele bir nonce kullanır; bu da anahtar başına ~2^32 mesaja kadar ihmal edilebilir doğum günü çakışma olasılığı verir.</p>

<div class="calc-highlight"><strong>CTR / GCM emri:</strong> bir (anahtar, nonce) çiftini asla yeniden kullanmayın. Ya kalıcı olarak artırdığınız bir sayaç kullanın ya da mesaj başına 96-bit rastgele bir değer kullanın. Benzersizliği garanti edemiyorsanız, AES-GCM-SIV'ye geçin veya mesaj başına yeni bir anahtar kullanın.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># CTR'de IV yeniden kullanımı -&gt; düz metinlerin XOR'u sızar. Sahte akış şifresiyle gösterildi.</span>
<span class="kw">import</span> os, hashlib

<span class="kw">def</span> <span class="fn">keystream</span>(key, nonce, length):
    out = <span class="fn">bytearray</span>()
    counter = <span class="num">0</span>
    <span class="kw">while</span> <span class="fn">len</span>(out) &lt; length:
        block = hashlib.<span class="fn">sha256</span>(key + nonce + counter.<span class="fn">to_bytes</span>(<span class="num">8</span>, <span class="str">'big'</span>)).<span class="fn">digest</span>()
        out += block
        counter += <span class="num">1</span>
    <span class="kw">return</span> <span class="fn">bytes</span>(out[:length])

<span class="kw">def</span> <span class="fn">ctr_encrypt</span>(key, nonce, plaintext):
    ks = <span class="fn">keystream</span>(key, nonce, <span class="fn">len</span>(plaintext))
    <span class="kw">return</span> <span class="fn">bytes</span>(p ^ k <span class="kw">for</span> p, k <span class="kw">in</span> <span class="fn">zip</span>(plaintext, ks))

key   = b<span class="str">'super_secret_key'</span>
nonce = b<span class="str">'reused_nonce_AAA'</span>   <span class="cm"># BUG: her iki mesaj için aynı nonce!</span>

m1 = b<span class="str">'transfer 100 USD to Alice'</span>
m2 = b<span class="str">'transfer 999 USD to Eve  '</span>

c1 = <span class="fn">ctr_encrypt</span>(key, nonce, m1)
c2 = <span class="fn">ctr_encrypt</span>(key, nonce, m2)

<span class="cm"># Saldırgan şifreli metinleri XOR'lar -&gt; anahtar bilgisi olmadan m1 XOR m2'yi kurtarır:</span>
leak = <span class="fn">bytes</span>(a ^ b <span class="kw">for</span> a, b <span class="kw">in</span> <span class="fn">zip</span>(c1, c2))
<span class="fn">print</span>(<span class="str">'m1 XOR m2 (anahtarsiz kurtarildi):'</span>, leak)
<span class="fn">print</span>(<span class="str">'m1 XOR m2 (gercek deger)         :'</span>, <span class="fn">bytes</span>(a^b <span class="kw">for</span> a,b <span class="kw">in</span> <span class="fn">zip</span>(m1,m2)))
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>keystream(key, nonce, length)</code> <code>key || nonce || counter</code>'i SHA-256 ile hash'leyip digest'leri birlestirerek AES-CTR yerine geçer — önemli olan özellik: (key, nonce) ciftiyle benzersiz şekilde belirlenen deterministik bir byte akışı, tam olarak gerçek CTR mode gibi. 2) <code>ctr_encrypt</code> keystream'i plaintext'e karşı XOR'lar — bu tek XOR CTR'nin yaptığı her şey, bu yüzden CTR bir blok cipher'i stream cipher'e dönüştürür ve şifreli metin uzunluğu her zaman plaintext uzunluğuna eşittir (padding yok). 3) Hata <code>nonce = b'reused_nonce_AAA'</code> satırında: hem <code>m1</code> hem <code>m2</code> aynı (key, nonce) ile şifrelenir ve dolayısıyla aynı keystream'i paylasir — tam olarak WEP / IEEE 802.11i 2001 felaketinin koşulu. 4) Saldırgan <code>c1 ⊕ c2</code> hesaplar ve anahtar bilgisi olmadan <code>m1 ⊕ m2</code> elde eder çünkü paylaşılan keystream iptal olur — yazdırılan satırlar kurtarilmis XOR'un gerçek plaintext XOR'una eşit olduğunu gösterir, ardından "transfer " görünür önekine crib-dragging her iki mesajı da çıkarır ve nonce benzersizliği garanti edilemediginde GCM-SIV veya mesaj başına taze anahtarın neden pazarlık konusu olmadığını gösterir.</p>

<p class="l-text">İki çıktı eşleşir. Saldırganlar m1 XOR m2'yi elde ettiğinde, XOR üzerinde istatistiksel saldırılar uygularlar (İngilizce harf frekansları, "transfer " gibi bilinen başlıklar) ve her iki düz metni de soyup çıkarırlar. GCM'nin nonce'ları takıntılı şekilde takip etmesinin ve yanlış kullanıma dirençli varyantların (GCM-SIV, deterministik AEAD) var olmasının nedeni budur.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. GCM ve AEAD İlkesi</h2>
<p class="l-text">Galois/Counter Mode (NIST SP 800-38D, 2007), CTR artı GHASH (GF(2^128) üzerinde polinom hash) ile hesaplanan bir kimlik doğrulama etiketidir. Tek geçişte hem gizlilik hem de bütünlük üretir ve TLS 1.3, WireGuard, IPsec ve neredeyse her modern protokolde varsayılan simetrik moddur. AES-GCM donanım verimi, 2024 Ice Lake sunucu çekirdeğinde 50 Gbps'yi aşar.</p>

<p class="l-text"><strong>AEAD</strong> = Authenticated Encryption with Associated Data (İlişkili Veri ile Doğrulanmış Şifreleme). Primitif (anahtar, nonce, düz metin, AD) alır ve (şifreli metin, etiket) üretir. İlişkili veri doğrulanır ancak şifrelenmez — okunabilir kalmak zorunda olan ancak kurcalamaya karşı korumalı protokol başlıkları (sıra numaraları, IP adresleri) için mükemmeldir. Şifre çözme, etiketi düz metni döndürmeden <em>önce</em> doğrular: padding oracle yok, bit-flip saldırısı yok, esneklik yok. Bu tek tasarım deseni, 2000'leri saran tüm bir hata sınıfını ortadan kaldırır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdiler</div><div class="card-body">Anahtar (16/32 bayt), nonce (12 bayt önerilir), düz metin (herhangi bir uzunluk), ilişkili veri (herhangi bir uzunluk).</div></div>
<div class="calc-card"><div class="card-title">Çıktılar</div><div class="card-body">Şifreli metin (düz metin ile aynı uzunluk), 16-baytlık kimlik doğrulama etiketi. Birlikte anahtar olmadan sahteleştirilemezler.</div></div>
<div class="calc-card"><div class="card-title">Etiket doğrulama</div><div class="card-body">Sabit zamanlı karşılaştırma. Şifre çözmeden önce reddet. Şifreli metindeki tek bir bit çevrilmesi, etiketin ezici bir olasılıkla başarısız olmasına neden olur (~2^{-128}).</div></div>
<div class="calc-card"><div class="card-title">Yıkıcı arıza modu</div><div class="card-body">Bir (anahtar, nonce) çifti tekrarlarsa, saldırganlar iki şifreli metin-etiket çiftinden GHASH anahtarı H'yi kurtarabilir ve keyfi mesajları sahteleştirebilir. Bu CTR yeniden kullanımından daha kötüdür.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Kavramsal AEAD şekli — şifrele + etiketle, şifre çözmeden önce doğrula.</span>
<span class="cm"># Gerçek AES-GCM GHASH kullanır; burada (nonce || ad || ct) üzerinde HMAC-SHA-256 yedek olarak kullanıyoruz.</span>
<span class="kw">import</span> os, hmac, hashlib

<span class="kw">def</span> <span class="fn">aead_encrypt</span>(key, nonce, plaintext, ad):
    <span class="cm"># 5. bölümdeki oyuncak CTR ile şifrele (kısalık için burada atlandı)</span>
    ct = <span class="fn">bytes</span>(p ^ k <span class="kw">for</span> p, k <span class="kw">in</span> <span class="fn">zip</span>(plaintext, hashlib.<span class="fn">sha256</span>(key + nonce).<span class="fn">digest</span>() * <span class="num">4</span>))
    tag = hmac.<span class="fn">new</span>(key, nonce + ad + ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]
    <span class="kw">return</span> ct, tag

<span class="kw">def</span> <span class="fn">aead_decrypt</span>(key, nonce, ct, tag, ad):
    expected = hmac.<span class="fn">new</span>(key, nonce + ad + ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]
    <span class="kw">if</span> <span class="kw">not</span> hmac.<span class="fn">compare_digest</span>(tag, expected):
        <span class="kw">raise</span> <span class="fn">ValueError</span>(<span class="str">'etiket dogrulama basarisiz - mesaj kurcalandi'</span>)
    <span class="kw">return</span> <span class="fn">bytes</span>(c ^ k <span class="kw">for</span> c, k <span class="kw">in</span> <span class="fn">zip</span>(ct, hashlib.<span class="fn">sha256</span>(key + nonce).<span class="fn">digest</span>() * <span class="num">4</span>))

key, nonce, ad = os.<span class="fn">urandom</span>(<span class="num">32</span>), os.<span class="fn">urandom</span>(<span class="num">12</span>), b<span class="str">'protocol-header-v1'</span>
ct, tag = <span class="fn">aead_encrypt</span>(key, nonce, b<span class="str">'attack at dawn'</span>, ad)
<span class="fn">print</span>(<span class="str">'ct  :'</span>, ct.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'tag :'</span>, tag.<span class="fn">hex</span>())
<span class="fn">print</span>(<span class="str">'dec :'</span>, <span class="fn">aead_decrypt</span>(key, nonce, ct, tag, ad))
</code></pre></div>
<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Cryptography library'den AESGCM (AES-256-GCM AEAD) sınıfını alır — kimlik doğrulamalı şifreleme: gizlilik + bütünlük tek çağrıda. 2) os.urandom(32) ile 256-bit kriptografik güvenli rastgele anahtar üretir (Linux'ta getrandom()/dev/urandom). 3) os.urandom(12) ile 96-bit nonce — NIST SP 800-38D'nin GCM için tavsiye ettiği minimum; (anahtar, nonce) çifti ASLA tekrar kullanılmamalı, aksi halde GHASH alt-anahtarı sızar. 4) encrypt(nonce, plaintext, aad) → ciphertext + 16-byte authentication tag (sona eklenir). Decrypt'te tag mismatch InvalidTag fırlatır — tampering veya yanlış anahtar sinyali.</p>

</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. 2026'da Bir Mod Seçmek</h2>
<p class="l-text">Bir sonraki kod incelemeniz için kısa bir akış şeması:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Varsayılan</div><div class="card-body"><strong>AES-256-GCM</strong> mesaj başına rastgele 96-bit nonce ile. Anahtar başına maks. 2^32 mesaj (sonra döndürün). Protokol başlıklarını ilişkili veri olarak iletin.</div></div>
<div class="calc-card"><div class="card-title">AES-NI donanımı yok</div><div class="card-body"><strong>ChaCha20-Poly1305</strong> (RFC 8439). ARM Cortex-A53'te saf yazılımda AES'ten 3 kat hızlı, WireGuard ve TLS 1.3 yedek tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Benzersiz nonce garanti edilemez</div><div class="card-body"><strong>AES-GCM-SIV</strong> (RFC 8452). Yanlış kullanıma dirençli — bir nonce'u tekrarlamak yalnızca mesaj eşitliğini sızdırır, anahtarı değil. Biraz daha yavaş.</div></div>
<div class="calc-card"><div class="card-title">Disk şifrelemesi</div><div class="card-body"><strong>AES-XTS</strong> (IEEE 1619) sektör seviyesinde şifreleme için (LUKS, BitLocker, FileVault). AEAD değildir — yalnızca gizlilik — çünkü sektör başına etiket için yer yoktur.</div></div>
<div class="calc-card"><div class="card-title">Uzun dosyaları akışla iletme</div><div class="card-body">GCM üzerinde <strong>STREAM yapısı</strong> (Hoang-Reyhanitabar-Rogaway-Vizár 2015). Dosyaları zincirlenmiş nonce'lar ile parçalara böler; libsodium'un secretstream'i kanonik uygulamadır.</div></div>
<div class="calc-card"><div class="card-title">Post-kuantum köprüsü</div><div class="card-body">AES-256 iyidir — Grover yalnızca güvenliği yarılar, 128-bit kalır. PQ geçişi (ders 8) simetrik primitifleri değil, asimetrik primitifleri hedefler.</div></div>
</div>

<div class="calc-highlight"><strong>URV CRISES notu:</strong> Domingo-Ferrer'in grubu uzun süredir AEAD'i gizliliği koruyan istatistiksel hesaplamanın temeli olarak savunmuştur: şifrelenmiş bir veritabanı üzerinden yayınlanan her istatistik, doğrulanmış bir kanal üzerinden gitmelidir; aksi takdirde kurcalanmış sorgular altta yatan kayıtları sızdırabilir. AEAD yalnızca bir internet protokolü ayrıntısı değildir — herhangi bir güvenli analiz boru hattının zemin katıdır.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Uygulamalı — 30 Satırda Uçtan Uca AES-GCM</h2>
<p class="l-text">Bir araya getirelim. Üretimde <code>cryptography.hazmat.primitives.ciphers.aead.AESGCM</code> (pyca/cryptography) veya libsodium'un <code>crypto_aead_aes256gcm</code>'sini çağırırdınız. Aşağıdaki kod kavramsal yapıyı gösterir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Oyuncak bir AEAD gidiş-dönüşü artı bir kurcalama testi. XOR anahtar akışı AES-CTR için yedektir; HMAC-SHA-256 etiketi GMAC için yedektir. Kontrol akışı, gerçek AES-GCM'nin yaptığı şeydir.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> os, hmac, hashlib

<span class="kw">def</span> <span class="fn">keystream</span>(key, nonce, n):
    out = <span class="fn">bytearray</span>()
    ctr = <span class="num">0</span>
    <span class="kw">while</span> <span class="fn">len</span>(out) &lt; n:
        out += hashlib.<span class="fn">sha256</span>(key + nonce + ctr.<span class="fn">to_bytes</span>(<span class="num">8</span>, <span class="str">'big'</span>)).<span class="fn">digest</span>()
        ctr += <span class="num">1</span>
    <span class="kw">return</span> <span class="fn">bytes</span>(out[:n])

<span class="kw">def</span> <span class="fn">aead_encrypt</span>(key, nonce, pt, ad):
    ct  = <span class="fn">bytes</span>(p ^ k <span class="kw">for</span> p, k <span class="kw">in</span> <span class="fn">zip</span>(pt, <span class="fn">keystream</span>(key, nonce, <span class="fn">len</span>(pt))))
    tag = hmac.<span class="fn">new</span>(key, nonce + ad + ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]
    <span class="kw">return</span> ct, tag

<span class="kw">def</span> <span class="fn">aead_decrypt</span>(key, nonce, ct, tag, ad):
    <span class="kw">if</span> <span class="kw">not</span> hmac.<span class="fn">compare_digest</span>(tag, hmac.<span class="fn">new</span>(key, nonce+ad+ct, hashlib.sha256).<span class="fn">digest</span>()[:<span class="num">16</span>]):
        <span class="kw">raise</span> <span class="fn">ValueError</span>(<span class="str">'AUTH FAIL'</span>)
    <span class="kw">return</span> <span class="fn">bytes</span>(c ^ k <span class="kw">for</span> c, k <span class="kw">in</span> <span class="fn">zip</span>(ct, <span class="fn">keystream</span>(key, nonce, <span class="fn">len</span>(ct))))

key, nonce, ad = os.<span class="fn">urandom</span>(<span class="num">32</span>), os.<span class="fn">urandom</span>(<span class="num">12</span>), b<span class="str">'header-v1'</span>
ct, tag = <span class="fn">aead_encrypt</span>(key, nonce, b<span class="str">'transfer 100 USD to Alice'</span>, ad)
<span class="fn">print</span>(<span class="str">'decrypt OK :'</span>, <span class="fn">aead_decrypt</span>(key, nonce, ct, tag, ad))

<span class="cm"># Şifreli metnin bir baytını kurcala -&gt; etiket doğrulaması başarısız:</span>
bad = <span class="fn">bytearray</span>(ct); bad[<span class="num">0</span>] ^= 0x01
<span class="kw">try</span>:
    <span class="fn">aead_decrypt</span>(key, nonce, <span class="fn">bytes</span>(bad), tag, ad)
<span class="kw">except</span> ValueError <span class="kw">as</span> e:
    <span class="fn">print</span>(<span class="str">'kurcalama tespit edildi:'</span>, e)
</code></pre></div></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>keystream</code> + <code>aead_encrypt</code> birlikte AES-GCM'in CTR geçişini modeller — SHA-256 destekli keystream ile XOR ederek plaintext'i şifrele ve sonra <code>nonce || ad || ct</code> üzerinde HMAC-SHA-256 etiketi hesapla; gerçek GCM etiket için GF(2^128) üzerinde GHASH ve keystream için AES round fonksiyonu kullanır, ama girdi kontratı (key + nonce + ad + ct → tag) özdeştir. 2) <code>aead_decrypt</code> önce etiketi yeniden hesaplar ve <code>hmac.compare_digest</code> ile karşılaştırır — TLS 1.0'in CBC-then-HMAC'ini kıran Lucky Thirteen tarzı zamanlama yan kanallarını önleyen sabit zamanlı karşılaştırma. 3) <code>os.urandom(32)</code> + <code>os.urandom(12)</code> OS CSPRNG'sinden 256-bit anahtar ve 96-bit nonce üretir — NIST SP 800-38D'nin AES-GCM için tavsiye ettiği aynı 12-byte nonce uzunluğu, böylece nonce uzatma olmadan şifreli metnin yanında taşınabilir. 4) <code>bad[0] ^= 0x01</code> bit çevirme aktif bir saldırganı simüle eder; yeniden hesaplanan etiket artık depolananla eşleşmez, bu yüzden <code>compare_digest</code> reddeder ve <code>aead_decrypt</code> herhangi bir plaintext döndürülmeden önce <code>ValueError</code> fırlatır — gerçek AEAD kanallarında padding-oracle ve bit-flip saldırılarını ortadan kaldıran "verify-before-decrypt" özelliği.</p>

<p class="l-text">Çalıştırın. Şifre çözme orijinal şifreli metin için başarılı olur ve tek çevrilmiş bitte AUTH FAIL hatası verir. Bu özellik — <em>herhangi</em> bir kurcalamanın ezici olasılıkla bir doğrulama hatası üretmesi — internetteki neredeyse her şifreli kanal için AEAD'i doğru primitif yapan şeydir.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Kod İncelemesinde Göreceğiniz Yaygın Hatalar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Statik IV / sabit kodlanmış nonce</div><div class="card-body">"const NONCE = b'000000000000'" — her mesaj aynı nonce'u kullanır. CTR/GCM: anında kırılma. Her depoyu AES yakınındaki hex/bayt sabitleri için arayın.</div></div>
<div class="calc-card"><div class="card-title">"Performans için" ECB kullanımı</div><div class="card-body">Asla. CBC üzerindeki ~%5'lik verim kazancı önemsizdir; AES-GCM, AES-NI hattı sayesinde donanımda zaten ECB'den daha hızlıdır.</div></div>
<div class="calc-card"><div class="card-title">HMAC olmadan CBC</div><div class="card-body">Bütünlük olmadan gizlilik. Bit-flip saldırıları, padding oracle'ları. CBC kullanmak zorundaysanız: IV+şifreli metin üzerinde HMAC-SHA-256 ile Encrypt-then-MAC, MAC-then-Encrypt değil.</div></div>
<div class="calc-card"><div class="card-title">Etiket kısaltma</div><div class="card-body">"Bant genişliği için 64-bit etiket kullanıyoruz" — sahteleştirme direncini yarıya indirir. NIST 96-bit minimuma izin verir; sıkı bir standart aksini gerektirmedikçe 128-bit kullanın.</div></div>
<div class="calc-card"><div class="card-title">Anahtar türetme atlandı</div><div class="card-body">Bir parolayı doğrudan 16-baytlık anahtar olarak iletmek. Bağlam ayrımı için HKDF (RFC 5869) veya parola tabanlı anahtarlar için Argon2id kullanın (ders 3).</div></div>
<div class="calc-card"><div class="card-title">Değişken zamanlı etiket karşılaştırması</div><div class="card-body"><code>hmac.compare_digest</code> yerine <code>==</code> kullanmak. Zamanlama bir baytı diğerinden sızdırır. Her zaman sabit zamanlı karşılaştırma yapın.</div></div>
</div>

<div class="calc-highlight"><strong>Bitiş önizlemesi (ders 10):</strong> son madde — değişken zamanlı karşılaştırma — yan-kanal saldırılarına köprüdür. "Mükemmel" bir AES uygulaması bile, çevreleyen kod zamanlamaya duyarlıysa anahtarını sızdırabilir. Kriptografi bir sistem özelliğidir, bir primitif özelliği değil.</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">AES simetrik iş atıdır: 128-bit blok, 10/12/14 round, modern CPU'larda 5–20 GB/s. Onu sardığınız mod, seçtiğiniz anahtar boyutundan daha önemlidir. ECB asla. CBC yalnızca kimlik doğrulama ve sabit zamanlı padding işleme ile. CTR ve GCM yalnızca benzersiz nonce'larla. AEAD (GCM, ChaCha20-Poly1305, GCM-SIV) yeni kod için varsayılandır: tek primitifte gizlilik + bütünlük, protokol başlıkları için ilişkili veri ile. Donanım hızlandırması (AES-NI, ARM CryptoExt) AES-256-GCM'yi neredeyse her iş yükü için esasen ücretsiz hâle getirir.</p>

<p class="l-text">Ders 2 asimetrik kriptografiye atlar — başlangıçta simetrik anahtarı teslim eden diplomat. RSA-2048'in bugün neden henüz yeterli olduğunu ve eliptik eğrilerin yeni protokoller için bunun yerine neden geçtiğini göreceğiz. Ders 3 bütünlük tarafını — hash'leri ve MAC'leri — ele alır ve ders 4 bu primitifleri PKI'ye inşa eder. Ders 8'de AES-256'yı tekrar ziyaret ederek RSA'nın yapamadığı post-kuantum geçişten kurtulduğunu doğrulayacağız.</p>
</div>`
};
