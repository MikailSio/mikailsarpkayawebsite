window.MLSEC_L6 = {
en: `<p class="l-text"><strong>Was your record in the training set?</strong> Membership inference (MI) is the privacy-attack analogue of Tramèr's stealing — instead of recovering the model, the attacker recovers <em>data</em>. Shokri, Stronati, Song and Shmatikov (2017, "Membership Inference Attacks Against Machine Learning Models") showed the canonical setup: train K "shadow models" on data drawn from the same distribution, observe their behavior on member vs. non-member inputs, train an attack classifier that takes (model output, target label) → "member?". Against an overfit medical-records classifier, MI accuracy hit 80%+ — every patient queryable for "did this hospital train on you?" with high confidence.</p>

<p class="l-text">The 2022 turning point: Carlini, Chien, Nasr, Song, Terzis and Tramèr's <strong>LiRA</strong> ("Membership Inference Attacks From First Principles", S&P 2022). Earlier MI attacks reported "average" accuracy that hid a brutal long tail — a few outlier records were near-100% identifiable, hundreds more at 90%+. LiRA explicitly targets per-example confidence by computing a likelihood ratio test against shadow-model logit distributions. Result: even at low average MI accuracy, ~1% of training points are catastrophically leaked. This is why differential privacy is the only credible defense — it provably bounds <em>per-example</em> influence, not average. This lesson covers Shokri's threshold attacks, LiRA, the role of overfitting and DP-SGD as the defense.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement Shokri's shadow-model attack from scratch (sklearn LogReg)</li>
<li>Build a confidence-threshold attack and analyze the train-test confidence gap</li>
<li>Understand why average MI accuracy is misleading (LiRA Carlini 2022)</li>
<li>Compute the likelihood ratio test for per-example calibrated MI</li>
<li>Reason about overfitting as the root cause and DP-SGD as the principled defense</li>
<li>Map MI attacks to the (ε, δ) differential-privacy guarantee</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Membership Inference Setup</h2>
<p class="l-text">Define the game: the world picks a record z and a coin flip b ∈ {0, 1}. If b=0, z is added to training; if b=1, z is held out. The attacker is given (z, target_model) and must guess b. MI accuracy &gt; 0.5 means the attack works — the attacker has extracted information about training-set membership.</p>

<div class="katex-block">$$P(b=0 \\mid \\text{conf}) = \\frac{P(\\text{conf} \\mid b=0) P(b=0)}{P(\\text{conf})}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Why it matters</div><div class="card-body">Medical, financial, biometric data — knowing someone is in a training set is itself a privacy violation. GDPR Article 4 considers MI a personal-data leak.</div></div>
<div class="calc-card"><div class="card-title">Root cause</div><div class="card-body">Models memorize. Training-set inputs get higher confidence than equivalent held-out inputs — that gap is the MI signal.</div></div>
<div class="calc-card"><div class="card-title">When it works</div><div class="card-body">Overfit models leak heavily (large train-test gap). Well-regularized models leak less but still leak per-example. Foundation models with vast training sets leak the rare/unique records.</div></div>
<div class="calc-card"><div class="card-title">Black-box vs. white-box</div><div class="card-body">Black-box: attacker only queries. White-box: attacker has model weights. White-box wins by ~2× MI accuracy (Nasr 2019, gradient-based attack).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Confidence-Threshold Attack (Yeom 2018)</h2>
<p class="l-text">The simplest MI attack: train sets get higher loss than test sets. Set a threshold τ; predict "member" if loss(z) &lt; τ. Yeom et al. (2018) showed this single-number attack gives near-Shokri results without any shadow models.</p>

<div class="katex-block">$$\\text{Member}(z) = \\mathbb{1}\\bigl[\\, L\\bigl(f(\\mathbf{x}), y\\bigr) &lt; \\tau \\,\\bigr]$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Train an overfit LogReg, plot loss histogram for members vs. non-members, compute MI AUC.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.5</span>, random_state=<span class="num">0</span>)

<span class="cm"># Overfit-prone model: very low regularization</span>
clf = <span class="fn">LogisticRegression</span>(C=<span class="num">1e6</span>, max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)

<span class="kw">def</span> <span class="fn">loss_per_sample</span>(model, X, y):
    p = model.<span class="fn">predict_proba</span>(X)
    <span class="kw">return</span> -np.<span class="fn">log</span>(p[np.<span class="fn">arange</span>(<span class="fn">len</span>(y)), y] + <span class="num">1e-12</span>)

L_member = <span class="fn">loss_per_sample</span>(clf, Xtr, ytr)      <span class="cm"># in training</span>
L_nonmem = <span class="fn">loss_per_sample</span>(clf, Xte, yte)      <span class="cm"># held out</span>

<span class="fn">print</span>(f<span class="str">"Mean loss (member):     {L_member.mean():.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean loss (non-member): {L_nonmem.mean():.4f}"</span>)

<span class="cm"># MI as binary classifier: smaller loss → predict member</span>
losses = np.<span class="fn">concatenate</span>([L_member, L_nonmem])
labels = np.<span class="fn">concatenate</span>([np.<span class="fn">ones_like</span>(L_member), np.<span class="fn">zeros_like</span>(L_nonmem)])
auc = <span class="fn">roc_auc_score</span>(labels, -losses)  <span class="cm"># negate: smaller loss = higher member score</span>
<span class="fn">print</span>(f<span class="str">"MI AUC: {auc:.3f}  (0.5 = random; &gt;0.5 means leak)"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) deliberately trains an overfit model with <code>LogisticRegression(C=1e6)</code> on a 50/50 train/test split — high <code>C</code> = near-zero regularisation, the regime where MI signal is strongest. 2) <code>loss_per_sample</code> returns the per-row cross-entropy <code>-log p[y]</code> so we can compare loss distributions for members (<code>Xtr</code>) vs. non-members (<code>Xte</code>) — the Yeom 2018 threshold attack signal. 3) treats MI as a binary classifier: smaller loss ⇒ "predict member"; passes <code>-losses</code> as the score to <code>roc_auc_score</code> so larger member-likelihood corresponds to larger AUC. 4) prints mean loss for each group and the MI AUC — anything above 0.5 means the model leaks membership.</p>
</div>

<p class="l-text">Expect ~0.55-0.65 AUC on this small dataset. Not catastrophic in average, but the tail — the single examples where members get loss=0 and non-members get loss=2 — is where the real privacy breach lives.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Shokri 2017 — Shadow Models and the Attack Classifier</h2>
<p class="l-text">Shokri's contribution: don't train one threshold — train an entire attack classifier. Steps:</p>

<ol style="line-height:1.7;padding-left:1.3rem">
<li>Sample K shadow training sets D_1, ..., D_K from the same data distribution as the victim.</li>
<li>For each, train shadow model M_k. Record predictions on members (D_k) labeled "in" and on a held-out shadow test set labeled "out".</li>
<li>Pool all (prediction vector, in/out) pairs across K shadow models — that's the attack training set.</li>
<li>Train the attack model A: prediction-vector → P(member). Logistic regression or small MLP works fine.</li>
<li>To attack a victim point z: query victim model f, get prediction f(z), feed to A, output "member?" probability.</li>
</ol>

<p class="l-text">Why shadow models work: by construction, the attack classifier learns the model family's confidence-distribution gap between train and test. As long as the victim's architecture and training distribution are roughly similar, the attack transfers.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (runs in the browser)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Build 10 shadow models on disjoint slices of churn data, train an attack LogReg on (probability, true-label) → "member?", evaluate on a held-out victim model.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

K = <span class="num">10</span>
attack_X, attack_y = [], []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K):
    idx = rng.<span class="fn">permutation</span>(<span class="fn">len</span>(X))
    in_idx, out_idx = idx[:<span class="num">200</span>], idx[<span class="num">200</span>:<span class="num">300</span>]
    M_k = <span class="fn">LogisticRegression</span>(C=<span class="num">1e4</span>, max_iter=<span class="num">1000</span>).<span class="fn">fit</span>(X[in_idx], y[in_idx])
    p_in  = M_k.<span class="fn">predict_proba</span>(X[in_idx])[np.<span class="fn">arange</span>(<span class="fn">len</span>(in_idx)),  y[in_idx]]
    p_out = M_k.<span class="fn">predict_proba</span>(X[out_idx])[np.<span class="fn">arange</span>(<span class="fn">len</span>(out_idx)), y[out_idx]]
    attack_X.<span class="fn">extend</span>(p_in.<span class="fn">tolist</span>());  attack_y.<span class="fn">extend</span>([<span class="num">1</span>]*<span class="fn">len</span>(in_idx))
    attack_X.<span class="fn">extend</span>(p_out.<span class="fn">tolist</span>()); attack_y.<span class="fn">extend</span>([<span class="num">0</span>]*<span class="fn">len</span>(out_idx))

A = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(np.<span class="fn">array</span>(attack_X).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>), attack_y)

<span class="cm"># Now attack a fresh "victim" model</span>
idx = rng.<span class="fn">permutation</span>(<span class="fn">len</span>(X))
v_in, v_out = idx[:<span class="num">200</span>], idx[<span class="num">200</span>:<span class="num">300</span>]
victim = <span class="fn">LogisticRegression</span>(C=<span class="num">1e4</span>, max_iter=<span class="num">1000</span>).<span class="fn">fit</span>(X[v_in], y[v_in])
p_v_in  = victim.<span class="fn">predict_proba</span>(X[v_in])[np.<span class="fn">arange</span>(<span class="fn">len</span>(v_in)),  y[v_in]]
p_v_out = victim.<span class="fn">predict_proba</span>(X[v_out])[np.<span class="fn">arange</span>(<span class="fn">len</span>(v_out)), y[v_out]]
all_p = np.<span class="fn">concatenate</span>([p_v_in, p_v_out]).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>)
all_l = np.<span class="fn">concatenate</span>([np.<span class="fn">ones</span>(<span class="fn">len</span>(v_in)), np.<span class="fn">zeros</span>(<span class="fn">len</span>(v_out))])
preds = A.<span class="fn">predict_proba</span>(all_p)[:,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Shadow-model attack AUC on victim: {roc_auc_score(all_l, preds):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains <code>K = 10</code> shadow <code>LogisticRegression</code> models on disjoint random slices of the churn data — for each shadow, <code>in_idx</code> is the training half and <code>out_idx</code> is held out, mirroring Shokri 2017's shadow-model construction. 2) for every shadow model, records the predicted probability of the true class on <code>in_idx</code> (labelled "1 = member") and on <code>out_idx</code> (labelled "0 = non-member") and stacks all of them into <code>attack_X</code>, <code>attack_y</code>. 3) trains the attack classifier <code>A = LogisticRegression()</code> on those (probability, member?) pairs — A learns the train-vs-test confidence gap of the model family, not any single model. 4) attacks a fresh victim model and reports <code>roc_auc_score</code> on its true labels — that is the membership-inference AUC.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LiRA — Likelihood Ratio Attack (Carlini 2022)</h2>
<p class="l-text">Carlini et al. argued the prior literature reported the wrong metric. Average MI accuracy can be 0.55 (looks small) while the worst 1% of training points have ASR &gt; 0.99 (looks huge). The fix: report MI true-positive rate at low false-positive rate (e.g. TPR @ FPR=0.001). And design an attack calibrated to that regime.</p>

<p class="l-text">LiRA's setup: for each target z, train N_in shadow models that contain z, and N_out shadow models that don't. For each shadow model, record the model's logit on z (more precisely: log p / (1-p) for the true class). Fit Gaussians to the in-distribution and out-distribution logits. Then the LiRA attack score for a victim model M is:</p>

<div class="katex-block">$$\\Lambda(z) = \\log \\frac{\\mathcal{N}\\bigl(\\phi_M(z); \\,\\mu_{\\text{in}}, \\sigma_{\\text{in}}^2\\bigr)}{\\mathcal{N}\\bigl(\\phi_M(z); \\,\\mu_{\\text{out}}, \\sigma_{\\text{out}}^2\\bigr)}$$</div>

<p class="l-text">Compare to a threshold; predict member if Λ &gt; τ. The likelihood ratio is the optimal test by Neyman-Pearson — best possible TPR at any FPR.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Cost</div><div class="card-body">Need ~64-256 shadow models per target. Expensive but feasible — Carlini ran this against CIFAR-100 ResNet, ImageNet, GPT-2 fine-tunes.</div></div>
<div class="calc-card"><div class="card-title">Result</div><div class="card-body">On CIFAR-10 ResNet-18, LiRA gets TPR=0.10 at FPR=0.001 — a 100× improvement over Shokri's average attack. Per-example leak is real and huge for outliers.</div></div>
<div class="calc-card"><div class="card-title">Outliers leak</div><div class="card-body">Rare or unusual training records leak the most. The "average" record is safe; the "weird" record is exposed. Worst-case privacy is what matters legally.</div></div>
<div class="calc-card"><div class="card-title">Online vs. offline</div><div class="card-body">Online LiRA (per-target shadow training) is strongest. Offline variant (one shadow set, generic distributions) is cheaper but ~5× weaker.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Why DP-SGD Helps</h2>
<p class="l-text">Differential privacy (Dwork 2006) gives a mathematical guarantee: for neighboring datasets D and D' (differing in one record), the model's output distribution is nearly identical. Specifically (ε, δ)-DP means:</p>

<div class="katex-block">$$P\\bigl[M(D) \\in S\\bigr] \\le e^\\varepsilon \\cdot P\\bigl[M(D') \\in S\\bigr] + \\delta$$</div>

<p class="l-text">DP-SGD (Abadi 2016) achieves this for neural-net training: clip per-sample gradients to a fixed norm, add Gaussian noise, accumulate. The privacy budget ε bounds the maximum advantage any MI attack can have:</p>

<div class="katex-block">$$\\text{TPR} \\le e^\\varepsilon \\cdot \\text{FPR} + \\delta \\quad\\Rightarrow\\quad \\text{MI advantage capped by }\\varepsilon$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ε ≤ 1: tight</div><div class="card-body">Strong privacy. MI attacks essentially fail. Heavy utility cost — accuracy may drop 10-30% relative to non-private.</div></div>
<div class="calc-card"><div class="card-title">ε ≈ 8: moderate</div><div class="card-body">Practical compromise. Apple, Google, Census Bureau target ε ∈ [3, 10] for production. Moderate utility loss, decent MI defense.</div></div>
<div class="calc-card"><div class="card-title">ε ≥ 100: marketing</div><div class="card-body">"Mathematical DP guarantee" but with ε so large the bound is meaningless. Advertised as DP, no real privacy.</div></div>
<div class="calc-card"><div class="card-title">DP vs. LiRA</div><div class="card-body">Carlini 2022: DP-SGD trained CIFAR-10 (ε=8) drops LiRA TPR@0.001 from 0.10 to 0.005. Real and measurable defense.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Calibrated Membership Inference</h2>
<p class="l-text">Beyond LiRA, recent work (Long 2018, Watson 2022) introduces <strong>difficulty calibration</strong>. Some inputs are intrinsically hard — even non-members get high loss. Naive threshold attacks confuse "intrinsically hard" with "non-member". Calibration: divide each loss by the average loss across reference models on the same input. Hard inputs get normalized down; the residual signal is real membership.</p>

<div class="calc-highlight"><strong>Watson 2022 ("On the Importance of Difficulty Calibration") shows that calibrated MI gives ~30% higher TPR@FPR=0.01 than uncalibrated.</strong> If you are doing MI as a measurement (auditor checking a model for leakage), use calibration.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Practical Implications</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Audit before deploy</div><div class="card-body">Run LiRA-lite on validation: train 16 shadow models, check TPR@FPR=0.01. If &gt; 5% you have a privacy problem.</div></div>
<div class="calc-card"><div class="card-title">Regularize aggressively</div><div class="card-body">Weight decay, dropout, early stopping, label smoothing — all reduce MI. Not a guarantee but cheap.</div></div>
<div class="calc-card"><div class="card-title">Use DP-SGD when stakes are real</div><div class="card-body">Healthcare, finance, biometrics. Pay the utility cost (5-15%); cap ε at 8 or lower.</div></div>
<div class="calc-card"><div class="card-title">Watch the tail</div><div class="card-body">Average accuracy hides the worst case. Outliers (rare records) leak the most. Audit per-example, not in aggregate.</div></div>
<div class="calc-card"><div class="card-title">LLMs are worse</div><div class="card-body">Training-data extraction (Carlini 2021, "Extracting Training Data from Large Language Models") shows LLMs verbatim-memorize rare strings — covered in mlsec-L9.</div></div>
<div class="calc-card"><div class="card-title">Federated MI</div><div class="card-body">Nasr 2019 shows that participating clients in federated learning can do MI on each other from gradients alone. Federation is not privacy.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Recap and What's Next</h2>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Membership inference asks "was this record in the training set?" — a privacy violation by itself.</li>
<li>Yeom 2018: a single loss-threshold gives near-Shokri performance.</li>
<li>Shokri 2017: shadow models + attack classifier — the canonical setup.</li>
<li>LiRA (Carlini 2022): per-target likelihood ratio, optimal at low-FPR regimes. Outlier records leak catastrophically even when average is OK.</li>
<li>DP-SGD (Abadi 2016) is the only principled defense — bounds MI advantage by ε.</li>
<li>Calibration (Watson 2022) cleans up hard-vs-leaked confusion in measurement studies.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L7</strong> is the deep dive on backdoors — Neural Cleanse, STRIP, ABS detection, and the Hubinger 2024 sleeper-agents result that broke the assumption "RLHF removes backdoors". <strong>mlsec-L8</strong> covers certified defenses (randomized smoothing in depth, IBP, alpha-beta-CROWN). <strong>mlsec-L9</strong> handles LLM-specific issues (prompt injection, jailbreaks, training-data extraction) and <strong>mlsec-L10</strong> is the red-team capstone.</p>
</div>`,
tr: `<p class="l-text"><strong>Kaydın eğitim setinde miydi?</strong> Üyelik çıkarımı (MI), Tramèr'in çalmasının mahremiyet-saldırı analoğudur — modeli kurtarmak yerine saldırgan <em>veriyi</em> kurtarır. Shokri, Stronati, Song ve Shmatikov (2017, "Membership Inference Attacks Against Machine Learning Models") klasik kurulumu gösterdi: aynı dağılımdan çekilen veride K "gölge model" eğit, üye vs. üye olmayan girdilerdeki davranışlarını gözle, (model çıktısı, hedef etiket) → "üye?" alan bir saldırı sınıflandırıcısı eğit. Aşırı uydurulmuş bir tıbbi-kayıt sınıflandırıcısına karşı MI doğruluğu %80+'a çıktı — her hasta yüksek güvenle "bu hastane senin üzerinde eğitti mi?" diye sorgulanabilir.</p>

<p class="l-text">2022 dönüm noktası: Carlini, Chien, Nasr, Song, Terzis ve Tramèr'in <strong>LiRA</strong>'sı ("Membership Inference Attacks From First Principles", S&amp;P 2022). Önceki MI saldırıları acımasız bir uzun kuyruğu gizleyen "ortalama" doğruluk raporladı — birkaç aykırı kayıt %100'e yakın tanımlanabilirdi, yüzlercesi %90+'da. LiRA, gölge-model logit dağılımlarına karşı bir olabilirlik oranı testi hesaplayarak örnek-başı güveni açıkça hedefler. Sonuç: düşük ortalama MI doğruluğunda bile, eğitim noktalarının ~%1'i felaket biçimde sızdırılır. Bu yüzden differential privacy tek inanılır savunmadır — kanıtlanabilir biçimde ortalamayı değil, <em>örnek-başı</em> etkiyi sınırlar. Bu ders Shokri'nin eşik saldırılarını, LiRA'yı, aşırı uydurmanın rolünü ve savunma olarak DP-SGD'yi kapsar.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 NE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Shokri'nin gölge-model saldırısını sıfırdan uygulamak (sklearn LogReg)</li>
<li>Bir güven-eşik saldırısı kurmak ve eğitim-test güven farkını analiz etmek</li>
<li>Ortalama MI doğruluğunun neden yanıltıcı olduğunu anlamak (LiRA Carlini 2022)</li>
<li>Örnek-başı kalibre edilmiş MI için olabilirlik oranı testini hesaplamak</li>
<li>Kök neden olarak aşırı uydurma ve ilkesel savunma olarak DP-SGD hakkında akıl yürütmek</li>
<li>MI saldırılarını (ε, δ) differential-privacy garantisine eşlemek</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üyelik Çıkarımı Kurulumu</h2>
<p class="l-text">Oyunu tanımla: dünya bir kayıt z ve bir yazı-tura b ∈ {0, 1} seçer. b=0 ise z eğitime eklenir; b=1 ise tutulur. Saldırgana (z, target_model) verilir ve b'yi tahmin etmesi gerekir. MI doğruluğu &gt; 0.5 saldırının çalıştığı anlamına gelir — saldırgan eğitim seti üyeliği hakkında bilgi çıkarmıştır.</p>

<div class="katex-block">$$P(b=0 \\mid \\text{conf}) = \\frac{P(\\text{conf} \\mid b=0) P(b=0)}{P(\\text{conf})}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Neden önemli</div><div class="card-body">Tıbbi, finansal, biyometrik veri — birinin eğitim setinde olduğunu bilmek başlı başına bir mahremiyet ihlalidir. GDPR Madde 4 MI'ı kişisel-veri sızıntısı sayar.</div></div>
<div class="calc-card"><div class="card-title">Kök neden</div><div class="card-body">Modeller ezberler. Eğitim seti girdileri eşdeğer tutulan girdilerden daha yüksek güven alır — o fark MI sinyalidir.</div></div>
<div class="calc-card"><div class="card-title">Ne zaman çalışır</div><div class="card-body">Aşırı uydurulmuş modeller ağır sızdırır (büyük eğitim-test farkı). İyi-regularize edilmiş modeller daha az sızdırır ama hâlâ örnek-başı sızdırır. Geniş eğitim setli temel modeller nadir/eşsiz kayıtları sızdırır.</div></div>
<div class="calc-card"><div class="card-title">Kara kutu vs. beyaz kutu</div><div class="card-body">Kara kutu: saldırgan yalnızca sorgu yapar. Beyaz kutu: saldırgan model ağırlıklarına sahip. Beyaz kutu MI doğruluğunda ~2× kazanır (Nasr 2019, gradyan-tabanlı saldırı).</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Güven-Eşik Saldırısı (Yeom 2018)</h2>
<p class="l-text">En basit MI saldırısı: eğitim setleri test setlerinden daha yüksek kayıp alır. τ eşiği belirle; loss(z) &lt; τ ise "üye" tahmin et. Yeom vd. (2018) bu tek-sayı saldırının gölge model olmadan Shokri'ye yakın sonuçlar verdiğini gösterdi.</p>

<div class="katex-block">$$\\text{Member}(z) = \\mathbb{1}\\bigl[\\, L\\bigl(f(\\mathbf{x}), y\\bigr) &lt; \\tau \\,\\bigr]$$</div>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Aşırı uydurulmuş bir LogReg eğit, üyeler vs. üye olmayanlar için kayıp histogramını çiz, MI AUC hesapla.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
Xtr, Xte, ytr, yte = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.5</span>, random_state=<span class="num">0</span>)

<span class="cm"># Aşırı uydurmaya eğilimli model: çok düşük regularizasyon</span>
clf = <span class="fn">LogisticRegression</span>(C=<span class="num">1e6</span>, max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)

<span class="kw">def</span> <span class="fn">loss_per_sample</span>(model, X, y):
    p = model.<span class="fn">predict_proba</span>(X)
    <span class="kw">return</span> -np.<span class="fn">log</span>(p[np.<span class="fn">arange</span>(<span class="fn">len</span>(y)), y] + <span class="num">1e-12</span>)

L_member = <span class="fn">loss_per_sample</span>(clf, Xtr, ytr)      <span class="cm"># eğitimde</span>
L_nonmem = <span class="fn">loss_per_sample</span>(clf, Xte, yte)      <span class="cm"># tutuldu</span>

<span class="fn">print</span>(f<span class="str">"Mean loss (member):     {L_member.mean():.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean loss (non-member): {L_nonmem.mean():.4f}"</span>)

<span class="cm"># İkili sınıflandırıcı olarak MI: daha küçük kayıp → üye tahmin et</span>
losses = np.<span class="fn">concatenate</span>([L_member, L_nonmem])
labels = np.<span class="fn">concatenate</span>([np.<span class="fn">ones_like</span>(L_member), np.<span class="fn">zeros_like</span>(L_nonmem)])
auc = <span class="fn">roc_auc_score</span>(labels, -losses)  <span class="cm"># negatifle: daha küçük kayıp = daha yüksek üye skoru</span>
<span class="fn">print</span>(f<span class="str">"MI AUC: {auc:.3f}  (0.5 = random; &gt;0.5 means leak)"</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) 50/50 train/test ayrımı üzerinde <code>LogisticRegression(C=1e6)</code> ile bilinçli olarak aşırı uydurulmuş bir model eğitilir — yüksek <code>C</code> = sıfıra yakın regularizasyon, MI sinyalinin en güçlü olduğu rejim. 2) <code>loss_per_sample</code>, satır-başı cross-entropy <code>-log p[y]</code> döner; böylece üyeler (<code>Xtr</code>) ve üye olmayanlar (<code>Xte</code>) için kayıp dağılımları karşılaştırılabilir — Yeom 2018 eşik saldırısının sinyali. 3) MI ikili sınıflandırıcı olarak ele alınır: daha küçük kayıp ⇒ "üye"; <code>roc_auc_score</code>'a skor olarak <code>-losses</code> verilir; böylece daha yüksek üye-olasılığı daha yüksek AUC'a karşılık gelir. 4) her grup için ortalama kayıp ve MI AUC yazdırılır — 0.5'in üstündeki her şey modelin üyeliği sızdırdığı anlamına gelir.</p>
</div>

<p class="l-text">Bu küçük veri setinde ~0.55-0.65 AUC bekle. Ortalama olarak felaket değil, ama kuyruk — üyelerin kayıp=0 ve üye olmayanların kayıp=2 aldığı tek örnekler — gerçek mahremiyet ihlalinin yaşadığı yerdir.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Shokri 2017 — Gölge Modeller ve Saldırı Sınıflandırıcısı</h2>
<p class="l-text">Shokri'nin katkısı: tek eşik eğitme — bütün bir saldırı sınıflandırıcısı eğit. Adımlar:</p>

<ol style="line-height:1.7;padding-left:1.3rem">
<li>Kurbanla aynı veri dağılımından K gölge eğitim seti D_1, ..., D_K örnekle.</li>
<li>Her biri için, gölge model M_k eğit. Üyelerdeki (D_k) tahminleri "in" etiketli ve tutulan bir gölge test setindeki tahminleri "out" etiketli kaydet.</li>
<li>K gölge model arasında tüm (tahmin vektörü, in/out) çiftlerini havuzla — bu saldırı eğitim setidir.</li>
<li>Saldırı modeli A'yı eğit: tahmin-vektörü → P(üye). Lojistik regresyon veya küçük MLP iyi çalışır.</li>
<li>Bir kurban noktası z'ye saldırmak için: kurban modeli f'i sorgula, f(z) tahminini al, A'ya besle, "üye?" olasılığını çıkar.</li>
</ol>

<p class="l-text">Gölge modeller neden çalışır: yapısal olarak, saldırı sınıflandırıcısı model ailesinin eğitim ile test arasındaki güven-dağılımı farkını öğrenir. Kurbanın mimarisi ve eğitim dağılımı kabaca benzer olduğu sürece saldırı transfer eder.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (tarayıcıda çalışır)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">Churn verisinin ayrık dilimlerinde 10 gölge model kur, (olasılık, gerçek-etiket) → "üye?" üzerinde bir saldırı LogReg eğit, tutulan bir kurban model üzerinde değerlendir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> roc_auc_score

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/churn.csv"</span>)
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(df[[<span class="str">"tenure"</span>,<span class="str">"monthly_charges"</span>,<span class="str">"total_charges"</span>]].values.<span class="fn">astype</span>(<span class="fn">float</span>))
y = (df[<span class="str">"churn"</span>] == <span class="str">"yes"</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)

K = <span class="num">10</span>
attack_X, attack_y = [], []
<span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(K):
    idx = rng.<span class="fn">permutation</span>(<span class="fn">len</span>(X))
    in_idx, out_idx = idx[:<span class="num">200</span>], idx[<span class="num">200</span>:<span class="num">300</span>]
    M_k = <span class="fn">LogisticRegression</span>(C=<span class="num">1e4</span>, max_iter=<span class="num">1000</span>).<span class="fn">fit</span>(X[in_idx], y[in_idx])
    p_in  = M_k.<span class="fn">predict_proba</span>(X[in_idx])[np.<span class="fn">arange</span>(<span class="fn">len</span>(in_idx)),  y[in_idx]]
    p_out = M_k.<span class="fn">predict_proba</span>(X[out_idx])[np.<span class="fn">arange</span>(<span class="fn">len</span>(out_idx)), y[out_idx]]
    attack_X.<span class="fn">extend</span>(p_in.<span class="fn">tolist</span>());  attack_y.<span class="fn">extend</span>([<span class="num">1</span>]*<span class="fn">len</span>(in_idx))
    attack_X.<span class="fn">extend</span>(p_out.<span class="fn">tolist</span>()); attack_y.<span class="fn">extend</span>([<span class="num">0</span>]*<span class="fn">len</span>(out_idx))

A = <span class="fn">LogisticRegression</span>().<span class="fn">fit</span>(np.<span class="fn">array</span>(attack_X).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>), attack_y)

<span class="cm"># Şimdi taze bir "kurban" modele saldır</span>
idx = rng.<span class="fn">permutation</span>(<span class="fn">len</span>(X))
v_in, v_out = idx[:<span class="num">200</span>], idx[<span class="num">200</span>:<span class="num">300</span>]
victim = <span class="fn">LogisticRegression</span>(C=<span class="num">1e4</span>, max_iter=<span class="num">1000</span>).<span class="fn">fit</span>(X[v_in], y[v_in])
p_v_in  = victim.<span class="fn">predict_proba</span>(X[v_in])[np.<span class="fn">arange</span>(<span class="fn">len</span>(v_in)),  y[v_in]]
p_v_out = victim.<span class="fn">predict_proba</span>(X[v_out])[np.<span class="fn">arange</span>(<span class="fn">len</span>(v_out)), y[v_out]]
all_p = np.<span class="fn">concatenate</span>([p_v_in, p_v_out]).<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>)
all_l = np.<span class="fn">concatenate</span>([np.<span class="fn">ones</span>(<span class="fn">len</span>(v_in)), np.<span class="fn">zeros</span>(<span class="fn">len</span>(v_out))])
preds = A.<span class="fn">predict_proba</span>(all_p)[:,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Shadow-model attack AUC on victim: {roc_auc_score(all_l, preds):.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) churn verisinin ayrık rastgele dilimlerinde <code>K = 10</code> gölge <code>LogisticRegression</code> modeli eğitilir — her gölge için <code>in_idx</code> eğitim yarısı, <code>out_idx</code> ise tutulan yarıdır; Shokri 2017'nin gölge-model inşası birebir yansıtılır. 2) her gölge model için, gerçek sınıfın tahmin olasılığı <code>in_idx</code>'te "1 = üye" ve <code>out_idx</code>'te "0 = üye değil" etiketiyle kaydedilir ve hepsi <code>attack_X</code>, <code>attack_y</code> içine istiflenir. 3) <code>A = LogisticRegression()</code> saldırı sınıflandırıcısı bu (olasılık, üye?) çiftleri üzerinde eğitilir — A herhangi tek bir modelin değil, model ailesinin eğitim-vs-test güven farkını öğrenir. 4) taze bir kurban modele saldırır ve gerçek etiketleri üzerinde <code>roc_auc_score</code> raporlar — bu, üyelik-çıkarımı AUC'sidir.</p>
</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LiRA — Olabilirlik Oranı Saldırısı (Carlini 2022)</h2>
<p class="l-text">Carlini vd. önceki literatürün yanlış metriği raporladığını savundu. Ortalama MI doğruluğu 0.55 olabilir (küçük görünür) ama eğitim noktalarının en kötü %1'i ASR &gt; 0.99'a sahip olabilir (büyük görünür). Düzeltme: düşük yanlış-pozitif oranında MI gerçek-pozitif oranı raporla (örn. TPR @ FPR=0.001). Ve o rejime kalibre edilmiş bir saldırı tasarla.</p>

<p class="l-text">LiRA'nın kurulumu: her hedef z için, z içeren N_in gölge model ve içermeyen N_out gölge model eğit. Her gölge model için, modelin z üzerindeki logit'ini kaydet (daha kesin: gerçek sınıf için log p / (1-p)). İçerideki ve dışarıdaki logit dağılımlarına Gauss'lar uydur. O zaman bir kurban model M için LiRA saldırı skoru:</p>

<div class="katex-block">$$\\Lambda(z) = \\log \\frac{\\mathcal{N}\\bigl(\\phi_M(z); \\,\\mu_{\\text{in}}, \\sigma_{\\text{in}}^2\\bigr)}{\\mathcal{N}\\bigl(\\phi_M(z); \\,\\mu_{\\text{out}}, \\sigma_{\\text{out}}^2\\bigr)}$$</div>

<p class="l-text">Bir eşikle karşılaştır; Λ &gt; τ ise üye tahmin et. Olabilirlik oranı Neyman-Pearson tarafından optimal testtir — herhangi FPR'da en iyi olası TPR.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Maliyet</div><div class="card-body">Hedef başına ~64-256 gölge model gerek. Pahalı ama uygulanabilir — Carlini bunu CIFAR-100 ResNet, ImageNet, GPT-2 ince-ayarlarına karşı çalıştırdı.</div></div>
<div class="calc-card"><div class="card-title">Sonuç</div><div class="card-body">CIFAR-10 ResNet-18'de LiRA FPR=0.001'de TPR=0.10 alır — Shokri'nin ortalama saldırısına göre 100× iyileşme. Örnek-başı sızıntı gerçek ve aykırılar için büyük.</div></div>
<div class="calc-card"><div class="card-title">Aykırılar sızdırır</div><div class="card-body">Nadir veya olağandışı eğitim kayıtları en çok sızdırır. "Ortalama" kayıt güvenli; "garip" kayıt açığa çıkar. Yasal olarak önemli olan en kötü durum mahremiyetidir.</div></div>
<div class="calc-card"><div class="card-title">Çevrimiçi vs. çevrimdışı</div><div class="card-body">Çevrimiçi LiRA (hedef-başı gölge eğitim) en güçlüdür. Çevrimdışı varyant (tek gölge seti, genel dağılımlar) daha ucuzdur ama ~5× daha zayıf.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. DP-SGD Neden Yardım Eder</h2>
<p class="l-text">Differential privacy (Dwork 2006) matematiksel garanti verir: komşu veri setleri D ve D' için (bir kayıtta farklı), modelin çıktı dağılımı neredeyse aynıdır. Spesifik olarak (ε, δ)-DP şu anlama gelir:</p>

<div class="katex-block">$$P\\bigl[M(D) \\in S\\bigr] \\le e^\\varepsilon \\cdot P\\bigl[M(D') \\in S\\bigr] + \\delta$$</div>

<p class="l-text">DP-SGD (Abadi 2016) bunu sinir-ağı eğitimi için sağlar: örnek-başı gradyanları sabit bir norma kırp, Gauss gürültüsü ekle, biriktir. Mahremiyet bütçesi ε, herhangi MI saldırısının sahip olabileceği maksimum avantajı sınırlar:</p>

<div class="katex-block">$$\\text{TPR} \\le e^\\varepsilon \\cdot \\text{FPR} + \\delta \\quad\\Rightarrow\\quad \\text{MI advantage capped by }\\varepsilon$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">ε ≤ 1: sıkı</div><div class="card-body">Güçlü mahremiyet. MI saldırıları temelde başarısız olur. Ağır yarar maliyeti — doğruluk özel olmayana göre %10-30 düşebilir.</div></div>
<div class="calc-card"><div class="card-title">ε ≈ 8: orta</div><div class="card-body">Pratik uzlaşma. Apple, Google, Census Bureau üretim için ε ∈ [3, 10] hedefler. Orta yarar kaybı, iyi MI savunması.</div></div>
<div class="calc-card"><div class="card-title">ε ≥ 100: pazarlama</div><div class="card-body">"Matematiksel DP garantisi" ama ε o kadar büyük ki sınır anlamsız. DP olarak tanıtılır, gerçek mahremiyet yok.</div></div>
<div class="calc-card"><div class="card-title">DP vs. LiRA</div><div class="card-body">Carlini 2022: DP-SGD eğitilmiş CIFAR-10 (ε=8) LiRA TPR@0.001'i 0.10'dan 0.005'e düşürür. Gerçek ve ölçülebilir savunma.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kalibre Edilmiş Üyelik Çıkarımı</h2>
<p class="l-text">LiRA'nın ötesinde, son çalışmalar (Long 2018, Watson 2022) <strong>zorluk kalibrasyonu</strong> tanıttı. Bazı girdiler özünde zordur — üye olmayanlar bile yüksek kayıp alır. Naif eşik saldırıları "özünde zor"u "üye olmayan" ile karıştırır. Kalibrasyon: her kaybı aynı girdideki referans modellerin ortalama kayıplarına böl. Zor girdiler aşağı normalize edilir; kalan sinyal gerçek üyeliktir.</p>

<div class="calc-highlight"><strong>Watson 2022 ("On the Importance of Difficulty Calibration") kalibre edilmiş MI'ın kalibre edilmemişten ~%30 daha yüksek TPR@FPR=0.01 verdiğini gösterir.</strong> MI'ı bir ölçüm olarak yapıyorsan (denetçi modeli sızıntı için kontrol ediyor), kalibrasyon kullan.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Pratik Çıkarımlar</h2>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Dağıtmadan önce denetle</div><div class="card-body">Validation üzerinde LiRA-lite çalıştır: 16 gölge model eğit, TPR@FPR=0.01 kontrol et. &gt;%5 ise mahremiyet sorunun var.</div></div>
<div class="calc-card"><div class="card-title">Agresif regularize et</div><div class="card-body">Weight decay, dropout, erken durdurma, etiket yumuşatma — hepsi MI'ı azaltır. Garanti değil ama ucuz.</div></div>
<div class="calc-card"><div class="card-title">Riskler gerçek olduğunda DP-SGD kullan</div><div class="card-body">Sağlık, finans, biyometri. Yarar maliyetini öde (%5-15); ε'yi 8 veya daha düşükte sınırla.</div></div>
<div class="calc-card"><div class="card-title">Kuyruğu izle</div><div class="card-body">Ortalama doğruluk en kötü durumu gizler. Aykırılar (nadir kayıtlar) en çok sızdırır. Toplu değil, örnek-başı denetle.</div></div>
<div class="calc-card"><div class="card-title">LLM'ler daha kötü</div><div class="card-body">Eğitim verisi çıkarımı (Carlini 2021, "Extracting Training Data from Large Language Models") LLM'lerin nadir dizeleri birebir-ezberlediğini gösterir — mlsec-L9'da kapsanır.</div></div>
<div class="calc-card"><div class="card-title">Federe MI</div><div class="card-body">Nasr 2019, federe öğrenmedeki katılımcı istemcilerin yalnızca gradyanlardan birbirlerine MI yapabildiğini gösterir. Federasyon mahremiyet değildir.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Özet ve Sırada Ne Var</h2>

<div class="calc-highlight"><strong>Kilit çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Üyelik çıkarımı "bu kayıt eğitim setinde miydi?" diye sorar — başlı başına bir mahremiyet ihlalidir.</li>
<li>Yeom 2018: tek bir kayıp-eşiği Shokri'ye yakın performans verir.</li>
<li>Shokri 2017: gölge modeller + saldırı sınıflandırıcısı — klasik kurulum.</li>
<li>LiRA (Carlini 2022): hedef-başı olabilirlik oranı, düşük-FPR rejimlerinde optimal. Aykırı kayıtlar ortalama iyiyken bile felaket biçimde sızdırır.</li>
<li>DP-SGD (Abadi 2016) tek ilkesel savunmadır — MI avantajını ε ile sınırlar.</li>
<li>Kalibrasyon (Watson 2022) ölçüm çalışmalarında zor-vs-sızdırılmış karışıklığını temizler.</li>
</ul>
</div>

<p class="l-text"><strong>mlsec-L7</strong> arka kapılarda derin dalıştır — Neural Cleanse, STRIP, ABS tespiti ve "RLHF arka kapıları kaldırır" varsayımını kıran Hubinger 2024 uyuyan-ajan sonucu. <strong>mlsec-L8</strong> sertifikalı savunmaları kapsar (derinlemesine rastgele yumuşatma, IBP, alpha-beta-CROWN). <strong>mlsec-L9</strong> LLM'e özgü konuları (prompt enjeksiyonu, jailbreak'ler, eğitim verisi çıkarımı) ele alır ve <strong>mlsec-L10</strong> kırmızı takım capstone'udur.</p>
</div>`
};
