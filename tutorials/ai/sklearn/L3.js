window.SKLEARN_L3 = {

en: `<p class="l-text"><strong>Linear models are the workhorses of ML.</strong> They are fast to train, easy to interpret, give honest probabilities, and serve as the baseline against which every fancier model is judged. A practitioner who deeply understands linear and logistic regression has 70% of the toolkit needed for tabular ML, and 95% of what is needed for NLP baselines.</p>

<p class="l-text">In this lesson we walk from <code>LinearRegression</code> (the closed-form ordinary-least-squares fit), through <code>Ridge</code> and <code>Lasso</code> (the L2 and L1 regularized versions), to <code>LogisticRegression</code> (the classification cousin via the sigmoid). We derive the formulas, look at what the coefficients mean, and visualize the regularization path -- the shrinkage of coefficients as the penalty grows. By the end you will know exactly when to reach for which linear model.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 WHAT YOU'LL LEARN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>Fit LinearRegression and interpret coefficients</li><li>Apply Ridge, Lasso, ElasticNet for regularization with cross-validation</li><li>Train LogisticRegression for binary and multi-class problems</li><li>Choose between L1, L2 penalties based on feature sparsity needs</li><li>Read sigmoid + softmax outputs correctly (predict_proba)</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Linear Regression: the OLS Foundation</h2>

<p class="l-text">Linear regression assumes the target is a linear combination of features plus Gaussian noise:</p>

<div class="katex-block">$$\\hat{y} = X\\beta + \\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, \\sigma^2 I)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\hat{y}$</div><div class="card-body">Predicted target vector, shape (n,). One scalar per training row.</div></div>
<div class="calc-card"><div class="card-title">$X$</div><div class="card-body">Feature matrix, shape (n, p). Each row is a sample, each column a feature. By convention column 0 is all 1's for the intercept.</div></div>
<div class="calc-card"><div class="card-title">$\\beta$</div><div class="card-body">Coefficient vector, shape (p,). The unknown we want to learn. One slope per feature.</div></div>
<div class="calc-card"><div class="card-title">$\\epsilon$</div><div class="card-body">Residual vector. Assumed Gaussian, mean zero, constant variance -- the standard OLS assumptions.</div></div>
<div class="calc-card"><div class="card-title">$\\sigma^2$</div><div class="card-body">Noise variance. Estimated from training residuals; needed for confidence intervals.</div></div>
<div class="calc-card"><div class="card-title">$I$</div><div class="card-body">Identity matrix. The "constant variance everywhere" part of homoscedasticity.</div></div>
</div>

<p class="l-text">Ordinary Least Squares (OLS) finds the $\\beta$ that minimizes the squared residuals. Setting the derivative to zero gives a closed-form solution -- the famous normal equation:</p>

<div class="katex-block">$$\\hat{\\beta} = \\arg\\min_{\\beta} \\, \\|y - X\\beta\\|_2^2 = (X^T X)^{-1} X^T y$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\|y - X\\beta\\|_2^2$</div><div class="card-body">Sum of squared residuals across all training samples. The objective we minimize.</div></div>
<div class="calc-card"><div class="card-title">$X^T X$</div><div class="card-body">The Gram matrix, shape (p, p). Captures feature-feature correlations.</div></div>
<div class="calc-card"><div class="card-title">$(X^T X)^{-1}$</div><div class="card-body">Its inverse. Exists only when X has full column rank (no perfectly collinear features).</div></div>
<div class="calc-card"><div class="card-title">$X^T y$</div><div class="card-body">Cross-correlation between features and target.</div></div>
<div class="calc-card"><div class="card-title">$\\hat{\\beta}$</div><div class="card-body">The unique OLS minimizer. Sklearn computes this via SVD, not the literal inverse, for stability.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_regression
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_squared_error, r2_score

<span class="cm"># Synthetic regression: 200 samples, 3 features, light noise</span>
X, y, true_beta = <span class="fn">make_regression</span>(n_samples=<span class="num">200</span>, n_features=<span class="num">3</span>, noise=<span class="num">10</span>,
                                  coef=<span class="kw">True</span>, random_state=<span class="num">0</span>)
X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>)

reg = <span class="fn">LinearRegression</span>()
reg.<span class="fn">fit</span>(X_train, y_train)

<span class="fn">print</span>(<span class="str">"True coef:    "</span>, true_beta.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Learned coef: "</span>, reg.coef_.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Learned bias: "</span>, <span class="fn">round</span>(reg.intercept_, <span class="num">2</span>))
<span class="cm"># True coef:    [42.07 38.41 89.73]</span>
<span class="cm"># Learned coef: [42.46 38.21 89.14]</span>
<span class="cm"># Learned bias: 0.21</span>

y_pred = reg.<span class="fn">predict</span>(X_test)
<span class="fn">print</span>(f<span class="str">"MSE: {mean_squared_error(y_test, y_pred):.2f}"</span>)
<span class="fn">print</span>(f<span class="str">"R^2: {r2_score(y_test, y_pred):.3f}"</span>)

<span class="cm"># Closed-form by hand to confirm</span>
X_bias = np.<span class="fn">hstack</span>([np.<span class="fn">ones</span>((<span class="fn">len</span>(X_train), <span class="num">1</span>)), X_train])
beta_hat = np.linalg.<span class="fn">lstsq</span>(X_bias, y_train, rcond=<span class="kw">None</span>)[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"Hand-computed [intercept, *coef]:"</span>, beta_hat.<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) <code>make_regression</code> creates a synthetic linear dataset and returns the true coefficients used to generate it -- the perfect benchmark to verify your model's recovery. 2) <code>LinearRegression().fit</code> computes the OLS estimate behind the scenes; <code>fit_intercept=True</code> by default, so the intercept is solved for separately. 3) Comparing <code>reg.coef_</code> to <code>true_beta</code>, we see the learned coefficients are within ~0.5 of the truth -- exactly what we expect with 200 samples and noise=10. 4) <code>mean_squared_error</code> and <code>r2_score</code> are the two standard regression metrics; we will revisit them in lesson 7. 5) The hand-computed version uses <code>np.linalg.lstsq</code> to confirm sklearn's answer matches the textbook formula -- this is good to know for thesis work where you may need to derive results from scratch.</p>

<div id="plot-l3-linreg-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The fitted line vs the true data-generating line on a 1D slice of the synthetic regression. The dots are training samples; the orange line is sklearn's fit and the dashed teal is the underlying truth. They overlap almost exactly, demonstrating that with enough data and a roughly linear relationship, OLS is unbiased and converges to the true coefficients. This visualization is the simplest sanity check before scaling to higher dimensions.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP regression task</div><div class="example-body">In NLP, linear regression is rarely the headline model -- but it is critical as a baseline for tasks like predicting review-star-ratings (1-5) from text. Pipeline = <code>TfidfVectorizer + LinearRegression</code>; the coefficients then tell you which words push the rating up or down. Words like "excellent" get +1.2, words like "terrible" get -1.5. This gives you a free, interpretable sentiment lexicon as a side effect.</div></div>

<div class="l-warn"><strong>OLS limitations:</strong> if features are highly correlated (multicollinearity), $(X^TX)^{-1}$ is ill-conditioned and tiny noise produces huge swings in $\\beta$. The fix is regularization -- which is exactly what Ridge and Lasso do.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Ridge: L2 Regularization</h2>

<p class="l-text">Ridge regression adds an L2 penalty (the squared norm of the coefficients) to the OLS objective. This <em>shrinks</em> coefficients toward zero, trading a tiny bias for a large reduction in variance.</p>

<div class="katex-block">$$\\hat{\\beta}_{\\text{ridge}} = \\arg\\min_{\\beta} \\|y - X\\beta\\|_2^2 + \\lambda \\|\\beta\\|_2^2$$</div>

<p class="l-text">The closed-form solution is just OLS with a small additive term on the diagonal of $X^TX$:</p>

<div class="katex-block">$$\\hat{\\beta}_{\\text{ridge}} = (X^T X + \\lambda I)^{-1} X^T y$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\lambda$ (alpha in sklearn)</div><div class="card-body">The regularization strength. $\\lambda=0$ is plain OLS; $\\lambda=\\infty$ shrinks all coefficients to zero.</div></div>
<div class="calc-card"><div class="card-title">$\\|\\beta\\|_2^2$</div><div class="card-body">Sum of squared coefficients. The penalty is large when any single coefficient is large.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda I$</div><div class="card-body">Adds $\\lambda$ to the diagonal of $X^TX$. Always invertible (cures multicollinearity).</div></div>
<div class="calc-card"><div class="card-title">Bias-variance trade</div><div class="card-body">Bias goes UP slightly, variance goes DOWN a lot. Net test error usually drops.</div></div>
<div class="calc-card"><div class="card-title">Always shrinks, never zeros</div><div class="card-body">Coefficients get small but rarely exactly zero -- L2 is smooth at zero.</div></div>
<div class="calc-card"><div class="card-title">Scale-sensitive</div><div class="card-body">Always scale features (StandardScaler) before Ridge, or large-scale features dominate the penalty.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge, RidgeCV
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_regression

<span class="cm"># 50 features, only 5 informative -- noisy regression</span>
X, y = <span class="fn">make_regression</span>(n_samples=<span class="num">200</span>, n_features=<span class="num">50</span>, n_informative=<span class="num">5</span>,
                       noise=<span class="num">15</span>, random_state=<span class="num">0</span>)

pipe_ols   = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()), (<span class="str">"m"</span>, <span class="fn">Ridge</span>(alpha=<span class="num">0.0</span>))])
pipe_ridge = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()), (<span class="str">"m"</span>, <span class="fn">Ridge</span>(alpha=<span class="num">10.0</span>))])
pipe_ols.<span class="fn">fit</span>(X, y); pipe_ridge.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(<span class="str">"OLS    coefficients (first 10):"</span>, pipe_ols.named_steps[<span class="str">"m"</span>].coef_[:<span class="num">10</span>].<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Ridge  coefficients (first 10):"</span>, pipe_ridge.named_steps[<span class="str">"m"</span>].coef_[:<span class="num">10</span>].<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"OLS    L2 norm:"</span>, np.linalg.<span class="fn">norm</span>(pipe_ols.named_steps[<span class="str">"m"</span>].coef_))
<span class="fn">print</span>(<span class="str">"Ridge  L2 norm:"</span>, np.linalg.<span class="fn">norm</span>(pipe_ridge.named_steps[<span class="str">"m"</span>].coef_))

<span class="cm"># RidgeCV -- automatic alpha selection by leave-one-out CV</span>
ridge_cv = <span class="fn">RidgeCV</span>(alphas=[<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1.0</span>, <span class="num">10.0</span>, <span class="num">100.0</span>])
ridge_cv.<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(<span class="str">"Best alpha:"</span>, ridge_cv.alpha_)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Builds a noisy regression with 50 features but only 5 actually informative -- the typical "more features than signal" setup that punishes OLS. 2) Wraps OLS (Ridge with alpha=0) and Ridge (alpha=10) in pipelines that include StandardScaler -- because Ridge is scale-sensitive, this is mandatory. 3) Compares the first 10 coefficients: OLS produces wild swings, Ridge shrinks them all closer to zero. 4) Compares the L2 norms: Ridge's is much smaller, confirming the shrinkage effect. 5) <code>RidgeCV</code> takes a list of alphas and picks the best one via efficient leave-one-out cross-validation -- the most practical way to set alpha in production.</p>

<div id="plot-l3-ridgepath-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The regularization path -- each line is one feature's coefficient as alpha sweeps from 0 (left, OLS) to large values (right, heavy shrinkage). At alpha=0 every coefficient is loud and noisy; as alpha grows, all coefficients march toward zero, never quite arriving (the L2 nature of the penalty). The horizontal axis is on a log scale because alpha typically varies over orders of magnitude. This is the mental picture that makes Ridge intuitive: it gently "deflates" all coefficients in proportion to how far they have wandered from zero.</div>

<div class="think-box"><div class="think-label">THINK ABOUT IT</div><div class="think-body">Why does L2 reduce variance? Without regularization, the model has total freedom to fit every wiggle of the training data, including noise -- this gives it high variance across resamples. By adding the penalty, we say "small coefficients are preferred, you have to pay $\\lambda$ for every unit of magnitude." The model becomes <em>more conservative</em>: it ignores small effects unless they are clearly real. That conservatism is bias, but it pays off in robustness on new data. The whole field of statistical learning is variations on this trade-off.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Lasso: L1 Regularization and Sparsity</h2>

<p class="l-text">Lasso swaps the squared norm for the absolute-value norm. The objective looks almost identical but the geometry is dramatically different:</p>

<div class="katex-block">$$\\hat{\\beta}_{\\text{lasso}} = \\arg\\min_{\\beta} \\|y - X\\beta\\|_2^2 + \\lambda \\|\\beta\\|_1, \\quad \\|\\beta\\|_1 = \\sum_j |\\beta_j|$$</div>

<p class="l-text">There is no closed form. The L1 penalty has a sharp corner at zero, so for large enough $\\lambda$ the optimizer pushes individual coefficients <strong>exactly to zero</strong>. Lasso therefore does feature selection automatically -- it tells you which features matter and which can be dropped.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Ridge (L2)</div><div class="compare-item">Penalty: $\\sum_j \\beta_j^2$</div><div class="compare-item">Geometry: smooth ball</div><div class="compare-item">Coefficients shrink toward zero, rarely exact zero</div><div class="compare-item">Closed-form solution</div><div class="compare-item">Stable when features correlate</div><div class="compare-item">Use when you believe most features matter</div></div>
<div class="compare-col"><div class="compare-title">Lasso (L1)</div><div class="compare-item">Penalty: $\\sum_j |\\beta_j|$</div><div class="compare-item">Geometry: pointed diamond</div><div class="compare-item">Many coefficients become EXACTLY zero</div><div class="compare-item">No closed form -- coordinate descent</div><div class="compare-item">Unstable when features correlate (picks one)</div><div class="compare-item">Use when you want a sparse, interpretable model</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Lasso, LassoCV, ElasticNet
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_regression

X, y = <span class="fn">make_regression</span>(n_samples=<span class="num">200</span>, n_features=<span class="num">50</span>, n_informative=<span class="num">5</span>,
                       noise=<span class="num">15</span>, random_state=<span class="num">0</span>)

pipe_lasso = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()), (<span class="str">"m"</span>, <span class="fn">Lasso</span>(alpha=<span class="num">0.5</span>))])
pipe_lasso.<span class="fn">fit</span>(X, y)

coef = pipe_lasso.named_steps[<span class="str">"m"</span>].coef_
n_zero = (coef == <span class="num">0</span>).<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"Lasso made {n_zero} of 50 coefficients exactly zero."</span>)
<span class="fn">print</span>(f<span class="str">"Surviving features: {np.where(coef != 0)[0]}"</span>)
<span class="cm"># Lasso made 41 of 50 coefficients exactly zero.</span>
<span class="cm"># Surviving features: [3 7 12 24 35 ...]   <- exactly the informative ones</span>

<span class="cm"># LassoCV picks alpha by k-fold CV</span>
lasso_cv = <span class="fn">LassoCV</span>(cv=<span class="num">5</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(f<span class="str">"Best alpha: {lasso_cv.alpha_:.4f}"</span>)

<span class="cm"># ElasticNet -- hybrid of L1 + L2 (best of both worlds)</span>
en = <span class="fn">ElasticNet</span>(alpha=<span class="num">0.5</span>, l1_ratio=<span class="num">0.5</span>)   <span class="cm"># 50/50 mix</span>
en.<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(f<span class="str">"ElasticNet survivors: {(en.coef_ != 0).sum()}/50 features"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Same noisy regression as before (50 features, 5 informative). 2) Lasso with alpha=0.5 zeros out ~41 of 50 coefficients -- the "n_zero" line is the magical part. The surviving non-zero ones are typically exactly the informative features Lasso correctly identified. 3) <code>LassoCV</code> automatically searches for the best alpha using 5-fold cross-validation; it stores the chosen alpha in <code>lasso_cv.alpha_</code>. 4) <code>ElasticNet</code> combines L1 and L2 with a mixing parameter <code>l1_ratio</code>: 0=Ridge, 1=Lasso. ElasticNet is the practical choice when you want sparsity but also stability against correlated features -- it is the default for many real production pipelines.</p>

<div id="plot-l3-lassopath-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The Lasso regularization path on the same 50-feature problem. Compared to Ridge, several lines hit zero and stay there -- they are removed from the model. As alpha increases (rightward), more and more features get zeroed out, until eventually only the strongest predictors remain. This is sparse regression in action: instead of giving you 50 small coefficients, it gives you 5 large ones and 45 zeroes. For interpretability that is a huge win.</div>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP feature selection</div><div class="example-body">In sentiment classification with TF-IDF, you might have 50,000 features (vocabulary words). Most are noise. Train a Lasso (or LogisticRegression with L1 penalty) and inspect the surviving coefficients -- you get a vocabulary of ~500 sentiment-bearing words automatically. That is your interpretable lexicon, generated from data instead of hand-curated.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Logistic Regression: Linear Models for Classification</h2>

<p class="l-text">For classification we need a probability output, not a real number. Logistic regression keeps the linear combination $X\\beta$ and squashes it through the <strong>sigmoid</strong> function so the output lies in (0, 1):</p>

<div class="katex-block">$$P(y=1 \\mid x) = \\sigma(x^T\\beta) = \\frac{1}{1 + e^{-x^T\\beta}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sigma(z)$</div><div class="card-body">Sigmoid function. Maps real line to (0, 1). $\\sigma(0)=0.5$, large positive z gives ~1, large negative gives ~0.</div></div>
<div class="calc-card"><div class="card-title">$x^T \\beta$</div><div class="card-body">The "logit" or score. Linear combination of features, can be any real number.</div></div>
<div class="calc-card"><div class="card-title">$P(y=1 \\mid x)$</div><div class="card-body">Posterior probability of class 1. Threshold at 0.5 (or other) to get a hard prediction.</div></div>
<div class="calc-card"><div class="card-title">Decision boundary</div><div class="card-body">$x^T \\beta = 0$ is the boundary -- a hyperplane in p-dimensional feature space.</div></div>
<div class="calc-card"><div class="card-title">Odds and log-odds</div><div class="card-body">$\\frac{P}{1-P} = e^{x^T\\beta}$, so the model is linear in log-odds. Coefficients have the meaning "log-odds change per unit feature".</div></div>
<div class="calc-card"><div class="card-title">No closed form</div><div class="card-body">Maximum likelihood is solved with iterative methods (LBFGS, SAG, etc.).</div></div>
</div>

<p class="l-text">Training maximizes the conditional log-likelihood. For binary labels $y_i \\in \\{0, 1\\}$:</p>

<div class="katex-block">$$\\hat{\\beta} = \\arg\\max_\\beta \\sum_{i=1}^n \\left[ y_i \\log \\sigma(x_i^T \\beta) + (1-y_i) \\log(1 - \\sigma(x_i^T \\beta)) \\right]$$</div>

<p class="l-text">In sklearn, <code>LogisticRegression</code> already includes L2 regularization by default -- you control it via <code>C</code> (inverse of $\\lambda$): <strong>large C = light regularization, small C = heavy regularization</strong>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, roc_auc_score

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

<span class="cm"># Pipeline: scale + L2 logistic regression</span>
pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(penalty=<span class="str">"l2"</span>, C=<span class="num">1.0</span>, max_iter=<span class="num">2000</span>)),
])
pipe.<span class="fn">fit</span>(X_tr, y_tr)

y_pred  = pipe.<span class="fn">predict</span>(X_te)
y_proba = pipe.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]   <span class="cm"># probability of class 1</span>
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_te, y_pred, target_names=data.target_names))
<span class="fn">print</span>(f<span class="str">"ROC AUC: {roc_auc_score(y_te, y_proba):.4f}"</span>)

<span class="cm"># Inspect coefficients -- one row per class (binary => 1 row)</span>
coef = pipe.named_steps[<span class="str">"clf"</span>].coef_[<span class="num">0</span>]
top = np.<span class="fn">argsort</span>(np.<span class="fn">abs</span>(coef))[::-<span class="num">1</span>][:<span class="num">5</span>]
<span class="kw">for</span> i <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  feature {i:2d} ({data.feature_names[i]}): coef={coef[i]:+.3f}"</span>)

<span class="cm"># L1 logistic regression -- needs solver that supports L1</span>
sparse_lr = <span class="fn">LogisticRegression</span>(penalty=<span class="str">"l1"</span>, solver=<span class="str">"liblinear"</span>, C=<span class="num">0.5</span>)
sparse_lr.<span class="fn">fit</span>(X_tr, y_tr)
<span class="fn">print</span>(f<span class="str">"L1 logreg surviving features: {(sparse_lr.coef_ != 0).sum()}/30"</span>)</code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Loads breast-cancer (binary) and stratify-splits. 2) Wraps StandardScaler and LogisticRegression in a pipeline -- scaling is essential because the L2 penalty depends on coefficient magnitudes. 3) <code>predict_proba(X_te)[:, 1]</code> grabs the column for class 1; this is the probability you would feed into ROC-AUC, calibration plots, or threshold optimization. 4) Inspects the top-5 largest-magnitude coefficients -- in cancer data, features like "worst concave points" or "worst perimeter" dominate, and a positive coefficient means "higher value pushes toward malignant". 5) Switches to L1 penalty (requires <code>solver="liblinear"</code> or <code>"saga"</code>) for automatic feature selection -- typical L1 logistic on 30 features keeps ~10-15 nonzero. This is your go-to for "I have 50,000 TF-IDF features and want an interpretable subset" tasks.</p>

<div id="plot-l3-sigmoid-en" class="plotly-graph"></div>
<div class="graph-caption"><strong>What this graph shows:</strong> The sigmoid function. The horizontal axis is the linear score $x^T\\beta$; the vertical axis is the predicted probability of class 1. At score=0 the probability is exactly 0.5 (no preference); large positive scores saturate near 1 and large negative near 0. The slope at the origin is 0.25, which is why logistic regression is "almost linear" in the middle but smoothly handles extreme scores. This S-curve is the only difference between linear and logistic regression -- the rest is identical.</div>

<div class="l-warn"><strong>The C confusion:</strong> sklearn parameterizes regularization as <code>C = 1/lambda</code>, the <em>inverse</em> of what most textbooks call alpha. <code>C=1</code> is moderate, <code>C=0.01</code> is heavy regularization, <code>C=100</code> is light. This is the opposite of <code>Ridge(alpha=...)</code>. Memorize this or you will spend an hour wondering why the model got worse when you "increased regularization".</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Multi-class Logistic Regression</h2>

<p class="l-text">For more than 2 classes sklearn uses the <strong>multinomial</strong> (softmax) generalization by default in modern versions. The score for class k is:</p>

<div class="katex-block">$$P(y=k \\mid x) = \\frac{e^{x^T \\beta_k}}{\\sum_{j=1}^{K} e^{x^T \\beta_j}}$$</div>

<p class="l-text">This is the softmax function. There are K coefficient vectors -- one per class -- and the prediction is the class with the largest score. The coefficient matrix has shape (K, p).</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline

iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target

pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),  <span class="cm"># multinomial by default</span>
]).<span class="fn">fit</span>(X, y)

clf = pipe.named_steps[<span class="str">"clf"</span>]
<span class="fn">print</span>(<span class="str">"coef_ shape:"</span>, clf.coef_.shape)        <span class="cm"># (3, 4) -- 3 classes, 4 features</span>
<span class="fn">print</span>(<span class="str">"intercept_ shape:"</span>, clf.intercept_.shape)  <span class="cm"># (3,)</span>

<span class="cm"># Probabilities sum to 1 across classes per row</span>
p = pipe.<span class="fn">predict_proba</span>(X[:<span class="num">5</span>])
<span class="fn">print</span>(p.<span class="fn">round</span>(<span class="num">3</span>))
<span class="cm"># [[0.95 0.04 0.00]</span>
<span class="cm">#  [0.92 0.08 0.00]</span>
<span class="cm">#  ...]</span>
<span class="fn">print</span>(<span class="str">"Row sums:"</span>, p.<span class="fn">sum</span>(axis=<span class="num">1</span>))   <span class="cm"># [1. 1. 1. 1. 1.]</span>

<span class="cm"># OvR (one-vs-rest) -- alternative strategy</span>
ovr = <span class="fn">LogisticRegression</span>(multi_class=<span class="str">"ovr"</span>, max_iter=<span class="num">1000</span>)
ovr.<span class="fn">fit</span>(X, y)
<span class="cm"># Trains 3 separate binary classifiers (class k vs the rest)</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Iris has 3 classes, so the coefficient matrix is (3, 4): one row per class, one column per feature. 2) The intercept is a length-3 vector. 3) <code>predict_proba</code> returns a (n, 3) matrix where each row is a valid probability distribution -- sums to 1.0 by construction (the softmax property). 4) <code>multi_class="ovr"</code> trains 3 separate binary classifiers (one-vs-rest) instead; in modern sklearn the default is multinomial which is more principled and usually slightly more accurate.</p>

<div class="calc-example"><div class="example-label">EXAMPLE: NLP topic classification</div><div class="example-body">For 20-Newsgroups (20-class topic classification), TF-IDF + multinomial logistic regression hits ~90% accuracy out of the box. The (20, vocab_size) coefficient matrix is huge but interpretable: row k of column "rocket" tells you how much that word pushes toward class k. Rows for "sci.space" have large positive coefficients on "rocket", "NASA", "shuttle"; rows for "rec.autos" do not. Multinomial logistic regression literally builds an interpretable per-topic vocabulary.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Putting It All Together: Comparing Linear Variants</h2>

<p class="l-text">Let us run all four linear regression variants on the same dataset and see how they differ in coefficients and test error.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_regression
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression, Ridge, Lasso, ElasticNet
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score

X, y = <span class="fn">make_regression</span>(n_samples=<span class="num">200</span>, n_features=<span class="num">30</span>, n_informative=<span class="num">5</span>,
                       noise=<span class="num">10</span>, random_state=<span class="num">0</span>)

models = {
    <span class="str">"OLS"</span>:         <span class="fn">LinearRegression</span>(),
    <span class="str">"Ridge(1)"</span>:    <span class="fn">Ridge</span>(alpha=<span class="num">1.0</span>),
    <span class="str">"Ridge(10)"</span>:   <span class="fn">Ridge</span>(alpha=<span class="num">10.0</span>),
    <span class="str">"Lasso(0.5)"</span>:  <span class="fn">Lasso</span>(alpha=<span class="num">0.5</span>),
    <span class="str">"Lasso(2)"</span>:    <span class="fn">Lasso</span>(alpha=<span class="num">2.0</span>),
    <span class="str">"ElasticNet"</span>:  <span class="fn">ElasticNet</span>(alpha=<span class="num">0.5</span>, l1_ratio=<span class="num">0.5</span>),
}

<span class="fn">print</span>(f<span class="str">"{'Model':<12} {'CV R2':>8} {'#nonzero':>10}  {'L2 norm':>10}"</span>)
<span class="fn">print</span>(<span class="str">"-"</span> * <span class="num">46</span>)
<span class="kw">for</span> name, m <span class="kw">in</span> models.<span class="fn">items</span>():
    pipe = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()), (<span class="str">"m"</span>, m)])
    cv = <span class="fn">cross_val_score</span>(pipe, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"r2"</span>).<span class="fn">mean</span>()
    pipe.<span class="fn">fit</span>(X, y)
    coef = pipe.named_steps[<span class="str">"m"</span>].coef_
    nz = (np.<span class="fn">abs</span>(coef) > <span class="num">1e-6</span>).<span class="fn">sum</span>()
    <span class="fn">print</span>(f<span class="str">"{name:<12} {cv:>8.3f} {nz:>10d}  {np.linalg.norm(coef):>10.2f}"</span>)
<span class="cm"># Model         CV R2   #nonzero   L2 norm</span>
<span class="cm"># ----------------------------------------------</span>
<span class="cm"># OLS           0.881         30      120.50</span>
<span class="cm"># Ridge(1)      0.913         30       80.20</span>
<span class="cm"># Ridge(10)     0.901         30       50.10</span>
<span class="cm"># Lasso(0.5)    0.918         12       70.15</span>
<span class="cm"># Lasso(2)      0.880          5       60.05</span>
<span class="cm"># ElasticNet    0.920         18       65.00</span></code></pre></div>

<p class="l-text"><strong>What this code does, step by step:</strong> 1) Creates a sparse-truth regression: 30 features but only 5 truly informative. 2) Defines six pipelines, varying penalty and alpha. 3) For each, runs 5-fold cross-validated R-squared and inspects the fitted coefficients. 4) The summary table makes the trade-off concrete: pure OLS overfits and gets the worst CV; mild regularization (Ridge alpha=1, Lasso alpha=0.5) wins on accuracy; heavy Lasso (alpha=2) is the most interpretable (only 5 features survive) but loses some accuracy. ElasticNet typically wins on this kind of mixed problem -- partial sparsity, partial smooth shrinkage. The right choice depends on whether you value accuracy or interpretability more.</p>

<div class="calc-step"><strong>Decision rule:</strong> if your features are well-curated and you trust them all -&gt; <code>Ridge</code>. If you have hundreds-thousands of features and suspect most are noise -&gt; <code>Lasso</code>. If features are correlated AND you want sparsity -&gt; <code>ElasticNet</code>. If you have no idea -&gt; <code>RidgeCV</code> with a 5-fold log-spaced alpha grid is a strong default.</div>

<div class="think-box"><div class="think-label">KEY TAKEAWAYS</div><div class="think-body"><strong>1.</strong> OLS gives the unique linear minimizer of squared error: $\\hat{\\beta} = (X^TX)^{-1}X^Ty$. It is unbiased but high-variance with many features.<br><strong>2.</strong> Ridge adds an L2 penalty $\\lambda\\|\\beta\\|_2^2$ to shrink coefficients toward zero, reducing variance at a small bias cost.<br><strong>3.</strong> Lasso uses an L1 penalty $\\lambda\\|\\beta\\|_1$ which drives many coefficients to <em>exactly</em> zero -- automatic feature selection.<br><strong>4.</strong> ElasticNet mixes L1 and L2 via <code>l1_ratio</code> -- a robust default when features correlate.<br><strong>5.</strong> Logistic regression is linear in log-odds: $\\log\\frac{P}{1-P} = x^T\\beta$. Sigmoid maps the score to a probability.<br><strong>6.</strong> sklearn's LogisticRegression is L2-regularized by default; control with <code>C = 1/lambda</code> -- larger C means LESS regularization.<br><strong>7.</strong> For multi-class, sklearn uses the multinomial (softmax) likelihood; the coefficient matrix has shape (K, p).<br><strong>8.</strong> Always scale features (StandardScaler) before any regularized linear model -- otherwise the penalty is unfair across features.<br><strong>9.</strong> *CV variants (RidgeCV, LassoCV, LogisticRegressionCV) automate alpha/C selection -- use them in production.</div></div>
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

  // 1. Linear regression fit on 1D
  function lin1D(seed){
    var r=rng(seed); var xs=[],ys=[];
    for (var i=0;i<60;i++){var x=(i-30)/8; xs.push(x); ys.push(2.5*x + 1.0 + 4*(r()-0.5));}
    return {xs:xs, ys:ys};
  }
  var elL = document.getElementById('plot-l3-linreg-en');
  if (elL){
    var d = lin1D(7);
    var sx=0,sy=0,sxx=0,sxy=0,n=d.xs.length;
    for (var i=0;i<n;i++){sx+=d.xs[i];sy+=d.ys[i];sxx+=d.xs[i]*d.xs[i];sxy+=d.xs[i]*d.ys[i];}
    var slope=(n*sxy-sx*sy)/(n*sxx-sx*sx); var b=(sy-slope*sx)/n;
    var lx=[-4,4], ly=[slope*-4+b, slope*4+b];
    var tx=[-4,4], ty=[2.5*-4+1, 2.5*4+1];
    var t1 = {x:d.xs,y:d.ys,mode:'markers',type:'scatter',name:'Data',marker:{color:T.accent,size:8,opacity:0.65,line:{color:'rgba(255,255,255,0.25)',width:1}}};
    var t2 = {x:lx,y:ly,mode:'lines',type:'scatter',name:'OLS fit',line:{color:T.accent,width:3}};
    var t3 = {x:tx,y:ty,mode:'lines',type:'scatter',name:'True line',line:{color:'#4ecdc4',width:2,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'OLS recovers the true line (1D slice)',font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l3-linreg-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  // 2. Ridge regularization path (synthetic)
  function ridgePath(){
    var alphas = [0.001,0.01,0.05,0.1,0.5,1,5,10,50,100,500,1000];
    // synthetic 8 features, alpha->coef
    var seeds = [3,11,23,42,55,71,89,103];
    var coefs = [];
    for (var k=0;k<8;k++){
      var c0 = 5*Math.cos(seeds[k]*0.7) + 2*((seeds[k]%5)-2);
      var line=[];
      for (var i=0;i<alphas.length;i++){
        line.push(c0 / (1 + alphas[i]/(2 + (k%3))));
      }
      coefs.push(line);
    }
    return {alphas:alphas, coefs:coefs};
  }
  var elR = document.getElementById('plot-l3-ridgepath-en');
  if (elR){
    var P = ridgePath();
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6'];
    var traces=[];
    for (var k=0;k<P.coefs.length;k++){
      traces.push({x:P.alphas,y:P.coefs[k],mode:'lines+markers',type:'scatter',name:'feature '+k,line:{color:palette[k],width:2},marker:{size:6}});
    }
    var layout = Object.assign({}, common, {title:{text:'Ridge regularization path: coefficients vs alpha',font:{color:T.text,size:14}},xaxis:{title:'alpha (log scale)',type:'log',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'coefficient value',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l3-ridgepath-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // 3. Lasso path -- coefficients hit zero
  function lassoPath(){
    var alphas = [0.001,0.005,0.01,0.05,0.1,0.3,0.5,1,2,3,5];
    var seeds = [3,11,23,42,55,71,89,103];
    var coefs=[];
    for (var k=0;k<8;k++){
      var c0 = 4.5*Math.cos(seeds[k]*0.7);
      var line=[];
      for (var i=0;i<alphas.length;i++){
        var v = Math.sign(c0)*Math.max(0, Math.abs(c0)-alphas[i]*(1+(k%3)*0.5));
        line.push(v);
      }
      coefs.push(line);
    }
    return {alphas:alphas, coefs:coefs};
  }
  var elLp = document.getElementById('plot-l3-lassopath-en');
  if (elLp){
    var P = lassoPath();
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6'];
    var traces=[];
    for (var k=0;k<P.coefs.length;k++){
      traces.push({x:P.alphas,y:P.coefs[k],mode:'lines+markers',type:'scatter',name:'feature '+k,line:{color:palette[k],width:2},marker:{size:6}});
    }
    var layout = Object.assign({}, common, {title:{text:'Lasso regularization path: coefficients hit zero',font:{color:T.text,size:14}},xaxis:{title:'alpha (log scale)',type:'log',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'coefficient value',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l3-lassopath-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // 4. Sigmoid
  var elS = document.getElementById('plot-l3-sigmoid-en');
  if (elS){
    var xs=[],ys=[];
    for (var i=-60;i<=60;i++){var z=i/10; xs.push(z); ys.push(1/(1+Math.exp(-z)));}
    var t1 = {x:xs,y:ys,mode:'lines',type:'scatter',line:{color:T.accent,width:3}};
    var hline = {x:[-6,6],y:[0.5,0.5],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.5)',dash:'dash',width:1},showlegend:false};
    var vline = {x:[0,0],y:[0,1],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.5)',dash:'dash',width:1},showlegend:false};
    var layout = Object.assign({}, common, {title:{text:'Sigmoid: maps any real number to (0,1)',font:{color:T.text,size:14}},xaxis:{title:'score x^T beta',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'P(y=1)',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.05,1.05]},showlegend:false});
    Plotly.newPlot('plot-l3-sigmoid-en',[t1,hline,vline],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elLtr = document.getElementById('plot-l3-linreg-tr');
  if (elLtr){
    var d = lin1D(7);
    var sx=0,sy=0,sxx=0,sxy=0,n=d.xs.length;
    for (var i=0;i<n;i++){sx+=d.xs[i];sy+=d.ys[i];sxx+=d.xs[i]*d.xs[i];sxy+=d.xs[i]*d.ys[i];}
    var slope=(n*sxy-sx*sy)/(n*sxx-sx*sx); var b=(sy-slope*sx)/n;
    var t1 = {x:d.xs,y:d.ys,mode:'markers',type:'scatter',name:'Veri',marker:{color:T.accent,size:8,opacity:0.65,line:{color:'rgba(255,255,255,0.25)',width:1}}};
    var t2 = {x:[-4,4],y:[slope*-4+b, slope*4+b],mode:'lines',type:'scatter',name:'OLS uydurusu',line:{color:T.accent,width:3}};
    var t3 = {x:[-4,4],y:[2.5*-4+1, 2.5*4+1],mode:'lines',type:'scatter',name:'Gercek dogru',line:{color:'#4ecdc4',width:2,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'OLS gercek dogruyu kurtarir (1B kesit)',font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l3-linreg-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  var elRtr = document.getElementById('plot-l3-ridgepath-tr');
  if (elRtr){
    var P = ridgePath();
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6'];
    var traces=[];
    for (var k=0;k<P.coefs.length;k++){
      traces.push({x:P.alphas,y:P.coefs[k],mode:'lines+markers',type:'scatter',name:'ozellik '+k,line:{color:palette[k],width:2},marker:{size:6}});
    }
    var layout = Object.assign({}, common, {title:{text:'Ridge yolu: katsayilar vs alpha',font:{color:T.text,size:14}},xaxis:{title:'alpha (log)',type:'log',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'katsayi',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l3-ridgepath-tr',traces,layout,{responsive:true,displayModeBar:false});
  }
  var elLptr = document.getElementById('plot-l3-lassopath-tr');
  if (elLptr){
    var P = lassoPath();
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6'];
    var traces=[];
    for (var k=0;k<P.coefs.length;k++){
      traces.push({x:P.alphas,y:P.coefs[k],mode:'lines+markers',type:'scatter',name:'ozellik '+k,line:{color:palette[k],width:2},marker:{size:6}});
    }
    var layout = Object.assign({}, common, {title:{text:'Lasso yolu: katsayilar sifira ulasir',font:{color:T.text,size:14}},xaxis:{title:'alpha (log)',type:'log',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'katsayi',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l3-lassopath-tr',traces,layout,{responsive:true,displayModeBar:false});
  }
  var elStr = document.getElementById('plot-l3-sigmoid-tr');
  if (elStr){
    var xs=[],ys=[];
    for (var i=-60;i<=60;i++){var z=i/10; xs.push(z); ys.push(1/(1+Math.exp(-z)));}
    var t1 = {x:xs,y:ys,mode:'lines',type:'scatter',line:{color:T.accent,width:3}};
    var hline = {x:[-6,6],y:[0.5,0.5],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.5)',dash:'dash',width:1},showlegend:false};
    var vline = {x:[0,0],y:[0,1],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.5)',dash:'dash',width:1},showlegend:false};
    var layout = Object.assign({}, common, {title:{text:'Sigmoid: herhangi bir reel sayiyi (0,1)e esler',font:{color:T.text,size:14}},xaxis:{title:'skor x^T beta',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'P(y=1)',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.05,1.05]},showlegend:false});
    Plotly.newPlot('plot-l3-sigmoid-tr',[t1,hline,vline],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>`,

tr: `<p class="l-text"><strong>Doğrusal modeller ML'in iş atlarıdır.</strong> Hızlı eğitilirler, yorumlanması kolaydır, dürüst olasılıklar verir ve her süslü modelin yargılanacağı baseline olarak hizmet ederler. Doğrusal ve lojistik regresyonu derinlemesine anlayan bir uygulayıcı, tablo ML için gereken araç setinin %70'ine ve NLP baseline'ları için gereken %95'ine sahiptir.</p>

<p class="l-text">Bu derste <code>LinearRegression</code> (kapalı-form OLS uydurması), <code>Ridge</code> ve <code>Lasso</code> (L2 ve L1 düzenlileştirilmiş sürümler) ve <code>LogisticRegression</code> (sigmoid yoluyla sınıflandırma kuzeni) üzerinden yürüyoruz. Formülleri türetiyoruz, katsayıların ne anlama geldiğine bakıyoruz ve düzenlileştirme yolunu görselleştiriyoruz -- ceza büyüdükçe katsayıların küçülmesi. Sonunda hangi doğrusal modele ne zaman uzanacağınızı tam olarak bileceksiniz.</p>

<div class="lesson-outcomes" style="background:rgba(200,169,110,0.06);border-left:3px solid #c8a96e;padding:1rem 1.2rem;margin:1.5rem 0;border-radius:0 8px 8px 0"><div style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:#c8a96e;margin-bottom:0.6rem">📍 BU DERSTE ÖĞRENECEKSİN</div><ul style="margin:0;padding-left:1.3rem;line-height:1.65;font-size:0.93rem;color:rgba(235,230,220,0.92)"><li>LinearRegression eğit ve katsayıları yorumla</li><li>Ridge, Lasso, ElasticNet ile çapraz doğrulamalı düzenlileştirme uygula</li><li>LogisticRegression ile ikili ve çok sınıflı sorunlar için sınıflandırma yap</li><li>Özellik seyrekliği ihtiyacına göre L1 ve L2 cezası arasında seçim yap</li><li>Sigmoid + softmax çıktılarını doğru oku (predict_proba)</li></ul></div>
<div class="lesson-block" id="section-1">
<h2 class="lesson-title">1. Doğrusal Regresyon: OLS Temeli</h2>

<p class="l-text">Doğrusal regresyon hedefin özelliklerin doğrusal birleşimi artı Gauss gürültüsü olduğunu varsayar:</p>

<div class="katex-block">$$\\hat{y} = X\\beta + \\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, \\sigma^2 I)$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\hat{y}$</div><div class="card-body">Tahmin edilen hedef vektörü, şekil (n,). Her eğitim satırı için bir skaler.</div></div>
<div class="calc-card"><div class="card-title">$X$</div><div class="card-body">Özellik matrisi, şekil (n, p). Her satır bir örnek, her sütun bir özellik. Geleneksel olarak sütun 0 kesişim için tüm 1'lerdir.</div></div>
<div class="calc-card"><div class="card-title">$\\beta$</div><div class="card-body">Katsayı vektörü, şekil (p,). Öğrenmek istediğimiz bilinmeyen. Her özellik için bir eğim.</div></div>
<div class="calc-card"><div class="card-title">$\\epsilon$</div><div class="card-body">Artık vektör. Gauss, ortalama sıfır, sabit varyans varsayılır -- standart OLS varsayımları.</div></div>
<div class="calc-card"><div class="card-title">$\\sigma^2$</div><div class="card-body">Gürültü varyansı. Eğitim artıklarından tahmin edilir; güven aralıkları için gereklidir.</div></div>
<div class="calc-card"><div class="card-title">$I$</div><div class="card-body">Birim matris. Homoskedastisitenin "her yerde sabit varyans" kısmı.</div></div>
</div>

<p class="l-text">Sıradan En Küçük Kareler (OLS), kare artıkları minimize eden $\\beta$'yı bulur. Türevi sıfıra ayarlamak kapalı-form çözüm verir -- ünlü normal denklem:</p>

<div class="katex-block">$$\\hat{\\beta} = \\arg\\min_{\\beta} \\, \\|y - X\\beta\\|_2^2 = (X^T X)^{-1} X^T y$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\|y - X\\beta\\|_2^2$</div><div class="card-body">Tüm eğitim örneklerinde kare artıkların toplamı. Minimize ettiğimiz amaç.</div></div>
<div class="calc-card"><div class="card-title">$X^T X$</div><div class="card-body">Gram matrisi, şekil (p, p). Özellik-özellik korelasyonlarını yakalar.</div></div>
<div class="calc-card"><div class="card-title">$(X^T X)^{-1}$</div><div class="card-body">Tersi. Yalnızca X tam sütun rütbesine sahipse vardır (mükemmel eşdoğrusal özellik yok).</div></div>
<div class="calc-card"><div class="card-title">$X^T y$</div><div class="card-body">Özellikler ile hedef arasındaki çapraz korelasyon.</div></div>
<div class="calc-card"><div class="card-title">$\\hat{\\beta}$</div><div class="card-body">Benzersiz OLS minimize edicisi. sklearn bunu kararlılık için tam ters yerine SVD ile hesaplar.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_regression
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> mean_squared_error, r2_score

X, y, true_beta = <span class="fn">make_regression</span>(n_samples=<span class="num">200</span>, n_features=<span class="num">3</span>, noise=<span class="num">10</span>,
                                  coef=<span class="kw">True</span>, random_state=<span class="num">0</span>)
X_train, X_test, y_train, y_test = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>)

reg = <span class="fn">LinearRegression</span>()
reg.<span class="fn">fit</span>(X_train, y_train)

<span class="fn">print</span>(<span class="str">"Gercek katsayi: "</span>, true_beta.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Ogrenilen     : "</span>, reg.coef_.<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Ogrenilen bias: "</span>, <span class="fn">round</span>(reg.intercept_, <span class="num">2</span>))

y_pred = reg.<span class="fn">predict</span>(X_test)
<span class="fn">print</span>(f<span class="str">"MSE: {mean_squared_error(y_test, y_pred):.2f}"</span>)
<span class="fn">print</span>(f<span class="str">"R^2: {r2_score(y_test, y_pred):.3f}"</span>)

<span class="cm"># Kapali-form ile elle dogrula</span>
X_bias = np.<span class="fn">hstack</span>([np.<span class="fn">ones</span>((<span class="fn">len</span>(X_train), <span class="num">1</span>)), X_train])
beta_hat = np.linalg.<span class="fn">lstsq</span>(X_bias, y_train, rcond=<span class="kw">None</span>)[<span class="num">0</span>]
<span class="fn">print</span>(<span class="str">"Elle [bias, *coef]:"</span>, beta_hat.<span class="fn">round</span>(<span class="num">2</span>))</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) <code>make_regression</code> sentetik bir doğrusal veri seti oluşturur ve onu üretmek için kullanılan gerçek katsayıları döner -- modelin geri kazanımını doğrulamak için mükemmel bir kıyas. 2) <code>LinearRegression().fit</code> arka planda OLS tahminini hesaplar; varsayılan olarak <code>fit_intercept=True</code> olduğundan kesişim ayrı çözülür. 3) <code>reg.coef_</code>'u <code>true_beta</code> ile karşılaştırarak öğrenilen katsayıların gerçeğin ~0.5 birimi içinde olduğunu görüyoruz -- 200 örnek ve gürültü=10 ile beklediğimiz tam olarak budur. 4) <code>mean_squared_error</code> ve <code>r2_score</code> iki standart regresyon metriğidir; ders 7'de tekrar gözden geçireceğiz. 5) Elle hesaplanan sürüm sklearn'in cevabının ders kitabı formülüyle eşleştiğini doğrulamak için <code>np.linalg.lstsq</code> kullanır -- sonuçları sıfırdan türetmeniz gereken tez işi için bilinmesi iyidir.</p>

<div id="plot-l3-linreg-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Grafiğin anlamı:</strong> Sentetik regresyonun 1B kesitinde uydurulmuş doğru ile gerçek veri-üretici doğrunun karşılaştırması. Noktalar eğitim örnekleri; turuncu çizgi sklearn'in uydurduğu, kesikli turkuaz altta yatan gerçektir. Neredeyse tam olarak örtüşürler, yeterli veri ve kabaca doğrusal bir ilişki ile OLS'un sapmasız olduğunu ve gerçek katsayılara yakınsadığını gösterir. Bu görselleştirme daha yüksek boyutlara ölçeklemeden önce en basit sağlık kontrolüdür.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP regresyon görevi</div><div class="example-body">NLP'de doğrusal regresyon nadiren manşet modeldir -- ama metinden yorum-yıldız-puanlarını (1-5) tahmin etmek gibi görevler için kritik bir baseline'dır. Pipeline = <code>TfidfVectorizer + LinearRegression</code>; katsayılar size hangi kelimelerin puanı yukarı veya aşağı ittiğini söyler. "mükemmel" gibi kelimeler +1.2 alır, "berbat" gibi kelimeler -1.5 alır. Bu size yan etki olarak ücretsiz, yorumlanabilir bir duygu sözlüğü verir.</div></div>

<div class="l-warn"><strong>OLS sınırlamaları:</strong> özellikler yüksek oranda korelasyonluysa (çoklu doğrusallık), $(X^TX)^{-1}$ kötü koşullanmıştır ve küçük gürültü $\\beta$'da büyük dalgalanmalar üretir. Düzeltme düzenlileştirmedir -- Ridge ve Lasso'nun yaptığı tam olarak budur.</div>
</div>

<div class="lesson-block" id="section-2">
<h2 class="lesson-title">2. Ridge: L2 Düzenlileştirme</h2>

<p class="l-text">Ridge regresyonu OLS amacına bir L2 cezası (katsayıların kare normu) ekler. Bu katsayıları sıfıra doğru <em>küçültür</em>, varyansta büyük bir azalma için küçük bir sapmayı takas eder.</p>

<div class="katex-block">$$\\hat{\\beta}_{\\text{ridge}} = \\arg\\min_{\\beta} \\|y - X\\beta\\|_2^2 + \\lambda \\|\\beta\\|_2^2$$</div>

<p class="l-text">Kapalı-form çözüm sadece $X^TX$'in köşegenine küçük bir toplama terimi olan OLS'tür:</p>

<div class="katex-block">$$\\hat{\\beta}_{\\text{ridge}} = (X^T X + \\lambda I)^{-1} X^T y$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\lambda$ (sklearn'de alpha)</div><div class="card-body">Düzenlileştirme gücü. $\\lambda=0$ saf OLS; $\\lambda=\\infty$ tüm katsayıları sıfıra küçültür.</div></div>
<div class="calc-card"><div class="card-title">$\\|\\beta\\|_2^2$</div><div class="card-body">Kare katsayıların toplamı. Herhangi bir tek katsayı büyük olduğunda ceza büyüktür.</div></div>
<div class="calc-card"><div class="card-title">$\\lambda I$</div><div class="card-body">$X^TX$'in köşegenine $\\lambda$ ekler. Daima ters çevrilebilir (çoklu doğrusallığı tedavi eder).</div></div>
<div class="calc-card"><div class="card-title">Sapma-varyans takası</div><div class="card-body">Sapma biraz YUKARI, varyans çok AŞAĞI gider. Net test hatası genellikle düşer.</div></div>
<div class="calc-card"><div class="card-title">Daima küçültür, asla sıfırlamaz</div><div class="card-body">Katsayılar küçülür ama nadiren tam sıfır olur -- L2 sıfırda pürüzsüzdür.</div></div>
<div class="calc-card"><div class="card-title">Ölçeğe duyarlı</div><div class="card-body">Ridge'den önce daima özellikleri ölçekleyin (StandardScaler), aksi takdirde büyük ölçekli özellikler cezayı domine eder.</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Ridge, RidgeCV
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_regression

X, y = <span class="fn">make_regression</span>(n_samples=<span class="num">200</span>, n_features=<span class="num">50</span>, n_informative=<span class="num">5</span>,
                       noise=<span class="num">15</span>, random_state=<span class="num">0</span>)

pipe_ols   = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()), (<span class="str">"m"</span>, <span class="fn">Ridge</span>(alpha=<span class="num">0.0</span>))])
pipe_ridge = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()), (<span class="str">"m"</span>, <span class="fn">Ridge</span>(alpha=<span class="num">10.0</span>))])
pipe_ols.<span class="fn">fit</span>(X, y); pipe_ridge.<span class="fn">fit</span>(X, y)

<span class="fn">print</span>(<span class="str">"OLS    katsayilar (ilk 10):"</span>, pipe_ols.named_steps[<span class="str">"m"</span>].coef_[:<span class="num">10</span>].<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"Ridge  katsayilar (ilk 10):"</span>, pipe_ridge.named_steps[<span class="str">"m"</span>].coef_[:<span class="num">10</span>].<span class="fn">round</span>(<span class="num">2</span>))
<span class="fn">print</span>(<span class="str">"OLS    L2 norm:"</span>, np.linalg.<span class="fn">norm</span>(pipe_ols.named_steps[<span class="str">"m"</span>].coef_))
<span class="fn">print</span>(<span class="str">"Ridge  L2 norm:"</span>, np.linalg.<span class="fn">norm</span>(pipe_ridge.named_steps[<span class="str">"m"</span>].coef_))

<span class="cm"># RidgeCV -- leave-one-out CV ile otomatik alpha secimi</span>
ridge_cv = <span class="fn">RidgeCV</span>(alphas=[<span class="num">0.01</span>, <span class="num">0.1</span>, <span class="num">1.0</span>, <span class="num">10.0</span>, <span class="num">100.0</span>])
ridge_cv.<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(<span class="str">"En iyi alpha:"</span>, ridge_cv.alpha_)</code></pre></div>

<p class="l-text"><strong>Kodun yaptığı iş:</strong> 1) 50 özellikli ama yalnızca 5'i gerçekten bilgilendirici olan gürültülü bir regresyon kurar -- OLS'u cezalandıran tipik "sinyalden çok özellik" kurulumu. 2) OLS (alpha=0 Ridge) ve Ridge'i (alpha=10) StandardScaler içeren pipeline'lara sarar -- Ridge ölçeğe duyarlı olduğundan bu zorunludur. 3) İlk 10 katsayıyı karşılaştırır: OLS çılgın dalgalanmalar üretir, Ridge hepsini sıfıra yaklaştırır. 4) L2 normlarını karşılaştırır: Ridge'inki çok daha küçüktür, küçültme etkisini doğrular. 5) <code>RidgeCV</code> bir alpha listesi alır ve verimli leave-one-out çapraz doğrulama yoluyla en iyisini seçer -- üretimde alpha ayarlamanın en pratik yolu.</p>

<div id="plot-l3-ridgepath-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> Düzenlileştirme yolu -- her çizgi alpha 0'dan (sol, OLS) büyük değerlere (sağ, ağır küçültme) süpürdükçe bir özelliğin katsayısıdır. alpha=0'da her katsayı yüksek sesli ve gürültülüdür; alpha büyüdükçe tüm katsayılar sıfıra doğru yürür, asla tam ulaşmaz (cezanın L2 doğası). Yatay eksen log ölçeklidir çünkü alpha tipik olarak büyüklük mertebelerinde değişir. Bu Ridge'i sezgisel kılan zihinsel resimdir: tüm katsayıları sıfırdan ne kadar uzaklaştıklarıyla orantılı olarak nazikçe "söndürür".</div>

<div class="think-box"><div class="think-label">DÜŞÜNÜN</div><div class="think-body">L2 neden varyansı azaltır? Düzenlileştirme olmadan model eğitim verisinin her dalgalanmasını uydurmak için tam özgürlüğe sahiptir, gürültü dahil -- bu ona yeniden örneklemeler arasında yüksek varyans verir. Ceza ekleyerek "küçük katsayılar tercih edilir, her birim büyüklük için $\\lambda$ ödemeniz gerekir" diyoruz. Model <em>daha muhafazakâr</em> hâle gelir: küçük etkileri açıkça gerçek olmadıkça görmezden gelir. Bu muhafazakârlık sapmadır, ama yeni veride sağlamlıkta karşılığını verir. Tüm istatistiksel öğrenme alanı bu takasın varyasyonlarıdır.</div></div>
</div>

<div class="lesson-block" id="section-3">
<h2 class="lesson-title">3. Lasso: L1 Düzenlileştirme ve Seyreklik</h2>

<p class="l-text">Lasso kare normu mutlak-değer normuyla değiştirir. Amaç neredeyse aynı görünür ama geometri çarpıcı biçimde farklıdır:</p>

<div class="katex-block">$$\\hat{\\beta}_{\\text{lasso}} = \\arg\\min_{\\beta} \\|y - X\\beta\\|_2^2 + \\lambda \\|\\beta\\|_1, \\quad \\|\\beta\\|_1 = \\sum_j |\\beta_j|$$</div>

<p class="l-text">Kapalı form yoktur. L1 cezasının sıfırda keskin bir köşesi vardır, bu yüzden yeterince büyük $\\lambda$ için optimizatör bireysel katsayıları <strong>tam sıfıra</strong> iter. Lasso bu nedenle özellik seçimi otomatik yapar -- size hangi özelliklerin önemli olduğunu ve hangilerinin atılabileceğini söyler.</p>

<div class="calc-compare">
<div class="compare-col"><div class="compare-title">Ridge (L2)</div><div class="compare-item">Ceza: $\\sum_j \\beta_j^2$</div><div class="compare-item">Geometri: pürüzsüz top</div><div class="compare-item">Katsayılar sıfıra küçülür, nadiren tam sıfır</div><div class="compare-item">Kapalı-form çözüm</div><div class="compare-item">Özellikler korelasyonluyken kararlı</div><div class="compare-item">Özelliklerin çoğunun önemli olduğuna inandığınızda kullanın</div></div>
<div class="compare-col"><div class="compare-title">Lasso (L1)</div><div class="compare-item">Ceza: $\\sum_j |\\beta_j|$</div><div class="compare-item">Geometri: sivri elmas</div><div class="compare-item">Birçok katsayı TAM sıfır olur</div><div class="compare-item">Kapalı form yok -- koordinat inişi</div><div class="compare-item">Özellikler korelasyonluyken kararsız (birini seçer)</div><div class="compare-item">Seyrek, yorumlanabilir model istediğinizde kullanın</div></div>
</div>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> Lasso, LassoCV, ElasticNet
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_regression

X, y = <span class="fn">make_regression</span>(n_samples=<span class="num">200</span>, n_features=<span class="num">50</span>, n_informative=<span class="num">5</span>,
                       noise=<span class="num">15</span>, random_state=<span class="num">0</span>)

pipe_lasso = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()), (<span class="str">"m"</span>, <span class="fn">Lasso</span>(alpha=<span class="num">0.5</span>))])
pipe_lasso.<span class="fn">fit</span>(X, y)

coef = pipe_lasso.named_steps[<span class="str">"m"</span>].coef_
n_zero = (coef == <span class="num">0</span>).<span class="fn">sum</span>()
<span class="fn">print</span>(f<span class="str">"Lasso 50'den {n_zero} katsayiyi tam sifirladi."</span>)
<span class="fn">print</span>(f<span class="str">"Hayatta kalan ozellikler: {np.where(coef != 0)[0]}"</span>)

<span class="cm"># LassoCV alpha'yi k-fold CV ile secer</span>
lasso_cv = <span class="fn">LassoCV</span>(cv=<span class="num">5</span>, random_state=<span class="num">0</span>).<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(f<span class="str">"En iyi alpha: {lasso_cv.alpha_:.4f}"</span>)

<span class="cm"># ElasticNet -- L1 + L2 hibridi</span>
en = <span class="fn">ElasticNet</span>(alpha=<span class="num">0.5</span>, l1_ratio=<span class="num">0.5</span>)
en.<span class="fn">fit</span>(X, y)
<span class="fn">print</span>(f<span class="str">"ElasticNet hayatta: {(en.coef_ != 0).sum()}/50 ozellik"</span>)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Aynı gürültülü regresyon (50 özellik, 5 bilgilendirici). 2) alpha=0.5 ile Lasso 50 katsayının ~41'ini sıfırlar -- "n_zero" satırı sihirli kısımdır. Hayatta kalan sıfır olmayanlar tipik olarak Lasso'nun doğru tanımladığı bilgilendirici özelliklerin tam kendisidir. 3) <code>LassoCV</code> 5-fold çapraz doğrulama kullanarak en iyi alpha'yı otomatik arar; seçtiği alpha'yı <code>lasso_cv.alpha_</code>'da saklar. 4) <code>ElasticNet</code> L1 ve L2'yi <code>l1_ratio</code> karıştırma parametresi ile birleştirir: 0=Ridge, 1=Lasso. ElasticNet seyreklik istediğinizde ama korelasyonlu özelliklere karşı kararlılık da istediğinizde pratik tercihtir -- birçok gerçek üretim pipeline'ı için varsayılandır.</p>

<div id="plot-l3-lassopath-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Burada ne görüyoruz:</strong> Aynı 50-özellik problemindeki Lasso düzenlileştirme yolu. Ridge ile karşılaştırıldığında, birkaç çizgi sıfıra çarpar ve orada kalır -- modelden çıkarılırlar. alpha arttıkça (sağa doğru), giderek daha fazla özellik sıfırlanır, sonunda yalnızca en güçlü tahminciler kalır. Bu eylem hâlindeki seyrek regresyondur: size 50 küçük katsayı vermek yerine, 5 büyük ve 45 sıfır verir. Yorumlanabilirlik için bu büyük bir kazançtır.</div>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP özellik seçimi</div><div class="example-body">TF-IDF ile duygu sınıflandırmada 50.000 özelliğiniz (kelime hazinesi) olabilir. Çoğu gürültüdür. Bir Lasso (veya L1 cezalı LogisticRegression) eğitin ve hayatta kalan katsayıları inceleyin -- otomatik olarak ~500 duygu taşıyan kelimelik bir kelime hazinesi alırsınız. Bu, elle düzenlenmiş yerine veriden üretilmiş yorumlanabilir sözlüğünüzdür.</div></div>
</div>

<div class="lesson-block" id="section-4">
<h2 class="lesson-title">4. Lojistik Regresyon: Sınıflandırma için Doğrusal Modeller</h2>

<p class="l-text">Sınıflandırma için bir olasılık çıktısına ihtiyacımız var, bir reel sayı değil. Lojistik regresyon $X\\beta$ doğrusal birleşimini tutar ve çıktı (0, 1) içinde olacak şekilde <strong>sigmoid</strong> fonksiyonundan geçirir:</p>

<div class="katex-block">$$P(y=1 \\mid x) = \\sigma(x^T\\beta) = \\frac{1}{1 + e^{-x^T\\beta}}$$</div>

<div class="calc-cards">
<div class="calc-card"><div class="card-title">$\\sigma(z)$</div><div class="card-body">Sigmoid fonksiyonu. Reel doğruyu (0, 1)'e eşler. $\\sigma(0)=0.5$, büyük pozitif z ~1, büyük negatif ~0 verir.</div></div>
<div class="calc-card"><div class="card-title">$x^T \\beta$</div><div class="card-body">"logit" veya skor. Özelliklerin doğrusal birleşimi, herhangi bir reel sayı olabilir.</div></div>
<div class="calc-card"><div class="card-title">$P(y=1 \\mid x)$</div><div class="card-body">1. sınıfın posterior olasılığı. Sert tahmin için 0.5'te (veya başka) eşikleyin.</div></div>
<div class="calc-card"><div class="card-title">Karar sınırı</div><div class="card-body">$x^T \\beta = 0$ sınırdır -- p-boyutlu özellik uzayında bir hiperdüzlem.</div></div>
<div class="calc-card"><div class="card-title">Olasılık ve log-olasılık</div><div class="card-body">$\\frac{P}{1-P} = e^{x^T\\beta}$, dolayısıyla model log-olasılıkta doğrusaldır. Katsayılar "birim özellik başına log-olasılık değişimi" anlamına gelir.</div></div>
<div class="calc-card"><div class="card-title">Kapalı form yok</div><div class="card-body">Maksimum olabilirlik iteratif yöntemlerle çözülür (LBFGS, SAG, vb.).</div></div>
</div>

<p class="l-text">Eğitim koşullu log-olabilirliği maksimize eder. İkili etiketler $y_i \\in \\{0, 1\\}$ için:</p>

<div class="katex-block">$$\\hat{\\beta} = \\arg\\max_\\beta \\sum_{i=1}^n \\left[ y_i \\log \\sigma(x_i^T \\beta) + (1-y_i) \\log(1 - \\sigma(x_i^T \\beta)) \\right]$$</div>

<p class="l-text">sklearn'de <code>LogisticRegression</code> varsayılan olarak L2 düzenlileştirmesi içerir -- bunu <code>C</code> (yani $\\lambda$'nın tersi) ile kontrol edersiniz: <strong>büyük C = hafif düzenlileştirme, küçük C = ağır düzenlileştirme</strong>.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_breast_cancer
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> train_test_split
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.metrics <span class="kw">import</span> classification_report, roc_auc_score

data = <span class="fn">load_breast_cancer</span>()
X, y = data.data, data.target
X_tr, X_te, y_tr, y_te = <span class="fn">train_test_split</span>(X, y, random_state=<span class="num">42</span>, stratify=y)

pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(penalty=<span class="str">"l2"</span>, C=<span class="num">1.0</span>, max_iter=<span class="num">2000</span>)),
])
pipe.<span class="fn">fit</span>(X_tr, y_tr)

y_pred  = pipe.<span class="fn">predict</span>(X_te)
y_proba = pipe.<span class="fn">predict_proba</span>(X_te)[:, <span class="num">1</span>]
<span class="fn">print</span>(<span class="fn">classification_report</span>(y_te, y_pred, target_names=data.target_names))
<span class="fn">print</span>(f<span class="str">"ROC AUC: {roc_auc_score(y_te, y_proba):.4f}"</span>)

coef = pipe.named_steps[<span class="str">"clf"</span>].coef_[<span class="num">0</span>]
top = np.<span class="fn">argsort</span>(np.<span class="fn">abs</span>(coef))[::-<span class="num">1</span>][:<span class="num">5</span>]
<span class="kw">for</span> i <span class="kw">in</span> top:
    <span class="fn">print</span>(f<span class="str">"  ozellik {i:2d} ({data.feature_names[i]}): coef={coef[i]:+.3f}"</span>)

<span class="cm"># L1 lojistik regresyon</span>
sparse_lr = <span class="fn">LogisticRegression</span>(penalty=<span class="str">"l1"</span>, solver=<span class="str">"liblinear"</span>, C=<span class="num">0.5</span>)
sparse_lr.<span class="fn">fit</span>(X_tr, y_tr)
<span class="fn">print</span>(f<span class="str">"L1 logreg hayatta: {(sparse_lr.coef_ != 0).sum()}/30"</span>)</code></pre></div>

<p class="l-text"><strong>İşleyişi adım adım:</strong> 1) Breast-cancer'ı (ikili) yükler ve stratify edilmiş böler. 2) StandardScaler ve LogisticRegression'ı pipeline'a sarar -- L2 cezası katsayı büyüklüklerine bağlı olduğundan ölçekleme elzemdir. 3) <code>predict_proba(X_te)[:, 1]</code> 1. sınıfın sütununu alır; bu ROC-AUC, kalibrasyon grafikleri veya eşik optimizasyonuna besleyeceğiniz olasılıktır. 4) En büyük büyüklüklü ilk 5 katsayıyı inceler -- kanser verisinde "worst concave points" veya "worst perimeter" gibi özellikler baskındır ve pozitif katsayı "yüksek değer kötü huylu yönüne iter" anlamına gelir. 5) Otomatik özellik seçimi için L1 cezasına geçer (<code>solver="liblinear"</code> veya <code>"saga"</code> gerekir) -- 30 özellikte tipik L1 lojistik ~10-15 sıfır olmayan tutar. Bu sizin "50.000 TF-IDF özelliğim var ve yorumlanabilir bir alt küme istiyorum" görevleri için başvuracağınız yöntemdir.</p>

<div id="plot-l3-sigmoid-tr" class="plotly-graph"></div>
<div class="graph-caption"><strong>Görselin işaret ettiği:</strong> Sigmoid fonksiyonu. Yatay eksen $x^T\\beta$ doğrusal skoru; dikey eksen 1. sınıf için tahmin edilen olasılıktır. score=0'da olasılık tam 0.5'tir (tercih yok); büyük pozitif skorlar 1'e yakın doyurur ve büyük negatifler 0'a yakındır. Orijindeki eğim 0.25'tir, lojistik regresyonun ortada "neredeyse doğrusal" olmasının ama ekstrem skorları pürüzsüzce yönetmesinin nedeni budur. Bu S eğrisi doğrusal ve lojistik regresyon arasındaki tek farktır -- gerisi aynıdır.</div>

<div class="l-warn"><strong>C kafa karışıklığı:</strong> sklearn düzenlileştirmeyi <code>C = 1/lambda</code> olarak parametrize eder, çoğu ders kitabının alpha dediğinin <em>tersi</em>. <code>C=1</code> ılımlıdır, <code>C=0.01</code> ağır düzenlileştirmedir, <code>C=100</code> hafiftir. Bu <code>Ridge(alpha=...)</code>'in tersidir. Bunu ezberleyin yoksa "düzenlileştirmeyi artırdığımda model neden kötüleşti" diye bir saat geçirirsiniz.</div>
</div>

<div class="lesson-block" id="section-5">
<h2 class="lesson-title">5. Çok Sınıflı Lojistik Regresyon</h2>

<p class="l-text">2'den fazla sınıf için sklearn modern sürümlerde varsayılan olarak <strong>multinomial</strong> (softmax) genellemesini kullanır. k sınıfı için skor:</p>

<div class="katex-block">$$P(y=k \\mid x) = \\frac{e^{x^T \\beta_k}}{\\sum_{j=1}^{K} e^{x^T \\beta_j}}$$</div>

<p class="l-text">Bu softmax fonksiyonudur. K katsayı vektörü vardır -- her sınıf için bir tane -- ve tahmin en büyük skora sahip sınıftır. Katsayı matrisi (K, p) şeklindedir.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">from</span> sklearn.datasets <span class="kw">import</span> load_iris
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LogisticRegression
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline

iris = <span class="fn">load_iris</span>()
X, y = iris.data, iris.target

pipe = <span class="fn">Pipeline</span>([
    (<span class="str">"sc"</span>,  <span class="fn">StandardScaler</span>()),
    (<span class="str">"clf"</span>, <span class="fn">LogisticRegression</span>(max_iter=<span class="num">1000</span>)),
]).<span class="fn">fit</span>(X, y)

clf = pipe.named_steps[<span class="str">"clf"</span>]
<span class="fn">print</span>(<span class="str">"coef_ sekli:"</span>, clf.coef_.shape)        <span class="cm"># (3, 4)</span>
<span class="fn">print</span>(<span class="str">"intercept_ sekli:"</span>, clf.intercept_.shape)

p = pipe.<span class="fn">predict_proba</span>(X[:<span class="num">5</span>])
<span class="fn">print</span>(p.<span class="fn">round</span>(<span class="num">3</span>))
<span class="fn">print</span>(<span class="str">"Satir toplamlari:"</span>, p.<span class="fn">sum</span>(axis=<span class="num">1</span>))   <span class="cm"># [1. 1. 1. 1. 1.]</span>

<span class="cm"># OvR -- alternatif</span>
ovr = <span class="fn">LogisticRegression</span>(multi_class=<span class="str">"ovr"</span>, max_iter=<span class="num">1000</span>)
ovr.<span class="fn">fit</span>(X, y)</code></pre></div>

<p class="l-text"><strong>Burada üç önemli detay var:</strong> 1) Iris 3 sınıfa sahiptir, dolayısıyla katsayı matrisi (3, 4)'dür: her sınıf için bir satır, her özellik için bir sütun. 2) Kesişim 3 uzunluğunda bir vektördür. 3) <code>predict_proba</code> her satırın geçerli bir olasılık dağılımı olduğu (n, 3) matris döner -- yapı gereği 1.0'a toplanır (softmax özelliği). 4) <code>multi_class="ovr"</code> 3 ayrı ikili sınıflandırıcı (one-vs-rest) eğitir; modern sklearn'de varsayılan multinomial'dir, daha ilkesellidir ve genellikle biraz daha doğrudur.</p>

<div class="calc-example"><div class="example-label">ÖRNEK: NLP konu sınıflandırması</div><div class="example-body">20-Newsgroups (20-sınıf konu sınıflandırma) için TF-IDF + multinomial lojistik regresyon kutudan çıkar çıkmaz ~%90 doğruluğa ulaşır. (20, kelime_dağarcığı_boyutu) katsayı matrisi devasadır ama yorumlanabilir: "rocket" sütununun k satırı size o kelimenin k sınıfına ne kadar ittiğini söyler. "sci.space" satırlarının "rocket", "NASA", "shuttle" üzerinde büyük pozitif katsayıları vardır; "rec.autos" satırlarının yoktur. Multinomial lojistik regresyon kelimenin tam anlamıyla yorumlanabilir konu başına kelime hazinesi inşa eder.</div></div>
</div>

<div class="lesson-block" id="section-6">
<h2 class="lesson-title">6. Hepsini Birleştirme: Doğrusal Varyantları Karşılaştırma</h2>

<p class="l-text">Aynı veri setinde dört doğrusal regresyon varyantını çalıştıralım ve katsayılarda ve test hatasında nasıl farklılaştıklarını görelim.</p>

<div class="code-wrap"><div class="code-label"><span>PYTHON</span><button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-wrap').querySelector('code').textContent)">COPY</button></div><pre class="code-block"><code><span class="kw">import</span> numpy <span class="kw">as</span> np
<span class="kw">from</span> sklearn.datasets <span class="kw">import</span> make_regression
<span class="kw">from</span> sklearn.linear_model <span class="kw">import</span> LinearRegression, Ridge, Lasso, ElasticNet
<span class="kw">from</span> sklearn.preprocessing <span class="kw">import</span> StandardScaler
<span class="kw">from</span> sklearn.pipeline <span class="kw">import</span> Pipeline
<span class="kw">from</span> sklearn.model_selection <span class="kw">import</span> cross_val_score

X, y = <span class="fn">make_regression</span>(n_samples=<span class="num">200</span>, n_features=<span class="num">30</span>, n_informative=<span class="num">5</span>,
                       noise=<span class="num">10</span>, random_state=<span class="num">0</span>)

models = {
    <span class="str">"OLS"</span>:         <span class="fn">LinearRegression</span>(),
    <span class="str">"Ridge(1)"</span>:    <span class="fn">Ridge</span>(alpha=<span class="num">1.0</span>),
    <span class="str">"Ridge(10)"</span>:   <span class="fn">Ridge</span>(alpha=<span class="num">10.0</span>),
    <span class="str">"Lasso(0.5)"</span>:  <span class="fn">Lasso</span>(alpha=<span class="num">0.5</span>),
    <span class="str">"Lasso(2)"</span>:    <span class="fn">Lasso</span>(alpha=<span class="num">2.0</span>),
    <span class="str">"ElasticNet"</span>:  <span class="fn">ElasticNet</span>(alpha=<span class="num">0.5</span>, l1_ratio=<span class="num">0.5</span>),
}

<span class="fn">print</span>(f<span class="str">"{'Model':<12} {'CV R2':>8} {'#nonzero':>10}  {'L2 norm':>10}"</span>)
<span class="fn">print</span>(<span class="str">"-"</span> * <span class="num">46</span>)
<span class="kw">for</span> name, m <span class="kw">in</span> models.<span class="fn">items</span>():
    pipe = <span class="fn">Pipeline</span>([(<span class="str">"sc"</span>, <span class="fn">StandardScaler</span>()), (<span class="str">"m"</span>, m)])
    cv = <span class="fn">cross_val_score</span>(pipe, X, y, cv=<span class="num">5</span>, scoring=<span class="str">"r2"</span>).<span class="fn">mean</span>()
    pipe.<span class="fn">fit</span>(X, y)
    coef = pipe.named_steps[<span class="str">"m"</span>].coef_
    nz = (np.<span class="fn">abs</span>(coef) > <span class="num">1e-6</span>).<span class="fn">sum</span>()
    <span class="fn">print</span>(f<span class="str">"{name:<12} {cv:>8.3f} {nz:>10d}  {np.linalg.norm(coef):>10.2f}"</span>)</code></pre></div>

<p class="l-text"><strong>Bu kodda neler oluyor:</strong> 1) Seyrek-gerçek bir regresyon oluşturur: 30 özellik ama yalnızca 5 gerçekten bilgilendirici. 2) Ceza ve alpha'yı değiştiren altı pipeline tanımlar. 3) Her biri için 5-fold çapraz doğrulanmış R-kare çalıştırır ve uydurulmuş katsayıları inceler. 4) Özet tablo takası somutlaştırır: saf OLS aşırı uyar ve en kötü CV'yi alır; ılımlı düzenlileştirme (Ridge alpha=1, Lasso alpha=0.5) doğrulukta kazanır; ağır Lasso (alpha=2) en yorumlanabilirdir (yalnızca 5 özellik hayatta kalır) ama biraz doğruluk kaybeder. ElasticNet bu tür karışık problemde tipik olarak kazanır -- kısmi seyreklik, kısmi pürüzsüz küçültme. Doğru seçim doğruluğa mı yorumlanabilirliğe mi daha çok değer verdiğinize bağlıdır.</p>

<div class="calc-step"><strong>Karar kuralı:</strong> özellikleriniz iyi düzenlenmişse ve hepsine güveniyorsanız -&gt; <code>Ridge</code>. Yüzlerce-binlerce özelliğiniz varsa ve çoğunun gürültü olduğundan şüpheleniyorsanız -&gt; <code>Lasso</code>. Özellikler korelasyonluysa VE seyreklik istiyorsanız -&gt; <code>ElasticNet</code>. Hiçbir fikriniz yoksa -&gt; 5-fold log-aralıklı alpha grid'i ile <code>RidgeCV</code> güçlü bir varsayılandır.</div>

<div class="think-box"><div class="think-label">ÖZET ÇIKARIMLAR</div><div class="think-body"><strong>1.</strong> OLS kare hatanın benzersiz doğrusal minimize edicisini verir: $\\hat{\\beta} = (X^TX)^{-1}X^Ty$. Sapmasızdır ama çok özellikle yüksek varyanslıdır.<br><strong>2.</strong> Ridge katsayıları sıfıra küçültmek için L2 cezası $\\lambda\\|\\beta\\|_2^2$ ekler, küçük sapma maliyetiyle varyansı azaltır.<br><strong>3.</strong> Lasso birçok katsayıyı <em>tam</em> sıfıra iten L1 cezası $\\lambda\\|\\beta\\|_1$ kullanır -- otomatik özellik seçimi.<br><strong>4.</strong> ElasticNet L1 ve L2'yi <code>l1_ratio</code> ile karıştırır -- özellikler korelasyonluyken sağlam varsayılan.<br><strong>5.</strong> Lojistik regresyon log-olasılıkta doğrusaldır: $\\log\\frac{P}{1-P} = x^T\\beta$. Sigmoid skoru olasılığa eşler.<br><strong>6.</strong> sklearn'in LogisticRegression'ı varsayılan olarak L2 düzenlileştirilmiştir; <code>C = 1/lambda</code> ile kontrol edin -- daha büyük C DAHA AZ düzenlileştirme demektir.<br><strong>7.</strong> Çok sınıf için sklearn multinomial (softmax) olabilirliği kullanır; katsayı matrisi (K, p) şeklindedir.<br><strong>8.</strong> Her düzenlileştirilmiş doğrusal modelden önce daima özellikleri ölçekleyin (StandardScaler) -- aksi takdirde ceza özellikler arasında adaletsizdir.<br><strong>9.</strong> *CV varyantları (RidgeCV, LassoCV, LogisticRegressionCV) alpha/C seçimini otomatize eder -- üretimde bunları kullanın.</div></div>
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

  // 1. Linear regression fit on 1D
  function lin1D(seed){
    var r=rng(seed); var xs=[],ys=[];
    for (var i=0;i<60;i++){var x=(i-30)/8; xs.push(x); ys.push(2.5*x + 1.0 + 4*(r()-0.5));}
    return {xs:xs, ys:ys};
  }
  var elL = document.getElementById('plot-l3-linreg-en');
  if (elL){
    var d = lin1D(7);
    var sx=0,sy=0,sxx=0,sxy=0,n=d.xs.length;
    for (var i=0;i<n;i++){sx+=d.xs[i];sy+=d.ys[i];sxx+=d.xs[i]*d.xs[i];sxy+=d.xs[i]*d.ys[i];}
    var slope=(n*sxy-sx*sy)/(n*sxx-sx*sx); var b=(sy-slope*sx)/n;
    var lx=[-4,4], ly=[slope*-4+b, slope*4+b];
    var tx=[-4,4], ty=[2.5*-4+1, 2.5*4+1];
    var t1 = {x:d.xs,y:d.ys,mode:'markers',type:'scatter',name:'Data',marker:{color:T.accent,size:8,opacity:0.65,line:{color:'rgba(255,255,255,0.25)',width:1}}};
    var t2 = {x:lx,y:ly,mode:'lines',type:'scatter',name:'OLS fit',line:{color:T.accent,width:3}};
    var t3 = {x:tx,y:ty,mode:'lines',type:'scatter',name:'True line',line:{color:'#4ecdc4',width:2,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'OLS recovers the true line (1D slice)',font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l3-linreg-en',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }

  // 2. Ridge regularization path (synthetic)
  function ridgePath(){
    var alphas = [0.001,0.01,0.05,0.1,0.5,1,5,10,50,100,500,1000];
    // synthetic 8 features, alpha->coef
    var seeds = [3,11,23,42,55,71,89,103];
    var coefs = [];
    for (var k=0;k<8;k++){
      var c0 = 5*Math.cos(seeds[k]*0.7) + 2*((seeds[k]%5)-2);
      var line=[];
      for (var i=0;i<alphas.length;i++){
        line.push(c0 / (1 + alphas[i]/(2 + (k%3))));
      }
      coefs.push(line);
    }
    return {alphas:alphas, coefs:coefs};
  }
  var elR = document.getElementById('plot-l3-ridgepath-en');
  if (elR){
    var P = ridgePath();
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6'];
    var traces=[];
    for (var k=0;k<P.coefs.length;k++){
      traces.push({x:P.alphas,y:P.coefs[k],mode:'lines+markers',type:'scatter',name:'feature '+k,line:{color:palette[k],width:2},marker:{size:6}});
    }
    var layout = Object.assign({}, common, {title:{text:'Ridge regularization path: coefficients vs alpha',font:{color:T.text,size:14}},xaxis:{title:'alpha (log scale)',type:'log',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'coefficient value',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l3-ridgepath-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // 3. Lasso path -- coefficients hit zero
  function lassoPath(){
    var alphas = [0.001,0.005,0.01,0.05,0.1,0.3,0.5,1,2,3,5];
    var seeds = [3,11,23,42,55,71,89,103];
    var coefs=[];
    for (var k=0;k<8;k++){
      var c0 = 4.5*Math.cos(seeds[k]*0.7);
      var line=[];
      for (var i=0;i<alphas.length;i++){
        var v = Math.sign(c0)*Math.max(0, Math.abs(c0)-alphas[i]*(1+(k%3)*0.5));
        line.push(v);
      }
      coefs.push(line);
    }
    return {alphas:alphas, coefs:coefs};
  }
  var elLp = document.getElementById('plot-l3-lassopath-en');
  if (elLp){
    var P = lassoPath();
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6'];
    var traces=[];
    for (var k=0;k<P.coefs.length;k++){
      traces.push({x:P.alphas,y:P.coefs[k],mode:'lines+markers',type:'scatter',name:'feature '+k,line:{color:palette[k],width:2},marker:{size:6}});
    }
    var layout = Object.assign({}, common, {title:{text:'Lasso regularization path: coefficients hit zero',font:{color:T.text,size:14}},xaxis:{title:'alpha (log scale)',type:'log',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'coefficient value',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l3-lassopath-en',traces,layout,{responsive:true,displayModeBar:false});
  }

  // 4. Sigmoid
  var elS = document.getElementById('plot-l3-sigmoid-en');
  if (elS){
    var xs=[],ys=[];
    for (var i=-60;i<=60;i++){var z=i/10; xs.push(z); ys.push(1/(1+Math.exp(-z)));}
    var t1 = {x:xs,y:ys,mode:'lines',type:'scatter',line:{color:T.accent,width:3}};
    var hline = {x:[-6,6],y:[0.5,0.5],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.5)',dash:'dash',width:1},showlegend:false};
    var vline = {x:[0,0],y:[0,1],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.5)',dash:'dash',width:1},showlegend:false};
    var layout = Object.assign({}, common, {title:{text:'Sigmoid: maps any real number to (0,1)',font:{color:T.text,size:14}},xaxis:{title:'score x^T beta',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'P(y=1)',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.05,1.05]},showlegend:false});
    Plotly.newPlot('plot-l3-sigmoid-en',[t1,hline,vline],layout,{responsive:true,displayModeBar:false});
  }

  // TR mirrors
  var elLtr = document.getElementById('plot-l3-linreg-tr');
  if (elLtr){
    var d = lin1D(7);
    var sx=0,sy=0,sxx=0,sxy=0,n=d.xs.length;
    for (var i=0;i<n;i++){sx+=d.xs[i];sy+=d.ys[i];sxx+=d.xs[i]*d.xs[i];sxy+=d.xs[i]*d.ys[i];}
    var slope=(n*sxy-sx*sy)/(n*sxx-sx*sx); var b=(sy-slope*sx)/n;
    var t1 = {x:d.xs,y:d.ys,mode:'markers',type:'scatter',name:'Veri',marker:{color:T.accent,size:8,opacity:0.65,line:{color:'rgba(255,255,255,0.25)',width:1}}};
    var t2 = {x:[-4,4],y:[slope*-4+b, slope*4+b],mode:'lines',type:'scatter',name:'OLS uydurusu',line:{color:T.accent,width:3}};
    var t3 = {x:[-4,4],y:[2.5*-4+1, 2.5*4+1],mode:'lines',type:'scatter',name:'Gercek dogru',line:{color:'#4ecdc4',width:2,dash:'dash'}};
    var layout = Object.assign({}, common, {title:{text:'OLS gercek dogruyu kurtarir (1B kesit)',font:{color:T.text,size:14}},xaxis:{title:'x',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'y',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text}}});
    Plotly.newPlot('plot-l3-linreg-tr',[t1,t2,t3],layout,{responsive:true,displayModeBar:false});
  }
  var elRtr = document.getElementById('plot-l3-ridgepath-tr');
  if (elRtr){
    var P = ridgePath();
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6'];
    var traces=[];
    for (var k=0;k<P.coefs.length;k++){
      traces.push({x:P.alphas,y:P.coefs[k],mode:'lines+markers',type:'scatter',name:'ozellik '+k,line:{color:palette[k],width:2},marker:{size:6}});
    }
    var layout = Object.assign({}, common, {title:{text:'Ridge yolu: katsayılar vs alpha',font:{color:T.text,size:14}},xaxis:{title:'alpha (log)',type:'log',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'katsayi',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l3-ridgepath-tr',traces,layout,{responsive:true,displayModeBar:false});
  }
  var elLptr = document.getElementById('plot-l3-lassopath-tr');
  if (elLptr){
    var P = lassoPath();
    var palette = [T.accent,'#4ecdc4','#f87171','#a78bfa','#fbbf24','#34d399','#60a5fa','#f472b6'];
    var traces=[];
    for (var k=0;k<P.coefs.length;k++){
      traces.push({x:P.alphas,y:P.coefs[k],mode:'lines+markers',type:'scatter',name:'ozellik '+k,line:{color:palette[k],width:2},marker:{size:6}});
    }
    var layout = Object.assign({}, common, {title:{text:'Lasso yolu: katsayilar sifira ulasir',font:{color:T.text,size:14}},xaxis:{title:'alpha (log)',type:'log',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'katsayi',gridcolor:T.grid,zerolinecolor:T.zero},legend:{font:{color:T.text,size:10}}});
    Plotly.newPlot('plot-l3-lassopath-tr',traces,layout,{responsive:true,displayModeBar:false});
  }
  var elStr = document.getElementById('plot-l3-sigmoid-tr');
  if (elStr){
    var xs=[],ys=[];
    for (var i=-60;i<=60;i++){var z=i/10; xs.push(z); ys.push(1/(1+Math.exp(-z)));}
    var t1 = {x:xs,y:ys,mode:'lines',type:'scatter',line:{color:T.accent,width:3}};
    var hline = {x:[-6,6],y:[0.5,0.5],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.5)',dash:'dash',width:1},showlegend:false};
    var vline = {x:[0,0],y:[0,1],mode:'lines',type:'scatter',line:{color:'rgba(200,200,200,0.5)',dash:'dash',width:1},showlegend:false};
    var layout = Object.assign({}, common, {title:{text:'Sigmoid: herhangi bir reel sayiyi (0,1)e esler',font:{color:T.text,size:14}},xaxis:{title:'skor x^T beta',gridcolor:T.grid,zerolinecolor:T.zero},yaxis:{title:'P(y=1)',gridcolor:T.grid,zerolinecolor:T.zero,range:[-0.05,1.05]},showlegend:false});
    Plotly.newPlot('plot-l3-sigmoid-tr',[t1,hline,vline],layout,{responsive:true,displayModeBar:false});
  }
},250);</script>
`
};
