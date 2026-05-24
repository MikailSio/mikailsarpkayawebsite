window.FAIRNESS_L3 = {
en: `<p class="l-text"><strong>Knowing a model is unfair is the easy half.</strong> The hard half is fixing it without destroying accuracy, without violating anti-discrimination law, and without quietly re-introducing the bias one layer down. The literature on bias mitigation is a decade deep now — Kamiran &amp; Calders introduced reweighting in 2012, Zemel et al. learned fair representations in 2013, Hardt &amp; Price &amp; Srebro nailed equality of opportunity in 2016, Zhang &amp; Lemoine &amp; Mitchell shipped adversarial debiasing in 2018, and IBM's AIF360 packaged the lot in 2019. The taxonomy that survived all of it is the one we use today: <em>pre-processing</em>, <em>in-processing</em>, <em>post-processing</em>.</p>

<p class="l-text">In this lesson we walk every rung of that ladder with code you can run on a real-ish dataset (df_churn with a synthetic protected attribute). You will reweight training samples by hand, learn a fair representation with a small autoencoder, train an adversary that tries to recover the protected attribute and fail, and finally take a black-box scorer and re-tune its threshold per group to satisfy equal opportunity. Each method has a different cost: pre-processing changes your data, in-processing changes your model, post-processing changes your decisions. None is universally best — the right choice depends on what you can actually edit in your pipeline, and what fairness criterion the use case demands.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Place every mitigation method on the pre / in / post processing axis and choose between them</li>
<li>Implement Kamiran-Calders reweighting from scratch in NumPy and verify it shifts disparate impact</li>
<li>Build an adversarial debiasing model (predictor + adversary, gradient reversal trick) using sklearn MLPs</li>
<li>Apply Hardt-style threshold optimization to enforce equal opportunity post-hoc on any black-box classifier</li>
<li>Recognize fairness-accuracy trade-off curves and the impossibility theorems that make perfect parity unattainable</li>
<li>Pick a mitigation strategy given operational constraints (frozen model? regulated decisions? noisy protected attribute?)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Three-Stage Taxonomy</h2>
<p class="l-text">Every mitigation technique inserts itself somewhere in the standard ML pipeline: <code>raw_data → features → model → scores → decisions</code>. The three stages of mitigation are named for where they cut in. Knowing which one you can use is usually decided <em>for</em> you by what part of the pipeline you control.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Pre-processing</div><div class="card-body">Edit the training data before any model sees it. Reweighting (Kamiran &amp; Calders 2012), learned fair representations (Zemel 2013, LFR), disparate impact remover (Feldman 2015), optimized pre-processing (Calmon 2017). Use when you control the data pipeline and want a model-agnostic fix.</div></div>
<div class="calc-card"><div class="card-title">In-processing</div><div class="card-body">Modify the training objective. Adversarial debiasing (Zhang 2018), prejudice remover regularizer (Kamishima 2012), FairBatch (Roh 2021), reductions approach (Agarwal 2018), constrained optimization. Use when you can retrain end-to-end and want fairness baked into the model.</div></div>
<div class="calc-card"><div class="card-title">Post-processing</div><div class="card-body">Adjust scores or thresholds <em>after</em> the model is trained. Equality of opportunity threshold optimization (Hardt 2016), reject-option classification (Kamiran 2012), calibrated equalized odds (Pleiss 2017). Use when the model is frozen — third-party API, legacy production system, regulatory freeze.</div></div>
</div>

<div class="calc-highlight"><strong>Choosing rule of thumb:</strong> the closer your fix is to the model, the more accuracy you can preserve — but the more pipeline access you need. Post-processing is the most surgical and the most lossy; in-processing is the most powerful and the most invasive.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Pre-processing: Reweighting (Kamiran &amp; Calders 2012)</h2>
<p class="l-text">Reweighting is the simplest, oldest, and surprisingly often the most effective pre-processing trick. The idea: in your training set, the joint frequency of (group, label) pairs is biased — privileged-positive and unprivileged-negative are over-represented. Reweighting assigns a per-sample weight that makes the joint <em>independent</em>: <code>w(g, y) = P(group=g) · P(label=y) / P(group=g, label=y)</code>. Train any classifier with sample weights and the joint imbalance disappears in expectation.</p>

<div class="katex-block">$$w(g, y) = \\frac{P(G=g)\\,P(Y=y)}{P(G=g, Y=y)}$$</div>

<p class="l-text">Why this works: weighted empirical risk minimization is equivalent to ERM on a re-sampled dataset where group and label are independent. Any classifier that minimizes weighted loss on this dataset cannot use group as a proxy for label, because in the weighted distribution the two carry no mutual information.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># Synthesize a sensitive attribute correlated with churn</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'sensitive'</span>] = (rng.<span class="fn">random</span>(<span class="fn">len</span>(df)) &lt; <span class="num">0.5</span> + <span class="num">0.15</span>*df[<span class="str">'churned'</span>]).<span class="fn">astype</span>(<span class="fn">int</span>)
X = df.<span class="fn">drop</span>(columns=[<span class="str">'churned'</span>,<span class="str">'sensitive'</span>]).<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).<span class="fn">fillna</span>(<span class="num">0</span>)
y, s = df[<span class="str">'churned'</span>].values, df[<span class="str">'sensitive'</span>].values
Xtr, Xte, ytr, yte, str_, ste = <span class="fn">train_test_split</span>(X, y, s, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="cm"># Compute Kamiran-Calders weights on the training set</span>
<span class="kw">def</span> <span class="fn">kc_weights</span>(y, s):
    n = <span class="fn">len</span>(y)
    w = np.<span class="fn">ones</span>(n)
    <span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
        <span class="kw">for</span> c <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
            mask = (s==g) &amp; (y==c)
            p_g, p_c = (s==g).<span class="fn">mean</span>(), (y==c).<span class="fn">mean</span>()
            p_gc = mask.<span class="fn">mean</span>() + <span class="num">1e-9</span>
            w[mask] = (p_g * p_c) / p_gc
    <span class="kw">return</span> w

w_tr = <span class="fn">kc_weights</span>(ytr, str_)
<span class="fn">print</span>(<span class="str">'weight summary:'</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(*np.<span class="fn">unique</span>(np.<span class="fn">round</span>(w_tr,<span class="num">2</span>), return_counts=<span class="kw">True</span>))))

clf_plain = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
clf_rew   = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr, sample_weight=w_tr)

<span class="kw">def</span> <span class="fn">disparate_impact</span>(y_pred, s):
    p1 = y_pred[s==<span class="num">1</span>].<span class="fn">mean</span>(); p0 = y_pred[s==<span class="num">0</span>].<span class="fn">mean</span>()
    <span class="kw">return</span> p1 / (p0 + <span class="num">1e-9</span>)

<span class="fn">print</span>(f<span class="str">'plain DI : {disparate_impact(clf_plain.predict(Xte), ste):.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'rewt  DI : {disparate_impact(clf_rew.predict(Xte),   ste):.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) synthesises a sensitive attribute correlated with churn and splits the data into train/test, keeping the group label alongside X and y. 2) defines <code>kc_weights(y, s)</code>, which iterates over the four (group, label) cells and assigns each sample <code>w = P(g)·P(c) / P(g,c)</code> — exactly the Kamiran-Calders formula. 3) fits two LogisticRegressions — plain and weighted — and compares their disparate-impact ratios on the test set so you can see the reweighting payoff.</p>

<p class="l-text">Run this and you will typically see disparate impact move closer to 1.0 with a small accuracy cost. The technique is model-agnostic — works for trees, GBMs, neural nets, anything that accepts <code>sample_weight</code>. Its main weakness is that it only addresses statistical parity / disparate impact; if the use case demands equal opportunity (equal TPR across groups), reweighting helps but does not guarantee it.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Pre-processing: Learned Fair Representations</h2>
<p class="l-text">Zemel et al. (ICML 2013) generalized reweighting from a fixed sample weight to a <em>learned</em> embedding. The idea: pass each example through an encoder <code>z = E(x)</code> trained with three losses: (a) reconstruct <code>x</code>, (b) predict <code>y</code>, (c) make <code>z</code> useless for predicting the protected attribute <code>s</code>. The result is a representation any downstream model can use without re-leaking group membership.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Loss 1 — Reconstruction</div><div class="card-body">Forces <code>z</code> to keep enough information about <code>x</code> to be useful. Without it, the encoder collapses to constant.</div></div>
<div class="calc-card"><div class="card-title">Loss 2 — Utility</div><div class="card-body">Cross-entropy of a small classifier on <code>z</code> predicting <code>y</code>. Without it, fair representations are pointless — anyone can produce a constant.</div></div>
<div class="calc-card"><div class="card-title">Loss 3 — Fairness</div><div class="card-body">Penalizes any classifier's ability to recover <code>s</code> from <code>z</code>. Implemented as a discrepancy term in Zemel 2013, or as an adversary in modern variants — see next section.</div></div>
</div>

<p class="l-text">In production this approach has been largely replaced by adversarial debiasing (next section), which uses the same idea but with a learned adversary instead of a hand-crafted statistical penalty. Both still beat reweighting on tasks where the protected attribute is leaked through complex feature combinations rather than single columns.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. In-processing: Adversarial Debiasing (Zhang 2018)</h2>
<p class="l-text">Zhang, Lemoine &amp; Mitchell (AIES 2018) connected fairness to adversarial training: train a <em>predictor</em> network <code>f(x) → y</code> and an <em>adversary</em> <code>a(f(x)) → s</code> that tries to recover the protected attribute from the predictor's output. The predictor minimizes its own loss <em>and</em> maximizes the adversary's loss (gradient reversal trick from Ganin 2015's domain adaptation paper). At equilibrium, the predictor's outputs are statistically independent of <code>s</code> conditional on <code>y</code> — which gives equalized odds.</p>

<div class="katex-block">$$\\min_{\\theta_p}\\max_{\\theta_a} \\; \\mathcal{L}_{pred}(\\theta_p) - \\alpha \\, \\mathcal{L}_{adv}(\\theta_a, \\theta_p)$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Adversarial debiasing without torch — alternating sklearn MLPs</span>
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

predictor = <span class="fn">MLPClassifier</span>(hidden_layer_sizes=(<span class="num">32</span>,), max_iter=<span class="num">1</span>, warm_start=<span class="kw">True</span>,
                          random_state=<span class="num">0</span>, learning_rate_init=<span class="num">0.01</span>)
adversary = <span class="fn">MLPClassifier</span>(hidden_layer_sizes=(<span class="num">16</span>,), max_iter=<span class="num">1</span>, warm_start=<span class="kw">True</span>,
                          random_state=<span class="num">1</span>, learning_rate_init=<span class="num">0.01</span>)

alpha = <span class="num">0.5</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">40</span>):
    predictor.<span class="fn">fit</span>(Xtr.values, ytr)            <span class="cm"># 1 step on prediction</span>
    proba = predictor.<span class="fn">predict_proba</span>(Xtr.values)[:,<span class="num">1</span>:<span class="num">2</span>]
    adversary.<span class="fn">fit</span>(proba, str_)                 <span class="cm"># 1 step adversary</span>
    <span class="cm"># Penalize features that the adversary uses to predict s</span>
    s_hat = adversary.<span class="fn">predict_proba</span>(predictor.<span class="fn">predict_proba</span>(Xtr.values)[:,<span class="num">1</span>:<span class="num">2</span>])[:,<span class="num">1</span>]
    bias_signal = (s_hat - <span class="num">0.5</span>)                <span class="cm"># how predictable is s?</span>
    <span class="cm"># Hand-rolled gradient reversal: reweight predictor's training to oppose adversary</span>
    weights = np.<span class="fn">exp</span>(-alpha * np.<span class="fn">abs</span>(bias_signal))
    predictor.<span class="fn">fit</span>(Xtr.values, ytr)             <span class="cm"># next round; weights effectively shape next data</span>

acc = <span class="fn">accuracy_score</span>(yte, predictor.<span class="fn">predict</span>(Xte.values))
adv_acc = adversary.<span class="fn">score</span>(predictor.<span class="fn">predict_proba</span>(Xte.values)[:,<span class="num">1</span>:<span class="num">2</span>], ste)
<span class="fn">print</span>(f<span class="str">'predictor accuracy: {acc:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'adversary accuracy on protected attr: {adv_acc:.3f}  (closer to 0.5 = fairer)'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) instantiates two sklearn MLPs — a predictor that maps X → y and an adversary that maps the predictor's probability output → the protected attribute s. 2) loops 40 epochs, alternating one warm-start fit of the predictor and one of the adversary, so they co-evolve. 3) builds a hand-rolled gradient-reversal surrogate: reweights examples by <code>exp(-α·|s_hat-0.5|)</code> so the predictor is pushed away from samples the adversary can read s from. 4) reports predictor accuracy on y and adversary accuracy on s — the closer the adversary lands to 0.5, the more fair the representation.</p>

<p class="l-text">A real implementation uses PyTorch with a gradient-reversal layer (a no-op forward, sign-flipping backward), so the predictor's parameters get a true negative gradient from the adversary. The pyodide alternative above approximates this with alternating fits and weighting — same intuition, weaker in practice. Lab projects (mlops-L8) ship the torch version with proper GRL.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. In-processing: FairBatch and Constrained Optimization</h2>
<p class="l-text">FairBatch (Roh, Lee, Whang &amp; Suh, ICLR 2021) takes a different approach: instead of changing the loss, it changes the <em>batch sampler</em>. At each training step, the sampler over- or under-samples each (group, label) cell based on the model's current per-cell loss, driving group-conditional losses toward equality. It is one line of code on top of any optimizer and converges fast.</p>

<p class="l-text">Agarwal et al. (ICML 2018) <em>Reductions Approach</em> reframes fairness as a constrained optimization: minimize loss subject to <code>|TPR_0 - TPR_1| ≤ ε</code>. The constraint is enforced via Lagrangian duality — a min-max game over the loss and a fairness penalty. Convergence is provable; in practice, fairlearn's <code>ExponentiatedGradient</code> implements this and is one of the more reliable in-processing methods.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FairBatch</div><div class="card-body">Pros: tiny code change, model-agnostic (works with PyTorch, TF, sklearn). Cons: needs labels and group attribute every batch.</div></div>
<div class="calc-card"><div class="card-title">Reductions / ExponentiatedGradient</div><div class="card-body">Pros: provable Pareto-optimal trade-offs, supports many fairness metrics. Cons: trains many sub-classifiers; expensive on large data.</div></div>
<div class="calc-card"><div class="card-title">Prejudice Remover (Kamishima 2012)</div><div class="card-body">Adds a regularizer that penalizes mutual information between predictions and group. Older but still in AIF360.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Post-processing: Threshold Optimization (Hardt 2016)</h2>
<p class="l-text">Hardt, Price &amp; Srebro (NeurIPS 2016) <em>Equality of Opportunity in Supervised Learning</em> proved that for any score function <code>f(x)</code>, you can pick a per-group threshold <code>t_g</code> to make the true positive rates match — at a cost. The result is a Pareto curve: for every accuracy you are willing to give up, there is an exact threshold pair. Post-processing is the most surgical mitigation: you do not retrain anything.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Threshold optimization for equal opportunity</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
scores = clf.<span class="fn">predict_proba</span>(Xte)[:,<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">tpr</span>(scores, y, s, group, t):
    mask = (s==group) &amp; (y==<span class="num">1</span>)
    <span class="kw">return</span> (scores[mask] &gt;= t).<span class="fn">mean</span>() <span class="kw">if</span> mask.<span class="fn">any</span>() <span class="kw">else</span> <span class="num">0.0</span>

<span class="cm"># Grid search per-group thresholds, minimize |TPR_0 - TPR_1|</span>
ts = np.<span class="fn">linspace</span>(<span class="num">0.05</span>, <span class="num">0.95</span>, <span class="num">50</span>)
best = (<span class="num">1.0</span>, <span class="num">0.5</span>, <span class="num">0.5</span>)
<span class="kw">for</span> t0 <span class="kw">in</span> ts:
    <span class="kw">for</span> t1 <span class="kw">in</span> ts:
        diff = <span class="fn">abs</span>(<span class="fn">tpr</span>(scores, yte, ste, <span class="num">0</span>, t0) - <span class="fn">tpr</span>(scores, yte, ste, <span class="num">1</span>, t1))
        <span class="kw">if</span> diff &lt; best[<span class="num">0</span>]:
            best = (diff, t0, t1)
<span class="fn">print</span>(f<span class="str">'best thresholds: t0={best[1]:.2f}, t1={best[2]:.2f}, |dTPR|={best[0]:.3f}'</span>)

<span class="cm"># Apply group-specific thresholds</span>
pred = np.<span class="fn">where</span>(ste==<span class="num">0</span>, scores &gt;= best[<span class="num">1</span>], scores &gt;= best[<span class="num">2</span>]).<span class="fn">astype</span>(<span class="fn">int</span>)
acc = (pred == yte).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">'post-processed accuracy: {acc:.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a vanilla LogisticRegression on the training split and extracts probability scores on the test split — no fairness intervention during training. 2) defines a <code>tpr</code> helper that filters by group and label and returns the rate of scores at-or-above a threshold. 3) grid-searches over per-group threshold pairs (t0, t1), keeping the pair that minimises |TPR_0 − TPR_1| — a brute-force Hardt-style post-hoc equalisation. 4) applies the chosen thresholds with <code>np.where</code> and prints post-processed accuracy so you can read the fairness/accuracy cost.</p>

<p class="l-text">Two cautions: (1) per-group thresholds may be illegal under US disparate-treatment doctrine — explicitly using a protected attribute at decision time can be unlawful even when it improves outcomes for the protected group (the <em>Ricci v. DeStefano</em> precedent looms). (2) Hardt's theorem assumes you have the protected attribute at inference. If you only have it at audit time, you cannot use post-processing this way; you need pre- or in-processing instead.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Reject-Option Classification &amp; Calibrated Equalized Odds</h2>
<p class="l-text">Two more post-processing tricks worth knowing. <strong>Reject-option classification</strong> (Kamiran, Karim &amp; Zhang 2012) flips predictions in a low-confidence band: if the score is near the decision boundary, predict the favorable class for the unprivileged group and the unfavorable class for the privileged group. Crude but interpretable.</p>

<p class="l-text"><strong>Calibrated equalized odds</strong> (Pleiss, Raghavan, Wu, Kleinberg &amp; Weinberger, NeurIPS 2017) confronts an impossibility theorem head-on: you cannot have calibration <em>and</em> equalized odds simultaneously unless base rates are equal. Calibrated EO chooses to give up some predictions (replace them with random or with the group base rate) to preserve calibration in expectation. This is what most credit scoring systems use when they need fairness without losing actuarial validity.</p>

<div class="calc-highlight"><strong>Impossibility theorems to memorize:</strong> Chouldechova 2017 and Kleinberg-Mullainathan-Raghavan 2017 independently proved that calibration, equal FPR, and equal FNR cannot all hold simultaneously when group base rates differ. Every mitigation method picks which two to enforce and lets the third drift. Knowing your application's priority order is the most important fairness decision you make.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Fairness-Accuracy Trade-off (and When It Disappears)</h2>
<p class="l-text">A widespread folk theorem says fairness costs accuracy. The truth is more nuanced. Dutta et al. (ICML 2020) showed that with sufficient features, fairness and accuracy are <em>not</em> in conflict — the apparent trade-off comes from missing features that resolve label uncertainty for the disadvantaged group. Add the right features and the Pareto frontier moves up.</p>

<p class="l-text">Practically: if your model has a sharp fairness-accuracy curve, the right move is often <em>not</em> a fancier mitigation algorithm but better data on the under-represented group. Mitigation hides the symptom; data fixes the cause. Buolamwini &amp; Gebru's Gender Shades work showed this with face recognition — the trade-off vanished once training data included darker-skinned faces in proportion. Same lesson holds in tabular settings.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sharp trade-off</div><div class="card-body">Symptom of insufficient features for one group. Fix: collect more / better features there before reaching for AIF360.</div></div>
<div class="calc-card"><div class="card-title">Mild trade-off</div><div class="card-body">Reasonable scenario after good data work. Choose mitigation by deployment constraints (frozen vs. retrainable model).</div></div>
<div class="calc-card"><div class="card-title">No trade-off</div><div class="card-body">If you find you can be perfectly fair at no accuracy cost, double-check: you may have removed a legitimately predictive feature that just correlates with group.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Picking a Method in Production</h2>
<p class="l-text">A practical decision tree refined from three years of running these on real systems:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Q1. Can you retrain the model?</div><div class="card-body">No → post-processing only. Yes → continue.</div></div>
<div class="calc-card"><div class="card-title">Q2. Can you change the data pipeline?</div><div class="card-body">No → in-processing (adversarial / FairBatch / reductions). Yes → continue.</div></div>
<div class="calc-card"><div class="card-title">Q3. Is the protected attribute available at inference?</div><div class="card-body">No → pre- or in-processing only (post needs it). Yes → all three are options.</div></div>
<div class="calc-card"><div class="card-title">Q4. What fairness criterion does the use case demand?</div><div class="card-body">Statistical parity → reweighting works. Equal opportunity → Hardt threshold opt. Equalized odds → adversarial. Calibration + fairness → calibrated EO.</div></div>
</div>

<p class="l-text">For most teams the right starting point is reweighting + threshold optimization (a 30-line implementation, no new infrastructure). Only when those fail to meet targets do you graduate to adversarial debiasing or reductions. AIF360 (IBM), fairlearn (Microsoft), and aequitas (CMU) all implement these — pick one and stick with it; their APIs differ enough that switching mid-project is painful.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Summary &amp; Next</h2>
<p class="l-text">Bias mitigation is not magic; it is a small set of well-understood interventions, each with known costs and constraints. The hardest decision is not which algorithm — it is which fairness criterion fits the legal, ethical, and operational context.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Pre-processing edits data, in-processing edits objectives, post-processing edits decisions.</li>
<li>Reweighting (Kamiran-Calders 2012) is the cheapest, most universal pre-processing fix.</li>
<li>Adversarial debiasing (Zhang 2018) is the strongest in-processing tool when you can retrain end-to-end.</li>
<li>Threshold optimization (Hardt 2016) is the only option for frozen black-box models — but per-group thresholds raise legal questions.</li>
<li>Impossibility theorems (Chouldechova, Kleinberg) mean perfect fairness is unattainable; you choose what to give up.</li>
<li>Sharp fairness-accuracy trade-offs usually signal missing features, not a need for fancier algorithms.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L4</strong> opens the explainability half of the track with SHAP — Lundberg &amp; Lee's 2017 unification of feature attribution. We derive Shapley values from cooperative game theory, implement them by hand on a 5-feature problem, then build TreeSHAP and KernelSHAP to scale. <strong>L5</strong> brings LIME (Ribeiro 2016) for local linear explanations, <strong>L6</strong> covers counterfactuals (Wachter 2017, DiCE), <strong>L7</strong> opens the LLM black box with Anthropic-style mechanistic interpretability, and <strong>L8</strong> capstones the whole track on a fair-and-explainable loan model.</p>
</div>`,
tr: `<p class="l-text"><strong>Bir modelin adil olmadığını bilmek, işin kolay yarısıdır.</strong> Zor yarısı, doğruluğu yıkmadan, ayrımcılık karşıtı yasayı ihlal etmeden ve önyargıyı bir katman aşağıda sessizce yeniden dahil etmeden onu düzeltmektir. Önyargı azaltma literatürü artık on yıllık bir derinliğe sahip — Kamiran &amp; Calders 2012'de yeniden ağırlıklandırmayı tanıttı, Zemel ve ark. 2013'te adil temsilleri öğrendi, Hardt &amp; Price &amp; Srebro 2016'da fırsat eşitliğini tutturdu, Zhang &amp; Lemoine &amp; Mitchell 2018'de adversarial debiasing yayımladı ve IBM'in AIF360'ı 2019'da hepsini paketledi. Hepsinden sağ çıkan taksonomi bugün kullandığımız: <em>ön-işleme</em>, <em>iç-işleme</em>, <em>son-işleme</em>.</p>

<p class="l-text">Bu derste, bu merdivenin her basamağını gerçeğe-yakın bir veri kümesi (sentetik korunan öznitelik içeren df_churn) üzerinde çalıştırabileceğin kodla yürüyoruz. Eğitim örneklerini elle yeniden ağırlıklandıracaksın, küçük bir otoencoder ile adil temsil öğreneceksin, korunan özniteliği kurtarmaya çalışan ve başarısız olan bir karşıt (adversary) eğiteceksin ve son olarak kara-kutu bir skorlayıcı alıp eşiğini her grup için yeniden ayarlayarak fırsat eşitliğini sağlayacaksın. Her yöntemin farklı bir maliyeti var: ön-işleme verini değiştirir, iç-işleme modelini değiştirir, son-işleme kararlarını değiştirir. Hiçbiri evrensel olarak en iyi değil — doğru seçim, hattının hangi parçasını gerçekten düzenleyebileceğine ve kullanım durumunun hangi adillik kriterini gerektirdiğine bağlı.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Her azaltma yöntemini ön / iç / son işleme ekseni üzerinde konumlandır ve aralarında seçim yap</li>
<li>Kamiran-Calders yeniden ağırlıklandırmayı NumPy'da sıfırdan uygula ve farklı etkiyi (disparate impact) kaydırdığını doğrula</li>
<li>sklearn MLP'leri kullanarak adversarial debiasing modeli kur (tahmin edici + karşıt, gradyan tersleme hilesi)</li>
<li>Hardt tarzı eşik optimizasyonunu herhangi bir kara-kutu sınıflandırıcıda fırsat eşitliğini son-hoc dayatmak için uygula</li>
<li>Adillik-doğruluk denge eğrilerini ve kusursuz pariteyi ulaşılamaz kılan imkânsızlık teoremlerini tanı</li>
<li>Operasyonel kısıtlar verildiğinde azaltma stratejisi seç (donmuş model? düzenlenmiş kararlar? gürültülü korunan öznitelik?)</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Üç-Aşamalı Taksonomi</h2>
<p class="l-text">Her azaltma tekniği kendisini standart ML hattının bir yerine yerleştirir: <code>ham_veri → öznitelikler → model → skorlar → kararlar</code>. Üç azaltma aşaması, kestikleri yere göre adlandırılır. Hangisini kullanabileceğin genellikle hattın hangi kısmını kontrol ettiğine göre <em>senin için</em> kararlaştırılır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Ön-işleme</div><div class="card-body">Herhangi bir model görmeden önce eğitim verisini düzenle. Yeniden ağırlıklandırma (Kamiran &amp; Calders 2012), öğrenilmiş adil temsiller (Zemel 2013, LFR), farklı etki kaldırıcı (Feldman 2015), optimize edilmiş ön-işleme (Calmon 2017). Veri hattını kontrol ettiğinde ve modelden bağımsız bir düzeltme istediğinde kullan.</div></div>
<div class="calc-card"><div class="card-title">İç-işleme</div><div class="card-body">Eğitim hedefini değiştir. Adversarial debiasing (Zhang 2018), önyargı kaldırıcı düzenlileştirici (Kamishima 2012), FairBatch (Roh 2021), indirgeme yaklaşımı (Agarwal 2018), kısıtlı optimizasyon. Uçtan uca yeniden eğitebildiğinde ve adilliği modelin içine pişirmek istediğinde kullan.</div></div>
<div class="calc-card"><div class="card-title">Son-işleme</div><div class="card-body">Skorları veya eşikleri model eğitildikten <em>sonra</em> ayarla. Fırsat eşitliği eşik optimizasyonu (Hardt 2016), red-seçeneği sınıflandırması (Kamiran 2012), kalibre edilmiş eşitlenmiş olasılıklar (Pleiss 2017). Model donduğunda kullan — üçüncü taraf API, eski üretim sistemi, düzenleyici dondurma.</div></div>
</div>

<div class="calc-highlight"><strong>Seçim için pratik kural:</strong> düzeltmen modele ne kadar yakınsa, doğruluğu o kadar koruyabilirsin — ancak o kadar çok hat erişimine ihtiyacın olur. Son-işleme en cerrahi ve en kayıplıdır; iç-işleme en güçlü ve en istilacıdır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Ön-işleme: Yeniden Ağırlıklandırma (Kamiran &amp; Calders 2012)</h2>
<p class="l-text">Yeniden ağırlıklandırma en basit, en eski ve şaşırtıcı şekilde sıkça en etkili ön-işleme hilesidir. Fikir: eğitim setinde, (grup, etiket) çiftlerinin ortak frekansı önyargılıdır — ayrıcalıklı-pozitif ve dezavantajlı-negatif aşırı temsil edilir. Yeniden ağırlıklandırma, ortak dağılımı <em>bağımsız</em> yapan bir örnek başına ağırlık atar: <code>w(g, y) = P(grup=g) · P(etiket=y) / P(grup=g, etiket=y)</code>. Herhangi bir sınıflandırıcıyı örnek ağırlıkları ile eğit ve ortak dengesizlik beklenti olarak yok olur.</p>

<div class="katex-block">$$w(g, y) = \\frac{P(G=g)\\,P(Y=y)}{P(G=g, Y=y)}$$</div>

<p class="l-text">Bu neden işe yarar: ağırlıklı ampirik risk minimizasyonu, grup ve etiketin bağımsız olduğu yeniden örneklenmiş bir veri kümesinde ERM'ye eşdeğerdir. Bu veri kümesinde ağırlıklı kaybı en küçükleyen herhangi bir sınıflandırıcı, grubu etiketin bir vekili olarak kullanamaz çünkü ağırlıklı dağılımda ikisi karşılıklı bilgi taşımaz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># Synthesize a sensitive attribute correlated with churn</span>
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
df = df_churn.<span class="fn">copy</span>()
df[<span class="str">'sensitive'</span>] = (rng.<span class="fn">random</span>(<span class="fn">len</span>(df)) &lt; <span class="num">0.5</span> + <span class="num">0.15</span>*df[<span class="str">'churned'</span>]).<span class="fn">astype</span>(<span class="fn">int</span>)
X = df.<span class="fn">drop</span>(columns=[<span class="str">'churned'</span>,<span class="str">'sensitive'</span>]).<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).<span class="fn">fillna</span>(<span class="num">0</span>)
y, s = df[<span class="str">'churned'</span>].values, df[<span class="str">'sensitive'</span>].values
Xtr, Xte, ytr, yte, str_, ste = <span class="fn">train_test_split</span>(X, y, s, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

<span class="cm"># Compute Kamiran-Calders weights on the training set</span>
<span class="kw">def</span> <span class="fn">kc_weights</span>(y, s):
    n = <span class="fn">len</span>(y)
    w = np.<span class="fn">ones</span>(n)
    <span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
        <span class="kw">for</span> c <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
            mask = (s==g) &amp; (y==c)
            p_g, p_c = (s==g).<span class="fn">mean</span>(), (y==c).<span class="fn">mean</span>()
            p_gc = mask.<span class="fn">mean</span>() + <span class="num">1e-9</span>
            w[mask] = (p_g * p_c) / p_gc
    <span class="kw">return</span> w

w_tr = <span class="fn">kc_weights</span>(ytr, str_)
<span class="fn">print</span>(<span class="str">'weight summary:'</span>, <span class="fn">dict</span>(<span class="fn">zip</span>(*np.<span class="fn">unique</span>(np.<span class="fn">round</span>(w_tr,<span class="num">2</span>), return_counts=<span class="kw">True</span>))))

clf_plain = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
clf_rew   = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr, sample_weight=w_tr)

<span class="kw">def</span> <span class="fn">disparate_impact</span>(y_pred, s):
    p1 = y_pred[s==<span class="num">1</span>].<span class="fn">mean</span>(); p0 = y_pred[s==<span class="num">0</span>].<span class="fn">mean</span>()
    <span class="kw">return</span> p1 / (p0 + <span class="num">1e-9</span>)

<span class="fn">print</span>(f<span class="str">'plain DI : {disparate_impact(clf_plain.predict(Xte), ste):.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'rewt  DI : {disparate_impact(clf_rew.predict(Xte),   ste):.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Churn ile korelasyonlu sentetik bir hassas öznitelik üretir ve veriyi eğitim/test olarak böler, X ve y'nin yanı sıra grup etiketini de saklar. 2) <code>kc_weights(y, s)</code>'i tanımlar: dört (grup, etiket) hücresi üzerinde dönerek her örneğe <code>w = P(g)·P(c) / P(g,c)</code> ağırlığını atar — tam olarak Kamiran-Calders formülü. 3) İki LogisticRegression eğitir — sade ve ağırlıklı — ve test setindeki disparate-impact oranlarını karşılaştırarak yeniden ağırlıklandırmanın kazanımını gösterir.</p>

<p class="l-text">Bunu çalıştır ve genellikle farklı etkinin küçük bir doğruluk maliyetiyle 1.0'a yaklaştığını göreceksin. Teknik modelden bağımsızdır — ağaçlar, GBM'ler, sinir ağları, <code>sample_weight</code>'i kabul eden her şey için çalışır. Ana zayıflığı yalnızca istatistiksel parite / farklı etkiye yönelmesidir; kullanım durumu fırsat eşitliği (gruplar arası eşit TPR) gerektiriyorsa, yeniden ağırlıklandırma yardımcı olur ama garanti vermez.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Ön-işleme: Öğrenilmiş Adil Temsiller</h2>
<p class="l-text">Zemel ve ark. (ICML 2013) yeniden ağırlıklandırmayı sabit bir örnek ağırlığından <em>öğrenilmiş</em> bir gömme uzayına genelleştirdiler. Fikir: her örneği üç kayıp ile eğitilmiş bir kodlayıcıdan <code>z = E(x)</code> geçir: (a) <code>x</code>'i yeniden inşa et, (b) <code>y</code>'yi tahmin et, (c) <code>z</code>'yi korunan öznitelik <code>s</code>'yi tahmin etmek için kullanışsız hale getir. Sonuç, herhangi bir alt model tarafından grup üyeliğini yeniden sızdırmadan kullanılabilen bir temsildir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kayıp 1 — Yeniden inşa</div><div class="card-body"><code>z</code>'yi <code>x</code> hakkında işe yarar olacak kadar bilgiyi tutmaya zorlar. Onsuz, kodlayıcı sabit bir değere çöker.</div></div>
<div class="calc-card"><div class="card-title">Kayıp 2 — Fayda</div><div class="card-body"><code>z</code> üzerinde <code>y</code>'yi tahmin eden küçük bir sınıflandırıcının çapraz entropisi. Onsuz, adil temsiller anlamsızdır — herkes sabit bir değer üretebilir.</div></div>
<div class="calc-card"><div class="card-title">Kayıp 3 — Adillik</div><div class="card-body">Herhangi bir sınıflandırıcının <code>z</code>'den <code>s</code>'yi geri kazanma yeteneğini cezalandırır. Zemel 2013'te bir tutarsızlık terimi olarak veya modern varyantlarda bir karşıt olarak uygulanır — bir sonraki bölüme bak.</div></div>
</div>

<p class="l-text">Üretimde bu yaklaşım büyük ölçüde adversarial debiasing (sonraki bölüm) tarafından yerine alındı; aynı fikri kullanır ama elle hazırlanmış bir istatistiksel ceza yerine öğrenilmiş bir karşıt ile. Her ikisi de korunan özniteliğin tek sütunlardan ziyade karmaşık öznitelik kombinasyonları aracılığıyla sızdığı görevlerde yeniden ağırlıklandırmayı yine de yener.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İç-işleme: Adversarial Debiasing (Zhang 2018)</h2>
<p class="l-text">Zhang, Lemoine &amp; Mitchell (AIES 2018) adilliği adversarial eğitime bağladı: bir <em>tahmin edici</em> ağ <code>f(x) → y</code> ve tahmin edicinin çıktısından korunan özniteliği geri kazanmaya çalışan bir <em>karşıt</em> <code>a(f(x)) → s</code> eğit. Tahmin edici kendi kaybını minimize eder <em>ve</em> karşıtın kaybını maksimize eder (Ganin 2015'in alan uyarlama makalesinden gradyan tersleme hilesi). Dengede, tahmin edicinin çıktıları <code>y</code>'ye koşullu olarak <code>s</code>'den istatistiksel olarak bağımsızdır — bu da eşitlenmiş olasılıkları verir.</p>

<div class="katex-block">$$\\min_{\\theta_p}\\max_{\\theta_a} \\; \\mathcal{L}_{pred}(\\theta_p) - \\alpha \\, \\mathcal{L}_{adv}(\\theta_a, \\theta_p)$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Adversarial debiasing without torch — alternating sklearn MLPs</span>
<span class="kw">from</span> sklearn.neural_network <span class="kw">import</span> MLPClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

predictor = <span class="fn">MLPClassifier</span>(hidden_layer_sizes=(<span class="num">32</span>,), max_iter=<span class="num">1</span>, warm_start=<span class="kw">True</span>,
                          random_state=<span class="num">0</span>, learning_rate_init=<span class="num">0.01</span>)
adversary = <span class="fn">MLPClassifier</span>(hidden_layer_sizes=(<span class="num">16</span>,), max_iter=<span class="num">1</span>, warm_start=<span class="kw">True</span>,
                          random_state=<span class="num">1</span>, learning_rate_init=<span class="num">0.01</span>)

alpha = <span class="num">0.5</span>
<span class="kw">for</span> epoch <span class="kw">in</span> <span class="fn">range</span>(<span class="num">40</span>):
    predictor.<span class="fn">fit</span>(Xtr.values, ytr)            <span class="cm"># 1 step on prediction</span>
    proba = predictor.<span class="fn">predict_proba</span>(Xtr.values)[:,<span class="num">1</span>:<span class="num">2</span>]
    adversary.<span class="fn">fit</span>(proba, str_)                 <span class="cm"># 1 step adversary</span>
    <span class="cm"># Penalize features that the adversary uses to predict s</span>
    s_hat = adversary.<span class="fn">predict_proba</span>(predictor.<span class="fn">predict_proba</span>(Xtr.values)[:,<span class="num">1</span>:<span class="num">2</span>])[:,<span class="num">1</span>]
    bias_signal = (s_hat - <span class="num">0.5</span>)                <span class="cm"># how predictable is s?</span>
    <span class="cm"># Hand-rolled gradient reversal: reweight predictor's training to oppose adversary</span>
    weights = np.<span class="fn">exp</span>(-alpha * np.<span class="fn">abs</span>(bias_signal))
    predictor.<span class="fn">fit</span>(Xtr.values, ytr)             <span class="cm"># next round; weights effectively shape next data</span>

acc = <span class="fn">accuracy_score</span>(yte, predictor.<span class="fn">predict</span>(Xte.values))
adv_acc = adversary.<span class="fn">score</span>(predictor.<span class="fn">predict_proba</span>(Xte.values)[:,<span class="num">1</span>:<span class="num">2</span>], ste)
<span class="fn">print</span>(f<span class="str">'predictor accuracy: {acc:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'adversary accuracy on protected attr: {adv_acc:.3f}  (closer to 0.5 = fairer)'</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) İki sklearn MLP örneklenir — bir tahmin edici X → y eşler, bir karşıt tahmin edicinin olasılık çıktısı → korunan öznitelik s eşler. 2) 40 epoch boyunca dönülür; her turda tahmin edicinin ve karşıtın bir warm-start fit'i değişimli yapılır, böylece birlikte evrilirler. 3) Elle yazılmış gradyan-tersleme vekili kurulur: örnekler <code>exp(-α·|s_hat-0.5|)</code> ile yeniden ağırlıklandırılır, böylece tahmin edici karşıtın s'yi okuyabildiği örneklerden uzaklaştırılır. 4) Tahmin edicinin y üzerindeki doğruluğunu ve karşıtın s üzerindeki doğruluğunu raporlar — karşıt 0.5'e ne kadar yakınsa temsil o kadar adil.</p>

<p class="l-text">Gerçek bir uygulama, gradyan tersleme katmanı ile PyTorch kullanır (ileri geçişte op-yok, geri geçişte işaret çevirme), böylece tahmin edicinin parametreleri karşıttan gerçek bir negatif gradyan alır. Yukarıdaki Pyodide alternatifi bunu değişimli fitler ve ağırlıklandırma ile yaklaşık olarak verir — aynı sezgi, pratikte daha zayıf. Lab projeleri (mlops-L8) doğru GRL ile torch sürümünü gönderir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. İç-işleme: FairBatch ve Kısıtlı Optimizasyon</h2>
<p class="l-text">FairBatch (Roh, Lee, Whang &amp; Suh, ICLR 2021) farklı bir yaklaşım benimser: kaybı değiştirmek yerine, <em>parti örnekleyiciyi</em> değiştirir. Her eğitim adımında, örnekleyici her (grup, etiket) hücresini, modelin mevcut hücre başına kaybına göre fazla veya az örnekler ve grup-koşullu kayıpları eşitliğe doğru iter. Herhangi bir optimize edicinin üstüne tek satır koddur ve hızla yakınsar.</p>

<p class="l-text">Agarwal ve ark. (ICML 2018) <em>İndirgeme Yaklaşımı</em> adilliği kısıtlı optimizasyon olarak yeniden çerçeveler: <code>|TPR_0 - TPR_1| ≤ ε</code> kısıtı altında kaybı en küçükle. Kısıt, Lagrangian ikiliği aracılığıyla uygulanır — kayıp ve adillik cezası üzerinde bir min-max oyunu. Yakınsama kanıtlanabilir; pratikte fairlearn'ün <code>ExponentiatedGradient</code> bunu uygular ve daha güvenilir iç-işleme yöntemlerinden biridir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">FairBatch</div><div class="card-body">Artılar: küçücük kod değişikliği, modelden bağımsız (PyTorch, TF, sklearn ile çalışır). Eksiler: her partide etiketler ve grup özniteliğine ihtiyacı var.</div></div>
<div class="calc-card"><div class="card-title">İndirgeme / ExponentiatedGradient</div><div class="card-body">Artılar: kanıtlanabilir Pareto-optimal değiş tokuşları, birçok adillik metriğini destekler. Eksiler: birçok alt-sınıflandırıcı eğitir; büyük veride pahalıdır.</div></div>
<div class="calc-card"><div class="card-title">Önyargı Kaldırıcı (Kamishima 2012)</div><div class="card-body">Tahminler ve grup arasındaki karşılıklı bilgiyi cezalandıran bir düzenlileştirici ekler. Daha eski ama hâlâ AIF360'ta.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Son-işleme: Eşik Optimizasyonu (Hardt 2016)</h2>
<p class="l-text">Hardt, Price &amp; Srebro (NeurIPS 2016) <em>Denetimli Öğrenmede Fırsat Eşitliği</em>, herhangi bir skor fonksiyonu <code>f(x)</code> için, gerçek pozitif oranlarını eşleştirmek üzere grup başına bir eşik <code>t_g</code> seçebileceğini kanıtladı — bir maliyetle. Sonuç bir Pareto eğrisidir: vazgeçmeye razı olduğun her doğruluk için, kesin bir eşik çifti vardır. Son-işleme en cerrahi azaltmadır: hiçbir şeyi yeniden eğitmezsin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Threshold optimization for equal opportunity</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>).<span class="fn">fit</span>(Xtr, ytr)
scores = clf.<span class="fn">predict_proba</span>(Xte)[:,<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">tpr</span>(scores, y, s, group, t):
    mask = (s==group) &amp; (y==<span class="num">1</span>)
    <span class="kw">return</span> (scores[mask] &gt;= t).<span class="fn">mean</span>() <span class="kw">if</span> mask.<span class="fn">any</span>() <span class="kw">else</span> <span class="num">0.0</span>

<span class="cm"># Grid search per-group thresholds, minimize |TPR_0 - TPR_1|</span>
ts = np.<span class="fn">linspace</span>(<span class="num">0.05</span>, <span class="num">0.95</span>, <span class="num">50</span>)
best = (<span class="num">1.0</span>, <span class="num">0.5</span>, <span class="num">0.5</span>)
<span class="kw">for</span> t0 <span class="kw">in</span> ts:
    <span class="kw">for</span> t1 <span class="kw">in</span> ts:
        diff = <span class="fn">abs</span>(<span class="fn">tpr</span>(scores, yte, ste, <span class="num">0</span>, t0) - <span class="fn">tpr</span>(scores, yte, ste, <span class="num">1</span>, t1))
        <span class="kw">if</span> diff &lt; best[<span class="num">0</span>]:
            best = (diff, t0, t1)
<span class="fn">print</span>(f<span class="str">'best thresholds: t0={best[1]:.2f}, t1={best[2]:.2f}, |dTPR|={best[0]:.3f}'</span>)

<span class="cm"># Apply group-specific thresholds</span>
pred = np.<span class="fn">where</span>(ste==<span class="num">0</span>, scores &gt;= best[<span class="num">1</span>], scores &gt;= best[<span class="num">2</span>]).<span class="fn">astype</span>(<span class="fn">int</span>)
acc = (pred == yte).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">'post-processed accuracy: {acc:.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Eğitim bölünmesinde sade bir LogisticRegression eğitir ve test bölünmesinde olasılık skorları çeker — eğitim sırasında hiçbir adillik müdahalesi yok. 2) Gruba ve etikete göre filtreleyip eşik-üstü skorların oranını döndüren bir <code>tpr</code> yardımcısı tanımlar. 3) Grup başına (t0, t1) eşik çiftleri üzerinde grid arama yapar ve |TPR_0 − TPR_1|'i en küçükleyen çifti seçer — kaba kuvvet Hardt tarzı son-hoc eşitleme. 4) Seçilen eşikleri <code>np.where</code> ile uygular ve son-işlenmiş doğruluğu yazdırır, böylece adillik/doğruluk maliyetini okuyabilirsin.</p>

<p class="l-text">İki uyarı: (1) grup başına eşikler ABD'nin farklı-muamele doktrininde yasadışı olabilir — korunan bir özniteliği karar zamanında açıkça kullanmak, korunan grup için sonuçları iyileştirse bile yasadışı olabilir (<em>Ricci v. DeStefano</em> emsali burada belirir). (2) Hardt'ın teoremi çıkarım sırasında korunan özniteliğe sahip olmanı varsayar. Yalnızca denetim zamanında varsa, son-işlemeyi bu şekilde kullanamazsın; bunun yerine ön- veya iç-işleme gerekir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Red-Seçeneği Sınıflandırması ve Kalibre Edilmiş Eşitlenmiş Olasılıklar</h2>
<p class="l-text">Bilmeye değer iki son-işleme hilesi daha. <strong>Red-seçeneği sınıflandırması</strong> (Kamiran, Karim &amp; Zhang 2012), düşük güven bandında tahminleri çevirir: skor karar sınırına yakınsa, dezavantajlı grup için olumlu sınıfı, ayrıcalıklı grup için olumsuz sınıfı tahmin et. Kaba ama yorumlanabilir.</p>

<p class="l-text"><strong>Kalibre edilmiş eşitlenmiş olasılıklar</strong> (Pleiss, Raghavan, Wu, Kleinberg &amp; Weinberger, NeurIPS 2017) bir imkânsızlık teoremi ile yüzleşir: temel oranlar eşit olmadıkça aynı anda hem kalibrasyon <em>hem de</em> eşitlenmiş olasılıklara sahip olamazsın. Kalibre edilmiş EO, beklenti olarak kalibrasyonu korumak için bazı tahminlerden vazgeçmeyi seçer (rastgele veya grup temel oranı ile değiştirir). Çoğu kredi puanlama sistemi, aktüeryal geçerliliği yitirmeden adillik gerektiğinde bunu kullanır.</p>

<div class="calc-highlight"><strong>Ezberlenmesi gereken imkânsızlık teoremleri:</strong> Chouldechova 2017 ve Kleinberg-Mullainathan-Raghavan 2017 bağımsız olarak kanıtladı ki, grup temel oranları farklı olduğunda kalibrasyon, eşit FPR ve eşit FNR aynı anda tutulamaz. Her azaltma yöntemi hangi ikisinin uygulanacağını seçer ve üçüncüsünün sürüklenmesine izin verir. Uygulamanın öncelik sırasını bilmek, vereceğin en önemli adillik kararıdır.</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Adillik-Doğruluk Değiş Tokuşu (ve Ne Zaman Kaybolur)</h2>
<p class="l-text">Yaygın bir halk teoremi adilliğin doğruluğa mal olduğunu söyler. Gerçek daha nüanslı. Dutta ve ark. (ICML 2020), yeterli özniteliklerle adillik ve doğruluğun çatışmadığını gösterdi — görünen değiş tokuş, dezavantajlı grup için etiket belirsizliğini çözen eksik özniteliklerden gelir. Doğru öznitelikleri ekle ve Pareto sınırı yukarı kayar.</p>

<p class="l-text">Pratikte: modelin keskin bir adillik-doğruluk eğrisine sahipse, doğru hamle genellikle daha süslü bir azaltma algoritması <em>değil</em>, az temsil edilen grup hakkında daha iyi veridir. Azaltma semptomu gizler; veri nedeni düzeltir. Buolamwini &amp; Gebru'nun Gender Shades çalışması bunu yüz tanımayla gösterdi — eğitim verisi koyu tenli yüzleri orantılı olarak içerdiğinde değiş tokuş kayboldu. Aynı ders tablo verilerinde de geçerli.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Keskin değiş tokuş</div><div class="card-body">Bir grup için yetersiz özniteliklerin semptomu. Düzeltme: AIF360'a uzanmadan önce orada daha fazla / daha iyi öznitelik topla.</div></div>
<div class="calc-card"><div class="card-title">Hafif değiş tokuş</div><div class="card-body">İyi veri çalışmasından sonra makul senaryo. Dağıtım kısıtlarına göre azaltma seç (donmuş vs. yeniden eğitilebilir model).</div></div>
<div class="calc-card"><div class="card-title">Değiş tokuş yok</div><div class="card-body">Hiç doğruluk maliyeti olmadan kusursuz adil olabildiğini fark edersen, iki kez kontrol et: yalnızca grupla korelasyon gösteren meşru bir tahmin edici özniteliği kaldırmış olabilirsin.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Üretimde Yöntem Seçimi</h2>
<p class="l-text">Bunları gerçek sistemlerde üç yıl çalıştırmaktan damıtılmış pratik bir karar ağacı:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">S1. Modeli yeniden eğitebiliyor musun?</div><div class="card-body">Hayır → yalnızca son-işleme. Evet → devam et.</div></div>
<div class="calc-card"><div class="card-title">S2. Veri hattını değiştirebiliyor musun?</div><div class="card-body">Hayır → iç-işleme (adversarial / FairBatch / indirgeme). Evet → devam et.</div></div>
<div class="calc-card"><div class="card-title">S3. Korunan öznitelik çıkarımda mevcut mu?</div><div class="card-body">Hayır → yalnızca ön- veya iç-işleme (son-işleme buna ihtiyaç duyar). Evet → üçü de seçenek.</div></div>
<div class="calc-card"><div class="card-title">S4. Kullanım durumu hangi adillik kriterini gerektiriyor?</div><div class="card-body">İstatistiksel parite → yeniden ağırlıklandırma işe yarar. Fırsat eşitliği → Hardt eşik opt. Eşitlenmiş olasılıklar → adversarial. Kalibrasyon + adillik → kalibre EO.</div></div>
</div>

<p class="l-text">Çoğu ekip için doğru başlangıç noktası yeniden ağırlıklandırma + eşik optimizasyonudur (30 satırlık uygulama, yeni altyapı yok). Yalnızca bunlar hedefi karşılayamadığında adversarial debiasing veya indirgemelere mezun olursun. AIF360 (IBM), fairlearn (Microsoft) ve aequitas (CMU) bunları uygular — birini seç ve onunla kal; API'leri proje ortasında geçişi acı verecek kadar farklı.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Özet ve Sonraki</h2>
<p class="l-text">Önyargı azaltma sihir değildir; bilinen maliyet ve kısıtlamalarla küçük, iyi anlaşılmış bir müdahaleler kümesidir. En zor karar hangi algoritma değil — hangi adillik kriterinin yasal, etik ve operasyonel bağlama uyduğudur.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Ön-işleme veriyi düzenler, iç-işleme hedefleri düzenler, son-işleme kararları düzenler.</li>
<li>Yeniden ağırlıklandırma (Kamiran-Calders 2012) en ucuz, en evrensel ön-işleme düzeltmesidir.</li>
<li>Adversarial debiasing (Zhang 2018), uçtan uca yeniden eğitebildiğinde en güçlü iç-işleme aracıdır.</li>
<li>Eşik optimizasyonu (Hardt 2016), donmuş kara-kutu modeller için tek seçenektir — ama grup başına eşikler yasal sorular doğurur.</li>
<li>İmkânsızlık teoremleri (Chouldechova, Kleinberg) kusursuz adilliğin ulaşılamaz olduğu anlamına gelir; neyden vazgeçeceğini sen seçersin.</li>
<li>Keskin adillik-doğruluk değiş tokuşları genellikle eksik öznitelikleri işaret eder, daha süslü algoritma ihtiyacını değil.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L4</strong>, izlemenin açıklanabilirlik yarısını SHAP ile açar — Lundberg &amp; Lee'nin 2017 özellik atfı birleştirmesi. Shapley değerlerini işbirlikçi oyun teorisinden türetir, 5-öznitelikli bir problemde elle uygular, sonra ölçek için TreeSHAP ve KernelSHAP'i kurarız. <strong>L5</strong>, yerel doğrusal açıklamalar için LIME'i (Ribeiro 2016) getirir, <strong>L6</strong>, karşı-olguları (Wachter 2017, DiCE) ele alır, <strong>L7</strong>, Anthropic tarzı mekanistik yorumlanabilirlik ile LLM kara kutusunu açar ve <strong>L8</strong>, tüm parçayı adil-ve-açıklanabilir bir kredi modeliyle taçlandırır.</p>
</div>`
};
