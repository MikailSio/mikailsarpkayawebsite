window.PRIVACY_L5 = {
en: `<p class="l-text">In 1965 the sociologist Stanley Warner published a one-page note titled "Randomized Response: A Survey Technique for Eliminating Evasive Answer Bias" (JASA). Warner wanted to estimate the prevalence of stigmatized behaviors — drug use, tax evasion — without surveyors ever learning any one respondent's truth. His protocol: flip a biased coin in private, answer truthfully on heads, lie deterministically on tails. The aggregator can de-bias the population estimate, but no individual answer is informative. Fifty years later this idea — randomization at the source, before any data leaves the device — became the foundation of <em>Local Differential Privacy</em> (LDP).</p>
<p class="l-text">Erlingsson, Pihur and Korolova (Google, 2014) productized it as <strong>RAPPOR</strong> — bit-vector randomized response running inside Chrome to collect homepage hijacking statistics. Apple followed in 2017 with count-mean-sketch and Hadamard-based estimators inside iOS for emoji frequency, QuickType priors, and Safari crash domains (Bittau et al., USENIX Security 2017). Microsoft uses LDP for telemetry in Windows. The defining feature: <em>the aggregator is untrusted</em>. The phone never reveals its real value — it only ever transmits a randomized message. This lesson builds RAPPOR end-to-end in NumPy and contrasts it with the central-DP designs of lessons 1-4.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The local DP threat model and its difference from central DP</li>
<li>Warner's randomized response (1965) and its ε proof</li>
<li>RAPPOR (Erlingsson 2014) — Bloom-filter + bit-flip randomization</li>
<li>Apple's count-mean-sketch and Hadamard mechanisms</li>
<li>Frequency oracles and heavy-hitter recovery from noisy reports</li>
<li>The accuracy cost of LDP — why it needs millions of users</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Local vs Central DP</h2>
<p class="l-text">Central DP (lessons 1-4) assumes a trusted curator who sees raw data and adds noise to outputs. Local DP removes the trust assumption: each user randomizes <em>before</em> transmitting. The aggregator may be malicious, compromised, or subpoenaed — it learns nothing more than the noisy report. The price is steep: LDP estimators have variance that scales with 1/n where n is users (vs. 1/n² for central DP). LDP needs millions of clients to work.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Trust model</div><div class="card-body">Central: trust the curator. Local: trust no one — randomize on the device before sending.</div></div>
<div class="calc-card"><div class="card-title">Noise location</div><div class="card-body">Central: on the aggregate. Local: on each individual report. More noise total, but stronger guarantee.</div></div>
<div class="calc-card"><div class="card-title">Use case</div><div class="card-body">Telemetry, emoji counts, URL hijack detection. Anywhere the server is honest-but-curious or worse.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Warner's Randomized Response (1965)</h2>
<p class="l-text">Warner's protocol for a yes/no sensitive question Q. Each respondent privately flips a coin with bias p. Heads (prob p): answer Q truthfully. Tails (prob 1-p): always answer "yes". The aggregator counts ŷ = (number of "yes" reports)/n and recovers the true rate via debiasing. The mechanism satisfies ε-LDP with ε = ln(p/(1-p)).</p>
<div class="katex-block">$$\\Pr[M(x) = y] \\le e^{\\varepsilon} \\cdot \\Pr[M(x') = y] \\quad \\forall x, x', y$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">warner_report</span>(true_bit, p=<span class="num">0.75</span>, rng=rng):
    <span class="cm"># truthful with prob p, else always say yes</span>
    <span class="kw">return</span> true_bit <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; p <span class="kw">else</span> <span class="num">1</span>

<span class="kw">def</span> <span class="fn">warner_estimate</span>(reports, p=<span class="num">0.75</span>):
    y = np.<span class="fn">mean</span>(reports)
    <span class="cm"># Debias: y = p*pi + (1-p)*1  =&gt;  pi = (y - (1-p))/p</span>
    <span class="kw">return</span> (y - (<span class="num">1</span>-p)) / p

truth = (rng.<span class="fn">random</span>(50_000) &lt; <span class="num">0.30</span>).<span class="fn">astype</span>(<span class="fn">int</span>)   <span class="cm"># true rate 30%</span>
reports = np.<span class="fn">array</span>([<span class="fn">warner_report</span>(b) <span class="kw">for</span> b <span class="kw">in</span> truth])
<span class="fn">print</span>(<span class="str">"Naive count of 'yes':"</span>, reports.<span class="fn">mean</span>())
<span class="fn">print</span>(<span class="str">"Warner debiased estimate:"</span>, <span class="fn">warner_estimate</span>(reports))
<span class="fn">print</span>(<span class="str">"ε ="</span>, np.<span class="fn">log</span>(<span class="num">0.75</span>/<span class="num">0.25</span>).<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) each respondent reports their true bit with probability p = 0.75 and otherwise deterministically reports "yes" — the local randomization that achieves ε-LDP. 2) the naïve mean of the reports is biased upward because of the forced "yes" branch. 3) Warner debiasing inverts the linear contamination model y = p·π + (1-p)·1 and solves for π = (y − (1-p)) / p, recovering the true rate. 4) ε = ln(p / (1-p)) = ln(0.75/0.25) ≈ 1.10, the local privacy budget spent per response.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. RAPPOR — Google's Bit-Vector Randomized Response</h2>
<p class="l-text">RAPPOR (Erlingsson et al., CCS 2014) generalizes Warner to high-cardinality strings. Step 1: hash the value into a Bloom filter of B bits. Step 2: <em>permanent randomized response</em> — flip each bit with probability f to defeat longitudinal attacks. Step 3: <em>instantaneous randomized response</em> — flip again per-report with probabilities (q, 1-p) so two reports of the same value differ each time. The server fits a regression to recover the underlying frequency distribution.</p>
<div class="katex-block">$$\\varepsilon = 2 h \\ln \\frac{1 - 0.5 f}{0.5 f}$$</div>
<p class="l-text">where h is the number of Bloom hash functions. Run RAPPOR on simulated user values:</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">RAPPOR bit-vector randomized response — frequency recovery from noisy reports</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, hashlib
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
B, h = <span class="num">64</span>, <span class="num">2</span>                    <span class="cm"># 64-bit Bloom filter, 2 hash functions</span>

<span class="kw">def</span> <span class="fn">bloom</span>(v, B=B, h=h):
    out = np.<span class="fn">zeros</span>(B, dtype=<span class="fn">int</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(h):
        idx = <span class="fn">int</span>(hashlib.<span class="fn">md5</span>(f<span class="str">"{i}:{v}"</span>.<span class="fn">encode</span>()).<span class="fn">hexdigest</span>(), <span class="num">16</span>) % B
        out[idx] = <span class="num">1</span>
    <span class="kw">return</span> out

<span class="kw">def</span> <span class="fn">rappor</span>(v, f=<span class="num">0.5</span>, p=<span class="num">0.75</span>, q=<span class="num">0.25</span>):
    b = <span class="fn">bloom</span>(v)
    <span class="cm"># Permanent randomized response (per-user, persisted)</span>
    prr = np.<span class="fn">where</span>(rng.<span class="fn">random</span>(B) &lt; <span class="num">0.5</span>*f, rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, B), b)
    <span class="cm"># Instantaneous response (per-report)</span>
    <span class="kw">return</span> np.<span class="fn">where</span>(prr == <span class="num">1</span>, rng.<span class="fn">random</span>(B) &lt; p, rng.<span class="fn">random</span>(B) &lt; q).<span class="fn">astype</span>(<span class="fn">int</span>)

<span class="cm"># Simulate population: 60% prefer "pizza", 30% "burger", 10% "salad"</span>
N = 30_000
true = rng.<span class="fn">choice</span>([<span class="str">"pizza"</span>,<span class="str">"burger"</span>,<span class="str">"salad"</span>], size=N, p=[<span class="num">0.6</span>,<span class="num">0.3</span>,<span class="num">0.1</span>])
reports = np.<span class="fn">array</span>([<span class="fn">rappor</span>(v) <span class="kw">for</span> v <span class="kw">in</span> true])

<span class="cm"># Recover: for each candidate string, regress its bloom signature onto report sums</span>
counts = reports.<span class="fn">sum</span>(axis=<span class="num">0</span>)
<span class="kw">for</span> cand <span class="kw">in</span> [<span class="str">"pizza"</span>,<span class="str">"burger"</span>,<span class="str">"salad"</span>,<span class="str">"kebab"</span>]:
    sig = <span class="fn">bloom</span>(cand)
    <span class="cm"># Approximate: dot product / sum, debiased crudely</span>
    raw = (counts * sig).<span class="fn">sum</span>() / sig.<span class="fn">sum</span>()
    debiased = (raw - N*<span class="num">0.5</span>) / (<span class="num">0.75</span> - <span class="num">0.25</span>) / N
    <span class="fn">print</span>(f<span class="str">"{cand:8s}  estimated freq = {max(0, debiased):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) hashes the string value through h = 2 MD5-derived hash functions into a B = 64-bit Bloom filter — the only stage that depends on the true value. 2) permanent randomized response (PRR): each Bloom bit is independently replaced by a uniform coin flip with probability 0.5·f, otherwise kept; the same PRR persists across all of that user's future reports. 3) instantaneous randomized response (IRR): on every transmission, each PRR bit is re-randomized with parameters (p, q) so identical values produce different network outputs each time. 4) the server sums the reports per bit and, for each candidate, computes a debiased frequency estimate from the Bloom signature.</p>
</div>
<p class="l-text">RAPPOR's killer feature is longitudinal protection: even if the same user reports daily for a year, all reports trace back to one randomized PRR — the attacker cannot average them out.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Apple's Count-Mean-Sketch</h2>
<p class="l-text">Apple's Differential Privacy Team (Bittau, Erlingsson et al., 2017) deployed a different LDP scheme for iOS telemetry: <em>count-mean-sketch</em> (CMS) with Hadamard transform compression. Each user picks a random hash function from a family, hashes their value to k buckets, randomizes the resulting vector, and sends one row plus the hash index. The server averages over millions of users to recover frequencies.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, hashlib
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
m, k = <span class="num">16</span>, <span class="num">1024</span>            <span class="cm"># 16 hash functions, 1024 buckets each</span>

<span class="kw">def</span> <span class="fn">cms_encode</span>(v, eps=<span class="num">2.0</span>):
    j = rng.<span class="fn">integers</span>(<span class="num">0</span>, m)               <span class="cm"># pick random hash</span>
    bucket = <span class="fn">int</span>(hashlib.<span class="fn">md5</span>(f<span class="str">"{j}:{v}"</span>.<span class="fn">encode</span>()).<span class="fn">hexdigest</span>(), <span class="num">16</span>) % k
    vec = -np.<span class="fn">ones</span>(k); vec[bucket] = <span class="num">1</span>   <span class="cm"># +/-1 sketch</span>
    <span class="cm"># Randomized response: flip each entry w.p. 1/(1+e^eps)</span>
    flip_p = <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(eps))
    flips = rng.<span class="fn">random</span>(k) &lt; flip_p
    vec = np.<span class="fn">where</span>(flips, -vec, vec)
    <span class="kw">return</span> j, vec

<span class="kw">def</span> <span class="fn">cms_decode</span>(reports, candidate, eps=<span class="num">2.0</span>):
    c = (np.<span class="fn">exp</span>(eps)+<span class="num">1</span>)/(np.<span class="fn">exp</span>(eps)-<span class="num">1</span>)
    estimates = []
    <span class="kw">for</span> j_idx, vec <span class="kw">in</span> reports:
        bucket = <span class="fn">int</span>(hashlib.<span class="fn">md5</span>(f<span class="str">"{j_idx}:{candidate}"</span>.<span class="fn">encode</span>()).<span class="fn">hexdigest</span>(), <span class="num">16</span>) % k
        estimates.<span class="fn">append</span>(c * (k/(k-<span class="num">1</span>)) * (vec[bucket] - <span class="num">1</span>/k))
    <span class="kw">return</span> np.<span class="fn">median</span>(estimates)

values = rng.<span class="fn">choice</span>([<span class="str">"A"</span>,<span class="str">"B"</span>,<span class="str">"C"</span>,<span class="str">"D"</span>], size=20_000, p=[<span class="num">0.5</span>,<span class="num">0.3</span>,<span class="num">0.15</span>,<span class="num">0.05</span>])
reports = [<span class="fn">cms_encode</span>(v) <span class="kw">for</span> v <span class="kw">in</span> values]
<span class="kw">for</span> cand <span class="kw">in</span> [<span class="str">"A"</span>,<span class="str">"B"</span>,<span class="str">"C"</span>,<span class="str">"D"</span>,<span class="str">"Z"</span>]:
    est = <span class="fn">cms_decode</span>(reports, cand)
    <span class="fn">print</span>(f<span class="str">"{cand}: est freq = {max(0, est)/len(values):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) each client picks a random hash index j ∈ [m] and maps its value v to one of k buckets — a ±1 sketch row with a single +1 at the hashed bucket. 2) randomized response then flips each of the k entries with probability 1/(1+e^ε), satisfying ε-LDP locally. 3) the aggregator collects all (j, vec) pairs; for each candidate it looks up the matching bucket across all reports and applies the debias constant c = (e^ε + 1) / (e^ε − 1). 4) the median over hash families gives a robust frequency estimate while sending only O(k) bits per user.</p>
<p class="l-text">CMS sends only one bucket vector per user — bandwidth-efficient at iOS's scale of hundreds of millions of devices.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Frequency Oracles and Heavy Hitters</h2>
<p class="l-text">A <em>frequency oracle</em> answers "how many users hold value v?" from LDP reports. RAPPOR and CMS are both frequency oracles. The harder problem is <em>heavy hitters</em>: discovering which values are popular when the universe is unbounded (e.g., URLs, bigrams). TreeHist (Bassily-Smith 2015) and PEM (Bassily-Stemmer 2017) solve this via prefix trees + adaptive querying, used by Apple for "popular emojis" and "trending Safari domains".</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Asymptotic bound (Bassily-Smith 2015): with ε-LDP, the optimal heavy-hitter algorithm finds top-k items with error O(√(log(B)/n)/ε) where B is universe size, n is users. Below ~1M users, LDP heavy-hitters are essentially useless — this is why LDP is exclusively a hyperscale tool.</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Comparing Mechanisms</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Warner RR</div><div class="card-body">Yes/no questions. ε = ln(p/(1-p)). Variance n·p(1-p). Foundation, not production.</div></div>
<div class="calc-card"><div class="card-title">RAPPOR</div><div class="card-body">High-cardinality strings. Bloom + 2-stage RR. Longitudinal protection. Chrome telemetry.</div></div>
<div class="calc-card"><div class="card-title">CMS</div><div class="card-body">Pick one of m hash functions. Bandwidth: O(k) bits. Apple iOS emoji + QuickType.</div></div>
<div class="calc-card"><div class="card-title">Hadamard</div><div class="card-body">Sample one Hadamard coefficient. 1 bit per report. Apple Safari crash domains.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (compare empirically)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Variance comparison: Warner vs CMS vs central Laplace at fixed eps</span>
<span class="cm"># Run on simulated population, plot RMSE vs n. Skipped here for brevity;</span>
<span class="cm"># google-differential-privacy/learning has full benchmarks.</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">def</span> <span class="fn">warner_var</span>(n, p): <span class="kw">return</span> p*(<span class="num">1</span>-p)/n
<span class="kw">def</span> <span class="fn">laplace_var</span>(n, eps): <span class="kw">return</span> <span class="num">2</span>/(n*eps)**<span class="num">2</span>
<span class="fn">print</span>(<span class="str">"Warner var (n=1e6, p=0.75):"</span>, <span class="fn">warner_var</span>(1_000_000, <span class="num">0.75</span>))
<span class="fn">print</span>(<span class="str">"Central Laplace var:        "</span>, <span class="fn">laplace_var</span>(1_000_000, <span class="num">1.0</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Warner RR variance scales as p(1-p)/n — the local randomization dominates and shrinks only as 1/n, so accuracy needs hyperscale populations. 2) RAPPOR pays additional Bloom-filter overhead (hash collisions inflate variance vs the pure Warner case). 3) CMS sketches trade off bucket count k against accuracy: more buckets reduce collisions but use more bandwidth. 4) central Laplace variance shrinks as 1/(n·ε)² — orders of magnitude tighter at the same n and ε, which is why central DP wins whenever a trusted curator is available.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Production LDP — Lessons from Apple and Google</h2>
<p class="l-text">Three production lessons. (1) <em>Per-user budget caps</em>: Apple limits each device to a fixed number of LDP submissions per category per day, preventing budget exhaustion via repeat reporting. (2) <em>Privacy budget transparency</em>: Apple publishes ε per use case (~2-8 typically); Google publishes RAPPOR parameters in source. (3) <em>Re-identification audit</em>: deploy LDP only after testing that even with full report history, no individual is identifiable. Microsoft's PrivTree and Differential Privacy in SQL Server rely on similar invariants.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. When NOT to Use LDP</h2>
<p class="l-text">LDP is wrong when (a) you have fewer than ~10⁵ users — variance dominates signal; (b) you can deploy a trusted execution environment (Intel SGX, AWS Nitro Enclaves) — central DP gives orders of magnitude better accuracy; (c) you need to release rich statistics (regressions, ML training) — LDP-based ML training is an active research frontier (LDP-FedAvg, LDP-SGD) but with painful utility loss compared to central DP-SGD or shuffling-model DP. The shuffle model (Erlingsson 2019, Cheu 2019) — anonymous shuffling between client and server — is a strict middle ground that often dominates LDP for the same threat model.</p>
</div>`,
tr: `<p class="l-text">1965'te sosyolog Stanley Warner "Randomized Response: A Survey Technique for Eliminating Evasive Answer Bias" (JASA) başlıklı tek sayfalık bir not yayımladı. Warner, anketörlerin herhangi bir katılımcının doğrusunu hiç öğrenmeden damgalanmış davranışların — uyuşturucu kullanımı, vergi kaçakçılığı — yaygınlığını tahmin etmek istedi. Protokolü: özelinde önyargılı bir madeni para atın, yazıda doğru cevap verin, turada deterministik olarak yalan söyleyin. Toplayıcı popülasyon tahminini yansızlaştırabilir ama hiçbir bireysel cevap bilgilendirici değildir. Elli yıl sonra bu fikir — kaynakta, herhangi bir veri cihazı terk etmeden önce randomizasyon — <em>Yerel Diferansiyel Gizlilik</em>'in (LDP) temeli oldu.</p>
<p class="l-text">Erlingsson, Pihur ve Korolova (Google, 2014) bunu <strong>RAPPOR</strong> olarak ürünleştirdiler — ana sayfa ele geçirme istatistiklerini toplamak için Chrome içinde çalışan bit-vektör randomize yanıtı. Apple 2017'de iOS içinde emoji frekansı, QuickType önsel ve Safari çökme alan adları için count-mean-sketch ve Hadamard tabanlı tahmincilerle takip etti (Bittau vd., USENIX Security 2017). Microsoft, Windows'ta telemetri için LDP kullanır. Tanımlayıcı özellik: <em>toplayıcı güvenilmezdir</em>. Telefon gerçek değerini asla açıklamaz — yalnızca randomize edilmiş bir mesaj iletir. Bu ders RAPPOR'u NumPy'da uçtan uca inşa eder ve onu 1-4 derslerinin merkezi-DP tasarımlarıyla karşılaştırır.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Yerel DP tehdit modeli ve merkezi DP'den farkı</li>
<li>Warner'ın randomize yanıtı (1965) ve ε kanıtı</li>
<li>RAPPOR (Erlingsson 2014) — Bloom-filtre + bit-flip randomizasyonu</li>
<li>Apple'ın count-mean-sketch ve Hadamard mekanizmaları</li>
<li>Frekans oracle'ları ve gürültülü raporlardan heavy-hitter kurtarma</li>
<li>LDP'nin doğruluk maliyeti — neden milyonlarca kullanıcı gerektirdiği</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Yerel vs Merkezi DP</h2>
<p class="l-text">Merkezi DP (1-4 dersleri), ham veriyi gören ve çıktılara gürültü ekleyen güvenilir bir koordinatör varsayar. Yerel DP güven varsayımını kaldırır: her kullanıcı iletmeden <em>önce</em> randomize eder. Toplayıcı kötü niyetli, ihlal edilmiş veya celp edilmiş olabilir — gürültülü rapordan başka bir şey öğrenmez. Bedel ağırdır: LDP tahmincilerinin varyansı 1/n ile ölçeklenir, n kullanıcı sayısıdır (merkezi DP için 1/n²'ye karşı). LDP çalışması için milyonlarca istemci gerektirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Güven modeli</div><div class="card-body">Merkezi: koordinatöre güven. Yerel: kimseye güvenme — göndermeden önce cihazda randomize et.</div></div>
<div class="calc-card"><div class="card-title">Gürültü konumu</div><div class="card-body">Merkezi: toplamda. Yerel: her bireysel raporda. Toplam daha fazla gürültü, ama daha güçlü garanti.</div></div>
<div class="calc-card"><div class="card-title">Kullanım durumu</div><div class="card-body">Telemetri, emoji sayımları, URL ele geçirme tespiti. Sunucunun dürüst-ama-meraklı veya daha kötü olduğu her yer.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Warner'ın Randomize Yanıtı (1965)</h2>
<p class="l-text">Bir yes/no hassas soru Q için Warner'ın protokolü. Her katılımcı özelinde önyargı p ile bir madeni para atar. Yazı (olasılık p): Q'yu doğru cevapla. Tura (olasılık 1-p): her zaman "evet" cevapla. Toplayıcı ŷ = ("evet" rapor sayısı)/n hesaplar ve gerçek oranı yansızlaştırma yoluyla kurtarır. Mekanizma ε = ln(p/(1-p)) ile ε-LDP'yi karşılar.</p>
<div class="katex-block">$$\\Pr[M(x) = y] \\le e^{\\varepsilon} \\cdot \\Pr[M(x') = y] \\quad \\forall x, x', y$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">warner_report</span>(true_bit, p=<span class="num">0.75</span>, rng=rng):
    <span class="cm"># p olasılıkla doğru, aksi halde her zaman evet</span>
    <span class="kw">return</span> true_bit <span class="kw">if</span> rng.<span class="fn">random</span>() &lt; p <span class="kw">else</span> <span class="num">1</span>

<span class="kw">def</span> <span class="fn">warner_estimate</span>(reports, p=<span class="num">0.75</span>):
    y = np.<span class="fn">mean</span>(reports)
    <span class="cm"># Yansızlaştır: y = p*pi + (1-p)*1  =&gt;  pi = (y - (1-p))/p</span>
    <span class="kw">return</span> (y - (<span class="num">1</span>-p)) / p

truth = (rng.<span class="fn">random</span>(50_000) &lt; <span class="num">0.30</span>).<span class="fn">astype</span>(<span class="fn">int</span>)   <span class="cm"># gerçek oran 30%</span>
reports = np.<span class="fn">array</span>([<span class="fn">warner_report</span>(b) <span class="kw">for</span> b <span class="kw">in</span> truth])
<span class="fn">print</span>(<span class="str">"Naive count of 'yes':"</span>, reports.<span class="fn">mean</span>())
<span class="fn">print</span>(<span class="str">"Warner debiased estimate:"</span>, <span class="fn">warner_estimate</span>(reports))
<span class="fn">print</span>(<span class="str">"ε ="</span>, np.<span class="fn">log</span>(<span class="num">0.75</span>/<span class="num">0.25</span>).<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) her katılımcı gerçek bitini p = 0.75 olasılığıyla raporlar, aksi halde deterministik olarak "evet" der — yerel randomizasyon ε-LDP'yi sağlar. 2) raporların naif ortalaması, zorla "evet" dalı yüzünden yukarı yanlıdır. 3) Warner yansızlaştırması doğrusal kontaminasyon modelini y = p·π + (1-p)·1 tersine çevirir ve π = (y − (1-p)) / p için çözer, gerçek oranı kurtarır. 4) ε = ln(p / (1-p)) = ln(0.75/0.25) ≈ 1.10, yanıt başına harcanan yerel gizlilik bütçesidir.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. RAPPOR — Google'ın Bit-Vektör Randomize Yanıtı</h2>
<p class="l-text">RAPPOR (Erlingsson vd., CCS 2014) Warner'ı yüksek-kardinaliteli dizgilere genelleştirir. Adım 1: değeri B bitlik bir Bloom filtresine hash'le. Adım 2: <em>kalıcı randomize yanıt</em> — boylamsal saldırılara karşı her biti olasılık f ile çevir. Adım 3: <em>anlık randomize yanıt</em> — aynı değerin iki raporu her zaman farklı olsun diye olasılıklarla (q, 1-p) rapor başına tekrar çevir. Sunucu altta yatan frekans dağılımını kurtarmak için bir regresyon uydurur.</p>
<div class="katex-block">$$\\varepsilon = 2 h \\ln \\frac{1 - 0.5 f}{0.5 f}$$</div>
<p class="l-text">burada h Bloom hash fonksiyonlarının sayısıdır. Simüle kullanıcı değerleri üzerinde RAPPOR çalıştırın:</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">RAPPOR bit-vektör randomize yanıtı — gürültülü raporlardan frekans kurtarma</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, hashlib
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
B, h = <span class="num">64</span>, <span class="num">2</span>                    <span class="cm"># 64-bit Bloom filtresi, 2 hash fonksiyonu</span>

<span class="kw">def</span> <span class="fn">bloom</span>(v, B=B, h=h):
    out = np.<span class="fn">zeros</span>(B, dtype=<span class="fn">int</span>)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(h):
        idx = <span class="fn">int</span>(hashlib.<span class="fn">md5</span>(f<span class="str">"{i}:{v}"</span>.<span class="fn">encode</span>()).<span class="fn">hexdigest</span>(), <span class="num">16</span>) % B
        out[idx] = <span class="num">1</span>
    <span class="kw">return</span> out

<span class="kw">def</span> <span class="fn">rappor</span>(v, f=<span class="num">0.5</span>, p=<span class="num">0.75</span>, q=<span class="num">0.25</span>):
    b = <span class="fn">bloom</span>(v)
    <span class="cm"># Kalıcı randomize yanıt (kullanıcı başına, kalıcı)</span>
    prr = np.<span class="fn">where</span>(rng.<span class="fn">random</span>(B) &lt; <span class="num">0.5</span>*f, rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, B), b)
    <span class="cm"># Anlık yanıt (rapor başına)</span>
    <span class="kw">return</span> np.<span class="fn">where</span>(prr == <span class="num">1</span>, rng.<span class="fn">random</span>(B) &lt; p, rng.<span class="fn">random</span>(B) &lt; q).<span class="fn">astype</span>(<span class="fn">int</span>)

<span class="cm"># Popülasyon simüle et: %60 "pizza", %30 "burger", %10 "salad" tercih ediyor</span>
N = 30_000
true = rng.<span class="fn">choice</span>([<span class="str">"pizza"</span>,<span class="str">"burger"</span>,<span class="str">"salad"</span>], size=N, p=[<span class="num">0.6</span>,<span class="num">0.3</span>,<span class="num">0.1</span>])
reports = np.<span class="fn">array</span>([<span class="fn">rappor</span>(v) <span class="kw">for</span> v <span class="kw">in</span> true])

<span class="cm"># Kurtar: her aday dizgi için, bloom imzasını rapor toplamlarına regresyon yap</span>
counts = reports.<span class="fn">sum</span>(axis=<span class="num">0</span>)
<span class="kw">for</span> cand <span class="kw">in</span> [<span class="str">"pizza"</span>,<span class="str">"burger"</span>,<span class="str">"salad"</span>,<span class="str">"kebab"</span>]:
    sig = <span class="fn">bloom</span>(cand)
    <span class="cm"># Yaklaşık: nokta çarpım / toplam, kabaca yansızlaştırıldı</span>
    raw = (counts * sig).<span class="fn">sum</span>() / sig.<span class="fn">sum</span>()
    debiased = (raw - N*<span class="num">0.5</span>) / (<span class="num">0.75</span> - <span class="num">0.25</span>) / N
    <span class="fn">print</span>(f<span class="str">"{cand:8s}  estimated freq = {max(0, debiased):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) dizgi değeri h = 2 MD5 türevli hash fonksiyonuyla B = 64-bit Bloom filtresine hash'lenir — gerçek değere bağlı olan tek aşama. 2) kalıcı randomize yanıt (PRR): her Bloom biti 0.5·f olasılığıyla bağımsız bir tek tip yazı-tura ile değiştirilir, aksi halde korunur; aynı PRR o kullanıcının gelecekteki tüm raporları boyunca kalıcıdır. 3) anlık randomize yanıt (IRR): her iletimde, her PRR biti (p, q) parametreleriyle yeniden randomize edilir; aynı değer her seferinde farklı ağ çıktıları üretir. 4) sunucu raporları bit başına toplar ve her aday için Bloom imzasından yansızlaştırılmış bir frekans tahmini hesaplar.</p>
</div>
<p class="l-text">RAPPOR'un öldürücü özelliği boylamsal korumadır: aynı kullanıcı bir yıl boyunca günlük rapor verse bile, tüm raporlar tek bir randomize PRR'ye geri izlenir — saldırgan onları ortalama alarak çıkaramaz.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Apple'ın Count-Mean-Sketch'i</h2>
<p class="l-text">Apple'ın Differential Privacy Ekibi (Bittau, Erlingsson vd., 2017) iOS telemetrisi için farklı bir LDP şeması dağıttı: Hadamard dönüşümü sıkıştırması ile <em>count-mean-sketch</em> (CMS). Her kullanıcı bir aileden rastgele bir hash fonksiyonu seçer, değerini k kovaya hash'ler, ortaya çıkan vektörü randomize eder ve bir satır artı hash indisini gönderir. Sunucu frekansları kurtarmak için milyonlarca kullanıcı üzerinde ortalama alır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, hashlib
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
m, k = <span class="num">16</span>, <span class="num">1024</span>            <span class="cm"># 16 hash fonksiyonu, her biri 1024 kova</span>

<span class="kw">def</span> <span class="fn">cms_encode</span>(v, eps=<span class="num">2.0</span>):
    j = rng.<span class="fn">integers</span>(<span class="num">0</span>, m)               <span class="cm"># rastgele hash seç</span>
    bucket = <span class="fn">int</span>(hashlib.<span class="fn">md5</span>(f<span class="str">"{j}:{v}"</span>.<span class="fn">encode</span>()).<span class="fn">hexdigest</span>(), <span class="num">16</span>) % k
    vec = -np.<span class="fn">ones</span>(k); vec[bucket] = <span class="num">1</span>   <span class="cm"># +/-1 sketch</span>
    <span class="cm"># Randomize yanıt: her girişi olasılık 1/(1+e^eps) ile çevir</span>
    flip_p = <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(eps))
    flips = rng.<span class="fn">random</span>(k) &lt; flip_p
    vec = np.<span class="fn">where</span>(flips, -vec, vec)
    <span class="kw">return</span> j, vec

<span class="kw">def</span> <span class="fn">cms_decode</span>(reports, candidate, eps=<span class="num">2.0</span>):
    c = (np.<span class="fn">exp</span>(eps)+<span class="num">1</span>)/(np.<span class="fn">exp</span>(eps)-<span class="num">1</span>)
    estimates = []
    <span class="kw">for</span> j_idx, vec <span class="kw">in</span> reports:
        bucket = <span class="fn">int</span>(hashlib.<span class="fn">md5</span>(f<span class="str">"{j_idx}:{candidate}"</span>.<span class="fn">encode</span>()).<span class="fn">hexdigest</span>(), <span class="num">16</span>) % k
        estimates.<span class="fn">append</span>(c * (k/(k-<span class="num">1</span>)) * (vec[bucket] - <span class="num">1</span>/k))
    <span class="kw">return</span> np.<span class="fn">median</span>(estimates)

values = rng.<span class="fn">choice</span>([<span class="str">"A"</span>,<span class="str">"B"</span>,<span class="str">"C"</span>,<span class="str">"D"</span>], size=20_000, p=[<span class="num">0.5</span>,<span class="num">0.3</span>,<span class="num">0.15</span>,<span class="num">0.05</span>])
reports = [<span class="fn">cms_encode</span>(v) <span class="kw">for</span> v <span class="kw">in</span> values]
<span class="kw">for</span> cand <span class="kw">in</span> [<span class="str">"A"</span>,<span class="str">"B"</span>,<span class="str">"C"</span>,<span class="str">"D"</span>,<span class="str">"Z"</span>]:
    est = <span class="fn">cms_decode</span>(reports, cand)
    <span class="fn">print</span>(f<span class="str">"{cand}: est freq = {max(0, est)/len(values):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) her istemci rastgele bir hash indisi j ∈ [m] seçer ve değeri v'yi k kovadan birine eşler — hash'lenen kovada tek bir +1 olan ±1'lik bir sketch satırı oluşur. 2) randomize yanıt, k girişin her birini 1/(1+e^ε) olasılığıyla çevirir; yerel olarak ε-LDP'yi karşılar. 3) toplayıcı tüm (j, vec) çiftlerini toplar; her aday için eşleşen kovayı tüm raporlarda arar ve yansızlaştırma sabiti c = (e^ε + 1) / (e^ε − 1) uygulanır. 4) hash aileleri üzerindeki medyan, kullanıcı başına yalnızca O(k) bit göndererek sağlam bir frekans tahmini verir.</p>
<p class="l-text">CMS kullanıcı başına yalnızca bir kova vektörü gönderir — iOS'un yüz milyonlarca cihaz ölçeğinde bant genişliği verimli.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Frekans Oracle'ları ve Heavy Hitter'lar</h2>
<p class="l-text">Bir <em>frekans oracle</em>, LDP raporlarından "kaç kullanıcı v değerini tutuyor?" sorusuna yanıt verir. RAPPOR ve CMS'nin her ikisi de frekans oracle'larıdır. Daha zor problem <em>heavy hitter</em>'lardır: evren sınırsız olduğunda hangi değerlerin popüler olduğunu keşfetmek (ör. URL'ler, bigram'lar). TreeHist (Bassily-Smith 2015) ve PEM (Bassily-Stemmer 2017) bunu önek ağaçları + uyarlanabilir sorgulama ile çözer; Apple "popüler emojiler" ve "trend Safari alan adları" için kullanır.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Asimptotik sınır (Bassily-Smith 2015): ε-LDP ile, optimal heavy-hitter algoritması top-k öğeleri O(√(log(B)/n)/ε) hatasıyla bulur; B evren boyutu, n kullanıcı sayısıdır. ~1M kullanıcı altında, LDP heavy-hitter'lar esasen işe yaramazdır — bu yüzden LDP yalnızca hyperscale aracıdır.</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Mekanizmaları Karşılaştırmak</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Warner RR</div><div class="card-body">Yes/no soruları. ε = ln(p/(1-p)). Varyans n·p(1-p). Temel, üretim değil.</div></div>
<div class="calc-card"><div class="card-title">RAPPOR</div><div class="card-body">Yüksek kardinaliteli dizgiler. Bloom + 2 aşamalı RR. Boylamsal koruma. Chrome telemetri.</div></div>
<div class="calc-card"><div class="card-title">CMS</div><div class="card-body">m hash fonksiyonundan birini seç. Bant genişliği: O(k) bit. Apple iOS emoji + QuickType.</div></div>
<div class="calc-card"><div class="card-title">Hadamard</div><div class="card-body">Bir Hadamard katsayısı örnekle. Rapor başına 1 bit. Apple Safari çökme alan adları.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — SADECE DEMO (deneysel olarak karşılaştır)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Varyans karşılaştırması: Warner vs CMS vs sabit eps'te merkezi Laplace</span>
<span class="cm"># Simüle popülasyon üzerinde çalıştır, n'ye karşı RMSE çiz. Kısa olsun diye atlandı;</span>
<span class="cm"># google-differential-privacy/learning'de tam benchmark'lar var.</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">def</span> <span class="fn">warner_var</span>(n, p): <span class="kw">return</span> p*(<span class="num">1</span>-p)/n
<span class="kw">def</span> <span class="fn">laplace_var</span>(n, eps): <span class="kw">return</span> <span class="num">2</span>/(n*eps)**<span class="num">2</span>
<span class="fn">print</span>(<span class="str">"Warner var (n=1e6, p=0.75):"</span>, <span class="fn">warner_var</span>(1_000_000, <span class="num">0.75</span>))
<span class="fn">print</span>(<span class="str">"Central Laplace var:        "</span>, <span class="fn">laplace_var</span>(1_000_000, <span class="num">1.0</span>))
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Warner RR varyansı p(1-p)/n ile ölçeklenir — yerel randomizasyon baskındır ve yalnızca 1/n hızında küçülür, doğruluk için hyperscale popülasyon gerektirir. 2) RAPPOR ek Bloom filtresi yükü öder (hash çakışmaları varyansı saf Warner durumuna kıyasla şişirir). 3) CMS sketch'leri kova sayısı k ile doğruluk arasında takas yapar: daha çok kova çakışmaları azaltır ama daha fazla bant genişliği kullanır. 4) merkezi Laplace varyansı 1/(n·ε)² hızında küçülür — aynı n ve ε'da büyüklük sıralamalarında daha sıkı; güvenilir bir koordinatör mevcutsa merkezi DP'nin kazanmasının nedeni budur.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Üretim LDP — Apple ve Google'dan Dersler</h2>
<p class="l-text">Üç üretim dersi. (1) <em>Kullanıcı başına bütçe sınırları</em>: Apple, her cihazı kategori başına gün başına sabit sayıda LDP gönderimiyle sınırlar; tekrar raporlama yoluyla bütçe tükenmesini önler. (2) <em>Gizlilik bütçesi şeffaflığı</em>: Apple her kullanım durumu için ε yayımlar (~tipik olarak 2-8); Google RAPPOR parametrelerini kaynakta yayımlar. (3) <em>Yeniden tanımlama denetimi</em>: LDP'yi yalnızca tam rapor geçmişi ile bile hiçbir bireyin tanımlanamayacağını test ettikten sonra dağıtın. Microsoft'un PrivTree ve SQL Server'daki Differential Privacy benzer değişmezlere dayanır.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. LDP NE ZAMAN Kullanılmamalı</h2>
<p class="l-text">LDP, (a) ~10⁵'ten az kullanıcınız varsa — varyans sinyale egemen olur; (b) güvenilir bir yürütme ortamı (Intel SGX, AWS Nitro Enclaves) dağıtabilirseniz — merkezi DP büyüklük sıralamalarında daha iyi doğruluk verir; (c) zengin istatistikler yayımlamanız gerekiyorsa (regresyonlar, ML eğitimi) — LDP-tabanlı ML eğitimi aktif bir araştırma alanıdır (LDP-FedAvg, LDP-SGD) ama merkezi DP-SGD veya shuffling-modeli DP'ye kıyasla acılı fayda kaybıyla. Shuffle modeli (Erlingsson 2019, Cheu 2019) — istemci ve sunucu arasında anonim karıştırma — aynı tehdit modeli için sıklıkla LDP'ye baskın çıkan katı bir orta yoldur.</p>
</div>`
};
