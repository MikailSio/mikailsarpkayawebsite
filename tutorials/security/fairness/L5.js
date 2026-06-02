window.FAIRNESS_L5 = {
en: `<p class="l-text"><strong>LIME predates SHAP and is still the most-used local explainer in production</strong> — not because it is theoretically tighter (it isn't; SHAP wins on axioms), but because it is faster, more flexible, and works on any model and any data type. Ribeiro, Singh &amp; Guestrin's 2016 KDD paper <em>"Why Should I Trust You?": Explaining the Predictions of Any Classifier</em> is now one of the most cited ML papers of the decade. The idea is disarmingly simple: around a single point you want to explain, perturb the input, run the perturbations through the black-box model, and fit a tiny interpretable model (linear regression, decision stump) on that local neighborhood. The interpretable model is the explanation.</p>

<p class="l-text">In this lesson we build LIME from scratch in three settings — tabular, text, and image — and see how the perturbation strategy is the entire game. For tabular: discretize features and flip them. For text: drop random words. For image: drop random superpixels. The math underneath is the same: minimize a fidelity loss on the local neighborhood, plus a complexity penalty so the surrogate stays interpretable. We also compare LIME and SHAP head-to-head on the same prediction, see where they agree, and look at the well-known instability of LIME (Alvarez-Melis &amp; Jaakkola 2018) and how to detect it.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Implement LIME for tabular data with feature discretization and binary perturbation masks</li>
<li>State the local-fidelity / complexity trade-off and pick a kernel width sensibly</li>
<li>Build LIME for text (drop-words) and image (drop-superpixels) using the same template</li>
<li>Diagnose LIME instability: re-run on the same point and quantify variance across runs</li>
<li>Compare LIME vs. SHAP on identical predictions; understand when they disagree and why</li>
<li>Apply LIME to a fairness audit: explain individual flagged cases for human review</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. The LIME Loss (Ribeiro 2016)</h2>
<p class="l-text">LIME minimizes a single objective:</p>

<div class="katex-block">$$\\xi(x) = \\arg\\min_{g \\in G} \\;\\; L\\bigl(f, g, \\pi_x\\bigr) + \\Omega(g)$$</div>

<p class="l-text">Here <code>f</code> is the black-box model, <code>g</code> is an interpretable surrogate from a class <code>G</code> (linear models, sparse decision trees), <code>π_x(z)</code> is a proximity kernel measuring how close perturbed point <code>z</code> is to the target <code>x</code>, <code>L</code> is a weighted fidelity loss, and <code>Ω(g)</code> penalizes complexity (number of non-zero coefficients for linear, depth for trees).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Surrogate class G</div><div class="card-body">Almost always sparse linear regression with Lasso. Tiny decision trees occasionally; nothing else has caught on.</div></div>
<div class="calc-card"><div class="card-title">Kernel π_x</div><div class="card-body">Exponential kernel on a distance: <code>exp(-d(x,z)² / σ²)</code>. Choice of <code>σ</code> drives whether the explanation is truly local (small σ) or global-ish (large σ).</div></div>
<div class="calc-card"><div class="card-title">Complexity Ω</div><div class="card-body">L1 penalty on coefficients (Lasso) for linear surrogates; depth limit for trees. Forces a small set of features in the explanation — usually 5-10.</div></div>
</div>

<div class="calc-highlight"><strong>Local-only guarantee:</strong> LIME is faithful only in the neighborhood it samples. The same model can have wildly different LIME explanations at two nearby points if the decision surface is curvy — which is almost always for non-linear models. This is a feature, not a bug, but it is also the source of LIME's notorious instability.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tabular LIME: Implementation from Scratch</h2>
<p class="l-text">For tabular data, the standard LIME recipe (LimeTabularExplainer in the lime library) is: (1) discretize each numeric feature into quartiles; (2) build a binary mask <code>z' ∈ {0,1}ⁿ</code> where <code>z'ᵢ = 1</code> means "feature <code>i</code> takes <code>x</code>'s value", <code>z'ᵢ = 0</code> means "sample feature <code>i</code> from the marginal training distribution"; (3) reconstruct full perturbed inputs <code>z</code>; (4) run the black-box on each <code>z</code>; (5) fit weighted Lasso on <code>(z', f(z))</code> with weights <code>π_x(z')</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Lasso
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

<span class="cm"># Black-box model on df_churn</span>
feats = df_churn.<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).columns.<span class="fn">tolist</span>()[:<span class="num">8</span>]
X = df_churn[feats].<span class="fn">fillna</span>(<span class="num">0</span>).values
y = df_churn[<span class="str">'churned'</span>].values
clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">120</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)

<span class="kw">def</span> <span class="fn">lime_tabular</span>(model_fn, x, X_train, n_samples=<span class="num">500</span>, kernel_width=<span class="num">0.75</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    n = <span class="fn">len</span>(x)
    <span class="cm"># Binary perturbation masks</span>
    masks = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, size=(n_samples, n))
    <span class="cm"># Reconstruct perturbed inputs: z[i]=x[i] if mask=1, else sampled</span>
    Z = np.<span class="fn">where</span>(masks==<span class="num">1</span>, x, X_train[rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(X_train), size=(n_samples, n)), np.<span class="fn">arange</span>(n)])
    <span class="cm"># Predict on perturbations</span>
    f_z = <span class="fn">model_fn</span>(Z)[:,<span class="num">1</span>]
    <span class="cm"># Weights via exp kernel on cosine-ish distance</span>
    d = np.<span class="fn">sqrt</span>(((<span class="num">1</span> - masks)**<span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>)) / np.<span class="fn">sqrt</span>(n)
    w = np.<span class="fn">exp</span>(-(d**<span class="num">2</span>) / (kernel_width**<span class="num">2</span>))
    <span class="cm"># Weighted Lasso on the binary masks</span>
    lasso = <span class="fn">Lasso</span>(alpha=<span class="num">0.01</span>).<span class="fn">fit</span>(masks, f_z, sample_weight=w)
    <span class="kw">return</span> lasso.coef_, lasso.intercept_

x_target = X[<span class="num">0</span>]
coefs, intercept = <span class="fn">lime_tabular</span>(clf.predict_proba, x_target, X)
local_pred = intercept + coefs.<span class="fn">sum</span>() * <span class="num">0</span>   <span class="cm"># zero baseline since masks default to 1's</span>
<span class="fn">print</span>(f<span class="str">'Black-box prediction:    {clf.predict_proba(x_target.reshape(1,-1))[0,1]:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'LIME local intercept:    {intercept:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'Top features pushing UP / DOWN this prediction:'</span>)
<span class="kw">for</span> f, c <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, coefs), key=<span class="kw">lambda</span> t: -<span class="fn">abs</span>(t[<span class="num">1</span>]))[:<span class="num">6</span>]:
    arrow = <span class="str">'↑'</span> <span class="kw">if</span> c &gt; <span class="num">0</span> <span class="kw">else</span> <span class="str">'↓'</span>
    <span class="fn">print</span>(f<span class="str">'  {arrow} {f:&lt;25s} {c:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) fits a <code>RandomForestClassifier</code> as the opaque black-box and defines <code>lime_tabular(model_fn, x, X_train, n_samples, kernel_width, seed)</code> that samples binary masks over the feature indices. 2) reconstructs each perturbed row with <code>np.where(masks==1, x, X_train[...])</code> — keeping <code>x</code>'s value where the mask is 1, drawing from the training marginals where it is 0 — then calls <code>model_fn(Z)[:,1]</code> to get the churn probabilities. 3) weights every perturbation by an exponential kernel on the Hamming distance and fits a weighted <code>Lasso(alpha=0.01)</code> on <code>(masks, f_z)</code>; the Lasso coefficients are LIME's local linear surrogate.</p>

<p class="l-text">Three knobs determine LIME quality. (1) <code>n_samples</code> — too few and the local fit is noisy; 500-5000 is typical. (2) <code>kernel_width</code> — too small and only mask=all-ones gets weight; too large and the explanation becomes global. The lime library defaults to <code>0.75 * sqrt(n_features)</code>. (3) Number of features in the surrogate — controlled by Lasso's α; smaller α keeps more features.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Text LIME: Drop-Word Perturbations</h2>
<p class="l-text">For text classification, the perturbation is: take the input sentence's tokens, randomly drop a subset, predict the class on the dropped sentence. The "feature" is each token; coefficient sign tells you whether removing that token raised or lowered the predicted class probability. The famous Ribeiro 2016 example was a 20-newsgroups Atheism vs. Christianity classifier whose top features were headers like "Posting" and "Host" — proof it had learned the distribution of email metadata, not the topic.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LIME for text — works on any text classifier</span>
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression, Lasso
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Toy review classifier on df_reviews (assume column 'text', label 'positive')</span>
texts = df_reviews[<span class="str">'text'</span>].<span class="fn">astype</span>(<span class="fn">str</span>).<span class="fn">tolist</span>()[:<span class="num">200</span>]
labels = (df_reviews[<span class="str">'rating'</span>] &gt;= <span class="num">4</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values[:<span class="num">200</span>] <span class="kw">if</span> <span class="str">'rating'</span> <span class="kw">in</span> df_reviews.columns <span class="kw">else</span> np.random.<span class="fn">randint</span>(<span class="num">0</span>,<span class="num">2</span>,<span class="num">200</span>)
pipe = <span class="fn">make_pipeline</span>(<span class="fn">TfidfVectorizer</span>(max_features=<span class="num">500</span>), <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>)).<span class="fn">fit</span>(texts, labels)

<span class="kw">def</span> <span class="fn">lime_text</span>(pipe, sentence, n_samples=<span class="num">400</span>, kernel_width=<span class="num">25</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    tokens = sentence.<span class="fn">split</span>()
    n = <span class="fn">len</span>(tokens)
    masks = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, size=(n_samples, n))
    perturbed = [<span class="str">' '</span>.<span class="fn">join</span>(t <span class="kw">for</span> t,m <span class="kw">in</span> <span class="fn">zip</span>(tokens, mask) <span class="kw">if</span> m) <span class="kw">for</span> mask <span class="kw">in</span> masks]
    f_z = pipe.<span class="fn">predict_proba</span>(perturbed)[:,<span class="num">1</span>]
    n_dropped = n - masks.<span class="fn">sum</span>(axis=<span class="num">1</span>)
    w = np.<span class="fn">exp</span>(-(n_dropped**<span class="num">2</span>) / (kernel_width**<span class="num">2</span>))
    lasso = <span class="fn">Lasso</span>(alpha=<span class="num">0.001</span>).<span class="fn">fit</span>(masks, f_z, sample_weight=w)
    <span class="kw">return</span> <span class="fn">list</span>(<span class="fn">zip</span>(tokens, lasso.coef_))

target = texts[<span class="num">0</span>]
contribs = <span class="fn">lime_text</span>(pipe, target)
<span class="fn">print</span>(f<span class="str">'Sentence: <span class="str">"{target[:80]}..."</span>'</span>)
<span class="fn">print</span>(<span class="str">'Top words pushing toward POSITIVE / NEGATIVE:'</span>)
<span class="kw">for</span> tok, c <span class="kw">in</span> <span class="fn">sorted</span>(contribs, key=<span class="kw">lambda</span> t: -<span class="fn">abs</span>(t[<span class="num">1</span>]))[:<span class="num">6</span>]:
    <span class="fn">print</span>(f<span class="str">'  {tok:&lt;15s} {c:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) builds a TF-IDF + <code>LogisticRegression</code> pipeline via <code>make_pipeline</code> as a stand-in text classifier, then defines <code>lime_text(pipe, sentence, n_samples, kernel_width, seed)</code> that tokenises the sentence with <code>sentence.split()</code>. 2) for each binary mask, joins the surviving tokens back into a perturbed sentence with <code>' '.join(...)</code> and calls <code>pipe.predict_proba(perturbed)[:,1]</code> to score every dropped-word variant. 3) weights samples by an exponential kernel on the count of dropped tokens and fits a weighted <code>Lasso(alpha=0.001)</code> on <code>(masks, f_z)</code>; zipping the per-token Lasso coefficients with the original tokens gives the contribution of each word.</p>

<p class="l-text">Critical detail: the perturbation must produce <em>natural-looking</em> text or you are explaining how the model handles broken inputs, not real ones. Drop-word is a reasonable approximation but does break grammar. Modern variants (Anchors, Ribeiro 2018) use mask-and-fill with a language model — closer to the data manifold but slower.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Image LIME: Superpixel Masks</h2>
<p class="l-text">For images, the perturbation is dropping <em>superpixels</em> — small contiguous regions from a SLIC segmentation. The black-box runs on the masked image (dropped regions replaced with mean color or zero), and the surrogate's coefficients tell you which superpixels pushed toward each class. Ribeiro 2016 showed a husky-vs-wolf classifier whose decision was driven entirely by snow in the background — a textbook case of spurious correlation that LIME made obvious.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Step 1 — segment</div><div class="card-body">SLIC (Achanta 2012) gives compact superpixels at a chosen resolution. ~100-300 superpixels per image is typical.</div></div>
<div class="calc-card"><div class="card-title">Step 2 — perturb</div><div class="card-body">Random binary masks over superpixels; mask=0 replaces the region with mean color or grey.</div></div>
<div class="calc-card"><div class="card-title">Step 3 — fit</div><div class="card-body">Same weighted Lasso, with each "feature" being a superpixel index. Visualize positive coefficients in green, negative in red.</div></div>
</div>

<p class="l-text">Image LIME is computationally heavy — 1000-5000 forward passes per explanation. For production CV models, Grad-CAM (Selvaraju 2017) is faster and more reliable; LIME's value is for non-differentiable image models or when you want a single interface across modalities.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. The Instability Problem (Alvarez-Melis &amp; Jaakkola 2018)</h2>
<p class="l-text">Run LIME twice on the same prediction with different random seeds and you can get visibly different explanations. Alvarez-Melis &amp; Jaakkola's NeurIPS 2018 paper formalized this with two stability metrics: <em>local Lipschitz</em> (small input change → small explanation change) and <em>self-similarity</em> (same input + different seed → similar explanation). LIME fails both for many real models.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Re-run LIME 5 times with different seeds and measure variance</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
runs = []
<span class="kw">for</span> seed <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    coefs, _ = <span class="fn">lime_tabular</span>(clf.predict_proba, x_target, X, n_samples=<span class="num">500</span>, seed=seed)
    runs.<span class="fn">append</span>(coefs)
runs = np.<span class="fn">array</span>(runs)
mean = runs.<span class="fn">mean</span>(axis=<span class="num">0</span>); std = runs.<span class="fn">std</span>(axis=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">'Per-feature LIME mean ± std across 5 seeds:'</span>)
<span class="kw">for</span> f, m, s <span class="kw">in</span> <span class="fn">zip</span>(feats, mean, std):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {m:+.3f} ± {s:.3f}    (CV={s/(abs(m)+1e-9):.2f})'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) re-runs <code>lime_tabular(clf.predict_proba, x_target, X, n_samples=500, seed=seed)</code> five times on the same target row, each call with a different seed feeding the internal <code>np.random.default_rng</code>. 2) stacks the returned coefficient vectors into a <code>runs</code> array and reduces with <code>runs.mean(axis=0)</code> and <code>runs.std(axis=0)</code> to get per-feature mean and standard deviation across seeds. 3) prints each feature alongside its mean, std, and coefficient of variation <code>std / (|mean| + 1e-9)</code> — Alvarez-Melis &amp; Jaakkola's self-similarity diagnostic in one column.</p>

<p class="l-text">Diagnostic rule: if the coefficient of variation (std / |mean|) for top features is &gt; 0.3, the explanation is unstable and you should not trust the ranking. Mitigations: increase <code>n_samples</code>, use multiple seeds and average, or switch to SHAP (KernelSHAP is also stochastic but better-behaved). Alvarez-Melis 2018 also proposes adding stability as an explicit objective term.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. LIME vs. SHAP Head-to-Head</h2>
<p class="l-text">Both LIME and SHAP are local feature attribution methods. Both use a perturbation-based approximation. SHAP is axiomatically founded; LIME is heuristic. So when do they disagree, and which should you trust?</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">When they agree</div><div class="card-body">For nearly linear models around the explained point, both converge to the local linear coefficients. Most well-behaved tabular models with not-too-deep interactions: agreement &gt; 80% on top features.</div></div>
<div class="calc-card"><div class="card-title">When they disagree</div><div class="card-body">Strongly non-linear regions, correlated features, or rare combinations. SHAP's coefficients sum to <code>f(x) - E[f(X)]</code> exactly; LIME's do not. SHAP's symmetry axiom is satisfied; LIME's is not.</div></div>
<div class="calc-card"><div class="card-title">Speed</div><div class="card-body">LIME with 500 samples on tabular: ~50 model calls. KernelSHAP with same fidelity: ~2000 calls. TreeSHAP on trees: practically free. For non-tree black boxes, LIME is ~5x faster.</div></div>
</div>

<div class="calc-highlight"><strong>Production rule:</strong> if you have a tree model, use TreeSHAP — it dominates on every axis. For neural nets, DeepSHAP. For arbitrary black boxes where speed matters more than rigor (live UI explanations), LIME. For audits and regulatory reports, KernelSHAP.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. LIME for Fairness Auditing</h2>
<p class="l-text">LIME's role in fairness audits is at the individual level. Take every model decision flagged as potentially unfair (high score variance, near-threshold, in a sensitive demographic), run LIME on each, and have a human reviewer read the explanations. The pattern of features showing up in the negative-class rejections is the qualitative complement to the SHAP-based quantitative analysis from L4.</p>

<p class="l-text">A common discovery: LIME on rejected applications from group A repeatedly highlights "feature_X &gt; threshold", while rejections from group B highlight a varied mix. That asymmetry — same feature, same threshold, used systematically against one group — is exactly what disparate impact litigation looks for. <em>Apple Card vs. women</em> (2019) was diagnosed publicly via this kind of post-hoc explanation pattern, before any aggregate audit had been run.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Audit pattern: top-rejected feature per group</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
s = (rng.<span class="fn">random</span>(<span class="fn">len</span>(X)) &lt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
preds = clf.<span class="fn">predict</span>(X)
rejected = np.<span class="fn">where</span>(preds == <span class="num">1</span>)[<span class="num">0</span>]                   <span class="cm"># treat 1 = churn = "rejected"</span>

top_features_per_group = {<span class="num">0</span>: [], <span class="num">1</span>: []}
<span class="kw">for</span> idx <span class="kw">in</span> rejected[:<span class="num">30</span>]:
    coefs, _ = <span class="fn">lime_tabular</span>(clf.predict_proba, X[idx], X, n_samples=<span class="num">300</span>, seed=<span class="fn">int</span>(idx))
    top_idx = <span class="fn">int</span>(np.<span class="fn">argmax</span>(np.<span class="fn">abs</span>(coefs)))
    top_features_per_group[s[idx]].<span class="fn">append</span>(feats[top_idx])

<span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>]:
    <span class="kw">from</span> collections <span class="kw">import</span> Counter
    c = <span class="fn">Counter</span>(top_features_per_group[g])
    <span class="fn">print</span>(f<span class="str">'Group {g} most-cited rejection driver: {c.most_common(3)}'</span>)
</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) synthesises a binary protected attribute <code>s</code> via <code>rng.random() &lt; 0.5</code> and grabs the indices where <code>clf.predict(X) == 1</code> (treating churn=1 as the "rejected" decision). 2) loops over the first 30 rejected rows, calls <code>lime_tabular</code> per row, and records the feature with the largest absolute LIME coefficient into <code>top_features_per_group[s[idx]]</code>. 3) tallies the top-rejection drivers per group with <code>collections.Counter</code> and prints the three most frequent — an asymmetric ranking is the LIME signature of disparate-impact discrimination.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Anchors: LIME's Successor</h2>
<p class="l-text">Ribeiro, Singh &amp; Guestrin's follow-up (AAAI 2018) replaced LIME's linear surrogate with <em>anchors</em>: high-precision IF-THEN rules of the form "IF income &gt; 50k AND credit_score &gt; 700 THEN approve, with 95% precision in the local neighborhood". Anchors are easier to read for non-technical audiences and have a precise local-coverage interpretation.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">LIME</div><div class="card-body">Linear surrogate, signed coefficients, fast, unstable, no precision guarantee. Best for technical reviewers.</div></div>
<div class="calc-card"><div class="card-title">Anchors</div><div class="card-body">Rule-based, precision-guaranteed, slower (rule search), more interpretable to non-experts. Best for compliance reports and customer-facing reasons.</div></div>
<div class="calc-card"><div class="card-title">Counterfactuals (next lesson)</div><div class="card-body">"What minimal change to <code>x</code> would flip the prediction?" Most actionable for the affected person — they tell you what to <em>change</em>, not what mattered.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Summary &amp; Next</h2>
<p class="l-text">LIME is the workhorse of local explanation: simple recipe, any model, any data type, three knobs (n_samples, kernel_width, surrogate complexity). Its weaknesses — instability, no axiomatic foundation, off-manifold perturbations — are real but manageable with multi-seed averaging and a SHAP cross-check.</p>

<div class="calc-highlight"><strong>Key takeaways:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>LIME = perturb input, weight by proximity, fit a sparse linear surrogate. One template across tabular, text, and image (Ribeiro 2016).</li>
<li>Three knobs: <code>n_samples</code> (fidelity), <code>kernel_width</code> (locality), Lasso α (sparsity).</li>
<li>Famously unstable across seeds; quantify with coefficient of variation; mitigate with multi-seed averaging or switch to KernelSHAP.</li>
<li>Best for fast, individual-decision explanations and exploratory fairness auditing of flagged cases.</li>
<li>Anchors (Ribeiro 2018) replace coefficients with rules — better for non-technical audiences and compliance.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L6</strong> moves from "what mattered" to "what would have changed the answer" — counterfactual explanations from Wachter et al. 2017 and the DiCE library.</p>
</div>`,
tr: `<p class="l-text"><strong>LIME, SHAP'tan önce gelir ve hâlâ üretimde en çok kullanılan yerel açıklayıcıdır</strong> — teorik olarak daha sıkı olduğu için değil (öyle değil; SHAP aksiyomlarda kazanır), daha hızlı, daha esnek olduğu ve herhangi bir modelde, herhangi bir veri türünde çalıştığı için. Ribeiro, Singh &amp; Guestrin'in 2016 KDD makalesi <em>"Sana Neden Güvenmeliyim?": Herhangi Bir Sınıflandırıcının Tahminlerini Açıklama</em> artık on yılın en çok atıf alan ML makalelerinden biri. Fikir alarmlı şekilde basit: açıklamak istediğin tek bir noktanın etrafında, girdiyi pertürbe et, pertürbasyonları kara-kutu modelden geçir ve o yerel komşulukta küçük bir yorumlanabilir model (doğrusal regresyon, karar dalı) oturt. Yorumlanabilir model açıklamadır.</p>

<p class="l-text">Bu derste LIME'i sıfırdan üç ortamda inşa ediyoruz — tablo, metin ve görüntü — ve pertürbasyon stratejisinin tüm oyun olduğunu görüyoruz. Tablo için: öznitelikleri ayrıklaştır ve çevir. Metin için: rastgele kelimeler düşür. Görüntü için: rastgele süperpiksel düşür. Altındaki matematik aynı: yerel komşulukta sadakat kaybını minimize et, artı vekilin yorumlanabilir kalması için bir karmaşıklık cezası. Aynı tahmin üzerinde LIME ve SHAP'i baş başa karşılaştırıyoruz, nerede uyuştuklarını görüyoruz ve LIME'nin iyi bilinen kararsızlığına (Alvarez-Melis &amp; Jaakkola 2018) ve nasıl tespit edileceğine bakıyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div>
<ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)">
<li>Tablo verisi için öznitelik ayrıklaştırma ve ikili pertürbasyon maskeleri ile LIME uygula</li>
<li>Yerel sadakat / karmaşıklık değiş tokuşunu ifade et ve çekirdek genişliğini akıllıca seç</li>
<li>Aynı şablonla metin (kelime düşür) ve görüntü (süperpiksel düşür) için LIME inşa et</li>
<li>LIME kararsızlığını teşhis et: aynı noktada yeniden çalıştır ve çalışmalar arası varyansı ölç</li>
<li>Aynı tahminlerde LIME ve SHAP'i karşılaştır; ne zaman ve neden uyuşmadıklarını anla</li>
<li>LIME'i adillik denetimine uygula: insan incelemesi için bireysel işaretlenmiş vakaları açıkla</li>
</ul>
</div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. LIME Kaybı (Ribeiro 2016)</h2>
<p class="l-text">LIME tek bir hedefi minimize eder:</p>

<div class="katex-block">$$\\xi(x) = \\arg\\min_{g \\in G} \\;\\; L\\bigl(f, g, \\pi_x\\bigr) + \\Omega(g)$$</div>

<p class="l-text">Burada <code>f</code> kara-kutu modeldir, <code>g</code> bir <code>G</code> sınıfından (doğrusal modeller, seyrek karar ağaçları) yorumlanabilir vekildir, <code>π_x(z)</code>, pertürbe edilmiş <code>z</code> noktasının hedef <code>x</code>'e ne kadar yakın olduğunu ölçen yakınlık çekirdeğidir, <code>L</code> ağırlıklı bir sadakat kaybıdır ve <code>Ω(g)</code> karmaşıklığı cezalandırır (doğrusal için sıfır olmayan katsayı sayısı, ağaçlar için derinlik).</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Vekil sınıfı G</div><div class="card-body">Neredeyse her zaman Lasso'lu seyrek doğrusal regresyon. Ara sıra küçücük karar ağaçları; başka hiçbir şey tutmadı.</div></div>
<div class="calc-card"><div class="card-title">Çekirdek π_x</div><div class="card-body">Bir mesafe üzerinde üstel çekirdek: <code>exp(-d(x,z)² / σ²)</code>. <code>σ</code> seçimi açıklamanın gerçekten yerel mi (küçük σ) yoksa küresel-ish mi (büyük σ) olduğunu belirler.</div></div>
<div class="calc-card"><div class="card-title">Karmaşıklık Ω</div><div class="card-body">Doğrusal vekiller için katsayılarda L1 cezası (Lasso); ağaçlar için derinlik sınırı. Açıklamada küçük bir öznitelik kümesini zorlar — genellikle 5-10.</div></div>
</div>

<div class="calc-highlight"><strong>Yalnızca yerel garanti:</strong> LIME yalnızca örneklediği komşulukta sadıktır. Aynı model, karar yüzeyi eğri ise — ki neredeyse her zaman doğrusal olmayan modeller için öyledir — iki yakın noktada gözle görülür şekilde farklı LIME açıklamalarına sahip olabilir. Bu bir özelliktir, hata değildir, ama LIME'nin meşhur kararsızlığının kaynağıdır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Tablo LIME: Sıfırdan Uygulama</h2>
<p class="l-text">Tablo verisi için standart LIME tarifi (lime kütüphanesindeki LimeTabularExplainer): (1) her sayısal özniteliği çeyrekliklere ayrıklaştır; (2) <code>z'ᵢ = 1</code>'in "öznitelik <code>i</code>, <code>x</code>'in değerini alır", <code>z'ᵢ = 0</code>'ın "öznitelik <code>i</code>'yi marjinal eğitim dağılımından örnekle" anlamına geldiği bir ikili maske <code>z' ∈ {0,1}ⁿ</code> oluştur; (3) tam pertürbe edilmiş girdiler <code>z</code>'yi yeniden inşa et; (4) her <code>z</code>'de kara-kutuyu çalıştır; (5) ağırlıklar <code>π_x(z')</code> ile <code>(z', f(z))</code> üzerinde ağırlıklı Lasso oturt.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np, pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Lasso
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier

<span class="cm"># Black-box model on df_churn</span>
feats = df_churn.<span class="fn">select_dtypes</span>(<span class="str">'number'</span>).columns.<span class="fn">tolist</span>()[:<span class="num">8</span>]
X = df_churn[feats].<span class="fn">fillna</span>(<span class="num">0</span>).values
y = df_churn[<span class="str">'churned'</span>].values
clf = <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">120</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)

<span class="kw">def</span> <span class="fn">lime_tabular</span>(model_fn, x, X_train, n_samples=<span class="num">500</span>, kernel_width=<span class="num">0.75</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    n = <span class="fn">len</span>(x)
    <span class="cm"># Binary perturbation masks</span>
    masks = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, size=(n_samples, n))
    <span class="cm"># Reconstruct perturbed inputs: z[i]=x[i] if mask=1, else sampled</span>
    Z = np.<span class="fn">where</span>(masks==<span class="num">1</span>, x, X_train[rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="fn">len</span>(X_train), size=(n_samples, n)), np.<span class="fn">arange</span>(n)])
    <span class="cm"># Predict on perturbations</span>
    f_z = <span class="fn">model_fn</span>(Z)[:,<span class="num">1</span>]
    <span class="cm"># Weights via exp kernel on cosine-ish distance</span>
    d = np.<span class="fn">sqrt</span>(((<span class="num">1</span> - masks)**<span class="num">2</span>).<span class="fn">sum</span>(axis=<span class="num">1</span>)) / np.<span class="fn">sqrt</span>(n)
    w = np.<span class="fn">exp</span>(-(d**<span class="num">2</span>) / (kernel_width**<span class="num">2</span>))
    <span class="cm"># Weighted Lasso on the binary masks</span>
    lasso = <span class="fn">Lasso</span>(alpha=<span class="num">0.01</span>).<span class="fn">fit</span>(masks, f_z, sample_weight=w)
    <span class="kw">return</span> lasso.coef_, lasso.intercept_

x_target = X[<span class="num">0</span>]
coefs, intercept = <span class="fn">lime_tabular</span>(clf.predict_proba, x_target, X)
local_pred = intercept + coefs.<span class="fn">sum</span>() * <span class="num">0</span>   <span class="cm"># zero baseline since masks default to 1's</span>
<span class="fn">print</span>(f<span class="str">'Black-box prediction:    {clf.predict_proba(x_target.reshape(1,-1))[0,1]:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'LIME local intercept:    {intercept:.3f}'</span>)
<span class="fn">print</span>(f<span class="str">'Top features pushing UP / DOWN this prediction:'</span>)
<span class="kw">for</span> f, c <span class="kw">in</span> <span class="fn">sorted</span>(<span class="fn">zip</span>(feats, coefs), key=<span class="kw">lambda</span> t: -<span class="fn">abs</span>(t[<span class="num">1</span>]))[:<span class="num">6</span>]:
    arrow = <span class="str">'↑'</span> <span class="kw">if</span> c &gt; <span class="num">0</span> <span class="kw">else</span> <span class="str">'↓'</span>
    <span class="fn">print</span>(f<span class="str">'  {arrow} {f:&lt;25s} {c:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Kara-kutu olarak bir <code>RandomForestClassifier</code> eğitir ve <code>lime_tabular(model_fn, x, X_train, n_samples, kernel_width, seed)</code> tanımlanır; bu fonksiyon öznitelik indeksleri üzerinde ikili maskeler örnekler. 2) Her pertürbe satırı <code>np.where(masks==1, x, X_train[...])</code> ile yeniden inşa eder — maske 1 olduğunda <code>x</code>'in değeri, 0 olduğunda eğitim dağılımından çekilen değer kullanılır — ve <code>model_fn(Z)[:,1]</code> ile churn olasılıklarını alır. 3) Her pertürbasyonu Hamming mesafesi üzerinde üstel bir çekirdek ile ağırlıklandırır ve <code>(masks, f_z)</code> üzerinde ağırlıklı <code>Lasso(alpha=0.01)</code> oturtur; Lasso katsayıları LIME'nin yerel doğrusal vekilidir.</p>

<p class="l-text">Üç düğme LIME kalitesini belirler. (1) <code>n_samples</code> — çok az ise yerel oturum gürültülü olur; 500-5000 tipiktir. (2) <code>kernel_width</code> — çok küçük ise yalnızca tüm-1'ler maskesi ağırlık alır; çok büyük ise açıklama küresel olur. lime kütüphanesi <code>0.75 * sqrt(n_features)</code>'a varsayar. (3) Vekildeki öznitelik sayısı — Lasso'nun α'sı tarafından kontrol edilir; daha küçük α daha fazla özniteliği tutar.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Metin LIME: Kelime Düşürme Pertürbasyonları</h2>
<p class="l-text">Metin sınıflandırması için pertürbasyon: girdi cümlesinin tokenlerini al, bir alt kümeyi rastgele düşür, düşürülmüş cümlede sınıfı tahmin et. "Öznitelik" her tokendir; katsayı işareti, o tokeni kaldırmanın tahmin edilen sınıf olasılığını yükselttiği mi düşürdüğü mü söyler. Ünlü Ribeiro 2016 örneği, en iyi öznitelikleri "Posting" ve "Host" gibi başlıklar olan bir 20-newsgroups Ateizm vs. Hristiyanlık sınıflandırıcısıydı — e-posta meta verisinin dağılımını öğrendiğinin kanıtı, konunun değil.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># LIME for text — works on any text classifier</span>
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression, Lasso
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> make_pipeline
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Toy review classifier on df_reviews (assume column 'text', label 'positive')</span>
texts = df_reviews[<span class="str">'text'</span>].<span class="fn">astype</span>(<span class="fn">str</span>).<span class="fn">tolist</span>()[:<span class="num">200</span>]
labels = (df_reviews[<span class="str">'rating'</span>] &gt;= <span class="num">4</span>).<span class="fn">astype</span>(<span class="fn">int</span>).values[:<span class="num">200</span>] <span class="kw">if</span> <span class="str">'rating'</span> <span class="kw">in</span> df_reviews.columns <span class="kw">else</span> np.random.<span class="fn">randint</span>(<span class="num">0</span>,<span class="num">2</span>,<span class="num">200</span>)
pipe = <span class="fn">make_pipeline</span>(<span class="fn">TfidfVectorizer</span>(max_features=<span class="num">500</span>), <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>)).<span class="fn">fit</span>(texts, labels)

<span class="kw">def</span> <span class="fn">lime_text</span>(pipe, sentence, n_samples=<span class="num">400</span>, kernel_width=<span class="num">25</span>, seed=<span class="num">0</span>):
    rng = np.random.<span class="fn">default_rng</span>(seed)
    tokens = sentence.<span class="fn">split</span>()
    n = <span class="fn">len</span>(tokens)
    masks = rng.<span class="fn">integers</span>(<span class="num">0</span>, <span class="num">2</span>, size=(n_samples, n))
    perturbed = [<span class="str">' '</span>.<span class="fn">join</span>(t <span class="kw">for</span> t,m <span class="kw">in</span> <span class="fn">zip</span>(tokens, mask) <span class="kw">if</span> m) <span class="kw">for</span> mask <span class="kw">in</span> masks]
    f_z = pipe.<span class="fn">predict_proba</span>(perturbed)[:,<span class="num">1</span>]
    n_dropped = n - masks.<span class="fn">sum</span>(axis=<span class="num">1</span>)
    w = np.<span class="fn">exp</span>(-(n_dropped**<span class="num">2</span>) / (kernel_width**<span class="num">2</span>))
    lasso = <span class="fn">Lasso</span>(alpha=<span class="num">0.001</span>).<span class="fn">fit</span>(masks, f_z, sample_weight=w)
    <span class="kw">return</span> <span class="fn">list</span>(<span class="fn">zip</span>(tokens, lasso.coef_))

target = texts[<span class="num">0</span>]
contribs = <span class="fn">lime_text</span>(pipe, target)
<span class="fn">print</span>(f<span class="str">'Sentence: <span class="str">"{target[:80]}..."</span>'</span>)
<span class="fn">print</span>(<span class="str">'Top words pushing toward POSITIVE / NEGATIVE:'</span>)
<span class="kw">for</span> tok, c <span class="kw">in</span> <span class="fn">sorted</span>(contribs, key=<span class="kw">lambda</span> t: -<span class="fn">abs</span>(t[<span class="num">1</span>]))[:<span class="num">6</span>]:
    <span class="fn">print</span>(f<span class="str">'  {tok:&lt;15s} {c:+.3f}'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Vekil metin sınıflandırıcı olarak <code>make_pipeline</code> ile bir TF-IDF + <code>LogisticRegression</code> hattı kurar, sonra <code>lime_text(pipe, sentence, n_samples, kernel_width, seed)</code> tanımlanır ve cümleyi <code>sentence.split()</code> ile tokenlere ayırır. 2) Her ikili maske için <code>' '.join(...)</code> ile hayatta kalan tokenleri birleştirip pertürbe cümleyi oluşturur ve <code>pipe.predict_proba(perturbed)[:,1]</code> ile her kelime-düşürme varyantını skorlar. 3) Örnekleri düşürülen token sayısı üzerinde üstel bir çekirdekle ağırlıklandırır ve <code>(masks, f_z)</code> üzerinde ağırlıklı <code>Lasso(alpha=0.001)</code> oturtur; token başına Lasso katsayılarını orijinal tokenlerle zip'leyerek her kelimenin katkısı elde edilir.</p>

<p class="l-text">Kritik detay: pertürbasyon <em>doğal görünüşlü</em> metin üretmelidir, yoksa modelin gerçek girdileri değil bozuk girdileri nasıl ele aldığını açıklarsın. Kelime düşürme makul bir yaklaşımdır ama dilbilgisini bozar. Modern varyantlar (Anchors, Ribeiro 2018) bir dil modeliyle maskele-ve-doldur kullanır — veri manifolduna daha yakın ama daha yavaş.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Görüntü LIME: Süperpiksel Maskeleri</h2>
<p class="l-text">Görüntüler için pertürbasyon, <em>süperpiksellerin</em> düşürülmesidir — bir SLIC segmentasyonundan küçük bitişik bölgeler. Kara-kutu maskelenmiş görüntüde çalışır (düşürülen bölgeler ortalama renk veya sıfırla değiştirilir) ve vekilin katsayıları her sınıfa doğru hangi süperpikselin ittiğini söyler. Ribeiro 2016, kararı tamamen arka plandaki kar tarafından yönlendirilen bir husky-vs-kurt sınıflandırıcısı gösterdi — LIME'nin görünür kıldığı sahte korelasyonun ders kitabı vakası.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Adım 1 — segmentle</div><div class="card-body">SLIC (Achanta 2012), seçilen bir çözünürlükte kompakt süperpiksel verir. Görüntü başına ~100-300 süperpiksel tipiktir.</div></div>
<div class="calc-card"><div class="card-title">Adım 2 — pertürbe et</div><div class="card-body">Süperpiksellere üzerinde rastgele ikili maskeler; mask=0 bölgeyi ortalama renk veya gri ile değiştirir.</div></div>
<div class="calc-card"><div class="card-title">Adım 3 — oturt</div><div class="card-body">Aynı ağırlıklı Lasso, her "öznitelik" bir süperpiksel indeksi olur. Pozitif katsayıları yeşilde, negatifleri kırmızıda görselleştir.</div></div>
</div>

<p class="l-text">Görüntü LIME hesaplama açısından ağırdır — açıklama başına 1000-5000 ileri geçiş. Üretim CV modelleri için Grad-CAM (Selvaraju 2017) daha hızlı ve daha güvenilirdir; LIME'nin değeri türevlenebilir olmayan görüntü modelleri için veya modaliteler arasında tek bir arayüz istediğinde ortaya çıkar.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Kararsızlık Sorunu (Alvarez-Melis &amp; Jaakkola 2018)</h2>
<p class="l-text">Aynı tahminde LIME'yi farklı rastgele tohumlarla iki kez çalıştır ve gözle görülür şekilde farklı açıklamalar alabilirsin. Alvarez-Melis &amp; Jaakkola'nın NeurIPS 2018 makalesi bunu iki kararlılık metriğiyle resmileştirdi: <em>yerel Lipschitz</em> (küçük girdi değişikliği → küçük açıklama değişikliği) ve <em>kendine benzerlik</em> (aynı girdi + farklı tohum → benzer açıklama). LIME birçok gerçek model için ikisinde de başarısız olur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Re-run LIME 5 times with different seeds and measure variance</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
runs = []
<span class="kw">for</span> seed <span class="kw">in</span> <span class="fn">range</span>(<span class="num">5</span>):
    coefs, _ = <span class="fn">lime_tabular</span>(clf.predict_proba, x_target, X, n_samples=<span class="num">500</span>, seed=seed)
    runs.<span class="fn">append</span>(coefs)
runs = np.<span class="fn">array</span>(runs)
mean = runs.<span class="fn">mean</span>(axis=<span class="num">0</span>); std = runs.<span class="fn">std</span>(axis=<span class="num">0</span>)
<span class="fn">print</span>(<span class="str">'Per-feature LIME mean ± std across 5 seeds:'</span>)
<span class="kw">for</span> f, m, s <span class="kw">in</span> <span class="fn">zip</span>(feats, mean, std):
    <span class="fn">print</span>(f<span class="str">'  {f:&lt;25s} {m:+.3f} ± {s:.3f}    (CV={s/(abs(m)+1e-9):.2f})'</span>)
</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Aynı hedef satırda <code>lime_tabular(clf.predict_proba, x_target, X, n_samples=500, seed=seed)</code>'ı beş kez yeniden çalıştırır; her çağrıda farklı bir seed iç <code>np.random.default_rng</code>'yi besler. 2) Dönen katsayı vektörlerini <code>runs</code> dizisine yığar ve <code>runs.mean(axis=0)</code> ile <code>runs.std(axis=0)</code> ile öznitelik başına seedler arası ortalama ve standart sapmayı çıkarır. 3) Her özniteliği, ortalaması, standart sapması ve varyasyon katsayısı <code>std / (|mean| + 1e-9)</code> ile yazdırır — Alvarez-Melis &amp; Jaakkola'nın kendine-benzerlik tanısı tek sütunda.</p>

<p class="l-text">Tanı kuralı: en iyi öznitelikler için varyasyon katsayısı (std / |mean|) &gt; 0.3 ise, açıklama kararsızdır ve sıralamaya güvenmemelisin. Azaltmalar: <code>n_samples</code>'ı artır, birden fazla tohum kullan ve ortala veya SHAP'a geç (KernelSHAP de stokastiktir ama daha iyi davranır). Alvarez-Melis 2018 ayrıca kararlılığı açık bir hedef terim olarak eklemeyi önerir.</p>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. LIME vs. SHAP Baş Başa</h2>
<p class="l-text">Hem LIME hem de SHAP yerel özellik atfı yöntemleridir. Her ikisi de pertürbasyon tabanlı yaklaşım kullanır. SHAP aksiyomatik olarak temellendirilmiştir; LIME sezgiseldir. Peki ne zaman uyuşmazlar ve hangisine güvenmelisin?</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Uyuştuklarında</div><div class="card-body">Açıklanan noktanın etrafında neredeyse doğrusal modeller için, her ikisi de yerel doğrusal katsayılara yakınsar. Çok derin etkileşimleri olmayan iyi davranan tablo modellerinin çoğu: en iyi özniteliklerde &gt; %80 anlaşma.</div></div>
<div class="calc-card"><div class="card-title">Uyuşmadıklarında</div><div class="card-body">Güçlü doğrusal olmayan bölgeler, korelasyonlu öznitelikler veya nadir kombinasyonlar. SHAP'ın katsayıları tam olarak <code>f(x) - E[f(X)]</code>'e toplanır; LIME'nin toplanmaz. SHAP'ın simetri aksiyomu sağlanır; LIME'nin sağlanmaz.</div></div>
<div class="calc-card"><div class="card-title">Hız</div><div class="card-body">Tabloda 500 örnek ile LIME: ~50 model çağrısı. Aynı sadakatte KernelSHAP: ~2000 çağrı. Ağaçlarda TreeSHAP: pratikte bedava. Ağaç olmayan kara kutular için LIME ~5x daha hızlı.</div></div>
</div>

<div class="calc-highlight"><strong>Üretim kuralı:</strong> ağaç modeline sahipsen, TreeSHAP kullan — her eksende baskındır. Sinir ağları için DeepSHAP. Hızın titizlikten daha önemli olduğu keyfi kara kutular için (canlı UI açıklamaları), LIME. Denetimler ve düzenleyici raporlar için KernelSHAP.</div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. Adillik Denetimi için LIME</h2>
<p class="l-text">Adillik denetimlerinde LIME'nin rolü bireysel düzeydedir. Potansiyel olarak adil olmadığı işaretlenmiş her model kararını al (yüksek skor varyansı, eşiğe yakın, hassas demografide), her birinde LIME çalıştır ve bir insan inceleyici açıklamaları okusun. Olumsuz-sınıf reddedilmelerinde görünen özniteliklerin örüntüsü, L4'teki SHAP tabanlı nicel analizin niteliksel tamamlayıcısıdır.</p>

<p class="l-text">Yaygın bir keşif: A grubundan reddedilen başvurularda LIME tekrar tekrar "feature_X &gt; eşik"i vurgular, B grubundan reddedilenler ise çeşitli karışım vurgular. Bu asimetri — aynı öznitelik, aynı eşik, sistematik olarak bir gruba karşı kullanılan — tam olarak farklı etki davasının aradığı şeydir. <em>Apple Card vs. kadınlar</em> (2019) hiçbir toplu denetim çalıştırılmadan önce, bu tür bir post-hoc açıklama örüntüsüyle herkesin önünde teşhis edildi.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Audit pattern: top-rejected feature per group</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
rng = np.random.<span class="fn">default_rng</span>(<span class="num">0</span>)
s = (rng.<span class="fn">random</span>(<span class="fn">len</span>(X)) &lt; <span class="num">0.5</span>).<span class="fn">astype</span>(<span class="fn">int</span>)
preds = clf.<span class="fn">predict</span>(X)
rejected = np.<span class="fn">where</span>(preds == <span class="num">1</span>)[<span class="num">0</span>]                   <span class="cm"># treat 1 = churn = "rejected"</span>

top_features_per_group = {<span class="num">0</span>: [], <span class="num">1</span>: []}
<span class="kw">for</span> idx <span class="kw">in</span> rejected[:<span class="num">30</span>]:
    coefs, _ = <span class="fn">lime_tabular</span>(clf.predict_proba, X[idx], X, n_samples=<span class="num">300</span>, seed=<span class="fn">int</span>(idx))
    top_idx = <span class="fn">int</span>(np.<span class="fn">argmax</span>(np.<span class="fn">abs</span>(coefs)))
    top_features_per_group[s[idx]].<span class="fn">append</span>(feats[top_idx])

<span class="kw">for</span> g <span class="kw">in</span> [<span class="num">0</span>, <span class="num">1</span>]:
    <span class="kw">from</span> collections <span class="kw">import</span> Counter
    c = <span class="fn">Counter</span>(top_features_per_group[g])
    <span class="fn">print</span>(f<span class="str">'Group {g} most-cited rejection driver: {c.most_common(3)}'</span>)
</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) <code>rng.random() &lt; 0.5</code> ile ikili korunan öznitelik <code>s</code> üretir ve <code>clf.predict(X) == 1</code> olan indeksleri yakalar (churn=1'i "reddedildi" kararı olarak ele alır). 2) İlk 30 reddedilen satır üzerinde döner, her satıra <code>lime_tabular</code> çağırır ve en büyük mutlak LIME katsayısına sahip özniteliği <code>top_features_per_group[s[idx]]</code>'a yazar. 3) Grup başına en sık reddedilme nedenlerini <code>collections.Counter</code> ile sayar ve en yaygın üç tanesini yazdırır — asimetrik bir sıralama, LIME'nin farklı-etki ayrımcılığı imzasıdır.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. Anchors: LIME'nin Halefi</h2>
<p class="l-text">Ribeiro, Singh &amp; Guestrin'in takip çalışması (AAAI 2018) LIME'nin doğrusal vekilini <em>çapalarla</em> değiştirdi: "EĞER gelir &gt; 50k VE kredi_skoru &gt; 700 İSE onayla, yerel komşulukta %95 kesinlikle" formundaki yüksek-kesinlikli EĞER-İSE kuralları. Çapalar teknik olmayan kitle için okunması daha kolaydır ve kesin bir yerel-kapsam yorumu vardır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">LIME</div><div class="card-body">Doğrusal vekil, işaretli katsayılar, hızlı, kararsız, kesinlik garantisi yok. Teknik inceleyiciler için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Anchors</div><div class="card-body">Kural tabanlı, kesinlik garantili, daha yavaş (kural arama), uzman olmayanlar için daha yorumlanabilir. Uyum raporları ve müşteriye dönük gerekçeler için en iyisi.</div></div>
<div class="calc-card"><div class="card-title">Karşı-olgular (sonraki ders)</div><div class="card-body">"<code>x</code>'e hangi minimum değişiklik tahmini çevirirdi?" Etkilenen kişi için en eyleme dönük olanı — neyi <em>değiştireceğini</em> söyler, neyin önemli olduğunu değil.</div></div>
</div>
</div>

<div class="lesson-block" id="section-9">
<h2 class="lesson-title">9. Özet ve Sonraki</h2>
<p class="l-text">LIME yerel açıklamanın iş atıdır: basit tarif, herhangi bir model, herhangi bir veri türü, üç düğme (n_samples, kernel_width, vekil karmaşıklığı). Zayıflıkları — kararsızlık, aksiyomatik temel yokluğu, manifold dışı pertürbasyonlar — gerçektir ama çoklu-tohum ortalaması ve SHAP karşılaştırmasıyla yönetilebilirdir.</p>

<div class="calc-highlight"><strong>Anahtar çıkarımlar:</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.2rem;line-height:1.65">
<li>LIME = girdiyi pertürbe et, yakınlığa göre ağırlıklandır, seyrek doğrusal vekil oturt. Tablo, metin ve görüntüde tek şablon (Ribeiro 2016).</li>
<li>Üç düğme: <code>n_samples</code> (sadakat), <code>kernel_width</code> (yerellik), Lasso α (seyreklik).</li>
<li>Tohumlar arası ünlü kararsız; varyasyon katsayısıyla nicelleştir; çoklu-tohum ortalaması ile azalt veya KernelSHAP'a geç.</li>
<li>Hızlı, bireysel-karar açıklamaları ve işaretlenmiş vakaların keşifsel adillik denetimi için en iyisi.</li>
<li>Anchors (Ribeiro 2018) katsayıları kurallarla değiştirir — teknik olmayan kitle ve uyum için daha iyi.</li>
</ul>
</div>

<p class="l-text"><strong>fairness-L6</strong>, "ne önemliydi"den "cevabı ne değiştirebilirdi"e geçer — Wachter ve ark. 2017 ve DiCE kütüphanesinden karşı-olgu açıklamaları.</p>
</div>`
};
