window.CAUSAL_L4 = {
en: `<p class="l-text">Identification (lessons 2-3) tells us a causal effect can be computed; <strong>estimation</strong> tells us how to compute it from finite, noisy data. Real datasets don't deliver clean stratified populations — they deliver thousands of users with different covariates, sparse coverage, and missing overlap. We need estimators that combine outcome models and treatment models in robust ways.</p>
<p class="l-text">In this lesson we walk through the canonical estimands — ATE, ATT, ITE — and the four workhorse estimators every causal practitioner reaches for: <em>regression adjustment</em>, <em>propensity-score weighting (IPW)</em>, <em>matching</em>, and the gold-standard <em>doubly robust (DR) estimator</em>. Each gets implemented from scratch in scikit-learn on the churn dataset, so you can see the bias correction happen in real numbers.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>The Neyman–Rubin potential outcomes framework</li>
<li>ATE, ATT, ATU, ITE — what each estimand means and when to use it</li>
<li>Propensity score: definition, estimation, and the overlap diagnostic</li>
<li>Inverse Propensity Weighting (IPW) — the Horvitz-Thompson estimator</li>
<li>Matching: 1-to-1, k-NN, caliper-based</li>
<li>Doubly robust estimation — error-correction from two models</li>
<li>Counterfactual prediction at the individual level (ITE)</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Potential Outcomes — The Rubin Framework</h2>
<p class="l-text">Each unit i has two potential outcomes: Y_i(1) if treated, Y_i(0) if untreated. Only one is ever observed — the <em>fundamental problem of causal inference</em> (Holland 1986). The treatment effect is:</p>
<div class="katex-block">$$\\tau_i = Y_i(1) - Y_i(0)$$</div>
<p class="l-text">We can never see τ_i for any single unit. But under unconfoundedness (Y(0), Y(1) ⊥ T | X) and overlap (0 &lt; e(X) &lt; 1), we can estimate population averages.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ATE (Average Treatment Effect)</div><div class="card-body">E[Y(1) - Y(0)] over the whole population. The "if we treated everyone vs. nobody" answer.</div></div>
<div class="calc-card"><div class="card-title">ATT (on the Treated)</div><div class="card-body">E[Y(1) - Y(0) | T=1]. Useful when policy targets only the treated subgroup.</div></div>
<div class="calc-card"><div class="card-title">ATU (on the Untreated)</div><div class="card-body">E[Y(1) - Y(0) | T=0]. "What would the untreated have gained?"</div></div>
<div class="calc-card"><div class="card-title">ITE / CATE</div><div class="card-body">τ(x) = E[Y(1) - Y(0) | X=x]. Per-individual or per-subgroup; central to personalization.</div></div>
</div>
<div class="katex-block">$$\\text{ATE} = E[Y(1) - Y(0)] \\qquad \\text{ATT} = E[Y(1) - Y(0) \\mid T=1]$$</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Regression Adjustment (G-formula)</h2>
<p class="l-text">Fit μ̂_t(x) = E[Y | T=t, X=x] with any regressor, then average:</p>
<div class="katex-block">$$\\widehat{\\text{ATE}} = \\frac{1}{n}\\sum_i \\bigl[ \\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i) \\bigr]$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor

df = df_churn.<span class="fn">copy</span>()
<span class="cm"># Synthesize a treatment: "received retention discount" (T)</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values

<span class="cm"># Two outcome models</span>
mu1 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>)
mu0 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>)
mu1.<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
mu0.<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])

<span class="cm"># Predict counterfactuals for everyone</span>
y1 = mu1.<span class="fn">predict</span>(X)
y0 = mu0.<span class="fn">predict</span>(X)
ate = (y1 - y0).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Regression-adjustment ATE: {ate:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) synthesizes a binary treatment <code>T</code> ("retention discount") whose probability rises with <code>support_calls&gt;2</code>, then builds <code>X</code> from tenure, charge and support calls. 2) fits two separate <code>RandomForestRegressor</code> outcome models — <code>mu1</code> on the treated rows and <code>mu0</code> on the controls — so each model represents <em>E[Y | T=t, X]</em>. 3) predicts both counterfactuals for every unit (<code>y1 = mu1.predict(X)</code>, <code>y0 = mu0.predict(X)</code>) and averages the differences, implementing the G-formula ATE.</p>
<p class="l-text">Strength: easy. Weakness: relies entirely on the outcome model being correctly specified — if μ_t is wrong, the estimate is biased.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Propensity Score</h2>
<p class="l-text">Rosenbaum &amp; Rubin (1983) defined the propensity score:</p>
<div class="katex-block">$$e(x) = P(T=1 \\mid X=x)$$</div>
<p class="l-text">Their key theorem: if X is sufficient for unconfoundedness, then e(X) alone is also sufficient. We collapse a high-dimensional adjustment into one scalar. Estimation is just a binary classifier.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values

<span class="cm"># Estimate propensity score</span>
ps_model = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, T)
e = ps_model.<span class="fn">predict_proba</span>(X)[:,<span class="num">1</span>]

<span class="fn">print</span>(f<span class="str">"Propensity score range: [{e.min():.3f}, {e.max():.3f}]"</span>)
<span class="fn">print</span>(f<span class="str">"Mean among treated:   {e[T==1].mean():.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean among untreated: {e[T==0].mean():.3f}"</span>)
<span class="cm"># Overlap diagnostic</span>
<span class="fn">print</span>(f<span class="str">"\\nUnits with e &lt; 0.05 or e &gt; 0.95 (poor overlap): {((e&lt;0.05)|(e&gt;0.95)).sum()}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) regenerates the same synthetic treatment <code>T</code> and covariate matrix <code>X</code>. 2) fits a <code>LogisticRegression</code> of <code>T</code> on <code>X</code> and reads off <code>e = predict_proba(X)[:,1]</code> — that is the propensity score <em>P(T=1|X)</em>. 3) prints the score range, the average propensity inside the treated and control groups (which should differ — that is the confounding signature), and counts units with <code>e&lt;0.05</code> or <code>e&gt;0.95</code> as an overlap diagnostic.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem"><strong>Overlap (positivity):</strong> every covariate value must have a positive chance of receiving each treatment. If e(x)≈0 or e(x)≈1 for many units, IPW blows up. Trim or clip.</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Inverse Propensity Weighting (IPW)</h2>
<p class="l-text">The Horvitz–Thompson estimator weights treated units by 1/e(X) and controls by 1/(1-e(X)) to reconstruct the population:</p>
<div class="katex-block">$$\\hat{\\tau}_{\\text{IPW}} = \\frac{1}{n}\\sum_i \\Bigl( \\frac{T_i Y_i}{e(X_i)} - \\frac{(1-T_i) Y_i}{1-e(X_i)} \\Bigr)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

e = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X,T).<span class="fn">predict_proba</span>(X)[:,<span class="num">1</span>]
e = np.<span class="fn">clip</span>(e, <span class="num">0.05</span>, <span class="num">0.95</span>)   <span class="cm"># trim for stability</span>

ipw = (T*Y/e - (<span class="num">1</span>-T)*Y/(<span class="num">1</span>-e)).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"IPW ATE estimate: {ipw:+.4f}"</span>)

<span class="cm"># Stabilized IPW (Hernán &amp; Robins) — divides by sum of weights, lower variance</span>
w_t = T/e; w_c = (<span class="num">1</span>-T)/(<span class="num">1</span>-e)
sipw = ((w_t*Y).<span class="fn">sum</span>()/w_t.<span class="fn">sum</span>()) - ((w_c*Y).<span class="fn">sum</span>()/w_c.<span class="fn">sum</span>())
<span class="fn">print</span>(f<span class="str">"Stabilized IPW:   {sipw:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) estimates the propensity <code>e</code> with logistic regression and clips it to <code>[0.05, 0.95]</code> so extreme weights cannot dominate. 2) plugs the clipped propensity into the Horvitz–Thompson formula <code>(T·Y/e − (1−T)·Y/(1−e)).mean()</code> to get the raw IPW ATE. 3) builds normalized weights <code>w_t = T/e</code> and <code>w_c = (1−T)/(1−e)</code> and computes the stabilized IPW as the difference of weighted averages, which lowers variance when the weight sums drift from <code>n</code>.</p>
<p class="l-text">IPW is unbiased if the propensity model is correct. Variance can be huge when weights are extreme — clipping or stabilization helps.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Matching</h2>
<p class="l-text">For each treated unit, find a control with similar covariates (or similar propensity score) and pair them. The mean outcome difference within pairs estimates ATT.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Propensity-score matching (1-to-1, with replacement)</span>
e = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X,T).<span class="fn">predict_proba</span>(X)[:,<span class="num">1</span>]
treated_idx = np.<span class="fn">where</span>(T==<span class="num">1</span>)[<span class="num">0</span>]; control_idx = np.<span class="fn">where</span>(T==<span class="num">0</span>)[<span class="num">0</span>]
nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">1</span>).<span class="fn">fit</span>(e[control_idx].<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>))
_, m = nn.<span class="fn">kneighbors</span>(e[treated_idx].<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>))
matched_controls = control_idx[m.<span class="fn">flatten</span>()]

att = (Y[treated_idx] - Y[matched_controls]).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Matching ATT: {att:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Matched {len(treated_idx)} treated to {len(np.unique(matched_controls))} unique controls"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) estimates the propensity score <code>e</code> for every row and splits the indices into <code>treated_idx</code> and <code>control_idx</code>. 2) fits a <code>NearestNeighbors(n_neighbors=1)</code> on the 1-D propensity values of the controls and, for each treated unit, queries the closest control — this is 1-to-1 propensity-score matching with replacement. 3) takes the mean of <code>Y[treated_idx] − Y[matched_controls]</code> as the ATT estimate and reports how many distinct controls were re-used.</p>
<p class="l-text">Matching trades a clean intuition (compare like with like) for sample-size loss and discreteness. Caliper variants reject matches beyond a threshold; <em>genetic matching</em> (Diamond &amp; Sekhon 2013) optimizes balance directly.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Doubly Robust Estimation</h2>
<p class="l-text">DR (Robins, Rotnitzky, Zhao 1994) combines outcome and propensity models such that the estimator is consistent if <em>either</em> is correct (not necessarily both):</p>
<div class="katex-block">$$\\hat{\\tau}_{\\text{DR}} = \\frac{1}{n}\\sum_i \\Bigl[ \\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i) + \\frac{T_i (Y_i - \\hat{\\mu}_1(X_i))}{\\hat{e}(X_i)} - \\frac{(1-T_i)(Y_i - \\hat{\\mu}_0(X_i))}{1-\\hat{e}(X_i)} \\Bigr]$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Propensity</span>
e = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X,T).<span class="fn">predict_proba</span>(X)[:,<span class="num">1</span>]
e = np.<span class="fn">clip</span>(e, <span class="num">0.05</span>, <span class="num">0.95</span>)
<span class="cm"># Outcome models</span>
mu1 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">150</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
mu0 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">150</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
y1 = mu1.<span class="fn">predict</span>(X); y0 = mu0.<span class="fn">predict</span>(X)

dr = (y1 - y0 + T*(Y-y1)/e - (<span class="num">1</span>-T)*(Y-y0)/(<span class="num">1</span>-e)).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Doubly Robust ATE: {dr:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fits a logistic propensity model and clips its output to a safe range. 2) fits two <code>RandomForestRegressor</code> outcome models (<code>mu1</code> on the treated, <code>mu0</code> on the controls) and predicts both potential outcomes <code>y1</code> and <code>y0</code> for every row. 3) combines the two in the doubly-robust formula <code>y1 − y0 + T·(Y−y1)/e − (1−T)·(Y−y0)/(1−e)</code> and averages; the residual-IPW correction makes the estimate consistent if either the outcome model or the propensity model is correct.</p>
<p class="l-text">DR is the practical default. It survives misspecification of one of the two nuisance models and forms the backbone of modern causal ML (Lesson 5: DML).</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Individual Treatment Effects (ITE)</h2>
<p class="l-text">Population averages are useful for policy but irrelevant for personalization. ITE asks: <em>for this specific user, what is the predicted treatment effect?</em></p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># T-learner: fit one model per arm, take difference</span>
mu1 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
mu0 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
ite = mu1.<span class="fn">predict</span>(X) - mu0.<span class="fn">predict</span>(X)

<span class="fn">print</span>(f<span class="str">"ITE distribution:"</span>)
<span class="fn">print</span>(f<span class="str">"  mean (= ATE): {ite.mean():+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"  std:          {ite.std():.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"  min:          {ite.min():+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"  max:          {ite.max():+.4f}"</span>)
<span class="cm"># Highest-effect quartile = best targets for the policy</span>
top = np.<span class="fn">argsort</span>(ite)[-<span class="num">10</span>:]
<span class="fn">print</span>(f<span class="str">"\\nTop-10 ITE users:\\n"</span>, df.iloc[top][[<span class="str">'tenure_months'</span>,<span class="str">'support_calls'</span>,<span class="str">'churned'</span>]])
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) implements the <em>T-learner</em>: trains <code>mu1</code> only on the treated and <code>mu0</code> only on the controls, then forms the per-row ITE as <code>mu1.predict(X) − mu0.predict(X)</code>. 2) prints summary statistics — mean (which equals the ATE), standard deviation, min and max — to expose the spread of individual effects. 3) sorts ITEs and prints the top-10 rows from the dataframe; these are the users with the largest predicted treatment effect and therefore the best targeting candidates.</p>
<p class="l-text">This T-learner is the simplest meta-learner. S-learner uses one model with T as a feature; X-learner (Künzel 2019) and DR-learner (Kennedy 2020) are more efficient.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Counterfactual Prediction Demo</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

df = df_churn.<span class="fn">copy</span>()
features = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
X = df[features].values
y = df[<span class="str">'churned'</span>].values

clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)

<span class="cm"># Pick a user. What is their churn probability?</span>
user = X[<span class="num">0</span>:<span class="num">1</span>].<span class="fn">copy</span>()
p_factual = clf.<span class="fn">predict_proba</span>(user)[<span class="num">0</span>,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"User 0 features: {dict(zip(features, user[0]))}"</span>)
<span class="fn">print</span>(f<span class="str">"Factual P(churn): {p_factual:.3f}"</span>)

<span class="cm"># COUNTERFACTUAL: what if support_calls had been 0?</span>
user_cf = user.<span class="fn">copy</span>(); user_cf[<span class="num">0</span>,<span class="num">2</span>] = <span class="num">0</span>
p_cf = clf.<span class="fn">predict_proba</span>(user_cf)[<span class="num">0</span>,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Counterfactual (support_calls=0) P(churn): {p_cf:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Predicted individual effect of zero support calls: {p_factual - p_cf:+.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) trains a <code>RandomForestClassifier</code> on <code>X = [tenure, charge, support_calls]</code> to predict <code>churned</code>. 2) selects a single row (<code>user = X[0:1]</code>) and reads its factual churn probability from <code>predict_proba</code>. 3) makes a copy <code>user_cf</code> with <code>support_calls</code> manually set to <code>0</code>, reads the counterfactual churn probability, and prints the per-individual gap — a model-based estimate of "what would have happened to this user with zero support calls".</p>
<p class="l-text">Caveat: this is <em>predictive</em> counterfactual under the assumption that the model captures the true causal mechanism — only valid if confounding is fully adjusted. Lesson 5's TARNet/Dragonnet handle this with explicit causal architectures.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Estimator Cheat Sheet</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Regression adjustment</div><div class="card-body">Cheap. Biased if outcome model wrong. Best for low-dimensional X.</div></div>
<div class="calc-card"><div class="card-title">IPW</div><div class="card-body">Unbiased if propensity correct. High variance with extreme weights. Always trim.</div></div>
<div class="calc-card"><div class="card-title">Matching</div><div class="card-body">Intuitive, transparent. Good for ATT. Loses sample size.</div></div>
<div class="calc-card"><div class="card-title">Doubly Robust</div><div class="card-body">Default choice. Consistent if either model is right. Use ML for nuisance estimation.</div></div>
<div class="calc-card"><div class="card-title">T/S/X-learner</div><div class="card-body">For ITE / CATE. Choose by sample size and treatment imbalance.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Lesson 5 takes these foundations into modern causal machine learning: causal forests (Wager-Athey 2018), Double Machine Learning (Chernozhukov 2017), and neural counterfactual models (TARNet, Dragonnet).</div>
</div>`,
tr: `<p class="l-text">Tanımlama (dersler 2-3) bize bir nedensel etkinin hesaplanabileceğini söyler; <strong>tahmin</strong> bize sonlu, gürültülü verilerden nasıl hesaplayacağımızı söyler. Gerçek veri setleri temiz tabakalandırılmış popülasyonlar sunmaz — farklı ortak değişkenleri olan binlerce kullanıcı, seyrek kapsama ve eksik örtüşme sunar. Sonuç modelleri ile tedavi modellerini sağlam yollarla birleştiren tahmin edicilere ihtiyacımız var.</p>
<p class="l-text">Bu derste kanonik tahminleri — ATE, ATT, ITE — ve her nedensel uygulayıcının başvurduğu dört iş atı tahmin ediciyi gözden geçiriyoruz: <em>regresyon ayarlaması</em>, <em>eğilim skoru ağırlıklandırma (IPW)</em>, <em>eşleştirme</em> ve altın standart <em>çift sağlam (DR) tahmin edici</em>. Her biri churn veri seti üzerinde scikit-learn'de sıfırdan uygulanır, böylece yanlılık düzeltmesinin gerçek sayılarda gerçekleştiğini görebilirsiniz.</p>
<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Neyman–Rubin potansiyel sonuçlar çerçevesi</li>
<li>ATE, ATT, ATU, ITE — her bir tahmininin anlamı ve ne zaman kullanılacağı</li>
<li>Eğilim skoru: tanım, tahmin ve örtüşme tanılama</li>
<li>Ters Eğilim Ağırlıklandırma (IPW) — Horvitz-Thompson tahmin edicisi</li>
<li>Eşleştirme: 1-e-1, k-NN, çap tabanlı</li>
<li>Çift sağlam tahmin — iki modelden hata düzeltme</li>
<li>Bireysel düzeyde karşı-olgu tahmini (ITE)</li>
</ul>
</div>

<div class="lesson-block" id="section-1"><h2 class="lesson-title">1. Potansiyel Sonuçlar — Rubin Çerçevesi</h2>
<p class="l-text">Her birim i'nin iki potansiyel sonucu vardır: tedavi edilirse Y_i(1), edilmezse Y_i(0). Yalnızca biri gözlemlenir — <em>nedensel çıkarımın temel problemi</em> (Holland 1986). Tedavi etkisi:</p>
<div class="katex-block">$$\\tau_i = Y_i(1) - Y_i(0)$$</div>
<p class="l-text">Hiçbir tek birim için τ_i'yi asla göremeyiz. Ama karıştırılmamışlık (Y(0), Y(1) ⊥ T | X) ve örtüşme (0 &lt; e(X) &lt; 1) altında, popülasyon ortalamalarını tahmin edebiliriz.</p>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">ATE (Ortalama Tedavi Etkisi)</div><div class="card-body">Tüm popülasyon üzerinden E[Y(1) - Y(0)]. "Herkesi tedavi etseydik vs. hiç kimseyi" cevabı.</div></div>
<div class="calc-card"><div class="card-title">ATT (Tedavi Edilenler Üzerinde)</div><div class="card-body">E[Y(1) - Y(0) | T=1]. Politika yalnızca tedavi edilen alt grubu hedeflediğinde yararlı.</div></div>
<div class="calc-card"><div class="card-title">ATU (Tedavi Edilmeyenler Üzerinde)</div><div class="card-body">E[Y(1) - Y(0) | T=0]. "Tedavi edilmemiş olanlar ne kazanırdı?"</div></div>
<div class="calc-card"><div class="card-title">ITE / CATE</div><div class="card-body">τ(x) = E[Y(1) - Y(0) | X=x]. Birey-başına veya alt-grup-başına; kişiselleştirme için merkezi.</div></div>
</div>
<div class="katex-block">$$\\text{ATE} = E[Y(1) - Y(0)] \\qquad \\text{ATT} = E[Y(1) - Y(0) \\mid T=1]$$</div>
</div>

<div class="lesson-block" id="section-2"><h2 class="lesson-title">2. Regresyon Ayarlaması (G-formülü)</h2>
<p class="l-text">Herhangi bir regresörle μ_t(x) = E[Y | T=t, X=x] uydur, sonra ortalama al:</p>
<div class="katex-block">$$\\widehat{\\text{ATE}} = \\frac{1}{n}\\sum_i \\bigl[ \\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i) \\bigr]$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor

df = df_churn.<span class="fn">copy</span>()
<span class="cm"># Synthesize a treatment: "received retention discount" (T)</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values

<span class="cm"># Two outcome models</span>
mu1 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>)
mu0 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>)
mu1.<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
mu0.<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])

<span class="cm"># Predict counterfactuals for everyone</span>
y1 = mu1.<span class="fn">predict</span>(X)
y0 = mu0.<span class="fn">predict</span>(X)
ate = (y1 - y0).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Regression-adjustment ATE: {ate:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) olasılığı <code>support_calls&gt;2</code> ile yükselen ikili bir tedavi <code>T</code> ("retention discount") sentezliyor, ardından <code>X</code>'i tenure, charge ve support_calls'tan kuruyor. 2) iki ayrı <code>RandomForestRegressor</code> sonuç modeli eğitiyor — <code>mu1</code> tedavi edilen satırlar üzerinde, <code>mu0</code> kontroller üzerinde — böylece her model <em>E[Y | T=t, X]</em>'i temsil ediyor. 3) her birey için iki karşı-olguyu da tahmin ediyor (<code>y1 = mu1.predict(X)</code>, <code>y0 = mu0.predict(X)</code>) ve farkların ortalamasını alarak G-formülü ATE'sini uyguluyor.</p>
<p class="l-text">Güçlü yanı: kolay. Zayıf yanı: tamamen sonuç modelinin doğru belirtilmiş olmasına dayanır — μ_t yanlışsa, tahmin yanlıdır.</p>
</div>

<div class="lesson-block" id="section-3"><h2 class="lesson-title">3. Eğilim Skoru</h2>
<p class="l-text">Rosenbaum &amp; Rubin (1983) eğilim skorunu tanımladı:</p>
<div class="katex-block">$$e(x) = P(T=1 \\mid X=x)$$</div>
<p class="l-text">Anahtar teoremleri: eğer X karıştırılmamışlık için yeterliyse, o zaman e(X) tek başına da yeterlidir. Yüksek boyutlu bir ayarlamayı tek bir skalere indirgedik. Tahmin sadece bir ikili sınıflandırıcıdır.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values

<span class="cm"># Estimate propensity score</span>
ps_model = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X, T)
e = ps_model.<span class="fn">predict_proba</span>(X)[:,<span class="num">1</span>]

<span class="fn">print</span>(f<span class="str">"Propensity score range: [{e.min():.3f}, {e.max():.3f}]"</span>)
<span class="fn">print</span>(f<span class="str">"Mean among treated:   {e[T==1].mean():.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean among untreated: {e[T==0].mean():.3f}"</span>)
<span class="cm"># Overlap diagnostic</span>
<span class="fn">print</span>(f<span class="str">"\\nUnits with e &lt; 0.05 or e &gt; 0.95 (poor overlap): {((e&lt;0.05)|(e&gt;0.95)).sum()}"</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) aynı sentetik tedavi <code>T</code> ve ortak değişken matrisi <code>X</code> yeniden üretiliyor. 2) <code>T</code>'yi <code>X</code>'e regresleyen bir <code>LogisticRegression</code> eğitiliyor ve <code>e = predict_proba(X)[:,1]</code> okunuyor — bu eğilim skoru <em>P(T=1|X)</em>'tir. 3) skorun aralığı, tedavi edilen ve kontrol grupları içindeki ortalama eğilimler (farklı olmalı — karıştırmanın imzası budur) ve örtüşme tanılaması için <code>e&lt;0.05</code> ya da <code>e&gt;0.95</code> olan birim sayısı yazdırılıyor.</p>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem"><strong>Örtüşme (pozitiflik):</strong> her ortak değişken değeri her tedaviyi alma şansına pozitif olarak sahip olmalıdır. Birçok birim için e(x)≈0 veya e(x)≈1 ise, IPW patlar. Kırp veya kıs.</div>
</div>

<div class="lesson-block" id="section-4"><h2 class="lesson-title">4. Ters Eğilim Ağırlıklandırma (IPW)</h2>
<p class="l-text">Horvitz–Thompson tahmin edicisi, popülasyonu yeniden inşa etmek için tedavi edilen birimleri 1/e(X) ile ve kontrolleri 1/(1-e(X)) ile ağırlıklandırır:</p>
<div class="katex-block">$$\\hat{\\tau}_{\\text{IPW}} = \\frac{1}{n}\\sum_i \\Bigl( \\frac{T_i Y_i}{e(X_i)} - \\frac{(1-T_i) Y_i}{1-e(X_i)} \\Bigr)$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

e = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X,T).<span class="fn">predict_proba</span>(X)[:,<span class="num">1</span>]
e = np.<span class="fn">clip</span>(e, <span class="num">0.05</span>, <span class="num">0.95</span>)   <span class="cm"># trim for stability</span>

ipw = (T*Y/e - (<span class="num">1</span>-T)*Y/(<span class="num">1</span>-e)).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"IPW ATE estimate: {ipw:+.4f}"</span>)

<span class="cm"># Stabilized IPW (Hernán &amp; Robins) — divides by sum of weights, lower variance</span>
w_t = T/e; w_c = (<span class="num">1</span>-T)/(<span class="num">1</span>-e)
sipw = ((w_t*Y).<span class="fn">sum</span>()/w_t.<span class="fn">sum</span>()) - ((w_c*Y).<span class="fn">sum</span>()/w_c.<span class="fn">sum</span>())
<span class="fn">print</span>(f<span class="str">"Stabilized IPW:   {sipw:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) eğilim <code>e</code>'yi lojistik regresyonla tahmin ediyor ve aşırı ağırlıklar ezici olmasın diye <code>[0.05, 0.95]</code> aralığına kırpıyor. 2) kırpılmış eğilimi Horvitz–Thompson formülüne <code>(T·Y/e − (1−T)·Y/(1−e)).mean()</code> takıp ham IPW ATE'sini elde ediyor. 3) <code>w_t = T/e</code> ve <code>w_c = (1−T)/(1−e)</code> normalize ağırlıklarını oluşturup stabilize IPW'yi ağırlıklı ortalamaların farkı olarak hesaplıyor; bu, ağırlık toplamları <code>n</code>'den uzaklaştığında varyansı düşürüyor.</p>
<p class="l-text">IPW, eğilim modeli doğruysa yansızdır. Aşırı ağırlıklarla varyans çok büyük olabilir — kırpma veya stabilizasyon yardımcı olur.</p>
</div>

<div class="lesson-block" id="section-5"><h2 class="lesson-title">5. Eşleştirme</h2>
<p class="l-text">Her tedavi edilen birim için, benzer ortak değişkenli (veya benzer eğilim skorlu) bir kontrol bul ve onları eşleştir. Çiftler içindeki ortalama sonuç farkı ATT'yi tahmin eder.</p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Propensity-score matching (1-to-1, with replacement)</span>
e = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X,T).<span class="fn">predict_proba</span>(X)[:,<span class="num">1</span>]
treated_idx = np.<span class="fn">where</span>(T==<span class="num">1</span>)[<span class="num">0</span>]; control_idx = np.<span class="fn">where</span>(T==<span class="num">0</span>)[<span class="num">0</span>]
nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">1</span>).<span class="fn">fit</span>(e[control_idx].<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>))
_, m = nn.<span class="fn">kneighbors</span>(e[treated_idx].<span class="fn">reshape</span>(-<span class="num">1</span>,<span class="num">1</span>))
matched_controls = control_idx[m.<span class="fn">flatten</span>()]

att = (Y[treated_idx] - Y[matched_controls]).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Matching ATT: {att:+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Matched {len(treated_idx)} treated to {len(np.unique(matched_controls))} unique controls"</span>)
</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) her satır için eğilim skoru <code>e</code> tahmin edilip indeksler <code>treated_idx</code> ve <code>control_idx</code> olarak ayrılıyor. 2) kontrollerin 1-boyutlu eğilim değerleri üzerinde <code>NearestNeighbors(n_neighbors=1)</code> fit ediliyor; her tedavi edilen birim için en yakın kontrol sorgulanıyor — bu, yerine koyma ile yapılan 1-e-1 eğilim-skoru eşleştirmesidir. 3) <code>Y[treated_idx] − Y[matched_controls]</code> ortalaması ATT tahmini olarak alınıyor ve kaç farklı kontrolün yeniden kullanıldığı raporlanıyor.</p>
<p class="l-text">Eşleştirme, temiz sezgiyi (benzeri benzeri ile karşılaştır) örneklem-büyüklüğü kaybı ve süreksizlik için takas eder. Çap varyantları eşiğin ötesindeki eşleşmeleri reddeder; <em>genetik eşleştirme</em> (Diamond &amp; Sekhon 2013) doğrudan dengeyi optimize eder.</p>
</div>

<div class="lesson-block" id="section-6"><h2 class="lesson-title">6. Çift Sağlam Tahmin</h2>
<p class="l-text">DR (Robins, Rotnitzky, Zhao 1994) sonuç ve eğilim modellerini, tahmin edicinin <em>her ikisinden biri</em> doğruysa tutarlı olacak şekilde birleştirir (her ikisi olması gerekmez):</p>
<div class="katex-block">$$\\hat{\\tau}_{\\text{DR}} = \\frac{1}{n}\\sum_i \\Bigl[ \\hat{\\mu}_1(X_i) - \\hat{\\mu}_0(X_i) + \\frac{T_i (Y_i - \\hat{\\mu}_1(X_i))}{\\hat{e}(X_i)} - \\frac{(1-T_i)(Y_i - \\hat{\\mu}_0(X_i))}{1-\\hat{e}(X_i)} \\Bigr]$$</div>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># Propensity</span>
e = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>).<span class="fn">fit</span>(X,T).<span class="fn">predict_proba</span>(X)[:,<span class="num">1</span>]
e = np.<span class="fn">clip</span>(e, <span class="num">0.05</span>, <span class="num">0.95</span>)
<span class="cm"># Outcome models</span>
mu1 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">150</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
mu0 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">150</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
y1 = mu1.<span class="fn">predict</span>(X); y0 = mu0.<span class="fn">predict</span>(X)

dr = (y1 - y0 + T*(Y-y1)/e - (<span class="num">1</span>-T)*(Y-y0)/(<span class="num">1</span>-e)).<span class="fn">mean</span>()
<span class="fn">print</span>(f<span class="str">"Doubly Robust ATE: {dr:+.4f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) lojistik bir eğilim modeli fit edip çıktısını güvenli aralığa kırpıyor. 2) iki <code>RandomForestRegressor</code> sonuç modeli eğitiyor (<code>mu1</code> tedavi edilenler, <code>mu0</code> kontroller üzerinde) ve her satır için iki potansiyel sonucu <code>y1</code> ve <code>y0</code> olarak tahmin ediyor. 3) ikisini çift-sağlam formülde <code>y1 − y0 + T·(Y−y1)/e − (1−T)·(Y−y0)/(1−e)</code> birleştirip ortalama alıyor; rezidüel-IPW düzeltmesi, sonuç modeli ya da eğilim modelinden biri doğru olduğunda tahmini tutarlı kılıyor.</p>
<p class="l-text">DR pratik varsayılandır. İki yardımcı modelden birinin yanlış belirtilmesinden kurtulur ve modern nedensel ML'in (Ders 5: DML) belkemiğini oluşturur.</p>
</div>

<div class="lesson-block" id="section-7"><h2 class="lesson-title">7. Bireysel Tedavi Etkileri (ITE)</h2>
<p class="l-text">Popülasyon ortalamaları politika için yararlıdır ama kişiselleştirme için alakasızdır. ITE şunu sorar: <em>bu spesifik kullanıcı için, tahmin edilen tedavi etkisi nedir?</em></p>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor

df = df_churn.<span class="fn">copy</span>()
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
df[<span class="str">'T'</span>] = np.random.<span class="fn">binomial</span>(<span class="num">1</span>, <span class="num">0.3</span> + <span class="num">0.4</span>*(df[<span class="str">'support_calls'</span>]&gt;<span class="num">2</span>), <span class="fn">len</span>(df))
X = df[[<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]].values
T = df[<span class="str">'T'</span>].values; Y = df[<span class="str">'churned'</span>].values.<span class="fn">astype</span>(<span class="fn">float</span>)

<span class="cm"># T-learner: fit one model per arm, take difference</span>
mu1 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">1</span>], Y[T==<span class="num">1</span>])
mu0 = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X[T==<span class="num">0</span>], Y[T==<span class="num">0</span>])
ite = mu1.<span class="fn">predict</span>(X) - mu0.<span class="fn">predict</span>(X)

<span class="fn">print</span>(f<span class="str">"ITE distribution:"</span>)
<span class="fn">print</span>(f<span class="str">"  mean (= ATE): {ite.mean():+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"  std:          {ite.std():.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"  min:          {ite.min():+.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"  max:          {ite.max():+.4f}"</span>)
<span class="cm"># Highest-effect quartile = best targets for the policy</span>
top = np.<span class="fn">argsort</span>(ite)[-<span class="num">10</span>:]
<span class="fn">print</span>(f<span class="str">"\\nTop-10 ITE users:\\n"</span>, df.iloc[top][[<span class="str">'tenure_months'</span>,<span class="str">'support_calls'</span>,<span class="str">'churned'</span>]])
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <em>T-öğreniciyi</em> uyguluyor: <code>mu1</code> yalnızca tedavi edilenler üzerinde, <code>mu0</code> yalnızca kontroller üzerinde eğitilip her satır için ITE <code>mu1.predict(X) − mu0.predict(X)</code> olarak çıkarılıyor. 2) bireysel etkilerin yayılımını göstermek için ortalama (ATE'ye eşit), standart sapma, min ve max yazdırılıyor. 3) ITE'ler sıralanıp dataframe'in en yüksek 10 satırı yazdırılıyor; bunlar en büyük tahmini tedavi etkisine sahip kullanıcılar ve bu yüzden en iyi hedefleme adayları.</p>
<p class="l-text">Bu T-öğrenici, en basit meta-öğrenicidir. S-öğrenici T'yi özellik olarak tek bir modelle kullanır; X-öğrenici (Künzel 2019) ve DR-öğrenici (Kennedy 2020) daha verimlidir.</p>
</div>

<div class="lesson-block" id="section-8"><h2 class="lesson-title">8. Karşı-Olgu Tahmin Demosu</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.innerText)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

df = df_churn.<span class="fn">copy</span>()
features = [<span class="str">'tenure_months'</span>,<span class="str">'monthly_charge'</span>,<span class="str">'support_calls'</span>]
X = df[features].values
y = df[<span class="str">'churned'</span>].values

clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)

<span class="cm"># Pick a user. What is their churn probability?</span>
user = X[<span class="num">0</span>:<span class="num">1</span>].<span class="fn">copy</span>()
p_factual = clf.<span class="fn">predict_proba</span>(user)[<span class="num">0</span>,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"User 0 features: {dict(zip(features, user[0]))}"</span>)
<span class="fn">print</span>(f<span class="str">"Factual P(churn): {p_factual:.3f}"</span>)

<span class="cm"># COUNTERFACTUAL: what if support_calls had been 0?</span>
user_cf = user.<span class="fn">copy</span>(); user_cf[<span class="num">0</span>,<span class="num">2</span>] = <span class="num">0</span>
p_cf = clf.<span class="fn">predict_proba</span>(user_cf)[<span class="num">0</span>,<span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Counterfactual (support_calls=0) P(churn): {p_cf:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Predicted individual effect of zero support calls: {p_factual - p_cf:+.3f}"</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>X = [tenure, charge, support_calls]</code> üzerinde <code>churned</code>'i tahmin etmek için bir <code>RandomForestClassifier</code> eğitiliyor. 2) tek bir satır seçilip (<code>user = X[0:1]</code>) <code>predict_proba</code>'dan faktüel churn olasılığı okunuyor. 3) <code>user</code>'ın bir kopyası <code>user_cf</code> oluşturulup <code>support_calls</code> elle <code>0</code>'a çekiliyor; karşı-olgu churn olasılığı okunuyor ve birey-başına fark yazdırılıyor — "bu kullanıcı hiç destek araması yapmasaydı ne olurdu"nun model temelli bir tahmini.</p>
<p class="l-text">Uyarı: bu, modelin gerçek nedensel mekanizmayı yakaladığı varsayımı altında <em>tahminsel</em> bir karşı-olgudur — yalnızca karıştırma tamamen ayarlandığında geçerlidir. Ders 5'teki TARNet/Dragonnet bunu açık nedensel mimarilerle ele alır.</p>
</div>

<div class="lesson-block" id="section-9"><h2 class="lesson-title">9. Tahmin Edici Hile Kağıdı</h2>
<div class="calc-cards">
<div class="calc-card"><div class="card-title">Regresyon ayarlaması</div><div class="card-body">Ucuz. Sonuç modeli yanlışsa yanlı. Düşük boyutlu X için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">IPW</div><div class="card-body">Eğilim doğruysa yansız. Aşırı ağırlıklarla yüksek varyans. Her zaman kırp.</div></div>
<div class="calc-card"><div class="card-title">Eşleştirme</div><div class="card-body">Sezgisel, şeffaf. ATT için iyi. Örneklem boyutu kaybeder.</div></div>
<div class="calc-card"><div class="card-title">Çift Sağlam</div><div class="card-body">Varsayılan seçim. Modellerden biri doğruysa tutarlı. Yardımcı tahmin için ML kullan.</div></div>
<div class="calc-card"><div class="card-title">T/S/X-öğrenici</div><div class="card-body">ITE / CATE için. Örneklem boyutu ve tedavi dengesizliğine göre seç.</div></div>
</div>
<div class="calc-highlight" style="background:rgba(200,169,110,0.08);border-left:3px solid #c8a96e;padding:0.9rem 1.1rem;margin:1.2rem 0;border-radius:0 6px 6px 0;font-size:0.94rem">Ders 5 bu temelleri modern nedensel makine öğrenmesine taşır: nedensel ormanlar (Wager-Athey 2018), Çift Makine Öğrenmesi (Chernozhukov 2017) ve sinirsel karşı-olgu modelleri (TARNet, Dragonnet).</div>
</div>`
};
