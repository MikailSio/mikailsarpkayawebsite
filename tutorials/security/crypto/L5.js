window.CRYPTO_L5 = {
en: `<p class="l-text"><strong>Zero-Knowledge proofs (ZK) sound impossible the first time you hear them: you prove that you know a secret <em>without revealing anything about the secret</em>.</strong> Goldwasser, Micali, and Rackoff defined the concept in their seminal 1985 paper "The Knowledge Complexity of Interactive Proof Systems" — the same paper that earned Goldwasser the 2012 Turing Award. The idea sat in theory papers for decades, then the cryptocurrency world collided with it: Zcash (2016) shipped the first production zk-SNARK to give Bitcoin transactions privacy; Tornado Cash (2019) anonymized Ethereum transfers; zkSync, StarkNet, and Polygon zkEVM (2023+) compress thousands of Ethereum transactions into a single proof verifiable in milliseconds.</p>

<p class="l-text">In this lesson we walk the three pillars of a ZK proof — completeness, soundness, zero-knowledge — implement Schnorr's interactive identification scheme (1989) over a small prime field, apply the <strong>Fiat-Shamir transform</strong> (1986) to make it non-interactive, sketch the modern landscape (Groth16, Plonk, zk-STARKs, Bulletproofs), and connect the math to its real applications: anonymous credentials (Microsoft U-Prove), private payments (Zcash, Tornado Cash), zk-rollups (zkSync, StarkNet), and machine-learning model verification (zkML).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the three ZK properties (completeness, soundness, zero-knowledge)</li>
<li>Run Schnorr's Σ-protocol for discrete log knowledge by hand and in Python</li>
<li>Apply the Fiat-Shamir transform: turn a 3-message interactive proof into one non-interactive blob</li>
<li>Compare zk-SNARK families: Groth16 (small proof, trusted setup), Plonk (universal setup), Bulletproofs (no setup, log-size)</li>
<li>Compare zk-STARKs to SNARKs: post-quantum, no trusted setup, larger proofs</li>
<li>Trace real systems: Zcash, Tornado Cash, zkSync, StarkNet, zkML (EZKL)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Three Properties — Completeness, Soundness, Zero-Knowledge</h2>
<p class="l-text">A zero-knowledge proof system between Prover P and Verifier V is a protocol where P convinces V that a statement is true, with three guarantees:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Completeness</div><div class="card-body">If the statement is true and P knows the witness, V accepts (with probability ≥ 1 - negligible). The honest prover always wins.</div></div>
<div class="calc-card"><div class="card-title">Soundness</div><div class="card-body">If the statement is false (no valid witness exists), no cheating P* can convince V except with negligible probability. Knowledge soundness is stronger: P actually <em>knows</em> the witness, in the sense that an extractor can pull it out.</div></div>
<div class="calc-card"><div class="card-title">Zero-knowledge</div><div class="card-body">V learns <em>nothing</em> beyond the truth of the statement. Formally: there is a simulator S that, given only the statement, outputs a transcript indistinguishable from a real prover-verifier transcript.</div></div>
<div class="calc-card"><div class="card-title">The classic intuition</div><div class="card-body">The "Ali Baba's cave" story (Quisquater 1989): P can prove they know the magic word that opens the door between two cave branches without ever speaking it. Repeat enough times and V is convinced; an eavesdropper learns nothing.</div></div>
</div>

<p class="l-text">The brilliance of GMR's 1985 definition is that zero-knowledge is captured by the existence of a simulator. If a transcript can be faked without the witness, the transcript reveals no useful information about the witness — even when it is real.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Schnorr's Identification Protocol — Knowledge of Discrete Log</h2>
<p class="l-text">Claus Schnorr's 1989 protocol proves knowledge of a discrete log: P holds secret <em>x</em> with public <em>y = g^x mod p</em>. P proves to V that they know x without revealing it. Three messages, called a <strong>Σ-protocol</strong> ("Sigma" for the shape of the message flow):</p>

<div class="katex-block">$$\\begin{aligned} & \\text{1. P picks } r \\leftarrow \\mathbb{Z}_q, \\text{ sends } t = g^r \\\\ & \\text{2. V picks challenge } c \\leftarrow \\mathbb{Z}_q, \\text{ sends } c \\\\ & \\text{3. P sends } s = r + cx \\bmod q \\\\ & \\text{V checks: } g^s \\stackrel{?}{=} t \\cdot y^c \\end{aligned}$$</div>

<p class="l-text">Why it works: <em>g^s = g^{r+cx} = g^r · g^{cx} = t · y^c</em>. Why it is zero-knowledge: a simulator can pick s and c first, set t = g^s · y^{-c}, and produce a perfectly distributed transcript — no x ever needed. Why it is sound: if a malicious prover answers two different challenges c, c' for the same t, the verifier can solve for x = (s - s')/(c - c') mod q.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Schnorr identification over a small prime field. Watch the verifier accept the honest run and reject a forged one.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets

<span class="cm"># Toy Schnorr group: subgroup of Z_p* of prime order q</span>
p = <span class="num">2027</span>  <span class="cm"># prime</span>
q = <span class="num">1013</span>  <span class="cm"># (p-1)/2 also prime — Schnorr group of order q</span>
g = <span class="num">2</span>     <span class="cm"># generator of order q (works for these toy params)</span>

<span class="kw">def</span> <span class="fn">randmod</span>(n):
    <span class="kw">return</span> secrets.<span class="fn">randbelow</span>(n - <span class="num">1</span>) + <span class="num">1</span>

<span class="cm"># Prover's secret and public key</span>
x = <span class="fn">randmod</span>(q)
y = <span class="fn">pow</span>(g, x, p)
<span class="fn">print</span>(f<span class="str">'public key y = g^x mod p = {y}'</span>)

<span class="cm"># --- Round 1 ---</span>
r = <span class="fn">randmod</span>(q)
t = <span class="fn">pow</span>(g, r, p)

<span class="cm"># --- Round 2 ---</span>
c = <span class="fn">randmod</span>(q)

<span class="cm"># --- Round 3 ---</span>
s = (r + c * x) % q

<span class="cm"># --- Verify ---</span>
lhs = <span class="fn">pow</span>(g, s, p)
rhs = (t * <span class="fn">pow</span>(y, c, p)) % p
<span class="fn">print</span>(f<span class="str">'g^s = {lhs},  t * y^c = {rhs}  ->  accept = {lhs == rhs}'</span>)

<span class="cm"># A forger who does not know x picks random s', sends t' = g^{s'} y^{-c'} after seeing c.</span>
<span class="cm"># But since c is sent BEFORE s, the forger cannot rewrite t after the fact.</span>
<span class="cm"># Try forging without knowing x: just pick random s</span>
s_fake = <span class="fn">randmod</span>(q)
ok = <span class="fn">pow</span>(g, s_fake, p) == (t * <span class="fn">pow</span>(y, c, p)) % p
<span class="fn">print</span>(f<span class="str">'forgery accepted? {ok}  (should be False except with prob 1/q)'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sets up a toy Schnorr group with prime <code>p=2027</code>, prime-order subgroup <code>q=1013</code>, generator <code>g=2</code> — the actual algebra is the same as production Schnorr / EdDSA but in a 11-bit field for browser speed; real Ed25519 uses Curve25519's prime-order subgroup of size ~2^252. 2) The three Σ-protocol moves play out in order: prover samples nonce <code>r</code> and commits with <code>t = g^r mod p</code> (round 1); verifier sends challenge <code>c</code> (round 2); prover responds <code>s = r + c·x mod q</code> binding the secret <code>x</code> into the answer (round 3). 3) The verification line <code>g^s == t·y^c</code> works because <code>g^{r+cx} = g^r · (g^x)^c = t · y^c</code> — pure algebra, no key recovery possible without solving the discrete log. 4) The forgery attempt picks a random <code>s_fake</code> without the witness; success probability is exactly <code>1/q</code> (~10^-3 here, ~2^-252 in production) — the printout reliably shows False, and crucially this same Σ-protocol with two divergent challenges for the same <code>t</code> leaks <code>x = (s − s')/(c − c') mod q</code>, which is the PS3 ECDSA nonce-reuse disaster expressed in Schnorr form.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Fiat-Shamir — Making It Non-Interactive</h2>
<p class="l-text">A live verifier is annoying; the prover wants to publish a proof anyone can verify offline. Fiat and Shamir's 1986 transform replaces the verifier's random challenge with a hash of the prover's first message: <em>c = H(t, statement)</em>. As long as H is a random oracle, the resulting one-shot proof is as sound as the interactive one, and zero-knowledge in the random-oracle model.</p>

<div class="calc-highlight"><strong>Why Fiat-Shamir is everywhere:</strong> EdDSA signatures (Ed25519) are essentially Fiat-Shamir-Schnorr. Bitcoin's BIP-340 Schnorr signatures (2021 Taproot) are the same. Every modern non-interactive ZK proof — Groth16, Plonk, Bulletproofs, STARK — bottoms out at Fiat-Shamir.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same Schnorr proof, but the challenge is now a SHA-256 hash. Anyone with the public key can verify the proof offline.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, secrets

p, q, g = <span class="num">2027</span>, <span class="num">1013</span>, <span class="num">2</span>

<span class="kw">def</span> <span class="fn">H</span>(*parts):
    h = hashlib.<span class="fn">sha256</span>()
    <span class="kw">for</span> x <span class="kw">in</span> parts:
        h.<span class="fn">update</span>(<span class="fn">str</span>(x).<span class="fn">encode</span>())
    <span class="kw">return</span> <span class="fn">int</span>.<span class="fn">from_bytes</span>(h.<span class="fn">digest</span>(), <span class="str">'big'</span>) % q

<span class="cm"># Setup</span>
x = secrets.<span class="fn">randbelow</span>(q - <span class="num">1</span>) + <span class="num">1</span>
y = <span class="fn">pow</span>(g, x, p)

<span class="cm"># Prover produces a non-interactive proof (t, s)</span>
<span class="kw">def</span> <span class="fn">prove</span>(x, y):
    r = secrets.<span class="fn">randbelow</span>(q - <span class="num">1</span>) + <span class="num">1</span>
    t = <span class="fn">pow</span>(g, r, p)
    c = <span class="fn">H</span>(g, y, t)
    s = (r + c * x) % q
    <span class="kw">return</span> t, s

<span class="cm"># Anyone can verify</span>
<span class="kw">def</span> <span class="fn">verify</span>(y, t, s):
    c = <span class="fn">H</span>(g, y, t)
    <span class="kw">return</span> <span class="fn">pow</span>(g, s, p) == (t * <span class="fn">pow</span>(y, c, p)) % p

t, s = <span class="fn">prove</span>(x, y)
<span class="fn">print</span>(f<span class="str">'proof: (t={t}, s={s})'</span>)
<span class="fn">print</span>(f<span class="str">'verify: {verify(y, t, s)}'</span>)

<span class="cm"># Tamper with s</span>
<span class="fn">print</span>(f<span class="str">'tampered: {verify(y, t, (s + 1) % q)}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) The helper <code>H(*parts)</code> concatenates everything into one SHA-256 and reduces mod <code>q</code> — this is the heart of the Fiat-Shamir transform: replace the interactive verifier's random challenge with a hash of the public transcript so far, giving non-interactivity without weakening soundness in the random-oracle model. 2) <code>prove(x, y)</code> runs the same Schnorr Σ-protocol from section 2 but computes <code>c = H(g, y, t)</code> instead of waiting for a challenge — the prover binds itself to <code>t</code> before learning <code>c</code>, which is exactly why an EdDSA signature is just a Fiat-Shamir Schnorr proof of knowledge of the secret key. 3) <code>verify(y, t, s)</code> recomputes the same <code>c</code> from <code>(g, y, t)</code> and checks <code>g^s ≡ t · y^c (mod p)</code> — anyone with the public key can validate offline, which is the property that makes Bitcoin's BIP-340 (Taproot 2021), Zcash, Tornado Cash, and every zkSNARK / zkSTARK practical. 4) The tampering line <code>(s + 1) % q</code> shifts the response by one; the recomputed left-hand side <code>g^{s+1}</code> no longer equals <code>t · y^c</code>, so verification returns False — and unlike interactive Schnorr, no replay attack is possible because <code>c</code> is bound to <code>(g, y, t)</code> via the hash.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. zk-SNARKs — Succinct Non-Interactive Arguments of Knowledge</h2>
<p class="l-text">A SNARK is the dream version: a proof that the prover ran some arbitrary computation correctly, fitting in a few hundred bytes, verifiable in milliseconds. The "S" — succinct — means proof size and verify time are independent of the computation's size. Modern SNARKs require encoding the computation as an <strong>arithmetic circuit</strong> over a finite field, then proving you know an assignment of wires that satisfies the circuit.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Groth16 (2016)</div><div class="card-body">~200-byte proofs, ~1-3 ms verify. Per-circuit trusted setup (the "ceremony"). Used by Zcash, Tornado Cash. Pairing-based; broken by Shor's algorithm on a quantum computer.</div></div>
<div class="calc-card"><div class="card-title">Plonk (2019)</div><div class="card-body">Universal trusted setup — one ceremony works for all circuits up to a size bound. Slightly larger proofs (~1 KB). Used by zkSync, Aztec, Polygon zkEVM. KZG polynomial commitments.</div></div>
<div class="calc-card"><div class="card-title">Marlin / Sonic / Halo2</div><div class="card-body">Variants on universal setup. Halo2 (Zcash Orchard 2022) eliminates the trusted setup entirely via Inner Product Argument; powers Zcash's modern shielded pool.</div></div>
<div class="calc-card"><div class="card-title">Bulletproofs (2017)</div><div class="card-body">No trusted setup, log-size proofs (~1 KB for range proofs), but linear verify time. Used by Monero (RingCT) for confidential transactions. Slow proving for big circuits.</div></div>
</div>

<p class="l-text">The <strong>trusted setup</strong> is the catch: SNARKs need a "structured reference string" generated from secret randomness. If anyone keeps the randomness, they can forge proofs. Multi-party ceremonies (Zcash's Powers of Tau, Ethereum's KZG ceremony with 140k contributors in 2023) ensure that as long as <em>one</em> participant was honest, the setup is sound.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. zk-STARKs — Post-Quantum, No Trusted Setup</h2>
<p class="l-text">STARKs (Scalable Transparent ARguments of Knowledge), introduced by Eli Ben-Sasson et al. in 2018, trade larger proof size for two big wins: no trusted setup, and post-quantum security (rely only on hash-function collision resistance, not pairings or discrete log). The proof is built from <strong>FRI (Fast Reed-Solomon Interactive Oracle Proof of Proximity)</strong> over a Merkle tree of polynomial evaluations.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Proof size</div><div class="card-body">~50-200 KB (vs. 200 B for Groth16). Verify time: ~10 ms. Proving time scales O(n log n) — STARKs prove huge computations efficiently.</div></div>
<div class="calc-card"><div class="card-title">Cairo (StarkWare 2020)</div><div class="card-body">A Turing-complete language compiled to STARK-friendly arithmetic. Powers StarkNet (Ethereum L2) and Cairo VM. ~600k transactions per block, ~100 ms STARK verify on Ethereum L1.</div></div>
<div class="calc-card"><div class="card-title">PQ security</div><div class="card-body">STARKs survive quantum computers; SNARKs don't (Shor breaks pairings and DLog). For 50-year archival proofs (legal, identity), STARKs are the conservative choice.</div></div>
<div class="calc-card"><div class="card-title">Recursive STARKs</div><div class="card-body">A STARK that verifies another STARK. Compresses chains of proofs into one. StarkWare's Recursive Verifier reduced prover cost by 100x; Polygon Miden uses similar tech.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Real Systems — Zcash, Tornado Cash, zkSync</h2>
<p class="l-text">ZK proofs went from theory to billion-dollar systems within a decade. Three high-impact deployments:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zcash (2016)</div><div class="card-body">First production zk-SNARK. "Sapling" (2018) brought proving time from 60s to 2s. "Orchard" (2022) replaced Groth16 with Halo2 — no more per-upgrade trusted setup. Shielded pool: ~$200M of fully-private Zcash transactions.</div></div>
<div class="calc-card"><div class="card-title">Tornado Cash (2019)</div><div class="card-body">Ethereum mixer using Groth16 SNARKs. User deposits 1 ETH with a hidden commitment, withdraws to a fresh address with a proof "I know a secret matching one of the 2^20 deposits, and it has not been spent." US OFAC sanctioned the contracts in 2022; the cryptography is unchanged.</div></div>
<div class="calc-card"><div class="card-title">zkSync / StarkNet / Polygon zkEVM</div><div class="card-body">L2 rollups: thousands of Ethereum transactions executed off-chain, single proof posted on-chain. zkSync uses Plonk; StarkNet uses STARKs; Polygon zkEVM uses Plonk variants. ~$2B+ TVL across the trio in 2026.</div></div>
<div class="calc-card"><div class="card-title">zkML (EZKL, Modulus Labs)</div><div class="card-body">Prove "I ran this neural network on this input and got this output," without revealing the model or input. Use cases: prove a credit score model is fair without leaking weights; prove an AI judge ran the published model on a verdict.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Anonymous Credentials and Identity Proofs</h2>
<p class="l-text">Beyond money, ZK enables <strong>anonymous credentials</strong>: prove "I am over 18 / a student / a citizen" without revealing your identity. Microsoft's U-Prove, IBM's Idemix, and the W3C VC + BBS+ signatures spec are the academic-to-standards path. The EU's eIDAS 2.0 Digital Identity Wallet (rollout 2024-2027) mandates ZK-based selective disclosure for member-state IDs by default.</p>

<div class="calc-highlight"><strong>What gets unlocked:</strong> Age-gating without leaking your name. Proving residency for a tax exemption without exposing your full address. KYC for a bank without that bank holding your passport. Anti-Sybil voting where each citizen proves "I have not voted yet" without revealing who they are. ZK is the only known cryptography that gets us there.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Building Blocks — Commitments, Sigma Protocols, Polynomial Commitments</h2>
<p class="l-text">Modern ZK proofs are layer cakes. Bottom layer: <strong>commitments</strong> (Pedersen, KZG, FRI / Merkle). A commitment is a value <em>com</em> that hides a secret <em>m</em> (hiding) and cannot be opened to a different m' (binding). Pedersen: <em>com = g^m h^r</em>. KZG: commit to a polynomial p(X) by evaluating it on a hidden point in the trusted setup.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Pedersen commitment over a small group. We commit to a value, send the commitment, then open it later by revealing (m, r).</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets

<span class="cm"># Toy group of order q</span>
p, q = <span class="num">2027</span>, <span class="num">1013</span>
g, h = <span class="num">2</span>, <span class="num">5</span>  <span class="cm"># two independent generators (for toy params)</span>

<span class="kw">def</span> <span class="fn">commit</span>(m, r):
    <span class="kw">return</span> (<span class="fn">pow</span>(g, m, p) * <span class="fn">pow</span>(h, r, p)) % p

<span class="kw">def</span> <span class="fn">open_commit</span>(com, m, r):
    <span class="kw">return</span> <span class="fn">commit</span>(m, r) == com

<span class="cm"># Alice commits to her bid</span>
m_alice = <span class="num">7</span>   <span class="cm"># bid amount</span>
r_alice = secrets.<span class="fn">randbelow</span>(q - <span class="num">1</span>) + <span class="num">1</span>
c_alice = <span class="fn">commit</span>(m_alice, r_alice)

<span class="fn">print</span>(f<span class="str">'Alice commits: {c_alice} (bid hidden)'</span>)
<span class="cm"># Time passes... auction reveals</span>
<span class="fn">print</span>(f<span class="str">'Alice opens (m={m_alice}, r={r_alice}): valid = {open_commit(c_alice, m_alice, r_alice)}'</span>)

<span class="cm"># Alice cannot lie: try opening to m=8</span>
<span class="fn">print</span>(f<span class="str">'Alice tries m=8: valid = {open_commit(c_alice, 8, r_alice)}'</span>)

<span class="cm"># Hiding: same com from different (m, r) is computationally infeasible to find</span>
<span class="cm"># Binding: opening to two different m would require knowing log_g(h) which we do not know</span>
</code></pre></div></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Picks two "independent" generators <code>g=2</code>, <code>h=5</code> in the toy Schnorr group — in production the second generator must be a "nothing-up-my-sleeve" value where no one knows <code>log_g(h)</code>; KZG ceremonies and BLS signature setups use exactly this trick to make the second generator's discrete log unknown to everyone. 2) <code>commit(m, r) = g^m · h^r mod p</code> is the standard Pedersen commitment — multiplying by <code>h^r</code> with a random <code>r</code> gives <em>perfect hiding</em> (any value of <code>m</code> looks identical in distribution because <code>r</code> randomizes the result uniformly across the group). 3) <code>open_commit</code> simply recomputes <code>commit(m, r)</code> and checks equality — Alice publishes <code>c_alice</code> at bid time (witness hidden) and reveals <code>(m_alice, r_alice)</code> after auction close; the printed line <code>valid = True</code> confirms the legitimate opening. 4) The "try opening to m=8" line demonstrates <em>binding</em>: changing the message but keeping <code>r</code> changes <code>g^m h^r</code>, so <code>open_commit</code> returns False — to forge a different opening Alice would need to solve <code>log_g(h)</code>, which is the discrete-log problem on the chosen group; this is exactly why Pedersen commitments are the bottom layer of Bulletproofs, Plonk, and every modern range-proof system.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Pitfalls — Trusted Setup, Soundness Bugs, Side-Channels</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Forgetting the trusted setup</div><div class="card-body">Groth16 with a leaked toxic waste = unlimited forgery. Always use a multi-party ceremony with diverse contributors. Zcash 1.0's original ceremony is famously paranoid (Radio Shack random.org dice on a plane).</div></div>
<div class="calc-card"><div class="card-title">Soundness bugs in circuits</div><div class="card-body">A constraint missing from the R1CS / Plonkish circuit lets a malicious prover assign wires freely. ZK auditors (Veridise, Trail of Bits, Zellic) found 100+ such bugs in mainnet zkEVMs 2022-2025. Formal verification (Picus, Coda) catching up.</div></div>
<div class="calc-card"><div class="card-title">Fiat-Shamir bias</div><div class="card-body">Hashing only part of the transcript (forgetting to include the public inputs) lets the attacker grind a favorable challenge. The "Frozen Heart" vulnerabilities (2022) hit Bulletproofs, PlonK, and Spartan implementations across multiple libs.</div></div>
<div class="calc-card"><div class="card-title">Prover side-channels</div><div class="card-body">Proving time leaks through cache and timing. zkML on private inputs needs constant-time proof generation, which most libraries do not do.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary and What's Next</h2>
<p class="l-text">Zero-knowledge proofs let you prove anything you can express as a circuit while revealing nothing extra. Schnorr + Fiat-Shamir is the foundation; SNARKs (Groth16, Plonk, Halo2) and STARKs (Cairo) are the modern industrial systems; Zcash, Tornado Cash, zkSync, and zkML are the deployment ground. The mathematical sophistication is real — but the user-facing API is just "verify(proof, public_inputs) → bool."</p>

<p class="l-text">Lesson 6 turns to <strong>Homomorphic Encryption</strong> — a different shape of "compute on encrypted data." Where ZK proves you ran a computation correctly, HE lets the server <em>actually run the computation</em> on ciphertexts and return an encrypted result, without ever decrypting. From Paillier (1999, additively homomorphic) to Gentry's 2009 fully-homomorphic breakthrough to today's CKKS-on-GPU encrypted ML inference.</p>
</div>`,
tr: `<p class="l-text"><strong>Sıfır-Bilgi kanıtları (ZK) ilk duyduğunuzda imkânsız gelir: bir sırrı bildiğinizi <em>sır hakkında hiçbir şey açığa vurmadan</em> kanıtlarsınız.</strong> Goldwasser, Micali ve Rackoff kavramı 1985'te çığır açan "The Knowledge Complexity of Interactive Proof Systems" makalesinde tanımladı — Goldwasser'a 2012 Turing Ödülü'nü kazandıran aynı makale. Fikir on yıllarca teori makalelerinde oturdu, sonra kripto para dünyası onunla çarpıştı: Zcash (2016) Bitcoin işlemlerine gizlilik vermek için ilk üretim zk-SNARK'ı çıkardı; Tornado Cash (2019) Ethereum transferlerini anonimleştirdi; zkSync, StarkNet ve Polygon zkEVM (2023+) binlerce Ethereum işlemini milisaniyede doğrulanabilen tek bir kanıta sıkıştırır.</p>

<p class="l-text">Bu derste bir ZK kanıtının üç sütununu — tamlık, sağlamlık, sıfır-bilgi — yürüyoruz, küçük bir asal alan üzerinde Schnorr'un etkileşimli kimlik şemasını (1989) uyguluyoruz, onu etkileşimsiz hâle getirmek için <strong>Fiat-Shamir dönüşümünü</strong> (1986) uyguluyoruz, modern manzarayı (Groth16, Plonk, zk-STARK'lar, Bulletproofs) çiziyoruz ve matematiği gerçek uygulamalarına bağlıyoruz: anonim kimlik bilgileri (Microsoft U-Prove), özel ödemeler (Zcash, Tornado Cash), zk-rollup'lar (zkSync, StarkNet) ve makine öğrenimi model doğrulaması (zkML).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Üç ZK özelliğini ifade edin (tamlık, sağlamlık, sıfır-bilgi)</li>
<li>Schnorr'un Σ-protokolünü ayrık log bilgisi için elle ve Python'da çalıştırın</li>
<li>Fiat-Shamir dönüşümünü uygulayın: 3-mesajlı etkileşimli bir kanıtı tek etkileşimsiz bir blob'a dönüştürün</li>
<li>zk-SNARK ailelerini karşılaştırın: Groth16 (küçük kanıt, güvenilir kurulum), Plonk (evrensel kurulum), Bulletproofs (kurulum yok, log boyutu)</li>
<li>zk-STARK'ları SNARK'larla karşılaştırın: post-kuantum, güvenilir kurulum yok, daha büyük kanıtlar</li>
<li>Gerçek sistemleri izleyin: Zcash, Tornado Cash, zkSync, StarkNet, zkML (EZKL)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç Özellik — Tamlık, Sağlamlık, Sıfır-Bilgi</h2>
<p class="l-text">Kanıtlayan P ve Doğrulayan V arasındaki bir sıfır-bilgi kanıt sistemi, P'nin V'yi bir ifadenin doğru olduğuna ikna ettiği üç garantili bir protokoldür:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tamlık</div><div class="card-body">İfade doğruysa ve P tanığı biliyorsa, V kabul eder (≥ 1 - ihmal edilebilir olasılıkla). Dürüst kanıtlayan her zaman kazanır.</div></div>
<div class="calc-card"><div class="card-title">Sağlamlık</div><div class="card-body">İfade yanlışsa (geçerli tanık yoksa), hile yapan hiçbir P* V'yi ihmal edilebilir olasılık dışında ikna edemez. Bilgi sağlamlığı daha güçlüdür: bir çıkarıcının onu çekebilmesi anlamında P aslında tanığı <em>bilir</em>.</div></div>
<div class="calc-card"><div class="card-title">Sıfır-bilgi</div><div class="card-body">V ifadenin doğruluğunun ötesinde <em>hiçbir şey</em> öğrenmez. Resmî olarak: yalnızca ifade verildiğinde, gerçek bir kanıtlayan-doğrulayan transkriptinden ayırt edilemez bir transkript çıkaran bir simülatör S vardır.</div></div>
<div class="calc-card"><div class="card-title">Klasik sezgi</div><div class="card-body">"Ali Baba'nın mağarası" hikayesi (Quisquater 1989): P, iki mağara dalı arasındaki kapıyı açan sihirli kelimeyi bildiğini, onu hiç söylemeden kanıtlayabilir. Yeterince tekrarlayın ve V ikna olur; bir dinleyici hiçbir şey öğrenmez.</div></div>
</div>

<p class="l-text">GMR'nin 1985 tanımının parlaklığı, sıfır-bilginin bir simülatörün varlığı tarafından yakalanmasıdır. Bir transkript tanık olmadan sahteleştirilebiliyorsa, transkript tanık hakkında — gerçek olduğunda bile — hiçbir yararlı bilgi açığa vurmaz.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Schnorr'un Kimlik Protokolü — Ayrık Log Bilgisi</h2>
<p class="l-text">Claus Schnorr'un 1989 protokolü ayrık bir log bilgisini kanıtlar: P, genel <em>y = g^x mod p</em> ile gizli <em>x</em>'i tutar. P, V'ye onu açığa vurmadan x'i bildiğini kanıtlar. Üç mesaj, <strong>Σ-protokolü</strong> olarak adlandırılır (mesaj akışının şekli için "Sigma"):</p>

<div class="katex-block">$$\\begin{aligned} & \\text{1. P picks } r \\leftarrow \\mathbb{Z}_q, \\text{ sends } t = g^r \\\\ & \\text{2. V picks challenge } c \\leftarrow \\mathbb{Z}_q, \\text{ sends } c \\\\ & \\text{3. P sends } s = r + cx \\bmod q \\\\ & \\text{V checks: } g^s \\stackrel{?}{=} t \\cdot y^c \\end{aligned}$$</div>

<p class="l-text">Neden çalışır: <em>g^s = g^{r+cx} = g^r · g^{cx} = t · y^c</em>. Neden sıfır-bilgidir: bir simülatör önce s ve c seçebilir, t = g^s · y^{-c} ayarlayabilir ve mükemmel dağıtılmış bir transkript üretebilir — x asla gerekmez. Neden sağlamdır: kötü niyetli bir kanıtlayan aynı t için iki farklı c, c' meydan okumasına yanıt verirse, doğrulayıcı x = (s - s')/(c - c') mod q için çözüm bulabilir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük bir asal alan üzerinde Schnorr kimliği. Doğrulayıcının dürüst çalışmayı kabul edip sahte olanı reddettiğini izleyin.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets

<span class="cm"># Oyuncak Schnorr grubu: q asal mertebesindeki Z_p* alt grubu</span>
p = <span class="num">2027</span>  <span class="cm"># asal</span>
q = <span class="num">1013</span>  <span class="cm"># (p-1)/2 de asal — q mertebeli Schnorr grubu</span>
g = <span class="num">2</span>     <span class="cm"># q mertebesi üreteci (bu oyuncak parametreler için çalışır)</span>

<span class="kw">def</span> <span class="fn">randmod</span>(n):
    <span class="kw">return</span> secrets.<span class="fn">randbelow</span>(n - <span class="num">1</span>) + <span class="num">1</span>

<span class="cm"># Kanıtlayanın gizli ve genel anahtarı</span>
x = <span class="fn">randmod</span>(q)
y = <span class="fn">pow</span>(g, x, p)
<span class="fn">print</span>(f<span class="str">'public key y = g^x mod p = {y}'</span>)

<span class="cm"># --- 1. Round ---</span>
r = <span class="fn">randmod</span>(q)
t = <span class="fn">pow</span>(g, r, p)

<span class="cm"># --- 2. Round ---</span>
c = <span class="fn">randmod</span>(q)

<span class="cm"># --- 3. Round ---</span>
s = (r + c * x) % q

<span class="cm"># --- Doğrula ---</span>
lhs = <span class="fn">pow</span>(g, s, p)
rhs = (t * <span class="fn">pow</span>(y, c, p)) % p
<span class="fn">print</span>(f<span class="str">'g^s = {lhs},  t * y^c = {rhs}  ->  accept = {lhs == rhs}'</span>)

<span class="cm"># x'i bilmeyen bir sahteci, c'yi gördükten sonra rastgele s' seçer, t' = g^{s'} y^{-c'} gönderir.</span>
<span class="cm"># Ama c, s'den ÖNCE gönderildiğinden, sahteci t'yi sonradan yeniden yazamaz.</span>
<span class="cm"># x'i bilmeden sahtelemeyi dene: sadece rastgele s seç</span>
s_fake = <span class="fn">randmod</span>(q)
ok = <span class="fn">pow</span>(g, s_fake, p) == (t * <span class="fn">pow</span>(y, c, p)) % p
<span class="fn">print</span>(f<span class="str">'forgery accepted? {ok}  (should be False except with prob 1/q)'</span>)
</code></pre></div></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Asal <code>p=2027</code>, asal-mertebeli alt grup <code>q=1013</code>, üreteç <code>g=2</code> ile oyuncak Schnorr grubu kurar — gerçek cebir üretim Schnorr / EdDSA ile aynı ama tarayıcı hızı için 11-bit alanda; gerçek Ed25519 Curve25519'un ~2^252 boyutlu asal-mertebeli alt grubunu kullanır. 2) Üç Σ-protokol hamlesi sırayla oynanır: prover nonce <code>r</code> örnekler ve <code>t = g^r mod p</code> ile commit eder (tur 1); verifier challenge <code>c</code> gönderir (tur 2); prover gizli <code>x</code>'i cevaba bağlayan <code>s = r + c·x mod q</code> ile yanit verir (tur 3). 3) Doğrulama satırı <code>g^s == t·y^c</code>, <code>g^{r+cx} = g^r · (g^x)^c = t · y^c</code> çünkü işe yarar — saf cebir, discrete log çözmeden anahtar kurtarma yok. 4) Sahtelik denemesi witness olmadan rastgele bir <code>s_fake</code> seçer; başarı olasılığı tam olarak <code>1/q</code>'dur (~10^-3 burada, üretimde ~2^-252) — çıktı güvenilir şekilde False gösterir, ve kritik olarak aynı Σ-protokol aynı <code>t</code> için iki farklı challenge ile <code>x = (s − s')/(c − c') mod q</code>'yi sızdırır, ki bu Schnorr formunda ifade edilen PS3 ECDSA nonce-tekrar felaketidir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Fiat-Shamir — Etkileşimsiz Hâle Getirmek</h2>
<p class="l-text">Canlı bir doğrulayıcı can sıkıcıdır; kanıtlayan herkesin çevrimdışı doğrulayabileceği bir kanıt yayımlamak ister. Fiat ve Shamir'in 1986 dönüşümü, doğrulayıcının rastgele meydan okumasını kanıtlayanın ilk mesajının bir hash'i ile değiştirir: <em>c = H(t, statement)</em>. H bir rastgele oracle olduğu sürece, ortaya çıkan tek-seferlik kanıt etkileşimli olan kadar sağlamdır ve rastgele-oracle modelinde sıfır-bilgidir.</p>

<div class="calc-highlight"><strong>Fiat-Shamir neden her yerde:</strong> EdDSA imzaları (Ed25519) esasen Fiat-Shamir-Schnorr'dur. Bitcoin'in BIP-340 Schnorr imzaları (2021 Taproot) aynıdır. Her modern etkileşimsiz ZK kanıtı — Groth16, Plonk, Bulletproofs, STARK — Fiat-Shamir'de dibe iner.</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı Schnorr kanıtı, ama meydan okuma artık bir SHA-256 hash'i. Genel anahtara sahip herkes kanıtı çevrimdışı doğrulayabilir.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, secrets

p, q, g = <span class="num">2027</span>, <span class="num">1013</span>, <span class="num">2</span>

<span class="kw">def</span> <span class="fn">H</span>(*parts):
    h = hashlib.<span class="fn">sha256</span>()
    <span class="kw">for</span> x <span class="kw">in</span> parts:
        h.<span class="fn">update</span>(<span class="fn">str</span>(x).<span class="fn">encode</span>())
    <span class="kw">return</span> <span class="fn">int</span>.<span class="fn">from_bytes</span>(h.<span class="fn">digest</span>(), <span class="str">'big'</span>) % q

<span class="cm"># Kurulum</span>
x = secrets.<span class="fn">randbelow</span>(q - <span class="num">1</span>) + <span class="num">1</span>
y = <span class="fn">pow</span>(g, x, p)

<span class="cm"># Kanıtlayan etkileşimsiz bir kanıt üretir (t, s)</span>
<span class="kw">def</span> <span class="fn">prove</span>(x, y):
    r = secrets.<span class="fn">randbelow</span>(q - <span class="num">1</span>) + <span class="num">1</span>
    t = <span class="fn">pow</span>(g, r, p)
    c = <span class="fn">H</span>(g, y, t)
    s = (r + c * x) % q
    <span class="kw">return</span> t, s

<span class="cm"># Herkes doğrulayabilir</span>
<span class="kw">def</span> <span class="fn">verify</span>(y, t, s):
    c = <span class="fn">H</span>(g, y, t)
    <span class="kw">return</span> <span class="fn">pow</span>(g, s, p) == (t * <span class="fn">pow</span>(y, c, p)) % p

t, s = <span class="fn">prove</span>(x, y)
<span class="fn">print</span>(f<span class="str">'proof: (t={t}, s={s})'</span>)
<span class="fn">print</span>(f<span class="str">'verify: {verify(y, t, s)}'</span>)

<span class="cm"># s'yi kurcala</span>
<span class="fn">print</span>(f<span class="str">'tampered: {verify(y, t, (s + 1) % q)}'</span>)
</code></pre></div></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>H(*parts)</code> yardımcısı her şeyi tek bir SHA-256'ya birleştirir ve mod <code>q</code> indirger — bu Fiat-Shamir dönüşümünün kalbidir: interactive verifier'in rastgele challenge'ini şimdiye kadarki public transcript'in hash'i ile değiştir, random-oracle modelinde sağlamlığı zayıflatmadan interaktif olmayan hale getir. 2) <code>prove(x, y)</code> bölüm 2'deki aynı Schnorr Σ-protokolünü çalıştırır ama challenge beklemek yerine <code>c = H(g, y, t)</code> hesaplar — prover <code>c</code>'yi öğrenmeden önce kendini <code>t</code>'ye bağlar, ki bu tam olarak bir EdDSA imzasının neden gizli anahtarın bilgisine dair Fiat-Shamir Schnorr kanıtı olduğunu açıklar. 3) <code>verify(y, t, s)</code> aynı <code>c</code>'yi <code>(g, y, t)</code>'den yeniden hesaplar ve <code>g^s ≡ t · y^c (mod p)</code>'yi kontrol eder — public key'i olan herkes çevrimdışı doğrulayabilir, bu Bitcoin'in BIP-340'ini (Taproot 2021), Zcash'i, Tornado Cash'i ve her zkSNARK / zkSTARK'i pratik yapan özelliktir. 4) Kurcalama satırı <code>(s + 1) % q</code> yanıtı bir kaydırır; yeniden hesaplanan sol taraf <code>g^{s+1}</code> artık <code>t · y^c</code>'ye eşit değildir, dogrulama False döner — ve interaktif Schnorr'un aksine, replay saldırısı mümkün değil çünkü <code>c</code> hash aracılığıyla <code>(g, y, t)</code>'ye bağlı.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. zk-SNARK'lar — Kısa Etkileşimsiz Bilgi Argümanları</h2>
<p class="l-text">Bir SNARK rüya versiyonudur: kanıtlayanın bazı keyfi hesaplamayı doğru çalıştırdığının kanıtı, birkaç yüz bayta sığar, milisaniyelerde doğrulanabilir. "S" — succinct (kısa) — kanıt boyutu ve doğrulama süresinin hesaplama boyutundan bağımsız olduğu anlamına gelir. Modern SNARK'lar hesaplamayı sonlu bir alan üzerinde bir <strong>aritmetik devre</strong> olarak kodlamayı, sonra devreyi karşılayan bir kablo atamasını bildiğinizi kanıtlamayı gerektirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Groth16 (2016)</div><div class="card-body">~200-baytlık kanıtlar, ~1-3 ms doğrulama. Devre başına güvenilir kurulum ("seremoni"). Zcash, Tornado Cash tarafından kullanılır. Eşleşme tabanlı; bir kuantum bilgisayarda Shor algoritması tarafından kırılır.</div></div>
<div class="calc-card"><div class="card-title">Plonk (2019)</div><div class="card-body">Evrensel güvenilir kurulum — bir seremoni belirli bir boyut sınırına kadar tüm devreler için çalışır. Biraz daha büyük kanıtlar (~1 KB). zkSync, Aztec, Polygon zkEVM tarafından kullanılır. KZG polinom taahhütleri.</div></div>
<div class="calc-card"><div class="card-title">Marlin / Sonic / Halo2</div><div class="card-body">Evrensel kurulum üzerinde varyantlar. Halo2 (Zcash Orchard 2022) İç Çarpım Argümanı aracılığıyla güvenilir kurulumu tamamen ortadan kaldırır; Zcash'in modern korumalı havuzunu güçlendirir.</div></div>
<div class="calc-card"><div class="card-title">Bulletproofs (2017)</div><div class="card-body">Güvenilir kurulum yok, log boyutlu kanıtlar (aralık kanıtları için ~1 KB), ancak doğrusal doğrulama süresi. Gizli işlemler için Monero (RingCT) tarafından kullanılır. Büyük devreler için yavaş kanıtlama.</div></div>
</div>

<p class="l-text"><strong>Güvenilir kurulum</strong> püf noktasıdır: SNARK'lar gizli rastgelelikten üretilen bir "yapılandırılmış referans dizesine" ihtiyaç duyar. Birisi rastgeleliği saklarsa, kanıtları sahteleştirebilir. Çok taraflı seremoniler (Zcash'in Powers of Tau'su, Ethereum'un 2023'te 140 bin katkıcılı KZG seremonisi) <em>bir</em> katılımcı dürüst olduğu sürece kurulumun sağlam olmasını sağlar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. zk-STARK'lar — Post-Kuantum, Güvenilir Kurulum Yok</h2>
<p class="l-text">Eli Ben-Sasson ve diğerleri tarafından 2018'de tanıtılan STARK'lar (Scalable Transparent ARguments of Knowledge), iki büyük kazanç için daha büyük kanıt boyutunu takas eder: güvenilir kurulum yok ve post-kuantum güvenliği (yalnızca hash-fonksiyonu çakışma direncine güvenir, eşleşmelere veya ayrık loga değil). Kanıt, polinom değerlendirmelerinin bir Merkle ağacı üzerinde <strong>FRI (Fast Reed-Solomon Interactive Oracle Proof of Proximity)</strong>'den inşa edilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kanıt boyutu</div><div class="card-body">~50-200 KB (Groth16 için 200 B'ye karşı). Doğrulama süresi: ~10 ms. Kanıtlama süresi O(n log n) ölçeklenir — STARK'lar büyük hesaplamaları verimli kanıtlar.</div></div>
<div class="calc-card"><div class="card-title">Cairo (StarkWare 2020)</div><div class="card-body">STARK-dostu aritmetiğe derlenen Turing-tamamlanmış bir dil. StarkNet'i (Ethereum L2) ve Cairo VM'i çalıştırır. Blok başına ~600 bin işlem, Ethereum L1'de ~100 ms STARK doğrulaması.</div></div>
<div class="calc-card"><div class="card-title">PQ güvenliği</div><div class="card-body">STARK'lar kuantum bilgisayarlardan kurtulur; SNARK'lar değil (Shor eşleşmeleri ve DLog'u kırar). 50 yıllık arşiv kanıtları (yasal, kimlik) için STARK'lar muhafazakâr seçimdir.</div></div>
<div class="calc-card"><div class="card-title">Özyinelemeli STARK'lar</div><div class="card-body">Başka bir STARK'ı doğrulayan bir STARK. Kanıt zincirlerini birine sıkıştırır. StarkWare'in Recursive Verifier'ı kanıtlayıcı maliyetini 100 kat azalttı; Polygon Miden benzer teknolojiyi kullanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Gerçek Sistemler — Zcash, Tornado Cash, zkSync</h2>
<p class="l-text">ZK kanıtları on yıl içinde teoriden milyar dolarlık sistemlere geçti. Üç yüksek etkili dağıtım:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Zcash (2016)</div><div class="card-body">İlk üretim zk-SNARK'ı. "Sapling" (2018) kanıtlama süresini 60 saniyeden 2 saniyeye indirdi. "Orchard" (2022) Groth16'yı Halo2 ile değiştirdi — yükseltme başına güvenilir kurulum yok. Korumalı havuz: ~200 milyon dolar tamamen özel Zcash işlemi.</div></div>
<div class="calc-card"><div class="card-title">Tornado Cash (2019)</div><div class="card-body">Groth16 SNARK'ları kullanan Ethereum karıştırıcı. Kullanıcı gizli bir taahhütle 1 ETH yatırır, "2^20 yatırımdan birine eşleşen bir sırrı biliyorum ve harcanmamış" kanıtıyla yeni bir adrese çekilir. ABD OFAC sözleşmeleri 2022'de yaptırım uyguladı; kriptografi değişmedi.</div></div>
<div class="calc-card"><div class="card-title">zkSync / StarkNet / Polygon zkEVM</div><div class="card-body">L2 rollup'lar: zincir dışı yürütülen binlerce Ethereum işlemi, zincir üstüne tek kanıt. zkSync Plonk kullanır; StarkNet STARK'lar kullanır; Polygon zkEVM Plonk varyantları kullanır. 2026'da üçlüsü arasında ~2 milyar dolar+ TVL.</div></div>
<div class="calc-card"><div class="card-title">zkML (EZKL, Modulus Labs)</div><div class="card-body">"Bu sinir ağını bu girdide çalıştırdım ve bu çıktıyı aldım"ı, modeli veya girdiyi açığa vurmadan kanıtlayın. Kullanım durumları: ağırlıkları sızdırmadan bir kredi puanı modelinin adil olduğunu kanıtlama; bir AI hâkiminin yayınlanan modeli bir kararda çalıştırdığını kanıtlama.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Anonim Kimlik Bilgileri ve Kimlik Kanıtları</h2>
<p class="l-text">Para ötesinde, ZK <strong>anonim kimlik bilgilerini</strong> mümkün kılar: kimliğinizi açığa vurmadan "18 yaşından büyüğüm / öğrenciyim / vatandaşım" kanıtlayın. Microsoft'un U-Prove'u, IBM'in Idemix'i ve W3C VC + BBS+ imzaları spesifikasyonu akademiden standartlara giden yoldur. AB'nin eIDAS 2.0 Dijital Kimlik Cüzdanı (2024-2027 dağıtımı) üye-devlet kimlikleri için varsayılan olarak ZK tabanlı seçici ifşayı zorunlu kılar.</p>

<div class="calc-highlight"><strong>Neyin kilidi açılır:</strong> Adınızı sızdırmadan yaş kontrolü. Tam adresinizi açığa vurmadan vergi muafiyeti için ikamet kanıtı. O bankanın pasaportunuzu tutmadan bir banka için KYC. Her vatandaşın kim olduklarını açığa vurmadan "Henüz oy vermedim" kanıtladığı anti-Sybil oylama. ZK, bizi oraya götüren bilinen tek kriptografidir.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Yapı Taşları — Taahhütler, Sigma Protokolleri, Polinom Taahhütleri</h2>
<p class="l-text">Modern ZK kanıtları katmanlı pastalardır. Alt katman: <strong>taahhütler</strong> (Pedersen, KZG, FRI / Merkle). Bir taahhüt, bir <em>m</em> sırrını gizleyen (gizleme) ve farklı bir m''ye açılamayan (bağlama) bir <em>com</em> değeridir. Pedersen: <em>com = g^m h^r</em>. KZG: bir polinom p(X)'e güvenilir kurulumda gizli bir noktada değerlendirerek taahhüt edin.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px"><div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div><p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Küçük bir grup üzerinde Pedersen taahhüdü. Bir değere taahhüt ediyoruz, taahhüdü gönderiyoruz, sonra (m, r) açıklayarak açıyoruz.</p><div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> secrets

<span class="cm"># q mertebeli oyuncak grup</span>
p, q = <span class="num">2027</span>, <span class="num">1013</span>
g, h = <span class="num">2</span>, <span class="num">5</span>  <span class="cm"># iki bağımsız üreteç (oyuncak parametreler için)</span>

<span class="kw">def</span> <span class="fn">commit</span>(m, r):
    <span class="kw">return</span> (<span class="fn">pow</span>(g, m, p) * <span class="fn">pow</span>(h, r, p)) % p

<span class="kw">def</span> <span class="fn">open_commit</span>(com, m, r):
    <span class="kw">return</span> <span class="fn">commit</span>(m, r) == com

<span class="cm"># Alice teklifine taahhüt eder</span>
m_alice = <span class="num">7</span>   <span class="cm"># teklif tutarı</span>
r_alice = secrets.<span class="fn">randbelow</span>(q - <span class="num">1</span>) + <span class="num">1</span>
c_alice = <span class="fn">commit</span>(m_alice, r_alice)

<span class="fn">print</span>(f<span class="str">'Alice commits: {c_alice} (bid hidden)'</span>)
<span class="cm"># Zaman geçer... ihale açıklanır</span>
<span class="fn">print</span>(f<span class="str">'Alice opens (m={m_alice}, r={r_alice}): valid = {open_commit(c_alice, m_alice, r_alice)}'</span>)

<span class="cm"># Alice yalan söyleyemez: m=8'e açmayı dene</span>
<span class="fn">print</span>(f<span class="str">'Alice tries m=8: valid = {open_commit(c_alice, 8, r_alice)}'</span>)

<span class="cm"># Gizleme: farklı (m, r)'den aynı com'u bulmak hesaplamalı olarak imkânsızdır</span>
<span class="cm"># Bağlama: iki farklı m'ye açma, log_g(h)'yi bilmemizi gerektirir ki bilmiyoruz</span>
</code></pre></div></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Oyuncak Schnorr grubunda iki "bağımsız" üreteç <code>g=2</code>, <code>h=5</code> seçer — üretimde ikinci üreteç kimsenin <code>log_g(h)</code>'yi bilmediği bir "nothing-up-my-sleeve" değer olmalıdır; KZG seremonileri ve BLS imza kurulumları ikinci üretecin discrete log'unu herkes için bilinmez kılmak için tam olarak bu hileyi kullanır. 2) <code>commit(m, r) = g^m · h^r mod p</code> standart Pedersen commitment'tir — rastgele <code>r</code> ile <code>h^r</code> çarpmak <em>mükemmel gizleme</em> verir (her <code>m</code> değeri dağılımda özdeş görünür çünkü <code>r</code> sonucu grup boyunca düzgün rastgeleştirir). 3) <code>open_commit</code> sadece <code>commit(m, r)</code>'yi yeniden hesaplar ve eşitlik kontrolü yapar — Alice ihale zamanında <code>c_alice</code> yayınlar (witness gizli) ve ihale kapanışından sonra <code>(m_alice, r_alice)</code>'ı açıklar; yazdırılan satır <code>valid = True</code> meşru açılışı doğrular. 4) "m=8'e açmayı dene" satırı <em>bağlamayı</em> gösterir: <code>r</code>'yi koruyup mesajı değiştirmek <code>g^m h^r</code>'yi değiştirir, bu yüzden <code>open_commit</code> False döner — farklı bir açılışı sahteleştirmek için Alice'in seçilen grupta discrete-log problemini, yani <code>log_g(h)</code>'yi çözmesi gerekir; bu tam olarak Pedersen commitment'larin neden Bulletproofs, Plonk ve her modern range-proof sisteminin alt katmanı olduğunu açıklar.</p>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Tuzaklar — Güvenilir Kurulum, Sağlamlık Hataları, Yan-Kanallar</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Güvenilir kurulumu unutma</div><div class="card-body">Sızdırılmış zehirli atıkla Groth16 = sınırsız sahteleştirme. Her zaman çeşitli katkıcılarla çok-taraflı bir seremoni kullanın. Zcash 1.0'ın orijinal seremonisi ünlü şekilde paranoyaktır (uçaktaki Radio Shack random.org zarları).</div></div>
<div class="calc-card"><div class="card-title">Devrelerde sağlamlık hataları</div><div class="card-body">R1CS / Plonkish devresinden eksik bir kısıtlama, kötü niyetli bir kanıtlayanın kabloları serbestçe atamasına izin verir. ZK denetçileri (Veridise, Trail of Bits, Zellic) 2022-2025 mainnet zkEVM'lerinde 100+ böyle hata buldu. Resmi doğrulama (Picus, Coda) yetişiyor.</div></div>
<div class="calc-card"><div class="card-title">Fiat-Shamir yanlılığı</div><div class="card-body">Transkriptin yalnızca bir kısmını hash'lemek (genel girdileri dahil etmeyi unutmak) saldırganın elverişli bir meydan okumayı öğütmesine izin verir. "Frozen Heart" zafiyetleri (2022) birden çok kütüphanede Bulletproofs, PlonK ve Spartan uygulamalarına vurdu.</div></div>
<div class="calc-card"><div class="card-title">Kanıtlayıcı yan-kanalları</div><div class="card-body">Kanıtlama süresi önbellek ve zamanlama yoluyla sızar. Özel girdilerde zkML, çoğu kütüphanenin yapmadığı sabit-zamanlı kanıt üretmeye ihtiyaç duyar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki Adım</h2>
<p class="l-text">Sıfır-bilgi kanıtları, devre olarak ifade edebileceğiniz herhangi bir şeyi fazladan hiçbir şey açığa vurmadan kanıtlamanıza izin verir. Schnorr + Fiat-Shamir temeldir; SNARK'lar (Groth16, Plonk, Halo2) ve STARK'lar (Cairo) modern endüstriyel sistemlerdir; Zcash, Tornado Cash, zkSync ve zkML dağıtım zeminidir. Matematiksel sofistike gerçektir — ancak kullanıcıya yönelik API yalnızca "verify(proof, public_inputs) → bool"dur.</p>

<p class="l-text">Ders 6 farklı bir "şifrelenmiş veri üzerinde hesaplama" şekli olan <strong>Homomorfik Şifreleme</strong>'ye döner. ZK'nın bir hesaplamayı doğru çalıştırdığınızı kanıtladığı yerde, HE sunucunun şifreli metinler üzerinde hesaplamayı <em>gerçekten çalıştırmasına</em> ve şifre çözmeden şifrelenmiş bir sonuç döndürmesine izin verir. Paillier'den (1999, ek olarak homomorfik) Gentry'nin 2009 tamamen-homomorfik atılımına, günümüzün GPU üzerinde CKKS şifreli ML çıkarımına.</p>
</div>`
};
