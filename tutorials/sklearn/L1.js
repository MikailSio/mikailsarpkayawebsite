window.SKLEARN_L1 = {

en: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATH FOUNDATIONS</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">New to the math used here? Refresh these first — each is a self-contained Mathematics lesson:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Functions &amp; Notation</a> <span style="opacity:0.55;font-size:0.82em">(Math L40)</span></li>
<li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Probability Basics</a> <span style="opacity:0.55;font-size:0.82em">(Math L94)</span></li>
<li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Expected Value &amp; Variance</a> <span style="opacity:0.55;font-size:0.82em">(Math L101)</span></li>
<li><a href="/tutorials/matematik/102" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Mean, Median, Mode</a> <span style="opacity:0.55;font-size:0.82em">(Math L102)</span></li>
</ul>
</div>
<p class="l-text"><strong>scikit-learn is the Swiss Army knife of classical machine learning in Python.</strong> If you have ever trained a logistic regression, a random forest, a k-means clustering, or a TF-IDF + SVM sentiment classifier, you have probably done it with scikit-learn. Around 90% of every "production ML" job that does not involve deep neural networks runs on this library, and even DL pipelines lean on it for preprocessing, splitting, metrics, and baselines.</p>

<p class="l-text">In this first lesson we will not chase a benchmark or a fancy model. Instead we will build the <strong>mental model</strong> that makes the rest of sklearn click: every estimator -- whether it is a scaler, a classifier, a clustering algorithm, or a dimensionality reducer -- speaks the same three-method language: <code>fit</code>, <code>predict</code> (or <code>transform</code>), and optionally <code>score</code>. Once you internalize this, you stop memorizing 200 class names and start composing them.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Explain the unified fit/predict/transform API shared by every sklearn estimator</li><li>Train a classifier on tabular data with five lines of code</li><li>Split data into train and test sets with train_test_split and a fixed seed</li><li>Evaluate a model with accuracy, score, and a held-out validation set</li><li>Distinguish estimators, predictors, transformers, and meta-estimators</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why scikit-learn? The 30,000-Foot View</h2>

<p class="l-text">Imagine you are an NLP practitioner. You have just cleaned 50,000 movie reviews, computed TF-IDF vectors with 20,000 features, and now you want to predict positive vs negative sentiment. You could write a logistic regression by hand with NumPy: implement the sigmoid, write the gradient descent loop, debug the learning rate, add L2 regularization, then re-do all of it for cross-validation. That is a week of work. With sklearn, the same baseline is six lines of code -- and it has been battle-tested by millions of users since 2007.</p>

<div class="calc-highlight"><strong>The promise of scikit-learn:</strong> any ML task in classical (non-deep) ML, on tabular or sparse data, can be expressed as composing a handful of estimators that all share the same API. Learn the API once, and you have access to ~200 algorithms.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Consistent API</div><div class="card-body">Every estimator has <code>fit(X, y)</code>. Predictors add <code>predict(X)</code>. Transformers add <code>transform(X)</code>. That is essentially all you need.</div></div>
<div class="calc-card"><div class="card-title">NumPy native</div><div class="card-body">Inputs are NumPy arrays or Pandas DataFrames; outputs are NumPy arrays. No custom tensors, no GPU surprises -- just CPU and arrays.</div></div>
<div class="calc-card"><div class="card-title">Composable</div><div class="card-body">Pipelines chain transformers and a final estimator. ColumnTransformer applies different preprocessors to different columns. Everything plugs in.</div></div>
<div class="calc-card"><div class="card-title">Battle-tested</div><div class="card-body">Production at thousands of companies; the algorithms are reference implementations cited in papers. Bugs are rare and quickly fixed.</div></div>
<div class="calc-card"><div class="card-title">Documented</div><div class="card-body">The user guide alone is ~1500 pages of explanations and examples. Almost every parameter is documented with formulas and references.</div></div>
<div class="calc-card"><div class="card-title">Not for deep learning</div><div class="card-body">No GPU autodiff. For NN-heavy problems, use PyTorch. But sklearn is still your preprocessing, splitting, metrics, and baseline workhorse.</div></div>
</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP practitioner baseline</div><div class="example-body">Before you train a fancy BERT model on 500k tweets for sentiment, you need a baseline. A standard practitioner trick: <code>TfidfVectorizer + LogisticRegression</code> in a Pipeline gets you 85-90% of BERT's accuracy in 30 seconds of training. If your transformer cannot beat this baseline, the bottleneck is not architecture -- it is your data. sklearn is the perfect baseline factory.</div></div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does scikit-learn deliberately stay shallow (no GPU, no autodiff, no neural networks beyond a tiny MLP)? Because the moment you go deep, you lose the unifying API: every NN architecture has its own training loop, its own hyperparameters, its own quirks. By staying classical, sklearn keeps the cost of trying a new algorithm at exactly one line of code: change the estimator class. That uniformity is the entire value proposition.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Installation and Your First Estimator</h2>

<p class="l-text">Install scikit-learn with pip or conda. It pulls in NumPy, SciPy, joblib, and threadpoolctl as dependencies -- all standard scientific Python.</p>

<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Recommended: pip in a venv</span>
pip install scikit-learn pandas matplotlib

<span class="cm"># Or via conda</span>
conda install -c conda-forge scikit-learn pandas matplotlib

<span class="cm"># Verify</span>
python -c <span class="str">"import sklearn; print(sklearn.__version__)"</span>
<span class="cm"># 1.4.x or newer</span></code></pre></div>

<p class="l-text"><strong>What this does, step by step:</strong> 1) <code>pip install scikit-learn</code> downloads the prebuilt wheel from PyPI -- no compilation needed on Windows/Mac/Linux. 2) Pandas is a soft dependency: many sklearn examples accept DataFrames directly. 3) Matplotlib is needed for the built-in plotting helpers (decision boundaries, confusion matrices, etc.). 4) The version check confirms the install -- as of 2024+, you should be on 1.4 or newer. The API has been stable since 1.0 (released 2021), so any tutorial code from 2022+ should work.</p>

<p class="l-text">Now let us train our very first estimator -- a logistic regression on the classic <strong>iris dataset</strong>. Iris has 150 flowers, 4 features (sepal/petal length and width), and 3 species. It is the "hello world" of ML.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># 1. Load the data</span>
iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target          <span class="cm"># X: (150, 4), y: (150,)</span>
<span class="fn">print</span>(X.shape, y.shape)
<span class="fn">print</span>(iris.feature_names)              <span class="cm"># ['sepal length (cm)', ...]</span>
<span class="fn">print</span>(iris.target_names)               <span class="cm"># ['setosa' 'versicolor' 'virginica']</span>

<span class="cm"># 2. Split into train and test</span>
X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.25</span>, random_state=<span class="num">42</span>, stratify=y
)

<span class="cm"># 3. Create the estimator</span>
model = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">200</span>)

<span class="cm"># 4. Fit on training data</span>
model.<span class="fn">fit</span>(X_train, y_train)

<span class="cm"># 5. Predict on test data</span>
y_pred = model.<span class="fn">predict</span>(X_test)

<span class="cm"># 6. Score</span>
acc = model.<span class="fn">score</span>(X_test, y_test)      <span class="cm"># accuracy by default</span>
<span class="fn">print</span>(f<span class="str">"Test accuracy: {acc:.3f}"</span>)
<span class="cm"># Test accuracy: 0.974</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>load_iris()</code> returns a Bunch (dict-like) with <code>.data</code> (the feature matrix X), <code>.target</code> (the label vector y), plus <code>.feature_names</code> and <code>.target_names</code> for human-readable strings. 2) <code>train_test_split</code> shuffles and splits the data into 75% train / 25% test; <code>stratify=y</code> keeps the class proportions identical in both splits, which is essential for imbalanced data. 3) <code>LogisticRegression(max_iter=200)</code> instantiates an unfit estimator -- it is just a configured object, not a trained model yet. 4) <code>model.fit(X_train, y_train)</code> runs the optimization (in this case a quasi-Newton solver) and stores the learned coefficients in <code>model.coef_</code> and <code>model.intercept_</code>. 5) <code>model.predict(X_test)</code> returns one predicted class per test row. 6) <code>model.score(X_test, y_test)</code> returns mean accuracy by default for classifiers; we get ~97% on this easy dataset.</p>

<div class="calc-highlight"><strong>You just used the entire sklearn workflow:</strong> load -> split -> instantiate -> fit -> predict -> score. Every other algorithm in the library follows this exact same pattern. Swap <code>LogisticRegression</code> for <code>RandomForestClassifier</code> or <code>SVC</code> -- the rest of the code stays identical.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. The Estimator API: fit, predict, transform, score</h2>

<p class="l-text">Sklearn classifies its objects into a few categories based on which methods they implement. Memorize this taxonomy and the entire library opens up.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Estimator</div><div class="card-body">Anything with <code>.fit(X, y=None)</code>. The base class. Stores learned attributes ending in underscore (e.g. <code>coef_</code>, <code>cluster_centers_</code>).</div></div>
<div class="calc-card"><div class="card-title">Predictor</div><div class="card-body">Estimator + <code>.predict(X)</code>. All classifiers and regressors. Output: 1D array of predictions, length = n_samples.</div></div>
<div class="calc-card"><div class="card-title">Transformer</div><div class="card-body">Estimator + <code>.transform(X)</code>. All preprocessors (scalers, encoders), feature extractors (PCA, TF-IDF), and feature selectors.</div></div>
<div class="calc-card"><div class="card-title">Classifier</div><div class="card-body">Predictor with <code>.predict_proba(X)</code> (when applicable) and <code>.classes_</code>. Output of predict is one of the discrete classes.</div></div>
<div class="calc-card"><div class="card-title">Regressor</div><div class="card-body">Predictor whose <code>predict</code> returns continuous floats. Score defaults to R-squared.</div></div>
<div class="calc-card"><div class="card-title">Clusterer</div><div class="card-body">Estimator with <code>.fit_predict(X)</code>. No y in fit. <code>.labels_</code> stores the cluster assignment after fitting.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Predictor</div><div class="compare-item">Classes: <code>LogisticRegression</code>, <code>RandomForestClassifier</code>, <code>LinearRegression</code></div><div class="compare-item">Methods: <code>fit(X, y)</code>, <code>predict(X)</code>, optionally <code>predict_proba(X)</code>, <code>score(X, y)</code></div><div class="compare-item">Goal: map X to y</div><div class="compare-item">Output of predict: 1D array of length n_samples</div></div>
<div class="compare-col"><div class="compare-title">Transformer</div><div class="compare-item">Classes: <code>StandardScaler</code>, <code>PCA</code>, <code>TfidfVectorizer</code>, <code>OneHotEncoder</code></div><div class="compare-item">Methods: <code>fit(X)</code>, <code>transform(X)</code>, <code>fit_transform(X)</code></div><div class="compare-item">Goal: convert X into a different X</div><div class="compare-item">Output of transform: 2D array (possibly with different number of columns)</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans

