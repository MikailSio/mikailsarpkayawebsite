window.BLOCKCHAIN_L8 = {
en: `<p class="l-text"><strong>This is the capstone of the Blockchain Security track: making smart-contract verification rigorous.</strong> The previous lessons gave you the threat catalog (L4 vulnerabilities), the consensus context (L5), the L2 architecture (L6), and the live-fire DeFi battlefield (L7). The capstone shows how the industry actually keeps catastrophes rare: a layered pipeline of <strong>static analysis</strong> (Slither), <strong>symbolic execution</strong> (Mythril, Manticore), <strong>property-based fuzzing</strong> (Echidna, Foundry's invariant testing), and at the most demanding tier, <strong>formal verification</strong> (Certora Prover, KEVM, Coq, Lean). Major audit firms — Trail of Bits, OpenZeppelin, ConsenSys Diligence, Spearbit, Code4rena — all wield variants of this pipeline.</p>

<p class="l-text">In this lesson we tour the verification toolchain end-to-end, from cheap-and-fast (lint-style Slither) to expensive-and-deep (Certora's CVL specifications). We dig into how Slither's intermediate language (SlithIR) underpins detectors, how symbolic execution explores paths in EVM, what makes <strong>Echidna</strong> uniquely good for invariant testing, and what a real Certora rule looks like for an ERC-4626 vault. Capstone exercise: a Python regex-based static analyzer that flags four real bug patterns — reentrancy, tx.origin, unchecked-call, and integer overflow — on toy Solidity AST snippets, demonstrating exactly how Slither's basic detectors work.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Slither's architecture: AST → SlithIR → 90+ detectors; what to integrate in CI</li>
<li>Mythril and Manticore: symbolic execution on EVM bytecode; SMT solver behind the curtain</li>
<li>Echidna property-based fuzzing: invariants, generators, shrinking, coverage-guided</li>
<li>Foundry invariant tests — the modern in-test fuzzing framework</li>
<li>Certora Prover and CVL specifications; what a "ruleset" looks like</li>
<li>K Framework / KEVM: a fully formal EVM semantics for theorem-proving</li>
<li>Build your own toy static analyzer in Python on regex over Solidity</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Audit Pyramid</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Layer 1: Linter / Static (Slither)</div><div class="card-body">Run on every commit. &lt; 1 minute. Finds 80% of common-knowledge bugs by pattern matching.</div></div>
<div class="calc-card"><div class="card-title">Layer 2: Symbolic execution (Mythril, Manticore)</div><div class="card-body">Run on PR / pre-deploy. Minutes-to-hours. Finds path-dependent bugs (e.g., reentrancy from arbitrary call graph).</div></div>
<div class="calc-card"><div class="card-title">Layer 3: Property fuzzing (Echidna, Foundry invariant)</div><div class="card-body">Pre-deploy. Hours-to-days. User defines invariants ("total supply never exceeds cap"); fuzzer tries to break them.</div></div>
<div class="calc-card"><div class="card-title">Layer 4: Formal verification (Certora, KEVM)</div><div class="card-body">Pre-major-deploy. Days-to-weeks. Mathematically proves properties hold for ALL inputs (not just sampled).</div></div>
<div class="calc-card"><div class="card-title">Layer 5: Human audit (firms + Code4rena/Sherlock contests)</div><div class="card-body">Always. Weeks. Domain insight no tool yet replicates.</div></div>
<div class="calc-card"><div class="card-title">Layer 6: Bug bounty (Immunefi)</div><div class="card-body">Continuous post-deploy. The market calls it.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Slither — The Workhorse</h2>
<p class="l-text"><strong>Slither</strong> (Trail of Bits, Feist et al., 2019) parses Solidity to AST, lifts to SlithIR (a register-based 3-address IR), and runs &gt; 90 detectors. Built on the Crytic infrastructure that also produces Echidna and Manticore.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Drive Slither programmatically (real environment, requires solc + slither installed)
import subprocess, json

result = subprocess.run(
    ["slither", "MyContract.sol", "--json", "-"],
    capture_output=True, text=True
)
report = json.loads(result.stdout)

for det in report.get("results", {}).get("detectors", []):
    print(f"[{det['impact']}/{det['confidence']}] {det['check']}: {det['description'].splitlines()[0]}")

# Common high-impact detectors:
#   reentrancy-eth, reentrancy-no-eth
#   uninitialized-state, uninitialized-storage
#   tx-origin, suicidal, arbitrary-send
#   unchecked-transfer, unchecked-lowlevel
#   incorrect-equality, weak-prng
#   shadowing-state, shadowing-abstract
</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) <code>subprocess.run(["slither", "MyContract.sol", "--json", "-"], capture_output=True)</code> invokes the installed Slither CLI and pipes its JSON report to <code>stdout</code> — the <code>"-"</code> arg sends JSON to stdout instead of a file. 2) <code>json.loads(result.stdout)</code> parses the report; the structure under <code>results.detectors</code> is a list of finding dicts. 3) The loop pulls each finding's <code>impact</code> (High/Medium/Low), <code>confidence</code>, <code>check</code> (detector ID like <code>reentrancy-eth</code>) and the first line of <code>description</code> — perfect for a CI summary. 4) The commented detector list shows the highest-value patterns to wire into a Husky/GitHub-Actions gate so any new <code>reentrancy-eth</code> or <code>tx-origin</code> finding blocks the PR.</p>

</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Mythril and Manticore — Symbolic Execution</h2>
<p class="l-text"><strong>Mythril</strong> (ConsenSys, 2017) takes EVM bytecode, walks every reachable path with symbolic inputs, and asks the Z3 SMT solver: "is there a value of these variables that leads to this state?" If yes, it produces a concrete exploit transaction. <strong>Manticore</strong> (also Trail of Bits) is the more programmable cousin — Python API for custom symbolic exploration, hooks for state filters.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Strength</div><div class="card-body">Finds path-dependent bugs no pattern matcher would catch — e.g., "this combination of three function calls under this caller leaks funds".</div></div>
<div class="calc-card"><div class="card-title">Weakness</div><div class="card-body">Path explosion. A loop with unknown bound, or external calls to unknown contracts, blows up the state space.</div></div>
<div class="calc-card"><div class="card-title">Mythril detectors</div><div class="card-body">SWC-101 integer-overflow, SWC-104 unchecked-call, SWC-107 reentrancy, SWC-127 arbitrary-jump, plus 25+ more.</div></div>
<div class="calc-card"><div class="card-title">Real-world use</div><div class="card-body">Common in CI for &lt; 200-line contracts. For large protocols, used selectively on critical functions.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Echidna and Foundry — Property Fuzzing</h2>
<p class="l-text"><strong>Echidna</strong> (Trail of Bits, Grieco et al., 2020) is a Haskell-based property fuzzer for Ethereum. You write Solidity functions starting with <code>echidna_</code> that return <code>true</code> if the invariant holds; Echidna generates millions of random call sequences trying to make them return false. Coverage-guided (like AFL/libFuzzer), with built-in shrinking.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># A typical Echidna test (Solidity, shown as Python string for context)
echidna_test = """
contract VaultProperties is Vault {
    function echidna_total_supply_lte_cap() public view returns (bool) {
        return totalSupply() &lt;= MAX_SUPPLY;
    }
    function echidna_solvent() public view returns (bool) {
        return underlying.balanceOf(address(this)) &gt;= totalAssets();
    }
    function echidna_no_inflation_attack() public view returns (bool) {
        if (totalSupply() == 0) return true;
        return totalAssets() / totalSupply() &lt;= 100 ether;  // share price bound
    }
}
"""
print(echidna_test)
print("Echidna will fuzz call sequences for hours and shrink any failing trace to a minimal counterexample.")
</code></pre></div>

<p class="l-text"><strong>Foundry's invariant testing</strong> (since 2022) brings the same idea into the modern test framework. <code>invariant_*</code> functions in <code>forge test --invariant</code> runs are now standard in production audits. Foundry's <code>vm.assume</code> and target/exclusion bounds make it ergonomic.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Certora Prover — Formal Verification at Scale</h2>
<p class="l-text"><strong>Certora</strong> (founded 2018 by Mooly Sagiv, Tel Aviv) is the industrial leader in EVM formal verification. You write specifications in <strong>CVL</strong> (Certora Verification Language); the prover translates contract + spec to SMT, dispatches to Z3/CVC5, and either proves the property or returns a concrete counterexample. Used by Aave, Compound, MakerDAO, Lido, Uniswap.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># A real-world style CVL rule (shown as Python string)
cvl = """
methods {
    function totalSupply() external returns (uint256) envfree;
    function balanceOf(address) external returns (uint256) envfree;
}

// Property: sum of all balances equals total supply
ghost mathint sumOfBalances {
    init_state axiom sumOfBalances == 0;
}
hook Sstore _balances[KEY address u] uint256 newBal (uint256 oldBal) {
    sumOfBalances = sumOfBalances + newBal - oldBal;
}
invariant totalSupplyEqualsSum()
    to_mathint(totalSupply()) == sumOfBalances;
"""
print(cvl)
print("This invariant compiles to SMT and Z3 either proves it or returns a tx sequence that breaks it.")
</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) The <code>methods</code> block declares <code>totalSupply()</code> and <code>balanceOf(address)</code> as <code>envfree</code> — telling the prover these calls do not depend on tx-environment so it can call them anywhere. 2) The <code>ghost mathint sumOfBalances</code> introduces a shadow variable initialised to <code>0</code> via the <code>init_state axiom</code>; <code>mathint</code> is an unbounded integer that avoids EVM overflow noise. 3) The <code>hook Sstore _balances[KEY address u] uint256 newBal (uint256 oldBal)</code> fires on every storage write to the <code>_balances</code> mapping and updates the ghost so <code>sumOfBalances += newBal - oldBal</code> — the prover threads it through every reachable state. 4) The <code>invariant totalSupplyEqualsSum()</code> requires <code>totalSupply() == sumOfBalances</code> at all times; Certora dispatches it to Z3/CVC5, which either returns "proved" or a concrete call sequence that breaks it.</p>

</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. K Framework and KEVM — Semantic Foundation</h2>
<p class="l-text"><strong>K Framework</strong> (Roşu, UIUC, since 2003) is a meta-framework for defining programming language semantics. <strong>KEVM</strong> (Hildenbrandt et al., 2018) gave the EVM its first complete formal semantics in K. With KEVM, you can prove properties not at the Solidity level but at the EVM bytecode level — strongest guarantee possible. Runtime Verification Inc. ships KEVM-based audits for the highest-stakes contracts (UniswapV2 core, original Casper FFG).</p>

<div class="calc-highlight">K's coolness: define EVM once, derive the interpreter, the symbolic executor, the deductive verifier, and the test runner — all from the same semantics. Formal-methods leverage at its purest.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. A Toy Slither — Regex Detectors in Python</h2>
<p class="l-text">Below: a stand-alone "tiny static analyzer" with four detectors, mirroring how Slither's simpler rules work. We don't tokenize Solidity here; we rely on regex over source. A real detector walks SlithIR, but the spirit is the same: <em>look for syntactic patterns that correlate with bugs</em>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re

def detect_reentrancy(src):
    """External call before state update inside the same function body."""
    findings = []
    for m in re.finditer(r"function\\s+(\\w+)[^{]*\\{(.*?)\\n\\}", src, re.S):
        name, body = m.group(1), m.group(2)
        # Heuristic: .call{value:...} or .send/.transfer ... followed by a state mutation
        ext_call = re.search(r"(\\w+)\\.(call|send|transfer)\\s*\\{|\\.(call|send|transfer)\\(", body)
        state_after = re.search(r"(balances|deposits|owed)\\s*\\[[^\\]]+\\]\\s*[-+]?=", body)
        if ext_call and state_after and ext_call.start() &lt; state_after.start():
            findings.append((name, "reentrancy: external call BEFORE state update"))
    return findings

def detect_tx_origin(src):
    return [("require/if", "tx.origin used for auth")
            for _ in re.finditer(r"tx\\.origin\\s*==", src)]

def detect_unchecked_call(src):
    """call/send without checked return."""
    return [("low-level call", "unchecked .call return value")
            for _ in re.finditer(r"(?&lt;!=\\s)\\.call\\{[^}]*\\}\\([^)]*\\)\\s*;", src)]

def detect_unsafe_math(src):
    """uint operations without explicit checked arithmetic on pre-0.8 Solidity."""
    pragma = re.search(r"pragma\\s+solidity\\s+([^;]+);", src)
    if pragma and re.search(r"0\\.[0-7]\\.", pragma.group(1)):
        if not re.search(r"using\\s+SafeMath", src):
            return [("contract", "pre-0.8 solc without SafeMath — overflow risk")]
    return []

# === Sample buggy contract ===
src = '''
pragma solidity 0.7.0;
contract Vulnerable {
    mapping(address =&gt; uint) public balances;
    function deposit() external payable { balances[msg.sender] += msg.value; }
    function withdraw() external {
        uint amt = balances[msg.sender];
        require(tx.origin == msg.sender);             // tx.origin abuse
        (bool ok, ) = msg.sender.call{value: amt}(""); // external call BEFORE state update
        balances[msg.sender] = 0;                      // ...state update too late
    }
    function pay(address to, uint v) external {
        to.call{value: v}("");                          // unchecked call
    }
}
'''

for det in [detect_reentrancy, detect_tx_origin, detect_unchecked_call, detect_unsafe_math]:
    for f in det(src):
        print(f"[!] {det.__name__}: {f}")
</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) <code>detect_reentrancy(src)</code> walks every <code>function ... {...}</code> body with a regex, then locates an <code>ext_call</code> (anything matching <code>.call/.send/.transfer</code>) and a <code>state_after</code> mutation on <code>balances</code>/<code>deposits</code>/<code>owed</code>; if the call's start index is before the mutation's, the function is flagged. 2) <code>detect_tx_origin(src)</code> simply scans for <code>tx.origin ==</code> — the classic phishable auth check. 3) <code>detect_unchecked_call(src)</code> matches a <code>.call{...}(...)</code>; pattern terminated by <code>;</code> without an assigned return — Solidity returns a <code>(bool, bytes)</code> tuple from low-level calls and silent failure means lost funds. 4) <code>detect_unsafe_math(src)</code> parses the <code>pragma solidity</code> line; if the major.minor is between <code>0.0.x</code> and <code>0.7.x</code> and <code>using SafeMath</code> is absent, the contract gets an overflow warning. The runner iterates all four over a deliberately buggy <code>Vulnerable</code> contract and prints every finding.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same toy static analyzer, runs in browser. Try editing the Solidity source to fix one bug at a time and watch the findings disappear.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re

def scan(src):
    out = []
    if re.search(r"tx\\.origin\\s*==", src):
        out.append(("tx-origin", "auth on tx.origin"))
    if re.search(r"\\.call\\{[^}]*\\}\\([^)]*\\)\\s*;", src):
        out.append(("unchecked-call", "low-level call without return check"))
    pragma = re.search(r"pragma\\s+solidity\\s+([^;]+);", src)
    if pragma and re.search(r"0\\.[0-7]\\.", pragma.group(1)) and "SafeMath" not in src:
        out.append(("unsafe-math", "pre-0.8 solc without SafeMath"))
    # Crude reentrancy: presence of an external call before a balances[..] -= pattern
    for fn in re.finditer(r"function\\s+(\\w+)[^{]*\\{(.+?)\\n\\}", src, re.S):
        body = fn.group(2)
        call = re.search(r"\\.call\\{value", body)
        upd  = re.search(r"balances\\[[^\\]]+\\]\\s*=\\s*0", body)
        if call and upd and call.start() &lt; upd.start():
            out.append(("reentrancy", f"in fn {fn.group(1)}: call before state zeroing"))
    return out

src = '''
pragma solidity 0.7.0;
contract V {
  mapping(address=&gt;uint) balances;
  function w() external {
    uint a = balances[msg.sender];
    require(tx.origin == msg.sender);
    (bool ok,) = msg.sender.call{value:a}("");
    balances[msg.sender] = 0;
  }
}
'''
for f in scan(src): print("[FINDING]", f)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. A Real Audit Case — How Compound v3's Liquidation Bug Was Found</h2>
<p class="l-text">Compound v3 (Comet, late 2022) was audited by OpenZeppelin and ChainSecurity. A subtle integer-truncation bug in the liquidation reward computation: when the liquidation collateral was less than 1 unit of the smallest decimal, the reward rounded to zero, causing the keeper bot to ignore the position. Found by a combination of: Slither's code-quality detector flagged the suspicious division, Foundry invariant test ("liquidator profit ≥ 0" failed for tiny dust positions), then human review pinpointed the rounding location. Patch: floor-or-ceil decision based on direction of bias.</p>

<div class="calc-highlight">Pattern: tools narrow the search space, humans interpret. No single layer is sufficient — the audit pyramid works because each layer catches what the others miss.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; Track Capstone</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Audit pyramid: linter → symbolic → fuzzing → formal → human → bounty.</li>
<li>Slither: SlithIR + 90+ detectors, fast, integrate in CI on every commit.</li>
<li>Mythril/Manticore: symbolic exec finds path-dependent bugs; path explosion is the bottleneck.</li>
<li>Echidna + Foundry invariant: property-based fuzzing catches bugs across long call sequences.</li>
<li>Certora CVL + KEVM: formal proofs for the highest-stakes code.</li>
<li>The Blockchain Security track end-to-end: L1 fundamentals → L2 cryptography → L3 architecture → L4 vulns → L5 consensus → L6 L2 scaling → L7 DeFi attacks → L8 audit/FV.</li>
</ul>
</div>
<p class="l-text">You've completed the Blockchain Security track. Next up: the IoT Security track — firmware reverse engineering, wireless protocols, ICS/SCADA, and connected vehicles.</p>
</div>`,
tr: `<p class="l-text"><strong>Bu, Blockchain Güvenliği track'inin bitirme dersidir: akıllı sözleşme doğrulamasını titiz hale getirmek.</strong> Önceki dersler size tehdit kataloğunu (L4 açıklar), mutabakat bağlamını (L5), L2 mimarisini (L6) ve canlı-ateş DeFi savaş alanını (L7) verdi. Bitirme, endüstrinin felaketleri nasıl gerçekten nadir tuttuğunu gösteriyor: <strong>statik analiz</strong> (Slither), <strong>sembolik yürütme</strong> (Mythril, Manticore), <strong>özellik tabanlı fuzzing</strong> (Echidna, Foundry'nin değişmez testi) ve en talepkâr katmanda <strong>biçimsel doğrulama</strong> (Certora Prover, KEVM, Coq, Lean) içeren katmanlı bir hattır. Büyük denetim firmaları — Trail of Bits, OpenZeppelin, ConsenSys Diligence, Spearbit, Code4rena — hepsi bu hattın varyantlarını kullanır.</p>

<p class="l-text">Bu derste doğrulama araç zincirini baştan sona tür ediyoruz, ucuz-hızlıdan (lint tarzı Slither) pahalı-derine (Certora'nın CVL özellikleri). Slither'ın ara dili (SlithIR)'in detektörlerin altında nasıl yattığını, sembolik yürütmenin EVM'de yolları nasıl keşfettiğini, <strong>Echidna</strong>'yı değişmez testi için ne benzersiz şekilde iyi yaptığını ve gerçek bir Certora kuralının ERC-4626 vault için nasıl göründüğünü inceliyoruz. Bitirme alıştırması: oyuncak Solidity AST parçacıkları üzerinde dört gerçek hata desenini — yeniden giriş (reentrancy), tx.origin, kontrol edilmemiş çağrı ve integer overflow — işaretleyen Python regex tabanlı bir statik analizör; Slither'ın temel detektörlerinin nasıl çalıştığını tam olarak gösterir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Slither'ın mimarisi: AST → SlithIR → 90+ detektör; CI'da neyi entegre etmeli</li>
<li>Mythril ve Manticore: EVM bytecode üzerinde sembolik yürütme; perdenin arkasındaki SMT solver</li>
<li>Echidna özellik tabanlı fuzzing: değişmezler, üreticiler, küçültme, kapsama güdümlü</li>
<li>Foundry değişmez testleri — modern test içi fuzzing framework'ü</li>
<li>Certora Prover ve CVL özellikleri; bir "kural seti"nin nasıl göründüğü</li>
<li>K Framework / KEVM: teorem kanıtlama için tam biçimsel EVM semantiği</li>
<li>Solidity üzerinde regex ile Python'da kendi oyuncak statik analizörünüzü inşa edin</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. Denetim Piramidi</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Katman 1: Linter / Statik (Slither)</div><div class="card-body">Her commit'te çalıştır. &lt; 1 dakika. Desen eşleştirme ile yaygın bilinen hataların %80'ini bulur.</div></div>
<div class="calc-card"><div class="card-title">Katman 2: Sembolik yürütme (Mythril, Manticore)</div><div class="card-body">PR / deploy öncesi çalıştır. Dakikalar ile saatler. Yola bağlı hataları bulur (ör. keyfi çağrı grafiğinden yeniden giriş).</div></div>
<div class="calc-card"><div class="card-title">Katman 3: Özellik fuzzing (Echidna, Foundry değişmez)</div><div class="card-body">Deploy öncesi. Saatler ile günler. Kullanıcı değişmezleri tanımlar ("toplam arz asla limiti aşmaz"); fuzzer onları kırmaya çalışır.</div></div>
<div class="calc-card"><div class="card-title">Katman 4: Biçimsel doğrulama (Certora, KEVM)</div><div class="card-body">Büyük deploy öncesi. Günler ile haftalar. Özelliklerin TÜM girdiler için (örneklenmiş değil) tutuğunu matematiksel olarak kanıtlar.</div></div>
<div class="calc-card"><div class="card-title">Katman 5: İnsan denetimi (firmalar + Code4rena/Sherlock yarışmaları)</div><div class="card-body">Daima. Haftalar. Hiçbir aracın henüz çoğaltamadığı alan içgörüsü.</div></div>
<div class="calc-card"><div class="card-title">Katman 6: Bug bounty (Immunefi)</div><div class="card-body">Deploy sonrası sürekli. Pazar onu söyler.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Slither — İş Beygiri</h2>
<p class="l-text"><strong>Slither</strong> (Trail of Bits, Feist et al., 2019), Solidity'yi AST'ye ayrıştırır, SlithIR'a (kayıt tabanlı 3-adresli IR) yükseltir ve &gt; 90 detektör çalıştırır. Echidna ve Manticore'u da üreten Crytic altyapısının üzerine inşa edilmiştir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Slither'ı programatik olarak çalıştır (gerçek ortam, solc + slither yüklü olmalı)
import subprocess, json

result = subprocess.run(
    ["slither", "MyContract.sol", "--json", "-"],
    capture_output=True, text=True
)
report = json.loads(result.stdout)

for det in report.get("results", {}).get("detectors", []):
    print(f"[{det['impact']}/{det['confidence']}] {det['check']}: {det['description'].splitlines()[0]}")

# Yaygın yüksek-etki detektörler:
#   reentrancy-eth, reentrancy-no-eth
#   uninitialized-state, uninitialized-storage
#   tx-origin, suicidal, arbitrary-send
#   unchecked-transfer, unchecked-lowlevel
#   incorrect-equality, weak-prng
#   shadowing-state, shadowing-abstract
</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) <code>subprocess.run(["slither", "MyContract.sol", "--json", "-"], capture_output=True)</code>, yüklü Slither CLI'sini çağırır ve JSON raporunu <code>stdout</code>'a yönlendirir — <code>"-"</code> argümanı çıktıyı dosya yerine stdout'a verdirir. 2) <code>json.loads(result.stdout)</code> raporu ayrıştırır; <code>results.detectors</code> altındaki yapı bir bulgu sözlüğü listesidir. 3) Döngü her bulgunun <code>impact</code> (High/Medium/Low), <code>confidence</code>, <code>check</code> (örneğin <code>reentrancy-eth</code> gibi detektör ID'si) ve <code>description</code>'ın ilk satırını çeker — CI özeti için ideal. 4) Yorumlanmış detektör listesi, herhangi bir yeni <code>reentrancy-eth</code> veya <code>tx-origin</code> bulgusunun PR'ı bloke etmesi için Husky/GitHub-Actions kapısına bağlanacak en yüksek-değer desenleri gösterir.</p>

</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Mythril ve Manticore — Sembolik Yürütme</h2>
<p class="l-text"><strong>Mythril</strong> (ConsenSys, 2017), EVM bytecode'unu alır, sembolik girdilerle ulaşılabilir her yolu yürür ve Z3 SMT solver'a sorar: "bu durumlara götüren bu değişkenlerin bir değeri var mı?" Evetse, somut bir exploit işlemi üretir. <strong>Manticore</strong> (yine Trail of Bits) daha programlanabilir kuzendir — özel sembolik keşif için Python API'si, durum filtreleri için kancalar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Güç</div><div class="card-body">Hiçbir desen eşleyicinin yakalayamayacağı yola bağlı hataları bulur — ör. "bu çağıran altında üç fonksiyon çağrısının bu kombinasyonu fon sızdırır".</div></div>
<div class="calc-card"><div class="card-title">Zayıflık</div><div class="card-body">Yol patlaması. Bilinmeyen sınırlı bir döngü veya bilinmeyen sözleşmelere dış çağrılar, durum uzayını patlatır.</div></div>
<div class="calc-card"><div class="card-title">Mythril detektörleri</div><div class="card-body">SWC-101 integer-overflow, SWC-104 unchecked-call, SWC-107 reentrancy, SWC-127 arbitrary-jump, artı 25+.</div></div>
<div class="calc-card"><div class="card-title">Gerçek dünya kullanımı</div><div class="card-body">&lt; 200 satırlık sözleşmeler için CI'da yaygın. Büyük protokoller için kritik fonksiyonlar üzerinde seçici olarak kullanılır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Echidna ve Foundry — Özellik Fuzzing</h2>
<p class="l-text"><strong>Echidna</strong> (Trail of Bits, Grieco et al., 2020), Ethereum için Haskell tabanlı bir özellik fuzzer'ıdır. <code>echidna_</code> ile başlayan, değişmez tuttuğunda <code>true</code> döndüren Solidity fonksiyonları yazarsınız; Echidna onları false döndürmeye çalışan milyonlarca rastgele çağrı dizisi üretir. Kapsama güdümlü (AFL/libFuzzer gibi), yerleşik küçültme ile.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Tipik bir Echidna testi (Solidity, bağlam için Python string olarak gösterildi)
echidna_test = """
contract VaultProperties is Vault {
    function echidna_total_supply_lte_cap() public view returns (bool) {
        return totalSupply() &lt;= MAX_SUPPLY;
    }
    function echidna_solvent() public view returns (bool) {
        return underlying.balanceOf(address(this)) &gt;= totalAssets();
    }
    function echidna_no_inflation_attack() public view returns (bool) {
        if (totalSupply() == 0) return true;
        return totalAssets() / totalSupply() &lt;= 100 ether;  // hisse fiyatı sınırı
    }
}
"""
print(echidna_test)
print("Echidna saatlerce çağrı dizilerini fuzzlar ve başarısız olan herhangi bir izi minimal bir karşı örneğe küçültür.")
</code></pre></div>

<p class="l-text"><strong>Foundry'nin değişmez testi</strong> (2022'den beri) aynı fikri modern test framework'üne taşır. <code>forge test --invariant</code> çalıştırmalarındaki <code>invariant_*</code> fonksiyonları artık üretim denetimlerinde standarttır. Foundry'nin <code>vm.assume</code>'u ve hedef/dışlama sınırları onu ergonomik yapar.</p>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Certora Prover — Ölçekte Biçimsel Doğrulama</h2>
<p class="l-text"><strong>Certora</strong> (2018'de Mooly Sagiv tarafından kuruldu, Tel Aviv) EVM biçimsel doğrulamasında endüstri lideridir. Özellikleri <strong>CVL</strong> (Certora Verification Language) ile yazarsınız; prover sözleşmeyi + spec'i SMT'ye çevirir, Z3/CVC5'e gönderir ve ya özelliği kanıtlar ya da somut bir karşı örnek döndürür. Aave, Compound, MakerDAO, Lido, Uniswap tarafından kullanılır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code># Gerçek dünya tarzı bir CVL kuralı (Python string olarak gösterildi)
cvl = """
methods {
    function totalSupply() external returns (uint256) envfree;
    function balanceOf(address) external returns (uint256) envfree;
}

// Özellik: tüm bakiyelerin toplamı toplam arza eşittir
ghost mathint sumOfBalances {
    init_state axiom sumOfBalances == 0;
}
hook Sstore _balances[KEY address u] uint256 newBal (uint256 oldBal) {
    sumOfBalances = sumOfBalances + newBal - oldBal;
}
invariant totalSupplyEqualsSum()
    to_mathint(totalSupply()) == sumOfBalances;
"""
print(cvl)
print("Bu değişmez SMT'ye derlenir ve Z3 ya kanıtlar ya da onu kıran bir tx dizisi döndürür.")
</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) <code>methods</code> bloğu <code>totalSupply()</code> ve <code>balanceOf(address)</code>'i <code>envfree</code> olarak ilan eder — prover'a bu çağrıların tx-ortamına bağlı olmadığını söyler, böylece her yerden çağırabilir. 2) <code>ghost mathint sumOfBalances</code>, <code>init_state axiom</code> ile <code>0</code>'a ilklenen bir gölge değişken tanımlar; <code>mathint</code>, EVM taşma gürültüsünü ortadan kaldıran sınırsız bir tamsayıdır. 3) <code>hook Sstore _balances[KEY address u] uint256 newBal (uint256 oldBal)</code>, <code>_balances</code> eşlemesine yapılan her storage yazımında tetiklenir ve gölgeyi günceller; böylece <code>sumOfBalances += newBal - oldBal</code> — prover bunu ulaşılabilir her duruma örer. 4) <code>invariant totalSupplyEqualsSum()</code>, her zaman <code>totalSupply() == sumOfBalances</code> şartını ister; Certora bunu Z3/CVC5'e gönderir, sonuç ya "kanıtlandı" ya da onu kıran somut bir çağrı dizisidir.</p>

</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. K Framework ve KEVM — Anlamsal Temel</h2>
<p class="l-text"><strong>K Framework</strong> (Roşu, UIUC, 2003'ten beri) programlama dili semantiklerini tanımlamak için bir meta-framework'tür. <strong>KEVM</strong> (Hildenbrandt et al., 2018) EVM'e K'da ilk tam biçimsel semantiğini verdi. KEVM ile, özellikleri Solidity düzeyinde değil EVM bytecode düzeyinde kanıtlayabilirsiniz — mümkün en güçlü garanti. Runtime Verification Inc., en yüksek riskli sözleşmeler için (UniswapV2 core, orijinal Casper FFG) KEVM tabanlı denetimler sevk eder.</p>

<div class="calc-highlight">K'nın havalılığı: EVM'i bir kez tanımlayın, yorumlayıcıyı, sembolik yürütücüyü, dedüktif doğrulayıcıyı ve test koşucuyu türetin — hepsi aynı semantikten. En saf haliyle biçimsel-yöntemler kaldıracı.</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. Bir Oyuncak Slither — Python'da Regex Detektörler</h2>
<p class="l-text">Aşağıda: Slither'ın daha basit kurallarının nasıl çalıştığını yansıtan, dört detektörlü bağımsız bir "minik statik analizör". Burada Solidity'yi tokenize etmiyoruz; kaynak üzerinde regex'e dayanıyoruz. Gerçek bir detektör SlithIR'ı yürür, ama ruh aynıdır: <em>hatalarla ilişkili sözdizimsel desenleri arayın</em>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re

def detect_reentrancy(src):
    """Aynı fonksiyon gövdesi içinde durum güncellemesinden önce dış çağrı."""
    findings = []
    for m in re.finditer(r"function\\s+(\\w+)[^{]*\\{(.*?)\\n\\}", src, re.S):
        name, body = m.group(1), m.group(2)
        # Sezgisel: .call{value:...} veya .send/.transfer ... ardından durum mutasyonu
        ext_call = re.search(r"(\\w+)\\.(call|send|transfer)\\s*\\{|\\.(call|send|transfer)\\(", body)
        state_after = re.search(r"(balances|deposits|owed)\\s*\\[[^\\]]+\\]\\s*[-+]?=", body)
        if ext_call and state_after and ext_call.start() &lt; state_after.start():
            findings.append((name, "reentrancy: external call BEFORE state update"))
    return findings

def detect_tx_origin(src):
    return [("require/if", "tx.origin used for auth")
            for _ in re.finditer(r"tx\\.origin\\s*==", src)]

def detect_unchecked_call(src):
    """call/send return değeri kontrol edilmemiş."""
    return [("low-level call", "unchecked .call return value")
            for _ in re.finditer(r"(?&lt;!=\\s)\\.call\\{[^}]*\\}\\([^)]*\\)\\s*;", src)]

def detect_unsafe_math(src):
    """0.8 öncesi Solidity'de açık checked aritmetik olmadan uint işlemleri."""
    pragma = re.search(r"pragma\\s+solidity\\s+([^;]+);", src)
    if pragma and re.search(r"0\\.[0-7]\\.", pragma.group(1)):
        if not re.search(r"using\\s+SafeMath", src):
            return [("contract", "pre-0.8 solc without SafeMath — overflow risk")]
    return []

# === Örnek hatalı sözleşme ===
src = '''
pragma solidity 0.7.0;
contract Vulnerable {
    mapping(address =&gt; uint) public balances;
    function deposit() external payable { balances[msg.sender] += msg.value; }
    function withdraw() external {
        uint amt = balances[msg.sender];
        require(tx.origin == msg.sender);             // tx.origin kötüye kullanım
        (bool ok, ) = msg.sender.call{value: amt}(""); // durum güncellemesinden ÖNCE dış çağrı
        balances[msg.sender] = 0;                      // ...durum güncellemesi de çok geç
    }
    function pay(address to, uint v) external {
        to.call{value: v}("");                          // kontrol edilmemiş çağrı
    }
}
'''

for det in [detect_reentrancy, detect_tx_origin, detect_unchecked_call, detect_unsafe_math]:
    for f in det(src):
        print(f"[!] {det.__name__}: {f}")
</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) <code>detect_reentrancy(src)</code> her <code>function ... {...}</code> gövdesini regex ile dolaşır, ardından bir <code>ext_call</code> (<code>.call/.send/.transfer</code>'a uyan herhangi bir şey) ile <code>balances</code>/<code>deposits</code>/<code>owed</code> üzerinde bir <code>state_after</code> mutasyonu bulur; çağrının başlangıç indeksi mutasyondan önceyse fonksiyon işaretlenir. 2) <code>detect_tx_origin(src)</code> yalnızca <code>tx.origin ==</code>'i tarar — klasik phishing'e açık yetkilendirme kontrolü. 3) <code>detect_unchecked_call(src)</code>, dönüş değeri bir değişkene atanmadan <code>;</code> ile biten bir <code>.call{...}(...)</code> kalıbıyla eşleşir — Solidity low-level çağrılardan <code>(bool, bytes)</code> demeti döner ve sessiz başarısızlık para kaybı demektir. 4) <code>detect_unsafe_math(src)</code>, <code>pragma solidity</code> satırını ayrıştırır; ana.alt sürüm <code>0.0.x</code> ile <code>0.7.x</code> arasındaysa ve <code>using SafeMath</code> yoksa, sözleşme bir taşma uyarısı alır. Koşucu, dört detektörü de kasten hatalı <code>Vulnerable</code> sözleşmesi üzerinde çalıştırır ve her bulguyu basar.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı oyuncak statik analizör, tarayıcıda çalışır. Solidity kaynağını her seferinde bir hatayı düzeltecek şekilde düzenlemeyi deneyin ve bulguların kaybolmasını izleyin.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import re

def scan(src):
    out = []
    if re.search(r"tx\\.origin\\s*==", src):
        out.append(("tx-origin", "auth on tx.origin"))
    if re.search(r"\\.call\\{[^}]*\\}\\([^)]*\\)\\s*;", src):
        out.append(("unchecked-call", "low-level call without return check"))
    pragma = re.search(r"pragma\\s+solidity\\s+([^;]+);", src)
    if pragma and re.search(r"0\\.[0-7]\\.", pragma.group(1)) and "SafeMath" not in src:
        out.append(("unsafe-math", "pre-0.8 solc without SafeMath"))
    # Kaba reentrancy: balances[..] -= deseninden önce dış çağrı varlığı
    for fn in re.finditer(r"function\\s+(\\w+)[^{]*\\{(.+?)\\n\\}", src, re.S):
        body = fn.group(2)
        call = re.search(r"\\.call\\{value", body)
        upd  = re.search(r"balances\\[[^\\]]+\\]\\s*=\\s*0", body)
        if call and upd and call.start() &lt; upd.start():
            out.append(("reentrancy", f"in fn {fn.group(1)}: call before state zeroing"))
    return out

src = '''
pragma solidity 0.7.0;
contract V {
  mapping(address=&gt;uint) balances;
  function w() external {
    uint a = balances[msg.sender];
    require(tx.origin == msg.sender);
    (bool ok,) = msg.sender.call{value:a}("");
    balances[msg.sender] = 0;
  }
}
'''
for f in scan(src): print("[FINDING]", f)
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Gerçek Bir Denetim Vakası — Compound v3'ün Likidasyon Hatası Nasıl Bulundu</h2>
<p class="l-text">Compound v3 (Comet, 2022 sonu) OpenZeppelin ve ChainSecurity tarafından denetlendi. Likidasyon ödülü hesaplamasında ince bir integer truncation hatası: likidasyon teminatı en küçük ondalığın 1 biriminden azken ödül sıfıra yuvarlandı, keeper bot'unun pozisyonu görmezden gelmesine neden oldu. Şunların kombinasyonu ile bulundu: Slither'ın kod kalitesi detektörü şüpheli bölmeyi işaretledi, Foundry değişmez testi ("likidatör kârı ≥ 0" küçük toz pozisyonlar için başarısız oldu), sonra insan incelemesi yuvarlama yerini saptadı. Yama: bias yönüne göre floor-veya-ceil kararı.</p>

<div class="calc-highlight">Desen: araçlar arama uzayını daraltır, insanlar yorumlar. Tek bir katman yeterli değildir — denetim piramidi her katmanın diğerlerinin kaçırdığını yakaladığı için çalışır.</div>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Özet ve Track Bitirmesi</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Denetim piramidi: linter → sembolik → fuzzing → biçimsel → insan → bounty.</li>
<li>Slither: SlithIR + 90+ detektör, hızlı, her commit'te CI'da entegre.</li>
<li>Mythril/Manticore: sembolik yürütme yola bağlı hataları bulur; yol patlaması darboğazdır.</li>
<li>Echidna + Foundry değişmez: özellik tabanlı fuzzing uzun çağrı dizilerinde hataları yakalar.</li>
<li>Certora CVL + KEVM: en yüksek riskli kod için biçimsel kanıtlar.</li>
<li>Blockchain Güvenliği track'i baştan sona: L1 temeller → L2 kriptografi → L3 mimari → L4 açıklar → L5 mutabakat → L6 L2 ölçekleme → L7 DeFi saldırıları → L8 denetim/FV.</li>
</ul>
</div>
<p class="l-text">Blockchain Güvenliği track'ini tamamladınız. Sırada: IoT Güvenliği track'i — firmware tersine mühendislik, kablosuz protokoller, ICS/SCADA ve bağlantılı araçlar.</p>
</div>`
};
