window.BLOCKCHAIN_L4 = {
en: `<p class="l-text"><strong>Smart contract security is a field forged in the fire of public, on-chain disasters.</strong> Every major class of smart-contract vulnerability has a multi-million-dollar incident attached to its name. <strong>The DAO</strong> (June 2016, ~$60M drained from Ethereum's first decentralized fund via reentrancy) led to the Ethereum/Ethereum Classic hard-fork split. <strong>BatchOverflow</strong> (April 2018, CVE-2018-10299) silently created billions of fake ERC-20 tokens by exploiting Solidity 0.4.x integer overflow. <strong>The Parity multi-sig wallet</strong> (July + November 2017, $300M frozen). <strong>bZx</strong> (Feb 2020, oracle manipulation via flash loan, $1M+). And every year since, billions of dollars have flowed through the same handful of bug categories.</p>

<p class="l-text">In this lesson we make those categories first-class citizens of your toolkit: <strong>reentrancy</strong> (and the checks-effects-interactions pattern), <strong>integer overflow</strong> (and Solidity 0.8's built-in revert), <strong>oracle manipulation</strong> (TWAPs, Chainlink, OEV), <strong>front-running and MEV</strong>, <strong>signature replay</strong> (and EIP-712 typed data), <strong>access control</strong>, <strong>delegatecall mishaps</strong>. We will run live Python simulations of reentrancy and integer overflow so the bugs become tactile, not abstract.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Reentrancy: classic vulnerable pattern, attacker contract, checks-effects-interactions fix, ReentrancyGuard</li>
<li>Integer overflow / underflow: pre-0.8 vs ≥0.8 Solidity, BatchOverflow CVE-2018-10299 dissection</li>
<li>Oracle manipulation: spot-price vs TWAP, single oracle vs Chainlink aggregation</li>
<li>Front-running and MEV: mempool, sandwich attacks, Flashbots/MEV-Boost mitigation</li>
<li>Signature replay: missing nonce / chainid, EIP-712 typed-data salt</li>
<li>Access control: <code>tx.origin</code> vs <code>msg.sender</code>, delegatecall pitfalls (Parity)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The DAO and the Birth of Reentrancy Awareness</h2>
<p class="l-text">June 17, 2016. The DAO — Ethereum's first crowdfunded VC fund — held ~15% of all ETH (~$150M at the time). An attacker called <code>splitDAO</code> in a way that recursively re-entered <code>withdraw</code> before the contract decremented their balance, draining ~3.6M ETH. The community split: a hard fork (Ethereum) reversed the theft; the dissenters (Ethereum Classic) preserved the immutable record. The bug pattern: <strong>external call before state update</strong>.</p>

<div class="calc-highlight"><strong>Vulnerable pattern</strong>: <code>require(balance[msg.sender] &gt;= amount); msg.sender.call{value: amount}(""); balance[msg.sender] -= amount;</code>. The attacker's fallback re-enters <code>withdraw</code> before line 3 executes — balance still says they're rich.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Reentrancy in Python — A Faithful Simulation</h2>
<p class="l-text">Below is a Python recreation of the exact pattern. The <code>VulnerableBank</code> calls <code>attacker.fallback()</code> as the "external call", and the attacker re-enters <code>withdraw</code> mid-flight.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class VulnerableBank:
    def __init__(self):
        self.balances = {}
        self.pool = 0
    def deposit(self, who, amount):
        self.balances[who] = self.balances.get(who, 0) + amount
        self.pool += amount
    def withdraw(self, who):
        bal = self.balances.get(who, 0)
        if bal &lt;= 0: return
        # BUG: external call BEFORE state update
        if hasattr(who, "fallback"):
            who.fallback(self, bal)        # &lt;-- attacker re-enters here
        self.balances[who] = 0
        self.pool -= bal
        print(f"  bank.pool now = {self.pool}")

class Attacker:
    def __init__(self): self.stolen = 0; self.depth = 0
    def attack(self, bank):
        bank.deposit(self, 10)
        bank.withdraw(self)
    def fallback(self, bank, amount):
        self.depth += 1
        self.stolen += amount
        print(f"  Attacker re-enters depth={self.depth}, stole {amount} so far={self.stolen}")
        if self.depth &lt; 3 and bank.pool &gt;= amount:
            bank.withdraw(self)            # recursive re-entry

bank = VulnerableBank()
bank.deposit("alice", 50); bank.deposit("bob", 40)
print("Pool before attack:", bank.pool)
adv = Attacker()
adv.attack(bank)
print(f"\\nFINAL: pool={bank.pool}, attacker stole {adv.stolen}")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>VulnerableBank</code> models the DAO-era flaw: <code>withdraw</code> hands control to <code>who.fallback(...)</code> while the depositor's balance still reads its full pre-withdrawal value. 2) <code>Attacker.attack</code> seeds a small 10-unit deposit, then calls <code>withdraw</code> — that triggers the callback, which re-enters <code>withdraw</code> recursively up to depth 3 before any state is zeroed. 3) Each recursion drains <code>bal</code> from the pool because <code>self.pool -= bal</code> never runs until the recursion unwinds. 4) The final print shows the pool emptied far below what the attacker actually deposited — the canonical reentrancy money pump.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Identical reentrancy demo. Watch the attacker steal beyond their deposit before <code>balances</code> updates.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class Bank:
    def __init__(self): self.bal={}; self.pool=0
    def dep(self, w, a): self.bal[w]=self.bal.get(w,0)+a; self.pool+=a
    def wdr(self, w):
        b=self.bal.get(w,0)
        if b&lt;=0 or self.pool&lt;b: return
        if hasattr(w,"cb"): w.cb(self, b)   # external call FIRST (the bug)
        self.bal[w]=0; self.pool -= b
class Atk:
    def __init__(self): self.st=0; self.d=0
    def go(self, bank): bank.dep(self,10); bank.wdr(self)
    def cb(self, bank, amt):
        self.d+=1; self.st+=amt
        print(f"  re-enter depth={self.d} amt={amt} stolen={self.st} pool_left={bank.pool}")
        if self.d&lt;3 and bank.pool&gt;=amt: bank.wdr(self)

b=Bank(); b.dep("alice",50); b.dep("bob",40)
print(f"pool start = {b.pool}")
a=Atk(); a.go(b)
print(f"pool end = {b.pool}, attacker took {a.st} on a 10 deposit")
</code></pre></div>
</div>

<div class="calc-highlight"><strong>The fix</strong>: <em>checks → effects → interactions</em>. Update state before the external call. Or use OpenZeppelin's <code>ReentrancyGuard</code> mutex. Solidity 0.8.x + transient storage (EIP-1153, 2024) makes this nearly free.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Integer Overflow — BatchOverflow CVE-2018-10299</h2>
<p class="l-text">In Solidity 0.4.x, <code>uint256</code> wrapped silently. The <strong>BatchOverflow</strong> attack on the BeautyChain (BEC) ERC-20 in April 2018 used:</p>

<pre class="code-block"><code>function batchTransfer(address[] _receivers, uint256 _value) public {
    uint cnt = _receivers.length;
    uint256 amount = uint256(cnt) * _value;            // OVERFLOWS
    require(cnt &gt; 0 &amp;&amp; cnt &lt;= 20);
    require(_value &gt; 0 &amp;&amp; balances[msg.sender] &gt;= amount);  // amount=0 passes!
    balances[msg.sender] -= amount;
    for (uint i = 0; i &lt; cnt; i++) balances[_receivers[i]] += _value;
}</code></pre>

<p class="l-text">Pick <code>cnt = 2</code> and <code>_value = 2^255</code>. Then <code>cnt * _value = 2^256</code>, which wraps to <strong>0</strong>. The require passes (you "own" 0 tokens to spend), and the loop credits <code>2^255</code> tokens to each of two attacker addresses. <strong>BEC token price collapsed to zero.</strong> Solidity 0.8.0 (Dec 2020) made overflow revert by default; OpenZeppelin's <code>SafeMath</code> filled the gap before that.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# Simulate uint8 wrap (same idea as uint256, just smaller)
a = np.uint8(200); b = np.uint8(100)
prod = np.uint8(a * b)
print(f"uint8: {a} * {b} = {prod}  (real product 20000, mod 256 = {20000 % 256})")

# The BEC scenario in miniature with uint8
cnt    = np.uint8(2)
value  = np.uint8(128)            # 2^7
amount = np.uint8(cnt * value)    # = 256 mod 256 = 0
print(f"BEC-style: cnt={cnt}, value={value}, amount overflowed to {amount}")
print("require(amount &lt;= sender_balance)  passes because amount==0")
print("loop credits each receiver with 128 tokens — minted from thin air")
</code></pre></div>
<p class="l-text"><strong>What this code does, step by step:</strong> 1) NumPy's <code>uint8</code> mimics Solidity's fixed-width arithmetic: any product above 255 wraps modulo 256, so <code>200 * 100 = 20000</code> stores as <code>20000 mod 256 = 32</code>. 2) The miniature BEC scenario picks <code>cnt = 2</code>, <code>value = 128</code> — together <code>2 * 128 = 256</code> which wraps to <code>0</code>, exactly the trick BatchOverflow used with <code>2^255</code> at uint256 scale. 3) The contract's <code>require(amount &lt;= sender_balance)</code> passes because <code>amount</code> is now zero, so even a sender with no tokens clears the check. 4) The loop then credits the original <code>value</code> to each receiver, minting tokens out of thin air — the wrap silently broke the integrity check.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same overflow demo with NumPy uint8. Confirm the multiplication wraps to 0 and the contract logic is fooled.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
for cnt, val in [(2, 128), (4, 64), (16, 16), (3, 100)]:
    a, b = np.uint8(cnt), np.uint8(val)
    prod = np.uint8(a*b)
    real = cnt*val
    print(f"cnt={cnt:3d} val={val:3d} -&gt; uint8 product={prod:3d}  (real={real}, wraps={'YES' if real&gt;=256 else 'no'})")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Oracle Manipulation — bZx and the Single-Source Problem</h2>
<p class="l-text">DeFi protocols read prices from on-chain sources (DEX pools, AMM TWAPs, oracle services). If your "price" is the spot price of a thin liquidity pool, anyone with a flash loan can move it. <strong>bZx</strong> (Feb 2020) lost ~$1M in two attacks where the attacker borrowed flash-loaned ETH, traded against bZx's KyberNetwork price oracle to skew it, then borrowed against the inflated collateral.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spot price (bad)</div><div class="card-body">Read x/y from a Uniswap v2 pool. Manipulable in one block.</div></div>
<div class="calc-card"><div class="card-title">TWAP (better)</div><div class="card-body">Time-weighted average over &gt; 30 minutes. Costs the attacker the manipulation across many blocks; 30-min manipulation is expensive.</div></div>
<div class="calc-card"><div class="card-title">Chainlink (best for non-AMM)</div><div class="card-body">Decentralized oracle network with multiple data providers and aggregation. Used as price source by Aave, MakerDAO, Compound.</div></div>
<div class="calc-card"><div class="card-title">OEV / Pyth pull oracle</div><div class="card-body">Newer model (Pyth, RedStone): price update batched on demand. Latency-vs-cost trade-off.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Front-Running and MEV</h2>
<p class="l-text"><strong>MEV</strong> = Maximal Extractable Value: the maximum profit a block proposer can extract by including, excluding, or reordering transactions. The mempool is public, so a "searcher" can see your DEX swap pending and sandwich it: buy in front of you (driving price up), let your trade fill at the worse price, sell behind you. The MEV economy on Ethereum extracted &gt; $1B / year at peak.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sandwich</div><div class="card-body">Searcher's tx_buy, your tx_swap, searcher's tx_sell — all in the same block.</div></div>
<div class="calc-card"><div class="card-title">Liquidations</div><div class="card-body">Compound/Aave liquidations are openly profitable; bots race to be first.</div></div>
<div class="calc-card"><div class="card-title">Arbitrage</div><div class="card-body">DEX-DEX price discrepancies. Healthier MEV — narrows spreads.</div></div>
<div class="calc-card"><div class="card-title">Mitigation</div><div class="card-body">Flashbots private mempool, MEV-Boost (post-Merge), CowSwap batch auctions, slippage caps.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Signature Replay — The Missing Nonce</h2>
<p class="l-text">If your contract accepts an off-chain signature to permit a transfer (a meta-transaction), you must include a <strong>nonce</strong> and a <strong>chain-id</strong> in the signed payload. Otherwise the same signature can be replayed across chains (Ethereum mainnet → BSC → Polygon) or by anyone who saw it on-chain. <strong>EIP-712</strong> (typed structured data, 2017) makes this clean by domain-separating signatures with name, version, chainId, verifyingContract.</p>

<div class="calc-highlight">Famous replays: the original Ethereum/Ethereum Classic split (2016) had no chainId in v signatures; transactions could be replayed cross-chain. EIP-155 (2016) fixed this by mixing chainId into the signature.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Access Control Sins</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">tx.origin vs msg.sender</div><div class="card-body">Using <code>tx.origin == owner</code> for auth lets a malicious contract call your function on the owner's behalf via phishing. Always use <code>msg.sender</code>.</div></div>
<div class="calc-card"><div class="card-title">delegatecall on untrusted</div><div class="card-body">Parity Multi-sig 2017 (#1 and #2): a library was self-destructed after being called via delegatecall by an outside attacker — bricking $300M of wallets that depended on it.</div></div>
<div class="calc-card"><div class="card-title">Missing onlyOwner</div><div class="card-body">Critical fns (mint, upgrade, withdraw) without modifier. The Wormhole 2022 ($325M) exploited a related signature-verification skip.</div></div>
<div class="calc-card"><div class="card-title">Centralized upgrades</div><div class="card-body">Proxy patterns (UUPS, transparent) require careful storage layout; one wrong slot bricks the contract or opens authorization.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Defensive Programming Cheat Sheet</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>Use Solidity ≥ 0.8 (built-in overflow checks).</li>
<li>Always Checks-Effects-Interactions; ReentrancyGuard for high-risk fns.</li>
<li>Multi-source oracles (Chainlink), TWAPs for AMM-derived prices.</li>
<li>EIP-712 + nonce + chainId for any off-chain signature.</li>
<li>Use <code>msg.sender</code>, not <code>tx.origin</code>, for auth.</li>
<li>Pull over push for ETH transfers.</li>
<li>External audits (Trail of Bits, OpenZeppelin, ConsenSys Diligence) + Slither/Mythril/Echidna in CI.</li>
<li>Bug bounty (Immunefi) before mainnet deploy.</li>
</ol>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. Gas cost — vulnerable vs guarded withdraw (visual)</h2>
<p class="l-text">A simple <code>withdraw()</code> on Ethereum mainnet costs different gas depending on the defensive pattern. Naive call-then-update is cheapest but unsafe; checks-effects-interactions adds one SSTORE; ReentrancyGuard adds a second SSTORE + SLOAD. Pull-payment pattern is most expensive but safest against re-entrancy chains.</p>
<div id="plot-blockchain-l4-gas-en" class="plotly-graph" style="width:100%;height:380px;"></div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var text = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc';
  var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e';
  var grid = 'rgba(255,255,255,0.06)';
  var patterns = ['Naive (vulnerable)','Checks-Effects-Interactions','ReentrancyGuard (OZ)','Pull-payment','Transient-storage guard (EIP-1153)'];
  var gas      = [21300, 26400, 31700, 38500, 24900];
  var safe     = [false, true,  true,  true,  true];
  var data = [{ x: patterns, y: gas, type:'bar',
    marker:{color: safe.map(function(s,i){return s ? (i===4?accent:'#4de87a') : '#ff6b6b';})},
    text: gas.map(function(g,i){ return g.toLocaleString()+' gas'+(safe[i]?'':' ⚠'); }), textposition:'outside' }];
  var layout = { paper_bgcolor:'rgba(0,0,0,0)', plot_bgcolor:'rgba(0,0,0,0)', font:{color:text},
    xaxis:{title:'withdraw() pattern', gridcolor:grid, tickangle:-15},
    yaxis:{title:'gas used per call', gridcolor:grid, range:[0, 44000]},
    margin:{t:60,r:20,b:120,l:80}, title:{text:'Gas cost of reentrancy defences (Solidity 0.8.x)', font:{color:text, size:14}}, height:380 };
  Plotly.newPlot('plot-blockchain-l4-gas-en', data, layout, {responsive:true, displayModeBar:false});
  var trDiv = document.getElementById('plot-blockchain-l4-gas-tr');
  if (trDiv) Plotly.newPlot('plot-blockchain-l4-gas-tr', data, layout, {responsive:true, displayModeBar:false});
}, 250);</script>
<div class="calc-graph"><div class="graph-caption"><strong>What this graph shows:</strong> The cost of safety is real but small — ~5-10k gas per withdraw (cents per call at 20 gwei). EIP-1153 transient storage closes most of the gap. Engineers who skip the guard "to save gas" are saving a coffee and risking the treasury.</div></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The DAO showed reentrancy: external call before state update is the canonical bug.</li>
<li>BatchOverflow = silent uint wrap on 0.4.x. Solidity 0.8 + SafeMath is the answer.</li>
<li>Spot oracles are a gift to flash-loan attackers; use TWAPs and Chainlink.</li>
<li>MEV is real and big — Flashbots/MEV-Boost/private mempools mitigate.</li>
<li>EIP-712 + chainId + nonce keep signatures un-replayable.</li>
<li><code>tx.origin</code> ≠ auth; <code>delegatecall</code> on untrusted code = brick risk.</li>
</ul>
</div>
<p class="l-text">Next, <strong>blockchain-L5</strong>: consensus mechanisms — PoW, PoS, BFT, Casper, finality, fork choice.</p>
</div>`,
tr: `<p class="l-text"><strong>Akıllı sözleşme güvenliği, halka açık, zincir üzerindeki felaketlerin ateşinde dövülmüş bir alandır.</strong> Her büyük akıllı sözleşme açığı sınıfının adına bağlı milyonlarca dolarlık bir olay vardır. <strong>The DAO</strong> (Haziran 2016, Ethereum'un ilk merkeziyetsiz fonundan yeniden giriş (reentrancy) ile ~60 milyon dolar boşaltıldı) Ethereum/Ethereum Classic hard-fork ayrılığına yol açtı. <strong>BatchOverflow</strong> (Nisan 2018, CVE-2018-10299), Solidity 0.4.x integer overflow'unu sömürerek milyarlarca sahte ERC-20 tokenı sessizce yarattı. <strong>Parity multi-imza cüzdan</strong> (Temmuz + Kasım 2017, 300 milyon dolar donduruldu). <strong>bZx</strong> (Şub 2020, flash loan ile oracle manipülasyonu, 1 milyon dolardan fazla). Ve o zamandan beri her yıl, milyarlarca dolar aynı bir avuç hata kategorisinden akıp gitti.</p>

<p class="l-text">Bu derste bu kategorileri araç setinizin birinci sınıf üyeleri yapıyoruz: <strong>yeniden giriş (reentrancy)</strong> (ve checks-effects-interactions deseni), <strong>integer overflow</strong> (ve Solidity 0.8'in yerleşik revert'i), <strong>oracle manipülasyonu</strong> (TWAP'ler, Chainlink, OEV), <strong>front-running ve MEV</strong>, <strong>imza yeniden oynatma (replay)</strong> (ve EIP-712 tipli veri), <strong>erişim kontrolü</strong>, <strong>delegatecall hataları</strong>. Hataları soyut değil somut hale getirmek için yeniden giriş ve integer overflow'un canlı Python simülasyonlarını çalıştıracağız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yeniden giriş (reentrancy): klasik açık desen, saldırgan sözleşme, checks-effects-interactions düzeltmesi, ReentrancyGuard</li>
<li>Integer overflow / underflow: 0.8 öncesi vs ≥0.8 Solidity, BatchOverflow CVE-2018-10299 incelemesi</li>
<li>Oracle manipülasyonu: spot fiyat vs TWAP, tek oracle vs Chainlink toplama</li>
<li>Front-running ve MEV: mempool, sandwich saldırıları, Flashbots/MEV-Boost azaltımı</li>
<li>İmza yeniden oynatma: eksik nonce / chainid, EIP-712 tipli veri salt</li>
<li>Erişim kontrolü: <code>tx.origin</code> vs <code>msg.sender</code>, delegatecall tuzakları (Parity)</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. The DAO ve Yeniden Giriş Farkındalığının Doğuşu</h2>
<p class="l-text">17 Haziran 2016. The DAO — Ethereum'un ilk kitle fonlamalı VC fonu — tüm ETH'in ~%15'ini (o zaman ~150 milyon dolar) tutuyordu. Bir saldırgan, sözleşme bakiyelerini azaltmadan önce <code>withdraw</code>'a özyinelemeli olarak yeniden girecek şekilde <code>splitDAO</code>'yu çağırdı ve ~3.6M ETH'i boşalttı. Topluluk bölündü: bir hard fork (Ethereum) hırsızlığı tersine çevirdi; muhalifler (Ethereum Classic) değiştirilemez kaydı korudu. Hata deseni: <strong>durum güncellemesinden önce dış çağrı</strong>.</p>

<div class="calc-highlight"><strong>Açık desen</strong>: <code>require(balance[msg.sender] &gt;= amount); msg.sender.call{value: amount}(""); balance[msg.sender] -= amount;</code>. Saldırganın fallback'i, 3. satır çalışmadan önce <code>withdraw</code>'a yeniden girer — bakiye hâlâ zengin olduklarını söyler.</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Python'da Yeniden Giriş — Sadık Bir Simülasyon</h2>
<p class="l-text">Aşağıda tam desenin Python'daki yeniden yapımı. <code>VulnerableBank</code> "dış çağrı" olarak <code>attacker.fallback()</code>'i çağırır ve saldırgan uçuş ortasında <code>withdraw</code>'a yeniden girer.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class VulnerableBank:
    def __init__(self):
        self.balances = {}
        self.pool = 0
    def deposit(self, who, amount):
        self.balances[who] = self.balances.get(who, 0) + amount
        self.pool += amount
    def withdraw(self, who):
        bal = self.balances.get(who, 0)
        if bal &lt;= 0: return
        # HATA: durum güncellemesinden ÖNCE dış çağrı
        if hasattr(who, "fallback"):
            who.fallback(self, bal)        # &lt;-- saldırgan burada yeniden girer
        self.balances[who] = 0
        self.pool -= bal
        print(f"  bank.pool now = {self.pool}")

class Attacker:
    def __init__(self): self.stolen = 0; self.depth = 0
    def attack(self, bank):
        bank.deposit(self, 10)
        bank.withdraw(self)
    def fallback(self, bank, amount):
        self.depth += 1
        self.stolen += amount
        print(f"  Attacker re-enters depth={self.depth}, stole {amount} so far={self.stolen}")
        if self.depth &lt; 3 and bank.pool &gt;= amount:
            bank.withdraw(self)            # özyinelemeli yeniden giriş

bank = VulnerableBank()
bank.deposit("alice", 50); bank.deposit("bob", 40)
print("Pool before attack:", bank.pool)
adv = Attacker()
adv.attack(bank)
print(f"\\nFINAL: pool={bank.pool}, attacker stole {adv.stolen}")
</code></pre></div>
<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) <code>VulnerableBank</code> The DAO çağındaki kusuru modelliyor: <code>withdraw</code>, mevduat sahibinin bakiyesi hâlâ tam değerini gösterirken kontrolü <code>who.fallback(...)</code>'a teslim ediyor. 2) <code>Attacker.attack</code> önce küçük 10 birimlik bir mevduat yatırıyor, sonra <code>withdraw</code> çağırıyor — bu, geri çağrıyı tetikliyor ve geri çağrı, henüz hiçbir durum sıfırlanmadan <code>withdraw</code>'a 3 derinliğe kadar yeniden giriyor. 3) Her özyineleme havuzdan <code>bal</code> kadar çekiyor, çünkü <code>self.pool -= bal</code> özyineleme geri sarılana kadar hiç çalışmıyor. 4) Son çıktı, saldırganın gerçekte yatırdığının çok altına düşen havuzu gösteriyor — kanonik yeniden giriş para pompası.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı yeniden giriş demosu. Saldırganın <code>balances</code> güncellenmeden önce yatırdığının ötesinde nasıl çaldığını izleyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class Bank:
    def __init__(self): self.bal={}; self.pool=0
    def dep(self, w, a): self.bal[w]=self.bal.get(w,0)+a; self.pool+=a
    def wdr(self, w):
        b=self.bal.get(w,0)
        if b&lt;=0 or self.pool&lt;b: return
        if hasattr(w,"cb"): w.cb(self, b)   # ÖNCE dış çağrı (hata)
        self.bal[w]=0; self.pool -= b
class Atk:
    def __init__(self): self.st=0; self.d=0
    def go(self, bank): bank.dep(self,10); bank.wdr(self)
    def cb(self, bank, amt):
        self.d+=1; self.st+=amt
        print(f"  re-enter depth={self.d} amt={amt} stolen={self.st} pool_left={bank.pool}")
        if self.d&lt;3 and bank.pool&gt;=amt: bank.wdr(self)

b=Bank(); b.dep("alice",50); b.dep("bob",40)
print(f"pool start = {b.pool}")
a=Atk(); a.go(b)
print(f"pool end = {b.pool}, attacker took {a.st} on a 10 deposit")
</code></pre></div>
</div>

<div class="calc-highlight"><strong>Düzeltme</strong>: <em>checks → effects → interactions</em>. Dış çağrıdan önce durumu güncelleyin. Veya OpenZeppelin'in <code>ReentrancyGuard</code> mutex'ini kullanın. Solidity 0.8.x + transient storage (EIP-1153, 2024) bunu neredeyse bedava kılar.</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Integer Overflow — BatchOverflow CVE-2018-10299</h2>
<p class="l-text">Solidity 0.4.x'te <code>uint256</code> sessizce sarılırdı. Nisan 2018'deki BeautyChain (BEC) ERC-20'sine yapılan <strong>BatchOverflow</strong> saldırısı şunu kullandı:</p>

<pre class="code-block"><code>function batchTransfer(address[] _receivers, uint256 _value) public {
    uint cnt = _receivers.length;
    uint256 amount = uint256(cnt) * _value;            // OVERFLOW
    require(cnt &gt; 0 &amp;&amp; cnt &lt;= 20);
    require(_value &gt; 0 &amp;&amp; balances[msg.sender] &gt;= amount);  // amount=0 geçer!
    balances[msg.sender] -= amount;
    for (uint i = 0; i &lt; cnt; i++) balances[_receivers[i]] += _value;
}</code></pre>

<p class="l-text"><code>cnt = 2</code> ve <code>_value = 2^255</code> seçin. O zaman <code>cnt * _value = 2^256</code>, <strong>0</strong>'a sarılır. require geçer (harcayacak 0 token'a "sahipsiniz") ve döngü iki saldırgan adresinin her birine <code>2^255</code> token yazar. <strong>BEC token fiyatı sıfıra çöktü.</strong> Solidity 0.8.0 (Aralık 2020) overflow'u varsayılan olarak revert eder hale getirdi; ondan önce OpenZeppelin'in <code>SafeMath</code>'i bu boşluğu doldurdu.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

# uint8 sarmasını simüle et (uint256 ile aynı fikir, sadece daha küçük)
a = np.uint8(200); b = np.uint8(100)
prod = np.uint8(a * b)
print(f"uint8: {a} * {b} = {prod}  (gerçek çarpım 20000, mod 256 = {20000 % 256})")

# uint8 ile minyatür BEC senaryosu
cnt    = np.uint8(2)
value  = np.uint8(128)            # 2^7
amount = np.uint8(cnt * value)    # = 256 mod 256 = 0
print(f"BEC tarzı: cnt={cnt}, value={value}, amount overflowed to {amount}")
print("require(amount &lt;= sender_balance)  amount==0 olduğu için geçer")
print("döngü her alıcıya 128 token yazar — yoktan basılır")
</code></pre></div>
<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) NumPy'ın <code>uint8</code>'i Solidity'nin sabit-genişlikli aritmetiğini taklit ediyor: 255'in üstündeki herhangi bir çarpım 256'ya göre sarılıyor, dolayısıyla <code>200 * 100 = 20000</code> aslında <code>20000 mod 256 = 32</code> olarak saklanıyor. 2) Minyatür BEC senaryosu <code>cnt = 2</code>, <code>value = 128</code> seçiyor — birlikte <code>2 * 128 = 256</code> ve bu <code>0</code>'a sarılıyor; tam olarak BatchOverflow'un uint256 ölçeğinde <code>2^255</code> ile yaptığı numara. 3) Sözleşmenin <code>require(amount &lt;= sender_balance)</code> kontrolü geçiyor, çünkü <code>amount</code> artık sıfır — tokenı olmayan bir gönderici bile kontrolü atlatıyor. 4) Döngü ardından her alıcıya orijinal <code>value</code>'yi yazıyor ve yoktan token basıyor — sarma, bütünlük kontrolünü sessizce çürüttü.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">NumPy uint8 ile aynı overflow demosu. Çarpmanın 0'a sarıldığını ve sözleşme mantığının kandırıldığını doğrulayın.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np
for cnt, val in [(2, 128), (4, 64), (16, 16), (3, 100)]:
    a, b = np.uint8(cnt), np.uint8(val)
    prod = np.uint8(a*b)
    real = cnt*val
    print(f"cnt={cnt:3d} val={val:3d} -&gt; uint8 product={prod:3d}  (real={real}, wraps={'EVET' if real&gt;=256 else 'hayır'})")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Oracle Manipülasyonu — bZx ve Tek-Kaynak Problemi</h2>
<p class="l-text">DeFi protokolleri fiyatları zincir üzerindeki kaynaklardan (DEX havuzları, AMM TWAP'leri, oracle servisleri) okur. "Fiyatınız" ince likiditeli bir havuzun spot fiyatıysa, flash loan'u olan herkes onu hareket ettirebilir. <strong>bZx</strong> (Şub 2020), saldırganın flash-loan'la aldığı ETH'i ödünç alıp bZx'in KyberNetwork fiyat oracle'ına karşı işlem yaparak çarpıttığı, sonra şişirilmiş teminata karşı ödünç aldığı iki saldırıda ~1 milyon dolar kaybetti.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spot fiyat (kötü)</div><div class="card-body">Bir Uniswap v2 havuzundan x/y oku. Tek blokta manipüle edilebilir.</div></div>
<div class="calc-card"><div class="card-title">TWAP (daha iyi)</div><div class="card-body">&gt; 30 dakika boyunca zaman ağırlıklı ortalama. Saldırgana birçok blok boyunca manipülasyona mal olur; 30 dakika manipülasyonu pahalıdır.</div></div>
<div class="calc-card"><div class="card-title">Chainlink (AMM olmayanlar için en iyi)</div><div class="card-body">Birden fazla veri sağlayıcı ve toplama ile merkeziyetsiz oracle ağı. Aave, MakerDAO, Compound tarafından fiyat kaynağı olarak kullanılır.</div></div>
<div class="calc-card"><div class="card-title">OEV / Pyth pull oracle</div><div class="card-body">Daha yeni model (Pyth, RedStone): fiyat güncellemesi talep üzerine toplu yapılır. Gecikme-maliyet ödünleşimi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Front-Running ve MEV</h2>
<p class="l-text"><strong>MEV</strong> = Maksimum Çıkarılabilir Değer: bir blok teklif edicisinin işlemleri dahil ederek, hariç tutarak veya yeniden sıralayarak çıkarabileceği maksimum kâr. Mempool halka açık olduğundan, bir "araştırmacı" sizin DEX takasınızın beklediğini görüp size sandviç çekebilir: önünüze geçip alır (fiyatı yukarı iter), işleminizin daha kötü fiyatta dolmasını bekler, arkanızda satar. Ethereum'daki MEV ekonomisi zirvede yılda &gt; 1 milyar dolar çıkardı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sandviç</div><div class="card-body">Araştırmacının tx_buy, sizin tx_swap, araştırmacının tx_sell — hepsi aynı blokta.</div></div>
<div class="calc-card"><div class="card-title">Likidasyonlar</div><div class="card-body">Compound/Aave likidasyonları açıkça kârlıdır; bot'lar ilk olmak için yarışır.</div></div>
<div class="calc-card"><div class="card-title">Arbitraj</div><div class="card-body">DEX-DEX fiyat tutarsızlıkları. Daha sağlıklı MEV — spread'leri daraltır.</div></div>
<div class="calc-card"><div class="card-title">Azaltım</div><div class="card-body">Flashbots özel mempool, MEV-Boost (Merge sonrası), CowSwap toplu açık artırma, kayma sınırları.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. İmza Yeniden Oynatma — Eksik Nonce</h2>
<p class="l-text">Sözleşmeniz bir transferi yetkilendirmek için zincir dışı imza kabul ediyorsa (meta işlem), imzalı yüke <strong>nonce</strong> ve <strong>chain-id</strong> dahil etmelisiniz. Aksi takdirde aynı imza zincirler arası (Ethereum mainnet → BSC → Polygon) veya zincirde gören herkes tarafından yeniden oynatılabilir. <strong>EIP-712</strong> (tipli yapısal veri, 2017), name, version, chainId, verifyingContract ile imzaları alan-ayrımlı (domain-separating) yaparak bunu temizler.</p>

<div class="calc-highlight">Ünlü yeniden oynatmalar: orijinal Ethereum/Ethereum Classic ayrılığı (2016) v imzalarında chainId yoktu; işlemler zincirler arası yeniden oynatılabilirdi. EIP-155 (2016) chainId'yi imzaya karıştırarak bunu düzeltti.</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Erişim Kontrolü Günahları</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">tx.origin vs msg.sender</div><div class="card-body">Yetkilendirme için <code>tx.origin == owner</code> kullanmak, kötü niyetli bir sözleşmenin phishing yoluyla sahip adına fonksiyonunuzu çağırmasına izin verir. Daima <code>msg.sender</code> kullanın.</div></div>
<div class="calc-card"><div class="card-title">Güvenilmez üzerinde delegatecall</div><div class="card-body">Parity Multi-imza 2017 (#1 ve #2): bir kütüphane, dış bir saldırgan tarafından delegatecall ile çağrıldıktan sonra self-destruct edildi — ona bağımlı 300 milyon dolarlık cüzdanı tuğlaya çevirdi.</div></div>
<div class="calc-card"><div class="card-title">Eksik onlyOwner</div><div class="card-body">Modifiyer'siz kritik fonksiyonlar (mint, upgrade, withdraw). Wormhole 2022 (325 milyon dolar) ilgili bir imza-doğrulama atlamasını sömürdü.</div></div>
<div class="calc-card"><div class="card-title">Merkezi yükseltmeler</div><div class="card-body">Proxy desenleri (UUPS, transparent) dikkatli depolama düzeni gerektirir; yanlış bir slot sözleşmeyi tuğlalaştırır veya yetkilendirmeyi açar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Savunmacı Programlama Hatırlatma Kartı</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>Solidity ≥ 0.8 kullanın (yerleşik overflow kontrolleri).</li>
<li>Daima Checks-Effects-Interactions; yüksek riskli fonksiyonlar için ReentrancyGuard.</li>
<li>Çoklu kaynaklı oracle'lar (Chainlink), AMM-türevi fiyatlar için TWAP'ler.</li>
<li>Herhangi bir zincir dışı imza için EIP-712 + nonce + chainId.</li>
<li>Yetkilendirme için <code>msg.sender</code>, <code>tx.origin</code> değil.</li>
<li>ETH transferleri için pull, push'a tercih edilir.</li>
<li>Dış denetimler (Trail of Bits, OpenZeppelin, ConsenSys Diligence) + CI'da Slither/Mythril/Echidna.</li>
<li>Mainnet deploy'undan önce bug bounty (Immunefi).</li>
</ol>
</div>

<div class="lesson-block">
<h2 class="lesson-title">8b. Gas maliyeti — savunmasız vs korumalı withdraw (görsel)</h2>
<p class="l-text">Ethereum mainnet'te basit bir <code>withdraw()</code>, savunmacı desene göre farklı gas tüketir. Saf çağır-sonra-güncelle en ucuzdur ama güvensiz; checks-effects-interactions bir SSTORE ekler; ReentrancyGuard ikinci SSTORE + SLOAD ekler. Pull-payment deseni en pahalı ama re-entrancy zincirlerine karşı en güvenli olanıdır.</p>
<div id="plot-blockchain-l4-gas-tr" class="plotly-graph" style="width:100%;height:380px;"></div>
<div class="calc-graph"><div class="graph-caption"><strong>Bu grafiğin gösterdiği:</strong> Güvenliğin maliyeti gerçek ama küçük — withdraw başına ~5-10k gas (20 gwei'de çağrı başına sentler). EIP-1153 transient storage farkın çoğunu kapatır. Gas tasarrufu için guard'ı atlayan mühendisler bir kahveden tasarruf ederken hazineyi riske atar.</div></div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The DAO yeniden girişi gösterdi: durum güncellemesinden önce dış çağrı kanonik hatadır.</li>
<li>BatchOverflow = 0.4.x'te sessiz uint sarması. Solidity 0.8 + SafeMath cevaptır.</li>
<li>Spot oracle'lar flash-loan saldırganlarına armağandır; TWAP ve Chainlink kullanın.</li>
<li>MEV gerçek ve büyük — Flashbots/MEV-Boost/özel mempool'lar azaltır.</li>
<li>EIP-712 + chainId + nonce imzaları yeniden oynatılamaz tutar.</li>
<li><code>tx.origin</code> ≠ yetkilendirme; güvenilmez kod üzerinde <code>delegatecall</code> = tuğlalaşma riski.</li>
</ul>
</div>
<p class="l-text">Sıradaki, <strong>blockchain-L5</strong>: mutabakat mekanizmaları — PoW, PoS, BFT, Casper, kesinlik, fork seçimi.</p>
</div>`
};
