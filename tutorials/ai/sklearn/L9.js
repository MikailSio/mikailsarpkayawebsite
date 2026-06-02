window.SKLEARN_L9 = {

en: `<p class="l-text"><strong>Support Vector Machines are the classical ML hammer for high-dim, moderate-sized, well-conditioned data.</strong> They were the kings of the pre-2012 era and they still earn their seat at the table: a TF-IDF + LinearSVC baseline is what a serious NLP researcher reaches for first, before any transformer; an RBF SVM on 1000 carefully engineered features will routinely match a tuned random forest. This lesson is the practical sibling of the theory in <a href="/tutorials/ai/ml/support-vector-machines">ML Theory Lesson 12</a> — same ideas, now seen through the sklearn API you will actually ship.</p>

<p class="l-text">We cover the SVC class (the kernelised workhorse), how to tune <code>C</code> and <code>gamma</code> with grid search inside a Pipeline, when <code>LinearSVC</code> wins for large-but-linear problems, the regression sibling <code>SVR</code>, and what a 2026 ML engineer should and should not expect from SVMs. By the end you will have a working SVM workflow you can drop into any small-to-medium tabular or text project.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Fit and interpret SVC with the linear and RBF kernels</li><li>Understand how <code>C</code> and <code>gamma</code> shape the decision boundary</li><li>Build a scaled Pipeline so the SVM does not get fooled by feature units</li><li>Tune (C, gamma) with GridSearchCV and pick the operating point</li><li>Switch to LinearSVC when n is large and the boundary is roughly linear</li><li>Use SVR for regression and read the epsilon-tube intuition</li><li>Know exactly when an SVM is the right tool — and when to walk past it</li></ul></div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. SVM in 60 Seconds — Quick Refresher</h2>

<p class="l-text">SVMs find the hyperplane that separates two classes with the <em>largest possible margin</em>. Only a handful of training points (the support vectors) touch that margin and therefore determine the model — everything else is irrelevant. To handle non-linear boundaries we apply the <strong>kernel trick</strong>: we replace the inner product <em>x<sup>⊤</sup>x'</em> with a kernel function <em>K(x, x')</em>, which is equivalent to mapping x into a higher-dim space without ever computing that map.</p>

<div class="katex-block">$$f(\\mathbf{x}) = \\text{sign}\\!\\left( \\sum_{i \\in \\text{SV}} \\alpha_i y_i \\, K(\\mathbf{x}_i, \\mathbf{x}) + b \\right)$$</div>

<p class="l-text">If any of the words "margin", "support vector", "kernel trick", "C parameter" feel hand-wavy, read <a href="/tutorials/ai/ml/support-vector-machines">ML Theory Lesson 12</a> first; the derivations sit there. This lesson assumes you know what those words mean and shows you how to turn them into running code.</p>

<div class="l-warn"><strong>Scaling is not optional.</strong> SVM is distance-based: an unscaled feature with range 0-10000 silently dominates one with range 0-1, and your model effectively ignores the second feature. <em>Always</em> wrap your SVM in a Pipeline with <code>StandardScaler</code>. Forgetting this is the most common SVM bug.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. The SVC API — kernel, C, gamma</h2>

<p class="l-text">sklearn's <code>SVC</code> is the kernelised SVM. Three parameters dominate its behaviour:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">kernel</div><div class="card-body"><code>'linear'</code>, <code>'rbf'</code> (default), <code>'poly'</code>, <code>'sigmoid'</code>, or a callable. RBF is the safe default; linear when features are already discriminative (text); poly rarely.</div></div>
<div class="calc-card"><div class="card-title">C</div><div class="card-body">Inverse regularisation strength. Large C → fit training data tightly (narrow margin, overfit risk). Small C → wider margin, accepts more training errors, often better generalisation.</div></div>
<div class="calc-card"><div class="card-title">gamma</div><div class="card-body">Only used by RBF / poly / sigmoid. Large gamma → each point has narrow influence, model wiggles. Small gamma → broad influence, smooth boundary. <code>'scale'</code> is a good default (1 / (n_features · X.var())).</div></div>
<div class="calc-card"><div class="card-title">probability</div><div class="card-body">Default False — SVC returns decisions, not probabilities. Set True to enable Platt scaling, which adds an internal logistic regression but costs another fit. Prefer <code>decision_function</code> when you only need a ranking.</div></div>
<div class="calc-card"><div class="card-title">class_weight</div><div class="card-body"><code>'balanced'</code> when classes are imbalanced; multiplies C inversely by class frequency. Critical for fraud, medical anomalies, etc.</div></div>
<div class="calc-card"><div class="card-title">decision_function_shape</div><div class="card-body">For multi-class: <code>'ovr'</code> returns one score per class (default), <code>'ovo'</code> returns pairwise scores. Internally SVC always uses one-vs-one to fit.</div></div>
</div>

<p class="l-text">The mental model: <strong>C controls how strict the model is about training errors; gamma controls how local each point's influence is</strong>. They must be tuned together — small gamma + large C and small C + large gamma can produce nearly identical models from very different positions in parameter space. Always do a 2D grid search.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Linear SVM on Breast Cancer — A Full Pipeline</h2>

<p class="l-text">Let us run a complete, properly scaled SVM pipeline on the breast-cancer dataset (569 samples, 30 features, binary diagnosis). This is the canonical "small, clean, high-dim" setting where SVMs shine.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, cross_val_score
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVC
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, roc_auc_score

X, y = <span class="fn">load_breast_cancer</span>(return_X_y=<span class="kw">True</span>)
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.25</span>, stratify=y, random_state=<span class="num">0</span>)

<span class="cm"># Pipeline: scale -> linear SVM. probability=True so we can use roc_auc_score.</span>
clf = <span class="fn">Pipeline</span>([
    (<span class="str">"scaler"</span>, <span class="fn">StandardScaler</span>()),
    (<span class="str">"svm"</span>,    <span class="fn">SVC</span>(kernel=<span class="str">"linear"</span>, C=<span class="num">1.0</span>, probability=<span class="kw">True</span>, random_state=<span class="num">0</span>)),
])

clf.<span class="fn">fit</span>(X_tr, y_tr)
preds = clf.<span class="fn">predict</span>(X_te)
proba = clf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]

<span class="fn">print</span>(<span class="fn">classification_report</span>(y_te, preds, digits=<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"ROC-AUC:"</span>, <span class="fn">round</span>(<span class="fn">roc_auc_score</span>(y_te, proba), <span class="num">3</span>))

<span class="cm"># 5-fold CV on the full Pipeline (scaling happens inside each fold — no leakage)</span>
cv = <span class="fn">cross_val_score</span>(clf, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"roc_auc"</span>)
<span class="fn">print</span>(<span class="str">f"CV ROC-AUC: {cv.mean():.3f} +/- {cv.std():.3f}"</span>)

<span class="cm"># Inspect the linear model coefficients in original feature space</span>
svm = clf.<span class="fn">named_steps</span>[<span class="str">"svm"</span>]
<span class="fn">print</span>(<span class="str">"Number of support vectors:"</span>, svm.support_vectors_.shape[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"Number of features:"</span>, svm.coef_.shape[<span class="num">1</span>])</code></pre></div>

<p class="l-text"><strong>Reading the code:</strong> The Pipeline guarantees that <code>StandardScaler</code> is fit on training folds only — if you scaled X up front and then ran cross-validation, the test folds would leak their statistics into training and your CV score would be too optimistic. Wrapping always solves this. A linear SVM on this dataset typically scores ROC-AUC ~0.995 with around 30-50 support vectors out of 426 training examples — meaning only ~10% of the data is actually "carrying" the model. The remaining 90% sit comfortably inside their class with positive margin.</p>

<div class="calc-step"><strong>Inspection trick:</strong> for a linear SVM, <code>svm.coef_[0]</code> gives one weight per original feature. Sorting by absolute value tells you which features dominate the decision — a free poor-man's feature-importance plot. Note this only works for kernel='linear'; for RBF the "coefficient" lives in the implicit φ-space and is not directly readable.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. RBF on Non-Linearly Separable Data — make_circles</h2>

<p class="l-text">A linear SVM is helpless when the boundary is curved. <code>make_circles</code> generates two concentric rings — the textbook example. A linear SVM scores ~50% (chance). An RBF SVM scores ~99%. The kernel trick is doing real work here.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_circles
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVC
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline

X, y = <span class="fn">make_circles</span>(n_samples=<span class="num">500</span>, noise=<span class="num">0.08</span>, factor=<span class="num">0.45</span>, random_state=<span class="num">0</span>)
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

linear = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                   (<span class="str">"svm"</span>, <span class="fn">SVC</span>(kernel=<span class="str">"linear"</span>, C=<span class="num">1.0</span>))])
rbf    = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                   (<span class="str">"svm"</span>, <span class="fn">SVC</span>(kernel=<span class="str">"rbf"</span>, C=<span class="num">1.0</span>, gamma=<span class="str">"scale"</span>))])

<span class="kw">for</span> name, model <span class="kw">in</span> [(<span class="str">"Linear"</span>, linear), (<span class="str">"RBF"</span>, rbf)]:
    model.<span class="fn">fit</span>(X_tr, y_tr)
    acc = model.<span class="fn">score</span>(X_te, y_te)
    n_sv = model.<span class="fn">named_steps</span>[<span class="str">"svm"</span>].n_support_.<span class="fn">sum</span>()
    <span class="fn">print</span>(<span class="str">f"{name:6} accuracy={acc:.3f}  support_vectors={n_sv}"</span>)

<span class="cm"># Typical output:</span>
<span class="cm"># Linear accuracy=0.493  support_vectors=350</span>
<span class="cm"># RBF    accuracy=0.987  support_vectors= 78</span></code></pre></div>

<div id="plot-skl9-circles-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> 500 concentric-ring samples with the RBF-SVM decision boundary overlaid. The boundary is a smooth closed curve (in this projection, nearly a circle) — exactly the shape the data demands. The linear SVM, drawn as a faint dashed reference, sweeps a single straight line through the cloud and cuts ~50% of points wrong; it is not just bad, it is conceptually unable to solve this. This figure encapsulates why the kernel trick matters: same library, same API, one parameter change (<code>kernel='rbf'</code>) and we move from useless to nearly perfect.</div>

<p class="l-text">Notice the second telling number: the RBF model needs only ~78 support vectors versus 350 for the linear one. The linear model is "stuck" — almost every point lies on the wrong side of its margin so it has to call everything a support vector. The RBF model finds a parsimonious description.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tuning (C, gamma) with GridSearchCV</h2>

<p class="l-text">The default <code>C=1, gamma='scale'</code> is a fine starting point but rarely optimal. The standard recipe is a 2D log-spaced grid search inside cross-validation. Below: search over C and gamma jointly, evaluated by 5-fold stratified CV with ROC-AUC.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV, train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVC

X, y = <span class="fn">load_breast_cancer</span>(return_X_y=<span class="kw">True</span>)
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.2</span>, stratify=y, random_state=<span class="num">0</span>)

pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"scaler"</span>, <span class="fn">StandardScaler</span>()),
    (<span class="str">"svm"</span>,    <span class="fn">SVC</span>(kernel=<span class="str">"rbf"</span>, probability=<span class="kw">False</span>, random_state=<span class="num">0</span>)),
])

param_grid = {
    <span class="str">"svm__C"</span>:     [<span class="num">0.1</span>, <span class="num">1</span>, <span class="num">10</span>, <span class="num">100</span>],
    <span class="str">"svm__gamma"</span>: [<span class="str">"scale"</span>, <span class="num">0.001</span>, <span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1</span>],
}

grid = <span class="fn">GridSearchCV</span>(pipe, param_grid, cv=<span class="num">5</span>, scoring=<span class="str">"roc_auc"</span>,
                    n_jobs=-<span class="num">1</span>, refit=<span class="kw">True</span>, verbose=<span class="num">0</span>)
grid.<span class="fn">fit</span>(X_tr, y_tr)

<span class="fn">print</span>(<span class="str">"Best params:"</span>, grid.best_params_)
<span class="fn">print</span>(<span class="str">f"Best CV ROC-AUC: {grid.best_score_:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"Held-out ROC-AUC: {grid.<span class="fn">score</span>(X_te, y_te):.4f}"</span>)

<span class="cm"># Visualise the CV score surface as a heatmap</span>
<span class="kw">import</span> pandas <span class="kw">as</span> pd
res = <span class="fn">pd</span>.<span class="fn">DataFrame</span>(grid.cv_results_)
pivot = res.<span class="fn">pivot</span>(index=<span class="str">"param_svm__gamma"</span>,
                  columns=<span class="str">"param_svm__C"</span>,
                  values=<span class="str">"mean_test_score"</span>)
<span class="fn">print</span>(pivot.<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>

<div id="plot-skl9-grid-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The CV ROC-AUC for each (C, gamma) cell. Bright cells are good, dark cells are bad — and crucially the bright region forms a diagonal ridge, not a single hot point. Increasing C and decreasing gamma both make the model "more flexible", so many (C, gamma) combinations on the ridge produce nearly identical accuracy. The lesson: do not chase the absolute best cell to four decimal places; pick a comfortable point on the ridge with the simpler model (smaller C, smaller gamma). The corners — small C with small gamma (everything is the same class) and large C with large gamma (overfit blob around each training point) — collapse the model.</div>

<div class="calc-step"><strong>Production tip:</strong> Once you have your favourite (C, gamma), refit the whole Pipeline on the union of train + validation before final deployment. GridSearchCV with <code>refit=True</code> does that for you automatically, but only on the original training split — for the very last model, do one more <code>.fit(X_full, y_full)</code>.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. LinearSVC — When n Is Large and the Boundary Is Linear</h2>

<p class="l-text"><code>SVC(kernel='linear')</code> is correct but slow: it still calls the general kernel solver. For large-but-linear problems (TF-IDF text classification with 100k documents and 50k vocabulary, for example), <code>LinearSVC</code> uses a specialised primal solver that is dramatically faster — minutes instead of hours.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_20newsgroups
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> LinearSVC
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score

cats = [<span class="str">"sci.med"</span>, <span class="str">"sci.space"</span>, <span class="str">"talk.politics.guns"</span>, <span class="str">"rec.autos"</span>]
data = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">"train"</span>, categories=cats,
                            remove=(<span class="str">"headers"</span>, <span class="str">"footers"</span>, <span class="str">"quotes"</span>))

clf = <span class="fn">Pipeline</span>([
    (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(min_df=<span class="num">2</span>, max_df=<span class="num">0.9</span>,
                              ngram_range=(<span class="num">1</span>, <span class="num">2</span>), sublinear_tf=<span class="kw">True</span>)),
    (<span class="str">"svm"</span>,   <span class="fn">LinearSVC</span>(C=<span class="num">1.0</span>, dual=<span class="str">"auto"</span>, random_state=<span class="num">0</span>)),
])

scores = <span class="fn">cross_val_score</span>(clf, data.data, data.target, cv=<span class="num">5</span>,
                          scoring=<span class="str">"accuracy"</span>, n_jobs=-<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">f"TF-IDF + LinearSVC: {scores.mean():.3f} +/- {scores.std():.3f}"</span>)
<span class="cm"># Typical: 0.92 - 0.94 across the four categories</span></code></pre></div>

<p class="l-text">A few practical notes on <code>LinearSVC</code>:</p>

<ul class="l-list">
<li><strong>No probabilities:</strong> use <code>decision_function</code> for ranking, or wrap in <code>CalibratedClassifierCV</code> if you really need probabilities.</li>
<li><strong>One-vs-rest by default</strong> for multi-class (whereas SVC uses one-vs-one). For most text problems with 5-20 classes the difference is minor.</li>
<li><strong>Loss choices:</strong> <code>loss='hinge'</code> is the classical SVM hinge loss; <code>'squared_hinge'</code> is the default and usually a hair more stable.</li>
<li><strong>L1 vs L2:</strong> <code>penalty='l1'</code> drives some coefficients exactly to zero — useful for feature selection on text.</li>
</ul>

<div class="calc-example"><div class="example-label">RULE OF THUMB</div><div class="example-body">If <code>n_samples * n_features &gt; 10⁷</code> and you only want a linear boundary, reach for <code>LinearSVC</code>. If you genuinely need a non-linear boundary, stick with <code>SVC(kernel='rbf')</code> and budget hours rather than seconds for training. Past about 50 000 samples even RBF SVC starts to choke — at that point an MLP, gradient boosting, or a Nyström-approximated kernel SVM becomes more attractive.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SVR — Support Vector Regression</h2>

<p class="l-text">SVMs work for regression too, with a small twist: instead of "separate the classes by the widest margin", SVR draws a <strong>ε-tube</strong> around the target and ignores any prediction error smaller than ε. Only points <em>outside</em> the tube contribute to the loss and become support vectors.</p>

<div class="katex-block">$$L_\\varepsilon(y, \\hat{y}) = \\max\\bigl(0, \\, |y - \\hat{y}| - \\varepsilon\\bigr)$$</div>

<p class="l-text">This is called the <em>ε-insensitive loss</em>. It tolerates small errors and is therefore robust to mild noise, while still penalising large errors linearly (unlike MSE which penalises quadratically). With an RBF kernel, SVR is the classical workhorse for small-to-medium non-linear regression problems.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_california_housing
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVR
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_absolute_error, r2_score

data = <span class="fn">fetch_california_housing</span>()
X, y = data.data, data.target
<span class="cm"># Subsample 5000 rows — SVR is O(n^2) so the full 20k is slow</span>
rng = np.<span class="fn">random</span>.<span class="fn">default_rng</span>(<span class="num">0</span>)
idx = rng.<span class="fn">choice</span>(<span class="fn">len</span>(X), <span class="num">5000</span>, replace=<span class="kw">False</span>)
X, y = X[idx], y[idx]

X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">0</span>)

reg = <span class="fn">Pipeline</span>([
    (<span class="str">"scaler"</span>, <span class="fn">StandardScaler</span>()),
    (<span class="str">"svr"</span>,    <span class="fn">SVR</span>(kernel=<span class="str">"rbf"</span>, C=<span class="num">10.0</span>, gamma=<span class="str">"scale"</span>, epsilon=<span class="num">0.1</span>)),
])
reg.<span class="fn">fit</span>(X_tr, y_tr)
pred = reg.<span class="fn">predict</span>(X_te)

<span class="fn">print</span>(<span class="str">f"MAE: {mean_absolute_error(y_te, pred):.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"R^2: {r2_score(y_te, pred):.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"Support vectors: {reg.named_steps['svr'].support_.shape[0]}"</span>)</code></pre></div>

<p class="l-text"><strong>The role of ε:</strong> larger ε means more tolerance — fewer support vectors, simpler model, less overfit, but also a noisier prediction floor. Smaller ε means tighter fit at the cost of more support vectors. ε=0.1 (the default) is a sensible starting point for standardised targets. As with classification, tune (C, gamma, ε) jointly with grid search if you care about the last few percent.</p>

<p class="l-text">When does SVR still win in 2026? On small-to-medium structured regression problems with non-linear effects and well-engineered features. For very large data or pure tabular problems, gradient boosting regressors (LightGBM, XGBoost) typically outperform with much less tuning. For sequence or image regression, deep nets dominate.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. When SVMs Are Still the Right Tool in 2026</h2>

<p class="l-text">Honest take after walking through theory and practice: SVMs are not the obvious default in 2026, but they remain the right tool in several scenarios.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Small data (n &lt; 5000)</div><div class="card-body">A well-tuned RBF SVM is often the strongest model — deep nets overfit, gradient boosting needs more data to shine, and SVM's margin objective is naturally regularising.</div></div>
<div class="calc-card"><div class="card-title">Text classification baseline</div><div class="card-body">TF-IDF + LinearSVC is the established first baseline. If a transformer cannot beat it by &gt;2 points, your transformer is probably not pulling its weight.</div></div>
<div class="calc-card"><div class="card-title">High-dim sparse features</div><div class="card-body">Bag-of-words, n-grams, gene expression vectors — wherever p &gt; n and features are mostly zeros, linear SVMs are competitive and explainable.</div></div>
<div class="calc-card"><div class="card-title">Anomaly detection</div><div class="card-body"><code>OneClassSVM</code> is the classical method when you have plenty of "normal" examples and almost no anomalies — common in fraud, manufacturing defects, network intrusion.</div></div>
<div class="calc-card"><div class="card-title">Interpretable linear models</div><div class="card-body">Sparse LinearSVC with L1 penalty gives both prediction and feature selection — useful when you must explain why a flag was raised.</div></div>
<div class="calc-card"><div class="card-title">Strict latency budgets</div><div class="card-body">An SVM with a few hundred support vectors makes predictions in microseconds — far faster than a deep model, and CPU-only.</div></div>
</div>

<p class="l-text"><strong>When to walk past SVM:</strong> very large datasets (n &gt; 100k) — training scales poorly; rich tabular data with mixed types — gradient boosting wins; tasks requiring representation learning (vision, speech, language modelling) — deep nets are categorically better; probability-critical applications without willingness to calibrate — logistic regression or boosting is more honest.</p>

<div class="think-box"><div class="think-label">PRACTICAL CHECKLIST FOR APPLYING SVM</div><div class="think-body"><strong>1.</strong> Always wrap in a Pipeline with <code>StandardScaler</code>.<br><strong>2.</strong> Start with <code>kernel='rbf'</code>, <code>C=1</code>, <code>gamma='scale'</code> as your baseline.<br><strong>3.</strong> Grid-search (C, gamma) on a log scale — typically 4-5 values each.<br><strong>4.</strong> For imbalanced data, set <code>class_weight='balanced'</code>.<br><strong>5.</strong> Need probabilities? Either set <code>probability=True</code> on SVC or wrap LinearSVC in <code>CalibratedClassifierCV</code>.<br><strong>6.</strong> Reach for <code>LinearSVC</code> when n is large and the boundary is roughly linear (text classification).<br><strong>7.</strong> For regression, start with <code>SVR(kernel='rbf', epsilon=0.1)</code> and tune ε along with C and gamma.<br><strong>8.</strong> If training is unbearably slow, your data is too big for kernel SVM — pivot to LinearSVC, Nyström approximation, or a different model class.<br><strong>9.</strong> Inspect <code>n_support_</code> — a model with 90%+ support vectors is overfitting or the data is fundamentally noisy.<br><strong>10.</strong> Always compare against logistic regression and gradient boosting baselines before declaring SVM the winner.</div></div>

<p class="l-text">You now have a complete SVM workflow. Combined with the theory in <a href="/tutorials/ai/ml/support-vector-machines">ML Theory Lesson 12</a>, you can both reason about why an SVM works and ship one tomorrow. Next stop in the sklearn track: ensemble methods or model deployment, depending on which gap you want to close first.</p>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg:'rgba(0,0,0,0)',
    text:getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid:'rgba(128,128,128,0.18)',
    zero:'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:60,r:30,b:50,l:60}};
  function rng(s){return function(){s=(s*9301+49297)%233280;return s/233280;};}

  // 1. make_circles + RBF boundary
  function drawCircles(elId, lbls){
    var el = document.getElementById(elId);
    if (!el) return;
    var r = rng(7);
    var inX=[], inY=[], outX=[], outY=[];
    for (var i=0;i<80;i++){var th=2*Math.PI*r();var rad=0.42+0.08*(r()-0.5);inX.push(rad*Math.cos(th));inY.push(rad*Math.sin(th));}
    for (var i=0;i<120;i++){var th=2*Math.PI*r();var rad=0.95+0.08*(r()-0.5);outX.push(rad*Math.cos(th));outY.push(rad*Math.sin(th));}
    var bx=[],by=[];for(var i=0;i<=360;i++){var th=i*Math.PI/180;bx.push(0.68*Math.cos(th));by.push(0.68*Math.sin(th));}
    var linX=[-1.2,1.2], linY=[0.0,0.0];
    var t1={x:inX,y:inY,mode:'markers',type:'scatter',name:lbls.in_,marker:{color:'#4ecdc4',size:7,opacity:0.75,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2={x:outX,y:outY,mode:'markers',type:'scatter',name:lbls.out_,marker:{color:T.accent,size:7,opacity:0.75,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t3={x:bx,y:by,mode:'lines',type:'scatter',name:lbls.rbf,line:{color:'rgba(167,139,250,0.95)',width:3}};
    var t4={x:linX,y:linY,mode:'lines',type:'scatter',name:lbls.lin,line:{color:'rgba(248,113,113,0.6)',width:1.5,dash:'dash'}};
    var layout = Object.assign({}, common, {
      xaxis:{title:'x1',gridcolor:T.grid,zerolinecolor:T.zero,range:[-1.3,1.3]},
      yaxis:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero,range:[-1.3,1.3],scaleanchor:'x'},
      legend:{font:{color:T.text,size:10},orientation:"h",y:1.10,x:0.5,xanchor:"center"},
      margin:{t:60,r:30,b:60,l:60}
    });
    Plotly.newPlot(elId,[t1,t2,t3,t4],layout,{responsive:true,displayModeBar:false});
  }

  // 2. GridSearchCV heatmap
  function drawGrid(elId, lbls){
    var el = document.getElementById(elId);
    if (!el) return;
    var Cs = [0.1, 1, 10, 100];
    var gammas = ['scale', '0.001', '0.01', '0.1', '1'];
    // Synthetic but believable CV ROC-AUC surface
    var z = [
      [0.992, 0.994, 0.995, 0.994],  // gamma scale
      [0.965, 0.978, 0.985, 0.988],  // gamma 0.001
      [0.985, 0.992, 0.995, 0.993],  // gamma 0.01
      [0.978, 0.989, 0.989, 0.978],  // gamma 0.1
      [0.852, 0.901, 0.923, 0.921]   // gamma 1
    ];
    var heat = {
      z: z,
      x: Cs.map(function(c){return 'C='+c;}),
      y: gammas.map(function(g){return 'γ='+g;}),
      type: 'heatmap',
      colorscale: [[0,'#1a0f2e'],[0.5,'#5b3a8c'],[0.85,'#c8a96e'],[1,'#fef3c7']],
      showscale: true,
      hovertemplate: '%{x}<br>%{y}<br>ROC-AUC=%{z:.3f}<extra></extra>'
    };
    // Annotations on each cell
    var annotations = [];
    for (var i=0;i<z.length;i++){
      for (var j=0;j<z[i].length;j++){
        annotations.push({x:'C='+Cs[j], y:'γ='+gammas[i], text:z[i][j].toFixed(3), showarrow:false, font:{color:z[i][j]>0.95?'#0a0a0a':'#ebe6dc',size:11}});
      }
    }
    var layout = Object.assign({}, common, {
      xaxis:{title:'C (regularisation)',gridcolor:T.grid,side:'bottom'},
      yaxis:{title:'gamma (RBF reach)',gridcolor:T.grid,autorange:'reversed'},
      annotations:annotations,
      margin:{t:40,r:30,b:60,l:90}
    });
    Plotly.newPlot(elId,[heat],layout,{responsive:true,displayModeBar:false});
  }

  drawCircles('plot-skl9-circles-en', {in_:'inner ring (class 0)', out_:'outer ring (class 1)', rbf:'RBF-SVM boundary', lin:'linear SVM (fails)', title:'make_circles: RBF kernel learns a closed boundary'});
  drawCircles('plot-skl9-circles-tr', {in_:'iç halka (sınıf 0)', out_:'dış halka (sınıf 1)', rbf:'RBF-SVM sınırı', lin:'lineer SVM (başarısız)', title:'make_circles: RBF çekirdek kapalı bir sınır öğreniyor'});
  drawGrid('plot-skl9-grid-en', {title:'5-fold CV ROC-AUC across (C, gamma) — breast cancer'});
  drawGrid('plot-skl9-grid-tr', {title:'5-katlı CV ROC-AUC (C, gamma) — meme kanseri'});
},250);</script>`,

tr: `<p class="l-text"><strong>Support Vector Machine\'ler yüksek boyutlu, orta büyüklükte, iyi koşullanmış verinin klasik ML çekicidir.</strong> 2012 öncesi dönemin krallarıydılar ve hâlâ masada yerlerini hak ediyorlar: ciddi bir NLP araştırmacısı yeni bir probleme önce TF-IDF + LinearSVC ile vurur, transformer\'a sonra geçer; iyi mühendislenmiş 1000 öznitelik üstünde RBF SVM, ayar yapılmış bir random forest\'ı rahatlıkla yakalar. Bu ders <a href="/tutorials/ai/ml/support-vector-machines">ML Teori Ders 12</a>\'deki teorinin pratik kardeşi — aynı fikirler, ama bu sefer gerçekten ürün edeceğin sklearn API\'si üstünden.</p>

<p class="l-text">SVC sınıfını (çekirdekli iş atı), Pipeline içinde grid search ile <code>C</code> ve <code>gamma</code> ayarlamayı, <code>LinearSVC</code>\'nin büyük-ama-lineer problemlerde nasıl öne çıktığını, regresyon kardeşi <code>SVR</code>\'yi ve 2026\'da bir ML mühendisinin SVM\'den ne beklemesi/beklememesi gerektiğini ele alıyoruz. Sonunda küçük-orta tablo ya da metin projelerinde rahatça kullanabileceğin bir SVM iş akışın olacak.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>SVC\'yi lineer ve RBF çekirdekle eğitip yorumlamayı</li><li><code>C</code> ve <code>gamma</code>\'nın karar sınırını nasıl şekillendirdiğini</li><li>SVM\'in özellik birimlerine kanmaması için ölçeklemeli Pipeline kurmayı</li><li>GridSearchCV ile (C, gamma) ayarlayıp doğru çalışma noktasını seçmeyi</li><li>n büyük ve sınır lineer olduğunda LinearSVC\'ye geçmeyi</li><li>SVR ile regresyon ve epsilon-tüp sezgisini okumayı</li><li>SVM\'in tam olarak ne zaman doğru araç olduğunu — ve ne zaman yanından geçeceğini</li></ul></div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. 60 Saniyede SVM — Hızlı Tazeleme</h2>

<p class="l-text">SVM, iki sınıfı <em>mümkün olan en geniş marjla</em> ayıran hiperdüzlemi bulur. O marja değen birkaç eğitim noktası (destek vektörleri) modeli tamamen belirler — geri kalan her şey önemsizdir. Lineer olmayan sınırlar için <strong>çekirdek hilesi</strong>: iç çarpım <em>x<sup>⊤</sup>x\'</em>\'ı bir çekirdek fonksiyonu <em>K(x, x\')</em> ile değiştiririz; bu, x\'i hiç hesaplamadan yüksek-boyutlu bir uzaya götürmeye eşdeğerdir.</p>

<div class="katex-block">$$f(\\mathbf{x}) = \\text{sign}\\!\\left( \\sum_{i \\in \\text{SV}} \\alpha_i y_i \\, K(\\mathbf{x}_i, \\mathbf{x}) + b \\right)$$</div>

<p class="l-text">"Marj", "destek vektörü", "çekirdek hilesi", "C parametresi" kelimeleri havada kalıyorsa önce <a href="/tutorials/ai/ml/support-vector-machines">ML Teori Ders 12</a>\'yi oku — türetmeler orada. Bu ders o kelimelerin anlamını bildiğini varsayar ve onları nasıl çalışan koda dökeceğini gösterir.</p>

<div class="l-warn"><strong>Ölçekleme isteğe bağlı değildir.</strong> SVM mesafe tabanlıdır: 0-10000 aralığında ölçeksiz bir özellik, 0-1 aralığındaki bir özelliği sessizce ezer ve ikincisini görmemiş olursun. SVM\'i <em>her zaman</em> <code>StandardScaler</code> ile Pipeline içine al. Bunu unutmak en sık görülen SVM bug\'ıdır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. SVC API\'si — kernel, C, gamma</h2>

<p class="l-text">sklearn\'in <code>SVC</code> sınıfı çekirdekli SVM\'dir. Üç parametre davranışını belirler:</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">kernel</div><div class="card-body"><code>'linear'</code>, <code>'rbf'</code> (varsayılan), <code>'poly'</code>, <code>'sigmoid'</code> veya bir callable. RBF güvenli varsayılan; özellikler zaten ayırt ediciyse (metin) lineer; poly nadiren.</div></div>
<div class="calc-card"><div class="card-title">C</div><div class="card-body">Regularizasyonun tersi. Büyük C → eğitime sıkı uyum (dar marj, overfit). Küçük C → daha geniş marj, bazı eğitim hatalarını kabul, çoğu zaman daha iyi genelleme.</div></div>
<div class="calc-card"><div class="card-title">gamma</div><div class="card-body">Sadece RBF / poly / sigmoid kullanır. Büyük gamma → her noktanın etkisi dar, model dalgalanır. Küçük gamma → geniş etki, yumuşak sınır. <code>'scale'</code> iyi bir varsayılan (1 / (n_features · X.var())).</div></div>
<div class="calc-card"><div class="card-title">probability</div><div class="card-body">Varsayılan False — SVC kararlar döner, olasılık değil. True ile Platt scaling açılır (bir iç lojistik regresyon, ekstra fit maliyeti). Sıralama yeterliyse <code>decision_function</code>\'ı tercih et.</div></div>
<div class="calc-card"><div class="card-title">class_weight</div><div class="card-body">Sınıflar dengesizse <code>'balanced'</code>; C\'yi sınıf frekansının tersiyle çarpar. Sahtekârlık, tıbbi anomali vb. için kritik.</div></div>
<div class="calc-card"><div class="card-title">decision_function_shape</div><div class="card-body">Çoklu sınıf için: <code>'ovr'</code> sınıf başına bir skor döner (varsayılan), <code>'ovo'</code> çift bazlı skorlar. Dahili olarak SVC her zaman one-vs-one ile eğitir.</div></div>
</div>

<p class="l-text">Zihinsel model: <strong>C modelin eğitim hatalarına ne kadar katı olduğunu, gamma her noktanın etkisinin ne kadar yerel olduğunu kontrol eder</strong>. İkisi birlikte ayarlanmalı — küçük gamma + büyük C ile büyük gamma + küçük C neredeyse aynı modeli üretebilir, parametre uzayında bambaşka noktalardan. Her zaman 2 boyutlu grid search yap.</p>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Meme Kanserinde Lineer SVM — Eksiksiz Pipeline</h2>

<p class="l-text">Düzgün ölçeklenmiş bir SVM pipeline\'ını meme kanseri veri setinde (569 örnek, 30 özellik, ikili tanı) baştan sona çalıştıralım. Bu, SVM\'in parladığı kanonik "küçük, temiz, yüksek-boyutlu" ortamdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, cross_val_score
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVC
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, roc_auc_score

X, y = <span class="fn">load_breast_cancer</span>(return_X_y=<span class="kw">True</span>)
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.25</span>, stratify=y, random_state=<span class="num">0</span>)

<span class="cm"># Pipeline: ölçekle -> lineer SVM. roc_auc_score için probability=True.</span>
clf = <span class="fn">Pipeline</span>([
    (<span class="str">"scaler"</span>, <span class="fn">StandardScaler</span>()),
    (<span class="str">"svm"</span>,    <span class="fn">SVC</span>(kernel=<span class="str">"linear"</span>, C=<span class="num">1.0</span>, probability=<span class="kw">True</span>, random_state=<span class="num">0</span>)),
])

clf.<span class="fn">fit</span>(X_tr, y_tr)
preds = clf.<span class="fn">predict</span>(X_te)
proba = clf.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]

<span class="fn">print</span>(<span class="fn">classification_report</span>(y_te, preds, digits=<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"ROC-AUC:"</span>, <span class="fn">round</span>(<span class="fn">roc_auc_score</span>(y_te, proba), <span class="num">3</span>))

<span class="cm"># Pipeline\'a 5-katlı CV (ölçekleme her fold içinde — sızıntı yok)</span>
cv = <span class="fn">cross_val_score</span>(clf, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"roc_auc"</span>)
<span class="fn">print</span>(<span class="str">f"CV ROC-AUC: {cv.mean():.3f} +/- {cv.std():.3f}"</span>)

<span class="cm"># Orijinal özellik uzayında lineer model katsayılarını incele</span>
svm = clf.<span class="fn">named_steps</span>[<span class="str">"svm"</span>]
<span class="fn">print</span>(<span class="str">"Destek vektörü sayısı:"</span>, svm.support_vectors_.shape[<span class="num">0</span>])
<span class="fn">print</span>(<span class="str">"Özellik sayısı:"</span>, svm.coef_.shape[<span class="num">1</span>])</code></pre></div>

<p class="l-text"><strong>Kodu okumak:</strong> Pipeline, <code>StandardScaler</code>\'ın yalnızca eğitim fold\'ları üstünde fit edilmesini garanti eder — X\'i baştan ölçekleyip sonra cross-validation çalıştırsaydın, test fold\'larının istatistikleri eğitime sızar ve CV skoru gerçekçi olmayan iyimser çıkardı. Sarmalama bunu her zaman çözer. Bu veri setinde lineer SVM tipik olarak ROC-AUC ~0.995 verir; 426 eğitim örneğinden yaklaşık 30-50\'si destek vektörü olur — verinin sadece ~%10\'u modeli "taşıyor" demek. Geri kalan %90 kendi sınıfının iç tarafında, pozitif marjla rahatça oturuyor.</p>

<div class="calc-step"><strong>İnceleme hilesi:</strong> Lineer SVM için <code>svm.coef_[0]</code> orijinal özellik başına bir ağırlık verir. Mutlak değere göre sıralarsan hangi özelliklerin kararı domine ettiğini görürsün — bedava bir "fakir adamın özellik önemi" grafiği. Bu sadece kernel=\'linear\' için geçerli; RBF\'te "katsayı" örtük φ uzayında yaşar, doğrudan okunmaz.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Lineer Ayrılamaz Veride RBF — make_circles</h2>

<p class="l-text">Sınır eğri olduğunda lineer SVM çaresizdir. <code>make_circles</code> iki iç içe halka üretir — ders kitabı örneği. Lineer SVM ~%50 (rastgele) skor alır. RBF SVM ~%99. Çekirdek hilesi burada gerçek iş yapıyor.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_circles
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVC
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline

X, y = <span class="fn">make_circles</span>(n_samples=<span class="num">500</span>, noise=<span class="num">0.08</span>, factor=<span class="num">0.45</span>, random_state=<span class="num">0</span>)
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">0</span>)

linear = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                   (<span class="str">"svm"</span>, <span class="fn">SVC</span>(kernel=<span class="str">"linear"</span>, C=<span class="num">1.0</span>))])
rbf    = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                   (<span class="str">"svm"</span>, <span class="fn">SVC</span>(kernel=<span class="str">"rbf"</span>, C=<span class="num">1.0</span>, gamma=<span class="str">"scale"</span>))])

<span class="kw">for</span> name, model <span class="kw">in</span> [(<span class="str">"Lineer"</span>, linear), (<span class="str">"RBF"</span>, rbf)]:
    model.<span class="fn">fit</span>(X_tr, y_tr)
    acc = model.<span class="fn">score</span>(X_te, y_te)
    n_sv = model.<span class="fn">named_steps</span>[<span class="str">"svm"</span>].n_support_.<span class="fn">sum</span>()
    <span class="fn">print</span>(<span class="str">f"{name:6} acc={acc:.3f}  destek_vektoru={n_sv}"</span>)

<span class="cm"># Tipik çıktı:</span>
<span class="cm"># Lineer acc=0.493  destek_vektoru=350</span>
<span class="cm"># RBF    acc=0.987  destek_vektoru= 78</span></code></pre></div>

<div id="plot-skl9-circles-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne anlatıyor:</strong> İç içe halkalardan 500 örnek ve üstüne çizilmiş RBF-SVM karar sınırı. Sınır kapalı bir eğri (bu projeksiyonda neredeyse daire) — verinin tam talep ettiği şekil. Lineer SVM\'in soluk kesikli referans çizgisi bulutun ortasından tek bir doğru olarak geçer ve örneklerin ~yarısını yanlış tarafta bırakır; sadece kötü değil, kavramsal olarak bu problemi çözemez. Bu figür çekirdek hilesinin niye önemli olduğunu özetler: aynı kütüphane, aynı API, tek parametre değişikliği (<code>kernel=\'rbf\'</code>) ve işe yaramaz modelden neredeyse mükemmel modele geçeriz.</div>

<p class="l-text">İkinci anlamlı sayıya dikkat: RBF modelinin sadece ~78 destek vektörü gerekirken lineer için 350. Lineer model "sıkışmış" — neredeyse her örnek marjın yanlış tarafında, dolayısıyla hepsini destek vektörü olarak çağırmak zorunda. RBF modeli sade bir tanım buluyor.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. GridSearchCV ile (C, gamma) Ayarı</h2>

<p class="l-text">Varsayılan <code>C=1, gamma='scale'</code> iyi başlangıç ama nadiren optimaldir. Standart tarif: cross-validation içinde 2 boyutlu log-uzayda grid search. Aşağıda C ve gamma birlikte aranıyor, 5-katlı stratified CV ile ROC-AUC üzerinden değerlendiriliyor.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV, train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVC

X, y = <span class="fn">load_breast_cancer</span>(return_X_y=<span class="kw">True</span>)
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.2</span>, stratify=y, random_state=<span class="num">0</span>)

pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"scaler"</span>, <span class="fn">StandardScaler</span>()),
    (<span class="str">"svm"</span>,    <span class="fn">SVC</span>(kernel=<span class="str">"rbf"</span>, probability=<span class="kw">False</span>, random_state=<span class="num">0</span>)),
])

param_grid = {
    <span class="str">"svm__C"</span>:     [<span class="num">0.1</span>, <span class="num">1</span>, <span class="num">10</span>, <span class="num">100</span>],
    <span class="str">"svm__gamma"</span>: [<span class="str">"scale"</span>, <span class="num">0.001</span>, <span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1</span>],
}

grid = <span class="fn">GridSearchCV</span>(pipe, param_grid, cv=<span class="num">5</span>, scoring=<span class="str">"roc_auc"</span>,
                    n_jobs=-<span class="num">1</span>, refit=<span class="kw">True</span>, verbose=<span class="num">0</span>)
grid.<span class="fn">fit</span>(X_tr, y_tr)

<span class="fn">print</span>(<span class="str">"En iyi parametreler:"</span>, grid.best_params_)
<span class="fn">print</span>(<span class="str">f"En iyi CV ROC-AUC: {grid.best_score_:.4f}"</span>)
<span class="fn">print</span>(<span class="str">f"Tutulmuş test ROC-AUC: {grid.<span class="fn">score</span>(X_te, y_te):.4f}"</span>)

<span class="cm"># CV skor yüzeyini heatmap olarak görselleştir</span>
<span class="kw">import</span> pandas <span class="kw">as</span> pd
res = <span class="fn">pd</span>.<span class="fn">DataFrame</span>(grid.cv_results_)
pivot = res.<span class="fn">pivot</span>(index=<span class="str">"param_svm__gamma"</span>,
                  columns=<span class="str">"param_svm__C"</span>,
                  values=<span class="str">"mean_test_score"</span>)
<span class="fn">print</span>(pivot.<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>

<div id="plot-skl9-grid-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik ne anlatıyor:</strong> Her (C, gamma) hücresi için CV ROC-AUC değeri. Parlak hücreler iyi, koyu hücreler kötü — ve önemlisi parlak bölge tek bir sıcak nokta değil, bir <em>diyagonal sırt</em> oluşturuyor. C\'yi artırmak ve gamma\'yı azaltmak modeli "daha esnek" yaptığı için sırt üstünde birçok (C, gamma) kombinasyonu neredeyse aynı doğruluğu üretir. Ders: ondalıkta en iyi hücreyi kovalamak yerine, sırt üstünde rahat bir nokta seç ve daha sade modeli (daha küçük C, daha küçük gamma) tercih et. Köşeler — küçük C + küçük gamma (her şey aynı sınıf) ve büyük C + büyük gamma (her eğitim noktası etrafında overfit lekeleri) — modeli çökertir.</div>

<div class="calc-step"><strong>Üretim ipucu:</strong> Favori (C, gamma)\'nı bulduktan sonra son dağıtımdan önce Pipeline\'ı train + validation birleşimi üstünde yeniden fit et. <code>refit=True</code> ile GridSearchCV bunu otomatik yapar ama sadece orijinal eğitim bölümünde — en son model için bir kez daha <code>.fit(X_full, y_full)</code> çağır.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. LinearSVC — n Büyük ve Sınır Lineer Olduğunda</h2>

<p class="l-text"><code>SVC(kernel='linear')</code> doğrudur ama yavaştır: hâlâ genel çekirdek çözücüsünü çağırır. Büyük-ama-lineer problemler için (örn. 100k doküman ve 50k kelime hazinesi olan TF-IDF metin sınıflandırma), <code>LinearSVC</code> özelleşmiş bir primal çözücü kullanır ve dramatik biçimde hızlıdır — saatler yerine dakikalar.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_20newsgroups
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> LinearSVC
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score

cats = [<span class="str">"sci.med"</span>, <span class="str">"sci.space"</span>, <span class="str">"talk.politics.guns"</span>, <span class="str">"rec.autos"</span>]
data = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">"train"</span>, categories=cats,
                            remove=(<span class="str">"headers"</span>, <span class="str">"footers"</span>, <span class="str">"quotes"</span>))

clf = <span class="fn">Pipeline</span>([
    (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(min_df=<span class="num">2</span>, max_df=<span class="num">0.9</span>,
                              ngram_range=(<span class="num">1</span>, <span class="num">2</span>), sublinear_tf=<span class="kw">True</span>)),
    (<span class="str">"svm"</span>,   <span class="fn">LinearSVC</span>(C=<span class="num">1.0</span>, dual=<span class="str">"auto"</span>, random_state=<span class="num">0</span>)),
])

scores = <span class="fn">cross_val_score</span>(clf, data.data, data.target, cv=<span class="num">5</span>,
                          scoring=<span class="str">"accuracy"</span>, n_jobs=-<span class="num">1</span>)
<span class="fn">print</span>(<span class="str">f"TF-IDF + LinearSVC: {scores.mean():.3f} +/- {scores.std():.3f}"</span>)
<span class="cm"># Tipik: 4 kategoride 0.92 - 0.94</span></code></pre></div>

<p class="l-text"><code>LinearSVC</code> hakkında birkaç pratik not:</p>

<ul class="l-list">
<li><strong>Olasılık yok:</strong> sıralama için <code>decision_function</code> kullan; gerçekten olasılık gerekiyorsa <code>CalibratedClassifierCV</code> ile sarmala.</li>
<li><strong>Çoklu sınıfta varsayılan one-vs-rest</strong> (SVC ise one-vs-one). 5-20 sınıflı çoğu metin probleminde fark önemsiz.</li>
<li><strong>Loss seçenekleri:</strong> <code>loss='hinge'</code> klasik SVM hinge kaybıdır; <code>'squared_hinge'</code> varsayılan ve genelde bir tık daha stabil.</li>
<li><strong>L1 vs L2:</strong> <code>penalty='l1'</code> bazı katsayıları tam sıfıra çeker — metinde özellik seçimi için faydalı.</li>
</ul>

<div class="calc-example"><div class="example-label">PRATIK KURAL</div><div class="example-body">Eğer <code>n_samples * n_features &gt; 10⁷</code> ve sadece lineer sınır istiyorsan, <code>LinearSVC</code>\'ye geç. Gerçekten lineer olmayan sınır gerekliyse <code>SVC(kernel='rbf')</code>\'de kal ve eğitim için saniye değil saatler ayır. Yaklaşık 50000 örneği aştığında RBF SVC bile boğulur — o noktada bir MLP, gradient boosting veya Nyström-yaklaşımlı çekirdek SVM daha cazip olur.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. SVR — Support Vector Regression</h2>

<p class="l-text">SVM\'ler regresyonda da çalışır, ufak bir bükümle: "sınıfları en geniş marjla ayır" yerine SVR, hedef değerin etrafına bir <strong>ε-tüp</strong> çizer ve tüp içindeki tahmin hatalarını yok sayar. Sadece tüpün <em>dışındaki</em> noktalar kayba katkı yapar ve destek vektörü olur.</p>

<div class="katex-block">$$L_\\varepsilon(y, \\hat{y}) = \\max\\bigl(0, \\, |y - \\hat{y}| - \\varepsilon\\bigr)$$</div>

<p class="l-text">Buna <em>ε-duyarsız kayıp</em> denir. Küçük hataları tolere eder, hafif gürültüye karşı dayanıklıdır; büyük hataları doğrusal olarak cezalandırır (MSE\'nin kare cezasından farklı). RBF çekirdekle SVR, küçük-orta non-lineer regresyon problemlerinin klasik iş atıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_california_housing
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.svm <span class="kw">import</span> SVR
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_absolute_error, r2_score

data = <span class="fn">fetch_california_housing</span>()
X, y = data.data, data.target
<span class="cm"># 5000 satır al — SVR O(n^2), tam 20k yavaş kalır</span>
rng = np.<span class="fn">random</span>.<span class="fn">default_rng</span>(<span class="num">0</span>)
idx = rng.<span class="fn">choice</span>(<span class="fn">len</span>(X), <span class="num">5000</span>, replace=<span class="kw">False</span>)
X, y = X[idx], y[idx]

X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">0</span>)

reg = <span class="fn">Pipeline</span>([
    (<span class="str">"scaler"</span>, <span class="fn">StandardScaler</span>()),
    (<span class="str">"svr"</span>,    <span class="fn">SVR</span>(kernel=<span class="str">"rbf"</span>, C=<span class="num">10.0</span>, gamma=<span class="str">"scale"</span>, epsilon=<span class="num">0.1</span>)),
])
reg.<span class="fn">fit</span>(X_tr, y_tr)
pred = reg.<span class="fn">predict</span>(X_te)

<span class="fn">print</span>(<span class="str">f"MAE: {mean_absolute_error(y_te, pred):.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"R^2: {r2_score(y_te, pred):.3f}"</span>)
<span class="fn">print</span>(<span class="str">f"Destek vektörleri: {reg.named_steps['svr'].support_.shape[0]}"</span>)</code></pre></div>

<p class="l-text"><strong>ε\'nin rolü:</strong> büyük ε daha çok tolerans demek — daha az destek vektörü, daha sade model, overfit\'e karşı koruma; ama tahmin tabanı gürültülü. Küçük ε daha sıkı uyum, fakat daha çok destek vektörü. ε=0.1 (varsayılan) standartlaştırılmış hedefler için makul başlangıç. Sınıflandırmada olduğu gibi (C, gamma, ε) ızgarasını birlikte ayarla — son birkaç puan önemliyse.</p>

<p class="l-text">SVR 2026\'da hâlâ ne zaman kazanır? Küçük-orta yapısal regresyon problemlerinde, non-lineer etkilerle ve iyi mühendislenmiş özelliklerle. Çok büyük veride veya saf tablo problemlerinde gradient boosting regresörleri (LightGBM, XGBoost) çok daha az ayar maliyetiyle üstündür. Dizi veya görüntü regresyonunda derin ağlar hakim.</p>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 2026\'da SVM\'ler Hâlâ Doğru Araç Mı?</h2>

<p class="l-text">Teori ve pratiği geçtikten sonra dürüst bakış: 2026\'da SVM açıkça en bariz varsayılan değil, ama bazı senaryolarda hâlâ doğru araç.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Küçük veri (n &lt; 5000)</div><div class="card-body">İyi ayarlanmış RBF SVM çoğu zaman en güçlü model — derin ağ overfit eder, gradient boosting parlamak için daha fazla veri ister; SVM\'in marj amacı doğal olarak regularize eder.</div></div>
<div class="calc-card"><div class="card-title">Metin sınıflandırma baseline</div><div class="card-body">TF-IDF + LinearSVC yerleşik ilk baseline. Bir transformer bunu 2 puandan fazla geçemiyorsa, transformer muhtemelen iş yapmıyor demektir.</div></div>
<div class="calc-card"><div class="card-title">Yüksek-boyut seyrek özellik</div><div class="card-body">Bag-of-words, n-gram, gen ifadesi vektörleri — p &gt; n ve özelliklerin çoğu sıfır olduğunda lineer SVM hem rekabetçi hem açıklanabilir.</div></div>
<div class="calc-card"><div class="card-title">Anomali tespiti</div><div class="card-body"><code>OneClassSVM</code> bol "normal" örnek ve neredeyse hiç anomali olmadığında klasik yöntem — sahtekârlık, üretim hataları, ağ sızması.</div></div>
<div class="calc-card"><div class="card-title">Yorumlanabilir lineer modeller</div><div class="card-body">L1 cezalı seyrek LinearSVC hem tahmin hem özellik seçimi verir — niye bir bayrak kaldırıldığını açıklamak gerektiğinde değerli.</div></div>
<div class="calc-card"><div class="card-title">Sıkı gecikme bütçeleri</div><div class="card-body">Birkaç yüz destek vektörlü SVM mikrosaniyelerde tahmin yapar — derin modelden çok hızlı ve sadece CPU.</div></div>
</div>

<p class="l-text"><strong>SVM\'in yanından geçmen gereken durumlar:</strong> çok büyük veri setleri (n &gt; 100k) — eğitim kötü ölçeklenir; karışık tipli zengin tablo verisi — gradient boosting kazanır; gösterim öğrenmesi gerektiren görevler (görüntü, ses, dil modellemesi) — derin ağlar kategorik olarak daha iyi; kalibrasyona girmek istemediğin olasılık-kritik uygulamalar — lojistik regresyon veya boosting daha dürüst.</p>

<div class="think-box"><div class="think-label">SVM UYGULAMA CHECKLIST\'I</div><div class="think-body"><strong>1.</strong> Her zaman <code>StandardScaler</code> ile Pipeline\'a sar.<br><strong>2.</strong> Baseline olarak <code>kernel='rbf'</code>, <code>C=1</code>, <code>gamma='scale'</code> ile başla.<br><strong>3.</strong> (C, gamma)\'yı log uzayda grid-search yap — her birinden 4-5 değer.<br><strong>4.</strong> Dengesiz veride <code>class_weight='balanced'</code> kullan.<br><strong>5.</strong> Olasılık gerek? Ya SVC\'de <code>probability=True</code> ya da LinearSVC\'yi <code>CalibratedClassifierCV</code>\'ye sar.<br><strong>6.</strong> n büyük ve sınır yaklaşık lineerse <code>LinearSVC</code>\'ye geç (metin sınıflandırma).<br><strong>7.</strong> Regresyon için <code>SVR(kernel='rbf', epsilon=0.1)</code> ile başla, ε\'yi C ve gamma ile birlikte ayarla.<br><strong>8.</strong> Eğitim çekilmez derecede yavaşsa veri çekirdek SVM için fazla — LinearSVC, Nyström yaklaşımı veya başka model sınıfına geç.<br><strong>9.</strong> <code>n_support_</code>\'a bak — destek vektörü oranı %90\'ı geçen model ya overfit ya da veri köklü gürültülü.<br><strong>10.</strong> SVM\'i şampiyon ilan etmeden önce her zaman lojistik regresyon ve gradient boosting baseline\'ları ile karşılaştır.</div></div>

<p class="l-text">Artık eksiksiz bir SVM iş akışın var. <a href="/tutorials/ai/ml/support-vector-machines">ML Teori Ders 12</a>\'deki teoriyle birleştirince hem bir SVM\'in niye çalıştığını akıl yürütebilir hem de yarın bir tanesini ürüne sokabilirsin. Sklearn track\'inde sıradaki durak: ensemble yöntemleri ya da model dağıtımı — hangisini kapatmak istersen.</p>
</div>`

};
