window.BLOCKCHAIN_L3 = {

en: `<p class="l-text"><strong>In late 2013, a 19-year-old Vitalik Buterin published a whitepaper arguing that Bitcoin's scripting language was "too restricted" and proposed instead a quasi-Turing-complete state machine living inside a global blockchain.</strong> By July 2015 that idea booted as Ethereum, and within five years it carried more than $50B of value through a stack-based VM, a typed contract language called Solidity, and a fee market priced in <em>gas</em> — a unit invented specifically to bound the halting problem.</p>
<p class="l-text">In this lesson we tour the Ethereum Virtual Machine end-to-end. You will simulate an EVM-style opcode interpreter, write your first <code>Vault</code> contract in Solidity, decode an ABI-encoded call by hand, watch a transaction emit an indexed event, and meet the modern dev stack: Hardhat (TypeScript) and Foundry (Rust + Solidity tests).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish externally-owned accounts (EOAs) from contract accounts</li>
<li>Run a tiny EVM-style stack VM with PUSH, ADD, SHA3 and CALL opcodes</li>
<li>Read a Solidity contract and trace its compiled bytecode at the function-selector level</li>
<li>Compute gas cost = base + per-opcode + storage; explain the 21,000 transaction floor</li>
<li>ABI-encode a function call manually: 4-byte selector + 32-byte aligned arguments</li>
<li>Compare Hardhat (Node + ethers.js) and Foundry (forge + cast + anvil) for testing</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Two Kinds of Accounts</h2>
<p class="l-text">Ethereum's state is a Patricia-Merkle trie mapping 20-byte addresses to account objects. Each account is either an <em>EOA</em> (controlled by an ECDSA secp256k1 private key, just like Bitcoin) or a <em>contract</em> (controlled by code stored on chain). Both can hold ETH; only contracts have code and storage. Every transaction is signed by an EOA — contracts can call other contracts but cannot originate transactions.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">EOA</div><div class="card-body">{nonce, balance}. Owned by a keypair. Originates transactions.</div></div>
<div class="calc-card"><div class="card-title">Contract</div><div class="card-body">{nonce, balance, codeHash, storageRoot}. Code is immutable after deploy.</div></div>
<div class="calc-card"><div class="card-title">Address</div><div class="card-body">EOA: keccak256(pubkey)[12:]. Contract: keccak256(rlp(creator, nonce))[12:].</div></div>
<div class="calc-card"><div class="card-title">Storage</div><div class="card-body">Per contract: 256-bit slot → 256-bit value. Read SLOAD, write SSTORE.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The EVM: a 256-Bit Stack Machine</h2>
<p class="l-text">The EVM has no registers. It has a stack (max 1,024 items, each 256 bits), a transient memory (byte-addressable), persistent storage (key-value), and 140-ish opcodes. Solidity compiles to this bytecode. Every opcode costs gas; the transaction sender funds it; if you run out, the entire call reverts but gas is consumed.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">keccak</span>(b):
    <span class="cm"># Pyodide hashlib has no keccak256 directly; we approximate with sha3_256</span>
    <span class="kw">return</span> hashlib.<span class="fn">sha3_256</span>(b).<span class="fn">digest</span>()

<span class="kw">def</span> <span class="fn">evm</span>(program, gas=<span class="num">10000</span>):
    stack, mem, storage, used = [], <span class="fn">bytearray</span>(<span class="num">256</span>), {}, <span class="num">0</span>
    pc = <span class="num">0</span>
    <span class="kw">while</span> pc &lt; <span class="fn">len</span>(program):
        op = program[pc]; pc += <span class="num">1</span>
        <span class="kw">if</span> op == <span class="str">"PUSH"</span>:
            stack.<span class="fn">append</span>(program[pc]); pc += <span class="num">1</span>; used += <span class="num">3</span>
        <span class="kw">elif</span> op == <span class="str">"ADD"</span>:
            a, b = stack.<span class="fn">pop</span>(), stack.<span class="fn">pop</span>(); stack.<span class="fn">append</span>((a + b) &amp; ((<span class="num">1</span> &lt;&lt; <span class="num">256</span>) - <span class="num">1</span>)); used += <span class="num">3</span>
        <span class="kw">elif</span> op == <span class="str">"MUL"</span>:
            a, b = stack.<span class="fn">pop</span>(), stack.<span class="fn">pop</span>(); stack.<span class="fn">append</span>((a * b) &amp; ((<span class="num">1</span> &lt;&lt; <span class="num">256</span>) - <span class="num">1</span>)); used += <span class="num">5</span>
        <span class="kw">elif</span> op == <span class="str">"SHA3"</span>:
            data = <span class="fn">str</span>(stack.<span class="fn">pop</span>()).<span class="fn">encode</span>()
            stack.<span class="fn">append</span>(<span class="fn">int</span>.<span class="fn">from_bytes</span>(<span class="fn">keccak</span>(data)[:<span class="num">8</span>], <span class="str">"big"</span>)); used += <span class="num">30</span>
        <span class="kw">elif</span> op == <span class="str">"SSTORE"</span>:
            v, k = stack.<span class="fn">pop</span>(), stack.<span class="fn">pop</span>(); storage[k] = v; used += <span class="num">20000</span>
        <span class="kw">elif</span> op == <span class="str">"STOP"</span>:
            <span class="kw">break</span>
        <span class="kw">if</span> used &gt; gas:
            <span class="kw">raise</span> <span class="fn">RuntimeError</span>(<span class="str">"out of gas"</span>)
    <span class="kw">return</span> stack, storage, used

prog = [<span class="str">"PUSH"</span>, <span class="num">5</span>, <span class="str">"PUSH"</span>, <span class="num">7</span>, <span class="str">"ADD"</span>, <span class="str">"PUSH"</span>, <span class="num">42</span>, <span class="str">"SSTORE"</span>, <span class="str">"STOP"</span>]
s, st, g = <span class="fn">evm</span>(prog, gas=<span class="num">25000</span>)
<span class="fn">print</span>(<span class="str">"stack="</span>, s, <span class="str">"storage="</span>, st, <span class="str">"gas used="</span>, g)</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) PUSH 5, PUSH 7, ADD → stack ends with 12. 2) PUSH 42, SSTORE writes <code>storage[42]=12</code> at a steep 20,000 gas. 3) STOP halts. The result mirrors how a real EVM contract executes — minus the rest of the opcode set.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Solidity by Example</h2>
<p class="l-text">Solidity (Wood, 2014) is a JavaScript-flavored, statically typed contract language that compiles to EVM bytecode. The canonical first contract is a Vault.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm">// SPDX-License-Identifier: MIT</span>
<span class="kw">pragma</span> solidity ^<span class="num">0.8.20</span>;

<span class="kw">contract</span> Vault {
    <span class="kw">mapping</span>(<span class="ty">address</span> =&gt; <span class="ty">uint256</span>) <span class="kw">public</span> balances;

    <span class="kw">event</span> Deposit(<span class="ty">address</span> <span class="kw">indexed</span> from, <span class="ty">uint256</span> amount);
    <span class="kw">event</span> Withdraw(<span class="ty">address</span> <span class="kw">indexed</span> to, <span class="ty">uint256</span> amount);

    <span class="kw">function</span> deposit() <span class="kw">external</span> <span class="kw">payable</span> {
        balances[<span class="kw">msg</span>.sender] += <span class="kw">msg</span>.value;
        <span class="kw">emit</span> Deposit(<span class="kw">msg</span>.sender, <span class="kw">msg</span>.value);
    }

    <span class="kw">function</span> withdraw(<span class="ty">uint256</span> amount) <span class="kw">external</span> {
        <span class="kw">require</span>(balances[<span class="kw">msg</span>.sender] &gt;= amount, <span class="str">"insufficient"</span>);
        balances[<span class="kw">msg</span>.sender] -= amount;
        (<span class="ty">bool</span> ok, ) = <span class="kw">msg</span>.sender.call{value: amount}(<span class="str">""</span>);
        <span class="kw">require</span>(ok, <span class="str">"send failed"</span>);
        <span class="kw">emit</span> Withdraw(<span class="kw">msg</span>.sender, amount);
    }
}</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) <code>balances</code> is a storage mapping (slot computed as <code>keccak256(key . slot)</code>). 2) <code>deposit</code> is <code>payable</code>, accepting ETH. 3) <code>withdraw</code> checks balance, decrements (<em>before</em> sending — see L4 reentrancy), then calls back. 4) Two events index the sender so off-chain dapps can subscribe with <code>filter({from: addr})</code>.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Gas: Pricing the Halting Problem</h2>
<p class="l-text">A Turing-complete VM cannot solve the halting problem. Ethereum sidesteps it by metering: every opcode costs gas, the sender pre-pays a maximum, and execution halts when gas runs out. The base transaction fee is 21,000 gas; SSTORE on a fresh slot costs 20,000; CALL costs 700+; SHA3 costs 30 + 6 per byte.</p>
<div class="katex-block">$$\\text{fee} = (\\text{base fee} + \\text{priority fee}) \\cdot \\text{gas used}$$</div>
<div class="calc-highlight">EIP-1559 (Aug 2021) split fees into a burned base fee (target-block-size driven) and an optional tip to the validator. Daily ETH burn since EIP-1559: ~4 million ETH cumulatively (mid-2026 figure).</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. ABI Encoding by Hand</h2>
<p class="l-text">When you call <code>vault.withdraw(100)</code>, the wallet builds calldata: a 4-byte function selector (<code>keccak256("withdraw(uint256)")[:4]</code>) followed by 32-byte big-endian arguments. The contract dispatches on the first 4 bytes.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">selector</span>(sig):
    <span class="kw">return</span> hashlib.<span class="fn">sha3_256</span>(sig.<span class="fn">encode</span>()).<span class="fn">digest</span>()[:<span class="num">4</span>].<span class="fn">hex</span>()

<span class="kw">def</span> <span class="fn">encode_uint</span>(x):
    <span class="kw">return</span> x.<span class="fn">to_bytes</span>(<span class="num">32</span>, <span class="str">"big"</span>).<span class="fn">hex</span>()

calldata = <span class="fn">selector</span>(<span class="str">"withdraw(uint256)"</span>) + <span class="fn">encode_uint</span>(<span class="num">100</span>)
<span class="fn">print</span>(<span class="str">"selector:"</span>, calldata[:<span class="num">8</span>])
<span class="fn">print</span>(<span class="str">"argument:"</span>, calldata[<span class="num">8</span>:])
<span class="fn">print</span>(<span class="str">"full   :"</span>, <span class="str">"0x"</span> + calldata)</code></pre></div>
<p class="l-text"><strong>Note:</strong> Real Ethereum uses Keccak-256 (the original NIST submission), not the standardized SHA3-256; the two differ in padding. Pyodide gives <code>sha3_256</code>, so this demo's selector will not match a real chain — the structure is identical.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Events and Logs</h2>
<p class="l-text">Storage is expensive (20,000 gas/slot). Logs are 5x cheaper but unreadable from inside contracts. They live in a separate, queryable index — perfect for dapps. <code>indexed</code> parameters become topics (Bloom-filtered); the rest go into the data field.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">topics[0]</div><div class="card-body">keccak256 of the event signature, e.g. Transfer(address,address,uint256).</div></div>
<div class="calc-card"><div class="card-title">topics[1..3]</div><div class="card-body">Indexed parameters (max 3). Bloom filter lives in the block header.</div></div>
<div class="calc-card"><div class="card-title">data</div><div class="card-body">Non-indexed args, ABI-encoded.</div></div>
<div class="calc-card"><div class="card-title">Use cases</div><div class="card-body">The Graph, Etherscan, wallet activity feeds, oracles.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Hardhat vs Foundry</h2>
<p class="l-text">Two dev frameworks dominate Ethereum smart contract work in 2026.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hardhat</div><div class="card-body">Node.js + ethers.js. Tests in JS/TS. Good plugin ecosystem; slower than Foundry.</div></div>
<div class="calc-card"><div class="card-title">Foundry</div><div class="card-body">Rust core. Tests in Solidity itself. forge test, anvil local node, cast for RPC.</div></div>
<div class="calc-card"><div class="card-title">Fuzz tests</div><div class="card-body">Foundry has property-based testing (forge test --fuzz-runs 10000) out of the box.</div></div>
<div class="calc-card"><div class="card-title">When to pick which</div><div class="card-body">Hardhat for full-stack dapps; Foundry for serious contract auditing and gas optimization.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm">// Foundry test (Solidity)</span>
<span class="kw">contract</span> VaultTest <span class="kw">is</span> Test {
    Vault vault;
    <span class="kw">function</span> setUp() <span class="kw">public</span> { vault = <span class="kw">new</span> Vault(); }

    <span class="kw">function</span> testFuzz_DepositWithdraw(<span class="ty">uint96</span> amt) <span class="kw">public</span> {
        vm.deal(<span class="kw">address</span>(<span class="kw">this</span>), amt);
        vault.deposit{value: amt}();
        <span class="kw">assertEq</span>(vault.balances(<span class="kw">address</span>(<span class="kw">this</span>)), amt);
    }
}</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) <code>VaultTest</code> extends Foundry's <code>Test</code> base, so all <code>vm.*</code> cheatcodes (deal, prank, expectRevert) are available. 2) <code>setUp()</code> runs before every test and deploys a fresh <code>Vault</code> instance, isolating state. 3) <code>testFuzz_DepositWithdraw</code> takes a <code>uint96</code> argument — Foundry's fuzzer feeds hundreds of random values; <code>vm.deal</code> mints that much ETH to the test contract so <code>vault.deposit{value: amt}()</code> can actually transfer. 4) <code>assertEq</code> checks the post-deposit invariant: <code>balances[address(this)] == amt</code>. Run with <code>forge test --fuzz-runs 10000</code> to catch overflow or rounding bugs the dev never imagined.</p>

</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Gas Cost Visualization</h2>
<p class="l-text">Plot gas cost across common operations. SSTORE dominates by orders of magnitude.</p>
<div id="bc3-plot-en" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Key Takeaways</h2>
<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Two account types: EOA (key-controlled) and Contract (code-controlled).<br><strong>2.</strong> EVM is a 256-bit stack VM with persistent storage; ~140 opcodes.<br><strong>3.</strong> Solidity compiles to EVM bytecode; mappings live in keccak-derived slots.<br><strong>4.</strong> Gas meters every opcode and bounds execution; EIP-1559 burns the base fee.<br><strong>5.</strong> ABI calldata = 4-byte selector + 32-byte aligned args.<br><strong>6.</strong> Events are cheap, queryable logs with up to 3 indexed topics.<br><strong>7.</strong> Hardhat (TS) and Foundry (Rust + Solidity tests) are the modern dev stack.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ops = ['ADD','MUL','SHA3 (32B)','SLOAD','CALL','SSTORE (new)'];
  var costs = [3, 5, 36, 2100, 2600, 20000];
  var data = [{x:ops,y:costs,type:'bar',marker:{color:T.accent},text:costs.map(String),textposition:'outside'}];
  var layout = {title:'EVM Gas Cost by Opcode',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{title:'Gas',type:'log',gridcolor:T.grid},margin:{t:50,r:30,b:60,l:60}};
  ['bc3-plot-en','bc3-plot-tr'].forEach(function(id){var el=document.getElementById(id); if(el && window.Plotly) Plotly.newPlot(id,data,layout,{displayModeBar:false});});
},250);
</script>`,

tr: `<p class="l-text"><strong>2013'ün sonlarında, 19 yaşındaki Vitalik Buterin, Bitcoin'in betik dilinin "fazla kısıtlı" olduğunu savunan bir whitepaper yayımladı ve onun yerine küresel bir blockchain içinde yaşayan, neredeyse Turing-tam bir durum makinesi önerdi.</strong> Temmuz 2015'te bu fikir Ethereum olarak yola çıktı ve beş yıl içinde yığın tabanlı bir VM, Solidity adlı tipli bir sözleşme dili ve <em>gas</em> — özellikle durma problemini sınırlamak için icat edilmiş bir birim — üzerinden fiyatlanan bir ücret pazarı aracılığıyla 50 milyar doları aşkın değer taşıdı.</p>
<p class="l-text">Bu derste Ethereum Sanal Makinesi'ni baştan sona dolaşıyoruz. EVM tarzı bir opcode yorumlayıcı simüle edecek, Solidity ile ilk <code>Vault</code> akıllı sözleşmenizi yazacak, ABI ile kodlanmış bir çağrıyı elle çözecek, bir işlemin indeksli bir olay yaymasını izleyecek ve modern dev yığını tanıyacaksınız: Hardhat (TypeScript) ve Foundry (Rust + Solidity testleri).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dışarıdan-sahipli hesapları (EOA) sözleşme hesaplarından ayırt edin</li>
<li>PUSH, ADD, SHA3 ve CALL opcode'ları olan küçük bir EVM tarzı yığın VM çalıştırın</li>
<li>Bir Solidity sözleşmesini okuyun ve derlenmiş bytecode'unu fonksiyon-seçici düzeyinde izleyin</li>
<li>gas maliyeti = base + opcode başına + storage hesaplayın; 21.000 işlem tabanını açıklayın</li>
<li>Bir fonksiyon çağrısını elle ABI ile kodlayın: 4 baytlık seçici + 32 baytlık hizalı argümanlar</li>
<li>Test için Hardhat (Node + ethers.js) ile Foundry'yi (forge + cast + anvil) karşılaştırın</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. İki Tür Hesap</h2>
<p class="l-text">Ethereum durumu, 20 baytlık adresleri hesap nesnelerine eşleyen bir Patricia-Merkle trie'sidir. Her hesap ya bir <em>EOA</em>'dır (tıpkı Bitcoin gibi bir ECDSA secp256k1 özel anahtarı tarafından kontrol edilen) ya da bir <em>sözleşme</em>'dir (zincirde saklanan kod tarafından kontrol edilen). Her ikisi de ETH tutabilir; yalnızca sözleşmelerin kodu ve depolaması olur. Her işlem bir EOA tarafından imzalanır — sözleşmeler diğer sözleşmeleri çağırabilir ama işlem başlatamaz.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">EOA</div><div class="card-body">{nonce, balance}. Bir anahtar çiftinin sahibi. İşlem başlatır.</div></div>
<div class="calc-card"><div class="card-title">Sözleşme</div><div class="card-body">{nonce, balance, codeHash, storageRoot}. Kod, deploy sonrası değiştirilemez.</div></div>
<div class="calc-card"><div class="card-title">Adres</div><div class="card-body">EOA: keccak256(pubkey)[12:]. Sözleşme: keccak256(rlp(creator, nonce))[12:].</div></div>
<div class="calc-card"><div class="card-title">Depolama</div><div class="card-body">Sözleşme başına: 256-bit slot → 256-bit değer. SLOAD ile oku, SSTORE ile yaz.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. EVM: 256-Bit'lik Bir Yığın Makinesi</h2>
<p class="l-text">EVM'in kayıt yoktur. Bir yığın (en fazla 1.024 öğe, her biri 256 bit), geçici bir bellek (bayt-adreslenebilir), kalıcı depolama (anahtar-değer) ve yaklaşık 140 opcode'u vardır. Solidity bu bytecode'a derlenir. Her opcode gas tutar; işlem göndericisi onu finanse eder; gas biterse tüm çağrı geri alınır ama gas tüketilmiştir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">keccak</span>(b):
    <span class="cm"># Pyodide hashlib doğrudan keccak256 sunmaz; sha3_256 ile yaklaşırız</span>
    <span class="kw">return</span> hashlib.<span class="fn">sha3_256</span>(b).<span class="fn">digest</span>()

<span class="kw">def</span> <span class="fn">evm</span>(program, gas=<span class="num">10000</span>):
    stack, mem, storage, used = [], <span class="fn">bytearray</span>(<span class="num">256</span>), {}, <span class="num">0</span>
    pc = <span class="num">0</span>
    <span class="kw">while</span> pc &lt; <span class="fn">len</span>(program):
        op = program[pc]; pc += <span class="num">1</span>
        <span class="kw">if</span> op == <span class="str">"PUSH"</span>:
            stack.<span class="fn">append</span>(program[pc]); pc += <span class="num">1</span>; used += <span class="num">3</span>
        <span class="kw">elif</span> op == <span class="str">"ADD"</span>:
            a, b = stack.<span class="fn">pop</span>(), stack.<span class="fn">pop</span>(); stack.<span class="fn">append</span>((a + b) &amp; ((<span class="num">1</span> &lt;&lt; <span class="num">256</span>) - <span class="num">1</span>)); used += <span class="num">3</span>
        <span class="kw">elif</span> op == <span class="str">"MUL"</span>:
            a, b = stack.<span class="fn">pop</span>(), stack.<span class="fn">pop</span>(); stack.<span class="fn">append</span>((a * b) &amp; ((<span class="num">1</span> &lt;&lt; <span class="num">256</span>) - <span class="num">1</span>)); used += <span class="num">5</span>
        <span class="kw">elif</span> op == <span class="str">"SHA3"</span>:
            data = <span class="fn">str</span>(stack.<span class="fn">pop</span>()).<span class="fn">encode</span>()
            stack.<span class="fn">append</span>(<span class="fn">int</span>.<span class="fn">from_bytes</span>(<span class="fn">keccak</span>(data)[:<span class="num">8</span>], <span class="str">"big"</span>)); used += <span class="num">30</span>
        <span class="kw">elif</span> op == <span class="str">"SSTORE"</span>:
            v, k = stack.<span class="fn">pop</span>(), stack.<span class="fn">pop</span>(); storage[k] = v; used += <span class="num">20000</span>
        <span class="kw">elif</span> op == <span class="str">"STOP"</span>:
            <span class="kw">break</span>
        <span class="kw">if</span> used &gt; gas:
            <span class="kw">raise</span> <span class="fn">RuntimeError</span>(<span class="str">"out of gas"</span>)
    <span class="kw">return</span> stack, storage, used

prog = [<span class="str">"PUSH"</span>, <span class="num">5</span>, <span class="str">"PUSH"</span>, <span class="num">7</span>, <span class="str">"ADD"</span>, <span class="str">"PUSH"</span>, <span class="num">42</span>, <span class="str">"SSTORE"</span>, <span class="str">"STOP"</span>]
s, st, g = <span class="fn">evm</span>(prog, gas=<span class="num">25000</span>)
<span class="fn">print</span>(<span class="str">"stack="</span>, s, <span class="str">"storage="</span>, st, <span class="str">"gas used="</span>, g)</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) PUSH 5, PUSH 7, ADD → yığın 12 ile biter. 2) PUSH 42, SSTORE 20.000 gas gibi yüksek bir maliyetle <code>storage[42]=12</code> yazar. 3) STOP durdurur. Sonuç, gerçek bir EVM sözleşmesinin nasıl çalıştığını yansıtır — kalan opcode kümesi hariç.</p>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Örnekle Solidity</h2>
<p class="l-text">Solidity (Wood, 2014), EVM bytecode'una derlenen, JavaScript tatlı, statik tipli bir akıllı sözleşme dilidir. Kanonik ilk sözleşme bir Vault'tür.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm">// SPDX-License-Identifier: MIT</span>
<span class="kw">pragma</span> solidity ^<span class="num">0.8.20</span>;

<span class="kw">contract</span> Vault {
    <span class="kw">mapping</span>(<span class="ty">address</span> =&gt; <span class="ty">uint256</span>) <span class="kw">public</span> balances;

    <span class="kw">event</span> Deposit(<span class="ty">address</span> <span class="kw">indexed</span> from, <span class="ty">uint256</span> amount);
    <span class="kw">event</span> Withdraw(<span class="ty">address</span> <span class="kw">indexed</span> to, <span class="ty">uint256</span> amount);

    <span class="kw">function</span> deposit() <span class="kw">external</span> <span class="kw">payable</span> {
        balances[<span class="kw">msg</span>.sender] += <span class="kw">msg</span>.value;
        <span class="kw">emit</span> Deposit(<span class="kw">msg</span>.sender, <span class="kw">msg</span>.value);
    }

    <span class="kw">function</span> withdraw(<span class="ty">uint256</span> amount) <span class="kw">external</span> {
        <span class="kw">require</span>(balances[<span class="kw">msg</span>.sender] &gt;= amount, <span class="str">"insufficient"</span>);
        balances[<span class="kw">msg</span>.sender] -= amount;
        (<span class="ty">bool</span> ok, ) = <span class="kw">msg</span>.sender.call{value: amount}(<span class="str">""</span>);
        <span class="kw">require</span>(ok, <span class="str">"send failed"</span>);
        <span class="kw">emit</span> Withdraw(<span class="kw">msg</span>.sender, amount);
    }
}</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) <code>balances</code> bir depolama eşlemesidir (slot <code>keccak256(key . slot)</code> olarak hesaplanır). 2) <code>deposit</code> <code>payable</code>'dır, ETH kabul eder. 3) <code>withdraw</code> bakiyeyi kontrol eder, azaltır (gönderimden <em>önce</em> — L4 yeniden giriş (reentrancy)'a bakın), sonra geri çağırır. 4) İki olay göndericiyi indeksler, böylece zincir dışı dapp'lar <code>filter({from: addr})</code> ile abone olabilir.</p>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Gas: Durma Problemini Fiyatlamak</h2>
<p class="l-text">Turing-tam bir VM durma problemini çözemez. Ethereum bunu sayma ile aşar: her opcode gas tutar, gönderici en yüksek miktarı önceden öder ve gas bittiğinde çalışma durur. Temel işlem ücreti 21.000 gas; yeni bir slot üzerinde SSTORE 20.000 gas; CALL 700+; SHA3 30 + bayt başına 6.</p>
<div class="katex-block">$$\\text{fee} = (\\text{base fee} + \\text{priority fee}) \\cdot \\text{gas used}$$</div>
<div class="calc-highlight">EIP-1559 (Ağu 2021) ücretleri yakılan bir taban ücretine (hedef-blok-boyutu güdümlü) ve doğrulayıcıya isteğe bağlı bir bahşişe ayırdı. EIP-1559'dan beri günlük ETH yakımı: kümülatif ~4 milyon ETH (2026 ortası rakamı).</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Elle ABI Kodlama</h2>
<p class="l-text"><code>vault.withdraw(100)</code> çağırdığınızda, cüzdan calldata oluşturur: 4 baytlık bir fonksiyon seçicisi (<code>keccak256("withdraw(uint256)")[:4]</code>) ve ardından 32 baytlık big-endian argümanlar. Sözleşme ilk 4 bayta göre yönlendirir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> hashlib

<span class="kw">def</span> <span class="fn">selector</span>(sig):
    <span class="kw">return</span> hashlib.<span class="fn">sha3_256</span>(sig.<span class="fn">encode</span>()).<span class="fn">digest</span>()[:<span class="num">4</span>].<span class="fn">hex</span>()

<span class="kw">def</span> <span class="fn">encode_uint</span>(x):
    <span class="kw">return</span> x.<span class="fn">to_bytes</span>(<span class="num">32</span>, <span class="str">"big"</span>).<span class="fn">hex</span>()

calldata = <span class="fn">selector</span>(<span class="str">"withdraw(uint256)"</span>) + <span class="fn">encode_uint</span>(<span class="num">100</span>)
<span class="fn">print</span>(<span class="str">"selector:"</span>, calldata[:<span class="num">8</span>])
<span class="fn">print</span>(<span class="str">"argument:"</span>, calldata[<span class="num">8</span>:])
<span class="fn">print</span>(<span class="str">"full   :"</span>, <span class="str">"0x"</span> + calldata)</code></pre></div>
<p class="l-text"><strong>Not:</strong> Gerçek Ethereum, standartlaştırılmış SHA3-256'yı değil, Keccak-256'yı (orijinal NIST gönderimini) kullanır; ikisi padding'de farklıdır. Pyodide <code>sha3_256</code> verir, dolayısıyla bu demo'nun seçicisi gerçek bir zincirle eşleşmeyecektir — yapı aynıdır.</p>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Olaylar ve Loglar</h2>
<p class="l-text">Depolama pahalıdır (20.000 gas/slot). Loglar 5 kat daha ucuzdur ama sözleşmelerin içinden okunamaz. Ayrı, sorgulanabilir bir indekste yaşarlar — dapp'lar için mükemmel. <code>indexed</code> parametreler topic olur (Bloom-filtreli); kalanlar data alanına gider.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">topics[0]</div><div class="card-body">Olay imzasının keccak256'sı, ör. Transfer(address,address,uint256).</div></div>
<div class="calc-card"><div class="card-title">topics[1..3]</div><div class="card-body">İndekslenmiş parametreler (en fazla 3). Bloom filtresi blok başlığında yaşar.</div></div>
<div class="calc-card"><div class="card-title">data</div><div class="card-body">İndekslenmemiş argümanlar, ABI ile kodlanmış.</div></div>
<div class="calc-card"><div class="card-title">Kullanım örnekleri</div><div class="card-body">The Graph, Etherscan, cüzdan etkinlik akışları, oracle'lar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Hardhat vs Foundry</h2>
<p class="l-text">2026'da Ethereum akıllı sözleşme çalışmasına iki dev framework hâkimdir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hardhat</div><div class="card-body">Node.js + ethers.js. Testler JS/TS'te. İyi eklenti ekosistemi; Foundry'den yavaş.</div></div>
<div class="calc-card"><div class="card-title">Foundry</div><div class="card-body">Rust çekirdek. Testler Solidity'nin kendisinde. forge test, anvil yerel düğüm, RPC için cast.</div></div>
<div class="calc-card"><div class="card-title">Fuzz testleri</div><div class="card-body">Foundry'de özellik tabanlı test (forge test --fuzz-runs 10000) kutudan çıkar çıkmaz vardır.</div></div>
<div class="calc-card"><div class="card-title">Hangisini seçmeli</div><div class="card-body">Tam yığın dapp'lar için Hardhat; ciddi sözleşme denetimi ve gas optimizasyonu için Foundry.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm">// Foundry test (Solidity)</span>
<span class="kw">contract</span> VaultTest <span class="kw">is</span> Test {
    Vault vault;
    <span class="kw">function</span> setUp() <span class="kw">public</span> { vault = <span class="kw">new</span> Vault(); }

    <span class="kw">function</span> testFuzz_DepositWithdraw(<span class="ty">uint96</span> amt) <span class="kw">public</span> {
        vm.deal(<span class="kw">address</span>(<span class="kw">this</span>), amt);
        vault.deposit{value: amt}();
        <span class="kw">assertEq</span>(vault.balances(<span class="kw">address</span>(<span class="kw">this</span>)), amt);
    }
}</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) <code>VaultTest</code>, Foundry'nin <code>Test</code> taban sözleşmesini miras alır; böylece tüm <code>vm.*</code> cheatcode'ları (deal, prank, expectRevert) kullanılabilir hale gelir. 2) <code>setUp()</code> her testten önce çalışır ve taze bir <code>Vault</code> örneği deploy ederek durumu izole eder. 3) <code>testFuzz_DepositWithdraw</code> bir <code>uint96</code> argümanı alır — Foundry'nin fuzzer'ı yüzlerce rastgele değer besler; <code>vm.deal</code> test sözleşmesine o kadar ETH basar, böylece <code>vault.deposit{value: amt}()</code> gerçekten transfer yapabilir. 4) <code>assertEq</code> mevduat sonrası değişmezliği kontrol eder: <code>balances[address(this)] == amt</code>. Geliştiricinin aklına gelmeyen taşma veya yuvarlama hatalarını yakalamak için <code>forge test --fuzz-runs 10000</code> ile çalıştırın.</p>

</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Gas Maliyeti Görselleştirmesi</h2>
<p class="l-text">Yaygın işlemler arasında gas maliyetini çizin. SSTORE büyük ölçüde baskındır.</p>
<div id="bc3-plot-tr" style="width:100%;height:380px;"></div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Anahtar Çıkarımlar</h2>
<div class="think-box"><div class="think-label">ANAHTAR ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> İki hesap türü: EOA (anahtar-kontrollü) ve Sözleşme (kod-kontrollü).<br><strong>2.</strong> EVM, kalıcı depolamaya sahip 256-bit'lik bir yığın VM'idir; ~140 opcode.<br><strong>3.</strong> Solidity EVM bytecode'una derlenir; eşlemeler keccak-türevi slotlarda yaşar.<br><strong>4.</strong> Gas her opcode'u sayar ve çalışmayı sınırlar; EIP-1559 taban ücreti yakar.<br><strong>5.</strong> ABI calldata = 4 baytlık seçici + 32 baytlık hizalı argümanlar.<br><strong>6.</strong> Olaylar, en fazla 3 indeksli topic'e sahip ucuz, sorgulanabilir loglardır.<br><strong>7.</strong> Hardhat (TS) ve Foundry (Rust + Solidity testleri) modern dev yığınıdır.</div></div>
</div>

<script>
setTimeout(function(){
  var T = (window.getThemeColors && window.getThemeColors()) || {accent:'#c8a96e', text:'#e8e6e3', grid:'rgba(255,255,255,.1)'};
  var ops = ['ADD','MUL','SHA3 (32B)','SLOAD','CALL','SSTORE (yeni)'];
  var costs = [3, 5, 36, 2100, 2600, 20000];
  var data = [{x:ops,y:costs,type:'bar',marker:{color:T.accent},text:costs.map(String),textposition:'outside'}];
  var layout = {title:'EVM Opcode Başına Gas Maliyeti',paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',font:{color:T.text},xaxis:{gridcolor:T.grid},yaxis:{title:'Gas',type:'log',gridcolor:T.grid},margin:{t:50,r:30,b:60,l:60}};
  var el=document.getElementById('bc3-plot-tr'); if(el && window.Plotly) Plotly.newPlot('bc3-plot-tr',data,layout,{displayModeBar:false});
},250);
</script>`
};