<span class="cm"># A transformer: rescale features</span>
X = np.<span class="fn">array</span>([[<span class="num">1.0</span>, <span class="num">200.0</span>], [<span class="num">2.0</span>, <span class="num">400.0</span>], [<span class="num">3.0</span>, <span class="num">600.0</span>], [<span class="num">4.0</span>, <span class="num">800.0</span>]])
scaler = <span class="fn">StandardScaler</span>()
scaler.<span class="fn">fit</span>(X)                 <span class="cm"># learn mean and std</span>
X_scaled = scaler.<span class="fn">transform</span>(X)
<span class="fn">print</span>(X_scaled.<span class="fn">mean</span>(axis=<span class="num">0</span>))  <span class="cm"># ~[0, 0]</span>
<span class="fn">print</span>(X_scaled.<span class="fn">std</span>(axis=<span class="num">0</span>))   <span class="cm"># ~[1, 1]</span>
<span class="cm"># Equivalent shortcut:</span>
X_scaled = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

<span class="cm"># A regressor: predict y from X</span>
y = np.<span class="fn">array</span>([<span class="num">10.0</span>, <span class="num">20.0</span>, <span class="num">30.0</span>, <span class="num">40.0</span>])
reg = <span class="fn">LinearRegression</span>()
reg.<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(reg.<span class="fn">predict</span>([[<span class="num">2.5</span>, <span class="num">500.0</span>]]))   <span class="cm"># ~[25.0]</span>
<span class="fn">print</span>(reg.coef_, reg.intercept_)     <span class="cm"># learned attributes end in _</span>

<span class="cm"># A clusterer: no y at all</span>
km = <span class="fn">KMeans</span>(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>)
km.<span class="fn">fit</span>(X)
<span class="fn">print</span>(km.labels_)              <span class="cm"># cluster assignment per row</span>
<span class="fn">print</span>(km.cluster_centers_)     <span class="cm"># learned attribute</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>StandardScaler.fit(X)</code> computes the mean and standard deviation of each column and stores them in <code>scaler.mean_</code> and <code>scaler.scale_</code> (note the trailing underscore -- a sklearn convention for "this was learned during fit"). 2) <code>scaler.transform(X)</code> applies <code>(X - mean) / std</code> elementwise, producing a feature matrix where each column has mean 0 and std 1. 3) <code>fit_transform</code> is the shortcut that does both at once and is the right method to call on the training set. 4) <code>LinearRegression().fit(X, y)</code> learns the optimal coefficients via the normal equation, storing <code>coef_</code> (slope per feature) and <code>intercept_</code>. 5) <code>predict</code> takes a new X and returns predicted y values. 6) <code>KMeans</code> is unsupervised: <code>fit(X)</code> takes only X (no y), and the result is stored in <code>labels_</code> -- the assigned cluster for each input row.</p>

<div class="l-warn"><strong>Convention:</strong> attributes that exist <em>before</em> fitting are hyperparameters (no underscore: <code>n_clusters</code>, <code>max_iter</code>). Attributes that exist <em>after</em> fitting are learned (trailing underscore: <code>coef_</code>, <code>cluster_centers_</code>, <code>n_iter_</code>). If you try to access <code>model.coef_</code> before calling <code>fit</code>, you get a <code>NotFittedError</code>.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Built-in Datasets and Synthetic Generators</h2>

<p class="l-text">For learning and testing, sklearn ships with a handful of small classic datasets and a battery of synthetic data generators. You will use these constantly during development.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">load_iris</div><div class="card-body">150 flowers, 4 features, 3 classes. The "hello world" of classification.</div></div>
<div class="calc-card"><div class="card-title">load_wine</div><div class="card-body">178 wines, 13 features, 3 classes. Slightly harder than iris, still small.</div></div>
<div class="calc-card"><div class="card-title">load_breast_cancer</div><div class="card-body">569 samples, 30 features, binary. A realistic medical-ish dataset.</div></div>
<div class="calc-card"><div class="card-title">load_digits</div><div class="card-body">1797 hand-drawn digits, 8x8 grayscale, 10 classes. Tiny image classification.</div></div>
<div class="calc-card"><div class="card-title">fetch_openml</div><div class="card-body">Pull from OpenML.org -- access to MNIST, adult census, credit, etc.</div></div>
<div class="calc-card"><div class="card-title">fetch_20newsgroups</div><div class="card-body">~20k Usenet posts, 20 categories. A classic NLP corpus for text classification.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> (load_iris, load_breast_cancer, load_digits,
                              fetch_20newsgroups, make_classification,
                              make_regression, make_blobs, make_moons)

<span class="cm"># Built-in tabular datasets</span>
iris = <span class="fn">load_iris</span>(as_frame=<span class="kw">True</span>)        <span class="cm"># as_frame=True gives a Pandas DataFrame</span>
<span class="fn">print</span>(iris.frame.<span class="fn">head</span>())               <span class="cm"># a real DataFrame with target column</span>

<span class="cm"># Real-world NLP corpus</span>
news = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">'train'</span>, categories=[<span class="str">'sci.space'</span>, <span class="str">'rec.sport.baseball'</span>])
<span class="fn">print</span>(<span class="fn">len</span>(news.data), news.target_names)
<span class="fn">print</span>(news.data[<span class="num">0</span>][:<span class="num">200</span>])              <span class="cm"># raw text of first post</span>

<span class="cm"># Synthetic data -- the workhorses for testing</span>
X, y = <span class="fn">make_classification</span>(n_samples=<span class="num">1000</span>, n_features=<span class="num">20</span>, n_informative=<span class="num">5</span>,
                           n_redundant=<span class="num">2</span>, n_classes=<span class="num">2</span>, random_state=<span class="num">0</span>)
<span class="cm"># 1000 rows, 20 columns, only 5 of which are actually predictive</span>

X_reg, y_reg = <span class="fn">make_regression</span>(n_samples=<span class="num">500</span>, n_features=<span class="num">10</span>, noise=<span class="num">10</span>, random_state=<span class="num">0</span>)
<span class="cm"># Linear regression toy with controllable noise</span>

X_blob, y_blob = <span class="fn">make_blobs</span>(n_samples=<span class="num">300</span>, centers=<span class="num">4</span>, cluster_std=<span class="num">0.7</span>, random_state=<span class="num">0</span>)
<span class="cm"># 4 visible Gaussian blobs -- great for clustering experiments</span>

X_moon, y_moon = <span class="fn">make_moons</span>(n_samples=<span class="num">200</span>, noise=<span class="num">0.15</span>, random_state=<span class="num">0</span>)
<span class="cm"># Two interleaved half-moons -- linear classifiers FAIL on this</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>load_iris(as_frame=True)</code> returns the dataset packaged as a Pandas DataFrame including the target column -- the modern preferred form. 2) <code>fetch_20newsgroups</code> downloads (and caches) a real NLP corpus; <code>subset='train'</code> gives the training split, and the <code>categories</code> argument lets you pick a binary subset for fast experimentation. 3) <code>make_classification</code> builds a synthetic binary dataset where you control the number of informative, redundant, and noise features -- perfect for testing whether your pipeline correctly identifies the signal columns. 4) <code>make_regression</code> generates a linear regression toy with Gaussian noise; <code>noise=10</code> controls the signal-to-noise ratio. 5) <code>make_blobs</code> is the standard clustering toy: well-separated Gaussian clusters in 2D. 6) <code>make_moons</code> is the standard "linear cannot solve this" demo -- the two half-moons require a non-linear decision boundary.</p>

<div id="plot-l1-blobs-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> 300 synthetic 2D points generated by <code>make_blobs(centers=4)</code>, colored by their true cluster label. The four clearly separated groups are exactly what you want when you are first testing a clustering algorithm: if KMeans cannot recover these blobs, your pipeline has a bug. Synthetic generators like this let you debug and benchmark without ambiguous real-world data getting in the way.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: Why synthetic data matters for NLP</div><div class="example-body">When you are debugging a sentiment pipeline, your bug could be in the tokenizer, the vectorizer, the model, or the metrics code. With <code>make_classification</code> you skip text entirely: feed the model a clean numeric problem, confirm it learns, then plug in TF-IDF features. If accuracy drops from 0.95 (synthetic) to 0.55 (real), your text features are the problem. Synthetic data isolates failure modes.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. A Complete Mini Pipeline on Iris</h2>

<p class="l-text">Let us put it all together: load iris, split, scale, fit a logistic regression, evaluate. We will inspect the learned coefficients and the per-class probabilities to build intuition.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, classification_report

<span class="cm"># 1. Load</span>
iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target
<span class="fn">print</span>(f<span class="str">"X shape: {X.shape}, y shape: {y.shape}"</span>)
<span class="fn">print</span>(f<span class="str">"Classes: {dict(zip(iris.target_names, np.bincount(y)))}"</span>)
<span class="cm"># Classes: {'setosa': 50, 'versicolor': 50, 'virginica': 50}</span>

