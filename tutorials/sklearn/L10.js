window.SKLEARN_L10 = {

en: `<p class="l-text"><strong>Naive Bayes is the algorithm you reach for when you need a text classifier working in five minutes.</strong> It is fast, it is interpretable, it handles thousands of features gracefully, and on text data it still beats more elaborate models often enough to remain the unbeatable baseline. In <a href="/tutorials/ml-theory/13">ML Theory Lesson 13</a> we built the math (Bayes' rule, the independence assumption, Laplace smoothing, log-space arithmetic). Now we put it all to work with sklearn.</p>

<p class="l-text">This lesson walks through all four sklearn NB variants on real datasets, shows how to pair MultinomialNB with TF-IDF for production text classification, tunes the smoothing parameter <code>alpha</code>, and finishes with a head-to-head against LogisticRegression on the same data so you can see when each algorithm wins. By the end you will know exactly when NB belongs in your toolbox in 2026 — and when it does not.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Apply the four sklearn NB variants (Multinomial, Gaussian, Bernoulli, Complement)</li><li>Pair MultinomialNB with CountVectorizer and TfidfVectorizer for text classification</li><li>Use GridSearchCV to tune the smoothing parameter <code>alpha</code></li><li>Build a 20 Newsgroups classifier in fewer than 30 lines of code</li><li>Compare NB against LogisticRegression on identical text data</li><li>Use <code>partial_fit</code> for streaming and online updates</li><li>Recognise when NB is the right tool — and when it is not — in 2026</li></ul></div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Recap and Setup</h2>

<p class="l-text">A one-paragraph refresher. Naive Bayes computes <em>P(class | features) ∝ P(class) · ∏ P(featureᵢ | class)</em> under the assumption that features are conditionally independent given the class. Despite this assumption being mostly false in practice, the algorithm dominates text classification because high-dimensional bag-of-words features behave just well enough for the independence to be a useful approximation. For full theory see <a href="/tutorials/ml-theory/13">ML Theory Lesson 13</a>.</p>

<p class="l-text">In sklearn, Naive Bayes lives in <code>sklearn.naive_bayes</code>. The four variants share the same fit/predict/predict_proba interface — switching between them is a one-line change.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MultinomialNB</div><div class="card-body">Count features. Default for text with CountVectorizer / TfidfVectorizer. Most common variant in practice.</div></div>
<div class="calc-card"><div class="card-title">GaussianNB</div><div class="card-body">Continuous numeric features. No hyperparameter to tune. Useful on iris, breast cancer, sensor data.</div></div>
<div class="calc-card"><div class="card-title">BernoulliNB</div><div class="card-body">Binary features. Word presence rather than frequency. Often beats Multinomial on short documents.</div></div>
<div class="calc-card"><div class="card-title">ComplementNB</div><div class="card-body">Imbalanced-data variant of Multinomial. Use when class distribution is skewed (e.g. 95% ham, 5% spam).</div></div>
<div class="calc-card"><div class="card-title">CategoricalNB</div><div class="card-body">Nominal categorical features (city, occupation). Less common — most tabular pipelines use tree models instead.</div></div>
<div class="calc-card"><div class="card-title">Shared API</div><div class="card-body">All four expose <code>fit</code>, <code>predict</code>, <code>predict_proba</code>, <code>predict_log_proba</code>, <code>score</code>, and <code>partial_fit</code> for streaming.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. MultinomialNB on Text — The Bread and Butter</h2>

<p class="l-text">The single most useful NB workflow: pair MultinomialNB with a vectorizer to turn raw text into a sparse count matrix, then fit. Let's build a tweet sentiment classifier on the <code>tweets.csv</code> dataset shipped with this site.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> CountVectorizer, TfidfVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, classification_report

<span class="cm"># Load the 300-tweet sentiment dataset shipped with this tutorial site</span>
df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/tweets.csv"</span>)
<span class="fn">print</span>(df.<span class="fn">head</span>())
<span class="fn">print</span>(df[<span class="str">"label"</span>].<span class="fn">value_counts</span>())

X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    df[<span class="str">"text"</span>], df[<span class="str">"label"</span>],
    test_size=<span class="num">0.25</span>, random_state=<span class="num">42</span>, stratify=df[<span class="str">"label"</span>]
)

<span class="cm"># Step 1: turn text into a sparse count matrix</span>
vec = <span class="fn">CountVectorizer</span>(lowercase=<span class="ty">True</span>, stop_words=<span class="str">"english"</span>, min_df=<span class="num">2</span>)
Xtr = vec.<span class="fn">fit_transform</span>(X_train)   <span class="cm"># sparse, shape (n_train, vocab_size)</span>
Xte = vec.<span class="fn">transform</span>(X_test)
<span class="fn">print</span>(f<span class="str">"Vocabulary size: {len(vec.vocabulary_)}"</span>)
<span class="fn">print</span>(f<span class="str">"Train matrix: {Xtr.shape}, sparsity: {1 - Xtr.nnz / (Xtr.shape[0] * Xtr.shape[1]):.4f}"</span>)

<span class="cm"># Step 2: fit MultinomialNB</span>
nb = <span class="fn">MultinomialNB</span>(alpha=<span class="num">1.0</span>)   <span class="cm"># alpha = Laplace smoothing</span>
nb.<span class="fn">fit</span>(Xtr, y_train)

<span class="cm"># Step 3: predict and evaluate</span>
pred = nb.<span class="fn">predict</span>(Xte)
<span class="fn">print</span>(f<span class="str">"Accuracy: {accuracy_score(y_test, pred):.3f}"</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, pred))

<span class="cm"># Inspect: which words push hardest toward each class?</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
feature_names = np.<span class="fn">array</span>(vec.<span class="fn">get_feature_names_out</span>())
<span class="kw">for</span> class_idx, class_name <span class="kw">in</span> <span class="fn">enumerate</span>(nb.classes_):
    top = np.<span class="fn">argsort</span>(nb.feature_log_prob_[class_idx])[-<span class="num">10</span>:][::-<span class="num">1</span>]
    <span class="fn">print</span>(f<span class="str">"Top 10 words for '{class_name}': {feature_names[top].tolist()}"</span>)</code></pre></div>

<p class="l-text">The whole pipeline is three calls: vectorize, fit, predict. <code>CountVectorizer</code> tokenizes lowercase text, drops English stop words, and ignores any word appearing in fewer than 2 documents (<code>min_df=2</code>) to cut noise. <code>MultinomialNB(alpha=1.0)</code> is the sklearn default with classic Laplace smoothing. <code>feature_log_prob_</code> stores log P(word | class) for every word — sorting it gives the most class-indicative vocabulary, which is how NB explains its own predictions.</p>

<div class="l-warn"><strong>Sparse matrices:</strong> always feed MultinomialNB the sparse CSR output of the vectorizer directly. Calling <code>.toarray()</code> first wastes memory — a 20k-document × 50k-vocabulary count matrix is 4 GB dense but only ~50 MB sparse. sklearn handles sparse input natively.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. GaussianNB on Continuous Features</h2>

<p class="l-text">When features are continuous numerics rather than counts, switch to <code>GaussianNB</code>. It fits one Gaussian per (class, feature) and has no smoothing hyperparameter — there is nothing to tune. The iris dataset is the canonical demo.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> GaussianNB
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score, train_test_split
<span class="kw">import</span> numpy <span class="kw">as</span> np

iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">42</span>, stratify=y
)

gnb = <span class="fn">GaussianNB</span>()
gnb.<span class="fn">fit</span>(X_train, y_train)
<span class="fn">print</span>(f<span class="str">"Test accuracy: {gnb.score(X_test, y_test):.3f}"</span>)

<span class="cm"># Cross-validated to be sure</span>
scores = <span class="fn">cross_val_score</span>(<span class="fn">GaussianNB</span>(), X, y, cv=<span class="num">5</span>)
<span class="fn">print</span>(f<span class="str">"5-fold CV accuracy: {scores.mean():.3f} +/- {scores.std():.3f}"</span>)

<span class="cm"># Inspect the learned Gaussian parameters</span>
<span class="kw">for</span> i, name <span class="kw">in</span> <span class="fn">enumerate</span>(iris.target_names):
    <span class="fn">print</span>(f<span class="str">"\\nClass {name}:"</span>)
    <span class="kw">for</span> j, feat <span class="kw">in</span> <span class="fn">enumerate</span>(iris.feature_names):
        <span class="fn">print</span>(f<span class="str">"  {feat}: mu={gnb.theta_[i, j]:.2f}, sigma2={gnb.var_[i, j]:.3f}"</span>)

<span class="cm"># Probabilistic prediction</span>
sample = X_test[:<span class="num">3</span>]
proba = gnb.<span class="fn">predict_proba</span>(sample)
<span class="fn">print</span>(<span class="str">"P(class | x) for first 3 test samples:"</span>)
<span class="fn">print</span>(proba.<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>

<p class="l-text">GaussianNB hits ~95% accuracy on iris with zero tuning — testament to how well the petal-length/width features separate the three species. <code>theta_</code> stores the per-(class, feature) means and <code>var_</code> stores variances, exactly as derived from maximum likelihood in the theory lesson. The Gaussian densities visualised below show why a single feature like petal length is almost enough to classify the species on its own.</p>

<div id="plot-skl10-nb-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> the class-conditional Gaussian densities GaussianNB learns for iris petal length, one curve per species. Setosa lives at low values (mean ~1.5 cm), versicolor in the middle (~4.3 cm), virginica at the top (~5.5 cm). At prediction time, given a new petal length, GaussianNB reads off the height of each curve and picks the largest. The crossing points of these curves are the decision thresholds. The fact that the curves barely overlap is exactly why iris is the textbook NB success story — the independence assumption hardly matters when the features are this informative.</div>

<div class="calc-step"><strong>Gotcha — variance smoothing:</strong> if a class has zero variance on some feature (constant value in training), the Gaussian density blows up. sklearn adds <code>var_smoothing=1e-9</code> to all variances by default. If GaussianNB returns NaN predictions, raise <code>var_smoothing</code> to 1e-6 or higher.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. BernoulliNB on Binary Features</h2>

<p class="l-text">When you only care about whether a word appears in a document (not how often), use BernoulliNB. It models each feature as a Bernoulli random variable conditional on class. For short text (tweets, headlines, SMS messages) this is often the right choice — counts in short documents are mostly 1s and 0s anyway, and explicitly modelling absences gives BernoulliNB extra signal.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> CountVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> BernoulliNB, MultinomialNB
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/tweets.csv"</span>)

<span class="cm"># Key flag: binary=True turns counts into 0/1 presence indicators</span>
vec = <span class="fn">CountVectorizer</span>(binary=<span class="ty">True</span>, stop_words=<span class="str">"english"</span>, min_df=<span class="num">2</span>)
X = vec.<span class="fn">fit_transform</span>(df[<span class="str">"text"</span>])
y = df[<span class="str">"label"</span>]

<span class="cm"># BernoulliNB also has a binarize threshold (default 0.0)</span>
bnb = <span class="fn">BernoulliNB</span>(alpha=<span class="num">1.0</span>)
bnb_scores = <span class="fn">cross_val_score</span>(bnb, X, y, cv=<span class="num">5</span>)
<span class="fn">print</span>(f<span class="str">"BernoulliNB 5-fold: {bnb_scores.mean():.3f} +/- {bnb_scores.std():.3f}"</span>)

<span class="cm"># Compare to MultinomialNB on counts (binary=False)</span>
vec_cnt = <span class="fn">CountVectorizer</span>(stop_words=<span class="str">"english"</span>, min_df=<span class="num">2</span>)
X_cnt = vec_cnt.<span class="fn">fit_transform</span>(df[<span class="str">"text"</span>])
mnb_scores = <span class="fn">cross_val_score</span>(<span class="fn">MultinomialNB</span>(alpha=<span class="num">1.0</span>), X_cnt, y, cv=<span class="num">5</span>)
<span class="fn">print</span>(f<span class="str">"MultinomialNB 5-fold: {mnb_scores.mean():.3f} +/- {mnb_scores.std():.3f}"</span>)

<span class="cm"># On short text (tweets), BernoulliNB usually wins by 1-3 percentage points</span></code></pre></div>

<p class="l-text">The trick is <code>binary=True</code> on the vectorizer: this collapses all word counts to 0/1 indicators, matching what BernoulliNB expects. On short documents (tweets average ~12 words), most words appear at most once anyway, so the count-vs-presence distinction matters less; but the Bernoulli model also explicitly captures word <em>absence</em>, which carries information that Multinomial ignores. On real benchmarks like the SMS Spam Collection, BernoulliNB often beats MultinomialNB by 1-3 points.</p>

<div class="calc-example"><div class="example-label">RULE OF THUMB</div><div class="example-body">Long documents (news articles, papers, blog posts) — use <strong>MultinomialNB</strong> with raw counts or TF-IDF. Short documents (tweets, SMS, titles, queries) — try <strong>BernoulliNB</strong> first. Imbalanced classes — use <strong>ComplementNB</strong>. Continuous numeric features — use <strong>GaussianNB</strong>. These four cover 99% of NB use cases.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Tuning the Smoothing Parameter <code>alpha</code></h2>

<p class="l-text">All NB variants except GaussianNB have one hyperparameter: the Laplace smoothing strength <code>alpha</code>. Sklearn's default is 1.0 (classic Laplace), which is a sane starting point but rarely the optimum on real data. Tune it with <code>GridSearchCV</code>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/tweets.csv"</span>)
X, y = df[<span class="str">"text"</span>], df[<span class="str">"label"</span>]

pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(stop_words=<span class="str">"english"</span>)),
    (<span class="str">"nb"</span>, <span class="fn">MultinomialNB</span>())
])

<span class="cm"># Tune alpha and a couple of TF-IDF knobs together</span>
param_grid = {
    <span class="str">"tfidf__ngram_range"</span>: [(<span class="num">1</span>, <span class="num">1</span>), (<span class="num">1</span>, <span class="num">2</span>)],
    <span class="str">"tfidf__min_df"</span>: [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>],
    <span class="str">"nb__alpha"</span>: [<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">2.0</span>]
}

grid = <span class="fn">GridSearchCV</span>(pipe, param_grid, cv=<span class="num">5</span>, scoring=<span class="str">"accuracy"</span>, n_jobs=-<span class="num">1</span>)
grid.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(f<span class="str">"Best params: {grid.best_params_}"</span>)
<span class="fn">print</span>(f<span class="str">"Best CV accuracy: {grid.best_score_:.3f}"</span>)

<span class="cm"># Inspect the alpha sweep with other params fixed</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
results = pd.<span class="fn">DataFrame</span>(grid.cv_results_)
<span class="cm"># Show how mean test accuracy varies with alpha</span>
alpha_summary = results.<span class="fn">groupby</span>(<span class="str">"param_nb__alpha"</span>)[<span class="str">"mean_test_score"</span>].<span class="fn">max</span>()
<span class="fn">print</span>(alpha_summary)</code></pre></div>

<p class="l-text">A few things to notice. First, the pipeline encapsulates both vectorizer and classifier — GridSearchCV will re-fit the vectorizer inside each CV fold, avoiding the classic data-leakage bug where you fit the vectorizer once on the full dataset. Second, the grid includes <code>ngram_range</code> and <code>min_df</code> because the smoothing optimum depends on the vocabulary size — bigger vocabularies tend to want larger <code>alpha</code>. Third, in real text data the optimal <code>alpha</code> is usually 0.01-0.5, not 1.0; the default is too aggressive when you have plenty of documents.</p>

<div class="calc-step"><strong>Always Pipeline:</strong> never fit the vectorizer outside the cross-validation loop. The vocabulary itself is a learned parameter — if you fit it on test documents, you have leaked the test set. Pipeline + GridSearchCV solves this for free.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. End-to-End: 20 Newsgroups in 30 Lines</h2>

<p class="l-text">The 20 Newsgroups dataset (~20,000 documents across 20 topics) is the classic benchmark for text classification. Let's build a full pipeline — TfidfVectorizer + MultinomialNB — and reach competitive accuracy with minimal code.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_20newsgroups
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB, ComplementNB
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, confusion_matrix
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Pick 4 topics to keep things readable; remove email headers and footers</span>
cats = [<span class="str">"alt.atheism"</span>, <span class="str">"soc.religion.christian"</span>,
        <span class="str">"comp.graphics"</span>, <span class="str">"sci.med"</span>]
train = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">"train"</span>, categories=cats,
                            remove=(<span class="str">"headers"</span>, <span class="str">"footers"</span>, <span class="str">"quotes"</span>),
                            random_state=<span class="num">42</span>)
test = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">"test"</span>, categories=cats,
                            remove=(<span class="str">"headers"</span>, <span class="str">"footers"</span>, <span class="str">"quotes"</span>),
                            random_state=<span class="num">42</span>)
<span class="fn">print</span>(f<span class="str">"Train: {len(train.data)} docs, Test: {len(test.data)} docs"</span>)

<span class="cm"># Pipeline: TF-IDF + MultinomialNB</span>
pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(stop_words=<span class="str">"english"</span>,
                              ngram_range=(<span class="num">1</span>, <span class="num">2</span>),
                              min_df=<span class="num">3</span>, max_df=<span class="num">0.95</span>,
                              sublinear_tf=<span class="ty">True</span>)),
    (<span class="str">"nb"</span>,    <span class="fn">MultinomialNB</span>(alpha=<span class="num">0.1</span>))
])

pipe.<span class="fn">fit</span>(train.data, train.target)
pred = pipe.<span class="fn">predict</span>(test.data)

<span class="fn">print</span>(<span class="fn">classification_report</span>(test.target, pred, target_names=test.target_names))

<span class="cm"># Top words per class</span>
vec = pipe.named_steps[<span class="str">"tfidf"</span>]
nb = pipe.named_steps[<span class="str">"nb"</span>]
names = np.<span class="fn">array</span>(vec.<span class="fn">get_feature_names_out</span>())
<span class="kw">for</span> i, c <span class="kw">in</span> <span class="fn">enumerate</span>(train.target_names):
    top = np.<span class="fn">argsort</span>(nb.feature_log_prob_[i])[-<span class="num">8</span>:][::-<span class="num">1</span>]
    <span class="fn">print</span>(f<span class="str">"{c}: {names[top].tolist()}"</span>)

<span class="cm"># Try ComplementNB as well — designed for imbalanced text</span>
pipe2 = <span class="fn">Pipeline</span>([
    (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(stop_words=<span class="str">"english"</span>, ngram_range=(<span class="num">1</span>, <span class="num">2</span>),
                              min_df=<span class="num">3</span>, sublinear_tf=<span class="ty">True</span>)),
    (<span class="str">"nb"</span>,    <span class="fn">ComplementNB</span>(alpha=<span class="num">0.1</span>))
])
pipe2.<span class="fn">fit</span>(train.data, train.target)
<span class="fn">print</span>(f<span class="str">"ComplementNB accuracy: {pipe2.score(test.data, test.target):.3f}"</span>)</code></pre></div>

<p class="l-text">Three details worth knowing. The <code>remove=("headers", "footers", "quotes")</code> argument strips email metadata that would otherwise leak the topic label trivially — without it, NB hits 97% by spotting the newsgroup name in the headers. <code>sublinear_tf=True</code> replaces raw term frequencies with <code>1 + log(tf)</code>, which is closer to what NB's multinomial assumption actually wants. And the per-class top-word listing is your free interpretability: NB literally lists the words that most define each class — try this with a transformer.</p>

<div class="calc-example"><div class="example-label">EXPECTED RESULT</div><div class="example-body">On these 4 categories, MultinomialNB hits ~83-85% accuracy; ComplementNB hits ~85-87%. A LogisticRegression baseline on the same features reaches ~88-90%. A full BERT fine-tune reaches ~94%. The gap between NB and BERT is real but small — and NB trains in 2 seconds on a laptop, while BERT needs a GPU and 20 minutes. For most production text-classification problems, that trade-off favours NB.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NB vs LogisticRegression — Head to Head</h2>

<p class="l-text">The natural question after every NB section: would logistic regression do better? Let's actually measure it on identical text features.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_20newsgroups
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score
<span class="kw">import</span> time, numpy <span class="kw">as</span> np

cats = [<span class="str">"alt.atheism"</span>, <span class="str">"soc.religion.christian"</span>,
        <span class="str">"comp.graphics"</span>, <span class="str">"sci.med"</span>]
data = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">"train"</span>, categories=cats,
                           remove=(<span class="str">"headers"</span>, <span class="str">"footers"</span>, <span class="str">"quotes"</span>))
X, y = data.data, data.target

tfidf_kwargs = <span class="ty">dict</span>(stop_words=<span class="str">"english"</span>, ngram_range=(<span class="num">1</span>, <span class="num">2</span>),
                    min_df=<span class="num">3</span>, sublinear_tf=<span class="ty">True</span>)

models = {
    <span class="str">"MultinomialNB"</span>: <span class="fn">Pipeline</span>([
        (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(**tfidf_kwargs)),
        (<span class="str">"clf"</span>,   <span class="fn">MultinomialNB</span>(alpha=<span class="num">0.1</span>))
    ]),
    <span class="str">"LogReg"</span>: <span class="fn">Pipeline</span>([
        (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(**tfidf_kwargs)),
        (<span class="str">"clf"</span>,   <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>, C=<span class="num">1.0</span>))
    ])
}

<span class="kw">for</span> name, model <span class="kw">in</span> models.<span class="fn">items</span>():
    t0 = time.<span class="fn">time</span>()
    scores = <span class="fn">cross_val_score</span>(model, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"accuracy"</span>, n_jobs=-<span class="num">1</span>)
    t1 = time.<span class="fn">time</span>()
    <span class="fn">print</span>(f<span class="str">"{name:15} acc = {scores.mean():.4f} +/- {scores.std():.4f}  ({t1-t0:.1f}s)"</span>)</code></pre></div>

<p class="l-text">On this benchmark you will usually see MultinomialNB at ~89% and LogisticRegression at ~91% — a 2-point gap. But notice the timing: NB finishes 5-fold CV in 3-5 seconds; LogReg takes 15-30 seconds. The accuracy gap is real and on most production problems LogReg is the better default. But the speed gap is enormous, which is exactly why NB remains the right answer for prototyping, baselines, streaming data, and resource-constrained deployment.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Accuracy</div><div class="card-body">LogReg usually wins by 1-3 points on TF-IDF text features when data is plentiful (>5k docs).</div></div>
<div class="calc-card"><div class="card-title">Training speed</div><div class="card-body">NB is 5-10x faster on text. Counts and means vs iterative gradient descent.</div></div>
<div class="calc-card"><div class="card-title">Memory</div><div class="card-body">NB stores one float per (word, class). LogReg stores one float per word (plus iteration state during fit). Both scale gracefully.</div></div>
<div class="calc-card"><div class="card-title">Calibration</div><div class="card-body">LogReg gives well-calibrated probabilities. NB gives sharp 0/1 probabilities that need Platt scaling for downstream decisioning.</div></div>
<div class="calc-card"><div class="card-title">Streaming</div><div class="card-body">NB supports <code>partial_fit</code> natively. LogReg requires SGDClassifier as a stand-in.</div></div>
<div class="calc-card"><div class="card-title">Multiclass</div><div class="card-body">NB is natively multiclass (one Bayes computation per class). LogReg uses one-vs-rest or multinomial softmax — also fine.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. When to Reach for NB in 2026</h2>

<p class="l-text">Concrete answer: most real text-classification problems start with a TfidfVectorizer + MultinomialNB pipeline. It is the five-minute solution that establishes a baseline, reveals the most informative words, and tells you whether the problem is actually hard or trivially solvable. Then, and only then, decide whether to escalate to LogisticRegression, gradient boosting on n-gram features, or transformers.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Streaming use case: partial_fit for online learning</span>
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> HashingVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># HashingVectorizer is fixed-size and stateless — perfect for streaming</span>
vec = <span class="fn">HashingVectorizer</span>(n_features=<span class="num">2</span>**<span class="num">18</span>, alternate_sign=<span class="ty">False</span>)
nb = <span class="fn">MultinomialNB</span>(alpha=<span class="num">0.5</span>)

<span class="cm"># Pretend documents arrive in mini-batches over time</span>
all_classes = np.<span class="fn">array</span>([<span class="num">0</span>, <span class="num">1</span>])   <span class="cm"># tell NB all possible labels upfront</span>

<span class="kw">def</span> <span class="fn">stream_batch</span>():
    <span class="cm"># In production, this reads from Kafka / a log file / an API</span>
    <span class="kw">yield</span> ([<span class="str">"win money fast click here"</span>], [<span class="num">1</span>])
    <span class="kw">yield</span> ([<span class="str">"meeting tomorrow at three"</span>], [<span class="num">0</span>])
    <span class="kw">yield</span> ([<span class="str">"free crypto signal"</span>], [<span class="num">1</span>])
    <span class="kw">yield</span> ([<span class="str">"project deadline this friday"</span>], [<span class="num">0</span>])

<span class="kw">for</span> texts, labels <span class="kw">in</span> <span class="fn">stream_batch</span>():
    X_batch = vec.<span class="fn">transform</span>(texts)
    nb.<span class="fn">partial_fit</span>(X_batch, labels, classes=all_classes)

<span class="cm"># Predict on fresh text — model has been updated incrementally, no full retrain</span>
new_text = [<span class="str">"urgent money transfer"</span>]
<span class="fn">print</span>(f<span class="str">"P(spam): {nb.predict_proba(vec.transform(new_text))[0, 1]:.3f}"</span>)</code></pre></div>

<p class="l-text">The <code>partial_fit</code> + <code>HashingVectorizer</code> combination is the streaming pattern: HashingVectorizer maps words to a fixed-size feature space deterministically without storing a vocabulary, and <code>partial_fit</code> updates NB's counts incrementally. You can train on a billion documents this way without ever loading them all into memory — a property no transformer can match.</p>

<div class="think-box"><div class="think-label">WHEN TO PICK NB IN 2026</div><div class="think-body"><strong>1. First baseline on any text problem.</strong> 5 minutes to a working classifier. If NB hits 90%+ you may not need anything else.<br><strong>2. Small data.</strong> Under 1000 documents, NB usually beats transformers and matches LogReg.<br><strong>3. Streaming or online learning.</strong> <code>partial_fit</code> + HashingVectorizer is unbeaten for high-velocity data.<br><strong>4. Edge deployment.</strong> Mobile, browser, microcontroller — NB fits in a few KB and predicts in microseconds.<br><strong>5. Explainability.</strong> Per-class top-word lists are free interpretability the regulator can read.<br><strong>6. Spam, content moderation, language ID.</strong> These domains still ship NB classifiers in production at scale.<br><strong>Do NOT pick NB</strong> when: classes are highly imbalanced (use ComplementNB or move to LogReg), features are strongly dependent (NB will be overconfident), you need calibrated probabilities (apply Platt scaling on top), or you have 100k+ documents and a few extra hours to train a transformer for the last 5% accuracy.</div></div>

<p class="l-text">After 11 lessons of sklearn — preprocessing, classification, regression, ensembles, dimensionality reduction, model selection, and now Naive Bayes — you have the complete classical-ML toolkit. The pipeline pattern is always the same: load, split, vectorize/scale, fit, cross-validate, tune, evaluate, save. Apply it on real text data, report the metrics, ship the model. NB is often the first and sometimes the only algorithm you will need.</p>
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
  var el = document.getElementById('plot-skl10-nb-en');
  if (el){
    var xs=[]; for (var i=0;i<=70;i++) xs.push(i/10);
    function gauss(x,mu,s){return Math.exp(-Math.pow(x-mu,2)/(2*s*s))/(s*Math.sqrt(2*Math.PI));}
    var y_set = xs.map(function(x){return gauss(x,1.46,0.17);});
    var y_ver = xs.map(function(x){return gauss(x,4.26,0.47);});
    var y_vir = xs.map(function(x){return gauss(x,5.55,0.55);});
    var t1 = {x:xs,y:y_set,type:'scatter',mode:'lines',fill:'tozeroy',name:'setosa',line:{color:T.accent,width:2.5},fillcolor:'rgba(200,169,110,0.22)'};
    var t2 = {x:xs,y:y_ver,type:'scatter',mode:'lines',fill:'tozeroy',name:'versicolor',line:{color:'#4ecdc4',width:2.5},fillcolor:'rgba(78,205,196,0.22)'};
    var t3 = {x:xs,y:y_vir,type:'scatter',mode:'lines',fill:'tozeroy',name:'virginica',line:{color:'#f87171',width:2.5},fillcolor:'rgba(248,113,113,0.22)'};
    var layout = {title:{text:'GaussianNB on iris: class-conditional densities of petal length',font:{color:T.text,size:14}},xaxis:{title:'Petal length (cm)',color:T.text,gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'P(petal length | class)',color:T.text,gridcolor:T.grid,zerolinecolor:T.zero},paper_bgcolor:T.bg,plot_bgcolor:T.bg,font:{color:T.text},margin:{t:60,r:30,b:50,l:60},legend:{font:{color:T.text}}};
    Plotly.newPlot('plot-skl10-nb-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`,

tr: `<p class="l-text"><strong>Naive Bayes, beş dakikada çalışan bir metin sınıflandırıcı ihtiyacın olduğunda elini uzattığın algoritmadır.</strong> Hızlıdır, yorumlanabilirdir, binlerce özelliği zarafetle kaldırır ve metin verisinde daha gösterişli modelleri çoğu zaman yenecek kadar iyi sonuç vermeye devam eder — bu yüzden hâlâ yenilemeyen baseline\'dır. <a href="/tutorials/ml-theory/13">ML Theory Ders 13</a>\'te matematiğini kurduk (Bayes kuralı, bağımsızlık varsayımı, Laplace düzleştirmesi, log-uzayında hesap). Şimdi sklearn ile uygulamaya geçiyoruz.</p>

<p class="l-text">Bu derste dört sklearn NB varyantını gerçek veri setlerinde kullanacağız, üretim metin sınıflandırması için MultinomialNB\'yi TF-IDF ile eşleştireceğiz, smoothing parametresi <code>alpha</code>\'yı GridSearchCV ile ayarlayacağız ve aynı veride LogisticRegression ile baş başa kıyaslama yapacağız ki hangisinin ne zaman kazandığını gözlerinle göresin. Sonunda Naive Bayes\'in 2026\'da senin alet kutundaki yerini — ve yer almadığı durumları — net şekilde bileceksin.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Dört sklearn NB varyantını (Multinomial, Gaussian, Bernoulli, Complement) uygulayacaksın</li><li>MultinomialNB\'yi CountVectorizer ve TfidfVectorizer ile metin sınıflandırmaya bağlayacaksın</li><li>GridSearchCV ile <code>alpha</code> smoothing parametresini ayarlayacaksın</li><li>20 Newsgroups sınıflandırıcısını 30 satırın altında kuracaksın</li><li>NB\'yi aynı metin verisi üzerinde LogisticRegression ile kıyaslayacaksın</li><li>Streaming ve online güncelleme için <code>partial_fit</code> kullanacaksın</li><li>2026\'da NB\'nin doğru araç olduğu — ve olmadığı — durumları ayırt edebileceksin</li></ul></div>

<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Tekrar ve Kurulum</h2>

<p class="l-text">Tek paragraflık tazeleme: Naive Bayes <em>P(sınıf | özellikler) ∝ P(sınıf) · ∏ P(özellikᵢ | sınıf)</em> hesaplar — özelliklerin sınıf verildiğinde birbirinden bağımsız olduğu varsayımıyla. Bu varsayım pratikte çoğu zaman yanlış olsa da, algoritma metin sınıflandırmaya hâkimdir; çünkü yüksek boyutlu kelime-torbası özellikleri bağımsızlığın faydalı bir yaklaşıklık olmasına yetecek kadar düzgün davranır. Detaylı teori için <a href="/tutorials/ml-theory/13">ML Theory Ders 13</a>.</p>

<p class="l-text">sklearn\'de Naive Bayes <code>sklearn.naive_bayes</code> modülünde yaşar. Dört varyant aynı fit/predict/predict_proba arayüzünü paylaşır — varyant değiştirmek tek satırlık bir iş.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">MultinomialNB</div><div class="card-body">Sayım özellikleri. CountVectorizer / TfidfVectorizer ile metin için varsayılan. Pratikte en yaygın varyant.</div></div>
<div class="calc-card"><div class="card-title">GaussianNB</div><div class="card-body">Sürekli sayısal özellikler. Ayarlanacak hiperparametre yok. Iris, breast cancer, sensör verisinde işe yarar.</div></div>
<div class="calc-card"><div class="card-title">BernoulliNB</div><div class="card-body">İkili özellikler. Kelimenin varlığı (frekansı değil). Kısa metinlerde (tweet, başlık) genelde MultinomialNB\'den iyi.</div></div>
<div class="calc-card"><div class="card-title">ComplementNB</div><div class="card-body">Dengesiz veri için Multinomial varyantı. Sınıf dağılımı çarpıksa (örn. %95 ham, %5 spam) bunu seç.</div></div>
<div class="calc-card"><div class="card-title">CategoricalNB</div><div class="card-body">Nominal kategorik özellikler (şehir, meslek). Daha az kullanılır — tablo verisinde çoğu pipeline ağaç modelleri tercih eder.</div></div>
<div class="calc-card"><div class="card-title">Ortak API</div><div class="card-body">Dördü de <code>fit</code>, <code>predict</code>, <code>predict_proba</code>, <code>predict_log_proba</code>, <code>score</code> ve streaming için <code>partial_fit</code> sağlar.</div></div>
</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Metinde MultinomialNB — Asıl İş</h2>

<p class="l-text">En çok işe yarayan NB iş akışı: ham metni seyrek sayım matrisine çeviren bir vektörleştiriciyle MultinomialNB\'yi eşleştir, sonra fit et. Bu sitede gelen <code>tweets.csv</code> veri setiyle bir tweet duygu sınıflandırıcısı kuralım.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> pandas <span class="kw">as</span> pd
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> CountVectorizer, TfidfVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> accuracy_score, classification_report

<span class="cm"># Bu tutorial sitesiyle gelen 300 tweet\\'lik duygu veri seti</span>
df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/tweets.csv"</span>)
<span class="fn">print</span>(df.<span class="fn">head</span>())
<span class="fn">print</span>(df[<span class="str">"label"</span>].<span class="fn">value_counts</span>())

X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    df[<span class="str">"text"</span>], df[<span class="str">"label"</span>],
    test_size=<span class="num">0.25</span>, random_state=<span class="num">42</span>, stratify=df[<span class="str">"label"</span>]
)

<span class="cm"># Adim 1: metni seyrek sayim matrisine cevir</span>
vec = <span class="fn">CountVectorizer</span>(lowercase=<span class="ty">True</span>, stop_words=<span class="str">"english"</span>, min_df=<span class="num">2</span>)
Xtr = vec.<span class="fn">fit_transform</span>(X_train)   <span class="cm"># seyrek, sekil (n_train, vocab_size)</span>
Xte = vec.<span class="fn">transform</span>(X_test)
<span class="fn">print</span>(f<span class="str">"Sozluk boyu: {len(vec.vocabulary_)}"</span>)
<span class="fn">print</span>(f<span class="str">"Egitim matrisi: {Xtr.shape}, seyreklik: {1 - Xtr.nnz / (Xtr.shape[0] * Xtr.shape[1]):.4f}"</span>)

<span class="cm"># Adim 2: MultinomialNB fit et</span>
nb = <span class="fn">MultinomialNB</span>(alpha=<span class="num">1.0</span>)   <span class="cm"># alpha = Laplace duzlestirmesi</span>
nb.<span class="fn">fit</span>(Xtr, y_train)

<span class="cm"># Adim 3: tahmin et ve degerlendir</span>
pred = nb.<span class="fn">predict</span>(Xte)
<span class="fn">print</span>(f<span class="str">"Dogruluk: {accuracy_score(y_test, pred):.3f}"</span>)
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_test, pred))

<span class="cm"># Incele: her sinifa en cok hangi kelimeler isaret ediyor?</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
feature_names = np.<span class="fn">array</span>(vec.<span class="fn">get_feature_names_out</span>())
<span class="kw">for</span> class_idx, class_name <span class="kw">in</span> <span class="fn">enumerate</span>(nb.classes_):
    top = np.<span class="fn">argsort</span>(nb.feature_log_prob_[class_idx])[-<span class="num">10</span>:][::-<span class="num">1</span>]
    <span class="fn">print</span>(f<span class="str">"'{class_name}' icin en bilgilendirici 10 kelime: {feature_names[top].tolist()}"</span>)</code></pre></div>

<p class="l-text">Tüm pipeline üç çağrıdan ibaret: vektörleştir, fit et, tahmin et. <code>CountVectorizer</code> küçük harfle tokenize eder, İngilizce stop word\'leri atar ve 2\'den az dokümanda geçen kelimeleri görmezden gelir (<code>min_df=2</code>) — gürültüyü azaltır. <code>MultinomialNB(alpha=1.0)</code> klasik Laplace ile sklearn varsayılanıdır. <code>feature_log_prob_</code> her kelime için log P(kelime | sınıf) saklar — bunu sıraladığında her sınıfa en çok işaret eden kelimeleri görürsün. Bu, NB\'nin kendi tahminlerini açıklama biçimidir.</p>

<div class="l-warn"><strong>Seyrek matris:</strong> MultinomialNB\'ye vectorizer\'in CSR çıktısını doğrudan ver. <code>.toarray()</code> çağırmak bellek israfıdır — 20 bin dokümanlık × 50 bin kelimelik bir sayım matrisi yoğun olarak 4 GB iken seyrek olarak yalnızca ~50 MB. sklearn seyrek girdiyi yerel olarak yer.</div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Sürekli Özelliklerde GaussianNB</h2>

<p class="l-text">Özellikler sayım değil sürekli sayıysa <code>GaussianNB</code>\'ye geç. Her (sınıf, özellik) için bir Gauss uydurur ve hiçbir smoothing hiperparametresi yoktur — ayarlanacak hiçbir şey yok. Iris veri seti kanonik demodur.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> GaussianNB
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score, train_test_split
<span class="kw">import</span> numpy <span class="kw">as</span> np

iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(
    X, y, test_size=<span class="num">0.3</span>, random_state=<span class="num">42</span>, stratify=y
)

gnb = <span class="fn">GaussianNB</span>()
gnb.<span class="fn">fit</span>(X_train, y_train)
<span class="fn">print</span>(f<span class="str">"Test dogrulugu: {gnb.score(X_test, y_test):.3f}"</span>)

<span class="cm"># Cross-validation ile teyit</span>
scores = <span class="fn">cross_val_score</span>(<span class="fn">GaussianNB</span>(), X, y, cv=<span class="num">5</span>)
<span class="fn">print</span>(f<span class="str">"5-fold CV dogrulugu: {scores.mean():.3f} +/- {scores.std():.3f}"</span>)

<span class="cm"># Ogrenilen Gauss parametrelerini incele</span>
<span class="kw">for</span> i, name <span class="kw">in</span> <span class="fn">enumerate</span>(iris.target_names):
    <span class="fn">print</span>(f<span class="str">"\\nSinif {name}:"</span>)
    <span class="kw">for</span> j, feat <span class="kw">in</span> <span class="fn">enumerate</span>(iris.feature_names):
        <span class="fn">print</span>(f<span class="str">"  {feat}: mu={gnb.theta_[i, j]:.2f}, sigma2={gnb.var_[i, j]:.3f}"</span>)

<span class="cm"># Olasilikci tahmin</span>
sample = X_test[:<span class="num">3</span>]
proba = gnb.<span class="fn">predict_proba</span>(sample)
<span class="fn">print</span>(<span class="str">"Ilk 3 test ornegi icin P(sinif | x):"</span>)
<span class="fn">print</span>(proba.<span class="fn">round</span>(<span class="num">3</span>))</code></pre></div>

<p class="l-text">GaussianNB iris\'te sıfır tuning ile ~%95 doğruluk verir — petal uzunluk/genişlik özelliklerinin üç türü ne kadar iyi ayırdığının kanıtı. <code>theta_</code> her (sınıf, özellik) için ortalamayı, <code>var_</code> varyansı saklar; teori dersinde maximum likelihood\'dan türettiğimiz formüllerle aynı. Aşağıdaki grafiğin gösterdiği Gauss yoğunlukları, petal uzunluğu gibi tek bir özelliğin neden başlı başına türleri ayırmaya neredeyse yettiğini netçe açıklar.</p>

<div id="plot-skl10-nb-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Bu grafik niye önemli:</strong> GaussianNB\'nin iris petal uzunluğu için her tür için öğrendiği sınıf-koşullu Gauss yoğunluklarını gösterir. Setosa küçük değerlerde (ortalama ~1.5 cm), versicolor ortada (~4.3 cm), virginica üstte (~5.5 cm). Tahmin zamanında yeni bir petal uzunluk için GaussianNB üç eğrinin yüksekliğini okur ve en büyük olanı seçer. Eğrilerin kesişme noktaları karar eşikleridir. Eğrilerin neredeyse hiç örtüşmemesi tam olarak iris\'in NB başarı hikâyesi olmasının sebebidir — özellikler bu kadar bilgilendirici olduğunda bağımsızlık varsayımı pek de önemli değil.</div>

<div class="calc-step"><strong>Tuzak — varyans düzleştirmesi:</strong> bir sınıfın bir özellikteki varyansı sıfırsa (eğitimde sabit değer), Gauss yoğunluğu patlar. sklearn varsayılan olarak <code>var_smoothing=1e-9</code> ekler. GaussianNB NaN tahmini dönüyorsa <code>var_smoothing</code>\'ı 1e-6 veya üstüne çek.</div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. İkili Özelliklerde BernoulliNB</h2>

<p class="l-text">Kelimenin dokümanda sadece <em>var/yok</em> olduğuyla ilgileniyorsan (kaç kez geçtiğiyle değil) BernoulliNB kullan. Her özelliği sınıf koşulluk altında bir Bernoulli rastgele değişkeni olarak modeller. Kısa metinler için (tweet, başlık, SMS) çoğu zaman doğru tercihtir — kısa dokümanda sayımlar zaten çoğunlukla 0 veya 1\'dir ve yokluğu açıkça modellemek BernoulliNB\'ye ekstra sinyal verir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> CountVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> BernoulliNB, MultinomialNB
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/tweets.csv"</span>)

<span class="cm"># Onemli bayrak: binary=True sayimlari 0/1 var/yok gostergesine cevirir</span>
vec = <span class="fn">CountVectorizer</span>(binary=<span class="ty">True</span>, stop_words=<span class="str">"english"</span>, min_df=<span class="num">2</span>)
X = vec.<span class="fn">fit_transform</span>(df[<span class="str">"text"</span>])
y = df[<span class="str">"label"</span>]

<span class="cm"># BernoulliNB\\'nin ayrica bir binarize esigi vardir (varsayilan 0.0)</span>
bnb = <span class="fn">BernoulliNB</span>(alpha=<span class="num">1.0</span>)
bnb_scores = <span class="fn">cross_val_score</span>(bnb, X, y, cv=<span class="num">5</span>)
<span class="fn">print</span>(f<span class="str">"BernoulliNB 5-fold: {bnb_scores.mean():.3f} +/- {bnb_scores.std():.3f}"</span>)

<span class="cm"># Sayim ozellikleriyle MultinomialNB ile kiyasla (binary=False)</span>
vec_cnt = <span class="fn">CountVectorizer</span>(stop_words=<span class="str">"english"</span>, min_df=<span class="num">2</span>)
X_cnt = vec_cnt.<span class="fn">fit_transform</span>(df[<span class="str">"text"</span>])
mnb_scores = <span class="fn">cross_val_score</span>(<span class="fn">MultinomialNB</span>(alpha=<span class="num">1.0</span>), X_cnt, y, cv=<span class="num">5</span>)
<span class="fn">print</span>(f<span class="str">"MultinomialNB 5-fold: {mnb_scores.mean():.3f} +/- {mnb_scores.std():.3f}"</span>)

<span class="cm"># Kisa metinlerde (tweetler), BernoulliNB genelde 1-3 puan onde olur</span></code></pre></div>

<p class="l-text">Anahtar nokta vectorizer\'da <code>binary=True</code>: bu, tüm kelime sayımlarını 0/1 göstergesine çevirir — tam BernoulliNB\'nin beklediği biçim. Kısa dokümanlarda (tweetler ortalama ~12 kelime) çoğu kelime zaten en fazla bir kez geçer; sayım-vs-varlık ayrımı bu yüzden azdır. Ama Bernoulli modeli kelime <em>yokluğunu</em> da açıkça yakalar — Multinomial\'in görmezden geldiği bir bilgi. SMS Spam Collection gibi gerçek karşılaştırmalarda BernoulliNB genelde MultinomialNB\'yi 1-3 puan farkla geçer.</p>

<div class="calc-example"><div class="example-label">PARMAK HESABI</div><div class="example-body">Uzun dokümanlar (haberler, makaleler, blog yazıları) — ham sayım veya TF-IDF ile <strong>MultinomialNB</strong>. Kısa dokümanlar (tweet, SMS, başlık, sorgu) — önce <strong>BernoulliNB</strong> dene. Dengesiz sınıflar — <strong>ComplementNB</strong>. Sürekli sayısal özellikler — <strong>GaussianNB</strong>. Bu dördü NB kullanım durumlarının %99\'unu kapsar.</div></div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Smoothing Parametresi <code>alpha</code> Ayarı</h2>

<p class="l-text">GaussianNB hariç tüm NB varyantlarının tek bir hiperparametresi vardır: Laplace smoothing yoğunluğu <code>alpha</code>. sklearn varsayılanı 1.0\'dır (klasik Laplace) — makul bir başlangıç noktası ama gerçek veride nadiren optimum. <code>GridSearchCV</code> ile ayarla.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> GridSearchCV
<span class="kw">import</span> pandas <span class="kw">as</span> pd

df = pd.<span class="fn">read_csv</span>(<span class="str">"/data/tweets.csv"</span>)
X, y = df[<span class="str">"text"</span>], df[<span class="str">"label"</span>]

pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(stop_words=<span class="str">"english"</span>)),
    (<span class="str">"nb"</span>, <span class="fn">MultinomialNB</span>())
])

<span class="cm"># alpha\\'yi ve birkac TF-IDF dugmesini birlikte ayarla</span>
param_grid = {
    <span class="str">"tfidf__ngram_range"</span>: [(<span class="num">1</span>, <span class="num">1</span>), (<span class="num">1</span>, <span class="num">2</span>)],
    <span class="str">"tfidf__min_df"</span>: [<span class="num">1</span>, <span class="num">2</span>, <span class="num">3</span>],
    <span class="str">"nb__alpha"</span>: [<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">0.5</span>, <span class="num">1.0</span>, <span class="num">2.0</span>]
}

grid = <span class="fn">GridSearchCV</span>(pipe, param_grid, cv=<span class="num">5</span>, scoring=<span class="str">"accuracy"</span>, n_jobs=-<span class="num">1</span>)
grid.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(f<span class="str">"En iyi parametreler: {grid.best_params_}"</span>)
<span class="fn">print</span>(f<span class="str">"En iyi CV dogrulugu: {grid.best_score_:.3f}"</span>)

<span class="cm"># alpha taramasini diger parametreler sabitken incele</span>
<span class="kw">import</span> numpy <span class="kw">as</span> np
results = pd.<span class="fn">DataFrame</span>(grid.cv_results_)
alpha_summary = results.<span class="fn">groupby</span>(<span class="str">"param_nb__alpha"</span>)[<span class="str">"mean_test_score"</span>].<span class="fn">max</span>()
<span class="fn">print</span>(alpha_summary)</code></pre></div>

<p class="l-text">Birkaç noktanın altını çizmek gerekir. İlki, Pipeline vektörleştirici ve sınıflandırıcıyı tek nesnede toplar — GridSearchCV her CV fold içinde vektörleştiriciyi yeniden fit eder; böylece klasik "vektörleştiriciyi tüm veride bir kere fit ettin → test seti sızdı" hatasından korur. İkincisi, grid\'e <code>ngram_range</code> ve <code>min_df</code>\'i de koyduk çünkü smoothing optimumu sözlük boyutuna bağlı — büyük sözlükler genelde daha büyük <code>alpha</code> ister. Üçüncüsü, gerçek metin verisinde optimal <code>alpha</code> çoğu zaman 1.0 değil 0.01-0.5 arasıdır; varsayılan değer bol doküman olduğunda aşırı agresif kalır.</p>

<div class="calc-step"><strong>Daima Pipeline:</strong> vektörleştiriciyi asla cross-validation döngüsünün dışında fit etme. Sözlüğün kendisi öğrenilmiş bir parametredir — onu test dokümanlarında fit edersen test setini sızdırmış olursun. Pipeline + GridSearchCV bunu otomatik çözer.</div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Uçtan Uca: 20 Newsgroups 30 Satırda</h2>

<p class="l-text">20 Newsgroups veri seti (~20.000 doküman, 20 konu) metin sınıflandırmanın klasik benchmark\'ıdır. TfidfVectorizer + MultinomialNB pipeline\'ı ile minimum kodla rekabetçi doğruluk yakalayalım.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_20newsgroups
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB, ComplementNB
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, confusion_matrix
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># Okunabilir tutmak icin 4 konu sec; email basliklarini ve altyazilari ayikla</span>
cats = [<span class="str">"alt.atheism"</span>, <span class="str">"soc.religion.christian"</span>,
        <span class="str">"comp.graphics"</span>, <span class="str">"sci.med"</span>]
train = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">"train"</span>, categories=cats,
                            remove=(<span class="str">"headers"</span>, <span class="str">"footers"</span>, <span class="str">"quotes"</span>),
                            random_state=<span class="num">42</span>)
test = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">"test"</span>, categories=cats,
                            remove=(<span class="str">"headers"</span>, <span class="str">"footers"</span>, <span class="str">"quotes"</span>),
                            random_state=<span class="num">42</span>)
<span class="fn">print</span>(f<span class="str">"Egitim: {len(train.data)} dokuman, Test: {len(test.data)} dokuman"</span>)

<span class="cm"># Pipeline: TF-IDF + MultinomialNB</span>
pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(stop_words=<span class="str">"english"</span>,
                              ngram_range=(<span class="num">1</span>, <span class="num">2</span>),
                              min_df=<span class="num">3</span>, max_df=<span class="num">0.95</span>,
                              sublinear_tf=<span class="ty">True</span>)),
    (<span class="str">"nb"</span>,    <span class="fn">MultinomialNB</span>(alpha=<span class="num">0.1</span>))
])

pipe.<span class="fn">fit</span>(train.data, train.target)
pred = pipe.<span class="fn">predict</span>(test.data)

<span class="fn">print</span>(<span class="fn">classification_report</span>(test.target, pred, target_names=test.target_names))

<span class="cm"># Her sinifin en bilgilendirici kelimeleri</span>
vec = pipe.named_steps[<span class="str">"tfidf"</span>]
nb = pipe.named_steps[<span class="str">"nb"</span>]
names = np.<span class="fn">array</span>(vec.<span class="fn">get_feature_names_out</span>())
<span class="kw">for</span> i, c <span class="kw">in</span> <span class="fn">enumerate</span>(train.target_names):
    top = np.<span class="fn">argsort</span>(nb.feature_log_prob_[i])[-<span class="num">8</span>:][::-<span class="num">1</span>]
    <span class="fn">print</span>(f<span class="str">"{c}: {names[top].tolist()}"</span>)

<span class="cm"># ComplementNB\\'yi de dene — dengesiz metne ozel</span>
pipe2 = <span class="fn">Pipeline</span>([
    (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(stop_words=<span class="str">"english"</span>, ngram_range=(<span class="num">1</span>, <span class="num">2</span>),
                              min_df=<span class="num">3</span>, sublinear_tf=<span class="ty">True</span>)),
    (<span class="str">"nb"</span>,    <span class="fn">ComplementNB</span>(alpha=<span class="num">0.1</span>))
])
pipe2.<span class="fn">fit</span>(train.data, train.target)
<span class="fn">print</span>(f<span class="str">"ComplementNB dogrulugu: {pipe2.score(test.data, test.target):.3f}"</span>)</code></pre></div>

<p class="l-text">Bilinmesi gereken üç incelik var. <code>remove=("headers", "footers", "quotes")</code> argümanı email meta verilerini siler — bunlar konuyu açıkça sızdırır; çıkarmazsan NB başlıklardaki newsgroup adını okuyarak %97\'ye fırlayıp asıl problemi çözmemiş olur. <code>sublinear_tf=True</code> ham terim frekanslarını <code>1 + log(tf)</code> ile değiştirir — NB\'nin multinomial varsayımına çok daha yakın. Ve sınıf-başına en bilgilendirici kelime listesi ücretsiz yorumlanabilirliktir: NB tam anlamıyla her sınıfı tanımlayan kelimeleri sıralar — bunu bir transformer ile yapmayı dene.</p>

<div class="calc-example"><div class="example-label">BEKLENEN SONUÇ</div><div class="example-body">Bu 4 kategoride MultinomialNB ~%83-85 doğruluk verir; ComplementNB ~%85-87. Aynı özelliklerde LogisticRegression baseline\'ı ~%88-90\'a ulaşır. Tam bir BERT fine-tune ~%94. NB ile BERT arası fark gerçek ama küçük — ve NB bir dizüstünde 2 saniyede eğitilir, BERT GPU ve 20 dakika ister. Çoğu üretim metin sınıflandırma probleminde bu ödünleşme NB\'yi seçtirir.</div></div>
</div>

<div class="lesson-block" id="section-7">
<h2 class="lesson-title">7. NB vs LogisticRegression — Yüz Yüze</h2>

<p class="l-text">Her NB bölümünden sonra akla gelen soru: aynı veride logistic regression daha iyi olur muydu? Aynı metin özelliklerinde ölçelim.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> fetch_20newsgroups
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> TfidfVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score
<span class="kw">import</span> time, numpy <span class="kw">as</span> np

cats = [<span class="str">"alt.atheism"</span>, <span class="str">"soc.religion.christian"</span>,
        <span class="str">"comp.graphics"</span>, <span class="str">"sci.med"</span>]
data = <span class="fn">fetch_20newsgroups</span>(subset=<span class="str">"train"</span>, categories=cats,
                           remove=(<span class="str">"headers"</span>, <span class="str">"footers"</span>, <span class="str">"quotes"</span>))
X, y = data.data, data.target

tfidf_kwargs = <span class="ty">dict</span>(stop_words=<span class="str">"english"</span>, ngram_range=(<span class="num">1</span>, <span class="num">2</span>),
                    min_df=<span class="num">3</span>, sublinear_tf=<span class="ty">True</span>)

models = {
    <span class="str">"MultinomialNB"</span>: <span class="fn">Pipeline</span>([
        (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(**tfidf_kwargs)),
        (<span class="str">"clf"</span>,   <span class="fn">MultinomialNB</span>(alpha=<span class="num">0.1</span>))
    ]),
    <span class="str">"LogReg"</span>: <span class="fn">Pipeline</span>([
        (<span class="str">"tfidf"</span>, <span class="fn">TfidfVectorizer</span>(**tfidf_kwargs)),
        (<span class="str">"clf"</span>,   <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>, C=<span class="num">1.0</span>))
    ])
}

<span class="kw">for</span> name, model <span class="kw">in</span> models.<span class="fn">items</span>():
    t0 = time.<span class="fn">time</span>()
    scores = <span class="fn">cross_val_score</span>(model, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"accuracy"</span>, n_jobs=-<span class="num">1</span>)
    t1 = time.<span class="fn">time</span>()
    <span class="fn">print</span>(f<span class="str">"{name:15} dogruluk = {scores.mean():.4f} +/- {scores.std():.4f}  ({t1-t0:.1f}s)"</span>)</code></pre></div>

<p class="l-text">Bu benchmark\'ta genelde MultinomialNB ~%89 ve LogisticRegression ~%91 görürsün — 2 puan fark. Ama zamanlamaya bak: NB 5-fold CV\'yi 3-5 saniyede bitirir; LogReg 15-30 saniye ister. Doğruluk farkı gerçek ve çoğu üretim probleminde LogReg daha iyi varsayılan. Ama hız farkı da çok büyük — bu yüzden prototipleme, baseline, streaming veri ve kısıtlı kaynaklı deployment için NB hâlâ doğru cevap.</p>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">Doğruluk</div><div class="card-body">LogReg, bol veri (>5k doküman) varken TF-IDF metinde genelde 1-3 puan önde olur.</div></div>
<div class="calc-card"><div class="card-title">Eğitim hızı</div><div class="card-body">NB metinde 5-10x daha hızlı. Sayım/ortalama vs iteratif gradyan iniş.</div></div>
<div class="calc-card"><div class="card-title">Bellek</div><div class="card-body">NB her (kelime, sınıf) için bir float saklar. LogReg her kelime için bir float (artı fit sırasında iterasyon durumu). İkisi de zarafetle ölçeklenir.</div></div>
<div class="calc-card"><div class="card-title">Kalibrasyon</div><div class="card-body">LogReg iyi kalibre edilmiş olasılık verir. NB keskin 0/1 olasılıkları üretir — gerçek karar için Platt scaling gerekir.</div></div>
<div class="calc-card"><div class="card-title">Streaming</div><div class="card-body">NB <code>partial_fit</code>\'i yerel olarak destekler. LogReg yerine SGDClassifier kullanılır.</div></div>
<div class="calc-card"><div class="card-title">Çok sınıflı</div><div class="card-body">NB doğal çok sınıflıdır (her sınıf için ayrı Bayes hesabı). LogReg one-vs-rest veya multinomial softmax — o da iyi.</div></div>
</div>
</div>

<div class="lesson-block" id="section-8">
<h2 class="lesson-title">8. 2026\'da Naive Bayes\'e Ne Zaman El Atılır</h2>

<p class="l-text">Somut cevap: çoğu gerçek metin sınıflandırma problemi TfidfVectorizer + MultinomialNB pipeline\'ı ile başlar. Beş dakikalık çözümdür — baseline kurar, en bilgilendirici kelimeleri ortaya çıkarır, problemin gerçekten zor mu yoksa basit mi çözüldüğünü söyler. Sonra ve ancak sonra LogisticRegression\'a, n-gram özellikli gradient boosting\'e veya transformer\'a yükseltme kararı verirsin.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="cm"># Streaming kullanim: online ogrenme icin partial_fit</span>
<span class="kw">from</span> sklearn.feature_extraction.text <span class="kw">import</span> HashingVectorizer
<span class="kw">from</span> sklearn.naive_bayes <span class="kw">import</span> MultinomialNB
<span class="kw">import</span> numpy <span class="kw">as</span> np

<span class="cm"># HashingVectorizer sabit boyutlu ve durumsuzdur — streaming icin mukemmel</span>
vec = <span class="fn">HashingVectorizer</span>(n_features=<span class="num">2</span>**<span class="num">18</span>, alternate_sign=<span class="ty">False</span>)
nb = <span class="fn">MultinomialNB</span>(alpha=<span class="num">0.5</span>)

<span class="cm"># Dokumanlar zaman icinde mini-batch olarak gelirmis gibi davran</span>
all_classes = np.<span class="fn">array</span>([<span class="num">0</span>, <span class="num">1</span>])   <span class="cm"># tum olasi etiketleri NB\\'ye bastan soyle</span>

<span class="kw">def</span> <span class="fn">stream_batch</span>():
    <span class="cm"># Uretimde Kafka / log dosyasi / API\\'den okur</span>
    <span class="kw">yield</span> ([<span class="str">"win money fast click here"</span>], [<span class="num">1</span>])
    <span class="kw">yield</span> ([<span class="str">"meeting tomorrow at three"</span>], [<span class="num">0</span>])
    <span class="kw">yield</span> ([<span class="str">"free crypto signal"</span>], [<span class="num">1</span>])
    <span class="kw">yield</span> ([<span class="str">"project deadline this friday"</span>], [<span class="num">0</span>])

<span class="kw">for</span> texts, labels <span class="kw">in</span> <span class="fn">stream_batch</span>():
    X_batch = vec.<span class="fn">transform</span>(texts)
    nb.<span class="fn">partial_fit</span>(X_batch, labels, classes=all_classes)

<span class="cm"># Taze metinde tahmin — model artarak guncellendi, tam yeniden egitim yok</span>
new_text = [<span class="str">"urgent money transfer"</span>]
<span class="fn">print</span>(f<span class="str">"P(spam): {nb.predict_proba(vec.transform(new_text))[0, 1]:.3f}"</span>)</code></pre></div>

<p class="l-text"><code>partial_fit</code> + <code>HashingVectorizer</code> kombinasyonu streaming kalıbıdır: HashingVectorizer kelimeleri sözlük saklamadan deterministik biçimde sabit boyutlu özellik uzayına eşler ve <code>partial_fit</code> NB\'nin sayımlarını artarak günceller. Bu şekilde milyarlarca dokümanı bellek dolu olmadan eğitebilirsin — hiçbir transformer\'ın eşleştiremediği bir özellik.</p>

<div class="think-box"><div class="think-label">2026\'DA NB\'YE NE ZAMAN EL ATILIR</div><div class="think-body"><strong>1. Her metin probleminde ilk baseline.</strong> 5 dakikada çalışan sınıflandırıcı. NB %90+ verdiyse başka bir şeye gerek olmayabilir.<br><strong>2. Az veri.</strong> 1000 doküman altında NB genelde transformer\'ları yener ve LogReg ile başa baş gider.<br><strong>3. Streaming veya online öğrenme.</strong> <code>partial_fit</code> + HashingVectorizer yüksek hızlı veri için yenilmez.<br><strong>4. Edge deployment.</strong> Mobil, tarayıcı, mikrokontrolcü — NB birkaç KB sığar, mikrosaniyede tahmin verir.<br><strong>5. Açıklanabilirlik.</strong> Sınıf-başına en bilgilendirici kelime listesi düzenleyicinin okuyabileceği ücretsiz yorumlanabilirlik.<br><strong>6. Spam, içerik moderasyonu, dil tespiti.</strong> Bu alanlarda hâlâ üretimde ölçekli NB sınıflandırıcıları çalışıyor.<br><strong>NB\'yi seçme</strong>: sınıflar çok dengesizse (ComplementNB veya LogReg\'e geç), özellikler birbirine güçlü bağımlıysa (NB aşırı emin olur), kalibre edilmiş olasılık lazımsa (Platt scaling uygula), veya 100k+ dokümanın var ve son %5 doğruluk için birkaç saat fazladan transformer eğitebilirsen.</div></div>

<p class="l-text">11 sklearn dersinin sonunda — ön işleme, sınıflandırma, regresyon, ensemble, boyut indirgeme, model seçimi ve şimdi Naive Bayes — klasik ML alet kutusunun tamamına sahipsin. Pipeline kalıbı hep aynı: yükle, ayır, vektörleştir/ölçeklendir, fit et, cross-validate, tune, değerlendir, kaydet. Gerçek metin verisinde uygula, metrikleri raporla, modeli production\'a koy. NB çoğu zaman ihtiyacın olan ilk — bazen tek — algoritmadır.</p>
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
  var el = document.getElementById('plot-skl10-nb-tr');
  if (el){
    var xs=[]; for (var i=0;i<=70;i++) xs.push(i/10);
    function gauss(x,mu,s){return Math.exp(-Math.pow(x-mu,2)/(2*s*s))/(s*Math.sqrt(2*Math.PI));}
    var y_set = xs.map(function(x){return gauss(x,1.46,0.17);});
    var y_ver = xs.map(function(x){return gauss(x,4.26,0.47);});
    var y_vir = xs.map(function(x){return gauss(x,5.55,0.55);});
    var t1 = {x:xs,y:y_set,type:'scatter',mode:'lines',fill:'tozeroy',name:'setosa',line:{color:T.accent,width:2.5},fillcolor:'rgba(200,169,110,0.22)'};
    var t2 = {x:xs,y:y_ver,type:'scatter',mode:'lines',fill:'tozeroy',name:'versicolor',line:{color:'#4ecdc4',width:2.5},fillcolor:'rgba(78,205,196,0.22)'};
    var t3 = {x:xs,y:y_vir,type:'scatter',mode:'lines',fill:'tozeroy',name:'virginica',line:{color:'#f87171',width:2.5},fillcolor:'rgba(248,113,113,0.22)'};
    var layout = {title:{text:'GaussianNB iris\\'te: petal uzunlugu icin sinif-kosullu yogunluklar',font:{color:T.text,size:14}},xaxis:{title:'Petal uzunlugu (cm)',color:T.text,gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'P(petal uzunlugu | sinif)',color:T.text,gridcolor:T.grid,zerolinecolor:T.zero},paper_bgcolor:T.bg,plot_bgcolor:T.bg,font:{color:T.text},margin:{t:60,r:30,b:50,l:60},legend:{font:{color:T.text}}};
    Plotly.newPlot('plot-skl10-nb-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
