window.FAIRNESS_L4 = {
en: `<p class="l-text"><strong>SHAP is the closest thing the field has to a unified theory of feature attribution.</strong> Before Lundberg &amp; Lee's 2017 NeurIPS paper, every popular explainer was its own ad-hoc heuristic — LIME perturbed inputs, DeepLIFT propagated reference activations, Saabas's tree explanation walked decision paths, gain-based feature importance counted impurity drops. Each gave different numbers; none was provably right. Lundberg &amp; Lee proved that exactly one attribution method satisfies four desirable axioms (efficiency, symmetry, dummy, additivity) — the Shapley value, imported from 1953 cooperative game theory. Every other "right-feeling" attribution method either matched Shapley values or violated one of the axioms.</p>

<p class="l-text">In this lesson we derive Shapley values from the game-theoretic definition, compute them by hand on a 5-feature problem (so you can see all 32 subsets), and then meet the algorithms that scale: <em>TreeSHAP</em> (exact polynomial-time Shapley values for tree ensembles, Lundberg 2018), <em>KernelSHAP</em> (model-agnostic via weighted linear regression), <em>DeepSHAP</em> (for neural nets), and <em>SamplingSHAP</em> (Monte Carlo). We then read the three plots that matter: <em>force plot</em> (one prediction's attributions), <em>summary / beeswarm</em> (global view across all examples), and <em>dependence plot</em> (a feature's effect across its range). The shap library is blocked in Pyodide so we implement the computation manually — which is the right way to learn it anyway.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>State the four Shapley axioms and why they uniquely determine feature attribution</li>
<li>Compute Shapley values exactly via subset enumeration (small n) and approximately via sampling (large n)</li>
<li>Read force plots, summary / beeswarm plots, and dependence plots correctly — including their failure modes</li>
<li>Pick between TreeSHAP, KernelSHAP, DeepSHAP, and Monte Carlo SHAP based on model type and data size</li>
<li>Recognize SHAP's limits: feature correlation breaks the "marginal contribution" interpretation</li>
<li>Connect SHAP to fairness audits — per-group SHAP differences localize where bias enters the model</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The Game-Theory Origin (Shapley 1953)</h2>
<p class="l-text">Lloyd Shapley asked: in a cooperative game where players form coalitions and receive a joint payoff, how should the payoff be divided fairly? He defined four axioms — efficiency (payouts sum to total payoff), symmetry (equal contributors get equal pay), dummy (a player who adds nothing gets nothing), additivity (combined games combine attributions linearly) — and proved exactly one division satisfies all four.</p>

<div class="katex-block">$$\\phi_i = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|!\\,(n-|S|-1)!}{n!}\\,\\bigl[v(S \\cup \\{i\\}) - v(S)\\bigr]$$</div>

<p class="l-text">Read it as: <em>average the marginal contribution of player <code>i</code> over every possible coalition <code>S</code> that does not contain <code>i</code>, weighted by how many ways that coalition could have formed.</em> The weight <code>|S|!(n-|S|-1)!/n!</code> is the probability that a random permutation places <code>S</code> before <code>i</code>.</p>

<p class="l-text">Lundberg &amp; Lee (NeurIPS 2017) cast feature attribution as a game: players are features, the payoff is the model's output, and a coalition's value <code>v(S)</code> is the model's prediction when only features in <code>S</code> are "present" (the rest replaced by their marginal expectation). Shapley's theorem then names the only feature-attribution method that satisfies the four axioms.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The Four SHAP Axioms (and Why They Matter)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Local accuracy (Efficiency)</div><div class="card-body">SHAP values for one prediction sum to <code>f(x) - E[f(X)]</code>. The model's output is exactly explained — no residual, no double-counting. Gain-based feature importance fails this.</div></div>
<div class="calc-card"><div class="card-title">Missingness</div><div class="card-body">A feature that is genuinely absent from the model gets attribution zero. Trivial to satisfy but rules out spurious assignments.</div></div>
<div class="calc-card"><div class="card-title">Consistency (Symmetry / Monotonicity)</div><div class="card-body">If model A relies on feature <code>i</code> at least as much as model B, A's SHAP value for <code>i</code> is at least B's. Saabas's tree explanation famously violates this; TreeSHAP fixes it.</div></div>
<div class="calc-card"><div class="card-title">Additivity</div><div class="card-body">SHAP values of an ensemble are the (weighted) sum of SHAP values of its members. Critical for ensembles: random forests, gradient boosting, stacking.</div></div>
</div>

<div class="calc-highlight"><strong>The selling point of SHAP</strong>: any explanation that violates one of these axioms is provably <em>wrong</em> — there exists a model on which it gives misleading attributions. Shapley values are the unique way to avoid that.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Computing SHAP by Hand: 5 Features, 32 Subsets</h2>
<p class="l-text">For small <code>n</code> the formula is directly computable. With 5 features there are <code>2⁵ = 32</code> subsets; for each feature we enumerate the 16 subsets not containing it, compute the marginal contribution, and weight by the Shapley coefficient. Below we do exactly that on a churn model with 5 features.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> itertools <span class="kw">import</span> combinations
<span class="kw">from</span> math <span class="kw">import</span> factorial
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

<span class="cm"># Pick 5 numeric features from df_churn</span>
feats = df_churn.<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).columns.<span class="fn">tolist</span>()[:<span class="num">5</span>]
X = df_churn[feats].<span class="fn">fillna</span>(<span class="num">0</span>).values
y = df_churn[<span class="str">'churned'</span>].values
mu = X.<span class="fn">mean</span>(axis=<span class="num">0</span>)                              <span class="cm"># background = column means</span>

clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">80</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)
n = <span class="fn">len</span>(feats)

<span class="kw">def</span> <span class="fn">v</span>(S, x):
    <span class="str">"""Coalition value: predict with features in S real, others replaced by mean."""</span>
    z = mu.<span class="fn">copy</span>()
    <span class="kw">for</span> j <span class="kw">in</span> S: z[j] = x[j]
    <span class="kw">return</span> clf.<span class="fn">predict_proba</span>(z.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">shapley</span>(x):
    phi = np.<span class="fn">zeros</span>(n)
    all_idx = <span class="fn">list</span>(<span class="fn">range</span>(n))
    <span class="kw">for</span> i <span class="kw">in</span> all_idx:
        rest = [j <span class="kw">for</span> j <span class="kw">in</span> all_idx <span class="kw">if</span> j != i]
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(rest)+<span class="num">1</span>):
            <span class="kw">for</span> S <span class="kw">in</span> <span class="fn">combinations</span>(rest, k):
                S = <span class="fn">list</span>(S)
                w = <span class="fn">factorial</span>(<span class="fn">len</span>(S)) * <span class="fn">factorial</span>(n - <span class="fn">len</span>(S) - <span class="num">1</span>) / <span class="fn">factorial</span>(n)
                phi[i] += w * (<span class="fn">v</span>(S + [i], x) - <span class="fn">v</span>(S, x))
    <span class="kw">return</span> phi

x_target = X[<span class="num">0</span>]
phi = <span class="fn">shapley</span>(x_target)
base = clf.<span class="fn">predict_proba</span>(mu.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">'baseline   E[f(X)] = {base:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'prediction f(x)    = {clf.predict_proba(x_target.reshape(1,-1))[0,1]:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'sum of SHAP        = {phi.sum() + base:.3f}  (should equal f(x))'</span>)
<span class="kw">for</span> f, p <span class="kw">in</span> <span class="fn">zip</span>(feats, phi):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {p:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) picks 5 numeric churn features, computes their column-wise mean as a background vector <code>mu</code>, and trains a RandomForest on the full data. 2) defines <code>v(S, x)</code>, the coalition value: copy <code>mu</code>, overwrite the entries indexed by S with x's values, and return the model's churn probability — features outside S are "absent" by being set to their marginal mean. 3) enumerates every subset of the other 4 features for each target feature i, computes the Shapley weight <code>|S|!(n-|S|-1)!/n!</code>, and accumulates the weighted marginal contribution <code>v(S∪{i}) − v(S)</code> into <code>phi[i]</code> — the exact Shapley value.</p>

<p class="l-text">Run it and three things happen: (1) the SHAP values sum to <code>f(x) - E[f(X)]</code> exactly, demonstrating local accuracy; (2) features that push the prediction up appear with positive SHAP, those that push it down with negative; (3) the runtime is <code>O(2ⁿ · cost(model))</code>, which is fine for n=5 (32 inferences) but explodes for n=20 (a million) and is hopeless for n=100. Hence the specialized algorithms below.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. TreeSHAP: Exact Polynomial-Time SHAP for Trees</h2>
<p class="l-text">Lundberg, Erion &amp; Lee (Nature MI 2020, but the algorithm dates to a 2018 arxiv preprint) showed that for tree-based models — single trees, random forests, GBMs, XGBoost, LightGBM, CatBoost — Shapley values can be computed exactly in <code>O(TLD²)</code> time, where T is trees, L is leaves, D is depth. The trick is that a tree's prediction depends on only the path from root to leaf, so the exponential subset-sum collapses into a polynomial dynamic-programming pass over tree nodes.</p>

<p class="l-text">For most production tabular models, TreeSHAP is the right choice — it is exact, fast (often sub-second per example for typical XGBoost models), and is what the <code>shap</code> library defaults to when given a tree model. As a sanity baseline, scikit-learn's <code>feature_importances_</code> on a single decision tree gives a closely related but axiomatically weaker quantity — gain-based importance, which is consistent with TreeSHAP only in degenerate cases.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Pseudocode for TreeSHAP main loop (real implementation in shap.TreeExplainer)</span>
<span class="cm"># Replaced here with a sklearn baseline using feature_importances_</span>
<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">import</span> numpy <span class="kw">as</span> np

gbm = <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">50</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(<span class="str">'Gain-based feature importance (NOT SHAP, but cheap baseline):'</span>)
<span class="kw">for</span> f, imp <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, gbm.feature_importances_), key=<span class="kw">lambda</span> t: -t[<span class="num">1</span>]):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {imp:.3f}'</span>)
<span class="fn">print</span>(<span class="str">'Note: this is global importance; TreeSHAP gives per-prediction signed values.'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a GradientBoostingClassifier (50 shallow trees) on the same churn features — a stand-in for the kind of model TreeSHAP was designed for. 2) reads off sklearn's <code>feature_importances_</code>, which is gain-based: it sums impurity reduction across all splits using each feature. 3) sorts and prints those scores, noting in the output that this is a <em>global, unsigned</em> quantity — TreeSHAP would give a per-prediction, signed value that satisfies the four axioms.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide-equivalent (shap library blocked)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85">The <code>shap</code> package is not available in Pyodide. We approximate TreeSHAP with the exact subset-enumeration SHAP from section 3 — slower, but identical answer for small models. For production use, install <code>shap</code> in a real Python environment and call <code>shap.TreeExplainer(gbm).shap_values(X)</code>.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Compute SHAP values for the first 10 rows using the exact enumerator</span>
phi_all = np.<span class="fn">array</span>([<span class="fn">shapley</span>(X[i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>)])
mean_abs = np.<span class="fn">abs</span>(phi_all).<span class="fn">mean</span>(axis=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">'Global feature importance (mean |SHAP|):'</span>)
<span class="kw">for</span> f, m <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, mean_abs), key=<span class="kw">lambda</span> t: -t[<span class="num">1</span>]):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {m:.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) calls the exact-enumeration <code>shapley(x)</code> from the previous block once per row for the first 10 examples and stacks the results into a (10, n) matrix. 2) reduces along the row axis with <code>np.abs(...).mean(axis=0)</code> to get the mean absolute SHAP per feature — the standard global-importance summary. 3) sorts and prints the result so you can compare it against the gain-based ranking above and see how the axiomatically correct attribution can reorder features.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. KernelSHAP: Model-Agnostic via Weighted Linear Regression</h2>
<p class="l-text">For non-tree models — neural nets, SVMs, anything black-box — Lundberg &amp; Lee (2017) gave KernelSHAP. The trick: write the Shapley value as the solution to a weighted least-squares problem with a specific kernel, then sample subsets to approximate. Concretely:</p>

<div class="katex-block">$$\\pi_x(z') = \\frac{n - 1}{\\binom{n}{|z'|}\\,|z'|\\,(n-|z'|)}$$</div>

<p class="l-text">Sample <code>K</code> binary mask vectors <code>z' ∈ {0,1}ⁿ</code>, compute <code>f(h_x(z'))</code> where <code>h_x(z')</code> reconstructs an input by taking feature <code>i</code> from <code>x</code> when <code>z'ᵢ=1</code> and from a background sample when <code>z'ᵢ=0</code>. Solve <code>argmin_φ Σ π_x(z') (f(h_x(z')) - φ₀ - z'·φ)²</code>. The solution <code>φ</code> is a Shapley-value approximation, exact in the limit of all <code>2ⁿ</code> subsets.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># KernelSHAP from scratch — works for any model with .predict_proba</span>
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">kernel_shap</span>(model, x, X_background, n_samples=<span class="num">200</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    n = <span class="fn">len</span>(x)
    <span class="cm"># Sample binary masks; weight each by Shapley kernel</span>
    masks, weights, vals = [], [], []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_samples):
        k = rng.<span class="fn">integers</span>(<span class="num">1</span>, n)                       <span class="cm"># |z'|</span>
        m = np.<span class="fn">zeros</span>(n); m[rng.<span class="fn">choice</span>(n, k, replace=<span class="kw">False</span>)] = <span class="num">1</span>
        bg = X_background[rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(X_background))]
        z = np.<span class="fn">where</span>(m, x, bg)
        masks.<span class="fn">append</span>(m); vals.<span class="fn">append</span>(<span class="fn">model</span>(z.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>])
        <span class="kw">from</span> math <span class="kw">import</span> comb
        weights.<span class="fn">append</span>((n-<span class="num">1</span>) / (<span class="fn">comb</span>(n,<span class="fn">int</span>(k)) * k * (n-k) + <span class="num">1e-9</span>))
    masks, weights, vals = np.<span class="fn">array</span>(masks), np.<span class="fn">array</span>(weights), np.<span class="fn">array</span>(vals)
    reg = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(masks, vals, sample_weight=weights)
    <span class="kw">return</span> reg.coef_, reg.intercept_

phi_k, base_k = <span class="fn">kernel_shap</span>(clf.predict_proba, X[<span class="num">0</span>], X, n_samples=<span class="num">400</span>)
<span class="fn">print</span>(<span class="str">'KernelSHAP estimate vs. exact:'</span>)
<span class="kw">for</span> f, e, k <span class="kw">in</span> <span class="fn">zip</span>(feats, phi, phi_k):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} exact={e:+.3f}   kernel={k:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>kernel_shap(model, x, X_background, n_samples)</code> samples <code>n_samples</code> random binary masks z' over the n features, picks a random background row, and reconstructs an input by taking feature i from x where z'ᵢ=1 and from the background where z'ᵢ=0. 2) weights each sampled mask by the Shapley kernel <code>π_x(z') = (n−1) / (C(n,|z'|)·|z'|·(n−|z'|))</code> and queries the model to get f(h_x(z')). 3) fits a weighted LinearRegression of the model outputs on the masks — the coefficients are the KernelSHAP estimates, which converge to the exact Shapley values as <code>n_samples → ∞</code>.</p>

<p class="l-text">KernelSHAP works for any model but is slow — <code>n_samples</code> model calls per explanation, and you need <code>O(n²)</code> samples for accurate results. For deep nets, DeepSHAP (Lundberg &amp; Lee 2017, building on DeepLIFT) is faster: it uses backprop with reference activations to compute SHAP values in one pass per layer.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. The Three Plots: Force, Summary, Dependence</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Force plot (one prediction)</div><div class="card-body">Bar from base value to <code>f(x)</code> with red arrows pushing up and blue arrows pushing down, labeled by feature and value. Best for explaining a single decision to a user. Lundberg's original SHAP paper showed this for a hospital readmission model.</div></div>
<div class="calc-card"><div class="card-title">Summary / beeswarm (global)</div><div class="card-body">For each feature, plot one dot per row at <code>x = SHAP value</code>, color by feature value (red = high, blue = low). Reveals direction <em>and</em> distribution of feature effects. The single most informative ML interpretability plot ever invented.</div></div>
<div class="calc-card"><div class="card-title">Dependence plot</div><div class="card-body">For one feature, scatter <code>(feature_value, SHAP_value)</code>, optionally colored by an interacting feature. Shows non-linearities and interactions; Lundberg's "tree-based interaction values" extension makes interactions exact.</div></div>
</div>

<p class="l-text">Two reading rules. (1) <em>Sign</em> matters more than magnitude when explaining a decision: a small +0.05 SHAP for "income" is still pushing toward approval. (2) <em>Magnitude across rows</em> matters globally: in a beeswarm, a feature with thin spread does little even if it has a high mean.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SHAP for Fairness Auditing</h2>
<p class="l-text">SHAP and fairness combine usefully. Compute SHAP values separately on each protected group and compare: features whose mean SHAP differs sharply between groups are exactly the channels through which bias enters the model. Lundberg himself published this connection in <em>"Explaining Quantitative Measures of Fairness"</em> (FAccT 2020). It localizes the problem before you reach for mitigation.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Per-group SHAP comparison — find the bias channels</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
s = (rng.<span class="fn">random</span>(<span class="fn">len</span>(X)) &lt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)            <span class="cm"># synthetic group</span>

<span class="cm"># Compute SHAP on a sample from each group</span>
<span class="kw">def</span> <span class="fn">avg_shap</span>(idx):
    <span class="kw">return</span> np.<span class="fn">mean</span>([<span class="fn">shapley</span>(X[i]) <span class="kw">for</span> i <span class="kw">in</span> idx], axis=<span class="num">0</span>)

idx0 = np.<span class="fn">where</span>(s==<span class="num">0</span>)[<span class="num">0</span>][:<span class="num">8</span>]; idx1 = np.<span class="fn">where</span>(s==<span class="num">1</span>)[<span class="num">0</span>][:<span class="num">8</span>]
mean0, mean1 = <span class="fn">avg_shap</span>(idx0), <span class="fn">avg_shap</span>(idx1)
diff = mean1 - mean0
<span class="fn">print</span>(<span class="str">'Per-group SHAP difference (group=1 minus group=0):'</span>)
<span class="kw">for</span> f, d <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, diff), key=<span class="kw">lambda</span> t: -<span class="fn">abs</span>(t[<span class="num">1</span>])):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {d:+.3f}    (a positive value means feature pushes group 1 up more)'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) synthesises a binary protected attribute s by drawing from <code>rng.random() &lt; 0.5</code>, then picks the first 8 rows from each group as audit samples. 2) calls the exact <code>shapley(X[i])</code> on every row in each group and averages the resulting vectors with <code>np.mean(..., axis=0)</code> to get mean SHAP per feature per group. 3) prints the per-feature SHAP difference <code>mean1 − mean0</code> sorted by absolute magnitude — the features with the biggest gaps are the channels through which group membership influences the model.</p>

<p class="l-text">A feature with a large between-group SHAP difference is doing different work for the two groups — either because the model learned a group-specific pattern, or because the feature distribution differs and the model is responding to that distribution shift. Either way, this is where you focus the mitigation.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. The Limits of SHAP</h2>
<p class="l-text">SHAP is unique among attribution methods, but it is not the truth. Three limitations matter in practice:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Correlated features</div><div class="card-body">When features are correlated, "marginal contribution" includes off-manifold inputs (replacing a tall person's height with the population mean while leaving the rest of their body alone). Aas, Jullum &amp; Løland 2019 proposed conditional SHAP to address this; trade-off: less identifiable.</div></div>
<div class="calc-card"><div class="card-title">Causation</div><div class="card-body">SHAP attributes association, not causation. A feature with high SHAP need not be a lever you can pull. Janzing, Minorics &amp; Blöbaum (AISTATS 2020) explored causal SHAP variants — useful for actionable recourse (next lesson).</div></div>
<div class="calc-card"><div class="card-title">Adversarial fragility</div><div class="card-body">Slack et al. (AIES 2020) showed SHAP and LIME can be adversarially fooled — a model can be biased on real data yet present clean SHAP values via adversarial perturbations of the background distribution. Always validate with held-out audits.</div></div>
</div>

<div class="calc-highlight"><strong>SHAP is correct given a model and a background distribution</strong>. If those are wrong (correlated features, off-manifold backgrounds, adversarial training), SHAP is correct about the wrong thing. Treat it as a microscope, not an oracle.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; Next</h2>
<p class="l-text">SHAP is the rigorous, axiomatically grounded approach to feature attribution. The exponential cost is solved by TreeSHAP for trees and KernelSHAP/DeepSHAP for everything else, and the three plots — force, summary, dependence — give the local-to-global view production teams actually use.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Shapley values are the <em>unique</em> attribution satisfying efficiency, symmetry, dummy, additivity (Lundberg-Lee 2017).</li>
<li>For trees, TreeSHAP is exact in polynomial time. For black boxes, KernelSHAP via weighted linear regression. For nets, DeepSHAP via reference-activation backprop.</li>
<li>Force plot for one prediction; beeswarm for global; dependence for one feature's full effect curve.</li>
<li>Per-group SHAP comparison localizes where bias enters a model — pair with the mitigations from L3.</li>
<li>Correlated features and adversarial training can break SHAP. Validate with held-out fairness audits.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L5</strong> covers LIME — a faster, less rigorous, but more flexible alternative that fits a local linear surrogate around one prediction. <strong>L6</strong> goes from "what mattered" to "what would have changed it" with counterfactual explanations.</p>
</div>`,
tr: `<p class="l-text"><strong>SHAP, alanın özellik atfı için sahip olduğu birleşik bir teoriye en yakın şeydir.</strong> Lundberg &amp; Lee'nin 2017 NeurIPS makalesinden önce, her popüler açıklayıcı kendi geçici sezgisel yöntemiydi — LIME girdileri perturbe ediyordu, DeepLIFT referans aktivasyonlarını yayıyordu, Saabas'ın ağaç açıklaması karar yollarını yürüyordu, kazanç tabanlı öznitelik önemi safsızlık düşüşlerini sayıyordu. Her biri farklı sayılar veriyordu; hiçbiri kanıtlanabilir şekilde doğru değildi. Lundberg &amp; Lee tam olarak bir atıf yönteminin dört arzu edilen aksiyomu (verimlilik, simetri, kukla, toplama) sağladığını kanıtladı — Shapley değeri, 1953 işbirlikçi oyun teorisinden ithal edilmiş. Diğer her "doğru hisseden" atıf yöntemi ya Shapley değerleriyle eşleşiyor ya da aksiyomlardan birini ihlal ediyordu.</p>

<p class="l-text">Bu derste Shapley değerlerini oyun-teorik tanımdan türetiyoruz, 5-öznitelikli bir problemde elle hesaplıyoruz (böylece tüm 32 alt kümeyi görebilirsin) ve sonra ölçeklenen algoritmalarla tanışıyoruz: <em>TreeSHAP</em> (ağaç toplulukları için kesin polinom-zamanlı Shapley değerleri, Lundberg 2018), <em>KernelSHAP</em> (ağırlıklı doğrusal regresyon yoluyla modelden bağımsız), <em>DeepSHAP</em> (sinir ağları için) ve <em>SamplingSHAP</em> (Monte Carlo). Sonra önemli olan üç grafiği okuyoruz: <em>kuvvet grafiği</em> (bir tahminin atıfları), <em>özet / arıkovanı</em> (tüm örneklerde küresel görünüm) ve <em>bağımlılık grafiği</em> (bir özniteliğin aralığı boyunca etkisi). shap kütüphanesi Pyodide'da engellendiği için hesaplamayı manuel olarak uyguluyoruz — ki zaten öğrenmenin doğru yolu budur.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Dört Shapley aksiyomunu ve neden özellik atfını eşsiz şekilde belirlediklerini ifade et</li>
<li>Shapley değerlerini alt küme numaralandırması (küçük n) ile kesin ve örnekleme (büyük n) ile yaklaşık hesapla</li>
<li>Kuvvet grafiklerini, özet / arıkovanı grafiklerini ve bağımlılık grafiklerini doğru oku — başarısızlık modları dahil</li>
<li>Model türü ve veri boyutuna göre TreeSHAP, KernelSHAP, DeepSHAP ve Monte Carlo SHAP arasında seç</li>
<li>SHAP'ın sınırlarını tanı: öznitelik korelasyonu "marjinal katkı" yorumunu kırar</li>
<li>SHAP'ı adillik denetimlerine bağla — grup başına SHAP farkları, önyargının modele girdiği yeri yerelleştirir</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Oyun Teorisi Kökeni (Shapley 1953)</h2>
<p class="l-text">Lloyd Shapley sordu: oyuncuların koalisyonlar oluşturup ortak bir ödül aldığı işbirlikçi bir oyunda, ödül adil şekilde nasıl bölünmelidir? Dört aksiyom tanımladı — verimlilik (ödemeler toplam ödüle eşittir), simetri (eşit katkı sağlayanlar eşit alır), kukla (hiçbir şey katmayan oyuncu hiçbir şey almaz), toplama (birleşik oyunlar atıfları doğrusal birleştirir) — ve tam olarak bir bölünmenin dördünü de sağladığını kanıtladı.</p>

<div class="katex-block">$$\\phi_i = \\sum_{S \\subseteq N \\setminus \\{i\\}} \\frac{|S|!\\,(n-|S|-1)!}{n!}\\,\\bigl[v(S \\cup \\{i\\}) - v(S)\\bigr]$$</div>

<p class="l-text">Şöyle oku: <em><code>i</code> oyuncusunun marjinal katkısının, <code>i</code>'yi içermeyen her olası <code>S</code> koalisyonu üzerinde ortalaması, o koalisyonun kaç şekilde oluşabileceğine göre ağırlıklandırılır.</em> Ağırlık <code>|S|!(n-|S|-1)!/n!</code>, rastgele bir permütasyonun <code>S</code>'yi <code>i</code>'den önce yerleştirme olasılığıdır.</p>

<p class="l-text">Lundberg &amp; Lee (NeurIPS 2017) özellik atfını bir oyun olarak çerçeveledi: oyuncular özniteliklerdir, ödül modelin çıktısıdır ve bir koalisyonun değeri <code>v(S)</code>, yalnızca <code>S</code>'deki öznitelikler "mevcut" olduğunda (geri kalanı marjinal beklentileriyle değiştirilmiş) modelin tahminidir. Shapley'in teoremi sonra dört aksiyomu sağlayan tek özellik-atfı yöntemini adlandırır.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Dört SHAP Aksiyomu (ve Neden Önemli)</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Yerel doğruluk (Verimlilik)</div><div class="card-body">Bir tahmin için SHAP değerleri <code>f(x) - E[f(X)]</code>'e toplanır. Modelin çıktısı tam olarak açıklanır — artık yok, çift sayma yok. Kazanç tabanlı öznitelik önemi bunu başaramaz.</div></div>
<div class="calc-card"><div class="card-title">Eksiklik</div><div class="card-body">Modelden gerçekten yoksun bir öznitelik sıfır atıf alır. Sağlamak önemsiz ama sahte atamaları engeller.</div></div>
<div class="calc-card"><div class="card-title">Tutarlılık (Simetri / Monotonluk)</div><div class="card-body">Model A öznitelik <code>i</code>'ye en az model B kadar bel bağlıyorsa, A'nın <code>i</code> için SHAP değeri en az B'ninki kadardır. Saabas'ın ağaç açıklaması ünlü olarak bunu ihlal eder; TreeSHAP düzeltir.</div></div>
<div class="calc-card"><div class="card-title">Toplama</div><div class="card-body">Bir topluluğun SHAP değerleri, üyelerinin SHAP değerlerinin (ağırlıklı) toplamıdır. Topluluklar için kritik: rastgele ormanlar, gradient boosting, stacking.</div></div>
</div>

<div class="calc-highlight"><strong>SHAP'ın satış noktası</strong>: bu aksiyomlardan birini ihlal eden herhangi bir açıklama kanıtlanabilir şekilde <em>yanlıştır</em> — yanıltıcı atıflar verdiği bir model vardır. Shapley değerleri bunu önlemenin tek yoludur.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SHAP'ı Elle Hesaplama: 5 Öznitelik, 32 Alt Küme</h2>
<p class="l-text">Küçük <code>n</code> için formül doğrudan hesaplanabilir. 5 özniteliğe <code>2⁵ = 32</code> alt küme vardır; her öznitelik için onu içermeyen 16 alt kümeyi numaralandırır, marjinal katkıyı hesaplar ve Shapley katsayısı ile ağırlıklandırırız. Aşağıda 5 öznitelikli bir churn modelinde tam olarak bunu yapıyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> itertools <span class="kw">import</span> combinations
<span class="kw">from</span> math <span class="kw">import</span> factorial
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

<span class="cm"># Pick 5 numeric features from df_churn</span>
feats = df_churn.<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).columns.<span class="fn">tolist</span>()[:<span class="num">5</span>]
X = df_churn[feats].<span class="fn">fillna</span>(<span class="num">0</span>).values
y = df_churn[<span class="str">'churned'</span>].values
mu = X.<span class="fn">mean</span>(axis=<span class="num">0</span>)                              <span class="cm"># background = column means</span>

clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">80</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)
n = <span class="fn">len</span>(feats)

<span class="kw">def</span> <span class="fn">v</span>(S, x):
    <span class="str">"""Coalition value: predict with features in S real, others replaced by mean."""</span>
    z = mu.<span class="fn">copy</span>()
    <span class="kw">for</span> j <span class="kw">in</span> S: z[j] = x[j]
    <span class="kw">return</span> clf.<span class="fn">predict_proba</span>(z.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">shapley</span>(x):
    phi = np.<span class="fn">zeros</span>(n)
    all_idx = <span class="fn">list</span>(<span class="fn">range</span>(n))
    <span class="kw">for</span> i <span class="kw">in</span> all_idx:
        rest = [j <span class="kw">for</span> j <span class="kw">in</span> all_idx <span class="kw">if</span> j != i]
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(rest)+<span class="num">1</span>):
            <span class="kw">for</span> S <span class="kw">in</span> <span class="fn">combinations</span>(rest, k):
                S = <span class="fn">list</span>(S)
                w = <span class="fn">factorial</span>(<span class="fn">len</span>(S)) * <span class="fn">factorial</span>(n - <span class="fn">len</span>(S) - <span class="num">1</span>) / <span class="fn">factorial</span>(n)
                phi[i] += w * (<span class="fn">v</span>(S + [i], x) - <span class="fn">v</span>(S, x))
    <span class="kw">return</span> phi

x_target = X[<span class="num">0</span>]
phi = <span class="fn">shapley</span>(x_target)
base = clf.<span class="fn">predict_proba</span>(mu.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">'baseline   E[f(X)] = {base:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'prediction f(x)    = {clf.predict_proba(x_target.reshape(1,-1))[0,1]:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'sum of SHAP        = {phi.sum() + base:.3f}  (should equal f(x))'</span>)
<span class="kw">for</span> f, p <span class="kw">in</span> <span class="fn">zip</span>(feats, phi):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {p:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Churn'den 5 sayısal öznitelik seçer, sütun-başına ortalamayı arka plan vektörü <code>mu</code> olarak hesaplar ve tüm veri üzerinde bir RandomForest eğitir. 2) <code>v(S, x)</code> koalisyon değerini tanımlar: <code>mu</code>'yu kopyala, S'deki indekslere x'in değerlerini yaz ve modelin churn olasılığını döndür — S dışındaki öznitelikler marjinal ortalamalarına sabitlenerek "yok" sayılır. 3) Her hedef öznitelik i için diğer 4 özniteliğin tüm alt kümelerini sayar, Shapley ağırlığı <code>|S|!(n-|S|-1)!/n!</code>'yi hesaplar ve ağırlıklı marjinal katkıyı <code>v(S∪{i}) − v(S)</code> <code>phi[i]</code>'ye toplar — kesin Shapley değeri.</p>

<p class="l-text">Çalıştır ve üç şey olur: (1) SHAP değerleri tam olarak <code>f(x) - E[f(X)]</code>'e toplanır, yerel doğruluğu gösterir; (2) tahmini yukarı iten öznitelikler pozitif SHAP ile, aşağı itenler negatif ile görünür; (3) çalışma süresi <code>O(2ⁿ · cost(model))</code>'dur, bu n=5 (32 çıkarım) için iyidir ama n=20 (bir milyon) için patlar ve n=100 için umutsuzdur. Aşağıdaki özelleşmiş algoritmaların nedeni de budur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. TreeSHAP: Ağaçlar için Kesin Polinom-Zamanlı SHAP</h2>
<p class="l-text">Lundberg, Erion &amp; Lee (Nature MI 2020, ama algoritma 2018 arxiv ön baskısına uzanır), ağaç tabanlı modeller için — tek ağaçlar, rastgele ormanlar, GBM'ler, XGBoost, LightGBM, CatBoost — Shapley değerlerinin <code>O(TLD²)</code> zamanda kesin olarak hesaplanabileceğini gösterdi; T ağaç sayısı, L yaprak sayısı, D derinliktir. Hile, bir ağacın tahmininin yalnızca kökten yaprağa giden yola bağlı olmasıdır, bu yüzden üstel alt küme toplamı, ağaç düğümleri üzerinde polinom dinamik programlama geçişine çöker.</p>

<p class="l-text">Çoğu üretim tablo modeli için TreeSHAP doğru seçimdir — kesindir, hızlıdır (tipik XGBoost modelleri için örnek başına çoğu zaman saniye altı) ve <code>shap</code> kütüphanesinin bir ağaç modeli verildiğinde varsayılan kullandığıdır. Akıl sağlığı temeli olarak, scikit-learn'ün tek bir karar ağacında <code>feature_importances_</code>, yakından ilişkili ama aksiyomatik olarak daha zayıf bir miktar verir — kazanç tabanlı önem, yalnızca dejenere durumlarda TreeSHAP ile tutarlıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Pseudocode for TreeSHAP main loop (real implementation in shap.TreeExplainer)</span>
<span class="cm"># Replaced here with a sklearn baseline using feature_importances_</span>
<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">import</span> numpy <span class="kw">as</span> np

gbm = <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">50</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(<span class="str">'Gain-based feature importance (NOT SHAP, but cheap baseline):'</span>)
<span class="kw">for</span> f, imp <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, gbm.feature_importances_), key=<span class="kw">lambda</span> t: -t[<span class="num">1</span>]):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {imp:.3f}'</span>)
<span class="fn">print</span>(<span class="str">'Note: this is global importance; TreeSHAP gives per-prediction signed values.'</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Aynı churn öznitelikleri üzerinde bir GradientBoostingClassifier (50 sığ ağaç) eğitir — TreeSHAP'in tasarlandığı model tipi için bir temsil. 2) Sklearn'ün <code>feature_importances_</code>'ını okur; bu kazanç-tabanlıdır: her özniteliği kullanan tüm bölmelerdeki safsızlık azalmasını toplar. 3) Bu skorları sıralar ve yazdırır; çıktıda bunun <em>küresel, işaretsiz</em> bir nicelik olduğunu not eder — TreeSHAP, dört aksiyomu sağlayan tahmin-başına işaretli bir değer verirdi.</p>

<div class="pyodide-alt" style="margin:0.4rem 0 1.5rem;padding:1rem 1.1rem;background:rgba(120,180,200,0.06);border:1px solid rgba(120,180,200,0.22);border-radius:10px">
<div style="font-size:0.82rem;color:#7cc;margin-bottom:0.55rem;font-weight:600;letter-spacing:0.02em">🔁 Pyodide eşdeğeri (shap kütüphanesi engelli)</div>
<p class="l-text" style="font-size:0.88rem;margin:0.3rem 0 0.7rem 0;opacity:0.85"><code>shap</code> paketi Pyodide'da mevcut değil. TreeSHAP'i bölüm 3'teki kesin alt küme numaralandırma SHAP ile yaklaşık olarak veriyoruz — daha yavaş ama küçük modeller için aynı cevap. Üretim kullanımı için <code>shap</code>'i gerçek bir Python ortamına kur ve <code>shap.TreeExplainer(gbm).shap_values(X)</code> çağır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Compute SHAP values for the first 10 rows using the exact enumerator</span>
phi_all = np.<span class="fn">array</span>([<span class="fn">shapley</span>(X[i]) <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(<span class="num">10</span>)])
mean_abs = np.<span class="fn">abs</span>(phi_all).<span class="fn">mean</span>(axis=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">'Global feature importance (mean |SHAP|):'</span>)
<span class="kw">for</span> f, m <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, mean_abs), key=<span class="kw">lambda</span> t: -t[<span class="num">1</span>]):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {m:.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Önceki bloktaki kesin sayım tabanlı <code>shapley(x)</code>'i ilk 10 satır için satır-başına bir kez çağırır ve sonuçları (10, n) bir matrise yığar. 2) <code>np.abs(...).mean(axis=0)</code> ile satır ekseninde indirger ve öznitelik başına ortalama mutlak SHAP'i elde eder — standart küresel önem özeti. 3) Sonucu sıralayıp yazdırır; böylece bunu yukarıdaki kazanç-tabanlı sıralama ile karşılaştırabilir ve aksiyomatik olarak doğru atfın öznitelikleri nasıl yeniden sıralayabildiğini görebilirsin.</p>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. KernelSHAP: Ağırlıklı Doğrusal Regresyon ile Modelden Bağımsız</h2>
<p class="l-text">Ağaç olmayan modeller için — sinir ağları, SVM'ler, herhangi bir kara kutu — Lundberg &amp; Lee (2017) KernelSHAP'i verdi. Hile: Shapley değerini belirli bir çekirdekli ağırlıklı en küçük kareler probleminin çözümü olarak yaz, sonra yaklaşık olarak alt kümeleri örnekle. Somut olarak:</p>

<div class="katex-block">$$\\pi_x(z') = \\frac{n - 1}{\\binom{n}{|z'|}\\,|z'|\\,(n-|z'|)}$$</div>

<p class="l-text"><code>K</code> ikili maske vektörü <code>z' ∈ {0,1}ⁿ</code> örnekle, <code>f(h_x(z'))</code> hesapla; burada <code>h_x(z')</code>, <code>z'ᵢ=1</code> olduğunda <code>i</code> özniteliğini <code>x</code>'ten ve <code>z'ᵢ=0</code> olduğunda bir arka plan örneğinden alarak girdiyi yeniden inşa eder. <code>argmin_φ Σ π_x(z') (f(h_x(z')) - φ₀ - z'·φ)²</code>'yi çöz. Çözüm <code>φ</code> bir Shapley-değeri yaklaşımıdır, tüm <code>2ⁿ</code> alt küme limitinde kesindir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># KernelSHAP from scratch — works for any model with .predict_proba</span>
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">kernel_shap</span>(model, x, X_background, n_samples=<span class="num">200</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    n = <span class="fn">len</span>(x)
    <span class="cm"># Sample binary masks; weight each by Shapley kernel</span>
    masks, weights, vals = [], [], []
    <span class="kw">for</span> _ <span class="kw">in</span> <span class="fn">range</span>(n_samples):
        k = rng.<span class="fn">integers</span>(<span class="num">1</span>, n)                       <span class="cm"># |z'|</span>
        m = np.<span class="fn">zeros</span>(n); m[rng.<span class="fn">choice</span>(n, k, replace=<span class="kw">False</span>)] = <span class="num">1</span>
        bg = X_background[rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(X_background))]
        z = np.<span class="fn">where</span>(m, x, bg)
        masks.<span class="fn">append</span>(m); vals.<span class="fn">append</span>(<span class="fn">model</span>(z.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>])
        <span class="kw">from</span> math <span class="kw">import</span> comb
        weights.<span class="fn">append</span>((n-<span class="num">1</span>) / (<span class="fn">comb</span>(n,<span class="fn">int</span>(k)) * k * (n-k) + <span class="num">1e-9</span>))
    masks, weights, vals = np.<span class="fn">array</span>(masks), np.<span class="fn">array</span>(weights), np.<span class="fn">array</span>(vals)
    reg = <span class="fn">LinearRegression</span>().<span class="fn">fit</span>(masks, vals, sample_weight=weights)
    <span class="kw">return</span> reg.coef_, reg.intercept_

phi_k, base_k = <span class="fn">kernel_shap</span>(clf.predict_proba, X[<span class="num">0</span>], X, n_samples=<span class="num">400</span>)
<span class="fn">print</span>(<span class="str">'KernelSHAP estimate vs. exact:'</span>)
<span class="kw">for</span> f, e, k <span class="kw">in</span> <span class="fn">zip</span>(feats, phi, phi_k):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} exact={e:+.3f}   kernel={k:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>kernel_shap(model, x, X_background, n_samples)</code>, n öznitelik üzerinde <code>n_samples</code> rastgele ikili maske z' örnekler, rastgele bir arka plan satırı seçer ve z'ᵢ=1 olduğunda öznitelik i'yi x'ten, z'ᵢ=0 olduğunda arka plandan alarak bir girdi yeniden inşa eder. 2) Her örneklenmiş maskeyi Shapley çekirdeği <code>π_x(z') = (n−1) / (C(n,|z'|)·|z'|·(n−|z'|))</code> ile ağırlıklandırır ve modeli sorgulayarak f(h_x(z'))'yi alır. 3) Model çıktılarını maskeler üzerinde ağırlıklı bir LinearRegression ile fit eder — katsayılar KernelSHAP tahminleridir ve <code>n_samples → ∞</code> iken kesin Shapley değerlerine yakınsar.</p>

<p class="l-text">KernelSHAP herhangi bir model için çalışır ama yavaştır — açıklama başına <code>n_samples</code> model çağrısı, ve doğru sonuçlar için <code>O(n²)</code> örneğe ihtiyaç duyar. Derin ağlar için DeepSHAP (Lundberg &amp; Lee 2017, DeepLIFT üzerine inşa) daha hızlıdır: SHAP değerlerini her katman başına bir geçişte hesaplamak için referans aktivasyonlarla geri yayılım kullanır.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Üç Grafik: Kuvvet, Özet, Bağımlılık</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kuvvet grafiği (bir tahmin)</div><div class="card-body">Temel değerden <code>f(x)</code>'e bir bar; kırmızı oklar yukarı, mavi oklar aşağı iter, öznitelik ve değerle etiketlenir. Bir kullanıcıya tek bir kararı açıklamak için en iyisidir. Lundberg'in orijinal SHAP makalesi bunu hastane yeniden başvuru modeli için göstermiştir.</div></div>
<div class="calc-card"><div class="card-title">Özet / arıkovanı (küresel)</div><div class="card-body">Her öznitelik için her satıra bir nokta çiz, <code>x = SHAP değeri</code>, öznitelik değeriyle renklendir (kırmızı = yüksek, mavi = düşük). Öznitelik etkilerinin yönünü <em>ve</em> dağılımını ortaya koyar. Şimdiye kadar icat edilmiş tek en bilgilendirici ML yorumlanabilirlik grafiği.</div></div>
<div class="calc-card"><div class="card-title">Bağımlılık grafiği</div><div class="card-body">Bir öznitelik için, <code>(öznitelik_değeri, SHAP_değeri)</code> saçılımı, isteğe bağlı olarak etkileşen bir öznitelikle renklendirilmiş. Doğrusal olmayanları ve etkileşimleri gösterir; Lundberg'in "ağaç tabanlı etkileşim değerleri" uzantısı etkileşimleri kesin yapar.</div></div>
</div>

<p class="l-text">İki okuma kuralı. (1) Bir kararı açıklarken büyüklükten çok <em>işaret</em> önemlidir: "gelir" için küçük +0.05 SHAP hâlâ onaya doğru itiyordur. (2) Satırlar boyunca <em>büyüklük</em> küresel olarak önemlidir: bir arıkovanında ince yayılımlı bir öznitelik, yüksek bir ortalamaya sahip olsa bile az iş yapar.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Adillik Denetimi için SHAP</h2>
<p class="l-text">SHAP ve adillik faydalı şekilde birleşir. Her korunan grupta SHAP değerlerini ayrı ayrı hesapla ve karşılaştır: ortalama SHAP'i gruplar arasında keskin farklılaşan öznitelikler tam olarak önyargının modele girdiği kanallardır. Lundberg'in kendisi bu bağlantıyı <em>"Explaining Quantitative Measures of Fairness"</em> (FAccT 2020) çalışmasında yayımladı. Sorunu, azaltmaya başvurmadan önce yerelleştirir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Per-group SHAP comparison — find the bias channels</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
s = (rng.<span class="fn">random</span>(<span class="fn">len</span>(X)) &lt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)            <span class="cm"># synthetic group</span>

<span class="cm"># Compute SHAP on a sample from each group</span>
<span class="kw">def</span> <span class="fn">avg_shap</span>(idx):
    <span class="kw">return</span> np.<span class="fn">mean</span>([<span class="fn">shapley</span>(X[i]) <span class="kw">for</span> i <span class="kw">in</span> idx], axis=<span class="num">0</span>)

idx0 = np.<span class="fn">where</span>(s==<span class="num">0</span>)[<span class="num">0</span>][:<span class="num">8</span>]; idx1 = np.<span class="fn">where</span>(s==<span class="num">1</span>)[<span class="num">0</span>][:<span class="num">8</span>]
mean0, mean1 = <span class="fn">avg_shap</span>(idx0), <span class="fn">avg_shap</span>(idx1)
diff = mean1 - mean0
<span class="fn">print</span>(<span class="str">'Per-group SHAP difference (group=1 minus group=0):'</span>)
<span class="kw">for</span> f, d <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, diff), key=<span class="kw">lambda</span> t: -<span class="fn">abs</span>(t[<span class="num">1</span>])):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {d:+.3f}    (a positive value means feature pushes group 1 up more)'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>rng.random() &lt; 0.5</code>'ten ikili bir korunan özellik s üretir, sonra her gruptan ilk 8 satırı denetim örneği olarak alır. 2) Her gruptaki her satırda kesin <code>shapley(X[i])</code>'yi çağırır ve elde edilen vektörleri <code>np.mean(..., axis=0)</code> ile ortalayarak grup başına öznitelik başına ortalama SHAP'ı hesaplar. 3) Öznitelik başına SHAP farkını <code>mean1 − mean0</code> mutlak büyüklüğe göre sıralayıp yazdırır — en büyük farka sahip öznitelikler, grup üyeliğinin modeli etkilediği kanallardır.</p>

<p class="l-text">Büyük gruplar arası SHAP farkına sahip bir öznitelik, iki grup için farklı iş yapıyordur — ya model gruba özgü bir desen öğrendiği için ya da öznitelik dağılımı farklı olduğu için ve model bu dağılım kaymasına yanıt veriyor. Her iki durumda da, azaltmayı odaklayacağın yer burası.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. SHAP'ın Sınırları</h2>
<p class="l-text">SHAP, atıf yöntemleri arasında benzersizdir ama gerçek değildir. Pratikte üç sınırlama önemlidir:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Korelasyonlu öznitelikler</div><div class="card-body">Öznitelikler korelasyonlu olduğunda, "marjinal katkı" manifold dışı girdileri içerir (uzun bir kişinin boyunu nüfus ortalaması ile değiştirirken vücudunun geri kalanını sabit tutmak). Aas, Jullum &amp; Løland 2019 bunu ele almak için koşullu SHAP önerdi; değiş tokuş: daha az tanımlanabilir.</div></div>
<div class="calc-card"><div class="card-title">Nedensellik</div><div class="card-body">SHAP ilişkilendirmeyi atfeder, nedenselliği değil. Yüksek SHAP'a sahip bir öznitelik çekebileceğin bir kol olmak zorunda değildir. Janzing, Minorics &amp; Blöbaum (AISTATS 2020) nedensel SHAP varyantlarını araştırdı — eyleme dönük rota için faydalı (sonraki ders).</div></div>
<div class="calc-card"><div class="card-title">Adversarial kırılganlık</div><div class="card-body">Slack ve ark. (AIES 2020), SHAP ve LIME'nin adversarial olarak kandırılabileceğini gösterdi — bir model gerçek veride önyargılı olabilirken, arka plan dağılımının adversarial pertürbasyonları yoluyla temiz SHAP değerleri sunabilir. Her zaman ayrı tutulan bir denetim setiyle doğrula.</div></div>
</div>

<div class="calc-highlight"><strong>SHAP, bir model ve arka plan dağılımı verildiğinde doğrudur</strong>. Bunlar yanlışsa (korelasyonlu öznitelikler, manifold dışı arka planlar, adversarial eğitim), SHAP yanlış şey hakkında doğrudur. Onu bir kâhin olarak değil, bir mikroskop olarak ele al.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Sonraki</h2>
<p class="l-text">SHAP, özellik atfına titiz, aksiyomatik temelli yaklaşımdır. Üstel maliyet, ağaçlar için TreeSHAP ve diğer her şey için KernelSHAP/DeepSHAP ile çözülür ve üç grafik — kuvvet, özet, bağımlılık — üretim ekiplerinin gerçekten kullandığı yerelden küresele görünüm verir.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Shapley değerleri, verimlilik, simetri, kukla, toplama (Lundberg-Lee 2017) sağlayan <em>tek</em> atıftır.</li>
<li>Ağaçlar için TreeSHAP polinom zamanda kesindir. Kara kutular için ağırlıklı doğrusal regresyon yoluyla KernelSHAP. Ağlar için referans aktivasyon geri yayılımı yoluyla DeepSHAP.</li>
<li>Bir tahmin için kuvvet grafiği; küresel için arıkovanı; bir özniteliğin tam etki eğrisi için bağımlılık.</li>
<li>Grup başına SHAP karşılaştırması, önyargının modele girdiği yeri yerelleştirir — L3'teki azaltmalarla eşleştir.</li>
<li>Korelasyonlu öznitelikler ve adversarial eğitim SHAP'ı kırabilir. Ayrı tutulan bir adillik denetim setiyle doğrula.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L5</strong>, daha hızlı, daha az titiz ama daha esnek bir alternatif olan LIME'i kapsar — bir tahminin etrafına yerel doğrusal vekil oturtur. <strong>L6</strong>, "ne önemliydi"den "neyi değiştirebilirdi"e karşı-olgu açıklamalarıyla geçer.</p>
</div>`
};
