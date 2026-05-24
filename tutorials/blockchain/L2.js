window.BLOCKCHAIN_L2 = {

en: `<p class="l-text"><strong>Bitcoin is not a database — it is a state machine whose state is a set of unspent transaction outputs (UTXOs), advanced by a tiny stack-based scripting language and protected by a 14-year-old proof-of-work race that, as of 2026, burns roughly 150 TWh of electricity per year.</strong> Every transaction you have ever heard about, from the 2010 Pizza Day (10,000 BTC for two pizzas) to billion-dollar cold wallet sweeps, is just a Bitcoin Script program consuming UTXOs and producing new ones.</p>
<p class="l-text">In this lesson we open Bitcoin's hood. We will simulate the UTXO model, run a Bitcoin Script interpreter on a real <code>P2PKH</code> redemption, derive the difficulty target from first principles, and finish with two upgrades that quietly modernized the protocol: SegWit (BIP-141, 2017), Taproot/Schnorr (BIP-340/341/342, 2021) and the Lightning Network as a layer-2 payment channel mesh.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Trace a payment as UTXO consumption and creation rather than balance updates</li>
<li>Execute a Bitcoin Script (P2PKH) on a stack-based virtual machine in Python</li>
<li>Derive the difficulty target from target = 2^256 / difficulty and tune block time</li>
<li>Explain proof-of-work as a hashcash (Back, 1997) variant tuned to ~10 minutes</li>
<li>Read a Lightning channel as a 2-of-2 multisig + revocable commitment</li>
<li>State what Schnorr signatures and Taproot (BIP-340/341) change about privacy and fees</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. UTXO: Bitcoin Has No Accounts</h2>
<p class="l-text">Ethereum stores balances. Bitcoin does not. Bitcoin tracks a giant set of <em>unspent transaction outputs</em>: each one is a coin of a specific value, locked by a script, that can be spent exactly once. Sending 5 BTC to Bob means consuming one or more of your UTXOs whose total ≥ 5 BTC, creating a new UTXO of 5 BTC for Bob, and a "change" UTXO back to yourself.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Input</div><div class="card-body">Reference to a previous UTXO + unlocking script (signature + pubkey).</div></div>
<div class="calc-card"><div class="card-title">Output</div><div class="card-body">Amount in satoshis + locking script (who can spend this next).</div></div>
<div class="calc-card"><div class="card-title">No balance</div><div class="card-body">Your "balance" is the sum of UTXOs your wallet can sign for. Computed locally.</div></div>
<div class="calc-card"><div class="card-title">Privacy</div><div class="card-body">Each UTXO can be sent to a fresh address — no inherent identity linking.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. UTXO Set in Python</h2>
<p class="l-text">A clean way to internalize UTXOs is to simulate one. Below, the global UTXO set is a dict from (txid, vout) to (amount, owner). A transaction consumes inputs, produces outputs, and is rejected if the totals do not match.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

utxo = {(<span class="str">"genesis"</span>, <span class="num">0</span>): (<span class="num">50</span>, <span class="str">"alice"</span>)}

<span class="kw">def</span> <span class="fn">spend</span>(inputs, outputs):
    in_sum = <span class="fn">sum</span>(utxo[i][<span class="num">0</span>] <span class="kw">for</span> i <span class="kw">in</span> inputs)
    out_sum = <span class="fn">sum</span>(o[<span class="num">0</span>] <span class="kw">for</span> o <span class="kw">in</span> outputs)
    <span class="kw">assert</span> in_sum &gt;= out_sum, <span class="str">"insufficient funds"</span>
    fee = in_sum - out_sum
    txid = hashlib.<span class="fn">sha256</span>(<span class="fn">repr</span>((inputs, outputs)).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()[:<span class="num">10</span>]
    <span class="kw">for</span> i <span class="kw">in</span> inputs:
        <span class="kw">del</span> utxo[i]
    <span class="kw">for</span> j, (amt, owner) <span class="kw">in</span> <span class="fn">enumerate</span>(outputs):
        utxo[(txid, j)] = (amt, owner)
    <span class="kw">return</span> txid, fee

txid, fee = <span class="fn">spend</span>([(<span class="str">"genesis"</span>, <span class="num">0</span>)], [(<span class="num">30</span>, <span class="str">"bob"</span>), (<span class="num">19</span>, <span class="str">"alice"</span>)])
<span class="fn">print</span>(<span class="str">"tx"</span>, txid, <span class="str">"fee"</span>, fee, <span class="str">"miner takes 1 satoshi*1e8"</span>)
<span class="fn">print</span>(<span class="str">"utxo set:"</span>, utxo)</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) Genesis UTXO of 50 BTC owned by Alice. 2) Alice spends it: 30 to Bob, 19 back as change. 3) The 1 BTC missing is the miner fee. 4) The old UTXO is removed; two new UTXOs are added. There are no balances anywhere — only this set.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Bitcoin Script: A Stack VM</h2>
<p class="l-text">A locking script is a tiny Forth-like program. The most common one, <code>P2PKH</code> (Pay-to-Public-Key-Hash), reads: <code>OP_DUP OP_HASH160 &lt;pubKeyHash&gt; OP_EQUALVERIFY OP_CHECKSIG</code>. The unlocking script provides &lt;sig&gt; &lt;pubKey&gt;. Concatenated and executed left-to-right on a stack, the program leaves <code>true</code> on top iff the signature is valid and the public key hashes to the expected value.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">hash160</span>(b):
    <span class="kw">return</span> hashlib.<span class="fn">new</span>(<span class="str">"ripemd160"</span>, hashlib.<span class="fn">sha256</span>(b).<span class="fn">digest</span>()).<span class="fn">digest</span>()

<span class="kw">def</span> <span class="fn">run_script</span>(script, sig_valid=<span class="kw">True</span>):
    stack = []
    <span class="kw">for</span> tok <span class="kw">in</span> script:
        <span class="kw">if</span> tok == <span class="str">"OP_DUP"</span>:
            stack.<span class="fn">append</span>(stack[-<span class="num">1</span>])
        <span class="kw">elif</span> tok == <span class="str">"OP_HASH160"</span>:
            stack.<span class="fn">append</span>(<span class="fn">hash160</span>(stack.<span class="fn">pop</span>()))
        <span class="kw">elif</span> tok == <span class="str">"OP_EQUALVERIFY"</span>:
            a, b = stack.<span class="fn">pop</span>(), stack.<span class="fn">pop</span>()
            <span class="kw">assert</span> a == b, <span class="str">"hash mismatch"</span>
        <span class="kw">elif</span> tok == <span class="str">"OP_CHECKSIG"</span>:
            stack.<span class="fn">pop</span>(); stack.<span class="fn">pop</span>()
            stack.<span class="fn">append</span>(sig_valid)
        <span class="kw">else</span>:
            stack.<span class="fn">append</span>(tok)
    <span class="kw">return</span> stack[-<span class="num">1</span>]

pubkey = <span class="fn">b</span><span class="str">"alice-pub"</span>
sig = <span class="fn">b</span><span class="str">"sig-of-tx"</span>
pk_hash = <span class="fn">hash160</span>(pubkey)
script = [sig, pubkey,
          <span class="str">"OP_DUP"</span>, <span class="str">"OP_HASH160"</span>, pk_hash, <span class="str">"OP_EQUALVERIFY"</span>, <span class="str">"OP_CHECKSIG"</span>]
<span class="fn">print</span>(<span class="str">"script result:"</span>, <span class="fn">run_script</span>(script))</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) The unlock pushes &lt;sig&gt;, &lt;pubkey&gt;. 2) <code>OP_DUP</code> duplicates the pubkey. 3) <code>OP_HASH160</code> hashes the duplicate. 4) <code>OP_EQUALVERIFY</code> checks the hash matches the locking pubKeyHash. 5) <code>OP_CHECKSIG</code> verifies the signature. The stack ends with <code>True</code>.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Proof-of-Work as Hashcash</h2>
<p class="l-text">Adam Back's hashcash (1997) was originally a spam filter: include with each email a header H such that SHA-1(H) starts with N zero bits. Nakamoto ported the idea to block headers. A miner repeatedly tweaks a 32-bit nonce and re-hashes the 80-byte header until <code>SHA256(SHA256(header)) ≤ target</code>. The target is encoded in 4 bytes ("bits") and adjusts every 2,016 blocks to keep the average block interval at ~10 minutes.</p>
<div class="katex-block">$$\\text{target} = \\frac{2^{256}}{\\text{difficulty}}, \\qquad \\Pr[\\text{valid block}] = \\frac{\\text{target}}{2^{256}}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">mine</span>(prev_hash, txs_root, bits=<span class="num">20</span>):
    <span class="cm"># Simplified: target = 2**(256-bits)</span>
    target = <span class="num">1</span> &lt;&lt; (<span class="num">256</span> - bits)
    nonce = <span class="num">0</span>
    <span class="kw">while</span> <span class="kw">True</span>:
        header = f<span class="str">"{prev_hash}|{txs_root}|{nonce}"</span>.<span class="fn">encode</span>()
        h = <span class="fn">int</span>.<span class="fn">from_bytes</span>(hashlib.<span class="fn">sha256</span>(hashlib.<span class="fn">sha256</span>(header).<span class="fn">digest</span>()).<span class="fn">digest</span>(), <span class="str">"big"</span>)
        <span class="kw">if</span> h &lt; target:
            <span class="kw">return</span> nonce, <span class="fn">hex</span>(h)[:<span class="num">14</span>]
        nonce += <span class="num">1</span>

n, h = <span class="fn">mine</span>(<span class="str">"prev"</span>*<span class="num">8</span>, <span class="str">"root"</span>*<span class="num">8</span>, bits=<span class="num">20</span>)
<span class="fn">print</span>(<span class="str">"found nonce"</span>, n, <span class="str">"hash"</span>, h)</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) The target is a 256-bit upper bound. 2) Try nonces sequentially. 3) The probability of success per try is <code>target / 2^256</code>. 4) Doubling difficulty halves the target and doubles expected work. With 20 leading zero bits, expected tries ≈ 2^20 ≈ 1 million.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Difficulty Adjustment</h2>
<p class="l-text">Bitcoin retargets every 2,016 blocks (~2 weeks). The new difficulty is scaled by the ratio of expected to actual time:</p>
<div class="katex-block">$$D_{\\text{new}} = D_{\\text{old}} \\cdot \\frac{T_{\\text{expected}}}{T_{\\text{actual}}}, \\quad T_{\\text{expected}} = 2016 \\cdot 600 \\text{ s}$$</div>
<div class="calc-highlight">A clamp of [0.25, 4.0] prevents pathological swings. Without retargeting, ASIC arms races would have blown block times to seconds (early 2010s) or hours (post-China-ban 2021).</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. SegWit, Schnorr and Taproot</h2>
<p class="l-text">Three quiet upgrades hardened Bitcoin without breaking compatibility.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SegWit (BIP-141, 2017)</div><div class="card-body">Moves witness data outside the txid; fixes malleability and increases effective block size to ~4 MWU.</div></div>
<div class="calc-card"><div class="card-title">Schnorr (BIP-340, 2021)</div><div class="card-body">Replaces ECDSA with Schnorr signatures: linear, batch-verifiable, MuSig2-aggregatable.</div></div>
<div class="calc-card"><div class="card-title">Taproot (BIP-341)</div><div class="card-body">Pay-to-Taproot lets a single key OR a Merkleized script tree spend the output. Multisig looks like single-sig on chain.</div></div>
<div class="calc-card"><div class="card-title">Tapscript (BIP-342)</div><div class="card-body">A tweaked script language tuned for the Taproot script path.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Lightning Network</h2>
<p class="l-text">Bitcoin's L1 settles ~7 transactions per second. Lightning (Poon &amp; Dryja, 2015) adds a layer-2 payment channel network. Two parties open a 2-of-2 multisig UTXO and exchange revocable off-chain commitment transactions. Routing through HTLC-secured hops makes any pair of nodes payable, with on-chain settlement only when channels open or close.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Channel</div><div class="card-body">Two-party 2-of-2 multisig funding tx. Off-chain updates change balance.</div></div>
<div class="calc-card"><div class="card-title">HTLC</div><div class="card-body">Hash time-locked contract: pay if you reveal preimage of H(s) before block N.</div></div>
<div class="calc-card"><div class="card-title">Routing</div><div class="card-body">Onion-style source routing across hops; intermediate nodes earn small fees.</div></div>
<div class="calc-card"><div class="card-title">Risks</div><div class="card-body">Channel jamming, force-close griefing, watchtower outsourcing for offline nodes.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Block Time Distribution</h2>
<p class="l-text">Mining is a Poisson process — block intervals follow an exponential distribution with mean 600 s. The plot shows the histogram of 10,000 simulated intervals.</p>
<div id="bc2-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Bitcoin state = UTXO set, not balances.<br><strong>2.</strong> Bitcoin Script is a stack VM; P2PKH is the canonical lock.<br><strong>3.</strong> PoW = hashcash with target = 2^256 / difficulty.<br><strong>4.</strong> Difficulty retargets every 2,016 blocks to hit ~10-min block time.<br><strong>5.</strong> SegWit fixed malleability; Taproot + Schnorr (BIP-340/341) made multisig private and cheap.<br><strong>6.</strong> Lightning is a 2-of-2 multisig channel network with HTLC routing for L2 payments.<br><strong>7.</strong> Block intervals are exponential — long gaps and bursts are normal, not a bug.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var n = 10000;
  var samples = [];
  for (var i=0;i<n;i++){ samples.push(-600*Math.log(1-Math.random())); }
  var data = [{x:samples,type:'histogram',nbinsx:60,marker:{color:T.accent}}];
  var layout = {title:'Bitcoin block intervals (simulated, mean = 600 s)',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Seconds between blocks',gridcolor:T.grid,range:[0,3000]},yaxis:{title:'Count',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  ['bc2-plot-en','bc2-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>Bitcoin bir veritabanı değildir — durumu, harcanmamış işlem çıktıları (UTXO'lar) kümesi olan bir durum makinesidir; bu durum, küçük yığın tabanlı bir betik dili tarafından ileri taşınır ve 2026 itibarıyla yılda yaklaşık 150 TWh elektrik tüketen, 14 yaşındaki bir iş kanıtı yarışıyla korunur.</strong> Şimdiye kadar duyduğunuz her işlem, 2010 Pizza Day'den (iki pizza için 10.000 BTC) milyar dolarlık soğuk cüzdan süpürmelerine kadar, UTXO'ları tüketen ve yenilerini üreten bir Bitcoin Script programıdır.</p>
<p class="l-text">Bu derste Bitcoin'in kaputunu açıyoruz. UTXO modelini simüle edecek, gerçek bir <code>P2PKH</code> kullanımı üzerinde bir Bitcoin Script yorumlayıcı çalıştıracak, zorluk hedefini ilk prensiplerden türetecek ve protokolü sessizce modernleştiren iki yükseltmeyle bitireceğiz: SegWit (BIP-141, 2017), Taproot/Schnorr (BIP-340/341/342, 2021) ve katman-2 ödeme kanalı ağı olarak Lightning Network.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Bir ödemeyi bakiye güncellemesi olarak değil, UTXO tüketimi ve oluşturulması olarak izleyin</li>
<li>Python'da yığın tabanlı bir sanal makinede bir Bitcoin Script (P2PKH) çalıştırın</li>
<li>target = 2^256 / difficulty formülünden zorluk hedefini türetin ve blok süresini ayarlayın</li>
<li>İş kanıtını ~10 dakikaya ayarlanmış bir hashcash (Back, 1997) varyantı olarak açıklayın</li>
<li>Bir Lightning kanalını 2-of-2 multisig + iptal edilebilir taahhüt olarak okuyun</li>
<li>Schnorr imzalarının ve Taproot'un (BIP-340/341) gizlilik ve ücretler hakkında ne değiştirdiğini söyleyin</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. UTXO: Bitcoin'in Hesabı Yoktur</h2>
<p class="l-text">Ethereum bakiyeleri saklar. Bitcoin saklamaz. Bitcoin dev bir <em>harcanmamış işlem çıktıları</em> kümesini takip eder: her biri belirli bir değere sahip, bir betikle kilitlenmiş ve tam olarak bir kez harcanabilen bir madeni paradır. Bob'a 5 BTC göndermek, toplamı ≥ 5 BTC olan UTXO'larınızdan birini veya birkaçını tüketmek, Bob için 5 BTC'lik yeni bir UTXO ve kendinize geri "para üstü" UTXO'su oluşturmak demektir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Girdi</div><div class="card-body">Önceki bir UTXO'ya referans + kilit açma betiği (imza + açık anahtar).</div></div>
<div class="calc-card"><div class="card-title">Çıktı</div><div class="card-body">Satoshi cinsinden miktar + kilitleme betiği (sıradaki kim harcayabilir).</div></div>
<div class="calc-card"><div class="card-title">Bakiye yok</div><div class="card-body">"Bakiyeniz", cüzdanınızın imzalayabileceği UTXO'ların toplamıdır. Yerel olarak hesaplanır.</div></div>
<div class="calc-card"><div class="card-title">Gizlilik</div><div class="card-body">Her UTXO yeni bir adrese gönderilebilir — doğal kimlik bağlantısı yoktur.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Python'da UTXO Kümesi</h2>
<p class="l-text">UTXO'ları içselleştirmenin temiz bir yolu birini simüle etmektir. Aşağıda küresel UTXO kümesi (txid, vout)'tan (miktar, sahip)'e bir sözlüktür. Bir işlem girdileri tüketir, çıktılar üretir ve toplamlar eşleşmezse reddedilir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

utxo = {(<span class="str">"genesis"</span>, <span class="num">0</span>): (<span class="num">50</span>, <span class="str">"alice"</span>)}

<span class="kw">def</span> <span class="fn">spend</span>(inputs, outputs):
    in_sum = <span class="fn">sum</span>(utxo[i][<span class="num">0</span>] <span class="kw">for</span> i <span class="kw">in</span> inputs)
    out_sum = <span class="fn">sum</span>(o[<span class="num">0</span>] <span class="kw">for</span> o <span class="kw">in</span> outputs)
    <span class="kw">assert</span> in_sum &gt;= out_sum, <span class="str">"insufficient funds"</span>
    fee = in_sum - out_sum
    txid = hashlib.<span class="fn">sha256</span>(<span class="fn">repr</span>((inputs, outputs)).<span class="fn">encode</span>()).<span class="fn">hexdigest</span>()[:<span class="num">10</span>]
    <span class="kw">for</span> i <span class="kw">in</span> inputs:
        <span class="kw">del</span> utxo[i]
    <span class="kw">for</span> j, (amt, owner) <span class="kw">in</span> <span class="fn">enumerate</span>(outputs):
        utxo[(txid, j)] = (amt, owner)
    <span class="kw">return</span> txid, fee

txid, fee = <span class="fn">spend</span>([(<span class="str">"genesis"</span>, <span class="num">0</span>)], [(<span class="num">30</span>, <span class="str">"bob"</span>), (<span class="num">19</span>, <span class="str">"alice"</span>)])
<span class="fn">print</span>(<span class="str">"tx"</span>, txid, <span class="str">"fee"</span>, fee, <span class="str">"miner takes 1 satoshi*1e8"</span>)
<span class="fn">print</span>(<span class="str">"utxo set:"</span>, utxo)</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Alice'e ait 50 BTC'lik genesis UTXO. 2) Alice harcar: 30 Bob'a, 19 para üstü olarak geri. 3) Eksik 1 BTC madenci ücretidir. 4) Eski UTXO kaldırılır; iki yeni UTXO eklenir. Hiçbir yerde bakiye yoktur — sadece bu küme vardır.</p>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Bitcoin Script: Bir Yığın Sanal Makinesi</h2>
<p class="l-text">Bir kilitleme betiği küçük, Forth benzeri bir programdır. En yaygın olanı, <code>P2PKH</code> (Pay-to-Public-Key-Hash) şöyle okunur: <code>OP_DUP OP_HASH160 &lt;pubKeyHash&gt; OP_EQUALVERIFY OP_CHECKSIG</code>. Kilit açma betiği &lt;sığ&gt; &lt;pubKey&gt; sağlar. Birleştirilip soldan sağa bir yığın üzerinde çalıştırıldığında, program, ancak ve ancak imza geçerliyse ve açık anahtar beklenen değere hash'leniyorsa üstte <code>true</code> bırakır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">hash160</span>(b):
    <span class="kw">return</span> hashlib.<span class="fn">new</span>(<span class="str">"ripemd160"</span>, hashlib.<span class="fn">sha256</span>(b).<span class="fn">digest</span>()).<span class="fn">digest</span>()

<span class="kw">def</span> <span class="fn">run_script</span>(script, sig_valid=<span class="kw">True</span>):
    stack = []
    <span class="kw">for</span> tok <span class="kw">in</span> script:
        <span class="kw">if</span> tok == <span class="str">"OP_DUP"</span>:
            stack.<span class="fn">append</span>(stack[-<span class="num">1</span>])
        <span class="kw">elif</span> tok == <span class="str">"OP_HASH160"</span>:
            stack.<span class="fn">append</span>(<span class="fn">hash160</span>(stack.<span class="fn">pop</span>()))
        <span class="kw">elif</span> tok == <span class="str">"OP_EQUALVERIFY"</span>:
            a, b = stack.<span class="fn">pop</span>(), stack.<span class="fn">pop</span>()
            <span class="kw">assert</span> a == b, <span class="str">"hash mismatch"</span>
        <span class="kw">elif</span> tok == <span class="str">"OP_CHECKSIG"</span>:
            stack.<span class="fn">pop</span>(); stack.<span class="fn">pop</span>()
            stack.<span class="fn">append</span>(sig_valid)
        <span class="kw">else</span>:
            stack.<span class="fn">append</span>(tok)
    <span class="kw">return</span> stack[-<span class="num">1</span>]

pubkey = <span class="fn">b</span><span class="str">"alice-pub"</span>
sig = <span class="fn">b</span><span class="str">"sig-of-tx"</span>
pk_hash = <span class="fn">hash160</span>(pubkey)
script = [sig, pubkey,
          <span class="str">"OP_DUP"</span>, <span class="str">"OP_HASH160"</span>, pk_hash, <span class="str">"OP_EQUALVERIFY"</span>, <span class="str">"OP_CHECKSIG"</span>]
<span class="fn">print</span>(<span class="str">"script result:"</span>, <span class="fn">run_script</span>(script))</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Kilit açma &lt;sığ&gt;, &lt;pubkey&gt; iter. 2) <code>OP_DUP</code> açık anahtarı çoğaltır. 3) <code>OP_HASH160</code> kopyayı hash'ler. 4) <code>OP_EQUALVERIFY</code> hash'in kilitleme pubKeyHash ile eşleştiğini doğrular. 5) <code>OP_CHECKSIG</code> imzayı doğrular. Yığın <code>True</code> ile biter.</p>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Hashcash Olarak İş Kanıtı</h2>
<p class="l-text">Adam Back'in hashcash'i (1997) başlangıçta bir spam filtresiydi: her e-postaya, SHA-1(H)'nin N sıfır bitle başlayacağı bir H başlığı ekleyin. Nakamoto bu fikri blok başlıklarına uyarladı. Bir madenci 32-bit'lik bir nonce'ı tekrar tekrar değiştirir ve <code>SHA256(SHA256(header)) ≤ target</code> olana kadar 80-baytlık başlığı yeniden hash'ler. Hedef 4 baytta ("bits") kodlanır ve ortalama blok aralığını ~10 dakikada tutmak için her 2.016 blokta bir ayarlanır.</p>
<div class="katex-block">$$\\text{target} = \\frac{2^{256}}{\\text{difficulty}}, \\qquad \\Pr[\\text{valid block}] = \\frac{\\text{target}}{2^{256}}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">mine</span>(prev_hash, txs_root, bits=<span class="num">20</span>):
    <span class="cm"># Basitleştirilmiş: target = 2**(256-bits)</span>
    target = <span class="num">1</span> &lt;&lt; (<span class="num">256</span> - bits)
    nonce = <span class="num">0</span>
    <span class="kw">while</span> <span class="kw">True</span>:
        header = f<span class="str">"{prev_hash}|{txs_root}|{nonce}"</span>.<span class="fn">encode</span>()
        h = <span class="fn">int</span>.<span class="fn">from_bytes</span>(hashlib.<span class="fn">sha256</span>(hashlib.<span class="fn">sha256</span>(header).<span class="fn">digest</span>()).<span class="fn">digest</span>(), <span class="str">"big"</span>)
        <span class="kw">if</span> h &lt; target:
            <span class="kw">return</span> nonce, <span class="fn">hex</span>(h)[:<span class="num">14</span>]
        nonce += <span class="num">1</span>

n, h = <span class="fn">mine</span>(<span class="str">"prev"</span>*<span class="num">8</span>, <span class="str">"root"</span>*<span class="num">8</span>, bits=<span class="num">20</span>)
<span class="fn">print</span>(<span class="str">"found nonce"</span>, n, <span class="str">"hash"</span>, h)</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Hedef 256-bit'lik bir üst sınırdır. 2) Nonce'ları sırayla deneyin. 3) Deneme başına başarı olasılığı <code>target / 2^256</code>. 4) Zorluğun iki katına çıkması hedefi yarıya indirir ve beklenen işi iki katına çıkarır. 20 öncü sıfır biti için beklenen deneme ≈ 2^20 ≈ 1 milyon.</p>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Zorluk Ayarlaması</h2>
<p class="l-text">Bitcoin her 2.016 blokta (~2 hafta) yeniden hedefler. Yeni zorluk, beklenen sürenin gerçek süreye oranıyla ölçeklenir:</p>
<div class="katex-block">$$D_{\\text{new}} = D_{\\text{old}} \\cdot \\frac{T_{\\text{expected}}}{T_{\\text{actual}}}, \\quad T_{\\text{expected}} = 2016 \\cdot 600 \\text{ s}$$</div>
<div class="calc-highlight">[0.25, 4.0] aralığındaki bir sınırlama (clamp), patolojik dalgalanmaları önler. Yeniden hedefleme olmasa, ASIC silahlanma yarışları blok sürelerini saniyelere (2010'ların başı) veya saatlere (Çin yasağı sonrası 2021) uçurmuş olurdu.</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. SegWit, Schnorr ve Taproot</h2>
<p class="l-text">Üç sessiz yükseltme Bitcoin'i uyumluluğu kırmadan sertleştirdi.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">SegWit (BIP-141, 2017)</div><div class="card-body">Tanık verisini txid dışına taşır; malleability'yi giderir ve etkin blok boyutunu ~4 MWU'ya çıkarır.</div></div>
<div class="calc-card"><div class="card-title">Schnorr (BIP-340, 2021)</div><div class="card-body">ECDSA'nın yerini Schnorr imzalarıyla alır: doğrusal, toplu doğrulanabilir, MuSig2 ile birleştirilebilir.</div></div>
<div class="calc-card"><div class="card-title">Taproot (BIP-341)</div><div class="card-body">Pay-to-Taproot, çıktıyı tek bir anahtarın VEYA Merkleized bir betik ağacının harcamasına izin verir. Multisig zincirde tek-sığ gibi görünür.</div></div>
<div class="calc-card"><div class="card-title">Tapscript (BIP-342)</div><div class="card-body">Taproot betik yolu için ayarlanmış değiştirilmiş bir betik dili.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Lightning Network</h2>
<p class="l-text">Bitcoin'in L1'i saniyede ~7 işlem yapar. Lightning (Poon &amp; Dryja, 2015) bir katman-2 ödeme kanalı ağı ekler. İki taraf 2-of-2 multisig UTXO açar ve iptal edilebilir, zincir dışı taahhüt işlemleri değiş tokuş eder. HTLC ile güvence altına alınmış sıçramalar üzerinden yönlendirme, herhangi bir düğüm çiftinin ödenebilir olmasını sağlar; zincir üzerinde takas yalnızca kanallar açıldığında veya kapatıldığında olur.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kanal</div><div class="card-body">İki taraflı 2-of-2 multisig fonlama tx'i. Zincir dışı güncellemeler bakiyeyi değiştirir.</div></div>
<div class="calc-card"><div class="card-title">HTLC</div><div class="card-body">Hash zaman kilitli sözleşme: blok N'den önce H(s)'nin ön-görüntüsünü açıklarsanız ödeyin.</div></div>
<div class="calc-card"><div class="card-title">Yönlendirme</div><div class="card-body">Sıçramalar arasında soğan stili kaynak yönlendirmesi; ara düğümler küçük ücretler kazanır.</div></div>
<div class="calc-card"><div class="card-title">Riskler</div><div class="card-body">Kanal sıkışması, force-close griefing, çevrimdışı düğümler için watchtower outsourcing.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Blok Süresi Dağılımı</h2>
<p class="l-text">Madencilik bir Poisson sürecidir — blok aralıkları ortalaması 600 sn olan üstel bir dağılım izler. Grafik, 10.000 simüle edilmiş aralığın histogramını gösterir.</p>
<div id="bc2-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Bitcoin durumu = UTXO kümesi, bakiyeler değil.<br><strong>2.</strong> Bitcoin Script bir yığın VM'idir; P2PKH kanonik kilittir.<br><strong>3.</strong> PoW = target = 2^256 / difficulty olan hashcash.<br><strong>4.</strong> Zorluk ~10 dk blok süresine ulaşmak için her 2.016 blokta yeniden hedefler.<br><strong>5.</strong> SegWit malleability'yi giderdi; Taproot + Schnorr (BIP-340/341) multisig'i gizli ve ucuz hale getirdi.<br><strong>6.</strong> Lightning, L2 ödemeler için HTLC yönlendirmeli 2-of-2 multisig kanal ağıdır.<br><strong>7.</strong> Blok aralıkları üsteldir — uzun boşluklar ve yığılmalar bug değil, normaldir.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var n = 10000;
  var samples = [];
  for (var i=0;i<n;i++){ samples.push(-600*Math.log(1-Math.random())); }
  var data = [{x:samples,type:'histogram',nbinsx:60,marker:{color:T.accent}}];
  var layout = {title:'Bitcoin blok aralıkları (simüle edilmiş, ortalama = 600 sn)',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{title:'Bloklar arası saniye',gridcolor:T.grid,range:[0,3000]},yaxis:{title:'Sayı',gridcolor:T.grid},margin:{t:50,r:30,b:50,l:60}};
  var el=document.getElementById('bc2-plot-tr'); if(el && window.Plotly) Plotly.newPlot('bc2-plot-tr',data,layout,{displayModeBar:false});
},250);
</script>`
};
