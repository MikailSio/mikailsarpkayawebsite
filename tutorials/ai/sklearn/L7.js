window.SKLEARN_L7 = {

en: `<p class="l-text"><strong>Two unrelated topics live in this lesson, but both are essential.</strong> First, regression metrics: how do you score a model that predicts numbers, not classes? MSE, RMSE, MAE, R-squared, and MAPE each tell a different story, and picking the wrong one can hide your model's real weakness. Second, clustering: the unsupervised counterpart to classification. KMeans, DBSCAN, hierarchical -- when you do not have labels but want to discover structure.</p>

<p class="l-text">By the end you will know which regression metric to report for which problem (and how to interpret it), how the KMeans algorithm actually iterates, why DBSCAN finds shapes that KMeans cannot, and how to choose the number of clusters using silhouette and elbow methods.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Compute regression metrics (MAE, MSE, RMSE, R²)</li><li>Read residual plots for model diagnostics</li><li>Train KMeans and pick k with elbow + silhouette</li><li>Use DBSCAN for density-based clustering</li><li>Compare clusters with ARI and silhouette score</li><li>Choose between KMeans and DBSCAN based on data shape</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Regression Metrics: MSE, RMSE, MAE</h2>

<p class="l-text">For a regression problem with predictions $\\hat{y}_i$ and ground truth $y_i$, the three most common error metrics are:</p>

<div class="katex-block">$$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2, \\quad \\text{RMSE} = \\sqrt{\\text{MSE}}, \\quad \\text{MAE} = \\frac{1}{n}\\sum_{i=1}^{n}|y_i - \\hat{y}_i|$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MSE</div><div class="card-body">Mean squared error. Penalizes large errors quadratically -- one outlier-sized error dominates. Same units as $y^2$.</div></div>
<div class="calc-card"><div class="card-title">RMSE</div><div class="card-body">Root MSE. Same units as y, easier to interpret. Default loss for many regressors.</div></div>
<div class="calc-card"><div class="card-title">MAE</div><div class="card-body">Mean absolute error. Penalizes errors linearly. Robust to outliers; same units as y.</div></div>
<div class="calc-card"><div class="card-title">MAPE</div><div class="card-body">Mean absolute percentage error: $\\frac{1}{n}\\sum |y - \\hat{y}|/|y|$. Good when scale varies, breaks if y can be 0.</div></div>
<div class="calc-card"><div class="card-title">Median AE</div><div class="card-body">Median of absolute errors. Even more robust than MAE -- 50% of errors are below this number.</div></div>
<div class="calc-card"><div class="card-title">Max error</div><div class="card-body">Worst-case absolute error. Critical for safety-sensitive applications.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_california_housing
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor, GradientBoostingRegressor
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> (mean_squared_error, mean_absolute_error,
                             mean_absolute_percentage_error, median_absolute_error,
                             max_error, r2_score)

data = <span class="fn">fetch_california_housing</span>()
X, y = data.data, data.target   <span class="cm"># y in units of $100k</span>
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>)

reg = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">100</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_tr, y_tr)
y_pred = reg.<span class="fn">predict</span>(X_te)

<span class="fn">print</span>(f<span class="str">"MSE          : {mean_squared_error(y_te, y_pred):.4f}    (squared $100k)"</span>)
<span class="fn">print</span>(f<span class="str">"RMSE         : {mean_squared_error(y_te, y_pred, squared=False):.4f}    ($100k)"</span>)
<span class="fn">print</span>(f<span class="str">"MAE          : {mean_absolute_error(y_te, y_pred):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Median AE    : {median_absolute_error(y_te, y_pred):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"MAPE         : {mean_absolute_percentage_error(y_te, y_pred):.4f}    (fraction)"</span>)
<span class="fn">print</span>(f<span class="str">"Max error    : {max_error(y_te, y_pred):.4f}    ($100k)"</span>)
<span class="fn">print</span>(f<span class="str">"R-squared    : {r2_score(y_te, y_pred):.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads California housing dataset (continuous target, in units of $100k). 2) Trains a random forest regressor and predicts on test. 3) Each metric is one line; pay attention to the units. <strong>RMSE = 0.50</strong> means a typical prediction is off by $50,000. <strong>MAE = 0.33</strong> means the median absolute deviation is smaller -- because RMSE is dragged up by a few large errors. 4) <strong>MAPE = 0.18</strong> means typical predictions are off by 18% of the true value -- useful for log-distributed targets. 5) <strong>Max error = 5.0</strong> means at least one prediction is off by $500,000 -- a safety red flag in production. 6) <strong>R-squared = 0.81</strong> means the model explains 81% of variance, leaving 19% as noise/missing-feature error.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Use MSE / RMSE when</div><div class="compare-item">Big errors are disproportionately bad</div><div class="compare-item">Errors are roughly Gaussian</div><div class="compare-item">You want the loss to match what your model optimizes (most regressors minimize MSE)</div><div class="compare-item">Default for OLS, neural networks</div></div>
<div class="compare-col"><div class="compare-title">Use MAE when</div><div class="compare-item">Outliers exist and you do not want them to dominate</div><div class="compare-item">All errors should be equally costly</div><div class="compare-item">You want a median-style robust score</div><div class="compare-item">Default for quantile regression, Huber</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. R-squared: The Coefficient of Determination</h2>

<p class="l-text">R-squared answers: "what fraction of the variance in y is explained by the model?"</p>

<div class="katex-block">$$R^2 = 1 - \\frac{\\sum_i (y_i - \\hat{y}_i)^2}{\\sum_i (y_i - \\bar{y})^2} = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\text{SS}_{\\text{res}}$</div><div class="card-body">Residual sum of squares. Total squared error of your model.</div></div>
<div class="calc-card"><div class="card-title">$\\text{SS}_{\\text{tot}}$</div><div class="card-body">Total sum of squares. Variance of y times n. The error of "always predict the mean".</div></div>
<div class="calc-card"><div class="card-title">$R^2 = 1$</div><div class="card-body">Perfect predictions, no residual error.</div></div>
<div class="calc-card"><div class="card-title">$R^2 = 0$</div><div class="card-body">Model is no better than predicting the mean of y.</div></div>
<div class="calc-card"><div class="card-title">$R^2 < 0$</div><div class="card-body">Model is WORSE than the mean -- yes this happens, especially with overfit models on test data.</div></div>
<div class="calc-card"><div class="card-title">Adjusted $R^2$</div><div class="card-body">Penalizes for adding more features (avoids inflation when you add predictors). Not in sklearn but easy to compute.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> r2_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Decompose by hand to build intuition</span>
y_mean = y_te.<span class="fn">mean</span>()
ss_tot = ((y_te - y_mean)**<span class="num">2</span>).<span class="fn">sum</span>()
ss_res = ((y_te - y_pred)**<span class="num">2</span>).<span class="fn">sum</span>()
r2_manual = <span class="num">1</span> - ss_res / ss_tot
<span class="fn">print</span>(f<span class="str">"Manual R-squared: {r2_manual:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"sklearn R-squared: {r2_score(y_te, y_pred):.4f}"</span>)

<span class="cm"># A negative R-squared example</span>
bad_pred = np.<span class="fn">full_like</span>(y_te, y_te.<span class="fn">mean</span>() + <span class="num">5</span>)   <span class="cm"># always predict mean+5</span>
<span class="fn">print</span>(f<span class="str">"Bad prediction R-squared: {r2_score(y_te, bad_pred):.4f}"</span>)
<span class="cm"># Negative because we are worse than predicting the mean</span>

<span class="cm"># Adjusted R-squared (avoid inflation from adding features)</span>
n, p = X_te.shape
adj_r2 = <span class="num">1</span> - (<span class="num">1</span> - <span class="fn">r2_score</span>(y_te, y_pred)) * (n - <span class="num">1</span>) / (n - p - <span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">"Adjusted R-squared: {adj_r2:.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Computes R-squared by hand to demystify the formula: <code>1 - SS_res / SS_tot</code>. 2) Confirms sklearn matches. 3) Demonstrates a model that always predicts mean+5 -- it gets a negative R-squared because it is worse than predicting just the mean (which would give R-squared=0). This is a common pitfall: a poorly-fit model on test data can have negative R-squared, even though it has zero R-squared on training data. 4) Adjusted R-squared subtracts a penalty for the number of features p; useful when comparing models with different feature counts on the same data.</p>

<div id="plot-l7-residual-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A residual plot -- predicted values on the x-axis, residuals (true minus predicted) on the y-axis. Healthy regression has residuals randomly scattered around zero with no pattern; the spread should be roughly constant across the range of predictions (homoscedasticity). The orange band shows the +/- 1 RMSE region. Patterns in the residuals (a curve, an increasing fan, a clear cluster) reveal model failures: you have missed a nonlinear feature, you have heteroscedastic noise, or there is a subgroup the model handles poorly. Always plot residuals after fitting any regression model.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: thesis-grade regression report</div><div class="example-body">For your thesis chapter on rating prediction, the table should show RMSE, MAE, MAPE, and R-squared per model. RMSE picks the loss-optimization perspective; MAE picks the robust perspective; MAPE handles cross-product comparison; R-squared handles overall fit quality. Including all four shows reviewers you understand the trade-offs and have not cherry-picked the best metric for your headline.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. KMeans: The Workhorse of Clustering</h2>

<p class="l-text">Clustering is the unsupervised version of classification: find groups of similar points <em>without</em> labels. KMeans is the most widely used algorithm. It assumes you know the number of clusters K and finds them by alternating two steps:</p>

<div class="calc-step"><strong>Initialize:</strong> pick K random centroids (or use kmeans++ for smarter initialization).</div>
<div class="calc-step"><strong>Assign:</strong> each data point is assigned to the nearest centroid (Euclidean distance).</div>
<div class="calc-step"><strong>Update:</strong> each centroid is moved to the mean of its assigned points.</div>
<div class="calc-step"><strong>Repeat</strong> until assignments stop changing (convergence). Usually takes 10-30 iterations.</div>

<p class="l-text">The objective KMeans minimizes is the within-cluster sum of squared distances, called <strong>inertia</strong>:</p>

<div class="katex-block">$$\\text{Inertia} = \\sum_{k=1}^{K} \\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|_2^2$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$C_k$</div><div class="card-body">Set of points assigned to cluster k.</div></div>
<div class="calc-card"><div class="card-title">$\\mu_k$</div><div class="card-body">Centroid of cluster k. Stored as <code>cluster_centers_[k]</code> after fit.</div></div>
<div class="calc-card"><div class="card-title">Distance metric</div><div class="card-body">Always Euclidean. Cosine and other distances need different algorithms (e.g. spherical k-means).</div></div>
<div class="calc-card"><div class="card-title">Local optimum</div><div class="card-body">KMeans converges to a local minimum -- different inits can give different results. Use n_init=10 to take the best.</div></div>
<div class="calc-card"><div class="card-title">kmeans++</div><div class="card-body">Smart initialization (default in sklearn): picks distant points as starting centroids. Much faster convergence.</div></div>
<div class="calc-card"><div class="card-title">Scaling required</div><div class="card-body">Always StandardScaler before KMeans -- distances depend on units.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_blobs

X, y_true = <span class="fn">make_blobs</span>(n_samples=<span class="num">500</span>, centers=<span class="num">4</span>, cluster_std=<span class="num">0.8</span>, random_state=<span class="num">0</span>)
X_scaled = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

km = <span class="fn">KMeans</span>(n_clusters=<span class="num">4</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>)
km.<span class="fn">fit</span>(X_scaled)
labels = km.labels_                  <span class="cm"># cluster assignment per point</span>
centers = km.cluster_centers_        <span class="cm"># (4, 2) array of centroids</span>
inertia = km.inertia_                <span class="cm"># within-cluster SS</span>
n_iter = km.n_iter_                  <span class="cm"># iterations to converge</span>
<span class="fn">print</span>(f<span class="str">"Inertia: {inertia:.2f}"</span>)
<span class="fn">print</span>(f<span class="str">"Converged in {n_iter} iterations"</span>)
<span class="fn">print</span>(<span class="str">"Cluster centers:"</span>)
<span class="fn">print</span>(centers)

<span class="cm"># Predict cluster for new points</span>
new_pts = np.<span class="fn">array</span>([[<span class="num">0.0</span>, <span class="num">0.0</span>], [<span class="num">3.0</span>, <span class="num">3.0</span>]])
new_labels = km.<span class="fn">predict</span>(<span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X).<span class="fn">transform</span>(new_pts))
<span class="fn">print</span>(f<span class="str">"New points assigned to clusters: {new_labels}"</span>)

<span class="cm"># Compare to true labels (only because make_blobs gave them)</span>
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> adjusted_rand_score
<span class="fn">print</span>(f<span class="str">"Adjusted Rand Index vs true: {adjusted_rand_score(y_true, labels):.3f}"</span>)
<span class="cm"># 1.0 = perfect, 0.0 = random</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates 4 well-separated 2D blobs as the test case. 2) Scales features (always before KMeans). 3) Fits KMeans with K=4 and <code>n_init=10</code> -- runs 10 random initializations and keeps the best (lowest inertia). 4) After fitting, <code>labels_</code> holds the assigned cluster for each input point, <code>cluster_centers_</code> holds the learned centroids, and <code>inertia_</code> is the final objective value. 5) <code>predict</code> assigns new points to the nearest existing centroid -- KMeans <em>can</em> do inference, unlike many clustering algorithms. 6) <code>adjusted_rand_score</code> compares discovered labels to true labels (when available); 1.0 means perfect match, 0.0 means random. ARI handles the fact that cluster <em>numbering</em> is arbitrary -- it does not care if you called the same group 0 or 3.</p>

<div id="plot-l7-kmeans-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> KMeans clustering of 500 synthetic points colored by their assigned cluster, with the four centroids drawn as larger black markers. The four blobs are recovered cleanly because they are spherical and well-separated -- the assumption KMeans is built on. If the true clusters had been elongated, intersecting, or of very different sizes, KMeans would struggle. This is the fundamental limitation: KMeans assumes Gaussian-like spherical clusters.</div>

<div class="l-warn"><strong>KMeans limitations:</strong> assumes spherical clusters, equal cluster sizes, and you know K in advance. For elongated, density-varying, or noisy data, use DBSCAN or hierarchical clustering. For "I don't know K" use the elbow method or silhouette analysis (next sections).</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Choosing K: Elbow and Silhouette</h2>

<p class="l-text">The biggest practical question with KMeans: how do I pick K? Two methods.</p>

<p class="l-text"><strong>Elbow method</strong>: plot inertia vs K. Inertia always decreases as K grows (more centroids fit data tighter), but the marginal benefit of adding another cluster diminishes. The "elbow" -- where the curve bends -- is your candidate K.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> silhouette_score
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_blobs

X, _ = <span class="fn">make_blobs</span>(n_samples=<span class="num">500</span>, centers=<span class="num">4</span>, cluster_std=<span class="num">0.8</span>, random_state=<span class="num">0</span>)
Xs = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

<span class="cm"># Elbow: inertia for K = 1..10</span>
ks = <span class="fn">range</span>(<span class="num">1</span>, <span class="num">11</span>)
inertias = []
silhouettes = []
<span class="kw">for</span> k <span class="kw">in</span> ks:
    km = <span class="fn">KMeans</span>(n_clusters=k, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xs)
    inertias.<span class="fn">append</span>(km.inertia_)
    <span class="kw">if</span> k >= <span class="num">2</span>:
        silhouettes.<span class="fn">append</span>(<span class="fn">silhouette_score</span>(Xs, km.labels_))
    <span class="kw">else</span>:
        silhouettes.<span class="fn">append</span>(np.nan)

<span class="fn">print</span>(<span class="str">"K    Inertia      Silhouette"</span>)
<span class="kw">for</span> k, i, s <span class="kw">in</span> <span class="fn">zip</span>(ks, inertias, silhouettes):
    <span class="fn">print</span>(f<span class="str">"{k:<5}{i:>10.2f}    {s:.3f}"</span> <span class="kw">if</span> k >= <span class="num">2</span> <span class="kw">else</span> f<span class="str">"{k:<5}{i:>10.2f}    --"</span>)

best_k = np.<span class="fn">nanargmax</span>(silhouettes) + <span class="num">1</span>
<span class="fn">print</span>(f<span class="str">"Silhouette suggests K = {best_k}"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Sweeps K from 1 to 10 and records both inertia and silhouette score. 2) Inertia decreases monotonically -- the elbow appears where the rate of decrease slows. For 4 true clusters, you typically see a sharp drop until K=4, then a flat region. 3) Silhouette score (next paragraph) typically peaks at the true K. 4) <code>nanargmax</code> picks the K with the best silhouette (skipping NaN at K=1).</p>

<p class="l-text"><strong>Silhouette score</strong> measures how similar a point is to its own cluster vs the next-nearest cluster. For each point i:</p>

<div class="katex-block">$$s_i = \\frac{b_i - a_i}{\\max(a_i, b_i)} \\in [-1, 1]$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a_i$</div><div class="card-body">Mean distance from i to other points in its own cluster (cohesion).</div></div>
<div class="calc-card"><div class="card-title">$b_i$</div><div class="card-body">Mean distance from i to all points in the next-nearest cluster (separation).</div></div>
<div class="calc-card"><div class="card-title">$s_i = 1$</div><div class="card-body">Point is far from neighboring clusters and tightly grouped with own cluster -- ideal.</div></div>
<div class="calc-card"><div class="card-title">$s_i = 0$</div><div class="card-body">Point is on the boundary between two clusters -- could go either way.</div></div>
<div class="calc-card"><div class="card-title">$s_i &lt; 0$</div><div class="card-body">Point is closer to a different cluster than its own -- likely misassigned.</div></div>
<div class="calc-card"><div class="card-title">Mean silhouette</div><div class="card-body">Average $s_i$ across all points. Common range: 0.3-0.7 for "good" clustering. Above 0.7 is excellent.</div></div>
</div>

<div id="plot-l7-elbow-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The classic elbow chart on the four-blob synthetic data. Inertia drops dramatically from K=1 to K=4 because adding more centroids genuinely captures more structure. After K=4, the marginal gain from adding clusters is small -- the curve flattens. The "elbow" at K=4 is the sweet spot. The silhouette curve (right panel) confirms this with its peak at K=4. When elbow and silhouette agree, you can be confident; when they disagree, default to silhouette (it has a cleaner statistical interpretation).</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. DBSCAN: Density-Based Clustering</h2>

<p class="l-text">DBSCAN takes a completely different approach: instead of assuming a number of clusters, it finds dense regions of points separated by sparse regions. It can discover non-spherical, irregularly-shaped clusters AND identify outliers as "noise" points.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">eps</div><div class="card-body">Neighborhood radius. Two points within eps are "neighbors". Critical hyperparameter.</div></div>
<div class="calc-card"><div class="card-title">min_samples</div><div class="card-body">Minimum points in an eps-neighborhood for a point to be a "core" point. Default 5.</div></div>
<div class="calc-card"><div class="card-title">Core point</div><div class="card-body">Has at least min_samples neighbors within eps. Density centers.</div></div>
<div class="calc-card"><div class="card-title">Border point</div><div class="card-body">Within eps of a core point but not itself a core. Sits on cluster edges.</div></div>
<div class="calc-card"><div class="card-title">Noise point</div><div class="card-body">Neither core nor border. Labeled -1 by sklearn. Outliers.</div></div>
<div class="calc-card"><div class="card-title">No K</div><div class="card-body">Number of clusters is determined by the data, not a parameter.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> DBSCAN, KMeans
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_moons

X, _ = <span class="fn">make_moons</span>(n_samples=<span class="num">500</span>, noise=<span class="num">0.06</span>, random_state=<span class="num">0</span>)
Xs = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

<span class="cm"># KMeans on moons -- it FAILS (gives a vertical split, not two moons)</span>
km = <span class="fn">KMeans</span>(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xs)
<span class="fn">print</span>(f<span class="str">"KMeans clusters: {np.unique(km.labels_)}"</span>)

<span class="cm"># DBSCAN on moons -- it SUCCEEDS</span>
db = <span class="fn">DBSCAN</span>(eps=<span class="num">0.20</span>, min_samples=<span class="num">5</span>).<span class="fn">fit</span>(Xs)
<span class="fn">print</span>(f<span class="str">"DBSCAN clusters: {np.unique(db.labels_)}"</span>)
n_clusters = <span class="fn">len</span>(<span class="fn">set</span>(db.labels_)) - (<span class="num">1</span> <span class="kw">if</span> -<span class="num">1</span> <span class="kw">in</span> db.labels_ <span class="kw">else</span> <span class="num">0</span>)
n_noise = (db.labels_ == -<span class="num">1</span>).<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"  Found {n_clusters} clusters, {n_noise} noise points"</span>)

<span class="cm"># Tuning eps using k-distance plot</span>
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>).<span class="fn">fit</span>(Xs)
distances, _ = nn.<span class="fn">kneighbors</span>(Xs)
distances_sorted = np.<span class="fn">sort</span>(distances[:, -<span class="num">1</span>])
<span class="cm"># Plot distances_sorted -- the "knee" is a good eps</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Generates the two-moons dataset -- non-spherical, classic "KMeans fails" example. 2) KMeans with K=2 splits the data with a vertical line, NOT into the two moons (because the moons interlock geometrically). 3) DBSCAN with appropriate <code>eps</code> finds the two moons cleanly because it follows density rather than distance to centroids. 4) DBSCAN automatically labels far-away points as noise (-1) -- handy for outlier detection on the same pass. 5) Choosing eps: the k-distance plot shows the distance from each point to its k-th nearest neighbor (sorted); the "knee" of this plot is a good eps. Modern alternative: use HDBSCAN which auto-tunes eps internally.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">KMeans</div><div class="compare-item">Specify K in advance</div><div class="compare-item">Assumes spherical, equal-size clusters</div><div class="compare-item">Cannot identify outliers</div><div class="compare-item">Predicts on new data</div><div class="compare-item">Fast: O(n*K*iters)</div><div class="compare-item">Best for: many balanced groups</div></div>
<div class="compare-col"><div class="compare-title">DBSCAN</div><div class="compare-item">No K -- discovers it</div><div class="compare-item">Finds arbitrary shapes</div><div class="compare-item">Labels noise as -1</div><div class="compare-item">No prediction on new data (refit needed)</div><div class="compare-item">Slower: O(n log n) with index</div><div class="compare-item">Best for: density-based, outlier-aware</div></div>
</div>

<div id="plot-l7-dbscan-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> Two-moons dataset clustered by KMeans (left, fails -- splits across the moons) vs DBSCAN (right, succeeds -- recovers the two crescent shapes). The dark "noise" points (labeled -1) on the DBSCAN side are outliers identified automatically. This visual is the canonical demo of why one-size-fits-all clustering does not exist: KMeans is right for some datasets, DBSCAN for others, hierarchical for yet others. Always plot 2D projections after clustering and judge the result against your expectations.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hierarchical Clustering and Choosing the Right Algorithm</h2>

<p class="l-text">Hierarchical clustering builds a tree (dendrogram) of nested clusters, either bottom-up (agglomerative -- start with each point as its own cluster, merge nearest pairs) or top-down (divisive). You "cut" the dendrogram at a chosen height to get a flat clustering.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> AgglomerativeClustering
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_blobs
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

X, _ = <span class="fn">make_blobs</span>(n_samples=<span class="num">200</span>, centers=<span class="num">4</span>, cluster_std=<span class="num">0.7</span>, random_state=<span class="num">0</span>)
Xs = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

<span class="cm"># Linkage options control how cluster distance is computed</span>
<span class="kw">for</span> linkage <span class="kw">in</span> [<span class="str">"ward"</span>, <span class="str">"average"</span>, <span class="str">"complete"</span>, <span class="str">"single"</span>]:
    ac = <span class="fn">AgglomerativeClustering</span>(n_clusters=<span class="num">4</span>, linkage=linkage)
    labels = ac.<span class="fn">fit_predict</span>(Xs)
    <span class="fn">print</span>(f<span class="str">"{linkage:<10} cluster sizes: {np.bincount(labels)}"</span>)
<span class="cm"># ward       cluster sizes: [50 50 50 50]   <- balanced, recommended default</span>
<span class="cm"># average    cluster sizes: [50 50 50 50]</span>
<span class="cm"># complete   cluster sizes: [54 49 51 46]</span>
<span class="cm"># single     cluster sizes: [101  44  35  20]   <- chains -- often unbalanced</span>

<span class="cm"># scipy provides the dendrogram for visualization</span>
<span class="kw">from</span> scipy.cluster.hierarchy <span class="kw">import</span> linkage <span class="kw">as</span> scipy_linkage, dendrogram
Z = <span class="fn">scipy_linkage</span>(Xs[:<span class="num">30</span>], method=<span class="str">"ward"</span>)
<span class="cm"># dendrogram(Z) plots the tree</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds 4 well-separated blobs and scales. 2) Tries four linkage methods: <code>ward</code> minimizes within-cluster variance (most popular, balanced clusters), <code>average</code> uses mean pairwise distance, <code>complete</code> uses max pairwise distance (compact clusters), <code>single</code> uses min pairwise distance (chain-like clusters, prone to elongation). 3) For balanced data, ward is the safest default. 4) The scipy dendrogram visualizes the merge order and lets you choose <code>n_clusters</code> by inspecting the tree -- if you cut at a high level you get few big clusters; lower cut gives finer ones.</p>

<div class="calc-step"><strong>Algorithm selection cheat sheet:</strong></div>
<div class="calc-step"><strong>KMeans</strong>: I know K, clusters look spherical, fast inference needed.</div>
<div class="calc-step"><strong>DBSCAN/HDBSCAN</strong>: clusters have irregular shapes, outliers exist, K is unknown.</div>
<div class="calc-step"><strong>AgglomerativeClustering (Ward)</strong>: small dataset (&lt; 10k), want a dendrogram for exploration, no need for new-point prediction.</div>
<div class="calc-step"><strong>GaussianMixture</strong>: clusters overlap softly, you want probabilistic membership, not in this lesson.</div>
<div class="calc-step"><strong>Spectral clustering</strong>: graph-like data or non-convex clusters, computationally expensive but powerful.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP topic discovery</div><div class="example-body">For 5000 NLP papers, you want to discover the underlying topics. Pipeline: TfidfVectorizer -&gt; TruncatedSVD (50 dims) -&gt; KMeans (start with K=20). Inspect cluster centroids by printing the top TF-IDF words per cluster -- meaningful labels often emerge ("transformer attention BERT", "embeddings word2vec GloVe", "LSTM RNN sequence"). For thesis-grade work, also try DBSCAN to identify outlier papers and HDBSCAN for hierarchical topic structure.</div></div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Regression metrics: MSE/RMSE penalize big errors quadratically, MAE penalizes linearly (robust); MAPE is scale-invariant, R-squared measures explained variance.<br><strong>2.</strong> Always check residual plots after fitting a regressor -- patterns reveal model failures invisible in summary metrics.<br><strong>3.</strong> R-squared can be negative on test data; that means the model is worse than predicting the mean.<br><strong>4.</strong> KMeans is fast and simple but assumes spherical equal-size clusters; ALWAYS scale features first.<br><strong>5.</strong> Choose K via elbow method (inertia bend) or silhouette score (peaks at the right K). When they agree, trust them.<br><strong>6.</strong> DBSCAN finds arbitrary shapes and identifies outliers automatically -- the right tool for non-spherical or noisy data.<br><strong>7.</strong> Hierarchical clustering (ward linkage) builds a dendrogram useful for exploration; choose <code>n_clusters</code> by cutting the tree.<br><strong>8.</strong> No clustering algorithm is universally best -- always run 2-3 alternatives and judge by visualization plus domain knowledge.</div></div>
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

  // 1. Residual plot
  var elR = document.getElementById('plot-l7-residual-en');
  if (elR){
    var r = rng(11);
    var preds=[], resid=[];
    for (var i=0;i<300;i++){
      var p = 0.5 + 4*r();
      var noise = (r()-0.5)*0.6;
      var slight_pattern = 0.05*(p-2.5);
      preds.push(p);
      resid.push(noise + slight_pattern);
    }
    var t1 = {x:preds,y:resid,mode:'markers',type:'scatter',name:'Residuals',marker:{color:T.accent,size:6,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2 = {x:[0.5,4.5],y:[0,0],mode:'lines',type:'scatter',name:'zero',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'},showlegend:false};
    var rmse = 0.5;
    var bandU = {x:[0.5,4.5],y:[rmse,rmse],mode:'lines',type:'scatter',line:{color:'rgba(248,113,113,0.4)',dash:'dot',width:1},name:'+/- RMSE',showlegend:false};
    var bandL = {x:[0.5,4.5],y:[-rmse,-rmse],mode:'lines',type:'scatter',line:{color:'rgba(248,113,113,0.4)',dash:'dot',width:1},showlegend:false};
    var layout = Object.assign({}, common, {title:{text:'Residuals vs predicted (California housing model)',font:{color:T.text,size:14}},xaxis:{title:'Predicted value ($100k)',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Residual (true - predicted)',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-residual-en',[t1,t2,bandU,bandL],layout,{responsive:true,displayModeBar:false});
  }

  function makeBlobs(n,centers,std,seed){
    var r = rng(seed); var xs=[],ys=[],lab=[];
    var per = Math.floor(n/centers.length);
    for (var c=0;c<centers.length;c++){
      for (var i=0;i<per;i++){
        var u=r(), v=r();
        var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
        xs.push(centers[c][0]+std*z0);
        ys.push(centers[c][1]+std*z1);
        lab.push(c);
      }
    }
    return {xs:xs,ys:ys,labels:lab};
  }

  // 2. KMeans on blobs
  var elK = document.getElementById('plot-l7-kmeans-en');
  if (elK){
    var B = makeBlobs(500,[[0,0],[5,5],[5,0],[0,5]],0.7,7);
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa'];
    var traces=[];
    for (var c=0;c<4;c++){
      var xs=[],ys=[];
      for (var i=0;i<B.labels.length;i++){if(B.labels[i]===c){xs.push(B.xs[i]);ys.push(B.ys[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'Cluster '+c,marker:{color:palette[c],size:7,opacity:0.65,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var centers = {x:[0,5,5,0],y:[0,5,0,5],mode:'markers',type:'scatter',name:'centroids',marker:{color:'#000',size:18,symbol:'x',line:{color:T.text,width:2}}};
    var layout = Object.assign({}, common, {title:{text:'KMeans on 4 synthetic blobs (clean recovery)',font:{color:T.text,size:14}},xaxis:{title:'Feature 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Feature 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-kmeans-en',traces.concat([centers]),layout,{responsive:true,displayModeBar:false});
  }

  // 3. Elbow + silhouette
  var elE = document.getElementById('plot-l7-elbow-en');
  if (elE){
    var ks=[1,2,3,4,5,6,7,8,9,10];
    var inertias=[1000,560,360,200,180,170,162,158,155,153];
    var sil=[null,0.58,0.66,0.72,0.61,0.55,0.50,0.46,0.43,0.40];
    var t1 = {x:ks,y:inertias,mode:'lines+markers',type:'scatter',name:'Inertia',line:{color:T.accent,width:3},marker:{size:8},xaxis:'x',yaxis:'y'};
    var t2 = {x:ks,y:sil,mode:'lines+markers',type:'scatter',name:'Silhouette',line:{color:'#4ecdc4',width:3},marker:{size:8},xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Elbow method (left) + Silhouette (right)',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'K',gridcolor:T.grid,zerolinecolor:T.zero,dtick:1},
      yaxis:{title:'Inertia',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'K',gridcolor:T.grid,zerolinecolor:T.zero,dtick:1},
      yaxis2:{title:'Silhouette',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l7-elbow-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 4. Moons: KMeans vs DBSCAN
  var elD = document.getElementById('plot-l7-dbscan-en');
  if (elD){
    // Generate moons
    var r=rng(13); var xs=[], ys=[], lab=[];
    for (var i=0;i<200;i++){
      var t = Math.PI*r();
      xs.push(Math.cos(t)+0.06*(r()-0.5));
      ys.push(Math.sin(t)+0.06*(r()-0.5));
      lab.push(0);
    }
    for (var i=0;i<200;i++){
      var t = Math.PI*r();
      xs.push(1-Math.cos(t)+0.06*(r()-0.5));
      ys.push(0.5-Math.sin(t)+0.06*(r()-0.5));
      lab.push(1);
    }
    // KMeans-ish: split by x=0.5
    var kmL=[];
    for (var i=0;i<xs.length;i++) kmL.push(xs[i]>0.5?1:0);
    // DBSCAN: matches true labels except for some noise
    var dbL = lab.slice(); for (var i=0;i<10;i++) dbL[Math.floor(r()*xs.length)] = -1;
    var palette = [T.accent,'#4ecdc4'];
    var tr1=[], tr2=[];
    for (var c=0;c<2;c++){
      var x1=[],y1=[],x2=[],y2=[];
      for (var i=0;i<xs.length;i++){
        if(kmL[i]===c){x1.push(xs[i]);y1.push(ys[i]);}
        if(dbL[i]===c){x2.push(xs[i]);y2.push(ys[i]);}
      }
      tr1.push({x:x1,y:y1,mode:'markers',type:'scatter',name:'KM cluster '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}},xaxis:'x',yaxis:'y'});
      tr2.push({x:x2,y:y2,mode:'markers',type:'scatter',name:'DBSCAN cluster '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}},xaxis:'x2',yaxis:'y2',showlegend:false});
    }
    var noiseX=[], noiseY=[];
    for (var i=0;i<xs.length;i++){if(dbL[i]===-1){noiseX.push(xs[i]);noiseY.push(ys[i]);}}
    var noise = {x:noiseX,y:noiseY,mode:'markers',type:'scatter',name:'noise',marker:{color:'#666',size:7,symbol:'x'},xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'KMeans (left, fails) vs DBSCAN (right, succeeds) on moons',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},
      showlegend:true,legend:{font:{color:T.text}},
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l7-dbscan-en',tr1.concat(tr2).concat([noise]),layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elRtr = document.getElementById('plot-l7-residual-tr');
  if (elRtr){
    var r = rng(11);
    var preds=[], resid=[];
    for (var i=0;i<300;i++){
      var p = 0.5 + 4*r();
      var noise = (r()-0.5)*0.6;
      var slight_pattern = 0.05*(p-2.5);
      preds.push(p);
      resid.push(noise + slight_pattern);
    }
    var t1 = {x:preds,y:resid,mode:'markers',type:'scatter',name:'Artiklar',marker:{color:T.accent,size:6,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2 = {x:[0.5,4.5],y:[0,0],mode:'lines',type:'scatter',name:'sifir',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'},showlegend:false};
    var rmse = 0.5;
    var bandU = {x:[0.5,4.5],y:[rmse,rmse],mode:'lines',type:'scatter',line:{color:'rgba(248,113,113,0.4)',dash:'dot',width:1},name:'+/- RMSE',showlegend:false};
    var bandL = {x:[0.5,4.5],y:[-rmse,-rmse],mode:'lines',type:'scatter',line:{color:'rgba(248,113,113,0.4)',dash:'dot',width:1},showlegend:false};
    var layout = Object.assign({}, common, {title:{text:'Artiklar vs tahmin (California ev fiyatlari)',font:{color:T.text,size:14}},xaxis:{title:'Tahmin ($100k)',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Artik (gercek - tahmin)',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-residual-tr',[t1,t2,bandU,bandL],layout,{responsive:true,displayModeBar:false});
  }
  var elKtr = document.getElementById('plot-l7-kmeans-tr');
  if (elKtr){
    var B = makeBlobs(500,[[0,0],[5,5],[5,0],[0,5]],0.7,7);
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa'];
    var traces=[];
    for (var c=0;c<4;c++){
      var xs=[],ys=[];
      for (var i=0;i<B.labels.length;i++){if(B.labels[i]===c){xs.push(B.xs[i]);ys.push(B.ys[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'Kume '+c,marker:{color:palette[c],size:7,opacity:0.65,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var centers = {x:[0,5,5,0],y:[0,5,0,5],mode:'markers',type:'scatter',name:'merkezler',marker:{color:'#000',size:18,symbol:'x',line:{color:T.text,width:2}}};
    var layout = Object.assign({}, common, {title:{text:'4 sentetik blob uzerinde KMeans (temiz kurtarma)',font:{color:T.text,size:14}},xaxis:{title:'Ozellik 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Ozellik 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-kmeans-tr',traces.concat([centers]),layout,{responsive:true,displayModeBar:false});
  }
  var elEtr = document.getElementById('plot-l7-elbow-tr');
  if (elEtr){
    var ks=[1,2,3,4,5,6,7,8,9,10];
    var inertias=[1000,560,360,200,180,170,162,158,155,153];
    var sil=[null,0.58,0.66,0.72,0.61,0.55,0.50,0.46,0.43,0.40];
    var t1 = {x:ks,y:inertias,mode:'lines+markers',type:'scatter',name:'Inertia',line:{color:T.accent,width:3},marker:{size:8},xaxis:'x',yaxis:'y'};
    var t2 = {x:ks,y:sil,mode:'lines+markers',type:'scatter',name:'Silhouette',line:{color:'#4ecdc4',width:3},marker:{size:8},xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Dirsek yontemi (sol) + Silhouette (sag)',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'K',gridcolor:T.grid,zerolinecolor:T.zero,dtick:1},
      yaxis:{title:'Inertia',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'K',gridcolor:T.grid,zerolinecolor:T.zero,dtick:1},
      yaxis2:{title:'Silhouette',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l7-elbow-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  var elDtr = document.getElementById('plot-l7-dbscan-tr');
  if (elDtr){
    var r=rng(13); var xs=[], ys=[], lab=[];
    for (var i=0;i<200;i++){
      var t = Math.PI*r();
      xs.push(Math.cos(t)+0.06*(r()-0.5));
      ys.push(Math.sin(t)+0.06*(r()-0.5));
      lab.push(0);
    }
    for (var i=0;i<200;i++){
      var t = Math.PI*r();
      xs.push(1-Math.cos(t)+0.06*(r()-0.5));
      ys.push(0.5-Math.sin(t)+0.06*(r()-0.5));
      lab.push(1);
    }
    var kmL=[];
    for (var i=0;i<xs.length;i++) kmL.push(xs[i]>0.5?1:0);
    var dbL = lab.slice(); for (var i=0;i<10;i++) dbL[Math.floor(r()*xs.length)] = -1;
    var palette = [T.accent,'#4ecdc4'];
    var tr1=[], tr2=[];
    for (var c=0;c<2;c++){
      var x1=[],y1=[],x2=[],y2=[];
      for (var i=0;i<xs.length;i++){
        if(kmL[i]===c){x1.push(xs[i]);y1.push(ys[i]);}
        if(dbL[i]===c){x2.push(xs[i]);y2.push(ys[i]);}
      }
      tr1.push({x:x1,y:y1,mode:'markers',type:'scatter',name:'KM kume '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}},xaxis:'x',yaxis:'y'});
      tr2.push({x:x2,y:y2,mode:'markers',type:'scatter',name:'DBSCAN kume '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}},xaxis:'x2',yaxis:'y2',showlegend:false});
    }
    var noiseX=[], noiseY=[];
    for (var i=0;i<xs.length;i++){if(dbL[i]===-1){noiseX.push(xs[i]);noiseY.push(ys[i]);}}
    var noise = {x:noiseX,y:noiseY,mode:'markers',type:'scatter',name:'gurultu',marker:{color:'#666',size:7,symbol:'x'},xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'KMeans (sol, basarisiz) vs DBSCAN (sag, basarili) -- moons',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},
      showlegend:true,legend:{font:{color:T.text}},
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l7-dbscan-tr',tr1.concat(tr2).concat([noise]),layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Bu derste iki bağlantısız konu yaşar, ama her ikisi de elzemdir.</strong> Önce regresyon metrikleri: sınıf değil sayı tahmin eden bir modeli nasıl puanlarsınız? MSE, RMSE, MAE, R-kare ve MAPE her biri farklı bir hikaye anlatır ve yanlışını seçmek modelinizin gerçek zayıflığını gizleyebilir. İkinci olarak, kümeleme: sınıflandırmanın denetimsiz karşılığı. KMeans, DBSCAN, hiyerarşik -- etiketleriniz olmadığında ama yapı keşfetmek istediğinizde.</p>

<p class="l-text">Sonunda hangi regresyon metriğini hangi problem için raporlayacağınızı (ve nasıl yorumlayacağınızı), KMeans algoritmasının gerçekte nasıl iterasyon yaptığını, DBSCAN'in KMeans'ın yapamayacağı şekilleri neden bulduğunu ve silhouette ve dirsek yöntemleri kullanarak küme sayısını nasıl seçeceğinizi bileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Regresyon metriklerini hesapla (MAE, MSE, RMSE, R²)</li><li>Model teşhisi için residual grafiklerini oku</li><li>KMeans eğit ve k'yi dirsek + silhouette ile seç</li><li>Yoğunluk tabanlı kümeleme için DBSCAN kullan</li><li>Kümeleri ARI ve silhouette skoruyla karşılaştır</li><li>Veri şekline göre KMeans ile DBSCAN arasında seçim yap</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Regresyon Metrikleri: MSE, RMSE, MAE</h2>

<p class="l-text">Tahminler $\\hat{y}_i$ ve gerçek $y_i$ olan bir regresyon problemi için en yaygın üç hata metriği:</p>

<div class="katex-block">$$\\text{MSE} = \\frac{1}{n} \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2, \\quad \\text{RMSE} = \\sqrt{\\text{MSE}}, \\quad \\text{MAE} = \\frac{1}{n}\\sum_{i=1}^{n}|y_i - \\hat{y}_i|$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MSE</div><div class="card-body">Ortalama kare hata. Büyük hataları ikinci dereceden cezalandırır -- bir aykırı boyutlu hata baskındır. Birim $y^2$.</div></div>
<div class="calc-card"><div class="card-title">RMSE</div><div class="card-body">Karekök MSE. y ile aynı birim, yorumlamak daha kolay. Birçok regresör için varsayılan kayıp.</div></div>
<div class="calc-card"><div class="card-title">MAE</div><div class="card-body">Ortalama mutlak hata. Hataları doğrusal cezalandırır. Aykırı değerlere dayanıklı; y ile aynı birim.</div></div>
<div class="calc-card"><div class="card-title">MAPE</div><div class="card-body">Ortalama mutlak yüzde hatası: $\\frac{1}{n}\\sum |y - \\hat{y}|/|y|$. Ölçek değiştiğinde iyi, y 0 olabilirse kırılır.</div></div>
<div class="calc-card"><div class="card-title">Median AE</div><div class="card-body">Mutlak hataların medyanı. MAE'den bile daha dayanıklı -- hataların %50'si bu sayının altındadır.</div></div>
<div class="calc-card"><div class="card-title">Max hata</div><div class="card-body">En kötü durum mutlak hata. Güvenlik-duyarlı uygulamalar için kritik.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_california_housing
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.ensemble <span class="kw">import</span> RandomForestRegressor
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> (mean_squared_error, mean_absolute_error,
                             mean_absolute_percentage_error, median_absolute_error,
                             max_error, r2_score)

data = <span class="fn">fetch_california_housing</span>()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>)

reg = <span class="fn">RandomForestRegressor</span>(n_estimators=<span class="num">100</span>, n_jobs=-<span class="num">1</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X_tr, y_tr)
y_pred = reg.<span class="fn">predict</span>(X_te)

<span class="fn">print</span>(f<span class="str">"MSE          : {mean_squared_error(y_te, y_pred):.4f}    (kare $100k)"</span>)
<span class="fn">print</span>(f<span class="str">"RMSE         : {mean_squared_error(y_te, y_pred, squared=False):.4f}    ($100k)"</span>)
<span class="fn">print</span>(f<span class="str">"MAE          : {mean_absolute_error(y_te, y_pred):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"Median AE    : {median_absolute_error(y_te, y_pred):.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"MAPE         : {mean_absolute_percentage_error(y_te, y_pred):.4f}    (oran)"</span>)
<span class="fn">print</span>(f<span class="str">"Max hata     : {max_error(y_te, y_pred):.4f}    ($100k)"</span>)
<span class="fn">print</span>(f<span class="str">"R-kare       : {r2_score(y_te, y_pred):.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) California ev veri setini yükler ($100k birimleri). 2) Random forest regresör eğitir ve testte tahmin eder. 3) Her metrik tek satır; birimlere dikkat. <strong>RMSE = 0.50</strong> tipik bir tahminin $50.000 hatalı olduğu anlamına gelir. <strong>MAE = 0.33</strong> medyan mutlak sapmanın daha küçük olduğu anlamına gelir -- çünkü RMSE birkaç büyük hata tarafından yukarı çekilir. 4) <strong>MAPE = 0.18</strong> tipik tahminlerin gerçek değerin %18'i kadar hatalı olduğu anlamına gelir -- log-dağılımlı hedefler için yararlı. 5) <strong>Max hata = 5.0</strong> en az bir tahminin $500.000 hatalı olduğu anlamına gelir -- üretimde güvenlik kırmızı bayrağı. 6) <strong>R-kare = 0.81</strong> modelin varyansın %81'ini açıkladığı, %19'unu gürültü/eksik-özellik hatası olarak bıraktığı anlamına gelir.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">MSE / RMSE ne zaman</div><div class="compare-item">Büyük hatalar orantısız kötüyse</div><div class="compare-item">Hatalar kabaca Gauss</div><div class="compare-item">Modeliniz optimize ettiği şeyle eşleşmesini istiyorsanız (çoğu regresör MSE minimize eder)</div><div class="compare-item">OLS, sinir ağları için varsayılan</div></div>
<div class="compare-col"><div class="compare-title">MAE ne zaman</div><div class="compare-item">Aykırı değerler var ve baskın olmalarını istemiyorsanız</div><div class="compare-item">Tüm hatalar eşit maliyetli olmalı</div><div class="compare-item">Medyan-tarzı dayanıklı skor istiyorsanız</div><div class="compare-item">Quantile regression, Huber için varsayılan</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. R-kare: Belirleme Katsayısı</h2>

<p class="l-text">R-kare şuna cevap verir: "y'deki varyansın hangi kesri model tarafından açıklanır?"</p>

<div class="katex-block">$$R^2 = 1 - \\frac{\\sum_i (y_i - \\hat{y}_i)^2}{\\sum_i (y_i - \\bar{y})^2} = 1 - \\frac{\\text{SS}_{\\text{res}}}{\\text{SS}_{\\text{tot}}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\text{SS}_{\\text{res}}$</div><div class="card-body">Artık kareler toplamı. Modelinizin toplam kare hatası.</div></div>
<div class="calc-card"><div class="card-title">$\\text{SS}_{\\text{tot}}$</div><div class="card-body">Toplam kareler. y'nin varyansı çarpı n. "Daima ortalamayı tahmin et"in hatası.</div></div>
<div class="calc-card"><div class="card-title">$R^2 = 1$</div><div class="card-body">Mükemmel tahmin, artık hata yok.</div></div>
<div class="calc-card"><div class="card-title">$R^2 = 0$</div><div class="card-body">Model y ortalamasını tahmin etmekten daha iyi değil.</div></div>
<div class="calc-card"><div class="card-title">$R^2 < 0$</div><div class="card-body">Model ortalamadan DAHA KÖTÜ -- evet bu olur, özellikle test verisinde aşırı uyan modellerde.</div></div>
<div class="calc-card"><div class="card-title">Düzeltilmiş $R^2$</div><div class="card-body">Daha çok özellik eklemek için ceza verir (tahminci eklediğinizde şişmeyi önler). sklearn'de yok ama hesaplaması kolay.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.metrics <span class="kw">import</span> r2_score
<span class="kw">import</span> numpy <span class="kw">as</span> np

y_mean = y_te.<span class="fn">mean</span>()
ss_tot = ((y_te - y_mean)**<span class="num">2</span>).<span class="fn">sum</span>()
ss_res = ((y_te - y_pred)**<span class="num">2</span>).<span class="fn">sum</span>()
r2_manual = <span class="num">1</span> - ss_res / ss_tot
<span class="fn">print</span>(f<span class="str">"Manuel R-kare: {r2_manual:.4f}"</span>)
<span class="fn">print</span>(f<span class="str">"sklearn R-kare: {r2_score(y_te, y_pred):.4f}"</span>)

bad_pred = np.<span class="fn">full_like</span>(y_te, y_te.<span class="fn">mean</span>() + <span class="num">5</span>)
<span class="fn">print</span>(f<span class="str">"Kotu tahmin R-kare: {r2_score(y_te, bad_pred):.4f}"</span>)
<span class="cm"># Negatif cunku ortalamayi tahmin etmekten kotuyuz</span>

n, p = X_te.shape
adj_r2 = <span class="num">1</span> - (<span class="num">1</span> - <span class="fn">r2_score</span>(y_te, y_pred)) * (n - <span class="num">1</span>) / (n - p - <span class="num">1</span>)
<span class="fn">print</span>(f<span class="str">"Duzeltilmis R-kare: {adj_r2:.4f}"</span>)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) R-kareyi formülü demistifiye etmek için elle hesaplar: <code>1 - SS_res / SS_tot</code>. 2) sklearn'in eşleştiğini doğrular. 3) Daima ortalama+5 tahmin eden bir model gösterir -- ortalamayı tahmin etmekten kötü olduğu için negatif R-kare alır (bu R-kare=0 verirdi). Bu yaygın bir tuzaktır: test verisinde kötü uyan bir model negatif R-kareye sahip olabilir, eğitim verisinde sıfır R-kareye sahip olsa bile. 4) Düzeltilmiş R-kare özellik sayısı p için bir ceza çıkarır; aynı veri üzerinde farklı özellik sayılarına sahip modelleri karşılaştırırken yararlı.</p>

<div id="plot-l7-residual-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> Bir artık grafiği -- tahmin değerleri x-ekseninde, artıklar (gerçek eksi tahmin) y-ekseninde. Sağlıklı regresyonun artıkları sıfır etrafında deseni olmadan rastgele dağılır; yayılma tahmin aralığında kabaca sabit olmalıdır (homoskedastisite). Turuncu bant +/- 1 RMSE bölgesini gösterir. Artıklardaki desenler (bir eğri, artan bir yelpaze, net bir küme) model arızalarını ortaya çıkarır: doğrusal olmayan bir özelliği kaçırdınız, heteroskedastik gürültünüz var veya modelin kötü işlediği bir alt grup var. Herhangi bir regresyon modelini uydurduktan sonra daima artıkları çizin.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: tez kalitesinde regresyon raporu</div><div class="example-body">Tezinizdeki puan tahmini bölümü için tablo model başına RMSE, MAE, MAPE ve R-kare göstermelidir. RMSE kayıp-optimizasyon perspektifini, MAE dayanıklı perspektifi, MAPE çapraz-ürün karşılaştırmayı, R-kare genel uyum kalitesini yakalar. Dördünü de dahil etmek hakemlere takasları anladığınızı ve manşetiniz için en iyi metriği seçmediğinizi gösterir.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. KMeans: Kümelemenin İş Atı</h2>

<p class="l-text">Kümeleme sınıflandırmanın denetimsiz versiyonudur: etiketler <em>olmadan</em> benzer noktaların gruplarını bulur. KMeans en yaygın kullanılan algoritmadır. K küme sayısını bildiğinizi varsayar ve iki adımı dönüşümlü çalıştırarak bulur:</p>

<div class="calc-step"><strong>İlklendir:</strong> K rastgele merkezi seç (veya akıllı ilklendirme için kmeans++ kullan).</div>
<div class="calc-step"><strong>Ata:</strong> her veri noktası en yakın merkeze atanır (Öklid mesafesi).</div>
<div class="calc-step"><strong>Güncelle:</strong> her merkez atanan noktalarının ortalamasına taşınır.</div>
<div class="calc-step"><strong>Tekrarla</strong> atamalar değişmeyene kadar (yakınsama). Genellikle 10-30 iterasyon alır.</div>

<p class="l-text">KMeans'ın minimize ettiği amaç küme içi kare mesafe toplamıdır, <strong>inertia</strong> denir:</p>

<div class="katex-block">$$\\text{Inertia} = \\sum_{k=1}^{K} \\sum_{x_i \\in C_k} \\|x_i - \\mu_k\\|_2^2$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$C_k$</div><div class="card-body">k kümesine atanan noktalar kümesi.</div></div>
<div class="calc-card"><div class="card-title">$\\mu_k$</div><div class="card-body">k kümesinin merkezi. Fit'ten sonra <code>cluster_centers_[k]</code> olarak saklanır.</div></div>
<div class="calc-card"><div class="card-title">Mesafe metriği</div><div class="card-body">Daima Öklid. Kosinüs ve diğer mesafeler farklı algoritmalar gerektirir.</div></div>
<div class="calc-card"><div class="card-title">Yerel optimum</div><div class="card-body">KMeans yerel minimuma yakınsar -- farklı ilklendirmeler farklı sonuç verebilir. En iyiyi almak için n_init=10.</div></div>
<div class="calc-card"><div class="card-title">kmeans++</div><div class="card-body">Akıllı ilklendirme (sklearn varsayılanı): uzak noktaları başlangıç merkezleri olarak seçer. Çok daha hızlı yakınsama.</div></div>
<div class="calc-card"><div class="card-title">Ölçekleme zorunlu</div><div class="card-body">KMeans'tan önce daima StandardScaler -- mesafeler birimlere bağlıdır.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_blobs

X, y_true = <span class="fn">make_blobs</span>(n_samples=<span class="num">500</span>, centers=<span class="num">4</span>, cluster_std=<span class="num">0.8</span>, random_state=<span class="num">0</span>)
X_scaled = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

km = <span class="fn">KMeans</span>(n_clusters=<span class="num">4</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>)
km.<span class="fn">fit</span>(X_scaled)
labels = km.labels_
centers = km.cluster_centers_
inertia = km.inertia_
n_iter = km.n_iter_
<span class="fn">print</span>(f<span class="str">"Inertia: {inertia:.2f}"</span>)
<span class="fn">print</span>(f<span class="str">"{n_iter} iterasyonda yakinsadi"</span>)
<span class="fn">print</span>(<span class="str">"Kume merkezleri:"</span>)
<span class="fn">print</span>(centers)

new_pts = np.<span class="fn">array</span>([[<span class="num">0.0</span>, <span class="num">0.0</span>], [<span class="num">3.0</span>, <span class="num">3.0</span>]])
new_labels = km.<span class="fn">predict</span>(<span class="fn">StandardScaler</span>().<span class="fn">fit</span>(X).<span class="fn">transform</span>(new_pts))
<span class="fn">print</span>(f<span class="str">"Yeni noktalar atanan kumeler: {new_labels}"</span>)

<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> adjusted_rand_score
<span class="fn">print</span>(f<span class="str">"Gercege karsi ARI: {adjusted_rand_score(y_true, labels):.3f}"</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Test durumu olarak 4 iyi ayrılmış 2B blob üretir. 2) Özellikleri ölçekler (KMeans'tan önce daima). 3) K=4 ve <code>n_init=10</code> ile KMeans uydurur -- 10 rastgele ilklendirme çalıştırır ve en iyisini (en düşük inertia) tutar. 4) Uydurduktan sonra <code>labels_</code> her giriş noktası için atanan kümeyi tutar, <code>cluster_centers_</code> öğrenilen merkezleri tutar ve <code>inertia_</code> son amaç değeridir. 5) <code>predict</code> yeni noktaları en yakın mevcut merkeze atar -- KMeans birçok kümeleme algoritmasının aksine çıkarım yapabilir. 6) <code>adjusted_rand_score</code> keşfedilen etiketleri gerçek etiketlerle (mevcut olduğunda) karşılaştırır; 1.0 mükemmel eşleme, 0.0 rastgele anlamına gelir. ARI küme <em>numaralandırmasının</em> keyfi olduğu gerçeğini yönetir.</p>

<div id="plot-l7-kmeans-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> 500 sentetik noktanın atanan kümelerine göre renklendirilmiş KMeans kümelemesi, dört merkez büyük siyah işaretçi olarak çizilmiştir. Dört blob temiz bir şekilde kurtarılır çünkü küresel ve iyi ayrılmıştır -- KMeans'ın inşa edildiği varsayım. Gerçek kümeler uzun, kesişen veya çok farklı boyutlarda olsaydı, KMeans zorlanırdı. Bu temel sınırlamadır: KMeans Gauss benzeri küresel kümeler varsayar.</div>

<div class="l-warn"><strong>KMeans sınırlamaları:</strong> küresel kümeler, eşit küme boyutları varsayar ve K'yı önceden bilirsiniz. Uzun, yoğunluğu değişen veya gürültülü veri için DBSCAN veya hiyerarşik kümeleme kullanın. "K bilmiyorum" için dirsek yöntemi veya silhouette analizi kullanın (sonraki bölümler).</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. K Seçme: Dirsek ve Silhouette</h2>

<p class="l-text">KMeans'la en büyük pratik soru: K'yı nasıl seçeceğim? İki yöntem.</p>

<p class="l-text"><strong>Dirsek yöntemi</strong>: inertia'yı K'ya göre çiz. K büyüdükçe inertia daima azalır (daha çok merkez veriyi daha sıkı uydurur), ama başka bir küme eklemenin marjinal faydası azalır. "Dirsek" -- eğrinin büküldüğü yer -- sizin aday K'nızdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> silhouette_score
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_blobs

X, _ = <span class="fn">make_blobs</span>(n_samples=<span class="num">500</span>, centers=<span class="num">4</span>, cluster_std=<span class="num">0.8</span>, random_state=<span class="num">0</span>)
Xs = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

ks = <span class="fn">range</span>(<span class="num">1</span>, <span class="num">11</span>)
inertias = []
silhouettes = []
<span class="kw">for</span> k <span class="kw">in</span> ks:
    km = <span class="fn">KMeans</span>(n_clusters=k, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xs)
    inertias.<span class="fn">append</span>(km.inertia_)
    <span class="kw">if</span> k >= <span class="num">2</span>:
        silhouettes.<span class="fn">append</span>(<span class="fn">silhouette_score</span>(Xs, km.labels_))
    <span class="kw">else</span>:
        silhouettes.<span class="fn">append</span>(np.nan)

<span class="fn">print</span>(<span class="str">"K    Inertia      Silhouette"</span>)
<span class="kw">for</span> k, i, s <span class="kw">in</span> <span class="fn">zip</span>(ks, inertias, silhouettes):
    <span class="fn">print</span>(f<span class="str">"{k:<5}{i:>10.2f}    {s:.3f}"</span> <span class="kw">if</span> k >= <span class="num">2</span> <span class="kw">else</span> f<span class="str">"{k:<5}{i:>10.2f}    --"</span>)

best_k = np.<span class="fn">nanargmax</span>(silhouettes) + <span class="num">1</span>
<span class="fn">print</span>(f<span class="str">"Silhouette K = {best_k} oneriyor"</span>)</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) K'yı 1'den 10'a süpürür ve hem inertia hem silhouette skorunu kaydeder. 2) Inertia monoton azalır -- dirsek azalma oranının yavaşladığı yerde görünür. 4 gerçek küme için K=4'e kadar keskin bir düşüş, sonra düz bir bölge görürsünüz. 3) Silhouette skoru tipik olarak gerçek K'da zirve yapar. 4) <code>nanargmax</code> en iyi silhouette'a sahip K'yı seçer (K=1'deki NaN'ı atlar).</p>

<p class="l-text"><strong>Silhouette skoru</strong> bir noktanın kendi kümesine vs sonraki en yakın kümeye ne kadar benzer olduğunu ölçer. Her i noktası için:</p>

<div class="katex-block">$$s_i = \\frac{b_i - a_i}{\\max(a_i, b_i)} \\in [-1, 1]$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$a_i$</div><div class="card-body">i'den kendi kümesindeki diğer noktalara ortalama mesafe (uyum).</div></div>
<div class="calc-card"><div class="card-title">$b_i$</div><div class="card-body">i'den sonraki en yakın kümedeki tüm noktalara ortalama mesafe (ayrılık).</div></div>
<div class="calc-card"><div class="card-title">$s_i = 1$</div><div class="card-body">Nokta komşu kümelerden uzak ve kendi kümesiyle sıkı gruplu -- ideal.</div></div>
<div class="calc-card"><div class="card-title">$s_i = 0$</div><div class="card-body">Nokta iki küme arasındaki sınırda -- her iki yöne gidebilir.</div></div>
<div class="calc-card"><div class="card-title">$s_i &lt; 0$</div><div class="card-body">Nokta kendi kümesinden farklı bir kümeye daha yakın -- muhtemelen yanlış atanmış.</div></div>
<div class="calc-card"><div class="card-title">Ortalama silhouette</div><div class="card-body">Tüm noktalarda ortalama $s_i$. Yaygın aralık: "iyi" kümeleme için 0.3-0.7. 0.7 üzeri mükemmel.</div></div>
</div>

<div id="plot-l7-elbow-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafikte:</strong> Dört-blob sentetik veride klasik dirsek grafiği. K=1'den K=4'e inertia çarpıcı şekilde düşer çünkü daha çok merkez eklemek gerçekten daha çok yapı yakalar. K=4'ten sonra küme eklemenin marjinal kazancı küçüktür -- eğri düzleşir. K=4'teki "dirsek" tatlı noktadır. Silhouette eğrisi (sağ panel) bunu K=4'teki zirvesiyle doğrular. Dirsek ve silhouette anlaştığında güvenebilirsiniz; anlaşmadıklarında silhouette'a varsayılan olarak güvenin (daha temiz istatistiksel yorumu vardır).</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. DBSCAN: Yoğunluk Tabanlı Kümeleme</h2>

<p class="l-text">DBSCAN tamamen farklı bir yaklaşım benimser: küme sayısı varsaymak yerine, seyrek bölgelerle ayrılmış yoğun nokta bölgeleri bulur. Küresel olmayan, düzensiz şekilli kümeler bulabilir VE aykırı değerleri "gürültü" noktaları olarak tanımlayabilir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">eps</div><div class="card-body">Komşuluk yarıçapı. eps içindeki iki nokta "komşudur". Kritik hiperparametre.</div></div>
<div class="calc-card"><div class="card-title">min_samples</div><div class="card-body">Bir noktanın "core" olması için eps-komşulukta minimum nokta. Varsayılan 5.</div></div>
<div class="calc-card"><div class="card-title">Core nokta</div><div class="card-body">eps içinde en az min_samples komşu var. Yoğunluk merkezleri.</div></div>
<div class="calc-card"><div class="card-title">Sınır nokta</div><div class="card-body">Bir core'un eps'i içinde ama kendisi core değil. Küme kenarlarında oturur.</div></div>
<div class="calc-card"><div class="card-title">Gürültü nokta</div><div class="card-body">Ne core ne sınır. sklearn tarafından -1 etiketlenir. Aykırı değerler.</div></div>
<div class="calc-card"><div class="card-title">K yok</div><div class="card-body">Küme sayısı veri tarafından belirlenir, parametre değil.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> DBSCAN, KMeans
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_moons

X, _ = <span class="fn">make_moons</span>(n_samples=<span class="num">500</span>, noise=<span class="num">0.06</span>, random_state=<span class="num">0</span>)
Xs = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

km = <span class="fn">KMeans</span>(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(Xs)
<span class="fn">print</span>(f<span class="str">"KMeans kumeleri: {np.unique(km.labels_)}"</span>)

db = <span class="fn">DBSCAN</span>(eps=<span class="num">0.20</span>, min_samples=<span class="num">5</span>).<span class="fn">fit</span>(Xs)
<span class="fn">print</span>(f<span class="str">"DBSCAN kumeleri: {np.unique(db.labels_)}"</span>)
n_clusters = <span class="fn">len</span>(<span class="fn">set</span>(db.labels_)) - (<span class="num">1</span> <span class="kw">if</span> -<span class="num">1</span> <span class="kw">in</span> db.labels_ <span class="kw">else</span> <span class="num">0</span>)
n_noise = (db.labels_ == -<span class="num">1</span>).<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"  {n_clusters} kume, {n_noise} gurultu noktasi bulundu"</span>)

<span class="cm"># eps secimi -- k-distance grafigi</span>
<span class="kw">from</span> sklearn.neighbors <span class="kw">import</span> NearestNeighbors
nn = <span class="fn">NearestNeighbors</span>(n_neighbors=<span class="num">5</span>).<span class="fn">fit</span>(Xs)
distances, _ = nn.<span class="fn">kneighbors</span>(Xs)
distances_sorted = np.<span class="fn">sort</span>(distances[:, -<span class="num">1</span>])</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) İki-ay veri setini üretir -- küresel olmayan, klasik "KMeans başarısız" örneği. 2) K=2 ile KMeans veriyi dikey çizgiyle böler, iki ay olarak DEĞİL (çünkü aylar geometrik olarak iç içe geçer). 3) Uygun <code>eps</code> ile DBSCAN iki ayı temiz bulur çünkü merkezlere mesafe yerine yoğunluğu takip eder. 4) DBSCAN uzak noktaları otomatik olarak gürültü (-1) etiketler -- aynı geçişte aykırı değer tespiti için kullanışlıdır. 5) eps seçimi: k-distance grafiği her noktadan k. en yakın komşusuna mesafeyi gösterir (sıralı); bu grafiğin "dizi" iyi bir eps'tir. Modern alternatif: eps'i dahili otomatik ayarlayan HDBSCAN kullanın.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">KMeans</div><div class="compare-item">K'yı önceden belirt</div><div class="compare-item">Küresel, eşit boyut kümeler varsayar</div><div class="compare-item">Aykırı değerleri tanımlayamaz</div><div class="compare-item">Yeni veride tahmin yapar</div><div class="compare-item">Hızlı: O(n*K*iters)</div><div class="compare-item">En iyi: birçok dengeli grup</div></div>
<div class="compare-col"><div class="compare-title">DBSCAN</div><div class="compare-item">K yok -- keşfeder</div><div class="compare-item">Keyfi şekiller bulur</div><div class="compare-item">Gürültüyü -1 etiketler</div><div class="compare-item">Yeni veride tahmin yok (yeniden uydurma gerek)</div><div class="compare-item">Daha yavaş: indeksle O(n log n)</div><div class="compare-item">En iyi: yoğunluk tabanlı, aykırı-değer farkındalı</div></div>
</div>

<div id="plot-l7-dbscan-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin verdiği mesaj:</strong> İki-ay veri seti KMeans (sol, başarısız -- ayların arasında bölünür) vs DBSCAN (sağ, başarılı -- iki hilal şekli kurtarır) ile kümelenmiş. DBSCAN tarafındaki koyu "gürültü" noktaları (-1 etiketli) otomatik olarak tanımlanan aykırı değerlerdir. Bu görsel neden tek beden tüm bedenlere uyan kümelemenin var olmadığının kanonik demosudur: KMeans bazı veri setleri için doğru, DBSCAN diğerleri, hiyerarşik daha başkaları için. Daima kümelemeden sonra 2B projeksiyonları çizin ve sonucu beklentilerinize karşı yargılayın.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hiyerarşik Kümeleme ve Doğru Algoritmayı Seçme</h2>

<p class="l-text">Hiyerarşik kümeleme iç içe kümelerin bir ağacını (dendrogram) inşa eder, ya aşağıdan yukarı (agglomerative -- her noktayı kendi kümesi olarak başlat, en yakın çiftleri birleştir) ya yukarıdan aşağı (divisive). Düz bir kümeleme almak için dendrogramı seçilen yükseklikte "kesersiniz".</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.cluster <span class="kw">import</span> AgglomerativeClustering
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_blobs
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">import</span> numpy <span class="kw">as</span> np

X, _ = <span class="fn">make_blobs</span>(n_samples=<span class="num">200</span>, centers=<span class="num">4</span>, cluster_std=<span class="num">0.7</span>, random_state=<span class="num">0</span>)
Xs = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

<span class="kw">for</span> linkage <span class="kw">in</span> [<span class="str">"ward"</span>, <span class="str">"average"</span>, <span class="str">"complete"</span>, <span class="str">"single"</span>]:
    ac = <span class="fn">AgglomerativeClustering</span>(n_clusters=<span class="num">4</span>, linkage=linkage)
    labels = ac.<span class="fn">fit_predict</span>(Xs)
    <span class="fn">print</span>(f<span class="str">"{linkage:<10} kume boyutlari: {np.bincount(labels)}"</span>)</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) 4 iyi ayrılmış blob inşa eder ve ölçekler. 2) Dört linkage yöntemi dener: <code>ward</code> küme içi varyansı minimize eder (en popüler, dengeli kümeler), <code>average</code> ortalama ikili mesafe kullanır, <code>complete</code> max ikili mesafe kullanır (kompakt kümeler), <code>single</code> min ikili mesafe kullanır (zincir benzeri kümeler, uzamaya eğilimli). 3) Dengeli veri için ward en güvenli varsayılandır. 4) scipy dendrogram'ı birleştirme sırasını görselleştirir ve <code>n_clusters</code>'ı ağacı inceleyerek seçmenize izin verir.</p>

<div class="calc-step"><strong>Algoritma seçimi hile sayfası:</strong></div>
<div class="calc-step"><strong>KMeans</strong>: K biliyorum, kümeler küresel görünüyor, hızlı çıkarım gerek.</div>
<div class="calc-step"><strong>DBSCAN/HDBSCAN</strong>: kümeler düzensiz şekiller, aykırı değerler var, K bilinmiyor.</div>
<div class="calc-step"><strong>AgglomerativeClustering (Ward)</strong>: küçük veri seti (&lt; 10 bin), keşif için dendrogram istenir, yeni nokta tahminine ihtiyaç yok.</div>
<div class="calc-step"><strong>GaussianMixture</strong>: kümeler yumuşak örtüşür, olasılıksal üyelik istersiniz, bu derste yok.</div>
<div class="calc-step"><strong>Spectral kümeleme</strong>: graf benzeri veri veya konveks olmayan kümeler, hesaplama açısından pahalı ama güçlü.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP konu keşfi</div><div class="example-body">5000 NLP makalesi için altta yatan konuları keşfetmek istiyorsunuz. Pipeline: TfidfVectorizer -&gt; TruncatedSVD (50 boyut) -&gt; KMeans (K=20 ile başlayın). Küme başına en üst TF-IDF kelimeleri yazdırarak küme merkezlerini inceleyin -- anlamlı etiketler sıklıkla ortaya çıkar ("transformer attention BERT", "embeddings word2vec GloVe", "LSTM RNN sequence"). Tez kalitesinde iş için aykırı değer makalelerini tanımlamak üzere DBSCAN ve hiyerarşik konu yapısı için HDBSCAN da deneyin.</div></div>

<div class="think-box"><div class="think-label">ÖZET ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Regresyon metrikleri: MSE/RMSE büyük hataları ikinci dereceden cezalandırır, MAE doğrusal cezalandırır (dayanıklı); MAPE ölçek-bağımsız, R-kare açıklanan varyansı ölçer.<br><strong>2.</strong> Bir regresörü uydurduktan sonra daima artık grafiklerini kontrol edin -- desenler özet metriklerinde görünmez model arızalarını ortaya çıkarır.<br><strong>3.</strong> R-kare test verisinde negatif olabilir; bu modelin ortalamayı tahmin etmekten kötü olduğu anlamına gelir.<br><strong>4.</strong> KMeans hızlı ve basittir ama küresel eşit boyut kümeler varsayar; DAİMA önce özellikleri ölçekleyin.<br><strong>5.</strong> K'yı dirsek yöntemi (inertia bükümü) veya silhouette skoru (doğru K'da zirve) ile seçin. Anlaştıklarında onlara güvenin.<br><strong>6.</strong> DBSCAN keyfi şekiller bulur ve aykırı değerleri otomatik tanımlar -- küresel olmayan veya gürültülü veri için doğru araç.<br><strong>7.</strong> Hiyerarşik kümeleme (ward linkage) keşif için yararlı bir dendrogram inşa eder; ağacı keserek <code>n_clusters</code> seçin.<br><strong>8.</strong> Hiçbir kümeleme algoritması evrensel olarak en iyi değildir -- daima 2-3 alternatif çalıştırın ve görselleştirme artı alan bilgisiyle yargılayın.</div></div>
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

  // 1. Residual plot
  var elR = document.getElementById('plot-l7-residual-en');
  if (elR){
    var r = rng(11);
    var preds=[], resid=[];
    for (var i=0;i<300;i++){
      var p = 0.5 + 4*r();
      var noise = (r()-0.5)*0.6;
      var slight_pattern = 0.05*(p-2.5);
      preds.push(p);
      resid.push(noise + slight_pattern);
    }
    var t1 = {x:preds,y:resid,mode:'markers',type:'scatter',name:'Residuals',marker:{color:T.accent,size:6,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2 = {x:[0.5,4.5],y:[0,0],mode:'lines',type:'scatter',name:'zero',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'},showlegend:false};
    var rmse = 0.5;
    var bandU = {x:[0.5,4.5],y:[rmse,rmse],mode:'lines',type:'scatter',line:{color:'rgba(248,113,113,0.4)',dash:'dot',width:1},name:'+/- RMSE',showlegend:false};
    var bandL = {x:[0.5,4.5],y:[-rmse,-rmse],mode:'lines',type:'scatter',line:{color:'rgba(248,113,113,0.4)',dash:'dot',width:1},showlegend:false};
    var layout = Object.assign({}, common, {title:{text:'Residuals vs predicted (California housing model)',font:{color:T.text,size:14}},xaxis:{title:'Predicted value ($100k)',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Residual (true - predicted)',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-residual-en',[t1,t2,bandU,bandL],layout,{responsive:true,displayModeBar:false});
  }

  function makeBlobs(n,centers,std,seed){
    var r = rng(seed); var xs=[],ys=[],lab=[];
    var per = Math.floor(n/centers.length);
    for (var c=0;c<centers.length;c++){
      for (var i=0;i<per;i++){
        var u=r(), v=r();
        var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
        xs.push(centers[c][0]+std*z0);
        ys.push(centers[c][1]+std*z1);
        lab.push(c);
      }
    }
    return {xs:xs,ys:ys,labels:lab};
  }

  // 2. KMeans on blobs
  var elK = document.getElementById('plot-l7-kmeans-en');
  if (elK){
    var B = makeBlobs(500,[[0,0],[5,5],[5,0],[0,5]],0.7,7);
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa'];
    var traces=[];
    for (var c=0;c<4;c++){
      var xs=[],ys=[];
      for (var i=0;i<B.labels.length;i++){if(B.labels[i]===c){xs.push(B.xs[i]);ys.push(B.ys[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'Cluster '+c,marker:{color:palette[c],size:7,opacity:0.65,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var centers = {x:[0,5,5,0],y:[0,5,0,5],mode:'markers',type:'scatter',name:'centroids',marker:{color:'#000',size:18,symbol:'x',line:{color:T.text,width:2}}};
    var layout = Object.assign({}, common, {title:{text:'KMeans on 4 synthetic blobs (clean recovery)',font:{color:T.text,size:14}},xaxis:{title:'Feature 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Feature 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-kmeans-en',traces.concat([centers]),layout,{responsive:true,displayModeBar:false});
  }

  // 3. Elbow + silhouette
  var elE = document.getElementById('plot-l7-elbow-en');
  if (elE){
    var ks=[1,2,3,4,5,6,7,8,9,10];
    var inertias=[1000,560,360,200,180,170,162,158,155,153];
    var sil=[null,0.58,0.66,0.72,0.61,0.55,0.50,0.46,0.43,0.40];
    var t1 = {x:ks,y:inertias,mode:'lines+markers',type:'scatter',name:'Inertia',line:{color:T.accent,width:3},marker:{size:8},xaxis:'x',yaxis:'y'};
    var t2 = {x:ks,y:sil,mode:'lines+markers',type:'scatter',name:'Silhouette',line:{color:'#4ecdc4',width:3},marker:{size:8},xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Elbow method (left) + Silhouette (right)',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'K',gridcolor:T.grid,zerolinecolor:T.zero,dtick:1},
      yaxis:{title:'Inertia',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'K',gridcolor:T.grid,zerolinecolor:T.zero,dtick:1},
      yaxis2:{title:'Silhouette',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l7-elbow-en',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }

  // 4. Moons: KMeans vs DBSCAN
  var elD = document.getElementById('plot-l7-dbscan-en');
  if (elD){
    // Generate moons
    var r=rng(13); var xs=[], ys=[], lab=[];
    for (var i=0;i<200;i++){
      var t = Math.PI*r();
      xs.push(Math.cos(t)+0.06*(r()-0.5));
      ys.push(Math.sin(t)+0.06*(r()-0.5));
      lab.push(0);
    }
    for (var i=0;i<200;i++){
      var t = Math.PI*r();
      xs.push(1-Math.cos(t)+0.06*(r()-0.5));
      ys.push(0.5-Math.sin(t)+0.06*(r()-0.5));
      lab.push(1);
    }
    // KMeans-ish: split by x=0.5
    var kmL=[];
    for (var i=0;i<xs.length;i++) kmL.push(xs[i]>0.5?1:0);
    // DBSCAN: matches true labels except for some noise
    var dbL = lab.slice(); for (var i=0;i<10;i++) dbL[Math.floor(r()*xs.length)] = -1;
    var palette = [T.accent,'#4ecdc4'];
    var tr1=[], tr2=[];
    for (var c=0;c<2;c++){
      var x1=[],y1=[],x2=[],y2=[];
      for (var i=0;i<xs.length;i++){
        if(kmL[i]===c){x1.push(xs[i]);y1.push(ys[i]);}
        if(dbL[i]===c){x2.push(xs[i]);y2.push(ys[i]);}
      }
      tr1.push({x:x1,y:y1,mode:'markers',type:'scatter',name:'KM cluster '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}},xaxis:'x',yaxis:'y'});
      tr2.push({x:x2,y:y2,mode:'markers',type:'scatter',name:'DBSCAN cluster '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}},xaxis:'x2',yaxis:'y2',showlegend:false});
    }
    var noiseX=[], noiseY=[];
    for (var i=0;i<xs.length;i++){if(dbL[i]===-1){noiseX.push(xs[i]);noiseY.push(ys[i]);}}
    var noise = {x:noiseX,y:noiseY,mode:'markers',type:'scatter',name:'noise',marker:{color:'#666',size:7,symbol:'x'},xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'KMeans (left, fails) vs DBSCAN (right, succeeds) on moons',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},
      showlegend:true,legend:{font:{color:T.text}},
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l7-dbscan-en',tr1.concat(tr2).concat([noise]),layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elRtr = document.getElementById('plot-l7-residual-tr');
  if (elRtr){
    var r = rng(11);
    var preds=[], resid=[];
    for (var i=0;i<300;i++){
      var p = 0.5 + 4*r();
      var noise = (r()-0.5)*0.6;
      var slight_pattern = 0.05*(p-2.5);
      preds.push(p);
      resid.push(noise + slight_pattern);
    }
    var t1 = {x:preds,y:resid,mode:'markers',type:'scatter',name:'Artiklar',marker:{color:T.accent,size:6,opacity:0.6,line:{color:'rgba(255,255,255,0.2)',width:1}}};
    var t2 = {x:[0.5,4.5],y:[0,0],mode:'lines',type:'scatter',name:'sifir',line:{color:'rgba(200,200,200,0.4)',width:1,dash:'dash'},showlegend:false};
    var rmse = 0.5;
    var bandU = {x:[0.5,4.5],y:[rmse,rmse],mode:'lines',type:'scatter',line:{color:'rgba(248,113,113,0.4)',dash:'dot',width:1},name:'+/- RMSE',showlegend:false};
    var bandL = {x:[0.5,4.5],y:[-rmse,-rmse],mode:'lines',type:'scatter',line:{color:'rgba(248,113,113,0.4)',dash:'dot',width:1},showlegend:false};
    var layout = Object.assign({}, common, {title:{text:'Artıklar vs tahmin (California ev fiyatları)',font:{color:T.text,size:14}},xaxis:{title:'Tahmin ($100k)',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Artik (gercek - tahmin)',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-residual-tr',[t1,t2,bandU,bandL],layout,{responsive:true,displayModeBar:false});
  }
  var elKtr = document.getElementById('plot-l7-kmeans-tr');
  if (elKtr){
    var B = makeBlobs(500,[[0,0],[5,5],[5,0],[0,5]],0.7,7);
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa'];
    var traces=[];
    for (var c=0;c<4;c++){
      var xs=[],ys=[];
      for (var i=0;i<B.labels.length;i++){if(B.labels[i]===c){xs.push(B.xs[i]);ys.push(B.ys[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'Kume '+c,marker:{color:palette[c],size:7,opacity:0.65,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var centers = {x:[0,5,5,0],y:[0,5,0,5],mode:'markers',type:'scatter',name:'merkezler',marker:{color:'#000',size:18,symbol:'x',line:{color:T.text,width:2}}};
    var layout = Object.assign({}, common, {title:{text:'4 sentetik blob uzerinde KMeans (temiz kurtarma)',font:{color:T.text,size:14}},xaxis:{title:'Ozellik 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Ozellik 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l7-kmeans-tr',traces.concat([centers]),layout,{responsive:true,displayModeBar:false});
  }
  var elEtr = document.getElementById('plot-l7-elbow-tr');
  if (elEtr){
    var ks=[1,2,3,4,5,6,7,8,9,10];
    var inertias=[1000,560,360,200,180,170,162,158,155,153];
    var sil=[null,0.58,0.66,0.72,0.61,0.55,0.50,0.46,0.43,0.40];
    var t1 = {x:ks,y:inertias,mode:'lines+markers',type:'scatter',name:'Inertia',line:{color:T.accent,width:3},marker:{size:8},xaxis:'x',yaxis:'y'};
    var t2 = {x:ks,y:sil,mode:'lines+markers',type:'scatter',name:'Silhouette',line:{color:'#4ecdc4',width:3},marker:{size:8},xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'Dirsek yontemi (sol) + Silhouette (sag)',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'K',gridcolor:T.grid,zerolinecolor:T.zero,dtick:1},
      yaxis:{title:'Inertia',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'K',gridcolor:T.grid,zerolinecolor:T.zero,dtick:1},
      yaxis2:{title:'Silhouette',gridcolor:T.grid,zerolinecolor:T.zero,range:[0,1]},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l7-elbow-tr',[t1,t2],layout,{responsive:true,displayModeBar:false});
  }
  var elDtr = document.getElementById('plot-l7-dbscan-tr');
  if (elDtr){
    var r=rng(13); var xs=[], ys=[], lab=[];
    for (var i=0;i<200;i++){
      var t = Math.PI*r();
      xs.push(Math.cos(t)+0.06*(r()-0.5));
      ys.push(Math.sin(t)+0.06*(r()-0.5));
      lab.push(0);
    }
    for (var i=0;i<200;i++){
      var t = Math.PI*r();
      xs.push(1-Math.cos(t)+0.06*(r()-0.5));
      ys.push(0.5-Math.sin(t)+0.06*(r()-0.5));
      lab.push(1);
    }
    var kmL=[];
    for (var i=0;i<xs.length;i++) kmL.push(xs[i]>0.5?1:0);
    var dbL = lab.slice(); for (var i=0;i<10;i++) dbL[Math.floor(r()*xs.length)] = -1;
    var palette = [T.accent,'#4ecdc4'];
    var tr1=[], tr2=[];
    for (var c=0;c<2;c++){
      var x1=[],y1=[],x2=[],y2=[];
      for (var i=0;i<xs.length;i++){
        if(kmL[i]===c){x1.push(xs[i]);y1.push(ys[i]);}
        if(dbL[i]===c){x2.push(xs[i]);y2.push(ys[i]);}
      }
      tr1.push({x:x1,y:y1,mode:'markers',type:'scatter',name:'KM kume '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}},xaxis:'x',yaxis:'y'});
      tr2.push({x:x2,y:y2,mode:'markers',type:'scatter',name:'DBSCAN kume '+c,marker:{color:palette[c],size:6,opacity:0.7,line:{color:'rgba(255,255,255,0.2)',width:1}},xaxis:'x2',yaxis:'y2',showlegend:false});
    }
    var noiseX=[], noiseY=[];
    for (var i=0;i<xs.length;i++){if(dbL[i]===-1){noiseX.push(xs[i]);noiseY.push(ys[i]);}}
    var noise = {x:noiseX,y:noiseY,mode:'markers',type:'scatter',name:'gurultu',marker:{color:'#666',size:7,symbol:'x'},xaxis:'x2',yaxis:'y2'};
    var layout = Object.assign({}, common, {
      title:{text:'KMeans (sol, başarısız) vs DBSCAN (sağ, başarılı) -- moons',font:{color:T.text,size:14}},
      grid:{rows:1,columns:2,pattern:'independent'},
      xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},
      xaxis2:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},
      showlegend:true,legend:{font:{color:T.text}},
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l7-dbscan-tr',tr1.concat(tr2).concat([noise]),layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
