window.PRIVACY_L7 = {
en: `<p class="l-text">In 2018 Lei Xu and Kalyan Veeramachaneni at MIT published "Synthesizing Tabular Data using Generative Adversarial Networks" — eventually crystalizing in 2019 as <strong>CTGAN</strong> (Xu et al., NeurIPS 2019). Their motivation: hospitals, banks, and governments hold tabular datasets they cannot share — but a <em>synthetic</em> dataset that mimics the joint distribution can be released freely if the generator never memorizes a single training row. CTGAN tackled the unique pains of tabular data — mixed continuous/discrete columns, multimodal distributions, severe class imbalance — and became the de facto baseline. By 2024 the Synthetic Data Vault (SDV, MIT spin-off DataCebo) had been downloaded over 5 million times.</p>
<p class="l-text">But synthetic data is not automatically private. A GAN trained without DP can memorize and reproduce training rows verbatim (Hayes et al. 2017, "LOGAN: Membership Inference Attacks against Generative Models"). The fix is <em>DP-GAN</em> (Xie et al. 2018) — DP-SGD applied to the discriminator's gradient — and parametric alternatives like <strong>PrivBayes</strong> (Zhang et al. 2017, SIGMOD) which fits a differentially-private Bayesian network on low-order marginals. The 2024 wave brought <em>TabDDPM</em> (Kotelnikov 2023) — diffusion models for tabular data — outperforming CTGAN on most benchmarks. This lesson surveys generators, builds a Gaussian-KDE synthesizer in scikit-learn that runs in your browser, and covers the evaluation triad: fidelity, utility, and privacy.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The case for synthetic data — sharing without sharing</li>
<li>CTGAN (Xu 2019) — mode-specific normalization and conditional generators</li>
<li>TabDDPM and the diffusion turn for tabular data (Kotelnikov 2023)</li>
<li>DP-GAN — DP-SGD on the discriminator (Xie 2018)</li>
<li>PrivBayes — DP Bayesian networks on marginals (Zhang 2017)</li>
<li>Building a runnable Gaussian-KDE synthesizer in scikit-learn</li>
<li>Evaluation: TSTR utility, statistical fidelity, membership-inference auditing</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Why Synthetic Data?</h2>
<p class="l-text">Three drivers. (1) <em>Sharing under regulation</em>: HIPAA, GDPR, PCI-DSS forbid raw release; synthetic is potentially non-personal. (2) <em>Class imbalance</em>: rare events (fraud, defects) under-represented; synthesize to upsample. (3) <em>Software development</em>: realistic test fixtures without exposing PII. The catch: only <em>differentially-private</em> synthesizers offer formal guarantees. Vanilla CTGAN copies rare rows.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Marginal-based</div><div class="card-body">Fit low-order joint distributions. PrivBayes, MST, AIM. Tight DP, modest fidelity.</div></div>
<div class="calc-card"><div class="card-title">GAN-based</div><div class="card-body">CTGAN, CT-Wasserstein, DP-CTGAN. Strong on multimodal numerics, moderate DP cost.</div></div>
<div class="calc-card"><div class="card-title">Diffusion</div><div class="card-body">TabDDPM (2023), STaSy. New SOTA on most tabular benchmarks. DP variants emerging.</div></div>
<div class="calc-card"><div class="card-title">Copula / parametric</div><div class="card-body">Gaussian copula, Bayesian network. Fast, interpretable, weaker on complex joints.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. CTGAN — Tabular GAN with Mode-Specific Normalization</h2>
<p class="l-text">Xu et al. NeurIPS 2019 made GANs work on tabular data with three innovations. (1) <em>Mode-specific normalization</em> — fit a VGM (variational Gaussian mixture) per continuous column, encode each value as (mode index, scaled residual). (2) <em>Conditional generator</em> — sample a discrete column value, condition the generator on it, train with cross-entropy on that condition. (3) <em>Training-by-sampling</em> — re-balance batches by category to handle imbalance.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (CTGAN not in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sdv.single_table <span class="kw">import</span> CTGANSynthesizer
<span class="kw">from</span> sdv.metadata <span class="kw">import</span> SingleTableMetadata

metadata = <span class="fn">SingleTableMetadata</span>()
metadata.<span class="fn">detect_from_dataframe</span>(df_churn)

synth = <span class="fn">CTGANSynthesizer</span>(metadata, epochs=<span class="num">300</span>, verbose=<span class="kw">True</span>)
synth.<span class="fn">fit</span>(df_churn)
synthetic = synth.<span class="fn">sample</span>(num_rows=<span class="num">1000</span>)
synthetic.<span class="fn">head</span>()
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) runs a federated round: clients compute local updates, the server aggregates them under secure aggregation so individual gradients never leave the device.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Runnable Synthesizer — Gaussian KDE in Scikit-Learn</h2>
<p class="l-text">CTGAN does not run in Pyodide. We build a working synthesizer using kernel density estimation: fit a multivariate KDE on the numeric columns and sample from it. KDE is the parametric ancestor of GAN-based synthesizers — same idea, simpler statistics.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">KDE synthesizer on df_churn — sample 200 synthetic rows</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KernelDensity
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_churn.<span class="fn">copy</span>()
cols = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
X = df[cols].values.<span class="fn">astype</span>(<span class="fn">float</span>)
scaler = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X)
Xs = scaler.<span class="fn">transform</span>(X)

kde = <span class="fn">KernelDensity</span>(kernel=<span class="str">'gaussian'</span>, bandwidth=<span class="num">0.4</span>).<span class="fn">fit</span>(Xs)
synth = scaler.<span class="fn">inverse_transform</span>(kde.<span class="fn">sample</span>(<span class="num">200</span>, random_state=<span class="num">0</span>))
synth_df = pd.<span class="fn">DataFrame</span>(synth, columns=cols).<span class="fn">round</span>(<span class="num">2</span>)

<span class="fn">print</span>(<span class="str">"Original means:    "</span>, df[cols].<span class="fn">mean</span>().values.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Synthetic means:   "</span>, synth_df.<span class="fn">mean</span>().values.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Original stdevs:   "</span>, df[cols].<span class="fn">std</span>().values.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Synthetic stdevs:  "</span>, synth_df.<span class="fn">std</span>().values.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Synthetic head:"</span>)
<span class="fn">print</span>(synth_df.<span class="fn">head</span>().<span class="fn">to_string</span>())
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) calls into scikit-learn for the modelling step. 3) runs a federated round: clients compute local updates, the server aggregates them under secure aggregation so individual gradients never leave the device.</p>
</div>
<p class="l-text">Means and standard deviations match within sampling noise. KDE preserves marginals well; for joint dependencies, GAN/diffusion models do better.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. PrivBayes — DP Bayesian Networks (Zhang 2017)</h2>
<p class="l-text">Zhang, Cormode, Procopiuc, Srivastava, Xiao (SIGMOD 2017) gave the first practical DP synthesizer with formal guarantees. (1) Privately greedy-build a Bayesian network whose edges are the most informative low-order marginals (using the exponential mechanism). (2) Sample DP marginals via Laplace noise. (3) Generate by ancestral sampling from the noisy network. PrivBayes ships in IBM Diffprivlib and is the baseline for any new DP synthesizer paper.</p>
<div class="katex-block">$$\\Pr[M(D) \\in S] \\le e^{\\varepsilon} \\Pr[M(D') \\in S] \\quad (\\text{whole pipeline})$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="cm"># Mini-PrivBayes: 1-way DP marginals, sample independently. Real PrivBayes</span>
<span class="cm"># learns a network of order-2/3 conditionals — see Diffprivlib for full impl.</span>
df = df_churn.<span class="fn">copy</span>()
cols = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>,<span class="str">'churned'</span>]
eps = <span class="num">1.0</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

dp_marginals = {}
<span class="kw">for</span> c <span class="kw">in</span> cols:
    counts = df[c].<span class="fn">value_counts</span>().<span class="fn">sort_index</span>()
    noisy = counts.values + rng.<span class="fn">laplace</span>(scale=<span class="num">1.0</span>/eps, size=<span class="fn">len</span>(counts))
    noisy = np.<span class="fn">clip</span>(noisy, <span class="num">0</span>, <span class="kw">None</span>)
    dp_marginals[c] = (counts.index.values, noisy / noisy.<span class="fn">sum</span>())

<span class="cm"># Sample independently (true PrivBayes uses learned network)</span>
N = <span class="num">200</span>
synth = pd.<span class="fn">DataFrame</span>({c: rng.<span class="fn">choice</span>(v, size=N, p=p) <span class="kw">for</span> c, (v,p) <span class="kw">in</span> dp_marginals.<span class="fn">items</span>()})
<span class="fn">print</span>(<span class="str">"DP-synthetic head:"</span>); <span class="fn">print</span>(synth.<span class="fn">head</span>().<span class="fn">to_string</span>())
<span class="fn">print</span>(<span class="str">"\\nMarginal preservation (mean tenure):  orig={:.2f}  synth={:.2f}"</span>.<span class="fn">format</span>(
      df[<span class="str">'tenure_months'</span>].<span class="fn">mean</span>(), synth[<span class="str">'tenure_months'</span>].<span class="fn">mean</span>()))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a pandas DataFrame from raw arrays for downstream analysis. 2) runs a federated round: clients compute local updates, the server aggregates them under secure aggregation so individual gradients never leave the device.</p>
<p class="l-text">Independent marginals lose joint structure. Real PrivBayes preserves order-2 conditional dependencies under the same ε budget — the engineering is in the structure-learning step.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. DP-GAN and DP-CTGAN</h2>
<p class="l-text">Xie et al. 2018 ("Differentially Private Generative Adversarial Network") added DP-SGD to the discriminator's parameter updates. Since the generator only sees the discriminator's gradients (post-processing of DP), the whole synthesizer inherits ε. Subsequent work (Jordon 2019 "PATE-GAN", Tantipongpipat 2021 DP-CTGAN) refined this. Practical knobs: σ noise multiplier, max gradient norm C, target ε ≈ 1-10.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">DP-GAN at ε=1 typically loses 20-40% downstream model accuracy versus non-DP CTGAN. The accuracy collapse on imbalanced minority classes is even sharper. For sensitive medical data, MarginalSynthesizers (PrivBayes, MST) often outperform DP-GANs at the same ε.</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. TabDDPM — Diffusion for Tables (Kotelnikov 2023)</h2>
<p class="l-text">Kotelnikov, Baranchuk, Rubachev, Babenko (ICML 2023) adapted DDPM (Ho et al. 2020) to tabular data. Continuous columns get Gaussian noise; categorical columns use multinomial diffusion. Outperforms CTGAN on Adult, Bank, and CovType benchmarks. SDV supports it as <code>TVAESynthesizer</code> + experimental DDPM.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (TabDDPM not in Pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sdv.single_table <span class="kw">import</span> TVAESynthesizer
<span class="kw">from</span> sdv.metadata <span class="kw">import</span> SingleTableMetadata
metadata = <span class="fn">SingleTableMetadata</span>()
metadata.<span class="fn">detect_from_dataframe</span>(df_churn)
synth = <span class="fn">TVAESynthesizer</span>(metadata, epochs=<span class="num">300</span>)
synth.<span class="fn">fit</span>(df_churn)
sample = synth.<span class="fn">sample</span>(<span class="num">1000</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) runs a federated round: clients compute local updates, the server aggregates them under secure aggregation so individual gradients never leave the device.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Evaluation — Fidelity, Utility, Privacy</h2>
<p class="l-text">Three orthogonal axes, each needing its own metric.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Fidelity</div><div class="card-body">Marginal KS statistic, pairwise correlation difference, mutual-information matching, propensity score AUC.</div></div>
<div class="calc-card"><div class="card-title">Utility (TSTR)</div><div class="card-body">Train-on-Synthetic, Test-on-Real. Train classifier on synth, evaluate on real holdout. Compare to TRTR.</div></div>
<div class="calc-card"><div class="card-title">Privacy</div><div class="card-body">Membership inference: can attacker tell if a real row was in training? Distance-to-closest-record (DCR).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.stats <span class="kw">import</span> ks_2samp
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># Reuse synth_df from section 3</span>
real = df_churn[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
synth_arr = synth_df.values

<span class="cm"># 1) Fidelity: KS per column</span>
<span class="kw">for</span> i, c <span class="kw">in</span> <span class="fn">enumerate</span>([<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]):
    stat, p = <span class="fn">ks_2samp</span>(real[:,i], synth_arr[:,i])
    <span class="fn">print</span>(f<span class="str">"KS[{c}] = {stat:.3f}, p = {p:.3f}"</span>)

<span class="cm"># 2) Privacy: distance-to-closest-record</span>
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">1</span>).<span class="fn">fit</span>(real)
dists, _ = nn.<span class="fn">kneighbors</span>(synth_arr)
<span class="fn">print</span>(f<span class="str">"DCR median: {np.median(dists):.3f}  (higher = safer; 0 = exact copy)"</span>)
<span class="fn">print</span>(f<span class="str">"DCR &lt; 0.01 (near-copies): {(dists &lt; 0.01).sum()} / {len(dists)}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) calls into scikit-learn for the modelling step. 3) runs a federated round: clients compute local updates, the server aggregates them under secure aggregation so individual gradients never leave the device.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Membership Inference Auditing</h2>
<p class="l-text">The gold-standard privacy test for a synthetic dataset. Method: train shadow models on subsets, learn a binary classifier "was this row in training?", apply to held-out real rows. If AUC ≈ 0.5, no leakage. AUC &gt; 0.6 is a red flag. Stadler-Oprisanu-Troncoso (USENIX 2022) showed <em>most</em> open-source synthesizers fail this test without DP.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># Lightweight membership inference proxy:</span>
<span class="cm"># Distance to nearest synth point - if smaller than a holdout, leakage.</span>
real = df_churn[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
train, holdout = <span class="fn">train_test_split</span>(real, test_size=<span class="num">0.5</span>, random_state=<span class="num">0</span>)

<span class="cm"># Synth fit on 'train' only</span>
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KernelDensity
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
sc = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(train)
kde2 = <span class="fn">KernelDensity</span>(bandwidth=<span class="num">0.4</span>).<span class="fn">fit</span>(sc.<span class="fn">transform</span>(train))

train_ll = kde2.<span class="fn">score_samples</span>(sc.<span class="fn">transform</span>(train))
holdout_ll = kde2.<span class="fn">score_samples</span>(sc.<span class="fn">transform</span>(holdout))
<span class="fn">print</span>(f<span class="str">"Mean log-lik on train rows:    {train_ll.mean():.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean log-lik on holdout rows:  {holdout_ll.mean():.3f}"</span>)
<span class="fn">print</span>(<span class="str">"Big gap = membership leakage (synth memorizes training rows)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs a NumPy array as the working data structure. 2) calls into scikit-learn for the modelling step. 3) runs a federated round: clients compute local updates, the server aggregates them under secure aggregation so individual gradients never leave the device. 4) prints the headline metric so you can compare clean vs. attacked / private vs. public side by side.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Production Recipe</h2>
<p class="l-text">A defensible synthetic-data release pipeline. (1) De-identify direct identifiers. (2) Apply k-anonymity or microaggregation as pre-processing (URV's hybrid recipe). (3) Train a DP-synthesizer (PrivBayes or DP-CTGAN) at ε≤2 on the cleaned frame. (4) Run TSTR utility benchmarks vs baseline. (5) Run membership-inference and DCR audits. (6) Document the privacy budget, generation pipeline, and known limitations in a model card. Tools: SDV (DataCebo), Synthcity (Cambridge), IBM Diffprivlib, MOSTLY AI.</p>
</div>`,
tr: `<p class="l-text">2018'de MIT'de Lei Xu ve Kalyan Veeramachaneni "Synthesizing Tabular Data using Generative Adversarial Networks"i yayımladı — sonunda 2019'da <strong>CTGAN</strong> olarak kristalize oldu (Xu vd., NeurIPS 2019). Motivasyonları: hastaneler, bankalar ve devletler paylaşamadıkları tablo verisi tutar — ama eğer üreteç tek bir eğitim satırını ezberlemezse ortak dağılımı taklit eden <em>sentetik</em> bir veri seti serbestçe yayımlanabilir. CTGAN tablo verisinin benzersiz acılarına çözüm getirdi — karışık sürekli/ayrık sütunlar, çok modlu dağılımlar, şiddetli sınıf dengesizliği — ve de facto temel oldu. 2024'e gelindiğinde Synthetic Data Vault (SDV, MIT spin-off DataCebo) 5 milyondan fazla kez indirilmişti.</p>
<p class="l-text">Ama sentetik veri otomatik olarak özel değildir. DP olmadan eğitilen bir GAN eğitim satırlarını kelimesi kelimesine ezberleyip yeniden üretebilir (Hayes vd. 2017, "LOGAN: Membership Inference Attacks against Generative Models"). Düzeltme <em>DP-GAN</em>'dır (Xie vd. 2018) — discriminator'ın gradyanına uygulanan DP-SGD — ve <strong>PrivBayes</strong> (Zhang vd. 2017, SIGMOD) gibi parametrik alternatifler düşük dereceli marjinaller üzerinde diferansiyel olarak özel bir Bayes ağı uydurur. 2024 dalgası <em>TabDDPM</em>'i getirdi (Kotelnikov 2023) — tablo verisi için difüzyon modelleri — çoğu benchmark'ta CTGAN'dan üstün. Bu ders üreteçleri inceler, scikit-learn'de tarayıcınızda çalışan bir Gauss-KDE sentezleyici inşa eder ve değerlendirme üçlüsünü ele alır: doğruluk, fayda ve gizlilik.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">NELER ÖĞRENECEKSİNİZ</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sentetik veri için durum — paylaşmadan paylaşma</li>
<li>CTGAN (Xu 2019) — moda özel normalizasyon ve koşullu üreteçler</li>
<li>TabDDPM ve tablo verisi için difüzyon dönüşü (Kotelnikov 2023)</li>
<li>DP-GAN — discriminator üzerinde DP-SGD (Xie 2018)</li>
<li>PrivBayes — marjinaller üzerinde DP Bayes ağları (Zhang 2017)</li>
<li>scikit-learn'de çalıştırılabilir bir Gauss-KDE sentezleyici inşa etmek</li>
<li>Değerlendirme: TSTR faydası, istatistiksel doğruluk, üyelik-çıkarım denetimi</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Neden Sentetik Veri?</h2>
<p class="l-text">Üç sürücü. (1) <em>Düzenleme altında paylaşma</em>: HIPAA, GDPR, PCI-DSS ham yayımı yasaklar; sentetik potansiyel olarak kişisel değildir. (2) <em>Sınıf dengesizliği</em>: nadir olaylar (dolandırıcılık, kusurlar) az temsil edilmiştir; örnek artırmak için sentezle. (3) <em>Yazılım geliştirme</em>: PII'yi ifşa etmeden gerçekçi test sabit verileri. Yakalama: yalnızca <em>diferansiyel olarak özel</em> sentezleyiciler formal garanti sunar. Vanilla CTGAN nadir satırları kopyalar.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Marjinal-tabanlı</div><div class="card-body">Düşük dereceli ortak dağılımları uydur. PrivBayes, MST, AIM. Sıkı DP, makul doğruluk.</div></div>
<div class="calc-card"><div class="card-title">GAN-tabanlı</div><div class="card-body">CTGAN, CT-Wasserstein, DP-CTGAN. Çok modlu sayısallarda güçlü, orta düzey DP maliyeti.</div></div>
<div class="calc-card"><div class="card-title">Difüzyon</div><div class="card-body">TabDDPM (2023), STaSy. Çoğu tablo benchmark'ında yeni SOTA. DP varyantları yeni çıkıyor.</div></div>
<div class="calc-card"><div class="card-title">Copula / parametrik</div><div class="card-body">Gauss copula, Bayes ağı. Hızlı, yorumlanabilir, karmaşık ortaklıklarda zayıf.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. CTGAN — Moda Özel Normalizasyon ile Tablo GAN'ı</h2>
<p class="l-text">Xu vd. NeurIPS 2019 GAN'ları üç yenilikle tablo verisi üzerinde çalıştırdı. (1) <em>Moda özel normalizasyon</em> — sürekli sütun başına bir VGM (variational Gaussian mixture) uydur, her değeri (mod indisi, ölçeklenmiş artık) olarak kodla. (2) <em>Koşullu üreteç</em> — bir ayrık sütun değeri örnekle, üreteci ona koşullu yap, o koşul üzerinde cross-entropy ile eğit. (3) <em>Örnekleme-ile-eğitim</em> — dengesizliği yönetmek için batch'leri kategoriye göre yeniden dengele.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — SADECE DEMO (CTGAN Pyodide'da yok)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sdv.single_table <span class="kw">import</span> CTGANSynthesizer
<span class="kw">from</span> sdv.metadata <span class="kw">import</span> SingleTableMetadata

metadata = <span class="fn">SingleTableMetadata</span>()
metadata.<span class="fn">detect_from_dataframe</span>(df_churn)

synth = <span class="fn">CTGANSynthesizer</span>(metadata, epochs=<span class="num">300</span>, verbose=<span class="kw">True</span>)
synth.<span class="fn">fit</span>(df_churn)
synthetic = synth.<span class="fn">sample</span>(num_rows=<span class="num">1000</span>)
synthetic.<span class="fn">head</span>()
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) federe bir tür koşturur: istemciler yerel güncellemeleri hesaplar, sunucu bunları güvenli toplama altında birleştirir; bireysel gradyanlar cihazı asla terk etmez.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Çalıştırılabilir Sentezleyici — Scikit-Learn'de Gauss KDE</h2>
<p class="l-text">CTGAN Pyodide'da çalışmaz. Çekirdek yoğunluğu tahmini (KDE) kullanarak çalışan bir sentezleyici inşa ederiz: sayısal sütunlar üzerinde çok değişkenli bir KDE uydur ve ondan örnekle. KDE GAN-tabanlı sentezleyicilerin parametrik atasıdır — aynı fikir, daha basit istatistikler.</p>
<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">df_churn üzerinde KDE sentezleyici — 200 sentetik satır örnekle</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KernelDensity
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

df = df_churn.<span class="fn">copy</span>()
cols = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
X = df[cols].values.<span class="fn">astype</span>(<span class="fn">float</span>)
scaler = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X)
Xs = scaler.<span class="fn">transform</span>(X)

kde = <span class="fn">KernelDensity</span>(kernel=<span class="str">'gaussian'</span>, bandwidth=<span class="num">0.4</span>).<span class="fn">fit</span>(Xs)
synth = scaler.<span class="fn">inverse_transform</span>(kde.<span class="fn">sample</span>(<span class="num">200</span>, random_state=<span class="num">0</span>))
synth_df = pd.<span class="fn">DataFrame</span>(synth, columns=cols).<span class="fn">round</span>(<span class="num">2</span>)

<span class="fn">print</span>(<span class="str">"Original means:    "</span>, df[cols].<span class="fn">mean</span>().values.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Synthetic means:   "</span>, synth_df.<span class="fn">mean</span>().values.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Original stdevs:   "</span>, df[cols].<span class="fn">std</span>().values.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Synthetic stdevs:  "</span>, synth_df.<span class="fn">std</span>().values.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Synthetic head:"</span>)
<span class="fn">print</span>(synth_df.<span class="fn">head</span>().<span class="fn">to_string</span>())
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) modelleme adımı için scikit-learn'e başvurur. 3) federe bir tür koşturur: istemciler yerel güncellemeleri hesaplar, sunucu bunları güvenli toplama altında birleştirir; bireysel gradyanlar cihazı asla terk etmez.</p>
</div>
<p class="l-text">Ortalamalar ve standart sapmalar örnekleme gürültüsü içinde eşleşir. KDE marjinalleri iyi korur; ortak bağımlılıklar için GAN/difüzyon modelleri daha iyidir.</p>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. PrivBayes — DP Bayes Ağları (Zhang 2017)</h2>
<p class="l-text">Zhang, Cormode, Procopiuc, Srivastava, Xiao (SIGMOD 2017) formal garantili ilk pratik DP sentezleyiciyi verdi. (1) Kenarları en bilgilendirici düşük dereceli marjinaller olan bir Bayes ağını özel olarak açgözlü inşa et (üstel mekanizma kullanarak). (2) Laplace gürültüsü ile DP marjinalleri örnekle. (3) Gürültülü ağdan ata örneklemesiyle üret. PrivBayes IBM Diffprivlib'de gönderilir ve herhangi bir yeni DP sentezleyici makalesinin temel çizgisidir.</p>
<div class="katex-block">$$\\Pr[M(D) \\in S] \\le e^{\\varepsilon} \\Pr[M(D') \\in S] \\quad (\\text{whole pipeline})$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="cm"># Mini-PrivBayes: 1-yönlü DP marjinaller, bağımsız örnekle. Gerçek PrivBayes</span>
<span class="cm"># 2/3 dereceli koşullu ağ öğrenir — tam uygulama için Diffprivlib'e bakın.</span>
df = df_churn.<span class="fn">copy</span>()
cols = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>,<span class="str">'churned'</span>]
eps = <span class="num">1.0</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

dp_marginals = {}
<span class="kw">for</span> c <span class="kw">in</span> cols:
    counts = df[c].<span class="fn">value_counts</span>().<span class="fn">sort_index</span>()
    noisy = counts.values + rng.<span class="fn">laplace</span>(scale=<span class="num">1.0</span>/eps, size=<span class="fn">len</span>(counts))
    noisy = np.<span class="fn">clip</span>(noisy, <span class="num">0</span>, <span class="kw">None</span>)
    dp_marginals[c] = (counts.index.values, noisy / noisy.<span class="fn">sum</span>())

<span class="cm"># Bagimsiz ornekle (gercek PrivBayes ogrenilmis ag kullanir)</span>
N = <span class="num">200</span>
synth = pd.<span class="fn">DataFrame</span>({c: rng.<span class="fn">choice</span>(v, size=N, p=p) <span class="kw">for</span> c, (v,p) <span class="kw">in</span> dp_marginals.<span class="fn">items</span>()})
<span class="fn">print</span>(<span class="str">"DP-synthetic head:"</span>); <span class="fn">print</span>(synth.<span class="fn">head</span>().<span class="fn">to_string</span>())
<span class="fn">print</span>(<span class="str">"\\nMarginal preservation (mean tenure):  orig={:.2f}  synth={:.2f}"</span>.<span class="fn">format</span>(
      df[<span class="str">'tenure_months'</span>].<span class="fn">mean</span>(), synth[<span class="str">'tenure_months'</span>].<span class="fn">mean</span>()))
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) aşağıda yapılacak analiz için ham dizilerden bir pandas DataFrame oluşturur. 2) federe bir tür koşturur: istemciler yerel güncellemeleri hesaplar, sunucu bunları güvenli toplama altında birleştirir; bireysel gradyanlar cihazı asla terk etmez.</p>
<p class="l-text">Bağımsız marjinaller ortak yapıyı kaybeder. Gerçek PrivBayes aynı ε bütçesi altında 2. derece koşullu bağımlılıkları korur — mühendislik yapı-öğrenme adımındadır.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. DP-GAN ve DP-CTGAN</h2>
<p class="l-text">Xie vd. 2018 ("Differentially Private Generative Adversarial Network") DP-SGD'yi discriminator'ın parametre güncellemelerine ekledi. Üreteç yalnızca discriminator'ın gradyanlarını gördüğünden (DP'nin son işlemesi), tüm sentezleyici ε miras alır. Sonraki çalışmalar (Jordon 2019 "PATE-GAN", Tantipongpipat 2021 DP-CTGAN) bunu rafine etti. Pratik düğmeler: σ gürültü çarpanı, maksimum gradyan normu C, hedef ε ≈ 1-10.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">DP-GAN ε=1'de tipik olarak DP olmayan CTGAN'a kıyasla aşağı akış model doğruluğunda %20-40 kaybeder. Dengesiz azınlık sınıflarında doğruluk çöküşü daha da keskindir. Hassas tıbbi veriler için, MarginalSynthesizer'lar (PrivBayes, MST) aynı ε'da DP-GAN'lardan sıklıkla üstün performans gösterir.</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. TabDDPM — Tablolar İçin Difüzyon (Kotelnikov 2023)</h2>
<p class="l-text">Kotelnikov, Baranchuk, Rubachev, Babenko (ICML 2023) DDPM'i (Ho vd. 2020) tablo verisine uyarladı. Sürekli sütunlar Gauss gürültüsü alır; kategorik sütunlar multinomial difüzyon kullanır. Adult, Bank ve CovType benchmark'larında CTGAN'dan üstün performans gösterir. SDV bunu <code>TVAESynthesizer</code> + deneysel DDPM olarak destekler.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — SADECE DEMO (TabDDPM Pyodide'da yok)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sdv.single_table <span class="kw">import</span> TVAESynthesizer
<span class="kw">from</span> sdv.metadata <span class="kw">import</span> SingleTableMetadata
metadata = <span class="fn">SingleTableMetadata</span>()
metadata.<span class="fn">detect_from_dataframe</span>(df_churn)
synth = <span class="fn">TVAESynthesizer</span>(metadata, epochs=<span class="num">300</span>)
synth.<span class="fn">fit</span>(df_churn)
sample = synth.<span class="fn">sample</span>(<span class="num">1000</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) federe bir tür koşturur: istemciler yerel güncellemeleri hesaplar, sunucu bunları güvenli toplama altında birleştirir; bireysel gradyanlar cihazı asla terk etmez.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Değerlendirme — Doğruluk, Fayda, Gizlilik</h2>
<p class="l-text">Üç dik eksen, her biri kendi metriğini gerektirir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğruluk</div><div class="card-body">Marjinal KS istatistiği, ikili korelasyon farkı, karşılıklı bilgi eşleştirme, eğilim puanı AUC.</div></div>
<div class="calc-card"><div class="card-title">Fayda (TSTR)</div><div class="card-body">Train-on-Synthetic, Test-on-Real. Synth üzerinde sınıflandırıcı eğit, gerçek holdout üzerinde değerlendir. TRTR ile karşılaştır.</div></div>
<div class="calc-card"><div class="card-title">Gizlilik</div><div class="card-body">Üyelik çıkarımı: saldırgan gerçek bir satırın eğitimde olup olmadığını söyleyebilir mi? Distance-to-closest-record (DCR).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> scipy.stats <span class="kw">import</span> ks_2samp
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># Bölüm 3'teki synth_df'yi yeniden kullan</span>
real = df_churn[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
synth_arr = synth_df.values

<span class="cm"># 1) Dogruluk: sutun basina KS</span>
<span class="kw">for</span> i, c <span class="kw">in</span> <span class="fn">enumerate</span>([<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]):
    stat, p = <span class="fn">ks_2samp</span>(real[:,i], synth_arr[:,i])
    <span class="fn">print</span>(f<span class="str">"KS[{c}] = {stat:.3f}, p = {p:.3f}"</span>)

<span class="cm"># 2) Gizlilik: distance-to-closest-record</span>
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">1</span>).<span class="fn">fit</span>(real)
dists, _ = nn.<span class="fn">kneighbors</span>(synth_arr)
<span class="fn">print</span>(f<span class="str">"DCR median: {np.median(dists):.3f}  (higher = safer; 0 = exact copy)"</span>)
<span class="fn">print</span>(f<span class="str">"DCR &lt; 0.01 (near-copies): {(dists &lt; 0.01).sum()} / {len(dists)}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) modelleme adımı için scikit-learn'e başvurur. 3) federe bir tür koşturur: istemciler yerel güncellemeleri hesaplar, sunucu bunları güvenli toplama altında birleştirir; bireysel gradyanlar cihazı asla terk etmez.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Üyelik Çıkarımı Denetimi</h2>
<p class="l-text">Bir sentetik veri seti için altın standart gizlilik testi. Yöntem: alt kümeler üzerinde shadow modelleri eğit, "bu satır eğitimde miydi?" ikili sınıflandırıcısını öğren, tutulmuş gerçek satırlara uygula. AUC ≈ 0.5 ise sızıntı yok. AUC &gt; 0.6 kırmızı bayraktır. Stadler-Oprisanu-Troncoso (USENIX 2022), <em>çoğu</em> açık kaynak sentezleyicinin DP olmadan bu testte başarısız olduğunu gösterdi.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># Hafif üyelik çıkarımı vekili:</span>
<span class="cm"># En yakın synth noktasına mesafe - holdout'tan küçükse, sızıntı.</span>
real = df_churn[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
train, holdout = <span class="fn">train_test_split</span>(real, test_size=<span class="num">0.5</span>, random_state=<span class="num">0</span>)

<span class="cm"># Synth yalnizca 'train' uzerinde uydurulur</span>
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> KernelDensity
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
sc = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(train)
kde2 = <span class="fn">KernelDensity</span>(bandwidth=<span class="num">0.4</span>).<span class="fn">fit</span>(sc.<span class="fn">transform</span>(train))

train_ll = kde2.<span class="fn">score_samples</span>(sc.<span class="fn">transform</span>(train))
holdout_ll = kde2.<span class="fn">score_samples</span>(sc.<span class="fn">transform</span>(holdout))
<span class="fn">print</span>(f<span class="str">"Mean log-lik on train rows:    {train_ll.mean():.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean log-lik on holdout rows:  {holdout_ll.mean():.3f}"</span>)
<span class="fn">print</span>(<span class="str">"Big gap = membership leakage (synth memorizes training rows)"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) çalışma veri yapısı olarak bir NumPy dizisi kurar. 2) modelleme adımı için scikit-learn'e başvurur. 3) federe bir tür koşturur: istemciler yerel güncellemeleri hesaplar, sunucu bunları güvenli toplama altında birleştirir; bireysel gradyanlar cihazı asla terk etmez. 4) temiz ve saldırılı / özel ve halka açık karşılaştırmasını yan yana okuyabilesin diye başlık metriğini yazdırır.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Üretim Tarifi</h2>
<p class="l-text">Savunulabilir bir sentetik-veri yayım boru hattı. (1) Doğrudan tanımlayıcıları kimlikten arındır. (2) Ön işleme olarak k-anonymity veya microaggregation uygula (URV'nin hibrit tarifi). (3) Temizlenmiş frame üzerinde ε≤2'de bir DP-sentezleyici (PrivBayes veya DP-CTGAN) eğit. (4) Temele karşı TSTR fayda benchmark'larını çalıştır. (5) Üyelik-çıkarımı ve DCR denetimlerini çalıştır. (6) Gizlilik bütçesini, üretim boru hattını ve bilinen sınırlamaları bir model kartında belgele. Araçlar: SDV (DataCebo), Synthcity (Cambridge), IBM Diffprivlib, MOSTLY AI.</p>
</div>`
};
