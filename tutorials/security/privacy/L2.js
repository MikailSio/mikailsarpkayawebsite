window.PRIVACY_L2 = {
en: `<p class="l-text">Lesson 1 gave you the contract: any DP mechanism must satisfy ε-DP or (ε,δ)-DP. Now you need a toolbox of <em>actual</em> mechanisms — primitives you can compose into queries, ML training loops, and entire data products. This lesson is the toolbox. By the end you will know which primitive to reach for given a query type (numeric, categorical, top-k, threshold), how to set its noise scale, and how to compose them with privacy accountants like Renyi DP and zero-concentrated DP (zCDP).</p>
<p class="l-text">Each primitive comes from a 2006-2016 era paper that opened a research subfield. Laplace (Dwork-McSherry-Nissim-Smith 2006) — the workhorse for numeric queries. Gaussian via Renyi DP (Mironov 2017) — the foundation of DP-SGD. Exponential (McSherry-Talwar 2007) — selecting a discrete winner. Report Noisy Max (Bun-Steinke 2016) — top-1 selection without paying for the whole histogram. Sparse Vector Technique (Hardt-Rothblum 2010) — answer many queries while only paying for the ones above threshold. RAPPOR (Erlingsson-Pihur-Korolova 2014) — Google's local-DP randomized response. Each has a Pyodide demo.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Laplace mechanism — pure ε-DP for L1-bounded numeric queries</li>
<li>Gaussian mechanism + Renyi DP / zCDP — the math behind tight composition</li>
<li>Exponential mechanism — DP selection over discrete options</li>
<li>Report Noisy Max — finding the top item efficiently</li>
<li>Sparse Vector Technique — answering streams of threshold queries</li>
<li>RAPPOR + randomized response — local DP for client-side data collection</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. The Laplace Mechanism — Deeper</h2>
<p class="l-text">The Laplace distribution Lap(b) has density (1/2b)·exp(-|x|/b), variance 2b². It is "double exponential" — heavy-tailed compared to Gaussian, which is exactly why it gives <strong>pure</strong> ε-DP (no δ): the ratio of densities at any two points x, x' satisfies |log(p(x)/p(x'))| ≤ |x-x'|/b deterministically.</p>
<div class="katex-block">$$M(D) = f(D) + \\text{Lap}(\\Delta_1 f / \\varepsilon)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># DP histogram of churn customers grouped by tenure bucket</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'tenure_bucket'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">12</span>,<span class="num">24</span>,<span class="num">48</span>,<span class="num">200</span>],
                              labels=[<span class="str">'0-1y'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>])
hist = df.<span class="fn">groupby</span>(<span class="str">'tenure_bucket'</span>, observed=<span class="kw">True</span>)[<span class="str">'churned'</span>].<span class="fn">sum</span>().values
<span class="fn">print</span>(<span class="str">"True histogram:"</span>, hist)

<span class="cm"># A histogram has L1 sensitivity = 1 (one record changes one bucket by 1)</span>
eps = <span class="num">0.5</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
noise = np.random.<span class="fn">laplace</span>(<span class="num">0</span>, <span class="num">1.0</span>/eps, size=<span class="fn">len</span>(hist))
noisy = np.<span class="fn">maximum</span>(<span class="num">0</span>, np.<span class="fn">round</span>(hist + noise)).<span class="fn">astype</span>(<span class="fn">int</span>)
<span class="fn">print</span>(<span class="str">"DP histogram (eps=0.5):"</span>, noisy)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) bins customers by tenure to form a true histogram (one count per bucket). 2) sets ε=0.5 and notes the histogram's L1 sensitivity is 1 (changing one record shifts exactly one bucket by ±1). 3) draws Lap(0, 1/ε) noise independently for every bucket and adds it to the true counts. 4) clips negatives to zero and rounds, producing an ε-DP histogram release.</p>
<p class="l-text">Histograms are the most-used DP primitive — they have sensitivity 1 (in L1), they are post-processable (you can derive any marginal afterward), and noise is small relative to bucket counts. The U.S. Census 2020 release is essentially a giant private histogram.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. The Gaussian Mechanism</h2>
<p class="l-text">For (ε,δ)-DP with L2-bounded sensitivity Δ₂f, add Gaussian noise with σ ≥ Δ₂f · sqrt(2 ln(1.25/δ))/ε.</p>
<div class="katex-block">$$\\sigma \\geq \\Delta_2 f \\cdot \\sqrt{2 \\ln(1.25/\\delta)} / \\varepsilon$$</div>
<p class="l-text">Why Gaussian over Laplace? Two reasons. (1) For high-dimensional queries (e.g., gradients in ℝᵈ), L2 sensitivity is much smaller than L1 sensitivity (sqrt(d) factor), so Gaussian noise is smaller per coordinate. (2) Gaussians compose tightly: the sum of k independent Gaussians is Gaussian, while sums of Laplaces are not. This is why DP-SGD uses Gaussian.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># DP mean of monthly_charge (clipped to [0, 200] for bounded sensitivity)</span>
clip = <span class="num">200.0</span>
n = <span class="fn">len</span>(df_churn)
clipped = np.<span class="fn">clip</span>(df_churn[<span class="str">'monthly_charge'</span>].values, <span class="num">0</span>, clip)
true_sum = clipped.<span class="fn">sum</span>()

<span class="cm"># Sensitivity of clipped sum: clip (one record changes sum by at most clip)</span>
delta_2 = clip
eps, delta = <span class="num">1.0</span>, <span class="num">1e-5</span>
sigma = delta_2 * np.<span class="fn">sqrt</span>(<span class="num">2</span> * np.<span class="fn">log</span>(<span class="num">1.25</span>/delta)) / eps
<span class="fn">print</span>(f<span class="str">"Gaussian sigma = {sigma:.2f}"</span>)

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
noisy_sum = true_sum + np.random.<span class="fn">normal</span>(<span class="num">0</span>, sigma)
noisy_mean = noisy_sum / n
true_mean = clipped.<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"True mean: {true_mean:.2f}   DP mean: {noisy_mean:.2f}   error: {noisy_mean-true_mean:+.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) clips every monthly_charge to [0, 200] so the L2 sensitivity of the sum is bounded by 200. 2) chooses (ε, δ) = (1.0, 1e-5) and computes the analytical Gaussian noise scale σ = Δ₂ · √(2 ln(1.25/δ)) / ε. 3) draws a single N(0, σ²) sample, adds it to the true sum, divides by n to obtain a (ε,δ)-DP mean and reports the additive error.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Renyi DP and zCDP — Tighter Composition</h2>
<p class="l-text">Mironov (2017) introduced Renyi DP: a mechanism is (α, ε(α))-RDP if for every neighboring D, D', the Renyi divergence D_α(M(D) ‖ M(D')) ≤ ε(α). RDP composes by addition (over the same α), then converts to (ε,δ)-DP at the end.</p>
<div class="katex-block">$$D_\\alpha(P \\| Q) = \\frac{1}{\\alpha-1} \\log \\mathbb{E}_{x \\sim Q}\\left[\\left(\\frac{P(x)}{Q(x)}\\right)^\\alpha\\right]$$</div>
<p class="l-text">For the Gaussian mechanism with noise σ on a unit-sensitivity query: ε_RDP(α) = α/(2σ²). After T compositions: T·α/(2σ²). Convert: (ε,δ)-DP with ε = T·α/(2σ²) + log(1/δ)/(α-1), optimize over α. This is the <em>moments accountant</em> (Abadi 2016) used in TensorFlow Privacy and Opacus.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RDP</div><div class="card-body">Mironov 2017. Compose tightly via Renyi divergence at multiple α. Convert to (ε,δ) at end.</div></div>
<div class="calc-card"><div class="card-title">zCDP</div><div class="card-body">Bun-Steinke 2016. Special case of RDP, simpler composition. ρ-zCDP ≈ Gaussian-σ where ρ=1/(2σ²).</div></div>
<div class="calc-card"><div class="card-title">PRV / GDP</div><div class="card-body">Privacy Random Variables (Koskela 2020), Gaussian DP (Dong-Roth-Su 2019). Numerically tight.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. The Exponential Mechanism — Selection</h2>
<p class="l-text">When the query returns a discrete object (best feature, top-k item, median bin), Laplace/Gaussian don't apply. McSherry-Talwar 2007 introduced the exponential mechanism. Given a utility function u(D, r) over candidates r ∈ R with sensitivity Δu (max change of u when one record changes), output r with probability ∝ exp(ε·u(D,r) / 2Δu).</p>
<div class="katex-block">$$\\Pr[M(D) = r] \\propto \\exp\\left(\\frac{\\varepsilon \\cdot u(D, r)}{2 \\Delta u}\\right)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># DP-select the most common tenure bucket</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'bucket'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">12</span>,<span class="num">24</span>,<span class="num">48</span>,<span class="num">200</span>],
                      labels=[<span class="str">'0-1y'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>])
candidates = [<span class="str">'0-1y'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>]
counts = np.<span class="fn">array</span>([(df[<span class="str">'bucket'</span>]==c).<span class="fn">sum</span>() <span class="kw">for</span> c <span class="kw">in</span> candidates], dtype=<span class="fn">float</span>)

<span class="cm"># utility = count;  sensitivity of utility = 1</span>
eps = <span class="num">0.5</span>
sens = <span class="num">1.0</span>
weights = np.<span class="fn">exp</span>(eps * counts / (<span class="num">2</span> * sens))
probs = weights / weights.<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="str">"True counts:"</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(candidates, counts.<span class="fn">astype</span>(<span class="fn">int</span>))))
<span class="fn">print</span>(<span class="str">"Selection probabilities:"</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(candidates, np.<span class="fn">round</span>(probs,<span class="num">3</span>))))

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
selected = np.random.<span class="fn">choice</span>(candidates, p=probs)
<span class="fn">print</span>(<span class="str">"DP-selected modal bucket:"</span>, selected)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines a utility u(D, r) = count of bucket r and notes its sensitivity Δu = 1 (one record shifts one count by 1). 2) computes unnormalized weights w_r = exp(ε · u(D, r) / 2Δu) for every candidate bucket. 3) normalises to a probability distribution p_r = w_r / Σ w_r — the buckets with higher true counts get exponentially more mass. 4) draws one sample via np.random.choice(p=probs); the release is ε-DP and never reveals the actual counts.</p>
<p class="l-text">The exponential mechanism is ε-DP, not (ε,δ)-DP. It generalizes Report Noisy Max (next section) and is the basis for private median, private auction, and DP feature selection.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Report Noisy Max</h2>
<p class="l-text">When you only need the argmax of k counts, you don't need to release the whole noisy histogram. Add Lap(1/ε) to each count and report only the index of the largest noisy count. Surprisingly, this costs ε <em>total</em>, not k·ε — the index reveals only the comparison structure, not the values themselves.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Find the most common churn-by-charges bucket using Report Noisy Max</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'bucket'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'monthly_charge'</span>], bins=[<span class="num">0</span>,<span class="num">30</span>,<span class="num">60</span>,<span class="num">90</span>,<span class="num">200</span>],
                      labels=[<span class="str">'low'</span>,<span class="str">'mid'</span>,<span class="str">'high'</span>,<span class="str">'vhigh'</span>])
candidates = [<span class="str">'low'</span>,<span class="str">'mid'</span>,<span class="str">'high'</span>,<span class="str">'vhigh'</span>]
churned_counts = np.<span class="fn">array</span>([
    ((df[<span class="str">'bucket'</span>]==c)&amp;(df[<span class="str">'churned'</span>]==<span class="num">1</span>)).<span class="fn">sum</span>() <span class="kw">for</span> c <span class="kw">in</span> candidates
], dtype=<span class="fn">float</span>)
<span class="fn">print</span>(<span class="str">"True churn counts:"</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(candidates, churned_counts.<span class="fn">astype</span>(<span class="fn">int</span>))))

eps = <span class="num">0.3</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
noisy = churned_counts + np.random.<span class="fn">laplace</span>(<span class="num">0</span>, <span class="num">1.0</span>/eps, size=<span class="num">4</span>)
winner_idx = <span class="fn">int</span>(np.<span class="fn">argmax</span>(noisy))
<span class="fn">print</span>(f<span class="str">"Noisy counts: {np.round(noisy,1)}"</span>)
<span class="fn">print</span>(f<span class="str">"Report Noisy Max: bucket={candidates[winner_idx]}  (eps={eps} total)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) computes the true churn count per monthly_charge bucket (k=4 candidates, each with L1 sensitivity 1). 2) adds an independent Lap(0, 1/ε) sample to every count. 3) returns only the argmax index of the noisy vector — never the noisy values themselves. 4) the release is ε-DP total (not k·ε) because the index reveals only the comparison structure of the candidates.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Sparse Vector Technique (SVT)</h2>
<p class="l-text">Hardt-Rothblum 2010, refined by Lyu-Su-Li 2017. You have a stream of queries q1, q2, ...  and want to flag the first c queries above a threshold T, ignoring the rest. SVT spends ε <em>only on flagged queries</em>. You can answer arbitrarily many "below threshold" queries for the same budget.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">SVT is critical for monitoring: "alert me if any of these 1000 metrics exceeds threshold." Without SVT you'd pay 1000·ε. With SVT you pay c·ε where c is the number of true alerts (typically tiny). Used in Apple's anomaly detection.</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># SVT: flag tenure buckets where churn rate exceeds threshold T=0.3</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'bucket'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">6</span>,<span class="num">12</span>,<span class="num">24</span>,<span class="num">48</span>,<span class="num">200</span>],
                      labels=[<span class="str">'0-6m'</span>,<span class="str">'6-12m'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>])
queries = []
<span class="kw">for</span> c <span class="kw">in</span> [<span class="str">'0-6m'</span>,<span class="str">'6-12m'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>]:
    sub = df[df[<span class="str">'bucket'</span>]==c]
    queries.<span class="fn">append</span>((c, <span class="fn">float</span>(sub[<span class="str">'churned'</span>].<span class="fn">mean</span>())))

eps, sens, T, c_flagged = <span class="num">1.0</span>, <span class="num">1.0</span>/<span class="fn">len</span>(df), <span class="num">0.3</span>, <span class="num">2</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
T_noisy = T + np.random.<span class="fn">laplace</span>(<span class="num">0</span>, <span class="num">4</span>*sens/eps)
flagged = []
<span class="kw">for</span> name, q <span class="kw">in</span> queries:
    q_noisy = q + np.random.<span class="fn">laplace</span>(<span class="num">0</span>, <span class="num">8</span>*c_flagged*sens/eps)
    <span class="kw">if</span> q_noisy &gt; T_noisy:
        flagged.<span class="fn">append</span>(name)
        <span class="kw">if</span> <span class="fn">len</span>(flagged) &gt;= c_flagged: <span class="kw">break</span>
<span class="fn">print</span>(<span class="str">"True churn rates:"</span>, <span class="fn">dict</span>(queries))
<span class="fn">print</span>(f<span class="str">"Flagged (rate &gt; {T}):"</span>, flagged)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) noises the threshold T once with Lap(0, 4·Δ·c/ε) — this T_noisy is reused for every query. 2) for each streaming query q_i, draws a fresh Lap(0, 8·Δ·c/ε) sample and compares q_noisy &gt; T_noisy. 3) appends the query name to flagged whenever the comparison fires. 4) stops after c_flagged hits, so the total privacy cost is c·ε regardless of how many sub-threshold queries were answered.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Randomized Response &amp; RAPPOR</h2>
<p class="l-text">Warner 1965 (long predating DP) asked sensitive yes/no questions by having respondents flip a coin in private: "if heads, answer truthfully; if tails, flip again and answer yes/no by the second coin." The aggregator can debias the count without ever knowing which respondents lied. This is <em>local</em> DP — privacy at the source, no trusted curator needed.</p>
<div class="katex-block">$$\\text{RR with prob } p: \\quad \\varepsilon = \\ln\\left(\\frac{p}{1-p}\\right)$$</div>
<p class="l-text">RAPPOR (Erlingsson-Pihur-Korolova 2014, Google) generalizes this to high-cardinality strings: hash the value into a bloom filter, then apply randomized response per bit. Two-stage: PRR (permanent, against longitudinal attacks) + IRR (instantaneous, per-report). Deployed in Chrome to collect homepages.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># RAPPOR-lite: each user has a bit (churned or not), apply randomized response</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
true_bits = df_churn[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">int</span>)
n = <span class="fn">len</span>(true_bits)

eps = <span class="num">1.0</span>
p = np.<span class="fn">exp</span>(eps) / (np.<span class="fn">exp</span>(eps) + <span class="num">1</span>)   <span class="cm"># report-true probability</span>

<span class="cm"># Each user independently flips</span>
flipped = np.<span class="fn">where</span>(np.random.<span class="fn">rand</span>(n) &lt; p, true_bits, <span class="num">1</span> - true_bits)
noisy_count = flipped.<span class="fn">sum</span>()

<span class="cm"># Debias: E[flipped] = p*true + (1-p)*(n-true)</span>
<span class="cm"># Solve for true_count</span>
true_count_est = (noisy_count - (<span class="num">1</span>-p)*n) / (<span class="num">2</span>*p - <span class="num">1</span>)
true_count = true_bits.<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"True churn count: {true_count}"</span>)
<span class="fn">print</span>(f<span class="str">"RAPPOR-debiased estimate: {true_count_est:.1f}  (eps={eps})"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) each user keeps her true churn bit with probability p = e^ε / (e^ε + 1) and flips it with probability 1-p — the local randomization that gives ε = ln(p/(1-p))-LDP. 2) the server only sees the flipped vector and computes a biased count Σ flipped. 3) Warner debiasing solves E[flipped] = p·true + (1-p)·(n-true) for the unknown true count: true ≈ (observed - n(1-p)) / (2p-1). 4) no central curator is trusted — the privacy guarantee holds at the source.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Choosing a Mechanism — Decision Tree</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Numeric, low-dim</div><div class="card-body">Laplace. Pure ε-DP, simple, optimal for L1.</div></div>
<div class="calc-card"><div class="card-title">Numeric, high-dim (gradients)</div><div class="card-body">Gaussian + RDP. L2 sensitivity is sqrt(d) smaller than L1.</div></div>
<div class="calc-card"><div class="card-title">Discrete winner</div><div class="card-body">Exponential mechanism or Report Noisy Max.</div></div>
<div class="calc-card"><div class="card-title">Stream of threshold queries</div><div class="card-body">Sparse Vector Technique.</div></div>
<div class="calc-card"><div class="card-title">No trusted curator</div><div class="card-body">Local DP: randomized response, RAPPOR, count-mean sketch (Apple).</div></div>
<div class="calc-card"><div class="card-title">Repeated training</div><div class="card-body">Sub-sampled Gaussian + Renyi accountant (DP-SGD, Lesson 3).</div></div>
</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. What's Next</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Lesson 3 takes the Gaussian mechanism + Renyi DP and wraps them around mini-batch SGD to give you DP-SGD (Abadi 2016) — the algorithm that lets you train neural networks with formal privacy guarantees. We'll implement it from scratch in NumPy and then show the Opacus drop-in replacement.</div>
<p class="l-text">Reading: McSherry-Talwar 2007 "Mechanism Design via Differential Privacy"; Mironov 2017 "Renyi Differential Privacy"; Erlingsson-Pihur-Korolova 2014 "RAPPOR"; Hardt-Rothblum 2010 "A Multiplicative Weights Mechanism for Privacy-Preserving Data Analysis".</p>
</div>`,
tr: `<p class="l-text">Ders 1 size sözleşmeyi verdi: herhangi bir DP mekanizması ε-DP veya (ε,δ)-DP'yi karşılamalıdır. Şimdi <em>gerçek</em> mekanizmalardan oluşan bir alet kutusuna ihtiyacınız var — sorgulara, ML eğitim döngülerine ve tüm veri ürünlerine birleştirebileceğiniz ilkel öğeler. Bu ders alet kutusudur. Sonunda hangi sorgu tipi (sayısal, kategorik, top-k, eşik) için hangi ilkele başvurmanız gerektiğini, gürültü ölçeğini nasıl ayarlayacağınızı ve onları Renyi DP ve sıfır-yoğunlaştırılmış DP (zCDP) gibi gizlilik muhasebecileriyle nasıl birleştireceğinizi bileceksiniz.</p>
<p class="l-text">Her ilkel, bir araştırma alt alanını açan 2006-2016 dönemi makaleden geliyor. Laplace (Dwork-McSherry-Nissim-Smith 2006) — sayısal sorguların beygiri. Renyi DP üzerinden Gauss (Mironov 2017) — DP-SGD'nin temeli. Üstel (McSherry-Talwar 2007) — bir ayrık kazananı seçmek. Report Noisy Max (Bun-Steinke 2016) — tüm histogram için ödeme yapmadan top-1 seçimi. Sparse Vector Technique (Hardt-Rothblum 2010) — sadece eşiğin üstündeki sorgular için ödeyerek pek çok sorguya yanıt verme. RAPPOR (Erlingsson-Pihur-Korolova 2014) — Google'ın yerel-DP randomize edilmiş yanıtı. Her birinin bir Pyodide demosu var.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Laplace mekanizması — L1-sınırlı sayısal sorgular için saf ε-DP</li>
<li>Gauss mekanizması + Renyi DP / zCDP — sıkı kompozisyonun arkasındaki matematik</li>
<li>Üstel mekanizma — ayrık seçenekler üzerinde DP seçimi</li>
<li>Report Noisy Max — top öğeyi verimli bulmak</li>
<li>Sparse Vector Technique — eşik sorgu akışlarına yanıt verme</li>
<li>RAPPOR + randomize yanıt — istemci tarafı veri toplama için yerel DP</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Laplace Mekanizması — Daha Derin</h2>
<p class="l-text">Laplace dağılımı Lap(b)'nin yoğunluğu (1/2b)·exp(-|x|/b), varyansı 2b²'dir. "Çift üstel"dir — Gauss'a kıyasla ağır kuyrukludur ve bu da tam olarak <strong>saf</strong> ε-DP (δ yok) vermesinin nedenidir: herhangi iki x, x' noktasındaki yoğunlukların oranı |log(p(x)/p(x'))| ≤ |x-x'|/b'yi deterministik olarak karşılar.</p>
<div class="katex-block">$$M(D) = f(D) + \\text{Lap}(\\Delta_1 f / \\varepsilon)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Tenure kovasına göre gruplandırılmış churn müşterilerinin DP histogramı</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'tenure_bucket'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">12</span>,<span class="num">24</span>,<span class="num">48</span>,<span class="num">200</span>],
                              labels=[<span class="str">'0-1y'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>])
hist = df.<span class="fn">groupby</span>(<span class="str">'tenure_bucket'</span>, observed=<span class="kw">True</span>)[<span class="str">'churned'</span>].<span class="fn">sum</span>().values
<span class="fn">print</span>(<span class="str">"True histogram:"</span>, hist)

<span class="cm"># Bir histogramın L1 hassasiyeti = 1 (bir kayıt bir kovayı 1 değiştirir)</span>
eps = <span class="num">0.5</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
noise = np.random.<span class="fn">laplace</span>(<span class="num">0</span>, <span class="num">1.0</span>/eps, size=<span class="fn">len</span>(hist))
noisy = np.<span class="fn">maximum</span>(<span class="num">0</span>, np.<span class="fn">round</span>(hist + noise)).<span class="fn">astype</span>(<span class="fn">int</span>)
<span class="fn">print</span>(<span class="str">"DP histogram (eps=0.5):"</span>, noisy)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) müşterileri tenure'a göre kovalara bölüp gerçek histogramı (kova başına bir sayım) oluşturur. 2) ε=0.5 seçilir; histogramın L1 hassasiyeti 1'dir (bir kayıt yalnızca bir kovayı ±1 değiştirir). 3) her kova için bağımsız Lap(0, 1/ε) gürültüsü çekilir ve gerçek sayılara eklenir. 4) negatifler sıfıra kesilip yuvarlanır; sonuç ε-DP histogram yayımıdır.</p>
<p class="l-text">Histogramlar en çok kullanılan DP ilkellerdir — hassasiyetleri 1'dir (L1'de), son işlemeye uygundurlar (sonradan herhangi bir marjinal türetebilirsiniz) ve gürültü kova sayımlarına göre küçüktür. ABD Sayımı 2020 yayımı esasen devasa bir özel histogramdır.</p>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Gauss Mekanizması</h2>
<p class="l-text">L2-sınırlı hassasiyet Δ₂f olan (ε,δ)-DP için, σ ≥ Δ₂f · sqrt(2 ln(1.25/δ))/ε ile Gauss gürültüsü ekleyin.</p>
<div class="katex-block">$$\\sigma \\geq \\Delta_2 f \\cdot \\sqrt{2 \\ln(1.25/\\delta)} / \\varepsilon$$</div>
<p class="l-text">Neden Laplace yerine Gauss? İki neden. (1) Yüksek boyutlu sorgular için (ör. ℝᵈ'deki gradyanlar), L2 hassasiyeti L1 hassasiyetinden çok daha küçüktür (sqrt(d) faktörü), bu nedenle Gauss gürültüsü koordinat başına daha küçüktür. (2) Gauss'lar sıkı birleşir: bağımsız k Gauss'un toplamı Gauss'tür, ancak Laplace'ların toplamı değildir. DP-SGD'nin Gauss kullanmasının nedeni budur.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># monthly_charge'ın DP ortalaması (sınırlı hassasiyet için [0, 200] aralığında kırpıldı)</span>
clip = <span class="num">200.0</span>
n = <span class="fn">len</span>(df_churn)
clipped = np.<span class="fn">clip</span>(df_churn[<span class="str">'monthly_charge'</span>].values, <span class="num">0</span>, clip)
true_sum = clipped.<span class="fn">sum</span>()

<span class="cm"># Kırpılmış toplamın hassasiyeti: clip (bir kayıt toplamı en fazla clip değiştirir)</span>
delta_2 = clip
eps, delta = <span class="num">1.0</span>, <span class="num">1e-5</span>
sigma = delta_2 * np.<span class="fn">sqrt</span>(<span class="num">2</span> * np.<span class="fn">log</span>(<span class="num">1.25</span>/delta)) / eps
<span class="fn">print</span>(f<span class="str">"Gaussian sigma = {sigma:.2f}"</span>)

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
noisy_sum = true_sum + np.random.<span class="fn">normal</span>(<span class="num">0</span>, sigma)
noisy_mean = noisy_sum / n
true_mean = clipped.<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"True mean: {true_mean:.2f}   DP mean: {noisy_mean:.2f}   error: {noisy_mean-true_mean:+.2f}"</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) her monthly_charge değeri [0, 200] aralığına kırpılır; böylece toplamın L2 hassasiyeti 200 ile sınırlanır. 2) (ε, δ) = (1.0, 1e-5) seçilir ve analitik Gauss gürültü ölçeği σ = Δ₂ · √(2 ln(1.25/δ)) / ε hesaplanır. 3) tek bir N(0, σ²) örneği çekilip gerçek toplama eklenir; n'e bölerek (ε,δ)-DP ortalama elde edilir ve toplamsal hata raporlanır.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Renyi DP ve zCDP — Daha Sıkı Kompozisyon</h2>
<p class="l-text">Mironov (2017) Renyi DP'yi tanıttı: bir mekanizma, her komşu D, D' için Renyi sapması D_α(M(D) ‖ M(D')) ≤ ε(α) ise (α, ε(α))-RDP'dir. RDP toplamla birleşir (aynı α üzerinde), sonra sonunda (ε,δ)-DP'ye dönüşür.</p>
<div class="katex-block">$$D_\\alpha(P \\| Q) = \\frac{1}{\\alpha-1} \\log \\mathbb{E}_{x \\sim Q}\\left[\\left(\\frac{P(x)}{Q(x)}\\right)^\\alpha\\right]$$</div>
<p class="l-text">Birim hassasiyetli bir sorguda σ gürültülü Gauss mekanizması için: ε_RDP(α) = α/(2σ²). T kompozisyondan sonra: T·α/(2σ²). Dönüştür: ε = T·α/(2σ²) + log(1/δ)/(α-1) ile (ε,δ)-DP, α üzerinde optimize et. Bu, TensorFlow Privacy ve Opacus'ta kullanılan <em>moments accountant</em>'tır (Abadi 2016).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">RDP</div><div class="card-body">Mironov 2017. Birden çok α'da Renyi sapması üzerinden sıkı birleştir. Sonunda (ε,δ)'ye dönüştür.</div></div>
<div class="calc-card"><div class="card-title">zCDP</div><div class="card-body">Bun-Steinke 2016. RDP'nin özel hali, daha basit kompozisyon. ρ-zCDP ≈ Gauss-σ; ρ=1/(2σ²).</div></div>
<div class="calc-card"><div class="card-title">PRV / GDP</div><div class="card-body">Privacy Random Variables (Koskela 2020), Gauss DP (Dong-Roth-Su 2019). Sayısal olarak sıkı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Üstel Mekanizma — Seçim</h2>
<p class="l-text">Sorgu ayrık bir nesne döndürdüğünde (en iyi özellik, top-k öğe, medyan kovası), Laplace/Gauss uygulanmaz. McSherry-Talwar 2007 üstel mekanizmayı tanıttı. Hassasiyet Δu (bir kayıt değiştiğinde u'nun maksimum değişimi) olan adaylar r ∈ R üzerinde bir fayda fonksiyonu u(D, r) verildiğinde, r'yi exp(ε·u(D,r) / 2Δu) ile orantılı olasılıkla çıktı verin.</p>
<div class="katex-block">$$\\Pr[M(D) = r] \\propto \\exp\\left(\\frac{\\varepsilon \\cdot u(D, r)}{2 \\Delta u}\\right)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># En yaygın tenure kovasını DP-seç</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'bucket'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">12</span>,<span class="num">24</span>,<span class="num">48</span>,<span class="num">200</span>],
                      labels=[<span class="str">'0-1y'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>])
candidates = [<span class="str">'0-1y'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>]
counts = np.<span class="fn">array</span>([(df[<span class="str">'bucket'</span>]==c).<span class="fn">sum</span>() <span class="kw">for</span> c <span class="kw">in</span> candidates], dtype=<span class="fn">float</span>)

<span class="cm"># fayda = sayım;  faydanın hassasiyeti = 1</span>
eps = <span class="num">0.5</span>
sens = <span class="num">1.0</span>
weights = np.<span class="fn">exp</span>(eps * counts / (<span class="num">2</span> * sens))
probs = weights / weights.<span class="fn">sum</span>()
<span class="fn">print</span>(<span class="str">"True counts:"</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(candidates, counts.<span class="fn">astype</span>(<span class="fn">int</span>))))
<span class="fn">print</span>(<span class="str">"Selection probabilities:"</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(candidates, np.<span class="fn">round</span>(probs,<span class="num">3</span>))))

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
selected = np.random.<span class="fn">choice</span>(candidates, p=probs)
<span class="fn">print</span>(<span class="str">"DP-selected modal bucket:"</span>, selected)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) fayda fonksiyonu u(D, r) = r kovasının sayımı olarak tanımlanır ve hassasiyeti Δu = 1'dir (bir kayıt bir sayımı 1 değiştirir). 2) her aday kova için normalize olmamış ağırlıklar w_r = exp(ε · u(D, r) / 2Δu) hesaplanır. 3) bir olasılık dağılımına normalize edilir p_r = w_r / Σ w_r — gerçek sayımı yüksek kovalar üstel olarak daha çok kütle alır. 4) np.random.choice(p=probs) ile bir örnek çekilir; yayım ε-DP'dir ve gerçek sayımları asla ortaya çıkarmaz.</p>
<p class="l-text">Üstel mekanizma ε-DP'dir, (ε,δ)-DP değil. Report Noisy Max'i (sonraki bölüm) genelleştirir ve özel medyan, özel açık artırma ve DP özellik seçiminin temelidir.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Report Noisy Max</h2>
<p class="l-text">Yalnızca k sayımın argmax'ına ihtiyacınız olduğunda, tüm gürültülü histogramı yayımlamanıza gerek yok. Her sayıma Lap(1/ε) ekleyin ve yalnızca en büyük gürültülü sayımın indisini bildirin. Şaşırtıcı şekilde, bu k·ε değil <em>toplam</em> ε'a mal olur — indis yalnızca karşılaştırma yapısını ortaya çıkarır, değerleri değil.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Report Noisy Max kullanarak en yaygın churn-by-charges kovasını bul</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'bucket'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'monthly_charge'</span>], bins=[<span class="num">0</span>,<span class="num">30</span>,<span class="num">60</span>,<span class="num">90</span>,<span class="num">200</span>],
                      labels=[<span class="str">'low'</span>,<span class="str">'mid'</span>,<span class="str">'high'</span>,<span class="str">'vhigh'</span>])
candidates = [<span class="str">'low'</span>,<span class="str">'mid'</span>,<span class="str">'high'</span>,<span class="str">'vhigh'</span>]
churned_counts = np.<span class="fn">array</span>([
    ((df[<span class="str">'bucket'</span>]==c)&amp;(df[<span class="str">'churned'</span>]==<span class="num">1</span>)).<span class="fn">sum</span>() <span class="kw">for</span> c <span class="kw">in</span> candidates
], dtype=<span class="fn">float</span>)
<span class="fn">print</span>(<span class="str">"True churn counts:"</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(candidates, churned_counts.<span class="fn">astype</span>(<span class="fn">int</span>))))

eps = <span class="num">0.3</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
noisy = churned_counts + np.random.<span class="fn">laplace</span>(<span class="num">0</span>, <span class="num">1.0</span>/eps, size=<span class="num">4</span>)
winner_idx = <span class="fn">int</span>(np.<span class="fn">argmax</span>(noisy))
<span class="fn">print</span>(f<span class="str">"Noisy counts: {np.round(noisy,1)}"</span>)
<span class="fn">print</span>(f<span class="str">"Report Noisy Max: bucket={candidates[winner_idx]}  (eps={eps} total)"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) monthly_charge kovaları başına gerçek churn sayımları hesaplanır (k=4 aday, her birinin L1 hassasiyeti 1). 2) her sayıma bağımsız bir Lap(0, 1/ε) örneği eklenir. 3) yalnızca gürültülü vektörün argmax indisi döndürülür — gürültülü değerler asla. 4) yayım toplamda ε-DP'dir (k·ε değil) çünkü indis yalnızca adayların karşılaştırma yapısını ortaya çıkarır.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Sparse Vector Technique (SVT)</h2>
<p class="l-text">Hardt-Rothblum 2010, Lyu-Su-Li 2017 tarafından rafine edildi. Bir sorgu akışınız var q1, q2, ... ve bir T eşiğinin üzerindeki ilk c sorguyu işaretlemek, gerisini yok saymak istiyorsunuz. SVT yalnızca <em>işaretli sorgular</em>'da ε harcar. Aynı bütçe için keyfi sayıda "eşiğin altında" sorguya yanıt verebilirsiniz.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">SVT izleme için kritiktir: "bu 1000 metrikten herhangi biri eşiği aşarsa beni uyar." SVT olmadan 1000·ε ödersiniz. SVT ile c·ε ödersiniz; c gerçek uyarı sayısıdır (tipik olarak küçük). Apple'ın anomali tespitinde kullanıldı.</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># SVT: churn oranı T=0.3 eşiğini aşan tenure kovalarını işaretle</span>
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'bucket'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">6</span>,<span class="num">12</span>,<span class="num">24</span>,<span class="num">48</span>,<span class="num">200</span>],
                      labels=[<span class="str">'0-6m'</span>,<span class="str">'6-12m'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>])
queries = []
<span class="kw">for</span> c <span class="kw">in</span> [<span class="str">'0-6m'</span>,<span class="str">'6-12m'</span>,<span class="str">'1-2y'</span>,<span class="str">'2-4y'</span>,<span class="str">'4y+'</span>]:
    sub = df[df[<span class="str">'bucket'</span>]==c]
    queries.<span class="fn">append</span>((c, <span class="fn">float</span>(sub[<span class="str">'churned'</span>].<span class="fn">mean</span>())))

eps, sens, T, c_flagged = <span class="num">1.0</span>, <span class="num">1.0</span>/<span class="fn">len</span>(df), <span class="num">0.3</span>, <span class="num">2</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
T_noisy = T + np.random.<span class="fn">laplace</span>(<span class="num">0</span>, <span class="num">4</span>*sens/eps)
flagged = []
<span class="kw">for</span> name, q <span class="kw">in</span> queries:
    q_noisy = q + np.random.<span class="fn">laplace</span>(<span class="num">0</span>, <span class="num">8</span>*c_flagged*sens/eps)
    <span class="kw">if</span> q_noisy &gt; T_noisy:
        flagged.<span class="fn">append</span>(name)
        <span class="kw">if</span> <span class="fn">len</span>(flagged) &gt;= c_flagged: <span class="kw">break</span>
<span class="fn">print</span>(<span class="str">"True churn rates:"</span>, <span class="fn">dict</span>(queries))
<span class="fn">print</span>(f<span class="str">"Flagged (rate &gt; {T}):"</span>, flagged)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) eşik T tek seferlik Lap(0, 4·Δ·c/ε) ile gürültülenir — bu T_noisy her sorguda tekrar kullanılır. 2) her akış sorgusu q_i için taze bir Lap(0, 8·Δ·c/ε) örneği çekilir ve q_noisy &gt; T_noisy karşılaştırması yapılır. 3) karşılaştırma tetiklendiğinde sorgu adı flagged listesine eklenir. 4) c_flagged hitten sonra durulur, böylece toplam gizlilik maliyeti — kaç eşik-altı sorguya cevap verilirse verilsin — c·ε olur.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Randomize Yanıt &amp; RAPPOR</h2>
<p class="l-text">Warner 1965 (DP'den çok önce), katılımcılara özelinde bir madeni para attırarak hassas evet/hayır soruları sordu: "yazı gelirse, dürüst yanıt ver; tura gelirse, yine at ve ikinci paraya göre evet/hayır." Toplayıcı, hangi katılımcıların yalan söylediğini hiç bilmeden sayımı yansızlaştırabilir. Bu <em>yerel</em> DP'dir — kaynakta gizlilik, güvenilir bir koordinatöre gerek yok.</p>
<div class="katex-block">$$\\text{RR with prob } p: \\quad \\varepsilon = \\ln\\left(\\frac{p}{1-p}\\right)$$</div>
<p class="l-text">RAPPOR (Erlingsson-Pihur-Korolova 2014, Google) bunu yüksek-kardinaliteli dizgilere genelleştirir: değeri bir bloom filtresine hash'le, sonra bit başına randomize yanıt uygula. İki aşamalı: PRR (kalıcı, boylamsal saldırılara karşı) + IRR (anlık, rapor başına). Ana sayfaları toplamak için Chrome'da dağıtıldı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># RAPPOR-lite: her kullanıcının bir biti var (churned ya da değil), randomize yanıt uygula</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
true_bits = df_churn[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">int</span>)
n = <span class="fn">len</span>(true_bits)

eps = <span class="num">1.0</span>
p = np.<span class="fn">exp</span>(eps) / (np.<span class="fn">exp</span>(eps) + <span class="num">1</span>)   <span class="cm"># doğru-rapor olasılığı</span>

<span class="cm"># Her kullanıcı bağımsız çevirir</span>
flipped = np.<span class="fn">where</span>(np.random.<span class="fn">rand</span>(n) &lt; p, true_bits, <span class="num">1</span> - true_bits)
noisy_count = flipped.<span class="fn">sum</span>()

<span class="cm"># Yansızlaştır: E[flipped] = p*true + (1-p)*(n-true)</span>
<span class="cm"># true_count'i çöz</span>
true_count_est = (noisy_count - (<span class="num">1</span>-p)*n) / (<span class="num">2</span>*p - <span class="num">1</span>)
true_count = true_bits.<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"True churn count: {true_count}"</span>)
<span class="fn">print</span>(f<span class="str">"RAPPOR-debiased estimate: {true_count_est:.1f}  (eps={eps})"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada iki önemli detay var:</strong> 1) her kullanıcı gerçek churn bitini p = e^ε / (e^ε + 1) olasılığıyla korur, 1-p ile çevirir — yerel randomizasyon ε = ln(p/(1-p))-LDP'yi sağlar. 2) sunucu yalnızca çevrilmiş vektörü görür ve yanlı bir sayım Σ flipped hesaplar; Warner yansızlaştırması E[flipped] = p·true + (1-p)·(n-true) denklemini bilinmeyen gerçek sayım için çözer: true ≈ (observed - n(1-p)) / (2p-1). Hiçbir merkezi koordinatöre güvenilmez — gizlilik garantisi kaynakta tutar.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Bir Mekanizma Seçmek — Karar Ağacı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sayısal, düşük boyutlu</div><div class="card-body">Laplace. Saf ε-DP, basit, L1 için optimal.</div></div>
<div class="calc-card"><div class="card-title">Sayısal, yüksek boyutlu (gradyanlar)</div><div class="card-body">Gauss + RDP. L2 hassasiyeti L1'den sqrt(d) kat daha küçüktür.</div></div>
<div class="calc-card"><div class="card-title">Ayrık kazanan</div><div class="card-body">Üstel mekanizma veya Report Noisy Max.</div></div>
<div class="calc-card"><div class="card-title">Eşik sorgu akışı</div><div class="card-body">Sparse Vector Technique.</div></div>
<div class="calc-card"><div class="card-title">Güvenilir koordinatör yok</div><div class="card-body">Yerel DP: randomize yanıt, RAPPOR, count-mean sketch (Apple).</div></div>
<div class="calc-card"><div class="card-title">Tekrarlanan eğitim</div><div class="card-body">Alt-örneklenmiş Gauss + Renyi muhasebecisi (DP-SGD, Ders 3).</div></div>
</div>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Sıradaki</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Ders 3, Gauss mekanizmasını + Renyi DP'yi alır ve onları size DP-SGD'yi (Abadi 2016) vermek için mini-batch SGD etrafına sarar — formal gizlilik garantileriyle sinir ağlarını eğitmenize izin veren algoritma. Bunu sıfırdan NumPy'da uygulayacağız ve sonra Opacus drop-in yedeğini göstereceğiz.</div>
<p class="l-text">Okuma: McSherry-Talwar 2007 "Mechanism Design via Differential Privacy"; Mironov 2017 "Renyi Differential Privacy"; Erlingsson-Pihur-Korolova 2014 "RAPPOR"; Hardt-Rothblum 2010 "A Multiplicative Weights Mechanism for Privacy-Preserving Data Analysis".</p>
</div>`
};
