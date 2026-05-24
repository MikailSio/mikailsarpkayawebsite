window.CAUSAL_L5 = {
en: `<p class="l-text">Classical causal inference assumed linear models and a few covariates. Modern data is high-dimensional, non-linear, and heterogeneous — every user has a different treatment effect, and the propensity surface is rarely a logistic regression. The 2017–2019 wave of <strong>causal machine learning</strong> brought sklearn-grade flexibility to causal estimation: random forests adapted for honest causal estimation (Wager &amp; Athey 2018), debiased ML pipelines that combine flexible nuisance estimation with rigorous inference (Chernozhukov et al. 2017), and end-to-end neural networks tailored for counterfactual prediction (TARNet, Dragonnet).</p>
<p class="l-text">This lesson is a guided tour: we implement <em>causal forests</em>, <em>Double Machine Learning</em>, and <em>TARNet-style</em> counterfactual networks from scratch in scikit-learn (with PyTorch demos for the neural variants). We finish with a quick map of the EconML and CausalML libraries that productionize these methods.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Causal forests (Wager &amp; Athey 2018) — honest splitting, sub-sampling, CATE estimation</li>
<li>Double Machine Learning (DML, Chernozhukov 2017) — Neyman-orthogonal moment conditions</li>
<li>TARNet (Shalit 2017) and Dragonnet (Shi 2019) — neural counterfactual prediction</li>
<li>Cross-fitting and why it preserves √n inference rates</li>
<li>EconML and CausalML — production-ready causal libraries</li>
<li>How to validate a causal model when ground truth is unknown</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Why "Causal" ML Is Different</h2>
<p class="l-text">A standard ML pipeline minimizes prediction error on Y. A causal ML pipeline minimizes the mean squared error on the <em>unobserved</em> treatment effect τ(x) = E[Y(1)−Y(0)|X=x]. We never see τ(x) — that's the whole problem. So we need clever estimators whose <em>bias structure</em> we can analyze.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Two ideas dominate modern causal ML: (1) <strong>orthogonalization</strong> — make the estimator insensitive to first-order errors in nuisance functions; (2) <strong>cross-fitting</strong> — split data so estimation and prediction are independent, eliminating overfitting bias.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Causal Forests (Wager &amp; Athey 2018)</h2>
<p class="l-text">A standard random forest splits to minimize MSE on Y. A <strong>causal tree</strong> splits to maximize <em>variance of treatment effect estimates</em> across leaves. <strong>Honest estimation</strong> uses one half of each leaf's data to choose splits and the other half to estimate τ(x).</p>
<div class="katex-block">$$\\hat{\\tau}(x) = \\frac{\\sum_{i \\in L(x)} (T_i - \\bar{T}_L)(Y_i - \\bar{Y}_L)}{\\sum_{i \\in L(x)} (T_i - \\bar{T}_L)^2}$$</div>
<p class="l-text">where L(x) is the leaf containing x. Wager &amp; Athey (2018) prove asymptotic normality, enabling confidence intervals.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — sklearn approximation of causal forest</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Honest causal forest via bootstrap subsampling + T-learner per tree</span>
<span class="kw">def</span> <span class="fn">causal_forest_predict</span>(X_train, T_train, Y_train, X_test, n_trees=<span class="num">200</span>, subsample=<span class="num">0.5</span>, rng=<span class="kw">None</span>):
    rng = rng <span class="kw">or</span> np.random.<span class="fn">RandomState</span>(<span class="num">0</span>)
    n = <span class="fn">len</span>(X_train); preds = np.<span class="fn">zeros</span>((n_trees, <span class="fn">len</span>(X_test)))
    <span class="kw">for</span> b <span class="kw">in</span> <span class="fn">range</span>(n_trees):
        idx = rng.<span class="fn">choice</span>(n, <span class="fn">int</span>(n*subsample), replace=<span class="kw">False</span>)
        Xb, Tb, Yb = X_train[idx], T_train[idx], Y_train[idx]
        <span class="kw">if</span> Tb.<span class="fn">sum</span>() &lt; <span class="num">5</span> <span class="kw">or</span> (<span class="num">1</span>-Tb).<span class="fn">sum</span>() &lt; <span class="num">5</span>:
            preds[b] = <span class="num">0</span>; <span class="kw">continue</span>
        m1 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">1</span>, max_depth=<span class="num">6</span>, random_state=b).<span class="fn">fit</span>(Xb[Tb==<span class="num">1</span>], Yb[Tb==<span class="num">1</span>])
        m0 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">1</span>, max_depth=<span class="num">6</span>, random_state=b).<span class="fn">fit</span>(Xb[Tb==<span class="num">0</span>], Yb[Tb==<span class="num">0</span>])
        preds[b] = m1.<span class="fn">predict</span>(X_test) - m0.<span class="fn">predict</span>(X_test)
    tau = preds.<span class="fn">mean</span>(axis=<span class="num">0</span>)
    se = preds.<span class="fn">std</span>(axis=<span class="num">0</span>) / np.<span class="fn">sqrt</span>(n_trees)
    <span class="kw">return</span> tau, se

tau, se = <span class="fn">causal_forest_predict</span>(X, T, Y, X)
<span class="fn">print</span>(f<span class="str">"Mean CATE: {tau.mean():+.4f}  (95% CI half-width: ±{1.96*se.mean():.4f})"</span>)
<span class="fn">print</span>(f<span class="str">"CATE std across users: {tau.std():.4f}  -&gt; heterogeneous effect"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines <code>causal_forest_predict</code>, which loops over <code>n_trees</code> bootstrap subsamples (50% of the rows each). 2) inside each iteration trains a tiny T-learner — one <code>RandomForestRegressor(n_estimators=1, max_depth=6)</code> on the treated subsample and another on the controls — and stores the per-tree CATE difference for every test row. 3) aggregates the per-tree predictions: <code>tau</code> is the mean across trees and <code>se</code> is the across-tree standard deviation divided by <code>sqrt(n_trees)</code>, giving a CATE estimate with an honest-style standard error.</p>
<p class="l-text">The real <code>grf</code> R package and <code>econml.dml.CausalForestDML</code> implement honest splitting; this sklearn version captures the bootstrap-aggregation core.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Double Machine Learning (DML)</h2>
<p class="l-text">Chernozhukov et al. (2017) — "Double/Debiased ML". Idea: residualize both Y and T with respect to X using flexible ML, then regress residuals.</p>
<div class="katex-block">$$\\tilde{Y} = Y - \\hat{\\ell}(X), \\qquad \\tilde{T} = T - \\hat{m}(X), \\qquad \\hat{\\theta} = \\frac{E[\\tilde{T}\\tilde{Y}]}{E[\\tilde{T}^2]}$$</div>
<p class="l-text">Where ℓ(x)=E[Y|X] and m(x)=E[T|X]=propensity. Cross-fitting (k-fold splits) ensures the residual estimators don't see the data they predict on. The result has √n rates and is asymptotically normal even when ML estimators converge slowly.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor, RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_predict

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Cross-fitted nuisance predictions (5-fold)</span>
mY = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>)
mT = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>)
y_hat = <span class="fn">cross_val_predict</span>(mY, X, Y, cv=<span class="num">5</span>)
t_hat = <span class="fn">cross_val_predict</span>(mT, X, T, cv=<span class="num">5</span>, method=<span class="str">'predict_proba'</span>)[:,<span class="num">1</span>]

<span class="cm"># Residuals</span>
y_res = Y - y_hat
t_res = T - t_hat

<span class="cm"># DML estimate of theta (the causal effect)</span>
theta = (t_res * y_res).<span class="fn">sum</span>() / (t_res**<span class="num">2</span>).<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"DML ATE estimate: {theta:+.4f}"</span>)

<span class="cm"># Standard error</span>
n = <span class="fn">len</span>(Y)
se = np.<span class="fn">sqrt</span>(((y_res - theta*t_res)**<span class="num">2</span>).<span class="fn">mean</span>() / ((t_res**<span class="num">2</span>).<span class="fn">mean</span>()**<span class="num">2</span> * n))
<span class="fn">print</span>(f<span class="str">"Standard error:   {se:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"95% CI:           [{theta-1.96*se:+.4f}, {theta+1.96*se:+.4f}]"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) uses <code>cross_val_predict(cv=5)</code> to get out-of-fold predictions <code>y_hat</code> from a random-forest regressor for Y and <code>t_hat</code> from a random-forest classifier for T, which is the cross-fitting step that breaks data leakage. 2) builds the orthogonalized residuals <code>y_res = Y − y_hat</code> and <code>t_res = T − t_hat</code> and computes the DML coefficient <code>theta = sum(t_res·y_res)/sum(t_res²)</code>. 3) computes a sandwich-style standard error from the residual mean square divided by the squared mean of <code>t_res²</code> times <code>n</code>, and reports the 95% confidence interval.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">DML's superpower: <strong>Neyman orthogonality</strong>. Small errors in ℓ̂ and m̂ enter the estimator only through their product, so an n^(-1/4) error in each yields n^(-1/2) bias in θ̂. This is what makes √n inference work with ML nuisance.</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. TARNet — Treatment-Agnostic Representation Network</h2>
<p class="l-text">Shalit, Johansson &amp; Sontag (2017) — neural net with two heads (one per treatment) sharing a representation φ(x). The shared trunk learns a representation that is balanced across treatment groups; the heads predict potential outcomes.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shared trunk φ(x)</div><div class="card-body">Several dense layers learning a treatment-agnostic representation.</div></div>
<div class="calc-card"><div class="card-title">Two heads h₀, h₁</div><div class="card-body">Predict Y(0) and Y(1) from φ(x). Trained on factual outcomes only.</div></div>
<div class="calc-card"><div class="card-title">IPM regularizer</div><div class="card-body">Wasserstein or MMD between φ(X|T=1) and φ(X|T=0) — balances representations.</div></div>
<div class="calc-card"><div class="card-title">CATE estimate</div><div class="card-body">τ̂(x) = h₁(φ(x)) − h₀(φ(x)).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (PyTorch not in pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TARNet</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, d_in, d_h=<span class="num">64</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.phi = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(d_in,d_h), nn.<span class="fn">ReLU</span>(),
                                 nn.<span class="fn">Linear</span>(d_h,d_h), nn.<span class="fn">ReLU</span>())
        <span class="kw">self</span>.h0  = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(d_h,d_h), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">Linear</span>(d_h,<span class="num">1</span>))
        <span class="kw">self</span>.h1  = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(d_h,d_h), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">Linear</span>(d_h,<span class="num">1</span>))
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, t):
        z = <span class="kw">self</span>.<span class="fn">phi</span>(x)
        <span class="kw">return</span> torch.<span class="fn">where</span>(t==<span class="num">1</span>, <span class="kw">self</span>.<span class="fn">h1</span>(z), <span class="kw">self</span>.<span class="fn">h0</span>(z)), z

<span class="cm"># Loss = factual MSE + lambda * IPM(z|T=0, z|T=1)</span>
<span class="cm"># Train; predict CATE as h1(phi(x)) - h0(phi(x))</span>
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines a <code>TARNet</code> module whose constructor builds a shared trunk <code>phi</code> (two Linear+ReLU blocks) plus two outcome heads <code>h0</code> and <code>h1</code>. 2) in <code>forward</code>, runs the input through <code>phi</code> to obtain the latent <code>z</code> and selects between <code>h1(z)</code> and <code>h0(z)</code> based on the treatment indicator <code>t</code>. 3) the comments sketch the training loop: factual MSE plus an IPM penalty to balance <code>z|T=0</code> against <code>z|T=1</code>, with the CATE recovered at inference time as <code>h1(phi(x)) − h0(phi(x))</code>.</p>
<p class="l-text">Pyodide-runnable sklearn equivalent (T-learner with neural-style depth via gradient boosting):</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># T-learner = TARNet's two-head idea, in sklearn form</span>
m1 = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">200</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
m0 = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">200</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
cate = m1.<span class="fn">predict</span>(X) - m0.<span class="fn">predict</span>(X)
<span class="fn">print</span>(f<span class="str">"CATE (T-learner): mean={cate.mean():+.4f}, std={cate.std():.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) mimics TARNet's two-head idea with sklearn: fits one <code>GradientBoostingRegressor</code> on the treated rows (the <code>h1</code> head) and one on the controls (the <code>h0</code> head). 2) predicts both potential outcomes for every row and forms the CATE as <code>m1.predict(X) − m0.predict(X)</code>. 3) prints the mean and standard deviation of the CATE so you can read off both the average effect and the amount of heterogeneity across users.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Dragonnet (Shi et al. 2019)</h2>
<p class="l-text">Dragonnet adds a third head: the propensity score, sharing the same representation as the outcome heads. The architecture <em>jointly</em> learns φ, μ₀, μ₁, and e(x). The targeted-regularization trick (van der Laan &amp; Rose 2011) gives a doubly robust estimator with neural nuisance.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Shared φ(x)</div><div class="card-body">Same trunk as TARNet.</div></div>
<div class="calc-card"><div class="card-title">Outcome heads h₀, h₁</div><div class="card-body">Same as TARNet.</div></div>
<div class="calc-card"><div class="card-title">Propensity head ê(x)</div><div class="card-body">Logistic head off the same φ. Forces the representation to retain treatment-relevant info.</div></div>
<div class="calc-card"><div class="card-title">Targeted regularization</div><div class="card-body">Final fluctuation step shifts μ̂_t to satisfy efficient influence function = 0. Yields semi-parametric efficiency.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Use TARNet/Dragonnet when (a) X is high-dimensional (images, text), (b) treatment effect is highly heterogeneous, (c) you have GPU and 10K+ samples. For small tabular data, DML + GBM is usually competitive.</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Validating a Causal Model</h2>
<p class="l-text">No ground truth for τ(x), so we use indirect validators:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Refutation tests</div><div class="card-body">Add a placebo treatment, a random common cause, or randomly subsample — estimate should be robust (dowhy <code>refute_estimate</code>).</div></div>
<div class="calc-card"><div class="card-title">Sensitivity analysis</div><div class="card-body">Rosenbaum bounds, E-values (VanderWeele 2017): how strong an unobserved confounder would need to be to nullify the result.</div></div>
<div class="calc-card"><div class="card-title">Holdout R-loss</div><div class="card-body">Nie &amp; Wager (2021): R-loss = mean of (Y_res − τ̂(X) T_res)². Validates τ̂ on out-of-sample residuals.</div></div>
<div class="calc-card"><div class="card-title">Synthetic benchmarks</div><div class="card-body">IHDP, Twins, ACIC datasets — known τ(x); test which method recovers it.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor, RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_predict, KFold

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

y_hat = <span class="fn">cross_val_predict</span>(<span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>), X, Y, cv=<span class="num">5</span>)
t_hat = <span class="fn">cross_val_predict</span>(<span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>), X, T, cv=<span class="num">5</span>, method=<span class="str">'predict_proba'</span>)[:,<span class="num">1</span>]

<span class="cm"># Naive constant CATE = ATE</span>
ate = ((Y - y_hat) * (T - t_hat)).<span class="fn">sum</span>() / ((T-t_hat)**<span class="num">2</span>).<span class="fn">sum</span>()
r_loss_const = (((Y - y_hat) - ate*(T - t_hat))**<span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"R-loss with constant CATE = ATE: {r_loss_const:.4f}"</span>)

<span class="cm"># Heterogeneous CATE (T-learner)</span>
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor
m1 = <span class="fn">GradientBoostingRegressor</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
m0 = <span class="fn">GradientBoostingRegressor</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
cate = m1.<span class="fn">predict</span>(X) - m0.<span class="fn">predict</span>(X)
r_loss_het = (((Y - y_hat) - cate*(T - t_hat))**<span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"R-loss with heterogeneous CATE:  {r_loss_het:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Lower is better — heterogeneity helps if R-loss drops."</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) obtains cross-fitted nuisance predictions <code>y_hat</code> and <code>t_hat</code> with <code>cross_val_predict(cv=5)</code> using random-forest models. 2) computes a constant-CATE baseline (the DML ATE) and its R-loss <code>mean((Y − y_hat − ATE·(T − t_hat))²)</code>. 3) fits a heterogeneous T-learner with <code>GradientBoostingRegressor</code>, plugs its row-wise CATE into the same R-loss formula, and compares — a smaller R-loss means heterogeneity is real and the model captures it.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. EconML and CausalML — Production Libraries</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Microsoft EconML</div><div class="card-body">DML, CausalForestDML, DR-learner, meta-learners (S/T/X), Orthogonal Random Forest. sklearn-compatible API.</div></div>
<div class="calc-card"><div class="card-title">Uber CausalML</div><div class="card-body">Meta-learners, R-learner, uplift trees, propensity-score methods. Integrates with XGBoost/LightGBM.</div></div>
<div class="calc-card"><div class="card-title">DoWhy</div><div class="card-body">Identification engine + estimation + refutation. Covers full causal pipeline including graph specification.</div></div>
<div class="calc-card"><div class="card-title">Stanford grf (R)</div><div class="card-body">Reference implementation of generalized random forests. The original Wager-Athey codebase.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (econml not in pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> econml.dml <span class="kw">import</span> CausalForestDML
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor, RandomForestClassifier

est = <span class="fn">CausalForestDML</span>(
    model_y=<span class="fn">RandomForestRegressor</span>(),
    model_t=<span class="fn">RandomForestClassifier</span>(),
    discrete_treatment=<span class="kw">True</span>,
    n_estimators=<span class="num">500</span>,
)
est.<span class="fn">fit</span>(Y, T, X=X)
cate = est.<span class="fn">effect</span>(X)
ci = est.<span class="fn">effect_interval</span>(X, alpha=<span class="num">0.05</span>)
<span class="fn">print</span>(<span class="str">"Mean CATE:"</span>, cate.<span class="fn">mean</span>(), <span class="str">"  CI width:"</span>, (ci[<span class="num">1</span>]-ci[<span class="num">0</span>]).<span class="fn">mean</span>())
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) constructs an EconML <code>CausalForestDML</code> estimator, plugging a <code>RandomForestRegressor</code> as <code>model_y</code> and a <code>RandomForestClassifier</code> as <code>model_t</code> with <code>discrete_treatment=True</code> and 500 trees. 2) calls <code>est.fit(Y, T, X=X)</code> to cross-fit the nuisance models and train the causal forest. 3) reads off per-row CATEs with <code>est.effect(X)</code> and 95% intervals with <code>est.effect_interval(X, alpha=0.05)</code>, then prints the mean CATE and the average interval width.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Heterogeneous Effects on Churn</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

m1 = <span class="fn">GradientBoostingRegressor</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
m0 = <span class="fn">GradientBoostingRegressor</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
df[<span class="str">'cate'</span>] = m1.<span class="fn">predict</span>(X) - m0.<span class="fn">predict</span>(X)

<span class="cm"># Which segments benefit most?</span>
df[<span class="str">'tenure_bin'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">12</span>,<span class="num">36</span>,<span class="num">100</span>], labels=[<span class="str">'new'</span>,<span class="str">'mid'</span>,<span class="str">'loyal'</span>])
<span class="fn">print</span>(<span class="str">"Average CATE by tenure segment:"</span>)
<span class="fn">print</span>(df.<span class="fn">groupby</span>(<span class="str">'tenure_bin'</span>, observed=<span class="kw">True</span>)[<span class="str">'cate'</span>].<span class="fn">agg</span>([<span class="str">'mean'</span>,<span class="str">'std'</span>,<span class="str">'count'</span>]))

<span class="cm"># Targeting policy: treat only users with predicted negative effect on churn</span>
df[<span class="str">'recommend_treat'</span>] = df[<span class="str">'cate'</span>] &lt; -<span class="num">0.02</span>
<span class="fn">print</span>(f<span class="str">"\\nWould recommend treating {df['recommend_treat'].sum()} of {len(df)} users"</span>)
<span class="fn">print</span>(f<span class="str">"Their average predicted churn reduction: {-df[df['recommend_treat']]['cate'].mean():.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fits a T-learner with two <code>GradientBoostingRegressor</code> models and stores the per-row CATE in <code>df['cate']</code>. 2) bins <code>tenure_months</code> into <em>new / mid / loyal</em> and prints mean, std and count of the CATE inside each tenure segment to show which subgroup benefits most. 3) builds a targeting policy <code>recommend_treat = cate &lt; −0.02</code>, prints how many users would be treated, and reports their average predicted churn reduction.</p>
<p class="l-text">This is the practical payoff: instead of treating everyone, target only the segment where the predicted causal effect is meaningful. In Lesson 6 we apply these tools to NLP fairness — measuring causally how much a classifier's decision changes when a sensitive attribute is intervened on.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Reading List</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Wager &amp; Athey (2018) "Estimation and Inference of Heterogeneous Treatment Effects using Random Forests", JASA. Chernozhukov et al. (2017) "Double/Debiased Machine Learning", arXiv. Shalit, Johansson &amp; Sontag (2017) "Estimating individual treatment effect: generalization bounds", ICML. Shi, Blei &amp; Veitch (2019) "Adapting neural networks for the estimation of treatment effects", NeurIPS. Künzel et al. (2019) "Metalearners for estimating heterogeneous treatment effects", PNAS.</div>
</div>`,
tr: `<p class="l-text">Klasik nedensel çıkarım doğrusal modelleri ve birkaç ortak değişkeni varsayıyordu. Modern veri yüksek boyutlu, doğrusal olmayan ve heterojendir — her kullanıcının farklı bir tedavi etkisi vardır ve eğilim yüzeyi nadiren bir lojistik regresyondur. 2017–2019 <strong>nedensel makine öğrenmesi</strong> dalgası nedensel tahmine sklearn-kalitesinde esneklik getirdi: dürüst nedensel tahmin için uyarlanmış rastgele ormanlar (Wager &amp; Athey 2018), esnek yardımcı tahmini titiz çıkarımla birleştiren yanlılık-giderici ML pipeline'ları (Chernozhukov ve ark. 2017) ve karşı-olgu tahmini için özel hazırlanmış uçtan uca sinir ağları (TARNet, Dragonnet).</p>
<p class="l-text">Bu ders rehberli bir tür: <em>nedensel ormanları</em>, <em>Çift Makine Öğrenmesi</em>'ni ve <em>TARNet-tarzı</em> karşı-olgu ağlarını scikit-learn'de sıfırdan uyguluyoruz (sinirsel varyantlar için PyTorch demoları ile). Bu yöntemleri üretime taşıyan EconML ve CausalML kütüphanelerinin hızlı bir haritasıyla bitiriyoruz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Nedensel ormanlar (Wager &amp; Athey 2018) — dürüst bölme, alt-örnekleme, CATE tahmini</li>
<li>Çift Makine Öğrenmesi (DML, Chernozhukov 2017) — Neyman-ortogonal moment koşulları</li>
<li>TARNet (Shalit 2017) ve Dragonnet (Shi 2019) — sinirsel karşı-olgu tahmini</li>
<li>Çapraz uydurma ve neden √n çıkarım oranlarını koruduğu</li>
<li>EconML ve CausalML — üretime hazır nedensel kütüphaneler</li>
<li>Gerçek değer bilinmediğinde nedensel bir model nasıl doğrulanır</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. "Nedensel" ML Neden Farklıdır</h2>
<p class="l-text">Standart bir ML pipeline'ı Y üzerindeki tahmin hatasını minimize eder. Bir nedensel ML pipeline'ı, <em>gözlemlenmemiş</em> tedavi etkisi τ(x) = E[Y(1)−Y(0)|X=x] üzerindeki ortalama kare hatayı minimize eder. τ(x)'i asla göremeyiz — tüm sorun budur. Bu yüzden <em>yanlılık yapısını</em> analiz edebileceğimiz akıllı tahmin edicilere ihtiyacımız var.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Modern nedensel ML'de iki fikir hakimdir: (1) <strong>ortogonalleştirme</strong> — tahmin ediciyi yardımcı fonksiyonlardaki birinci-derece hatalara karşı duyarsız hale getirmek; (2) <strong>çapraz uydurma</strong> — tahmin ve öngörünün bağımsız olması için veriyi böl, aşırı uydurma yanlılığını ortadan kaldır.</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Nedensel Ormanlar (Wager &amp; Athey 2018)</h2>
<p class="l-text">Standart bir rastgele orman Y üzerindeki MSE'yi minimize etmek için böler. Bir <strong>nedensel ağaç</strong>, yapraklar arasındaki <em>tedavi etkisi tahminlerinin varyansını</em> maksimize etmek için böler. <strong>Dürüst tahmin</strong>, her yaprağın verisinin yarısını bölmeleri seçmek için, diğer yarısını τ(x)'i tahmin etmek için kullanır.</p>
<div class="katex-block">$$\\hat{\\tau}(x) = \\frac{\\sum_{i \\in L(x)} (T_i - \\bar{T}_L)(Y_i - \\bar{Y}_L)}{\\sum_{i \\in L(x)} (T_i - \\bar{T}_L)^2}$$</div>
<p class="l-text">L(x) x'i içeren yapraktır. Wager &amp; Athey (2018) asimptotik normalliği kanıtlar, güven aralıklarına olanak sağlar.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON — sklearn approximation of causal forest</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Honest causal forest via bootstrap subsampling + T-learner per tree</span>
<span class="kw">def</span> <span class="fn">causal_forest_predict</span>(X_train, T_train, Y_train, X_test, n_trees=<span class="num">200</span>, subsample=<span class="num">0.5</span>, rng=<span class="kw">None</span>):
    rng = rng <span class="kw">or</span> np.random.<span class="fn">RandomState</span>(<span class="num">0</span>)
    n = <span class="fn">len</span>(X_train); preds = np.<span class="fn">zeros</span>((n_trees, <span class="fn">len</span>(X_test)))
    <span class="kw">for</span> b <span class="kw">in</span> <span class="fn">range</span>(n_trees):
        idx = rng.<span class="fn">choice</span>(n, <span class="fn">int</span>(n*subsample), replace=<span class="kw">False</span>)
        Xb, Tb, Yb = X_train[idx], T_train[idx], Y_train[idx]
        <span class="kw">if</span> Tb.<span class="fn">sum</span>() &lt; <span class="num">5</span> <span class="kw">or</span> (<span class="num">1</span>-Tb).<span class="fn">sum</span>() &lt; <span class="num">5</span>:
            preds[b] = <span class="num">0</span>; <span class="kw">continue</span>
        m1 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">1</span>, max_depth=<span class="num">6</span>, random_state=b).<span class="fn">fit</span>(Xb[Tb==<span class="num">1</span>], Yb[Tb==<span class="num">1</span>])
        m0 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">1</span>, max_depth=<span class="num">6</span>, random_state=b).<span class="fn">fit</span>(Xb[Tb==<span class="num">0</span>], Yb[Tb==<span class="num">0</span>])
        preds[b] = m1.<span class="fn">predict</span>(X_test) - m0.<span class="fn">predict</span>(X_test)
    tau = preds.<span class="fn">mean</span>(axis=<span class="num">0</span>)
    se = preds.<span class="fn">std</span>(axis=<span class="num">0</span>) / np.<span class="fn">sqrt</span>(n_trees)
    <span class="kw">return</span> tau, se

tau, se = <span class="fn">causal_forest_predict</span>(X, T, Y, X)
<span class="fn">print</span>(f<span class="str">"Mean CATE: {tau.mean():+.4f}  (95% CI half-width: ±{1.96*se.mean():.4f})"</span>)
<span class="fn">print</span>(f<span class="str">"CATE std across users: {tau.std():.4f}  -&gt; heterogeneous effect"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>causal_forest_predict</code> tanımlanıyor; her seferinde satırların %50'sini çeken <code>n_trees</code> bootstrap alt-örnekleme döngüsü kuruyor. 2) her iterasyonda küçük bir T-öğrenici eğitiyor — tedavi edilen alt-örneklem için bir <code>RandomForestRegressor(n_estimators=1, max_depth=6)</code> ve kontroller için bir başka — ve her test satırı için ağaç-başına CATE farkını saklıyor. 3) ağaç-başına tahminleri agrega ediyor: <code>tau</code> ağaçlar arası ortalama, <code>se</code> ağaçlar arası standart sapmanın <code>sqrt(n_trees)</code>'a bölümü; sonuç dürüst-tarz standart hataya sahip bir CATE tahminidir.</p>
<p class="l-text">Gerçek <code>grf</code> R paketi ve <code>econml.dml.CausalForestDML</code> dürüst bölmeyi uygular; bu sklearn versiyonu önyükleme-toplama çekirdeğini yakalar.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Çift Makine Öğrenmesi (DML)</h2>
<p class="l-text">Chernozhukov ve ark. (2017) — "Çift/Yanlılığı Giderilmiş ML". Fikir: hem Y'yi hem T'yi esnek ML kullanarak X'e göre kalıntılaştır, sonra kalıntıları regresyonla.</p>
<div class="katex-block">$$\\tilde{Y} = Y - \\hat{\\ell}(X), \\qquad \\tilde{T} = T - \\hat{m}(X), \\qquad \\hat{\\theta} = \\frac{E[\\tilde{T}\\tilde{Y}]}{E[\\tilde{T}^2]}$$</div>
<p class="l-text">Burada ℓ(x)=E[Y|X] ve m(x)=E[T|X]=eğilim. Çapraz uydurma (k-katlı bölmeler), kalıntı tahmin edicilerinin tahmin yaptıkları veriyi görmemesini sağlar. Sonuç, ML tahmin edicileri yavaş yakınsadığında bile √n oranlarına sahiptir ve asimptotik olarak normaldir.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor, RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_predict

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Cross-fitted nuisance predictions (5-fold)</span>
mY = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>)
mT = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>)
y_hat = <span class="fn">cross_val_predict</span>(mY, X, Y, cv=<span class="num">5</span>)
t_hat = <span class="fn">cross_val_predict</span>(mT, X, T, cv=<span class="num">5</span>, method=<span class="str">'predict_proba'</span>)[:,<span class="num">1</span>]

<span class="cm"># Residuals</span>
y_res = Y - y_hat
t_res = T - t_hat

<span class="cm"># DML estimate of theta (the causal effect)</span>
theta = (t_res * y_res).<span class="fn">sum</span>() / (t_res**<span class="num">2</span>).<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"DML ATE estimate: {theta:+.4f}"</span>)

<span class="cm"># Standard error</span>
n = <span class="fn">len</span>(Y)
se = np.<span class="fn">sqrt</span>(((y_res - theta*t_res)**<span class="num">2</span>).<span class="fn">mean</span>() / ((t_res**<span class="num">2</span>).<span class="fn">mean</span>()**<span class="num">2</span> * n))
<span class="fn">print</span>(f<span class="str">"Standard error:   {se:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"95% CI:           [{theta-1.96*se:+.4f}, {theta+1.96*se:+.4f}]"</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>cross_val_predict(cv=5)</code> ile Y için rastgele orman regresörünün out-of-fold tahminleri <code>y_hat</code> ve T için rastgele orman sınıflandırıcısının <code>t_hat</code> alınıyor; bu adım veri sızıntısını kıran çapraz uydurma. 2) ortogonalleştirilmiş kalıntılar <code>y_res = Y − y_hat</code> ve <code>t_res = T − t_hat</code> oluşturulup DML katsayısı <code>theta = sum(t_res·y_res)/sum(t_res²)</code> hesaplanıyor. 3) <code>t_res²</code>'nin karelenmiş ortalaması ile <code>n</code>'in çarpımı paydaya alınarak sandviç-tarz bir standart hata bulunuyor ve %95 güven aralığı raporlanıyor.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">DML'in süper gücü: <strong>Neyman ortogonalliği</strong>. ℓ ve m'deki küçük hatalar, tahmin ediciye yalnızca çarpımları üzerinden girer, dolayısıyla her birindeki n^(-1/4) hata, θ'da n^(-1/2) yanlılığa yol açar. ML yardımcı ile √n çıkarımının çalışmasını sağlayan budur.</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. TARNet — Tedaviden-Bağımsız Temsil Ağı</h2>
<p class="l-text">Shalit, Johansson &amp; Sontag (2017) — bir φ(x) temsilini paylaşan iki başlı (her tedavi için bir tane) sinir ağı. Paylaşılan gövde, tedavi grupları arasında dengelenmiş bir temsil öğrenir; başlar potansiyel sonuçları tahmin eder.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Paylaşılan gövde φ(x)</div><div class="card-body">Tedaviden-bağımsız bir temsil öğrenen birkaç yoğun katman.</div></div>
<div class="calc-card"><div class="card-title">İki baş h₀, h₁</div><div class="card-body">φ(x)'ten Y(0) ve Y(1)'i tahmin eder. Sadece olgusal sonuçlar üzerinde eğitilir.</div></div>
<div class="calc-card"><div class="card-title">IPM düzenleyici</div><div class="card-body">φ(X|T=1) ve φ(X|T=0) arasındaki Wasserstein veya MMD — temsilleri dengeler.</div></div>
<div class="calc-card"><div class="card-title">CATE tahmini</div><div class="card-body">τ(x) = h₁(φ(x)) − h₀(φ(x)).</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (PyTorch not in pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> torch
<span class="kw">import</span> torch.nn <span class="kw">as</span> nn

<span class="kw">class</span> <span class="fn">TARNet</span>(nn.Module):
    <span class="kw">def</span> <span class="fn">__init__</span>(<span class="kw">self</span>, d_in, d_h=<span class="num">64</span>):
        <span class="fn">super</span>().<span class="fn">__init__</span>()
        <span class="kw">self</span>.phi = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(d_in,d_h), nn.<span class="fn">ReLU</span>(),
                                 nn.<span class="fn">Linear</span>(d_h,d_h), nn.<span class="fn">ReLU</span>())
        <span class="kw">self</span>.h0  = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(d_h,d_h), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">Linear</span>(d_h,<span class="num">1</span>))
        <span class="kw">self</span>.h1  = nn.<span class="fn">Sequential</span>(nn.<span class="fn">Linear</span>(d_h,d_h), nn.<span class="fn">ReLU</span>(), nn.<span class="fn">Linear</span>(d_h,<span class="num">1</span>))
    <span class="kw">def</span> <span class="fn">forward</span>(<span class="kw">self</span>, x, t):
        z = <span class="kw">self</span>.<span class="fn">phi</span>(x)
        <span class="kw">return</span> torch.<span class="fn">where</span>(t==<span class="num">1</span>, <span class="kw">self</span>.<span class="fn">h1</span>(z), <span class="kw">self</span>.<span class="fn">h0</span>(z)), z

<span class="cm"># Loss = factual MSE + lambda * IPM(z|T=0, z|T=1)</span>
<span class="cm"># Train; predict CATE as h1(phi(x)) - h0(phi(x))</span>
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) constructor'ı paylaşılan gövde <code>phi</code>'yi (iki Linear+ReLU bloğu) ve iki sonuç başı <code>h0</code> ile <code>h1</code>'i kuran bir <code>TARNet</code> modülü tanımlanıyor. 2) <code>forward</code>'da girdi <code>phi</code>'den geçirilip latent <code>z</code> elde ediliyor ve tedavi göstergesi <code>t</code>'ye göre <code>h1(z)</code> veya <code>h0(z)</code> seçiliyor. 3) yorumlar eğitim döngüsünü kabaca anlatıyor: olgusal MSE artı <code>z|T=0</code>'ı <code>z|T=1</code>'e dengelemek için bir IPM cezası, ve çıkarımda CATE <code>h1(phi(x)) − h0(phi(x))</code> olarak okunuyor.</p>
<p class="l-text">Pyodide-çalıştırılabilir sklearn eşdeğeri (gradyan güçlendirme yoluyla sinirsel-tarz derinlikte T-öğrenici):</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># T-learner = TARNet's two-head idea, in sklearn form</span>
m1 = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">200</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
m0 = <span class="fn">GradientBoostingRegressor</span>(n_estimators=<span class="num">200</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
cate = m1.<span class="fn">predict</span>(X) - m0.<span class="fn">predict</span>(X)
<span class="fn">print</span>(f<span class="str">"CATE (T-learner): mean={cate.mean():+.4f}, std={cate.std():.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) TARNet'in iki-başlı fikrini sklearn ile taklit ediyor: tedavi edilen satırlar üzerinde bir <code>GradientBoostingRegressor</code> (<code>h1</code> başı), kontroller üzerinde bir başka (<code>h0</code> başı) fit ediyor. 2) her satır için iki potansiyel sonucu da tahmin edip CATE'yi <code>m1.predict(X) − m0.predict(X)</code> olarak kuruyor. 3) CATE'nin ortalamasını ve standart sapmasını yazdırıyor; böylece hem ortalama etkiyi hem de kullanıcılar arasındaki heterojenlik miktarını aynı anda okuyabiliyorsun.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Dragonnet (Shi ve ark. 2019)</h2>
<p class="l-text">Dragonnet üçüncü bir baş ekler: sonuç başlarıyla aynı temsili paylaşan eğilim skoru. Mimari, φ, μ₀, μ₁ ve e(x)'i <em>ortaklaşa</em> öğrenir. Hedeflenmiş düzenleme numarası (van der Laan &amp; Rose 2011), sinirsel yardımcı ile çift sağlam bir tahmin edici verir.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Paylaşılan φ(x)</div><div class="card-body">TARNet ile aynı gövde.</div></div>
<div class="calc-card"><div class="card-title">Sonuç başları h₀, h₁</div><div class="card-body">TARNet ile aynı.</div></div>
<div class="calc-card"><div class="card-title">Eğilim başı ê(x)</div><div class="card-body">Aynı φ'den lojistik baş. Temsilin tedavi-ilgili bilgiyi koruması için zorlar.</div></div>
<div class="calc-card"><div class="card-title">Hedeflenmiş düzenleme</div><div class="card-body">Son dalgalanma adımı, μ_t'yi etkili etki fonksiyonu = 0 olacak şekilde kaydırır. Yarı-parametrik verimlilik sağlar.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">TARNet/Dragonnet'i şu durumlarda kullan: (a) X yüksek boyutluysa (görüntüler, metin), (b) tedavi etkisi yüksek heterojense, (c) GPU ve 10K+ örneklemin varsa. Küçük tablo veriler için DML + GBM genellikle rekabetçidir.</div>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Nedensel Bir Modeli Doğrulamak</h2>
<p class="l-text">τ(x) için gerçek değer yok, dolayısıyla dolaylı doğrulayıcılar kullanırız:</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Çürütme testleri</div><div class="card-body">Plasebo bir tedavi, rastgele bir ortak neden ekleyin veya rastgele alt-örnekleyin — tahmin sağlam olmalı (dowhy <code>refute_estimate</code>).</div></div>
<div class="calc-card"><div class="card-title">Duyarlılık analizi</div><div class="card-body">Rosenbaum sınırları, E-değerleri (VanderWeele 2017): sonucu geçersiz kılmak için gözlenmemiş bir karıştırıcının ne kadar güçlü olması gerektiği.</div></div>
<div class="calc-card"><div class="card-title">Tutma R-kaybı</div><div class="card-body">Nie &amp; Wager (2021): R-kaybı = (Y_kal − τ(X) T_kal)² ortalaması. τ'yi örneklem-dışı kalıntılar üzerinde doğrular.</div></div>
<div class="calc-card"><div class="card-title">Sentetik karşılaştırmalar</div><div class="card-body">IHDP, Twins, ACIC veri setleri — bilinen τ(x); hangi yöntemin onu kurtardığını test et.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor, RandomForestClassifier
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_predict, KFold

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

y_hat = <span class="fn">cross_val_predict</span>(<span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>), X, Y, cv=<span class="num">5</span>)
t_hat = <span class="fn">cross_val_predict</span>(<span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>), X, T, cv=<span class="num">5</span>, method=<span class="str">'predict_proba'</span>)[:,<span class="num">1</span>]

<span class="cm"># Naive constant CATE = ATE</span>
ate = ((Y - y_hat) * (T - t_hat)).<span class="fn">sum</span>() / ((T-t_hat)**<span class="num">2</span>).<span class="fn">sum</span>()
r_loss_const = (((Y - y_hat) - ate*(T - t_hat))**<span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"R-loss with constant CATE = ATE: {r_loss_const:.4f}"</span>)

<span class="cm"># Heterogeneous CATE (T-learner)</span>
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor
m1 = <span class="fn">GradientBoostingRegressor</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
m0 = <span class="fn">GradientBoostingRegressor</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
cate = m1.<span class="fn">predict</span>(X) - m0.<span class="fn">predict</span>(X)
r_loss_het = (((Y - y_hat) - cate*(T - t_hat))**<span class="num">2</span>).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"R-loss with heterogeneous CATE:  {r_loss_het:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Lower is better — heterogeneity helps if R-loss drops."</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>cross_val_predict(cv=5)</code> ile rastgele orman modellerinden çapraz uydurulmuş yardımcı tahminler <code>y_hat</code> ve <code>t_hat</code> alınıyor. 2) sabit-CATE temeli (DML ATE) ve onun R-kaybı <code>mean((Y − y_hat − ATE·(T − t_hat))²)</code> hesaplanıyor. 3) <code>GradientBoostingRegressor</code> ile heterojen bir T-öğrenici fit edilip satır-bazlı CATE aynı R-kaybı formülüne takılıyor ve iki sayı karşılaştırılıyor — daha küçük R-kaybı heterojenliğin gerçek olduğunu ve modelin onu yakaladığını gösterir.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. EconML ve CausalML — Üretim Kütüphaneleri</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Microsoft EconML</div><div class="card-body">DML, CausalForestDML, DR-öğrenici, meta-öğreniciler (S/T/X), Ortogonal Rastgele Orman. sklearn-uyumlu API.</div></div>
<div class="calc-card"><div class="card-title">Uber CausalML</div><div class="card-body">Meta-öğreniciler, R-öğrenici, uplift ağaçları, eğilim-skoru yöntemleri. XGBoost/LightGBM ile entegre olur.</div></div>
<div class="calc-card"><div class="card-title">DoWhy</div><div class="card-body">Tanımlama motoru + tahmin + çürütme. Graf belirtimi dahil tüm nedensel pipeline'ı kapsar.</div></div>
<div class="calc-card"><div class="card-title">Stanford grf (R)</div><div class="card-body">Genelleştirilmiş rastgele ormanların referans uygulaması. Orijinal Wager-Athey kod tabanı.</div></div>
</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON — DEMO ONLY (econml not in pyodide)</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> econml.dml <span class="kw">import</span> CausalForestDML
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor, RandomForestClassifier

est = <span class="fn">CausalForestDML</span>(
    model_y=<span class="fn">RandomForestRegressor</span>(),
    model_t=<span class="fn">RandomForestClassifier</span>(),
    discrete_treatment=<span class="kw">True</span>,
    n_estimators=<span class="num">500</span>,
)
est.<span class="fn">fit</span>(Y, T, X=X)
cate = est.<span class="fn">effect</span>(X)
ci = est.<span class="fn">effect_interval</span>(X, alpha=<span class="num">0.05</span>)
<span class="fn">print</span>(<span class="str">"Mean CATE:"</span>, cate.<span class="fn">mean</span>(), <span class="str">"  CI width:"</span>, (ci[<span class="num">1</span>]-ci[<span class="num">0</span>]).<span class="fn">mean</span>())
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) EconML'in <code>CausalForestDML</code> tahmincisi kuruluyor; <code>model_y</code> olarak <code>RandomForestRegressor</code>, <code>model_t</code> olarak <code>RandomForestClassifier</code> takılıyor, <code>discrete_treatment=True</code> ve 500 ağaç. 2) <code>est.fit(Y, T, X=X)</code> çağrılıp yardımcı modeller çapraz-uyduruluyor ve nedensel orman eğitiliyor. 3) <code>est.effect(X)</code> ile satır-başına CATE'ler ve <code>est.effect_interval(X, alpha=0.05)</code> ile %95 aralıkları okunup ortalama CATE ile ortalama aralık genişliği yazdırılıyor.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Churn Üzerinde Heterojen Etkiler</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

m1 = <span class="fn">GradientBoostingRegressor</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
m0 = <span class="fn">GradientBoostingRegressor</span>(random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
df[<span class="str">'cate'</span>] = m1.<span class="fn">predict</span>(X) - m0.<span class="fn">predict</span>(X)

<span class="cm"># Which segments benefit most?</span>
df[<span class="str">'tenure_bin'</span>] = pd.<span class="fn">cut</span>(df[<span class="str">'tenure_months'</span>], bins=[<span class="num">0</span>,<span class="num">12</span>,<span class="num">36</span>,<span class="num">100</span>], labels=[<span class="str">'new'</span>,<span class="str">'mid'</span>,<span class="str">'loyal'</span>])
<span class="fn">print</span>(<span class="str">"Average CATE by tenure segment:"</span>)
<span class="fn">print</span>(df.<span class="fn">groupby</span>(<span class="str">'tenure_bin'</span>, observed=<span class="kw">True</span>)[<span class="str">'cate'</span>].<span class="fn">agg</span>([<span class="str">'mean'</span>,<span class="str">'std'</span>,<span class="str">'count'</span>]))

<span class="cm"># Targeting policy: treat only users with predicted negative effect on churn</span>
df[<span class="str">'recommend_treat'</span>] = df[<span class="str">'cate'</span>] &lt; -<span class="num">0.02</span>
<span class="fn">print</span>(f<span class="str">"\\nWould recommend treating {df['recommend_treat'].sum()} of {len(df)} users"</span>)
<span class="fn">print</span>(f<span class="str">"Their average predicted churn reduction: {-df[df['recommend_treat']]['cate'].mean():.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) iki <code>GradientBoostingRegressor</code> modeliyle bir T-öğrenici fit edilip satır-bazlı CATE <code>df['cate']</code> olarak saklanıyor. 2) <code>tenure_months</code> <em>new / mid / loyal</em> olarak gruplanıyor ve her segment için CATE'nin ortalaması, standart sapması ve sayısı yazdırılıyor — böylece hangi alt-grubun en çok yararlandığı görünür oluyor. 3) <code>recommend_treat = cate &lt; −0.02</code> hedefleme politikası kuruluyor; kaç kullanıcının tedavi edileceği ve onların ortalama tahmini churn azalmasının ne olduğu raporlanıyor.</p>
<p class="l-text">Pratik kazanç budur: herkesi tedavi etmek yerine, yalnızca tahmin edilen nedensel etkinin anlamlı olduğu segmenti hedefle. Ders 6'da bu araçları NLP adaletine uyguluyoruz — bir sınıflandırıcının kararının, hassas bir özelliğe müdahale edildiğinde nedensel olarak ne kadar değiştiğini ölçmek.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Okuma Listesi</h2>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Wager &amp; Athey (2018) "Estimation and Inference of Heterogeneous Treatment Effects using Random Forests", JASA. Chernozhukov ve ark. (2017) "Double/Debiased Machine Learning", arXiv. Shalit, Johansson &amp; Sontag (2017) "Estimating individual treatment effect: generalization bounds", ICML. Shi, Blei &amp; Veitch (2019) "Adapting neural networks for the estimation of treatment effects", NeurIPS. Künzel ve ark. (2019) "Metalearners for estimating heterogeneous treatment effects", PNAS.</div>
</div>`
};