<span class="cm"># 2. Split (stratified)</span>
X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">42</span>, stratify=y
)

<span class="cm"># 3. Scale (fit on train ONLY -- avoid leakage)</span>
scaler = <span class="fn">StandardScaler</span>()
X_train_s = scaler.<span class="fn">fit_transform</span>(X_train)
X_test_s  = scaler.<span class="fn">transform</span>(X_test)         <span class="cm"># NOTE: only transform on test</span>

<span class="cm"># 4. Fit</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>)
clf.<span class="fn">fit</span>(X_train_s, y_train)

<span class="cm"># 5. Predict + Probabilities</span>
y_pred  = clf.<span class="fn">predict</span>(X_test_s)
y_proba = clf.<span class="fn">predict_proba</span>(X_test_s)         <span class="cm"># shape (n_test, 3)</span>
<span class="fn">print</span>(<span class="str">"First 3 probability rows:"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(y_proba[:<span class="num">3</span>], <span class="num">3</span>))

<span class="cm"># 6. Evaluate</span>
<span class="fn">print</span>(f<span class="str">"Accuracy: {accuracy_score(y_test, y_pred):.3f}"</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred, target_names=iris.target_names))

<span class="cm"># 7. Inspect learned weights -- one row per class</span>
<span class="fn">print</span>(<span class="str">"Coefficients (class x feature):"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(clf.coef_, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Intercepts:"</span>, np.<span class="fn">round</span>(clf.intercept_, <span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads iris and prints class balance with <code>np.bincount</code> -- always check class balance before training. 2) Splits 70/30 with <code>stratify=y</code> so each class is represented proportionally in both splits. 3) Scales with <code>StandardScaler</code>, calling <code>fit_transform</code> on train and only <code>transform</code> on test -- this is THE cardinal rule of preprocessing: never let your test set inform the training transformation, otherwise you contaminate the evaluation. 4) Fits a multinomial logistic regression with up to 500 iterations of the optimizer. 5) <code>predict</code> returns hard class labels, <code>predict_proba</code> returns a (n_test, 3) matrix where each row sums to 1 -- the model's confidence per class. 6) <code>classification_report</code> prints precision, recall, F1, and support for every class -- one of the most useful one-liners in sklearn. 7) Inspects <code>clf.coef_</code>: shape (3, 4), one row per class with weights for each feature. Large positive weight = strong indicator for that class.</p>

<div id="plot-l1-iris-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The 150 iris flowers projected onto their two most discriminative features (petal length and petal width), colored by species. Setosa is linearly separable from the other two -- that is why every iris classifier hits 100% on it. Versicolor and virginica overlap slightly along the boundary, which is where the model occasionally errs and where the test accuracy 0.97 instead of 1.00 comes from. This is the kind of plot you should make every time you start a new dataset: where are the easy wins and where will the errors live?</div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why scale BEFORE fit, and why on training data only? Logistic regression's optimizer converges much faster when features are on similar scales -- with raw iris data (one feature in cm, ranges differing) you might need 1000 iterations; scaled, you need 50. The "fit on train only" rule is about <em>realism</em>: in production, you do not have access to test data when you build your scaler. If you scale using train+test mean/std, you are using future information and your test accuracy is optimistic. Always train transformations on the training set alone.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Common Pitfalls for Beginners</h2>

<p class="l-text">Even with the most consistent API in ML, a handful of pitfalls catch every beginner. Here are the top ones, with fixes.</p>

<div class="calc-step"><strong>Pitfall 1: Forgetting random_state.</strong> <code>train_test_split</code> shuffles by default, so without <code>random_state=42</code>, your accuracy changes every run. Always fix the seed during development for reproducibility.</div>

<div class="calc-step"><strong>Pitfall 2: Calling fit on test data.</strong> <code>scaler.fit(X_test)</code> or worse, <code>fit(X_train.append(X_test))</code> leaks information. Rule: <code>fit_transform</code> on train, <code>transform</code> on test. Always.</div>

<div class="calc-step"><strong>Pitfall 3: Confusing predict and predict_proba.</strong> <code>predict</code> returns hard labels (integers); <code>predict_proba</code> returns probability matrices (n_samples, n_classes). For ROC curves and threshold tuning, you need probabilities.</div>

<div class="calc-step"><strong>Pitfall 4: Ignoring class imbalance.</strong> If 95% of your samples are negative, an accuracy of 0.95 is achieved by predicting "negative" for everything. Use <code>stratify=y</code> in splits, and track precision/recall/F1, not just accuracy.</div>

<div class="calc-step"><strong>Pitfall 5: Reusing a fitted estimator without re-fitting.</strong> Once you call <code>fit</code> on new data, all learned attributes are overwritten. If you want to compare two trained models, instantiate two separate objects.</div>

<div class="calc-step"><strong>Pitfall 6: Hyperparameters vs learned params.</strong> <code>n_estimators=100</code> is a hyperparameter you set; <code>feature_importances_</code> is learned. Confusing them leads to mysterious "no attribute" errors. Underscore = learned; no underscore = config.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: Reproducible NLP experiment</div><div class="example-body">Your reviewer asks you to reproduce the 0.873 F1 you reported. If you forgot <code>random_state</code>, the next run gives 0.864 and your credibility is gone. Cardinal rule for thesis-grade work: every <code>train_test_split</code>, every <code>KFold</code>, every <code>RandomForestClassifier</code> gets <code>random_state=42</code> (or any fixed value). Better: use a global config <code>SEED = 42</code> and pass it everywhere.</div></div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> sklearn's value is the unified API: <code>fit / predict / transform / score</code>.<br><strong>2.</strong> Estimators store learned things in attributes ending with underscore (<code>coef_</code>, <code>cluster_centers_</code>).<br><strong>3.</strong> <code>fit_transform</code> on training data, <code>transform</code> on test -- never the reverse.<br><strong>4.</strong> Classifiers have <code>predict_proba</code>; regressors do not.<br><strong>5.</strong> Built-in datasets (<code>load_iris</code>, <code>fetch_20newsgroups</code>) and synthetic generators (<code>make_classification</code>, <code>make_blobs</code>) are your sandbox.<br><strong>6.</strong> Always set <code>random_state</code>, always use <code>stratify=y</code> for classification splits, always check class balance.<br><strong>7.</strong> The next lessons fill in the rest: preprocessing, models, validation, metrics, dimensionality reduction. The pattern stays the same.</div></div>
</div>

<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};
  var palette = [T.accent, '#4ecdc4', '#f87171', '#a78bfa'];

  function rng(seed){return function(){seed=(seed*9301+49297)%233280;return seed/233280;};}

  function makeBlobs(n,centers,std,seed){
    var rand = rng(seed);
    var xs=[],ys=[],labels=[];
    var per = Math.floor(n/centers.length);
    for (var c=0;c<centers.length;c++){
      for (var i=0;i<per;i++){
        var u = rand(), v=rand();
        var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
        xs.push(centers[c][0]+std*z0);
        ys.push(centers[c][1]+std*z1);
        labels.push(c);
      }
    }
    return {xs:xs,ys:ys,labels:labels};
  }

  // 1. blobs
  var elB = document.getElementById('plot-l1-blobs-en');
  if (elB){
    var B = makeBlobs(300,[[0,0],[5,5],[5,0],[0,5]],0.7,7);
    var traces=[];
    for (var c=0;c<4;c++){
      var xs=[],ys=[];
      for (var i=0;i<B.labels.length;i++){if(B.labels[i]===c){xs.push(B.xs[i]);ys.push(B.ys[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'Cluster '+c,marker:{color:palette[c],size:8,opacity:0.75,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'make_blobs: 4 synthetic clusters in 2D',font:{color:T.text,size:14}},xaxis:{title:'Feature 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Feature 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l1-blobs-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // 2. iris petal length vs petal width (real values)
  var elI = document.getElementById('plot-l1-iris-en');
  if (elI){
    var pl = [1.4,1.4,1.3,1.5,1.4,1.7,1.4,1.5,1.4,1.5,1.5,1.6,1.4,1.1,1.2,1.5,1.3,1.4,1.7,1.5,1.7,1.5,1.0,1.7,1.9,1.6,1.6,1.5,1.4,1.6,1.6,1.5,1.5,1.4,1.5,1.2,1.3,1.5,1.3,1.5,1.3,1.3,1.3,1.6,1.9,1.4,1.6,1.4,1.5,1.4,4.7,4.5,4.9,4.0,4.6,4.5,4.7,3.3,4.6,3.9,3.5,4.2,4.0,4.7,3.6,4.4,4.5,4.1,4.5,3.9,4.8,4.0,4.9,4.7,4.3,4.4,4.8,5.0,4.5,3.5,3.8,3.7,3.9,5.1,4.5,4.5,4.7,4.4,4.1,4.0,4.4,4.6,4.0,3.3,4.2,4.2,4.2,4.3,3.0,4.1,6.0,5.1,5.9,5.6,5.8,6.6,4.5,6.3,5.8,6.1,5.1,5.3,5.5,5.0,5.1,5.3,5.5,6.7,6.9,5.0,5.7,4.9,6.7,4.9,5.7,6.0,4.8,4.9,5.6,5.8,6.1,6.4,5.6,5.1,5.6,6.1,5.6,5.5,4.8,5.4,5.6,5.1,5.1,5.9,5.7,5.2,5.0,5.2,5.4,5.1];
    var pw = [0.2,0.2,0.2,0.2,0.2,0.4,0.3,0.2,0.2,0.1,0.2,0.2,0.1,0.1,0.2,0.4,0.4,0.3,0.3,0.3,0.2,0.4,0.2,0.5,0.2,0.2,0.4,0.2,0.2,0.2,0.2,0.4,0.1,0.2,0.2,0.2,0.2,0.1,0.2,0.2,0.3,0.3,0.2,0.6,0.4,0.3,0.2,0.2,0.2,0.2,1.4,1.5,1.5,1.3,1.5,1.3,1.6,1.0,1.3,1.4,1.0,1.5,1.0,1.4,1.3,1.4,1.5,1.0,1.5,1.1,1.8,1.3,1.5,1.2,1.3,1.4,1.4,1.7,1.5,1.0,1.1,1.0,1.2,1.6,1.5,1.6,1.5,1.3,1.3,1.3,1.2,1.4,1.2,1.0,1.3,1.2,1.3,1.3,1.1,1.3,2.5,1.9,2.1,1.8,2.2,2.1,1.7,1.8,1.8,2.5,2.0,1.9,2.1,2.0,2.4,2.3,1.8,2.2,2.3,1.5,2.3,2.0,2.0,1.8,2.1,1.8,1.8,1.8,2.1,1.6,1.9,2.0,2.2,1.5,1.4,2.3,2.4,1.8,1.8,2.1,2.4,2.3,1.9,2.3,2.5,2.3,1.9,2.0,2.3,1.8];
    var names = ['setosa','versicolor','virginica'];
    var traces=[];
    for (var c=0;c<3;c++){
      var xs=[],ys=[];
      for (var i=0;i<150;i++){if(Math.floor(i/50)===c){xs.push(pl[i]);ys.push(pw[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:names[c],marker:{color:palette[c],size:9,opacity:0.8,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'Iris flowers in petal-length vs petal-width plane',font:{color:T.text,size:14}},xaxis:{title:'Petal length (cm)',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Petal width (cm)',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l1-iris-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elBtr = document.getElementById('plot-l1-blobs-tr');
  if (elBtr){
    var B = makeBlobs(300,[[0,0],[5,5],[5,0],[0,5]],0.7,7);
    var traces=[];
    for (var c=0;c<4;c++){
      var xs=[],ys=[];
      for (var i=0;i<B.labels.length;i++){if(B.labels[i]===c){xs.push(B.xs[i]);ys.push(B.ys[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'Kume '+c,marker:{color:palette[c],size:8,opacity:0.75,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'make_blobs: 2B uzayda 4 sentetik kume',font:{color:T.text,size:14}},xaxis:{title:'Ozellik 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Ozellik 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l1-blobs-tr',traces,layout,{responsive:true,displayModeBar:false});
  }

  var elItr = document.getElementById('plot-l1-iris-tr');
  if (elItr){
    var pl = [1.4,1.4,1.3,1.5,1.4,1.7,1.4,1.5,1.4,1.5,1.5,1.6,1.4,1.1,1.2,1.5,1.3,1.4,1.7,1.5,1.7,1.5,1.0,1.7,1.9,1.6,1.6,1.5,1.4,1.6,1.6,1.5,1.5,1.4,1.5,1.2,1.3,1.5,1.3,1.5,1.3,1.3,1.3,1.6,1.9,1.4,1.6,1.4,1.5,1.4,4.7,4.5,4.9,4.0,4.6,4.5,4.7,3.3,4.6,3.9,3.5,4.2,4.0,4.7,3.6,4.4,4.5,4.1,4.5,3.9,4.8,4.0,4.9,4.7,4.3,4.4,4.8,5.0,4.5,3.5,3.8,3.7,3.9,5.1,4.5,4.5,4.7,4.4,4.1,4.0,4.4,4.6,4.0,3.3,4.2,4.2,4.2,4.3,3.0,4.1,6.0,5.1,5.9,5.6,5.8,6.6,4.5,6.3,5.8,6.1,5.1,5.3,5.5,5.0,5.1,5.3,5.5,6.7,6.9,5.0,5.7,4.9,6.7,4.9,5.7,6.0,4.8,4.9,5.6,5.8,6.1,6.4,5.6,5.1,5.6,6.1,5.6,5.5,4.8,5.4,5.6,5.1,5.1,5.9,5.7,5.2,5.0,5.2,5.4,5.1];
    var pw = [0.2,0.2,0.2,0.2,0.2,0.4,0.3,0.2,0.2,0.1,0.2,0.2,0.1,0.1,0.2,0.4,0.4,0.3,0.3,0.3,0.2,0.4,0.2,0.5,0.2,0.2,0.4,0.2,0.2,0.2,0.2,0.4,0.1,0.2,0.2,0.2,0.2,0.1,0.2,0.2,0.3,0.3,0.2,0.6,0.4,0.3,0.2,0.2,0.2,0.2,1.4,1.5,1.5,1.3,1.5,1.3,1.6,1.0,1.3,1.4,1.0,1.5,1.0,1.4,1.3,1.4,1.5,1.0,1.5,1.1,1.8,1.3,1.5,1.2,1.3,1.4,1.4,1.7,1.5,1.0,1.1,1.0,1.2,1.6,1.5,1.6,1.5,1.3,1.3,1.3,1.2,1.4,1.2,1.0,1.3,1.2,1.3,1.3,1.1,1.3,2.5,1.9,2.1,1.8,2.2,2.1,1.7,1.8,1.8,2.5,2.0,1.9,2.1,2.0,2.4,2.3,1.8,2.2,2.3,1.5,2.3,2.0,2.0,1.8,2.1,1.8,1.8,1.8,2.1,1.6,1.9,2.0,2.2,1.5,1.4,2.3,2.4,1.8,1.8,2.1,2.4,2.3,1.9,2.3,2.5,2.3,1.9,2.0,2.3,1.8];
    var names = ['setosa','versicolor','virginica'];
    var traces=[];
    for (var c=0;c<3;c++){
      var xs=[],ys=[];
      for (var i=0;i<150;i++){if(Math.floor(i/50)===c){xs.push(pl[i]);ys.push(pw[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:names[c],marker:{color:palette[c],size:9,opacity:0.8,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'Iris cicekleri: tac-yaprak uzunlugu vs genisligi',font:{color:T.text,size:14}},xaxis:{title:'Tac-yaprak uzunlugu (cm)',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Tac-yaprak genisligi (cm)',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l1-iris-tr',traces,layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<div class="math-prereq" style="background:rgba(245,158,11,0.07);border-left:3px solid #f59e0b;padding:0.95rem 1.2rem;margin:0 0 1.5rem 0;border-radius:0 8px 8px 0">
<div style="font-size:0.74rem;font-weight:700;letter-spacing:0.1em;color:#f59e0b;margin-bottom:0.5rem">📐 MATEMATİK TEMELLERİ</div>
<p style="margin:0 0 0.55rem 0;font-size:0.9rem;line-height:1.55;color:rgba(235,230,220,0.85)">Burada kullanılan matematiğe yeni misin? Önce şu temelleri tazele — her biri bağımsız bir Matematik dersi:</p>
<ul style="margin:0;padding-left:1.25rem;font-size:0.88rem;line-height:1.7;color:rgba(235,230,220,0.85);list-style:none">
<li><a href="/tutorials/matematik/40" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Fonksiyon Tanımı</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L40)</span></li>
<li><a href="/tutorials/matematik/94" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Olasılık Temelleri</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L94)</span></li>
<li><a href="/tutorials/matematik/101" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Beklenen Değer</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L101)</span></li>
<li><a href="/tutorials/matematik/102" style="color:#f59e0b;text-decoration:none;border-bottom:1px dotted #f59e0b">Ortalama, Medyan, Mod</a> <span style="opacity:0.55;font-size:0.82em">(Matematik L102)</span></li>
</ul>
</div>
<p class="l-text"><strong>scikit-learn, Python'da klasik makine öğrenmesinin İsviçre çakısıdır.</strong> Hiç logistic regression eğittiyseniz, random forest kurduysanız, k-means ile kümeleme yaptıysanız ya da TF-IDF + SVM ile duygu sınıflandırıcı çalıştırdıysanız, büyük ihtimalle bunu scikit-learn ile yaptınız. Derin sinir ağları içermeyen "üretim ML" işlerinin yaklaşık %90'ı bu kütüphane üzerinde döner; DL boru hatları bile ön işleme, bölme, metrikler ve baseline'lar için sklearn'e dayanır.</p>

<p class="l-text">Bu ilk derste benchmark ya da süslü bir model peşinde koşmayacağız. Bunun yerine, sklearn'in geri kalanını anlamlı kılan <strong>zihinsel modeli</strong> kuracağız: her estimator -- ister scaler, ister sınıflandırıcı, ister kümeleme algoritması, ister boyut indirgeyici olsun -- aynı üç metot dilini konuşur: <code>fit</code>, <code>predict</code> (veya <code>transform</code>) ve isteğe bağlı olarak <code>score</code>. Bunu bir kere içselleştirdiğinizde, 200 sınıf adı ezberlemeyi bırakıp onları birleştirmeye başlarsınız.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Her sklearn estimator'ünün paylaştığı birleşik fit/predict/transform API'sini açıkla</li><li>Tablolu veride beş satır kodla bir sınıflandırıcı eğit</li><li>train_test_split ve sabit seed ile veriyi train ve test olarak ayır</li><li>Bir modeli accuracy, score ve ayrılmış validation seti ile değerlendir</li><li>Estimator, predictor, transformer ve meta-estimator'leri ayır</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden scikit-learn? Üst Bakış</h2>

<p class="l-text">Bir NLP pratisyeni olduğunuzu hayal edin. 50.000 film yorumunu temizlediniz, 20.000 özellikli TF-IDF vektörlerini hesapladınız ve şimdi olumlu/olumsuz duyguyu tahmin etmek istiyorsunuz. Logistic regression'ı NumPy ile elden yazabilirsiniz: sigmoid'i implement edin, gradient descent döngüsünü yazın, öğrenme oranını debug edin, L2 regularization ekleyin, sonra cross-validation için hepsini tekrarlayın. Bu bir haftalık iştir. sklearn ile aynı baseline altı satır koddur -- ve 2007'den beri milyonlarca kullanıcı tarafından savaş alanında test edilmiştir.</p>

<div class="calc-highlight"><strong>scikit-learn'in vaadi:</strong> tablo veya seyrek veri üzerinde, klasik (derin olmayan) ML'deki herhangi bir görev, hepsi aynı API'yi paylaşan bir avuç estimator'ün birleştirilmesiyle ifade edilebilir. API'yi bir kez öğrenin, ~200 algoritmaya erişiminiz olur.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Tutarlı API</div><div class="card-body">Her estimator'da <code>fit(X, y)</code> vardır. Tahminciler <code>predict(X)</code> ekler. Dönüştürücüler <code>transform(X)</code> ekler. Aslında ihtiyacınız olan tek şey budur.</div></div>
<div class="calc-card"><div class="card-title">NumPy yerlisi</div><div class="card-body">Girdiler NumPy dizileri veya Pandas DataFrame'leridir; çıktılar NumPy dizileridir. Özel tensör yok, GPU sürprizi yok -- sadece CPU ve diziler.</div></div>
<div class="calc-card"><div class="card-title">Birleştirilebilir</div><div class="card-body">Pipeline'lar dönüştürücüleri ve son bir estimator'ü zincirler. ColumnTransformer farklı sütunlara farklı ön işleyicileri uygular. Her şey takılabilir.</div></div>
<div class="calc-card"><div class="card-title">Test edilmiş</div><div class="card-body">Binlerce şirkette üretimde; algoritmalar makalelerde alıntılanan referans implementasyonlardır. Hatalar nadirdir ve hızla düzeltilir.</div></div>
<div class="calc-card"><div class="card-title">Belgelenmiş</div><div class="card-body">Sadece kullanıcı kılavuzu ~1500 sayfa açıklama ve örnek içerir. Neredeyse her parametre formüller ve referanslarla belgelenmiştir.</div></div>
<div class="calc-card"><div class="card-title">Derin öğrenme için değil</div><div class="card-body">GPU autodiff yok. NN ağırlıklı problemler için PyTorch kullanın. Ama sklearn hâlâ ön işleme, bölme, metrikler ve baseline iş atınızdır.</div></div>
</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP pratisyen baseline'ı</div><div class="example-body">500.000 tweet üzerinde duygu için süslü bir BERT modeli eğitmeden önce, bir baseline'a ihtiyacınız var. Standart pratisyen taktiği: bir Pipeline içinde <code>TfidfVectorizer + LogisticRegression</code> size BERT'in doğruluğunun %85-90'ını 30 saniyelik eğitimle verir. Eğer transformer'ınız bu baseline'ı yenemiyorsa, darboğaz mimari değil -- verinizdir. sklearn mükemmel bir baseline fabrikasıdır.</div></div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Neden scikit-learn bilinçli olarak sığ kalıyor (GPU yok, autodiff yok, küçük bir MLP'nin ötesinde sinir ağı yok)? Çünkü derinleştiğiniz an birleştirici API'yi kaybedersiniz: her NN mimarisinin kendi eğitim döngüsü, kendi hiperparametreleri, kendi tuhaflıkları vardır. Klasik kalarak sklearn yeni bir algoritma deneme maliyetini tam olarak bir satır kodda tutar: estimator sınıfını değiştirin. Bu tekdüzelik tüm değer önerisinin kendisidir.</div></div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kurulum ve İlk Estimator'ünüz</h2>

<p class="l-text">scikit-learn'i pip veya conda ile kurun. Bağımlılık olarak NumPy, SciPy, joblib ve threadpoolctl'yi getirir -- hepsi standart bilimsel Python.</p>

<div class="code-wrap"><div class="code-label"><span>BASH</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Önerilen: bir venv içinde pip</span>
pip install scikit-learn pandas matplotlib

<span class="cm"># Veya conda ile</span>
conda install -c conda-forge scikit-learn pandas matplotlib

<span class="cm"># Doğrula</span>
python -c <span class="str">"import sklearn; print(sklearn.__version__)"</span>
<span class="cm"># 1.4.x veya daha yeni</span></code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>pip install scikit-learn</code> önceden derlenmiş wheel'i PyPI'den indirir -- Windows/Mac/Linux'ta derleme gerekmez. 2) Pandas yumuşak bir bağımlılıktır: birçok sklearn örneği DataFrame'leri doğrudan kabul eder. 3) Matplotlib yerleşik çizim yardımcıları için gereklidir (karar sınırları, karışıklık matrisleri vb.). 4) Sürüm kontrolü kurulumu doğrular -- 2024+ itibarıyla 1.4 veya daha yenisinde olmalısınız. API 1.0'dan beri (2021 sonu) stabildir, dolayısıyla 2022+ herhangi bir tutorial kodu çalışmalıdır.</p>

<p class="l-text">Şimdi ilk estimator'ümüzü eğitelim -- klasik <strong>iris veri seti</strong> üzerinde bir logistic regression. Iris'te 150 çiçek, 4 özellik (çanak/taç yaprağı uzunluğu ve genişliği) ve 3 tür vardır. ML'in "merhaba dünya"sıdır.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split

<span class="cm"># 1. Veriyi yükle</span>
iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target          <span class="cm"># X: (150, 4), y: (150,)</span>
<span class="fn">print</span>(X.shape, y.shape)
<span class="fn">print</span>(iris.feature_names)
<span class="fn">print</span>(iris.target_names)               <span class="cm"># ['setosa' 'versicolor' 'virginica']</span>

<span class="cm"># 2. Eğitim ve test olarak böl</span>
X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.25</span>, random_state=<span class="num">42</span>, stratify=y
)

<span class="cm"># 3. Estimator'ü oluştur</span>
model = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">200</span>)

<span class="cm"># 4. Eğitim verisinde fit et</span>
model.<span class="fn">fit</span>(X_train, y_train)

<span class="cm"># 5. Test verisinde tahmin yap</span>
y_pred = model.<span class="fn">predict</span>(X_test)

<span class="cm"># 6. Skor</span>
acc = model.<span class="fn">score</span>(X_test, y_test)
<span class="fn">print</span>(f<span class="str">"Test dogrulugu: {acc:.3f}"</span>)
<span class="cm"># Test dogrulugu: 0.974</span></code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>load_iris()</code> bir Bunch (dict benzeri) döner: <code>.data</code> (özellik matrisi X), <code>.target</code> (etiket vektörü y) ve insan-okunur isimler için <code>.feature_names</code>, <code>.target_names</code>. 2) <code>train_test_split</code> veriyi karıştırır ve %75 eğitim / %25 test olarak böler; <code>stratify=y</code> her iki bölmede sınıf oranlarını aynı tutar -- dengesiz veride elzemdir. 3) <code>LogisticRegression(max_iter=200)</code> eğitilmemiş bir estimator örneği oluşturur -- yapılandırılmış bir nesnedir, henüz eğitilmiş model değildir. 4) <code>model.fit(X_train, y_train)</code> optimizasyonu çalıştırır (burada quasi-Newton solver) ve öğrenilen katsayıları <code>model.coef_</code> ve <code>model.intercept_</code>'a kaydeder. 5) <code>model.predict(X_test)</code> her test satırı için tek bir tahmini sınıf döner. 6) <code>model.score(X_test, y_test)</code> sınıflandırıcılar için varsayılan olarak ortalama doğruluğu döner; bu kolay veri setinde ~%97 alırız.</p>

<div class="calc-highlight"><strong>Az önce tüm sklearn iş akışını kullandınız:</strong> yükle -> böl -> örnek oluştur -> fit et -> tahmin et -> skorla. Kütüphanedeki diğer her algoritma tam olarak aynı deseni izler. <code>LogisticRegression</code>'ı <code>RandomForestClassifier</code> veya <code>SVC</code> ile değiştirin -- kodun geri kalanı aynı kalır.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Estimator API: fit, predict, transform, score</h2>

<p class="l-text">sklearn nesnelerini hangi metotları implement ettiklerine göre birkaç kategoriye ayırır. Bu sınıflandırmayı ezberleyin, tüm kütüphane size açılır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Estimator</div><div class="card-body"><code>.fit(X, y=None)</code>'a sahip her şey. Temel sınıf. Öğrenilen nitelikler alt çizgi ile biter (örn. <code>coef_</code>, <code>cluster_centers_</code>).</div></div>
<div class="calc-card"><div class="card-title">Predictor</div><div class="card-body">Estimator + <code>.predict(X)</code>. Tüm sınıflandırıcılar ve regresörler. Çıktı: 1B tahmin dizisi, uzunluk = n_samples.</div></div>
<div class="calc-card"><div class="card-title">Transformer</div><div class="card-body">Estimator + <code>.transform(X)</code>. Tüm ön işleyiciler (scaler'lar, encoder'lar), özellik çıkarıcılar (PCA, TF-IDF) ve özellik seçiciler.</div></div>
<div class="calc-card"><div class="card-title">Sınıflandırıcı</div><div class="card-body">Predictor, ek olarak <code>.predict_proba(X)</code> (uygulanabildiği durumda) ve <code>.classes_</code>. predict çıktısı ayrık sınıflardan biridir.</div></div>
<div class="calc-card"><div class="card-title">Regresör</div><div class="card-body"><code>predict</code>'i sürekli float'lar döndüren predictor. Skor varsayılan olarak R-kareye düşer.</div></div>
<div class="calc-card"><div class="card-title">Kümeleyici</div><div class="card-body"><code>.fit_predict(X)</code>'e sahip estimator. fit'te y yok. Eğitildikten sonra <code>.labels_</code> küme atamasını saklar.</div></div>
</div>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Predictor</div><div class="compare-item">Sınıflar: <code>LogisticRegression</code>, <code>RandomForestClassifier</code>, <code>LinearRegression</code></div><div class="compare-item">Metotlar: <code>fit(X, y)</code>, <code>predict(X)</code>, isteğe bağlı <code>predict_proba(X)</code>, <code>score(X, y)</code></div><div class="compare-item">Amaç: X'i y'ye eşlemek</div><div class="compare-item">predict çıktısı: n_samples uzunluğunda 1B dizi</div></div>
<div class="compare-col"><div class="compare-title">Transformer</div><div class="compare-item">Sınıflar: <code>StandardScaler</code>, <code>PCA</code>, <code>TfidfVectorizer</code>, <code>OneHotEncoder</code></div><div class="compare-item">Metotlar: <code>fit(X)</code>, <code>transform(X)</code>, <code>fit_transform(X)</code></div><div class="compare-item">Amaç: X'i farklı bir X'e dönüştürmek</div><div class="compare-item">transform çıktısı: 2B dizi (sütun sayısı farklı olabilir)</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.cluster <span class="kw">import</span> KMeans

<span class="cm"># Bir transformer: ozellikleri yeniden olcekle</span>
X = np.<span class="fn">array</span>([[<span class="num">1.0</span>, <span class="num">200.0</span>], [<span class="num">2.0</span>, <span class="num">400.0</span>], [<span class="num">3.0</span>, <span class="num">600.0</span>], [<span class="num">4.0</span>, <span class="num">800.0</span>]])
scaler = <span class="fn">StandardScaler</span>()
scaler.<span class="fn">fit</span>(X)                 <span class="cm"># ortalama ve std ogren</span>
X_scaled = scaler.<span class="fn">transform</span>(X)
<span class="fn">print</span>(X_scaled.<span class="fn">mean</span>(axis=<span class="num">0</span>))  <span class="cm"># ~[0, 0]</span>
<span class="fn">print</span>(X_scaled.<span class="fn">std</span>(axis=<span class="num">0</span>))   <span class="cm"># ~[1, 1]</span>
<span class="cm"># Es kisayol:</span>
X_scaled = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)

<span class="cm"># Bir regresor: X'ten y'yi tahmin et</span>
y = np.<span class="fn">array</span>([<span class="num">10.0</span>, <span class="num">20.0</span>, <span class="num">30.0</span>, <span class="num">40.0</span>])
reg = <span class="fn">LinearRegression</span>()
reg.<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(reg.<span class="fn">predict</span>([[<span class="num">2.5</span>, <span class="num">500.0</span>]]))   <span class="cm"># ~[25.0]</span>
<span class="fn">print</span>(reg.coef_, reg.intercept_)     <span class="cm"># ogrenilmis nitelikler _ ile biter</span>

<span class="cm"># Bir kumeleyici: y hic yok</span>
km = <span class="fn">KMeans</span>(n_clusters=<span class="num">2</span>, n_init=<span class="num">10</span>, random_state=<span class="num">0</span>)
km.<span class="fn">fit</span>(X)
<span class="fn">print</span>(km.labels_)              <span class="cm"># her satir icin kume atamasi</span>
<span class="fn">print</span>(km.cluster_centers_)     <span class="cm"># ogrenilmis nitelik</span></code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) <code>StandardScaler.fit(X)</code> her sütunun ortalamasını ve standart sapmasını hesaplar ve bunları <code>scaler.mean_</code> ve <code>scaler.scale_</code>'a kaydeder (sondaki alt çizgiye dikkat -- "fit sırasında öğrenildi" için bir sklearn geleneği). 2) <code>scaler.transform(X)</code> elemanlar bazında <code>(X - ortalama) / std</code> uygular ve her sütunun ortalaması 0, std'si 1 olan bir özellik matrisi üretir. 3) <code>fit_transform</code> her ikisini birden yapan kısayoldur ve eğitim setinde çağrılması gereken doğru metottur. 4) <code>LinearRegression().fit(X, y)</code> normal denklem yoluyla optimal katsayıları öğrenir, <code>coef_</code> (her özellik için eğim) ve <code>intercept_</code>'ı kaydeder. 5) <code>predict</code> yeni bir X alır ve tahmini y değerlerini döndürür. 6) <code>KMeans</code> denetimsizdir: <code>fit(X)</code> sadece X alır (y yok) ve sonuç <code>labels_</code>'da saklanır -- her girdi satırı için atanmış küme.</p>

<div class="l-warn"><strong>Konvansiyon:</strong> fit'ten <em>önce</em> var olan nitelikler hiperparametrelerdir (alt çizgi yok: <code>n_clusters</code>, <code>max_iter</code>). fit'ten <em>sonra</em> var olan nitelikler öğrenilmiştir (sondaki alt çizgi: <code>coef_</code>, <code>cluster_centers_</code>, <code>n_iter_</code>). Eğer <code>fit</code> çağırmadan <code>model.coef_</code>'a erişmeye çalışırsanız <code>NotFittedError</code> alırsınız.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Yerleşik Veri Setleri ve Sentetik Üreticiler</h2>

<p class="l-text">Öğrenmek ve test etmek için sklearn bir avuç küçük klasik veri seti ve bir dizi sentetik veri üreticisi ile gelir. Geliştirme sırasında bunları sürekli kullanacaksınız.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">load_iris</div><div class="card-body">150 çiçek, 4 özellik, 3 sınıf. Sınıflandırmanın "merhaba dünya"sı.</div></div>
<div class="calc-card"><div class="card-title">load_wine</div><div class="card-body">178 şarap, 13 özellik, 3 sınıf. Iris'ten biraz daha zor, hâlâ küçük.</div></div>
<div class="calc-card"><div class="card-title">load_breast_cancer</div><div class="card-body">569 örnek, 30 özellik, ikili. Gerçekçi tıbbi-vari bir veri seti.</div></div>
<div class="calc-card"><div class="card-title">load_digits</div><div class="card-body">1797 elle çizilmiş rakam, 8x8 gri tonlama, 10 sınıf. Minik görüntü sınıflandırma.</div></div>
<div class="calc-card"><div class="card-title">fetch_openml</div><div class="card-body">OpenML.org'tan çek -- MNIST, adult census, kredi vb. erişimi.</div></div>
<div class="calc-card"><div class="card-title">fetch_20newsgroups</div><div class="card-body">~20 bin Usenet postası, 20 kategori. Metin sınıflandırma için klasik NLP korpusu.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> (load_iris, load_breast_cancer, load_digits,
                              fetch_20newsgroups, make_classification,
                              make_regression, make_blobs, make_moons)

<span class="cm"># Yerlesik tablo veri setleri</span>
iris = <span class="fn">load_iris</span>(as_frame=<span class="kw">True</span>)        <span class="cm"># as_frame=True bir Pandas DataFrame verir</span>
<span class="fn">print</span>(iris.frame.<span class="fn">head</span>())               <span class="cm"># hedef sutunu olan gercek bir DataFrame</span>

<span class="cm"># Gercek dunya NLP korpusu</span>
news = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">'train'</span>, categories=[<span class="str">'sci.space'</span>, <span class="str">'rec.sport.baseball'</span>])
<span class="fn">print</span>(<span class="fn">len</span>(news.data), news.target_names)
<span class="fn">print</span>(news.data[<span class="num">0</span>][:<span class="num">200</span>])              <span class="cm"># ilk postanin ham metni</span>

<span class="cm"># Sentetik veri -- test icin is atlari</span>
X, y = <span class="fn">make_classification</span>(n_samples=<span class="num">1000</span>, n_features=<span class="num">20</span>, n_informative=<span class="num">5</span>,
                           n_redundant=<span class="num">2</span>, n_classes=<span class="num">2</span>, random_state=<span class="num">0</span>)

X_reg, y_reg = <span class="fn">make_regression</span>(n_samples=<span class="num">500</span>, n_features=<span class="num">10</span>, noise=<span class="num">10</span>, random_state=<span class="num">0</span>)

X_blob, y_blob = <span class="fn">make_blobs</span>(n_samples=<span class="num">300</span>, centers=<span class="num">4</span>, cluster_std=<span class="num">0.7</span>, random_state=<span class="num">0</span>)

X_moon, y_moon = <span class="fn">make_moons</span>(n_samples=<span class="num">200</span>, noise=<span class="num">0.15</span>, random_state=<span class="num">0</span>)
<span class="cm"># Ic ice gecmis iki yarim ay -- lineer siniflandiricilar burada CALISMAZ</span></code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) <code>load_iris(as_frame=True)</code> veri setini hedef sütunu dahil bir Pandas DataFrame olarak paketlenmiş şekilde döndürür -- modern tercih edilen biçim. 2) <code>fetch_20newsgroups</code> gerçek bir NLP korpusunu indirir (ve önbelleğe alır); <code>subset='train'</code> eğitim bölümünü verir, <code>categories</code> argümanı hızlı deney için ikili bir alt küme seçmenize izin verir. 3) <code>make_classification</code> sentetik bir ikili veri seti oluşturur; bilgilendirici, yedek ve gürültü özellik sayılarını siz kontrol edersiniz -- pipeline'ınızın sinyal sütunlarını doğru tanıyıp tanımadığını test etmek için mükemmeldir. 4) <code>make_regression</code> Gauss gürültülü bir doğrusal regresyon oyuncağı üretir; <code>noise=10</code> sinyal-gürültü oranını kontrol eder. 5) <code>make_blobs</code> standart kümeleme oyuncağıdır: 2B'de iyi ayrılmış Gauss kümeleri. 6) <code>make_moons</code> standart "lineer çözemez" demosudur -- iki yarım ay doğrusal olmayan bir karar sınırı gerektirir.</p>

<div id="plot-l1-blobs-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu görselin söylediği:</strong> <code>make_blobs(centers=4)</code> tarafından üretilen 300 sentetik 2B nokta, gerçek küme etiketlerine göre renklendirilmiş. Net bir şekilde ayrılmış dört grup, bir kümeleme algoritmasını ilk test ederken tam olarak istediğiniz şeydir: KMeans bu blob'ları kurtaramazsa pipeline'ınızda bir hata vardır. Bunun gibi sentetik üreticiler, belirsiz gerçek dünya verisi yolunuza çıkmadan debug etmenize ve kıyaslamanıza olanak tanır.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP için sentetik veri neden önemli</div><div class="example-body">Bir duygu pipeline'ını debug ederken, hatanız tokenizer'da, vectorizer'da, modelde veya metrik kodunda olabilir. <code>make_classification</code> ile metni tamamen atlarsınız: modele temiz bir sayısal problem verin, öğrendiğini doğrulayın, sonra TF-IDF özelliklerini takın. Doğruluk 0.95'ten (sentetik) 0.55'e (gerçek) düşerse, sorununuz metin özellikleridir. Sentetik veri arıza modlarını yalıtır.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Iris Üzerinde Tam Bir Mini Pipeline</h2>

<p class="l-text">Hepsini birleştirelim: iris yükle, böl, ölçekle, logistic regression eğit, değerlendir. Sezgi inşa etmek için öğrenilen katsayıları ve sınıf başına olasılıkları inceleyeceğiz.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, classification_report

<span class="cm"># 1. Yukle</span>
iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target
<span class="fn">print</span>(f<span class="str">"X sekli: {X.shape}, y sekli: {y.shape}"</span>)
<span class="fn">print</span>(f<span class="str">"Siniflar: {dict(zip(iris.target_names, np.bincount(y)))}"</span>)

<span class="cm"># 2. Bol (stratify edilmis)</span>
X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">42</span>, stratify=y
)

<span class="cm"># 3. Olcekle (sadece TRAIN uzerinde fit -- sizinti onleme)</span>
scaler = <span class="fn">StandardScaler</span>()
X_train_s = scaler.<span class="fn">fit_transform</span>(X_train)
X_test_s  = scaler.<span class="fn">transform</span>(X_test)         <span class="cm"># NOT: testte sadece transform</span>

<span class="cm"># 4. Fit</span>
clf = <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>)
clf.<span class="fn">fit</span>(X_train_s, y_train)

<span class="cm"># 5. Tahmin + Olasiliklar</span>
y_pred  = clf.<span class="fn">predict</span>(X_test_s)
y_proba = clf.<span class="fn">predict_proba</span>(X_test_s)         <span class="cm"># sekil (n_test, 3)</span>
<span class="fn">print</span>(<span class="str">"Ilk 3 olasilik satiri:"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(y_proba[:<span class="num">3</span>], <span class="num">3</span>))

<span class="cm"># 6. Degerlendir</span>
<span class="fn">print</span>(f<span class="str">"Dogruluk: {accuracy_score(y_test, y_pred):.3f}"</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, y_pred, target_names=iris.target_names))

<span class="cm"># 7. Ogrenilen agirliklari incele -- her sinif icin bir satir</span>
<span class="fn">print</span>(<span class="str">"Katsayilar (sinif x ozellik):"</span>)
<span class="fn">print</span>(np.<span class="fn">round</span>(clf.coef_, <span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Kesisimler:"</span>, np.<span class="fn">round</span>(clf.intercept_, <span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) Iris'i yükler ve <code>np.bincount</code> ile sınıf dengesini yazdırır -- eğitimden önce her zaman sınıf dengesini kontrol edin. 2) <code>stratify=y</code> ile 70/30 olarak böler, böylece her sınıf orantılı şekilde temsil edilir. 3) <code>StandardScaler</code> ile ölçekler, eğitimde <code>fit_transform</code> ve testte sadece <code>transform</code> çağırır -- bu ön işlemenin TEMEL kuralıdır: test setinizin eğitim dönüşümünü asla bilgilendirmesine izin vermeyin, aksi takdirde değerlendirmeyi kontamine edersiniz. 4) Optimizatörün en fazla 500 iterasyonu ile çok terimli logistic regression eğitir. 5) <code>predict</code> sert sınıf etiketleri döndürür, <code>predict_proba</code> her satırı 1'e toplanan (n_test, 3) bir matris döndürür -- modelin sınıf başına güveni. 6) <code>classification_report</code> her sınıf için precision, recall, F1 ve support yazdırır -- sklearn'deki en kullanışlı tek satır işlemlerinden biridir. 7) <code>clf.coef_</code>'u inceler: şekil (3, 4), her sınıf için bir satırla her özelliğe ait ağırlıklar. Büyük pozitif ağırlık = o sınıf için güçlü gösterge.</p>

<div id="plot-l1-iris-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin özü:</strong> 150 iris çiçeği en ayırt edici iki özelliklerine (taç yaprağı uzunluğu ve genişliği) projekte edilmiş, türlere göre renklendirilmiş. Setosa diğer ikisinden doğrusal olarak ayrılabilir -- her iris sınıflandırıcısının üzerinde %100 vurmasının nedeni budur. Versicolor ve virginica sınır boyunca biraz örtüşür ki bu, modelin ara sıra hata yaptığı ve test doğruluğunun 1.00 yerine 0.97 olmasının kaynağı olan yerdir. Bu, yeni bir veri setine başladığınızda her zaman yapmanız gereken türde bir grafiktir: kolay kazançlar nerede ve hatalar nerede yaşayacak?</div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">Neden fit ÖNCESİ ölçekleme ve neden sadece eğitim verisinde? Logistic regression'ın optimizatörü özellikler benzer ölçeklerde olduğunda çok daha hızlı yakınsar -- ham iris verisi ile (bir özellik cm'de, aralıklar farklı) 1000 iterasyon gerekebilir; ölçeklenmiş hâlinde 50. "Sadece eğitimde fit" kuralı <em>gerçeklik</em> ile ilgilidir: üretimde scaler'ınızı oluştururken test verisine erişiminiz yoktur. Eğer eğitim+test ortalama/std ile ölçeklerseniz, gelecek bilgisini kullanmış olursunuz ve test doğruluğunuz iyimser olur. Dönüşümleri her zaman yalnızca eğitim setinde eğitin.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Yeni Başlayanlar İçin Yaygın Tuzaklar</h2>

<p class="l-text">ML'deki en tutarlı API ile bile, bir avuç tuzak her başlayanı yakalar. İşte düzeltmeleriyle birlikte en önemlileri.</p>

<div class="calc-step"><strong>Tuzak 1: random_state'i unutmak.</strong> <code>train_test_split</code> varsayılan olarak karıştırır, dolayısıyla <code>random_state=42</code> olmadan doğruluğunuz her çalıştırmada değişir. Yeniden üretilebilirlik için geliştirme sırasında daima seed'i sabitleyin.</div>

<div class="calc-step"><strong>Tuzak 2: Test verisinde fit çağırmak.</strong> <code>scaler.fit(X_test)</code> veya daha kötüsü, <code>fit(X_train.append(X_test))</code> bilgi sızdırır. Kural: eğitimde <code>fit_transform</code>, testte <code>transform</code>. Daima.</div>

<div class="calc-step"><strong>Tuzak 3: predict ve predict_proba'yı karıştırmak.</strong> <code>predict</code> sert etiketler (tam sayılar) döner; <code>predict_proba</code> olasılık matrisleri (n_samples, n_classes) döner. ROC eğrileri ve eşik ayarlama için olasılıklara ihtiyacınız vardır.</div>

<div class="calc-step"><strong>Tuzak 4: Sınıf dengesizliğini görmezden gelmek.</strong> Örneklerinizin %95'i negatifse, her şey için "negatif" tahmin ederek 0.95 doğruluk elde edilir. Bölmelerde <code>stratify=y</code> kullanın ve sadece doğruluğu değil precision/recall/F1'i takip edin.</div>

<div class="calc-step"><strong>Tuzak 5: Eğitilmiş bir estimator'ü yeniden eğitmeden tekrar kullanmak.</strong> Yeni veride <code>fit</code> çağırdığınızda öğrenilen tüm nitelikler üzerine yazılır. İki eğitilmiş modeli karşılaştırmak istiyorsanız iki ayrı nesne oluşturun.</div>

<div class="calc-step"><strong>Tuzak 6: Hiperparametreler vs öğrenilen parametreler.</strong> <code>n_estimators=100</code> sizin ayarladığınız bir hiperparametredir; <code>feature_importances_</code> öğrenilmiştir. Karıştırmak gizemli "no attribute" hatalarına yol açar. Alt çizgi = öğrenilmiş; alt çizgi yok = yapılandırma.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: Yeniden üretilebilir NLP deneyi</div><div class="example-body">Bir hakem rapor ettiğiniz 0.873 F1'i yeniden üretmenizi istiyor. <code>random_state</code>'i unuttuysanız sonraki çalıştırma 0.864 verir ve güvenilirliğiniz biter. Yüksek lisans tezi seviyesinde iş için temel kural: her <code>train_test_split</code>, her <code>KFold</code>, her <code>RandomForestClassifier</code> <code>random_state=42</code> alır (veya herhangi bir sabit değer). Daha iyisi: global bir <code>SEED = 42</code> yapılandırması kullanın ve her yere geçirin.</div></div>

<div class="think-box"><div class="think-label">ÖZET ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> sklearn'in değeri birleşik API'dir: <code>fit / predict / transform / score</code>.<br><strong>2.</strong> Estimator'lar öğrenilenleri alt çizgi ile biten niteliklerde saklar (<code>coef_</code>, <code>cluster_centers_</code>).<br><strong>3.</strong> Eğitim verisinde <code>fit_transform</code>, testte <code>transform</code> -- asla tersi değil.<br><strong>4.</strong> Sınıflandırıcıların <code>predict_proba</code>'sı vardır; regresörlerin yoktur.<br><strong>5.</strong> Yerleşik veri setleri (<code>load_iris</code>, <code>fetch_20newsgroups</code>) ve sentetik üreticiler (<code>make_classification</code>, <code>make_blobs</code>) sizin oyun alanınızdır.<br><strong>6.</strong> Daima <code>random_state</code> ayarlayın, sınıflandırma bölmeleri için daima <code>stratify=y</code> kullanın, daima sınıf dengesini kontrol edin.<br><strong>7.</strong> Sonraki dersler gerisini doldurur: ön işleme, modeller, doğrulama, metrikler, boyut indirgeme. Desen aynı kalır.</div></div>
</div>
<script>setTimeout(function(){
  if (typeof Plotly === 'undefined') return;
  var T = {
    bg: 'rgba(0,0,0,0)',
    text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#ebe6dc',
    accent: getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c8a96e',
    grid: 'rgba(255,255,255,0.06)',
    zero: 'rgba(255,255,255,0.15)'
  };
  var common = {paper_bgcolor:T.bg, plot_bgcolor:T.bg, font:{color:T.text}, margin:{t:50,r:30,b:50,l:60}};
  var palette = [T.accent, '#4ecdc4', '#f87171', '#a78bfa'];

  function rng(seed){return function(){seed=(seed*9301+49297)%233280;return seed/233280;};}

  function makeBlobs(n,centers,std,seed){
    var rand = rng(seed);
    var xs=[],ys=[],labels=[];
    var per = Math.floor(n/centers.length);
    for (var c=0;c<centers.length;c++){
      for (var i=0;i<per;i++){
        var u = rand(), v=rand();
        var z0 = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
        var z1 = Math.sqrt(-2*Math.log(u))*Math.sin(2*Math.PI*v);
        xs.push(centers[c][0]+std*z0);
        ys.push(centers[c][1]+std*z1);
        labels.push(c);
      }
    }
    return {xs:xs,ys:ys,labels:labels};
  }

  // 1. blobs
  var elB = document.getElementById('plot-l1-blobs-en');
  if (elB){
    var B = makeBlobs(300,[[0,0],[5,5],[5,0],[0,5]],0.7,7);
    var traces=[];
    for (var c=0;c<4;c++){
      var xs=[],ys=[];
      for (var i=0;i<B.labels.length;i++){if(B.labels[i]===c){xs.push(B.xs[i]);ys.push(B.ys[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'Cluster '+c,marker:{color:palette[c],size:8,opacity:0.75,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'make_blobs: 4 synthetic clusters in 2D',font:{color:T.text,size:14}},xaxis:{title:'Feature 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Feature 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l1-blobs-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // 2. iris petal length vs petal width (real values)
  var elI = document.getElementById('plot-l1-iris-en');
  if (elI){
    var pl = [1.4,1.4,1.3,1.5,1.4,1.7,1.4,1.5,1.4,1.5,1.5,1.6,1.4,1.1,1.2,1.5,1.3,1.4,1.7,1.5,1.7,1.5,1.0,1.7,1.9,1.6,1.6,1.5,1.4,1.6,1.6,1.5,1.5,1.4,1.5,1.2,1.3,1.5,1.3,1.5,1.3,1.3,1.3,1.6,1.9,1.4,1.6,1.4,1.5,1.4,4.7,4.5,4.9,4.0,4.6,4.5,4.7,3.3,4.6,3.9,3.5,4.2,4.0,4.7,3.6,4.4,4.5,4.1,4.5,3.9,4.8,4.0,4.9,4.7,4.3,4.4,4.8,5.0,4.5,3.5,3.8,3.7,3.9,5.1,4.5,4.5,4.7,4.4,4.1,4.0,4.4,4.6,4.0,3.3,4.2,4.2,4.2,4.3,3.0,4.1,6.0,5.1,5.9,5.6,5.8,6.6,4.5,6.3,5.8,6.1,5.1,5.3,5.5,5.0,5.1,5.3,5.5,6.7,6.9,5.0,5.7,4.9,6.7,4.9,5.7,6.0,4.8,4.9,5.6,5.8,6.1,6.4,5.6,5.1,5.6,6.1,5.6,5.5,4.8,5.4,5.6,5.1,5.1,5.9,5.7,5.2,5.0,5.2,5.4,5.1];
    var pw = [0.2,0.2,0.2,0.2,0.2,0.4,0.3,0.2,0.2,0.1,0.2,0.2,0.1,0.1,0.2,0.4,0.4,0.3,0.3,0.3,0.2,0.4,0.2,0.5,0.2,0.2,0.4,0.2,0.2,0.2,0.2,0.4,0.1,0.2,0.2,0.2,0.2,0.1,0.2,0.2,0.3,0.3,0.2,0.6,0.4,0.3,0.2,0.2,0.2,0.2,1.4,1.5,1.5,1.3,1.5,1.3,1.6,1.0,1.3,1.4,1.0,1.5,1.0,1.4,1.3,1.4,1.5,1.0,1.5,1.1,1.8,1.3,1.5,1.2,1.3,1.4,1.4,1.7,1.5,1.0,1.1,1.0,1.2,1.6,1.5,1.6,1.5,1.3,1.3,1.3,1.2,1.4,1.2,1.0,1.3,1.2,1.3,1.3,1.1,1.3,2.5,1.9,2.1,1.8,2.2,2.1,1.7,1.8,1.8,2.5,2.0,1.9,2.1,2.0,2.4,2.3,1.8,2.2,2.3,1.5,2.3,2.0,2.0,1.8,2.1,1.8,1.8,1.8,2.1,1.6,1.9,2.0,2.2,1.5,1.4,2.3,2.4,1.8,1.8,2.1,2.4,2.3,1.9,2.3,2.5,2.3,1.9,2.0,2.3,1.8];
    var names = ['setosa','versicolor','virginica'];
    var traces=[];
    for (var c=0;c<3;c++){
      var xs=[],ys=[];
      for (var i=0;i<150;i++){if(Math.floor(i/50)===c){xs.push(pl[i]);ys.push(pw[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:names[c],marker:{color:palette[c],size:9,opacity:0.8,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'Iris flowers in petal-length vs petal-width plane',font:{color:T.text,size:14}},xaxis:{title:'Petal length (cm)',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Petal width (cm)',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l1-iris-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elBtr = document.getElementById('plot-l1-blobs-tr');
  if (elBtr){
    var B = makeBlobs(300,[[0,0],[5,5],[5,0],[0,5]],0.7,7);
    var traces=[];
    for (var c=0;c<4;c++){
      var xs=[],ys=[];
      for (var i=0;i<B.labels.length;i++){if(B.labels[i]===c){xs.push(B.xs[i]);ys.push(B.ys[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:'Kume '+c,marker:{color:palette[c],size:8,opacity:0.75,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'make_blobs: 2B uzayda 4 sentetik kume',font:{color:T.text,size:14}},xaxis:{title:'Ozellik 1',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Ozellik 2',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l1-blobs-tr',traces,layout,{responsive:true,displayModeBar:false});
  }

  var elItr = document.getElementById('plot-l1-iris-tr');
  if (elItr){
    var pl = [1.4,1.4,1.3,1.5,1.4,1.7,1.4,1.5,1.4,1.5,1.5,1.6,1.4,1.1,1.2,1.5,1.3,1.4,1.7,1.5,1.7,1.5,1.0,1.7,1.9,1.6,1.6,1.5,1.4,1.6,1.6,1.5,1.5,1.4,1.5,1.2,1.3,1.5,1.3,1.5,1.3,1.3,1.3,1.6,1.9,1.4,1.6,1.4,1.5,1.4,4.7,4.5,4.9,4.0,4.6,4.5,4.7,3.3,4.6,3.9,3.5,4.2,4.0,4.7,3.6,4.4,4.5,4.1,4.5,3.9,4.8,4.0,4.9,4.7,4.3,4.4,4.8,5.0,4.5,3.5,3.8,3.7,3.9,5.1,4.5,4.5,4.7,4.4,4.1,4.0,4.4,4.6,4.0,3.3,4.2,4.2,4.2,4.3,3.0,4.1,6.0,5.1,5.9,5.6,5.8,6.6,4.5,6.3,5.8,6.1,5.1,5.3,5.5,5.0,5.1,5.3,5.5,6.7,6.9,5.0,5.7,4.9,6.7,4.9,5.7,6.0,4.8,4.9,5.6,5.8,6.1,6.4,5.6,5.1,5.6,6.1,5.6,5.5,4.8,5.4,5.6,5.1,5.1,5.9,5.7,5.2,5.0,5.2,5.4,5.1];
    var pw = [0.2,0.2,0.2,0.2,0.2,0.4,0.3,0.2,0.2,0.1,0.2,0.2,0.1,0.1,0.2,0.4,0.4,0.3,0.3,0.3,0.2,0.4,0.2,0.5,0.2,0.2,0.4,0.2,0.2,0.2,0.2,0.4,0.1,0.2,0.2,0.2,0.2,0.1,0.2,0.2,0.3,0.3,0.2,0.6,0.4,0.3,0.2,0.2,0.2,0.2,1.4,1.5,1.5,1.3,1.5,1.3,1.6,1.0,1.3,1.4,1.0,1.5,1.0,1.4,1.3,1.4,1.5,1.0,1.5,1.1,1.8,1.3,1.5,1.2,1.3,1.4,1.4,1.7,1.5,1.0,1.1,1.0,1.2,1.6,1.5,1.6,1.5,1.3,1.3,1.3,1.2,1.4,1.2,1.0,1.3,1.2,1.3,1.3,1.1,1.3,2.5,1.9,2.1,1.8,2.2,2.1,1.7,1.8,1.8,2.5,2.0,1.9,2.1,2.0,2.4,2.3,1.8,2.2,2.3,1.5,2.3,2.0,2.0,1.8,2.1,1.8,1.8,1.8,2.1,1.6,1.9,2.0,2.2,1.5,1.4,2.3,2.4,1.8,1.8,2.1,2.4,2.3,1.9,2.3,2.5,2.3,1.9,2.0,2.3,1.8];
    var names = ['setosa','versicolor','virginica'];
    var traces=[];
    for (var c=0;c<3;c++){
      var xs=[],ys=[];
      for (var i=0;i<150;i++){if(Math.floor(i/50)===c){xs.push(pl[i]);ys.push(pw[i]);}}
      traces.push({x:xs,y:ys,mode:'markers',type:'scatter',name:names[c],marker:{color:palette[c],size:9,opacity:0.8,line:{color:'rgba(255,255,255,0.2)',width:1}}});
    }
    var layout = Object.assign({}, common, {title:{text:'Iris çiçekleri: taç-yaprak uzunluğu vs genişliği',font:{color:T.text,size:14}},xaxis:{title:'Tac-yaprak uzunlugu (cm)',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'Tac-yaprak genisligi (cm)',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l1-iris-tr',traces,layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
