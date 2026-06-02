window.BLOCKCHAIN_L1 = {

en: `<p class="l-text"><strong>On 31 October 2008, an anonymous author calling themselves Satoshi Nakamoto posted a nine-page paper titled <em>Bitcoin: A Peer-to-Peer Electronic Cash System</em> to the cypherpunk mailing list.</strong> Six pages in, almost as a footnote, sat the idea that would reshape money, identity and computation: a chain of hashed blocks, secured by a proof-of-work race, replicated across thousands of mutually distrusting machines. No bank, no central server, no admin password — and yet the ledger agrees.</p>
<p class="l-text">In this opening lesson we strip the romance away and look at what a blockchain actually <em>is</em>: an append-only data structure built from cryptographic hash chains and Merkle trees, replicated by a consensus protocol that solves the Byzantine Generals Problem (Lamport, Shostak, Pease, 1982). By the end you will be able to hand-build a tiny chain in pure Python, explain why the double-spend problem is the hardest part of digital cash, and tell a public chain (Bitcoin, Ethereum) from a permissioned one (Hyperledger Fabric, Quorum) without hand-waving.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Build a hash chain in pure Python and see how a single byte flip cascades</li>
<li>Construct a Merkle tree and verify a membership proof in O(log n)</li>
<li>State the double-spend problem and explain why naive replication does not solve it</li>
<li>Compare public, consortium and permissioned ledgers on trust, throughput and finality</li>
<li>Quote the Byzantine Generals bound: BFT tolerates up to f &lt; n/3 faulty nodes</li>
<li>Distinguish probabilistic finality (Bitcoin) from deterministic finality (Tendermint)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What a Blockchain Actually Is</h2>
<p class="l-text">Forget the hype for a minute. A blockchain is three boring ideas glued together: <strong>(a)</strong> a hash-linked list so that history cannot be edited silently, <strong>(b)</strong> a Merkle tree inside each block so that a light client can verify membership without downloading everything, and <strong>(c)</strong> a consensus protocol that lets thousands of replicas agree on which block is next, even when some are malicious. Take any of the three away and you get a database, not a blockchain.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hash chain</div><div class="card-body">Block n stores H(block n-1). Edit block 5 and every later hash breaks.</div></div>
<div class="calc-card"><div class="card-title">Merkle tree</div><div class="card-body">Pairwise SHA-256 hashing of transactions; a 32-byte root commits to all of them.</div></div>
<div class="calc-card"><div class="card-title">Consensus</div><div class="card-body">PoW, PoS or BFT: rule that picks the canonical next block among competing proposals.</div></div>
<div class="calc-card"><div class="card-title">Replication</div><div class="card-body">Every full node stores the entire chain. Censorship requires corrupting every node.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Cryptographic Hash, Briefly</h2>
<p class="l-text">A cryptographic hash function H takes any byte string and returns a fixed-length digest (32 bytes for SHA-256) such that finding two inputs with the same digest is computationally infeasible. Bitcoin uses double SHA-256, Ethereum uses Keccak-256. Three properties matter: pre-image resistance, second pre-image resistance, and collision resistance.</p>
<div class="katex-block">$$H : \\{0,1\\}^* \\to \\{0,1\\}^{256}, \\quad \\Pr[H(x)=H(y) \\mid x \\neq y] \\approx 2^{-128}$$</div>
<div class="calc-highlight">The avalanche effect means flipping one input bit flips, on average, half of the output bits. This is why hash chains detect tampering: a single edit upstream invalidates every downstream digest.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Building a Hash Chain by Hand</h2>
<p class="l-text">Below we build a five-block chain. Each block stores a payload and the hash of its predecessor. Try editing <code>blocks[2]['data']</code> after the chain is built and you will see every following hash mismatch — that is exactly the integrity guarantee Nakamoto leans on.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, json

<span class="kw">def</span> <span class="fn">h</span>(obj):
    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>(json.<span class="fn">dumps</span>(obj, sort_keys=<span class="kw">True</span>).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()

genesis = {<span class="str">"i"</span>: <span class="num">0</span>, <span class="str">"data"</span>: <span class="str">"genesis"</span>, <span class="str">"prev"</span>: <span class="str">"0"</span>*<span class="num">64</span>}
chain = [genesis]
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="num">5</span>):
    blk = {<span class="str">"i"</span>: i, <span class="str">"data"</span>: f<span class="str">"tx-{i}"</span>, <span class="str">"prev"</span>: <span class="fn">h</span>(chain[-<span class="num">1</span>])}
    chain.<span class="fn">append</span>(blk)

<span class="kw">for</span> b <span class="kw">in</span> chain:
    <span class="fn">print</span>(b[<span class="str">"i"</span>], <span class="fn">h</span>(b)[:<span class="num">12</span>], <span class="str">"prev="</span>, b[<span class="str">"prev"</span>][:<span class="num">12</span>])

<span class="cm"># Tamper test</span>
chain[<span class="num">2</span>][<span class="str">"data"</span>] = <span class="str">"hacked"</span>
ok = <span class="fn">all</span>(chain[i][<span class="str">"prev"</span>] == <span class="fn">h</span>(chain[i-<span class="num">1</span>]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="fn">len</span>(chain)))
<span class="fn">print</span>(<span class="str">"chain valid?"</span>, ok)</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) Define a deterministic JSON hash. 2) Build a genesis block with prev = all-zero. 3) Each subsequent block embeds the SHA-256 of the previous block. 4) Tamper with block 2 and re-verify — the chain is now invalid because block 3's <code>prev</code> field no longer matches the recomputed hash of the (modified) block 2.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Merkle Trees: O(log n) Membership</h2>
<p class="l-text">A block in Bitcoin contains thousands of transactions. Instead of hashing them as one blob, the protocol pair-hashes them into a binary tree. The 32-byte root is stored in the block header. To prove that transaction <em>tx</em> is in the block, you only need the sibling hashes along the path — about log₂(n) entries. This is the trick that makes SPV (Simplified Payment Verification, Nakamoto §8) wallets possible.</p>
<div class="katex-block">$$\\text{root} = H(H(L_1 \\Vert L_2) \\Vert H(L_3 \\Vert L_4))$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">H</span>(b):
    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>(b).<span class="fn">digest</span>()

<span class="kw">def</span> <span class="fn">merkle_root</span>(leaves):
    nodes = [<span class="fn">H</span>(x.<span class="fn">encode</span>()) <span class="kw">for</span> x <span class="kw">in</span> leaves]
    <span class="kw">while</span> <span class="fn">len</span>(nodes) &gt; <span class="num">1</span>:
        <span class="kw">if</span> <span class="fn">len</span>(nodes) % <span class="num">2</span>:
            nodes.<span class="fn">append</span>(nodes[-<span class="num">1</span>])    <span class="cm"># Bitcoin duplicates the last leaf</span>
        nodes = [<span class="fn">H</span>(nodes[i] + nodes[i+<span class="num">1</span>]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(nodes), <span class="num">2</span>)]
    <span class="kw">return</span> nodes[<span class="num">0</span>]

txs = [<span class="str">"alice-&gt;bob:5"</span>, <span class="str">"bob-&gt;carol:2"</span>, <span class="str">"dave-&gt;eve:7"</span>, <span class="str">"frank-&gt;gus:1"</span>]
<span class="fn">print</span>(<span class="str">"root="</span>, <span class="fn">merkle_root</span>(txs).<span class="fn">hex</span>()[:<span class="num">32</span>])</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) Hash each leaf transaction. 2) Walk up the tree, hashing pairs. 3) If the level has odd width, duplicate the last node (Bitcoin convention — actually a known weakness called the CVE-2012-2459 Merkle malleability bug). 4) The single 32-byte root is what goes into the block header.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Double-Spend Problem</h2>
<p class="l-text">Digital money has one obviously hard problem: bytes copy for free. If Alice sends 5 BTC to Bob, what stops her from sending the same 5 BTC to Carol two seconds later? In a centralized system the bank says "no" because it sees both transactions. In a decentralized system there is no bank. Nakamoto's contribution was to argue that proof-of-work plus the longest-chain rule make double-spend exponentially expensive, not impossible.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naive replication fails</div><div class="card-body">If two replicas see different orderings, they disagree on whose 5 BTC is real.</div></div>
<div class="calc-card"><div class="card-title">PoW solution</div><div class="card-body">Whichever fork has more accumulated work wins. Reorganizing N blocks costs ~N · block reward.</div></div>
<div class="calc-card"><div class="card-title">Confirmations</div><div class="card-body">Bitcoin merchants wait 6 blocks (~60 min). Probability of reorg drops as e^{-λk}.</div></div>
<div class="calc-card"><div class="card-title">Selfish mining</div><div class="card-body">Eyal &amp; Sirer 2014 showed a miner with &gt;25% hash power can earn disproportionate rewards.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Public, Consortium, Permissioned</h2>
<p class="l-text">Not every chain is open. The design space splits along who can <em>read</em> and who can <em>write</em>.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Public</div><div class="card-body">Anyone reads, anyone proposes. Bitcoin, Ethereum, Solana. Strong censorship resistance, low TPS.</div></div>
<div class="calc-card"><div class="card-title">Consortium</div><div class="card-body">Reads open, writes restricted to a known set. R3 Corda, energy grids.</div></div>
<div class="calc-card"><div class="card-title">Permissioned</div><div class="card-body">Both reads and writes gated. Hyperledger Fabric, Quorum. Enterprise + supply chain.</div></div>
<div class="calc-card"><div class="card-title">Trade-off</div><div class="card-body">More permission → higher TPS, lower trust assumption. Less permission → opposite.</div></div>
</div>
<div class="calc-highlight">A permissioned ledger run by one company is, in security terms, just a replicated database with extra steps. The interesting cryptography lives on public chains where validators are unknown adversaries.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. The Byzantine Generals Problem</h2>
<p class="l-text">Lamport, Shostak and Pease (1982) framed the underlying question: how do n distributed actors reach agreement when up to f of them may lie arbitrarily? Their result: deterministic agreement is impossible if f ≥ n/3, and possible (with synchronous messaging and signatures) up to f &lt; n/3. Every BFT consensus protocol — PBFT (Castro &amp; Liskov 1999), Tendermint (Buchman 2016), HotStuff (Yin 2019) — operates inside this bound.</p>
<div class="katex-block">$$\\text{BFT tolerates } f < \\tfrac{n}{3} \\quad \\text{(synchronous, with signatures)}$$</div>
<p class="l-text">Bitcoin sidesteps the bound by using a different threat model: instead of f &lt; n/3 of <em>identities</em>, it requires &lt; 50% of <em>computational power</em> — a Sybil-resistant resource (electricity) replaces voting weight.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Probabilistic vs Deterministic Finality</h2>
<p class="l-text">When is a transaction "really" confirmed? Bitcoin and pre-Merge Ethereum offer <em>probabilistic finality</em>: the chance of a reversal halves with every confirmation. Tendermint, HotStuff and post-Merge Ethereum (with Casper FFG, Buterin &amp; Griffith 2017) offer <em>deterministic finality</em>: once 2/3 of validators sign, the block can never be reverted without slashing.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bitcoin</div><div class="card-body">6 confirmations ≈ 99.999% safety against a 10% adversary. Never absolute.</div></div>
<div class="calc-card"><div class="card-title">Ethereum (post-Merge)</div><div class="card-body">Finality after 2 epochs (~12.8 min) via Casper FFG.</div></div>
<div class="calc-card"><div class="card-title">Tendermint</div><div class="card-body">Single-block finality. If 2/3+ vote, block is final immediately.</div></div>
<div class="calc-card"><div class="card-title">When it matters</div><div class="card-body">Cross-chain bridges, exchanges, settlement networks need deterministic finality.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Visualizing Reorg Probability</h2>
<p class="l-text">Nakamoto §11 derives the probability that an attacker controlling a fraction q of the hash power catches up after k confirmations. The plot below shows it falling exponentially in k for q = 0.1, 0.25 and 0.4.</p>
<div id="bc1-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Blockchain = hash chain + Merkle trees + consensus + replication.<br><strong>2.</strong> SHA-256 / Keccak-256 give pre-image and collision resistance at ~2^128 work.<br><strong>3.</strong> Merkle proofs verify membership in O(log n) — the basis of light clients and SPV.<br><strong>4.</strong> Double-spend is the only hard problem of digital cash; PoW makes it expensive, not impossible.<br><strong>5.</strong> Public ↔ permissioned is a trust / throughput trade-off, not a moral one.<br><strong>6.</strong> BFT consensus tolerates up to f &lt; n/3 Byzantine actors (Lamport 1982).<br><strong>7.</strong> Probabilistic finality (Bitcoin) vs deterministic finality (Tendermint, Casper FFG).</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var k = Array.from({length:12}, (_,i)=>i+1);
  function P(q){ return k.map(function(kk){ return Math.pow(q/(1-q), kk); }); }
  var data = [
    {x:k,y:P(0.1).map(function(v){return Math.min(1,v);}),name:'q=0.10',type:'scatter',mode:'lines+markers',line:{color:'#4ade80'}},
    {x:k,y:P(0.25).map(function(v){return Math.min(1,v);}),name:'q=0.25',type:'scatter',mode:'lines+markers',line:{color:T.accent}},
    {x:k,y:P(0.4).map(function(v){return Math.min(1,v);}),name:'q=0.40',type:'scatter',mode:'lines+markers',line:{color:'#f87171'}}
  ];
  var layout = {title:'Nakamoto §11: P(attacker catches up after k confirmations)',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Confirmations k',gridcolor:T.grid},yaxis:{title:'Reversal probability',type:'log',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['bc1-plot-en','bc1-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>31 Ekim 2008'de Satoshi Nakamoto adıyla kendini tanıtan anonim bir yazar, cypherpunk e-posta listesine <em>Bitcoin: Eşler Arası Elektronik Nakit Sistemi</em> başlıklı dokuz sayfalık bir makale yolladı.</strong> Altıncı sayfada, neredeyse bir dipnot gibi, parayı, kimliği ve hesaplamayı yeniden şekillendirecek fikir duruyordu: hash'lenmiş blokların bir zinciri, iş kanıtı (proof-of-work) yarışıyla güvence altına alınan, birbirine güvenmeyen binlerce makinede çoğaltılan bir defter. Ne banka var, ne merkezi sunucu, ne admin parolası — yine de defter mutabık kalıyor.</p>
<p class="l-text">Bu açılış dersinde romantizmi sıyırıp blockchain'in gerçekte ne olduğuna bakıyoruz: kriptografik hash zincirleri ve Merkle ağaçlarından inşa edilen, sadece-ekleme (append-only) bir veri yapısı; bunun üstüne Bizans Generaller Problemi'ni (Lamport, Shostak, Pease, 1982) çözen bir mutabakat protokolü ile çoğaltılır. Ders sonunda saf Python ile küçük bir zincir kurabilecek, çift-harcama probleminin neden dijital paranın en zor parçası olduğunu açıklayabilecek ve bir kamu zincirini (Bitcoin, Ethereum) izinli bir zincirden (Hyperledger Fabric, Quorum) el sallamadan ayırt edebileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Saf Python ile bir hash zinciri inşa edin ve tek bayt değişikliğinin nasıl çağlayan etki yaptığını görün</li>
<li>Bir Merkle ağacı kurun ve O(log n) zamanda üyelik kanıtını doğrulayın</li>
<li>Çift-harcama problemini ifade edin ve naif çoğaltmanın neden çözmediğini açıklayın</li>
<li>Kamu, konsorsiyum ve izinli defterleri güven, verim ve kesinlik üzerinden karşılaştırın</li>
<li>Bizans Generaller sınırını söyleyin: BFT en fazla f &lt; n/3 hatalı düğüme dayanır</li>
<li>Olasılıksal kesinlik (Bitcoin) ile deterministik kesinliği (Tendermint) ayırt edin</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. Blockchain Aslında Nedir</h2>
<p class="l-text">Bir dakikalığına abartıyı unutun. Blockchain, birbirine yapıştırılmış üç sıkıcı fikirden ibarettir: <strong>(a)</strong> tarihin sessizce düzenlenememesini sağlayan hash-bağlı bir liste, <strong>(b)</strong> her bloğun içinde, hafif bir istemcinin her şeyi indirmeden üyeliği doğrulayabilmesini sağlayan bir Merkle ağacı ve <strong>(c)</strong> bazıları kötü niyetli olsa bile binlerce kopyanın bir sonraki bloğun ne olacağı konusunda anlaşmasını sağlayan bir mutabakat protokolü. Üçünden birini çıkarın, elinizde blockchain değil, veritabanı kalır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hash zinciri</div><div class="card-body">Blok n, H(blok n-1) değerini saklar. 5. bloğu düzenleyin, sonraki tüm hash'ler kırılır.</div></div>
<div class="calc-card"><div class="card-title">Merkle ağacı</div><div class="card-body">İşlemlerin ikişer ikişer SHA-256 ile hash'lenmesi; 32 baytlık bir kök hepsine bağlanır.</div></div>
<div class="calc-card"><div class="card-title">Mutabakat</div><div class="card-body">PoW, PoS veya BFT: rakip önerilerden kanonik bir sonraki bloğu seçen kural.</div></div>
<div class="calc-card"><div class="card-title">Çoğaltma</div><div class="card-body">Her tam düğüm zincirin tamamını saklar. Sansür, her düğümü bozmayı gerektirir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Kriptografik Hash, Kısaca</h2>
<p class="l-text">Kriptografik bir hash fonksiyonu H, herhangi bir bayt dizisini alıp sabit uzunlukta bir özet (SHA-256 için 32 bayt) döndürür; aynı özete sahip iki girdi bulmak hesaplama açısından mümkün değildir. Bitcoin çift SHA-256 kullanır, Ethereum Keccak-256 kullanır. Üç özellik önemlidir: ön-görüntü direnci, ikinci ön-görüntü direnci ve çakışma direnci.</p>
<div class="katex-block">$$H : \\{0,1\\}^* \\to \\{0,1\\}^{256}, \\quad \\Pr[H(x)=H(y) \\mid x \\neq y] \\approx 2^{-128}$$</div>
<div class="calc-highlight">Çığ etkisi (avalanche effect), bir girdi bitini çevirmenin ortalama olarak çıkış bitlerinin yarısını çevirmesi anlamına gelir. Hash zincirlerinin oynamayı tespit etmesinin nedeni budur: yukarıda yapılan tek bir düzenleme aşağıdaki tüm özetleri geçersiz kılar.</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Elle Hash Zinciri İnşa Etmek</h2>
<p class="l-text">Aşağıda beş bloklu bir zincir inşa ediyoruz. Her blok bir yük (payload) ve öncesinin hash'ini saklar. Zincir kurulduktan sonra <code>blocks[2]['data']</code> alanını düzenlemeyi deneyin; sonraki her hash'in eşleşmediğini göreceksiniz — Nakamoto'nun dayandığı bütünlük garantisi tam olarak budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib, json

<span class="kw">def</span> <span class="fn">h</span>(obj):
    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>(json.<span class="fn">dumps</span>(obj, sort_keys=<span class="kw">True</span>).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()

genesis = {<span class="str">"i"</span>: <span class="num">0</span>, <span class="str">"data"</span>: <span class="str">"genesis"</span>, <span class="str">"prev"</span>: <span class="str">"0"</span>*<span class="num">64</span>}
chain = [genesis]
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="num">5</span>):
    blk = {<span class="str">"i"</span>: i, <span class="str">"data"</span>: f<span class="str">"tx-{i}"</span>, <span class="str">"prev"</span>: <span class="fn">h</span>(chain[-<span class="num">1</span>])}
    chain.<span class="fn">append</span>(blk)

<span class="kw">for</span> b <span class="kw">in</span> chain:
    <span class="fn">print</span>(b[<span class="str">"i"</span>], <span class="fn">h</span>(b)[:<span class="num">12</span>], <span class="str">"prev="</span>, b[<span class="str">"prev"</span>][:<span class="num">12</span>])

<span class="cm"># Müdahale testi</span>
chain[<span class="num">2</span>][<span class="str">"data"</span>] = <span class="str">"hacked"</span>
ok = <span class="fn">all</span>(chain[i][<span class="str">"prev"</span>] == <span class="fn">h</span>(chain[i-<span class="num">1</span>]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">1</span>, <span class="fn">len</span>(chain)))
<span class="fn">print</span>(<span class="str">"chain valid?"</span>, ok)</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Deterministik bir JSON hash tanımlayın. 2) Tamamı sıfır olan prev ile bir genesis bloğu kurun. 3) Sonraki her blok, önceki bloğun SHA-256'sını gömer. 4) 2. blok ile oynayıp tekrar doğrulayın — zincir artık geçersizdir, çünkü 3. bloğun <code>prev</code> alanı (değiştirilmiş) 2. bloğun yeniden hesaplanan hash'iyle artık eşleşmez.</p>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Merkle Ağaçları: O(log n) Üyelik</h2>
<p class="l-text">Bitcoin'deki bir blok binlerce işlem içerir. Protokol bunları tek bir blob olarak hash'lemek yerine, ikili ağaca pair-hash eder. 32 baytlık kök, blok başlığında saklanır. <em>tx</em> işleminin blokta olduğunu kanıtlamak için yalnızca yol boyunca kardeş hash'lere — yaklaşık log₂(n) girdiye — ihtiyacınız vardır. Bu, SPV (Basitleştirilmiş Ödeme Doğrulama, Nakamoto §8) cüzdanlarını mümkün kılan püf noktasıdır.</p>
<div class="katex-block">$$\\text{root} = H(H(L_1 \\Vert L_2) \\Vert H(L_3 \\Vert L_4))$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">H</span>(b):
    <span class="kw">return</span> hashlib.<span class="fn">sha256</span>(b).<span class="fn">digest</span>()

<span class="kw">def</span> <span class="fn">merkle_root</span>(leaves):
    nodes = [<span class="fn">H</span>(x.<span class="fn">encode</span>()) <span class="kw">for</span> x <span class="kw">in</span> leaves]
    <span class="kw">while</span> <span class="fn">len</span>(nodes) &gt; <span class="num">1</span>:
        <span class="kw">if</span> <span class="fn">len</span>(nodes) % <span class="num">2</span>:
            nodes.<span class="fn">append</span>(nodes[-<span class="num">1</span>])    <span class="cm"># Bitcoin son yaprağı tekrarlar</span>
        nodes = [<span class="fn">H</span>(nodes[i] + nodes[i+<span class="num">1</span>]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">0</span>, <span class="fn">len</span>(nodes), <span class="num">2</span>)]
    <span class="kw">return</span> nodes[<span class="num">0</span>]

txs = [<span class="str">"alice-&gt;bob:5"</span>, <span class="str">"bob-&gt;carol:2"</span>, <span class="str">"dave-&gt;eve:7"</span>, <span class="str">"frank-&gt;gus:1"</span>]
<span class="fn">print</span>(<span class="str">"root="</span>, <span class="fn">merkle_root</span>(txs).<span class="fn">hex</span>()[:<span class="num">32</span>])</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Her yaprak işlemi hash'leyin. 2) Çiftleri hash'leyerek ağaçta yukarı çıkın. 3) Seviye tek genişlikteyse son düğümü tekrarlayın (Bitcoin geleneği — aslında CVE-2012-2459 Merkle malleability hatası olarak bilinen bir zayıflık). 4) Blok başlığına giden tek 32 baytlık kök budur.</p>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Çift-Harcama Problemi</h2>
<p class="l-text">Dijital paranın bariz biçimde zor bir problemi vardır: bayt'lar bedavaya kopyalanır. Alice, Bob'a 5 BTC gönderirse, iki saniye sonra aynı 5 BTC'yi Carol'a göndermesini ne engelliyor? Merkezi bir sistemde banka "olmaz" der, çünkü her iki işlemi de görür. Merkeziyetsiz bir sistemde banka yoktur. Nakamoto'nun katkısı, iş kanıtı artı en uzun zincir kuralının çift-harcamayı imkânsız değil, üstel olarak pahalı kıldığını savunmaktı.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Naif çoğaltma başarısız olur</div><div class="card-body">İki kopya farklı sıralamalar görürse, kimin 5 BTC'sinin gerçek olduğu konusunda anlaşamazlar.</div></div>
<div class="calc-card"><div class="card-title">PoW çözümü</div><div class="card-body">Hangi çatalda daha çok birikmiş iş varsa o kazanır. N bloğu yeniden düzenlemek ~N · blok ödülü kadar maliyetlidir.</div></div>
<div class="calc-card"><div class="card-title">Onaylar</div><div class="card-body">Bitcoin satıcıları 6 blok (~60 dk) bekler. Reorg olasılığı e^{-λk} olarak düşer.</div></div>
<div class="calc-card"><div class="card-title">Bencil madencilik</div><div class="card-body">Eyal &amp; Sirer 2014, &gt;%25 hash gücüne sahip bir madencinin orantısız ödül kazanabileceğini gösterdi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Kamu, Konsorsiyum, İzinli</h2>
<p class="l-text">Her zincir açık değildir. Tasarım uzayı kimin <em>okuyabildiği</em> ve kimin <em>yazabildiği</em> ekseninde ayrılır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kamu</div><div class="card-body">Herkes okur, herkes önerir. Bitcoin, Ethereum, Solana. Güçlü sansür direnci, düşük TPS.</div></div>
<div class="calc-card"><div class="card-title">Konsorsiyum</div><div class="card-body">Okumalar açık, yazmalar bilinen bir küme ile sınırlı. R3 Corda, enerji şebekeleri.</div></div>
<div class="calc-card"><div class="card-title">İzinli</div><div class="card-body">Hem okumalar hem yazmalar kapılı. Hyperledger Fabric, Quorum. Kurumsal + tedarik zinciri.</div></div>
<div class="calc-card"><div class="card-title">Ödünleşim</div><div class="card-body">Daha çok izin → daha yüksek TPS, daha düşük güven varsayımı. Daha az izin → tersi.</div></div>
</div>
<div class="calc-highlight">Tek şirketin işlettiği izinli bir defter, güvenlik açısından sadece birkaç ek adımı olan, çoğaltılmış bir veritabanından ibarettir. İlginç kriptografi, doğrulayıcıların bilinmeyen düşmanlar olduğu kamu zincirlerinde yaşar.</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Bizans Generaller Problemi</h2>
<p class="l-text">Lamport, Shostak ve Pease (1982) altta yatan soruyu çerçeveledi: f tanesi keyfi olarak yalan söyleyebilirken n dağıtılmış aktör nasıl anlaşabilir? Sonuçları: f ≥ n/3 ise deterministik anlaşma imkânsızdır ve (senkron mesajlaşma ve imzalarla) f &lt; n/3 olduğunda mümkündür. Her BFT mutabakat protokolü — PBFT (Castro &amp; Liskov 1999), Tendermint (Buchman 2016), HotStuff (Yin 2019) — bu sınır içinde çalışır.</p>
<div class="katex-block">$$\\text{BFT tolerates } f < \\tfrac{n}{3} \\quad \\text{(synchronous, with signatures)}$$</div>
<p class="l-text">Bitcoin, farklı bir tehdit modeli kullanarak bu sınırın etrafından dolaşır: <em>kimliklerin</em> f &lt; n/3'ü yerine, <em>hesaplama gücünün</em> &lt;%50'sini gerektirir — Sybil dirençli bir kaynak (elektrik) oy ağırlığının yerini alır.</p>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Olasılıksal vs Deterministik Kesinlik</h2>
<p class="l-text">Bir işlem ne zaman "gerçekten" onaylanmış sayılır? Bitcoin ve Merge öncesi Ethereum <em>olasılıksal kesinlik</em> sunar: tersine çevrilme olasılığı her onayla yarıya iner. Tendermint, HotStuff ve Merge sonrası Ethereum (Casper FFG ile, Buterin &amp; Griffith 2017) <em>deterministik kesinlik</em> sunar: 2/3 doğrulayıcı imzaladıktan sonra, blok slashing olmadan asla geri alınamaz.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bitcoin</div><div class="card-body">6 onay ≈ %10'luk bir saldırgana karşı %99.999 güvenlik. Asla mutlak değil.</div></div>
<div class="calc-card"><div class="card-title">Ethereum (Merge sonrası)</div><div class="card-body">Casper FFG ile 2 epoch (~12.8 dk) sonra kesinlik.</div></div>
<div class="calc-card"><div class="card-title">Tendermint</div><div class="card-body">Tek-blok kesinlik. 2/3+ oy verirse, blok hemen kesinleşir.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman önemli</div><div class="card-body">Zincirler arası köprüler, borsalar, takas ağları deterministik kesinliğe ihtiyaç duyar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Reorg Olasılığını Görselleştirmek</h2>
<p class="l-text">Nakamoto §11, hash gücünün q oranını kontrol eden bir saldırganın k onaydan sonra yetişme olasılığını türetir. Aşağıdaki grafik, q = 0.1, 0.25 ve 0.4 için bunun k'ya göre üstel olarak düştüğünü gösterir.</p>
<div id="bc1-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-10-tr">
<h2 class="lesson-title">10. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Blockchain = hash zinciri + Merkle ağaçları + mutabakat + çoğaltma.<br><strong>2.</strong> SHA-256 / Keccak-256 yaklaşık 2^128 işle ön-görüntü ve çakışma direnci verir.<br><strong>3.</strong> Merkle kanıtları üyeliği O(log n) zamanda doğrular — hafif istemcilerin ve SPV'nin temeli.<br><strong>4.</strong> Çift-harcama dijital nakdin tek zor problemidir; PoW onu pahalı yapar, imkânsız değil.<br><strong>5.</strong> Kamu ↔ izinli, ahlaki değil, güven / verim ödünleşmesidir.<br><strong>6.</strong> BFT mutabakat en fazla f &lt; n/3 Bizans aktöre dayanır (Lamport 1982).<br><strong>7.</strong> Olasılıksal kesinlik (Bitcoin) vs deterministik kesinlik (Tendermint, Casper FFG).</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var k = Array.from({length:12}, (_,i)=>i+1);
  function P(q){ return k.map(function(kk){ return Math.pow(q/(1-q), kk); }); }
  var data = [
    {x:k,y:P(0.1).map(function(v){return Math.min(1,v);}),name:'q=0.10',type:'scatter',mode:'lines+markers',line:{color:'#4ade80'}},
    {x:k,y:P(0.25).map(function(v){return Math.min(1,v);}),name:'q=0.25',type:'scatter',mode:'lines+markers',line:{color:T.accent}},
    {x:k,y:P(0.4).map(function(v){return Math.min(1,v);}),name:'q=0.40',type:'scatter',mode:'lines+markers',line:{color:'#f87171'}}
  ];
  var layout = {title:'Nakamoto §11: P(saldırganın k onaydan sonra yetişme olasılığı)',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Onay sayısı k',gridcolor:T.grid},yaxis:{title:'Tersine çevrilme olasılığı',type:'log',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  var el=document.getElementById('bc1-plot-tr'); if(el && window.Plotly) Plotly.newPlot('bc1-plot-tr',data,layout,{displayModeBar:false});
},250);
</script>`
};
