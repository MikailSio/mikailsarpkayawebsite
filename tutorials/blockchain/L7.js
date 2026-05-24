window.BLOCKCHAIN_L7 = {
en: `<p class="l-text"><strong>DeFi security is where smart-contract bugs meet real liquidity at internet scale.</strong> Decentralized finance now custodies tens of billions of dollars in pooled liquidity, and every line of Solidity is one mistake away from a headline. The defining mechanic of the era is the <strong>flash loan</strong> — uncollateralized borrowing for the duration of a single transaction, atomic-rollback if not repaid — introduced by Marble Protocol (2018) and popularized by Aave (2020). Flash loans transformed the threat model: any attacker can wield arbitrary capital for free, and any economic exploit only has to "work" for one transaction.</p>

<p class="l-text">In this lesson we dissect the canonical DeFi attack patterns: <strong>flash-loan price manipulation</strong> (bZx, Cream, Beanstalk's $182M governance attack), <strong>AMM-specific exploits</strong> (Uniswap rounding, K-invariant violations), <strong>oracle attacks</strong> (Mango Markets $114M, Inverse Finance $15M), <strong>governance attacks</strong>, and the broader <strong>MEV</strong> economy. We also cover modern defenses — <strong>circuit breakers, withdrawal queues, oracle commit-reveal, OEV-aware pricing</strong>. Capstone: a multi-step Python state-machine simulating a flash-loan price-oracle attack against a synthetic lending market.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Flash loans: atomicity guarantees, repayment in one tx, why this enables economic exploits</li>
<li>Constant-product AMMs (Uniswap v2): x · y = k, slippage, impermanent loss</li>
<li>Oracle manipulation: spot vs TWAP, Chainlink aggregation, Mango Markets case</li>
<li>Beanstalk April 2022: $182M governance attack via flash-loaned voting power</li>
<li>MEV continued: sandwich, JIT liquidity, multi-hop arbitrage, atomic CEX-DEX arb</li>
<li>Defenses: circuit breakers, slippage caps, multi-block delays, OEV auctions, monitoring (Forta)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Flash Loans — Atomicity as a Weapon</h2>
<p class="l-text">A flash loan lets a caller borrow up to the entire reserves of a pool, do anything with the funds, and repay before the transaction ends — all atomically. If repayment fails, the entire transaction reverts as if it never happened. Aave's <code>FlashLoan</code> charges 0.05% fee; dYdX charged zero. The key consequence: <strong>capital is no longer a moat</strong>. Any attacker can momentarily wield $500M to skew a price oracle, vote in governance, or manipulate an AMM curve.</p>

<div class="calc-highlight">If your contract assumes "an attacker with this much capital is unrealistic", flash loans break that assumption. Defense in depth: never gate critical actions on point-in-time token balances.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Constant-Product AMMs — The Math</h2>
<p class="l-text">Uniswap v2's invariant (Hayden Adams, 2018, building on Buterin's 2017 sketches) is the iconic equation:</p>

<div class="katex-block">$$x \\cdot y = k$$</div>

<p class="l-text">Two reserves x, y in a pool; their product k is constant across trades. To trade <code>dx</code> tokens of X in, the pool must give you <code>dy</code> tokens of Y such that <code>(x+dx) · (y-dy) = k</code>. Solving:</p>

<div class="katex-block">$$dy = y - \\frac{k}{x+dx} = \\frac{y \\cdot dx}{x + dx}$$</div>

<div class="calc-highlight">The 0.3% Uniswap fee shifts k upward each trade — LPs earn from k growing. <strong>Slippage</strong> is the difference between the marginal price y/x and the realized average — large trades get worse prices precisely because of the curve.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class CPAMM:
    def __init__(self, x, y, fee=0.003):
        self.x, self.y, self.fee = x, y, fee
    def k(self): return self.x * self.y
    def price_of_x_in_y(self): return self.y / self.x
    def swap_x_for_y(self, dx):
        dx_eff = dx * (1 - self.fee)
        dy = self.y * dx_eff / (self.x + dx_eff)
        self.x += dx; self.y -= dy
        return dy

pool = CPAMM(x=1_000_000, y=2_000_000)        # 1M USDC, 2M TKN; price 2.0 TKN/USDC
print(f"Initial price: {pool.price_of_x_in_y():.4f}, k = {pool.k():.0f}")

# Small trade: low slippage
dy_small = pool.swap_x_for_y(1_000)
print(f"  swap 1k USDC -&gt; {dy_small:.2f} TKN; new price = {pool.price_of_x_in_y():.4f}")

# Re-init for clarity
pool = CPAMM(1_000_000, 2_000_000)
# Whale trade with flash-loaned capital: huge slippage
dy_big = pool.swap_x_for_y(500_000)
print(f"  swap 500k USDC -&gt; {dy_big:.2f} TKN; new price = {pool.price_of_x_in_y():.4f}")
print(f"  effective price (avg)  = {dy_big/500_000:.4f} TKN/USDC")
print(f"  marginal price (after) = {pool.price_of_x_in_y():.4f} TKN/USDC")
</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) The <code>CPAMM</code> class stores reserves <code>x</code>, <code>y</code> and the LP fee (<code>0.003</code> = 0.3%); <code>k()</code> returns the invariant and <code>price_of_x_in_y()</code> returns the marginal spot price <code>y/x</code>. 2) <code>swap_x_for_y(dx)</code> applies the fee first (<code>dx_eff = dx * 0.997</code>), then computes <code>dy = y * dx_eff / (x + dx_eff)</code> — the exact closed-form solution of <code>(x+dx) · (y-dy) = k</code>. 3) The small 1,000-USDC swap barely moves the price (depth = 1M dwarfs the trade) — slippage is negligible. 4) The whale 500,000-USDC swap consumes a third of the X-side reserve, so the effective average price is far worse than the post-trade marginal price — exactly the slippage curve a flash-loan attacker exploits when manipulating an AMM-derived oracle.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same x·y=k pool. Try doubling the pool size and re-running the whale trade — slippage scales inversely with depth.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>def swap(x, y, dx, fee=0.003):
    dx_eff = dx * (1-fee)
    dy = y * dx_eff / (x + dx_eff)
    return x+dx, y-dy, dy

x, y = 1_000_000, 2_000_000
print(f"depth (x*y) = {x*y:,}, init price = {y/x:.3f}")
for dx in [1_000, 10_000, 100_000, 500_000]:
    nx, ny, dy = swap(x, y, dx)
    eff = dy/dx
    spot = ny/nx
    print(f"  swap {dx:7,} -&gt; receive {dy:10.2f}  eff_price={eff:.4f} new_spot={spot:.4f}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Beanstalk Governance Attack — April 2022, $182M</h2>
<p class="l-text">Beanstalk Farms ran an algorithmic stablecoin governed by token holders. April 17, 2022: an attacker took an Aave flash loan of ~$1B in stablecoins, swapped most of it into Beanstalk's BEAN governance tokens, used those tokens to vote in a malicious "emergency commit" governance proposal that drained the protocol's treasury, then unwound the flash loan and walked away with $182M. The vulnerability was not a bug in Solidity — the contract worked exactly as designed. The vulnerability was that <em>governance voting power was a function of point-in-time token holdings, with no time-lock, with proposals executable instantly</em>.</p>

<div class="calc-highlight">The fix landed industry-wide afterwards: governance time-locks (Compound's Timelock contract pattern), token-holder snapshots at proposal-submission time (so flash loans can't be used to acquire voting power for a vote already in progress), multi-block voting windows that exceed any single transaction.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Mango Markets — Oracle Manipulation, $114M (Oct 2022)</h2>
<p class="l-text">Avraham Eisenberg manipulated the price of Mango's MNGO perpetual on Solana by simultaneously buying it on Mango with one wallet and selling against it on the same exchange with another. The internal oracle (which used the perpetual's own market price) reflected the manipulation, his collateral on a third wallet was suddenly "worth" $400M, and he borrowed/withdrew $114M of other assets against it. Legal saga ensued; he was convicted in April 2024 of fraud.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spot oracle on internal market</div><div class="card-body">If your collateral price = your own thin market = manipulable. Always read external Chainlink/TWAP for collateral.</div></div>
<div class="calc-card"><div class="card-title">Self-referential</div><div class="card-body">When the asset being borrowed against is the asset whose price determines collateral, you have a circular dependency.</div></div>
<div class="calc-card"><div class="card-title">Defense: cross-validate</div><div class="card-body">Two independent oracles, deviation threshold (revert if &gt; 2% disagreement), TWAP fallback.</div></div>
<div class="calc-card"><div class="card-title">Defense: borrow caps</div><div class="card-body">Cap borrowable per asset to a fraction of true external liquidity — Mango had no such cap on MNGO.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Cream Finance Iron Bank — Oct 2021, $130M</h2>
<p class="l-text">A textbook flash-loan oracle exploit. Cream's collateral price for yUSD vault tokens was derived from Yearn vault share-price, which was derived from Curve pool reserves. Attacker flash-loaned, donated to the vault to inflate share-price, borrowed against the now-overvalued vault tokens, repaid the loan. <strong>$130M out</strong>. The fix: never accept oracle prices that can be moved within a single transaction; always require X-block delay on price updates used for liquidations.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Multi-Step Flash-Loan Attack in Python</h2>
<p class="l-text">Below: a synthetic lending market that uses spot price from a Uniswap-style pool as oracle. Attacker flash-loans $500k USDC, pumps the price of TKN, deposits TKN as collateral at the inflated price, borrows USDC against it, dumps the TKN, repays the flash loan. Profit walks out.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class Pool:
    def __init__(self, x, y, fee=0.003):
        self.x = x; self.y = y; self.fee = fee
    def price_y_per_x(self): return self.y / self.x
    def swap_x_in(self, dx):
        eff = dx*(1-self.fee); dy = self.y*eff/(self.x+eff)
        self.x += dx; self.y -= dy; return dy
    def swap_y_in(self, dy):
        eff = dy*(1-self.fee); dx = self.x*eff/(self.y+eff)
        self.y += dy; self.x -= dx; return dx

class LendingMarket:
    """Naively reads spot from pool as TKN/USDC price."""
    def __init__(self, pool, ltv=0.75):
        self.pool = pool; self.ltv = ltv
        self.collateral_tkn = 0; self.borrowed_usdc = 0
    def deposit_collateral_tkn(self, amount): self.collateral_tkn += amount
    def borrow_usdc(self, amount):
        # value of collateral in USDC at SPOT price
        spot = self.pool.price_y_per_x()           # USDC per TKN (here y is USDC)
        max_borrow = self.collateral_tkn * spot * self.ltv
        if self.borrowed_usdc + amount &gt; max_borrow:
            raise ValueError("under-collateralized")
        self.borrowed_usdc += amount; return amount

# Set up: pool = 1M TKN, 2M USDC; market reads price = 2 USDC/TKN
pool   = Pool(x=1_000_000, y=2_000_000)
market = LendingMarket(pool, ltv=0.75)

# Attacker starts with 50 TKN of own funds
attacker_tkn  = 50
attacker_usdc = 0

# === ATTACK ===
# 1. Flash loan 500k USDC
flash = 500_000; attacker_usdc += flash
# 2. Pump price: swap USDC into pool to mint TKN very expensively
got_tkn = pool.swap_y_in(flash)             # but pool is x=TKN, y=USDC; this lifts USDC price
attacker_tkn  += got_tkn
attacker_usdc -= flash
print(f"After pump:   pool spot = {pool.price_y_per_x():.4f} USDC/TKN, attacker tkn = {attacker_tkn:.2f}")
# 3. Deposit attacker's TKN as collateral, borrow USDC at inflated price
market.deposit_collateral_tkn(attacker_tkn)
borrowed = market.borrow_usdc(attacker_tkn * pool.price_y_per_x() * 0.74)
attacker_usdc += borrowed
print(f"Borrowed:     {borrowed:,.2f} USDC against inflated collateral")
# 4. Sell TKN back into the pool to recover USDC (and de-pump)
recovered = pool.swap_x_in(attacker_tkn)
attacker_usdc += recovered
attacker_tkn   = 0
# 5. Repay flash loan
attacker_usdc -= flash
print(f"\\nFinal attacker USDC: {attacker_usdc:,.2f}  (started with 0)")
print(f"Pool spot after: {pool.price_y_per_x():.4f}  (close to 2.0 again)")
print(f"Lending market is now under-collateralized — bad debt.")
</code></pre></div>
<p class="l-text"><strong>Step by step:</strong> 1) Setup: <code>Pool(1M TKN, 2M USDC)</code> gives <code>price_y_per_x = 2.0</code>; the naive <code>LendingMarket</code> reads that spot price to value any TKN collateral at 75% LTV. 2) Pump phase: the attacker calls <code>pool.swap_y_in(500_000)</code> — pushing 500k USDC into the pool drains its TKN side and lifts <code>price_y_per_x</code> well above 2.0; the attacker now also holds the <code>got_tkn</code> they received. 3) Drain phase: <code>market.deposit_collateral_tkn(attacker_tkn)</code> followed by <code>market.borrow_usdc(...)</code> — because the market reads the now-inflated spot, the borrow limit is enormous compared to honest valuation. 4) Unwind: <code>pool.swap_x_in(attacker_tkn)</code> dumps the TKN back, restoring spot to ~2.0; subtract <code>flash</code> for repayment and the residual <code>attacker_usdc</code> is pure profit — meanwhile the lending market is left holding TKN collateral worth far less than the USDC it lent out.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Same flash-loan price-oracle attack. Try changing flash amount or LTV; small pool depth = catastrophic borrow.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class P:
    def __init__(s,x,y,f=0.003): s.x=x;s.y=y;s.f=f
    def spot(s): return s.y/s.x
    def yin(s,dy):
        e=dy*(1-s.f); dx=s.x*e/(s.y+e); s.y+=dy; s.x-=dx; return dx
    def xin(s,dx):
        e=dx*(1-s.f); dy=s.y*e/(s.x+e); s.x+=dx; s.y-=dy; return dy

p = P(1_000_000, 2_000_000)
print("init spot:", p.spot())
flash = 500_000
# pump
got = p.yin(flash); print(f"after pump spot={p.spot():.3f} got_tkn={got:.1f}")
# borrow at inflated spot
ltv = 0.75
borrowed = got * p.spot() * ltv * 0.99   # leave a hair of buffer
# unpump
recovered = p.xin(got)
profit = borrowed + recovered - flash
print(f"borrowed={borrowed:.2f}  recovered={recovered:.2f}  flash_repay={flash}  PROFIT={profit:.2f}")
print(f"final spot={p.spot():.3f}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. MEV in 2026 — Sandwiches, JIT, CEX-DEX</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sandwich</div><div class="card-body">See victim's swap in mempool → buy in front → let victim's swap fill at worse price → sell behind. Mitigated by Flashbots Protect, CowSwap.</div></div>
<div class="calc-card"><div class="card-title">JIT Liquidity</div><div class="card-body">Provide concentrated Uniswap v3 liquidity right before a large swap and remove it immediately after — capture fees with zero IL exposure.</div></div>
<div class="calc-card"><div class="card-title">CEX-DEX arbitrage</div><div class="card-body">Binance price moves → DEX price stale → searcher arbs in same block. Largest single MEV category in 2024.</div></div>
<div class="calc-card"><div class="card-title">Atomic chained arb</div><div class="card-body">Walk a cycle of pools (USDC → ETH → WBTC → USDC) where rates differ; close cycle profitably in one tx.</div></div>
<div class="calc-card"><div class="card-title">Mitigation: PBS</div><div class="card-body">Proposer-Builder Separation (post-Merge). Builders construct blocks privately; proposers pick the highest-bid block. Reduces validator-extracted MEV.</div></div>
<div class="calc-card"><div class="card-title">Mitigation: encrypted mempool</div><div class="card-body">Threshold-encrypted txs revealed only post-ordering (Shutter Network, SUAVE). Active research as of 2026.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Defenses Cheat-Sheet</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>Never use spot price from a thin pool as oracle. Use Chainlink + TWAP + cross-validation.</li>
<li>Borrow caps per asset, capped to fraction of external liquidity.</li>
<li>Governance: token-holder snapshots at proposal-submit, time-locks (Compound Timelock pattern), multi-block voting.</li>
<li>Critical price actions never gated on point-in-time balance — multi-block delays.</li>
<li>Circuit breakers: pause all withdrawals on anomalous TVL drop or oracle deviation.</li>
<li>Withdrawal queues: large exits delayed and revocable.</li>
<li>Monitoring (Forta agents, Hexagate, Trail of Bits Slither-CI) — anomaly alerts on-chain.</li>
<li>Bug bounty (Immunefi, &gt; $10M Aave/Lido programs) before mainnet.</li>
</ol>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; What's Next</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 KEY TAKEAWAYS</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Flash loans erase capital as a moat — every economic exploit can be flash-loan-funded.</li>
<li>Constant-product AMM: x·y=k. Slippage is real and exploitable.</li>
<li>Beanstalk: $182M from a single transaction's governance vote with flash-loaned voting power.</li>
<li>Mango/Cream: spot-price oracles = single point of failure; cross-validate.</li>
<li>MEV is industrial — sandwiches, JIT, CEX-DEX arb. PBS and encrypted mempools are mitigations.</li>
</ul>
</div>
<p class="l-text">Next, the capstone: <strong>blockchain-L8</strong> — smart-contract auditing with Slither, Mythril, Echidna, and formal verification with Certora and the K framework.</p>
</div>`,
tr: `<p class="l-text"><strong>DeFi güvenliği, akıllı sözleşme hatalarının internet ölçeğinde gerçek likiditeyle buluştuğu yerdir.</strong> Merkeziyetsiz finans şu anda havuzlanmış likidite olarak onlarca milyar doları emanet alıyor ve her Solidity satırı tek bir hatayla manşetten gidebilir. Çağın belirleyici mekaniği <strong>flash loan</strong>'dur — tek bir işlem süresince teminatsız borçlanma, geri ödenmezse atomik geri alma — Marble Protocol (2018) tarafından tanıtıldı ve Aave (2020) tarafından popülerleştirildi. Flash loan'lar tehdit modelini dönüştürdü: herhangi bir saldırgan bedavaya keyfi sermayeyi kullanabilir ve herhangi bir ekonomik exploit'in yalnızca bir işlem için "çalışması" yeterlidir.</p>

<p class="l-text">Bu derste kanonik DeFi saldırı desenlerini parçalıyoruz: <strong>flash-loan fiyat manipülasyonu</strong> (bZx, Cream, Beanstalk'un 182 milyon dolarlık yönetişim saldırısı), <strong>AMM'e özgü exploit'ler</strong> (Uniswap yuvarlama, K-değişmezliği ihlalleri), <strong>oracle saldırıları</strong> (Mango Markets 114 milyon dolar, Inverse Finance 15 milyon dolar), <strong>yönetişim saldırıları</strong> ve daha geniş <strong>MEV</strong> ekonomisi. Modern savunmaları da ele alıyoruz — <strong>devre kesiciler, çekme kuyrukları, oracle commit-reveal, OEV-farkında fiyatlama</strong>. Bitirme: sentetik bir kredi pazarına karşı flash-loan fiyat-oracle saldırısını simüle eden çok adımlı bir Python durum makinesi.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Flash loan'lar: atomiklik garantileri, tek tx'te geri ödeme, neden bunun ekonomik exploit'leri etkinleştirdiği</li>
<li>Sabit-çarpım AMM'ler (Uniswap v2): x · y = k, kayma, kalıcı zarar</li>
<li>Oracle manipülasyonu: spot vs TWAP, Chainlink toplama, Mango Markets vakası</li>
<li>Beanstalk Nisan 2022: flash-loan oy gücü ile 182 milyon dolarlık yönetişim saldırısı</li>
<li>MEV devamı: sandviç, JIT likidite, çoklu sıçrama arbitrajı, atomik CEX-DEX arb</li>
<li>Savunmalar: devre kesiciler, kayma sınırları, çoklu blok gecikmeleri, OEV açık artırmaları, izleme (Forta)</li>
</ul>
</div>

<div class="lesson-block" id="section-1-tr">
<h2 class="lesson-title">1. Flash Loan'lar — Silah Olarak Atomiklik</h2>
<p class="l-text">Bir flash loan, çağıranın bir havuzun tüm rezervlerine kadar ödünç almasına, fonlarla istediğini yapmasına ve işlem bitmeden geri ödemesine izin verir — hepsi atomik. Geri ödeme başarısız olursa, tüm işlem sanki hiç olmamış gibi geri alınır. Aave'nin <code>FlashLoan</code>'u %0.05 ücret alır; dYdX sıfır ücret alıyordu. Anahtar sonuç: <strong>sermaye artık bir hendek değil</strong>. Herhangi bir saldırgan bir fiyat oracle'ını çarpıtmak, yönetişimde oy kullanmak veya bir AMM eğrisini manipüle etmek için kısa süreliğine 500 milyon doları kullanabilir.</p>

<div class="calc-highlight">Sözleşmeniz "bu kadar sermayesi olan bir saldırgan gerçekçi değil" varsayıyorsa, flash loan'lar bu varsayımı kırar. Derinlemesine savunma: kritik aksiyonları asla nokta-zaman token bakiyelerine bağlamayın.</div>
</div>

<div class="lesson-block" id="section-2-tr">
<h2 class="lesson-title">2. Sabit-Çarpım AMM'ler — Matematik</h2>
<p class="l-text">Uniswap v2'nin değişmezliği (Hayden Adams, 2018, Buterin'in 2017 taslakları üzerine inşa edildi) ikonik denklemdir:</p>

<div class="katex-block">$$x \\cdot y = k$$</div>

<p class="l-text">Bir havuzda iki rezerv x, y; çarpımları k işlemler boyunca sabittir. Havuza <code>dx</code> X tokenı koymak için, havuzun size <code>(x+dx) · (y-dy) = k</code> olacak şekilde <code>dy</code> Y tokenı vermesi gerekir. Çözerek:</p>

<div class="katex-block">$$dy = y - \\frac{k}{x+dx} = \\frac{y \\cdot dx}{x + dx}$$</div>

<div class="calc-highlight">%0.3'lük Uniswap ücreti her takasta k'yı yukarı kaydırır — LP'ler büyüyen k'dan kazanır. <strong>Kayma (slippage)</strong>, marjinal fiyat y/x ile gerçekleşen ortalama arasındaki farktır — büyük işlemler tam olarak eğri yüzünden daha kötü fiyat alır.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>import numpy as np

class CPAMM:
    def __init__(self, x, y, fee=0.003):
        self.x, self.y, self.fee = x, y, fee
    def k(self): return self.x * self.y
    def price_of_x_in_y(self): return self.y / self.x
    def swap_x_for_y(self, dx):
        dx_eff = dx * (1 - self.fee)
        dy = self.y * dx_eff / (self.x + dx_eff)
        self.x += dx; self.y -= dy
        return dy

pool = CPAMM(x=1_000_000, y=2_000_000)        # 1M USDC, 2M TKN; fiyat 2.0 TKN/USDC
print(f"Initial price: {pool.price_of_x_in_y():.4f}, k = {pool.k():.0f}")

# Küçük işlem: düşük kayma
dy_small = pool.swap_x_for_y(1_000)
print(f"  swap 1k USDC -&gt; {dy_small:.2f} TKN; new price = {pool.price_of_x_in_y():.4f}")

# Açıklık için yeniden başlat
pool = CPAMM(1_000_000, 2_000_000)
# Flash-loan sermayeli balina işlemi: muazzam kayma
dy_big = pool.swap_x_for_y(500_000)
print(f"  swap 500k USDC -&gt; {dy_big:.2f} TKN; new price = {pool.price_of_x_in_y():.4f}")
print(f"  effective price (avg)  = {dy_big/500_000:.4f} TKN/USDC")
print(f"  marginal price (after) = {pool.price_of_x_in_y():.4f} TKN/USDC")
</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) <code>CPAMM</code> sınıfı rezervleri <code>x</code>, <code>y</code> ve LP ücretini (<code>0.003</code> = %0.3) tutar; <code>k()</code> değişmezi, <code>price_of_x_in_y()</code> ise marjinal spot fiyatı <code>y/x</code>'i döndürür. 2) <code>swap_x_for_y(dx)</code> önce ücreti uygular (<code>dx_eff = dx * 0.997</code>), ardından <code>dy = y * dx_eff / (x + dx_eff)</code>'yi hesaplar — bu, <code>(x+dx) · (y-dy) = k</code>'nın kapalı-form çözümüdür. 3) Küçük 1.000-USDC takası fiyatı neredeyse hiç hareket ettirmez (derinlik = 1M, işlemi cüceleştirir) — kayma ihmal edilebilir. 4) Balina 500.000-USDC takası X-tarafı rezervinin üçte birini tüketir, dolayısıyla efektif ortalama fiyat işlem-sonrası marjinal fiyattan çok daha kötüdür — tam olarak flash-loan saldırganının AMM-türevi bir oracle'ı manipüle ederken sömürdüğü kayma eğrisidir.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı x·y=k havuz. Havuz boyutunu iki katına çıkarıp balina işlemini yeniden çalıştırmayı deneyin — kayma derinlikle ters orantılıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>def swap(x, y, dx, fee=0.003):
    dx_eff = dx * (1-fee)
    dy = y * dx_eff / (x + dx_eff)
    return x+dx, y-dy, dy

x, y = 1_000_000, 2_000_000
print(f"depth (x*y) = {x*y:,}, init price = {y/x:.3f}")
for dx in [1_000, 10_000, 100_000, 500_000]:
    nx, ny, dy = swap(x, y, dx)
    eff = dy/dx
    spot = ny/nx
    print(f"  swap {dx:7,} -&gt; receive {dy:10.2f}  eff_price={eff:.4f} new_spot={spot:.4f}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-3-tr">
<h2 class="lesson-title">3. Beanstalk Yönetişim Saldırısı — Nisan 2022, 182 Milyon Dolar</h2>
<p class="l-text">Beanstalk Farms, token sahipleri tarafından yönetilen algoritmik bir stablecoin işletiyordu. 17 Nisan 2022: Bir saldırgan ~1 milyar dolar stablecoin'lik bir Aave flash loan aldı, çoğunu Beanstalk'un BEAN yönetişim tokenlarına çevirdi, bu tokenları protokolün hazinesini boşaltan kötü niyetli bir "acil durum commit" yönetişim önerisinde oy kullanmak için kullandı, sonra flash loan'u kapattı ve 182 milyon dolarla yürüdü. Açık Solidity'de bir hata değildi — sözleşme tam olarak tasarlandığı gibi çalıştı. Açık şuydu: <em>yönetişim oy gücü, zaman kilidi olmayan, anlık yürütülebilir önerilerle, nokta-zamanda token tutmaların bir fonksiyonuydu</em>.</p>

<div class="calc-highlight">Düzeltme sonradan endüstri çapında geldi: yönetişim zaman kilitleri (Compound'un Timelock sözleşme deseni), öneri-gönderme zamanında token sahibi snapshot'ları (böylece flash loan'lar zaten devam eden bir oy için oy gücü edinmek için kullanılamaz), tek bir işlemi aşan çoklu blok oylama pencereleri.</div>
</div>

<div class="lesson-block" id="section-4-tr">
<h2 class="lesson-title">4. Mango Markets — Oracle Manipülasyonu, 114 Milyon Dolar (Eki 2022)</h2>
<p class="l-text">Avraham Eisenberg, Solana üzerindeki Mango'nun MNGO perpetual'ının fiyatını, bir cüzdanla Mango'da satın alıp aynı borsada başka bir cüzdanla ona karşı satarak aynı anda manipüle etti. Dahili oracle (perpetual'ın kendi piyasa fiyatını kullanan) manipülasyonu yansıttı, üçüncü bir cüzdandaki teminatı birden 400 milyon dolar "değerinde" oldu ve buna karşılık 114 milyon dolarlık başka varlıkları ödünç alıp çekti. Hukuki saga başladı; Nisan 2024'te dolandırıcılıktan mahkûm edildi.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dahili pazardan spot oracle</div><div class="card-body">Teminat fiyatınız = kendi ince pazarınız ise = manipüle edilebilir. Teminat için daima dış Chainlink/TWAP okuyun.</div></div>
<div class="calc-card"><div class="card-title">Öz-referanslı</div><div class="card-body">Karşılığında borçlanılan varlık, fiyatı teminatı belirleyen varlıksa, döngüsel bağımlılığınız vardır.</div></div>
<div class="calc-card"><div class="card-title">Savunma: çapraz doğrulama</div><div class="card-body">İki bağımsız oracle, sapma eşiği (&gt; %2 anlaşmazlıkta revert), TWAP yedek.</div></div>
<div class="calc-card"><div class="card-title">Savunma: borçlanma sınırları</div><div class="card-body">Varlık başına borçlanılabiliri gerçek dış likiditenin bir kesrine sınırlayın — Mango'nun MNGO üzerinde böyle bir sınırı yoktu.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5-tr">
<h2 class="lesson-title">5. Cream Finance Iron Bank — Eki 2021, 130 Milyon Dolar</h2>
<p class="l-text">Ders kitabı flash-loan oracle exploit'i. Cream'in yUSD vault tokenları için teminat fiyatı, Curve havuz rezervlerinden türetilen Yearn vault hisse fiyatından türetildi. Saldırgan flash-loan aldı, hisse fiyatını şişirmek için vault'a bağışta bulundu, şimdi aşırı değerli vault tokenlarına karşı borç aldı, krediyi geri ödedi. <strong>130 milyon dolar dışarı.</strong> Düzeltme: tek bir işlem içinde hareket ettirilebilen oracle fiyatlarını asla kabul etmeyin; likidasyonlar için kullanılan fiyat güncellemelerinde daima X-blok gecikmesi gerektirin.</p>
</div>

<div class="lesson-block" id="section-6-tr">
<h2 class="lesson-title">6. Python'da Çok Adımlı Flash-Loan Saldırısı</h2>
<p class="l-text">Aşağıda: Uniswap tarzı bir havuzdan spot fiyatı oracle olarak kullanan sentetik bir kredi pazarı. Saldırgan 500 bin dolar USDC flash-loan alır, TKN fiyatını pompalar, TKN'yi şişirilmiş fiyattan teminat olarak yatırır, karşılığında USDC ödünç alır, TKN'yi atar, flash loan'u geri öder. Kâr yürür.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class Pool:
    def __init__(self, x, y, fee=0.003):
        self.x = x; self.y = y; self.fee = fee
    def price_y_per_x(self): return self.y / self.x
    def swap_x_in(self, dx):
        eff = dx*(1-self.fee); dy = self.y*eff/(self.x+eff)
        self.x += dx; self.y -= dy; return dy
    def swap_y_in(self, dy):
        eff = dy*(1-self.fee); dx = self.x*eff/(self.y+eff)
        self.y += dy; self.x -= dx; return dx

class LendingMarket:
    """Havuzdan spot'u TKN/USDC fiyatı olarak naif şekilde okur."""
    def __init__(self, pool, ltv=0.75):
        self.pool = pool; self.ltv = ltv
        self.collateral_tkn = 0; self.borrowed_usdc = 0
    def deposit_collateral_tkn(self, amount): self.collateral_tkn += amount
    def borrow_usdc(self, amount):
        # teminatın USDC cinsinden değeri SPOT fiyatta
        spot = self.pool.price_y_per_x()           # TKN başına USDC (burada y USDC)
        max_borrow = self.collateral_tkn * spot * self.ltv
        if self.borrowed_usdc + amount &gt; max_borrow:
            raise ValueError("under-collateralized")
        self.borrowed_usdc += amount; return amount

# Kurulum: havuz = 1M TKN, 2M USDC; pazar fiyatı 2 USDC/TKN olarak okur
pool   = Pool(x=1_000_000, y=2_000_000)
market = LendingMarket(pool, ltv=0.75)

# Saldırgan kendi 50 TKN ile başlar
attacker_tkn  = 50
attacker_usdc = 0

# === SALDIRI ===
# 1. 500k USDC flash loan
flash = 500_000; attacker_usdc += flash
# 2. Fiyatı pompala: USDC'yi havuza takas et, böylece TKN çok pahalı basılır
got_tkn = pool.swap_y_in(flash)             # ama havuz x=TKN, y=USDC; bu USDC fiyatını yükseltir
attacker_tkn  += got_tkn
attacker_usdc -= flash
print(f"After pump:   pool spot = {pool.price_y_per_x():.4f} USDC/TKN, attacker tkn = {attacker_tkn:.2f}")
# 3. Saldırganın TKN'sini teminat olarak yatır, şişirilmiş fiyattan USDC ödünç al
market.deposit_collateral_tkn(attacker_tkn)
borrowed = market.borrow_usdc(attacker_tkn * pool.price_y_per_x() * 0.74)
attacker_usdc += borrowed
print(f"Borrowed:     {borrowed:,.2f} USDC against inflated collateral")
# 4. TKN'yi havuza geri sat (pompayı geri çek)
recovered = pool.swap_x_in(attacker_tkn)
attacker_usdc += recovered
attacker_tkn   = 0
# 5. Flash loan'u geri öde
attacker_usdc -= flash
print(f"\\nFinal attacker USDC: {attacker_usdc:,.2f}  (started with 0)")
print(f"Pool spot after: {pool.price_y_per_x():.4f}  (close to 2.0 again)")
print(f"Lending market is now under-collateralized — bad debt.")
</code></pre></div>
<p class="l-text"><strong>Adım adım:</strong> 1) Kurulum: <code>Pool(1M TKN, 2M USDC)</code> <code>price_y_per_x = 2.0</code> verir; naif <code>LendingMarket</code>, herhangi bir TKN teminatını %75 LTV ile bu spot fiyat üzerinden değerler. 2) Pompalama fazı: saldırgan <code>pool.swap_y_in(500_000)</code> çağırır — havuza 500k USDC sürmek TKN tarafını boşaltır ve <code>price_y_per_x</code>'i 2.0'ın çok üstüne çıkarır; saldırgan ayrıca aldığı <code>got_tkn</code>'i de elinde tutar. 3) Boşaltma fazı: <code>market.deposit_collateral_tkn(attacker_tkn)</code> ardından <code>market.borrow_usdc(...)</code> — pazar şişirilmiş spot'u okuduğundan, borçlanma limiti dürüst değerlemeye kıyasla devasadır. 4) Geri sarma: <code>pool.swap_x_in(attacker_tkn)</code> TKN'yi havuza geri atar, spot'u ~2.0'a geri getirir; <code>flash</code>'i geri ödeme için düşün ve kalan <code>attacker_usdc</code> saf kâr olur — bu arada kredi pazarı, verdiği USDC'den çok daha az değere sahip TKN teminatıyla baş başa kalır.</p>


<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aynı flash-loan fiyat-oracle saldırısı. Flash miktarını veya LTV'yi değiştirmeyi deneyin; küçük havuz derinliği = felaket borçlanma.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code>class P:
    def __init__(s,x,y,f=0.003): s.x=x;s.y=y;s.f=f
    def spot(s): return s.y/s.x
    def yin(s,dy):
        e=dy*(1-s.f); dx=s.x*e/(s.y+e); s.y+=dy; s.x-=dx; return dx
    def xin(s,dx):
        e=dx*(1-s.f); dy=s.y*e/(s.x+e); s.x+=dx; s.y-=dy; return dy

p = P(1_000_000, 2_000_000)
print("init spot:", p.spot())
flash = 500_000
# pompala
got = p.yin(flash); print(f"after pump spot={p.spot():.3f} got_tkn={got:.1f}")
# şişirilmiş spot'ta borçlan
ltv = 0.75
borrowed = got * p.spot() * ltv * 0.99   # bir tutam tampon bırak
# pompayı geri çek
recovered = p.xin(got)
profit = borrowed + recovered - flash
print(f"borrowed={borrowed:.2f}  recovered={recovered:.2f}  flash_repay={flash}  PROFIT={profit:.2f}")
print(f"final spot={p.spot():.3f}")
</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-7-tr">
<h2 class="lesson-title">7. 2026'da MEV — Sandviçler, JIT, CEX-DEX</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sandviç</div><div class="card-body">Mempool'da kurbanın takasını gör → önüne geç → kurbanın takasının daha kötü fiyatta dolmasına izin ver → arkadan sat. Flashbots Protect, CowSwap ile azaltılır.</div></div>
<div class="calc-card"><div class="card-title">JIT Likidite</div><div class="card-body">Büyük bir takastan hemen önce yoğunlaşmış Uniswap v3 likiditesi sağla ve hemen sonra çıkar — sıfır IL maruziyetiyle ücret yakala.</div></div>
<div class="calc-card"><div class="card-title">CEX-DEX arbitrajı</div><div class="card-body">Binance fiyatı hareket eder → DEX fiyatı eski → araştırmacı aynı blokta arbitraj yapar. 2024'te en büyük tek MEV kategorisi.</div></div>
<div class="calc-card"><div class="card-title">Atomik zincirli arb</div><div class="card-body">Oranların farklı olduğu havuzlar döngüsünü yürü (USDC → ETH → WBTC → USDC); döngüyü tek tx'te kârlı kapat.</div></div>
<div class="calc-card"><div class="card-title">Azaltım: PBS</div><div class="card-body">Proposer-Builder Separation (Merge sonrası). Builder'lar blokları özel olarak inşa eder; teklif edenler en yüksek teklifli bloğu seçer. Doğrulayıcı tarafından çıkarılan MEV'i azaltır.</div></div>
<div class="calc-card"><div class="card-title">Azaltım: şifreli mempool</div><div class="card-body">Yalnızca sıralama sonrası açıklanan eşik şifreli tx'ler (Shutter Network, SUAVE). 2026 itibarıyla aktif araştırma.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8-tr">
<h2 class="lesson-title">8. Savunmalar Hatırlatma Kartı</h2>
<ol style="line-height:1.7;padding-left:1.4rem">
<li>İnce bir havuzdan spot fiyatı oracle olarak asla kullanmayın. Chainlink + TWAP + çapraz doğrulama kullanın.</li>
<li>Varlık başına borçlanma sınırları, dış likiditenin bir kesriyle sınırlı.</li>
<li>Yönetişim: öneri-gönderimde token sahibi snapshot'ları, zaman kilitleri (Compound Timelock deseni), çoklu blok oylama.</li>
<li>Kritik fiyat aksiyonları nokta-zaman bakiyesine asla bağlı değil — çoklu blok gecikmeleri.</li>
<li>Devre kesiciler: anormal TVL düşüşü veya oracle sapmasında tüm çekmeleri duraklatın.</li>
<li>Çekme kuyrukları: büyük çıkışlar geciktirilmiş ve iptal edilebilir.</li>
<li>İzleme (Forta agent'leri, Hexagate, Trail of Bits Slither-CI) — zincir üzerinde anomali uyarıları.</li>
<li>Mainnet öncesi bug bounty (Immunefi, Aave/Lido programları &gt; 10 milyon dolar).</li>
</ol>
</div>

<div class="lesson-block" id="section-9-tr">
<h2 class="lesson-title">9. Özet ve Sıradaki</h2>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 ANAHTAR ÇIKARIMLAR</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Flash loan'lar sermayeyi hendek olmaktan çıkarır — her ekonomik exploit flash-loan ile finanse edilebilir.</li>
<li>Sabit-çarpım AMM: x·y=k. Kayma gerçek ve sömürülebilir.</li>
<li>Beanstalk: tek bir işlemin yönetişim oyundan flash-loan oy gücüyle 182 milyon dolar.</li>
<li>Mango/Cream: spot-fiyat oracle'ları = tek hata noktası; çapraz doğrulayın.</li>
<li>MEV endüstriyeldir — sandviçler, JIT, CEX-DEX arb. PBS ve şifreli mempool'lar azaltımdır.</li>
</ul>
</div>
<p class="l-text">Sıradaki, bitirme: <strong>blockchain-L8</strong> — Slither, Mythril, Echidna, Foundry ile akıllı sözleşme denetimi ve Certora ile K framework ile biçimsel doğrulama.</p>
</div>`
};
