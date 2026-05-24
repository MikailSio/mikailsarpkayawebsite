window.PRIVACY_L8 = {
en: `<p class="l-text">In 2019 Thomas Steinke and Jonathan Ullman published "The Pitfalls of Differential Privacy in Numerical Computation" — a paper showing that several published "DP" implementations had subtle bugs (floating-point leakage, off-by-one in clipping, miscalibrated noise) that violated their stated ε. The follow-up Steinke-Ullman 2019 ("Privacy Loss Auditing for Differentially Private Mechanisms") formalized <em>black-box auditing</em>: feed the mechanism crafted neighboring datasets, observe outputs, and back out an empirical ε via a hypothesis test. If the empirical ε exceeds the claimed bound, the implementation is broken — even if the math on paper is correct. By 2023 every major DP library had its own audit harness, and audit-aware development became the default.</p>
<p class="l-text">This capstone surveys the production privacy-tooling stack. <em>Opacus</em> (Meta, PyTorch) and <em>TensorFlow Privacy</em> for DP-SGD. <em>Tumult Analytics</em> (Tumult Labs, used by U.S. Census Bureau) for DP-SQL on real microdata. <em>Google's DP library</em> (C++/Go/Java) powering Google Maps' busy-place stats. <em>Microsoft SmartNoise</em> for DP-SQL on Spark. <em>Privacy Meter</em> (Murakonda et al., NUS) for membership-inference auditing. <em>PriBench</em>, <em>OpenMined PySyft</em>, <em>IBM Diffprivlib</em>. We close with the integration playbook: pick a tool, set ε budgets, automate auditing in CI, document in a privacy card. Plus a complete runnable DP audit on df_customers using the standard Steinke-Ullman protocol.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The DP auditing problem (Steinke-Ullman 2019) and its production importance</li>
<li>Black-box ε estimation via the hypothesis-testing reformulation</li>
<li>The full DP tooling stack: Opacus, TF-Privacy, Tumult, Google DP, SmartNoise, Diffprivlib</li>
<li>Privacy Meter and membership-inference auditing</li>
<li>Implementing a runnable DP audit on df_customers in NumPy</li>
<li>Privacy budgets in CI, model cards, and regulatory reporting</li>
<li>Integration with k-anonymity / SDC tools (URV bridge)</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Why Audit?</h2>
<p class="l-text">A DP claim is only as strong as the implementation that delivers it. Three classes of bug routinely break real systems. (a) <em>Sensitivity miscalibration</em>: claiming sensitivity 1 for an unbounded sum. (b) <em>Floating-point side channels</em>: Mironov 2012 showed naive Laplace via inverse CDF leaks via low-bit randomness. (c) <em>Composition errors</em>: forgetting to compose ε across queries. Auditing closes the loop: if the empirical ε estimated from outputs exceeds the claim, the system has a bug, full stop.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spec audit</div><div class="card-body">Mathematical proof on paper. Necessary, never sufficient.</div></div>
<div class="calc-card"><div class="card-title">Static analysis</div><div class="card-body">Type systems / linters that flag DP-violating code paths. e.g. ZCDP types.</div></div>
<div class="calc-card"><div class="card-title">Black-box audit</div><div class="card-body">Run mechanism on (D, D'), estimate ε from output histograms. Steinke-Ullman 2019.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. The Steinke-Ullman Protocol</h2>
<p class="l-text">The audit reformulates ε via Neyman-Pearson hypothesis testing. Given two neighboring datasets D, D' and any rejection set S, ε-DP implies P_D[S]/P_{D'}[S] ≤ e^ε. Empirically: estimate p̂_D and p̂_{D'} via Monte Carlo (run mechanism many times), compute the ratio, account for sampling error with a Clopper-Pearson confidence interval. If the lower-bound ratio exceeds claimed e^ε, the audit fails.</p>
<div class="katex-block">$$\\hat{\\varepsilon} = \\ln \\frac{\\hat{p}_D - \\delta}{\\hat{p}_{D'}}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Mechanism under test: noisy mean with claimed eps</span>
<span class="kw">def</span> <span class="fn">noisy_mean</span>(data, eps=<span class="num">1.0</span>, sensitivity=<span class="num">1.0</span>):
    true = np.<span class="fn">mean</span>(data)
    <span class="kw">return</span> true + rng.<span class="fn">laplace</span>(scale=sensitivity/eps)

<span class="cm"># Neighboring datasets D and D' differ in one row</span>
D  = np.<span class="fn">array</span>([<span class="num">0.0</span>]*<span class="num">100</span> + [<span class="num">0.0</span>])
Dp = np.<span class="fn">array</span>([<span class="num">0.0</span>]*<span class="num">100</span> + [<span class="num">1.0</span>])

<span class="cm"># Monte Carlo: run mechanism N times on each, count rejections in set S=[0.05, infty)</span>
N = 20_000
out_D  = np.<span class="fn">array</span>([<span class="fn">noisy_mean</span>(D)  <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N)])
out_Dp = np.<span class="fn">array</span>([<span class="fn">noisy_mean</span>(Dp) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N)])
S_thr = <span class="num">0.05</span>
p_D  = (out_D  &gt; S_thr).<span class="fn">mean</span>()
p_Dp = (out_Dp &gt; S_thr).<span class="fn">mean</span>()
emp_eps = np.<span class="fn">log</span>(<span class="fn">max</span>(p_D, <span class="num">1e-9</span>) / <span class="fn">max</span>(p_Dp, <span class="num">1e-9</span>))
<span class="fn">print</span>(f<span class="str">"p_D  = {p_D:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"p_Dp = {p_Dp:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Empirical eps lower-bound: {abs(emp_eps):.3f}  (claim: 1.0)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) audits a model with a membership-inference attack and reports the empirical privacy budget (Jagielski 2020 lower-bound estimator).</p>
<p class="l-text">If empirical |ε| stays well under the claim, the implementation is consistent with the bound. Production audit harnesses sweep many threshold sets S and many neighbor-pair configurations.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Opacus — DP-SGD for PyTorch</h2>
<p class="l-text">Yousefpour et al. 2021 (Meta). Auditable: <code>privacy_engine.get_epsilon(delta)</code> returns the current spend. Built-in support for Renyi DP, PRV, and (since v1.5) the optimal accountant. Used at Meta for on-device personalization and at multiple FAANG companies for policy-violation models.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (Opacus not in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> opacus <span class="kw">import</span> PrivacyEngine
<span class="kw">from</span> opacus.validators <span class="kw">import</span> ModuleValidator
<span class="kw">import</span> torch

model = ModuleValidator.<span class="fn">fix</span>(model)         <span class="cm"># auto-replace BatchNorm etc.</span>
optim = torch.optim.<span class="fn">SGD</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.05</span>)

pe = <span class="fn">PrivacyEngine</span>()
model, optim, loader = pe.<span class="fn">make_private_with_epsilon</span>(
    module=model, optimizer=optim, data_loader=loader,
    target_epsilon=<span class="num">2.0</span>, target_delta=<span class="num">1e-5</span>, epochs=<span class="num">10</span>,
    max_grad_norm=<span class="num">1.0</span>,
)
<span class="cm"># After training:</span>
<span class="fn">print</span>(<span class="str">"Spent eps:"</span>, pe.<span class="fn">get_epsilon</span>(delta=<span class="num">1e-5</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines a PyTorch model whose autograd graph lets us compute exact input-gradients for the attack. 2) audits a model with a membership-inference attack and reports the empirical privacy budget (Jagielski 2020 lower-bound estimator).</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Tumult Analytics, Google DP, SmartNoise</h2>
<p class="l-text">Three battle-tested DP-SQL stacks.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tumult Analytics</div><div class="card-body">Used by U.S. Census IRS Statistics of Income, IPUMS. Built on Spark. PrivacyBudget objects compose automatically.</div></div>
<div class="calc-card"><div class="card-title">Google DP library</div><div class="card-body">C++/Go/Java. Powers Google Maps' "popular times" and COVID Mobility Reports. Bounded-mean, quantile, partition selection.</div></div>
<div class="calc-card"><div class="card-title">Microsoft SmartNoise</div><div class="card-body">Python + Rust. SQL surface, integration with Azure Synapse. OpenDP project foundation.</div></div>
<div class="calc-card"><div class="card-title">OpenDP (Harvard/MS)</div><div class="card-body">Verified Rust core. The "LLVM of DP" — a vetted privacy primitive layer below all the others.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (Tumult requires Spark)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> tmlt.analytics.session <span class="kw">import</span> Session
<span class="kw">from</span> tmlt.analytics.privacy_budget <span class="kw">import</span> PureDPBudget
<span class="kw">from</span> tmlt.analytics.query_builder <span class="kw">import</span> QueryBuilder

session = Session.<span class="fn">from_dataframe</span>(
    privacy_budget=<span class="fn">PureDPBudget</span>(epsilon=<span class="num">2.0</span>),
    source_id=<span class="str">'customers'</span>, dataframe=spark_df,
)
result = session.<span class="fn">evaluate</span>(
    <span class="fn">QueryBuilder</span>(<span class="str">'customers'</span>).<span class="fn">groupby</span>([<span class="str">'region'</span>]).<span class="fn">count</span>(),
    privacy_budget=<span class="fn">PureDPBudget</span>(epsilon=<span class="num">1.0</span>),
)
result.<span class="fn">show</span>()
<span class="fn">print</span>(<span class="str">"Remaining budget:"</span>, session.remaining_privacy_budget)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) audits a model with a membership-inference attack and reports the empirical privacy budget (Jagielski 2020 lower-bound estimator).</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Privacy Meter — Membership Inference Auditing</h2>
<p class="l-text">Murakonda, Shokri (NUS, 2020). Trains shadow models, fits a per-record vulnerability score, ranks training rows by leak risk. Used as a regression test before any model release. Output: a histogram of attack AUCs across the training set; ideally peaked at 0.5 (no leakage).</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">Mini Privacy-Meter style audit on df_customers — DP audit comparing predictions on D vs D'</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_customers.<span class="fn">copy</span>()
df[<span class="str">'y'</span>] = (df[<span class="str">'lifetime_value'</span>] &gt; df[<span class="str">'lifetime_value'</span>].<span class="fn">median</span>()).<span class="fn">astype</span>(<span class="fn">int</span>)
feat = [<span class="str">'age'</span>,<span class="str">'tenure_years'</span>,<span class="str">'num_orders'</span>]
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[feat].values)
y = df[<span class="str">'y'</span>].values

<span class="cm"># Two neighboring datasets: drop one row to form D'</span>
idx_drop = <span class="num">0</span>
D_X, D_y = X, y
Dp_X, Dp_y = np.<span class="fn">delete</span>(X, idx_drop, <span class="num">0</span>), np.<span class="fn">delete</span>(y, idx_drop)

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
<span class="kw">def</span> <span class="fn">trained_pred</span>(X_train, y_train, X_query, sigma=<span class="num">0.0</span>):
    <span class="cm"># Add noise to gradient via solving with regularized closed form on noisy gram</span>
    clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">200</span>).<span class="fn">fit</span>(X_train, y_train)
    p = clf.<span class="fn">predict_proba</span>(X_query)[:,<span class="num">1</span>]
    <span class="kw">return</span> p + rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma, size=p.shape)

target = X[idx_drop:idx_drop+<span class="num">1</span>]    <span class="cm"># the row added/removed</span>
N = <span class="num">200</span>
p_D  = np.<span class="fn">array</span>([<span class="fn">trained_pred</span>(D_X,  D_y,  target, sigma=<span class="num">0.05</span>)[<span class="num">0</span>] <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N)])
p_Dp = np.<span class="fn">array</span>([<span class="fn">trained_pred</span>(Dp_X, Dp_y, target, sigma=<span class="num">0.05</span>)[<span class="num">0</span>] <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N)])

<span class="fn">print</span>(f<span class="str">"Mean prediction with row included:  {p_D.mean():.3f} +- {p_D.std():.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean prediction with row excluded:  {p_Dp.mean():.3f} +- {p_Dp.std():.3f}"</span>)
gap = <span class="fn">abs</span>(p_D.<span class="fn">mean</span>() - p_Dp.<span class="fn">mean</span>())
<span class="fn">print</span>(f<span class="str">"Inclusion gap: {gap:.3f}  (large = high membership leakage)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) fits a sklearn LogisticRegression — a linear baseline whose gradient w.r.t. inputs is exactly the weight vector. 3) audits a model with a membership-inference attack and reports the empirical privacy budget (Jagielski 2020 lower-bound estimator).</p>
</div>
<p class="l-text">Add more noise (raise σ) and the inclusion gap shrinks — the empirical privacy-utility tradeoff in one experiment.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. CI and Model Cards</h2>
<p class="l-text">Production privacy is a CI/CD discipline. (1) Encode ε budget as test fixture: <code>assert privacy_engine.get_epsilon() &lt; 2.0</code>. (2) Run an audit harness (Steinke-Ullman or Privacy Meter) on every release candidate. (3) Block deploy on regression. (4) Publish a model/data card listing ε spent, mechanism, evaluation results. Mitchell et al. 2019 "Model Cards for Model Reporting" is the de facto template; Google DP library ships its own card schema.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">EU AI Act (in force 2024) and the U.S. White House EO 14110 require disclosure of privacy mitigations for high-risk AI. Auditable DP claims will increasingly be a regulatory deliverable, not a research curiosity. URV's research on syntactic-DP hybrid disclosure (Sánchez 2022) bridges these requirements with established SDC frameworks.</div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Bridge to k-Anonymity / SDC Tools</h2>
<p class="l-text">DP and SDC (k-anonymity, microaggregation — lesson 6) are not enemies. Tumult Analytics ships syntactic SDC pre-processing; ARX (TU Munich) supports both DP and k-anonymity in one workflow; URV's hybrid stacks layer microaggregation under DP-SGD. The right tool depends on release type: <em>microdata for re-analysis</em> → SDC + microaggregation; <em>aggregate statistics</em> → DP; <em>ML model release</em> → DP-SGD with audit. A mature compliance program supports all three.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Capstone Project — Audit a Real Pipeline</h2>
<p class="l-text">Build an end-to-end audited pipeline in your environment.</p>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Pick a dataset (df_customers + df_churn) and a model (logistic regression or small NN).</li>
<li>Train two versions: vanilla SGD baseline, and Opacus DP-SGD at target ε=2.</li>
<li>Run Privacy Meter on both. Expect AUC ≈ 0.5 for DP, possibly &gt; 0.6 for vanilla.</li>
<li>Run Steinke-Ullman black-box audit on the DP-SGD output. Confirm empirical ε ≤ claim.</li>
<li>Apply microaggregation (URV-style, sklearn KMeans) as pre-processing. Re-train, re-audit.</li>
<li>Write a model card: ε, δ, accuracy on holdout, MIA AUC, audit logs.</li>
<li>Push to CI: every PR runs the full audit and blocks regression.</li>
</ol>
<p class="l-text">This is the modern privacy engineer's toolkit — from URV's CRISES microaggregation to Steinke-Ullman black-box auditing in one workflow. You now know the field end to end.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Further Reading</h2>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Dwork &amp; Roth 2014, "The Algorithmic Foundations of Differential Privacy" — the textbook.</li>
<li>Steinke &amp; Ullman 2019, "Privacy Loss Auditing" — the audit protocol.</li>
<li>Domingo-Ferrer, Sánchez, Soria-Comas 2016, "Database Anonymization" — Synthesis Lectures (URV).</li>
<li>Carlini et al. 2022, "Membership Inference Attacks From First Principles" — the modern MIA primer.</li>
<li>OpenDP at Harvard, Google DP at github.com/google/differential-privacy, Opacus at opacus.ai, Tumult at tmlt.dev.</li>
</ul>
</div>`,
tr: `<p class="l-text">2019'da Thomas Steinke ve Jonathan Ullman "The Pitfalls of Differential Privacy in Numerical Computation"u yayımladılar — yayımlanmış birkaç "DP" uygulamasının, belirtilen ε'larını ihlal eden ince hatalara (kayan-nokta sızıntısı, kırpmada off-by-one, yanlış kalibre edilmiş gürültü) sahip olduğunu gösteren bir makale. Takip eden Steinke-Ullman 2019 ("Privacy Loss Auditing for Differentially Private Mechanisms") <em>kara-kutu denetimi</em>'ni resmileştirdi: mekanizmaya hazırlanmış komşu veri setleri besle, çıktıları gözlemle ve bir hipotez testi yoluyla deneysel ε'yi geri çıkar. Deneysel ε iddia edilen sınırı aşarsa, kâğıt üzerindeki matematik doğru olsa bile uygulama bozuktur. 2023'e kadar her büyük DP kütüphanesinin kendi denetim koşumu vardı ve denetim-farkındalıklı geliştirme varsayılan oldu.</p>
<p class="l-text">Bu kapanış taşı üretim gizlilik-aletleri yığınını inceler. DP-SGD için <em>Opacus</em> (Meta, PyTorch) ve <em>TensorFlow Privacy</em>. Gerçek microdata üzerinde DP-SQL için <em>Tumult Analytics</em> (Tumult Labs, ABD Sayım Bürosu tarafından kullanılır). Google Maps'in yoğun-yer istatistiklerini güçlendiren <em>Google'ın DP kütüphanesi</em> (C++/Go/Java). Spark üzerinde DP-SQL için <em>Microsoft SmartNoise</em>. Üyelik-çıkarımı denetimi için <em>Privacy Meter</em> (Murakonda vd., NUS). <em>PriBench</em>, <em>OpenMined PySyft</em>, <em>IBM Diffprivlib</em>. Entegrasyon oyun kitabı ile kapatıyoruz: bir araç seç, ε bütçeleri ayarla, CI'da denetimi otomatikleştir, gizlilik kartında belgele. Artı standart Steinke-Ullman protokolü kullanarak df_customers üzerinde tam çalıştırılabilir bir DP denetimi.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>DP denetim problemi (Steinke-Ullman 2019) ve üretim önemi</li>
<li>Hipotez-testi yeniden formülasyonu yoluyla kara-kutu ε tahmini</li>
<li>Tam DP alet yığını: Opacus, TF-Privacy, Tumult, Google DP, SmartNoise, Diffprivlib</li>
<li>Privacy Meter ve üyelik-çıkarımı denetimi</li>
<li>NumPy'da df_customers üzerinde çalıştırılabilir bir DP denetimi uygulamak</li>
<li>CI'da gizlilik bütçeleri, model kartları ve düzenleyici raporlama</li>
<li>k-anonymity / SDC araçlarıyla entegrasyon (URV köprüsü)</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Neden Denetim?</h2>
<p class="l-text">Bir DP iddiası onu sağlayan uygulama kadar güçlüdür. Üç sınıf hata gerçek sistemleri rutin olarak bozar. (a) <em>Hassasiyet yanlış kalibrasyonu</em>: sınırsız bir toplam için hassasiyet 1 iddia etmek. (b) <em>Kayan-nokta yan kanalları</em>: Mironov 2012, ters CDF yoluyla naif Laplace'ın düşük-bit randomlığı yoluyla sızdırdığını gösterdi. (c) <em>Kompozisyon hataları</em>: sorgular arası ε'yi birleştirmeyi unutmak. Denetim döngüyü kapatır: çıktılardan tahmin edilen deneysel ε iddiayı aşarsa, sistemin bir hatası vardır, nokta.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spec denetimi</div><div class="card-body">Kâğıt üzerinde matematiksel kanıt. Gerekli, asla yeterli değil.</div></div>
<div class="calc-card"><div class="card-title">Statik analiz</div><div class="card-body">DP-ihlal eden kod yollarını işaretleyen tip sistemleri / linter'lar. Ör. ZCDP tipleri.</div></div>
<div class="calc-card"><div class="card-title">Kara-kutu denetim</div><div class="card-body">Mekanizmayı (D, D') üzerinde çalıştır, çıktı histogramlarından ε'yi tahmin et. Steinke-Ullman 2019.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Steinke-Ullman Protokolü</h2>
<p class="l-text">Denetim ε'yi Neyman-Pearson hipotez testi yoluyla yeniden formüle eder. İki komşu veri seti D, D' ve herhangi bir reddetme kümesi S verildiğinde, ε-DP P_D[S]/P_{D'}[S] ≤ e^ε'yi ima eder. Deneysel olarak: Monte Carlo yoluyla p_D ve p_{D'}'yi tahmin et (mekanizmayı çok kez çalıştır), oranı hesapla, Clopper-Pearson güven aralığıyla örnekleme hatasını hesaba kat. Alt sınır oranı iddia edilen e^ε'yi aşarsa, denetim başarısız olur.</p>
<div class="katex-block">$$\\hat{\\varepsilon} = \\ln \\frac{\\hat{p}_D - \\delta}{\\hat{p}_{D'}}$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

<span class="cm"># Test edilen mekanizma: iddia edilen eps ile gürültülü ortalama</span>
<span class="kw">def</span> <span class="fn">noisy_mean</span>(data, eps=<span class="num">1.0</span>, sensitivity=<span class="num">1.0</span>):
    true = np.<span class="fn">mean</span>(data)
    <span class="kw">return</span> true + rng.<span class="fn">laplace</span>(scale=sensitivity/eps)

<span class="cm"># Komşu veri setleri D ve D' bir satırda farklı</span>
D  = np.<span class="fn">array</span>([<span class="num">0.0</span>]*<span class="num">100</span> + [<span class="num">0.0</span>])
Dp = np.<span class="fn">array</span>([<span class="num">0.0</span>]*<span class="num">100</span> + [<span class="num">1.0</span>])

<span class="cm"># Monte Carlo: mekanizmayi her birinde N kez calistir, S=[0.05, infty) kumesindeki redleri say</span>
N = 20_000
out_D  = np.<span class="fn">array</span>([<span class="fn">noisy_mean</span>(D)  <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N)])
out_Dp = np.<span class="fn">array</span>([<span class="fn">noisy_mean</span>(Dp) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N)])
S_thr = <span class="num">0.05</span>
p_D  = (out_D  &gt; S_thr).<span class="fn">mean</span>()
p_Dp = (out_Dp &gt; S_thr).<span class="fn">mean</span>()
emp_eps = np.<span class="fn">log</span>(<span class="fn">max</span>(p_D, <span class="num">1e-9</span>) / <span class="fn">max</span>(p_Dp, <span class="num">1e-9</span>))
<span class="fn">print</span>(f<span class="str">"p_D  = {p_D:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"p_Dp = {p_Dp:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Empirical eps lower-bound: {abs(emp_eps):.3f}  (claim: 1.0)"</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) bir modeli üyelik-çıkarımı saldırısıyla denetler ve ampirik mahremiyet bütçesini raporlar (Jagielski 2020 alt-sınır tahmincisi).</p>
<p class="l-text">Deneysel |ε| iddianın iyi altında kalırsa, uygulama sınırla tutarlıdır. Üretim denetim koşumları çok eşik kümesi S ve çok komşu-çift yapılandırmasını tarar.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Opacus — PyTorch için DP-SGD</h2>
<p class="l-text">Yousefpour vd. 2021 (Meta). Denetlenebilir: <code>privacy_engine.get_epsilon(delta)</code> mevcut harcamayı döndürür. Renyi DP, PRV ve (v1.5'ten beri) optimal muhasebeci için yerleşik destek. Meta'da cihaz üstü kişiselleştirme için ve birden çok FAANG şirketinde politika ihlali modelleri için kullanılır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — SADECE DEMO (Opacus Pyodide'da yok)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> opacus <span class="kw">import</span> PrivacyEngine
<span class="kw">from</span> opacus.validators <span class="kw">import</span> ModuleValidator
<span class="kw">import</span> torch

model = ModuleValidator.<span class="fn">fix</span>(model)         <span class="cm"># BatchNorm vs. otomatik degistir</span>
optim = torch.optim.<span class="fn">SGD</span>(model.<span class="fn">parameters</span>(), lr=<span class="num">0.05</span>)

pe = <span class="fn">PrivacyEngine</span>()
model, optim, loader = pe.<span class="fn">make_private_with_epsilon</span>(
    module=model, optimizer=optim, data_loader=loader,
    target_epsilon=<span class="num">2.0</span>, target_delta=<span class="num">1e-5</span>, epochs=<span class="num">10</span>,
    max_grad_norm=<span class="num">1.0</span>,
)
<span class="cm"># Egitimden sonra:</span>
<span class="fn">print</span>(<span class="str">"Spent eps:"</span>, pe.<span class="fn">get_epsilon</span>(delta=<span class="num">1e-5</span>))
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) autograd grafiği saldırı için tam girdi-gradyanlarını hesaplamamıza izin veren bir PyTorch modeli tanımlar. 2) bir modeli üyelik-çıkarımı saldırısıyla denetler ve ampirik mahremiyet bütçesini raporlar (Jagielski 2020 alt-sınır tahmincisi).</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Tumult Analytics, Google DP, SmartNoise</h2>
<p class="l-text">Üç savaş-test edilmiş DP-SQL yığını.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tumult Analytics</div><div class="card-body">ABD Sayım IRS Statistics of Income, IPUMS tarafından kullanılır. Spark üzerine kurulmuş. PrivacyBudget nesneleri otomatik birleşir.</div></div>
<div class="calc-card"><div class="card-title">Google DP kütüphanesi</div><div class="card-body">C++/Go/Java. Google Maps'in "popüler zamanlar"ını ve COVID Mobility Reports'unu güçlendirir. Sınırlı-ortalama, kuantil, bölüm seçimi.</div></div>
<div class="calc-card"><div class="card-title">Microsoft SmartNoise</div><div class="card-body">Python + Rust. SQL yüzeyi, Azure Synapse ile entegrasyon. OpenDP proje temeli.</div></div>
<div class="calc-card"><div class="card-title">OpenDP (Harvard/MS)</div><div class="card-body">Doğrulanmış Rust çekirdeği. "DP'nin LLVM'si" — diğer hepsinin altındaki incelenmiş bir gizlilik ilkel katmanı.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — SADECE DEMO (Tumult Spark gerektirir)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> tmlt.analytics.session <span class="kw">import</span> Session
<span class="kw">from</span> tmlt.analytics.privacy_budget <span class="kw">import</span> PureDPBudget
<span class="kw">from</span> tmlt.analytics.query_builder <span class="kw">import</span> QueryBuilder

session = Session.<span class="fn">from_dataframe</span>(
    privacy_budget=<span class="fn">PureDPBudget</span>(epsilon=<span class="num">2.0</span>),
    source_id=<span class="str">'customers'</span>, dataframe=spark_df,
)
result = session.<span class="fn">evaluate</span>(
    <span class="fn">QueryBuilder</span>(<span class="str">'customers'</span>).<span class="fn">groupby</span>([<span class="str">'region'</span>]).<span class="fn">count</span>(),
    privacy_budget=<span class="fn">PureDPBudget</span>(epsilon=<span class="num">1.0</span>),
)
result.<span class="fn">show</span>()
<span class="fn">print</span>(<span class="str">"Remaining budget:"</span>, session.remaining_privacy_budget)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) bir modeli üyelik-çıkarımı saldırısıyla denetler ve ampirik mahremiyet bütçesini raporlar (Jagielski 2020 alt-sınır tahmincisi).</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Privacy Meter — Üyelik Çıkarımı Denetimi</h2>
<p class="l-text">Murakonda, Shokri (NUS, 2020). Shadow modeller eğitir, kayıt başına bir savunmasızlık puanı uydurur, eğitim satırlarını sızıntı riskine göre sıralar. Herhangi bir model yayımı öncesi gerileme testi olarak kullanılır. Çıktı: eğitim seti boyunca saldırı AUC'larının bir histogramı; ideal olarak 0.5'te zirveler (sızıntı yok).</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">df_customers üzerinde mini Privacy-Meter tarzı denetim — D vs D' tahminlerini karşılaştıran DP denetimi</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_customers.<span class="fn">copy</span>()
df[<span class="str">'y'</span>] = (df[<span class="str">'lifetime_value'</span>] &gt; df[<span class="str">'lifetime_value'</span>].<span class="fn">median</span>()).<span class="fn">astype</span>(<span class="fn">int</span>)
feat = [<span class="str">'age'</span>,<span class="str">'tenure_years'</span>,<span class="str">'num_orders'</span>]
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[feat].values)
y = df[<span class="str">'y'</span>].values

<span class="cm"># Iki komşu veri seti: D' oluşturmak için bir satır düşür</span>
idx_drop = <span class="num">0</span>
D_X, D_y = X, y
Dp_X, Dp_y = np.<span class="fn">delete</span>(X, idx_drop, <span class="num">0</span>), np.<span class="fn">delete</span>(y, idx_drop)

rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
<span class="kw">def</span> <span class="fn">trained_pred</span>(X_train, y_train, X_query, sigma=<span class="num">0.0</span>):
    <span class="cm"># Gurultulu gram uzerinde regulatize kapali form ile gradyana gurultu ekle</span>
    clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">200</span>).<span class="fn">fit</span>(X_train, y_train)
    p = clf.<span class="fn">predict_proba</span>(X_query)[:,<span class="num">1</span>]
    <span class="kw">return</span> p + rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma, size=p.shape)

target = X[idx_drop:idx_drop+<span class="num">1</span>]    <span class="cm"># eklenen/cikarilan satir</span>
N = <span class="num">200</span>
p_D  = np.<span class="fn">array</span>([<span class="fn">trained_pred</span>(D_X,  D_y,  target, sigma=<span class="num">0.05</span>)[<span class="num">0</span>] <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N)])
p_Dp = np.<span class="fn">array</span>([<span class="fn">trained_pred</span>(Dp_X, Dp_y, target, sigma=<span class="num">0.05</span>)[<span class="num">0</span>] <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(N)])

<span class="fn">print</span>(f<span class="str">"Mean prediction with row included:  {p_D.mean():.3f} +- {p_D.std():.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean prediction with row excluded:  {p_Dp.mean():.3f} +- {p_Dp.std():.3f}"</span>)
gap = <span class="fn">abs</span>(p_D.<span class="fn">mean</span>() - p_Dp.<span class="fn">mean</span>())
<span class="fn">print</span>(f<span class="str">"Inclusion gap: {gap:.3f}  (large = high membership leakage)"</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) bir sklearn LogisticRegression eğitir — girdilere göre gradyanı tam olarak ağırlık vektörü olan lineer bir taban modeli. 3) bir modeli üyelik-çıkarımı saldırısıyla denetler ve ampirik mahremiyet bütçesini raporlar (Jagielski 2020 alt-sınır tahmincisi).</p>
</div>
<p class="l-text">Daha fazla gürültü ekleyin (σ'yu yükseltin) ve dahil etme boşluğu daralır — bir deneyde deneysel gizlilik-fayda dengelemesi.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. CI ve Model Kartları</h2>
<p class="l-text">Üretim gizliliği bir CI/CD disiplinidir. (1) ε bütçesini test fixture olarak kodla: <code>assert privacy_engine.get_epsilon() &lt; 2.0</code>. (2) Her sürüm adayında bir denetim koşumu (Steinke-Ullman veya Privacy Meter) çalıştır. (3) Gerileme üzerinde dağıtımı engelle. (4) Harcanan ε, mekanizma, değerlendirme sonuçlarını listeleyen bir model/veri kartı yayımla. Mitchell vd. 2019 "Model Cards for Model Reporting" de facto şablondur; Google DP kütüphanesi kendi kart şemasını gönderir.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">AB Yapay Zeka Yasası (2024'te yürürlükte) ve ABD Beyaz Saray EO 14110, yüksek riskli yapay zeka için gizlilik hafifletmelerinin açıklanmasını gerektirir. Denetlenebilir DP iddiaları, araştırma merakı değil giderek artan biçimde düzenleyici bir teslim edilebilir olacaktır. URV'nin sözdizimsel-DP hibrit ifşası (Sánchez 2022) üzerine araştırması bu gereksinimleri yerleşik SDC çerçeveleriyle köprüler.</p></div>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. k-Anonymity / SDC Araçlarıyla Köprü</h2>
<p class="l-text">DP ve SDC (k-anonymity, microaggregation — ders 6) düşman değildir. Tumult Analytics sözdizimsel SDC ön işleme gönderir; ARX (TU Munich) tek bir iş akışında hem DP hem k-anonymity'yi destekler; URV'nin hibrit yığınları DP-SGD altında microaggregation katmanlar. Doğru araç yayım tipine bağlıdır: <em>yeniden analiz için microdata</em> → SDC + microaggregation; <em>toplam istatistikler</em> → DP; <em>ML model yayımı</em> → denetimle DP-SGD. Olgun bir uyumluluk programı üçünü de destekler.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Kapanış Projesi — Gerçek Bir Boru Hattını Denetle</h2>
<p class="l-text">Ortamınızda uçtan uca denetlenmiş bir boru hattı inşa edin.</p>
<ol style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Bir veri seti seç (df_customers + df_churn) ve bir model (lojistik regresyon veya küçük NN).</li>
<li>İki versiyon eğit: vanilla SGD baz çizgisi ve hedef ε=2'de Opacus DP-SGD.</li>
<li>Her ikisinde Privacy Meter çalıştır. DP için AUC ≈ 0.5, vanilla için muhtemelen &gt; 0.6 bekle.</li>
<li>DP-SGD çıktısı üzerinde Steinke-Ullman kara-kutu denetimi çalıştır. Deneysel ε ≤ iddiayı doğrula.</li>
<li>Ön işleme olarak microaggregation uygula (URV-stili, sklearn KMeans). Yeniden eğit, yeniden denetle.</li>
<li>Bir model kartı yaz: ε, δ, holdout'ta doğruluk, MIA AUC, denetim günlükleri.</li>
<li>CI'ya it: her PR tam denetimi çalıştırır ve gerilemeyi engeller.</li>
</ol>
<p class="l-text">Bu modern gizlilik mühendisinin alet kutusudur — URV'nin CRISES microaggregation'ından Steinke-Ullman kara-kutu denetimine tek bir iş akışında. Artık alanı uçtan uca biliyorsunuz.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. İleri Okuma</h2>
<ul style="line-height:1.7;font-size:0.94rem;color:rgba(235,230,220,0.92);padding-left:1.3rem">
<li>Dwork &amp; Roth 2014, "The Algorithmic Foundations of Differential Privacy" — ders kitabı.</li>
<li>Steinke &amp; Ullman 2019, "Privacy Loss Auditing" — denetim protokolü.</li>
<li>Domingo-Ferrer, Sánchez, Soria-Comas 2016, "Database Anonymization" — Synthesis Lectures (URV).</li>
<li>Carlini vd. 2022, "Membership Inference Attacks From First Principles" — modern MIA başlangıcı.</li>
<li>Harvard'da OpenDP, github.com/google/differential-privacy'de Google DP, opacus.ai'de Opacus, tmlt.dev'de Tumult.</li>
</ul>
</div>`
};
