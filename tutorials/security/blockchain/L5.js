window.BLOCKCHAIN_L5 = {
en: `<p class="l-text"><strong>Consensus is how a permissionless network of mutually distrustful machines agrees on a single ordered history.</strong> The problem long predates blockchain — Lamport, Shostak, and Pease formalized the <strong>Byzantine Generals Problem</strong> in 1982, and Castro and Liskov gave the first practical Byzantine Fault-Tolerant algorithm (<strong>PBFT</strong>) in 1999. Bitcoin (Nakamoto, 2008) added two ideas — <em>permissionless</em> participation and <em>economic security via Proof-of-Work</em> — and changed the world. Ethereum's transition to <strong>Proof-of-Stake</strong> (the Merge, September 15, 2022) marked the moment PoS became mainstream-credible at scale. Today's L1s and L2s pick between PoW heritage, modern PoS variants (Gasper, Tendermint, HotStuff), and hybrid designs.</p>

<p class="l-text">In this lesson we trace the consensus family tree: classical BFT (PBFT, Tendermint, HotStuff), Nakamoto/Bitcoin PoW, Ethereum's Gasper (LMD-GHOST + Casper FFG), and the trade-off triangle of <strong>safety, liveness, and decentralization</strong>. We finish with a runnable 4-validator BFT-style state-machine in Python that walks through propose → prevote → precommit → commit, demonstrating quorum certificates and view changes.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Byzantine Generals: f &lt; n/3 fault tolerance, why "/3" and not "/2"</li>
<li>Bitcoin PoW: target = 2^256 / difficulty, 6-block confirmation, 51% attack economics</li>
<li>PoS basics: Ethereum's Gasper = LMD-GHOST fork choice + Casper FFG finality gadget</li>
<li>Classical BFT: PBFT, Tendermint, HotStuff — pipelined and chained variants</li>
<li>Probabilistic vs absolute finality; "safety vs liveness" CAP-like trade</li>
<li>Build a 4-validator Tendermint-style state machine that commits a block</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Byzantine Generals — Why f &lt; n/3</h2>
<p class="l-text">Lamport's 1982 result: with arbitrary (Byzantine) faults, you need at least <strong>3f + 1</strong> total participants to tolerate <strong>f</strong> faulty ones. The intuition: <em>you must hear from 2f+1 to ensure that even if f of those are lying, the f+1 honest among them outvote any f honest dissenters from elsewhere</em>. This bound is tight in the asynchronous network model (FLP impossibility, 1985, says deterministic consensus is impossible with even 1 fault — synchrony or randomness must be added).</p>

<div class="katex-block">$$n \\geq 3f + 1 \\quad\\Longrightarrow\\quad f \\leq \\frac{n-1}{3}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">n=4, f=1</div><div class="card-body">Smallest non-trivial BFT. Tolerates one Byzantine validator. Standard test setup for Tendermint, HotStuff demos.</div></div>
<div class="calc-card"><div class="card-title">n=7, f=2</div><div class="card-body">Higher resilience. Used in early Hyperledger Fabric Solo/Kafka examples (those used CFT = crash-fault, not BFT).</div></div>
<div class="calc-card"><div class="card-title">n=100+, f=33</div><div class="card-body">Public PoS chains (Cosmos, Solana). Slashing economics protect against rational rather than purely Byzantine faults.</div></div>
<div class="calc-card"><div class="card-title">CFT vs BFT</div><div class="card-body">Crash-Fault-Tolerant (Raft, Paxos) tolerates n &gt; 2f. BFT is strictly more demanding because it tolerates lying.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Bitcoin Proof-of-Work</h2>
<p class="l-text">Nakamoto's elegance: replace voting with computation. A block is valid iff <code>SHA256(SHA256(header))</code> is below a network-wide <em>target</em>. Adjusting the target sets the expected time between blocks at ~10 minutes regardless of total hashpower.</p>

<div class="katex-block">$$\\text{target} = \\frac{2^{256}}{\\text{difficulty}}$$</div>

<div class="calc-highlight">Honest miners produce the longest chain because they have the majority of hashpower. An attacker with &lt; 50% expects exponentially small probability of catching up — Nakamoto's whitepaper Section 11 worked this out as a Poisson race. <strong>6 confirmations</strong> is the lore for "practically irreversible" given honest-majority assumption.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib

def mine(prev_hash, nonce_start=0, leading_zero_bits=20):
    target = 1 &lt;&lt; (256 - leading_zero_bits)
    n = nonce_start
    while True:
        h = hashlib.sha256(hashlib.sha256(f"{prev_hash}|{n}".encode()).digest()).digest()
        h_int = int.from_bytes(h, "big")
        if h_int &lt; target:
            return n, h.hex()
        n += 1

prev = "0"*64
nonce, h = mine(prev, leading_zero_bits=20)   # ~1M trials avg
print(f"Found nonce={nonce}, hash starts with {h[:8]}...")
print(f"Difficulty (leading zero bits): 20  -&gt;  expected work ~ 2^20 = ~1M")
</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) <code>target</code> is computed as <code>1 &lt;&lt; (256 - leading_zero_bits)</code> — with 20 leading zeros, a valid hash must fall below <code>2^236</code>, so only ~1 in 2^20 attempts succeed. 2) The <code>while</code> loop double-hashes <code>"{prev_hash}|{nonce}"</code> with <code>hashlib.sha256</code> twice, exactly mirroring Bitcoin's double-SHA256 header digest. 3) <code>int.from_bytes(h, "big")</code> converts the 32-byte digest to an integer so we can compare it to <code>target</code>. 4) On success, <code>mine()</code> returns the winning <code>nonce</code> and the hex hash; expect roughly 2^20 ≈ 1 million iterations for 20 bits — increase <code>leading_zero_bits</code> and watch the work grow exponentially.</p>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Ethereum's Gasper — LMD-GHOST + Casper FFG</h2>
<p class="l-text">Ethereum's PoS combines two algorithms. <strong>LMD-GHOST</strong> ("Latest Message Driven Greedy Heaviest Observed SubTree", proposed by Vitalik Buterin and Yonatan Sompolinsky) is the fork-choice rule — at every fork, follow the subtree with the greatest weight of latest-attestations. <strong>Casper FFG</strong> ("Friendly Finality Gadget", Vitalik Buterin and Virgil Griffith, 2017) is the finality layer — every epoch (32 slots ≈ 6.4 minutes), validators vote on a checkpoint pair (source, target); two consecutive supermajority links finalize the older one.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Slot</div><div class="card-body">12 seconds. One proposer, ~30 attesting committees per epoch.</div></div>
<div class="calc-card"><div class="card-title">Epoch</div><div class="card-body">32 slots = 6.4 minutes. Boundaries are checkpoints.</div></div>
<div class="calc-card"><div class="card-title">Justification</div><div class="card-body">2/3 of stake votes for a checkpoint pair → target is justified.</div></div>
<div class="calc-card"><div class="card-title">Finalization</div><div class="card-body">Two consecutive justified epochs → the earlier is finalized. Re-orging finalized blocks requires destroying ≥ 1/3 stake (slashing).</div></div>
<div class="calc-card"><div class="card-title">Slashing</div><div class="card-body">Equivocation (two votes for same epoch) or surround voting → forfeit deposit. The economic teeth.</div></div>
<div class="calc-card"><div class="card-title">EIP-3675 (the Merge)</div><div class="card-body">Sept 15, 2022 — switched fork-choice from PoW longest-chain to LMD-GHOST + Casper. Hashpower → stake overnight.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Classical BFT — PBFT, Tendermint, HotStuff</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PBFT (Castro &amp; Liskov, 1999)</div><div class="card-body">Three phases per block: pre-prepare → prepare → commit. View change on faulty leader. Quadratic message complexity.</div></div>
<div class="calc-card"><div class="card-title">Tendermint (Buchman &amp; Kwon, 2014)</div><div class="card-body">Cosmos-Hub powerhouse. Propose → prevote → precommit → commit. Instant finality (one block = final). Used by Cosmos, Binance Chain, NEAR, Celestia, Sei.</div></div>
<div class="calc-card"><div class="card-title">HotStuff (Yin et al., 2018)</div><div class="card-body">Linear message complexity (instead of PBFT's quadratic) via threshold signatures + chained pipelining. Powers Diem (formerly Libra) and Aptos.</div></div>
<div class="calc-card"><div class="card-title">Streamlet (Chan &amp; Shi, 2020)</div><div class="card-body">Pedagogical — simplest possible BFT. Two phases, used in courses to teach the structure.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A Tendermint-Style 4-Validator Simulation</h2>
<p class="l-text">Below: 4 validators (n=4, f=1), 1 proposer per round, two voting rounds (prevote, precommit) with 2f+1 = 3 quorum. Block commits on quorum precommit. We simulate one Byzantine validator that votes inconsistently to show the protocol's tolerance.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, random

class Validator:
    def __init__(self, vid, byzantine=False):
        self.vid = vid; self.byz = byzantine; self.locked = None
    def prevote(self, block):
        if self.byz: return random.choice([block, "EVIL_FORK", None])
        return block
    def precommit(self, block, prevotes):
        # honest: precommit if quorum prevoted same block
        cnt = sum(1 for v in prevotes.values() if v == block)
        return block if cnt &gt;= 3 else None    # quorum = 3 of 4

def run_round(validators, height, proposer_id):
    # Step 1: proposer broadcasts a block
    block = f"H{height}-by{proposer_id}-{hashlib.sha256(str(height).encode()).hexdigest()[:8]}"
    print(f"Round @ height {height}: {validators[proposer_id].vid} proposes {block}")

    # Step 2: prevote
    prevotes = {v.vid: v.prevote(block) for v in validators}
    print(f"  prevotes: {prevotes}")

    # Step 3: precommit
    precommits = {v.vid: v.precommit(block, prevotes) for v in validators}
    print(f"  precommits: {precommits}")

    # Step 4: commit if quorum
    cnt = sum(1 for p in precommits.values() if p == block)
    if cnt &gt;= 3:
        print(f"  ✓ COMMITTED at height {height}")
        return block
    print(f"  ✗ no quorum (only {cnt}/4) — view change to next proposer")
    return None

random.seed(7)
validators = [Validator(f"V{i}", byzantine=(i==1)) for i in range(4)]   # V1 is Byzantine
chain = []
for h in range(1, 5):
    proposer = (h-1) % 4
    block = run_round(validators, h, proposer)
    if block: chain.append(block)
    print()

print(f"Chain length committed: {len(chain)}")
for b in chain: print(" ", b)
</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) Four <code>Validator</code> instances are created with <code>byzantine=(i==1)</code> — so <code>V1</code> votes randomly between the real block, an <code>"EVIL_FORK"</code>, or nothing, while V0/V2/V3 vote honestly. 2) <code>run_round</code> walks the Tendermint phases: the proposer broadcasts <code>block</code>, then each validator's <code>prevote</code> goes into the <code>prevotes</code> dict. 3) Inside <code>precommit</code>, each validator counts prevotes for the proposed block; only if <code>cnt &gt;= 3</code> (the 2f+1 quorum for n=4) does it precommit, otherwise it returns <code>None</code>. 4) The block commits when precommit count also reaches 3 — the loop demonstrates that the single Byzantine V1 cannot block progress, exactly the n ≥ 3f+1 bound in action.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same Tendermint-style demo, browser-runnable. Try changing which validator is Byzantine; with 2 Byzantine you'll see commits fail (n=4 only tolerates f=1).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import random
random.seed(11)

def round_(byz_set, h, proposer):
    block = f"B{h}"
    prevotes = {i: ("EVIL" if i in byz_set and random.random()&lt;0.5 else block) for i in range(4)}
    precommits = {i: (block if list(prevotes.values()).count(block)&gt;=3 and prevotes[i]==block else None)
                  for i in range(4)}
    committed = list(precommits.values()).count(block) &gt;= 3
    return committed, prevotes, precommits

for byz in [set(), {1}, {1,2}]:
    print(f"\\nByzantine = {byz}  (n=4, f={len(byz)})")
    ok = sum(round_(byz, h, h%4)[0] for h in range(1,11))
    print(f"  committed {ok}/10 rounds")
    if len(byz) &gt; 1: print("  -&gt; n=4 cannot tolerate f &gt; 1; stuck.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Probabilistic vs Absolute Finality</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Probabilistic (Bitcoin, classic Eth PoW)</div><div class="card-body">A block becomes "more final" with each confirmation. Always reorg-able in principle. 6 blocks = practically final.</div></div>
<div class="calc-card"><div class="card-title">BFT-instant (Tendermint, HotStuff)</div><div class="card-body">Block committed = final. No deeper reorg possible (or 1/3 stake gets slashed). Trade-off: liveness halts under partition.</div></div>
<div class="calc-card"><div class="card-title">Hybrid (Eth Gasper)</div><div class="card-body">Live head is probabilistic (LMD-GHOST), checkpoints finalize after ~12 minutes (Casper FFG). Best of both, complexity tax.</div></div>
<div class="calc-card"><div class="card-title">CAP-style</div><div class="card-body">PoW prioritizes liveness over safety; BFT prioritizes safety. Under partition: PoW continues mining and reconciles; BFT halts, refuses progress.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Fork Choice and the GHOST Family</h2>
<p class="l-text">Bitcoin's fork choice is "longest chain by accumulated work". Ethereum (pre-Merge) used <strong>GHOST</strong> ("Greediest Heaviest Observed SubTree", Sompolinsky &amp; Zohar, 2013) so that uncles' work also counts — important for short block times. PoS Ethereum uses <strong>LMD-GHOST</strong> over the validator set's latest attestations.</p>

<div class="calc-highlight">Vitalik's "balancing attack" papers (2020) showed pure LMD-GHOST has subtle adversarial corner cases when an attacker can split the network's view. <strong>Casper FFG</strong> bounds the damage: even if LMD-GHOST head fluctuates, finalized checkpoints don't move.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Practical Picks (2026 landscape)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Need PoW lineage</div><div class="card-body">Bitcoin (and forks). Conservative, battle-tested, no smart contracts.</div></div>
<div class="calc-card"><div class="card-title">Need EVM + DeFi</div><div class="card-body">Ethereum mainnet + L2 rollups. Gasper consensus.</div></div>
<div class="calc-card"><div class="card-title">Need fast instant finality</div><div class="card-body">Cosmos chains (Tendermint), Aptos/Sui (HotStuff variants), Solana (PoH+PoS).</div></div>
<div class="calc-card"><div class="card-title">Need permissioned</div><div class="card-body">Hyperledger Fabric (Raft order, BFT optional), Hyperledger Besu IBFT, Quorum.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BFT requires n ≥ 3f+1; FLP says async deterministic consensus is impossible without synchrony/randomness.</li>
<li>Bitcoin PoW: target = 2^256/difficulty; ~10-min blocks; 6 confs = practically final.</li>
<li>Ethereum Gasper: LMD-GHOST head + Casper FFG finalization at epoch boundaries.</li>
<li>Tendermint &amp; HotStuff give instant BFT finality; HotStuff achieves linear message complexity.</li>
<li>Probabilistic vs absolute finality is a true engineering trade-off.</li>
</ul>
</div>
<p class="l-text">Next, <strong>blockchain-L6</strong>: ZK rollups, optimistic rollups, fraud proofs vs validity proofs.</p>
</div>`,
tr: `<p class="l-text"><strong>Mutabakat (consensus), izinsiz, birbirine güvenmeyen makinelerden oluşan bir ağın, tek bir sıralı tarih üzerinde nasıl anlaştığıdır.</strong> Sorun blockchain'den çok önce vardır — Lamport, Shostak ve Pease 1982'de <strong>Bizans Generaller Problemi</strong>'ni biçimselleştirdi ve Castro ile Liskov 1999'da ilk pratik Bizans Hata Toleranslı algoritmayı (<strong>PBFT</strong>) verdi. Bitcoin (Nakamoto, 2008) iki fikir ekledi — <em>izinsiz</em> katılım ve <em>İş Kanıtı yoluyla ekonomik güvenlik</em> — ve dünyayı değiştirdi. Ethereum'un <strong>Hisse Kanıtı</strong>'na geçişi (Merge, 15 Eylül 2022), PoS'un büyük ölçekte ana akım güvenilir hale geldiği anı işaretledi. Bugünkü L1'ler ve L2'ler PoW mirası, modern PoS varyantları (Gasper, Tendermint, HotStuff) ve hibrit tasarımlar arasında seçim yapar.</p>

<p class="l-text">Bu derste mutabakat aile ağacını izliyoruz: klasik BFT (PBFT, Tendermint, HotStuff), Nakamoto/Bitcoin PoW, Ethereum'un Gasper'i (LMD-GHOST + Casper FFG) ve <strong>güvenlik, canlılık ve merkeziyetsizlik</strong> arasındaki ödünleşim üçgeni. Çalıştırılabilir 4 doğrulayıcılı bir BFT tarzı durum makinesi ile bitiriyoruz; propose → prevote → precommit → commit adımlarını yürütür ve quorum sertifikalarını ile view değişikliklerini gösterir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bizans Generalleri: f &lt; n/3 hata toleransı, neden "/3" ve "/2" değil</li>
<li>Bitcoin PoW: target = 2^256 / difficulty, 6 blok onayı, %51 saldırı ekonomisi</li>
<li>PoS temelleri: Ethereum'un Gasper'i = LMD-GHOST fork seçimi + Casper FFG kesinlik aracı</li>
<li>Klasik BFT: PBFT, Tendermint, HotStuff — pipelined ve chained varyantlar</li>
<li>Olasılıksal vs mutlak kesinlik; "güvenlik vs canlılık" CAP benzeri ödünleşim</li>
<li>Bir blok commit eden 4 doğrulayıcılı Tendermint tarzı bir durum makinesi inşa edin</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. Bizans Generalleri — Neden f &lt; n/3</h2>
<p class="l-text">Lamport'un 1982 sonucu: keyfi (Bizans) hatalar varken, <strong>f</strong> hatalı katılımcıyı tolere etmek için en az <strong>3f + 1</strong> toplam katılımcıya ihtiyaç vardır. Sezgi: <em>2f+1'den haber duymalısınız ki bunların f'i yalan söylese bile aralarındaki f+1 dürüst, başka yerlerden gelen herhangi f dürüst muhalifi oy çoğunluğuyla yensin</em>. Bu sınır, asenkron ağ modelinde sıkıdır (FLP imkânsızlığı, 1985, deterministik mutabakatın 1 hatayla bile imkânsız olduğunu söyler — eş zamanlılık veya rastgelelik eklenmelidir).</p>

<div class="katex-block">$$n \\geq 3f + 1 \\quad\\Longrightarrow\\quad f \\leq \\frac{n-1}{3}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">n=4, f=1</div><div class="card-body">En küçük önemsiz olmayan BFT. Bir Bizans doğrulayıcıyı tolere eder. Tendermint, HotStuff demoları için standart test kurulumu.</div></div>
<div class="calc-card"><div class="card-title">n=7, f=2</div><div class="card-body">Daha yüksek dayanıklılık. Erken Hyperledger Fabric Solo/Kafka örneklerinde kullanıldı (bunlar BFT değil, CFT = crash-fault kullandılar).</div></div>
<div class="calc-card"><div class="card-title">n=100+, f=33</div><div class="card-body">Kamu PoS zincirleri (Cosmos, Solana). Slashing ekonomisi, salt Bizans yerine rasyonel hatalardan korur.</div></div>
<div class="calc-card"><div class="card-title">CFT vs BFT</div><div class="card-body">Crash-Fault-Tolerant (Raft, Paxos) n &gt; 2f tolere eder. BFT, yalan söylemeyi tolere ettiği için kesinlikle daha talepkârdır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Bitcoin İş Kanıtı</h2>
<p class="l-text">Nakamoto'nun zarafeti: oylamayı hesaplama ile değiştir. Bir blok, ancak ve ancak <code>SHA256(SHA256(header))</code> ağ çapındaki bir <em>hedefin</em> altındaysa geçerlidir. Hedefi ayarlamak, toplam hash gücünden bağımsız olarak bloklar arası beklenen süreyi ~10 dakikaya getirir.</p>

<div class="katex-block">$$\\text{target} = \\frac{2^{256}}{\\text{difficulty}}$$</div>

<div class="calc-highlight">Dürüst madenciler en uzun zinciri üretir, çünkü hash gücünün çoğunluğuna sahiptirler. &lt;%50'lik bir saldırgan üstel olarak küçük yetişme olasılığı bekler — Nakamoto'nun whitepaper'ının 11. bölümü bunu Poisson yarışı olarak işledi. <strong>6 onay</strong>, dürüst-çoğunluk varsayımıyla "pratik olarak geri alınamaz" şeklindeki söylemdir.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib

def mine(prev_hash, nonce_start=0, leading_zero_bits=20):
    target = 1 &lt;&lt; (256 - leading_zero_bits)
    n = nonce_start
    while True:
        h = hashlib.sha256(hashlib.sha256(f"{prev_hash}|{n}".encode()).digest()).digest()
        h_int = int.from_bytes(h, "big")
        if h_int &lt; target:
            return n, h.hex()
        n += 1

prev = "0"*64
nonce, h = mine(prev, leading_zero_bits=20)   # ortalama ~1M deneme
print(f"Found nonce={nonce}, hash starts with {h[:8]}...")
print(f"Difficulty (leading zero bits): 20  -&gt;  expected work ~ 2^20 = ~1M")
</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) <code>target</code>, <code>1 &lt;&lt; (256 - leading_zero_bits)</code> olarak hesaplanır — 20 öncül sıfırla geçerli bir hash <code>2^236</code>'nın altına düşmek zorundadır, dolayısıyla ortalama 2^20 denemede yalnızca biri başarılı olur. 2) <code>while</code> döngüsü <code>"{prev_hash}|{nonce}"</code>'i <code>hashlib.sha256</code> ile iki kez hash'ler; bu Bitcoin'in çift-SHA256 başlık özeti ile birebir aynıdır. 3) <code>int.from_bytes(h, "big")</code>, 32 baytlık özeti tamsayıya çevirerek <code>target</code> ile karşılaştırmamızı sağlar. 4) Başarıda <code>mine()</code> kazanan <code>nonce</code>'ı ve hex hash'i döner; 20 bit için yaklaşık 2^20 ≈ 1 milyon iterasyon bekleyin — <code>leading_zero_bits</code>'i artırın ve işin üstel olarak büyüdüğünü görün.</p>

</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Ethereum'un Gasper'i — LMD-GHOST + Casper FFG</h2>
<p class="l-text">Ethereum'un PoS'u iki algoritmayı birleştirir. <strong>LMD-GHOST</strong> ("Latest Message Driven Greedy Heaviest Observed SubTree", Vitalik Buterin ve Yonatan Sompolinsky tarafından önerildi) fork seçim kuralıdır — her çatalda, en son atestasyonların en büyük ağırlığına sahip alt ağacı izleyin. <strong>Casper FFG</strong> ("Friendly Finality Gadget", Vitalik Buterin ve Virgil Griffith, 2017) kesinlik katmanıdır — her epoch'ta (32 slot ≈ 6.4 dakika), doğrulayıcılar bir checkpoint çiftine (kaynak, hedef) oy verir; iki ardışık süper çoğunluk bağlantısı, eskisini kesinleştirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Slot</div><div class="card-body">12 saniye. Bir teklif eden, epoch başına ~30 atestasyon komitesi.</div></div>
<div class="calc-card"><div class="card-title">Epoch</div><div class="card-body">32 slot = 6.4 dakika. Sınırlar checkpoint'tir.</div></div>
<div class="calc-card"><div class="card-title">Justification</div><div class="card-body">Hisse'nin 2/3'ü bir checkpoint çiftine oy verir → hedef justified olur.</div></div>
<div class="calc-card"><div class="card-title">Finalization</div><div class="card-body">İki ardışık justified epoch → öncekisi kesinleşir. Kesinleşmiş blokları reorganize etmek ≥ 1/3 hisse yok etmeyi gerektirir (slashing).</div></div>
<div class="calc-card"><div class="card-title">Slashing</div><div class="card-body">Equivocation (aynı epoch için iki oy) veya çevreleyen oylama → depozit kaybı. Ekonomik diş.</div></div>
<div class="calc-card"><div class="card-title">EIP-3675 (Merge)</div><div class="card-body">15 Eylül 2022 — fork seçimini PoW en uzun-zincirden LMD-GHOST + Casper'a geçirdi. Hash gücü → hisse, bir gecede.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Klasik BFT — PBFT, Tendermint, HotStuff</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">PBFT (Castro &amp; Liskov, 1999)</div><div class="card-body">Blok başına üç faz: pre-prepare → prepare → commit. Hatalı lider üzerinde view change. Karesel mesaj karmaşıklığı.</div></div>
<div class="calc-card"><div class="card-title">Tendermint (Buchman &amp; Kwon, 2014)</div><div class="card-body">Cosmos-Hub'ın güç merkezi. Propose → prevote → precommit → commit. Anlık kesinlik (bir blok = kesin). Cosmos, Binance Chain, NEAR, Celestia, Sei tarafından kullanılır.</div></div>
<div class="calc-card"><div class="card-title">HotStuff (Yin et al., 2018)</div><div class="card-body">Eşik imzaları + zincirli pipelining ile lineer mesaj karmaşıklığı (PBFT'nin karesel yerine). Diem'i (eski adıyla Libra) ve Aptos'u çalıştırır.</div></div>
<div class="calc-card"><div class="card-title">Streamlet (Chan &amp; Shi, 2020)</div><div class="card-body">Pedagojik — mümkün olan en basit BFT. İki faz, derslerde yapıyı öğretmek için kullanılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Tendermint Tarzı 4 Doğrulayıcılı Bir Simülasyon</h2>
<p class="l-text">Aşağıda: 4 doğrulayıcı (n=4, f=1), tür başına 1 teklif edici, 2f+1 = 3 quorum ile iki oylama turu (prevote, precommit). Quorum precommit'te blok commit edilir. Protokolün toleransını göstermek için tutarsız oy veren bir Bizans doğrulayıcısını simüle ediyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import hashlib, random

class Validator:
    def __init__(self, vid, byzantine=False):
        self.vid = vid; self.byz = byzantine; self.locked = None
    def prevote(self, block):
        if self.byz: return random.choice([block, "EVIL_FORK", None])
        return block
    def precommit(self, block, prevotes):
        # dürüst: quorum aynı bloğa prevote ettiyse precommit
        cnt = sum(1 for v in prevotes.values() if v == block)
        return block if cnt &gt;= 3 else None    # quorum = 4'te 3

def run_round(validators, height, proposer_id):
    # Adım 1: teklif edici bir blok yayınlar
    block = f"H{height}-by{proposer_id}-{hashlib.sha256(str(height).encode()).hexdigest()[:8]}"
    print(f"Round @ height {height}: {validators[proposer_id].vid} proposes {block}")

    # Adım 2: prevote
    prevotes = {v.vid: v.prevote(block) for v in validators}
    print(f"  prevotes: {prevotes}")

    # Adım 3: precommit
    precommits = {v.vid: v.precommit(block, prevotes) for v in validators}
    print(f"  precommits: {precommits}")

    # Adım 4: quorum varsa commit
    cnt = sum(1 for p in precommits.values() if p == block)
    if cnt &gt;= 3:
        print(f"  ✓ COMMITTED at height {height}")
        return block
    print(f"  ✗ no quorum (only {cnt}/4) — view change to next proposer")
    return None

random.seed(7)
validators = [Validator(f"V{i}", byzantine=(i==1)) for i in range(4)]   # V1 Bizans
chain = []
for h in range(1, 5):
    proposer = (h-1) % 4
    block = run_round(validators, h, proposer)
    if block: chain.append(block)
    print()

print(f"Chain length committed: {len(chain)}")
for b in chain: print(" ", b)
</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Dört <code>Validator</code> örneği <code>byzantine=(i==1)</code> ile oluşturulur — yani <code>V1</code> gerçek blok, <code>"EVIL_FORK"</code> veya hiçbiri arasında rastgele oy verir; V0/V2/V3 ise dürüst oy kullanır. 2) <code>run_round</code> Tendermint fazlarını yürütür: teklif edici <code>block</code>'u yayınlar, ardından her doğrulayıcının <code>prevote</code>'u <code>prevotes</code> sözlüğüne girer. 3) <code>precommit</code> içinde her doğrulayıcı önerilen bloğa verilen prevote'ları sayar; yalnızca <code>cnt &gt;= 3</code> (n=4 için 2f+1 quorum) ise precommit verir, aksi halde <code>None</code> döner. 4) Blok, precommit sayısı da 3'e ulaştığında commit edilir — döngü, tek Bizans V1'in ilerlemeyi engelleyemediğini gösterir; tam olarak n ≥ 3f+1 sınırının iş başında halidir.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı Tendermint tarzı demo, tarayıcıda çalıştırılabilir. Hangi doğrulayıcının Bizans olduğunu değiştirmeyi deneyin; 2 Bizans ile commit'lerin başarısız olduğunu göreceksiniz (n=4 yalnızca f=1'i tolere eder).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import random
random.seed(11)

def round_(byz_set, h, proposer):
    block = f"B{h}"
    prevotes = {i: ("EVIL" if i in byz_set and random.random()&lt;0.5 else block) for i in range(4)}
    precommits = {i: (block if list(prevotes.values()).count(block)&gt;=3 and prevotes[i]==block else None)
                  for i in range(4)}
    committed = list(precommits.values()).count(block) &gt;= 3
    return committed, prevotes, precommits

for byz in [set(), {1}, {1,2}]:
    print(f"\\nByzantine = {byz}  (n=4, f={len(byz)})")
    ok = sum(round_(byz, h, h%4)[0] for h in range(1,11))
    print(f"  committed {ok}/10 rounds")
    if len(byz) &gt; 1: print("  -&gt; n=4 cannot tolerate f &gt; 1; stuck.")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Olasılıksal vs Mutlak Kesinlik</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Olasılıksal (Bitcoin, klasik Eth PoW)</div><div class="card-body">Bir blok her onayla "daha kesin" olur. Prensip olarak her zaman reorg edilebilir. 6 blok = pratik olarak kesin.</div></div>
<div class="calc-card"><div class="card-title">BFT-anlık (Tendermint, HotStuff)</div><div class="card-body">Commit edilen blok = kesin. Daha derin reorg mümkün değil (veya 1/3 hisse slashlanır). Ödünleşim: bölünme altında canlılık durur.</div></div>
<div class="calc-card"><div class="card-title">Hibrit (Eth Gasper)</div><div class="card-body">Canlı baş olasılıksal (LMD-GHOST), checkpoint'ler ~12 dakika sonra kesinleşir (Casper FFG). İkisinin de en iyisi, karmaşıklık vergisi.</div></div>
<div class="calc-card"><div class="card-title">CAP tarzı</div><div class="card-body">PoW canlılığa güvenliğin üstünde öncelik verir; BFT güvenliğe öncelik verir. Bölünme altında: PoW madencilik yapmaya devam eder ve uzlaştırır; BFT durur, ilerlemeyi reddeder.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Fork Seçimi ve GHOST Ailesi</h2>
<p class="l-text">Bitcoin'in fork seçimi "birikmiş işe göre en uzun zincir"dir. Ethereum (Merge öncesi) <strong>GHOST</strong> ("Greediest Heaviest Observed SubTree", Sompolinsky &amp; Zohar, 2013) kullandı, böylece amcaların işi de sayılır — kısa blok süreleri için önemli. PoS Ethereum, doğrulayıcı kümesinin son atestasyonları üzerinde <strong>LMD-GHOST</strong> kullanır.</p>

<div class="calc-highlight">Vitalik'in "balancing attack" makaleleri (2020), bir saldırgan ağın görüşünü bölebildiğinde saf LMD-GHOST'un ince düşmanca köşe durumlarına sahip olduğunu gösterdi. <strong>Casper FFG</strong> hasarı sınırlar: LMD-GHOST başı dalgalanırsa bile, kesinleşmiş checkpoint'ler hareket etmez.</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Pratik Seçimler (2026 manzarası)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">PoW mirasına ihtiyaç</div><div class="card-body">Bitcoin (ve fork'ları). Muhafazakâr, savaşta sınanmış, akıllı sözleşme yok.</div></div>
<div class="calc-card"><div class="card-title">EVM + DeFi'a ihtiyaç</div><div class="card-body">Ethereum mainnet + L2 rollup'lar. Gasper mutabakat.</div></div>
<div class="calc-card"><div class="card-title">Hızlı anlık kesinliğe ihtiyaç</div><div class="card-body">Cosmos zincirleri (Tendermint), Aptos/Sui (HotStuff varyantları), Solana (PoH+PoS).</div></div>
<div class="calc-card"><div class="card-title">İzinliye ihtiyaç</div><div class="card-body">Hyperledger Fabric (Raft sıralayıcı, BFT isteğe bağlı), Hyperledger Besu IBFT, Quorum.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>BFT n ≥ 3f+1 gerektirir; FLP, asenkron deterministik mutabakatın eş zamanlılık/rastgelelik olmadan imkânsız olduğunu söyler.</li>
<li>Bitcoin PoW: target = 2^256/difficulty; ~10 dakika bloklar; 6 onay = pratik olarak kesin.</li>
<li>Ethereum Gasper: LMD-GHOST baş + epoch sınırlarında Casper FFG kesinleşmesi.</li>
<li>Tendermint &amp; HotStuff anlık BFT kesinliği verir; HotStuff lineer mesaj karmaşıklığı sağlar.</li>
<li>Olasılıksal vs mutlak kesinlik gerçek bir mühendislik ödünleşmesidir.</li>
</ul>
</div>
<p class="l-text">Sıradaki, <strong>blockchain-L6</strong>: ZK rollup'lar, optimistic rollup'lar, fraud proof'lar vs validity proof'lar.</p>
</div>`
};
