window.SKLEARN_L2 = {

en: `<p class="l-text"><strong>Real-world data is never ML-ready.</strong> Numeric columns range from 0.001 to 1,000,000; categorical columns contain "Male", "F", "female", "M.", "  Male"; some rows have NaN; some columns are dates that should be cyclical features. Before any model can learn, you must scale, encode, impute, and combine these into a clean feature matrix. This is preprocessing, and it is where 70% of practical ML time is spent.</p>

<p class="l-text">In this lesson we cover the four core preprocessing tools (<code>StandardScaler</code>, <code>MinMaxScaler</code>, <code>RobustScaler</code>, <code>Normalizer</code>), the three categorical encoders (<code>OneHotEncoder</code>, <code>OrdinalEncoder</code>, <code>LabelEncoder</code>), simple imputation, and the master concept that ties them together: <strong>Pipelines and ColumnTransformers</strong>. By the end you will be able to take a raw mixed-type DataFrame and turn it into a leak-free, reusable preprocessing graph.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Scale numeric features with StandardScaler, MinMaxScaler, and RobustScaler</li><li>Encode categorical variables using OneHotEncoder and OrdinalEncoder</li><li>Impute missing values with SimpleImputer and KNNImputer</li><li>Combine preprocessors per column with ColumnTransformer</li><li>Avoid data leakage by fitting transformers only on training data</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Why Scale? The Geometry of Distance and Gradient</h2>

<p class="l-text">Many ML algorithms are sensitive to feature scale. k-NN computes Euclidean distances; if one feature is in the range 0-1 and another is 0-1000, the second feature dominates every distance and the first is effectively ignored. Logistic regression's gradient descent oscillates wildly when feature scales differ by orders of magnitude. PCA picks directions of maximum variance, so a feature with large variance (because of its units, not its information content) hijacks the principal components.</p>

<div class="calc-highlight"><strong>Rule of thumb:</strong> if your model uses distances (kNN, KMeans, SVM, neural nets), L2-regularized linear models, or PCA -- you must scale. If your model is tree-based (decision trees, random forests, gradient boosting) -- you do not need to scale, because trees only ever ask "is this feature greater than threshold X?" and the threshold scales with the feature.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">StandardScaler</div><div class="card-body">Z-score: subtract mean, divide by std. Output mean 0, std 1. Works for any roughly normal feature.</div></div>
<div class="calc-card"><div class="card-title">MinMaxScaler</div><div class="card-body">Squashes into [0, 1]. Use when you need bounded features (e.g. for neural network inputs with sigmoid).</div></div>
<div class="calc-card"><div class="card-title">RobustScaler</div><div class="card-body">Uses median and IQR instead of mean and std. Robust to outliers. Use for income, prices, count data.</div></div>
<div class="calc-card"><div class="card-title">MaxAbsScaler</div><div class="card-body">Divides by max absolute value, output in [-1, 1]. Preserves sign and sparsity. Good for sparse text features.</div></div>
<div class="calc-card"><div class="card-title">Normalizer</div><div class="card-body">Per-row L1 or L2 normalization. Each row becomes a unit vector. Use for cosine similarity in NLP.</div></div>
<div class="calc-card"><div class="card-title">PowerTransformer</div><div class="card-body">Box-Cox or Yeo-Johnson -- makes skewed features more Gaussian. Use when normality assumption matters.</div></div>
</div>

<div class="katex-block">$$z = \\frac{x - \\mu}{\\sigma}, \\quad x_{\\text{minmax}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}, \\quad x_{\\text{robust}} = \\frac{x - \\text{median}(x)}{\\text{IQR}(x)}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\mu$</div><div class="card-body">Column mean. Computed during <code>fit</code> on training data, stored in <code>scaler.mean_</code>.</div></div>
<div class="calc-card"><div class="card-title">$\\sigma$</div><div class="card-body">Column standard deviation. Stored in <code>scaler.scale_</code>. Must be &gt; 0.</div></div>
<div class="calc-card"><div class="card-title">$x_{\\min}, x_{\\max}$</div><div class="card-body">Per-column min and max from training data. Stored in <code>data_min_</code> and <code>data_max_</code>.</div></div>
<div class="calc-card"><div class="card-title">IQR</div><div class="card-body">Interquartile range Q3 - Q1. The middle 50% of data. Resistant to extreme values.</div></div>
<div class="calc-card"><div class="card-title">median</div><div class="card-body">50th percentile. The "robust" central tendency -- not pulled by outliers like mean.</div></div>
<div class="calc-card"><div class="card-title">$z$</div><div class="card-body">The standardized output. Has mean 0 and std 1 by construction (on the training set).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> (StandardScaler, MinMaxScaler,
                                   RobustScaler, MaxAbsScaler, Normalizer)

X = np.<span class="fn">array</span>([
    [  <span class="num">1.0</span>,   <span class="num">200.0</span>,   <span class="num">0.01</span>],
    [  <span class="num">2.0</span>,   <span class="num">400.0</span>,   <span class="num">0.05</span>],
    [  <span class="num">3.0</span>,   <span class="num">600.0</span>,   <span class="num">0.02</span>],
    [  <span class="num">4.0</span>,   <span class="num">800.0</span>,   <span class="num">0.04</span>],
    [<span class="num">100.0</span>, <span class="num">1000.0</span>, <span class="num">100.00</span>],   <span class="cm"># an outlier in cols 0 and 2</span>
])

<span class="cm"># StandardScaler -- mean 0, std 1</span>
ss = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
<span class="fn">print</span>(<span class="str">"StandardScaler mean:"</span>, ss.<span class="fn">mean</span>(axis=<span class="num">0</span>).<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"StandardScaler std :"</span>, ss.<span class="fn">std</span>(axis=<span class="num">0</span>).<span class="fn">round</span>(<span class="num">3</span>))

<span class="cm"># MinMaxScaler -- range [0, 1]</span>
mm = <span class="fn">MinMaxScaler</span>().<span class="fn">fit_transform</span>(X)
<span class="fn">print</span>(<span class="str">"MinMax min/max:"</span>, mm.<span class="fn">min</span>(axis=<span class="num">0</span>), mm.<span class="fn">max</span>(axis=<span class="num">0</span>))

<span class="cm"># RobustScaler -- not affected by the outlier</span>
rs = <span class="fn">RobustScaler</span>().<span class="fn">fit_transform</span>(X)
<span class="fn">print</span>(<span class="str">"Robust median:"</span>, np.<span class="fn">median</span>(rs, axis=<span class="num">0</span>))

<span class="cm"># Compare on the outlier row</span>
<span class="fn">print</span>(<span class="str">"Original   :"</span>, X[-<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">"Standard   :"</span>, ss[-<span class="num">1</span>].<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"MinMax     :"</span>, mm[-<span class="num">1</span>].<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Robust     :"</span>, rs[-<span class="num">1</span>].<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a 5x3 toy matrix where the last row is a clear outlier in two columns. 2) <code>StandardScaler</code> centers and rescales by std -- but the outlier inflates std, so the other rows are squashed near zero. 3) <code>MinMaxScaler</code> maps to [0, 1] but is fragile: a single huge value pushes everyone else to 0.001. 4) <code>RobustScaler</code> uses median and IQR; the outlier's effect on these statistics is minimal so the other rows keep their relative spacing. 5) Comparing the last row across scalers: standard=very large, minmax=1.0 (clipped to top), robust=large but other rows stay reasonable. RobustScaler is your friend whenever your data has heavy tails.</p>

<div id="plot-l2-scalers-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The same skewed feature distribution after StandardScaler (orange) vs MinMaxScaler (teal) vs RobustScaler (red). StandardScaler keeps the shape but recenters around zero. MinMaxScaler squeezes everything into [0,1] -- if there is an outlier it dominates. RobustScaler ignores the tails and gives a "typical" range close to [-1, 1] for the bulk of the data while extreme values stay extreme. This visual is the single best way to pick a scaler for a new feature: plot the distribution before and after, and pick the transformation that looks most useful for your model.</div>

<div class="l-warn"><strong>Critical:</strong> always <code>fit_transform</code> on training data and only <code>transform</code> on test/validation data. If you fit a scaler on the entire dataset, the test set's statistics leak into the training transformation -- your reported test scores become optimistic and will not survive deployment.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Encoding Categorical Features</h2>

<p class="l-text">Models speak numbers, not strings. Categorical columns ("Male"/"Female", "USA"/"Turkey"/"Germany", "small"/"medium"/"large") need to be converted into numeric form. Sklearn gives you three main tools, each appropriate for a different situation.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">OneHotEncoder</div><div class="compare-item">Each category becomes its own 0/1 column</div><div class="compare-item">Output: sparse matrix by default</div><div class="compare-item">Use for nominal (unordered) categories</div><div class="compare-item">Safe for linear and tree models</div><div class="compare-item">Adds k-1 (or k) columns; can explode dimensionality</div><div class="compare-item">Handles unseen categories with <code>handle_unknown='ignore'</code></div></div>
<div class="compare-col"><div class="compare-title">OrdinalEncoder</div><div class="compare-item">Each category becomes a single integer</div><div class="compare-item">Output: dense 2D array</div><div class="compare-item">Use for ordinal (ordered) categories: small &lt; medium &lt; large</div><div class="compare-item">Tree models love it, linear models do NOT (interprets order as magnitude)</div><div class="compare-item">No dimensionality explosion</div><div class="compare-item">Pass <code>categories=[order]</code> to enforce ordering</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> OneHotEncoder, OrdinalEncoder, LabelEncoder

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">"country"</span>: [<span class="str">"USA"</span>, <span class="str">"TR"</span>, <span class="str">"DE"</span>, <span class="str">"USA"</span>, <span class="str">"TR"</span>, <span class="str">"FR"</span>],
    <span class="str">"size"</span>:    [<span class="str">"S"</span>,   <span class="str">"M"</span>,  <span class="str">"L"</span>,  <span class="str">"M"</span>,   <span class="str">"L"</span>,  <span class="str">"S"</span>],
    <span class="str">"gender"</span>:  [<span class="str">"M"</span>,   <span class="str">"F"</span>,  <span class="str">"F"</span>,  <span class="str">"M"</span>,   <span class="str">"M"</span>,  <span class="str">"F"</span>],
})

<span class="cm"># 1) OneHotEncoder for nominal columns (country, gender)</span>
ohe = <span class="fn">OneHotEncoder</span>(sparse_output=<span class="kw">False</span>, handle_unknown=<span class="str">"ignore"</span>)
country_ohe = ohe.<span class="fn">fit_transform</span>(df[[<span class="str">"country"</span>]])
<span class="fn">print</span>(<span class="str">"OneHot columns:"</span>, ohe.<span class="fn">get_feature_names_out</span>([<span class="str">"country"</span>]))
<span class="fn">print</span>(country_ohe)
<span class="cm"># country_DE  country_FR  country_TR  country_USA</span>
<span class="cm"># [[0., 0., 0., 1.],   <- USA</span>
<span class="cm">#  [0., 0., 1., 0.],   <- TR</span>
<span class="cm">#  [1., 0., 0., 0.],   <- DE</span>
<span class="cm">#  ...]</span>

<span class="cm"># Drop one to avoid the dummy variable trap (for linear models)</span>
ohe_drop = <span class="fn">OneHotEncoder</span>(sparse_output=<span class="kw">False</span>, drop=<span class="str">"first"</span>).<span class="fn">fit</span>(df[[<span class="str">"country"</span>]])

<span class="cm"># 2) OrdinalEncoder with explicit ordering for "size"</span>
oe = <span class="fn">OrdinalEncoder</span>(categories=[[<span class="str">"S"</span>, <span class="str">"M"</span>, <span class="str">"L"</span>]])
df[<span class="str">"size_ord"</span>] = oe.<span class="fn">fit_transform</span>(df[[<span class="str">"size"</span>]])
<span class="fn">print</span>(df[[<span class="str">"size"</span>, <span class="str">"size_ord"</span>]])
<span class="cm"># S->0, M->1, L->2 -- preserves the natural order</span>

<span class="cm"># 3) LabelEncoder ONLY for the target y, never X</span>
le = <span class="fn">LabelEncoder</span>()
y_raw = [<span class="str">"pos"</span>, <span class="str">"neg"</span>, <span class="str">"pos"</span>, <span class="str">"neu"</span>, <span class="str">"neg"</span>]
y_enc = le.<span class="fn">fit_transform</span>(y_raw)
<span class="fn">print</span>(le.classes_)   <span class="cm"># ['neg' 'neu' 'pos']</span>
<span class="fn">print</span>(y_enc)         <span class="cm"># [2 0 2 1 0]</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a small DataFrame with three categorical columns -- country (nominal), size (ordinal), gender (binary). 2) <code>OneHotEncoder</code> with <code>sparse_output=False</code> returns a dense 2D array; <code>handle_unknown="ignore"</code> lets you call <code>transform</code> on test rows containing categories that were not in training (it produces all zeros for them). 3) <code>get_feature_names_out</code> tells you exactly which output column corresponds to which category -- essential for inspecting model coefficients. 4) <code>drop="first"</code> drops one category per feature; this avoids the dummy-variable trap (perfect collinearity) for linear models, but tree models do not need it. 5) <code>OrdinalEncoder</code> with <code>categories=[["S", "M", "L"]]</code> forces the order S=0 &lt; M=1 &lt; L=2; without this argument it would alphabetize ("L"=0, "M"=1, "S"=2), which is wrong for size. 6) <code>LabelEncoder</code> is only for the target variable y -- using it on X feature columns is a beginner mistake because it implies the labels have ordinal relationships that they usually do not.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP review classification</div><div class="example-body">Suppose you are predicting review sentiment with features <code>{rating: 1-5, country: USA/TR/DE/..., review_text: ...}</code>. Rating is ordinal (5 stars &gt; 4 stars &gt; ...) -- use <code>OrdinalEncoder</code> or pass it as raw integer. Country is nominal -- use <code>OneHotEncoder</code> (or target encoding for high-cardinality). Review text -- use <code>TfidfVectorizer</code>. Each column type gets its own preprocessor; <code>ColumnTransformer</code> in section 5 lets you compose them.</div></div>

<div class="l-warn"><strong>High-cardinality trap:</strong> if your column has 50,000 unique user_ids, OneHotEncoder produces 50,000 columns -- this kills memory and most models. Solutions: target encoding, frequency encoding, or hashing trick (<code>HashingEncoder</code> from category_encoders). For thesis-grade work, just keep cardinality &lt; ~50 per column or use embeddings.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Handling Missing Values: SimpleImputer</h2>

<p class="l-text">Real datasets have missing values. Some columns are sparsely filled (only 30% of rows have a "preferred_language"); some are accidentally missing (sensor failure for one minute); some are missing on purpose (NaN means "not applicable"). Most sklearn estimators throw an error if X contains NaN -- you must impute first.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer, KNNImputer

X = pd.<span class="fn">DataFrame</span>({
    <span class="str">"age"</span>:     [<span class="num">25</span>, <span class="num">30</span>, np.nan, <span class="num">45</span>, np.nan, <span class="num">60</span>],
    <span class="str">"income"</span>:  [<span class="num">50000</span>, np.nan, <span class="num">70000</span>, <span class="num">90000</span>, <span class="num">80000</span>, np.nan],
    <span class="str">"country"</span>: [<span class="str">"USA"</span>, <span class="str">"TR"</span>, np.nan, <span class="str">"TR"</span>, <span class="str">"USA"</span>, <span class="str">"DE"</span>],
})

<span class="cm"># Numeric: replace NaN with column mean (or median, more robust)</span>
num_imp = <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)
X[[<span class="str">"age"</span>, <span class="str">"income"</span>]] = num_imp.<span class="fn">fit_transform</span>(X[[<span class="str">"age"</span>, <span class="str">"income"</span>]])

<span class="cm"># Categorical: replace NaN with most frequent category, or a constant</span>
cat_imp = <span class="fn">SimpleImputer</span>(strategy=<span class="str">"constant"</span>, fill_value=<span class="str">"MISSING"</span>)
X[[<span class="str">"country"</span>]] = cat_imp.<span class="fn">fit_transform</span>(X[[<span class="str">"country"</span>]])

<span class="fn">print</span>(X)
<span class="cm"># age   income  country</span>
<span class="cm"># 25.0  50000.0  USA</span>
<span class="cm"># 30.0  75000.0  TR</span>
<span class="cm"># 37.5  70000.0  MISSING</span>
<span class="cm"># 45.0  90000.0  TR</span>
<span class="cm"># 37.5  80000.0  USA</span>
<span class="cm"># 60.0  75000.0  DE</span>

<span class="cm"># KNN imputer: fill missing values using the k nearest rows</span>
<span class="cm"># (works only on numeric data, expensive but more accurate)</span>
knn_imp = <span class="fn">KNNImputer</span>(n_neighbors=<span class="num">2</span>)
X_filled = knn_imp.<span class="fn">fit_transform</span>(X[[<span class="str">"age"</span>, <span class="str">"income"</span>]])</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a tiny DataFrame with intentional NaN in three columns. 2) <code>SimpleImputer(strategy="median")</code> learns the median per column on fit and replaces NaN with it on transform; median is preferred over mean because it is robust to outliers. Other strategies: <code>"mean"</code>, <code>"most_frequent"</code> (mode), <code>"constant"</code>. 3) For categorical columns, you cannot use median -- use <code>"most_frequent"</code> or <code>"constant"</code> with a sentinel value like "MISSING"; this lets the model learn that "missingness itself" is a signal. 4) <code>KNNImputer</code> is more sophisticated: for each missing value, it finds the k nearest rows (using the non-missing columns) and averages their values for the missing column. It is closer to imputation done right but slower and limited to numeric data.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">strategy="mean"</div><div class="card-body">Default for numeric. Fast but pulled by outliers.</div></div>
<div class="calc-card"><div class="card-title">strategy="median"</div><div class="card-body">Robust to outliers. Default choice for skewed numeric features.</div></div>
<div class="calc-card"><div class="card-title">strategy="most_frequent"</div><div class="card-body">Mode. Required for categorical data. Works for all dtypes.</div></div>
<div class="calc-card"><div class="card-title">strategy="constant"</div><div class="card-body">Fill with a fixed value (<code>fill_value=</code>). Useful sentinel for "missing" as a feature.</div></div>
<div class="calc-card"><div class="card-title">add_indicator=True</div><div class="card-body">Adds a 0/1 mask column showing which rows were imputed -- often a useful feature.</div></div>
<div class="calc-card"><div class="card-title">KNNImputer</div><div class="card-body">Smart but slow. Use only on small/medium numeric datasets when accuracy of imputation matters.</div></div>
</div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">When NaN means something. In a survey, "income" might be NaN because the respondent refused to answer. Refusing to answer correlates with high income (privacy). If you impute with median, you erase that signal entirely. With <code>add_indicator=True</code>, you keep both: the median-filled value AND a "was_missing" 0/1 column. Often the 0/1 column ends up being a stronger predictor than the original feature. Always think about <em>why</em> a value is missing before choosing a strategy.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pipelines: Chaining Transformations</h2>

<p class="l-text">Manually scaling, encoding, and imputing leaves you with N intermediate variables (<code>X_train_scaled</code>, <code>X_test_scaled</code>, <code>X_train_imputed</code>, ...) and a hundred ways to leak data. The Pipeline object solves this in one line: it holds a sequence of transformers ending in an estimator, and exposes the same <code>fit/predict/score</code> interface as a single model.</p>

<div class="calc-highlight"><strong>The single most important sklearn pattern:</strong> wrap every preprocessing + model combination in a <code>Pipeline</code>. The pipeline guarantees that during cross-validation each fold gets its own freshly-fit scaler/imputer, completely eliminating the leakage trap.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, cross_val_score
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline, make_pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>, stratify=y
)

<span class="cm"># Build a pipeline by name -- explicit, recommended</span>
pipe = <span class="fn">Pipeline</span>(steps=[
    (<span class="str">"imputer"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)),
    (<span class="str">"scaler"</span>,  <span class="fn">StandardScaler</span>()),
    (<span class="str">"clf"</span>,     <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),
])

<span class="cm"># OR: shortcut, names auto-generated</span>
pipe2 = <span class="fn">make_pipeline</span>(<span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>),
                      <span class="fn">StandardScaler</span>(),
                      <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>))

<span class="cm"># Fit and score the entire pipeline</span>
pipe.<span class="fn">fit</span>(X_train, y_train)
<span class="fn">print</span>(f<span class="str">"Test acc: {pipe.score(X_test, y_test):.3f}"</span>)

<span class="cm"># Cross-validation -- scaler is RE-FIT inside each fold, no leakage</span>
scores = <span class="fn">cross_val_score</span>(pipe, X_train, y_train, cv=<span class="num">5</span>, scoring=<span class="str">"accuracy"</span>)
<span class="fn">print</span>(f<span class="str">"CV accuracy: {scores.mean():.3f} +/- {scores.std():.3f}"</span>)

<span class="cm"># Access individual steps by name</span>
<span class="fn">print</span>(pipe.named_steps[<span class="str">"clf"</span>].coef_.shape)   <span class="cm"># (1, 30)</span>

<span class="cm"># Tune hyperparameters across the whole pipeline (note the double underscore)</span>
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV
grid = {<span class="str">"clf__C"</span>: [<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1.0</span>, <span class="num">10.0</span>]}
search = <span class="fn">GridSearchCV</span>(pipe, grid, cv=<span class="num">5</span>).<span class="fn">fit</span>(X_train, y_train)
<span class="fn">print</span>(<span class="str">"Best C:"</span>, search.best_params_)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads breast-cancer (binary classification, 30 features) and splits stratified. 2) <code>Pipeline(steps=[...])</code> creates a named sequence of (string, transformer) tuples ending in a predictor; this is the explicit form, preferred for any pipeline you intend to keep. 3) <code>make_pipeline(...)</code> auto-generates names from class names ("standardscaler", "logisticregression") -- shorter but harder to reference. 4) <code>pipe.fit(X_train, y_train)</code> calls <code>fit_transform</code> on each transformer and <code>fit</code> on the final estimator, automatically passing intermediate outputs along. <code>pipe.score</code> calls <code>transform</code> through the chain and then <code>score</code> at the end. 5) <code>cross_val_score</code> with the pipeline guarantees that for each of the 5 folds, the imputer's median and the scaler's mean/std are computed only on the 4 training folds -- the test fold stays untouched. This is the leakage-safe way to cross-validate. 6) <code>named_steps</code> lets you reach into the fitted pipeline to inspect the model. 7) <code>GridSearchCV</code> uses double-underscore parameter names: <code>clf__C</code> means "the C parameter of the step named clf".</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.fit(X, y)</div><div class="card-body">Calls fit_transform on each transformer, fit on the final estimator. Stores all learned state.</div></div>
<div class="calc-card"><div class="card-title">.predict(X)</div><div class="card-body">Calls transform on each transformer, predict on the final estimator. Single line for inference.</div></div>
<div class="calc-card"><div class="card-title">.score(X, y)</div><div class="card-body">Same as predict + scoring. Useful for quick test evaluation.</div></div>
<div class="calc-card"><div class="card-title">named_steps</div><div class="card-body">Dict-like access to internal estimators by name. <code>pipe.named_steps["clf"]</code>.</div></div>
<div class="calc-card"><div class="card-title">step__param</div><div class="card-body">Double underscore syntax for accessing nested parameters in GridSearchCV.</div></div>
<div class="calc-card"><div class="card-title">memory=</div><div class="card-body">Cache fitted transformers to disk; speeds up grid search when a step is expensive.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. ColumnTransformer: Different Steps for Different Columns</h2>

<p class="l-text">Real datasets are mixed: some columns are numeric, some are categorical, some are text. You cannot apply <code>StandardScaler</code> to a string column. <code>ColumnTransformer</code> lets you specify a different preprocessor for each subset of columns, then concatenates the outputs. Combined with Pipeline, this is the modern way to build any production-grade preprocessing.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.compose <span class="kw">import</span> ColumnTransformer, make_column_selector
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler, OneHotEncoder
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">"age"</span>:      [<span class="num">25</span>, <span class="num">30</span>, np.nan, <span class="num">45</span>, <span class="num">60</span>, <span class="num">22</span>, <span class="num">38</span>, <span class="num">51</span>],
    <span class="str">"income"</span>:   [<span class="num">50000</span>, <span class="num">60000</span>, <span class="num">70000</span>, <span class="num">90000</span>, <span class="num">80000</span>, <span class="num">30000</span>, np.nan, <span class="num">75000</span>],
    <span class="str">"country"</span>:  [<span class="str">"USA"</span>, <span class="str">"TR"</span>,  <span class="str">"DE"</span>,  <span class="str">"TR"</span>, <span class="str">"USA"</span>, <span class="str">"FR"</span>,  <span class="str">"DE"</span>,   <span class="str">"TR"</span>],
    <span class="str">"gender"</span>:   [<span class="str">"M"</span>,   <span class="str">"F"</span>,   <span class="str">"F"</span>,   <span class="str">"M"</span>,  <span class="str">"M"</span>,   <span class="str">"F"</span>,   <span class="str">"F"</span>,    <span class="str">"M"</span>],
})
y = np.<span class="fn">array</span>([<span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>])

numeric_cols = [<span class="str">"age"</span>, <span class="str">"income"</span>]
categ_cols   = [<span class="str">"country"</span>, <span class="str">"gender"</span>]

<span class="cm"># Pipelines for each branch</span>
num_pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"imp"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)),
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
])
cat_pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"imp"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"most_frequent"</span>)),
    (<span class="str">"ohe"</span>, <span class="fn">OneHotEncoder</span>(handle_unknown=<span class="str">"ignore"</span>, sparse_output=<span class="kw">False</span>)),
])

<span class="cm"># ColumnTransformer wires them up</span>
preprocess = <span class="fn">ColumnTransformer</span>(transformers=[
    (<span class="str">"num"</span>, num_pipe, numeric_cols),
    (<span class="str">"cat"</span>, cat_pipe, categ_cols),
])

<span class="cm"># Full model pipeline</span>
model = <span class="fn">Pipeline</span>([
    (<span class="str">"prep"</span>, preprocess),
    (<span class="str">"clf"</span>,  <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>)),
])

model.<span class="fn">fit</span>(df, y)
<span class="fn">print</span>(model.<span class="fn">predict</span>(df))

<span class="cm"># Inspect the transformed feature names</span>
ohe_step = model.named_steps[<span class="str">"prep"</span>].named_transformers_[<span class="str">"cat"</span>].named_steps[<span class="str">"ohe"</span>]
ohe_names = ohe_step.<span class="fn">get_feature_names_out</span>(categ_cols)
all_names = numeric_cols + <span class="fn">list</span>(ohe_names)
<span class="fn">print</span>(<span class="str">"Final feature columns:"</span>, all_names)
<span class="cm"># Final feature columns: ['age', 'income', 'country_DE', 'country_FR',</span>
<span class="cm">#                         'country_TR', 'country_USA', 'gender_F', 'gender_M']</span>

<span class="cm"># Bonus: select columns by dtype automatically</span>
preprocess_auto = <span class="fn">ColumnTransformer</span>([
    (<span class="str">"num"</span>, num_pipe, <span class="fn">make_column_selector</span>(dtype_include=np.number)),
    (<span class="str">"cat"</span>, cat_pipe, <span class="fn">make_column_selector</span>(dtype_include=<span class="ty">object</span>)),
])</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a mixed DataFrame: two numeric columns with NaN, two categorical columns. 2) Defines a numeric branch pipeline (impute median -&gt; scale) and a categorical branch (impute mode -&gt; one-hot encode). 3) <code>ColumnTransformer</code> takes a list of (name, transformer, columns) tuples and applies each transformer only to its column subset, then horizontally stacks the results. The output is a single 2D array with all transformed columns. 4) Wraps the entire preprocessor in another Pipeline together with a logistic regression -- this single object now does imputation, scaling, encoding, and classification end-to-end. 5) <code>model.named_steps["prep"].named_transformers_["cat"]</code> is the chain to get back to the OneHotEncoder, which is essential for mapping coefficients back to feature names. 6) <code>make_column_selector</code> with <code>dtype_include</code> automatically picks columns by dtype -- useful when you have dozens of columns and want to avoid hand-listing them.</p>

<div id="plot-l2-pipeline-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> A flow diagram of the full pipeline -- raw mixed DataFrame on the left flows through ColumnTransformer (which splits numeric and categorical branches), each branch runs imputation + its own transform, then the outputs are concatenated and fed to a single classifier. The whole graph is a single sklearn object. This is exactly the structure you should be building for any tabular ML problem; it eliminates the entire class of "I forgot to scale the test set the same way" bugs.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: thesis-grade reproducible pipeline</div><div class="example-body">For your master's thesis you need to compare 5 models on the same preprocessing. Build the ColumnTransformer once, then loop: <code>for clf in [LogReg(), RF(), GBM(), SVC(), MLP()]: Pipeline([("prep", preprocess), ("clf", clf)]).fit(X, y)</code>. Every model sees identical features. Save the entire pipeline with <code>joblib.dump(model, "model.pkl")</code> and you have a single deployable artifact -- no separate scaler files, no preprocessing gotchas at inference time.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. fit_transform vs transform: The Leakage Rule</h2>

<p class="l-text">This is the single most important rule in all of preprocessing. Get it wrong and your test scores are fiction.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Training data</div><div class="compare-item">Use <code>fit_transform(X_train)</code></div><div class="compare-item">Learns parameters: mean, std, mode, etc.</div><div class="compare-item">Stores them as <code>scaler.mean_</code>, etc.</div><div class="compare-item">Applies the transformation</div></div>
<div class="compare-col"><div class="compare-title">Test / validation / new data</div><div class="compare-item">Use <code>transform(X_test)</code> only</div><div class="compare-item">Reuses the parameters learned on train</div><div class="compare-item">Never fits new ones</div><div class="compare-item">Treats test as if it were unseen</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

X_train = np.<span class="fn">array</span>([[<span class="num">1.0</span>], [<span class="num">2.0</span>], [<span class="num">3.0</span>], [<span class="num">4.0</span>], [<span class="num">5.0</span>]])    <span class="cm"># mean=3, std~1.41</span>
X_test  = np.<span class="fn">array</span>([[<span class="num">10.0</span>], [<span class="num">20.0</span>]])                        <span class="cm"># values far from train</span>

<span class="cm"># WRONG -- fit on test fits a new scaler, hides the distribution shift</span>
scaler = <span class="fn">StandardScaler</span>()
X_test_wrong = scaler.<span class="fn">fit_transform</span>(X_test)   <span class="cm"># uses test mean=15, test std=5</span>
<span class="fn">print</span>(<span class="str">"Wrong:"</span>, X_test_wrong.<span class="fn">ravel</span>())          <span class="cm"># [-1.0, 1.0]</span>

<span class="cm"># RIGHT -- fit on train, only transform test</span>
scaler = <span class="fn">StandardScaler</span>()
scaler.<span class="fn">fit</span>(X_train)                            <span class="cm"># learns mean=3, std~1.41</span>
X_train_s = scaler.<span class="fn">transform</span>(X_train)
X_test_s  = scaler.<span class="fn">transform</span>(X_test)           <span class="cm"># uses TRAIN's mean and std</span>
<span class="fn">print</span>(<span class="str">"Right train:"</span>, X_train_s.<span class="fn">ravel</span>().<span class="fn">round</span>(<span class="num">2</span>))   <span class="cm"># [-1.41, ..., 1.41]</span>
<span class="fn">print</span>(<span class="str">"Right test :"</span>, X_test_s.<span class="fn">ravel</span>().<span class="fn">round</span>(<span class="num">2</span>))    <span class="cm"># [4.95, 12.02]</span>
<span class="cm"># Now test points are clearly far from training distribution -- model</span>
<span class="cm"># can complain or do calibration, the truth is preserved.</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Defines a tiny train/test split where test values are 2-4x the maximum of training -- a deliberate distribution shift. 2) The WRONG path calls <code>fit_transform</code> on test, fitting a brand-new scaler that does not know anything about train; the test points get squashed to [-1, 1] artificially, hiding the shift. 3) The RIGHT path fits the scaler ONCE on train, then calls <code>transform</code> on both -- the test values come out as 4.95 and 12.02, far outside the typical training z-score range. This is exactly what you want: the scaled feature matrix preserves the fact that test data is unusual relative to training. 4) Down-stream models can either flag this as out-of-distribution or attempt to extrapolate -- both decisions are blocked when you cheat by re-fitting on test.</p>

<div class="l-warn"><strong>The most common ML bug in beginner code:</strong> <code>scaler = StandardScaler(); X_full = scaler.fit_transform(X_full); X_train, X_test = train_test_split(X_full, ...)</code>. The scaler saw the test data when fitting; even if the order is "fit then split", the test set's statistics already polluted the transformation. Always split FIRST, then fit on train only. Pipelines + cross-validation make this automatic.</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> Scale numeric features for any distance-based or gradient-based model; trees do not need it.<br><strong>2.</strong> StandardScaler is the default; RobustScaler when there are outliers; MinMaxScaler when you need bounded output.<br><strong>3.</strong> OneHotEncoder for nominal categories; OrdinalEncoder (with explicit order) for ordered categories; LabelEncoder for the target only.<br><strong>4.</strong> Impute missing values first (median for numeric, most_frequent for categorical), and consider <code>add_indicator=True</code> when missingness itself carries signal.<br><strong>5.</strong> Pipeline chains transformers and a final estimator into one object; <code>fit/predict/score</code> apply to the whole chain.<br><strong>6.</strong> ColumnTransformer applies different preprocessors to different column subsets and stacks the results.<br><strong>7.</strong> Always <code>fit_transform</code> on training data and <code>transform</code> on test data; pipelines automate this rule and keep cross-validation honest.<br><strong>8.</strong> The Pipeline + ColumnTransformer combo is THE standard pattern for production sklearn -- learn it once and you have the chassis for any tabular ML project.</div></div>
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

  function rng(s){return function(){s=(s*9301+49297)%233280;return s/233280;};}

  function makeData(seed){
    var r = rng(seed); var arr=[];
    for (var i=0;i<200;i++){
      // log-normal-ish skewed
      var u=r(), v=r();
      var z = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      arr.push(Math.exp(0.6*z + 1.0));
    }
    arr.push(50); arr.push(60);  // outliers
    return arr;
  }

  function standardize(arr){
    var m=0; for (var i=0;i<arr.length;i++) m+=arr[i]; m/=arr.length;
    var s=0; for (var i=0;i<arr.length;i++) s+=(arr[i]-m)*(arr[i]-m); s=Math.sqrt(s/arr.length);
    return arr.map(function(x){return (x-m)/s;});
  }
  function minmax(arr){
    var mn=Math.min.apply(null,arr), mx=Math.max.apply(null,arr);
    return arr.map(function(x){return (x-mn)/(mx-mn);});
  }
  function median(arr){var s=arr.slice().sort(function(a,b){return a-b;});var n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;}
  function robust(arr){
    var s=arr.slice().sort(function(a,b){return a-b;});
    var med = median(s);
    var q1 = s[Math.floor(s.length*0.25)];
    var q3 = s[Math.floor(s.length*0.75)];
    var iqr = q3 - q1;
    return arr.map(function(x){return (x-med)/iqr;});
  }

  var elS = document.getElementById('plot-l2-scalers-en');
  if (elS){
    var d = makeData(11);
    var t1 = {x: standardize(d), type:'histogram', name:'StandardScaler', marker:{color:T.accent}, opacity:0.7, nbinsx:40, xaxis:'x', yaxis:'y'};
    var t2 = {x: minmax(d),     type:'histogram', name:'MinMaxScaler',  marker:{color:'#4ecdc4'}, opacity:0.7, nbinsx:40, xaxis:'x2', yaxis:'y2'};
    var t3 = {x: robust(d),     type:'histogram', name:'RobustScaler',  marker:{color:'#f87171'}, opacity:0.7, nbinsx:40, xaxis:'x3', yaxis:'y3'};
    var layout = Object.assign({}, common, {
      title:{text:'Skewed feature after three scalers',font:{color:T.text,size:14}},
      grid:{rows:1,columns:3,pattern:'independent'},
      xaxis:{title:'Standard',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'Count',gridcolor:T.grid},
      xaxis2:{title:'MinMax',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{gridcolor:T.grid},
      xaxis3:{title:'Robust',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis3:{gridcolor:T.grid},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l2-scalers-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  var elP = document.getElementById('plot-l2-pipeline-en');
  if (elP){
    var nodes_x = [0, 1.2, 1.2, 2.4, 2.4, 3.6, 3.6, 4.8, 6.0];
    var nodes_y = [1.5, 2.5, 0.5, 2.5, 0.5, 2.5, 0.5, 1.5, 1.5];
    var nodes_text = ['Raw DataFrame','num cols','cat cols','Impute median','Impute mode','StandardScaler','OneHotEncoder','Concat','Classifier'];
    var nodes_color = [T.accent,'#4ecdc4','#f87171','#4ecdc4','#f87171','#4ecdc4','#f87171',T.accent,T.accent];
    var ntr = {x:nodes_x,y:nodes_y,mode:'markers+text',type:'scatter',
               marker:{color:nodes_color,size:38,line:{color:'rgba(255,255,255,0.3)',width:1}},
               text:nodes_text,textposition:'bottom center',textfont:{color:T.text,size:11},
               hoverinfo:'skip',showlegend:false};
    var edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[7,8]];
    var ex=[], ey=[];
    for (var i=0;i<edges.length;i++){
      ex.push(nodes_x[edges[i][0]],nodes_x[edges[i][1]],null);
      ey.push(nodes_y[edges[i][0]],nodes_y[edges[i][1]],null);
    }
    var etr = {x:ex,y:ey,mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:2},hoverinfo:'skip',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'Pipeline + ColumnTransformer dataflow',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-0.5,6.7]},
      yaxis:{visible:false,range:[-0.2,3.4]},
      margin:{t:50,r:20,b:60,l:20},
      height:380
    });
    Plotly.newPlot('plot-l2-pipeline-en',[etr,ntr],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elStr = document.getElementById('plot-l2-scalers-tr');
  if (elStr){
    var d = makeData(11);
    var t1 = {x: standardize(d), type:'histogram', name:'StandardScaler', marker:{color:T.accent}, opacity:0.7, nbinsx:40, xaxis:'x', yaxis:'y'};
    var t2 = {x: minmax(d),     type:'histogram', name:'MinMaxScaler',  marker:{color:'#4ecdc4'}, opacity:0.7, nbinsx:40, xaxis:'x2', yaxis:'y2'};
    var t3 = {x: robust(d),     type:'histogram', name:'RobustScaler',  marker:{color:'#f87171'}, opacity:0.7, nbinsx:40, xaxis:'x3', yaxis:'y3'};
    var layout = Object.assign({}, common, {
      title:{text:'Carpik bir ozellik uc scaler sonrasi',font:{color:T.text,size:14}},
      grid:{rows:1,columns:3,pattern:'independent'},
      xaxis:{title:'Standard',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'Sayim',gridcolor:T.grid},
      xaxis2:{title:'MinMax',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{gridcolor:T.grid},
      xaxis3:{title:'Robust',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis3:{gridcolor:T.grid},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l2-scalers-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  var elPtr = document.getElementById('plot-l2-pipeline-tr');
  if (elPtr){
    var nodes_x = [0, 1.2, 1.2, 2.4, 2.4, 3.6, 3.6, 4.8, 6.0];
    var nodes_y = [1.5, 2.5, 0.5, 2.5, 0.5, 2.5, 0.5, 1.5, 1.5];
    var nodes_text = ['Ham DataFrame','sayisal sutunlar','kategorik sutunlar','Median imputer','Mod imputer','StandardScaler','OneHotEncoder','Birlestir','Siniflandirici'];
    var nodes_color = [T.accent,'#4ecdc4','#f87171','#4ecdc4','#f87171','#4ecdc4','#f87171',T.accent,T.accent];
    var ntr = {x:nodes_x,y:nodes_y,mode:'markers+text',type:'scatter',
               marker:{color:nodes_color,size:38,line:{color:'rgba(255,255,255,0.3)',width:1}},
               text:nodes_text,textposition:'bottom center',textfont:{color:T.text,size:11},
               hoverinfo:'skip',showlegend:false};
    var edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[7,8]];
    var ex=[], ey=[];
    for (var i=0;i<edges.length;i++){
      ex.push(nodes_x[edges[i][0]],nodes_x[edges[i][1]],null);
      ey.push(nodes_y[edges[i][0]],nodes_y[edges[i][1]],null);
    }
    var etr = {x:ex,y:ey,mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:2},hoverinfo:'skip',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'Pipeline + ColumnTransformer veri akisi',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-0.5,6.7]},
      yaxis:{visible:false,range:[-0.2,3.4]},
      margin:{t:50,r:20,b:60,l:20},
      height:380
    });
    Plotly.newPlot('plot-l2-pipeline-tr',[etr,ntr],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Gerçek dünya verisi asla ML-hazır değildir.</strong> Sayısal sütunlar 0.001'den 1.000.000'a kadar uzanır; kategorik sütunlar "Erkek", "K", "kadın", "E.", "  Erkek" içerir; bazı satırlarda NaN bulunur; bazı sütunlar döngüsel özelliklere dönüştürülmesi gereken tarihlerdir. Herhangi bir model öğrenebilmeden önce, bunları temiz bir özellik matrisine dönüştürmek için ölçeklemek, kodlamak, doldurmak ve birleştirmek zorundasınız. Bu ön işlemedir ve pratik ML zamanının %70'i burada harcanır.</p>

<p class="l-text">Bu derste dört temel ön işleme aracını (<code>StandardScaler</code>, <code>MinMaxScaler</code>, <code>RobustScaler</code>, <code>Normalizer</code>), üç kategorik kodlayıcıyı (<code>OneHotEncoder</code>, <code>OrdinalEncoder</code>, <code>LabelEncoder</code>), basit doldurmayı ve hepsini birbirine bağlayan ana kavramı ele alıyoruz: <strong>Pipeline'lar ve ColumnTransformer'lar</strong>. Sonunda, ham karışık tipli bir DataFrame'i sızıntısız, yeniden kullanılabilir bir ön işleme grafiğine dönüştürebileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>StandardScaler, MinMaxScaler ve RobustScaler ile sayısal feature'ları ölçekle</li><li>OneHotEncoder ve OrdinalEncoder ile kategorik değişkenleri encode et</li><li>SimpleImputer ve KNNImputer ile eksik değerleri doldur</li><li>ColumnTransformer ile sütun başına ön işlemcileri birleştir</li><li>Transformer'ları yalnızca eğitim verisine fit ederek veri sızıntısından kaçın</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Neden Ölçekleme? Mesafe ve Gradyanın Geometrisi</h2>

<p class="l-text">Birçok ML algoritması özellik ölçeğine duyarlıdır. k-NN Öklid mesafelerini hesaplar; bir özellik 0-1 aralığında, diğeri 0-1000 aralığındaysa, ikinci özellik her mesafede baskın olur ve birincisi pratikte göz ardı edilir. Logistic regression'ın gradient descent'i özellik ölçekleri büyüklük mertebesinde farklı olduğunda çılgınca salınır. PCA maksimum varyans yönlerini seçer, dolayısıyla büyük varyanslı bir özellik (bilgi içeriği değil, birimleri yüzünden) ana bileşenleri ele geçirir.</p>

<div class="calc-highlight"><strong>Genel kural:</strong> modeliniz mesafe kullanıyorsa (kNN, KMeans, SVM, sinir ağları), L2 düzenlileştirilmiş doğrusal modellerse veya PCA -- ölçeklemelisiniz. Modeliniz ağaç tabanlıysa (karar ağaçları, random forest, gradient boosting) -- ölçeklemenize gerek yoktur, çünkü ağaçlar yalnızca "bu özellik X eşiğinden büyük mü?" diye sorar ve eşik özellik ile birlikte ölçeklenir.</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">StandardScaler</div><div class="card-body">Z-skor: ortalamayı çıkar, std'ye böl. Çıktı ortalama 0, std 1. Kabaca normal her özellik için çalışır.</div></div>
<div class="calc-card"><div class="card-title">MinMaxScaler</div><div class="card-body">[0, 1]'e sıkıştırır. Sınırlı özellik gerektiğinde kullanın (örn. sigmoid'li sinir ağı girdileri).</div></div>
<div class="calc-card"><div class="card-title">RobustScaler</div><div class="card-body">Ortalama ve std yerine medyan ve IQR kullanır. Aykırı değerlere dayanıklıdır. Gelir, fiyat, sayım verisi için.</div></div>
<div class="calc-card"><div class="card-title">MaxAbsScaler</div><div class="card-body">Maksimum mutlak değere böler, çıktı [-1, 1]. İşareti ve seyrekliği korur. Seyrek metin özellikleri için iyidir.</div></div>
<div class="calc-card"><div class="card-title">Normalizer</div><div class="card-body">Satır başına L1 veya L2 normalizasyonu. Her satır birim vektör olur. NLP'de kosinüs benzerliği için kullanın.</div></div>
<div class="calc-card"><div class="card-title">PowerTransformer</div><div class="card-body">Box-Cox veya Yeo-Johnson -- çarpık özellikleri daha Gauss yapar. Normallik varsayımı önemli olduğunda kullanın.</div></div>
</div>

<div class="katex-block">$$z = \\frac{x - \\mu}{\\sigma}, \\quad x_{\\text{minmax}} = \\frac{x - x_{\\min}}{x_{\\max} - x_{\\min}}, \\quad x_{\\text{robust}} = \\frac{x - \\text{median}(x)}{\\text{IQR}(x)}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\mu$</div><div class="card-body">Sütun ortalaması. Eğitim verisinde <code>fit</code> sırasında hesaplanır, <code>scaler.mean_</code>'de saklanır.</div></div>
<div class="calc-card"><div class="card-title">$\\sigma$</div><div class="card-body">Sütun standart sapması. <code>scaler.scale_</code>'de saklanır. &gt; 0 olmalıdır.</div></div>
<div class="calc-card"><div class="card-title">$x_{\\min}, x_{\\max}$</div><div class="card-body">Eğitim verisinden sütun başına min ve max. <code>data_min_</code> ve <code>data_max_</code>'da saklanır.</div></div>
<div class="calc-card"><div class="card-title">IQR</div><div class="card-body">Çeyrekler arası aralık Q3 - Q1. Verinin orta %50'si. Aşırı değerlere dirençlidir.</div></div>
<div class="calc-card"><div class="card-title">medyan</div><div class="card-body">50. yüzdelik. "Robust" merkezi eğilim -- ortalama gibi aykırı değerler tarafından çekilmez.</div></div>
<div class="calc-card"><div class="card-title">$z$</div><div class="card-body">Standartlaştırılmış çıktı. Yapı gereği ortalaması 0, std'si 1'dir (eğitim setinde).</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> (StandardScaler, MinMaxScaler,
                                   RobustScaler, MaxAbsScaler, Normalizer)

X = np.<span class="fn">array</span>([
    [  <span class="num">1.0</span>,   <span class="num">200.0</span>,   <span class="num">0.01</span>],
    [  <span class="num">2.0</span>,   <span class="num">400.0</span>,   <span class="num">0.05</span>],
    [  <span class="num">3.0</span>,   <span class="num">600.0</span>,   <span class="num">0.02</span>],
    [  <span class="num">4.0</span>,   <span class="num">800.0</span>,   <span class="num">0.04</span>],
    [<span class="num">100.0</span>, <span class="num">1000.0</span>, <span class="num">100.00</span>],   <span class="cm"># 0. ve 2. sutunda aykiri değer</span>
])

<span class="cm"># StandardScaler</span>
ss = <span class="fn">StandardScaler</span>().<span class="fn">fit_transform</span>(X)
<span class="fn">print</span>(<span class="str">"Std ortalama:"</span>, ss.<span class="fn">mean</span>(axis=<span class="num">0</span>).<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Std std    :"</span>, ss.<span class="fn">std</span>(axis=<span class="num">0</span>).<span class="fn">round</span>(<span class="num">3</span>))

<span class="cm"># MinMaxScaler -- [0, 1]</span>
mm = <span class="fn">MinMaxScaler</span>().<span class="fn">fit_transform</span>(X)
<span class="fn">print</span>(<span class="str">"MinMax min/max:"</span>, mm.<span class="fn">min</span>(axis=<span class="num">0</span>), mm.<span class="fn">max</span>(axis=<span class="num">0</span>))

<span class="cm"># RobustScaler -- aykiri degerden etkilenmez</span>
rs = <span class="fn">RobustScaler</span>().<span class="fn">fit_transform</span>(X)
<span class="fn">print</span>(<span class="str">"Robust medyan:"</span>, np.<span class="fn">median</span>(rs, axis=<span class="num">0</span>))

<span class="cm"># Aykiri satiri scaler'larda karsilastir</span>
<span class="fn">print</span>(<span class="str">"Orijinal :"</span>, X[-<span class="num">1</span>])
<span class="fn">print</span>(<span class="str">"Standard :"</span>, ss[-<span class="num">1</span>].<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"MinMax   :"</span>, mm[-<span class="num">1</span>].<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Robust   :"</span>, rs[-<span class="num">1</span>].<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Son satırın iki sütunda açık aykırı değer olduğu 5x3 oyuncak matris kurar. 2) <code>StandardScaler</code> std'ye göre merkezler ve yeniden ölçekler -- ama aykırı değer std'yi şişirir, bu yüzden diğer satırlar sıfır civarına sıkışır. 3) <code>MinMaxScaler</code> [0, 1]'e eşler ama kırılgandır: tek bir devasa değer diğer herkesi 0.001'e iter. 4) <code>RobustScaler</code> medyan ve IQR kullanır; aykırı değerin bu istatistikler üzerindeki etkisi minimumdur, dolayısıyla diğer satırlar göreli aralıklarını korur. 5) Son satırı scaler'larda karşılaştırma: standard=çok büyük, minmax=1.0 (üste kırpıldı), robust=büyük ama diğer satırlar makul kalır. RobustScaler veriniz ağır kuyruklu olduğunda dostunuzdur.</p>

<div id="plot-l2-scalers-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Aynı çarpık özellik dağılımı StandardScaler (turuncu) vs MinMaxScaler (turkuaz) vs RobustScaler (kırmızı) sonrası. StandardScaler şekli korur ama sıfır etrafında yeniden merkezler. MinMaxScaler her şeyi [0,1]'e sıkıştırır -- bir aykırı değer varsa baskındır. RobustScaler kuyrukları görmezden gelir ve verinin büyük kısmı için [-1, 1]'e yakın "tipik" bir aralık verirken aşırı değerler aşırı kalır. Bu görsel yeni bir özellik için scaler seçmenin tek en iyi yoludur: dağılımı önce ve sonra çizin, modeliniz için en yararlı dönüşümü seçin.</div>

<div class="l-warn"><strong>Kritik:</strong> daima eğitim verisinde <code>fit_transform</code> ve test/doğrulama verisinde yalnızca <code>transform</code>. Tüm veri setinde scaler'ı fit ederseniz, test setinin istatistikleri eğitim dönüşümüne sızar -- raporladığınız test skorları iyimser olur ve dağıtımda hayatta kalmaz.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Kategorik Özellikleri Kodlama</h2>

<p class="l-text">Modeller sayı konuşur, dize değil. Kategorik sütunların ("Erkek"/"Kadın", "ABD"/"TR"/"DE", "küçük"/"orta"/"büyük") sayısal forma dönüştürülmesi gerekir. sklearn üç ana araç sunar; her biri farklı durumlara uygundur.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">OneHotEncoder</div><div class="compare-item">Her kategori kendi 0/1 sütununa dönüşür</div><div class="compare-item">Çıktı: varsayılan olarak seyrek matris</div><div class="compare-item">Nominal (sırasız) kategoriler için kullanın</div><div class="compare-item">Doğrusal ve ağaç modelleri için güvenli</div><div class="compare-item">k-1 (veya k) sütun ekler; boyutluluğu patlatabilir</div><div class="compare-item">Görülmemiş kategorileri <code>handle_unknown='ignore'</code> ile yönetir</div></div>
<div class="compare-col"><div class="compare-title">OrdinalEncoder</div><div class="compare-item">Her kategori tek bir tam sayıya dönüşür</div><div class="compare-item">Çıktı: yoğun 2B dizi</div><div class="compare-item">Sıralı (ordinal) kategoriler için: küçük &lt; orta &lt; büyük</div><div class="compare-item">Ağaç modelleri sever, doğrusal modeller SEVMEZ (sırayı büyüklük olarak yorumlar)</div><div class="compare-item">Boyutluluk patlaması yok</div><div class="compare-item">Sıralamayı zorlamak için <code>categories=[order]</code> geçirin</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> OneHotEncoder, OrdinalEncoder, LabelEncoder

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">"ulke"</span>:   [<span class="str">"USA"</span>, <span class="str">"TR"</span>, <span class="str">"DE"</span>, <span class="str">"USA"</span>, <span class="str">"TR"</span>, <span class="str">"FR"</span>],
    <span class="str">"boyut"</span>:  [<span class="str">"S"</span>,   <span class="str">"M"</span>,  <span class="str">"L"</span>,  <span class="str">"M"</span>,   <span class="str">"L"</span>,  <span class="str">"S"</span>],
    <span class="str">"cinsiyet"</span>: [<span class="str">"M"</span>, <span class="str">"F"</span>,  <span class="str">"F"</span>,  <span class="str">"M"</span>,   <span class="str">"M"</span>,  <span class="str">"F"</span>],
})

<span class="cm"># 1) Nominal sutunlar için OneHotEncoder</span>
ohe = <span class="fn">OneHotEncoder</span>(sparse_output=<span class="kw">False</span>, handle_unknown=<span class="str">"ignore"</span>)
ulke_ohe = ohe.<span class="fn">fit_transform</span>(df[[<span class="str">"ulke"</span>]])
<span class="fn">print</span>(<span class="str">"OneHot sutunlari:"</span>, ohe.<span class="fn">get_feature_names_out</span>([<span class="str">"ulke"</span>]))

<span class="cm"># Lineer modeller için "dummy variable trap"i onlemek için biri dusur</span>
ohe_drop = <span class="fn">OneHotEncoder</span>(sparse_output=<span class="kw">False</span>, drop=<span class="str">"first"</span>).<span class="fn">fit</span>(df[[<span class="str">"ulke"</span>]])

<span class="cm"># 2) "boyut" için acik siralama ile OrdinalEncoder</span>
oe = <span class="fn">OrdinalEncoder</span>(categories=[[<span class="str">"S"</span>, <span class="str">"M"</span>, <span class="str">"L"</span>]])
df[<span class="str">"boyut_ord"</span>] = oe.<span class="fn">fit_transform</span>(df[[<span class="str">"boyut"</span>]])
<span class="fn">print</span>(df[[<span class="str">"boyut"</span>, <span class="str">"boyut_ord"</span>]])
<span class="cm"># S->0, M->1, L->2 -- dogal sirayi korur</span>

<span class="cm"># 3) LabelEncoder SADECE hedef y için, asla X için</span>
le = <span class="fn">LabelEncoder</span>()
y_raw = [<span class="str">"pos"</span>, <span class="str">"neg"</span>, <span class="str">"pos"</span>, <span class="str">"nor"</span>, <span class="str">"neg"</span>]
y_enc = le.<span class="fn">fit_transform</span>(y_raw)
<span class="fn">print</span>(le.classes_)
<span class="fn">print</span>(y_enc)</code></pre></div>

<p class="l-text"><strong>Kodun çalışma akışı:</strong> 1) Üç kategorik sütunlu küçük bir DataFrame oluşturur -- ülke (nominal), boyut (ordinal), cinsiyet (ikili). 2) <code>sparse_output=False</code> ile <code>OneHotEncoder</code> yoğun bir 2B dizi döner; <code>handle_unknown="ignore"</code> eğitimde olmayan kategoriler içeren test satırlarında <code>transform</code> çağırmanıza izin verir (onlar için tüm sıfırlar üretir). 3) <code>get_feature_names_out</code> hangi çıktı sütununun hangi kategoriye karşılık geldiğini söyler -- model katsayılarını incelemek için elzemdir. 4) <code>drop="first"</code> her özellik için bir kategoriyi düşürür; bu doğrusal modeller için dummy-variable tuzağını (mükemmel eşdoğrusallık) önler ama ağaç modelleri buna ihtiyaç duymaz. 5) <code>categories=[["S", "M", "L"]]</code> ile <code>OrdinalEncoder</code> S=0 &lt; M=1 &lt; L=2 sırasını zorlar; bu argüman olmadan alfabetik sıralar ("L"=0, "M"=1, "S"=2), bu da boyut için yanlıştır. 6) <code>LabelEncoder</code> sadece hedef değişken y içindir -- X özellik sütunlarında kullanmak yeni başlayan hatasıdır çünkü etiketlerin genellikle olmayan ordinal ilişkileri olduğunu ima eder.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP yorum sınıflandırması</div><div class="example-body">Diyelim <code>{puan: 1-5, ulke: USA/TR/DE/..., yorum_metni: ...}</code> özellikleri ile yorum duygusunu tahmin ediyorsunuz. Puan ordinaldir (5 yıldız &gt; 4 yıldız &gt; ...) -- <code>OrdinalEncoder</code> kullanın veya ham tam sayı olarak geçirin. Ülke nominaldir -- <code>OneHotEncoder</code> kullanın (veya yüksek kardinalite için target encoding). Yorum metni -- <code>TfidfVectorizer</code> kullanın. Her sütun türü kendi ön işleyicisini alır; bölüm 5'teki <code>ColumnTransformer</code> bunları birleştirmenize izin verir.</div></div>

<div class="l-warn"><strong>Yüksek kardinalite tuzağı:</strong> sütununuzun 50.000 benzersiz user_id'si varsa, OneHotEncoder 50.000 sütun üretir -- bu belleği ve çoğu modeli öldürür. Çözümler: target encoding, frekans encoding veya hashing trick (<code>HashingEncoder</code> category_encoders'tan). Üretim kalitesinde iş için sütun başına kardinaliteyi ~50'nin altında tutun veya embedding kullanın.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Eksik Değerleri Yönetme: SimpleImputer</h2>

<p class="l-text">Gerçek veri setlerinde eksik değerler vardır. Bazı sütunlar seyrek doludur (satırların sadece %30'unun "tercih_edilen_dil"i vardır); bazıları kazara eksiktir (bir dakikalık sensör arızası); bazıları kasten eksiktir (NaN "geçerli değil" anlamına gelir). Çoğu sklearn estimator'ü X NaN içeriyorsa hata fırlatır -- önce doldurmalısınız.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer, KNNImputer

X = pd.<span class="fn">DataFrame</span>({
    <span class="str">"yas"</span>:     [<span class="num">25</span>, <span class="num">30</span>, np.nan, <span class="num">45</span>, np.nan, <span class="num">60</span>],
    <span class="str">"gelir"</span>:   [<span class="num">50000</span>, np.nan, <span class="num">70000</span>, <span class="num">90000</span>, <span class="num">80000</span>, np.nan],
    <span class="str">"ulke"</span>:    [<span class="str">"USA"</span>, <span class="str">"TR"</span>, np.nan, <span class="str">"TR"</span>, <span class="str">"USA"</span>, <span class="str">"DE"</span>],
})

<span class="cm"># Sayisal: NaN'i sutun medyani ile degistir</span>
num_imp = <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)
X[[<span class="str">"yas"</span>, <span class="str">"gelir"</span>]] = num_imp.<span class="fn">fit_transform</span>(X[[<span class="str">"yas"</span>, <span class="str">"gelir"</span>]])

<span class="cm"># Kategorik: NaN'i en sik kategori veya bir sabit ile degistir</span>
cat_imp = <span class="fn">SimpleImputer</span>(strategy=<span class="str">"constant"</span>, fill_value=<span class="str">"EKSIK"</span>)
X[[<span class="str">"ulke"</span>]] = cat_imp.<span class="fn">fit_transform</span>(X[[<span class="str">"ulke"</span>]])

<span class="fn">print</span>(X)

<span class="cm"># KNN imputer: eksik degerleri en yakin k satir kullanarak doldur</span>
knn_imp = <span class="fn">KNNImputer</span>(n_neighbors=<span class="num">2</span>)
X_filled = knn_imp.<span class="fn">fit_transform</span>(X[[<span class="str">"yas"</span>, <span class="str">"gelir"</span>]])</code></pre></div>

<p class="l-text"><strong>Adım adım okuyalım:</strong> 1) Üç sütunda kasıtlı NaN'ı olan minik bir DataFrame kurar. 2) <code>SimpleImputer(strategy="median")</code> fit'te sütun başına medyanı öğrenir ve transform'da NaN'ı onunla değiştirir; medyan ortalamaya tercih edilir çünkü aykırı değerlere dayanıklıdır. Diğer stratejiler: <code>"mean"</code>, <code>"most_frequent"</code> (mod), <code>"constant"</code>. 3) Kategorik sütunlar için medyan kullanamazsınız -- "EKSIK" gibi bir sentinel değerle <code>"most_frequent"</code> veya <code>"constant"</code> kullanın; bu modelin "eksiklik kendisi" sinyaldir öğrenmesine izin verir. 4) <code>KNNImputer</code> daha sofistikedir: her eksik değer için, en yakın k satırı (eksik olmayan sütunları kullanarak) bulur ve eksik sütun için değerlerini ortalar. Doğru imputasyona daha yakındır ama daha yavaş ve sayısal veriyle sınırlıdır.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">strategy="mean"</div><div class="card-body">Sayısal için varsayılan. Hızlı ama aykırı değerler tarafından çekilir.</div></div>
<div class="calc-card"><div class="card-title">strategy="median"</div><div class="card-body">Aykırı değerlere dayanıklı. Çarpık sayısal özellikler için varsayılan seçim.</div></div>
<div class="calc-card"><div class="card-title">strategy="most_frequent"</div><div class="card-body">Mod. Kategorik veri için gerekli. Tüm dtype'lar için çalışır.</div></div>
<div class="calc-card"><div class="card-title">strategy="constant"</div><div class="card-body">Sabit değer ile doldur (<code>fill_value=</code>). "Eksik"i özellik olarak için yararlı sentinel.</div></div>
<div class="calc-card"><div class="card-title">add_indicator=True</div><div class="card-body">Hangi satırların doldurulduğunu gösteren 0/1 maske sütunu ekler -- genellikle yararlı bir özellik.</div></div>
<div class="calc-card"><div class="card-title">KNNImputer</div><div class="card-body">Akıllı ama yavaş. Sadece imputasyon doğruluğu önemli olduğunda küçük/orta sayısal veri setlerinde kullanın.</div></div>
</div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">NaN bir şey ifade ettiğinde. Bir ankette "gelir" NaN olabilir çünkü katılımcı cevap vermeyi reddetti. Cevap vermeyi reddetmek yüksek gelirle (gizlilik) ilişkilidir. Medyan ile doldurursanız o sinyali tamamen silersiniz. <code>add_indicator=True</code> ile her ikisini de korursunuz: medyan ile doldurulmuş değer VE bir "eksikti" 0/1 sütunu. Genellikle 0/1 sütunu orijinal özellikten daha güçlü bir tahminci olur. Bir strateji seçmeden önce daima değerin <em>neden</em> eksik olduğunu düşünün.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Pipeline'lar: Dönüşümleri Zincirleme</h2>

<p class="l-text">Manuel olarak ölçeklemek, kodlamak ve doldurmak size N ara değişken (<code>X_train_scaled</code>, <code>X_test_scaled</code>, <code>X_train_imputed</code>, ...) ve veri sızdırmanın yüz yolu bırakır. Pipeline nesnesi bunu tek satırda çözer: bir estimator ile biten dönüştürücü dizisini tutar ve tek bir model olarak aynı <code>fit/predict/score</code> arayüzünü sunar.</p>

<div class="calc-highlight"><strong>En önemli sklearn deseni:</strong> her ön işleme + model kombinasyonunu bir <code>Pipeline</code>'a sarın. Pipeline, çapraz doğrulama sırasında her fold'un kendi taze fit edilmiş scaler/imputer'ını almasını garanti eder ve sızıntı tuzağını tamamen ortadan kaldırır.</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split, cross_val_score
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline, make_pipeline
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.2</span>, random_state=<span class="num">42</span>, stratify=y
)

<span class="cm"># Isimli pipeline -- acik, onerilen</span>
pipe = <span class="fn">Pipeline</span>(steps=[
    (<span class="str">"imputer"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)),
    (<span class="str">"scaler"</span>,  <span class="fn">StandardScaler</span>()),
    (<span class="str">"clf"</span>,     <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),
])

<span class="cm"># VEYA: kisayol, isimler otomatik</span>
pipe2 = <span class="fn">make_pipeline</span>(<span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>),
                      <span class="fn">StandardScaler</span>(),
                      <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>))

<span class="cm"># Tum pipeline'i fit ve skorla</span>
pipe.<span class="fn">fit</span>(X_train, y_train)
<span class="fn">print</span>(f<span class="str">"Test acc: {pipe.score(X_test, y_test):.3f}"</span>)

<span class="cm"># Capraz doğrulama -- scaler her fold içinde YENIDEN fit edilir, sizinti yok</span>
scores = <span class="fn">cross_val_score</span>(pipe, X_train, y_train, cv=<span class="num">5</span>, scoring=<span class="str">"accuracy"</span>)
<span class="fn">print</span>(f<span class="str">"CV dogrulugu: {scores.mean():.3f} +/- {scores.std():.3f}"</span>)

<span class="cm"># Adimlara isimle eris</span>
<span class="fn">print</span>(pipe.named_steps[<span class="str">"clf"</span>].coef_.shape)

<span class="cm"># Tum pipeline boyunca hiperparametre ayari (cift alt cizgi)</span>
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV
grid = {<span class="str">"clf__C"</span>: [<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1.0</span>, <span class="num">10.0</span>]}
search = <span class="fn">GridSearchCV</span>(pipe, grid, cv=<span class="num">5</span>).<span class="fn">fit</span>(X_train, y_train)
<span class="fn">print</span>(<span class="str">"En iyi C:"</span>, search.best_params_)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Breast-cancer'ı (ikili sınıflandırma, 30 özellik) yükler ve stratify edilmiş böler. 2) <code>Pipeline(steps=[...])</code> bir predictor ile biten (string, dönüştürücü) tuple'ları dizisini oluşturur; bu açık formdur, saklamayı düşündüğünüz herhangi bir pipeline için tercih edilir. 3) <code>make_pipeline(...)</code> sınıf adlarından isimler otomatik üretir ("standardscaler", "logisticregression") -- daha kısa ama referanslamak daha zor. 4) <code>pipe.fit(X_train, y_train)</code> her dönüştürücüde <code>fit_transform</code> ve son estimator'de <code>fit</code> çağırır, ara çıktıları otomatik geçirir. <code>pipe.score</code> zincir boyunca <code>transform</code> çağırır ve sonunda <code>score</code>. 5) Pipeline ile <code>cross_val_score</code>, 5 fold'un her biri için imputer'ın medyanının ve scaler'ın ortalama/std'sinin yalnızca 4 eğitim fold'unda hesaplanmasını garanti eder -- test fold'u dokunulmamış kalır. Bu sızıntı-güvenli çapraz doğrulama yoludur. 6) <code>named_steps</code> modeli incelemek için fit edilmiş pipeline'a ulaşmanıza izin verir. 7) <code>GridSearchCV</code> çift alt çizgi parametre adları kullanır: <code>clf__C</code> "clf adlı adımın C parametresi" anlamına gelir.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">.fit(X, y)</div><div class="card-body">Her dönüştürücüde fit_transform, son estimator'de fit çağırır. Tüm öğrenilen durumu saklar.</div></div>
<div class="calc-card"><div class="card-title">.predict(X)</div><div class="card-body">Her dönüştürücüde transform, son estimator'de predict çağırır. Inference için tek satır.</div></div>
<div class="calc-card"><div class="card-title">.score(X, y)</div><div class="card-body">predict + skorlama ile aynı. Hızlı test değerlendirmesi için yararlı.</div></div>
<div class="calc-card"><div class="card-title">named_steps</div><div class="card-body">İç estimator'lere isimle dict-benzeri erişim. <code>pipe.named_steps["clf"]</code>.</div></div>
<div class="calc-card"><div class="card-title">step__param</div><div class="card-body">GridSearchCV'de iç içe parametrelere erişmek için çift alt çizgi sözdizimi.</div></div>
<div class="calc-card"><div class="card-title">memory=</div><div class="card-body">Fit edilmiş dönüştürücüleri diske önbelleğe al; bir adım pahalı olduğunda grid arama hızlanır.</div></div>
</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. ColumnTransformer: Farklı Sütunlara Farklı Adımlar</h2>

<p class="l-text">Gerçek veri setleri karışıktır: bazı sütunlar sayısal, bazıları kategorik, bazıları metindir. Bir dize sütununa <code>StandardScaler</code> uygulayamazsınız. <code>ColumnTransformer</code> her sütun alt kümesi için farklı bir ön işleyici belirlemenize, sonra çıktıları birleştirmenize izin verir. Pipeline ile birleştiğinde, üretim kalitesi herhangi bir ön işlemeyi inşa etmenin modern yoludur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.compose <span class="kw">import</span> ColumnTransformer, make_column_selector
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler, OneHotEncoder
<span class="kw">from</span> sklearn.impute <span class="kw">import</span> SimpleImputer
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression

df = pd.<span class="fn">DataFrame</span>({
    <span class="str">"yas"</span>:      [<span class="num">25</span>, <span class="num">30</span>, np.nan, <span class="num">45</span>, <span class="num">60</span>, <span class="num">22</span>, <span class="num">38</span>, <span class="num">51</span>],
    <span class="str">"gelir"</span>:    [<span class="num">50000</span>, <span class="num">60000</span>, <span class="num">70000</span>, <span class="num">90000</span>, <span class="num">80000</span>, <span class="num">30000</span>, np.nan, <span class="num">75000</span>],
    <span class="str">"ulke"</span>:     [<span class="str">"USA"</span>, <span class="str">"TR"</span>,  <span class="str">"DE"</span>,  <span class="str">"TR"</span>, <span class="str">"USA"</span>, <span class="str">"FR"</span>,  <span class="str">"DE"</span>,   <span class="str">"TR"</span>],
    <span class="str">"cinsiyet"</span>: [<span class="str">"M"</span>,   <span class="str">"F"</span>,   <span class="str">"F"</span>,   <span class="str">"M"</span>,  <span class="str">"M"</span>,   <span class="str">"F"</span>,   <span class="str">"F"</span>,    <span class="str">"M"</span>],
})
y = np.<span class="fn">array</span>([<span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>, <span class="num">0</span>, <span class="num">1</span>, <span class="num">1</span>, <span class="num">0</span>])

numeric_cols = [<span class="str">"yas"</span>, <span class="str">"gelir"</span>]
categ_cols   = [<span class="str">"ulke"</span>, <span class="str">"cinsiyet"</span>]

<span class="cm"># Her dal için pipeline'lar</span>
num_pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"imp"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"median"</span>)),
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
])
cat_pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"imp"</span>, <span class="fn">SimpleImputer</span>(strategy=<span class="str">"most_frequent"</span>)),
    (<span class="str">"ohe"</span>, <span class="fn">OneHotEncoder</span>(handle_unknown=<span class="str">"ignore"</span>, sparse_output=<span class="kw">False</span>)),
])

<span class="cm"># ColumnTransformer onlari birlestirir</span>
preprocess = <span class="fn">ColumnTransformer</span>(transformers=[
    (<span class="str">"num"</span>, num_pipe, numeric_cols),
    (<span class="str">"cat"</span>, cat_pipe, categ_cols),
])

<span class="cm"># Tam model pipeline'i</span>
model = <span class="fn">Pipeline</span>([
    (<span class="str">"prep"</span>, preprocess),
    (<span class="str">"clf"</span>,  <span class="fn">LogisticRegression</span>(max_iter=<span class="num">500</span>)),
])

model.<span class="fn">fit</span>(df, y)
<span class="fn">print</span>(model.<span class="fn">predict</span>(df))

<span class="cm"># Donusturulmus özellik adlarini incele</span>
ohe_step = model.named_steps[<span class="str">"prep"</span>].named_transformers_[<span class="str">"cat"</span>].named_steps[<span class="str">"ohe"</span>]
ohe_names = ohe_step.<span class="fn">get_feature_names_out</span>(categ_cols)
all_names = numeric_cols + <span class="fn">list</span>(ohe_names)
<span class="fn">print</span>(<span class="str">"Son özellik sutunlari:"</span>, all_names)

<span class="cm"># Bonus: dtype'a gore otomatik secim</span>
preprocess_auto = <span class="fn">ColumnTransformer</span>([
    (<span class="str">"num"</span>, num_pipe, <span class="fn">make_column_selector</span>(dtype_include=np.number)),
    (<span class="str">"cat"</span>, cat_pipe, <span class="fn">make_column_selector</span>(dtype_include=<span class="ty">object</span>)),
])</code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Karışık bir DataFrame kurar: NaN'lı iki sayısal sütun, iki kategorik sütun. 2) Bir sayısal dal pipeline'ı (medyanla doldur -&gt; ölçekle) ve bir kategorik dal (modla doldur -&gt; one-hot kodla) tanımlar. 3) <code>ColumnTransformer</code> (isim, dönüştürücü, sütunlar) tuple'larının listesini alır ve her dönüştürücüyü yalnızca kendi sütun alt kümesine uygular, sonra sonuçları yatay olarak yığar. Çıktı, tüm dönüştürülmüş sütunlu tek bir 2B dizidir. 4) Tüm ön işleyiciyi başka bir Pipeline içinde bir logistic regression ile sarar -- bu tek nesne artık doldurma, ölçekleme, kodlama ve sınıflandırmayı uçtan uca yapar. 5) <code>model.named_steps["prep"].named_transformers_["cat"]</code>, OneHotEncoder'a geri dönmek için zincirdir, bu katsayıları özellik adlarına eşlemek için elzemdir. 6) <code>dtype_include</code> ile <code>make_column_selector</code> sütunları dtype'a göre otomatik seçer -- onlarca sütununuz olduğunda elle listelemekten kaçınmak için yararlıdır.</p>

<div id="plot-l2-pipeline-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafikte:</strong> Tam pipeline'ın akış diyagramı -- soldaki ham karışık DataFrame ColumnTransformer'dan akar (sayısal ve kategorik dallara böler), her dal doldurma + kendi dönüşümünü çalıştırır, sonra çıktılar birleştirilir ve tek bir sınıflandırıcıya beslenir. Tüm grafik tek bir sklearn nesnesidir. Bu, herhangi bir tablo ML probleminde inşa etmeniz gereken yapıdır; "test setini aynı şekilde ölçeklemeyi unuttum" hata sınıfını tamamen ortadan kaldırır.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: tez kalitesinde yeniden üretilebilir pipeline</div><div class="example-body">Yüksek lisans teziniz için aynı ön işleme üzerinde 5 modeli karşılaştırmanız gerekiyor. ColumnTransformer'ı bir kez kurun, sonra döngü: <code>for clf in [LogReg(), RF(), GBM(), SVC(), MLP()]: Pipeline([("prep", preprocess), ("clf", clf)]).fit(X, y)</code>. Her model özdeş özellikleri görür. Tüm pipeline'ı <code>joblib.dump(model, "model.pkl")</code> ile kaydedin ve tek dağıtılabilir artifact'iniz olur -- ayrı scaler dosyası yok, çıkarım zamanında ön işleme aksiliği yok.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. fit_transform vs transform: Sızıntı Kuralı</h2>

<p class="l-text">Bu, tüm ön işlemedeki en önemli kuraldır. Yanlış yaparsanız test skorlarınız hayal ürünüdür.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Eğitim verisi</div><div class="compare-item"><code>fit_transform(X_train)</code> kullanın</div><div class="compare-item">Parametreleri öğrenir: ortalama, std, mod, vb.</div><div class="compare-item">Onları <code>scaler.mean_</code> vb. olarak saklar</div><div class="compare-item">Dönüşümü uygular</div></div>
<div class="compare-col"><div class="compare-title">Test / doğrulama / yeni veri</div><div class="compare-item">Sadece <code>transform(X_test)</code> kullanın</div><div class="compare-item">Eğitimde öğrenilen parametreleri yeniden kullanır</div><div class="compare-item">Asla yenilerini fit etmez</div><div class="compare-item">Testi görülmemiş gibi davranır</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler

X_train = np.<span class="fn">array</span>([[<span class="num">1.0</span>], [<span class="num">2.0</span>], [<span class="num">3.0</span>], [<span class="num">4.0</span>], [<span class="num">5.0</span>]])
X_test  = np.<span class="fn">array</span>([[<span class="num">10.0</span>], [<span class="num">20.0</span>]])

<span class="cm"># YANLIS -- testte fit yeni bir scaler fit eder, dagilim kaymasini gizler</span>
scaler = <span class="fn">StandardScaler</span>()
X_test_yanlis = scaler.<span class="fn">fit_transform</span>(X_test)
<span class="fn">print</span>(<span class="str">"Yanlış:"</span>, X_test_yanlis.<span class="fn">ravel</span>())   <span class="cm"># [-1.0, 1.0]</span>

<span class="cm"># DOGRU -- egitimde fit, testte sadece transform</span>
scaler = <span class="fn">StandardScaler</span>()
scaler.<span class="fn">fit</span>(X_train)
X_train_s = scaler.<span class="fn">transform</span>(X_train)
X_test_s  = scaler.<span class="fn">transform</span>(X_test)
<span class="fn">print</span>(<span class="str">"Doğru egitim:"</span>, X_train_s.<span class="fn">ravel</span>().<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Doğru test  :"</span>, X_test_s.<span class="fn">ravel</span>().<span class="fn">round</span>(<span class="num">2</span>))    <span class="cm"># [4.95, 12.02]</span>
<span class="cm"># Test noktalari simdi egitim dagilimindan acikca uzak -- model</span>
<span class="cm"># bunu out-of-distribution olarak isaretleyebilir, gercek korunur.</span></code></pre></div>

<p class="l-text"><strong>Akış şöyle ilerliyor:</strong> 1) Test değerlerinin eğitimin maksimumunun 2-4 katı olduğu küçük bir eğitim/test bölmesi tanımlar -- kasıtlı bir dağılım kayması. 2) YANLIŞ yol testte <code>fit_transform</code> çağırır, eğitim hakkında hiçbir şey bilmeyen yepyeni bir scaler fit eder; test noktaları yapay olarak [-1, 1]'e sıkıştırılır, kayma gizlenir. 3) DOĞRU yol scaler'ı eğitim üzerinde BİR KEZ fit eder, sonra her ikisinde <code>transform</code> çağırır -- test değerleri 4.95 ve 12.02 olarak çıkar, tipik eğitim z-skor aralığının çok dışında. Tam olarak istediğiniz şey budur: ölçeklenmiş özellik matrisi test verisinin eğitime göre olağandışı olduğu gerçeğini korur. 4) Aşağı akış modelleri bunu ya dağılım dışı olarak işaretleyebilir ya da ekstrapolasyon deneyebilir -- testte yeniden fit ederek hile yaptığınızda her iki karar da bloke edilir.</p>

<div class="l-warn"><strong>Yeni başlayan kodundaki en yaygın ML hatası:</strong> <code>scaler = StandardScaler(); X_full = scaler.fit_transform(X_full); X_train, X_test = train_test_split(X_full, ...)</code>. Scaler fit ederken test verisini gördü; sıralama "fit sonra böl" olsa bile, test setinin istatistikleri zaten dönüşümü kirletti. Daima ÖNCE bölün, sonra sadece eğitimde fit edin. Pipeline'lar + çapraz doğrulama bunu otomatik yapar.</div>

<div class="think-box"><div class="think-label">ÖZET ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> Mesafeye dayalı veya gradyan tabanlı modeller için sayısal özellikleri ölçekleyin; ağaçlar buna ihtiyaç duymaz.<br><strong>2.</strong> StandardScaler varsayılandır; aykırı değerler varsa RobustScaler; sınırlı çıktı gerektiğinde MinMaxScaler.<br><strong>3.</strong> Nominal kategoriler için OneHotEncoder; sıralı kategoriler için OrdinalEncoder (açık sıralama ile); sadece hedef için LabelEncoder.<br><strong>4.</strong> Önce eksik değerleri doldurun (sayısal için medyan, kategorik için most_frequent) ve eksiklik sinyal taşıdığında <code>add_indicator=True</code> düşünün.<br><strong>5.</strong> Pipeline dönüştürücüleri ve son bir estimator'ü tek nesneye zincirler; <code>fit/predict/score</code> tüm zincire uygulanır.<br><strong>6.</strong> ColumnTransformer farklı sütun alt kümelerine farklı ön işleyicileri uygular ve sonuçları yığar.<br><strong>7.</strong> Daima eğitim verisinde <code>fit_transform</code> ve test verisinde <code>transform</code>; pipeline'lar bu kuralı otomatik hâle getirir ve çapraz doğrulamayı dürüst tutar.<br><strong>8.</strong> Pipeline + ColumnTransformer kombinasyonu üretim sklearn için STANDART desendir -- bir kez öğrenin ve herhangi bir tablo ML projesi için şasiniz olur.</div></div>
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

  function rng(s){return function(){s=(s*9301+49297)%233280;return s/233280;};}

  function makeData(seed){
    var r = rng(seed); var arr=[];
    for (var i=0;i<200;i++){
      // log-normal-ish skewed
      var u=r(), v=r();
      var z = Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      arr.push(Math.exp(0.6*z + 1.0));
    }
    arr.push(50); arr.push(60);  // outliers
    return arr;
  }

  function standardize(arr){
    var m=0; for (var i=0;i<arr.length;i++) m+=arr[i]; m/=arr.length;
    var s=0; for (var i=0;i<arr.length;i++) s+=(arr[i]-m)*(arr[i]-m); s=Math.sqrt(s/arr.length);
    return arr.map(function(x){return (x-m)/s;});
  }
  function minmax(arr){
    var mn=Math.min.apply(null,arr), mx=Math.max.apply(null,arr);
    return arr.map(function(x){return (x-mn)/(mx-mn);});
  }
  function median(arr){var s=arr.slice().sort(function(a,b){return a-b;});var n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;}
  function robust(arr){
    var s=arr.slice().sort(function(a,b){return a-b;});
    var med = median(s);
    var q1 = s[Math.floor(s.length*0.25)];
    var q3 = s[Math.floor(s.length*0.75)];
    var iqr = q3 - q1;
    return arr.map(function(x){return (x-med)/iqr;});
  }

  var elS = document.getElementById('plot-l2-scalers-en');
  if (elS){
    var d = makeData(11);
    var t1 = {x: standardize(d), type:'histogram', name:'StandardScaler', marker:{color:T.accent}, opacity:0.7, nbinsx:40, xaxis:'x', yaxis:'y'};
    var t2 = {x: minmax(d),     type:'histogram', name:'MinMaxScaler',  marker:{color:'#4ecdc4'}, opacity:0.7, nbinsx:40, xaxis:'x2', yaxis:'y2'};
    var t3 = {x: robust(d),     type:'histogram', name:'RobustScaler',  marker:{color:'#f87171'}, opacity:0.7, nbinsx:40, xaxis:'x3', yaxis:'y3'};
    var layout = Object.assign({}, common, {
      title:{text:'Skewed feature after three scalers',font:{color:T.text,size:14}},
      grid:{rows:1,columns:3,pattern:'independent'},
      xaxis:{title:'Standard',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'Count',gridcolor:T.grid},
      xaxis2:{title:'MinMax',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{gridcolor:T.grid},
      xaxis3:{title:'Robust',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis3:{gridcolor:T.grid},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l2-scalers-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  var elP = document.getElementById('plot-l2-pipeline-en');
  if (elP){
    var nodes_x = [0, 1.2, 1.2, 2.4, 2.4, 3.6, 3.6, 4.8, 6.0];
    var nodes_y = [1.5, 2.5, 0.5, 2.5, 0.5, 2.5, 0.5, 1.5, 1.5];
    var nodes_text = ['Raw DataFrame','num cols','cat cols','Impute median','Impute mode','StandardScaler','OneHotEncoder','Concat','Classifier'];
    var nodes_color = [T.accent,'#4ecdc4','#f87171','#4ecdc4','#f87171','#4ecdc4','#f87171',T.accent,T.accent];
    var ntr = {x:nodes_x,y:nodes_y,mode:'markers+text',type:'scatter',
               marker:{color:nodes_color,size:38,line:{color:'rgba(255,255,255,0.3)',width:1}},
               text:nodes_text,textposition:'bottom center',textfont:{color:T.text,size:11},
               hoverinfo:'skip',showlegend:false};
    var edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[7,8]];
    var ex=[], ey=[];
    for (var i=0;i<edges.length;i++){
      ex.push(nodes_x[edges[i][0]],nodes_x[edges[i][1]],null);
      ey.push(nodes_y[edges[i][0]],nodes_y[edges[i][1]],null);
    }
    var etr = {x:ex,y:ey,mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:2},hoverinfo:'skip',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'Pipeline + ColumnTransformer dataflow',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-0.5,6.7]},
      yaxis:{visible:false,range:[-0.2,3.4]},
      margin:{t:50,r:20,b:60,l:20},
      height:380
    });
    Plotly.newPlot('plot-l2-pipeline-en',[etr,ntr],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elStr = document.getElementById('plot-l2-scalers-tr');
  if (elStr){
    var d = makeData(11);
    var t1 = {x: standardize(d), type:'histogram', name:'StandardScaler', marker:{color:T.accent}, opacity:0.7, nbinsx:40, xaxis:'x', yaxis:'y'};
    var t2 = {x: minmax(d),     type:'histogram', name:'MinMaxScaler',  marker:{color:'#4ecdc4'}, opacity:0.7, nbinsx:40, xaxis:'x2', yaxis:'y2'};
    var t3 = {x: robust(d),     type:'histogram', name:'RobustScaler',  marker:{color:'#f87171'}, opacity:0.7, nbinsx:40, xaxis:'x3', yaxis:'y3'};
    var layout = Object.assign({}, common, {
      title:{text:'Carpik bir özellik uc scaler sonrasi',font:{color:T.text,size:14}},
      grid:{rows:1,columns:3,pattern:'independent'},
      xaxis:{title:'Standard',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis:{title:'Sayim',gridcolor:T.grid},
      xaxis2:{title:'MinMax',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis2:{gridcolor:T.grid},
      xaxis3:{title:'Robust',gridcolor:T.grid,zerolinecolor:T.zero},
      yaxis3:{gridcolor:T.grid},
      showlegend:false,
      margin:{t:60,r:30,b:50,l:60}
    });
    Plotly.newPlot('plot-l2-scalers-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  var elPtr = document.getElementById('plot-l2-pipeline-tr');
  if (elPtr){
    var nodes_x = [0, 1.2, 1.2, 2.4, 2.4, 3.6, 3.6, 4.8, 6.0];
    var nodes_y = [1.5, 2.5, 0.5, 2.5, 0.5, 2.5, 0.5, 1.5, 1.5];
    var nodes_text = ['Ham DataFrame','sayisal sutunlar','kategorik sutunlar','Median imputer','Mod imputer','StandardScaler','OneHotEncoder','Birlestir','Siniflandirici'];
    var nodes_color = [T.accent,'#4ecdc4','#f87171','#4ecdc4','#f87171','#4ecdc4','#f87171',T.accent,T.accent];
    var ntr = {x:nodes_x,y:nodes_y,mode:'markers+text',type:'scatter',
               marker:{color:nodes_color,size:38,line:{color:'rgba(255,255,255,0.3)',width:1}},
               text:nodes_text,textposition:'bottom center',textfont:{color:T.text,size:11},
               hoverinfo:'skip',showlegend:false};
    var edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[7,8]];
    var ex=[], ey=[];
    for (var i=0;i<edges.length;i++){
      ex.push(nodes_x[edges[i][0]],nodes_x[edges[i][1]],null);
      ey.push(nodes_y[edges[i][0]],nodes_y[edges[i][1]],null);
    }
    var etr = {x:ex,y:ey,mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.4)',width:2},hoverinfo:'skip',showlegend:false};
    var layout = Object.assign({}, common, {
      title:{text:'Pipeline + ColumnTransformer veri akisi',font:{color:T.text,size:14}},
      xaxis:{visible:false,range:[-0.5,6.7]},
      yaxis:{visible:false,range:[-0.2,3.4]},
      margin:{t:50,r:20,b:60,l:20},
      height:380
    });
    Plotly.newPlot('plot-l2-pipeline-tr',[etr,ntr],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
