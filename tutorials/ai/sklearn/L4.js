window.SKLEARN_L4 = {

en: `<p class="l-text"><strong>Tree-based models are the most consistently winning class of algorithms on tabular data.</strong> A 2022 survey of Kaggle competitions on tabular tasks found that gradient boosting (XGBoost, LightGBM, CatBoost) won the vast majority. Even in the deep-learning era, when you have rows-and-columns data, the right answer almost always starts with a random forest or a gradient-boosted tree.</p>

<p class="l-text">In this lesson we build trees from the ground up: how a single decision tree splits, what information gain and Gini impurity actually compute, why a random forest combines hundreds of weak trees into a strong predictor, and how gradient boosting goes one step further by fitting each new tree to the residuals of the previous ensemble. We end with feature importance and decision-boundary visualizations.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Train DecisionTreeClassifier/Regressor with max_depth, min_samples_leaf</li><li>Train RandomForestClassifier with n_estimators, max_features</li><li>Train GradientBoostingClassifier and HistGradientBoosting</li><li>Read feature_importances_ to identify important features</li><li>Compare tree vs ensemble bias-variance tradeoff</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Decision Trees: Yes/No Questions Until Pure</h2>

<p class="l-text">A decision tree is a recursive structure of yes/no questions about features. At each node, the algorithm picks the best feature and the best split point, partitions the data into two children, and repeats until each leaf is pure (one class) or a stopping rule kicks in.</p>

<div class="calc-highlight"><strong>Why trees are special:</strong> they make NO scaling assumptions, handle nonlinear interactions natively, work on numeric AND categorical data, and are interpretable -- you can literally print the tree and read it like a flowchart. The downside: a single tree is high-variance, often overfits, and is sensitive to small data changes. The fix is ensembles (Section 3 onward).</div>

<p class="l-text">For classification, the split criterion is usually <strong>Gini impurity</strong> or <strong>entropy</strong>. Both measure how "mixed" the labels are at a node:</p>

<div class="katex-block">$$\\text{Gini}(S) = 1 - \\sum_{k=1}^{K} p_k^2, \\qquad \\text{Entropy}(S) = -\\sum_{k=1}^{K} p_k \\log_2 p_k$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$p_k$</div><div class="card-body">Proportion of class k samples at the node. $\\sum p_k = 1$.</div></div>
<div class="calc-card"><div class="card-title">Gini</div><div class="card-body">0 when pure (one class), max 1-1/K when uniform. Sklearn default. Slightly faster than entropy.</div></div>
<div class="calc-card"><div class="card-title">Entropy</div><div class="card-body">0 when pure, max $\\log_2 K$ when uniform. Same shape as Gini in practice.</div></div>
<div class="calc-card"><div class="card-title">$K$</div><div class="card-body">Number of classes. For binary classification, both metrics depend only on $p_1$.</div></div>
<div class="calc-card"><div class="card-title">Pure node</div><div class="card-body">All samples have the same class. No further splitting needed.</div></div>
<div class="calc-card"><div class="card-title">Leaf prediction</div><div class="card-body">Majority class of training samples that reached the leaf.</div></div>
</div>

<p class="l-text">A split's quality is the <strong>information gain</strong> -- how much the impurity drops when we split:</p>

<div class="katex-block">$$\\text{IG} = \\text{Impurity}(S) - \\frac{|S_L|}{|S|}\\text{Impurity}(S_L) - \\frac{|S_R|}{|S|}\\text{Impurity}(S_R)$$</div>

<p class="l-text">The tree algorithm scans every feature and every threshold at every node, picks the (feature, threshold) pair that maximizes information gain, and recurses on the children. The greedy nature explains why a single tree can overfit -- it always takes the locally best split, not the globally best tree.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier, export_text, plot_tree
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">import</span> numpy <span class="kw">as</span> np

iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

<span class="cm"># A small tree we can read by eye</span>
clf = <span class="fn">DecisionTreeClassifier</span>(criterion=<span class="str">"gini"</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>)
clf.<span class="fn">fit</span>(X_tr, y_tr)

<span class="fn">print</span>(f<span class="str">"Test accuracy: {clf.score(X_te, y_te):.3f}"</span>)
<span class="cm"># Test accuracy: 0.974</span>

<span class="cm"># Print the tree as text</span>
<span class="fn">print</span>(<span class="fn">export_text</span>(clf, feature_names=iris.feature_names))
<span class="cm"># |--- petal length (cm) <= 2.45</span>
<span class="cm"># |   |--- class: 0</span>
<span class="cm"># |--- petal length (cm) >  2.45</span>
<span class="cm"># |   |--- petal width (cm) <= 1.75</span>
<span class="cm"># |   |   |--- petal length (cm) <= 4.95</span>
<span class="cm"># |   |   |   |--- class: 1</span>
<span class="cm"># ...</span>

<span class="cm"># Decision path for one sample</span>
sample = X_te[:<span class="num">1</span>]
path = clf.<span class="fn">decision_path</span>(sample)
<span class="fn">print</span>(<span class="str">"Visited nodes for sample 0:"</span>, path.indices)
<span class="fn">print</span>(<span class="str">"Predicted class:"</span>, clf.<span class="fn">predict</span>(sample))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads iris and creates a depth-limited tree (<code>max_depth=3</code>) so it stays small enough to read. 2) <code>export_text</code> prints the tree as a flowchart -- you can read each path top-down to see the rule that classifies a new sample. 3) The first split is "petal length &lt;= 2.45" -- this perfectly separates setosa (class 0) from the other two species. 4) Subsequent splits separate versicolor from virginica using petal width and length. 5) <code>decision_path</code> tells you which nodes a specific sample visited -- great for debugging individual predictions or building rule-based explanations.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">max_depth</div><div class="card-body">Maximum tree depth. Lower = simpler, more bias. Default None (grow until pure).</div></div>
<div class="calc-card"><div class="card-title">min_samples_split</div><div class="card-body">Minimum samples required to split a node. Default 2. Increase to 10-50 for noisy data.</div></div>
<div class="calc-card"><div class="card-title">min_samples_leaf</div><div class="card-body">Minimum samples in a leaf. Default 1. Setting to 5 stabilizes predictions.</div></div>
<div class="calc-card"><div class="card-title">max_features</div><div class="card-body">Number of features to consider per split. None=all (default for trees), "sqrt" for forests.</div></div>
<div class="calc-card"><div class="card-title">criterion</div><div class="card-body">"gini" (default) or "entropy". Almost identical performance.</div></div>
<div class="calc-card"><div class="card-title">ccp_alpha</div><div class="card-body">Cost-complexity pruning. Larger values prune more. Use <code>cost_complexity_pruning_path</code> to find a good value.</div></div>
</div>

<div class="l-warn"><strong>Single trees overfit hard.</strong> An unconstrained <code>DecisionTreeClassifier</code> will keep splitting until every leaf has 1 sample -- 100% training accuracy, garbage on test. Always set <code>max_depth</code> or <code>min_samples_leaf</code>, or move directly to a forest.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Decision Trees for Regression</h2>

<p class="l-text">For regression, the split criterion is variance reduction (also called MSE reduction). The tree picks splits that maximize how much the target variance shrinks when the data is partitioned. The leaf prediction is the mean of training targets that fell into the leaf.</p>

<div class="katex-block">$$\\text{MSE}(S) = \\frac{1}{|S|}\\sum_{i \\in S}(y_i - \\bar{y}_S)^2$$</div>

<p class="l-text">A regression tree is a piecewise-constant approximation. Predictions are flat within each leaf region and jump at the boundaries. Trees can fit any function, but with axis-aligned step boundaries, so they are not great at smooth surfaces.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeRegressor

<span class="cm"># Toy 1D nonlinear regression</span>
np.random.<span class="fn">seed</span>(<span class="num">0</span>)
X = np.<span class="fn">sort</span>(<span class="num">5</span> * np.random.<span class="fn">rand</span>(<span class="num">100</span>, <span class="num">1</span>), axis=<span class="num">0</span>)
y = np.<span class="fn">sin</span>(X.<span class="fn">ravel</span>()) + <span class="num">0.1</span> * np.random.<span class="fn">randn</span>(<span class="num">100</span>)

reg = <span class="fn">DecisionTreeRegressor</span>(max_depth=<span class="num">3</span>)
reg.<span class="fn">fit</span>(X, y)

X_grid = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">5</span>, <span class="num">500</span>).<span class="fn">reshape</span>(-<span class="num">1</span>, <span class="num">1</span>)
y_pred = reg.<span class="fn">predict</span>(X_grid)
<span class="fn">print</span>(<span class="str">"Tree depth:"</span>, reg.<span class="fn">get_depth</span>())
<span class="fn">print</span>(<span class="str">"Number of leaves:"</span>, reg.<span class="fn">get_n_leaves</span>())</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a noisy sine curve in 1D -- a classic test of regression flexibility. 2) Fits a depth-3 regression tree, giving us at most $2^3=8$ leaves. 3) Predicts on a fine grid for plotting. 4) The output is a step function: each leaf returns the average y value of training samples it contains, so predictions are flat within a region and jump at split thresholds. Increase max_depth and the staircase gets finer; eventually it fits every training point but predicts noise on test.</p>

<div id="plot-l4-tree-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A noisy sine curve approximated by a depth-3 decision tree. The smooth orange dots are the training data; the staircase teal line is the tree's prediction. Notice the axis-aligned, piecewise-constant nature: each "step" corresponds to a leaf region. With deeper trees the staircase becomes finer; with shallower trees, coarser. This is the inductive bias of trees -- they are excellent at sharp boundaries (rule-based phenomena) and poor at smooth curves (linear/sinusoidal phenomena).</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Random Forests: Bagging Many Trees</h2>

<p class="l-text">A single decision tree has high variance: small data changes produce a wildly different tree. <strong>Bagging</strong> (Bootstrap AGGregatING) reduces variance by training many trees on bootstrap samples (sampling with replacement) and averaging their predictions. <strong>Random Forests</strong> add one more trick: at each split, only a random subset of features is considered. This decorrelates the trees, making averaging more effective.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bootstrap sample</div><div class="card-body">Sample n rows from training data with replacement. About 63% of unique rows; the rest are out-of-bag (OOB).</div></div>
<div class="calc-card"><div class="card-title">Aggregate</div><div class="card-body">Average regression predictions, vote on classification. Variance shrinks by 1/n_trees if independent.</div></div>
<div class="calc-card"><div class="card-title">Feature subsampling</div><div class="card-body">At each split, consider only sqrt(p) features (classification) or p/3 (regression). Decorrelates trees.</div></div>
<div class="calc-card"><div class="card-title">OOB error</div><div class="card-body">For each tree, evaluate on the ~37% of training rows it did not see. Free validation -- no need for a test set.</div></div>
<div class="calc-card"><div class="card-title">Parallel</div><div class="card-body">Trees are independent; <code>n_jobs=-1</code> uses all CPU cores.</div></div>
<div class="calc-card"><div class="card-title">Robust to outliers</div><div class="card-body">Each tree trains on a different bootstrap, so outliers do not appear in every tree.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier, RandomForestRegressor
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, cross_val_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

rf = <span class="fn">RandomForestClassifier</span>(
    n_estimators=<span class="num">300</span>,        <span class="cm"># number of trees</span>
    max_depth=<span class="kw">None</span>,          <span class="cm"># let trees grow fully (relies on bagging for regularization)</span>
    min_samples_leaf=<span class="num">2</span>,      <span class="cm"># mild leaf constraint</span>
    max_features=<span class="str">"sqrt"</span>,     <span class="cm"># decorrelation trick</span>
    oob_score=<span class="kw">True</span>,          <span class="cm"># free validation</span>
    n_jobs=-<span class="num">1</span>,
    random_state=<span class="num">42</span>,
)
rf.<span class="fn">fit</span>(X_tr, y_tr)

<span class="fn">print</span>(f<span class="str">"OOB score: {rf.oob_score_:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Test accuracy: {rf.score(X_te, y_te):.3f}"</span>)

<span class="cm"># Feature importance: how much each feature contributed to impurity reduction</span>
imp = rf.feature_importances_
order = np.<span class="fn">argsort</span>(imp)[::-<span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"\\nTop 5 most important features:"</span>)
<span class="kw">for</span> i <span class="kw">in</span> order[:<span class="num">5</span>]:
    <span class="fn">print</span>(f<span class="str">"  {data.feature_names[i]:35s}: {imp[i]:.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads breast-cancer (binary classification, 30 features). 2) <code>n_estimators=300</code> means 300 trees -- more is better up to diminishing returns. 3) <code>max_depth=None</code> lets each tree grow fully because the variance reduction comes from averaging, not from constraining individual trees. 4) <code>max_features="sqrt"</code> means only sqrt(30) ~ 5 features are considered at each split -- this is the random forest's signature trick. 5) <code>oob_score=True</code> automatically computes the out-of-bag accuracy as a free validation score; usually within 0.01 of test accuracy. 6) <code>n_jobs=-1</code> trains all 300 trees in parallel using every CPU core. 7) <code>feature_importances_</code> sums up the impurity reduction contributed by each feature across all trees and normalizes -- the top features are the ones the model relied on most.</p>

<div id="plot-l4-importance-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Random forest feature importances on breast-cancer, sorted descending. The top three features ("worst concave points", "worst perimeter", "worst area") account for the bulk of decisions -- this is typical for medical features where a few dominant predictors carry most of the signal. The long tail of low-importance features can often be pruned to simplify the model. Always inspect feature importances after fitting a forest; it is the cheapest interpretability you get for free.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP with random forests</div><div class="example-body">For a 20k-vocabulary TF-IDF sentiment dataset, train <code>RandomForestClassifier(n_estimators=200, max_features="sqrt", n_jobs=-1)</code>. The model gives competitive accuracy (~88%) and feature importances show which words drive sentiment ("excellent", "garbage", "boring"). For NLP this is often slower than logistic regression but generates richer interactions for free; useful when you suspect the data has strong word-by-word combinations.</div></div>

<div class="l-warn"><strong>Feature importance trap:</strong> sklearn's default impurity-based importance is <em>biased toward high-cardinality features</em> (numeric columns, IDs). For unbiased importance, use <code>permutation_importance</code> from sklearn.inspection -- it shuffles each feature in the test set and measures the accuracy drop. Slower but trustworthy.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Gradient Boosting: Sequential Tree Building</h2>

<p class="l-text">Random forests build trees in parallel, each independent. Gradient boosting builds trees <em>sequentially</em>: each new tree fits the <em>residuals</em> of the previous ensemble. The result is a chain of weak learners that progressively correct each other's errors.</p>

<div class="calc-highlight"><strong>The boosting recipe:</strong> 1) Start with a simple prediction (mean of y). 2) Compute residuals = true - predicted. 3) Fit a small tree to the residuals. 4) Add a fraction (the learning rate) of this tree's prediction to the running ensemble. 5) Repeat for n_estimators iterations.</div>

<div class="katex-block">$$F_{m}(x) = F_{m-1}(x) + \\eta \\cdot h_m(x), \\quad h_m \\approx -\\frac{\\partial L}{\\partial F_{m-1}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$F_m(x)$</div><div class="card-body">Ensemble prediction at iteration m. Sum of all trees so far.</div></div>
<div class="calc-card"><div class="card-title">$\\eta$ (learning_rate)</div><div class="card-body">Step size (typically 0.05-0.3). Small = need more trees, but better generalization.</div></div>
<div class="calc-card"><div class="card-title">$h_m(x)$</div><div class="card-body">m-th tree's prediction. Trained to fit the negative gradient (residuals for MSE loss).</div></div>
<div class="calc-card"><div class="card-title">Loss $L$</div><div class="card-body">Squared error for regression, log-loss for classification, etc.</div></div>
<div class="calc-card"><div class="card-title">Weak learners</div><div class="card-body">Each tree is shallow (depth 3-7). The ensemble is strong because of summation.</div></div>
<div class="calc-card"><div class="card-title">Sequential</div><div class="card-body">Cannot be parallelized across trees. Modern libraries parallelize within tree (split finding).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier, HistGradientBoostingClassifier
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">import</span> numpy <span class="kw">as</span> np

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

<span class="cm"># Classic gradient boosting</span>
gb = <span class="fn">GradientBoostingClassifier</span>(
    n_estimators=<span class="num">200</span>,
    learning_rate=<span class="num">0.1</span>,
    max_depth=<span class="num">3</span>,             <span class="cm"># shallow trees!</span>
    subsample=<span class="num">0.8</span>,           <span class="cm"># stochastic gradient boosting</span>
    random_state=<span class="num">42</span>,
)
gb.<span class="fn">fit</span>(X_tr, y_tr)
<span class="fn">print</span>(f<span class="str">"GB test acc: {gb.score(X_te, y_te):.3f}"</span>)

<span class="cm"># Histogram-based boosting -- much faster, like LightGBM</span>
hgb = <span class="fn">HistGradientBoostingClassifier</span>(
    max_iter=<span class="num">500</span>,
    learning_rate=<span class="num">0.05</span>,
    max_depth=<span class="kw">None</span>,
    early_stopping=<span class="kw">True</span>,
    validation_fraction=<span class="num">0.1</span>,
    n_iter_no_change=<span class="num">20</span>,
    random_state=<span class="num">42</span>,
)
hgb.<span class="fn">fit</span>(X_tr, y_tr)
<span class="fn">print</span>(f<span class="str">"HistGB test acc: {hgb.score(X_te, y_te):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"HistGB stopped at iteration: {hgb.n_iter_}"</span>)

<span class="cm"># Track training loss per iteration to see overfitting</span>
train_loss = -gb.train_score_   <span class="cm"># negative log-likelihood per iteration</span>
<span class="fn">print</span>(f<span class="str">"Train loss after 1, 50, 200 trees: "</span>
      f<span class="str">"{train_loss[0]:.3f}, {train_loss[49]:.3f}, {train_loss[-1]:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a classic <code>GradientBoostingClassifier</code> with 200 shallow trees (depth 3) and learning rate 0.1. <code>subsample=0.8</code> uses a random 80% of rows per tree -- the "stochastic" trick that adds regularization. 2) <code>HistGradientBoostingClassifier</code> is sklearn's modern fast variant: it bins continuous features into 256 buckets and uses histogram-based split finding, the same trick LightGBM uses. It is 10-50x faster than the classic version. 3) <code>early_stopping=True</code> reserves 10% of training as internal validation; if validation loss stops improving for 20 iterations, training stops -- this prevents overfitting and saves time. 4) <code>train_score_</code> records the loss at each iteration; plotting train vs validation loss is the standard way to detect when you have added too many trees.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Random Forest</div><div class="compare-item">Trees built in parallel</div><div class="compare-item">Each tree independent</div><div class="compare-item">Reduces variance, no impact on bias</div><div class="compare-item">Hyperparams: n_estimators, max_features</div><div class="compare-item">Slow per tree (full depth) but parallel</div><div class="compare-item">Robust to hyperparameters</div></div>
<div class="compare-col"><div class="compare-title">Gradient Boosting</div><div class="compare-item">Trees built sequentially</div><div class="compare-item">Each tree depends on previous</div><div class="compare-item">Reduces both bias AND variance</div><div class="compare-item">Hyperparams: n_estimators, learning_rate, max_depth</div><div class="compare-item">Fast per tree (shallow) but sequential</div><div class="compare-item">More tuning needed; more accurate when tuned</div></div>
</div>

<div id="plot-l4-boosting-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Training and validation loss curves over boosting iterations. Both losses drop fast at first as the early trees correct big errors. Training loss keeps declining but validation loss plateaus around iteration 80 and starts rising slightly -- this is the "overfitting elbow", the point where adding more trees memorizes training data without helping generalization. Modern boosting libraries automate this with early stopping, but every practitioner should be able to read this curve and pick the optimal number of iterations.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Decision Boundaries: Visualizing Tree Models</h2>

<p class="l-text">Trees and forests carve the feature space into axis-aligned rectangles. Visualizing this on 2D data builds the right intuition for what kinds of problems they handle well.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_moons
<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier, GradientBoostingClassifier

X, y = <span class="fn">make_moons</span>(n_samples=<span class="num">400</span>, noise=<span class="num">0.25</span>, random_state=<span class="num">0</span>)
xx, yy = np.<span class="fn">meshgrid</span>(np.<span class="fn">linspace</span>(X[:,<span class="num">0</span>].<span class="fn">min</span>()-<span class="num">0.5</span>, X[:,<span class="num">0</span>].<span class="fn">max</span>()+<span class="num">0.5</span>, <span class="num">200</span>),
                     np.<span class="fn">linspace</span>(X[:,<span class="num">1</span>].<span class="fn">min</span>()-<span class="num">0.5</span>, X[:,<span class="num">1</span>].<span class="fn">max</span>()+<span class="num">0.5</span>, <span class="num">200</span>))
grid = np.c_[xx.<span class="fn">ravel</span>(), yy.<span class="fn">ravel</span>()]

models = {
    <span class="str">"Tree d=3"</span>:  <span class="fn">DecisionTreeClassifier</span>(max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>),
    <span class="str">"Tree d=10"</span>: <span class="fn">DecisionTreeClassifier</span>(max_depth=<span class="num">10</span>, random_state=<span class="num">0</span>),
    <span class="str">"RF n=100"</span>:  <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>),
    <span class="str">"GB n=100"</span>:  <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>),
}

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">4</span>, figsize=(<span class="num">18</span>, <span class="num">4</span>))
<span class="kw">for</span> ax, (name, m) <span class="kw">in</span> <span class="fn">zip</span>(axes, models.<span class="fn">items</span>()):
    m.<span class="fn">fit</span>(X, y)
    Z = m.<span class="fn">predict_proba</span>(grid)[:, <span class="num">1</span>].<span class="fn">reshape</span>(xx.shape)
    ax.<span class="fn">contourf</span>(xx, yy, Z, levels=<span class="num">20</span>, alpha=<span class="num">0.6</span>, cmap=<span class="str">"RdBu_r"</span>)
    ax.<span class="fn">scatter</span>(X[:,<span class="num">0</span>], X[:,<span class="num">1</span>], c=y, edgecolor=<span class="str">"k"</span>, cmap=<span class="str">"RdBu_r"</span>)
    ax.<span class="fn">set_title</span>(f<span class="str">"{name}  acc={m.score(X, y):.3f}"</span>)
plt.<span class="fn">tight_layout</span>()</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates the classic two-moons dataset -- linearly inseparable but trivial for nonlinear models. 2) Creates a 200x200 grid for visualization. 3) Trains four models: shallow tree (underfits), deep tree (overfits, jagged boundaries), random forest (smoother through averaging), gradient boosting (similar quality, often slightly tighter). 4) <code>predict_proba(grid)[:, 1]</code> gets the probability of class 1 across the whole plane -- this gives a smooth heatmap, not just hard 0/1 predictions. 5) The four panels visualize how ensemble methods produce smoother, more confident decision regions than a single tree. Deep trees memorize each training point with little islands; forests average those out.</p>

<div id="plot-l4-boundaries-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Decision boundaries on the two-moons dataset for a shallow tree (left, smooth but underfits), a deep tree (right, jagged with overfitting islands). Compare both to the elegant smooth-but-correct boundary a random forest would draw -- it is the average of 100 jagged trees, and averaging cancels the noise while preserving the signal. This visualization is the ML equivalent of the "many wrongs make a right" intuition behind ensembling.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Practical Recommendations and a Comparison</h2>

<p class="l-text">When should you reach for which tree-based model? Here is the practitioner's decision tree (literally).</p>

<div class="calc-step"><strong>Start with RandomForestClassifier (or Regressor)</strong>: <code>n_estimators=300, max_depth=None, min_samples_leaf=2, max_features="sqrt", n_jobs=-1, random_state=42</code>. Robust, fast, no tuning needed for first results.</div>

<div class="calc-step"><strong>If accuracy needs a boost, switch to HistGradientBoostingClassifier</strong>: <code>max_iter=500, learning_rate=0.05, early_stopping=True</code>. Usually 1-3% better than RF on tabular data, similar speed.</div>

<div class="calc-step"><strong>If you need bleeding-edge performance, install XGBoost or LightGBM</strong>. They are not in sklearn but follow the same API -- swap them in. They have more tuning knobs and slightly better defaults for tricky datasets.</div>

<div class="calc-step"><strong>Tuning order of priority</strong>: <code>n_estimators</code> (use early stopping) -&gt; <code>learning_rate</code> (lower is better, 0.01-0.05) -&gt; <code>max_depth</code> (3-7) -&gt; <code>min_samples_leaf</code> -&gt; <code>subsample</code>, <code>colsample_bytree</code>. Tune one knob at a time with cross-validation.</div>

<div class="calc-step"><strong>Always check feature importance</strong> after fitting. Use <code>permutation_importance</code> for an unbiased view; it is slower but does not falsely favor high-cardinality features.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> (RandomForestClassifier, GradientBoostingClassifier,
                              HistGradientBoostingClassifier, ExtraTreesClassifier)
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

models = {
    <span class="str">"LogReg"</span>:     <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>),
    <span class="str">"RandomForest"</span>: <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">300</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">0</span>),
    <span class="str">"ExtraTrees"</span>: <span class="fn">ExtraTreesClassifier</span>(n_estimators=<span class="num">300</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">0</span>),
    <span class="str">"GradientBoost"</span>: <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>),
    <span class="str">"HistGB"</span>:     <span class="fn">HistGradientBoostingClassifier</span>(max_iter=<span class="num">300</span>, random_state=<span class="num">0</span>),
}

<span class="fn">print</span>(f<span class="str">"{'Model':<14}{'CV mean':>10}  {'CV std':>8}"</span>)
<span class="kw">for</span> name, m <span class="kw">in</span> models.<span class="fn">items</span>():
    scores = <span class="fn">cross_val_score</span>(m, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"roc_auc"</span>, n_jobs=-<span class="num">1</span>)
    <span class="fn">print</span>(f<span class="str">"{name:<14}{scores.mean():>10.4f}  {scores.std():>8.4f}"</span>)
<span class="cm"># Model           CV mean    CV std</span>
<span class="cm"># LogReg          0.9930    0.0042</span>
<span class="cm"># RandomForest    0.9935    0.0029</span>
<span class="cm"># ExtraTrees      0.9949    0.0024</span>
<span class="cm"># GradientBoost   0.9945    0.0034</span>
<span class="cm"># HistGB          0.9952    0.0028</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Compares 5 models on breast-cancer with 5-fold cross-validated ROC-AUC. 2) <code>ExtraTreesClassifier</code> is a fun cousin: instead of choosing the best split among features, it picks split thresholds <em>at random</em>; this adds even more diversity than random forests, often resulting in slightly better accuracy with marginally faster training. 3) On this small clean dataset the differences are tiny -- when a baseline logistic regression already hits 0.99 AUC, picking the "winner" is statistical noise. On larger noisier datasets, gradient boosting variants typically pull ahead by 1-5%. 4) Always run cross-validation on multiple models before committing -- the rankings shift with dataset.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: thesis-grade comparison table</div><div class="example-body">For your comparison study, you want a table of "Method | CV AUC | CV F1 | Train time | Inference time | Interpretability". Run all 5 models above plus an MLP and your fancy transformer; report mean +/- std across 5 folds. The table communicates not just accuracy but the realistic trade-offs. Reviewers love this because it shows you understand the deployment context -- a 0.5% AUC gain is meaningless if inference time triples.</div></div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Decision trees split on (feature, threshold) pairs that maximize information gain (Gini or entropy decrease).<br><strong>2.</strong> Single trees overfit; always limit <code>max_depth</code> or <code>min_samples_leaf</code>, or move to ensembles.<br><strong>3.</strong> Random forests bag many fully-grown trees; randomness comes from bootstrapping rows AND subsampling features at each split.<br><strong>4.</strong> Gradient boosting builds trees sequentially, each fitting the previous ensemble's residuals -- weaker per tree but stronger ensemble.<br><strong>5.</strong> <code>HistGradientBoostingClassifier</code> is the modern fast sklearn boosting; LightGBM/XGBoost are even faster.<br><strong>6.</strong> Trees do not require feature scaling -- they only ask "x_j &gt; t?".<br><strong>7.</strong> Inspect <code>feature_importances_</code> after fitting; for unbiased values use <code>permutation_importance</code>.<br><strong>8.</strong> Default recipe: RandomForest first, HistGB if accuracy matters, XGBoost/LightGBM for last 1-2% on production.</div></div>
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

  // 1. Tree regression: stair fit on sin(x)
  var elT = document.getElementById('plot-l4-tree-en');
  if (elT){
    var r=rng(7); var xs=[],ys=[];
    for (var i=0;i<100;i++){var x=5*Math.random();xs.push(x);ys.push(Math.sin(x)+0.15*(r()-0.5));}
    var pairs=xs.map(function(x,i){return [x,ys[i]];}).sort(function(a,b){return a[0]-b[0];});
    var sxs=pairs.map(function(p){return p[0];}); var sys=pairs.map(function(p){return p[1];});
    // crude depth-3 tree: 8 buckets of equal x range
    var minX=0, maxX=5; var nbuckets=8;
    var bx=[],by=[];
    for (var b=0;b<nbuckets;b++){
      var l=minX+(maxX-minX)*b/nbuckets, h=minX+(maxX-minX)*(b+1)/nbuckets;
      var sum=0,n=0;
      for (var i=0;i<sxs.length;i++){if(sxs[i]>=l && sxs[i]<h){sum+=sys[i];n++;}}
      var m=n>0?sum/n:0;
      bx.push(l,h,null); by.push(m,m,null);
    }
    var t1 = {x:sxs,y:sys,mode:'markers',type:'scatter',name:'Training data',marker:{color:T.accent,size:7,opacity:0.6}};
    var t2 = {x:bx,y:by,mode:'lines',type:'scatter',name:'Tree (depth=3) prediction',line:{color:'#4ecdc4',width:3}};
    var layout = Object.assign({}, common, {title:{text:'Decision Tree fits sin(x) as a staircase',font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l4-tree-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 2. Feature importances bar
  var elI = document.getElementById('plot-l4-importance-en');
  if (elI){
    var feats = ['worst concave points','worst perimeter','worst area','mean concave points','worst radius','mean perimeter','mean area','worst texture','mean radius','area error'];
    var imps = [0.18,0.14,0.12,0.10,0.08,0.07,0.06,0.05,0.04,0.03];
    var t1 = {x:imps.slice().reverse(), y:feats.slice().reverse(), type:'bar', orientation:'h', marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Random Forest feature importances (top 10)',font:{color:T.text,size:14}},xaxis:{title:'Importance',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{automargin:true,gridcolor:T.grid},margin:{t:50,r:30,b:50,l:160},showlegend:false});
    Plotly.newPlot('plot-l4-importance-en',[t1],layout,{responsive:true,displayModeBar:false});
  }

  // 3. Boosting: train vs val loss curves
  var elB = document.getElementById('plot-l4-boosting-en');
  if (elB){
    var iters=[]; var trL=[]; var valL=[];
    for (var i=1;i<=200;i++){
      iters.push(i);
      trL.push(0.7*Math.exp(-i/35) + 0.05);
      valL.push(0.7*Math.exp(-i/25) + 0.18 + 0.0006*Math.max(0,i-80));
    }
    var t1 = {x:iters,y:trL,mode:'lines',type:'scatter',name:'Train loss',line:{color:'#4ecdc4',width:2}};
    var t2 = {x:iters,y:valL,mode:'lines',type:'scatter',name:'Validation loss',line:{color:T.accent,width:3}};
    var bestIter = 80;
    var t3 = {x:[bestIter,bestIter],y:[0,0.8],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'},name:'best ~80'};
    var layout = Object.assign({}, common, {title:{text:'Gradient boosting: train vs validation loss',font:{color:T.text,size:14}},xaxis:{title:'Number of trees',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Log loss',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l4-boosting-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  // 4. Decision boundaries (heatmap on moons)
  var elBd = document.getElementById('plot-l4-boundaries-en');
  if (elBd){
    var nx=60, ny=60;
    var Z1=[], Z2=[];
    var xR=[-1.5, 2.5], yR=[-1.0, 1.5];
    for (var j=0;j<ny;j++){
      var rowS=[], rowD=[];
      for (var i=0;i<nx;i++){
        var x=xR[0]+(xR[1]-xR[0])*i/(nx-1);
        var y=yR[0]+(yR[1]-yR[0])*j/(ny-1);
        // shallow tree: 4 axis-aligned regions
        var s = (x > 0.5) ? 1 : 0;
        if (y > 0.5) s = 1 - s;
        rowS.push(s);
        // deep tree: more wiggly
        var d = ( (x*x + (y-0.3)*(y-0.3) < 0.6) ^ (Math.sin(3*x)>0) ) ? 1 : 0;
        rowD.push(d);
      }
      Z1.push(rowS); Z2.push(rowD);
    }
    var xs=[], ys=[];
    for (var i=0;i<nx;i++){xs.push(xR[0]+(xR[1]-xR[0])*i/(nx-1));}
    for (var j=0;j<ny;j++){ys.push(yR[0]+(yR[1]-yR[0])*j/(ny-1));}
    var hm1 = {x:xs,y:ys,z:Z1,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.4)'],[1,'rgba(248,113,113,0.4)']],showscale:false,xaxis:'x',yaxis:'y'};
    var hm2 = {x:xs,y:ys,z:Z2,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.4)'],[1,'rgba(248,113,113,0.4)']],showscale:false,xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Decision boundaries: shallow tree vs deep tree',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'x1 (shallow tree)',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'x1 (deep tree, overfits)',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l4-boundaries-en',[hm1,hm2],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elTtr = document.getElementById('plot-l4-tree-tr');
  if (elTtr){
    var r=rng(7); var xs=[],ys=[];
    for (var i=0;i<100;i++){var x=5*Math.random();xs.push(x);ys.push(Math.sin(x)+0.15*(r()-0.5));}
    var pairs=xs.map(function(x,i){return [x,ys[i]];}).sort(function(a,b){return a[0]-b[0];});
    var sxs=pairs.map(function(p){return p[0];}); var sys=pairs.map(function(p){return p[1];});
    var minX=0, maxX=5; var nbuckets=8;
    var bx=[],by=[];
    for (var b=0;b<nbuckets;b++){
      var l=minX+(maxX-minX)*b/nbuckets, h=minX+(maxX-minX)*(b+1)/nbuckets;
      var sum=0,n=0;
      for (var i=0;i<sxs.length;i++){if(sxs[i]>=l && sxs[i]<h){sum+=sys[i];n++;}}
      var m=n>0?sum/n:0;
      bx.push(l,h,null); by.push(m,m,null);
    }
    var t1 = {x:sxs,y:sys,mode:'markers',type:'scatter',name:'Egitim verisi',marker:{color:T.accent,size:7,opacity:0.6}};
    var t2 = {x:bx,y:by,mode:'lines',type:'scatter',name:'Karar agaci (derinlik=3)',line:{color:'#4ecdc4',width:3}};
    var layout = Object.assign({}, common, {title:{text:'Karar agaci sin(x) i merdiven gibi uydurur',font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l4-tree-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  var elItr = document.getElementById('plot-l4-importance-tr');
  if (elItr){
    var feats = ['worst concave points','worst perimeter','worst area','mean concave points','worst radius','mean perimeter','mean area','worst texture','mean radius','area error'];
    var imps = [0.18,0.14,0.12,0.10,0.08,0.07,0.06,0.05,0.04,0.03];
    var t1 = {x:imps.slice().reverse(), y:feats.slice().reverse(), type:'bar', orientation:'h', marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Random Forest ozellik onemleri (ilk 10)',font:{color:T.text,size:14}},xaxis:{title:'Onem',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{automargin:true,gridcolor:T.grid},margin:{t:50,r:30,b:50,l:160},showlegend:false});
    Plotly.newPlot('plot-l4-importance-tr',[t1],layout,{responsive:true,displayModeBar:false});
  }

  var elBtr = document.getElementById('plot-l4-boosting-tr');
  if (elBtr){
    var iters=[]; var trL=[]; var valL=[];
    for (var i=1;i<=200;i++){
      iters.push(i);
      trL.push(0.7*Math.exp(-i/35) + 0.05);
      valL.push(0.7*Math.exp(-i/25) + 0.18 + 0.0006*Math.max(0,i-80));
    }
    var t1 = {x:iters,y:trL,mode:'lines',type:'scatter',name:'Egitim kaybi',line:{color:'#4ecdc4',width:2}};
    var t2 = {x:iters,y:valL,mode:'lines',type:'scatter',name:'Dogrulama kaybi',line:{color:T.accent,width:3}};
    var t3 = {x:[80,80],y:[0,0.8],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'},name:'en iyi ~80'};
    var layout = Object.assign({}, common, {title:{text:'Gradient boosting: egitim vs dogrulama kaybi',font:{color:T.text,size:14}},xaxis:{title:'Agac sayisi',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Log kayip',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l4-boosting-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  var elBdtr = document.getElementById('plot-l4-boundaries-tr');
  if (elBdtr){
    var nx=60, ny=60;
    var Z1=[], Z2=[];
    var xR=[-1.5, 2.5], yR=[-1.0, 1.5];
    for (var j=0;j<ny;j++){
      var rowS=[], rowD=[];
      for (var i=0;i<nx;i++){
        var x=xR[0]+(xR[1]-xR[0])*i/(nx-1);
        var y=yR[0]+(yR[1]-yR[0])*j/(ny-1);
        var s = (x > 0.5) ? 1 : 0;
        if (y > 0.5) s = 1 - s;
        rowS.push(s);
        var d = ( (x*x + (y-0.3)*(y-0.3) < 0.6) ^ (Math.sin(3*x)>0) ) ? 1 : 0;
        rowD.push(d);
      }
      Z1.push(rowS); Z2.push(rowD);
    }
    var xs=[], ys=[];
    for (var i=0;i<nx;i++){xs.push(xR[0]+(xR[1]-xR[0])*i/(nx-1));}
    for (var j=0;j<ny;j++){ys.push(yR[0]+(yR[1]-yR[0])*j/(ny-1));}
    var hm1 = {x:xs,y:ys,z:Z1,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.4)'],[1,'rgba(248,113,113,0.4)']],showscale:false,xaxis:'x',yaxis:'y'};
    var hm2 = {x:xs,y:ys,z:Z2,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.4)'],[1,'rgba(248,113,113,0.4)']],showscale:false,xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Karar sinirlari: sig agac vs derin agac',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'x1 (sig agac)',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'x1 (derin agac, asiri uyar)',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l4-boundaries-tr',[hm1,hm2],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Ağaç tabanlı modeller, tablo verisinde en tutarlı kazanan algoritma sınıfıdır.</strong> 2022'de tablo görevlerindeki Kaggle yarışmaları üzerine yapılan bir araştırma, gradient boosting'in (XGBoost, LightGBM, CatBoost) büyük çoğunluğu kazandığını buldu. Derin öğrenme çağında bile, satır-sütun verisi olduğunda doğru cevap neredeyse her zaman bir random forest veya gradient-boosted tree ile başlar.</p>

<p class="l-text">Bu derste ağaçları sıfırdan inşa ediyoruz: tek bir karar ağacının nasıl ayrıldığı, bilgi kazancı ve Gini saflığının gerçekte ne hesapladığı, neden bir random forest'ın yüzlerce zayıf ağacı güçlü bir tahminciye birleştirdiği ve gradient boosting'in her yeni ağacı önceki topluluğun artıklarına uydurarak nasıl bir adım daha ileri gittiği. Özellik önemi ve karar sınırı görselleştirmeleriyle bitiyoruz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>max_depth, min_samples_leaf ile DecisionTreeClassifier/Regressor eğit</li><li>n_estimators, max_features ile RandomForestClassifier eğit</li><li>GradientBoostingClassifier ve HistGradientBoosting eğit</li><li>Önemli özellikleri belirlemek için feature_importances_ oku</li><li>Tek ağaç ile topluluk bias-variance dengesini karşılaştır</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Karar Ağaçları: Saf Olana Kadar Evet/Hayır Soruları</h2>

<p class="l-text">Bir karar ağacı, özellikler hakkında evet/hayır sorularının özyinelemeli yapısıdır. Her düğümde algoritma en iyi özelliği ve en iyi bölme noktasını seçer, veriyi iki çocuğa ayırır ve her yaprak saf olana (tek sınıf) veya bir durdurma kuralı devreye girene kadar tekrarlar.</p>

<div class="calc-highlight"><strong>Ağaçlar neden özeldir:</strong> ölçekleme varsayımı YAPMAZLAR, doğrusal olmayan etkileşimleri yerel olarak yönetirler, sayısal VE kategorik veride çalışırlar ve yorumlanabilirler -- ağacı kelimenin tam anlamıyla yazdırıp akış şeması gibi okuyabilirsiniz. Dezavantaj: tek bir ağaç yüksek varyanslıdır, sıklıkla aşırı uyar ve küçük veri değişikliklerine duyarlıdır. Düzeltme topluluklardır (Bölüm 3'ten itibaren).</div>

<p class="l-text">Sınıflandırma için bölme kriteri genellikle <strong>Gini saflığı</strong> veya <strong>entropi</strong>dir. Her ikisi de bir düğümdeki etiketlerin ne kadar "karışık" olduğunu ölçer:</p>

<div class="katex-block">$$\\text{Gini}(S) = 1 - \\sum_{k=1}^{K} p_k^2, \\qquad \\text{Entropy}(S) = -\\sum_{k=1}^{K} p_k \\log_2 p_k$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$p_k$</div><div class="card-body">Düğümdeki k sınıfı örneklerinin oranı. $\\sum p_k = 1$.</div></div>
<div class="calc-card"><div class="card-title">Gini</div><div class="card-body">Saf olduğunda 0 (tek sınıf), uniformken maksimum 1-1/K. sklearn varsayılanı. Entropiden biraz daha hızlı.</div></div>
<div class="calc-card"><div class="card-title">Entropi</div><div class="card-body">Saf olduğunda 0, uniformken maksimum $\\log_2 K$. Pratikte Gini ile aynı şekildedir.</div></div>
<div class="calc-card"><div class="card-title">$K$</div><div class="card-body">Sınıf sayısı. İkili sınıflandırma için her iki metrik de yalnızca $p_1$'e bağlıdır.</div></div>
<div class="calc-card"><div class="card-title">Saf düğüm</div><div class="card-body">Tüm örnekler aynı sınıfa sahip. Daha fazla bölmeye gerek yok.</div></div>
<div class="calc-card"><div class="card-title">Yaprak tahmini</div><div class="card-body">Yaprağa ulaşan eğitim örneklerinin çoğunluk sınıfı.</div></div>
</div>

<p class="l-text">Bir bölmenin kalitesi <strong>bilgi kazancıdır</strong> -- böldüğümüzde saflığın ne kadar düştüğü:</p>

<div class="katex-block">$$\\text{IG} = \\text{Impurity}(S) - \\frac{|S_L|}{|S|}\\text{Impurity}(S_L) - \\frac{|S_R|}{|S|}\\text{Impurity}(S_R)$$</div>

<p class="l-text">Ağaç algoritması her düğümde her özelliği ve her eşiği tarar, bilgi kazancını maksimize eden (özellik, eşik) çiftini seçer ve çocuklarda özyineler. Açgözlü doğa, tek bir ağacın neden aşırı uyabileceğini açıklar -- daima küresel olarak en iyi ağacı değil, yerel olarak en iyi bölmeyi alır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier, export_text
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">import</span> numpy <span class="kw">as</span> np

iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

clf = <span class="fn">DecisionTreeClassifier</span>(criterion=<span class="str">"gini"</span>, max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>)
clf.<span class="fn">fit</span>(X_tr, y_tr)

<span class="fn">print</span>(f<span class="str">"Test dogrulugu: {clf.score(X_te, y_te):.3f}"</span>)

<span class="fn">print</span>(<span class="fn">export_text</span>(clf, feature_names=iris.feature_names))

sample = X_te[:<span class="num">1</span>]
path = clf.<span class="fn">decision_path</span>(sample)
<span class="fn">print</span>(<span class="str">"Ornek 0 icin ziyaret edilen dugumler:"</span>, path.indices)
<span class="fn">print</span>(<span class="str">"Tahmin edilen sinif:"</span>, clf.<span class="fn">predict</span>(sample))</code></pre></div>

<p class="l-text"><strong>Burada işleyen mantık:</strong> 1) Iris'i yükler ve okunabilecek kadar küçük kalması için derinliği sınırlı bir ağaç oluşturur (<code>max_depth=3</code>). 2) <code>export_text</code> ağacı bir akış şeması olarak yazdırır -- her yolu yukarıdan aşağı okuyarak yeni bir örneği sınıflandıran kuralı görebilirsiniz. 3) İlk bölme "petal length &lt;= 2.45" -- bu setosa'yı (sınıf 0) diğer iki türden mükemmel şekilde ayırır. 4) Sonraki bölmeler petal genişliği ve uzunluğu kullanarak versicolor'ı virginica'dan ayırır. 5) <code>decision_path</code> belirli bir örneğin hangi düğümleri ziyaret ettiğini söyler -- bireysel tahminleri debug etmek veya kural tabanlı açıklamalar inşa etmek için harika.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">max_depth</div><div class="card-body">Maksimum ağaç derinliği. Düşük = daha basit, daha fazla sapma. Varsayılan None (saf olana kadar büyür).</div></div>
<div class="calc-card"><div class="card-title">min_samples_split</div><div class="card-body">Bir düğümü bölmek için gereken minimum örnek. Varsayılan 2. Gürültülü veride 10-50'ye artırın.</div></div>
<div class="calc-card"><div class="card-title">min_samples_leaf</div><div class="card-body">Bir yapraktaki minimum örnek. Varsayılan 1. 5'e ayarlamak tahminleri kararlı kılar.</div></div>
<div class="calc-card"><div class="card-title">max_features</div><div class="card-body">Bölme başına dikkate alınacak özellik sayısı. None=hepsi (ağaçlar için varsayılan), forest için "sqrt".</div></div>
<div class="calc-card"><div class="card-title">criterion</div><div class="card-body">"gini" (varsayılan) veya "entropy". Neredeyse aynı performans.</div></div>
<div class="calc-card"><div class="card-title">ccp_alpha</div><div class="card-body">Maliyet-karmaşıklık budama. Daha büyük değerler daha çok budar.</div></div>
</div>

<div class="l-warn"><strong>Tek ağaçlar fena aşırı uyar.</strong> Sınırlandırılmamış bir <code>DecisionTreeClassifier</code> her yaprakta 1 örnek olana kadar bölmeye devam eder -- %100 eğitim doğruluğu, testte çöp. Daima <code>max_depth</code> veya <code>min_samples_leaf</code> ayarlayın veya doğrudan bir forest'a geçin.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Regresyon için Karar Ağaçları</h2>

<p class="l-text">Regresyon için bölme kriteri varyans azaltma (MSE azaltma) olarak da adlandırılır. Ağaç, veri bölündüğünde hedef varyansının ne kadar küçüldüğünü maksimize eden bölmeleri seçer. Yaprak tahmini, yaprağa düşen eğitim hedeflerinin ortalamasıdır.</p>

<div class="katex-block">$$\\text{MSE}(S) = \\frac{1}{|S|}\\sum_{i \\in S}(y_i - \\bar{y}_S)^2$$</div>

<p class="l-text">Bir regresyon ağacı parçalı sabit bir yaklaşımdır. Tahminler her yaprak bölgesi içinde düzdür ve sınırlarda atlar. Ağaçlar herhangi bir fonksiyonu uydurabilir, ama eksen-hizalı basamak sınırlarıyla, dolayısıyla pürüzsüz yüzeylerde çok iyi değildirler.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeRegressor

np.random.<span class="fn">seed</span>(<span class="num">0</span>)
X = np.<span class="fn">sort</span>(<span class="num">5</span> * np.random.<span class="fn">rand</span>(<span class="num">100</span>, <span class="num">1</span>), axis=<span class="num">0</span>)
y = np.<span class="fn">sin</span>(X.<span class="fn">ravel</span>()) + <span class="num">0.1</span> * np.random.<span class="fn">randn</span>(<span class="num">100</span>)

reg = <span class="fn">DecisionTreeRegressor</span>(max_depth=<span class="num">3</span>)
reg.<span class="fn">fit</span>(X, y)

X_grid = np.<span class="fn">linspace</span>(<span class="num">0</span>, <span class="num">5</span>, <span class="num">500</span>).<span class="fn">reshape</span>(-<span class="num">1</span>, <span class="num">1</span>)
y_pred = reg.<span class="fn">predict</span>(X_grid)
<span class="fn">print</span>(<span class="str">"Agac derinligi:"</span>, reg.<span class="fn">get_depth</span>())
<span class="fn">print</span>(<span class="str">"Yaprak sayisi:"</span>, reg.<span class="fn">get_n_leaves</span>())</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) 1B'de gürültülü bir sinüs eğrisi oluşturur -- regresyon esnekliğinin klasik testi. 2) Bize en fazla $2^3=8$ yaprak veren derinlik-3 regresyon ağacını uydurur. 3) Çizim için ince bir grid üzerinde tahmin eder. 4) Çıktı bir basamak fonksiyonudur: her yaprak içerdiği eğitim örneklerinin y ortalamasını döndürür, dolayısıyla tahminler bir bölge içinde düzdür ve bölme eşiklerinde atlar. max_depth'i artırın merdiven daha ince olur; sonunda her eğitim noktasını uydurur ama testte gürültü tahmin eder.</p>

<div id="plot-l4-tree-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Burada ne görüyoruz:</strong> Derinlik-3 karar ağacı tarafından yaklaşılan gürültülü bir sinüs eğrisi. Pürüzsüz turuncu noktalar eğitim verisi; merdiven turkuaz çizgi ağacın tahminidir. Eksen-hizalı, parçalı sabit doğaya dikkat edin: her "basamak" bir yaprak bölgesine karşılık gelir. Daha derin ağaçlarla merdiven daha incedir; daha sığ ağaçlarla daha kabadır. Bu ağaçların indüktif önyargısıdır -- keskin sınırlarda (kural tabanlı olgular) mükemmeldirler ve pürüzsüz eğrilerde (doğrusal/sinüsoidal olgular) zayıftırlar.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Random Forest'lar: Birçok Ağacı Bagging</h2>

<p class="l-text">Tek bir karar ağacı yüksek varyansa sahiptir: küçük veri değişiklikleri çılgınca farklı bir ağaç üretir. <strong>Bagging</strong> (Bootstrap AGGregatING) bootstrap örnekleri (yerine koymalı örnekleme) üzerinde birçok ağacı eğiterek ve tahminlerini ortalayarak varyansı azaltır. <strong>Random Forest'lar</strong> bir hile daha ekler: her bölmede yalnızca rastgele bir özellik alt kümesi dikkate alınır. Bu ağaçları birbirinden ilişkisizleştirir, ortalamayı daha etkili hâle getirir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Bootstrap örneği</div><div class="card-body">Eğitim verisinden yerine koyarak n satır örnekle. Yaklaşık %63'ü benzersiz; geri kalanı out-of-bag (OOB).</div></div>
<div class="calc-card"><div class="card-title">Topla</div><div class="card-body">Regresyon tahminlerini ortala, sınıflandırmada oy ver. Bağımsızsa varyans 1/n_trees ile küçülür.</div></div>
<div class="calc-card"><div class="card-title">Özellik altörneklemesi</div><div class="card-body">Her bölmede yalnızca sqrt(p) özellik (sınıflandırma) veya p/3 (regresyon). Ağaçları decorrelate eder.</div></div>
<div class="calc-card"><div class="card-title">OOB hatası</div><div class="card-body">Her ağaç için, görmediği ~%37 eğitim satırında değerlendir. Ücretsiz doğrulama.</div></div>
<div class="calc-card"><div class="card-title">Paralel</div><div class="card-body">Ağaçlar bağımsızdır; <code>n_jobs=-1</code> tüm CPU çekirdeklerini kullanır.</div></div>
<div class="calc-card"><div class="card-title">Aykırı değerlere dayanıklı</div><div class="card-body">Her ağaç farklı bir bootstrap'te eğitilir, dolayısıyla aykırı değerler her ağaçta görünmez.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">import</span> numpy <span class="kw">as</span> np

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

rf = <span class="fn">RandomForestClassifier</span>(
    n_estimators=<span class="num">300</span>,
    max_depth=<span class="kw">None</span>,
    min_samples_leaf=<span class="num">2</span>,
    max_features=<span class="str">"sqrt"</span>,
    oob_score=<span class="kw">True</span>,
    n_jobs=-<span class="num">1</span>,
    random_state=<span class="num">42</span>,
)
rf.<span class="fn">fit</span>(X_tr, y_tr)

<span class="fn">print</span>(f<span class="str">"OOB skor: {rf.oob_score_:.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"Test dogrulugu: {rf.score(X_te, y_te):.3f}"</span>)

imp = rf.feature_importances_
order = np.<span class="fn">argsort</span>(imp)[::-<span class="num">1</span>]
<span class="fn">print</span>(<span class="str">"\\nEn onemli ilk 5 ozellik:"</span>)
<span class="kw">for</span> i <span class="kw">in</span> order[:<span class="num">5</span>]:
    <span class="fn">print</span>(f<span class="str">"  {data.feature_names[i]:35s}: {imp[i]:.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Breast-cancer'ı yükler. 2) <code>n_estimators=300</code> 300 ağaç demektir -- azalan getirilere kadar daha fazla daha iyidir. 3) <code>max_depth=None</code> her ağacın tam büyümesine izin verir çünkü varyans azaltma ortalamadan gelir, bireysel ağaçları sınırlamaktan değil. 4) <code>max_features="sqrt"</code> her bölmede yalnızca sqrt(30) ~ 5 özelliğin dikkate alındığı anlamına gelir -- random forest'ın imza hilesi. 5) <code>oob_score=True</code> ücretsiz bir doğrulama skoru olarak out-of-bag doğruluğunu otomatik hesaplar; genellikle test doğruluğunun 0.01 içindedir. 6) <code>n_jobs=-1</code> tüm 300 ağacı her CPU çekirdeğini kullanarak paralel eğitir. 7) <code>feature_importances_</code> her özelliğin tüm ağaçlara katkıda bulunduğu saflık azalmasını toplar ve normalleştirir -- üst özellikler modelin en çok güvendiği özelliklerdir.</p>

<div id="plot-l4-importance-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu görselin söylediği:</strong> Breast-cancer'da random forest özellik önemleri, azalan sırada. Üst üç özellik ("worst concave points", "worst perimeter", "worst area") kararların büyük kısmını oluşturur -- birkaç baskın tahmincinin sinyalin çoğunu taşıdığı tıbbi özellikler için tipiktir. Düşük öneme sahip uzun kuyruk genellikle modeli basitleştirmek için budanabilir. Bir forest'ı uydurduktan sonra daima özellik önemlerini inceleyin; ücretsiz aldığınız en ucuz yorumlanabilirliktir.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: Random forest ile NLP</div><div class="example-body">20k-kelime hazinesi TF-IDF duygu veri seti için <code>RandomForestClassifier(n_estimators=200, max_features="sqrt", n_jobs=-1)</code> eğitin. Model rekabetçi doğruluk verir (~%88) ve özellik önemleri hangi kelimelerin duyguyu yönlendirdiğini gösterir ("excellent", "garbage", "boring"). NLP için bu genellikle lojistik regresyondan yavaştır ama ücretsiz daha zengin etkileşimler üretir; verinin güçlü kelime-kelime kombinasyonları olduğundan şüphelendiğinizde yararlıdır.</div></div>

<div class="l-warn"><strong>Özellik önemi tuzağı:</strong> sklearn'in varsayılan saflık tabanlı önemi <em>yüksek kardinalite özelliklere yanlıdır</em> (sayısal sütunlar, kimlikler). Yansız önem için sklearn.inspection'dan <code>permutation_importance</code> kullanın -- her özelliği test setinde karıştırır ve doğruluk düşüşünü ölçer. Daha yavaş ama güvenilir.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Gradient Boosting: Sıralı Ağaç İnşası</h2>

<p class="l-text">Random forest'lar ağaçları paralel inşa eder, her biri bağımsızdır. Gradient boosting ağaçları <em>sıralı</em> inşa eder: her yeni ağaç önceki topluluğun <em>artıklarını</em> uydurur. Sonuç, birbirinin hatalarını ilerleyici şekilde düzelten zayıf öğreniciler zinciridir.</p>

<div class="calc-highlight"><strong>Boosting tarifi:</strong> 1) Basit bir tahminle başla (y'nin ortalaması). 2) Artıkları hesapla = gerçek - tahmin. 3) Artıklara küçük bir ağaç uydur. 4) Bu ağacın tahmininin bir kesirini (öğrenme oranı) çalışan topluluğa ekle. 5) n_estimators iterasyon için tekrarla.</div>

<div class="katex-block">$$F_{m}(x) = F_{m-1}(x) + \\eta \\cdot h_m(x), \\quad h_m \\approx -\\frac{\\partial L}{\\partial F_{m-1}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$F_m(x)$</div><div class="card-body">m. iterasyondaki topluluk tahmini. Şimdiye kadarki tüm ağaçların toplamı.</div></div>
<div class="calc-card"><div class="card-title">$\\eta$ (learning_rate)</div><div class="card-body">Adım boyutu (tipik 0.05-0.3). Küçük = daha çok ağaç gerek, ama daha iyi genelleme.</div></div>
<div class="calc-card"><div class="card-title">$h_m(x)$</div><div class="card-body">m. ağacın tahmini. Negatif gradyanı (MSE kaybı için artıklar) uydurmak için eğitilmiş.</div></div>
<div class="calc-card"><div class="card-title">Kayıp $L$</div><div class="card-body">Regresyon için kare hata, sınıflandırma için log-kayıp, vb.</div></div>
<div class="calc-card"><div class="card-title">Zayıf öğreniciler</div><div class="card-body">Her ağaç sığdır (derinlik 3-7). Topluluk toplam nedeniyle güçlüdür.</div></div>
<div class="calc-card"><div class="card-title">Sıralı</div><div class="card-body">Ağaçlar arasında paralelize edilemez. Modern kütüphaneler ağaç içinde paralelize eder.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> GradientBoostingClassifier, HistGradientBoostingClassifier
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">import</span> numpy <span class="kw">as</span> np

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

gb = <span class="fn">GradientBoostingClassifier</span>(
    n_estimators=<span class="num">200</span>,
    learning_rate=<span class="num">0.1</span>,
    max_depth=<span class="num">3</span>,
    subsample=<span class="num">0.8</span>,
    random_state=<span class="num">42</span>,
)
gb.<span class="fn">fit</span>(X_tr, y_tr)
<span class="fn">print</span>(f<span class="str">"GB test acc: {gb.score(X_te, y_te):.3f}"</span>)

hgb = <span class="fn">HistGradientBoostingClassifier</span>(
    max_iter=<span class="num">500</span>,
    learning_rate=<span class="num">0.05</span>,
    max_depth=<span class="kw">None</span>,
    early_stopping=<span class="kw">True</span>,
    validation_fraction=<span class="num">0.1</span>,
    n_iter_no_change=<span class="num">20</span>,
    random_state=<span class="num">42</span>,
)
hgb.<span class="fn">fit</span>(X_tr, y_tr)
<span class="fn">print</span>(f<span class="str">"HistGB test acc: {hgb.score(X_te, y_te):.3f}"</span>)
<span class="fn">print</span>(f<span class="str">"HistGB durdugu iterasyon: {hgb.n_iter_}"</span>)

train_loss = -gb.train_score_
<span class="fn">print</span>(f<span class="str">"1, 50, 200 agac sonrasi egitim kaybi: "</span>
      f<span class="str">"{train_loss[0]:.3f}, {train_loss[49]:.3f}, {train_loss[-1]:.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) 200 sığ ağaç (derinlik 3) ve 0.1 öğrenme oranı ile klasik <code>GradientBoostingClassifier</code> oluşturur. <code>subsample=0.8</code> ağaç başına satırların rastgele %80'ini kullanır -- düzenlileştirme ekleyen "stokastik" hile. 2) <code>HistGradientBoostingClassifier</code> sklearn'in modern hızlı varyantıdır: sürekli özellikleri 256 kova hâline getirir ve histogram tabanlı bölme bulma kullanır, LightGBM'in kullandığı aynı hile. Klasik sürümden 10-50x daha hızlıdır. 3) <code>early_stopping=True</code> eğitimin %10'unu iç doğrulama olarak ayırır; doğrulama kaybı 20 iterasyon iyileşmezse eğitim durur -- aşırı uydurmayı önler ve zaman kazandırır. 4) <code>train_score_</code> her iterasyondaki kaybı kaydeder; eğitim vs doğrulama kaybını çizmek çok fazla ağaç eklediğinizde tespit etmenin standart yoludur.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Random Forest</div><div class="compare-item">Ağaçlar paralel inşa edilir</div><div class="compare-item">Her ağaç bağımsız</div><div class="compare-item">Varyansı azaltır, sapmaya etkisi yok</div><div class="compare-item">Hiperparamlar: n_estimators, max_features</div><div class="compare-item">Ağaç başına yavaş (tam derinlik) ama paralel</div><div class="compare-item">Hiperparametrelere dayanıklı</div></div>
<div class="compare-col"><div class="compare-title">Gradient Boosting</div><div class="compare-item">Ağaçlar sıralı inşa edilir</div><div class="compare-item">Her ağaç öncekine bağlı</div><div class="compare-item">Hem sapmayı HEM varyansı azaltır</div><div class="compare-item">Hiperparamlar: n_estimators, learning_rate, max_depth</div><div class="compare-item">Ağaç başına hızlı (sığ) ama sıralı</div><div class="compare-item">Daha fazla ayar gerek; ayarlandığında daha doğru</div></div>
</div>

<div id="plot-l4-boosting-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin verdiği mesaj:</strong> Boosting iterasyonları boyunca eğitim ve doğrulama kayıp eğrileri. Erken ağaçlar büyük hataları düzelttikçe her iki kayıp da hızlıca düşer. Eğitim kaybı düşmeye devam eder ama doğrulama kaybı 80. iterasyon civarında platoya ulaşır ve hafifçe yükselmeye başlar -- bu "aşırı uyum dirseği"dir, daha çok ağaç eklemenin eğitim verisini ezberleyip genellemeye yardım etmediği nokta. Modern boosting kütüphaneleri bunu erken durdurma ile otomatize eder, ama her uygulayıcı bu eğriyi okuyabilmeli ve optimal iterasyon sayısını seçebilmelidir.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Karar Sınırları: Ağaç Modellerini Görselleştirme</h2>

<p class="l-text">Ağaçlar ve forest'lar özellik uzayını eksen-hizalı dikdörtgenlere bölerler. Bunu 2B veride görselleştirmek hangi tür problemleri iyi yönettikleri için doğru sezgiyi oluşturur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> matplotlib.pyplot <span class="kw">as</span> plt
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_moons
<span class="kw">from</span> sklearn.tree <span class="kw">import</span> DecisionTreeClassifier
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestClassifier, GradientBoostingClassifier

X, y = <span class="fn">make_moons</span>(n_samples=<span class="num">400</span>, noise=<span class="num">0.25</span>, random_state=<span class="num">0</span>)
xx, yy = np.<span class="fn">meshgrid</span>(np.<span class="fn">linspace</span>(X[:,<span class="num">0</span>].<span class="fn">min</span>()-<span class="num">0.5</span>, X[:,<span class="num">0</span>].<span class="fn">max</span>()+<span class="num">0.5</span>, <span class="num">200</span>),
                     np.<span class="fn">linspace</span>(X[:,<span class="num">1</span>].<span class="fn">min</span>()-<span class="num">0.5</span>, X[:,<span class="num">1</span>].<span class="fn">max</span>()+<span class="num">0.5</span>, <span class="num">200</span>))
grid = np.c_[xx.<span class="fn">ravel</span>(), yy.<span class="fn">ravel</span>()]

models = {
    <span class="str">"Tree d=3"</span>:  <span class="fn">DecisionTreeClassifier</span>(max_depth=<span class="num">3</span>, random_state=<span class="num">0</span>),
    <span class="str">"Tree d=10"</span>: <span class="fn">DecisionTreeClassifier</span>(max_depth=<span class="num">10</span>, random_state=<span class="num">0</span>),
    <span class="str">"RF n=100"</span>:  <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>),
    <span class="str">"GB n=100"</span>:  <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">100</span>, random_state=<span class="num">0</span>),
}

fig, axes = plt.<span class="fn">subplots</span>(<span class="num">1</span>, <span class="num">4</span>, figsize=(<span class="num">18</span>, <span class="num">4</span>))
<span class="kw">for</span> ax, (name, m) <span class="kw">in</span> <span class="fn">zip</span>(axes, models.<span class="fn">items</span>()):
    m.<span class="fn">fit</span>(X, y)
    Z = m.<span class="fn">predict_proba</span>(grid)[:, <span class="num">1</span>].<span class="fn">reshape</span>(xx.shape)
    ax.<span class="fn">contourf</span>(xx, yy, Z, levels=<span class="num">20</span>, alpha=<span class="num">0.6</span>, cmap=<span class="str">"RdBu_r"</span>)
    ax.<span class="fn">scatter</span>(X[:,<span class="num">0</span>], X[:,<span class="num">1</span>], c=y, edgecolor=<span class="str">"k"</span>, cmap=<span class="str">"RdBu_r"</span>)
    ax.<span class="fn">set_title</span>(f<span class="str">"{name}  acc={m.score(X, y):.3f}"</span>)
plt.<span class="fn">tight_layout</span>()</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Klasik iki-ay veri setini üretir -- doğrusal olarak ayrılamaz ama doğrusal olmayan modeller için önemsiz. 2) Görselleştirme için 200x200 grid oluşturur. 3) Dört model eğitir: sığ ağaç (yetersiz uyar), derin ağaç (aşırı uyar, pürüzlü sınırlar), random forest (ortalama yoluyla daha pürüzsüz), gradient boosting (benzer kalite, sıklıkla biraz daha sıkı). 4) <code>predict_proba(grid)[:, 1]</code> tüm düzlem boyunca 1. sınıfın olasılığını alır -- bu sert 0/1 tahminleri yerine pürüzsüz bir ısı haritası verir. 5) Dört panel topluluk yöntemlerinin tek bir ağaca göre nasıl daha pürüzsüz, daha güvenli karar bölgeleri ürettiğini görselleştirir. Derin ağaçlar her eğitim noktasını küçük adacıklarla ezberler; forest'lar onları ortalar.</p>

<div id="plot-l4-boundaries-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin özü:</strong> İki-ay veri setinde sığ ağaç (sol, pürüzsüz ama yetersiz uyar) ve derin ağaç (sağ, aşırı uyum adacıkları ile pürüzlü) için karar sınırları. Her ikisini bir random forest'ın çizeceği zarif pürüzsüz-ama-doğru sınırla karşılaştırın -- 100 pürüzlü ağacın ortalamasıdır ve ortalama gürültüyü iptal ederken sinyali korur. Bu görselleştirme topluluklamanın arkasındaki "çok yanlış bir doğru yapar" sezgisinin ML eşdeğeridir.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Pratik Öneriler ve Karşılaştırma</h2>

<p class="l-text">Hangi ağaç tabanlı modele ne zaman ulaşmalısınız? İşte uygulayıcının karar ağacı (kelimenin tam anlamıyla).</p>

<div class="calc-step"><strong>RandomForestClassifier (veya Regressor) ile başlayın</strong>: <code>n_estimators=300, max_depth=None, min_samples_leaf=2, max_features="sqrt", n_jobs=-1, random_state=42</code>. Sağlam, hızlı, ilk sonuçlar için ayar gerektirmez.</div>

<div class="calc-step"><strong>Doğruluğun bir takviyeye ihtiyacı varsa, HistGradientBoostingClassifier'a geçin</strong>: <code>max_iter=500, learning_rate=0.05, early_stopping=True</code>. Tablo verisinde RF'den genellikle %1-3 daha iyi, benzer hız.</div>

<div class="calc-step"><strong>En son performans gerekirse, XGBoost veya LightGBM yükleyin</strong>. sklearn'de değildirler ama aynı API'yi izlerler -- içeri takın. Daha fazla ayar düğmeleri ve zorlu veri setleri için biraz daha iyi varsayılanları vardır.</div>

<div class="calc-step"><strong>Ayar öncelik sırası</strong>: <code>n_estimators</code> (erken durdurma kullanın) -&gt; <code>learning_rate</code> (düşük daha iyi, 0.01-0.05) -&gt; <code>max_depth</code> (3-7) -&gt; <code>min_samples_leaf</code> -&gt; <code>subsample</code>, <code>colsample_bytree</code>. Bir seferde bir düğmeyi çapraz doğrulama ile ayarlayın.</div>

<div class="calc-step"><strong>Uydurduktan sonra daima özellik önemini kontrol edin</strong>. Yansız bir görüş için <code>permutation_importance</code> kullanın; daha yavaştır ama yüksek kardinalite özellikleri yanlış kayırmaz.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> (RandomForestClassifier, GradientBoostingClassifier,
                              HistGradientBoostingClassifier, ExtraTreesClassifier)
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">import</span> numpy <span class="kw">as</span> np

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target

models = {
    <span class="str">"LogReg"</span>:     <span class="fn">LogisticRegression</span>(max_iter=<span class="num">2000</span>),
    <span class="str">"RandomForest"</span>: <span class="fn">RandomForestClassifier</span>(n_estimators=<span class="num">300</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">0</span>),
    <span class="str">"ExtraTrees"</span>: <span class="fn">ExtraTreesClassifier</span>(n_estimators=<span class="num">300</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">0</span>),
    <span class="str">"GradientBoost"</span>: <span class="fn">GradientBoostingClassifier</span>(n_estimators=<span class="num">200</span>, random_state=<span class="num">0</span>),
    <span class="str">"HistGB"</span>:     <span class="fn">HistGradientBoostingClassifier</span>(max_iter=<span class="num">300</span>, random_state=<span class="num">0</span>),
}

<span class="fn">print</span>(f<span class="str">"{'Model':<14}{'CV ort.':>10}  {'CV std':>8}"</span>)
<span class="kw">for</span> name, m <span class="kw">in</span> models.<span class="fn">items</span>():
    scores = <span class="fn">cross_val_score</span>(m, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"roc_auc"</span>, n_jobs=-<span class="num">1</span>)
    <span class="fn">print</span>(f<span class="str">"{name:<14}{scores.mean():>10.4f}  {scores.std():>8.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Breast-cancer'da 5 modeli 5-fold çapraz doğrulanmış ROC-AUC ile karşılaştırır. 2) <code>ExtraTreesClassifier</code> eğlenceli bir kuzendir: özellikler arasında en iyi bölmeyi seçmek yerine bölme eşiklerini <em>rastgele</em> seçer; bu random forest'tan bile daha fazla çeşitlilik ekler, sıklıkla biraz daha iyi doğrulukla ve marjinal olarak daha hızlı eğitimle sonuçlanır. 3) Bu küçük temiz veri setinde farklar minimaldir -- bir baseline lojistik regresyon zaten 0.99 AUC'ye ulaştığında "kazananı" seçmek istatistiksel gürültüdür. Daha büyük gürültülü veri setlerinde gradient boosting varyantları tipik olarak %1-5 öne geçer. 4) Daima taahhüt etmeden önce birden çok modelde çapraz doğrulama çalıştırın -- sıralamalar veri setiyle değişir.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: yayın kalitesinde karşılaştırma tablosu</div><div class="example-body">Karşılaştırma çalışmanız için "Yöntem | CV AUC | CV F1 | Eğitim süresi | Çıkarım süresi | Yorumlanabilirlik" tablosu istersiniz. Yukarıdaki 5 modeli artı bir MLP ve süslü transformer'ınızı çalıştırın; 5 fold boyunca ortalama +/- std raporlayın. Tablo yalnızca doğruluğu değil gerçekçi takasları da iletir. Hakemler bunu sever çünkü dağıtım bağlamını anladığınızı gösterir -- çıkarım süresi üç katına çıkarsa %0.5 AUC kazancı anlamsızdır.</div></div>

<div class="think-box"><div class="think-label">ÖZET ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Karar ağaçları bilgi kazancını (Gini veya entropi azalması) maksimize eden (özellik, eşik) çiftlerinde böler.<br><strong>2.</strong> Tek ağaçlar aşırı uyar; daima <code>max_depth</code> veya <code>min_samples_leaf</code> sınırlayın veya topluluklara geçin.<br><strong>3.</strong> Random forest'lar tam-büyümüş birçok ağacı bagging eder; rastgelelik satırların bootstrap'lenmesinden VE her bölmede özellik altörneklemesinden gelir.<br><strong>4.</strong> Gradient boosting ağaçları sıralı inşa eder, her biri önceki topluluğun artıklarını uydurur -- ağaç başına daha zayıf ama topluluk olarak daha güçlü.<br><strong>5.</strong> <code>HistGradientBoostingClassifier</code> modern hızlı sklearn boosting'idir; LightGBM/XGBoost daha da hızlıdır.<br><strong>6.</strong> Ağaçlar özellik ölçeklemesi gerektirmez -- yalnızca "x_j &gt; t?" sorar.<br><strong>7.</strong> Uydurduktan sonra <code>feature_importances_</code>'u inceleyin; yansız değerler için <code>permutation_importance</code> kullanın.<br><strong>8.</strong> Varsayılan tarif: önce RandomForest, doğruluk önemliyse HistGB, üretimde son %1-2 için XGBoost/LightGBM.</div></div>
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

  // 1. Tree regression: stair fit on sin(x)
  var elT = document.getElementById('plot-l4-tree-en');
  if (elT){
    var r=rng(7); var xs=[],ys=[];
    for (var i=0;i<100;i++){var x=5*Math.random();xs.push(x);ys.push(Math.sin(x)+0.15*(r()-0.5));}
    var pairs=xs.map(function(x,i){return [x,ys[i]];}).sort(function(a,b){return a[0]-b[0];});
    var sxs=pairs.map(function(p){return p[0];}); var sys=pairs.map(function(p){return p[1];});
    // crude depth-3 tree: 8 buckets of equal x range
    var minX=0, maxX=5; var nbuckets=8;
    var bx=[],by=[];
    for (var b=0;b<nbuckets;b++){
      var l=minX+(maxX-minX)*b/nbuckets, h=minX+(maxX-minX)*(b+1)/nbuckets;
      var sum=0,n=0;
      for (var i=0;i<sxs.length;i++){if(sxs[i]>=l && sxs[i]<h){sum+=sys[i];n++;}}
      var m=n>0?sum/n:0;
      bx.push(l,h,null); by.push(m,m,null);
    }
    var t1 = {x:sxs,y:sys,mode:'markers',type:'scatter',name:'Training data',marker:{color:T.accent,size:7,opacity:0.6}};
    var t2 = {x:bx,y:by,mode:'lines',type:'scatter',name:'Tree (depth=3) prediction',line:{color:'#4ecdc4',width:3}};
    var layout = Object.assign({}, common, {title:{text:'Decision Tree fits sin(x) as a staircase',font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l4-tree-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 2. Feature importances bar
  var elI = document.getElementById('plot-l4-importance-en');
  if (elI){
    var feats = ['worst concave points','worst perimeter','worst area','mean concave points','worst radius','mean perimeter','mean area','worst texture','mean radius','area error'];
    var imps = [0.18,0.14,0.12,0.10,0.08,0.07,0.06,0.05,0.04,0.03];
    var t1 = {x:imps.slice().reverse(), y:feats.slice().reverse(), type:'bar', orientation:'h', marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Random Forest feature importances (top 10)',font:{color:T.text,size:14}},xaxis:{title:'Importance',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{automargin:true,gridcolor:T.grid},margin:{t:50,r:30,b:50,l:160},showlegend:false});
    Plotly.newPlot('plot-l4-importance-en',[t1],layout,{responsive:true,displayModeBar:false});
  }

  // 3. Boosting: train vs val loss curves
  var elB = document.getElementById('plot-l4-boosting-en');
  if (elB){
    var iters=[]; var trL=[]; var valL=[];
    for (var i=1;i<=200;i++){
      iters.push(i);
      trL.push(0.7*Math.exp(-i/35) + 0.05);
      valL.push(0.7*Math.exp(-i/25) + 0.18 + 0.0006*Math.max(0,i-80));
    }
    var t1 = {x:iters,y:trL,mode:'lines',type:'scatter',name:'Train loss',line:{color:'#4ecdc4',width:2}};
    var t2 = {x:iters,y:valL,mode:'lines',type:'scatter',name:'Validation loss',line:{color:T.accent,width:3}};
    var bestIter = 80;
    var t3 = {x:[bestIter,bestIter],y:[0,0.8],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'},name:'best ~80'};
    var layout = Object.assign({}, common, {title:{text:'Gradient boosting: train vs validation loss',font:{color:T.text,size:14}},xaxis:{title:'Number of trees',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Log loss',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l4-boosting-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  // 4. Decision boundaries (heatmap on moons)
  var elBd = document.getElementById('plot-l4-boundaries-en');
  if (elBd){
    var nx=60, ny=60;
    var Z1=[], Z2=[];
    var xR=[-1.5, 2.5], yR=[-1.0, 1.5];
    for (var j=0;j<ny;j++){
      var rowS=[], rowD=[];
      for (var i=0;i<nx;i++){
        var x=xR[0]+(xR[1]-xR[0])*i/(nx-1);
        var y=yR[0]+(yR[1]-yR[0])*j/(ny-1);
        // shallow tree: 4 axis-aligned regions
        var s = (x > 0.5) ? 1 : 0;
        if (y > 0.5) s = 1 - s;
        rowS.push(s);
        // deep tree: more wiggly
        var d = ( (x*x + (y-0.3)*(y-0.3) < 0.6) ^ (Math.sin(3*x)>0) ) ? 1 : 0;
        rowD.push(d);
      }
      Z1.push(rowS); Z2.push(rowD);
    }
    var xs=[], ys=[];
    for (var i=0;i<nx;i++){xs.push(xR[0]+(xR[1]-xR[0])*i/(nx-1));}
    for (var j=0;j<ny;j++){ys.push(yR[0]+(yR[1]-yR[0])*j/(ny-1));}
    var hm1 = {x:xs,y:ys,z:Z1,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.4)'],[1,'rgba(248,113,113,0.4)']],showscale:false,xaxis:'x',yaxis:'y'};
    var hm2 = {x:xs,y:ys,z:Z2,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.4)'],[1,'rgba(248,113,113,0.4)']],showscale:false,xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Decision boundaries: shallow tree vs deep tree',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'x1 (shallow tree)',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'x1 (deep tree, overfits)',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l4-boundaries-en',[hm1,hm2],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elTtr = document.getElementById('plot-l4-tree-tr');
  if (elTtr){
    var r=rng(7); var xs=[],ys=[];
    for (var i=0;i<100;i++){var x=5*Math.random();xs.push(x);ys.push(Math.sin(x)+0.15*(r()-0.5));}
    var pairs=xs.map(function(x,i){return [x,ys[i]];}).sort(function(a,b){return a[0]-b[0];});
    var sxs=pairs.map(function(p){return p[0];}); var sys=pairs.map(function(p){return p[1];});
    var minX=0, maxX=5; var nbuckets=8;
    var bx=[],by=[];
    for (var b=0;b<nbuckets;b++){
      var l=minX+(maxX-minX)*b/nbuckets, h=minX+(maxX-minX)*(b+1)/nbuckets;
      var sum=0,n=0;
      for (var i=0;i<sxs.length;i++){if(sxs[i]>=l && sxs[i]<h){sum+=sys[i];n++;}}
      var m=n>0?sum/n:0;
      bx.push(l,h,null); by.push(m,m,null);
    }
    var t1 = {x:sxs,y:sys,mode:'markers',type:'scatter',name:'Egitim verisi',marker:{color:T.accent,size:7,opacity:0.6}};
    var t2 = {x:bx,y:by,mode:'lines',type:'scatter',name:'Karar agaci (derinlik=3)',line:{color:'#4ecdc4',width:3}};
    var layout = Object.assign({}, common, {title:{text:'Karar ağacı sin(x) i merdiven gibi uydurur',font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l4-tree-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  var elItr = document.getElementById('plot-l4-importance-tr');
  if (elItr){
    var feats = ['worst concave points','worst perimeter','worst area','mean concave points','worst radius','mean perimeter','mean area','worst texture','mean radius','area error'];
    var imps = [0.18,0.14,0.12,0.10,0.08,0.07,0.06,0.05,0.04,0.03];
    var t1 = {x:imps.slice().reverse(), y:feats.slice().reverse(), type:'bar', orientation:'h', marker:{color:T.accent,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var layout = Object.assign({}, common, {title:{text:'Random Forest ozellik onemleri (ilk 10)',font:{color:T.text,size:14}},xaxis:{title:'Onem',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{automargin:true,gridcolor:T.grid},margin:{t:50,r:30,b:50,l:160},showlegend:false});
    Plotly.newPlot('plot-l4-importance-tr',[t1],layout,{responsive:true,displayModeBar:false});
  }

  var elBtr = document.getElementById('plot-l4-boosting-tr');
  if (elBtr){
    var iters=[]; var trL=[]; var valL=[];
    for (var i=1;i<=200;i++){
      iters.push(i);
      trL.push(0.7*Math.exp(-i/35) + 0.05);
      valL.push(0.7*Math.exp(-i/25) + 0.18 + 0.0006*Math.max(0,i-80));
    }
    var t1 = {x:iters,y:trL,mode:'lines',type:'scatter',name:'Egitim kaybi',line:{color:'#4ecdc4',width:2}};
    var t2 = {x:iters,y:valL,mode:'lines',type:'scatter',name:'Dogrulama kaybi',line:{color:T.accent,width:3}};
    var t3 = {x:[80,80],y:[0,0.8],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'},name:'en iyi ~80'};
    var layout = Object.assign({}, common, {title:{text:'Gradient boosting: eğitim vs doğrulama kaybı',font:{color:T.text,size:14}},xaxis:{title:'Agac sayisi',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Log kayip',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l4-boosting-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  var elBdtr = document.getElementById('plot-l4-boundaries-tr');
  if (elBdtr){
    var nx=60, ny=60;
    var Z1=[], Z2=[];
    var xR=[-1.5, 2.5], yR=[-1.0, 1.5];
    for (var j=0;j<ny;j++){
      var rowS=[], rowD=[];
      for (var i=0;i<nx;i++){
        var x=xR[0]+(xR[1]-xR[0])*i/(nx-1);
        var y=yR[0]+(yR[1]-yR[0])*j/(ny-1);
        var s = (x > 0.5) ? 1 : 0;
        if (y > 0.5) s = 1 - s;
        rowS.push(s);
        var d = ( (x*x + (y-0.3)*(y-0.3) < 0.6) ^ (Math.sin(3*x)>0) ) ? 1 : 0;
        rowD.push(d);
      }
      Z1.push(rowS); Z2.push(rowD);
    }
    var xs=[], ys=[];
    for (var i=0;i<nx;i++){xs.push(xR[0]+(xR[1]-xR[0])*i/(nx-1));}
    for (var j=0;j<ny;j++){ys.push(yR[0]+(yR[1]-yR[0])*j/(ny-1));}
    var hm1 = {x:xs,y:ys,z:Z1,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.4)'],[1,'rgba(248,113,113,0.4)']],showscale:false,xaxis:'x',yaxis:'y'};
    var hm2 = {x:xs,y:ys,z:Z2,type:'heatmap',colorscale:[[0,'rgba(78,205,196,0.4)'],[1,'rgba(248,113,113,0.4)']],showscale:false,xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Karar sınırları: sığ ağaç vs derin ağaç',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'x1 (sig agac)',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'x1 (derin agac, asiri uyar)',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{title:'x2',gridcolor:T.grid,zerolinecolor:T.zero},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l4-boundaries-tr',[hm1,hm2],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
