window.MLSEC_L3 = {
en: `<p class="l-text"><strong>Most adversarial defenses don't work.</strong> Athalye, Carlini and Wagner's 2018 ICML paper "Obfuscated Gradients Give a False Sense of Security" broke seven of the eight defenses published at ICLR 2018, demonstrating they all fell to the same problem: gradient masking. The defenses made gradients hard to compute, but the underlying model was just as vulnerable — once you got the gradient (via numerical estimation, BPDA, or backward differentiable approximation) the attack succeeded. The paper is a permanent landmark: any new defense that does not explicitly survive Athalye-style adaptive attacks is presumed broken until proven otherwise.</p>

<p class="l-text">Two things actually work. <strong>Adversarial training</strong> (Madry 2017) — train on adversarial examples generated on-the-fly with PGD — empirically holds up at scale, at the cost of clean accuracy and ~7× compute. <strong>TRADES</strong> (Zhang 2019) — a regularizer that decouples natural and adversarial loss — improves the trade-off curve. And for provable robustness, <strong>randomized smoothing</strong> (Cohen 2019) gives certified ℓ_2 radii: the only practical defense with a mathematical guarantee. This lesson covers all three, plus the Athalye checklist that distinguishes a real defense from gradient masking in disguise.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement Madry's adversarial training as min-max optimization with PGD inner loop</li>
<li>Understand TRADES's KL-divergence regularizer and its trade-off curve</li>
<li>Compute certified radii via randomized smoothing (Cohen 2019)</li>
<li>Spot the Athalye 2018 patterns of obfuscated gradients (vanishing gradients, shattered gradients, stochastic gradients)</li>
<li>Read robust-accuracy claims with the right level of skepticism</li>
<li>Quantify the robustness-accuracy trade-off in concrete numbers</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Adversarial Training as Min-Max Optimization</h2>
<p class="l-text">Madry et al. (2017, "Towards Deep Learning Models Resistant to Adversarial Attacks") wrote the canonical formulation. Standard training minimizes expected loss; adversarial training minimizes expected <em>worst-case</em> loss inside an ε-ball:</p>

<div class="katex-block">$$\\min_{\\boldsymbol\\theta} \\; \\mathbb{E}_{(\\mathbf{x},y)\\sim\\mathcal{D}} \\Bigl[ \\max_{\\boldsymbol\\delta \\in B_\\varepsilon} L\\bigl(f_{\\boldsymbol\\theta}(\\mathbf{x}+\\boldsymbol\\delta), y\\bigr) \\Bigr]$$</div>

<p class="l-text">The inner max is the adversary; Madry's choice was PGD. The outer min is gradient descent on θ. The training loop becomes: for each batch, run K-step PGD to find x_adv, then take a gradient step on L(f(x_adv), y).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why PGD and not FGSM</div><div class="card-body">Earlier work (Goodfellow 2014) used FGSM-trained models — those broke under PGD. Madry's argument: train on the strongest first-order attack (PGD), and you should be robust against all first-order attacks. Empirically holds.</div></div>
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Each training step is K+1 forward/backward passes (K for the inner PGD, 1 for the outer gradient). K=7-10 is standard. Training is ~7-10× more expensive than clean.</div></div>
<div class="calc-card"><div class="card-title">Clean accuracy drop</div><div class="card-body">CIFAR-10 ResNet: clean acc drops from 95% to 87% on adversarially-trained models. ImageNet: ~76% → ~62% on Salman 2020. Robustness costs accuracy.</div></div>
<div class="calc-card"><div class="card-title">Robust acc as of 2026</div><div class="card-body">CIFAR-10 ε=8/255 ℓ_∞: 71.07% (Wang et al., 2023, diffusion-augmented). Bottom of the 2017 leaderboard was 47%. Steady ~1pt/year improvement.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Adversarial training on sklearn LogReg via SGD: at each batch, generate PGD adversaries, retrain on the union (clean ∪ adv).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> SGDClassifier
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">pgd_logreg</span>(coef, intercept, X, y, eps, K=<span class="num">10</span>):
    Xa = X + np.random.<span class="fn">uniform</span>(-eps, eps, X.shape)
    alpha = eps/<span class="num">4</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K):
        z = Xa @ coef + intercept
        p = <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-z))
        grad = (p - y)[:, <span class="kw">None</span>] * coef[<span class="kw">None</span>, :]
        Xa = Xa + alpha * np.<span class="fn">sign</span>(grad)
        Xa = np.<span class="fn">clip</span>(Xa, X-eps, X+eps)
    <span class="kw">return</span> Xa

<span class="cm"># Round 1: clean model</span>
clf = <span class="fn">SGDClassifier</span>(loss=<span class="str">"log_loss"</span>, max_iter=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(f<span class="str">"Round 0 clean acc: {clf.score(Xte, yte):.3f}"</span>)

<span class="cm"># Adversarial training: 5 epochs, mix clean + PGD adversaries</span>
eps = <span class="num">0.3</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    Xadv = <span class="fn">pgd_logreg</span>(clf.coef_[<span class="num">0</span>], clf.intercept_[<span class="num">0</span>], Xtr, ytr, eps=eps, K=<span class="num">7</span>)
    X_combined = np.<span class="fn">vstack</span>([Xtr, Xadv])
    y_combined = np.<span class="fn">concatenate</span>([ytr, ytr])
    clf.<span class="fn">partial_fit</span>(X_combined, y_combined, classes=[<span class="num">0</span>,<span class="num">1</span>])
    Xa_te = <span class="fn">pgd_logreg</span>(clf.coef_[<span class="num">0</span>], clf.intercept_[<span class="num">0</span>], Xte, yte, eps=eps, K=<span class="num">10</span>)
    <span class="fn">print</span>(f<span class="str">"Epoch {epoch+1}: clean acc={clf.score(Xte, yte):.3f}, adv acc={clf.score(Xa_te, yte):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads a real CSV from /data/ and selects feature columns into a DataFrame. 2) calls into scikit-learn for the modelling step. 3) performs adversarial training (Madry minmax) — the canonical empirical defense; pairs cleanly with TRADES and certified randomized smoothing (Cohen 2019). 4) prints the headline metric so you can compare clean vs. attacked / private vs. public side by side.</p>
</div>

<p class="l-text">You should see adversarial accuracy rise across epochs (often from near-zero to 0.5-0.7) while clean accuracy drops a few points. That trade-off is fundamental — provable in the linear case (Tsipras 2019, "Robustness May Be At Odds with Accuracy").</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. TRADES — Decoupling Natural and Robust Loss</h2>
<p class="l-text">Zhang et al. (2019, "Theoretically Principled Trade-off between Robustness and Accuracy") proposed a different objective. Instead of training on adversarial examples directly, train on clean examples and add a regularizer penalizing the KL-divergence between the predictions on x and x_adv:</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{TRADES}} = L\\bigl(f(\\mathbf{x}), y\\bigr) + \\beta \\cdot \\max_{\\boldsymbol\\delta \\in B_\\varepsilon} \\text{KL}\\bigl(f(\\mathbf{x}) \\,\\|\\, f(\\mathbf{x}+\\boldsymbol\\delta)\\bigr)$$</div>

<p class="l-text">First term: standard cross-entropy on clean inputs. Second term: penalize divergence under adversarial perturbation. The hyperparameter β trades off — small β gives high clean accuracy and low robustness; large β gives the opposite. TRADES won the 2018 NeurIPS adversarial competition and remains a strong baseline.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">vs. Madry AT</div><div class="card-body">TRADES often gets ~1-3pt higher clean accuracy at the same robust accuracy on CIFAR-10. The trade-off curve sits above Madry's, especially in the high-clean-acc regime.</div></div>
<div class="calc-card"><div class="card-title">Why KL helps</div><div class="card-body">KL on softmax outputs is a smoother regularizer than cross-entropy on hard labels — lets the model preserve clean confidence while flattening locally around each input.</div></div>
<div class="calc-card"><div class="card-title">β = 6 default</div><div class="card-body">Original paper used β=1 to β=10. β=6 became a community default for CIFAR-10 ResNet-18 — replicable across labs.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Randomized Smoothing — Certified ℓ_2 Robustness</h2>
<p class="l-text">Empirical defenses tell you "I tested 10K attacks and 71% failed". A <em>certified</em> defense gives a mathematical guarantee: "for any perturbation with ‖δ‖_2 ≤ R, the model's prediction does not change". Cohen, Rosenfeld and Kolter (2019, "Certified Adversarial Robustness via Randomized Smoothing") gave the strongest practical certificate.</p>

<p class="l-text">The smoothed classifier is built by averaging the base classifier f over Gaussian noise:</p>

<div class="katex-block">$$g(\\mathbf{x}) = \\arg\\max_c \\; \\mathbb{P}_{\\boldsymbol\\eta \\sim \\mathcal{N}(0, \\sigma^2 I)}\\bigl[f(\\mathbf{x} + \\boldsymbol\\eta) = c\\bigr]$$</div>

<p class="l-text">Cohen's theorem: if the most likely class under noise has probability p_A and the next class has p_B, then g is provably robust against any ℓ_2 perturbation up to:</p>

<div class="katex-block">$$R = \\frac{\\sigma}{2}\\bigl(\\Phi^{-1}(\\underline{p_A}) - \\Phi^{-1}(\\overline{p_B})\\bigr)$$</div>

<p class="l-text">Where Φ⁻¹ is the inverse standard normal CDF. The bounds p_A and p_B are estimated by Monte Carlo with n samples and Clopper-Pearson confidence intervals. On ImageNet, σ=0.5 gives a certified ℓ_2 radius of ~0.5 at ~49% accuracy — meaning 49% of images are guaranteed-correct under any ℓ_2 perturbation of size 0.5.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pros</div><div class="card-body">Provable. Works on arbitrary architectures (just wrap the prediction). No special training required (though training f with the same noise σ helps a lot — Salman 2019).</div></div>
<div class="calc-card"><div class="card-title">Cons</div><div class="card-body">Inference is K× slower (K~10⁴ samples per prediction). ℓ_2 only — does not certify ℓ_∞ directly. Certified radii saturate at modest values (R~0.5–1.0 on ImageNet).</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Randomized smoothing on a sklearn LogReg: predict the mode of f(x + N(0, σ²I)) over k samples and report the certified radius using Cohen's bound.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.stats <span class="kw">import</span> norm, beta
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)

<span class="kw">def</span> <span class="fn">smooth_predict_certify</span>(clf, x, sigma=<span class="num">0.5</span>, n=<span class="num">2000</span>, alpha=<span class="num">0.001</span>):
    noise = np.random.<span class="fn">randn</span>(n, <span class="fn">len</span>(x)) * sigma
    preds = clf.<span class="fn">predict</span>(x[<span class="kw">None</span>, :] + noise)
    counts = np.<span class="fn">bincount</span>(preds, minlength=<span class="num">2</span>)
    cA = counts.<span class="fn">argmax</span>(); nA = counts[cA]
    <span class="cm"># Clopper-Pearson lower bound on p_A at confidence 1-alpha</span>
    pA_lower = beta.<span class="fn">ppf</span>(alpha, nA, n - nA + <span class="num">1</span>) <span class="kw">if</span> nA < n <span class="kw">else</span> <span class="num">1.0</span>
    <span class="kw">if</span> pA_lower <= <span class="num">0.5</span>:
        <span class="kw">return</span> -<span class="num">1</span>, <span class="num">0.0</span>  <span class="cm"># ABSTAIN</span>
    R = sigma * norm.<span class="fn">ppf</span>(pA_lower)
    <span class="kw">return</span> cA, R

<span class="cm"># Certify the first 20 test points</span>
correct = <span class="num">0</span>; mean_R = <span class="num">0</span>; abstain = <span class="num">0</span>
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    pred, R = <span class="fn">smooth_predict_certify</span>(clf, Xte[i], sigma=<span class="num">0.5</span>, n=<span class="num">2000</span>)
    <span class="kw">if</span> pred == -<span class="num">1</span>:
        abstain += <span class="num">1</span>; <span class="kw">continue</span>
    <span class="kw">if</span> pred == yte[i]: correct += <span class="num">1</span>
    mean_R += R
<span class="fn">print</span>(f<span class="str">"Certified correct: {correct}/20, mean radius: {mean_R/max(1,20-abstain):.3f}, abstain: {abstain}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) loads a real CSV from /data/ and selects feature columns into a DataFrame. 2) fits a sklearn LogisticRegression — a linear baseline whose gradient w.r.t. inputs is exactly the weight vector. 3) performs adversarial training (Madry minmax) — the canonical empirical defense; pairs cleanly with TRADES and certified randomized smoothing (Cohen 2019).</p>
</div>

<p class="l-text">The radius R you see is a <em>guarantee</em>: the model's prediction is provably stable under any ℓ_2 perturbation smaller than R. No empirical attack can violate it. That is what "certified" buys you over "robust accuracy under PGD".</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Athalye 2018 — Why Most Defenses Fail</h2>
<p class="l-text">Athalye, Carlini and Wagner (ICML 2018, "Obfuscated Gradients Give a False Sense of Security: Circumventing Defenses to Adversarial Examples") evaluated nine defenses from ICLR 2018 and broke eight of them. The lone survivor was Madry adversarial training. The paper identifies three patterns of <em>obfuscated gradients</em> — defenses that look robust because attacks fail, but the underlying model is just as vulnerable.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shattered gradients</div><div class="card-body">Non-differentiable component (e.g. quantization, JPEG compression, image preprocessing) makes ∇L incorrect or zero. Bypass: BPDA (Backward Pass Differentiable Approximation) — replace the non-differentiable layer with a smooth identity in the backward pass.</div></div>
<div class="calc-card"><div class="card-title">Stochastic gradients</div><div class="card-body">Random transformations at inference (random dropout, random noise, random crops) make a single gradient step a noisy estimate. Bypass: EOT — average gradients over k samples of the randomness.</div></div>
<div class="calc-card"><div class="card-title">Vanishing/exploding gradients</div><div class="card-body">Very deep purification networks or long unrolls produce gradients that vanish or explode. Bypass: attack a shorter network, then transfer; or restart from many points.</div></div>
</div>

<div class="calc-highlight"><strong>The Athalye checklist for evaluating any new defense:</strong> (1) does PGD with random restarts beat it? (2) does BPDA/EOT beat it? (3) does it improve under stronger attacks (a sign of obfuscation, since the defense should be robust to all attacks)? (4) does black-box transfer attack succeed? (5) does an unbounded attack still find adversaries? If any answer is yes, the defense is broken.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Other Approaches — and Why They Mostly Don't Work</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Defensive distillation (Papernot 2016)</div><div class="card-body">Train a model, distill to a "smoothed" student. Broken by Carlini-Wagner 2016 in months. The smoothness was gradient masking.</div></div>
<div class="calc-card"><div class="card-title">Input preprocessing (JPEG, total variation, feature squeezing)</div><div class="card-body">Apply a non-differentiable transform before the model. Broken by BPDA (Athalye 2018). Useful only as a soft baseline.</div></div>
<div class="calc-card"><div class="card-title">Detection methods</div><div class="card-body">Train a binary classifier to detect adversarial inputs. Carlini and Wagner 2017 ("Adversarial Examples Are Not Easily Detected") showed that detectors themselves are attackable — adaptive attacks that fool both classifier and detector exist.</div></div>
<div class="calc-card"><div class="card-title">GAN-based purification (Defense-GAN, Samangouei 2018)</div><div class="card-body">Project inputs onto the GAN manifold before classification. Broken by attacks targeting the GAN inversion process.</div></div>
<div class="calc-card"><div class="card-title">Diffusion-based purification (Nie 2022, DiffPure)</div><div class="card-body">Add noise to the input, run a few steps of a diffusion model in reverse. Mixed evidence — better than older purifiers but still loses to strong adaptive attacks.</div></div>
</div>

<p class="l-text">The pattern: anything that does not directly minimize the worst-case loss (Madry-style) or provide a mathematical certificate (Cohen-style) is suspect.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Robustness-Accuracy Trade-off</h2>
<p class="l-text">Tsipras et al. (2019, "Robustness May Be At Odds with Accuracy") proved a clean theorem: in some settings, the most accurate classifier <em>cannot</em> be robust. Intuition: features that are highly predictive on natural data may not be robust (a single pixel can carry strong signal that is easy to perturb), while robust features (large coherent shapes) carry less per-bit information.</p>

<p class="l-text">Empirical CIFAR-10 numbers as a reference (2026):</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Standard ResNet-18</div><div class="card-body">Clean acc 94%, ε=8/255 PGD acc &lt;5%.</div></div>
<div class="calc-card"><div class="card-title">Madry-trained ResNet-18</div><div class="card-body">Clean acc 87%, robust acc 47%.</div></div>
<div class="calc-card"><div class="card-title">TRADES ResNet-18</div><div class="card-body">Clean acc 88%, robust acc 53%.</div></div>
<div class="calc-card"><div class="card-title">Wang 2023 (diffusion-augmented)</div><div class="card-body">Clean acc 93%, robust acc 71%. Current SOTA.</div></div>
<div class="calc-card"><div class="card-title">Randomized smoothing (σ=0.25, ℓ_2)</div><div class="card-body">Clean acc 70%, certified radius ~0.4 at the typical confidence level. Different metric (ℓ_2, certified) — not directly comparable.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Practical Defense Recipe (2026)</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">If you need robustness</div><div class="card-body">Madry adversarial training with PGD-10, ε at deployment level. Use the latest tricks: AWP (Wu 2020), additional unlabeled data (Carmon 2019), diffusion-augmented (Wang 2023). Start from a strong pretrained checkpoint.</div></div>
<div class="calc-card"><div class="card-title">If you need a guarantee</div><div class="card-body">Randomized smoothing with σ matched to your threat. Train the base model on noisy data (Salman 2019). Accept the inference cost.</div></div>
<div class="calc-card"><div class="card-title">If you only need detection</div><div class="card-body">Watch for distribution shift on inputs. Adversarial examples often have unusual statistics (noise patterns, pixel histograms). Use as a soft signal, never as a hard barrier.</div></div>
<div class="calc-card"><div class="card-title">Always</div><div class="card-body">Evaluate with AutoAttack. Cite RobustBench. Publish robust accuracy under the standard ε. Don't claim robustness without an adaptive attack.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Adversarial training (Madry 2017) is min-max optimization with PGD as the inner attack. The only empirical defense that scales.</li>
<li>TRADES (Zhang 2019) decouples natural and robust loss with a KL regularizer. Slightly better trade-off than Madry.</li>
<li>Randomized smoothing (Cohen 2019) gives certified ℓ_2 radii via Gaussian-noise averaging. The only practical provable defense.</li>
<li>Athalye 2018 broke 8 of 9 ICLR 2018 defenses. Most "new defenses" are obfuscated gradients in disguise.</li>
<li>Robustness-accuracy trade-off is real (Tsipras 2019) — robust models lose 5-15 clean accuracy points.</li>
<li>The Athalye checklist is the gold standard for evaluating any new defense claim.</li>
</ul>
</div>

<p class="l-text">In <strong>mlsec-L4</strong> we move from inference-time to training-time attacks: data poisoning, backdoors, BadNets. We will plant a real backdoor in a real model and watch it activate on the trigger. <strong>mlsec-L7</strong> covers backdoor detection (Neural Cleanse, STRIP, ABS) including Hubinger 2024's frightening result that standard safety training does not remove sleeper agents.</p>
</div>`,
tr: `<p class="l-text"><strong>Çoğu düşmanca savunma çalışmaz.</strong> Athalye, Carlini ve Wagner'in 2018 ICML makalesi "Obfuscated Gradients Give a False Sense of Security", ICLR 2018'de yayımlanan sekiz savunmadan yedisini kırdı ve hepsinin aynı soruna düştüğünü gösterdi: gradyan maskeleme. Savunmalar gradyanları hesaplamayı zorlaştırdı ama altta yatan model aynı derecede kırılgandı — gradyanı bir kez aldığında (sayısal tahmin, BPDA veya backward differentiable approximation yoluyla) saldırı başarılı oldu. Makale kalıcı bir dönüm noktasıdır: Athalye-tarzı uyarlamalı saldırılardan açıkça sağ çıkmayan herhangi bir yeni savunma, aksi kanıtlanana kadar bozuk varsayılır.</p>

<p class="l-text">İki şey gerçekten çalışıyor. <strong>Düşmanca eğitim</strong> (Madry 2017) — anlık olarak PGD ile üretilen düşmanca örnekler üzerinde eğit — temiz doğruluk ve ~7× hesaplama maliyetiyle ölçekte ampirik olarak ayakta kalır. <strong>TRADES</strong> (Zhang 2019) — doğal ve düşmanca kayıbı ayrıştıran bir regularizatör — değiş-tokuş eğrisini iyileştirir. Ve kanıtlanabilir dayanıklılık için, <strong>rastgele yumuşatma</strong> (Cohen 2019) sertifikalı ℓ_2 yarıçapları verir: matematiksel garantili tek pratik savunma. Bu ders üçünü de kapsar, artı gerçek bir savunmayı kılık değiştirmiş gradyan maskelemeden ayıran Athalye kontrol listesini.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Madry'nin düşmanca eğitimini PGD iç döngüsüyle min-max optimizasyon olarak uygulamak</li>
<li>TRADES'in KL-ıraksaklığı regularizatörünü ve değiş-tokuş eğrisini anlamak</li>
<li>Rastgele yumuşatma (Cohen 2019) yoluyla sertifikalı yarıçapları hesaplamak</li>
<li>Athalye 2018'in obfuscated gradient kalıplarını fark etmek (kaybolan gradyanlar, parçalanmış gradyanlar, stokastik gradyanlar)</li>
<li>Dayanıklı doğruluk iddialarını doğru şüphecilik düzeyiyle okumak</li>
<li>Dayanıklılık-doğruluk değiş-tokuşunu somut sayılarla sayısallaştırmak</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Min-Max Optimizasyon Olarak Düşmanca Eğitim</h2>
<p class="l-text">Madry vd. (2017, "Towards Deep Learning Models Resistant to Adversarial Attacks") klasik formülasyonu yazdı. Standart eğitim beklenen kayıbı minimize eder; düşmanca eğitim ε-topu içindeki beklenen <em>en kötü durum</em> kayıbını minimize eder:</p>

<div class="katex-block">$$\\min_{\\boldsymbol\\theta} \\; \\mathbb{E}_{(\\mathbf{x},y)\\sim\\mathcal{D}} \\Bigl[ \\max_{\\boldsymbol\\delta \\in B_\\varepsilon} L\\bigl(f_{\\boldsymbol\\theta}(\\mathbf{x}+\\boldsymbol\\delta), y\\bigr) \\Bigr]$$</div>

<p class="l-text">İç max saldırgandır; Madry'nin tercihi PGD'dir. Dış min, θ üzerinde gradyan inişidir. Eğitim döngüsü şuna dönüşür: her batch için, x_adv'yi bulmak için K-adımlık PGD çalıştır, sonra L(f(x_adv), y) üzerinde bir gradyan adımı at.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden FGSM değil PGD</div><div class="card-body">Daha önceki çalışmalar (Goodfellow 2014) FGSM-eğitimli modeller kullandı — bunlar PGD altında bozuldu. Madry'nin argümanı: en güçlü birinci-derece saldırıda (PGD) eğit, tüm birinci-derece saldırılara karşı dayanıklı olmalısın. Ampirik olarak doğru.</div></div>
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Her eğitim adımı K+1 ileri/geri geçiştir (iç PGD için K, dış gradyan için 1). K=7-10 standarttır. Eğitim temizden ~7-10× daha pahalıdır.</div></div>
<div class="calc-card"><div class="card-title">Temiz doğruluk düşüşü</div><div class="card-body">CIFAR-10 ResNet: temiz doğruluk düşmanca-eğitilmiş modellerde %95'ten %87'ye düşer. ImageNet: Salman 2020'de ~%76 → ~%62. Dayanıklılık doğruluğa mal olur.</div></div>
<div class="calc-card"><div class="card-title">2026 itibarıyla dayanıklı doğruluk</div><div class="card-body">CIFAR-10 ε=8/255 ℓ_∞: %71.07 (Wang vd., 2023, difüzyon-artırılmış). 2017 lider tablosunun dibi %47'ydi. İstikrarlı ~1pt/yıl iyileşme.</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">SGD yoluyla sklearn LogReg üzerinde düşmanca eğitim: her batch'te PGD saldırıları üret, birleşim üzerinde yeniden eğit (temiz ∪ adv).</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> SGDClassifier
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">pgd_logreg</span>(coef, intercept, X, y, eps, K=<span class="num">10</span>):
    Xa = X + np.random.<span class="fn">uniform</span>(-eps, eps, X.shape)
    alpha = eps/<span class="num">4</span>
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(K):
        z = Xa @ coef + intercept
        p = <span class="num">1</span>/(<span class="num">1</span>+np.<span class="fn">exp</span>(-z))
        grad = (p - y)[:, <span class="kw">None</span>] * coef[<span class="kw">None</span>, :]
        Xa = Xa + alpha * np.<span class="fn">sign</span>(grad)
        Xa = np.<span class="fn">clip</span>(Xa, X-eps, X+eps)
    <span class="kw">return</span> Xa

<span class="cm"># Tur 1: temiz model</span>
clf = <span class="fn">SGDClassifier</span>(loss=<span class="str">"log_loss"</span>, max_iter=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xtr, ytr)
<span class="fn">print</span>(f<span class="str">"Round 0 clean acc: {clf.score(Xte, yte):.3f}"</span>)

<span class="cm"># Düşmanca eğitim: 5 epoch, temiz + PGD saldırıları karıştır</span>
eps = <span class="num">0.3</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    Xadv = <span class="fn">pgd_logreg</span>(clf.coef_[<span class="num">0</span>], clf.intercept_[<span class="num">0</span>], Xtr, ytr, eps=eps, K=<span class="num">7</span>)
    X_combined = np.<span class="fn">vstack</span>([Xtr, Xadv])
    y_combined = np.<span class="fn">concatenate</span>([ytr, ytr])
    clf.<span class="fn">partial_fit</span>(X_combined, y_combined, classes=[<span class="num">0</span>,<span class="num">1</span>])
    Xa_te = <span class="fn">pgd_logreg</span>(clf.coef_[<span class="num">0</span>], clf.intercept_[<span class="num">0</span>], Xte, yte, eps=eps, K=<span class="num">10</span>)
    <span class="fn">print</span>(f<span class="str">"Epoch {epoch+1}: clean acc={clf.score(Xte, yte):.3f}, adv acc={clf.score(Xa_te, yte):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) /data/ altındaki gerçek bir CSV'yi okur ve özellik kolonlarını bir DataFrame'e seçer. 2) modelleme adımı için scikit-learn'e başvurur. 3) düşmanca eğitim (Madry minmax) uygular — kanonik ampirik savunma; TRADES ve sertifikalı rastgele yumuşatma (Cohen 2019) ile temiz şekilde birleşir. 4) temiz ve saldırılı / özel ve halka açık karşılaştırmasını yan yana okuyabilesin diye başlık metriğini yazdırır.</p>
</div>

<p class="l-text">Düşmanca doğruluğun epoch'lar boyunca yükseldiğini görmelisin (genellikle sıfıra yakından 0.5-0.7'ye) ve temiz doğruluk birkaç puan düşer. Bu değiş-tokuş temeldir — lineer durumda kanıtlanabilir (Tsipras 2019, "Robustness May Be At Odds with Accuracy").</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. TRADES — Doğal ve Dayanıklı Kayıbı Ayrıştırma</h2>
<p class="l-text">Zhang vd. (2019, "Theoretically Principled Trade-off between Robustness and Accuracy") farklı bir amaç önerdi. Doğrudan düşmanca örnekler üzerinde eğitmek yerine, temiz örnekler üzerinde eğit ve x ile x_adv üzerindeki tahminler arasındaki KL-ıraksaklığını cezalandıran bir regularizatör ekle:</p>

<div class="katex-block">$$\\mathcal{L}_{\\text{TRADES}} = L\\bigl(f(\\mathbf{x}), y\\bigr) + \\beta \\cdot \\max_{\\boldsymbol\\delta \\in B_\\varepsilon} \\text{KL}\\bigl(f(\\mathbf{x}) \\,\\|\\, f(\\mathbf{x}+\\boldsymbol\\delta)\\bigr)$$</div>

<p class="l-text">İlk terim: temiz girdilerde standart cross-entropy. İkinci terim: düşmanca pertürbasyon altında ıraksaklığı cezalandır. β hiperparametresi değiş-tokuş eder — küçük β yüksek temiz doğruluk ve düşük dayanıklılık verir; büyük β tam tersini verir. TRADES 2018 NeurIPS düşmanca yarışmasını kazandı ve güçlü bir temel olarak kalmaya devam ediyor.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">vs. Madry AT</div><div class="card-body">TRADES sıkça CIFAR-10'da aynı dayanıklı doğrulukta ~1-3pt daha yüksek temiz doğruluk alır. Değiş-tokuş eğrisi Madry'ninkinden daha üstte oturur, özellikle yüksek-temiz-doğruluk rejiminde.</div></div>
<div class="calc-card"><div class="card-title">KL neden yardım eder</div><div class="card-body">Softmax çıktıları üzerindeki KL, sert etiketler üzerindeki cross-entropy'den daha pürüzsüz bir regularizatördür — modelin temiz güveni korumasına ve her girdi etrafında yerel olarak düzleşmesine izin verir.</div></div>
<div class="calc-card"><div class="card-title">β = 6 varsayılan</div><div class="card-body">Orijinal makale β=1'den β=10'a kullandı. β=6 CIFAR-10 ResNet-18 için topluluk varsayılanı oldu — laboratuvarlar arası tekrarlanabilir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Rastgele Yumuşatma — Sertifikalı ℓ_2 Dayanıklılığı</h2>
<p class="l-text">Ampirik savunmalar sana "10K saldırı denedim ve %71'i başarısız oldu" der. <em>Sertifikalı</em> bir savunma matematiksel garanti verir: "‖δ‖_2 ≤ R olan herhangi bir pertürbasyon için modelin tahmini değişmez". Cohen, Rosenfeld ve Kolter (2019, "Certified Adversarial Robustness via Randomized Smoothing") en güçlü pratik sertifikayı verdi.</p>

<p class="l-text">Yumuşatılmış sınıflandırıcı, taban sınıflandırıcı f'i Gauss gürültüsü üzerinde ortalayarak inşa edilir:</p>

<div class="katex-block">$$g(\\mathbf{x}) = \\arg\\max_c \\; \\mathbb{P}_{\\boldsymbol\\eta \\sim \\mathcal{N}(0, \\sigma^2 I)}\\bigl[f(\\mathbf{x} + \\boldsymbol\\eta) = c\\bigr]$$</div>

<p class="l-text">Cohen'in teoremi: gürültü altında en olası sınıfın olasılığı p_A ve sonraki sınıfınki p_B ise, g şu kadarına kadar herhangi ℓ_2 pertürbasyona karşı kanıtlanabilir biçimde dayanıklıdır:</p>

<div class="katex-block">$$R = \\frac{\\sigma}{2}\\bigl(\\Phi^{-1}(\\underline{p_A}) - \\Phi^{-1}(\\overline{p_B})\\bigr)$$</div>

<p class="l-text">Burada Φ⁻¹ ters standart normal CDF'dir. p_A ve p_B sınırları n örnekle Monte Carlo ve Clopper-Pearson güven aralıklarıyla tahmin edilir. ImageNet'te σ=0.5, ~%49 doğrulukta sertifikalı ℓ_2 yarıçapı ~0.5 verir — yani görüntülerin %49'u 0.5 büyüklüğündeki herhangi bir ℓ_2 pertürbasyonu altında garanti-doğrudur.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Artılar</div><div class="card-body">Kanıtlanabilir. Keyfi mimarilerde çalışır (sadece tahmini sar). Özel eğitim gerekmez (gerçi f'i aynı σ gürültüsüyle eğitmek çok yardım eder — Salman 2019).</div></div>
<div class="calc-card"><div class="card-title">Eksiler</div><div class="card-body">Çıkarım K× daha yavaştır (tahmin başına K~10⁴ örnek). Yalnızca ℓ_2 — ℓ_∞'u doğrudan sertifikalandırmaz. Sertifikalı yarıçaplar mütevazı değerlerde doyar (ImageNet'te R~0.5–1.0).</div></div>
</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">sklearn LogReg üzerinde rastgele yumuşatma: k örnek üzerinde f(x + N(0, σ²I))'in modunu tahmin et ve Cohen'in sınırını kullanarak sertifikalı yarıçapı raporla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> scipy.stats <span class="kw">import</span> norm, beta
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>)
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)
clf = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(Xtr, ytr)

<span class="kw">def</span> <span class="fn">smooth_predict_certify</span>(clf, x, sigma=<span class="num">0.5</span>, n=<span class="num">2000</span>, alpha=<span class="num">0.001</span>):
    noise = np.random.<span class="fn">randn</span>(n, <span class="fn">len</span>(x)) * sigma
    preds = clf.<span class="fn">predict</span>(x[<span class="kw">None</span>, :] + noise)
    counts = np.<span class="fn">bincount</span>(preds, minlength=<span class="num">2</span>)
    cA = counts.<span class="fn">argmax</span>(); nA = counts[cA]
    <span class="cm"># 1-alpha güveninde p_A için Clopper-Pearson alt sınırı</span>
    pA_lower = beta.<span class="fn">ppf</span>(alpha, nA, n - nA + <span class="num">1</span>) <span class="kw">if</span> nA < n <span class="kw">else</span> <span class="num">1.0</span>
    <span class="kw">if</span> pA_lower <= <span class="num">0.5</span>:
        <span class="kw">return</span> -<span class="num">1</span>, <span class="num">0.0</span>  <span class="cm"># ÇEKİMSER</span>
    R = sigma * norm.<span class="fn">ppf</span>(pA_lower)
    <span class="kw">return</span> cA, R

<span class="cm"># İlk 20 test noktasını sertifikalandır</span>
correct = <span class="num">0</span>; mean_R = <span class="num">0</span>; abstain = <span class="num">0</span>
<span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">20</span>):
    pred, R = <span class="fn">smooth_predict_certify</span>(clf, Xte[i], sigma=<span class="num">0.5</span>, n=<span class="num">2000</span>)
    <span class="kw">if</span> pred == -<span class="num">1</span>:
        abstain += <span class="num">1</span>; <span class="kw">continue</span>
    <span class="kw">if</span> pred == yte[i]: correct += <span class="num">1</span>
    mean_R += R
<span class="fn">print</span>(f<span class="str">"Certified correct: {correct}/20, mean radius: {mean_R/max(1,20-abstain):.3f}, abstain: {abstain}"</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) /data/ altındaki gerçek bir CSV'yi okur ve özellik kolonlarını bir DataFrame'e seçer. 2) bir sklearn LogisticRegression eğitir — girdilere göre gradyanı tam olarak ağırlık vektörü olan lineer bir taban modeli. 3) düşmanca eğitim (Madry minmax) uygular — kanonik ampirik savunma; TRADES ve sertifikalı rastgele yumuşatma (Cohen 2019) ile temiz şekilde birleşir.</p>
</div>

<p class="l-text">Gördüğün R yarıçapı bir <em>garantidir</em>: modelin tahmini, R'den küçük herhangi ℓ_2 pertürbasyonu altında kanıtlanabilir biçimde sabittir. Hiçbir ampirik saldırı bunu ihlal edemez. "PGD altında dayanıklı doğruluk" yerine "sertifikalı"nın sana satın aldığı şey budur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Athalye 2018 — Çoğu Savunma Neden Başarısız</h2>
<p class="l-text">Athalye, Carlini ve Wagner (ICML 2018, "Obfuscated Gradients Give a False Sense of Security: Circumventing Defenses to Adversarial Examples") ICLR 2018'den dokuz savunmayı değerlendirdi ve sekizini kırdı. Tek hayatta kalan Madry düşmanca eğitimiydi. Makale üç <em>obfuscated gradient</em> kalıbı tanımlar — saldırılar başarısız olduğu için dayanıklı görünen ama altta yatan modelin aynı derecede kırılgan olduğu savunmalar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Parçalanmış gradyanlar</div><div class="card-body">Türevlenemeyen bileşen (örn. nicemleme, JPEG sıkıştırma, görüntü ön işleme) ∇L'i yanlış veya sıfır yapar. Atlatma: BPDA (Backward Pass Differentiable Approximation) — geriye geçişte türevlenemeyen katmanı pürüzsüz bir özdeşle değiştir.</div></div>
<div class="calc-card"><div class="card-title">Stokastik gradyanlar</div><div class="card-body">Çıkarımda rastgele dönüşümler (rastgele dropout, rastgele gürültü, rastgele kırpma) tek bir gradyan adımını gürültülü tahmin yapar. Atlatma: EOT — k rastgele örnek üzerinde gradyanları ortala.</div></div>
<div class="calc-card"><div class="card-title">Kaybolan/patlayan gradyanlar</div><div class="card-body">Çok derin saflaştırma ağları veya uzun açılımlar kaybolan veya patlayan gradyanlar üretir. Atlatma: daha kısa bir ağa saldır, sonra transfer et; veya birçok noktadan yeniden başla.</div></div>
</div>

<div class="calc-highlight"><strong>Herhangi yeni savunmayı değerlendirmek için Athalye kontrol listesi:</strong> (1) Rastgele yeniden başlatmalı PGD onu yener mi? (2) BPDA/EOT onu yener mi? (3) Daha güçlü saldırılar altında iyileşir mi (savunma tüm saldırılara dayanıklı olmalı, bu obfuscation işaretidir)? (4) Kara kutu transfer saldırısı başarılı olur mu? (5) Sınırsız bir saldırı hâlâ saldırı bulur mu? Herhangi cevap evetse savunma bozuktur.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Diğer Yaklaşımlar — ve Çoğunluğu Neden Çalışmaz</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Defensive distillation (Papernot 2016)</div><div class="card-body">Bir model eğit, "yumuşatılmış" bir öğrenciye damıt. Carlini-Wagner 2016 tarafından aylar içinde kırıldı. Yumuşaklık gradyan maskelemeydi.</div></div>
<div class="calc-card"><div class="card-title">Girdi ön işleme (JPEG, total variation, feature squeezing)</div><div class="card-body">Modelden önce türevlenemeyen bir dönüşüm uygula. BPDA (Athalye 2018) tarafından kırıldı. Yalnızca yumuşak bir temel olarak yararlı.</div></div>
<div class="calc-card"><div class="card-title">Tespit yöntemleri</div><div class="card-body">Düşmanca girdileri tespit etmek için ikili sınıflandırıcı eğit. Carlini ve Wagner 2017 ("Adversarial Examples Are Not Easily Detected") dedektörlerin kendilerinin saldırılabilir olduğunu gösterdi — hem sınıflandırıcıyı hem dedektörü kandıran uyarlamalı saldırılar mevcut.</div></div>
<div class="calc-card"><div class="card-title">GAN-tabanlı saflaştırma (Defense-GAN, Samangouei 2018)</div><div class="card-body">Sınıflandırma öncesi girdileri GAN manifolduna yansıt. GAN ters çevirme sürecini hedefleyen saldırılarla kırıldı.</div></div>
<div class="calc-card"><div class="card-title">Difüzyon-tabanlı saflaştırma (Nie 2022, DiffPure)</div><div class="card-body">Girdiye gürültü ekle, bir difüzyon modelinin birkaç adımını ters çalıştır. Karışık kanıt — eski saflaştırıcılardan daha iyi ama hâlâ güçlü uyarlamalı saldırılara kaybediyor.</div></div>
</div>

<p class="l-text">Kalıp: en kötü durum kayıbını doğrudan minimize etmeyen (Madry-tarzı) veya matematiksel sertifika sağlamayan (Cohen-tarzı) her şey şüphelidir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Dayanıklılık-Doğruluk Değiş-Tokuşu</h2>
<p class="l-text">Tsipras vd. (2019, "Robustness May Be At Odds with Accuracy") temiz bir teorem kanıtladı: bazı durumlarda en doğru sınıflandırıcı dayanıklı <em>olamaz</em>. Sezgi: doğal veride yüksek tahmin gücü olan özellikler dayanıklı olmayabilir (tek bir piksel pertürbe edilmesi kolay güçlü sinyal taşıyabilir), oysa dayanıklı özellikler (büyük tutarlı şekiller) bit başına daha az bilgi taşır.</p>

<p class="l-text">Referans olarak ampirik CIFAR-10 sayıları (2026):</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Standart ResNet-18</div><div class="card-body">Temiz doğruluk %94, ε=8/255 PGD doğruluk &lt;%5.</div></div>
<div class="calc-card"><div class="card-title">Madry-eğitimli ResNet-18</div><div class="card-body">Temiz doğruluk %87, dayanıklı doğruluk %47.</div></div>
<div class="calc-card"><div class="card-title">TRADES ResNet-18</div><div class="card-body">Temiz doğruluk %88, dayanıklı doğruluk %53.</div></div>
<div class="calc-card"><div class="card-title">Wang 2023 (difüzyon-artırılmış)</div><div class="card-body">Temiz doğruluk %93, dayanıklı doğruluk %71. Mevcut SOTA.</div></div>
<div class="calc-card"><div class="card-title">Rastgele yumuşatma (σ=0.25, ℓ_2)</div><div class="card-body">Temiz doğruluk %70, tipik güven düzeyinde sertifikalı yarıçap ~0.4. Farklı metrik (ℓ_2, sertifikalı) — doğrudan karşılaştırılabilir değil.</div></div>
</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pratik Savunma Tarifi (2026)</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dayanıklılığa ihtiyacın varsa</div><div class="card-body">Madry düşmanca eğitim PGD-10 ile, dağıtım düzeyinde ε. Son numaraları kullan: AWP (Wu 2020), ek etiketsiz veri (Carmon 2019), difüzyon-artırılmış (Wang 2023). Güçlü bir ön-eğitilmiş checkpoint'ten başla.</div></div>
<div class="calc-card"><div class="card-title">Garantiye ihtiyacın varsa</div><div class="card-body">Tehdidine uyan σ ile rastgele yumuşatma. Taban modeli gürültülü veride eğit (Salman 2019). Çıkarım maliyetini kabul et.</div></div>
<div class="calc-card"><div class="card-title">Yalnızca tespit gerekiyorsa</div><div class="card-body">Girdilerde dağılım kayması izle. Düşmanca örneklerin sıkça olağandışı istatistikleri vardır (gürültü kalıpları, piksel histogramları). Yumuşak sinyal olarak kullan, asla sert engel olarak değil.</div></div>
<div class="calc-card"><div class="card-title">Her zaman</div><div class="card-body">AutoAttack ile değerlendir. RobustBench'i kaynak göster. Dayanıklı doğruluğu standart ε altında yayımla. Uyarlamalı saldırı olmadan dayanıklılık iddia etme.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sırada Ne Var</h2>

<div class="calc-highlight"><strong>Kilit çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Düşmanca eğitim (Madry 2017) PGD'yi iç saldırı olarak kullanan min-max optimizasyondur. Ölçeklenen tek ampirik savunma.</li>
<li>TRADES (Zhang 2019) doğal ve dayanıklı kayıbı KL regularizatörle ayrıştırır. Madry'den biraz daha iyi değiş-tokuş.</li>
<li>Rastgele yumuşatma (Cohen 2019) Gauss-gürültü ortalamasıyla sertifikalı ℓ_2 yarıçapları verir. Tek pratik kanıtlanabilir savunma.</li>
<li>Athalye 2018, ICLR 2018'in 9 savunmasından 8'ini kırdı. Çoğu "yeni savunma" kılık değiştirmiş obfuscated gradient'tir.</li>
<li>Dayanıklılık-doğruluk değiş-tokuşu gerçektir (Tsipras 2019) — dayanıklı modeller 5-15 temiz doğruluk puanı kaybeder.</li>
<li>Athalye kontrol listesi yeni bir savunma iddiasını değerlendirmek için altın standarttır.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L4</strong>'te çıkarım zamanından eğitim zamanı saldırılarına geçiyoruz: veri zehirleme, arka kapılar, BadNets. Gerçek bir modele gerçek bir arka kapı yerleştireceğiz ve tetikleyiciye aktive olduğunu izleyeceğiz. <strong>mlsec-L7</strong> arka kapı tespitini (Neural Cleanse, STRIP, ABS) kapsar, Hubinger 2024'ün standart güvenlik eğitiminin uyuyan ajanları kaldırmadığı korkutucu sonucu dahil.</p>
</div>`
};
