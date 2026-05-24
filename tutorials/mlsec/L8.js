window.MLSEC_L8 = {
en: `<p class="l-text"><strong>Empirical defenses claim "I tested 10K attacks and 71% failed". Certified defenses prove "for any perturbation with ‖δ‖_p ≤ R, the model's prediction does not change".</strong> Athalye 2018 broke 7 of 8 ICLR'18 defenses precisely because empirical testing missed the gradient-masking trick. Mathematical guarantees are the only thing that survive an Athalye-style adaptive attack — by definition, the proof excludes all attacks within the radius. Three families produce certified radii in 2026: <strong>Lipschitz constraints</strong> (architectural, cheap, small radii), <strong>randomized smoothing</strong> (Cohen 2019, ℓ_2 radii via Gaussian-noise averaging, scales to ImageNet), and <strong>verification</strong> (interval bound propagation, CROWN, alpha-beta-CROWN — exact ℓ_∞ radii but expensive).</p>

<p class="l-text">The trade-offs are stark. Lipschitz nets give you the cheapest certificates (a forward pass plus a constant) but the smallest radii (often 1-2 pixels). Randomized smoothing scales to large models but gives stochastic guarantees ("with probability 99.99% over noise samples") and only covers ℓ_2. Verification (alpha-beta-CROWN, the VNN-COMP champion) gives deterministic ℓ_∞ certificates but takes seconds-to-minutes per input. The IBP family (Gowal 2018) is the trainable variant — fast certified ℓ_∞ training that integrates into SGD. This lesson covers all four with code, diagrams of the loss-landscape trade-off, and the 2026 state of the art (alpha-beta-CROWN won VNN-COMP 2023 and 2024).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Define certified robustness vs. empirical robustness, and why Athalye 2018 makes the distinction load-bearing</li>
<li>Compute certified radii via the Cohen 2019 randomized-smoothing theorem</li>
<li>Implement the Monte Carlo certification procedure with Clopper-Pearson confidence intervals</li>
<li>Understand interval bound propagation (IBP) as a fast trainable verifier</li>
<li>Reason about CROWN linear bounds and alpha-beta-CROWN branch-and-bound</li>
<li>Read the radius-accuracy trade-off curves and pick a defense for a given threat model</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. What "Certified" Means</h2>
<p class="l-text">A certified classifier g comes with a function R(x) such that for every input x:</p>

<div class="katex-block">$$\\| \\boldsymbol\\delta \\|_p \\le R(\\mathbf{x}) \\;\\Rightarrow\\; g(\\mathbf{x} + \\boldsymbol\\delta) = g(\\mathbf{x})$$</div>

<p class="l-text">The certificate R is a mathematical guarantee — independent of the attacker's compute budget, optimization procedure, or knowledge. Compare to empirical defenses, where "robust accuracy under PGD" is a lower bound that can be (and frequently is) overstated by a stronger future attack.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Deterministic vs. stochastic</div><div class="card-body">IBP / CROWN give deterministic certificates ("for ALL δ in the ball"). Randomized smoothing gives high-probability certificates ("for δ in the ball, with probability ≥ 1 - α").</div></div>
<div class="calc-card"><div class="card-title">ℓ_p norms</div><div class="card-body">Smoothing → ℓ_2 (Gaussian noise). IBP → ℓ_∞ (interval arithmetic). Other p require more work and give weaker results.</div></div>
<div class="calc-card"><div class="card-title">Tight vs. loose</div><div class="card-body">An exact verifier returns the largest provable R. IBP is loose — its R is much smaller than the true robust radius. Trade-off: speed vs. tightness.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Smoothing: ~10K forward passes per certified input. IBP: ~2× a normal forward pass. CROWN: ~10×. alpha-beta-CROWN: seconds to minutes per input.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Lipschitz-Constrained Networks</h2>
<p class="l-text">If a network f is K-Lipschitz (i.e. ‖f(x) - f(y)‖ ≤ K · ‖x - y‖), then small input changes produce bounded output changes. From bounded output changes you derive a robust radius. Easiest possible certificate.</p>

<div class="katex-block">$$R(\\mathbf{x}) = \\frac{f_{c^*}(\\mathbf{x}) - \\max_{c \\ne c^*} f_c(\\mathbf{x})}{\\sqrt{2} \\cdot K}$$</div>

<p class="l-text">where c* is the predicted class and the difference in the numerator is the prediction margin. Achieving small K is the hard part. Approaches:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spectral normalization</div><div class="card-body">Constrain each weight matrix's spectral norm to ≤ 1 (Miyato 2018). Total Lipschitz constant = product of layer norms. Tight for linear layers, loose for ReLU networks.</div></div>
<div class="calc-card"><div class="card-title">Orthogonal layers (Trockman 2021)</div><div class="card-body">Each weight matrix exactly orthogonal — preserves Lipschitz constant of 1. Used in Cayley networks, GroupSort.</div></div>
<div class="calc-card"><div class="card-title">GroupSort activation</div><div class="card-body">Replace ReLU with a sort within groups of K neurons — gradient-norm-preserving and 1-Lipschitz. Yields tight Lipschitz networks (Anil 2019).</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">~5-15% accuracy hit on CIFAR-10 vs. unconstrained ResNet. Certified ℓ_2 radii ~36-72/255 — small but meaningful.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Randomized Smoothing — Cohen 2019</h2>
<p class="l-text">The most impactful certified defense. Define the smoothed classifier g as the majority vote of f over Gaussian noise:</p>

<div class="katex-block">$$g(\\mathbf{x}) = \\arg\\max_c \\; \\mathbb{P}_{\\boldsymbol\\eta \\sim \\mathcal{N}(0, \\sigma^2 I)}\\bigl[ f(\\mathbf{x} + \\boldsymbol\\eta) = c \\bigr]$$</div>

<p class="l-text">Cohen's theorem: if under noise the most likely class has probability p_A and the runner-up has p_B, then g is robust against any perturbation with:</p>

<div class="katex-block">$$\\| \\boldsymbol\\delta \\|_2 \\le R = \\frac{\\sigma}{2}\\bigl( \\Phi^{-1}(p_A) - \\Phi^{-1}(p_B) \\bigr)$$</div>

<p class="l-text">where Φ is the standard normal CDF. The radius scales with σ (more noise = bigger radius but lower clean accuracy) and with the gap between top-1 and top-2 probabilities (model confidence).</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Train a LogReg, smooth via Gaussian noise (σ=0.5, K=2000 samples), compute Cohen radius for each test point.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> scipy.stats <span class="kw">import</span> norm

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="cm"># Train base model on noisy data so it learns to handle σ=0.5 noise</span>
sigma = <span class="num">0.5</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
Xtr_aug = np.<span class="fn">vstack</span>([Xtr + rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma, Xtr.shape) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>)])
ytr_aug = np.<span class="fn">tile</span>(ytr, <span class="num">3</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xtr_aug, ytr_aug)

<span class="kw">def</span> <span class="fn">smooth_predict</span>(x, K=<span class="num">2000</span>):
    noise = rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma, (K, <span class="fn">len</span>(x)))
    preds = clf.<span class="fn">predict</span>(x + noise)
    pA = (preds == <span class="num">1</span>).<span class="fn">mean</span>()
    pB = <span class="num">1</span> - pA
    <span class="kw">cls</span> = <span class="num">1</span> <span class="kw">if</span> pA &gt; pB <span class="kw">else</span> <span class="num">0</span>
    p_top = <span class="fn">max</span>(pA, pB)
    p_run = <span class="num">1</span> - p_top
    <span class="kw">if</span> p_top &lt;= <span class="num">0.5</span>:
        <span class="kw">return</span> <span class="kw">cls</span>, <span class="num">0.0</span>
    R = (sigma / <span class="num">2</span>) * (norm.<span class="fn">ppf</span>(p_top) - norm.<span class="fn">ppf</span>(p_run))
    <span class="kw">return</span> <span class="kw">cls</span>, R

<span class="fn">print</span>(<span class="str">"Cohen 2019 certified radii on first 8 test points:"</span>)
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
    <span class="kw">cls</span>, R = <span class="fn">smooth_predict</span>(Xte[i])
    correct = (<span class="kw">cls</span> == yte[i])
    <span class="fn">print</span>(f<span class="str">"  pred={cls} (true={yte[i]}, {'OK' if correct else 'WRONG'})  certified R={R:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains the base <code>LogisticRegression</code> on a Gaussian-noise-augmented churn dataset (each row repeated 3 times with <code>N(0, σ²)</code> added) so the base classifier already handles <code>σ = 0.5</code> perturbations — the Cohen 2019 prescription. 2) <code>smooth_predict(x, K)</code> draws <code>K = 2000</code> noise samples, runs the base model on <code>x + noise</code>, and uses the empirical class-1 frequency <code>pA</code> and runner-up <code>pB = 1 - pA</code> as Cohen's smoothed-classifier probabilities. 3) if <code>p_top &gt; 0.5</code> it computes the certified ℓ_2 radius <code>R = (σ/2)(Φ⁻¹(p_top) − Φ⁻¹(p_run))</code> with <code>scipy.stats.norm.ppf</code> — directly the Cohen theorem. 4) prints prediction and certified radius for the first 8 test points so you can see how confidence (the gap between <code>p_top</code> and <code>p_run</code>) translates into robust radius.</p>
</div>

<p class="l-text">Most points get R between 0.1 and 1.0 in standardized-feature space. Higher σ (try 1.0) gives larger radii at the cost of clean accuracy.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Monte Carlo Certification with Clopper-Pearson</h2>
<p class="l-text">In practice you cannot compute p_A exactly — you Monte-Carlo it with K samples. Cohen 2019 uses a Clopper-Pearson confidence bound to get a high-probability lower bound on p_A:</p>

<div class="katex-block">$$\\underline{p_A} = \\text{Beta}^{-1}\\bigl(\\alpha;\\, n_A,\\, K - n_A + 1\\bigr)$$</div>

<p class="l-text">where n_A is the number of times the top class was predicted out of K samples and α is the desired confidence level (typically α = 0.001). Substitute the lower bound into the radius formula. The certificate now reads "with probability ≥ 1 - α (over noise samples), R is a valid certified radius".</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K = 100 vs. K = 100000</div><div class="card-body">More samples → tighter Clopper-Pearson bound → larger certified R. Cohen used K=100K for high-resolution certificates on ImageNet.</div></div>
<div class="calc-card"><div class="card-title">Abstain</div><div class="card-body">If the lower bound on p_A is ≤ 0.5, the smoothed classifier abstains (no certificate). Real deployments need an abstain-rate budget.</div></div>
<div class="calc-card"><div class="card-title">Higher σ</div><div class="card-body">Bigger noise → bigger R but lower base-model accuracy. The clean-accuracy / certified-radius trade-off curve is the central design knob.</div></div>
<div class="calc-card"><div class="card-title">Salman 2019</div><div class="card-body">Combines randomized smoothing with adversarial training of the base model — best certified radii on ImageNet, ~70% top-1 at R = 0.5 in pixel space.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Interval Bound Propagation (IBP)</h2>
<p class="l-text">Gowal et al. (2018, "On the Effectiveness of Interval Bound Propagation for Training Verifiably Robust Models") gave the canonical fast trainable verifier. Idea: propagate ℓ_∞ intervals layer by layer. For an input x with ‖δ‖_∞ ≤ ε, compute lower and upper bounds (l, u) of every neuron's activation. If at the output layer the lower bound of the true class exceeds the upper bound of every other class, the prediction is verified.</p>

<div class="katex-block">$$\\mathbf{l}^{(k+1)} = W^{(k)}_+ \\mathbf{l}^{(k)} + W^{(k)}_- \\mathbf{u}^{(k)} + \\mathbf{b}^{(k)}, \\quad \\mathbf{u}^{(k+1)} = W^{(k)}_+ \\mathbf{u}^{(k)} + W^{(k)}_- \\mathbf{l}^{(k)} + \\mathbf{b}^{(k)}$$</div>

<p class="l-text">where W_+ and W_- are the positive and negative parts of the weight matrix. ReLU: l → max(l, 0), u → max(u, 0). Trainable: define an IBP loss that pushes the lower bound of the true class above the upper bounds of others; differentiate; train with SGD.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Speed</div><div class="card-body">~2× a regular forward pass. Trains fast enough to use in normal training loops (Gowal trains CIFAR-10 ResNet to 50%+ verified accuracy).</div></div>
<div class="calc-card"><div class="card-title">Looseness</div><div class="card-body">Interval bounds get loose quickly across deep networks (each layer compounds the relaxation). Verified accuracy is significantly below true robust accuracy.</div></div>
<div class="calc-card"><div class="card-title">CROWN-IBP (Zhang 2020)</div><div class="card-body">Hybrid: IBP for early layers, CROWN linear bounds for later layers. Tighter at moderate cost. Standard baseline.</div></div>
<div class="calc-card"><div class="card-title">Loss landscape</div><div class="card-body">IBP-trained networks look very different from normal nets — more linear, more pruning-friendly. This is a feature for verification, not a bug.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CROWN — Tighter Linear Bounds</h2>
<p class="l-text">Zhang et al. (2018, "Efficient Neural Network Robustness Certification with General Activation Functions") introduced CROWN: instead of intervals, propagate <em>linear</em> upper and lower bounds on each activation. For ReLU(x) with input range [l, u]:</p>

<div class="katex-block">$$\\text{lower bound: } \\alpha x \\quad \\text{upper bound: } \\frac{u}{u - l}(x - l)$$</div>

<p class="l-text">where α ∈ [0, 1] is a tunable slope. CROWN propagates these linear bounds backward (a la backprop) to express the output as a linear function of the input — much tighter than IBP at the cost of more computation.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CROWN vs. IBP</div><div class="card-body">CROWN is ~3-10× tighter (verifies a larger fraction of inputs at any given ε). Cost: ~10× a forward pass.</div></div>
<div class="calc-card"><div class="card-title">α-CROWN</div><div class="card-body">Optimize α via gradient descent to maximize verified bound. Tighter than fixed-α at proportional extra cost.</div></div>
<div class="calc-card"><div class="card-title">Beta-CROWN (Wang 2021)</div><div class="card-body">Adds branch-and-bound: split the input range, recurse. Closes the gap between CROWN bound and exact verification.</div></div>
<div class="calc-card"><div class="card-title">alpha-beta-CROWN</div><div class="card-body">The combined verifier — won VNN-COMP 2021, 2022, 2023, 2024. The 2026 state of the art for ℓ_∞ verification.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. alpha-beta-CROWN and the VNN Competition</h2>
<p class="l-text">VNN-COMP (Verification of Neural Networks Competition) is the annual benchmark for verifiers. alpha-beta-CROWN dominates the deep-net categories. The pipeline:</p>

<ol style="line-height:1.7;padding-left:1.3rem">
<li>Run CROWN to get an initial bound — fast.</li>
<li>If the bound does not certify (or refute), branch on the most uncertain ReLU (split into its active and inactive sides).</li>
<li>Recursively verify each subproblem with α-CROWN.</li>
<li>Optimize the relaxation parameters α and β with SGD on the bound itself.</li>
</ol>

<p class="l-text">Result: exact verification on networks up to ~10M parameters, ε = 8/255, in seconds-to-minutes per input. Open-source: <code>github.com/Verified-Intelligence/alpha-beta-CROWN</code>.</p>

<div class="calc-highlight"><strong>Bottom line for 2026:</strong> for deterministic ℓ_∞ verification on networks up to medium-size CNNs, use alpha-beta-CROWN. For ℓ_2 randomized smoothing on ImageNet-scale models, use Salman 2019. For trainable certified-robust models, use CROWN-IBP. For Lipschitz networks, GroupSort + orthogonal layers.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Certified robustness gives a mathematical guarantee — survives Athalye-style adaptive attacks by construction.</li>
<li>Lipschitz networks: smallest radii, cheapest certificate (one forward pass + a constant).</li>
<li>Randomized smoothing (Cohen 2019): ℓ_2 certificates via Gaussian noise. Scales to ImageNet. Stochastic guarantee.</li>
<li>IBP (Gowal 2018): trainable interval verifier. Fast but loose. Standard for certified training.</li>
<li>CROWN (Zhang 2018): tighter linear bounds. α-, β-, and alpha-beta-CROWN extensions are the 2026 state of the art for ℓ_∞ verification.</li>
<li>VNN-COMP champion: alpha-beta-CROWN. Open-source, exact verification on medium CNNs.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L9</strong> shifts to LLM-specific issues: prompt injection (Greshake 2023), GCG and PAIR jailbreaks (Zou 2023, Chao 2023), training-data extraction (Carlini 2021). <strong>mlsec-L10</strong> is the AI red-team capstone covering OWASP LLM Top 10, Garak, PyRIT, and responsible disclosure methodology.</p>
</div>`,
tr: `<p class="l-text"><strong>Ampirik savunmalar "10K saldırı denedim ve %71'i başarısız oldu" der. Sertifikalı savunmalar "‖δ‖_p ≤ R olan herhangi bir pertürbasyon için modelin tahmini değişmez" kanıtlar.</strong> Athalye 2018, ICLR'18'in 8 savunmasından 7'sini tam olarak ampirik testin gradyan-maskeleme hilesini kaçırdığı için kırdı. Matematiksel garantiler Athalye-tarzı uyarlamalı saldırıdan sağ çıkan tek şeydir — tanım gereği, kanıt yarıçap içindeki tüm saldırıları dışlar. 2026'da üç aile sertifikalı yarıçaplar üretir: <strong>Lipschitz kısıtları</strong> (mimari, ucuz, küçük yarıçaplar), <strong>rastgele yumuşatma</strong> (Cohen 2019, Gauss-gürültü ortalama yoluyla ℓ_2 yarıçaplar, ImageNet'e ölçeklenir) ve <strong>doğrulama</strong> (interval bound propagation, CROWN, alpha-beta-CROWN — kesin ℓ_∞ yarıçaplar ama pahalı).</p>

<p class="l-text">Değiş-tokuşlar serttir. Lipschitz ağlar en ucuz sertifikaları verir (bir ileri geçiş artı bir sabit) ama en küçük yarıçaplar (sıkça 1-2 piksel). Rastgele yumuşatma büyük modellere ölçeklenir ama stokastik garantiler verir ("gürültü örnekleri üzerinde %99.99 olasılıkla") ve yalnızca ℓ_2'yi kapsar. Doğrulama (alpha-beta-CROWN, VNN-COMP şampiyonu) deterministik ℓ_∞ sertifikaları verir ama girdi başına saniye-dakikalar alır. IBP ailesi (Gowal 2018) eğitilebilir varyanttır — SGD'ye entegre olan hızlı sertifikalı ℓ_∞ eğitim. Bu ders dördünü de kodla, kayıp-manzarası değiş-tokuşunun diyagramlarıyla ve 2026 son teknoloji durumuyla kapsar (alpha-beta-CROWN VNN-COMP 2023 ve 2024'ü kazandı).</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Sertifikalı dayanıklılık vs. ampirik dayanıklılığı tanımlamak ve Athalye 2018'in ayrımı neden yük-taşıyıcı yaptığını</li>
<li>Cohen 2019 rastgele-yumuşatma teoremi yoluyla sertifikalı yarıçapları hesaplamak</li>
<li>Clopper-Pearson güven aralıklarıyla Monte Carlo sertifikalandırma prosedürünü uygulamak</li>
<li>Interval bound propagation (IBP)'ı hızlı eğitilebilir doğrulayıcı olarak anlamak</li>
<li>CROWN lineer sınırları ve alpha-beta-CROWN dal-ve-sınır hakkında akıl yürütmek</li>
<li>Yarıçap-doğruluk değiş-tokuş eğrilerini okumak ve verilen tehdit modeli için savunma seçmek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. "Sertifikalı"nın Anlamı</h2>
<p class="l-text">Sertifikalı bir sınıflandırıcı g, her x girdisi için şunu sağlayan bir R(x) fonksiyonuyla gelir:</p>

<div class="katex-block">$$\\| \\boldsymbol\\delta \\|_p \\le R(\\mathbf{x}) \\;\\Rightarrow\\; g(\\mathbf{x} + \\boldsymbol\\delta) = g(\\mathbf{x})$$</div>

<p class="l-text">R sertifikası matematiksel garantidir — saldırganın hesaplama bütçesi, optimizasyon prosedürü veya bilgisinden bağımsız. Ampirik savunmalarla karşılaştır; orada "PGD altında dayanıklı doğruluk" daha güçlü bir gelecek saldırı tarafından (sıkça olduğu gibi) abartılabilen bir alt sınırdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Deterministik vs. stokastik</div><div class="card-body">IBP / CROWN deterministik sertifikalar verir ("topta TÜM δ için"). Rastgele yumuşatma yüksek-olasılıklı sertifikalar verir ("topta δ için, ≥ 1 - α olasılıkla").</div></div>
<div class="calc-card"><div class="card-title">ℓ_p normları</div><div class="card-body">Yumuşatma → ℓ_2 (Gauss gürültüsü). IBP → ℓ_∞ (aralık aritmetiği). Diğer p daha çok iş gerektirir ve daha zayıf sonuçlar verir.</div></div>
<div class="calc-card"><div class="card-title">Sıkı vs. gevşek</div><div class="card-body">Kesin bir doğrulayıcı kanıtlanabilir en büyük R'yi döner. IBP gevşektir — R'si gerçek dayanıklı yarıçaptan çok daha küçüktür. Değiş-tokuş: hız vs. sıkılık.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Yumuşatma: sertifikalı girdi başına ~10K ileri geçiş. IBP: normal ileri geçişin ~2×'i. CROWN: ~10×. alpha-beta-CROWN: girdi başına saniye-dakika.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Lipschitz-Kısıtlı Ağlar</h2>
<p class="l-text">Bir ağ f, K-Lipschitz ise (yani ‖f(x) - f(y)‖ ≤ K · ‖x - y‖), küçük girdi değişimleri sınırlı çıktı değişimleri üretir. Sınırlı çıktı değişimlerinden dayanıklı yarıçap türetirsin. Mümkün olan en kolay sertifika.</p>

<div class="katex-block">$$R(\\mathbf{x}) = \\frac{f_{c^*}(\\mathbf{x}) - \\max_{c \\ne c^*} f_c(\\mathbf{x})}{\\sqrt{2} \\cdot K}$$</div>

<p class="l-text">burada c* tahmin edilen sınıftır ve paydaki fark tahmin marjıdır. Küçük K elde etmek zor olan kısımdır. Yaklaşımlar:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Spektral normalleştirme</div><div class="card-body">Her ağırlık matrisinin spektral normunu ≤ 1 ile sınırla (Miyato 2018). Toplam Lipschitz sabiti = katman normlarının çarpımı. Lineer katmanlar için sıkı, ReLU ağları için gevşek.</div></div>
<div class="calc-card"><div class="card-title">Ortogonal katmanlar (Trockman 2021)</div><div class="card-body">Her ağırlık matrisi tam olarak ortogonal — Lipschitz sabitini 1'de korur. Cayley ağları, GroupSort'ta kullanılır.</div></div>
<div class="calc-card"><div class="card-title">GroupSort aktivasyonu</div><div class="card-body">ReLU'yu K nöron grupları içindeki bir sıralama ile değiştir — gradyan-norm-koruyan ve 1-Lipschitz. Sıkı Lipschitz ağları verir (Anil 2019).</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">CIFAR-10'da kısıtsız ResNet'e göre ~%5-15 doğruluk düşüşü. Sertifikalı ℓ_2 yarıçapları ~36-72/255 — küçük ama anlamlı.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Rastgele Yumuşatma — Cohen 2019</h2>
<p class="l-text">En etkili sertifikalı savunma. Yumuşatılmış sınıflandırıcı g'yi Gauss gürültüsü üzerinde f'in çoğunluk oyu olarak tanımla:</p>

<div class="katex-block">$$g(\\mathbf{x}) = \\arg\\max_c \\; \\mathbb{P}_{\\boldsymbol\\eta \\sim \\mathcal{N}(0, \\sigma^2 I)}\\bigl[ f(\\mathbf{x} + \\boldsymbol\\eta) = c \\bigr]$$</div>

<p class="l-text">Cohen'in teoremi: gürültü altında en olası sınıfın olasılığı p_A ve ikincinin p_B ise, g şu kadarına kadar herhangi pertürbasyona dayanıklıdır:</p>

<div class="katex-block">$$\\| \\boldsymbol\\delta \\|_2 \\le R = \\frac{\\sigma}{2}\\bigl( \\Phi^{-1}(p_A) - \\Phi^{-1}(p_B) \\bigr)$$</div>

<p class="l-text">burada Φ standart normal CDF'dir. Yarıçap σ ile (daha çok gürültü = daha büyük yarıçap ama daha düşük temiz doğruluk) ve top-1 ile top-2 olasılıkları arasındaki farkla (model güveni) ölçeklenir.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Bir LogReg eğit, Gauss gürültüsü ile yumuşat (σ=0.5, K=2000 örnek), her test noktası için Cohen yarıçapı hesapla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> scipy.stats <span class="kw">import</span> norm

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="cm"># σ=0.5 gürültüyle başa çıkmayı öğrenmesi için taban modeli gürültülü veride eğit</span>
sigma = <span class="num">0.5</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
Xtr_aug = np.<span class="fn">vstack</span>([Xtr + rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma, Xtr.shape) <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(<span class="num">3</span>)])
ytr_aug = np.<span class="fn">tile</span>(ytr, <span class="num">3</span>)
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(Xtr_aug, ytr_aug)

<span class="kw">def</span> <span class="fn">smooth_predict</span>(x, K=<span class="num">2000</span>):
    noise = rng.<span class="fn">normal</span>(<span class="num">0</span>, sigma, (K, <span class="fn">len</span>(x)))
    preds = clf.<span class="fn">predict</span>(x + noise)
    pA = (preds == <span class="num">1</span>).<span class="fn">mean</span>()
    pB = <span class="num">1</span> - pA
    <span class="kw">cls</span> = <span class="num">1</span> <span class="kw">if</span> pA &gt; pB <span class="kw">else</span> <span class="num">0</span>
    p_top = <span class="fn">max</span>(pA, pB)
    p_run = <span class="num">1</span> - p_top
    <span class="kw">if</span> p_top &lt;= <span class="num">0.5</span>:
        <span class="kw">return</span> <span class="kw">cls</span>, <span class="num">0.0</span>
    R = (sigma / <span class="num">2</span>) * (norm.<span class="fn">ppf</span>(p_top) - norm.<span class="fn">ppf</span>(p_run))
    <span class="kw">return</span> <span class="kw">cls</span>, R

<span class="fn">print</span>(<span class="str">"Cohen 2019 certified radii on first 8 test points:"</span>)
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">8</span>):
    <span class="kw">cls</span>, R = <span class="fn">smooth_predict</span>(Xte[i])
    correct = (<span class="kw">cls</span> == yte[i])
    <span class="fn">print</span>(f<span class="str">"  pred={cls} (true={yte[i]}, {'OK' if correct else 'WRONG'})  certified R={R:.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Gauss-gürültüsüyle artırılmış churn veri seti üzerinde temel <code>LogisticRegression</code> eğitilir (her satır 3 kez <code>N(0, σ²)</code> eklenerek tekrarlanır); böylece taban sınıflandırıcısı zaten <code>σ = 0.5</code> pertürbasyonlarını kaldırabilir hale gelir — Cohen 2019 reçetesi. 2) <code>smooth_predict(x, K)</code> <code>K = 2000</code> gürültü örneği çeker, taban modeli <code>x + noise</code> üzerinde koşturur ve ampirik sınıf-1 sıklığı <code>pA</code> ile yakın takipçi <code>pB = 1 - pA</code>'yı Cohen'in yumuşatılmış-sınıflandırıcı olasılıkları olarak kullanır. 3) <code>p_top &gt; 0.5</code> ise <code>scipy.stats.norm.ppf</code> ile sertifikalı ℓ_2 yarıçapı <code>R = (σ/2)(Φ⁻¹(p_top) − Φ⁻¹(p_run))</code> hesaplanır — doğrudan Cohen teoremi. 4) ilk 8 test noktası için tahmin ve sertifikalı yarıçap yazdırılır; böylece güvenin (<code>p_top</code> ile <code>p_run</code> arasındaki farkın) dayanıklı yarıçapa nasıl dönüştüğünü görebilirsin.</p>
</div>

<p class="l-text">Çoğu nokta standartlaştırılmış-özellik uzayında 0.1 ile 1.0 arasında R alır. Daha yüksek σ (1.0 dene) temiz doğruluk pahasına daha büyük yarıçaplar verir.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Clopper-Pearson ile Monte Carlo Sertifikalandırma</h2>
<p class="l-text">Pratikte p_A'yı tam hesaplayamazsın — K örnekle Monte-Carlo edersin. Cohen 2019, p_A için yüksek-olasılıklı alt sınır almak için Clopper-Pearson güven sınırı kullanır:</p>

<div class="katex-block">$$\\underline{p_A} = \\text{Beta}^{-1}\\bigl(\\alpha;\\, n_A,\\, K - n_A + 1\\bigr)$$</div>

<p class="l-text">burada n_A K örnekten en üst sınıfın kaç kez tahmin edildiğidir ve α istenen güven düzeyidir (tipik olarak α = 0.001). Alt sınırı yarıçap formülüne yerleştir. Sertifika şimdi "≥ 1 - α olasılıkla (gürültü örnekleri üzerinde), R geçerli sertifikalı yarıçaptır" der.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">K = 100 vs. K = 100000</div><div class="card-body">Daha çok örnek → daha sıkı Clopper-Pearson sınırı → daha büyük sertifikalı R. Cohen ImageNet'te yüksek-çözünürlüklü sertifikalar için K=100K kullandı.</div></div>
<div class="calc-card"><div class="card-title">Çekimser kalma</div><div class="card-body">p_A üzerindeki alt sınır ≤ 0.5 ise, yumuşatılmış sınıflandırıcı çekimser kalır (sertifika yok). Gerçek dağıtımlar bir çekimser-oran bütçesine ihtiyaç duyar.</div></div>
<div class="calc-card"><div class="card-title">Daha yüksek σ</div><div class="card-body">Daha büyük gürültü → daha büyük R ama daha düşük taban-model doğruluğu. Temiz-doğruluk / sertifikalı-yarıçap değiş-tokuş eğrisi merkezi tasarım düğmesidir.</div></div>
<div class="calc-card"><div class="card-title">Salman 2019</div><div class="card-body">Rastgele yumuşatmayı taban modelinin düşmanca eğitimiyle birleştirir — ImageNet'te en iyi sertifikalı yarıçaplar, piksel uzayında R = 0.5'te ~%70 top-1.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Interval Bound Propagation (IBP)</h2>
<p class="l-text">Gowal vd. (2018, "On the Effectiveness of Interval Bound Propagation for Training Verifiably Robust Models") klasik hızlı eğitilebilir doğrulayıcıyı verdi. Fikir: ℓ_∞ aralıklarını katman katman yay. ‖δ‖_∞ ≤ ε olan x girdisi için, her nöronun aktivasyonunun alt ve üst sınırlarını (l, u) hesapla. Çıktı katmanında gerçek sınıfın alt sınırı diğer her sınıfın üst sınırını aşıyorsa, tahmin doğrulanmış olur.</p>

<div class="katex-block">$$\\mathbf{l}^{(k+1)} = W^{(k)}_+ \\mathbf{l}^{(k)} + W^{(k)}_- \\mathbf{u}^{(k)} + \\mathbf{b}^{(k)}, \\quad \\mathbf{u}^{(k+1)} = W^{(k)}_+ \\mathbf{u}^{(k)} + W^{(k)}_- \\mathbf{l}^{(k)} + \\mathbf{b}^{(k)}$$</div>

<p class="l-text">burada W_+ ve W_- ağırlık matrisinin pozitif ve negatif kısımlarıdır. ReLU: l → max(l, 0), u → max(u, 0). Eğitilebilir: gerçek sınıfın alt sınırını diğerlerinin üst sınırlarının üstüne iten bir IBP kaybı tanımla; türevle; SGD ile eğit.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Hız</div><div class="card-body">Düzenli ileri geçişin ~2×'i. Normal eğitim döngülerinde kullanılacak kadar hızlı eğitir (Gowal CIFAR-10 ResNet'i %50+ doğrulanmış doğruluğa eğitir).</div></div>
<div class="calc-card"><div class="card-title">Gevşeklik</div><div class="card-body">Aralık sınırları derin ağlar boyunca hızla gevşer (her katman gevşemeyi birikir). Doğrulanmış doğruluk gerçek dayanıklı doğruluğun önemli ölçüde altındadır.</div></div>
<div class="calc-card"><div class="card-title">CROWN-IBP (Zhang 2020)</div><div class="card-body">Hibrit: erken katmanlar için IBP, geç katmanlar için CROWN lineer sınırlar. Orta maliyetle daha sıkı. Standart taban.</div></div>
<div class="calc-card"><div class="card-title">Kayıp manzarası</div><div class="card-body">IBP-eğitilmiş ağlar normal ağlardan çok farklı görünür — daha lineer, daha budama-dostu. Bu doğrulama için bir özelliktir, bug değil.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. CROWN — Daha Sıkı Lineer Sınırlar</h2>
<p class="l-text">Zhang vd. (2018, "Efficient Neural Network Robustness Certification with General Activation Functions") CROWN'u tanıttı: aralıklar yerine, her aktivasyonda <em>lineer</em> üst ve alt sınırları yay. Girdi aralığı [l, u] olan ReLU(x) için:</p>

<div class="katex-block">$$\\text{lower bound: } \\alpha x \\quad \\text{upper bound: } \\frac{u}{u - l}(x - l)$$</div>

<p class="l-text">burada α ∈ [0, 1] ayarlanabilir bir eğimdir. CROWN bu lineer sınırları geriye yayar (backprop tarzı) ve çıktıyı girdinin lineer bir fonksiyonu olarak ifade eder — daha çok hesaplama maliyetiyle IBP'den çok daha sıkı.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">CROWN vs. IBP</div><div class="card-body">CROWN ~3-10× daha sıkı (herhangi verilen ε'da daha büyük girdi kesirini doğrular). Maliyet: ileri geçişin ~10×'i.</div></div>
<div class="calc-card"><div class="card-title">α-CROWN</div><div class="card-body">Doğrulanmış sınırı maksimize etmek için α'yı gradyan inişiyle optimize et. Sabit-α'dan orantılı ekstra maliyetle daha sıkı.</div></div>
<div class="calc-card"><div class="card-title">Beta-CROWN (Wang 2021)</div><div class="card-body">Dal-ve-sınır ekler: girdi aralığını böl, özyinele. CROWN sınırı ile kesin doğrulama arasındaki farkı kapatır.</div></div>
<div class="calc-card"><div class="card-title">alpha-beta-CROWN</div><div class="card-body">Birleşik doğrulayıcı — VNN-COMP 2021, 2022, 2023, 2024'ü kazandı. ℓ_∞ doğrulama için 2026 son teknoloji durumu.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. alpha-beta-CROWN ve VNN Yarışması</h2>
<p class="l-text">VNN-COMP (Verification of Neural Networks Competition) doğrulayıcılar için yıllık benchmark'tır. alpha-beta-CROWN derin-ağ kategorilerinde baskındır. Hat:</p>

<ol style="line-height:1.7;padding-left:1.3rem">
<li>İlk sınırı almak için CROWN çalıştır — hızlı.</li>
<li>Sınır sertifikalandırmazsa (veya çürütmezse), en belirsiz ReLU'da dallan (aktif ve aktif olmayan taraflarına böl).</li>
<li>Her alt problemi α-CROWN ile özyinelemeli olarak doğrula.</li>
<li>Sınırın kendisi üzerinde SGD ile gevşeme parametreleri α ve β'yı optimize et.</li>
</ol>

<p class="l-text">Sonuç: ~10M parametreye kadar ağlarda kesin doğrulama, ε = 8/255, girdi başına saniyeler-dakikalarda. Açık kaynak: <code>github.com/Verified-Intelligence/alpha-beta-CROWN</code>.</p>

<div class="calc-highlight"><strong>2026 için sonuç:</strong> orta-boy CNN'lere kadar ağlarda deterministik ℓ_∞ doğrulama için, alpha-beta-CROWN kullan. ImageNet-ölçek modellerde ℓ_2 rastgele yumuşatma için, Salman 2019 kullan. Eğitilebilir sertifikalı-dayanıklı modeller için, CROWN-IBP kullan. Lipschitz ağlar için, GroupSort + ortogonal katmanlar.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sırada Ne Var</h2>

<div class="calc-highlight"><strong>Kilit çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Sertifikalı dayanıklılık matematiksel garanti verir — Athalye-tarzı uyarlamalı saldırılardan yapısal olarak sağ çıkar.</li>
<li>Lipschitz ağlar: en küçük yarıçaplar, en ucuz sertifika (bir ileri geçiş + bir sabit).</li>
<li>Rastgele yumuşatma (Cohen 2019): Gauss gürültüsü yoluyla ℓ_2 sertifikaları. ImageNet'e ölçeklenir. Stokastik garanti.</li>
<li>IBP (Gowal 2018): eğitilebilir aralık doğrulayıcı. Hızlı ama gevşek. Sertifikalı eğitim için standart.</li>
<li>CROWN (Zhang 2018): daha sıkı lineer sınırlar. α-, β- ve alpha-beta-CROWN uzantıları ℓ_∞ doğrulama için 2026 son teknoloji durumudur.</li>
<li>VNN-COMP şampiyonu: alpha-beta-CROWN. Açık kaynak, orta CNN'lerde kesin doğrulama.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L9</strong> LLM'e özgü konulara kaydırır: prompt enjeksiyonu (Greshake 2023), GCG ve PAIR jailbreak'leri (Zou 2023, Chao 2023), eğitim verisi çıkarımı (Carlini 2021). <strong>mlsec-L10</strong> OWASP LLM Top 10, Garak, PyRIT ve sorumlu açıklama metodolojisini kapsayan AI kırmızı takım capstone'udur.</p>
</div>`
};
