window.BLOCKCHAIN_L6 = {
en: `<p class="l-text"><strong>Layer-2 scaling is how Ethereum kept its philosophy of decentralization while making transactions cheap.</strong> The L1 secures consensus and data; the L2 takes the heavy compute and posts a proof of correctness back. The architecture, foreshadowed in Vitalik Buterin's "Plasma" 2017 paper and crystallized in his "rollup-centric roadmap" 2020 post, has now produced two dominant families: <strong>optimistic rollups</strong> (Arbitrum, Optimism, Base) which assume validity and challenge with fraud proofs, and <strong>ZK rollups</strong> (zkSync Era, StarkNet, Polygon zkEVM, Linea, Scroll) which prove validity cryptographically up front.</p>

<p class="l-text">In this lesson we cover the rollup mental model in full: the difference between <strong>fraud proofs</strong> and <strong>validity proofs</strong>, the <strong>EVM-equivalence</strong> spectrum (Type 1 through Type 4 zkEVMs per Vitalik's classification), the role of <strong>data availability</strong> (EIP-4844 blobs, Celestia, EigenDA), and the cryptographic primitives that make ZK work — Groth16, PLONK, STARKs, KZG commitments. We finish with a working Python "validity proof verifier" simulator on synthetic state transitions.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Optimistic rollups: 7-day challenge window, fraud proofs (Cannon for OP, BoLD for Arbitrum)</li>
<li>ZK rollups: validity proofs, prover bottleneck, ms-time on-chain verification</li>
<li>EVM-equivalence types: Type 1 (Ethereum-equivalent) → Type 4 (high-level-language equivalent)</li>
<li>Data availability: blob market (EIP-4844, March 2024), Celestia, EigenDA, danksharding</li>
<li>ZK primitives: Groth16 (trusted setup, 3-element proof), PLONK (universal trusted setup), STARKs (transparent, post-quantum)</li>
<li>Implement a toy verifier that checks a proof of a state transition</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Roll Up at All?</h2>
<p class="l-text">Ethereum L1 settles ~15 transactions per second. A rollup batches thousands of L2 transactions, executes them off-chain, and posts only the <em>compressed result</em> + a proof to L1. The L1 verifies the proof in O(1) cost regardless of how many L2 transactions ran. Result: ~50,000 TPS in aggregate, ~99% gas reduction since EIP-4844 blobs.</p>

<div class="calc-highlight"><strong>Two assumptions a rollup must satisfy</strong>: (1) data availability — the L2 transaction data is publicly retrievable so users can reconstruct state; (2) state validity — the L2 state transition was correct. Optimistic rollups assume validity and verify on demand; ZK rollups prove validity always.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Optimistic Rollups — Arbitrum, Optimism, Base</h2>
<p class="l-text">An <strong>optimistic rollup</strong> publishes batches as "asserted state" with a 7-day challenge window. During that window any honest party can submit a <strong>fraud proof</strong>: an interactive bisection game that pinpoints the exact instruction where the sequencer cheated, ending in an L1-executable single step that resolves the dispute.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Arbitrum (Offchain Labs, 2021)</div><div class="card-body">Custom WASM-like instruction set (WAVM). BoLD (Bounded Liquidity Delay) protocol upgraded fraud proofs to permissionless multi-party in 2024. ~$2B+ TVL.</div></div>
<div class="calc-card"><div class="card-title">Optimism (OP Labs, 2021)</div><div class="card-body">EVM-equivalent (Type 2). Cannon fault proof (MIPS interpreter on L1) launched 2024. Powers OP Stack — Base, Worldcoin, Mantle, Mode all share this kernel.</div></div>
<div class="calc-card"><div class="card-title">Base (Coinbase, 2023)</div><div class="card-body">OP-Stack instance. Quickly became one of the highest-volume L2s in 2024 thanks to onchain social (Friend.tech) and stablecoin volume.</div></div>
<div class="calc-card"><div class="card-title">7-day challenge</div><div class="card-body">Withdraw L2 → L1 takes 7 days unless you use a fast-bridge (Hop, Across) that fronts liquidity for a fee.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. ZK Rollups — zkSync, StarkNet, Polygon zkEVM</h2>
<p class="l-text">A <strong>ZK rollup</strong> publishes a batch alongside a <strong>validity proof</strong> (zk-SNARK or zk-STARK). The L1 verifier accepts only proven batches; finality is one L1 block (~12 seconds), not 7 days.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">zkSync Era (Matter Labs, 2023)</div><div class="card-body">PLONK-based. Type 4 zkEVM (custom ZK-friendly bytecode, not EVM bytecode). Native account abstraction.</div></div>
<div class="calc-card"><div class="card-title">StarkNet (StarkWare, 2021)</div><div class="card-body">Cairo-based ZK rollup, STARK proofs (transparent, post-quantum). Custom VM, not EVM. Powers dYdX v3, Sorare.</div></div>
<div class="calc-card"><div class="card-title">Polygon zkEVM (2023)</div><div class="card-body">Type 3 zkEVM, near-EVM-equivalent. Uses recursive PLONK proofs. Polygon now consolidating into "AggLayer".</div></div>
<div class="calc-card"><div class="card-title">Scroll (2023)</div><div class="card-body">Type 2 zkEVM (closer to bytecode-equivalent). Halo2 PLONK-flavor proofs.</div></div>
<div class="calc-card"><div class="card-title">Linea (ConsenSys, 2023)</div><div class="card-body">Type 2 zkEVM, MetaMask-integrated. Uses PLONK with custom lookups.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Vitalik's zkEVM Type Classification (2022)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Type 1 — Fully Ethereum-equivalent</div><div class="card-body">No changes to Ethereum's spec. Provers re-execute exact L1 protocol. Slow proving (hours per block). Goal: Taiko, eventual L1 enshrined ZK.</div></div>
<div class="calc-card"><div class="card-title">Type 2 — Fully EVM-equivalent</div><div class="card-body">Same EVM bytecode/opcodes/state. Minor internal data structure changes for efficiency. Examples: Scroll, Linea.</div></div>
<div class="calc-card"><div class="card-title">Type 3 — Almost EVM-equivalent</div><div class="card-body">Most EVM ops, some precompiles missing or modified. Faster proving. Polygon zkEVM, earlier Scroll.</div></div>
<div class="calc-card"><div class="card-title">Type 4 — High-level-language equivalent</div><div class="card-body">Compile Solidity/Vyper to a custom ZK-friendly VM (not EVM bytecode). zkSync Era. Fastest proving, breaks some bytecode-level tooling.</div></div>
</div>

<div class="calc-highlight">The trade-off is <strong>compatibility ↔ proving speed</strong>. Type 1 lets every existing Ethereum tool work but is slow. Type 4 is fast but needs custom tooling. The industry is gradually climbing toward Type 1 as proving hardware (GPU + ASIC) accelerates.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Data Availability — The Hidden Pillar</h2>
<p class="l-text">A rollup is only as secure as its data availability layer. If the sequencer publishes a state root but withholds the data, users cannot reconstruct their state to exit. The 2024 game-changer: <strong>EIP-4844 (Proto-Danksharding)</strong> introduced <em>blobs</em> — a separate data lane on Ethereum L1 (~125 KB blobs, pruned after ~18 days, 10× cheaper than calldata). Result: rollup gas dropped 90%+ overnight in March 2024.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ethereum blobs (EIP-4844)</div><div class="card-body">3-6 blobs/block today. Full Danksharding will scale this with data-availability sampling.</div></div>
<div class="calc-card"><div class="card-title">Celestia (2023)</div><div class="card-body">Standalone DA layer. Sovereign rollups settle on Celestia. Data-availability sampling lets light clients verify with 1 KB.</div></div>
<div class="calc-card"><div class="card-title">EigenDA (2024)</div><div class="card-body">Restaking-secured DA from EigenLayer. Integrated into Mantle, Celo, others.</div></div>
<div class="calc-card"><div class="card-title">Validium / off-chain DA</div><div class="card-body">Posts only the proof on L1, not the data. Cheaper, weaker security model. Used by some StarkEx instances.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The ZK Cryptography Toolkit</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Groth16 (Jens Groth, 2016)</div><div class="card-body">3-element proof, &lt; 200 bytes, &lt; 5ms verification. Per-circuit trusted setup ("ceremony"). Used by Zcash Sprout/Sapling, Tornado Cash.</div></div>
<div class="calc-card"><div class="card-title">PLONK (Gabizon, Williamson, Ciobotaru, 2019)</div><div class="card-body">Universal updatable trusted setup (one ceremony for all circuits up to size N). Powers Aztec, zkSync, Polygon zkEVM.</div></div>
<div class="calc-card"><div class="card-title">STARKs (Ben-Sasson et al., 2018)</div><div class="card-body">No trusted setup, post-quantum (hash-based, no pairings). Larger proofs (~50–200 KB), faster prover. StarkWare, StarkNet, Polygon Miden.</div></div>
<div class="calc-card"><div class="card-title">KZG commitments (Kate, Zaverucha, Goldberg, 2010)</div><div class="card-body">Polynomial commitment scheme — open at any point with constant proof size. Backbone of PLONK and EIP-4844 blobs.</div></div>
<div class="calc-card"><div class="card-title">Halo2 (Bowe, Grigg, Hopwood, 2019)</div><div class="card-body">PLONK-flavor with no trusted setup via inner-product arguments + recursion. Powers Scroll, current Zcash.</div></div>
<div class="calc-card"><div class="card-title">Recursion / proof aggregation</div><div class="card-body">Verify a proof inside another proof. Lets a prover compress N batches into one final proof — central to scalability.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. A Toy Validity-Proof Verifier in Python</h2>
<p class="l-text">Real verifiers do pairing-based crypto on bn254/bls12-381. We won't reimplement those — but we <em>can</em> capture the structural shape: prover commits to (old_root, new_root, transactions) with a hash; verifier recomputes the expected commitment and checks. This is exactly how a SNARK verifier looks in pseudocode minus the heavy crypto.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, json
from sklearn.linear_model import LogisticRegression
import numpy as np

def commit(*parts):
    return hashlib.sha256(json.dumps(parts, sort_keys=True, default=str).encode()).hexdigest()

# State = dict of {address: balance}
def apply_txs(state, txs):
    s = dict(state)
    for tx in txs:
        if s.get(tx["from"], 0) &lt; tx["amount"]:
            return None              # invalid
        s[tx["from"]]  = s.get(tx["from"], 0)  - tx["amount"]
        s[tx["to"]]    = s.get(tx["to"],   0)  + tx["amount"]
    return s

# === Prover ===
def prove(prev_state, txs):
    new_state = apply_txs(prev_state, txs)
    if new_state is None: raise ValueError("invalid batch")
    # The "proof" is just a commitment — a real SNARK does a polynomial argument
    proof = commit("v1", commit(prev_state), commit(txs), commit(new_state))
    return new_state, proof

# === Verifier (lives on L1) ===
def verify(prev_state, txs, claimed_new_state, proof):
    expected = commit("v1", commit(prev_state), commit(txs), commit(claimed_new_state))
    return proof == expected

# === ML twist: classifier learns to spot tampered batches ===
prev = {"alice": 100, "bob": 50}
txs  = [{"from":"alice","to":"bob","amount":30},
        {"from":"bob","to":"alice","amount":10}]
new_state, proof = prove(prev, txs)
print("Honest verify:", verify(prev, txs, new_state, proof))
tampered = dict(new_state); tampered["alice"] = 999
print("Tampered verify:", verify(prev, txs, tampered, proof))
</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) <code>commit()</code> takes any number of parts, JSON-serializes them deterministically (<code>sort_keys=True</code>) and SHA-256 hashes — a stand-in for the polynomial commitment a real SNARK would produce. 2) <code>apply_txs()</code> is the state transition: iterate over each transfer, debit <code>tx["from"]</code> and credit <code>tx["to"]</code>; return <code>None</code> if any sender lacks funds — the same insolvency check a rollup must enforce. 3) <code>prove()</code> runs the transition then commits to the tuple <code>("v1", commit(prev_state), commit(txs), commit(new_state))</code> — bundling old root, txs, and new root into one fingerprint. 4) <code>verify()</code> recomputes the same commitment from the alleged <code>claimed_new_state</code>; the tampered run (where <code>alice = 999</code>) fails because the fingerprint no longer matches.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same toy proof system + a sklearn classifier that learns to distinguish valid vs invalid (proof, state) pairs from features.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, json, numpy as np
from sklearn.linear_model import LogisticRegression

def commit(*p): return hashlib.sha256(json.dumps(p, sort_keys=True, default=str).encode()).hexdigest()

def gen_batch(rng, valid=True):
    bal = {f"u{i}": int(rng.integers(50, 500)) for i in range(5)}
    txs = [{"from": f"u{rng.integers(0,5)}", "to": f"u{rng.integers(0,5)}",
            "amount": int(rng.integers(1, 30))} for _ in range(8)]
    new = dict(bal)
    for t in txs:
        if new.get(t["from"], 0) &gt;= t["amount"]:
            new[t["from"]] -= t["amount"]; new[t["to"]] = new.get(t["to"],0) + t["amount"]
    proof = commit("v1", commit(bal), commit(txs), commit(new))
    if not valid:
        new = dict(new); new[next(iter(new))] += 999     # tamper
    return bal, txs, new, proof, 1 if valid else 0

rng = np.random.default_rng(7)
X, y = [], []
for _ in range(400):
    valid = bool(rng.integers(0,2))
    bal, txs, new, proof, lab = gen_batch(rng, valid)
    expected = commit("v1", commit(bal), commit(txs), commit(new))
    feats = [int(proof == expected), sum(new.values()) - sum(bal.values()), len(txs)]
    X.append(feats); y.append(lab)

clf = LogisticRegression().fit(X, y)
print("Verifier-as-classifier accuracy:", clf.score(X, y))
print("Coefficients:", clf.coef_)
print("(coef on feat[0] = proof-match — should dominate)")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Trade-Off Matrix — Optimistic vs ZK</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Withdrawal latency</div><div class="card-body">Optimistic: 7 days. ZK: ~12 sec to 1 hour (recursion).</div></div>
<div class="calc-card"><div class="card-title">Proof cost on L1</div><div class="card-body">Optimistic: zero in happy path; high if challenged. ZK: small constant per batch (~250k–500k gas SNARK verify).</div></div>
<div class="calc-card"><div class="card-title">Prover cost off-L1</div><div class="card-body">Optimistic: cheap (just re-execute on-demand). ZK: enormous — minutes to hours per batch on GPU/ASIC clusters.</div></div>
<div class="calc-card"><div class="card-title">EVM compatibility</div><div class="card-body">Optimistic: easy, near-perfect. ZK: hard, ranges from Type 1 (slow) to Type 4 (custom VM).</div></div>
<div class="calc-card"><div class="card-title">MEV / front-running</div><div class="card-body">Both have sequencer-as-MEV-recipient; decentralized sequencers are 2025–26 priority for both.</div></div>
<div class="calc-card"><div class="card-title">Cryptography risk</div><div class="card-body">Optimistic: no SNARK risk; relies on at least one honest watcher. ZK: cryptographic-soundness risk; relies on math.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Optimistic rollups assume validity, challenge with fraud proofs over a 7-day window.</li>
<li>ZK rollups prove validity up front; finality in minutes; EIP-4844 blobs cut costs ~10×.</li>
<li>Vitalik's Type 1–4 classification: compatibility ↔ proving speed.</li>
<li>Data availability is a separate concern — Ethereum blobs, Celestia, EigenDA.</li>
<li>ZK toolkit: Groth16, PLONK, STARKs, KZG, Halo2; recursion enables aggregation.</li>
</ul>
</div>
<p class="l-text">Next, <strong>blockchain-L7</strong>: the live battlefield of DeFi security — flash loans, AMM exploits, oracle attacks.</p>
</div>`,
tr: `<p class="l-text"><strong>Katman-2 ölçekleme, Ethereum'un işlemleri ucuz hale getirirken merkeziyetsizlik felsefesini nasıl koruduğudur.</strong> L1 mutabakatı ve veriyi güvence altına alır; L2 ağır hesaplamayı üstlenir ve doğruluk kanıtını geri gönderir. Vitalik Buterin'in 2017 "Plasma" makalesinde önceden hissettirilen ve 2020'deki "rollup-merkezli yol haritası" yazısında billurlaşan mimari, artık iki baskın aile üretti: <strong>optimistic rollup'lar</strong> (Arbitrum, Optimism, Base) — geçerliliği varsayar ve fraud proof'larla itiraz eder — ve <strong>ZK rollup'lar</strong> (zkSync Era, StarkNet, Polygon zkEVM, Linea, Scroll) — geçerliliği baştan kriptografik olarak kanıtlar.</p>

<p class="l-text">Bu derste rollup zihin modelini tam olarak ele alıyoruz: <strong>fraud proof'lar</strong> ile <strong>validity proof'lar</strong> arasındaki fark, <strong>EVM-eşdeğerliği</strong> spektrumu (Vitalik'in sınıflandırmasına göre Tip 1'den Tip 4'e zkEVM'ler), <strong>veri kullanılabilirliği</strong>'nin rolü (EIP-4844 blob'ları, Celestia, EigenDA) ve ZK'yi çalıştıran kriptografik ilkeller — Groth16, PLONK, STARK'lar, KZG taahhütleri. Sentetik durum geçişleri üzerinde çalışan bir Python "validity proof verifier" simülatörü ile bitiriyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Optimistic rollup'lar: 7 günlük itiraz penceresi, fraud proof'lar (OP için Cannon, Arbitrum için BoLD)</li>
<li>ZK rollup'lar: validity proof'lar, prover darboğazı, ms cinsinden zincir üzeri doğrulama</li>
<li>EVM-eşdeğerlik tipleri: Tip 1 (Ethereum-eşdeğer) → Tip 4 (yüksek seviyeli dil eşdeğer)</li>
<li>Veri kullanılabilirliği: blob pazarı (EIP-4844, Mart 2024), Celestia, EigenDA, danksharding</li>
<li>ZK ilkelleri: Groth16 (güvenilir kurulum, 3 elemanlı kanıt), PLONK (evrensel güvenilir kurulum), STARK'lar (şeffaf, kuantum sonrası)</li>
<li>Bir durum geçişinin kanıtını kontrol eden bir oyuncak verifier uygulayın</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. Neden Rollup Yapalım Ki?</h2>
<p class="l-text">Ethereum L1 saniyede ~15 işlem takas eder. Bir rollup binlerce L2 işlemini gruplar, zincir dışı yürütür ve yalnızca <em>sıkıştırılmış sonucu</em> + bir kanıtı L1'e gönderir. L1, kaç L2 işleminin çalıştığından bağımsız olarak kanıtı O(1) maliyetle doğrular. Sonuç: toplamda ~50.000 TPS, EIP-4844 blob'larından beri ~%99 gas azaltma.</p>

<div class="calc-highlight"><strong>Bir rollup'un karşılaması gereken iki varsayım</strong>: (1) veri kullanılabilirliği — L2 işlem verisi herkesçe erişilebilir, böylece kullanıcılar durumu yeniden inşa edebilir; (2) durum geçerliliği — L2 durum geçişi doğruydu. Optimistic rollup'lar geçerliliği varsayar ve talep üzerine doğrular; ZK rollup'lar geçerliliği daima kanıtlar.</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Optimistic Rollup'lar — Arbitrum, Optimism, Base</h2>
<p class="l-text">Bir <strong>optimistic rollup</strong>, batch'leri 7 günlük itiraz penceresi olan "iddia edilen durum" olarak yayımlar. O pencerede dürüst bir taraf bir <strong>fraud proof</strong> gönderebilir: sıralayıcının (sequencer) hile yaptığı tam talimatı kesinleştiren ve anlaşmazlığı çözen L1'de yürütülebilir tek adımla biten bir interaktif bisection oyunu.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Arbitrum (Offchain Labs, 2021)</div><div class="card-body">Özel WASM benzeri komut seti (WAVM). BoLD (Bounded Liquidity Delay) protokolü 2024'te fraud proof'ları izinsiz çok-taraflıya yükseltti. ~2 milyar dolar+ TVL.</div></div>
<div class="calc-card"><div class="card-title">Optimism (OP Labs, 2021)</div><div class="card-body">EVM-eşdeğer (Tip 2). Cannon fault proof (L1 üzerinde MIPS yorumlayıcı) 2024'te yayınlandı. OP Stack'i çalıştırır — Base, Worldcoin, Mantle, Mode hep bu çekirdeği paylaşır.</div></div>
<div class="calc-card"><div class="card-title">Base (Coinbase, 2023)</div><div class="card-body">OP-Stack örneği. Onchain sosyal (Friend.tech) ve stablecoin hacmi sayesinde 2024'te en yüksek hacimli L2'lerden biri oldu.</div></div>
<div class="calc-card"><div class="card-title">7 günlük itiraz</div><div class="card-body">L2 → L1 çekme, ücret karşılığı likidite sağlayan hızlı köprü (Hop, Across) kullanmazsanız 7 gün sürer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. ZK Rollup'lar — zkSync, StarkNet, Polygon zkEVM</h2>
<p class="l-text">Bir <strong>ZK rollup</strong>, batch'i bir <strong>validity proof</strong> (zk-SNARK veya zk-STARK) ile birlikte yayımlar. L1 verifier yalnızca kanıtlanmış batch'leri kabul eder; kesinlik 7 gün değil, bir L1 bloğudur (~12 saniye).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">zkSync Era (Matter Labs, 2023)</div><div class="card-body">PLONK tabanlı. Tip 4 zkEVM (özel ZK dostu bytecode, EVM bytecode değil). Yerel hesap soyutlaması.</div></div>
<div class="calc-card"><div class="card-title">StarkNet (StarkWare, 2021)</div><div class="card-body">Cairo tabanlı ZK rollup, STARK kanıtları (şeffaf, kuantum sonrası). Özel VM, EVM değil. dYdX v3, Sorare'i çalıştırır.</div></div>
<div class="calc-card"><div class="card-title">Polygon zkEVM (2023)</div><div class="card-body">Tip 3 zkEVM, EVM-eşdeğerine yakın. Özyinelemeli PLONK kanıtları kullanır. Polygon şimdi "AggLayer"da konsolide oluyor.</div></div>
<div class="calc-card"><div class="card-title">Scroll (2023)</div><div class="card-body">Tip 2 zkEVM (bytecode-eşdeğere daha yakın). Halo2 PLONK tarzı kanıtlar.</div></div>
<div class="calc-card"><div class="card-title">Linea (ConsenSys, 2023)</div><div class="card-body">Tip 2 zkEVM, MetaMask entegre. Özel lookup'larla PLONK kullanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Vitalik'in zkEVM Tip Sınıflandırması (2022)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tip 1 — Tam Ethereum-eşdeğer</div><div class="card-body">Ethereum spesifikasyonunda hiçbir değişiklik yok. Prover'lar tam L1 protokolünü yeniden yürütür. Yavaş prover (blok başına saatler). Hedef: Taiko, sonunda L1'e gömülü ZK.</div></div>
<div class="calc-card"><div class="card-title">Tip 2 — Tam EVM-eşdeğer</div><div class="card-body">Aynı EVM bytecode/opcode/durum. Verimlilik için küçük dahili veri yapısı değişiklikleri. Örnekler: Scroll, Linea.</div></div>
<div class="calc-card"><div class="card-title">Tip 3 — Neredeyse EVM-eşdeğer</div><div class="card-body">Çoğu EVM op'u, bazı precompile'lar eksik veya değiştirilmiş. Daha hızlı prover. Polygon zkEVM, daha eski Scroll.</div></div>
<div class="calc-card"><div class="card-title">Tip 4 — Yüksek seviyeli dil eşdeğer</div><div class="card-body">Solidity/Vyper'ı özel ZK dostu bir VM'e (EVM bytecode değil) derleyin. zkSync Era. En hızlı prover, bazı bytecode düzeyi araçları kırar.</div></div>
</div>

<div class="calc-highlight">Ödünleşim <strong>uyumluluk ↔ prover hızı</strong>'dır. Tip 1 her mevcut Ethereum aracının çalışmasına izin verir ama yavaştır. Tip 4 hızlıdır ama özel araçlar gerektirir. Endüstri, prover donanımı (GPU + ASIC) hızlandıkça giderek Tip 1'e tırmanıyor.</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Veri Kullanılabilirliği — Gizli Sütun</h2>
<p class="l-text">Bir rollup yalnızca veri kullanılabilirlik katmanı kadar güvenlidir. Sıralayıcı bir state root yayımlayıp veriyi tutarsa, kullanıcılar çıkış için durumlarını yeniden inşa edemez. 2024 oyun değiştiricisi: <strong>EIP-4844 (Proto-Danksharding)</strong> <em>blob</em>'ları getirdi — Ethereum L1'de ayrı bir veri şeridi (~125 KB blob'lar, ~18 gün sonra budanır, calldata'dan 10 kat daha ucuz). Sonuç: rollup gas'i Mart 2024'te bir gecede %90+ düştü.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ethereum blob'ları (EIP-4844)</div><div class="card-body">Bugün blok başına 3-6 blob. Tam Danksharding bunu veri-kullanılabilirlik örneklemesiyle ölçeklendirecek.</div></div>
<div class="calc-card"><div class="card-title">Celestia (2023)</div><div class="card-body">Bağımsız DA katmanı. Egemen rollup'lar Celestia'da takas eder. Veri kullanılabilirlik örneklemesi hafif istemcilerin 1 KB ile doğrulamasına izin verir.</div></div>
<div class="calc-card"><div class="card-title">EigenDA (2024)</div><div class="card-body">EigenLayer'dan restaking-güvenli DA. Mantle, Celo ve diğerlerine entegre.</div></div>
<div class="calc-card"><div class="card-title">Validium / zincir dışı DA</div><div class="card-body">L1'e yalnızca kanıtı gönderir, veriyi göndermez. Daha ucuz, daha zayıf güvenlik modeli. Bazı StarkEx örnekleri tarafından kullanılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. ZK Kriptografi Araç Seti</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Groth16 (Jens Groth, 2016)</div><div class="card-body">3 elemanlı kanıt, &lt; 200 bayt, &lt; 5 ms doğrulama. Devre başına güvenilir kurulum ("ceremony"). Zcash Sprout/Sapling, Tornado Cash tarafından kullanıldı.</div></div>
<div class="calc-card"><div class="card-title">PLONK (Gabizon, Williamson, Ciobotaru, 2019)</div><div class="card-body">Evrensel güncellenebilir güvenilir kurulum (N büyüklüğüne kadar tüm devreler için tek seremoni). Aztec, zkSync, Polygon zkEVM'i çalıştırır.</div></div>
<div class="calc-card"><div class="card-title">STARK'lar (Ben-Sasson et al., 2018)</div><div class="card-body">Güvenilir kurulum yok, kuantum sonrası (hash tabanlı, eşleştirme yok). Daha büyük kanıtlar (~50–200 KB), daha hızlı prover. StarkWare, StarkNet, Polygon Miden.</div></div>
<div class="calc-card"><div class="card-title">KZG taahhütleri (Kate, Zaverucha, Goldberg, 2010)</div><div class="card-body">Polinom taahhüt şeması — herhangi bir noktada sabit kanıt boyutuyla aç. PLONK ve EIP-4844 blob'larının omurgası.</div></div>
<div class="calc-card"><div class="card-title">Halo2 (Bowe, Grigg, Hopwood, 2019)</div><div class="card-body">İç-çarpım argümanları + özyineleme yoluyla güvenilir kurulum olmadan PLONK tarzı. Scroll, mevcut Zcash'i çalıştırır.</div></div>
<div class="calc-card"><div class="card-title">Özyineleme / kanıt toplama</div><div class="card-body">Bir kanıtı başka bir kanıt içinde doğrulayın. Bir prover'ın N batch'i tek bir nihai kanıta sıkıştırmasına izin verir — ölçeklenebilirlik için merkezi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Python'da Bir Oyuncak Validity-Proof Verifier</h2>
<p class="l-text">Gerçek verifier'lar bn254/bls12-381 üzerinde eşleştirme tabanlı kripto yapar. Bunları yeniden uygulamayacağız — ama yapısal şekli yakalayabiliriz: prover (eski_kök, yeni_kök, işlemler)'e bir hash ile taahhüt eder; verifier beklenen taahhüdü yeniden hesaplar ve kontrol eder. Bu, ağır kripto eksi bir SNARK verifier'ın pseudocode'da nasıl göründüğüdür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, json
from sklearn.linear_model import LogisticRegression
import numpy as np

def commit(*parts):
    return hashlib.sha256(json.dumps(parts, sort_keys=True, default=str).encode()).hexdigest()

# Durum = {adres: bakiye} sözlüğü
def apply_txs(state, txs):
    s = dict(state)
    for tx in txs:
        if s.get(tx["from"], 0) &lt; tx["amount"]:
            return None              # geçersiz
        s[tx["from"]]  = s.get(tx["from"], 0)  - tx["amount"]
        s[tx["to"]]    = s.get(tx["to"],   0)  + tx["amount"]
    return s

# === Prover ===
def prove(prev_state, txs):
    new_state = apply_txs(prev_state, txs)
    if new_state is None: raise ValueError("invalid batch")
    # "Kanıt" sadece bir taahhüttür — gerçek bir SNARK polinom argümanı yapar
    proof = commit("v1", commit(prev_state), commit(txs), commit(new_state))
    return new_state, proof

# === Verifier (L1'de yaşar) ===
def verify(prev_state, txs, claimed_new_state, proof):
    expected = commit("v1", commit(prev_state), commit(txs), commit(claimed_new_state))
    return proof == expected

# === ML dokunuşu: sınıflandırıcı kurcalanmış batch'leri saptamayı öğrenir ===
prev = {"alice": 100, "bob": 50}
txs  = [{"from":"alice","to":"bob","amount":30},
        {"from":"bob","to":"alice","amount":10}]
new_state, proof = prove(prev, txs)
print("Honest verify:", verify(prev, txs, new_state, proof))
tampered = dict(new_state); tampered["alice"] = 999
print("Tampered verify:", verify(prev, txs, tampered, proof))
</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) <code>commit()</code> kendisine verilen parçaları deterministik biçimde (<code>sort_keys=True</code>) JSON'a serileştirir ve SHA-256 ile özetler — gerçek bir SNARK'ın üreteceği polinom taahhüdünün yerine geçen bir vekildir. 2) <code>apply_txs()</code> durum geçişidir: her transferde <code>tx["from"]</code>'dan düşer, <code>tx["to"]</code>'ya ekler; gönderici bakiyesi yetmezse <code>None</code> döner — bu, bir rollup'ın zorlamak zorunda olduğu aynı yetersiz-bakiye kontrolüdür. 3) <code>prove()</code> geçişi çalıştırır, ardından <code>("v1", commit(prev_state), commit(txs), commit(new_state))</code> demetine taahhüt verir — eski kök, işlemler ve yeni kökü tek bir parmak iziyle birleştirir. 4) <code>verify()</code> aynı taahhüdü iddia edilen <code>claimed_new_state</code>'ten yeniden hesaplar; kurcalanmış çalıştırma (<code>alice = 999</code>) başarısız olur, çünkü parmak izi artık eşleşmez.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı oyuncak kanıt sistemi + özelliklerden geçerli vs geçersiz (kanıt, durum) çiftlerini ayırt etmeyi öğrenen bir sklearn sınıflandırıcı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, json, numpy as np
from sklearn.linear_model import LogisticRegression

def commit(*p): return hashlib.sha256(json.dumps(p, sort_keys=True, default=str).encode()).hexdigest()

def gen_batch(rng, valid=True):
    bal = {f"u{i}": int(rng.integers(50, 500)) for i in range(5)}
    txs = [{"from": f"u{rng.integers(0,5)}", "to": f"u{rng.integers(0,5)}",
            "amount": int(rng.integers(1, 30))} for _ in range(8)]
    new = dict(bal)
    for t in txs:
        if new.get(t["from"], 0) &gt;= t["amount"]:
            new[t["from"]] -= t["amount"]; new[t["to"]] = new.get(t["to"],0) + t["amount"]
    proof = commit("v1", commit(bal), commit(txs), commit(new))
    if not valid:
        new = dict(new); new[next(iter(new))] += 999     # kurcala
    return bal, txs, new, proof, 1 if valid else 0

rng = np.random.default_rng(7)
X, y = [], []
for _ in range(400):
    valid = bool(rng.integers(0,2))
    bal, txs, new, proof, lab = gen_batch(rng, valid)
    expected = commit("v1", commit(bal), commit(txs), commit(new))
    feats = [int(proof == expected), sum(new.values()) - sum(bal.values()), len(txs)]
    X.append(feats); y.append(lab)

clf = LogisticRegression().fit(X, y)
print("Verifier-as-classifier accuracy:", clf.score(X, y))
print("Coefficients:", clf.coef_)
print("(coef on feat[0] = proof-match — should dominate)")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Ödünleşim Matrisi — Optimistic vs ZK</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çekme gecikmesi</div><div class="card-body">Optimistic: 7 gün. ZK: ~12 sn ile 1 saat (özyineleme).</div></div>
<div class="calc-card"><div class="card-title">L1'de kanıt maliyeti</div><div class="card-body">Optimistic: mutlu yolda sıfır; itiraz edilirse yüksek. ZK: batch başına küçük sabit (~250k–500k gas SNARK doğrulaması).</div></div>
<div class="calc-card"><div class="card-title">L1 dışı prover maliyeti</div><div class="card-body">Optimistic: ucuz (sadece talep üzerine yeniden yürüt). ZK: muazzam — GPU/ASIC kümelerinde batch başına dakikalar ile saatler.</div></div>
<div class="calc-card"><div class="card-title">EVM uyumluluğu</div><div class="card-body">Optimistic: kolay, neredeyse mükemmel. ZK: zor, Tip 1 (yavaş)'tan Tip 4'e (özel VM) kadar değişir.</div></div>
<div class="calc-card"><div class="card-title">MEV / front-running</div><div class="card-body">Her ikisinde de sıralayıcı-MEV-alıcısı vardır; merkeziyetsiz sıralayıcılar her ikisi için 2025-26 önceliğidir.</div></div>
<div class="calc-card"><div class="card-title">Kriptografi riski</div><div class="card-body">Optimistic: SNARK riski yok; en az bir dürüst gözlemciye dayanır. ZK: kriptografik sağlamlık riski; matematiğe dayanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Optimistic rollup'lar geçerliliği varsayar, 7 günlük pencerede fraud proof ile itiraz eder.</li>
<li>ZK rollup'lar geçerliliği baştan kanıtlar; dakikalar içinde kesinlik; EIP-4844 blob'ları maliyetleri ~10x düşürdü.</li>
<li>Vitalik'in Tip 1-4 sınıflandırması: uyumluluk ↔ prover hızı.</li>
<li>Veri kullanılabilirliği ayrı bir kaygıdır — Ethereum blob'ları, Celestia, EigenDA.</li>
<li>ZK araç seti: Groth16, PLONK, STARK'lar, KZG, Halo2; özyineleme toplamayı sağlar.</li>
</ul>
</div>
<p class="l-text">Sıradaki, <strong>blockchain-L7</strong>: DeFi güvenliğinin canlı savaş alanı — flash loan'lar, AMM exploit'leri, oracle saldırıları.</p>
</div>`
};
