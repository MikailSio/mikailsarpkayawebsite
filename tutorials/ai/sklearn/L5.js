window.SKLEARN_L5 = {

en: `<p class="l-text"><strong>Cross-validation is the difference between honest ML and self-deception.</strong> Almost every "0.95 accuracy" you see in beginner notebooks is the result of evaluating on the same data the model trained on or splitting incorrectly. The price you pay for getting validation wrong is reporting numbers that vanish in production -- the single most common cause of failed ML projects.</p>

<p class="l-text">In this lesson we cover the full toolkit for model selection: the train/validation/test paradigm, KFold and StratifiedKFold cross-validation, GridSearchCV and RandomizedSearchCV for hyperparameter tuning, learning curves and validation curves for diagnosing under/overfitting, and a brief introduction to nested CV. By the end you will be able to defend any number you report on a thesis or in a deployment plan.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Split data into train/val/test correctly</li><li>Use KFold and StratifiedKFold for cross-validation</li><li>Run GridSearchCV with Pipeline (avoid leakage)</li><li>Use RandomizedSearchCV for large hyperparameter spaces</li><li>Read learning curves vs validation curves to diagnose under/overfit</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Train, Validation, and Test Sets</h2>

<p class="l-text">The mistake that haunts every ML beginner: using the test set during model selection. The fix is the three-way split.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Train (60-80%)</div><div class="card-body">Used to fit the model parameters (coefficients, tree splits, weights).</div></div>
<div class="calc-card"><div class="card-title">Validation (10-20%)</div><div class="card-body">Used to choose hyperparameters (C, max_depth, learning_rate). Touched many times.</div></div>
<div class="calc-card"><div class="card-title">Test (10-20%)</div><div class="card-body">Used ONCE at the end to report final performance. Never feed back into model decisions.</div></div>
<div class="calc-card"><div class="card-title">Why three?</div><div class="card-body">If you tune on the test set, you are fitting hyperparameters to that specific noise -- you cannot trust the number anymore.</div></div>
<div class="calc-card"><div class="card-title">Cross-validation alternative</div><div class="card-body">Use train+validation as one folded pool, and reserve test set; CV replaces the validation step.</div></div>
<div class="calc-card"><div class="card-title">Stratified</div><div class="card-body">For classification, all splits should preserve class balance via <code>stratify=y</code> (or StratifiedKFold).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

<span class="cm"># Two-step split: 70 / 15 / 15</span>
X_temp, X_test, y_temp, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.15</span>, random_state=<span class="num">42</span>, stratify=y
)
X_train, X_val, y_train, y_val = <span class="fn">train_test_split</span>(
    X_temp, y_temp, test_size=<span class="num">0.176</span>,    <span class="cm"># 0.176 * 0.85 ~ 0.15</span>
    random_state=<span class="num">42</span>, stratify=y_temp
)
<span class="fn">print</span>(f<span class="str">"Train: {len(X_train)}  Val: {len(X_val)}  Test: {len(X_test)}"</span>)
<span class="fn">print</span>(f<span class="str">"Train classes: {dict(zip(*np.unique(y_train, return_counts=True)))}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads breast-cancer (binary classification). 2) First split takes out 15% as the final test set. 3) Second split divides the remaining 85% into 70%/15% (which becomes 70%/15%/15% overall). 4) Both splits use <code>stratify=</code> on the labels so each split keeps the original positive/negative ratio -- crucial for imbalanced data. 5) The output verifies the proportions and that class balance is preserved. In practice you rarely do exact 70/15/15 -- 80/10/10 or simply 80/20 with cross-validation on the 80% are also common.</p>

<div class="l-warn"><strong>The validation set is not free.</strong> Every time you compare two hyperparameter configurations using validation accuracy, you "burn" a tiny amount of validation independence. After dozens of comparisons, you have implicitly fit hyperparameters to noise. The professional fix is <em>nested</em> cross-validation (Section 6) -- but for a thesis baseline, a held-out test set used once is sufficient.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. K-Fold Cross-Validation</h2>

<p class="l-text">Instead of one fixed train/validation split, K-fold CV splits the training data into K equal-sized folds, trains on K-1 of them, evaluates on the remaining one, and rotates K times. The reported score is the mean (and std) of the K validation scores. This uses every sample for both training and evaluation, just never at the same time.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">KFold</div><div class="card-body">Plain K-fold for regression. Splits sequentially or shuffled. Default K=5 is fine for most problems.</div></div>
<div class="calc-card"><div class="card-title">StratifiedKFold</div><div class="card-body">For classification: each fold preserves class proportions. Default in <code>cross_val_score</code> for classifiers.</div></div>
<div class="calc-card"><div class="card-title">GroupKFold</div><div class="card-body">When samples have group structure (multiple rows per patient, multiple sentences per author). All rows from one group go to the same fold.</div></div>
<div class="calc-card"><div class="card-title">TimeSeriesSplit</div><div class="card-body">Train always uses earlier data than validation. For forecasting -- never shuffle time series!</div></div>
<div class="calc-card"><div class="card-title">RepeatedKFold</div><div class="card-body">Run K-fold multiple times with different shuffles. Reduces variance of the CV estimate.</div></div>
<div class="calc-card"><div class="card-title">LeaveOneOut</div><div class="card-body">K = N. Maximum coverage but expensive (N model fits). Used only for tiny datasets.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> (KFold, StratifiedKFold, cross_val_score,
                                     cross_validate, cross_val_predict)
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
pipe = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                 (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>))])

<span class="cm"># Simplest: cross_val_score returns one number per fold</span>
scores = <span class="fn">cross_val_score</span>(pipe, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"roc_auc"</span>)
<span class="fn">print</span>(f<span class="str">"5-fold ROC AUC: {scores.mean():.4f} +/- {scores.std():.4f}"</span>)
<span class="cm"># 5-fold ROC AUC: 0.9930 +/- 0.0042</span>

<span class="cm"># Manual control: StratifiedKFold object</span>
skf = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)
fold_scores = []
<span class="kw">for</span> fold, (train_idx, val_idx) <span class="kw">in</span> <span class="fn">enumerate</span>(skf.<span class="fn">split</span>(X, y)):
    pipe.<span class="fn">fit</span>(X[train_idx], y[train_idx])
    s = pipe.<span class="fn">score</span>(X[val_idx], y[val_idx])
    fold_scores.<span class="fn">append</span>(s)
    <span class="fn">print</span>(f<span class="str">"  Fold {fold+1}: train={len(train_idx)}, val={len(val_idx)}, acc={s:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Mean acc: {np.mean(fold_scores):.4f}"</span>)

<span class="cm"># cross_validate -- multiple metrics + train scores + timing</span>
cv = <span class="fn">cross_validate</span>(pipe, X, y, cv=<span class="num">5</span>,
                    scoring=[<span class="str">"accuracy"</span>, <span class="str">"f1"</span>, <span class="str">"roc_auc"</span>],
                    return_train_score=<span class="kw">True</span>)
<span class="fn">print</span>(f<span class="str">"Test AUC : {cv['test_roc_auc'].mean():.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Train AUC: {cv['train_roc_auc'].mean():.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Fit time : {cv['fit_time'].mean():.3f}s per fold"</span>)

<span class="cm"># cross_val_predict -- get out-of-fold predictions for every sample</span>
y_oof = <span class="fn">cross_val_predict</span>(pipe, X, y, cv=<span class="num">5</span>, method=<span class="str">"predict_proba"</span>)[:, <span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"Out-of-fold prediction shape: {y_oof.shape}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Wraps StandardScaler and LogisticRegression in a Pipeline so each fold gets its own scaler -- this is essential for honest CV. 2) <code>cross_val_score</code> is the simplest interface: pass a model, X, y, and the number of folds; returns one score per fold. <code>scoring="roc_auc"</code> tells sklearn to evaluate ROC-AUC instead of the default accuracy. 3) Manual <code>StratifiedKFold</code> gives you full control: the loop yields (train_idx, val_idx) pairs for each fold, you fit/score in your own code -- useful when you need extra logging or custom logic. 4) <code>cross_validate</code> is the modern multi-metric version; you can request train scores (to detect overfitting), multiple metrics, and timing. 5) <code>cross_val_predict</code> is special: it returns one prediction per sample, where each sample's prediction comes from the model that was trained <em>without</em> that sample -- this gives you out-of-fold (OOF) predictions, which are the gold standard for blending and stacking models.</p>

<div id="plot-l5-kfold-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A schematic of 5-fold cross-validation. Each row is one fold; the dark teal block is the validation set for that fold and the orange blocks are the training data. Across the 5 folds, every row is used as validation exactly once and as training 4 times. The mean score across folds is the headline number; the spread (standard deviation) tells you how stable that estimate is. If your CV std is 0.05 on a 0.85 mean, your "true" accuracy is roughly 0.85 +/- 0.05 -- comparing models with overlapping intervals is statistical noise.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP cross-validation</div><div class="example-body">For a 50k-tweet sentiment dataset, never just use one train/test split. Use <code>StratifiedKFold(n_splits=5, shuffle=True, random_state=42)</code> wrapped around your TF-IDF + LogisticRegression pipeline. Report <code>0.873 +/- 0.011</code> instead of <code>0.873</code>. The <code>+/-</code> tells reviewers (and yourself) how reliable your number is. If two models differ by less than the std, the difference is noise.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GridSearchCV: Exhaustive Hyperparameter Search</h2>

<p class="l-text"><code>GridSearchCV</code> is the workhorse of hyperparameter tuning. You hand it a dictionary of hyperparameters and lists of values to try; it tries every combination, runs cross-validation for each, and tells you the best.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

rf = <span class="fn">RandomForestClassifier</span>(random_state=<span class="num">0</span>, n_jobs=-<span class="num">1</span>)

param_grid = {
    <span class="str">"n_estimators"</span>:      [<span class="num">100</span>, <span class="num">300</span>, <span class="num">500</span>],
    <span class="str">"max_depth"</span>:         [<span class="kw">None</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">20</span>],
    <span class="str">"min_samples_leaf"</span>:  [<span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>],
    <span class="str">"max_features"</span>:      [<span class="str">"sqrt"</span>, <span class="str">"log2"</span>],
}
<span class="cm"># 3 * 4 * 3 * 2 = 72 combinations  *  5 folds = 360 fits</span>

search = <span class="fn">GridSearchCV</span>(
    estimator=rf,
    param_grid=param_grid,
    cv=<span class="num">5</span>,
    scoring=<span class="str">"roc_auc"</span>,
    n_jobs=-<span class="num">1</span>,
    refit=<span class="kw">True</span>,            <span class="cm"># re-fit on full data using best params</span>
    return_train_score=<span class="kw">True</span>,
)
search.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(<span class="str">"Best params:"</span>, search.best_params_)
<span class="fn">print</span>(f<span class="str">"Best CV ROC AUC: {search.best_score_:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Tested {len(search.cv_results_['params'])} configurations"</span>)

<span class="cm"># The cv_results_ dict has everything</span>
<span class="kw">import</span> pandas <span class="kw">as</span> pd
results = pd.<span class="fn">DataFrame</span>(search.cv_results_)
top = results.<span class="fn">sort_values</span>(<span class="str">"mean_test_score"</span>, ascending=<span class="kw">False</span>).<span class="fn">head</span>(<span class="num">5</span>)
<span class="fn">print</span>(top[[<span class="str">"params"</span>, <span class="str">"mean_test_score"</span>, <span class="str">"std_test_score"</span>]])

<span class="cm"># search.best_estimator_ is the model refit on the full data</span>
y_pred = search.best_estimator_.<span class="fn">predict</span>(X)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a param grid with 72 combinations. With 5-fold CV that is 360 model fits -- on this small dataset takes a few seconds, on large data can take hours. 2) <code>GridSearchCV</code> wraps the estimator and the grid; <code>refit=True</code> means after finding the best params, retrain on the full dataset so <code>search.best_estimator_</code> is ready for production. 3) After fitting, <code>best_params_</code> is a dict and <code>best_score_</code> is the average CV score for that combination. 4) <code>cv_results_</code> is a verbose dict with one entry per configuration; converting to a DataFrame and sorting reveals the top performers and how confident you are about each (via std_test_score). 5) <code>search.best_estimator_</code> is now a fully fit model on the entire dataset, ready to <code>predict</code> on new data.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">cv</div><div class="card-body">Number of folds (int) or a CV splitter object. 5 is the default sweet spot.</div></div>
<div class="calc-card"><div class="card-title">scoring</div><div class="card-body">Metric to optimize. "accuracy", "f1", "roc_auc", "neg_mean_squared_error", or a callable.</div></div>
<div class="calc-card"><div class="card-title">n_jobs</div><div class="card-body">Parallelism across configurations. -1 = use all cores. Critical for large grids.</div></div>
<div class="calc-card"><div class="card-title">refit</div><div class="card-body">If True, refit on the full dataset with best params after search. Default True.</div></div>
<div class="calc-card"><div class="card-title">return_train_score</div><div class="card-body">If True, also report training scores -- useful to detect overfitting.</div></div>
<div class="calc-card"><div class="card-title">verbose</div><div class="card-body">Print progress. <code>verbose=2</code> shows each fit, useful for long searches.</div></div>
</div>

<div class="l-warn"><strong>Combinatorial explosion:</strong> a grid with 4 hyperparameters and 5 values each is $5^4 = 625$ configurations -- with 5-fold CV that is 3125 fits. On large datasets this can take days. The fix is RandomizedSearchCV (next section) or smart libraries like Optuna.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. RandomizedSearchCV: Smart Sampling</h2>

<p class="l-text">When the grid is too big to exhaustively search, <code>RandomizedSearchCV</code> samples a fixed number of random configurations from each hyperparameter distribution. Bergstra and Bengio (2012) showed that random search is usually MORE efficient than grid search because hyperparameters typically have very different sensitivities -- random search spends its budget exploring the influential ones, grid search wastes time on insensitive ones.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> RandomizedSearchCV
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> HistGradientBoostingClassifier
<span class="kw">from</span> scipy.stats <span class="kw">import</span> loguniform, randint

clf = <span class="fn">HistGradientBoostingClassifier</span>(random_state=<span class="num">0</span>)

param_dist = {
    <span class="str">"learning_rate"</span>:     <span class="fn">loguniform</span>(<span class="num">0.01</span>, <span class="num">0.3</span>),    <span class="cm"># log-uniform on [0.01, 0.3]</span>
    <span class="str">"max_iter"</span>:          <span class="fn">randint</span>(<span class="num">100</span>, <span class="num">500</span>),
    <span class="str">"max_depth"</span>:         <span class="fn">randint</span>(<span class="num">2</span>, <span class="num">10</span>),
    <span class="str">"min_samples_leaf"</span>:  <span class="fn">randint</span>(<span class="num">5</span>, <span class="num">50</span>),
    <span class="str">"l2_regularization"</span>: <span class="fn">loguniform</span>(<span class="num">1e-4</span>, <span class="num">1.0</span>),
}

search = <span class="fn">RandomizedSearchCV</span>(
    estimator=clf,
    param_distributions=param_dist,
    n_iter=<span class="num">60</span>,                <span class="cm"># only try 60 random configurations</span>
    cv=<span class="num">5</span>,
    scoring=<span class="str">"roc_auc"</span>,
    n_jobs=-<span class="num">1</span>,
    random_state=<span class="num">42</span>,
    refit=<span class="kw">True</span>,
)
search.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(<span class="str">"Best params:"</span>, search.best_params_)
<span class="fn">print</span>(f<span class="str">"Best CV ROC AUC: {search.best_score_:.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Uses <code>scipy.stats.loguniform</code> for hyperparameters that vary over orders of magnitude (learning rate, regularization) -- on a log scale, "0.01 to 0.3" gives reasonable coverage. 2) <code>randint</code> for integer hyperparameters with a uniform distribution. 3) <code>n_iter=60</code> means only 60 random configurations are tried -- compare to a grid that might require 5^5 = 3125. 4) Random search returns a configuration that is usually within 1% of the best grid result, with 50x less compute. 5) For thesis-grade work, you can run a wide RandomizedSearchCV first to identify good regions, then a focused GridSearchCV around the best params.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">GridSearchCV</div><div class="compare-item">Exhaustive: tries every combination</div><div class="compare-item">Cost: product of all list lengths</div><div class="compare-item">Ranges given as lists</div><div class="compare-item">Reproducible: same grid -&gt; same results</div><div class="compare-item">Best for &lt; 50 configurations</div></div>
<div class="compare-col"><div class="compare-title">RandomizedSearchCV</div><div class="compare-item">Random: samples n_iter from distributions</div><div class="compare-item">Cost: n_iter (your budget)</div><div class="compare-item">Ranges given as scipy.stats distributions</div><div class="compare-item">Reproducible if you set random_state</div><div class="compare-item">Best when grid is huge or budget is tight</div></div>
</div>

<div id="plot-l5-grid-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Grid search vs random search budget allocation. Grid search (left) places points at evenly-spaced intersections; many of those points are wasted on the unimportant axis. Random search (right) covers more unique values along each axis with the same total budget. If the truly important hyperparameter is the horizontal one, random search gets ~9 different values while grid search only gets 3. This is why Bergstra & Bengio's paper showed random search is empirically more efficient on neural networks where 1-2 hyperparameters dominate.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Learning Curves and Validation Curves</h2>

<p class="l-text">When your model underperforms, you face two questions: <em>am I underfitting or overfitting?</em> and <em>would more data help?</em> Two diagnostic curves answer them.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Learning curve</div><div class="card-body">X = training set size; Y = train and validation score. Tells you if more data helps.</div></div>
<div class="calc-card"><div class="card-title">Validation curve</div><div class="card-body">X = one hyperparameter (e.g. max_depth); Y = train and validation score. Tells you the bias-variance trade.</div></div>
<div class="calc-card"><div class="card-title">Underfit signature</div><div class="card-body">Both curves low and close. Model is too simple. Need a bigger model or better features.</div></div>
<div class="calc-card"><div class="card-title">Overfit signature</div><div class="card-body">Train high, validation low, big gap. Model is memorizing. Need regularization, more data, or a simpler model.</div></div>
<div class="calc-card"><div class="card-title">More data helps</div><div class="card-body">Validation curve is still rising at the right edge of the learning curve.</div></div>
<div class="calc-card"><div class="card-title">More data won't help</div><div class="card-body">Validation curve has plateaued. The model has extracted all it can from this feature set.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> learning_curve, validation_curve
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

<span class="cm"># Learning curve: how does performance change with training size?</span>
sizes, train_scores, val_scores = <span class="fn">learning_curve</span>(
    <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, max_depth=<span class="num">5</span>, random_state=<span class="num">0</span>),
    X, y,
    train_sizes=np.<span class="fn">linspace</span>(<span class="num">0.1</span>, <span class="num">1.0</span>, <span class="num">8</span>),
    cv=<span class="num">5</span>,
    scoring=<span class="str">"roc_auc"</span>,
    n_jobs=-<span class="num">1</span>,
    random_state=<span class="num">42</span>,
)
<span class="fn">print</span>(<span class="str">"Train sizes:    "</span>, sizes)
<span class="fn">print</span>(<span class="str">"Train mean:     "</span>, train_scores.<span class="fn">mean</span>(axis=<span class="num">1</span>).<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Validation mean:"</span>, val_scores.<span class="fn">mean</span>(axis=<span class="num">1</span>).<span class="fn">round</span>(<span class="num">3</span>))

<span class="cm"># Validation curve: how does performance change with one hyperparameter?</span>
depth_range = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">10</span>, <span class="num">15</span>, <span class="num">20</span>]
train_sc, val_sc = <span class="fn">validation_curve</span>(
    <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>),
    X, y,
    param_name=<span class="str">"max_depth"</span>,
    param_range=depth_range,
    cv=<span class="num">5</span>,
    scoring=<span class="str">"roc_auc"</span>,
    n_jobs=-<span class="num">1</span>,
)
<span class="fn">print</span>(<span class="str">"\\nDepth\tTrain\tValid"</span>)
<span class="kw">for</span> d, t, v <span class="kw">in</span> <span class="fn">zip</span>(depth_range, train_sc.<span class="fn">mean</span>(axis=<span class="num">1</span>), val_sc.<span class="fn">mean</span>(axis=<span class="num">1</span>)):
    <span class="fn">print</span>(f<span class="str">"{d}\t{t:.3f}\t{v:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>learning_curve</code> trains the model on subsets of training data of increasing size (10%, 22%, ..., 100%) and reports CV scores. The output arrays have shape (n_sizes, n_folds) so you can compute mean +/- std. 2) Reading the output: if the train and validation lines are still pulling apart at the right edge, you have variance to spare and more data would help. If they have converged, you are bias-limited and need a more flexible model or better features. 3) <code>validation_curve</code> fixes the dataset size and sweeps a single hyperparameter; here we vary <code>max_depth</code> from 1 to 20. The output reveals where the bias-variance optimum lies. 4) For random forests, the validation score typically rises until depth ~5-10 and then plateaus -- additional depth memorizes noise without helping generalization.</p>

<div id="plot-l5-learning-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A learning curve. Training score (orange) is high and roughly flat -- the model memorizes any size of training set easily. Validation score (teal) starts low (model has too few examples) and climbs steadily as training data grows; the shaded band is +/- 1 standard deviation across folds. The two curves are still converging at the right edge, meaning the validation score would likely keep improving with more data. If the curves had flattened with a residual gap, that would indicate irreducible bias. This single plot answers the most important practical question in ML: "should I label more data?"</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Putting It All Together: A Robust Tuning Workflow</h2>

<p class="l-text">Here is the canonical, defensible-in-thesis workflow that combines everything from this lesson.</p>

<div class="calc-step"><strong>Step 1: Hold out a final test set</strong>. Use <code>train_test_split(stratify=y, random_state=42, test_size=0.2)</code>. Touch this only at the end.</div>

<div class="calc-step"><strong>Step 2: Build a Pipeline</strong>. Preprocessing + estimator in one object. Otherwise CV leaks.</div>

<div class="calc-step"><strong>Step 3: RandomizedSearchCV with 5-fold StratifiedKFold</strong> on the training set. Use 50-100 iterations. Score with the metric that matches your business goal (ROC-AUC for ranking, F1 for imbalanced, MSE for regression).</div>

<div class="calc-step"><strong>Step 4: Refit on full training data</strong> using the best params. (RandomizedSearchCV does this automatically when refit=True.)</div>

<div class="calc-step"><strong>Step 5: Evaluate ONCE on the held-out test set</strong>. Report the number with appropriate confidence (usually CV std as a proxy).</div>

<div class="calc-step"><strong>Step 6 (optional): Nested CV</strong> for unbiased generalization estimate -- two layers of CV, outer for evaluation, inner for tuning. Expensive but rigorous; use for thesis publications.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> (train_test_split, StratifiedKFold,
                                     RandomizedSearchCV, cross_val_score)
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> HistGradientBoostingClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, roc_auc_score
<span class="kw">from</span> scipy.stats <span class="kw">import</span> loguniform, randint

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

<span class="cm"># Step 1</span>
X_dev, X_test, y_dev, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.20</span>, stratify=y, random_state=<span class="num">42</span>
)

<span class="cm"># Step 2</span>
pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
    (<span class="str">"clf"</span>, <span class="fn">HistGradientBoostingClassifier</span>(random_state=<span class="num">0</span>)),
])

<span class="cm"># Step 3</span>
param_dist = {
    <span class="str">"clf__learning_rate"</span>:     <span class="fn">loguniform</span>(<span class="num">0.01</span>, <span class="num">0.3</span>),
    <span class="str">"clf__max_iter"</span>:          <span class="fn">randint</span>(<span class="num">100</span>, <span class="num">500</span>),
    <span class="str">"clf__max_depth"</span>:         <span class="fn">randint</span>(<span class="num">2</span>, <span class="num">10</span>),
    <span class="str">"clf__min_samples_leaf"</span>:  <span class="fn">randint</span>(<span class="num">5</span>, <span class="num">50</span>),
    <span class="str">"clf__l2_regularization"</span>: <span class="fn">loguniform</span>(<span class="num">1e-4</span>, <span class="num">1.0</span>),
}
inner_cv = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)
search = <span class="fn">RandomizedSearchCV</span>(
    pipe, param_dist, n_iter=<span class="num">80</span>, cv=inner_cv,
    scoring=<span class="str">"roc_auc"</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">42</span>, refit=<span class="kw">True</span>
)
search.<span class="fn">fit</span>(X_dev, y_dev)

<span class="fn">print</span>(f<span class="str">"Best CV AUC: {search.best_score_:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Best params: {search.best_params_}"</span>)

<span class="cm"># Step 5: held-out test</span>
y_pred  = search.best_estimator_.<span class="fn">predict</span>(X_test)
y_proba = search.best_estimator_.<span class="fn">predict_proba</span>(X_test)[:, <span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"\\nHELD-OUT TEST PERFORMANCE:"</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred, target_names=data.target_names))
<span class="fn">print</span>(f<span class="str">"Test ROC AUC: {roc_auc_score(y_test, y_proba):.4f}"</span>)

<span class="cm"># Step 6 (optional): Nested CV for unbiased estimate</span>
outer_cv = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">0</span>)
nested = <span class="fn">cross_val_score</span>(search, X_dev, y_dev, cv=outer_cv,
                         scoring=<span class="str">"roc_auc"</span>, n_jobs=-<span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">"\\nNested CV AUC: {nested.mean():.4f} +/- {nested.std():.4f}"</span>)
<span class="cm"># This is the truly unbiased generalization estimate.</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Holds out 20% as the final test set, never touched until the end. 2) Builds a Pipeline so scaling happens inside each CV fold, eliminating leakage. 3) RandomizedSearchCV with 80 iterations and 5-fold stratified CV finds good hyperparameters; the search reports its own best CV score. 4) After search.fit, <code>best_estimator_</code> is the pipeline refit on the full development set with the best params. 5) Single evaluation on the held-out test produces the number you report; this is realistic because the test set was never seen during tuning. 6) Nested CV wraps the entire search in another 5-fold loop -- on each outer fold, a fresh inner search runs on the training portion and is evaluated on the held-out outer fold. The result is an unbiased estimate of "what AUC do we expect on truly new data after going through this whole tuning process". This is what you report in a thesis chapter.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: thesis-grade reporting</div><div class="example-body">In your thesis methodology section: "We evaluated five model families using 5x5 nested cross-validation with stratified splits and ROC-AUC as the primary metric. Hyperparameters were tuned via RandomizedSearchCV with 80 iterations on the inner fold; final test performance was confirmed on a 20% held-out set never used during tuning. Reported intervals are mean +/- standard deviation across the outer folds, computed at the seed-stable random_state=42." This single paragraph signals you understand validation rigorously and is what reviewers look for.</div></div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Three-way split: train fits parameters, validation chooses hyperparameters, test reports the final number ONCE.<br><strong>2.</strong> K-fold CV is more data-efficient than a single train/val split; <code>StratifiedKFold</code> preserves class balance, <code>GroupKFold</code> respects sample groupings, <code>TimeSeriesSplit</code> respects temporal order.<br><strong>3.</strong> Always wrap preprocessing in a Pipeline so each CV fold gets its own fit -- otherwise you leak.<br><strong>4.</strong> <code>cross_val_score</code> for one metric, <code>cross_validate</code> for multiple metrics + train scores + timing.<br><strong>5.</strong> <code>GridSearchCV</code> for small grids (&lt; 50); <code>RandomizedSearchCV</code> for big grids; both refit on full data when <code>refit=True</code>.<br><strong>6.</strong> Use <code>loguniform</code> for log-scale hyperparameters (learning rate, alpha, C) and <code>randint</code> for integer ones.<br><strong>7.</strong> <code>learning_curve</code> answers "would more data help?"; <code>validation_curve</code> answers "is this hyperparameter underfitting or overfitting?".<br><strong>8.</strong> For thesis publications, use nested CV: outer for evaluation, inner for tuning. Reports unbiased generalization performance.<br><strong>9.</strong> Always report mean +/- standard deviation, never just a point estimate.</div></div>
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

  // 1. K-fold schematic
  var elK = document.getElementById('plot-l5-kfold-en');
  if (elK){
    var traces=[];
    for (var f=0;f<5;f++){
      var x=[], y=[], txt=[];
      for (var b=0;b<5;b++){
        x.push(b); y.push(4-f);
        txt.push(b===f ? 'VAL' : 'TRAIN');
      }
      traces.push({x:x,y:y,mode:'markers',type:'scatter',
                   marker:{symbol:'square',size:50,
                           color: x.map(function(b){return b===f?'#4ecdc4':'rgba(200,169,110,0.5)';}),
                           line:{color:'rgba(255,255,255,0.3)',width:1}},
                   text:txt,textposition:'middle center',
                   textfont:{color:'#ebe6dc',size:11},
                   mode:'markers+text',
                   hoverinfo:'skip',showlegend:false});
    }
    var foldLabels = {x:[-0.7,-0.7,-0.7,-0.7,-0.7],y:[4,3,2,1,0],
                      mode:'text',type:'scatter',text:['Fold 1','Fold 2','Fold 3','Fold 4','Fold 5'],
                      textfont:{color:T.text,size:11},showlegend:false,hoverinfo:'skip'};
    var blockLabels = {x:[0,1,2,3,4],y:[5.0,5.0,5.0,5.0,5.0],
                       mode:'text',type:'scatter',text:['Block A','Block B','Block C','Block D','Block E'],
                       textfont:{color:T.text,size:10},showlegend:false,hoverinfo:'skip'};
    var layout = Object.assign({}, common, {
      title:{text:'5-fold cross-validation schematic',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-1.2,5]},
      yaxis:{visible:false,range:[-0.7,5.5]},
      height:340,
      margin:{t:50,r:30,b:30,l:30}
    });
    Plotly.newPlot('plot-l5-kfold-en',traces.concat([foldLabels,blockLabels]),layout,{responsive:true,displayModeBar:false});
  }

  // 2. Grid vs random search
  var elG = document.getElementById('plot-l5-grid-en');
  if (elG){
    // grid: 3x3
    var gx=[], gy=[];
    for (var i=0;i<3;i++) for (var j=0;j<3;j++){gx.push(i);gy.push(j);}
    // random
    var rg=rng(11); var rx=[], ry=[];
    for (var k=0;k<9;k++){rx.push(rg()*2);ry.push(rg()*2);}
    var t1 = {x:gx,y:gy,mode:'markers',type:'scatter',name:'Grid',
              marker:{color:T.accent,size:14,line:{color:'rgba(255,255,255,0.3)',width:1}},
              xaxis:'x',yaxis:'y'};
    var t2 = {x:rx,y:ry,mode:'markers',type:'scatter',name:'Random',
              marker:{color:'#4ecdc4',size:14,line:{color:'rgba(255,255,255,0.3)',width:1}},
              xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Grid (left) vs Random (right) search of 9 configurations',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'unimportant param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      yaxis:{title:'important param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      xaxis2:{title:'unimportant param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      yaxis2:{title:'important param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l5-grid-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 3. Learning curve
  var elL = document.getElementById('plot-l5-learning-en');
  if (elL){
    var sizes=[50,100,150,200,250,300,350,400,455];
    var trMean=[1.000,0.998,0.997,0.996,0.995,0.994,0.993,0.992,0.992];
    var vlMean=[0.910,0.945,0.962,0.974,0.981,0.985,0.988,0.989,0.990];
    var vlStd =[0.022,0.018,0.015,0.012,0.010,0.009,0.008,0.007,0.007];
    var t1 = {x:sizes,y:trMean,mode:'lines+markers',type:'scatter',name:'Train',line:{color:T.accent,width:3},marker:{size:7}};
    var upper = vlMean.map(function(v,i){return v+vlStd[i];});
    var lower = vlMean.map(function(v,i){return v-vlStd[i];});
    var t2band = {x:sizes.concat(sizes.slice().reverse()),y:upper.concat(lower.slice().reverse()),fill:'toself',fillcolor:'rgba(78,205,196,0.18)',line:{color:'rgba(0,0,0,0)'},type:'scatter',name:'Val +/- std',hoverinfo:'skip',showlegend:false};
    var t2 = {x:sizes,y:vlMean,mode:'lines+markers',type:'scatter',name:'Validation',line:{color:'#4ecdc4',width:3},marker:{size:7}};
    var layout = Object.assign({}, common, {title:{text:'Learning curve: train vs validation ROC-AUC',font:{color:T.text,size:14}},xaxis:{title:'Number of training samples',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'ROC-AUC',gridcolor:T.grid,zerolinecolor:T.zero,range:[0.85,1.01]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l5-learning-en',[t2band,t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elKtr = document.getElementById('plot-l5-kfold-tr');
  if (elKtr){
    var traces=[];
    for (var f=0;f<5;f++){
      var x=[], y=[], txt=[];
      for (var b=0;b<5;b++){
        x.push(b); y.push(4-f);
        txt.push(b===f ? 'DOG' : 'EGT');
      }
      traces.push({x:x,y:y,
                   marker:{symbol:'square',size:50,
                           color: x.map(function(b){return b===f?'#4ecdc4':'rgba(200,169,110,0.5)';}),
                           line:{color:'rgba(255,255,255,0.3)',width:1}},
                   text:txt,textposition:'middle center',
                   textfont:{color:'#ebe6dc',size:11},
                   mode:'markers+text',type:'scatter',
                   hoverinfo:'skip',showlegend:false});
    }
    var foldLabels = {x:[-0.7,-0.7,-0.7,-0.7,-0.7],y:[4,3,2,1,0],
                      mode:'text',type:'scatter',text:['Fold 1','Fold 2','Fold 3','Fold 4','Fold 5'],
                      textfont:{color:T.text,size:11},showlegend:false,hoverinfo:'skip'};
    var blockLabels = {x:[0,1,2,3,4],y:[5.0,5.0,5.0,5.0,5.0],
                       mode:'text',type:'scatter',text:['Blok A','Blok B','Blok C','Blok D','Blok E'],
                       textfont:{color:T.text,size:10},showlegend:false,hoverinfo:'skip'};
    var layout = Object.assign({}, common, {
      title:{text:'5-fold capraz dogrulama semasi',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-1.2,5]},
      yaxis:{visible:false,range:[-0.7,5.5]},
      height:340,
      margin:{t:50,r:30,b:30,l:30}
    });
    Plotly.newPlot('plot-l5-kfold-tr',traces.concat([foldLabels,blockLabels]),layout,{responsive:true,displayModeBar:false});
  }

  var elGtr = document.getElementById('plot-l5-grid-tr');
  if (elGtr){
    var gx=[], gy=[];
    for (var i=0;i<3;i++) for (var j=0;j<3;j++){gx.push(i);gy.push(j);}
    var rg=rng(11); var rx=[], ry=[];
    for (var k=0;k<9;k++){rx.push(rg()*2);ry.push(rg()*2);}
    var t1 = {x:gx,y:gy,mode:'markers',type:'scatter',name:'Grid',
              marker:{color:T.accent,size:14,line:{color:'rgba(255,255,255,0.3)',width:1}},
              xaxis:'x',yaxis:'y'};
    var t2 = {x:rx,y:ry,mode:'markers',type:'scatter',name:'Random',
              marker:{color:'#4ecdc4',size:14,line:{color:'rgba(255,255,255,0.3)',width:1}},
              xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Grid (sol) vs Random (sag) arama, 9 yapilandirma',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'onemsiz param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      yaxis:{title:'onemli param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      xaxis2:{title:'onemsiz param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      yaxis2:{title:'onemli param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l5-grid-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  var elLtr = document.getElementById('plot-l5-learning-tr');
  if (elLtr){
    var sizes=[50,100,150,200,250,300,350,400,455];
    var trMean=[1.000,0.998,0.997,0.996,0.995,0.994,0.993,0.992,0.992];
    var vlMean=[0.910,0.945,0.962,0.974,0.981,0.985,0.988,0.989,0.990];
    var vlStd =[0.022,0.018,0.015,0.012,0.010,0.009,0.008,0.007,0.007];
    var t1 = {x:sizes,y:trMean,mode:'lines+markers',type:'scatter',name:'Egitim',line:{color:T.accent,width:3},marker:{size:7}};
    var upper = vlMean.map(function(v,i){return v+vlStd[i];});
    var lower = vlMean.map(function(v,i){return v-vlStd[i];});
    var t2band = {x:sizes.concat(sizes.slice().reverse()),y:upper.concat(lower.slice().reverse()),fill:'toself',fillcolor:'rgba(78,205,196,0.18)',line:{color:'rgba(0,0,0,0)'},type:'scatter',name:'Dog +/- std',hoverinfo:'skip',showlegend:false};
    var t2 = {x:sizes,y:vlMean,mode:'lines+markers',type:'scatter',name:'Dogrulama',line:{color:'#4ecdc4',width:3},marker:{size:7}};
    var layout = Object.assign({}, common, {title:{text:'Ogrenme egrisi: egitim vs dogrulama ROC-AUC',font:{color:T.text,size:14}},xaxis:{title:'Egitim ornegi sayisi',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'ROC-AUC',gridcolor:T.grid,zerolinecolor:T.zero,range:[0.85,1.01]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l5-learning-tr',[t2band,t1,t2],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Çapraz doğrulama, dürüst ML ile kendini kandırma arasındaki farktır.</strong> Yeni başlayan defterlerde gördüğünüz "0.95 doğruluk"ların neredeyse hepsi modelin eğitildiği veriyle değerlendirilmenin veya yanlış bölmenin sonucudur. Doğrulamayı yanlış yapmanın bedeli, üretimde kaybolan sayılar raporlamaktır -- başarısız ML projelerinin en yaygın tek nedeni.</p>

<p class="l-text">Bu derste model seçimi için tüm araç setini ele alıyoruz: train/validation/test paradigması, KFold ve StratifiedKFold çapraz doğrulama, hiperparametre ayarlama için GridSearchCV ve RandomizedSearchCV, yetersiz/aşırı uyumu teşhis etmek için öğrenme eğrileri ve doğrulama eğrileri ve nested CV'ye kısa giriş. Sonunda, bir tezde veya dağıtım planında raporladığınız herhangi bir sayıyı savunabileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Veriyi train/val/test olarak doğru biçimde böl</li><li>Çapraz doğrulama için KFold ve StratifiedKFold kullan</li><li>Sızıntıdan kaçınmak için Pipeline ile GridSearchCV çalıştır</li><li>Geniş hiperparametre uzayları için RandomizedSearchCV kullan</li><li>Eksik/aşırı uyumu teşhis etmek için öğrenme ve doğrulama eğrilerini oku</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Eğitim, Doğrulama ve Test Setleri</h2>

<p class="l-text">Her ML başlangıcına musallat olan hata: model seçimi sırasında test setini kullanmak. Düzeltme üç yönlü bölmedir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Eğitim (%60-80)</div><div class="card-body">Model parametrelerini (katsayılar, ağaç bölmeleri, ağırlıklar) uydurmak için kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Doğrulama (%10-20)</div><div class="card-body">Hiperparametreleri (C, max_depth, learning_rate) seçmek için kullanılır. Birçok kez dokunulur.</div></div>
<div class="calc-card"><div class="card-title">Test (%10-20)</div><div class="card-body">Sonunda BİR KEZ son performansı raporlamak için kullanılır. Asla model kararlarına geri beslenmez.</div></div>
<div class="calc-card"><div class="card-title">Neden üç?</div><div class="card-body">Test setinde ayar yaparsanız, hiperparametreleri o belirli gürültüye uydurursunuz -- artık sayıya güvenemezsiniz.</div></div>
<div class="calc-card"><div class="card-title">Çapraz doğrulama alternatifi</div><div class="card-body">Train+validation'ı tek bir katlanmış havuz olarak kullanın ve test setini ayırın; CV doğrulama adımının yerini alır.</div></div>
<div class="calc-card"><div class="card-title">Stratify edilmiş</div><div class="card-body">Sınıflandırma için, tüm bölmeler <code>stratify=y</code> ile sınıf dengesini korumalıdır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">import</span> numpy <span class="kw">as</span> np

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

X_temp, X_test, y_temp, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.15</span>, random_state=<span class="num">42</span>, stratify=y
)
X_train, X_val, y_train, y_val = <span class="fn">train_test_split</span>(
    X_temp, y_temp, test_size=<span class="num">0.176</span>,
    random_state=<span class="num">42</span>, stratify=y_temp
)
<span class="fn">print</span>(f<span class="str">"Egitim: {len(X_train)}  Dog: {len(X_val)}  Test: {len(X_test)}"</span>)
<span class="fn">print</span>(f<span class="str">"Egitim siniflari: {dict(zip(*np.unique(y_train, return_counts=True)))}"</span>)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Breast-cancer'ı yükler. 2) İlk bölme son test seti olarak %15'i çıkarır. 3) İkinci bölme kalan %85'i %70/%15 olarak böler (genel olarak %70/%15/%15 olur). 4) Her iki bölme etiketler üzerinde <code>stratify=</code> kullanır, böylece her bölme orijinal pozitif/negatif oranını korur -- dengesiz veri için kritik. 5) Çıktı oranları ve sınıf dengesinin korunduğunu doğrular. Pratikte nadiren tam 70/15/15 yaparsınız -- 80/10/10 veya basitçe %80'de çapraz doğrulama ile 80/20 da yaygındır.</p>

<div class="l-warn"><strong>Doğrulama seti ücretsiz değildir.</strong> Doğrulama doğruluğunu kullanarak iki hiperparametre yapılandırmasını her karşılaştırdığınızda, küçük bir doğrulama bağımsızlığını "yakarsınız". Onlarca karşılaştırmadan sonra, hiperparametreleri gürültüye örtük olarak uydurmuş olursunuz. Profesyonel düzeltme <em>iç içe</em> çapraz doğrulamadır (Bölüm 6) -- ama tez baseline'ı için bir kez kullanılan ayrı bir test seti yeterlidir.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. K-Fold Çapraz Doğrulama</h2>

<p class="l-text">Tek bir sabit eğitim/doğrulama bölmesi yerine, K-fold CV eğitim verisini K eşit boyutlu fold'a böler, K-1'inde eğitir, kalan birinde değerlendirir ve K kez döner. Raporlanan skor K doğrulama skorunun ortalaması (ve std'si) olur. Bu her örneği hem eğitim hem değerlendirme için kullanır, sadece aynı zamanda değil.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">KFold</div><div class="card-body">Regresyon için düz K-fold. Sıralı veya karıştırılarak böler. Çoğu problem için varsayılan K=5 yeterlidir.</div></div>
<div class="calc-card"><div class="card-title">StratifiedKFold</div><div class="card-body">Sınıflandırma için: her fold sınıf oranlarını korur. Sınıflandırıcılar için <code>cross_val_score</code>'da varsayılan.</div></div>
<div class="calc-card"><div class="card-title">GroupKFold</div><div class="card-body">Örnekler grup yapısına sahip olduğunda (hasta başına birden fazla satır, yazar başına birden fazla cümle). Bir gruptaki tüm satırlar aynı fold'a gider.</div></div>
<div class="calc-card"><div class="card-title">TimeSeriesSplit</div><div class="card-body">Eğitim daima doğrulamadan daha eski veriyi kullanır. Tahmin için -- zaman serilerini asla karıştırmayın!</div></div>
<div class="calc-card"><div class="card-title">RepeatedKFold</div><div class="card-body">K-fold'u farklı karıştırmalarla birden çok kez çalıştır. CV tahmininin varyansını azaltır.</div></div>
<div class="calc-card"><div class="card-title">LeaveOneOut</div><div class="card-body">K = N. Maksimum kapsam ama pahalı (N model uydurma). Yalnızca minik veri setleri için kullanılır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> (KFold, StratifiedKFold, cross_val_score,
                                     cross_validate, cross_val_predict)
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
pipe = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()),
                 (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>))])

<span class="cm"># En basit</span>
scores = <span class="fn">cross_val_score</span>(pipe, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"roc_auc"</span>)
<span class="fn">print</span>(f<span class="str">"5-fold ROC AUC: {scores.mean():.4f} +/- {scores.std():.4f}"</span>)

<span class="cm"># Manuel kontrol</span>
skf = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)
fold_scores = []
<span class="kw">for</span> fold, (train_idx, val_idx) <span class="kw">in</span> <span class="fn">enumerate</span>(skf.<span class="fn">split</span>(X, y)):
    pipe.<span class="fn">fit</span>(X[train_idx], y[train_idx])
    s = pipe.<span class="fn">score</span>(X[val_idx], y[val_idx])
    fold_scores.<span class="fn">append</span>(s)
    <span class="fn">print</span>(f<span class="str">"  Fold {fold+1}: egt={len(train_idx)}, dog={len(val_idx)}, acc={s:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Ort. acc: {np.mean(fold_scores):.4f}"</span>)

<span class="cm"># cross_validate -- coklu metrik + egitim skorlari + zamanlama</span>
cv = <span class="fn">cross_validate</span>(pipe, X, y, cv=<span class="num">5</span>,
                    scoring=[<span class="str">"accuracy"</span>, <span class="str">"f1"</span>, <span class="str">"roc_auc"</span>],
                    return_train_score=<span class="kw">True</span>)
<span class="fn">print</span>(f<span class="str">"Test AUC : {cv['test_roc_auc'].mean():.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Egt AUC: {cv['train_roc_auc'].mean():.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Fit suresi: {cv['fit_time'].mean():.3f}s/fold"</span>)

<span class="cm"># cross_val_predict -- her ornek icin out-of-fold tahmin</span>
y_oof = <span class="fn">cross_val_predict</span>(pipe, X, y, cv=<span class="num">5</span>, method=<span class="str">"predict_proba"</span>)[:, <span class="num">1</span>]
<span class="fn">print</span>(f<span class="str">"OOF tahmin sekli: {y_oof.shape}"</span>)</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) StandardScaler ve LogisticRegression'ı bir Pipeline'a sarar, böylece her fold kendi scaler'ını alır -- bu dürüst CV için elzemdir. 2) <code>cross_val_score</code> en basit arayüzdür: model, X, y ve fold sayısını geçirin; her fold için bir skor döner. <code>scoring="roc_auc"</code> sklearn'e varsayılan doğruluk yerine ROC-AUC değerlendirmesini söyler. 3) Manuel <code>StratifiedKFold</code> size tam kontrol verir: döngü her fold için (train_idx, val_idx) çiftleri verir, kendi kodunuzda fit/score yaparsınız -- ekstra loglama veya özel mantık gerektiğinde yararlıdır. 4) <code>cross_validate</code> modern çoklu-metrik versiyondur; eğitim skorları (aşırı uyumu tespit etmek için), birden çok metrik ve zamanlama isteyebilirsiniz. 5) <code>cross_val_predict</code> özeldir: örnek başına bir tahmin döner, her örneğin tahmini onu içermeyen bir modelden gelir -- bu size out-of-fold (OOF) tahminleri verir, modelleri harmanlamak ve istiflemek için altın standart.</p>

<div id="plot-l5-kfold-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafikte:</strong> 5-fold çapraz doğrulamanın bir şeması. Her satır bir fold; koyu turkuaz blok o fold için doğrulama setidir ve turuncu bloklar eğitim verisidir. 5 fold boyunca her satır tam olarak bir kez doğrulama olarak ve 4 kez eğitim olarak kullanılır. Fold'lar arası ortalama skor manşet sayıdır; yayılma (standart sapma) bu tahminin ne kadar kararlı olduğunu söyler. CV std'niz 0.85 ortalama üzerinde 0.05 ise, "gerçek" doğruluğunuz kabaca 0.85 +/- 0.05'tir -- üst üste binen aralıklarla modelleri karşılaştırmak istatistiksel gürültüdür.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP çapraz doğrulama</div><div class="example-body">50 bin tweet'lik bir duygu veri seti için asla yalnızca tek bir eğitim/test bölmesi kullanmayın. TF-IDF + LogisticRegression pipeline'ınız etrafında <code>StratifiedKFold(n_splits=5, shuffle=True, random_state=42)</code> kullanın. <code>0.873</code> yerine <code>0.873 +/- 0.011</code> raporlayın. <code>+/-</code> hakemlere (ve kendinize) sayınızın ne kadar güvenilir olduğunu söyler. İki model std'den daha az farklılaşırsa fark gürültüdür.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GridSearchCV: Kapsamlı Hiperparametre Araması</h2>

<p class="l-text"><code>GridSearchCV</code> hiperparametre ayarlamanın iş atıdır. Ona bir hiperparametre sözlüğü ve denenecek değer listeleri verirsiniz; her kombinasyonu dener, her biri için çapraz doğrulama çalıştırır ve size en iyisini söyler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

rf = <span class="fn">RandomForestClassifier</span>(random_state=<span class="num">0</span>, n_jobs=-<span class="num">1</span>)

param_grid = {
    <span class="str">"n_estimators"</span>:      [<span class="num">100</span>, <span class="num">300</span>, <span class="num">500</span>],
    <span class="str">"max_depth"</span>:         [<span class="kw">None</span>, <span class="num">5</span>, <span class="num">10</span>, <span class="num">20</span>],
    <span class="str">"min_samples_leaf"</span>:  [<span class="num">1</span>, <span class="num">2</span>, <span class="num">5</span>],
    <span class="str">"max_features"</span>:      [<span class="str">"sqrt"</span>, <span class="str">"log2"</span>],
}
<span class="cm"># 3 * 4 * 3 * 2 = 72 kombinasyon  *  5 fold = 360 fit</span>

search = <span class="fn">GridSearchCV</span>(
    estimator=rf,
    param_grid=param_grid,
    cv=<span class="num">5</span>,
    scoring=<span class="str">"roc_auc"</span>,
    n_jobs=-<span class="num">1</span>,
    refit=<span class="kw">True</span>,
    return_train_score=<span class="kw">True</span>,
)
search.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(<span class="str">"En iyi:"</span>, search.best_params_)
<span class="fn">print</span>(f<span class="str">"En iyi CV ROC AUC: {search.best_score_:.4f}"</span>)

<span class="kw">import</span> pandas <span class="kw">as</span> pd
results = pd.<span class="fn">DataFrame</span>(search.cv_results_)
top = results.<span class="fn">sort_values</span>(<span class="str">"mean_test_score"</span>, ascending=<span class="kw">False</span>).<span class="fn">head</span>(<span class="num">5</span>)
<span class="fn">print</span>(top[[<span class="str">"params"</span>, <span class="str">"mean_test_score"</span>, <span class="str">"std_test_score"</span>]])

y_pred = search.best_estimator_.<span class="fn">predict</span>(X)</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) 72 kombinasyonlu bir param grid tanımlar. 5-fold CV ile bu 360 model uydurma demektir -- bu küçük veri setinde birkaç saniye alır, büyük veride saatler sürebilir. 2) <code>GridSearchCV</code> estimator ve grid'i sarar; <code>refit=True</code>, en iyi paramları bulduktan sonra tüm veri setinde yeniden eğit demektir, böylece <code>search.best_estimator_</code> üretime hazırdır. 3) Uydurduktan sonra, <code>best_params_</code> bir dict ve <code>best_score_</code> o kombinasyon için ortalama CV skorudur. 4) <code>cv_results_</code> her yapılandırma için bir girişle ayrıntılı bir dict'tir; DataFrame'e dönüştürmek ve sıralamak en iyi performansları ve her birine ne kadar güvendiğinizi (std_test_score yoluyla) ortaya çıkarır. 5) <code>search.best_estimator_</code> artık tüm veri setinde tam uydurulmuş bir modeldir, yeni veride <code>predict</code> için hazır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">cv</div><div class="card-body">Fold sayısı (int) veya bir CV splitter nesnesi. 5 varsayılan tatlı noktadır.</div></div>
<div class="calc-card"><div class="card-title">scoring</div><div class="card-body">Optimize edilecek metrik. "accuracy", "f1", "roc_auc", "neg_mean_squared_error" veya bir callable.</div></div>
<div class="calc-card"><div class="card-title">n_jobs</div><div class="card-body">Yapılandırmalar arası paralellik. -1 = tüm çekirdekleri kullan. Büyük grid'ler için kritik.</div></div>
<div class="calc-card"><div class="card-title">refit</div><div class="card-body">True ise, aramadan sonra en iyi paramlarla tüm veri setinde yeniden uydurur. Varsayılan True.</div></div>
<div class="calc-card"><div class="card-title">return_train_score</div><div class="card-body">True ise, eğitim skorlarını da raporlar -- aşırı uyumu tespit etmek için yararlı.</div></div>
<div class="calc-card"><div class="card-title">verbose</div><div class="card-body">İlerlemeyi yazdır. <code>verbose=2</code> her uydurmayı gösterir, uzun aramalar için yararlı.</div></div>
</div>

<div class="l-warn"><strong>Kombinatoryal patlama:</strong> 4 hiperparametreli ve her biri 5 değerli bir grid $5^4 = 625$ yapılandırmadır -- 5-fold CV ile bu 3125 uydurma. Büyük veri setlerinde bu günler alabilir. Düzeltme RandomizedSearchCV (sonraki bölüm) veya Optuna gibi akıllı kütüphanelerdir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. RandomizedSearchCV: Akıllı Örnekleme</h2>

<p class="l-text">Grid kapsamlı arama için çok büyük olduğunda, <code>RandomizedSearchCV</code> her hiperparametre dağılımından sabit sayıda rastgele yapılandırmayı örnekler. Bergstra ve Bengio (2012), rastgele aramanın grid aramadan genellikle DAHA verimli olduğunu gösterdi çünkü hiperparametreler tipik olarak çok farklı duyarlılıklara sahiptir -- rastgele arama bütçesini etkili olanları keşfetmeye harcar, grid arama duyarsız olanlara zaman kaybeder.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> RandomizedSearchCV
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> HistGradientBoostingClassifier
<span class="kw">from</span> scipy.stats <span class="kw">import</span> loguniform, randint

clf = <span class="fn">HistGradientBoostingClassifier</span>(random_state=<span class="num">0</span>)

param_dist = {
    <span class="str">"learning_rate"</span>:     <span class="fn">loguniform</span>(<span class="num">0.01</span>, <span class="num">0.3</span>),
    <span class="str">"max_iter"</span>:          <span class="fn">randint</span>(<span class="num">100</span>, <span class="num">500</span>),
    <span class="str">"max_depth"</span>:         <span class="fn">randint</span>(<span class="num">2</span>, <span class="num">10</span>),
    <span class="str">"min_samples_leaf"</span>:  <span class="fn">randint</span>(<span class="num">5</span>, <span class="num">50</span>),
    <span class="str">"l2_regularization"</span>: <span class="fn">loguniform</span>(<span class="num">1e-4</span>, <span class="num">1.0</span>),
}

search = <span class="fn">RandomizedSearchCV</span>(
    estimator=clf,
    param_distributions=param_dist,
    n_iter=<span class="num">60</span>,
    cv=<span class="num">5</span>,
    scoring=<span class="str">"roc_auc"</span>,
    n_jobs=-<span class="num">1</span>,
    random_state=<span class="num">42</span>,
    refit=<span class="kw">True</span>,
)
search.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(<span class="str">"En iyi:"</span>, search.best_params_)
<span class="fn">print</span>(f<span class="str">"En iyi CV ROC AUC: {search.best_score_:.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Büyüklük mertebelerinde değişen hiperparametreler (öğrenme oranı, düzenlileştirme) için <code>scipy.stats.loguniform</code> kullanır -- log ölçekte "0.01 ile 0.3" makul kapsam verir. 2) Uniform dağılımlı tam sayı hiperparametreler için <code>randint</code>. 3) <code>n_iter=60</code> yalnızca 60 rastgele yapılandırmanın denendiği anlamına gelir -- 5^5 = 3125 gerektirebilecek bir grid ile karşılaştırın. 4) Rastgele arama genellikle en iyi grid sonucunun %1 içinde, 50 kat daha az hesaplama ile bir yapılandırma döndürür. 5) Tez kalitesinde iş için, önce iyi bölgeleri tanımlamak için geniş bir RandomizedSearchCV çalıştırabilir, sonra en iyi paramlar etrafında odaklı bir GridSearchCV yapabilirsiniz.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">GridSearchCV</div><div class="compare-item">Kapsamlı: her kombinasyonu dener</div><div class="compare-item">Maliyet: tüm liste uzunluklarının çarpımı</div><div class="compare-item">Aralıklar liste olarak verilir</div><div class="compare-item">Yeniden üretilebilir: aynı grid -&gt; aynı sonuç</div><div class="compare-item">&lt; 50 yapılandırma için en iyi</div></div>
<div class="compare-col"><div class="compare-title">RandomizedSearchCV</div><div class="compare-item">Rastgele: dağılımlardan n_iter örnekler</div><div class="compare-item">Maliyet: n_iter (bütçeniz)</div><div class="compare-item">Aralıklar scipy.stats dağılımları olarak verilir</div><div class="compare-item">random_state ayarlarsanız yeniden üretilebilir</div><div class="compare-item">Grid devasa veya bütçe sıkı olduğunda en iyi</div></div>
</div>

<div id="plot-l5-grid-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Grid arama vs rastgele arama bütçe tahsisi. Grid arama (sol) noktaları eşit aralıklı kesişimlere yerleştirir; bu noktaların çoğu önemsiz eksende boşa harcanır. Rastgele arama (sağ) aynı toplam bütçeyle her eksende daha fazla benzersiz değer kapsar. Gerçekten önemli hiperparametre yatay olansa, rastgele arama ~9 farklı değer alırken grid arama yalnızca 3 alır. Bergstra & Bengio'nun makalesinin sinir ağlarında 1-2 hiperparametrenin baskın olduğu durumlarda rastgele aramanın deneysel olarak daha verimli olduğunu göstermesinin nedeni budur.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Öğrenme Eğrileri ve Doğrulama Eğrileri</h2>

<p class="l-text">Modeliniz yetersiz performans gösterdiğinde iki soru ile karşılaşırsınız: <em>yetersiz mi yoksa aşırı mı uyuyorum?</em> ve <em>daha fazla veri yardımcı olur mu?</em> İki teşhis eğrisi bunları cevaplar.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Öğrenme eğrisi</div><div class="card-body">X = eğitim seti boyutu; Y = eğitim ve doğrulama skoru. Daha fazla veri yardım eder mi söyler.</div></div>
<div class="calc-card"><div class="card-title">Doğrulama eğrisi</div><div class="card-body">X = bir hiperparametre (örn. max_depth); Y = eğitim ve doğrulama skoru. Sapma-varyans takasını söyler.</div></div>
<div class="calc-card"><div class="card-title">Yetersiz uyum imzası</div><div class="card-body">Her iki eğri düşük ve yakın. Model çok basit. Daha büyük model veya daha iyi özellik gerek.</div></div>
<div class="calc-card"><div class="card-title">Aşırı uyum imzası</div><div class="card-body">Eğitim yüksek, doğrulama düşük, büyük açıklık. Model ezberliyor. Düzenlileştirme, daha çok veri veya daha basit model gerek.</div></div>
<div class="calc-card"><div class="card-title">Daha çok veri yardım eder</div><div class="card-body">Doğrulama eğrisi öğrenme eğrisinin sağ kenarında hâlâ yükseliyor.</div></div>
<div class="calc-card"><div class="card-title">Daha çok veri yardım etmez</div><div class="card-body">Doğrulama eğrisi platoya ulaştı. Model bu özellik setinden çıkarabileceğini çıkardı.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> learning_curve, validation_curve
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

<span class="cm"># Ogrenme egrisi</span>
sizes, train_scores, val_scores = <span class="fn">learning_curve</span>(
    <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, max_depth=<span class="num">5</span>, random_state=<span class="num">0</span>),
    X, y,
    train_sizes=np.<span class="fn">linspace</span>(<span class="num">0.1</span>, <span class="num">1.0</span>, <span class="num">8</span>),
    cv=<span class="num">5</span>,
    scoring=<span class="str">"roc_auc"</span>,
    n_jobs=-<span class="num">1</span>,
    random_state=<span class="num">42</span>,
)
<span class="fn">print</span>(<span class="str">"Egitim boyutlari:"</span>, sizes)
<span class="fn">print</span>(<span class="str">"Egitim ort.:    "</span>, train_scores.<span class="fn">mean</span>(axis=<span class="num">1</span>).<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Dogrulama ort.: "</span>, val_scores.<span class="fn">mean</span>(axis=<span class="num">1</span>).<span class="fn">round</span>(<span class="num">3</span>))

<span class="cm"># Dogrulama egrisi</span>
depth_range = [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>, <span class="num">5</span>, <span class="num">7</span>, <span class="num">10</span>, <span class="num">15</span>, <span class="num">20</span>]
train_sc, val_sc = <span class="fn">validation_curve</span>(
    <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>),
    X, y,
    param_name=<span class="str">"max_depth"</span>,
    param_range=depth_range,
    cv=<span class="num">5</span>,
    scoring=<span class="str">"roc_auc"</span>,
    n_jobs=-<span class="num">1</span>,
)
<span class="fn">print</span>(<span class="str">"\\nDerinlik\tEgit\tDogr."</span>)
<span class="kw">for</span> d, t, v <span class="kw">in</span> <span class="fn">zip</span>(depth_range, train_sc.<span class="fn">mean</span>(axis=<span class="num">1</span>), val_sc.<span class="fn">mean</span>(axis=<span class="num">1</span>)):
    <span class="fn">print</span>(f<span class="str">"{d}\t{t:.3f}\t{v:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) <code>learning_curve</code> modeli artan boyutta eğitim verisi alt kümelerinde (%10, %22, ..., %100) eğitir ve CV skorlarını raporlar. Çıktı dizilerinin şekli (n_sizes, n_folds), böylece ortalama +/- std hesaplayabilirsiniz. 2) Çıktıyı okuma: eğitim ve doğrulama çizgileri sağ kenarda hâlâ ayrılıyorsa varyansınız fazladır ve daha çok veri yardım eder. Yakınlaştılarsa sapmaya bağlısınız ve daha esnek bir modele veya daha iyi özelliklere ihtiyacınız var. 3) <code>validation_curve</code> veri seti boyutunu sabitler ve tek bir hiperparametreyi süpürür; burada <code>max_depth</code>'i 1'den 20'ye değiştiriyoruz. Çıktı sapma-varyans optimumunun nerede olduğunu ortaya çıkarır. 4) Random forest'lar için doğrulama skoru tipik olarak derinlik ~5-10'a kadar yükselir ve sonra platoya ulaşır -- ek derinlik genellemeye yardım etmeden gürültüyü ezberler.</p>

<div id="plot-l5-learning-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin verdiği mesaj:</strong> Bir öğrenme eğrisi. Eğitim skoru (turuncu) yüksek ve kabaca düzdür -- model herhangi bir boyuttaki eğitim setini kolayca ezberler. Doğrulama skoru (turkuaz) düşük başlar (model çok az örneğe sahip) ve eğitim verisi büyüdükçe istikrarlı olarak tırmanır; gölgeli bant fold'lar arası +/- 1 standart sapmadır. İki eğri sağ kenarda hâlâ yakınsamaktadır, yani daha çok veriyle doğrulama skoru muhtemelen iyileşmeye devam eder. Eğriler artık bir farkla düzleşseydi, bu indirgenemez sapmaya işaret ederdi. Bu tek grafik ML'deki en önemli pratik soruyu cevaplar: "daha fazla veri etiketlemeli miyim?"</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hepsini Birleştirme: Sağlam Bir Ayar İş Akışı</h2>

<p class="l-text">İşte bu dersteki her şeyi birleştiren tezde savunulabilir kanonik iş akışı.</p>

<div class="calc-step"><strong>Adım 1: Son test setini ayır</strong>. <code>train_test_split(stratify=y, random_state=42, test_size=0.2)</code> kullan. Buna yalnızca sonunda dokun.</div>

<div class="calc-step"><strong>Adım 2: Bir Pipeline kur</strong>. Ön işleme + estimator tek nesnede. Aksi takdirde CV sızar.</div>

<div class="calc-step"><strong>Adım 3: Eğitim setinde 5-fold StratifiedKFold ile RandomizedSearchCV</strong>. 50-100 iterasyon kullan. İş hedefinizle eşleşen metrikle skorlayın (sıralama için ROC-AUC, dengesiz için F1, regresyon için MSE).</div>

<div class="calc-step"><strong>Adım 4: En iyi paramları kullanarak tüm eğitim verisinde yeniden uydur</strong>. (RandomizedSearchCV refit=True ile bunu otomatik yapar.)</div>

<div class="calc-step"><strong>Adım 5: Ayrılmış test setinde BİR KEZ değerlendir</strong>. Sayıyı uygun güvenle raporlayın (genellikle CV std proxy olarak).</div>

<div class="calc-step"><strong>Adım 6 (isteğe bağlı): Yansız genelleme tahmini için Nested CV</strong> -- iki katman CV, dış değerlendirme, iç ayar. Pahalı ama sıkı; tez yayınları için kullanın.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> (train_test_split, StratifiedKFold,
                                     RandomizedSearchCV, cross_val_score)
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> HistGradientBoostingClassifier
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, roc_auc_score
<span class="kw">from</span> scipy.stats <span class="kw">import</span> loguniform, randint

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

<span class="cm"># Adim 1</span>
X_dev, X_test, y_dev, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.20</span>, stratify=y, random_state=<span class="num">42</span>
)

<span class="cm"># Adim 2</span>
pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
    (<span class="str">"clf"</span>, <span class="fn">HistGradientBoostingClassifier</span>(random_state=<span class="num">0</span>)),
])

<span class="cm"># Adim 3</span>
param_dist = {
    <span class="str">"clf__learning_rate"</span>:     <span class="fn">loguniform</span>(<span class="num">0.01</span>, <span class="num">0.3</span>),
    <span class="str">"clf__max_iter"</span>:          <span class="fn">randint</span>(<span class="num">100</span>, <span class="num">500</span>),
    <span class="str">"clf__max_depth"</span>:         <span class="fn">randint</span>(<span class="num">2</span>, <span class="num">10</span>),
    <span class="str">"clf__min_samples_leaf"</span>:  <span class="fn">randint</span>(<span class="num">5</span>, <span class="num">50</span>),
    <span class="str">"clf__l2_regularization"</span>: <span class="fn">loguniform</span>(<span class="num">1e-4</span>, <span class="num">1.0</span>),
}
inner_cv = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">42</span>)
search = <span class="fn">RandomizedSearchCV</span>(
    pipe, param_dist, n_iter=<span class="num">80</span>, cv=inner_cv,
    scoring=<span class="str">"roc_auc"</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">42</span>, refit=<span class="kw">True</span>
)
search.<span class="fn">fit</span>(X_dev, y_dev)

<span class="fn">print</span>(f<span class="str">"En iyi CV AUC: {search.best_score_:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"En iyi paramlar: {search.best_params_}"</span>)

<span class="cm"># Adim 5: ayrilan test</span>
y_pred  = search.best_estimator_.<span class="fn">predict</span>(X_test)
y_proba = search.best_estimator_.<span class="fn">predict_proba</span>(X_test)[:, <span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"\\nAYRILAN TEST PERFORMANSI:"</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred, target_names=data.target_names))
<span class="fn">print</span>(f<span class="str">"Test ROC AUC: {roc_auc_score(y_test, y_proba):.4f}"</span>)

<span class="cm"># Adim 6: Nested CV</span>
outer_cv = <span class="fn">StratifiedKFold</span>(n_splits=<span class="num">5</span>, shuffle=<span class="kw">True</span>, random_state=<span class="num">0</span>)
nested = <span class="fn">cross_val_score</span>(search, X_dev, y_dev, cv=outer_cv,
                         scoring=<span class="str">"roc_auc"</span>, n_jobs=-<span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">"\\nNested CV AUC: {nested.mean():.4f} +/- {nested.std():.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) %20'yi son test seti olarak ayırır, sonuna kadar dokunulmaz. 2) Pipeline kurar, böylece ölçekleme her CV fold'u içinde gerçekleşir, sızıntıyı ortadan kaldırır. 3) 80 iterasyon ve 5-fold stratify edilmiş CV ile RandomizedSearchCV iyi hiperparametreler bulur; arama kendi en iyi CV skorunu raporlar. 4) search.fit'ten sonra <code>best_estimator_</code> en iyi paramlarla tüm geliştirme setinde yeniden uydurulmuş pipeline'dır. 5) Ayrılan testte tek bir değerlendirme raporladığınız sayıyı üretir; bu gerçekçidir çünkü test seti ayar sırasında hiç görülmedi. 6) Nested CV tüm aramayı başka bir 5-fold döngüsünde sarar -- her dış fold'da, eğitim kısmında taze bir iç arama çalışır ve ayrılan dış fold'da değerlendirilir. Sonuç "tüm bu ayar sürecinden sonra gerçekten yeni veride hangi AUC'yi bekliyoruz" için yansız bir tahmindir. Bir tez bölümünde raporladığınız budur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: tez kalitesinde raporlama</div><div class="example-body">Tezinizin metodoloji bölümünde: "Beş model ailesini stratify edilmiş bölmelerle 5x5 nested çapraz doğrulama ve birincil metrik olarak ROC-AUC kullanarak değerlendirdik. Hiperparametreler iç fold'da 80 iterasyonlu RandomizedSearchCV ile ayarlandı; son test performansı ayar sırasında hiç kullanılmayan %20 ayrılmış sette doğrulandı. Raporlanan aralıklar dış fold'lar arası ortalama +/- standart sapmadır, seed-kararlı random_state=42'de hesaplanmıştır." Bu tek paragraf doğrulamayı titizlikle anladığınızı sinyaller ve hakemlerin aradığı şeydir.</div></div>

<div class="think-box"><div class="think-label">ÖZET ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Üç yönlü bölme: train parametreleri uydurur, validation hiperparametreleri seçer, test BİR KEZ son sayıyı raporlar.<br><strong>2.</strong> K-fold CV tek bir train/val bölmesinden daha veri verimlidir; <code>StratifiedKFold</code> sınıf dengesini korur, <code>GroupKFold</code> örnek gruplandırmalarına saygı gösterir, <code>TimeSeriesSplit</code> zamansal sıraya saygı gösterir.<br><strong>3.</strong> Ön işlemeyi daima Pipeline'a sarın, böylece her CV fold'u kendi fit'ini alır -- aksi takdirde sızar.<br><strong>4.</strong> Bir metrik için <code>cross_val_score</code>, çoklu metrik + eğitim skorları + zamanlama için <code>cross_validate</code>.<br><strong>5.</strong> Küçük grid'ler için <code>GridSearchCV</code> (&lt; 50); büyük grid'ler için <code>RandomizedSearchCV</code>; her ikisi de <code>refit=True</code> olduğunda tüm veride yeniden uydurur.<br><strong>6.</strong> Log ölçek hiperparametreler için (öğrenme oranı, alpha, C) <code>loguniform</code> ve tam sayılar için <code>randint</code> kullanın.<br><strong>7.</strong> <code>learning_curve</code> "daha çok veri yardım eder mi?" sorusunu cevaplar; <code>validation_curve</code> "bu hiperparametre yetersiz mi yoksa aşırı mı uyuyor?" sorusunu cevaplar.<br><strong>8.</strong> Tez yayınları için nested CV kullanın: dış değerlendirme, iç ayar. Yansız genelleme performansı raporlar.<br><strong>9.</strong> Daima ortalama +/- standart sapma raporlayın, asla yalnız nokta tahmini değil.</div></div>
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

  // 1. K-fold schematic
  var elK = document.getElementById('plot-l5-kfold-en');
  if (elK){
    var traces=[];
    for (var f=0;f<5;f++){
      var x=[], y=[], txt=[];
      for (var b=0;b<5;b++){
        x.push(b); y.push(4-f);
        txt.push(b===f ? 'VAL' : 'TRAIN');
      }
      traces.push({x:x,y:y,mode:'markers',type:'scatter',
                   marker:{symbol:'square',size:50,
                           color: x.map(function(b){return b===f?'#4ecdc4':'rgba(200,169,110,0.5)';}),
                           line:{color:'rgba(255,255,255,0.3)',width:1}},
                   text:txt,textposition:'middle center',
                   textfont:{color:'#ebe6dc',size:11},
                   mode:'markers+text',
                   hoverinfo:'skip',showlegend:false});
    }
    var foldLabels = {x:[-0.7,-0.7,-0.7,-0.7,-0.7],y:[4,3,2,1,0],
                      mode:'text',type:'scatter',text:['Fold 1','Fold 2','Fold 3','Fold 4','Fold 5'],
                      textfont:{color:T.text,size:11},showlegend:false,hoverinfo:'skip'};
    var blockLabels = {x:[0,1,2,3,4],y:[5.0,5.0,5.0,5.0,5.0],
                       mode:'text',type:'scatter',text:['Block A','Block B','Block C','Block D','Block E'],
                       textfont:{color:T.text,size:10},showlegend:false,hoverinfo:'skip'};
    var layout = Object.assign({}, common, {
      title:{text:'5-fold cross-validation schematic',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-1.2,5]},
      yaxis:{visible:false,range:[-0.7,5.5]},
      height:340,
      margin:{t:50,r:30,b:30,l:30}
    });
    Plotly.newPlot('plot-l5-kfold-en',traces.concat([foldLabels,blockLabels]),layout,{responsive:true,displayModeBar:false});
  }

  // 2. Grid vs random search
  var elG = document.getElementById('plot-l5-grid-en');
  if (elG){
    // grid: 3x3
    var gx=[], gy=[];
    for (var i=0;i<3;i++) for (var j=0;j<3;j++){gx.push(i);gy.push(j);}
    // random
    var rg=rng(11); var rx=[], ry=[];
    for (var k=0;k<9;k++){rx.push(rg()*2);ry.push(rg()*2);}
    var t1 = {x:gx,y:gy,mode:'markers',type:'scatter',name:'Grid',
              marker:{color:T.accent,size:14,line:{color:'rgba(255,255,255,0.3)',width:1}},
              xaxis:'x',yaxis:'y'};
    var t2 = {x:rx,y:ry,mode:'markers',type:'scatter',name:'Random',
              marker:{color:'#4ecdc4',size:14,line:{color:'rgba(255,255,255,0.3)',width:1}},
              xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Grid (left) vs Random (right) search of 9 configurations',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'unimportant param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      yaxis:{title:'important param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      xaxis2:{title:'unimportant param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      yaxis2:{title:'important param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l5-grid-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 3. Learning curve
  var elL = document.getElementById('plot-l5-learning-en');
  if (elL){
    var sizes=[50,100,150,200,250,300,350,400,455];
    var trMean=[1.000,0.998,0.997,0.996,0.995,0.994,0.993,0.992,0.992];
    var vlMean=[0.910,0.945,0.962,0.974,0.981,0.985,0.988,0.989,0.990];
    var vlStd =[0.022,0.018,0.015,0.012,0.010,0.009,0.008,0.007,0.007];
    var t1 = {x:sizes,y:trMean,mode:'lines+markers',type:'scatter',name:'Train',line:{color:T.accent,width:3},marker:{size:7}};
    var upper = vlMean.map(function(v,i){return v+vlStd[i];});
    var lower = vlMean.map(function(v,i){return v-vlStd[i];});
    var t2band = {x:sizes.concat(sizes.slice().reverse()),y:upper.concat(lower.slice().reverse()),fill:'toself',fillcolor:'rgba(78,205,196,0.18)',line:{color:'rgba(0,0,0,0)'},type:'scatter',name:'Val +/- std',hoverinfo:'skip',showlegend:false};
    var t2 = {x:sizes,y:vlMean,mode:'lines+markers',type:'scatter',name:'Validation',line:{color:'#4ecdc4',width:3},marker:{size:7}};
    var layout = Object.assign({}, common, {title:{text:'Learning curve: train vs validation ROC-AUC',font:{color:T.text,size:14}},xaxis:{title:'Number of training samples',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'ROC-AUC',gridcolor:T.grid,zerolinecolor:T.zero,range:[0.85,1.01]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l5-learning-en',[t2band,t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elKtr = document.getElementById('plot-l5-kfold-tr');
  if (elKtr){
    var traces=[];
    for (var f=0;f<5;f++){
      var x=[], y=[], txt=[];
      for (var b=0;b<5;b++){
        x.push(b); y.push(4-f);
        txt.push(b===f ? 'DOG' : 'EGT');
      }
      traces.push({x:x,y:y,
                   marker:{symbol:'square',size:50,
                           color: x.map(function(b){return b===f?'#4ecdc4':'rgba(200,169,110,0.5)';}),
                           line:{color:'rgba(255,255,255,0.3)',width:1}},
                   text:txt,textposition:'middle center',
                   textfont:{color:'#ebe6dc',size:11},
                   mode:'markers+text',type:'scatter',
                   hoverinfo:'skip',showlegend:false});
    }
    var foldLabels = {x:[-0.7,-0.7,-0.7,-0.7,-0.7],y:[4,3,2,1,0],
                      mode:'text',type:'scatter',text:['Fold 1','Fold 2','Fold 3','Fold 4','Fold 5'],
                      textfont:{color:T.text,size:11},showlegend:false,hoverinfo:'skip'};
    var blockLabels = {x:[0,1,2,3,4],y:[5.0,5.0,5.0,5.0,5.0],
                       mode:'text',type:'scatter',text:['Blok A','Blok B','Blok C','Blok D','Blok E'],
                       textfont:{color:T.text,size:10},showlegend:false,hoverinfo:'skip'};
    var layout = Object.assign({}, common, {
      title:{text:'5-katlı çapraz doğrulama şeması',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-1.2,5]},
      yaxis:{visible:false,range:[-0.7,5.5]},
      height:340,
      margin:{t:50,r:30,b:30,l:30}
    });
    Plotly.newPlot('plot-l5-kfold-tr',traces.concat([foldLabels,blockLabels]),layout,{responsive:true,displayModeBar:false});
  }

  var elGtr = document.getElementById('plot-l5-grid-tr');
  if (elGtr){
    var gx=[], gy=[];
    for (var i=0;i<3;i++) for (var j=0;j<3;j++){gx.push(i);gy.push(j);}
    var rg=rng(11); var rx=[], ry=[];
    for (var k=0;k<9;k++){rx.push(rg()*2);ry.push(rg()*2);}
    var t1 = {x:gx,y:gy,mode:'markers',type:'scatter',name:'Grid',
              marker:{color:T.accent,size:14,line:{color:'rgba(255,255,255,0.3)',width:1}},
              xaxis:'x',yaxis:'y'};
    var t2 = {x:rx,y:ry,mode:'markers',type:'scatter',name:'Random',
              marker:{color:'#4ecdc4',size:14,line:{color:'rgba(255,255,255,0.3)',width:1}},
              xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Grid (sol) vs Random (sağ) arama, 9 yapılandırma',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'onemsiz param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      yaxis:{title:'onemli param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      xaxis2:{title:'onemsiz param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      yaxis2:{title:'onemli param',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.4,2.4]},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l5-grid-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  var elLtr = document.getElementById('plot-l5-learning-tr');
  if (elLtr){
    var sizes=[50,100,150,200,250,300,350,400,455];
    var trMean=[1.000,0.998,0.997,0.996,0.995,0.994,0.993,0.992,0.992];
    var vlMean=[0.910,0.945,0.962,0.974,0.981,0.985,0.988,0.989,0.990];
    var vlStd =[0.022,0.018,0.015,0.012,0.010,0.009,0.008,0.007,0.007];
    var t1 = {x:sizes,y:trMean,mode:'lines+markers',type:'scatter',name:'Egitim',line:{color:T.accent,width:3},marker:{size:7}};
    var upper = vlMean.map(function(v,i){return v+vlStd[i];});
    var lower = vlMean.map(function(v,i){return v-vlStd[i];});
    var t2band = {x:sizes.concat(sizes.slice().reverse()),y:upper.concat(lower.slice().reverse()),fill:'toself',fillcolor:'rgba(78,205,196,0.18)',line:{color:'rgba(0,0,0,0)'},type:'scatter',name:'Dog +/- std',hoverinfo:'skip',showlegend:false};
    var t2 = {x:sizes,y:vlMean,mode:'lines+markers',type:'scatter',name:'Dogrulama',line:{color:'#4ecdc4',width:3},marker:{size:7}};
    var layout = Object.assign({}, common, {title:{text:'Öğrenme eğrisi: eğitim vs doğrulama ROC-AUC',font:{color:T.text,size:14}},xaxis:{title:'Egitim ornegi sayisi',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'ROC-AUC',gridcolor:T.grid,zerolinecolor:T.zero,range:[0.85,1.01]},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l5-learning-tr',[t2band,t1,t2],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
