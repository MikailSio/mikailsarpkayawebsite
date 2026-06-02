window.SKLEARN_L8 = {

en: `<p class="l-text"><strong>Dimensionality reduction is what makes high-dimensional data tractable.</strong> When your dataset has 1000 features and 500 samples, no model can fit honestly -- you need to compress those features down to a meaningful 20-50 before you can do anything else. PCA is the workhorse linear method, t-SNE the standard for visualization, and UMAP the modern compromise. Mastering them is the difference between getting buried under "curse of dimensionality" and discovering useful structure.</p>

<p class="l-text">In this final lesson we cover PCA in depth (eigendecomposition, explained variance, when to use it), brief introductions to t-SNE and UMAP for visualization, and then we close the course by building one end-to-end pipeline that combines everything you have learned: load real data, preprocess, dimensionally reduce, model, tune, evaluate, and ship a single artifact. This is the canonical sklearn workflow you should follow on every tabular ML project for the rest of your career.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Apply PCA for linear dimensionality reduction and explained variance</li><li>Use t-SNE and UMAP for nonlinear visualization</li><li>Build end-to-end Pipeline with ColumnTransformer for mixed numeric/categorical data</li><li>Tune pipeline with RandomizedSearchCV</li><li>Save trained pipeline with joblib for deployment</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. PCA: Principal Component Analysis</h2>

<p class="l-text">PCA finds new axes (principal components) along which the data varies most. The first component captures maximum variance; the second is orthogonal to the first and captures the most remaining variance; and so on. Projecting your data onto the top k components is the optimal linear compression in mean-squared-error sense.</p>

<p class="l-text">Mathematically, PCA is the eigendecomposition of the covariance matrix:</p>

<div class="katex-block">$$\\Sigma = \\frac{1}{n-1} X^T X = V \\Lambda V^T$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\Sigma$</div><div class="card-body">Covariance matrix of centered features, shape (p, p). Captures all pairwise feature correlations.</div></div>
<div class="calc-card"><div class="card-title">$V$</div><div class="card-body">Eigenvector matrix, shape (p, p). Each column is a principal component direction.</div></div>
<div class="calc-card"><div class="card-title">$\\Lambda$</div><div class="card-body">Diagonal matrix of eigenvalues. Eigenvalue $\\lambda_k$ = variance along the k-th principal component.</div></div>
<div class="calc-card"><div class="card-title">Projection</div><div class="card-body">$X_{\\text{new}} = X V_k$ where $V_k$ has only the top k columns. Output shape (n, k).</div></div>
<div class="calc-card"><div class="card-title">Explained variance</div><div class="card-body">$\\lambda_k / \\sum_j \\lambda_j$ = fraction of total variance explained by component k.</div></div>
<div class="calc-card"><div class="card-title">SVD equivalence</div><div class="card-body">PCA can also be computed via $X = U S V^T$. sklearn uses SVD because it is numerically more stable.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> PCA
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
<span class="fn">print</span>(f<span class="str">"Original shape: {X.shape}"</span>)   <span class="cm"># (569, 30)</span>

<span class="cm"># ALWAYS scale before PCA -- otherwise variance is dominated by units</span>
Xs = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

<span class="cm"># Fit PCA -- ask for all components first</span>
pca = <span class="fn">PCA</span>().<span class="fn">fit</span>(Xs)
explained = pca.explained_variance_ratio_
cum = np.<span class="fn">cumsum</span>(explained)
<span class="fn">print</span>(f<span class="str">"PC1 explains {explained[0]*100:.1f}% of variance"</span>)
<span class="fn">print</span>(f<span class="str">"PC1 + PC2 explain {cum[1]*100:.1f}%"</span>)
<span class="fn">print</span>(f<span class="str">"First 5 components explain {cum[4]*100:.1f}%"</span>)
<span class="fn">print</span>(f<span class="str">"To explain 95% you need {(cum < 0.95).sum() + 1} components"</span>)

<span class="cm"># Now project to 2D for visualization</span>
pca2 = <span class="fn">PCA</span>(n_components=<span class="num">2</span>)
X_2d = pca2.<span class="fn">fit_transform</span>(Xs)
<span class="fn">print</span>(f<span class="str">"Projected shape: {X_2d.shape}"</span>)     <span class="cm"># (569, 2)</span>

<span class="cm"># Specify variance instead of count: PCA(n_components=0.95) keeps enough PCs to explain 95%</span>
pca_var = <span class="fn">PCA</span>(n_components=<span class="num">0.95</span>)
X_kept = pca_var.<span class="fn">fit_transform</span>(Xs)
<span class="fn">print</span>(f<span class="str">"Kept {X_kept.shape[1]} components to explain 95% variance"</span>)

<span class="cm"># Component "loadings" -- which original features make up each PC?</span>
<span class="fn">print</span>(<span class="str">"PC1 top contributors:"</span>)
top = np.<span class="fn">argsort</span>(np.<span class="fn">abs</span>(pca2.components_[<span class="num">0</span>]))[::-<span class="num">1</span>][:<span class="num">5</span>]
<span class="kw">for</span> i <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  {data.feature_names[i]}: {pca2.components_[0, i]:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads breast-cancer data with 30 features. 2) Scales features -- non-negotiable for PCA, otherwise the feature with the largest range dominates the principal components even if it carries no real signal. 3) Fits PCA with no <code>n_components</code> argument; sklearn returns all 30 components. <code>explained_variance_ratio_</code> is the fraction of variance per component, sorted descending. 4) For breast-cancer, PC1 alone often explains 45%, PC1+PC2 explain ~63%, top 5 explain 85%, etc. The cumulative-variance plot tells you exactly how many components you need. 5) <code>PCA(n_components=2)</code> projects to 2D for visualization; <code>PCA(n_components=0.95)</code> automatically keeps enough components to explain 95% of the variance. 6) <code>pca.components_[0]</code> gives the "loading" of each original feature on PC1 -- this tells you which raw features are most aligned with the first principal direction.</p>

<div id="plot-l8-pca-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> 569 breast-cancer samples projected onto the first two principal components, colored by malignant (orange) vs benign (teal). Even though we used NO label information to build the projection, the two classes separate visually -- this is the magic of PCA: it finds directions of maximum variance, and those directions often align with class structure when classes have different feature means. This 2D scatter is the kind of "first look" plot you should make for every new high-dimensional dataset.</div>

<div id="plot-l8-explvar-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The cumulative explained variance ratio. As you add principal components (x-axis), the fraction of total variance explained (y-axis) climbs. The curve is steep at first (the early components capture most signal) and flattens (later components capture mostly noise). The horizontal line at 0.95 shows where you would stop if your goal is "keep 95% of the information"; the corresponding x-value is your PCA dimension. For breast-cancer, ~10 components keep 95% -- a 3x compression with negligible information loss.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP TF-IDF dimensionality</div><div class="example-body">A 50,000-vocabulary TF-IDF matrix has 50,000 features per document. Most are zeros. PCA via TruncatedSVD (the sparse-friendly variant) compresses this to 100-300 dense components, which is what classifiers and visualization tools can actually handle. This combination -- TF-IDF + TruncatedSVD + LogisticRegression -- is a standard NLP baseline that is hard to beat without going to neural embeddings.</div></div>

<div class="l-warn"><strong>Sparse data:</strong> regular <code>PCA</code> centers the data, which destroys sparsity and explodes memory. For sparse matrices (TF-IDF, BoW), use <code>TruncatedSVD</code> instead -- it does the SVD without centering and stays sparse-friendly.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. t-SNE and UMAP: Nonlinear Visualization</h2>

<p class="l-text">PCA is linear -- it can only find linear projections. For data that lies on a curved manifold (think handwriting, faces, word embeddings), nonlinear methods reveal far richer structure. The two leading tools are <strong>t-SNE</strong> and <strong>UMAP</strong>.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">t-SNE</div><div class="card-body">Stochastic Neighbor Embedding. Preserves local neighborhood structure. Famous for cluster-revealing visualizations.</div></div>
<div class="calc-card"><div class="card-title">UMAP</div><div class="card-body">Uniform Manifold Approximation. Faster than t-SNE, preserves more global structure, scales to millions of points.</div></div>
<div class="calc-card"><div class="card-title">For visualization</div><div class="card-body">Both produce 2D or 3D embeddings; you almost never use them with more dimensions.</div></div>
<div class="calc-card"><div class="card-title">For modeling</div><div class="card-body">Avoid! t-SNE/UMAP outputs are for the human eye, not for downstream classifiers. Use PCA for modeling.</div></div>
<div class="calc-card"><div class="card-title">Stochastic</div><div class="card-body">Both are stochastic -- different random seeds produce different layouts. Always set random_state for reproducibility.</div></div>
<div class="calc-card"><div class="card-title">No new-point predict</div><div class="card-body">t-SNE in sklearn cannot transform new points; UMAP can. For incremental data, prefer UMAP.</div></div>
</div>

<p class="l-text">The objective of t-SNE is to minimize the Kullback-Leibler divergence between two distributions: pairwise similarities in the original space ($p_{ij}$, Gaussian-decay) and in the embedding space ($q_{ij}$, t-distribution-decay):</p>

<div class="katex-block">$$\\text{KL}(P \\| Q) = \\sum_{i \\neq j} p_{ij} \\log \\frac{p_{ij}}{q_{ij}}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.manifold <span class="kw">import</span> TSNE
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> PCA
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_digits

digits = <span class="fn">load_digits</span>()
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(digits.data)
y = digits.target
<span class="fn">print</span>(f<span class="str">"Original shape: {X.shape}"</span>)   <span class="cm"># (1797, 64)</span>

<span class="cm"># ALWAYS run PCA first to reduce noise (50 dims is a common sweet spot)</span>
X_50 = <span class="fn">PCA</span>(n_components=<span class="num">50</span>, random_state=<span class="num">0</span>).<span class="fn">fit_transform</span>(X)

<span class="cm"># Now t-SNE for the final 2D projection</span>
tsne = <span class="fn">TSNE</span>(n_components=<span class="num">2</span>, perplexity=<span class="num">30</span>, learning_rate=<span class="str">"auto"</span>,
            init=<span class="str">"pca"</span>, random_state=<span class="num">0</span>)
X_2d = tsne.<span class="fn">fit_transform</span>(X_50)
<span class="fn">print</span>(f<span class="str">"t-SNE output shape: {X_2d.shape}"</span>)    <span class="cm"># (1797, 2)</span>

<span class="cm"># UMAP (requires: pip install umap-learn)</span>
<span class="cm"># from umap import UMAP</span>
<span class="cm"># X_umap = UMAP(n_components=2, n_neighbors=15, min_dist=0.1, random_state=0).fit_transform(X_50)</span>
<span class="cm"># UMAP is typically 5-10x faster than t-SNE on the same data</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads the digits dataset (1797 samples, 64 features, 10 classes). 2) <strong>Always pre-reduce with PCA before t-SNE</strong> -- this is a standard trick that denoises the data and makes t-SNE much faster (most variance is in the first 50 PCs anyway). 3) <code>perplexity=30</code> is the most important t-SNE hyperparameter; it controls the effective neighborhood size. Smaller (5-15) reveals tiny clusters; larger (50-100) reveals global structure. 4) <code>init="pca"</code> uses PCA initialization for stability and reproducibility. 5) <code>learning_rate="auto"</code> uses the modern "Belkina et al." heuristic and avoids the legacy default that often fails. 6) UMAP is similar in spirit but with a more principled topological foundation, and is much faster -- the standard modern choice for large datasets.</p>

<div id="plot-l8-tsne-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A t-SNE projection of the 64-dimensional digits dataset to 2D. Each point is a handwritten digit colored by its label (0-9). Notice how all 10 digit classes form distinct, visually separated clusters even though we used NO label information to compute the projection -- t-SNE recovered the latent class structure purely from feature similarity. This is the canonical "wow" demo of nonlinear dimensionality reduction. For your master's thesis on text embeddings, a similar t-SNE plot of BERT embeddings colored by topic is the standard "look how well our embeddings work" figure.</div>

<div class="calc-step"><strong>Pipeline rule:</strong> for visualization use t-SNE/UMAP after a PCA pre-reduction. For modeling, never feed t-SNE outputs to a classifier -- use PCA (or TruncatedSVD for sparse data) which preserves global geometry.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. End-to-End Project: Adult Census Income</h2>

<p class="l-text">Time to put everything together. We will load a real-world dataset (UCI Adult Census), build a full preprocessing + modeling + tuning + evaluation pipeline that follows every best practice from this course, and produce a single deployable artifact.</p>

<p class="l-text">The task: predict whether income is >$50k from demographic features. 14 features, mixed numeric and categorical, ~32k samples, ~24% positive class.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_openml
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, StratifiedKFold, RandomizedSearchCV
<span class="kw">from</span> sklearn.compose <span class="kw">import</span> ColumnTransformer, make_column_selector
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler, OneHotEncoder
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> HistGradientBoostingClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> (classification_report, roc_auc_score,
                             average_precision_score, confusion_matrix)
<span class="kw">from</span> scipy.stats <span class="kw">import</span> loguniform, randint

<span class="cm"># 1. Load real data</span>
adult = <span class="fn">fetch_openml</span>(<span class="str">"adult"</span>, version=<span class="num">2</span>, as_frame=<span class="kw">True</span>, parser=<span class="str">"auto"</span>)
X, y_str = adult.data, adult.target
y = (y_str == <span class="str">">50K"</span>).<span class="fn">astype</span>(<span class="ty">int</span>)
<span class="fn">print</span>(f<span class="str">"Shape: {X.shape}, positive class: {y.mean()*100:.1f}%"</span>)
<span class="fn">print</span>(X.dtypes.<span class="fn">value_counts</span>())

<span class="cm"># 2. Hold out final test set</span>
X_dev, X_test, y_dev, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.20</span>, stratify=y, random_state=<span class="num">42</span>
)
<span class="fn">print</span>(f<span class="str">"Dev: {len(X_dev)}, Test: {len(X_test)}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>fetch_openml("adult", version=2)</code> downloads the Adult Census dataset; OpenML mirrors many UCI datasets and gives them DataFrame-friendly. 2) Converts the string target ("&lt;=50K" / "&gt;50K") to binary integer; computes class balance (~24% positive). 3) Stratified 80/20 split holding out test data we will not touch until the very end. 4) Print the dtypes -- you will see a mix of int64 (numeric features like age, hours-per-week) and category (occupation, country, etc.). This is the kind of mixed dataset that makes ColumnTransformer essential.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Building the Preprocessing Pipeline</h2>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># 3. Build the preprocessing pipeline using dtype selectors</span>
numeric_pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"imp"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)),
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
])
categ_pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"imp"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"most_frequent"</span>)),
    (<span class="str">"ohe"</span>, <span class="fn">OneHotEncoder</span>(handle_unknown=<span class="str">"ignore"</span>, sparse_output=<span class="kw">False</span>)),
])

preprocess = <span class="fn">ColumnTransformer</span>([
    (<span class="str">"num"</span>, numeric_pipe, <span class="fn">make_column_selector</span>(dtype_include=np.number)),
    (<span class="str">"cat"</span>, categ_pipe,   <span class="fn">make_column_selector</span>(dtype_include=<span class="str">"category"</span>)),
])

<span class="cm"># 4. Wrap with the model</span>
pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"prep"</span>, preprocess),
    (<span class="str">"clf"</span>,  <span class="fn">HistGradientBoostingClassifier</span>(random_state=<span class="num">0</span>)),
])

<span class="cm"># Sanity check -- fit baseline and score</span>
pipe.<span class="fn">fit</span>(X_dev, y_dev)
<span class="fn">print</span>(f<span class="str">"Baseline AUC: {roc_auc_score(y_test, pipe.predict_proba(X_test)[:, 1]):.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines two pipeline branches. The numeric branch imputes median then standard-scales; the categorical branch imputes mode then one-hot encodes. 2) <code>ColumnTransformer</code> with <code>make_column_selector</code> automatically routes columns to the right branch based on dtype -- no need to hand-list the columns. 3) Wraps the entire preprocessor in another Pipeline together with a HistGradientBoostingClassifier. The full object now does imputation, scaling, encoding, and classification in one fit/predict call. 4) The baseline fit is essential: it confirms the pipeline is wired correctly before you spend an hour on hyperparameter search. Default HistGB on Adult Census should give AUC ~0.93 out of the box.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tuning, Evaluating, and Saving</h2>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># 5. RandomizedSearchCV over the entire pipeline</span>
param_dist = {
    <span class="str">"clf__learning_rate"</span>:     <span class="fn">loguniform</span>(<span class="num">0.01</span>, <span class="num">0.3</span>),
    <span class="str">"clf__max_iter"</span>:          <span class="fn">randint</span>(<span class="num">200</span>, <span class="num">800</span>),
    <span class="str">"clf__max_depth"</span>:         <span class="fn">randint</span>(<span class="num">3</span>, <span class="num">12</span>),
    <span class="str">"clf__min_samples_leaf"</span>:  <span class="fn">randint</span>(<span class="num">10</span>, <span class="num">100</span>),
    <span class="str">"clf__l2_regularization"</span>: <span class="fn">loguniform</span>(<span class="num">1e-4</span>, <span class="num">1.0</span>),
}

cv = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)
search = <span class="fn">RandomizedSearchCV</span>(
    pipe, param_dist, n_iter=<span class="num">60</span>, cv=cv,
    scoring=<span class="str">"roc_auc"</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">42</span>, refit=<span class="kw">True</span>, verbose=<span class="num">1</span>
)
search.<span class="fn">fit</span>(X_dev, y_dev)
<span class="fn">print</span>(f<span class="str">"Best CV AUC: {search.best_score_:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Best params: {search.best_params_}"</span>)

<span class="cm"># 6. Final test evaluation -- ONCE</span>
final_model = search.best_estimator_
y_pred  = final_model.<span class="fn">predict</span>(X_test)
y_proba = final_model.<span class="fn">predict_proba</span>(X_test)[:, <span class="num">1</span>]

<span class="fn">print</span>(<span class="str">"\\n=== HELD-OUT TEST PERFORMANCE ==="</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred, target_names=[<span class="str">"<=50K"</span>, <span class="str">">50K"</span>]))
<span class="fn">print</span>(f<span class="str">"ROC AUC : {roc_auc_score(y_test, y_proba):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"PR  AUC : {average_precision_score(y_test, y_proba):.4f}"</span>)
<span class="fn">print</span>(<span class="str">"Confusion matrix:"</span>)
<span class="fn">print</span>(<span class="fn">confusion_matrix</span>(y_test, y_pred))

<span class="cm"># 7. Save the entire pipeline</span>
<span class="kw">import</span> joblib
joblib.<span class="fn">dump</span>(final_model, <span class="str">"adult_income_pipeline.pkl"</span>)
<span class="cm"># Later: model = joblib.load("adult_income_pipeline.pkl")</span>
<span class="cm"># model.predict_proba(new_dataframe)   # everything just works</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a 5-dimensional hyperparameter search space using log-uniform and uniform-integer distributions. The double-underscore prefix <code>clf__</code> targets the classifier inside the pipeline. 2) <code>RandomizedSearchCV</code> with 60 iterations and 5-fold stratified CV explores the space; on Adult Census this takes a few minutes on a 4-core laptop. <code>n_jobs=-1</code> parallelizes across CPU cores. 3) Reports the best CV AUC and the winning hyperparameters. 4) Single evaluation on the held-out test set produces the numbers that go in your thesis chapter or product spec. 5) Classification report shows precision/recall/F1 per class; ROC-AUC and PR-AUC summarize ranking quality; confusion matrix tells you the structure of errors. 6) <code>joblib.dump</code> serializes the entire fitted Pipeline -- preprocessor included -- to a single file. <code>joblib.load</code> brings it back ready to predict. This is the deployable artifact you ship to production.</p>

<div id="plot-l8-final-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The end-to-end pipeline as a flow diagram -- raw DataFrame on the left flows into ColumnTransformer (numeric and categorical branches), each branch runs imputation + its preprocessing, the outputs concatenate, feed the gradient boosting classifier, and produce predictions on the right. The whole graph is a single sklearn object you can pickle, version, deploy, and reload. This single-artifact discipline is what production ML demands; no separate scaler files, no preprocessing gotchas at inference time, no version skew. Master this pattern and you are ready to ship real ML systems.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Save: joblib.dump</div><div class="card-body">Serializes any fitted sklearn object including pipelines. Compatible across sessions.</div></div>
<div class="calc-card"><div class="card-title">Load: joblib.load</div><div class="card-body">Restores the full state including learned parameters. Ready to <code>.predict</code> immediately.</div></div>
<div class="calc-card"><div class="card-title">pickle alternative</div><div class="card-body">Standard library, works but joblib is optimized for NumPy arrays (faster, smaller files).</div></div>
<div class="calc-card"><div class="card-title">Compatibility</div><div class="card-body">Works across Python versions and sklearn minor versions. Major version bumps may break -- pin your dependencies.</div></div>
<div class="calc-card"><div class="card-title">Security</div><div class="card-body">Never load pickle/joblib files from untrusted sources -- they can execute arbitrary code on load.</div></div>
<div class="calc-card"><div class="card-title">Production alternatives</div><div class="card-body">ONNX, BentoML, MLflow for cross-language serving and reproducibility tracking.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Course Summary and Where to Go Next</h2>

<p class="l-text">You have just walked through the entire scikit-learn workbench -- from loading data to shipping a trained pipeline. Here is the mental map of what you now know.</p>

<div class="calc-step"><strong>Lesson 1: The Estimator API</strong> -- fit/predict/transform is the unifying contract behind every algorithm.</div>
<div class="calc-step"><strong>Lesson 2: Preprocessing & Pipelines</strong> -- scaling, encoding, imputing, and chaining everything in a leak-safe Pipeline.</div>
<div class="calc-step"><strong>Lesson 3: Linear Models</strong> -- OLS, Ridge, Lasso, ElasticNet, and Logistic Regression -- the workhorses and the baselines.</div>
<div class="calc-step"><strong>Lesson 4: Tree-Based Models</strong> -- decision trees, random forests, gradient boosting -- the winners on tabular data.</div>
<div class="calc-step"><strong>Lesson 5: Validation</strong> -- KFold, GridSearchCV, RandomizedSearchCV, learning curves -- defending the numbers you report.</div>
<div class="calc-step"><strong>Lesson 6: Classification Metrics</strong> -- precision/recall/F1, ROC-AUC, PR-AUC, calibration -- the right numbers for the right job.</div>
<div class="calc-step"><strong>Lesson 7: Regression Metrics & Clustering</strong> -- MSE/RMSE/MAE/R-squared, KMeans, DBSCAN, hierarchical -- the rest of supervised and the start of unsupervised.</div>
<div class="calc-step"><strong>Lesson 8 (this one): Dimensionality Reduction & End-to-End</strong> -- PCA, t-SNE, UMAP, and the canonical pipeline pattern.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Beyond sklearn (deep)</div><div class="card-body">PyTorch + HuggingFace for transformers; Lightning for training loops.</div></div>
<div class="calc-card"><div class="card-title">Beyond sklearn (boost)</div><div class="card-body">XGBoost, LightGBM, CatBoost -- same API, faster and slightly more accurate.</div></div>
<div class="calc-card"><div class="card-title">Beyond sklearn (autoML)</div><div class="card-body">Optuna for advanced hyperparameter search; AutoML libraries like auto-sklearn or FLAML for end-to-end automation.</div></div>
<div class="calc-card"><div class="card-title">Beyond sklearn (interpret)</div><div class="card-body">SHAP, LIME, ELI5 for explanation; permutation_importance is in sklearn.inspection.</div></div>
<div class="calc-card"><div class="card-title">Beyond sklearn (deploy)</div><div class="card-body">FastAPI for a thin serving layer; MLflow or DVC for experiment tracking; ONNX for cross-platform inference.</div></div>
<div class="calc-card"><div class="card-title">Beyond sklearn (NLP)</div><div class="card-body">spaCy for traditional NLP; HuggingFace transformers for state-of-the-art models. Both compose well with sklearn for baselines.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: thesis-grade NLP classifier deployment</div><div class="example-body">For your master's thesis on sentiment analysis, the deployable artifact is a single Pipeline: <code>TfidfVectorizer + TruncatedSVD + LogisticRegression</code>, all wrapped, hyperparameter-tuned via 5x5 nested CV, evaluated with ROC-AUC + PR-AUC + F1 on a held-out test set, and serialized via joblib. The same pattern -- with HuggingFace embeddings as the feature extractor instead of TF-IDF -- gives you a competitive transformer baseline. The ML maturity is exactly the same; the only difference is whether your features come from a hashed n-gram dictionary or a 768-dim BERT embedding.</div></div>

<div class="think-box"><div class="think-label">FINAL TAKEAWAYS</div><div class="think-body"><strong>1.</strong> sklearn's value is the unified <code>fit/predict/transform/score</code> API across ~200 algorithms.<br><strong>2.</strong> Always wrap preprocessing + modeling in a Pipeline. Always use ColumnTransformer for mixed-type data.<br><strong>3.</strong> Always split your data first, then fit transformers only on train. Pipelines + cross-validation make this automatic.<br><strong>4.</strong> The right metric depends on your problem: ROC-AUC for ranking, F1 for thresholded performance, RMSE/MAE for regression. Pick before you train, not after.<br><strong>5.</strong> Random forests for "I want it to work first try"; gradient boosting for "I want the last 1-3% accuracy"; logistic regression as your baseline for everything.<br><strong>6.</strong> Hyperparameter tune with RandomizedSearchCV (or Optuna) inside cross-validation, never on the test set.<br><strong>7.</strong> PCA before clustering or visualization on high-dimensional data; t-SNE/UMAP for the final 2D plot.<br><strong>8.</strong> Save the entire fitted pipeline as one joblib file -- it is the deployable unit.<br><strong>9.</strong> Calibrate probabilities when downstream decisions depend on them. Always plot residuals after regression and confusion matrices after classification.<br><strong>10.</strong> sklearn covers ~95% of classical ML; for the remaining 5% (deep learning, NLP at scale, autoML), you compose sklearn with PyTorch, HuggingFace, Optuna, etc.</div></div>

<p class="l-text">You now have the complete sklearn skill set. The pattern -- load, split, pipeline, tune, validate, evaluate, save -- works for sentiment analysis, fraud detection, sales forecasting, churn prediction, customer segmentation, recommendation, and 90% of every other tabular ML problem you will encounter. Apply it on real data, write the report, ship the model. The library has been waiting.</p>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg:'rgba(0,0,0,0)',
    text:getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid:'rgba(255,255,255,0.06)',
    zero:'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};
  function rng(s){return function(){s=(s*9301+49297)%233280;return s/233280;};}

  // 1. PCA scatter (synthetic two-class)
  var elP = document.getElementById('plot-l8-pca-en');
  if (elP){
    var r = rng(7);
    var pos_x=[], pos_y=[], neg_x=[], neg_y=[];
    for (var i=0;i<200;i++){
      var u=r(), v=r();
      var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
      pos_x.push(2.5+1.2*z0); pos_y.push(1.0+1.0*z1);
    }
    for (var i=0;i<400;i++){
      var u=r(), v=r();
      var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
      neg_x.push(-1.5+1.5*z0); neg_y.push(-0.5+1.4*z1);
    }
    var t1 = {x:neg_x,y:neg_y,mode:'markers',type:'scatter',name:'benign',marker:{color:'#4ecdc4',size:7,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2 = {x:pos_x,y:pos_y,mode:'markers',type:'scatter',name:'malignant',marker:{color:T.accent,size:7,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Breast cancer projected onto PC1, PC2',font:{color:T.text,size:14}},xaxis:{title:'PC 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'PC 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l8-pca-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 2. Cumulative explained variance
  var elE = document.getElementById('plot-l8-explvar-en');
  if (elE){
    var indiv = [0.443,0.190,0.094,0.066,0.055,0.040,0.023,0.016,0.014,0.012,0.010,0.009,0.008,0.005,0.003,0.003,0.002,0.002,0.002,0.002,0.001,0.001,0.001,0.001,0.001,0.0005,0.0003,0.0002,0.0001,0.0001];
    var cum=[]; var s=0; for (var i=0;i<indiv.length;i++){s+=indiv[i];cum.push(s);}
    var pcs=[]; for (var i=1;i<=30;i++) pcs.push(i);
    var t1 = {x:pcs,y:indiv,type:'bar',name:'Individual',marker:{color:'rgba(78,205,196,0.6)'}};
    var t2 = {x:pcs,y:cum,mode:'lines+markers',type:'scatter',name:'Cumulative',line:{color:T.accent,width:3},marker:{size:6}};
    var t3 = {x:[1,30],y:[0.95,0.95],mode:'lines',type:'scatter',line:{color:'#f87171',width:1,dash:'dash'},name:'95% threshold'};
    var layout = Object.assign({}, common, {title:{text:'PCA explained variance per component (30 features)',font:{color:T.text,size:14}},xaxis:{title:'Component number',gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},yaxis:{title:'Explained variance ratio',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.05]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l8-explvar-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  // 3. t-SNE on digits (10 visible clusters, synthetic)
  var elT = document.getElementById('plot-l8-tsne-en');
  if (elT){
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6','#fb923c','#22d3ee'];
    var traces=[];
    var r = rng(13);
    var centers = [[0,0],[5,0],[10,0],[15,0],[0,5],[5,5],[10,5],[15,5],[2.5,10],[12,10]];
    for (var c=0;c<10;c++){
      var xs=[],ys=[];
      for (var i=0;i<60;i++){
        var u=r(), v=r();
        var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
        xs.push(centers[c][0]+1.0*z0);
        ys.push(centers[c][1]+1.0*z1);
      }
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'digit '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'t-SNE of digits dataset (1797 samples, 10 classes)',font:{color:T.text,size:14}},xaxis:{title:'t-SNE 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'t-SNE 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l8-tsne-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // 4. End-to-end pipeline diagram
  var elF = document.getElementById('plot-l8-final-en');
  if (elF){
    var nodes_x = [0, 1.5, 1.5, 3, 3, 4.5, 4.5, 6, 7.5, 9];
    var nodes_y = [2, 3, 1, 3, 1, 3, 1, 2, 2, 2];
    var nodes_text = ['Raw\\nDataFrame','num cols','cat cols','Median\\nimpute','Mode\\nimpute','Standard\\nScale','OneHot\\nEncode','Concat','HistGB\\nClassifier','Predictions'];
    var nodes_color = [T.accent,'#4ecdc4','#f87171','#4ecdc4','#f87171','#4ecdc4','#f87171',T.accent,T.accent,T.accent];
    var ntr = {x:nodes_x,y:nodes_y,mode:'markers+text',type:'scatter',
               marker:{color:nodes_color,size:55,line:{color:'rgba(255,255,255,0.3)',width:1}},
               text:nodes_text,textposition:'middle center',textfont:{color:'#0a0a0a',size:9},
               hoverinfo:'skip',showlegend:false};
    var edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[7,8],[8,9]];
    var ex=[], ey=[];
    for (var i=0;i<edges.length;i++){
      ex.push(nodes_x[edges[i][0]],nodes_x[edges[i][1]],null);
      ey.push(nodes_y[edges[i][0]],nodes_y[edges[i][1]],null);
    }
    var etr = {x:ex,y:ey,mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:2},hoverinfo:'skip',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'End-to-end pipeline as one sklearn object',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-0.7,9.7]},
      yaxis:{visible:false,range:[0.2,3.8]},
      margin:{t:50,r:20,b:30,l:20},
      height:330
    });
    Plotly.newPlot('plot-l8-final-en',[etr,ntr],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elPtr = document.getElementById('plot-l8-pca-tr');
  if (elPtr){
    var r = rng(7);
    var pos_x=[], pos_y=[], neg_x=[], neg_y=[];
    for (var i=0;i<200;i++){
      var u=r(), v=r();
      var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
      pos_x.push(2.5+1.2*z0); pos_y.push(1.0+1.0*z1);
    }
    for (var i=0;i<400;i++){
      var u=r(), v=r();
      var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
      neg_x.push(-1.5+1.5*z0); neg_y.push(-0.5+1.4*z1);
    }
    var t1 = {x:neg_x,y:neg_y,mode:'markers',type:'scatter',name:'benign',marker:{color:'#4ecdc4',size:7,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2 = {x:pos_x,y:pos_y,mode:'markers',type:'scatter',name:'malign',marker:{color:T.accent,size:7,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Meme kanseri PC1, PC2 uzerine projekte',font:{color:T.text,size:14}},xaxis:{title:'PC 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'PC 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l8-pca-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  var elEtr = document.getElementById('plot-l8-explvar-tr');
  if (elEtr){
    var indiv = [0.443,0.190,0.094,0.066,0.055,0.040,0.023,0.016,0.014,0.012,0.010,0.009,0.008,0.005,0.003,0.003,0.002,0.002,0.002,0.002,0.001,0.001,0.001,0.001,0.001,0.0005,0.0003,0.0002,0.0001,0.0001];
    var cum=[]; var s=0; for (var i=0;i<indiv.length;i++){s+=indiv[i];cum.push(s);}
    var pcs=[]; for (var i=1;i<=30;i++) pcs.push(i);
    var t1 = {x:pcs,y:indiv,type:'bar',name:'Bireysel',marker:{color:'rgba(78,205,196,0.6)'}};
    var t2 = {x:pcs,y:cum,mode:'lines+markers',type:'scatter',name:'Kumulatif',line:{color:T.accent,width:3},marker:{size:6}};
    var t3 = {x:[1,30],y:[0.95,0.95],mode:'lines',type:'scatter',line:{color:'#f87171',width:1,dash:'dash'},name:'%95 esik'};
    var layout = Object.assign({}, common, {title:{text:'PCA aciklanmis varyans (30 ozellik)',font:{color:T.text,size:14}},xaxis:{title:'Bilesen numarasi',gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},yaxis:{title:'Aciklanmis varyans orani',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.05]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l8-explvar-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  var elTtr = document.getElementById('plot-l8-tsne-tr');
  if (elTtr){
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6','#fb923c','#22d3ee'];
    var traces=[];
    var r = rng(13);
    var centers = [[0,0],[5,0],[10,0],[15,0],[0,5],[5,5],[10,5],[15,5],[2.5,10],[12,10]];
    for (var c=0;c<10;c++){
      var xs=[],ys=[];
      for (var i=0;i<60;i++){
        var u=r(), v=r();
        var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
        xs.push(centers[c][0]+1.0*z0);
        ys.push(centers[c][1]+1.0*z1);
      }
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'rakam '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'Digits veri setinin t-SNE projeksiyonu',font:{color:T.text,size:14}},xaxis:{title:'t-SNE 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'t-SNE 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l8-tsne-tr',traces,layout,{responsive:true,displayModeBar:false});
  }
  var elFtr = document.getElementById('plot-l8-final-tr');
  if (elFtr){
    var nodes_x = [0, 1.5, 1.5, 3, 3, 4.5, 4.5, 6, 7.5, 9];
    var nodes_y = [2, 3, 1, 3, 1, 3, 1, 2, 2, 2];
    var nodes_text = ['Ham\\nDataFrame','sayisal','kategorik','Median\\nimputer','Mod\\nimputer','Standard\\nScale','OneHot\\nEncode','Birlestir','HistGB\\nSiniflandirici','Tahminler'];
    var nodes_color = [T.accent,'#4ecdc4','#f87171','#4ecdc4','#f87171','#4ecdc4','#f87171',T.accent,T.accent,T.accent];
    var ntr = {x:nodes_x,y:nodes_y,mode:'markers+text',type:'scatter',
               marker:{color:nodes_color,size:55,line:{color:'rgba(255,255,255,0.3)',width:1}},
               text:nodes_text,textposition:'middle center',textfont:{color:'#0a0a0a',size:9},
               hoverinfo:'skip',showlegend:false};
    var edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[7,8],[8,9]];
    var ex=[], ey=[];
    for (var i=0;i<edges.length;i++){
      ex.push(nodes_x[edges[i][0]],nodes_x[edges[i][1]],null);
      ey.push(nodes_y[edges[i][0]],nodes_y[edges[i][1]],null);
    }
    var etr = {x:ex,y:ey,mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:2},hoverinfo:'skip',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'Tek bir sklearn nesnesi olarak uctan uca pipeline',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-0.7,9.7]},
      yaxis:{visible:false,range:[0.2,3.8]},
      margin:{t:50,r:20,b:30,l:20},
      height:330
    });
    Plotly.newPlot('plot-l8-final-tr',[etr,ntr],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Boyut indirgeme yüksek boyutlu veriyi yönetilebilir kılan şeydir.</strong> Veri setinizde 1000 özellik ve 500 örnek olduğunda hiçbir model dürüstçe uyamaz -- başka bir şey yapmadan önce o özellikleri anlamlı 20-50'ye sıkıştırmanız gerekir. PCA iş atı doğrusal yöntemdir, t-SNE görselleştirme için standarttır ve UMAP modern uzlaşmadır. Onlarda ustalaşmak "boyutluluk laneti" altında gömülmek ile yararlı yapı keşfetmek arasındaki farktır.</p>

<p class="l-text">Bu son derste PCA'yi derinlemesine ele alıyoruz (özayrıştırma, açıklanmış varyans, ne zaman kullanılır), görselleştirme için t-SNE ve UMAP'a kısa girişler ve sonra öğrendiğiniz her şeyi birleştiren tek bir uçtan uca pipeline inşa ederek kursu kapatıyoruz: gerçek veri yükle, ön işle, boyut indirge, modelle, ayarla, değerlendir ve tek bir artifact dağıt. Bu kariyerinizin geri kalanında her tablo ML projesinde izlemeniz gereken kanonik sklearn iş akışıdır.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Doğrusal boyut indirgeme ve açıklanan varyans için PCA uygula</li><li>Doğrusal olmayan görselleştirme için t-SNE ve UMAP kullan</li><li>Karışık sayısal/kategorik veri için ColumnTransformer ile uçtan uca Pipeline kur</li><li>Pipeline'ı RandomizedSearchCV ile ayarla</li><li>Eğitilmiş pipeline'ı dağıtım için joblib ile kaydet</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. PCA: Temel Bileşen Analizi</h2>

<p class="l-text">PCA, verinin en çok değiştiği yeni eksenler (temel bileşenler) bulur. İlk bileşen maksimum varyansı yakalar; ikinci birinciye dik olur ve geri kalan en çok varyansı yakalar; vb. Verinizi en üst k bileşene projekte etmek ortalama-kare-hata anlamında optimal doğrusal sıkıştırmadır.</p>

<p class="l-text">Matematiksel olarak PCA kovaryans matrisinin özayrıştırmasıdır:</p>

<div class="katex-block">$$\\Sigma = \\frac{1}{n-1} X^T X = V \\Lambda V^T$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\Sigma$</div><div class="card-body">Merkezlenmiş özelliklerin kovaryans matrisi, şekil (p, p). Tüm ikili özellik korelasyonlarını yakalar.</div></div>
<div class="calc-card"><div class="card-title">$V$</div><div class="card-body">Özvektör matrisi, şekil (p, p). Her sütun bir temel bileşen yönüdür.</div></div>
<div class="calc-card"><div class="card-title">$\\Lambda$</div><div class="card-body">Özdeğerlerin köşegen matrisi. Özdeğer $\\lambda_k$ = k. temel bileşen boyunca varyans.</div></div>
<div class="calc-card"><div class="card-title">Projeksiyon</div><div class="card-body">$X_{\\text{new}} = X V_k$, $V_k$ yalnızca üst k sütunu içerir. Çıktı şekli (n, k).</div></div>
<div class="calc-card"><div class="card-title">Açıklanmış varyans</div><div class="card-body">$\\lambda_k / \\sum_j \\lambda_j$ = bileşen k tarafından açıklanan toplam varyans oranı.</div></div>
<div class="calc-card"><div class="card-title">SVD eşdeğerliği</div><div class="card-body">PCA $X = U S V^T$ ile de hesaplanabilir. sklearn sayısal olarak daha kararlı olduğu için SVD kullanır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> PCA
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
<span class="fn">print</span>(f<span class="str">"Orijinal sekil: {X.shape}"</span>)

<span class="cm"># PCA'den ONCE DAIMA olcekle</span>
Xs = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

pca = <span class="fn">PCA</span>().<span class="fn">fit</span>(Xs)
explained = pca.explained_variance_ratio_
cum = np.<span class="fn">cumsum</span>(explained)
<span class="fn">print</span>(f<span class="str">"PC1 varyansin %{explained[0]*100:.1f}'ini acikliyor"</span>)
<span class="fn">print</span>(f<span class="str">"PC1 + PC2 birlikte %{cum[1]*100:.1f}"</span>)
<span class="fn">print</span>(f<span class="str">"Ilk 5 bilesen %{cum[4]*100:.1f}"</span>)
<span class="fn">print</span>(f<span class="str">"%95 icin {(cum < 0.95).sum() + 1} bilesen gerek"</span>)

<span class="cm"># 2B projeksiyon (gorsellestirme)</span>
pca2 = <span class="fn">PCA</span>(n_components=<span class="num">2</span>)
X_2d = pca2.<span class="fn">fit_transform</span>(Xs)
<span class="fn">print</span>(f<span class="str">"Projeksiyon sekli: {X_2d.shape}"</span>)

<span class="cm"># Sayi yerine varyans belirt</span>
pca_var = <span class="fn">PCA</span>(n_components=<span class="num">0.95</span>)
X_kept = pca_var.<span class="fn">fit_transform</span>(Xs)
<span class="fn">print</span>(f<span class="str">"%95 varyans icin {X_kept.shape[1]} bilesen tutuldu"</span>)

<span class="cm"># Bilesen "yuklemeleri"</span>
<span class="fn">print</span>(<span class="str">"PC1 en cok katki:"</span>)
top = np.<span class="fn">argsort</span>(np.<span class="fn">abs</span>(pca2.components_[<span class="num">0</span>]))[::-<span class="num">1</span>][:<span class="num">5</span>]
<span class="kw">for</span> i <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  {data.feature_names[i]}: {pca2.components_[0, i]:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) 30 özellikli breast-cancer verisini yükler. 2) Özellikleri ölçekler -- PCA için pazarlık edilemez, aksi takdirde gerçek sinyal taşımasa bile en geniş aralığa sahip özellik temel bileşenleri domine eder. 3) <code>n_components</code> argümanı olmadan PCA uydurur; sklearn 30 bileşenin tümünü döndürür. <code>explained_variance_ratio_</code> bileşen başına varyans oranıdır, azalan sırada. 4) Breast-cancer için tek başına PC1 sıklıkla %45 açıklar, PC1+PC2 ~%63, en üst 5 %85, vb. Kümülatif varyans grafiği size kaç bileşene ihtiyacınız olduğunu tam olarak söyler. 5) <code>PCA(n_components=2)</code> görselleştirme için 2B'ye projekte eder; <code>PCA(n_components=0.95)</code> varyansın %95'ini açıklamak için yeterli bileşeni otomatik tutar. 6) <code>pca.components_[0]</code> her orijinal özelliğin PC1 üzerindeki "yüklemesini" verir -- bu size hangi ham özelliklerin ilk temel yöne en hizalı olduğunu söyler.</p>

<div id="plot-l8-pca-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu görselin söylediği:</strong> 569 meme kanseri örneği ilk iki temel bileşene projekte edilmiş, malign (turuncu) vs benign (turkuaz) renklendirilmiş. Projeksiyon oluşturmak için HİÇBİR etiket bilgisi kullanmadığımız hâlde, iki sınıf görsel olarak ayrılır -- bu PCA'nın sihridir: maksimum varyans yönlerini bulur ve sınıflar farklı özellik ortalamalarına sahip olduğunda bu yönler sıklıkla sınıf yapısıyla hizalanır. Bu 2B scatter her yeni yüksek boyutlu veri seti için yapmanız gereken "ilk bakış" grafiğidir.</div>

<div id="plot-l8-explvar-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Kümülatif açıklanmış varyans oranı. Temel bileşenler ekledikçe (x-ekseni), açıklanan toplam varyansın oranı (y-ekseni) tırmanır. Eğri başta diktir (erken bileşenler sinyalin çoğunu yakalar) ve düzleşir (sonraki bileşenler çoğunlukla gürültü yakalar). 0.95'teki yatay çizgi "bilginin %95'ini koru" hedefiniz olsa nerede duracağınızı gösterir; ilgili x değeri PCA boyutunuzdur. Breast-cancer için ~10 bileşen %95'i tutar -- ihmal edilebilir bilgi kaybıyla 3x sıkıştırma.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP TF-IDF boyutluluğu</div><div class="example-body">50.000 kelime hazinesi TF-IDF matrisinin belge başına 50.000 özelliği vardır. Çoğu sıfırdır. TruncatedSVD (seyrek-dostu varyant) yoluyla PCA bunu 100-300 yoğun bileşene sıkıştırır, sınıflandırıcılar ve görselleştirme araçlarının gerçekten yönetebileceği şey budur. Bu kombinasyon -- TF-IDF + TruncatedSVD + LogisticRegression -- nöral embedding'lere geçmeden yenilmesi zor standart NLP baseline'ıdır.</div></div>

<div class="l-warn"><strong>Seyrek veri:</strong> normal <code>PCA</code> veriyi merkezler, bu da seyrekliği yok eder ve belleği patlatır. Seyrek matrisler için (TF-IDF, BoW) yerine <code>TruncatedSVD</code> kullanın -- merkezlemeden SVD yapar ve seyrek-dostu kalır.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. t-SNE ve UMAP: Doğrusal Olmayan Görselleştirme</h2>

<p class="l-text">PCA doğrusaldır -- yalnızca doğrusal projeksiyonlar bulabilir. Eğri bir manifold üzerinde yatan veri için (el yazısı, yüzler, kelime embedding'leri düşünün), doğrusal olmayan yöntemler çok daha zengin yapı ortaya çıkarır. İki önde gelen araç <strong>t-SNE</strong> ve <strong>UMAP</strong>'tır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">t-SNE</div><div class="card-body">Stochastic Neighbor Embedding. Yerel komşuluk yapısını korur. Küme açığa çıkaran görselleştirmeleriyle ünlü.</div></div>
<div class="calc-card"><div class="card-title">UMAP</div><div class="card-body">Uniform Manifold Approximation. t-SNE'den hızlı, daha çok global yapıyı korur, milyonlarca noktaya ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Görselleştirme için</div><div class="card-body">Her ikisi 2B veya 3B embedding üretir; daha çok boyutla neredeyse hiç kullanmazsınız.</div></div>
<div class="calc-card"><div class="card-title">Modelleme için</div><div class="card-body">Kaçının! t-SNE/UMAP çıktıları insan gözü içindir, aşağı akış sınıflandırıcıları için değil. Modelleme için PCA kullanın.</div></div>
<div class="calc-card"><div class="card-title">Stokastik</div><div class="card-body">Her ikisi stokastiktir -- farklı rastgele seed'ler farklı yerleşimler üretir. Yeniden üretilebilirlik için daima random_state ayarlayın.</div></div>
<div class="calc-card"><div class="card-title">Yeni nokta tahmini yok</div><div class="card-body">sklearn'deki t-SNE yeni noktaları dönüştüremez; UMAP yapabilir. Artımlı veri için UMAP'i tercih edin.</div></div>
</div>

<p class="l-text">t-SNE'nin amacı iki dağılım arasındaki Kullback-Leibler uzaklığını minimize etmektir: orijinal uzayda ikili benzerlikler ($p_{ij}$, Gauss-azalma) ve embedding uzayında ($q_{ij}$, t-dağılım azalma):</p>

<div class="katex-block">$$\\text{KL}(P \\| Q) = \\sum_{i \\neq j} p_{ij} \\log \\frac{p_{ij}}{q_{ij}}$$</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.manifold <span class="kw">import</span> TSNE
<span class="kw">from</span> sklearn.decomposition <span class="kw">import</span> PCA
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_digits

digits = <span class="fn">load_digits</span>()
X = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(digits.data)
y = digits.target
<span class="fn">print</span>(f<span class="str">"Orijinal sekil: {X.shape}"</span>)

<span class="cm"># Gurultuyu azaltmak icin once PCA ile indir</span>
X_50 = <span class="fn">PCA</span>(n_components=<span class="num">50</span>, random_state=<span class="num">0</span>).<span class="fn">fit_transform</span>(X)

tsne = <span class="fn">TSNE</span>(n_components=<span class="num">2</span>, perplexity=<span class="num">30</span>, learning_rate=<span class="str">"auto"</span>,
            init=<span class="str">"pca"</span>, random_state=<span class="num">0</span>)
X_2d = tsne.<span class="fn">fit_transform</span>(X_50)
<span class="fn">print</span>(f<span class="str">"t-SNE cikti sekli: {X_2d.shape}"</span>)

<span class="cm"># UMAP (umap-learn kurulu olmali)</span>
<span class="cm"># from umap import UMAP</span>
<span class="cm"># X_umap = UMAP(n_components=2, n_neighbors=15, min_dist=0.1, random_state=0).fit_transform(X_50)</span></code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Digits veri setini yükler (1797 örnek, 64 özellik, 10 sınıf). 2) <strong>t-SNE'den önce daima PCA ile ön-indirin</strong> -- bu standart hiledir, veriyi gürültüsüzleştirir ve t-SNE'yi çok daha hızlı yapar (varyansın çoğu zaten ilk 50 PC'de). 3) <code>perplexity=30</code> en önemli t-SNE hiperparametresidir; etkili komşuluk boyutunu kontrol eder. Daha küçük (5-15) küçük kümeleri ortaya çıkarır; daha büyük (50-100) global yapıyı ortaya çıkarır. 4) <code>init="pca"</code> kararlılık ve yeniden üretilebilirlik için PCA ilklendirme kullanır. 5) <code>learning_rate="auto"</code> modern "Belkina ve diğerleri" sezgiselini kullanır ve sıklıkla başarısız olan eski varsayılandan kaçınır. 6) UMAP ruh olarak benzerdir ama daha ilkesel topolojik temele sahiptir ve çok daha hızlıdır -- büyük veri setleri için standart modern seçimdir.</p>

<div id="plot-l8-tsne-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafikte:</strong> 64 boyutlu digits veri setinin 2B'ye t-SNE projeksiyonu. Her nokta etiketine göre renklendirilmiş bir el yazısı rakamdır (0-9). Projeksiyonu hesaplamak için HİÇBİR etiket bilgisi kullanmadığımız hâlde tüm 10 rakam sınıfının nasıl belirgin, görsel olarak ayrılmış kümeler oluşturduğuna dikkat edin -- t-SNE örtük sınıf yapısını saf özellik benzerliğinden kurtardı. Bu doğrusal olmayan boyut indirgemenin kanonik "vay canına" demosudur. Metin embedding'leri analizi için, konuya göre renklendirilmiş BERT embedding'lerinin benzer t-SNE grafiği "bakın embedding'lerimiz ne kadar iyi çalışıyor" standart şeklidir.</div>

<div class="calc-step"><strong>Pipeline kuralı:</strong> görselleştirme için PCA ön-indirme sonrası t-SNE/UMAP kullanın. Modelleme için asla t-SNE çıktısını sınıflandırıcıya beslemeyin -- global geometriyi koruyan PCA (veya seyrek veri için TruncatedSVD) kullanın.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Uçtan Uca Proje: Adult Census Geliri</h2>

<p class="l-text">Her şeyi birleştirme zamanı. Gerçek dünya bir veri seti yükleyeceğiz (UCI Adult Census), bu kurstan her en iyi uygulamayı izleyen tam ön işleme + modelleme + ayarlama + değerlendirme pipeline'ı inşa edeceğiz ve tek dağıtılabilir bir artifact üreteceğiz.</p>

<p class="l-text">Görev: demografik özelliklerden gelirin >$50k olup olmadığını tahmin etmek. 14 özellik, karışık sayısal ve kategorik, ~32 bin örnek, ~%24 pozitif sınıf.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_openml
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, StratifiedKFold, RandomizedSearchCV
<span class="kw">from</span> sklearn.compose <span class="kw">import</span> ColumnTransformer, make_column_selector
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler, OneHotEncoder
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> HistGradientBoostingClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> (classification_report, roc_auc_score,
                             average_precision_score, confusion_matrix)
<span class="kw">from</span> scipy.stats <span class="kw">import</span> loguniform, randint

<span class="cm"># 1. Gercek veriyi yukle</span>
adult = <span class="fn">fetch_openml</span>(<span class="str">"adult"</span>, version=<span class="num">2</span>, as_frame=<span class="kw">True</span>, parser=<span class="str">"auto"</span>)
X, y_str = adult.data, adult.target
y = (y_str == <span class="str">">50K"</span>).<span class="fn">astype</span>(<span class="ty">int</span>)
<span class="fn">print</span>(f<span class="str">"Sekil: {X.shape}, pozitif sinif: %{y.mean()*100:.1f}"</span>)
<span class="fn">print</span>(X.dtypes.<span class="fn">value_counts</span>())

<span class="cm"># 2. Son test setini ayir</span>
X_dev, X_test, y_dev, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.20</span>, stratify=y, random_state=<span class="num">42</span>
)
<span class="fn">print</span>(f<span class="str">"Dev: {len(X_dev)}, Test: {len(X_test)}"</span>)</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>fetch_openml("adult", version=2)</code> Adult Census veri setini indirir; OpenML birçok UCI veri setini yansıtır ve onları DataFrame-dostu verir. 2) Dize hedefi ("&lt;=50K" / "&gt;50K") ikili tam sayıya çevirir; sınıf dengesini hesaplar (~%24 pozitif). 3) Son sona kadar dokunmayacağımız test verisini ayıran stratify edilmiş 80/20 bölme. 4) Dtype'ları yazdırın -- int64 (yaş, çalışma saati gibi sayısal özellikler) ve category (meslek, ülke, vb.) karışımı göreceksiniz. ColumnTransformer'ı elzem yapan tür karışık veri seti budur.</p>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Ön İşleme Pipeline'ını Kurma</h2>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># 3. Dtype seciciler kullanarak on isleme pipeline'i kur</span>
numeric_pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"imp"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)),
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
])
categ_pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"imp"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"most_frequent"</span>)),
    (<span class="str">"ohe"</span>, <span class="fn">OneHotEncoder</span>(handle_unknown=<span class="str">"ignore"</span>, sparse_output=<span class="kw">False</span>)),
])

preprocess = <span class="fn">ColumnTransformer</span>([
    (<span class="str">"num"</span>, numeric_pipe, <span class="fn">make_column_selector</span>(dtype_include=np.number)),
    (<span class="str">"cat"</span>, categ_pipe,   <span class="fn">make_column_selector</span>(dtype_include=<span class="str">"category"</span>)),
])

<span class="cm"># 4. Modeli sar</span>
pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"prep"</span>, preprocess),
    (<span class="str">"clf"</span>,  <span class="fn">HistGradientBoostingClassifier</span>(random_state=<span class="num">0</span>)),
])

pipe.<span class="fn">fit</span>(X_dev, y_dev)
<span class="fn">print</span>(f<span class="str">"Baseline AUC: {roc_auc_score(y_test, pipe.predict_proba(X_test)[:, 1]):.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) İki pipeline dalı tanımlar. Sayısal dal medyanla doldurur sonra standart-ölçekler; kategorik dal modla doldurur sonra one-hot kodlar. 2) <code>make_column_selector</code> ile <code>ColumnTransformer</code> dtype'a göre sütunları doğru dala otomatik yönlendirir -- sütunları elle listelemeye gerek yok. 3) Tüm ön işleyiciyi başka bir Pipeline içinde HistGradientBoostingClassifier ile sarar. Tam nesne artık tek bir fit/predict çağrısında doldurma, ölçekleme, kodlama ve sınıflandırma yapar. 4) Baseline fit elzemdir: hiperparametre aramada bir saat geçirmeden önce pipeline'ın doğru kablolu olduğunu doğrular. Adult Census'ta varsayılan HistGB kutudan çıkar çıkmaz ~0.93 AUC vermelidir.</p>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Ayarlama, Değerlendirme ve Kaydetme</h2>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># 5. Tum pipeline uzerinde RandomizedSearchCV</span>
param_dist = {
    <span class="str">"clf__learning_rate"</span>:     <span class="fn">loguniform</span>(<span class="num">0.01</span>, <span class="num">0.3</span>),
    <span class="str">"clf__max_iter"</span>:          <span class="fn">randint</span>(<span class="num">200</span>, <span class="num">800</span>),
    <span class="str">"clf__max_depth"</span>:         <span class="fn">randint</span>(<span class="num">3</span>, <span class="num">12</span>),
    <span class="str">"clf__min_samples_leaf"</span>:  <span class="fn">randint</span>(<span class="num">10</span>, <span class="num">100</span>),
    <span class="str">"clf__l2_regularization"</span>: <span class="fn">loguniform</span>(<span class="num">1e-4</span>, <span class="num">1.0</span>),
}

cv = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)
search = <span class="fn">RandomizedSearchCV</span>(
    pipe, param_dist, n_iter=<span class="num">60</span>, cv=cv,
    scoring=<span class="str">"roc_auc"</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">42</span>, refit=<span class="kw">True</span>, verbose=<span class="num">1</span>
)
search.<span class="fn">fit</span>(X_dev, y_dev)
<span class="fn">print</span>(f<span class="str">"En iyi CV AUC: {search.best_score_:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"En iyi: {search.best_params_}"</span>)

<span class="cm"># 6. Son test degerlendirmesi -- BIR KEZ</span>
final_model = search.best_estimator_
y_pred  = final_model.<span class="fn">predict</span>(X_test)
y_proba = final_model.<span class="fn">predict_proba</span>(X_test)[:, <span class="num">1</span>]

<span class="fn">print</span>(<span class="str">"\\n=== AYRILAN TEST PERFORMANSI ==="</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred, target_names=[<span class="str">"<=50K"</span>, <span class="str">">50K"</span>]))
<span class="fn">print</span>(f<span class="str">"ROC AUC : {roc_auc_score(y_test, y_proba):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"PR  AUC : {average_precision_score(y_test, y_proba):.4f}"</span>)
<span class="fn">print</span>(<span class="str">"Karisiklik matrisi:"</span>)
<span class="fn">print</span>(<span class="fn">confusion_matrix</span>(y_test, y_pred))

<span class="cm"># 7. Tum pipeline'i kaydet</span>
<span class="kw">import</span> joblib
joblib.<span class="fn">dump</span>(final_model, <span class="str">"adult_income_pipeline.pkl"</span>)
<span class="cm"># Sonra: model = joblib.load("adult_income_pipeline.pkl")</span>
<span class="cm"># model.predict_proba(new_dataframe)</span></code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Log-uniform ve uniform-tamsayı dağılımları kullanan 5 boyutlu bir hiperparametre arama uzayı tanımlar. <code>clf__</code> çift alt çizgi öneki pipeline içindeki sınıflandırıcıyı hedefler. 2) 60 iterasyon ve 5-fold stratify edilmiş CV ile <code>RandomizedSearchCV</code> uzayı keşfeder; Adult Census'ta bu 4 çekirdekli bir laptop'ta birkaç dakika sürer. <code>n_jobs=-1</code> CPU çekirdekleri arasında paralelleştirir. 3) En iyi CV AUC'sini ve kazanan hiperparametreleri raporlar. 4) Ayrılan test setinde tek değerlendirme tezinizdeki bölüme veya ürün spesifikasyonuna giren sayıları üretir. 5) Sınıflandırma raporu sınıf başına precision/recall/F1 gösterir; ROC-AUC ve PR-AUC sıralama kalitesini özetler; karışıklık matrisi hata yapısını söyler. 6) <code>joblib.dump</code> tüm uydurulmuş Pipeline'ı -- ön işleyici dahil -- tek bir dosyaya serileştirir. <code>joblib.load</code> tahmin için hazır geri getirir. Üretime gönderdiğiniz dağıtılabilir artifact budur.</p>

<div id="plot-l8-final-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu görselin söylediği:</strong> Uçtan uca pipeline bir akış diyagramı olarak -- soldaki ham DataFrame ColumnTransformer'a (sayısal ve kategorik dallar) akar, her dal doldurma + kendi ön işlemesini çalıştırır, çıktılar birleşir, gradient boosting sınıflandırıcısını besler ve sağda tahminler üretir. Tüm grafik pickle edebileceğiniz, sürümleyebileceğiniz, dağıtabileceğiniz ve yeniden yükleyebileceğiniz tek bir sklearn nesnesidir. Bu tek-artifact disiplini üretim ML'in talep ettiği şeydir; ayrı scaler dosyaları yok, çıkarım zamanında ön işleme aksiliği yok, sürüm uyumsuzluğu yok. Bu deseni öğrenin ve gerçek ML sistemleri göndermeye hazırsınız.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Kaydet: joblib.dump</div><div class="card-body">Pipeline'lar dahil herhangi bir uydurulmuş sklearn nesnesini serileştirir. Oturumlar arası uyumlu.</div></div>
<div class="calc-card"><div class="card-title">Yükle: joblib.load</div><div class="card-body">Öğrenilen parametreler dahil tam durumu geri yükler. Hemen <code>.predict</code>'e hazır.</div></div>
<div class="calc-card"><div class="card-title">pickle alternatifi</div><div class="card-body">Standart kütüphane, çalışır ama joblib NumPy dizileri için optimize edilmiştir (daha hızlı, daha küçük dosyalar).</div></div>
<div class="calc-card"><div class="card-title">Uyumluluk</div><div class="card-body">Python sürümleri ve sklearn minor sürümleri arası çalışır. Major sürüm sıçramaları kırabilir -- bağımlılıklarınızı sabitleyin.</div></div>
<div class="calc-card"><div class="card-title">Güvenlik</div><div class="card-body">Güvenilmeyen kaynaklardan asla pickle/joblib dosyası yüklemeyin -- yüklerken keyfi kod çalıştırabilirler.</div></div>
<div class="calc-card"><div class="card-title">Üretim alternatifleri</div><div class="card-body">Diller arası servis ve yeniden üretilebilirlik takibi için ONNX, BentoML, MLflow.</div></div>
</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Kurs Özeti ve Sonraki Adımlar</h2>

<p class="l-text">Tüm scikit-learn iş tezgahını yürüdünüz -- veri yüklemekten eğitilmiş bir pipeline göndermeye. İşte şimdi bildiklerinizin zihinsel haritası.</p>

<div class="calc-step"><strong>Ders 1: Estimator API</strong> -- fit/predict/transform her algoritmanın arkasındaki birleştirici sözleşmedir.</div>
<div class="calc-step"><strong>Ders 2: Ön İşleme & Pipeline'lar</strong> -- ölçekleme, kodlama, doldurma ve her şeyi sızıntısız bir Pipeline'da zincirleme.</div>
<div class="calc-step"><strong>Ders 3: Doğrusal Modeller</strong> -- OLS, Ridge, Lasso, ElasticNet ve Lojistik Regresyon -- iş atları ve baseline'lar.</div>
<div class="calc-step"><strong>Ders 4: Ağaç Tabanlı Modeller</strong> -- karar ağaçları, random forest'lar, gradient boosting -- tablo verisinde kazananlar.</div>
<div class="calc-step"><strong>Ders 5: Doğrulama</strong> -- KFold, GridSearchCV, RandomizedSearchCV, öğrenme eğrileri -- raporladığınız sayıları savunma.</div>
<div class="calc-step"><strong>Ders 6: Sınıflandırma Metrikleri</strong> -- precision/recall/F1, ROC-AUC, PR-AUC, kalibrasyon -- doğru iş için doğru sayılar.</div>
<div class="calc-step"><strong>Ders 7: Regresyon Metrikleri & Kümeleme</strong> -- MSE/RMSE/MAE/R-kare, KMeans, DBSCAN, hiyerarşik -- denetimlinin geri kalanı ve denetimsizin başlangıcı.</div>
<div class="calc-step"><strong>Ders 8 (bu): Boyut İndirgeme & Uçtan Uca</strong> -- PCA, t-SNE, UMAP ve kanonik pipeline deseni.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">sklearn ötesi (derin)</div><div class="card-body">Transformer'lar için PyTorch + HuggingFace; eğitim döngüleri için Lightning.</div></div>
<div class="calc-card"><div class="card-title">sklearn ötesi (boost)</div><div class="card-body">XGBoost, LightGBM, CatBoost -- aynı API, daha hızlı ve biraz daha doğru.</div></div>
<div class="calc-card"><div class="card-title">sklearn ötesi (autoML)</div><div class="card-body">Gelişmiş hiperparametre arama için Optuna; uçtan uca otomasyon için auto-sklearn veya FLAML gibi AutoML kütüphaneleri.</div></div>
<div class="calc-card"><div class="card-title">sklearn ötesi (yorum)</div><div class="card-body">Açıklama için SHAP, LIME, ELI5; permutation_importance sklearn.inspection'da.</div></div>
<div class="calc-card"><div class="card-title">sklearn ötesi (dağıt)</div><div class="card-body">İnce servis katmanı için FastAPI; deney izleme için MLflow veya DVC; çapraz platform çıkarım için ONNX.</div></div>
<div class="calc-card"><div class="card-title">sklearn ötesi (NLP)</div><div class="card-body">Geleneksel NLP için spaCy; en son modeller için HuggingFace transformer'ları. Her ikisi de sklearn ile baseline'lar için iyi birleşir.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: üretim kalitesinde NLP sınıflandırıcı dağıtımı</div><div class="example-body">Duygu analizi projeniz için dağıtılabilir artifact tek bir Pipeline'dır: <code>TfidfVectorizer + TruncatedSVD + LogisticRegression</code>, hepsi sarılı, 5x5 nested CV ile hiperparametre ayarlanmış, ayrılan test setinde ROC-AUC + PR-AUC + F1 ile değerlendirilmiş ve joblib yoluyla serileştirilmiş. Aynı desen -- TF-IDF yerine özellik çıkarıcı olarak HuggingFace embedding'leri ile -- size rekabetçi bir transformer baseline'ı verir. ML olgunluğu tamamen aynıdır; tek fark özelliklerinizin hash'lenmiş n-gram sözlüğünden mi yoksa 768 boyutlu BERT embedding'inden mi geldiğidir.</div></div>

<div class="think-box"><div class="think-label">SON ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> sklearn'in değeri ~200 algoritma boyunca birleşik <code>fit/predict/transform/score</code> API'sidir.<br><strong>2.</strong> Daima ön işleme + modellemeyi bir Pipeline'a sarın. Karışık tipli veri için daima ColumnTransformer kullanın.<br><strong>3.</strong> Daima verinizi önce bölün, sonra dönüştürücüleri yalnızca eğitimde uydurun. Pipeline'lar + çapraz doğrulama bunu otomatik yapar.<br><strong>4.</strong> Doğru metrik probleminize bağlıdır: sıralama için ROC-AUC, eşiklenmiş performans için F1, regresyon için RMSE/MAE. Eğitimden önce seçin, sonra değil.<br><strong>5.</strong> "İlk denemede çalışsın istiyorum" için random forest; "son %1-3 doğruluk istiyorum" için gradient boosting; her şey için baseline olarak lojistik regresyon.<br><strong>6.</strong> Çapraz doğrulama içinde RandomizedSearchCV (veya Optuna) ile hiperparametre ayarlayın, asla test setinde değil.<br><strong>7.</strong> Yüksek boyutlu veride kümeleme veya görselleştirmeden önce PCA; son 2B grafik için t-SNE/UMAP.<br><strong>8.</strong> Tüm uydurulmuş pipeline'ı tek bir joblib dosyası olarak kaydedin -- dağıtılabilir birim odur.<br><strong>9.</strong> Aşağı akış kararları olasılıklara bağlı olduğunda olasılıkları kalibre edin. Regresyondan sonra daima artıkları çizin ve sınıflandırmadan sonra karışıklık matrislerini.<br><strong>10.</strong> sklearn klasik ML'in ~%95'ini kapsar; kalan %5 (derin öğrenme, ölçekte NLP, autoML) için sklearn'i PyTorch, HuggingFace, Optuna vb. ile birleştirirsiniz.</div></div>

<p class="l-text">Şimdi tam sklearn beceri setine sahipsiniz. Desen -- yükle, böl, pipeline, ayarla, doğrula, değerlendir, kaydet -- duygu analizi, dolandırıcılık tespiti, satış tahmini, churn tahmini, müşteri segmentasyonu, öneri ve karşılaşacağınız diğer her tablo ML probleminin %90'ı için çalışır. Gerçek veri üzerinde uygulayın, raporu yazın, modeli gönderin. Kütüphane bekliyordu.</p>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg:'rgba(0,0,0,0)',
    text:getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent:getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid:'rgba(255,255,255,0.06)',
    zero:'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};
  function rng(s){return function(){s=(s*9301+49297)%233280;return s/233280;};}

  // 1. PCA scatter (synthetic two-class)
  var elP = document.getElementById('plot-l8-pca-en');
  if (elP){
    var r = rng(7);
    var pos_x=[], pos_y=[], neg_x=[], neg_y=[];
    for (var i=0;i<200;i++){
      var u=r(), v=r();
      var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
      pos_x.push(2.5+1.2*z0); pos_y.push(1.0+1.0*z1);
    }
    for (var i=0;i<400;i++){
      var u=r(), v=r();
      var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
      neg_x.push(-1.5+1.5*z0); neg_y.push(-0.5+1.4*z1);
    }
    var t1 = {x:neg_x,y:neg_y,mode:'markers',type:'scatter',name:'benign',marker:{color:'#4ecdc4',size:7,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2 = {x:pos_x,y:pos_y,mode:'markers',type:'scatter',name:'malignant',marker:{color:T.accent,size:7,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Breast cancer projected onto PC1, PC2',font:{color:T.text,size:14}},xaxis:{title:'PC 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'PC 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l8-pca-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 2. Cumulative explained variance
  var elE = document.getElementById('plot-l8-explvar-en');
  if (elE){
    var indiv = [0.443,0.190,0.094,0.066,0.055,0.040,0.023,0.016,0.014,0.012,0.010,0.009,0.008,0.005,0.003,0.003,0.002,0.002,0.002,0.002,0.001,0.001,0.001,0.001,0.001,0.0005,0.0003,0.0002,0.0001,0.0001];
    var cum=[]; var s=0; for (var i=0;i<indiv.length;i++){s+=indiv[i];cum.push(s);}
    var pcs=[]; for (var i=1;i<=30;i++) pcs.push(i);
    var t1 = {x:pcs,y:indiv,type:'bar',name:'Individual',marker:{color:'rgba(78,205,196,0.6)'}};
    var t2 = {x:pcs,y:cum,mode:'lines+markers',type:'scatter',name:'Cumulative',line:{color:T.accent,width:3},marker:{size:6}};
    var t3 = {x:[1,30],y:[0.95,0.95],mode:'lines',type:'scatter',line:{color:'#f87171',width:1,dash:'dash'},name:'95% threshold'};
    var layout = Object.assign({}, common, {title:{text:'PCA explained variance per component (30 features)',font:{color:T.text,size:14}},xaxis:{title:'Component number',gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},yaxis:{title:'Explained variance ratio',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.05]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l8-explvar-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  // 3. t-SNE on digits (10 visible clusters, synthetic)
  var elT = document.getElementById('plot-l8-tsne-en');
  if (elT){
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6','#fb923c','#22d3ee'];
    var traces=[];
    var r = rng(13);
    var centers = [[0,0],[5,0],[10,0],[15,0],[0,5],[5,5],[10,5],[15,5],[2.5,10],[12,10]];
    for (var c=0;c<10;c++){
      var xs=[],ys=[];
      for (var i=0;i<60;i++){
        var u=r(), v=r();
        var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
        xs.push(centers[c][0]+1.0*z0);
        ys.push(centers[c][1]+1.0*z1);
      }
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'digit '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'t-SNE of digits dataset (1797 samples, 10 classes)',font:{color:T.text,size:14}},xaxis:{title:'t-SNE 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'t-SNE 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l8-tsne-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // 4. End-to-end pipeline diagram
  var elF = document.getElementById('plot-l8-final-en');
  if (elF){
    var nodes_x = [0, 1.5, 1.5, 3, 3, 4.5, 4.5, 6, 7.5, 9];
    var nodes_y = [2, 3, 1, 3, 1, 3, 1, 2, 2, 2];
    var nodes_text = ['Raw\\nDataFrame','num cols','cat cols','Median\\nimpute','Mode\\nimpute','Standard\\nScale','OneHot\\nEncode','Concat','HistGB\\nClassifier','Predictions'];
    var nodes_color = [T.accent,'#4ecdc4','#f87171','#4ecdc4','#f87171','#4ecdc4','#f87171',T.accent,T.accent,T.accent];
    var ntr = {x:nodes_x,y:nodes_y,mode:'markers+text',type:'scatter',
               marker:{color:nodes_color,size:55,line:{color:'rgba(255,255,255,0.3)',width:1}},
               text:nodes_text,textposition:'middle center',textfont:{color:'#0a0a0a',size:9},
               hoverinfo:'skip',showlegend:false};
    var edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[7,8],[8,9]];
    var ex=[], ey=[];
    for (var i=0;i<edges.length;i++){
      ex.push(nodes_x[edges[i][0]],nodes_x[edges[i][1]],null);
      ey.push(nodes_y[edges[i][0]],nodes_y[edges[i][1]],null);
    }
    var etr = {x:ex,y:ey,mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:2},hoverinfo:'skip',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'End-to-end pipeline as one sklearn object',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-0.7,9.7]},
      yaxis:{visible:false,range:[0.2,3.8]},
      margin:{t:50,r:20,b:30,l:20},
      height:330
    });
    Plotly.newPlot('plot-l8-final-en',[etr,ntr],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elPtr = document.getElementById('plot-l8-pca-tr');
  if (elPtr){
    var r = rng(7);
    var pos_x=[], pos_y=[], neg_x=[], neg_y=[];
    for (var i=0;i<200;i++){
      var u=r(), v=r();
      var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
      pos_x.push(2.5+1.2*z0); pos_y.push(1.0+1.0*z1);
    }
    for (var i=0;i<400;i++){
      var u=r(), v=r();
      var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
      neg_x.push(-1.5+1.5*z0); neg_y.push(-0.5+1.4*z1);
    }
    var t1 = {x:neg_x,y:neg_y,mode:'markers',type:'scatter',name:'benign',marker:{color:'#4ecdc4',size:7,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2 = {x:pos_x,y:pos_y,mode:'markers',type:'scatter',name:'malign',marker:{color:T.accent,size:7,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Meme kanseri PC1, PC2 uzerine projekte',font:{color:T.text,size:14}},xaxis:{title:'PC 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'PC 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l8-pca-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  var elEtr = document.getElementById('plot-l8-explvar-tr');
  if (elEtr){
    var indiv = [0.443,0.190,0.094,0.066,0.055,0.040,0.023,0.016,0.014,0.012,0.010,0.009,0.008,0.005,0.003,0.003,0.002,0.002,0.002,0.002,0.001,0.001,0.001,0.001,0.001,0.0005,0.0003,0.0002,0.0001,0.0001];
    var cum=[]; var s=0; for (var i=0;i<indiv.length;i++){s+=indiv[i];cum.push(s);}
    var pcs=[]; for (var i=1;i<=30;i++) pcs.push(i);
    var t1 = {x:pcs,y:indiv,type:'bar',name:'Bireysel',marker:{color:'rgba(78,205,196,0.6)'}};
    var t2 = {x:pcs,y:cum,mode:'lines+markers',type:'scatter',name:'Kumulatif',line:{color:T.accent,width:3},marker:{size:6}};
    var t3 = {x:[1,30],y:[0.95,0.95],mode:'lines',type:'scatter',line:{color:'#f87171',width:1,dash:'dash'},name:'%95 esik'};
    var layout = Object.assign({}, common, {title:{text:'PCA aciklanmis varyans (30 ozellik)',font:{color:T.text,size:14}},xaxis:{title:'Bilesen numarasi',gridcolor:T.grid,zerolinecolor:T.zero,dtick:2},yaxis:{title:'Aciklanmis varyans orani',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1.05]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l8-explvar-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  var elTtr = document.getElementById('plot-l8-tsne-tr');
  if (elTtr){
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6','#fb923c','#22d3ee'];
    var traces=[];
    var r = rng(13);
    var centers = [[0,0],[5,0],[10,0],[15,0],[0,5],[5,5],[10,5],[15,5],[2.5,10],[12,10]];
    for (var c=0;c<10;c++){
      var xs=[],ys=[];
      for (var i=0;i<60;i++){
        var u=r(), v=r();
        var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
        xs.push(centers[c][0]+1.0*z0);
        ys.push(centers[c][1]+1.0*z1);
      }
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'rakam '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'Digits veri setinin t-SNE projeksiyonu',font:{color:T.text,size:14}},xaxis:{title:'t-SNE 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'t-SNE 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l8-tsne-tr',traces,layout,{responsive:true,displayModeBar:false});
  }
  var elFtr = document.getElementById('plot-l8-final-tr');
  if (elFtr){
    var nodes_x = [0, 1.5, 1.5, 3, 3, 4.5, 4.5, 6, 7.5, 9];
    var nodes_y = [2, 3, 1, 3, 1, 3, 1, 2, 2, 2];
    var nodes_text = ['Ham\\nDataFrame','sayisal','kategorik','Median\\nimputer','Mod\\nimputer','Standard\\nScale','OneHot\\nEncode','Birlestir','HistGB\\nSiniflandirici','Tahminler'];
    var nodes_color = [T.accent,'#4ecdc4','#f87171','#4ecdc4','#f87171','#4ecdc4','#f87171',T.accent,T.accent,T.accent];
    var ntr = {x:nodes_x,y:nodes_y,mode:'markers+text',type:'scatter',
               marker:{color:nodes_color,size:55,line:{color:'rgba(255,255,255,0.3)',width:1}},
               text:nodes_text,textposition:'middle center',textfont:{color:'#0a0a0a',size:9},
               hoverinfo:'skip',showlegend:false};
    var edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[7,8],[8,9]];
    var ex=[], ey=[];
    for (var i=0;i<edges.length;i++){
      ex.push(nodes_x[edges[i][0]],nodes_x[edges[i][1]],null);
      ey.push(nodes_y[edges[i][0]],nodes_y[edges[i][1]],null);
    }
    var etr = {x:ex,y:ey,mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:2},hoverinfo:'skip',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'Tek bir sklearn nesnesi olarak uctan uca pipeline',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-0.7,9.7]},
      yaxis:{visible:false,range:[0.2,3.8]},
      margin:{t:50,r:20,b:30,l:20},
      height:330
    });
    Plotly.newPlot('plot-l8-final-tr',[etr,ntr],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
