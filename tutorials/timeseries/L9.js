window.TIMESERIES_L9 = {

en: `<p class="l-text"><strong>A point forecast says "tomorrow's price is $103.42." A probabilistic forecast says "with 90% confidence, tomorrow lands in [$98.10, $107.20]."</strong> The second one is what every business actually needs — inventory, capacity, risk. Yet most ML pipelines ship the first.</p>

<p class="l-text">In this lesson you build prediction intervals four different ways: parametric (DeepAR-style Gaussian likelihood), quantile regression, conformal prediction, and bootstrap. You will compute calibration metrics that tell you when an interval is honest, and learn the one rule that should govern every probabilistic forecast you ship.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Distinguish point, interval, and full predictive-distribution forecasts</li>
<li>Implement DeepAR-style Gaussian likelihood loss in NumPy</li>
<li>Train quantile regression and read the pinball loss</li>
<li>Apply split conformal prediction for distribution-free intervals</li>
<li>Measure coverage, sharpness, and CRPS to judge an interval</li>
<li>Recognize when an interval is over- or under-confident and recalibrate</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Point vs Interval vs Distribution</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Point</div><div class="card-body">A single number, usually the mean. Easy, lossy, dangerous.</div></div>
<div class="calc-card"><div class="card-title">Interval</div><div class="card-body">[lower, upper] at level alpha (e.g. 90%). The decision-maker's minimum.</div></div>
<div class="calc-card"><div class="card-title">Quantiles</div><div class="card-body">P10/P50/P90 (or finer grid). Builds an empirical distribution.</div></div>
<div class="calc-card"><div class="card-title">Full distribution</div><div class="card-body">Parametric (Gaussian, NegBin) or sample-based. Lets you compute any tail.</div></div>
</div>
<div class="calc-highlight">Inventory is set by the 95th percentile of demand, not the mean — under-stocking 5% of the time is a feature, not a bug. Point forecasts cannot tell you the 95th percentile.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. DeepAR — Parametric Likelihood (Salinas 2017)</h2>
<p class="l-text">DeepAR (Amazon, 2017) is a recurrent encoder that, instead of emitting a point, emits the parameters of a likelihood: mean and standard deviation for Gaussian, alpha and mu for negative binomial. Loss is the negative log likelihood: <span class="katex-block">$$\\mathcal{L} = -\\sum_{t} \\log p(y_t \\mid \\mu_t, \\sigma_t)$$</span> Sample from the trained model to get any quantile.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gaussian head</div><div class="card-body">Continuous targets. Cheap. Fails on heavy tails.</div></div>
<div class="calc-card"><div class="card-title">Student-t head</div><div class="card-body">Heavy-tailed alternative. One extra degree-of-freedom parameter.</div></div>
<div class="calc-card"><div class="card-title">NegBin head</div><div class="card-body">Count data (sales, clicks). Industry default for retail.</div></div>
<div class="calc-card"><div class="card-title">Mixture head</div><div class="card-body">K Gaussians for multimodal distributions.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Hand-Coding Gaussian Likelihood</h2>
<p class="l-text">For one observation: <span class="katex-block">$$-\\log p(y) = \\tfrac{1}{2}\\log(2\\pi\\sigma^2) + \\tfrac{(y-\\mu)^2}{2\\sigma^2}$$</span> Two heads (mu and log-sigma) and the standard MSE loss is replaced by NLL. The model now must commit to <em>uncertainty</em>: predicting a tight sigma where it is wrong gets brutally penalized.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">DeepAR</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, hid=<span class="num">32</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.lstm    = nn.<span class="fn">LSTM</span>(<span class="num">1</span>, hid, batch_first=<span class="kw">True</span>)
        self.mu_head = nn.<span class="fn">Linear</span>(hid, <span class="num">1</span>)
        self.lv_head = nn.<span class="fn">Linear</span>(hid, <span class="num">1</span>)         <span class="cm"># log-sigma</span>
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h, _ = self.<span class="fn">lstm</span>(x)
        <span class="kw">return</span> self.<span class="fn">mu_head</span>(h[:, -<span class="num">1</span>]), self.<span class="fn">lv_head</span>(h[:, -<span class="num">1</span>])

<span class="kw">def</span> <span class="fn">gaussian_nll</span>(y, mu, log_sigma):
    sigma = log_sigma.<span class="fn">exp</span>()
    <span class="kw">return</span> (<span class="num">0.5</span>*((y-mu)/sigma)**<span class="num">2</span> + log_sigma).<span class="fn">mean</span>()</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Fit a Gaussian to the rolling residuals of a Ridge baseline on df_stocks, then sample 1000 draws to build a P10/P50/P90 forecast for tomorrow.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
L = <span class="num">10</span>
X = np.<span class="fn">stack</span>([z[i:i+L]   <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-<span class="num">1</span>)])
Y = z[L:-<span class="num">1</span>]
cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)
mdl = <span class="fn">Ridge</span>().<span class="fn">fit</span>(X[:cut], Y[:cut])
resid = Y[:cut] - mdl.<span class="fn">predict</span>(X[:cut])

mu_next  = <span class="fn">float</span>(mdl.<span class="fn">predict</span>(z[-L:][<span class="kw">None</span>])[<span class="num">0</span>])
sig_next = <span class="fn">float</span>(resid.<span class="fn">std</span>())
samples  = np.random.<span class="fn">normal</span>(mu_next, sig_next, size=<span class="num">1000</span>)
p10, p50, p90 = np.<span class="fn">percentile</span>(samples, [<span class="num">10</span>, <span class="num">50</span>, <span class="num">90</span>])
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"mu={mu_next:.2f}  sigma={sig_next:.2f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"P10={p10:.2f}  P50={p50:.2f}  P90={p90:.2f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"interval width: {p90-p10:.2f}"</span>)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Quantile Regression and Pinball Loss</h2>
<p class="l-text">No likelihood assumption needed. For each target quantile <em>tau</em> in (0,1), train one head with the <em>pinball loss</em>: <span class="katex-block">$$L_\\tau(y, \\hat{y}) = \\max\\bigl(\\tau (y-\\hat{y}),\\ (\\tau-1)(y-\\hat{y})\\bigr)$$</span> Train heads for tau = 0.1, 0.5, 0.9 simultaneously and you have a 3-quantile forecast. TFT does this natively.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
L = <span class="num">10</span>
X = np.<span class="fn">stack</span>([z[i:i+L] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-<span class="num">1</span>)])
y = z[L:-<span class="num">1</span>]
cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)

models = {tau: <span class="fn">GradientBoostingRegressor</span>(loss=<span class="str">"quantile"</span>, alpha=tau,
                                          n_estimators=<span class="num">80</span>, max_depth=<span class="num">3</span>,
                                          random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[:cut], y[:cut])
          <span class="kw">for</span> tau <span class="kw">in</span> [<span class="num">0.1</span>, <span class="num">0.5</span>, <span class="num">0.9</span>]}
preds = {tau: m.<span class="fn">predict</span>(X[cut:]) <span class="kw">for</span> tau, m <span class="kw">in</span> models.<span class="fn">items</span>()}
covered = ((y[cut:] &gt;= preds[<span class="num">0.1</span>]) &amp; (y[cut:] &lt;= preds[<span class="num">0.9</span>])).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"empirical 80% coverage:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(covered), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"P50 vs truth MAE:"</span>,
      <span class="fn">round</span>(np.<span class="fn">abs</span>(preds[<span class="num">0.5</span>] - y[cut:]).<span class="fn">mean</span>(), <span class="num">3</span>))</code></pre></div>
<p class="l-text">If your empirical 80% coverage is 0.65 your model is over-confident — the next section fixes that.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Conformal Prediction — Distribution-Free Intervals</h2>
<p class="l-text">Conformal prediction wraps any base model and gives you a finite-sample coverage guarantee. Recipe (split conformal):</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Train</div><div class="card-body">Fit base model on training fold.</div></div>
<div class="calc-card"><div class="card-title">2. Calibrate</div><div class="card-body">On a held-out calibration fold compute residuals s_i = |y_i - mu_i|.</div></div>
<div class="calc-card"><div class="card-title">3. Quantile</div><div class="card-body">q = the (ceil((n+1)(1-alpha))/n)-quantile of the residuals.</div></div>
<div class="calc-card"><div class="card-title">4. Predict</div><div class="card-body">Interval = mu_test ± q. Guaranteed (1-alpha) marginal coverage.</div></div>
</div>
<div class="calc-highlight">Conformal works on top of any model — Ridge, Random Forest, PatchTST. It is the cheapest way to ship honest intervals.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Conformal in Code</h2>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Split conformal on Ridge baseline. Should hit ~90% coverage on the held-out test fold.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
L = <span class="num">10</span>; alpha = <span class="num">0.1</span>            <span class="cm"># target 90% coverage</span>
X = np.<span class="fn">stack</span>([z[i:i+L] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-<span class="num">1</span>)])
y = z[L:-<span class="num">1</span>]

n = <span class="fn">len</span>(X)
i_tr = <span class="fn">int</span>(n*<span class="num">0.6</span>); i_cal = <span class="fn">int</span>(n*<span class="num">0.8</span>)
mdl  = <span class="fn">Ridge</span>().<span class="fn">fit</span>(X[:i_tr], y[:i_tr])

cal_resid = np.<span class="fn">abs</span>(y[i_tr:i_cal] - mdl.<span class="fn">predict</span>(X[i_tr:i_cal]))
n_cal = <span class="fn">len</span>(cal_resid)
q_level = np.<span class="fn">ceil</span>((n_cal + <span class="num">1</span>) * (<span class="num">1</span> - alpha)) / n_cal
q = np.<span class="fn">quantile</span>(cal_resid, <span class="fn">min</span>(q_level, <span class="num">1.0</span>))

mu_te = mdl.<span class="fn">predict</span>(X[i_cal:])
lo, hi = mu_te - q, mu_te + q
y_te = y[i_cal:]
cov = ((y_te &gt;= lo) &amp; (y_te &lt;= hi)).<span class="fn">mean</span>()
width = (hi - lo).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"target coverage:  {1-alpha:.2f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"empirical cov:    {cov:.3f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"average width:    {width:.3f}"</span>)</code></pre></div>
</div>
<p class="l-text">If exchangeability holds (no time drift) coverage will be within sampling error of 0.9. For non-stationary series use <em>adaptive conformal</em> (ACI, Gibbs &amp; Candes 2021).</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Calibration — How Honest Is Your Interval?</h2>
<p class="l-text">For a well-calibrated forecaster the empirical coverage at level alpha equals 1 - alpha. Plot empirical coverage vs nominal across alpha = 0.05, 0.1, ..., 0.95. The diagonal is perfect. Above = under-confident (intervals too wide). Below = over-confident (intervals too tight, dangerous).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Coverage</div><div class="card-body">P(y in interval). Headline metric.</div></div>
<div class="calc-card"><div class="card-title">Sharpness</div><div class="card-body">Average interval width. Lower is better — given good coverage.</div></div>
<div class="calc-card"><div class="card-title">CRPS</div><div class="card-body">Continuous Ranked Probability Score — strictly proper rule for distributions.</div></div>
<div class="calc-card"><div class="card-title">Pinball</div><div class="card-body">Per-quantile loss. Sums into a multi-quantile score.</div></div>
</div>
<div class="calc-highlight">"Sharpness subject to calibration" (Gneiting 2007) — never optimize sharpness without first nailing coverage.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. CRPS — One Number for the Whole Distribution</h2>
<p class="l-text">CRPS generalizes MAE to distributions: <span class="katex-block">$$\\text{CRPS}(F, y) = \\int_{-\\infty}^{\\infty} \\bigl(F(z) - \\mathbb{1}\\{z \\geq y\\}\\bigr)^2 dz$$</span> For an empirical distribution from K samples it reduces to two cheap means.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">crps_sample</span>(samples, y):
    <span class="cm"># samples: (K,)  y: scalar</span>
    term1 = np.<span class="fn">abs</span>(samples - y).<span class="fn">mean</span>()
    term2 = <span class="num">0.5</span> * np.<span class="fn">abs</span>(samples[:, <span class="kw">None</span>] - samples[<span class="kw">None</span>, :]).<span class="fn">mean</span>()
    <span class="kw">return</span> term1 - term2

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
mu, sig = z[:-<span class="num">1</span>].<span class="fn">mean</span>(), z[:-<span class="num">1</span>].<span class="fn">std</span>()
samples = np.random.<span class="fn">normal</span>(mu, sig, size=<span class="num">500</span>)
<span class="fn">print</span>(<span class="str">"CRPS for tomorrow:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(<span class="fn">crps_sample</span>(samples, z[-<span class="num">1</span>])), <span class="num">3</span>))</code></pre></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Recalibration When You Are Off</h2>
<p class="l-text">If empirical coverage is 0.78 but you targeted 0.90, scale your interval. The simplest fix: multiply the conformal radius <em>q</em> by the ratio you need until calibration hits target on a fresh fold. Platt-style sigmoid recalibration also works for quantile heads.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Inflate width</div><div class="card-body">Multiply by k = quantile_target / quantile_observed of residuals.</div></div>
<div class="calc-card"><div class="card-title">Conditional conformal</div><div class="card-body">Bin by feature (e.g. volatility) and conformalize per bin.</div></div>
<div class="calc-card"><div class="card-title">ACI (online)</div><div class="card-body">Update q each step by error feedback. Robust to drift.</div></div>
<div class="calc-card"><div class="card-title">Bootstrap</div><div class="card-body">Resample residuals B=200 times — empirical interval. Slow but trivial.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. The One Rule</h2>
<div class="calc-highlight">Always report (coverage, width, CRPS) — not a single point MAE. A wider but well-calibrated interval is worth more than a tight liar. Probabilistic forecasts are not a luxury; they are how forecasts become decisions.</div>
<p class="l-text">The capstone in lesson 10 puts this into a production pipeline alongside ML models, statistical baselines, and monitoring.</p>
</div>
`,
tr: `<p class="l-text"><strong>Bir nokta tahmini "yarınki fiyat $103.42" der. Bir olasılıksal tahmin "%90 güvenle, yarın [$98.10, $107.20] arasına düşer" der.</strong> İkincisi her işletmenin gerçekten ihtiyaç duyduğudur — envanter, kapasite, risk. Yine de çoğu ML hattı birincisini gönderir.</p>

<p class="l-text">Bu derste tahmin aralıklarını dört farklı şekilde inşa edersin: parametrik (DeepAR tarzı Gauss olabilirliği), kuantil regresyonu, konformal tahmin ve önyükleme. Bir aralığın dürüst olduğunu söyleyen kalibrasyon metriklerini hesaplayacaksın ve gönderdiğin her olasılıksal tahmini yönetmesi gereken tek kuralı öğreneceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Nokta, aralık ve tam tahminci-dağılım tahminlerini ayırt et</li>
<li>NumPy'da DeepAR tarzı Gauss olabilirlik kaybı uygula</li>
<li>Kuantil regresyonu eğit ve pinball kaybını oku</li>
<li>Dağılımdan bağımsız aralıklar için bölünmüş konformal tahmin uygula</li>
<li>Bir aralığı yargılamak için kapsama, keskinlik ve CRPS ölç</li>
<li>Bir aralığın aşırı veya yetersiz güvenli olduğunu tanı ve yeniden kalibre et</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Nokta vs Aralık vs Dağılım</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Nokta</div><div class="card-body">Tek bir sayı, genellikle ortalama. Kolay, kayıplı, tehlikeli.</div></div>
<div class="calc-card"><div class="card-title">Aralık</div><div class="card-body">alfa düzeyinde [alt, üst] (örn. %90). Karar vericinin minimumu.</div></div>
<div class="calc-card"><div class="card-title">Kuantiller</div><div class="card-body">P10/P50/P90 (veya daha ince ızgara). Ampirik dağılım inşa eder.</div></div>
<div class="calc-card"><div class="card-title">Tam dağılım</div><div class="card-body">Parametrik (Gauss, NegBin) veya örnek tabanlı. Herhangi bir kuyruğu hesaplamana izin verir.</div></div>
</div>
<div class="calc-highlight">Envanter, ortalama değil, talebin 95. yüzdelik dilimine göre belirlenir — zamanın %5'inde stoksuz kalmak hatadır değil bir özelliktir. Nokta tahminleri size 95. yüzdelik dilimi söyleyemez.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. DeepAR — Parametrik Olabilirlik (Salinas 2017)</h2>
<p class="l-text">DeepAR (Amazon, 2017), bir nokta yaymak yerine bir olabilirlik parametrelerini yayan özyinelemeli bir kodlayıcıdır: Gauss için ortalama ve standart sapma, negatif binomial için alfa ve mu. Kayıp negatif log olabilirliktir: <span class="katex-block">$$\\mathcal{L} = -\\sum_{t} \\log p(y_t \\mid \\mu_t, \\sigma_t)$$</span> Herhangi bir kuantili almak için eğitilmiş modelden örnekleyin.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Gauss kafası</div><div class="card-body">Sürekli hedefler. Ucuz. Ağır kuyruklarda başarısız olur.</div></div>
<div class="calc-card"><div class="card-title">Student-t kafası</div><div class="card-body">Ağır kuyruklu alternatif. Bir ekstra serbestlik derecesi parametresi.</div></div>
<div class="calc-card"><div class="card-title">NegBin kafası</div><div class="card-body">Sayım verisi (satışlar, tıklamalar). Perakende için endüstri varsayılanı.</div></div>
<div class="calc-card"><div class="card-title">Karışım kafası</div><div class="card-body">Çok kipli dağılımlar için K Gauss.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Gauss Olabilirliğini Elle Kodlama</h2>
<p class="l-text">Bir gözlem için: <span class="katex-block">$$-\\log p(y) = \\tfrac{1}{2}\\log(2\\pi\\sigma^2) + \\tfrac{(y-\\mu)^2}{2\\sigma^2}$$</span> İki kafa (mu ve log-sigma) ve standart MSE kaybı NLL ile değiştirilir. Model artık <em>belirsizliğe</em> bağlı kalmalıdır: yanlış olduğu yerde dar bir sigma tahmin etmek acımasızca cezalandırılır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON (DEMO)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch, torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="ty">DeepAR</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(self, hid=<span class="num">32</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        self.lstm    = nn.<span class="fn">LSTM</span>(<span class="num">1</span>, hid, batch_first=<span class="kw">True</span>)
        self.mu_head = nn.<span class="fn">Linear</span>(hid, <span class="num">1</span>)
        self.lv_head = nn.<span class="fn">Linear</span>(hid, <span class="num">1</span>)         <span class="cm"># log-sigma</span>
    <span class="kw">def</span> <span class="fn">forward</span>(self, x):
        h, _ = self.<span class="fn">lstm</span>(x)
        <span class="kw">return</span> self.<span class="fn">mu_head</span>(h[:, -<span class="num">1</span>]), self.<span class="fn">lv_head</span>(h[:, -<span class="num">1</span>])

<span class="kw">def</span> <span class="fn">gaussian_nll</span>(y, mu, log_sigma):
    sigma = log_sigma.<span class="fn">exp</span>()
    <span class="kw">return</span> (<span class="num">0.5</span>*((y-mu)/sigma)**<span class="num">2</span> + log_sigma).<span class="fn">mean</span>()</code></pre></div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">df_stocks üzerinde Ridge referansının kayan artıklarına bir Gauss uydur, sonra yarın için P10/P50/P90 tahmini oluşturmak üzere 1000 çekiliş örnekle.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
L = <span class="num">10</span>
X = np.<span class="fn">stack</span>([z[i:i+L]   <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-<span class="num">1</span>)])
Y = z[L:-<span class="num">1</span>]
cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)
mdl = <span class="fn">Ridge</span>().<span class="fn">fit</span>(X[:cut], Y[:cut])
resid = Y[:cut] - mdl.<span class="fn">predict</span>(X[:cut])

mu_next  = <span class="fn">float</span>(mdl.<span class="fn">predict</span>(z[-L:][<span class="kw">None</span>])[<span class="num">0</span>])
sig_next = <span class="fn">float</span>(resid.<span class="fn">std</span>())
samples  = np.random.<span class="fn">normal</span>(mu_next, sig_next, size=<span class="num">1000</span>)
p10, p50, p90 = np.<span class="fn">percentile</span>(samples, [<span class="num">10</span>, <span class="num">50</span>, <span class="num">90</span>])
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"mu={mu_next:.2f}  sigma={sig_next:.2f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"P10={p10:.2f}  P50={p50:.2f}  P90={p90:.2f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"interval width: {p90-p10:.2f}"</span>)</code></pre></div>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Kuantil Regresyonu ve Pinball Kaybı</h2>
<p class="l-text">Olabilirlik varsayımı gerekmez. (0,1)'deki her hedef kuantil <em>tau</em> için, <em>pinball kaybı</em> ile bir kafa eğit: <span class="katex-block">$$L_\\tau(y, \\hat{y}) = \\max\\bigl(\\tau (y-\\hat{y}),\\ (\\tau-1)(y-\\hat{y})\\bigr)$$</span> tau = 0.1, 0.5, 0.9 için kafaları aynı anda eğitin ve 3 kuantilli bir tahmininiz olur. TFT bunu yerel olarak yapar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
L = <span class="num">10</span>
X = np.<span class="fn">stack</span>([z[i:i+L] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-<span class="num">1</span>)])
y = z[L:-<span class="num">1</span>]
cut = <span class="fn">int</span>(<span class="fn">len</span>(X) * <span class="num">0.8</span>)

models = {tau: <span class="fn">GradientBoostingRegressor</span>(loss=<span class="str">"quantile"</span>, alpha=tau,
                                          n_estimators=<span class="num">80</span>, max_depth=<span class="num">3</span>,
                                          random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[:cut], y[:cut])
          <span class="kw">for</span> tau <span class="kw">in</span> [<span class="num">0.1</span>, <span class="num">0.5</span>, <span class="num">0.9</span>]}
preds = {tau: m.<span class="fn">predict</span>(X[cut:]) <span class="kw">for</span> tau, m <span class="kw">in</span> models.<span class="fn">items</span>()}
covered = ((y[cut:] &gt;= preds[<span class="num">0.1</span>]) &amp; (y[cut:] &lt;= preds[<span class="num">0.9</span>])).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="str">"empirical 80% coverage:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(covered), <span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"P50 vs truth MAE:"</span>,
      <span class="fn">round</span>(np.<span class="fn">abs</span>(preds[<span class="num">0.5</span>] - y[cut:]).<span class="fn">mean</span>(), <span class="num">3</span>))</code></pre></div>
<p class="l-text">Ampirik %80 kapsamanız 0.65 ise modeliniz aşırı güvenlidir — sonraki bölüm bunu düzeltir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Konformal Tahmin — Dağılımdan Bağımsız Aralıklar</h2>
<p class="l-text">Konformal tahmin herhangi bir temel modeli sarar ve size sonlu örneklem kapsama garantisi verir. Tarif (bölünmüş konformal):</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">1. Eğit</div><div class="card-body">Eğitim katmanında temel modeli uydur.</div></div>
<div class="calc-card"><div class="card-title">2. Kalibre et</div><div class="card-body">Ayrılmış bir kalibrasyon katmanında artıkları hesapla s_i = |y_i - mu_i|.</div></div>
<div class="calc-card"><div class="card-title">3. Kuantil</div><div class="card-body">q = artıkların (ceil((n+1)(1-alfa))/n)-kuantili.</div></div>
<div class="calc-card"><div class="card-title">4. Tahmin et</div><div class="card-body">Aralık = mu_test ± q. Garantili (1-alfa) marjinal kapsama.</div></div>
</div>
<div class="calc-highlight">Konformal herhangi bir modelin üzerinde çalışır — Ridge, Random Forest, PatchTST. Dürüst aralıkları göndermenin en ucuz yoludur.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kodda Konformal</h2>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-eşdeğeri (browser'da çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Ridge referansında bölünmüş konformal. Ayrılmış test katmanında ~%90 kapsamayı tutturmalı.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
L = <span class="num">10</span>; alpha = <span class="num">0.1</span>            <span class="cm"># hedef %90 kapsama</span>
X = np.<span class="fn">stack</span>([z[i:i+L] <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(z)-L-<span class="num">1</span>)])
y = z[L:-<span class="num">1</span>]

n = <span class="fn">len</span>(X)
i_tr = <span class="fn">int</span>(n*<span class="num">0.6</span>); i_cal = <span class="fn">int</span>(n*<span class="num">0.8</span>)
mdl  = <span class="fn">Ridge</span>().<span class="fn">fit</span>(X[:i_tr], y[:i_tr])

cal_resid = np.<span class="fn">abs</span>(y[i_tr:i_cal] - mdl.<span class="fn">predict</span>(X[i_tr:i_cal]))
n_cal = <span class="fn">len</span>(cal_resid)
q_level = np.<span class="fn">ceil</span>((n_cal + <span class="num">1</span>) * (<span class="num">1</span> - alpha)) / n_cal
q = np.<span class="fn">quantile</span>(cal_resid, <span class="fn">min</span>(q_level, <span class="num">1.0</span>))

mu_te = mdl.<span class="fn">predict</span>(X[i_cal:])
lo, hi = mu_te - q, mu_te + q
y_te = y[i_cal:]
cov = ((y_te &gt;= lo) &amp; (y_te &lt;= hi)).<span class="fn">mean</span>()
width = (hi - lo).<span class="fn">mean</span>()
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"target coverage:  {1-alpha:.2f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"empirical cov:    {cov:.3f}"</span>)
<span class="fn">print</span>(<span class="fn">f</span><span class="str">"average width:    {width:.3f}"</span>)</code></pre></div>
</div>
<p class="l-text">Eğer değiştirilebilirlik geçerliyse (zaman sürüklenmesi yok) kapsama 0.9'un örnekleme hatası içinde olacak. Durağan olmayan seriler için <em>uyarlanabilir konformal</em> (ACI, Gibbs &amp; Candes 2021) kullan.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Kalibrasyon — Aralığınız Ne Kadar Dürüst?</h2>
<p class="l-text">İyi kalibre edilmiş bir tahminci için alfa düzeyindeki ampirik kapsama 1 - alfa'ya eşittir. alfa = 0.05, 0.1, ..., 0.95 boyunca ampirik kapsamayı nominale karşı çiz. Köşegen mükemmeldir. Üzerinde = yetersiz güvenli (aralıklar çok geniş). Altında = aşırı güvenli (aralıklar çok dar, tehlikeli).</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kapsama</div><div class="card-body">P(y aralıkta). Manşet metriği.</div></div>
<div class="calc-card"><div class="card-title">Keskinlik</div><div class="card-body">Ortalama aralık genişliği. İyi kapsama göz önüne alındığında daha düşük daha iyidir.</div></div>
<div class="calc-card"><div class="card-title">CRPS</div><div class="card-body">Continuous Ranked Probability Score — dağılımlar için kesinlikle uygun kural.</div></div>
<div class="calc-card"><div class="card-title">Pinball</div><div class="card-body">Kuantil başına kayıp. Çok kuantilli bir puana toplanır.</div></div>
</div>
<div class="calc-highlight">"Kalibrasyona tabi keskinlik" (Gneiting 2007) — önce kapsamayı çivilemeden asla keskinliği optimize etmeyin.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. CRPS — Tüm Dağılım için Tek Sayı</h2>
<p class="l-text">CRPS, MAE'yi dağılımlara genelleştirir: <span class="katex-block">$$\\text{CRPS}(F, y) = \\int_{-\\infty}^{\\infty} \\bigl(F(z) - \\mathbb{1}\\{z \\geq y\\}\\bigr)^2 dz$$</span> K örnekten ampirik bir dağılım için iki ucuz ortalamaya indirgenir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">crps_sample</span>(samples, y):
    <span class="cm"># samples: (K,)  y: skalar</span>
    term1 = np.<span class="fn">abs</span>(samples - y).<span class="fn">mean</span>()
    term2 = <span class="num">0.5</span> * np.<span class="fn">abs</span>(samples[:, <span class="kw">None</span>] - samples[<span class="kw">None</span>, :]).<span class="fn">mean</span>()
    <span class="kw">return</span> term1 - term2

z = df_stocks[<span class="str">"Close"</span>].values.<span class="fn">astype</span>(<span class="str">"float32"</span>)
mu, sig = z[:-<span class="num">1</span>].<span class="fn">mean</span>(), z[:-<span class="num">1</span>].<span class="fn">std</span>()
samples = np.random.<span class="fn">normal</span>(mu, sig, size=<span class="num">500</span>)
<span class="fn">print</span>(<span class="str">"CRPS for tomorrow:"</span>, <span class="fn">round</span>(<span class="fn">float</span>(<span class="fn">crps_sample</span>(samples, z[-<span class="num">1</span>])), <span class="num">3</span>))</code></pre></div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Hatalıyken Yeniden Kalibrasyon</h2>
<p class="l-text">Ampirik kapsama 0.78 ama 0.90 hedeflediyseniz, aralığınızı ölçeklendirin. En basit düzeltme: konformal yarıçap <em>q</em>'yu, taze bir katmanda kalibrasyon hedefe ulaşana kadar ihtiyaç duyduğunuz oranla çarpın. Platt tarzı sigmoid yeniden kalibrasyon da kuantil kafalar için çalışır.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Genişliği şişir</div><div class="card-body">Artıkların k = quantile_target / quantile_observed ile çarp.</div></div>
<div class="calc-card"><div class="card-title">Koşullu konformal</div><div class="card-body">Özellik (örn. oynaklık) ile gruplandır ve grup başına konformalleştir.</div></div>
<div class="calc-card"><div class="card-title">ACI (çevrim içi)</div><div class="card-body">Hata geri besleme ile her adımda q'yu güncelle. Sürüklenmeye dayanıklı.</div></div>
<div class="calc-card"><div class="card-title">Önyükleme</div><div class="card-body">Artıkları B=200 kez yeniden örnekle — ampirik aralık. Yavaş ama önemsiz.</div></div>
</div>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Tek Kural</h2>
<div class="calc-highlight">Daima (kapsama, genişlik, CRPS) raporla — tek bir nokta MAE değil. Daha geniş ama iyi kalibre edilmiş bir aralık, dar bir yalancıdan daha değerlidir. Olasılıksal tahminler bir lüks değildir; tahminlerin nasıl kararlara dönüştüğüdür.</div>
<p class="l-text">10. dersteki capstone, bunu ML modelleri, istatistiksel referanslar ve izleme ile birlikte bir üretim hattına koyar.</p>
</div>
`
};
