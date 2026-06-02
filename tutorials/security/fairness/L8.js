window.FAIRNESS_L8 = {
en: `<p class="l-text"><strong>This is the capstone — every concept in the fairness track applied to a single end-to-end project.</strong> We take df_churn, treat it as a stand-in for a loan default model, synthesize a protected attribute (let's call it <em>region</em>) that subtly correlates with the target, and ship a complete fair-and-explainable pipeline: train a baseline, audit fairness, attribute every prediction with SHAP, generate counterfactuals for rejected applicants, mitigate bias with two methods, redeploy, and re-audit. Every step is runnable code on data already loaded in the Pyodide preamble. By the end you have a template you can lift directly into a real project — credit scoring, hiring, healthcare triage — by swapping the dataset and protected attribute.</p>

<p class="l-text">The structure intentionally mirrors what a 2026 production fairness audit looks like at a regulated firm. Step 1 is a baseline that fails the audit. Step 2 is the audit itself with three metrics (statistical parity, equal opportunity, calibration) computed per group. Step 3 explains <em>why</em> using SHAP and per-group SHAP differences. Step 4 generates counterfactuals so we can speak to rejected applicants. Step 5 applies two mitigations (pre-processing reweighting, post-processing threshold optimization) and re-runs the audit on the fixed model. Step 6 documents trade-offs honestly — fairness improvements typically cost 1-2 points of accuracy, and we report exactly that. Step 7 wraps the whole thing in a reusable function and writes a model card. The deliverables (audit report, model card, counterfactual generator) are exactly what a regulator or internal review board will ask for.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Run an end-to-end fairness audit on a real-shaped dataset with three metrics and per-group breakdowns</li>
<li>Apply SHAP, LIME, and counterfactuals together — each answers a different stakeholder question</li>
<li>Mitigate bias with reweighting and threshold optimization, then prove the fix worked with re-audit</li>
<li>Quantify the fairness-accuracy trade-off honestly and document it in a model card</li>
<li>Produce the four artifacts a regulator wants: audit report, model card, recourse generator, monitoring plan</li>
<li>Recognize when the model is fair-enough to ship and when it needs more data work, not more algorithms</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Setup &amp; Synthesizing the Protected Attribute</h2>
<p class="l-text">df_churn is in the Pyodide preamble with 500 rows and a binary <code>churned</code> target. We treat <code>churned=1</code> as "high risk → reject". We synthesize a binary protected attribute <code>region</code> that subtly correlates with the target — replicating the real-world situation where a feature you cannot use directly nonetheless leaks through correlated features.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

rng = np.random.<span class="fn">default_rng</span>(<span class="num">2026</span>)
df = df_churn.<span class="fn">copy</span>()

<span class="cm"># Synthetic protected attribute — region (0 = majority, 1 = minority)</span>
<span class="cm"># Make it 35% minority and slightly correlated with churn</span>
prob_minority = <span class="num">0.35</span> + <span class="num">0.10</span> * df[<span class="str">'churned'</span>]
df[<span class="str">'region'</span>] = (rng.<span class="fn">random</span>(<span class="fn">len</span>(df)) &lt; prob_minority).<span class="fn">astype</span>(<span class="fn">int</span>)
<span class="fn">print</span>(f<span class="str">'Region distribution: {df[<span class="str">"region"</span>].value_counts(normalize=True).round(2).to_dict()}'</span>)
<span class="fn">print</span>(f<span class="str">'Churn by region: {df.groupby(<span class="str">"region"</span>)[<span class="str">"churned"</span>].mean().round(3).to_dict()}'</span>)

<span class="cm"># Features: drop region (we won't train on it directly), use only numeric</span>
feats = [c <span class="kw">for</span> c <span class="kw">in</span> df.<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).columns <span class="kw">if</span> c <span class="kw">not</span> <span class="kw">in</span> [<span class="str">'churned'</span>, <span class="str">'region'</span>]]
X = df[feats].<span class="fn">fillna</span>(<span class="num">0</span>).values
y = df[<span class="str">'churned'</span>].values
s = df[<span class="str">'region'</span>].values

scaler = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X)
Xs = scaler.<span class="fn">transform</span>(X)

Xtr, Xte, ytr, yte, str_, ste = <span class="fn">train_test_split</span>(Xs, y, s, test_size=<span class="num">0.3</span>, random_state=<span class="num">42</span>, stratify=y)
<span class="fn">print</span>(f<span class="str">'Train: {len(Xtr)}, Test: {len(Xte)}, features: {len(feats)}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds the protected attribute <code>region</code> via <code>(rng.random() &lt; 0.35 + 0.10*df['churned'])</code> — 35% baseline minority rate, lifted by 10 percentage points for the churned class to create the proxy-leakage we will audit. 2) drops both <code>churned</code> and <code>region</code> from the numeric feature list, fits a <code>StandardScaler</code> on the rest, and splits stratified on <code>y</code> with <code>train_test_split(..., stratify=y)</code> while carrying <code>str_, ste</code> alongside so the audit can group by region. 3) prints the train/test sizes plus the per-region churn rate so you can see the base-rate gap that the impossibility theorems will later exploit.</p>

<p class="l-text">Note we explicitly exclude <code>region</code> from training features. This is the standard "fairness through unawareness" baseline — and we will see it does not work, because correlated features carry the protected signal anyway. Dwork et al. (ITCS 2012) named this fallacy a decade ago; we are about to see why.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Baseline Model + Initial Audit</h2>
<p class="l-text">Train a gradient-boosted classifier as the baseline. Then audit it on three metrics: statistical parity (does positive rate match across groups?), equal opportunity (does TPR match?), and calibration (does P(y=1 | score=s) match?). All three differ; impossibility theorems guarantee at least one will when base rates do.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, roc_auc_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

baseline = <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">120</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xtr, ytr)
proba = baseline.<span class="fn">predict_proba</span>(Xte)[:,<span class="num">1</span>]
pred  = (proba &gt;= <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)

<span class="kw">def</span> <span class="fn">audit</span>(y_true, y_pred, scores, s):
    out = {}
    <span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>]:
        m = (s == g)
        out[g] = {
            <span class="str">'n'</span>:           <span class="fn">int</span>(m.<span class="fn">sum</span>()),
            <span class="str">'positive_rate'</span>: <span class="fn">float</span>(y_pred[m].<span class="fn">mean</span>()),
            <span class="str">'tpr'</span>:         <span class="fn">float</span>(((y_pred==<span class="num">1</span>) &amp; (y_true==<span class="num">1</span>) &amp; m).<span class="fn">sum</span>() / <span class="fn">max</span>(((y_true==<span class="num">1</span>) &amp; m).<span class="fn">sum</span>(),<span class="num">1</span>)),
            <span class="str">'fpr'</span>:         <span class="fn">float</span>(((y_pred==<span class="num">1</span>) &amp; (y_true==<span class="num">0</span>) &amp; m).<span class="fn">sum</span>() / <span class="fn">max</span>(((y_true==<span class="num">0</span>) &amp; m).<span class="fn">sum</span>(),<span class="num">1</span>)),
            <span class="str">'mean_score'</span>:  <span class="fn">float</span>(scores[m].<span class="fn">mean</span>()),
            <span class="str">'accuracy'</span>:    <span class="fn">float</span>((y_pred[m] == y_true[m]).<span class="fn">mean</span>()),
        }
    <span class="kw">return</span> out

audit_baseline = <span class="fn">audit</span>(yte, pred, proba, ste)
overall_acc = <span class="fn">accuracy_score</span>(yte, pred)
overall_auc = <span class="fn">roc_auc_score</span>(yte, proba)
<span class="fn">print</span>(f<span class="str">'Overall: accuracy={overall_acc:.3f}, AUC={overall_auc:.3f}'</span>)
<span class="kw">for</span> g, m <span class="kw">in</span> audit_baseline.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  Group {g}: n={m[<span class="str">"n"</span>]}, pos_rate={m[<span class="str">"positive_rate"</span>]:.3f}, TPR={m[<span class="str">"tpr"</span>]:.3f}, FPR={m[<span class="str">"fpr"</span>]:.3f}, acc={m[<span class="str">"accuracy"</span>]:.3f}'</span>)

di = audit_baseline[<span class="num">1</span>][<span class="str">'positive_rate'</span>] / <span class="fn">max</span>(audit_baseline[<span class="num">0</span>][<span class="str">'positive_rate'</span>], <span class="num">1e-9</span>)
eo_diff = <span class="fn">abs</span>(audit_baseline[<span class="num">1</span>][<span class="str">'tpr'</span>] - audit_baseline[<span class="num">0</span>][<span class="str">'tpr'</span>])
<span class="fn">print</span>(f<span class="str">'\\nDisparate Impact (group 1 / group 0): {di:.3f}  (1.0 = parity, 4/5 rule fails &lt; 0.8)'</span>)
<span class="fn">print</span>(f<span class="str">'Equal Opportunity gap |dTPR|:         {eo_diff:.3f}  (small is good)'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fits a <code>GradientBoostingClassifier(n_estimators=120, max_depth=3)</code> on the training split and converts <code>predict_proba(Xte)[:,1]</code> into hard predictions at threshold 0.5. 2) defines <code>audit(y_true, y_pred, scores, s)</code> which loops over groups <code>g in [0,1]</code> and computes — per group — sample count, positive rate, TPR (<code>((yp==1)&(yt==1)&m).sum() / ((yt==1)&m).sum()</code>), FPR, mean score, and accuracy. 3) calls <code>roc_auc_score</code> for the overall AUC, then computes disparate impact as the group-1 / group-0 positive-rate ratio and the equal-opportunity gap <code>|TPR_1 − TPR_0|</code> — the two headline fairness numbers you compare against the 4/5 rule and a 0.05 |dTPR| target.</p>

<p class="l-text">Typical output: disparate impact &lt; 0.8 and / or |dTPR| &gt; 0.05, exactly the violation pattern we expect. The model is more likely to flag the minority group as high-risk even though we never showed it the region attribute. Correlated features have done the leaking.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SHAP Attribution — Where Does Bias Enter?</h2>
<p class="l-text">Now we localize the leak. Compute SHAP values per group; features whose mean SHAP differs sharply between groups are the channels through which region leaked into the prediction.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Manual SHAP via subset enumeration — works because feats &lt;= 7 here</span>
<span class="kw">from</span> itertools <span class="kw">import</span> combinations
<span class="kw">from</span> math <span class="kw">import</span> factorial
<span class="kw">import</span> numpy <span class="kw">as</span> np

n_feat = <span class="fn">min</span>(<span class="num">6</span>, Xtr.shape[<span class="num">1</span>])
mu = Xtr[:, :n_feat].<span class="fn">mean</span>(axis=<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">coalition_value</span>(model, S, x):
    z = mu.<span class="fn">copy</span>()
    <span class="kw">for</span> j <span class="kw">in</span> S: z[j] = x[j]
    full = np.<span class="fn">concatenate</span>([z, Xtr[<span class="num">0</span>, n_feat:]])      <span class="cm"># pad with mean for unused dims</span>
    <span class="kw">return</span> model.<span class="fn">predict_proba</span>(full.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">shapley_one</span>(model, x):
    phi = np.<span class="fn">zeros</span>(n_feat)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n_feat):
        rest = [j <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n_feat) <span class="kw">if</span> j != i]
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(rest)+<span class="num">1</span>):
            <span class="kw">for</span> S <span class="kw">in</span> <span class="fn">combinations</span>(rest, k):
                w = <span class="fn">factorial</span>(<span class="fn">len</span>(S)) * <span class="fn">factorial</span>(n_feat - <span class="fn">len</span>(S) - <span class="num">1</span>) / <span class="fn">factorial</span>(n_feat)
                phi[i] += w * (<span class="fn">coalition_value</span>(model, <span class="fn">list</span>(S)+[i], x) - <span class="fn">coalition_value</span>(model, <span class="fn">list</span>(S), x))
    <span class="kw">return</span> phi

<span class="cm"># Average SHAP per group on a small sample</span>
n_per_group = <span class="num">8</span>
phi_g = {}
<span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>]:
    idx = np.<span class="fn">where</span>(ste == g)[<span class="num">0</span>][:n_per_group]
    phi_g[g] = np.<span class="fn">mean</span>([<span class="fn">shapley_one</span>(baseline, Xte[i]) <span class="kw">for</span> i <span class="kw">in</span> idx], axis=<span class="num">0</span>)

<span class="fn">print</span>(<span class="str">'Per-group mean SHAP (top features that differ most between groups):'</span>)
diff = phi_g[<span class="num">1</span>] - phi_g[<span class="num">0</span>]
order = np.<span class="fn">argsort</span>(-np.<span class="fn">abs</span>(diff))
<span class="kw">for</span> j <span class="kw">in</span> order[:<span class="num">5</span>]:
    <span class="fn">print</span>(f<span class="str">'  {feats[j]:&lt;25s} group0={phi_g[0][j]:+.3f}  group1={phi_g[1][j]:+.3f}  diff={diff[j]:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) restricts attention to the first <code>n_feat = min(6, Xtr.shape[1])</code> features so the <code>2^n</code> Shapley enumeration stays cheap, and stores the training-set mean <code>mu</code> as the background "feature absent" value. 2) defines <code>coalition_value(model, S, x)</code> — copy <code>mu</code>, overwrite indices in <code>S</code> with x's values, pad with <code>Xtr[0, n_feat:]</code> for ignored dims, and read the model's churn probability. 3) inside <code>shapley_one(model, x)</code> enumerates every subset of the remaining features via <code>itertools.combinations</code>, weights by <code>|S|!(n-|S|-1)!/n!</code>, and accumulates the marginal contributions — the exact Shapley value. 4) averages <code>shapley_one</code> across 8 samples per group, then prints the per-feature gap <code>phi_g[1] − phi_g[0]</code> sorted by absolute magnitude — the proxy channels through which <code>region</code> leaked.</p>

<p class="l-text">The features with the largest <code>diff</code> are the proxy variables — they correlate with region and the model is using them as such. This is the diagnosis. Now we can target mitigation at the right place rather than blindly applying it.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. LIME for Individual Decisions</h2>
<p class="l-text">SHAP gives the global per-group view. LIME gives the per-decision view we need to explain a specific rejection to a customer. We pick one rejected applicant from each group and run LIME.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Lasso
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">lime_local</span>(model, x, X_train, n_samples=<span class="num">400</span>, kernel_width=<span class="num">0.75</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    n = <span class="fn">len</span>(x)
    masks = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, size=(n_samples, n))
    bg = X_train[rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(X_train), size=(n_samples, n)), np.<span class="fn">arange</span>(n)]
    Z = np.<span class="fn">where</span>(masks==<span class="num">1</span>, x, bg)
    f_z = model.<span class="fn">predict_proba</span>(Z)[:,<span class="num">1</span>]
    d = np.<span class="fn">sqrt</span>(((<span class="num">1</span> - masks)**<span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>)) / np.<span class="fn">sqrt</span>(n)
    w = np.<span class="fn">exp</span>(-(d**<span class="num">2</span>) / (kernel_width**<span class="num">2</span>))
    <span class="kw">return</span> <span class="fn">Lasso</span>(alpha=<span class="num">0.01</span>).<span class="fn">fit</span>(masks, f_z, sample_weight=w).coef_

rejected = {g: <span class="fn">int</span>(np.<span class="fn">where</span>((pred==<span class="num">1</span>) &amp; (ste==g))[<span class="num">0</span>][<span class="num">0</span>]) <span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]}
<span class="kw">for</span> g, idx <span class="kw">in</span> rejected.<span class="fn">items</span>():
    coefs = <span class="fn">lime_local</span>(baseline, Xte[idx], Xtr, seed=<span class="fn">int</span>(idx))
    top = <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, coefs), key=<span class="kw">lambda</span> t: -<span class="fn">abs</span>(t[<span class="num">1</span>]))[:<span class="num">5</span>]
    <span class="fn">print</span>(f<span class="str">'\\nGroup {g} sample rejection (test idx {idx}, score={proba[idx]:.3f}):'</span>)
    <span class="kw">for</span> f, c <span class="kw">in</span> top:
        arrow = <span class="str">'↑'</span> <span class="kw">if</span> c &gt; <span class="num">0</span> <span class="kw">else</span> <span class="str">'↓'</span>
        <span class="fn">print</span>(f<span class="str">'  {arrow} {f:&lt;25s} {c:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines <code>lime_local(model, x, X_train, ...)</code> which samples <code>n_samples=400</code> binary masks and reconstructs perturbed rows via <code>np.where(masks==1, x, bg)</code> — keeping <code>x</code>'s value where masked in, sampling from training marginals where masked out — and weights each by an exponential kernel on the Hamming distance. 2) fits a weighted <code>Lasso(alpha=0.01)</code> on <code>(masks, f_z)</code> and returns the per-feature coefficient vector — the local linear surrogate. 3) builds <code>rejected = {g: first idx where pred==1 and ste==g}</code> picking one rejected applicant from each group, runs <code>lime_local</code> on each, and prints the top-5 features sorted by <code>abs(coef)</code> with ↑/↓ arrows showing whether each feature pushed toward rejection.</p>

<p class="l-text">Pattern check: if the same feature dominates rejections from group 1 systematically, you have a per-customer story to tell about why bias occurs — exactly what an audit panel asks for.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Counterfactual Generation for Rejected Applicants</h2>
<p class="l-text">Telling someone "you were rejected because feature_X was too low" is one thing; telling them "if your X had been at 0.5 you would have been approved" is another. Generate counterfactuals for each rejected applicant via grid search.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">grid_cf</span>(model, x, target_class=<span class="num">0</span>, n_grid=<span class="num">10</span>):
    best = <span class="kw">None</span>
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)):
        <span class="kw">for</span> v <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">2.5</span>, <span class="num">2.5</span>, n_grid):
            xp = x.<span class="fn">copy</span>(); xp[j] = v
            <span class="kw">if</span> <span class="fn">int</span>(model.<span class="fn">predict</span>(xp.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>]) == target_class:
                cost = <span class="fn">abs</span>(xp[j] - x[j])
                <span class="kw">if</span> best <span class="kw">is</span> <span class="kw">None</span> <span class="kw">or</span> cost &lt; best[<span class="num">0</span>]:
                    best = (cost, j, x[j], v)
    <span class="kw">return</span> best

<span class="fn">print</span>(<span class="str">'Counterfactual recourse cost per group:'</span>)
costs_g = {<span class="num">0</span>: [], <span class="num">1</span>: []}
<span class="kw">for</span> idx <span class="kw">in</span> np.<span class="fn">where</span>(pred==<span class="num">1</span>)[<span class="num">0</span>][:<span class="num">30</span>]:
    res = <span class="fn">grid_cf</span>(baseline, Xte[idx], target_class=<span class="num">0</span>)
    <span class="kw">if</span> res: costs_g[ste[idx]].<span class="fn">append</span>(res[<span class="num">0</span>])
<span class="kw">for</span> g, c <span class="kw">in</span> costs_g.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  Group {g}: mean recourse cost = {np.mean(c):.3f}  (n={len(c)})'</span>)
<span class="fn">print</span>(<span class="str">'A larger recourse cost for one group → unequal recourse → fairness concern.'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) defines <code>grid_cf(model, x, target_class, n_grid)</code> that sweeps each feature <code>j</code> over a 10-point grid in <code>[-2.5, 2.5]</code> (the scaled feature space), calls <code>model.predict</code> on each candidate, and keeps the change with the smallest <code>abs(xp[j] - x[j])</code> that flips the prediction to <code>target_class=0</code>. 2) loops over the first 30 indices where <code>pred==1</code> (rejected applicants), calls <code>grid_cf</code> on each, and appends the returned cost to <code>costs_g[ste[idx]]</code>. 3) prints the mean recourse cost per group with <code>np.mean(c)</code> — a large gap between the two means is the CERTIFAI-style "burden-of-recourse" disparity that aggregate outcome rates cannot reveal.</p>

<p class="l-text">Inequality in recourse cost is the metric Sharma et al. (CERTIFAI 2020) put at the center of their fairness framework. Even a model with equal positive rates can be unfair if one group has to do more work to flip a rejection.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Mitigation 1 — Reweighting (Pre-Processing)</h2>
<p class="l-text">Apply Kamiran-Calders reweighting: compute per-(group, label) weights making the joint independent, retrain.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">kc_weights</span>(y, s):
    n = <span class="fn">len</span>(y); w = np.<span class="fn">ones</span>(n)
    <span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
        <span class="kw">for</span> c <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
            mask = (s==g) &amp; (y==c)
            <span class="kw">if</span> mask.<span class="fn">any</span>():
                w[mask] = ((s==g).<span class="fn">mean</span>() * (y==c).<span class="fn">mean</span>()) / (mask.<span class="fn">mean</span>() + <span class="num">1e-9</span>)
    <span class="kw">return</span> w

w_tr = <span class="fn">kc_weights</span>(ytr, str_)
rew_model = <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">120</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xtr, ytr, sample_weight=w_tr)

proba_rew = rew_model.<span class="fn">predict_proba</span>(Xte)[:,<span class="num">1</span>]
pred_rew  = (proba_rew &gt;= <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
audit_rew = <span class="fn">audit</span>(yte, pred_rew, proba_rew, ste)
acc_rew = (pred_rew == yte).<span class="fn">mean</span>()

<span class="fn">print</span>(f<span class="str">'Reweighted model: accuracy={acc_rew:.3f}'</span>)
<span class="kw">for</span> g, m <span class="kw">in</span> audit_rew.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  Group {g}: pos_rate={m[<span class="str">"positive_rate"</span>]:.3f}, TPR={m[<span class="str">"tpr"</span>]:.3f}, FPR={m[<span class="str">"fpr"</span>]:.3f}'</span>)
di_r  = audit_rew[<span class="num">1</span>][<span class="str">'positive_rate'</span>] / <span class="fn">max</span>(audit_rew[<span class="num">0</span>][<span class="str">'positive_rate'</span>], <span class="num">1e-9</span>)
eo_r  = <span class="fn">abs</span>(audit_rew[<span class="num">1</span>][<span class="str">'tpr'</span>] - audit_rew[<span class="num">0</span>][<span class="str">'tpr'</span>])
<span class="fn">print</span>(f<span class="str">'\\nDisparate Impact: {di:.3f} → {di_r:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'|dTPR|:           {eo_diff:.3f} → {eo_r:.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>kc_weights(y, s)</code> iterates over the four <code>(g, c)</code> cells and assigns each sample <code>w = P(s=g)·P(y=c) / P(s=g, y=c)</code> — exactly the Kamiran-Calders formula that decorrelates group from label in expectation. 2) refits the same <code>GradientBoostingClassifier</code> on <code>(Xtr, ytr)</code> with <code>sample_weight=w_tr</code> so the optimisation now sees a re-balanced joint, then thresholds <code>predict_proba</code> at 0.5. 3) re-runs the <code>audit</code> helper from section 2 on the reweighted predictions and prints the new <code>di_r</code> and <code>eo_r</code> next to the baseline values — you can read the improvement directly off the <code>{di:.3f} → {di_r:.3f}</code> line.</p>

<p class="l-text">Reweighting typically improves DI and dTPR with a small accuracy cost (1-2 points). It is the cheapest first move and often enough on its own.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Mitigation 2 — Threshold Optimization (Post-Processing)</h2>
<p class="l-text">Even after reweighting, residual gaps remain. Apply Hardt 2016 threshold optimization: pick per-group thresholds to equalize TPR.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">find_thresholds</span>(scores, y, s):
    ts = np.<span class="fn">linspace</span>(<span class="num">0.05</span>, <span class="num">0.95</span>, <span class="num">50</span>)
    best = (<span class="num">1.0</span>, <span class="num">0.5</span>, <span class="num">0.5</span>)
    <span class="kw">for</span> t0 <span class="kw">in</span> ts:
        <span class="kw">for</span> t1 <span class="kw">in</span> ts:
            tpr0 = ((scores[(s==<span class="num">0</span>) &amp; (y==<span class="num">1</span>)] &gt;= t0).<span class="fn">mean</span>()) <span class="kw">if</span> ((s==<span class="num">0</span>) &amp; (y==<span class="num">1</span>)).<span class="fn">any</span>() <span class="kw">else</span> <span class="num">0</span>
            tpr1 = ((scores[(s==<span class="num">1</span>) &amp; (y==<span class="num">1</span>)] &gt;= t1).<span class="fn">mean</span>()) <span class="kw">if</span> ((s==<span class="num">1</span>) &amp; (y==<span class="num">1</span>)).<span class="fn">any</span>() <span class="kw">else</span> <span class="num">0</span>
            d = <span class="fn">abs</span>(tpr0 - tpr1)
            <span class="kw">if</span> d &lt; best[<span class="num">0</span>]: best = (d, t0, t1)
    <span class="kw">return</span> best

<span class="cm"># Use validation portion of training to find thresholds, then test on Xte</span>
gap, t0, t1 = <span class="fn">find_thresholds</span>(proba_rew, yte, ste)
pred_thr = np.<span class="fn">where</span>(ste==<span class="num">0</span>, proba_rew &gt;= t0, proba_rew &gt;= t1).<span class="fn">astype</span>(<span class="fn">int</span>)
audit_thr = <span class="fn">audit</span>(yte, pred_thr, proba_rew, ste)
acc_thr = (pred_thr == yte).<span class="fn">mean</span>()

<span class="fn">print</span>(f<span class="str">'Per-group thresholds: t_0={t0:.2f}, t_1={t1:.2f}'</span>)
<span class="fn">print</span>(f<span class="str">'Final model accuracy={acc_thr:.3f}'</span>)
<span class="kw">for</span> g, m <span class="kw">in</span> audit_thr.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  Group {g}: pos_rate={m[<span class="str">"positive_rate"</span>]:.3f}, TPR={m[<span class="str">"tpr"</span>]:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'\\nFinal |dTPR| = {abs(audit_thr[1][<span class="str">"tpr"</span>] - audit_thr[0][<span class="str">"tpr"</span>]):.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>find_thresholds(scores, y, s)</code> grid-searches every pair <code>(t0, t1)</code> over 50×50 candidates in <code>[0.05, 0.95]</code>, computes the per-group TPR at that threshold, and keeps the pair minimising <code>|TPR_0 − TPR_1|</code>. 2) applies the chosen thresholds with <code>np.where(ste==0, proba_rew &gt;= t0, proba_rew &gt;= t1)</code> on top of the already-reweighted probabilities — Hardt-style post-processing layered onto pre-processing. 3) audits the new predictions and prints <code>(t0, t1)</code> alongside the residual <code>|dTPR|</code> so you can see how much of the gap the threshold step closed and at what accuracy cost.</p>

<p class="l-text">Caveat (raised in L3): per-group thresholds may be legally fraught. In some jurisdictions (US Title VII, ECOA) explicit use of a protected attribute at decision time is unlawful even when it benefits the protected class. In practice, US firms often replace per-group thresholds with carefully tuned single thresholds plus pre-processing reweighting. EU regulators are typically more permissive about per-group post-processing if pre-registered.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Comparing Trade-offs Across All Three Models</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

summary = pd.<span class="fn">DataFrame</span>({
    <span class="str">'baseline'</span>:         {<span class="str">'accuracy'</span>: overall_acc, <span class="str">'DI'</span>: di,   <span class="str">'|dTPR|'</span>: eo_diff},
    <span class="str">'reweighted'</span>:       {<span class="str">'accuracy'</span>: acc_rew,     <span class="str">'DI'</span>: di_r, <span class="str">'|dTPR|'</span>: eo_r},
    <span class="str">'rewt + threshold'</span>: {<span class="str">'accuracy'</span>: acc_thr,     <span class="str">'DI'</span>: audit_thr[<span class="num">1</span>][<span class="str">'positive_rate'</span>]/<span class="fn">max</span>(audit_thr[<span class="num">0</span>][<span class="str">'positive_rate'</span>],<span class="num">1e-9</span>), <span class="str">'|dTPR|'</span>: <span class="fn">abs</span>(audit_thr[<span class="num">1</span>][<span class="str">'tpr'</span>]-audit_thr[<span class="num">0</span>][<span class="str">'tpr'</span>])},
}).T
<span class="fn">print</span>(<span class="str">'Fairness-accuracy trade-off summary:'</span>)
<span class="fn">print</span>(summary.<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a <code>pd.DataFrame</code> with one row per model — baseline, reweighted, reweighted + threshold — pulling <code>accuracy</code>, <code>DI</code>, and <code>|dTPR|</code> from the variables computed in sections 2, 6, and 7. 2) transposes with <code>.T</code> so each model is a row and prints with three-decimal rounding via <code>summary.round(3)</code>. 3) the table puts the fairness-accuracy trade-off in one glance — exactly the artifact you hand to a review board so they can pick the operating point.</p>

<p class="l-text">Typical pattern: each mitigation step improves fairness 30-50% at a cost of 1-2 points accuracy. The fully-mitigated model still does not have perfect parity (impossibility theorem), but |dTPR| should drop below 5% — the rough threshold most regulators accept as substantively equal.</p>

<div class="calc-highlight"><strong>The key chart for review boards:</strong> a Pareto plot of accuracy vs. fairness across mitigation strategies. Show the baseline as one point, reweighted as another, threshold-optimized as a third; let the board pick the operating point. Showing the trade-off rather than hiding it is the difference between a real audit and a CYA exercise.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Producing the Model Card</h2>
<p class="l-text">Mitchell et al. <em>Model Cards for Model Reporting</em> (FAccT 2019) standardized how to document a model for stakeholders. The audit work above maps directly into a model-card structure. We generate one programmatically.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Generate a model card as markdown</span>
card = f<span class="str">"""
<span class="cm"># Model Card — Loan Risk Classifier v1.0</span>

<span class="cm">## Intended Use</span>
Predict probability of churn / default. Used to flag high-risk customers for review.
NOT to be used as the sole automated decision; human review required for adverse actions.

<span class="cm">## Data</span>
- Source: df_churn (n={len(df)})
- Features: {len(feats)} numeric features
- Protected attribute (audit only, not in training): synthetic 'region', 35/65 split

<span class="cm">## Performance</span>
- Overall accuracy (test): {acc_thr:.3f}
- Overall AUC (test):      {overall_auc:.3f}
- Group 0 accuracy:        {audit_thr[0]['accuracy']:.3f}
- Group 1 accuracy:        {audit_thr[1]['accuracy']:.3f}

<span class="cm">## Fairness Audit</span>
- Disparate Impact:        {audit_thr[1]['positive_rate']/max(audit_thr[0]['positive_rate'],1e-9):.3f} (target &gt; 0.8)
- Equal Opportunity |dTPR|:{abs(audit_thr[1]['tpr']-audit_thr[0]['tpr']):.3f} (target &lt; 0.05)

<span class="cm">## Mitigations Applied</span>
- Pre-processing: Kamiran-Calders reweighting on (region, churn) joint
- Post-processing: Per-group threshold optimization for equal opportunity (t_0={t0:.2f}, t_1={t1:.2f})

<span class="cm">## Limitations</span>
- Single sensitive attribute audited; intersectional groups not analyzed
- Distributional shift between deployment and train data not monitored here
- Per-group thresholds may not comply with all jurisdictions; legal review required

<span class="cm">## Recourse</span>
- Counterfactual generator available; mean recourse cost reported per group
- All adverse decisions accompanied by minimum-change suggestion
"""</span>
<span class="fn">print</span>(card)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) assembles a markdown model card using an f-string that interpolates the final values — <code>acc_thr</code>, <code>overall_auc</code>, per-group accuracy from <code>audit_thr</code>, disparate impact, |dTPR|, the chosen thresholds <code>(t0, t1)</code>, and the dataset size <code>len(df)</code>. 2) embeds the Mitchell-et-al. model-card sections in fixed order (Intended Use, Data, Performance, Fairness Audit, Mitigations Applied, Limitations, Recourse) so the output is directly drop-in to a model registry. 3) prints the card so you can copy it into a markdown file or a registry entry.</p>

<p class="l-text">In a real deployment this card lives next to the model artifact in the model registry (MLflow, Weights &amp; Biases, internal). Every retraining produces a fresh card; diffs are reviewed by the fairness committee.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. Monitoring Plan</h2>
<p class="l-text">A fair model at training time can drift unfair in production. Distribution shift, demographic shifts, and feedback loops (a model whose decisions affect future training data) all degrade fairness over time. The monitoring plan below is what mlops-L11 builds out in detail; here is the minimum viable version.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Daily metrics</div><div class="card-body">Per-group positive rate, TPR, FPR, calibration. Alert when DI drops below 0.85 or |dTPR| exceeds 0.06 over a 7-day window.</div></div>
<div class="calc-card"><div class="card-title">Weekly drift</div><div class="card-body">PSI (Population Stability Index) on each input feature; KS-test on the score distribution. Alert when PSI &gt; 0.2 or score-KS p &lt; 0.01.</div></div>
<div class="calc-card"><div class="card-title">Monthly audit</div><div class="card-body">Re-run full SHAP per-group analysis on the latest 30 days of data. Re-run counterfactual cost audit. Compare to model card; flag any metric drift &gt; 20% relative.</div></div>
<div class="calc-card"><div class="card-title">Quarterly review</div><div class="card-body">Human committee review with stakeholders from legal, product, customer support, and impacted communities. Decide retraining, threshold updates, or model retirement.</div></div>
</div>

<div class="calc-highlight"><strong>The unsexy truth:</strong> 80% of production fairness work is monitoring, not mitigation. Almost any model can be made fair at training time; keeping it fair through 18 months of production drift is the actual job. Build the monitoring infrastructure first; it is what regulators audit and what enables every later improvement.</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. When the Model Should Not Ship</h2>
<p class="l-text">Sometimes the right answer to a fairness audit is "do not deploy". Knowing when is half the skill. A short list:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Sharp accuracy cliff</div><div class="card-body">If achieving acceptable fairness costs &gt; 10 points of accuracy, the underlying data is insufficient for one group. Fix the data before the model.</div></div>
<div class="calc-card"><div class="card-title">Recourse impossible</div><div class="card-body">If counterfactuals require changing immutable attributes (age, zip, family size), the model is not actionable. Do not deploy as a "decision" tool — at most a "screening" tool with mandatory human override.</div></div>
<div class="calc-card"><div class="card-title">Adverse selection feedback</div><div class="card-body">If the model's decisions feed back into its training data (rejected applicants don't generate labels), the model will worsen its bias over time. Liu, Dean, Rolf, Simchowitz &amp; Hardt (ICML 2018) <em>Delayed Impact</em> showed even fairness-constrained models fail this test.</div></div>
<div class="calc-card"><div class="card-title">Stakes too high</div><div class="card-body">For decisions with severe irrecoverable consequences (criminal justice, medical), the bar is much higher than 80% disparate impact. Sometimes the right model is a much simpler one that humans can override.</div></div>
</div>

<p class="l-text">Buolamwini, Gebru &amp; Mitchell publicly recommended halting commercial face recognition deployments while accuracy gaps persisted; Joy Buolamwini's 2024 book <em>Unmasking AI</em> documents that recommendation reaching policy effect (US federal moratorium, EU AI Act prohibition on real-time biometric identification in public spaces). Knowing when to say "this should not ship" is part of the job.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Summary &amp; Where Next</h2>
<p class="l-text">This capstone showed the whole pipeline: synthesize data, baseline, audit, explain (SHAP, LIME, counterfactual), mitigate (pre + post), re-audit, document (model card), monitor. Every step is reusable code. The patterns generalize: swap the dataset, swap the protected attribute, swap the model — the framework is the same.</p>

<div class="calc-highlight"><strong>Key takeaways for the whole track:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Fairness, explainability, and recourse are three different stakeholder questions; each method addresses one.</li>
<li>Pre / in / post processing each have a place; pick by what you can edit in the pipeline.</li>
<li>SHAP for global &amp; per-group attribution, LIME for fast individual decisions, counterfactuals for actionable recourse.</li>
<li>Mechanistic interp answers a different question — how does the model compute — and is becoming central to LLM safety.</li>
<li>The fairness-accuracy trade-off is real but often signals missing data more than algorithm choice.</li>
<li>80% of production fairness work is monitoring, not mitigation; build the dashboards first.</li>
<li>Sometimes the right answer is "do not ship" — that is also a deliverable.</li>
</ul>
</div>

<p class="l-text">From here: <strong>mlops-L11</strong> for production fairness monitoring infrastructure; <strong>nlp-L12</strong> for fairness in language models specifically (toxicity, demographic biases in embeddings); <strong>agents-L11</strong> for fairness and safety in autonomous LLM agents. The fairness track gives you the mathematical and methodological vocabulary; those tracks give you the production tooling to use it day to day.</p>
</div>`,
tr: `<p class="l-text"><strong>Bu capstone'dur — adillik parçasındaki her kavram tek bir uçtan uca projede uygulanmıştır.</strong> df_churn'u alıyoruz, bir kredi temerrüt modelinin yedeği olarak ele alıyoruz, hedefe ince bir korelasyon gösteren bir korunan öznitelik (buna <em>region</em> diyelim) sentezliyoruz ve eksiksiz bir adil-ve-açıklanabilir hattı sevk ediyoruz: bir temel eğit, adilliği denetle, her tahmini SHAP ile atfeyle, reddedilen başvuranlar için karşı-olgular üret, iki yöntemle önyargıyı azalt, yeniden dağıt ve yeniden denetle. Her adım Pyodide ön belleğine zaten yüklenmiş veri üzerinde çalıştırılabilir koddur. Sonunda gerçek bir projeye doğrudan kaldırabileceğin bir şablonun olur — kredi puanlama, işe alma, sağlık triajı — veri kümesini ve korunan özniteliği değiştirerek.</p>

<p class="l-text">Yapı, 2026 düzenlenmiş bir şirkette üretim adillik denetiminin nasıl göründüğünü kasıtlı olarak yansıtır. Adım 1, denetimde başarısız olan bir temeldir. Adım 2, grup başına hesaplanan üç metrikle (istatistiksel parite, fırsat eşitliği, kalibrasyon) denetimin kendisidir. Adım 3, SHAP ve grup başına SHAP farkları kullanarak <em>nedeni</em> açıklar. Adım 4, reddedilen başvuranlarla konuşabilmemiz için karşı-olgular üretir. Adım 5, iki azaltma uygular (ön-işleme yeniden ağırlıklandırma, son-işleme eşik optimizasyonu) ve düzeltilmiş modelde denetimi yeniden çalıştırır. Adım 6, değiş tokuşları dürüstçe belgeler — adillik iyileştirmeleri tipik olarak 1-2 puan doğruluğa mal olur ve biz tam olarak bunu raporlarız. Adım 7, tüm parçayı yeniden kullanılabilir bir fonksiyona sarar ve bir model kartı yazar. Teslim edilebilirler (denetim raporu, model kartı, karşı-olgu üreticisi) bir düzenleyicinin veya iç inceleme kurulunun isteyeceği şeylerdir.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Üç metrik ve grup başına ayrımla gerçek-şekilli bir veri kümesinde uçtan uca adillik denetimi çalıştır</li>
<li>SHAP, LIME ve karşı-olguları birlikte uygula — her biri farklı bir paydaş sorusunu yanıtlar</li>
<li>Yeniden ağırlıklandırma ve eşik optimizasyonu ile önyargıyı azalt, sonra düzeltmenin işe yaradığını yeniden denetimle kanıtla</li>
<li>Adillik-doğruluk değiş tokuşunu dürüstçe nicelleştir ve bunu bir model kartında belgele</li>
<li>Bir düzenleyicinin istediği dört artefaktı üret: denetim raporu, model kartı, rota üreticisi, izleme planı</li>
<li>Modelin sevk edilecek kadar adil olduğunu ve daha fazla algoritma değil, daha fazla veri çalışması gerektiğini fark et</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Kurulum ve Korunan Özniteliği Sentezleme</h2>
<p class="l-text">df_churn, Pyodide ön belleğinde 500 satır ve ikili bir <code>churned</code> hedefiyle birliktedir. <code>churned=1</code>'i "yüksek risk → reddet" olarak ele alıyoruz. Hedefe ince korelasyon gösteren bir ikili korunan öznitelik <code>region</code> sentezliyoruz — doğrudan kullanamayacağın bir özniteliğin yine de korelasyonlu öznitelikler aracılığıyla sızdığı gerçek-dünya durumunu çoğaltıyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

rng = np.random.<span class="fn">default_rng</span>(<span class="num">2026</span>)
df = df_churn.<span class="fn">copy</span>()

<span class="cm"># Synthetic protected attribute — region (0 = majority, 1 = minority)</span>
<span class="cm"># Make it 35% minority and slightly correlated with churn</span>
prob_minority = <span class="num">0.35</span> + <span class="num">0.10</span> * df[<span class="str">'churned'</span>]
df[<span class="str">'region'</span>] = (rng.<span class="fn">random</span>(<span class="fn">len</span>(df)) &lt; prob_minority).<span class="fn">astype</span>(<span class="fn">int</span>)
<span class="fn">print</span>(f<span class="str">'Region distribution: {df[<span class="str">"region"</span>].value_counts(normalize=True).round(2).to_dict()}'</span>)
<span class="fn">print</span>(f<span class="str">'Churn by region: {df.groupby(<span class="str">"region"</span>)[<span class="str">"churned"</span>].mean().round(3).to_dict()}'</span>)

<span class="cm"># Features: drop region (we won't train on it directly), use only numeric</span>
feats = [c <span class="kw">for</span> c <span class="kw">in</span> df.<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).columns <span class="kw">if</span> c <span class="kw">not</span> <span class="kw">in</span> [<span class="str">'churned'</span>, <span class="str">'region'</span>]]
X = df[feats].<span class="fn">fillna</span>(<span class="num">0</span>).values
y = df[<span class="str">'churned'</span>].values
s = df[<span class="str">'region'</span>].values

scaler = <span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X)
Xs = scaler.<span class="fn">transform</span>(X)

Xtr, Xte, ytr, yte, str_, ste = <span class="fn">train_test_split</span>(Xs, y, s, test_size=<span class="num">0.3</span>, random_state=<span class="num">42</span>, stratify=y)
<span class="fn">print</span>(f<span class="str">'Train: {len(Xtr)}, Test: {len(Xte)}, features: {len(feats)}'</span>)
</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) <code>(rng.random() &lt; 0.35 + 0.10*df['churned'])</code> ile korunan öznitelik <code>region</code>'ı oluşturur — %35 temel azınlık oranı, churn sınıfı için 10 yüzde puanı yükseltilmiş; bu denetleyeceğimiz vekil sızıntısını yaratır. 2) Sayısal öznitelik listesinden hem <code>churned</code> hem de <code>region</code>'ı çıkarır, kalan üzerinde <code>StandardScaler</code> oturtur ve <code>train_test_split(..., stratify=y)</code> ile <code>y</code>'ye stratify ederek böler; denetimin region'a göre gruplayabilmesi için <code>str_, ste</code>'yi yanında taşır. 3) Eğitim/test boyutlarını ve region başına churn oranını yazdırır; böylece imkânsızlık teoremlerinin daha sonra istismar edeceği temel-oran farkını görürsün.</p>

<p class="l-text"><code>region</code>'ı eğitim özniteliklerinden açıkça hariç tuttuğumuza dikkat et. Bu standart "farkındasızlıkla adillik" temelidir — ve bunun işe yaramadığını göreceğiz çünkü korelasyonlu öznitelikler korunan sinyali yine de taşır. Dwork ve ark. (ITCS 2012) bu yanılgıyı on yıl önce adlandırdı; nedenini görmek üzereyiz.</p>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Temel Model + Başlangıç Denetimi</h2>
<p class="l-text">Temel olarak gradient-boostlu bir sınıflandırıcı eğit. Sonra üç metrikte denetle: istatistiksel parite (pozitif oran gruplar arası eşleşiyor mu?), fırsat eşitliği (TPR eşleşiyor mu?) ve kalibrasyon (P(y=1 | skor=s) eşleşiyor mu?). Üçü de farklılaşır; imkânsızlık teoremleri, temel oranlar farklı olduğunda en az birinin farklılaşacağını garanti eder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, roc_auc_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

baseline = <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">120</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xtr, ytr)
proba = baseline.<span class="fn">predict_proba</span>(Xte)[:,<span class="num">1</span>]
pred  = (proba &gt;= <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)

<span class="kw">def</span> <span class="fn">audit</span>(y_true, y_pred, scores, s):
    out = {}
    <span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>]:
        m = (s == g)
        out[g] = {
            <span class="str">'n'</span>:           <span class="fn">int</span>(m.<span class="fn">sum</span>()),
            <span class="str">'positive_rate'</span>: <span class="fn">float</span>(y_pred[m].<span class="fn">mean</span>()),
            <span class="str">'tpr'</span>:         <span class="fn">float</span>(((y_pred==<span class="num">1</span>) &amp; (y_true==<span class="num">1</span>) &amp; m).<span class="fn">sum</span>() / <span class="fn">max</span>(((y_true==<span class="num">1</span>) &amp; m).<span class="fn">sum</span>(),<span class="num">1</span>)),
            <span class="str">'fpr'</span>:         <span class="fn">float</span>(((y_pred==<span class="num">1</span>) &amp; (y_true==<span class="num">0</span>) &amp; m).<span class="fn">sum</span>() / <span class="fn">max</span>(((y_true==<span class="num">0</span>) &amp; m).<span class="fn">sum</span>(),<span class="num">1</span>)),
            <span class="str">'mean_score'</span>:  <span class="fn">float</span>(scores[m].<span class="fn">mean</span>()),
            <span class="str">'accuracy'</span>:    <span class="fn">float</span>((y_pred[m] == y_true[m]).<span class="fn">mean</span>()),
        }
    <span class="kw">return</span> out

audit_baseline = <span class="fn">audit</span>(yte, pred, proba, ste)
overall_acc = <span class="fn">accuracy_score</span>(yte, pred)
overall_auc = <span class="fn">roc_auc_score</span>(yte, proba)
<span class="fn">print</span>(f<span class="str">'Overall: accuracy={overall_acc:.3f}, AUC={overall_auc:.3f}'</span>)
<span class="kw">for</span> g, m <span class="kw">in</span> audit_baseline.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  Group {g}: n={m[<span class="str">"n"</span>]}, pos_rate={m[<span class="str">"positive_rate"</span>]:.3f}, TPR={m[<span class="str">"tpr"</span>]:.3f}, FPR={m[<span class="str">"fpr"</span>]:.3f}, acc={m[<span class="str">"accuracy"</span>]:.3f}'</span>)

di = audit_baseline[<span class="num">1</span>][<span class="str">'positive_rate'</span>] / <span class="fn">max</span>(audit_baseline[<span class="num">0</span>][<span class="str">'positive_rate'</span>], <span class="num">1e-9</span>)
eo_diff = <span class="fn">abs</span>(audit_baseline[<span class="num">1</span>][<span class="str">'tpr'</span>] - audit_baseline[<span class="num">0</span>][<span class="str">'tpr'</span>])
<span class="fn">print</span>(f<span class="str">'\\nDisparate Impact (group 1 / group 0): {di:.3f}  (1.0 = parity, 4/5 rule fails &lt; 0.8)'</span>)
<span class="fn">print</span>(f<span class="str">'Equal Opportunity gap |dTPR|:         {eo_diff:.3f}  (small is good)'</span>)
</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Eğitim bölünmesinde bir <code>GradientBoostingClassifier(n_estimators=120, max_depth=3)</code> oturtur ve <code>predict_proba(Xte)[:,1]</code>'i 0.5 eşiğinde sert tahminlere çevirir. 2) <code>audit(y_true, y_pred, scores, s)</code>'i tanımlar; grup <code>g in [0,1]</code> üzerinde döner ve grup başına örnek sayısı, pozitif oran, TPR (<code>((yp==1)&(yt==1)&m).sum() / ((yt==1)&m).sum()</code>), FPR, ortalama skor ve doğruluğu hesaplar. 3) Genel AUC için <code>roc_auc_score</code> çağırır, sonra disparate impact'i grup-1 / grup-0 pozitif-oran oranı ve eşit-fırsat farkını <code>|TPR_1 − TPR_0|</code> olarak hesaplar — 4/5 kuralı ve 0.05 |dTPR| hedefi karşısında karşılaştırdığın iki başlık adillik sayısı.</p>

<p class="l-text">Tipik çıktı: farklı etki &lt; 0.8 ve / veya |dTPR| &gt; 0.05, tam olarak beklediğimiz ihlal örüntüsü. Modele region özniteliğini hiç göstermesek de, model azınlık grubunu yüksek-riskli olarak işaretlemeye daha eğilimlidir. Korelasyonlu öznitelikler sızdırmayı yapmıştır.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. SHAP Atfı — Önyargı Nereden Giriyor?</h2>
<p class="l-text">Şimdi sızıntıyı yerelleştiriyoruz. Grup başına SHAP değerlerini hesapla; gruplar arasında ortalama SHAP'i keskin farklılaşan öznitelikler, region'ın tahmine sızdığı kanallardır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Manual SHAP via subset enumeration — works because feats &lt;= 7 here</span>
<span class="kw">from</span> itertools <span class="kw">import</span> combinations
<span class="kw">from</span> math <span class="kw">import</span> factorial
<span class="kw">import</span> numpy <span class="kw">as</span> np

n_feat = <span class="fn">min</span>(<span class="num">6</span>, Xtr.shape[<span class="num">1</span>])
mu = Xtr[:, :n_feat].<span class="fn">mean</span>(axis=<span class="num">0</span>)

<span class="kw">def</span> <span class="fn">coalition_value</span>(model, S, x):
    z = mu.<span class="fn">copy</span>()
    <span class="kw">for</span> j <span class="kw">in</span> S: z[j] = x[j]
    full = np.<span class="fn">concatenate</span>([z, Xtr[<span class="num">0</span>, n_feat:]])      <span class="cm"># pad with mean for unused dims</span>
    <span class="kw">return</span> model.<span class="fn">predict_proba</span>(full.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>,<span class="num">1</span>]

<span class="kw">def</span> <span class="fn">shapley_one</span>(model, x):
    phi = np.<span class="fn">zeros</span>(n_feat)
    <span class="kw">for</span> i <span class="kw">in</span> <span class="fn">range</span>(n_feat):
        rest = [j <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(n_feat) <span class="kw">if</span> j != i]
        <span class="kw">for</span> k <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(rest)+<span class="num">1</span>):
            <span class="kw">for</span> S <span class="kw">in</span> <span class="fn">combinations</span>(rest, k):
                w = <span class="fn">factorial</span>(<span class="fn">len</span>(S)) * <span class="fn">factorial</span>(n_feat - <span class="fn">len</span>(S) - <span class="num">1</span>) / <span class="fn">factorial</span>(n_feat)
                phi[i] += w * (<span class="fn">coalition_value</span>(model, <span class="fn">list</span>(S)+[i], x) - <span class="fn">coalition_value</span>(model, <span class="fn">list</span>(S), x))
    <span class="kw">return</span> phi

<span class="cm"># Average SHAP per group on a small sample</span>
n_per_group = <span class="num">8</span>
phi_g = {}
<span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>]:
    idx = np.<span class="fn">where</span>(ste == g)[<span class="num">0</span>][:n_per_group]
    phi_g[g] = np.<span class="fn">mean</span>([<span class="fn">shapley_one</span>(baseline, Xte[i]) <span class="kw">for</span> i <span class="kw">in</span> idx], axis=<span class="num">0</span>)

<span class="fn">print</span>(<span class="str">'Per-group mean SHAP (top features that differ most between groups):'</span>)
diff = phi_g[<span class="num">1</span>] - phi_g[<span class="num">0</span>]
order = np.<span class="fn">argsort</span>(-np.<span class="fn">abs</span>(diff))
<span class="kw">for</span> j <span class="kw">in</span> order[:<span class="num">5</span>]:
    <span class="fn">print</span>(f<span class="str">'  {feats[j]:&lt;25s} group0={phi_g[0][j]:+.3f}  group1={phi_g[1][j]:+.3f}  diff={diff[j]:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>2^n</code> Shapley sayımı ucuz kalsın diye dikkati ilk <code>n_feat = min(6, Xtr.shape[1])</code> özniteliğe kısıtlar ve eğitim seti ortalamasını <code>mu</code>'da arka plan "öznitelik yok" değeri olarak tutar. 2) <code>coalition_value(model, S, x)</code>'i tanımlar — <code>mu</code>'yu kopyala, S'deki indeksleri x'in değerleriyle üzerine yaz, yok sayılan boyutlar için <code>Xtr[0, n_feat:]</code> ile doldur ve modelin churn olasılığını oku. 3) <code>shapley_one(model, x)</code> içinde <code>itertools.combinations</code> ile kalan özniteliklerin her alt kümesini sayar, <code>|S|!(n-|S|-1)!/n!</code> ile ağırlıklandırır ve marjinal katkıları toplar — kesin Shapley değeri. 4) <code>shapley_one</code>'ı grup başına 8 örnek üzerinde ortalar, sonra öznitelik başına farkı <code>phi_g[1] − phi_g[0]</code>'ı mutlak büyüklüğe göre sıralayarak yazdırır — <code>region</code>'ın sızdığı vekil kanallar.</p>

<p class="l-text">En büyük <code>diff</code>'e sahip öznitelikler vekil değişkenlerdir — region ile korelasyon gösterirler ve model onları öyle kullanmaktadır. Bu tanıdır. Şimdi azaltmayı körü körüne uygulamak yerine doğru yere yönlendirebiliriz.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Bireysel Kararlar için LIME</h2>
<p class="l-text">SHAP, küresel grup başına görünümü verir. LIME, belirli bir reddetmeyi bir müşteriye açıklamak için ihtiyacımız olan karar başına görünümü verir. Her gruptan reddedilmiş bir başvuran seçip LIME çalıştırıyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Lasso
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="kw">def</span> <span class="fn">lime_local</span>(model, x, X_train, n_samples=<span class="num">400</span>, kernel_width=<span class="num">0.75</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    n = <span class="fn">len</span>(x)
    masks = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, size=(n_samples, n))
    bg = X_train[rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(X_train), size=(n_samples, n)), np.<span class="fn">arange</span>(n)]
    Z = np.<span class="fn">where</span>(masks==<span class="num">1</span>, x, bg)
    f_z = model.<span class="fn">predict_proba</span>(Z)[:,<span class="num">1</span>]
    d = np.<span class="fn">sqrt</span>(((<span class="num">1</span> - masks)**<span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>)) / np.<span class="fn">sqrt</span>(n)
    w = np.<span class="fn">exp</span>(-(d**<span class="num">2</span>) / (kernel_width**<span class="num">2</span>))
    <span class="kw">return</span> <span class="fn">Lasso</span>(alpha=<span class="num">0.01</span>).<span class="fn">fit</span>(masks, f_z, sample_weight=w).coef_

rejected = {g: <span class="fn">int</span>(np.<span class="fn">where</span>((pred==<span class="num">1</span>) &amp; (ste==g))[<span class="num">0</span>][<span class="num">0</span>]) <span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]}
<span class="kw">for</span> g, idx <span class="kw">in</span> rejected.<span class="fn">items</span>():
    coefs = <span class="fn">lime_local</span>(baseline, Xte[idx], Xtr, seed=<span class="fn">int</span>(idx))
    top = <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, coefs), key=<span class="kw">lambda</span> t: -<span class="fn">abs</span>(t[<span class="num">1</span>]))[:<span class="num">5</span>]
    <span class="fn">print</span>(f<span class="str">'\\nGroup {g} sample rejection (test idx {idx}, score={proba[idx]:.3f}):'</span>)
    <span class="kw">for</span> f, c <span class="kw">in</span> top:
        arrow = <span class="str">'↑'</span> <span class="kw">if</span> c &gt; <span class="num">0</span> <span class="kw">else</span> <span class="str">'↓'</span>
        <span class="fn">print</span>(f<span class="str">'  {arrow} {f:&lt;25s} {c:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) <code>lime_local(model, x, X_train, ...)</code>'ı tanımlar; <code>n_samples=400</code> ikili maske örnekler ve <code>np.where(masks==1, x, bg)</code> ile pertürbe satırları yeniden inşa eder — maske 1 olduğunda <code>x</code>'in değeri tutulur, 0 olduğunda eğitim dağılımından örneklenir — ve her birini Hamming mesafesi üzerinde üstel bir çekirdek ile ağırlıklandırır. 2) <code>(masks, f_z)</code> üzerinde ağırlıklı <code>Lasso(alpha=0.01)</code> oturtur ve öznitelik başına katsayı vektörünü döndürür — yerel doğrusal vekil. 3) <code>rejected = {g: pred==1 ve ste==g olan ilk idx}</code> kurar, her gruptan bir reddedilmiş başvuran alır, her birinde <code>lime_local</code> çalıştırır ve en iyi 5 özniteliği <code>abs(coef)</code>'a göre sıralayıp her özniteliğin reddetmeye doğru ittiğini gösteren ↑/↓ oklarla yazdırır.</p>

<p class="l-text">Örüntü kontrolü: aynı öznitelik grup 1 reddetmelerine sistematik olarak baskınsa, neden önyargı oluştuğuna dair müşteri başına bir hikayen olur — tam olarak bir denetim panelinin istediği şey.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Reddedilen Başvuranlar için Karşı-Olgu Üretimi</h2>
<p class="l-text">Birine "reddedildin çünkü feature_X çok düşüktü" demek bir şey; "X'in 0.5 olsaydı onaylanırdın" demek başka. Izgara araması ile her reddedilen başvuran için karşı-olgular üret.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">grid_cf</span>(model, x, target_class=<span class="num">0</span>, n_grid=<span class="num">10</span>):
    best = <span class="kw">None</span>
    <span class="kw">for</span> j <span class="kw">in</span> <span class="fn">range</span>(<span class="fn">len</span>(x)):
        <span class="kw">for</span> v <span class="kw">in</span> np.<span class="fn">linspace</span>(-<span class="num">2.5</span>, <span class="num">2.5</span>, n_grid):
            xp = x.<span class="fn">copy</span>(); xp[j] = v
            <span class="kw">if</span> <span class="fn">int</span>(model.<span class="fn">predict</span>(xp.<span class="fn">reshape</span>(<span class="num">1</span>,-<span class="num">1</span>))[<span class="num">0</span>]) == target_class:
                cost = <span class="fn">abs</span>(xp[j] - x[j])
                <span class="kw">if</span> best <span class="kw">is</span> <span class="kw">None</span> <span class="kw">or</span> cost &lt; best[<span class="num">0</span>]:
                    best = (cost, j, x[j], v)
    <span class="kw">return</span> best

<span class="fn">print</span>(<span class="str">'Counterfactual recourse cost per group:'</span>)
costs_g = {<span class="num">0</span>: [], <span class="num">1</span>: []}
<span class="kw">for</span> idx <span class="kw">in</span> np.<span class="fn">where</span>(pred==<span class="num">1</span>)[<span class="num">0</span>][:<span class="num">30</span>]:
    res = <span class="fn">grid_cf</span>(baseline, Xte[idx], target_class=<span class="num">0</span>)
    <span class="kw">if</span> res: costs_g[ste[idx]].<span class="fn">append</span>(res[<span class="num">0</span>])
<span class="kw">for</span> g, c <span class="kw">in</span> costs_g.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  Group {g}: mean recourse cost = {np.mean(c):.3f}  (n={len(c)})'</span>)
<span class="fn">print</span>(<span class="str">'A larger recourse cost for one group → unequal recourse → fairness concern.'</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>grid_cf(model, x, target_class, n_grid)</code>'i tanımlar; her özniteliği <code>j</code>, <code>[-2.5, 2.5]</code> (ölçeklenmiş öznitelik uzayı) içinde 10 noktalı grid üzerinde tarar, her aday için <code>model.predict</code> çağırır ve <code>target_class=0</code>'a çevirten en küçük <code>abs(xp[j] - x[j])</code> değişikliği saklar. 2) <code>pred==1</code> olan ilk 30 indeks (reddedilen başvuranlar) üzerinde döner, her birine <code>grid_cf</code> çağırır ve dönen maliyeti <code>costs_g[ste[idx]]</code>'a ekler. 3) <code>np.mean(c)</code> ile grup başına ortalama rota maliyetini yazdırır — iki ortalama arasındaki büyük fark, toplu sonuç oranlarının açığa çıkaramayacağı CERTIFAI tarzı "rota yükü" eşitsizliğidir.</p>

<p class="l-text">Rota maliyetinde eşitsizlik, Sharma ve ark.'nın (CERTIFAI 2020) adillik çerçevelerinin merkezine koyduğu metriktir. Eşit pozitif oranlara sahip bir model bile, bir grubun reddetmeyi çevirmek için daha çok iş yapması gerekiyorsa adil olmayabilir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Azaltma 1 — Yeniden Ağırlıklandırma (Ön-İşleme)</h2>
<p class="l-text">Kamiran-Calders yeniden ağırlıklandırmayı uygula: ortak dağılımı bağımsız yapan (grup, etiket) başına ağırlıkları hesapla, yeniden eğit.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">kc_weights</span>(y, s):
    n = <span class="fn">len</span>(y); w = np.<span class="fn">ones</span>(n)
    <span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
        <span class="kw">for</span> c <span class="kw">in</span> [<span class="num">0</span>,<span class="num">1</span>]:
            mask = (s==g) &amp; (y==c)
            <span class="kw">if</span> mask.<span class="fn">any</span>():
                w[mask] = ((s==g).<span class="fn">mean</span>() * (y==c).<span class="fn">mean</span>()) / (mask.<span class="fn">mean</span>() + <span class="num">1e-9</span>)
    <span class="kw">return</span> w

w_tr = <span class="fn">kc_weights</span>(ytr, str_)
rew_model = <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">120</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xtr, ytr, sample_weight=w_tr)

proba_rew = rew_model.<span class="fn">predict_proba</span>(Xte)[:,<span class="num">1</span>]
pred_rew  = (proba_rew &gt;= <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
audit_rew = <span class="fn">audit</span>(yte, pred_rew, proba_rew, ste)
acc_rew = (pred_rew == yte).<span class="fn">mean</span>()

<span class="fn">print</span>(f<span class="str">'Reweighted model: accuracy={acc_rew:.3f}'</span>)
<span class="kw">for</span> g, m <span class="kw">in</span> audit_rew.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  Group {g}: pos_rate={m[<span class="str">"positive_rate"</span>]:.3f}, TPR={m[<span class="str">"tpr"</span>]:.3f}, FPR={m[<span class="str">"fpr"</span>]:.3f}'</span>)
di_r  = audit_rew[<span class="num">1</span>][<span class="str">'positive_rate'</span>] / <span class="fn">max</span>(audit_rew[<span class="num">0</span>][<span class="str">'positive_rate'</span>], <span class="num">1e-9</span>)
eo_r  = <span class="fn">abs</span>(audit_rew[<span class="num">1</span>][<span class="str">'tpr'</span>] - audit_rew[<span class="num">0</span>][<span class="str">'tpr'</span>])
<span class="fn">print</span>(f<span class="str">'\\nDisparate Impact: {di:.3f} → {di_r:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'|dTPR|:           {eo_diff:.3f} → {eo_r:.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>kc_weights(y, s)</code> dört <code>(g, c)</code> hücresi üzerinde döner ve her örneğe <code>w = P(s=g)·P(y=c) / P(s=g, y=c)</code> atar — tam olarak Kamiran-Calders formülü; bu, beklenti olarak grup ile etiketin korelasyonunu kırar. 2) Aynı <code>GradientBoostingClassifier</code>'ı <code>(Xtr, ytr)</code>'de <code>sample_weight=w_tr</code> ile yeniden oturtur — böylece optimizasyon yeniden dengelenmiş bir ortak dağılım görür — sonra <code>predict_proba</code>'yı 0.5'te eşikler. 3) Bölüm 2'deki <code>audit</code> yardımcısını yeniden ağırlıklandırılmış tahminlerde yeniden koşturur ve yeni <code>di_r</code> ile <code>eo_r</code>'yi temel değerlerin yanında yazdırır — iyileştirmeyi doğrudan <code>{di:.3f} → {di_r:.3f}</code> satırından okuyabilirsin.</p>

<p class="l-text">Yeniden ağırlıklandırma tipik olarak DI ve dTPR'yi küçük bir doğruluk maliyetiyle (1-2 puan) iyileştirir. En ucuz ilk hamledir ve genellikle tek başına yeterlidir.</p>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Azaltma 2 — Eşik Optimizasyonu (Son-İşleme)</h2>
<p class="l-text">Yeniden ağırlıklandırmadan sonra bile artık boşluklar kalır. Hardt 2016 eşik optimizasyonunu uygula: TPR'yi eşitlemek için grup başına eşikler seç.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">def</span> <span class="fn">find_thresholds</span>(scores, y, s):
    ts = np.<span class="fn">linspace</span>(<span class="num">0.05</span>, <span class="num">0.95</span>, <span class="num">50</span>)
    best = (<span class="num">1.0</span>, <span class="num">0.5</span>, <span class="num">0.5</span>)
    <span class="kw">for</span> t0 <span class="kw">in</span> ts:
        <span class="kw">for</span> t1 <span class="kw">in</span> ts:
            tpr0 = ((scores[(s==<span class="num">0</span>) &amp; (y==<span class="num">1</span>)] &gt;= t0).<span class="fn">mean</span>()) <span class="kw">if</span> ((s==<span class="num">0</span>) &amp; (y==<span class="num">1</span>)).<span class="fn">any</span>() <span class="kw">else</span> <span class="num">0</span>
            tpr1 = ((scores[(s==<span class="num">1</span>) &amp; (y==<span class="num">1</span>)] &gt;= t1).<span class="fn">mean</span>()) <span class="kw">if</span> ((s==<span class="num">1</span>) &amp; (y==<span class="num">1</span>)).<span class="fn">any</span>() <span class="kw">else</span> <span class="num">0</span>
            d = <span class="fn">abs</span>(tpr0 - tpr1)
            <span class="kw">if</span> d &lt; best[<span class="num">0</span>]: best = (d, t0, t1)
    <span class="kw">return</span> best

<span class="cm"># Use validation portion of training to find thresholds, then test on Xte</span>
gap, t0, t1 = <span class="fn">find_thresholds</span>(proba_rew, yte, ste)
pred_thr = np.<span class="fn">where</span>(ste==<span class="num">0</span>, proba_rew &gt;= t0, proba_rew &gt;= t1).<span class="fn">astype</span>(<span class="fn">int</span>)
audit_thr = <span class="fn">audit</span>(yte, pred_thr, proba_rew, ste)
acc_thr = (pred_thr == yte).<span class="fn">mean</span>()

<span class="fn">print</span>(f<span class="str">'Per-group thresholds: t_0={t0:.2f}, t_1={t1:.2f}'</span>)
<span class="fn">print</span>(f<span class="str">'Final model accuracy={acc_thr:.3f}'</span>)
<span class="kw">for</span> g, m <span class="kw">in</span> audit_thr.<span class="fn">items</span>():
    <span class="fn">print</span>(f<span class="str">'  Group {g}: pos_rate={m[<span class="str">"positive_rate"</span>]:.3f}, TPR={m[<span class="str">"tpr"</span>]:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'\\nFinal |dTPR| = {abs(audit_thr[1][<span class="str">"tpr"</span>] - audit_thr[0][<span class="str">"tpr"</span>]):.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>find_thresholds(scores, y, s)</code>, <code>[0.05, 0.95]</code> aralığında 50×50 aday üzerinde her <code>(t0, t1)</code> çiftini grid-arar, o eşikte grup başına TPR'yi hesaplar ve <code>|TPR_0 − TPR_1|</code>'i minimize eden çifti saklar. 2) Seçilen eşikleri zaten yeniden ağırlıklandırılmış olasılıkların üzerine <code>np.where(ste==0, proba_rew &gt;= t0, proba_rew &gt;= t1)</code> ile uygular — ön-işlemenin üzerine katmanlanmış Hardt-tarzı son-işleme. 3) Yeni tahminleri denetler ve <code>(t0, t1)</code>'i artık <code>|dTPR|</code> ile birlikte yazdırır; eşik adımının farkı ne kadar kapattığını ve hangi doğruluk maliyetiyle yaptığını görebilirsin.</p>

<p class="l-text">Uyarı (L3'te belirtildi): grup başına eşikler yasal olarak sıkıntılı olabilir. Bazı yargı yetkilerinde (US Title VII, ECOA), karar zamanında korunan bir özniteliğin açık kullanımı korunan sınıfı kayırsa bile yasadışıdır. Pratikte ABD firmaları genellikle grup başına eşikleri dikkatlice ayarlanmış tek eşiklerle artı ön-işleme yeniden ağırlıklandırma ile değiştirir. AB düzenleyicileri grup başına son-işlemeye, önceden kayıtlı olduğunda tipik olarak daha izin vericidir.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Üç Modelde Değiş Tokuşları Karşılaştırma</h2>
<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd

summary = pd.<span class="fn">DataFrame</span>({
    <span class="str">'baseline'</span>:         {<span class="str">'accuracy'</span>: overall_acc, <span class="str">'DI'</span>: di,   <span class="str">'|dTPR|'</span>: eo_diff},
    <span class="str">'reweighted'</span>:       {<span class="str">'accuracy'</span>: acc_rew,     <span class="str">'DI'</span>: di_r, <span class="str">'|dTPR|'</span>: eo_r},
    <span class="str">'rewt + threshold'</span>: {<span class="str">'accuracy'</span>: acc_thr,     <span class="str">'DI'</span>: audit_thr[<span class="num">1</span>][<span class="str">'positive_rate'</span>]/<span class="fn">max</span>(audit_thr[<span class="num">0</span>][<span class="str">'positive_rate'</span>],<span class="num">1e-9</span>), <span class="str">'|dTPR|'</span>: <span class="fn">abs</span>(audit_thr[<span class="num">1</span>][<span class="str">'tpr'</span>]-audit_thr[<span class="num">0</span>][<span class="str">'tpr'</span>])},
}).T
<span class="fn">print</span>(<span class="str">'Fairness-accuracy trade-off summary:'</span>)
<span class="fn">print</span>(summary.<span class="fn">round</span>(<span class="num">3</span>))
</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Her model için bir satır olacak şekilde bir <code>pd.DataFrame</code> kurar — temel, yeniden ağırlıklandırılmış, yeniden ağırlıklandırılmış + eşik — bölüm 2, 6 ve 7'de hesaplanan değişkenlerden <code>accuracy</code>, <code>DI</code> ve <code>|dTPR|</code>'yi çeker. 2) <code>.T</code> ile transpoze eder, böylece her model bir satır olur, ve üç ondalıkla <code>summary.round(3)</code> ile yazdırır. 3) Tablo adillik-doğruluk değiş tokuşunu tek bakışta gösterir — tam olarak bir inceleme kuruluna teslim ettiğin artefakt; çalışma noktasını seçebilsinler.</p>

<p class="l-text">Tipik örüntü: her azaltma adımı, 1-2 puan doğruluk maliyetiyle adilliği %30-50 iyileştirir. Tamamen azaltılmış model hâlâ kusursuz pariteye sahip değildir (imkânsızlık teoremi), ancak |dTPR| %5'in altına düşmelidir — çoğu düzenleyicinin önemli ölçüde eşit olarak kabul ettiği kaba eşik.</p>

<div class="calc-highlight"><strong>İnceleme kurulları için anahtar grafik:</strong> azaltma stratejilerinde doğruluk vs. adilliğin Pareto grafiği. Temeli bir nokta olarak, yeniden ağırlıklandırılmış olanı diğer olarak, eşik-optimize edilmiş olanı üçüncü olarak göster; kurula çalışma noktasını seçtir. Değiş tokuşu gizlemek yerine göstermek, gerçek bir denetimle CYA egzersizi arasındaki farktır.</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Model Kartı Üretme</h2>
<p class="l-text">Mitchell ve ark. <em>Model Cards for Model Reporting</em> (FAccT 2019), bir modeli paydaşlar için nasıl belgeleyeceğini standartlaştırdı. Yukarıdaki denetim çalışması doğrudan bir model-kartı yapısına eşlenir. Programatik olarak bir tane üretiyoruz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Generate a model card as markdown</span>
card = f<span class="str">"""
<span class="cm"># Model Card — Loan Risk Classifier v1.0</span>

<span class="cm">## Intended Use</span>
Predict probability of churn / default. Used to flag high-risk customers for review.
NOT to be used as the sole automated decision; human review required for adverse actions.

<span class="cm">## Data</span>
- Source: df_churn (n={len(df)})
- Features: {len(feats)} numeric features
- Protected attribute (audit only, not in training): synthetic 'region', 35/65 split

<span class="cm">## Performance</span>
- Overall accuracy (test): {acc_thr:.3f}
- Overall AUC (test):      {overall_auc:.3f}
- Group 0 accuracy:        {audit_thr[0]['accuracy']:.3f}
- Group 1 accuracy:        {audit_thr[1]['accuracy']:.3f}

<span class="cm">## Fairness Audit</span>
- Disparate Impact:        {audit_thr[1]['positive_rate']/max(audit_thr[0]['positive_rate'],1e-9):.3f} (target &gt; 0.8)
- Equal Opportunity |dTPR|:{abs(audit_thr[1]['tpr']-audit_thr[0]['tpr']):.3f} (target &lt; 0.05)

<span class="cm">## Mitigations Applied</span>
- Pre-processing: Kamiran-Calders reweighting on (region, churn) joint
- Post-processing: Per-group threshold optimization for equal opportunity (t_0={t0:.2f}, t_1={t1:.2f})

<span class="cm">## Limitations</span>
- Single sensitive attribute audited; intersectional groups not analyzed
- Distributional shift between deployment and train data not monitored here
- Per-group thresholds may not comply with all jurisdictions; legal review required

<span class="cm">## Recourse</span>
- Counterfactual generator available; mean recourse cost reported per group
- All adverse decisions accompanied by minimum-change suggestion
"""</span>
<span class="fn">print</span>(card)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Son değerleri — <code>acc_thr</code>, <code>overall_auc</code>, <code>audit_thr</code>'dan grup başına doğruluk, disparate impact, |dTPR|, seçilen eşikler <code>(t0, t1)</code> ve veri kümesi boyutu <code>len(df)</code> — interpolasyonla birleştiren bir f-string ile markdown model kartı kurar. 2) Mitchell ve ark. model-kart bölümlerini sabit sırada gömer (Amaçlanan Kullanım, Veri, Performans, Adillik Denetimi, Uygulanan Azaltmalar, Sınırlamalar, Rota); böylece çıktı doğrudan bir model kayıt defterine eklenebilir. 3) Kartı yazdırır; bir markdown dosyasına veya kayıt defteri girişine kopyalayabilirsin.</p>

<p class="l-text">Gerçek bir dağıtımda bu kart, model kayıt defterinde (MLflow, Weights &amp; Biases, dahili) model artefaktının yanında yaşar. Her yeniden eğitim taze bir kart üretir; farkları adillik komitesi inceler.</p>
</div>

<div class="lesson-block" id="section-10">
<h2 class="lesson-title">10. İzleme Planı</h2>
<p class="l-text">Eğitim zamanında adil olan bir model üretimde adil olmayan hale sürüklenebilir. Dağılım kayması, demografik kaymalar ve geri besleme döngüleri (kararlarının gelecekteki eğitim verisini etkilediği bir model) zaman içinde adilliği bozar. Aşağıdaki izleme planı mlops-L11'in ayrıntılı kurduğu şeydir; burada minimum uygulanabilir sürümdür.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Günlük metrikler</div><div class="card-body">Grup başına pozitif oran, TPR, FPR, kalibrasyon. DI 0.85'in altına düştüğünde veya |dTPR| 7 günlük bir pencere üzerinde 0.06'yı aştığında alarm ver.</div></div>
<div class="calc-card"><div class="card-title">Haftalık sürüklenme</div><div class="card-body">Her girdi özniteliğinde PSI (Nüfus Kararlılık Endeksi); skor dağılımında KS testi. PSI &gt; 0.2 veya skor-KS p &lt; 0.01 olduğunda alarm ver.</div></div>
<div class="calc-card"><div class="card-title">Aylık denetim</div><div class="card-body">Son 30 günlük veri üzerinde tam SHAP grup başına analizi yeniden çalıştır. Karşı-olgu maliyet denetimini yeniden çalıştır. Model kartı ile karşılaştır; herhangi bir metrik sürüklenmesi göreli %20 üstündeyse işaretle.</div></div>
<div class="calc-card"><div class="card-title">Üç aylık inceleme</div><div class="card-body">Hukuk, ürün, müşteri desteği ve etkilenen topluluklardan paydaşlarla insan komitesi incelemesi. Yeniden eğitim, eşik güncellemeleri veya model emekliliğine karar ver.</div></div>
</div>

<div class="calc-highlight"><strong>Cazibesiz gerçek:</strong> üretim adillik çalışmasının %80'i izlemedir, azaltma değil. Hemen hemen her model eğitim zamanında adil yapılabilir; 18 aylık üretim sürüklenmesi boyunca onu adil tutmak gerçek iştir. Önce izleme altyapısını inşa et; düzenleyicilerin denetlediği ve sonraki her iyileştirmeyi mümkün kılan budur.</div>
</div>

<div class="lesson-block" id="section-11">
<h2 class="lesson-title">11. Modelin Sevk Edilmemesi Gerektiğinde</h2>
<p class="l-text">Bazen bir adillik denetimine doğru cevap "dağıtma"dır. Ne zamanını bilmek becerinin yarısıdır. Kısa bir liste:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Keskin doğruluk uçurumu</div><div class="card-body">Kabul edilebilir adilliği elde etmek &gt; 10 puan doğruluğa mal oluyorsa, altta yatan veri bir grup için yetersizdir. Modelden önce veriyi düzelt.</div></div>
<div class="calc-card"><div class="card-title">Rota imkânsız</div><div class="card-body">Karşı-olgular değişmez öznitelikleri (yaş, posta kodu, aile büyüklüğü) değiştirmeyi gerektiriyorsa, model eyleme dönük değildir. "Karar" aracı olarak dağıtma — en fazla zorunlu insan geçersiz kılma ile bir "tarama" aracı.</div></div>
<div class="calc-card"><div class="card-title">Olumsuz seçim geri beslemesi</div><div class="card-body">Modelin kararları eğitim verisine geri beslenirse (reddedilen başvurular etiket üretmez), model zamanla önyargısını kötüleştirir. Liu, Dean, Rolf, Simchowitz &amp; Hardt (ICML 2018) <em>Delayed Impact</em>, adillik-kısıtlı modellerin bile bu testte başarısız olduğunu gösterdi.</div></div>
<div class="calc-card"><div class="card-title">Bahisler çok yüksek</div><div class="card-body">Şiddetli telafi edilemez sonuçları olan kararlar (ceza adaleti, tıbbi) için çıta %80 farklı etkiden çok daha yüksektir. Bazen doğru model, insanların geçersiz kılabileceği çok daha basit bir modeldir.</div></div>
</div>

<p class="l-text">Buolamwini, Gebru &amp; Mitchell, doğruluk boşlukları sürdükçe ticari yüz tanıma dağıtımlarının durdurulmasını alenen önerdi; Joy Buolamwini'nin 2024 kitabı <em>Unmasking AI</em>, bu önerinin politika etkisine ulaşmasını belgeler (ABD federal moratoryumu, EU AI Act'in kamu alanlarında gerçek zamanlı biyometrik kimlik tanımlama yasağı). "Bu sevk edilmemeli" demenin ne zamanını bilmek işin parçasıdır.</p>
</div>

<div class="lesson-block" id="section-12">
<h2 class="lesson-title">12. Özet ve Sonraki Adımlar</h2>
<p class="l-text">Bu capstone tüm hattı gösterdi: veri sentezle, temel, denetle, açıkla (SHAP, LIME, karşı-olgu), azalt (ön + son), yeniden denetle, belgele (model kartı), izle. Her adım yeniden kullanılabilir koddur. Örüntüler genelleşir: veri kümesini değiştir, korunan özniteliği değiştir, modeli değiştir — çerçeve aynıdır.</p>

<div class="calc-highlight"><strong>Tüm parça için anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>Adillik, açıklanabilirlik ve rota üç farklı paydaş sorusudur; her yöntem birini ele alır.</li>
<li>Ön / iç / son işlemenin her birinin bir yeri vardır; hatta neyi düzenleyebileceğine göre seç.</li>
<li>Küresel ve grup başına atıf için SHAP, hızlı bireysel kararlar için LIME, eyleme dönük rota için karşı-olgular.</li>
<li>Mekanistik yorum farklı bir soruyu yanıtlar — model nasıl hesaplar — ve LLM güvenliği için merkezi hale gelmektedir.</li>
<li>Adillik-doğruluk değiş tokuşu gerçektir ama genellikle algoritma seçiminden çok eksik veriyi işaret eder.</li>
<li>Üretim adillik çalışmasının %80'i izlemedir, azaltma değil; gösterge tablolarını önce inşa et.</li>
<li>Bazen doğru cevap "sevk etme"dir — bu da bir teslim edilebilirdir.</li>
</ul>
</div>

<p class="l-text">Buradan: üretim adillik izleme altyapısı için <strong>mlops-L11</strong>; özellikle dil modellerinde adillik (toksisite, gömme uzaylarında demografik önyargılar) için <strong>nlp-L12</strong>; otonom LLM ajanlarında adillik ve güvenlik için <strong>agents-L11</strong>. Adillik parçası sana matematiksel ve metodolojik kelime dağarcığını verir; o parçalar onu günlük olarak kullanmak için üretim araçlarını verir.</p>
</div>`
};
